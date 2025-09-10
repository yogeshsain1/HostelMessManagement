"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, User, CheckCircle, XCircle, Loader2 } from "lucide-react"

interface LeaveRequest {
  id: string
  type: string
  reason: string
  startDate: string
  endDate: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  createdAt: string
  updatedAt?: string
  studentId: string
  approvedBy?: string
  student: {
    id: string
    fullName: string
    email: string
    role: string
  }
  approvedWarden?: {
    id: string
    fullName: string
    email: string
    role: string
  }
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
}

export function LeaveApproval() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null)
  const [comment, setComment] = useState("")
  const [updating, setUpdating] = useState(false)

  // Fetch leave requests from API
  const fetchLeaveRequests = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/leave-requests')
      if (!response.ok) {
        throw new Error('Failed to fetch leave requests')
      }
      const data = await response.json()
      setLeaveRequests(data)
      setError("")
    } catch (err) {
      setError('Failed to load leave requests')
      console.error('Error fetching leave requests:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaveRequests()
  }, [])

  const handleApprove = async () => {
    if (!selectedRequest) return

    try {
      setUpdating(true)
      const response = await fetch(`/api/leave-requests/${selectedRequest.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'APPROVED',
          // Add comment to reason if provided
          ...(comment && { reason: `${selectedRequest.reason}\n\nAdmin Comment: ${comment}` })
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to approve leave request')
      }

      // Refresh leave requests list
      await fetchLeaveRequests()

      // Reset form
      setSelectedRequest(null)
      setComment("")
    } catch (err) {
      setError('Failed to approve leave request')
      console.error('Error approving leave request:', err)
    } finally {
      setUpdating(false)
    }
  }

  const handleReject = async () => {
    if (!selectedRequest) return

    try {
      setUpdating(true)
      const response = await fetch(`/api/leave-requests/${selectedRequest.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'REJECTED',
          // Add comment to reason if provided
          ...(comment && { reason: `${selectedRequest.reason}\n\nAdmin Comment: ${comment}` })
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to reject leave request')
      }

      // Refresh leave requests list
      await fetchLeaveRequests()

      // Reset form
      setSelectedRequest(null)
      setComment("")
    } catch (err) {
      setError('Failed to reject leave request')
      console.error('Error rejecting leave request:', err)
    } finally {
      setUpdating(false)
    }
  }

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading leave requests...</span>
        </div>
      ) : (
        <div className="grid gap-4">
          {leaveRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No leave requests found
            </div>
          ) : (
            leaveRequests.map((request) => (
              <Card key={request.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">Leave Request - {request.type}</CardTitle>
                    <Badge className={statusColors[request.status]}>{request.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(request.startDate).toLocaleDateString()} to {new Date(request.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {calculateDays(request.startDate, request.endDate)} days
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{request.student.fullName}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>{request.student.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>Requested on {new Date(request.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">{request.reason}</p>

                    {request.status === "PENDING" && (
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={() => setSelectedRequest(request)} className="flex-1">
                          Review Request
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Leave Request Review Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Review Leave Request</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium">Student</Label>
                  <p className="text-sm">{selectedRequest.student.fullName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm">{selectedRequest.student.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Leave Type</Label>
                  <p className="text-sm capitalize">{selectedRequest.type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Duration</Label>
                  <p className="text-sm">
                    {new Date(selectedRequest.startDate).toLocaleDateString()} to {new Date(selectedRequest.endDate).toLocaleDateString()} ({calculateDays(selectedRequest.startDate, selectedRequest.endDate)} days)
                  </p>
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
                <Button onClick={handleApprove} disabled={updating} className="flex-1">
                  {updating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </>
                  )}
                </Button>
                <Button onClick={handleReject} disabled={updating} variant="destructive" className="flex-1">
                  {updating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setSelectedRequest(null)} disabled={updating}>
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
