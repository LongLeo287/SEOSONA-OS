import { createHash } from "node:crypto"

export const API_KEY_PREFIX_LENGTH = 12
export const CURRENT_AGENT_API_KEY_PREFIX = "21st_sk_"
export const LEGACY_AGENT_API_KEY_PREFIX = "an_sk_"
export const AGENT_API_KEY_PREFIXES = [
  CURRENT_AGENT_API_KEY_PREFIX,
  LEGACY_AGENT_API_KEY_PREFIX,
] as const

export function hashApiKey(plaintext: string): string {
  return createHash("sha256").update(plaintext).digest("hex")
}

export function getApiKeyPrefix(plaintext: string): string {
  return plaintext.slice(0, API_KEY_PREFIX_LENGTH)
}

export function isAgentApiKey(plaintext: string): boolean {
  return AGENT_API_KEY_PREFIXES.some((prefix) => plaintext.startsWith(prefix))
}
