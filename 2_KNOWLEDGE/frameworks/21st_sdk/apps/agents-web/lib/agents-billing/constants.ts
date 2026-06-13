export const BILLING_FREE_CREDIT_AMOUNT = 1000 // cents
export const BILLING_MONTHLY_COMMIT_AMOUNT = 2000 // cents
/** E2B sandbox size — keep in sync with packages/agent-runtime/build.ts (cpuCount, memoryMB). */
export const AGENT_SANDBOX_SPECS_LABEL = "2 vCPU, 8 GiB RAM"
/** E2B pass-through: an-runtime template = 2 vCPU ($0.000028) + 8 GiB RAM ($0.000036) = $0.000064/s. Rate card in Metronome must match. */
export const COMPUTE_USAGE_COST_PER_SECOND_USD = 0.000064
