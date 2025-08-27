import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthenticatedRequest } from '@/lib/middleware'
import { z } from 'zod'

const updatePreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  language: z.string().min(2).max(10).optional(),
  timezone: z.string().optional(),
  notifications: z.record(z.any()).optional(),
  dashboardLayout: z.record(z.any()).optional(),
})

// Get user preferences
async function getPreferences(req: AuthenticatedRequest) {
  try {
    const preferences = await prisma.userPreference.findUnique({
      where: { userId: req.user!.id },
    })

    if (!preferences) {
      // Create default preferences if none exist
      const defaultPreferences = await prisma.userPreference.create({
        data: {
          userId: req.user!.id,
          theme: 'light',
          language: 'en',
          timezone: 'UTC',
          notifications: '{}',
          dashboardLayout: '{}',
        },
      })
      return NextResponse.json(defaultPreferences)
    }

    return NextResponse.json(preferences)
  } catch (error) {
    console.error('Get preferences error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Update user preferences
async function updatePreferences(req: AuthenticatedRequest) {
  try {
    const body = await req.json()
    const validatedData = updatePreferencesSchema.parse(body)

    const updateData: any = {}

    if (validatedData.theme) updateData.theme = validatedData.theme
    if (validatedData.language) updateData.language = validatedData.language
    if (validatedData.timezone) updateData.timezone = validatedData.timezone
    if (validatedData.notifications) updateData.notifications = JSON.stringify(validatedData.notifications)
    if (validatedData.dashboardLayout) updateData.dashboardLayout = JSON.stringify(validatedData.dashboardLayout)

    const preferences = await prisma.userPreference.upsert({
      where: { userId: req.user!.id },
      update: updateData,
      create: {
        userId: req.user!.id,
        theme: validatedData.theme || 'light',
        language: validatedData.language || 'en',
        timezone: validatedData.timezone || 'UTC',
        notifications: validatedData.notifications ? JSON.stringify(validatedData.notifications) : '{}',
        dashboardLayout: validatedData.dashboardLayout ? JSON.stringify(validatedData.dashboardLayout) : '{}',
      },
    })

    return NextResponse.json(preferences)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Update preferences error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Reset preferences to defaults
async function resetPreferences(req: AuthenticatedRequest) {
  try {
    const preferences = await prisma.userPreference.upsert({
      where: { userId: req.user!.id },
      update: {
        theme: 'light',
        language: 'en',
        timezone: 'UTC',
        notifications: '{}',
        dashboardLayout: '{}',
      },
      create: {
        userId: req.user!.id,
        theme: 'light',
        language: 'en',
        timezone: 'UTC',
        notifications: '{}',
        dashboardLayout: '{}',
      },
    })

    return NextResponse.json(preferences)
  } catch (error) {
    console.error('Reset preferences error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withAuth(getPreferences)
export const POST = withAuth(updatePreferences)
export const PUT = withAuth(updatePreferences)

export const DELETE = withAuth(async (req: AuthenticatedRequest) => {
  try {
    await prisma.userPreference.delete({
      where: { userId: req.user!.id },
    })

    return NextResponse.json({ message: 'Preferences deleted successfully' })
  } catch (error) {
    console.error('Delete preferences error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})
