"use client"

import { useCallback, useMemo, useImperativeHandle, forwardRef, type Ref } from "react"
import { Check } from "lucide-react"
import { generateThemeJson } from "@/components/features/agents/an/playground/use-playground-state"
import { generateIntegrationMarkdown } from "@/components/features/agents/an/utils/generate-integration-markdown"
import type { VisualConfig } from "@/components/features/agents/an/types"

/* ── Public handle ── */

export interface GetStartedHandle {
  copyPrompt: () => void
}

/* ── Main component ── */

export const GetStartedStep = forwardRef(function GetStartedStep(
  {
    agentSlug,
    apiKey,
    visualConfig,
  }: {
    agentSlug: string
    apiKey?: string
    visualConfig?: VisualConfig | null
  },
  ref: Ref<GetStartedHandle>,
) {
  const slug = agentSlug || "my-agent"
  const themeJson = visualConfig ? generateThemeJson(visualConfig) : null

  const markdown = useMemo(
    () => generateIntegrationMarkdown(slug, apiKey, themeJson),
    [slug, apiKey, themeJson],
  )

  const copyPrompt = useCallback(() => {
    navigator.clipboard.writeText(markdown)
  }, [markdown])

  useImperativeHandle(ref, () => ({ copyPrompt }), [copyPrompt])

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground">
            <Check className="h-3.5 w-3.5 text-background" />
          </div>
          <span className="text-[13px] font-medium text-muted-foreground">
            Agent created
          </span>
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Your agent is ready
        </h1>
        <p className="mt-1.5 text-[14px] text-muted-foreground leading-relaxed">
          Copy the integration prompt for your AI coding assistant, or head to the dashboard.
        </p>
      </div>
    </div>
  )
})
