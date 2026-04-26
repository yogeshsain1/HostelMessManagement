import { NextRequest } from "next/server"
import { ok, serverError, unauthorized } from "@/lib/api"
import { prisma } from "@/lib/prisma"
import { getAuthClaims } from "@/lib/server-auth"

export async function GET(request: NextRequest) {
	try {
		const claims = getAuthClaims(request)
		if (!claims) return unauthorized()

		const total = await prisma.user.count()
		return ok({ total })
	} catch (err) {
		return serverError("Failed to fetch user count", err)
	}
}
