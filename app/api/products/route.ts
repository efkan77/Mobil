import { type NextRequest, NextResponse } from "next/server"
import { productQueries } from "@/lib/database"

export async function GET() {
  try {
    const products = productQueries.getAll()
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: "Ürünler getirilemedi" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const product = await request.json()
    const result = productQueries.create(product)
    return NextResponse.json({ success: true, id: result.lastInsertRowid })
  } catch (error) {
    return NextResponse.json({ error: "Ürün eklenemedi" }, { status: 500 })
  }
}
