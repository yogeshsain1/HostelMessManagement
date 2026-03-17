import { ok, serverError } from "@/lib/api"

const MOCK_USERS = [
  { id: "1", email: "admin@poornima.edu.in", fullName: "Admin User", role: "admin", phone: "+91-9876543210" },
  { id: "2", email: "warden1@poornima.edu.in", fullName: "Warden Sharma", role: "warden", phone: "+91-9876543211", hostelId: "1" },
  { id: "3", email: "student1@poornima.edu.in", fullName: "Rahul Kumar", role: "student", phone: "+91-9876543212", hostelId: "1", roomNumber: "A-101" },
]

export async function GET() {
  try {
    return ok({ users: MOCK_USERS })
  } catch (err) {
    return serverError("Failed to fetch users", err)
  }
}
