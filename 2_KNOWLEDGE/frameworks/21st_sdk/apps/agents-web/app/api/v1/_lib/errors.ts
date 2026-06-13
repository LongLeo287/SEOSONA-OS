import { NextResponse } from "next/server"

const SLUG_RE = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/

export function apiError(
  status: number,
  error: string,
  message: string,
  headers?: Record<string, string>,
): NextResponse {
  return NextResponse.json({ error, message, status }, { status, headers })
}

export function validateSlugParam(slug: string): NextResponse | null {
  if (!slug || slug.length > 100 || !SLUG_RE.test(slug)) {
    return apiError(400, "invalid_slug", "Invalid agent slug format")
  }
  return null
}

export function withApiErrorHandling<Ctx = unknown>(
  handler: (req: Request, ctx: Ctx) => Promise<Response>,
) {
  return async (req: Request, ctx: Ctx) => {
    try {
      return await handler(req, ctx)
    } catch (err: any) {
      if (err?.status && err?.error) {
        return apiError(err.status, err.error, err.message, err.headers)
      }
      console.error("[API v1] Unexpected error:", err)
      return apiError(500, "internal_error", "An unexpected error occurred")
    }
  }
}
