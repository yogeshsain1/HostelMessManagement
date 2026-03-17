import { z } from "zod"
import { badRequest, ok, serverError } from "@/lib/api"

const PreferencesSchema = z.object({
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  theme: z.enum(["light", "dark", "system"]).optional(),
  language: z.string().optional(),
})

export async function GET() {
  try {
    return ok({ preferences: { emailNotifications: true, pushNotifications: true, theme: "system", language: "en" } })
  } catch (err) {
    return serverError("Failed to fetch preferences", err)
  }
}

export async function PATCH(request: Request) {
  try {
    const json = await request.json().catch(() => ({}))
    const parsed = PreferencesSchema.safeParse(json)
    if (!parsed.success) {
      return badRequest("Invalid preferences data", parsed.error.format())
    }
    return ok({ preferences: parsed.data })
  } catch (err) {
    return serverError("Failed to update preferences", err)
  }
}
