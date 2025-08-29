"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Users, 
  Building, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  Search,
  Filter,
  Eye,
  Calendar,
  Home,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react"
import { toast } from "sonner"

// Mock data for warden residents
const mockResidents = [
  {
    id: "1",
    fullName: "Rahul Kumar",
    email: "rahul@poornima.edu.in",
    phone: "+91-9876543212",
    roomNumber: "A-101",
    block: "A",
    floor: "1",
    checkInDate: "2023-08-15",
    status: "active",
    course: "B.Tech Computer Science",
    year: "3rd Year",
    emergencyContact: "+91-9876543210",
    emergencyRelation: "Father",
    complaints: 2,
    leaveRequests: 1,
    lastSeen: "2024-01-15T18:30:00Z"
  },
  {
    id: "2",
    fullName: "Priya Sharma",
    email: "priya@poornima.edu.in",
    phone: "+91-9876543213",
    roomNumber: "B-205",
    block: "B",
    floor: "2",
    checkInDate: "2023-08-20",
    status: "active",
    course: "B.Tech Electronics",
    year: "2nd Year",
    emergencyContact: "+91-9876543211",
    emergencyRelation: "Mother",
    complaints: 1,
    leaveRequests: 2,
    lastSeen: "2024-01-15T19:15:00Z"
  },
  {
    id: "3",
    fullName: "Amit Patel",
    email: "amit@poornima.edu.in",
    phone: "+91-9876543214",
    roomNumber: "C-103",
    block: "C",
    floor: "1",
    checkInDate: "2023-08-18",
    status: "active",
    course: "B.Tech Mechanical",
    year: "4th Year",
    emergencyContact: "+91-9876543212",
    emergencyRelation: "Guardian",
    complaints: 3,
    leaveRequests: 0,
    lastSeen: "2024-01-15T17:45:00Z"
  },
  {
    id: "4",
    fullName: "Neha Singh",
    email: "neha@poornima.edu.in",
    phone: "+91-9876543215",
    roomNumber: "A-203",
    block: "A",
    floor: "2",
    checkInDate: "2023-08-22",
    status: "active",
    course: "B.Tech Civil",
    year: "1st Year",
    emergencyContact: "+91-9876543213",
    emergencyRelation: "Sister",
    complaints: 0,
    leaveRequests: 1,
    lastSeen: "2024-01-15T20:00:00Z"
  },
  {
    id: "5",
    fullName: "Vikram Mehta",
    email: "vikram@poornima.edu.in",
    phone: "+91-9876543216",
    roomNumber: "B-108",
    block: "B",
    floor: "1",
    checkInDate: "2023-08-25",
    status: "active",
    course: "B.Tech IT",
    year: "2nd Year",
    emergencyContact: "+91-9876543214",
    emergencyRelation: "Father",
    complaints: 1,
    leaveRequests: 1,
    lastSeen: "2024-01-15T16:30:00Z"
  },
  {
    id: "6",
    fullName: "Anjali Verma",
    email: "anjali@poornima.edu.in",
    phone: "+91-9876543217",
    roomNumber: "C-205",
    block: "C",
    floor: "2",
    checkInDate: "2023-08-28",
    status: "inactive",
    course: "B.Tech Chemical",
    year: "3rd Year",
    emergencyContact: "+91-9876543215",
    emergencyRelation: "Mother",
    complaints: 0,
    leaveRequests: 0,
    lastSeen: "2024-01-10T14:20:00Z"
  }
]

const blocks = [
  { value: "all", label: "All Blocks", icon: Building },
  { value: "A", label: "Block A", icon: Building },
  { value: "B", label: "Block B", icon: Building },
  { value: "C", label: "Block C", icon: Building }
]

const statusColors = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  suspended: "bg-red-100 text-red-800"
}

const yearColors = {
  "1st Year": "bg-blue-100 text-blue-800",
  "2nd Year": "bg-green-100 text-green-800",
  "3rd Year": "bg-yellow-100 text-yellow-800",
  "4th Year": "bg-purple-100 text-purple-800"
}

export default function WardenResidentsPage() {
  const { user } = useAuth()
  const [selectedBlock, setSelectedBlock] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedResident, setSelectedResident] = useState<any>(null)
  const [isViewingDetails, setIsViewingDetails] = useState(false)

  if (!user || user.role !== "warden") {
    return null
  }

  const filteredResidents = mockResidents.filter(resident => {
    const matchesBlock = selectedBlock === "all" || resident.block === selectedBlock
    const matchesSearch = resident.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resident.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resident.course.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesBlock && matchesSearch
  })

  const getBlockCount = (block: string) => {
    return mockResidents.filter(r => r.block === block).length
  }

  const getStatusCount = (status: string) => {
    return mockResidents.filter(r => r.status === status).length
  }

  const getTotalOccupancy = () => {
    return mockResidents.filter(r => r.status === "active").length
  }

  const getTotalRooms = () => {
    const uniqueRooms = new Set(mockResidents.map(r => r.roomNumber))
    return uniqueRooms.size
  }

  const handleViewDetails = (resident: any) => {
    setSelectedResident(resident)
    setIsViewingDetails(true)
  }

  const handleContactStudent = (resident: any) => {
    toast.success(`Contacting ${resident.fullName} at ${resident.phone}`)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Residents Management</h1>
            <p className="text-muted-foreground">
              Manage and monitor all students living in your hostel
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button className="w-full sm:w-auto">
              <Users className="h-4 w-4 mr-2" />
              Export Directory
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Residents</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockResidents.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Residents</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{getStatusCount("active")}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
              <Home className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{getTotalRooms()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
              <Building className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((getTotalOccupancy() / getTotalRooms()) * 100)}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Block-wise Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Block-wise Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["A", "B", "C"].map((block) => (
                <div key={block} className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">Block {block}</div>
                  <div className="text-sm text-muted-foreground">
                    {getBlockCount(block)} residents
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters & Search</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Residents</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by name, room, or course..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="w-full sm:w-48">
                <Label htmlFor="block">Block</Label>
                <Select value={selectedBlock} onValueChange={setSelectedBlock}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {blocks.map((block) => (
                      <SelectItem key={block.value} value={block.value}>
                        <div className="flex items-center space-x-2">
                          <block.icon className="h-4 w-4" />
                          <span>{block.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Residents List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Residents ({filteredResidents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredResidents.map((resident) => (
                <div
                  key={resident.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={`/api/avatar/${resident.id}`} alt={resident.fullName} />
                        <AvatarFallback className="text-lg">
                          {resident.fullName.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{resident.fullName}</h3>
                            <p className="text-sm text-muted-foreground">{resident.course}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={yearColors[resident.year as keyof typeof yearColors]}>
                              {resident.year}
                            </Badge>
                            <Badge className={statusColors[resident.status as keyof typeof statusColors]}>
                              {resident.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span>{resident.roomNumber}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{resident.phone}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Since {new Date(resident.checkInDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>Last: {new Date(resident.lastSeen).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <AlertCircle className="h-4 w-4 text-orange-500" />
                            <span>{resident.complaints} complaints</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4 text-blue-500" />
                            <span>{resident.leaveRequests} leave requests</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(resident)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleContactStudent(resident)}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredResidents.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No residents found matching your criteria.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resident Details Modal */}
      {isViewingDetails && selectedResident && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Resident Details</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsViewingDetails(false)}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={`/api/avatar/${selectedResident.id}`} alt={selectedResident.fullName} />
                  <AvatarFallback className="text-2xl">
                    {selectedResident.fullName.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h3 className="text-xl font-semibold">{selectedResident.fullName}</h3>
                  <p className="text-muted-foreground">{selectedResident.course}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={yearColors[selectedResident.year as keyof typeof yearColors]}>
                      {selectedResident.year}
                    </Badge>
                    <Badge className={statusColors[selectedResident.status as keyof typeof statusColors]}>
                      {selectedResident.status}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Room Number</Label>
                  <p className="text-sm">{selectedResident.roomNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Block</Label>
                  <p className="text-sm">Block {selectedResident.block}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Floor</Label>
                  <p className="text-sm">{selectedResident.floor}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Check-in Date</Label>
                  <p className="text-sm">{new Date(selectedResident.checkInDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Contact Information</Label>
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4" />
                  <span>{selectedResident.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4" />
                  <span>{selectedResident.phone}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Emergency Contact</Label>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4" />
                  <span>{selectedResident.emergencyContact}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <User className="h-4 w-4" />
                  <span>{selectedResident.emergencyRelation}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 text-blue-800">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-medium">Complaints</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mt-1">
                    {selectedResident.complaints}
                  </div>
                </div>
                
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 text-green-800">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">Leave Requests</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600 mt-1">
                    {selectedResident.leaveRequests}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Last Seen</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedResident.lastSeen).toLocaleString()}
                </p>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsViewingDetails(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => handleContactStudent(selectedResident)}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Student
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
