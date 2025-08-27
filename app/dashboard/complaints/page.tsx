"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ComplaintCard } from "@/components/hostel/complaint-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import Link from "next/link"

const mockComplaints = [
  {
    id: "1",
    title: "Broken AC in Room A101",
    description:
      "The air conditioner in my room is not working properly. It's making loud noises and not cooling effectively.",
    category: "maintenance" as const,
    status: "in-progress" as const,
    priority: "high" as const,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-12",
  },
  {
    id: "2",
    title: "Bathroom Cleaning Issue",
    description:
      "The common bathroom on the 1st floor needs thorough cleaning. There are hygiene issues that need immediate attention.",
    category: "cleanliness" as const,
    status: "pending" as const,
    priority: "medium" as const,
    createdAt: "2024-01-08",
  },
  {
    id: "3",
    title: "WiFi Connection Problems",
    description: "Internet connectivity is very poor in the evening hours. Unable to attend online classes properly.",
    category: "other" as const,
    status: "resolved" as const,
    priority: "medium" as const,
    createdAt: "2024-01-05",
    updatedAt: "2024-01-07",
  },
  {
    id: "4",
    title: "Security Gate Lock",
    description: "The main security gate lock is not working properly. This is a security concern for all residents.",
    category: "security" as const,
    status: "pending" as const,
    priority: "urgent" as const,
    createdAt: "2024-01-12",
  },
]

export default function ComplaintsPage() {
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null)

  const filterComplaints = (status: string) => {
    if (status === "all") return mockComplaints
    return mockComplaints.filter((complaint) => complaint.status === status)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Complaints</h1>
            <p className="text-muted-foreground mt-1">Track and manage your hostel complaints.</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/complaints/new">
              <Plus className="h-4 w-4 mr-2" />
              File New Complaint
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Complaints</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {filterComplaints("all").map((complaint) => (
                <ComplaintCard key={complaint.id} complaint={complaint} onViewDetails={setSelectedComplaint} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {filterComplaints("pending").map((complaint) => (
                <ComplaintCard key={complaint.id} complaint={complaint} onViewDetails={setSelectedComplaint} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="in-progress" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {filterComplaints("in-progress").map((complaint) => (
                <ComplaintCard key={complaint.id} complaint={complaint} onViewDetails={setSelectedComplaint} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resolved" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {filterComplaints("resolved").map((complaint) => (
                <ComplaintCard key={complaint.id} complaint={complaint} onViewDetails={setSelectedComplaint} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {mockComplaints.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <h3 className="text-lg font-medium mb-2">No complaints found</h3>
              <p className="text-muted-foreground mb-4">You haven't filed any complaints yet.</p>
              <Button asChild>
                <Link href="/dashboard/complaints/new">File Your First Complaint</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
