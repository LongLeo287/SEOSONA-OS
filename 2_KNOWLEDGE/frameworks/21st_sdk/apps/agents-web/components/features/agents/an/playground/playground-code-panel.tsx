"use client"

import { useState, useRef } from "react"
import {
  DashedBox,
} from "@/components/features/agents/landing/dashed-divider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../docs/ui/select"
import {
  ReactIcon,
  NextjsIcon,
} from "../docs/framework-icons"
import type { AgentConfig, FrameworkId } from "./playground-types"
import { FRAMEWORK_OPTIONS } from "./playground-types"
import { HighlightedCode, CopyButton } from "./playground-code-shared"

/* ── Framework icons ── */

function SdkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className ?? "h-3.5 w-3.5"} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

const FRAMEWORK_ICONS: Record<FrameworkId, React.ComponentType<{ className?: string }>> = {
  react: ReactIcon,
  nextjs: NextjsIcon,
  sdk: SdkIcon,
}

/* ── Copy prompt button ── */

function CopyPromptButton({ generatedCode, themeCode, framework }: { generatedCode: string; themeCode: string; framework: FrameworkId }) {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>(null)

  const handleCopy = async () => {
    const fw = FRAMEWORK_OPTIONS.find((f) => f.id === framework)
    const prompt = `Here is my An agent configuration (${fw?.label ?? framework} framework).

Docs: https://21st.dev/an/docs

## MyAgent.tsx
\`\`\`tsx
${generatedCode}
\`\`\`

## theme.json
\`\`\`json
${themeCode}
\`\`\``

    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API not available
    }
  }

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? "Prompt copied" : "Copy prompt with code and docs link"}
      className="flex items-center gap-1.5 h-7 rounded-lg border border-border bg-secondary px-2.5 text-xs text-muted-foreground transition-[background-color,color,border-color,transform] duration-150 ease-out hover:bg-accent hover:text-foreground active:scale-[0.97] an-focus-btn"
    >
      <div className="relative w-3.5 h-3.5 shrink-0" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`absolute inset-0 w-3.5 h-3.5 text-muted-foreground transition-[opacity,transform] duration-200 ease-out ${copied ? "opacity-0 scale-50" : "opacity-100 scale-100"}`}>
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`absolute inset-0 w-3.5 h-3.5 text-emerald-500 transition-[opacity,transform] duration-200 ease-out ${copied ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}>
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <span className="w-[72px] text-center whitespace-nowrap">{copied ? "Copied!" : "Copy prompt"}</span>
    </button>
  )
}

/* ── Code panel ── */

export function PlaygroundCodePanel({
  generatedCode,
  themeCode,
  config,
  framework,
  onFrameworkChange,
}: {
  generatedCode: string
  themeCode: string
  config: AgentConfig
  framework: FrameworkId
  onFrameworkChange: (fw: FrameworkId) => void
}) {
  const currentFw = FRAMEWORK_OPTIONS.find((f) => f.id === framework)
  const CurrentIcon = FRAMEWORK_ICONS[framework]

  return (
    <div className="h-full flex flex-col p-4">
      <DashedBox className="overflow-hidden flex-1 min-h-0 flex flex-col">
        {/* Top accent glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-[radial-gradient(ellipse_at_center,rgba(52,211,153,0.5)_0%,transparent_70%)]" />

        {/* Header with framework selector */}
        <div className="flex items-center gap-2 px-4 h-10 border-b border-border shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" aria-hidden="true" />
          <span className="text-[10px] font-mono text-foreground/50 tracking-widest uppercase">
            Code
          </span>
          <div className="ml-auto flex items-center gap-1.5">
            <CopyPromptButton generatedCode={generatedCode} themeCode={themeCode} framework={framework} />
            <Select value={framework} onValueChange={(v) => onFrameworkChange(v as FrameworkId)}>
              <SelectTrigger
                aria-label="Select framework"
                className="h-7 w-auto gap-1.5 rounded-lg px-2.5 py-0 text-xs shadow-none [&>svg]:h-3 [&>svg]:w-3"
              >
                <SelectValue>
                  <span className="flex items-center gap-1.5">
                    <CurrentIcon className="h-3.5 w-3.5" />
                    <span>{currentFw?.label}</span>
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent align="end">
                {FRAMEWORK_OPTIONS.map((fw) => {
                  const Icon = FRAMEWORK_ICONS[fw.id]
                  return (
                    <SelectItem key={fw.id} value={fw.id}>
                      <Icon className="h-3.5 w-3.5" />
                      {fw.label}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Code output */}
        <div className="flex-1 min-h-0 overflow-auto" tabIndex={-1}>
          {/* Component code */}
          <div className="border-b border-border">
            <div className="flex items-center gap-2 px-4 h-8">
              <span className="text-[10px] font-mono text-foreground/50">MyAgent.tsx</span>
              <div className="ml-auto">
                <CopyButton text={generatedCode} />
              </div>
            </div>
            <div className="px-4 pb-3">
              <HighlightedCode code={generatedCode} />
            </div>
          </div>

          {/* Theme / styles */}
          <div>
            <div className="flex items-center gap-2 px-4 h-8">
              <span className="text-[10px] font-mono text-foreground/50">theme.json</span>
              <div className="ml-auto">
                <CopyButton text={themeCode} />
              </div>
            </div>
            <div className="px-4 pb-4">
              <HighlightedCode code={themeCode} lang="json" />
            </div>
          </div>
        </div>

      </DashedBox>
    </div>
  )
}
