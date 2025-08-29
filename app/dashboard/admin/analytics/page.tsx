"use client"

import { Suspense, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { analyticsData } from "@/lib/mock-data"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts"
import { TrendingUp, TrendingDown, Users, MessageSquare, UtensilsCrossed, Calendar, BarChart3 } from "lucide-react"

// Centralized mock data for demo
const complaintTrends = analyticsData.complaintTrends
const messAttendance = analyticsData.messAttendance
const complaintCategories = analyticsData.complaintCategories
const studentSatisfaction = analyticsData.satisfaction
const leaveRequests = analyticsData.leaveRequests

const chartConfig = {
  complaints: { label: "Complaints", color: "#ef4444" },
  resolved: { label: "Resolved", color: "#22c55e" },
  breakfast: { label: "Breakfast", color: "#f59e0b" },
  lunch: { label: "Lunch", color: "#3b82f6" },
  snacks: { label: "Snacks", color: "#8b5cf6" },
  dinner: { label: "Dinner", color: "#06b6d4" },
  satisfaction: { label: "Satisfaction", color: "#10b981" },
  requests: { label: "Requests", color: "#6366f1" },
  approved: { label: "Approved", color: "#22c55e" },
}

export default function AdminAnalyticsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6"><div className="text-sm text-muted-foreground">Loading analytics…</div></div>
      </DashboardLayout>
    )
  }

  if (!user) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive insights and trends for Poornima University hostels.
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="transition-all duration-200 hover:scale-[1.02]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resolution Rate</p>
                  <p className="text-2xl font-bold">94.2%</p>
                  <div className="flex items-center text-sm text-green-600 mt-1">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +2.1% from last month
                  </div>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all duration-200 hover:scale-[1.02]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Mess Attendance</p>
                  <p className="text-2xl font-bold">86.5%</p>
                  <div className="flex items-center text-sm text-green-600 mt-1">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +1.8% from last week
                  </div>
                </div>
                <UtensilsCrossed className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all duration-200 hover:scale-[1.02]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Student Satisfaction</p>
                  <p className="text-2xl font-bold">91%</p>
                  <div className="flex items-center text-sm text-green-600 mt-1">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +3.2% from last month
                  </div>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all duration-200 hover:scale-[1.02]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Leave Approval Rate</p>
                  <p className="text-2xl font-bold">92.8%</p>
                  <div className="flex items-center text-sm text-red-600 mt-1">
                    <TrendingDown className="h-4 w-4 mr-1" />
                    -0.5% from last month
                  </div>
                </div>
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="complaints" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="complaints" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Complaints
            </TabsTrigger>
            <TabsTrigger value="mess" className="flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4" />
              Mess Analytics
            </TabsTrigger>
            <TabsTrigger value="satisfaction" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Satisfaction
            </TabsTrigger>
            <TabsTrigger value="leave" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Leave Requests
            </TabsTrigger>
          </TabsList>

          <TabsContent value="complaints" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Complaint Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <LineChart data={complaintTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="complaints"
                        stroke="var(--color-complaints)"
                        strokeWidth={2}
                        dot={{ fill: "var(--color-complaints)" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="resolved"
                        stroke="var(--color-resolved)"
                        strokeWidth={2}
                        dot={{ fill: "var(--color-resolved)" }}
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Complaint Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <PieChart>
                      <Pie
                        data={complaintCategories}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                      >
                        {complaintCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="mess" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Mess Attendance by Meal</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[400px]">
                  <BarChart data={messAttendance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="breakfast" fill="var(--color-breakfast)" />
                    <Bar dataKey="lunch" fill="var(--color-lunch)" />
                    <Bar dataKey="snacks" fill="var(--color-snacks)" />
                    <Bar dataKey="dinner" fill="var(--color-dinner)" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="satisfaction" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Satisfaction Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[400px]">
                  <AreaChart data={studentSatisfaction}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="satisfaction"
                      stroke="var(--color-satisfaction)"
                      fill="var(--color-satisfaction)"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leave" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Leave Request Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[400px]">
                  <BarChart data={leaveRequests}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="requests" fill="var(--color-requests)" />
                    <Bar dataKey="approved" fill="var(--color-approved)" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
