"use client"

import { useEffect, useMemo, useCallback, useState } from "react"
import { useAgentsRouter } from "@/hooks/use-agents-router"
import { useSearch } from "./search-context"
import type { SearchRecord } from "@/lib/agents-docs/search"
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"

/* ── Suggested pages shown before user types ─────────────────────── */

const SUGGESTED_PAGES: { title: string; href: string; description: string }[] = [
  { title: "Introduction", href: "/agents/docs", description: "Overview of An and what it does" },
  { title: "Quickstart", href: "/agents/docs/getting-started/quickstart", description: "Get up and running in minutes" },
  { title: "Core concepts", href: "/agents/docs/getting-started/core-concepts", description: "Agents, skills, projects, and dialogs" },
  { title: "Models", href: "/agents/docs/agent-configuration/models", description: "Available models for each runtime" },
  { title: "Tools", href: "/agents/docs/agent-configuration/tool-definitions", description: "Built-in agent tools" },
  { title: "Chat API", href: "/agents/docs/reference/api/chat", description: "Streaming Chat API reference" },
]

/* ── Helpers ──────────────────────────────────────────────────────── */

function groupBySection(records: SearchRecord[]): [string, SearchRecord[]][] {
  const map = new Map<string, SearchRecord[]>()
  for (const r of records) {
    const key = r.section
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(r)
  }
  return Array.from(map.entries())
}

export function SearchModal({ index }: { index: SearchRecord[] }) {
  const { open, setOpen } = useSearch()
  const router = useAgentsRouter()

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
    (href: string) => {
      setOpen(false)
      router.push(href)
    },
    [router, setOpen],
  )

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
      onClick={() => setOpen(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm animate-in fade-in-0 duration-200" />

      {/* Modal */}
      <div
        className="relative w-full max-w-[560px] overflow-hidden animate-in fade-in-0 zoom-in-[0.96] slide-in-from-top-2 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <SearchContent index={index} onSelect={handleSelect} />
      </div>
    </div>
  )
}

function SearchContent({
  index,
  onSelect,
}: {
  index: SearchRecord[]
  onSelect: (href: string) => void
}) {
  const [query, setQuery] = useState("")
  const hasQuery = query.trim().length > 0

  return (
    <Command className="border border-border shadow-lg bg-popover" shouldFilter loop>
      <CommandInput placeholder="Search documentation..." autoFocus />

      <CommandList className="max-h-[400px] p-1">
        <CommandEmpty className="py-12 text-center text-[13px] text-muted-foreground">
          No results found.
        </CommandEmpty>

        {hasQuery ? (
          <SearchResults index={index} onSelect={onSelect} />
        ) : (
          <SuggestedPages onSelect={onSelect} />
        )}
      </CommandList>

      {/* Footer */}
      <div className="flex items-center gap-4 border-t border-border px-4 py-2.5 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center rounded-md border border-border bg-muted/50 px-1.5 font-sans text-[11px] text-muted-foreground">
            ↑↓
          </kbd>
          navigate
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center rounded-md border border-border bg-muted/50 px-1.5 font-sans text-[11px] text-muted-foreground">
            ↵
          </kbd>
          open
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center rounded-md border border-border bg-muted/50 px-1.5 font-sans text-[11px] text-muted-foreground">
            esc
          </kbd>
          close
        </span>
      </div>
    </Command>
  )
}

/* ── Suggested pages (initial screen) ─────────────────────────────── */

function SuggestedPages({ onSelect }: { onSelect: (href: string) => void }) {
  return (
    <CommandGroup heading="Suggested">
      {SUGGESTED_PAGES.map((page) => (
        <CommandItem
          key={page.href}
          value={page.title}
          onSelect={() => onSelect(page.href)}
          className="cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-muted-foreground">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[13px] font-medium text-foreground">
              {page.title}
            </span>
            <span className="line-clamp-1 text-[12px] text-muted-foreground">
              {page.description}
            </span>
          </div>
        </CommandItem>
      ))}
    </CommandGroup>
  )
}

/* ── Search results (filtered by query) ───────────────────────────── */

function SearchResults({
  index,
  onSelect,
}: {
  index: SearchRecord[]
  onSelect: (href: string) => void
}) {
  const grouped = useMemo(() => groupBySection(index), [index])

  return (
    <>
      {grouped.map(([section, items]) => (
        <CommandGroup
          key={section}
          heading={section}
        >
          {items.map((record) => (
            <CommandItem
              key={record.href}
              value={`${record.title} ${record.section} ${record.description} ${record.excerpt}`}
              onSelect={() => onSelect(record.href)}
              className="cursor-pointer flex-col items-start"
            >
              <span className="text-[13px] font-medium text-foreground">
                {record.title}
              </span>
              {record.description && (
                <span className="line-clamp-1 text-[12px] text-muted-foreground">
                  {record.description}
                </span>
              )}
            </CommandItem>
          ))}
        </CommandGroup>
      ))}
    </>
  )
}
