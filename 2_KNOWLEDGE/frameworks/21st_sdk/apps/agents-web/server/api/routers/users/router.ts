import { z } from "zod"
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
} from "@/server/api/trpc"
import { TRPCError } from "@trpc/server"

const transformUser = (user: any) => {
  if (!user) return null

  return {
    id: user.id,
    username: user.username,
    name: user.name,
    image_url: user.image_url,
    display_name: user.display_name,
    display_username: user.display_username,
    display_image_url: user.display_image_url,
    bio: user.bio,
    website_url: user.website_url,
    github_url: user.github_url,
    twitter_url: user.twitter_url,
    donation_url: user.donation_url,
    pro_referral_url: user.pro_referral_url,
    created_at: user.created_at,
    manually_added: user.manually_added,
  }
}

export const usersRouter = createTRPCRouter({
  getCurrentUserProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.auth.userId! },
    })

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      })
    }

    return transformUser(user)
  }),

  isCurrentUserAdmin: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.auth.userId! },
      select: { is_admin: true },
    })

    return user?.is_admin ?? false
  }),

  getUserProfileByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          OR: [
            { username: input.username },
            { display_username: input.username },
          ],
        },
      })

      if (!user) return null

      return transformUser(user)
    }),

  // Batch fetch by username/display_username list (for featured authors row)
  getUsersByUsernames: publicProcedure
    .input(z.object({ usernames: z.array(z.string()).min(1).max(100) }))
    .query(async ({ input, ctx }) => {
      const { usernames } = input
      const users = await ctx.prisma.user.findMany({
        where: {
          OR: [
            { username: { in: usernames } },
            { display_username: { in: usernames } },
          ],
        },
      })

      return users.map(transformUser)
    }),

  // Fast batch fetch by IDs (optimized for featured authors avatars)
  getUsersForAvatarsByIds: publicProcedure
    .input(z.object({ userIds: z.array(z.string()).min(1).max(100) }))
    .query(async ({ input, ctx }) => {
      const { userIds } = input
      const users = await ctx.prisma.user.findMany({
        where: {
          id: { in: userIds },
        },
        select: {
          id: true,
          username: true,
          display_username: true,
          name: true,
          display_name: true,
          image_url: true,
          display_image_url: true,
        },
      })

      // Maintain order of input userIds
      const userMap = new Map(users.map((user) => [user.id, user]))
      return userIds.map((id) => userMap.get(id)).filter(Boolean)
    }),

  getHunterUser: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input, ctx }) => {
      if (!input.username) return null

      const user = await ctx.prisma.user.findUnique({
        where: { username: input.username },
      })

      if (!user) return null

      return transformUser(user)
    }),

  getCurrentUser: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.auth.userId) {
      return null
    }

    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.auth.userId },
      select: {
        id: true,
        role: true,
        username: true,
        display_username: true,
        name: true,
        display_name: true,
        email: true,
        image_url: true,
        display_image_url: true,
      },
    })

    return user
  }),

  getPartners: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { limit, offset } = input

      const users = await ctx.prisma.user.findMany({
        where: {
          is_partner: true,
        },
        select: {
          id: true,
          username: true,
          display_username: true,
          name: true,
          display_name: true,
          email: true,
          image_url: true,
          display_image_url: true,
          bio: true,
          created_at: true,
          updated_at: true,
          github_url: true,
          twitter_url: true,
          website_url: true,
          paypal_email: true,
          is_admin: true,
          is_partner: true,
          bundles_fee: true,
        },
        orderBy: {
          created_at: "desc",
        },
        take: limit,
        skip: offset,
      })

      const totalCount = await ctx.prisma.user.count({
        where: {
          is_partner: true,
        },
      })

      return {
        users,
        totalCount,
        hasMore: offset + limit < totalCount,
      }
    }),

  searchUsers: adminProcedure
    .input(
      z.object({
        query: z.string().min(1),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { query } = input

      const users = await ctx.prisma.user.findMany({
        where: {
          OR: [
            {
              username: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              display_username: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              display_name: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
        },
        select: {
          id: true,
          username: true,
          display_username: true,
          name: true,
          display_name: true,
          email: true,
          image_url: true,
          display_image_url: true,
          is_admin: true,
          is_partner: true,
          created_at: true,
        },
        orderBy: [
          { display_name: "asc" },
          { name: "asc" },
          { username: "asc" },
        ],
        take: 50,
      })

      return users
    }),

  getUserRole: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.auth.userId! },
      select: { role: true },
    })

    return user?.role || null
  }),

  searchUsersWithComponents: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input, ctx }) => {
      if (!input.query) return []

      // First get users that have published components
      const publishedUserIds = await ctx.prisma.component.findMany({
        where: { is_public: true },
        select: { user_id: true },
        distinct: ["user_id"],
      })

      const userIds = publishedUserIds.map((c) => c.user_id)

      if (userIds.length === 0) return []

      const users = await ctx.prisma.user.findMany({
        where: {
          AND: [
            { id: { in: userIds } },
            {
              OR: [
                {
                  username: {
                    contains: input.query,
                    mode: "insensitive",
                  },
                },
                {
                  display_username: {
                    contains: input.query,
                    mode: "insensitive",
                  },
                },
                {
                  name: {
                    contains: input.query,
                    mode: "insensitive",
                  },
                },
                {
                  display_name: {
                    contains: input.query,
                    mode: "insensitive",
                  },
                },
              ],
            },
          ],
        },
        select: {
          id: true,
          username: true,
          display_username: true,
          name: true,
          display_name: true,
          image_url: true,
          display_image_url: true,
        },
        take: 5,
      })

      return users
    }),

  // Community header stats
  getCommunityUserStats: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const [componentsCount, demosCount, user] = await Promise.all([
        ctx.prisma.component.count({
          where: { user_id: input.userId, is_public: true },
        }),
        ctx.prisma.demo.count({ where: { user_id: input.userId } }),
        ctx.prisma.user.findUnique({
          where: { id: input.userId },
          select: { created_at: true },
        }),
      ])

      return {
        componentsCount,
        demosCount,
        joinedAt: user?.created_at ?? null,
      }
    }),

  // Get current user's survey/onboarding data
  getCurrentUserSurveyData: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.auth.userId! },
      select: {
        name: true,
        what_describes_you_best: true,
        what_describes_you_best_other: true,
        company_size: true,
      },
    })

    return user
  }),

  // Update current user's survey/onboarding data
  updateUserSurveyData: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        what_describes_you_best: z.enum([
          "designer",
          "engineer",
          "product",
          "marketer",
          "growth",
          "sales",
          "other",
        ]),
        what_describes_you_best_other: z.string().optional(),
        company_size: z.enum([
          "just_me",
          "2_49",
          "50_249",
          "250_999",
          "1000_2000",
          "2000_plus",
        ]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.prisma.user.update({
        where: { id: ctx.auth.userId! },
        data: {
          name: input.name,
          display_name: input.name,
          what_describes_you_best: input.what_describes_you_best,
          what_describes_you_best_other: input.what_describes_you_best_other,
          company_size: input.company_size,
        },
        select: {
          id: true,
          name: true,
          what_describes_you_best: true,
          what_describes_you_best_other: true,
          company_size: true,
        },
      })

      return updatedUser
    }),

  getTopAuthorsOfMonth: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(30).default(20) }))
    .query(async ({ ctx, input }) => {
      const since = new Date()
      since.setDate(since.getDate() - 30)

      // Top users by total bookmarks on demos published in last 30 days
      const recentPublicDemos = await ctx.prisma.demo.findMany({
        where: {
          created_at: { gte: since },
          component: { is_public: true },
        },
        select: { user_id: true, bookmarks_count: true },
      })

      const bookmarksMap = new Map<string, number>()
      const countMap = new Map<string, number>()
      for (const d of recentPublicDemos) {
        bookmarksMap.set(d.user_id, (bookmarksMap.get(d.user_id) ?? 0) + (d.bookmarks_count ?? 0))
        countMap.set(d.user_id, (countMap.get(d.user_id) ?? 0) + 1)
      }

      const topEntries = [...bookmarksMap.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, input.limit)

      if (!topEntries.length) return []

      const userIds = topEntries.map(([uid]) => uid)
      const monthlyMap = new Map(userIds.map((uid) => [uid, countMap.get(uid) ?? 0]))

      const demoInclude = {
        component: { include: { user: true } },
        user: true,
        demoTags: { include: { tag: true } },
      } as const

      const [users, ...perUserDemos] = await Promise.all([
        ctx.prisma.user.findMany({ where: { id: { in: userIds } } }),
        ...userIds.map((uid) =>
          ctx.prisma.demo.findMany({
            where: { user_id: uid, component: { is_public: true } },
            include: demoInclude,
            orderBy: [{ bookmarks_count: "desc" }, { created_at: "desc" }],
            take: 8,
          }),
        ),
      ])

      const demosByUser = new Map(
        userIds.map((uid, i) => [uid, perUserDemos[i]!]),
      )

      return userIds
        .map((userId) => {
          const user = users.find((u) => u.id === userId)
          if (!user) return null

          const demos = (demosByUser.get(userId) ?? [])
            .filter((d) => d.component)
            .map((d) => ({
              id: d.id,
              name: d.name,
              preview_url: d.preview_url,
              video_url: d.video_url,
              updated_at:
                d.updated_at?.toISOString() ?? d.created_at.toISOString(),
              created_at: d.created_at.toISOString(),
              demo_slug: d.demo_slug,
              bundle_html_url: d.bundle_html_url,
              bundle_url: d.bundle_html_url
                ? { html: d.bundle_html_url }
                : null,
              bookmarks_count: d.bookmarks_count ?? 0,
              view_count: 0,
              fts: null,
              pro_preview_image_url: d.pro_preview_image_url,
              compiled_css: d.compiled_css,
              demo_code: d.demo_code,
              demo_dependencies: d.demo_dependencies,
              demo_direct_registry_dependencies:
                d.demo_direct_registry_dependencies,
              component_id: d.component_id,
              user_id: d.user_id,
              embedding: null,
              embedding_oai: null,
              tags: d.demoTags?.map((dt) => dt.tag) ?? [],
              user: d.user,
              component: { ...d.component!, user: d.component!.user },
            }))

          return {
            user: {
              id: user.id,
              username: user.username,
              display_username: user.display_username,
              name: user.name,
              display_name: user.display_name,
              image_url: user.image_url,
              display_image_url: user.display_image_url,
              bio: user.bio,
              donation_url: user.donation_url,
              created_at: user.created_at.toISOString(),
            },
            monthlyCount: monthlyMap.get(userId) ?? 0,
            monthlyBookmarks: bookmarksMap.get(userId) ?? 0,
            demos,
          }
        })
        .filter((x): x is NonNullable<typeof x> => x !== null)
    }),
})
