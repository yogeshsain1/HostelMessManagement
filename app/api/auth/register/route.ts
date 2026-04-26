import { NextResponse } from "next/server"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { badRequest, serverError } from "@/lib/api"
import { prisma } from "@/lib/prisma"
import { signAuthToken, authCookieName, fromDbRole } from "@/lib/server-auth"

const RegisterSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
	fullName: z.string().min(2).max(120),
	role: z.enum(["student", "warden", "admin"]).default("student"),
	phone: z.string().optional(),
})

export async function POST(request: Request) {
	try {
		const json = await request.json().catch(() => ({}))
		const parsed = RegisterSchema.safeParse(json)
		if (!parsed.success) return badRequest("Invalid register payload", parsed.error.format())

		const email = parsed.data.email.trim().toLowerCase()
		const existing = await prisma.user.findUnique({ where: { email } })
		if (existing) {
			return NextResponse.json({ success: false, error: { code: "CONFLICT", message: "User already exists" } }, { status: 409 })
		}

		const user = await prisma.user.create({
			data: {
				email,
				passwordHash: await bcrypt.hash(parsed.data.password, 10),
				fullName: parsed.data.fullName,
				role: parsed.data.role.toUpperCase() as "STUDENT" | "WARDEN" | "ADMIN",
				phone: parsed.data.phone,
			},
		})

		const token = signAuthToken({ userId: user.id, email: user.email, role: fromDbRole(user.role) })
		const response = NextResponse.json({
			success: true,
			data: {
				user: {
					id: user.id,
					email: user.email,
					fullName: user.fullName,
					phone: user.phone,
					role: fromDbRole(user.role),
				},
			},
		})

		response.cookies.set(authCookieName, token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			maxAge: 60 * 60 * 24,
		})

		return response
	} catch (err) {
		return serverError("Registration failed", err)
	}
}
