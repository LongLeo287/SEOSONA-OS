import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPackageRunner(packageManager: string) {
  switch (packageManager) {
    case "pnpm":
      return "pnpm dlx"
    case "yarn":
      return "npx"
    case "bun":
      return "bunx --bun"
    case "npm":
    default:
      return "npx"
  }
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date)
}

/**
 * Format a date as a compact relative time string (e.g., "5m ago", "2h ago", "3d ago")
 */
export function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

export function appendQueryParam(url: string, param: string, value: string) {
  try {
    const urlObj = new URL(url)
    if (!urlObj.searchParams.has(param)) {
      urlObj.searchParams.append(param, value)
    }
    return urlObj.toString()
  } catch (e) {
    return url
  }
}

export function replaceSpacesWithPlus(str: string) {
  return str?.trim()?.replace(/\s+/g, "+")
}

export function makeSlugFromName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

// Detect macOS/iOS using userAgent (navigator.platform is deprecated)
export const isMac =
  typeof window !== "undefined" &&
  /Mac|iPod|iPhone|iPad/.test(window.navigator.userAgent)

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price)
}

/**
 * Normalize file path by removing @/ prefix and ensuring consistent format
 */
export function normalizePath(path: string): string {
  return path.replace(/^@\//, "/")
}

/**
 * Compare two paths after normalization
 */
export function arePathsEqual(path1: string, path2: string): boolean {
  return normalizePath(path1) === normalizePath(path2)
}

/**
 * Check if we should hide leaderboard rankings and vote counts
 * (Only show on Saturday and Sunday)
 */
export function shouldHideLeaderboardRankings(): boolean {
  const now = new Date()
  const day = now.getDay() // 0 is Sunday, 1 is Monday, etc.

  // Show only on weekends (Saturday = 6, Sunday = 0)
  // Hide on weekdays (Monday through Friday)
  return !(day === 0 || day === 6)
}

export function formatK(num: number, toFixed?: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k"
  }
  if (toFixed) {
    return num.toFixed(toFixed)
  }
  return Math.round(num).toString()
}

export function getErrorMessage(error: any): string {
  try {
    return JSON.stringify(error)
  } catch (e) {
    return error.message ?? String(error)
  }
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelay: number = 1000,
  maxDelay: number = 10000,
  operation: string = "Operation",
): Promise<T> {
  let lastError: Error

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      if (attempt === maxAttempts) {
        console.error(
          `❌ ${operation} failed after ${maxAttempts} attempts:`,
          lastError,
        )
        throw lastError
      }

      // Calculate delay with exponential backoff and jitter
      const delay = Math.min(
        baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000,
        maxDelay,
      )

      console.log(
        `⚠️  ${operation} failed (attempt ${attempt}/${maxAttempts}), retrying in ${Math.round(delay)}ms:`,
        lastError.message,
      )
      await sleep(delay)
    }
  }

  throw lastError!
}

export const cleanAnsi = (raw: string) => {
  const ANSI_REGEX = /\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g
  return raw.replace(ANSI_REGEX, "")
}

export function truncateText(
  text: string,
  maxLength: number,
  ellipsis: string = "...",
): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + ellipsis
}
