"use client"

import { useState, useEffect } from "react"
import QRCode from "qrcode"
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
  const [qrImageUrl, setQrImageUrl] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const generateQRData = () => {
    const timestamp = Date.now()
    return JSON.stringify({
      mealType,
      date,
      timestamp,
      hostelId: "sunrise-hostel",
      action: "mess-attendance",
    })
  }

  const generateQR = async () => {
    setIsGenerating(true)
    try {
      const data = generateQRData()
      const dataUrl = await QRCode.toDataURL(data, {
        width: 320,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })
      setQrData(data)
      setQrImageUrl(dataUrl)
    } catch (error) {
      console.error("Failed to generate QR code:", error)
      setQrImageUrl("")
    } finally {
      setIsGenerating(false)
    }
  }

  useEffect(() => {
    generateQR()
  }, [mealType, date])

  const downloadQR = () => {
    if (qrImageUrl) {
      const link = document.createElement("a")
      link.download = `${mealType}-${date}-qr.png`
      link.href = qrImageUrl
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
          ) : qrImageUrl ? (
            <img src={qrImageUrl} alt={`${mealType} QR code`} className="w-full h-full object-contain p-2" />
          ) : (
            <div className="text-center p-4">
              <QrCode className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Unable to generate QR code</p>
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
          <p>QR Code ID: {qrData ? btoa(qrData).slice(-8) : "N/A"}</p>
          <p>Generated: {new Date().toLocaleTimeString()}</p>
        </div>
      </CardContent>
    </Card>
  )
}
