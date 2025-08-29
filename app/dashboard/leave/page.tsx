"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  XCircle,
  User,
  MapPin,
  Clock as ClockIcon,
  FileText
} from "lucide-react"
import Link from "next/link"

export default function LeavePage() {
  const { user } = useAuth()
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")

  if (!user) {
    return null
  }

  // Mock leave requests data
const mockLeaveRequests = [
  {
      id: 1,
      type: "Personal Leave",
      reason: "Family function at home. Need to attend important family gathering.",
      fromDate: "2024-01-20",
      toDate: "2024-01-22",
      duration: "3 days",
      status: "Pending",
      submittedDate: "2024-01-15",
      approvedBy: null,
      approvedDate: null,
      roomNumber: "A-101",
      destination: "Jaipur, Rajasthan",
      emergencyContact: "+91-9876543210"
    },
    {
      id: 2,
      type: "Medical Leave",
      reason: "Dental appointment and follow-up treatment required.",
      fromDate: "2024-01-18",
      toDate: "2024-01-18",
      duration: "1 day",
      status: "Approved",
      submittedDate: "2024-01-12",
      approvedBy: "Mr. Rajesh Sharma",
      approvedDate: "2024-01-13",
      roomNumber: "A-101",
      destination: "Local Hospital, Jaipur",
      emergencyContact: "+91-9876543210"
    },
    {
      id: 3,
      type: "Academic Leave",
      reason: "Attending a technical workshop in Delhi for skill development.",
      fromDate: "2024-01-25",
      toDate: "2024-01-27",
      duration: "3 days",
      status: "Rejected",
      submittedDate: "2024-01-10",
      approvedBy: "Mr. Rajesh Sharma",
      approvedDate: "2024-01-11",
      roomNumber: "A-101",
      destination: "Delhi, India",
      emergencyContact: "+91-9876543210",
      rejectionReason: "Workshop dates conflict with important academic schedule"
    },
    {
      id: 4,
      type: "Personal Leave",
      reason: "Attending friend's wedding ceremony.",
      fromDate: "2024-01-30",
      toDate: "2024-02-01",
      duration: "3 days",
      status: "Pending",
      submittedDate: "2024-01-16",
      approvedBy: null,
      approvedDate: null,
      roomNumber: "A-101",
      destination: "Mumbai, Maharashtra",
      emergencyContact: "+91-9876543210"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return CheckCircle
      case 'pending':
        return Clock
      case 'rejected':
        return XCircle
      default:
        return AlertCircle
    }
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'medical leave':
        return 'bg-red-100 text-red-800'
      case 'personal leave':
        return 'bg-blue-100 text-blue-800'
      case 'academic leave':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredRequests = mockLeaveRequests.filter(request => {
    if (filter === "all") return true
    return request.status.toLowerCase() === filter
  })

  const stats = {
    total: mockLeaveRequests.length,
    pending: mockLeaveRequests.filter(r => r.status === "Pending").length,
    approved: mockLeaveRequests.filter(r => r.status === "Approved").length,
    rejected: mockLeaveRequests.filter(r => r.status === "Rejected").length
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold">Leave Requests</h1>
            <p className="text-muted-foreground">Manage and track your hostel leave requests</p>
          </div>
          <Button asChild className="flex items-center space-x-2">
            <Link href="/dashboard/leave/new">
              <Plus className="h-4 w-4" />
              <span>Apply for Leave</span>
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
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
                <Clock className="h-5 w-5 text-yellow-600" />
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
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approved</p>
                  <p className="text-xl font-bold">{stats.approved}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                  <p className="text-xl font-bold">{stats.rejected}</p>
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
            variant={filter === "approved" ? "default" : "ghost"}
            onClick={() => setFilter("approved")}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            Approved ({stats.approved})
          </Button>
          <Button
            variant={filter === "rejected" ? "default" : "ghost"}
            onClick={() => setFilter("rejected")}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            Rejected ({stats.rejected})
          </Button>
        </div>

        {/* Leave Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
          <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">No leave requests found</h3>
                <p className="text-muted-foreground mb-4">
                  {filter === "all" 
                    ? "You haven't submitted any leave requests yet."
                    : `No ${filter} leave requests found.`
                  }
                </p>
              <Button asChild>
                  <Link href="/dashboard/leave/new">Apply for Your First Leave</Link>
              </Button>
            </CardContent>
          </Card>
          ) : (
            filteredRequests.map((request) => {
              const StatusIcon = getStatusIcon(request.status)
              
              return (
                <Card key={request.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between space-y-4 lg:space-y-0">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <StatusIcon className="h-5 w-5 text-muted-foreground" />
                            <h3 className="text-lg font-semibold">{request.type}</h3>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(request.status)}>
                              {request.status}
                            </Badge>
                            <Badge className={getTypeColor(request.type)}>
                              {request.type}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-muted-foreground">{request.reason}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>From: {request.fromDate}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>To: {request.toDate}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <ClockIcon className="h-4 w-4 text-muted-foreground" />
                            <span>Duration: {request.duration}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{request.destination}</span>
                          </div>
                        </div>

                        {request.status === "Rejected" && request.rejectionReason && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-800">
                              <strong>Rejection Reason:</strong> {request.rejectionReason}
                            </p>
                          </div>
                        )}

                        {request.status === "Approved" && request.approvedBy && (
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-800">
                              <strong>Approved by:</strong> {request.approvedBy} on {request.approvedDate}
                            </p>
                          </div>
                        )}

                        <div className="text-xs text-muted-foreground">
                          Submitted on: {request.submittedDate}
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 lg:ml-4">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        {request.status === "Pending" && (
                          <Button variant="outline" size="sm">
                            Cancel Request
                          </Button>
                        )}
                        {request.status === "Approved" && (
                          <Button variant="outline" size="sm">
                            Download Approval
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
            <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
              <Button
                asChild
                className="h-auto p-4 flex-col space-y-2"
              >
                <Link href="/dashboard/leave/new">
                  <Plus className="h-6 w-6" />
                  <span className="font-medium">Apply for Leave</span>
                </Link>
              </Button>
              
              <Button
                asChild
                variant="outline"
                className="h-auto p-4 flex-col space-y-2"
              >
                <Link href="/dashboard/complaints/new">
                  <FileText className="h-6 w-6" />
                  <span className="font-medium">Submit Complaint</span>
                </Link>
              </Button>
              
              <Button
                asChild
                variant="outline"
                className="h-auto p-4 flex-col space-y-2"
              >
                <Link href="/dashboard/hostel">
                  <MapPin className="h-6 w-6" />
                  <span className="font-medium">Hostel Info</span>
                </Link>
              </Button>
              
              <Button
                asChild
                variant="outline"
                className="h-auto p-4 flex-col space-y-2"
              >
                <Link href="/dashboard/profile">
                  <User className="h-6 w-6" />
                  <span className="font-medium">Update Profile</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
