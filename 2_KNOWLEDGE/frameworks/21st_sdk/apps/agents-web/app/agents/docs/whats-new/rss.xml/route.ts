import {
  getWhatsNewHref,
  WHATS_NEW_ENTRIES,
  WHATS_NEW_OVERVIEW,
} from "@/lib/agents-docs/whats-new"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://21st.dev"

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export async function GET() {
  const items = WHATS_NEW_ENTRIES.map((entry) => {
    const url = `${BASE_URL}${getWhatsNewHref(entry.slug)}`
    const description = `${entry.teaser} ${entry.changes.slice(0, 3).join(" ")}`

    return `
      <item>
        <title>${escapeXml(`${entry.weekLabel} · ${entry.shortDateRange}`)}</title>
        <link>${escapeXml(url)}</link>
        <guid>${escapeXml(url)}</guid>
        <pubDate>${entry.publishedAt.toUTCString()}</pubDate>
        <description>${escapeXml(description)}</description>
      </item>
    `.trim()
  }).join("")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(`21st Agents — ${WHATS_NEW_OVERVIEW.title}`)}</title>
    <link>${escapeXml(`${BASE_URL}${getWhatsNewHref()}`)}</link>
    <description>${escapeXml(WHATS_NEW_OVERVIEW.description)}</description>
    <language>en-us</language>
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
