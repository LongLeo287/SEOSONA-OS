"use client"

import { useState, useRef, useEffect } from "react"
import dynamic from "next/dynamic"
import { VISUAL_PRESETS } from "@/components/features/agents/an/types"
import { Logo } from "@/components/features/agents/ui/canvas/[id]/{components}/ui/logo"
import { AgentsLink as Link } from "@/components/agents-link"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/features/agents/an/docs/ui/select"

const UnifiedChatPreview = dynamic(
  () =>
    import(
      "@/components/features/agents/an/chat-preview/unified-preview"
    ).then((m) => m.UnifiedChatPreview),
  { ssr: false },
)

function PreviewWithLoader({
  children,
}: {
  children: React.ReactNode
}) {
  const [loaded, setLoaded] = useState(false)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Component is mounted = dynamic import resolved
    const t = setTimeout(() => setLoaded(true), 50)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (loaded) {
      const t = setTimeout(() => setShowContent(true), 300)
      return () => clearTimeout(t)
    }
  }, [loaded])

  return (
    <div className="relative h-[600px]">
      {/* Loader */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
        style={{ opacity: loaded ? 0 : 1, pointerEvents: loaded ? "none" : "auto" }}
      >
        <Logo className="w-5 h-5 animate-pulse text-muted-foreground" fill="currentColor" />
      </div>

      {/* Content */}
      <div
        className="h-full transition-opacity duration-300"
        style={{ opacity: showContent ? 1 : 0 }}
      >
        {children}
      </div>
    </div>
  )
}

/* ── Brand logos ── */

function NotionLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 268" className={className} xmlns="http://www.w3.org/2000/svg">
      <path fill="currentColor" opacity="0.15" d="M16.092 11.538 164.09.608c18.179-1.56 22.85-.508 34.28 7.801l47.243 33.282C253.406 47.414 256 48.975 256 55.207v182.527c0 11.439-4.155 18.205-18.696 19.24L65.44 267.378c-10.913.517-16.11-1.043-21.825-8.327L8.826 213.814C2.586 205.487 0 199.254 0 191.97V29.726c0-9.352 4.155-17.153 16.092-18.188Z" />
      <path fill="currentColor" d="M164.09.608 16.092 11.538C4.155 12.573 0 20.374 0 29.726v162.245c0 7.284 2.585 13.516 8.826 21.843l34.789 45.237c5.715 7.284 10.912 8.844 21.825 8.327l171.864-10.404c14.532-1.035 18.696-7.801 18.696-19.24V55.207c0-5.911-2.336-7.614-9.21-12.66l-1.185-.856L198.37 8.409C186.94.1 182.27-.952 164.09.608ZM69.327 52.22c-14.033.945-17.216 1.159-25.186-5.323L23.876 30.778c-2.06-2.086-1.026-4.69 4.163-5.207l142.274-10.395c11.947-1.043 18.17 3.12 22.842 6.758l24.401 17.68c1.043.525 3.638 3.637.517 3.637L71.146 52.095l-1.819.125Zm-16.36 183.954V81.222c0-6.767 2.077-9.887 8.3-10.413L230.02 60.93c5.724-.517 8.31 3.12 8.31 9.879v153.917c0 6.767-1.044 12.49-10.387 13.008l-161.487 9.361c-9.343.517-13.489-2.594-13.489-10.921ZM212.377 89.53c1.034 4.681 0 9.362-4.681 9.897l-7.783 1.542v114.404c-6.758 3.637-12.981 5.715-18.18 5.715-8.308 0-10.386-2.604-16.609-10.396l-50.898-80.079v77.476l16.1 3.646s0 9.362-12.989 9.362l-35.814 2.077c-1.043-2.086 0-7.284 3.63-8.318l9.351-2.595V109.823l-12.98-1.052c-1.043-4.68 1.55-11.439 8.826-11.965l38.426-2.585 52.958 81.113v-71.76l-13.498-1.552c-1.043-5.733 3.111-9.896 8.3-10.404l35.84-2.087Z" />
    </svg>
  )
}

function CursorLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 467 532" className={className} xmlns="http://www.w3.org/2000/svg">
      <path fill="currentColor" d="M457.43 125.94 244.42 2.96c-6.84-3.95-15.28-3.95-22.12 0L9.3 125.94c-5.75 3.32-9.3 9.46-9.3 16.11v247.99c0 6.65 3.55 12.79 9.3 16.11l213.01 122.98c6.84 3.95 15.28 3.95 22.12 0l213.01-122.98c5.75-3.32 9.3-9.46 9.3-16.11V142.05c0-6.65-3.55-12.79-9.3-16.11ZM444.05 152l-205.63 356.16c-1.39 2.4-5.06 1.42-5.06-1.36V273.58c0-4.66-2.49-8.97-6.53-11.31L24.87 145.67c-2.4-1.39-1.42-5.06 1.36-5.06h411.26c5.84 0 9.49 6.33 6.57 11.39Z" />
    </svg>
  )
}

function MinimalLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="13" height="13" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="8" r="2" fill="currentColor" opacity="0.4" />
    </svg>
  )
}

const THEME_LOGOS: Record<string, React.ReactNode> = {
  notion: <NotionLogo className="h-3.5 w-3.5" />,
  cursor: <CursorLogo className="h-3.5 w-3.5" />,
  minimal: <MinimalLogo className="h-3.5 w-3.5" />,
}

const PRESET_OPTIONS = Object.entries(VISUAL_PRESETS).map(([key, preset]) => ({
  value: key,
  label: preset.label,
  description: preset.description,
}))

export function TryItOutContent() {
  const [selectedPreset, setSelectedPreset] = useState("notion")
  const replayRef = useRef<(() => void) | null>(null)

  const currentConfig = VISUAL_PRESETS[selectedPreset]?.config

  if (!currentConfig) return null

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Try It Out
        </h1>
        <p className="mt-1.5 text-[14px] text-muted-foreground leading-relaxed">
          See how agent chats can look with a few example visual styles. Select a
          style below to preview the chat experience.
        </p>
      </div>

      {/* Preview + Controls block */}
      <div className="overflow-hidden rounded-xl border border-border shadow-sm">
        {/* Chat Preview */}
        <PreviewWithLoader>
          <UnifiedChatPreview
            visualConfig={currentConfig}
            replayRef={replayRef}
          />
        </PreviewWithLoader>

        {/* Controls */}
        <div className="flex items-center gap-3 border-t border-border bg-muted/50 px-4 py-3">
          <Select value={selectedPreset} onValueChange={setSelectedPreset}>
            <SelectTrigger className="w-[180px] h-8 bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRESET_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <span className="flex items-center gap-2">
                    {THEME_LOGOS[option.value]}
                    {option.label}
                  </span>
                </SelectItem>
              ))}
              <Link
                href="/agents/theme-builder"
                className="an-focus-btn relative flex items-center gap-1.5 min-h-[32px] py-[5px] ps-2 pe-7 mx-1 rounded-md text-sm text-muted-foreground transition-colors hover:bg-accent dark:hover:bg-neutral-800 hover:text-foreground"
              >
                Custom theme
                <span className="absolute end-2 flex size-3.5 items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-50">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </span>
              </Link>
            </SelectContent>
          </Select>

          <div className="flex-1" />

          <button
            onClick={() => replayRef.current?.()}
            className="an-focus-btn inline-flex items-center gap-1.5 rounded-[10px] border border-border bg-background px-3.5 py-1.5 text-[13px] font-medium text-muted-foreground transition-all duration-150 hover:bg-accent hover:text-foreground active:scale-[0.99]"
          >
            Replay
          </button>
        </div>
      </div>

      {/* Info */}
      <p className="text-[13px] text-muted-foreground leading-relaxed">
        This is a demo animation showing the agent interaction flow. The actual
        agent connects to a live backend with real tool execution.{" "}
        <Link
          href="/agents/docs/get-started"
          className="an-focus-btn rounded text-foreground underline underline-offset-4 hover:opacity-80"
        >
          Get started
        </Link>{" "}
        to build your own.
      </p>

      {/* What's next */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">What&apos;s next</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { title: "Quickstart", description: "Create an agent, deploy, and add it to your app.", href: "/agents/docs/get-started" },
            { title: "Core Concepts", description: "Agents, skills, projects, and how the pieces fit.", href: "/agents/docs/core-concepts" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="an-focus-btn group rounded-lg border border-border p-4 transition-colors hover:bg-secondary/30"
            >
              <p className="text-[13px] font-medium group-hover:text-foreground">{item.title}</p>
              <p className="mt-0.5 text-[12px] text-muted-foreground">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
