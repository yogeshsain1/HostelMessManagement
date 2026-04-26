"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MessageSquare, Calendar, UtensilsCrossed } from "lucide-react"

interface ActivityItem {
  id: string
  type: "complaint" | "leave" | "mess" | "notification"
  title: string
  description: string
  timestamp: string
  createdAt: string
  status?: string
}

const formatTimestamp = (value: string) => {
  const createdAt = new Date(value).getTime()
  const now = Date.now()
  const diffMinutes = Math.max(0, Math.floor((now - createdAt) / 60000))

  if (diffMinutes < 1) return "just now"
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours} hours ago`

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} days ago`
}

const getIcon = (type: ActivityItem["type"]) => {
  switch (type) {
    case "complaint":
      return MessageSquare
    case "leave":
      return Calendar
    case "mess":
      return UtensilsCrossed
    default:
      return Clock
  }
}

const getStatusColor = (status?: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800"
    case "in-progress":
      return "bg-blue-100 text-blue-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "rejected":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([])

  useEffect(() => {
    const loadRecentActivity = async () => {
      try {
        const [complaintsRes, leavesRes, notificationsRes] = await Promise.all([
          fetch("/api/complaints?mine=true", { credentials: "include" }),
          fetch("/api/leave-requests?mine=true", { credentials: "include" }),
          fetch("/api/notifications", { credentials: "include" }),
        ])

        const [complaintsJson, leavesJson, notificationsJson] = await Promise.all([
          complaintsRes.json().catch(() => ({})),
          leavesRes.json().catch(() => ({})),
          notificationsRes.json().catch(() => ({})),
        ])

        const complaintActivities: ActivityItem[] = Array.isArray(complaintsJson?.data?.complaints)
          ? complaintsJson.data.complaints.slice(0, 4).map((item: any) => ({
              id: `complaint-${item.id}`,
              type: "complaint",
              title: item.title,
              description: item.description,
              timestamp: formatTimestamp(item.createdAt),
              createdAt: item.createdAt,
              status: String(item.status || "").toLowerCase().replaceAll("_", "-"),
            }))
          : []

        const leaveActivities: ActivityItem[] = Array.isArray(leavesJson?.data?.leaveRequests)
          ? leavesJson.data.leaveRequests.slice(0, 4).map((item: any) => ({
              id: `leave-${item.id}`,
              type: "leave",
              title: "Leave Request",
              description: item.reason,
              timestamp: formatTimestamp(item.createdAt),
              createdAt: item.createdAt,
              status: String(item.status || "").toLowerCase().replaceAll("_", "-"),
            }))
          : []

        const notificationActivities: ActivityItem[] = Array.isArray(notificationsJson?.data?.notifications)
          ? notificationsJson.data.notifications.slice(0, 4).map((item: any) => ({
              id: `notification-${item.id}`,
              type: "notification",
              title: item.title,
              description: item.message,
              timestamp: formatTimestamp(item.createdAt),
              createdAt: item.createdAt,
              status: item.read ? "read" : "pending",
            }))
          : []

        const merged = [...complaintActivities, ...leaveActivities, ...notificationActivities]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 6)

        setActivities(merged)
      } catch (_) {
        setActivities([])
      }
    }

    void loadRecentActivity()
  }, [])

  const hasActivities = useMemo(() => activities.length > 0, [activities])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasActivities ? (
          <div className="text-sm text-muted-foreground">No recent activity available.</div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
            const Icon = getIcon(activity.type)
            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">{activity.title}</p>
                    {activity.status && (
                      <Badge variant="secondary" className={getStatusColor(activity.status)}>
                        {activity.status}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                </div>
              </div>
            )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
