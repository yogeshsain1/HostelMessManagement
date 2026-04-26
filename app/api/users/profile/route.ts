import { NextRequest } from "next/server"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { badRequest, ok, serverError, unauthorized } from "@/lib/api"
import { prisma } from "@/lib/prisma"
import { fromDbRole, getAuthClaims } from "@/lib/server-auth"

const UpdateProfileSchema = z.object({
	fullName: z.string().min(2).max(120).optional(),
	phone: z.string().min(7).max(20).optional(),
	hostelId: z.string().min(1).max(50).optional(),
	roomNumber: z.string().min(1).max(50).optional(),
	addressLine1: z.string().min(2).max(120).optional(),
	addressLine2: z.string().max(120).optional(),
	city: z.string().max(80).optional(),
	state: z.string().max(80).optional(),
	postalCode: z.string().max(20).optional(),
	emergencyContactName: z.string().max(120).optional(),
	emergencyContactPhone: z.string().max(20).optional(),
	course: z.string().max(120).optional(),
	year: z.string().max(20).optional(),
	profileImageUrl: z.string().min(1).optional(),
	twoFactorEnabled: z.boolean().optional(),
})

const ChangePasswordSchema = z.object({
	action: z.literal("change-password"),
	currentPassword: z.string().min(6),
	newPassword: z.string().min(6),
})

function isPrismaUnavailable(err: unknown) {
	return (
		typeof err === "object" &&
		err !== null &&
		"name" in err &&
		(String((err as { name?: string }).name) === "PrismaClientInitializationError" ||
			String((err as { name?: string }).name) === "PrismaClientKnownRequestError")
	)
}

function mapUser(user: {
	id: string
	email: string
	fullName: string
	phone: string | null
	role: "STUDENT" | "WARDEN" | "ADMIN"
	hostelId: string | null
	roomNumber: string | null
	addressLine1: string | null
	addressLine2: string | null
	city: string | null
	state: string | null
	postalCode: string | null
	emergencyContactName: string | null
	emergencyContactPhone: string | null
	course: string | null
	year: string | null
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
		addressLine1: user.addressLine1,
		addressLine2: user.addressLine2,
		city: user.city,
		state: user.state,
		postalCode: user.postalCode,
		emergencyContactName: user.emergencyContactName,
		emergencyContactPhone: user.emergencyContactPhone,
		course: user.course,
		year: user.year,
		profileImageUrl: user.profileImageUrl,
		twoFactorEnabled: user.twoFactorEnabled,
	}
}

export async function GET(request: NextRequest) {
	try {
		const claims = getAuthClaims(request)
		if (!claims) return unauthorized()

		const user = await prisma.user.findUnique({ where: { id: claims.userId } })
		if (!user) return unauthorized("User not found")

		return ok({ user: mapUser(user) })
	} catch (err) {
		const claims = getAuthClaims(request)
		if (claims && isPrismaUnavailable(err)) {
			return ok({
				user: {
					id: claims.userId,
					email: claims.email,
					fullName: claims.email.split("@")[0],
					phone: null,
					role: claims.role,
					hostelId: null,
					roomNumber: null,
					addressLine1: null,
					addressLine2: null,
					city: null,
					state: null,
					postalCode: null,
					emergencyContactName: null,
					emergencyContactPhone: null,
					course: null,
					year: null,
					profileImageUrl: null,
					twoFactorEnabled: false,
				},
			})
		}

		return serverError("Failed to fetch profile", err)
	}
}

export async function PATCH(request: NextRequest) {
	try {
		const claims = getAuthClaims(request)
		if (!claims) return unauthorized()

		const json = await request.json().catch(() => ({}))
		const parsed = UpdateProfileSchema.safeParse(json)
		if (!parsed.success) return badRequest("Invalid profile payload", parsed.error.format())

		const user = await prisma.user.update({
			where: { id: claims.userId },
			data: parsed.data,
		})

		return ok({ user: mapUser(user) })
	} catch (err) {
		return serverError("Failed to update profile", err)
	}
}

export async function POST(request: NextRequest) {
	try {
		const claims = getAuthClaims(request)
		if (!claims) return unauthorized()

		const json = await request.json().catch(() => ({}))
		const parsed = ChangePasswordSchema.safeParse(json)
		if (!parsed.success) return badRequest("Invalid password payload", parsed.error.format())

		const user = await prisma.user.findUnique({ where: { id: claims.userId } })
		if (!user) return unauthorized("User not found")

		const isValid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash)
		if (!isValid) return badRequest("Current password is incorrect")

		const passwordHash = await bcrypt.hash(parsed.data.newPassword, 10)
		await prisma.user.update({
			where: { id: claims.userId },
			data: { passwordHash },
		})

		return ok({ changed: true })
	} catch (err) {
		return serverError("Failed to change password", err)
	}
}
