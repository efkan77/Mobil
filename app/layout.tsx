import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "./simple-auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Satış Yönetim Sistemi",
  description: "Kapsamlı satış ve fatura yönetim sistemi",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
