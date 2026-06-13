import { MetadataRoute } from "next"
import { supabaseWithAdminAccess } from "@/lib/supabase"
import { TAGS_DATA } from "@/lib/tags-data"
import { getWeeksSinceOctober2024 } from "@/lib/utils/week"

async function fetchAllRows<T>(
  queryFn: () => any,
  pageSize = 1000,
): Promise<T[]> {
  const allRows: T[] = []
  let offset = 0
  let hasMore = true

  while (hasMore) {
    const { data, error } = await queryFn().range(offset, offset + pageSize - 1)
    if (error || !data) break
    allRows.push(...(data as T[]))
    hasMore = data.length === pageSize
    offset += pageSize
  }

  return allRows
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://21st.dev"

  const [allDemos, themes] = await Promise.all([
    // All demos for public components (paginated)
    fetchAllRows<{
      demo_slug: string
      updated_at: string
      components: {
        component_slug: string
        users: { username: string } | null
      } | null
    }>(() =>
      supabaseWithAdminAccess
        .from("demos")
        .select(
          "demo_slug, updated_at, components!inner(component_slug, users!components_user_id_fkey(username))",
        )
        .eq("components.is_public", true)
        .order("updated_at", { ascending: false }),
    ),

    // Public themes
    supabaseWithAdminAccess
      .from("style_profiles")
      .select("id, updated_at")
      .eq("is_public", true)
      .eq("status", "completed")
      .not("css", "is", null)
      .order("updated_at", { ascending: false })
      .then((res) => res.data || []),

  ])

  // Static pages
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/community/components`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/community/components/popular`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/community/components/newest`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/community/components/featured`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/community/components/week`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/community/themes`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ]

  // Demo pages — every public demo gets its own URL
  // Default demos: /community/components/user/slug
  // Non-default demos: /community/components/user/slug/demo-slug
  const validDemos = allDemos.filter(
    (d) => d.components?.users?.username && d.components?.component_slug,
  )
  const demoUrls: MetadataRoute.Sitemap = validDemos.map((demo) => {
    const username = demo.components!.users!.username
    const componentSlug = demo.components!.component_slug
    const isDefault = demo.demo_slug === "default"
    return {
      url: isDefault
        ? `${baseUrl}/community/components/${username}/${componentSlug}`
        : `${baseUrl}/community/components/${username}/${componentSlug}/${demo.demo_slug}`,
      lastModified: demo.updated_at,
      changeFrequency: "weekly" as const,
      priority: isDefault ? 0.8 : 0.7,
    }
  })

  // Tag pages from static data (filtered by count >= 3, priority by count)
  const tagUrls: MetadataRoute.Sitemap = TAGS_DATA.filter(
    (tag) => tag.count >= 3,
  ).map((tag) => ({
    url: `${baseUrl}/community/components/s/${tag.slug}`,
    changeFrequency: "weekly" as const,
    priority: tag.count >= 50 ? 0.8 : tag.count >= 20 ? 0.7 : 0.6,
  }))

  // User profile pages — only users who have at least one public demo
  const userMap = new Map<string, string>()
  for (const d of validDemos) {
    const username = d.components?.users?.username
    if (username && !userMap.has(username)) {
      userMap.set(username, d.updated_at)
    }
  }
  const userUrls: MetadataRoute.Sitemap = Array.from(userMap.entries()).map(
    ([username, updated_at]) => ({
      url: `${baseUrl}/community/${username}`,
      lastModified: updated_at,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }),
  )

  // Theme pages (route uses community-{id} format)
  const themeUrls: MetadataRoute.Sitemap = themes.map((theme) => ({
    url: `${baseUrl}/community/themes/community-${theme.id}`,
    lastModified: theme.updated_at ?? undefined,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))

  // Weekly best pages (all weeks since October 2024)
  const allWeeks = getWeeksSinceOctober2024()
  const weekUrls: MetadataRoute.Sitemap = allWeeks.map((week) => ({
    url: `${baseUrl}/community/components/week/${week}`,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }))

  return [
    ...staticUrls,
    ...demoUrls,
    ...tagUrls,
    ...userUrls,
    ...themeUrls,
    ...weekUrls,
  ]
}
