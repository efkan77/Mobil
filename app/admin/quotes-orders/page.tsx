"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Plus,
  Search,
  FileText,
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Send,
} from "lucide-react"
import Link from "next/link"

interface QuoteOrder {
  id: string
  type: "quote" | "order"
  customerName: string
  date: string
  validUntil?: string
  items: Array<{
    name: string
    quantity: number
    unitPrice: number
    total: number
  }>
  total: number
  status: "draft" | "sent" | "approved" | "rejected" | "completed"
  notes: string
}

export default function QuotesOrdersPage() {
  const [quotesOrders, setQuotesOrders] = useState<QuoteOrder[]>([
    {
      id: "T001",
      type: "quote",
      customerName: "Ahmet Yılmaz",
      date: "2024-01-15",
      validUntil: "2024-01-30",
      items: [
        { name: "iPhone 15 Pro", quantity: 1, unitPrice: 45000, total: 45000 },
        { name: "Kılıf", quantity: 1, unitPrice: 500, total: 500 },
      ],
      total: 45500,
      status: "sent",
      notes: "Müşteri fiyat karşılaştırması yapıyor",
    },
    {
      id: "S001",
      type: "order",
      customerName: "Fatma Demir",
      date: "2024-01-14",
      items: [{ name: "MacBook Air M2", quantity: 1, unitPrice: 55000, total: 55000 }],
      total: 55000,
      status: "approved",
      notes: "Acil teslimat gerekli",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const filteredItems = quotesOrders.filter((item) => {
    const matchesSearch =
      item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesType = typeFilter === "all" || item.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <Badge variant="secondary">
            <Edit className="h-3 w-3 mr-1" />
            Taslak
          </Badge>
        )
      case "sent":
        return (
          <Badge variant="outline">
            <Send className="h-3 w-3 mr-1" />
            Gönderildi
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="default">
            <CheckCircle className="h-3 w-3 mr-1" />
            Onaylandı
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Reddedildi
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="default">
            <CheckCircle className="h-3 w-3 mr-1" />
            Tamamlandı
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    return type === "quote" ? (
      <Badge variant="outline">
        <FileText className="h-3 w-3 mr-1" />
        Teklif
      </Badge>
    ) : (
      <Badge variant="outline">
        <ShoppingCart className="h-3 w-3 mr-1" />
        Sipariş
      </Badge>
    )
  }

  const convertToOrder = (quoteId: string) => {
    const quote = quotesOrders.find((q) => q.id === quoteId)
    if (!quote) return

    const newOrder: QuoteOrder = {
      ...quote,
      id: `S${Date.now().toString().slice(-3)}`,
      type: "order",
      status: "approved",
      validUntil: undefined,
    }

    setQuotesOrders([...quotesOrders, newOrder])
    alert("Teklif siparişe dönüştürüldü!")
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
                <h1 className="text-3xl font-bold text-gray-900">Teklif & Sipariş Yönetimi</h1>
                <p className="text-gray-600">Teklifler ve siparişleri yönetin</p>
              </div>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Teklif/Sipariş
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Yeni Teklif/Sipariş Oluştur</DialogTitle>
                  <DialogDescription>Teklif veya sipariş bilgilerini girin</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Tür</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Tür seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="quote">Teklif</SelectItem>
                          <SelectItem value="order">Sipariş</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="customer">Müşteri</Label>
                      <Input placeholder="Müşteri adı" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Tarih</Label>
                      <Input type="date" />
                    </div>
                    <div>
                      <Label htmlFor="validUntil">Geçerlilik (Teklif için)</Label>
                      <Input type="date" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="notes">Notlar</Label>
                    <Input placeholder="Özel notlar..." />
                  </div>
                  <Button className="w-full">Oluştur</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Aktif Teklifler</p>
                  <p className="text-2xl font-bold">{quotesOrders.filter((q) => q.type === "quote").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <ShoppingCart className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Aktif Siparişler</p>
                  <p className="text-2xl font-bold">{quotesOrders.filter((q) => q.type === "order").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Bekleyen</p>
                  <p className="text-2xl font-bold">{quotesOrders.filter((q) => q.status === "sent").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Onaylanan</p>
                  <p className="text-2xl font-bold">{quotesOrders.filter((q) => q.status === "approved").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">Tümü</TabsTrigger>
            <TabsTrigger value="quotes">Teklifler</TabsTrigger>
            <TabsTrigger value="orders">Siparişler</TabsTrigger>
            <TabsTrigger value="pending">Bekleyenler</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tür" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tümü</SelectItem>
                      <SelectItem value="quote">Teklif</SelectItem>
                      <SelectItem value="order">Sipariş</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Durum" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tümü</SelectItem>
                      <SelectItem value="draft">Taslak</SelectItem>
                      <SelectItem value="sent">Gönderildi</SelectItem>
                      <SelectItem value="approved">Onaylandı</SelectItem>
                      <SelectItem value="rejected">Reddedildi</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">Filtrele</Button>
                </div>
              </CardContent>
            </Card>

            {/* Table */}
            <Card>
              <CardHeader>
                <CardTitle>Teklif & Sipariş Listesi</CardTitle>
                <CardDescription>Tüm teklifler ve siparişler</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tür</TableHead>
                      <TableHead>No</TableHead>
                      <TableHead>Müşteri</TableHead>
                      <TableHead>Tarih</TableHead>
                      <TableHead>Tutar</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{getTypeBadge(item.type)}</TableCell>
                        <TableCell className="font-medium">#{item.id}</TableCell>
                        <TableCell>{item.customerName}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>₺{item.total.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            {item.type === "quote" && item.status === "approved" && (
                              <Button size="sm" onClick={() => convertToOrder(item.id)}>
                                Siparişe Çevir
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quotes">
            <Card>
              <CardHeader>
                <CardTitle>Teklifler</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Teklif No</TableHead>
                      <TableHead>Müşteri</TableHead>
                      <TableHead>Geçerlilik</TableHead>
                      <TableHead>Tutar</TableHead>
                      <TableHead>Durum</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems
                      .filter((item) => item.type === "quote")
                      .map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>#{item.id}</TableCell>
                          <TableCell>{item.customerName}</TableCell>
                          <TableCell>{item.validUntil}</TableCell>
                          <TableCell>₺{item.total.toLocaleString()}</TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Siparişler</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sipariş No</TableHead>
                      <TableHead>Müşteri</TableHead>
                      <TableHead>Tarih</TableHead>
                      <TableHead>Tutar</TableHead>
                      <TableHead>Durum</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems
                      .filter((item) => item.type === "order")
                      .map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>#{item.id}</TableCell>
                          <TableCell>{item.customerName}</TableCell>
                          <TableCell>{item.date}</TableCell>
                          <TableCell>₺{item.total.toLocaleString()}</TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Bekleyen Teklifler</CardTitle>
                <CardDescription>Müşteri yanıtı beklenen teklifler</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredItems
                    .filter((item) => item.status === "sent")
                    .map((item) => (
                      <div key={item.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">
                              #{item.id} - {item.customerName}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Geçerlilik: {item.validUntil} | Tutar: ₺{item.total.toLocaleString()}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              Hatırlat
                            </Button>
                            <Button size="sm">Takip Et</Button>
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
