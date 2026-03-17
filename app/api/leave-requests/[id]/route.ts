import { z } from "zod"
import { badRequest, ok, serverError } from "@/lib/api"
import type { NextRequest } from "next/server"

const UpdateLeaveSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]),
  comment: z.string().max(300).optional(),
})

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    return ok({ request: { id, status: "pending", createdAt: new Date().toISOString() } })
  } catch (err) {
    return serverError("Failed to fetch leave request", err)
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const json = await request.json().catch(() => ({}))
    const parsed = UpdateLeaveSchema.safeParse(json)
    if (!parsed.success) {
      return badRequest("Invalid update data", parsed.error.format())
    }
    return ok({ request: { id, ...parsed.data, updatedAt: new Date().toISOString() } })
  } catch (err) {
    return serverError("Failed to update leave request", err)
  }
}
