import { z } from "zod"
import { badRequest, ok, serverError } from "@/lib/api"

const FeedbackSchema = z.object({
  mealType: z.enum(["breakfast", "lunch", "dinner"]),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
  date: z.string().optional(),
})

export async function GET() {
  try {
    return ok({ feedbacks: [] })
  } catch (err) {
    return serverError("Failed to fetch feedback", err)
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => ({}))
    const parsed = FeedbackSchema.safeParse(json)
    if (!parsed.success) {
      return badRequest("Invalid feedback data", parsed.error.format())
    }
    const feedback = { id: Date.now().toString(), submittedAt: new Date().toISOString(), ...parsed.data }
    return ok({ feedback })
  } catch (err) {
    return serverError("Failed to submit feedback", err)
  }
}
