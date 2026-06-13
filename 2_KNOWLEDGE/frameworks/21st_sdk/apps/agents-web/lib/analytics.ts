// Google Analytics utility functions
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
  }
}

export interface AnalyticsEvent {
  action: string
  category: string
  label?: string
  value?: number
  customParameters?: Record<string, any>
}

/**
 * Send an event to Google Analytics
 */
export const trackEvent = ({
  action,
  category,
  label,
  value,
  customParameters,
}: AnalyticsEvent): void => {
  try {
    // Check if gtag is available (client-side only)
    if (typeof window !== "undefined" && window.gtag) {
      const eventData: Record<string, any> = {
        event_category: category,
        event_label: label,
        value: value,
        ...customParameters,
      }

      // Remove undefined values
      Object.keys(eventData).forEach(
        (key) => eventData[key] === undefined && delete eventData[key],
      )

      window.gtag("event", action, eventData)
    }

    // Also send to Google Tag Manager if available
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: action,
        event_category: category,
        event_label: label,
        value: value,
        ...customParameters,
      })
    }
  } catch (error) {
    console.error("Error sending analytics event:", error)
  }
}

/**
 * Track subscription purchase event
 */
export const trackSubscriptionPurchase = ({
  planId,
  planType,
  planPeriod,
  userId,
  subscriptionId,
  amount,
}: {
  planId: string
  planType: string
  planPeriod: string
  userId: string
  subscriptionId: string
  amount?: number
}): void => {
  trackEvent({
    action: "purchase",
    category: "subscription",
    label: `${planType}_${planPeriod}`,
    value: amount,
    customParameters: {
      transaction_id: subscriptionId,
      currency: "USD",
      item_id: planId,
      item_name: `${planType} ${planPeriod}`,
      item_category: "subscription",
      user_id: userId,
    },
  })
}

/**
 * Track subscription cancellation event
 */
export const trackSubscriptionCancellation = ({
  planId,
  planType,
  userId,
  subscriptionId,
}: {
  planId: string
  planType: string
  userId: string
  subscriptionId: string
}): void => {
  trackEvent({
    action: "cancel_subscription",
    category: "subscription",
    label: planType,
    customParameters: {
      subscription_id: subscriptionId,
      plan_id: planId,
      user_id: userId,
    },
  })
}
