import { type NextRequest, NextResponse } from "next/server"
import { customerQueries } from "@/lib/database"

export async function GET() {
  try {
    const customers = customerQueries.getAll()
    return NextResponse.json(customers)
  } catch (error) {
    return NextResponse.json({ error: "Müşteriler getirilemedi" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const customer = await request.json()

    // Otomatik kullanıcı adı ve şifre oluştur
    if (!customer.username) {
      customer.username = customer.name.toLowerCase().replace(/\s+/g, "") + Math.floor(Math.random() * 1000)
    }
    if (!customer.password) {
      customer.password = Math.random().toString(36).slice(-8)
    }

    const result = customerQueries.create(customer)
    return NextResponse.json({
      success: true,
      id: result.lastInsertRowid,
      username: customer.username,
      password: customer.password,
    })
  } catch (error) {
    return NextResponse.json({ error: "Müşteri eklenemedi" }, { status: 500 })
  }
}
