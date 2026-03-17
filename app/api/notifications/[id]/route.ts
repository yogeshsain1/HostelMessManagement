import { z } from "zod"
import { badRequest, ok, serverError } from "@/lib/api"
import type { NextRequest } from "next/server"

const UpdateNotificationSchema = z.object({
  read: z.boolean(),
})

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const json = await request.json().catch(() => ({}))
    const parsed = UpdateNotificationSchema.safeParse(json)
    if (!parsed.success) {
      return badRequest("Invalid notification data", parsed.error.format())
    }
    return ok({ notification: { id, ...parsed.data, updatedAt: new Date().toISOString() } })
  } catch (err) {
    return serverError("Failed to update notification", err)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    return ok({ deleted: true, id })
  } catch (err) {
    return serverError("Failed to delete notification", err)
  }
}
