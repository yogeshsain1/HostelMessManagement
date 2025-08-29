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
import { FormError, SuccessMessage, InlineError } from "@/components/error-message"
import { LoadingSpinner } from "@/components/loading-skeleton"
import { useRetry } from "@/lib/retry"

// Mock API call that can fail
const submitComplaint = async (data: any) => {
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Simulate validation errors
  if (!data.title.trim()) {
    throw new Error("Title is required")
  }
  if (!data.description.trim()) {
    throw new Error("Description is required")
  }
  if (data.description.length < 10) {
    throw new Error("Description must be at least 10 characters long")
  }
  
  // Simulate network failure
  if (Math.random() > 0.8) {
    throw new Error("Network error: Unable to submit complaint. Please try again.")
  }
  
  return { success: true, id: Date.now().toString() }
}

export function ComplaintForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const {
    execute: handleSubmitComplaint,
    isLoading: isSubmitting,
    error: submitError
  } = useRetry(submitComplaint, { maxAttempts: 2 })

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
      await handleSubmitComplaint(formData)
      setSubmitted(true)
      setFormData({ title: "", description: "", category: "", priority: "" })
      setFieldErrors({})
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000)
    } catch (error) {
      console.error("Failed to submit complaint:", error)
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
          <SuccessMessage 
            message="Complaint submitted successfully! Your complaint has been registered and will be reviewed shortly."
            onDismiss={() => setSubmitted(false)}
          />
        ) : (
          <>
            {submitError && (
              <FormError 
                message={submitError.message}
                onDismiss={() => window.location.reload()}
              />
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
                {fieldErrors.title && <InlineError message={fieldErrors.title} />}
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
                  {fieldErrors.category && <InlineError message={fieldErrors.category} />}
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
                  {fieldErrors.priority && <InlineError message={fieldErrors.priority} />}
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
                {fieldErrors.description && <InlineError message={fieldErrors.description} />}
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
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Submitting...</span>
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
