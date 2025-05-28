import { type NextRequest, NextResponse } from "next/server"
import { targetQueries } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const type = searchParams.get("type")

    let targets
    if (status === "active") {
      targets = targetQueries.getActive()
    } else {
      targets = targetQueries.getAll()
    }

    if (type) {
      targets = targets.filter((t: any) => t.target_type === type)
    }

    return NextResponse.json(targets)
  } catch (error) {
    console.error("Hedefler getirme hatası:", error)
    return NextResponse.json({ error: "Hedefler getirilemedi" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const target = await request.json()

    const result = targetQueries.create(target)

    return NextResponse.json({ success: true, id: result.lastInsertRowid })
  } catch (error) {
    console.error("Hedef oluşturma hatası:", error)
    return NextResponse.json({ error: "Hedef oluşturulamadı" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...target } = await request.json()

    targetQueries.update(id, target)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Hedef güncelleme hatası:", error)
    return NextResponse.json({ error: "Hedef güncellenemedi" }, { status: 500 })
  }
}
