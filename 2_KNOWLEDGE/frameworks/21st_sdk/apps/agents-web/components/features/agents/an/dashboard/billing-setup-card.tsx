"use client"

import {
  AGENT_SANDBOX_SPECS_LABEL,
  BILLING_FREE_CREDIT_AMOUNT,
  COMPUTE_USAGE_COST_PER_SECOND_USD,
} from "@/lib/agents-billing/constants"

const SANDBOX_RUNTIME_RATE_LABEL = COMPUTE_USAGE_COST_PER_SECOND_USD.toFixed(6)

type BillingSetupCardProps = {
  setupUrl?: string
  blocker?: string
  error?: string
  onUpgradeToPro?: () => void
  isUpgrading?: boolean
}

export function BillingSetupCard({
  setupUrl,
  blocker,
  error,
  onUpgradeToPro,
  isUpgrading = false,
}: BillingSetupCardProps) {
  const showUpgradeAction = blocker === "insufficient_credits"
  const showSetupAction = !!setupUrl

  return (
    <div className="w-full max-w-[640px] space-y-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          {showUpgradeAction
            ? "Free credits are exhausted"
            : "Set up billing to continue"}
        </h1>
        {showUpgradeAction && (
          <p className="mt-1 text-sm text-muted-foreground">
            Upgrade to Pro to keep using chat and sandbox runtime.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-foreground/[0.03] px-4 py-3.5">
            <h3 className="text-[13px] font-medium text-foreground">Free</h3>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-[13px] leading-relaxed text-muted-foreground">
              <li>$0 monthly flat fee</li>
              <li>${BILLING_FREE_CREDIT_AMOUNT / 100} free credits</li>
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-foreground/[0.03] px-4 py-3.5">
            <h3 className="text-[13px] font-medium text-foreground">Pro</h3>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-[13px] leading-relaxed text-muted-foreground">
              <li>Monthly prepaid usage credits</li>
              <li>Claude API pass-through (same as Anthropic)</li>
              <li>{`E2B sandbox (${AGENT_SANDBOX_SPECS_LABEL}): $${SANDBOX_RUNTIME_RATE_LABEL}/s while running`}</li>
            </ul>
          </div>
        </div>
      </div>

      {error && <p className="text-[12px] text-red-500">{error}</p>}

      <div className="flex gap-2">
        {showUpgradeAction && onUpgradeToPro && (
          <button
            type="button"
            onClick={onUpgradeToPro}
            disabled={isUpgrading}
            className="an-focus-btn rounded-lg bg-foreground px-3 py-2 text-sm font-medium text-background whitespace-nowrap disabled:opacity-70"
          >
            {isUpgrading ? "Upgrading..." : "Upgrade to Pro"}
          </button>
        )}
        {showSetupAction && (
          <button
            type="button"
            onClick={() => {
              if (setupUrl) {
                window.location.href = setupUrl
              }
            }}
            className="an-focus-btn rounded-lg bg-foreground px-3 py-2 text-sm font-medium text-background"
          >
            Connect Card
          </button>
        )}
      </div>
    </div>
  )
}
