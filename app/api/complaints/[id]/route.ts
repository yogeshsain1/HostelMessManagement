import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

const UpdateComplaintSchema = z.object({
  title: z.string().min(5).max(200).optional(),
  description: z.string().min(10).max(1000).optional(),
  category: z.string().min(2).max(50).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
  assignedTo: z.string().optional(),
})

// GET /api/complaints/[id] - Get single complaint
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const complaint = await prisma.complaint.findUnique({
      where: { id: params.id },
      include: {
        student: {
          select: { id: true, fullName: true, email: true, role: true }
        },
        assignedWarden: {
          select: { id: true, fullName: true, email: true, role: true }
        }
      }
    })

    if (!complaint) {
      return NextResponse.json(
        { error: 'Complaint not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(complaint)
  } catch (error) {
    console.error('Get complaint error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch complaint' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// PUT /api/complaints/[id] - Update complaint
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const json = await request.json().catch(() => ({}))
    const parse = UpdateComplaintSchema.safeParse(json)
    if (!parse.success) {
      return NextResponse.json(
        { error: 'Invalid update data', details: parse.error.format() },
        { status: 400 }
      )
    }

    const updateData: any = parse.data

    // If status is being updated to RESOLVED, set resolvedAt
    if (updateData.status === 'RESOLVED') {
      updateData.resolvedAt = new Date()
    }

    const complaint = await prisma.complaint.update({
      where: { id: params.id },
      data: updateData,
      include: {
        student: {
          select: { id: true, fullName: true, email: true, role: true }
        },
        assignedWarden: {
          select: { id: true, fullName: true, email: true, role: true }
        }
      }
    })

    return NextResponse.json(complaint)
  } catch (error: any) {
    console.error('Update complaint error:', error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Complaint not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update complaint' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// DELETE /api/complaints/[id] - Delete complaint
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.complaint.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Complaint deleted successfully' })
  } catch (error: any) {
    console.error('Delete complaint error:', error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Complaint not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to delete complaint' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
