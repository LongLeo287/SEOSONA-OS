"use client"

import { useEffect, useMemo, useCallback, useState } from "react"
import { useAgentsRouter } from "@/hooks/use-agents-router"
import { useSearch } from "./search-context"
import { useIsMobile } from "@/hooks/use-mobile"
import type { SearchRecord } from "@/lib/agents-docs/search"
import {
  Command,
  CommandList,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"
import { Command as CommandPrimitive } from "cmdk"
import { Search, CornerDownLeft } from "lucide-react"
import { useSetAtom } from "jotai"
import { docsAgentSidebarOpenAtom } from "./docs-agent-chat"
import { ClaudeCodeIcon } from "@/components/features/agents/ui/canvas/[id]/{components}/ui/icons"

/* ── Suggested pages shown before user types ─────────────────────── */

const SUGGESTED_PAGES: { title: string; href: string; description: string }[] = [
  { title: "Introduction", href: "/agents/docs", description: "Overview of 21st Agents infrastructure" },
  { title: "What's New", href: "/agents/docs/whats-new", description: "Weekly release digests for 21st Agents" },
  { title: "Get Started", href: "/agents/docs/get-started", description: "Integrate an agent into your Next.js app" },
  { title: "Agents", href: "/agents/docs/build/agents", description: "Project setup, tools, hooks, runtime, permissions" },
  { title: "Deploy", href: "/agents/docs/deploy/deploy", description: "CLI commands, deploy pipeline, redeploying, and what lives where" },
  { title: "Core Concepts", href: "/agents/docs/core-concepts", description: "Agents, relay, projects, dialogs" },
  { title: "API Reference", href: "/agents/docs/api-reference", description: "Chat API, SSE streaming, SDK" },
]

/* ── Full-text search ────────────────────────────────────────────── */

interface SnippetMatch {
  snippet: string
  pageTitle: string
  href: string
  section: string
  score: number
}

function searchFullText(query: string, records: SearchRecord[]): SnippetMatch[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (terms.length === 0) return []

  const allMatches: SnippetMatch[] = []

  for (const record of records) {
    const contentLower = record.content.toLowerCase()

    // Check that all terms exist somewhere in this page
    const allTermsPresent = terms.every(
      (term) =>
        record.title.toLowerCase().includes(term) ||
        record.description.toLowerCase().includes(term) ||
        contentLower.includes(term),
    )
    if (!allTermsPresent) continue

    // Find all occurrences of the first term in the content and extract snippets
    const snippets = extractAllSnippets(record.content, terms)

    if (snippets.length === 0) {
      // Terms matched in title/description but not content body - show description
      allMatches.push({
        snippet: record.description,
        pageTitle: record.title,
        href: record.href,
        section: record.section,
        score: 20,
      })
    } else {
      for (const snippet of snippets) {
        // Score: title match bonus + per-snippet
        let score = 1
        for (const term of terms) {
          if (record.title.toLowerCase().includes(term)) score += 10
          if (snippet.toLowerCase().includes(term)) score += 2
        }
        allMatches.push({
          snippet,
          pageTitle: record.title,
          href: record.href,
          section: record.section,
          score,
        })
      }
    }
  }

  allMatches.sort((a, b) => b.score - a.score)
  return allMatches
}

function extractAllSnippets(content: string, terms: string[]): string[] {
  const lower = content.toLowerCase()
  const snippets: string[] = []
  const usedRanges: [number, number][] = []

  // Find all occurrences of every term
  for (const term of terms) {
    let searchFrom = 0
    while (searchFrom < lower.length) {
      const idx = lower.indexOf(term, searchFrom)
      if (idx === -1) break

      // Check this range doesn't overlap with an already-used range
      const snippetStart = Math.max(0, idx - 40)
      const snippetEnd = Math.min(content.length, idx + term.length + 80)
      const overlaps = usedRanges.some(
        ([s, e]) => snippetStart < e && snippetEnd > s,
      )

      if (!overlaps) {
        usedRanges.push([snippetStart, snippetEnd])
        let snippet = content.slice(snippetStart, snippetEnd)
        snippet = cleanMarkdown(snippet)
        if (snippetStart > 0) snippet = "..." + snippet
        if (snippetEnd < content.length) snippet = snippet + "..."
        snippets.push(snippet)
      }

      searchFrom = idx + term.length
    }
  }

  // Cap at 5 snippets per page to avoid flooding
  return snippets.slice(0, 5)
}

function cleanMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\|/g, " ")
    .replace(/\n+/g, " ")
    .trim()
}

/* ── Highlight terms in text ─────────────────────────────────────── */

function HighlightedText({
  text,
  terms,
  className,
}: {
  text: string
  terms: string[]
  className?: string
}) {
  if (terms.length === 0) return <span className={className}>{text}</span>

  // Build a regex that matches any of the terms (case-insensitive)
  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
  const regex = new RegExp(`(${escaped.join("|")})`, "gi")

  const parts = text.split(regex)

  return (
    <span className={className}>
      {parts.map((part, i) => {
        const isMatch = terms.some(
          (t) => part.toLowerCase() === t.toLowerCase(),
        )
        return isMatch ? (
          <mark
            key={i}
            className="bg-primary/15 text-foreground rounded-sm px-0.5 font-medium"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      })}
    </span>
  )
}

/* ── Shared search command content ───────────────────────────────── */

function SearchCommandContent({
  index,
  onSelect,
  onAskAI,
}: {
  index: SearchRecord[]
  onSelect: (href: string, query: string) => void
  onAskAI: (query: string) => void
}) {
  const [query, setQuery] = useState("")
  const trimmed = query.trim()
  const hasQuery = trimmed.length > 0
  const terms = useMemo(
    () => (hasQuery ? trimmed.toLowerCase().split(/\s+/).filter(Boolean) : []),
    [trimmed, hasQuery],
  )

  const results = useMemo(() => {
    if (!hasQuery) return []
    return searchFullText(trimmed, index)
  }, [trimmed, hasQuery, index])

  const handleItemSelect = useCallback(
    (href: string) => onSelect(href, query),
    [onSelect, query],
  )

  // Group results by page title
  const grouped = useMemo(() => {
    const map = new Map<string, SnippetMatch[]>()
    for (const r of results) {
      const key = r.pageTitle
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(r)
    }
    return Array.from(map.entries())
  }, [results])

  return (
    <Command className="bg-transparent" shouldFilter={false} loop>
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border">
        <Search className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
        <CommandPrimitive.Input
          placeholder="Search documentation..."
          autoFocus
          value={query}
          onValueChange={setQuery}
          className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground/40 text-sm"
        />
      </div>

      <CommandList className="max-h-[400px] p-1">
        {hasQuery ? (
          results.length === 0 ? (
            <div className="flex flex-col items-center py-8 gap-3">
              <p className="text-muted-foreground text-[13px]">
                No results found.
              </p>
              <CommandGroup>
                <CommandItem
                  value="ask-ai"
                  onSelect={() => onAskAI(query)}
                  className="cursor-pointer flex items-center gap-2 justify-center"
                >
                  <ClaudeCodeIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-[13px]">
                    Ask AI about <span className="font-medium">&ldquo;{trimmed}&rdquo;</span>
                  </span>
                </CommandItem>
              </CommandGroup>
            </div>
          ) : (
            grouped.map(([pageTitle, matches]) => (
              <CommandGroup key={pageTitle} heading={pageTitle}>
                {matches.map((match, i) => (
                  <CommandItem
                    key={`${match.href}-${i}`}
                    value={`${match.href}-${i}`}
                    onSelect={() => handleItemSelect(match.href)}
                    className="cursor-pointer flex-col items-start"
                  >
                    <HighlightedText
                      text={match.snippet}
                      terms={terms}
                      className="line-clamp-2 text-[12px] text-muted-foreground"
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            ))
          )
        ) : (
          <CommandGroup heading="Suggested">
            {SUGGESTED_PAGES.map((page) => (
              <CommandItem
                key={page.href}
                value={page.title}
                onSelect={() => handleItemSelect(page.href)}
                className="cursor-pointer"
              >
                <div className="flex flex-col min-w-0 gap-0.5">
                  <span className="font-medium text-foreground text-[13px]">
                    {page.title}
                  </span>
                  <span className="line-clamp-1 text-muted-foreground text-[12px]">
                    {page.description}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>

      {/* Footer */}
      <div className="flex items-center gap-3 border-t border-border px-4 py-2 text-[11px] text-muted-foreground/70">
        <span className="flex items-center gap-1.5">
          <kbd className="pointer-events-none inline-flex h-[18px] select-none items-center rounded border border-border/60 bg-muted/40 px-1 font-mono text-[10px] text-muted-foreground/70">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5" /><path d="M5 12l7-7 7 7" />
            </svg>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14" /><path d="M19 12l-7 7-7-7" />
            </svg>
          </kbd>
          navigate
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="pointer-events-none inline-flex h-[18px] select-none items-center rounded border border-border/60 bg-muted/40 px-1 font-mono text-[10px] text-muted-foreground/70">
            <CornerDownLeft className="h-2.5 w-2.5" />
          </kbd>
          open
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="pointer-events-none inline-flex h-[18px] select-none items-center rounded border border-border/60 bg-muted/40 px-1 font-mono text-[10px] text-muted-foreground/70">
            esc
          </kbd>
          close
        </span>
      </div>
    </Command>
  )
}

/* ── Modal ───────────────────────────────────────────────────────── */

export function SearchModal({ index }: { index: SearchRecord[] }) {
  const { open, setOpen } = useSearch()
  const isMobile = useIsMobile()
  const router = useAgentsRouter()
  const setAgentSidebarOpen = useSetAtom(docsAgentSidebarOpenAtom)

  // Global ⌘K / Ctrl+K shortcut
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen(!open)
      }
      if (e.key === "Escape" && open) {
        setOpen(false)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open, setOpen])

  const handleSelect = useCallback(
    (href: string, query: string) => {
      setOpen(false)
      const q = query.trim()
      const url = q ? `${href}?highlight=${encodeURIComponent(q)}` : href
      router.push(url)
    },
    [router, setOpen],
  )

  const handleAskAI = useCallback(
    (_query: string) => {
      setOpen(false)
      setAgentSidebarOpen(true)
    },
    [setOpen, setAgentSidebarOpen],
  )

  // Mobile: fullscreen overlay
  if (isMobile) {
    if (!open) return null
    return (
      <MobileFullscreenSearch
        index={index}
        onSelect={handleSelect}
        onClose={() => setOpen(false)}
        onAskAI={handleAskAI}
      />
    )
  }

  // Desktop: floating modal
  if (!open) return null

  return (
    <DesktopModal index={index} onSelect={handleSelect} onClose={() => setOpen(false)} onAskAI={handleAskAI} />
  )
}

/* ── Mobile fullscreen search ────────────────────────────────────── */

function MobileFullscreenSearch({
  index,
  onSelect,
  onClose,
  onAskAI,
}: {
  index: SearchRecord[]
  onSelect: (href: string, query: string) => void
  onClose: () => void
  onAskAI: (query: string) => void
}) {
  const [query, setQuery] = useState("")
  const trimmed = query.trim()
  const hasQuery = trimmed.length > 0
  const terms = useMemo(
    () => (hasQuery ? trimmed.toLowerCase().split(/\s+/).filter(Boolean) : []),
    [trimmed, hasQuery],
  )

  const results = useMemo(() => {
    if (!hasQuery) return []
    return searchFullText(trimmed, index)
  }, [trimmed, hasQuery, index])

  const handleItemSelect = useCallback(
    (href: string) => onSelect(href, query),
    [onSelect, query],
  )

  const grouped = useMemo(() => {
    const map = new Map<string, SnippetMatch[]>()
    for (const r of results) {
      const key = r.pageTitle
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(r)
    }
    return Array.from(map.entries())
  }, [results])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-background animate-in fade-in-0 duration-150">
      <Command className="flex flex-col h-full bg-transparent" shouldFilter={false} loop>
        {/* Search header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <div className="flex-1 flex items-center gap-2 rounded-full bg-muted px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
            <CommandPrimitive.Input
              placeholder="Search documentation..."
              autoFocus
              value={query}
              onValueChange={setQuery}
              className="flex-1 bg-transparent outline-none text-base placeholder:text-muted-foreground/40"
            />
          </div>
          <button
            className="text-sm font-medium text-foreground shrink-0"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>

        {/* Results */}
        <CommandList className="flex-1 !max-h-none overflow-y-auto overscroll-contain p-1">
          {hasQuery ? (
            results.length === 0 ? (
              <div className="flex flex-col items-center py-12 gap-3">
                <p className="text-muted-foreground text-sm">
                  No results found.
                </p>
                <CommandGroup>
                  <CommandItem
                    value="ask-ai"
                    onSelect={() => onAskAI(query)}
                    className="cursor-pointer flex items-center gap-2 justify-center py-3"
                  >
                    <ClaudeCodeIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-[14px]">
                      Ask AI about <span className="font-medium">&ldquo;{trimmed}&rdquo;</span>
                    </span>
                  </CommandItem>
                </CommandGroup>
              </div>
            ) : (
              grouped.map(([pageTitle, matches]) => (
                <CommandGroup key={pageTitle} heading={pageTitle}>
                  {matches.map((match, i) => (
                    <CommandItem
                      key={`${match.href}-${i}`}
                      value={`${match.href}-${i}`}
                      onSelect={() => handleItemSelect(match.href)}
                      className="cursor-pointer flex-col items-start py-3"
                    >
                      <HighlightedText
                        text={match.snippet}
                        terms={terms}
                        className="line-clamp-3 text-[13px] text-muted-foreground leading-relaxed"
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))
            )
          ) : (
            <CommandGroup heading="Suggested">
              {SUGGESTED_PAGES.map((page) => (
                <CommandItem
                  key={page.href}
                  value={page.title}
                  onSelect={() => handleItemSelect(page.href)}
                  className="cursor-pointer py-3"
                >
                  <div className="flex flex-col min-w-0 gap-1">
                    <span className="font-medium text-foreground text-[14px]">
                      {page.title}
                    </span>
                    <span className="line-clamp-1 text-muted-foreground text-[13px]">
                      {page.description}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </div>
  )
}

/* ── Desktop floating modal ──────────────────────────────────────── */

function DesktopModal({
  index,
  onSelect,
  onClose,
  onAskAI,
}: {
  index: SearchRecord[]
  onSelect: (href: string, query: string) => void
  onClose: () => void
  onAskAI: (query: string) => void
}) {
  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm animate-in fade-in-0 duration-200" />

      {/* Modal */}
      <div
        className="relative w-full max-w-[560px] overflow-hidden overscroll-contain rounded-xl border border-border shadow-lg bg-popover animate-in fade-in-0 zoom-in-[0.96] slide-in-from-top-2 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <SearchCommandContent index={index} onSelect={onSelect} onAskAI={onAskAI} />
      </div>
    </div>
  )
}
