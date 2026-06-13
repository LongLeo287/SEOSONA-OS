"use client"

import { useState, useMemo, useEffect, useRef, useCallback } from "react"
import dynamic from "next/dynamic"
import { useAgentsRouter } from "@/hooks/use-agents-router"
import { api } from "@/trpc/client"
import { useAtom, useAtomValue } from "jotai"
import { selectedTeamIdAtom } from "@/lib/atoms/team"
import { anSelectedAgentAtom } from "@/lib/atoms/an-agent"
import { docsCodeLanguageAtom, type DocsCodeLanguage } from "@/lib/atoms/agents-docs"
import { motion, AnimatePresence } from "motion/react"
import { toast } from "sonner"
import { Cloud, Server, ArrowRight, ChevronsUpDown, Check, SlidersHorizontal, Loader2, Wand2 } from "lucide-react"
import { TemplateIcon } from "@/components/features/agents/an/docs/template-card"
import {
  CopyIcon,
  CheckIcon,
} from "@/components/features/agents/an/docs/icons"
import { CodeBlock } from "@/components/features/agents/an/docs/code-block"
import { AN_SDK_SKILL, generateIntegrationMarkdown } from "@/components/features/agents/an/utils/generate-integration-markdown"
import {
  defaultOnboardingState,
  type OnboardingState,
} from "@/components/features/agents/an/dashboard/onboarding/atoms"
import { IdentityStep } from "@/components/features/agents/an/dashboard/onboarding/steps/identity-step"
import { ThemeStep } from "@/components/features/agents/an/dashboard/onboarding/steps/theme-step"
import { AN_STARTER_TEMPLATES, AN_USE_CASE_TEMPLATES, AN_INTEGRATION_TEMPLATES } from "@/lib/constants/agents-templates"
import { agentsHref } from "@/lib/utils/agents-href"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  GoIcon,
  PythonIcon,
  TypeScriptIcon,
} from "@/components/features/agents/an/docs/framework-icons"
import { generateThemeJson } from "@/components/features/agents/an/playground/use-playground-state"
import { VISUAL_PRESETS } from "@/components/features/agents/an/types"

const UnifiedChatPreview = dynamic(
  () => import("@/components/features/agents/an/chat-preview").then((m) => m.UnifiedChatPreview),
  { ssr: false },
)
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/features/agents/ui/canvas/[id]/{components}/ui/dropdown-menu"
import {
  formatCost,
  formatDuration,
  getDateFromPreset,
} from "../threads/_components/logs-constants"
import { useObservabilityMetrics } from "../observability/_components/use-observability-metrics"
import { MiniSparkline } from "@/components/features/agents/an/dashboard/mini-sparkline"
import { formatRelativeTime } from "@/lib/utils/deployment-utils"
import { DeploymentStatusDot, CurrentBadge, type DeploymentStatus } from "../deployments/_components/deployment-status-badge"
import { AgentAvatar } from "@/components/features/agents/an/dashboard/agent-avatar"

function SlugCopy({ slug, label }: { slug: string; label: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="flex flex-col items-end gap-0.5">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <button
        onClick={async () => {
          await navigator.clipboard.writeText(slug)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        }}
        className="an-focus-btn flex items-center gap-1.5 rounded-md text-foreground transition-all group"
        aria-label="Copy slug"
      >
        <span className="text-[11px] font-mono text-muted-foreground max-w-[120px] truncate">{slug}</span>
        <div className="relative size-3.5">
          <CopyIcon
            className={`absolute inset-0 size-3.5 text-muted-foreground transition-[opacity,transform] duration-200 ease-out ${
              copied ? "opacity-0 scale-50" : "opacity-70 scale-100 group-hover:opacity-100"
            }`}
          />
          <CheckIcon
            className={`absolute inset-0 size-3.5 text-muted-foreground transition-[opacity,transform] duration-200 ease-out ${
              copied ? "opacity-100 scale-100" : "opacity-0 scale-50"
            }`}
          />
        </div>
      </button>
    </div>
  )
}

/* Template icons now use TemplateIcon component */

function OverviewSkeleton({ hasAgent }: { hasAgent: boolean }) {
  return (
    <div className="mx-auto w-full max-w-2xl flex flex-col gap-4 px-8 py-6">
      {/* Agent header (only when agent selected) */}
      {hasAgent && (
        <div className="flex items-center justify-between px-1">
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-28 rounded-md" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-1.5 w-1.5 rounded-full" />
              <Skeleton className="h-3 w-20 rounded-md" />
              <Skeleton className="h-4 w-16 rounded-md" />
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Skeleton className="h-3 w-14 rounded-md" />
            <Skeleton className="h-3 w-24 rounded-md" />
          </div>
        </div>
      )}

      {/* Stats bar (5 cols) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <Skeleton className="h-3.5 w-20 rounded-md" />
          <Skeleton className="h-3 w-14 rounded-md" />
        </div>
        <div className="rounded-lg border-[0.5px] border-border bg-card overflow-hidden">
          <div className="grid grid-cols-5 divide-x divide-border/50">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="px-4 py-3 flex flex-col items-center gap-1.5">
                <Skeleton className="h-4 rounded-md" style={{ width: [28, 24, 32, 28, 20][i] }} />
                <Skeleton className="h-3 w-12 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agents list (only when no agent selected) */}
      {!hasAgent && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <Skeleton className="h-3.5 w-14 rounded-md" />
            <Skeleton className="h-3 w-10 rounded-md" />
          </div>
          <div className="rounded-lg border-[0.5px] border-border bg-card overflow-hidden">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex h-12 items-center border-b-[0.5px] border-border last:border-b-0"
              >
                <div className="min-w-0 flex-1 pl-4 flex flex-col gap-1.5">
                  <Skeleton className="h-3 rounded-md" style={{ width: [100, 80, 120][i] }} />
                  <Skeleton className="h-2.5 w-16 rounded-md" />
                </div>
                <div className="shrink-0" style={{ width: 100 }}>
                  <Skeleton className="h-3 w-12 rounded-md" />
                </div>
                <div className="shrink-0" style={{ width: 120 }}>
                  <Skeleton className="h-4 w-16 rounded-md" />
                </div>
                <div className="shrink-0 pr-4" style={{ width: 100 }}>
                  <Skeleton className="h-3 w-10 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom grid: Deployments | Env Variables */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <Skeleton className="h-3.5 w-20 rounded-md" />
            <Skeleton className="h-3 w-12 rounded-md" />
          </div>
          <div className="rounded-lg border-[0.5px] border-border bg-card overflow-hidden min-h-[180px]">
            <div className="flex h-7 items-center border-b-[0.5px] border-border bg-muted/30 px-3">
              <Skeleton className="h-2.5 w-10 rounded-md" />
              <div className="flex-1" />
              <Skeleton className="h-2.5 w-8 rounded-md mr-3" />
              <Skeleton className="h-2.5 w-8 rounded-md" />
            </div>
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex h-9 items-center border-b-[0.5px] border-border last:border-b-0 px-3">
                <Skeleton className="h-3 flex-1 max-w-[80px] rounded-md" />
                <div className="flex-1" />
                <Skeleton className="h-3 w-10 rounded-md mr-3" />
                <Skeleton className="h-3 w-10 rounded-md" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <Skeleton className="h-3.5 w-20 rounded-md" />
            <Skeleton className="h-3 w-12 rounded-md" />
          </div>
          <div className="rounded-lg border-[0.5px] border-border bg-card overflow-hidden min-h-[180px]">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2 px-3 h-[34px] border-b-[0.5px] border-border/50 last:border-b-0">
                <Skeleton className="h-3 rounded-md" style={{ width: [70, 90, 60, 80][i] }} />
                <div className="flex-1" />
                <Skeleton className="h-3 w-16 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

type EnvEntry = { key: string; value: string }

function parseEnvVars(raw: unknown): EnvEntry[] {
  if (!raw || typeof raw !== "object") return []
  return Object.entries(raw as Record<string, string>).map(([key, value]) => ({
    key,
    value: String(value),
  }))
}

function AgentCard({
  agent,
  config,
  metrics,
  isSelected,
  onSelect,
}: {
  agent: { id: string; name: string; slug: string }
  config?: {
    deployed_at?: string | Date | null
    bundle_hash?: string | null
    runtime?: string | null
  }
  metrics: { sessions: number; threads: number; cost: number; errorRate: number }
  isSelected?: boolean
  onSelect: () => void
}) {
  const isDeployed = !!config?.deployed_at && !!config?.bundle_hash

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect() } }}
      className={`an-focus-btn group cursor-pointer rounded-lg border-[0.5px] bg-card overflow-hidden transition-colors ${
        isSelected ? "border-foreground/25" : "border-border hover:border-foreground/15"
      }`}
    >
      <div className="px-4 py-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <AgentAvatar name={agent.name} size="sm" />
            <span className="text-[13px] font-medium text-foreground truncate">
              {agent.name}
            </span>
          </div>
          {config?.runtime && (
            <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground shrink-0">
              {config.runtime}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {isDeployed ? (
            <span className="text-[11px] text-muted-foreground">
              Deployed {formatRelativeTime(new Date(config.deployed_at!))}
            </span>
          ) : (
            <span className="text-[11px] text-muted-foreground/60">
              Not deployed
            </span>
          )}
        </div>
      </div>
      {isDeployed && (
        <div className="grid grid-cols-4 border-t border-border/50 divide-x divide-border/50">
          <div className="px-2.5 py-2 text-center">
            <div className="text-[11px] font-medium tabular-nums">{metrics.sessions}</div>
            <div className="text-[9px] text-muted-foreground">Sessions</div>
          </div>
          <div className="px-2.5 py-2 text-center">
            <div className="text-[11px] font-medium tabular-nums">{metrics.threads}</div>
            <div className="text-[9px] text-muted-foreground">Threads</div>
          </div>
          <div className="px-2.5 py-2 text-center">
            <div className="text-[11px] font-medium tabular-nums">
              {formatCost(metrics.cost > 0 ? metrics.cost : null)}
            </div>
            <div className="text-[9px] text-muted-foreground">Cost</div>
          </div>
          <div className="px-2.5 py-2 text-center">
            <div className="text-[11px] font-medium tabular-nums">
              {metrics.errorRate > 0 ? `${metrics.errorRate.toFixed(1)}%` : "0%"}
            </div>
            <div className="text-[9px] text-muted-foreground">Errors</div>
          </div>
        </div>
      )}
    </div>
  )
}

const AGENT_INIT_CODE = `npm init -y
npm install @21st-sdk/agent zod`

const AGENT_CODE = `import { agent, tool } from "@21st-sdk/agent"
import { z } from "zod"

export default agent({
  model: "claude-sonnet-4-6",
  systemPrompt: "You are a helpful coding assistant.",
  tools: {
    add: tool({
      description: "Add two numbers",
      inputSchema: z.object({ a: z.number(), b: z.number() }),
      execute: async ({ a, b }) => ({
        content: [{ type: "text", text: \`\${a + b}\` }],
      }),
    }),
  },
})`

const DEPLOY_CODE = `npx @21st-sdk/cli login
npx @21st-sdk/cli deploy`

const TOKEN_ROUTE_CODE = `import { createTokenHandler } from "@21st-sdk/nextjs/server"

export const POST = createTokenHandler({
  apiKey: process.env.API_KEY_21ST!,
})`

function getUsageCode(slug: string) {
  return `"use client"

import { AgentChat, createAgentChat } from "@21st-sdk/nextjs"
import { useChat } from "@ai-sdk/react"

const chat = createAgentChat({
  agent: "${slug}",
  tokenUrl: "/api/an-token",
})

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit, status, stop, error } =
    useChat({ chat })

  return (
    <AgentChat
      messages={messages}
      onSend={() => handleSubmit()}
      status={status}
      onStop={stop}
      error={error ?? undefined}
    />
  )
}`
}

const PYTHON_SERVER_USAGE_CODE = `import os

from twentyfirst_sdk import AgentClient

client = AgentClient(api_key=os.environ["API_KEY_21ST"])

sandbox = client.sandboxes.create(agent="my-agent")
thread = client.threads.create(sandbox_id=sandbox.id, name="Chat 1")

run = client.threads.run(
    agent="my-agent",
    sandbox_id=sandbox.id,
    thread_id=thread.id,
    messages=[
        {
            "role": "user",
            "parts": [
                {"type": "text", "text": "Review the latest PR comments."},
            ],
        },
    ],
)

try:
    for raw_line in run.response.iter_lines(decode_unicode=True):
        if raw_line:
            print(raw_line)
finally:
    run.response.close()`

const GO_SERVER_USAGE_CODE = `package main

import (
	"bufio"
	"context"
	"log"
	"os"

	agents "github.com/21st-dev/21st-sdk-go"
)

func main() {
	ctx := context.Background()
	client := agents.NewAgentClient(os.Getenv("API_KEY_21ST"))

	sandbox, err := client.Sandboxes.Create(ctx, &agents.CreateSandboxRequest{
		Agent: "my-agent",
	})
	if err != nil {
		log.Fatal(err)
	}

	thread, err := client.Threads.Create(ctx, sandbox.ID, "Chat 1")
	if err != nil {
		log.Fatal(err)
	}

	run, err := client.Threads.Run(ctx, &agents.RunThreadRequest{
		Agent:     "my-agent",
		SandboxID: sandbox.ID,
		ThreadID:  thread.ID,
		Messages: []agents.RunThreadMessage{
			{
				Role: "user",
				Parts: []map[string]interface{}{
					{"type": "text", "text": "Review the latest PR comments."},
				},
			},
		},
	})
	if err != nil {
		log.Fatal(err)
	}
	defer run.Response.Body.Close()

	scanner := bufio.NewScanner(run.Response.Body)
	for scanner.Scan() {
		if line := scanner.Text(); line != "" {
			log.Println(line)
		}
	}
	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}
}`

const OVERVIEW_DOCS_CODE_LANGUAGE_OPTIONS = [
  {
    id: "typescript",
    label: "TypeScript",
    icon: TypeScriptIcon,
  },
  {
    id: "python",
    label: "Python",
    icon: PythonIcon,
  },
  {
    id: "go",
    label: "Golang",
    icon: GoIcon,
  },
] as const

const OVERVIEW_LANGUAGE_CONTENT: Record<
  DocsCodeLanguage,
  {
    intro: string
    envFilename: string
    installCode: string
    showClientSetup: boolean
    serverUsageCode?: string
    serverUsageFilename?: string
  }
> = {
  typescript: {
    intro: "Build AI agents with tools, deploy in seconds, and add them to your Next.js app",
    envFilename: ".env.local",
    installCode: "pnpm add @21st-sdk/nextjs",
    showClientSetup: true,
  },
  python: {
    intro: "Build AI agents with tools, deploy in seconds, and connect to them from your Python server",
    envFilename: ".env",
    installCode: "pip install 21st-sdk",
    showClientSetup: false,
    serverUsageCode: PYTHON_SERVER_USAGE_CODE,
    serverUsageFilename: "server.py",
  },
  go: {
    intro: "Build AI agents with tools, deploy in seconds, and connect to them from your Go server",
    envFilename: ".env",
    installCode: "go get github.com/21st-dev/21st-sdk-go",
    showClientSetup: false,
    serverUsageCode: GO_SERVER_USAGE_CODE,
    serverUsageFilename: "main.go",
  },
}

const DEFAULT_SYSTEM_PROMPT = "You are a helpful coding assistant."
const DEFAULT_PROMPT_ONBOARDING_STATE: OnboardingState = {
  ...defaultOnboardingState,
  agentName: "My Agent",
  agentSlug: "my-agent",
  systemPrompt: DEFAULT_SYSTEM_PROMPT,
  theme: "notion",
  primaryColor: "#3b82f6",
}

function resolvePromptVisualConfig(state: OnboardingState) {
  if (state.visualConfig) {
    return { ...state.visualConfig, primaryColor: state.primaryColor }
  }
  if (state.theme && state.theme !== "custom") {
    const preset = VISUAL_PRESETS[state.theme]
    if (preset) {
      return { ...preset.config, primaryColor: state.primaryColor }
    }
  }
  return { ...VISUAL_PRESETS.notion!.config, primaryColor: state.primaryColor }
}

function TimelineStep({
  number,
  title,
  isLast,
  children,
}: {
  number: number
  title: string
  isLast?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="relative flex gap-4">
      {/* Dot + line */}
      <div className="flex flex-col items-center">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-background text-[11px] font-semibold text-foreground z-10">
          {number}
        </div>
        {!isLast && <div className="w-px flex-1 bg-border" />}
      </div>
      {/* Content */}
      <div className={cn("flex-1 min-w-0", isLast ? "pb-0" : "pb-8")}>
        <h3 className="text-[14px] font-medium text-foreground leading-6">{title}</h3>
        <div className="mt-1.5 space-y-3">{children}</div>
      </div>
    </div>
  )
}

function OverviewDocsCodeLanguageSwitch() {
  const [docsCodeLanguage, setDocsCodeLanguage] = useAtom(docsCodeLanguageAtom)
  const [open, setOpen] = useState(false)
  const selectedOption =
    OVERVIEW_DOCS_CODE_LANGUAGE_OPTIONS.find(
      (option) => option.id === docsCodeLanguage,
    ) ?? OVERVIEW_DOCS_CODE_LANGUAGE_OPTIONS[0]
  const SelectedIcon = selectedOption.icon

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Code examples language"
          className={cn(
            "an-focus-btn flex h-8 w-[150px] items-center gap-2 rounded-md border border-border/70 px-2.5 text-[12px] font-medium shadow-none transition-colors",
            open ? "bg-muted" : "bg-foreground/[0.03] hover:bg-muted/60",
          )}
        >
          <SelectedIcon className="h-3.5 w-3.5 shrink-0" />
          <span className="flex-1 truncate text-left">{selectedOption.label}</span>
          <ChevronsUpDown className="h-3 w-3 shrink-0 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={4}
        style={{ minWidth: "var(--radix-dropdown-menu-trigger-width)" }}
      >
        {OVERVIEW_DOCS_CODE_LANGUAGE_OPTIONS.map((option) => {
          const Icon = option.icon
          const isSelected = option.id === docsCodeLanguage

          return (
            <DropdownMenuItem
              key={option.id}
              onSelect={() => setDocsCodeLanguage(option.id as typeof docsCodeLanguage)}
              className="text-[12px]"
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span className="flex-1">{option.label}</span>
              {isSelected && <Check className="h-4 w-4 shrink-0 text-muted-foreground" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


function GetStartedContent({ teamId }: { teamId: string }) {
  const router = useAgentsRouter()
  const [docsCodeLanguage] = useAtom(docsCodeLanguageAtom)
  const [promptCopied, setPromptCopied] = useState(false)
  const [skillCopied, setSkillCopied] = useState(false)
  const [configuratorOpen, setConfiguratorOpen] = useState(false)
  const [promptOnboardingState, setPromptOnboardingState] = useState<OnboardingState>(
    DEFAULT_PROMPT_ONBOARDING_STATE,
  )

  const { data: keys } = api.anApiKeys.list.useQuery(
    { teamId },
    { enabled: !!teamId },
  )

  const activeKey = keys?.find((k) => k.is_active)
  const languageContent = OVERVIEW_LANGUAGE_CONTENT[docsCodeLanguage]
  const isCustomTheme = promptOnboardingState.theme === "custom"
  const configuredSlug = promptOnboardingState.agentSlug.trim() || "my-agent"
  const resolvedVisualConfig = useMemo(
    () => resolvePromptVisualConfig(promptOnboardingState),
    [promptOnboardingState],
  )
  const themeJson = useMemo(
    () => generateThemeJson(resolvedVisualConfig),
    [resolvedVisualConfig],
  )

  const markdown = useMemo(
    () =>
      generateIntegrationMarkdown(
        configuredSlug,
        undefined,
        themeJson,
        docsCodeLanguage,
        {
          agentName: promptOnboardingState.agentName,
          runtime: promptOnboardingState.runtime,
          systemPrompt: promptOnboardingState.systemPrompt,
        },
      ),
    [
      configuredSlug,
      themeJson,
      docsCodeLanguage,
      promptOnboardingState.agentName,
      promptOnboardingState.runtime,
      promptOnboardingState.systemPrompt,
    ],
  )

  const handleCopyPrompt = useCallback(() => {
    navigator.clipboard.writeText(markdown)
    setPromptCopied(true)
    setTimeout(() => setPromptCopied(false), 2_000)
  }, [markdown])

  const handleCopySkill = useCallback(() => {
    navigator.clipboard.writeText(AN_SDK_SKILL)
    setSkillCopied(true)
    setTimeout(() => setSkillCopied(false), 2_000)
  }, [])

  const handleConfigurePrompt = useCallback(() => {
    setConfiguratorOpen(true)
  }, [])

  const handleCopyConfiguredPrompt = useCallback(() => {
    handleCopyPrompt()
    setConfiguratorOpen(false)
    toast.success("Prompt copied")
  }, [handleCopyPrompt])

  return (
    <motion.div
      className="flex flex-1 flex-col overflow-auto bg-tl-background [--code-block-bg:hsl(var(--tl-background))]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <div className="mx-auto w-full max-w-[1056px] px-8 pb-10 pt-10">
        {/* Get started section */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-[15px] font-semibold tracking-tight text-foreground">Get started</h2>
            <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed">
              {languageContent.intro}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <OverviewDocsCodeLanguageSwitch />
            <button
              onClick={handleCopySkill}
              className="an-focus-btn relative inline-flex h-8 items-center overflow-hidden whitespace-nowrap rounded-lg border border-border bg-card px-3.5 text-[12px] font-medium text-foreground transition-[border-color,transform] duration-150 ease-out hover:border-foreground/20 active:scale-[0.97]"
            >
              <span
                className={cn(
                  "flex items-center gap-1.5 transition-[opacity,transform] duration-200 ease-out",
                  skillCopied ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100",
                )}
              >
                <CopyIcon className="h-3.5 w-3.5" />
                Copy skill
              </span>
              <span
                className={cn(
                  "absolute inset-0 flex items-center justify-center gap-1.5 transition-[opacity,transform] duration-200 ease-out",
                  skillCopied ? "translate-y-0 opacity-100" : "translate-y-full opacity-0",
                )}
              >
                <CheckIcon className="h-3.5 w-3.5" />
                Copied
              </span>
            </button>
          </div>
        </div>

        <Dialog open={configuratorOpen} onOpenChange={setConfiguratorOpen}>
          <DialogContent
            className={cn(
              "p-0 gap-0 overflow-hidden flex flex-row h-[min(90vh,720px)] transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
              isCustomTheme
                ? "w-[min(1040px,calc(100%-2rem))]"
                : "w-[min(520px,calc(100%-2rem))]",
            )}
            hideCloseButton
          >
            {/* ── Left column: config ── */}
            <div className="w-[520px] shrink-0 flex flex-col overflow-hidden">
              {isCustomTheme ? (
                <DialogTitle className="sr-only">Configure prompt — Custom theme</DialogTitle>
              ) : (
                <div className="px-6 pt-6 pb-5 shrink-0">
                  <DialogTitle className="text-xl font-semibold">Configure prompt</DialogTitle>
                  <DialogDescription className="mt-1">
                    Personalize your agent name, system prompt, and theme — then copy.
                  </DialogDescription>
                </div>
              )}

              <div className={cn(
                "flex-1 min-h-0 px-6 pb-5",
                isCustomTheme
                  ? "overflow-hidden flex flex-col pt-5"
                  : "overflow-y-auto space-y-6",
              )}>
                {!isCustomTheme && (
                  <>
                    <IdentityStep
                      state={promptOnboardingState}
                      setState={setPromptOnboardingState}
                      isActive
                      hideHeader
                    />
                    <div className="border-t border-border" />
                  </>
                )}
                <ThemeStep
                  state={promptOnboardingState}
                  setState={setPromptOnboardingState}
                  hideHeader
                />
              </div>

              <div className="shrink-0 bg-muted border-t border-border px-4 py-3 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setPromptOnboardingState(DEFAULT_PROMPT_ONBOARDING_STATE)}
                  className="an-focus-btn inline-flex h-8 items-center rounded-md px-3 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={handleCopyConfiguredPrompt}
                  className="an-focus-btn inline-flex h-8 items-center rounded-md bg-foreground px-3 text-[13px] font-medium text-background transition-[background-color,transform] duration-150 ease-out hover:bg-foreground/85 active:scale-[0.97]"
                >
                  Copy prompt
                </button>
              </div>
            </div>

            {/* ── Right column: live preview ── */}
            <AnimatePresence>
              {isCustomTheme && (
                <motion.div
                  key="preview-panel"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 520, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="border-l border-border bg-muted/30 overflow-hidden flex flex-col"
                >
                  <div className="w-[520px] h-full flex flex-col">
                    <div className="shrink-0 px-5 py-3 border-b border-border">
                      <span className="text-[11px] font-medium text-muted-foreground/60">
                        Preview
                      </span>
                    </div>
                    <div className="flex-1 min-h-0 p-4">
                      <div className="h-full rounded-xl border border-border overflow-hidden">
                        <UnifiedChatPreview visualConfig={resolvedVisualConfig} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </DialogContent>
        </Dialog>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,640px)_minmax(0,380px)] gap-8 justify-center">
          {/* Left — Timeline steps */}
          <div className="min-w-0">
            <TimelineStep number={1} title="Create your agent">
              <CodeBlock code={AGENT_INIT_CODE} language="bash" />
              <p className="text-[13px] text-muted-foreground">
                Create{" "}
                <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">src/agent.ts</code>:
              </p>
              <CodeBlock code={AGENT_CODE} language="typescript" filename="src/agent.ts" />
            </TimelineStep>

            <TimelineStep number={2} title="Deploy">
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                Log in with your API key, then deploy:
              </p>
              <CodeBlock code={DEPLOY_CODE} language="bash" />
            </TimelineStep>

            <TimelineStep number={3} title="Install the SDK">
              <CodeBlock code={languageContent.installCode} language="bash" />
              {languageContent.showClientSetup ? (
                <p className="text-[13px] text-muted-foreground">
                  This also installs{" "}
                  <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">@21st-sdk/react</code>{" "}
                  with all UI components. Peer dependencies:{" "}
                  <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">ai</code>,{" "}
                  <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">@ai-sdk/react</code>.
                </p>
              ) : null}
            </TimelineStep>

            {languageContent.showClientSetup ? (
              <>
                <TimelineStep number={4} title="Create a token route">
                  <p className="text-[13px] text-muted-foreground">
                    The SDK exchanges your secret API key for short-lived tokens server-side, so credentials are never exposed to the browser.
                  </p>
                  <CodeBlock code={TOKEN_ROUTE_CODE} language="typescript" filename="app/api/an-token/route.ts" />
                </TimelineStep>

                <TimelineStep number={5} title="Add the chat component" isLast>
                  <p className="text-[13px] text-muted-foreground">
                    Use{" "}
                    <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">createAgentChat</code>{" "}
                    to connect to your agent and{" "}
                    <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">{"<AgentChat>"}</code>{" "}
                    to render the UI.
                  </p>
                  <CodeBlock code={getUsageCode("my-agent")} language="tsx" filename="app/page.tsx" />
                </TimelineStep>
              </>
            ) : (
              <TimelineStep number={4} title="Use the server-side SDK" isLast>
                <p className="text-[13px] text-muted-foreground">
                  Create a sandbox and thread, then call{" "}
                  <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">threads.run()</code>{" "}
                  from your {docsCodeLanguage === "go" ? "Go" : "Python"} server.
                </p>
                <CodeBlock
                  code={languageContent.serverUsageCode!}
                  language={docsCodeLanguage}
                  filename={languageContent.serverUsageFilename}
                />
              </TimelineStep>
            )}
          </div>

          {/* Right — Prompt + API Key + Templates */}
          <div className="flex flex-col gap-6">
            {/* Prompt */}
            <div>
              <h3 className="text-[13px] font-medium text-foreground px-1 mb-2">Prompt</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyPrompt}
                  className="an-focus-btn relative flex-1 inline-flex h-8 items-center justify-center overflow-hidden whitespace-nowrap rounded-lg border border-border bg-card text-[12px] font-medium text-foreground transition-[border-color,transform] duration-150 ease-out hover:border-foreground/20 active:scale-[0.97]"
                >
                  <span
                    className={cn(
                      "flex items-center gap-1.5 transition-[opacity,transform] duration-200 ease-out",
                      promptCopied ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100",
                    )}
                  >
                    <CopyIcon className="h-3.5 w-3.5" />
                    Copy prompt
                  </span>
                  <span
                    className={cn(
                      "absolute inset-0 flex items-center justify-center gap-1.5 transition-[opacity,transform] duration-200 ease-out",
                      promptCopied ? "translate-y-0 opacity-100" : "translate-y-full opacity-0",
                    )}
                  >
                    <CheckIcon className="h-3.5 w-3.5" />
                    Copied
                  </span>
                </button>
                <button
                  onClick={handleConfigurePrompt}
                  className="an-focus-btn inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-[12px] font-medium text-foreground transition-[border-color,transform] duration-150 ease-out hover:border-foreground/20 active:scale-[0.97]"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Configure
                </button>
              </div>
            </div>

            {/* API Key */}
            <div>
              <div className="flex items-center justify-between px-1 mb-2">
                <h3 className="text-[13px] font-medium text-foreground">API Key</h3>
                <button
                  onClick={() => router.push("/agents/api-keys")}
                  className="an-focus-btn rounded-md px-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Manage
                </button>
              </div>
              {activeKey ? (
                <div className="relative rounded-lg border border-border bg-card overflow-hidden">
                  <div className="px-3 py-2.5 font-mono text-[12px] leading-relaxed truncate">
                    <span className="text-foreground/50">
                      {activeKey.key_prefix ? `${activeKey.key_prefix}...` : "Legacy key"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-border bg-card px-3 py-2.5 text-[12px] text-muted-foreground/50">
                  Loading API key...
                </div>
              )}
            </div>

            {/* Templates */}
            <div>
              <div className="flex items-center justify-between px-1 mb-2">
                <h3 className="text-[13px] font-medium text-foreground">Templates</h3>
                <a
                  href={agentsHref("/agents/templates")}
                  className="an-focus-btn rounded-md px-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  View all
                </a>
              </div>
              <div className="rounded-lg border-[0.5px] border-border bg-card overflow-hidden">
                <div className="px-3.5 pt-2.5 pb-1">
                  <span className="text-[10px] font-medium text-muted-foreground/60">Starters</span>
                </div>
                {AN_STARTER_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.slug}
                    onClick={() => router.push(agentsHref(`/agents/templates/${tmpl.slug}`))}
                    className="an-focus-btn flex items-start gap-3 w-full p-3.5 text-left transition-colors hover:bg-muted/50 border-b border-border last:border-b-0 group"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <TemplateIcon template={tmpl} size="sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-[13px] font-medium text-foreground truncate">{tmpl.name}</h4>
                        <ArrowRight className="h-3 w-3 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate mt-0.5">{tmpl.description}</p>
                    </div>
                  </button>
                ))}
                <div className="px-3.5 pt-2.5 pb-1 border-t border-border">
                  <span className="text-[10px] font-medium text-muted-foreground/60">Use Cases</span>
                </div>
                {AN_USE_CASE_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.slug}
                    onClick={() => router.push(agentsHref(`/agents/templates/${tmpl.slug}`))}
                    className="an-focus-btn flex items-start gap-3 w-full p-3.5 text-left transition-colors hover:bg-muted/50 border-b border-border last:border-b-0 group"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <TemplateIcon template={tmpl} size="sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-[13px] font-medium text-foreground truncate">{tmpl.name}</h4>
                        <ArrowRight className="h-3 w-3 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate mt-0.5">{tmpl.description}</p>
                    </div>
                  </button>
                ))}
                <div className="px-3.5 pt-2.5 pb-1 border-t border-border">
                  <span className="text-[10px] font-medium text-muted-foreground/60">Integration Examples</span>
                </div>
                {AN_INTEGRATION_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.slug}
                    onClick={() => router.push(agentsHref(`/agents/templates/${tmpl.slug}`))}
                    className="an-focus-btn flex items-start gap-3 w-full p-3.5 text-left transition-colors hover:bg-muted/50 border-b border-border last:border-b-0 group"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <TemplateIcon template={tmpl} size="sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-[13px] font-medium text-foreground truncate">{tmpl.name}</h4>
                        <ArrowRight className="h-3 w-3 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate mt-0.5">{tmpl.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function DeploymentsBlock({
  teamId,
  agentId,
  onViewAll,
  onRowClick,
}: {
  teamId: string
  agentId?: string
  onViewAll: () => void
  onRowClick: (deploymentId: string) => void
}) {
  const { data, isLoading } = api.agentConfigs.listAllDeployments.useQuery(
    { teamId, agentId, limit: 10 },
    {
      enabled: !!teamId,
      refetchInterval: (query) => {
        const deployments = query.state.data?.deployments
        const hasBuilding = deployments?.some((d) => d.status === "building")
        return hasBuilding ? 3_000 : 10_000
      },
    },
  )

  const deployments = data?.deployments ?? []

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-[13px] font-medium">Deployments</span>
        <button
          onClick={onViewAll}
          className="an-focus-btn rounded-md px-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
        >
          View all
        </button>
      </div>
      <div className="rounded-lg border-[0.5px] border-border bg-card overflow-hidden min-h-[180px] flex flex-col">
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground/40" />
          </div>
        ) : deployments.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-1.5">
            <Cloud className="h-5 w-5 text-muted-foreground/25" />
            <p className="text-[11px] text-muted-foreground">No deployments yet</p>
          </div>
        ) : (
          <div>
            {deployments.map((d) => {
              const isCurrent = d.agent.active_deployment_id === d.id
              const age = formatRelativeTime(new Date(d.created_at))

              return (
                <div
                  key={d.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onRowClick(d.id)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onRowClick(d.id) } }}
                  className="an-focus-btn flex h-11 cursor-pointer items-center text-[11px] transition-colors hover:bg-muted/50 border-b-[0.5px] border-border last:border-b-0"
                >
                  <div className="shrink-0 pl-3" style={{ width: 90 }}>
                    <span className="font-mono text-[11px] text-foreground">
                      {d.id.slice(0, 8)}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-muted-foreground/60">
                        v{d.version}
                      </span>
                      {isCurrent && <CurrentBadge />}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <DeploymentStatusDot status={d.status as DeploymentStatus} />
                    <span className="text-[10px] text-muted-foreground">
                      {d.status === "ready" ? "Ready" : d.status === "building" ? "Building" : d.status === "failed" ? "Failed" : d.status}
                    </span>
                  </div>
                  {!agentId && (
                    <div className="flex shrink-0 items-center gap-1 ml-4">
                      <AgentAvatar name={d.agent.name} size="xs" />
                      <span className="text-[10px] text-muted-foreground/70 truncate max-w-[72px]">
                        {d.agent.name}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0 flex-1 pr-3 text-right">
                    <span className="text-[10px] text-muted-foreground tabular-nums">{age}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export function OverviewContent() {
  const teamId = useAtomValue(selectedTeamIdAtom)
  const selectedAgent = useAtomValue(anSelectedAgentAtom)
  const router = useAgentsRouter()

  // Fetch all agent configs — this is the source of truth for agents
  const { data: allConfigs = [], isLoading: configsLoading } =
    api.agentConfigs.listConfigs.useQuery(
      { teamId: teamId! },
      {
        enabled: !!teamId,
      },
    )

  // Studio links are resolved through studio_projects.deployed_agent_id.
  const [studioProjectByAgentId, setStudioProjectByAgentId] = useState<Map<string, string>>(
    new Map(),
  )
  useEffect(() => {
    if (!teamId) return
    const ac = new AbortController()
    ;(async () => {
      try {
        const res = await fetch(
          `/api/studio/projects?teamId=${encodeURIComponent(teamId)}`,
          { signal: ac.signal },
        )
        if (!res.ok) return
        const data = (await res.json()) as {
          projects: Array<{ id: string; deployed_agent_id: string | null }>
        }
        setStudioProjectByAgentId(
          new Map(
            data.projects
              .filter((project) => !!project.deployed_agent_id)
              .map((project) => [project.deployed_agent_id!, project.id] as const),
          ),
        )
      } catch {
        /* non-fatal: just hides the Open in Studio button */
      }
    })()
    return () => ac.abort()
  }, [teamId])
  const studioProjectId = selectedAgent ? studioProjectByAgentId.get(selectedAgent.id) : null

  const allAgents = useMemo(
    () =>
      allConfigs.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
      })),
    [allConfigs],
  )

  // When a specific agent is selected, filter down to just that agent
  const displayAgents = useMemo(
    () =>
      selectedAgent
        ? allAgents.filter((a) => a.id === selectedAgent.id)
        : allAgents,
    [allAgents, selectedAgent],
  )

  // The selected agent's config (for header)
  const agentConfig = useMemo(
    () => (selectedAgent ? allConfigs.find((c) => c.id === selectedAgent.id) : undefined),
    [allConfigs, selectedAgent],
  )

  // Sandboxes data (last 7 days)
  const createdAfter7d = useMemo(
    () => getDateFromPreset("7d", undefined),
    [],
  )

  const {
    data: sandboxesData,
    isLoading: sandboxesLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.agentConfigs.listSandboxes.useInfiniteQuery(
    {
      teamId: teamId!,
      agentId: selectedAgent?.id,
      createdAfter: createdAfter7d,
      limit: 100,
    },
    {
      enabled: !!teamId,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  )

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const allSandboxes = useMemo(
    () => sandboxesData?.pages.flatMap((page) => page.sandboxes) ?? [],
    [sandboxesData],
  )

  const allPagesFetched = !hasNextPage && !isFetchingNextPage && !sandboxesLoading

  const now = useRef(new Date()).current
  const rangeStart = useMemo(
    () => new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    [now],
  )

  const aggregateMetrics = useObservabilityMetrics(allSandboxes, "day", rangeStart, now)

  // Per-agent metrics
  const perAgentMetrics = useMemo(() => {
    const map = new Map<string, {
      sessions: number
      threads: number
      cost: number
      errorCount: number
      threadCount: number
      lastChatAt: Date | null
      dailyThreads: number[]
    }>()

    const dayMs = 24 * 60 * 60 * 1000
    const nowMs = now.getTime()

    for (const sandbox of allSandboxes) {
      const agentId = (sandbox as any).agent_id
      if (!agentId) continue
      const current = map.get(agentId) ?? {
        sessions: 0, threads: 0, cost: 0, errorCount: 0, threadCount: 0,
        lastChatAt: null as Date | null,
        dailyThreads: [0, 0, 0, 0, 0, 0, 0],
      }
      current.sessions += 1
      const threads = (sandbox as any).threads ?? []
      current.threads += threads.length
      current.threadCount += threads.length
      for (const t of threads) {
        current.cost += t.total_cost_usd ?? 0
        if (t.status === "error") current.errorCount += 1
        const threadDate = new Date(t.created_at)
        if (!current.lastChatAt || threadDate > current.lastChatAt) {
          current.lastChatAt = threadDate
        }
        const daysAgo = Math.floor((nowMs - threadDate.getTime()) / dayMs)
        if (daysAgo >= 0 && daysAgo < 7) {
          current.dailyThreads[6 - daysAgo] += 1
        }
      }
      map.set(agentId, current)
    }
    return map
  }, [allSandboxes, now])

  // Env vars (from selected agent config, or merged from all configs)
  const envEntries = useMemo(() => {
    if (agentConfig) return parseEnvVars(agentConfig.env_vars)
    const seen = new Set<string>()
    const merged: EnvEntry[] = []
    for (const c of allConfigs) {
      for (const e of parseEnvVars(c.env_vars)) {
        if (!seen.has(e.key)) {
          seen.add(e.key)
          merged.push(e)
        }
      }
    }
    return merged
  }, [agentConfig, allConfigs])

  if (!teamId || configsLoading) {
    return (
      <div className="flex flex-1 flex-col overflow-auto bg-tl-background [--code-block-bg:hsl(var(--card))]">
        <OverviewSkeleton hasAgent={!!selectedAgent} />
      </div>
    )
  }

  // No agents — show get-started content
  if (allAgents.length === 0) {
    return <GetStartedContent teamId={teamId} />
  }

  const isDeployed = !!agentConfig?.deployed_at && !!agentConfig?.bundle_hash

  return (
    <motion.div
      className="flex flex-1 flex-col overflow-auto bg-tl-background [--code-block-bg:hsl(var(--card))]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <div className="mx-auto w-full max-w-2xl flex flex-col gap-4 px-8 py-6">
        {/* ── Agent Header (only when agent selected) ── */}
        {selectedAgent && (
          <div className="flex items-center justify-between px-1">
            <div className="flex flex-col gap-0.5">
              <h1 className="text-[15px] font-semibold tracking-tight text-foreground">
                {selectedAgent.name}
              </h1>
              <div className="flex items-center gap-2">
                {isDeployed ? (
                  <>
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[11px] text-muted-foreground">
                      Deployed{" "}
                      {formatRelativeTime(new Date(agentConfig!.deployed_at!))}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                    <span className="text-[11px] text-muted-foreground">
                      Not deployed
                    </span>
                  </>
                )}
                {agentConfig?.runtime && (
                  <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {agentConfig.runtime}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {studioProjectId && (
                <button
                  onClick={() => router.push(`/agents/studio/${studioProjectId}`)}
                  className="flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors hover:bg-foreground/[0.04]"
                  title="Open this agent in Studio"
                >
                  <Wand2 className="h-3 w-3" />
                  Open in Studio
                </button>
              )}
              {(() => {
                const resolvedSlug = selectedAgent.slug || agentConfig?.slug
                return resolvedSlug
                  ? <SlugCopy slug={resolvedSlug} label="App Slug" />
                  : <SlugCopy slug={selectedAgent.id} label="Agent ID" />
              })()}
            </div>
          </div>
        )}

        {/* Aggregate Stats (last 7 days) */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[13px] font-medium">
              {selectedAgent ? "Agent Stats" : "Overview"}
            </span>
            <span className="text-[10px] text-muted-foreground/60">Last 7 days</span>
          </div>
          <div className="rounded-lg border-[0.5px] border-border bg-card overflow-hidden">
            <div className="grid grid-cols-5 divide-x divide-border/50">
              {allPagesFetched ? (
                <>
                  <div className="px-3 py-3 text-center overflow-hidden">
                    <div className="text-[15px] font-semibold tabular-nums truncate">
                      {aggregateMetrics.totalSessions.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Sessions</div>
                  </div>
                  <div className="px-3 py-3 text-center overflow-hidden">
                    <div className="text-[15px] font-semibold tabular-nums truncate">
                      {aggregateMetrics.totalThreads.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Threads</div>
                  </div>
                  <div className="px-3 py-3 text-center overflow-hidden">
                    <div className="text-[15px] font-semibold tabular-nums truncate">
                      {formatCost(aggregateMetrics.totalCost > 0 ? aggregateMetrics.totalCost : null)}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Cost</div>
                  </div>
                  <div className="px-3 py-3 text-center overflow-hidden">
                    <div className="text-[15px] font-semibold tabular-nums truncate">
                      {formatDuration(aggregateMetrics.avgDuration > 0 ? aggregateMetrics.avgDuration : null)}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Avg Duration</div>
                  </div>
                  <div className="px-3 py-3 text-center overflow-hidden">
                    <div className="text-[15px] font-semibold tabular-nums truncate">
                      {aggregateMetrics.errorRate > 0 ? `${aggregateMetrics.errorRate.toFixed(1)}%` : "0%"}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Error Rate</div>
                  </div>
                </>
              ) : (
                <>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="px-4 py-3 flex flex-col items-center gap-1.5">
                      <Skeleton className="h-4 rounded-md" style={{ width: [28, 24, 32, 28, 20][i] }} />
                      <Skeleton className="h-3 w-12 rounded-md" />
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Agents list (only when no agent selected) */}
        {!selectedAgent && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[13px] font-medium">Agents</span>
            </div>
            <div className="rounded-lg border-[0.5px] border-border bg-card overflow-hidden">
              {displayAgents.map((agent) => {
                const config = allConfigs.find((c) => c.id === agent.id)
                const agentIsDeployed = !!config?.deployed_at && !!config?.bundle_hash
                const metrics = perAgentMetrics.get(agent.id)
                const lastChat = metrics?.lastChatAt
                  ? formatRelativeTime(metrics.lastChatAt)
                  : null
                const createdAt = config?.created_at
                  ? formatRelativeTime(new Date(config.created_at))
                  : null
                const dailyThreads = metrics?.dailyThreads ?? [0, 0, 0, 0, 0, 0, 0]

                return (
                  <div
                    key={agent.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => router.push(`/agents/overview/${agent.id}`)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); router.push(`/agents/overview/${agent.id}`) } }}
                    className="an-focus-btn flex cursor-pointer items-center px-4 py-3 text-[13px] transition-colors hover:bg-muted border-b-[0.5px] border-border last:border-b-0"
                  >
                    {/* Name */}
                    <div className="min-w-0 flex-1 flex items-center gap-2.5">
                      <AgentAvatar name={agent.name} size="lg" />
                      <span className="font-medium text-foreground truncate">
                        {agent.name}
                      </span>
                    </div>

                    {/* Created / Last chat */}
                    <div className="shrink-0 flex flex-col items-end gap-0.5 mr-5" style={{ width: 110 }}>
                      <span className="text-[11px] text-muted-foreground tabular-nums">
                        {lastChat ? `Last chat ${lastChat}` : "No chats yet"}
                      </span>
                      {createdAt && (
                        <span className="text-[10px] text-muted-foreground/50 tabular-nums">
                          Created {createdAt}
                        </span>
                      )}
                    </div>

                    {/* Mini sparkline */}
                    <MiniSparkline data={dailyThreads} />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Bottom Grid: Deployments | Env Variables */}
        <div className={selectedAgent ? "grid grid-cols-2 gap-4" : ""}>
          {/* Recent Deployments */}
          <DeploymentsBlock
            teamId={teamId!}
            agentId={selectedAgent?.id}
            onViewAll={() => router.push("/agents/deployments")}
            onRowClick={(deploymentId) => router.push(`/agents/deployments/${deploymentId}`)}
          />

          {/* Env Variables — only when agent is selected */}
          {selectedAgent && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[13px] font-medium">Env Variables</span>
                <button
                  onClick={() => router.push("/agents/environment-variables")}
                  className="an-focus-btn rounded-md px-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                  type="button"
                >
                  Manage
                </button>
              </div>
              <div className="rounded-lg border-[0.5px] border-border bg-card overflow-hidden min-h-[180px] flex flex-col">
                {envEntries.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center gap-1.5">
                    <Server className="h-5 w-5 text-muted-foreground/25" />
                    <p className="text-[11px] text-muted-foreground">
                      No variables set
                    </p>
                  </div>
                ) : (
                  <div>
                    {envEntries.slice(0, 6).map((entry) => (
                      <div
                        key={entry.key}
                        className="flex items-center gap-2 px-3 h-[34px] border-b-[0.5px] border-border/50 last:border-b-0"
                      >
                        <span className="text-[11px] font-mono font-medium text-foreground truncate">
                          {entry.key}
                        </span>
                        <span className="flex-1 min-w-0 text-right text-[11px] font-mono text-muted-foreground/50 truncate">
                          {"\u2022".repeat(Math.min(entry.value.length, 12))}
                        </span>
                      </div>
                    ))}
                    {envEntries.length > 6 && (
                      <div className="px-3 py-2 border-t border-border/50">
                        <span className="text-[10px] text-muted-foreground/60">
                          +{envEntries.length - 6} more
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
