import { NextResponse } from "next/server"

type SuccessResponse<T> = {
  success: true
  data: T
}

type ErrorResponse = {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
}

export function ok<T>(data: T, init?: ResponseInit) {
  const body: SuccessResponse<T> = { success: true, data }
  return new NextResponse(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json" },
    ...init,
  })
}

export function badRequest(message: string, details?: unknown) {
  const body: ErrorResponse = { success: false, error: { code: "BAD_REQUEST", message, details } }
  return new NextResponse(JSON.stringify(body), {
    status: 400,
    headers: { "content-type": "application/json" },
  })
}

export function unauthorized(message = "Unauthorized") {
  const body: ErrorResponse = { success: false, error: { code: "UNAUTHORIZED", message } }
  return new NextResponse(JSON.stringify(body), {
    status: 401,
    headers: { "content-type": "application/json" },
  })
}

export function serverError(message = "Internal Server Error", details?: unknown) {
  const body: ErrorResponse = { success: false, error: { code: "INTERNAL_ERROR", message, details } }
  return new NextResponse(JSON.stringify(body), {
    status: 500,
    headers: { "content-type": "application/json" },
  })
}


