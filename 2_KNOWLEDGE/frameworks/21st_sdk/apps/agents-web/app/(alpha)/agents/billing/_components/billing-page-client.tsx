"use client"

import { useBillingReadinessStore } from "@/components/features/agents/an/dashboard/billing-setup-gate"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { selectedTeamIdAtom } from "@/lib/atoms/team"
import {
  AGENT_SANDBOX_SPECS_LABEL,
  BILLING_FREE_CREDIT_AMOUNT,
  BILLING_MONTHLY_COMMIT_AMOUNT,
  COMPUTE_USAGE_COST_PER_SECOND_USD,
} from "@/lib/agents-billing/constants"
import { api } from "@/trpc/client"
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { format, subMonths } from "date-fns"
import { useAtomValue } from "jotai"
import {
  ArrowUpRight,
  Check,
  CircleDollarSign,
  CreditCard,
  FileText,
  Coins,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_V2!,
)

const INCLUDED_CREDITS_FREE_USD = BILLING_FREE_CREDIT_AMOUNT / 100
const INCLUDED_CREDITS_PRO_USD = BILLING_MONTHLY_COMMIT_AMOUNT / 100
const SANDBOX_RATE_LABEL = COMPUTE_USAGE_COST_PER_SECOND_USD.toFixed(6)

const DASHBOARD_TITLES: Record<string, string> = {
  invoices: "Invoices",
  usage: "Usage",
  commits_and_credits: "Credits & Commits",
  credits: "Credits",
}

function formatCurrency(value: number) {
  if (value <= 0) return "$0.00"
  if (value < 0.01) return "<$0.01"
  return `$${value.toFixed(2)}`
}

function getBillingCycleRangeFromEnd(periodEndIso?: string | null) {
  if (!periodEndIso) return null
  const to = new Date(periodEndIso)
  if (Number.isNaN(to.getTime())) return null
  const from = subMonths(to, 1)
  if (Number.isNaN(from.getTime())) return null
  return { from, to }
}

const UPGRADE_FEATURES = [
  { title: "Included credit", desc: "For use towards metered resources" },
  { title: "On-demand billing", desc: "Pay as you go beyond credits" },
  { title: "Claude API passthrough", desc: "Same as Anthropic" },
  {
    title: "Sandbox runtime",
    desc: `${AGENT_SANDBOX_SPECS_LABEL} · $${COMPUTE_USAGE_COST_PER_SECOND_USD.toFixed(6)}/s while running`,
  },
]

function StripeUpgradeFormInner({
  onUpgradeComplete,
}: {
  onUpgradeComplete: () => Promise<void>
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [stripeReady, setStripeReady] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setIsSubmitting(true)
    try {
      const { error } = await stripe.confirmSetup({
        elements,
        redirect: "if_required",
        confirmParams: {
          return_url: `${window.location.origin}/agents/billing?billing_setup=success`,
        },
      })

      if (error) {
        toast.error(error.message ?? "Payment setup failed")
        return
      }

      // Card is now attached — complete the upgrade
      await onUpgradeComplete()
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upgrade failed"
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 overflow-hidden">
      <div className="flex flex-col sm:flex-row flex-1 overflow-hidden">
        {/* Left — What's included */}
        <div className="flex-1 bg-muted/30 border-b sm:border-b-0 sm:border-r border-border p-1.5 sm:min-w-[300px]">
          <div className="py-3 px-4">
            <span className="text-sm font-medium">What&apos;s included</span>
          </div>
          <ul className="flex flex-col border-b border-border mb-1 pb-1">
            {UPGRADE_FEATURES.map((feature, i) => (
              <li
                key={feature.title}
                className={`flex items-center gap-3 rounded-sm py-2 pl-4 pr-3 ${i % 2 === 0 ? "bg-muted/40" : ""}`}
              >
                <Check className="h-4 w-4 shrink-0 text-foreground" />
                <span className="flex flex-1 flex-col">
                  <span className="text-sm">{feature.title}</span>
                  <span className="text-sm text-muted-foreground">{feature.desc}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right — Stripe form */}
        <div className="flex-[2] p-6 flex flex-col gap-6 overflow-y-auto">
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-600">
              Pro
            </span>
            <h2 className="text-lg font-medium">Upgrade to Pro</h2>
            <p className="text-sm text-muted-foreground">
              Unlock on-demand billing and higher limits.
            </p>
          </div>

          <div className="w-full">
            <div className="rounded-md border border-border bg-muted/30 px-4 py-3 flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <Coins className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Included credit</span>
              </div>
              <span className="text-sm font-medium text-blue-600">
                ${INCLUDED_CREDITS_PRO_USD.toFixed(0)}
              </span>
            </div>

            <div className="rounded-md border border-border bg-muted/30 p-4">
              <PaymentElement
                onReady={() => setStripeReady(true)}
                options={{ layout: "tabs" }}
              />
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            Upon clicking <span className="font-medium text-foreground">Upgrade</span>, you will be charged ${INCLUDED_CREDITS_PRO_USD.toFixed(0)}, plus any applicable taxes, immediately and then every month.
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between border-t border-border pt-3">
              <span className="text-sm font-medium">Total</span>
              <span className="text-sm font-medium">${INCLUDED_CREDITS_PRO_USD.toFixed(0)} / month</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !stripe || !elements || !stripeReady}
            className="an-focus-btn w-full rounded-md bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/85 disabled:opacity-70"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Upgrading...
              </span>
            ) : (
              "Upgrade"
            )}
          </button>
        </div>
      </div>
    </form>
  )
}

function StripeUpgradeDialog({
  open,
  onOpenChange,
  teamId,
  onUpgradeComplete,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  teamId: string
  onUpgradeComplete: () => Promise<void>
}) {
  const createSetupIntent = api.anBilling.createSetupIntent.useMutation()
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setClientSecret(null)
    createSetupIntent
      .mutateAsync({ teamId })
      .then((result) => setClientSecret(result.clientSecret))
      .catch(() => toast.error("Failed to initialize payment form"))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[70vw] max-w-[70vw] h-[calc(100vh-4rem)] p-0 gap-0 overflow-hidden flex flex-col"
        onInteractOutside={(e) => e.preventDefault()}
      >
        {!clientSecret ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              fonts: [
                {
                  cssSrc:
                    "https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap",
                },
              ],
              appearance: {
                theme: "stripe",
                variables: {
                  colorPrimary: "#0a0a0a",
                  colorBackground: "#ffffff",
                  colorText: "#0a0a0a",
                  colorDanger: "#ef4444",
                  fontFamily: "Geist, system-ui, sans-serif",
                  borderRadius: "6px",
                  fontSizeBase: "14px",
                },
              },
            }}
          >
            <StripeUpgradeFormInner onUpgradeComplete={onUpgradeComplete} />
          </Elements>
        )}
      </DialogContent>
    </Dialog>
  )
}

function BillingSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-16 rounded-md" />
        </div>
      </div>
      {/* Usage card skeleton */}
      <div className="rounded-lg border border-border bg-card">
        <div className="border-b p-4">
          <Skeleton className="h-5 w-16 mb-1" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-48" />
          </div>
          <Skeleton className="h-2.5 w-full rounded-full" />
        </div>
        <div className="border-t p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-8 w-40 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function BillingPageClient() {
  const utils = api.useUtils()
  const teamId = useAtomValue(selectedTeamIdAtom)
  const billingStatus = useBillingReadinessStore((state) => state.status)
  const setBillingStatus = useBillingReadinessStore((state) => state.setStatus)
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false)
  const [dashboardDialog, setDashboardDialog] = useState<{
    open: boolean
    title: string
    url: string | null
    loading: boolean
  }>({ open: false, title: "", url: null, loading: false })
  const {
    data: billingCheckData,
    isLoading: isBillingCheckLoading,
    error: billingCheckError,
    refetch: refetchBillingCheck,
  } = api.anBilling.check.useQuery(
    { teamId: teamId! },
    {
      enabled: !!teamId,
      retry: false,
    },
  )
  const upgradeToProMutation = api.anBilling.upgradeToPro.useMutation({
    retry: false,
  })
  const cancelProMutation = api.anBilling.cancelProAtPeriodEnd.useMutation({
    retry: false,
  })
  const dashboardUrlMutation = api.anBilling.dashboardUrl.useMutation({
    retry: false,
  })
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const redeemCouponMutation =
    api.anBilling.coupons.redeemCoupon.useMutation({ retry: false })

  useEffect(() => {
    if (!teamId) return

    if (isBillingCheckLoading) {
      setBillingStatus({ checking: true, error: undefined })
      return
    }

    if (billingCheckError) {
      setBillingStatus({
        checking: false,
        error: billingCheckError.message || "Failed to check billing readiness",
      })
      return
    }

    if (!billingCheckData) return

    const isFreeWithoutBlocker =
      billingCheckData.plan_status === "free" && !billingCheckData.blocker
    setBillingStatus({
      ready: Boolean(billingCheckData.ready) || isFreeWithoutBlocker,
      checking: false,
      planStatus: billingCheckData.plan_status,
      setupUrl: billingCheckData.setup_url,
      blocker: billingCheckData.blocker,
      error: undefined,
    })
  }, [
    billingCheckData,
    billingCheckError,
    isBillingCheckLoading,
    setBillingStatus,
    teamId,
  ])

  const executeUpgradeToPro = useCallback(async () => {
    if (!teamId) return
    setBillingStatus({ error: undefined })
    const result = await upgradeToProMutation.mutateAsync({ teamId })

    if (result.blocker === "missing_payment_method") {
      throw new Error("Add a payment method before upgrading to Pro")
    }

    if (result.plan_status !== "pro") {
      throw new Error("Upgrade was not applied")
    }

    setBillingStatus({
      ready: true,
      checking: false,
      planStatus: "pro",
      setupUrl: undefined,
      blocker: undefined,
    })
    utils.anBilling.check.setData({ teamId }, result)
    await new Promise((resolve) => setTimeout(resolve, 3000))
    await refetchBillingCheck()
  }, [
    refetchBillingCheck,
    setBillingStatus,
    teamId,
    upgradeToProMutation,
    utils.anBilling.check,
  ])

  const handleCancelPro = useCallback(async () => {
    if (!teamId) return
    const confirmed = window.confirm(
      "Cancel Pro at period end? Your team will stay on Pro until the current billing period ends.",
    )
    if (!confirmed) return

    setBillingStatus({ error: undefined })
    try {
      await cancelProMutation.mutateAsync({ teamId })
      await refetchBillingCheck()
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to schedule cancellation"
      toast.error(errorMessage)
      setBillingStatus({
        error: errorMessage,
      })
    }
  }, [cancelProMutation, refetchBillingCheck, setBillingStatus, teamId])

  const handleOpenDashboardDialog = useCallback(
    async (dashboard: "usage" | "commits_and_credits" | "invoices") => {
      if (!teamId) return

      const title = DASHBOARD_TITLES[dashboard] ?? "Billing"
      setDashboardDialog({ open: true, title, url: null, loading: true })

      try {
        const response = await dashboardUrlMutation.mutateAsync({
          teamId,
          dashboard,
        })
        setDashboardDialog((prev) => ({
          ...prev,
          url: response.url,
          loading: false,
        }))
      } catch (error) {
        setDashboardDialog((prev) => ({ ...prev, open: false, loading: false }))
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to load billing dashboard"
        toast.error(errorMessage)
      }
    },
    [dashboardUrlMutation, teamId],
  )

  const handleRedeemCoupon = useCallback(async () => {
    if (!teamId || !couponCode.trim()) return
    try {
      const result = await redeemCouponMutation.mutateAsync({
        teamId,
        code: couponCode,
      })
      toast.success(
        `Coupon redeemed! $${(result.amountCents / 100).toFixed(2)} in credits added.`,
      )
      setCouponCode("")
      setIsCouponModalOpen(false)
      refetchBillingCheck()
      utils.anBilling.creditStatus.invalidate()
      utils.anBilling.metrics.invalidate()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to redeem coupon",
      )
    }
  }, [couponCode, redeemCouponMutation, refetchBillingCheck, teamId, utils])

  const planStatus =
    billingStatus.planStatus ?? billingCheckData?.plan_status
  const billingCycleRange = getBillingCycleRangeFromEnd(
    billingCheckData?.current_period_end,
  )
  const billingCycleStartLabel = billingCycleRange
    ? format(billingCycleRange.from, "MMM d, yyyy")
    : null
  const billingCycleEndLabel = billingCycleRange
    ? format(billingCycleRange.to, "MMM d, yyyy")
    : null
  const isCancellationScheduled =
    planStatus === "pro" && Boolean(billingCheckData?.cancel_at_period_end)

  const {
    data: creditStatusData,
  } = api.anBilling.creditStatus.useQuery(
    { teamId: teamId! },
    {
      enabled: !!teamId,
    },
  )

  const { data: paymentMethodData } = api.anBilling.paymentMethod.useQuery(
    { teamId: teamId! },
    {
      enabled: !!teamId && planStatus === "pro",
    },
  )

  const showLoading = isBillingCheckLoading

  const includedCreditsUsd =
    planStatus === "pro" ? INCLUDED_CREDITS_PRO_USD : INCLUDED_CREDITS_FREE_USD

  // Use creditStatus when available (precise breakdown), fall back to check's credit_balance (instant)
  const hasCreditStatus = !!creditStatusData
  const creditTotal = hasCreditStatus
    ? creditStatusData.includedCredit.total
    : (billingCheckData?.credit_balance
        ? billingCheckData.credit_balance.total_cents / 100
        : includedCreditsUsd)
  const creditUsed = hasCreditStatus
    ? creditStatusData.includedCredit.used
    : (billingCheckData?.credit_balance
        ? (billingCheckData.credit_balance.total_cents - billingCheckData.credit_balance.remaining_cents) / 100
        : 0)
  const remainingCredit = Math.max(creditTotal - creditUsed, 0)
  const onDemandCharges = hasCreditStatus
    ? creditStatusData.includedCredit.overuse
    : 0
  const totalSpend = creditUsed + onDemandCharges
  const creditBarPercent =
    totalSpend > 0 ? (creditUsed / totalSpend) * 100 : 0
  const onDemandBarPercent =
    totalSpend > 0 ? (onDemandCharges / totalSpend) * 100 : 0

  return (
    <div className="h-full w-full overflow-auto bg-tl-background">
      <div className="mx-auto w-full max-w-[720px] px-8 py-6">
        {/* Metronome Dashboard Dialog */}
        <Dialog
          open={dashboardDialog.open}
          onOpenChange={(open) => {
            if (!open) {
              setDashboardDialog((prev) => ({ ...prev, open: false }))
            }
          }}
        >
          <DialogContent className="w-[900px] max-w-[calc(100vw-2rem)] p-0 gap-0 overflow-hidden bg-white">
            <DialogHeader className="px-5 py-4 border-b border-border">
              <DialogTitle className="text-sm font-medium">
                {dashboardDialog.title}
              </DialogTitle>
            </DialogHeader>
            {dashboardDialog.loading ? (
              <div className="flex items-center justify-center" style={{ height: 560 }}>
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : dashboardDialog.url ? (
              <div className="px-5 pb-5 pt-4">
                <iframe
                  src={dashboardDialog.url}
                  className="w-full border-0 rounded-md"
                  style={{ height: 560 }}
                  title={dashboardDialog.title}
                  sandbox="allow-scripts allow-same-origin allow-popups"
                />
              </div>
            ) : null}
          </DialogContent>
        </Dialog>

        {showLoading ? (
          <BillingSkeleton />
        ) : billingCheckError ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6 text-sm text-destructive">
            <p className="font-medium mb-1">Failed to load billing</p>
            <p className="text-xs opacity-80">{billingCheckError.message}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* ── Plan Header ── */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold tracking-tight">
                  {planStatus === "pro" ? "Pay as you go" : "Hobby"}
                </h1>
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  Active
                </span>
                {planStatus === "pro" && paymentMethodData?.card && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CreditCard className="h-3.5 w-3.5" />
                    {paymentMethodData.card.brand.charAt(0).toUpperCase() + paymentMethodData.card.brand.slice(1)} •••• {paymentMethodData.card.last4}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {planStatus === "pro" &&
                  billingCycleStartLabel &&
                  billingCycleEndLabel && (
                    <span className="text-[13px] text-muted-foreground mr-1">
                      {billingCycleStartLabel} - {billingCycleEndLabel}
                    </span>
                  )}
                {planStatus === "pro" && (
                  <button
                    type="button"
                    onClick={() => {
                      void handleOpenDashboardDialog("invoices")
                    }}
                    disabled={dashboardUrlMutation.isPending}
                    className="an-focus-btn inline-flex items-center rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-foreground/5 disabled:opacity-70"
                  >
                    Invoices
                  </button>
                )}
                <Dialog open={isCouponModalOpen} onOpenChange={setIsCouponModalOpen}>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="an-focus-btn rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground whitespace-nowrap transition-colors hover:bg-foreground/5"
                    >
                      Coupon
                    </button>
                  </DialogTrigger>
                  <DialogContent className="w-[90vw] max-w-[400px] rounded-2xl p-0 gap-0 overflow-hidden shadow-2xl">
                    <div className="p-6">
                      <h2 className="text-xl font-semibold mb-1">Redeem coupon</h2>
                      <p className="text-sm text-muted-foreground mb-4">
                        Enter a coupon code to add credits.
                      </p>
                      <Input
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && couponCode.trim() && !redeemCouponMutation.isPending) {
                            e.preventDefault()
                            void handleRedeemCoupon()
                          }
                        }}
                        placeholder="Coupon code"
                        className="w-full h-11 text-sm font-mono uppercase"
                        disabled={redeemCouponMutation.isPending}
                        autoFocus
                      />
                    </div>
                    <div className="bg-muted p-4 flex justify-between border-t border-border">
                      <button
                        type="button"
                        onClick={() => setIsCouponModalOpen(false)}
                        disabled={redeemCouponMutation.isPending}
                        className="an-focus-btn rounded-md px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5 disabled:opacity-70"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleRedeemCoupon()}
                        disabled={redeemCouponMutation.isPending || !couponCode.trim()}
                        className="an-focus-btn rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background transition-colors hover:bg-foreground/85 disabled:opacity-70"
                      >
                        {redeemCouponMutation.isPending ? "Redeeming..." : "Redeem"}
                      </button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Link
                  href="/agents/usage"
                  className="inline-flex items-center rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-foreground/5"
                >
                  Usage
                </Link>
              </div>
            </div>

            {/* ── Usage Section ── */}
            <div>
              <h2 className="text-base font-semibold mb-1">Usage</h2>
              <p className="text-sm text-muted-foreground mb-3">
                {planStatus === "pro"
                  ? "Infrastructure usage is drawn from your included credit. Once the credits are spent, additional usage is billed on-demand."
                  : `Infrastructure usage is drawn from your $${INCLUDED_CREDITS_FREE_USD.toFixed(0)} included credits.`}
              </p>

              <div className="rounded-lg border border-border bg-card">
                {/* Credit + On-Demand summary */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    {/* Included Credit */}
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-full border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
                        <Coins className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-[13px] text-muted-foreground">
                          Included Credit
                        </p>
                        <p className="text-sm font-medium tabular-nums">
                          {formatCurrency(remainingCredit)} / {formatCurrency(includedCreditsUsd)}
                        </p>
                      </div>
                    </div>

                    {/* On-Demand Charges — Pro only */}
                    {planStatus === "pro" && (
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                          <p className="text-[13px] text-muted-foreground">
                            On-Demand Charges
                          </p>
                          <p className="text-sm font-medium tabular-nums">
                            {formatCurrency(onDemandCharges)}
                          </p>
                        </div>
                        <div className="flex size-8 items-center justify-center rounded-full border border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950">
                          <CircleDollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="flex h-2.5 w-full overflow-hidden rounded-full gap-[2px]">
                    {creditUsed > 0 ? (
                      <>
                        <div
                          className="h-2.5 rounded-l-full bg-blue-600 dark:bg-blue-500 transition-all"
                          style={{
                            width:
                              planStatus === "pro" && totalSpend > 0
                                ? `${Math.max(creditBarPercent, 1)}%`
                                : `${Math.max((creditUsed / includedCreditsUsd) * 100, 1)}%`,
                          }}
                        />
                        {planStatus === "pro" && onDemandCharges > 0 && (
                          <div
                            className="h-2.5 rounded-r-full bg-purple-600 dark:bg-purple-500 transition-all"
                            style={{ width: `${Math.max(onDemandBarPercent, 1)}%` }}
                          />
                        )}
                      </>
                    ) : (
                      <div className="h-2.5 w-full rounded-full bg-muted" />
                    )}
                  </div>
                </div>

                {/* Upcoming Invoice — Pro only */}
                {planStatus === "pro" && (
                  <div className="border-t p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded-full border border-border bg-muted/50">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-[13px] text-muted-foreground">
                            Upcoming Invoice
                          </p>
                          <p className="text-sm font-medium tabular-nums">
                            {formatCurrency(totalSpend)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          void handleOpenDashboardDialog("invoices")
                        }}
                        disabled={dashboardUrlMutation.isPending}
                        className="an-focus-btn inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-foreground/5 disabled:opacity-70"
                      >
                        View Invoices
                        <ArrowUpRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Upgrade to Pro CTA (free plan only) ── */}
            {(planStatus === "free" || !planStatus) && (
              <div className="rounded-lg border border-border overflow-hidden bg-card">
                <div className="px-4 py-3 border-b bg-muted/30">
                  <h2 className="text-sm font-semibold">Upgrade to Pro</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Unlock higher limits and pay-as-you-go billing beyond included credits.
                  </p>
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="rounded-md border border-border p-3">
                      <p className="text-xs text-muted-foreground">Included credits</p>
                      <p className="text-lg font-semibold tabular-nums mt-0.5">
                        ${INCLUDED_CREDITS_PRO_USD.toFixed(0)}<span className="text-xs font-normal text-muted-foreground">/mo</span>
                      </p>
                    </div>
                    <div className="rounded-md border border-border p-3">
                      <p className="text-xs text-muted-foreground">On-demand billing</p>
                      <p className="text-sm font-medium mt-1.5">
                        Pay as you go
                      </p>
                    </div>
                    <div className="rounded-md border border-border p-3">
                      <p className="text-xs text-muted-foreground">Monthly fee</p>
                      <p className="text-lg font-semibold tabular-nums mt-0.5">
                        ${INCLUDED_CREDITS_PRO_USD.toFixed(0)}<span className="text-xs font-normal text-muted-foreground">/mo</span>
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsUpgradeDialogOpen(true)}
                    className="an-focus-btn inline-flex w-full items-center justify-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/85"
                  >
                    Upgrade to Pro
                  </button>
                </div>
              </div>
            )}

            {/* Stripe Upgrade Dialog */}
            {teamId && (
              <StripeUpgradeDialog
                open={isUpgradeDialogOpen}
                onOpenChange={setIsUpgradeDialogOpen}
                teamId={teamId}
                onUpgradeComplete={async () => {
                  try {
                    await executeUpgradeToPro()
                    setIsUpgradeDialogOpen(false)
                    toast.success("Plan upgraded successfully")
                  } catch (error) {
                    const errorMessage =
                      error instanceof Error ? error.message : "Failed to upgrade to Pro"
                    toast.error(errorMessage)
                  }
                }}
              />
            )}

            {/* ── Pricing Table ── */}
            <div className="rounded-lg border border-border bg-card">
              <div className="px-4 py-3 border-b">
                <h2 className="text-[13px] font-medium">Pricing</h2>
              </div>
              <table className="w-full text-[12px]">
                <tbody>
                  <tr className="border-b bg-muted/30">
                    <td colSpan={3} className="px-4 py-2">
                      <span className="font-medium text-foreground text-[11px]">
                        Agents
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="pl-4 pr-2 py-2.5 text-muted-foreground">
                      Claude API
                    </td>
                    <td className="px-2 py-2.5 text-right font-medium tabular-nums">
                      pass-through
                    </td>
                    <td className="pl-2 pr-4 py-2.5 text-muted-foreground">
                      Same as Anthropic
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="pl-4 pr-2 py-2.5 text-muted-foreground">
                      <span className="block">Sandbox runtime</span>
                      <span className="block text-[11px] text-muted-foreground/80 mt-0.5">
                        {AGENT_SANDBOX_SPECS_LABEL}
                      </span>
                    </td>
                    <td className="px-2 py-2.5 text-right font-medium tabular-nums">
                      ${SANDBOX_RATE_LABEL}
                    </td>
                    <td className="pl-2 pr-4 py-2.5 text-muted-foreground">
                      / second
                    </td>
                  </tr>
                  <tr className="border-b bg-muted/30">
                    <td colSpan={3} className="px-4 py-2">
                      <span className="font-medium text-foreground text-[11px]">
                        Plan
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="pl-4 pr-2 py-2.5 text-muted-foreground">
                      Included credits
                    </td>
                    <td className="px-2 py-2.5 text-right font-medium tabular-nums">
                      ${includedCreditsUsd.toFixed(0)}
                    </td>
                    <td className="pl-2 pr-4 py-2.5 text-muted-foreground">
                      {planStatus === "pro" ? "/ month" : "one-time"}
                    </td>
                  </tr>
                  <tr>
                    <td className="pl-4 pr-2 py-2.5 text-muted-foreground">
                      Monthly fee
                    </td>
                    <td className="px-2 py-2.5 text-right font-medium tabular-nums">
                      {planStatus === "pro"
                        ? `$${INCLUDED_CREDITS_PRO_USD.toFixed(0)}`
                        : "$0"}
                    </td>
                    <td className="pl-2 pr-4 py-2.5 text-muted-foreground">
                      / month
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ── Footer Actions ── */}
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-4 py-3">
              <div>
                {planStatus === "pro" && (
                  <button
                    type="button"
                    onClick={() => {
                      void handleCancelPro()
                    }}
                    disabled={
                      cancelProMutation.isPending || isCancellationScheduled
                    }
                    className="an-focus-btn inline-flex items-center rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-foreground/5 disabled:opacity-70"
                  >
                    {cancelProMutation.isPending
                      ? "Scheduling..."
                      : isCancellationScheduled
                        ? "Cancellation Scheduled"
                        : "Downgrade"}
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">
                  Questions?
                </span>
                <a
                  href="mailto:support@21st.dev"
                  className="inline-flex items-center rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-foreground/5"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
