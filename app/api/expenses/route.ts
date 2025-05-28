import { type NextRequest, NextResponse } from "next/server"
import { expenseQueries } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const type = searchParams.get("type") || "all"

    let expenses

    if (startDate && endDate) {
      if (type === "categories") {
        expenses = expenseQueries.getTotalByCategory(startDate, endDate)
      } else {
        expenses = expenseQueries.getByDateRange(startDate, endDate)
      }
    } else {
      expenses = expenseQueries.getAll()
    }

    return NextResponse.json(expenses)
  } catch (error) {
    console.error("Gider verileri hatası:", error)
    return NextResponse.json({ error: "Gider verileri getirilemedi" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const expense = await request.json()
    const result = expenseQueries.create(expense)
    return NextResponse.json({ success: true, id: result.lastInsertRowid })
  } catch (error) {
    console.error("Gider ekleme hatası:", error)
    return NextResponse.json({ error: "Gider eklenemedi" }, { status: 500 })
  }
}
