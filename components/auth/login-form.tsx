"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import Image from "next/image"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const success = await login(email, password)
      if (success) {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary via-background to-secondary p-4 sm:p-6 relative overflow-hidden">


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
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                University Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@poornima.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="transition-all duration-300 focus:scale-[1.02] focus:ring-2 focus:ring-primary/20 h-11 sm:h-10 text-base sm:text-sm bg-background/50 backdrop-blur-sm border-border/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="transition-all duration-300 focus:scale-[1.02] focus:ring-2 focus:ring-primary/20 h-11 sm:h-10 text-base sm:text-sm bg-background/50 backdrop-blur-sm border-border/50"
              />
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
