// pnpm dlx tsx gen-code-chunks.ts
//
// Re-generate embeddings for existing code_chunks rows with NULL embedding.
// Calls the cron route locally.

import { config } from "dotenv"
import path from "path"

// Load environment variables from apps/web/.env
config({ path: path.resolve(__dirname, "../.env") })

async function main() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret) {
    console.error("[ReembedChunks] CRON_SECRET env variable is required")
    process.exit(1)
  }

  console.log(`[ReembedChunks] Calling ${baseUrl}/api/cron/gen-code-embeddings`)

  const response = await fetch(`${baseUrl}/api/cron/gen-code-embeddings`, {
    headers: {
      Authorization: `Bearer ${cronSecret}`,
    },
  })

  if (!response.ok) {
    console.error(
      `[ReembedChunks] Failed: ${response.status} ${response.statusText}`,
    )
    const text = await response.text()
    console.error(text)
    process.exit(1)
  }

  const result = await response.json()
  console.log("[ReembedChunks] Completed:", result)
}

main().catch((error) => {
  console.error("[ReembedChunks] Fatal error:", error)
  process.exit(1)
})
