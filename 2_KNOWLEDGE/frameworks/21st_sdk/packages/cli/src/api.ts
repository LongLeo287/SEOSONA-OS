import * as p from "@clack/prompts"
import { getApiBaseUrl, getApiKey } from "./config.js"
import { validateSlug } from "./utils.js"

const API_BASE = getApiBaseUrl().replace(/\/$/, "")

export function requireAuth(): string {
  const apiKey = getApiKey()
  if (!apiKey) {
    p.log.error("Not logged in. Run `npx @21st-sdk/cli login` first, or set API_KEY_21ST.")
    process.exit(1)
  }
  return apiKey
}

export function requireAgentSlug(args: string[], usage: string): string {
  const slug = args[0]
  if (!slug || slug.startsWith("-")) {
    p.log.error(`Agent slug is required. Usage: npx @21st-sdk/cli ${usage}`)
    process.exit(1)
  }
  const err = validateSlug(slug)
  if (err) {
    p.log.error(err)
    process.exit(1)
  }
  return slug
}

export function buildApiUrl(
  path: string,
  query?: Record<string, string | number | undefined>,
): string {
  const url = new URL(`${API_BASE}${path}`)

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value))
      }
    }
  }

  return url.toString()
}

export async function requestJson<T>(
  apiKey: string,
  path: string,
  init: RequestInit,
  fallbackMessage: string,
  query?: Record<string, string | number | undefined>,
): Promise<T> {
  const res = await fetch(buildApiUrl(path, query), {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      ...(init.headers ?? {}),
    },
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { message?: string }).message || `${fallbackMessage} (${res.status})`)
  }

  return res.json() as Promise<T>
}
