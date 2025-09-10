"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MessageSquare, Calendar, UtensilsCrossed, Loader2 } from "lucide-react"

interface ActivityItem {
  id: string
  type: "complaint" | "leave" | "mess" | "notification"
  title: string
  description: string
  timestamp: string
  status?: string
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchRecentActivities()
  }, [])

  const fetchRecentActivities = async () => {
    try {
      setLoading(true)

      // Fetch recent data from multiple APIs
      const [complaintsRes, leaveRequestsRes, notificationsRes] = await Promise.all([
        fetch('/api/complaints?limit=3'),
        fetch('/api/leave-requests?limit=3'),
        fetch('/api/notifications?limit=3')
      ])

      const [complaints, leaveRequests, notifications] = await Promise.all([
        complaintsRes.json(),
        leaveRequestsRes.json(),
        notificationsRes.json()
      ])

      // Transform and combine activities
      const combinedActivities: ActivityItem[] = []

      // Add complaints
      complaints.slice(0, 2).forEach((complaint: any) => {
        combinedActivities.push({
          id: `complaint-${complaint.id}`,
          type: "complaint",
          title: complaint.title,
          description: `Complaint filed by ${complaint.student.fullName}`,
          timestamp: formatTimeAgo(new Date(complaint.createdAt)),
          status: complaint.status.toLowerCase(),
        })
      })

      // Add leave requests
      leaveRequests.slice(0, 2).forEach((leave: any) => {
        combinedActivities.push({
          id: `leave-${leave.id}`,
          type: "leave",
          title: `Leave Request - ${leave.type}`,
          description: `${leave.student.fullName} requested leave`,
          timestamp: formatTimeAgo(new Date(leave.createdAt)),
          status: leave.status.toLowerCase(),
        })
      })

      // Add notifications
      notifications.slice(0, 2).forEach((notification: any) => {
        combinedActivities.push({
          id: `notification-${notification.id}`,
          type: "notification",
          title: notification.title,
          description: notification.message,
          timestamp: formatTimeAgo(new Date(notification.createdAt)),
        })
      })

      // Sort by timestamp (most recent first)
      combinedActivities.sort((a, b) => {
        const timeA = parseTimeAgo(a.timestamp)
        const timeB = parseTimeAgo(b.timestamp)
        return timeA - timeB
      })

      setActivities(combinedActivities.slice(0, 6)) // Show only 6 most recent
      setError("")
    } catch (err) {
      setError('Failed to load recent activities')
      console.error('Error fetching activities:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatTimeAgo = (date: Date): string => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  const parseTimeAgo = (timeAgo: string): number => {
    if (timeAgo === "Just now") return 0

    const match = timeAgo.match(/(\d+)([mhd])/)
    if (!match) return 0

    const value = parseInt(match[1])
    const unit = match[2]

    switch (unit) {
      case 'm': return value
      case 'h': return value * 60
      case 'd': return value * 60 * 24
      default: return 0
    }
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
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading activities...</span>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No recent activities
          </div>
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
                          {activity.status.replace('_', ' ')}
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
