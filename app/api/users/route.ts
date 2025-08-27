import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthenticatedRequest } from '@/lib/middleware'
import { z } from 'zod'

const updateUserSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().optional(),
  roomNumber: z.string().optional(),
})

// Get current user profile
async function getProfile(req: AuthenticatedRequest) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        hostel: true,
        _count: {
          select: {
            complaints: true,
            leaveRequests: true,
            messAttendance: true,
            notifications: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const { passwordHash, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Update current user profile
async function updateProfile(req: AuthenticatedRequest) {
  try {
    const body = await req.json()
    const validatedData = updateUserSchema.parse(body)

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: validatedData,
      include: {
        hostel: true,
      },
    })

    const { passwordHash, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Update profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get all users (admin only)
async function getAllUsers(req: AuthenticatedRequest) {
  try {
    if (req.user!.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const users = await prisma.user.findMany({
      include: {
        hostel: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Remove password hashes from response
    const usersWithoutPasswords = users.map(({ passwordHash, ...user }) => user)

    return NextResponse.json(usersWithoutPasswords)
  } catch (error) {
    console.error('Get all users error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  const url = new URL(req.url)
  const action = url.searchParams.get('action')

  if (action === 'all') {
    return getAllUsers(req)
  }

  return getProfile(req)
})

export const PUT = withAuth(updateProfile)
