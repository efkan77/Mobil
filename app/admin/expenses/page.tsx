"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, ArrowLeft, Receipt, TrendingUp, AlertTriangle, Calendar, DollarSign, FileText } from "lucide-react"
import Link from "next/link"

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newExpense, setNewExpense] = useState({
    category_id: "",
    description: "",
    amount: "",
    expense_date: new Date().toISOString().split("T")[0],
    is_recurring: false,
    recurring_period: "",
    receipt_number: "",
    notes: "",
  })

  // Mock data
  const mockExpenses = [
    {
      id: 1,
      category_name: "Kira",
      description: "Mağaza kirası - Ocak 2024",
      amount: 15000,
      expense_date: "2024-01-01",
      is_recurring: true,
      recurring_period: "monthly",
      receipt_number: "KIRA-2024-01",
      is_fixed: true,
    },
    {
      id: 2,
      category_name: "Elektrik",
      description: "Elektrik faturası",
      amount: 8500,
      expense_date: "2024-01-15",
      is_recurring: false,
      receipt_number: "ELK-2024-001",
      is_fixed: false,
    },
    {
      id: 3,
      category_name: "Personel Maaşları",
      description: "Ocak ayı maaşları",
      amount: 85000,
      expense_date: "2024-01-31",
      is_recurring: true,
      recurring_period: "monthly",
      receipt_number: "MAAS-2024-01",
      is_fixed: true,
    },
    {
      id: 4,
      category_name: "Pazarlama",
      description: "Google Ads kampanyası",
      amount: 12000,
      expense_date: "2024-01-10",
      is_recurring: false,
      receipt_number: "PAZ-2024-001",
      is_fixed: false,
    },
    {
      id: 5,
      category_name: "Ürün Alımı",
      description: "iPhone 15 Pro stok alımı",
      amount: 450000,
      expense_date: "2024-01-05",
      is_recurring: false,
      receipt_number: "STOK-2024-001",
      is_fixed: false,
    },
  ]

  const mockCategories = [
    { id: 1, name: "Kira", is_fixed: true },
    { id: 2, name: "Personel Maaşları", is_fixed: true },
    { id: 3, name: "Elektrik", is_fixed: false },
    { id: 4, name: "Su", is_fixed: false },
    { id: 5, name: "İnternet", is_fixed: true },
    { id: 6, name: "Ürün Alımı", is_fixed: false },
    { id: 7, name: "Pazarlama", is_fixed: false },
    { id: 8, name: "Nakliye", is_fixed: false },
    { id: 9, name: "Vergi", is_fixed: false },
    { id: 10, name: "Diğer", is_fixed: false },
  ]

  useEffect(() => {
    setExpenses(mockExpenses)
    setCategories(mockCategories)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleAddExpense = () => {
    // API çağrısı yapılacak
    console.log("Yeni gider:", newExpense)
    setIsAddDialogOpen(false)
    setNewExpense({
      category_id: "",
      description: "",
      amount: "",
      expense_date: new Date().toISOString().split("T")[0],
      is_recurring: false,
      recurring_period: "",
      receipt_number: "",
      notes: "",
    })
  }

  const totalExpenses = mockExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const fixedExpenses = mockExpenses.filter((e) => e.is_fixed).reduce((sum, expense) => sum + expense.amount, 0)
  const variableExpenses = totalExpenses - fixedExpenses

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link href="/admin/profit-loss">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Geri
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gider Yönetimi</h1>
                <p className="text-gray-600">İşletme giderlerini takip edin ve analiz edin</p>
              </div>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Gider Ekle
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Yeni Gider Ekle</DialogTitle>
                  <DialogDescription>İşletme giderinizi kaydedin</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="category">Kategori</Label>
                    <Select
                      value={newExpense.category_id}
                      onValueChange={(value) => setNewExpense({ ...newExpense, category_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Kategori seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                            {category.is_fixed && (
                              <Badge variant="secondary" className="ml-2">
                                Sabit
                              </Badge>
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Açıklama</Label>
                    <Input
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                      placeholder="Gider açıklaması"
                    />
                  </div>

                  <div>
                    <Label htmlFor="amount">Tutar (₺)</Label>
                    <Input
                      type="number"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="expense_date">Tarih</Label>
                    <Input
                      type="date"
                      value={newExpense.expense_date}
                      onChange={(e) => setNewExpense({ ...newExpense, expense_date: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="receipt_number">Fiş/Fatura No</Label>
                    <Input
                      value={newExpense.receipt_number}
                      onChange={(e) => setNewExpense({ ...newExpense, receipt_number: e.target.value })}
                      placeholder="Opsiyonel"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Notlar</Label>
                    <Textarea
                      value={newExpense.notes}
                      onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })}
                      placeholder="Ek notlar..."
                      rows={3}
                    />
                  </div>

                  <Button onClick={handleAddExpense} className="w-full">
                    Gider Ekle
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Gider Özeti */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Gider</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Sabit Giderler</p>
                  <p className="text-2xl font-bold text-orange-600">{formatCurrency(fixedExpenses)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Değişken Giderler</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(variableExpenses)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gider Listesi */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Receipt className="h-5 w-5 mr-2" />
              Gider Listesi
            </CardTitle>
            <CardDescription>Tüm işletme giderlerinizi görüntüleyin</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Açıklama</TableHead>
                  <TableHead>Tutar</TableHead>
                  <TableHead>Tarih</TableHead>
                  <TableHead>Fiş No</TableHead>
                  <TableHead>Tür</TableHead>
                  <TableHead>Tekrar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">{expense.category_name}</TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell className="font-bold text-red-600">{formatCurrency(expense.amount)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        {expense.expense_date}
                      </div>
                    </TableCell>
                    <TableCell>
                      {expense.receipt_number && (
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-1 text-gray-400" />
                          {expense.receipt_number}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={expense.is_fixed ? "default" : "secondary"}>
                        {expense.is_fixed ? "Sabit" : "Değişken"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {expense.is_recurring && (
                        <Badge variant="outline">{expense.recurring_period === "monthly" ? "Aylık" : "Yıllık"}</Badge>
                      )}
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
