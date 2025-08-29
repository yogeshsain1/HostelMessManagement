import { z } from "zod"
import { badRequest, ok, serverError } from "@/lib/api"

const TwoFASetupSchema = z.object({
  action: z.literal("setup-2fa"),
})

const TwoFAVerifySchema = z.object({
  action: z.literal("verify-2fa"),
  token: z.string().min(4).max(10),
})

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => ({}))
    if (json?.action === "setup-2fa") {
      const parsed = TwoFASetupSchema.safeParse(json)
      if (!parsed.success) return badRequest("Invalid 2FA setup payload", parsed.error.format())
      // Demo: return a fake secret and QR data URL placeholder
      return ok({ secret: "DEMO2FASECRET", otpauthUrl: "otpauth://totp/Poornima:demo?secret=DEMO2FASECRET&issuer=Poornima" })
    }
    if (json?.action === "verify-2fa") {
      const parsed = TwoFAVerifySchema.safeParse(json)
      if (!parsed.success) return badRequest("Invalid 2FA verify payload", parsed.error.format())
      // Demo: accept any 6-digit token
      const isValid = /^[0-9]{6}$/.test(json.token)
      if (!isValid) return badRequest("Invalid token format")
      return ok({ enabled: true })
    }
    return badRequest("Unknown auth action")
  } catch (err) {
    return serverError("Auth action failed", err)
  }
}


