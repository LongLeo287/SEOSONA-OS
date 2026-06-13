"use client"

import { useEffect, useState } from "react"
import { AgentsLink as Link } from "@/components/agents-link"
import { useAgentsAuthFlow } from "@/lib/agents/auth/client"
import { IS_BETTER_AUTH } from "@/lib/agents/auth/config"
import { toRelativeAuthRedirectUrl } from "@/lib/agents/auth/redirect"
import type { AgentsEmailAuthFlow } from "@/lib/agents/auth/types"
import { agentsHref } from "@/lib/utils/agents-href"
import { motion, AnimatePresence } from "motion/react"
import { Spinner } from "@/components/icons/spinner"
import { cn } from "@/lib/utils"
import { OTPInput, type SlotProps } from "input-otp"
import { Logo } from "@/components/features/agents/ui/canvas/[id]/{components}/ui/logo"
import { WizardShell } from "@/components/features/agents/an/wizard/wizard-shell"

/* ── Icons ── */

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

/* ── OTP Slot ── */

function OtpSlot(props: SlotProps) {
  return (
    <div
      className={cn(
        "flex h-12 flex-1 items-center justify-center rounded-lg border border-border bg-foreground/[0.04] text-[18px] font-medium text-foreground transition-all",
        props.isActive &&
          "border-[hsl(var(--ring))] shadow-[0_0_0_3px_hsl(var(--ring)/0.24)]",
      )}
    >
      {props.char !== null && <div>{props.char}</div>}
      {props.char === null && props.isActive && (
        <div className="h-5 w-px animate-pulse bg-foreground/40" />
      )}
    </div>
  )
}

/* ── Custom Sign-In ── */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type SignInStage = "form" | "verifying"

export function AnCustomSignIn(
  { redirectUrl }: { redirectUrl?: string } = {},
) {
  const { isLoaded, requestEmailCode, verifyEmailCode, startOAuth } =
    useAgentsAuthFlow()
  const [stage, setStage] = useState<SignInStage>("form")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailFlow, setEmailFlow] = useState<AgentsEmailAuthFlow>("sign-in")

  const isValidEmail = EMAIL_RE.test(email)
  const completeRedirectUrl = toRelativeAuthRedirectUrl(redirectUrl)

  // Animated intro: always start "loading" so logo animation plays
  const [phase, setPhase] = useState<"loading" | "ready">("loading")

  useEffect(() => {
    if (isLoaded && phase === "loading") {
      const t = setTimeout(() => setPhase("ready"), 350)
      return () => clearTimeout(t)
    }
  }, [isLoaded, phase])

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isLoaded || !isValidEmail) return
    setError("")
    setLoading(true)

    try {
      const flow = await requestEmailCode(email)
      setEmailFlow(flow)
      setStage("verifying")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    if (!isLoaded || !code.trim()) return
    setError("")
    setLoading(true)

    try {
      await verifyEmailCode({
        code,
        flow: emailFlow,
        redirectUrl: completeRedirectUrl,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code")
    } finally {
      setLoading(false)
    }
  }

  async function handleOAuth(provider: "google" | "github" | "okta") {
    if (!isLoaded) return
    try {
      await startOAuth({
        provider,
        redirectUrl: agentsHref("/agents/sso-callback"),
        redirectUrlComplete: completeRedirectUrl,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  // Verification step — uses WizardShell with back button
  if (stage === "verifying" && phase === "ready") {
    return (
      <WizardShell
        onBack={() => {
          setStage("form")
          setCode("")
          setError("")
        }}
      >
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Check your email
            </h1>
            <p className="mt-2 text-[15px] text-muted-foreground leading-relaxed">
              We sent a code to{" "}
              <span className="text-foreground/70">{email}</span>
            </p>
          </div>

          <div>
            <OTPInput
              value={code}
              onChange={setCode}
              maxLength={6}
              autoFocus
              containerClassName="flex items-center gap-2 w-full"
              onComplete={() => {
                const form = document.getElementById(
                  "verify-form",
                ) as HTMLFormElement
                form?.requestSubmit()
              }}
              render={({ slots }) => (
                <div className="flex gap-2 w-full">
                  {slots.map((slot, idx) => (
                    <OtpSlot key={idx} {...slot} />
                  ))}
                </div>
              )}
            />
          </div>

          {error && (
            <p className="text-center text-[13px] text-red-400">{error}</p>
          )}

          <form id="verify-form" onSubmit={handleVerify}>
            <button
              type="submit"
              disabled={loading || code.length < 6}
              className="an-focus-btn relative flex w-full items-center justify-center h-11 rounded-lg bg-foreground text-background text-[15px] font-medium hover:bg-foreground/90 active:scale-[0.99] transition-all duration-150 disabled:opacity-40 overflow-hidden"
            >
              <span
                className={cn(
                  "transition-[opacity,transform] duration-200 ease-out",
                  loading
                    ? "-translate-y-full opacity-0"
                    : "translate-y-0 opacity-100",
                )}
              >
                Verify
              </span>
              <span
                className={cn(
                  "absolute inset-0 flex items-center justify-center transition-[opacity,transform] duration-200 ease-out",
                  loading
                    ? "translate-y-0 opacity-100"
                    : "translate-y-full opacity-0",
                )}
              >
                <Spinner size={18} color="hsl(var(--background))" />
              </span>
            </button>
          </form>
        </div>
      </WizardShell>
    )
  }

  // Unified layout: single tree for both loading and ready phases
  // so CSS transitions animate smoothly between them
  const isReady = phase === "ready"

  /*
    Single DOM tree — logo starts at exact viewport center then glides up.
    Nav is 32px (py-4 with empty children).
    Logo center at 50vh: navH(32) + padTop + logoH(20)/2 = 50vh => padTop = 50vh - 42px
    Form position: padTop = calc(30vh - 56px) (matches WizardShell)
  */
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      {/* Invisible nav — reserves 32px matching WizardShell */}
      <nav
        className="flex items-center justify-between px-5 py-4"
        style={{ opacity: 0, pointerEvents: "none" as const }}
      >
        <div />
        <div />
      </nav>

      <div className="mx-auto w-full px-6" style={{ maxWidth: "388px" }}>
        <div
          style={{
            paddingTop: isReady ? "calc(30vh - 56px)" : "calc(50vh - 42px)",
            transition: isReady
              ? "padding-top 600ms cubic-bezier(0.22, 1, 0.36, 1)"
              : "none",
          }}
        >
          <div className="space-y-6">
            {/* Logo + name — centered */}
            <div className="flex items-center justify-center">
              <Link
                href="/agents"
                className="flex items-center justify-center gap-2.5 transition-opacity hover:opacity-70"
              >
                <div
                  style={{
                    transform: isReady ? "translate(0, 0)" : "translate(20px, -20px)",
                    transition: isReady
                      ? "transform 600ms cubic-bezier(0.22, 1, 0.36, 1)"
                      : "none",
                  }}
                >
                  <Logo
                    className="w-5 h-5 text-foreground"
                    fill="currentColor"
                  />
                </div>
                {/* Text slides in when ready */}
                <div
                  className="overflow-hidden"
                  style={{
                    width: isReady ? "34px" : "0px",
                    opacity: isReady ? 1 : 0,
                    transition: isReady
                      ? "width 400ms cubic-bezier(0.22, 1, 0.36, 1), opacity 400ms cubic-bezier(0.22, 1, 0.36, 1)"
                      : "none",
                  }}
                >
                  <span className="text-[17px] font-semibold tracking-tight whitespace-nowrap">
                    21st
                  </span>
                </div>
              </Link>
            </div>

            {/* Form — fades in after logo settles */}
            {IS_BETTER_AUTH ? (
              <div
                className="space-y-3"
                style={{
                  opacity: isReady ? 1 : 0,
                  transform: isReady ? "translateY(0)" : "translateY(16px)",
                  transition: isReady
                    ? "opacity 500ms cubic-bezier(0.22, 1, 0.36, 1) 200ms, transform 500ms cubic-bezier(0.22, 1, 0.36, 1) 200ms"
                    : "none",
                }}
              >
                <button
                  type="button"
                  onClick={() => handleOAuth("okta")}
                  disabled={loading}
                  className="an-focus-btn relative flex w-full items-center justify-center h-11 rounded-lg bg-foreground text-background text-[15px] font-medium hover:bg-foreground/90 active:scale-[0.99] transition-all duration-150 disabled:opacity-40 overflow-hidden"
                >
                  <span
                    className={cn(
                      "transition-[opacity,transform] duration-200 ease-out",
                      loading
                        ? "-translate-y-full opacity-0"
                        : "translate-y-0 opacity-100",
                    )}
                  >
                    Continue with Okta
                  </span>
                  <span
                    className={cn(
                      "absolute inset-0 flex items-center justify-center transition-[opacity,transform] duration-200 ease-out",
                      loading
                        ? "translate-y-0 opacity-100"
                        : "translate-y-full opacity-0",
                    )}
                  >
                    <Spinner size={18} color="hsl(var(--background))" />
                  </span>
                </button>

                {error && <p className="text-[13px] text-red-400">{error}</p>}
              </div>
            ) : (
              <>
                <form
                  onSubmit={handleEmailSubmit}
                  className="space-y-3"
                  style={{
                    opacity: isReady ? 1 : 0,
                    transform: isReady ? "translateY(0)" : "translateY(16px)",
                    transition: isReady
                      ? "opacity 500ms cubic-bezier(0.22, 1, 0.36, 1) 200ms, transform 500ms cubic-bezier(0.22, 1, 0.36, 1) 200ms"
                      : "none",
                  }}
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="an-focus-input w-full h-11 rounded-lg border border-border bg-foreground/[0.04] px-4 text-[15px] text-foreground placeholder:text-muted-foreground/60"
                    autoFocus
                  />

                  {error && <p className="text-[13px] text-red-400">{error}</p>}

                  <AnimatePresence>
                    {isValidEmail && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <button
                          type="submit"
                          disabled={loading}
                          className="an-focus-btn relative flex w-full items-center justify-center h-11 rounded-lg bg-foreground text-background text-[15px] font-medium hover:bg-foreground/90 active:scale-[0.99] transition-all duration-150 disabled:opacity-40 overflow-hidden"
                        >
                          <span
                            className={cn(
                              "transition-[opacity,transform] duration-200 ease-out",
                              loading
                                ? "-translate-y-full opacity-0"
                                : "translate-y-0 opacity-100",
                            )}
                          >
                            Continue
                          </span>
                          <span
                            className={cn(
                              "absolute inset-0 flex items-center justify-center transition-[opacity,transform] duration-200 ease-out",
                              loading
                                ? "translate-y-0 opacity-100"
                                : "translate-y-full opacity-0",
                            )}
                          >
                            <Spinner size={18} color="hsl(var(--background))" />
                          </span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>

                <div
                  className="grid grid-cols-2 gap-3"
                  style={{
                    opacity: isReady ? 1 : 0,
                    transform: isReady ? "translateY(0)" : "translateY(16px)",
                    transition: isReady
                      ? "opacity 500ms cubic-bezier(0.22, 1, 0.36, 1) 300ms, transform 500ms cubic-bezier(0.22, 1, 0.36, 1) 300ms"
                      : "none",
                  }}
                >
                  <button
                    onClick={() => handleOAuth("google")}
                    className="an-focus-btn flex items-center justify-center gap-2 h-11 rounded-lg border border-border bg-foreground/[0.03] text-[14px] font-medium text-foreground/70 hover:bg-foreground/[0.06] hover:text-foreground active:scale-[0.99] transition-all duration-150"
                  >
                    <GoogleIcon className="w-4 h-4" />
                    Google
                  </button>
                  <button
                    onClick={() => handleOAuth("github")}
                    className="an-focus-btn flex items-center justify-center gap-2 h-11 rounded-lg border border-border bg-foreground/[0.03] text-[14px] font-medium text-foreground/70 hover:bg-foreground/[0.06] hover:text-foreground active:scale-[0.99] transition-all duration-150"
                  >
                    <GitHubIcon className="w-4 h-4 text-foreground/70" />
                    GitHub
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
