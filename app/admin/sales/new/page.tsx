"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Minus, ShoppingCart, ArrowLeft } from "lucide-react"
import Link from "next/link"
import VoiceProductAdd from "@/components/voice-product-add"

interface SaleItem {
  id: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  total: number
}

export default function NewSalePage() {
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [paymentType, setPaymentType] = useState("")
  const [description, setDescription] = useState("")
  const [saleItems, setSaleItems] = useState<SaleItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [unitPrice, setUnitPrice] = useState(0)

  // Mock data
  const customers = [
    { id: "1", name: "Ahmet Yılmaz", phone: "0532 123 45 67" },
    { id: "2", name: "Fatma Demir", phone: "0533 987 65 43" },
    { id: "3", name: "Mehmet Kaya", phone: "0534 555 66 77" },
  ]

  const products = [
    { id: "1", name: "iPhone 15 Pro", price: 45000, stock: 15 },
    { id: "2", name: "Samsung Galaxy S24", price: 35000, stock: 20 },
    { id: "3", name: "MacBook Air M2", price: 55000, stock: 8 },
    { id: "4", name: 'iPad Pro 12.9"', price: 25000, stock: 12 },
  ]

  const addItem = () => {
    if (!selectedProduct || quantity <= 0 || unitPrice <= 0) return

    const product = products.find((p) => p.id === selectedProduct)
    if (!product) return

    const newItem: SaleItem = {
      id: Date.now().toString(),
      productId: selectedProduct,
      productName: product.name,
      quantity,
      unitPrice,
      total: quantity * unitPrice,
    }

    setSaleItems([...saleItems, newItem])
    setSelectedProduct("")
    setQuantity(1)
    setUnitPrice(0)
  }

  const removeItem = (id: string) => {
    setSaleItems(saleItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) return
    setSaleItems(
      saleItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity, total: newQuantity * item.unitPrice } : item,
      ),
    )
  }

  const totalAmount = saleItems.reduce((sum, item) => sum + item.total, 0)

  const handleSubmit = () => {
    if (!selectedCustomer || saleItems.length === 0 || !paymentType) {
      alert("Lütfen tüm gerekli alanları doldurun")
      return
    }

    // Here you would save the sale to your database
    alert("Satış başarıyla kaydedildi!")

    // Reset form
    setSelectedCustomer("")
    setPaymentType("")
    setDescription("")
    setSaleItems([])
  }

  const handleVoiceProductAdd = (product: { name: string; quantity: number; price: number }) => {
    const newItem: SaleItem = {
      id: Date.now().toString(),
      productId: "voice-" + Date.now(),
      productName: product.name,
      quantity: product.quantity,
      unitPrice: product.price,
      total: product.quantity * product.price,
    }
    setSaleItems([...saleItems, newItem])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Geri
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Yeni Satış</h1>
              <p className="text-gray-600">Satış kaydı oluştur</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sale Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Müşteri Bilgileri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="customer">Müşteri Seç</Label>
                  <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Müşteri seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name} - {customer.phone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Product Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Ürün Ekle</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="product">Ürün</Label>
                    <Select
                      value={selectedProduct}
                      onValueChange={(value) => {
                        setSelectedProduct(value)
                        const product = products.find((p) => p.id === value)
                        if (product) setUnitPrice(product.price)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Ürün seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} (Stok: {product.stock})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="quantity">Miktar</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="unitPrice">Birim Fiyat</Label>
                    <Input
                      id="unitPrice"
                      type="number"
                      value={unitPrice}
                      onChange={(e) => setUnitPrice(Number(e.target.value))}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={addItem} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Ekle
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <VoiceProductAdd onProductAdd={handleVoiceProductAdd} />

            {/* Sale Items */}
            <Card>
              <CardHeader>
                <CardTitle>Satış Kalemleri</CardTitle>
              </CardHeader>
              <CardContent>
                {saleItems.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Henüz ürün eklenmedi</p>
                ) : (
                  <div className="space-y-4">
                    {saleItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.productName}</h4>
                          <p className="text-sm text-gray-600">
                            ₺{item.unitPrice.toLocaleString()} x {item.quantity} = ₺{item.total.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => removeItem(item.id)}>
                            Sil
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment and Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Ödeme ve Notlar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="paymentType">Ödeme Türü</Label>
                  <Select value={paymentType} onValueChange={setPaymentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Ödeme türü seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Nakit</SelectItem>
                      <SelectItem value="credit">Kredi Kartı</SelectItem>
                      <SelectItem value="transfer">Havale/EFT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Açıklama</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Satış ile ilgili notlar..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Satış Özeti</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Ürün Sayısı:</span>
                    <span>{saleItems.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Toplam Miktar:</span>
                    <span>{saleItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Toplam Tutar:</span>
                      <span>₺{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  className="w-full"
                  size="lg"
                  disabled={!selectedCustomer || saleItems.length === 0 || !paymentType}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Satışı Tamamla
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
