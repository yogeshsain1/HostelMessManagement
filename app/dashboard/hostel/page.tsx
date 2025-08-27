"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Calendar, Home, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"

const mockStats = {
  activeComplaints: 2,
  resolvedComplaints: 8,
  pendingLeaveRequests: 1,
  approvedLeaveRequests: 3,
}

const mockAnnouncements = [
  {
    id: "1",
    title: "Monthly Hostel Meeting",
    message: "Monthly hostel meeting scheduled for December 25th at 6 PM in the common room.",
    date: "2024-01-10",
    priority: "medium",
  },
  {
    id: "2",
    title: "Water Supply Maintenance",
    message: "Water supply will be interrupted tomorrow from 10 AM to 2 PM for maintenance work.",
    date: "2024-01-12",
    priority: "high",
  },
  {
    id: "3",
    title: "New WiFi Password",
    message: "WiFi password has been updated. Please contact the warden for the new password.",
    date: "2024-01-08",
    priority: "low",
  },
]

export default function HostelPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Hostel Management</h1>
            <p className="text-muted-foreground mt-1">Manage complaints, leave requests, and hostel services.</p>
          </div>
          <div className="flex space-x-2">
            <Button asChild>
              <Link href="/dashboard/complaints/new">File Complaint</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/leave/new">Request Leave</Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Active Complaints</p>
                  <p className="text-2xl font-bold">{mockStats.activeComplaints}</p>
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
                  <p className="text-2xl font-bold">{mockStats.resolvedComplaints}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Pending Leave</p>
                  <p className="text-2xl font-bold">{mockStats.pendingLeaveRequests}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Approved Leave</p>
                  <p className="text-2xl font-bold">{mockStats.approvedLeaveRequests}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button asChild className="h-auto p-4 flex-col space-y-2">
                <Link href="/dashboard/complaints/new">
                  <MessageSquare className="h-6 w-6" />
                  <span>File Complaint</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex-col space-y-2 bg-transparent">
                <Link href="/dashboard/leave/new">
                  <Calendar className="h-6 w-6" />
                  <span>Request Leave</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex-col space-y-2 bg-transparent">
                <Link href="/dashboard/complaints">
                  <AlertTriangle className="h-6 w-6" />
                  <span>View Complaints</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex-col space-y-2 bg-transparent">
                <Link href="/dashboard/leave">
                  <Home className="h-6 w-6" />
                  <span>Leave History</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card>
          <CardHeader>
            <CardTitle>Hostel Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAnnouncements.map((announcement) => (
                <div key={announcement.id} className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{announcement.title}</h4>
                    <Badge
                      variant="outline"
                      className={
                        announcement.priority === "high"
                          ? "border-red-200 text-red-800"
                          : announcement.priority === "medium"
                            ? "border-orange-200 text-orange-800"
                            : "border-gray-200 text-gray-800"
                      }
                    >
                      {announcement.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{announcement.message}</p>
                  <p className="text-xs text-muted-foreground">{announcement.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
