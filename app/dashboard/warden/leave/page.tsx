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
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Search,
  Filter,
  Eye,
  Phone,
  Mail,
  Building,
  User,
  MapPin,
  CalendarDays
} from "lucide-react"
import { toast } from "sonner"

// Mock data for warden leave requests
const mockLeaveRequests = [
  {
    id: "1",
    studentName: "Rahul Kumar",
    studentEmail: "rahul@poornima.edu.in",
    studentPhone: "+91-9876543212",
    roomNumber: "A-101",
    leaveType: "personal",
    reason: "Family function at home, need to attend important ceremony",
    startDate: "2024-01-20",
    endDate: "2024-01-22",
    duration: "3 days",
    status: "pending",
    submittedAt: "2024-01-15T10:30:00Z",
    emergencyContact: "+91-9876543210",
    emergencyRelation: "Father"
  },
  {
    id: "2",
    studentName: "Priya Sharma",
    studentEmail: "priya@poornima.edu.in",
    studentPhone: "+91-9876543213",
    roomNumber: "B-205",
    leaveType: "medical",
    reason: "Dental appointment and treatment, doctor recommended rest",
    startDate: "2024-01-18",
    endDate: "2024-01-19",
    duration: "2 days",
    status: "approved",
    submittedAt: "2024-01-14T08:15:00Z",
    approvedAt: "2024-01-15T09:00:00Z",
    approvedBy: "Warden Sharma",
    emergencyContact: "+91-9876543211",
    emergencyRelation: "Mother"
  },
  {
    id: "3",
    studentName: "Amit Patel",
    studentEmail: "amit@poornima.edu.in",
    studentPhone: "+91-9876543214",
    roomNumber: "C-103",
    leaveType: "academic",
    reason: "Seminar presentation at another university, academic requirement",
    startDate: "2024-01-25",
    endDate: "2024-01-25",
    duration: "1 day",
    status: "rejected",
    submittedAt: "2024-01-13T14:20:00Z",
    rejectedAt: "2024-01-14T16:45:00Z",
    rejectedBy: "Warden Sharma",
    rejectionReason: "Seminar can be attended online, no need for physical absence",
    emergencyContact: "+91-9876543212",
    emergencyRelation: "Guardian"
  },
  {
    id: "4",
    studentName: "Neha Singh",
    studentEmail: "neha@poornima.edu.in",
    studentPhone: "+91-9876543215",
    roomNumber: "A-203",
    leaveType: "personal",
    reason: "Sister's wedding, family event",
    startDate: "2024-01-30",
    endDate: "2024-02-02",
    duration: "4 days",
    status: "pending",
    submittedAt: "2024-01-15T18:45:00Z",
    emergencyContact: "+91-9876543213",
    emergencyRelation: "Sister"
  },
  {
    id: "5",
    studentName: "Vikram Mehta",
    studentEmail: "vikram@poornima.edu.in",
    studentPhone: "+91-9876543216",
    roomNumber: "B-108",
    leaveType: "medical",
    reason: "Eye surgery scheduled, post-operative care required",
    startDate: "2024-01-22",
    endDate: "2024-01-26",
    duration: "5 days",
    status: "in-progress",
    submittedAt: "2024-01-12T12:30:00Z",
    emergencyContact: "+91-9876543214",
    emergencyRelation: "Father"
  }
]

const leaveTypes = [
  { value: "all", label: "All Types", icon: Calendar },
  { value: "personal", label: "Personal", icon: User },
  { value: "medical", label: "Medical", icon: AlertCircle },
  { value: "academic", label: "Academic", icon: Building },
  { value: "emergency", label: "Emergency", icon: AlertCircle }
]

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  "in-progress": "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800"
}

const leaveTypeColors = {
  personal: "bg-blue-100 text-blue-800",
  medical: "bg-red-100 text-red-800",
  academic: "bg-purple-100 text-purple-800",
  emergency: "bg-orange-100 text-orange-800"
}

export default function WardenLeavePage() {
  const { user } = useAuth()
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [isViewingDetails, setIsViewingDetails] = useState(false)
  const [approvalNote, setApprovalNote] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")

  if (!user || user.role !== "warden") {
    return null
  }

  const filteredRequests = mockLeaveRequests.filter(request => {
    const matchesType = selectedType === "all" || request.leaveType === selectedType
    const matchesStatus = selectedStatus === "all" || request.status === selectedStatus
    const matchesSearch = request.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.reason.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesStatus && matchesSearch
  })

  const getStatusCount = (status: string) => {
    return mockLeaveRequests.filter(r => r.status === status).length
  }

  const handleApprove = (requestId: string) => {
    // In a real app, this would make an API call
    toast.success("Leave request approved successfully!")
    setSelectedRequest(null)
    setIsViewingDetails(false)
    setApprovalNote("")
  }

  const handleReject = (requestId: string) => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection")
      return
    }
    // In a real app, this would make an API call
    toast.success("Leave request rejected successfully!")
    setSelectedRequest(null)
    setIsViewingDetails(false)
    setRejectionReason("")
  }

  const handleViewDetails = (request: any) => {
    setSelectedRequest(request)
    setIsViewingDetails(true)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Leave Requests Management</h1>
            <p className="text-muted-foreground">
              Review and manage student leave requests for your hostel
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button className="w-full sm:w-auto">
              <Calendar className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockLeaveRequests.length}</div>
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
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{getStatusCount("approved")}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{getStatusCount("rejected")}</div>
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
                <Label htmlFor="search">Search Requests</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by student name or reason..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="w-full sm:w-48">
                <Label htmlFor="type">Leave Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {leaveTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center space-x-2">
                          <type.icon className="h-4 w-4" />
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full sm:w-48">
                <Label htmlFor="status">Status</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leave Requests List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Leave Requests ({filteredRequests.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-lg">{request.studentName}</h3>
                          <Badge className={leaveTypeColors[request.leaveType as keyof typeof leaveTypeColors]}>
                            {request.leaveType}
                          </Badge>
                        </div>
                        <Badge className={statusColors[request.status as keyof typeof statusColors]}>
                          {request.status}
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground line-clamp-2">
                        {request.reason}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Building className="h-4 w-4" />
                          <span>{request.roomNumber}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CalendarDays className="h-4 w-4" />
                          <span>{request.startDate} - {request.endDate}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{request.duration}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(request)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredRequests.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No leave requests found matching your criteria.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leave Request Details Modal */}
      {isViewingDetails && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Leave Request Details</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsViewingDetails(false)}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Student</Label>
                    <p className="text-sm">{selectedRequest.studentName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Room</Label>
                    <p className="text-sm">{selectedRequest.roomNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Leave Type</Label>
                    <Badge className={leaveTypeColors[selectedRequest.leaveType as keyof typeof leaveTypeColors]}>
                      {selectedRequest.leaveType}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Duration</Label>
                    <p className="text-sm">{selectedRequest.duration}</p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Reason</Label>
                  <p className="text-sm text-muted-foreground">{selectedRequest.reason}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Start Date</Label>
                    <p className="text-sm">{selectedRequest.startDate}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">End Date</Label>
                    <p className="text-sm">{selectedRequest.endDate}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Contact Information</Label>
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4" />
                    <span>{selectedRequest.studentEmail}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4" />
                    <span>{selectedRequest.studentPhone}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Emergency Contact</Label>
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4" />
                    <span>{selectedRequest.emergencyContact}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="h-4 w-4" />
                    <span>{selectedRequest.emergencyRelation}</span>
                  </div>
                </div>
                
                {selectedRequest.status === "pending" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Approval Note (Optional)</Label>
                      <Textarea
                        placeholder="Add any notes or conditions for approval..."
                        value={approvalNote}
                        onChange={(e) => setApprovalNote(e.target.value)}
                        rows={2}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Rejection Reason (Required if rejecting)</Label>
                      <Textarea
                        placeholder="Provide a clear reason for rejection..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                )}
                
                {selectedRequest.status === "approved" && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 text-green-800">
                      <CheckCircle className="h-4 w-4" />
                      <span className="font-medium">Approved by {selectedRequest.approvedBy}</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Approved on {new Date(selectedRequest.approvedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
                
                {selectedRequest.status === "rejected" && (
                  <div className="bg-red-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 text-red-800">
                      <XCircle className="h-4 w-4" />
                      <span className="font-medium">Rejected by {selectedRequest.rejectedBy}</span>
                    </div>
                    <p className="text-sm text-red-700 mt-1">
                      Rejected on {new Date(selectedRequest.rejectedAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-red-700 mt-1">
                      <strong>Reason:</strong> {selectedRequest.rejectionReason}
                    </p>
                  </div>
                )}
              </div>
              
              {selectedRequest.status === "pending" && (
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsViewingDetails(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleReject(selectedRequest.id)}
                    disabled={!rejectionReason.trim()}
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleApprove(selectedRequest.id)}
                  >
                    Approve
                  </Button>
                </div>
              )}
              
              {selectedRequest.status !== "pending" && (
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsViewingDetails(false)}
                  >
                    Close
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
