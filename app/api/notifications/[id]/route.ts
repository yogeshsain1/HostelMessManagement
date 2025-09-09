import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// PUT /api/notifications/[id]/read - Mark notification as read
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const notification = await prisma.notification.update({
      where: { id: params.id },
      data: { read: true }
    })

    return NextResponse.json(notification)
  } catch (error: any) {
    console.error('Mark notification read error:', error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to mark notification as read' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// DELETE /api/notifications/[id] - Delete notification
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.notification.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Notification deleted successfully' })
  } catch (error: any) {
    console.error('Delete notification error:', error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
