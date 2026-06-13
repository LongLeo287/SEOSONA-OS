import Metronome from "@metronome/sdk"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import {
  createTRPCRouter,
  adminProcedure,
  protectedProcedure,
} from "@/server/api/trpc"
import { checkTeamAccess } from "../teams/utils"
import {
  BILLING_CREDIT_TYPE_ID,
  BILLING_COMMIT_PRODUCT_ID,
} from "@/lib/agents-billing/ensure-team-billing"

const METRONOME_BEARER_TOKEN = process.env.METRONOME_BEARER_TOKEN
// Higher priority = consumed later. Free=1, Pro=10, Coupon=100.
const COUPON_CREDIT_PRIORITY = 100

function getMetronomeClient() {
  if (!METRONOME_BEARER_TOKEN) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "METRONOME_BEARER_TOKEN is not configured",
    })
  }
  return new Metronome({ bearerToken: METRONOME_BEARER_TOKEN })
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined
}

function toHourBoundary(date: Date) {
  const d = new Date(date)
  d.setUTCMinutes(0, 0, 0)
  return d.toISOString()
}

function generateCouponCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let result = ""
  for (let i = 0; i < 8; i++) {
    if (i === 4) result += "-"
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

function normalizeCouponCode(code: string) {
  return code.trim().toUpperCase()
}

export const anBillingCouponsRouter = createTRPCRouter({
  createCoupon: adminProcedure
    .input(
      z.object({
        code: z
          .string()
          .max(50)
          .transform(normalizeCouponCode)
          .optional(),
        amountCents: z.number().int().min(1),
        maxRedemptions: z.number().int().min(1).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const code = input.code || generateCouponCode()

      const existing = await prisma.agentsCoupon.findUnique({
        where: { code },
      })
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Coupon code already exists",
        })
      }

      return prisma.agentsCoupon.create({
        data: {
          code,
          amount_cents: input.amountCents,
          max_redemptions: input.maxRedemptions ?? null,
          created_by: ctx.auth.userId!,
        },
      })
    }),

  listCoupons: adminProcedure.query(async () => {
    return prisma.agentsCoupon.findMany({
      orderBy: { created_at: "desc" },
      include: {
        _count: { select: { redemptions: true } },
      },
    })
  }),

  toggleCoupon: adminProcedure
    .input(z.object({ couponId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const coupon = await prisma.agentsCoupon.findUniqueOrThrow({
        where: { id: input.couponId },
      })
      return prisma.agentsCoupon.update({
        where: { id: input.couponId },
        data: { is_active: !coupon.is_active },
      })
    }),

  listRedemptions: adminProcedure
    .input(z.object({ couponId: z.string().uuid() }))
    .query(async ({ input }) => {
      return prisma.agentsCouponRedemption.findMany({
        where: { coupon_id: input.couponId },
        orderBy: { redeemed_at: "desc" },
        include: {
          team: { select: { id: true, name: true } },
        },
      })
    }),

  redeemCoupon: protectedProcedure
    .input(
      z.object({
        teamId: z.string().uuid(),
        code: z
          .string()
          .min(1)
          .transform(normalizeCouponCode),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)

      const coupon = await prisma.agentsCoupon.findUnique({
        where: { code: input.code },
        include: { _count: { select: { redemptions: true } } },
      })

      if (!coupon || !coupon.is_active) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid or inactive coupon code",
        })
      }

      if (
        coupon.max_redemptions !== null &&
        coupon._count.redemptions >= coupon.max_redemptions
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "This coupon has reached its maximum number of redemptions",
        })
      }

      const existingRedemption =
        await prisma.agentsCouponRedemption.findUnique({
          where: {
            coupon_id_team_id: {
              coupon_id: coupon.id,
              team_id: input.teamId,
            },
          },
        })
      if (existingRedemption) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This coupon has already been redeemed for this team",
        })
      }

      const userRedemption =
        await prisma.agentsCouponRedemption.findFirst({
          where: {
            coupon_id: coupon.id,
            user_id: ctx.auth.userId!,
          },
        })
      if (userRedemption) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have already redeemed this coupon",
        })
      }

      const team = await prisma.team.findUnique({
        where: { id: input.teamId },
        select: { stripe: true },
      })
      const billingState = team?.stripe as Record<string, unknown> | null
      const metronomeCustomerId = asString(
        billingState?.metronome_customer_id,
      )

      if (!metronomeCustomerId) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message:
            "Team billing is not set up. Please visit the billing page first.",
        })
      }

      const client = getMetronomeClient()
      const now = new Date()
      const startingAt = toHourBoundary(now)
      const end = new Date(now)
      end.setUTCFullYear(end.getUTCFullYear() + 10)
      const endingBefore = toHourBoundary(end)

      // Add a new free credit pack with high priority (consumed after free/prepaid credits)
      const creditResponse = await client.v1.customers.credits.create({
        customer_id: metronomeCustomerId,
        priority: COUPON_CREDIT_PRIORITY,
        product_id: BILLING_COMMIT_PRODUCT_ID,
        name: `Coupon: ${coupon.code}`,
        rate_type: "LIST_RATE",
        access_schedule: {
          credit_type_id: BILLING_CREDIT_TYPE_ID,
          schedule_items: [
            {
              amount: coupon.amount_cents,
              starting_at: startingAt,
              ending_before: endingBefore,
            },
          ],
        },
        uniqueness_key: `coupon-${coupon.id}-${input.teamId}`,
      })

      const redemption = await prisma.agentsCouponRedemption.create({
        data: {
          coupon_id: coupon.id,
          team_id: input.teamId,
          user_id: ctx.auth.userId!,
          metronome_credit_id: creditResponse.data?.id ?? null,
        },
      })

      return {
        success: true,
        amountCents: coupon.amount_cents,
        redemptionId: redemption.id,
      }
    }),
})
