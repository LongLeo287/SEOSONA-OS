export interface TokenHandlerOptions {
  /** Your 21st_sk_ API key — keep in process.env, never expose to client */
  apiKey: string
  /** Relay URL. Default: "https://relay.an.dev" */
  relayUrl?: string
  /** Token expiry. Default: "1h" */
  expiresIn?: string
}

export interface ExchangeTokenOptions extends TokenHandlerOptions {
  /** Agent slug to scope the token to */
  agent?: string
  /** User identifier for the token */
  userId?: string
}

/** Exchange a 21st API key for a short-lived JWT via the relay */
export async function exchangeToken(options: ExchangeTokenOptions) {
  const {
    apiKey,
    relayUrl = "https://relay.an.dev",
    expiresIn = "1h",
    agent,
    userId,
  } = options

  const res = await fetch(`${relayUrl}/v1/tokens`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      userId,
      agents: agent ? [agent] : undefined,
      expiresIn,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Failed to exchange token" }))
    throw new Error(err.error || `Token exchange failed: ${res.status}`)
  }

  return res.json() as Promise<{ token: string; expiresAt: string }>
}

/** Create a Next.js API route handler that exchanges API keys for JWTs */
export function createTokenHandler(options: TokenHandlerOptions) {
  return async function POST(req: Request) {
    try {
      const body = await req.json().catch(() => ({}))
      const { agent, userId } = body as { agent?: string; userId?: string }

      const data = await exchangeToken({ ...options, agent, userId })
      return Response.json(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Internal error"
      return Response.json({ error: message }, { status: 500 })
    }
  }
}

// Legacy handler alias kept for compatibility.
export const createAnTokenHandler = createTokenHandler
