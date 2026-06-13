/**
 * PostHog analytics for 21st.dev/agents (the SDK product).
 *
 * Uses a NAMED PostHog instance ("agents21st") so it does not conflict with
 * any other PostHog instance that may be initialized in the same window
 * (e.g. Canvas, 1code).
 *
 * Sends events to the "21st.dev" project.
 */

import posthog, { type PostHog } from "posthog-js"

const INSTANCE_NAME = "agents21st"
const DEFAULT_PROJECT_KEY = "phc_D9qjVQ8NPFncVzgLeNWKCUapMGdYMHCnLDnHayxTJ5EC"
const DEFAULT_API_HOST = "https://us.i.posthog.com"

let initialized = false
let currentUserId: string | null = null

function getInstance(): PostHog | undefined {
  if (typeof window === "undefined") return undefined
  return (posthog as unknown as Record<string, PostHog>)[INSTANCE_NAME]
}

function isEnabled(): boolean {
  if (typeof window === "undefined") return false
  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_FORCE_ANALYTICS !== "true"
  ) {
    return false
  }
  return initialized
}

export function init21stAgentsPostHog(userId?: string) {
  if (typeof window === "undefined") return
  if (initialized) return

  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_FORCE_ANALYTICS !== "true"
  ) {
    return
  }

  const projectKey =
    process.env.NEXT_PUBLIC_POSTHOG_AGENTS21ST_KEY || DEFAULT_PROJECT_KEY
  const apiHost =
    process.env.NEXT_PUBLIC_POSTHOG_AGENTS21ST_HOST || DEFAULT_API_HOST

  posthog.init(
    projectKey,
    {
      api_host: apiHost,
      capture_pageview: false,
      autocapture: true,
      disable_session_recording: true,
      persistence: "localStorage+cookie",
    },
    INSTANCE_NAME,
  )

  initialized = true

  if (userId) {
    identify21stAgentsUser(userId)
  }
}

export function capture21stAgentsEvent(
  eventName: string,
  properties?: Record<string, unknown>,
) {
  if (!isEnabled()) return
  getInstance()?.capture(eventName, {
    ...properties,
    surface: "21st_agents",
  })
}

export function capture21stAgentsPageview(url: string) {
  if (!isEnabled()) return
  getInstance()?.capture("$pageview", {
    $current_url: url,
    surface: "21st_agents",
  })
}

export function identify21stAgentsUser(
  userId: string,
  traits?: { email?: string | null; name?: string | null },
) {
  currentUserId = userId
  if (!isEnabled()) return
  getInstance()?.identify(userId, {
    ...traits,
    product: "21st_agents",
  })
}

export function reset21stAgentsUser() {
  currentUserId = null
  if (!isEnabled()) return
  getInstance()?.reset()
}

export function getCurrent21stAgentsUserId(): string | null {
  return currentUserId
}
