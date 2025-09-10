"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Loader2 } from "lucide-react"

export function LeaveRequestForm() {
  const [formData, setFormData] = useState({
    type: "",
    startDate: "",
    endDate: "",
    reason: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const validateField = (field: string, value: string) => {
    const errors = { ...fieldErrors }

    switch (field) {
      case "type":
        if (!value) {
          errors.type = "Please select leave type"
        } else {
          delete errors.type
        }
        break
      case "startDate":
        if (!value) {
          errors.startDate = "Start date is required"
        } else {
          delete errors.startDate
        }
        break
      case "endDate":
        if (!value) {
          errors.endDate = "End date is required"
        } else if (formData.startDate && new Date(value) < new Date(formData.startDate)) {
          errors.endDate = "End date must be after start date"
        } else {
          delete errors.endDate
        }
        break
      case "reason":
        if (!value.trim()) {
          errors.reason = "Reason is required"
        } else if (value.length < 10) {
          errors.reason = "Reason must be at least 10 characters"
        } else {
          delete errors.reason
        }
        break
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    const isValid = Object.entries(formData).every(([field, value]) =>
      validateField(field, value)
    )

    if (!isValid) return

    try {
      setIsSubmitting(true)
      setSubmitError("")

      // Convert dates to ISO strings with time
      const startDateTime = new Date(formData.startDate).toISOString()
      const endDateTime = new Date(formData.endDate).toISOString()

      const response = await fetch('/api/leave-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: formData.type,
          reason: formData.reason,
          startDate: startDateTime,
          endDate: endDateTime,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit leave request')
      }

      const result = await response.json()
      setSubmitted(true)
      setFormData({ type: "", startDate: "", endDate: "", reason: "" })
      setFieldErrors({})

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000)
    } catch (error: any) {
      setSubmitError(error.message || 'Failed to submit leave request. Please try again.')
      console.error("Failed to submit leave request:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      const errors = { ...fieldErrors }
      delete errors[field]
      setFieldErrors(errors)
    }

    // Re-validate end date when start date changes
    if (field === "startDate" && formData.endDate) {
      validateField("endDate", formData.endDate)
    }
  }

  const handleBlur = (field: string, value: string) => {
    validateField(field, value)
  }

  const isFormValid = () => {
    return Object.values(formData).every(value => value.trim() !== "") &&
           Object.keys(fieldErrors).length === 0
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
          <>
            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Leave Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleInputChange("type", value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className={fieldErrors.type ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SICK_LEAVE">Sick Leave</SelectItem>
                    <SelectItem value="CASUAL_LEAVE">Casual Leave</SelectItem>
                    <SelectItem value="EMERGENCY_LEAVE">Emergency Leave</SelectItem>
                    <SelectItem value="FAMILY_LEAVE">Family Leave</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
                {fieldErrors.type && (
                  <p className="text-sm text-red-600">{fieldErrors.type}</p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange("startDate", e.target.value)}
                    onBlur={(e) => handleBlur("startDate", e.target.value)}
                    className={fieldErrors.startDate ? "border-red-500" : ""}
                    disabled={isSubmitting}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                  {fieldErrors.startDate && (
                    <p className="text-sm text-red-600">{fieldErrors.startDate}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange("endDate", e.target.value)}
                    onBlur={(e) => handleBlur("endDate", e.target.value)}
                    className={fieldErrors.endDate ? "border-red-500" : ""}
                    disabled={isSubmitting}
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                    required
                  />
                  {fieldErrors.endDate && (
                    <p className="text-sm text-red-600">{fieldErrors.endDate}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Leave *</Label>
                <Textarea
                  id="reason"
                  placeholder="Please provide the reason for your leave request..."
                  value={formData.reason}
                  onChange={(e) => handleInputChange("reason", e.target.value)}
                  onBlur={(e) => handleBlur("reason", e.target.value)}
                  className={fieldErrors.reason ? "border-red-500" : ""}
                  rows={4}
                  disabled={isSubmitting}
                  required
                />
                {fieldErrors.reason && (
                  <p className="text-sm text-red-600">{fieldErrors.reason}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {formData.reason.length}/500 characters
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!isFormValid() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  "Submit Leave Request"
                )}
              </Button>
            </form>
          </>
        )}
      </CardContent>
    </Card>
  )
}
