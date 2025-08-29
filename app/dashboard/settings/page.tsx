"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";

export default function SettingsPage() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
    const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [feedback, setFeedback] = useState("");

  // Simulate API call for saving settings
  const handleSave = async () => {
    setFeedback("");
    try {
      // Simulate API call delay
      await new Promise(res => setTimeout(res, 1000));
      setFeedback("Settings saved successfully!");
    } catch (err) {
      setFeedback("Error saving settings. Please try again.");
    }
  };

  // Simulate enabling/disabling 2FA
  const handleToggle2FA = () => {
    setTwoFAEnabled(!twoFAEnabled);
    setFeedback(twoFAEnabled ? "Two-factor authentication disabled." : "Two-factor authentication enabled.");
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>User Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <Input value={fullName} onChange={e => setFullName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Change Password</label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="New password" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Theme</label>
            <select value={theme} onChange={e => setTheme(e.target.value)} className="w-full border rounded px-2 py-1">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notification Preferences</label>
            <div className="flex gap-4">
              <label><input type="checkbox" checked={notifications} onChange={e => setNotifications(e.target.checked)} /> In-app</label>
              <label><input type="checkbox" checked={emailNotifications} onChange={e => setEmailNotifications(e.target.checked)} /> Email</label>
              <label><input type="checkbox" checked={smsNotifications} onChange={e => setSmsNotifications(e.target.checked)} /> SMS</label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Two-factor Authentication (2FA)</label>
            <Button variant={twoFAEnabled ? "destructive" : "default"} onClick={handleToggle2FA} className="ml-2">
              {twoFAEnabled ? "Disable 2FA" : "Enable 2FA"}
            </Button>
          </div>
          {feedback && <div className="text-sm text-green-600 mt-2">{feedback}</div>}
          <Button onClick={handleSave} className="mt-4">Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
