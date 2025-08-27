"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Calendar, Users, MessageSquare, UtensilsCrossed, TrendingUp, Clock } from "lucide-react"

const reports = [
  {
    id: "1",
    title: "Monthly Complaint Summary",
    description: "Detailed analysis of all complaints filed in the current month",
    type: "complaints",
    period: "June 2024",
    status: "ready",
    generatedAt: "2024-06-30",
    size: "2.4 MB",
  },
  {
    id: "2",
    title: "Mess Attendance Report",
    description: "Weekly attendance patterns and meal preferences analysis",
    type: "mess",
    period: "Last 4 weeks",
    status: "ready",
    generatedAt: "2024-06-29",
    size: "1.8 MB",
  },
  {
    id: "3",
    title: "Student Satisfaction Survey",
    description: "Quarterly satisfaction metrics and feedback analysis",
    type: "satisfaction",
    period: "Q2 2024",
    status: "generating",
    generatedAt: null,
    size: null,
  },
  {
    id: "4",
    title: "Leave Request Analytics",
    description: "Leave patterns, approval rates, and seasonal trends",
    type: "leave",
    period: "June 2024",
    status: "ready",
    generatedAt: "2024-06-28",
    size: "1.2 MB",
  },
]

const getReportIcon = (type: string) => {
  switch (type) {
    case "complaints":
      return MessageSquare
    case "mess":
      return UtensilsCrossed
    case "satisfaction":
      return TrendingUp
    case "leave":
      return Calendar
    default:
      return FileText
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "ready":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
    case "generating":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
    case "failed":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
  }
}

export default function AdminReportsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Generate and download comprehensive reports for Poornima University hostels.
            </p>
          </div>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Generate New Report
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Total Reports</p>
                  <p className="text-2xl font-bold">{reports.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Download className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Ready to Download</p>
                  <p className="text-2xl font-bold">{reports.filter((r) => r.status === "ready").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium">Generating</p>
                  <p className="text-2xl font-bold">{reports.filter((r) => r.status === "generating").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">This Month</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports List */}
        <div className="grid gap-4">
          {reports.map((report) => {
            const Icon = getReportIcon(report.type)
            return (
              <Card key={report.id} className="transition-all duration-200 hover:scale-[1.01]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{report.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                          <span>Period: {report.period}</span>
                          {report.generatedAt && <span>Generated: {report.generatedAt}</span>}
                          {report.size && <span>Size: {report.size}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                      {report.status === "ready" && (
                        <Button size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      )}
                      {report.status === "generating" && (
                        <Button size="sm" variant="outline" disabled>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </DashboardLayout>
  )
}
