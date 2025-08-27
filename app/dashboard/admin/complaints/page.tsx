"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ComplaintManagement } from "@/components/admin/complaint-management"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, CheckCircle, Clock } from "lucide-react"

const mockComplaints = [
  {
    id: "1",
    title: "Broken AC in Room A101",
    description: "The air conditioner is not working properly and making loud noises.",
    category: "maintenance" as const,
    status: "pending" as const,
    priority: "high" as const,
    studentName: "Alice Student",
    roomNumber: "A101",
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    title: "Bathroom Cleaning Issue",
    description: "Common bathroom on 1st floor needs thorough cleaning.",
    category: "cleanliness" as const,
    status: "in-progress" as const,
    priority: "medium" as const,
    studentName: "Bob Student",
    roomNumber: "A102",
    createdAt: "2024-01-08",
  },
  {
    id: "3",
    title: "WiFi Connection Problems",
    description: "Internet connectivity is poor in evening hours.",
    category: "other" as const,
    status: "resolved" as const,
    priority: "medium" as const,
    studentName: "Charlie Student",
    roomNumber: "B201",
    createdAt: "2024-01-05",
  },
]

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState(mockComplaints)

  const handleUpdateComplaint = (id: string, status: string, response?: string) => {
    setComplaints((prev) =>
      prev.map((complaint) =>
        complaint.id === id
          ? { ...complaint, status: status as any, updatedAt: new Date().toISOString().split("T")[0] }
          : complaint,
      ),
    )
    console.log("Updated complaint:", { id, status, response })
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
            <ComplaintManagement complaints={getComplaintsByStatus("all")} onUpdateComplaint={handleUpdateComplaint} />
          </TabsContent>

          <TabsContent value="pending">
            <ComplaintManagement
              complaints={getComplaintsByStatus("pending")}
              onUpdateComplaint={handleUpdateComplaint}
            />
          </TabsContent>

          <TabsContent value="in-progress">
            <ComplaintManagement
              complaints={getComplaintsByStatus("in-progress")}
              onUpdateComplaint={handleUpdateComplaint}
            />
          </TabsContent>

          <TabsContent value="resolved">
            <ComplaintManagement
              complaints={getComplaintsByStatus("resolved")}
              onUpdateComplaint={handleUpdateComplaint}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
