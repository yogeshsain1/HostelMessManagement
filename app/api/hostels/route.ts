import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthenticatedRequest } from '@/lib/middleware'
import { z } from 'zod'

const createHostelSchema = z.object({
  name: z.string().min(2),
  totalRooms: z.number().min(1).optional(),
})

const updateHostelSchema = z.object({
  name: z.string().min(2).optional(),
  wardenId: z.string().optional(),
  totalRooms: z.number().min(1).optional(),
})

// Get all hostels
async function getHostels() {
  try {
    const hostels = await prisma.hostel.findMany({
      include: {
        warden: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        _count: {
          select: {
            users: true,
            complaints: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(hostels)
  } catch (error) {
    console.error('Get hostels error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Create a new hostel (admin only)
async function createHostel(req: AuthenticatedRequest) {
  try {
    if (req.user!.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const validatedData = createHostelSchema.parse(body)

    const hostel = await prisma.hostel.create({
      data: validatedData,
      include: {
        warden: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(hostel, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create hostel error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get a specific hostel by ID
async function getHostelById(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    const hostel = await prisma.hostel.findUnique({
      where: { id: params.id },
      include: {
        warden: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        users: {
          select: {
            id: true,
            fullName: true,
            email: true,
            roomNumber: true,
            role: true,
          },
        },
        complaints: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
        _count: {
          select: {
            users: true,
            complaints: true,
          },
        },
      },
    })

    if (!hostel) {
      return NextResponse.json(
        { error: 'Hostel not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(hostel)
  } catch (error) {
    console.error('Get hostel error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Update a hostel (admin only)
async function updateHostel(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    if (req.user!.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const validatedData = updateHostelSchema.parse(body)

    const hostel = await prisma.hostel.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        warden: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(hostel)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    if (error instanceof Error && error.message.includes('RecordNotFound')) {
      return NextResponse.json(
        { error: 'Hostel not found' },
        { status: 404 }
      )
    }

    console.error('Update hostel error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Delete a hostel (admin only)
async function deleteHostel(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    if (req.user!.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    await prisma.hostel.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Hostel deleted successfully' })
  } catch (error) {
    if (error instanceof Error && error.message.includes('RecordNotFound')) {
      return NextResponse.json(
        { error: 'Hostel not found' },
        { status: 404 }
      )
    }

    console.error('Delete hostel error:', error)
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
    return getHostelById(req, { params: { id } })
  }

  return getHostels()
})

export const POST = withAuth(createHostel)

export const PUT = withAuth(async (req: AuthenticatedRequest) => {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')

  if (!id) {
    return NextResponse.json(
      { error: 'Hostel ID is required' },
      { status: 400 }
    )
  }

  return updateHostel(req, { params: { id } })
})

export const DELETE = withAuth(async (req: AuthenticatedRequest) => {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')

  if (!id) {
    return NextResponse.json(
      { error: 'Hostel ID is required' },
      { status: 400 }
    )
  }

  return deleteHostel(req, { params: { id } })
})
