// @ts-nocheck
"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { api } from "@/trpc/client"
import { useAtomValue, useAtom } from "jotai"
import { selectedTeamIdAtom } from "@/lib/atoms/team"
import { anSelectedAgentAtom } from "@/lib/atoms/an-agent"
import { cn } from "@/lib/utils"
import { MoreHorizontal, Check, RotateCcw, Download, Copy } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { Spinner } from "@/components/icons/spinner"
import { AnLogoSpinner } from "@/components/features/agents/an/dashboard/an-logo-spinner"
import {
  ConfigSection,
  SegmentedControl,
  CheckboxRow,
  SwitchRow,
  ClaudeIcon,
  CodexIcon,
} from "@/components/features/agents/an/playground/config/config-shared"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/features/agents/ui/canvas/[id]/{components}/ui/dropdown-menu"
import { createPortal } from "react-dom"
import { useAgentsRouter } from "@/hooks/use-agents-router"
import { LiveChat } from "@/components/features/agents/an/dashboard/live-chat"
import type { VisualConfig, AttachmentType, AttachmentButtonStyle, AgentConfig } from "@/components/features/agents/an/types"
import { VISUAL_PRESETS, TOOL_CALL_STYLE_DEFAULTS, ATTACHMENT_TYPE_OPTIONS } from "@/components/features/agents/an/types"
import type { PlaygroundAction } from "@/components/features/agents/an/playground/playground-types"
import { VisualConfigTab } from "@/components/features/agents/an/playground/config/visual-config-tab"
import { generateThemeJson } from "@/components/features/agents/an/playground/use-playground-state"
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@/components/features/agents/an/ui/popover"
import {
  overlayItemBase,
  overlayItemHover,
  overlayItemFocus,
} from "@/components/features/agents/ui/1code/lib/overlay-styles"

/* ── Constants ── */

const RUNTIMES: { id: string; label: string; icon: React.ReactNode; disabled?: boolean; badge?: string }[] = [
  { id: "claude-code", label: "Anthropic", icon: <ClaudeIcon /> },
  { id: "codex", label: "OpenAI", icon: <CodexIcon />, disabled: true, badge: "soon" },
]

const MODELS: Record<string, { id: string; label: string; name: string; version?: string }[]> = {
  "claude-code": [
    { id: "claude-sonnet-4-6", label: "Sonnet 4.6", name: "Sonnet", version: "4.6" },
    { id: "claude-opus-4-6", label: "Opus 4.6", name: "Opus", version: "4.6" },
    { id: "claude-haiku-4-5-20251001", label: "Haiku 4.5", name: "Haiku", version: "4.5" },
  ],
  codex: [
    { id: "gpt-5.4/medium", label: "GPT 5.4", name: "GPT 5.4" },
    { id: "gpt-5.3-codex/medium", label: "GPT-5.3 Codex", name: "GPT-5.3 Codex" },
    { id: "gpt-5.2-codex/medium", label: "GPT-5.2 Codex", name: "GPT-5.2 Codex" },
    { id: "gpt-5.1-codex-mini/medium", label: "GPT-5.1 Mini", name: "GPT-5.1 Mini" },
  ],
}

const TOOL_CATEGORIES = [
  { name: "Read-only", tools: ["Read", "Glob", "Grep"] },
  { name: "Edit", tools: ["Edit", "Write"] },
  { name: "Execution", tools: ["Bash"] },
  { name: "Web", tools: ["WebFetch", "WebSearch"] },
]

const ALL_TOOLS = TOOL_CATEGORIES.flatMap((c) => c.tools)

const TOOL_DESCRIPTIONS: Record<string, string> = {
  Read: "Read file contents",
  Glob: "Find files by pattern",
  Grep: "Search file contents",
  Edit: "Edit existing files",
  Write: "Create new files",
  Bash: "Execute shell commands",
  WebFetch: "Fetch URL content",
  WebSearch: "Search the web",
}

const TURNS_PRESETS = [
  { value: 10, label: "minimal" },
  { value: 25, label: "low" },
  { value: 50, label: "default" },
  { value: 100, label: "high" },
  { value: 200, label: "extended" },
  { value: 500, label: "max" },
]

const DEFAULT_VC = VISUAL_PRESETS.notion!.config

function detectPreset(vc: VisualConfig | null): string | null {
  if (!vc) return null
  for (const key of Object.keys(VISUAL_PRESETS)) {
    const preset = VISUAL_PRESETS[key]!
    if (
      vc.messageBubbleStyle === preset.config.messageBubbleStyle &&
      vc.attachButtonRight === preset.config.attachButtonRight &&
      vc.messageDensity === preset.config.messageDensity &&
      vc.sendButtonStyle === preset.config.sendButtonStyle
    ) {
      return key
    }
  }
  return null
}

/* ── TurnsInput ── */

function TurnsInput({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(String(value))
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setInputValue(String(value))
  }, [value])

  const commit = useCallback(() => {
    const num = parseInt(inputValue, 10)
    if (isNaN(num)) {
      setInputValue(String(value))
    } else {
      const clamped = Math.max(1, Math.min(500, num))
      setInputValue(String(clamped))
      onChange(clamped)
    }
  }, [inputValue, value, onChange])

  return (
    <Popover open={isOpen} onOpenChange={(open) => { if (!open) { commit(); setIsOpen(false) } }}>
      <PopoverAnchor asChild>
        <div
          className={`flex items-center gap-1.5 h-8 px-2.5 rounded-md border bg-foreground/[0.05] cursor-text transition-colors ${
            isOpen ? "border-foreground/20 shadow-[0_0_0_3px_hsl(var(--ring)/0.24)]" : "border-border hover:border-foreground/15"
          }`}
          onClick={(e) => { if (e.target !== inputRef.current) inputRef.current?.focus() }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-muted-foreground" aria-hidden="true">
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            aria-label="Max turns"
            value={inputValue}
            onChange={(e) => {
              const raw = e.target.value
              setInputValue(raw)
              const num = parseInt(raw, 10)
              if (!isNaN(num)) onChange(Math.max(1, Math.min(500, num)))
            }}
            onFocus={() => !isOpen && setIsOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { commit(); setIsOpen(false); inputRef.current?.blur() }
              if (e.key === "Escape") { setInputValue(String(value)); setIsOpen(false); inputRef.current?.blur() }
              if (e.key === "ArrowUp") { e.preventDefault(); onChange(Math.min(500, value + 1)) }
              if (e.key === "ArrowDown") { e.preventDefault(); onChange(Math.max(1, value - 1)) }
            }}
            className="flex-1 min-w-0 h-full text-[12px] border-none outline-none bg-transparent text-foreground/70"
          />
          <span className="text-[10px] text-foreground/40 shrink-0" aria-hidden="true">turns</span>
        </div>
      </PopoverAnchor>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0 overflow-hidden"
        align="start"
        side="bottom"
        sideOffset={4}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="py-1 max-h-[200px] overflow-y-auto">
          {TURNS_PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => { onChange(preset.value); setInputValue(String(preset.value)); setIsOpen(false) }}
              className={`${overlayItemBase} ${overlayItemHover} ${overlayItemFocus} an-focus-btn w-[calc(100%-8px)] justify-between text-[11px] text-left ${
                value === preset.value
                  ? "bg-accent dark:bg-neutral-800 text-foreground font-medium"
                  : "text-foreground/70"
              }`}
            >
              <span>{preset.value}</span>
              <span className="text-muted-foreground">{preset.label}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

/* ── Page ── */

type ConfigTab = "agent" | "visual"

export default function ConfigurationPage() {
  const teamId = useAtomValue(selectedTeamIdAtom)
  const [selectedAgent, setSelectedAgent] = useAtom(anSelectedAgentAtom)
  const router = useAgentsRouter()
  const [tab, setTab] = useState<ConfigTab>("agent")

  const { data: configs, isLoading } = api.agentConfigs.listConfigs.useQuery(
    { teamId: teamId! },
    { enabled: !!teamId },
  )

  const [selectedConfigId, setSelectedConfigId] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [runtime, setRuntime] = useState("claude-code")
  const [model, setModel] = useState("claude-sonnet-4-6")
  const [allowedModels, setAllowedModels] = useState<string[]>(["claude-sonnet-4-6"])
  const [systemPrompt, setSystemPrompt] = useState("")
  const [allowedTools, setAllowedTools] = useState<string[]>([...ALL_TOOLS])
  const [maxTurns, setMaxTurns] = useState(50)
  const [visualConfig, setVisualConfig] = useState<VisualConfig | null>(null)
  const [activePreset, setActivePreset] = useState<string | null>(null)
  const [attachmentsEnabled, setAttachmentsEnabled] = useState(false)
  const [allowedAttachTypes, setAllowedAttachTypes] = useState<AttachmentType[]>([])
  const [customExtensions, setCustomExtensions] = useState("")
  const [chatKey, setChatKey] = useState(0)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle")
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const saveStartRef = useRef<number>(0)

  const utils = api.useUtils()
  const updateMutation = api.agentConfigs.updateConfig.useMutation({
    onMutate: () => { saveStartRef.current = Date.now(); setSaveState("saving") },
    onSuccess: () => {
      utils.agentConfigs.listConfigs.invalidate({ teamId: teamId! })
      const elapsed = Date.now() - saveStartRef.current
      const remaining = Math.max(0, 500 - elapsed)
      setTimeout(() => {
        setSaveState("saved")
        if (savedTimerRef.current) clearTimeout(savedTimerRef.current)
        savedTimerRef.current = setTimeout(() => setSaveState("idle"), 2000)
      }, remaining)
    },
    onError: () => {
      const elapsed = Date.now() - saveStartRef.current
      const remaining = Math.max(0, 500 - elapsed)
      setTimeout(() => setSaveState("idle"), remaining)
    },
  })

  const deleteMutation = api.agentConfigs.deleteConfig.useMutation({
    onSuccess: () => {
      utils.agentConfigs.listConfigs.invalidate({ teamId: teamId! })
      const remaining = configs?.filter((c) => c.id !== selectedConfigId)
      if (remaining?.length) {
        const next = remaining[0]!
        setSelectedConfigId(next.id)
        setSelectedAgent({ id: next.id, name: next.name, slug: next.slug })
        setName(next.name)
        setRuntime(next.runtime ?? "claude-code")
        setModel(next.model)
        setSystemPrompt(next.system_prompt ?? "")
        setAllowedTools(next.allowed_tools)
        setMaxTurns(next.max_turns)
        const vcRaw = (next as any).visual_config as (VisualConfig & { _allowedModels?: string[]; _attachments?: any }) | null
        setAllowedModels(vcRaw?._allowedModels ?? [next.model])
        const att = vcRaw?._attachments
        if (att) { setAttachmentsEnabled(att.enabled ?? false); setAllowedAttachTypes(att.allowedTypes ?? []); setCustomExtensions(att.customExtensions ?? "") }
        else { setAttachmentsEnabled(false); setAllowedAttachTypes([]); setCustomExtensions("") }
        if (vcRaw) { const { _allowedModels, _attachments, ...clean } = vcRaw; setVisualConfig(clean as VisualConfig) } else { setVisualConfig(null) }
        setActivePreset(detectPreset(vcRaw ? (() => { const { _allowedModels, _attachments, ...c } = vcRaw; return c as VisualConfig })() : null))
        setSaveState("idle")
      } else {
        setSelectedConfigId(null)
        setSelectedAgent(null)
        router.push("/agents/app")
      }
      setShowDeleteDialog(false)
      setDeleteConfirmation("")
    },
  })

  // Sync config page with sidebar selection
  useEffect(() => {
    if (!configs?.length) return
    // Prefer sidebar-selected agent, fall back to first
    const target = selectedAgent
      ? configs.find((c) => c.id === selectedAgent.id) ?? configs[0]!
      : configs[0]!
    if (target.id !== selectedConfigId) {
      loadConfig(target.id)
    }
  }, [configs, selectedAgent?.id])

  function loadConfig(id: string) {
    const c = configs?.find((c) => c.id === id)
    if (!c) return
    setSelectedConfigId(c.id)
    setSelectedAgent({ id: c.id, name: c.name, slug: c.slug })
    setName(c.name)
    setRuntime(c.runtime ?? "claude-code")
    setModel(c.model)
    setSystemPrompt(c.system_prompt ?? "")
    setAllowedTools(c.allowed_tools)
    setMaxTurns(c.max_turns)
    const vcRaw = (c as any).visual_config as (VisualConfig & { _allowedModels?: string[]; _attachments?: any }) | null
    setAllowedModels(vcRaw?._allowedModels ?? [c.model])
    const att = vcRaw?._attachments
    if (att) { setAttachmentsEnabled(att.enabled ?? false); setAllowedAttachTypes(att.allowedTypes ?? []); setCustomExtensions(att.customExtensions ?? "") }
    else { setAttachmentsEnabled(false); setAllowedAttachTypes([]); setCustomExtensions("") }
    if (vcRaw) { const { _allowedModels, _attachments, ...clean } = vcRaw; setVisualConfig(clean as VisualConfig) } else { setVisualConfig(null) }
    setActivePreset(detectPreset(vcRaw ? (() => { const { _allowedModels, _attachments, ...c } = vcRaw; return c as VisualConfig })() : null))
    setSaveState("idle")
  }

  // Dirty check
  const selectedConfig = configs?.find((c) => c.id === selectedConfigId)
  const isDirty = useMemo(() => {
    if (!selectedConfig) return false
    if (selectedConfig.name !== name) return true
    if ((selectedConfig.runtime ?? "claude-code") !== runtime) return true
    if (selectedConfig.model !== model) return true
    if ((selectedConfig.system_prompt ?? "") !== systemPrompt) return true
    if (selectedConfig.max_turns !== maxTurns) return true
    const savedTools = [...selectedConfig.allowed_tools].sort()
    const currentTools = [...allowedTools].sort()
    if (savedTools.length !== currentTools.length) return true
    if (savedTools.some((t, i) => t !== currentTools[i])) return true
    // Compare visual config + bundled fields (_allowedModels, _attachments)
    const savedVcRaw = (selectedConfig as any).visual_config as any
    const savedVcClean = savedVcRaw ? (() => { const { _allowedModels, _attachments, ...c } = savedVcRaw; return c })() : null
    if (JSON.stringify(savedVcClean ?? null) !== JSON.stringify(visualConfig ?? null)) return true
    const savedAm = savedVcRaw?._allowedModels ?? [selectedConfig.model]
    if (JSON.stringify(savedAm) !== JSON.stringify(allowedModels)) return true
    const savedAtt = savedVcRaw?._attachments
    if ((savedAtt?.enabled ?? false) !== attachmentsEnabled) return true
    if (JSON.stringify(savedAtt?.allowedTypes ?? []) !== JSON.stringify(allowedAttachTypes)) return true
    if ((savedAtt?.customExtensions ?? "") !== customExtensions) return true
    return false
  }, [selectedConfig, name, runtime, model, systemPrompt, maxTurns, allowedTools, visualConfig, allowedModels, attachmentsEnabled, allowedAttachTypes, customExtensions])

  const handleSave = useCallback(() => {
    if (!selectedConfigId || !isDirty) return
    // Bundle _allowedModels and _attachments into visualConfig JSON
    const vcToSave = visualConfig
      ? { ...visualConfig, _allowedModels: allowedModels, _attachments: { enabled: attachmentsEnabled, allowedTypes: allowedAttachTypes, customExtensions } }
      : { _allowedModels: allowedModels, _attachments: { enabled: attachmentsEnabled, allowedTypes: allowedAttachTypes, customExtensions } }
    updateMutation.mutate({
      id: selectedConfigId,
      name,
      runtime: runtime as "claude-code" | "codex",
      model,
      systemPrompt: systemPrompt || null,
      allowedTools,
      maxTurns,
      permissionMode: "bypassPermissions",
      visualConfig: vcToSave,
    })
  }, [selectedConfigId, isDirty, name, runtime, model, systemPrompt, allowedTools, maxTurns, visualConfig, allowedModels, attachmentsEnabled, allowedAttachTypes, customExtensions, updateMutation])

  // Visual config adapter for VisualConfigTab
  const effectiveVc = visualConfig ?? DEFAULT_VC

  const configAdapter = useMemo(
    () =>
      ({
        visual: effectiveVc,
        activePreset,
        attachments: { enabled: attachmentsEnabled, allowedTypes: allowedAttachTypes, customExtensions },
        allowedModels: allowedModels,
        modes: { available: [], defaultMode: "agent" },
      }) as unknown as AgentConfig,
    [effectiveVc, activePreset, attachmentsEnabled, allowedAttachTypes, customExtensions, allowedModels],
  )

  const visualDispatch = useCallback((action: PlaygroundAction) => {
    if (action.type === "SET_VISUAL") {
      setVisualConfig((prev) => {
        const base = prev ?? DEFAULT_VC
        const newVisual = { ...base, ...action.payload }
        if (action.payload.toolCallStyle) {
          Object.assign(newVisual, TOOL_CALL_STYLE_DEFAULTS[action.payload.toolCallStyle])
        }
        return newVisual
      })
      setActivePreset(null)
    } else if (action.type === "LOAD_VISUAL_PRESET") {
      const preset = VISUAL_PRESETS[action.payload]
      if (preset) {
        setVisualConfig({ ...preset.config })
        setActivePreset(action.payload)
      }
    }
  }, [])

  // Theme download/copy
  const [copied, setCopied] = useState(false)
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const themeJson = useMemo(() => generateThemeJson(effectiveVc), [effectiveVc])

  const handleDownloadTheme = useCallback(() => {
    const blob = new Blob([themeJson], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "theme.json"
    a.click()
    URL.revokeObjectURL(url)
    // Silently save visual config to DB on download
    if (selectedConfigId) {
      const vcToSave = visualConfig
        ? { ...visualConfig, _allowedModels: allowedModels, _attachments: { enabled: attachmentsEnabled, allowedTypes: allowedAttachTypes, customExtensions } }
        : { _allowedModels: allowedModels, _attachments: { enabled: attachmentsEnabled, allowedTypes: allowedAttachTypes, customExtensions } }
      updateMutation.mutate({ id: selectedConfigId, visualConfig: vcToSave })
    }
  }, [themeJson, selectedConfigId, visualConfig, allowedModels, attachmentsEnabled, allowedAttachTypes, customExtensions, updateMutation])

  const handleCopyTheme = useCallback(async () => {
    await navigator.clipboard.writeText(themeJson)
    setCopied(true)
    if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current)
    copiedTimerRef.current = setTimeout(() => setCopied(false), 2000)
  }, [themeJson])

  if (!teamId || isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <AnLogoSpinner />
      </div>
    )
  }

  if (!configs?.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <div className="text-center space-y-1">
          <p className="text-[15px] font-medium text-foreground">No agents yet</p>
          <p className="text-[13px] text-muted-foreground">Create your first agent to get started</p>
        </div>
        <button
          onClick={() => router.push("/agents/app")}
          className="h-9 px-4 rounded-lg bg-foreground text-background text-[13px] font-medium hover:bg-foreground/90 transition-colors active:scale-[0.98]"
        >
          Create Agent
        </button>
      </div>
    )
  }

  const activeModels = MODELS[runtime] ?? []

  return (
    <div className="flex h-full">
      {/* ── Left: Config panel ── */}
      <div className="w-[340px] shrink-0 flex flex-col border-r border-border" style={{ borderRightWidth: "0.5px" }}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 h-10 shrink-0" style={{ borderBottomWidth: "0.5px" }}>
          <span className="text-[10px] font-medium text-foreground/50 uppercase tracking-widest">
            Configuration
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all active:scale-95">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={() => setShowDeleteDialog(true)}
                className="data-[highlighted]:bg-red-500/15 data-[highlighted]:text-red-400 focus:bg-red-500/15 focus:text-red-400"
              >
                Delete agent
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Tab switcher */}
        <div className="px-4 py-2 border-b border-border shrink-0" style={{ borderBottomWidth: "0.5px" }}>
          <div
            role="tablist"
            aria-label="Configuration tabs"
            className="relative bg-foreground/[0.06] rounded-lg h-8 p-0.5 flex w-full"
          >
            {([
              { id: "agent" as const, label: "Agent" },
              { id: "visual" as const, label: "Visual" },
            ]).map((t, idx, arr) => {
              const isActive = tab === t.id
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`config-tabpanel-${t.id}`}
                  id={`config-tab-${t.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setTab(t.id)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                      e.preventDefault()
                      const nextId = arr[(idx + 1) % arr.length]!.id
                      setTab(nextId)
                      document.getElementById(`config-tab-${nextId}`)?.focus()
                    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                      e.preventDefault()
                      const prevId = arr[(idx - 1 + arr.length) % arr.length]!.id
                      setTab(prevId)
                      document.getElementById(`config-tab-${prevId}`)?.focus()
                    }
                  }}
                  className={`an-focus-btn relative flex-1 flex items-center justify-center gap-1.5 text-[11px] font-medium rounded-md transition-colors duration-200 ${
                    isActive
                      ? "text-foreground"
                      : "text-foreground/50 hover:text-foreground/70"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="config-page-tab-indicator"
                      className="absolute inset-0 bg-foreground/[0.12] rounded-md shadow-sm"
                      transition={{
                        type: "spring",
                        bounce: 0.15,
                        duration: 0.4,
                      }}
                    />
                  )}
                  <span className="relative z-10">{t.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab content */}
        <div
          className="flex-1 min-h-0 overflow-y-auto [&>*:last-child]:border-b-0"
          role="tabpanel"
          id={`config-tabpanel-${tab}`}
          aria-labelledby={`config-tab-${tab}`}
        >
          {tab === "agent" ? (
            <>
              {/* Name */}
              <ConfigSection overline="Name" delay={0.02}>
                <input
                  aria-label="Agent name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="an-focus-input w-full h-8 rounded-md bg-foreground/[0.05] border border-border hover:border-foreground/15 px-2.5 text-[13px] text-foreground placeholder:text-foreground/40"
                  placeholder="My Agent"
                  maxLength={100}
                />
              </ConfigSection>

              {/* System Prompt */}
              <ConfigSection overline="System Prompt" delay={0.06}>
                <div className="relative">
                  <textarea
                    aria-label="System prompt"
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    rows={4}
                    className="an-focus-input w-full rounded-md bg-foreground/[0.07] border border-foreground/[0.12] px-3 py-2 text-[12px] font-mono text-foreground/90 placeholder:text-foreground/50 resize-none leading-relaxed"
                    placeholder="You are a helpful assistant that..."
                    maxLength={4000}
                  />
                  <span className="absolute bottom-2.5 right-2.5 text-[10px] text-foreground/40">
                    {systemPrompt.length} / 4000
                  </span>
                </div>
              </ConfigSection>

              {/* Runtime & Model */}
              <ConfigSection overline="Runtime & Model" delay={0.10}>
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] text-foreground/55 mb-1.5 block">
                      Runtime
                    </label>
                    <SegmentedControl
                      value={runtime}
                      options={RUNTIMES}
                      onChange={(id) => {
                        setRuntime(id)
                        const newDefault = MODELS[id]?.[0]?.id ?? model
                        setModel(newDefault)
                        setAllowedModels([newDefault])
                      }}
                      layoutId="config-runtime-indicator"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-foreground/55 mb-1.5 block">
                      Default model
                    </label>
                    <SegmentedControl
                      value={model}
                      options={activeModels}
                      onChange={(id) => {
                        setModel(id)
                        if (allowedModels.length <= 1) {
                          setAllowedModels([id])
                        } else if (!allowedModels.includes(id)) {
                          setAllowedModels((prev) => [...prev, id])
                        }
                      }}
                      layoutId="config-model-indicator"
                    />
                  </div>

                  {/* Allow model switching */}
                  <SwitchRow
                    label="Allow model switching"
                    description="Let users switch between models"
                    checked={allowedModels.length > 1}
                    onCheckedChange={(enabled) => {
                      if (!enabled) {
                        setAllowedModels([model])
                      } else {
                        setAllowedModels(activeModels.map((m) => m.id))
                        setVisualConfig((prev) => prev ? { ...prev, modelSelectorPosition: "input-bar" as const } : prev)
                      }
                    }}
                  />
                  <AnimatePresence>
                    {allowedModels.length > 1 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-1.5"
                      >
                        {activeModels.map((m) => {
                          const isDefault = m.id === model
                          const isAllowed = allowedModels.includes(m.id)
                          return (
                            <div
                              key={m.id}
                              className={isDefault ? "opacity-50 pointer-events-none" : ""}
                            >
                              <CheckboxRow
                                checked={isAllowed}
                                onChange={(checked) => {
                                  if (isDefault) return
                                  const next = checked
                                    ? [...allowedModels, m.id]
                                    : allowedModels.filter((id) => id !== m.id)
                                  if (next.length < 2) return
                                  setAllowedModels(next)
                                }}
                                label={`${m.label}${isDefault ? " (default)" : ""}`}
                              />
                            </div>
                          )
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ConfigSection>

              {/* Attachments */}
              <ConfigSection overline="Attachments" delay={0.14}>
                <div className="space-y-3">
                  <SwitchRow
                    label="Allow file attachments"
                    description="Let users upload files to the conversation"
                    checked={attachmentsEnabled}
                    onCheckedChange={setAttachmentsEnabled}
                  />
                  <AnimatePresence>
                    {attachmentsEnabled && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-3"
                      >
                        <div className="space-y-1.5">
                          <label className="text-[11px] text-foreground/50 block">
                            Allowed file types
                          </label>
                          {ATTACHMENT_TYPE_OPTIONS.map((at) => {
                            const isAll = at.id === "all"
                            const isChecked = allowedAttachTypes.includes(at.id)
                            return (
                              <CheckboxRow
                                key={at.id}
                                checked={isChecked}
                                onChange={(checked) => {
                                  let next: AttachmentType[]
                                  if (isAll) {
                                    next = checked ? ["all"] : []
                                  } else if (checked) {
                                    next = [...allowedAttachTypes.filter((t) => t !== "all"), at.id]
                                  } else {
                                    next = allowedAttachTypes.filter((t) => t !== at.id)
                                  }
                                  setAllowedAttachTypes(next)
                                }}
                                label={at.label}
                                description={at.extensions}
                              />
                            )
                          })}
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] text-foreground/50 block">
                            Custom extensions
                          </label>
                          <input
                            type="text"
                            value={customExtensions}
                            onChange={(e) => setCustomExtensions(e.target.value)}
                            placeholder=".csv, .xlsx, .sql, .env"
                            className="an-focus-input w-full h-8 rounded-md border border-border bg-foreground/[0.06] px-2.5 text-[12px] text-foreground/80 placeholder:text-foreground/40"
                          />
                          <p className="text-[10px] text-foreground/40">
                            Comma-separated file extensions
                          </p>
                        </div>
                        <div>
                          <label className="text-[11px] text-foreground/50 block mb-1.5">
                            Attach button icon
                          </label>
                          <SegmentedControl<AttachmentButtonStyle>
                            value={effectiveVc.attachmentButtonStyle}
                            options={[
                              { id: "plus-circle", label: "Plus" },
                              { id: "paperclip", label: "Paperclip" },
                            ]}
                            onChange={(id) =>
                              setVisualConfig((prev) => ({
                                ...(prev ?? DEFAULT_VC),
                                attachmentButtonStyle: id,
                              }))
                            }
                            layoutId="config-attach-icon"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ConfigSection>

              {/* Tools */}
              <ConfigSection overline={`Tools (${allowedTools.length}/${ALL_TOOLS.length})`} delay={0.18}>
                <div className="space-y-3">
                  {TOOL_CATEGORIES.map((cat) => (
                    <div key={cat.name}>
                      <label className="text-[11px] text-foreground/50 mb-1.5 block">
                        {cat.name}
                      </label>
                      <div className="space-y-1.5">
                        {cat.tools.map((tool) => (
                          <CheckboxRow
                            key={tool}
                            checked={allowedTools.includes(tool)}
                            onChange={(checked) =>
                              setAllowedTools((prev) =>
                                checked
                                  ? [...prev, tool]
                                  : prev.filter((t) => t !== tool),
                              )
                            }
                            label={tool}
                            description={TOOL_DESCRIPTIONS[tool]}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ConfigSection>

              {/* Max Turns */}
              <ConfigSection overline="Max Turns" delay={0.22}>
                <TurnsInput value={maxTurns} onChange={setMaxTurns} />
              </ConfigSection>
            </>
          ) : (
            <VisualConfigTab config={configAdapter} dispatch={visualDispatch} />
          )}
        </div>

        {/* Footer — fixed at bottom */}
        <div className="shrink-0 border-t border-border px-4 py-2 flex flex-col gap-2" style={{ borderTopWidth: "0.5px" }}>
          {/* Primary button — morphs between Save / Download / Saved */}
          <button
            onClick={tab === "agent" ? handleSave : handleDownloadTheme}
            disabled={tab === "agent" ? (saveState === "saving" || !isDirty) : false}
            className="relative w-full overflow-hidden rounded-[10px] bg-foreground h-10 text-[14px] font-medium text-background transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-40"
          >
            {/* Save label */}
            <span
              className={cn(
                "absolute inset-0 flex items-center justify-center transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                tab === "agent" && saveState === "idle"
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-full opacity-0"
              )}
            >
              Save
            </span>
            {/* Saving spinner */}
            <span
              className={cn(
                "absolute inset-0 flex items-center justify-center transition-[opacity,transform] duration-200 ease-out",
                tab === "agent" && saveState === "saving"
                  ? "translate-y-0 opacity-100"
                  : tab === "agent" && saveState === "saved"
                    ? "-translate-y-full opacity-0"
                    : "translate-y-full opacity-0"
              )}
            >
              <Spinner size={16} color="currentColor" />
            </span>
            {/* Saved label */}
            <span
              className={cn(
                "absolute inset-0 flex items-center justify-center gap-1.5 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                tab === "agent" && saveState === "saved"
                  ? "translate-y-0 opacity-100"
                  : tab === "agent" && saveState === "idle"
                    ? "-translate-y-full opacity-0"
                    : "translate-y-full opacity-0"
              )}
            >
              <Check className="h-4 w-4" /> Saved
            </span>
            {/* Download label */}
            <span
              className={cn(
                "absolute inset-0 flex items-center justify-center gap-2 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                tab === "visual"
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-full opacity-0"
              )}
            >
              <Download className="h-4 w-4" />
              Download theme.json
            </span>
          </button>

          {/* Copy theme — slides in from below on visual tab */}
          <div
            className={cn(
              "grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
              tab === "visual"
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            )}
          >
            <div className="overflow-hidden">
              <button
                onClick={handleCopyTheme}
                className="w-full rounded-[10px] border border-border py-2 text-[13px] font-medium text-foreground/70 transition-all hover:bg-foreground/[0.05] hover:text-foreground active:scale-[0.99] flex items-center justify-center gap-2"
              >
                {copied ? (
                  <><Check className="h-3.5 w-3.5" /> Copied!</>
                ) : (
                  <><Copy className="h-3.5 w-3.5" /> Copy theme</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: Live chat ── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Chat header */}
        <div className="flex items-center justify-between border-b border-border px-4 h-10 shrink-0" style={{ borderBottomWidth: "0.5px" }}>
          <span className="text-[10px] font-medium text-foreground/50 uppercase tracking-widest">
            Live Chat
          </span>
          <button
            onClick={() => setChatKey((k) => k + 1)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all active:scale-95"
            aria-label="New chat"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
        </div>

        {/* Chat body */}
        <div className="flex-1 min-h-0">
          {teamId && selectedConfig ? (
            <LiveChat
              key={chatKey}
              teamId={teamId}
              agentSlug={selectedConfig.slug}
              visualConfig={visualConfig}
              attachmentsEnabled={attachmentsEnabled}
              allowedModels={activeModels.filter((m) => allowedModels.includes(m.id)).map((m) => ({ id: m.id, name: m.name, version: m.version }))}
              defaultModelId={model}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-[13px] text-muted-foreground">Select an agent to chat</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Dialog */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {showDeleteDialog && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: [0.55, 0.055, 0.675, 0.19] }}
                className="fixed inset-0 z-[45] bg-black/25"
                onClick={() => { if (!deleteMutation.isPending) { setShowDeleteDialog(false); setDeleteConfirmation("") } }}
              />
              <div className="fixed inset-0 z-[46] flex items-center justify-center pointer-events-none">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.55, 0.055, 0.675, 0.19] }}
                  className="w-[90vw] max-w-[400px] pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="bg-background rounded-2xl border border-border/50 overflow-hidden" style={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)" }}>
                    <div className="px-5 pt-4 pb-4 space-y-3">
                      <div>
                        <h2 className="text-[15px] font-semibold">Delete Agent</h2>
                        <p className="text-[12px] text-muted-foreground mt-1.5 leading-relaxed">
                          This will permanently delete the agent, all conversations, configurations, and API keys. This action cannot be undone.
                        </p>
                      </div>
                      <div>
                        <p className="text-[12px] text-muted-foreground mb-1.5">
                          Type{" "}
                          <code
                            className="px-1 py-0.5 bg-muted rounded text-foreground font-medium text-[11px] select-all"
                            onClick={(e) => {
                              const range = document.createRange()
                              range.selectNodeContents(e.currentTarget)
                              const sel = window.getSelection()
                              sel?.removeAllRanges()
                              sel?.addRange(range)
                            }}
                          >
                            {selectedConfig?.name}
                          </code>{" "}
                          to confirm
                        </p>
                        <input
                          value={deleteConfirmation}
                          onChange={(e) => setDeleteConfirmation(e.target.value)}
                          placeholder={selectedConfig?.name}
                          disabled={deleteMutation.isPending}
                          autoComplete="off"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && deleteConfirmation === selectedConfig?.name && !deleteMutation.isPending) {
                              if (selectedConfigId) deleteMutation.mutate({ id: selectedConfigId })
                            }
                            if (e.key === "Escape") { setShowDeleteDialog(false); setDeleteConfirmation("") }
                          }}
                          className="an-focus-input w-full h-9 rounded-lg bg-foreground/[0.05] border border-border hover:border-foreground/15 px-3 text-[13px] text-foreground placeholder:text-foreground/30 disabled:opacity-50"
                        />
                      </div>
                    </div>
                    <div className="bg-muted/50 px-5 py-3 flex justify-between" style={{ boxShadow: "inset 0 1px 0 0 var(--border), inset 0 2px 0 0 var(--background)" }}>
                      <button
                        onClick={() => { setShowDeleteDialog(false); setDeleteConfirmation("") }}
                        disabled={deleteMutation.isPending}
                        className="h-8 px-3 rounded-lg text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          if (selectedConfigId) deleteMutation.mutate({ id: selectedConfigId })
                        }}
                        disabled={deleteMutation.isPending || deleteConfirmation !== selectedConfig?.name}
                        className="relative h-8 min-w-[72px] px-3 rounded-lg bg-destructive text-destructive-foreground text-[12px] font-medium hover:bg-destructive/90 transition-colors disabled:opacity-40 overflow-hidden"
                      >
                        <span className={deleteMutation.isPending ? "opacity-0" : ""}>Delete</span>
                        <AnimatePresence>
                          {deleteMutation.isPending && (
                            <motion.span
                              initial={{ y: 12, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              exit={{ y: -12, opacity: 0 }}
                              transition={{ duration: 0.15 }}
                              className="absolute inset-0 flex items-center justify-center"
                            >
                              <Spinner size={14} color="currentColor" />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  )
}
