"use client"

import { useState, useRef, useMemo, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "motion/react"
import { ArrowLeft, ChevronUp, ChevronDown } from "lucide-react"
import { useHotkeys } from "react-hotkeys-hook"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/features/agents/ui/1code/{components}/ui/tooltip"
import { Kbd } from "@/components/features/agents/ui/canvas/[id]/{components}/ui/kbd"
import type { VisualConfig } from "@/components/features/agents/an/types"
import { AnLogoSpinner } from "@/components/features/agents/an/dashboard/an-logo-spinner"
import { SidebarThreadView } from "./sidebar-thread-view"
import { SidebarSandboxOverview } from "./sidebar-sandbox-overview"
import {
  type ThreadStatusType,
  THREAD_STATUS_STYLES,
  SANDBOX_STATUS_STYLES,
  type SandboxStatusType,
} from "./logs-constants"

function IconDoubleChevronRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      width="20"
      height="20"
      {...props}
    >
      <path d="m5.492 4.158 5.4 5.4a.625.625 0 0 1 0 .884l-5.4 5.4a.625.625 0 1 1-.884-.884L9.566 10 4.608 5.042a.625.625 0 1 1 .884-.884" />
      <path d="m16.392 10.442-5.4 5.4a.625.625 0 0 1-.884-.884L15.066 10l-4.958-4.958a.625.625 0 0 1 .884-.884l5.4 5.4a.625.625 0 0 1 0 .884" />
    </svg>
  )
}

const BTN =
  "an-focus-btn flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-foreground transition-[background-color,transform] duration-150 ease-out hover:bg-foreground/10 active:scale-[0.97]"

export type SidebarMode =
  | { type: "thread" }
  | { type: "sandbox" }

export function LogsSidebar({
  isOpen,
  mode,
  thread,
  sandbox,
  sandboxClientId,
  sandboxId,
  vc,
  onClose,
  threadIds,
  selectedThreadId,
  onSelectThread,
  onFilterBySandbox,
}: {
  isOpen: boolean
  mode: SidebarMode
  thread: any | null
  sandbox: any | null
  sandboxClientId: string | null
  sandboxId: string | null
  vc: VisualConfig
  onClose: () => void
  threadIds: string[]
  selectedThreadId: string | null
  onSelectThread: (id: string) => void
  onFilterBySandbox?: (sandboxId: string) => void
}) {
  // When in sandbox mode, allow drilling into a thread
  const [drillThreadId, setDrillThreadId] = useState<string | null>(null)
  const directionRef = useRef(1)

  // Find the drilled thread from sandbox data
  const drilledThread = useMemo(() => {
    if (!drillThreadId || !sandbox?.threads) return null
    return sandbox.threads.find((t: any) => t.id === drillThreadId) ?? null
  }, [drillThreadId, sandbox?.threads])

  const drilledThreadIndex = useMemo(() => {
    if (!drillThreadId || !sandbox?.threads) return 0
    const idx = sandbox.threads.findIndex((t: any) => t.id === drillThreadId)
    return idx >= 0 ? idx : 0
  }, [drillThreadId, sandbox?.threads])

  const handleDrillThread = useCallback((threadId: string) => {
    directionRef.current = 1
    setDrillThreadId(threadId)
  }, [])

  const handleBackToSandbox = useCallback(() => {
    directionRef.current = -1
    setDrillThreadId(null)
  }, [])

  // Reset drill state when sandbox changes or mode changes
  const prevSandboxId = useRef<string | null>(null)
  if (sandboxId !== prevSandboxId.current) {
    prevSandboxId.current = sandboxId
    if (drillThreadId) setDrillThreadId(null)
  }
  if (mode.type === "thread" && drillThreadId) {
    setDrillThreadId(null)
  }

  // ─── Thread navigation (only in thread mode) ───
  const currentIndex = useMemo(
    () => (selectedThreadId ? threadIds.indexOf(selectedThreadId) : -1),
    [selectedThreadId, threadIds],
  )

  const canGoPrev = mode.type === "thread" && currentIndex > 0
  const canGoNext = mode.type === "thread" && currentIndex >= 0 && currentIndex < threadIds.length - 1

  const goToPrev = useCallback(() => {
    if (canGoPrev) {
      onSelectThread(threadIds[currentIndex - 1]!)
    }
  }, [canGoPrev, currentIndex, threadIds, onSelectThread])

  const goToNext = useCallback(() => {
    if (canGoNext) {
      onSelectThread(threadIds[currentIndex + 1]!)
    }
  }, [canGoNext, currentIndex, threadIds, onSelectThread])

  useHotkeys(
    "up, k",
    (e) => {
      e.preventDefault()
      goToPrev()
    },
    { enabled: isOpen && mode.type === "thread", enableOnFormTags: false },
    [goToPrev, isOpen, mode.type],
  )

  useHotkeys(
    "down, j",
    (e) => {
      e.preventDefault()
      goToNext()
    },
    { enabled: isOpen && mode.type === "thread", enableOnFormTags: false },
    [goToNext, isOpen, mode.type],
  )

  // Determine what to show
  const isSandboxMode = mode.type === "sandbox"
  const showingDrilledThread = isSandboxMode && drillThreadId !== null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 420, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{
            duration: 0.25,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="flex h-full flex-shrink-0 flex-col overflow-hidden border-l-[0.5px] border-border/50"
        >
          <div className="flex h-full w-[420px] flex-col">
            {/* Header */}
            <div className="flex h-9 flex-shrink-0 items-center gap-2 border-b-[0.5px] border-border/50 px-2">
              {showingDrilledThread ? (
                <>
                  <button
                    type="button"
                    onClick={handleBackToSandbox}
                    className={BTN}
                    aria-label="Back to sandbox"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <span className="text-xs font-medium text-foreground">
                    Thread {drilledThreadIndex + 1}
                  </span>
                  {drilledThread && (
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-md text-[10px]",
                        THREAD_STATUS_STYLES[
                          drilledThread.status as ThreadStatusType
                        ] ?? THREAD_STATUS_STYLES.completed,
                      )}
                    >
                      {drilledThread.status}
                    </Badge>
                  )}
                </>
              ) : isSandboxMode ? (
                <>
                  <button
                    type="button"
                    onClick={onClose}
                    className={BTN}
                    aria-label="Close details"
                  >
                    <IconDoubleChevronRight className="h-4 w-4" />
                  </button>
                  <span className="text-xs font-medium text-foreground">
                    Sandbox
                  </span>
                  {sandbox && (
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-md text-[10px]",
                        SANDBOX_STATUS_STYLES[
                          sandbox.status as SandboxStatusType
                        ] ?? SANDBOX_STATUS_STYLES.active,
                      )}
                    >
                      {sandbox.status}
                    </Badge>
                  )}
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={onClose}
                    className={BTN}
                    aria-label="Close details"
                  >
                    <IconDoubleChevronRight className="h-4 w-4" />
                  </button>
                  <span className="text-xs font-medium text-foreground">
                    Thread
                  </span>
                  {thread && (
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-md text-[10px]",
                        THREAD_STATUS_STYLES[
                          thread.status as ThreadStatusType
                        ] ?? THREAD_STATUS_STYLES.completed,
                      )}
                    >
                      {thread.status}
                    </Badge>
                  )}

                  {/* Sandbox context link */}
                  {sandboxClientId && sandboxId && (
                    <button
                      type="button"
                      onClick={() => onFilterBySandbox?.(sandboxId)}
                      className="an-focus-btn ml-1 rounded-md border border-border/50 px-1.5 py-0.5 font-mono text-[10px] text-foreground/40 transition-colors hover:border-foreground/20 hover:text-foreground/60"
                      title="Filter by this sandbox"
                    >
                      {sandboxClientId.length > 16
                        ? `${sandboxClientId.slice(0, 8)}...${sandboxClientId.slice(-4)}`
                        : sandboxClientId}
                    </button>
                  )}
                </>
              )}

              {/* Navigation arrows (thread mode only) */}
              {mode.type === "thread" && threadIds.length > 1 && (
                <div className="ml-auto flex items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        disabled={!canGoPrev}
                        onClick={goToPrev}
                        className={cn(
                          BTN,
                          !canGoPrev && "pointer-events-none opacity-30",
                        )}
                        aria-label="Previous thread"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      Previous
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Kbd>↑</Kbd>
                        <span className="text-popover-foreground">or</span>
                        <Kbd>K</Kbd>
                      </span>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        disabled={!canGoNext}
                        onClick={goToNext}
                        className={cn(
                          BTN,
                          !canGoNext && "pointer-events-none opacity-30",
                        )}
                        aria-label="Next thread"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      Next
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Kbd>↓</Kbd>
                        <span className="text-popover-foreground">or</span>
                        <Kbd>J</Kbd>
                      </span>
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
              {isSandboxMode ? (
                sandbox ? (
                  <AnimatePresence mode="wait" initial={false}>
                    {showingDrilledThread && drilledThread ? (
                      <motion.div
                        key="drilled-thread"
                        initial={{ x: directionRef.current * 40, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 40, opacity: 0 }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                        className="flex flex-1 flex-col overflow-hidden"
                      >
                        <SidebarThreadView
                          thread={drilledThread}
                          threadIndex={drilledThreadIndex}
                          vc={vc}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="sandbox-overview"
                        initial={{ x: directionRef.current * -40, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -40, opacity: 0 }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                        className="flex flex-1 flex-col overflow-y-auto"
                      >
                        <SidebarSandboxOverview
                          sandbox={sandbox}
                          onSelectThread={handleDrillThread}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                ) : (
                  <div className="flex h-32 items-center justify-center">
                    <AnLogoSpinner />
                  </div>
                )
              ) : thread ? (
                <SidebarThreadView
                  thread={thread}
                  threadIndex={currentIndex}
                  vc={vc}
                />
              ) : (
                <div className="flex h-32 items-center justify-center">
                  <AnLogoSpinner />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
