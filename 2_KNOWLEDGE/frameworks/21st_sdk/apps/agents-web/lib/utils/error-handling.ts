/**
 * Error handling utilities for consistent error management across the application
 */

/**
 * Log an error with consistent formatting and context
 */
export function logError(
  context: string,
  error: unknown,
  metadata?: Record<string, unknown>,
): void {
  const errorMessage = error instanceof Error ? error.message : String(error)
  const errorStack = error instanceof Error ? error.stack : undefined

  console.error(`[${context}] ${errorMessage}`, {
    error: errorMessage,
    stack: errorStack,
    context,
    ...metadata,
  })
}

/**
 * Log a warning with consistent formatting
 */
export function logWarning(
  context: string,
  message: string,
  metadata?: Record<string, unknown>,
): void {
  console.warn(`[${context}] ${message}`, {
    message,
    context,
    ...metadata,
  })
}

/**
 * Handle errors in API routes with consistent logging and optional fallback values
 */
export function handleApiError<T>(
  context: string,
  error: unknown,
  fallbackValue: T,
  metadata?: Record<string, unknown>,
): T {
  logError(context, error, metadata)
  return fallbackValue
}

/**
 * Handle errors in async operations with consistent logging
 */
export function handleAsyncError(
  context: string,
  error: unknown,
  metadata?: Record<string, unknown>,
): void {
  logError(context, error, metadata)
}

/**
 * Safely execute an async operation with error handling
 */
export async function safeAsync<T>(
  operation: () => Promise<T>,
  context: string,
  fallbackValue: T,
  metadata?: Record<string, unknown>,
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    return handleApiError(context, error, fallbackValue, metadata)
  }
}

/**
 * Type guard to check if error is an instance of Error
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error
}

/**
 * Extract error message safely from unknown error
 */
export function getErrorMessage(error: unknown): string {
  if (isError(error)) {
    return error.message
  }
  return String(error)
}

/**
 * Check if error is a known type that should be handled gracefully
 */
export function isExpectedError(error: unknown): boolean {
  if (!isError(error)) return false

  // Add known error types that should be handled gracefully
  const expectedErrors = [
    "ENOTFOUND", // Network errors
    "ECONNREFUSED", // Connection errors
    "ETIMEDOUT", // Timeout errors
    "AbortError", // Request aborted
    "TimeoutError", // Custom timeout
  ]

  return expectedErrors.some(
    (type) =>
      error.name === type ||
      error.message.includes(type) ||
      (error as any).code === type,
  )
}
