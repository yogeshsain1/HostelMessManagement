import { z } from "zod"
import { badRequest, ok, serverError } from "@/lib/api"

const AttendanceSchema = z.object({
  studentId: z.string(),
  mealType: z.enum(["breakfast", "lunch", "dinner"]),
  date: z.string().refine((s) => !Number.isNaN(Date.parse(s)), { message: "Invalid date" }),
  qrData: z.string().optional(),
})

export async function GET() {
  try {
    return ok({ attendance: [] })
  } catch (err) {
    return serverError("Failed to fetch attendance", err)
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => ({}))
    const parsed = AttendanceSchema.safeParse(json)
    if (!parsed.success) {
      return badRequest("Invalid attendance data", parsed.error.format())
    }
    const record = { id: Date.now().toString(), markedAt: new Date().toISOString(), ...parsed.data }
    return ok({ record })
  } catch (err) {
    return serverError("Failed to mark attendance", err)
  }
}
