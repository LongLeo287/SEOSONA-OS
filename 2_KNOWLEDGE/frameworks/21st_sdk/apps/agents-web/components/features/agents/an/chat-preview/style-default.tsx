"use client"

import { useEffect, useCallback, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "motion/react"
import { TextShimmer } from "@/components/ui/text-shimmer"
import type { TimelineStep, StepState, ChatPreviewConfig } from "./types"
import { chatTimeline } from "./types"
import {
  useAnimationTimeline,
  useStreamingText,
  useInputTyping,
  useToolComplete,
  useContainerHeight,
  groupIntoTurns,
} from "./hooks"
import { ImageThumb, ReplayButton, PaperclipIcon, SendButton, StreamingMarkdown } from "./shared"

/* ── Sub-components ── */

function DefaultUserMessage({
  step,
  onComplete,
}: {
  step: Extract<TimelineStep, { type: "user-message" }>
  onComplete: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      onAnimationComplete={onComplete}
      className="w-full rounded-xl border border-border bg-background px-3 py-2 shadow-xl shadow-foreground/10"
    >
      <p className="text-[13px] text-foreground/70 leading-relaxed">{step.content}</p>
    </motion.div>
  )
}

function DefaultToolCall({
  step,
  state,
  onComplete,
}: {
  step: Extract<TimelineStep, { type: "tool-call" }>
  state: StepState
  onComplete: () => void
}) {
  useToolComplete(state === "animating", step.duration, onComplete)
  const isPending = state === "animating"

  return (
    <motion.div
      initial={{ opacity: 0, y: 2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-start gap-1.5 py-1 rounded-md px-2"
    >
      <div className="flex-1 min-w-0 flex items-center gap-1.5">
        <div className="text-xs text-foreground/50 flex items-center gap-1.5 min-w-0">
          <span className="font-medium whitespace-nowrap flex-shrink-0">
            {isPending ? (
              <TextShimmer
                as="span"
                duration={1.2}
                className="inline-flex items-center text-xs leading-none h-4 m-0"
              >
                {step.toolName}
              </TextShimmer>
            ) : (
              step.toolName
            )}
          </span>
          <span className="text-foreground/25 font-normal truncate min-w-0">{step.toolDetail}</span>
        </div>
      </div>
    </motion.div>
  )
}

function DefaultAssistantStream({
  step,
  onComplete,
  onUpdate,
}: {
  step: Extract<TimelineStep, { type: "assistant-stream" }>
  onComplete: () => void
  onUpdate: () => void
}) {
  const { displayedText } = useStreamingText(step.content, {
    delayBefore: 300,
    wordInterval: 25,
    onComplete,
    onUpdate,
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <StreamingMarkdown
        content={displayedText}
        className="text-[13px] text-foreground/55 leading-relaxed"
      />
    </motion.div>
  )
}

function DefaultInputBar({
  activeInputStep,
  onStepComplete,
  isStreaming,
  previewConfig,
}: {
  activeInputStep: Extract<TimelineStep, { type: "input-typing" }> | null
  onStepComplete: (id: string) => void
  isStreaming: boolean
  previewConfig?: ChatPreviewConfig
}) {
  const { displayedText, showImage } = useInputTyping(
    activeInputStep?.content ?? "",
    activeInputStep?.duration ?? 0,
    !!activeInputStep,
    () => activeInputStep && onStepComplete(activeInputStep.id),
  )
  const hasImage = activeInputStep?.image
  const isTyping = !!activeInputStep
  const showAttach = previewConfig?.attachmentsEnabled !== false

  return (
    <div className="shrink-0 px-4 pb-4">
      <div className="rounded-xl border border-foreground/[0.07] bg-muted p-2.5">
        <AnimatePresence>
          {hasImage && showImage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
              className="mb-2"
            >
              <div className="flex flex-wrap gap-[6px]">
                <ImageThumb src={activeInputStep.image!} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2">
          {showAttach && (
            <div className="h-7 w-7 rounded-sm flex items-center justify-center hover:bg-foreground/[0.06] transition-colors cursor-pointer shrink-0">
              <PaperclipIcon />
            </div>
          )}
          <div className="flex-1 min-h-[20px] text-[12px]">
            {isTyping && displayedText ? (
              <span className="text-foreground/60">
                {displayedText}
                <motion.span
                  className="inline-block w-[1.5px] h-[1em] bg-foreground/50 ml-px align-text-bottom"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.53, repeat: Infinity }}
                />
              </span>
            ) : (
              <span className="text-foreground/15 font-mono">Ask the agent anything...</span>
            )}
          </div>
          {isStreaming ? (
            <div className="h-7 w-7 rounded-full bg-foreground/70 flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-background rounded-[2px]" />
            </div>
          ) : (
            <SendButton />
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Main ── */

export function PreviewAgentChatDefault({ paused, timeline, previewConfig }: { paused?: boolean; timeline?: TimelineStep[]; previewConfig?: ChatPreviewConfig }) {
  const { visibleSteps, stepStates, isComplete, replay, onStepComplete, activeInputStep } = useAnimationTimeline(timeline ?? chatTimeline, { paused })
  const scrollElRef = useRef<HTMLDivElement | null>(null)
  const setContainerHeight = useContainerHeight()

  const scrollRefCallback = useCallback((el: HTMLDivElement | null) => {
    scrollElRef.current = el
    setContainerHeight(el)
  }, [setContainerHeight])

  const scrollToBottom = useCallback(() => {
    if (scrollElRef.current) {
      scrollElRef.current.scrollTo({ top: scrollElRef.current.scrollHeight, behavior: "smooth" })
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [visibleSteps.length, scrollToBottom])

  const turns = useMemo(() => groupIntoTurns(visibleSteps), [visibleSteps])

  return (
    <div className="flex flex-col h-full relative">
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border shrink-0">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-foreground/[0.08]" />
          <span className="w-2.5 h-2.5 rounded-full bg-foreground/[0.08]" />
          <span className="w-2.5 h-2.5 rounded-full bg-foreground/[0.08]" />
        </div>
        <div className="flex-1 flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/70" />
          <span className="text-[11px] font-mono text-foreground/30">
            Travel Agent · session_k8x2m
          </span>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRefCallback} className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-3 pb-4">
          {turns.map((turn, turnIndex) => {
            const isLastTurn = turnIndex === turns.length - 1
            return (
              <div
                key={turn.userStep?.id ?? `turn-${turnIndex}`}
                className="relative"
                style={isLastTurn ? { minHeight: "calc(var(--chat-container-height, 0px) - 32px)" } : undefined}
              >
                {turn.steps.map((step) => {
                  const state = stepStates[step.id]!
                  if (step.type === "user-message") {
                    const umStep = step as Extract<TimelineStep, { type: "user-message" }>
                    return (
                      <div key={step.id}>
                        {umStep.image && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.15 }}
                            className="mb-2 flex flex-wrap gap-1.5"
                          >
                            <ImageThumb src={umStep.image} />
                          </motion.div>
                        )}
                        <div className="sticky top-0 z-10 pb-3">
                          <DefaultUserMessage
                            step={umStep}
                            onComplete={() => onStepComplete(step.id)}
                          />
                        </div>
                      </div>
                    )
                  }
                  if (step.type === "tool-call") {
                    return (
                      <DefaultToolCall
                        key={step.id}
                        step={step}
                        state={state}
                        onComplete={() => onStepComplete(step.id)}
                      />
                    )
                  }
                  if (step.type === "assistant-stream") {
                    return (
                      <DefaultAssistantStream
                        key={step.id}
                        step={step}
                        onComplete={() => onStepComplete(step.id)}
                        onUpdate={scrollToBottom}
                      />
                    )
                  }
                  return null
                })}
              </div>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {isComplete && <ReplayButton onClick={replay} />}
      </AnimatePresence>

      <DefaultInputBar
        activeInputStep={activeInputStep}
        onStepComplete={onStepComplete}
        isStreaming={!isComplete && !activeInputStep && visibleSteps.length > 0}
        previewConfig={previewConfig}
      />
    </div>
  )
}
