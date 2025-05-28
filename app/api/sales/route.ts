import { type NextRequest, NextResponse } from "next/server"
import { salesQueries } from "@/lib/database"

export async function GET() {
  try {
    const sales = salesQueries.getAll()
    return NextResponse.json(sales)
  } catch (error) {
    return NextResponse.json({ error: "Satışlar getirilemedi" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sale, items } = await request.json()
    const saleId = salesQueries.create(sale, items)
    return NextResponse.json({ success: true, saleId })
  } catch (error) {
    return NextResponse.json({ error: "Satış kaydedilemedi" }, { status: 500 })
  }
}
