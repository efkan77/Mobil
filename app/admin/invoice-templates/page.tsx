"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, Plus, Eye, Edit, Trash2, Star } from "lucide-react"
import Link from "next/link"

interface InvoiceTemplate {
  id: string
  name: string
  header_text: string
  footer_text: string
  logo_position: string
  show_logo: boolean
  show_company_info: boolean
  show_customer_info: boolean
  font_size: number
  font_family: string
  color_scheme: string
  is_default: boolean
}

export default function InvoiceTemplatesPage() {
  const [templates, setTemplates] = useState<InvoiceTemplate[]>([
    {
      id: "1",
      name: "Varsayılan Şablon",
      header_text: "EFE GIDA TOPTAN - KALİTELİ HİZMET",
      footer_text: "Teşekkür ederiz! • www.efegida.com • 0212 555 01 23",
      logo_position: "left",
      show_logo: true,
      show_company_info: true,
      show_customer_info: true,
      font_size: 12,
      font_family: "Arial",
      color_scheme: "blue",
      is_default: true,
    },
    {
      id: "2",
      name: "Minimal Şablon",
      header_text: "EFE GIDA TOPTAN",
      footer_text: "Güvenilir Hizmet",
      logo_position: "center",
      show_logo: true,
      show_company_info: true,
      show_customer_info: true,
      font_size: 11,
      font_family: "Helvetica",
      color_scheme: "gray",
      is_default: false,
    },
  ])

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    header_text: "",
    footer_text: "",
    logo_position: "left",
    show_logo: true,
    show_company_info: true,
    show_customer_info: true,
    font_size: 12,
    font_family: "Arial",
    color_scheme: "blue",
  })

  const createTemplate = () => {
    if (!newTemplate.name) {
      alert("Şablon adı gereklidir")
      return
    }

    const template: InvoiceTemplate = {
      id: Date.now().toString(),
      ...newTemplate,
      is_default: false,
    }

    setTemplates([...templates, template])
    setNewTemplate({
      name: "",
      header_text: "",
      footer_text: "",
      logo_position: "left",
      show_logo: true,
      show_company_info: true,
      show_customer_info: true,
      font_size: 12,
      font_family: "Arial",
      color_scheme: "blue",
    })
    setIsCreateOpen(false)
  }

  const setDefaultTemplate = (id: string) => {
    setTemplates(
      templates.map((template) => ({
        ...template,
        is_default: template.id === id,
      })),
    )
  }

  const deleteTemplate = (id: string) => {
    const template = templates.find((t) => t.id === id)
    if (template?.is_default) {
      alert("Varsayılan şablon silinemez!")
      return
    }

    if (confirm("Bu şablonu silmek istediğinizden emin misiniz?")) {
      setTemplates(templates.filter((t) => t.id !== id))
    }
  }

  // Önizleme için örnek fatura verisi
  const sampleInvoice = {
    invoiceNumber: "2024-001",
    date: "15.01.2024",
    customer: {
      name: "Örnek Müşteri A.Ş.",
      address: "Örnek Mah. Test Cad. No:123 İstanbul",
      phone: "0212 123 45 67",
    },
    company: {
      name: "EFE GIDA TOPTAN",
      address: "Merkez Mah. Gıda Cad. No:123 Fatih/İstanbul",
      phone: "0212 555 01 23",
      logo: "/logo.webp",
    },
    items: [
      { name: "iPhone 15 Pro", quantity: 1, unitPrice: 45000, total: 45000 },
      { name: "Kılıf", quantity: 1, unitPrice: 500, total: 500 },
    ],
    total: 45500,
    paymentType: "Kredi Kartı",
  }

  const renderPreview = (template: InvoiceTemplate) => {
    return (
      <div
        className="bg-white p-6 border rounded-lg shadow-sm"
        style={{
          fontSize: `${template.font_size}px`,
          fontFamily: template.font_family,
          color: template.color_scheme === "blue" ? "#1e40af" : template.color_scheme === "gray" ? "#374151" : "#000",
        }}
      >
        {/* Header */}
        <div
          className={`flex items-center mb-6 ${template.logo_position === "center" ? "justify-center" : template.logo_position === "right" ? "justify-end" : "justify-start"}`}
        >
          {template.show_logo && <img src="/logo.webp" alt="Logo" className="h-12 w-12 mr-4" />}
          <div className={template.logo_position === "center" ? "text-center" : ""}>
            <h1 className="text-xl font-bold">{template.header_text}</h1>
          </div>
        </div>

        {/* Company Info */}
        {template.show_company_info && (
          <div className="mb-4">
            <p>{sampleInvoice.company.address}</p>
            <p>{sampleInvoice.company.phone}</p>
          </div>
        )}

        {/* Invoice Info */}
        <div className="flex justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold">FATURA</h2>
            <p>No: {sampleInvoice.invoiceNumber}</p>
            <p>Tarih: {sampleInvoice.date}</p>
          </div>
          {template.show_customer_info && (
            <div>
              <h3 className="font-bold">Müşteri:</h3>
              <p>{sampleInvoice.customer.name}</p>
              <p>{sampleInvoice.customer.address}</p>
            </div>
          )}
        </div>

        {/* Items */}
        <table className="w-full mb-6 text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Ürün</th>
              <th className="text-center py-2">Miktar</th>
              <th className="text-right py-2">Fiyat</th>
              <th className="text-right py-2">Toplam</th>
            </tr>
          </thead>
          <tbody>
            {sampleInvoice.items.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-2">{item.name}</td>
                <td className="text-center py-2">{item.quantity}</td>
                <td className="text-right py-2">₺{item.unitPrice.toLocaleString()}</td>
                <td className="text-right py-2">₺{item.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total */}
        <div className="text-right mb-6">
          <p className="text-lg font-bold">Toplam: ₺{sampleInvoice.total.toLocaleString()}</p>
        </div>

        {/* Footer */}
        <div className="text-center text-sm border-t pt-4">
          <p>{template.footer_text}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link href="/admin/settings">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Ayarlara Dön
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Fatura Şablonları</h1>
                <p className="text-gray-600">Fatura tasarımlarını özelleştirin</p>
              </div>
            </div>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Şablon
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Yeni Fatura Şablonu</DialogTitle>
                  <DialogDescription>Özel fatura şablonu oluşturun</DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Temel</TabsTrigger>
                    <TabsTrigger value="design">Tasarım</TabsTrigger>
                    <TabsTrigger value="content">İçerik</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4">
                    <div>
                      <Label htmlFor="templateName">Şablon Adı</Label>
                      <Input
                        id="templateName"
                        value={newTemplate.name}
                        onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                        placeholder="Şablon adını girin"
                      />
                    </div>
                    <div>
                      <Label htmlFor="headerText">Üst Başlık</Label>
                      <Input
                        id="headerText"
                        value={newTemplate.header_text}
                        onChange={(e) => setNewTemplate({ ...newTemplate, header_text: e.target.value })}
                        placeholder="EFE GIDA TOPTAN - KALİTELİ HİZMET"
                      />
                    </div>
                    <div>
                      <Label htmlFor="footerText">Alt Yazı</Label>
                      <Textarea
                        id="footerText"
                        value={newTemplate.footer_text}
                        onChange={(e) => setNewTemplate({ ...newTemplate, footer_text: e.target.value })}
                        placeholder="Teşekkür ederiz! • www.efegida.com • 0212 555 01 23"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="design" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fontSize">Font Boyutu</Label>
                        <Select
                          value={newTemplate.font_size.toString()}
                          onValueChange={(value) => setNewTemplate({ ...newTemplate, font_size: Number(value) })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10px</SelectItem>
                            <SelectItem value="11">11px</SelectItem>
                            <SelectItem value="12">12px</SelectItem>
                            <SelectItem value="14">14px</SelectItem>
                            <SelectItem value="16">16px</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="fontFamily">Font Ailesi</Label>
                        <Select
                          value={newTemplate.font_family}
                          onValueChange={(value) => setNewTemplate({ ...newTemplate, font_family: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Arial">Arial</SelectItem>
                            <SelectItem value="Helvetica">Helvetica</SelectItem>
                            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                            <SelectItem value="Calibri">Calibri</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="colorScheme">Renk Şeması</Label>
                        <Select
                          value={newTemplate.color_scheme}
                          onValueChange={(value) => setNewTemplate({ ...newTemplate, color_scheme: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="blue">Mavi</SelectItem>
                            <SelectItem value="gray">Gri</SelectItem>
                            <SelectItem value="black">Siyah</SelectItem>
                            <SelectItem value="green">Yeşil</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="logoPosition">Logo Konumu</Label>
                        <Select
                          value={newTemplate.logo_position}
                          onValueChange={(value) => setNewTemplate({ ...newTemplate, logo_position: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">Sol</SelectItem>
                            <SelectItem value="center">Orta</SelectItem>
                            <SelectItem value="right">Sağ</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="content" className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="showLogo">Logo Göster</Label>
                          <p className="text-sm text-gray-500">Faturada logo görüntüle</p>
                        </div>
                        <Switch
                          id="showLogo"
                          checked={newTemplate.show_logo}
                          onCheckedChange={(checked) => setNewTemplate({ ...newTemplate, show_logo: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="showCompanyInfo">Firma Bilgileri</Label>
                          <p className="text-sm text-gray-500">Firma adres ve telefon bilgileri</p>
                        </div>
                        <Switch
                          id="showCompanyInfo"
                          checked={newTemplate.show_company_info}
                          onCheckedChange={(checked) => setNewTemplate({ ...newTemplate, show_company_info: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="showCustomerInfo">Müşteri Bilgileri</Label>
                          <p className="text-sm text-gray-500">Müşteri adres bilgileri</p>
                        </div>
                        <Switch
                          id="showCustomerInfo"
                          checked={newTemplate.show_customer_info}
                          onCheckedChange={(checked) => setNewTemplate({ ...newTemplate, show_customer_info: checked })}
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                <Button onClick={createTemplate} className="w-full">
                  Şablon Oluştur
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Şablon Listesi */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mevcut Şablonlar</CardTitle>
                <CardDescription>Fatura şablonlarınızı yönetin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {templates.map((template) => (
                  <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{template.name}</h3>
                        {template.is_default && (
                          <Badge variant="default">
                            <Star className="h-3 w-3 mr-1" />
                            Varsayılan
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{template.header_text}</p>
                      <p className="text-xs text-gray-500">
                        {template.font_family} • {template.font_size}px • {template.color_scheme}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedTemplate(template.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {!template.is_default && (
                        <Button size="sm" variant="outline" onClick={() => setDefaultTemplate(template.id)}>
                          <Star className="h-4 w-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {!template.is_default && (
                        <Button size="sm" variant="destructive" onClick={() => deleteTemplate(template.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Önizleme */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Şablon Önizleme</CardTitle>
                <CardDescription>
                  {selectedTemplate
                    ? templates.find((t) => t.id === selectedTemplate)?.name
                    : "Önizleme için bir şablon seçin"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedTemplate ? (
                  <div className="max-h-96 overflow-y-auto">
                    {renderPreview(templates.find((t) => t.id === selectedTemplate)!)}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Önizleme için sol taraftan bir şablon seçin</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
