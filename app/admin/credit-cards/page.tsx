"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Plus, CreditCardIcon, AlertTriangle, TrendingUp, Calendar } from "lucide-react"
import Link from "next/link"

interface CreditCard {
  id: string
  card_name: string
  bank_name: string
  card_number: string
  credit_limit: number
  current_debt: number
  available_limit: number
  statement_date: number
  due_date: number
  minimum_payment: number
  status: string
}

interface CardTransaction {
  id: string
  card_id: string
  transaction_type: string
  amount: number
  description: string
  transaction_date: string
  sale_number?: string
}

export default function CreditCardsPage() {
  const [cards, setCards] = useState<CreditCard[]>([
    {
      id: "1",
      card_name: "İş Bankası Platinum",
      bank_name: "İş Bankası",
      card_number: "**** 1234",
      credit_limit: 50000,
      current_debt: 15000,
      available_limit: 35000,
      statement_date: 15,
      due_date: 10,
      minimum_payment: 750,
      status: "active",
    },
    {
      id: "2",
      card_name: "Garanti BBVA Gold",
      bank_name: "Garanti BBVA",
      card_number: "**** 5678",
      credit_limit: 30000,
      current_debt: 8500,
      available_limit: 21500,
      statement_date: 20,
      due_date: 15,
      minimum_payment: 425,
      status: "active",
    },
  ])

  const [transactions, setTransactions] = useState<CardTransaction[]>([
    {
      id: "1",
      card_id: "1",
      transaction_type: "purchase",
      amount: 2500,
      description: "Satış #1001 - iPhone 15 Pro",
      transaction_date: "2024-01-15",
      sale_number: "1001",
    },
    {
      id: "2",
      card_id: "1",
      transaction_type: "payment",
      amount: -5000,
      description: "Kredi kartı ödemesi",
      transaction_date: "2024-01-10",
    },
  ])

  const [isAddCardOpen, setIsAddCardOpen] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState<string>("")
  const [newCard, setNewCard] = useState({
    card_name: "",
    bank_name: "",
    card_number: "",
    credit_limit: 0,
    statement_date: 1,
    due_date: 1,
  })

  const addCard = () => {
    if (!newCard.card_name || !newCard.bank_name || !newCard.credit_limit) {
      alert("Lütfen tüm gerekli alanları doldurun")
      return
    }

    const card: CreditCard = {
      id: Date.now().toString(),
      ...newCard,
      current_debt: 0,
      available_limit: newCard.credit_limit,
      minimum_payment: 0,
      status: "active",
    }

    setCards([...cards, card])
    setNewCard({
      card_name: "",
      bank_name: "",
      card_number: "",
      credit_limit: 0,
      statement_date: 1,
      due_date: 1,
    })
    setIsAddCardOpen(false)
  }

  const makePayment = (cardId: string, amount: number) => {
    setCards(
      cards.map((card) => {
        if (card.id === cardId) {
          const newDebt = Math.max(0, card.current_debt - amount)
          return {
            ...card,
            current_debt: newDebt,
            available_limit: card.credit_limit - newDebt,
          }
        }
        return card
      }),
    )

    const newTransaction: CardTransaction = {
      id: Date.now().toString(),
      card_id: cardId,
      transaction_type: "payment",
      amount: -amount,
      description: "Kredi kartı ödemesi",
      transaction_date: new Date().toISOString().split("T")[0],
    }

    setTransactions([newTransaction, ...transactions])
  }

  const getUsagePercentage = (card: CreditCard) => {
    return (card.current_debt / card.credit_limit) * 100
  }

  const getStatusBadge = (card: CreditCard) => {
    const usage = getUsagePercentage(card)
    if (usage >= 80) return <Badge variant="destructive">Yüksek Kullanım</Badge>
    if (usage >= 50) return <Badge variant="secondary">Orta Kullanım</Badge>
    return <Badge variant="default">Düşük Kullanım</Badge>
  }

  const totalDebt = cards.reduce((sum, card) => sum + card.current_debt, 0)
  const totalLimit = cards.reduce((sum, card) => sum + card.credit_limit, 0)
  const totalAvailable = cards.reduce((sum, card) => sum + card.available_limit, 0)

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
                <h1 className="text-3xl font-bold text-gray-900">Kredi Kartları</h1>
                <p className="text-gray-600">Kredi kartı yönetimi ve borç takibi</p>
              </div>
            </div>
            <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Kart
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Yeni Kredi Kartı Ekle</DialogTitle>
                  <DialogDescription>Kredi kartı bilgilerini girin</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardName">Kart Adı</Label>
                    <Input
                      id="cardName"
                      value={newCard.card_name}
                      onChange={(e) => setNewCard({ ...newCard, card_name: e.target.value })}
                      placeholder="İş Bankası Platinum"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bankName">Banka Adı</Label>
                    <Input
                      id="bankName"
                      value={newCard.bank_name}
                      onChange={(e) => setNewCard({ ...newCard, bank_name: e.target.value })}
                      placeholder="İş Bankası"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardNumber">Kart Numarası (Son 4 Hane)</Label>
                    <Input
                      id="cardNumber"
                      value={newCard.card_number}
                      onChange={(e) => setNewCard({ ...newCard, card_number: e.target.value })}
                      placeholder="**** 1234"
                    />
                  </div>
                  <div>
                    <Label htmlFor="creditLimit">Kredi Limiti</Label>
                    <Input
                      id="creditLimit"
                      type="number"
                      value={newCard.credit_limit}
                      onChange={(e) => setNewCard({ ...newCard, credit_limit: Number(e.target.value) })}
                      placeholder="50000"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="statementDate">Ekstre Tarihi</Label>
                      <Input
                        id="statementDate"
                        type="number"
                        min="1"
                        max="31"
                        value={newCard.statement_date}
                        onChange={(e) => setNewCard({ ...newCard, statement_date: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dueDate">Son Ödeme Tarihi</Label>
                      <Input
                        id="dueDate"
                        type="number"
                        min="1"
                        max="31"
                        value={newCard.due_date}
                        onChange={(e) => setNewCard({ ...newCard, due_date: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                  <Button onClick={addCard} className="w-full">
                    Kart Ekle
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Özet İstatistikler */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CreditCardIcon className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Limit</p>
                  <p className="text-2xl font-bold">₺{totalLimit.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Borç</p>
                  <p className="text-2xl font-bold text-red-600">₺{totalDebt.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Kullanılabilir</p>
                  <p className="text-2xl font-bold text-green-600">₺{totalAvailable.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Aktif Kart</p>
                  <p className="text-2xl font-bold">{cards.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="cards" className="space-y-6">
          <TabsList>
            <TabsTrigger value="cards">Kartlarım</TabsTrigger>
            <TabsTrigger value="transactions">İşlem Geçmişi</TabsTrigger>
            <TabsTrigger value="payments">Ödeme Takvimi</TabsTrigger>
          </TabsList>

          <TabsContent value="cards">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {cards.map((card) => (
                <Card key={card.id} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{card.card_name}</CardTitle>
                      {getStatusBadge(card)}
                    </div>
                    <CardDescription>
                      {card.bank_name} • {card.card_number}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Kullanım Oranı</span>
                        <span>{getUsagePercentage(card).toFixed(1)}%</span>
                      </div>
                      <Progress value={getUsagePercentage(card)} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Limit</p>
                        <p className="font-bold">₺{card.credit_limit.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Borç</p>
                        <p className="font-bold text-red-600">₺{card.current_debt.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Kullanılabilir</p>
                        <p className="font-bold text-green-600">₺{card.available_limit.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Min. Ödeme</p>
                        <p className="font-bold">₺{card.minimum_payment.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Ekstre</p>
                        <p className="font-medium">Her ayın {card.statement_date}'i</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Son Ödeme</p>
                        <p className="font-medium">Her ayın {card.due_date}'i</p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" className="flex-1">
                            Ödeme Yap
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Kredi Kartı Ödemesi</DialogTitle>
                            <DialogDescription>
                              {card.card_name} - {card.bank_name}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Ödeme Tutarı</Label>
                              <Input type="number" placeholder="Ödeme tutarını girin" />
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => makePayment(card.id, card.minimum_payment)}
                              >
                                Min. Ödeme
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => makePayment(card.id, card.current_debt / 2)}
                              >
                                Yarısı
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => makePayment(card.id, card.current_debt)}
                              >
                                Tamamı
                              </Button>
                            </div>
                            <Button className="w-full">Ödeme Yap</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" variant="outline">
                        Detaylar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>İşlem Geçmişi</CardTitle>
                <CardDescription>Tüm kredi kartı işlemleriniz</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tarih</TableHead>
                      <TableHead>Kart</TableHead>
                      <TableHead>İşlem</TableHead>
                      <TableHead>Tutar</TableHead>
                      <TableHead>Açıklama</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => {
                      const card = cards.find((c) => c.id === transaction.card_id)
                      return (
                        <TableRow key={transaction.id}>
                          <TableCell>{new Date(transaction.transaction_date).toLocaleDateString("tr-TR")}</TableCell>
                          <TableCell>{card?.card_name}</TableCell>
                          <TableCell>
                            <Badge variant={transaction.transaction_type === "payment" ? "default" : "secondary"}>
                              {transaction.transaction_type === "payment" ? "Ödeme" : "Alışveriş"}
                            </Badge>
                          </TableCell>
                          <TableCell className={transaction.amount < 0 ? "text-green-600" : "text-red-600"}>
                            {transaction.amount < 0 ? "+" : ""}₺{Math.abs(transaction.amount).toLocaleString()}
                          </TableCell>
                          <TableCell>{transaction.description}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Ödeme Takvimi</CardTitle>
                <CardDescription>Yaklaşan ödeme tarihleri</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cards.map((card) => (
                    <div key={card.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{card.card_name}</p>
                        <p className="text-sm text-gray-600">Son ödeme: Her ayın {card.due_date}'i</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-600">₺{card.minimum_payment.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Min. ödeme</p>
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
