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
    const trimmedEmail = email.trim().toLowerCase()
    const trimmedPassword = password.trim()
    
    console.log('=== LOGIN ATTEMPT ===')
    console.log('Email (trimmed/lowercase):', trimmedEmail)
    console.log('Password received:', `"${trimmedPassword}"`)
    console.log('Password length:', trimmedPassword.length)
    console.log('Password === "password123":', trimmedPassword === "password123")
    console.log('Expected: "password123"')
    console.log('Available users:', mockUsers.map(u => u.email))
    
    const foundUser = mockUsers.find((u) => u.email.toLowerCase() === trimmedEmail)
    console.log('Found user:', foundUser ? foundUser.email : 'NOT FOUND')

    // Simple password check for demo - accept any of these passwords
    const validPasswords = ["password123", "demo123", "Password123", "PASSWORD123"]
    const isPasswordValid = validPasswords.some(validPwd => trimmedPassword === validPwd)
    
    console.log('Password valid:', isPasswordValid)
    
    if (foundUser && isPasswordValid) {
      console.log('✓ Login successful!')
      setUser(foundUser)
      
      // Set localStorage
      try {
        localStorage.setItem("hostel-user", JSON.stringify(foundUser))
        console.log('✓ LocalStorage set')
      } catch (e) {
        console.error('✗ LocalStorage error:', e)
      }
      
      // Set cookie with proper parameters
      try {
        // Set cookie that expires in 24 hours
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString()
        const cookieString = `hostel-auth=1; expires=${expires}; path=/; SameSite=Lax`
        document.cookie = cookieString
        console.log('✓ Cookie set:', cookieString)
        console.log('✓ Current cookies:', document.cookie)
        
        // Verify cookie was set
        const cookieCheck = document.cookie.split(';').find(c => c.trim().startsWith('hostel-auth='))
        console.log('✓ Cookie verification:', cookieCheck ? 'SUCCESS' : 'FAILED')
      } catch (e) {
        console.error('✗ Cookie error:', e)
      }
      
      return true
    }
    
    console.log('✗ Login failed - invalid credentials')
    return false
  }

  const logout = () => {
    console.log('=== LOGOUT ===')
    setUser(null)
    localStorage.removeItem("hostel-user")
    // Navigation will be handled by the component calling this function
    try {
      // Clear cookie by setting expiration in the past
      document.cookie = "hostel-auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax"
      console.log('✓ Cookie cleared')
    } catch (e) {
      console.error('✗ Cookie clear error:', e)
    }
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
