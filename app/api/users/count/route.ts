import { ok, serverError } from "@/lib/api"

export async function GET() {
  try {
    return ok({ count: 3, byRole: { student: 1, warden: 1, admin: 1 } })
  } catch (err) {
    return serverError("Failed to fetch user count", err)
  }
}
