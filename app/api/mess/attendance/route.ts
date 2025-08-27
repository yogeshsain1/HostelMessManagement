import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthenticatedRequest } from '@/lib/middleware'
import { z } from 'zod'

const checkInSchema = z.object({
  mealType: z.enum(['breakfast', 'lunch', 'dinner']),
  date: z.string().transform(str => new Date(str)).optional(),
})

// Check-in for mess attendance
async function checkInAttendance(req: AuthenticatedRequest) {
  try {
    const body = await req.json()
    const { mealType, date } = checkInSchema.parse(body)

    const attendanceDate = date || new Date()
    attendanceDate.setHours(0, 0, 0, 0)

    // Check if user already checked in for this meal today
    const existingAttendance = await prisma.messAttendance.findUnique({
      where: {
        userId_date_mealType: {
          userId: req.user!.id,
          date: attendanceDate,
          mealType: mealType,
        },
      },
    })

    if (existingAttendance) {
      return NextResponse.json(
        { error: 'Already checked in for this meal today' },
        { status: 409 }
      )
    }

    // Create new attendance record
    const attendance = await prisma.messAttendance.create({
      data: {
        userId: req.user!.id,
        date: attendanceDate,
        mealType: mealType,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            roomNumber: true,
          },
        },
      },
    })

    return NextResponse.json(attendance, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Check-in error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get attendance records
async function getAttendance(req: AuthenticatedRequest) {
  try {
    const url = new URL(req.url)
    const date = url.searchParams.get('date')
    const mealType = url.searchParams.get('mealType')
    const userId = url.searchParams.get('userId')
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '50')

    const where: any = {}

    if (date) {
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      where.date = {
        gte: startOfDay,
        lte: endOfDay,
      }
    }

    if (mealType) {
      where.mealType = mealType
    }

    if (userId) {
      where.userId = userId
    }

    // If user is not admin, only show their own attendance or attendance from their hostel
    if (req.user!.role !== 'admin') {
      if (req.user!.role === 'student') {
        where.userId = req.user!.id
      } else if (req.user!.role === 'warden' && req.user!.hostelId) {
        where.user = {
          hostelId: req.user!.hostelId,
        }
      }
    }

    const [attendance, total] = await Promise.all([
      prisma.messAttendance.findMany({
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
        },
        orderBy: {
          checkedInAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.messAttendance.count({ where }),
    ])

    return NextResponse.json({
      attendance,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get attendance error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get attendance statistics
async function getAttendanceStats(req: AuthenticatedRequest) {
  try {
    const url = new URL(req.url)
    const date = url.searchParams.get('date')

    let dateFilter = {}
    if (date) {
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      dateFilter = {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      }
    }

    // Get attendance counts by meal type
    const [breakfastCount, lunchCount, dinnerCount, totalUsers] = await Promise.all([
      prisma.messAttendance.count({
        where: {
          ...dateFilter,
          mealType: 'breakfast',
        },
      }),
      prisma.messAttendance.count({
        where: {
          ...dateFilter,
          mealType: 'lunch',
        },
      }),
      prisma.messAttendance.count({
        where: {
          ...dateFilter,
          mealType: 'dinner',
        },
      }),
      prisma.user.count({
        where: req.user!.role !== 'admin' && req.user!.hostelId ? {
          hostelId: req.user!.hostelId,
        } : {},
      }),
    ])

    const totalAttendance = breakfastCount + lunchCount + dinnerCount
    const attendanceRate = totalUsers > 0 ? (totalAttendance / totalUsers) * 100 : 0

    return NextResponse.json({
      totalAttendance,
      attendanceRate: Math.round(attendanceRate * 100) / 100,
      byMealType: {
        breakfast: breakfastCount,
        lunch: lunchCount,
        dinner: dinnerCount,
      },
      totalUsers,
    })
  } catch (error) {
    console.error('Get attendance stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  const url = new URL(req.url)
  const action = url.searchParams.get('action')

  if (action === 'stats') {
    return getAttendanceStats(req)
  }

  return getAttendance(req)
})

export const POST = withAuth(checkInAttendance)
