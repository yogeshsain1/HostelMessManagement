"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { MenuCard } from "@/components/mess/menu-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, TrendingUp, Users, UtensilsCrossed } from "lucide-react"
import Link from "next/link"

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
    },
    snacks: {
      items: [
        { name: "Bread Pakora (2 pcs)", isVeg: true },
        { name: "Mint Chutney", isVeg: true },
        { name: "Tea/Coffee", isVeg: true },
      ],
      time: "4:00 PM - 6:00 PM",
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
    },
  },
}

export default function MessPage() {
  const [selectedDay, setSelectedDay] = useState<"today" | "tomorrow">("today")

  const currentMenu = mockMenuData[selectedDay]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-600">Poornima University Mess</h1>
            <p className="text-muted-foreground mt-1">
              Authentic Rajasthani cuisine with modern facilities - Jaipur Campus
            </p>
          </div>
          <div className="flex space-x-2">
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/dashboard/mess/qr">QR Attendance</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/mess/feedback">Give Feedback</Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Today's Attendance</p>
                  <p className="text-2xl font-bold">3/4</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">This Month</p>
                  <p className="text-2xl font-bold">88%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Avg Rating</p>
                  <p className="text-2xl font-bold">4.3</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Streak</p>
                  <p className="text-2xl font-bold">12 days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Menu Tabs */}
        <Tabs value={selectedDay} onValueChange={(value) => setSelectedDay(value as "today" | "tomorrow")}>
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
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <Button asChild className="h-auto p-4 justify-start bg-blue-600 hover:bg-blue-700">
                <Link href="/dashboard/mess/qr">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <UtensilsCrossed className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Mark Attendance</div>
                      <div className="text-sm text-blue-100">Scan QR code for meal attendance</div>
                    </div>
                  </div>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 justify-start bg-transparent">
                <Link href="/dashboard/mess/feedback">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Give Feedback</div>
                      <div className="text-sm text-muted-foreground">Rate and review today's meals</div>
                    </div>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
