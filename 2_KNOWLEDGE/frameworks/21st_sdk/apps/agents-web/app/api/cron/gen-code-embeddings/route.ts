import { EmbeddingService } from "@/server/api/routers/semantic-chunk-search/services/embedding.service"
import { NextRequest, NextResponse } from "next/server"

export const maxDuration = 600

export async function GET(req: NextRequest): Promise<NextResponse> {
  const authHeader = req.headers.get("Authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  console.log("[ReembedChunks] Starting re-embedding for code_chunks with NULL embedding")

  let totalProcessed = 0
  let totalErrors = 0
  let batch = 0

  for (;;) {
    batch += 1
    console.log(`[ReembedChunks] Processing batch ${batch}...`)

    const res = await EmbeddingService.generateEmbeddings({})
    console.log(
      `[ReembedChunks] Batch ${batch} → processed=${res.processedCount}, errors=${res.errorCount}, time=${res.totalTime}ms`,
    )

    totalProcessed += res.processedCount
    totalErrors += res.errorCount

    if (res.processedCount === 0) {
      break
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  console.log(`[ReembedChunks] Completed. Total processed: ${totalProcessed}`)

  return NextResponse.json({
    totalProcessed,
    totalErrors,
    batches: batch,
  })
}
