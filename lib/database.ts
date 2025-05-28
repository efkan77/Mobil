import Database from "better-sqlite3"
import path from "path"
import fs from "fs"

// Veritabanı dosyası yolu
const DB_PATH = path.join(process.cwd(), "data", "efegida.db")

// Data klasörünü oluştur
const dataDir = path.dirname(DB_PATH)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Veritabanı bağlantısı
const db = new Database(DB_PATH)

// Veritabanı tablolarını oluştur
export function initializeDatabase() {
  // Müşteriler tablosu
  db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      address TEXT,
      username TEXT UNIQUE,
      password TEXT,
      customer_type TEXT DEFAULT 'regular', -- regular, vip, wholesale
      credit_limit REAL DEFAULT 0,
      total_purchases REAL DEFAULT 0,
      total_profit_generated REAL DEFAULT 0,
      last_purchase_date DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Ürün kategorileri tablosu
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      parent_id INTEGER,
      total_profit REAL DEFAULT 0,
      total_sales REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_id) REFERENCES categories (id)
    )
  `)

  // Ürünler tablosu
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category_id INTEGER,
      price REAL NOT NULL,
      cost_price REAL,
      stock INTEGER DEFAULT 0,
      min_stock INTEGER DEFAULT 5,
      barcode TEXT,
      description TEXT,
      total_sold INTEGER DEFAULT 0,
      total_revenue REAL DEFAULT 0,
      total_profit REAL DEFAULT 0,
      profit_margin REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories (id)
    )
  `)

  // Gider kategorileri tablosu
  db.exec(`
    CREATE TABLE IF NOT EXISTS expense_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      is_fixed BOOLEAN DEFAULT 0, -- Sabit gider mi?
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Giderler tablosu
  db.exec(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      expense_date DATE NOT NULL,
      is_recurring BOOLEAN DEFAULT 0,
      recurring_period TEXT, -- monthly, yearly
      receipt_number TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES expense_categories (id)
    )
  `)

  // Satışlar tablosu
  db.exec(`
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER,
      total_amount REAL NOT NULL,
      total_cost REAL DEFAULT 0,
      gross_profit REAL DEFAULT 0,
      profit_margin REAL DEFAULT 0,
      payment_type TEXT NOT NULL,
      notes TEXT,
      invoice_template TEXT DEFAULT 'default',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers (id)
    )
  `)

  // Satış detayları tablosu
  db.exec(`
    CREATE TABLE IF NOT EXISTS sale_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sale_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      unit_cost REAL DEFAULT 0,
      total_price REAL NOT NULL,
      total_cost REAL DEFAULT 0,
      gross_profit REAL DEFAULT 0,
      profit_margin REAL DEFAULT 0,
      FOREIGN KEY (sale_id) REFERENCES sales (id),
      FOREIGN KEY (product_id) REFERENCES products (id)
    )
  `)

  // Kredi kartları tablosu
  db.exec(`
    CREATE TABLE IF NOT EXISTS credit_cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      card_name TEXT NOT NULL,
      bank_name TEXT NOT NULL,
      card_number TEXT, -- Son 4 hane
      credit_limit REAL NOT NULL,
      current_debt REAL DEFAULT 0,
      available_limit REAL,
      statement_date INTEGER, -- Ayın kaçı
      due_date INTEGER, -- Ayın kaçı
      minimum_payment REAL DEFAULT 0,
      status TEXT DEFAULT 'active', -- active, blocked, expired
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Kredi kartı hareketleri tablosu
  db.exec(`
    CREATE TABLE IF NOT EXISTS card_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      card_id INTEGER NOT NULL,
      sale_id INTEGER,
      transaction_type TEXT NOT NULL, -- purchase, payment, fee
      amount REAL NOT NULL,
      description TEXT,
      transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (card_id) REFERENCES credit_cards (id),
      FOREIGN KEY (sale_id) REFERENCES sales (id)
    )
  `)

  // Fatura şablonları tablosu
  db.exec(`
    CREATE TABLE IF NOT EXISTS invoice_templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      header_text TEXT,
      footer_text TEXT,
      logo_position TEXT DEFAULT 'left', -- left, center, right
      show_logo BOOLEAN DEFAULT 1,
      show_company_info BOOLEAN DEFAULT 1,
      show_customer_info BOOLEAN DEFAULT 1,
      font_size INTEGER DEFAULT 12,
      font_family TEXT DEFAULT 'Arial',
      color_scheme TEXT DEFAULT 'blue',
      template_data TEXT, -- JSON
      is_default BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Personel tablosu
  db.exec(`
    CREATE TABLE IF NOT EXISTS staff (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      permissions TEXT, -- JSON string
      status TEXT DEFAULT 'active',
      last_login DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Sistem ayarları tablosu
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Varsayılan kategorileri ekle
  const categoryCount = db.prepare("SELECT COUNT(*) as count FROM categories").get() as any
  if (categoryCount.count === 0) {
    const categories = [
      "Telefon & Tablet",
      "Bilgisayar & Laptop",
      "Ses & Görüntü",
      "Oyun & Konsol",
      "Aksesuarlar",
      "Beyaz Eşya",
      "Küçük Ev Aletleri",
    ]

    const stmt = db.prepare("INSERT INTO categories (name) VALUES (?)")
    categories.forEach((cat) => stmt.run(cat))
  }

  // Varsayılan gider kategorilerini ekle
  const expenseCategoryCount = db.prepare("SELECT COUNT(*) as count FROM expense_categories").get() as any
  if (expenseCategoryCount.count === 0) {
    const expenseCategories = [
      { name: "Kira", description: "Mağaza kirası", is_fixed: 1 },
      { name: "Personel Maaşları", description: "Çalışan maaşları", is_fixed: 1 },
      { name: "Elektrik", description: "Elektrik faturası", is_fixed: 0 },
      { name: "Su", description: "Su faturası", is_fixed: 0 },
      { name: "İnternet", description: "İnternet faturası", is_fixed: 1 },
      { name: "Telefon", description: "Telefon faturası", is_fixed: 1 },
      { name: "Ürün Alımı", description: "Stok alımları", is_fixed: 0 },
      { name: "Pazarlama", description: "Reklam ve pazarlama", is_fixed: 0 },
      { name: "Nakliye", description: "Kargo ve nakliye", is_fixed: 0 },
      { name: "Vergi", description: "Vergiler", is_fixed: 0 },
      { name: "Sigorta", description: "Sigorta ödemeleri", is_fixed: 1 },
      { name: "Bakım-Onarım", description: "Bakım ve onarım", is_fixed: 0 },
      { name: "Diğer", description: "Diğer giderler", is_fixed: 0 },
    ]

    const stmt = db.prepare("INSERT INTO expense_categories (name, description, is_fixed) VALUES (?, ?, ?)")
    expenseCategories.forEach((cat) => stmt.run(cat.name, cat.description, cat.is_fixed))
  }

  // Varsayılan fatura şablonu ekle
  const templateCount = db.prepare("SELECT COUNT(*) as count FROM invoice_templates").get() as any
  if (templateCount.count === 0) {
    db.prepare(`
      INSERT INTO invoice_templates (name, header_text, footer_text, is_default)
      VALUES (?, ?, ?, ?)
    `).run(
      "Varsayılan Şablon",
      "EFE GIDA TOPTAN - KALİTELİ HİZMET",
      "Teşekkür ederiz! • www.efegida.com • 0212 555 01 23",
      1,
    )
  }

  // Varsayılan admin kullanıcısını ekle
  const adminExists = db.prepare("SELECT COUNT(*) as count FROM staff WHERE username = ?").get("poyraz02") as any
  if (adminExists.count === 0) {
    db.prepare(`
      INSERT INTO staff (name, username, password, role, permissions, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run("Admin", "poyraz02", "eliz02", "Sistem Yöneticisi", JSON.stringify(["all"]), "active")
  }

  console.log("✅ Veritabanı başarıyla oluşturuldu: efegida.db")
}

// Gider işlemleri
export const expenseQueries = {
  getAll: () => {
    return db
      .prepare(`
      SELECT e.*, ec.name as category_name, ec.is_fixed
      FROM expenses e
      JOIN expense_categories ec ON e.category_id = ec.id
      ORDER BY e.expense_date DESC
    `)
      .all()
  },

  getByDateRange: (startDate: string, endDate: string) => {
    return db
      .prepare(`
      SELECT e.*, ec.name as category_name, ec.is_fixed
      FROM expenses e
      JOIN expense_categories ec ON e.category_id = ec.id
      WHERE DATE(e.expense_date) BETWEEN ? AND ?
      ORDER BY e.expense_date DESC
    `)
      .all(startDate, endDate)
  },

  getTotalByCategory: (startDate: string, endDate: string) => {
    return db
      .prepare(`
      SELECT 
        ec.name as category_name,
        ec.is_fixed,
        SUM(e.amount) as total_amount,
        COUNT(e.id) as expense_count
      FROM expenses e
      JOIN expense_categories ec ON e.category_id = ec.id
      WHERE DATE(e.expense_date) BETWEEN ? AND ?
      GROUP BY ec.id, ec.name, ec.is_fixed
      ORDER BY total_amount DESC
    `)
      .all(startDate, endDate)
  },

  create: (expense: any) => {
    const stmt = db.prepare(`
      INSERT INTO expenses (category_id, description, amount, expense_date, is_recurring, recurring_period, receipt_number, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    return stmt.run(
      expense.category_id,
      expense.description,
      expense.amount,
      expense.expense_date,
      expense.is_recurring,
      expense.recurring_period,
      expense.receipt_number,
      expense.notes,
    )
  },
}

// Gider kategorileri işlemleri
export const expenseCategoryQueries = {
  getAll: () => db.prepare("SELECT * FROM expense_categories ORDER BY name").all(),
  create: (name: string, description: string, isFixed: boolean) => {
    const stmt = db.prepare("INSERT INTO expense_categories (name, description, is_fixed) VALUES (?, ?, ?)")
    return stmt.run(name, description, isFixed)
  },
}

// Kar-zarar analiz işlemleri
export const profitLossQueries = {
  // Günlük kar-zarar
  getDailyProfitLoss: (startDate: string, endDate: string) => {
    return db
      .prepare(`
      SELECT 
        DATE(created_at) as date,
        SUM(total_amount) as revenue,
        SUM(total_cost) as cost_of_goods,
        SUM(gross_profit) as gross_profit,
        COUNT(*) as sales_count,
        AVG(profit_margin) as avg_margin
      FROM sales 
      WHERE DATE(created_at) BETWEEN ? AND ?
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `)
      .all(startDate, endDate)
  },

  // Aylık kar-zarar
  getMonthlyProfitLoss: (year: number) => {
    return db
      .prepare(`
      SELECT 
        strftime('%Y-%m', created_at) as month,
        SUM(total_amount) as revenue,
        SUM(total_cost) as cost_of_goods,
        SUM(gross_profit) as gross_profit,
        COUNT(*) as sales_count,
        AVG(profit_margin) as avg_margin
      FROM sales 
      WHERE strftime('%Y', created_at) = ?
      GROUP BY strftime('%Y-%m', created_at)
      ORDER BY month DESC
    `)
      .all(year.toString())
  },

  // Ürün bazında kar analizi
  getProductProfitAnalysis: (startDate: string, endDate: string) => {
    return db
      .prepare(`
      SELECT 
        p.name as product_name,
        p.category_id,
        c.name as category_name,
        SUM(si.quantity) as total_sold,
        SUM(si.total_price) as total_revenue,
        SUM(si.total_cost) as total_cost,
        SUM(si.gross_profit) as total_profit,
        AVG(si.profit_margin) as avg_margin,
        (SUM(si.gross_profit) / SUM(si.total_price) * 100) as profit_percentage
      FROM sale_items si
      JOIN products p ON si.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      JOIN sales s ON si.sale_id = s.id
      WHERE DATE(s.created_at) BETWEEN ? AND ?
      GROUP BY p.id, p.name
      ORDER BY total_profit DESC
    `)
      .all(startDate, endDate)
  },

  // Kategori bazında kar analizi
  getCategoryProfitAnalysis: (startDate: string, endDate: string) => {
    return db
      .prepare(`
      SELECT 
        c.name as category_name,
        COUNT(DISTINCT p.id) as product_count,
        SUM(si.quantity) as total_sold,
        SUM(si.total_price) as total_revenue,
        SUM(si.total_cost) as total_cost,
        SUM(si.gross_profit) as total_profit,
        AVG(si.profit_margin) as avg_margin
      FROM sale_items si
      JOIN products p ON si.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      JOIN sales s ON si.sale_id = s.id
      WHERE DATE(s.created_at) BETWEEN ? AND ?
      GROUP BY c.id, c.name
      ORDER BY total_profit DESC
    `)
      .all(startDate, endDate)
  },

  // Müşteri bazında kar analizi
  getCustomerProfitAnalysis: (startDate: string, endDate: string) => {
    return db
      .prepare(`
      SELECT 
        c.name as customer_name,
        c.customer_type,
        COUNT(s.id) as order_count,
        SUM(s.total_amount) as total_revenue,
        SUM(s.total_cost) as total_cost,
        SUM(s.gross_profit) as total_profit,
        AVG(s.profit_margin) as avg_margin,
        MAX(s.created_at) as last_order_date
      FROM sales s
      LEFT JOIN customers c ON s.customer_id = c.id
      WHERE DATE(s.created_at) BETWEEN ? AND ?
      GROUP BY s.customer_id
      ORDER BY total_profit DESC
    `)
      .all(startDate, endDate)
  },

  // Genel finansal özet
  getFinancialSummary: (startDate: string, endDate: string) => {
    const salesSummary = db
      .prepare(`
      SELECT 
        SUM(total_amount) as total_revenue,
        SUM(total_cost) as total_cogs,
        SUM(gross_profit) as total_gross_profit,
        COUNT(*) as total_sales,
        AVG(total_amount) as avg_order_value,
        AVG(profit_margin) as avg_profit_margin
      FROM sales 
      WHERE DATE(created_at) BETWEEN ? AND ?
    `)
      .get(startDate, endDate)

    const expenseSummary = db
      .prepare(`
      SELECT 
        SUM(amount) as total_expenses,
        SUM(CASE WHEN ec.is_fixed = 1 THEN amount ELSE 0 END) as fixed_expenses,
        SUM(CASE WHEN ec.is_fixed = 0 THEN amount ELSE 0 END) as variable_expenses
      FROM expenses e
      JOIN expense_categories ec ON e.category_id = ec.id
      WHERE DATE(expense_date) BETWEEN ? AND ?
    `)
      .get(startDate, endDate)

    return { sales: salesSummary, expenses: expenseSummary }
  },

  // Trend analizi
  getTrendAnalysis: (days = 30) => {
    const endDate = new Date().toISOString().split("T")[0]
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

    return db
      .prepare(`
      SELECT 
        DATE(created_at) as date,
        SUM(total_amount) as revenue,
        SUM(gross_profit) as profit,
        COUNT(*) as sales_count
      FROM sales 
      WHERE DATE(created_at) BETWEEN ? AND ?
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `)
      .all(startDate, endDate)
  },
}

// Satış işlemleri (kar-zarar hesaplı)
export const salesQueries = {
  create: (sale: any, items: any[]) => {
    const transaction = db.transaction(() => {
      let totalCost = 0
      let totalProfit = 0

      // Satışı ekle
      const saleResult = db
        .prepare(`
        INSERT INTO sales (customer_id, total_amount, total_cost, gross_profit, profit_margin, payment_type, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
        .run(
          sale.customer_id,
          sale.total_amount,
          sale.total_cost || 0,
          sale.gross_profit || 0,
          sale.profit_margin || 0,
          sale.payment_type,
          sale.notes,
        )

      const saleId = saleResult.lastInsertRowid

      // Satış detaylarını ekle
      const itemStmt = db.prepare(`
        INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, unit_cost, total_price, total_cost, gross_profit, profit_margin)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)

      const stockStmt = db.prepare("UPDATE products SET stock = stock - ? WHERE id = ?")
      const statsStmt = db.prepare(
        "UPDATE products SET total_sold = total_sold + ?, total_revenue = total_revenue + ?, total_profit = total_profit + ?, profit_margin = ? WHERE id = ?",
      )

      items.forEach((item) => {
        const itemCost = item.unit_cost * item.quantity
        const itemProfit = item.total_price - itemCost
        const itemMargin = item.total_price > 0 ? (itemProfit / item.total_price) * 100 : 0

        totalCost += itemCost
        totalProfit += itemProfit

        itemStmt.run(
          saleId,
          item.product_id,
          item.quantity,
          item.unit_price,
          item.unit_cost,
          item.total_price,
          itemCost,
          itemProfit,
          itemMargin,
        )

        stockStmt.run(item.quantity, item.product_id)

        // Ürün kar marjını güncelle
        const productMargin = item.unit_price > 0 ? ((item.unit_price - item.unit_cost) / item.unit_price) * 100 : 0
        statsStmt.run(item.quantity, item.total_price, itemProfit, productMargin, item.product_id)
      })

      // Satış kar-zarar güncelle
      const finalMargin = sale.total_amount > 0 ? (totalProfit / sale.total_amount) * 100 : 0
      db.prepare("UPDATE sales SET total_cost = ?, gross_profit = ?, profit_margin = ? WHERE id = ?").run(
        totalCost,
        totalProfit,
        finalMargin,
        saleId,
      )

      // Müşteri istatistiklerini güncelle
      if (sale.customer_id) {
        db.prepare(
          "UPDATE customers SET total_purchases = total_purchases + ?, total_profit_generated = total_profit_generated + ? WHERE id = ?",
        ).run(sale.total_amount, totalProfit, sale.customer_id)
      }

      return saleId
    })

    return transaction()
  },

  getAll: () => {
    return db
      .prepare(`
      SELECT s.*, c.name as customer_name 
      FROM sales s 
      LEFT JOIN customers c ON s.customer_id = c.id 
      ORDER BY s.created_at DESC
    `)
      .all()
  },
}

// Diğer mevcut query'ler...
export const categoryQueries = {
  getAll: () => db.prepare("SELECT * FROM categories ORDER BY name").all(),
  create: (name: string, description?: string, parentId?: number) => {
    const stmt = db.prepare("INSERT INTO categories (name, description, parent_id) VALUES (?, ?, ?)")
    return stmt.run(name, description, parentId)
  },
  delete: (id: number) => db.prepare("DELETE FROM categories WHERE id = ?").run(id),
}

export const productQueries = {
  getAll: () => {
    return db
      .prepare(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      ORDER BY p.name
    `)
      .all()
  },
  getTopSelling: (limit = 10) => {
    return db
      .prepare(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      ORDER BY p.total_sold DESC 
      LIMIT ?
    `)
      .all(limit)
  },
  getProductHistory: (productId: number) => {
    return db
      .prepare(`
      SELECT 
        si.quantity,
        si.unit_price,
        si.total_price,
        s.created_at as sale_date,
        c.name as customer_name,
        s.payment_type
      FROM sale_items si
      JOIN sales s ON si.sale_id = s.id
      LEFT JOIN customers c ON s.customer_id = c.id
      WHERE si.product_id = ?
      ORDER BY s.created_at DESC
    `)
      .all(productId)
  },
}

export const customerQueries = {
  getAll: () => db.prepare("SELECT * FROM customers ORDER BY total_purchases DESC").all(),
  getTopCustomers: (limit = 10) => {
    return db
      .prepare(`
      SELECT *, 
        (SELECT COUNT(*) FROM sales WHERE customer_id = customers.id) as order_count
      FROM customers 
      WHERE total_purchases > 0
      ORDER BY total_purchases DESC 
      LIMIT ?
    `)
      .all(limit)
  },
  getCustomerHistory: (customerId: number) => {
    return db
      .prepare(`
      SELECT s.*, 
        GROUP_CONCAT(p.name || ' (' || si.quantity || ')') as products
      FROM sales s
      LEFT JOIN sale_items si ON s.id = si.sale_id
      LEFT JOIN products p ON si.product_id = p.id
      WHERE s.customer_id = ?
      GROUP BY s.id
      ORDER BY s.created_at DESC
    `)
      .all(customerId)
  },
}

export const creditCardQueries = {
  getAll: () => db.prepare("SELECT * FROM credit_cards ORDER BY bank_name, card_name").all(),
  getById: (id: number) => db.prepare("SELECT * FROM credit_cards WHERE id = ?").get(id),
  create: (card: any) => {
    const stmt = db.prepare(`
      INSERT INTO credit_cards 
      (card_name, bank_name, card_number, credit_limit, statement_date, due_date, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    return stmt.run(
      card.card_name,
      card.bank_name,
      card.card_number,
      card.credit_limit,
      card.statement_date,
      card.due_date,
      card.notes,
    )
  },
}

export const templateQueries = {
  getAll: () => db.prepare("SELECT * FROM invoice_templates ORDER BY name").all(),
  getDefault: () => db.prepare("SELECT * FROM invoice_templates WHERE is_default = 1").get(),
  create: (template: any) => {
    const stmt = db.prepare(`
      INSERT INTO invoice_templates 
      (name, header_text, footer_text, logo_position, show_logo, show_company_info, 
       show_customer_info, font_size, font_family, color_scheme, template_data)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    return stmt.run(
      template.name,
      template.header_text,
      template.footer_text,
      template.logo_position,
      template.show_logo,
      template.show_company_info,
      template.show_customer_info,
      template.font_size,
      template.font_family,
      template.color_scheme,
      JSON.stringify(template.template_data),
    )
  },
}

export const staffQueries = {
  getAll: () => db.prepare("SELECT * FROM staff ORDER BY name").all(),
  getByUsername: (username: string) => db.prepare("SELECT * FROM staff WHERE username = ?").get(username),
  create: (staff: any) => {
    const stmt = db.prepare(`
      INSERT INTO staff (name, username, password, role, permissions)
      VALUES (?, ?, ?, ?, ?)
    `)
    return stmt.run(staff.name, staff.username, staff.password, staff.role, JSON.stringify(staff.permissions))
  },
}

export const backupQueries = {
  createBackup: (backupPath: string) => {
    try {
      fs.copyFileSync(DB_PATH, backupPath)
      return { success: true, message: "Yedekleme başarılı" }
    } catch (error) {
      return { success: false, message: "Yedekleme hatası: " + error }
    }
  },
  restoreBackup: (backupPath: string) => {
    try {
      if (!fs.existsSync(backupPath)) {
        return { success: false, message: "Yedek dosyası bulunamadı" }
      }

      // Mevcut veritabanını yedekle
      const currentBackup = DB_PATH + ".backup." + Date.now()
      fs.copyFileSync(DB_PATH, currentBackup)

      // Yedekten geri yükle
      fs.copyFileSync(backupPath, DB_PATH)

      return { success: true, message: "Geri yükleme başarılı" }
    } catch (error) {
      return { success: false, message: "Geri yükleme hatası: " + error }
    }
  },
}

// Veritabanını başlat
initializeDatabase()

export default db
