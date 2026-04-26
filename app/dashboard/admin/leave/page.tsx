"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { LeaveApproval } from "@/components/admin/leave-approval"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, CheckCircle, Clock, XCircle } from "lucide-react"

export default function AdminLeavePage() {
  const [requests, setRequests] = useState<any[]>([])

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const response = await fetch("/api/leave-requests", { credentials: "include" })
        const json = await response.json()
        if (!response.ok || !json?.success || !Array.isArray(json?.data?.leaveRequests)) return

        setRequests(
          json.data.leaveRequests.map((request: any) => ({
            id: request.id,
            studentName: request.user?.fullName || "Unknown Student",
            roomNumber: request.user?.roomNumber || "N/A",
            startDate: new Date(request.startDate).toISOString().slice(0, 10),
            endDate: new Date(request.endDate).toISOString().slice(0, 10),
            reason: request.reason,
            status: request.status.toLowerCase() as "pending" | "approved" | "rejected",
            createdAt: new Date(request.createdAt).toISOString().slice(0, 10),
            days: Math.max(1, Math.ceil((new Date(request.endDate).getTime() - new Date(request.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1),
          })),
        )
      } catch {
        // keep stable UI if API is unavailable
      }
    }

    void loadRequests()
  }, [])

  const handleUpdateRequest = async (id: string, status: "approved" | "rejected" | "pending", comment?: string) => {
    try {
      const response = await fetch(`/api/leave-requests/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          status: status.toUpperCase(),
          rejectionReason: status === "rejected" ? comment || "Rejected by admin" : undefined,
        }),
      })

      const json = await response.json()
      if (!response.ok || !json?.success) throw new Error("Update failed")

      setRequests((prev) => prev.map((request) => (request.id === id ? { ...request, status } : request)))
    } catch {
      // keep UI stable
    }
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
