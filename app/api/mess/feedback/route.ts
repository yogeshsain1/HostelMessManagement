import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthenticatedRequest } from '@/lib/middleware'
import { z } from 'zod'

const createFeedbackSchema = z.object({
  date: z.string().transform(str => new Date(str)),
  mealType: z.enum(['breakfast', 'lunch', 'dinner']),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
})

// Submit feedback
async function submitFeedback(req: AuthenticatedRequest) {
  try {
    const body = await req.json()
    const validatedData = createFeedbackSchema.parse(body)

    // Check if user already submitted feedback for this meal
    const existingFeedback = await prisma.messFeedback.findUnique({
      where: {
        userId_date_mealType: {
          userId: req.user!.id,
          date: validatedData.date,
          mealType: validatedData.mealType,
        },
      },
    })

    if (existingFeedback) {
      return NextResponse.json(
        { error: 'Feedback already submitted for this meal' },
        { status: 409 }
      )
    }

    const feedback = await prisma.messFeedback.create({
      data: {
        userId: req.user!.id,
        date: validatedData.date,
        mealType: validatedData.mealType,
        rating: validatedData.rating,
        comment: validatedData.comment,
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

    return NextResponse.json(feedback, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Submit feedback error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get feedback records
async function getFeedback(req: AuthenticatedRequest) {
  try {
    const url = new URL(req.url)
    const date = url.searchParams.get('date')
    const mealType = url.searchParams.get('mealType')
    const userId = url.searchParams.get('userId')
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')

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

    // If user is not admin, only show feedback from their hostel
    if (req.user!.role !== 'admin' && req.user!.hostelId) {
      where.user = {
        hostelId: req.user!.hostelId,
      }
    }

    const [feedback, total] = await Promise.all([
      prisma.messFeedback.findMany({
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
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.messFeedback.count({ where }),
    ])

    return NextResponse.json({
      feedback,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get feedback error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get feedback statistics
async function getFeedbackStats(req: AuthenticatedRequest) {
  try {
    const url = new URL(req.url)
    const date = url.searchParams.get('date')
    const mealType = url.searchParams.get('mealType')

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

    let mealTypeFilter = {}
    if (mealType) {
      mealTypeFilter = { mealType }
    }

    // Get feedback statistics
    const [feedbackList, totalFeedback, averageRating] = await Promise.all([
      prisma.messFeedback.findMany({
        where: {
          ...dateFilter,
          ...mealTypeFilter,
        },
        select: {
          rating: true,
          mealType: true,
        },
      }),
      prisma.messFeedback.count({
        where: {
          ...dateFilter,
          ...mealTypeFilter,
        },
      }),
      prisma.messFeedback.aggregate({
        where: {
          ...dateFilter,
          ...mealTypeFilter,
        },
        _avg: {
          rating: true,
        },
      }),
    ])

    // Calculate rating distribution
    const ratingDistribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    }

    feedbackList.forEach(feedback => {
      ratingDistribution[feedback.rating as keyof typeof ratingDistribution]++
    })

    // Calculate average rating by meal type
    const mealTypeAverages: any = {}
    const mealTypes = ['breakfast', 'lunch', 'dinner']

    for (const type of mealTypes) {
      const mealFeedback = feedbackList.filter(f => f.mealType === type)
      if (mealFeedback.length > 0) {
        const sum = mealFeedback.reduce((acc, f) => acc + f.rating, 0)
        mealTypeAverages[type] = Math.round((sum / mealFeedback.length) * 100) / 100
      } else {
        mealTypeAverages[type] = 0
      }
    }

    return NextResponse.json({
      totalFeedback,
      averageRating: averageRating._avg.rating ? Math.round(averageRating._avg.rating * 100) / 100 : 0,
      ratingDistribution,
      mealTypeAverages,
    })
  } catch (error) {
    console.error('Get feedback stats error:', error)
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
    return getFeedbackStats(req)
  }

  return getFeedback(req)
})

export const POST = withAuth(submitFeedback)
