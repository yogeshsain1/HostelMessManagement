"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
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

type ComplaintRecord = {
  id: string
  category: string
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED"
  createdAt: string
}

type LeaveRecord = {
  id: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  createdAt: string
}

type AttendanceRecord = {
  mealType: "breakfast" | "lunch" | "snacks" | "dinner"
  date: string
}

type FeedbackRecord = {
  rating: number
  createdAt: string
}

const monthLabel = (date: Date) =>
  date.toLocaleString("en-US", {
    month: "short",
  })

const toPercent = (value: number, base: number) => (base > 0 ? Number(((value / base) * 100).toFixed(1)) : 0)

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
  const [complaints, setComplaints] = useState<ComplaintRecord[]>([])
  const [leaveRequestsData, setLeaveRequestsData] = useState<LeaveRecord[]>([])
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [feedback, setFeedback] = useState<FeedbackRecord[]>([])
  const [totalUsers, setTotalUsers] = useState(0)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return

    const loadAnalytics = async () => {
      try {
        const [complaintsRes, leaveRes, attendanceRes, feedbackRes, usersRes] = await Promise.all([
          fetch("/api/complaints", { credentials: "include" }),
          fetch("/api/leave-requests", { credentials: "include" }),
          fetch("/api/mess/attendance", { credentials: "include" }),
          fetch("/api/mess/feedback", { credentials: "include" }),
          fetch("/api/users", { credentials: "include" }),
        ])

        const [complaintsJson, leaveJson, attendanceJson, feedbackJson, usersJson] = await Promise.all([
          complaintsRes.json().catch(() => ({})),
          leaveRes.json().catch(() => ({})),
          attendanceRes.json().catch(() => ({})),
          feedbackRes.json().catch(() => ({})),
          usersRes.json().catch(() => ({})),
        ])

        setComplaints(Array.isArray(complaintsJson?.data?.complaints) ? complaintsJson.data.complaints : [])
        setLeaveRequestsData(Array.isArray(leaveJson?.data?.leaveRequests) ? leaveJson.data.leaveRequests : [])
        setAttendance(Array.isArray(attendanceJson?.data?.attendance) ? attendanceJson.data.attendance : [])
        setFeedback(Array.isArray(feedbackJson?.data?.feedback) ? feedbackJson.data.feedback : [])
        setTotalUsers(Array.isArray(usersJson?.data?.users) ? usersJson.data.users.length : 0)
      } catch (_) {
        setComplaints([])
        setLeaveRequestsData([])
        setAttendance([])
        setFeedback([])
        setTotalUsers(0)
      }
    }

    void loadAnalytics()
  }, [user])

  const analytics = useMemo(() => {
    const months = Array.from({ length: 6 }).map((_, idx) => {
      const d = new Date()
      d.setMonth(d.getMonth() - (5 - idx))
      return monthLabel(d)
    })

    const complaintTrends = months.map((month) => {
      const monthComplaints = complaints.filter((item) => monthLabel(new Date(item.createdAt)) === month)
      return {
        month,
        complaints: monthComplaints.length,
        resolved: monthComplaints.filter((item) => item.status === "RESOLVED").length,
      }
    })

    const leaveRequests = months.map((month) => {
      const monthLeaves = leaveRequestsData.filter((item) => monthLabel(new Date(item.createdAt)) === month)
      return {
        month,
        requests: monthLeaves.length,
        approved: monthLeaves.filter((item) => item.status === "APPROVED").length,
      }
    })

    const categoryCounts = complaints.reduce<Record<string, number>>((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1
      return acc
    }, {})

    const palette = ["#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6", "#ef4444"]
    const complaintCategories = Object.entries(categoryCounts).map(([name, value], index) => ({
      name,
      value,
      color: palette[index % palette.length],
    }))

    const today = new Date()
    const lastWeek = Array.from({ length: 7 }).map((_, idx) => {
      const d = new Date(today)
      d.setDate(today.getDate() - (6 - idx))
      const date = d.toISOString().slice(0, 10)
      const day = d.toLocaleString("en-US", { weekday: "short" })
      const entries = attendance.filter((item) => item.date === date)
      return {
        day,
        breakfast: entries.filter((item) => item.mealType === "breakfast").length,
        lunch: entries.filter((item) => item.mealType === "lunch").length,
        snacks: entries.filter((item) => item.mealType === "snacks").length,
        dinner: entries.filter((item) => item.mealType === "dinner").length,
      }
    })

    const studentSatisfaction = months.map((month) => {
      const monthFeedback = feedback.filter((item) => monthLabel(new Date(item.createdAt)) === month)
      const avg = monthFeedback.length
        ? monthFeedback.reduce((sum, item) => sum + Number(item.rating || 0), 0) / monthFeedback.length
        : 0
      return { month, satisfaction: Number((avg * 20).toFixed(1)) }
    })

    const totalComplaints = complaints.length
    const resolvedComplaints = complaints.filter((item) => item.status === "RESOLVED").length
    const totalLeaves = leaveRequestsData.length
    const approvedLeaves = leaveRequestsData.filter((item) => item.status === "APPROVED").length
    const averageSatisfaction = feedback.length
      ? (feedback.reduce((sum, item) => sum + Number(item.rating || 0), 0) / feedback.length) * 20
      : 0
    const averageAttendancePct =
      totalUsers > 0 && lastWeek.length > 0
        ? Number(
            (
              (lastWeek.reduce((sum, item) => sum + item.breakfast + item.lunch + item.snacks + item.dinner, 0) /
                (lastWeek.length * 4 * totalUsers)) *
              100
            ).toFixed(1),
          )
        : 0

    return {
      complaintTrends,
      leaveRequests,
      complaintCategories,
      messAttendance: lastWeek,
      studentSatisfaction,
      metrics: {
        resolutionRate: toPercent(resolvedComplaints, totalComplaints),
        avgMessAttendance: averageAttendancePct,
        studentSatisfaction: Number(averageSatisfaction.toFixed(1)),
        leaveApprovalRate: toPercent(approvedLeaves, totalLeaves),
      },
    }
  }, [attendance, complaints, feedback, leaveRequestsData, totalUsers])

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
                  <p className="text-2xl font-bold">{analytics.metrics.resolutionRate}%</p>
                  <div className="flex items-center text-sm text-green-600 mt-1">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Live data
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
                  <p className="text-2xl font-bold">{analytics.metrics.avgMessAttendance}%</p>
                  <div className="flex items-center text-sm text-green-600 mt-1">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Last 7 days
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
                  <p className="text-2xl font-bold">{analytics.metrics.studentSatisfaction}%</p>
                  <div className="flex items-center text-sm text-green-600 mt-1">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    From feedback ratings
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
                  <p className="text-2xl font-bold">{analytics.metrics.leaveApprovalRate}%</p>
                  <div className="flex items-center text-sm text-red-600 mt-1">
                    <TrendingDown className="h-4 w-4 mr-1" />
                    Live data
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
                    <LineChart data={analytics.complaintTrends}>
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
                        data={analytics.complaintCategories}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                      >
                        {analytics.complaintCategories.map((entry, index) => (
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
                  <BarChart data={analytics.messAttendance}>
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
                  <AreaChart data={analytics.studentSatisfaction}>
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
                  <BarChart data={analytics.leaveRequests}>
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
