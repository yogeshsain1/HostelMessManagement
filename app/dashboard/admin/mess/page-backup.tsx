"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  UtensilsCrossed,
  Users,
  TrendingUp,
  QrCode,
  Calendar,
  BarChart3,
  Settings,
  Clock,
  Star,
  AlertTriangle,
  CheckCircle,
  Activity
} from "lucide-react"
import Link from "next/link"

const mockStats = {
  totalStudents: 450,
  todaysAttendance: 387,
  attendanceRate: 86,
  avgRating: 4.2,
  activeComplaints: 12,
  todaysMeals: 1350,
  weeklyTrend: 8.5,
  monthlyRevenue: 125000
}

const recentActivity = [
  {
    id: 1,
    type: "attendance",
    message: "John Doe marked attendance for lunch",
    time: "2 minutes ago",
    status: "success"
  },
  {
    id: 2,
    type: "complaint",
    message: "New complaint: Food quality issue in dinner",
    time: "15 minutes ago",
    status: "warning"
  },
  {
    id: 3,
    type: "feedback",
    message: "Sarah received 5-star rating for breakfast",
    time: "1 hour ago",
    status: "success"
  },
  {
    id: 4,
    type: "menu",
    message: "Menu updated for tomorrow's lunch",
    time: "2 hours ago",
    status: "info"
  }
]

const quickActions = [
  {
    title: "Generate QR Code",
    description: "Create QR codes for meal attendance",
    href: "/dashboard/admin/mess/qr",
    icon: QrCode,
    color: "bg-blue-500"
  },
  {
    title: "View Reports",
    description: "Analytics and attendance reports",
    href: "/dashboard/admin/reports",
    icon: BarChart3,
    color: "bg-green-500"
  },
  {
    title: "Manage Menu",
    description: "Update daily menu items",
    href: "/dashboard/mess/menu/manage",
    icon: UtensilsCrossed,
    color: "bg-orange-500"
  },
  {
    title: "Mess Settings",
    description: "Configure mess preferences",
    href: "/dashboard/admin/settings",
    icon: Settings,
    color: "bg-purple-500"
  }
]

export default function AdminMessPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mess Management Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive overview of mess operations and student attendance.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Today's Attendance</p>
                  <p className="text-2xl font-bold">{mockStats.todaysAttendance}/{mockStats.totalStudents}</p>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600">+{mockStats.weeklyTrend}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Attendance Rate</p>
                  <p className="text-2xl font-bold">{mockStats.attendanceRate}%</p>
                  <p className="text-xs text-muted-foreground">This month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Average Rating</p>
                  <p className="text-2xl font-bold">{mockStats.avgRating}/5</p>
                  <p className="text-xs text-muted-foreground">Based on 1,247 reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Active Complaints</p>
                  <p className="text-2xl font-bold">{mockStats.activeComplaints}</p>
                  <p className="text-xs text-muted-foreground">Require attention</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon
                    return (
                      <Button
                        key={index}
                        asChild
                        className="h-auto p-4 justify-start bg-transparent border-2 hover:bg-accent/50"
                      >
                        <Link href={action.href}>
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <div className="text-left">
                              <div className="font-medium">{action.title}</div>
                              <div className="text-sm text-muted-foreground">{action.description}</div>
                            </div>
                          </div>
                        </Link>
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Today's Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Today's Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Breakfast (7:00-9:00)</span>
                  <Badge variant="secondary">342 served</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Lunch (12:00-2:00)</span>
                  <Badge variant="secondary">387 served</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Snacks (4:00-6:00)</span>
                  <Badge variant="secondary">156 served</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Dinner (7:00-9:00)</span>
                  <Badge variant="outline">In progress</Badge>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span>Total Meals Today</span>
                  <span className="font-medium">{mockStats.todaysMeals}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  {activity.status === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {activity.status === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">QR System</p>
                  <p className="text-xs text-muted-foreground">Operational</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Feedback System</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Menu Updates</p>
                  <p className="text-xs text-muted-foreground">Auto-sync enabled</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
