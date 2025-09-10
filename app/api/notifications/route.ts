import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

const CreateNotificationSchema = z.object({
  userId: z.string(),
  title: z.string().min(5).max(200),
  message: z.string().min(10).max(1000),
})

// GET /api/notifications - Get user notifications
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const read = searchParams.get('read')

    // In production, extract userId from JWT token
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const where: any = { userId }
    if (read !== null) where.read = read === 'true'

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(notifications)
  } catch (error) {
    console.error('Get notifications error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// POST /api/notifications - Create new notification
export async function POST(request: NextRequest) {
  try {
    const json = await request.json().catch(() => ({}))
    const parse = CreateNotificationSchema.safeParse(json)
    if (!parse.success) {
      return NextResponse.json(
        { error: 'Invalid notification data', details: parse.error.format() },
        { status: 400 }
      )
    }

    const { userId, title, message } = parse.data

    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
      }
    })

    return NextResponse.json(notification, { status: 201 })
  } catch (error) {
    console.error('Create notification error:', error)
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
