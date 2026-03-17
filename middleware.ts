import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Middleware disabled - using client-side authentication with localStorage
  // Client-side auth check happens in dashboard layout component
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
