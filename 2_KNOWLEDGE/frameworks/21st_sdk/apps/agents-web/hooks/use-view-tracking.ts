"use client"

/**
 * Component View Tracking Hooks
 *
 * This module provides two tracking strategies for different UI contexts:
 *
 * 1. useViewTracking (hover-based):
 *    - Used for: Video preview cards in grids/lists
 *    - Triggers: When user hovers to play video preview
 *    - Rationale: Hover indicates intentional interest; passive scrolling doesn't count
 *
 * 2. useViewportTracking (visibility-based):
 *    - Used for: Feed cards, content that auto-plays or is primarily visual
 *    - Triggers: When element is 50% visible for 1+ second
 *    - Rationale: For feed-style content, visibility duration indicates engagement
 *
 * Both hooks share session-level deduplication via viewedComponentsThisSession Set.
 * Server-side deduplication (24h window) is handled in use-analytics.ts.
 */

import { useCallback, useEffect, useRef } from "react"
import { useSupabaseAnalytics } from "./use-analytics"
import { AnalyticsActivityType } from "@/types/global"

// Session-level deduplication with LRU-like behavior
// Uses a Set with max size to prevent unbounded memory growth
const MAX_TRACKED_COMPONENTS = 1000
const LRU_EVICTION_RATIO = 0.1 // Remove 10% of oldest entries when at capacity
const viewedComponentsThisSession = new Set<number>()

/**
 * Add a component ID to the viewed set with LRU-like eviction
 * When max size is reached, removes oldest entries (first added)
 */
function addViewedComponent(componentId: number): void {
  // If already in set, no need to add
  if (viewedComponentsThisSession.has(componentId)) return

  // If at max capacity, remove oldest entries
  if (viewedComponentsThisSession.size >= MAX_TRACKED_COMPONENTS) {
    const entriesToRemove = Math.ceil(
      MAX_TRACKED_COMPONENTS * LRU_EVICTION_RATIO,
    )
    const iterator = viewedComponentsThisSession.values()
    for (let i = 0; i < entriesToRemove; i++) {
      const oldest = iterator.next().value
      if (oldest !== undefined) {
        viewedComponentsThisSession.delete(oldest)
      }
    }
  }

  viewedComponentsThisSession.add(componentId)
}

interface UseViewTrackingOptions {
  /** User ID for analytics (optional) */
  userId?: string
  /** Whether tracking is enabled (default: true) */
  enabled?: boolean
}

interface UseViewportTrackingOptions extends UseViewTrackingOptions {
  /** Intersection threshold (0-1, default: 0.5 = 50% visible) */
  threshold?: number
  /** Minimum time in viewport before counting as view (ms, default: 1000) */
  minViewTime?: number
}

/**
 * Hook to track component views on hover/interaction
 * Deduplicates views within a session - each component counted only once per session
 */
export function useViewTracking(
  componentId: number | undefined | null,
  options: UseViewTrackingOptions = {},
) {
  const { userId, enabled = true } = options
  const { capture } = useSupabaseAnalytics()

  const trackView = useCallback(() => {
    if (!enabled || !componentId) return

    // Skip if already viewed this session
    if (viewedComponentsThisSession.has(componentId)) return

    // Mark as viewed and capture
    addViewedComponent(componentId)
    capture(componentId, AnalyticsActivityType.COMPONENT_VIEW, userId)
  }, [componentId, enabled, userId, capture])

  return { trackView }
}

/**
 * Hook to track component views when element enters viewport
 * Uses Intersection Observer with configurable threshold and minimum view time
 *
 * @template T - The HTML element type (defaults to HTMLElement)
 */
export function useViewportTracking<T extends HTMLElement = HTMLElement>(
  componentId: number | undefined | null,
  options: UseViewportTrackingOptions = {},
) {
  const {
    userId,
    enabled = true,
    threshold = 0.5,
    minViewTime = 1000,
  } = options

  const { capture } = useSupabaseAnalytics()
  const elementRef = useRef<T | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const hasTrackedRef = useRef(false)
  // Use refs to avoid stale closures in timer callback
  const componentIdRef = useRef(componentId)
  componentIdRef.current = componentId
  const userIdRef = useRef(userId)
  userIdRef.current = userId

  useEffect(() => {
    // Reset tracking state at the start of effect (handles componentId changes)
    // This must happen BEFORE checking viewedComponentsThisSession
    hasTrackedRef.current = false

    if (!enabled || !componentId) return

    // Skip if already viewed this session (set flag to prevent duplicate tracking)
    if (viewedComponentsThisSession.has(componentId)) {
      hasTrackedRef.current = true
      return
    }

    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return

        if (entry.isIntersecting && !hasTrackedRef.current) {
          // Start timer when element becomes visible
          timerRef.current = setTimeout(() => {
            const currentId = componentIdRef.current
            const currentUserId = userIdRef.current
            if (!hasTrackedRef.current && currentId) {
              hasTrackedRef.current = true
              addViewedComponent(currentId)
              capture(currentId, AnalyticsActivityType.COMPONENT_VIEW, currentUserId)
            }
          }, minViewTime)
        } else {
          // Clear timer if element leaves viewport before minViewTime
          if (timerRef.current) {
            clearTimeout(timerRef.current)
            timerRef.current = null
          }
        }
      },
      { threshold },
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [componentId, enabled, threshold, minViewTime, userId, capture])

  return { ref: elementRef }
}

/**
 * Check if a component has been viewed this session
 */
export function hasViewedThisSession(componentId: number): boolean {
  return viewedComponentsThisSession.has(componentId)
}

/**
 * Clear the session view tracking (useful for testing)
 */
export function clearSessionViews(): void {
  viewedComponentsThisSession.clear()
}
