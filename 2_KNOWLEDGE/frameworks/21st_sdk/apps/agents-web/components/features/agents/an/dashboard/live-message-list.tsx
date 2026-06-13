"use client"

import { useState, Fragment, useMemo, useEffect } from "react"
import type { TimelineStep, StepState } from "../chat-preview/types/timeline"
import type { VisualConfig } from "../types"
import {
  UserMessage,
  StreamingMarkdown,
  SearchGroupRich,
  SearchGroupMinimal,
  ToolTimer,
} from "../chat-preview/components"
import { routeToolCall } from "../chat-preview/components/tools"
import { resolveToolSize } from "../chat-preview/components/tools/tool-router"
import { ToolRowBase } from "../chat-preview/components/tools/tool-row-base"
import { SpinnerIcon16 } from "../chat-preview/icons"
import {
  mapToolInvocationToStep,
  mapToolStateToStepState,
} from "./live-chat-adapters"

const TEXT_SIZES = { sm: "13px", md: "14px", lg: "15px" } as const
const PLANNING_LABELS = ["Brewing...", "Crafting...", "Working...", "Preparing..."]
const noop = () => {}

function isV5ToolPart(part: any): boolean {
  const partType = part?.type
  if (partType === "tool-invocation") return false
  return partType === "dynamic-tool" || (typeof partType === "string" && partType.startsWith("tool-"))
}

function v5PartToInvocation(part: any): {
  toolCallId: string
  toolName: string
  args: Record<string, any>
  state: "partial-call" | "call" | "result"
  result?: any
} {
  const toolName = typeof part.type === "string" && part.type.startsWith("tool-")
    ? part.type.slice(5)
    : part.toolName ?? part.type
  const args = typeof part.input === "object" && part.input ? part.input : {}
  let state: "partial-call" | "call" | "result"
  if (part.state === "output-available" || part.state === "output-error") {
    state = "result"
  } else if (part.state === "input-streaming") {
    state = "partial-call"
  } else {
    state = "call"
  }
  return {
    toolCallId: part.toolCallId || "",
    toolName,
    args,
    state,
    result: part.output,
  }
}

/* ── Copy button (same as in AssistantStream) ── */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="flex items-center h-6 px-0.5 mt-1">
      <button
        type="button"
        tabIndex={-1}
        onClick={handleCopy}
        className="p-1.5 rounded-md transition-[background-color,transform] duration-150 ease-out hover:bg-accent active:scale-[0.97]"
      >
        <div className="relative w-3.5 h-3.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className={`absolute inset-0 w-3.5 h-3.5 text-muted-foreground transition-[opacity,transform] duration-200 ease-out ${copied ? "opacity-0 scale-50" : "opacity-100 scale-100"}`}
          >
            <g transform="scale(1.15) translate(-1.8, -1.8)">
              <path
                d="M15 9V5.25C15 4.00736 13.9926 3 12.75 3H5.25C4.00736 3 3 4.00736 3 5.25V12.75C3 13.9926 4.00736 15 5.25 15H9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.75 9H11.25C10.0074 9 9 10.0074 9 11.25V18.75C9 19.9926 10.0074 21 11.25 21H18.75C19.9926 21 21 19.9926 21 18.75V11.25C21 10.0074 19.9926 9 18.75 9Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            className={`absolute inset-0 w-3.5 h-3.5 text-muted-foreground transition-[opacity,transform] duration-200 ease-out ${copied ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
          >
            <path
              d="M5 12.75L10 19L19 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>
    </div>
  )
}

/* ── Density spacing ── */

function densityClass(density: string): string {
  switch (density) {
    case "dense":
      return "space-y-0"
    case "compact":
      return "space-y-1"
    case "relaxed":
    default:
      return "space-y-3"
  }
}

/* ── Search grouping check ── */

function isSearchTool(toolName: string): boolean {
  const lower = toolName.toLowerCase()
  const baseName = lower.includes("__") ? lower.split("__").pop()! : lower
  return (
    baseName === "websearch" ||
    baseName === "web_search" ||
    baseName === "exa_search" ||
    baseName === "grep" ||
    baseName === "glob" ||
    baseName === "webfetch" ||
    baseName === "web_fetch" ||
    baseName.endsWith("_search")
  )
}

/* ── Main component ── */

interface AiMessage {
  id: string
  role: "user" | "assistant" | string
  parts?: any[]
}

export function LiveMessageList({
  messages,
  status,
  vc,
}: {
  messages: AiMessage[]
  status: string
  vc: VisualConfig
}) {
  const textSize = TEXT_SIZES[vc.textSizeScale]
  const isStreaming = status === "streaming" || status === "submitted"
  const toolSize = resolveToolSize(vc)
  const isSticky =
    vc.stickyUserMessages && vc.messageBubbleStyle === "full-width"

  // Check if the last assistant message has meaningful content
  const lastAssistantMsg = [...messages].reverse().find((m) => m.role === "assistant")
  const lastAssistantHasContent =
    lastAssistantMsg &&
    (lastAssistantMsg.parts ?? []).some(
      (p: any) =>
        (p.type === "text" && p.text?.trim()) ||
        p.type === "tool-invocation" ||
        isV5ToolPart(p),
    )
  const showPlanning = isStreaming && !lastAssistantHasContent

  // Rotate planning label every 4s while waiting
  const [planningLabel, setPlanningLabel] = useState(
    () => PLANNING_LABELS[Math.floor(Math.random() * PLANNING_LABELS.length)]!,
  )
  useEffect(() => {
    if (!showPlanning) return
    // Pick a fresh label when planning starts
    setPlanningLabel(
      PLANNING_LABELS[Math.floor(Math.random() * PLANNING_LABELS.length)]!,
    )
    const id = setInterval(() => {
      setPlanningLabel((prev) => {
        let next: string
        do {
          next = PLANNING_LABELS[Math.floor(Math.random() * PLANNING_LABELS.length)]!
        } while (next === prev && PLANNING_LABELS.length > 1)
        return next
      })
    }, 4000)
    return () => clearInterval(id)
  }, [showPlanning])

  return (
    <div className={`pb-4 ${densityClass(vc.messageDensity)}`}>
        {messages.map((msg, msgIndex) => {
          const isLast = msgIndex === messages.length - 1

          if (msg.role === "user") {
            const text = (msg.parts ?? [])
              .filter((p: any) => p.type === "text")
              .map((p: any) => p.text)
              .join("")
            if (!text) return null

            const userStep = {
              id: msg.id,
              type: "user-message" as const,
              content: text,
            }

            return (
              <div
                key={msg.id}
                className={isSticky ? "sticky top-0 z-10 pb-3" : undefined}
              >
                <UserMessage step={userStep} onComplete={noop} vc={vc} />
              </div>
            )
          }

          if (msg.role === "assistant") {
            return (
              <AssistantParts
                key={msg.id}
                msg={msg}
                isLast={isLast}
                isStreaming={isStreaming}
                textSize={textSize}
                toolSize={toolSize}
                vc={vc}
              />
            )
          }

          return null
        })}

        {/* Planning placeholder — shown when streaming but last assistant has no content yet */}
        {showPlanning && (
          <ToolRowBase
            size={toolSize}
            icon={
              vc.showToolIcons ? (
                <SpinnerIcon16 className="w-full h-full shrink-0 animate-spin text-muted-foreground" />
              ) : undefined
            }
            shimmerLabel={planningLabel}
            completeLabel="Done"
            isAnimating={true}
          />
        )}
      </div>
  )
}

/* ── Assistant message renderer with search grouping ── */

function AssistantParts({
  msg,
  isLast,
  isStreaming,
  textSize,
  toolSize,
  vc,
}: {
  msg: AiMessage
  isLast: boolean
  isStreaming: boolean
  textSize: string
  toolSize: "normal" | "compact"
  vc: VisualConfig
}) {
  const parts = msg.parts ?? []

  // Pre-compute tool steps and states for search grouping
  const { elements } = useMemo(() => {
    const elems: React.ReactNode[] = []
    let actionIndex = 0
    let i = 0

    while (i < parts.length) {
      const part = parts[i]!

      // Text part → StreamingMarkdown
      if (part.type === "text") {
        const text = part.text as string
        if (text) {
          const isCurrentlyStreaming = isLast && isStreaming
          elems.push(
            <div
              key={`${msg.id}-text-${i}`}
              className="px-0.5 py-1"
              style={{ fontSize: textSize }}
            >
              <StreamingMarkdown
                content={text}
                className={`leading-relaxed [&_p]:leading-relaxed ${
                  vc.textContrast === "high"
                    ? "text-foreground/90"
                    : "text-foreground/60"
                }`}
              />
              {vc.showCopyButton && !isCurrentlyStreaming && text.trim() && (
                <CopyButton text={text} />
              )}
            </div>,
          )
        }
        i++
        continue
      }

      // V5 tool part (tool-Bash, tool-Read, tool-Edit, etc.)
      if (isV5ToolPart(part)) {
        const inv = v5PartToInvocation(part)
        const step = mapToolInvocationToStep(
          inv.toolCallId || `${msg.id}-tool-${i}`,
          inv,
        )
        const state = !isStreaming ? "complete" : mapToolStateToStepState(inv.state)

        if (step.toolVariant === "search") {
          if (vc.searchDisplay === "hidden") {
            elems.push(
              <ToolTimer key={step.id} step={step} state={state} onComplete={noop} />,
            )
            i++
            continue
          }

          const searchGroup: Extract<TimelineStep, { type: "tool-call" }>[] = [step]
          const searchStates: Record<string, StepState> = { [step.id]: state }

          let j = i + 1
          while (j < parts.length) {
            const nextPart = parts[j]
            if (!isV5ToolPart(nextPart)) break
            const nextInv = v5PartToInvocation(nextPart)
            if (!isSearchTool(nextInv.toolName)) break
            const nextStep = mapToolInvocationToStep(
              nextInv.toolCallId || `${msg.id}-tool-${j}`,
              nextInv,
            )
            const nextState = !isStreaming ? "complete" : mapToolStateToStepState(nextInv.state)
            searchGroup.push(nextStep)
            searchStates[nextStep.id] = nextState
            j++
          }

          if (vc.searchDisplay === "rich-group") {
            elems.push(
              <SearchGroupRich
                key={`search-${msg.id}-${step.id}`}
                toolSteps={searchGroup}
                stepStates={searchStates}
                onStepComplete={noop}
                showIcon={vc.showToolIcons}
                size={toolSize}
                useMockFallback={false}
              />,
            )
          } else {
            elems.push(
              <SearchGroupMinimal
                key={`search-${msg.id}-${step.id}`}
                toolSteps={searchGroup}
                stepStates={searchStates}
                onStepComplete={noop}
                showIcon={vc.showToolIcons}
                size={toolSize}
              />,
            )
          }

          i = j
          continue
        }

        const currentActionIndex = actionIndex++
        elems.push(
          <Fragment key={step.id}>
            {routeToolCall(step, state, noop, vc, currentActionIndex)}
          </Fragment>,
        )
        i++
        continue
      }

      // Tool invocation part (AI SDK v4 format)
      if (part.type === "tool-invocation") {
        const inv = part.toolInvocation
        if (!inv) {
          i++
          continue
        }

        const step = mapToolInvocationToStep(
          inv.toolCallId || `${msg.id}-tool-${i}`,
          inv,
        )
        const state = !isStreaming ? "complete" : mapToolStateToStepState(inv.state)

        // Search grouping — gather consecutive search tools
        if (step.toolVariant === "search") {
          if (vc.searchDisplay === "hidden") {
            elems.push(
              <ToolTimer
                key={step.id}
                step={step}
                state={state}
                onComplete={noop}
              />,
            )
            i++
            continue
          }

          const searchGroup: Extract<
            TimelineStep,
            { type: "tool-call" }
          >[] = [step]
          const searchStates: Record<string, StepState> = {
            [step.id]: state,
          }

          // Look ahead for consecutive search tools
          let j = i + 1
          while (j < parts.length) {
            const nextPart = parts[j]
            if (nextPart?.type !== "tool-invocation") break
            const nextInv = nextPart.toolInvocation
            if (!nextInv || !isSearchTool(nextInv.toolName)) break

            const nextStep = mapToolInvocationToStep(
              nextInv.toolCallId || `${msg.id}-tool-${j}`,
              nextInv,
            )
            const nextState = !isStreaming ? "complete" : mapToolStateToStepState(nextInv.state)
            searchGroup.push(nextStep)
            searchStates[nextStep.id] = nextState
            j++
          }

          if (vc.searchDisplay === "rich-group") {
            elems.push(
              <SearchGroupRich
                key={`search-${msg.id}-${step.id}`}
                toolSteps={searchGroup}
                stepStates={searchStates}
                onStepComplete={noop}
                showIcon={vc.showToolIcons}
                size={toolSize}
                useMockFallback={false}
              />,
            )
          } else {
            elems.push(
              <SearchGroupMinimal
                key={`search-${msg.id}-${step.id}`}
                toolSteps={searchGroup}
                stepStates={searchStates}
                onStepComplete={noop}
                showIcon={vc.showToolIcons}
                size={toolSize}
              />,
            )
          }

          i = j
          continue
        }

        // Non-search tool → routeToolCall
        const currentActionIndex = actionIndex++
        elems.push(
          <Fragment key={step.id}>
            {routeToolCall(step, state, noop, vc, currentActionIndex)}
          </Fragment>,
        )
        i++
        continue
      }

      i++
    }

    return { elements: elems }
  }, [parts, msg.id, isLast, isStreaming, textSize, vc, toolSize])

  return <>{elements}</>
}
