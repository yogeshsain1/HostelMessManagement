"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, Clock, AlertTriangle, User, Building, Calendar } from "lucide-react"

interface Complaint {
  id: string
  title: string
  description: string
  category: string
  status: "pending" | "in-progress" | "resolved"
  priority: "low" | "medium" | "high"
  studentName: string
  roomNumber: string
  createdAt: string
}

interface ComplaintManagementProps {
  complaints: Complaint[]
  onUpdateComplaint: (id: string, status: string, response?: string) => void
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  resolved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
}

const priorityColors: Record<string, string> = {
  low: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
  medium: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
}

const StatusIcon = ({ status }: { status: string }) => {
  if (status === "resolved") return <CheckCircle className="h-4 w-4 text-green-600" />
  if (status === "in-progress") return <Clock className="h-4 w-4 text-blue-600" />
  return <AlertTriangle className="h-4 w-4 text-yellow-600" />
}

export function ComplaintManagement({ complaints, onUpdateComplaint }: ComplaintManagementProps) {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [newStatus, setNewStatus] = useState("")
  const [response, setResponse] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)

  const openDialog = (complaint: Complaint) => {
    setSelectedComplaint(complaint)
    setNewStatus(complaint.status)
    setResponse("")
    setDialogOpen(true)
  }

  const handleUpdate = () => {
    if (selectedComplaint && newStatus) {
      onUpdateComplaint(selectedComplaint.id, newStatus, response)
      setDialogOpen(false)
    }
  }

  return (
    <>
      <div className="space-y-4">
        {complaints.map((complaint) => (
          <Card key={complaint.id} className="transition-all duration-200 hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <StatusIcon status={complaint.status} />
                    <h3 className="font-semibold text-base">{complaint.title}</h3>
                    <Badge className={priorityColors[complaint.priority]}>{complaint.priority}</Badge>
                    <Badge className={statusColors[complaint.status]}>{complaint.status}</Badge>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">{complaint.description}</p>

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" /> {complaint.studentName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building className="h-3 w-3" /> Room {complaint.roomNumber}
                    </span>
                    <span className="flex items-center gap-1 capitalize">
                      <AlertTriangle className="h-3 w-3" /> {complaint.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {complaint.createdAt}
                    </span>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openDialog(complaint)}
                  className="shrink-0"
                >
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Complaint</DialogTitle>
          </DialogHeader>
          {selectedComplaint && (
            <div className="space-y-4 py-2">
              <p className="text-sm font-medium">{selectedComplaint.title}</p>
              <p className="text-sm text-muted-foreground">{selectedComplaint.description}</p>
              <div className="space-y-2">
                <Label>Update Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Response (optional)</Label>
                <Textarea
                  placeholder="Add a response or note..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate}>Update Complaint</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
