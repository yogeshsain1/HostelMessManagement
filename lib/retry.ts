import { useState, useCallback } from "react"

interface RetryConfig {
  maxAttempts: number
  baseDelay: number
  maxDelay: number
  backoffMultiplier: number
}

interface UseRetryReturn<T> {
  execute: () => Promise<T>
  isLoading: boolean
  error: Error | null
  attempt: number
  reset: () => void
}

const defaultConfig: RetryConfig = {
  maxAttempts: 3,
  baseDelay: 1000,
  maxDelay: 30000,
  backoffMultiplier: 2
}

export function useRetry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): UseRetryReturn<T> {
  const { maxAttempts, baseDelay, maxDelay, backoffMultiplier } = {
    ...defaultConfig,
    ...config
  }

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [attempt, setAttempt] = useState(0)

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const calculateDelay = (attemptNumber: number) => {
    const delay = baseDelay * Math.pow(backoffMultiplier, attemptNumber - 1)
    return Math.min(delay, maxDelay)
  }

  const execute = useCallback(async (): Promise<T> => {
    setIsLoading(true)
    setError(null)

    for (let currentAttempt = 1; currentAttempt <= maxAttempts; currentAttempt++) {
      setAttempt(currentAttempt)
      
      try {
        const result = await fn()
        setIsLoading(false)
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error')
        
        if (currentAttempt === maxAttempts) {
          setError(error)
          setIsLoading(false)
          throw error
        }

        // Wait before retrying
        const delay = calculateDelay(currentAttempt)
        await sleep(delay)
      }
    }

    // This should never be reached, but TypeScript needs it
    throw new Error('Retry logic error')
  }, [fn, maxAttempts, baseDelay, maxDelay, backoffMultiplier])

  const reset = useCallback(() => {
    setIsLoading(false)
    setError(null)
    setAttempt(0)
  }, [])

  return { execute, isLoading, error, attempt, reset }
}

// Network status hook
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true)

  useState(() => {
    if (typeof window === 'undefined') return

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  })

  return isOnline
}

// Enhanced fetch with retry logic
export async function fetchWithRetry<T>(
  url: string,
  options?: RequestInit,
  retryConfig?: Partial<RetryConfig>
): Promise<T> {
  const config = { ...defaultConfig, ...retryConfig }
  
  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(10000) // 10s timeout
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return data as T
    } catch (error) {
      if (attempt === config.maxAttempts) {
        throw error
      }

      // Calculate delay with exponential backoff
      const delay = config.baseDelay * Math.pow(config.backoffMultiplier, attempt - 1)
      const actualDelay = Math.min(delay, config.maxDelay)
      
      await new Promise(resolve => setTimeout(resolve, actualDelay))
    }
  }

  throw new Error('Retry logic error')
}

// Utility for handling async operations with loading states
export function useAsyncOperation<T>() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<T | null>(null)

  const execute = useCallback(async (operation: () => Promise<T>) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await operation()
      setData(result)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Operation failed')
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setIsLoading(false)
    setError(null)
    setData(null)
  }, [])

  return { execute, isLoading, error, data, reset }
}

// Debounced retry hook for search and input operations
export function useDebouncedRetry<T>(
  fn: (query: string) => Promise<T>,
  delay: number = 300
) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<T | null>(null)

  const execute = useCallback(
    debounce(async (query: string) => {
      setIsLoading(true)
      setError(null)
      
      try {
        const result = await fn(query)
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Search failed'))
      } finally {
        setIsLoading(false)
      }
    }, delay),
    [fn, delay]
  )

  return { execute, isLoading, error, data }
}

// Simple debounce utility
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
