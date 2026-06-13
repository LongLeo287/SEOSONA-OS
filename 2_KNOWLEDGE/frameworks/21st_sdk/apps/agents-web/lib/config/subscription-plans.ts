/**
 * Subscription plans configuration
 * This file contains all information about subscription plans, including limits, features, and pricing
 */

import { PlanFeature, PlanPrice, PlanType, PricingPlan } from "@/types/global"

export type { PlanType }

// Plan limits and basic information
export interface PlanLimits {
  generationsPerMonth: number
  displayName: string
  name: string
  description: string
  features: string[]
  monthlyPrice?: number
  yearlyPrice?: number
  tokenPricing: {
    pricePerToken: {
      monthly: number
      yearly: number
    }
    componentCost: number
    generationCost: number
  }
}

export const FREE_USAGE_LIMIT = 100

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  free: {
    generationsPerMonth: FREE_USAGE_LIMIT,
    displayName: "Free",
    name: "Free",
    description: "For getting started",
    features: [
      `${FREE_USAGE_LIMIT} free credits per month`,
      "Usage-based pricing",
      "Сomponent library",
      "UI Inspiration Library",
      "Theme Library",
      "Unlimited UI Inspirations",
      "Unlimited SVG Logo Search",
      "Community support",
    ],
    tokenPricing: {
      pricePerToken: {
        monthly: 0,
        yearly: 0,
      },
      componentCost: 5,
      generationCost: 1,
    },
  },
  pro: {
    generationsPerMonth: 400,
    displayName: "Pro",
    name: "Pro",
    description: "For more projects and usage",
    features: [
      "400 credits per month",
      "Everything from Free",
      "Clone site feature",
      "Support in Email",
    ],
    monthlyPrice: 20,
    yearlyPrice: 192,
    tokenPricing: {
      pricePerToken: {
        monthly: 0.4,
        yearly: 0.32,
      },
      componentCost: 5,
      generationCost: 1,
    },
  },
  pro_plus: {
    generationsPerMonth: 200,
    displayName: "Pro Plus",
    name: "Pro Plus",
    description: "For power users",
    features: [
      "200 credits per month",
      "Everything from Pro",
      "Early access to new features",
    ],
    monthlyPrice: 40,
    yearlyPrice: 384,
    tokenPricing: {
      pricePerToken: {
        monthly: 0.2,
        yearly: 0.16,
      },
      componentCost: 5,
      generationCost: 1,
    },
  },
  pro_custom_1: {
    generationsPerMonth: 2000,
    displayName: "Max",
    name: "Max",
    description: "For power users and teams",
    features: [
      "2000 credits per month",
      "Everything from Pro",
      "Priority support",
    ],
    monthlyPrice: 100,
    yearlyPrice: 804,
    tokenPricing: {
      pricePerToken: {
        monthly: 0.05,
        yearly: 0.034,
      },
      componentCost: 5,
      generationCost: 1,
    },
  },
  pro_custom_2: {
    generationsPerMonth: 750,
    displayName: "Scale 750",
    name: "Scale 750",
    description: "For large projects",
    features: ["750 credits per month", "Everything from Pro Plus"],
    monthlyPrice: 150,
    yearlyPrice: 1206,
    tokenPricing: {
      pricePerToken: {
        monthly: 0.2,
        yearly: 0.134,
      },
      componentCost: 5,
      generationCost: 1,
    },
  },
  pro_custom_3: {
    generationsPerMonth: 1000,
    displayName: "Scale 1000",
    name: "Scale 1000",
    description: "For large projects",
    features: ["1000 credits per month", "Everything from Pro Plus"],
    monthlyPrice: 200,
    yearlyPrice: 1608,
    tokenPricing: {
      pricePerToken: {
        monthly: 0.2,
        yearly: 0.134,
      },
      componentCost: 5,
      generationCost: 1,
    },
  },
  pro_custom_4: {
    generationsPerMonth: 1250,
    displayName: "Scale 1250",
    name: "Scale 1250",
    description: "For large projects",
    features: ["1250 credits per month", "Everything from Pro Plus"],
    monthlyPrice: 250,
    yearlyPrice: 2010,
    tokenPricing: {
      pricePerToken: {
        monthly: 0.2,
        yearly: 0.134,
      },
      componentCost: 5,
      generationCost: 1,
    },
  },
  pro_custom_5: {
    generationsPerMonth: 1500,
    displayName: "Scale 1500",
    name: "Scale 1500",
    description: "For large projects",
    features: ["1500 credits per month", "Everything from Pro Plus"],
    monthlyPrice: 300,
    yearlyPrice: 2412,
    tokenPricing: {
      pricePerToken: {
        monthly: 0.2,
        yearly: 0.134,
      },
      componentCost: 5,
      generationCost: 1,
    },
  },
}

// Move Plan interface and COMPARISON_PLANS here, after PLAN_LIMITS
export interface Plan {
  name: string
  type: PlanType
  price: PlanPrice
  tokenPrice: {
    monthly: number
    yearly: number
  }
  tokens: number
  buttonText: string
  buttonHref?: string
  disabled?: boolean
  popular?: boolean
}

export const COMPARISON_PLANS: Plan[] = [
  {
    name: PLAN_LIMITS.free.displayName,
    type: "free",
    price: {
      monthly: 0,
      yearly: 0,
    },
    tokenPrice: PLAN_LIMITS.free.tokenPricing.pricePerToken,
    tokens: PLAN_LIMITS.free.generationsPerMonth,
    buttonText: "Current Plan",
    disabled: true,
  },
  {
    name: PLAN_LIMITS.pro.displayName,
    type: "pro",
    price: {
      monthly: PLAN_LIMITS.pro.monthlyPrice || 20,
      yearly: PLAN_LIMITS.pro.yearlyPrice || 192,
    },
    tokenPrice: PLAN_LIMITS.pro.tokenPricing.pricePerToken,
    tokens: PLAN_LIMITS.pro.generationsPerMonth,
    popular: true,
    buttonText: "Upgrade to Pro",
    buttonHref: "/upgrade",
  },
  {
    name: PLAN_LIMITS.pro_plus.displayName,
    type: "pro_plus",
    price: {
      monthly: PLAN_LIMITS.pro_plus.monthlyPrice || 40,
      yearly: PLAN_LIMITS.pro_plus.yearlyPrice || 384,
    },
    tokenPrice: PLAN_LIMITS.pro_plus.tokenPricing.pricePerToken,
    tokens: PLAN_LIMITS.pro_plus.generationsPerMonth,
    buttonText: "Upgrade to Pro Plus",
    buttonHref: "/pro_plus/create",
  },
]

export interface ComparisonFeature {
  name: string
  section: string
  values: Record<
    PlanType,
    | string
    | {
        monthly: string
        yearly: string
      }
  >
}

// Comparison features configuration for the comparison table
export const COMPARISON_FEATURES: ComparisonFeature[] = [
  {
    name: "Monthly Credits",
    section: "Usage",
    values: {
      free: `${FREE_USAGE_LIMIT} free credits`,
      pro: "400 credits",
      pro_plus: "200 credits",
      pro_custom_1: "2000 credits",
      pro_custom_2: "750 credits",
      pro_custom_3: "1000 credits",
      pro_custom_4: "1250 credits",
      pro_custom_5: "1500 credits",
    },
  },
  {
    name: "Magic Chat",
    section: "Magic",
    values: {
      free: "Usage-based pricing",
      pro: "400 monthly credits",
      pro_plus: "200 monthly credits",
      pro_custom_1: "2000 monthly credits",
      pro_custom_2: "750 monthly credits",
      pro_custom_3: "1000 monthly credits",
      pro_custom_4: "1250 monthly credits",
      pro_custom_5: "1500 monthly credits",
    },
  },
  {
    name: "Magic MCP",
    section: "Magic",
    values: {
      free: "Usage-based pricing",
      pro: "400 monthly credits",
      pro_plus: "200 monthly credits",
      pro_custom_1: "2000 monthly credits",
      pro_custom_2: "750 monthly credits",
      pro_custom_3: "1000 monthly credits",
      pro_custom_4: "1250 monthly credits",
      pro_custom_5: "1500 monthly credits",
    },
  },
  {
    name: "UI Inspirations",
    section: "Magic",
    values: {
      free: "Unlimited",
      pro: "Unlimited",
      pro_plus: "Unlimited",
      pro_custom_1: "Unlimited",
      pro_custom_2: "Unlimited",
      pro_custom_3: "Unlimited",
      pro_custom_4: "Unlimited",
      pro_custom_5: "Unlimited",
    },
  },
  {
    name: "SVG Logo Search",
    section: "Magic",
    values: {
      free: "Unlimited",
      pro: "Unlimited",
      pro_plus: "Unlimited",
      pro_custom_1: "Unlimited",
      pro_custom_2: "Unlimited",
      pro_custom_3: "Unlimited",
      pro_custom_4: "Unlimited",
      pro_custom_5: "Unlimited",
    },
  },
  {
    name: "Site clone",
    section: "Magic",
    values: {
      free: "-",
      pro: "check",
      pro_plus: "check",
      pro_custom_1: "check",
      pro_custom_2: "check",
      pro_custom_3: "check",
      pro_custom_4: "check",
      pro_custom_5: "check",
    },
  },
  {
    name: "Support Type",
    section: "Support",
    values: {
      free: "Community",
      pro: "Discord and Email",
      pro_plus: "Priority",
      pro_custom_1: "Priority",
      pro_custom_2: "Priority",
      pro_custom_3: "Priority",
      pro_custom_4: "Priority",
      pro_custom_5: "Priority",
    },
  },
]

// Core features configuration that will be used in pricing table
export const PLAN_FEATURES: PlanFeature[] = [
  // Resource Allocation
  {
    name: "Monthly Credits",
    included: "free",
    category: "Resources",
    valueByPlan: {
      free: `${FREE_USAGE_LIMIT} free credits`,
      pro: "400 credits",
      pro_plus: "200 credits",
      pro_custom_1: "2000 credits",
      pro_custom_2: "750 credits",
      pro_custom_3: "1000 credits",
      pro_custom_4: "1250 credits",
      pro_custom_5: "1500 credits",
    },
  },

  // Credit Usage
  {
    name: "Magic MCP",
    included: "free",
    category: "Resources",
    valueByPlan: {
      free: "Pay per use",
      pro: "Credits included",
      pro_plus: "Credits included",
      pro_custom_1: "Credits included",
      pro_custom_2: "Credits included",
      pro_custom_3: "Credits included",
      pro_custom_4: "Credits included",
      pro_custom_5: "Credits included",
    },
  },
  {
    name: "Magic Chat",
    included: "free",
    category: "Resources",
    valueByPlan: {
      free: "Pay per use",
      pro: "Credits included",
      pro_plus: "Credits included",
      pro_custom_1: "Credits included",
      pro_custom_2: "Credits included",
      pro_custom_3: "Credits included",
      pro_custom_4: "Credits included",
      pro_custom_5: "Credits included",
    },
  },

  // Unlimited Features
  {
    name: "UI Inspiration Library",
    included: "free",
    category: "Unlimited Features",
    valueByPlan: {
      free: "Unlimited",
      pro: "Unlimited",
      pro_plus: "Unlimited",
      pro_custom_1: "Unlimited",
      pro_custom_2: "Unlimited",
      pro_custom_3: "Unlimited",
      pro_custom_4: "Unlimited",
      pro_custom_5: "Unlimited",
    },
  },
  {
    name: "SVG Logo Search",
    included: "free",
    category: "Unlimited Features",
    valueByPlan: {
      free: "Unlimited",
      pro: "Unlimited",
      pro_plus: "Unlimited",
      pro_custom_1: "Unlimited",
      pro_custom_2: "Unlimited",
      pro_custom_3: "Unlimited",
      pro_custom_4: "Unlimited",
      pro_custom_5: "Unlimited",
    },
  },

  // Support Options
  {
    name: "Support Level",
    included: "free",
    category: "Support",
    valueByPlan: {
      free: "Community",
      pro: "Discord and Email",
      pro_plus: "Priority",
      pro_custom_1: "Priority",
      pro_custom_2: "Priority",
      pro_custom_3: "Priority",
      pro_custom_4: "Priority",
      pro_custom_5: "Priority",
    },
  },
]

// Pricing plans configuration for the pricing table
export const PRICING_PLANS: PricingPlan[] = [
  {
    name: PLAN_LIMITS.free.displayName,
    level: "free",
    price: { monthly: 0, yearly: 0 },
  },
  {
    name: PLAN_LIMITS.pro.displayName,
    level: "pro",
    price: {
      monthly: PLAN_LIMITS.pro.monthlyPrice || 20,
      yearly: PLAN_LIMITS.pro.yearlyPrice || 192,
    },
    popular: true,
  },
  {
    name: PLAN_LIMITS.pro_plus.displayName,
    level: "pro_plus",
    price: {
      monthly: PLAN_LIMITS.pro_plus.monthlyPrice || 40,
      yearly: PLAN_LIMITS.pro_plus.yearlyPrice || 384,
    },
  },
]

/**
 * Helper functions
 */

export function getGenerationLimit(planType: PlanType): number {
  return (
    PLAN_LIMITS[planType]?.generationsPerMonth ||
    PLAN_LIMITS.free.generationsPerMonth
  )
}

export function getPlanInfo(planType: PlanType): PlanLimits {
  return PLAN_LIMITS[planType] || PLAN_LIMITS.free
}

export interface PricingCardPlan {
  name: string
  type: PlanType
  description: string
  monthlyPrice?: number
  yearlyPrice?: number
  features: string[]
  buttonText: string
  href: string
  isFeatured?: boolean
  price?: Record<string, number | string>
  cta?: string
  popular?: boolean
  highlighted?: boolean
}

export function getPricingCardPlans(options?: {
  standardButtonText?: string
  proButtonText?: string
  href?: string
  standardCheckoutLink?: string
  proCheckoutLink?: string
}): PricingCardPlan[] {
  const {
    standardButtonText = "Get started",
    proButtonText = "Get started",
    href = "#checkout",
    standardCheckoutLink,
    proCheckoutLink,
  } = options || {}

  return [
    {
      name: PLAN_LIMITS.pro.displayName,
      type: "pro",
      description: PLAN_LIMITS.pro.description,
      monthlyPrice: PLAN_LIMITS.pro.monthlyPrice,
      yearlyPrice: PLAN_LIMITS.pro.yearlyPrice,
      features: PLAN_LIMITS.pro.features,
      buttonText: standardButtonText,
      href: standardCheckoutLink || href,
      price: {
        monthly: PLAN_LIMITS.pro.monthlyPrice || 0,
        yearly: PLAN_LIMITS.pro.yearlyPrice || 0,
      },
      cta: standardButtonText,
    },
    {
      name: PLAN_LIMITS.pro_plus.displayName,
      type: "pro_plus",
      description: PLAN_LIMITS.pro_plus.description,
      monthlyPrice: PLAN_LIMITS.pro_plus.monthlyPrice,
      yearlyPrice: PLAN_LIMITS.pro_plus.yearlyPrice,
      features: PLAN_LIMITS.pro_plus.features,
      buttonText: proButtonText,
      href: proCheckoutLink || href,
      isFeatured: true,
      price: {
        monthly: PLAN_LIMITS.pro_plus.monthlyPrice || 0,
        yearly: PLAN_LIMITS.pro_plus.yearlyPrice || 0,
      },
      cta: proButtonText,
      popular: true,
    },
  ]
}

export function getTokenPrice(
  planType: PlanType,
  billingPeriod: "monthly" | "yearly" = "monthly",
): number {
  return (
    PLAN_LIMITS[planType]?.tokenPricing?.pricePerToken[billingPeriod] ||
    PLAN_LIMITS.pro.tokenPricing.pricePerToken[billingPeriod]
  )
}

export function getComponentCost(planType: PlanType): number {
  return (
    PLAN_LIMITS[planType]?.tokenPricing?.componentCost ||
    PLAN_LIMITS.pro.tokenPricing!.componentCost
  )
}

export function getGenerationCost(planType: PlanType): number {
  return (
    PLAN_LIMITS[planType]?.tokenPricing?.generationCost ||
    PLAN_LIMITS.pro.tokenPricing!.generationCost
  )
}
