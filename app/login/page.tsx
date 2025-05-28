"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../simple-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { user, login } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/customer/dashboard")
      }
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, userType: "admin" | "customer") => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const username = formData.get("username") as string
    const password = formData.get("password") as string

    try {
      const success = await login(username, password, userType)

      if (!success) {
        setError("Giriş bilgileri hatalı")
      }
    } catch (error) {
      setError("Bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Satış Yönetim Sistemi</CardTitle>
          <CardDescription>Hesabınıza giriş yapın</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="admin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="admin">Admin Girişi</TabsTrigger>
              <TabsTrigger value="customer">Müşteri Girişi</TabsTrigger>
            </TabsList>

            <TabsContent value="admin">
              <form onSubmit={(e) => handleSubmit(e, "admin")} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-username">Kullanıcı Adı</Label>
                  <Input id="admin-username" name="username" type="text" required placeholder="poyraz02" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Şifre</Label>
                  <Input id="admin-password" name="password" type="password" required placeholder="eliz02" />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Giriş yapılıyor..." : "Admin Girişi"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="customer">
              <form onSubmit={(e) => handleSubmit(e, "customer")} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customer-username">Müşteri Kodu</Label>
                  <Input id="customer-username" name="username" type="text" required placeholder="customer1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-password">Şifre</Label>
                  <Input id="customer-password" name="password" type="password" required placeholder="pass123" />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Giriş yapılıyor..." : "Müşteri Girişi"}
                </Button>
              </form>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Test Müşteri Girişi:</strong>
                  <br />
                  Kullanıcı: customer1, Şifre: pass123
                  <br />
                  Kullanıcı: customer2, Şifre: pass456
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
