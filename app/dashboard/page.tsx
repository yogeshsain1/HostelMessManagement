"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StatsCard } from "@/components/dashboard/stats-card"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Calendar, UtensilsCrossed, Clock, QrCode } from "lucide-react"
import Link from "next/link"
import { DashboardSkeleton } from "@/components/loading-skeleton"
import { ErrorMessage, LoadingError } from "@/components/error-message"
import { useRetry } from "@/lib/retry"

// Mock API call that can fail sometimes
const fetchTodaysMenu = async () => {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // Simulate occasional failure
  if (Math.random() > 0.9) {
    throw new Error("Failed to load today's menu")
  }

  return {
    breakfast: { time: "7:00 - 9:00 AM", items: "Idli, Sambar, Coconut Chutney" },
    lunch: { time: "12:00 - 2:00 PM", items: "Rajasthani Dal Baati, Rice, Vegetable" },
    snacks: { time: "4:00 - 6:00 PM", items: "Samosa, Tea" },
    dinner: { time: "7:00 - 9:00 PM", items: "Roti, Paneer Curry, Rice" }
  }
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [menuData, setMenuData] = useState(null)
  const [initialLoading, setInitialLoading] = useState(true)

  const {
    execute: loadMenu,
    isLoading: menuLoading,
    error: menuError
  } = useRetry(fetchTodaysMenu, { maxAttempts: 2 })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    const initializeDashboard = async () => {
      if (user) {
        try {
          const menu = await loadMenu()
          setMenuData(menu)
        } catch (error) {
          console.error("Failed to load menu:", error)
        } finally {
          setInitialLoading(false)
        }
      }
    }

    initializeDashboard()
  }, [user, loadMenu])

  const handleRetryMenu = async () => {
    try {
      const menu = await loadMenu()
      setMenuData(menu)
    } catch (error) {
      console.error("Menu retry failed:", error)
    }
  }

  if (loading || initialLoading) {
    return <DashboardSkeleton />
  }

  if (!user) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="animate-in fade-in-0 slide-in-from-top-2 duration-500">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Welcome back, {user.fullName.split(" ")[0]}!
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Here's what's happening in your hostel today.
          </p>
        </div>

        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-500 delay-100">
          <StatsCard title="Active Complaints" value={2} description="1 in progress, 1 pending" icon={MessageSquare} />
          <StatsCard title="Leave Requests" value={1} description="1 approved this month" icon={Calendar} />
          <StatsCard
            title="Mess Attendance"
            value="85%"
            description="This month"
            icon={UtensilsCrossed}
            trend={{ value: 5, label: "from last month" }}
          />
          <StatsCard title="Room Status" value="Active" description={`Room ${user.roomNumber}`} icon={Clock} />
        </div>

        <Card className="animate-in fade-in-0 slide-in-from-bottom-2 duration-500 delay-200">
          <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
            <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
              <Button
                asChild
                className="h-auto p-3 sm:p-4 flex-col space-y-2 min-h-[80px] sm:min-h-[88px] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Link href="/dashboard/complaints/new">
                  <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="text-xs sm:text-sm font-medium">File Complaint</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-auto p-3 sm:p-4 flex-col space-y-2 min-h-[80px] sm:min-h-[88px] bg-transparent transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Link href="/dashboard/leave/new">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="text-xs sm:text-sm font-medium">Request Leave</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-auto p-3 sm:p-4 flex-col space-y-2 min-h-[80px] sm:min-h-[88px] bg-transparent transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Link href="/dashboard/mess">
                  <UtensilsCrossed className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="text-xs sm:text-sm font-medium">View Menu</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-auto p-3 sm:p-4 flex-col space-y-2 min-h-[80px] sm:min-h-[88px] bg-transparent transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Link href="/dashboard/mess/qr">
                  <QrCode className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="text-xs sm:text-sm font-medium">QR Attendance</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-500 delay-300">
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>

          <Card className="transition-all duration-200 hover:scale-[1.02]">
            <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
              <CardTitle className="text-lg sm:text-xl">Today's Menu</CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
              {menuLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="p-3 rounded-lg bg-muted/20 animate-pulse">
                      <div className="h-4 bg-gray-300 rounded w-1/3 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                    </div>
                  ))}
                </div>
              ) : menuError ? (
                <LoadingError 
                  message="Failed to load today's menu"
                  onRetry={handleRetryMenu}
                />
              ) : menuData ? (
                <div className="space-y-3 sm:space-y-4">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <h4 className="font-medium text-sm">Breakfast ({menuData.breakfast.time})</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">{menuData.breakfast.items}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <h4 className="font-medium text-sm">Lunch ({menuData.lunch.time})</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">{menuData.lunch.items}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <h4 className="font-medium text-sm">Snacks ({menuData.snacks.time})</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">{menuData.snacks.items}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <h4 className="font-medium text-sm">Dinner ({menuData.dinner.time})</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">{menuData.dinner.items}</p>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] h-10"
                  >
                    <Link href="/dashboard/mess">View Full Menu</Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  <p>No menu data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
