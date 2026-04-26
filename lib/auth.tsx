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

type ApiUser = User

const normalizeUser = (user: ApiUser): User => ({
  ...user,
  role: user.role.toLowerCase() as User["role"],
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const hydrateSession = async () => {
      try {
        const response = await fetch("/api/users/profile", {
          credentials: "include",
        })

        if (response.ok) {
          const json = await response.json()
          if (json?.success && json?.data?.user) {
            const currentUser = normalizeUser(json.data.user)
            setUser(currentUser)
            localStorage.setItem("hostel-user", JSON.stringify(currentUser))
            return
          }
        }
      } catch (_) {
        // ignore and fall back to local storage
      }

      try {
        const storedUser = localStorage.getItem("hostel-user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (_) {
        // ignore storage parsing issues
      }

      setLoading(false)
    }

    void hydrateSession().finally(() => setLoading(false))
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      })

      const json = await response.json()
      if (!response.ok || !json?.success || !json?.data?.user) {
        return false
      }

      const currentUser = normalizeUser(json.data.user)
      setUser(currentUser)
      localStorage.setItem("hostel-user", JSON.stringify(currentUser))
      return true
    } catch (_) {
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("hostel-user")
    try {
      document.cookie = "hostel-auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax"
    } catch (_) {
    }
  }

  const hasRole = (role: string): boolean => {
    return user?.role === role
  }

  const updateProfile = async (updates: Partial<User>): Promise<User | null> => {
    if (!user) return null
    try {
      const response = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updates),
      })

      const json = await response.json()
      if (!response.ok || !json?.success || !json?.data?.user) {
        return null
      }

      const updated = normalizeUser(json.data.user)
      setUser(updated)
      localStorage.setItem("hostel-user", JSON.stringify(updated))
      return updated
    } catch (_) {
      return null
    }
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
