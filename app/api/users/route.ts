import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

const UpdateProfileSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().min(7).max(20).optional(),
  addressLine1: z.string().max(120).optional(),
  addressLine2: z.string().max(120).optional(),
  city: z.string().max(60).optional(),
  state: z.string().max(60).optional(),
  postalCode: z.string().max(20).optional(),
  emergencyContactName: z.string().max(80).optional(),
  emergencyContactPhone: z.string().max(20).optional(),
  course: z.string().max(80).optional(),
  year: z.string().max(20).optional(),
  profileImageUrl: z.string().url().optional(),
})

const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
})

// PATCH /api/users - Update user profile
export async function PATCH(request: NextRequest) {
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

// POST /api/users - Handle user actions (change password, etc.)
export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const action = url.searchParams.get("action")

    if (action === "change-password") {
      const json = await request.json().catch(() => ({}))
      const parse = ChangePasswordSchema.safeParse(json)
      if (!parse.success) {
        return NextResponse.json(
          { error: 'Invalid password data', details: parse.error.format() },
          { status: 400 }
        )
      }

      const { currentPassword, newPassword } = parse.data

      // In production, extract userId from JWT token and verify current password
      const userId = json.userId || 'demo-user-id'

      // For demo purposes, we'll just update the password without verification
      // In production, you should hash the new password and verify the current one
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { password: newPassword }, // Note: This should be hashed in production
        select: { id: true, email: true, fullName: true }
      })

      return NextResponse.json({ success: true, user: updatedUser })
    }

    return NextResponse.json(
      { error: 'Unknown action' },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('User action error:', error)
    return NextResponse.json(
      { error: 'User action failed' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

