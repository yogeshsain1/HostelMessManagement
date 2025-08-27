import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthenticatedRequest } from '@/lib/middleware'
import { z } from 'zod'

const createEventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  startDate: z.string().transform(str => new Date(str)),
  endDate: z.string().transform(str => new Date(str)),
  location: z.string().optional(),
  type: z.enum(['general', 'maintenance', 'meeting', 'sports', 'cultural', 'academic', 'emergency']).optional(),
  hostelId: z.string().optional(),
})

const updateEventSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  startDate: z.string().transform(str => new Date(str)).optional(),
  endDate: z.string().transform(str => new Date(str)).optional(),
  location: z.string().optional(),
  type: z.enum(['general', 'maintenance', 'meeting', 'sports', 'cultural', 'academic', 'emergency']).optional(),
  hostelId: z.string().optional(),
})

// Get events
async function getEvents(req: AuthenticatedRequest) {
  try {
    const url = new URL(req.url)
    const startDate = url.searchParams.get('startDate')
    const endDate = url.searchParams.get('endDate')
    const type = url.searchParams.get('type')
    const hostelId = url.searchParams.get('hostelId')
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '50')

    const where: any = {}

    // Date range filter
    if (startDate && endDate) {
      where.startDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    } else if (startDate) {
      where.startDate = {
        gte: new Date(startDate),
      }
    } else if (endDate) {
      where.endDate = {
        lte: new Date(endDate),
      }
    }

    if (type) where.type = type
    if (hostelId) where.hostelId = hostelId

    // If user is not admin, only show events from their hostel or general events
    if (req.user!.role !== 'admin') {
      where.OR = [
        { hostelId: req.user!.hostelId },
        { hostelId: null }, // General events
      ]
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          hostel: {
            select: {
              id: true,
              name: true,
            },
          },
          creator: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
        orderBy: {
          startDate: 'asc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.event.count({ where }),
    ])

    return NextResponse.json({
      events,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get events error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Create a new event
async function createEvent(req: AuthenticatedRequest) {
  try {
    const body = await req.json()
    const validatedData = createEventSchema.parse(body)

    // Validate dates
    if (validatedData.startDate >= validatedData.endDate) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      )
    }

    // Check permissions
    if (req.user!.role !== 'admin' && req.user!.role !== 'warden') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // If warden, they can only create events for their hostel
    if (req.user!.role === 'warden' && req.user!.hostelId) {
      if (validatedData.hostelId && validatedData.hostelId !== req.user!.hostelId) {
        return NextResponse.json(
          { error: 'You can only create events for your own hostel' },
          { status: 403 }
        )
      }
      validatedData.hostelId = req.user!.hostelId
    }

    const event = await prisma.event.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,
        location: validatedData.location,
        type: validatedData.type || 'general',
        hostelId: validatedData.hostelId,
        createdBy: req.user!.id,
      },
      include: {
        hostel: {
          select: {
            id: true,
            name: true,
          },
        },
        creator: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create event error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get a specific event by ID
async function getEventById(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: {
        hostel: {
          select: {
            id: true,
            name: true,
          },
        },
        creator: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Check if user has permission to view this event
    if (req.user!.role !== 'admin' &&
        event.hostelId !== req.user!.hostelId &&
        event.hostelId !== null) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error('Get event error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Update an event
async function updateEvent(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const validatedData = updateEventSchema.parse(body)

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id: params.id },
    })

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Check permissions
    const canUpdate =
      req.user!.role === 'admin' ||
      (req.user!.role === 'warden' && existingEvent.createdBy === req.user!.id) ||
      existingEvent.createdBy === req.user!.id

    if (!canUpdate) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Validate dates if both are provided
    if (validatedData.startDate && validatedData.endDate) {
      if (validatedData.startDate >= validatedData.endDate) {
        return NextResponse.json(
          { error: 'End date must be after start date' },
          { status: 400 }
        )
      }
    }

    const event = await prisma.event.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        hostel: {
          select: {
            id: true,
            name: true,
          },
        },
        creator: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(event)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Update event error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Delete an event
async function deleteEvent(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    // Check if event exists and user has permission
    const existingEvent = await prisma.event.findUnique({
      where: { id: params.id },
    })

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    const canDelete =
      req.user!.role === 'admin' ||
      (req.user!.role === 'warden' && existingEvent.createdBy === req.user!.id) ||
      existingEvent.createdBy === req.user!.id

    if (!canDelete) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    await prisma.event.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Event deleted successfully' })
  } catch (error) {
    console.error('Delete event error:', error)
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
    return getEventById(req, { params: { id } })
  }

  return getEvents(req)
})

export const POST = withAuth(createEvent)

export const PUT = withAuth(async (req: AuthenticatedRequest) => {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')

  if (!id) {
    return NextResponse.json(
      { error: 'Event ID is required' },
      { status: 400 }
    )
  }

  return updateEvent(req, { params: { id } })
})

export const DELETE = withAuth(async (req: AuthenticatedRequest) => {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')

  if (!id) {
    return NextResponse.json(
      { error: 'Event ID is required' },
      { status: 400 }
    )
  }

  return deleteEvent(req, { params: { id } })
})
