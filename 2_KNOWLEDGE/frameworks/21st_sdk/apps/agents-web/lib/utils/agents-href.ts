/**
 * Returns the href as-is. Now that An content lives at /agents on the main
 * domain (no satellite), no path transformation is needed.
 */
export function agentsHref(path: string): string {
  return path
}
