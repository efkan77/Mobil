"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Package,
  ArrowLeft,
  Download,
  Calculator,
  PieChart,
  BarChart3,
  Target,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"

export default function ProfitLossPage() {
  const [dateRange, setDateRange] = useState("month")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [analysisData, setAnalysisData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Tarih aralığını ayarla
  useEffect(() => {
    const today = new Date()
    const end = today.toISOString().split("T")[0]
    let start = ""

    switch (dateRange) {
      case "today":
        start = end
        break
      case "week":
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        start = weekAgo.toISOString().split("T")[0]
        break
      case "month":
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
        start = monthAgo.toISOString().split("T")[0]
        break
      case "quarter":
        const quarterAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000)
        start = quarterAgo.toISOString().split("T")[0]
        break
      case "year":
        const yearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000)
        start = yearAgo.toISOString().split("T")[0]
        break
    }

    setStartDate(start)
    setEndDate(end)
  }, [dateRange])

  // Mock data - gerçek uygulamada API'den gelecek
  const mockData = {
    summary: {
      totalRevenue: 2450000,
      totalCOGS: 1715000,
      grossProfit: 735000,
      totalExpenses: 485000,
      netProfit: 250000,
      profitMargin: 10.2,
      grossMargin: 30.0,
      salesCount: 156,
      avgOrderValue: 15705,
    },
    dailyTrend: [
      { date: "2024-01-15", revenue: 125000, profit: 25000, margin: 20 },
      { date: "2024-01-14", revenue: 98000, profit: 18000, margin: 18.4 },
      { date: "2024-01-13", revenue: 156000, profit: 35000, margin: 22.4 },
      { date: "2024-01-12", revenue: 87000, profit: 15000, margin: 17.2 },
      { date: "2024-01-11", revenue: 134000, profit: 28000, margin: 20.9 },
    ],
    productAnalysis: [
      { name: "iPhone 15 Pro", revenue: 1125000, cost: 787500, profit: 337500, margin: 30, sold: 25 },
      { name: "MacBook Air M2", revenue: 990000, cost: 742500, profit: 247500, margin: 25, sold: 18 },
      { name: "Samsung Galaxy S24", revenue: 770000, cost: 577500, profit: 192500, margin: 25, sold: 22 },
      { name: 'iPad Pro 12.9"', revenue: 375000, cost: 281250, profit: 93750, margin: 25, sold: 15 },
    ],
    categoryAnalysis: [
      { name: "Telefon & Tablet", revenue: 1895000, cost: 1365250, profit: 529750, margin: 27.9, products: 47 },
      { name: "Bilgisayar & Laptop", revenue: 990000, cost: 742500, profit: 247500, margin: 25, products: 18 },
      { name: "Aksesuarlar", revenue: 185000, cost: 129500, profit: 55500, margin: 30, products: 91 },
    ],
    customerAnalysis: [
      { name: "Ahmet Yılmaz", revenue: 245000, cost: 171500, profit: 73500, margin: 30, orders: 8 },
      { name: "Fatma Demir", revenue: 189000, cost: 132300, profit: 56700, margin: 30, orders: 6 },
      { name: "Mehmet Kaya", revenue: 156000, cost: 109200, profit: 46800, margin: 30, orders: 5 },
    ],
    expenses: [
      { category: "Kira", amount: 15000, percentage: 3.1, isFixed: true },
      { category: "Personel Maaşları", amount: 85000, percentage: 17.5, isFixed: true },
      { category: "Elektrik", amount: 8500, percentage: 1.8, isFixed: false },
      { category: "Ürün Alımı", amount: 320000, percentage: 66.0, isFixed: false },
      { category: "Pazarlama", amount: 25000, percentage: 5.2, isFixed: false },
      { category: "Diğer", amount: 31500, percentage: 6.5, isFixed: false },
    ],
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `%${value.toFixed(1)}`
  }

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
                <h1 className="text-3xl font-bold text-gray-900">Kar-Zarar Analizi</h1>
                <p className="text-gray-600">Detaylı finansal performans analizi</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Excel İndir
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                PDF Rapor
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtreler */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="h-5 w-5 mr-2" />
              Analiz Filtreleri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                    <SelectItem value="custom">Özel Tarih</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {dateRange === "custom" && (
                <>
                  <div>
                    <Label htmlFor="startDate">Başlangıç</Label>
                    <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="endDate">Bitiş</Label>
                    <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </div>
                </>
              )}
              <div className="flex items-end">
                <Button className="w-full" onClick={() => setLoading(true)}>
                  Analiz Et
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Finansal Özet */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(mockData.summary.totalRevenue)}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500">+12.5%</span>
                <span className="text-gray-500 ml-1">önceki döneme göre</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Brüt Kar</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(mockData.summary.grossProfit)}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-2">
                <span className="text-sm text-gray-500">Brüt Kar Marjı: </span>
                <span className="text-sm font-medium text-blue-600">
                  {formatPercentage(mockData.summary.grossMargin)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Net Kar</p>
                  <p className="text-2xl font-bold text-purple-600">{formatCurrency(mockData.summary.netProfit)}</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-2">
                <span className="text-sm text-gray-500">Net Kar Marjı: </span>
                <span className="text-sm font-medium text-purple-600">
                  {formatPercentage(mockData.summary.profitMargin)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Gider</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(mockData.summary.totalExpenses)}</p>
                </div>
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-red-500">+8.2%</span>
                <span className="text-gray-500 ml-1">önceki döneme göre</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
            <TabsTrigger value="products">Ürün Analizi</TabsTrigger>
            <TabsTrigger value="categories">Kategori Analizi</TabsTrigger>
            <TabsTrigger value="customers">Müşteri Analizi</TabsTrigger>
            <TabsTrigger value="expenses">Gider Analizi</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Günlük Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Günlük Kar Trendi
                  </CardTitle>
                  <CardDescription>Son 5 günün kar performansı</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockData.dailyTrend.map((day, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{day.date}</p>
                          <p className="text-sm text-gray-600">Gelir: {formatCurrency(day.revenue)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{formatCurrency(day.profit)}</p>
                          <p className="text-sm text-gray-600">Marj: {formatPercentage(day.margin)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Kar Dağılımı */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    Kar Dağılımı
                  </CardTitle>
                  <CardDescription>Gelir ve gider dağılımı</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Brüt Kar</span>
                        <span className="text-sm text-green-600">{formatCurrency(mockData.summary.grossProfit)}</span>
                      </div>
                      <Progress value={mockData.summary.grossMargin} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">
                        {formatPercentage(mockData.summary.grossMargin)} brüt kar marjı
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Net Kar</span>
                        <span className="text-sm text-purple-600">{formatCurrency(mockData.summary.netProfit)}</span>
                      </div>
                      <Progress value={mockData.summary.profitMargin} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">
                        {formatPercentage(mockData.summary.profitMargin)} net kar marjı
                      </p>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-green-600">{mockData.summary.salesCount}</p>
                          <p className="text-sm text-gray-600">Toplam Satış</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-blue-600">
                            {formatCurrency(mockData.summary.avgOrderValue)}
                          </p>
                          <p className="text-sm text-gray-600">Ort. Sipariş</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Ürün Bazında Kar Analizi
                </CardTitle>
                <CardDescription>En karlı ürünlerin detaylı analizi</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ürün Adı</TableHead>
                      <TableHead>Satış</TableHead>
                      <TableHead>Gelir</TableHead>
                      <TableHead>Maliyet</TableHead>
                      <TableHead>Kar</TableHead>
                      <TableHead>Marj</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockData.productAnalysis.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.sold} adet</TableCell>
                        <TableCell>{formatCurrency(product.revenue)}</TableCell>
                        <TableCell className="text-red-600">{formatCurrency(product.cost)}</TableCell>
                        <TableCell className="text-green-600 font-bold">{formatCurrency(product.profit)}</TableCell>
                        <TableCell>
                          <Badge variant={product.margin >= 25 ? "default" : "secondary"}>
                            {formatPercentage(product.margin)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Kategori Bazında Kar Analizi</CardTitle>
                <CardDescription>Ürün kategorilerinin kar performansı</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockData.categoryAnalysis.map((category, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium">{category.name}</h3>
                          <p className="text-sm text-gray-600">{category.products} ürün</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{formatCurrency(category.profit)}</p>
                          <Badge variant="outline">{formatPercentage(category.margin)}</Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Gelir: </span>
                          <span className="font-medium">{formatCurrency(category.revenue)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Maliyet: </span>
                          <span className="font-medium text-red-600">{formatCurrency(category.cost)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Müşteri Bazında Kar Analizi
                </CardTitle>
                <CardDescription>En karlı müşterilerin analizi</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Müşteri Adı</TableHead>
                      <TableHead>Sipariş</TableHead>
                      <TableHead>Gelir</TableHead>
                      <TableHead>Maliyet</TableHead>
                      <TableHead>Kar</TableHead>
                      <TableHead>Marj</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockData.customerAnalysis.map((customer, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell>{customer.orders} sipariş</TableCell>
                        <TableCell>{formatCurrency(customer.revenue)}</TableCell>
                        <TableCell className="text-red-600">{formatCurrency(customer.cost)}</TableCell>
                        <TableCell className="text-green-600 font-bold">{formatCurrency(customer.profit)}</TableCell>
                        <TableCell>
                          <Badge variant={customer.margin >= 25 ? "default" : "secondary"}>
                            {formatPercentage(customer.margin)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gider Kategorileri</CardTitle>
                  <CardDescription>Gider dağılımı ve analizi</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockData.expenses.map((expense, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center">
                          <div>
                            <p className="font-medium">{expense.category}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant={expense.isFixed ? "default" : "secondary"} className="text-xs">
                                {expense.isFixed ? "Sabit" : "Değişken"}
                              </Badge>
                              <span className="text-sm text-gray-600">{formatPercentage(expense.percentage)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-red-600">{formatCurrency(expense.amount)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gider Özeti</CardTitle>
                  <CardDescription>Sabit ve değişken gider analizi</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Sabit Giderler</span>
                        <span className="text-sm text-red-600">{formatCurrency(100000)}</span>
                      </div>
                      <Progress value={20.6} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">Toplam giderlerin %20.6'sı</p>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Değişken Giderler</span>
                        <span className="text-sm text-red-600">{formatCurrency(385000)}</span>
                      </div>
                      <Progress value={79.4} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">Toplam giderlerin %79.4'ü</p>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-600">
                          {formatCurrency(mockData.summary.totalExpenses)}
                        </p>
                        <p className="text-sm text-gray-600">Toplam Gider</p>
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-yellow-800">Gider Uyarısı</p>
                          <p className="text-xs text-yellow-700">Değişken giderler hedefin %15 üzerinde</p>
                        </div>
                      </div>
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
