

import React from "react"
import Image from "next/image"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="mb-8 text-center space-y-3">
          <div className="flex items-center justify-center">
            <div className="h-14 w-14 rounded-xl border border-border/30 bg-card/80 backdrop-blur-sm shadow-sm flex items-center justify-center">
              <Image
                src="/images/poornima-logo.png"
                alt="Poornima University"
                width={40}
                height={40}
                priority
              />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
            Poornima Hostel
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium">Sign in to continue</p>
        </div>
        <div className="bg-white dark:bg-card/90 rounded-2xl shadow-xl border border-border/20 p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
