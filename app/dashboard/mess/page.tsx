"use client"

import { useState } from "react"
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
  ArrowRight
} from "lucide-react"
import Link from "next/link"

export default function MessPage() {
  const { user } = useAuth()
  const [selectedWeek, setSelectedWeek] = useState(0)

  if (!user) {
    return null
  }

  // Mock weekly menu data
  const weeklyMenuData = [
    {
      week: "Week 1 (Jan 15-21)",
      days: [
        {
          date: "Monday, Jan 15",
          isToday: true,
          breakfast: { time: "7:00 - 9:00 AM", items: "Idli, Sambar, Coconut Chutney", rating: 4.2 },
          lunch: { time: "12:00 - 2:00 PM", items: "Rajasthani Dal Baati, Rice, Vegetable", rating: 4.5 },
          snacks: { time: "4:00 - 6:00 PM", items: "Samosa, Tea", rating: 4.0 },
          dinner: { time: "7:00 - 9:00 PM", items: "Roti, Paneer Curry, Rice", rating: 4.3 }
        },
        {
          date: "Tuesday, Jan 16",
          isToday: false,
          breakfast: { time: "7:00 - 9:00 AM", items: "Poha, Jalebi, Tea", rating: 4.1 },
          lunch: { time: "12:00 - 2:00 PM", items: "Rajma Chawal, Salad, Raita", rating: 4.4 },
          snacks: { time: "4:00 - 6:00 PM", items: "Pakora, Coffee", rating: 3.9 },
          dinner: { time: "7:00 - 9:00 PM", items: "Chicken Curry, Roti, Dal", rating: 4.6 }
        },
        {
          date: "Wednesday, Jan 17",
          isToday: false,
          breakfast: { time: "7:00 - 9:00 AM", items: "Bread, Butter, Jam, Milk", rating: 3.8 },
          lunch: { time: "12:00 - 2:00 PM", items: "Mixed Vegetable, Roti, Dal", rating: 4.2 },
          snacks: { time: "4:00 - 6:00 PM", items: "Biscuits, Tea", rating: 3.7 },
          dinner: { time: "7:00 - 9:00 PM", items: "Egg Curry, Rice, Vegetable", rating: 4.4 }
        },
        {
          date: "Thursday, Jan 18",
          isToday: false,
          breakfast: { time: "7:00 - 9:00 AM", items: "Upma, Chutney, Tea", rating: 4.0 },
          lunch: { time: "12:00 - 2:00 PM", items: "Kadhi Pakora, Rice, Salad", rating: 4.3 },
          snacks: { time: "4:00 - 6:00 PM", items: "Fruits, Juice", rating: 4.5 },
          dinner: { time: "7:00 - 9:00 PM", items: "Mutton Curry, Roti, Dal", rating: 4.7 }
        },
        {
          date: "Friday, Jan 19",
          isToday: false,
          breakfast: { time: "7:00 - 9:00 AM", items: "Dosa, Sambar, Chutney", rating: 4.4 },
          lunch: { time: "12:00 - 2:00 PM", items: "Chole Bhature, Salad", rating: 4.6 },
          snacks: { time: "4:00 - 6:00 PM", items: "Cake, Coffee", rating: 4.2 },
          dinner: { time: "7:00 - 9:00 PM", items: "Fish Curry, Rice, Vegetable", rating: 4.5 }
        },
        {
          date: "Saturday, Jan 20",
          isToday: false,
          breakfast: { time: "7:00 - 9:00 AM", items: "Puri, Aloo Sabzi, Tea", rating: 4.3 },
          lunch: { time: "12:00 - 2:00 PM", items: "Biryani, Raita, Salad", rating: 4.8 },
          snacks: { time: "4:00 - 6:00 PM", items: "Ice Cream, Juice", rating: 4.6 },
          dinner: { time: "7:00 - 9:00 PM", items: "Paneer Tikka, Roti, Dal", rating: 4.4 }
        },
        {
          date: "Sunday, Jan 21",
          isToday: false,
          breakfast: { time: "7:00 - 9:00 AM", items: "Sandwich, Milk, Fruits", rating: 4.1 },
          lunch: { time: "12:00 - 2:00 PM", items: "Thali (Mixed Items)", rating: 4.7 },
          snacks: { time: "4:00 - 6:00 PM", items: "Chips, Soft Drink", rating: 4.0 },
          dinner: { time: "7:00 - 9:00 PM", items: "Chicken Biryani, Raita", rating: 4.8 }
        }
      ]
    }
  ]

  const currentWeek = weeklyMenuData[selectedWeek]
  const today = currentWeek.days.find(day => day.isToday)

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
                  <p className="text-xl font-bold">4</p>
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
                  <p className="text-xl font-bold">4.3</p>
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
                  <p className="text-xl font-bold">85%</p>
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
                  <p className="text-xl font-bold">88%</p>
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
                    {Object.entries(day).filter(([key]) => ['breakfast', 'lunch', 'snacks', 'dinner'].includes(key)).map(([mealType, mealData]) => (
                      <div key={mealType} className="p-3 rounded-lg bg-card dark:bg-card/80 border border-border hover:border-border/60 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium capitalize text-sm text-foreground">{mealType}</h4>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-500 dark:text-yellow-400 fill-current" />
                            <span className="text-xs text-foreground">{mealData.rating}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{mealData.time}</span>
                          </div>
                          <p className="text-sm text-foreground">{mealData.items}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Highlights */}
        {today && (
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/50 dark:to-blue-950/50 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-xl text-green-900 dark:text-green-100">Today's Highlights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
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

                <div className="p-4 bg-white dark:bg-card rounded-lg border border-border">
                  <h4 className="font-semibold mb-2 text-foreground">Next Meal</h4>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">Snacks</span>
                    <span className="text-sm text-muted-foreground">({today.snacks.time})</span>
                  </div>
                </div>
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
