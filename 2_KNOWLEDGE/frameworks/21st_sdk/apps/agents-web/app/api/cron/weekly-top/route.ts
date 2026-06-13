import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentISOWeek, getPreviousISOWeek } from "@/lib/utils/week"

export const maxDuration = 60

/**
 * Cron job to record weekly top 3 demos based on views + bookmarks * 5
 * Bookmarks are weighted 5x more than views (stronger engagement signal)
 * Should run at the beginning of each week (e.g., Monday 00:00 UTC)
 * Records the top 3 for the PREVIOUS week
 * 
 * Query params:
 * - week: Specific week to calculate (e.g., "2024-W45"), defaults to previous week
 * - force: If "true", recalculate even if winners already exist (deletes old winners first)
 */
export async function GET(request: NextRequest) {
  const startTime = new Date()
  const cronRunId = `weekly-top-${Date.now()}`

  // Parse query params
  const { searchParams } = new URL(request.url)
  const forceRecalculate = searchParams.get("force") === "true"
  const targetWeek = searchParams.get("week") || getPreviousISOWeek(getCurrentISOWeek())

  // Validate week format (YYYY-WXX)
  if (!/^\d{4}-W\d{2}$/.test(targetWeek)) {
    return NextResponse.json(
      { error: "Invalid week format. Expected YYYY-WXX (e.g., 2024-W45)" },
      { status: 400 },
    )
  }

  try {
    console.log(`🏆 [Weekly Top] Starting weekly top recording...`)
    console.log(`🆔 [Weekly Top] Run ID: ${cronRunId}`)
    console.log(`⏰ [Weekly Top] Start time: ${startTime.toISOString()}`)
    console.log(`📅 [Weekly Top] Target week: ${targetWeek}, force: ${forceRecalculate}`)

    // Check if we already have winners for this week
    const existingWinners = await prisma.weeklyTopDemo.findMany({
      where: { week: targetWeek },
    })

    if (existingWinners.length > 0) {
      if (forceRecalculate) {
        // Delete existing winners to recalculate
        console.log(
          `🔄 [Weekly Top] Force recalculate enabled. Deleting ${existingWinners.length} existing winners for week ${targetWeek}`,
        )
        await prisma.weeklyTopDemo.deleteMany({
          where: { week: targetWeek },
        })
      } else {
        console.log(
          `ℹ️ [Weekly Top] Week ${targetWeek} already has ${existingWinners.length} winners recorded. Use ?force=true to recalculate.`,
        )
        return NextResponse.json({
          message: `Week ${targetWeek} already processed`,
          existingWinners: existingWinners.length,
          hint: "Add ?force=true to recalculate",
        })
      }
    }

    // Parse ISO week to get date range
    const [yearStr, weekStr] = targetWeek.split("-W")
    const year = parseInt(yearStr!, 10)
    const weekNum = parseInt(weekStr!, 10)

    // Calculate the start of the ISO week (Monday)
    const jan4 = new Date(year, 0, 4)
    const jan4DayOfWeek = jan4.getDay() || 7
    const firstMonday = new Date(jan4)
    firstMonday.setDate(jan4.getDate() - jan4DayOfWeek + 1)

    const weekStart = new Date(firstMonday)
    weekStart.setDate(firstMonday.getDate() + (weekNum - 1) * 7)
    weekStart.setHours(0, 0, 0, 0)

    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 7)
    weekEnd.setHours(0, 0, 0, 0)

    console.log(
      `📆 [Weekly Top] Date range: ${weekStart.toISOString()} - ${weekEnd.toISOString()}`,
    )

    // Get top 3 demos for this week using raw SQL (same logic as listByWeek)
    // Bookmarks are weighted 5x more than views (stronger engagement signal)
    const topDemos: Array<{ id: number; score: number }> = await (
      prisma as any
    ).$queryRawUnsafe(
      `SELECT d.id, 
              COALESCE(mca.count, 0) + COALESCE(db.bookmarks_count, 0) * 5 AS score
       FROM demos d
       JOIN components c ON c.id = d.component_id AND c.is_public = true
       LEFT JOIN mv_component_analytics mca ON mca.component_id = c.id AND mca.activity_type = 'component_view'
       LEFT JOIN demo_bookmarks_mv db ON db.demo_id = d.id
       WHERE d.demo_slug = 'default'
         AND d.created_at >= $1
         AND d.created_at < $2
       ORDER BY score DESC, d.created_at DESC
       LIMIT 3`,
      weekStart,
      weekEnd,
    )

    if (topDemos.length === 0) {
      console.log(`ℹ️ [Weekly Top] No demos found for week ${targetWeek}`)
      return NextResponse.json({
        message: `No demos found for week ${targetWeek}`,
      })
    }

    console.log(
      `📊 [Weekly Top] Found ${topDemos.length} top demos for week ${targetWeek}`,
    )

    // Insert the winners
    const insertedWinners = []
    for (let i = 0; i < topDemos.length; i++) {
      const demo = topDemos[i]!
      const prizeTier = i + 1

      try {
        const winner = await prisma.weeklyTopDemo.create({
          data: {
            week: targetWeek,
            demo_id: Number(demo.id),
            prize_tier: prizeTier,
            score: Number(demo.score) || 0,
          },
        })
        insertedWinners.push(winner)
        console.log(
          `🥇 [Weekly Top] Recorded #${prizeTier}: demo ${demo.id} with score ${demo.score}`,
        )
      } catch (err) {
        console.error(
          `❌ [Weekly Top] Failed to insert winner #${prizeTier}:`,
          err,
        )
      }
    }

    const duration = Date.now() - startTime.getTime()
    console.log(
      `✅ [Weekly Top] Completed in ${duration}ms. Recorded ${insertedWinners.length} winners.`,
    )

    return NextResponse.json({
      success: true,
      week: targetWeek,
      winnersRecorded: insertedWinners.length,
      recalculated: forceRecalculate && existingWinners.length > 0,
      winners: insertedWinners.map((w) => ({
        demoId: w.demo_id,
        prizeTier: w.prize_tier,
        score: w.score,
      })),
      duration: `${duration}ms`,
    })
  } catch (error) {
    console.error(`❌ [Weekly Top] Error:`, error)
    return NextResponse.json(
      {
        error: "Failed to record weekly top demos",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

