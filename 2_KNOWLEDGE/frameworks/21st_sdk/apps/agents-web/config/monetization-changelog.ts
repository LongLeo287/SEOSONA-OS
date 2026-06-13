import { CreditCard, Calendar, DollarSign, Zap, Globe } from "lucide-react"

export interface MonetizationChangelogItem {
  id: number
  date: Date
  title: string
  description: string
  icon: any
  type: "major" | "feature" | "fix"
}

/**
 * Monetization changelog
 * Key milestones in our journey to fairly compensate component creators
 */
export const monetizationChangelog: MonetizationChangelogItem[] = [
  {
    id: 1,
    date: new Date("2025-08-01"),
    title: "Migration to Deel for Partner Payouts",
    description:
      "We're transferring all partners to Deel for payouts, as they support the largest number of countries where our partners are located. Unfortunately, Stripe didn't work for us as it doesn't yet support India and several other countries.",
    icon: Globe,
    type: "major" as const,
  },
  {
    id: 2,
    date: new Date("2025-07-01"),
    title: "Credit-Based Monetization System Launch",
    description:
      "With the launch of generation iteration capabilities on July 1st, we moved to a new credit-based monetization system instead of per-generation payments. We've temporarily returned to view-based payouts while we determine which system works better for us.",
    icon: CreditCard,
    type: "major" as const,
  },
  {
    id: 3,
    date: new Date("2025-06-01"),
    title: "Payout Model Update",
    description:
      "We transitioned to a new payout model, sharing half of our net revenue with component authors whose work inspired Magic generations.",
    icon: DollarSign,
    type: "major" as const,
  },
  {
    id: 4,
    date: new Date("2025-05-29"),
    title: "Magic 2.0 Announcement",
    description:
      "Announced Magic 2.0 which works in Web and also generates revenue for component authors.",
    icon: Zap,
    type: "feature" as const,
  },
  {
    id: 5,
    date: new Date("2025-05-01"),
    title: "Payout Rollout Begins",
    description:
      "Started rolling out payouts, initially based on component views since Magic MCP usage was still limited.",
    icon: DollarSign,
    type: "feature" as const,
  },
  {
    id: 6,
    date: new Date("2025-02-28"),
    title: "Magic with Monetization Launch",
    description:
      "Launched Magic 1.0 via MCP Server with monetization features, enabling component authors to earn revenue from their contributions.",
    icon: Calendar,
    type: "major" as const,
  },
]
