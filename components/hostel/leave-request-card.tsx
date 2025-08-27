import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"

interface LeaveRequest {
  id: string
  startDate: string
  endDate: string
  reason: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  approvedBy?: string
}

interface LeaveRequestCardProps {
  request: LeaveRequest
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
}

export function LeaveRequestCard({ request }: LeaveRequestCardProps) {
  const calculateDays = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-base">Leave Request</CardTitle>
          <Badge className={statusColors[request.status]}>{request.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {request.startDate} to {request.endDate}
              </span>
            </div>
            <Badge variant="outline" className="text-xs">
              {calculateDays(request.startDate, request.endDate)} days
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground">{request.reason}</p>

          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>Requested on {request.createdAt}</span>
            </div>
          </div>

          {request.approvedBy && request.status === "approved" && (
            <p className="text-xs text-green-600">Approved by {request.approvedBy}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
