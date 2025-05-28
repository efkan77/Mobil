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
import { ArrowLeft, Plus, Edit, Trash2, Package } from "lucide-react"
import Link from "next/link"

interface Category {
  id: string
  name: string
  description: string
  product_count: number
  created_at: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "1",
      name: "Telefon & Tablet",
      description: "Akıllı telefonlar, tabletler ve aksesuarları",
      product_count: 25,
      created_at: "2024-01-01",
    },
    {
      id: "2",
      name: "Bilgisayar & Laptop",
      description: "Masaüstü bilgisayarlar, laptoplar ve bileşenler",
      product_count: 18,
      created_at: "2024-01-01",
    },
    {
      id: "3",
      name: "Ses & Görüntü",
      description: "Kulaklık, hoparlör, TV ve ses sistemleri",
      product_count: 12,
      created_at: "2024-01-01",
    },
    {
      id: "4",
      name: "Oyun & Konsol",
      description: "Oyun konsolları ve oyun aksesuarları",
      product_count: 8,
      created_at: "2024-01-01",
    },
    {
      id: "5",
      name: "Aksesuarlar",
      description: "Kılıf, şarj aleti ve diğer aksesuarlar",
      product_count: 35,
      created_at: "2024-01-01",
    },
  ])

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  })

  const addCategory = () => {
    if (!newCategory.name) {
      alert("Kategori adı gereklidir")
      return
    }

    const category: Category = {
      id: Date.now().toString(),
      ...newCategory,
      product_count: 0,
      created_at: new Date().toISOString().split("T")[0],
    }

    setCategories([...categories, category])
    setNewCategory({ name: "", description: "" })
    setIsAddOpen(false)
  }

  const deleteCategory = (id: string) => {
    const category = categories.find((c) => c.id === id)
    if (category && category.product_count > 0) {
      alert("Bu kategoride ürün bulunduğu için silinemez!")
      return
    }

    if (confirm("Bu kategoriyi silmek istediğinizden emin misiniz?")) {
      setCategories(categories.filter((c) => c.id !== id))
    }
  }

  const totalProducts = categories.reduce((sum, cat) => sum + cat.product_count, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link href="/admin/products">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Ürünlere Dön
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Ürün Kategorileri</h1>
                <p className="text-gray-600">Ürün kategorilerini yönetin</p>
              </div>
            </div>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Kategori
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Yeni Kategori Ekle</DialogTitle>
                  <DialogDescription>Yeni ürün kategorisi oluşturun</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="categoryName">Kategori Adı</Label>
                    <Input
                      id="categoryName"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      placeholder="Kategori adını girin"
                    />
                  </div>
                  <div>
                    <Label htmlFor="categoryDescription">Açıklama</Label>
                    <Input
                      id="categoryDescription"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                      placeholder="Kategori açıklaması"
                    />
                  </div>
                  <Button onClick={addCategory} className="w-full">
                    Kategori Ekle
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* İstatistikler */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Kategori</p>
                  <p className="text-2xl font-bold">{categories.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Ürün</p>
                  <p className="text-2xl font-bold">{totalProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ortalama Ürün/Kategori</p>
                  <p className="text-2xl font-bold">{Math.round(totalProducts / categories.length)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kategori Listesi */}
        <Card>
          <CardHeader>
            <CardTitle>Kategori Listesi</CardTitle>
            <CardDescription>Tüm ürün kategorileriniz</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kategori Adı</TableHead>
                  <TableHead>Açıklama</TableHead>
                  <TableHead>Ürün Sayısı</TableHead>
                  <TableHead>Oluşturma Tarihi</TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{category.product_count} ürün</Badge>
                    </TableCell>
                    <TableCell>{new Date(category.created_at).toLocaleDateString("tr-TR")}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteCategory(category.id)}
                          disabled={category.product_count > 0}
                        >
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
