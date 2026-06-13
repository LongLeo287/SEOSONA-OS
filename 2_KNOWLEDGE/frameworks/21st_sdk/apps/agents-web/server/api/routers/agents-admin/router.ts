import { z } from "zod"
import { createTRPCRouter, adminProcedure } from "@/server/api/trpc"
import { TRPCError } from "@trpc/server"
import { Prisma } from "@/prisma/client"
import Metronome from "@metronome/sdk"
import {
  resolveCurrentPlanStatus,
  resolveMetronomeCustomerId,
  type BillingWindowSize,
  type PlanStatus,
} from "@/lib/agents-billing/metronome-analytics"
import {
  BILLING_FREE_CREDIT_AMOUNT,
  BILLING_MONTHLY_COMMIT_AMOUNT,
  COMPUTE_USAGE_COST_PER_SECOND_USD,
} from "@/lib/agents-billing/constants"
import {
  NORMALIZED_CATEGORIES,
  TOOL_CATEGORIES,
} from "@/app/agents/internal/admin/directory/_constants"
import {
  addDays,
  addHours,
  format,
  isBefore,
  startOfDay,
  startOfHour,
} from "date-fns"

/** Emails of team owners whose agents should be excluded from admin dashboards */
const EXCLUDED_ADMIN_EMAILS = [
  "davidik0313@gmail.com",
  "david@21st.dev",
  "lianapepanyann@gmail.com",
]

const METRONOME_BEARER_TOKEN = process.env.METRONOME_BEARER_TOKEN?.trim()

function parseDateOrThrow(value: string, field: string) {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Invalid date for ${field}: ${value}`,
    })
  }
  return parsed
}

function billingResolveRange(input: { from?: string; to?: string }) {
  const endingBefore = input.to ? parseDateOrThrow(input.to, "to") : new Date()
  const startingOn = input.from
    ? parseDateOrThrow(input.from, "from")
    : new Date(endingBefore.getTime() - 30 * 24 * 60 * 60 * 1000)

  if (!(startingOn < endingBefore)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "from must be before to",
    })
  }
  return { startingOn, endingBefore }
}

function billingGetBucketStart(date: Date, windowSize: BillingWindowSize) {
  return windowSize === "HOUR" ? startOfHour(date) : startOfDay(date)
}

function billingGetBucketKey(date: Date, windowSize: BillingWindowSize) {
  return billingGetBucketStart(date, windowSize).toISOString()
}

function billingFormatBucket(date: Date, windowSize: BillingWindowSize) {
  return windowSize === "HOUR"
    ? format(billingGetBucketStart(date, windowSize), "HH:mm")
    : format(billingGetBucketStart(date, windowSize), "MMM dd")
}

function billingGenerateBuckets(
  start: Date,
  end: Date,
  windowSize: BillingWindowSize,
) {
  const buckets: Array<{ key: string; date: string; bucketStart: string }> = []
  const initial = billingGetBucketStart(start, windowSize)
  const step = windowSize === "HOUR" ? addHours : addDays
  let cursor = initial

  while (isBefore(cursor, end)) {
    buckets.push({
      key: cursor.toISOString(),
      date: billingFormatBucket(cursor, windowSize),
      bucketStart: cursor.toISOString(),
    })
    cursor = step(cursor, 1)
  }
  return buckets
}

async function billingMapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  mapper: (item: T, index: number) => Promise<R>,
) {
  if (!items.length) return [] as R[]
  const safeLimit = Math.max(1, Math.min(limit, items.length))
  const results = new Array<R>(items.length)
  let cursor = 0

  const workers = new Array(safeLimit).fill(0).map(async () => {
    while (true) {
      const index = cursor
      cursor += 1
      if (index >= items.length) break
      results[index] = await mapper(items[index]!, index)
    }
  })
  await Promise.all(workers)
  return results
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`Timeout: ${label} exceeded ${ms}ms`)),
      ms,
    )
    promise.then(
      (val) => { clearTimeout(timer); resolve(val) },
      (err) => { clearTimeout(timer); reject(err) },
    )
  })
}

type Period = "24h" | "7d" | "30d" | "all"

const getPeriodStartDate = (period: Period): Date | null => {
  if (period === "all") return null
  const now = new Date()
  switch (period) {
    case "24h":
      return new Date(now.getTime() - 24 * 60 * 60 * 1000)
    case "7d":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    case "30d":
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  }
}

// Filters for analytics queries
const analyticsFiltersSchema = z
  .object({
    role: z.string().optional(),
    companySize: z.string().optional(),
    industry: z.string().optional(),
    codingAgent: z.string().optional(),
    referral: z.string().optional(),
    platform: z.string().optional(),
  })
  .optional()

export const agentsAdminRouter = createTRPCRouter({
  // Get onboarding statistics - breakdown by survey answers
  getOnboardingStats: adminProcedure
    .input(analyticsFiltersSchema)
    .query(async ({ ctx, input }) => {
      const filters = input || {}

      // Build where clause for filters
      const where: Prisma.UserWhereInput = {
        onboarding_completed_at: { not: null },
        ...(filters.role && { what_describes_you_best: filters.role }),
        ...(filters.companySize && { company_size: filters.companySize }),
        ...(filters.industry && { onboarding_industry: filters.industry }),
        ...(filters.codingAgent && { primary_coding_agent: filters.codingAgent }),
        ...(filters.referral && { onboarding_referral: filters.referral }),
        ...(filters.platform && { onboarding_platform: filters.platform }),
      }

      // Total users who completed onboarding
      const totalUsers = await ctx.prisma.user.count({
        where,
      })

      // Get breakdown by role
      const roleBreakdown = await ctx.prisma.user.groupBy({
        by: ["what_describes_you_best"],
        where,
        _count: true,
      })

      // Get breakdown by company size
      const companySizeBreakdown = await ctx.prisma.user.groupBy({
        by: ["company_size"],
        where,
        _count: true,
      })

      // Get breakdown by industry
      const industryBreakdown = await ctx.prisma.user.groupBy({
        by: ["onboarding_industry"],
        where,
        _count: true,
      })

      // Get breakdown by coding agent
      const codingAgentBreakdown = await ctx.prisma.user.groupBy({
        by: ["primary_coding_agent"],
        where,
        _count: true,
      })

      // Get breakdown by referral source
      const referralBreakdown = await ctx.prisma.user.groupBy({
        by: ["onboarding_referral"],
        where,
        _count: true,
      })

      // Get breakdown by platform (web vs desktop)
      const platformBreakdown = await ctx.prisma.user.groupBy({
        by: ["onboarding_platform"],
        where,
        _count: true,
      })

      return {
        totalUsers,
        roleBreakdown: roleBreakdown.map((r) => ({
          value: r.what_describes_you_best || "unknown",
          count: r._count,
        })),
        companySizeBreakdown: companySizeBreakdown.map((r) => ({
          value: r.company_size || "unknown",
          count: r._count,
        })),
        industryBreakdown: industryBreakdown.map((r) => ({
          value: r.onboarding_industry || "unknown",
          count: r._count,
        })),
        codingAgentBreakdown: codingAgentBreakdown.map((r) => ({
          value: r.primary_coding_agent || "unknown",
          count: r._count,
        })),
        referralBreakdown: referralBreakdown.map((r) => ({
          value: r.onboarding_referral || "unknown",
          count: r._count,
        })),
        platformBreakdown: platformBreakdown.map((r) => ({
          value: r.onboarding_platform || "unknown",
          count: r._count,
        })),
      }
    }),

  // Get daily active users over time
  getDailyActiveUsers: adminProcedure
    .input(
      z.object({
        days: z.number().min(7).max(90).default(30),
        filters: analyticsFiltersSchema,
      }),
    )
    .query(async ({ ctx, input }) => {
      const { days, filters = {} } = input
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)
      startDate.setHours(0, 0, 0, 0)

      // Get all users who completed onboarding (with filters)
      const userWhere: Prisma.UserWhereInput = {
        onboarding_completed_at: { not: null },
        ...(filters.role && { what_describes_you_best: filters.role }),
        ...(filters.companySize && { company_size: filters.companySize }),
        ...(filters.industry && { onboarding_industry: filters.industry }),
        ...(filters.codingAgent && { primary_coding_agent: filters.codingAgent }),
        ...(filters.referral && { onboarding_referral: filters.referral }),
        ...(filters.platform && { onboarding_platform: filters.platform }),
      }

      const users = await ctx.prisma.user.findMany({
        where: userWhere,
        select: { id: true },
      })

      const userIds = users.map((u) => u.id)

      if (userIds.length === 0) {
        return { dailyData: [] }
      }

      // Get all sub chats in the date range for these users
      const subChats = await ctx.prisma.agentSubChat.findMany({
        where: {
          chat: {
            user_id: { in: userIds },
          },
          created_at: { gte: startDate },
        },
        select: {
          created_at: true,
          chat: {
            select: { user_id: true },
          },
        },
      })

      // Group by day
      const dailyMap = new Map<
        string,
        { uniqueUsers: Set<string>; subChatCount: number }
      >()

      for (let i = 0; i < days; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateKey = date.toISOString().split("T")[0]!
        dailyMap.set(dateKey, { uniqueUsers: new Set(), subChatCount: 0 })
      }

      for (const subChat of subChats) {
        const dateKey = subChat.created_at.toISOString().split("T")[0]!
        const dayData = dailyMap.get(dateKey)
        if (dayData) {
          dayData.uniqueUsers.add(subChat.chat.user_id)
          dayData.subChatCount++
        }
      }

      const dailyData = Array.from(dailyMap.entries())
        .map(([date, data]) => ({
          date,
          dau: data.uniqueUsers.size,
          subChats: data.subChatCount,
        }))
        .sort((a, b) => a.date.localeCompare(b.date))

      return { dailyData }
    }),

  // Get retention cohorts by week
  getRetentionCohorts: adminProcedure
    .input(
      z.object({
        weeks: z.number().min(4).max(12).default(8),
        filters: analyticsFiltersSchema,
      }),
    )
    .query(async ({ ctx, input }) => {
      const { weeks, filters = {} } = input

      // Build user filter
      const userWhere: Prisma.UserWhereInput = {
        onboarding_completed_at: { not: null },
        ...(filters.role && { what_describes_you_best: filters.role }),
        ...(filters.companySize && { company_size: filters.companySize }),
        ...(filters.industry && { onboarding_industry: filters.industry }),
        ...(filters.codingAgent && { primary_coding_agent: filters.codingAgent }),
        ...(filters.referral && { onboarding_referral: filters.referral }),
        ...(filters.platform && { onboarding_platform: filters.platform }),
      }

      // Get all users with their onboarding date
      const users = await ctx.prisma.user.findMany({
        where: userWhere,
        select: {
          id: true,
          onboarding_completed_at: true,
        },
      })

      if (users.length === 0) {
        return { cohorts: [] }
      }

      const userIds = users.map((u) => u.id)

      // Get all sub chats for these users
      const subChats = await ctx.prisma.agentSubChat.findMany({
        where: {
          chat: {
            user_id: { in: userIds },
          },
        },
        select: {
          created_at: true,
          chat: {
            select: { user_id: true },
          },
        },
      })

      // Group sub chats by user and date
      const userActivityDates = new Map<string, Set<string>>()
      for (const subChat of subChats) {
        const userId = subChat.chat.user_id
        const dateKey = subChat.created_at.toISOString().split("T")[0]!
        if (!userActivityDates.has(userId)) {
          userActivityDates.set(userId, new Set())
        }
        userActivityDates.get(userId)!.add(dateKey)
      }

      // Helper to get Monday of a week
      const getWeekStart = (date: Date): string => {
        const d = new Date(date)
        const day = d.getDay()
        const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust for Sunday
        d.setDate(diff)
        d.setHours(0, 0, 0, 0)
        return d.toISOString().split("T")[0]!
      }

      // Group users by cohort week
      const cohortMap = new Map<
        string,
        { users: Array<{ id: string; onboardingDate: Date }> }
      >()

      for (const user of users) {
        if (!user.onboarding_completed_at) continue
        const weekStart = getWeekStart(user.onboarding_completed_at)
        if (!cohortMap.has(weekStart)) {
          cohortMap.set(weekStart, { users: [] })
        }
        cohortMap.get(weekStart)!.users.push({
          id: user.id,
          onboardingDate: user.onboarding_completed_at,
        })
      }

      // Calculate retention for each cohort
      const cohorts = []
      const sortedWeeks = Array.from(cohortMap.keys())
        .sort()
        .slice(-weeks)

      for (const weekStart of sortedWeeks) {
        const cohort = cohortMap.get(weekStart)!
        const cohortUsers = cohort.users
        const cohortSize = cohortUsers.length

        if (cohortSize === 0) continue

        // Calculate D1, D7, D14, D30 retention
        const retentionDays = [1, 7, 14, 30]
        const retention: Record<string, number> = {}

        for (const days of retentionDays) {
          let activeCount = 0

          for (const user of cohortUsers) {
            const targetDate = new Date(user.onboardingDate)
            targetDate.setDate(targetDate.getDate() + days)
            const targetDateKey = targetDate.toISOString().split("T")[0]!

            // Check if user was active on that day
            const activityDates = userActivityDates.get(user.id)
            if (activityDates && activityDates.has(targetDateKey)) {
              activeCount++
            }
          }

          retention[`d${days}`] = Math.round((activeCount / cohortSize) * 100)
        }

        cohorts.push({
          weekStart,
          cohortSize,
          d1: retention.d1 || 0,
          d7: retention.d7 || 0,
          d14: retention.d14 || 0,
          d30: retention.d30 || 0,
        })
      }

      return { cohorts: cohorts.reverse() } // Most recent first
    }),

  // Get filter options (unique values for each field)
  getFilterOptions: adminProcedure.query(async ({ ctx }) => {
    const [roles, companySizes, industries, codingAgents, referrals, platforms] =
      await Promise.all([
        ctx.prisma.user.findMany({
          where: {
            what_describes_you_best: { not: null },
            onboarding_completed_at: { not: null },
          },
          select: { what_describes_you_best: true },
          distinct: ["what_describes_you_best"],
        }),
        ctx.prisma.user.findMany({
          where: {
            company_size: { not: null },
            onboarding_completed_at: { not: null },
          },
          select: { company_size: true },
          distinct: ["company_size"],
        }),
        ctx.prisma.user.findMany({
          where: {
            onboarding_industry: { not: null },
            onboarding_completed_at: { not: null },
          },
          select: { onboarding_industry: true },
          distinct: ["onboarding_industry"],
        }),
        ctx.prisma.user.findMany({
          where: {
            primary_coding_agent: { not: null },
            onboarding_completed_at: { not: null },
          },
          select: { primary_coding_agent: true },
          distinct: ["primary_coding_agent"],
        }),
        ctx.prisma.user.findMany({
          where: {
            onboarding_referral: { not: null },
            onboarding_completed_at: { not: null },
          },
          select: { onboarding_referral: true },
          distinct: ["onboarding_referral"],
        }),
        ctx.prisma.user.findMany({
          where: {
            onboarding_platform: { not: null },
            onboarding_completed_at: { not: null },
          },
          select: { onboarding_platform: true },
          distinct: ["onboarding_platform"],
        }),
      ])

    return {
      roles: roles
        .map((r) => r.what_describes_you_best)
        .filter((v): v is string => !!v),
      companySizes: companySizes
        .map((r) => r.company_size)
        .filter((v): v is string => !!v),
      industries: industries
        .map((r) => r.onboarding_industry)
        .filter((v): v is string => !!v),
      codingAgents: codingAgents
        .map((r) => r.primary_coding_agent)
        .filter((v): v is string => !!v),
      referrals: referrals
        .map((r) => r.onboarding_referral)
        .filter((v): v is string => !!v),
      platforms: platforms
        .map((r) => r.onboarding_platform)
        .filter((v): v is string => !!v),
    }
  }),

  // Get top agent users by chat count
  getAgentTopUsers: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        period: z.enum(["24h", "7d", "30d", "all"]).default("all"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, period } = input
      const startDate = getPeriodStartDate(period)

      // Get users with agent chat counts
      const usersWithChats = await ctx.prisma.agentChat.groupBy({
        by: ["user_id"],
        where: {
          deleted_at: null,
          ...(startDate && { created_at: { gte: startDate } }),
        },
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: "desc",
          },
        },
        take: limit,
      })

      if (usersWithChats.length === 0) {
        return []
      }

      const userIds = usersWithChats.map((u) => u.user_id)

      const users = await ctx.prisma.user.findMany({
        where: {
          id: { in: userIds },
          is_admin: false,
          email: { notIn: EXCLUDED_ADMIN_EMAILS },
        },
        select: {
          id: true,
          email: true,
          name: true,
          display_name: true,
          username: true,
          display_username: true,
          image_url: true,
          display_image_url: true,
          created_at: true,
        },
      })

      // Get sub chat counts per user - use a simpler approach to avoid ambiguous column
      const chatsWithSubChatCounts = await ctx.prisma.agentChat.findMany({
        where: {
          user_id: { in: userIds },
          deleted_at: null,
          ...(startDate && { created_at: { gte: startDate } }),
        },
        select: {
          user_id: true,
          _count: {
            select: {
              subChats: {
                where: { deleted_at: null },
              },
            },
          },
        },
      })

      const userSubChatCounts = new Map<string, number>()
      for (const chat of chatsWithSubChatCounts) {
        userSubChatCounts.set(
          chat.user_id,
          (userSubChatCounts.get(chat.user_id) || 0) + chat._count.subChats,
        )
      }

      // Get last activity per user — use distinct to avoid loading all sub-chats
      const lastActivityPerUser = await ctx.prisma.agentSubChat.findMany({
        where: {
          deleted_at: null,
          chat: {
            user_id: { in: userIds },
            deleted_at: null,
          },
        },
        select: {
          created_at: true,
          chat: {
            select: { user_id: true },
          },
        },
        orderBy: {
          created_at: "desc",
        },
        take: userIds.length * 2,
      })

      const userLastActivity = new Map<string, Date>()
      for (const activity of lastActivityPerUser) {
        const userId = activity.chat.user_id
        if (!userLastActivity.has(userId)) {
          userLastActivity.set(userId, activity.created_at)
        }
      }

      // Build result
      const chatCountMap = new Map(
        usersWithChats.map((u) => [u.user_id, u._count.id]),
      )
      const userMap = new Map(users.map((u) => [u.id, u]))

      return usersWithChats
        .map((uc) => {
          const user = userMap.get(uc.user_id)
          if (!user) return null
          return {
            ...user,
            chatsCount: chatCountMap.get(uc.user_id) || 0,
            subChatsCount: userSubChatCounts.get(uc.user_id) || 0,
            lastActive: userLastActivity.get(uc.user_id) || null,
          }
        })
        .filter((u): u is NonNullable<typeof u> => u !== null)
    }),

  // Get detailed user info with all their chats
  getAgentUserDetails: adminProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { userId } = input

      // Get user info
      const user = await ctx.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          display_name: true,
          username: true,
          display_username: true,
          image_url: true,
          display_image_url: true,
          created_at: true,
          bio: true,
          github_url: true,
          twitter_url: true,
          website_url: true,
        },
      })

      if (!user) {
        return null
      }

      // Get all agent chats with sub chats
      const chats = await ctx.prisma.agentChat.findMany({
        where: {
          user_id: userId,
          deleted_at: null,
        },
        include: {
          subChats: {
            where: {
              deleted_at: null,
            },
            orderBy: {
              created_at: "asc",
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
      })

      // Calculate stats
      const stats = {
        totalChats: chats.length,
        totalSubChats: chats.reduce((sum, c) => sum + c.subChats.length, 0),
        archivedChats: chats.filter((c) => c.archived_at !== null).length,
      }

      return {
        user,
        stats,
        chats: chats.map((chat) => ({
          id: chat.id,
          name: chat.name,
          sandboxId: chat.sandbox_id,
          meta: chat.meta as Record<string, unknown> | null,
          createdAt: chat.created_at,
          archivedAt: chat.archived_at,
          subChats: chat.subChats.map((sc) => ({
            id: sc.id,
            name: sc.name,
            mode: sc.mode,
            messages: sc.messages as unknown[],
            createdAt: sc.created_at,
          })),
        })),
      }
    }),

  // Get user activity calendar for agents
  getAgentUserActivityCalendar: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        days: z.number().min(1).max(365).default(180),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { userId, days } = input
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)
      startDate.setHours(0, 0, 0, 0)

      // Get daily chat creations
      const chats = await ctx.prisma.agentChat.findMany({
        where: {
          user_id: userId,
          deleted_at: null,
          created_at: { gte: startDate },
        },
        select: {
          created_at: true,
        },
      })

      // Get daily sub chat activity
      const subChats = await ctx.prisma.agentSubChat.findMany({
        where: {
          deleted_at: null,
          chat: {
            user_id: userId,
            deleted_at: null,
          },
          created_at: { gte: startDate },
        },
        select: {
          created_at: true,
          mode: true,
        },
      })

      // Build daily map
      const dailyMap = new Map<
        string,
        { chats: number; subChats: number; planMode: number; agentMode: number }
      >()

      for (let i = 0; i < days; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateKey = date.toISOString().split("T")[0]!
        dailyMap.set(dateKey, { chats: 0, subChats: 0, planMode: 0, agentMode: 0 })
      }

      for (const chat of chats) {
        const dateKey = chat.created_at.toISOString().split("T")[0]!
        const dayData = dailyMap.get(dateKey)
        if (dayData) {
          dayData.chats++
        }
      }

      for (const subChat of subChats) {
        const dateKey = subChat.created_at.toISOString().split("T")[0]!
        const dayData = dailyMap.get(dateKey)
        if (dayData) {
          dayData.subChats++
          if (subChat.mode === "plan") {
            dayData.planMode++
          } else {
            dayData.agentMode++
          }
        }
      }

      return Array.from(dailyMap.entries())
        .map(([date, data]) => ({
          date,
          ...data,
        }))
        .sort((a, b) => a.date.localeCompare(b.date))
    }),

  // ─── Admin: All Agents (cross-team) ─────────────────────────────

  getConfigAdmin: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const config = await ctx.prisma.anAgentConfig.findUnique({
        where: { id: input.id },
        include: {
          team: {
            select: {
              id: true,
              name: true,
              user: {
                select: { id: true, email: true, name: true, is_admin: true },
              },
            },
          },
          activeDeployment: {
            select: {
              id: true,
              version: true,
              bundle_hash: true,
              bundle_url: true,
              deployed_at: true,
              metadata: true,
              status: true,
              error: true,
              completed_at: true,
            },
          },
        },
      })
      if (!config) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Agent config not found" })
      }
      return config
    }),

  getAllTimeStats: adminProcedure.query(async ({ ctx }) => {
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

    const adminFilter = {
      team: {
        user: {
          is_admin: false,
          email: { notIn: EXCLUDED_ADMIN_EMAILS },
        },
      },
    } satisfies Prisma.AnAgentConfigWhereInput

    const threadAdminFilter: Prisma.AnThreadWhereInput = {
      sandbox: {
        agent: {
          team: {
            user: {
              is_admin: false,
              email: { notIn: EXCLUDED_ADMIN_EMAILS },
            },
          },
        },
      },
    }

    const [
      totalAgents,
      agentsLast7d,
      agentsPrev7d,
      tokenStats,
      tokensLast7d,
      tokensPrev7d,
    ] = await Promise.all([
      ctx.prisma.anAgentConfig.count({ where: adminFilter }),
      ctx.prisma.anAgentConfig.count({
        where: { ...adminFilter, created_at: { gte: sevenDaysAgo } },
      }),
      ctx.prisma.anAgentConfig.count({
        where: {
          ...adminFilter,
          created_at: { gte: fourteenDaysAgo, lt: sevenDaysAgo },
        },
      }),
      ctx.prisma.anThread.aggregate({
        where: threadAdminFilter,
        _sum: { total_tokens: true },
      }),
      ctx.prisma.anThread.aggregate({
        where: {
          ...threadAdminFilter,
          created_at: { gte: sevenDaysAgo },
        },
        _sum: { total_tokens: true },
      }),
      ctx.prisma.anThread.aggregate({
        where: {
          ...threadAdminFilter,
          created_at: { gte: fourteenDaysAgo, lt: sevenDaysAgo },
        },
        _sum: { total_tokens: true },
      }),
    ])

    const totalTokens = tokenStats._sum?.total_tokens ?? 0
    const tokensThisWeek = tokensLast7d._sum?.total_tokens ?? 0
    const tokensPrevWeek = tokensPrev7d._sum?.total_tokens ?? 0

    return {
      totalAgents,
      agentsLast7d,
      agentsPrev7d,
      agentsGrowthPct:
        agentsPrev7d > 0
          ? ((agentsLast7d - agentsPrev7d) / agentsPrev7d) * 100
          : null,
      totalTokens,
      tokensLast7d: tokensThisWeek,
      tokensPrev7d: tokensPrevWeek,
      tokensGrowthPct:
        tokensPrevWeek > 0
          ? ((tokensThisWeek - tokensPrevWeek) / tokensPrevWeek) * 100
          : null,
    }
  }),

  listAllConfigs: adminProcedure.query(async ({ ctx }) => {
    return ctx.prisma.anAgentConfig.findMany({
      where: {
        team: {
          user: {
            is_admin: false,
            email: { notIn: EXCLUDED_ADMIN_EMAILS },
          },
        },
      },
      orderBy: { created_at: "desc" },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            user: {
              select: {
                id: true,
                email: true,
                name: true,
                is_admin: true,
              },
            },
          },
        },
        activeDeployment: {
          select: {
            id: true,
            version: true,
            bundle_hash: true,
            bundle_url: true,
            deployed_at: true,
            metadata: true,
            status: true,
            error: true,
            completed_at: true,
          },
        },
        _count: {
          select: {
            sandboxes: true,
          },
        },
      },
    })
  }),

  getAgentUsageStats: adminProcedure.query(async ({ ctx }) => {
    const excludedEmails = EXCLUDED_ADMIN_EMAILS
    const rows: Array<{
      agent_id: string
      thread_count: bigint
      sandbox_count: bigint
      total_tokens: string | null
      total_cost_usd: string | null
      last_activity: Date | null
    }> = await ctx.prisma.$queryRaw`
      SELECT
        s.agent_id,
        COUNT(DISTINCT t.id)                    AS thread_count,
        COUNT(DISTINCT s.id)                    AS sandbox_count,
        COALESCE(SUM(t.total_tokens), 0)::text  AS total_tokens,
        COALESCE(SUM(t.total_cost_usd), 0)::text AS total_cost_usd,
        MAX(t.created_at)                       AS last_activity
      FROM an_sandboxes s
      JOIN an_agent_configs a ON a.id = s.agent_id
      JOIN teams tm ON tm.id = a.team_id
      JOIN users u ON u.id = tm.user_id
      LEFT JOIN an_threads t ON t.sandbox_id = s.id
      WHERE u.is_admin = false
        AND u.email != ALL(${excludedEmails})
      GROUP BY s.agent_id
    `

    const stats: Record<
      string,
      {
        threadCount: number
        sandboxCount: number
        totalTokens: number
        totalCostUsd: number
        lastActivity: string | null
      }
    > = {}

    for (const row of rows) {
      stats[row.agent_id] = {
        threadCount: Number(row.thread_count ?? 0),
        sandboxCount: Number(row.sandbox_count ?? 0),
        totalTokens: Number(row.total_tokens ?? "0"),
        totalCostUsd: parseFloat(row.total_cost_usd ?? "0"),
        lastActivity: row.last_activity?.toISOString() ?? null,
      }
    }

    return stats
  }),

  getSandboxAdmin: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const sandbox = await ctx.prisma.anSandbox.findUnique({
        where: { id: input.id },
        include: {
          agent: { select: { id: true, name: true, slug: true, team_id: true } },
          threads: { orderBy: { created_at: "asc" } },
        },
      })
      if (!sandbox) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Sandbox not found" })
      }
      return sandbox
    }),

  listAllSandboxes: adminProcedure
    .input(
      z.object({
        agentId: z.string().uuid().optional(),
        excludeAdminTeams: z.boolean().optional(),
        createdAfter: z.string().datetime().optional(),
        createdBefore: z.string().datetime().optional(),
        limit: z.number().int().min(1).max(200).default(100),
        cursor: z.string().uuid().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where: Prisma.AnSandboxWhereInput = {}
      if (input.agentId) where.agent_id = input.agentId
      if (input.excludeAdminTeams) {
        where.agent = {
          ...((where.agent as any) ?? {}),
          team: {
            user: {
              is_admin: false,
              email: { notIn: EXCLUDED_ADMIN_EMAILS },
            },
          },
        }
      }
      if (input.createdAfter || input.createdBefore) {
        where.created_at = {
          ...(input.createdAfter && { gte: new Date(input.createdAfter) }),
          ...(input.createdBefore && { lte: new Date(input.createdBefore) }),
        }
      }

      const sandboxes = await ctx.prisma.anSandbox.findMany({
        where,
        orderBy: { created_at: "desc" },
        take: input.limit + 1,
        ...(input.cursor && {
          cursor: { id: input.cursor },
          skip: 1,
        }),
        include: {
          agent: {
            select: {
              id: true,
              name: true,
              slug: true,
              team_id: true,
              team: {
                select: {
                  name: true,
                  user: { select: { is_admin: true, email: true, name: true } },
                },
              },
            },
          },
          threads: {
            select: {
              id: true,
              status: true,
              input_tokens: true,
              output_tokens: true,
              total_tokens: true,
              total_cost_usd: true,
              duration_ms: true,
              created_at: true,
              completed_at: true,
              error: true,
            },
            orderBy: { created_at: "desc" },
          },
        },
      })

      const hasMore = sandboxes.length > input.limit
      if (hasMore) sandboxes.pop()

      return {
        sandboxes,
        nextCursor: hasMore ? sandboxes[sandboxes.length - 1]?.id : undefined,
      }
    }),

  getMetronomeBillingStats: adminProcedure
    .input(
      z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        granularity: z.enum(["HOUR", "DAY"]).default("DAY"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const PROCEDURE_TIMEOUT_MS = 55_000
      const PER_CALL_TIMEOUT = 6_000
      const USAGE_BATCH_TIMEOUT = 30_000
      const PLAN_CONCURRENCY = 20
      const USAGE_BATCH_CONCURRENCY = 10
      const USAGE_BATCH_SIZE = 500
      const MAX_CUSTOMERS = 5000

      const t0 = Date.now()
      const aborted = { value: false }
      const log = (step: string, extra?: string) =>
        console.log(`[BillingStats] ${step} +${Date.now() - t0}ms${extra ? ` | ${extra}` : ""}`)

      const elapsed = () => Date.now() - t0
      const checkBudget = (label: string) => {
        if (elapsed() > PROCEDURE_TIMEOUT_MS) {
          aborted.value = true
          throw new Error(`Procedure timeout at ${label} (+${elapsed()}ms)`)
        }
      }

      log("START", `from=${input.from} to=${input.to} granularity=${input.granularity}`)

      const FREE_CREDIT_USD = BILLING_FREE_CREDIT_AMOUNT / 100
      const PRO_MONTHLY_COMMIT_USD = BILLING_MONTHLY_COMMIT_AMOUNT / 100

      type BillingResult = {
        kpis: {
          totalCustomers: number
          proCustomers: number
          freeCustomers: number
          unknownCustomers: number
          conversionRate: number
          mrr: number
          totalRevenue: number
          arpu: number
          totalSpend: number
          proSpend: number
          freeSpend: number
          tokenSpend: number
          computeSpend: number
          avgSpendPerPro: number
          avgSpendPerFree: number
          freeAtCreditLimit: number
          proInOverage: number
          totalCreditGranted: number
          totalCreditUsed: number
          creditUtilization: number
        }
        timeSeries: Array<{
          key: string
          date: string
          bucketStart: string
          tokenSpend: number
          computeSpend: number
          totalSpend: number
        }>
        topSpenders: Array<{
          teamId: string
          teamName: string
          ownerEmail: string | null
          planStatus: PlanStatus
          tokenSpend: number
          computeSpend: number
          totalSpend: number
          creditLimit: number
          creditUsedPct: number
          atLimit: boolean
        }>
        creditLimitUsers: Array<{
          teamId: string
          teamName: string
          ownerEmail: string | null
          planStatus: PlanStatus
          totalSpend: number
          creditLimit: number
        }>
        proSubscribers: Array<{
          teamId: string
          teamName: string
          ownerEmail: string | null
          startedAt: string | null
          totalSpend: number
        }>
        warnings: string[]
      }

      const emptyResult = (warnings: string[]): BillingResult => ({
        kpis: {
          totalCustomers: 0, proCustomers: 0, freeCustomers: 0, unknownCustomers: 0,
          conversionRate: 0, mrr: 0, totalRevenue: 0, arpu: 0, totalSpend: 0,
          proSpend: 0, freeSpend: 0, tokenSpend: 0, computeSpend: 0,
          avgSpendPerPro: 0, avgSpendPerFree: 0,
          freeAtCreditLimit: 0, proInOverage: 0,
          totalCreditGranted: 0, totalCreditUsed: 0, creditUtilization: 0,
        },
        timeSeries: [],
        topSpenders: [],
        creditLimitUsers: [],
        proSubscribers: [],
        warnings,
      })

      const buildResult = (): BillingResult => {
        let proCount = 0, freeCount = 0, unknownCount = 0
        let proSpend = 0, freeSpend = 0
        let totalTokenSpend = 0, totalComputeSpend = 0
        let freeAtCreditLimit = 0, proInOverage = 0

        const creditLimitUsers: BillingResult["creditLimitUsers"] = []
        const spenders: BillingResult["topSpenders"] = []
        const proSubscribers: BillingResult["proSubscribers"] = []

        for (const customerId of allCustomerIds) {
          const planData = planByCustomerId.get(customerId)
          const plan = planData?.status ?? "unknown"
          const tokenCost = tokenCostByCustomer.get(customerId) ?? 0
          const computeRaw = computeRawByCustomer.get(customerId) ?? 0
          const computeCost = computeRaw * COMPUTE_USAGE_COST_PER_SECOND_USD
          const totalCost = tokenCost + computeCost

          totalTokenSpend += tokenCost
          totalComputeSpend += computeCost

          const teamId = customerToTeamId.get(customerId)
          const info = teamId ? teamInfoMap.get(teamId) : undefined

          if (plan === "pro") {
            proCount++
            proSpend += totalCost
            if (totalCost >= PRO_MONTHLY_COMMIT_USD) proInOverage++
            if (teamId) {
              proSubscribers.push({
                teamId, teamName: info?.teamName ?? teamId,
                ownerEmail: info?.ownerEmail ?? null,
                startedAt: planData?.startingAt ?? null,
                totalSpend: totalCost,
              })
            }
          } else if (plan === "free") {
            freeCount++
            freeSpend += totalCost
            if (totalCost >= FREE_CREDIT_USD * 0.9) {
              freeAtCreditLimit++
              if (teamId) {
                creditLimitUsers.push({
                  teamId, teamName: info?.teamName ?? teamId,
                  ownerEmail: info?.ownerEmail ?? null, planStatus: plan,
                  totalSpend: totalCost, creditLimit: FREE_CREDIT_USD,
                })
              }
            }
          } else {
            unknownCount++
          }

          if (totalCost > 0 && teamId) {
            const creditLimit = plan === "pro" ? PRO_MONTHLY_COMMIT_USD : plan === "free" ? FREE_CREDIT_USD : 0
            const creditUsedPct = creditLimit > 0 ? (totalCost / creditLimit) * 100 : 0
            spenders.push({
              teamId, teamName: info?.teamName ?? teamId,
              ownerEmail: info?.ownerEmail ?? null, planStatus: plan,
              tokenSpend: tokenCost, computeSpend: computeCost, totalSpend: totalCost,
              creditLimit, creditUsedPct,
              atLimit: creditLimit > 0 && totalCost >= creditLimit * 0.9,
            })
          }
        }

        const totalCustomers = allCustomerIds.length
        const totalSpend = totalTokenSpend + totalComputeSpend
        const mrr = proCount * PRO_MONTHLY_COMMIT_USD
        const knownCustomers = proCount + freeCount
        const totalCreditGranted = proCount * PRO_MONTHLY_COMMIT_USD + freeCount * FREE_CREDIT_USD

        spenders.sort((a, b) => b.totalSpend - a.totalSpend)
        creditLimitUsers.sort((a, b) => b.totalSpend - a.totalSpend)
        proSubscribers.sort((a, b) => {
          const da = a.startedAt ? new Date(a.startedAt).getTime() : 0
          const db = b.startedAt ? new Date(b.startedAt).getTime() : 0
          return db - da
        })

        const buckets = billingGenerateBuckets(startingOn, endingBefore, input.granularity)
        const timeSeries = buckets.map((bucket) => {
          const tc = tokenCostByBucket.get(bucket.key) ?? 0
          const cc = computeCostByBucket.get(bucket.key) ?? 0
          return { key: bucket.key, date: bucket.date, bucketStart: bucket.bucketStart, tokenSpend: tc, computeSpend: cc, totalSpend: tc + cc }
        })

        log("DONE", `total=${totalCustomers} pro=${proCount} free=${freeCount} unknown=${unknownCount} totalSpend=$${totalSpend.toFixed(2)} freeAtLimit=${freeAtCreditLimit} proOverage=${proInOverage}`)

        return {
          kpis: {
            totalCustomers, proCustomers: proCount, freeCustomers: freeCount,
            unknownCustomers: unknownCount,
            conversionRate: knownCustomers > 0 ? (proCount / knownCustomers) * 100 : 0,
            mrr, totalRevenue: totalSpend,
            arpu: totalCustomers > 0 ? totalSpend / totalCustomers : 0,
            totalSpend, proSpend, freeSpend,
            tokenSpend: totalTokenSpend, computeSpend: totalComputeSpend,
            avgSpendPerPro: proCount > 0 ? proSpend / proCount : 0,
            avgSpendPerFree: freeCount > 0 ? freeSpend / freeCount : 0,
            freeAtCreditLimit, proInOverage, totalCreditGranted,
            totalCreditUsed: totalSpend,
            creditUtilization: totalCreditGranted > 0 ? (totalSpend / totalCreditGranted) * 100 : 0,
          },
          timeSeries,
          topSpenders: spenders.slice(0, 15),
          creditLimitUsers,
          proSubscribers,
          warnings,
        }
      }

      const { startingOn, endingBefore } = billingResolveRange({
        from: input.from,
        to: input.to,
      })

      const warnings: string[] = []
      const metronomeClient = METRONOME_BEARER_TOKEN
        ? new Metronome({ bearerToken: METRONOME_BEARER_TOKEN })
        : null

      if (!metronomeClient) {
        log("NO_TOKEN")
        warnings.push("METRONOME_BEARER_TOKEN is missing; billing data unavailable.")
        return emptyResult(warnings)
      }

      // ── Step 1: DB query (fast, isolated — no long holds on the pool) ──
      log("Step1: querying teams from DB (excluding admins)")
      let teamsRaw: Array<{
        team_id: string
        team_name: string
        owner_email: string | null
        team_stripe: unknown
      }>
      try {
        const excludedEmails = EXCLUDED_ADMIN_EMAILS.map(e => `'${e}'`).join(", ")
        teamsRaw = await withTimeout(
          ctx.prisma.$queryRawUnsafe<typeof teamsRaw>(`
            SELECT
              t.id AS team_id,
              t.name AS team_name,
              owner.email AS owner_email,
              t.stripe AS team_stripe
            FROM teams t
            LEFT JOIN users owner ON owner.id = t.user_id
            WHERE COALESCE(NULLIF(t.stripe->>'metronome_customer_id', ''), '') <> ''
              AND (owner.is_admin IS NOT TRUE)
              AND (owner.email IS NULL OR owner.email NOT IN (${excludedEmails}))
              AND EXISTS (SELECT 1 FROM an_agent_configs ag WHERE ag.team_id = t.id)
          `),
          10_000,
          "DB:teams",
        )
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error"
        log("Step1 FAILED", msg)
        warnings.push(`DB query failed: ${msg}`)
        return emptyResult(warnings)
      }
      // DB work is done — no more prisma calls below this point

      const teamToCustomerId = new Map<string, string>()
      const customerToTeamId = new Map<string, string>()
      const teamInfoMap = new Map<string, { teamName: string; ownerEmail: string | null }>()

      for (const row of teamsRaw) {
        teamInfoMap.set(row.team_id, { teamName: row.team_name, ownerEmail: row.owner_email })
        const stripeData =
          row.team_stripe && typeof row.team_stripe === "object" && !Array.isArray(row.team_stripe)
            ? (row.team_stripe as Record<string, unknown>)
            : undefined
        const cached =
          typeof stripeData?.metronome_customer_id === "string" && stripeData.metronome_customer_id.trim()
            ? stripeData.metronome_customer_id.trim()
            : undefined
        if (cached) {
          teamToCustomerId.set(row.team_id, cached)
          customerToTeamId.set(cached, row.team_id)
        }
      }

      let allCustomerIds = Array.from(new Set(teamToCustomerId.values()))
      if (allCustomerIds.length > MAX_CUSTOMERS) {
        warnings.push(`Capped from ${allCustomerIds.length} to ${MAX_CUSTOMERS} customers`)
        allCustomerIds = allCustomerIds.slice(0, MAX_CUSTOMERS)
      }
      log("Step1 done", `${teamsRaw.length} teams, ${allCustomerIds.length} unique customerIds`)

      if (allCustomerIds.length === 0) {
        log("NO_CUSTOMERS")
        warnings.push("No teams with Metronome customer IDs found.")
        return emptyResult(warnings)
      }

      // ── Step 2: Fetch usage data from Metronome (no DB needed) ──
      log("Step2: fetching usage data from Metronome")
      const tokenCostByCustomer = new Map<string, number>()
      const computeRawByCustomer = new Map<string, number>()
      const tokenCostByBucket = new Map<string, number>()
      const computeCostByBucket = new Map<string, number>()
      const customersWithUsage = new Set<string>()

      try {
        checkBudget("Step2:start")

        const metronomeStartingOn = new Date(
          Date.UTC(startingOn.getUTCFullYear(), startingOn.getUTCMonth(), startingOn.getUTCDate()),
        )
        let metronomeEndingBefore = new Date(
          Date.UTC(endingBefore.getUTCFullYear(), endingBefore.getUTCMonth(), endingBefore.getUTCDate()),
        )
        if (endingBefore > metronomeEndingBefore) {
          metronomeEndingBefore = addDays(metronomeEndingBefore, 1)
        }
        if (metronomeEndingBefore.getTime() - metronomeStartingOn.getTime() < 86_400_000) {
          metronomeEndingBefore = addDays(metronomeStartingOn, 1)
        }

        const batches: string[][] = []
        for (let i = 0; i < allCustomerIds.length; i += USAGE_BATCH_SIZE) {
          batches.push(allCustomerIds.slice(i, i + USAGE_BATCH_SIZE))
        }
        log("Step2: usage.list", `${batches.length} batches of ~${USAGE_BATCH_SIZE}`)

        let usageRowCount = 0

        const processBatch = async (batchIds: string[]) => {
          if (aborted.value) return
          for await (const row of metronomeClient.v1.usage.list({
            customer_ids: batchIds,
            starting_on: metronomeStartingOn.toISOString(),
            ending_before: metronomeEndingBefore.toISOString(),
            window_size: input.granularity,
          })) {
            if (aborted.value) break
            if (elapsed() > PROCEDURE_TIMEOUT_MS) { aborted.value = true; break }

            const rowDate = new Date(row.start_timestamp)
            if (Number.isNaN(rowDate.getTime())) continue
            if (rowDate < startingOn || rowDate >= endingBefore) continue

            usageRowCount++
            const value = typeof row.value === "number" ? row.value : 0
            const bucketKey = billingGetBucketKey(rowDate, input.granularity)
            const customerId = row.customer_id
            customersWithUsage.add(customerId)

            if (row.billable_metric_name === "claude_total_cost") {
              tokenCostByCustomer.set(customerId, (tokenCostByCustomer.get(customerId) ?? 0) + value)
              tokenCostByBucket.set(bucketKey, (tokenCostByBucket.get(bucketKey) ?? 0) + value)
            } else if (row.billable_metric_name === "compute_usage") {
              computeRawByCustomer.set(customerId, (computeRawByCustomer.get(customerId) ?? 0) + value)
              computeCostByBucket.set(bucketKey, (computeCostByBucket.get(bucketKey) ?? 0) + value * COMPUTE_USAGE_COST_PER_SECOND_USD)
            }
          }
        }

        await billingMapWithConcurrency(batches, USAGE_BATCH_CONCURRENCY, async (batch) => {
          if (aborted.value) return
          try {
            await withTimeout(processBatch(batch), USAGE_BATCH_TIMEOUT, `usage.batch(${batch.length})`)
          } catch {
            warnings.push(`Usage batch timed out for ${batch.length} customers`)
          }
        })
        log("Step2 done", `${usageRowCount} usage rows, ${customersWithUsage.size} customers with usage`)
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error"
        log("Step2 FAILED", msg)
        warnings.push(`Failed to fetch usage data: ${msg}`)
        if (aborted.value) {
          warnings.push("Procedure timed out — returning partial data")
          return buildResult()
        }
      }

      // ── Step 3: Resolve plan status for customers with usage only ──
      const customersToResolve = Array.from(customersWithUsage)
      log("Step3: resolving plan status", `${customersToResolve.length} customers, concurrency=${PLAN_CONCURRENCY}`)
      const planByCustomerId = new Map<string, { status: PlanStatus; startingAt: string | null }>()

      try {
        checkBudget("Step3:start")
        await billingMapWithConcurrency(customersToResolve, PLAN_CONCURRENCY, async (customerId) => {
          if (aborted.value) return
          if (elapsed() > PROCEDURE_TIMEOUT_MS) { aborted.value = true; return }
          try {
            const plan = await withTimeout(
              resolveCurrentPlanStatus({ client: metronomeClient, customerId }),
              PER_CALL_TIMEOUT,
              `planStatus(${customerId.slice(0, 8)})`,
            )
            planByCustomerId.set(customerId, { status: plan.planStatus, startingAt: plan.startingAt ?? null })
          } catch {
            planByCustomerId.set(customerId, { status: "unknown", startingAt: null })
          }
        })
        log("Step3 done", `pro=${[...planByCustomerId.values()].filter(v => v.status === "pro").length} free=${[...planByCustomerId.values()].filter(v => v.status === "free").length}`)
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error"
        log("Step3 FAILED", msg)
        warnings.push(`Plan resolution failed: ${msg}`)
      }

      if (aborted.value) {
        warnings.push("Procedure timed out — returning partial data")
      }

      return buildResult()
    }),

  classifyAgent: adminProcedure
    .input(
      z.object({
        agentId: z.string().uuid(),
        bundleHash: z.string(),
        systemPrompt: z.string().optional(),
        tools: z
          .array(z.object({ name: z.string(), description: z.string() }))
          .optional(),
        model: z.string().optional(),
        hooks: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { fulfillModel } = await import("@/lib/server/ai/index")
      const { generateText } = await import("ai")

      const parts: string[] = []
      if (input.model) parts.push(`Model: ${input.model}`)
      if (input.systemPrompt) {
        const truncated =
          input.systemPrompt.length > 2000
            ? input.systemPrompt.slice(0, 2000) + "..."
            : input.systemPrompt
        parts.push(`System prompt: ${truncated}`)
      }
      if (input.tools?.length) {
        parts.push(
          `Tools: ${input.tools.map((t) => `${t.name} - ${t.description}`).join("; ")}`,
        )
      }
      if (input.hooks?.length) {
        parts.push(`Hooks: ${input.hooks.join(", ")}`)
      }

      const agentDescription = parts.join("\n")

      const prompt = `You are classifying an AI agent based on its configuration. Return a JSON object with these fields:
- "category": MUST be one of: ${NORMALIZED_CATEGORIES.join(", ")}
- "subcategory": free-form specific label describing what this agent actually does (e.g. "SEO Audit Bot", "Belgian Insurance Comparator", "React Component Builder", "Hive Email Drafter", "SACCO Lending Copilot"). Be descriptive and specific — this is the detailed identifier.
- "summary": one sentence (max 150 chars) describing what this agent does
- "toolCategories": array from: ${TOOL_CATEGORIES.join(", ")}. Classify each tool by its name/description. Empty array if no tools.
- "toolClassifications": array of objects for each tool: [{"name":"tool_name","category":"one of the tool categories above","purpose":"what this tool does in 5-10 words"}]. Empty array if no tools.

Rules:
- ALWAYS respond in English regardless of the language of the system prompt or tool descriptions
- If no meaningful system prompt AND no custom tools (or only "Add two numbers" demo tool), category = "Unconfigured"
- If code-related preset but no custom tools, category = "Code Assistant"
- subcategory should be unique and descriptive — not just repeat the category

Agent configuration:
${agentDescription || "No configuration available"}

Respond ONLY with valid JSON, no markdown fences.`

      const fallback = {
        category: "Unconfigured" as string,
        subcategory: "Unknown",
        summary: "Classification failed",
        toolCategories: [] as string[],
        toolClassifications: [] as Array<{ name: string; category: string; purpose: string }>,
      }

      try {
        const response = await generateText({
          ...fulfillModel("gpt-5-nano", false),
          prompt,
          temperature: 0.1,
        })

        const text = response.text.trim()
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (!jsonMatch) return fallback

        const parsed = JSON.parse(jsonMatch[0]) as {
          category?: string
          subcategory?: string
          summary?: string
          toolCategories?: string[]
          toolClassifications?: Array<{ name?: string; category?: string; purpose?: string }>
        }

        const category = NORMALIZED_CATEGORIES.includes(parsed.category as any)
          ? parsed.category!
          : "Industry-Specific"

        const result = {
          category,
          subcategory:
            typeof parsed.subcategory === "string"
              ? parsed.subcategory.slice(0, 60)
              : category,
          summary:
            typeof parsed.summary === "string"
              ? parsed.summary.slice(0, 200)
              : "No description available",
          toolCategories: Array.isArray(parsed.toolCategories)
            ? parsed.toolCategories.filter(
                (t): t is string =>
                  typeof t === "string" &&
                  (TOOL_CATEGORIES as readonly string[]).includes(t),
              )
            : [],
          toolClassifications: Array.isArray(parsed.toolClassifications)
            ? parsed.toolClassifications
                .filter(
                  (t): t is { name: string; category: string; purpose: string } =>
                    typeof t?.name === "string" &&
                    typeof t?.category === "string" &&
                    typeof t?.purpose === "string",
                )
                .map((t) => ({
                  name: t.name.slice(0, 60),
                  category: (TOOL_CATEGORIES as readonly string[]).includes(t.category)
                    ? t.category
                    : "custom",
                  purpose: t.purpose.slice(0, 100),
                }))
            : [],
        }

        // Persist to DB
        try {
          await ctx.prisma.anAgentClassification.upsert({
            where: {
              agent_id_bundle_hash: {
                agent_id: input.agentId,
                bundle_hash: input.bundleHash,
              },
            },
            create: {
              agent_id: input.agentId,
              bundle_hash: input.bundleHash,
              category: result.category,
              subcategory: result.subcategory,
              summary: result.summary,
              tool_categories: result.toolCategories,
              tool_classifications: result.toolClassifications as any,
            },
            update: {
              category: result.category,
              subcategory: result.subcategory,
              summary: result.summary,
              tool_categories: result.toolCategories,
              tool_classifications: result.toolClassifications as any,
              classified_at: new Date(),
            },
          })
        } catch (dbError) {
          console.error("Failed to persist classification:", dbError)
          // Non-fatal — still return the result
        }

        return result
      } catch (error) {
        console.error("Failed to classify agent:", error)
        return fallback
      }
    }),

  getClassifications: adminProcedure
    .input(
      z.object({
        agentBundleHashes: z.array(
          z.object({
            agentId: z.string().uuid(),
            bundleHash: z.string(),
          }),
        ),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (input.agentBundleHashes.length === 0) return {}

      const rows = await ctx.prisma.anAgentClassification.findMany({
        where: {
          OR: input.agentBundleHashes.map((h) => ({
            agent_id: h.agentId,
            bundle_hash: h.bundleHash,
          })),
        },
      })

      const result: Record<
        string,
        {
          category: string
          subcategory: string
          summary: string
          toolCategories: string[]
          toolClassifications: Array<{ name: string; category: string; purpose: string }>
          classifiedAt: number
        }
      > = {}

      for (const row of rows) {
        result[row.agent_id] = {
          category: row.category,
          subcategory: row.subcategory,
          summary: row.summary,
          toolCategories: row.tool_categories,
          toolClassifications: row.tool_classifications as Array<{
            name: string
            category: string
            purpose: string
          }>,
          classifiedAt: row.classified_at.getTime(),
        }
      }

      return result
    }),

  deleteClassification: adminProcedure
    .input(
      z.object({
        agentId: z.string().uuid(),
        bundleHash: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.anAgentClassification.deleteMany({
        where: {
          agent_id: input.agentId,
          bundle_hash: input.bundleHash,
        },
      })
      return { success: true }
    }),

  deleteAllClassifications: adminProcedure
    .mutation(async ({ ctx }) => {
      await ctx.prisma.anAgentClassification.deleteMany({})
      return { success: true }
    }),
})
