"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  Upload,
  FileImage,
  Calendar,
  User,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Eye,
  Trash2,
} from "lucide-react"
import Link from "next/link"

interface ImportedSale {
  id: string
  customerName: string
  date: string
  amount: number
  description: string
  imageUrl: string
  status: "pending" | "processed" | "error"
}

export default function ImportHistoryPage() {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [importedSales, setImportedSales] = useState<ImportedSale[]>([
    {
      id: "1",
      customerName: "Ahmet Yılmaz",
      date: "2023-12-15",
      amount: 25000,
      description: "iPhone 14 Pro satışı",
      imageUrl: "/placeholder.svg?height=200&width=300",
      status: "processed",
    },
    {
      id: "2",
      customerName: "Fatma Demir",
      date: "2023-12-10",
      amount: 45000,
      description: "MacBook Air M2 satışı",
      imageUrl: "/placeholder.svg?height=200&width=300",
      status: "processed",
    },
  ])

  const [newImport, setNewImport] = useState({
    customerName: "",
    date: "",
    amount: 0,
    description: "",
    imageFile: null as File | null,
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewImport({ ...newImport, imageFile: file })
    }
  }

  const processImage = async () => {
    if (!newImport.imageFile) return

    setIsProcessing(true)
    setUploadProgress(0)

    // Simulate OCR processing
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 300))
    }

    // Simulate extracted data
    const extractedData = {
      customerName: "Mehmet Özkan",
      date: "2024-01-20",
      amount: 35000,
      description: "Samsung Galaxy S24 Ultra satışı",
    }

    setNewImport({
      ...newImport,
      ...extractedData,
    })

    setIsProcessing(false)
    alert("Görsel başarıyla işlendi! Bilgiler otomatik olarak dolduruldu.")
  }

  const saveImportedSale = () => {
    if (!newImport.customerName || !newImport.date || !newImport.amount) {
      alert("Lütfen tüm gerekli alanları doldurun")
      return
    }

    const newSale: ImportedSale = {
      id: Date.now().toString(),
      customerName: newImport.customerName,
      date: newImport.date,
      amount: newImport.amount,
      description: newImport.description,
      imageUrl: "/placeholder.svg?height=200&width=300",
      status: "processed",
    }

    setImportedSales([newSale, ...importedSales])
    setNewImport({
      customerName: "",
      date: "",
      amount: 0,
      description: "",
      imageFile: null,
    })

    alert("Eski satış kaydı başarıyla eklendi!")
  }

  const deleteSale = (id: string) => {
    if (confirm("Bu satış kaydını silmek istediğinizden emin misiniz?")) {
      setImportedSales(importedSales.filter((sale) => sale.id !== id))
    }
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
                <h1 className="text-3xl font-bold text-gray-900">Eski Satış Verilerini Yükle</h1>
                <p className="text-gray-600">Görsel/PDF'den eski satış kayıtlarınızı sisteme aktarın</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Görsel/PDF Yükle
                </CardTitle>
                <CardDescription>
                  Eski fatura, fiş veya satış belgelerinizi yükleyerek otomatik veri çıkarımı yapın
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="image-upload">Belge Yükle</Label>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleImageUpload}
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-500 mt-1">PNG, JPG, PDF formatları desteklenir</p>
                </div>

                {newImport.imageFile && (
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileImage className="h-5 w-5 mr-2 text-blue-600" />
                        <span className="text-sm font-medium">{newImport.imageFile.name}</span>
                      </div>
                      <Button onClick={processImage} disabled={isProcessing} size="sm">
                        {isProcessing ? "İşleniyor..." : "Analiz Et"}
                      </Button>
                    </div>
                  </div>
                )}

                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Görsel analiz ediliyor...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="w-full" />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Satış Bilgileri</CardTitle>
                <CardDescription>Çıkarılan veya manuel girilen satış bilgileri</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customerName">Müşteri Adı</Label>
                    <Input
                      id="customerName"
                      value={newImport.customerName}
                      onChange={(e) => setNewImport({ ...newImport, customerName: e.target.value })}
                      placeholder="Müşteri adını girin"
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">Satış Tarihi</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newImport.date}
                      onChange={(e) => setNewImport({ ...newImport, date: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="amount">Satış Tutarı</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newImport.amount}
                    onChange={(e) => setNewImport({ ...newImport, amount: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Açıklama</Label>
                  <Textarea
                    id="description"
                    value={newImport.description}
                    onChange={(e) => setNewImport({ ...newImport, description: e.target.value })}
                    placeholder="Satış detayları..."
                  />
                </div>
                <Button onClick={saveImportedSale} className="w-full">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Satış Kaydını Ekle
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Imported Sales List */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>İçe Aktarılan Satışlar</CardTitle>
                <CardDescription>Görsellerden çıkarılan eski satış kayıtları</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {importedSales.map((sale) => (
                    <div key={sale.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <User className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="font-medium">{sale.customerName}</span>
                            <Badge variant={sale.status === "processed" ? "default" : "secondary"} className="ml-2">
                              {sale.status === "processed" ? "İşlendi" : "Beklemede"}
                            </Badge>
                          </div>
                          <div className="flex items-center mb-2">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="text-sm text-gray-600">{sale.date}</span>
                          </div>
                          <div className="flex items-center mb-2">
                            <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="font-bold text-green-600">₺{sale.amount.toLocaleString()}</span>
                          </div>
                          <p className="text-sm text-gray-600">{sale.description}</p>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteSale(sale.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Alert className="mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Kullanım İpuçları:</p>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• Net ve okunaklı görseller yükleyin</li>
                    <li>• PDF dosyaları da desteklenmektedir</li>
                    <li>• Otomatik çıkarılan verileri kontrol edin</li>
                    <li>• Gerekirse manuel düzeltme yapın</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  )
}
