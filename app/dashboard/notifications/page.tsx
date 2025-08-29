"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNotifications } from "@/lib/notifications"
import { Bell, Check, Trash2, CheckCheck, Trash } from "lucide-react"
import Link from "next/link"

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

  const getNotificationsByCategory = (category: string) => {
    if (category === "all") return notifications
    return notifications.filter((n: any) => n.category === category)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return "🟢"
      case "warning":
        return "🟡"
      case "error":
        return "🔴"
      default:
        return "🔵"
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getCategoryCount = (category: string) => {
    return getNotificationsByCategory(category).length
  }

  const filteredNotifications = getNotificationsByCategory(selectedCategory)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
            <p className="text-muted-foreground mt-1">
              Stay updated with all your hostel activities and announcements.
            </p>
          </div>
          <div className="flex space-x-2">
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline">
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
            )}
            <Button onClick={clearAll} variant="outline">
              <Trash className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4 text-blue-600" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Total</p>
                  <p className="text-2xl font-bold">{notifications.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-full" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Unread</p>
                  <p className="text-2xl font-bold">{unreadCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Read</p>
                  <p className="text-2xl font-bold">{notifications.length - unreadCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Today</p>
                  <p className="text-2xl font-bold">
                    {
                      notifications.filter((n) => {
                        const today = new Date().toDateString()
                        const notificationDate = new Date(n.createdAt).toDateString()
                        return today === notificationDate
                      }).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
            <TabsTrigger value="complaint">Complaints ({getCategoryCount("complaint")})</TabsTrigger>
            <TabsTrigger value="leave">Leave ({getCategoryCount("leave")})</TabsTrigger>
            <TabsTrigger value="mess">Mess ({getCategoryCount("mess")})</TabsTrigger>
            <TabsTrigger value="announcement">Announcements ({getCategoryCount("announcement")})</TabsTrigger>
            <TabsTrigger value="system">System ({getCategoryCount("system")})</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No notifications</h3>
                  <p className="text-muted-foreground">
                    {selectedCategory === "all"
                      ? "You're all caught up!"
                      : `No ${selectedCategory} notifications found.`}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`transition-all hover:shadow-md ${!notification.read ? "border-l-4 border-l-primary bg-muted/20" : ""}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-medium">{notification.title}</h3>
                              {!notification.read && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <Badge variant="outline" className="text-xs capitalize">
                                {notification.category}
                              </Badge>
                              <span>{formatTime(notification.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {notification.actionUrl && (
                            <Button asChild variant="outline" size="sm">
                              <Link href={notification.actionUrl}>View</Link>
                            </Button>
                          )}
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
