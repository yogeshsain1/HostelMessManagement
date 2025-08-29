"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { QRScanner } from "@/components/mess/qr-scanner"

export default function QRAttendancePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">QR Attendance</h1>
          <p className="text-muted-foreground mt-1">Scan the QR code at the mess entrance to mark your attendance.</p>
        </div>

        <div className="max-w-md mx-auto">
          <QRScanner />
        </div>
      </div>
    </DashboardLayout>
  )
}
