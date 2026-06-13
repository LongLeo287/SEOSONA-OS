import React, { memo, useRef, useEffect, useLayoutEffect, useCallback, useState, useMemo, Fragment } from "react"
import type { UIMessage, ChatStatus } from "ai"
import { cn } from "../utils/cn"
import { useThemeConfig } from "../theme-config"
import { UserMessage } from "./user-message"
import { StreamingMarkdown } from "./streaming-markdown"
import { DateDivider } from "./date-divider"
import type { CustomToolRendererProps } from "../types"
import type { TimelineStep, StepState } from "../types/timeline"
import { mapToolInvocationToStep, mapToolStateToStepState } from "../utils/tool-adapters"
import { resolveToolSize, routeToolCall } from "../tools/tool-router"
import { SearchGroupRich, SearchGroupMinimal } from "../tools/search-tool"
import { ToolTimer } from "../tools/tool-timer"
import { ToolRowBase } from "../tools/tool-row-base"
import { SpinnerIcon16 } from "../icons/tool-icons"
import { ToolRenderer as DefaultToolRenderer } from "../tools/tool-renderer"
import { normalizeAssistantToolParts } from "../utils/tool-part-normalizer"

interface MessageListProps {
  messages: UIMessage[]
  status: ChatStatus
  className?: string
  slots?: {
    UserMessage?: React.ComponentType<any>
    ToolRenderer?: React.ComponentType<any>
    MessageActions?: React.ComponentType<any>
    EmptyState?: React.ComponentType
  }
  classNames?: {
    userMessage?: string
    assistantMessage?: string
  }
  toolRenderers?: Record<string, React.ComponentType<CustomToolRendererProps>>
}

const SCROLL_THRESHOLD = 80
const SCROLL_DURATION = 300
const PLANNING_LABELS = ["Brewing...", "Crafting...", "Working...", "Preparing..."]
const noop = () => {}

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

function densityClass(density: string): string {
  switch (density) {
    case "dense": return "space-y-0"
    case "compact": return "space-y-1"
    case "relaxed":
    default: return "space-y-3"
  }
}

function isSearchTool(toolName: string): boolean {
  const lower = toolName.toLowerCase()
  return lower === "websearch" || lower === "web_search" || lower === "grep" || lower === "glob" || lower === "webfetch" || lower === "web_fetch"
}

function isV5ToolPart(part: any): boolean {
  const partType = part?.type
  return partType === "dynamic-tool" || (typeof partType === "string" && partType.startsWith("tool-"))
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const [hovered, setHovered] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div className="flex items-center h-6 px-0.5 mt-1">
      <button type="button" tabIndex={-1} onClick={handleCopy}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="p-1.5 rounded-md active:scale-[0.97]"
        style={{
          opacity: hovered ? 1 : 0.5,
          background: hovered ? "color-mix(in srgb, var(--an-foreground) 8%, transparent)" : "transparent",
          transition: "background-color 150ms ease-out, opacity 150ms ease-out, transform 150ms ease-out",
        }}>
        <div className="relative w-3.5 h-3.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            className={`absolute inset-0 w-3.5 h-3.5 transition-[opacity,transform] duration-200 ease-out ${copied ? "opacity-0 scale-50" : "opacity-100 scale-100"}`}
            style={{ color: "var(--an-foreground-muted)" }}>
            <g transform="scale(1.15) translate(-1.8, -1.8)">
              <path d="M15 9V5.25C15 4.00736 13.9926 3 12.75 3H5.25C4.00736 3 3 4.00736 3 5.25V12.75C3 13.9926 4.00736 15 5.25 15H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M18.75 9H11.25C10.0074 9 9 10.0074 9 11.25V18.75C9 19.9926 10.0074 21 11.25 21H18.75C19.9926 21 21 19.9926 21 18.75V11.25C21 10.0074 19.9926 9 18.75 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            className={`absolute inset-0 w-3.5 h-3.5 transition-[opacity,transform] duration-200 ease-out ${copied ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
            style={{ color: "var(--an-foreground-muted)" }}>
            <path d="M5 12.75L10 19L19 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>
    </div>
  )
}

/** Group flat messages into turns (user message + following assistant messages) */
function groupMessagesIntoTurns(messages: UIMessage[]) {
  const turns: { userMsg?: UIMessage; assistantMsgs: UIMessage[] }[] = []
  let current: { userMsg?: UIMessage; assistantMsgs: UIMessage[] } | null = null

  for (const msg of messages) {
    if (msg.role === "user") {
      if (current) turns.push(current)
      current = { userMsg: msg, assistantMsgs: [] }
    } else if (msg.role === "assistant") {
      if (!current) current = { assistantMsgs: [] }
      current.assistantMsgs.push(msg)
    }
  }
  if (current) turns.push(current)
  return turns
}

export const MessageList = memo(function MessageList({
  messages,
  status,
  className,
  slots,
  classNames,
  toolRenderers,
}: MessageListProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const contentWrapperRef = useRef<HTMLDivElement>(null)
  const chatContainerObserverRef = useRef<ResizeObserver | null>(null)

  // Ref-based scroll state (no re-renders)
  const shouldAutoScrollRef = useRef(true)
  const isAutoScrollingRef = useRef(false)
  const prevScrollTopRef = useRef(0)

  const config = useThemeConfig()
  const CustomUserMessage = slots?.UserMessage || UserMessage
  const CustomToolRenderer = slots?.ToolRenderer || DefaultToolRenderer

  const isStreaming = status === "streaming" || status === "submitted"
  const toolSize = resolveToolSize(config)
  const isSticky = config.stickyUserMessages && config.messageStyle === "full-width"

  const lastAssistantMsg = [...messages].reverse().find((m) => m.role === "assistant")
  const lastAssistantHasContent = lastAssistantMsg && (lastAssistantMsg.parts ?? []).some(
    (p: any) => (p.type === "text" && p.text?.trim()) || p.type === "tool-invocation" || isV5ToolPart(p),
  )
  const showPlanning = isStreaming && !lastAssistantHasContent

  const [planningLabel, setPlanningLabel] = useState(
    () => PLANNING_LABELS[Math.floor(Math.random() * PLANNING_LABELS.length)]!,
  )
  useEffect(() => {
    if (!showPlanning) return
    setPlanningLabel(PLANNING_LABELS[Math.floor(Math.random() * PLANNING_LABELS.length)]!)
    const id = setInterval(() => {
      setPlanningLabel((prev) => {
        let next: string
        do { next = PLANNING_LABELS[Math.floor(Math.random() * PLANNING_LABELS.length)]! } while (next === prev && PLANNING_LABELS.length > 1)
        return next
      })
    }, 4000)
    return () => clearInterval(id)
  }, [showPlanning])

  // ── Container height tracking (ResizeObserver → CSS var) ──
  const containerRefCallback = useCallback((el: HTMLDivElement | null) => {
    (chatContainerRef as React.MutableRefObject<HTMLDivElement | null>).current = el

    if (chatContainerObserverRef.current) {
      chatContainerObserverRef.current.disconnect()
      chatContainerObserverRef.current = null
    }
    if (el) {
      el.style.setProperty("--chat-container-height", `${el.clientHeight}px`)
      const observer = new ResizeObserver((entries) => {
        const height = entries[0]?.contentRect.height ?? 0
        el.style.setProperty("--chat-container-height", `${height}px`)
      })
      observer.observe(el)
      chatContainerObserverRef.current = observer
    }
  }, [])

  useEffect(() => {
    return () => {
      if (chatContainerObserverRef.current) chatContainerObserverRef.current.disconnect()
    }
  }, [])

  // ── Smooth scroll to bottom (300ms ease-in-out cubic) ──
  const scrollToBottom = useCallback(() => {
    const container = chatContainerRef.current
    if (!container) return

    isAutoScrollingRef.current = true
    shouldAutoScrollRef.current = true

    const start = container.scrollTop
    const startTime = performance.now()

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / SCROLL_DURATION, 1)
      const easedProgress = easeInOutCubic(progress)

      // Recalculate end on each frame (content may still be growing)
      const end = container.scrollHeight - container.clientHeight
      container.scrollTop = start + (end - start) * easedProgress

      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      } else {
        container.scrollTop = container.scrollHeight
        isAutoScrollingRef.current = false
      }
    }

    requestAnimationFrame(animateScroll)
  }, [])

  // ── isAtBottom check ──
  const isAtBottom = useCallback(() => {
    const container = chatContainerRef.current
    if (!container) return true
    return container.scrollHeight - container.scrollTop - container.clientHeight < SCROLL_THRESHOLD
  }, [])

  // ── Scroll direction detection (user scroll up → stop, down to bottom → resume) ──
  const handleScroll = useCallback(() => {
    const container = chatContainerRef.current
    if (!container) return

    const currentScrollTop = container.scrollTop
    const prevScrollTop = prevScrollTopRef.current
    prevScrollTopRef.current = currentScrollTop

    // User scrolls UP → disable auto-scroll (even during animation — user intent wins)
    if (currentScrollTop < prevScrollTop) {
      shouldAutoScrollRef.current = false
      return
    }

    // Ignore scroll events caused by our own animation
    if (isAutoScrollingRef.current) return

    // User scrolls DOWN and reaches bottom → re-enable auto-scroll
    shouldAutoScrollRef.current = isAtBottom()
  }, [isAtBottom])

  // ── Content ResizeObserver: auto-scroll as content grows during streaming ──
  useLayoutEffect(() => {
    const container = chatContainerRef.current
    const contentWrapper = contentWrapperRef.current
    if (!container || !contentWrapper) return

    // Initialize scroll at bottom
    container.scrollTop = container.scrollHeight
    shouldAutoScrollRef.current = true

    let lastContentHeight = contentWrapper.getBoundingClientRect().height
    let prevScrollHeight = container.scrollHeight

    const resizeObserver = new ResizeObserver(() => {
      const newContentHeight = contentWrapper.getBoundingClientRect().height
      if (newContentHeight === lastContentHeight) return
      lastContentHeight = newContentHeight

      if (shouldAutoScrollRef.current) {
        // Auto-scroll to bottom as content grows (immediate, not animated)
        requestAnimationFrame(() => {
          isAutoScrollingRef.current = true
          container.scrollTop = container.scrollHeight
          requestAnimationFrame(() => {
            isAutoScrollingRef.current = false
          })
        })
      } else {
        // User is scrolled up — maintain their relative position
        const newScrollHeight = container.scrollHeight
        if (newScrollHeight !== prevScrollHeight && prevScrollHeight > 0) {
          const delta = newScrollHeight - prevScrollHeight
          container.scrollTop = container.scrollTop + delta
        }
      }
      prevScrollHeight = container.scrollHeight
    })

    resizeObserver.observe(contentWrapper)
    return () => resizeObserver.disconnect()
  }, []) // runs once on mount

  // ── Smooth scroll on new messages (user sends a message) ──
  const prevMessageCountRef = useRef(messages.length)
  useEffect(() => {
    if (messages.length > prevMessageCountRef.current && shouldAutoScrollRef.current) {
      scrollToBottom()
    }
    prevMessageCountRef.current = messages.length
  }, [messages.length, scrollToBottom])

  // ── Auto-scroll during streaming (immediate, not animated) ──
  useEffect(() => {
    if (shouldAutoScrollRef.current && status === "streaming") {
      const container = chatContainerRef.current
      if (container) {
        requestAnimationFrame(() => {
          isAutoScrollingRef.current = true
          container.scrollTop = container.scrollHeight
          requestAnimationFrame(() => {
            isAutoScrollingRef.current = false
          })
        })
      }
    }
  }, [messages, status])

  const turns = useMemo(() => groupMessagesIntoTurns(messages), [messages])

  return (
    <div
      ref={containerRefCallback}
      onScroll={handleScroll}
      className={cn("an-message-list flex-1 min-h-0 overflow-y-auto", className)}
    >
      <div
        ref={contentWrapperRef}
        className="mx-auto px-4 py-6"
        style={{ maxWidth: "var(--an-max-width, 420px)" }}
      >
        {messages.length === 0 && slots?.EmptyState && (
          <div className="flex flex-1 items-center justify-center" style={{ minHeight: "calc(var(--chat-container-height, 400px) - 100px)" }}>
            <slots.EmptyState />
          </div>
        )}

        {config.showDateDivider && messages.length > 0 && <DateDivider />}

        <div className={densityClass(config.messageDensity)}>
          {turns.map((turn, turnIndex) => {
            const isLastTurn = turnIndex === turns.length - 1
            const turnKey = turn.userMsg?.id ?? `turn-${turnIndex}`

            return (
              <div
                key={turnKey}
                className="relative"
                style={{
                  // Last turn fills remaining viewport so user message starts at top
                  ...(isLastTurn && { minHeight: "calc(var(--chat-container-height, 0px) - 32px)" }),
                  // Non-last turns: content-visibility for perf (skip layout for off-screen)
                  ...(!isLastTurn && {
                    contentVisibility: "auto" as any,
                    containIntrinsicSize: "auto 200px",
                  }),
                }}
              >
                {turn.userMsg && (() => {
                  const text = (turn.userMsg!.parts ?? []).filter((p: any) => p.type === "text").map((p: any) => p.text).join("")
                  const hasImages = (turn.userMsg!.parts ?? []).some((p: any) =>
                    p.type === "data-image" || p.type === "image" ||
                    (p.type === "file" && p.mimeType?.startsWith("image/"))
                  )
                  if (!text && !hasImages) return null
                  return (
                    <div className={isSticky ? "sticky top-0 z-10 pb-3" : undefined}>
                      <CustomUserMessage message={turn.userMsg} className={classNames?.userMessage} />
                    </div>
                  )
                })()}

                {turn.assistantMsgs.map((msg, i) => {
                  const isLastMsg = isLastTurn && i === turn.assistantMsgs.length - 1
                  return (
                    <AssistantParts
                      key={msg.id}
                      msg={msg}
                      isLast={isLastMsg}
                      isStreaming={isStreaming}
                      config={config}
                      toolSize={toolSize}
                      ToolRendererComponent={CustomToolRenderer}
                      toolRenderers={toolRenderers}
                    />
                  )
                })}

                {/* Planning label inside last turn so it appears right below user message */}
                {isLastTurn && showPlanning && (
                  <ToolRowBase
                    size={toolSize}
                    icon={config.showToolIcons ? <SpinnerIcon16 className="w-full h-full shrink-0 animate-spin text-muted-foreground" /> : undefined}
                    shimmerLabel={planningLabel}
                    completeLabel="Done"
                    isAnimating={true}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
})

function AssistantParts({
  msg,
  isLast,
  isStreaming,
  config,
  toolSize,
  ToolRendererComponent,
  toolRenderers,
}: {
  msg: any
  isLast: boolean
  isStreaming: boolean
  config: ReturnType<typeof useThemeConfig>
  toolSize: "normal" | "compact"
  ToolRendererComponent: React.ComponentType<any>
  toolRenderers?: Record<string, React.ComponentType<CustomToolRendererProps>>
}) {
  const parts = useMemo(() => normalizeAssistantToolParts(msg.parts ?? []) as any[], [msg.parts])

  const { elements } = useMemo(() => {
    const elems: React.ReactNode[] = []
    const taskPartIds = new Set(
      parts
        .filter((p: any) => (p.type === "tool-Task" || p.type === "tool-Agent") && p.toolCallId)
        .map((p: any) => p.toolCallId),
    )
    const nestedToolsMap = new Map<string, any[]>()
    const nestedToolIds = new Set<string>()

    for (const part of parts) {
      if (part?.type === "tool-TaskOutput") continue
      if (!part?.toolCallId || !part.toolCallId.includes(":")) continue
      const parentId = part.toolCallId.split(":")[0]
      if (!taskPartIds.has(parentId)) continue
      if (!nestedToolsMap.has(parentId)) {
        nestedToolsMap.set(parentId, [])
      }
      nestedToolsMap.get(parentId)!.push(part)
      nestedToolIds.add(part.toolCallId)
    }

    let actionIndex = 0
    let i = 0

    while (i < parts.length) {
      const part = parts[i]!

      if (part.type === "tool-TaskOutput") {
        i++
        continue
      }

      if (part.type === "text") {
        const text = part.text as string
        if (text) {
          const isCurrentlyStreaming = isLast && isStreaming
          elems.push(
            <div key={`${msg.id}-text-${i}`} className="px-0.5 py-1" style={{ fontSize: "var(--an-text-size, 14px)" }}>
              <StreamingMarkdown
                content={text}
                className="leading-relaxed [&_p]:leading-relaxed"
              />
              {config.showCopyButton && !isCurrentlyStreaming && text.trim() && <CopyButton text={text} />}
            </div>,
          )
        }
        i++
        continue
      }

      if (isV5ToolPart(part)) {
        if (part.toolCallId && nestedToolIds.has(part.toolCallId)) {
          i++
          continue
        }

        const chatStreamingStatus = isLast && isStreaming ? "streaming" : undefined
        const nestedTools =
          part.type === "tool-Task" || part.type === "tool-Agent"
            ? nestedToolsMap.get(part.toolCallId) || []
            : undefined
        elems.push(
          <ToolRendererComponent
            key={part.toolCallId ?? `${msg.id}-tool-${i}`}
            part={part}
            nestedTools={nestedTools}
            chatStatus={chatStreamingStatus}
            toolRenderers={toolRenderers}
          />,
        )
        i++
        continue
      }

      if (part.type === "tool-invocation") {
        const inv = part.toolInvocation
        if (!inv) { i++; continue }

        const step = mapToolInvocationToStep(inv.toolCallId || `${msg.id}-tool-${i}`, inv)
        const state = mapToolStateToStepState(inv.state)

        if (step.toolVariant === "search") {
          if (config.searchDisplay === "hidden") {
            elems.push(<ToolTimer key={step.id} step={step} state={state} onComplete={noop} />)
            i++
            continue
          }

          const searchGroup: Extract<TimelineStep, { type: "tool-call" }>[] = [step]
          const searchStates: Record<string, StepState> = { [step.id]: state }

          let j = i + 1
          while (j < parts.length) {
            const nextPart = parts[j]
            if (nextPart?.type !== "tool-invocation") break
            const nextInv = nextPart.toolInvocation
            if (!nextInv || !isSearchTool(nextInv.toolName)) break
            const nextStep = mapToolInvocationToStep(nextInv.toolCallId || `${msg.id}-tool-${j}`, nextInv)
            const nextState = mapToolStateToStepState(nextInv.state)
            searchGroup.push(nextStep)
            searchStates[nextStep.id] = nextState
            j++
          }

          if (config.searchDisplay === "rich-group") {
            elems.push(<SearchGroupRich key={`search-${msg.id}-${step.id}`} toolSteps={searchGroup} stepStates={searchStates} onStepComplete={noop} showIcon={config.showToolIcons} size={toolSize} />)
          } else {
            elems.push(<SearchGroupMinimal key={`search-${msg.id}-${step.id}`} toolSteps={searchGroup} stepStates={searchStates} onStepComplete={noop} showIcon={config.showToolIcons} size={toolSize} />)
          }

          i = j
          continue
        }

        const currentActionIndex = actionIndex++
        elems.push(
          <Fragment key={step.id}>
            {routeToolCall(step, state, noop, config, currentActionIndex)}
          </Fragment>,
        )
        i++
        continue
      }

      i++
    }

    return { elements: elems }
  }, [parts, msg.id, isLast, isStreaming, config, toolSize, ToolRendererComponent, toolRenderers])

  return <>{elements}</>
}
