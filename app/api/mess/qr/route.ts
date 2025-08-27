import { NextRequest, NextResponse } from 'next/server'
import { withAuth, AuthenticatedRequest } from '@/lib/middleware'
import QRCode from 'qrcode'
import { z } from 'zod'

const generateQRSchema = z.object({
  mealType: z.enum(['breakfast', 'lunch', 'dinner']),
  date: z.string().transform(str => new Date(str)).optional(),
  size: z.number().min(100).max(1000).optional(),
})

// Generate QR code for attendance
async function generateQR(req: AuthenticatedRequest) {
  try {
    if (req.user!.role === 'student') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { mealType, date, size = 256 } = generateQRSchema.parse(body)

    const qrDate = date || new Date()
    qrDate.setHours(0, 0, 0, 0)

    // Create QR code data
    const qrData = JSON.stringify({
      type: 'mess_attendance',
      mealType,
      date: qrDate.toISOString(),
      hostelId: req.user!.hostelId || 'all',
      generatedBy: req.user!.id,
      timestamp: new Date().toISOString(),
    })

    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      width: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })

    return NextResponse.json({
      qrCode: qrCodeDataURL,
      data: qrData,
      mealType,
      date: qrDate.toISOString(),
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Generate QR error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Validate QR code for attendance check-in
async function validateQR(req: AuthenticatedRequest) {
  try {
    const body = await req.json()
    const { qrData } = body

    if (!qrData) {
      return NextResponse.json(
        { error: 'QR data is required' },
        { status: 400 }
      )
    }

    let parsedData
    try {
      parsedData = JSON.parse(qrData)
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid QR code data' },
        { status: 400 }
      )
    }

    // Validate QR data structure
    if (parsedData.type !== 'mess_attendance') {
      return NextResponse.json(
        { error: 'Invalid QR code type' },
        { status: 400 }
      )
    }

    // Check if QR code is expired (more than 24 hours old)
    const qrTimestamp = new Date(parsedData.timestamp)
    const now = new Date()
    const hoursDiff = (now.getTime() - qrTimestamp.getTime()) / (1000 * 60 * 60)

    if (hoursDiff > 24) {
      return NextResponse.json(
        { error: 'QR code has expired' },
        { status: 400 }
      )
    }

    // Check if QR code date matches current date
    const qrDate = new Date(parsedData.date)
    qrDate.setHours(0, 0, 0, 0)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (qrDate.getTime() !== today.getTime()) {
      return NextResponse.json(
        { error: 'QR code is not valid for today' },
        { status: 400 }
      )
    }

    // Check if user has access to this hostel (if hostel-specific QR)
    if (parsedData.hostelId !== 'all' && parsedData.hostelId !== req.user!.hostelId) {
      return NextResponse.json(
        { error: 'QR code is not valid for your hostel' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      valid: true,
      mealType: parsedData.mealType,
      date: parsedData.date,
      hostelId: parsedData.hostelId,
    })
  } catch (error) {
    console.error('Validate QR error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  const url = new URL(req.url)
  const action = url.searchParams.get('action')

  if (action === 'validate') {
    return validateQR(req)
  }

  return generateQR(req)
})
