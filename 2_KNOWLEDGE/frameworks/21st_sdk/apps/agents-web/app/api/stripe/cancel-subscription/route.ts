import { stripeV1, stripeV2 } from "@/lib/stripe"
import { StripeService } from "@/server/api/routers/stripe/services/stripe.service"
import { Database } from "@/types/supabase"
import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

type Plan = Database["public"]["Tables"]["plans"]["Row"]

interface UserPlanMeta {
  stripe_subscription_id?: string
  stripe_customer_id?: string
  stripe_plan_id?: string
  period_end?: string
  will_cancel_at_end?: boolean
  cancel_at?: string | null
}

interface UserPlanWithPlans {
  meta: UserPlanMeta | null
  plans: Pick<Plan, "version"> | null
}

export async function POST(request: NextRequest) {
  try {
    const authSession = await auth()
    const userId = authSession?.userId

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const subscriptionInfo = await StripeService.getSubscriptionInfo(userId)
    const subscriptionId = subscriptionInfo?.subscriptionId

    if (!subscriptionId) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 },
      )
    }

    // Determine which Stripe instance to use based on plan version
    const planVersion = subscriptionInfo.plan?.version || 1
    const stripeInstance = planVersion === 1 ? stripeV1 : stripeV2

    try {
      // Cancel the subscription in Stripe
      const subscription = await stripeInstance.subscriptions.update(
        subscriptionId,
        {
          cancel_at_period_end: true,
        },
      )

      console.log("Subscription updated:", subscription)

      return NextResponse.json({
        success: true,
        message: "Subscription successfully canceled",
      })
    } catch (stripeError: any) {
      console.error("Stripe error:", stripeError)
      return NextResponse.json(
        {
          error: stripeError.message || "Failed to cancel subscription",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in cancel-subscription:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
