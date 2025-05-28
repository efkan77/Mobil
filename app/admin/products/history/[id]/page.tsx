"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, TrendingUp, Users, Calendar } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface ProductHistory {
  quantity: number
  unit_price: number
  total_price: number
  sale_date: string
  customer_name: string
  payment_type: string
}

export default function ProductHistoryPage() {
  const params = useParams()
  const productId = params.id as string

  const [product, setProduct] = useState<any>(null)
  const [history, setHistory] = useState<ProductHistory[]>([])
  const [loading, setLoading] = useState(true)

  // Mock data - gerçek uygulamada API'den gelecek
  useEffect(() => {
    // Simulated API call
    setTimeout(() => {
      setProduct({
        id: productId,
        name: "iPhone 15 Pro",
        category: "Telefon & Tablet",
        current_price: 45000,
        total_sold: 25,
        total_revenue: 1125000,
      })

      setHistory([
        {
          quantity: 2,
          unit_price: 45000,
          total_price: 90000,
          sale_date: "2024-01-15",
          customer_name: "Ahmet Yılmaz",
          payment_type: "Kredi Kartı",
        },
        {
          quantity: 1,
          unit_price: 44000,
          total_price: 44000,
          sale_date: "2024-01-14",
          customer_name: "Fatma Demir",
          payment_type: "Nakit",
        },
        {
          quantity: 3,
          unit_price: 45000,
          total_price: 135000,
          sale_date: "2024-01-13",
          customer_name: "Mehmet Kaya",
          payment_type: "Havale",
        },
        {
          quantity: 1,
          unit_price: 43000,
          total_price: 43000,
          sale_date: "2024-01-12",
          customer_name: "Ayşe Özkan",
          payment_type: "Kredi Kartı",
        },
        {
          quantity: 2,
          unit_price: 45000,
          total_price: 90000,
          sale_date: "2024-01-11",
          customer_name: "Ali Veli",
          payment_type: "Nakit",
        },
      ])
      setLoading(false)
    }, 1000)
  }, [productId])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Yükleniyor...</div>
  }

  const avgPrice = history.reduce((sum, item) => sum + item.unit_price, 0) / history.length
  const uniqueCustomers = new Set(history.map((item) => item.customer_name)).size

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link href="/admin/products">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Ürünlere Dön
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product?.name} - Satış Geçmişi</h1>
              <p className="text-gray-600">Ürün satış detayları ve müşteri analizi</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Ürün Özet İstatistikleri */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Satış</p>
                  <p className="text-2xl font-bold">{product?.total_sold} adet</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                  <p className="text-2xl font-bold">₺{product?.total_revenue?.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Farklı Müşteri</p>
                  <p className="text-2xl font-bold">{uniqueCustomers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ortalama Fiyat</p>
                  <p className="text-2xl font-bold">₺{Math.round(avgPrice).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Satış Geçmişi Tablosu */}
        <Card>
          <CardHeader>
            <CardTitle>Detaylı Satış Geçmişi</CardTitle>
            <CardDescription>Bu ürünün tüm satış kayıtları</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarih</TableHead>
                  <TableHead>Müşteri</TableHead>
                  <TableHead>Miktar</TableHead>
                  <TableHead>Birim Fiyat</TableHead>
                  <TableHead>Toplam</TableHead>
                  <TableHead>Ödeme Türü</TableHead>
                  <TableHead>Fiyat Durumu</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(item.sale_date).toLocaleDateString("tr-TR")}</TableCell>
                    <TableCell className="font-medium">{item.customer_name}</TableCell>
                    <TableCell>{item.quantity} adet</TableCell>
                    <TableCell>₺{item.unit_price.toLocaleString()}</TableCell>
                    <TableCell className="font-bold">₺{item.total_price.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.payment_type}</Badge>
                    </TableCell>
                    <TableCell>
                      {item.unit_price > avgPrice ? (
                        <Badge variant="default">Ortalamanın Üstü</Badge>
                      ) : item.unit_price < avgPrice ? (
                        <Badge variant="secondary">Ortalamanın Altı</Badge>
                      ) : (
                        <Badge variant="outline">Ortalama</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
