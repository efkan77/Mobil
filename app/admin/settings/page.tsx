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
import { ArrowLeft, Save, Upload } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const [companySettings, setCompanySettings] = useState({
    name: "Teknoloji Mağazası",
    address: "Atatürk Cad. No:123 Kadıköy/İstanbul",
    phone: "0216 123 45 67",
    email: "info@teknolojimağazası.com",
    website: "www.teknolojimağazası.com",
    logo: "",
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
  })

  const [systemSettings, setSystemSettings] = useState({
    currency: "TRY",
    taxRate: "20",
    lowStockAlert: "5",
    autoBackup: true,
    emailNotifications: true,
  })

  const handleSave = () => {
    // Save settings logic would go here
    alert("Ayarlar başarıyla kaydedildi!")
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
                <p className="text-gray-600">Uygulama ayarlarını yönetin</p>
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="company">Firma Bilgileri</TabsTrigger>
            <TabsTrigger value="print">Yazdırma Ayarları</TabsTrigger>
            <TabsTrigger value="system">Sistem Ayarları</TabsTrigger>
            <TabsTrigger value="users">Kullanıcı Yönetimi</TabsTrigger>
          </TabsList>

          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle>Firma Bilgileri</CardTitle>
                <CardDescription>Faturalarda görünecek firma bilgilerini düzenleyin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                </div>

                <div>
                  <Label htmlFor="logo">Logo</Label>
                  <div className="mt-2">
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Logo Yükle
                    </Button>
                    <p className="text-sm text-gray-500 mt-1">PNG, JPG veya SVG formatında, maksimum 2MB</p>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      <Label htmlFor="showCompanyInfo">Firma Bilgileri Göster</Label>
                      <p className="text-sm text-gray-500">Faturalarda firma bilgilerini göster</p>
                    </div>
                    <Switch
                      id="showCompanyInfo"
                      checked={printSettings.showCompanyInfo}
                      onCheckedChange={(checked) => setPrintSettings({ ...printSettings, showCompanyInfo: checked })}
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
                    <Select
                      value={systemSettings.currency}
                      onValueChange={(value) => setSystemSettings({ ...systemSettings, currency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TRY">Türk Lirası (₺)</SelectItem>
                        <SelectItem value="USD">Dolar ($)</SelectItem>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="taxRate">KDV Oranı (%)</Label>
                    <Input
                      id="taxRate"
                      value={systemSettings.taxRate}
                      onChange={(e) => setSystemSettings({ ...systemSettings, taxRate: e.target.value })}
                    />
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
                      <Label htmlFor="emailNotifications">E-posta Bildirimleri</Label>
                      <p className="text-sm text-gray-500">Önemli olaylar için e-posta bildirimi gönder</p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={systemSettings.emailNotifications}
                      onCheckedChange={(checked) =>
                        setSystemSettings({ ...systemSettings, emailNotifications: checked })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Kullanıcı Yönetimi</CardTitle>
                <CardDescription>Sistem kullanıcılarını yönetin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Admin (poyraz02)</p>
                      <p className="text-sm text-gray-600">Sistem yöneticisi - Tüm yetkiler</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Düzenle
                    </Button>
                  </div>

                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">Henüz başka kullanıcı bulunmuyor</p>
                    <Button>
                      <Upload className="h-4 w-4 mr-2" />
                      Yeni Kullanıcı Ekle
                    </Button>
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
