"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ShoppingCart,
  Users,
  Package,
  FileText,
  BarChart3,
  Settings,
  TrendingUp,
  DollarSign,
  Building2,
  CreditCard,
  Upload,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "../../simple-auth"

export default function AdminDashboard() {
  const [stats] = useState({
    todaySales: 15420,
    totalCustomers: 156,
    totalProducts: 89,
    pendingOrders: 12,
    monthlyRevenue: 245600,
    topProduct: "Laptop Dell XPS",
  })

  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const quickActions = [
    {
      title: "Satış Yap",
      description: "Yeni satış kaydı oluştur",
      icon: ShoppingCart,
      href: "/admin/sales/new",
      color: "bg-green-500",
    },
    {
      title: "Müşteriler",
      description: "Müşteri listesi ve yönetimi",
      icon: Users,
      href: "/admin/customers",
      color: "bg-blue-500",
    },
    {
      title: "Ürünler",
      description: "Ürün kataloğu ve stok yönetimi",
      icon: Package,
      href: "/admin/products",
      color: "bg-purple-500",
    },
    {
      title: "Tedarikçiler",
      description: "Tedarikçi yönetimi ve borç takibi",
      icon: Building2,
      href: "/admin/suppliers",
      color: "bg-indigo-500",
    },
    {
      title: "E-Katalog",
      description: "Ürün kataloğu ve görsel yönetimi",
      icon: FileText,
      href: "/admin/catalog",
      color: "bg-pink-500",
    },
    {
      title: "Çek & Senet",
      description: "Çek ve senet takibi",
      icon: CreditCard,
      href: "/admin/checks-notes",
      color: "bg-yellow-500",
    },
    {
      title: "Toplu İşlemler",
      description: "Excel ile veri alma/verme",
      icon: Upload,
      href: "/admin/bulk-operations",
      color: "bg-cyan-500",
    },
    {
      title: "Satış Geçmişi",
      description: "Tüm satış kayıtları",
      icon: FileText,
      href: "/admin/sales",
      color: "bg-orange-500",
    },
    {
      title: "Raporlar",
      description: "Detaylı satış raporları",
      icon: BarChart3,
      href: "/admin/reports",
      color: "bg-red-500",
    },
    {
      title: "Ayarlar",
      description: "Sistem ayarları",
      icon: Settings,
      href: "/admin/settings",
      color: "bg-gray-500",
    },
    {
      title: "Eski Satışları Yükle",
      description: "Görsel/PDF'den eski verileri aktar",
      icon: Upload,
      href: "/admin/import-history",
      color: "bg-teal-500",
    },
    {
      title: "Teklif & Sipariş",
      description: "Teklif ve sipariş yönetimi",
      icon: FileText,
      href: "/admin/quotes-orders",
      color: "bg-emerald-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Paneli</h1>
              <p className="text-gray-600">Kapsamlı satış yönetim sistemi</p>
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
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Bugünkü Satış</p>
                  <p className="text-2xl font-bold text-gray-900">₺{stats.todaySales.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Müşteri</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Ürün</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Aylık Ciro</p>
                  <p className="text-2xl font-bold text-gray-900">₺{stats.monthlyRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Hızlı İşlemler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className={`p-3 rounded-lg ${action.color}`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">{action.title}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Son Satışlar</CardTitle>
              <CardDescription>Bugün yapılan son 5 satış</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Satış #{1000 + item}</p>
                      <p className="text-sm text-gray-600">Ahmet Yılmaz - Laptop Dell</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₺{(15000 + item * 500).toLocaleString()}</p>
                      <Badge variant="secondary">Tamamlandı</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stok Uyarıları</CardTitle>
              <CardDescription>Düşük stoklu ürünler</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "iPhone 15 Pro", stock: 3 },
                  { name: "Samsung Galaxy S24", stock: 5 },
                  { name: "MacBook Air M2", stock: 2 },
                  { name: 'iPad Pro 12.9"', stock: 4 },
                ].map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">Stok: {product.stock} adet</p>
                    </div>
                    <Badge variant="destructive">Düşük Stok</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
