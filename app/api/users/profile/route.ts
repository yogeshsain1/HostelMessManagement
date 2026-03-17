import { z } from "zod"
import { badRequest, ok, serverError } from "@/lib/api"

const ProfileUpdateSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  phone: z.string().max(20).optional(),
  addressLine1: z.string().max(200).optional(),
  addressLine2: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  postalCode: z.string().max(20).optional(),
  emergencyContactName: z.string().max(100).optional(),
  emergencyContactPhone: z.string().max(20).optional(),
})

export async function GET() {
  try {
    return ok({ profile: { id: "1", fullName: "Demo User", email: "demo@poornima.edu.in", role: "student" } })
  } catch (err) {
    return serverError("Failed to fetch profile", err)
  }
}

export async function PATCH(request: Request) {
  try {
    const json = await request.json().catch(() => ({}))
    const parsed = ProfileUpdateSchema.safeParse(json)
    if (!parsed.success) {
      return badRequest("Invalid profile data", parsed.error.format())
    }
    return ok({ profile: { ...parsed.data, updatedAt: new Date().toISOString() } })
  } catch (err) {
    return serverError("Failed to update profile", err)
  }
}
