"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Server } from "lucide-react"

export interface McpServerEntry {
  name: string
  url?: string
}

/** Build McpServerEntry[] from raw mcp_servers JSONB + mcp_server_names */
export function toMcpServerEntries(
  mcpServerNames: string[],
  mcpServers?: unknown,
): McpServerEntry[] {
  const urlMap = new Map<string, string>()
  if (Array.isArray(mcpServers)) {
    for (const s of mcpServers) {
      if (typeof s === "object" && s !== null) {
        const obj = s as Record<string, unknown>
        if (typeof obj.name === "string" && typeof obj.url === "string") {
          urlMap.set(obj.name, obj.url)
        }
      }
    }
  }
  return mcpServerNames.map((name) => ({ name, url: urlMap.get(name) }))
}

interface McpServerChipProps {
  name: string
  url?: string
  displayName?: string
  className?: string
}

const KNOWN_SERVERS: Record<string, string> = {
  github: "GitHub",
  gitlab: "GitLab",
  slack: "Slack",
  linear: "Linear",
  postgres: "PostgreSQL",
  postgresql: "PostgreSQL",
  sqlite: "SQLite",
  notion: "Notion",
  jira: "Jira",
  sentry: "Sentry",
  supabase: "Supabase",
  figma: "Figma",
  "google-drive": "Google Drive",
  stripe: "Stripe",
  discord: "Discord",
  asana: "Asana",
  neon: "Neon",
  browserbase: "Browserbase",
  twilio: "Twilio",
  vercel: "Vercel",
  redis: "Redis",
  mongodb: "MongoDB",
  shopify: "Shopify",
  cloudflare: "Cloudflare",
  intercom: "Intercom",
  agentmail: "AgentMail",
  amplitude: "Amplitude",
  apollo: "Apollo",
  atlassian: "Atlassian",
  calendly: "Calendly",
  clay: "Clay",
  exa: "Exa",
  honeycomb: "Honeycomb",
  hubspot: "HubSpot",
  mailerlite: "MailerLite",
  mixpanel: "Mixpanel",
  posthog: "PostHog",
}

function getLabel(name: string): string {
  if (KNOWN_SERVERS[name.toLowerCase()]) return KNOWN_SERVERS[name.toLowerCase()]!
  return name.charAt(0).toUpperCase() + name.slice(1)
}

const SVG_ICONS = new Set([
  "github", "gitlab", "slack", "linear", "postgres", "sqlite",
  "notion", "jira", "sentry", "supabase", "figma", "google-drive",
  "stripe", "discord", "asana", "neon", "twilio", "vercel",
  "redis", "mongodb", "shopify", "cloudflare",
  "atlassian", "calendly", "hubspot", "mixpanel", "posthog",
])

const PNG_ICONS = new Set([
  "agentmail", "amplitude", "apollo", "clay", "exa", "honeycomb", "intercom", "mailerlite",
])

/** Monochrome icons that need dark:invert to be visible in dark mode */
const MONO_DARK_ICONS = new Set(["notion", "vercel", "posthog"])
/** Monochrome icons that need light-mode invert (white fill) */
const MONO_LIGHT_ICONS = new Set(["github"])

function getIconPath(name: string): string | null {
  const key = name.toLowerCase()
  if (key === "postgresql") return "/icons/mcp/postgres.svg"
  if (SVG_ICONS.has(key)) return `/icons/mcp/${key}.svg`
  if (PNG_ICONS.has(key)) return `/icons/mcp/${key}.png`
  return null
}

function getDomainFromUrl(url: string): string | null {
  try {
    return new URL(url).hostname
  } catch {
    return null
  }
}

function getFaviconUrl(name: string, url?: string): string {
  const domain = (url && getDomainFromUrl(url)) || `${encodeURIComponent(name)}.com`
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
}

/**
 * Single icon with circular background — used in cards and icon rows
 */
export function McpServerIcon({
  name,
  url,
  size = 24,
}: {
  name: string
  url?: string
  size?: number
}) {
  const iconPath = getIconPath(name)
  const iconSize = Math.round(size * 0.58)
  const [faviconError, setFaviconError] = useState(false)
  const key = name.toLowerCase()
  const invertClass = MONO_DARK_ICONS.has(key)
    ? "dark:invert"
    : MONO_LIGHT_ICONS.has(key)
      ? "invert dark:invert-0"
      : ""

  return (
    <div
      className="shrink-0 rounded-full bg-background border border-border/60 flex items-center justify-center overflow-hidden"
      style={{ width: size, height: size }}
    >
      {iconPath ? (
        <img
          src={iconPath}
          alt={getLabel(name)}
          width={iconSize}
          height={iconSize}
          className={cn("object-contain", invertClass)}
        />
      ) : !faviconError ? (
        <img
          src={getFaviconUrl(name, url)}
          alt={getLabel(name)}
          width={iconSize}
          height={iconSize}
          className="object-contain"
          onError={() => setFaviconError(true)}
        />
      ) : (
        <Server style={{ width: iconSize, height: iconSize }} className="text-muted-foreground" />
      )}
    </div>
  )
}

/**
 * Overlapping icon row — used in agent cards (like Anthropic Console)
 */
export function McpServerIconRow({
  servers,
  names,
  max = 5,
  size = 24,
}: {
  servers?: McpServerEntry[]
  /** @deprecated use `servers` with url for better favicon resolution */
  names?: string[]
  max?: number
  size?: number
}) {
  const entries: McpServerEntry[] = servers ?? (names || []).map((n) => ({ name: n }))
  const visible = entries.slice(0, max)
  const overflow = entries.length - max

  return (
    <div className="flex items-center -space-x-2">
      {visible.map((s) => (
        <McpServerIcon key={s.name} name={s.name} url={s.url} size={size} />
      ))}
      {overflow > 0 && (
        <div
          className="shrink-0 rounded-full bg-muted border border-border/60 flex items-center justify-center text-[10px] font-medium text-muted-foreground"
          style={{ width: size, height: size }}
        >
          +{overflow}
        </div>
      )}
    </div>
  )
}

/**
 * Chip with icon + label — used in detail page
 */
export function McpServerChip({
  name,
  url,
  displayName,
  className,
}: McpServerChipProps) {
  const label = displayName || getLabel(name)

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground",
        className,
      )}
    >
      <McpServerIcon name={name} url={url} size={18} />
      {label}
    </span>
  )
}
