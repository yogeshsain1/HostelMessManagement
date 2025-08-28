"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import Image from "next/image"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Store the JWT token
        localStorage.setItem('auth-token', data.token)
        localStorage.setItem('hostel-user', JSON.stringify(data.user))
        router.push("/dashboard")
      } else {
        setError(data.error || "Invalid email or password")
      }
    } catch (err) {
      setError("An error occurred during login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary via-background to-secondary p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/campus-hero.png"
          alt="Poornima University Campus"
          fill
          className="object-cover opacity-30 dark:opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 dark:from-primary/5 dark:to-primary/10" />
      </div>

      <Card className="w-full max-w-sm sm:max-w-md mx-auto relative z-10 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 bg-card/80 backdrop-blur-sm border-2 border-primary/20 shadow-xl rounded-xl">
        <CardHeader className="text-center px-4 sm:px-6 py-6">
          <div className="mb-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 relative animate-in zoom-in-0 duration-500 delay-200 hover:scale-110 transition-transform">
              <Image
                src="/images/poornima-logo.png"
                alt="Poornima University Logo"
                fill
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>
          </div>
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

          <div className="mt-6 p-3 sm:p-4 bg-muted/50 backdrop-blur-sm rounded-xl animate-in fade-in-0 duration-500 delay-700 border border-border/30">
            <p className="text-sm font-medium mb-2 text-foreground">Demo Accounts:</p>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p>
                <strong className="text-primary">Student:</strong> student1@poornima.edu.in
              </p>
              <p>
                <strong className="text-primary">Warden:</strong> warden1@poornima.edu.in
              </p>
              <p>
                <strong className="text-primary">Admin:</strong> admin@poornima.edu.in
              </p>
              <p>
                <strong className="text-primary">Password:</strong> password123
              </p>
            </div>
          </div>

          <div className="mt-4 text-center animate-in fade-in-0 duration-500 delay-800">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground flex-wrap">
              <span>Official University Partner of</span>
              <div className="flex items-center gap-1 bg-background/30 px-2 py-1 rounded-full backdrop-blur-sm">
                <Image
                  src="/images/rajasthan-royals.png"
                  alt="Rajasthan Royals"
                  width={16}
                  height={16}
                  className="inline"
                />
                <span className="font-medium text-primary">Rajasthan Royals</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
