import { NextRequest } from "next/server"
import { z } from "zod"
import { badRequest, ok, serverError, unauthorized } from "@/lib/api"
import { prisma } from "@/lib/prisma"
import { getAuthClaims } from "@/lib/server-auth"

const LeaveRequestSchema = z.object({
	reason: z.string().min(5).max(1000),
	startDate: z.string().refine((s) => !Number.isNaN(Date.parse(s)), { message: "Invalid startDate" }),
	endDate: z.string().refine((s) => !Number.isNaN(Date.parse(s)), { message: "Invalid endDate" }),
	type: z.enum(["PERSONAL", "MEDICAL", "ACADEMIC", "EMERGENCY"]).default("PERSONAL"),
	destination: z.string().min(2).max(160).optional(),
})

const QuerySchema = z.object({
	status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
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
			status?: "PENDING" | "APPROVED" | "REJECTED"
			userId?: string
		} = {}

		if (query.data.status) where.status = query.data.status
		if (claims.role === "student" || query.data.mine) where.userId = claims.userId

		const leaveRequests = await prisma.leaveRequest.findMany({
			where,
			orderBy: { createdAt: "desc" },
			include: {
				user: {
					select: { id: true, fullName: true, email: true, roomNumber: true, hostelId: true },
				},
			},
		})

		return ok({ leaveRequests })
	} catch (err) {
		if (isPrismaUnavailable(err)) {
			return ok({ leaveRequests: [] })
		}

		return serverError("Failed to fetch leave requests", err)
	}
}

export async function POST(request: NextRequest) {
	try {
		const claims = getAuthClaims(request)
		if (!claims) return unauthorized()

		const json = await request.json().catch(() => ({}))
		const parse = LeaveRequestSchema.safeParse(json)
		if (!parse.success) {
			return badRequest("Invalid leave request", parse.error.format())
		}

		const { startDate, endDate } = parse.data
		const start = new Date(startDate)
		const end = new Date(endDate)
		if (end < start) {
			return badRequest("endDate must be after startDate")
		}

		const leaveRequest = await prisma.leaveRequest.create({
			data: {
				reason: parse.data.reason,
				type: parse.data.type,
				startDate: start,
				endDate: end,
				destination: parse.data.destination,
				userId: claims.userId,
			},
		})

		return ok({ leaveRequest })
	} catch (err) {
		return serverError("Failed to create leave request", err)
	}
}
