import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { withAuth, AuthenticatedRequest } from '@/lib/middleware'

const execAsync = promisify(exec)

// Create backup
async function createBackup(req: AuthenticatedRequest) {
  try {
    // Only admins can create backups
    if (req.user!.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupDir = path.join(process.cwd(), 'backups')
    const backupFileName = `hostel_backup_${timestamp}.db`
    const backupPath = path.join(backupDir, backupFileName)

    // Create backups directory if it doesn't exist
    await mkdir(backupDir, { recursive: true })

    // Copy the SQLite database file
    const dbPath = path.join(process.cwd(), 'dev.db')
    const { cp } = await import('fs/promises')
    await cp(dbPath, backupPath)

    // Also create a SQL dump for better portability
    const sqlDumpPath = path.join(backupDir, `hostel_backup_${timestamp}.sql`)

    try {
      const { stdout } = await execAsync(`sqlite3 "${dbPath}" .dump > "${sqlDumpPath}"`)

      return NextResponse.json({
        message: 'Backup created successfully',
        files: {
          database: backupFileName,
          sqlDump: `hostel_backup_${timestamp}.sql`,
        },
        timestamp,
        size: (await import('fs/promises')).stat(backupPath).then(stat => stat.size),
      })
    } catch (sqlError) {
      console.error('Error creating SQL dump:', sqlError)
      // Return success for database backup even if SQL dump fails
      return NextResponse.json({
        message: 'Database backup created successfully (SQL dump failed)',
        files: {
          database: backupFileName,
        },
        timestamp,
      })
    }
  } catch (error) {
    console.error('Backup creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// List backups
async function listBackups(req: AuthenticatedRequest) {
  try {
    // Only admins can list backups
    if (req.user!.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const backupDir = path.join(process.cwd(), 'backups')
    const fs = await import('fs/promises')

    try {
      const files = await fs.readdir(backupDir)
      const backupFiles = files
        .filter(file => file.startsWith('hostel_backup_') && (file.endsWith('.db') || file.endsWith('.sql')))
        .map(file => {
          const isDatabase = file.endsWith('.db')
          const timestamp = file.replace('hostel_backup_', '').replace('.db', '').replace('.sql', '')
          return {
            filename: file,
            type: isDatabase ? 'database' : 'sql',
            timestamp,
            createdAt: new Date(timestamp.replace(/-/g, ':').replace('T', ' ').replace('Z', '')),
          }
        })
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

      return NextResponse.json({ backups: backupFiles })
    } catch (error) {
      // Directory doesn't exist yet
      return NextResponse.json({ backups: [] })
    }
  } catch (error) {
    console.error('List backups error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Download backup
async function downloadBackup(req: AuthenticatedRequest, { params }: { params: { filename: string } }) {
  try {
    // Only admins can download backups
    if (req.user!.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const backupDir = path.join(process.cwd(), 'backups')
    const filePath = path.join(backupDir, params.filename)

    // Validate filename to prevent directory traversal
    if (!params.filename.startsWith('hostel_backup_') ||
        (!params.filename.endsWith('.db') && !params.filename.endsWith('.sql'))) {
      return NextResponse.json(
        { error: 'Invalid filename' },
        { status: 400 }
      )
    }

    const fs = await import('fs/promises')

    try {
      const fileBuffer = await fs.readFile(filePath)

      return new NextResponse(new Uint8Array(fileBuffer), {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${params.filename}"`,
        },
      })
    } catch (error) {
      return NextResponse.json(
        { error: 'Backup file not found' },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Download backup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Delete backup
async function deleteBackup(req: AuthenticatedRequest, { params }: { params: { filename: string } }) {
  try {
    // Only admins can delete backups
    if (req.user!.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const backupDir = path.join(process.cwd(), 'backups')
    const filePath = path.join(backupDir, params.filename)

    // Validate filename to prevent directory traversal
    if (!params.filename.startsWith('hostel_backup_') ||
        (!params.filename.endsWith('.db') && !params.filename.endsWith('.sql'))) {
      return NextResponse.json(
        { error: 'Invalid filename' },
        { status: 400 }
      )
    }

    const fs = await import('fs/promises')

    try {
      await fs.unlink(filePath)
      return NextResponse.json({ message: 'Backup deleted successfully' })
    } catch (error) {
      return NextResponse.json(
        { error: 'Backup file not found' },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Delete backup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Restore from backup
async function restoreBackup(req: AuthenticatedRequest) {
  try {
    // Only admins can restore backups
    if (req.user!.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { filename } = body

    if (!filename) {
      return NextResponse.json(
        { error: 'Filename is required' },
        { status: 400 }
      )
    }

    // Validate filename
    if (!filename.startsWith('hostel_backup_') ||
        (!filename.endsWith('.db') && !filename.endsWith('.sql'))) {
      return NextResponse.json(
        { error: 'Invalid filename' },
        { status: 400 }
      )
    }

    const backupDir = path.join(process.cwd(), 'backups')
    const backupPath = path.join(backupDir, filename)
    const dbPath = path.join(process.cwd(), 'dev.db')
    const fs = await import('fs/promises')

    // Create a backup of current database before restore
    const currentBackupName = `hostel_backup_before_restore_${new Date().toISOString().replace(/[:.]/g, '-')}.db`
    const currentBackupPath = path.join(backupDir, currentBackupName)

    try {
      await fs.copyFile(dbPath, currentBackupPath)
    } catch (error) {
      console.error('Error creating pre-restore backup:', error)
    }

    if (filename.endsWith('.db')) {
      // Restore from database file
      await fs.copyFile(backupPath, dbPath)
    } else {
      // Restore from SQL dump
      await execAsync(`sqlite3 "${dbPath}" < "${backupPath}"`)
    }

    return NextResponse.json({
      message: 'Database restored successfully',
      backupCreated: currentBackupName,
    })
  } catch (error) {
    console.error('Restore backup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  const url = new URL(req.url)
  const action = url.searchParams.get('action')

  if (action === 'list') {
    return listBackups(req)
  }

  return createBackup(req)
})

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  const url = new URL(req.url)
  const action = url.searchParams.get('action')

  if (action === 'restore') {
    return restoreBackup(req)
  }

  return createBackup(req)
})

export const DELETE = withAuth(async (req: AuthenticatedRequest) => {
  const url = new URL(req.url)
  const filename = url.searchParams.get('filename')

  if (!filename) {
    return NextResponse.json(
      { error: 'Filename is required' },
      { status: 400 }
    )
  }

  return deleteBackup(req, { params: { filename } })
})
