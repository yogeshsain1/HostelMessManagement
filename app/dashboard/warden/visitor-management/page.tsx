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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, LogIn, LogOut, MapPin, Phone, Search, User, Users, X } from "lucide-react"
import { toast } from "sonner"

interface Visitor {
  id: string
  name: string
  phone: string
  purpose: string
  visitingStudent: {
    id: string
    name: string
    roomNumber: string
    block: string
  }
  entryTime: Date
  exitTime?: Date
  status: "inside" | "left" | "expired"
  idProof: string
  idNumber: string
  notes?: string
  approvedBy: string
  approvedAt: Date
}

const mockVisitors: Visitor[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    phone: "+91-9876543210",
    purpose: "Family visit - bringing food and clothes",
    visitingStudent: {
      id: "101",
      name: "Amit Kumar",
      roomNumber: "A-101",
      block: "A"
    },
    entryTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: "inside",
    idProof: "Aadhar Card",
    idNumber: "1234-5678-9012",
    notes: "Regular visitor, known to security",
    approvedBy: "Warden Sharma",
    approvedAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000)
  },
  {
    id: "2",
    name: "Priya Singh",
    phone: "+91-9876543211",
    purpose: "Academic consultation",
    visitingStudent: {
      id: "102",
      name: "Neha Singh",
      roomNumber: "B-205",
      block: "B"
    },
    entryTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    exitTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    status: "left",
    idProof: "PAN Card",
    idNumber: "ABCDE1234F",
    notes: "Professor from college",
    approvedBy: "Warden Sharma",
    approvedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000)
  },
  {
    id: "3",
    name: "Dr. Sanjay Verma",
    phone: "+91-9876543212",
    purpose: "Medical checkup",
    visitingStudent: {
      id: "103",
      name: "Rahul Verma",
      roomNumber: "C-301",
      block: "C"
    },
    entryTime: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    status: "inside",
    idProof: "Medical License",
    idNumber: "MED123456",
    notes: "Family doctor, emergency visit",
    approvedBy: "Warden Sharma",
    approvedAt: new Date(Date.now() - 4.5 * 60 * 60 * 1000)
  },
  {
    id: "4",
    name: "Anita Patel",
    phone: "+91-9876543213",
    purpose: "Weekend family visit",
    visitingStudent: {
      id: "104",
      name: "Kavya Patel",
      roomNumber: "A-102",
      block: "A"
    },
    entryTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    exitTime: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    status: "left",
    idProof: "Driving License",
    idNumber: "DL123456789",
    notes: "Mother visiting for weekend",
    approvedBy: "Warden Sharma",
    approvedAt: new Date(Date.now() - 25 * 60 * 60 * 1000)
  }
]

const purposeCategories = [
  "Family visit",
  "Academic consultation",
  "Medical checkup",
  "Official work",
  "Emergency",
  "Other"
]

export default function VisitorManagementPage() {
  const { user } = useAuth()
  const [visitors, setVisitors] = useState<Visitor[]>(mockVisitors)
  const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false)
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [blockFilter, setBlockFilter] = useState<string>("all")

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

  const filteredVisitors = visitors.filter(visitor => {
    const matchesSearch = visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visitor.visitingStudent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visitor.purpose.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || visitor.status === statusFilter
    const matchesBlock = blockFilter === "all" || visitor.visitingStudent.block === blockFilter
    return matchesSearch && matchesStatus && matchesBlock
  })

  const insideVisitors = visitors.filter(visitor => visitor.status === "inside")
  const todayVisitors = visitors.filter(visitor => {
    const today = new Date()
    const visitorDate = new Date(visitor.entryTime)
    return visitorDate.toDateString() === today.toDateString()
  })

  const handleVisitorEntry = (formData: FormData) => {
    const newVisitor: Visitor = {
      id: Date.now().toString(),
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      purpose: formData.get("purpose") as string,
      visitingStudent: {
        id: formData.get("studentId") as string,
        name: formData.get("studentName") as string,
        roomNumber: formData.get("roomNumber") as string,
        block: formData.get("block") as string
      },
      entryTime: new Date(),
      status: "inside",
      idProof: formData.get("idProof") as string,
      idNumber: formData.get("idNumber") as string,
      notes: formData.get("notes") as string,
      approvedBy: user?.fullName || "Warden",
      approvedAt: new Date()
    }

    setVisitors([newVisitor, ...visitors])
    setIsEntryDialogOpen(false)
    toast.success("Visitor entry recorded successfully!")
  }

  const handleVisitorExit = (visitorId: string) => {
    setVisitors(visitors.map(visitor => 
      visitor.id === visitorId 
        ? { ...visitor, exitTime: new Date(), status: "left" as const }
        : visitor
    ))
    toast.success("Visitor exit recorded successfully!")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "inside": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "left": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "expired": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getDuration = (entryTime: Date, exitTime?: Date) => {
    const endTime = exitTime || new Date()
    const diffMs = endTime.getTime() - entryTime.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`
    }
    return `${diffMinutes}m`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Visitor Management</h1>
          <p className="text-muted-foreground">
            Track guest entries, exits, and manage visitor access to the hostel
          </p>
        </div>
        <Dialog open={isEntryDialogOpen} onOpenChange={setIsEntryDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Record Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Record Visitor Entry</DialogTitle>
              <DialogDescription>
                Record a new visitor entering the hostel
              </DialogDescription>
            </DialogHeader>
            <form action={handleVisitorEntry} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="text-sm font-medium">Visitor Name</label>
                  <Input id="name" name="name" required placeholder="Full name" />
                </div>
                <div>
                  <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                  <Input id="phone" name="phone" required placeholder="+91-9876543210" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="studentName" className="text-sm font-medium">Visiting Student</label>
                  <Input id="studentName" name="studentName" required placeholder="Student name" />
                </div>
                <div>
                  <label htmlFor="roomNumber" className="text-sm font-medium">Room Number</label>
                  <Input id="roomNumber" name="roomNumber" required placeholder="A-101" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="block" className="text-sm font-medium">Block</label>
                  <Select name="block" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select block" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Block A</SelectItem>
                      <SelectItem value="B">Block B</SelectItem>
                      <SelectItem value="C">Block C</SelectItem>
                      <SelectItem value="D">Block D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="purpose" className="text-sm font-medium">Purpose</label>
                  <Select name="purpose" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      {purposeCategories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="idProof" className="text-sm font-medium">ID Proof Type</label>
                  <Select name="idProof" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ID proof" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Aadhar Card">Aadhar Card</SelectItem>
                      <SelectItem value="PAN Card">PAN Card</SelectItem>
                      <SelectItem value="Driving License">Driving License</SelectItem>
                      <SelectItem value="Passport">Passport</SelectItem>
                      <SelectItem value="Voter ID">Voter ID</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="idNumber" className="text-sm font-medium">ID Number</label>
                  <Input id="idNumber" name="idNumber" required placeholder="ID number" />
                </div>
              </div>
              <div>
                <label htmlFor="notes" className="text-sm font-medium">Notes</label>
                <Textarea 
                  id="notes" 
                  name="notes" 
                  placeholder="Additional notes about the visitor"
                  rows={3}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEntryDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Record Entry</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors Today</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayVisitors.length}</div>
            <p className="text-xs text-muted-foreground">
              {insideVisitors.length} currently inside
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Currently Inside</CardTitle>
            <LogIn className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{insideVisitors.length}</div>
            <p className="text-xs text-muted-foreground">
              Visitors in hostel
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Left Today</CardTitle>
            <LogOut className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {todayVisitors.filter(v => v.status === "left").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Visitors who left
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Visit Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {visitors.filter(v => v.exitTime).length > 0 
                ? "2h 15m"
                : "N/A"
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Based on completed visits
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
                placeholder="Search visitors, students, or purpose..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="inside">Inside</SelectItem>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Select value={blockFilter} onValueChange={setBlockFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Block" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Blocks</SelectItem>
                <SelectItem value="A">Block A</SelectItem>
                <SelectItem value="B">Block B</SelectItem>
                <SelectItem value="C">Block C</SelectItem>
                <SelectItem value="D">Block D</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Visitors List */}
      <div className="space-y-4">
        {filteredVisitors.map((visitor) => (
          <Card key={visitor.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="" alt={visitor.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {visitor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{visitor.name}</CardTitle>
                      <Badge className={getStatusColor(visitor.status)}>
                        {visitor.status.toUpperCase()}
                      </Badge>
                      {visitor.status === "inside" && (
                        <Badge variant="outline" className="text-green-600">
                          {getDuration(visitor.entryTime)}
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{visitor.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>Visiting: {visitor.visitingStudent.name} (Room {visitor.visitingStudent.roomNumber}, Block {visitor.visitingStudent.block})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Purpose: {visitor.purpose}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Entry: {visitor.entryTime.toLocaleString()}</span>
                      </div>
                    </div>
                    {visitor.notes && (
                      <p className="text-sm text-muted-foreground mt-2">
                        <strong>Notes:</strong> {visitor.notes}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedVisitor(visitor)}
                  >
                    View Details
                  </Button>
                  {visitor.status === "inside" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVisitorExit(visitor.id)}
                      className="text-blue-600"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Record Exit
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Visitor Details Modal */}
      <Dialog open={!!selectedVisitor} onOpenChange={() => setSelectedVisitor(null)}>
        <DialogContent className="max-w-2xl">
          {selectedVisitor && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={selectedVisitor.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {selectedVisitor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {selectedVisitor.name}
                </DialogTitle>
                <DialogDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getStatusColor(selectedVisitor.status)}>
                      {selectedVisitor.status.toUpperCase()}
                    </Badge>
                    {selectedVisitor.status === "inside" && (
                      <Badge variant="outline" className="text-green-600">
                        {getDuration(selectedVisitor.entryTime)}
                      </Badge>
                    )}
                  </div>
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Phone:</span>
                    <p className="text-muted-foreground">{selectedVisitor.phone}</p>
                  </div>
                  <div>
                    <span className="font-medium">Purpose:</span>
                    <p className="text-muted-foreground">{selectedVisitor.purpose}</p>
                  </div>
                  <div>
                    <span className="font-medium">ID Proof:</span>
                    <p className="text-muted-foreground">{selectedVisitor.idProof}</p>
                  </div>
                  <div>
                    <span className="font-medium">ID Number:</span>
                    <p className="text-muted-foreground">{selectedVisitor.idNumber}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Visiting Student Details</h4>
                  <div className="bg-muted p-3 rounded-md">
                    <p><strong>Name:</strong> {selectedVisitor.visitingStudent.name}</p>
                    <p><strong>Room:</strong> {selectedVisitor.visitingStudent.roomNumber}</p>
                    <p><strong>Block:</strong> {selectedVisitor.visitingStudent.block}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Entry Time:</span>
                    <p className="text-muted-foreground">{selectedVisitor.entryTime.toLocaleString()}</p>
                  </div>
                  {selectedVisitor.exitTime && (
                    <div>
                      <span className="font-medium">Exit Time:</span>
                      <p className="text-muted-foreground">{selectedVisitor.exitTime.toLocaleString()}</p>
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Approved By:</span>
                    <p className="text-muted-foreground">{selectedVisitor.approvedBy}</p>
                  </div>
                  <div>
                    <span className="font-medium">Approved At:</span>
                    <p className="text-muted-foreground">{selectedVisitor.approvedAt.toLocaleString()}</p>
                  </div>
                </div>

                {selectedVisitor.notes && (
                  <div>
                    <h4 className="font-medium mb-2">Notes</h4>
                    <p className="text-sm text-muted-foreground">{selectedVisitor.notes}</p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedVisitor(null)}>
                  Close
                </Button>
                {selectedVisitor.status === "inside" && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleVisitorExit(selectedVisitor.id)
                      setSelectedVisitor(null)
                    }}
                    className="text-blue-600"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Record Exit
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
