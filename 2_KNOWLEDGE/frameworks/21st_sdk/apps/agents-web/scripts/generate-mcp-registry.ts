#!/usr/bin/env tsx
/**
 * Generate a typed TS constant of MCP servers from a local HTML export
 * of Anthropic's MCP picker UI. The pasted export is a scratch input and
 * should not be committed.
 *
 * Usage:
 *   1. Open Anthropic's MCP picker in the browser, copy the entire
 *      <div role="listbox">...</div> element via DevTools.
 *   2. Paste it verbatim into apps/agents-web/scripts/raw_html.local.html.
 *   3. Run: pnpm tsx apps/agents-web/scripts/generate-mcp-registry.ts
 *   4. Import MCP_REGISTRY from "@/lib/mcp-registry" in docs/components.
 *
 * The script is tolerant of:
 *   - Entries with or without a favicon <img> (some use a letter fallback).
 *   - The trailing "Custom Server" row (no URL) — skipped automatically.
 *   - Favicon-less rows where the first-letter fallback div replaces <img>.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, resolve } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const INPUT = resolve(__dirname, "raw_html.local.html")
const OUTPUT = resolve(__dirname, "../lib/mcp-registry.ts")

if (!existsSync(INPUT)) {
  console.error(`Missing ${INPUT}. Paste the MCP picker HTML into that local file and rerun.`)
  process.exit(1)
}

const html = readFileSync(INPUT, "utf-8")

interface Entry {
  name: string
  url: string
  /** Domain used to build a favicon URL via the Google favicon service. */
  faviconDomain: string | null
  /** Single-letter fallback when the UI had no favicon image (e.g. "F", "T", "A"). */
  faviconFallback: string | null
}

// Each row is <div role="option" ...>...</div> containing:
//   - <img src=".../favicons?domain=X&sz=48">  OR  <div>...letter fallback...<p>X</p>...</div>
//   - <span class="... text-text-100">Name</span>
//   - <span class="... text-text-300">URL</span>
// Strategy: split on the opening marker, parse each chunk independently.

const chunks = html.split(/<div role="option"/).slice(1)
const entries: Entry[] = []
const skipped: string[] = []

for (const chunk of chunks) {
  const nameMatch = chunk.match(/text-text-100[^>]*>([^<]+)<\/span>/)
  const urlMatch = chunk.match(/text-text-300[^>]*>([^<]+)<\/span>/)

  if (!nameMatch) continue
  const name = decodeHtmlEntities(nameMatch[1].trim())
  if (!urlMatch) {
    skipped.push(`${name} (no URL — likely Custom Server row)`)
    continue
  }
  const url = decodeHtmlEntities(urlMatch[1].trim())
  if (!url.startsWith("http")) {
    skipped.push(`${name} (non-HTTP URL: ${url})`)
    continue
  }

  const favMatch = chunk.match(/favicons\?domain=([^&"]+)/)
  const letterMatch = chunk.match(/font-ui shrink-0 leading-tight[^>]*>([A-Za-z0-9])<\/p>/)

  entries.push({
    name,
    url,
    faviconDomain: favMatch ? decodeURIComponent(favMatch[1]) : null,
    faviconFallback: !favMatch && letterMatch ? letterMatch[1] : null,
  })
}

if (entries.length === 0) {
  console.error("Parsed 0 entries — check that raw_html.local.html contains the picker HTML.")
  process.exit(1)
}

const banner = `// AUTO-GENERATED. Do not edit by hand.
// Source: local scratch input apps/agents-web/scripts/raw_html.local.html (not committed)
// Regenerate: pnpm tsx apps/agents-web/scripts/generate-mcp-registry.ts`

const file = `${banner}

export interface McpRegistryEntry {
  name: string
  url: string
  /**
   * Domain to build a favicon via \`https://www.google.com/s2/favicons?domain=<d>&sz=48\`.
   * Null when the source UI had no favicon image for this entry.
   */
  faviconDomain: string | null
  /** Single-letter fallback (e.g. "F", "T") when the source UI had no favicon image. Null otherwise. */
  faviconFallback: string | null
}

export const MCP_REGISTRY: readonly McpRegistryEntry[] = ${JSON.stringify(entries, null, 2)} as const

export const MCP_REGISTRY_COUNT = ${entries.length}
`

writeFileSync(OUTPUT, file)
console.log(`✓ Generated ${entries.length} entries → ${OUTPUT}`)
if (skipped.length > 0) {
  console.log(`  Skipped ${skipped.length} row(s):`)
  for (const s of skipped) console.log(`    - ${s}`)
}

function decodeHtmlEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
}
