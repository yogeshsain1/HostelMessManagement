import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

const CreateLeaveRequestSchema = z.object({
  type: z.string().min(2).max(50),
  reason: z.string().min(10).max(500),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  studentId: z.string().optional(), // Will be extracted from auth token
})

const UpdateLeaveRequestSchema = z.object({
  type: z.string().min(2).max(50).optional(),
  reason: z.string().min(10).max(500).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  approvedBy: z.string().optional(),
})

// GET /api/leave-requests - Get all leave requests (with filtering)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const studentId = searchParams.get('studentId')
    const approvedBy = searchParams.get('approvedBy')

    const where: any = {}
    if (status) where.status = status
    if (studentId) where.studentId = studentId
    if (approvedBy) where.approvedBy = approvedBy

    const leaveRequests = await prisma.leaveRequest.findMany({
      where,
      include: {
        student: {
          select: { id: true, fullName: true, email: true, role: true }
        },
        approvedWarden: {
          select: { id: true, fullName: true, email: true, role: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(leaveRequests)
  } catch (error) {
    console.error('Get leave requests error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leave requests' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// POST /api/leave-requests - Create new leave request
export async function POST(request: NextRequest) {
  try {
    const json = await request.json().catch(() => ({}))
    const parse = CreateLeaveRequestSchema.safeParse(json)
    if (!parse.success) {
      return NextResponse.json(
        { error: 'Invalid leave request data', details: parse.error.format() },
        { status: 400 }
      )
    }

    const { type, reason, startDate, endDate, studentId } = parse.data

    // In production, extract studentId from JWT token
    const finalStudentId = studentId || 'demo-student-id'

    const leaveRequest = await prisma.leaveRequest.create({
      data: {
        type,
        reason,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        studentId: finalStudentId,
      },
      include: {
        student: {
          select: { id: true, fullName: true, email: true, role: true }
        }
      }
    })

    return NextResponse.json(leaveRequest, { status: 201 })
  } catch (error) {
    console.error('Create leave request error:', error)
    return NextResponse.json(
      { error: 'Failed to create leave request' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
