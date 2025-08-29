"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  MessageSquare,
  UtensilsCrossed,
  Download,
  Filter,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react"
import { toast } from "sonner"

// Mock data for warden reports
const mockReportData = {
  complaints: {
    total: 25,
    byCategory: [
      { category: "Maintenance", count: 12, percentage: 48 },
      { category: "Cleanliness", count: 6, percentage: 24 },
      { category: "Security", count: 4, percentage: 16 },
      { category: "Food", count: 3, percentage: 12 }
    ],
    byStatus: [
      { status: "Pending", count: 8, percentage: 32 },
      { status: "In Progress", count: 10, percentage: 40 },
      { status: "Resolved", count: 7, percentage: 28 }
    ],
    monthlyTrend: [
      { month: "Oct", count: 18 },
      { month: "Nov", count: 22 },
      { month: "Dec", count: 19 },
      { month: "Jan", count: 25 }
    ]
  },
  leaveRequests: {
    total: 18,
    byType: [
      { type: "Personal", count: 8, percentage: 44 },
      { type: "Medical", count: 6, percentage: 33 },
      { type: "Academic", count: 4, percentage: 23 }
    ],
    byStatus: [
      { status: "Pending", count: 5, percentage: 28 },
      { status: "Approved", count: 10, percentage: 56 },
      { status: "Rejected", count: 3, percentage: 16 }
    ],
    monthlyTrend: [
      { month: "Oct", count: 15 },
      { month: "Nov", count: 12 },
      { month: "Dec", count: 20 },
      { month: "Jan", count: 18 }
    ]
  },
  mess: {
    totalResidents: 60,
    averageAttendance: 78,
    averageFeedback: 4.1,
    attendanceByMeal: [
      { meal: "Breakfast", attendance: 72, percentage: 72 },
      { meal: "Lunch", attendance: 85, percentage: 85 },
      { meal: "Dinner", attendance: 76, percentage: 76 }
    ],
    feedbackByMeal: [
      { meal: "Breakfast", rating: 3.9, percentage: 78 },
      { meal: "Lunch", rating: 4.2, percentage: 84 },
      { meal: "Dinner", rating: 4.1, percentage: 82 }
    ],
    monthlyAttendance: [
      { month: "Oct", attendance: 75 },
      { month: "Nov", attendance: 78 },
      { month: "Dec", attendance: 72 },
      { month: "Jan", attendance: 78 }
    ]
  },
  residents: {
    total: 60,
    byBlock: [
      { block: "Block A", count: 22, percentage: 37 },
      { block: "Block B", count: 20, percentage: 33 },
      { block: "Block C", count: 18, percentage: 30 }
    ],
    byYear: [
      { year: "1st Year", count: 15, percentage: 25 },
      { year: "2nd Year", count: 18, percentage: 30 },
      { year: "3rd Year", count: 16, percentage: 27 },
      { year: "4th Year", count: 11, percentage: 18 }
    ],
    occupancyRate: 95,
    newAdmissions: 8,
    departures: 3
  }
}

const timeRanges = [
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "quarter", label: "This Quarter" },
  { value: "year", label: "This Year" }
]

const reportTypes = [
  { value: "overview", label: "Overview", icon: BarChart3 },
  { value: "complaints", label: "Complaints", icon: MessageSquare },
  { value: "leave", label: "Leave Requests", icon: Calendar },
  { value: "mess", label: "Mess Operations", icon: UtensilsCrossed },
  { value: "residents", label: "Residents", icon: Users }
]

export default function WardenReportsPage() {
  const { user } = useAuth()
  const [selectedTimeRange, setSelectedTimeRange] = useState("month")
  const [selectedReportType, setSelectedReportType] = useState("overview")

  if (!user || user.role !== "warden") {
    return null
  }

  const handleExportReport = (type: string) => {
    toast.success(`${type} report exported successfully!`)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in progress":
        return "bg-blue-100 text-blue-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
            <p className="text-muted-foreground">
              Comprehensive insights and analytics for your hostel operations
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>
        </div>

        {/* Report Type Navigation */}
        <Card>
          <CardContent className="p-4">
            <Tabs value={selectedReportType} onValueChange={setSelectedReportType} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                {reportTypes.map((type) => (
                  <TabsTrigger key={type.value} value={type.value} className="flex items-center space-x-2">
                    <type.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{type.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Overview Report */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockReportData.complaints.total}</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Leave Requests</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockReportData.leaveRequests.total}</div>
                <p className="text-xs text-muted-foreground">
                  -10% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mess Attendance</CardTitle>
                <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockReportData.mess.averageAttendance}%</div>
                <p className="text-xs text-muted-foreground">
                  +3% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Residents</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockReportData.residents.total}</div>
                <p className="text-xs text-muted-foreground">
                  {mockReportData.residents.occupancyRate}% occupancy
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Analytics */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Complaints by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockReportData.complaints.byCategory.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{item.category}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-8">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Leave Requests by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockReportData.leaveRequests.byType.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{item.type}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-8">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">New complaint submitted</p>
                      <p className="text-sm text-muted-foreground">WiFi connectivity issue in Block A</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">High Priority</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Leave request approved</p>
                      <p className="text-sm text-muted-foreground">Medical leave for Priya Sharma</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Approved</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <UtensilsCrossed className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium">Mess attendance update</p>
                      <p className="text-sm text-muted-foreground">Today's lunch attendance: 85%</p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Complaints Report */}
        <TabsContent value="complaints" className="space-y-6">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-lg">Complaints Analysis</CardTitle>
              <Button onClick={() => handleExportReport("Complaints")}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-3">By Status</h4>
                  <div className="space-y-2">
                    {mockReportData.complaints.byStatus.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                        <span className="text-sm font-medium">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">By Category</h4>
                  <div className="space-y-2">
                    {mockReportData.complaints.byCategory.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{item.category}</span>
                        <span className="text-sm font-medium">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leave Requests Report */}
        <TabsContent value="leave" className="space-y-6">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-lg">Leave Requests Analysis</CardTitle>
              <Button onClick={() => handleExportReport("Leave Requests")}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-3">By Status</h4>
                  <div className="space-y-2">
                    {mockReportData.leaveRequests.byStatus.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                        <span className="text-sm font-medium">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">By Type</h4>
                  <div className="space-y-2">
                    {mockReportData.leaveRequests.byType.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{item.type}</span>
                        <span className="text-sm font-medium">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mess Operations Report */}
        <TabsContent value="mess" className="space-y-6">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-lg">Mess Operations Analysis</CardTitle>
              <Button onClick={() => handleExportReport("Mess Operations")}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-3">Attendance by Meal</h4>
                  <div className="space-y-2">
                    {mockReportData.mess.attendanceByMeal.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{item.meal}</span>
                        <span className="text-sm font-medium">{item.attendance}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Feedback by Meal</h4>
                  <div className="space-y-2">
                    {mockReportData.mess.feedbackByMeal.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{item.meal}</span>
                        <span className="text-sm font-medium">{item.rating}/5</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Residents Report */}
        <TabsContent value="residents" className="space-y-6">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-lg">Residents Analysis</CardTitle>
              <Button onClick={() => handleExportReport("Residents")}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-3">By Block</h4>
                  <div className="space-y-2">
                    {mockReportData.residents.byBlock.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{item.block}</span>
                        <span className="text-sm font-medium">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">By Year</h4>
                  <div className="space-y-2">
                    {mockReportData.residents.byYear.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{item.year}</span>
                        <span className="text-sm font-medium">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{mockReportData.residents.occupancyRate}%</div>
                  <div className="text-sm text-muted-foreground">Occupancy Rate</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{mockReportData.residents.newAdmissions}</div>
                  <div className="text-sm text-muted-foreground">New Admissions</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{mockReportData.residents.departures}</div>
                  <div className="text-sm text-muted-foreground">Departures</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </div>
    </DashboardLayout>
  )
}
