"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import * as speakeasy from "speakeasy"
import bcrypt from "bcryptjs"
import CryptoJS from "crypto-js"


// User type with 2FA and audit log
export interface User {
  id: string
  email: string
  fullName: string
  phone?: string
  role: "student" | "warden" | "admin"
  hostelId?: string
  roomNumber?: string
  twoFASecret?: string
  auditLogs?: AuditLog[]
}

export interface AuditLog {
  action: string
  timestamp: string
  details?: string
}


interface AuthContextType {
  user: User | null
  login: (email: string, password: string, twoFACode?: string) => Promise<boolean>
  logout: () => void
  loading: boolean
  enable2FA: (userId: string) => string | null
  verify2FA: (userId: string, token: string) => boolean
  hasRole: (role: string) => boolean
  addAuditLog: (action: string, details?: string) => void
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
    auditLogs: [],
  },
  {
    id: "2",
    email: "warden1@hostel.com",
    fullName: "John Warden",
    phone: "+1234567891",
    role: "warden",
    hostelId: "1",
    auditLogs: [],
  },
  {
    id: "3",
    email: "student1@hostel.com",
    fullName: "Alice Student",
    phone: "+1234567892",
    role: "student",
    hostelId: "1",
    roomNumber: "A101",
    auditLogs: [],
  },
  {
    id: "4",
    email: "student2@hostel.com",
    fullName: "Bob Student",
    phone: "+1234567893",
    role: "student",
    hostelId: "1",
    roomNumber: "A102",
    auditLogs: [],
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


  // Data encryption example
  function encryptData(data: string): string {
    return CryptoJS.AES.encrypt(data, "hostel-secret-key").toString();
  }

  function decryptData(cipher: string): string {
    const bytes = CryptoJS.AES.decrypt(cipher, "hostel-secret-key");
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // Audit log
  function addAuditLog(action: string, details?: string) {
    if (user) {
      const log: AuditLog = { action, timestamp: new Date().toISOString(), details };
      user.auditLogs = user.auditLogs || [];
      user.auditLogs.push(log);
      localStorage.setItem("hostel-user", JSON.stringify(user));
    }
  }

  // Role-based permissions
  function hasRole(role: string): boolean {
    return user?.role === role;
  }

  // Two-factor authentication setup
  function enable2FA(userId: string): string | null {
    const foundUser = mockUsers.find((u) => u.id === userId);
    if (foundUser) {
      const secret = speakeasy.generateSecret({ length: 20 });
      foundUser.twoFASecret = secret.base32;
      addAuditLog("Enable 2FA", `User ${userId} enabled 2FA.`);
      return secret.otpauth_url;
    }
    return null;
  }

  function verify2FA(userId: string, token: string): boolean {
    const foundUser = mockUsers.find((u) => u.id === userId);
    if (foundUser && foundUser.twoFASecret) {
      return speakeasy.totp.verify({
        secret: foundUser.twoFASecret,
        encoding: "base32",
        token,
      });
    }
    return false;
  }

  // Passwords should be encrypted in real apps
  const login = async (email: string, password: string, twoFACode?: string): Promise<boolean> => {
    // Mock authentication - in real app, this would call an API
    const foundUser = mockUsers.find((u) => u.email === email);

    // Example: encrypted password check (mock)
    const validPassword = password === "password123"; // Replace with bcrypt.compare in real app

    if (foundUser && validPassword) {
      // If user has 2FA enabled, require code
      if (foundUser.twoFASecret) {
        if (!twoFACode || !verify2FA(foundUser.id, twoFACode)) {
          return false;
        }
      }
      setUser(foundUser);
      localStorage.setItem("hostel-user", JSON.stringify(foundUser));
      addAuditLog("Login", `User ${foundUser.id} logged in.`);
      return true;
    }
    return false;
  }

  const logout = () => {
    addAuditLog("Logout", `User ${user?.id} logged out.`);
    setUser(null);
    localStorage.removeItem("hostel-user");
  }

  return <AuthContext.Provider value={{ user, login, logout, loading, enable2FA, verify2FA, hasRole, addAuditLog }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
