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
  CreditCard,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Upload,
} from "lucide-react"
import Link from "next/link"

interface CheckNote {
  id: string
  type: "check" | "note"
  number: string
  amount: number
  issueDate: Date
  dueDate: Date
  status: "pending" | "paid" | "overdue" | "cancelled"
  customerSupplier: string
  bank?: string
  description: string
}

export default function ChecksNotesPage() {
  const [checksNotes, setChecksNotes] = useState<CheckNote[]>([
    {
      id: "1",
      type: "check",
      number: "CHK-001",
      amount: 25000,
      issueDate: new Date("2024-01-01"),
      dueDate: new Date("2024-02-01"),
      status: "pending",
      customerSupplier: "ABC Teknoloji Ltd.",
      bank: "Ziraat Bankası",
      description: "Ürün alımı ödemesi",
    },
    {
      id: "2",
      type: "note",
      number: "NOT-001",
      amount: 15000,
      issueDate: new Date("2024-01-05"),
      dueDate: new Date("2024-01-20"),
      status: "overdue",
      customerSupplier: "Ahmet Yılmaz",
      description: "Satış senet ödemesi",
    },
    {
      id: "3",
      type: "check",
      number: "CHK-002",
      amount: 35000,
      issueDate: new Date("2024-01-10"),
      dueDate: new Date("2024-02-10"),
      status: "paid",
      customerSupplier: "XYZ Elektronik A.Ş.",
      bank: "İş Bankası",
      description: "Tedarikçi ödemesi",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("tr-TR")
  }

  const filteredItems = checksNotes.filter((item) => {
    const matchesSearch =
      item.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customerSupplier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesType = typeFilter === "all" || item.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Beklemede
          </Badge>
        )
      case "paid":
        return (
          <Badge variant="default">
            <CheckCircle className="h-3 w-3 mr-1" />
            Ödendi
          </Badge>
        )
      case "overdue":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Vadesi Geçti
          </Badge>
        )
      case "cancelled":
        return <Badge variant="outline">İptal</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    return type === "check" ? (
      <Badge variant="outline">
        <CreditCard className="h-3 w-3 mr-1" />
        Çek
      </Badge>
    ) : (
      <Badge variant="outline">
        <FileText className="h-3 w-3 mr-1" />
        Senet
      </Badge>
    )
  }

  const getTotalByStatus = (status: string) => {
    return checksNotes.filter((item) => item.status === status).reduce((sum, item) => sum + item.amount, 0)
  }

  const exportToExcel = () => {
    alert("Çek/Senet listesi Excel'e aktarılıyor...")
  }

  const importFromExcel = () => {
    alert("Excel'den çek/senet listesi yükleniyor...")
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
                <h1 className="text-3xl font-bold text-gray-900">Çek & Senet Takibi</h1>
                <p className="text-gray-600">Çek ve senet yönetimi ve vade takibi</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={importFromExcel}>
                <Upload className="h-4 w-4 mr-2" />
                Excel'den Al
              </Button>
              <Button variant="outline" onClick={exportToExcel}>
                <Download className="h-4 w-4 mr-2" />
                Excel'e Ver
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Ekle
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Yeni Çek/Senet Ekle</DialogTitle>
                    <DialogDescription>Çek veya senet bilgilerini girin</DialogDescription>
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
                            <SelectItem value="check">Çek</SelectItem>
                            <SelectItem value="note">Senet</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="number">Numara</Label>
                        <Input id="number" placeholder="Çek/Senet numarası" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="amount">Tutar</Label>
                      <Input id="amount" type="number" placeholder="0" />
                    </div>
                    <div>
                      <Label htmlFor="customerSupplier">Müşteri/Tedarikçi</Label>
                      <Input id="customerSupplier" placeholder="Müşteri veya tedarikçi adı" />
                    </div>
                    <div>
                      <Label htmlFor="bank">Banka (Çek için)</Label>
                      <Input id="bank" placeholder="Banka adı" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Düzenleme Tarihi</Label>
                        <Input type="date" className="w-full" />
                      </div>
                      <div>
                        <Label>Vade Tarihi</Label>
                        <Input type="date" className="w-full" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Açıklama</Label>
                      <Input id="description" placeholder="Açıklama" />
                    </div>
                    <Button className="w-full">Ekle</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Bekleyen</p>
                  <p className="text-2xl font-bold">₺{getTotalByStatus("pending").toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ödenen</p>
                  <p className="text-2xl font-bold">₺{getTotalByStatus("paid").toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Vadesi Geçen</p>
                  <p className="text-2xl font-bold">₺{getTotalByStatus("overdue").toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam</p>
                  <p className="text-2xl font-bold">{checksNotes.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">Tümü</TabsTrigger>
            <TabsTrigger value="checks">Çekler</TabsTrigger>
            <TabsTrigger value="notes">Senetler</TabsTrigger>
            <TabsTrigger value="overdue">Vadesi Geçenler</TabsTrigger>
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
                      <SelectItem value="check">Çek</SelectItem>
                      <SelectItem value="note">Senet</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Durum" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tümü</SelectItem>
                      <SelectItem value="pending">Beklemede</SelectItem>
                      <SelectItem value="paid">Ödendi</SelectItem>
                      <SelectItem value="overdue">Vadesi Geçti</SelectItem>
                      <SelectItem value="cancelled">İptal</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">Filtrele</Button>
                </div>
              </CardContent>
            </Card>

            {/* Table */}
            <Card>
              <CardHeader>
                <CardTitle>Çek & Senet Listesi</CardTitle>
                <CardDescription>Tüm çek ve senetlerinizi buradan takip edebilirsiniz</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tür</TableHead>
                      <TableHead>Numara</TableHead>
                      <TableHead>Müşteri/Tedarikçi</TableHead>
                      <TableHead>Tutar</TableHead>
                      <TableHead>Vade Tarihi</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{getTypeBadge(item.type)}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.number}</p>
                            {item.bank && <p className="text-sm text-gray-600">{item.bank}</p>}
                          </div>
                        </TableCell>
                        <TableCell>₺{item.amount.toLocaleString()}</TableCell>
                        <TableCell>{formatDate(item.dueDate)}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              Düzenle
                            </Button>
                            <Button size="sm" variant="outline">
                              Ödendi
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

          <TabsContent value="checks">
            <Card>
              <CardHeader>
                <CardTitle>Çek Listesi</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Çek No</TableHead>
                      <TableHead>Banka</TableHead>
                      <TableHead>Müşteri/Tedarikçi</TableHead>
                      <TableHead>Tutar</TableHead>
                      <TableHead>Vade</TableHead>
                      <TableHead>Durum</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems
                      .filter((item) => item.type === "check")
                      .map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.number}</TableCell>
                          <TableCell>{item.bank}</TableCell>
                          <TableCell>{item.customerSupplier}</TableCell>
                          <TableCell>₺{item.amount.toLocaleString()}</TableCell>
                          <TableCell>{formatDate(item.dueDate)}</TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Senet Listesi</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Senet No</TableHead>
                      <TableHead>Müşteri/Tedarikçi</TableHead>
                      <TableHead>Tutar</TableHead>
                      <TableHead>Vade</TableHead>
                      <TableHead>Durum</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems
                      .filter((item) => item.type === "note")
                      .map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.number}</TableCell>
                          <TableCell>{item.customerSupplier}</TableCell>
                          <TableCell>₺{item.amount.toLocaleString()}</TableCell>
                          <TableCell>{formatDate(item.dueDate)}</TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overdue">
            <Card>
              <CardHeader>
                <CardTitle>Vadesi Geçen Çek & Senetler</CardTitle>
                <CardDescription>Acil takip gerektiren vadesi geçmiş ödemeler</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tür</TableHead>
                      <TableHead>Numara</TableHead>
                      <TableHead>Müşteri/Tedarikçi</TableHead>
                      <TableHead>Tutar</TableHead>
                      <TableHead>Vade</TableHead>
                      <TableHead>Gecikme</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems
                      .filter((item) => item.status === "overdue")
                      .map((item) => {
                        const daysOverdue = Math.floor(
                          (new Date().getTime() - item.dueDate.getTime()) / (1000 * 3600 * 24),
                        )
                        return (
                          <TableRow key={item.id}>
                            <TableCell>{getTypeBadge(item.type)}</TableCell>
                            <TableCell>{item.number}</TableCell>
                            <TableCell>{item.customerSupplier}</TableCell>
                            <TableCell>₺{item.amount.toLocaleString()}</TableCell>
                            <TableCell>{formatDate(item.dueDate)}</TableCell>
                            <TableCell>
                              <Badge variant="destructive">{daysOverdue} gün</Badge>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
