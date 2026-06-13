"use client"

import "@21st-sdk/react/styles.css"

import { useEffect, useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useAtomValue } from "jotai"
import {
  ChevronRight,
  Clock,
  Loader2,
  Search,
} from "lucide-react"
import { AnAgentChat } from "@21st-sdk/react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { selectedTeamIdAtom } from "@/lib/atoms/team"
import { capture21stAgentsEvent } from "@/lib/posthog-21st-agents"
import {
  McpServerIconRow,
  toMcpServerEntries,
} from "@/components/features/agents-registry/mcp-server-chip"
import { WizardEmptyState } from "../../_components/wizard-empty-state"
import { WizardSendContext } from "../../_components/wizard-send-context"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type StudioProject = {
  id: string
  name: string
  deployed_slug: string
  created_at: string
  updated_at: string
  deployed_agent_id: string | null
  hasDeployment: boolean
}

interface QuickstartTemplate {
  id: string
  name: string
  description: string
  yaml: string
  integrations?: string[]
}

interface CommunityAgent {
  id: number
  name: string
  slug: string
  description: string | null
  yaml_config: string
  system_prompt: string | null
  model: string
  mcp_server_names: string[]
  mcp_servers?: unknown
  tool_names: string[]
  bookmarks_count: number
  icon_url: string | null
  category: string | null
  user: {
    username: string | null
    display_username: string | null
    display_name: string | null
    name: string | null
    image_url: string | null
  }
}

/* ------------------------------------------------------------------ */
/*  Built-in templates                                                 */
/* ------------------------------------------------------------------ */

const QUICKSTART_TEMPLATES: QuickstartTemplate[] = [
  {
    id: "deep-researcher",
    name: "Deep researcher",
    description:
      "Conducts multi-step web research with source synthesis and citations.",
    yaml: `name: Deep researcher
description: Conducts multi-step web research with source synthesis and citations.
model: claude-sonnet-4-6
system: |
  You are a research agent. Given a question or topic:

  1. Decompose it into 3-5 concrete sub-questions that, answered together, cover the topic.
  2. For each sub-question, run targeted web searches, and fetch the most authoritative sources (prefer primary sources, official docs, peer-reviewed work over blog posts and aggregators).
  3. Read the sources in full — don't skim. Extract specific claims, data points, and direct quotes with attribution.
  4. Synthesize a report that answers the original question. Structure it by sub-question, cite every non-obvious claim inline, and close with a "confidence & gaps" section noting where sources disagreed or where you couldn't find good coverage.

  Be skeptical. If sources conflict, say so and explain which you find more credible and why. Don't paper over uncertainty with confident-sounding prose.
tools:
  - type: agent_toolset_20260401
metadata:
  template: deep-research`,
  },
  {
    id: "structured-extractor",
    name: "Structured extractor",
    description: "Parses unstructured text into a typed JSON schema.",
    yaml: `name: Structured extractor
description: Parses unstructured text into a typed JSON schema.
model: claude-sonnet-4-6
system: |
  You extract structured data from unstructured text. Given raw input (emails, PDFs, logs, transcripts, scraped HTML) and a target JSON schema:

  1. Read the schema first. Note required vs optional fields, enums, and format constraints (dates, currencies, IDs). The schema is the contract — never emit a key it doesn't define.
  2. Scan the input for each field. Prefer explicit values over inferred ones. If a required field is genuinely absent, use null rather than guessing.
  3. Normalize as you extract: trim whitespace, coerce dates to ISO 8601, strip currency symbols into numbers — code, collapse enum synonyms to their canonical value.
  4. Emit a single JSON object (or array, if the schema is a list) that validates against the schema. No prose, no markdown fences — just the JSON.

  When the input is ambiguous, pick the most conservative interpretation and note the ambiguity in a top-level "extraction_notes" field only if the schema allows additionalProperties.
tools:
  - type: agent_toolset_20260401
metadata:
  template: structured-extractor`,
  },
  {
    id: "field-monitor",
    name: "Field monitor",
    description:
      "Scans software blogs for a topic and writes a weekly what-changed brief.",
    yaml: `name: Field monitor
description: Scans software blogs for a topic and writes a weekly what-changed brief.
model: claude-sonnet-4-6
system: |
  You are a field intelligence monitor. Given a technology topic or domain:

  1. Search for the latest developments from the past 7 days — new releases, RFCs, blog posts from core maintainers, and notable discussions.
  2. For each item, extract: what changed, who announced it, when, and why it matters.
  3. Write a concise brief with sections: "New Releases", "Breaking Changes", "Notable Discussions", "What to Watch".
  4. Each item should be 2-3 sentences max. Link to sources.

  Prioritize signal over noise. Skip marketing fluff. If nothing meaningful happened, say so.
tools:
  - type: agent_toolset_20260401
metadata:
  template: field-monitor`,
  },
  {
    id: "support-agent",
    name: "Support agent",
    description:
      "Answers customer questions from your docs and knowledge base, and escalates when needed.",
    yaml: `name: Support agent
description: Answers customer questions from your docs and knowledge base, and escalates when needed.
model: claude-sonnet-4-6
system: |
  You are a support agent. Given a customer question:

  1. Search the documentation and knowledge base for relevant information.
  2. Provide a clear, helpful answer with specific steps if applicable.
  3. If you cannot find the answer in the docs, say so honestly and suggest escalation.
  4. Always be polite, concise, and solution-oriented.

  Never make up features or capabilities. If unsure, say "I'll need to check with the team" rather than guessing.
tools:
  - type: agent_toolset_20260401
metadata:
  template: support-agent`,
  },
  {
    id: "incident-commander",
    name: "Incident commander",
    description:
      "Triages a Sentry alert, opens a Linear incident ticket, and runs the bash war room.",
    integrations: ["Sentry", "Linear"],
    yaml: `name: Incident commander
description: Triages a Sentry alert, opens a Linear incident ticket, and runs the bash war room.
model: claude-sonnet-4-6
system: |
  You are an incident commander. When alerted to an issue:

  1. Assess severity: is this P0 (user-facing outage), P1 (degraded), or P2 (non-critical)?
  2. Gather context: check logs, error rates, recent deploys, and affected services.
  3. Document findings in a structured incident report with: Summary, Impact, Root Cause Hypothesis, Mitigation Steps, Timeline.
  4. Recommend immediate actions and long-term fixes.

  Stay calm, be methodical, prioritize user impact. Every minute counts during an incident.
tools:
  - type: agent_toolset_20260401
metadata:
  template: incident-commander`,
  },
  {
    id: "feedback-miner",
    name: "Feedback miner",
    description:
      "Clusters raw feedback from Slack and Notion into themes and drafts Asana tasks for the top asks.",
    integrations: ["Slack", "Notion", "Asana"],
    yaml: `name: Feedback miner
description: Clusters raw feedback into themes and drafts tasks for the top asks.
model: claude-sonnet-4-6
system: |
  You are a feedback analyst. Given a batch of raw user feedback:

  1. Read every piece of feedback. Don't skip or skim.
  2. Cluster into themes. Name each theme clearly (e.g., "Slow dashboard load times", not "Performance").
  3. For each theme: count mentions, quote the best 2-3 examples, assess severity (blocking, annoying, nice-to-have).
  4. Rank themes by frequency × severity.
  5. For the top 5, draft a task with: title, description, acceptance criteria, and suggested priority.

  Be quantitative where possible. "Many users" is worse than "14 of 23 respondents".
tools:
  - type: agent_toolset_20260401
metadata:
  template: feedback-miner`,
  },
  {
    id: "sprint-retro",
    name: "Sprint retro facilitator",
    description:
      "Pulls a closed sprint from Linear, synthesizes themes, and writes the retro doc before the meeting.",
    integrations: ["Linear"],
    yaml: `name: Sprint retro facilitator
description: Synthesizes sprint outcomes into a retro doc with themes and action items.
model: claude-sonnet-4-6
system: |
  You are a sprint retrospective facilitator. Given sprint data (completed tickets, velocity, blockers):

  1. Summarize what shipped, what slipped, and what was blocked.
  2. Identify patterns: What went well? What kept coming up as friction?
  3. Group into "Keep doing", "Stop doing", "Start doing" categories.
  4. Draft 3-5 specific, actionable items with owners and due dates.

  Keep it constructive. The goal is improvement, not blame. Use data over opinions.
tools:
  - type: agent_toolset_20260401
metadata:
  template: sprint-retro`,
  },
  {
    id: "data-analyst",
    name: "Data analyst",
    description:
      "Load, explore, and visualize data. Build reports and answer questions from datasets.",
    yaml: `name: Data analyst
description: Load, explore, and visualize data. Build reports and answer questions from datasets.
model: claude-sonnet-4-6
system: |
  You are a data analyst. When given a dataset or analytical question:

  1. Load and inspect the data. Check shape, types, nulls, and distributions before doing anything else.
  2. Clean as needed: handle missing values, fix types, remove duplicates.
  3. Answer the question with appropriate analysis — aggregations, correlations, trends, or statistical tests.
  4. Visualize key findings with clear charts (use Python matplotlib/seaborn).
  5. Summarize findings in plain language with specific numbers.

  Show your work. Every claim should trace back to a number in the data.
tools:
  - type: agent_toolset_20260401
metadata:
  template: data-analyst`,
  },
]

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function buildCommunityTemplatePrompt(agent: CommunityAgent): string {
  if (agent.yaml_config) {
    return `I want to use the community agent "${agent.name}". Generate the agent config from it:\n\n${agent.yaml_config}`
  }
  return `I want to use the community agent "${agent.name}". Generate the agent config from it:

name: ${agent.name}
description: ${agent.description || ""}
model: ${agent.model || "claude-sonnet-4-6"}
${agent.system_prompt ? `system: ${agent.system_prompt}` : "system: Generate a detailed system prompt for this agent."}
tools:
  - type: agent_toolset_20260401
${agent.mcp_server_names.length > 0 ? `mcp_servers: ${agent.mcp_server_names.join(", ")}` : ""}`
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return new Date(iso).toLocaleDateString()
}

function deriveProjectNameFromPrompt(prompt: string): string {
  const normalized = prompt.replace(/\s+/g, " ").trim().replace(/[.!?]+$/, "")
  if (!normalized) return "Untitled agent"
  return normalized.slice(0, 80)
}

/* ------------------------------------------------------------------ */
/*  Card components                                                    */
/* ------------------------------------------------------------------ */

function TemplateCard({
  template,
  onClick,
  disabled,
  isStarting,
}: {
  template: QuickstartTemplate
  onClick: () => void
  disabled: boolean
  isStarting: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group block rounded-[12px] text-left w-full",
        disabled && !isStarting && "opacity-55",
      )}
    >
      <div
        className="relative w-full h-[156px] rounded-[12px] overflow-hidden flex flex-col p-4 bg-card group-hover:bg-muted/80 transition-colors duration-200"
        style={{
          boxShadow: "inset 0 0 0 1px #0000000a, 0 1px 2px #0000000a",
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-[13px] font-semibold leading-tight break-words">
            {template.name}
          </h4>
          {isStarting && (
            <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-muted-foreground" />
          )}
        </div>
        <p className="mt-1.5 text-[12px] text-muted-foreground leading-relaxed line-clamp-3 break-words overflow-hidden">
          {template.description}
        </p>
        <div className="flex-1" />
        {template.integrations && template.integrations.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {template.integrations.map((name) => (
              <span
                key={name}
                className="rounded-full bg-foreground/[0.05] px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                {name}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  )
}

function CommunityTemplateCard({
  agent,
  onClick,
  disabled,
  isStarting,
}: {
  agent: CommunityAgent
  onClick: () => void
  disabled: boolean
  isStarting: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group block rounded-[12px] text-left w-full",
        disabled && !isStarting && "opacity-55",
      )}
    >
      <div
        className="relative w-full h-[156px] rounded-[12px] overflow-hidden flex flex-col p-4 bg-card group-hover:bg-muted/80 transition-colors duration-200"
        style={{
          boxShadow: "inset 0 0 0 1px #0000000a, 0 1px 2px #0000000a",
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-[13px] font-semibold leading-tight mb-1.5 break-words">
            {agent.name}
          </h4>
          {isStarting && (
            <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-muted-foreground" />
          )}
        </div>
        {agent.description && (
          <p className="text-[12px] text-muted-foreground leading-relaxed line-clamp-3 mb-3 min-h-0 break-words overflow-hidden">
            {agent.description}
          </p>
        )}
        <div className="flex-1" />
        {agent.mcp_server_names.length > 0 && (
          <McpServerIconRow
            servers={toMcpServerEntries(agent.mcp_server_names, agent.mcp_servers)}
            max={5}
            size={24}
          />
        )}
      </div>
    </button>
  )
}

/* ------------------------------------------------------------------ */
/*  Landing stepper steps                                              */
/* ------------------------------------------------------------------ */

const LANDING_STEPS = [
  { num: 1, label: "Build" },
  { num: 2, label: "Test" },
  { num: 3, label: "Integrate" },
]

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export function LandingHubClient() {
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  const colorMode = (resolvedTheme === "dark" ? "dark" : "light") as "light" | "dark"
  const teamId = useAtomValue(selectedTeamIdAtom)
  const [projects, setProjects] = useState<StudioProject[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [startingKey, setStartingKey] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  // Fetch existing projects
  useEffect(() => {
    if (!teamId) return
    const ac = new AbortController()
    ;(async () => {
      try {
        const res = await fetch(
          `/api/studio/projects?teamId=${encodeURIComponent(teamId)}`,
          { signal: ac.signal },
        )
        if (!res.ok) throw new Error(`Projects ${res.status}`)
        const data = (await res.json()) as { projects: StudioProject[] }
        setProjects(data.projects)
      } catch (err) {
        if ((err as Error).name === "AbortError") return
        setLoadError((err as Error).message)
      }
    })()
    return () => ac.abort()
  }, [teamId])

  const [communityAgents, setCommunityAgents] = useState<CommunityAgent[]>([])
  const [communityLoading, setCommunityLoading] = useState(false)
  useEffect(() => {
    const ac = new AbortController()
    void (async () => {
      setCommunityLoading(true)
      try {
        const params = new URLSearchParams()
        if (search.trim()) params.set("q", search.trim())
        const res = await fetch(
          `/api/studio/community-agents${params.toString() ? `?${params.toString()}` : ""}`,
          { signal: ac.signal },
        )
        if (!res.ok) {
          throw new Error(`Community agents ${res.status}`)
        }
        const data = (await res.json()) as { items?: CommunityAgent[] }
        setCommunityAgents(data.items ?? [])
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.warn("Failed to load Studio community agents", error)
          setCommunityAgents([])
        }
      } finally {
        if (!ac.signal.aborted) {
          setCommunityLoading(false)
        }
      }
    })()

    return () => ac.abort()
  }, [search])

  // Filter quickstart templates by search
  const filteredTemplates = useMemo(() => {
    if (!search.trim()) return QUICKSTART_TEMPLATES
    const q = search.toLowerCase()
    return QUICKSTART_TEMPLATES.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.integrations?.some((i) => i.toLowerCase().includes(q)),
    )
  }, [search])

  const createProject = useCallback(
    async (args: {
      templateSlug: string
      name?: string
      initialPrompt?: string
      analytics?: {
        source: "prompt" | "template" | "community_agent"
        template_id?: string
        community_agent_slug?: string
      }
    }) => {
      if (startingKey) return
      if (!teamId) {
        setLoadError("Select a team first")
        return
      }

      const nextStartingKey = args.initialPrompt?.trim().length
        ? args.name || "prompt"
        : args.templateSlug === "blank"
          ? "blank"
          : args.templateSlug

      setStartingKey(nextStartingKey)
      setLoadError(null)

      try {
        const res = await fetch("/api/studio/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            templateSlug: args.templateSlug,
            teamId,
            ...(args.name ? { name: args.name } : {}),
          }),
        })
        if (!res.ok) {
          const body = await res.text().catch(() => "")
          throw new Error(`Create failed: ${res.status} ${body}`)
        }
        const data = (await res.json()) as { projectId: string }
        const projectId = data.projectId

        capture21stAgentsEvent("studio_project_created", {
          project_id: projectId,
          template_slug: args.templateSlug,
          has_initial_prompt: !!args.initialPrompt?.trim(),
          ...args.analytics,
        })

        if (args.initialPrompt?.trim()) {
          const params = new URLSearchParams({ prompt: args.initialPrompt.trim() })
          router.push(`/agents/studio/${projectId}?${params.toString()}`)
          return
        }

        router.push(`/agents/studio/${projectId}`)
      } catch (err) {
        const message = (err as Error).message
        capture21stAgentsEvent("studio_project_create_failed", {
          template_slug: args.templateSlug,
          error: message,
          ...args.analytics,
        })
        setLoadError(message)
        setStartingKey(null)
      }
    },
    [router, startingKey, teamId],
  )

  const handleChatSend = useCallback(
    (message: { role: "user"; content: string }) => {
      const trimmed = message.content.trim()
      if (!trimmed || startingKey) return
      void createProject({
        templateSlug: "blank",
        name: deriveProjectNameFromPrompt(trimmed),
        initialPrompt: trimmed,
        analytics: { source: "prompt" },
      })
    },
    [createProject, startingKey],
  )

  const wizardSendHandler = useCallback(
    (text: string) => handleChatSend({ role: "user", content: text }),
    [handleChatSend],
  )

  const handlePickTemplate = useCallback(
    (template: QuickstartTemplate) => {
      const templatePrompt = `I want to use this template. Generate the agent config from it:\n\n${template.yaml}`
      void createProject({
        templateSlug: "blank",
        name: template.name,
        initialPrompt: templatePrompt,
        analytics: { source: "template", template_id: template.id },
      })
    },
    [createProject],
  )

  const handlePickCommunityAgent = useCallback(
    (agent: CommunityAgent) => {
      void createProject({
        templateSlug: "blank",
        name: agent.name,
        initialPrompt: buildCommunityTemplatePrompt(agent),
        analytics: { source: "community_agent", community_agent_slug: agent.slug },
      })
    },
    [createProject],
  )

  useEffect(() => {
    capture21stAgentsEvent("studio_landing_viewed")
  }, [])

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-tl-background">
      {/* ── Inner header — centered stepper ── */}
      <div className="relative flex shrink-0 items-center justify-center border-b border-border px-4 py-2">
        <span className="absolute left-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          Studio
        </span>
        <div className="flex items-center gap-0.5">
          {LANDING_STEPS.map((step, index) => (
            <div key={step.num} className="flex items-center gap-0.5">
              <div
                className={cn(
                  "flex items-center gap-2 rounded-full px-2.5 py-1 text-[12px]",
                  step.num === 1
                    ? "bg-foreground/10 text-foreground"
                    : "text-muted-foreground opacity-45 cursor-default",
                )}
              >
                <span
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-medium",
                    step.num === 1
                      ? "bg-foreground text-background"
                      : "bg-foreground/10 text-muted-foreground",
                  )}
                >
                  {step.num}
                </span>
                <span className="font-medium">{step.label}</span>
              </div>
              {index < LANDING_STEPS.length - 1 && (
                <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/40" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* ── Left panel: Chat ── */}
        <div className="flex w-[540px] shrink-0 flex-col border-r border-border min-h-0">
          <WizardSendContext.Provider value={wizardSendHandler}>
            <div className="relative flex-1 min-h-0">
              <AnAgentChat
                messages={[]}
                onSend={handleChatSend}
                status={startingKey ? "submitted" : "ready"}
                onStop={() => {}}
                colorMode={colorMode}
                className="h-full"
              />
              <div className="pointer-events-none absolute inset-x-0 top-0 bottom-20 flex items-center justify-center px-6">
                <div className="pointer-events-auto">
                  <WizardEmptyState />
                </div>
              </div>
            </div>
          </WizardSendContext.Provider>
          {loadError && (
            <div className="mx-4 mb-3 rounded-lg border border-destructive/40 bg-destructive/5 p-2.5 text-[12px] text-destructive">
              {loadError}
            </div>
          )}
        </div>

        {/* ── Right panel: Templates ── */}
        <div className="flex flex-1 min-w-0 flex-col min-h-0">
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {/* Continue editing */}
            {(projects === null || projects.length > 0) && (
              <div className="mb-6">
                <h3 className="text-[13px] font-medium text-muted-foreground mb-3">
                  Continue editing
                </h3>
                <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-3">
                  {projects === null
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <div
                          key={i}
                          className="rounded-lg border border-border bg-card p-3"
                        >
                          <div className="flex h-[18px] items-center">
                            <Skeleton className="h-3.5 w-32" />
                          </div>
                          <div className="mt-0.5 flex h-[17px] items-center">
                            <Skeleton className="h-3 w-20" />
                          </div>
                          <div className="mt-1.5 flex h-[17px] items-center">
                            <Skeleton className="h-3 w-14" />
                          </div>
                        </div>
                      ))
                    : projects.map((project) => (
                        <button
                          key={project.id}
                          onClick={() => {
                            capture21stAgentsEvent("studio_project_resumed", {
                              project_id: project.id,
                              has_deployment: project.hasDeployment,
                            })
                            router.push(`/agents/studio/${project.id}`)
                          }}
                          className="an-focus-btn group rounded-lg border border-border bg-card p-3 text-left transition-[border-color] duration-150 ease-out hover:border-foreground/20"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="truncate text-[13px] font-medium text-foreground">
                              {project.name}
                            </span>
                            {project.hasDeployment && (
                              <span className="shrink-0 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-medium text-emerald-600 dark:text-emerald-400">
                                Deployed
                              </span>
                            )}
                          </div>
                          <span className="mt-0.5 block truncate font-mono text-[11px] text-muted-foreground">
                            {project.deployed_slug}
                          </span>
                          <div className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground/70">
                            <Clock className="h-3 w-3" />
                            {formatRelativeTime(project.updated_at)}
                          </div>
                        </button>
                      ))}
                </div>
              </div>
            )}

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search templates and community agents..."
                className="w-full h-9 rounded-lg border border-border bg-card pl-9 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground/20 transition-colors"
              />
            </div>

            {/* Quickstart templates */}
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
              {filteredTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onClick={() => handlePickTemplate(template)}
                  disabled={!!startingKey}
                  isStarting={startingKey === template.name}
                />
              ))}
            </div>

            {/* Community agents */}
            {(communityLoading || communityAgents.length > 0) && (
              <>
                <div className="flex items-center gap-3 my-6">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-[12px] text-muted-foreground font-medium">
                    Community agents
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
                  {communityLoading && communityAgents.length === 0
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          className="relative w-full h-[156px] rounded-[12px] overflow-hidden flex flex-col p-4 bg-card"
                          style={{
                            boxShadow:
                              "inset 0 0 0 1px #0000000a, 0 1px 2px #0000000a",
                          }}
                        >
                          <Skeleton className="h-[13px] w-28" />
                          <Skeleton className="mt-3 h-[11px] w-full" />
                          <Skeleton className="mt-1.5 h-[11px] w-5/6" />
                          <Skeleton className="mt-1.5 h-[11px] w-2/3" />
                          <div className="flex-1" />
                          <div className="flex gap-1.5">
                            <Skeleton className="h-6 w-6 rounded-full" />
                            <Skeleton className="h-6 w-6 rounded-full" />
                          </div>
                        </div>
                      ))
                    : communityAgents.map((agent) => (
                        <CommunityTemplateCard
                          key={agent.id}
                          agent={agent}
                          onClick={() => handlePickCommunityAgent(agent)}
                          disabled={!!startingKey}
                          isStarting={startingKey === agent.name}
                        />
                      ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
