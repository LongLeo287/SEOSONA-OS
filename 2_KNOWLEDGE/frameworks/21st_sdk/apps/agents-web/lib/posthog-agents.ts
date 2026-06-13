/**
 * PostHog analytics for Web Agents
 * Unified events with Desktop app for cross-platform analytics
 */

import posthog, { PostHog } from "posthog-js"

let agentsPosthog: PostHog | undefined = undefined
let currentUserId: string | null = null

/**
 * Initialize PostHog for web agents
 */
export function initAgentsPostHog(userId?: string) {
  console.log("[PostHog Agents] initAgentsPostHog called", {
    userId,
    alreadyInitialized: !!agentsPosthog,
    nodeEnv: process.env.NODE_ENV,
    forceAnalytics: process.env.NEXT_PUBLIC_FORCE_ANALYTICS,
    posthogKeyEnv: process.env.NEXT_PUBLIC_POSTHOG_KEY ? "set" : "not set",
  })

  // Guard against re-initialization
  if (agentsPosthog) return

  if (typeof window === "undefined") return

  // Skip initialization in development mode unless forced
  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_FORCE_ANALYTICS !== "true"
  ) {
    console.log("[PostHog Agents] Disabled in development mode")
    return
  }

  // PostHog key - hardcoded for production, env var override for internal builds
  const posthogKey =
    process.env.NEXT_PUBLIC_POSTHOG_KEY ||
    "phc_qBzjTfpNKFoGTVrKbuVhOOqS218wbWiqgGbB5hBSuCe"

  const apiHost =
    process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com"

  console.log("[PostHog Agents] Initializing with key:", posthogKey.slice(0, 10) + "...", "host:", apiHost)

  posthog.init(posthogKey, {
    api_host: apiHost,
    disable_session_recording: true,
    autocapture: false,
    capture_pageview: false,
    loaded: (ph) => {
      console.log("[PostHog Agents] PostHog loaded successfully, distinct_id:", ph.get_distinct_id())
    },
  })

  agentsPosthog = posthog
  console.log("[PostHog Agents] Instance assigned, agentsPosthog:", !!agentsPosthog)

  // Auto-identify user if provided
  if (userId) {
    identifyAgentsUser(userId)
  }
}

/**
 * Get PostHog instance
 */
export function getAgentsPosthog(): PostHog | undefined {
  if (typeof window === "undefined") return undefined
  return agentsPosthog
}

/**
 * Check if analytics is enabled
 */
function isEnabled(): boolean {
  if (typeof window === "undefined") return false
  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_FORCE_ANALYTICS !== "true"
  ) {
    return false
  }
  return !!agentsPosthog
}

/**
 * Get common properties for all events
 */
function getCommonProperties() {
  return {
    source: "web", // Unified with desktop: "desktop" | "web"
  }
}

/**
 * Capture an event
 */
export function captureAgentsEvent(
  eventName: string,
  properties?: Record<string, any>,
) {
  const enabled = isEnabled()
  console.log("[PostHog Agents] captureAgentsEvent:", eventName, {
    enabled,
    hasInstance: !!agentsPosthog,
    properties,
  })

  if (!enabled) {
    return
  }

  agentsPosthog?.capture(eventName, {
    ...getCommonProperties(),
    ...properties,
  })
  console.log("[PostHog Agents] Event sent:", eventName)
}

/**
 * Identify a user
 */
export function identifyAgentsUser(
  userId: string,
  traits?: { email?: string; subscription_plan?: string },
) {
  currentUserId = userId
  console.log("[PostHog Agents] identifyAgentsUser:", userId, { enabled: isEnabled(), traits })

  if (!isEnabled()) return

  agentsPosthog?.identify(userId, {
    ...traits,
  })
  console.log("[PostHog Agents] User identified:", userId)
}

/**
 * Get current user ID
 */
export function getCurrentAgentsUserId(): string | null {
  return currentUserId
}

/**
 * Reset user identification (on logout)
 */
export function resetAgentsUser() {
  currentUserId = null
  agentsPosthog?.reset()
}

/**
 * Shutdown PostHog
 */
export function shutdownAgentsPostHog() {
  if (agentsPosthog) {
    agentsPosthog.reset()
    agentsPosthog = undefined
  }
  currentUserId = null
}

// ============================================================================
// Unified event helpers (same as desktop)
// ============================================================================

/**
 * Track workspace/chat created
 */
export function trackWorkspaceCreated(data: {
  workspaceId: string
  repository?: string
  branch?: string
}) {
  captureAgentsEvent("workspace_created", {
    workspace_id: data.workspaceId,
    repository: data.repository,
    branch: data.branch,
  })
}

/**
 * Track message sent
 */
export function trackMessageSent(data: {
  workspaceId: string
  subChatId?: string
  mode: "plan" | "agent"
}) {
  captureAgentsEvent("message_sent", {
    workspace_id: data.workspaceId,
    sub_chat_id: data.subChatId,
    mode: data.mode,
  })
}

/**
 * Track sub-chat created
 */
export function trackSubChatCreated(data: {
  workspaceId: string
  subChatId: string
}) {
  captureAgentsEvent("sub_chat_created", {
    workspace_id: data.workspaceId,
    sub_chat_id: data.subChatId,
  })
}

/**
 * Track PR created
 */
export function trackPRCreated(data: {
  workspaceId: string
  prUrl?: string
  repository?: string
}) {
  captureAgentsEvent("pr_created", {
    workspace_id: data.workspaceId,
    pr_url: data.prUrl,
    repository: data.repository,
  })
}

/**
 * Track commit created
 */
export function trackCommitCreated(data: {
  workspaceId: string
  filesChanged?: number
}) {
  captureAgentsEvent("commit_created", {
    workspace_id: data.workspaceId,
    files_changed: data.filesChanged,
  })
}

/**
 * Track workspace archived
 */
export function trackWorkspaceArchived(workspaceId: string) {
  captureAgentsEvent("workspace_archived", {
    workspace_id: workspaceId,
  })
}

/**
 * Track desktop app download from landing page
 */
export function trackDesktopDownload(data: {
  platform: string
  source: "hero_cta" | "bottom_cta" | "pricing_free_tier" | "nav"
}) {
  captureAgentsEvent("desktop_app_downloaded", {
    platform: data.platform,
    cta_source: data.source,
  })
}
