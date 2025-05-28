"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Plus, Search, Edit, Trash2, Users, ArrowLeft, Phone, Mail, Key } from "lucide-react"
import Link from "next/link"

interface Customer {
  id: string
  name: string
  phone: string
  email: string
  address: string
  username: string
  password: string
  totalPurchases: number
  lastPurchase: string
  status: "active" | "inactive"
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "1",
      name: "Ahmet Yılmaz",
      phone: "0532 123 45 67",
      email: "ahmet@email.com",
      address: "Kadıköy, İstanbul",
      username: "customer1",
      password: "pass123",
      totalPurchases: 125000,
      lastPurchase: "2024-01-15",
      status: "active",
    },
    {
      id: "2",
      name: "Fatma Demir",
      phone: "0533 987 65 43",
      email: "fatma@email.com",
      address: "Beşiktaş, İstanbul",
      username: "customer2",
      password: "pass456",
      totalPurchases: 89000,
      lastPurchase: "2024-01-12",
      status: "active",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    username: "",
    password: "",
  })

  const filteredCustomers = customers.filter(
    (customer) => customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || customer.phone.includes(searchTerm),
  )

  const generateUsername = (name: string) => {
    const cleanName = name
      .toLowerCase()
      .replace(/[^a-z]/g, "")
      .substring(0, 8)
    const randomNum = Math.floor(Math.random() * 999) + 1
    return `${cleanName}${randomNum}`
  }

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
    let password = ""
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  const addCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone) {
      alert("Lütfen en az ad ve telefon bilgilerini girin")
      return
    }

    const username = newCustomer.username || generateUsername(newCustomer.name)
    const password = newCustomer.password || generatePassword()

    const customer: Customer = {
      id: Date.now().toString(),
      ...newCustomer,
      username,
      password,
      totalPurchases: 0,
      lastPurchase: "-",
      status: "active",
    }

    setCustomers([...customers, customer])
    setNewCustomer({ name: "", phone: "", email: "", address: "", username: "", password: "" })
    setIsAddDialogOpen(false)

    alert(`Müşteri başarıyla eklendi!\n\nGiriş Bilgileri:\nKullanıcı Adı: ${username}\nŞifre: ${password}`)
  }

  const deleteCustomer = (id: string) => {
    if (confirm("Bu müşteriyi silmek istediğinizden emin misiniz?")) {
      setCustomers(customers.filter((c) => c.id !== id))
    }
  }

  const resetPassword = (customer: Customer) => {
    const newPassword = generatePassword()
    setCustomers(customers.map((c) => (c.id === customer.id ? { ...c, password: newPassword } : c)))
    alert(`${customer.name} için yeni şifre: ${newPassword}`)
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
                <h1 className="text-3xl font-bold text-gray-900">Müşteri Yönetimi</h1>
                <p className="text-gray-600">EFE GIDA TOPTAN - Müşteri bilgileri ve panel erişimi</p>
              </div>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Müşteri
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Yeni Müşteri Ekle</DialogTitle>
                  <DialogDescription>
                    Müşteri bilgilerini girin. Panel erişimi için kullanıcı adı ve şifre otomatik oluşturulacak.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Ad Soyad *</Label>
                      <Input
                        id="name"
                        value={newCustomer.name}
                        onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                        placeholder="Müşteri adını girin"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefon *</Label>
                      <Input
                        id="phone"
                        value={newCustomer.phone}
                        onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                        placeholder="Telefon numarası"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">E-posta</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newCustomer.email}
                        onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                        placeholder="E-posta adresi"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Adres</Label>
                      <Input
                        id="address"
                        value={newCustomer.address}
                        onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                        placeholder="Adres"
                      />
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Panel Erişim Bilgileri (İsteğe Bağlı)</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="username">Kullanıcı Adı</Label>
                        <Input
                          id="username"
                          value={newCustomer.username}
                          onChange={(e) => setNewCustomer({ ...newCustomer, username: e.target.value })}
                          placeholder="Otomatik oluşturulacak"
                        />
                        <p className="text-xs text-gray-500 mt-1">Boş bırakılırsa otomatik oluşturulur</p>
                      </div>
                      <div>
                        <Label htmlFor="password">Şifre</Label>
                        <Input
                          id="password"
                          value={newCustomer.password}
                          onChange={(e) => setNewCustomer({ ...newCustomer, password: e.target.value })}
                          placeholder="Otomatik oluşturulacak"
                        />
                        <p className="text-xs text-gray-500 mt-1">Boş bırakılırsa otomatik oluşturulur</p>
                      </div>
                    </div>
                  </div>

                  <Button onClick={addCustomer} className="w-full">
                    Müşteri Ekle ve Giriş Bilgileri Oluştur
                  </Button>
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
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Müşteri</p>
                  <p className="text-2xl font-bold">{customers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Aktif Müşteri</p>
                  <p className="text-2xl font-bold">{customers.filter((c) => c.status === "active").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Satış</p>
                  <p className="text-2xl font-bold">
                    ₺{customers.reduce((sum, c) => sum + c.totalPurchases, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Key className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Panel Erişimi</p>
                  <p className="text-2xl font-bold">{customers.length}</p>
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
                placeholder="Müşteri ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Müşteri Listesi</CardTitle>
            <CardDescription>Tüm müşterilerinizi ve panel erişim bilgilerini buradan yönetebilirsiniz</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Müşteri Adı</TableHead>
                  <TableHead>İletişim</TableHead>
                  <TableHead>Panel Erişimi</TableHead>
                  <TableHead>Toplam Alışveriş</TableHead>
                  <TableHead>Son Alışveriş</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-gray-600">{customer.address}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1" />
                          {customer.phone}
                        </div>
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1" />
                          {customer.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Kullanıcı: {customer.username}</p>
                        <p className="text-sm text-gray-600">Şifre: {customer.password}</p>
                      </div>
                    </TableCell>
                    <TableCell>₺{customer.totalPurchases.toLocaleString()}</TableCell>
                    <TableCell>{customer.lastPurchase}</TableCell>
                    <TableCell>
                      <Badge variant={customer.status === "active" ? "default" : "secondary"}>
                        {customer.status === "active" ? "Aktif" : "Pasif"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => resetPassword(customer)}>
                          <Key className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteCustomer(customer.id)}>
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
