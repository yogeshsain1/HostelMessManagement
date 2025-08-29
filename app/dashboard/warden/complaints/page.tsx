"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  MessageSquare, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  XCircle,
  Search,
  Filter,
  Eye,
  MessageCircle,
  Phone,
  Mail,
  Building,
  Calendar
} from "lucide-react"
import { toast } from "sonner"

// Mock data for warden complaints
const mockComplaints = [
  {
    id: "1",
    studentName: "Rahul Kumar",
    studentEmail: "rahul@poornima.edu.in",
    studentPhone: "+91-9876543212",
    roomNumber: "A-101",
    title: "WiFi connectivity issues in Block A",
    description: "WiFi signal is very weak in my room and the common area. Unable to attend online classes properly.",
    category: "maintenance",
    priority: "high",
    status: "pending",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "2",
    studentName: "Priya Sharma",
    studentEmail: "priya@poornima.edu.in",
    studentPhone: "+91-9876543213",
    roomNumber: "B-205",
    title: "Water supply problem in bathroom",
    description: "No water supply in the bathroom since yesterday morning. Need immediate attention.",
    category: "maintenance",
    priority: "urgent",
    status: "in-progress",
    createdAt: "2024-01-14T08:15:00Z",
    updatedAt: "2024-01-15T09:00:00Z"
  },
  {
    id: "3",
    studentName: "Amit Patel",
    studentEmail: "amit@poornima.edu.in",
    studentPhone: "+91-9876543214",
    roomNumber: "C-103",
    title: "Cleaning schedule not followed",
    description: "Common areas are not being cleaned regularly. Dust accumulation in corridors and staircases.",
    category: "cleanliness",
    priority: "medium",
    status: "resolved",
    createdAt: "2024-01-12T14:20:00Z",
    updatedAt: "2024-01-14T16:45:00Z"
  },
  {
    id: "4",
    studentName: "Neha Singh",
    studentEmail: "neha@poornima.edu.in",
    studentPhone: "+91-9876543215",
    roomNumber: "A-203",
    title: "Security concern - unauthorized entry",
    description: "Saw someone trying to enter the hostel without proper identification. Security staff was not present.",
    category: "security",
    priority: "high",
    status: "pending",
    createdAt: "2024-01-15T18:45:00Z",
    updatedAt: "2024-01-15T18:45:00Z"
  },
  {
    id: "5",
    studentName: "Vikram Mehta",
    studentEmail: "vikram@poornima.edu.in",
    studentPhone: "+91-9876543216",
    roomNumber: "B-108",
    title: "Mess food quality complaint",
    description: "Food quality has deteriorated in the last week. Vegetables are not fresh and taste is poor.",
    category: "food",
    priority: "medium",
    status: "in-progress",
    createdAt: "2024-01-13T12:30:00Z",
    updatedAt: "2024-01-15T11:20:00Z"
  }
]

const complaintCategories = [
  { value: "all", label: "All Categories", icon: MessageSquare },
  { value: "maintenance", label: "Maintenance", icon: Building },
  { value: "cleanliness", label: "Cleanliness", icon: CheckCircle },
  { value: "security", label: "Security", icon: Shield },
  { value: "food", label: "Food", icon: UtensilsCrossed },
  { value: "other", label: "Other", icon: AlertCircle }
]

const priorityColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800"
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  "in-progress": "bg-blue-100 text-blue-800",
  resolved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800"
}

export default function WardenComplaintsPage() {
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null)
  const [isViewingDetails, setIsViewingDetails] = useState(false)
  const [resolutionNote, setResolutionNote] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")

  if (!user || user.role !== "warden") {
    return null
  }

  const filteredComplaints = mockComplaints.filter(complaint => {
    const matchesCategory = selectedCategory === "all" || complaint.category === selectedCategory
    const matchesSearch = complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         complaint.studentName.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getStatusCount = (status: string) => {
    return mockComplaints.filter(c => c.status === status).length
  }

  const handleStatusUpdate = (complaintId: string, newStatus: string) => {
    // In a real app, this would make an API call
    toast.success(`Complaint status updated to ${newStatus}`)
    setSelectedComplaint(null)
    setIsViewingDetails(false)
    setResolutionNote("")
  }

  const handleViewDetails = (complaint: any) => {
    setSelectedComplaint(complaint)
    setSelectedStatus(complaint.status)
    setIsViewingDetails(true)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Complaints Management</h1>
            <p className="text-muted-foreground">
              Manage and resolve student complaints for your hostel
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button className="w-full sm:w-auto">
              <MessageSquare className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockComplaints.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{getStatusCount("pending")}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <AlertCircle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{getStatusCount("in-progress")}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{getStatusCount("resolved")}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters & Search</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Complaints</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by title or student name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="w-full sm:w-48">
                <Label htmlFor="category">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {complaintCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center space-x-2">
                          <category.icon className="h-4 w-4" />
                          <span>{category.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Complaints List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Complaints ({filteredComplaints.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredComplaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-lg">{complaint.title}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge className={priorityColors[complaint.priority as keyof typeof priorityColors]}>
                            {complaint.priority}
                          </Badge>
                          <Badge className={statusColors[complaint.status as keyof typeof statusColors]}>
                            {complaint.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground line-clamp-2">
                        {complaint.description}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Building className="h-4 w-4" />
                          <span>{complaint.roomNumber}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="h-4 w-4" />
                          <span className="capitalize">{complaint.category}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(complaint)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredComplaints.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No complaints found matching your criteria.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Complaint Details Modal */}
      {isViewingDetails && selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Complaint Details</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsViewingDetails(false)}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{selectedComplaint.title}</h3>
                  <p className="text-muted-foreground">{selectedComplaint.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
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
                    <Badge className={priorityColors[selectedComplaint.priority as keyof typeof priorityColors]}>
                      {selectedComplaint.priority}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Contact Information</Label>
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4" />
                    <span>{selectedComplaint.studentEmail}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4" />
                    <span>{selectedComplaint.studentPhone}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Update Status</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue />
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
                  <Label className="text-sm font-medium">Resolution Note</Label>
                  <Textarea
                    placeholder="Add a note about the resolution or action taken..."
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsViewingDetails(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleStatusUpdate(selectedComplaint.id, selectedStatus)}
                  disabled={selectedStatus === selectedComplaint.status}
                >
                  Update Status
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
