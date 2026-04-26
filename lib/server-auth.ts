import jwt from "jsonwebtoken"
import type { NextRequest } from "next/server"

export type AuthRole = "student" | "warden" | "admin"

export type AuthClaims = {
  userId: string
  email: string
  role: AuthRole
}

const AUTH_COOKIE = "hostel-auth"
const JWT_SECRET = process.env.JWT_SECRET || "dev-change-this-secret"

export function signAuthToken(claims: AuthClaims) {
  return jwt.sign(claims, JWT_SECRET, { expiresIn: "24h" })
}

export function verifyAuthToken(token: string): AuthClaims | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    if (!payload || typeof payload !== "object") return null

    const userId = typeof payload.userId === "string" ? payload.userId : null
    const email = typeof payload.email === "string" ? payload.email : null
    const role = typeof payload.role === "string" ? payload.role.toLowerCase() : null

    if (!userId || !email || !role) return null
    if (role !== "student" && role !== "warden" && role !== "admin") return null

    return { userId, email, role }
  } catch {
    return null
  }
}

export function getAuthClaims(request: NextRequest): AuthClaims | null {
  const token = request.cookies.get(AUTH_COOKIE)?.value
  if (!token) return null
  return verifyAuthToken(token)
}

export function toDbRole(role: AuthRole) {
  return role.toUpperCase() as "STUDENT" | "WARDEN" | "ADMIN"
}

export function fromDbRole(role: "STUDENT" | "WARDEN" | "ADMIN"): AuthRole {
  return role.toLowerCase() as AuthRole
}

export const authCookieName = AUTH_COOKIE
