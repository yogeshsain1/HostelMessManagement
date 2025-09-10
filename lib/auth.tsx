"use client"

import React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export interface User {
  id: string
  email: string
  fullName: string
  phone?: string
  role: "student" | "warden" | "admin"
  hostelId?: string
  roomNumber?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  postalCode?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  course?: string
  year?: string
  profileImageUrl?: string
  twoFactorEnabled?: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
  hasRole: (role: string) => boolean
  updateProfile: (updates: Partial<User>) => Promise<User | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demonstration (matches demo accounts shown on login screen)
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@poornima.edu.in",
    fullName: "Admin User",
    phone: "+91-9876543210",
    role: "admin",
  },
  {
    id: "2",
    email: "warden1@poornima.edu.in",
    fullName: "Warden Sharma",
    phone: "+91-9876543211",
    role: "warden",
    hostelId: "1",
  },
  {
    id: "3",
    email: "student1@poornima.edu.in",
    fullName: "Rahul Kumar",
    phone: "+91-9876543212",
    role: "student",
    hostelId: "1",
    roomNumber: "A-101",
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
    console.log('Login attempt:', { email, password })
    console.log('Available users:', mockUsers.map(u => u.email))
    
    const foundUser = mockUsers.find((u) => u.email === email)
    console.log('Found user:', foundUser)

    // Simple password check for demo
    if (foundUser && (password === "password123" || password === "demo123")) {
      setUser(foundUser)
      localStorage.setItem("hostel-user", JSON.stringify(foundUser))
      try {
        document.cookie = "hostel-auth=1; path=/; SameSite=Lax"
      } catch (_) {}
      console.log('Login successful')
      return true
    }
    console.log('Login failed')
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("hostel-user")
    // Navigation will be handled by the component calling this function
    try {
      document.cookie = "hostel-auth=; Max-Age=0; path=/; SameSite=Lax"
    } catch (_) {}
  }

  const hasRole = (role: string): boolean => {
    return user?.role === role
  }

  const updateProfile = async (updates: Partial<User>): Promise<User | null> => {
    if (!user) return null
    const updated: User = { ...user, ...updates }
    setUser(updated)
    try {
      localStorage.setItem("hostel-user", JSON.stringify(updated))
    } catch (_) {}
    return updated
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, hasRole, updateProfile }}>
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

// Logout utility function that can be used in components
export function useLogout() {
  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    // Use replace to avoid going back to a protected page
    try {
      router.replace('/login')
    } catch (_) {
      // Fallback hard navigation in case router is not ready
      window.location.href = '/login'
    }
  }

  return handleLogout
}
