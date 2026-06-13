import { type PlanGroup } from "@/lib/plan-groups"
import { prisma } from "@/lib/prisma"
import stripe from "@/lib/stripe"
import Stripe from "stripe"

export class StripeService {
  static async getSubscriptionInfo(userId: string, planGroup?: PlanGroup) {
    const defaultResult = {
      plan: null,
      status: null,
      meta: null,
      activePlanType: "free",
      priceId: null,
      subscriptionId: null,
      customerId: null,
    }

    // Query the appropriate table based on planGroup
    const userToPlan = planGroup === "onecode"
      ? await prisma.usersToPlanAgents.findUnique({
          where: { user_id: userId },
          include: { plan: true },
        })
      : await prisma.usersToPlan.findUnique({
          where: { user_id: userId },
          include: { plan: true },
        })

    if (!userToPlan) {
      return defaultResult
    }

    // Проверяем наличие активной подписки
    const activePlan =
      userToPlan.status === "active" ? userToPlan.plan?.type : "free"
    const meta = (userToPlan?.meta as any) || {}

    return {
      plan: userToPlan.plan,
      status: userToPlan.status ?? null,
      meta: userToPlan.meta ?? null,
      activePlanType: activePlan,
      priceId: userToPlan.plan?.stripe_plan_id,
      subscriptionId: meta?.stripe_subscription_id,
      customerId: meta?.stripe_customer_id,
    }
  }

  static async getUserBalance(userId: string, planGroup?: PlanGroup) {
    const subscriptionInfo = await StripeService.getSubscriptionInfo(
      userId,
      planGroup,
    )
    const customerId = subscriptionInfo.customerId

    if (!customerId) {
      return 0
    }

    try {
      // Retrieve customer information
      const customer = await stripe.customers.retrieve(customerId)

      if (customer.deleted) {
        return 0
      }

      // Stripe stores customer credit balance as negative values, so we invert the sign
      // to show positive credits as positive values to users
      return -(customer.balance || 0)
    } catch (error) {
      console.error("Error retrieving customer information from Stripe:", error)
      throw new Error("Failed to retrieve customer balance")
    }
  }

  static async getNextPaymentDate(
    userId: string,
    planGroup?: PlanGroup,
  ): Promise<{
    next_payment_at: string | null
    will_be_canceled_at: string | null
  }> {
    const defaultResult = {
      next_payment_at: null,
      will_be_canceled_at: null,
    }

    const subscriptionInfo = await StripeService.getSubscriptionInfo(
      userId,
      planGroup,
    )
    const subscriptionId = subscriptionInfo.subscriptionId

    if (!subscriptionId) {
      return defaultResult
    }

    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
        expand: ["latest_invoice"],
      })
      const latestInvoice = subscription.latest_invoice as Stripe.Invoice | null

      let nextPaymentAt: string | null = null
      if (latestInvoice?.next_payment_attempt) {
        // Use next_payment_attempt if available (payment retry scenario)
        nextPaymentAt = new Date(
          latestInvoice.next_payment_attempt * 1000,
        ).toISOString()
      } else if (subscription.current_period_end) {
        // Fall back to current_period_end for regular billing cycles
        nextPaymentAt = new Date(
          subscription.current_period_end * 1000,
        ).toISOString()
      }

      const willBeCanceledAt = subscription.cancel_at_period_end
        ? nextPaymentAt
        : null

      return {
        next_payment_at: nextPaymentAt,
        will_be_canceled_at: willBeCanceledAt,
      }
    } catch (error) {
      console.error("Error retrieving subscription from Stripe:", error)
      return defaultResult
    }
  }

  static async createCustomerPortalSession(
    userId: string,
    planGroup?: PlanGroup,
  ): Promise<{ url: string }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    })

    if (!user || !user.email) {
      throw new Error("User not found or missing email")
    }

    const subscriptionInfo = await StripeService.getSubscriptionInfo(
      userId,
      planGroup,
    )
    const customerId = subscriptionInfo.customerId

    if (!customerId) {
      throw new Error("Stripe customer not found for this user")
    }

    const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })

    return { url: session.url }
  }
}
