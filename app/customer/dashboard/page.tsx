"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, CreditCard, FileText, Download, Calendar, DollarSign } from "lucide-react"
import { useAuth } from "../../simple-auth"
import { useRouter } from "next/navigation"

export default function CustomerDashboard() {
  const [customerData] = useState({
    name: "Ahmet Yılmaz",
    totalPurchases: 125600,
    totalDebt: 15000,
    lastPurchase: "2024-01-15",
    purchaseCount: 24,
  })

  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const recentPurchases = [
    {
      id: "1001",
      date: "2024-01-15",
      items: "iPhone 15 Pro, Kılıf",
      total: 47500,
      status: "Tamamlandı",
      paymentType: "Kredi Kartı",
    },
    {
      id: "1002",
      date: "2024-01-10",
      items: "MacBook Air M2",
      total: 55000,
      status: "Tamamlandı",
      paymentType: "Nakit",
    },
    {
      id: "1003",
      date: "2024-01-05",
      items: "iPad Pro, Apple Pencil",
      total: 28000,
      status: "Tamamlandı",
      paymentType: "Havale",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Müşteri Paneli</h1>
              <p className="text-gray-600">Hoş geldiniz, {customerData.name}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Çıkış Yap
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ShoppingBag className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Alışveriş</p>
                  <p className="text-2xl font-bold text-gray-900">{customerData.purchaseCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Harcama</p>
                  <p className="text-2xl font-bold text-gray-900">₺{customerData.totalPurchases.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <CreditCard className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Borç</p>
                  <p className="text-2xl font-bold text-gray-900">₺{customerData.totalDebt.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Son Alışveriş</p>
                  <p className="text-2xl font-bold text-gray-900">{customerData.lastPurchase}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Purchases */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Son Alışverişlerim</CardTitle>
              <CardDescription>Son 10 alışveriş kaydınız</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPurchases.map((purchase) => (
                  <div key={purchase.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">Sipariş #{purchase.id}</h4>
                        <p className="text-sm text-gray-600">{purchase.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">₺{purchase.total.toLocaleString()}</p>
                        <Badge variant="secondary">{purchase.status}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">{purchase.items}</p>
                        <p className="text-xs text-gray-500">Ödeme: {purchase.paymentType}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        Fatura Görüntüle
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Hızlı İşlemler</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Tüm Faturalarım</h3>
                <p className="text-sm text-gray-600 mb-4">Geçmiş tüm faturalarınızı görüntüleyin</p>
                <Button className="w-full">Faturalara Git</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Download className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">PDF İndir</h3>
                <p className="text-sm text-gray-600 mb-4">Faturalarınızı PDF olarak indirin</p>
                <Button className="w-full" variant="outline">
                  PDF Oluştur
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <CreditCard className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Ödeme Geçmişi</h3>
                <p className="text-sm text-gray-600 mb-4">Ödeme geçmişinizi inceleyin</p>
                <Button className="w-full" variant="outline">
                  Geçmişi Görüntüle
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
