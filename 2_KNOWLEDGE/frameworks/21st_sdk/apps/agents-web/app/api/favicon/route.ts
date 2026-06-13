import { NextRequest, NextResponse } from "next/server"
import { isAllowedForFavicon } from "@/lib/config/security"
import {
  logWarning,
  logError,
  isExpectedError,
} from "@/lib/utils/error-handling"

// Try to extract a hostname from either a full URL or a bare domain
function extractHostname(input: string): string | null {
  try {
    const candidate = input.trim()
    if (!candidate) return null

    if (candidate.startsWith("http://") || candidate.startsWith("https://")) {
      const url = new URL(candidate)
      return url.hostname.toLowerCase()
    }

    // Bare domain/path: take up to first slash and strip www.
    const host = candidate.replace(/^www\./, "").split("/")[0]
    return host && host.includes(".") ? host.toLowerCase() : null
  } catch {
    return null
  }
}

async function tryFetch(url: string): Promise<Response | null> {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      // Some servers require a UA
      headers: { "user-agent": "Mozilla/5.0 21st.dev favicon fetcher" },
      cache: "no-store",
      // Security: Add timeout and signal to prevent hanging requests
      signal: AbortSignal.timeout(5000), // 5 second timeout
    })
    if (!res.ok) return null

    // Security: Check content length to prevent excessively large responses
    const contentLength = res.headers.get("content-length")
    if (contentLength && parseInt(contentLength) > 1024 * 1024) {
      // 1MB limit
      logWarning("favicon.fetch", "Favicon response too large", {
        url,
        contentLength,
        limit: "1MB",
      })
      return null
    }

    const contentType = res.headers.get("content-type") || ""
    if (contentType.startsWith("image/")) return res
    // Some ico/svg may lack correct headers, fallback by extension check
    if (url.endsWith(".ico") || url.endsWith(".svg")) return res
    return null
  } catch (error) {
    // Log for debugging but don't expose internal errors
    if (isExpectedError(error)) {
      logWarning("favicon.fetch", "Expected error during favicon fetch", {
        url,
        errorType: error instanceof Error ? error.name : "unknown",
        errorMessage: error instanceof Error ? error.message : String(error),
      })
    } else {
      logError("favicon.fetch", error, { url })
    }
    return null
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const input = searchParams.get("url") || searchParams.get("domain")

  if (!input) {
    return NextResponse.json(
      { error: "Missing url or domain" },
      { status: 400 },
    )
  }

  const hostname = extractHostname(input)
  if (!hostname) {
    return NextResponse.json({ error: "Invalid domain" }, { status: 400 })
  }

  // Security: Validate hostname to prevent SSRF attacks on internal/private networks
  if (!isAllowedForFavicon(hostname)) {
    logWarning(
      "favicon.security",
      "Blocked favicon request for potentially unsafe hostname",
      { hostname, originalInput: input },
    )
    return NextResponse.json(
      { error: "Domain not allowed for security reasons" },
      { status: 403 },
    )
  }

  // Common favicon locations to try in order
  const candidates = [
    "/favicon.ico",
    "/favicon.svg",
    "/apple-touch-icon.png",
    "/apple-touch-icon-precomposed.png",
    "/android-chrome-192x192.png",
    "/apple-touch-icon-180x180.png",
  ]

  for (const path of candidates) {
    const url = `https://${hostname}${path}`
    const res = await tryFetch(url)
    if (res) {
      const headers = new Headers()
      headers.set(
        "content-type",
        res.headers.get("content-type") ||
          (url.endsWith(".svg") ? "image/svg+xml" : "image/x-icon"),
      )
      headers.set(
        "cache-control",
        "public, s-maxage=86400, stale-while-revalidate=43200",
      )
      return new NextResponse(res.body, { status: 200, headers })
    }
  }

  // Nothing found → return 404 so client can fallback to local placeholder
  return new NextResponse("", {
    status: 404,
    headers: { "cache-control": "public, s-maxage=3600" },
  })
}
