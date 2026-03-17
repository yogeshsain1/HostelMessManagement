import { ok, serverError } from "@/lib/api"

const MOCK_NOTIFICATIONS = [
  { id: "1", title: "Leave request approved", message: "Your leave request for Dec 20-22 has been approved.", read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: "2", title: "Complaint update", message: "Your complaint about leaking tap has been assigned to maintenance.", read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
]

export async function GET() {
  try {
    return ok({ notifications: MOCK_NOTIFICATIONS })
  } catch (err) {
    return serverError("Failed to fetch notifications", err)
  }
}
