import { NextRequest, NextResponse, after } from "next/server"
import { prisma } from "@/lib/prisma"
import { codesandboxSdk } from "@/lib/codesandbox-sdk-v1"
import { redis } from "@/lib/redis"
import { Prisma } from "@/prisma/client"

export const maxDuration = 300 // 5 minutes

const BATCH_SIZE = 50
const DELAY_BETWEEN_BATCHES_MS = 200
const CRON_SECRET = process.env.CRON_SECRET
const HIBERNATE_DELAY_MS = 30_000 // Wait 30s before hibernating

// Redis key prefix and TTL for tracking sandbox pings
const REDIS_KEY_PREFIX = "sandbox:ping:"
const PING_TTL_SECONDS = 20 * 60 * 60 // 20 hours
const SKIP_IF_PINGED_WITHIN_MS = 20 * 60 * 60 * 1000 // 20 hours

type SandboxRecord = {
  sandboxId: string
  source: "canvas" | "team_github"
  sourceId: string
}

// Only keep alive sandboxes created after this date
const KEEPALIVE_CUTOFF_DATE = new Date("2025-11-20T00:00:00Z")

async function collectAllSandboxes(): Promise<SandboxRecord[]> {
  const sandboxes: SandboxRecord[] = []

  // 1. Canvas variants (MagicChat) - only from canvas feature
  // Canvas chats are identified by: project has canvas_snapshot OR chat has subChats
  // Only include chats created after the cutoff date
  const canvasChats = await prisma.magicChat.findMany({
    where: {
      sandbox_id: { not: null },
      deleted_at: null,
      created_at: { gte: KEEPALIVE_CUTOFF_DATE },
      OR: [
        // Project has canvas_snapshot (is a canvas project)
        {
          project: {
            canvas_snapshot: { not: Prisma.DbNull },
          },
        },
        // Chat has subChats (only exists in canvas)
        { subChats: { some: {} } },
      ],
    },
    select: { id: true, sandbox_id: true },
  })
  canvasChats.forEach((c) => {
    if (c.sandbox_id) {
      sandboxes.push({
        sandboxId: c.sandbox_id,
        source: "canvas",
        sourceId: c.id,
      })
    }
  })

  // 2. Team GitHub sandboxes (created after cutoff date)
  const teams = await prisma.team.findMany({
    where: {
      github_sandbox_id: { not: null },
      created_at: { gte: KEEPALIVE_CUTOFF_DATE },
    },
    select: { id: true, github_sandbox_id: true },
  })
  teams.forEach((t) => {
    if (t.github_sandbox_id) {
      sandboxes.push({
        sandboxId: t.github_sandbox_id,
        source: "team_github",
        sourceId: t.id,
      })
    }
  })

  // Deduplicate by sandboxId
  const seen = new Set<string>()
  return sandboxes.filter((s) => {
    if (seen.has(s.sandboxId)) return false
    seen.add(s.sandboxId)
    return true
  })
}

export async function GET(request: NextRequest) {
  // TODO: Re-enable auth check before deploying
  // const authHeader = request.headers.get("Authorization")
  // if (authHeader !== `Bearer ${CRON_SECRET}`) {
  //   const userAgent = request.headers.get("User-Agent") || ""
  //   // Allow Vercel cron calls
  //   if (!userAgent.includes("vercel-cron")) {
  //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  //   }
  // }

  const startTime = Date.now()
  const searchParams = request.nextUrl.searchParams
  const dryRun = searchParams.get("dryRun") === "true"

  console.log(`[sandbox-keepalive] Starting${dryRun ? " (DRY RUN)" : ""}...`)

  try {
    const sandboxes = await collectAllSandboxes()

    console.log(`[sandbox-keepalive] Found ${sandboxes.length} sandboxes`)

    if (sandboxes.length === 0) {
      return NextResponse.json({ message: "No sandboxes to ping", total: 0 })
    }

    // Dry run: just return what we would ping
    if (dryRun) {
      return NextResponse.json({
        message: "Dry run - no sandboxes pinged",
        total: sandboxes.length,
        sandboxes: sandboxes.map((s) => ({
          sandboxId: s.sandboxId,
          source: s.source,
        })),
      })
    }

    let success = 0
    let failed = 0
    let skipped = 0
    const errors: { sandboxId: string; source: string; error: string }[] = []
    const bySource = { canvas: 0, team_github: 0 }

    // Check Redis for recently pinged sandboxes (batch lookup)
    const redisKeys = sandboxes.map((s) => `${REDIS_KEY_PREFIX}${s.sandboxId}`)
    const lastPingTimes = await redis.mget<(number | null)[]>(...redisKeys)

    // Filter out recently pinged sandboxes
    const now = Date.now()
    const sandboxesToPing: SandboxRecord[] = []

    sandboxes.forEach((sandbox, index) => {
      const lastPing = lastPingTimes[index]
      if (lastPing && now - lastPing < SKIP_IF_PINGED_WITHIN_MS) {
        skipped++
      } else {
        sandboxesToPing.push(sandbox)
      }
    })

    if (skipped > 0) {
      console.log(
        `[sandbox-keepalive] Skipping ${skipped} recently pinged sandboxes`,
      )
    }

    // Track successfully resumed sandboxes for hibernation
    const resumedSandboxIds: string[] = []

    // Process sandboxes that need pinging in batches
    for (let i = 0; i < sandboxesToPing.length; i += BATCH_SIZE) {
      const batch = sandboxesToPing.slice(i, i + BATCH_SIZE)

      await Promise.all(
        batch.map(async (record) => {
          try {
            const sandbox = await codesandboxSdk.sandboxes.resume(
              record.sandboxId,
            )

            // Store successful ping in Redis with TTL
            await redis.set(`${REDIS_KEY_PREFIX}${record.sandboxId}`, now, {
              ex: PING_TTL_SECONDS,
            })

            resumedSandboxIds.push(record.sandboxId)
            success++
            bySource[record.source]++
            const bootType = sandbox.bootupType
            console.log(
              `[sandbox-keepalive] RESUMED: ${record.sandboxId} (${record.source}) bootType=${bootType}`,
            )
          } catch (err) {
            failed++
            const errorMsg = err instanceof Error ? err.message : "Unknown"
            errors.push({
              sandboxId: record.sandboxId,
              source: record.source,
              error: errorMsg,
            })
            console.log(
              `[sandbox-keepalive] FAIL: ${record.sandboxId} - ${errorMsg}`,
            )
          }
        }),
      )

      // Delay between batches
      if (i + BATCH_SIZE < sandboxesToPing.length) {
        await new Promise((r) => setTimeout(r, DELAY_BETWEEN_BATCHES_MS))
      }
    }

    // Schedule hibernation after response is sent (runs in background)
    if (resumedSandboxIds.length > 0) {
      after(async () => {
        console.log(
          `[sandbox-keepalive] Waiting ${HIBERNATE_DELAY_MS / 1_000}s before hibernating ${resumedSandboxIds.length} sandboxes...`,
        )
        await new Promise((r) => setTimeout(r, HIBERNATE_DELAY_MS))

        console.log(`[sandbox-keepalive] Hibernating sandboxes...`)
        let hibernated = 0
        let hibernateFailed = 0

        // Hibernate in batches
        for (let i = 0; i < resumedSandboxIds.length; i += BATCH_SIZE) {
          const batch = resumedSandboxIds.slice(i, i + BATCH_SIZE)

          await Promise.all(
            batch.map(async (sandboxId) => {
              try {
                await codesandboxSdk.sandboxes.hibernate(sandboxId)
                hibernated++
              } catch (err) {
                hibernateFailed++
                const errorMsg = err instanceof Error ? err.message : "Unknown"
                console.log(
                  `[sandbox-keepalive] HIBERNATE FAIL: ${sandboxId} - ${errorMsg}`,
                )
              }
            }),
          )
        }

        console.log(
          `[sandbox-keepalive] Hibernation complete: ${hibernated} success, ${hibernateFailed} failed`,
        )
      })
    }

    const duration_ms = Date.now() - startTime
    console.log(
      `[sandbox-keepalive] Done: ${success} success, ${failed} failed, ${skipped} skipped, ${duration_ms}ms`,
    )

    // Log to database
    await prisma.sandboxKeepaliveLog.create({
      data: {
        total: sandboxes.length,
        success,
        failed,
        skipped,
        errors: errors.length > 0 ? errors.slice(0, 50) : undefined,
        duration_ms,
      },
    })

    return NextResponse.json({
      message: "Sandbox keep-alive completed",
      total: sandboxes.length,
      pinged: sandboxesToPing.length,
      success,
      failed,
      skipped,
      bySource,
      errors: errors.slice(0, 20),
      duration_ms,
    })
  } catch (error) {
    console.error("[sandbox-keepalive] Fatal error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
