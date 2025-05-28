"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { ArrowLeft, Save, Upload, Plus, Edit, Trash2, Key } from "lucide-react"
import Link from "next/link"

interface Staff {
  id: string
  name: string
  username: string
  role: string
  permissions: string[]
  status: "active" | "inactive"
  lastLogin: string
}

export default function SettingsPage() {
  const [companySettings, setCompanySettings] = useState({
    name: "EFE GIDA TOPTAN",
    address: "Merkez Mah. Gıda Cad. No:123 Fatih/İstanbul",
    phone: "0212 555 01 23",
    email: "info@efegida.com",
    website: "www.efegida.com",
    taxNumber: "1234567890",
    logo: "/logo.webp",
    defaultPaymentType: "cash",
  })

  const [printSettings, setPrintSettings] = useState({
    fontSize: "12",
    fontColor: "black",
    paperSize: "A4",
    showLogo: true,
    showCompanyInfo: true,
    showCustomerInfo: true,
    autoprint: false,
    thermalPrinter: false,
    receiptWidth: "80mm",
  })

  const [systemSettings, setSystemSettings] = useState({
    currency: "TRY",
    taxRate: "20",
    lowStockAlert: "5",
    autoBackup: true,
    emailNotifications: true,
    smsNotifications: false,
    stockAlerts: true,
    dailyReports: true,
    weeklyReports: false,
    monthlyReports: true,
  })

  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: "60",
    passwordExpiry: "90",
    maxLoginAttempts: "3",
    twoFactorAuth: false,
    ipRestriction: false,
    auditLog: true,
  })

  const [staff, setStaff] = useState<Staff[]>([
    {
      id: "1",
      name: "Admin",
      username: "poyraz02",
      role: "Sistem Yöneticisi",
      permissions: ["all"],
      status: "active",
      lastLogin: "2024-01-15 14:30",
    },
    {
      id: "2",
      name: "Satış Personeli",
      username: "satis01",
      role: "Satış Uzmanı",
      permissions: ["sales", "customers", "products_view"],
      status: "active",
      lastLogin: "2024-01-15 09:15",
    },
  ])

  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false)
  const [newStaff, setNewStaff] = useState({
    name: "",
    username: "",
    password: "",
    role: "",
    permissions: [] as string[],
  })

  const permissions = [
    { id: "sales", name: "Satış İşlemleri", description: "Satış yapma, fatura oluşturma" },
    { id: "customers", name: "Müşteri Yönetimi", description: "Müşteri ekleme, düzenleme, silme" },
    { id: "products", name: "Ürün Yönetimi", description: "Ürün ekleme, düzenleme, silme" },
    { id: "products_view", name: "Ürün Görüntüleme", description: "Sadece ürün listesini görme" },
    { id: "reports", name: "Raporlar", description: "Satış raporları ve analizler" },
    { id: "settings", name: "Sistem Ayarları", description: "Sistem ayarlarını değiştirme" },
    { id: "staff", name: "Personel Yönetimi", description: "Personel ekleme ve yetki verme" },
    { id: "suppliers", name: "Tedarikçi Yönetimi", description: "Tedarikçi işlemleri" },
    { id: "inventory", name: "Stok Yönetimi", description: "Stok takibi ve güncellemeleri" },
  ]

  const handleSave = () => {
    alert("Ayarlar başarıyla kaydedildi!")
  }

  const addStaff = () => {
    if (!newStaff.name || !newStaff.username || !newStaff.password) {
      alert("Lütfen tüm gerekli alanları doldurun")
      return
    }

    const staffMember: Staff = {
      id: Date.now().toString(),
      name: newStaff.name,
      username: newStaff.username,
      role: newStaff.role,
      permissions: newStaff.permissions,
      status: "active",
      lastLogin: "-",
    }

    setStaff([...staff, staffMember])
    setNewStaff({ name: "", username: "", password: "", role: "", permissions: [] })
    setIsAddStaffOpen(false)
    alert("Personel başarıyla eklendi!")
  }

  const deleteStaff = (id: string) => {
    if (id === "1") {
      alert("Ana admin hesabı silinemez!")
      return
    }
    if (confirm("Bu personeli silmek istediğinizden emin misiniz?")) {
      setStaff(staff.filter((s) => s.id !== id))
    }
  }

  const togglePermission = (permission: string) => {
    setNewStaff({
      ...newStaff,
      permissions: newStaff.permissions.includes(permission)
        ? newStaff.permissions.filter((p) => p !== permission)
        : [...newStaff.permissions, permission],
    })
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
                <h1 className="text-3xl font-bold text-gray-900">Sistem Ayarları</h1>
                <p className="text-gray-600">EFE GIDA TOPTAN - Uygulama ayarlarını yönetin</p>
              </div>
            </div>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Kaydet
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="company" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="company">Firma Bilgileri</TabsTrigger>
            <TabsTrigger value="print">Yazdırma</TabsTrigger>
            <TabsTrigger value="system">Sistem</TabsTrigger>
            <TabsTrigger value="security">Güvenlik</TabsTrigger>
            <TabsTrigger value="staff">Personel</TabsTrigger>
            <TabsTrigger value="backup">Yedekleme</TabsTrigger>
          </TabsList>

          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle>Firma Bilgileri</CardTitle>
                <CardDescription>Faturalarda görünecek firma bilgilerini düzenleyin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4 mb-6">
                  <img src="/logo.webp" alt="EFE GIDA TOPTAN Logo" className="h-16 w-16 object-contain" />
                  <div>
                    <h3 className="text-lg font-semibold">EFE GIDA TOPTAN</h3>
                    <p className="text-sm text-gray-600">Firma Logosu</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="companyName">Firma Adı</Label>
                    <Input
                      id="companyName"
                      value={companySettings.name}
                      onChange={(e) => setCompanySettings({ ...companySettings, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      value={companySettings.phone}
                      onChange={(e) => setCompanySettings({ ...companySettings, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Adres</Label>
                  <Textarea
                    id="address"
                    value={companySettings.address}
                    onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="email">E-posta</Label>
                    <Input
                      id="email"
                      type="email"
                      value={companySettings.email}
                      onChange={(e) => setCompanySettings({ ...companySettings, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={companySettings.website}
                      onChange={(e) => setCompanySettings({ ...companySettings, website: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="taxNumber">Vergi Numarası</Label>
                    <Input
                      id="taxNumber"
                      value={companySettings.taxNumber}
                      onChange={(e) => setCompanySettings({ ...companySettings, taxNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="defaultPayment">Varsayılan Ödeme Türü</Label>
                  <Select
                    value={companySettings.defaultPaymentType}
                    onValueChange={(value) => setCompanySettings({ ...companySettings, defaultPaymentType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Nakit</SelectItem>
                      <SelectItem value="credit">Kredi Kartı</SelectItem>
                      <SelectItem value="transfer">Havale/EFT</SelectItem>
                      <SelectItem value="check">Çek</SelectItem>
                      <SelectItem value="note">Senet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="print">
            <Card>
              <CardHeader>
                <CardTitle>Yazdırma Ayarları</CardTitle>
                <CardDescription>Fatura ve fiş yazdırma ayarlarını özelleştirin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <Label htmlFor="fontSize">Font Boyutu</Label>
                    <Select
                      value={printSettings.fontSize}
                      onValueChange={(value) => setPrintSettings({ ...printSettings, fontSize: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="8">8px</SelectItem>
                        <SelectItem value="10">10px</SelectItem>
                        <SelectItem value="12">12px</SelectItem>
                        <SelectItem value="14">14px</SelectItem>
                        <SelectItem value="16">16px</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="fontColor">Font Rengi</Label>
                    <Select
                      value={printSettings.fontColor}
                      onValueChange={(value) => setPrintSettings({ ...printSettings, fontColor: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="black">Siyah</SelectItem>
                        <SelectItem value="gray">Gri</SelectItem>
                        <SelectItem value="blue">Mavi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="paperSize">Kağıt Boyutu</Label>
                    <Select
                      value={printSettings.paperSize}
                      onValueChange={(value) => setPrintSettings({ ...printSettings, paperSize: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A4">A4</SelectItem>
                        <SelectItem value="A5">A5</SelectItem>
                        <SelectItem value="thermal">Termal (80mm)</SelectItem>
                        <SelectItem value="thermal58">Termal (58mm)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="receiptWidth">Fiş Genişliği</Label>
                    <Select
                      value={printSettings.receiptWidth}
                      onValueChange={(value) => setPrintSettings({ ...printSettings, receiptWidth: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="58mm">58mm</SelectItem>
                        <SelectItem value="80mm">80mm</SelectItem>
                        <SelectItem value="custom">Özel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="showLogo">Logo Göster</Label>
                      <p className="text-sm text-gray-500">Faturalarda firma logosunu göster</p>
                    </div>
                    <Switch
                      id="showLogo"
                      checked={printSettings.showLogo}
                      onCheckedChange={(checked) => setPrintSettings({ ...printSettings, showLogo: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="thermalPrinter">Termal Yazıcı</Label>
                      <p className="text-sm text-gray-500">Termal yazıcı için optimize et</p>
                    </div>
                    <Switch
                      id="thermalPrinter"
                      checked={printSettings.thermalPrinter}
                      onCheckedChange={(checked) => setPrintSettings({ ...printSettings, thermalPrinter: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoprint">Otomatik Yazdır</Label>
                      <p className="text-sm text-gray-500">Satış tamamlandığında otomatik yazdır</p>
                    </div>
                    <Switch
                      id="autoprint"
                      checked={printSettings.autoprint}
                      onCheckedChange={(checked) => setPrintSettings({ ...printSettings, autoprint: checked })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>Sistem Ayarları</CardTitle>
                <CardDescription>Genel sistem ayarlarını yönetin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="currency">Para Birimi</Label>
                    <Select value={systemSettings.currency} disabled>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TRY">Türk Lirası (₺)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">Para birimi Türk Lirası olarak sabitlenmiştir</p>
                  </div>
                  <div>
                    <Label htmlFor="taxRate">KDV Oranı (%)</Label>
                    <Select
                      value={systemSettings.taxRate}
                      onValueChange={(value) => setSystemSettings({ ...systemSettings, taxRate: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">%1</SelectItem>
                        <SelectItem value="8">%8</SelectItem>
                        <SelectItem value="18">%18</SelectItem>
                        <SelectItem value="20">%20</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="lowStockAlert">Düşük Stok Uyarısı</Label>
                    <Input
                      id="lowStockAlert"
                      type="number"
                      value={systemSettings.lowStockAlert}
                      onChange={(e) => setSystemSettings({ ...systemSettings, lowStockAlert: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoBackup">Otomatik Yedekleme</Label>
                      <p className="text-sm text-gray-500">Günlük otomatik veri yedeklemesi</p>
                    </div>
                    <Switch
                      id="autoBackup"
                      checked={systemSettings.autoBackup}
                      onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, autoBackup: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="stockAlerts">Stok Uyarıları</Label>
                      <p className="text-sm text-gray-500">Düşük stok için bildirim gönder</p>
                    </div>
                    <Switch
                      id="stockAlerts"
                      checked={systemSettings.stockAlerts}
                      onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, stockAlerts: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifications">E-posta Bildirimleri</Label>
                      <p className="text-sm text-gray-500">Önemli olaylar için e-posta bildirimi</p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={systemSettings.emailNotifications}
                      onCheckedChange={(checked) =>
                        setSystemSettings({ ...systemSettings, emailNotifications: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="smsNotifications">SMS Bildirimleri</Label>
                      <p className="text-sm text-gray-500">Kritik durumlar için SMS gönder</p>
                    </div>
                    <Switch
                      id="smsNotifications"
                      checked={systemSettings.smsNotifications}
                      onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, smsNotifications: checked })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Güvenlik Ayarları</CardTitle>
                <CardDescription>Sistem güvenlik ayarlarını yönetin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="sessionTimeout">Oturum Zaman Aşımı (dakika)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="passwordExpiry">Şifre Geçerlilik (gün)</Label>
                    <Input
                      id="passwordExpiry"
                      type="number"
                      value={securitySettings.passwordExpiry}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, passwordExpiry: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxLoginAttempts">Maksimum Giriş Denemesi</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={securitySettings.maxLoginAttempts}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, maxLoginAttempts: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="twoFactorAuth">İki Faktörlü Doğrulama</Label>
                      <p className="text-sm text-gray-500">Ekstra güvenlik katmanı ekle</p>
                    </div>
                    <Switch
                      id="twoFactorAuth"
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) =>
                        setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auditLog">Denetim Günlüğü</Label>
                      <p className="text-sm text-gray-500">Tüm kullanıcı işlemlerini kaydet</p>
                    </div>
                    <Switch
                      id="auditLog"
                      checked={securitySettings.auditLog}
                      onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, auditLog: checked })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Personel Yönetimi</CardTitle>
                    <CardDescription>Sistem kullanıcılarını ve yetkilerini yönetin</CardDescription>
                  </div>
                  <Dialog open={isAddStaffOpen} onOpenChange={setIsAddStaffOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Yeni Personel
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Yeni Personel Ekle</DialogTitle>
                        <DialogDescription>Personel bilgilerini ve yetkilerini belirleyin</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="staffName">Ad Soyad</Label>
                            <Input
                              id="staffName"
                              value={newStaff.name}
                              onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                              placeholder="Personel adı"
                            />
                          </div>
                          <div>
                            <Label htmlFor="staffRole">Pozisyon</Label>
                            <Input
                              id="staffRole"
                              value={newStaff.role}
                              onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                              placeholder="Satış Uzmanı, Kasiyer vb."
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="staffUsername">Kullanıcı Adı</Label>
                            <Input
                              id="staffUsername"
                              value={newStaff.username}
                              onChange={(e) => setNewStaff({ ...newStaff, username: e.target.value })}
                              placeholder="Giriş için kullanıcı adı"
                            />
                          </div>
                          <div>
                            <Label htmlFor="staffPassword">Şifre</Label>
                            <Input
                              id="staffPassword"
                              type="password"
                              value={newStaff.password}
                              onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                              placeholder="Güvenli şifre"
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Yetkiler</Label>
                          <div className="grid grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto">
                            {permissions.map((permission) => (
                              <div key={permission.id} className="flex items-start space-x-2 p-2 border rounded">
                                <input
                                  type="checkbox"
                                  id={permission.id}
                                  checked={newStaff.permissions.includes(permission.id)}
                                  onChange={() => togglePermission(permission.id)}
                                  className="mt-1"
                                />
                                <div className="flex-1">
                                  <label htmlFor={permission.id} className="text-sm font-medium cursor-pointer">
                                    {permission.name}
                                  </label>
                                  <p className="text-xs text-gray-500">{permission.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <Button onClick={addStaff} className="w-full">
                          Personel Ekle
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ad Soyad</TableHead>
                      <TableHead>Kullanıcı Adı</TableHead>
                      <TableHead>Pozisyon</TableHead>
                      <TableHead>Yetkiler</TableHead>
                      <TableHead>Son Giriş</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staff.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>{member.username}</TableCell>
                        <TableCell>{member.role}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {member.permissions.includes("all") ? (
                              <Badge variant="destructive">Tüm Yetkiler</Badge>
                            ) : (
                              member.permissions.slice(0, 2).map((perm) => (
                                <Badge key={perm} variant="secondary" className="text-xs">
                                  {permissions.find((p) => p.id === perm)?.name.split(" ")[0]}
                                </Badge>
                              ))
                            )}
                            {member.permissions.length > 2 && !member.permissions.includes("all") && (
                              <Badge variant="outline" className="text-xs">
                                +{member.permissions.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{member.lastLogin}</TableCell>
                        <TableCell>
                          <Badge variant={member.status === "active" ? "default" : "secondary"}>
                            {member.status === "active" ? "Aktif" : "Pasif"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Key className="h-4 w-4" />
                            </Button>
                            {member.id !== "1" && (
                              <Button size="sm" variant="destructive" onClick={() => deleteStaff(member.id)}>
                                <Trash2 className="h-4 w-4" />
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

          <TabsContent value="backup">
            <Card>
              <CardHeader>
                <CardTitle>Yedekleme ve Geri Yükleme</CardTitle>
                <CardDescription>Veri yedekleme ve geri yükleme işlemleri</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Manuel Yedekleme</h3>
                    <p className="text-sm text-gray-600">Tüm sistem verilerini manuel olarak yedekleyin</p>
                    <Button className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Şimdi Yedekle
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Geri Yükleme</h3>
                    <p className="text-sm text-gray-600">Önceki yedekten verileri geri yükleyin</p>
                    <Button variant="outline" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Yedek Dosyası Seç
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Son Yedeklemeler</h3>
                  <div className="space-y-2">
                    {[
                      { date: "2024-01-15 14:30", size: "2.5 MB", type: "Otomatik" },
                      { date: "2024-01-14 14:30", size: "2.4 MB", type: "Otomatik" },
                      { date: "2024-01-13 09:15", size: "2.3 MB", type: "Manuel" },
                    ].map((backup, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{backup.date}</p>
                          <p className="text-sm text-gray-600">
                            {backup.size} - {backup.type}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            İndir
                          </Button>
                          <Button size="sm">Geri Yükle</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
