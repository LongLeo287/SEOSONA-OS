import { Prisma } from "@/prisma/client"
import { getAgentsRequestSession } from "@/lib/agents/auth/server"
import { prisma } from "@/lib/prisma"

type CommunityAgentRow = {
  id: number
  name: string
  slug: string
  description: string | null
  yaml_config: string
  system_prompt: string | null
  model: string
  mcp_server_names: string[] | null
  mcp_servers: unknown
  tool_names: string[] | null
  bookmarks_count: number | null
  icon_url: string | null
  category: string | null
  username: string | null
  display_username: string | null
  display_name: string | null
  user_name: string | null
  image_url: string | null
}

export async function GET(request: Request) {
  const session = await getAgentsRequestSession(request)
  if (!session.internalUserId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const url = new URL(request.url)
  const q = url.searchParams.get("q")?.trim() ?? ""
  const limit = q ? 50 : 100

  try {
    const like = `%${q}%`
    const searchFilter = q
      ? Prisma.sql`
          AND (
            ra.name ILIKE ${like}
            OR COALESCE(ra.description, '') ILIKE ${like}
            OR COALESCE(ra.category, '') ILIKE ${like}
            OR EXISTS (
              SELECT 1
              FROM unnest(ra.mcp_server_names) AS mcp_name
              WHERE mcp_name = ${q.toLowerCase()}
            )
          )
        `
      : Prisma.empty

    const orderBy = q
      ? Prisma.sql`ORDER BY ra.bookmarks_count DESC, ra.id DESC`
      : Prisma.sql`ORDER BY ra.downloads_count DESC, ra.id DESC`

    const rows = await prisma.$queryRaw<CommunityAgentRow[]>(Prisma.sql`
      SELECT
        ra.id,
        ra.name,
        ra.slug,
        ra.description,
        ra.yaml_config,
        ra.system_prompt,
        ra.model,
        ra.mcp_server_names,
        ra.mcp_servers,
        ra.tool_names,
        ra.bookmarks_count,
        ra.icon_url,
        ra.category,
        u.username,
        u.display_username,
        u.display_name,
        u.name AS user_name,
        u.image_url
      FROM registry_agents ra
      LEFT JOIN users u ON u.id = ra.user_id
      WHERE ra.is_public = true
        AND ra.published_at IS NOT NULL
        ${searchFilter}
      ${orderBy}
      LIMIT ${limit}
    `)

    return Response.json({
      items: rows.map((row) => ({
        id: row.id,
        name: row.name,
        slug: row.slug,
        description: row.description,
        yaml_config: row.yaml_config,
        system_prompt: row.system_prompt,
        model: row.model,
        mcp_server_names: row.mcp_server_names ?? [],
        mcp_servers: row.mcp_servers ?? [],
        tool_names: row.tool_names ?? [],
        bookmarks_count: Number(row.bookmarks_count ?? 0),
        icon_url: row.icon_url,
        category: row.category,
        user: {
          username: row.username,
          display_username: row.display_username,
          display_name: row.display_name,
          name: row.user_name,
          image_url: row.image_url,
        },
      })),
    })
  } catch (error) {
    console.error("[studio/community-agents] Failed to load community agents", error)
    return Response.json({ items: [] })
  }
}
