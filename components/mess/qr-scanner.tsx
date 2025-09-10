"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { QrCode, CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react"

interface AttendanceRecord {
  id: string
  studentId: string
  date: string
  mealType: string
  attended: boolean
  createdAt: string
  student: {
    id: string
    fullName: string
    email: string
    role: string
  }
}

export function QRScanner() {
  const [isScanning, setIsScanning] = useState(false)
  const [lastScan, setLastScan] = useState<{ meal: string; time: string } | null>(null)
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Fetch attendance records
  const fetchAttendance = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/mess/attendance')
      if (!response.ok) {
        throw new Error('Failed to fetch attendance records')
      }
      const data = await response.json()
      setAttendanceRecords(data)
      setError("")
    } catch (err) {
      setError('Failed to load attendance records')
      console.error('Error fetching attendance:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAttendance()
  }, [])

  const handleScan = async () => {
    setIsScanning(true)
    setError("")

    try {
      const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      const currentHour = new Date().getHours()
      let mealType = "breakfast"

      if (currentHour >= 12 && currentHour < 16) {
        mealType = "lunch"
      } else if (currentHour >= 18) {
        mealType = "dinner"
      }

      // Mark attendance via API
      const response = await fetch('/api/mess/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: 'demo-student-id', // In production, get from auth context
          date: new Date().toISOString(),
          mealType,
          attended: true,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to mark attendance')
      }

      setLastScan({ meal: mealType, time: currentTime })

      // Refresh attendance records
      await fetchAttendance()
    } catch (err) {
      setError('Failed to mark attendance. Please try again.')
      console.error('Error marking attendance:', err)
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

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
            {isScanning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Scanning...
              </>
            ) : (
              "Scan QR Code"
            )}
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
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading attendance...</span>
            </div>
          ) : attendanceRecords.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No attendance records found
            </div>
          ) : (
            <div className="space-y-3">
              {attendanceRecords.slice(0, 10).map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {record.attended ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-sm font-medium capitalize">{record.mealType}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {new Date(record.date).toLocaleDateString()}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    {record.attended ? (
                      <>
                        <Clock className="h-3 w-3" />
                        <span>{new Date(record.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </>
                    ) : (
                      <span className="text-red-600">Missed</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
