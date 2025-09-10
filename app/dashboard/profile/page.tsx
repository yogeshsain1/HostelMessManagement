"use client"

import { useRef, useState } from "react"
import { useAuth } from "@/lib/auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  User, 
  Mail, 
  Phone, 
  Home, 
  Calendar, 
  Shield,
  Edit3,
  Save,
  X,
  CheckCircle,
  ImagePlus,
  Lock
} from "lucide-react"
import { toast } from "sonner"

export default function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState({
    email: user?.email || "",
    phone: user?.phone || "",
    addressLine1: user?.addressLine1 || "",
    addressLine2: user?.addressLine2 || "",
    city: user?.city || "",
    state: user?.state || "",
    postalCode: user?.postalCode || "",
    emergencyContactName: user?.emergencyContactName || "",
    emergencyContactPhone: user?.emergencyContactPhone || "",
    course: user?.course || "",
    year: user?.year || "",
    profileImageUrl: user?.profileImageUrl || "",
  })
  const [pwd, setPwd] = useState({ currentPassword: "", newPassword: "", confirm: "" })
  const [twoFAEnabled, setTwoFAEnabled] = useState<boolean>(user?.twoFactorEnabled ?? false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  if (!user) {
    return null
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditedUser({
      email: user.email,
      phone: user.phone || "",
      addressLine1: user.addressLine1 || "",
      addressLine2: user.addressLine2 || "",
      city: user.city || "",
      state: user.state || "",
      postalCode: user.postalCode || "",
      emergencyContactName: user.emergencyContactName || "",
      emergencyContactPhone: user.emergencyContactPhone || "",
      course: user.course || "",
      year: user.year || "",
      profileImageUrl: user.profileImageUrl || "",
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedUser({
      email: user.email,
      phone: user.phone || "",
      addressLine1: user.addressLine1 || "",
      addressLine2: user.addressLine2 || "",
      city: user.city || "",
      state: user.state || "",
      postalCode: user.postalCode || "",
      emergencyContactName: user.emergencyContactName || "",
      emergencyContactPhone: user.emergencyContactPhone || "",
      course: user.course || "",
      year: user.year || "",
      profileImageUrl: user.profileImageUrl || "",
    })
  }

  const handleSave = async () => {
    try {
      const res = await fetch("/api/users", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(editedUser) })
      const json = await res.json()
      if (!res.ok || json?.success === false) throw new Error("Failed to update")
      toast.success("Profile updated successfully!")
      setIsEditing(false)
    } catch (e) {
      toast.error("Could not update profile")
    }
  }

  const handleAvatarClick = () => fileInputRef.current?.click()

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const form = new FormData()
    form.append("file", file)
    try {
      const res = await fetch("/api/upload", { method: "POST", body: form })
      const json = await res.json()
      if (!res.ok || json?.success === false) throw new Error("Upload failed")
      setEditedUser((prev) => ({ ...prev, profileImageUrl: json.data.url }))
      toast.success("Photo uploaded")
    } catch (_) {
      toast.error("Upload failed")
    }
  }

  const handleChangePassword = async () => {
    if (pwd.newPassword !== pwd.confirm) {
      toast.error("Passwords do not match")
      return
    }
    try {
      const res = await fetch("/api/users?action=change-password", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ currentPassword: pwd.currentPassword, newPassword: pwd.newPassword }) })
      const json = await res.json()
      if (!res.ok || json?.success === false) throw new Error("Change failed")
      toast.success("Password changed")
      setPwd({ currentPassword: "", newPassword: "", confirm: "" })
    } catch (_) {
      toast.error("Could not change password")
    }
  }

  const handleSetup2FA = async () => {
    try {
      const res = await fetch("/api/auth", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "setup-2fa" }) })
      const json = await res.json()
      if (!res.ok || json?.success === false) throw new Error("2FA setup failed")
      toast.message("2FA Setup", { description: "Use your authenticator app to add the provided secret." })
    } catch (_) {
      toast.error("Failed to start 2FA setup")
    }
  }

  const handleVerify2FA = async (token: string) => {
    try {
      const res = await fetch("/api/auth", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "verify-2fa", token }) })
      const json = await res.json()
      if (!res.ok || json?.success === false) throw new Error("2FA verify failed")
      setTwoFAEnabled(true)
      toast.success("2FA enabled")
    } catch (_) {
      toast.error("Invalid 2FA code")
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800'
      case 'warden':
        return 'bg-blue-100 text-blue-800'
      case 'student':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-muted-foreground">Manage your account information</p>
          </div>
          {!isEditing && (
            <Button onClick={handleEdit} className="flex items-center space-x-2">
              <Edit3 className="h-4 w-4" />
              <span>Edit Profile</span>
            </Button>
          )}
        </div>

        {/* Profile Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Personal Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={editedUser.profileImageUrl || "/placeholder-user.jpg"} alt={user.fullName} />
                  <AvatarFallback className="text-2xl">
                    {user.fullName.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                <div className="text-center">
                  <h2 className="text-xl font-semibold">{user.fullName}</h2>
                  <Badge className={getRoleColor(user.role)}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                  {isEditing && (
                    <div className="mt-2">
                      <Button variant="outline" size="sm" onClick={handleAvatarClick}>
                        <ImagePlus className="h-4 w-4 mr-1" /> Change Photo
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Information Grid */}
              <div className="flex-1 grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Full Name</span>
                  </Label>
                  <p className="font-medium">{user.fullName}</p>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Student ID</span>
                  </Label>
                  <p className="font-medium">{user.id}</p>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editedUser.email}
                      onChange={(e) => setEditedUser(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email"
                    />
                  ) : (
                    <p className="font-medium">{user.email}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>Phone</span>
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editedUser.phone}
                      onChange={(e) => setEditedUser(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <p className="font-medium">{user.phone || "Not provided"}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
                    <Home className="h-4 w-4" />
                    <span>Address</span>
                  </Label>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Input placeholder="Address line 1" value={editedUser.addressLine1} onChange={(e) => setEditedUser(prev => ({ ...prev, addressLine1: e.target.value }))} />
                      <Input placeholder="Address line 2" value={editedUser.addressLine2} onChange={(e) => setEditedUser(prev => ({ ...prev, addressLine2: e.target.value }))} />
                      <div className="grid grid-cols-3 gap-2">
                        <Input placeholder="City" value={editedUser.city} onChange={(e) => setEditedUser(prev => ({ ...prev, city: e.target.value }))} />
                        <Input placeholder="State" value={editedUser.state} onChange={(e) => setEditedUser(prev => ({ ...prev, state: e.target.value }))} />
                        <Input placeholder="Postal Code" value={editedUser.postalCode} onChange={(e) => setEditedUser(prev => ({ ...prev, postalCode: e.target.value }))} />
                      </div>
                    </div>
                  ) : (
                    <p className="font-medium">{[user.addressLine1, user.addressLine2, user.city, user.state, user.postalCode].filter(Boolean).join(', ') || 'Not provided'}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Room Number</span>
                  </Label>
                  <p className="font-medium">{user.roomNumber || "Not assigned"}</p>
                </div>

                {user.role === 'student' && (
                  <>
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-muted-foreground">Course</Label>
                      {isEditing ? (
                        <Input value={editedUser.course} onChange={(e) => setEditedUser(prev => ({ ...prev, course: e.target.value }))} placeholder="e.g., B.Tech CSE" />
                      ) : (
                        <p className="font-medium">{user.course || 'Not provided'}</p>
                      )}
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-muted-foreground">Year</Label>
                      {isEditing ? (
                        <Input value={editedUser.year} onChange={(e) => setEditedUser(prev => ({ ...prev, year: e.target.value }))} placeholder="e.g., 3rd Year" />
                      ) : (
                        <p className="font-medium">{user.year || 'Not provided'}</p>
                      )}
                    </div>
                  </>
                )}

                <div className="space-y-3 md:col-span-2">
                  <Label className="text-sm font-medium text-muted-foreground">Emergency Contact</Label>
                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="Name" value={editedUser.emergencyContactName} onChange={(e) => setEditedUser(prev => ({ ...prev, emergencyContactName: e.target.value }))} />
                      <Input placeholder="Phone" value={editedUser.emergencyContactPhone} onChange={(e) => setEditedUser(prev => ({ ...prev, emergencyContactPhone: e.target.value }))} />
                    </div>
                  ) : (
                    <p className="font-medium">{editedUser.emergencyContactName && editedUser.emergencyContactPhone ? `${editedUser.emergencyContactName} (${editedUser.emergencyContactPhone})` : 'Not provided'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Edit Actions */}
            {isEditing && (
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Security */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Account Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                </div>
                {twoFAEnabled ? (
                  <Badge variant="secondary">Enabled</Badge>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleSetup2FA}>Setup</Button>
                    <div className="flex items-center gap-2">
                      <Input placeholder="Enter 6-digit code" className="w-36" onKeyDown={(e) => {
                        if (e.key === 'Enter') handleVerify2FA((e.target as HTMLInputElement).value)
                      }} />
                      <Button size="sm" onClick={() => {
                        const el = (document.activeElement as HTMLInputElement)
                        handleVerify2FA(el?.value || "")
                      }}>Verify</Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <Lock className="h-5 w-5 text-green-600" />
                  <div>
                    <h4 className="font-medium">Password</h4>
                    <p className="text-sm text-muted-foreground">Change your account password</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input type="password" placeholder="Current" className="w-28" value={pwd.currentPassword} onChange={(e) => setPwd(prev => ({ ...prev, currentPassword: e.target.value }))} />
                  <Input type="password" placeholder="New" className="w-28" value={pwd.newPassword} onChange={(e) => setPwd(prev => ({ ...prev, newPassword: e.target.value }))} />
                  <Input type="password" placeholder="Confirm" className="w-28" value={pwd.confirm} onChange={(e) => setPwd(prev => ({ ...prev, confirm: e.target.value }))} />
                  <Button variant="outline" size="sm" onClick={handleChangePassword}>Update</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Profile updated - 2 days ago</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Password changed - 30 days ago</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm">Account created - 3 months ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

