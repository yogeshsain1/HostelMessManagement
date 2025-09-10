"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { QrCode, CheckCircle, Clock, AlertCircle } from "lucide-react"

interface AttendanceRecord {
  date: string
  mealType: "breakfast" | "lunch" | "dinner"
  checkedIn: boolean
  time?: string
}

const mockAttendance: AttendanceRecord[] = [
  { date: "2024-01-15", mealType: "breakfast", checkedIn: true, time: "08:30 AM" },
  { date: "2024-01-15", mealType: "lunch", checkedIn: true, time: "12:45 PM" },
  { date: "2024-01-15", mealType: "dinner", checkedIn: false },
  { date: "2024-01-14", mealType: "breakfast", checkedIn: true, time: "08:15 AM" },
  { date: "2024-01-14", mealType: "lunch", checkedIn: true, time: "01:00 PM" },
  { date: "2024-01-14", mealType: "dinner", checkedIn: true, time: "07:30 PM" },
]

export function QRScanner() {
  const [isScanning, setIsScanning] = useState(false)
  const [lastScan, setLastScan] = useState<{ meal: string; time: string } | null>(null)

  const handleScan = () => {
    setIsScanning(true)
    // Simulate QR scan
    setTimeout(() => {
      const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      const currentHour = new Date().getHours()
      let mealType = "breakfast"

      if (currentHour >= 12 && currentHour < 16) {
        mealType = "lunch"
      } else if (currentHour >= 18) {
        mealType = "dinner"
      }

      setLastScan({ meal: mealType, time: currentTime })
      setIsScanning(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* QR Scanner */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <QrCode className="h-5 w-5" />
            <span>Mess Attendance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="w-48 h-48 mx-auto bg-muted rounded-lg flex items-center justify-center">
            {isScanning ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Scanning...</p>
              </div>
            ) : (
              <div className="text-center">
                <QrCode className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Tap to scan QR code</p>
              </div>
            )}
          </div>

          <Button onClick={handleScan} disabled={isScanning} className="w-full">
            {isScanning ? "Scanning..." : "Scan QR Code"}
          </Button>

          {lastScan && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-center space-x-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Attendance Marked!</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                {lastScan.meal.charAt(0).toUpperCase() + lastScan.meal.slice(1)} - {lastScan.time}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attendance History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockAttendance.map((record, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {record.checkedIn ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm font-medium capitalize">{record.mealType}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {record.date}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  {record.checkedIn && record.time && (
                    <>
                      <Clock className="h-3 w-3" />
                      <span>{record.time}</span>
                    </>
                  )}
                  {!record.checkedIn && <span className="text-red-600">Missed</span>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
