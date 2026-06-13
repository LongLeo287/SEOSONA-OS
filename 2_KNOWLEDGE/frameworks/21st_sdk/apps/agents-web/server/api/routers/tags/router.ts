import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"

export const tagsRouter = createTRPCRouter({
  // Get all tags without limit (for backward compatibility)
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      console.log(`[tRPC] Getting all tags`)

      const tags = await ctx.prisma.tag.findMany({
        orderBy: { name: "asc" },
        // Remove any implicit limits by not setting take
      })

      console.log(`[tRPC] Returning ${tags.length} tags`)
      return tags
    } catch (error) {
      console.error(`[tRPC] Error getting all tags:`, error)
      throw new Error(
        `Failed to get tags: ${error instanceof Error ? error.message : "Unknown error"}`,
      )
    }
  }),
})
