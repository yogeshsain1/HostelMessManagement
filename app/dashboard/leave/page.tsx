"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { LeaveRequestCard } from "@/components/hostel/leave-request-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

const mockLeaveRequests = [
  {
    id: "1",
    startDate: "2024-01-20",
    endDate: "2024-01-25",
    reason: "Going home for family function",
    status: "approved" as const,
    createdAt: "2024-01-15",
    approvedBy: "John Warden",
  },
  {
    id: "2",
    startDate: "2024-01-28",
    endDate: "2024-01-30",
    reason: "Medical appointment in hometown",
    status: "pending" as const,
    createdAt: "2024-01-12",
  },
  {
    id: "3",
    startDate: "2024-01-05",
    endDate: "2024-01-08",
    reason: "Personal work",
    status: "rejected" as const,
    createdAt: "2024-01-01",
  },
]

export default function LeavePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Leave Requests</h1>
            <p className="text-muted-foreground mt-1">View and manage your leave requests.</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/leave/new">
              <Plus className="h-4 w-4 mr-2" />
              Request Leave
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {mockLeaveRequests.map((request) => (
            <LeaveRequestCard key={request.id} request={request} />
          ))}
        </div>

        {mockLeaveRequests.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <h3 className="text-lg font-medium mb-2">No leave requests found</h3>
              <p className="text-muted-foreground mb-4">You haven't submitted any leave requests yet.</p>
              <Button asChild>
                <Link href="/dashboard/leave/new">Request Your First Leave</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
