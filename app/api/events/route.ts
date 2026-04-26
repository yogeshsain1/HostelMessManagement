import { NextRequest } from "next/server"
import { ok, badRequest } from "@/lib/api"

const events = [
	{
		id: "1",
		title: "Hostel Maintenance Drive",
		date: "2026-04-20",
		description: "Scheduled maintenance and inspection across all hostel blocks.",
	},
	{
		id: "2",
		title: "Mess Committee Meeting",
		date: "2026-04-22",
		description: "Feedback review and menu discussion with student representatives.",
	},
]

export async function GET(_request: NextRequest) {
	return ok({ events })
}

export async function POST(request: NextRequest) {
	const json = await request.json().catch(() => ({}))
	if (!json?.title || !json?.date) return badRequest("Invalid event payload")

	const event = {
		id: crypto.randomUUID(),
		title: String(json.title),
		date: String(json.date),
		description: String(json.description || ""),
	}

	events.unshift(event)
	return ok({ event })
}
