"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Users, Package, Download, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("today")
  const [reportType, setReportType] = useState("sales")

  // Mock data
  const salesData = [
    { date: "2024-01-15", sales: 125000, orders: 15, customers: 12 },
    { date: "2024-01-14", sales: 98000, orders: 12, customers: 10 },
    { date: "2024-01-13", sales: 156000, orders: 18, customers: 15 },
    { date: "2024-01-12", sales: 87000, orders: 9, customers: 8 },
    { date: "2024-01-11", sales: 134000, orders: 16, customers: 13 },
  ]

  const topProducts = [
    { name: "iPhone 15 Pro", sales: 25, revenue: 1125000 },
    { name: "MacBook Air M2", sales: 18, revenue: 990000 },
    { name: "Samsung Galaxy S24", sales: 22, revenue: 770000 },
    { name: 'iPad Pro 12.9"', sales: 15, revenue: 375000 },
  ]

  const topCustomers = [
    { name: "Ahmet Yılmaz", orders: 8, total: 245000 },
    { name: "Fatma Demir", orders: 6, total: 189000 },
    { name: "Mehmet Kaya", orders: 5, total: 156000 },
    { name: "Ayşe Özkan", orders: 4, total: 134000 },
  ]

  const totalSales = salesData.reduce((sum, day) => sum + day.sales, 0)
  const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0)
  const avgOrderValue = totalSales / totalOrders

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Geri
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Raporlar</h1>
                <p className="text-gray-600">Detaylı satış ve performans raporları</p>
              </div>
            </div>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              PDF İndir
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Rapor Filtreleri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="reportType">Rapor Türü</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Satış Raporu</SelectItem>
                    <SelectItem value="products">Ürün Raporu</SelectItem>
                    <SelectItem value="customers">Müşteri Raporu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dateRange">Tarih Aralığı</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Bugün</SelectItem>
                    <SelectItem value="week">Bu Hafta</SelectItem>
                    <SelectItem value="month">Bu Ay</SelectItem>
                    <SelectItem value="quarter">Bu Çeyrek</SelectItem>
                    <SelectItem value="year">Bu Yıl</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button className="w-full">Rapor Oluştur</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Satış</p>
                  <p className="text-2xl font-bold">₺{totalSales.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Sipariş</p>
                  <p className="text-2xl font-bold">{totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ortalama Sipariş</p>
                  <p className="text-2xl font-bold">₺{Math.round(avgOrderValue).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Package className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Aktif Ürün</p>
                  <p className="text-2xl font-bold">89</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Kar</p>
                  <p className="text-2xl font-bold text-green-600">₺{(totalSales * 0.3).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Gider</p>
                  <p className="text-2xl font-bold text-red-600">₺{(totalSales * 0.7).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sales" className="w-full">
          <TabsList>
            <TabsTrigger value="sales">Satış Raporları</TabsTrigger>
            <TabsTrigger value="profit-loss">Kar-Zarar</TabsTrigger>
          </TabsList>
          <TabsContent value="sales">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Daily Sales */}
              <Card>
                <CardHeader>
                  <CardTitle>Günlük Satış Raporu</CardTitle>
                  <CardDescription>Son 5 günün satış performansı</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tarih</TableHead>
                        <TableHead>Satış</TableHead>
                        <TableHead>Sipariş</TableHead>
                        <TableHead>Müşteri</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {salesData.map((day, index) => (
                        <TableRow key={index}>
                          <TableCell>{day.date}</TableCell>
                          <TableCell>₺{day.sales.toLocaleString()}</TableCell>
                          <TableCell>{day.orders}</TableCell>
                          <TableCell>{day.customers}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Top Products */}
              <Card>
                <CardHeader>
                  <CardTitle>En Çok Satan Ürünler</CardTitle>
                  <CardDescription>Bu dönemde en çok satılan ürünler</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topProducts.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.sales} adet satıldı</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₺{product.revenue.toLocaleString()}</p>
                          <Badge variant="secondary">#{index + 1}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Customers */}
              <Card>
                <CardHeader>
                  <CardTitle>En Çok Alışveriş Yapan Müşteriler</CardTitle>
                  <CardDescription>Bu dönemde en aktif müşteriler</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topCustomers.map((customer, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-gray-600">{customer.orders} sipariş</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₺{customer.total.toLocaleString()}</p>
                          <Badge variant="secondary">#{index + 1}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle>Aylık Karşılaştırma</CardTitle>
                  <CardDescription>Son 3 ayın performans karşılaştırması</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Ocak 2024</p>
                        <p className="text-sm text-gray-600">Bu ay</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">₺245,600</p>
                        <p className="text-sm text-green-600">+15.2%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Aralık 2023</p>
                        <p className="text-sm text-gray-600">Geçen ay</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₺213,400</p>
                        <p className="text-sm text-gray-600">+8.7%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Kasım 2023</p>
                        <p className="text-sm text-gray-600">2 ay önce</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₺196,300</p>
                        <p className="text-sm text-red-600">-3.2%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="profit-loss">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gider Analizi</CardTitle>
                  <CardDescription>Aylık gider dağılımı</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { category: "Ürün Alımı", amount: 180000, percentage: 60 },
                      { category: "Kira", amount: 15000, percentage: 5 },
                      { category: "Personel", amount: 25000, percentage: 8.3 },
                      { category: "Elektrik/Su", amount: 5000, percentage: 1.7 },
                      { category: "Diğer", amount: 75000, percentage: 25 },
                    ].map((expense, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{expense.category}</p>
                          <p className="text-sm text-gray-600">%{expense.percentage}</p>
                        </div>
                        <p className="font-bold text-red-600">₺{expense.amount.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Kar-Zarar Özeti</CardTitle>
                  <CardDescription>Bu ayın finansal durumu</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">Toplam Gelir</span>
                      <span className="font-bold text-green-600">₺{totalSales.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-red-50 rounded-lg">
                      <span className="font-medium">Toplam Gider</span>
                      <span className="font-bold text-red-600">₺{(totalSales * 0.7).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-blue-50 rounded-lg border-t-2">
                      <span className="font-bold">Net Kar</span>
                      <span className="font-bold text-blue-600">₺{(totalSales * 0.3).toLocaleString()}</span>
                    </div>
                    <div className="text-center">
                      <Badge variant="default" className="text-lg px-4 py-2">
                        Kar Marjı: %30
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
