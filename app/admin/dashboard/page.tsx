import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  CreditCard,
  Settings,
  Package2,
  PieChart,
  LineChart,
  TrendingUp,
  TrendingDown,
  Target,
} from "lucide-react"
import Link from "next/link"

const DashboardPage = () => {
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                <p className="text-2xl font-bold text-purple-600">₺45,231.89</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+20.1%</span>
              <span className="text-gray-500 ml-1">geçen aya göre</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Sipariş</p>
                <p className="text-2xl font-bold text-blue-600">1,250</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-red-500">-12.5%</span>
              <span className="text-gray-500 ml-1">geçen aya göre</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Yeni Müşteriler</p>
                <p className="text-2xl font-bold text-green-600">235</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <LineChart className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+35.7%</span>
              <span className="text-gray-500 ml-1">geçen aya göre</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Geri Dönüş Oranı</p>
                <p className="text-2xl font-bold text-orange-600">4.5%</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <PieChart className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+1.2%</span>
              <span className="text-gray-500 ml-1">geçen aya göre</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktif Hedefler</p>
                <p className="text-2xl font-bold text-purple-600">3</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">%73.2</span>
              <span className="text-gray-500 ml-1">ortalama başarı</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Aylık Satışlar</CardTitle>
            <CardDescription>Bu ayki satış performansına genel bakış.</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart className="h-64" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ayarlar</CardTitle>
            <CardDescription>Hesap ayarlarınızı ve tercihlerinizi yönetin.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Settings className="h-6 w-6 text-gray-500" />
              <p>Hesap Ayarları</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Navigasyon</CardTitle>
          </CardHeader>
          <CardContent>
            <nav>
              <Link href="/admin">
                <Button variant="ghost" className="w-full justify-start">
                  Dashboard
                </Button>
              </Link>
              <Link href="/admin/settings">
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Ayarlar
                </Button>
              </Link>
              <Link href="/admin/targets">
                <Button variant="ghost" className="w-full justify-start">
                  <Target className="h-4 w-4 mr-2" />
                  Kar Hedefleri
                </Button>
              </Link>
            </nav>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage
