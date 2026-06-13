import { createClient } from "@supabase/supabase-js"
import { useCallback, useEffect, useState } from "react"
import { AnalyticsActivityType } from "@/types/global"

// Type guard for runtime checking
function isValidActivityType(type: string): type is AnalyticsActivityType {
  return Object.values(AnalyticsActivityType).includes(
    type as AnalyticsActivityType,
  )
}

// Client-side cache to avoid redundant duplicate checks
// Key format: `${component_id}:${activity_type}`
// Value: timestamp when event was recorded
const recentEventsCache = new Map<string, number>()
const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

// Initialize a dedicated Supabase client for analytics only
// Use a unique storageKey and disable session persistence to avoid GoTrueClient duplication
// Also memoize across HMR via globalThis to prevent multiple instances
declare global {
  // eslint-disable-next-line no-var
  var __sb_analytics__: ReturnType<typeof createClient> | undefined
}

const getAnalyticsClient = () => {
  if (typeof window === "undefined") {
    // SSR safe client (no storage used)
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    )
  }
  if (!globalThis.__sb_analytics__) {
    globalThis.__sb_analytics__ = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_KEY!,
      {
        auth: {
          storageKey: "sb-analytics",
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    )
  }
  return globalThis.__sb_analytics__
}

const supabase = getAnalyticsClient()

// Anonymous user ID generator
const generateAnonId = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  )
}

export function useSupabaseAnalytics() {
  const [anonId, setAnonId] = useState<string | null>(null)

  // Initialize or retrieve the anonymous ID
  useEffect(() => {
    if (typeof window === "undefined") return

    let storedAnonId = localStorage.getItem("21st_anon_id")
    if (!storedAnonId) {
      storedAnonId = generateAnonId()
      localStorage.setItem("21st_anon_id", storedAnonId)
    }
    setAnonId(storedAnonId)
  }, [])

  const capture = useCallback(
    async (
      component_id: number,
      activity_type: AnalyticsActivityType,
      user_id?: string,
    ) => {
      // Skip analytics in development mode
      if (process.env.NODE_ENV === "development") {
        return
      }

      try {
        // Runtime type check
        if (!isValidActivityType(activity_type)) {
          throw new Error(`Invalid activity type: ${activity_type}`)
        }

        // Determine identifier for checking duplicates - either user_id or anonymous ID
        const identifier = user_id || anonId

        if (!identifier) {
          // Skip recording if we have no way to identify the user (incognito mode, etc.)
          console.debug("No user identifier available")
          return
        }

        // Check client-side cache first to avoid unnecessary database queries
        const cacheKey = `${identifier}:${component_id}:${activity_type}`
        const cachedTimestamp = recentEventsCache.get(cacheKey)
        const now = Date.now()

        if (cachedTimestamp && now - cachedTimestamp < CACHE_TTL_MS) {
          // Event was recently recorded, skip the database check entirely
          return
        }

        // Check if this user/anon has performed this action in the last 24 hours
        const oneDayAgo = new Date()
        oneDayAgo.setDate(oneDayAgo.getDate() - 1)

        // Build the query - check either user_id OR anon_id, not both with empty values
        let query = supabase
          .from("component_analytics")
          .select("id")
          .eq("component_id", component_id)
          .eq("activity_type", activity_type)
          .gte("created_at", oneDayAgo.toISOString())
          .limit(1)

        // Add the appropriate filter based on whether we have a user_id or anon_id
        if (user_id) {
          query = query.eq("user_id", user_id)
        } else if (anonId) {
          query = query.eq("anon_id", anonId)
        }

        const { data: existingEvents } = await query

        // If a duplicate event is found, cache it and don't record again
        if (existingEvents && existingEvents.length > 0) {
          recentEventsCache.set(cacheKey, now)
          return
        }

        // No existing event found within the timeframe, insert the new event
        await insertAnalyticsEvent(component_id, activity_type, user_id, anonId)

        // Cache the successful insert to prevent future duplicate checks
        recentEventsCache.set(cacheKey, now)
      } catch (err) {
        console.error("Analytics capture error:", err)
      }
    },
    [anonId],
  )

  // Helper function to insert analytics event
  const insertAnalyticsEvent = async (
    component_id: number,
    activity_type: AnalyticsActivityType,
    user_id?: string,
    anon_id?: string | null,
  ) => {
    return supabase
      .from("component_analytics")
      .insert({
        component_id,
        activity_type,
        created_at: new Date().toISOString(),
        user_id,
        anon_id: !user_id ? anon_id : undefined, // Only store anon_id if user_id is not provided
      })
      .then(({ error }) => {
        if (error) {
          console.error("Analytics capture failed:", error)
        }
      })
  }

  return { capture }
}
