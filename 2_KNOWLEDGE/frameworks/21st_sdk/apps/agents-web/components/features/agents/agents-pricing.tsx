"use client"

import { useAgentsSession } from "@/lib/agents/auth/client"
import { Check, Download, LoaderCircle } from "lucide-react"
import Link from "next/link"
import * as React from "react"
import { Suspense } from "react"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useDesktopDownload } from "@/hooks/use-desktop-download"
import { DISCORD_1CODE_OPENSOURCE, DISCORD_1CODE_PAID } from "@/lib/config/discord"
import { trackDesktopDownload } from "@/lib/posthog-agents"
import { authLog } from "@/lib/utils/auth-logger"
import { api } from "@/trpc/client"

const GITHUB_REPO_URL = "https://github.com/21st-dev/1Code"

type Feature = string | { text: string; link: string }

const FREE_TIER = {
  name: "Open Source",
  subtitle: "Self-host it yourself",
  price: 0,
  features: [
    "Local desktop client (macOS, Windows, Linux)",
    "Full source code access",
    "Community support via GitHub",
  ] as Feature[],
}

const ONECODE_TIERS = [
  {
    name: "Pro",
    subtitle: "For individual builders",
    planId: "onecode_pro",
    price: 20,
    features: [
      "Desktop, web & mobile (PWA)",
      "Background agents — keep running when laptop sleeps",
      "Start from web or phone, continue locally",
      "Live browser previews of dev branches",
    ] as Feature[],
    popular: true,
  },
  {
    name: "Max",
    subtitle: "For teams & power users",
    planId: "onecode_max_100",
    price: 100,
    features: [
      "Everything in Pro",
      { text: "Automations: PR reviews, Linear tasks, CI/CD fixes", link: "/1code/async" },
      "Request any feature or integration",
      "Personal support",
    ] as Feature[],
    popular: false,
  },
]

function OneCodePricingContent({ hideFreeTier = false, hideHeader = false, variant = "default" }: { hideFreeTier?: boolean; hideHeader?: boolean; variant?: "default" | "flat" }) {
  const { isSignedIn, isLoaded } = useAgentsSession()
  const [loadingPlan, setLoadingPlan] = React.useState<string | null>(null)
  const [upgradeTarget, setUpgradeTarget] = React.useState<typeof ONECODE_TIERS[number] | null>(null)
  const { downloadUrl, platform, platformLabel, isDesktopAvailable } =
    useDesktopDownload()

  const { data: subscription } = api.agents.getAgentsSubscription.useQuery(
    undefined,
    { enabled: !!isSignedIn },
  )
  const currentPlanType = subscription?.type || "free"

  // Get base URL without query params for redirect
  const getBaseUrl = () => {
    if (typeof window === "undefined") {
      return process.env.NEXT_PUBLIC_ONECODE_APP_URL ?? "/"
    }
    const url = new URL(window.location.href)
    url.search = "" // Remove query params
    return url.toString()
  }

  // Create checkout session
  const createCheckout = React.useCallback(async (planId: string) => {
    setLoadingPlan(planId)

    try {
      const baseUrl = getBaseUrl()

      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          planId,
          period: "monthly",
          successUrl: `${baseUrl}?checkout_success=true`,
          cancelUrl: `${baseUrl}?canceled=true`,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create checkout session")
      }

      const data = await response.json()

      if (!data.url) {
        throw new Error("No checkout URL received")
      }

      window.location.href = data.url
    } catch (error) {
      console.error("Checkout error:", error)
      toast.error("Failed to start checkout. Please try again.")
      setLoadingPlan(null)
    }
  }, [])

  const handleSubscribe = async (planId: string) => {
    authLog("Subscribe clicked", { planId, isSignedIn, isLoaded })

    if (!isSignedIn) {
      // Redirect to app gate — user will sign in there, then see pricing
      authLog("Not signed in, redirecting to app gate", { planId })
      window.location.href = "/1code/app"
      return
    }

    // If user already has an active plan, show upgrade confirmation
    if (currentPlanType !== "free" && planId !== currentPlanType) {
      const target = ONECODE_TIERS.find((t) => t.planId === planId)
      if (target) {
        setUpgradeTarget(target)
        return
      }
    }

    authLog("User signed in, creating checkout", { planId })
    await createCheckout(planId)
  }

  const handleConfirmUpgrade = async () => {
    if (!upgradeTarget) return
    authLog("Upgrade confirmed", { planId: upgradeTarget.planId })
    setUpgradeTarget(null)
    await createCheckout(upgradeTarget.planId)
  }

  const currentTier = ONECODE_TIERS.find((t) => t.planId === currentPlanType)

  return (
    <>
      <Dialog open={!!upgradeTarget} onOpenChange={(open) => !open && setUpgradeTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Upgrade</DialogTitle>
            <DialogDescription>
              You&apos;re about to upgrade from {currentTier?.name ?? "your current plan"} (${currentTier?.price ?? 0}/mo) to {upgradeTarget?.name} (${upgradeTarget?.price}/mo).
              <ul className="list-disc list-inside mt-2">
                <li>Your billing cycle will reset immediately</li>
                <li>You&apos;ll be charged the new amount now</li>
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">
                Questions? Reach out at{" "}
                <a href="mailto:support@21st.dev" className="underline hover:text-foreground">support@21st.dev</a>
                {" "}or{" "}
                <a href={DISCORD_1CODE_PAID} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">Discord</a>.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => setUpgradeTarget(null)}
              className="px-4 py-2 text-sm font-medium rounded-md border border-border hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmUpgrade}
              disabled={!!loadingPlan}
              className="px-4 py-2 text-sm font-medium rounded-md bg-foreground text-background hover:bg-foreground/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loadingPlan ? (
                <>
                  <LoaderCircle className="h-3 w-3 animate-spin" />
                  Processing
                </>
              ) : (
                "Confirm Upgrade"
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {variant === "flat" ? (
        <section className="flex flex-col items-center">
          {/* Grid container with decorative lines */}
          <div className="relative w-full">
            {/* Horizontal lines top & bottom */}
            <div className="absolute top-0 left-0 hidden h-px w-full bg-[linear-gradient(to_right,transparent_0%,rgba(255,255,255,0.06)_8%,rgba(255,255,255,0.06)_92%,transparent_100%)] sm:block" />
            <div className="absolute bottom-0 left-0 hidden h-px w-full bg-[linear-gradient(to_right,transparent_0%,rgba(255,255,255,0.06)_8%,rgba(255,255,255,0.06)_92%,transparent_100%)] sm:block" />

            <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {/* Vertical separator lines — at each column boundary */}
              <div className="absolute top-0 left-0 hidden h-full w-px bg-white/[0.06] sm:block" />
              <div className="absolute top-0 left-1/2 hidden h-full w-px bg-white/[0.06] sm:block lg:hidden" />
              <div className="absolute top-0 left-1/3 hidden h-full w-px bg-white/[0.06] lg:block" />
              <div className="absolute top-0 left-2/3 hidden h-full w-px bg-white/[0.06] lg:block" />
              <div className="absolute top-0 right-0 hidden h-full w-px bg-white/[0.06] sm:block" />

              {/* Free Tier */}
              {!hideFreeTier && (
                <div className="flex flex-col p-8">
                  <h3 className="text-xl text-white/90">{FREE_TIER.name}</h3>
                  <div className="mt-6">
                    <span className="text-4xl font-semibold text-white">$0</span>
                    <div className="mt-0.5 text-xs text-white/25">Forever free</div>
                  </div>
                  <div className="mt-6 text-sm font-semibold text-white/60">{FREE_TIER.subtitle}</div>
                  <ul className="mt-3 flex flex-col gap-y-2.5">
                    {FREE_TIER.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <svg className="mt-[3px] h-3.5 w-3.5 shrink-0 text-white/25" viewBox="0 0 14 14" fill="none"><path d="M2.5 7.5L5.5 10.5L11.5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        <span className="text-sm text-white/35">
                          {typeof feature === "string" ? feature : (
                            <Link href={feature.link} className="underline underline-offset-2 hover:text-white/60">{feature.text}</Link>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-8">
                    {isDesktopAvailable ? (
                      <>
                        <a
                          href={downloadUrl ?? "#"}
                          onClick={() =>
                            trackDesktopDownload({
                              platform: platform ?? "unknown",
                              source: "pricing_free_tier",
                            })
                          }
                          className="w-full h-9 rounded-[10px] px-3 text-sm font-medium border border-white/[0.08] text-white/70 flex items-center justify-center gap-2 hover:bg-white/[0.04] active:scale-[0.99] transition-all duration-150"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download for {platformLabel}
                        </a>
                        <a
                          href={GITHUB_REPO_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 block w-full text-center text-xs text-white/30 hover:text-white/50 transition-colors"
                        >
                          View source on GitHub
                        </a>
                      </>
                    ) : (
                      <a
                        href={GITHUB_REPO_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full h-9 rounded-[10px] px-3 text-sm font-medium border border-white/[0.08] text-white/70 flex items-center justify-center gap-2 hover:bg-white/[0.04] active:scale-[0.99] transition-all duration-150"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        Build it yourself
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Paid Tiers */}
              {ONECODE_TIERS.map((tier) => (
                <div
                  key={tier.name}
                  className={`flex flex-col p-8 ${tier.popular ? "bg-white/[0.02]" : ""}`}
                >
                  <h3 className="text-xl text-white/90">{tier.name}</h3>
                  <div className="mt-6">
                    <span className="text-4xl font-semibold text-white">${tier.price}</span>
                    <div className="mt-0.5 text-xs text-white/25">Per month</div>
                  </div>
                  <div className="mt-6 text-sm font-semibold text-white/60">{tier.subtitle}</div>
                  <ul className="mt-3 flex flex-col gap-y-2.5">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <svg className="mt-[3px] h-3.5 w-3.5 shrink-0 text-white/25" viewBox="0 0 14 14" fill="none"><path d="M2.5 7.5L5.5 10.5L11.5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        <span className="text-sm text-white/35">
                          {typeof feature === "string" ? feature : (
                            <Link href={feature.link} className="underline underline-offset-2 hover:text-white/60">{feature.text}</Link>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-8">
                    {currentPlanType === tier.planId ? (
                      <div className="w-full h-9 rounded-[10px] px-3 text-sm font-medium border border-white/[0.08] text-white/40 flex items-center justify-center">
                        Current Plan
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSubscribe(tier.planId)}
                        disabled={loadingPlan === tier.planId}
                        className={`w-full h-9 rounded-[10px] px-3 text-sm font-medium flex items-center justify-center gap-2 active:scale-[0.99] transition-all duration-150 disabled:opacity-50 cursor-pointer ${
                          tier.popular
                            ? "bg-white text-[#09090b] hover:bg-white/90"
                            : "border border-white/[0.08] text-white/70 hover:bg-white/[0.04]"
                        }`}
                      >
                        {loadingPlan === tier.planId ? "Loading..." : (
                          currentPlanType !== "free" && ONECODE_TIERS.findIndex((t) => t.planId === tier.planId) > ONECODE_TIERS.findIndex((t) => t.planId === currentPlanType)
                            ? "Upgrade"
                            : "Subscribe"
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-8 text-xs text-white/20">
            Questions? Reach out at{" "}
            <a href="mailto:support@21st.dev" className="underline hover:text-white/40">support@21st.dev</a>
            {" "}or{" "}
            <a href={currentPlanType !== "free" ? DISCORD_1CODE_PAID : DISCORD_1CODE_OPENSOURCE} target="_blank" rel="noopener noreferrer" className="underline hover:text-white/40">Discord</a>.
          </p>
        </section>
      ) : (
      <section className="flex flex-col items-center gap-10 py-10">
        {!hideHeader && (
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-foreground mb-2">
              Pricing
            </h2>
            <p className="text-base text-muted-foreground">Choose your plan</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-6 px-4">
          {/* Free Tier */}
          {!hideFreeTier && (
            <div className="relative w-[300px] max-w-[calc(100%-32px)] backdrop-blur-[2px] rounded-[18px] p-8 bg-[#FAFAFA] dark:bg-[#292929]/60 shadow-[0px_12px_24px_0px_inset_rgba(255,255,255,0.03),0px_0.5px_0.5px_0px_inset_rgba(255,255,255,0.06),0px_0.25px_0.25px_0px_inset_rgba(255,255,255,0.12)] flex flex-col">
              {/* Corner plus icons */}
              <svg
                className="absolute left-0 bottom-0 fill-foreground/10"
                width="29"
                height="29"
                viewBox="0 0 29 29"
                fill="none"
              >
                <path d="M14.5 8C18.0899 8 21 10.9101 21 14.5C21 18.0899 18.0899 21 14.5 21C10.9101 21 8 18.0899 8 14.5C8 10.9101 10.9101 8 14.5 8ZM14 10V14H10V15H14V19H15V15H19V14H15V10H14Z" />
              </svg>
              <svg
                className="absolute right-0 top-0 fill-foreground/10"
                width="29"
                height="29"
                viewBox="0 0 29 29"
                fill="none"
              >
                <path d="M14.5 8C18.0899 8 21 10.9101 21 14.5C21 18.0899 18.0899 21 14.5 21C10.9101 21 8 18.0899 8 14.5C8 10.9101 10.9101 8 14.5 8ZM14 10V14H10V15H14V19H15V15H19V14H15V10H14Z" />
              </svg>

              {/* Plan name */}
              <h3 className="text-lg font-medium text-foreground text-center mb-1">
                {FREE_TIER.name}
              </h3>
              <p className="text-xs text-muted-foreground text-center mb-3">
                {FREE_TIER.subtitle}
              </p>

              {/* Price */}
              <div className="text-center mb-2">
                <span className="text-3xl font-bold text-foreground">$0</span>
                <span className="text-sm text-muted-foreground">/forever</span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {FREE_TIER.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-foreground/60 shrink-0 mt-0.5" />
                    {typeof feature === "string" ? (
                      feature
                    ) : (
                      <Link href={feature.link} className="underline underline-offset-2 hover:text-foreground">
                        {feature.text}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>

              {/* Download / GitHub Button */}
              {isDesktopAvailable ? (
                <div className="flex flex-col gap-2">
                  <a
                    href={downloadUrl ?? "#"}
                    onClick={() =>
                      trackDesktopDownload({
                        platform: platform ?? "unknown",
                        source: "pricing_free_tier",
                      })
                    }
                    className="w-full rounded-full h-10 px-5 text-sm font-medium border border-foreground/20 text-foreground flex items-center justify-center gap-2 hover:bg-foreground/5 active:scale-[0.99] transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download for {platformLabel}
                  </a>
                  <a
                    href={GITHUB_REPO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center text-xs text-muted-foreground hover:text-foreground/70 transition-colors"
                  >
                    View source on GitHub
                  </a>
                </div>
              ) : (
                <a
                  href={GITHUB_REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full rounded-full h-10 px-5 text-sm font-medium border border-foreground/20 text-foreground flex items-center justify-center gap-2 hover:bg-foreground/5 active:scale-[0.99] transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  Build it yourself
                </a>
              )}
            </div>
          )}

          {/* Paid Tiers */}
          {ONECODE_TIERS.map((tier) => (
            <div
              key={tier.name}
              className="relative w-[300px] max-w-[calc(100%-32px)] rounded-[18px] p-8 flex flex-col backdrop-blur-[2px] bg-[#FAFAFA] dark:bg-[#292929]/60 shadow-[0px_12px_24px_0px_inset_rgba(255,255,255,0.03),0px_0.5px_0.5px_0px_inset_rgba(255,255,255,0.06),0px_0.25px_0.25px_0px_inset_rgba(255,255,255,0.12)]"
            >
              {/* Corner plus icons */}
              <svg
                className="absolute left-0 bottom-0 fill-foreground/10"
                width="29"
                height="29"
                viewBox="0 0 29 29"
                fill="none"
              >
                <path d="M14.5 8C18.0899 8 21 10.9101 21 14.5C21 18.0899 18.0899 21 14.5 21C10.9101 21 8 18.0899 8 14.5C8 10.9101 10.9101 8 14.5 8ZM14 10V14H10V15H14V19H15V15H19V14H15V10H14Z" />
              </svg>
              <svg
                className="absolute right-0 top-0 fill-foreground/10"
                width="29"
                height="29"
                viewBox="0 0 29 29"
                fill="none"
              >
                <path d="M14.5 8C18.0899 8 21 10.9101 21 14.5C21 18.0899 18.0899 21 14.5 21C10.9101 21 8 18.0899 8 14.5C8 10.9101 10.9101 8 14.5 8ZM14 10V14H10V15H14V19H15V15H19V14H15V10H14Z" />
              </svg>

              {/* Popular badge */}
              {tier.popular && !hideHeader && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-foreground text-background text-xs font-medium">
                  Popular
                </div>
              )}

              {/* Plan name */}
              <h3 className="text-lg font-medium text-foreground text-center mb-1">
                {tier.name}
              </h3>
              <p className="text-xs text-muted-foreground text-center mb-3">
                {tier.subtitle}
              </p>

              {/* Price */}
              <div className="text-center mb-2">
                <span className="text-3xl font-bold text-foreground">${tier.price}</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-foreground/60 shrink-0 mt-0.5" />
                    {typeof feature === "string" ? (
                      feature
                    ) : (
                      <Link href={feature.link} className="underline underline-offset-2 hover:text-foreground">
                        {feature.text}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>

              {/* Subscribe / Upgrade / Current Plan Button */}
                {currentPlanType === tier.planId ? (
                  <div className="w-full rounded-full h-10 px-5 text-sm font-medium border border-foreground/20 text-foreground/60 flex items-center justify-center">
                    Current Plan
                  </div>
                ) : (
                  <button
                    onClick={() => handleSubscribe(tier.planId)}
                    disabled={loadingPlan === tier.planId}
                    className="w-full rounded-full h-10 px-5 text-sm font-medium bg-foreground text-background flex items-center justify-center gap-2 hover:bg-foreground/90 active:scale-[0.99] transition-all disabled:opacity-50"
                  >
                    {loadingPlan === tier.planId ? "Loading..." : (
                      currentPlanType !== "free" && ONECODE_TIERS.findIndex((t) => t.planId === tier.planId) > ONECODE_TIERS.findIndex((t) => t.planId === currentPlanType)
                        ? "Upgrade"
                        : "Subscribe"
                    )}
                  </button>
                )}
            </div>
          ))}
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Questions? Reach out at{" "}
          <a href="mailto:support@21st.dev" className="underline hover:text-foreground">support@21st.dev</a>
          {" "}or{" "}
          <a href={currentPlanType !== "free" ? DISCORD_1CODE_PAID : DISCORD_1CODE_OPENSOURCE} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">Discord</a>.
        </p>
      </section>
      )}
    </>
  )
}

export function OneCodePricing({ hideFreeTier = false, hideHeader = false, variant = "default" }: { hideFreeTier?: boolean; hideHeader?: boolean; variant?: "default" | "flat" } = {}) {
  const tiers = hideFreeTier ? ONECODE_TIERS : [FREE_TIER, ...ONECODE_TIERS]
  return (
    <Suspense fallback={
      variant === "flat" ? (
        <section className="flex flex-col items-center">
          <div className="relative w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {tiers.map((tier) => (
                <div key={tier.name} className="p-8 animate-pulse">
                  <div className="h-6 bg-white/[0.05] rounded mb-6" />
                  <div className="h-10 bg-white/[0.05] rounded mb-6" />
                  <div className="space-y-2.5">
                    <div className="h-4 bg-white/[0.05] rounded" />
                    <div className="h-4 bg-white/[0.05] rounded" />
                    <div className="h-4 bg-white/[0.05] rounded" />
                  </div>
                  <div className="h-9 bg-white/[0.05] rounded-[10px] mt-8" />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="flex flex-col items-center gap-10 py-10">
          {!hideHeader && (
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-foreground mb-2">Pricing</h2>
              <p className="text-base text-muted-foreground">Choose your plan</p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-6 px-4">
            {tiers.map((tier) => (
              <div key={tier.name} className="relative w-[300px] max-w-[calc(100%-32px)] rounded-[18px] p-8 flex flex-col animate-pulse backdrop-blur-[2px] bg-[#FAFAFA] dark:bg-[#292929]/60 shadow-[0px_12px_24px_0px_inset_rgba(255,255,255,0.03),0px_0.5px_0.5px_0px_inset_rgba(255,255,255,0.06),0px_0.25px_0.25px_0px_inset_rgba(255,255,255,0.12)]">
                <div className="h-6 bg-muted rounded mb-4" />
                <div className="h-10 bg-muted rounded mb-4" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded" />
                </div>
                <div className="h-10 bg-muted rounded-full mt-4" />
              </div>
            ))}
          </div>
        </section>
      )
    }>
      <OneCodePricingContent hideFreeTier={hideFreeTier} hideHeader={hideHeader} variant={variant} />
    </Suspense>
  )
}
