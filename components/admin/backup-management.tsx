'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'
import { Download, Trash2, Database, RotateCcw, Plus, Calendar, HardDrive } from 'lucide-react'
import { format } from 'date-fns'

interface Backup {
  filename: string
  type: 'database' | 'sql'
  timestamp: string
  createdAt: Date
}

export default function BackupManagement() {
  const [backups, setBackups] = useState<Backup[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [restoring, setRestoring] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchBackups()
  }, [])

  const fetchBackups = async () => {
    try {
      const response = await fetch('/api/backup?action=list')
      if (response.ok) {
        const data = await response.json()
        setBackups(data.backups || [])
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch backups',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error fetching backups:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch backups',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const createBackup = async () => {
    setCreating(true)
    try {
      const response = await fetch('/api/backup', {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: 'Success',
          description: `Backup created successfully: ${data.files.database}`,
        })
        fetchBackups()
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Failed to create backup',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error creating backup:', error)
      toast({
        title: 'Error',
        description: 'Failed to create backup',
        variant: 'destructive',
      })
    } finally {
      setCreating(false)
    }
  }

  const downloadBackup = async (filename: string) => {
    try {
      const response = await fetch(`/api/backup?filename=${encodeURIComponent(filename)}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: 'Success',
          description: 'Backup downloaded successfully',
        })
      } else {
        toast({
          title: 'Error',
          description: 'Failed to download backup',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error downloading backup:', error)
      toast({
        title: 'Error',
        description: 'Failed to download backup',
        variant: 'destructive',
      })
    }
  }

  const deleteBackup = async (filename: string) => {
    try {
      const response = await fetch(`/api/backup?filename=${encodeURIComponent(filename)}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Backup deleted successfully',
        })
        fetchBackups()
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete backup',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error deleting backup:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete backup',
        variant: 'destructive',
      })
    }
  }

  const restoreBackup = async (filename: string) => {
    setRestoring(filename)
    try {
      const response = await fetch('/api/backup?action=restore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename }),
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: 'Success',
          description: `Database restored successfully. Pre-restore backup: ${data.backupCreated}`,
        })
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Failed to restore backup',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error restoring backup:', error)
      toast({
        title: 'Error',
        description: 'Failed to restore backup',
        variant: 'destructive',
      })
    } finally {
      setRestoring(null)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center">
            <HardDrive className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading backups...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Backup Management</h2>
          <p className="text-muted-foreground">Create and manage database backups</p>
        </div>
        <Button onClick={createBackup} disabled={creating}>
          <Plus className="w-4 h-4 mr-2" />
          {creating ? 'Creating...' : 'Create Backup'}
        </Button>
      </div>

      <div className="grid gap-4">
        {backups.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-48">
              <div className="text-center">
                <Database className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No backups found</p>
                <p className="text-sm text-muted-foreground">Create your first backup to get started</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          backups.map((backup) => (
            <Card key={backup.filename}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Database className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{backup.filename}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {format(backup.createdAt, 'PPP p')}
                        <Badge variant={backup.type === 'database' ? 'default' : 'secondary'}>
                          {backup.type.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadBackup(backup.filename)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={restoring === backup.filename}
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          {restoring === backup.filename ? 'Restoring...' : 'Restore'}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Restore Database</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to restore the database from this backup?
                            This action will replace the current database and cannot be undone.
                            A backup of the current database will be created automatically.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => restoreBackup(backup.filename)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Restore
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Backup</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this backup file? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteBackup(backup.filename)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
