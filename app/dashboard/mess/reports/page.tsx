"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, TrendingDown, Users, UtensilsCrossed, Star, Calendar } from "lucide-react"

const attendanceData = [
  { month: "Jan", attendance: 92, target: 95 },
  { month: "Feb", attendance: 88, target: 95 },
  { month: "Mar", attendance: 94, target: 95 },
  { month: "Apr", attendance: 91, target: 95 },
  { month: "May", attendance: 96, target: 95 },
  { month: "Jun", attendance: 93, target: 95 },
]

const feedbackData = [
  { date: "2024-01-01", rating: 4.2, responses: 45 },
  { date: "2024-01-02", rating: 4.5, responses: 52 },
  { date: "2024-01-03", rating: 4.1, responses: 38 },
  { date: "2024-01-04", rating: 4.3, responses: 41 },
  { date: "2024-01-05", rating: 4.6, responses: 48 },
  { date: "2024-01-06", rating: 4.4, responses: 55 },
  { date: "2024-01-07", rating: 4.7, responses: 42 },
]

const mealPreferenceData = [
  { name: "Breakfast", value: 35, color: "#8884d8" },
  { name: "Lunch", value: 45, color: "#82ca9d" },
  { name: "Snacks", value: 15, color: "#ffc658" },
  { name: "Dinner", value: 40, color: "#ff7c7c" },
]

const topDishesData = [
  { dish: "Dal Baati Churma", rating: 4.8, orders: 245 },
  { dish: "Chicken Biryani", rating: 4.6, orders: 189 },
  { dish: "Aloo Paratha", rating: 4.5, orders: 312 },
  { dish: "Laal Maas", rating: 4.7, orders: 156 },
  { dish: "Gatte Ki Sabzi", rating: 4.4, orders: 278 },
]

export default function MessReportsPage() {
  const currentMonth = attendanceData[attendanceData.length - 1]
  const previousMonth = attendanceData[attendanceData.length - 2]
  const attendanceChange = currentMonth.attendance - previousMonth.attendance

  const avgRating = feedbackData.reduce((sum, item) => sum + item.rating, 0) / feedbackData.length
  const totalResponses = feedbackData.reduce((sum, item) => sum + item.responses, 0)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mess Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive insights into mess performance, attendance, and feedback.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Avg Attendance</p>
                  <p className="text-2xl font-bold">{currentMonth.attendance}%</p>
                  <div className="flex items-center space-x-1">
                    {attendanceChange >= 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    )}
                    <span className={`text-xs ${attendanceChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {attendanceChange >= 0 ? "+" : ""}{attendanceChange}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Avg Rating</p>
                  <p className="text-2xl font-bold">{avgRating.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">{totalResponses} responses</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Total Meals</p>
                  <p className="text-2xl font-bold">1,247</p>
                  <p className="text-xs text-muted-foreground">This month</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Active Days</p>
                  <p className="text-2xl font-bold">28</p>
                  <p className="text-xs text-muted-foreground">This month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="attendance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="dishes">Top Dishes</TabsTrigger>
          </TabsList>

          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Attendance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="attendance" fill="#8884d8" name="Attendance %" />
                    <Bar dataKey="target" fill="#82ca9d" name="Target %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Daily Feedback Ratings</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={feedbackData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="rating" stroke="#8884d8" name="Rating" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Meal Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mealPreferenceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: { name: string; percent?: number }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mealPreferenceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dishes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Rated Dishes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topDishesData.map((dish, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <div>
                          <h3 className="font-medium">{dish.dish}</h3>
                          <p className="text-sm text-muted-foreground">{dish.orders} orders this month</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-medium">{dish.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
