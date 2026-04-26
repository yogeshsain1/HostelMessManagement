import { NextRequest } from "next/server"
import { ok, badRequest } from "@/lib/api"

const notifications = [
	{
		id: "1",
		title: "Leave Request Approved",
		message: "Your leave request from Jan 20 to Jan 22 has been approved.",
		type: "success",
		read: false,
		createdAt: new Date().toISOString(),
	},
	{
		id: "2",
		title: "Mess Menu Updated",
		message: "Dinner menu has been updated for today.",
		type: "info",
		read: true,
		createdAt: new Date().toISOString(),
	},
]

export async function GET(_request: NextRequest) {
	return ok({ notifications })
}

export async function POST(request: NextRequest) {
	const json = await request.json().catch(() => ({}))
	if (!json?.title || !json?.message) return badRequest("Invalid notification payload")

	const notification = {
		id: crypto.randomUUID(),
		title: String(json.title),
		message: String(json.message),
		type: String(json.type || "info"),
		read: false,
		createdAt: new Date().toISOString(),
	}

	notifications.unshift(notification)
	return ok({ notification })
}
