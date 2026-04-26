"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ComplaintManagement } from "@/components/admin/complaint-management"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { DashboardSkeleton, CardsSkeleton } from "@/components/loading-skeleton"
import { EmptyState } from "@/components/error-message"

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const response = await fetch("/api/complaints", { credentials: "include" })
        const json = await response.json()
        if (!response.ok || !json?.success || !Array.isArray(json?.data?.complaints)) return

        setComplaints(
          json.data.complaints.map((complaint: any) => ({
            id: complaint.id,
            title: complaint.title,
            description: complaint.description,
            category: complaint.category,
            status: complaint.status.toLowerCase().replaceAll("_", "-") as "pending" | "in-progress" | "resolved" | "rejected",
            priority: complaint.priority.toLowerCase() as "low" | "medium" | "high" | "urgent",
            studentName: complaint.user?.fullName || "Unknown Student",
            roomNumber: complaint.user?.roomNumber || "N/A",
            createdAt: new Date(complaint.createdAt).toISOString().slice(0, 10),
          })),
        )
      } finally {
        setLoading(false)
      }
    }

    void loadComplaints()
  }, [])

  const handleUpdateComplaint = async (id: string, status: string, response?: string) => {
    try {
      const backendStatus = status.toUpperCase().replace("-", "_")
      const requestBody = {
        status: backendStatus,
        resolutionNote: response || undefined,
      }

      const res = await fetch(`/api/complaints/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify(requestBody),
      })

      const json = await res.json()
      if (!res.ok || !json?.success) throw new Error("Failed to update complaint")

      setComplaints((prev) =>
        prev.map((complaint) =>
          complaint.id === id ? { ...complaint, status: status as any } : complaint,
        ),
      )
    } catch (_) {
      // keep UI stable; data can be refreshed on next load
    }
  }

  const getComplaintsByStatus = (status: string) => {
    if (status === "all") return complaints
    return complaints.filter((complaint) => complaint.status === status)
  }

  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "pending").length,
    inProgress: complaints.filter((c) => c.status === "in-progress").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {loading ? (
          <DashboardSkeleton />
        ) : (
        <>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Complaint Management</h1>
          <p className="text-muted-foreground mt-1">Review and manage all hostel complaints.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Total Complaints</p>
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
                <Clock className="h-4 w-4 text-blue-600" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">In Progress</p>
                  <p className="text-2xl font-bold">{stats.inProgress}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Resolved</p>
                  <p className="text-2xl font-bold">{stats.resolved}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Complaints</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {getComplaintsByStatus("all").length === 0 ? (
              <EmptyState title="No complaints" description="There are no complaints to show." />
            ) : (
              <ComplaintManagement complaints={getComplaintsByStatus("all")} onUpdateComplaint={handleUpdateComplaint} />
            )}
          </TabsContent>

          <TabsContent value="pending">
            {getComplaintsByStatus("pending").length === 0 ? (
              <EmptyState title="No pending complaints" />
            ) : (
              <ComplaintManagement
                complaints={getComplaintsByStatus("pending")}
                onUpdateComplaint={handleUpdateComplaint}
              />
            )}
          </TabsContent>

          <TabsContent value="in-progress">
            {getComplaintsByStatus("in-progress").length === 0 ? (
              <EmptyState title="No in-progress complaints" />
            ) : (
              <ComplaintManagement
                complaints={getComplaintsByStatus("in-progress")}
                onUpdateComplaint={handleUpdateComplaint}
              />
            )}
          </TabsContent>

          <TabsContent value="resolved">
            {getComplaintsByStatus("resolved").length === 0 ? (
              <EmptyState title="No resolved complaints" />
            ) : (
              <ComplaintManagement
                complaints={getComplaintsByStatus("resolved")}
                onUpdateComplaint={handleUpdateComplaint}
              />
            )}
          </TabsContent>
        </Tabs>
        </>
        )}
      </div>
    </DashboardLayout>
  )
}
