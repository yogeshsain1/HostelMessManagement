"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, User, CheckCircle, XCircle, Eye } from "lucide-react"

interface ComplaintItem {
  id: string
  title: string
  description: string
  category: "maintenance" | "cleanliness" | "other" | "food" | "security"
  status: "pending" | "in-progress" | "resolved" | "rejected"
  priority: "low" | "medium" | "high" | "urgent"
  studentName: string
  roomNumber: string
  createdAt: string
  studentEmail?: string
  studentPhone?: string
}

interface ComplaintManagementProps {
  complaints: ComplaintItem[]
  onUpdateComplaint: (id: string, status: string, response?: string) => void
}

const priorityColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  "in-progress": "bg-blue-100 text-blue-800",
  resolved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
}

export function ComplaintManagement({ complaints, onUpdateComplaint }: ComplaintManagementProps) {
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintItem | null>(null)
  const [resolutionNote, setResolutionNote] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("pending")

  const handleSave = () => {
    if (!selectedComplaint) return
    onUpdateComplaint(selectedComplaint.id, selectedStatus, resolutionNote)
    setSelectedComplaint(null)
    setResolutionNote("")
  }

  return (
    <div className="space-y-4">
      {complaints.map((complaint) => (
        <Card key={complaint.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base">{complaint.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{complaint.description}</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap justify-end">
                <Badge className={statusColors[complaint.status]}>{complaint.status}</Badge>
                <Badge className={priorityColors[complaint.priority]}>{complaint.priority}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><User className="h-4 w-4" />{complaint.studentName}</div>
              <div className="flex items-center gap-2"><Calendar className="h-4 w-4" />Room {complaint.roomNumber}</div>
              <div className="flex items-center gap-2"><Clock className="h-4 w-4" />{new Date(complaint.createdAt).toLocaleDateString()}</div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedComplaint(complaint)}>
                <Eye className="h-4 w-4 mr-2" />Review
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Review Complaint</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Student</Label>
                  <p className="text-sm">{selectedComplaint.studentName}</p>
                </div>
                <div>
                  <Label>Room</Label>
                  <p className="text-sm">{selectedComplaint.roomNumber}</p>
                </div>
              </div>
              <div>
                <Label>Reason</Label>
                <p className="text-sm text-muted-foreground mt-1">{selectedComplaint.description}</p>
              </div>
              <div>
                <Label>Status</Label>
                <div className="grid gap-2 sm:grid-cols-2 mt-1">
                  <Button variant={selectedStatus === "pending" ? "default" : "outline"} onClick={() => setSelectedStatus("pending")}>Pending</Button>
                  <Button variant={selectedStatus === "in-progress" ? "default" : "outline"} onClick={() => setSelectedStatus("in-progress")}>In Progress</Button>
                  <Button variant={selectedStatus === "resolved" ? "default" : "outline"} onClick={() => setSelectedStatus("resolved")}>Resolved</Button>
                  <Button variant={selectedStatus === "rejected" ? "default" : "outline"} onClick={() => setSelectedStatus("rejected")}>Rejected</Button>
                </div>
              </div>
              <div>
                <Label htmlFor="resolutionNote">Resolution Note</Label>
                <Textarea id="resolutionNote" value={resolutionNote} onChange={(e) => setResolutionNote(e.target.value)} rows={3} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedComplaint(null)}>Cancel</Button>
                <Button onClick={handleSave}>Update Status</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
