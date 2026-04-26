"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle } from "lucide-react"

export function LeaveRequestForm() {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    reason: "",
    destination: "",
    type: "PERSONAL",
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.startDate || !formData.endDate || !formData.reason) {
      setError("Please complete all required fields")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/leave-requests", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          startDate: formData.startDate,
          endDate: formData.endDate,
          reason: formData.reason,
          destination: formData.destination || undefined,
          type: formData.type,
        }),
      })

      const json = await response.json()
      if (!response.ok || !json?.success) {
        throw new Error(json?.error?.message || "Unable to submit leave request")
      }

      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setFormData({ startDate: "", endDate: "", reason: "", destination: "", type: "PERSONAL" })
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit leave request")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Leave</CardTitle>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-green-800 mb-2">Leave Request Submitted!</h3>
            <p className="text-sm text-green-600">Your leave request has been sent to the warden for approval.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="space-y-2">
              <Label htmlFor="type">Leave Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERSONAL">Personal</SelectItem>
                  <SelectItem value="MEDICAL">Medical</SelectItem>
                  <SelectItem value="ACADEMIC">Academic</SelectItem>
                  <SelectItem value="EMERGENCY">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">Destination (Optional)</Label>
              <Input
                id="destination"
                placeholder="Where will you be staying?"
                value={formData.destination}
                onChange={(e) => handleInputChange("destination", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Leave</Label>
              <Textarea
                id="reason"
                placeholder="Please provide the reason for your leave request..."
                value={formData.reason}
                onChange={(e) => handleInputChange("reason", e.target.value)}
                rows={4}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!formData.startDate || !formData.endDate || !formData.reason || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Leave Request"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
