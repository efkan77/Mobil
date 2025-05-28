"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Search, Edit, Trash2, Building2, ArrowLeft, Upload, Download } from "lucide-react"
import Link from "next/link"

interface Supplier {
  id: string
  name: string
  contactPerson: string
  phone: string
  email: string
  address: string
  taxNumber: string
  paymentTerms: string
  status: "active" | "inactive"
  totalDebt: number
  totalPaid: number
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: "1",
      name: "ABC Teknoloji Ltd.",
      contactPerson: "Mehmet Özkan",
      phone: "0212 555 01 01",
      email: "mehmet@abcteknoloji.com",
      address: "Maslak Mah. Büyükdere Cad. No:123 Şişli/İstanbul",
      taxNumber: "1234567890",
      paymentTerms: "30 gün",
      status: "active",
      totalDebt: 125000,
      totalPaid: 875000,
    },
    {
      id: "2",
      name: "XYZ Elektronik A.Ş.",
      contactPerson: "Ayşe Demir",
      phone: "0216 444 02 02",
      email: "ayse@xyzelektronik.com",
      address: "Kadıköy Mah. Bağdat Cad. No:456 Kadıköy/İstanbul",
      taxNumber: "0987654321",
      paymentTerms: "45 gün",
      status: "active",
      totalDebt: 75000,
      totalPaid: 450000,
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    taxNumber: "",
    paymentTerms: "",
  })

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const addSupplier = () => {
    if (!newSupplier.name || !newSupplier.contactPerson) return

    const supplier: Supplier = {
      id: Date.now().toString(),
      ...newSupplier,
      status: "active",
      totalDebt: 0,
      totalPaid: 0,
    }

    setSuppliers([...suppliers, supplier])
    setNewSupplier({
      name: "",
      contactPerson: "",
      phone: "",
      email: "",
      address: "",
      taxNumber: "",
      paymentTerms: "",
    })
    setIsAddDialogOpen(false)
  }

  const deleteSupplier = (id: string) => {
    if (confirm("Bu tedarikçiyi silmek istediğinizden emin misiniz?")) {
      setSuppliers(suppliers.filter((s) => s.id !== id))
    }
  }

  const exportToExcel = () => {
    // Excel export logic would go here
    alert("Excel dosyası indiriliyor...")
  }

  const importFromExcel = () => {
    // Excel import logic would go here
    alert("Excel dosyası yükleme penceresi açılacak...")
  }

  const getStatusBadge = (status: string) => {
    return status === "active" ? <Badge variant="default">Aktif</Badge> : <Badge variant="secondary">Pasif</Badge>
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
                <h1 className="text-3xl font-bold text-gray-900">Tedarikçi Yönetimi</h1>
                <p className="text-gray-600">Tedarikçi bilgileri ve borç takibi</p>
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
                    Yeni Tedarikçi
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Yeni Tedarikçi Ekle</DialogTitle>
                    <DialogDescription>Tedarikçi bilgilerini girin</DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Firma Adı</Label>
                      <Input
                        id="name"
                        value={newSupplier.name}
                        onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                        placeholder="Firma adını girin"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactPerson">İletişim Kişisi</Label>
                      <Input
                        id="contactPerson"
                        value={newSupplier.contactPerson}
                        onChange={(e) => setNewSupplier({ ...newSupplier, contactPerson: e.target.value })}
                        placeholder="İletişim kişisi"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefon</Label>
                      <Input
                        id="phone"
                        value={newSupplier.phone}
                        onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                        placeholder="Telefon numarası"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-posta</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newSupplier.email}
                        onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                        placeholder="E-posta adresi"
                      />
                    </div>
                    <div>
                      <Label htmlFor="taxNumber">Vergi Numarası</Label>
                      <Input
                        id="taxNumber"
                        value={newSupplier.taxNumber}
                        onChange={(e) => setNewSupplier({ ...newSupplier, taxNumber: e.target.value })}
                        placeholder="Vergi numarası"
                      />
                    </div>
                    <div>
                      <Label htmlFor="paymentTerms">Ödeme Vadesi</Label>
                      <Input
                        id="paymentTerms"
                        value={newSupplier.paymentTerms}
                        onChange={(e) => setNewSupplier({ ...newSupplier, paymentTerms: e.target.value })}
                        placeholder="Ödeme vadesi"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="address">Adres</Label>
                      <Textarea
                        id="address"
                        value={newSupplier.address}
                        onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                        placeholder="Firma adresi"
                      />
                    </div>
                  </div>
                  <Button onClick={addSupplier} className="w-full mt-4">
                    Tedarikçi Ekle
                  </Button>
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
                <Building2 className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Tedarikçi</p>
                  <p className="text-2xl font-bold">{suppliers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Aktif Tedarikçi</p>
                  <p className="text-2xl font-bold">{suppliers.filter((s) => s.status === "active").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Borç</p>
                  <p className="text-2xl font-bold">
                    ₺{suppliers.reduce((sum, s) => sum + s.totalDebt, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Ödenen</p>
                  <p className="text-2xl font-bold">
                    ₺{suppliers.reduce((sum, s) => sum + s.totalPaid, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tedarikçi ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Suppliers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Tedarikçi Listesi</CardTitle>
            <CardDescription>Tüm tedarikçilerinizi buradan yönetebilirsiniz</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Firma Adı</TableHead>
                  <TableHead>İletişim Kişisi</TableHead>
                  <TableHead>Telefon</TableHead>
                  <TableHead>Borç</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{supplier.name}</p>
                        <p className="text-sm text-gray-600">{supplier.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{supplier.contactPerson}</TableCell>
                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell>₺{supplier.totalDebt.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(supplier.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteSupplier(supplier.id)}>
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
      </div>
    </div>
  )
}
