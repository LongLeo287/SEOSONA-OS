// Auth logging utility for debugging auth issues in production
// Logs to console AND sends to server (visible in Vercel logs)

export const authLog = (action: string, data?: Record<string, unknown>) => {
  const timestamp = new Date().toISOString()
  const logData = { action, data, timestamp }

  // Always log to console
  console.log(`[1CODE_AUTH ${timestamp}] ${action}`, data || "")

  // In production, also send to server for Vercel logs
  if (typeof window !== "undefined") {
    fetch("/api/auth-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logData),
    }).catch(() => {
      // Silently fail - don't break auth flow for logging
    })
  }
}
