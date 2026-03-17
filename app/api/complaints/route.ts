import { z } from "zod"
import { badRequest, ok, serverError } from "@/lib/api"

const ComplaintSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(1000),
  category: z.enum(["maintenance", "mess", "security", "cleanliness", "other"]).default("other"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
})

const MOCK_COMPLAINTS = [
  { id: "1", title: "Leaking tap in bathroom", category: "maintenance", priority: "medium", status: "pending", createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "2", title: "Poor food quality in mess", category: "mess", priority: "high", status: "in-progress", createdAt: new Date(Date.now() - 172800000).toISOString() },
]

export async function GET() {
  try {
    return ok({ complaints: MOCK_COMPLAINTS })
  } catch (err) {
    return serverError("Failed to fetch complaints", err)
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => ({}))
    const parsed = ComplaintSchema.safeParse(json)
    if (!parsed.success) {
      return badRequest("Invalid complaint data", parsed.error.format())
    }

    const complaint = {
      id: Date.now().toString(),
      status: "pending" as const,
      createdAt: new Date().toISOString(),
      ...parsed.data,
    }
    return ok({ complaint })
  } catch (err) {
    return serverError("Failed to create complaint", err)
  }
}
