"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { MenuCard } from "@/components/mess/menu-card"
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
  Activity,
  Edit,
  Plus,
  Download,
  Upload
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

const mockMenuData = {
  today: {
    date: "2024-01-15",
    breakfast: {
      items: [
        { name: "Aloo Paratha (2 pcs)", isVeg: true },
        { name: "Curd", isVeg: true },
        { name: "Pickle", isVeg: true },
        { name: "Tea/Coffee", isVeg: true },
      ],
      time: "7:00 AM - 9:00 AM",
      rating: 4.3,
      served: 342,
      target: 450
    },
    lunch: {
      items: [
        { name: "Dal Baati Churma", isVeg: true },
        { name: "Gatte Ki Sabzi", isVeg: true },
        { name: "Steamed Rice", isVeg: true },
        { name: "Buttermilk", isVeg: true },
        { name: "Papad", isVeg: true },
      ],
      time: "12:00 PM - 2:00 PM",
      rating: 4.5,
      served: 387,
      target: 450
    },
    snacks: {
      items: [
        { name: "Kachori (2 pcs)", isVeg: true },
        { name: "Green Chutney", isVeg: true },
        { name: "Samosa (1 pc)", isVeg: true },
        { name: "Tea/Coffee", isVeg: true },
      ],
      time: "4:00 PM - 6:00 PM",
      rating: 4.1,
      served: 156,
      target: 450
    },
    dinner: {
      items: [
        { name: "Roti (4 pcs)", isVeg: true },
        { name: "Rajasthani Kadhi", isVeg: true },
        { name: "Jeera Rice", isVeg: true },
        { name: "Mixed Dal", isVeg: true },
        { name: "Salad", isVeg: true },
      ],
      time: "7:30 PM - 9:30 PM",
      rating: 4.4,
      served: 0,
      target: 450
    },
  },
  tomorrow: {
    date: "2024-01-16",
    breakfast: {
      items: [
        { name: "Poha with Sev", isVeg: true },
        { name: "Boiled Eggs (2 pcs)", isVeg: false },
        { name: "Green Chutney", isVeg: true },
        { name: "Tea/Coffee", isVeg: true },
      ],
      time: "7:00 AM - 9:00 AM",
      rating: 4.0,
      served: 0,
      target: 450
    },
    lunch: {
      items: [
        { name: "Chicken Biryani", isVeg: false },
        { name: "Raita", isVeg: true },
        { name: "Boiled Egg", isVeg: false },
        { name: "Pickle", isVeg: true },
        { name: "Papad", isVeg: true },
      ],
      time: "12:00 PM - 2:00 PM",
      rating: 4.6,
      served: 0,
      target: 450
    },
    snacks: {
      items: [
        { name: "Bread Pakora (2 pcs)", isVeg: true },
        { name: "Mint Chutney", isVeg: true },
        { name: "Tea/Coffee", isVeg: true },
      ],
      time: "4:00 PM - 6:00 PM",
      rating: 4.2,
      served: 0,
      target: 450
    },
    dinner: {
      items: [
        { name: "Chapati (4 pcs)", isVeg: true },
        { name: "Laal Maas", isVeg: false },
        { name: "Rice", isVeg: true },
        { name: "Dal Tadka", isVeg: true },
        { name: "Onion Salad", isVeg: true },
      ],
      time: "7:30 PM - 9:30 PM",
      rating: 4.7,
      served: 0,
      target: 450
    },
  },
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
    href: "/dashboard/admin/mess/reports",
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
    title: "Bulk Import",
    description: "Import menu data from Excel/CSV",
    href: "/dashboard/admin/mess/import",
    icon: Upload,
    color: "bg-purple-500"
  }
]

export default function AdminMessPage() {
  const [selectedDay, setSelectedDay] = useState<"today" | "tomorrow">("today")
  const [userCount, setUserCount] = useState<number | null>(null);
  const [complaintCount, setComplaintCount] = useState<number | null>(null);
  const currentMenu = mockMenuData[selectedDay]

  const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('auth-token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  useEffect(() => {
    fetch("/api/users/count", { headers: getAuthHeaders() })
      .then(res => res.json())
      .then(data => setUserCount(data.count));
    
    fetch("/api/complaints/count", { headers: getAuthHeaders() })
      .then(res => res.json())
      .then(data => setComplaintCount(data.count));
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mess Management Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive overview of mess operations and student attendance.
            </p>
          </div>
          <div className="flex space-x-2">
            <Button asChild variant="outline">
              <Link href="/dashboard/admin/mess/reports">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/mess/menu/manage">
                <Edit className="h-4 w-4 mr-2" />
                Edit Menu
              </Link>
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Total Users</p>
                  <p className="text-2xl font-bold">{userCount !== null ? userCount : "..."}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Total Complaints</p>
                  <p className="text-2xl font-bold">{complaintCount !== null ? complaintCount : "..."}</p>
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
        </div>

        {/* Menu Management Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <UtensilsCrossed className="h-5 w-5" />
                <span>Menu Overview</span>
              </CardTitle>
              <div className="flex space-x-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard/admin/mess/qr">
                    <QrCode className="h-4 w-4 mr-2" />
                    Generate QR
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/dashboard/mess/menu/manage">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Menu
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Menu Tabs */}
            <Tabs value={selectedDay} onValueChange={(value: string) => setSelectedDay(value as "today" | "tomorrow")} className="space-y-4">
              <TabsList>
                <TabsTrigger value="today">Today's Menu</TabsTrigger>
                <TabsTrigger value="tomorrow">Tomorrow's Menu</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedDay} className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-semibold">Menu for {currentMenu.date}</h2>
                    <Badge variant="outline">{selectedDay === "today" ? "Today" : "Tomorrow"}</Badge>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">4 Meals Daily</Badge>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <MenuCard
                    mealType="breakfast"
                    items={currentMenu.breakfast.items}
                    time={currentMenu.breakfast.time}
                    rating={currentMenu.breakfast.rating}
                  />
                  <MenuCard
                    mealType="lunch"
                    items={currentMenu.lunch.items}
                    time={currentMenu.lunch.time}
                    rating={currentMenu.lunch.rating}
                  />
                  <MenuCard
                    mealType="snacks"
                    items={currentMenu.snacks.items}
                    time={currentMenu.snacks.time}
                    rating={currentMenu.snacks.rating}
                  />
                  <MenuCard
                    mealType="dinner"
                    items={currentMenu.dinner.items}
                    time={currentMenu.dinner.time}
                    rating={currentMenu.dinner.rating}
                  />
                </div>

                {/* Attendance Summary */}
                <div className="grid gap-4 md:grid-cols-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Breakfast</p>
                    <p className="text-lg font-bold">{currentMenu.breakfast.served}/{currentMenu.breakfast.target}</p>
                    <Badge variant={currentMenu.breakfast.served > 0 ? "default" : "secondary"}>
                      {currentMenu.breakfast.served > 0 ? "Completed" : "Pending"}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Lunch</p>
                    <p className="text-lg font-bold">{currentMenu.lunch.served}/{currentMenu.lunch.target}</p>
                    <Badge variant={currentMenu.lunch.served > 0 ? "default" : "secondary"}>
                      {currentMenu.lunch.served > 0 ? "Completed" : "Pending"}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Snacks</p>
                    <p className="text-lg font-bold">{currentMenu.snacks.served}/{currentMenu.snacks.target}</p>
                    <Badge variant={currentMenu.snacks.served > 0 ? "default" : "secondary"}>
                      {currentMenu.snacks.served > 0 ? "Completed" : "Pending"}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Dinner</p>
                    <p className="text-lg font-bold">{currentMenu.dinner.served}/{currentMenu.dinner.target}</p>
                    <Badge variant={currentMenu.dinner.served > 0 ? "default" : "secondary"}>
                      {currentMenu.dinner.served > 0 ? "Completed" : "In Progress"}
                    </Badge>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

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
