import { z } from "zod"
import { badRequest, ok, serverError } from "@/lib/api"

const LeaveRequestSchema = z.object({
  reason: z.string().min(5).max(500),
  startDate: z.string().refine((s) => !Number.isNaN(Date.parse(s)), { message: "Invalid startDate" }),
  endDate: z.string().refine((s) => !Number.isNaN(Date.parse(s)), { message: "Invalid endDate" }),
  type: z.enum(["casual", "medical", "emergency", "other"]).default("casual"),
})

const MOCK_REQUESTS = [
  { id: "1", reason: "Family function", type: "casual", startDate: "2024-12-20", endDate: "2024-12-22", status: "approved" },
  { id: "2", reason: "Medical appointment", type: "medical", startDate: "2025-01-05", endDate: "2025-01-06", status: "pending" },
]

export async function GET() {
  try {
    return ok({ requests: MOCK_REQUESTS })
  } catch (err) {
    return serverError("Failed to fetch leave requests", err)
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => ({}))
    const parsed = LeaveRequestSchema.safeParse(json)
    if (!parsed.success) {
      return badRequest("Invalid leave request data", parsed.error.format())
    }
    const { startDate, endDate } = parsed.data
    if (new Date(endDate) < new Date(startDate)) {
      return badRequest("endDate must be after startDate")
    }
    const leaveRequest = { id: Date.now().toString(), status: "pending" as const, createdAt: new Date().toISOString(), ...parsed.data }
    return ok({ request: leaveRequest })
  } catch (err) {
    return serverError("Failed to create leave request", err)
  }
}
