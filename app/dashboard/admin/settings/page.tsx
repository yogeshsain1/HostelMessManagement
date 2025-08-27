"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState("Hostel Mess Management");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [password, setPassword] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [role, setRole] = useState("admin");
  const [logo, setLogo] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleSave = () => {
    setFeedback("");
    setTimeout(() => {
      setFeedback("Admin settings saved!");
    }, 1000);
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Admin Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Site Name</label>
            <Input value={siteName} onChange={e => setSiteName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Admin Email</label>
            <Input value={adminEmail} onChange={e => setAdminEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Change Password</label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="New password" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Maintenance Mode</label>
            <input type="checkbox" checked={maintenanceMode} onChange={e => setMaintenanceMode(e.target.checked)} /> Enable maintenance mode
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">System Announcement</label>
            <Input value={announcement} onChange={e => setAnnouncement(e.target.value)} placeholder="Enter announcement" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Manage User Role</label>
            <select value={role} onChange={e => setRole(e.target.value)} className="w-full border rounded px-2 py-1">
              <option value="admin">Admin</option>
              <option value="warden">Warden</option>
              <option value="student">Student</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Custom Branding (Logo URL)</label>
            <Input value={logo} onChange={e => setLogo(e.target.value)} placeholder="Logo image URL" />
          </div>
          {feedback && <div className="text-sm text-green-600 mt-2">{feedback}</div>}
          <Button onClick={handleSave} className="mt-4">Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
