import { z } from "zod"
import { badRequest, ok, serverError } from "@/lib/api"

const ComplaintCreateSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(1000),
  category: z.enum(["maintenance", "cleanliness", "other"]),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  roomNumber: z.string().min(1).max(10),
})

export async function GET() {
  // Demo: return empty list shape
  return ok({ complaints: [] })
}

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => ({}))
    const parse = ComplaintCreateSchema.safeParse(json)
    if (!parse.success) {
      return badRequest("Invalid complaint", parse.error.format())
    }

    // Demo: return created complaint with id
    const complaint = { id: Date.now().toString(), status: "pending", createdAt: new Date().toISOString(), ...parse.data }
    return ok({ complaint })
  } catch (err) {
    return serverError("Failed to create complaint", err)
  }
}

