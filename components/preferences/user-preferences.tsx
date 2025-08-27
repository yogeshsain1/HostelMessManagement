'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { Settings, Palette, Bell, Layout, Globe, RotateCcw } from 'lucide-react'

interface UserPreferences {
  id: string
  theme: string
  language: string
  timezone: string
  notifications: string
  dashboardLayout: string
}

interface NotificationSettings {
  email: boolean
  push: boolean
  complaints: boolean
  events: boolean
  maintenance: boolean
  leave: boolean
}

interface DashboardLayout {
  showStats: boolean
  showRecentActivity: boolean
  showQuickActions: boolean
  compactMode: boolean
}

export default function UserPreferencesComponent() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email: true,
    push: true,
    complaints: true,
    events: true,
    maintenance: true,
    leave: true,
  })
  const [dashboardLayout, setDashboardLayout] = useState<DashboardLayout>({
    showStats: true,
    showRecentActivity: true,
    showQuickActions: true,
    compactMode: false,
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchPreferences()
  }, [])

  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/preferences')
      if (response.ok) {
        const data = await response.json()
        setPreferences(data)

        // Parse notification settings
        if (data.notifications) {
          try {
            const parsed = JSON.parse(data.notifications)
            setNotificationSettings({ ...notificationSettings, ...parsed })
          } catch (error) {
            console.error('Error parsing notification settings:', error)
          }
        }

        // Parse dashboard layout
        if (data.dashboardLayout) {
          try {
            const parsed = JSON.parse(data.dashboardLayout)
            setDashboardLayout({ ...dashboardLayout, ...parsed })
          } catch (error) {
            console.error('Error parsing dashboard layout:', error)
          }
        }
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch preferences',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error fetching preferences:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch preferences',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const savePreferences = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          theme: preferences?.theme,
          language: preferences?.language,
          timezone: preferences?.timezone,
          notifications: notificationSettings,
          dashboardLayout: dashboardLayout,
        }),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Preferences saved successfully',
        })
        fetchPreferences() // Refresh data
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Failed to save preferences',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error saving preferences:', error)
      toast({
        title: 'Error',
        description: 'Failed to save preferences',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const resetPreferences = async () => {
    try {
      const response = await fetch('/api/preferences', {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Preferences reset to defaults',
        })
        fetchPreferences()
      } else {
        toast({
          title: 'Error',
          description: 'Failed to reset preferences',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error resetting preferences:', error)
      toast({
        title: 'Error',
        description: 'Failed to reset preferences',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center">
            <Settings className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading preferences...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Preferences</h2>
          <p className="text-muted-foreground">Customize your dashboard experience</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={resetPreferences}
            disabled={saving}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={savePreferences} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="theme">Theme</Label>
              <Select
                value={preferences?.theme || 'light'}
                onValueChange={(value: string) => setPreferences(prev => prev ? { ...prev, theme: value } : null)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="language">Language</Label>
              <Select
                value={preferences?.language || 'en'}
                onValueChange={(value: string) => setPreferences(prev => prev ? { ...prev, language: value } : null)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                value={preferences?.timezone || 'UTC'}
                onChange={(e) => setPreferences(prev => prev ? { ...prev, timezone: e.target.value } : null)}
                placeholder="UTC"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <Switch
                id="email-notifications"
                checked={notificationSettings.email}
                onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, email: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <Switch
                id="push-notifications"
                checked={notificationSettings.push}
                onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, push: checked }))}
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Notification Types</Label>

              <div className="flex items-center justify-between">
                <Label htmlFor="complaints-notifications">Complaints</Label>
                <Switch
                  id="complaints-notifications"
                  checked={notificationSettings.complaints}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, complaints: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="events-notifications">Events</Label>
                <Switch
                  id="events-notifications"
                  checked={notificationSettings.events}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, events: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="maintenance-notifications">Maintenance</Label>
                <Switch
                  id="maintenance-notifications"
                  checked={notificationSettings.maintenance}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, maintenance: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="leave-notifications">Leave Requests</Label>
                <Switch
                  id="leave-notifications"
                  checked={notificationSettings.leave}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, leave: checked }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Layout */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layout className="w-5 h-5" />
              Dashboard Layout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-stats">Show Statistics Cards</Label>
                  <Switch
                    id="show-stats"
                    checked={dashboardLayout.showStats}
                    onCheckedChange={(checked) => setDashboardLayout(prev => ({ ...prev, showStats: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="show-activity">Show Recent Activity</Label>
                  <Switch
                    id="show-activity"
                    checked={dashboardLayout.showRecentActivity}
                    onCheckedChange={(checked) => setDashboardLayout(prev => ({ ...prev, showRecentActivity: checked }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-actions">Show Quick Actions</Label>
                  <Switch
                    id="show-actions"
                    checked={dashboardLayout.showQuickActions}
                    onCheckedChange={(checked) => setDashboardLayout(prev => ({ ...prev, showQuickActions: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="compact-mode">Compact Mode</Label>
                  <Switch
                    id="compact-mode"
                    checked={dashboardLayout.compactMode}
                    onCheckedChange={(checked) => setDashboardLayout(prev => ({ ...prev, compactMode: checked }))}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
