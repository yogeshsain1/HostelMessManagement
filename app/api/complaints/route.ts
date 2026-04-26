import { NextRequest } from "next/server"
import { z } from "zod"
import { badRequest, ok, serverError, unauthorized } from "@/lib/api"
import { prisma } from "@/lib/prisma"
import { getAuthClaims } from "@/lib/server-auth"

const CreateComplaintSchema = z.object({
	title: z.string().min(3).max(120),
	description: z.string().min(10).max(1000),
	category: z.string().min(2).max(60),
	priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
})

const QuerySchema = z.object({
	status: z.enum(["PENDING", "IN_PROGRESS", "RESOLVED"]).optional(),
	mine: z
		.string()
		.optional()
		.transform((value) => value === "true"),
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

export async function GET(request: NextRequest) {
	try {
		const claims = getAuthClaims(request)
		if (!claims) return unauthorized()

		const query = QuerySchema.safeParse({
			status: request.nextUrl.searchParams.get("status") ?? undefined,
			mine: request.nextUrl.searchParams.get("mine") ?? undefined,
		})

		if (!query.success) return badRequest("Invalid query params", query.error.format())

		const where: {
			status?: "PENDING" | "IN_PROGRESS" | "RESOLVED"
			userId?: string
		} = {}

		if (query.data.status) where.status = query.data.status
		if (claims.role === "student" || query.data.mine) where.userId = claims.userId

		const complaints = await prisma.complaint.findMany({
			where,
			orderBy: { createdAt: "desc" },
			include: {
				user: {
					select: { id: true, fullName: true, email: true, roomNumber: true, hostelId: true },
				},
			},
		})

		return ok({ complaints })
	} catch (err) {
		if (isPrismaUnavailable(err)) {
			return ok({ complaints: [] })
		}

		return serverError("Failed to fetch complaints", err)
	}
}

export async function POST(request: NextRequest) {
	try {
		const claims = getAuthClaims(request)
		if (!claims) return unauthorized()

		const json = await request.json().catch(() => ({}))
		const parsed = CreateComplaintSchema.safeParse(json)
		if (!parsed.success) return badRequest("Invalid complaint payload", parsed.error.format())

		const complaint = await prisma.complaint.create({
			data: {
				title: parsed.data.title,
				description: parsed.data.description,
				category: parsed.data.category,
				priority: parsed.data.priority,
				userId: claims.userId,
			},
		})

		return ok({ complaint })
	} catch (err) {
		return serverError("Failed to create complaint", err)
	}
}
