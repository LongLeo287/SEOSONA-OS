/**
 * PostHog tracking for Canvas home page (project management)
 */

import { getCanvasPosthog } from "./posthog-canvas"

/**
 * Track project-related actions on Canvas home page
 */
export function trackCanvasHomeAction(
  action: string,
  properties?: Record<string, any>,
) {
  // Skip in development mode
  if (process.env.NODE_ENV === "development") {
    console.log("Canvas home action (dev mode):", action, properties)
    return
  }

  const posthog = getCanvasPosthog()
  if (!posthog) return

  posthog.capture(action, {
    ...properties,
    page: "canvas_home",
    timestamp: new Date().toISOString(),
  })
}
