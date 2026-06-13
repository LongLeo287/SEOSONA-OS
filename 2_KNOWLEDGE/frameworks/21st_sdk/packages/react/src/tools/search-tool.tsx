import React, { memo, useState, useMemo } from "react"
import type { TimelineStep, StepState } from "../types/timeline"
import type { ToolSize } from "../types/tool-styles"
import type { SourceType } from "../icons/source-icons"
import { SearchIcon } from "../icons/tool-icons"
import { SourceIcon } from "../icons/source-icons"
import { SEARCH_RESULT_SETS } from "../data/search-results"
import { ToolTimer } from "./tool-timer"
import { ToolRowBase } from "./tool-row-base"
import { useThemeConfig } from "../theme-config"
import { mapToolInvocationToStep, mapToolStateToStepState } from "../utils/tool-adapters"

function inferSourceFromUrl(url: string): SourceType {
  try {
    const hostname = new URL(url).hostname.replace("www.", "")
    if (hostname.includes("github.com")) return "github"
    if (hostname.includes("stackoverflow.com")) return "stackoverflow"
    if (hostname.includes("arxiv.org")) return "arxiv"
    if (hostname.includes("scholar.google")) return "scholar"
    if (hostname.includes("booking.com")) return "booking"
    if (hostname.includes("tripadvisor.com")) return "tripadvisor"
    if (hostname.includes("airbnb.com")) return "airbnb"
    if (hostname.includes("expedia.com")) return "expedia"
    if (hostname.includes("stripe.com")) return "stripe"
    if (hostname.includes("google.com")) return "google"
  } catch {}
  return "web"
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "")
  } catch {
    return url
  }
}

export function SearchGroupRich({
  toolSteps,
  stepStates,
  onStepComplete,
  showIcon,
  size = "normal",
  useMockFallback = false,
}: {
  toolSteps: Extract<TimelineStep, { type: "tool-call" }>[]
  stepStates: Record<string, StepState>
  onStepComplete: (id: string) => void
  showIcon: boolean
  size?: ToolSize
  useMockFallback?: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const anyAnimating = toolSteps.some((s) => stepStates[s.id] === "animating")
  const allComplete = toolSteps.every((s) => stepStates[s.id] === "complete")

  const searchQuery = toolSteps.find((s) => s.searchQuery)?.searchQuery ?? "searching..."

  const realResults = useMemo(() => {
    for (const s of toolSteps) {
      if (s.searchResults && s.searchResults.length > 0) return s.searchResults
    }
    return null
  }, [toolSteps])

  const { displayResults, sourceTabs } = useMemo(() => {
    if (realResults) {
      const mapped = realResults.map((r) => ({
        source: r.url ? inferSourceFromUrl(r.url) : ("web" as SourceType),
        title: r.title,
        date: r.url ? extractDomain(r.url) : "",
        url: r.url,
      }))
      const tabCounts = new Map<SourceType, number>()
      for (const r of mapped) {
        tabCounts.set(r.source, (tabCounts.get(r.source) ?? 0) + 1)
      }
      const tabs = Array.from(tabCounts.entries()).map(([source, count]) => ({
        source,
        label: source.charAt(0).toUpperCase() + source.slice(1),
        count,
      }))
      return { displayResults: mapped, sourceTabs: tabs }
    }

    if (!useMockFallback) {
      return { displayResults: [], sourceTabs: [] }
    }

    const firstSource = toolSteps.find((s) => s.searchSource)?.searchSource
    if (firstSource && SEARCH_RESULT_SETS[firstSource]) {
      const set = SEARCH_RESULT_SETS[firstSource]!
      return { displayResults: set.results.map((r) => ({ ...r, url: undefined })), sourceTabs: set.tabs }
    }
    const isFirstGroup = (toolSteps[0]?.id ?? "").includes("1")
    const set = SEARCH_RESULT_SETS[isFirstGroup ? "default-1" : "default-2"]!
    return { displayResults: set.results.map((r) => ({ ...r, url: undefined })), sourceTabs: set.tabs }
  }, [toolSteps, realResults, useMockFallback])

  const totalResults = displayResults.length

  const headerSources = useMemo(() => {
    const unique = new Set<SourceType>()
    for (const r of displayResults) unique.add(r.source)
    return Array.from(unique)
  }, [displayResults])

  return (
    <>
      {toolSteps.map((s) => (
        <ToolTimer key={s.id} step={s} state={stepStates[s.id]!} onComplete={() => onStepComplete(s.id)} />
      ))}

      <ToolRowBase
        size={size}
        icon={showIcon ? <SearchIcon className="w-full h-full shrink-0 text-muted-foreground" /> : undefined}
        shimmerLabel="Searching..."
        completeLabel={`Found ${totalResults} results`}
        isAnimating={anyAnimating}
        expandable={true}
        expanded={expanded}
        onToggleExpand={() => setExpanded((v) => !v)}
        trailingContent={allComplete ? (
          <span className="flex items-center gap-0.5 shrink-0 text-muted-foreground">
            {headerSources.map((src) => (
              <SourceIcon key={src} source={src} size={14} />
            ))}
          </span>
        ) : undefined}
      >
        <div className="mt-2 rounded-[10px] overflow-hidden bg-foreground/[0.03] border border-foreground/[0.08]">
          <div className="px-3.5 pt-3 pb-1">
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-[14px] leading-5 text-foreground/40 shrink-0">Searched for</span>
              <span className="text-[14px] leading-5 text-foreground/25 truncate min-w-0">&ldquo;{searchQuery}&rdquo;</span>
            </div>
          </div>
          <div className="flex items-center gap-0.5 px-2 py-2 overflow-x-auto">
            {sourceTabs.map((tab, i) => (
              <div
                key={tab.source}
                className="inline-flex items-center gap-1 sm:gap-1.5 h-7 px-2 sm:px-3 rounded-full text-[13px] leading-5 shrink-0"
                style={{ background: i === 0 ? "rgba(128,128,128,0.1)" : "transparent" }}
              >
                <span className="text-muted-foreground"><SourceIcon source={tab.source} size={14} /></span>
                <span className={i === 0 ? "text-foreground/60" : "text-foreground/35"}>{tab.label}</span>
                <span className="text-[11px] leading-4 font-medium text-foreground/20">{tab.count}</span>
              </div>
            ))}
          </div>
          <div className="max-h-[200px] overflow-y-auto">
            <div className="flex flex-col gap-px p-1">
              {displayResults.map((result, i) => (
                <ResultRow key={i} result={result} />
              ))}
            </div>
          </div>
        </div>
      </ToolRowBase>
    </>
  )
}

function ResultRow({ result }: { result: { source: SourceType; title: string; date: string; url?: string } }) {
  const inner = (
    <div className={`flex items-center gap-2 px-2 py-1 min-h-[28px] rounded-md ${result.url ? "hover:bg-foreground/[0.04] transition-colors" : ""}`}>
      <div className="flex items-center justify-center w-5 h-5 shrink-0 text-muted-foreground">
        <SourceIcon source={result.source} size={14} />
      </div>
      <span className="text-[13px] leading-5 text-foreground/60 truncate flex-1 min-w-0">
        {result.title}
      </span>
      <span className="text-[11px] leading-4 text-foreground/20 shrink-0 whitespace-nowrap">
        {result.date}
      </span>
    </div>
  )

  if (result.url) {
    return (
      <a href={result.url} target="_blank" rel="noopener noreferrer" className="no-underline">
        {inner}
      </a>
    )
  }
  return inner
}

export function SearchGroupMinimal({
  toolSteps,
  stepStates,
  onStepComplete,
  showIcon,
  size = "compact",
}: {
  toolSteps: Extract<TimelineStep, { type: "tool-call" }>[]
  stepStates: Record<string, StepState>
  onStepComplete: (id: string) => void
  showIcon: boolean
  size?: ToolSize
}) {
  const anyAnimating = toolSteps.some((s) => stepStates[s.id] === "animating")
  const allComplete = toolSteps.every((s) => stepStates[s.id] === "complete")

  return (
    <>
      {toolSteps.map((s) => (
        <ToolTimer key={s.id} step={s} state={stepStates[s.id]!} onComplete={() => onStepComplete(s.id)} />
      ))}
      <ToolRowBase
        size={size}
        icon={showIcon ? <SearchIcon className="w-full h-full shrink-0 text-muted-foreground" /> : undefined}
        shimmerLabel="Search"
        completeLabel="Search"
        isAnimating={anyAnimating}
        detail={allComplete ? "complete" : undefined}
      />
    </>
  )
}

export const SearchTool = memo(function SearchTool({
  part,
  chatStatus,
  variant = "rich-group",
  showIcon = false,
}: {
  part: any
  chatStatus?: string
  variant?: "rich-group" | "minimal"
  showIcon?: boolean
}) {
  const step = mapToolInvocationToStep(part.toolCallId ?? part.id ?? "search", {
    toolName: part.type?.replace("tool-", "") || "WebSearch",
    args: part.input ?? part.args ?? {},
    state: part.state === "output-available" ? "result" : part.state === "input-streaming" ? "partial-call" : "call",
    result: part.output ?? part.result,
  })
  const stepState = mapToolStateToStepState(
    part.state === "output-available" ? "result" : part.state === "input-streaming" ? "partial-call" : "call"
  )
  const stepStates = { [step.id]: stepState }
  const noop = () => {}

  if (variant === "minimal") {
    return <SearchGroupMinimal toolSteps={[step]} stepStates={stepStates} onStepComplete={noop} showIcon={showIcon} />
  }
  return <SearchGroupRich toolSteps={[step]} stepStates={stepStates} onStepComplete={noop} showIcon={showIcon} />
})
