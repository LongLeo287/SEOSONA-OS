import React, { memo, useState, useEffect, useRef } from "react"
import { ChevronRight } from "lucide-react"
import { toolRegistry } from "./tool-registry"
import { GenericTool } from "./generic-tool"
import { TextShimmer } from "../components/text-shimmer"
import { getToolStatus } from "../utils/format-tool"
import { cn } from "../utils/cn"
import { useThemeConfig } from "../theme-config"
import { TOOL_ROW_STYLES } from "../types/tool-styles"

interface TaskToolProps {
  part: any
  nestedTools?: any[]
  chatStatus?: string
}

const MAX_VISIBLE_TOOLS = 5
const TOOL_HEIGHT_PX = 24

function formatElapsedTime(ms: number): string {
  if (ms < 1000) return ""
  const seconds = Math.floor(ms / 1000)
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  if (remainingSeconds === 0) return `${minutes}m`
  return `${minutes}m ${remainingSeconds}s`
}

export const TaskTool = memo(function TaskTool({ part, nestedTools = [], chatStatus }: TaskToolProps) {
  const config = useThemeConfig()
  const toolSize = config.toolCallStyle === "compact" ? "compact" : "normal"
  const s = TOOL_ROW_STYLES[toolSize]
  const { isPending, isInterrupted } = getToolStatus(part, chatStatus)
  const [isExpanded, setIsExpanded] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const wasStreamingRef = useRef(isPending)
  const description = part.input?.description || ""
  const [elapsedMs, setElapsedMs] = useState(0)
  const startedAt =
    (part.callProviderMetadata?.custom?.startedAt as number | undefined) ??
    (part.startedAt as number | undefined)
  const hasNestedTools = nestedTools.length > 0
  const outputDuration = part.output?.totalDurationMs || part.output?.duration || part.output?.duration_ms

  useEffect(() => {
    if (wasStreamingRef.current && !isPending) {
      setIsExpanded(false)
    }
    wasStreamingRef.current = isPending
  }, [isPending])

  useEffect(() => {
    if (isPending && isExpanded && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [nestedTools.length, isPending, isExpanded])

  useEffect(() => {
    if (isPending && startedAt) {
      setElapsedMs(Date.now() - startedAt)
      const interval = setInterval(() => {
        setElapsedMs(Date.now() - startedAt)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isPending, startedAt])

  const getSubtitle = () => {
    if (isPending && hasNestedTools) {
      const lastTool = nestedTools[nestedTools.length - 1]
      const meta = lastTool ? toolRegistry[lastTool.type] : null
      if (meta) {
        const title = meta.title(lastTool)
        const subtitle = meta.subtitle?.(lastTool)
        return subtitle ? `${title} ${subtitle}` : title
      }
    }

    if (description) {
      return description.length > 60 ? description.slice(0, 57) + "..." : description
    }
    return ""
  }

  const subtitle = getSubtitle()
  const elapsedTimeDisplay = formatElapsedTime(!isPending && outputDuration ? outputDuration : elapsedMs)

  if (isInterrupted && !part.output) {
    return (
      <div className={cn("an-tool-task group flex items-center rounded-md w-fit select-none", s.container)}>
        <div className={cn("flex items-center gap-1.5 min-w-0", s.text, s.textColor)}>
          <span className="font-medium whitespace-nowrap shrink-0">Subagent interrupted</span>
        </div>
      </div>
    )
  }

  return (
    <div className="an-tool-task">
      <div
        onClick={hasNestedTools ? () => setIsExpanded(!isExpanded) : undefined}
        className={cn("group flex max-w-full items-center rounded-md select-none", s.container, hasNestedTools && "cursor-pointer")}
      >
        <div className="flex-1 min-w-0 flex items-center gap-1.5">
          <div className={cn("flex max-w-full items-center gap-1.5 min-w-0", s.text, s.textColor)}>
            {isPending ? (
              <TextShimmer
                as="span"
                duration={1.2}
                className={cn(s.shimmerClass, "font-medium whitespace-nowrap shrink-0")}
              >
                Running Subagent
              </TextShimmer>
            ) : (
              <span className="font-medium whitespace-nowrap shrink-0">Completed Subagent</span>
            )}
            {subtitle && (
              <span className="min-w-0 flex-1 truncate font-normal" style={{ color: "color-mix(in srgb, var(--an-foreground-muted) 60%, transparent)" }}>
                {subtitle}
              </span>
            )}
            {elapsedTimeDisplay && (
              <span className="font-normal tabular-nums shrink-0" style={{ color: "color-mix(in srgb, var(--an-foreground-muted) 60%, transparent)" }}>
                {elapsedTimeDisplay}
              </span>
            )}
            {hasNestedTools && (
              <ChevronRight
                className={cn(
                  toolSize === "compact" ? "w-3.5 h-3.5" : "w-4 h-4",
                  "text-muted-foreground transition-transform duration-200 ease-out shrink-0",
                  isExpanded && "rotate-90",
                  !isExpanded && "opacity-0 group-hover:opacity-100",
                )}
              />
            )}
          </div>
        </div>
      </div>

      {hasNestedTools && isExpanded && (
        <div className="relative">
          {isPending && nestedTools.length > MAX_VISIBLE_TOOLS && (
            <div className="absolute inset-x-0 top-0 h-8 z-10 pointer-events-none" style={{ background: "linear-gradient(to bottom, var(--an-background), transparent)" }} />
          )}
          <div
            ref={scrollRef}
            className={cn("space-y-0", isPending && nestedTools.length > MAX_VISIBLE_TOOLS && "overflow-y-auto")}
            style={isPending && nestedTools.length > MAX_VISIBLE_TOOLS ? { maxHeight: `${MAX_VISIBLE_TOOLS * TOOL_HEIGHT_PX}px` } : undefined}
          >
            {nestedTools.map((nestedPart, idx) => {
              const nestedMeta = toolRegistry[nestedPart.type]
              if (!nestedMeta) {
                return (
                  <div key={idx} className={cn("group flex items-center rounded-md w-fit select-none", s.container)}>
                    <div className={cn("flex items-center gap-1.5 min-w-0", s.text, s.textColor)}>
                      <span className="font-medium whitespace-nowrap shrink-0">{nestedPart.type?.replace("tool-", "")}</span>
                    </div>
                  </div>
                )
              }
              const { isPending: nestedIsPending, isError: nestedIsError } = getToolStatus(nestedPart, chatStatus)
              return <GenericTool key={idx} icon={nestedMeta.icon} title={nestedMeta.title(nestedPart)} subtitle={nestedMeta.subtitle?.(nestedPart)} isPending={nestedIsPending} isError={nestedIsError} size={toolSize} />
            })}
          </div>
        </div>
      )}
    </div>
  )
})
