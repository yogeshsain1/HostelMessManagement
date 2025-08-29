"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberEmail, setRememberEmail] = useState(true)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  useEffect(() => {
    try {
      const saved = localStorage.getItem("demo-remember-email")
      const savedEmail = localStorage.getItem("demo-email")
      if (saved === "1" && savedEmail) {
        setEmail(savedEmail)
        setRememberEmail(true)
      }
    } catch (_) {
      // ignore
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const success = await login(email, password)
      if (success) {
        try {
          if (rememberEmail) {
            localStorage.setItem("demo-remember-email", "1")
            localStorage.setItem("demo-email", email)
          } else {
            localStorage.removeItem("demo-remember-email")
            localStorage.removeItem("demo-email")
          }
        } catch (_) {}
        router.push("/dashboard")
      } else {
        setError("Invalid email or password")
      }
    } catch (err) {
      setError("An error occurred during login")
    } finally {
      setLoading(false)
    }
  }

  const quickFill = (role: "admin" | "warden" | "student") => {
    if (role === "admin") {
      setEmail("admin@poornima.edu.in")
    } else if (role === "warden") {
      setEmail("warden1@poornima.edu.in")
    } else {
      setEmail("student1@poornima.edu.in")
    }
    setPassword("demo123")
  }

  return (
    <div className="min-h-[0]">
      <Card className="w-full max-w-sm sm:max-w-md mx-auto relative z-10 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 bg-card/80 backdrop-blur-sm border-2 border-primary/20 shadow-xl rounded-xl">
        <CardHeader className="text-center px-4 sm:px-6 py-6">
          <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent animate-in fade-in-0 duration-500 delay-300">
            Poornima University
          </CardTitle>
          <CardDescription className="animate-in fade-in-0 duration-500 delay-400 text-sm text-muted-foreground">
            Hostel Management System - Jaipur Campus
          </CardDescription>
        </CardHeader>

        <CardContent className="animate-in fade-in-0 duration-500 delay-500 px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
            <Button variant="outline" size="sm" onClick={() => quickFill("student")}>Student</Button>
            <Button variant="outline" size="sm" onClick={() => quickFill("warden")}>Warden</Button>
            <Button variant="outline" size="sm" onClick={() => quickFill("admin")}>Admin</Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                University Email
              </Label>
              <div className="relative">
                <Mail className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@poornima.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-9 transition-all duration-300 focus:scale-[1.02] focus:ring-2 focus:ring-primary/20 h-11 sm:h-10 text-base sm:text-sm bg-background/50 backdrop-blur-sm border-border/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-9 pr-10 transition-all duration-300 focus:scale-[1.02] focus:ring-2 focus:ring-primary/20 h-11 sm:h-10 text-base sm:text-sm bg-background/50 backdrop-blur-sm border-border/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 select-none">
                <input
                  type="checkbox"
                  checked={rememberEmail}
                  onChange={(e) => setRememberEmail(e.target.checked)}
                  className="h-3.5 w-3.5 accent-primary"
                />
                <span className="text-muted-foreground">Remember email</span>
              </label>
              <span className="text-xs text-muted-foreground">Demo password: <span className="font-medium">demo123</span></span>
            </div>

            {error && (
              <Alert
                variant="destructive"
                className="animate-in slide-in-from-top-2 duration-300 border-destructive/50 bg-destructive/10"
              >
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <EnhancedButton
              type="submit"
              className="w-full h-11 sm:h-10 text-base sm:text-sm font-medium"
              gradient
              glow
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </EnhancedButton>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
