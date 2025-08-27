"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { QrCode, Download, RefreshCw } from "lucide-react"

interface QRGeneratorProps {
  mealType: "breakfast" | "lunch" | "dinner"
  date: string
}

export function QRGenerator({ mealType, date }: QRGeneratorProps) {
  const [qrData, setQrData] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const generateQRData = () => {
    // Generate QR data with meal info and timestamp
    const timestamp = Date.now()
    const data = JSON.stringify({
      mealType,
      date,
      timestamp,
      hostelId: "sunrise-hostel",
      action: "mess-attendance",
    })
    return btoa(data) // Base64 encode for QR
  }

  const generateQR = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setQrData(generateQRData())
      setIsGenerating(false)
    }, 1000)
  }

  useEffect(() => {
    generateQR()
  }, [mealType, date])

  const downloadQR = () => {
    // In a real app, this would generate and download the actual QR code image
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (ctx) {
      canvas.width = 200
      canvas.height = 200
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, 200, 200)
      ctx.fillStyle = "#000000"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText("QR Code", 100, 100)
      ctx.fillText(mealType.toUpperCase(), 100, 120)
      ctx.fillText(date, 100, 140)

      const link = document.createElement("a")
      link.download = `${mealType}-${date}-qr.png`
      link.href = canvas.toDataURL()
      link.click()
    }
  }

  const getMealTimeRange = (meal: string) => {
    switch (meal) {
      case "breakfast":
        return "7:00 AM - 9:00 AM"
      case "lunch":
        return "12:00 PM - 2:00 PM"
      case "dinner":
        return "7:00 PM - 9:00 PM"
      default:
        return ""
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <QrCode className="h-5 w-5" />
            <span>QR Code - {mealType.charAt(0).toUpperCase() + mealType.slice(1)}</span>
          </CardTitle>
          <Badge variant="outline">{getMealTimeRange(mealType)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="w-48 h-48 mx-auto bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center">
          {isGenerating ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Generating QR...</p>
            </div>
          ) : (
            <div className="text-center p-4">
              {/* Simulated QR Code Pattern */}
              <div className="grid grid-cols-8 gap-1 w-32 h-32 mx-auto mb-2">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 ${Math.random() > 0.5 ? "bg-black" : "bg-white"}`}
                    style={{ aspectRatio: "1" }}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Scan for {mealType} attendance</p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Date: {date}</p>
          <p className="text-sm text-muted-foreground">Valid for: {getMealTimeRange(mealType)}</p>
        </div>

        <div className="flex space-x-2">
          <Button onClick={generateQR} disabled={isGenerating} className="flex-1">
            <RefreshCw className="h-4 w-4 mr-2" />
            Regenerate
          </Button>
          <Button onClick={downloadQR} variant="outline" className="flex-1 bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>QR Code ID: {qrData.slice(-8)}</p>
          <p>Generated: {new Date().toLocaleTimeString()}</p>
        </div>
      </CardContent>
    </Card>
  )
}
