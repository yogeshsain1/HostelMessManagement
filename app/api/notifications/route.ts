import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthenticatedRequest } from '@/lib/middleware'
import { z } from 'zod'

const createNotificationSchema = z.object({
  title: z.string().min(1),
  message: z.string().min(1),
  type: z.enum(['info', 'warning', 'success', 'error']),
  userId: z.string().optional(), // If not provided, it's a broadcast notification
})

// Get notifications
async function getNotifications(req: AuthenticatedRequest) {
  try {
    const url = new URL(req.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const unreadOnly = url.searchParams.get('unreadOnly') === 'true'

    const where: any = {
      read: unreadOnly ? false : undefined,
    }

    // If user is not admin, only show their own notifications
    if (req.user!.role !== 'admin') {
      where.userId = req.user!.id
    }

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notification.count({ where }),
    ])

    return NextResponse.json({
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get notifications error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Create a notification (admin only)
async function createNotification(req: AuthenticatedRequest) {
  try {
    if (req.user!.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const validatedData = createNotificationSchema.parse(body)

    const notification = await prisma.notification.create({
      data: {
        title: validatedData.title,
        message: validatedData.message,
        type: validatedData.type,
        userId: validatedData.userId || undefined,
      },
    })

    return NextResponse.json(notification, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create notification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Mark notification as read
async function markAsRead(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    const notification = await prisma.notification.findUnique({
      where: { id: params.id },
    })

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      )
    }

    // Check if user can access this notification
    const canAccess =
      notification.userId === req.user!.id ||
      req.user!.role === 'admin'

    if (!canAccess) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const updatedNotification = await prisma.notification.update({
      where: { id: params.id },
      data: { read: true },
    })

    return NextResponse.json(updatedNotification)
  } catch (error) {
    console.error('Mark as read error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Mark all notifications as read
async function markAllAsRead(req: AuthenticatedRequest) {
  try {
    const where: any = {
      read: false,
    }

    if (req.user!.role !== 'admin') {
      where.userId = req.user!.id
    }

    await prisma.notification.updateMany({
      where,
      data: { read: true },
    })

    return NextResponse.json({ message: 'All notifications marked as read' })
  } catch (error) {
    console.error('Mark all as read error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Delete a notification (admin only or own notification)
async function deleteNotification(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    const notification = await prisma.notification.findUnique({
      where: { id: params.id },
    })

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      )
    }

    const canDelete =
      req.user!.role === 'admin' ||
      notification.userId === req.user!.id

    if (!canDelete) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    await prisma.notification.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Notification deleted successfully' })
  } catch (error) {
    console.error('Delete notification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get unread count
async function getUnreadCount(req: AuthenticatedRequest) {
  try {
    const where: any = {
      read: false,
    }

    if (req.user!.role !== 'admin') {
      where.userId = req.user!.id
    }

    const count = await prisma.notification.count({ where })

    return NextResponse.json({ count })
  } catch (error) {
    console.error('Get unread count error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withAuth(getNotifications)

export const POST = withAuth(createNotification)

// PUT for marking as read
export const PUT = withAuth(async (req: AuthenticatedRequest) => {
  const url = new URL(req.url)
  const action = url.searchParams.get('action')
  const id = url.searchParams.get('id')

  if (action === 'markAllRead') {
    return markAllAsRead(req)
  } else if (action === 'unreadCount') {
    return getUnreadCount(req)
  } else if (id) {
    return markAsRead(req, { params: { id } })
  } else {
    return NextResponse.json(
      { error: 'Invalid action or missing ID' },
      { status: 400 }
    )
  }
})

export const DELETE = withAuth(async (req: AuthenticatedRequest) => {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')

  if (!id) {
    return NextResponse.json(
      { error: 'Notification ID is required' },
      { status: 400 }
    )
  }

  return deleteNotification(req, { params: { id } })
})
