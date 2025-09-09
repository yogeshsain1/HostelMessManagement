import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

const MarkAttendanceSchema = z.object({
  studentId: z.string(),
  date: z.string().datetime(),
  mealType: z.string().min(2).max(20),
  attended: z.boolean().default(true),
})

// GET /api/mess/attendance - Get attendance records
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const date = searchParams.get('date')
    const mealType = searchParams.get('mealType')

    const where: any = {}
    if (studentId) where.studentId = studentId
    if (date) where.date = new Date(date)
    if (mealType) where.mealType = mealType

    const attendanceRecords = await prisma.attendance.findMany({
      where,
      include: {
        student: {
          select: { id: true, fullName: true, email: true, role: true }
        }
      },
      orderBy: { date: 'desc' }
    })

    return NextResponse.json(attendanceRecords)
  } catch (error) {
    console.error('Get attendance error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attendance records' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// POST /api/mess/attendance - Mark attendance
export async function POST(request: NextRequest) {
  try {
    const json = await request.json().catch(() => ({}))
    const parse = MarkAttendanceSchema.safeParse(json)
    if (!parse.success) {
      return NextResponse.json(
        { error: 'Invalid attendance data', details: parse.error.format() },
        { status: 400 }
      )
    }

    const { studentId, date, mealType, attended } = parse.data

    // Check if attendance already exists for this student, date, and meal
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        studentId,
        date: new Date(date),
        mealType,
      }
    })

    let attendanceRecord

    if (existingAttendance) {
      // Update existing record
      attendanceRecord = await prisma.attendance.update({
        where: { id: existingAttendance.id },
        data: { attended },
        include: {
          student: {
            select: { id: true, fullName: true, email: true, role: true }
          }
        }
      })
    } else {
      // Create new record
      attendanceRecord = await prisma.attendance.create({
        data: {
          studentId,
          date: new Date(date),
          mealType,
          attended,
        },
        include: {
          student: {
            select: { id: true, fullName: true, email: true, role: true }
          }
        }
      })
    }

    return NextResponse.json(attendanceRecord, { status: 201 })
  } catch (error) {
    console.error('Mark attendance error:', error)
    return NextResponse.json(
      { error: 'Failed to mark attendance' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
