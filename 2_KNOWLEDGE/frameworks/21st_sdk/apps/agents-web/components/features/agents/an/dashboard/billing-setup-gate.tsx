"use client"

import { create } from "zustand"

type BillingPlanStatus = "free" | "pro"

type BillingReadinessStatus = {
  ready: boolean
  checking: boolean
  planStatus?: BillingPlanStatus
  setupUrl?: string
  blocker?: string
  error?: string
}

type BillingReadinessStore = {
  status: BillingReadinessStatus
  setStatus: (patch: Partial<BillingReadinessStatus>) => void
  resetStatus: () => void
}

const initialStatus: BillingReadinessStatus = {
  ready: true,
  checking: false,
}

export const useBillingReadinessStore = create<BillingReadinessStore>(
  (set) => ({
    status: initialStatus,
    setStatus: (patch) =>
      set((state) => ({
        status: { ...state.status, ...patch },
      })),
    resetStatus: () => set({ status: initialStatus }),
  }),
)

type BillingSetupGateProps = {
  teamId?: string | null
  enabled?: boolean
  children: React.ReactNode
}

export function BillingSetupGate({
  teamId: _teamId,
  enabled: _enabled = true,
  children,
}: BillingSetupGateProps) {
  return <>{children}</>
}
