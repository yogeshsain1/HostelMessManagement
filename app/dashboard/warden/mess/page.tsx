"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  UtensilsCrossed, 
  Users, 
  Calendar, 
  Clock, 
  Star,
  Search,
  Filter,
  Eye,
  Phone,
  Mail,
  Building,
  User,
  MapPin,
  CalendarDays,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react"
import { toast } from "sonner"

// Mock data for warden mess management
const mockMessData = {
  weeklyMenu: [
    {
      day: "Monday",
      date: "2024-01-15",
      breakfast: {
        items: ["Idli", "Sambar", "Coconut Chutney", "Tea/Coffee"],
        attendance: 45,
        feedback: 4.2
      },
      lunch: {
        items: ["Rice", "Dal", "Vegetable Curry", "Pickle", "Curd"],
        attendance: 52,
        feedback: 3.8
      },
      dinner: {
        items: ["Roti", "Paneer Curry", "Rice", "Dal", "Salad"],
        attendance: 48,
        feedback: 4.0
      }
    },
    {
      day: "Tuesday",
      date: "2024-01-16",
      breakfast: {
        items: ["Poha", "Tea", "Banana"],
        attendance: 42,
        feedback: 3.9
      },
      lunch: {
        items: ["Biryani", "Raita", "Salad"],
        attendance: 55,
        feedback: 4.5
      },
      dinner: {
        items: ["Khichdi", "Papad", "Curd"],
        attendance: 50,
        feedback: 4.1
      }
    },
    {
      day: "Wednesday",
      date: "2024-01-17",
      breakfast: {
        items: ["Bread", "Butter", "Jam", "Tea"],
        attendance: 40,
        feedback: 3.7
      },
      lunch: {
        items: ["Chapati", "Mixed Vegetable", "Dal", "Rice"],
        attendance: 53,
        feedback: 4.0
      },
      dinner: {
        items: ["Fried Rice", "Manchurian", "Soup"],
        attendance: 51,
        feedback: 4.3
      }
    },
    {
      day: "Thursday",
      date: "2024-01-18",
      breakfast: {
        items: ["Upma", "Tea", "Fruits"],
        attendance: 44,
        feedback: 3.8
      },
      lunch: {
        items: ["Rajma Chawal", "Salad", "Curd"],
        attendance: 54,
        feedback: 4.2
      },
      dinner: {
        items: ["Aloo Paratha", "Curd", "Pickle"],
        attendance: 49,
        feedback: 4.0
      }
    },
    {
      day: "Friday",
      date: "2024-01-19",
      breakfast: {
        items: ["Dosa", "Sambar", "Chutney", "Tea"],
        attendance: 46,
        feedback: 4.1
      },
      lunch: {
        items: ["Pulao", "Mixed Vegetable", "Raita"],
        attendance: 56,
        feedback: 4.4
      },
      dinner: {
        items: ["Noodles", "Spring Roll", "Soup"],
        attendance: 52,
        feedback: 4.2
      }
    },
    {
      day: "Saturday",
      date: "2024-01-20",
      breakfast: {
        items: ["Aloo Paratha", "Curd", "Tea"],
        attendance: 38,
        feedback: 4.0
      },
      lunch: {
        items: ["Kadhi Chawal", "Salad", "Papad"],
        attendance: 50,
        feedback: 4.1
      },
      dinner: {
        items: ["Pasta", "Garlic Bread", "Soup"],
        attendance: 47,
        feedback: 4.3
      }
    },
    {
      day: "Sunday",
      date: "2024-01-21",
      breakfast: {
        items: ["Pancakes", "Honey", "Tea", "Fruits"],
        attendance: 35,
        feedback: 4.2
      },
      lunch: {
        items: ["Butter Chicken", "Naan", "Rice", "Salad"],
        attendance: 58,
        feedback: 4.6
      },
      dinner: {
        items: ["Sandwich", "Soup", "Tea"],
        attendance: 45,
        feedback: 4.0
      }
    }
  ],
  todayAttendance: {
    breakfast: 46,
    lunch: 52,
    dinner: 48,
    total: 146
  },
  totalResidents: 60,
  averageFeedback: 4.1,
  specialDietary: [
    { name: "Rahul Kumar", room: "A-101", requirement: "No onion/garlic", status: "active" },
    { name: "Priya Sharma", room: "B-205", requirement: "Gluten-free", status: "active" },
    { name: "Amit Patel", room: "C-103", requirement: "Dairy-free", status: "inactive" }
  ]
}

const mealTypes = [
  { value: "all", label: "All Meals", icon: UtensilsCrossed },
  { value: "breakfast", label: "Breakfast", icon: Clock },
  { value: "lunch", label: "Lunch", icon: Calendar },
  { value: "dinner", label: "Dinner", icon: Star }
]

const getAttendancePercentage = (attendance: number, total: number) => {
  return Math.round((attendance / total) * 100)
}

const getFeedbackColor = (rating: number) => {
  if (rating >= 4.5) return "text-green-600"
  if (rating >= 4.0) return "text-blue-600"
  if (rating >= 3.5) return "text-yellow-600"
  return "text-red-600"
}

export default function WardenMessPage() {
  const { user } = useAuth()
  const [selectedMeal, setSelectedMeal] = useState("all")
  const [selectedDay, setSelectedDay] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  if (!user || user.role !== "warden") {
    return null
  }

  const today = new Date().toISOString().split('T')[0]
  const todayMenu = mockMessData.weeklyMenu.find(day => day.date === today)

  const filteredMenu = mockMessData.weeklyMenu.filter(day => {
    const matchesDay = selectedDay === "all" || day.date === selectedDay
    return matchesDay
  })

  const getAverageAttendance = () => {
    const total = mockMessData.weeklyMenu.reduce((sum, day) => {
      return sum + day.breakfast.attendance + day.lunch.attendance + day.dinner.attendance
    }, 0)
    return Math.round(total / (mockMessData.weeklyMenu.length * 3))
  }

  const getAverageFeedback = () => {
    const total = mockMessData.weeklyMenu.reduce((sum, day) => {
      return sum + day.breakfast.feedback + day.lunch.feedback + day.dinner.feedback
    }, 0)
    return (total / (mockMessData.weeklyMenu.length * 3)).toFixed(1)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Mess Management</h1>
            <p className="text-muted-foreground">
              Monitor mess operations, attendance, and feedback for your hostel
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button className="w-full sm:w-auto">
              <UtensilsCrossed className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Residents</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockMessData.totalResidents}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {getAttendancePercentage(mockMessData.todayAttendance.total, mockMessData.totalResidents)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {mockMessData.todayAttendance.total} out of {mockMessData.totalResidents}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {getAttendancePercentage(getAverageAttendance(), mockMessData.totalResidents)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Weekly average
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Feedback</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {getAverageFeedback()}
              </div>
              <p className="text-xs text-muted-foreground">
                Out of 5 stars
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Overview */}
        {todayMenu && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Today's Menu & Attendance</span>
                <Badge variant="secondary">{todayMenu.day}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {["breakfast", "lunch", "dinner"].map((meal) => (
                  <div key={meal} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold capitalize">{meal}</h3>
                      <Badge variant="outline">
                        {todayMenu[meal as keyof typeof todayMenu].attendance} present
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      {todayMenu[meal as keyof typeof todayMenu].items.map((item, index) => (
                        <div key={index} className="text-sm text-muted-foreground">
                          • {item}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className={getFeedbackColor(todayMenu[meal as keyof typeof todayMenu].feedback)}>
                          {todayMenu[meal as keyof typeof todayMenu].feedback}
                        </span>
                      </div>
                      <div className="text-muted-foreground">
                        {getAttendancePercentage(
                          todayMenu[meal as keyof typeof todayMenu].attendance,
                          mockMessData.totalResidents
                        )}% attendance
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Special Dietary Requirements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Special Dietary Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockMessData.specialDietary.map((diet, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h4 className="font-medium">{diet.name}</h4>
                      <p className="text-sm text-muted-foreground">{diet.room}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">{diet.requirement}</Badge>
                    <Badge className={diet.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {diet.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Menu */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weekly Menu & Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="menu" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="menu">Menu Overview</TabsTrigger>
                <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="menu" className="space-y-4">
                <div className="space-y-4">
                  {filteredMenu.map((day) => (
                    <div key={day.date} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">{day.day}</h3>
                        <Badge variant="outline">{day.date}</Badge>
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-3">
                        {["breakfast", "lunch", "dinner"].map((meal) => (
                          <div key={meal} className="border rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium capitalize">{meal}</h4>
                              <div className="flex items-center space-x-2">
                                <Badge variant="secondary">
                                  {day[meal as keyof typeof day].attendance}
                                </Badge>
                                <div className="flex items-center space-x-1">
                                  <Star className="h-3 w-3 text-yellow-500" />
                                  <span className="text-sm">{day[meal as keyof typeof day].feedback}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              {day[meal as keyof typeof day].items.map((item, index) => (
                                <div key={index} className="text-sm text-muted-foreground">
                                  • {item}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="performance" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Attendance Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {["breakfast", "lunch", "dinner"].map((meal) => {
                          const avgAttendance = Math.round(
                            mockMessData.weeklyMenu.reduce((sum, day) => 
                              sum + day[meal as keyof typeof day].attendance, 0
                            ) / mockMessData.weeklyMenu.length
                          )
                          return (
                            <div key={meal} className="flex items-center justify-between">
                              <span className="capitalize">{meal}</span>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{avgAttendance}</span>
                                <span className="text-sm text-muted-foreground">
                                  ({getAttendancePercentage(avgAttendance, mockMessData.totalResidents)}%)
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Feedback Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {["breakfast", "lunch", "dinner"].map((meal) => {
                          const avgFeedback = (
                            mockMessData.weeklyMenu.reduce((sum, day) => 
                              sum + day[meal as keyof typeof day].feedback, 0
                            ) / mockMessData.weeklyMenu.length
                          ).toFixed(1)
                          return (
                            <div key={meal} className="flex items-center justify-between">
                              <span className="capitalize">{meal}</span>
                              <div className="flex items-center space-x-2">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <span className="font-medium">{avgFeedback}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
