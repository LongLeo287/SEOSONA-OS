"use client"

import { useState, useEffect, useMemo, useRef, useCallback, Suspense } from "react"
import { useAgentsRouter } from "@/hooks/use-agents-router"
import { api } from "@/trpc/client"
import { useAtom, useAtomValue } from "jotai"
import { selectedTeamIdAtom } from "@/lib/atoms/team"
import { anSelectedAgentAtom } from "@/lib/atoms/an-agent"
import { toast } from "sonner"
import { Spinner } from "@/components/icons/spinner"
import { cn } from "@/lib/utils"
import { WizardShell } from "@/components/features/agents/an/wizard/wizard-shell"
import { UserAvatarMenu } from "@/components/features/agents/an/wizard/user-avatar-menu"
import { useCrossFade } from "@/components/features/agents/an/wizard/use-cross-fade"
import { IdentityStep } from "@/components/features/agents/an/dashboard/onboarding/steps/identity-step"
import {
  defaultOnboardingState,
  type OnboardingState,
} from "@/components/features/agents/an/dashboard/onboarding/atoms"
import { useAgentsSession, useAgentsSignOut } from "@/lib/agents/auth/client"
import { agentsHref } from "@/lib/utils/agents-href"
import dynamic from "next/dynamic"
import { VISUAL_PRESETS } from "@/components/features/agents/an/types"
import type { VisualConfig } from "@/components/features/agents/an/types"
import { Copy, ClipboardCheck } from "lucide-react"
import { generateIntegrationMarkdown } from "@/components/features/agents/an/utils/generate-integration-markdown"
import { generateThemeJson } from "@/components/features/agents/an/playground/use-playground-state"

/* ── Lazy-loaded heavy components ── */

const themeStepImport = () =>
  import(
    "@/components/features/agents/an/dashboard/onboarding/steps/theme-step"
  ).then((m) => ({ default: m.ThemeStep }))

const ThemeStep = dynamic(themeStepImport, { ssr: false })

const unifiedPreviewImport = () =>
  import("@/components/features/agents/an/chat-preview/unified-preview").then(
    (m) => ({ default: m.UnifiedChatPreview }),
  )

const UnifiedChatPreview = dynamic(unifiedPreviewImport, { ssr: false })

/* ── Types ── */

type AgentStep = "identity" | "theme" | "success"

/* ── Wizard ── */

function NewAgentWizard() {
  const router = useAgentsRouter()
  const signOut = useAgentsSignOut()
  const { isSignedIn } = useAgentsSession()
  const teamId = useAtomValue(selectedTeamIdAtom)
  const [, setSelectedAgent] = useAtom(anSelectedAgentAtom)

  /* ── State ── */

  const [step, setStep] = useState<AgentStep>("identity")
  const [agentState, setAgentState] = useState<OnboardingState>(defaultOnboardingState)
  const [creating, setCreating] = useState(false)
  const [createdAgent, setCreatedAgent] = useState<{ id: string; name: string; slug: string } | null>(null)
  const [promptCopied, setPromptCopied] = useState(false)

  /* ── Mutations ── */

  const utils = api.useUtils()
  const createAgentMutation = api.agentConfigs.createConfig.useMutation()

  /* ── Create agent handler ── */

  async function handleCreateAgent() {
    if (!teamId || !agentState.agentName.trim()) return
    setCreating(true)

    try {
      const agent = await createAgentMutation.mutateAsync({
        teamId,
        name: agentState.agentName.trim(),
        slug: agentState.agentSlug || undefined,
        runtime: agentState.runtime,
      })

      await utils.agentConfigs.listConfigs.invalidate()
      setSelectedAgent({ id: agent.id, name: agent.name, slug: agent.slug })
      setCreatedAgent({ id: agent.id, name: agent.name, slug: agent.slug })
      setStep("success")
    } catch (err: any) {
      toast.error(err.message || "Failed to create agent")
    } finally {
      setCreating(false)
    }
  }

  function handleCopyPrompt() {
    if (!createdAgent) return
    const slug = createdAgent.slug || "my-agent"
    const themeJson = visualConfig ? generateThemeJson(visualConfig) : null
    const md = generateIntegrationMarkdown(slug, undefined, themeJson)
    navigator.clipboard.writeText(md)
    setPromptCopied(true)
    setTimeout(() => setPromptCopied(false), 2000)
  }

  /* ── Cross-fade animation ── */

  const { activeStep, stepsToRender } = useCrossFade(step)

  /* ── Layout ── */

  const isThemeStep = step === "theme"
  const isCustomTheme = isThemeStep && agentState.theme === "custom"

  /* ── Computed visual config ── */

  const visualConfig: VisualConfig = useMemo(() => {
    if (agentState.visualConfig) {
      return { ...agentState.visualConfig, primaryColor: agentState.primaryColor }
    }
    const themeKey = agentState.theme || "notion"
    if (themeKey !== "custom") {
      const preset = VISUAL_PRESETS[themeKey]
      if (preset) return { ...preset.config, primaryColor: agentState.primaryColor }
    }
    return { ...VISUAL_PRESETS["notion"]!.config, primaryColor: agentState.primaryColor }
  }, [agentState.theme, agentState.primaryColor, agentState.visualConfig])

  /* ── Chat preview replay ── */

  const replayRef = useRef<(() => void) | null>(null)
  const loopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleAnimationComplete = useCallback(() => {
    if (loopTimerRef.current) clearTimeout(loopTimerRef.current)
    loopTimerRef.current = setTimeout(() => replayRef.current?.(), 2000)
  }, [])

  useEffect(() => () => { if (loopTimerRef.current) clearTimeout(loopTimerRef.current) }, [])

  /* ── Preload ── */

  useEffect(() => {
    if (step === "identity") { themeStepImport(); unifiedPreviewImport() }
  }, [step])

  /* ── Navigation ── */

  const STEPS: AgentStep[] = ["identity", "theme", "success"]
  const currentIndex = STEPS.indexOf(step)

  function handleBack() {
    if (currentIndex <= 0) {
      router.push("/agents/overview")
      return
    }
    setStep(STEPS[currentIndex - 1]!)
  }

  const showBackButton = step === "success" ? undefined : handleBack
  const wide = isThemeStep && !isCustomTheme

  return (
    <WizardShell
      onBack={showBackButton}
      wide={wide}
      fullscreen={isCustomTheme}
      rightSlot={
        isSignedIn ? (
          <UserAvatarMenu
            onSignOut={() => signOut(agentsHref("/agents"))}
            onSwitchAccount={() => signOut(agentsHref("/agents/app"))}
          />
        ) : undefined
      }
    >
      <div
        className={cn("flex", isCustomTheme ? "items-stretch" : "items-center")}
        style={{
          gap: isThemeStep ? "24px" : "0px",
          height: isCustomTheme ? "calc(100vh - 80px)" : "auto",
          transition: "gap 500ms cubic-bezier(0.22,1,0.36,1), height 500ms cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <div
          className="shrink-0 min-h-0 flex flex-col"
          style={{
            width: "340px",
            transition: "width 500ms cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {/* Content area — maxHeight animates for smooth step transitions; overflow-y clips vertically, overflow-x visible preserves focus rings */}
          <div
            className={isCustomTheme ? "flex-1 min-h-0 flex flex-col" : "flex-1 min-h-0"}
            style={isCustomTheme ? undefined : {
              maxHeight: activeStep === "success" ? "240px" : "608px",
              overflowX: "visible",
              overflowY: "clip",
              transition: "max-height 500ms cubic-bezier(0.22,1,0.36,1)",
            }}
          >
          <div
            className={isCustomTheme ? "flex-1 min-h-0 grid" : "grid"}
            style={{ gridTemplateColumns: "1fr", alignItems: isCustomTheme ? "stretch" : "start" }}
          >
            {stepsToRender.map((s) => {
              const isActive = s === activeStep
              return (
                <div
                  key={s}
                  style={{
                    gridArea: "1 / 1",
                    minHeight: 0,
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateY(0) scale(1)" : "translateY(6px) scale(0.99)",
                    pointerEvents: isActive ? "auto" : "none",
                    transition: "opacity 400ms cubic-bezier(0.22,1,0.36,1), transform 400ms cubic-bezier(0.22,1,0.36,1)",
                  }}
                >
                  {/* ─── Identity Step ─── */}
                  {s === "identity" && (
                    <div>
                      <IdentityStep state={agentState} setState={setAgentState} isActive={isActive} />
                      <div className="mt-6">
                        <button
                          onClick={() => setStep("theme")}
                          disabled={!agentState.agentName.trim()}
                          className="an-focus-btn flex w-full items-center justify-center h-10 rounded-lg bg-foreground text-background text-[14px] font-medium hover:bg-foreground/90 active:scale-[0.99] transition-all duration-150 disabled:opacity-40"
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ─── Theme Step ─── */}
                  {s === "theme" && (
                    <div className={isCustomTheme ? "flex flex-col h-full" : ""}>
                      <div className={isCustomTheme ? "flex-1 min-h-0" : ""}>
                        <ThemeStep state={agentState} setState={setAgentState} />
                      </div>
                      <div className={isCustomTheme ? "shrink-0 pt-4" : "mt-6"}>
                        <button
                          onClick={handleCreateAgent}
                          disabled={!agentState.theme || creating}
                          className="an-focus-btn relative flex w-full items-center justify-center h-10 rounded-lg bg-foreground text-background text-[14px] font-medium hover:bg-foreground/90 active:scale-[0.99] transition-all duration-150 disabled:opacity-40 overflow-hidden"
                        >
                          <span className={cn("transition-[opacity,transform] duration-200 ease-out", creating ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100")}>
                            Create Agent
                          </span>
                          <span className={cn("absolute inset-0 flex items-center justify-center gap-2 transition-[opacity,transform] duration-200 ease-out", creating ? "translate-y-0 opacity-100" : "translate-y-full opacity-0")}>
                            <Spinner size={16} color="hsl(var(--background))" />
                            Creating agent...
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ─── Success Step ─── */}
                  {s === "success" && createdAgent && (
                    <div className="max-w-[320px]">
                      <div className="mb-5">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground">
                            <svg className="h-3.5 w-3.5 text-background" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M13.5 4.5 6 12 2.5 8.5" />
                            </svg>
                          </div>
                          <span className="text-[13px] font-medium text-muted-foreground">Agent created</span>
                        </div>
                        <h1 className="text-xl font-semibold tracking-tight">Your agent is ready</h1>
                        <p className="mt-1.5 text-[14px] text-muted-foreground leading-relaxed">
                          Copy the integration prompt for your AI coding assistant, or head to the dashboard.
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={handleCopyPrompt}
                          className={cn(
                            "an-focus-btn flex flex-1 items-center justify-center gap-2 h-10 rounded-lg border text-[13px] font-medium transition-all duration-150 active:scale-[0.99]",
                            promptCopied
                              ? "border-foreground/15 bg-foreground/[0.06] text-foreground"
                              : "border-border bg-foreground/[0.04] text-foreground/70 hover:bg-foreground/[0.06] hover:text-foreground",
                          )}
                        >
                          {promptCopied ? (
                            <><ClipboardCheck className="h-3.5 w-3.5" /> Copied!</>
                          ) : (
                            <><Copy className="h-3.5 w-3.5" /> Copy prompt</>
                          )}
                        </button>
                        <button
                          onClick={() => router.push("/agents/overview")}
                          className="an-focus-btn flex flex-1 items-center justify-center h-10 rounded-lg bg-foreground text-background text-[13px] font-medium hover:bg-foreground/90 active:scale-[0.99] transition-all duration-150"
                        >
                          Go to Dashboard
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          </div>
        </div>

        {/* Right panel — chat preview (always mounted for CSS transitions) */}
        <div
          style={{
            opacity: isThemeStep ? 1 : 0,
            transform: isThemeStep ? "translateX(0)" : "translateX(24px)",
            width: isThemeStep ? undefined : "0px",
            overflow: "hidden",
            transition: "opacity 500ms cubic-bezier(0.22,1,0.36,1), transform 500ms cubic-bezier(0.22,1,0.36,1), width 500ms cubic-bezier(0.22,1,0.36,1)",
            transitionDelay: isThemeStep ? "100ms" : "0ms",
          }}
          className="flex-1 min-w-0"
          ref={(el) => { if (el) el.setAttribute("inert", "") }}
          aria-hidden="true"
        >
          {isThemeStep && (
            <div
              className="rounded-xl border border-border overflow-hidden"
              style={{ height: isCustomTheme ? "100%" : "480px" }}
            >
              <UnifiedChatPreview
                visualConfig={visualConfig}
                replayRef={replayRef}
                onComplete={handleAnimationComplete}
              />
            </div>
          )}
        </div>
      </div>
    </WizardShell>
  )
}

export default function NewAgentPage() {
  return (
    <Suspense>
      <NewAgentWizard />
    </Suspense>
  )
}
