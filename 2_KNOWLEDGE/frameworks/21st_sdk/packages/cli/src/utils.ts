/**
 * Shared CLI utility functions.
 */

/**
 * Extract the value that follows a given flag in an argv-style array.
 * Returns `undefined` when the flag is absent or has no usable value.
 */
export function getFlagValue(args: string[], flag: string): string | undefined {
  const idx = args.indexOf(flag)
  if (idx === -1 || idx + 1 >= args.length) return undefined
  const next = args[idx + 1]?.trim()
  if (!next || next.startsWith("--")) return undefined
  return next
}

/**
 * Validate an agent slug.
 * Returns an error message string if invalid, or `undefined` if valid.
 */
export function validateSlug(slug: string): string | undefined {
  if (!slug) return "Agent slug cannot be empty"
  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(slug))
    return "Slug must be lowercase alphanumeric and hyphens only (no leading/trailing hyphens)"
  if (slug.length > 100) return "Slug must be 100 characters or less"
}

export function formatTimestamp(value: string | null): string {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toISOString().slice(0, 19).replace("T", " ")
}

export function formatCell(value: string, width: number): string {
  if (value.length > width) return value.slice(0, width - 1) + "\u2026"
  return value.padEnd(width)
}
