import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MessageSquare, Calendar, UtensilsCrossed } from "lucide-react"

interface ActivityItem {
  id: string
  type: "complaint" | "leave" | "mess" | "notification"
  title: string
  description: string
  timestamp: string
  status?: string
}

const mockActivities: ActivityItem[] = [
  {
    id: "1",
    type: "complaint",
    title: "AC Repair Request",
    description: "Your complaint about AC in room A101 is being processed",
    timestamp: "2 hours ago",
    status: "in-progress",
  },
  {
    id: "2",
    type: "leave",
    title: "Leave Request Approved",
    description: "Your leave request for Dec 15-20 has been approved",
    timestamp: "1 day ago",
    status: "approved",
  },
  {
    id: "3",
    type: "mess",
    title: "Menu Updated",
    description: "Tomorrow's dinner menu has been updated",
    timestamp: "2 days ago",
  },
  {
    id: "4",
    type: "notification",
    title: "Hostel Meeting",
    description: "Monthly hostel meeting scheduled for Dec 25",
    timestamp: "3 days ago",
  },
]

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockActivities.map((activity) => {
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
      </CardContent>
    </Card>
  )
}
