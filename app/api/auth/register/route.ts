import { z } from "zod"
import { badRequest, ok, serverError } from "@/lib/api"

const RegisterSchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  role: z.enum(["student", "warden", "admin"]).default("student"),
})

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => ({}))
    const parse = RegisterSchema.safeParse(json)
    if (!parse.success) {
      return badRequest("Invalid registration payload", parse.error.format())
    }

    const user = { id: "demo-user", ...parse.data }
    // Demo: echo back user; in real app, persist to DB and hash password
    return ok(user)
  } catch (err) {
    return serverError("Registration failed", err)
  }
}


