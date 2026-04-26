import { NextRequest } from "next/server"
import { ok, badRequest } from "@/lib/api"

const feedback = [
	{ id: "1", mealType: "lunch", rating: 4, comment: "Good food today", createdAt: new Date().toISOString() },
	{ id: "2", mealType: "dinner", rating: 5, comment: "Excellent dinner", createdAt: new Date().toISOString() },
]

export async function GET(_request: NextRequest) {
	return ok({ feedback })
}

export async function POST(request: NextRequest) {
	const json = await request.json().catch(() => ({}))
	if (!json?.mealType || !json?.rating) return badRequest("Invalid feedback payload")

	const item = {
		id: crypto.randomUUID(),
		mealType: String(json.mealType),
		rating: Number(json.rating),
		comment: String(json.comment || ""),
		createdAt: new Date().toISOString(),
	}

	feedback.unshift(item)
	return ok({ feedback: item })
}
