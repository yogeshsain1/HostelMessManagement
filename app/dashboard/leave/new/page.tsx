"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { LeaveRequestForm } from "@/components/hostel/leave-request-form"

export default function NewLeaveRequestPage() {
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
          <h1 className="text-3xl font-bold text-foreground">Request Leave</h1>
          <p className="text-muted-foreground mt-1">Submit a leave request for approval by the hostel warden.</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <LeaveRequestForm />
        </div>
      </div>
    </DashboardLayout>
  )
}
