"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ComplaintForm } from "@/components/hostel/complaint-form"
import { FormSkeleton } from "@/components/loading-skeleton"

export default function NewComplaintPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
            <div className="h-4 bg-gray-100 rounded w-96 animate-pulse" />
          </div>
          <div className="max-w-2xl mx-auto">
            <FormSkeleton />
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!user) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">File a Complaint</h1>
          <p className="text-muted-foreground mt-1">
            Report any issues or concerns about hostel facilities and services.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <ComplaintForm />
        </div>
      </div>
    </DashboardLayout>
  )
}
