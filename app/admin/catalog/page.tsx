"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Search, Eye, Download, Upload, FileImage, ShoppingCart } from "lucide-react"
import Link from "next/link"

interface CatalogItem {
  id: string
  name: string
  category: string
  supplier: string
  price: number
  image: string
  description: string
  inStock: boolean
  featured: boolean
}

export default function CatalogPage() {
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([
    {
      id: "1",
      name: "iPhone 15 Pro Max",
      category: "Telefon",
      supplier: "ABC Teknoloji Ltd.",
      price: 45000,
      image: "/placeholder.svg?height=200&width=200",
      description: "256GB, Titanium Blue, 5G destekli",
      inStock: true,
      featured: true,
    },
    {
      id: "2",
      name: "MacBook Air M2",
      category: "Laptop",
      supplier: "XYZ Elektronik A.Ş.",
      price: 55000,
      image: "/placeholder.svg?height=200&width=200",
      description: '13", 8GB RAM, 256GB SSD, Space Gray',
      inStock: true,
      featured: false,
    },
    {
      id: "3",
      name: "Samsung Galaxy S24 Ultra",
      category: "Telefon",
      supplier: "ABC Teknoloji Ltd.",
      price: 42000,
      image: "/placeholder.svg?height=200&width=200",
      description: "512GB, Phantom Black, S Pen dahil",
      inStock: false,
      featured: true,
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const categories = ["Telefon", "Laptop", "Tablet", "Aksesuar", "Ses Sistemi"]
  const suppliers = ["ABC Teknoloji Ltd.", "XYZ Elektronik A.Ş.", "DEF Bilişim San."]

  const filteredItems = catalogItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredItems = catalogItems.filter((item) => item.featured)

  const exportCatalog = () => {
    alert("Katalog PDF olarak indiriliyor...")
  }

  const importCatalog = () => {
    alert("Katalog dosyası yükleme penceresi açılacak...")
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
                <h1 className="text-3xl font-bold text-gray-900">E-Katalog Yönetimi</h1>
                <p className="text-gray-600">Ürün kataloğu ve görsel yönetimi</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={importCatalog}>
                <Upload className="h-4 w-4 mr-2" />
                Katalog Yükle
              </Button>
              <Button variant="outline" onClick={exportCatalog}>
                <Download className="h-4 w-4 mr-2" />
                PDF İndir
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Ürün Ekle
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Kataloga Ürün Ekle</DialogTitle>
                    <DialogDescription>Yeni ürün bilgilerini girin</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="productName">Ürün Adı</Label>
                      <Input id="productName" placeholder="Ürün adını girin" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Kategori</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Kategori seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="supplier">Tedarikçi</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Tedarikçi seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            {suppliers.map((sup) => (
                              <SelectItem key={sup} value={sup}>
                                {sup}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="price">Fiyat</Label>
                      <Input id="price" type="number" placeholder="0" />
                    </div>
                    <div>
                      <Label htmlFor="image">Ürün Görseli</Label>
                      <div className="mt-2">
                        <Button variant="outline" className="w-full">
                          <FileImage className="h-4 w-4 mr-2" />
                          Görsel Yükle
                        </Button>
                      </div>
                    </div>
                    <Button className="w-full">Kataloga Ekle</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="catalog" className="space-y-6">
          <TabsList>
            <TabsTrigger value="catalog">Katalog Görünümü</TabsTrigger>
            <TabsTrigger value="featured">Öne Çıkanlar</TabsTrigger>
            <TabsTrigger value="management">Ürün Yönetimi</TabsTrigger>
          </TabsList>

          <TabsContent value="catalog">
            {/* Search and Filter */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Ürün ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Kategori seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Kategoriler</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square relative">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    {item.featured && (
                      <Badge className="absolute top-2 right-2" variant="destructive">
                        Öne Çıkan
                      </Badge>
                    )}
                    {!item.inStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <Badge variant="secondary">Stokta Yok</Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{item.category}</Badge>
                      <span className="font-bold text-lg">₺{item.price.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">Tedarikçi: {item.supplier}</p>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        Detay
                      </Button>
                      <Button size="sm" className="flex-1" disabled={!item.inStock}>
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Sepet
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="featured">
            <Card>
              <CardHeader>
                <CardTitle>Öne Çıkan Ürünler</CardTitle>
                <CardDescription>Katalogda öne çıkarılan ürünler</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="aspect-video relative">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="outline">{item.category}</Badge>
                          <span className="font-bold">₺{item.price.toLocaleString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="management">
            <Card>
              <CardHeader>
                <CardTitle>Ürün Yönetimi</CardTitle>
                <CardDescription>Katalog ürünlerini düzenleyin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {catalogItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-600">
                            {item.category} - {item.supplier}
                          </p>
                          <p className="font-semibold">₺{item.price.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {item.featured && <Badge variant="destructive">Öne Çıkan</Badge>}
                        {item.inStock ? (
                          <Badge variant="default">Stokta</Badge>
                        ) : (
                          <Badge variant="secondary">Stokta Yok</Badge>
                        )}
                        <Button size="sm" variant="outline">
                          Düzenle
                        </Button>
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
