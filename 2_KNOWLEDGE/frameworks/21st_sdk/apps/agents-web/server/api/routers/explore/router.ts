import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { z } from "zod"

type RawClient = {
  $queryRawUnsafe: <T>(query: string, ...values: unknown[]) => Promise<T>
  $executeRawUnsafe: (query: string, ...values: unknown[]) => Promise<number>
}

type SearchRow = { query: string; count: number }

type TagOpportunityRow = {
  id: number
  name: string
  slug: string
  component_count: number
  total_views: number
  avg_views_per_component: number
}

type DonationTagRow = {
  id: number
  name: string
  slug: string
  component_count: number
  support_clicks: number
}

type PopularCategoryRow = {
  id: number
  name: string
  slug: string
  component_count: number
  total_views: number
}

const daysAgo = (n: number) =>
  new Date(Date.now() - n * 24 * 60 * 60 * 1000)

export const exploreRouter = createTRPCRouter({
  /**
   * Top UI search queries from the search_queries table.
   * Only clean text queries (2–60 chars, no JSON/code fragments).
   */
  getPopularSearches: publicProcedure
    .input(z.object({ limit: z.number().int().min(1).max(100).default(40) }))
    .query(async ({ ctx, input }) => {
      try {
        const cutoff = daysAgo(30)
        const rows = await (ctx.prisma as unknown as RawClient).$queryRawUnsafe<SearchRow[]>(
          `SELECT
            LOWER(TRIM(query)) AS query,
            COUNT(*)::int4     AS count
          FROM public.search_queries
          WHERE created_at > $1
            AND LENGTH(TRIM(query)) BETWEEN 2 AND 60
            AND TRIM(query) NOT SIMILAR TO '%[{}\[\]<>]%'
          GROUP BY LOWER(TRIM(query))
          ORDER BY count DESC
          LIMIT $2`,
          cutoff,
          input.limit,
        )
        return rows
      } catch {
        // Table may not exist yet
        return [] as SearchRow[]
      }
    }),

  /**
   * Underserved niches: tags with few components (1–8) but high average views
   * per component. High avg views → real demand, low supply → opportunity.
   */
  getTagOpportunities: publicProcedure
    .input(z.object({ limit: z.number().int().min(1).max(30).default(12) }))
    .query(async ({ ctx, input }) => {
      const rows = await (ctx.prisma as unknown as RawClient).$queryRawUnsafe<TagOpportunityRow[]>(
        `SELECT
          t.id,
          t.name,
          t.slug,
          COUNT(DISTINCT ct.component_id)::int4                               AS component_count,
          COALESCE(SUM(mca.count), 0)::int4                                   AS total_views,
          ROUND(
            COALESCE(SUM(mca.count), 0)
            / NULLIF(COUNT(DISTINCT ct.component_id), 0)
          )::int4                                                              AS avg_views_per_component
        FROM public.tags t
        JOIN public.component_tags ct ON ct.tag_id = t.id
        LEFT JOIN public.mv_component_analytics mca
          ON mca.component_id = ct.component_id
         AND mca.activity_type = 'component_view'
        WHERE NOT EXISTS (
          SELECT 1 FROM public.component_likes cl
          WHERE cl.component_id = ct.component_id
            AND cl.user_id IN (
              'user_2nA0HITg0H7hvozIDNdxvzinpei',
              'user_2nElBLvklOKlAURm6W1PTu6yYFh'
            )
        )
GROUP BY t.id, t.name, t.slug
        HAVING COUNT(DISTINCT ct.component_id) BETWEEN 1 AND 8
        ORDER BY avg_views_per_component DESC
        LIMIT $1`,
        input.limit,
      )
      return rows
    }),

  /**
   * Most popular categories by total views across all their components.
   * Helps authors understand which areas have the most active audience.
   */
  getPopularCategories: publicProcedure
    .input(z.object({ limit: z.number().int().min(1).max(50).default(20) }))
    .query(async ({ ctx, input }) => {
      const rows = await (ctx.prisma as unknown as RawClient).$queryRawUnsafe<PopularCategoryRow[]>(
        `SELECT
          t.id,
          t.name,
          t.slug,
          COUNT(DISTINCT ct.component_id)::int4 AS component_count,
          COALESCE(SUM(mca.count), 0)::int4     AS total_views
        FROM public.tags t
        JOIN public.component_tags ct ON ct.tag_id = t.id
        LEFT JOIN public.mv_component_analytics mca
          ON mca.component_id = ct.component_id
         AND mca.activity_type = 'component_view'
        GROUP BY t.id, t.name, t.slug
        ORDER BY total_views DESC
        LIMIT $1`,
        input.limit,
      )
      return rows
    }),

  /**
   * Tags whose components get the most "Support the author" button clicks.
   * Useful signal: authors in these tags have engaged, supportive audiences.
   */
  getDonationClicksByTag: publicProcedure
    .input(z.object({ limit: z.number().int().min(1).max(30).default(10) }))
    .query(async ({ ctx, input }) => {
      const rows = await (ctx.prisma as unknown as RawClient).$queryRawUnsafe<DonationTagRow[]>(
        `SELECT
          t.id,
          t.name,
          t.slug,
          COUNT(DISTINCT ct.component_id)::int4 AS component_count,
          COUNT(ca.id)::int4                    AS support_clicks
        FROM public.tags t
        JOIN public.component_tags ct ON ct.tag_id = t.id
        JOIN public.component_analytics ca
          ON ca.component_id = ct.component_id
         AND ca.activity_type = 'donation_support_click'
        GROUP BY t.id, t.name, t.slug
        ORDER BY support_clicks DESC
        LIMIT $1`,
        input.limit,
      )
      return rows
    }),

  /**
   * Daily support/donation clicks for a specific author's components.
   * Used to power the Support Clicks chart on the Studio main page.
   */
  getAuthorSupportClicks: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        daysBack: z.number().int().min(7).max(365).default(30),
      }),
    )
    .query(async ({ ctx, input }) => {
      type Row = { date: string; clicks: number }
      const cutoff = daysAgo(input.daysBack)
      const rows = await (ctx.prisma as unknown as RawClient).$queryRawUnsafe<Row[]>(
        `SELECT
          DATE(ca.created_at)::text AS date,
          COUNT(*)::int4            AS clicks
        FROM public.component_analytics ca
        JOIN public.components c ON c.id = ca.component_id
        WHERE c.user_id        = $1
          AND ca.activity_type = 'donation_support_click'
          AND ca.created_at    > $2
        GROUP BY DATE(ca.created_at)
        ORDER BY date ASC`,
        input.userId,
        cutoff,
      )
      return rows
    }),

  /** Record a UI search query (fire-and-forget) */
  recordSearch: publicProcedure
    .input(
      z.object({
        query: z.string().min(1).max(500),
        source: z.enum(["ui", "api"]).default("ui"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await (ctx.prisma as unknown as RawClient).$executeRawUnsafe(
          `INSERT INTO public.search_queries (query, source) VALUES ($1, $2)`,
          input.query,
          input.source,
        )
      } catch {
        // Silently fail if table doesn't exist yet
      }
      return { ok: true }
    }),
})
