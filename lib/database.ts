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
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Ürünler tablosu
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT,
      price REAL NOT NULL,
      cost_price REAL,
      stock INTEGER DEFAULT 0,
      min_stock INTEGER DEFAULT 5,
      barcode TEXT,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Satışlar tablosu
  db.exec(`
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER,
      total_amount REAL NOT NULL,
      payment_type TEXT NOT NULL,
      notes TEXT,
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
      total_price REAL NOT NULL,
      FOREIGN KEY (sale_id) REFERENCES sales (id),
      FOREIGN KEY (product_id) REFERENCES products (id)
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

  // Tedarikçiler tablosu
  db.exec(`
    CREATE TABLE IF NOT EXISTS suppliers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      contact_person TEXT,
      phone TEXT,
      email TEXT,
      address TEXT,
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

  // Varsayılan admin kullanıcısını ekle
  const adminExists = db.prepare("SELECT COUNT(*) as count FROM staff WHERE username = ?").get("poyraz02")
  if ((adminExists as any).count === 0) {
    db.prepare(`
      INSERT INTO staff (name, username, password, role, permissions, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run("Admin", "poyraz02", "eliz02", "Sistem Yöneticisi", JSON.stringify(["all"]), "active")
  }

  console.log("✅ Veritabanı başarıyla oluşturuldu: efegida.db")
}

// Müşteri işlemleri
export const customerQueries = {
  getAll: () => db.prepare("SELECT * FROM customers ORDER BY name").all(),
  getById: (id: number) => db.prepare("SELECT * FROM customers WHERE id = ?").get(id),
  getByUsername: (username: string) => db.prepare("SELECT * FROM customers WHERE username = ?").get(username),
  create: (customer: any) => {
    const stmt = db.prepare(`
      INSERT INTO customers (name, email, phone, address, username, password)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    return stmt.run(
      customer.name,
      customer.email,
      customer.phone,
      customer.address,
      customer.username,
      customer.password,
    )
  },
  update: (id: number, customer: any) => {
    const stmt = db.prepare(`
      UPDATE customers 
      SET name = ?, email = ?, phone = ?, address = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    return stmt.run(customer.name, customer.email, customer.phone, customer.address, id)
  },
  delete: (id: number) => db.prepare("DELETE FROM customers WHERE id = ?").run(id),
}

// Ürün işlemleri
export const productQueries = {
  getAll: () => db.prepare("SELECT * FROM products ORDER BY name").all(),
  getById: (id: number) => db.prepare("SELECT * FROM products WHERE id = ?").get(id),
  getLowStock: () => db.prepare("SELECT * FROM products WHERE stock <= min_stock").all(),
  create: (product: any) => {
    const stmt = db.prepare(`
      INSERT INTO products (name, category, price, cost_price, stock, min_stock, barcode, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    return stmt.run(
      product.name,
      product.category,
      product.price,
      product.cost_price,
      product.stock,
      product.min_stock,
      product.barcode,
      product.description,
    )
  },
  update: (id: number, product: any) => {
    const stmt = db.prepare(`
      UPDATE products 
      SET name = ?, category = ?, price = ?, cost_price = ?, stock = ?, min_stock = ?, 
          barcode = ?, description = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    return stmt.run(
      product.name,
      product.category,
      product.price,
      product.cost_price,
      product.stock,
      product.min_stock,
      product.barcode,
      product.description,
      id,
    )
  },
  updateStock: (id: number, quantity: number) => {
    const stmt = db.prepare("UPDATE products SET stock = stock - ? WHERE id = ?")
    return stmt.run(quantity, id)
  },
  delete: (id: number) => db.prepare("DELETE FROM products WHERE id = ?").run(id),
}

// Satış işlemleri
export const salesQueries = {
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
  getById: (id: number) => {
    const sale = db
      .prepare(`
      SELECT s.*, c.name as customer_name 
      FROM sales s 
      LEFT JOIN customers c ON s.customer_id = c.id 
      WHERE s.id = ?
    `)
      .get(id)

    const items = db
      .prepare(`
      SELECT si.*, p.name as product_name 
      FROM sale_items si 
      JOIN products p ON si.product_id = p.id 
      WHERE si.sale_id = ?
    `)
      .all(id)

    return { ...sale, items }
  },
  create: (sale: any, items: any[]) => {
    const transaction = db.transaction(() => {
      // Satışı ekle
      const saleResult = db
        .prepare(`
        INSERT INTO sales (customer_id, total_amount, payment_type, notes)
        VALUES (?, ?, ?, ?)
      `)
        .run(sale.customer_id, sale.total_amount, sale.payment_type, sale.notes)

      const saleId = saleResult.lastInsertRowid

      // Satış detaylarını ekle ve stokları güncelle
      const itemStmt = db.prepare(`
        INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, total_price)
        VALUES (?, ?, ?, ?, ?)
      `)

      const stockStmt = db.prepare("UPDATE products SET stock = stock - ? WHERE id = ?")

      items.forEach((item) => {
        itemStmt.run(saleId, item.product_id, item.quantity, item.unit_price, item.total_price)
        stockStmt.run(item.quantity, item.product_id)
      })

      return saleId
    })

    return transaction()
  },
  getByDateRange: (startDate: string, endDate: string) => {
    return db
      .prepare(`
      SELECT s.*, c.name as customer_name 
      FROM sales s 
      LEFT JOIN customers c ON s.customer_id = c.id 
      WHERE DATE(s.created_at) BETWEEN ? AND ?
      ORDER BY s.created_at DESC
    `)
      .all(startDate, endDate)
  },
}

// Personel işlemleri
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
  updateLastLogin: (username: string) => {
    const stmt = db.prepare("UPDATE staff SET last_login = CURRENT_TIMESTAMP WHERE username = ?")
    return stmt.run(username)
  },
}

// Yedekleme işlemleri
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
