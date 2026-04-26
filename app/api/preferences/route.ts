import { NextRequest } from "next/server"
import { ok, badRequest } from "@/lib/api"

const defaultPreferences = {
	notifications: true,
	darkMode: false,
	language: "en",
	emailUpdates: true,
	smsUpdates: false,
}

export async function GET(_request: NextRequest) {
	return ok({ preferences: defaultPreferences })
}

export async function PATCH(request: NextRequest) {
	const json = await request.json().catch(() => ({}))
	if (typeof json !== "object" || json === null) return badRequest("Invalid preferences payload")
	return ok({ preferences: { ...defaultPreferences, ...json } })
}
