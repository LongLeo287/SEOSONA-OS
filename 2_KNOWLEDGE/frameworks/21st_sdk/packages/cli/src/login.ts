import * as p from "@clack/prompts"
import { getApiBaseUrl, getApiKey, saveApiKey } from "./config.js"
import { isInteractive } from "./detect.js"

const API_BASE = getApiBaseUrl()

async function verifyKey(apiKey: string): Promise<{ user: any; team: any }> {
  const res = await fetch(`${API_BASE}/me`, {
    headers: { Authorization: `Bearer ${apiKey.trim()}` },
  })
  if (!res.ok) {
    throw new Error("Invalid API key")
  }
  return res.json()
}

export async function login(opts?: { apiKey?: string }) {
  const key = opts?.apiKey

  // Non-interactive: --api-key flag passed directly
  if (key) {
    try {
      const { user, team } = await verifyKey(key)
      saveApiKey(key.trim())
      console.log(`Authenticated as ${user.displayName || user.email} (team: ${team.name})`)
      console.log("Key saved to ~/.an/credentials")
    } catch {
      console.error("Error: Invalid API key. Get a new one at https://21st.dev/agents/api-keys")
      process.exit(1)
    }
    return
  }

  // Non-interactive without key: can't prompt
  if (!isInteractive()) {
    console.error("Error: No API key provided. Use --api-key KEY or set API_KEY_21ST.")
    console.error("Get your API key at https://21st.dev/agents/api-keys")
    process.exit(1)
  }

  // Interactive flow
  p.intro("@21st-sdk/cli login")

  const existing = getApiKey()
  if (existing) {
    p.log.info("Already logged in. Continuing will re-authenticate.")
  }
  p.log.info("Get your API key at https://21st.dev/agents/api-keys")

  const apiKey = await p.text({
    message: "Enter your API key",
    validate: (val) => {
      if (!val.trim()) return "API key cannot be empty"
    },
  })

  if (p.isCancel(apiKey)) {
    p.cancel("Login cancelled.")
    process.exit(0)
  }

  const s = p.spinner()
  s.start("Verifying API key...")

  try {
    const { user, team } = await verifyKey(apiKey)
    saveApiKey(apiKey.trim())
    s.stop("Verified")
    p.log.success(`Authenticated as ${user.displayName || user.email} (team: ${team.name})`)
    p.log.info("Key saved to ~/.an/credentials")
    p.outro("Done")
  } catch {
    s.stop("Invalid API key")
    p.log.error("Invalid API key. Get a new one at https://21st.dev/agents/api-keys")
    process.exit(1)
  }
}
