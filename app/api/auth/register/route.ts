import { z } from "zod"
import { badRequest, ok, serverError } from "@/lib/api"

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(2),
  role: z.enum(["student", "warden", "admin"]).default("student"),
})

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => ({}))
    const parsed = RegisterSchema.safeParse(json)
    if (!parsed.success) {
      return badRequest("Invalid registration payload", parsed.error.format())
    }

    const user = {
      id: Date.now().toString(),
      ...parsed.data,
      createdAt: new Date().toISOString(),
    }

    return ok({ user, token: `mock-token-${user.id}` })
  } catch (err) {
    return serverError("Registration failed", err)
  }
}
