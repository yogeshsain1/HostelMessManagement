import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Mock hostel data - in production this could come from a separate hostels table
const hostelData = {
  "Block A - Boys Hostel": {
    id: "block-a-boys",
    name: "Block A - Boys Hostel",
    address: "Poornima University Campus, Jaipur, Rajasthan",
    totalRooms: 120,
    warden: {
      id: "warden-1",
      name: "Mr. Rajesh Sharma",
      phone: "+91-9876543211",
      email: "warden1@poornima.edu.in"
    },
    facilities: [
      { name: "WiFi", status: "Available" },
      { name: "Water Supply", status: "24/7" },
      { name: "Power Backup", status: "Available" }
    ],
    rules: [
      "Check-in time: 8:00 PM",
      "Check-out time: 6:00 AM",
      "No smoking or alcohol",
      "Maintain cleanliness",
      "Follow hostel timings"
    ],
    emergencyContacts: [
      { name: "Hostel Office", phone: "+91-141-1234567" },
      { name: "Security", phone: "+91-141-1234568" },
      { name: "Medical", phone: "+91-141-1234569" }
    ]
  },
  "Block B - Girls Hostel": {
    id: "block-b-girls",
    name: "Block B - Girls Hostel",
    address: "Poornima University Campus, Jaipur, Rajasthan",
    totalRooms: 100,
    warden: {
      id: "warden-2",
      name: "Ms. Priya Singh",
      phone: "+91-9876543212",
      email: "warden2@poornima.edu.in"
    },
    facilities: [
      { name: "WiFi", status: "Available" },
      { name: "Water Supply", status: "24/7" },
      { name: "Power Backup", status: "Available" }
    ],
    rules: [
      "Check-in time: 7:00 PM",
      "Check-out time: 6:00 AM",
      "No smoking or alcohol",
      "Maintain cleanliness",
      "Follow hostel timings"
    ],
    emergencyContacts: [
      { name: "Hostel Office", phone: "+91-141-1234567" },
      { name: "Security", phone: "+91-141-1234568" },
      { name: "Medical", phone: "+91-141-1234569" }
    ]
  }
}

// GET /api/hostels - Get hostel info for current user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get user to find their hostel
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { hostel: true, room: true }
    })

    if (!user || !user.hostel) {
      return NextResponse.json(
        { error: 'User hostel information not found' },
        { status: 404 }
      )
    }

    const hostelInfo = hostelData[user.hostel as keyof typeof hostelData]

    if (!hostelInfo) {
      return NextResponse.json(
        { error: 'Hostel information not available' },
        { status: 404 }
      )
    }

    // Get occupancy count for this hostel
    const occupancyCount = await prisma.user.count({
      where: { hostel: user.hostel }
    })

    const response = {
      ...hostelInfo,
      occupiedRooms: occupancyCount,
      userRoom: user.room
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Get hostel error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hostel information' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}