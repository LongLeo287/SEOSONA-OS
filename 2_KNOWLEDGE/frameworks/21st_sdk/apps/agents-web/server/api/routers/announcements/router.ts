import { UserRole } from "@/prisma/client"
import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure
} from "@/server/api/trpc"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

// Schema for announcement messages
const announcementMessageSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
  sort_order: z.number().default(0),
})

// Helper to validate URL (allows both absolute URLs and relative paths)
const urlOrPathSchema = z
  .string()
  .refine(
    (val) => {
      if (!val) return true
      // Allow relative paths starting with /
      if (val.startsWith("/")) return true
      // Allow absolute URLs
      try {
        new URL(val)
        return true
      } catch {
        return false
      }
    },
    { message: "Must be a valid URL or relative path starting with /" },
  )
  .nullish()

// Schema for creating/updating campaigns
const campaignInputSchema = z.object({
  exp_id: z.string().uuid().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
  priority: z.number().default(0),
  banner_image_url: urlOrPathSchema,
  banner_image_url_dark: urlOrPathSchema,
  cta_url: urlOrPathSchema,
  target_pages: z.array(z.string()).default([]),
  target_roles: z.array(z.string()).default([]),
  target_plans: z.array(z.string()).default([]),
  starts_at: z.date().nullish(),
  ends_at: z.date().nullish(),
  messages: z.array(announcementMessageSchema).optional(),
})

export const announcementsRouter = createTRPCRouter({
  // ==================== PUBLIC ENDPOINTS ====================

  /**
   * List all active campaigns for current user (no page filtering)
   * Used by the frontend to cache campaigns globally.
   */
  listActiveCampaigns: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.userId

    // Get user data for targeting (if logged in)
    let userRole: string | null = null
    let userPlan: string | null = null

    if (userId) {
      const user = await ctx.prisma.user.findUnique({
        where: { id: userId },
        select: {
          role: true,
          plansInfo: {
            select: {
              plan: {
                select: { type: true },
              },
            },
          },
        },
      })

      userRole = user?.role || null
      userPlan = user?.plansInfo?.plan?.type || "free"
    }

    const now = new Date()

    const campaigns = await ctx.prisma.announcementCampaign.findMany({
      where: {
        is_active: true,
        OR: [{ starts_at: null }, { starts_at: { lte: now } }],
        AND: [{ OR: [{ ends_at: null }, { ends_at: { gte: now } }] }],
      },
      include: {
        messages: {
          orderBy: { sort_order: "asc" },
        },
      },
      orderBy: [{ priority: "desc" }, { created_at: "desc" }],
    })

    const filtered = campaigns.filter((campaign) => {
      // Check role targeting (only if user has a role)
      if (campaign.target_roles.length > 0) {
        if (!userRole || !campaign.target_roles.includes(userRole)) {
          return false
        }
      }

      // Check plan targeting
      if (campaign.target_plans.length > 0) {
        const effectivePlan = userPlan || "free"
        if (!campaign.target_plans.includes(effectivePlan)) {
          return false
        }
      }

      return true
    })

    return filtered.map((campaign) => ({
      id: campaign.id,
      exp_id: campaign.exp_id,
      name: campaign.name,
      description: campaign.description,
      is_active: campaign.is_active,
      priority: campaign.priority,
      banner_image_url: campaign.banner_image_url,
      banner_image_url_dark: campaign.banner_image_url_dark,
      cta_url: campaign.cta_url,
      target_pages: campaign.target_pages,
      target_roles: campaign.target_roles,
      target_plans: campaign.target_plans,
      starts_at: campaign.starts_at,
      ends_at: campaign.ends_at,
      created_at: campaign.created_at,
      updated_at: campaign.updated_at,
      messages: campaign.messages.map((m) => ({
        id: m.id,
        icon: m.icon,
        title: m.title,
        description: m.description,
        sort_order: m.sort_order,
      })),
    }))
  }),

  /**
   * Get active campaign for current user based on targeting rules
   * This is the main endpoint used by the frontend to display announcements
   */
  getActiveCampaign: publicProcedure
    .input(
      z.object({
        page_source: z.string(), // e.g., "magic-chat", "community", "canvas"
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.auth.userId

      // Get user data for targeting (if logged in)
      let userRole: string | null = null
      let userPlan: string | null = null

      if (userId) {
        const user = await ctx.prisma.user.findUnique({
          where: { id: userId },
          select: {
            role: true,
            plansInfo: {
              select: {
                plan: {
                  select: { type: true },
                },
              },
            },
          },
        })

        userRole = user?.role || null
        userPlan = user?.plansInfo?.plan?.type || "free"
      }

      const now = new Date()

      // Find matching campaigns with targeting
      const campaigns = await ctx.prisma.announcementCampaign.findMany({
        where: {
          is_active: true,
          OR: [{ starts_at: null }, { starts_at: { lte: now } }],
          AND: [
            { OR: [{ ends_at: null }, { ends_at: { gte: now } }] },
          ],
        },
        include: {
          messages: {
            orderBy: { sort_order: "asc" },
          },
        },
        orderBy: { priority: "desc" },
      })

      // Filter by targeting rules
      const matchingCampaign = campaigns.find((campaign) => {
        // Check page targeting
        // "all" matches any page, empty array also matches any page
        if (campaign.target_pages.length > 0) {
          const matchesPage =
            campaign.target_pages.includes("all") ||
            campaign.target_pages.includes(input.page_source)
          if (!matchesPage) {
            return false
          }
        }

        // Check role targeting (only if user has a role)
        if (campaign.target_roles.length > 0) {
          if (!userRole || !campaign.target_roles.includes(userRole)) {
            return false
          }
        }

        // Check plan targeting
        if (campaign.target_plans.length > 0) {
          const effectivePlan = userPlan || "free"
          if (!campaign.target_plans.includes(effectivePlan)) {
            return false
          }
        }

        return true
      })

      if (!matchingCampaign) {
        return null
      }

      return {
        id: matchingCampaign.id,
        name: matchingCampaign.name,
        description: matchingCampaign.description,
        banner_image_url: matchingCampaign.banner_image_url,
        banner_image_url_dark: matchingCampaign.banner_image_url_dark,
        cta_url: matchingCampaign.cta_url,
        messages: matchingCampaign.messages.map((m) => ({
          id: m.id,
          icon: m.icon,
          title: m.title,
          description: m.description,
        })),
      }
    }),

  /**
   * Track an announcement event (shown, clicked, closed, etc.)
   * Includes deduplication for "shown" events to prevent spam
   */
  trackEvent: publicProcedure
    .input(
      z.object({
        campaign_id: z.string().uuid(),
        event_type: z.enum([
          "shown",
          "clicked_lets_go",
          "clicked_remind_later",
          "closed",
        ]),
        page_source: z.string().optional(),
        metadata: z.record(z.any()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Use actual user_id if logged in, otherwise use session_id from metadata
      const userId = ctx.auth.userId || input.metadata?.session_id || null

      // Deduplicate "shown" events - check if already recorded in last 5 minutes
      if (input.event_type === "shown" && userId) {
        const fiveMinutesAgo = new Date()
        fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5)

        const existingShown = await ctx.prisma.announcementEvent.findFirst({
          where: {
            campaign_id: input.campaign_id,
            event_type: "shown",
            user_id: userId,
            created_at: { gte: fiveMinutesAgo },
          },
        })

        if (existingShown) {
          // Already tracked recently, skip
          return { success: true, deduplicated: true }
        }
      }

      await ctx.prisma.announcementEvent.create({
        data: {
          user_id: userId,
          campaign_id: input.campaign_id,
          event_type: input.event_type,
          page_source: input.page_source,
          metadata: input.metadata || {},
        },
      })

      return { success: true }
    }),

  // ==================== ADMIN ENDPOINTS ====================

  /**
   * Get all campaigns (admin only)
   */
  listCampaigns: adminProcedure
    .input(
      z.object({
        include_inactive: z.boolean().default(false),
      }),
    )
    .query(async ({ ctx, input }) => {
      const campaigns = await ctx.prisma.announcementCampaign.findMany({
        where: input.include_inactive ? {} : { is_active: true },
        include: {
          messages: {
            orderBy: { sort_order: "asc" },
          },
          _count: {
            select: { events: true },
          },
        },
        orderBy: [{ priority: "desc" }, { created_at: "desc" }],
      })

      return campaigns.map((c) => ({
        ...c,
        events_count: c._count.events,
      }))
    }),

  /**
   * Get a single campaign by ID (admin only)
   */
  getCampaign: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const campaign = await ctx.prisma.announcementCampaign.findUnique({
        where: { id: input.id },
        include: {
          messages: {
            orderBy: { sort_order: "asc" },
          },
        },
      })

      if (!campaign) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Campaign not found",
        })
      }

      return campaign
    }),

  /**
   * Create a new campaign (admin only)
   */
  createCampaign: adminProcedure
    .input(campaignInputSchema)
    .mutation(async ({ ctx, input }) => {
      const { messages, ...campaignData } = input

      const campaign = await ctx.prisma.announcementCampaign.create({
        data: {
          ...campaignData,
          messages: messages
            ? {
                create: messages.map((m, index) => ({
                  ...m,
                  sort_order: m.sort_order ?? index,
                })),
              }
            : undefined,
        },
        include: {
          messages: {
            orderBy: { sort_order: "asc" },
          },
        },
      })

      return campaign
    }),

  /**
   * Update an existing campaign (admin only)
   */
  updateCampaign: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: campaignInputSchema.partial(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { messages, ...campaignData } = input.data

      // Update campaign
      const campaign = await ctx.prisma.announcementCampaign.update({
        where: { id: input.id },
        data: campaignData,
      })

      // If messages are provided, replace all messages
      if (messages !== undefined) {
        // Delete existing messages
        await ctx.prisma.announcementMessage.deleteMany({
          where: { campaign_id: input.id },
        })

        // Create new messages
        if (messages.length > 0) {
          await ctx.prisma.announcementMessage.createMany({
            data: messages.map((m, index) => ({
              campaign_id: input.id,
              ...m,
              sort_order: m.sort_order ?? index,
            })),
          })
        }
      }

      return ctx.prisma.announcementCampaign.findUnique({
        where: { id: input.id },
        include: {
          messages: {
            orderBy: { sort_order: "asc" },
          },
        },
      })
    }),

  /**
   * Delete a campaign (admin only)
   */
  deleteCampaign: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.announcementCampaign.delete({
        where: { id: input.id },
      })

      return { success: true }
    }),

  /**
   * Toggle campaign active status (admin only)
   */
  toggleCampaignStatus: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const campaign = await ctx.prisma.announcementCampaign.findUnique({
        where: { id: input.id },
      })

      if (!campaign) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Campaign not found",
        })
      }

      return ctx.prisma.announcementCampaign.update({
        where: { id: input.id },
        data: { is_active: !campaign.is_active },
      })
    }),

  // ==================== ANALYTICS ENDPOINTS ====================

  /**
   * Get funnel analytics for a campaign (admin only)
   */
  getCampaignAnalytics: adminProcedure
    .input(
      z.object({
        campaign_id: z.string().uuid().optional(),
        start_date: z.date().optional(),
        end_date: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const whereClause: any = {}

      if (input.campaign_id) {
        whereClause.campaign_id = input.campaign_id
      }

      if (input.start_date || input.end_date) {
        whereClause.created_at = {}
        if (input.start_date) {
          whereClause.created_at.gte = input.start_date
        }
        if (input.end_date) {
          whereClause.created_at.lte = input.end_date
        }
      }

      // Get event counts by type
      const eventCounts = await ctx.prisma.announcementEvent.groupBy({
        by: ["event_type"],
        where: whereClause,
        _count: true,
      })

      // Get unique users by event type
      const uniqueUsersByEvent = await ctx.prisma.announcementEvent.groupBy({
        by: ["event_type"],
        where: {
          ...whereClause,
          user_id: { not: null },
        },
        _count: {
          user_id: true,
        },
      })

      // Get daily breakdown using Prisma ORM to avoid SQL injection
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const dailyEventsRaw = await ctx.prisma.announcementEvent.findMany({
        where: {
          ...whereClause,
          created_at: {
            gte: input.start_date || thirtyDaysAgo,
            ...(input.end_date && { lte: input.end_date }),
          },
        },
        select: {
          created_at: true,
          event_type: true,
        },
      })

      // Group by date and event_type manually
      const dailyEventsMap = new Map<string, number>()
      for (const event of dailyEventsRaw) {
        const dateKey = event.created_at.toISOString().split("T")[0]
        const key = `${dateKey}|${event.event_type}`
        dailyEventsMap.set(key, (dailyEventsMap.get(key) || 0) + 1)
      }

      // Convert to array format
      const dailyEvents = Array.from(dailyEventsMap.entries())
        .map(([key, count]) => {
          const [dateStr, event_type] = key.split("|")
          return {
            date: new Date(dateStr!),
            event_type: event_type!,
            count,
          }
        })
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 30)

      // Calculate conversion rates
      const shownCount =
        eventCounts.find((e) => e.event_type === "shown")?._count || 0
      const clickedCount =
        eventCounts.find((e) => e.event_type === "clicked_lets_go")?._count || 0
      const remindLaterCount =
        eventCounts.find((e) => e.event_type === "clicked_remind_later")
          ?._count || 0
      const closedCount =
        eventCounts.find((e) => e.event_type === "closed")?._count || 0

      const conversionRate =
        shownCount > 0 ? ((clickedCount / shownCount) * 100).toFixed(2) : "0.00"
      const remindLaterRate =
        shownCount > 0
          ? ((remindLaterCount / shownCount) * 100).toFixed(2)
          : "0.00"
      const dismissRate =
        shownCount > 0 ? ((closedCount / shownCount) * 100).toFixed(2) : "0.00"

      return {
        totals: {
          shown: shownCount,
          clicked_lets_go: clickedCount,
          clicked_remind_later: remindLaterCount,
          closed: closedCount,
        },
        rates: {
          conversion: parseFloat(conversionRate),
          remind_later: parseFloat(remindLaterRate),
          dismiss: parseFloat(dismissRate),
        },
        unique_users: Object.fromEntries(
          uniqueUsersByEvent.map((e) => [e.event_type, e._count.user_id]),
        ),
        daily: dailyEvents.map((d) => ({
          date: d.date,
          event_type: d.event_type,
          count: d.count,
        })),
      }
    }),

  /**
   * Get conversion funnel: shown -> clicked -> purchased (admin only)
   */
  getConversionFunnel: adminProcedure
    .input(
      z.object({
        campaign_id: z.string().uuid().optional(),
        start_date: z.date().optional(),
        end_date: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Get users who saw the announcement
      const shownUsers = await ctx.prisma.announcementEvent.findMany({
        where: {
          event_type: "shown",
          user_id: { not: null },
          ...(input.campaign_id && { campaign_id: input.campaign_id }),
          ...((input.start_date || input.end_date) && {
            created_at: {
              ...(input.start_date && { gte: input.start_date }),
              ...(input.end_date && { lte: input.end_date }),
            },
          }),
        },
        distinct: ["user_id"],
        select: { user_id: true, created_at: true },
      })

      const shownUserIds = shownUsers
        .map((u) => u.user_id)
        .filter(Boolean) as string[]

      if (shownUserIds.length === 0) {
        return {
          shown: 0,
          clicked: 0,
          created_project: 0,
          subscribed: 0,
          funnel_rates: {
            shown_to_clicked: 0,
            clicked_to_project: 0,
            project_to_subscribed: 0,
            overall_conversion: 0,
          },
        }
      }

      // Get users who clicked "Let's go" (within date range)
      const clickedUsers = await ctx.prisma.announcementEvent.findMany({
        where: {
          event_type: "clicked_lets_go",
          user_id: { in: shownUserIds },
          ...(input.campaign_id && { campaign_id: input.campaign_id }),
          ...((input.start_date || input.end_date) && {
            created_at: {
              ...(input.start_date && { gte: input.start_date }),
              ...(input.end_date && { lte: input.end_date }),
            },
          }),
        },
        distinct: ["user_id"],
        select: { user_id: true },
      })

      const clickedUserIds = clickedUsers
        .map((u) => u.user_id)
        .filter(Boolean) as string[]

      // Get users who created a canvas project after seeing the announcement (within date range)
      // Get earliest "shown" event for each user
      const userShownDates = await ctx.prisma.announcementEvent.groupBy({
        by: ["user_id"],
        where: {
          event_type: "shown",
          user_id: { in: shownUserIds },
          ...(input.campaign_id && { campaign_id: input.campaign_id }),
        },
        _min: { created_at: true },
      })

      // Create a map of user_id -> earliest shown date
      const userShownDateMap = new Map(
        userShownDates
          .filter((u) => u.user_id && u._min.created_at)
          .map((u) => [u.user_id!, u._min.created_at!]),
      )

      // Get projects created by these users after they saw the announcement
      const projects = await ctx.prisma.team.findMany({
        where: {
          user_id: { in: shownUserIds },
          ...((input.start_date || input.end_date) && {
            created_at: {
              ...(input.start_date && { gte: input.start_date }),
              ...(input.end_date && { lte: input.end_date }),
            },
          }),
        },
        select: { user_id: true, created_at: true },
      })

      // Filter to only include projects created after the user saw the announcement
      const projectUserIds = [
        ...new Set(
          projects
            .filter((p) => {
              if (!p.user_id) return false
              const shownDate = userShownDateMap.get(p.user_id)
              return shownDate && p.created_at >= shownDate
            })
            .map((p) => p.user_id),
        ),
      ]

      // Get users who subscribed after seeing the announcement (within date range)
      const subscribedUsers = await ctx.prisma.usersToPlan.findMany({
        where: {
          user_id: { in: shownUserIds },
          plan_id: { not: null },
          status: "active",
          ...((input.start_date || input.end_date) && {
            created_at: {
              ...(input.start_date && { gte: input.start_date }),
              ...(input.end_date && { lte: input.end_date }),
            },
          }),
        },
        select: { user_id: true },
      })

      const subscribedUserIds = subscribedUsers
        .map((u) => u.user_id)
        .filter(Boolean) as string[]

      const shownCount = shownUserIds.length
      const clickedCount = clickedUserIds.length
      const projectCount = projectUserIds.length
      const subscribedCount = subscribedUserIds.length

      return {
        shown: shownCount,
        clicked: clickedCount,
        created_project: projectCount,
        subscribed: subscribedCount,
        funnel_rates: {
          shown_to_clicked:
            shownCount > 0
              ? parseFloat(((clickedCount / shownCount) * 100).toFixed(2))
              : 0,
          clicked_to_project:
            clickedCount > 0
              ? parseFloat(((projectCount / clickedCount) * 100).toFixed(2))
              : 0,
          project_to_subscribed:
            projectCount > 0
              ? parseFloat(((subscribedCount / projectCount) * 100).toFixed(2))
              : 0,
          overall_conversion:
            shownCount > 0
              ? parseFloat(((subscribedCount / shownCount) * 100).toFixed(2))
              : 0,
        },
      }
    }),

  /**
   * Quick stats for campaigns (admin only)
   */
  getCampaignQuickStats: adminProcedure
    .input(
      z.object({
        campaign_ids: z.array(z.string().uuid()).optional(),
        start_date: z.date().optional(),
        end_date: z.date().optional(),
        plan_type: z.enum(["free", "paid"]).optional(),
        user_role: z.nativeEnum(UserRole).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const whereClause: any = {}

      if (input.campaign_ids && input.campaign_ids.length > 0) {
        whereClause.campaign_id = { in: input.campaign_ids }
      }

      if (input.start_date || input.end_date) {
        whereClause.created_at = {}
        if (input.start_date) {
          whereClause.created_at.gte = input.start_date
        }
        if (input.end_date) {
          whereClause.created_at.lte = input.end_date
        }
      }

      const uniqueEvents = await ctx.prisma.announcementEvent.findMany({
        where: {
          ...whereClause,
          user_id: { not: null },
        },
        distinct: ["campaign_id", "event_type", "user_id"],
        select: {
          campaign_id: true,
          event_type: true,
          user_id: true,
        },
      })

      let filteredEvents = uniqueEvents
      if (input.plan_type || input.user_role) {
        const userIds = Array.from(
          new Set(uniqueEvents.map((event) => event.user_id).filter(Boolean)),
        ) as string[]

        if (userIds.length > 0) {
          const users = await ctx.prisma.user.findMany({
            where: {
              id: { in: userIds },
              ...(input.user_role ? { role: input.user_role } : {}),
            },
            select: {
              id: true,
              plansInfo: {
                select: {
                  plan: {
                    select: { type: true },
                  },
                },
              },
            },
          })

          const knownUserIds = new Set(users.map((user) => user.id))
          const allowedUserIds = new Set(
            users
              .filter((user) => {
                if (!input.plan_type) return true
                const planType = user.plansInfo?.plan?.type || "free"
                return input.plan_type === "free"
                  ? planType === "free"
                  : planType !== "free"
              })
              .map((user) => user.id),
          )

          filteredEvents = uniqueEvents.filter((event) => {
            if (!event.user_id) return false
            if (allowedUserIds.has(event.user_id)) return true
            if (
              input.plan_type === "free" &&
              !input.user_role &&
              !knownUserIds.has(event.user_id)
            ) {
              return true
            }
            return false
          })
        } else {
          filteredEvents = []
        }
      }

      const byCampaign: Record<
        string,
        { shown: number; clicked_lets_go: number; ctr: number }
      > = {}

      for (const event of filteredEvents) {
        const entry =
          byCampaign[event.campaign_id] ??
          (byCampaign[event.campaign_id] = {
            shown: 0,
            clicked_lets_go: 0,
            ctr: 0,
          })

        if (event.event_type === "shown") {
          entry.shown += 1
        } else if (event.event_type === "clicked_lets_go") {
          entry.clicked_lets_go += 1
        }
      }

      if (input.campaign_ids) {
        for (const campaignId of input.campaign_ids) {
          byCampaign[campaignId] ??= {
            shown: 0,
            clicked_lets_go: 0,
            ctr: 0,
          }
        }
      }

      for (const entry of Object.values(byCampaign)) {
        entry.ctr =
          entry.shown > 0 ? (entry.clicked_lets_go / entry.shown) * 100 : 0
      }

      return { by_campaign: byCampaign }
    }),

  /**
   * Get all available icons for messages (admin only)
   */
  getAvailableIcons: adminProcedure.query(() => {
    // List of icons available in the canvas UI icons file
    return [
      { id: "AIResearchIcon", label: "AI Research" },
      { id: "MagicChatPlusIcon", label: "Magic Chat Plus" },
      { id: "ContributeIcon", label: "Contribute" },
      { id: "BranchIcon", label: "Branch" },
      { id: "AnthropicLogoIcon", label: "Anthropic Logo" },
      { id: "PreviewIcon", label: "Live Preview" },
      { id: "GlobeIcon", label: "Globe" },
      { id: "LinkIcon", label: "Link" },
      { id: "SparklesIcon", label: "Sparkles" },
      { id: "CodeIcon", label: "Code" },
      { id: "GithubIcon", label: "GitHub" },
      { id: "RocketIcon", label: "Rocket" },
      { id: "ZapIcon", label: "Zap" },
    ]
  }),

  /**
   * Get targeting options (available roles, plans, pages) for admin UI
   */
  getTargetingOptions: adminProcedure.query(async ({ ctx }) => {
    // Get distinct user roles from the database
    const roles = await ctx.prisma.user.groupBy({
      by: ["role"],
      where: { role: { not: null } },
      _count: true,
    })

    // Get distinct plan types
    const plans = await ctx.prisma.plan.findMany({
      where: { type: { not: null } },
      select: { type: true },
      distinct: ["type"],
    })

    return {
      pages: [
        { id: "magic-chat", label: "Magic Chat" },
        { id: "community", label: "Community" },
        { id: "canvas", label: "Canvas" },
        { id: "all", label: "All Pages" },
      ],
      roles: roles.map((r) => ({
        id: r.role!,
        label: r.role!.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        count: r._count,
      })),
      plans: [
        { id: "free", label: "Free" },
        { id: "pro", label: "Pro" },
        { id: "pro_custom_1", label: "Max (Pro Custom 1)" },
        ...plans
          .filter((p) => p.type && !["free", "pro", "pro_custom_1"].includes(p.type))
          .map((p) => ({ id: p.type!, label: p.type! })),
      ],
    }
  }),
})
