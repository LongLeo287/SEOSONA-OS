import { prisma } from "@/lib/prisma"

// Only OneCode plans grant agents access
const AGENTS_ENABLED_PLANS = ["onecode_pro", "onecode_max_100", "onecode_max"] as const

export async function hasAgentsAccess(userId: string): Promise<boolean> {
  // Check if user is admin - admins always have access
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { is_admin: true },
  })

  if (user?.is_admin) {
    return true
  }

  // Check for active subscription in agents table (primary)
  const agentsPlan = await prisma.usersToPlanAgents.findUnique({
    where: { user_id: userId },
    include: { plan: true },
  })

  if (agentsPlan?.status === "active" && agentsPlan?.plan?.type) {
    if (AGENTS_ENABLED_PLANS.includes(
      agentsPlan.plan.type as (typeof AGENTS_ENABLED_PLANS)[number],
    )) {
      return true
    }
  }

  // Fallback: Check old table for backwards compatibility
  const userPlan = await prisma.usersToPlan.findUnique({
    where: { user_id: userId },
    include: { plan: true },
  })

  if (!userPlan?.plan?.type || userPlan.status !== "active") {
    return false
  }

  return AGENTS_ENABLED_PLANS.includes(
    userPlan.plan.type as (typeof AGENTS_ENABLED_PLANS)[number],
  )
}
