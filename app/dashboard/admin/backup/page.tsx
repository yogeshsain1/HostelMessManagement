"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database } from "lucide-react"

export default function BackupPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Backup & Restore</h1>
          <p className="text-muted-foreground mt-1">Manage system backups and data restoration</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Backup Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Backup and restore functionality coming soon.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
