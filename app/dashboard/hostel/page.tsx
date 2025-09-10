"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Home,
  Users,
  Phone,
  Mail,
  MapPin,
  Building,
  Shield,
  Clock,
  Star,
  Wifi,
  Droplets,
  Zap,
  MessageSquare,
  Calendar,
  UtensilsCrossed,
  User,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface HostelData {
  id: string
  name: string
  address: string
  totalRooms: number
  occupiedRooms: number
  userRoom?: string
  warden: {
    id: string
    name: string
    phone: string
    email: string
  }
  facilities: Array<{
    name: string
    status: string
  }>
  rules: string[]
  emergencyContacts: Array<{
    name: string
    phone: string
  }>
}

export default function HostelPage() {
  const { user } = useAuth()
  const [hostelData, setHostelData] = useState<HostelData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      fetchHostelData()
    }
  }, [user])

  const fetchHostelData = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/hostels?userId=${user?.id}`)
      if (!res.ok) throw new Error("Failed to fetch hostel data")
      const data = await res.json()
      setHostelData(data)
    } catch (error) {
      console.error("Error fetching hostel data:", error)
      toast.error("Failed to load hostel information")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return null
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  if (!hostelData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Hostel information not available</h3>
            <p className="text-muted-foreground">Unable to load your hostel details.</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const occupancyRate = Math.round((hostelData.occupiedRooms / hostelData.totalRooms) * 100)

  const getFacilityIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'wifi':
        return Wifi
      case 'water supply':
        return Droplets
      case 'power backup':
        return Zap
      default:
        return Star
    }
  }

  const getFacilityColor = (name: string) => {
    switch (name.toLowerCase()) {
      case 'wifi':
        return 'text-green-600'
      case 'water supply':
        return 'text-blue-600'
      case 'power backup':
        return 'text-yellow-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Hostel Information</h1>
          <p className="text-muted-foreground">Your hostel details and facilities</p>
        </div>

        {/* Hostel Overview Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Building className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-blue-900">{hostelData.name}</h2>
                  <p className="text-blue-700 flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{hostelData.address}</span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-blue-100 text-blue-800 text-sm px-3 py-1">
                  Room {hostelData.userRoom || user.roomNumber || 'N/A'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Home className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Rooms</p>
                  <p className="text-2xl font-bold">{hostelData.totalRooms}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Occupied</p>
                  <p className="text-2xl font-bold">{hostelData.occupiedRooms}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Occupancy</p>
                  <p className="text-2xl font-bold">{occupancyRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Warden Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Warden Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">
                    {hostelData.warden.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{hostelData.warden.name}</h3>
                    <p className="text-sm text-muted-foreground">Hostel Warden</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{hostelData.warden.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{hostelData.warden.email}</span>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="mt-2">
                    Contact Warden
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Facilities */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center space-x-2">
                <Star className="h-5 w-5" />
                <span>Available Facilities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {hostelData.facilities.map((facility, index) => {
                  const FacilityIcon = getFacilityIcon(facility.name)
                  const colorClass = getFacilityColor(facility.name)
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <FacilityIcon className={`h-5 w-5 ${colorClass}`} />
                        <span className="font-medium">{facility.name}</span>
                      </div>
                      <Badge variant="outline" className="text-green-700 border-green-200">
                        {facility.status}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Hostel Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Hostel Rules</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {hostelData.rules.map((rule, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">{rule}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>Emergency Contacts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {hostelData.emergencyContacts.map((contact, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <h4 className="font-medium">{contact.name}</h4>
                      <p className="text-sm text-muted-foreground">{contact.phone}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Call
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
              <Button
                asChild
                variant="outline"
                className="h-auto p-4 flex-col space-y-2"
              >
                <Link href="/dashboard/complaints/new">
                  <MessageSquare className="h-5 w-5" />
                  <span className="text-sm font-medium">Report Issue</span>
                </Link>
              </Button>
              
              <Button
                asChild
                variant="outline"
                className="h-auto p-4 flex-col space-y-2"
              >
                <Link href="/dashboard/leave/new">
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm font-medium">Request Leave</span>
                </Link>
              </Button>
              
              <Button
                asChild
                variant="outline"
                className="h-auto p-4 flex-col space-y-2"
              >
                <Link href="/dashboard/mess">
                  <UtensilsCrossed className="h-5 w-5" />
                  <span className="text-sm font-medium">Mess Menu</span>
                </Link>
              </Button>
              
              <Button
                asChild
                variant="outline"
                className="h-auto p-4 flex-col space-y-2"
              >
                <Link href="/dashboard/profile">
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">Update Profile</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
