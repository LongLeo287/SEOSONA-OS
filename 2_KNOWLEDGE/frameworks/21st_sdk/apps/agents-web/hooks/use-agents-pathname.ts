"use client"

import { usePathname } from "next/navigation"

/**
 * Returns the pathname for An/agents routes.
 * Now that An content lives at /agents on the main domain (no satellite),
 * this is simply a passthrough to usePathname().
 */
export function useAgentsPathname(): string {
  return usePathname() ?? ""
}
