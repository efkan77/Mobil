"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Target,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  Bell,
  Award,
} from "lucide-react"
import Link from "next/link"

interface ProfitTarget {
  id: number
  target_type: string
  target_period: string
  revenue_target: number
  profit_target: number
  margin_target: number
  sales_target: number
  category_name?: string
  product_name?: string
  status: string
  notes?: string
  created_at: string
}

export default function TargetsPage() {
  const [targets, setTargets] = useState<ProfitTarget[]>([])
  const [isAddTargetOpen, setIsAddTargetOpen] = useState(false)
  const [selectedTarget, setSelectedTarget] = useState<ProfitTarget | null>(null)
  const [newTarget, setNewTarget] = useState({
    target_type: "monthly",
    target_period: "",
    revenue_target: 0,
    profit_target: 0,
    margin_target: 20,
    sales_target: 0,
    category_id: null,
    product_id: null,
    notes: "",
  })

  // Mock data - gerçek uygulamada API'den gelecek
  const mockTargets: ProfitTarget[] = [
    {
      id: 1,
      target_type: "yearly",
      target_period: "2024",
      revenue_target: 30000000,
      profit_target: 6000000,
      margin_target: 20,
      sales_target: 2000,
      status: "active",
      notes: "Yıllık genel hedef",
      created_at: "2024-01-01",
    },
    {
      id: 2,
      target_type: "monthly",
      target_period: "2024-01",
      revenue_target: 2500000,
      profit_target: 500000,
      margin_target: 20,
      sales_target: 170,
      status: "completed",
      notes: "Ocak ayı hedefi",
      created_at: "2024-01-01",
    },
    {
      id: 3,
      target_type: "monthly",
      target_period: "2024-02",
      revenue_target: 2800000,
      profit_target: 560000,
      margin_target: 20,
      sales_target: 180,
      status: "active",
      notes: "Şubat ayı hedefi",
      created_at: "2024-02-01",
    },
    {
      id: 4,
      target_type: "quarterly",
      target_period: "2024-Q1",
      revenue_target: 7500000,
      profit_target: 1500000,
      margin_target: 20,
      sales_target: 500,
      category_name: "Telefon & Tablet",
      status: "active",
      notes: "Q1 telefon kategorisi hedefi",
      created_at: "2024-01-01",
    },
  ]

  const mockAchievements = [
    {
      targetId: 1,
      actual_revenue: 18500000,
      actual_profit: 3700000,
      actual_margin: 20,
      actual_sales: 1250,
      achievement_revenue: 61.7,
      achievement_profit: 61.7,
      achievement_margin: 100,
      achievement_sales: 62.5,
    },
    {
      targetId: 2,
      actual_revenue: 2650000,
      actual_profit: 530000,
      actual_margin: 20,
      actual_sales: 175,
      achievement_revenue: 106,
      achievement_profit: 106,
      achievement_margin: 100,
      achievement_sales: 102.9,
    },
    {
      targetId: 3,
      actual_revenue: 1850000,
      actual_profit: 370000,
      actual_margin: 20,
      actual_sales: 125,
      achievement_revenue: 66.1,
      achievement_profit: 66.1,
      achievement_margin: 100,
      achievement_sales: 69.4,
    },
    {
      targetId: 4,
      actual_revenue: 4200000,
      actual_profit: 840000,
      actual_margin: 20,
      actual_sales: 280,
      achievement_revenue: 56,
      achievement_profit: 56,
      achievement_margin: 100,
      achievement_sales: 56,
    },
  ]

  useEffect(() => {
    setTargets(mockTargets)
    // Varsayılan dönem ayarla
    const currentDate = new Date()
    const currentMonth = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")}`
    setNewTarget((prev) => ({ ...prev, target_period: currentMonth }))
  }, [])

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

  const getTargetTypeLabel = (type: string) => {
    switch (type) {
      case "monthly":
        return "Aylık"
      case "quarterly":
        return "Çeyreklik"
      case "yearly":
        return "Yıllık"
      default:
        return type
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-blue-100 text-blue-800">Aktif</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Tamamlandı</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">İptal</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getAchievementColor = (percentage: number) => {
    if (percentage >= 100) return "text-green-600"
    if (percentage >= 80) return "text-yellow-600"
    return "text-red-600"
  }

  const getAchievementIcon = (percentage: number) => {
    if (percentage >= 100) return <CheckCircle className="h-4 w-4 text-green-600" />
    if (percentage >= 80) return <Clock className="h-4 w-4 text-yellow-600" />
    return <AlertTriangle className="h-4 w-4 text-red-600" />
  }

  const addTarget = () => {
    if (!newTarget.target_period || !newTarget.revenue_target || !newTarget.profit_target) {
      alert("Lütfen gerekli alanları doldurun")
      return
    }

    const target: ProfitTarget = {
      id: Date.now(),
      ...newTarget,
      status: "active",
      created_at: new Date().toISOString(),
    }

    setTargets([target, ...targets])
    setNewTarget({
      target_type: "monthly",
      target_period: "",
      revenue_target: 0,
      profit_target: 0,
      margin_target: 20,
      sales_target: 0,
      category_id: null,
      product_id: null,
      notes: "",
    })
    setIsAddTargetOpen(false)
    alert("Hedef başarıyla eklendi!")
  }

  const deleteTarget = (id: number) => {
    if (confirm("Bu hedefi silmek istediğinizden emin misiniz?")) {
      setTargets(targets.filter((t) => t.id !== id))
    }
  }

  const updateTargetStatus = (id: number, status: string) => {
    setTargets(targets.map((t) => (t.id === id ? { ...t, status } : t)))
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
                <h1 className="text-3xl font-bold text-gray-900">Kar Hedefleri</h1>
                <p className="text-gray-600">Aylık, çeyreklik ve yıllık kar hedeflerinizi yönetin</p>
              </div>
            </div>
            <Dialog open={isAddTargetOpen} onOpenChange={setIsAddTargetOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Hedef
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Yeni Kar Hedefi</DialogTitle>
                  <DialogDescription>Yeni bir kar hedefi belirleyin ve takip edin</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="targetType">Hedef Türü</Label>
                      <Select
                        value={newTarget.target_type}
                        onValueChange={(value) => setNewTarget({ ...newTarget, target_type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Aylık</SelectItem>
                          <SelectItem value="quarterly">Çeyreklik</SelectItem>
                          <SelectItem value="yearly">Yıllık</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="targetPeriod">Dönem</Label>
                      <Input
                        id="targetPeriod"
                        type={newTarget.target_type === "yearly" ? "number" : "month"}
                        value={newTarget.target_period}
                        onChange={(e) => setNewTarget({ ...newTarget, target_period: e.target.value })}
                        placeholder={
                          newTarget.target_type === "yearly"
                            ? "2024"
                            : newTarget.target_type === "quarterly"
                              ? "2024-Q1"
                              : "2024-01"
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="revenueTarget">Gelir Hedefi (₺)</Label>
                      <Input
                        id="revenueTarget"
                        type="number"
                        value={newTarget.revenue_target}
                        onChange={(e) => setNewTarget({ ...newTarget, revenue_target: Number(e.target.value) })}
                        placeholder="2500000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="profitTarget">Kar Hedefi (₺)</Label>
                      <Input
                        id="profitTarget"
                        type="number"
                        value={newTarget.profit_target}
                        onChange={(e) => setNewTarget({ ...newTarget, profit_target: Number(e.target.value) })}
                        placeholder="500000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="marginTarget">Kar Marjı Hedefi (%)</Label>
                      <Input
                        id="marginTarget"
                        type="number"
                        value={newTarget.margin_target}
                        onChange={(e) => setNewTarget({ ...newTarget, margin_target: Number(e.target.value) })}
                        placeholder="20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="salesTarget">Satış Adedi Hedefi</Label>
                      <Input
                        id="salesTarget"
                        type="number"
                        value={newTarget.sales_target}
                        onChange={(e) => setNewTarget({ ...newTarget, sales_target: Number(e.target.value) })}
                        placeholder="170"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notlar</Label>
                    <Textarea
                      id="notes"
                      value={newTarget.notes}
                      onChange={(e) => setNewTarget({ ...newTarget, notes: e.target.value })}
                      placeholder="Hedef hakkında notlar..."
                    />
                  </div>

                  <Button onClick={addTarget} className="w-full">
                    Hedef Oluştur
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Özet Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aktif Hedefler</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {targets.filter((t) => t.status === "active").length}
                  </p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tamamlanan</p>
                  <p className="text-2xl font-bold text-green-600">
                    {targets.filter((t) => t.status === "completed").length}
                  </p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ortalama Başarı</p>
                  <p className="text-2xl font-bold text-purple-600">%73.2</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Uyarılar</p>
                  <p className="text-2xl font-bold text-red-600">2</p>
                </div>
                <div className="p-2 bg-red-100 rounded-lg">
                  <Bell className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
            <TabsTrigger value="targets">Hedef Listesi</TabsTrigger>
            <TabsTrigger value="tracking">Takip</TabsTrigger>
            <TabsTrigger value="notifications">Bildirimler</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Aktif Hedefler */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Aktif Hedefler
                  </CardTitle>
                  <CardDescription>Şu anda takip edilen hedefler</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {targets
                      .filter((t) => t.status === "active")
                      .slice(0, 3)
                      .map((target) => {
                        const achievement = mockAchievements.find((a) => a.targetId === target.id)
                        return (
                          <div key={target.id} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h3 className="font-medium">
                                  {getTargetTypeLabel(target.target_type)} - {target.target_period}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {target.category_name || target.product_name || "Genel Hedef"}
                                </p>
                              </div>
                              {getAchievementIcon(achievement?.achievement_revenue || 0)}
                            </div>
                            <div className="space-y-2">
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Gelir</span>
                                  <span className={getAchievementColor(achievement?.achievement_revenue || 0)}>
                                    {formatPercentage(achievement?.achievement_revenue || 0)}
                                  </span>
                                </div>
                                <Progress value={achievement?.achievement_revenue || 0} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Kar</span>
                                  <span className={getAchievementColor(achievement?.achievement_profit || 0)}>
                                    {formatPercentage(achievement?.achievement_profit || 0)}
                                  </span>
                                </div>
                                <Progress value={achievement?.achievement_profit || 0} className="h-2" />
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </CardContent>
              </Card>

              {/* Hedef Performansı */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Hedef Performansı
                  </CardTitle>
                  <CardDescription>Son 3 ayın hedef başarı oranları</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      { month: "Ocak 2024", achievement: 106, status: "completed" },
                      { month: "Şubat 2024", achievement: 66.1, status: "active" },
                      { month: "Mart 2024", achievement: 0, status: "planned" },
                    ].map((month, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">{month.month}</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm ${getAchievementColor(month.achievement)}`}>
                              {month.achievement > 0 ? formatPercentage(month.achievement) : "Planlandı"}
                            </span>
                            {month.status === "completed" && <CheckCircle className="h-4 w-4 text-green-600" />}
                            {month.status === "active" && <Clock className="h-4 w-4 text-yellow-600" />}
                          </div>
                        </div>
                        <Progress value={month.achievement} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="targets">
            <Card>
              <CardHeader>
                <CardTitle>Tüm Hedefler</CardTitle>
                <CardDescription>Oluşturulan tüm kar hedeflerinin listesi</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dönem</TableHead>
                      <TableHead>Tür</TableHead>
                      <TableHead>Gelir Hedefi</TableHead>
                      <TableHead>Kar Hedefi</TableHead>
                      <TableHead>Marj</TableHead>
                      <TableHead>Satış</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {targets.map((target) => (
                      <TableRow key={target.id}>
                        <TableCell className="font-medium">
                          {target.target_period}
                          {target.category_name && <div className="text-xs text-gray-500">{target.category_name}</div>}
                        </TableCell>
                        <TableCell>{getTargetTypeLabel(target.target_type)}</TableCell>
                        <TableCell>{formatCurrency(target.revenue_target)}</TableCell>
                        <TableCell>{formatCurrency(target.profit_target)}</TableCell>
                        <TableCell>{formatPercentage(target.margin_target)}</TableCell>
                        <TableCell>{target.sales_target}</TableCell>
                        <TableCell>{getStatusBadge(target.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            {target.status === "active" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateTargetStatus(target.id, "completed")}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button size="sm" variant="destructive" onClick={() => deleteTarget(target.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tracking">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {targets
                .filter((t) => t.status === "active")
                .map((target) => {
                  const achievement = mockAchievements.find((a) => a.targetId === target.id)
                  return (
                    <Card key={target.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {getTargetTypeLabel(target.target_type)} Hedef - {target.target_period}
                        </CardTitle>
                        <CardDescription>
                          {target.category_name || target.product_name || "Genel Hedef"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Gelir Takibi */}
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium">Gelir Hedefi</span>
                              <span className="text-sm text-gray-600">
                                {formatCurrency(achievement?.actual_revenue || 0)} /{" "}
                                {formatCurrency(target.revenue_target)}
                              </span>
                            </div>
                            <Progress value={achievement?.achievement_revenue || 0} className="h-3" />
                            <div className="flex justify-between mt-1">
                              <span className={`text-xs ${getAchievementColor(achievement?.achievement_revenue || 0)}`}>
                                {formatPercentage(achievement?.achievement_revenue || 0)} tamamlandı
                              </span>
                              <span className="text-xs text-gray-500">
                                Kalan: {formatCurrency(target.revenue_target - (achievement?.actual_revenue || 0))}
                              </span>
                            </div>
                          </div>

                          {/* Kar Takibi */}
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium">Kar Hedefi</span>
                              <span className="text-sm text-gray-600">
                                {formatCurrency(achievement?.actual_profit || 0)} /{" "}
                                {formatCurrency(target.profit_target)}
                              </span>
                            </div>
                            <Progress value={achievement?.achievement_profit || 0} className="h-3" />
                            <div className="flex justify-between mt-1">
                              <span className={`text-xs ${getAchievementColor(achievement?.achievement_profit || 0)}`}>
                                {formatPercentage(achievement?.achievement_profit || 0)} tamamlandı
                              </span>
                              <span className="text-xs text-gray-500">
                                Kalan: {formatCurrency(target.profit_target - (achievement?.actual_profit || 0))}
                              </span>
                            </div>
                          </div>

                          {/* Satış Takibi */}
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium">Satış Hedefi</span>
                              <span className="text-sm text-gray-600">
                                {achievement?.actual_sales || 0} / {target.sales_target} adet
                              </span>
                            </div>
                            <Progress value={achievement?.achievement_sales || 0} className="h-3" />
                            <div className="flex justify-between mt-1">
                              <span className={`text-xs ${getAchievementColor(achievement?.achievement_sales || 0)}`}>
                                {formatPercentage(achievement?.achievement_sales || 0)} tamamlandı
                              </span>
                              <span className="text-xs text-gray-500">
                                Kalan: {target.sales_target - (achievement?.actual_sales || 0)} adet
                              </span>
                            </div>
                          </div>

                          {/* Kar Marjı */}
                          <div className="pt-2 border-t">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">Kar Marjı</span>
                              <div className="text-right">
                                <span className="text-sm font-bold">
                                  {formatPercentage(achievement?.actual_margin || 0)}
                                </span>
                                <div className="text-xs text-gray-500">
                                  Hedef: {formatPercentage(target.margin_target)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Hedef Bildirimleri
                </CardTitle>
                <CardDescription>Hedef durumu ve uyarıları</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      type: "warning",
                      message: "Şubat 2024 hedefi %66 seviyesinde - hedefin altında",
                      time: "2 saat önce",
                      target: "Aylık - 2024-02",
                    },
                    {
                      type: "success",
                      message: "Ocak 2024 hedefi %106 ile başarıyla tamamlandı!",
                      time: "1 gün önce",
                      target: "Aylık - 2024-01",
                    },
                    {
                      type: "danger",
                      message: "Q1 Telefon kategorisi hedefi kritik seviyede (%56)",
                      time: "3 saat önce",
                      target: "Çeyreklik - 2024-Q1",
                    },
                    {
                      type: "info",
                      message: "Yeni aylık hedef oluşturuldu: Mart 2024",
                      time: "1 hafta önce",
                      target: "Aylık - 2024-03",
                    },
                  ].map((notification, index) => (
                    <div key={index} className="flex items-start p-4 border rounded-lg">
                      <div className="mr-3 mt-1">
                        {notification.type === "success" && <CheckCircle className="h-5 w-5 text-green-600" />}
                        {notification.type === "warning" && <AlertTriangle className="h-5 w-5 text-yellow-600" />}
                        {notification.type === "danger" && <AlertTriangle className="h-5 w-5 text-red-600" />}
                        {notification.type === "info" && <Bell className="h-5 w-5 text-blue-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{notification.message}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-500">{notification.target}</span>
                          <span className="text-xs text-gray-500">{notification.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
