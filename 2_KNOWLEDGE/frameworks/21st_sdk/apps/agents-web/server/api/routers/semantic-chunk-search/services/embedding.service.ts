import { prisma } from "@/lib/prisma"
import { openrouterClient } from "@/lib/server/ai-latest"
import { truncateText } from "@/lib/utils"

export const CODE_EMBEDDING_DIM = 2560
export const CODE_EMBEDDING_MODEL = "qwen/qwen3-embedding-4b"
export const MAX_EMBEDDING_TEXT_LENGTH = 40000

interface EmbeddingOptions {
  chunkIds?: string[]
  componentIds?: number[]
  batchSize?: number
}

export interface EmbeddingResult {
  processedCount: number
  errorCount: number
  totalTime: number
  errors: string[]
}

export class EmbeddingService {
  /**
   * Generate embeddings for code chunks
   */
  static async generateEmbeddings(
    options: EmbeddingOptions,
  ): Promise<EmbeddingResult> {
    const { chunkIds, componentIds, batchSize = 20 } = options
    const startTime = Date.now()
    let processedCount = 0
    let errorCount = 0
    const errors: string[] = []

    try {
      // Get chunks to process using raw SQL (due to vector field limitations)
      let chunks: any[]

      if (chunkIds) {
        chunks = await prisma.$queryRaw`
          SELECT 
            cc.id, 
            cc.chunk_text, 
            cc.component_id, 
            cc.code_type, 
            cc.tags,
            cc.component_name,
            d.name as demo_name
          FROM code_chunks cc
          LEFT JOIN demos d ON cc.demo_id = d.id
          WHERE cc.id = ANY(${chunkIds}::uuid[])
          AND cc.embedding IS NULL
        `
      } else if (componentIds) {
        chunks = await prisma.$queryRaw`
          SELECT 
            cc.id, 
            cc.chunk_text, 
            cc.component_id, 
            cc.code_type, 
            cc.tags,
            cc.component_name,
            d.name as demo_name
          FROM code_chunks cc
          LEFT JOIN demos d ON cc.demo_id = d.id
          WHERE cc.component_id = ANY(${componentIds}::int[])
          AND cc.embedding IS NULL
        `
      } else {
        chunks = await prisma.$queryRaw`
          SELECT 
            cc.id, 
            cc.chunk_text, 
            cc.component_id, 
            cc.code_type, 
            cc.tags,
            cc.component_name,
            d.name as demo_name
          FROM code_chunks cc
          LEFT JOIN demos d ON cc.demo_id = d.id
          WHERE cc.embedding IS NULL
          LIMIT 100
        `
      }

      if (!Array.isArray(chunks) || chunks.length === 0) {
        return {
          processedCount: 0,
          errorCount: 0,
          totalTime: Date.now() - startTime,
          errors: ["No chunks found to process"],
        }
      }

      // Process in batches
      for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, i + batchSize)

        try {
          await this.processBatch(batch)
          processedCount += batch.length
        } catch (error) {
          errorCount += batch.length
          const errorMsg = `Batch ${Math.floor(i / batchSize) + 1} failed: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
          errors.push(errorMsg)
          console.error(errorMsg)
        }

        // Small delay between batches to respect rate limits
        if (i + batchSize < chunks.length) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }
      }

      return {
        processedCount,
        errorCount,
        totalTime: Date.now() - startTime,
        errors,
      }
    } catch (error) {
      return {
        processedCount,
        errorCount,
        totalTime: Date.now() - startTime,
        errors: [error instanceof Error ? error.message : "Unknown error"],
      }
    }
  }

  /**
   * Process a batch of chunks
   */
  private static async processBatch(chunks: any[]): Promise<void> {
    // Common/generic tags to filter out (includes navigation.ts categories)
    const GENERIC_TAGS = new Set([
      // Navigation.ts UI categories (too generic)
      "accordions",
      "accordion",
      "alerts",
      "alert",
      "alert dialog",
      "avatars",
      "avatar",
      "badges",
      "badge",
      "buttons",
      "button",
      "calendars",
      "calendar",
      "cards",
      "card",
      "carousels",
      "carousel",
      "checkboxes",
      "checkbox",
      "date pickers",
      "date picker",
      "dialogs",
      "dialog",
      "modals",
      "modal",
      "dropdowns",
      "dropdown",
      "empty states",
      "empty state",
      "file trees",
      "file tree",
      "file uploads",
      "file upload",
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
      "radio groups",
      "radio group",
      "sidebars",
      "sidebar",
      "sign ins",
      "sign in",
      "sign ups",
      "sign up",
      "selects",
      "select",
      "sliders",
      "slider",
      "spinner loaders",
      "spinner loader",
      "spinner",
      "tables",
      "table",
      "tags",
      "tag",
      "tabs",
      "tab",
      "text areas",
      "text area",
      "textarea",
      "toasts",
      "toast",
      "toggles",
      "toggle",
      "tooltips",
      "tooltip",

      // Marketing blocks (also generic)
      "announcements",
      "backgrounds",
      "background",
      "borders",
      "border",
      "calls to action",
      "call to action",
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
      "navigation menus",
      "navigation",
      "pricing sections",
      "pricing",
      "scroll areas",
      "scroll area",
      "testimonials",
      "testimonial",
      "texts",
      "text",
      "videos",
      "video",
    ])

    // Filter and limit tags to most relevant ones
    const filterTags = (tags: string[]): string[] => {
      if (!Array.isArray(tags)) return []

      return tags
        .filter((tag) => !GENERIC_TAGS.has(tag.toLowerCase()))
        .slice(0, 3) // Maximum 3 tags
    }

    // Prepare texts for embedding with optimized metadata
    const texts = chunks.map((chunk) => {
      let text = chunk.chunk_text
      const metadata = []

      // Add component name with emphasis (double weight)
      if (chunk.component_name) {
        metadata.push(`Component: ${chunk.component_name}`)
        metadata.push(`Name: ${chunk.component_name}`) // Double reference for weight
      }

      // Add demo name (only if NOT "default")
      if (
        chunk.demo_name &&
        !chunk.demo_name.toLowerCase().includes("default")
      ) {
        metadata.push(`Demo: ${chunk.demo_name}`)
      }

      // Add filtered tags (max 3, no generic ones)
      const filteredTags = filterTags(chunk.tags)
      if (filteredTags.length > 0) {
        metadata.push(`Tags: ${filteredTags.join(", ")}`)
      }

      // Append metadata to text for better embeddings
      if (metadata.length > 0) {
        text = `${text}\n\n// ${metadata.join(" | ")}`
      }

      return text
    })
    const chunkIds = chunks.map((chunk) => chunk.id)

    const embeddings = await this.createEmbeddings(texts)

    // Save all embeddings in a single transaction
    await prisma.$transaction(
      chunks.map(
        (_, i) =>
          prisma.$executeRaw`
          UPDATE code_chunks
          SET embedding = ${JSON.stringify(embeddings[i])}::vector(2560)
          WHERE id = ${chunkIds[i]}::uuid
        `,
      ),
    )
  }

  /**
   * Generate embedding for a single query
   */
  static async generateQueryEmbedding(query: string): Promise<number[]> {
    const embeddings = await this.createEmbeddings(query)

    return embeddings[0]
  }

  /**
   * Get embedding statistics
   */
  static async getEmbeddingStats() {
    const stats = await prisma.$queryRaw`
      SELECT 
        COUNT(*) as total_chunks,
        COUNT(embedding) as embedded_chunks,
        COUNT(*) - COUNT(embedding) as pending_chunks,
        COUNT(DISTINCT component_id) as components_with_chunks
      FROM code_chunks
    `

    return Array.isArray(stats) ? stats[0] : null
  }

  /**
   * Shared embedding creation helper
   */
  private static async createEmbeddings(
    input: string | string[],
  ): Promise<number[][]> {
    // Truncate input to max length to avoid API errors
    const truncatedInput = Array.isArray(input)
      ? input.map((text) => truncateText(text, MAX_EMBEDDING_TEXT_LENGTH))
      : truncateText(input, MAX_EMBEDDING_TEXT_LENGTH)

    const response = await openrouterClient.embeddings.create({
      model: CODE_EMBEDDING_MODEL,
      input: truncatedInput,
      encoding_format: "float",
    })

    const embeddings = response.data?.map((item) => item.embedding) || []

    if (embeddings.length === 0) {
      throw new Error(
        `Embedding API returned no data: ${JSON.stringify(response, null, 2)}`,
      )
    }

    return embeddings
  }
}
