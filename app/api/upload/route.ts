import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const form = await request.formData()
    const file = form.get("file") as File | null
    if (!file) {
      return NextResponse.json({ success: false, error: { code: "NO_FILE", message: "No file uploaded" } }, { status: 400 })
    }

    // Demo-only: convert to data URL and return; client should persist in profile
    const arrayBuffer = await file.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString("base64")
    const dataUrl = `data:${file.type};base64,${base64}`

    return NextResponse.json({ success: true, data: { url: dataUrl, name: file.name, size: file.size, type: file.type } })
  } catch (err) {
    return NextResponse.json({ success: false, error: { code: "UPLOAD_ERROR", message: "Failed to upload", details: String(err) } }, { status: 500 })
  }
}


