"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface User {
  id: string
  email: string
  fullName: string
  role: "student" | "warden" | "admin"
  hostelId?: string
  roomNumber?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
  hasRole: (role: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@hostel.com",
    fullName: "Admin User",
    role: "admin",
  },
  {
    id: "2",
    email: "warden@hostel.com",
    fullName: "Warden User",
    role: "warden",
    hostelId: "1",
  },
  {
    id: "3",
    email: "student@hostel.com",
    fullName: "Student User",
    role: "student",
    hostelId: "1",
    roomNumber: "A101",
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

    // Simple password check for demo
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

  const hasRole = (role: string): boolean => {
    return user?.role === role
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, hasRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
