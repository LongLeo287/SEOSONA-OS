import { agent, tool } from "@21st-sdk/agent"
import { z } from "zod"

const wiki_search = tool({
  description:
    "Search Wikipedia for a topic. Returns the top matching article titles and snippets.",
  inputSchema: z.object({
    query: z.string().describe("The topic to search for"),
    limit: z.number().int().min(1).max(10).default(5).describe("Max results (1-10)"),
  }),
  execute: async ({ query, limit }) => {
    const url = new URL("https://en.wikipedia.org/w/api.php")
    url.searchParams.set("action", "query")
    url.searchParams.set("list", "search")
    url.searchParams.set("format", "json")
    url.searchParams.set("origin", "*")
    url.searchParams.set("srsearch", query)
    url.searchParams.set("srlimit", String(limit))
    const res = await fetch(url.toString())
    if (!res.ok) {
      return {
        content: [{ type: "text" as const, text: `Search failed: ${res.status}` }],
        isError: true,
      }
    }
    const data = (await res.json()) as {
      query?: { search?: Array<{ title: string; snippet: string }> }
    }
    const hits = data.query?.search ?? []
    if (hits.length === 0) {
      return { content: [{ type: "text" as const, text: `No results for "${query}".` }] }
    }
    const text = hits
      .map(
        (h, i) =>
          `${i + 1}. ${h.title}\n   ${h.snippet.replace(/<[^>]+>/g, "").slice(0, 200)}`,
      )
      .join("\n\n")
    return { content: [{ type: "text" as const, text }] }
  },
})

const wiki_article = tool({
  description: "Fetch the plain-text extract of a specific Wikipedia article by exact title.",
  inputSchema: z.object({
    title: z.string().describe("Exact Wikipedia article title"),
  }),
  execute: async ({ title }) => {
    const url = new URL("https://en.wikipedia.org/w/api.php")
    url.searchParams.set("action", "query")
    url.searchParams.set("prop", "extracts")
    url.searchParams.set("explaintext", "1")
    url.searchParams.set("exsectionformat", "plain")
    url.searchParams.set("format", "json")
    url.searchParams.set("origin", "*")
    url.searchParams.set("titles", title)
    const res = await fetch(url.toString())
    if (!res.ok) {
      return {
        content: [{ type: "text" as const, text: `Fetch failed: ${res.status}` }],
        isError: true,
      }
    }
    const data = (await res.json()) as {
      query?: { pages?: Record<string, { extract?: string; title?: string }> }
    }
    const pages = data.query?.pages ?? {}
    const first = Object.values(pages)[0]
    const extract = first?.extract ?? ""
    if (!extract) {
      return {
        content: [{ type: "text" as const, text: `No article found for "${title}".` }],
        isError: true,
      }
    }
    return {
      content: [{ type: "text" as const, text: extract.slice(0, 4000) }],
    }
  },
})

export default agent({
  model: "claude-sonnet-4-6",
  systemPrompt: [
    "You are a research assistant. When the user asks about a topic, use wiki_search to find relevant articles, then wiki_article to pull content from the most promising result.",
    "Cite the article titles you used. Keep answers grounded in what you read — if the tools don't return useful results, say so honestly.",
  ].join("\n\n"),
  maxTurns: 15,
  tools: { wiki_search, wiki_article },
})
