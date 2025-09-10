import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

const CreateFeedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  mealType: z.enum(['BREAKFAST', 'LUNCH', 'DINNER']),
  comment: z.string().max(500).optional(),
  studentId: z.string().optional(), // Will be extracted from auth token
})

// GET /api/mess/feedback - Get all feedback (with filtering)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mealType = searchParams.get('mealType')
    const studentId = searchParams.get('studentId')
    const rating = searchParams.get('rating')

    const where: any = {}
    if (mealType) where.mealType = mealType
    if (studentId) where.studentId = studentId
    if (rating) where.rating = parseInt(rating)

    const feedback = await prisma.feedback.findMany({
      where,
      include: {
        student: {
          select: { id: true, fullName: true, email: true, role: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(feedback)
  } catch (error) {
    console.error('Get feedback error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// POST /api/mess/feedback - Create new feedback
export async function POST(request: NextRequest) {
  try {
    const json = await request.json().catch(() => ({}))
    const parse = CreateFeedbackSchema.safeParse(json)
    if (!parse.success) {
      return NextResponse.json(
        { error: 'Invalid feedback data', details: parse.error.format() },
        { status: 400 }
      )
    }

    const { rating, mealType, comment, studentId } = parse.data

    // In production, extract studentId from JWT token
    const finalStudentId = studentId || 'demo-student-id'

    const feedback = await prisma.feedback.create({
      data: {
        rating,
        mealType,
        comment,
        studentId: finalStudentId,
      },
      include: {
        student: {
          select: { id: true, fullName: true, email: true, role: true }
        }
      }
    })

    return NextResponse.json(feedback, { status: 201 })
  } catch (error) {
    console.error('Create feedback error:', error)
    return NextResponse.json(
      { error: 'Failed to create feedback' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
