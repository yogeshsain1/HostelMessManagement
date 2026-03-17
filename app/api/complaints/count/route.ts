import { ok, serverError } from "@/lib/api"

export async function GET() {
  try {
    return ok({ count: 2, byStatus: { pending: 1, "in-progress": 1, resolved: 0 } })
  } catch (err) {
    return serverError("Failed to fetch complaint count", err)
  }
}
