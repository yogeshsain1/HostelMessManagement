"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, AlertTriangle } from "lucide-react"

interface Complaint {
  id: string
  title: string
  description: string
  category: "maintenance" | "cleanliness" | "security" | "food" | "other"
  status: "pending" | "in-progress" | "resolved" | "rejected"
  priority: "low" | "medium" | "high" | "urgent"
  createdAt: string
  updatedAt?: string
}

interface ComplaintCardProps {
  complaint: Complaint
  onViewDetails?: (complaint: Complaint) => void
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  "in-progress": "bg-blue-100 text-blue-800",
  resolved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
}

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-orange-100 text-orange-800",
  high: "bg-red-100 text-red-800",
  urgent: "bg-red-200 text-red-900",
}

const categoryIcons = {
  maintenance: AlertTriangle,
  cleanliness: Clock,
  security: User,
  food: Clock,
  other: Clock,
}

export function ComplaintCard({ complaint, onViewDetails }: ComplaintCardProps) {
  const Icon = categoryIcons[complaint.category]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">{complaint.title}</CardTitle>
          </div>
          <div className="flex space-x-2">
            <Badge className={priorityColors[complaint.priority]}>{complaint.priority}</Badge>
            <Badge className={statusColors[complaint.status]}>{complaint.status}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{complaint.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{complaint.createdAt}</span>
            </div>
            <Badge variant="outline" className="text-xs capitalize">
              {complaint.category}
            </Badge>
          </div>

          {onViewDetails && (
            <Button variant="outline" size="sm" onClick={() => onViewDetails(complaint)}>
              View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
