import { NextRequest } from "next/server"
import { z } from "zod"
import { badRequest, ok, serverError, unauthorized } from "@/lib/api"
import { prisma } from "@/lib/prisma"
import { getAuthClaims } from "@/lib/server-auth"

const UpdateComplaintSchema = z.object({
	title: z.string().min(3).max(120).optional(),
	description: z.string().min(10).max(1000).optional(),
	category: z.string().min(2).max(60).optional(),
	priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
	status: z.enum(["PENDING", "IN_PROGRESS", "RESOLVED"]).optional(),
	assignedTo: z.string().min(2).max(120).optional(),
	resolutionNote: z.string().min(2).max(1000).optional(),
})

type Params = { params: { id: string } }

export async function PATCH(request: NextRequest, { params }: Params) {
	try {
		const claims = getAuthClaims(request)
		if (!claims) return unauthorized()

		const complaint = await prisma.complaint.findUnique({ where: { id: params.id } })
		if (!complaint) return badRequest("Complaint not found")

		if (claims.role === "student" && complaint.userId !== claims.userId) {
			return unauthorized("You do not have permission to update this complaint")
		}

		const json = await request.json().catch(() => ({}))
		const parsed = UpdateComplaintSchema.safeParse(json)
		if (!parsed.success) return badRequest("Invalid complaint update payload", parsed.error.format())

		const data: {
			title?: string
			description?: string
			category?: string
			priority?: "LOW" | "MEDIUM" | "HIGH"
			status?: "PENDING" | "IN_PROGRESS" | "RESOLVED"
			assignedTo?: string
			resolutionNote?: string
			resolvedAt?: Date | null
		} = {}

		if (claims.role === "student") {
			if (parsed.data.title) data.title = parsed.data.title
			if (parsed.data.description) data.description = parsed.data.description
			if (parsed.data.category) data.category = parsed.data.category
		} else {
			Object.assign(data, parsed.data)
			if (parsed.data.status === "RESOLVED") {
				data.resolvedAt = new Date()
			}
		}

		const updatedComplaint = await prisma.complaint.update({
			where: { id: params.id },
			data,
		})

		return ok({ complaint: updatedComplaint })
	} catch (err) {
		return serverError("Failed to update complaint", err)
	}
}
