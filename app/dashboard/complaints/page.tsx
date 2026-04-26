"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  MessageSquare, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  AlertTriangle,
  Calendar,
  User,
  Building
} from "lucide-react"
import Link from "next/link"

export default function ComplaintsPage() {
  const { user } = useAuth()
  const [filter, setFilter] = useState<"all" | "pending" | "resolved">("all")
  const [complaints, setComplaints] = useState<any[]>([])

  useEffect(() => {
    if (!user) return;
    
    const loadComplaints = async () => {
      try {
        const response = await fetch("/api/complaints?mine=true", { credentials: "include" })
        const json = await response.json()
        if (!response.ok || !json?.success || !Array.isArray(json?.data?.complaints)) return

        setComplaints(
          json.data.complaints.map((complaint: any) => ({
            id: complaint.id,
            title: complaint.title,
            description: complaint.description,
            category: complaint.category,
            status: complaint.status.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (char: string) => char.toUpperCase()),
            priority: complaint.priority.toLowerCase().replace(/\b\w/g, (char: string) => char.toUpperCase()),
            submittedDate: new Date(complaint.createdAt).toISOString().slice(0, 10),
            lastUpdated: new Date(complaint.updatedAt).toISOString().slice(0, 10),
            assignedTo: complaint.assignedTo || "Unassigned",
            roomNumber: complaint.user?.roomNumber || "N/A",
          })),
        )
      } catch (_) {}
    }

    void loadComplaints()
  }, [user])

  if (!user) {
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return 'bg-green-100 text-green-800'
      case 'in progress':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return CheckCircle
      case 'in progress':
        return Clock
      case 'pending':
        return AlertCircle
      default:
        return AlertTriangle
    }
  }

  const filteredComplaints = complaints.filter(complaint => {
    if (filter === "all") return true
    return complaint.status.toLowerCase() === filter
  })

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === "Pending").length,
    inProgress: complaints.filter(c => c.status === "In Progress").length,
    resolved: complaints.filter(c => c.status === "Resolved").length
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold">My Complaints</h1>
            <p className="text-muted-foreground">Track and manage your hostel complaints</p>
          </div>
          <Button asChild className="flex items-center space-x-2">
            <Link href="/dashboard/complaints/new">
              <Plus className="h-4 w-4" />
              <span>Submit Complaint</span>
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-xl font-bold">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                  <p className="text-xl font-bold">{stats.inProgress}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                  <p className="text-xl font-bold">{stats.resolved}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 border-b">
          <Button
            variant={filter === "all" ? "default" : "ghost"}
            onClick={() => setFilter("all")}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            All ({stats.total})
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "ghost"}
            onClick={() => setFilter("pending")}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            Pending ({stats.pending})
          </Button>
          <Button
            variant={filter === "resolved" ? "default" : "ghost"}
            onClick={() => setFilter("resolved")}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            Resolved ({stats.resolved})
          </Button>
        </div>

        {/* Complaints List */}
        <div className="space-y-4">
          {filteredComplaints.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">No complaints found</h3>
                <p className="text-muted-foreground mb-4">
                  {filter === "all" 
                    ? "You haven't submitted any complaints yet."
                    : `No ${filter} complaints found.`
                  }
                </p>
                  <Button asChild>
                  <Link href="/dashboard/complaints/new">Submit Your First Complaint</Link>
                  </Button>
              </CardContent>
            </Card>
          ) : (
            filteredComplaints.map((complaint) => {
              const StatusIcon = getStatusIcon(complaint.status)
              
              return (
                <Card key={complaint.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between space-y-4 lg:space-y-0">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <StatusIcon className="h-5 w-5 text-muted-foreground" />
                            <h3 className="text-lg font-semibold">{complaint.title}</h3>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(complaint.status)}>
                              {complaint.status}
                            </Badge>
                            <Badge className={getPriorityColor(complaint.priority)}>
                              {complaint.priority}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-muted-foreground">{complaint.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span>{complaint.category}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{complaint.assignedTo}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Submitted: {complaint.submittedDate}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>Updated: {complaint.lastUpdated}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 lg:ml-4">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        {complaint.status === "Pending" && (
                          <Button variant="outline" size="sm">
                            Update Status
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
              <Button
                asChild
                className="h-auto p-4 flex-col space-y-2"
              >
                <Link href="/dashboard/complaints/new">
                  <Plus className="h-6 w-6" />
                  <span className="font-medium">Submit New Complaint</span>
                </Link>
              </Button>
              
              <Button
                asChild
                variant="outline"
                className="h-auto p-4 flex-col space-y-2"
              >
                <Link href="/dashboard/hostel">
                  <Building className="h-6 w-6" />
                  <span className="font-medium">Hostel Information</span>
                </Link>
              </Button>
              
              <Button
                asChild
                variant="outline"
                className="h-auto p-4 flex-col space-y-2"
              >
                <Link href="/dashboard/leave/new">
                  <Calendar className="h-6 w-6" />
                  <span className="font-medium">Request Leave</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
