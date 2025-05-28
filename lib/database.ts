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
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories (id)
    )
  `)

  // Satışlar tablosu
  db.exec(`
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER,
      total_amount REAL NOT NULL,
      total_cost REAL DEFAULT 0,
      profit REAL DEFAULT 0,
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
      profit REAL DEFAULT 0,
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

// Kategori işlemleri
export const categoryQueries = {
  getAll: () => db.prepare("SELECT * FROM categories ORDER BY name").all(),
  create: (name: string, description?: string, parentId?: number) => {
    const stmt = db.prepare("INSERT INTO categories (name, description, parent_id) VALUES (?, ?, ?)")
    return stmt.run(name, description, parentId)
  },
  delete: (id: number) => db.prepare("DELETE FROM categories WHERE id = ?").run(id),
}

// Ürün işlemleri (genişletilmiş)
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
  updateSalesStats: (productId: number, quantity: number, revenue: number) => {
    const stmt = db.prepare(`
      UPDATE products 
      SET total_sold = total_sold + ?, total_revenue = total_revenue + ?
      WHERE id = ?
    `)
    return stmt.run(quantity, revenue, productId)
  },
}

// Müşteri işlemleri (genişletilmiş)
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
  updatePurchaseStats: (customerId: number, amount: number) => {
    const stmt = db.prepare(`
      UPDATE customers 
      SET total_purchases = total_purchases + ?, last_purchase_date = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    return stmt.run(amount, customerId)
  },
}

// Kredi kartı işlemleri
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
  updateDebt: (cardId: number, amount: number) => {
    const stmt = db.prepare(`
      UPDATE credit_cards 
      SET current_debt = current_debt + ?, available_limit = credit_limit - (current_debt + ?)
      WHERE id = ?
    `)
    return stmt.run(amount, amount, cardId)
  },
  addTransaction: (cardId: number, saleId: number | null, type: string, amount: number, description: string) => {
    const stmt = db.prepare(`
      INSERT INTO card_transactions (card_id, sale_id, transaction_type, amount, description)
      VALUES (?, ?, ?, ?, ?)
    `)
    return stmt.run(cardId, saleId, type, amount, description)
  },
  getTransactions: (cardId: number) => {
    return db
      .prepare(`
      SELECT ct.*, s.id as sale_number
      FROM card_transactions ct
      LEFT JOIN sales s ON ct.sale_id = s.id
      WHERE ct.card_id = ?
      ORDER BY ct.transaction_date DESC
    `)
      .all(cardId)
  },
}

// Fatura şablonu işlemleri
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
  setDefault: (id: number) => {
    const transaction = db.transaction(() => {
      db.prepare("UPDATE invoice_templates SET is_default = 0").run()
      db.prepare("UPDATE invoice_templates SET is_default = 1 WHERE id = ?").run(id)
    })
    return transaction()
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
        INSERT INTO sales (customer_id, total_amount, total_cost, profit, payment_type, notes)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
        .run(sale.customer_id, sale.total_amount, sale.total_cost || 0, sale.profit || 0, sale.payment_type, sale.notes)

      const saleId = saleResult.lastInsertRowid

      // Satış detaylarını ekle
      const itemStmt = db.prepare(`
        INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, unit_cost, total_price, total_cost, profit)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `)

      const stockStmt = db.prepare("UPDATE products SET stock = stock - ? WHERE id = ?")
      const statsStmt = db.prepare(
        "UPDATE products SET total_sold = total_sold + ?, total_revenue = total_revenue + ? WHERE id = ?",
      )

      items.forEach((item) => {
        const itemCost = item.unit_cost * item.quantity
        const itemProfit = item.total_price - itemCost

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
        )

        stockStmt.run(item.quantity, item.product_id)
        statsStmt.run(item.quantity, item.total_price, item.product_id)
      })

      // Satış kar-zarar güncelle
      db.prepare("UPDATE sales SET total_cost = ?, profit = ? WHERE id = ?").run(totalCost, totalProfit, saleId)

      // Müşteri istatistiklerini güncelle
      if (sale.customer_id) {
        customerQueries.updatePurchaseStats(sale.customer_id, sale.total_amount)
      }

      return saleId
    })

    return transaction()
  },

  getProfitLoss: (startDate: string, endDate: string) => {
    return db
      .prepare(`
      SELECT 
        DATE(created_at) as date,
        SUM(total_amount) as revenue,
        SUM(total_cost) as cost,
        SUM(profit) as profit,
        COUNT(*) as sales_count
      FROM sales 
      WHERE DATE(created_at) BETWEEN ? AND ?
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `)
      .all(startDate, endDate)
  },
}

// Veritabanını başlat
initializeDatabase()

export default db
