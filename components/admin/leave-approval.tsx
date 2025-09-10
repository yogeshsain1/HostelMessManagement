"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, User, CheckCircle, XCircle } from "lucide-react"

interface LeaveRequest {
  id: string
  studentName: string
  roomNumber: string
  startDate: string
  endDate: string
  reason: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  days: number
}

interface LeaveApprovalProps {
  requests: LeaveRequest[]
  onUpdateRequest: (id: string, status: "approved" | "rejected", comment?: string) => void
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
}

export function LeaveApproval({ requests, onUpdateRequest }: LeaveApprovalProps) {
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null)
  const [comment, setComment] = useState("")

  const handleApprove = () => {
    if (selectedRequest) {
      onUpdateRequest(selectedRequest.id, "approved", comment)
      setSelectedRequest(null)
      setComment("")
    }
  }

  const handleReject = () => {
    if (selectedRequest) {
      onUpdateRequest(selectedRequest.id, "rejected", comment)
      setSelectedRequest(null)
      setComment("")
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {requests.map((request) => (
          <Card key={request.id} className="cursor-pointer hover:shadow-md transition-shadow">
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
                    {request.days} days
                  </Badge>
                </div>

                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{request.studentName}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>Room {request.roomNumber}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>Requested on {request.createdAt}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">{request.reason}</p>

                {request.status === "pending" && (
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={() => setSelectedRequest(request)} className="flex-1">
                      Review Request
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Leave Request Review Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Review Leave Request</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium">Student</Label>
                  <p className="text-sm">{selectedRequest.studentName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Room</Label>
                  <p className="text-sm">{selectedRequest.roomNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Duration</Label>
                  <p className="text-sm">
                    {selectedRequest.startDate} to {selectedRequest.endDate} ({selectedRequest.days} days)
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Requested On</Label>
                  <p className="text-sm">{selectedRequest.createdAt}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Reason</Label>
                <p className="text-sm text-muted-foreground mt-1">{selectedRequest.reason}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">Comment (Optional)</Label>
                <Textarea
                  id="comment"
                  placeholder="Add a comment for the student..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleApprove} className="flex-1">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button onClick={handleReject} variant="destructive" className="flex-1">
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
