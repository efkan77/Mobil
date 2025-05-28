"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "customer"
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string, userType: "admin" | "customer") => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user")
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string, userType: "admin" | "customer"): Promise<boolean> => {
    // Admin login
    if (userType === "admin") {
      if (username === "poyraz02" && password === "eliz02") {
        const adminUser: User = {
          id: "admin",
          name: "Admin",
          email: "admin@company.com",
          role: "admin",
        }
        setUser(adminUser)
        localStorage.setItem("user", JSON.stringify(adminUser))
        return true
      }
    }

    // Customer login
    if (userType === "customer") {
      const customers = [
        { id: "1", username: "customer1", password: "pass123", name: "Ahmet Yılmaz" },
        { id: "2", username: "customer2", password: "pass456", name: "Fatma Demir" },
      ]

      const customer = customers.find((c) => c.username === username && c.password === password)

      if (customer) {
        const customerUser: User = {
          id: customer.id,
          name: customer.name,
          email: `${customer.username}@customer.com`,
          role: "customer",
        }
        setUser(customerUser)
        localStorage.setItem("user", JSON.stringify(customerUser))
        return true
      }
    }

    return false
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
    }
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
