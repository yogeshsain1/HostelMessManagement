import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthenticatedRequest } from '@/lib/middleware'
import { z } from 'zod'

const createComplaintSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  category: z.enum(['maintenance', 'cleanliness', 'security', 'food', 'other']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  hostelId: z.string(),
  attachments: z.array(z.string()).optional(), // Array of file URLs
})

const updateComplaintSchema = z.object({
  title: z.string().min(5).optional(),
  description: z.string().min(10).optional(),
  category: z.enum(['maintenance', 'cleanliness', 'security', 'food', 'other']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  status: z.enum(['pending', 'inProgress', 'resolved', 'rejected']).optional(),
  attachments: z.array(z.string()).optional(),
})

// Helper function to parse attachments
function parseAttachments(complaint: any) {
  if (complaint.attachments) {
    try {
      complaint.attachments = JSON.parse(complaint.attachments)
    } catch {
      complaint.attachments = []
    }
  } else {
    complaint.attachments = []
  }
  return complaint
}

// Get all complaints
async function getComplaints(req: AuthenticatedRequest) {
  try {
    const url = new URL(req.url)
    const status = url.searchParams.get('status')
    const category = url.searchParams.get('category')
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')

    const where: any = {}

    if (status) where.status = status
    if (category) where.category = category

    // If user is not admin, only show their own complaints or complaints from their hostel
    if (req.user!.role !== 'admin') {
      if (req.user!.role === 'student') {
        where.userId = req.user!.id
      } else if (req.user!.role === 'warden' && req.user!.hostelId) {
        where.hostelId = req.user!.hostelId
      }
    }

    const [complaints, total] = await Promise.all([
      prisma.complaint.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              roomNumber: true,
            },
          },
          hostel: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.complaint.count({ where }),
    ])

    // Parse attachments for each complaint
    const complaintsWithParsedAttachments = complaints.map(parseAttachments)

    return NextResponse.json({
      complaints: complaintsWithParsedAttachments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get complaints error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Create a new complaint
async function createComplaint(req: AuthenticatedRequest) {
  try {
    const body = await req.json()
    const validatedData = createComplaintSchema.parse(body)

    // Prepare complaint data
    const complaintData: any = {
      title: validatedData.title,
      description: validatedData.description,
      category: validatedData.category,
      priority: validatedData.priority || 'medium',
      hostelId: validatedData.hostelId,
      userId: req.user!.id,
    }

    // Add attachments if provided
    if (validatedData.attachments) {
      complaintData.attachments = JSON.stringify(validatedData.attachments)
    }

    const complaint = await prisma.complaint.create({
      data: complaintData,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            roomNumber: true,
          },
        },
        hostel: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    // Parse attachments before returning
    const complaintWithParsedAttachments = parseAttachments(complaint)

    return NextResponse.json(complaintWithParsedAttachments, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create complaint error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get a specific complaint by ID
async function getComplaintById(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    const complaint = await prisma.complaint.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            roomNumber: true,
          },
        },
        hostel: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!complaint) {
      return NextResponse.json(
        { error: 'Complaint not found' },
        { status: 404 }
      )
    }

    // Check if user has permission to view this complaint
    if (req.user!.role !== 'admin' &&
        complaint.userId !== req.user!.id &&
        (req.user!.role !== 'warden' || complaint.hostelId !== req.user!.hostelId)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Parse attachments before returning
    const complaintWithParsedAttachments = parseAttachments(complaint)

    return NextResponse.json(complaintWithParsedAttachments)
  } catch (error) {
    console.error('Get complaint error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Update a complaint
async function updateComplaint(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const validatedData = updateComplaintSchema.parse(body)

    // Check if complaint exists and user has permission
    const existingComplaint = await prisma.complaint.findUnique({
      where: { id: params.id },
    })

    if (!existingComplaint) {
      return NextResponse.json(
        { error: 'Complaint not found' },
        { status: 404 }
      )
    }

    // Check permissions
    if (req.user!.role !== 'admin' &&
        existingComplaint.userId !== req.user!.id &&
        (req.user!.role !== 'warden' || existingComplaint.hostelId !== req.user!.hostelId)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Students can only update their own complaints and only certain fields
    if (req.user!.role === 'student' && existingComplaint.userId === req.user!.id) {
      const allowedFields = ['title', 'description', 'category', 'attachments']
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

      // Handle attachments
      if (filteredData.attachments) {
        filteredData.attachments = JSON.stringify(filteredData.attachments)
      }

      const complaint = await prisma.complaint.update({
        where: { id: params.id },
        data: filteredData,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              roomNumber: true,
            },
          },
          hostel: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })

      // Parse attachments before returning
      const complaintWithParsedAttachments = parseAttachments(complaint)

      return NextResponse.json(complaintWithParsedAttachments)
    }

    // Handle attachments for non-student updates
    const updateData: any = { ...validatedData }
    if (validatedData.attachments) {
      updateData.attachments = JSON.stringify(validatedData.attachments)
    }

    const complaint = await prisma.complaint.update({
      where: { id: params.id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            roomNumber: true,
          },
        },
        hostel: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    // Parse attachments before returning
    const complaintWithParsedAttachments = parseAttachments(complaint)

    return NextResponse.json(complaintWithParsedAttachments)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Update complaint error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Delete a complaint (admin only)
async function deleteComplaint(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    if (req.user!.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    await prisma.complaint.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Complaint deleted successfully' })
  } catch (error) {
    if (error instanceof Error && error.message.includes('RecordNotFound')) {
      return NextResponse.json(
        { error: 'Complaint not found' },
        { status: 404 }
      )
    }

    console.error('Delete complaint error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')

  if (id) {
    return getComplaintById(req, { params: { id } })
  }

  return getComplaints(req)
})

export const POST = withAuth(createComplaint)

export const PUT = withAuth(async (req: AuthenticatedRequest) => {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')

  if (!id) {
    return NextResponse.json(
      { error: 'Complaint ID is required' },
      { status: 400 }
    )
  }

  return updateComplaint(req, { params: { id } })
})

export const DELETE = withAuth(async (req: AuthenticatedRequest) => {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')

  if (!id) {
    return NextResponse.json(
      { error: 'Complaint ID is required' },
      { status: 400 }
    )
  }

  return deleteComplaint(req, { params: { id } })
})
