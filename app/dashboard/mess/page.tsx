"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  UtensilsCrossed, 
  Calendar, 
  Clock, 
  Star, 
  QrCode,
  TrendingUp,
  Users,
  MessageSquare,
  ArrowLeft,
  ArrowRight,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface MessMenuItem {
  id: string
  date: string
  mealType: string
  items: string[]
  createdAt: string
  updatedAt: string
}

interface AttendanceRecord {
  id: string
  studentId: string
  date: string
  mealType: string
  attended: boolean
  student: {
    id: string
    fullName: string
    email: string
    role: string
  }
}

interface WeeklyMenuData {
  week: string
  days: {
    date: string
    isToday: boolean
    breakfast?: { time: string; items: string; rating: number }
    lunch?: { time: string; items: string; rating: number }
    snacks?: { time: string; items: string; rating: number }
    dinner?: { time: string; items: string; rating: number }
  }[]
}

export default function MessPage() {
  const { user } = useAuth()
  const [selectedWeek, setSelectedWeek] = useState(0)
  const [menuData, setMenuData] = useState<MessMenuItem[]>([])
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    todayMeals: 0,
    avgRating: 0,
    attendanceToday: 0,
    attendanceMonth: 0
  })

  useEffect(() => {
    fetchMessData()
  }, [])

  const fetchMessData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch menu data
      const menuRes = await fetch("/api/mess/menu")
      if (!menuRes.ok) throw new Error("Failed to fetch menu")
      const menuItems = await menuRes.json()
      setMenuData(menuItems)

      // Fetch attendance data for current user
      const attendanceRes = await fetch(`/api/mess/attendance?studentId=${user?.id}`)
      if (!attendanceRes.ok) throw new Error("Failed to fetch attendance")
      const attendanceRecords = await attendanceRes.json()
      setAttendanceData(attendanceRecords)

      // Calculate stats
      calculateStats(menuItems, attendanceRecords)
    } catch (error) {
      console.error("Error fetching mess data:", error)
      toast.error("Failed to load mess data")
    } finally {
      setIsLoading(false)
    }
  }

  const calculateStats = (menuItems: MessMenuItem[], attendanceRecords: AttendanceRecord[]) => {
    const today = new Date().toISOString().split('T')[0]
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    // Today's meals count
    const todayMeals = menuItems.filter(item => 
      item.date.startsWith(today)
    ).length

    // Average rating (mock for now, could be calculated from feedback)
    const avgRating = 4.3

    // Today's attendance percentage
    const todayAttendance = attendanceRecords.filter(record => 
      record.date.startsWith(today) && record.attended
    ).length
    const todayTotalPossible = attendanceRecords.filter(record => 
      record.date.startsWith(today)
    ).length
    const attendanceToday = todayTotalPossible > 0 ? Math.round((todayAttendance / todayTotalPossible) * 100) : 0

    // Monthly attendance percentage
    const monthAttendance = attendanceRecords.filter(record => {
      const recordDate = new Date(record.date)
      return recordDate.getMonth() === currentMonth && 
             recordDate.getFullYear() === currentYear && 
             record.attended
    }).length
    const monthTotalPossible = attendanceRecords.filter(record => {
      const recordDate = new Date(record.date)
      return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear
    }).length
    const attendanceMonth = monthTotalPossible > 0 ? Math.round((monthAttendance / monthTotalPossible) * 100) : 0

    setStats({
      todayMeals,
      avgRating,
      attendanceToday,
      attendanceMonth
    })
  }

  const transformMenuData = (menuItems: MessMenuItem[]): WeeklyMenuData[] => {
    const weeks: { [key: string]: MessMenuItem[] } = {}
    
    menuItems.forEach(item => {
      const date = new Date(item.date)
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay())
      const weekKey = weekStart.toISOString().split('T')[0]
      
      if (!weeks[weekKey]) {
        weeks[weekKey] = []
      }
      weeks[weekKey].push(item)
    })

    return Object.entries(weeks).map(([weekStart, items]) => {
      const startDate = new Date(weekStart)
      const endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 6)
      
      const weekLabel = `Week of ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
      
      const days = []
      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startDate)
        currentDate.setDate(startDate.getDate() + i)
        const dateStr = currentDate.toISOString().split('T')[0]
        const isToday = dateStr === new Date().toISOString().split('T')[0]
        
        const dayItems = items.filter(item => item.date.startsWith(dateStr))
        
        const dayData = {
          date: currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
          isToday,
          breakfast: dayItems.find(item => item.mealType.toLowerCase() === 'breakfast') ? {
            time: "7:00 - 9:00 AM",
            items: dayItems.find(item => item.mealType.toLowerCase() === 'breakfast')!.items.join(', '),
            rating: 4.2
          } : undefined,
          lunch: dayItems.find(item => item.mealType.toLowerCase() === 'lunch') ? {
            time: "12:00 - 2:00 PM", 
            items: dayItems.find(item => item.mealType.toLowerCase() === 'lunch')!.items.join(', '),
            rating: 4.5
          } : undefined,
          snacks: dayItems.find(item => item.mealType.toLowerCase() === 'snacks') ? {
            time: "4:00 - 6:00 PM",
            items: dayItems.find(item => item.mealType.toLowerCase() === 'snacks')!.items.join(', '),
            rating: 4.0
          } : undefined,
          dinner: dayItems.find(item => item.mealType.toLowerCase() === 'dinner') ? {
            time: "7:00 - 9:00 PM",
            items: dayItems.find(item => item.mealType.toLowerCase() === 'dinner')!.items.join(', '),
            rating: 4.3
          } : undefined
        }
        
        days.push(dayData)
      }
      
      return { week: weekLabel, days }
    })
  }

  if (!user) {
    return null
  }

  const weeklyMenuData = transformMenuData(menuData)
  const currentWeek = weeklyMenuData[selectedWeek] || { week: "No menu available", days: [] }
  const today = currentWeek.days.find(day => day.isToday)

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold">Mess Menu</h1>
            <p className="text-muted-foreground">Weekly mess menu and meal information</p>
          </div>
          <div className="flex space-x-2">
            <Button asChild variant="outline">
              <Link href="/dashboard/mess/qr">
                <QrCode className="h-4 w-4 mr-2" />
                QR Attendance
              </Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/mess/feedback">
                <MessageSquare className="h-4 w-4 mr-2" />
                Give Feedback
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <UtensilsCrossed className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today's Meals</p>
                  <p className="text-xl font-bold">{stats.todayMeals}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                  <p className="text-xl font-bold">{stats.avgRating}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Attendance</p>
                  <p className="text-xl font-bold">{stats.attendanceToday}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Month</p>
                  <p className="text-xl font-bold">{stats.attendanceMonth}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Week Navigation */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedWeek(Math.max(0, selectedWeek - 1))}
                disabled={selectedWeek === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous Week
              </Button>
              
              <h3 className="text-lg font-semibold">{currentWeek.week}</h3>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedWeek(Math.min(weeklyMenuData.length - 1, selectedWeek + 1))}
                disabled={selectedWeek === weeklyMenuData.length - 1}
              >
                Next Week
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Menu */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Weekly Menu</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {currentWeek.days.map((day, dayIndex) => (
                <div key={dayIndex} className={`p-4 rounded-lg border transition-colors ${
                  day.isToday 
                    ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800' 
                    : 'bg-muted/30 dark:bg-muted/20 border-border'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-lg font-semibold ${
                      day.isToday 
                        ? 'text-blue-900 dark:text-blue-100' 
                        : 'text-foreground'
                    }`}>
                      {day.date}
                    </h3>
                    {day.isToday && (
                      <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700">
                        Today
                      </Badge>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {Object.entries(day).filter(([key]) => ['breakfast', 'lunch', 'snacks', 'dinner'].includes(key)).map(([mealType, mealData]) => {
                      if (!mealData || typeof mealData !== 'object') return null
                      
                      return (
                        <div key={mealType} className="p-3 rounded-lg bg-card dark:bg-card/80 border border-border hover:border-border/60 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium capitalize text-sm text-foreground">{mealType}</h4>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-500 dark:text-yellow-400 fill-current" />
                              <span className="text-xs text-foreground">{(mealData as any).rating}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{(mealData as any).time}</span>
                            </div>
                            <p className="text-sm text-foreground">{(mealData as any).items}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Highlights */}
        {today && (today.lunch || today.snacks) && (
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/50 dark:to-blue-950/50 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-xl text-green-900 dark:text-green-100">Today's Highlights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {today.lunch && (
                  <div className="p-4 bg-white dark:bg-card rounded-lg border border-border">
                    <h4 className="font-semibold mb-2 text-foreground">Best Rated Meal</h4>
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-yellow-500 dark:text-yellow-400 fill-current" />
                      <span className="font-medium text-foreground">{today.lunch.items}</span>
                      <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700">
                        {today.lunch.rating} ★
                      </Badge>
                    </div>
                  </div>
                )}

                {today.snacks && (
                  <div className="p-4 bg-white dark:bg-card rounded-lg border border-border">
                    <h4 className="font-semibold mb-2 text-foreground">Next Meal</h4>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">Snacks</span>
                      <span className="text-sm text-muted-foreground">({today.snacks.time})</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
              <Button
                asChild
                className="h-auto p-4 flex-col space-y-2"
              >
                <Link href="/dashboard/mess/qr">
                  <QrCode className="h-6 w-6" />
                  <span className="font-medium">Mark Attendance</span>
                </Link>
              </Button>
              
              <Button
                asChild
                variant="outline"
                className="h-auto p-4 flex-col space-y-2"
              >
                <Link href="/dashboard/mess/feedback">
                  <MessageSquare className="h-6 w-6" />
                  <span className="font-medium">Rate Meals</span>
                </Link>
              </Button>
              
              <Button
                asChild
                variant="outline"
                className="h-auto p-4 flex-col space-y-2"
              >
                <Link href="/dashboard/complaints/new">
                  <MessageSquare className="h-6 w-6" />
                  <span className="font-medium">Report Issue</span>
                </Link>
              </Button>
              
              <Button
                asChild
                variant="outline"
                className="h-auto p-4 flex-col space-y-2"
              >
                <Link href="/dashboard/hostel">
                  <Calendar className="h-6 w-6" />
                  <span className="font-medium">Hostel Info</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
