import { NextRequest } from "next/server"
import { ok, serverError, unauthorized } from "@/lib/api"
import { prisma } from "@/lib/prisma"
import { fromDbRole, getAuthClaims } from "@/lib/server-auth"

function mapUser(user: {
	id: string
	email: string
	fullName: string
	phone: string | null
	role: "STUDENT" | "WARDEN" | "ADMIN"
	hostelId: string | null
	roomNumber: string | null
	profileImageUrl: string | null
	twoFactorEnabled: boolean
}) {
	return {
		id: user.id,
		email: user.email,
		fullName: user.fullName,
		phone: user.phone,
		role: fromDbRole(user.role),
		hostelId: user.hostelId,
		roomNumber: user.roomNumber,
		profileImageUrl: user.profileImageUrl,
		twoFactorEnabled: user.twoFactorEnabled,
	}
}

export async function GET(request: NextRequest) {
	try {
		const claims = getAuthClaims(request)
		if (!claims) return unauthorized()

		if (claims.role !== "admin") {
			const user = await prisma.user.findUnique({ where: { id: claims.userId } })
			return ok({ users: user ? [mapUser(user)] : [] })
		}

		const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } })
		return ok({ users: users.map(mapUser) })
	} catch (err) {
		return serverError("Failed to fetch users", err)
	}
}
