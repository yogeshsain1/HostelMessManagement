"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Mock user type
export interface User {
  id: string
  email: string
  fullName: string
  phone?: string
  role: "student" | "warden" | "admin"
  hostelId?: string
  roomNumber?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@hostel.com",
    fullName: "Admin User",
    phone: "+1234567890",
    role: "admin",
  },
  {
    id: "2",
    email: "warden1@hostel.com",
    fullName: "John Warden",
    phone: "+1234567891",
    role: "warden",
    hostelId: "1",
  },
  {
    id: "3",
    email: "student1@hostel.com",
    fullName: "Alice Student",
    phone: "+1234567892",
    role: "student",
    hostelId: "1",
    roomNumber: "A101",
  },
  {
    id: "4",
    email: "student2@hostel.com",
    fullName: "Bob Student",
    phone: "+1234567893",
    role: "student",
    hostelId: "1",
    roomNumber: "A102",
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("hostel-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would call an API
    const foundUser = mockUsers.find((u) => u.email === email)

    if (foundUser && password === "password123") {
      setUser(foundUser)
      localStorage.setItem("hostel-user", JSON.stringify(foundUser))
      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("hostel-user")
  }

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
