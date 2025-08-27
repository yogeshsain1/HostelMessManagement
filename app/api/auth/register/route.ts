import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(2),
  phone: z.string().optional(),
  role: z.enum(['student', 'warden', 'admin']),
  hostelId: z.string().optional(),
  roomNumber: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await AuthService.getUserByEmail(validatedData.email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await AuthService.hashPassword(validatedData.password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        passwordHash: hashedPassword,
        fullName: validatedData.fullName,
        phone: validatedData.phone,
        role: validatedData.role,
        hostelId: validatedData.hostelId,
        roomNumber: validatedData.roomNumber,
      },
      include: {
        hostel: true,
      },
    })

    // Generate JWT token
    const token = AuthService.generateToken({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      hostelId: user.hostelId || undefined,
    })

    // Return user data and token (exclude password)
    const { passwordHash, ...userWithoutPassword } = user
    return NextResponse.json({
      user: userWithoutPassword,
      token,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
