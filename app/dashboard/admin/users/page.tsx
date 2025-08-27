"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Users, UserPlus, Search, Mail, Phone, MapPin } from "lucide-react"

const mockUsers = [
  {
    id: "1",
    fullName: "Alice Student",
    email: "alice@hostel.com",
    phone: "+1234567890",
    role: "student",
    hostelName: "Sunrise Hostel",
    roomNumber: "A101",
    status: "active",
    joinedDate: "2024-01-01",
  },
  {
    id: "2",
    fullName: "Bob Student",
    email: "bob@hostel.com",
    phone: "+1234567891",
    role: "student",
    hostelName: "Sunrise Hostel",
    roomNumber: "A102",
    status: "active",
    joinedDate: "2024-01-02",
  },
  {
    id: "3",
    fullName: "John Warden",
    email: "warden1@hostel.com",
    phone: "+1234567892",
    role: "warden",
    hostelName: "Sunrise Hostel",
    roomNumber: null,
    status: "active",
    joinedDate: "2023-12-01",
  },
]

export default function AdminUsersPage() {
  const stats = {
    total: mockUsers.length,
    students: mockUsers.filter((u) => u.role === "student").length,
    wardens: mockUsers.filter((u) => u.role === "warden").length,
    admins: mockUsers.filter((u) => u.role === "admin").length,
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "warden":
        return "bg-blue-100 text-blue-800"
      case "student":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">User Management</h1>
            <p className="text-muted-foreground mt-1">Manage all users in the hostel system.</p>
          </div>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add New User
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-600" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Total Users</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-green-600" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Students</p>
                  <p className="text-2xl font-bold">{stats.students}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-600" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Wardens</p>
                  <p className="text-2xl font-bold">{stats.wardens}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-red-600" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Admins</p>
                  <p className="text-2xl font-bold">{stats.admins}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search users by name, email, or room number..." className="pl-10" />
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <div className="grid gap-4">
          {mockUsers.map((user) => (
            <Card key={user.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {user.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{user.fullName}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-3 w-3" />
                          <span>{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                        {user.roomNumber && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>Room {user.roomNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getRoleBadgeColor(user.role)}>{user.role}</Badge>
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      {user.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
