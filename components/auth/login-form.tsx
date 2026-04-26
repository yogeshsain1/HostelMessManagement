"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"

export function LoginForm() {
  const cardRef = useRef<HTMLDivElement | null>(null)
  const titleRef = useRef<HTMLDivElement | null>(null)
  const formRef = useRef<HTMLFormElement | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberEmail, setRememberEmail] = useState(true)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  useGSAP(
    () => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 20, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" }
      )

      gsap.fromTo(titleRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.1 })

      gsap.fromTo(
        formRef.current?.querySelectorAll("[data-login-field]"),
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: "power3.out", delay: 0.18 }
      )

      gsap.fromTo(
        formRef.current?.querySelectorAll("[data-login-action]"),
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.32 }
      )
    },
    { scope: cardRef }
  )

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
      const success = await login(email.trim(), password.trim())
      if (success) {
        try {
          if (rememberEmail) {
            localStorage.setItem("demo-remember-email", "1")
            localStorage.setItem("demo-email", email.trim())
          } else {
            localStorage.removeItem("demo-remember-email")
            localStorage.removeItem("demo-email")
          }
        } catch (_) {}

        router.replace("/dashboard")
        router.refresh()
      } else {
        setError("Invalid email or password")
        setLoading(false)
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An error occurred during login")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[0]">
      <Card
        ref={cardRef}
        className="w-full max-w-sm sm:max-w-md mx-auto relative z-10 overflow-hidden border border-white/10 bg-white/6 shadow-[0_30px_100px_rgba(0,0,0,0.4)] backdrop-blur-2xl rounded-[1.75rem] text-white"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />
        <CardHeader className="text-center px-4 sm:px-6 pt-7 pb-5 sm:pt-8 sm:pb-6">
          <div ref={titleRef} className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-white/65 backdrop-blur-xl">
              Secure sign-in
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Poornima University
            </CardTitle>
            <CardDescription className="text-sm sm:text-base text-white/65">
              Hostel Management System - Jaipur Campus
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-4 sm:px-6 pb-6 sm:pb-7">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 sm:space-y-4">
            <div data-login-field className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-white/85">
                University Email
              </Label>
              <div className="relative">
                <Mail className="h-4 w-4 text-white/45 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@poornima.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-9 transition-all duration-300 focus:scale-[1.01] focus:ring-2 focus:ring-cyan-300/20 h-11 sm:h-10 text-base sm:text-sm bg-white/8 backdrop-blur-sm border-white/10 text-white placeholder:text-white/35"
                />
              </div>
            </div>

            <div data-login-field className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-white/85">
                Password
              </Label>
              <div className="relative">
                <Lock className="h-4 w-4 text-white/45 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-9 pr-10 transition-all duration-300 focus:scale-[1.01] focus:ring-2 focus:ring-cyan-300/20 h-11 sm:h-10 text-base sm:text-sm bg-white/8 backdrop-blur-sm border-white/10 text-white placeholder:text-white/35"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-white/55 transition-colors hover:bg-white/8 hover:text-white"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div data-login-field className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 select-none text-white/70">
                <input
                  type="checkbox"
                  checked={rememberEmail}
                  onChange={(e) => setRememberEmail(e.target.checked)}
                  className="h-3.5 w-3.5 accent-cyan-400"
                />
                <span>Remember email</span>
              </label>
            </div>

            {error && (
              <Alert
                variant="destructive"
                className="border-destructive/40 bg-destructive/15 text-white"
              >
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <EnhancedButton
              data-login-action
              type="submit"
              className="w-full h-11 sm:h-10 text-base sm:text-sm font-medium shadow-[0_18px_40px_rgba(34,211,238,0.22)]"
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
