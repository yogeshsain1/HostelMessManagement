import { NextRequest } from "next/server"
import { ok, badRequest } from "@/lib/api"

const menu = {
	breakfast: { time: "7:00 - 9:00 AM", items: "Idli, Sambar, Coconut Chutney", rating: 4.2 },
	lunch: { time: "12:00 - 2:00 PM", items: "Rajasthani Dal Baati, Rice, Vegetable", rating: 4.5 },
	snacks: { time: "4:00 - 6:00 PM", items: "Samosa, Tea", rating: 4.0 },
	dinner: { time: "7:00 - 9:00 PM", items: "Roti, Paneer Curry, Rice", rating: 4.3 },
}

export async function GET(_request: NextRequest) {
	return ok({ menu })
}

export async function POST(request: NextRequest) {
	const json = await request.json().catch(() => ({}))
	if (!json?.mealType || !json?.items) return badRequest("Invalid menu payload")
	return ok({ updated: true, mealType: json.mealType, items: json.items })
}
