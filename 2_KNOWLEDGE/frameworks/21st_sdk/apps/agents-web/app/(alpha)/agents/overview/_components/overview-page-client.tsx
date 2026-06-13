"use client"

import { useEffect } from "react"
import { useSetAtom } from "jotai"
import { anSelectedAgentAtom } from "@/lib/atoms/an-agent"
import { OverviewContent } from "../../_components/overview-content"

export function OverviewPageClient() {
  const setSelectedAgent = useSetAtom(anSelectedAgentAtom)

  // All-agents view — clear agent selection on mount
  useEffect(() => {
    setSelectedAgent(null)
  }, [setSelectedAgent])

  return <OverviewContent />
}
