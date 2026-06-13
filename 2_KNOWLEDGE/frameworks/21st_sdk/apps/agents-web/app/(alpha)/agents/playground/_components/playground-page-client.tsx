"use client"

import "@21st-sdk/react/styles.css"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { api } from "@/trpc/client"
import { useAtomValue, useAtom, useSetAtom } from "jotai"
import { selectedTeamIdAtom } from "@/lib/atoms/team"
import { anSelectedAgentAtom, anPlaygroundRestartAtom, anPlaygroundThemeToggleAtom } from "@/lib/atoms/an-agent"
import { cn } from "@/lib/utils"
import { Check, Download, Copy, Settings2 } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { AnLogoSpinner } from "@/components/features/agents/an/dashboard/an-logo-spinner"
import { SelectAgentPrompt } from "@/components/features/agents/an/dashboard/select-agent-prompt"
import { useAgentsRouter } from "@/hooks/use-agents-router"
import { useSearchParams } from "next/navigation"
import { Chat, useChat } from "ai-latest-react"
import { DefaultChatTransport } from "ai-latest"
import { AnAgentChat } from "@21st-sdk/react"
import type { AnTheme } from "@21st-sdk/react"
import type { VisualConfig, AgentConfig } from "@/components/features/agents/an/types"
import { VISUAL_PRESETS, TOOL_CALL_STYLE_DEFAULTS } from "@/components/features/agents/an/types"
import type { PlaygroundAction } from "@/components/features/agents/an/playground/playground-types"
import { VisualConfigTab } from "@/components/features/agents/an/playground/config/visual-config-tab"
import { generateThemeJson } from "@/components/features/agents/an/playground/use-playground-state"

const RELAY_URL = process.env.NEXT_PUBLIC_RELAY_URL || "https://relay.an.dev"

function IconDoubleChevronRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      width="20"
      height="20"
      {...props}
    >
      <path d="m5.492 4.158 5.4 5.4a.625.625 0 0 1 0 .884l-5.4 5.4a.625.625 0 1 1-.884-.884L9.566 10 4.608 5.042a.625.625 0 1 1 .884-.884" />
      <path d="m16.392 10.442-5.4 5.4a.625.625 0 0 1-.884-.884L15.066 10l-4.958-4.958a.625.625 0 0 1 .884-.884l5.4 5.4a.625.625 0 0 1 0 .884" />
    </svg>
  )
}

/* ── Constants ── */

const DEFAULT_VC = { ...VISUAL_PRESETS.notion!.config, showToolIcons: false, userMessageBg: "" }

function PlaygroundChat({
  teamId,
  agentSlug,
  theme,
}: {
  teamId: string
  agentSlug: string
  theme: AnTheme
}) {
  const { resolvedTheme } = useTheme()
  const colorMode = (resolvedTheme === "dark" ? "dark" : "light") as "light" | "dark"
  const chat = useMemo(() => {
    const fetchToken = async () => {
      const res = await fetch("/api/agents/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, agent: agentSlug }),
      })
      if (!res.ok) throw new Error("Failed to get token")
      const data = await res.json()
      return data.token as string
    }

    return new Chat({
      id: `dashboard-${agentSlug}-${Date.now()}`,
      transport: new DefaultChatTransport({
        api: `${RELAY_URL}/v1/chat/${agentSlug}`,
        headers: async () => {
          const token = await fetchToken()
          return { Authorization: `Bearer ${token}` }
        },
      }),
    })
  }, [teamId, agentSlug])

  const { messages, sendMessage, status, stop } = useChat({ chat })

  const handleSend = useCallback(
    (msg: { role: "user"; content: string }) => {
      sendMessage({ role: "user", parts: [{ type: "text", text: msg.content }] })
    },
    [sendMessage],
  )

  return (
    <AnAgentChat
      messages={messages}
      onSend={handleSend}
      status={status}
      onStop={() => stop()}
      theme={theme}
      colorMode={colorMode}
      className="h-full"
    />
  )
}

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

/* ── Page ── */

export function PlaygroundPageClient() {
  const teamId = useAtomValue(selectedTeamIdAtom)
  const [selectedAgent, setSelectedAgent] = useAtom(anSelectedAgentAtom)
  const router = useAgentsRouter()
  const searchParams = useSearchParams()
  const [showThemeBuilder, setShowThemeBuilder] = useState(searchParams.get("tab") === "visual")

  const { data: configs, isLoading } = api.agentConfigs.listConfigs.useQuery(
    { teamId: teamId! },
    { enabled: !!teamId },
  )

  const [selectedConfigId, setSelectedConfigId] = useState<string | null>(null)
  const [visualConfig, setVisualConfig] = useState<VisualConfig | null>(null)
  const [activePreset, setActivePreset] = useState<string | null>(null)
  const [chatKey, setChatKey] = useState(0)
  const setPlaygroundRestart = useSetAtom(anPlaygroundRestartAtom)
  const setPlaygroundThemeToggle = useSetAtom(anPlaygroundThemeToggleAtom)

  // Sync with sidebar selection
  useEffect(() => {
    if (!configs?.length) return
    const target = selectedAgent
      ? configs.find((c) => c.id === selectedAgent.id) ?? configs[0]!
      : configs[0]!
    if (target.id !== selectedConfigId) {
      setSelectedConfigId(target.id)
      setSelectedAgent({ id: target.id, name: target.name, slug: target.slug })
      setVisualConfig(null)
      setActivePreset(null)
    }
  }, [configs, selectedAgent?.id])

  // Register restart callback in dashboard header
  useEffect(() => {
    setPlaygroundRestart(() => () => setChatKey((k) => k + 1))
    return () => setPlaygroundRestart(null)
  }, [setPlaygroundRestart])

  // Register theme builder toggle in dashboard header
  useEffect(() => {
    setPlaygroundThemeToggle(() => () => setShowThemeBuilder((v) => !v))
    return () => setPlaygroundThemeToggle(null)
  }, [setPlaygroundThemeToggle])

  // Visual config adapter for VisualConfigTab
  const effectiveVc = visualConfig ?? DEFAULT_VC

  const configAdapter = useMemo(
    () =>
      ({
        visual: effectiveVc,
        activePreset,
        attachments: { enabled: false, allowedTypes: [], customExtensions: "" },
        allowedModels: [],
        modes: { available: [], defaultMode: "agent" },
      }) as unknown as AgentConfig,
    [effectiveVc, activePreset],
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
  }, [themeJson])

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

  if (!selectedAgent) {
    return <SelectAgentPrompt title="Playground" icon={Settings2} />
  }

  if (!configs?.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <div className="text-center space-y-1">
          <p className="text-[15px] font-medium text-foreground">No agents yet</p>
          <p className="text-[13px] text-muted-foreground">Deploy your first agent using the CLI</p>
        </div>
        <button
          onClick={() => router.push("/agents/app")}
          className="h-9 px-4 rounded-lg bg-foreground text-background text-[13px] font-medium hover:bg-foreground/90 transition-colors active:scale-[0.98]"
        >
          Get Started
        </button>
      </div>
    )
  }

  const selectedConfig = configs.find((c) => c.id === selectedConfigId)

  return (
    <div className="flex h-full">
      {/* ── Main: Live chat ── */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex-1 min-h-0">
          {teamId && selectedConfig ? (
            <PlaygroundChat
              key={chatKey}
              teamId={teamId}
              agentSlug={selectedConfig.slug}
              theme={JSON.parse(themeJson) as AnTheme}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-[13px] text-muted-foreground">Select an agent to chat</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Right: Theme builder (optional) ── */}
      <AnimatePresence>
        {showThemeBuilder && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 340, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="shrink-0 flex flex-col border-l border-border/50 overflow-hidden"
          >
            <div className="flex h-10 shrink-0 items-center gap-2 border-b border-border/50 px-2">
              <button
                onClick={() => setShowThemeBuilder(false)}
                className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-foreground transition-[background-color,transform] duration-150 ease-out hover:bg-foreground/10 active:scale-[0.97]"
                aria-label="Close theme builder"
              >
                <IconDoubleChevronRight className="h-4 w-4" />
              </button>
              <span className="text-xs font-medium text-foreground">Theme Builder</span>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">
              <VisualConfigTab config={configAdapter} dispatch={visualDispatch} />
            </div>
            <div className="shrink-0 border-t border-border/50 px-4 py-2 flex flex-col gap-2">
              <button
                onClick={handleDownloadTheme}
                className="an-focus-btn w-full rounded-[10px] bg-foreground h-10 text-[14px] font-medium text-background transition-all hover:opacity-90 active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download theme.json
              </button>
              <button
                onClick={handleCopyTheme}
                className="an-focus-btn w-full overflow-hidden rounded-[10px] border border-border h-9 text-[13px] font-medium text-foreground/70 transition-[background-color,transform] duration-150 ease-out hover:bg-foreground/[0.05] hover:text-foreground active:scale-[0.97]"
              >
                <div className="relative flex items-center justify-center h-full">
                  <span
                    className={cn(
                      "flex items-center justify-center gap-1.5 transition-[opacity,transform] duration-200 ease-out",
                      copied
                        ? "-translate-y-full opacity-0"
                        : "translate-y-0 opacity-100",
                    )}
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copy theme
                  </span>
                  <span
                    className={cn(
                      "absolute inset-0 flex items-center justify-center transition-[opacity,transform] duration-200 ease-out",
                      copied
                        ? "translate-y-0 opacity-100"
                        : "translate-y-full opacity-0",
                    )}
                  >
                    <Check className="h-4 w-4 text-muted-foreground" />
                  </span>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
