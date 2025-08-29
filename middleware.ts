import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check if user is accessing dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    // Basic demo guard: look for lightweight auth cookie set on login
    const hasAuth = request.cookies.get("hostel-auth")?.value === "1"
    if (!hasAuth) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("next", request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
