"use client"

import {
  type ComponentType,
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Chat, useChat } from "ai-latest-react"
import { DefaultChatTransport, type UIMessage } from "ai-latest"
import { AnAgentChat, type CustomToolRendererProps } from "@21st-sdk/react"
import { WizardEmptyState } from "../../../_components/wizard-empty-state"
import { WizardSendContext } from "../../../_components/wizard-send-context"
import {
  StudioCodePreview,
  getStudioFileLanguageLabel,
} from "./studio-code-preview"
import { SidebarTimelineView } from "../../../threads/_components/sidebar-timeline-view"
import { TraceView } from "../../../threads/_components/trace-view"
import { anStudioProjectAtom } from "@/lib/atoms/an-agent"
import { useSetAtom } from "jotai"
import {
  AlertTriangle,
  ArrowUpRight,
  BookOpen,
  Bot,
  Check,
  ChevronRight,
  Code2,
  Copy,
  FileText,
  Gauge,
  Loader2,
  MessageSquare,
  Play,
  Rocket,
  Shield,
  Wrench,
} from "lucide-react"
import { getFileIconByExtension } from "@/app/(onecode)/(alpha)/1code/{features}/mentions/agents-file-mention"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { api } from "@/trpc/client"
import { CodeBlock } from "@/components/features/agents/an/docs/code-block"
import { generateIntegrationMarkdown } from "@/components/features/agents/an/utils/generate-integration-markdown"
import { capture21stAgentsEvent } from "@/lib/posthog-21st-agents"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const RELAY_URL = process.env.NEXT_PUBLIC_RELAY_URL || "https://relay.an.dev"

type SessionInfo = {
  sandboxId: string
  threadId: string
  wizardSlug: string
  expiresAt: number
  initialMessages: UIMessage[]
  project: {
    id: string
    teamId: string
    name: string
    deployedSlug: string
    deployedAgentId: string | null
    hasDeployment: boolean
  }
}

type StudioStep = 1 | 2 | 3
type BuildView = "overview" | "code"
type QueuedWizardPrompt = { id: number; text: string } | null

type ErrorKind =
  | "not_found"
  | "forbidden"
  | "no_workspace"
  | "sandbox_unavailable"
  | "not_provisioned"
  | "unknown"

type SessionState =
  | { status: "idle" }
  | { status: "provisioning" }
  | { status: "ready"; session: SessionInfo }
  | {
      status: "error"
      code: number
      message: string
      kind: ErrorKind
    }

const StudioProjectContext = createContext<SessionInfo["project"] | null>(null)
const StudioActionsContext = createContext<{ openPlay: () => void }>({
  openPlay: () => {},
})

function errorKindFromResponse(code: number, reason?: string): ErrorKind {
  if (reason === "workspace_empty") return "no_workspace"
  if (reason === "sandbox_unavailable") return "sandbox_unavailable"
  if (reason === "not_provisioned") return "not_provisioned"
  if (code === 404) return "not_found"
  if (code === 403) return "forbidden"
  if (code === 409) return "no_workspace"
  if (code === 503) return "not_provisioned"
  return "unknown"
}

type TreeNode = {
  name: string
  path: string
  children: Record<string, TreeNode>
}

function buildTree(paths: string[]): TreeNode {
  const root: TreeNode = { name: "", path: "", children: {} }
  for (const filePath of paths) {
    const parts = filePath.split("/")
    let current = root
    let accumulated = ""
    for (const part of parts) {
      accumulated = accumulated ? `${accumulated}/${part}` : part
      if (!current.children[part]) {
        current.children[part] = { name: part, path: accumulated, children: {} }
      }
      current = current.children[part]
    }
  }
  return root
}

function getPreferredFilePath(paths: string[]): string | null {
  const agentEntry = paths.find((path) =>
    /^agents\/[^/]+\/index\.ts$/.test(path),
  )
  if (agentEntry) return agentEntry

  const anyIndex = paths.find((path) => path.endsWith("/index.ts"))
  if (anyIndex) return anyIndex

  return paths[0] ?? null
}

type BuildOverviewData = {
  paths: string[]
  entryPath: string | null
  entryCode: string
  model: string | null
  runtime: string | null
  permissionMode: string | null
  maxTurns: string | null
  maxBudgetUsd: string | null
  systemPrompt: string | null
  toolNames: string[]
  skillNames: string[]
  mcpServerNames: string[]
  hasSandboxConfig: boolean
  loading: boolean
}

function decodeEscapedString(value: string) {
  return value
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, "\\")
}

function cleanSummaryText(value: string) {
  return value.replace(/\s+/g, " ").trim()
}

function extractFieldString(source: string, fieldName: string): string | null {
  const templateMatch = source.match(
    new RegExp(`${fieldName}\\s*:\\s*\`([\\s\\S]*?)\``, "m"),
  )
  if (templateMatch?.[1]) return templateMatch[1].trim()

  const doubleQuotedMatch = source.match(
    new RegExp(`${fieldName}\\s*:\\s*"((?:\\\\.|[^"])*)"`, "m"),
  )
  if (doubleQuotedMatch?.[1])
    return decodeEscapedString(doubleQuotedMatch[1]).trim()

  const singleQuotedMatch = source.match(
    new RegExp(`${fieldName}\\s*:\\s*'((?:\\\\.|[^'])*)'`, "m"),
  )
  if (singleQuotedMatch?.[1])
    return decodeEscapedString(singleQuotedMatch[1]).trim()

  const joinMatch = source.match(
    new RegExp(
      `${fieldName}\\s*:\\s*\\[([\\s\\S]*?)\\]\\.join\\([^)]*\\)`,
      "m",
    ),
  )
  if (joinMatch?.[1]) {
    const parts = [
      ...joinMatch[1].matchAll(
        /"((?:\\.|[^"])*)"|'((?:\\.|[^'])*)'|`([\s\S]*?)`/g,
      ),
    ]
      .map((match) => match[1] ?? match[2] ?? match[3] ?? "")
      .map((part) => decodeEscapedString(part).trim())
      .filter(Boolean)
    if (parts.length > 0) return parts.join("\n\n")
  }

  return null
}

function extractFieldNumber(source: string, fieldName: string): string | null {
  const match = source.match(
    new RegExp(`${fieldName}\\s*:\\s*([0-9_]+(?:\\.[0-9_]+)?)`, "m"),
  )
  if (!match?.[1]) return null
  return match[1].replace(/_/g, "")
}

function extractFieldEnum(source: string, fieldName: string): string | null {
  return extractFieldString(source, fieldName)
}

function extractToolNames(source: string) {
  const names = new Set<string>()

  for (const match of source.matchAll(
    /\bconst\s+([a-zA-Z_][\w]*)\s*=\s*tool\(/g,
  )) {
    if (match[1]) names.add(match[1])
  }

  const toolsBlock = source.match(/tools\s*:\s*\{([\s\S]*?)\n\s*\}/m)?.[1]
  if (toolsBlock) {
    for (const match of toolsBlock.matchAll(/([a-zA-Z_][\w]*)\s*[:,]/g)) {
      if (match[1]) names.add(match[1])
    }
  }

  return [...names]
}

function extractPromptDetails(systemPrompt: string | null) {
  if (!systemPrompt) {
    return {
      summary: "Uses the default Claude Code preset prompt.",
      bullets: [] as string[],
    }
  }

  const lines = systemPrompt
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

  const bulletLines = lines
    .filter((line) => /^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line))
    .map((line) => line.replace(/^[-*]\s+/, "").replace(/^\d+\.\s+/, ""))
    .slice(0, 3)

  const summary =
    cleanSummaryText(
      lines.find((line) => !/^[-*]\s+/.test(line) && !/^\d+\.\s+/.test(line)) ??
        "",
    ) ||
    cleanSummaryText(lines[0] ?? "") ||
    "Custom system prompt configured."

  return { summary, bullets: bulletLines }
}

function useBuildOverview(
  projectId: string,
  refreshTick: number,
): BuildOverviewData {
  const [paths, setPaths] = useState<string[]>([])
  const [entryCode, setEntryCode] = useState("")
  const [mcpServerNames, setMcpServerNames] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const abortController = new AbortController()

    void (async () => {
      if (paths.length === 0) setLoading(true)

      try {
        const filesRes = await fetch(
          `/api/studio/projects/${projectId}/files`,
          {
            signal: abortController.signal,
          },
        )
        if (!filesRes.ok) return

        const filesData = (await filesRes.json()) as { files: string[] }
        const nextPaths = filesData.files
        setPaths(nextPaths)

        const entryPath = getPreferredFilePath(nextPaths)
        if (entryPath) {
          const encodedEntryPath = entryPath
            .split("/")
            .map(encodeURIComponent)
            .join("/")
          const entryRes = await fetch(
            `/api/studio/projects/${projectId}/files/${encodedEntryPath}`,
            { signal: abortController.signal },
          )
          if (entryRes.ok) {
            const entryData = (await entryRes.json()) as { content: string }
            setEntryCode(entryData.content)
          }
        }

        const mcpPath = nextPaths.find((path) => path.endsWith(".mcp.json"))
        if (!mcpPath) {
          setMcpServerNames([])
          return
        }

        const encodedMcpPath = mcpPath
          .split("/")
          .map(encodeURIComponent)
          .join("/")
        const mcpRes = await fetch(
          `/api/studio/projects/${projectId}/files/${encodedMcpPath}`,
          {
            signal: abortController.signal,
          },
        )
        if (!mcpRes.ok) {
          setMcpServerNames([])
          return
        }

        const mcpData = (await mcpRes.json()) as { content: string }
        try {
          const parsed = JSON.parse(mcpData.content) as {
            mcpServers?: Record<string, unknown>
          }
          setMcpServerNames(Object.keys(parsed.mcpServers ?? {}))
        } catch {
          setMcpServerNames([])
        }
      } catch {
        // Best-effort summary only.
      } finally {
        setLoading(false)
      }
    })()

    return () => abortController.abort()
  }, [paths.length, projectId, refreshTick])

  const entryPath = useMemo(() => getPreferredFilePath(paths), [paths])
  const skillNames = useMemo(() => {
    const skills = new Set<string>()
    for (const path of paths) {
      const match = path.match(/\.claude\/skills\/([^/]+)\/SKILL\.md$/)
      if (match?.[1]) {
        skills.add(
          match[1]
            .split(/[-_]/g)
            .filter(Boolean)
            .map((part) => part[0]?.toUpperCase() + part.slice(1))
            .join(" "),
        )
      }
    }
    return [...skills]
  }, [paths])

  return {
    paths,
    entryPath,
    entryCode,
    model: extractFieldString(entryCode, "model"),
    runtime: extractFieldEnum(entryCode, "runtime"),
    permissionMode: extractFieldEnum(entryCode, "permissionMode"),
    maxTurns: extractFieldNumber(entryCode, "maxTurns"),
    maxBudgetUsd: extractFieldNumber(entryCode, "maxBudgetUsd"),
    systemPrompt: extractFieldString(entryCode, "systemPrompt"),
    toolNames: extractToolNames(entryCode),
    skillNames,
    mcpServerNames,
    hasSandboxConfig: /\bsandbox\s*:\s*Sandbox\(/.test(entryCode),
    loading,
  }
}

const STUDIO_STEPS = [
  {
    num: 1 as StudioStep,
    label: "Build",
    caption: "Shape the code and deploy",
  },
  {
    num: 2 as StudioStep,
    label: "Test",
    caption: "Test the live agent",
  },
  {
    num: 3 as StudioStep,
    label: "Integrate",
    caption: "Drop it into your app",
  },
] as const

const PLAY_PROMPT_SUGGESTIONS = [
  "Introduce yourself and what you can help with.",
  "Give me one example task you handle well.",
  "What inputs or context do you expect from me?",
]

function StudioStepper({
  activeStep,
  canOpenPlay,
  canOpenIntegrate,
  onSelect,
}: {
  activeStep: StudioStep
  canOpenPlay: boolean
  canOpenIntegrate: boolean
  onSelect: (step: StudioStep) => void
}) {
  return (
    <div className="flex items-center gap-0.5">
      {STUDIO_STEPS.map((step, index) => {
        const isAccessible =
          step.num === 1 || (step.num === 2 ? canOpenPlay : canOpenIntegrate)
        const isComplete = step.num < activeStep && isAccessible
        const isActive = step.num === activeStep

        const lockedReason =
          step.num === 2
            ? "Deploy your agent first to talk to it live."
            : "Deploy your agent first to grab integration code."
        const tooltipText = isAccessible ? step.caption : lockedReason

        return (
          <div key={step.num} className="flex items-center gap-0.5">
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-disabled={!isAccessible}
                  onClick={() => {
                    if (!isAccessible) return
                    onSelect(step.num)
                  }}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-2.5 py-1 text-[12px] transition-colors",
                    isActive
                      ? "bg-foreground/10 text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    !isAccessible &&
                      "cursor-not-allowed opacity-45 hover:bg-transparent hover:text-muted-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-medium transition-colors",
                      isComplete || isActive
                        ? "bg-foreground text-background"
                        : "bg-foreground/10 text-muted-foreground",
                    )}
                  >
                    {isComplete ? <Check className="h-2.5 w-2.5" /> : step.num}
                  </span>
                  <span className="font-medium">{step.label}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={6}>
                {tooltipText}
              </TooltipContent>
            </Tooltip>
            {index < STUDIO_STEPS.length - 1 && (
              <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/40" />
            )}
          </div>
        )
      })}
    </div>
  )
}

function BuildViewSwitcher({
  value,
  onChange,
}: {
  value: BuildView
  onChange: (value: BuildView) => void
}) {
  const views: { value: BuildView; label: string }[] = [
    { value: "overview", label: "Overview" },
    { value: "code", label: "Code" },
  ]

  return (
    <div className="flex shrink-0 items-center gap-0.5 border-b border-border bg-background px-2 py-1.5">
      {views.map((view) => (
        <button
          key={view.value}
          type="button"
          onClick={() => onChange(view.value)}
          className={cn(
            "rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors duration-150",
            value === view.value
              ? "bg-foreground/10 text-foreground"
              : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground",
          )}
        >
          {view.label}
        </button>
      ))}
    </div>
  )
}

function TreeView({
  node,
  onSelect,
  selectedPath,
  depth = 0,
}: {
  node: TreeNode
  onSelect: (path: string) => void
  selectedPath: string | null
  depth?: number
}) {
  const [expanded, setExpanded] = useState(true)
  const entries = Object.values(node.children).sort((a, b) => {
    const aHasChildren = Object.keys(a.children).length > 0
    const bHasChildren = Object.keys(b.children).length > 0
    if (aHasChildren !== bHasChildren) return aHasChildren ? -1 : 1
    return a.name.localeCompare(b.name)
  })

  if (node.name === "" && entries.length === 0) {
    return (
      <p className="px-2 py-1 text-[11px] text-muted-foreground/60">
        (empty workspace)
      </p>
    )
  }

  const isFolder = Object.keys(node.children).length > 0

  return (
    <>
      {node.name !== "" && (
        <button
          onClick={() => {
            if (isFolder) {
              setExpanded((value) => !value)
              return
            }
            onSelect(node.path)
          }}
          className={cn(
            "w-full flex items-center gap-1.5 px-1.5 text-left text-xs rounded-sm cursor-pointer transition-colors",
            isFolder ? "py-0.5" : "py-1",
            selectedPath === node.path
              ? "bg-muted"
              : "hover:bg-accent/50",
          )}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          {isFolder ? (
            <ChevronRight
              className={cn(
                "size-2.5 shrink-0 text-muted-foreground transition-transform duration-150",
                expanded && "rotate-90",
              )}
            />
          ) : (
            (() => {
              const FileIcon = getFileIconByExtension(node.name)
              return FileIcon ? (
                <FileIcon className="h-3.5 w-3.5 shrink-0" />
              ) : (
                <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              )
            })()
          )}
          <span className="truncate">{node.name}</span>
        </button>
      )}
      {expanded &&
        entries.map((child) => (
          <TreeView
            key={child.path}
            node={child}
            onSelect={onSelect}
            selectedPath={selectedPath}
            depth={node.name === "" ? depth : depth + 1}
          />
        ))}
    </>
  )
}

function FileTreePanel({
  projectId,
  refreshTick,
}: {
  projectId: string
  refreshTick: number
}) {
  const [paths, setPaths] = useState<string[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [fileContent, setFileContent] = useState("")
  const [copied, setCopied] = useState(false)
  const fileCacheRef = useRef<Record<string, string>>({})
  const copyResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const abortController = new AbortController()
    void (async () => {
      const isInitialLoad = paths.length === 0
      if (isInitialLoad) {
        setInitialLoading(true)
      }

      try {
        const res = await fetch(`/api/studio/projects/${projectId}/files`, {
          signal: abortController.signal,
        })
        if (!res.ok) return
        const data = (await res.json()) as { files: string[] }
        setPaths(data.files)
      } catch {
        // Best-effort refresh only.
      } finally {
        if (isInitialLoad) {
          setInitialLoading(false)
        }
      }
    })()
    return () => abortController.abort()
  }, [projectId, refreshTick])

  useEffect(() => {
    if (paths.length === 0) {
      setSelectedPath(null)
      return
    }

    if (selectedPath && paths.includes(selectedPath)) return

    setSelectedPath(getPreferredFilePath(paths))
  }, [paths, selectedPath])

  useEffect(() => {
    setCopied(false)
  }, [selectedPath])

  useEffect(() => {
    return () => {
      if (copyResetTimeoutRef.current) {
        clearTimeout(copyResetTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!selectedPath) {
      setFileContent("")
      return
    }

    const cachedContent = fileCacheRef.current[selectedPath]
    setFileContent(cachedContent ?? "")

    const abortController = new AbortController()
    void (async () => {
      try {
        const encodedPath = selectedPath
          .split("/")
          .map(encodeURIComponent)
          .join("/")
        const res = await fetch(
          `/api/studio/projects/${projectId}/files/${encodedPath}`,
          {
            signal: abortController.signal,
          },
        )
        if (!res.ok) {
          const failureText = `// Failed to load: ${res.status}`
          fileCacheRef.current[selectedPath] = failureText
          setFileContent(failureText)
          return
        }

        const data = (await res.json()) as { content: string }
        fileCacheRef.current[selectedPath] = data.content
        setFileContent(data.content)
      } catch {
        // Best-effort refresh only.
      }
    })()
    return () => abortController.abort()
  }, [projectId, refreshTick, selectedPath])

  const tree = useMemo(() => buildTree(paths), [paths])

  const handleCopyFile = useCallback(async () => {
    if (!selectedPath || !fileContent) return

    try {
      await navigator.clipboard.writeText(fileContent)
      setCopied(true)

      if (copyResetTimeoutRef.current) {
        clearTimeout(copyResetTimeoutRef.current)
      }

      copyResetTimeoutRef.current = setTimeout(() => {
        setCopied(false)
      }, 1800)
    } catch {
      setCopied(false)
    }
  }, [fileContent, selectedPath])

  return (
    <div className="flex flex-1 min-h-0 flex-col">
      <div className="flex flex-1 min-h-0">
        <div className="w-[200px] shrink-0 overflow-y-auto border-r border-border">
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-border">
            <span className="text-[11px] font-medium text-foreground">Files</span>
            <span className="text-[10px] text-muted-foreground/60 tabular-nums">
              {initialLoading
                ? "..."
                : paths.length}
            </span>
          </div>
          <div className="py-0.5">
            {initialLoading ? (
              <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                Loading...
              </div>
            ) : (
              <TreeView
                node={tree}
                onSelect={setSelectedPath}
                selectedPath={selectedPath}
              />
            )}
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          {selectedPath ? (
            <>
              <div className="flex shrink-0 items-center gap-3 border-b border-border bg-muted/50 px-3 py-1.5">
                <div className="flex flex-1 items-center gap-2 min-w-0 font-mono text-xs">
                  {(() => {
                    const fileName = selectedPath.split("/").pop() || selectedPath
                    const dirPath = selectedPath.includes("/")
                      ? selectedPath.substring(0, selectedPath.lastIndexOf("/"))
                      : null
                    const FileIcon = getFileIconByExtension(fileName)
                    return (
                      <>
                        {FileIcon ? (
                          <FileIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        ) : (
                          <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        )}
                        <span className="font-medium text-foreground truncate">
                          {fileName}
                        </span>
                        {dirPath && (
                          <span className="text-muted-foreground truncate text-[11px]">
                            {dirPath}
                          </span>
                        )}
                      </>
                    )
                  })()}
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <span className="rounded bg-foreground/[0.06] px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {getStudioFileLanguageLabel(selectedPath)}
                  </span>
                  <button
                    onClick={() => void handleCopyFile()}
                    className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    aria-label={
                      copied ? "Copied file contents" : "Copy file contents"
                    }
                    title={copied ? "Copied" : "Copy"}
                  >
                    {copied ? (
                      <Check className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>
              <div className="min-h-0 flex-1 overflow-auto bg-background">
                <StudioCodePreview code={fileContent} path={selectedPath} />
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-[11px] text-muted-foreground/60">
              Select a file to view its contents
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SpecRow({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  value: ReactNode
}) {
  return (
    <div className="flex items-start gap-2.5 py-2">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground/70">
          {label}
        </p>
        <div className="mt-0.5 text-[12px] text-foreground">{value}</div>
      </div>
    </div>
  )
}

function SpecGroup({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div>
      <p className="mb-1 text-[11px] font-medium text-foreground">{title}</p>
      <div className="grid gap-x-6 rounded-xl border border-border bg-background/80 px-4 py-1 sm:grid-cols-2">
        {children}
      </div>
    </div>
  )
}

function WizardActivityTimeline({
  status,
}: {
  status: "submitted" | "streaming"
}) {
  const [visibleSteps, setVisibleSteps] = useState(0)

  const steps = useMemo(
    () => [
      { label: "Reading project files", icon: FileText },
      { label: "Analyzing agent configuration", icon: Bot },
      { label: "Generating changes", icon: Code2 },
    ],
    [],
  )

  useEffect(() => {
    setVisibleSteps(0)
    const timers: ReturnType<typeof setTimeout>[] = []
    for (let i = 0; i < steps.length; i++) {
      timers.push(setTimeout(() => setVisibleSteps(i + 1), 600 + i * 1200))
    }
    return () => timers.forEach(clearTimeout)
  }, [steps.length])

  return (
    <div className="rounded-xl border border-border bg-background/80 overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border/60 px-4 py-2.5">
        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
        <span className="text-[12px] font-medium text-foreground">
          {status === "submitted" ? "Preparing..." : "Generating..."}
        </span>
      </div>
      <div className="px-4 py-3 space-y-0">
        {steps.map((step, i) => {
          const isVisible = i < visibleSteps
          const isLast = i === visibleSteps - 1
          const StepIcon = step.icon
          return (
            <div
              key={step.label}
              className={cn(
                "flex items-center gap-2.5 py-1.5 transition-all duration-300",
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-1",
              )}
            >
              <div className="relative flex flex-col items-center">
                {i > 0 && (
                  <div
                    className={cn(
                      "absolute bottom-full w-px h-3",
                      isLast ? "bg-blue-400/50" : "bg-border",
                    )}
                  />
                )}
                <div
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-md",
                    isLast
                      ? "bg-blue-500/15 text-blue-500"
                      : "bg-foreground/[0.06] text-muted-foreground",
                  )}
                >
                  {isLast ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <StepIcon className="h-3 w-3" />
                  )}
                </div>
              </div>
              <span
                className={cn(
                  "text-[12px]",
                  isLast
                    ? "text-foreground font-medium"
                    : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
              {isLast && (
                <span className="text-[10px] text-muted-foreground/60 ml-auto">
                  now
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function BuildOverviewPanel({
  projectId,
  project,
  refreshTick,
  onQueuePrompt,
  onOpenCode,
  onOpenPlay,
  wizardStatus,
}: {
  projectId: string
  project: SessionInfo["project"]
  refreshTick: number
  onQueuePrompt: (prompt: string) => void
  onOpenCode: () => void
  onOpenPlay: () => void
  wizardStatus: "ready" | "submitted" | "streaming"
}) {
  const overview = useBuildOverview(projectId, refreshTick)
  const { data, isLoading } = api.agentConfigs.listDeployments.useQuery(
    { agentId: project.deployedAgentId ?? "", limit: 1 },
    { enabled: !!project.deployedAgentId },
  )

  const latestDeployment = data?.deployments?.[0]
  const deploymentLabel = !project.hasDeployment
    ? "Not deployed"
    : isLoading
      ? "Checking latest deploy..."
      : latestDeployment
        ? `v${latestDeployment.version} · ${latestDeployment.status}`
        : "Live"
  const promptDetails = extractPromptDetails(overview.systemPrompt)
  const toolsLabel =
    overview.toolNames.length > 0
      ? overview.toolNames.join(", ")
      : "No custom tools yet"
  const skillsLabel =
    overview.skillNames.length > 0
      ? overview.skillNames.join(", ")
      : "No skills attached"
  const connectionsLabel =
    overview.mcpServerNames.length > 0
      ? overview.mcpServerNames.join(", ")
      : "No external MCP connections"

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <p className="text-[13px] font-medium text-foreground">Overview</p>
          {(wizardStatus === "submitted" || wizardStatus === "streaming") && (
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
              Wizard is working...
            </div>
          )}
        </div>
        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
          Understand how the agent is configured without reading raw TypeScript
          first.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[820px] space-y-6 px-6 py-6">
          {/* Wizard activity timeline (shown when generating) */}
          {(wizardStatus === "submitted" || wizardStatus === "streaming") && (
            <WizardActivityTimeline status={wizardStatus} />
          )}

          {/* Hero — prompt + actions */}
          <div className="rounded-2xl border border-border bg-background/80">
            <div className="flex items-start gap-3 px-5 py-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-foreground/[0.06] text-foreground">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">
                  System prompt
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-foreground">
                  {overview.loading
                    ? "Reading the agent entrypoint..."
                    : promptDetails.summary}
                </p>
                {promptDetails.bullets.length > 0 && (
                  <ul className="mt-2 space-y-1 text-[12px] leading-relaxed text-muted-foreground">
                    {promptDetails.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2">
                        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 px-5 py-3">
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    project.hasDeployment
                      ? "bg-emerald-500"
                      : "bg-muted-foreground/40",
                  )}
                />
                {project.hasDeployment
                  ? `${deploymentLabel} · ${project.deployedSlug}`
                  : "Not deployed yet"}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    onQueuePrompt(
                      "Review the current system prompt. Tighten it up so the agent's role, tone, and key rules are clearer, then explain the change briefly.",
                    )
                  }
                >
                  <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                  Refine prompt
                </Button>
                {project.hasDeployment ? (
                  <Button size="sm" onClick={onOpenPlay}>
                    <Play className="mr-1.5 h-3.5 w-3.5" />
                    Test it
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() =>
                      onQueuePrompt(
                        "Deploy the current project now. After it finishes, tell me exactly what changed and what I should test first.",
                      )
                    }
                  >
                    <Rocket className="mr-1.5 h-3.5 w-3.5" />
                    Deploy now
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Runtime spec */}
          <SpecGroup title="Runtime">
            <SpecRow
              icon={Bot}
              label="Model"
              value={overview.model ?? "claude-sonnet-4-6"}
            />
            <SpecRow
              icon={Rocket}
              label="Runtime"
              value={overview.runtime ?? "claude-code"}
            />
            <SpecRow
              icon={Shield}
              label="Permission mode"
              value={overview.permissionMode ?? "default"}
            />
            <SpecRow
              icon={Gauge}
              label="Max turns"
              value={overview.maxTurns ?? "50"}
            />
            <SpecRow
              icon={Gauge}
              label="Budget"
              value={
                overview.maxBudgetUsd
                  ? `$${overview.maxBudgetUsd}`
                  : "No explicit cap"
              }
            />
            <SpecRow
              icon={FileText}
              label="Entry file"
              value={
                <code className="font-mono text-[11px]">
                  {overview.entryPath ?? "Not found"}
                </code>
              }
            />
          </SpecGroup>

          {/* Capabilities spec */}
          <SpecGroup title="Capabilities">
            <SpecRow
              icon={Wrench}
              label="Custom tools"
              value={toolsLabel}
            />
            <SpecRow
              icon={Wrench}
              label="MCP connections"
              value={connectionsLabel}
            />
            <SpecRow
              icon={Shield}
              label="Sandbox"
              value={
                overview.hasSandboxConfig
                  ? "Custom sandbox config present"
                  : "Default sandbox only"
              }
            />
            <SpecRow
              icon={BookOpen}
              label="Skills"
              value={skillsLabel}
            />
          </SpecGroup>

          {/* Footer — quick actions to chat */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-border bg-muted/20 px-4 py-3">
            <p className="text-[12px] text-muted-foreground">
              Want to change behaviour, tools, or limits? Ask the builder.
            </p>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  onQueuePrompt(
                    "Review this agent and suggest the single highest-value capability or tool to add next. If it's obvious, implement it.",
                  )
                }
              >
                <Wrench className="mr-1.5 h-3.5 w-3.5" />
                Suggest next tool
              </Button>
              <Button size="sm" variant="outline" onClick={onOpenCode}>
                <Code2 className="mr-1.5 h-3.5 w-3.5" />
                Open code
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function extractToolOutputText(output: unknown): string {
  if (typeof output === "string") return output
  if (output && typeof output === "object" && "text" in output) {
    const text = (output as { text?: unknown }).text
    if (typeof text === "string") return text
  }
  if (output == null) return ""
  return JSON.stringify(output)
}

function parseDeployToolOutput(output: unknown, fallbackSlug?: string) {
  if (output && typeof output === "object" && !Array.isArray(output)) {
    const payload = output as {
      ok?: unknown
      slug?: unknown
      version?: unknown
      exitCode?: unknown
      summary?: unknown
      preview?: unknown
      logPath?: unknown
    }

    return {
      text: typeof payload.preview === "string" ? payload.preview : "",
      exitCode:
        typeof payload.exitCode === "number"
          ? payload.exitCode
          : typeof payload.exitCode === "string"
            ? Number(payload.exitCode)
            : null,
      slug:
        typeof payload.slug === "string"
          ? payload.slug
          : (fallbackSlug ?? null),
      version:
        typeof payload.version === "number"
          ? payload.version
          : typeof payload.version === "string"
            ? Number(payload.version)
            : null,
      summary: typeof payload.summary === "string" ? payload.summary : "",
      logPath: typeof payload.logPath === "string" ? payload.logPath : null,
      failed:
        typeof payload.ok === "boolean"
          ? !payload.ok
          : Boolean(
              (typeof payload.exitCode === "number" &&
                payload.exitCode !== 0) ||
                (typeof payload.summary === "string" &&
                  /failed|error/i.test(payload.summary)),
            ),
    }
  }

  const text = extractToolOutputText(output)
  const exitMatch = text.match(/exit\s+(\d+)/i)
  const deployedMatch = text.match(/([a-z0-9-]+)\s+deployed(?:\s+\(v(\d+)\))?/i)
  const versionOnlyMatch = text.match(/\(v(\d+)\)/i)

  const exitCode = exitMatch ? Number(exitMatch[1]) : null
  const slug = deployedMatch?.[1] ?? fallbackSlug ?? null
  const version = deployedMatch?.[2]
    ? Number(deployedMatch[2])
    : versionOnlyMatch?.[1]
      ? Number(versionOnlyMatch[1])
      : null

  const summary =
    text
      .split("\n")
      .map((line) => line.trim())
      .find(
        (line) =>
          Boolean(line) &&
          !line.startsWith("exit ") &&
          !line.startsWith("--- output ---") &&
          !line.startsWith("--- errors ---"),
      ) ?? ""

  return {
    text,
    exitCode,
    slug,
    version,
    summary,
    logPath: null,
    failed:
      (typeof exitCode === "number" && exitCode !== 0) ||
      /failed to deploy|deploy failed|error/i.test(text),
  }
}

function StudioDeployToolCard({ output, status }: CustomToolRendererProps) {
  const project = useContext(StudioProjectContext)
  const { openPlay } = useContext(StudioActionsContext)

  const parsed = useMemo(
    () => parseDeployToolOutput(output, project?.deployedSlug),
    [output, project?.deployedSlug],
  )

  const deploymentState =
    status === "pending" || status === "streaming"
      ? "building"
      : status === "error" || parsed.failed
        ? "failed"
        : "live"

  const slug = parsed.slug ?? project?.deployedSlug ?? "agent"
  const versionLabel = parsed.version != null ? ` · v${parsed.version}` : ""

  const lastDeployStateRef = useRef<typeof deploymentState | null>(null)
  useEffect(() => {
    if (lastDeployStateRef.current === deploymentState) return
    lastDeployStateRef.current = deploymentState
    const eventName =
      deploymentState === "building"
        ? "studio_deploy_started"
        : deploymentState === "live"
          ? "studio_deploy_succeeded"
          : "studio_deploy_failed"
    capture21stAgentsEvent(eventName, {
      project_id: project?.id,
      slug,
      version: parsed.version,
      exit_code: parsed.exitCode,
    })
  }, [deploymentState, project?.id, slug, parsed.version, parsed.exitCode])

  const variant =
    deploymentState === "live"
      ? {
          Icon: Check,
          iconWrap: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
          title: "Deployed",
          subtitle: `${slug}${versionLabel} is live and ready to test.`,
          pill: {
            label: "Live",
            className:
              "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
            dot: "bg-emerald-500",
          },
        }
      : deploymentState === "failed"
        ? {
            Icon: AlertTriangle,
            iconWrap: "bg-destructive/10 text-destructive",
            title: "Deploy failed",
            subtitle:
              parsed.summary ||
              "Something went wrong. Check the chat above for the error.",
            pill: {
              label: "Failed",
              className:
                "border-destructive/20 bg-destructive/10 text-destructive",
              dot: "bg-destructive",
            },
          }
        : {
            Icon: Loader2,
            iconWrap: "bg-muted text-muted-foreground",
            iconClass: "animate-spin",
            title: `Deploying ${slug}…`,
            subtitle:
              "Building and publishing. Studio will move you to Test when it finishes.",
            pill: {
              label: "Building",
              className:
                "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
              dot: "bg-amber-500 animate-pulse",
            },
          }

  return (
    <div className="my-2 flex items-center gap-3 rounded-xl border border-border bg-background/60 px-3 py-2.5">
      <div
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
          variant.iconWrap,
        )}
      >
        <variant.Icon className={cn("h-3.5 w-3.5", variant.iconClass)} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-[12px] font-medium text-foreground">
            {variant.title}
          </p>
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide",
              variant.pill.className,
            )}
          >
            <span className={cn("h-1 w-1 rounded-full", variant.pill.dot)} />
            {variant.pill.label}
          </span>
        </div>
        <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
          {variant.subtitle}
        </p>
        {parsed.logPath && (
          <p className="mt-1 truncate font-mono text-[10px] text-muted-foreground/70">
            Log: {parsed.logPath}
          </p>
        )}
      </div>
      {deploymentState === "live" && (
        <Button size="sm" onClick={openPlay} className="shrink-0">
          <Play className="mr-1.5 h-3.5 w-3.5" />
          Test it
        </Button>
      )}
    </div>
  )
}

const STUDIO_TOOL_RENDERERS: Record<
  string,
  ComponentType<CustomToolRendererProps>
> = {
  deploy: StudioDeployToolCard,
}

type IntegrateMode = "frontend" | "backend"

const INTEGRATE_INSTALL = `pnpm add @21st-sdk/nextjs
# also installs @21st-sdk/react, ai, @ai-sdk/react`

const INTEGRATE_BACKEND_INSTALL = `pnpm add @21st-sdk/node`

const INTEGRATE_TOKEN_ROUTE = `import { createTokenHandler } from "@21st-sdk/nextjs/server"

export const POST = createTokenHandler({
  apiKey: process.env.API_KEY_21ST!,
})`

function getIntegrateBackendRunCode(slug: string) {
  return `import { AgentClient } from "@21st-sdk/node"

const client = new AgentClient({
  apiKey: process.env.API_KEY_21ST!,
})

// Run the agent once — creates a fresh sandbox + thread
const result = await client.threads.run({
  agent: "${slug}",
  messages: [
    {
      role: "user",
      parts: [{ type: "text", text: "Hello from the background job." }],
    },
  ],
  options: {
    model: "claude-sonnet-4-6",
    maxTurns: 10,
    maxBudgetUsd: 1.0,
  },
})

console.log(result.sandboxId, result.threadId)

// Stream the SSE response
const reader = result.response.body!.getReader()
const decoder = new TextDecoder()
while (true) {
  const { done, value } = await reader.read()
  if (done) break
  process.stdout.write(decoder.decode(value))
}`
}

function getIntegrateChatCode(slug: string) {
  return `"use client"

import { useChat } from "@ai-sdk/react"
import { createAgentChat, AgentChat } from "@21st-sdk/nextjs"
import "@21st-sdk/react/styles.css"

const chat = createAgentChat({
  agent: "${slug}",
  tokenUrl: "/api/an-token",
})

export default function Page() {
  const { messages, handleSubmit, status, stop, error } = useChat({ chat })

  return (
    <AgentChat
      messages={messages}
      onSend={(msg) => handleSubmit(undefined, { body: msg })}
      status={status}
      onStop={stop}
      error={error ?? undefined}
    />
  )
}`
}

function IntegrateTimelineStep({
  number,
  title,
  isLast,
  children,
}: {
  number: number
  title: string
  isLast?: boolean
  children: ReactNode
}) {
  return (
    <div className="relative flex gap-4">
      <div className="flex flex-col items-center">
        <div className="z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-background text-[11px] font-semibold text-foreground">
          {number}
        </div>
        {!isLast && <div className="w-px flex-1 bg-border" />}
      </div>
      <div className={cn("min-w-0 flex-1", isLast ? "pb-0" : "pb-8")}>
        <h3 className="text-[14px] font-medium leading-6 text-foreground">
          {title}
        </h3>
        <div className="mt-2 space-y-3">{children}</div>
      </div>
    </div>
  )
}

function IntegrateModeSwitcher({
  mode,
  onChange,
}: {
  mode: IntegrateMode
  onChange: (mode: IntegrateMode) => void
}) {
  const modes: {
    id: IntegrateMode
    label: string
    caption: string
    icon: ComponentType<{ className?: string }>
  }[] = [
    {
      id: "frontend",
      label: "Frontend",
      caption: "Embed chat in your app",
      icon: Code2,
    },
    {
      id: "backend",
      label: "Backend",
      caption: "Run from your server",
      icon: Bot,
    },
  ]

  return (
    <div className="inline-flex items-stretch gap-1 rounded-lg border border-border bg-card p-1">
      {modes.map((m) => {
        const Icon = m.icon
        const active = m.id === mode
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onChange(m.id)}
            className={cn(
              "an-focus-btn inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 text-left transition-colors",
              active
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="flex flex-col leading-none">
              <span className="text-[12px] font-medium">{m.label}</span>
              <span
                className={cn(
                  "mt-0.5 text-[10px]",
                  active ? "text-background/70" : "text-muted-foreground/70",
                )}
              >
                {m.caption}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

function IntegratePanel({ project }: { project: SessionInfo["project"] }) {
  const [mode, setMode] = useState<IntegrateMode>("frontend")
  const [slugCopied, setSlugCopied] = useState(false)
  const [promptCopied, setPromptCopied] = useState(false)

  const promptMarkdown = useMemo(
    () =>
      generateIntegrationMarkdown(
        project.deployedSlug,
        undefined,
        null,
        mode === "backend" ? "typescript" : "typescript",
        { agentName: project.name },
      ),
    [project.deployedSlug, project.name, mode],
  )

  const handleCopyPrompt = () => {
    void navigator.clipboard.writeText(promptMarkdown)
    setPromptCopied(true)
    window.setTimeout(() => setPromptCopied(false), 1800)
    capture21stAgentsEvent("studio_integrate_code_copied", {
      project_id: project.id,
      deployed_slug: project.deployedSlug,
      target: "prompt",
      mode,
    })
  }

  if (!project.hasDeployment) {
    return (
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="max-w-sm text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-muted/60">
            <Rocket className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-3 text-[13px] font-medium text-foreground">
            Deploy before integrating
          </p>
          <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
            Once your agent is deployed, Studio will give you a ready-to-paste
            SDK example wired to this exact slug.
          </p>
        </div>
      </div>
    )
  }

  const handleCopySlug = () => {
    void navigator.clipboard.writeText(project.deployedSlug)
    setSlugCopied(true)
    window.setTimeout(() => setSlugCopied(false), 1600)
    capture21stAgentsEvent("studio_integrate_code_copied", {
      project_id: project.id,
      deployed_slug: project.deployedSlug,
      target: "slug",
      mode,
    })
  }

  const docsHref =
    mode === "frontend"
      ? "/agents/docs/deploy/frontend-integration"
      : "/agents/docs/deploy/backend-integration"

  const sdkPackage = mode === "frontend" ? "@21st-sdk/nextjs" : "@21st-sdk/node"

  const apiKeyBlock = (
    <div className="rounded-md border border-border bg-secondary/30 p-3">
      <p className="mb-2 text-[11px] font-medium text-foreground">
        API key
      </p>
      <CodeBlock
        code="API_KEY_21ST=21st_sk_..."
        language="bash"
        filename=".env.local"
      />
    </div>
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col [--code-block-bg:hsl(var(--card))]">
      <div className="flex shrink-0 flex-col gap-3 border-b border-border px-6 py-3">
        <p className="text-[14px] font-semibold tracking-tight text-foreground">
          Integrate
        </p>
        <div className="flex items-center justify-between gap-2">
          <IntegrateModeSwitcher mode={mode} onChange={setMode} />
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={handleCopySlug}
              className="an-focus-btn group inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-2 text-[11px] font-medium text-foreground transition-colors hover:border-foreground/20"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <code className="font-mono text-[11px]">
                {project.deployedSlug}
              </code>
              {slugCopied ? (
                <Check className="h-3 w-3 text-emerald-500" />
              ) : (
                <Copy className="h-3 w-3 text-muted-foreground group-hover:text-foreground" />
              )}
            </button>
            <button
              type="button"
              onClick={handleCopyPrompt}
              className="an-focus-btn relative inline-flex h-8 items-center overflow-hidden whitespace-nowrap rounded-lg border border-border bg-card px-2.5 text-[11px] font-medium text-foreground transition-colors hover:border-foreground/20"
            >
              <span
                className={cn(
                  "flex items-center gap-1.5 transition-[opacity,transform] duration-200 ease-out",
                  promptCopied
                    ? "-translate-y-full opacity-0"
                    : "translate-y-0 opacity-100",
                )}
              >
                <Copy className="h-3.5 w-3.5" />
                Copy prompt
              </span>
              <span
                className={cn(
                  "absolute inset-0 flex items-center justify-center gap-1.5 transition-[opacity,transform] duration-200 ease-out",
                  promptCopied
                    ? "translate-y-0 opacity-100"
                    : "translate-y-full opacity-0",
                )}
              >
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                Copied
              </span>
            </button>
            <a
              href={docsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="an-focus-btn inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 text-[11px] font-medium text-foreground transition-colors hover:border-foreground/20"
            >
              <BookOpen className="h-3.5 w-3.5" />
              Docs
              <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
            </a>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[720px] px-6 py-8">
          <div className="mb-6 flex items-start gap-3">
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                mode === "frontend"
                  ? "bg-foreground/[0.06] text-foreground"
                  : "bg-foreground/[0.06] text-foreground",
              )}
            >
              {mode === "frontend" ? (
                <Code2 className="h-4 w-4" />
              ) : (
                <Bot className="h-4 w-4" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-foreground">
                {mode === "frontend"
                  ? "Embed into your app"
                  : "Run as a background task"}
              </p>
              <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">
                {mode === "frontend"
                  ? `Chat UI for your Next.js app, wired to ${sdkPackage}.`
                  : `Trigger ${project.deployedSlug} from any Node server, cron, or queue worker using ${sdkPackage}.`}
              </p>
            </div>
          </div>

          {mode === "frontend" ? (
            <div>
              <IntegrateTimelineStep number={1} title="Install the SDK">
                <CodeBlock code={INTEGRATE_INSTALL} language="bash" />
                <p className="text-[12px] leading-relaxed text-muted-foreground">
                  Installs{" "}
                  <code className="rounded bg-secondary px-1 py-0.5 font-mono text-[11px]">
                    @21st-sdk/react
                  </code>{" "}
                  and its peers (
                  <code className="rounded bg-secondary px-1 py-0.5 font-mono text-[11px]">
                    ai
                  </code>
                  ,{" "}
                  <code className="rounded bg-secondary px-1 py-0.5 font-mono text-[11px]">
                    @ai-sdk/react
                  </code>
                  ).
                </p>
              </IntegrateTimelineStep>

              <IntegrateTimelineStep number={2} title="Add a token route">
                <p className="text-[12px] leading-relaxed text-muted-foreground">
                  Exchange your secret API key for short-lived tokens
                  server-side. Credentials never reach the browser.
                </p>
                <CodeBlock
                  code={INTEGRATE_TOKEN_ROUTE}
                  language="typescript"
                  filename="app/api/an-token/route.ts"
                />
                {apiKeyBlock}
              </IntegrateTimelineStep>

              <IntegrateTimelineStep
                number={3}
                title="Drop in the chat component"
                isLast
              >
                <p className="text-[12px] leading-relaxed text-muted-foreground">
                  Already wired to your deployed slug{" "}
                  <code className="rounded bg-secondary px-1 py-0.5 font-mono text-[11px]">
                    {project.deployedSlug}
                  </code>
                  . Paste and run.
                </p>
                <CodeBlock
                  code={getIntegrateChatCode(project.deployedSlug)}
                  language="tsx"
                  filename="app/page.tsx"
                  collapsible={false}
                />
              </IntegrateTimelineStep>
            </div>
          ) : (
            <div>
              <IntegrateTimelineStep number={1} title="Install the Node SDK">
                <CodeBlock code={INTEGRATE_BACKEND_INSTALL} language="bash" />
                <p className="text-[12px] leading-relaxed text-muted-foreground">
                  Use this from any Node server, cron job, queue worker, or
                  edge function to trigger your agent on demand.
                </p>
              </IntegrateTimelineStep>

              <IntegrateTimelineStep number={2} title="Set your API key">
                <p className="text-[12px] leading-relaxed text-muted-foreground">
                  The Node SDK authenticates with your team&apos;s secret API
                  key — keep it server-side.
                </p>
                {apiKeyBlock}
              </IntegrateTimelineStep>

              <IntegrateTimelineStep
                number={3}
                title="Run the agent in a thread"
                isLast
              >
                <p className="text-[12px] leading-relaxed text-muted-foreground">
                  Call{" "}
                  <code className="rounded bg-secondary px-1 py-0.5 font-mono text-[11px]">
                    threads.run()
                  </code>{" "}
                  with your deployed slug. A fresh sandbox + thread is created
                  automatically, and the response streams back as SSE.
                </p>
                <CodeBlock
                  code={getIntegrateBackendRunCode(project.deployedSlug)}
                  language="typescript"
                  filename="run-agent.ts"
                  collapsible={false}
                />
              </IntegrateTimelineStep>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function PreviewOptimisticRow() {
  const [elapsed, setElapsed] = useState(0)
  const startRef = useRef(Date.now())

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(Date.now() - startRef.current)
    }, 100)
    return () => clearInterval(timer)
  }, [])

  const elapsedSec = (elapsed / 1000).toFixed(1)
  const pct = Math.min(5 + 75 * (1 - Math.exp(-elapsed / 4000)), 80)

  return (
    <div className="flex h-full flex-col">
      <div className="flex min-h-0 flex-1 overflow-hidden bg-background">
        <div className="flex-shrink-0 overflow-x-hidden" style={{ width: 150 }}>
          <div
            className="flex items-center gap-1 px-1 border-b-[0.5px] border-border/50"
            style={{ paddingLeft: 16, height: 28 }}
          >
            <span className="text-[11px] text-foreground truncate">
              main
            </span>
          </div>
        </div>
        <div className="relative w-0 flex-shrink-0">
          <div className="absolute inset-y-0 -left-px w-[0.5px] bg-border/50" />
        </div>
        <div className="flex-1 overflow-x-hidden">
          <div
            className="relative border-b-[0.5px] border-border/50"
            style={{ height: 28 }}
          >
            <div
              className="absolute top-1 h-5 left-0"
              style={{ width: `${pct}%`, transition: "width 100ms linear" }}
            >
              <div className="h-full w-full rounded-sm bg-blue-500/70 relative">
                <div
                  className="absolute inset-0 rounded-sm opacity-40"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.3) 3px, rgba(255,255,255,0.3) 6px)",
                    animation: "timeline-stripe 0.6s linear infinite",
                  }}
                />
                <span className="absolute left-1.5 top-0.5 text-[10px] text-white/90 font-medium whitespace-nowrap">
                  {elapsedSec}s
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes timeline-stripe {
          0% { background-position: 0 0; }
          100% { background-position: 12px 0; }
        }
      `}</style>
    </div>
  )
}

function PreviewPanel({
  project,
  autoEnable,
  onProceedToIntegrate,
}: {
  project: SessionInfo["project"]
  autoEnable: boolean
  onProceedToIntegrate: () => void
}) {
  const [messageInput, setMessageInput] = useState(
    "Say hello and tell me what you can do.",
  )
  const [threadId, setThreadId] = useState<string | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<"timeline" | "trace">("timeline")
  const [tokenState, setTokenState] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle")
  const [testRunEnabled, setTestRunEnabled] = useState(false)
  const [hasTestRunResult, setHasTestRunResult] = useState(false)
  const [keepTracePolling, setKeepTracePolling] = useState(false)
  const [sentCount, setSentCount] = useState(0)
  const traceIsStreaming = isStreaming || keepTracePolling
  const sandboxIdRef = useRef(`studio-preview-${project.id}-${Date.now()}`)
  const tokenRef = useRef<string | null>(null)

  useEffect(() => {
    tokenRef.current = null
    sandboxIdRef.current = `studio-preview-${project.id}-${Date.now()}`
    setThreadId(null)
    setSentCount(0)
    setIsStreaming(false)
    setError(null)
    setTokenState("idle")
    setTestRunEnabled(false)
    setHasTestRunResult(false)
  }, [project.deployedSlug, project.id, project.teamId])

  useEffect(() => {
    if (!autoEnable || !project.hasDeployment || testRunEnabled) return
    setError(null)
    setTestRunEnabled(true)
  }, [autoEnable, project.hasDeployment, testRunEnabled])

  useEffect(() => {
    if (!project.hasDeployment || !testRunEnabled) return
    if (tokenState === "ready" || tokenState === "loading") return

    void (async () => {
      setTokenState("loading")
      try {
        const res = await fetch("/api/agents/test-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            agent: project.deployedSlug,
            teamId: project.teamId,
          }),
        })
        const data = (await res.json().catch(() => ({}))) as {
          token?: string
          error?: string
        }
        if (!res.ok || !data.token) {
          throw new Error(data.error || "Failed to mint preview token")
        }
        tokenRef.current = data.token
        setTokenState("ready")
      } catch (tokenError) {
        console.error("Failed to fetch Studio preview token", tokenError)
        setTokenState("error")
        setError(
          tokenError instanceof Error
            ? tokenError.message
            : "Failed to prepare preview token",
        )
      }
    })()
  }, [
    project.deployedSlug,
    project.hasDeployment,
    project.teamId,
    testRunEnabled,
    tokenState,
  ])

  const { data: sandboxData, refetch: refetchSandbox } =
    api.agentConfigs.listSandboxes.useQuery(
      { teamId: project.teamId, search: sandboxIdRef.current },
      {
        enabled: testRunEnabled && sentCount > 0,
        refetchInterval: isStreaming ? 2_000 : false,
      },
    )

  useEffect(() => {
    const sandbox = sandboxData?.sandboxes?.[0]
    if (!sandbox?.threads?.length) return

    const latestThread = sandbox.threads[0]
    if (latestThread?.id && latestThread.id !== threadId) {
      setThreadId(latestThread.id)
    }
    if (
      latestThread?.status === "completed" ||
      latestThread?.status === "failed"
    ) {
      setIsStreaming(false)
    }
  }, [sandboxData, threadId])

  const handleSend = useCallback(async () => {
    if (
      !testRunEnabled ||
      !messageInput.trim() ||
      !project.hasDeployment ||
      !tokenRef.current
    ) {
      return
    }

    setError(null)
    setIsStreaming(true)
    setSentCount((count) => count + 1)

    capture21stAgentsEvent("studio_test_message_sent", {
      project_id: project.id,
      deployed_slug: project.deployedSlug,
    })

    try {
      const res = await fetch(`${RELAY_URL}/v1/chat/${project.deployedSlug}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenRef.current}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sandboxId: sandboxIdRef.current,
          messages: [
            {
              id: `m-${Date.now()}`,
              role: "user",
              createdAt: new Date().toISOString(),
              parts: [{ type: "text", text: messageInput }],
            },
          ],
        }),
      })

      if (!res.ok) {
        throw new Error(await res.text())
      }

      setMessageInput("")

      for (let attempt = 0; attempt < 10; attempt += 1) {
        await new Promise((resolve) => setTimeout(resolve, 1_000))
        const result = await refetchSandbox()
        const sandbox = result.data?.sandboxes?.[0]
        if (sandbox?.threads?.length) break
      }

      const reader = res.body?.getReader()
      if (!reader) {
        setIsStreaming(false)
        setKeepTracePolling(true)
        setTimeout(() => setHasTestRunResult(true), 2_000)
        setTimeout(() => setKeepTracePolling(false), 10_000)
        void refetchSandbox()
        return
      }

      const decoder = new TextDecoder()
      let finalized = false
      const finalizeRun = () => {
        if (finalized) return
        finalized = true
        setIsStreaming(false)
        setKeepTracePolling(true)
        // Delay showing result banner so timeline data loads first
        setTimeout(() => setHasTestRunResult(true), 2_000)
        setTimeout(() => setKeepTracePolling(false), 10_000)
        void refetchSandbox()
      }

      const readStream = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) {
              finalizeRun()
              break
            }

            const text = decoder.decode(value, { stream: true })
            if (
              text.includes('"type":"finish"') ||
              text.includes('"type":"error"')
            ) {
              finalizeRun()
              break
            }
          }
        } catch (streamError) {
          console.error("Studio preview stream failed", streamError)
          setIsStreaming(false)
        }
      }

      void readStream()
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to send message",
      )
      setIsStreaming(false)
    }
  }, [
    messageInput,
    project.deployedSlug,
    project.hasDeployment,
    refetchSandbox,
    testRunEnabled,
  ])

  if (!project.hasDeployment) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-[13px] text-muted-foreground">
            Deploy an agent to test it here.
          </p>
          <p className="text-[11px] text-muted-foreground/50">
            Ask the wizard to deploy your project, then Studio will open trace
            and timeline previews for live runs.
          </p>
        </div>
      </div>
    )
  }

  const hasActiveRun = !!threadId || isStreaming

  // ── Initial state: centered chat UI ──
  if (!hasActiveRun && !hasTestRunResult) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xl px-6">
            <div className="text-center mb-6">
              <p className="text-[14px] font-medium text-foreground">
                Test your agent
              </p>
              <p className="mt-1.5 text-[12px] text-muted-foreground">
                Send a message to see how it responds, then inspect the timeline
                and trace.
              </p>
            </div>

            <div className="space-y-3">
              <div className="mx-auto max-w-md flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5">
                <input
                  value={messageInput}
                  onChange={(event) => setMessageInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault()
                      void handleSend()
                    }
                  }}
                  placeholder="Send a message to the agent..."
                  className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                  disabled={isStreaming || !testRunEnabled || tokenState !== "ready"}
                  autoFocus
                />
                <button
                  onClick={() => void handleSend()}
                  disabled={
                    isStreaming ||
                    !messageInput.trim() ||
                    !testRunEnabled ||
                    tokenState !== "ready"
                  }
                  className={cn(
                    "inline-flex h-7 items-center rounded-md px-3 text-[11px] font-medium transition-colors",
                    isStreaming ||
                      !messageInput.trim() ||
                      !testRunEnabled ||
                      tokenState !== "ready"
                      ? "cursor-not-allowed bg-muted text-muted-foreground"
                      : "bg-foreground text-background hover:bg-foreground/90",
                  )}
                >
                  <ArrowUpRight className="mr-1 h-3.5 w-3.5" />
                  Send
                </button>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="flex gap-2">
                  {PLAY_PROMPT_SUGGESTIONS.slice(0, 2).map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => setMessageInput(prompt)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-[11px] transition-colors",
                        messageInput === prompt
                          ? "border-foreground/30 bg-foreground/5 text-foreground"
                          : "border-border bg-background text-muted-foreground hover:border-foreground/20 hover:text-foreground",
                      )}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
                {PLAY_PROMPT_SUGGESTIONS[2] && (
                  <button
                    type="button"
                    onClick={() => setMessageInput(PLAY_PROMPT_SUGGESTIONS[2]!)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-[11px] transition-colors",
                      messageInput === PLAY_PROMPT_SUGGESTIONS[2]
                        ? "border-foreground/30 bg-foreground/5 text-foreground"
                        : "border-border bg-background text-muted-foreground hover:border-foreground/20 hover:text-foreground",
                    )}
                  >
                    {PLAY_PROMPT_SUGGESTIONS[2]}
                  </button>
                )}
              </div>

              {!testRunEnabled && (
                <p className="text-center text-[11px] text-muted-foreground/50">
                  Preparing test session...
                </p>
              )}
              {tokenState === "loading" && testRunEnabled && (
                <p className="text-center text-[11px] text-muted-foreground/50">
                  Connecting...
                </p>
              )}
            </div>

            {error && (
              <p className="mt-3 text-center text-[11px] text-destructive">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── Active run / has results: split layout with trace ──
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 border-b border-border/50 px-4 py-3">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[13px] font-medium text-foreground">Test</p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                Try the live agent, inspect the trace, and decide what to tweak
                before you integrate it.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isStreaming && (
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  Running...
                </div>
              )}
              {threadId && (
                <a
                  href={`/agents/threads?thread=${threadId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  View session
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 17l9.2-9.2M17 17V7H7" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          <div className="flex items-center overflow-hidden rounded-md border border-border">
            <button
              onClick={() => setTab("timeline")}
              className={cn(
                "px-2.5 py-1 text-[11px] font-medium transition-colors",
                tab === "timeline"
                  ? "bg-foreground/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Timeline
            </button>
            <button
              onClick={() => setTab("trace")}
              className={cn(
                "px-2.5 py-1 text-[11px] font-medium transition-colors",
                tab === "trace"
                  ? "bg-foreground/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Trace
            </button>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        {threadId ? (
          tab === "trace" ? (
            <TraceView threadId={threadId} isStreaming={traceIsStreaming} />
          ) : (
            <SidebarTimelineView
              threadId={threadId}
              isStreaming={traceIsStreaming}
            />
          )
        ) : (
          <PreviewOptimisticRow />
        )}
      </div>

      {hasTestRunResult && !isStreaming && (
        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-border/50 px-4 py-2">
          <p className="text-[11px] text-muted-foreground">
            Your live agent responded. Keep iterating here, or move to Integrate
            when you are ready to wire it into your app.
          </p>
          <Button size="sm" onClick={onProceedToIntegrate}>
            Integrate
          </Button>
        </div>
      )}

      {error && (
        <div className="border-t border-border/50 px-4 py-2 text-[11px] text-destructive">
          {error}
        </div>
      )}

      <div className="shrink-0 border-t border-border px-4 py-3">
        <div className="mb-3 flex flex-wrap gap-2">
          {PLAY_PROMPT_SUGGESTIONS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => setMessageInput(prompt)}
              className="rounded-full border border-border bg-background px-3 py-1.5 text-[11px] text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
            >
              {prompt}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
          <input
            value={messageInput}
            onChange={(event) => setMessageInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault()
                void handleSend()
              }
            }}
            placeholder={
              testRunEnabled
                ? "Send a message to the agent"
                : "Click TEST RUN to start"
            }
            className="flex-1 bg-transparent text-[12px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
            disabled={isStreaming || !testRunEnabled || tokenState !== "ready"}
          />
          <button
            onClick={() => void handleSend()}
            disabled={
              isStreaming ||
              !messageInput.trim() ||
              !testRunEnabled ||
              tokenState !== "ready"
            }
            className={cn(
              "inline-flex h-7 items-center rounded-md px-3 text-[11px] font-medium transition-colors",
              isStreaming ||
                !messageInput.trim() ||
                !testRunEnabled ||
                tokenState !== "ready"
                ? "cursor-not-allowed bg-muted text-muted-foreground"
                : "bg-foreground text-background hover:bg-foreground/90",
            )}
          >
            {tokenState === "loading"
              ? "Preparing..."
              : isStreaming
                ? "Running..."
                : "Send"}
          </button>
        </div>
      </div>
    </div>
  )
}

function WizardChatPanel({
  projectId,
  session,
  project,
  initialPrompt,
  queuedPrompt,
  onInitialPromptConsumed,
  onQueuedPromptConsumed,
  onActivity,
  onOpenPlay,
  onStatusChange,
}: {
  projectId: string
  session: SessionInfo
  project: SessionInfo["project"]
  initialPrompt: string | null
  queuedPrompt: QueuedWizardPrompt
  onInitialPromptConsumed: () => void
  onQueuedPromptConsumed: () => void
  onActivity: () => void
  onOpenPlay: () => void
  onStatusChange?: (status: "ready" | "submitted" | "streaming") => void
}) {
  const { resolvedTheme } = useTheme()
  const colorMode = (resolvedTheme === "dark" ? "dark" : "light") as
    | "light"
    | "dark"

  const sessionKey = `${session.sandboxId}:${session.threadId}`
  const hydratedMessagesRef = useRef<{ key: string; messages: UIMessage[] }>({
    key: sessionKey,
    messages: session.initialMessages,
  })

  if (hydratedMessagesRef.current.key !== sessionKey) {
    hydratedMessagesRef.current = {
      key: sessionKey,
      messages: session.initialMessages,
    }
  }

  const chat = useMemo(() => {
    const fetchToken = async () => {
      const res = await fetch("/api/agents/wizard-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent: session.wizardSlug }),
      })
      if (!res.ok) throw new Error("Failed to mint wizard chat token")
      const data = (await res.json()) as { token: string }
      return data.token
    }

    return new Chat({
      id: `studio-${projectId}-${sessionKey}`,
      messages: hydratedMessagesRef.current.messages,
      transport: new DefaultChatTransport({
        api: `${RELAY_URL}/v1/chat/${session.wizardSlug}`,
        headers: async () => {
          const token = await fetchToken()
          return { Authorization: `Bearer ${token}` }
        },
        body: {
          sandboxId: session.sandboxId,
          threadId: session.threadId,
        },
      }),
    })
  }, [projectId, session.sandboxId, session.threadId, session.wizardSlug])

  const { messages, sendMessage, status, stop } = useChat({ chat })
  const autoStartedPromptRef = useRef<string | null>(null)
  const queuedPromptRef = useRef<number | null>(null)

  useEffect(() => {
    onStatusChange?.(status as "ready" | "submitted" | "streaming")
  }, [status, onStatusChange])

  const handleSend = useCallback(
    (message: { role: "user"; content: string }) => {
      onActivity()
      sendMessage({
        role: "user",
        parts: [{ type: "text", text: message.content }],
      })
    },
    [onActivity, sendMessage],
  )

  useEffect(() => {
    const trimmedPrompt = initialPrompt?.trim()
    if (!trimmedPrompt) {
      autoStartedPromptRef.current = null
      return
    }

    const promptKey = `${sessionKey}:${trimmedPrompt}`
    if (autoStartedPromptRef.current === promptKey) return
    if (messages.length > 0 || status !== "ready") return

    autoStartedPromptRef.current = promptKey
    onActivity()
    sendMessage({
      role: "user",
      parts: [{ type: "text", text: trimmedPrompt }],
    })
    onInitialPromptConsumed()
  }, [
    initialPrompt,
    messages.length,
    onActivity,
    onInitialPromptConsumed,
    sendMessage,
    sessionKey,
    status,
  ])

  useEffect(() => {
    const prompt = queuedPrompt
    const trimmedPrompt = prompt?.text.trim()
    if (!prompt || !trimmedPrompt) return
    if (queuedPromptRef.current === prompt.id) return
    if (status !== "ready") return

    queuedPromptRef.current = prompt.id
    onActivity()
    sendMessage({
      role: "user",
      parts: [{ type: "text", text: trimmedPrompt }],
    })
    onQueuedPromptConsumed()
  }, [onActivity, onQueuedPromptConsumed, queuedPrompt, sendMessage, status])

  // Refresh session when AI finishes responding (picks up deploy status changes)
  const prevStatusRef = useRef(status)
  useEffect(() => {
    const prev = prevStatusRef.current
    prevStatusRef.current = status
    if ((prev === "streaming" || prev === "submitted") && status === "ready") {
      onActivity()
    }
  }, [status, onActivity])

  const showEmptyState = messages.length === 0

  return (
    <StudioProjectContext.Provider value={project}>
      <StudioActionsContext.Provider value={{ openPlay: onOpenPlay }}>
        <WizardSendContext.Provider value={(text) => handleSend({ role: "user", content: text })}>
          <div className="relative h-full">
            <AnAgentChat
              messages={messages}
              onSend={handleSend}
              status={status}
              onStop={() => stop()}
              colorMode={colorMode}
              toolRenderers={STUDIO_TOOL_RENDERERS}
              className="h-full"
            />
            {showEmptyState && (
              <div className="pointer-events-none absolute inset-x-0 top-0 bottom-20 flex items-center justify-center px-6">
                <WizardEmptyState />
              </div>
            )}
          </div>
        </WizardSendContext.Provider>
      </StudioActionsContext.Provider>
    </StudioProjectContext.Provider>
  )
}

export function WorkspaceClient({
  projectId,
  initialPrompt,
}: {
  projectId: string
  initialPrompt: string | null
}) {
  const router = useRouter()
  const [state, setState] = useState<SessionState>({ status: "idle" })
  const [refreshTick, setRefreshTick] = useState(0)
  const [activeStep, setActiveStep] = useState<StudioStep>(1)
  const [buildView, setBuildView] = useState<BuildView>("overview")
  const [queuedPrompt, setQueuedPrompt] = useState<QueuedWizardPrompt>(null)
  const [wizardStatus, setWizardStatus] = useState<"ready" | "submitted" | "streaming">("ready")
  const requestInFlightRef = useRef(false)
  const initialPromptRef = useRef(initialPrompt)
  const queuedPromptCounterRef = useRef(0)

  const setStudioProject = useSetAtom(anStudioProjectAtom)
  const readyProject = state.status === "ready" ? state.session.project : null

  // Sync project info to dashboard header atom
  useEffect(() => {
    if (readyProject) {
      setStudioProject({ id: readyProject.id, name: readyProject.name })
    }
    return () => setStudioProject(null)
  }, [readyProject?.id, setStudioProject])

  // Analytics: workspace opened (once per ready project)
  const workspaceOpenedRef = useRef<string | null>(null)
  useEffect(() => {
    if (!readyProject) return
    if (workspaceOpenedRef.current === readyProject.id) return
    workspaceOpenedRef.current = readyProject.id
    capture21stAgentsEvent("studio_workspace_opened", {
      project_id: readyProject.id,
      deployed_slug: readyProject.deployedSlug,
      has_deployment: readyProject.hasDeployment,
      had_initial_prompt: !!initialPromptRef.current,
    })
  }, [readyProject])

  // Analytics: workspace error
  useEffect(() => {
    if (state.status !== "error") return
    capture21stAgentsEvent("studio_workspace_error", {
      project_id: projectId,
      code: state.code,
      kind: state.kind,
    })
  }, [projectId, state])

  const onWizardActivity = useCallback(() => {
    setRefreshTick((value) => value + 1)
  }, [])

  const queueWizardPrompt = useCallback((text: string) => {
    queuedPromptCounterRef.current += 1
    setActiveStep(1)
    setQueuedPrompt({ id: queuedPromptCounterRef.current, text })
  }, [])

  const handleQueuedPromptConsumed = useCallback(() => {
    setQueuedPrompt(null)
  }, [])

  const handleInitialPromptConsumed = useCallback(() => {
    if (!initialPromptRef.current) return
    initialPromptRef.current = null
    router.replace(`/agents/studio/${projectId}`)
  }, [projectId, router])

  const loadSession = useCallback(
    async (mode: "initial" | "refresh") => {
      if (requestInFlightRef.current) return
      requestInFlightRef.current = true

      if (mode === "initial") {
        setState({ status: "provisioning" })
      }

      try {
        const res = await fetch(`/api/studio/projects/${projectId}/session`, {
          method: "POST",
        })
        if (!res.ok) {
          const body = await res
            .json()
            .catch(() => ({ error: `HTTP ${res.status}`, reason: undefined }))
          setState({
            status: "error",
            code: res.status,
            message: body?.error ?? `HTTP ${res.status}`,
            kind: errorKindFromResponse(res.status, body?.reason),
          })
          return
        }

        const session = (await res.json()) as SessionInfo
        setState({ status: "ready", session })
      } catch (error) {
        setState({
          status: "error",
          code: 0,
          message: error instanceof Error ? error.message : "Unknown error",
          kind: "unknown",
        })
      } finally {
        requestInFlightRef.current = false
      }
    },
    [projectId],
  )

  useEffect(() => {
    void loadSession("initial")
  }, [loadSession])

  useEffect(() => {
    if (state.status !== "ready" || refreshTick === 0) return
    void loadSession("refresh")
  }, [loadSession, refreshTick, state.status])

  useEffect(() => {
    if (state.status !== "ready") return
    const interval = setInterval(
      () => setRefreshTick((value) => value + 1),
      15_000,
    )
    return () => clearInterval(interval)
  }, [state.status])

  const readySession = state.status === "ready" ? state.session : null
  const canOpenPlay = !!readySession?.project.hasDeployment
  const canOpenIntegrate = canOpenPlay

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-tl-background">
      <div className="relative flex shrink-0 items-center justify-center border-b border-border px-4 py-2">
        <button
          type="button"
          onClick={() => router.push("/agents/studio")}
          className="an-focus-btn absolute left-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground transition-colors hover:text-foreground"
        >
          Studio
        </button>
        <StudioStepper
          activeStep={activeStep}
          canOpenPlay={canOpenPlay}
          canOpenIntegrate={canOpenIntegrate}
          onSelect={(step) => {
            if (step !== activeStep) {
              capture21stAgentsEvent("studio_step_changed", {
                project_id: projectId,
                from_step: activeStep,
                to_step: step,
                has_deployment: canOpenPlay,
              })
            }
            setActiveStep(step)
          }}
        />
      </div>

      <div className="flex flex-1 min-h-0">
        {state.status === "idle" || state.status === "provisioning" ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
              <p className="mt-3 text-[12px] text-muted-foreground">
                Connecting to your Studio project...
              </p>
            </div>
          </div>
        ) : state.status === "error" ? (
          <ErrorState
            state={state}
            onBack={() => router.push("/agents/studio")}
          />
        ) : (
          <>
            <div className="flex w-[540px] shrink-0 flex-col border-r border-border min-h-0">
              <WizardChatPanel
                projectId={projectId}
                session={state.session}
                project={state.session.project}
                initialPrompt={initialPromptRef.current}
                queuedPrompt={queuedPrompt}
                onInitialPromptConsumed={handleInitialPromptConsumed}
                onQueuedPromptConsumed={handleQueuedPromptConsumed}
                onActivity={onWizardActivity}
                onOpenPlay={() => setActiveStep(2)}
                onStatusChange={setWizardStatus}
              />
            </div>

            <div className="flex flex-1 min-w-0 flex-col">
              <div className="flex flex-1 min-h-0">
                <div
                  className={cn(
                    "flex min-h-0 flex-1 flex-col",
                    activeStep === 1 ? "" : "hidden",
                  )}
                >
                  <BuildViewSwitcher
                    value={buildView}
                    onChange={setBuildView}
                  />
                  <div className="flex flex-1 min-h-0">
                    <div
                      className={cn(
                        "flex min-h-0 flex-1",
                        buildView === "overview" ? "" : "hidden",
                      )}
                    >
                      <BuildOverviewPanel
                        projectId={projectId}
                        project={state.session.project}
                        refreshTick={refreshTick}
                        onQueuePrompt={queueWizardPrompt}
                        onOpenCode={() => setBuildView("code")}
                        onOpenPlay={() => setActiveStep(2)}
                        wizardStatus={wizardStatus}
                      />
                    </div>
                    <div
                      className={cn(
                        "flex min-h-0 flex-1",
                        buildView === "code" ? "" : "hidden",
                      )}
                    >
                      <FileTreePanel
                        projectId={projectId}
                        refreshTick={refreshTick}
                      />
                    </div>
                  </div>
                </div>

                <div
                  className={cn(
                    "flex min-h-0 flex-1 flex-col",
                    activeStep === 2 ? "" : "hidden",
                  )}
                >
                  <PreviewPanel
                    project={state.session.project}
                    autoEnable={activeStep === 2}
                    onProceedToIntegrate={() => setActiveStep(3)}
                  />
                </div>

                <div
                  className={cn(
                    "flex min-h-0 flex-1 flex-col",
                    activeStep === 3 ? "" : "hidden",
                  )}
                >
                  <IntegratePanel project={state.session.project} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function ErrorState({
  state,
  onBack,
}: {
  state: Extract<SessionState, { status: "error" }>
  onBack: () => void
}) {
  const { kind, message } = state

  if (kind === "not_provisioned") {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="max-w-md text-center">
          <AlertTriangle className="mx-auto h-6 w-6 text-amber-500" />
          <h2 className="mt-3 text-[14px] font-semibold text-foreground">
            Builder not yet provisioned
          </h2>
          <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
            Studio requires the builder-wizard agent and a platform API key
            before it can open project sessions.
          </p>
          <p className="mt-3 text-[11px] text-muted-foreground/70">
            Missing env var: <code className="font-mono">AN_API_KEY</code>
          </p>
          <button
            onClick={onBack}
            className="mt-5 rounded-md bg-foreground px-3 py-1.5 text-[11px] font-medium text-background hover:bg-foreground/90"
          >
            Back to hub
          </button>
        </div>
      </div>
    )
  }

  if (kind === "forbidden" || kind === "not_found") {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="max-w-md text-center">
          <AlertTriangle className="mx-auto h-6 w-6 text-destructive" />
          <h2 className="mt-3 text-[14px] font-semibold text-foreground">
            Project not found or not accessible
          </h2>
          <p className="mt-2 text-[12px] text-muted-foreground">
            This Studio project doesn&apos;t exist or belongs to a different
            team.
          </p>
          <button
            onClick={onBack}
            className="mt-5 rounded-md bg-foreground px-3 py-1.5 text-[11px] font-medium text-background hover:bg-foreground/90"
          >
            Back to hub
          </button>
        </div>
      </div>
    )
  }

  if (kind === "no_workspace") {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="max-w-md text-center">
          <AlertTriangle className="mx-auto h-6 w-6 text-amber-500" />
          <h2 className="mt-3 text-[14px] font-semibold text-foreground">
            Empty Studio project
          </h2>
          <p className="mt-2 text-[12px] text-muted-foreground">
            This Studio project does not have any workspace files yet.
          </p>
          <button
            onClick={onBack}
            className="mt-5 rounded-md bg-foreground px-3 py-1.5 text-[11px] font-medium text-background hover:bg-foreground/90"
          >
            Back to hub
          </button>
        </div>
      </div>
    )
  }

  if (kind === "sandbox_unavailable") {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="max-w-md text-center">
          <AlertTriangle className="mx-auto h-6 w-6 text-amber-500" />
          <h2 className="mt-3 text-[14px] font-semibold text-foreground">
            Studio sandbox unavailable
          </h2>
          <p className="mt-2 text-[12px] text-muted-foreground">
            This Studio project lost its sandbox and there isn&apos;t a stored
            workspace snapshot available to restore from.
          </p>
          <button
            onClick={onBack}
            className="mt-5 rounded-md bg-foreground px-3 py-1.5 text-[11px] font-medium text-background hover:bg-foreground/90"
          >
            Back to hub
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="max-w-md text-center">
        <AlertTriangle className="mx-auto h-6 w-6 text-destructive" />
        <h2 className="mt-3 text-[14px] font-semibold text-foreground">
          Failed to open Studio
        </h2>
        <p className="mt-2 text-[12px] text-muted-foreground">
          {message ||
            "Something went wrong while preparing the Studio project."}
        </p>
        <button
          onClick={onBack}
          className="mt-5 rounded-md bg-foreground px-3 py-1.5 text-[11px] font-medium text-background hover:bg-foreground/90"
        >
          Back to hub
        </button>
      </div>
    </div>
  )
}
