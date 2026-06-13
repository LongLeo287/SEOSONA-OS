"use client"

import AnLanding from "@/components/features/agents/an/an-landing"
import type { SearchRecord } from "@/lib/agents-docs/search"

export function AgentsLanding({ searchIndex }: { searchIndex: SearchRecord[] }) {
  return <AnLanding searchIndex={searchIndex} />
}
