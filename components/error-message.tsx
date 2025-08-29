"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ErrorMessageProps {
  title?: string
  message: string
  type?: "error" | "warning" | "network"
  onRetry?: () => void
  showRetry?: boolean
  className?: string
}

export function ErrorMessage({ 
  title, 
  message, 
  type = "error", 
  onRetry, 
  showRetry = false,
  className 
}: ErrorMessageProps) {
  const [isRetrying, setIsRetrying] = useState(false)

  const handleRetry = async () => {
    if (onRetry) {
      setIsRetrying(true)
      try {
        await onRetry()
      } finally {
        setIsRetrying(false)
      }
    }
  }

  const getIcon = () => {
    switch (type) {
      case "network":
        return <WifiOff className="h-4 w-4" />
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getVariant = () => {
    switch (type) {
      case "warning":
        return "default"
      default:
        return "destructive"
    }
  }

  return (
    <Alert variant={getVariant()} className={className}>
      {getIcon()}
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription className="mt-2">
        {message}
        {showRetry && onRetry && (
          <div className="mt-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRetry}
              disabled={isRetrying}
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </>
              )}
            </Button>
          </div>
        )}
      </AlertDescription>
    </Alert>
  )
}

// Network Error Component
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorMessage
      title="Connection Problem"
      message="Unable to connect to the server. Please check your internet connection and try again."
      type="network"
      onRetry={onRetry}
      showRetry={!!onRetry}
    />
  )
}

// Form Error Component
export function FormError({ message, onDismiss }: { message: string; onDismiss?: () => void }) {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>{message}</span>
        {onDismiss && (
          <Button variant="ghost" size="sm" onClick={onDismiss}>
            ×
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}

// Success Message Component
export function SuccessMessage({ message, onDismiss }: { message: string; onDismiss?: () => void }) {
  return (
    <Alert className="border-green-200 bg-green-50 text-green-800 mb-4">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="h-4 w-4 rounded-full bg-green-400 flex items-center justify-center">
            <div className="h-2 w-2 bg-white rounded-full" />
          </div>
        </div>
        <AlertDescription className="ml-3 flex items-center justify-between w-full">
          <span>{message}</span>
          {onDismiss && (
            <Button variant="ghost" size="sm" onClick={onDismiss} className="text-green-800 hover:text-green-900">
              ×
            </Button>
          )}
        </AlertDescription>
      </div>
    </Alert>
  )
}

// Inline Error Component for form fields
export function InlineError({ message }: { message: string }) {
  return (
    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
      <AlertTriangle className="h-3 w-3" />
      {message}
    </p>
  )
}

// Empty State Component
export function EmptyState({ 
  title, 
  description, 
  action 
}: { 
  title: string
  description?: string
  action?: React.ReactNode 
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
        <AlertTriangle className="h-6 w-6 text-gray-600" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

// Network Status Component
export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)

  // This would be connected to actual network status detection
  // For demo purposes, showing the UI component

  if (isOnline) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Alert variant="destructive" className="w-auto">
        <WifiOff className="h-4 w-4" />
        <AlertDescription>
          You're offline. Some features may not work properly.
        </AlertDescription>
      </Alert>
    </div>
  )
}

// Loading Error Component (for failed data fetching)
export function LoadingError({ 
  message = "Failed to load data", 
  onRetry 
}: { 
  message?: string
  onRetry?: () => void 
}) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <AlertTriangle className="h-8 w-8 text-red-500 mb-4" />
      <p className="text-gray-600 mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  )
}
