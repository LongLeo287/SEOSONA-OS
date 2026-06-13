import {
  SHAPE_SIZE_OPTIONS,
  type ShapeSizeKey,
} from "@/lib/server/ai/shape-size-generator"

/**
 * Client-side utilities for working with shape sizes
 */

export { SHAPE_SIZE_OPTIONS, type ShapeSizeKey }

/**
 * Get all available shape size options for UI display
 */
export function getShapeSizeOptions() {
  return Object.entries(SHAPE_SIZE_OPTIONS).map(([key, size]) => ({
    value: key as ShapeSizeKey,
    label: size.name,
    dimensions: `${size.width}×${size.height}`,
    ...size,
  }))
}

/**
 * Get shape size by key
 */
export function getShapeSize(key: ShapeSizeKey) {
  return SHAPE_SIZE_OPTIONS[key]
}

/**
 * Format shape size for display
 */
export function formatShapeSize(size: { width: number; height: number }) {
  return `${size.width}×${size.height}`
}

/**
 * Get responsive breakpoint info for a shape size
 */
export function getBreakpointInfo(key: ShapeSizeKey) {
  const breakpoints: Record<ShapeSizeKey, { min: number; max: number; device: string }> = {
    desktop: { min: 1024, max: Infinity, device: "Desktop" },
    mobile: { min: 0, max: 767, device: "Mobile" },
  }

  return breakpoints[key]
}
