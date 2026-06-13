import { NextRequest } from "next/server"

// Function to check if origin is localhost with any port
export function isLocalhostOrigin(origin: string): boolean {
  try {
    const url = new URL(origin)
    return (
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1" ||
      url.hostname === "::1"
    )
  } catch {
    return false
  }
}

// Function to check if origin is from Electron app
export function isElectronOrigin(origin: string): boolean {
  return origin.startsWith("app://") || origin.startsWith("file://")
}

// Function to get CORS headers based on request origin
export function getCorsHeadersAllowLocalhost(request: NextRequest) {
  const origin = request.headers.get("origin")
  let allowedOrigin = process.env.NEXT_PUBLIC_APP_URL!

  if (
    origin === allowedOrigin ||
    (origin && isLocalhostOrigin(origin)) ||
    (origin && isElectronOrigin(origin))
  ) {
    allowedOrigin = origin
  }

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Credentials": "true",
  }
}
