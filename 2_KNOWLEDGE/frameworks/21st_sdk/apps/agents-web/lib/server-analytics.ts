// Server-side Google Analytics tracking using Measurement Protocol

const GA_MEASUREMENT_ID = "G-X7C2K3V7GX"
const GA_API_SECRET = process.env.GA_API_SECRET

export interface ServerAnalyticsEvent {
  eventName: string
  parameters: Record<string, any>
  userId?: string
  clientId?: string
}

/**
 * Send event to Google Analytics 4 using Measurement Protocol
 * This works server-side without requiring browser gtag
 */
export const trackServerEvent = async ({
  eventName,
  parameters,
  userId,
  clientId = generateClientId(),
}: ServerAnalyticsEvent): Promise<void> => {
  try {
    // Skip in development
    if (process.env.NODE_ENV === "development") {
      console.log("GA Event (dev mode):", {
        eventName,
        parameters,
        userId,
        clientId,
      })
    }

    if (!GA_API_SECRET) {
      console.warn("GA_API_SECRET not set, skipping analytics")
      return
    }

    const url = `https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`

    const payload = {
      client_id: clientId,
      user_id: userId,
      events: [
        {
          name: eventName,
          params: parameters,
        },
      ],
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`GA API responded with status: ${response.status}`)
    }

    console.log("Analytics event sent successfully:", eventName)
  } catch (error) {
    console.error("Error sending server analytics event:", error)
  }
}

/**
 * Track subscription purchase event from server
 */
export const trackServerSubscriptionPurchase = async ({
  planId,
  planType,
  planPeriod,
  userId,
  subscriptionId,
  amount,
  clientId,
}: {
  planId: string
  planType: string
  planPeriod: string
  userId: string
  subscriptionId: string
  amount?: number
  clientId?: string
}): Promise<void> => {
  await trackServerEvent({
    eventName: "purchase",
    parameters: {
      currency: "USD",
      transaction_id: subscriptionId,
      value: amount,
      items: [
        {
          item_id: planId,
          item_name: `${planType} ${planPeriod}`,
          item_category: "subscription",
          price: amount,
          quantity: 1,
        },
      ],
      // Custom parameters
      subscription_type: planType,
      subscription_period: planPeriod,
      plan_id: planId,
    },
    userId: userId,
    clientId,
  })
}

/**
 * Track subscription cancellation event from server
 */
export const trackServerSubscriptionCancellation = async ({
  planId,
  planType,
  userId,
  subscriptionId,
}: {
  planId: string
  planType: string
  userId: string
  subscriptionId: string
}): Promise<void> => {
  await trackServerEvent({
    eventName: "cancel_subscription",
    parameters: {
      subscription_id: subscriptionId,
      plan_id: planId,
      subscription_type: planType,
    },
    userId: userId,
  })
}

/**
 * Generate a client ID for server-side tracking
 */
function generateClientId(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  )
}
