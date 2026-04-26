import { NextRequest } from "next/server"
import { ok } from "@/lib/api"

export async function PATCH(_request: NextRequest, { params }: { params: { id: string } }) {
	return ok({ updated: true, id: params.id })
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
	return ok({ deleted: true, id: params.id })
}
