import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Hostel Management</h1>
          <p className="text-muted-foreground">Your digital hostel companion</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
