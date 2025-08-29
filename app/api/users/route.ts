import { z } from "zod"
import { badRequest, ok, serverError } from "@/lib/api"

const UpdateProfileSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().min(7).max(20).optional(),
  addressLine1: z.string().max(120).optional(),
  addressLine2: z.string().max(120).optional(),
  city: z.string().max(60).optional(),
  state: z.string().max(60).optional(),
  postalCode: z.string().max(20).optional(),
  emergencyContactName: z.string().max(80).optional(),
  emergencyContactPhone: z.string().max(20).optional(),
  course: z.string().max(80).optional(),
  year: z.string().max(20).optional(),
  profileImageUrl: z.string().url().optional(),
})

const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
})

export async function PATCH(request: Request) {
  try {
    const json = await request.json().catch(() => ({}))
    const parsed = UpdateProfileSchema.safeParse(json)
    if (!parsed.success) return badRequest("Invalid profile update", parsed.error.format())
    // Demo: echo back updates
    return ok({ user: parsed.data })
  } catch (err) {
    return serverError("Failed to update profile", err)
  }
}

export async function POST(request: Request) {
  try {
    const url = new URL(request.url)
    const action = url.searchParams.get("action")
    if (action === "change-password") {
      const json = await request.json().catch(() => ({}))
      const parsed = ChangePasswordSchema.safeParse(json)
      if (!parsed.success) return badRequest("Invalid password change", parsed.error.format())
      // Demo: accept any current password
      return ok({ changed: true })
    }
    return badRequest("Unknown action")
  } catch (err) {
    return serverError("User action failed", err)
  }
}


