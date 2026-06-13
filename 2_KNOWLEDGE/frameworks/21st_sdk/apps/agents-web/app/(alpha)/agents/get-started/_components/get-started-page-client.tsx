"use client"

import { useMemo, useState, useCallback } from "react"
import { useAtomValue } from "jotai"
import { AgentsLink as Link } from "@/components/agents-link"
import { BookOpen } from "lucide-react"
import { SkillIcon } from "@/components/icons"
import {
  CopyIcon,
  CheckIcon,
} from "@/components/features/agents/an/docs/icons"
import { anSelectedAgentAtom } from "@/lib/atoms/an-agent"
import { selectedTeamIdAtom } from "@/lib/atoms/team"
import { api } from "@/trpc/client"
import { generateIntegrationMarkdown } from "@/components/features/agents/an/utils/generate-integration-markdown"
import { CodeBlock } from "@/components/features/agents/an/docs/code-block"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

function formatRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return date.toLocaleDateString()
}

function GetStartedSkeleton() {
  return (
    <div className="flex flex-1 flex-col overflow-auto bg-tl-background">
      <div className="mx-auto w-full max-w-2xl px-8 py-6">
        <div className="space-y-2 mb-6">
          <Skeleton className="h-4 w-36 rounded" />
          <Skeleton className="h-3 w-56 rounded" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-background p-4"
            >
              <div className="flex items-start gap-3">
                <Skeleton className="h-5 w-5 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-20 rounded" />
                  <Skeleton className="h-3 w-full rounded" />
                  <Skeleton className="h-7 w-28 rounded-md mt-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StepCard({
  number,
  title,
  description,
  completed,
  optional,
  children,
}: {
  number: number
  title: string
  description: string
  completed?: boolean
  optional?: boolean
  children?: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-medium",
            completed
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "bg-foreground/5 text-muted-foreground",
          )}
        >
          {completed ? <CheckIcon className="h-3 w-3" /> : number}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-[13px] font-medium text-foreground">{title}</h3>
            {optional && (
              <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                Optional
              </span>
            )}
          </div>
          <p className="mt-0.5 text-[12px] text-muted-foreground leading-relaxed">
            {description}
          </p>
          {children}
        </div>
      </div>
    </div>
  )
}

export function GetStartedPageClient() {
  const selectedAgent = useAtomValue(anSelectedAgentAtom)
  const teamId = useAtomValue(selectedTeamIdAtom)
  const [copied, setCopied] = useState(false)

  const { data: config, isLoading: configLoading } =
    api.agentConfigs.getConfig.useQuery(
      { id: selectedAgent?.id! },
      {
        enabled: !!selectedAgent?.id,
        refetchInterval: (query) => {
          const data = query.state.data
          if (data?.activeDeployment) return false
          return 10_000
        },
      },
    )

  const slug = selectedAgent?.slug || "my-agent"

  const markdown = useMemo(
    () => generateIntegrationMarkdown(slug, undefined, null),
    [slug],
  )

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2_000)
  }, [markdown])

  const isDeployed = !!config?.activeDeployment

  if (!teamId || !selectedAgent || configLoading) {
    return <GetStartedSkeleton />
  }

  return (
    <div className="flex flex-1 flex-col overflow-auto bg-tl-background">
      <div className="mx-auto w-full max-w-2xl px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[15px] font-semibold tracking-tight text-foreground">
            Set up your agent
          </h1>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            Follow these steps to integrate and deploy{" "}
            <span className="font-medium text-foreground">
              {selectedAgent.name}
            </span>
            .
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {/* Step 1: Integrate */}
          <StepCard
            number={1}
            title="Integrate"
            description="Copy the integration prompt and give it to your AI coding assistant (Claude Code, Cursor, etc.)."
            completed={isDeployed}
          >
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={handleCopy}
                className="relative inline-flex h-7 items-center overflow-hidden rounded-md bg-foreground px-3 text-[11px] font-medium text-background transition-[background-color,transform] duration-150 ease-out hover:bg-foreground/90 active:scale-[0.97]"
              >
                <span
                  className={cn(
                    "flex items-center gap-1.5 transition-[opacity,transform] duration-200 ease-out",
                    copied
                      ? "-translate-y-full opacity-0"
                      : "translate-y-0 opacity-100",
                  )}
                >
                  <CopyIcon className="h-3 w-3" />
                  Copy prompt
                </span>
                <span
                  className={cn(
                    "absolute inset-0 flex items-center justify-center transition-[opacity,transform] duration-200 ease-out",
                    copied
                      ? "translate-y-0 opacity-100"
                      : "translate-y-full opacity-0",
                  )}
                >
                  <CheckIcon className="h-3 w-3" />
                </span>
              </button>
              <Link
                href="/agents/docs/get-started"
                target="_blank"
                className="inline-flex h-7 items-center gap-1.5 rounded-md px-3 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:scale-[0.97]"
              >
                <BookOpen className="h-3 w-3" />
                Open docs
              </Link>
            </div>
          </StepCard>

          {/* Step 2: Deploy */}
          <StepCard
            number={2}
            title="Deploy"
            description={
              isDeployed && config?.activeDeployment?.deployed_at
                ? `Deployed ${formatRelativeTime(new Date(config.activeDeployment.deployed_at))}.`
                : "Deploy your agent using the CLI."
            }
            completed={isDeployed}
          >
            {!isDeployed && (
              <div className="mt-3">
                <CodeBlock
                  code="npx @21st-sdk/cli deploy"
                  language="bash"
                  showPrompt
                  className="!overflow-x-auto"
                />
              </div>
            )}
          </StepCard>

          {/* Step 3: Configure Skills */}
          <StepCard
            number={3}
            title="Configure Skills"
            description="Add skills to extend your agent's capabilities with custom instructions."
            optional
          >
            <div className="mt-3">
              <Link
                href="/agents/skills"
                className="inline-flex h-7 items-center gap-1.5 rounded-md bg-foreground px-3 text-[11px] font-medium text-background transition-[background-color,transform] duration-150 ease-out hover:bg-foreground/90 active:scale-[0.97]"
              >
                <SkillIcon className="h-3 w-3" />
                Go to Skills
              </Link>
            </div>
          </StepCard>
        </div>
      </div>
    </div>
  )
}
