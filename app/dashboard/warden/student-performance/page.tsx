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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, GraduationCap, Star, Users, Download, FileText } from "lucide-react"
import { toast } from "sonner"
import { DashboardSkeleton } from "@/components/loading-skeleton"
import { EmptyState } from "@/components/error-message"
import { downloadCsv, printHtml } from "@/lib/reports"

interface StudentPerformance {
  id: string
  name: string
  roomNumber: string
  block: string
  year: string
  branch: string
  academicPerformance: {
    cgpa: number
    semester: number
    attendance: number
    subjects: {
      name: string
      grade: string
      marks: number
    }[]
  }
  behavioralPerformance: {
    overall: "excellent" | "good" | "average" | "poor"
    punctuality: number
    discipline: number
    participation: number
    incidents: {
      type: "warning" | "violation" | "achievement"
      description: string
      date: Date
      severity: "low" | "medium" | "high"
    }[]
  }
  messPerformance: {
    attendance: number
    punctuality: number
    cleanliness: number
    feedback: string[]
  }
  hostelPerformance: {
    roomMaintenance: number
    ruleCompliance: number
    communityParticipation: number
    lastInspection: Date
  }
  lastUpdated: Date
}

const mockStudents: StudentPerformance[] = [
  {
    id: "1",
    name: "Amit Kumar",
    roomNumber: "A-101",
    block: "A",
    year: "3rd Year",
    branch: "Computer Science",
    academicPerformance: {
      cgpa: 8.5,
      semester: 5,
      attendance: 85,
      subjects: [
        { name: "Data Structures", grade: "A", marks: 85 },
        { name: "Database Systems", grade: "A-", marks: 82 },
        { name: "Computer Networks", grade: "B+", marks: 78 },
        { name: "Software Engineering", grade: "A", marks: 87 }
      ]
    },
    behavioralPerformance: {
      overall: "excellent",
      punctuality: 95,
      discipline: 90,
      participation: 88,
      incidents: [
        {
          type: "achievement",
          description: "Won 1st prize in coding competition",
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          severity: "low"
        }
      ]
    },
    messPerformance: {
      attendance: 90,
      punctuality: 95,
      cleanliness: 88,
      feedback: ["Good behavior", "Punctual"]
    },
    hostelPerformance: {
      roomMaintenance: 92,
      ruleCompliance: 95,
      communityParticipation: 90,
      lastInspection: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: "2",
    name: "Neha Singh",
    roomNumber: "B-205",
    block: "B",
    year: "2nd Year",
    branch: "Electrical Engineering",
    academicPerformance: {
      cgpa: 7.8,
      semester: 3,
      attendance: 78,
      subjects: [
        { name: "Circuit Theory", grade: "B+", marks: 78 },
        { name: "Electronics", grade: "B", marks: 75 },
        { name: "Mathematics", grade: "A-", marks: 82 },
        { name: "Physics", grade: "B+", marks: 79 }
      ]
    },
    behavioralPerformance: {
      overall: "good",
      punctuality: 85,
      discipline: 88,
      participation: 75,
      incidents: [
        {
          type: "warning",
          description: "Late return to hostel (11:30 PM)",
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          severity: "medium"
        }
      ]
    },
    messPerformance: {
      attendance: 85,
      punctuality: 80,
      cleanliness: 85,
      feedback: ["Sometimes late", "Good behavior"]
    },
    hostelPerformance: {
      roomMaintenance: 85,
      ruleCompliance: 88,
      communityParticipation: 75,
      lastInspection: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: "3",
    name: "Rahul Verma",
    roomNumber: "C-301",
    block: "C",
    year: "4th Year",
    branch: "Mechanical Engineering",
    academicPerformance: {
      cgpa: 6.9,
      semester: 7,
      attendance: 65,
      subjects: [
        { name: "Thermodynamics", grade: "C+", marks: 68 },
        { name: "Machine Design", grade: "C", marks: 65 },
        { name: "Manufacturing", grade: "B-", marks: 72 },
        { name: "Project Work", grade: "B", marks: 75 }
      ]
    },
    behavioralPerformance: {
      overall: "average",
      punctuality: 70,
      discipline: 75,
      participation: 65,
      incidents: [
        {
          type: "violation",
          description: "Noise complaint from neighbors",
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          severity: "medium"
        },
        {
          type: "warning",
          description: "Unauthorized guest in room",
          date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          severity: "high"
        }
      ]
    },
    messPerformance: {
      attendance: 70,
      punctuality: 65,
      cleanliness: 70,
      feedback: ["Frequent late arrival", "Needs improvement"]
    },
    hostelPerformance: {
      roomMaintenance: 70,
      ruleCompliance: 75,
      communityParticipation: 60,
      lastInspection: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  }
]

const performanceColors = {
  excellent: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  good: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  average: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  poor: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
}

const severityColors = {
  low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
}

export default function StudentPerformancePage() {
  const { user } = useAuth()
  const [students, setStudents] = useState<StudentPerformance[]>(mockStudents)
  const [selectedStudent, setSelectedStudent] = useState<StudentPerformance | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [yearFilter, setYearFilter] = useState<string>("all")
  const [blockFilter, setBlockFilter] = useState<string>("all")
  const [performanceFilter, setPerformanceFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

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

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.branch.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesYear = yearFilter === "all" || student.year === yearFilter
    const matchesBlock = blockFilter === "all" || student.block === blockFilter
    const matchesPerformance = performanceFilter === "all" || student.behavioralPerformance.overall === performanceFilter
    return matchesSearch && matchesYear && matchesBlock && matchesPerformance
  })

  const excellentStudents = students.filter(s => s.behavioralPerformance.overall === "excellent")
  const goodStudents = students.filter(s => s.behavioralPerformance.overall === "good")
  const averageStudents = students.filter(s => s.behavioralPerformance.overall === "average")
  const poorStudents = students.filter(s => s.behavioralPerformance.overall === "poor")

  const avgCGPA = students.reduce((sum, s) => sum + s.academicPerformance.cgpa, 0) / students.length
  const avgAttendance = students.reduce((sum, s) => sum + s.academicPerformance.attendance, 0) / students.length

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "text-green-600"
    if (grade.startsWith("B")) return "text-blue-600"
    if (grade.startsWith("C")) return "text-yellow-600"
    return "text-red-600"
  }

  const handleExportCsv = () => {
    const rows = filteredStudents.map((s, i) => ({
      index: i + 1,
      id: s.id,
      name: s.name,
      room: s.roomNumber,
      block: s.block,
      year: s.year,
      branch: s.branch,
      cgpa: s.academicPerformance.cgpa,
      attendance: s.academicPerformance.attendance,
      behavior: s.behavioralPerformance.overall,
    }))
    downloadCsv(rows, `students-performance`)
    toast.success("CSV downloaded")
  }

  const handlePrint = () => {
    const html = `
      <h1>Student Performance</h1>
      <table><thead><tr><th>Name</th><th>Block</th><th>Year</th><th>CGPA</th><th>Attendance</th><th>Behavior</th></tr></thead>
      <tbody>
        ${filteredStudents.map(s => `<tr><td>${s.name}</td><td>${s.block}</td><td>${s.year}</td><td>${s.academicPerformance.cgpa}</td><td>${s.academicPerformance.attendance}%</td><td>${s.behavioralPerformance.overall}</td></tr>`).join("")}
      </tbody></table>
    `
    printHtml("Student Performance", html)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Performance</h1>
          <p className="text-muted-foreground">
            Track academic and behavioral performance of hostel residents
          </p>
        </div>
      </div>

      {loading ? (
        <DashboardSkeleton />
      ) : (
      <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">
              Across all blocks
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. CGPA</CardTitle>
            <GraduationCap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{avgCGPA.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Academic performance
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{avgAttendance.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Class attendance
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Excellent Students</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{excellentStudents.length}</div>
            <p className="text-xs text-muted-foreground">
              Top performers
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
                placeholder="Search students or branches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="1st Year">1st Year</SelectItem>
                <SelectItem value="2nd Year">2nd Year</SelectItem>
                <SelectItem value="3rd Year">3rd Year</SelectItem>
                <SelectItem value="4th Year">4th Year</SelectItem>
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
            <Select value={performanceFilter} onValueChange={setPerformanceFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Performance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="average">Average</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <div className="space-y-4">
        {filteredStudents.length === 0 ? (
          <EmptyState title="No students found" description="Adjust filters to see results." />
        ) : filteredStudents.map((student) => (
          <Card key={student.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="" alt={student.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{student.name}</CardTitle>
                      <Badge variant="outline">{student.roomNumber}, Block {student.block}</Badge>
                      <Badge variant="outline">{student.year}</Badge>
                      <Badge variant="outline">{student.branch}</Badge>
                      <Badge className={performanceColors[student.behavioralPerformance.overall]}>
                        {student.behavioralPerformance.overall.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        <span>CGPA: {student.academicPerformance.cgpa}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Attendance: {student.academicPerformance.attendance}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Punctuality: {student.behavioralPerformance.punctuality}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        <span>Discipline: {student.behavioralPerformance.discipline}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedStudent(student)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
      </>
      )}

      {/* Student Details Modal */}
      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedStudent && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={selectedStudent.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {selectedStudent.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {selectedStudent.name}
                </DialogTitle>
                <DialogDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{selectedStudent.roomNumber}, Block {selectedStudent.block}</Badge>
                    <Badge variant="outline">{selectedStudent.year}</Badge>
                    <Badge variant="outline">{selectedStudent.branch}</Badge>
                    <Badge className={performanceColors[selectedStudent.behavioralPerformance.overall]}>
                      {selectedStudent.behavioralPerformance.overall.toUpperCase()}
                    </Badge>
                  </div>
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="academic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="academic">Academic</TabsTrigger>
                  <TabsTrigger value="behavioral">Behavioral</TabsTrigger>
                  <TabsTrigger value="mess">Mess</TabsTrigger>
                  <TabsTrigger value="hostel">Hostel</TabsTrigger>
                </TabsList>

                <TabsContent value="academic" className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">CGPA</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{selectedStudent.academicPerformance.cgpa}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Semester</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{selectedStudent.academicPerformance.semester}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Attendance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">{selectedStudent.academicPerformance.attendance}%</div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Subject Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedStudent.academicPerformance.subjects.map((subject, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                            <span className="font-medium">{subject.name}</span>
                            <div className="flex items-center gap-3">
                              <Badge className={getGradeColor(subject.grade)}>{subject.grade}</Badge>
                              <span className="text-sm text-muted-foreground">{subject.marks}/100</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="behavioral" className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Punctuality</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">{selectedStudent.behavioralPerformance.punctuality}%</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Discipline</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{selectedStudent.behavioralPerformance.discipline}%</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Participation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{selectedStudent.behavioralPerformance.participation}%</div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Incidents & Achievements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedStudent.behavioralPerformance.incidents.length > 0 ? (
                        <div className="space-y-3">
                          {selectedStudent.behavioralPerformance.incidents.map((incident, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                              <div>
                                <div className="flex items-center gap-2">
                                  <Badge variant={incident.type === "achievement" ? "default" : "secondary"}>
                                    {incident.type.toUpperCase()}
                                  </Badge>
                                  <Badge className={severityColors[incident.severity]}>
                                    {incident.severity.toUpperCase()}
                                  </Badge>
                                </div>
                                <p className="text-sm mt-1">{incident.description}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {incident.date.toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-4">No incidents recorded</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="mess" className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Attendance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">{selectedStudent.messPerformance.attendance}%</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Punctuality</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{selectedStudent.messPerformance.punctuality}%</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Cleanliness</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{selectedStudent.messPerformance.cleanliness}%</div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Feedback</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedStudent.messPerformance.feedback.length > 0 ? (
                        <div className="space-y-2">
                          {selectedStudent.messPerformance.feedback.map((feedback, index) => (
                            <div key={index} className="p-2 bg-muted rounded-md">
                              <p className="text-sm">"{feedback}"</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-4">No feedback available</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="hostel" className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Room Maintenance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">{selectedStudent.hostelPerformance.roomMaintenance}%</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Rule Compliance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{selectedStudent.hostelPerformance.ruleCompliance}%</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Community Participation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{selectedStudent.hostelPerformance.communityParticipation}%</div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Last Inspection</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Last inspection was conducted on {selectedStudent.hostelPerformance.lastInspection.toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedStudent(null)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
