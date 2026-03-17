import { z } from "zod"
import { badRequest, ok, serverError } from "@/lib/api"

const EventSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(1000).optional(),
  date: z.string().refine((s) => !Number.isNaN(Date.parse(s)), { message: "Invalid date" }),
  location: z.string().max(200).optional(),
})

const MOCK_EVENTS = [
  { id: "1", title: "Hostel Cultural Night", date: "2025-02-14", location: "Main Hall", description: "Annual cultural night celebration" },
  { id: "2", title: "Sports Day", date: "2025-03-01", location: "Sports Ground", description: "Inter-hostel sports competition" },
]

export async function GET() {
  try {
    return ok({ events: MOCK_EVENTS })
  } catch (err) {
    return serverError("Failed to fetch events", err)
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => ({}))
    const parsed = EventSchema.safeParse(json)
    if (!parsed.success) {
      return badRequest("Invalid event data", parsed.error.format())
    }
    const event = { id: Date.now().toString(), createdAt: new Date().toISOString(), ...parsed.data }
    return ok({ event })
  } catch (err) {
    return serverError("Failed to create event", err)
  }
}
