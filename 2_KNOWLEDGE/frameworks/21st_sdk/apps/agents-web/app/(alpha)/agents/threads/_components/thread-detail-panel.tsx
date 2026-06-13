"use client"

import { X } from "lucide-react"
import type { VisualConfig } from "@/components/features/agents/an/types"
import { AnLogoSpinner } from "@/components/features/agents/an/dashboard/an-logo-spinner"
import { SidebarThreadView } from "./sidebar-thread-view"

export function ThreadDetailPanel({
  thread,
  sandboxClientId,
  sandboxId,
  vc,
  onClose,
  onFilterBySandbox,
}: {
  thread: any | null
  sandboxClientId: string | null
  sandboxId: string | null
  vc: VisualConfig
  onClose: () => void
  onFilterBySandbox?: (sandboxId: string) => void
}) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex h-10 flex-shrink-0 items-center gap-2 border-b-[0.5px] border-border px-4">
        <span className="text-xs font-medium text-foreground">Thread</span>

        {sandboxClientId && sandboxId && (
          <button
            type="button"
            onClick={() => onFilterBySandbox?.(sandboxId)}
            className="rounded-md border-[0.5px] border-border px-1.5 py-0.5 font-mono text-[10px] text-foreground/40 transition-colors hover:border-foreground/20 hover:text-foreground/60"
            title="Filter by this sandbox"
          >
            {sandboxClientId.length > 16
              ? `${sandboxClientId.slice(0, 8)}...${sandboxClientId.slice(-4)}`
              : sandboxClientId}
          </button>
        )}

        <button
          type="button"
          onClick={onClose}
          className="ml-auto flex h-6 w-6 items-center justify-center rounded-md text-foreground/60 transition-colors hover:bg-foreground/10 hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      {thread ? (
        <SidebarThreadView thread={thread} threadIndex={0} vc={vc} />
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <AnLogoSpinner />
        </div>
      )}
    </div>
  )
}
