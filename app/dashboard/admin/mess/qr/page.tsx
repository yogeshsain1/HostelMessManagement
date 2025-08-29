"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { QRGenerator } from "@/components/qr/qr-generator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { QrCode, Calendar } from "lucide-react"

export default function AdminQRPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedMeal, setSelectedMeal] = useState<"breakfast" | "lunch" | "dinner">("breakfast")
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

  const meals: Array<{ value: "breakfast" | "lunch" | "dinner"; label: string }> = [
    { value: "breakfast", label: "Breakfast" },
    { value: "lunch", label: "Lunch" },
    { value: "dinner", label: "Dinner" },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">QR Code Management</h1>
          <p className="text-muted-foreground mt-1">Generate and manage QR codes for mess attendance tracking.</p>
        </div>

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <QrCode className="h-5 w-5" />
              <span>Generate QR Code</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Meal Type</Label>
                <Select value={selectedMeal} onValueChange={(value: any) => setSelectedMeal(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select meal type" />
                  </SelectTrigger>
                  <SelectContent>
                    {meals.map((meal) => (
                      <SelectItem key={meal.value} value={meal.value}>
                        {meal.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QR Code Display */}
        <div className="grid gap-6 lg:grid-cols-2">
          <QRGenerator mealType={selectedMeal} date={selectedDate} />

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">How to use QR codes:</h4>
                <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                  <li>Generate QR code for the specific meal and date</li>
                  <li>Display the QR code at the mess entrance</li>
                  <li>Students scan the code using their mobile app</li>
                  <li>Attendance is automatically recorded in the system</li>
                  <li>View attendance reports in the analytics section</li>
                </ol>
              </div>

              <div>
                <h4 className="font-medium mb-2">Best practices:</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Generate new QR codes daily for security</li>
                  <li>Display codes 15 minutes before meal time</li>
                  <li>Ensure QR codes are clearly visible and well-lit</li>
                  <li>Keep backup printed copies available</li>
                </ul>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm">
                  <strong>Current Status:</strong> QR code is active and ready for scanning. Valid for{" "}
                  {selectedMeal === "breakfast"
                    ? "7:00 AM - 9:00 AM"
                    : selectedMeal === "lunch"
                      ? "12:00 PM - 2:00 PM"
                      : "7:00 PM - 9:00 PM"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Button
                onClick={() => {
                  setSelectedDate(new Date().toISOString().split("T")[0])
                  setSelectedMeal("breakfast")
                }}
                variant="outline"
                className="h-auto p-4 flex-col space-y-2 bg-transparent"
              >
                <span>Today's Breakfast</span>
                <span className="text-xs text-muted-foreground">7:00 AM - 9:00 AM</span>
              </Button>
              <Button
                onClick={() => {
                  setSelectedDate(new Date().toISOString().split("T")[0])
                  setSelectedMeal("lunch")
                }}
                variant="outline"
                className="h-auto p-4 flex-col space-y-2 bg-transparent"
              >
                <span>Today's Lunch</span>
                <span className="text-xs text-muted-foreground">12:00 PM - 2:00 PM</span>
              </Button>
              <Button
                onClick={() => {
                  setSelectedDate(new Date().toISOString().split("T")[0])
                  setSelectedMeal("dinner")
                }}
                variant="outline"
                className="h-auto p-4 flex-col space-y-2 bg-transparent"
              >
                <span>Today's Dinner</span>
                <span className="text-xs text-muted-foreground">7:00 PM - 9:00 PM</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
