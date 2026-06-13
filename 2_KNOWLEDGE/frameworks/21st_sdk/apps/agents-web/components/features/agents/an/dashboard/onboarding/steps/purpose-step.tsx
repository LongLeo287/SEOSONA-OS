"use client"

import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { OnboardingState, AgentPurpose } from "../atoms"
import { AGENT_PRESETS, TOOL_DISPLAY_LABELS } from "../presets"

const PURPOSES: {
  value: AgentPurpose
  label: string
  description: string
  tools: string[]
}[] = [
  {
    value: "customer-support",
    label: "Customer Support",
    description: "Answer questions, troubleshoot issues, guide users",
    tools: AGENT_PRESETS["customer-support"]!.tools.map((t) => TOOL_DISPLAY_LABELS[t] ?? t),
  },
  {
    value: "sales",
    label: "Sales Assistant",
    description: "Qualify leads, answer product questions, book demos",
    tools: AGENT_PRESETS["sales"]!.tools.map((t) => TOOL_DISPLAY_LABELS[t] ?? t),
  },
  {
    value: "research",
    label: "Research & Analysis",
    description: "Search the web, read docs, deliver structured insights",
    tools: AGENT_PRESETS["research"]!.tools.map((t) => TOOL_DISPLAY_LABELS[t] ?? t),
  },
  {
    value: "docs-assistant",
    label: "Docs Assistant",
    description: "Navigate documentation, find answers, explain concepts",
    tools: AGENT_PRESETS["docs-assistant"]!.tools.map((t) => TOOL_DISPLAY_LABELS[t] ?? t),
  },
  {
    value: "onboarding",
    label: "Onboarding Guide",
    description: "Walk new users through setup and first steps",
    tools: AGENT_PRESETS["onboarding"]!.tools.map((t) => TOOL_DISPLAY_LABELS[t] ?? t),
  },
  {
    value: "internal-tools",
    label: "Internal Tooling",
    description: "Automate workflows, query data, run operations",
    tools: AGENT_PRESETS["internal-tools"]!.tools.map((t) => TOOL_DISPLAY_LABELS[t] ?? t),
  },
]

export function PurposeStep({
  state,
  setState,
  onNext,
}: {
  state: OnboardingState
  setState: (fn: (s: OnboardingState) => OnboardingState) => void
  onNext: () => void
}) {
  function selectPurpose(purpose: AgentPurpose) {
    setState((s) => ({ ...s, purpose }))
    onNext()
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          What will your agent do?
        </h1>
        <p className="mt-1.5 text-[14px] text-neutral-500">
          Pick a starting point. You can change everything later.
        </p>
      </div>

      <div className="space-y-2">
        {PURPOSES.map((p) => (
          <button
            key={p.value}
            onClick={() => selectPurpose(p.value)}
            className={cn(
              "group flex w-full flex-col gap-2 rounded-xl border px-4 py-3.5 text-left transition-all",
              "border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.03]",
              "active:scale-[0.99]",
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-medium text-white">
                {p.label}
              </span>
              <ChevronRight className="h-4 w-4 text-neutral-700 transition-all group-hover:text-neutral-400 group-hover:translate-x-0.5" />
            </div>
            <span className="text-[13px] leading-snug text-neutral-600 transition-colors group-hover:text-neutral-500">
              {p.description}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {p.tools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-md bg-white/[0.06] px-2 py-0.5 text-[11px] font-medium text-neutral-500"
                >
                  {tool}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 py-1">
        <div className="h-px flex-1 bg-white/[0.06]" />
        <span className="text-[11px] font-medium uppercase tracking-widest text-neutral-700">
          or
        </span>
        <div className="h-px flex-1 bg-white/[0.06]" />
      </div>

      <button
        onClick={() => selectPurpose("custom")}
        className={cn(
          "group flex w-full flex-col gap-1 rounded-xl border border-dashed px-4 py-3.5 text-left transition-all",
          "border-white/[0.08] hover:border-white/[0.18] hover:bg-white/[0.02]",
          "active:scale-[0.99]",
        )}
      >
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-medium text-white">
            Custom Agent
          </span>
          <ChevronRight className="h-4 w-4 text-neutral-700 transition-all group-hover:text-neutral-400 group-hover:translate-x-0.5" />
        </div>
        <span className="text-[13px] text-neutral-600 transition-colors group-hover:text-neutral-500">
          Start from scratch — pick your own tools, model, and prompt
        </span>
      </button>
    </div>
  )
}
