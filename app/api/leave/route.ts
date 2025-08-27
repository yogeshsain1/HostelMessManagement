import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthenticatedRequest } from '@/lib/middleware'
import { z } from 'zod'

const createLeaveSchema = z.object({
  startDate: z.string().transform(str => new Date(str)),
  endDate: z.string().transform(str => new Date(str)),
  reason: z.string().min(10),
})

const updateLeaveSchema = z.object({
  startDate: z.string().transform(str => new Date(str)).optional(),
  endDate: z.string().transform(str => new Date(str)).optional(),
  reason: z.string().min(10).optional(),
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
})

// Get leave requests
async function getLeaveRequests(req: AuthenticatedRequest) {
  try {
    const url = new URL(req.url)
    const status = url.searchParams.get('status')
    const userId = url.searchParams.get('userId')
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')

    const where: any = {}

    if (status) where.status = status
    if (userId) where.userId = userId

    // If user is not admin, only show their own leave requests or requests from their hostel
    if (req.user!.role !== 'admin') {
      if (req.user!.role === 'student') {
        where.userId = req.user!.id
      } else if (req.user!.role === 'warden' && req.user!.hostelId) {
        where.user = {
          hostelId: req.user!.hostelId,
        }
      }
    }

    const [leaveRequests, total] = await Promise.all([
      prisma.leaveRequest.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              roomNumber: true,
              hostel: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          approver: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.leaveRequest.count({ where }),
    ])

    return NextResponse.json({
      leaveRequests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get leave requests error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Create a new leave request
async function createLeaveRequest(req: AuthenticatedRequest) {
  try {
    const body = await req.json()
    const validatedData = createLeaveSchema.parse(body)

    // Validate dates
    if (validatedData.startDate >= validatedData.endDate) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      )
    }

    // Check for overlapping leave requests
    const overlappingLeave = await prisma.leaveRequest.findFirst({
      where: {
        userId: req.user!.id,
        status: {
          in: ['pending', 'approved'],
        },
        OR: [
          {
            AND: [
              { startDate: { lte: validatedData.startDate } },
              { endDate: { gte: validatedData.startDate } },
            ],
          },
          {
            AND: [
              { startDate: { lte: validatedData.endDate } },
              { endDate: { gte: validatedData.endDate } },
            ],
          },
          {
            AND: [
              { startDate: { gte: validatedData.startDate } },
              { endDate: { lte: validatedData.endDate } },
            ],
          },
        ],
      },
    })

    if (overlappingLeave) {
      return NextResponse.json(
        { error: 'You already have a leave request for these dates' },
        { status: 409 }
      )
    }

    const leaveRequest = await prisma.leaveRequest.create({
      data: {
        userId: req.user!.id,
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,
        reason: validatedData.reason,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            roomNumber: true,
            hostel: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(leaveRequest, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create leave request error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Update a leave request
async function updateLeaveRequest(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const validatedData = updateLeaveSchema.parse(body)

    // Check if leave request exists
    const existingLeave = await prisma.leaveRequest.findUnique({
      where: { id: params.id },
    })

    if (!existingLeave) {
      return NextResponse.json(
        { error: 'Leave request not found' },
        { status: 404 }
      )
    }

    // Check permissions
    const canUpdate =
      req.user!.role === 'admin' ||
      (req.user!.role === 'warden' && existingLeave.userId !== req.user!.id) ||
      (req.user!.role === 'student' && existingLeave.userId === req.user!.id && existingLeave.status === 'pending')

    if (!canUpdate) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // If approving/rejecting, set the approver
    const updateData: any = { ...validatedData }
    if (validatedData.status && validatedData.status !== 'pending' && req.user!.role !== 'student') {
      updateData.approvedBy = req.user!.id
    }

    // If student is updating, only allow certain fields
    if (req.user!.role === 'student' && existingLeave.userId === req.user!.id) {
      const allowedFields = ['startDate', 'endDate', 'reason']
      const filteredData: any = {}

      for (const key of allowedFields) {
        if (validatedData[key as keyof typeof validatedData] !== undefined) {
          filteredData[key] = validatedData[key as keyof typeof validatedData]
        }
      }

      if (Object.keys(filteredData).length === 0) {
        return NextResponse.json(
          { error: 'No valid fields to update' },
          { status: 400 }
        )
      }

      Object.assign(updateData, filteredData)
      // Remove status from student updates
      delete updateData.status
    }

    const leaveRequest = await prisma.leaveRequest.update({
      where: { id: params.id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            roomNumber: true,
            hostel: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        approver: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(leaveRequest)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Update leave request error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Delete a leave request (admin only)
async function deleteLeaveRequest(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    if (req.user!.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    await prisma.leaveRequest.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Leave request deleted successfully' })
  } catch (error) {
    if (error instanceof Error && error.message.includes('RecordNotFound')) {
      return NextResponse.json(
        { error: 'Leave request not found' },
        { status: 404 }
      )
    }

    console.error('Delete leave request error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withAuth(getLeaveRequests)

export const POST = withAuth(createLeaveRequest)

export const PUT = withAuth(async (req: AuthenticatedRequest) => {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')

  if (!id) {
    return NextResponse.json(
      { error: 'Leave request ID is required' },
      { status: 400 }
    )
  }

  return updateLeaveRequest(req, { params: { id } })
})

export const DELETE = withAuth(async (req: AuthenticatedRequest) => {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')

  if (!id) {
    return NextResponse.json(
      { error: 'Leave request ID is required' },
      { status: 400 }
    )
  }

  return deleteLeaveRequest(req, { params: { id } })
})
