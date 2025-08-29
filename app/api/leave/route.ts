import { z } from "zod"
import { badRequest, ok, serverError } from "@/lib/api"

const LeaveRequestSchema = z.object({
  reason: z.string().min(5).max(500),
  startDate: z.string().refine((s) => !Number.isNaN(Date.parse(s)), { message: "Invalid startDate" }),
  endDate: z.string().refine((s) => !Number.isNaN(Date.parse(s)), { message: "Invalid endDate" }),
  type: z.enum(["casual", "medical", "emergency", "other"]).default("casual"),
})

export async function GET() {
  return ok({ requests: [] })
}

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => ({}))
    const parse = LeaveRequestSchema.safeParse(json)
    if (!parse.success) {
      return badRequest("Invalid leave request", parse.error.format())
    }

    const { startDate, endDate } = parse.data
    const start = new Date(startDate)
    const end = new Date(endDate)
    if (end < start) {
      return badRequest("endDate must be after startDate")
    }

    const requestObj = {
      id: Date.now().toString(),
      status: "pending" as const,
      createdAt: new Date().toISOString(),
      ...parse.data,
    }
    return ok({ request: requestObj })
  } catch (err) {
    return serverError("Failed to create leave request", err)
  }
}

