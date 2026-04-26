"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { QrCode, CheckCircle, Clock, AlertCircle, Camera, ImageUp, CameraOff } from "lucide-react"

interface AttendanceRecord {
  date: string
  mealType: "breakfast" | "lunch" | "dinner"
  checkedIn: boolean
  time?: string
}

export function QRScanner() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanError, setScanError] = useState("")
  const [lastScan, setLastScan] = useState<{ meal: string; time: string; date: string; hostelId?: string } | null>(null)
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const scannerRef = useRef<any>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const scannerElementId = "mess-qr-reader"

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        const response = await fetch("/api/mess/attendance", { credentials: "include" })
        const json = await response.json().catch(() => ({}))
        if (!response.ok || !json?.success || !Array.isArray(json?.data?.attendance)) return

        setAttendanceRecords(
          json.data.attendance.slice(0, 10).map((item: any) => ({
            date: String(item.date),
            mealType: item.mealType === "breakfast" || item.mealType === "lunch" || item.mealType === "dinner" ? item.mealType : "dinner",
            checkedIn: true,
            time: item.time ? String(item.time) : undefined,
          })),
        )
      } catch (_) {
        setAttendanceRecords([])
      }
    }

    void loadAttendance()

    return () => {
      void stopScanner()
    }
  }, [])

  const handleDecodedText = (decodedText: string) => {
    try {
      const parsed = JSON.parse(decodedText)
      if (parsed?.action !== "mess-attendance" || !parsed?.mealType || !parsed?.date) {
        setScanError("This QR code is not valid for mess attendance")
        return
      }

      void fetch("/api/mess/attendance", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          mealType: parsed.mealType,
          date: parsed.date,
        }),
      }).then(async () => {
        const response = await fetch("/api/mess/attendance", { credentials: "include" })
        const json = await response.json().catch(() => ({}))
        if (response.ok && json?.success && Array.isArray(json?.data?.attendance)) {
          setAttendanceRecords(
            json.data.attendance.slice(0, 10).map((item: any) => ({
              date: String(item.date),
              mealType: item.mealType === "breakfast" || item.mealType === "lunch" || item.mealType === "dinner" ? item.mealType : "dinner",
              checkedIn: true,
              time: item.time ? String(item.time) : undefined,
            })),
          )
        }
      })

      setLastScan({
        meal: parsed.mealType,
        date: parsed.date,
        hostelId: parsed.hostelId,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      })
      setScanError("")
    } catch {
      setScanError("Unable to read this QR code")
    }
  }

  const stopScanner = async () => {
    const scanner = scannerRef.current
    if (!scanner) return

    try {
      const state = scanner.getState?.()
      if (state === 2 || state === 3) {
        await scanner.stop()
      }
      await scanner.clear()
    } catch (error) {
      console.error("Failed to stop scanner:", error)
    } finally {
      scannerRef.current = null
      setIsScanning(false)
    }
  }

  const startScanner = async () => {
    setScanError("")
    setLastScan(null)

    try {
      const { Html5Qrcode } = await import("html5-qrcode")
      await stopScanner()

      const scanner = new Html5Qrcode(scannerElementId)
      scannerRef.current = scanner
      setIsScanning(true)

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        async (decodedText: string) => {
          handleDecodedText(decodedText)
          await stopScanner()
        },
        () => {
          // ignore scan frame errors
        },
      )
    } catch (error) {
      console.error("Failed to start scanner:", error)
      setScanError("Camera access failed. Allow camera permission or scan from an image.")
      setIsScanning(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setScanError("")
    try {
      const { Html5Qrcode } = await import("html5-qrcode")
      const scanner = new Html5Qrcode(scannerElementId)
      const decodedText = await scanner.scanFile(file, true)
      handleDecodedText(decodedText)
      await scanner.clear()
    } catch (error) {
      console.error("Failed to scan image:", error)
      setScanError("Unable to scan the selected image")
    } finally {
      event.target.value = ""
    }
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
          <div id={scannerElementId} className="w-48 h-48 mx-auto bg-muted rounded-lg flex items-center justify-center overflow-hidden border">
            {isScanning ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Opening camera...</p>
              </div>
            ) : (
              <div className="text-center">
                <QrCode className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Scan admin QR code from camera or image</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Button onClick={isScanning ? stopScanner : startScanner} className="w-full">
              {isScanning ? (
                <>
                  <CameraOff className="h-4 w-4 mr-2" />
                  Stop Scanner
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4 mr-2" />
                  Start Scanner
                </>
              )}
            </Button>
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full bg-transparent">
              <ImageUp className="h-4 w-4 mr-2" />
              Scan From Image
            </Button>
          </div>

          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

          {scanError && (
            <div className="p-4 bg-red-50 rounded-lg border border-red-200 text-left">
              <div className="flex items-center space-x-2 text-red-800">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">Scan Failed</span>
              </div>
              <p className="text-sm text-red-700 mt-1">{scanError}</p>
            </div>
          )}

          {lastScan && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-center space-x-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Attendance Marked!</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                {lastScan.meal.charAt(0).toUpperCase() + lastScan.meal.slice(1)} - {lastScan.time}
              </p>
              <p className="text-xs text-green-700 mt-1">Date: {lastScan.date}</p>
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
            {attendanceRecords.map((record, index) => (
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
