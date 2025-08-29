"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Bell, Broadcast, Clock, Users, X } from "lucide-react"
import { toast } from "sonner"

interface EmergencyAlert {
  id: string
  title: string
  message: string
  priority: "low" | "medium" | "high" | "critical"
  category: "general" | "safety" | "maintenance" | "academic" | "event"
  status: "active" | "expired" | "cancelled"
  createdAt: Date
  expiresAt: Date
  targetAudience: "all" | "specific-blocks" | "specific-years"
  blocks?: string[]
  years?: string[]
  readCount: number
  totalRecipients: number
}

const mockAlerts: EmergencyAlert[] = [
  {
    id: "1",
    title: "Fire Safety Drill Tomorrow",
    message: "Mandatory fire safety drill will be conducted tomorrow at 10:00 AM. All residents must participate. Meet at the main courtyard.",
    priority: "high",
    category: "safety",
    status: "active",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    targetAudience: "all",
    readCount: 45,
    totalRecipients: 120
  },
  {
    id: "2",
    title: "Water Supply Interruption",
    message: "Water supply will be interrupted in Block A and B from 2:00 PM to 6:00 PM today due to maintenance work. Please store water accordingly.",
    priority: "medium",
    category: "maintenance",
    status: "active",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
    targetAudience: "specific-blocks",
    blocks: ["A", "B"],
    readCount: 32,
    totalRecipients: 60
  },
  {
    id: "3",
    title: "Academic Calendar Update",
    message: "Mid-semester examinations have been rescheduled to next week. Check the notice board for updated schedule.",
    priority: "medium",
    category: "academic",
    status: "active",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    targetAudience: "all",
    readCount: 78,
    totalRecipients: 120
  },
  {
    id: "4",
    title: "Hostel Cultural Night",
    message: "Annual hostel cultural night will be held this Saturday at 7:00 PM. All residents are invited to participate and attend.",
    priority: "low",
    category: "event",
    status: "active",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    targetAudience: "all",
    readCount: 89,
    totalRecipients: 120
  }
]

const priorityColors = {
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
}

const categoryIcons = {
  general: Bell,
  safety: AlertTriangle,
  maintenance: Users,
  academic: Clock,
  event: Broadcast
}

export default function EmergencyAlertsPage() {
  const { user } = useAuth()
  const [alerts, setAlerts] = useState<EmergencyAlert[]>(mockAlerts)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<EmergencyAlert | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  // Redirect if not warden
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

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = priorityFilter === "all" || alert.priority === priorityFilter
    const matchesCategory = categoryFilter === "all" || alert.category === categoryFilter
    return matchesSearch && matchesPriority && matchesCategory
  })

  const activeAlerts = alerts.filter(alert => alert.status === "active")
  const criticalAlerts = activeAlerts.filter(alert => alert.priority === "critical")
  const highPriorityAlerts = activeAlerts.filter(alert => alert.priority === "high")

  const handleCreateAlert = (formData: FormData) => {
    const newAlert: EmergencyAlert = {
      id: Date.now().toString(),
      title: formData.get("title") as string,
      message: formData.get("message") as string,
      priority: formData.get("priority") as "low" | "medium" | "high" | "critical",
      category: formData.get("category") as "general" | "safety" | "maintenance" | "academic" | "event",
      status: "active",
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Default 24 hours
      targetAudience: formData.get("targetAudience") as "all" | "specific-blocks" | "specific-years",
      blocks: formData.get("blocks") ? (formData.get("blocks") as string).split(",").map(b => b.trim()) : undefined,
      years: formData.get("years") ? (formData.get("years") as string).split(",").map(y => y.trim()) : undefined,
      readCount: 0,
      totalRecipients: 120
    }

    setAlerts([newAlert, ...alerts])
    setIsCreateDialogOpen(false)
    toast.success("Emergency alert created successfully!")
  }

  const handleCancelAlert = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, status: "cancelled" as const } : alert
    ))
    toast.success("Alert cancelled successfully!")
  }

  const handleExpireAlert = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, status: "expired" as const } : alert
    ))
    toast.success("Alert marked as expired!")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Emergency Alerts</h1>
          <p className="text-muted-foreground">
            Broadcast important announcements and emergency notifications to hostel residents
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Broadcast className="h-4 w-4" />
              Create Alert
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Emergency Alert</DialogTitle>
              <DialogDescription>
                Create a new emergency alert to notify hostel residents
              </DialogDescription>
            </DialogHeader>
            <form action={handleCreateAlert} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="title" className="text-sm font-medium">Title</label>
                  <Input id="title" name="title" required placeholder="Alert title" />
                </div>
                <div>
                  <label htmlFor="category" className="text-sm font-medium">Category</label>
                  <Select name="category" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="safety">Safety</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="targetAudience" className="text-sm font-medium">Target Audience</label>
                  <Select name="targetAudience" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Residents</SelectItem>
                      <SelectItem value="specific-blocks">Specific Blocks</SelectItem>
                      <SelectItem value="specific-years">Specific Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label htmlFor="message" className="text-sm font-medium">Message</label>
                <Textarea 
                  id="message" 
                  name="message" 
                  required 
                  placeholder="Detailed alert message"
                  rows={4}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Alert</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeAlerts.length} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{highPriorityAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              Important notifications
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Read Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeAlerts.length > 0 
                ? Math.round(activeAlerts.reduce((sum, alert) => sum + (alert.readCount / alert.totalRecipients), 0) / activeAlerts.length * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Of total recipients
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="safety">Safety</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="event">Event</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const CategoryIcon = categoryIcons[alert.category]
          const isExpired = new Date() > alert.expiresAt
          
          return (
            <Card key={alert.id} className={`${isExpired ? 'opacity-75' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${priorityColors[alert.priority]}`}>
                      <CategoryIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{alert.title}</CardTitle>
                        <Badge variant={alert.priority === "critical" ? "destructive" : "secondary"}>
                          {alert.priority.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">{alert.category}</Badge>
                        {alert.status !== "active" && (
                          <Badge variant="outline" className="text-muted-foreground">
                            {alert.status}
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-sm">
                        {alert.message}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedAlert(alert)}
                    >
                      View Details
                    </Button>
                    {alert.status === "active" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelAlert(alert.id)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExpireAlert(alert.id)}
                        >
                          Expire
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span>Created: {alert.createdAt.toLocaleString()}</span>
                    <span>Expires: {alert.expiresAt.toLocaleString()}</span>
                    {alert.targetAudience !== "all" && (
                      <span>
                        Target: {alert.targetAudience === "specific-blocks" 
                          ? `Blocks ${alert.blocks?.join(", ")}`
                          : `Years ${alert.years?.join(", ")}`
                        }
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span>Read: {alert.readCount}/{alert.totalRecipients}</span>
                    <span>{(alert.readCount / alert.totalRecipients * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Alert Details Modal */}
      <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
        <DialogContent className="max-w-2xl">
          {selectedAlert && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className={`p-2 rounded-full ${priorityColors[selectedAlert.priority]}`}>
                    {React.createElement(categoryIcons[selectedAlert.category], { className: "h-4 w-4" })}
                  </div>
                  {selectedAlert.title}
                </DialogTitle>
                <DialogDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={selectedAlert.priority === "critical" ? "destructive" : "secondary"}>
                      {selectedAlert.priority.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">{selectedAlert.category}</Badge>
                    <Badge variant="outline">{selectedAlert.status}</Badge>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Message</h4>
                  <p className="text-sm text-muted-foreground">{selectedAlert.message}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Created:</span>
                    <p className="text-muted-foreground">{selectedAlert.createdAt.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="font-medium">Expires:</span>
                    <p className="text-muted-foreground">{selectedAlert.expiresAt.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="font-medium">Target Audience:</span>
                    <p className="text-muted-foreground">
                      {selectedAlert.targetAudience === "all" ? "All Residents" :
                       selectedAlert.targetAudience === "specific-blocks" ? 
                         `Blocks: ${selectedAlert.blocks?.join(", ")}` :
                         `Years: ${selectedAlert.years?.join(", ")}`
                      }
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Read Rate:</span>
                    <p className="text-muted-foreground">
                      {selectedAlert.readCount}/{selectedAlert.totalRecipients} ({(selectedAlert.readCount / selectedAlert.totalRecipients * 100).toFixed(1)}%)
                    </p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedAlert(null)}>
                  Close
                </Button>
                {selectedAlert.status === "active" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleCancelAlert(selectedAlert.id)
                        setSelectedAlert(null)
                      }}
                    >
                      Cancel Alert
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleExpireAlert(selectedAlert.id)
                        setSelectedAlert(null)
                      }}
                    >
                      Mark as Expired
                    </Button>
                  </>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
