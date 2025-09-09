import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

const CreateMessMenuSchema = z.object({
  date: z.string().datetime(),
  mealType: z.string().min(2).max(20),
  items: z.array(z.string()).min(1),
})

const UpdateMessMenuSchema = z.object({
  date: z.string().datetime().optional(),
  mealType: z.string().min(2).max(20).optional(),
  items: z.array(z.string()).min(1).optional(),
})

// GET /api/mess/menu - Get mess menu (with date filtering)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const mealType = searchParams.get('mealType')

    const where: any = {}
    if (date) where.date = new Date(date)
    if (mealType) where.mealType = mealType

    const menuItems = await prisma.messMenu.findMany({
      where,
      orderBy: { date: 'asc' }
    })

    return NextResponse.json(menuItems)
  } catch (error) {
    console.error('Get mess menu error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mess menu' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// POST /api/mess/menu - Create new mess menu item
export async function POST(request: NextRequest) {
  try {
    const json = await request.json().catch(() => ({}))
    const parse = CreateMessMenuSchema.safeParse(json)
    if (!parse.success) {
      return NextResponse.json(
        { error: 'Invalid mess menu data', details: parse.error.format() },
        { status: 400 }
      )
    }

    const { date, mealType, items } = parse.data

    const menuItem = await prisma.messMenu.create({
      data: {
        date: new Date(date),
        mealType,
        items,
      }
    })

    return NextResponse.json(menuItem, { status: 201 })
  } catch (error) {
    console.error('Create mess menu error:', error)
    return NextResponse.json(
      { error: 'Failed to create mess menu item' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
