import {
  FREE_USAGE_LIMIT,
  PLAN_LIMITS,
  PlanType,
} from "@/lib/config/subscription-plans"
import { prisma } from "@/lib/prisma"
import stripe, { getLastPaymentDate } from "@/lib/stripe"
import { TRPCError } from "@trpc/server"
import { differenceInMonths } from "date-fns"

export class UsageService {
  static async checkAndUpdateUsage(userId: string, increment: number = 1) {
    const userPlan = await prisma.usersToPlan.findFirst({
      where: {
        user_id: userId,
        status: "active",
      },
      include: {
        plan: true,
      },
    })

    let usageData = await prisma.usage.findUnique({
      where: { user_id: userId },
    })

    if (!usageData) {
      usageData = await prisma.usage.create({
        data: {
          user_id: userId,
          usage: 0,
          limit: FREE_USAGE_LIMIT,
        },
      })
    }

    const planType = (userPlan?.plan?.type || "free") as PlanType
    const planLimit = userPlan?.plan
      ? (PLAN_LIMITS[planType]?.generationsPerMonth ||
          PLAN_LIMITS.free.generationsPerMonth) + (userPlan.plan.add_usage || 0)
      : FREE_USAGE_LIMIT

    const actualLimit = usageData.limit || planLimit
    const currentUsage = usageData.usage || 0

    if (currentUsage >= actualLimit) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Usage limit exceeded",
        cause: {
          usage: currentUsage,
          limit: actualLimit,
          planType,
          isFreePlan: planType === "free",
        },
      })
    }

    await prisma.usage.update({
      where: { user_id: userId },
      data: { usage: currentUsage + increment },
    })

    return {
      usage: currentUsage + increment,
      limit: actualLimit,
      remaining: actualLimit - (currentUsage + increment),
      planType,
    }
  }

  static async checkUsage(userId: string) {
    const userPlan = await prisma.usersToPlan.findFirst({
      where: {
        user_id: userId,
        status: "active",
      },
      include: {
        plan: true,
      },
    })

    let usageData = await prisma.usage.findUnique({
      where: { user_id: userId },
    })

    if (!usageData) {
      usageData = await prisma.usage.create({
        data: {
          user_id: userId,
          usage: 0,
          limit: FREE_USAGE_LIMIT,
        },
      })
    }

    const planType = (userPlan?.plan?.type || "free") as PlanType
    const planLimit = userPlan?.plan
      ? (PLAN_LIMITS[planType]?.generationsPerMonth || PLAN_LIMITS.free.generationsPerMonth) +
        (userPlan.plan.add_usage || 0)
      : FREE_USAGE_LIMIT

    const actualLimit = usageData.limit || planLimit
    const currentUsage = usageData.usage || 0

    if (currentUsage >= actualLimit) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Usage limit exceeded",
        cause: {
          usage: currentUsage,
          limit: actualLimit,
          planType,
          isFreePlan: planType === "free",
        },
      })
    }

    return {
      usage: currentUsage,
      limit: actualLimit,
      remaining: actualLimit - currentUsage,
      planType,
    }
  }

  static async getUserUsage(userId: string) {
    const userPlan = await prisma.usersToPlan.findFirst({
      where: {
        user_id: userId,
        status: "active",
      },
      include: {
        plan: true,
      },
    })

    const usageData = await prisma.usage.findUnique({
      where: { user_id: userId },
    })

    const planType = (userPlan?.plan?.type || "free") as PlanType
    const planLimit = userPlan?.plan
      ? (PLAN_LIMITS[planType]?.generationsPerMonth || PLAN_LIMITS.free.generationsPerMonth) +
        (userPlan.plan.add_usage || 0)
      : FREE_USAGE_LIMIT

    const actualLimit = usageData?.limit || planLimit
    const currentUsage = usageData?.usage || 0

    return {
      usage: currentUsage,
      limit: actualLimit,
      remaining: Math.max(0, actualLimit - currentUsage),
      planType,
    }
  }

  static async calculateUsageDiscount(userId: string): Promise<number> {
    const usageData = await UsageService.getUserUsage(userId)

    // Get current user's plan and stripe price ID from database
    const userPlan = await prisma.usersToPlan.findFirst({
      where: {
        user_id: userId,
        status: "active",
      },
      include: {
        plan: true,
      },
    })

    if (!userPlan?.plan) {
      return 0
    }
    if (!userPlan.plan.stripe_plan_id) {
      throw new Error("No active plan or stripe price ID found for user")
    }

    // Fetch actual price from Stripe using the price ID
    const stripePrice = await stripe.prices.retrieve(
      userPlan.plan.stripe_plan_id,
    )
    const planPriceCents = stripePrice.unit_amount

    if (!planPriceCents) {
      throw new Error("Invalid price amount from Stripe")
    }

    // Calculate discount as (used / limit) * planPrice
    let limit = usageData.limit
    let remaining = usageData.remaining

    if (userPlan.plan.period === "yearly") {
      const meta = userPlan.meta as any
      const subscriptionId = meta?.stripe_subscription_id
      const lastPaymentDate = await getLastPaymentDate(subscriptionId)
      limit = 0 // Fallback to 0 discount by default

      if (lastPaymentDate) {
        const monthsPassed = differenceInMonths(new Date(), lastPaymentDate)
        limit = usageData.limit * 12
        remaining = limit - usageData.usage - usageData.limit * monthsPassed
      }
    }

    let discountAmount = 0
    if (limit > 0) {
      discountAmount = Math.min(
        Math.round((remaining / limit) * planPriceCents),
        planPriceCents,
      )
    }

    console.log(
      `Calculated usage discount (${remaining} / ${limit}) * $${Math.round(planPriceCents / 100)}:`,
      discountAmount,
    )

    return -discountAmount
  }
}
