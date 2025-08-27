"use client"

import { useAuth } from "@/lib/auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StatsCard } from "@/components/dashboard/stats-card"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Calendar, UtensilsCrossed, Clock, QrCode } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
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
              <div className="space-y-3 sm:space-y-4">
                <div className="p-3 rounded-lg bg-muted/50">
                  <h4 className="font-medium text-sm">Breakfast (7:00 - 9:00 AM)</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">Idli, Sambar, Coconut Chutney</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <h4 className="font-medium text-sm">Lunch (12:00 - 2:00 PM)</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">Rajasthani Dal Baati, Rice, Vegetable</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <h4 className="font-medium text-sm">Snacks (4:00 - 6:00 PM)</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">Samosa, Tea</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <h4 className="font-medium text-sm">Dinner (7:00 - 9:00 PM)</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">Roti, Paneer Curry, Rice</p>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
