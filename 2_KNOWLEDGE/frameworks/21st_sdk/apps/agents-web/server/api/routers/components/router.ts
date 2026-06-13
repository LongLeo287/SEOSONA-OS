import { z } from "zod"

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { hasUserComponentAccess } from "./service"
import { prisma } from "@/lib/prisma"

export const componentsRouter = createTRPCRouter({
  hasUserComponentAccess: publicProcedure
    .input(
      z.object({
        componentId: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { componentId } = input
      const result = await hasUserComponentAccess(ctx.auth.userId, componentId)
      return result
    }),

  getTrendingCandidates: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        minBookmarks: z.number().default(10),
        minViews: z.number().default(500),
        hoursBack: z.number().default(168), // 7 days = 168 hours
      }),
    )
    .query(async ({ input }) => {
      const { limit, minBookmarks, minViews, hoursBack } = input

      const cutoffTime = new Date(Date.now() - hoursBack * 60 * 60 * 1000)

      // Get components created in the specified timeframe with user data and demos
      const components = await prisma.component.findMany({
        where: {
          created_at: {
            gte: cutoffTime,
          },
          is_public: true,
        },
        include: {
          user: {
            select: {
              username: true,
              display_username: true,
              name: true,
              display_name: true,
              twitter_url: true,
            },
          },
          demos: {
            select: {
              id: true,
              name: true,
              preview_url: true,
              video_url: true,
              demo_slug: true,
              demoBookmarks: true,
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
      })

      if (!components.length) {
        return []
      }

      // Get analytics data for these components
      const componentIds = components.map((c) => c.id)

      // Get usage analytics (code_copy, prompt_copy, cli_download)
      const usageAnalytics = await prisma.componentAnalytic.findMany({
        where: {
          component_id: {
            in: componentIds,
          },
          activity_type: {
            in: [
              "component_code_copy",
              "component_prompt_copy",
              "component_cli_download",
            ],
          },
        },
        select: {
          component_id: true,
          activity_type: true,
        },
      })

      // Get view analytics (component_view)
      const viewAnalytics = await prisma.componentAnalytic.findMany({
        where: {
          component_id: {
            in: componentIds,
          },
          activity_type: "component_view",
        },
        select: {
          component_id: true,
        },
      })

      // Calculate metrics for each component
      const usageMap = new Map<number, number>()
      const viewsMap = new Map<number, number>()
      const bookmarksMap = new Map<number, number>()

      // Count usage analytics
      usageAnalytics.forEach((a) => {
        const current = usageMap.get(a.component_id) || 0
        usageMap.set(a.component_id, current + 1)
      })

      // Count view analytics
      viewAnalytics.forEach((a) => {
        const current = viewsMap.get(a.component_id) || 0
        viewsMap.set(a.component_id, current + 1)
      })

      // Count demo bookmarks for each component
      components.forEach((component) => {
        const totalBookmarks = component.demos.reduce((sum, demo) => {
          return sum + demo.demoBookmarks.length
        }, 0)
        bookmarksMap.set(component.id, totalBookmarks)
      })

      // Combine data and filter by new criteria
      const candidates = components
        .map((component) => ({
          ...component,
          total_usage: usageMap.get(component.id) || 0,
          total_views: viewsMap.get(component.id) || 0,
          total_bookmarks: bookmarksMap.get(component.id) || 0,
          username: component.user.username || "unknown",
          display_username: component.user.display_username,
          display_name: component.user.display_name || component.user.name,
          twitter_url: component.user.twitter_url,
        }))
        .filter(
          (component) =>
            component.total_bookmarks >= minBookmarks ||
            component.total_views >= minViews,
        )
        .sort(
          (a, b) =>
            b.total_usage +
            b.total_views +
            b.total_bookmarks * 10 -
            (a.total_usage + a.total_views + a.total_bookmarks * 10),
        )
        .slice(0, limit)

      return candidates
    }),

  getWeeklyTopComponents: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(20).default(5),
        daysBack: z.number().default(7),
        minBookmarks: z.number().default(10),
        minViews: z.number().default(500),
      }),
    )
    .query(async ({ input }) => {
      const { limit, daysBack, minBookmarks, minViews } = input

      const cutoffTime = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000)

      // Get components from the specified timeframe with demos and bookmarks
      const components = await prisma.component.findMany({
        where: {
          created_at: {
            gte: cutoffTime,
          },
          is_public: true,
        },
        include: {
          user: {
            select: {
              username: true,
              display_username: true,
              name: true,
              display_name: true,
              twitter_url: true,
            },
          },
          demos: {
            include: {
              demoBookmarks: true,
            },
          },
        },
      })

      if (!components.length) {
        return []
      }

      // Get analytics data for these components
      const componentIds = components.map((c) => c.id)

      // Get usage analytics
      const usageAnalytics = await prisma.componentAnalytic.findMany({
        where: {
          component_id: {
            in: componentIds,
          },
          activity_type: {
            in: [
              "component_code_copy",
              "component_prompt_copy",
              "component_cli_download",
            ],
          },
        },
        select: {
          component_id: true,
          activity_type: true,
        },
      })

      // Get view analytics
      const viewAnalytics = await prisma.componentAnalytic.findMany({
        where: {
          component_id: {
            in: componentIds,
          },
          activity_type: "component_view",
        },
        select: {
          component_id: true,
        },
      })

      // Calculate metrics
      const usageMap = new Map<number, number>()
      const viewsMap = new Map<number, number>()
      const bookmarksMap = new Map<number, number>()

      // Count usage analytics
      usageAnalytics.forEach((a) => {
        const current = usageMap.get(a.component_id) || 0
        usageMap.set(a.component_id, current + 1)
      })

      // Count view analytics
      viewAnalytics.forEach((a) => {
        const current = viewsMap.get(a.component_id) || 0
        viewsMap.set(a.component_id, current + 1)
      })

      // Count demo bookmarks
      components.forEach((component) => {
        const totalBookmarks = component.demos.reduce((sum, demo) => {
          return sum + demo.demoBookmarks.length
        }, 0)
        bookmarksMap.set(component.id, totalBookmarks)
      })

      // Get top components sorted by combined metrics and filter by trending criteria
      const topComponents = components
        .map((component) => ({
          ...component,
          total_usage: usageMap.get(component.id) || 0,
          total_views: viewsMap.get(component.id) || 0,
          total_bookmarks: bookmarksMap.get(component.id) || 0,
          username: component.user.username || "unknown",
          display_username: component.user.display_username,
          display_name: component.user.display_name || component.user.name,
          twitter_url: component.user.twitter_url,
        }))
        .filter(
          (component) =>
            component.total_bookmarks >= minBookmarks ||
            component.total_views >= minViews,
        )
        .sort(
          (a, b) =>
            b.total_usage +
            b.total_views +
            b.total_bookmarks * 10 -
            (a.total_usage + a.total_views + a.total_bookmarks * 10),
        )
        .slice(0, limit)

      return topComponents
    }),
})
