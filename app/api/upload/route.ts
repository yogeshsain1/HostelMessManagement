import { NextRequest, NextResponse } from 'next/server'
import multer from 'multer'
import path from 'path'
import fs from 'fs/promises'
import { withAuth, AuthenticatedRequest } from '@/lib/middleware'

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: async (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads')
      try {
        await fs.access(uploadDir)
      } catch {
        await fs.mkdir(uploadDir, { recursive: true })
      }
      cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error('Only image files (jpeg, jpg, png, gif) and documents (pdf, doc, docx) are allowed!'))
    }
  }
})

// Helper function to handle multer with Next.js
function runMiddleware(req: any, res: any, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

async function handleUpload(req: AuthenticatedRequest) {
  try {
    const formData = await req.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files uploaded' },
        { status: 400 }
      )
    }

    const uploadedFiles: string[] = []

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        return NextResponse.json(
          { error: `File ${file.name} is too large. Maximum size is 5MB.` },
          { status: 400 }
        )
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `File type ${file.type} not allowed for ${file.name}` },
          { status: 400 }
        )
      }

      // Generate unique filename
      const fileExtension = path.extname(file.name)
      const fileName = `upload-${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExtension}`
      const filePath = path.join(process.cwd(), 'public', 'uploads', fileName)

      // Ensure upload directory exists
      const uploadDir = path.join(process.cwd(), 'public', 'uploads')
      try {
        await fs.access(uploadDir)
      } catch {
        await fs.mkdir(uploadDir, { recursive: true })
      }

      // Convert file to buffer and save
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await fs.writeFile(filePath, buffer)

      uploadedFiles.push(`/uploads/${fileName}`)
    }

    return NextResponse.json({
      message: 'Files uploaded successfully',
      files: uploadedFiles
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    )
  }
}

export const POST = withAuth(handleUpload)

// GET endpoint to list uploaded files (for admin)
async function listUploads(req: AuthenticatedRequest) {
  try {
    if (req.user!.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')

    try {
      const files = await fs.readdir(uploadDir)
      const fileDetails = await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(uploadDir, file)
          const stats = await fs.stat(filePath)
          return {
            name: file,
            url: `/uploads/${file}`,
            size: stats.size,
            createdAt: stats.birthtime,
            modifiedAt: stats.mtime
          }
        })
      )

      return NextResponse.json({ files: fileDetails })
    } catch {
      return NextResponse.json({ files: [] })
    }

  } catch (error) {
    console.error('List uploads error:', error)
    return NextResponse.json(
      { error: 'Failed to list uploads' },
      { status: 500 }
    )
  }
}

export const GET = withAuth(listUploads)
