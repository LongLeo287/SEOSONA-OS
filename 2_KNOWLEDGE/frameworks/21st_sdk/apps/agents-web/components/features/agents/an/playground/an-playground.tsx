"use client"

import { useState } from "react"
import { AgentsLink as Link } from "@/components/agents-link"
import { Logo } from "@/components/features/agents/ui/canvas/[id]/{components}/ui/logo"
import { DashedDivider } from "@/components/features/agents/landing/dashed-divider"
import { AnFooter } from "../an-footer"
import { ThemeToggle } from "../dashboard/theme-toggle"
import { usePlaygroundState } from "./use-playground-state"
import { ConfigPanel } from "./config/config-panel"
import { PlaygroundPreviewPanel } from "./playground-preview-panel"
import { PlaygroundCodePanel } from "./playground-code-panel"
import type { FrameworkId } from "./playground-types"

/* ── Nav ── */

function PlaygroundNav() {
  return (
    <nav aria-label="Playground navigation" className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center gap-3">
        <Link
          href="/agents"
          className="flex items-center gap-2 text-sm font-medium tracking-tight text-foreground/70 hover:text-foreground transition-colors rounded-lg px-1.5 py-1 -mx-1.5 -my-1 an-focus-btn"
        >
          <Logo className="w-4 h-4" fill="currentColor" />
          An
        </Link>
        <div className="w-px h-4 bg-foreground/[0.08]" aria-hidden="true" />
        <span className="text-sm font-medium tracking-tight text-foreground">
          Playground
        </span>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link
          href="/agents/docs"
          className="inline-flex items-center justify-center h-8 rounded-[10px] border border-border bg-secondary px-3 text-[12px] font-medium text-muted-foreground transition-[background-color,color,border-color,transform] duration-150 ease-out hover:bg-accent hover:text-foreground active:scale-[0.97] an-focus-btn"
        >
          Docs
        </Link>
        <button
          type="button"
          className="an-focus-btn inline-flex items-center justify-center rounded-[10px] h-8 px-3.5 text-[12px] font-medium bg-foreground text-background hover:bg-foreground/90 transition-all duration-150 active:scale-[0.97]"
        >
          Sign in
        </button>
      </div>
    </nav>
  )
}

/* ── Page ── */

export default function AnPlayground() {
  const [framework, setFramework] = useState<FrameworkId>("react")
  const { config, dispatch, generatedCode, themeCode } = usePlaygroundState(framework)

  return (
    <div
      data-an-playground
      className="h-screen overflow-hidden bg-background text-foreground antialiased selection:bg-foreground/20"
    >
      <div className="relative mx-auto w-full max-w-[1400px] border-x border-border h-full flex flex-col">
        <PlaygroundNav />

        {/* Main 3-column layout */}
        <main className="flex-1 min-h-0 flex flex-col lg:flex-row">
          {/* Config panel */}
          <div className="lg:w-[320px] shrink-0 border-b lg:border-b-0 lg:border-r border-border overflow-y-auto max-h-[40vh] lg:max-h-none" tabIndex={-1}>
            <ConfigPanel config={config} dispatch={dispatch} />
          </div>

          {/* Preview panel */}
          <div className="flex-1 min-w-0 min-h-[300px] lg:min-h-0 border-b lg:border-b-0 lg:border-r border-border overflow-hidden">
            <PlaygroundPreviewPanel config={config} />
          </div>

          {/* Code panel */}
          <div className="lg:w-[360px] shrink-0 overflow-y-auto min-h-[200px] lg:min-h-0" tabIndex={-1}>
            <PlaygroundCodePanel
              generatedCode={generatedCode}
              themeCode={themeCode}
              config={config}
              framework={framework}
              onFrameworkChange={setFramework}
            />
          </div>
        </main>

        <DashedDivider />
        <AnFooter />
      </div>
    </div>
  )
}
