"use client"

import { useState, useMemo, useRef, useCallback, useEffect, Suspense } from "react"
import { useAgentsRouter } from "@/hooks/use-agents-router"
import { Copy, ClipboardCheck } from "lucide-react"
import { CopyIcon, CheckIcon } from "@/components/features/agents/an/docs/icons"
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

type WizardStep = "identity" | "theme" | "success"

type SuccessData = {
  agentName: string
  agentSlug: string
}

/* ── Wizard ── */

function NewProjectWizard() {
  const router = useAgentsRouter()
  const signOut = useAgentsSignOut()
  const { isSignedIn } = useAgentsSession()

  /* ── Wizard step state ── */

  const [step, setStep] = useState<WizardStep>("identity")
  const [success, setSuccess] = useState<SuccessData | null>(null)
  const [copied, setCopied] = useState(false)
  const [promptCopied, setPromptCopied] = useState(false)

  /* ── Agent onboarding state ── */

  const [agentState, setAgentState] = useState<OnboardingState>(defaultOnboardingState)

  /* ── Create agent handler (after theme step) ── */

  function handleCreateAgent() {
    if (!agentState.agentName.trim()) return

    const agentSlug =
      agentState.agentSlug ||
      agentState.agentName.trim().toLowerCase().replace(/\s+/g, "-")

    localStorage.setItem("an_onboarded", "1")
    setSuccess({
      agentName: agentState.agentName.trim(),
      agentSlug,
    })
    setStep("success")
  }

  function handleCopyEnv() {
    if (!success) return
    navigator.clipboard.writeText("API_KEY_21ST=21st_sk_...")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleCopyPrompt() {
    if (!success) return
    const themeJson = visualConfig ? generateThemeJson(visualConfig) : null
    const md = generateIntegrationMarkdown(success.agentSlug, undefined, themeJson)
    navigator.clipboard.writeText(md)
    setPromptCopied(true)
    setTimeout(() => setPromptCopied(false), 2000)
  }

  /* ── Cross-fade animation ── */

  const { activeStep, stepsToRender } = useCrossFade(step)

  /* ── Layout state ── */

  const isThemeStep = step === "theme"
  const isCustomTheme = isThemeStep && agentState.theme === "custom"

  /* ── Computed visual config for chat preview ── */

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

  /* ── Preload theme chunks ── */

  useEffect(() => {
    if (step === "identity") { themeStepImport(); unifiedPreviewImport() }
  }, [step])

  /* ── Navigation ── */

  const STEP_ORDER: WizardStep[] = ["identity", "theme", "success"]
  const currentIndex = STEP_ORDER.indexOf(step)

  function handleBack() {
    if (currentIndex <= 0) return
    const prevStep = STEP_ORDER[currentIndex - 1]!
    setStep(prevStep)
  }

  const showBackButton = (() => {
    if (step === "success") return undefined
    if (step === "identity") return undefined
    return handleBack
  })()

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
            width: (step === "identity" || step === "theme") ? "340px" : "100%",
            transition: "width 500ms cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {/* Content area */}
          <div
            className={isCustomTheme ? "flex-1 min-h-0 flex flex-col" : "flex-1 min-h-0"}
            style={isCustomTheme ? undefined : {
              maxHeight: activeStep === "success" ? "320px" : "608px",
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
                        <button onClick={() => setStep("theme")} disabled={!agentState.agentName.trim()} className="an-focus-btn flex w-full items-center justify-center h-10 rounded-lg bg-foreground text-background text-[14px] font-medium hover:bg-foreground/90 active:scale-[0.99] transition-all duration-150 disabled:opacity-40">
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
                        <button onClick={handleCreateAgent} disabled={!agentState.theme} className="an-focus-btn flex w-full items-center justify-center h-10 rounded-lg bg-foreground text-background text-[14px] font-medium hover:bg-foreground/90 active:scale-[0.99] transition-all duration-150 disabled:opacity-40">
                          Create Agent
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ─── Success Step ─── */}
                  {s === "success" && success && (
                    <div className="max-w-[320px]">
                      <div className="mb-5">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground">
                            <CheckIcon className="h-3.5 w-3.5 text-background" />
                          </div>
                          <span className="text-[13px] font-medium text-muted-foreground">
                            Agent created
                          </span>
                        </div>
                        <h1 className="text-xl font-semibold tracking-tight">Setup complete</h1>
                        <p className="mt-1.5 text-[14px] text-muted-foreground leading-relaxed">
                          Copy the integration prompt for your AI coding assistant, or head to the dashboard.
                        </p>
                      </div>

                      <div className="group/code mb-5 relative rounded-lg border border-border overflow-hidden">
                        <div className="absolute top-1/2 -translate-y-1/2 right-1.5 z-10">
                          <button
                            type="button"
                            onClick={handleCopyEnv}
                            className="flex size-7 cursor-pointer items-center justify-center rounded-md opacity-70 transition-[opacity,background-color] hover:bg-accent hover:opacity-100 active:scale-[0.97]"
                          >
                            <div className="relative size-4">
                              <CopyIcon
                                className={cn(
                                  "absolute inset-0 size-4 text-muted-foreground transition-[opacity,transform] duration-200 ease-out",
                                  copied ? "opacity-0 scale-50" : "opacity-100 scale-100",
                                )}
                              />
                              <CheckIcon
                                className={cn(
                                  "absolute inset-0 size-4 text-muted-foreground transition-[opacity,transform] duration-200 ease-out",
                                  copied ? "opacity-100 scale-100" : "opacity-0 scale-50",
                                )}
                              />
                            </div>
                          </button>
                        </div>
                        <div className="px-4 py-3 pr-10 font-mono text-[13px] leading-relaxed truncate">
                          <span className="text-muted-foreground">API_KEY_21ST=</span>
                          <span className="text-foreground/30">{"•".repeat(12)}</span>
                        </div>
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

export default function NewProjectPage() {
  return (
    <Suspense>
      <NewProjectWizard />
    </Suspense>
  )
}
