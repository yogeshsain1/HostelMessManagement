import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

const UpdateProfileSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  phone: z.string().optional(),
  hostel: z.string().optional(),
  room: z.string().optional(),
})

// GET /api/users/profile - Get current user profile
export async function GET(request: NextRequest) {
  try {
    // In production, extract userId from JWT token
    // For now, use query parameter or default
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'demo-user-id'

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        hostel: true,
        room: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// PUT /api/users/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const json = await request.json().catch(() => ({}))
    const parse = UpdateProfileSchema.safeParse(json)
    if (!parse.success) {
      return NextResponse.json(
        { error: 'Invalid profile data', details: parse.error.format() },
        { status: 400 }
      )
    }

    // In production, extract userId from JWT token
    const userId = json.userId || 'demo-user-id'

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: parse.data,
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        hostel: true,
        room: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error: any) {
    console.error('Update profile error:', error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
