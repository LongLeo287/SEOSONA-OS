import { MetadataRoute } from "next"

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://21st.dev"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/app/"],
      },
      {
        userAgent: "GPTBot",
        allow: ["/agents/docs/"],
        disallow: ["/api/", "/app/"],
      },
      {
        userAgent: "ClaudeBot",
        allow: ["/agents/docs/"],
        disallow: ["/api/", "/app/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: ["/agents/docs/"],
        disallow: ["/api/", "/app/"],
      },
    ],
    sitemap: `${BASE_URL}/agents/sitemap.xml`,
  }
}
