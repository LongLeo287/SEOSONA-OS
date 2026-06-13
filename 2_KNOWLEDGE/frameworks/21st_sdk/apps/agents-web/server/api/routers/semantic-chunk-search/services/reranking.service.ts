interface RerankResult {
  index: number
  document: {
    text: string
  }
  relevance_score: number
}

interface RerankResponse {
  id: string
  model: string
  usage: {
    total_tokens: number
  }
  results: RerankResult[]
}

export class RerankingService {
  /**
   * Rerank search results using Morph Rerank API
   */
  // Filter tags for reranking (more permissive than embeddings)
  private static filterTagsForReranking(tags: any): string[] {
    if (!Array.isArray(tags)) return []

    // Only filter out navigation.ts categories (too generic for any search)
    const NAVIGATION_CATEGORIES = new Set([
      // UI components from navigation.ts
      "accordions",
      "accordion",
      "alerts",
      "alert",
      "avatars",
      "avatar",
      "badges",
      "badge",
      "buttons",
      "button",
      "calendars",
      "calendar",
      "carousels",
      "carousel",
      "checkboxes",
      "checkbox",
      "date pickers",
      "dialogs",
      "dialog",
      "modals",
      "modal",
      "dropdowns",
      "dropdown",
      "forms",
      "form",
      "icons",
      "icon",
      "inputs",
      "input",
      "links",
      "link",
      "menus",
      "menu",
      "notifications",
      "notification",
      "numbers",
      "number",
      "paginations",
      "pagination",
      "popovers",
      "popover",
      "selects",
      "select",
      "sliders",
      "slider",
      "tables",
      "table",
      "tabs",
      "tab",
      "toasts",
      "toast",
      "toggles",
      "toggle",
      "tooltips",
      "tooltip",

      // Marketing blocks from navigation.ts
      "announcements",
      "backgrounds",
      "background",
      "borders",
      "border",
      "clients",
      "client",
      "comparisons",
      "comparison",
      "docks",
      "dock",
      "features",
      "feature",
      "footers",
      "footer",
      "heroes",
      "hero",
      "hooks",
      "hook",
      "images",
      "image",
      "maps",
      "map",
      "navigation",
      "pricing sections",
      "pricing",
      "testimonials",
      "testimonial",
      "texts",
      "text",
      "videos",
      "video",
    ])

    // For reranking, keep ALL specific tags (no 3-tag limit)
    // Only remove navigation.ts generic categories
    return tags.filter((tag) => !NAVIGATION_CATEGORIES.has(tag.toLowerCase()))
  }

  // Build enhanced text for reranking with symbols
  private static buildEnhancedText(candidate: any): string {
    const MAX_DOC_CHARS = 3500
    const code = candidate.chunkText || candidate.chunk_text || ""
    const metadata = []

    // Add component name
    if (candidate.component_name || candidate.componentName) {
      const name = candidate.component_name || candidate.componentName
      metadata.push(`Component: ${name}`)
    }

    // Add demo name (if not default)
    if (
      candidate.demo_name &&
      !candidate.demo_name.toLowerCase().includes("default")
    ) {
      metadata.push(`Demo: ${candidate.demo_name}`)
    }

    // Add primary symbols (functions/classes) - helps distinguish implementation
    if (
      candidate.symbols &&
      Array.isArray(candidate.symbols) &&
      candidate.symbols.length > 0
    ) {
      const mainSymbols = candidate.symbols.slice(0, 3)
      metadata.push(`Functions: ${mainSymbols.join(", ")}`)
    }

    // Add filtered tags
    const tags = candidate.tags || []
    const filteredTags = this.filterTagsForReranking(tags)
    if (filteredTags.length > 0) {
      metadata.push(`Tags: ${filteredTags.join(", ")}`)
    }

    // Build final document with header + sliced code
    const header = metadata.length > 0 ? `// ${metadata.join(" | ")}` : ""
    const remaining = Math.max(0, MAX_DOC_CHARS - header.length - 2)
    const body = code.slice(0, remaining)
    return header ? `${header}\n\n${body}` : body
  }

  static async rerankResults(
    query: string,
    candidates: any[],
    topN = 5,
  ): Promise<any[]> {
    if (!process.env.MORPH_API_KEY) {
      throw new Error("MORPH_API_KEY environment variable is required")
    }

    if (candidates.length === 0) {
      return []
    }

    try {
      // v2 with minimal function-focused metadata
      const funcDocs = candidates.map((c) => {
        const code = c.chunkText || c.chunk_text || ""

        // Only add main function name if available
        let header = ""
        if (c.symbols && Array.isArray(c.symbols) && c.symbols.length > 0) {
          header = `// Main function: ${c.symbols[0]}\n\n`
        }

        return header + code.slice(0, 1500)
      })

      const requestBody = {
        model: "morph-rerank-v2", // v2 is better for code!
        query: query,
        documents: funcDocs, // Pure code + function name
        top_n: Math.min(15, candidates.length), // Good balance
      }

      const response = await fetch("https://api.morphllm.com/v1/rerank", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.MORPH_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Rerank API error: ${response.status} - ${errorText}`)
      }

      const rerankedData: RerankResponse = await response.json()

      // Map reranked results back to original candidates
      const rerankedResults = rerankedData.results.map((result) => ({
        ...candidates[result.index],
        relevance_score: result.relevance_score,
        reranked: true,
        original_similarity: candidates[result.index].similarity,
      }))

      // Note: Simple demo filtering is now done before reranking in search-code-chunks.ts
      return rerankedResults
    } catch (error) {
      console.error("Reranking failed:", error)
      // Fallback to original results if reranking fails
      return candidates.slice(0, topN)
    }
  }

  /**
   * Enhanced search pipeline with reranking
   */
  static async enhancedSemanticSearch(
    query: string,
    options: {
      limit?: number
      codeType?: string
      includeHooks?: boolean
      fileFilter?: string
      useReranking?: boolean
    } = {},
  ) {
    const {
      limit = 10,
      codeType,
      includeHooks,
      fileFilter,
      useReranking = true,
    } = options

    const startTime = Date.now()

    try {
      // Import here to avoid circular dependencies
      const { EmbeddingService } = await import("./embedding.service")
      const { prisma } = await import("@/lib/prisma")

      // 1. Generate query embedding
      const embeddingStartTime = Date.now()
      const queryEmbedding =
        await EmbeddingService.generateQueryEmbedding(query)
      const embeddingTime = Date.now() - embeddingStartTime

      // 2. Vector search (get more candidates for reranking)
      const vectorSearchStartTime = Date.now()
      const candidateCount = useReranking ? Math.max(limit * 3, 20) : limit

      // Simplified vector search without complex filtering
      let searchResults: any[]

      if (codeType || fileFilter || includeHooks !== undefined) {
        // Use the search function for filtering
        searchResults = (await prisma.$queryRaw`
          SELECT * FROM search_code_chunks(
            ${JSON.stringify(queryEmbedding)}::vector(2560),
            0.0::float,
            ${candidateCount}::int,
            ${codeType}::varchar,
            ${fileFilter}::varchar,
            ${includeHooks}::boolean
          )
        `) as any[]
      } else {
        // Direct query without filters
        searchResults = (await prisma.$queryRaw`
          SELECT
            id,
            component_id,
            demo_id,
            chunk_text,
            code_type,
            component_name,
            file_path,
            symbols,
            imports,
            uses_hooks,
            has_jsx,
            contains_api,
            complexity_score,
            1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector(2560)) as similarity
          FROM code_chunks
          WHERE embedding IS NOT NULL
          ORDER BY embedding <=> ${JSON.stringify(queryEmbedding)}::vector(2560)
          LIMIT ${candidateCount}
        `) as any[]
      }

      const vectorSearchTime = Date.now() - vectorSearchStartTime

      if (searchResults.length === 0) {
        return {
          query,
          results: [],
          metadata: {
            searchTime: Date.now() - startTime,
            embeddingTime,
            vectorSearchTime,
            rerankingTime: 0,
            totalCandidates: 0,
            reranked: false,
          },
        }
      }

      // 3. Reranking (if enabled)
      let finalResults = searchResults
      let rerankingTime = 0

      if (useReranking && searchResults.length > 1) {
        const rerankingStartTime = Date.now()
        // Provide a wider funnel to reranking (at least 20, up to 30)
        const rerankTop = Math.min(Math.max(limit * 2, 20), 30)
        const reranked = await this.rerankResults(
          query,
          searchResults,
          rerankTop,
        )
        finalResults = reranked.slice(0, limit)
        rerankingTime = Date.now() - rerankingStartTime
      } else {
        finalResults = searchResults.slice(0, limit)
      }

      // 4. Format results
      const formattedResults = finalResults.map((result) => ({
        id: result.id,
        componentId: result.component_id,
        componentName: result.component_name,
        codeType: result.code_type,
        filePath: result.file_path,
        chunkText: result.chunk_text,
        similarity: parseFloat(result.similarity || 0),
        relevanceScore: result.relevance_score || null,
        symbols: result.symbols,
        usesHooks: result.uses_hooks,
        hasJsx: result.has_jsx,
        reranked: result.reranked || false,
      }))

      return {
        query,
        results: formattedResults,
        metadata: {
          searchTime: Date.now() - startTime,
          embeddingTime,
          vectorSearchTime,
          rerankingTime,
          totalCandidates: searchResults.length,
          reranked: useReranking && searchResults.length > 1,
          avgSimilarity:
            formattedResults.length > 0
              ? formattedResults.reduce((sum, r) => sum + r.similarity, 0) /
                formattedResults.length
              : 0,
        },
      }
    } catch (error) {
      return {
        query,
        results: [],
        metadata: {
          searchTime: Date.now() - startTime,
          embeddingTime: 0,
          vectorSearchTime: 0,
          rerankingTime: 0,
          totalCandidates: 0,
          reranked: false,
          error: error instanceof Error ? error.message : "Unknown error",
        },
      }
    }
  }
}
