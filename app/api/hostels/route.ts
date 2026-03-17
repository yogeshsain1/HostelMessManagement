import { ok, serverError } from "@/lib/api"

export async function GET() {
  try {
    return ok({ hostels: [
      { id: "1", name: "Block A - Boys Hostel", totalRooms: 120, occupiedRooms: 98 },
      { id: "2", name: "Block B - Girls Hostel", totalRooms: 100, occupiedRooms: 87 },
    ] })
  } catch (err) {
    return serverError("Failed to fetch hostels", err)
  }
}
