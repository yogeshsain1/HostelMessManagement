import { NextRequest } from "next/server"
import { ok, badRequest } from "@/lib/api"

const attendance = [
	{ id: "1", userId: "3", mealType: "breakfast", date: "2026-04-18", time: "08:12 AM" },
	{ id: "2", userId: "3", mealType: "lunch", date: "2026-04-18", time: "12:46 PM" },
]

export async function GET(_request: NextRequest) {
	return ok({ attendance })
}

export async function POST(request: NextRequest) {
	const json = await request.json().catch(() => ({}))
	if (!json?.mealType || !json?.date) return badRequest("Invalid attendance payload")

	const record = {
		id: crypto.randomUUID(),
		userId: String(json.userId || ""),
		mealType: String(json.mealType),
		date: String(json.date),
		time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
	}

	attendance.unshift(record)
	return ok({ attendance: record })
}
