import { type NextRequest, NextResponse } from "next/server"
import { expenseCategoryQueries } from "@/lib/database"

export async function GET() {
  try {
    const categories = expenseCategoryQueries.getAll()
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Gider kategorileri hatası:", error)
    return NextResponse.json({ error: "Gider kategorileri getirilemedi" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, isFixed } = await request.json()
    const result = expenseCategoryQueries.create(name, description, isFixed)
    return NextResponse.json({ success: true, id: result.lastInsertRowid })
  } catch (error) {
    console.error("Gider kategorisi ekleme hatası:", error)
    return NextResponse.json({ error: "Gider kategorisi eklenemedi" }, { status: 500 })
  }
}
