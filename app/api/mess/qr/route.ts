import { NextRequest } from "next/server"
import { badRequest, ok } from "@/lib/api"

export async function POST(request: NextRequest) {
	const json = await request.json().catch(() => ({}))
	if (!json?.mealType || !json?.date) return badRequest("Invalid QR payload")

	const payload = {
		action: "mess-attendance",
		mealType: String(json.mealType),
		date: String(json.date),
		hostelId: String(json.hostelId || "sunrise-hostel"),
		timestamp: Date.now(),
	}

	return ok({ payload })
}

export async function GET() {
	return ok({ status: "ready" })
}
