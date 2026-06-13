"use client"

import { cn } from "@/lib/utils"
import type { OnboardingState } from "../atoms"
import { ALL_AVAILABLE_TOOLS } from "../presets"

const RUNTIMES: { value: OnboardingState["runtime"]; label: string }[] = [
  { value: "claude-code", label: "Claude Code" },
  { value: "codex", label: "Codex (OpenAI)" },
]

const MODELS: Record<string, { value: string; label: string }[]> = {
  "claude-code": [
    { value: "claude-sonnet-4-6", label: "Claude Sonnet 4.6" },
    { value: "claude-opus-4-6", label: "Claude Opus 4.6" },
    { value: "claude-haiku-4-5-20251001", label: "Claude Haiku 4.5" },
  ],
  codex: [
    { value: "gpt-5.4/medium", label: "GPT 5.4" },
    { value: "gpt-5.3-codex/medium", label: "GPT-5.3 Codex" },
    { value: "gpt-5.2-codex/medium", label: "GPT-5.2 Codex" },
    { value: "gpt-5.1-codex-mini/medium", label: "GPT-5.1 Codex Mini" },
  ],
}

/* ── Inline checkbox (hardcoded dark colors, no CSS variables) ── */

function DarkCheckbox({
  checked,
  onCheckedChange,
}: {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
        checked
          ? "border-white bg-white"
          : "border-neutral-700 bg-transparent hover:border-neutral-600",
      )}
    >
      {checked && (
        <svg
          width="9"
          height="9"
          viewBox="0 0 9 9"
          fill="#09090b"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.53547 0.62293C8.88226 0.849446 8.97976 1.3142 8.75325 1.66099L4.5083 8.1599C4.38833 8.34356 4.19397 8.4655 3.9764 8.49358C3.75883 8.52167 3.53987 8.45309 3.3772 8.30591L0.616113 5.80777C0.308959 5.52987 0.285246 5.05559 0.563148 4.74844C0.84105 4.44128 1.31533 4.41757 1.62249 4.69547L3.73256 6.60459L7.49741 0.840706C7.72393 0.493916 8.18868 0.396414 8.53547 0.62293Z"
          />
        </svg>
      )}
    </button>
  )
}

/* ── Main component (content-only, no button) ── */

export function OverviewStep({
  state,
  setState,
}: {
  state: OnboardingState
  setState: (fn: (s: OnboardingState) => OnboardingState) => void
}) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Configure your agent
        </h1>
        <p className="mt-1.5 text-[14px] text-neutral-500">
          Select the tools, runtime, and model for your custom agent.
        </p>
      </div>

      {/* Runtime */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-medium uppercase tracking-widest text-neutral-600">
          Runtime
        </label>
        <div className="flex h-9 rounded-lg bg-white/[0.06] p-0.5">
          {RUNTIMES.map((rt) => (
            <button
              key={rt.value}
              onClick={() =>
                setState((s) => ({
                  ...s,
                  runtime: rt.value,
                  model: MODELS[rt.value]?.[0]?.value ?? s.model,
                }))
              }
              className={cn(
                "flex-1 rounded-md text-[12px] font-medium transition-colors",
                state.runtime === rt.value
                  ? "bg-white/[0.12] text-white shadow-sm"
                  : "text-neutral-500 hover:text-neutral-300",
              )}
            >
              {rt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Model */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-medium uppercase tracking-widest text-neutral-600">
          Model
        </label>
        <div className="space-y-1.5">
          {(MODELS[state.runtime] ?? []).map((m) => (
            <label
              key={m.value}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
                state.model === m.value
                  ? "border-white/[0.15] bg-white/[0.04]"
                  : "border-white/[0.08] hover:bg-white/[0.03]",
              )}
            >
              <input
                type="radio"
                name="model"
                value={m.value}
                checked={state.model === m.value}
                onChange={() =>
                  setState((s) => ({ ...s, model: m.value }))
                }
                className="sr-only"
              />
              <div
                className={cn(
                  "h-4 w-4 shrink-0 rounded-full border-2",
                  state.model === m.value
                    ? "border-white bg-white"
                    : "border-neutral-700",
                )}
              >
                {state.model === m.value && (
                  <div className="flex h-full items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#09090b]" />
                  </div>
                )}
              </div>
              <span className="text-[13px] font-medium text-white">{m.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Tools */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-medium uppercase tracking-widest text-neutral-600">
          Tools ({state.selectedTools.length} selected)
        </label>
        <div className="rounded-lg border border-white/[0.08] divide-y divide-white/[0.08] overflow-hidden">
          {ALL_AVAILABLE_TOOLS.map((tool) => (
            <label
              key={tool.name}
              className="flex cursor-pointer items-center gap-2.5 px-3 py-2.5 hover:bg-white/[0.03] transition-colors"
            >
              <DarkCheckbox
                checked={state.selectedTools.includes(tool.name)}
                onCheckedChange={(checked) =>
                  setState((s) => ({
                    ...s,
                    selectedTools: checked
                      ? [...s.selectedTools, tool.name]
                      : s.selectedTools.filter((t) => t !== tool.name),
                  }))
                }
              />
              <div className="flex-1">
                <span className="text-[13px] font-medium text-white">
                  {tool.name}
                </span>
                <span className="ml-2 text-[12px] text-neutral-500">
                  {tool.description}
                </span>
              </div>
              <span className="rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-medium text-neutral-600">
                {tool.category}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
