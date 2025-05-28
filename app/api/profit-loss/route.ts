import { type NextRequest, NextResponse } from "next/server"
import { profitLossQueries } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate") || ""
    const endDate = searchParams.get("endDate") || ""
    const analysisType = searchParams.get("type") || "summary"

    let data

    switch (analysisType) {
      case "daily":
        data = profitLossQueries.getDailyProfitLoss(startDate, endDate)
        break
      case "monthly":
        const year = new Date().getFullYear()
        data = profitLossQueries.getMonthlyProfitLoss(year)
        break
      case "products":
        data = profitLossQueries.getProductProfitAnalysis(startDate, endDate)
        break
      case "categories":
        data = profitLossQueries.getCategoryProfitAnalysis(startDate, endDate)
        break
      case "customers":
        data = profitLossQueries.getCustomerProfitAnalysis(startDate, endDate)
        break
      case "summary":
      default:
        data = profitLossQueries.getFinancialSummary(startDate, endDate)
        break
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Kar-zarar analizi hatası:", error)
    return NextResponse.json({ error: "Analiz verileri getirilemedi" }, { status: 500 })
  }
}
