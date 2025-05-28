"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  Upload,
  Download,
  FileSpreadsheet,
  Users,
  Package,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  FileText,
} from "lucide-react"
import Link from "next/link"

export default function BulkOperationsPage() {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<{
    success: number
    failed: number
    errors: string[]
  } | null>(null)

  const handleFileUpload = async (type: string) => {
    setIsUploading(true)
    setUploadProgress(0)
    setUploadResult(null)

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 200))
    }

    // Simulate upload result
    setUploadResult({
      success: 45,
      failed: 3,
      errors: ["Satır 12: Geçersiz telefon numarası", "Satır 25: Eksik e-posta adresi", "Satır 33: Duplicate kayıt"],
    })

    setIsUploading(false)
  }

  const downloadTemplate = (type: string) => {
    alert(`${type} şablonu indiriliyor...`)
  }

  const exportData = (type: string) => {
    alert(`${type} verileri Excel'e aktarılıyor...`)
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
                <h1 className="text-3xl font-bold text-gray-900">Toplu İşlemler</h1>
                <p className="text-gray-600">Excel ile toplu veri alma ve verme işlemleri</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="import" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="import">Veri Al (Import)</TabsTrigger>
            <TabsTrigger value="export">Veri Ver (Export)</TabsTrigger>
            <TabsTrigger value="templates">Şablonlar</TabsTrigger>
          </TabsList>

          <TabsContent value="import">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Import Cards */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Müşteri Listesi Al
                  </CardTitle>
                  <CardDescription>Excel dosyasından müşteri bilgilerini toplu olarak sisteme aktarın</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="customer-file">Excel Dosyası Seç</Label>
                    <Input id="customer-file" type="file" accept=".xlsx,.xls" className="mt-2" />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={() => handleFileUpload("müşteri")} disabled={isUploading} className="flex-1">
                      <Upload className="h-4 w-4 mr-2" />
                      Yükle
                    </Button>
                    <Button variant="outline" onClick={() => downloadTemplate("müşteri")}>
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Şablon İndir
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Ürün Listesi Al
                  </CardTitle>
                  <CardDescription>Excel dosyasından ürün bilgilerini toplu olarak sisteme aktarın</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="product-file">Excel Dosyası Seç</Label>
                    <Input id="product-file" type="file" accept=".xlsx,.xls" className="mt-2" />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={() => handleFileUpload("ürün")} disabled={isUploading} className="flex-1">
                      <Upload className="h-4 w-4 mr-2" />
                      Yükle
                    </Button>
                    <Button variant="outline" onClick={() => downloadTemplate("ürün")}>
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Şablon İndir
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Satış Kayıtları Al
                  </CardTitle>
                  <CardDescription>Excel dosyasından satış kayıtlarını toplu olarak sisteme aktarın</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="sales-file">Excel Dosyası Seç</Label>
                    <Input id="sales-file" type="file" accept=".xlsx,.xls" className="mt-2" />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={() => handleFileUpload("satış")} disabled={isUploading} className="flex-1">
                      <Upload className="h-4 w-4 mr-2" />
                      Yükle
                    </Button>
                    <Button variant="outline" onClick={() => downloadTemplate("satış")}>
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Şablon İndir
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Çek/Senet Kayıtları Al
                  </CardTitle>
                  <CardDescription>
                    Excel dosyasından çek/senet kayıtlarını toplu olarak sisteme aktarın
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="checks-file">Excel Dosyası Seç</Label>
                    <Input id="checks-file" type="file" accept=".xlsx,.xls" className="mt-2" />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={() => handleFileUpload("çek/senet")} disabled={isUploading} className="flex-1">
                      <Upload className="h-4 w-4 mr-2" />
                      Yükle
                    </Button>
                    <Button variant="outline" onClick={() => downloadTemplate("çek/senet")}>
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Şablon İndir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <Card className="mt-6">
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Yükleniyor...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="w-full" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Upload Result */}
            {uploadResult && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {uploadResult.failed === 0 ? (
                      <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 mr-2 text-yellow-600" />
                    )}
                    Yükleme Sonucu
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{uploadResult.success}</p>
                      <p className="text-sm text-green-700">Başarılı</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <p className="text-2xl font-bold text-red-600">{uploadResult.failed}</p>
                      <p className="text-sm text-red-700">Başarısız</p>
                    </div>
                  </div>
                  {uploadResult.errors.length > 0 && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-1">
                          <p className="font-medium">Hatalar:</p>
                          {uploadResult.errors.map((error, index) => (
                            <p key={index} className="text-sm">
                              • {error}
                            </p>
                          ))}
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="export">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Export Cards */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Müşteri Listesi Ver
                  </CardTitle>
                  <CardDescription>Tüm müşteri bilgilerini Excel dosyası olarak indirin</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => exportData("müşteri")} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Müşteri Listesi İndir
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Ürün Listesi Ver
                  </CardTitle>
                  <CardDescription>Tüm ürün bilgilerini Excel dosyası olarak indirin</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => exportData("ürün")} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Ürün Listesi İndir
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Satış Raporları Ver
                  </CardTitle>
                  <CardDescription>Satış kayıtlarını Excel dosyası olarak indirin</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => exportData("satış")} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Satış Raporları İndir
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Çek/Senet Listesi Ver
                  </CardTitle>
                  <CardDescription>Çek ve senet kayıtlarını Excel dosyası olarak indirin</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => exportData("çek/senet")} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Çek/Senet Listesi İndir
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="templates">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Excel Şablonları</CardTitle>
                  <CardDescription>Veri girişi için hazır Excel şablonlarını indirin</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <FileSpreadsheet className="h-5 w-5 mr-3 text-green-600" />
                        <div>
                          <p className="font-medium">Müşteri Şablonu</p>
                          <p className="text-sm text-gray-600">Ad, telefon, e-posta, adres alanları</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => downloadTemplate("müşteri")}>
                        İndir
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <FileSpreadsheet className="h-5 w-5 mr-3 text-blue-600" />
                        <div>
                          <p className="font-medium">Ürün Şablonu</p>
                          <p className="text-sm text-gray-600">Ürün adı, kategori, fiyat, stok alanları</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => downloadTemplate("ürün")}>
                        İndir
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <FileSpreadsheet className="h-5 w-5 mr-3 text-purple-600" />
                        <div>
                          <p className="font-medium">Satış Şablonu</p>
                          <p className="text-sm text-gray-600">Müşteri, ürün, miktar, fiyat alanları</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => downloadTemplate("satış")}>
                        İndir
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <FileSpreadsheet className="h-5 w-5 mr-3 text-orange-600" />
                        <div>
                          <p className="font-medium">Çek/Senet Şablonu</p>
                          <p className="text-sm text-gray-600">Numara, tutar, vade, müşteri alanları</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => downloadTemplate("çek/senet")}>
                        İndir
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Kullanım Talimatları</CardTitle>
                  <CardDescription>Excel dosyalarını doğru şekilde hazırlamak için</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-2">
                          <p className="font-medium">Önemli Notlar:</p>
                          <ul className="text-sm space-y-1 ml-4">
                            <li>• İlk satır başlık satırı olmalıdır</li>
                            <li>• Tarih formatı: GG/AA/YYYY</li>
                            <li>• Sayısal değerlerde nokta kullanın</li>
                            <li>• Boş satırlar bırakmayın</li>
                            <li>• Türkçe karakter kullanabilirsiniz</li>
                          </ul>
                        </div>
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-2">
                      <h4 className="font-medium">Desteklenen Formatlar:</h4>
                      <div className="flex space-x-2">
                        <Badge variant="outline">.xlsx</Badge>
                        <Badge variant="outline">.xls</Badge>
                        <Badge variant="outline">.csv</Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Maksimum Limitler:</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Dosya boyutu: 10MB</li>
                        <li>• Satır sayısı: 10,000</li>
                        <li>• Sütun sayısı: 50</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
