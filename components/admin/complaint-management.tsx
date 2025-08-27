"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar, User, AlertTriangle } from "lucide-react"

interface Complaint {
  id: string
  title: string
  description: string
  category: "maintenance" | "cleanliness" | "security" | "food" | "other"
  status: "pending" | "in-progress" | "resolved" | "rejected"
  priority: "low" | "medium" | "high" | "urgent"
  studentName: string
  roomNumber: string
  createdAt: string
  updatedAt?: string
}

interface ComplaintManagementProps {
  complaints: Complaint[]
  onUpdateComplaint: (id: string, status: string, response?: string) => void
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

export function ComplaintManagement({ complaints, onUpdateComplaint }: ComplaintManagementProps) {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [newStatus, setNewStatus] = useState("")
  const [response, setResponse] = useState("")

  const handleUpdateComplaint = () => {
    if (selectedComplaint && newStatus) {
      onUpdateComplaint(selectedComplaint.id, newStatus, response)
      setSelectedComplaint(null)
      setNewStatus("")
      setResponse("")
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {complaints.map((complaint) => (
          <Card key={complaint.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-base">{complaint.title}</CardTitle>
                </div>
                <div className="flex space-x-2">
                  <Badge className={priorityColors[complaint.priority]}>{complaint.priority}</Badge>
                  <Badge className={statusColors[complaint.status]}>{complaint.status}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{complaint.description}</p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{complaint.studentName}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>Room {complaint.roomNumber}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{complaint.createdAt}</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs capitalize">
                  {complaint.category}
                </Badge>
              </div>

              <Button variant="outline" size="sm" onClick={() => setSelectedComplaint(complaint)} className="w-full">
                Manage Complaint
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Complaint Management Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Manage Complaint</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">{selectedComplaint.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{selectedComplaint.description}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium">Student</Label>
                  <p className="text-sm">{selectedComplaint.studentName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Room</Label>
                  <p className="text-sm">{selectedComplaint.roomNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <p className="text-sm capitalize">{selectedComplaint.category}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Priority</Label>
                  <Badge className={priorityColors[selectedComplaint.priority]}>{selectedComplaint.priority}</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Update Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="response">Response (Optional)</Label>
                <Textarea
                  id="response"
                  placeholder="Add a response or update for the student..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleUpdateComplaint} disabled={!newStatus}>
                  Update Complaint
                </Button>
                <Button variant="outline" onClick={() => setSelectedComplaint(null)}>
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
