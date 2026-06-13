"use client"

import React, { useMemo, useState } from "react"
import { useAtom, useAtomValue } from "jotai"
import {
  ArrowLeft,
  Search,
  X,
  ChevronRight,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { api } from "@/trpc/client"
import { selectedTeamIdAtom } from "@/lib/atoms/team"
import { anSelectedAgentAtom } from "@/lib/atoms/an-agent"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  type ThreadStatusType,
  logsStatusFilterAtom,
  logsDateRangeAtom,
  logsSearchQueryAtom,
  logsAgentFilterAtom,
  logsSandboxFilterAtom,
  logsGroupBySandboxAtom,
  getDateFromPreset,
} from "./logs-constants"
import { LogsDateRangePicker } from "./logs-date-range-picker"

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`
  return String(n)
}

function AgentFilterSection({
  teamId,
  agentFilter,
  onAgentFilterChange,
}: {
  teamId: string | null
  agentFilter: string[]
  onAgentFilterChange: (val: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [hasOpened, setHasOpened] = useState(false)

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (isOpen && !hasOpened) setHasOpened(true)
  }

  const { data: agentCounts, isLoading } =
    api.agentConfigs.getThreadCountsByAgent.useQuery(
      { teamId: teamId! },
      { enabled: !!teamId && hasOpened },
    )

  const filtered = useMemo(() => {
    if (!agentCounts) return []
    let result = agentCounts
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((a) => a.name.toLowerCase().includes(q))
    }
    return [...result].sort((a, b) => {
      if (a.threadCount > 0 && b.threadCount === 0) return -1
      if (a.threadCount === 0 && b.threadCount > 0) return 1
      return b.threadCount - a.threadCount
    })
  }, [agentCounts, search])

  const toggle = (id: string) => {
    onAgentFilterChange(
      agentFilter.includes(id)
        ? agentFilter.filter((a) => a !== id)
        : [...agentFilter, id],
    )
  }

  const showSearch = (agentCounts?.length ?? 0) > 5

  return (
    <Collapsible open={open} onOpenChange={handleOpenChange}>
      <CollapsibleTrigger className="an-focus-btn flex w-full items-center gap-2 rounded-md px-2 py-2 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors">
        <span>Agent</span>
        {agentFilter.length > 0 && (
          <span className="ml-auto text-[10px] tabular-nums text-foreground/50">
            {agentFilter.length}
          </span>
        )}
        <ChevronRight
          className={cn(
            "h-3 w-3 transition-transform duration-200",
            agentFilter.length === 0 && "ml-auto",
            open && "rotate-90",
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-1 pb-1">
          {/* Search agents (only if >5) */}
          {showSearch && (
            <div className="relative mb-1.5">
              <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Agents…"
                className="an-focus-input h-7 w-full rounded-md border border-border bg-foreground/[0.05] pl-7 pr-7 text-[12px] text-foreground/70 placeholder:text-foreground/40 hover:border-foreground/15 transition-colors"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="an-focus-btn absolute right-2 top-1/2 -translate-y-1/2 rounded-sm text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          )}

          {/* Skeleton loader */}
          {isLoading && (
            <div className="flex flex-col gap-1">
              {[75, 60, 85, 70, 65, 80].map((w, i) => (
                <div key={i} className="flex items-center gap-2.5 px-2.5 py-1.5">
                  <div className="h-4 w-4 shrink-0 rounded border border-border bg-foreground/[0.05] animate-pulse" />
                  <div className="h-3 rounded bg-foreground/[0.08] animate-pulse" style={{ width: `${w}%` }} />
                  <div className="ml-auto h-3 w-6 rounded bg-foreground/[0.06] animate-pulse" />
                </div>
              ))}
            </div>
          )}

          {/* Agent list */}
          {!isLoading && (
            <div className="flex flex-col gap-0.5 max-h-[300px] overflow-y-auto py-1">
              {filtered.map((agent) => {
                const checked = agentFilter.includes(agent.id)
                return (
                  <label
                    key={agent.id}
                    className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[12px] hover:bg-foreground/5 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-[hsl(var(--ring)/0.24)]"
                  >
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                        checked
                          ? "border-foreground bg-foreground text-background"
                          : "border-border bg-foreground/[0.05]",
                      )}
                    >
                      {checked && <Check className="h-3 w-3" strokeWidth={2.5} />}
                    </span>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() => toggle(agent.id)}
                    />
                    <span
                      className={cn(
                        "truncate",
                        checked ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {agent.name}
                    </span>
                    <span className="ml-auto shrink-0 text-[11px] tabular-nums text-muted-foreground">
                      {formatCount(agent.threadCount)}
                    </span>
                  </label>
                )
              })}
              {filtered.length === 0 && agentCounts && agentCounts.length > 0 && (
                <p className="px-2.5 py-2 text-center text-[11px] text-muted-foreground">
                  No agents match &ldquo;{search}&rdquo;
                </p>
              )}
              {agentCounts && agentCounts.length === 0 && (
                <p className="px-2.5 py-2 text-center text-[11px] text-muted-foreground">
                  No agents found
                </p>
              )}
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function SandboxFilterSection({
  teamId,
  agentId,
  sandboxFilter,
  onSandboxFilterChange,
}: {
  teamId: string | null
  agentId: string | undefined
  sandboxFilter: string[]
  onSandboxFilterChange: (val: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [hasOpened, setHasOpened] = useState(false)

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (isOpen && !hasOpened) setHasOpened(true)
  }

  const { data: sandboxesData, isLoading } =
    api.agentConfigs.listSandboxes.useQuery(
      { teamId: teamId!, agentId, limit: 50 },
      { enabled: !!teamId && hasOpened },
    )

  const sandboxes = sandboxesData?.sandboxes

  const filtered = useMemo(() => {
    if (!sandboxes) return []
    let result = sandboxes
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((sb) => {
        const label = sb.client_sandbox_id || sb.sandbox_id || sb.id
        return label.toLowerCase().includes(q)
      })
    }
    return [...result].sort((a, b) => {
      const countA = a.threads?.length ?? 0
      const countB = b.threads?.length ?? 0
      if (countA > 0 && countB === 0) return -1
      if (countA === 0 && countB > 0) return 1
      return 0
    })
  }, [sandboxes, search])

  const toggle = (id: string) => {
    onSandboxFilterChange(
      sandboxFilter.includes(id)
        ? sandboxFilter.filter((s) => s !== id)
        : [...sandboxFilter, id],
    )
  }

  return (
    <Collapsible open={open} onOpenChange={handleOpenChange}>
      <CollapsibleTrigger className="an-focus-btn flex w-full items-center gap-2 rounded-md px-2 py-2 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors">
        <span>Sandbox</span>
        {sandboxFilter.length > 0 && (
          <span className="ml-auto text-[10px] tabular-nums text-foreground/50">
            {sandboxFilter.length}
          </span>
        )}
        <ChevronRight
          className={cn(
            "h-3 w-3 transition-transform duration-200",
            sandboxFilter.length === 0 && "ml-auto",
            open && "rotate-90",
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-1 pb-1">
          {/* Search sandboxes */}
          <div className="relative mb-1.5">
            <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Sandboxes…"
              className="an-focus-input h-7 w-full rounded-md border border-border bg-foreground/[0.05] pl-7 pr-7 text-[12px] text-foreground/70 placeholder:text-foreground/40 hover:border-foreground/15 transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="an-focus-btn absolute right-2 top-1/2 -translate-y-1/2 rounded-sm text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Skeleton loader */}
          {isLoading && (
            <div className="flex flex-col gap-1">
              {[75, 60, 85, 70, 65, 80].map((w, i) => (
                <div key={i} className="flex items-center gap-2.5 px-2.5 py-1.5">
                  <div className="h-4 w-4 shrink-0 rounded border border-border bg-foreground/[0.05] animate-pulse" />
                  <div className="h-3 rounded bg-foreground/[0.08] animate-pulse" style={{ width: `${w}%` }} />
                  <div className="ml-auto h-3 w-6 rounded bg-foreground/[0.06] animate-pulse" />
                </div>
              ))}
            </div>
          )}

          {/* Sandbox list */}
          {!isLoading && (
            <div className="flex flex-col gap-0.5 max-h-[300px] overflow-y-auto py-1">
              {filtered.map((sb) => {
                const label = sb.client_sandbox_id || sb.sandbox_id || sb.id
                const checked = sandboxFilter.includes(sb.id)
                const count = sb.threads?.length ?? 0
                return (
                  <label
                    key={sb.id}
                    className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[12px] hover:bg-foreground/5 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-[hsl(var(--ring)/0.24)]"
                  >
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                        checked
                          ? "border-foreground bg-foreground text-background"
                          : "border-border bg-foreground/[0.05]",
                      )}
                    >
                      {checked && <Check className="h-3 w-3" strokeWidth={2.5} />}
                    </span>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() => toggle(sb.id)}
                    />
                    <span
                      className={cn(
                        "truncate font-mono",
                        checked ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {label.length > 20 ? label.slice(0, 20) + "…" : label}
                    </span>
                    {count > 0 && (
                      <span className="ml-auto shrink-0 text-[11px] tabular-nums text-muted-foreground">
                        {formatCount(count)}
                      </span>
                    )}
                  </label>
                )
              })}
              {filtered.length === 0 && sandboxes && sandboxes.length > 0 && (
                <p className="px-2.5 py-2 text-center text-[11px] text-muted-foreground">
                  No sandboxes match &ldquo;{search}&rdquo;
                </p>
              )}
              {sandboxes && sandboxes.length === 0 && (
                <p className="px-2.5 py-2 text-center text-[11px] text-muted-foreground">
                  No sandboxes found
                </p>
              )}
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

const STATUS_OPTIONS: { label: string; value: ThreadStatusType }[] = [
  { label: "Streaming", value: "streaming" },
  { label: "Completed", value: "completed" },
  { label: "Error", value: "error" },
  { label: "Cancelled", value: "cancelled" },
]

interface LogsFilterSidebarProps {
  onBack: () => void
}

function FilterSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="an-focus-btn flex w-full items-center gap-2 rounded-md px-2 py-2 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors">
        <span>{title}</span>
        <ChevronRight
          className={cn(
            "ml-auto h-3 w-3 transition-transform duration-200",
            open && "rotate-90",
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-1 pb-1">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export function LogsFilterSidebar({ onBack }: LogsFilterSidebarProps) {
  const teamId = useAtomValue(selectedTeamIdAtom)
  const selectedAgent = useAtomValue(anSelectedAgentAtom)
  const [searchQuery, setSearchQuery] = useAtom(logsSearchQueryAtom)
  const [dateRange, setDateRange] = useAtom(logsDateRangeAtom)
  const [statusFilter, setStatusFilter] = useAtom(logsStatusFilterAtom)
  const [agentFilter, setAgentFilter] = useAtom(logsAgentFilterAtom)
  const [sandboxFilter, setSandboxFilter] = useAtom(logsSandboxFilterAtom)
  const [groupBySandbox, setGroupBySandbox] = useAtom(logsGroupBySandboxAtom)

  const effectiveAgentId = agentFilter.length === 1 ? agentFilter[0] : agentFilter.length === 0 ? selectedAgent?.id : undefined

  const { data: statusCounts } = api.agentConfigs.getThreadStatusCounts.useQuery(
    {
      teamId: teamId!,
      agentId: effectiveAgentId,
      sandboxId: sandboxFilter.length === 1 ? sandboxFilter[0] : undefined,
      search: searchQuery || undefined,
      createdAfter: getDateFromPreset(dateRange.preset, dateRange.from),
      createdBefore:
        dateRange.preset === "custom" && dateRange.to
          ? dateRange.to.toISOString()
          : undefined,
    },
    { enabled: !!teamId },
  )

  return (
    <div className="flex h-full flex-col">
      {/* Back button */}
      <div className="px-2 pt-2 pb-1">
        <button
          type="button"
          onClick={onBack}
          className="an-focus-btn relative flex w-full items-center px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 absolute left-2" />
          <span className="flex-1 text-center font-medium">Threads</span>
        </button>
      </div>

      {/* Search input */}
      <div className="px-3 py-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search threads..."
            className="an-focus-input h-8 w-full rounded-md border border-border bg-foreground/[0.05] pl-8 pr-8 text-[12px] text-foreground/70 placeholder:text-foreground/40 hover:border-foreground/15 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="an-focus-btn absolute right-2 top-1/2 -translate-y-1/2 rounded-sm text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="mx-3 h-[0.5px] bg-border/50" />

      {/* Scrollable filter sections – px-1 prevents focus-ring clipping */}
      <div className="flex-1 min-h-0 overflow-y-auto py-1 px-1">
        {/* Timeline / Date Range */}
        <FilterSection title="Timeline">
          <div className="px-0.5">
            <LogsDateRangePicker
              value={dateRange}
              onChange={setDateRange}
              triggerClassName="w-full justify-start"
            />
          </div>
        </FilterSection>

        {/* Status */}
        <FilterSection title="Status">
          <div className="flex flex-col gap-0.5">
            {[...STATUS_OPTIONS]
              .sort((a, b) => {
                const countA = statusCounts?.[a.value] ?? 0
                const countB = statusCounts?.[b.value] ?? 0
                if (countA > 0 && countB === 0) return -1
                if (countA === 0 && countB > 0) return 1
                return 0
              })
              .map((option) => {
              const checked = statusFilter.includes(option.value)
              const count = statusCounts?.[option.value] ?? 0
              const disabled = count === 0 && !checked
              return (
                <label
                  key={option.value}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[12px] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-[hsl(var(--ring)/0.24)]",
                    disabled
                      ? "cursor-default opacity-40"
                      : "cursor-pointer hover:bg-foreground/5",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                      checked
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-foreground/[0.05]",
                    )}
                  >
                    {checked && <Check className="h-3 w-3" strokeWidth={2.5} />}
                  </span>
                  <input
                    type="checkbox"
                    className="sr-only"
                    disabled={disabled}
                    checked={checked}
                    onChange={() => {
                      setStatusFilter(
                        checked
                          ? statusFilter.filter((s) => s !== option.value)
                          : [...statusFilter, option.value],
                      )
                    }}
                  />
                  <span className={cn(
                    checked ? "text-foreground" : "text-muted-foreground",
                  )}>
                    {option.label}
                  </span>
                  <span className="ml-auto text-[11px] tabular-nums text-muted-foreground">
                    {formatCount(count)}
                  </span>
                </label>
              )
            })}
          </div>
        </FilterSection>

        {/* Agent */}
        <AgentFilterSection
          teamId={teamId}
          agentFilter={agentFilter}
          onAgentFilterChange={setAgentFilter}
        />

        {/* Sandbox */}
        <SandboxFilterSection
          teamId={teamId}
          agentId={effectiveAgentId}
          sandboxFilter={sandboxFilter}
          onSandboxFilterChange={setSandboxFilter}
        />

        {/* Group by */}
        <FilterSection title="Group by">
          <div className="flex flex-col gap-px">
            <button
              type="button"
              onClick={() => setGroupBySandbox(false)}
              className={cn(
                "an-focus-btn flex items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[12px] transition-colors",
                !groupBySandbox
                  ? "bg-foreground/10 text-foreground font-medium"
                  : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
              )}
            >
              {!groupBySandbox && <Check className="h-3 w-3" />}
              <span className={cn(groupBySandbox && "pl-5")}>None</span>
            </button>
            <button
              type="button"
              onClick={() => setGroupBySandbox(true)}
              className={cn(
                "an-focus-btn flex items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[12px] transition-colors",
                groupBySandbox
                  ? "bg-foreground/10 text-foreground font-medium"
                  : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
              )}
            >
              {groupBySandbox && <Check className="h-3 w-3" />}
              <span className={cn(!groupBySandbox && "pl-5")}>Sandbox</span>
            </button>
          </div>
        </FilterSection>
      </div>
    </div>
  )
}
