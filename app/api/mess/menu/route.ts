import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthenticatedRequest } from '@/lib/middleware'
import { z } from 'zod'

const createMenuSchema = z.object({
  date: z.string().transform(str => new Date(str)),
  mealType: z.enum(['breakfast', 'lunch', 'dinner']),
  items: z.array(z.string()).min(1),
})

const updateMenuSchema = z.object({
  items: z.array(z.string()).min(1).optional(),
})

// Get mess menu
async function getMenu(req: AuthenticatedRequest) {
  try {
    const url = new URL(req.url)
    const date = url.searchParams.get('date')
    const mealType = url.searchParams.get('mealType')

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

    const menus = await prisma.messMenu.findMany({
      where,
      orderBy: [
        { date: 'asc' },
        { mealType: 'asc' },
      ],
    })

    // Parse items JSON string back to array for each menu
    const menusWithParsedItems = menus.map(menu => ({
      ...menu,
      items: JSON.parse(menu.items),
    }))

    return NextResponse.json(menusWithParsedItems)
  } catch (error) {
    console.error('Get menu error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Create or update mess menu (admin/warden only)
async function createOrUpdateMenu(req: AuthenticatedRequest) {
  try {
    if (req.user!.role === 'student') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const validatedData = createMenuSchema.parse(body)

    // Check if menu already exists for this date and meal type
    const existingMenu = await prisma.messMenu.findUnique({
      where: {
        date_mealType: {
          date: validatedData.date,
          mealType: validatedData.mealType,
        },
      },
    })

    if (existingMenu) {
      // Update existing menu
      const menu = await prisma.messMenu.update({
        where: {
          date_mealType: {
            date: validatedData.date,
            mealType: validatedData.mealType,
          },
        },
        data: {
          items: JSON.stringify(validatedData.items),
        },
      })

      return NextResponse.json({
        ...menu,
        items: validatedData.items,
      })
    } else {
      // Create new menu
      const menu = await prisma.messMenu.create({
        data: {
          date: validatedData.date,
          mealType: validatedData.mealType,
          items: JSON.stringify(validatedData.items),
        },
      })

      return NextResponse.json({
        ...menu,
        items: validatedData.items,
      }, { status: 201 })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create/update menu error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get today's menu
async function getTodaysMenu() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const menus = await prisma.messMenu.findMany({
      where: {
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
      orderBy: {
        mealType: 'asc',
      },
    })

    // Group by meal type
    const menuByType: any = {}
    menus.forEach(menu => {
      menuByType[menu.mealType] = {
        ...menu,
        items: JSON.parse(menu.items),
      }
    })

    return NextResponse.json(menuByType)
  } catch (error) {
    console.error('Get today\'s menu error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get tomorrow's menu
async function getTomorrowsMenu() {
  try {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    const dayAfter = new Date(tomorrow)
    dayAfter.setDate(dayAfter.getDate() + 1)

    const menus = await prisma.messMenu.findMany({
      where: {
        date: {
          gte: tomorrow,
          lt: dayAfter,
        },
      },
      orderBy: {
        mealType: 'asc',
      },
    })

    // Group by meal type
    const menuByType: any = {}
    menus.forEach(menu => {
      menuByType[menu.mealType] = {
        ...menu,
        items: JSON.parse(menu.items),
      }
    })

    return NextResponse.json(menuByType)
  } catch (error) {
    console.error('Get tomorrow\'s menu error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  const url = new URL(req.url)
  const action = url.searchParams.get('action')

  if (action === 'today') {
    return getTodaysMenu()
  } else if (action === 'tomorrow') {
    return getTomorrowsMenu()
  }

  return getMenu(req)
})

export const POST = withAuth(createOrUpdateMenu)
