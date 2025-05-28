"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Printer } from "lucide-react"

interface InvoiceData {
  invoiceNumber: string
  date: string
  customer: {
    name: string
    address: string
    phone: string
  }
  company: {
    name: string
    address: string
    phone: string
    logo?: string
  }
  items: Array<{
    name: string
    quantity: number
    unitPrice: number
    total: number
  }>
  paymentType: string
  total: number
  notes?: string
}

interface InvoiceGeneratorProps {
  invoiceData: InvoiceData
}

export default function InvoiceGenerator({ invoiceData }: InvoiceGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePDF = async () => {
    setIsGenerating(true)
    // PDF generation logic would go here
    // For now, we'll simulate the process
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsGenerating(false)
    alert("PDF başarıyla oluşturuldu!")
  }

  const printInvoice = () => {
    window.print()
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* Header with actions */}
      <div className="flex justify-between items-center mb-6 no-print">
        <h1 className="text-2xl font-bold">Fatura Önizleme</h1>
        <div className="flex space-x-2">
          <Button onClick={printInvoice} variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Yazdır
          </Button>
          <Button onClick={generatePDF} disabled={isGenerating}>
            <Download className="h-4 w-4 mr-2" />
            {isGenerating ? "Oluşturuluyor..." : "PDF İndir"}
          </Button>
        </div>
      </div>

      {/* Invoice Content */}
      <Card className="print:shadow-none print:border-none">
        <CardContent className="p-8">
          {/* Company Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              {invoiceData.company.logo && (
                <img src={invoiceData.company.logo || "/placeholder.svg"} alt="Company Logo" className="h-16 mb-4" />
              )}
              <h2 className="text-2xl font-bold text-blue-600">{invoiceData.company.name}</h2>
              <p className="text-gray-600">{invoiceData.company.address}</p>
              <p className="text-gray-600">{invoiceData.company.phone}</p>
            </div>
            <div className="text-right">
              <h1 className="text-3xl font-bold text-gray-800">FATURA</h1>
              <p className="text-lg font-semibold">#{invoiceData.invoiceNumber}</p>
              <p className="text-gray-600">Tarih: {invoiceData.date}</p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Fatura Adresi:</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold">{invoiceData.customer.name}</p>
              <p className="text-gray-600">{invoiceData.customer.address}</p>
              <p className="text-gray-600">{invoiceData.customer.phone}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-3 px-2">Ürün/Hizmet</th>
                  <th className="text-center py-3 px-2">Miktar</th>
                  <th className="text-right py-3 px-2">Birim Fiyat</th>
                  <th className="text-right py-3 px-2">Toplam</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-3 px-2">{item.name}</td>
                    <td className="text-center py-3 px-2">{item.quantity}</td>
                    <td className="text-right py-3 px-2">₺{item.unitPrice.toLocaleString()}</td>
                    <td className="text-right py-3 px-2">₺{item.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="flex justify-end mb-8">
            <div className="w-64">
              <div className="flex justify-between py-2 border-t-2 border-gray-300">
                <span className="font-bold text-lg">TOPLAM:</span>
                <span className="font-bold text-lg">₺{invoiceData.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Ödeme Bilgileri:</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>
                  <span className="font-semibold">Ödeme Türü:</span> {invoiceData.paymentType}
                </p>
                <Badge variant="secondary" className="mt-2">
                  Ödendi
                </Badge>
              </div>
            </div>
            {invoiceData.notes && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Notlar:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p>{invoiceData.notes}</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center text-gray-500 text-sm border-t pt-4">
            <p>Bu fatura elektronik ortamda oluşturulmuştur.</p>
            <p>Teşekkür ederiz!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
