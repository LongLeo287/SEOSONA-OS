"use client"

import { useEffect, useRef } from "react"
import type { OnboardingState } from "../atoms"

/* ── Helpers ── */

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

/* ── Main component (content-only, no button) ── */

export function IdentityStep({
  state,
  setState,
  isActive,
  hideHeader,
}: {
  state: OnboardingState
  setState: (fn: (s: OnboardingState) => OnboardingState) => void
  isActive?: boolean
  hideHeader?: boolean
}) {
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isActive) {
      // Delay to let cross-fade transition activate
      const raf = requestAnimationFrame(() => {
        nameRef.current?.focus()
      })
      return () => cancelAnimationFrame(raf)
    }
  }, [isActive])

  useEffect(() => {
    if (state.agentName) {
      setState((s) => ({ ...s, agentSlug: slugify(s.agentName) }))
    }
  }, [state.agentName, setState])

  return (
    <div className="space-y-5">
      {!hideHeader && (
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Create your agent
          </h1>
          <p className="mt-1.5 text-[14px] text-muted-foreground">
            Name it and describe what it does.
          </p>
        </div>
      )}

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground/60">
          Name
        </label>
        <input
          type="text"
          value={state.agentName}
          onChange={(e) =>
            setState((s) => ({ ...s, agentName: e.target.value }))
          }
          ref={nameRef}
          placeholder="My Agent"
          className="an-focus-input w-full h-9 rounded-lg border border-border bg-foreground/[0.04] px-3 text-[13px] text-foreground placeholder:text-muted-foreground/60"
        />
      </div>

      {/* System Prompt */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground/60">
          System Prompt
        </label>
        <textarea
          value={state.systemPrompt}
          onChange={(e) =>
            setState((s) => ({ ...s, systemPrompt: e.target.value }))
          }
          placeholder="Describe what your agent should do..."
          rows={4}
          className="an-focus-input w-full rounded-lg border border-border bg-foreground/[0.04] px-3 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground/60 resize-none leading-relaxed"
        />
        <p className="text-[11px] text-muted-foreground/50">
          Optional. You can always change this later.
        </p>
      </div>

    </div>
  )
}
