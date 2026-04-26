import { NextRequest } from "next/server"
import { ok } from "@/lib/api"

const hostels = [
	{
		id: "1",
		name: "Sunrise Hostel",
		wardenName: "Mr. Rajesh Sharma",
		contactNumber: "+91-9876543211",
		capacity: 240,
		occupied: 198,
		address: "Poornima University Campus, Jaipur",
	},
	{
		id: "2",
		name: "Moonlight Hostel",
		wardenName: "Ms. Anjali Verma",
		contactNumber: "+91-9876543215",
		capacity: 180,
		occupied: 146,
		address: "Poornima University Campus, Jaipur",
	},
]

export async function GET(_request: NextRequest) {
	return ok({ hostels })
}
