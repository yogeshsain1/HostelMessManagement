import { z } from "zod"
import { badRequest, ok, serverError } from "@/lib/api"

const QRSchema = z.object({
  mealType: z.enum(["breakfast", "lunch", "dinner"]),
  date: z.string().refine((s) => !Number.isNaN(Date.parse(s)), { message: "Invalid date" }),
})

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => ({}))
    const parsed = QRSchema.safeParse(json)
    if (!parsed.success) {
      return badRequest("Invalid QR request data", parsed.error.format())
    }
    const { mealType, date } = parsed.data
    const qrData = Buffer.from(JSON.stringify({ mealType, date, timestamp: Date.now(), action: "mess-attendance" })).toString("base64")
    return ok({ qrData, mealType, date, expiresAt: new Date(Date.now() + 3600000).toISOString() })
  } catch (err) {
    return serverError("Failed to generate QR", err)
  }
}
