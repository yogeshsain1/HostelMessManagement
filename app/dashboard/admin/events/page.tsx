"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"

export default function AdminEventsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Events Management</h1>
          <p className="text-muted-foreground mt-1">Create and manage hostel events</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Events management functionality coming soon.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
