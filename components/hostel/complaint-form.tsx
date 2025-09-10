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

export function ComplaintForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const validateField = (field: string, value: string) => {
    const errors = { ...fieldErrors }

    switch (field) {
      case "title":
        if (!value.trim()) {
          errors.title = "Title is required"
        } else if (value.length < 5) {
          errors.title = "Title must be at least 5 characters"
        } else {
          delete errors.title
        }
        break
      case "description":
        if (!value.trim()) {
          errors.description = "Description is required"
        } else if (value.length < 10) {
          errors.description = "Description must be at least 10 characters"
        } else {
          delete errors.description
        }
        break
      case "category":
        if (!value) {
          errors.category = "Please select a category"
        } else {
          delete errors.category
        }
        break
      case "priority":
        if (!value) {
          errors.priority = "Please select a priority level"
        } else {
          delete errors.priority
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

      // Map priority to API format
      const priorityMap = {
        low: "LOW",
        medium: "MEDIUM",
        high: "HIGH",
        urgent: "CRITICAL"
      }

      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          priority: priorityMap[formData.priority as keyof typeof priorityMap],
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit complaint')
      }

      const result = await response.json()
      setSubmitted(true)
      setFormData({ title: "", description: "", category: "", priority: "" })
      setFieldErrors({})

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000)
    } catch (error: any) {
      setSubmitError(error.message || 'Failed to submit complaint. Please try again.')
      console.error("Failed to submit complaint:", error)
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
        <CardTitle>File a Complaint</CardTitle>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-green-800 mb-2">Complaint Submitted Successfully!</h3>
            <p className="text-sm text-green-600">Your complaint has been registered and will be reviewed shortly.</p>
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
                <Label htmlFor="title">Complaint Title *</Label>
                <Input
                  id="title"
                  placeholder="Brief description of the issue"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  onBlur={(e) => handleBlur("title", e.target.value)}
                  className={fieldErrors.title ? "border-red-500" : ""}
                  disabled={isSubmitting}
                />
                {fieldErrors.title && (
                  <p className="text-sm text-red-600">{fieldErrors.title}</p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange("category", value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className={fieldErrors.category ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="cleanliness">Cleanliness</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldErrors.category && (
                    <p className="text-sm text-red-600">{fieldErrors.category}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Priority *</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => handleInputChange("priority", value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className={fieldErrors.priority ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldErrors.priority && (
                    <p className="text-sm text-red-600">{fieldErrors.priority}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about the issue..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  onBlur={(e) => handleBlur("description", e.target.value)}
                  className={fieldErrors.description ? "border-red-500" : ""}
                  rows={4}
                  disabled={isSubmitting}
                />
                {fieldErrors.description && (
                  <p className="text-sm text-red-600">{fieldErrors.description}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {formData.description.length}/500 characters
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
                  "Submit Complaint"
                )}
              </Button>
            </form>
          </>
        )}
      </CardContent>
    </Card>
  )
}
