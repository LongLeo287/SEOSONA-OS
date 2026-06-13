import { z } from "zod"
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  type TRPCContextAuth,
} from "@/server/api/trpc"
import { TRPCError } from "@trpc/server"
import type { ForYouFeedItem, FollowingFeedItem, UserSelect } from "./types"

// Extra items to fetch for trending to account for duplicates being filtered out
const TRENDING_BUFFER_SIZE = 20

/**
 * Interleave items from different types for better feed variety.
 * Groups items by type, sorts each group by timestamp, then interleaves them.
 */
function interleaveByType<T extends { type: string; timestamp: Date }>(
  items: T[],
): T[] {
  const byType = new Map<string, T[]>()
  items.forEach((item) => {
    const arr = byType.get(item.type) || []
    arr.push(item)
    byType.set(item.type, arr)
  })

  // Sort each group by timestamp descending
  byType.forEach((groupItems) => {
    groupItems.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  })

  // Interleave items from different types
  const result: T[] = []
  const types = Array.from(byType.keys())
  const maxLength = Math.max(
    ...Array.from(byType.values()).map((arr) => arr.length),
  )

  for (let i = 0; i < maxLength; i++) {
    for (const type of types) {
      const arr = byType.get(type)
      if (arr && arr[i]) {
        result.push(arr[i])
      }
    }
  }

  return result
}

export const followsRouter = createTRPCRouter({
  // Toggle follow/unfollow a user
  toggleFollow: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const followerId = ctx.auth.userId!
      const followingId = input.userId

      // Can't follow yourself
      if (followerId === followingId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot follow yourself",
        })
      }

      // Check if already following
      const existingFollow = await ctx.prisma.userFollow.findUnique({
        where: {
          follower_id_following_id: {
            follower_id: followerId,
            following_id: followingId,
          },
        },
      })

      if (existingFollow) {
        // Unfollow
        await ctx.prisma.userFollow.delete({
          where: { id: existingFollow.id },
        })
        return { ok: true, action: "unfollowed" as const }
      } else {
        // Follow
        await ctx.prisma.userFollow.create({
          data: {
            follower_id: followerId,
            following_id: followingId,
          },
        })
        return { ok: true, action: "followed" as const }
      }
    }),

  // Check if current user follows a specific user
  isFollowing: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const follow = await ctx.prisma.userFollow.findUnique({
        where: {
          follower_id_following_id: {
            follower_id: ctx.auth.userId!,
            following_id: input.userId,
          },
        },
      })
      return !!follow
    }),

  // Get follower/following counts for a user
  getFollowCounts: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const [followersCount, followingCount] = await Promise.all([
        ctx.prisma.userFollow.count({
          where: { following_id: input.userId },
        }),
        ctx.prisma.userFollow.count({
          where: { follower_id: input.userId },
        }),
      ])

      return { followersCount, followingCount }
    }),

  // Get followers list with pagination
  getFollowers: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(), // ISO date string for cursor-based pagination
      }),
    )
    .query(async ({ ctx, input }) => {
      const { userId, limit, cursor } = input

      const followers = await ctx.prisma.userFollow.findMany({
        where: {
          following_id: userId,
          ...(cursor && { followed_at: { lt: new Date(cursor) } }),
        },
        include: {
          follower: {
            select: {
              id: true,
              username: true,
              display_username: true,
              name: true,
              display_name: true,
              image_url: true,
              display_image_url: true,
              bio: true,
            },
          },
        },
        orderBy: { followed_at: "desc" },
        take: limit + 1,
      })

      const hasMore = followers.length > limit
      const items = hasMore ? followers.slice(0, -1) : followers
      const nextCursor = hasMore
        ? items[items.length - 1]?.followed_at.toISOString()
        : undefined

      return {
        items: items.map((f) => ({
          ...f.follower,
          followed_at: f.followed_at,
        })),
        nextCursor,
      }
    }),

  // Get following list with pagination
  getFollowing: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(), // ISO date string for cursor-based pagination
      }),
    )
    .query(async ({ ctx, input }) => {
      const { userId, limit, cursor } = input

      const following = await ctx.prisma.userFollow.findMany({
        where: {
          follower_id: userId,
          ...(cursor && { followed_at: { lt: new Date(cursor) } }),
        },
        include: {
          following: {
            select: {
              id: true,
              username: true,
              display_username: true,
              name: true,
              display_name: true,
              image_url: true,
              display_image_url: true,
              bio: true,
            },
          },
        },
        orderBy: { followed_at: "desc" },
        take: limit + 1,
      })

      const hasMore = following.length > limit
      const items = hasMore ? following.slice(0, -1) : following
      const nextCursor = hasMore
        ? items[items.length - 1]?.followed_at.toISOString()
        : undefined

      return {
        items: items.map((f) => ({
          ...f.following,
          followed_at: f.followed_at,
        })),
        nextCursor,
      }
    }),

  // Get activity feed from followed users (demos + bookmarks)
  getFollowingFeed: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
        cursor: z.string().optional(), // ISO date string for cursor
        showNewDemos: z.boolean().default(true),
        showFollowedBookmarks: z.boolean().default(true),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.auth.userId!
      const { limit, cursor, showNewDemos, showFollowedBookmarks } = input

      // If nothing is enabled, show demos by default
      const shouldShowDemos =
        showNewDemos || (!showNewDemos && !showFollowedBookmarks)

      // Get list of users I follow
      const followingIds = await ctx.prisma.userFollow.findMany({
        where: { follower_id: userId },
        select: { following_id: true },
      })

      if (followingIds.length === 0) {
        return { items: [], nextCursor: undefined }
      }

      const followingUserIds = followingIds.map((f) => f.following_id)
      const cursorDate = cursor ? new Date(cursor) : new Date()

      // Fetch new demos from followed users (if enabled)
      const demos = shouldShowDemos
        ? await ctx.prisma.demo.findMany({
            where: {
              user_id: { in: followingUserIds },
              created_at: { lt: cursorDate },
            },
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  display_username: true,
                  name: true,
                  display_name: true,
                  image_url: true,
                  display_image_url: true,
                },
              },
              component: {
                select: {
                  id: true,
                  name: true,
                  component_slug: true,
                  preview_url: true,
                },
              },
              _count: { select: { demoBookmarks: true } },
            },
            orderBy: { created_at: "desc" },
            take: limit,
          })
        : []

      // Fetch bookmarks from followed users (if enabled)
      const bookmarks = showFollowedBookmarks
        ? await ctx.prisma.demoBookmark.findMany({
            where: {
              user_id: { in: followingUserIds },
              bookmarked_at: { lt: cursorDate },
            },
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  display_username: true,
                  name: true,
                  display_name: true,
                  image_url: true,
                  display_image_url: true,
                },
              },
              demo: {
                include: {
                  user: {
                    select: {
                      id: true,
                      username: true,
                      display_username: true,
                      name: true,
                      display_name: true,
                      image_url: true,
                      display_image_url: true,
                    },
                  },
                  component: {
                    select: {
                      id: true,
                      name: true,
                      component_slug: true,
                      preview_url: true,
                    },
                  },
                  _count: { select: { demoBookmarks: true } },
                },
              },
            },
            orderBy: { bookmarked_at: "desc" },
            take: limit,
          })
        : []

      // Transform and merge feed items
      type FeedItem = {
        id: string
        type: "demo" | "bookmark"
        timestamp: Date
        user: {
          id: string
          username: string | null
          display_username: string | null
          name: string | null
          display_name: string | null
          image_url: string | null
          display_image_url: string | null
        }
        reason: string
        demo: {
          id: number
          name: string | null
          demo_slug: string
          preview_url: string | null
          video_url: string | null
          view_count?: number
          bookmarks_count?: number
          _count?: { demoBookmarks: number }
          component: {
            id: number
            name: string
            component_slug: string
            preview_url: string
            user?: {
              id: string
              username: string | null
              display_username: string | null
              name: string | null
              display_name: string | null
              image_url: string | null
              display_image_url: string | null
            }
          } | null
          user: {
            id: string
            username: string | null
            display_username: string | null
            name: string | null
            display_name: string | null
            image_url: string | null
            display_image_url: string | null
          }
        }
      }

      const feedItems: FeedItem[] = [
        ...demos.map((d) => ({
          id: `demo-${d.id}`,
          type: "demo" as const,
          timestamp: d.created_at,
          user: d.user,
          reason: `You follow @${d.user.display_username || d.user.username}`,
          demo: {
            id: d.id,
            name: d.name,
            demo_slug: d.demo_slug,
            preview_url: d.preview_url,
            video_url: d.video_url,
            component: d.component,
            user: d.user,
            _count: d._count,
          },
        })),
        ...bookmarks.map((b) => ({
          id: `bookmark-${b.demo_id}-${b.user_id}`,
          type: "bookmark" as const,
          timestamp: b.bookmarked_at || new Date(),
          user: b.user,
          reason: `You follow @${b.user.display_username || b.user.username}`,
          demo: {
            id: b.demo.id,
            name: b.demo.name,
            demo_slug: b.demo.demo_slug,
            preview_url: b.demo.preview_url,
            video_url: b.demo.video_url,
            component: b.demo.component,
            user: b.demo.user,
            _count: b.demo._count,
          },
        })),
      ]

      // Sort by timestamp descending
      feedItems.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

      // Take limit items
      const items = feedItems.slice(0, limit)

      // Fetch counts from MVs (same as in getForYouFeed)
      const allDemoIds = items.map((f) => f.demo.id)
      const allComponentIds = [
        ...new Set(
          items
            .map((f) => f.demo.component?.id)
            .filter((id): id is number => typeof id === "number"),
        ),
      ]

      const bookmarkCounts = new Map<number, number>()
      const viewCounts = new Map<number, number>()

      if (allDemoIds.length > 0) {
        try {
          const rows = await ctx.prisma.$queryRaw<
            Array<{ demo_id: number; bookmarks_count: number }>
          >`SELECT demo_id, bookmarks_count FROM demo_bookmarks_mv WHERE demo_id = ANY(${allDemoIds}::int[])`
          for (const r of rows) {
            bookmarkCounts.set(
              Number(r.demo_id),
              Number(r.bookmarks_count || 0),
            )
          }
        } catch (_e) {
          // Ignore MV errors - materialized view may not exist
        }
      }

      if (allComponentIds.length > 0) {
        try {
          const viewRows = await ctx.prisma.$queryRaw<
            Array<{ component_id: number; count: number }>
          >`SELECT component_id, count FROM mv_component_analytics WHERE component_id = ANY(${allComponentIds}::int[]) AND activity_type = 'component_view'`
          for (const r of viewRows) {
            viewCounts.set(Number(r.component_id), Number(r.count || 0))
          }
        } catch (_e) {
          // Ignore MV errors - materialized view may not exist
        }
      }

      // Add counts to each item
      const itemsWithCounts = items.map((item) => {
        const componentId = item.demo.component?.id
        return {
          ...item,
          demo: {
            ...item.demo,
            view_count: componentId ? viewCounts.get(componentId) || 0 : 0,
            bookmarks_count:
              bookmarkCounts.get(item.demo.id) ||
              item.demo._count?.demoBookmarks ||
              0,
          },
        }
      })

      const lastItem = itemsWithCounts[itemsWithCounts.length - 1]
      const nextCursor = lastItem?.timestamp.toISOString()

      return { items: itemsWithCounts, nextCursor }
    }),

  // Get IDs of users the current user is following (for batch checking)
  myFollowingIds: protectedProcedure.query(async ({ ctx }) => {
    const follows = await ctx.prisma.userFollow.findMany({
      where: { follower_id: ctx.auth.userId! },
      select: { following_id: true },
    })
    return follows.map((f) => f.following_id)
  }),

  // Infinite "For You" feed - combines trending and personalized content
  getForYouFeed: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
        cursor: z.string().optional(),
        showTrending: z.boolean().default(true),
        showFromBookmarkedAuthors: z.boolean().default(true),
        showSimilarToBookmarked: z.boolean().default(true),
      }),
    )
    .query(async ({ ctx, input }) => {
      const {
        limit,
        cursor,
        showTrending,
        showFromBookmarkedAuthors,
        showSimilarToBookmarked,
      } = input
      const userId = (ctx as TRPCContextAuth).auth.userId ?? undefined

      // If nothing is enabled, show trending by default
      const shouldShowTrending =
        showTrending || (!showFromBookmarkedAuthors && !showSimilarToBookmarked)

      type FeedItem = {
        id: string
        type: "trending" | "from_bookmarked_author" | "similar"
        timestamp: Date
        reason: string
        demo: {
          id: number
          name: string | null
          demo_slug: string
          preview_url: string | null
          video_url: string | null
          created_at: Date
          view_count?: number
          bookmarks_count?: number
          _count?: { demoBookmarks: number }
          component: {
            id: number
            name: string
            component_slug: string
            preview_url: string | null
            user?: {
              id: string
              username: string | null
              display_username: string | null
              name: string | null
              display_name: string | null
              image_url: string | null
              display_image_url: string | null
            }
          } | null
          user: {
            id: string
            username: string | null
            display_username: string | null
            name: string | null
            display_name: string | null
            image_url: string | null
            display_image_url: string | null
          }
        }
      }

      const feedItems: FeedItem[] = []
      const cursorDate = cursor ? new Date(cursor) : undefined

      // Deduplication sets - track by both demo ID and component ID
      const seenDemoIds = new Set<number>()
      const seenComponentIds = new Set<number>()

      // Helper to check if demo is duplicate
      const isDuplicate = (demoId: number, componentId?: number | null) => {
        if (seenDemoIds.has(demoId)) return true
        if (componentId && seenComponentIds.has(componentId)) return true
        return false
      }

      // Helper to mark demo as seen
      const markSeen = (demoId: number, componentId?: number | null) => {
        seenDemoIds.add(demoId)
        if (componentId) seenComponentIds.add(componentId)
      }

      // === STAGE 1: Parallel initial queries ===
      const demoInclude = {
        component: { include: { user: true } },
        user: {
          select: {
            id: true,
            username: true,
            display_username: true,
            name: true,
            display_name: true,
            image_url: true,
            display_image_url: true,
          },
        },
        _count: { select: { demoBookmarks: true } },
      } as const

      const [trendingDemos, bookmarkedAuthorIds, userBookmarks] =
        await Promise.all([
          // Trending demos
          shouldShowTrending
            ? ctx.prisma.demo.findMany({
                where: {
                  component: { is_public: true },
                  demo_slug: "default",
                  ...(cursorDate && { created_at: { lt: cursorDate } }),
                },
                orderBy: { created_at: "desc" },
                take: limit + TRENDING_BUFFER_SIZE,
                include: demoInclude,
              })
            : Promise.resolve([]),

          // Bookmarked author IDs (for showFromBookmarkedAuthors)
          showFromBookmarkedAuthors && userId
            ? ctx.prisma.demoBookmark.findMany({
                where: { user_id: userId },
                select: { demo: { select: { user_id: true } } },
                distinct: ["demo_id"],
              })
            : Promise.resolve([]),

          // User bookmarks with tags (for showSimilarToBookmarked)
          showSimilarToBookmarked && userId
            ? ctx.prisma.demoBookmark.findMany({
                where: { user_id: userId },
                select: {
                  demo: {
                    select: {
                      id: true,
                      component_id: true,
                      demoTags: { select: { tag_id: true } },
                    },
                  },
                },
                take: 20,
                orderBy: { bookmarked_at: "desc" },
              })
            : Promise.resolve([]),
        ])

      // === STAGE 2: Parallel dependent queries ===
      const authorIds = [
        ...new Set(
          bookmarkedAuthorIds
            .map((b) => b.demo.user_id)
            .filter((id): id is string => !!id && id !== userId),
        ),
      ]

      const bookmarkedDemoIds = new Set(userBookmarks.map((b) => b.demo.id))
      const bookmarkedComponentIds = new Set(
        userBookmarks.map((b) => b.demo.component_id).filter(Boolean),
      )
      const tagIds = [
        ...new Set(
          userBookmarks.flatMap((b) => b.demo.demoTags.map((t) => t.tag_id)),
        ),
      ]

      const [authorDemos, similarDemos] = await Promise.all([
        // Demos from bookmarked authors
        authorIds.length > 0
          ? ctx.prisma.demo.findMany({
              where: {
                user_id: { in: authorIds },
                component: { is_public: true },
                ...(cursorDate && { created_at: { lt: cursorDate } }),
              },
              orderBy: { created_at: "desc" },
              take: limit + 1,
              include: demoInclude,
            })
          : Promise.resolve([]),

        // Similar demos by tags
        tagIds.length > 0
          ? ctx.prisma.demo.findMany({
              where: {
                component: { is_public: true },
                id: { notIn: [...bookmarkedDemoIds] },
                component_id: { notIn: [...bookmarkedComponentIds] as number[] },
                demoTags: { some: { tag_id: { in: tagIds } } },
                ...(cursorDate && { created_at: { lt: cursorDate } }),
              },
              orderBy: { created_at: "desc" },
              take: limit + 1,
              include: demoInclude,
            })
          : Promise.resolve([]),
      ])

      // === Process results ===
      // Add demos from bookmarked authors
      authorDemos.forEach((demo) => {
        if (!isDuplicate(demo.id, demo.component?.id)) {
          markSeen(demo.id, demo.component?.id)
          feedItems.push({
            id: `author-${demo.id}`,
            type: "from_bookmarked_author",
            timestamp: demo.created_at,
            reason: `New from @${demo.user.display_username || demo.user.username}`,
            demo: {
              id: demo.id,
              name: demo.name,
              demo_slug: demo.demo_slug,
              preview_url: demo.preview_url,
              video_url: demo.video_url,
              created_at: demo.created_at,
              component: demo.component,
              user: demo.user,
              _count: demo._count,
            },
          })
        }
      })

      // Add similar demos
      similarDemos.forEach((demo) => {
        if (!isDuplicate(demo.id, demo.component?.id)) {
          markSeen(demo.id, demo.component?.id)
          feedItems.push({
            id: `similar-${demo.id}`,
            type: "similar",
            timestamp: demo.created_at,
            reason: "Similar to your bookmarks",
            demo: {
              id: demo.id,
              name: demo.name,
              demo_slug: demo.demo_slug,
              preview_url: demo.preview_url,
              video_url: demo.video_url,
              created_at: demo.created_at,
              component: demo.component,
              user: demo.user,
              _count: demo._count,
            },
          })
        }
      })

      // NOW add trending demos as FILLER (lowest priority)
      // Only add if not already in feed from personalized sources
      if (shouldShowTrending && trendingDemos.length > 0) {
        trendingDemos.forEach((demo) => {
          // Skip if already added from a more personalized source
          if (!isDuplicate(demo.id, demo.component?.id)) {
            markSeen(demo.id, demo.component?.id)
            feedItems.push({
              id: `trending-${demo.id}`,
              type: "trending",
              timestamp: demo.created_at,
              reason: "Trending in 21st community",
              demo: {
                id: demo.id,
                name: demo.name,
                demo_slug: demo.demo_slug,
                preview_url: demo.preview_url,
                video_url: demo.video_url,
                created_at: demo.created_at,
                component: demo.component,
                user: demo.user,
                _count: demo._count,
              },
            })
          }
        })
      }

      // Fetch view_count and bookmarks_count for all items
      const allDemoIds = feedItems.map((f) => f.demo.id)
      const allComponentIds = [
        ...new Set(
          feedItems
            .map((f) => f.demo.component?.id)
            .filter((x): x is number => typeof x === "number"),
        ),
      ]

      const bookmarkCounts = new Map<number, number>()
      const viewCounts = new Map<number, number>()

      // Fetch bookmark counts from demo_bookmarks_mv
      if (allDemoIds.length > 0) {
        try {
          const rows = await ctx.prisma.$queryRaw<
            Array<{ demo_id: number; bookmarks_count: number }>
          >`SELECT demo_id, bookmarks_count FROM demo_bookmarks_mv WHERE demo_id = ANY(${allDemoIds}::int[])`
          for (const r of rows) {
            bookmarkCounts.set(
              Number(r.demo_id),
              Number(r.bookmarks_count || 0),
            )
          }
        } catch (_e) {
          // MV may not exist - silently fail
        }
      }

      // Fetch view counts from mv_component_analytics (same as week top)
      if (allComponentIds.length > 0) {
        try {
          const viewRows = await ctx.prisma.$queryRaw<
            Array<{ component_id: number; count: number }>
          >`SELECT component_id, count FROM mv_component_analytics WHERE component_id = ANY(${allComponentIds}::int[]) AND activity_type = 'component_view'`
          for (const r of viewRows) {
            viewCounts.set(Number(r.component_id), Number(r.count || 0))
          }
        } catch (_e) {
          // MV may not exist - silently fail
        }
      }

      // Add counts to each demo (with fallbacks like in demos router)
      const feedItemsWithCounts = feedItems.map((item) => {
        const componentId = item.demo.component?.id
        return {
          ...item,
          demo: {
            ...item.demo,
            view_count: componentId ? viewCounts.get(componentId) || 0 : 0,
            bookmarks_count:
              bookmarkCounts.get(item.demo.id) ||
              item.demo._count?.demoBookmarks ||
              0,
          },
        }
      })

      // Interleave items from different source types for better variety
      const shuffledItems = interleaveByType(feedItemsWithCounts)

      // Check if there's more data
      const hasMore = shuffledItems.length > limit

      // Take limit items
      const items = shuffledItems.slice(0, limit)
      const lastItem = items[items.length - 1]

      // Return cursor if there's more data OR if we got a full page (might be more)
      const nextCursor =
        hasMore || items.length >= limit
          ? lastItem?.timestamp.toISOString()
          : null

      return { items, nextCursor }
    }),

  // Track feed interaction analytics
  trackFeedInteraction: protectedProcedure
    .input(
      z.object({
        feedType: z.enum(["foryou", "followed"]),
        sourceType: z.enum([
          "trending",
          "from_bookmarked_author",
          "similar",
          "demo",
          "bookmark",
        ]),
        demoId: z.number(),
        action: z.enum(["view", "click", "bookmark", "copy_prompt"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.auth.userId!

      // Store analytics in FeedAnalytics table
      try {
        await ctx.prisma.feedAnalytics.create({
          data: {
            user_id: userId,
            feed_type: input.feedType,
            source_type: input.sourceType,
            demo_id: input.demoId,
            action: input.action,
          },
        })
      } catch (_e) {
        // Table may not exist yet - silently fail
      }

      return { success: true }
    }),
})
