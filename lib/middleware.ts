import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string
    email: string
    fullName: string
    role: string
    hostelId?: string
  }
}

export function withAuth(handler: (req: AuthenticatedRequest, ...args: any[]) => Promise<Response>) {
  return async (req: NextRequest, ...args: any[]) => {
    try {
      const authHeader = req.headers.get('authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'Authorization header missing or invalid' },
          { status: 401 }
        )
      }

      const token = authHeader.substring(7) // Remove 'Bearer ' prefix
      const user = AuthService.verifyToken(token)

      if (!user) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        )
      }

      // Add user to request
      ;(req as AuthenticatedRequest).user = user

      return handler(req as AuthenticatedRequest, ...args)
    } catch (error) {
      console.error('Auth middleware error:', error)
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      )
    }
  }
}
