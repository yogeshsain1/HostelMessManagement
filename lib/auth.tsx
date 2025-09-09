"use client"

import React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export interface User {
  id: string
  email: string
  fullName: string
  phone?: string
  role: "STUDENT" | "WARDEN" | "ADMIN"
  hostel?: string
  room?: string
  createdAt?: string
  updatedAt?: string
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
    role: "ADMIN",
  },
  {
    id: "2",
    email: "warden1@poornima.edu.in",
    fullName: "Warden Sharma",
    phone: "+91-9876543211",
    role: "WARDEN",
    hostel: "1",
  },
  {
    id: "3",
    email: "student1@poornima.edu.in",
    fullName: "Rahul Kumar",
    phone: "+91-9876543212",
    role: "STUDENT",
    hostel: "1",
    room: "A-101",
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
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        // Store token in localStorage for persistence
        localStorage.setItem('hostel-token', data.token)
        localStorage.setItem('hostel-user', JSON.stringify(data.user))
        try {
          document.cookie = 'hostel-auth=1; path=/; SameSite=Lax'
        } catch (_) {}
        console.log('Login successful')
        return true
      } else {
        const error = await response.json()
        console.error('Login failed:', error.error)
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('hostel-user')
    localStorage.removeItem('hostel-token')
    // Navigation will be handled by the component calling this function
    try {
      document.cookie = 'hostel-auth=; Max-Age=0; path=/; SameSite=Lax'
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
