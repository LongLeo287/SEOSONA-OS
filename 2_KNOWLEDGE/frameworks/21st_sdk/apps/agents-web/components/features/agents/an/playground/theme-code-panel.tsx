"use client"

import {
  DashedBox,
} from "@/components/features/agents/landing/dashed-divider"
import { HighlightedCode, CopyButton } from "./playground-code-shared"

export function ThemeCodePanel({ themeCode }: { themeCode: string }) {
  return (
    <div className="h-full flex flex-col p-4">
      <DashedBox className="overflow-hidden flex-1 min-h-0 flex flex-col">
        {/* Top accent glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-[radial-gradient(ellipse_at_center,rgba(52,211,153,0.5)_0%,transparent_70%)]" />

        {/* Header */}
        <div className="flex items-center gap-2 px-4 h-10 border-b border-border shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" aria-hidden="true" />
          <span className="text-[10px] font-mono text-foreground/50 tracking-widest uppercase">
            Theme
          </span>
        </div>

        {/* Theme JSON output */}
        <div className="flex-1 min-h-0 overflow-auto" tabIndex={-1}>
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
      </DashedBox>
    </div>
  )
}
