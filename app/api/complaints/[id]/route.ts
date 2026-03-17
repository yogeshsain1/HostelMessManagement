import { z } from "zod"
import { badRequest, ok, serverError } from "@/lib/api"
import type { NextRequest } from "next/server"

const UpdateComplaintSchema = z.object({
  status: z.enum(["pending", "in-progress", "resolved"]).optional(),
  response: z.string().max(500).optional(),
})

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    return ok({ complaint: { id, title: "Sample Complaint", status: "pending", createdAt: new Date().toISOString() } })
  } catch (err) {
    return serverError("Failed to fetch complaint", err)
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const json = await request.json().catch(() => ({}))
    const parsed = UpdateComplaintSchema.safeParse(json)
    if (!parsed.success) {
      return badRequest("Invalid update data", parsed.error.format())
    }
    return ok({ complaint: { id, ...parsed.data, updatedAt: new Date().toISOString() } })
  } catch (err) {
    return serverError("Failed to update complaint", err)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    return ok({ deleted: true, id })
  } catch (err) {
    return serverError("Failed to delete complaint", err)
  }
}
