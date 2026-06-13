import posthog, { PostHog } from "posthog-js"

let canvasPosthog: PostHog | undefined = undefined
let currentUserId: string | null = null

export function initCanvasPostHog(userId?: string) {
  if (typeof window === "undefined") return

  // Skip initialization in development mode unless forced
  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_FORCE_ANALYTICS !== "true"
  ) {
    console.log("PostHog Canvas disabled in development mode")
    return
  }

  // Only initialize if we have Canvas PostHog keys
  if (process.env.NEXT_PUBLIC_POSTHOG_CANVAS_KEY) {
    posthog.init(
      process.env.NEXT_PUBLIC_POSTHOG_CANVAS_KEY,
      {
        api_host:
          process.env.NEXT_PUBLIC_POSTHOG_CANVAS_HOST ||
          "https://us.i.posthog.com",
        disable_session_recording: true, // Enable session recording for Canvas
        autocapture: false, // Enable autocapture for Canvas interactions
        capture_pageview: false, // Track Canvas page views
        session_recording: {
          blockSelector: "iframe", // Still block iframe recording
        },
        // Add Canvas-specific configuration
        property_blacklist: [], // Don't blacklist any properties for Canvas
        sanitize_properties: null, // Don't sanitize Canvas properties
      },
      "canvas", // Unique instance name
    )

    canvasPosthog = (posthog as any).canvas as PostHog

    // Auto-identify user if provided
    if (userId) {
      identifyCanvasUser(userId)
    }
  }
}

export function getCanvasPosthog(): PostHog | undefined {
  if (typeof window === "undefined") return undefined
  return canvasPosthog
}

export function captureCanvasEvent(
  eventName: string,
  properties?: Record<string, any>,
) {
  // Skip in development mode unless forced
  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_FORCE_ANALYTICS !== "true"
  ) {
    console.log("Canvas event (dev mode):", eventName, properties)
    return
  }

  const ph = getCanvasPosthog()
  if (ph) {
    ph.capture(eventName, {
      ...properties,
      canvas_context: true, // Always mark events as coming from Canvas
      page_path: window.location.pathname,
    })
  }
}

export function identifyCanvasUser(
  userId: string,
  traits?: Record<string, any>,
) {
  currentUserId = userId
  const ph = getCanvasPosthog()
  if (ph) {
    ph.identify(userId, {
      ...traits,
      canvas_user: true,
      platform: "canvas",
    })
  }
}

export function getCurrentUserId(): string | null {
  return currentUserId
}

export function shutdownCanvasPostHog() {
  if (canvasPosthog) {
    canvasPosthog.reset()
    canvasPosthog = undefined
  }
  currentUserId = null
}

// Track UI interactions (buttons, shortcuts, etc.) - PostHog only
export function trackCanvasUIAction(
  action: string,
  properties?: Record<string, any>,
) {
  // Skip in development mode unless forced
  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_FORCE_ANALYTICS !== "true"
  ) {
    return
  }

  captureCanvasEvent(`canvas_ui_${action}`, {
    user_id: currentUserId,
    timestamp: Date.now(),
    ...properties,
  })
}

// Dual tracking: send to both internal analytics and PostHog
export async function trackCanvasAction(params: {
  sandboxId: string
  action: string
  metadata?: Record<string, any>
  projectId?: string
}) {
  const { sandboxId, action, metadata = {}, projectId } = params

  // Skip analytics in development mode unless forced
  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_FORCE_ANALYTICS !== "true"
  ) {
    console.log("Canvas action (dev mode):", {
      sandboxId,
      action,
      projectId,
      metadata,
    })
    return
  }

  // Validate required parameters
  if (!sandboxId || !action) {
    console.error("trackCanvasAction: missing required fields", {
      sandboxId,
      action,
    })
    return
  }

  // 1. Send to internal analytics (existing system)
  try {
    const payload: {
      sandboxId: string
      action: string
      projectId?: string
      metadata?: Record<string, any>
    } = {
      sandboxId,
      action,
    }

    if (projectId) {
      payload.projectId = projectId
    }

    if (metadata && Object.keys(metadata).length > 0) {
      payload.metadata = metadata
    }

    await fetch("/api/canvas-analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  } catch (error) {
    console.error("Failed to track internal canvas action:", error)
  }

  // 2. Send to PostHog
  captureCanvasEvent(`canvas_${action}`, {
    sandbox_id: sandboxId,
    project_id: projectId,
    user_id: currentUserId,
    ...metadata,
    timestamp: Date.now(),
  })
}

// For tRPC contexts - dual tracking with mutation
export function trackCanvasActionWithMutation(
  sendCanvasActionMutation: any,
  params: {
    sandboxId: string
    action: string
    metadata?: Record<string, any>
    projectId?: string
  },
) {
  const { sandboxId, action, metadata = {}, projectId } = params

  // Skip analytics in development mode unless forced
  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_FORCE_ANALYTICS !== "true"
  ) {
    console.log("Canvas action with mutation (dev mode):", {
      sandboxId,
      action,
      projectId,
      metadata,
    })
    return
  }

  // Validate required parameters
  if (!sandboxId || !action) {
    console.error("trackCanvasActionWithMutation: missing required fields", {
      sandboxId,
      action,
    })
    return
  }

  try {
    // Check if mutation is available
    if (
      !sendCanvasActionMutation ||
      typeof sendCanvasActionMutation.mutate !== "function"
    ) {
      console.error(
        "❌ sendCanvasActionMutation is not properly initialized:",
        sendCanvasActionMutation,
      )
      return
    }

    // 1. Send to internal analytics via tRPC mutation
    const payload: {
      sandboxId: string
      action: string
      projectId?: string
      metadata?: Record<string, any>
    } = {
      sandboxId,
      action,
    }

    if (projectId) {
      payload.projectId = projectId
    }

    if (metadata && Object.keys(metadata).length > 0) {
      payload.metadata = metadata
    }

    sendCanvasActionMutation.mutate(payload)

    // 2. Send to PostHog
    captureCanvasEvent(`canvas_${action}`, {
      sandbox_id: sandboxId,
      project_id: projectId,
      user_id: currentUserId,
      ...metadata,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error("trackCanvasActionWithMutation failed:", error)
  }
}
