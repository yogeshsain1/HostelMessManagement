import { z } from "zod"
import { badRequest, ok, serverError, unauthorized } from "@/lib/api"

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

// Mock users matching the client-side auth
const MOCK_USERS = [
  { id: "1", email: "admin@poornima.edu.in", fullName: "Admin User", role: "admin" as const, phone: "+91-9876543210" },
  { id: "2", email: "warden1@poornima.edu.in", fullName: "Warden Sharma", role: "warden" as const, phone: "+91-9876543211", hostelId: "1" },
  { id: "3", email: "student1@poornima.edu.in", fullName: "Rahul Kumar", role: "student" as const, phone: "+91-9876543212", hostelId: "1", roomNumber: "A-101" },
]

const VALID_PASSWORDS = ["password123", "demo123"]

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => ({}))
    const parsed = LoginSchema.safeParse(json)
    if (!parsed.success) {
      return badRequest("Invalid login payload", parsed.error.format())
    }

    const { email, password } = parsed.data
    const user = MOCK_USERS.find((u) => u.email === email)

    if (!user || !VALID_PASSWORDS.includes(password)) {
      return unauthorized("Invalid email or password")
    }

    return ok({ user, token: `mock-token-${user.id}` })
  } catch (err) {
    return serverError("Login failed", err)
  }
}
