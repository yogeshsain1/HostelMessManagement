import { z } from "zod"
import { badRequest, ok, serverError } from "@/lib/api"

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
})

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => ({}))
    const parse = LoginSchema.safeParse(json)
    if (!parse.success) {
      return badRequest("Invalid credentials payload", parse.error.format())
    }

    const { email, password } = parse.data

    // Demo-only: accept fixed passwords
    const valid = password === "demo123" || password === "password123"
    if (!valid) {
      return badRequest("Invalid email or password")
    }

    // Mock role inference from email for demo
    const role = email.includes("admin") ? "admin" : email.includes("warden") ? "warden" : "student"
    const user = {
      id: "demo-" + role,
      email,
      fullName: role === "admin" ? "Admin User" : role === "warden" ? "Warden User" : "Student User",
      role,
    }

    return ok(user, {
      headers: {
        "set-cookie": `hostel-auth=1; Path=/; SameSite=Lax; HttpOnly; Max-Age=${60 * 60 * 8}`,
      },
    })
  } catch (err) {
    return serverError("Login failed", err)
  }
}


