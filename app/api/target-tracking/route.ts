import { type NextRequest, NextResponse } from "next/server"
import { targetQueries } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const targetId = searchParams.get("targetId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    if (!targetId || !startDate || !endDate) {
      return NextResponse.json({ error: "Gerekli parametreler eksik" }, { status: 400 })
    }

    const achievement = targetQueries.getTargetAchievement(Number(targetId), startDate, endDate)

    return NextResponse.json(achievement)
  } catch (error) {
    console.error("Hedef takip hatası:", error)
    return NextResponse.json({ error: "Hedef takip verileri getirilemedi" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { targetId, ...trackingData } = await request.json()

    const result = targetQueries.createTracking(targetId, trackingData)

    return NextResponse.json({ success: true, id: result.lastInsertRowid })
  } catch (error) {
    console.error("Hedef takip kayıt hatası:", error)
    return NextResponse.json({ error: "Hedef takip kaydı oluşturulamadı" }, { status: 500 })
  }
}
