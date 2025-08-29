"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  User, 
  Mail, 
  Phone, 
  Home, 
  Calendar, 
  Shield,
  Edit3,
  Save,
  X,
  CheckCircle
} from "lucide-react"
import { toast } from "sonner"

export default function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState({
    email: user?.email || "",
    phone: user?.phone || ""
  })

  if (!user) {
    return null
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditedUser({
      email: user.email,
      phone: user.phone || ""
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedUser({
      email: user.email,
      phone: user.phone || ""
    })
  }

  const handleSave = () => {
    // In a real app, this would make an API call
    toast.success("Profile updated successfully!")
    setIsEditing(false)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800'
      case 'warden':
        return 'bg-blue-100 text-blue-800'
      case 'student':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-muted-foreground">Manage your account information</p>
          </div>
          {!isEditing && (
            <Button onClick={handleEdit} className="flex items-center space-x-2">
              <Edit3 className="h-4 w-4" />
              <span>Edit Profile</span>
            </Button>
          )}
        </div>

        {/* Profile Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Personal Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder-user.jpg" alt={user.fullName} />
                  <AvatarFallback className="text-2xl">
                    {user.fullName.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h2 className="text-xl font-semibold">{user.fullName}</h2>
                  <Badge className={getRoleColor(user.role)}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                </div>
              </div>

              {/* Information Grid */}
              <div className="flex-1 grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Full Name</span>
                  </Label>
                  <p className="font-medium">{user.fullName}</p>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Student ID</span>
                  </Label>
                  <p className="font-medium">{user.id}</p>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editedUser.email}
                      onChange={(e) => setEditedUser(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email"
                    />
                  ) : (
                    <p className="font-medium">{user.email}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>Phone</span>
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editedUser.phone}
                      onChange={(e) => setEditedUser(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <p className="font-medium">{user.phone || "Not provided"}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
                    <Home className="h-4 w-4" />
                    <span>Hostel</span>
                  </Label>
                  <p className="font-medium">Block A - Boys Hostel</p>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Room Number</span>
                  </Label>
                  <p className="font-medium">{user.roomNumber || "Not assigned"}</p>
                </div>
              </div>
            </div>

            {/* Edit Actions */}
            {isEditing && (
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Security */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Account Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Enable
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <h4 className="font-medium">Password</h4>
                    <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Change
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Profile updated - 2 days ago</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Password changed - 30 days ago</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm">Account created - 3 months ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
