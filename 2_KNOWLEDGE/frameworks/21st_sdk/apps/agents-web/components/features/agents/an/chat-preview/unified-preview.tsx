"use client"

import { useCallback, useRef, useMemo, useEffect } from "react"
import type { TimelineStep } from "./types/timeline"
import type { StepState } from "./types/timeline"
import type { VisualConfig } from "../types"
import { chatTimeline } from "./data/timelines"
import {
  useAnimationTimeline,
  useContainerHeight,
  groupIntoTurns,
} from "./hooks"
import {
  UserMessage,
  AssistantStream,
  DateDivider,
  ToolTimer,
  SearchGroupRich,
  SearchGroupMinimal,
  routeToolCall,
  UnifiedInputBar,
} from "./components"
import { resolveToolSize } from "./components/tools/tool-router"
import { loadGoogleFont } from "./utils/load-google-font"

/* ══════════════════════════════════════════════════════════
   Main export — UnifiedChatPreview
   ══════════════════════════════════════════════════════════ */

export function UnifiedChatPreview({
  paused,
  timeline,
  visualConfig,
  previewConfig,
  replayRef,
  onComplete: onCompleteProp,
}: {
  paused?: boolean
  timeline?: TimelineStep[]
  visualConfig: VisualConfig
  previewConfig?: {
    attachmentsEnabled?: boolean
    allowedModels?: { id: string; name: string; version?: string }[]
    activeModelId?: string
    availableModes?: string[]
    defaultMode?: string
  }
  replayRef?: React.MutableRefObject<(() => void) | null>
  onComplete?: () => void
}) {
  const vc = visualConfig
  const effectiveTimeline = timeline ?? chatTimeline
  const { visibleSteps, stepStates, isComplete, replay, onStepComplete, activeInputStep } = useAnimationTimeline(effectiveTimeline, { paused })

  const scrollElRef = useRef<HTMLDivElement | null>(null)
  const userScrolledUp = useRef(false)

  // Expose replay to parent, reset auto-scroll on replay
  if (replayRef) replayRef.current = () => { userScrolledUp.current = false; replay() }

  // Notify parent when animation completes
  useEffect(() => {
    if (isComplete && onCompleteProp) {
      onCompleteProp()
    }
  }, [isComplete, onCompleteProp])
  const setContainerHeight = useContainerHeight()

  const scrollRefCallback = useCallback((el: HTMLDivElement | null) => {
    scrollElRef.current = el
    setContainerHeight(el)
  }, [setContainerHeight])

  const isNearBottom = useCallback(() => {
    const el = scrollElRef.current
    if (!el) return true
    return el.scrollHeight - el.scrollTop - el.clientHeight < 40
  }, [])

  const scrollToBottom = useCallback(() => {
    if (userScrolledUp.current) return
    if (scrollElRef.current) {
      scrollElRef.current.scrollTo({ top: scrollElRef.current.scrollHeight, behavior: "smooth" })
    }
  }, [])

  const handleScroll = useCallback(() => {
    userScrolledUp.current = !isNearBottom()
  }, [isNearBottom])

  useEffect(() => {
    scrollToBottom()
  }, [visibleSteps.length, scrollToBottom])

  useEffect(() => {
    loadGoogleFont(vc.fontFamily)
  }, [vc.fontFamily])

  const turns = useMemo(() => groupIntoTurns(visibleSteps), [visibleSteps])

  const maxWidth = "420px"

  /* ── Render tools within a turn (handles search grouping) ── */
  const toolSize = resolveToolSize(vc)

  const renderTurnTools = useCallback((turn: ReturnType<typeof groupIntoTurns>[0], turnIndex: number) => {
    const elements: React.ReactNode[] = []
    let actionIndex = 0
    let i = 0
    const steps = turn.steps

    while (i < steps.length) {
      const step = steps[i]!
      if (step.type !== "tool-call") { i++; continue }

      const tc = step as Extract<TimelineStep, { type: "tool-call" }>

      // Search grouping
      if (tc.toolVariant === "search") {
        if (vc.searchDisplay === "hidden") {
          elements.push(<ToolTimer key={tc.id} step={tc} state={stepStates[tc.id]!} onComplete={() => onStepComplete(tc.id)} />)
          i++
          continue
        }

        // Gather consecutive search steps
        const searchGroup: Extract<TimelineStep, { type: "tool-call" }>[] = []
        while (i < steps.length) {
          const s = steps[i]!
          if (s.type === "tool-call" && (s as Extract<TimelineStep, { type: "tool-call" }>).toolVariant === "search") {
            searchGroup.push(s as Extract<TimelineStep, { type: "tool-call" }>)
            i++
          } else {
            break
          }
        }

        if (vc.searchDisplay === "rich-group") {
          elements.push(
            <SearchGroupRich
              key={`search-${turnIndex}-${searchGroup[0]!.id}`}
              toolSteps={searchGroup}
              stepStates={stepStates}
              onStepComplete={onStepComplete}
              showIcon={vc.showToolIcons}
              size={toolSize}
            />
          )
        } else {
          elements.push(
            <SearchGroupMinimal
              key={`search-${turnIndex}-${searchGroup[0]!.id}`}
              toolSteps={searchGroup}
              stepStates={stepStates}
              onStepComplete={onStepComplete}
              showIcon={vc.showToolIcons}
              size={toolSize}
            />
          )
        }
      } else {
        const el = routeToolCall(tc, stepStates[tc.id]!, () => onStepComplete(tc.id), vc, actionIndex)
        elements.push(el)
        if (tc.toolVariant === "action" || !tc.toolVariant) actionIndex++
        i++
      }
    }

    return elements
  }, [stepStates, onStepComplete, vc, toolSize])

  return (
    <div className="flex flex-col h-full relative" style={{ fontFamily: vc.fontFamily }}>
      {/* Messages area */}
      <div ref={scrollRefCallback} onScroll={handleScroll} className="flex-1 overflow-y-auto">
        <div className="mx-auto px-4 py-2" style={{ maxWidth: maxWidth ?? "420px" }}>
          {/* Date divider */}
          {vc.showDateDivider && <DateDivider />}

          <div className={`pb-4 ${
            vc.messageDensity === "relaxed" ? "space-y-3" :
            vc.messageDensity === "dense" ? "space-y-0" :
            "space-y-1"
          }`}>
            {turns.map((turn, turnIndex) => {
              const isLastTurn = turnIndex === turns.length - 1
              const toolElements = renderTurnTools(turn, turnIndex)

              return (
                <div
                  key={turn.userStep?.id ?? `turn-${turnIndex}`}
                  className="relative"
                  style={isLastTurn ? { minHeight: "calc(var(--chat-container-height, 0px) - 32px)" } : undefined}
                >
                  {/* User messages */}
                  {turn.steps
                    .filter((s): s is Extract<TimelineStep, { type: "user-message" }> => s.type === "user-message")
                    .map((step) => {
                      const isSticky = vc.stickyUserMessages && vc.messageBubbleStyle === "full-width"

                      return (
                        <div key={step.id} className={isSticky ? "sticky top-0 z-10 pb-3" : undefined}>
                          <UserMessage
                            step={step}
                            onComplete={() => onStepComplete(step.id)}
                            vc={vc}
                          />
                        </div>
                      )
                    })}

                  {/* Tool groups */}
                  {toolElements}

                  {/* Assistant stream */}
                  {turn.steps
                    .filter((s): s is Extract<TimelineStep, { type: "assistant-stream" }> => s.type === "assistant-stream")
                    .map((step) => (
                      <AssistantStream
                        key={step.id}
                        step={step}
                        onComplete={() => onStepComplete(step.id)}
                        onUpdate={scrollToBottom}
                        vc={vc}
                      />
                    ))}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Input bar */}
      <UnifiedInputBar
        activeInputStep={activeInputStep}
        onStepComplete={onStepComplete}
        isStreaming={!isComplete && !activeInputStep && visibleSteps.length > 0}
        vc={vc}
        previewConfig={previewConfig}
      />
    </div>
  )
}
