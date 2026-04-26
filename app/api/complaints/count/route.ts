import { NextRequest } from "next/server"
import { ok, serverError, unauthorized } from "@/lib/api"
import { prisma } from "@/lib/prisma"
import { getAuthClaims } from "@/lib/server-auth"

export async function GET(request: NextRequest) {
	try {
		const claims = getAuthClaims(request)
		if (!claims) return unauthorized()

		const [total, pending, inProgress, resolved] = await Promise.all([
			prisma.complaint.count(),
			prisma.complaint.count({ where: { status: "PENDING" } }),
			prisma.complaint.count({ where: { status: "IN_PROGRESS" } }),
			prisma.complaint.count({ where: { status: "RESOLVED" } }),
		])

		return ok({ total, pending, inProgress, resolved })
	} catch (err) {
		return serverError("Failed to fetch complaint counts", err)
	}
}
