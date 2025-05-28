import { type NextRequest, NextResponse } from "next/server"
import { backupQueries } from "@/lib/database"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const { action, backupPath } = await request.json()

    if (action === "create") {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
      const defaultBackupPath = path.join(process.cwd(), "backups", `efegida-backup-${timestamp}.db`)

      const result = backupQueries.createBackup(backupPath || defaultBackupPath)
      return NextResponse.json(result)
    }

    if (action === "restore") {
      const result = backupQueries.restoreBackup(backupPath)
      return NextResponse.json(result)
    }

    return NextResponse.json({ error: "Geçersiz işlem" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: "Yedekleme işlemi başarısız" }, { status: 500 })
  }
}
