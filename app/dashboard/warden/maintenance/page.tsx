"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Calendar, Clock, MapPin, Wrench, Download, FileText } from "lucide-react"
import { toast } from "sonner"
import { TableSkeleton } from "@/components/loading-skeleton"
import { EmptyState } from "@/components/error-message"
import { downloadCsv, printHtml } from "@/lib/reports"

interface MaintenanceRequest {
  id: string
  title: string
  description: string
  category: "electrical" | "plumbing" | "carpentry" | "cleaning" | "security" | "other"
  priority: "low" | "medium" | "high" | "urgent"
  status: "pending" | "assigned" | "in-progress" | "completed" | "cancelled"
  location: string
  reportedBy: string
  reportedAt: Date
  estimatedCost?: number
}

const mockRequests: MaintenanceRequest[] = [
  {
    id: "1",
    title: "Water Leak in Block A Bathroom",
    description: "Severe water leakage from ceiling in Block A, 2nd floor bathroom.",
    category: "plumbing",
    priority: "high",
    status: "in-progress",
    location: "Block A, 2nd Floor, Common Bathroom",
    reportedBy: "Amit Kumar",
    reportedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    estimatedCost: 2500
  },
  {
    id: "2",
    title: "Broken Window Lock",
    description: "Window lock mechanism is broken in Room B-205.",
    category: "carpentry",
    priority: "medium",
    status: "assigned",
    location: "Block B, Room B-205",
    reportedBy: "Neha Singh",
    reportedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    estimatedCost: 800
  },
  {
    id: "3",
    title: "Electrical Socket Issue",
    description: "Power socket in Block C common area not working.",
    category: "electrical",
    priority: "medium",
    status: "completed",
    location: "Block C, 1st Floor, Common Area",
    reportedBy: "Rahul Verma",
    reportedAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    estimatedCost: 1200
  }
]

const priorityColors = {
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
}

const statusColors = {
  pending: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  assigned: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "in-progress": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
}

export default function MaintenancePage() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<MaintenanceRequest[]>(mockRequests)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [dateRange, setDateRange] = useState<string>("30d")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650)
    return () => clearTimeout(t)
  }, [])

  if (user?.role !== "warden") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-muted-foreground">Only wardens can access this page.</p>
        </div>
      </div>
    )
  }

  const withinRange = (d: Date) => {
    const now = new Date()
    const days = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 365
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
    return d >= cutoff
  }

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    const matchesPriority = priorityFilter === "all" || request.priority === priorityFilter
    const matchesDate = withinRange(request.reportedAt)
    return matchesSearch && matchesStatus && matchesPriority && matchesDate
  })

  const pendingRequests = requests.filter(r => r.status === "pending")
  const urgentRequests = requests.filter(r => r.priority === "urgent")
  const completedRequests = requests.filter(r => r.status === "completed")

  const handleCreateRequest = (formData: FormData) => {
    const newRequest: MaintenanceRequest = {
      id: Date.now().toString(),
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as any,
      priority: formData.get("priority") as any,
      status: "pending",
      location: formData.get("location") as string,
      reportedBy: user?.fullName || "Warden",
      reportedAt: new Date()
    }

    setRequests([newRequest, ...requests])
    setIsCreateDialogOpen(false)
    toast.success("Maintenance request created successfully!")
  }

  const handleUpdateStatus = (requestId: string, newStatus: string) => {
    setRequests(requests.map(request => 
      request.id === requestId ? { ...request, status: newStatus as any } : request
    ))
    toast.success("Request status updated successfully!")
  }

  const handleExportCsv = () => {
    const rows = filteredRequests.map((r, i) => ({
      index: i + 1,
      id: r.id,
      title: r.title,
      category: r.category,
      priority: r.priority,
      status: r.status,
      location: r.location,
      reportedBy: r.reportedBy,
      reportedAt: r.reportedAt.toISOString(),
      estimatedCost: r.estimatedCost ?? "",
    }))
    downloadCsv(rows, `maintenance-${dateRange}`)
    toast.success("CSV downloaded")
  }

  const handlePrint = () => {
    const html = `
      <h1>Maintenance Requests</h1>
      <table><thead><tr><th>Title</th><th>Priority</th><th>Status</th><th>Location</th><th>Reported</th></tr></thead>
      <tbody>
        ${filteredRequests.map(r => `<tr><td>${r.title}</td><td>${r.priority}</td><td>${r.status}</td><td>${r.location}</td><td>${r.reportedAt.toLocaleDateString()}</td></tr>`).join("")}
      </tbody></table>
    `
    printHtml("Maintenance", html)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Maintenance Requests</h1>
          <p className="text-muted-foreground">
            Manage and track hostel infrastructure maintenance requests
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCsv}>
            <Download className="h-4 w-4 mr-2" /> CSV
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <FileText className="h-4 w-4 mr-2" /> Print
          </Button>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Create Request
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Maintenance Request</DialogTitle>
              <DialogDescription>
                Report a new maintenance issue in the hostel
              </DialogDescription>
            </DialogHeader>
            <form action={handleCreateRequest} className="space-y-4">
              <div>
                <label htmlFor="title" className="text-sm font-medium">Issue Title</label>
                <Input id="title" name="title" required placeholder="Brief description" />
              </div>
              <div>
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Textarea 
                  id="description" 
                  name="description" 
                  required 
                  placeholder="Detailed information"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="text-sm font-medium">Category</label>
                  <Select name="category" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                      <SelectItem value="carpentry">Carpentry</SelectItem>
                      <SelectItem value="cleaning">Cleaning</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="priority" className="text-sm font-medium">Priority</label>
                  <Select name="priority" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label htmlFor="location" className="text-sm font-medium">Location</label>
                <Input id="location" name="location" required placeholder="e.g., Block A, Room 101" />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Request</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <TableSkeleton rows={6} columns={5} />
      ) : (
      <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.length}</div>
            <p className="text-xs text-muted-foreground">
              {pendingRequests.length} pending
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{urgentRequests.length}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Wrench className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedRequests.length}</div>
            <p className="text-xs text-muted-foreground">
              Successfully resolved
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5 days</div>
            <p className="text-xs text-muted-foreground">
              Time to resolution
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="365d">Last 12 months</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <EmptyState title="No requests found" description="Adjust filters or create a new request." />
        ) : filteredRequests.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{request.title}</CardTitle>
                    <Badge className={priorityColors[request.priority]}>
                      {request.priority.toUpperCase()}
                    </Badge>
                    <Badge className={statusColors[request.status]}>
                      {request.status.replace("-", " ").toUpperCase()}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm mb-3">
                    {request.description}
                  </CardDescription>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{request.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Reported: {request.reportedAt.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>By: {request.reportedBy}</span>
                    </div>
                  </div>
                  {request.estimatedCost && (
                    <p className="text-sm text-muted-foreground mt-2">
                      <strong>Estimated Cost:</strong> ₹{request.estimatedCost}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {request.status === "pending" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateStatus(request.id, "assigned")}
                    >
                      Assign
                    </Button>
                  )}
                  {request.status === "assigned" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateStatus(request.id, "in-progress")}
                    >
                      Start Work
                    </Button>
                  )}
                  {request.status === "in-progress" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateStatus(request.id, "completed")}
                    >
                      Mark Complete
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
      </>
      )}
    </div>
  )
}
