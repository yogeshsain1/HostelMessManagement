import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

const UpdateLeaveRequestSchema = z.object({
  type: z.string().min(2).max(50).optional(),
  reason: z.string().min(10).max(500).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  approvedBy: z.string().optional(),
})

// GET /api/leave-requests/[id] - Get single leave request
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const leaveRequest = await prisma.leaveRequest.findUnique({
      where: { id: params.id },
      include: {
        student: {
          select: { id: true, fullName: true, email: true, role: true }
        },
        approvedWarden: {
          select: { id: true, fullName: true, email: true, role: true }
        }
      }
    })

    if (!leaveRequest) {
      return NextResponse.json(
        { error: 'Leave request not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(leaveRequest)
  } catch (error) {
    console.error('Get leave request error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leave request' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// PUT /api/leave-requests/[id] - Update leave request
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const json = await request.json().catch(() => ({}))
    const parse = UpdateLeaveRequestSchema.safeParse(json)
    if (!parse.success) {
      return NextResponse.json(
        { error: 'Invalid update data', details: parse.error.format() },
        { status: 400 }
      )
    }

    const updateData: any = parse.data

    // Convert date strings to Date objects
    if (updateData.startDate) updateData.startDate = new Date(updateData.startDate)
    if (updateData.endDate) updateData.endDate = new Date(updateData.endDate)

    const leaveRequest = await prisma.leaveRequest.update({
      where: { id: params.id },
      data: updateData,
      include: {
        student: {
          select: { id: true, fullName: true, email: true, role: true }
        },
        approvedWarden: {
          select: { id: true, fullName: true, email: true, role: true }
        }
      }
    })

    return NextResponse.json(leaveRequest)
  } catch (error: any) {
    console.error('Update leave request error:', error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Leave request not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update leave request' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// DELETE /api/leave-requests/[id] - Delete leave request
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.leaveRequest.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Leave request deleted successfully' })
  } catch (error: any) {
    console.error('Delete leave request error:', error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Leave request not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to delete leave request' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
