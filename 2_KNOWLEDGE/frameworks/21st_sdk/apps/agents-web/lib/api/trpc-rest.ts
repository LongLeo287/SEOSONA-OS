import { NextRequest, NextResponse } from "next/server"
import { createCaller } from "@/server/api/root"
import { createTRPCContext } from "@/server/api/trpc"
import { authenticateApiKey } from "@/app/api/v1/_lib/auth"
import { checkApiRateLimits } from "@/app/api/v1/_lib/rate-limit"
import { TRPCError } from "@trpc/server"

const TRPC_TO_HTTP: Record<string, number> = {
  PARSE_ERROR: 400,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_SUPPORTED: 405,
  TIMEOUT: 408,
  CONFLICT: 409,
  PAYLOAD_TOO_LARGE: 413,
  UNPROCESSABLE_CONTENT: 422,
  TOO_MANY_REQUESTS: 429,
  CLIENT_CLOSED_REQUEST: 499,
  INTERNAL_SERVER_ERROR: 500,
}

function walkCaller(caller: any, path: string) {
  let fn = caller
  for (const part of path.split(".")) {
    fn = fn[part]
    if (!fn) throw new Error(`Invalid procedure path: ${path}`)
  }
  return fn
}

/**
 * Create Next.js route handlers from a tRPC procedure path.
 *
 * Usage:
 *   // app/api/v1/agents/chats/route.ts
 *   import { createRestRoute } from "@/lib/api/trpc-rest"
 *   export const { GET } = createRestRoute("agents.getAgentChats")
 */
export function createRestRoute(procedure: string) {
  const handler = async (req: NextRequest) => {
    try {
      // 1. Auth via API key
      const auth = await authenticateApiKey(req)
      await checkApiRateLimits(auth.apiKeyId, auth.userId)

      // 2. Build tRPC context from API key auth
      const headers = new Headers(req.headers)
      headers.set("x-user-id", auth.userId)
      const ctx = await createTRPCContext({ headers })
      const caller = createCaller(ctx)

      // 3. Parse input: query params for GET, body for POST/PUT/DELETE
      let input: any
      if (req.method === "GET") {
        const params = Object.fromEntries(req.nextUrl.searchParams)
        input = Object.keys(params).length ? params : undefined
      } else {
        input = await req.json().catch(() => undefined)
      }

      // 4. Call the tRPC procedure
      const fn = walkCaller(caller, procedure)
      const result = await fn(input)

      return NextResponse.json({ data: result })
    } catch (err: any) {
      // tRPC errors → HTTP status codes
      if (err instanceof TRPCError) {
        const status = TRPC_TO_HTTP[err.code] ?? 500
        return NextResponse.json(
          { error: err.code.toLowerCase(), message: err.message },
          { status },
        )
      }

      // Structured errors from auth/rate-limit helpers
      if (err?.status && err?.error) {
        return NextResponse.json(
          { error: err.error, message: err.message, status: err.status },
          { status: err.status, headers: err.headers },
        )
      }

      console.error(`[API REST] ${procedure}:`, err)
      return NextResponse.json(
        { error: "internal_error", message: "An unexpected error occurred" },
        { status: 500 },
      )
    }
  }

  return { GET: handler, POST: handler, PUT: handler, DELETE: handler }
}
