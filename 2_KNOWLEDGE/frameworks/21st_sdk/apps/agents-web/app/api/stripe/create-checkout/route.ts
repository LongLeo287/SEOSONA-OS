import { getPlanGroup } from "@/lib/plan-groups"
import { checkoutUserLimiter, checkoutIpLimiter } from "@/lib/rate-limit"
import stripe, {
  getIdBySubscriptionPlanDetails,
  STRIPE_ENV,
  stripeV2,
} from "@/lib/stripe"
import { supabaseWithAdminAccess } from "@/lib/supabase"
import { StripeService } from "@/server/api/routers/stripe/services/stripe.service"
import { UsageService } from "@/server/api/routers/usage/services/usage.service"
import { getAgentsRequestSession } from "@/lib/agents/auth/server"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// Valid plans for checkout (excluding free since users don't checkout for free plans)
const VALID_CHECKOUT_PLANS = [
  "pro",
  "pro_plus",
  "pro_custom_1",
  "pro_custom_2",
  "pro_custom_3",
  "pro_custom_4",
  "pro_custom_5",
  "onecode_pro",
  "onecode_max_100",
  "onecode_max",
] as const

// Valid current plans (includes all plan types since user could be on any)
const VALID_CURRENT_PLANS = [
  "free",
  "pro",
  "pro_plus",
  "pro_custom_1",
  "pro_custom_2",
  "pro_custom_3",
  "pro_custom_4",
  "pro_custom_5",
  "onecode_pro",
  "onecode_max_100",
  "onecode_max",
] as const

const checkoutSchema = z.object({
  planId: z.enum(VALID_CHECKOUT_PLANS),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
  period: z.enum(["monthly", "yearly"]).optional().default("monthly"),
  isUpgrade: z.boolean().optional(),
  currentPlanId: z
    .enum(VALID_CURRENT_PLANS)
    .optional(),
  subscriptionId: z.string().optional(),
  gaClientId: z.string().optional(),
  tolt_referral: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validationResult = checkoutSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: validationResult.error.errors,
        },
        { status: 400 },
      )
    }

    const { planId, successUrl, cancelUrl, period, gaClientId, tolt_referral } =
      validationResult.data

    const userId = (await getAgentsRequestSession(request)).internalUserId
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Rate limit: 2 checkouts per user/hour, 5 per IP/hour
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown"

    const [userLimit, ipLimit] = await Promise.all([
      checkoutUserLimiter.limit(userId),
      checkoutIpLimiter.limit(ip),
    ])

    if (!userLimit.success || !ipLimit.success) {
      return NextResponse.json(
        { error: "Too many checkout attempts. Please try again later." },
        { status: 429 },
      )
    }

    const { data: user, error: userError } = await supabaseWithAdminAccess
      .from("users")
      .select("email")
      .eq("id", userId)
      .maybeSingle()
    if (userError) {
      return NextResponse.json({ error: "Failed to get user" }, { status: 500 })
    }

    // Determine the target plan group to query the correct subscription table
    const targetPlanGroup = getPlanGroup(planId)

    const subscriptionInfo = await StripeService.getSubscriptionInfo(userId, targetPlanGroup ?? undefined)
    const subscriptionId = subscriptionInfo?.subscriptionId
    const currentPlanType = subscriptionInfo?.activePlanType

    let priceId: string
    try {
      // Always use version 2 for new checkouts
      priceId = await getIdBySubscriptionPlanDetails(planId, period, 2)
      // priceId = "price_1RBCVXGClBhopEwDdb3OTKtZ"
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid subscription plan configuration" },
        { status: 400 },
      )
    }

    const currentPlanGroup = getPlanGroup(currentPlanType)
    const isSamePlanGroup =
      currentPlanType === "free" ||
      (currentPlanGroup &&
      targetPlanGroup &&
      currentPlanGroup === targetPlanGroup)

    if (currentPlanType !== "free" && priceId === subscriptionInfo?.priceId) {
      return NextResponse.json(
        { error: "Cannot create checkout session for the same plan" },
        { status: 400 },
      )
    }

    const isUpgrade =
      isSamePlanGroup && currentPlanType !== "free" && priceId !== subscriptionInfo?.priceId

    try {
      if (isUpgrade && currentPlanType !== "free" && subscriptionId) {
        try {
          const subscription =
            await stripe.subscriptions.retrieve(subscriptionId)

          if (subscription.metadata.userId === userId) {
            const subscriptionItemId = subscription.items.data[0]?.id

            if (!subscriptionItemId) {
              throw new Error("Subscription item not found")
            }

            if (!planId) {
              throw new Error("Plan ID is undefined")
            }

            // const updatedMetadata: Record<string, string> = {}

            // for (const [key, value] of Object.entries(
            //   subscription.metadata || {},
            // )) {
            //   if (value) updatedMetadata[key] = value
            // }

            // updatedMetadata.upgraded_from = currentPlanType || "free"
            // updatedMetadata.upgraded_to = planId
            // updatedMetadata.upgraded_at = new Date().toISOString()
            // if (tolt_referral) {
            //   updatedMetadata.tolt_referral = tolt_referral
            // }
            const discountProductId =
              STRIPE_ENV === "live"
                ? "prod_SgricgyNAilhVR"
                : "prod_SgbMjrZyLtJ5u5"

            const updatedSubscription = await stripe.subscriptions.update(
              subscription.id,
              {
                // NOT SUPPORTED FOR pending_if_incomplete
                //cancel_at_period_end: false,
                proration_behavior: "none",
                payment_behavior: "pending_if_incomplete",
                billing_cycle_anchor: "now",
                items: [
                  {
                    id: subscriptionItemId,
                    price: priceId,
                  },
                ],
                add_invoice_items: [
                  {
                    price_data: {
                      currency: "usd",
                      product: discountProductId,
                      unit_amount:
                        await UsageService.calculateUsageDiscount(userId),
                    },
                    quantity: 1,
                  },
                ],
                // NOT SUPPORTED FOR pending_if_incomplete
                //metadata: updatedMetadata,
              },
            )

            return NextResponse.json({
              url: successUrl,
              directly_upgraded: true,
            })
          }
        } catch (subscriptionError) {
          console.error("Subscription upgrade error", subscriptionError)
          return NextResponse.json(
            { error: "Failed to create checkout session" },
            { status: 500 },
          )
        }
      }

      // For new checkout sessions, always use V2
      const session = await stripeV2.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        metadata: {
          userId,
          ...(gaClientId && { gaClientId }),
          ...(tolt_referral && { tolt_referral }),
          ...(isUpgrade && { isUpgrade: "true", oldPlanId: currentPlanType }),
        },
        ...(subscriptionInfo?.customerId
          ? {
              customer: subscriptionInfo?.customerId,
              customer_update: {
                name: "auto",
              },
            }
          : user?.email
            ? {
                customer_email: user.email,
              }
            : {}),
        allow_promotion_codes: true,
        tax_id_collection: {
          enabled: true,
        },
        success_url: successUrl,
        cancel_url: cancelUrl,
        subscription_data: {
          metadata: {
            userId,
            ...(gaClientId && { gaClientId }),
            ...(tolt_referral && { tolt_referral }),
            ...(isUpgrade && { upgraded_from: currentPlanType }),
          },
        },
      })

      return NextResponse.json({ url: session.url })
    } catch (error) {
      console.error("Stripe error", error)
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: 500 },
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    )
  }
}
