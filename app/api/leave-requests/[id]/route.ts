import { NextRequest } from "next/server"
import { z } from "zod"
import { badRequest, ok, serverError, unauthorized } from "@/lib/api"
import { prisma } from "@/lib/prisma"
import { getAuthClaims } from "@/lib/server-auth"

const UpdateLeaveSchema = z.object({
	reason: z.string().min(5).max(1000).optional(),
	destination: z.string().min(2).max(160).optional(),
	startDate: z.string().refine((s) => !Number.isNaN(Date.parse(s)), { message: "Invalid startDate" }).optional(),
	endDate: z.string().refine((s) => !Number.isNaN(Date.parse(s)), { message: "Invalid endDate" }).optional(),
	status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
	rejectionReason: z.string().min(2).max(500).optional(),
})

type Params = { params: { id: string } }

export async function PATCH(request: NextRequest, { params }: Params) {
	try {
		const claims = getAuthClaims(request)
		if (!claims) return unauthorized()

		const leaveRequest = await prisma.leaveRequest.findUnique({ where: { id: params.id } })
		if (!leaveRequest) return badRequest("Leave request not found")

		const isOwner = leaveRequest.userId === claims.userId
		const canApprove = claims.role === "admin" || claims.role === "warden"

		if (!isOwner && !canApprove) {
			return unauthorized("You do not have permission to update this leave request")
		}

		const json = await request.json().catch(() => ({}))
		const parsed = UpdateLeaveSchema.safeParse(json)
		if (!parsed.success) return badRequest("Invalid leave request update payload", parsed.error.format())

		const data: {
			reason?: string
			destination?: string
			startDate?: Date
			endDate?: Date
			status?: "PENDING" | "APPROVED" | "REJECTED"
			rejectionReason?: string
			approvedBy?: string
			approvedAt?: Date | null
		} = {}

		if (isOwner && !canApprove) {
			if (parsed.data.reason) data.reason = parsed.data.reason
			if (parsed.data.destination) data.destination = parsed.data.destination
			if (parsed.data.startDate) data.startDate = new Date(parsed.data.startDate)
			if (parsed.data.endDate) data.endDate = new Date(parsed.data.endDate)
		} else {
			if (parsed.data.status) data.status = parsed.data.status
			if (parsed.data.rejectionReason) data.rejectionReason = parsed.data.rejectionReason
			if (parsed.data.status === "APPROVED") {
				data.approvedBy = claims.userId
				data.approvedAt = new Date()
				data.rejectionReason = undefined
			}
			if (parsed.data.status === "REJECTED") {
				data.approvedBy = claims.userId
				data.approvedAt = new Date()
			}
		}

		if (data.startDate && data.endDate && data.endDate < data.startDate) {
			return badRequest("endDate must be after startDate")
		}

		const updatedLeaveRequest = await prisma.leaveRequest.update({
			where: { id: params.id },
			data,
		})

		return ok({ leaveRequest: updatedLeaveRequest })
	} catch (err) {
		return serverError("Failed to update leave request", err)
	}
}
