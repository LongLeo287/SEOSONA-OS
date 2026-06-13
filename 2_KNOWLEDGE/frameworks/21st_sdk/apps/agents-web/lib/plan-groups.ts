export const ONECODE_PLAN_IDS = new Set(["onecode_pro", "onecode_max_100", "onecode_max"])

export type PlanGroup = "onecode" | "core"

export const getPlanGroup = (planId?: string | null): PlanGroup | null => {
  if (!planId) return null
  return ONECODE_PLAN_IDS.has(planId) ? "onecode" : "core"
}