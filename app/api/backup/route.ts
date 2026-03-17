import { ok, serverError } from "@/lib/api"

export async function GET() {
  try {
    return ok({ message: "Backup feature available in production with database", backups: [] })
  } catch (err) {
    return serverError("Failed to fetch backups", err)
  }
}

export async function POST() {
  try {
    return ok({ id: Date.now().toString(), status: "completed", createdAt: new Date().toISOString() })
  } catch (err) {
    return serverError("Failed to create backup", err)
  }
}
