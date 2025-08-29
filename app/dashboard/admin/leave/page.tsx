"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { LeaveApproval } from "@/components/admin/leave-approval"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, CheckCircle, Clock, XCircle } from "lucide-react"

const mockLeaveRequests = [
  {
    id: "1",
    studentName: "Alice Student",
    roomNumber: "A101",
    startDate: "2024-01-20",
    endDate: "2024-01-25",
    reason: "Going home for family function",
    status: "pending" as const,
    createdAt: "2024-01-15",
    days: 6,
  },
  {
    id: "2",
    studentName: "Bob Student",
    roomNumber: "A102",
    startDate: "2024-01-28",
    endDate: "2024-01-30",
    reason: "Medical appointment in hometown",
    status: "pending" as const,
    createdAt: "2024-01-12",
    days: 3,
  },
  {
    id: "3",
    studentName: "Charlie Student",
    roomNumber: "B201",
    startDate: "2024-01-15",
    endDate: "2024-01-18",
    reason: "Personal work",
    status: "approved" as const,
    createdAt: "2024-01-10",
    days: 4,
  },
  {
    id: "4",
    studentName: "David Student",
    roomNumber: "C301",
    startDate: "2024-01-10",
    endDate: "2024-01-12",
    reason: "Family emergency",
    status: "rejected" as const,
    createdAt: "2024-01-08",
    days: 3,
  },
]

export default function AdminLeavePage() {
  const [requests, setRequests] = useState<typeof mockLeaveRequests>(mockLeaveRequests)

  const handleUpdateRequest = (id: string, status: "approved" | "rejected" | "pending", comment?: string) => {
    setRequests((prev) => prev.map((request) => (request.id === id ? { ...request, status } : request)))
    console.log("Updated leave request:", { id, status, comment })
  }

  const getRequestsByStatus = (status: string) => {
    if (status === "all") return requests
    return requests.filter((request) => request.status === status)
  }

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Leave Request Management</h1>
          <p className="text-muted-foreground mt-1">Review and approve student leave requests.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Total Requests</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Pending</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Approved</p>
                  <p className="text-2xl font-bold">{stats.approved}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <XCircle className="h-4 w-4 text-red-600" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Rejected</p>
                  <p className="text-2xl font-bold">{stats.rejected}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending">Pending Approval</TabsTrigger>
            <TabsTrigger value="all">All Requests</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <LeaveApproval requests={getRequestsByStatus("pending")} onUpdateRequest={handleUpdateRequest} />
          </TabsContent>

          <TabsContent value="all">
            <LeaveApproval requests={getRequestsByStatus("all")} onUpdateRequest={handleUpdateRequest} />
          </TabsContent>

          <TabsContent value="approved">
            <LeaveApproval requests={getRequestsByStatus("approved")} onUpdateRequest={handleUpdateRequest} />
          </TabsContent>

          <TabsContent value="rejected">
            <LeaveApproval requests={getRequestsByStatus("rejected")} onUpdateRequest={handleUpdateRequest} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
