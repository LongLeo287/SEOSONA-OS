import { NextResponse } from "next/server"
import { z } from "zod"
import { getAgentsRequestSession } from "@/lib/agents/auth/server"
import { IS_STANDALONE_APP } from "@/lib/agents/auth/config"
import { ensureTeamBilling } from "@/lib/agents-billing/ensure-team-billing"
import { checkTeamAccess } from "@/server/api/routers/teams/utils"

const requestSchema = z.object({
  teamId: z.string().uuid(),
})

function buildErrorLog(error: unknown) {
  const details: Record<string, unknown> = {}

  if (error instanceof Error) {
    details.message = error.message
    details.name = error.name
    details.stack = error.stack
  } else {
    details.message = String(error)
  }

  if (error && typeof error === "object") {
    const value = error as Record<string, unknown>
    if (typeof value.code === "string" || typeof value.code === "number") {
      details.code = value.code
    }
    if (value.error !== undefined) {
      details.error = value.error
    }
    if (typeof value.status === "number") {
      details.status = value.status
    }
  }

  return details
}

function mapTrpcCodeToStatus(code: string) {
  switch (code) {
    case "UNAUTHORIZED":
      return 401
    case "FORBIDDEN":
      return 403
    case "NOT_FOUND":
      return 404
    case "BAD_REQUEST":
      return 400
    default:
      return 500
  }
}

export async function POST(req: Request) {
  const startedAt = Date.now()
  let teamId: string | undefined

  try {
    const body = await req.json().catch((error) => {
      console.warn("[billing-check-route] Failed to parse request JSON", {
        ...buildErrorLog(error),
      })
      return null
    })
    const parsed = requestSchema.safeParse(body)
    if (!parsed.success) {
      console.warn("[billing-check-route] Invalid request payload", {
        issues: parsed.error.issues,
      })
      return NextResponse.json(
        {
          error: "invalid_request",
          message: parsed.error.issues.map((item) => item.message).join(", "),
        },
        { status: 400 },
      )
    }

    const parsedTeamId = parsed.data.teamId
    teamId = parsedTeamId
    console.info(`[billing-check-route][team:${teamId ?? "unknown"}] Started`)

    const internalToken = req.headers.get("x-internal-token")
    const expectedInternalToken = process.env.INTERNAL_API_SECRET
    const isInternalRequest =
      !!expectedInternalToken && internalToken === expectedInternalToken

    if (!isInternalRequest) {
      const session = await getAgentsRequestSession(req)
      if (!session.internalUserId) {
        console.warn(
          `[billing-check-route][team:${teamId ?? "unknown"}] Unauthorized request`,
        )
        return NextResponse.json(
          { error: "unauthorized", message: "Unauthorized" },
          { status: 401 },
        )
      }

      console.info(
        `[billing-check-route][team:${teamId ?? "unknown"}] External request authorized`,
        { userId: session.internalUserId },
      )
      await checkTeamAccess(parsedTeamId, session.internalUserId)
    } else {
      console.info(
        `[billing-check-route][team:${teamId ?? "unknown"}] Internal request authorized`,
      )
    }

    if (IS_STANDALONE_APP) {
      console.info(
        `[billing-check-route][team:${teamId ?? "unknown"}] Standalone app mode enabled, returning local-ready response`,
      )
      return NextResponse.json({
        ready: true,
        team_id: parsedTeamId,
        plan_status: "free",
        stripe: {},
        metronome: {},
      })
    }

    const response = await ensureTeamBilling({ teamId: parsedTeamId })
    console.info(
      `[billing-check-route][team:${teamId ?? "unknown"}] Completed successfully`,
      {
        ready: response.ready,
        planStatus: response.plan_status,
        blocker: response.blocker,
        durationMs: Date.now() - startedAt,
      },
    )
    return NextResponse.json(response)
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      typeof (error as { code: unknown }).code === "string"
    ) {
      const code = (error as { code: string }).code
      const message =
        error instanceof Error ? error.message : "Failed to verify team access"
      console.error(
        `[billing-check-route][team:${teamId ?? "unknown"}] Failed with coded error`,
        {
          status: mapTrpcCodeToStatus(code),
          durationMs: Date.now() - startedAt,
          ...buildErrorLog(error),
        },
      )
      return NextResponse.json(
        { error: code.toLowerCase(), message },
        { status: mapTrpcCodeToStatus(code) },
      )
    }

    console.error(
      `[billing-check-route][team:${teamId ?? "unknown"}] Failed with internal error`,
      {
        durationMs: Date.now() - startedAt,
        ...buildErrorLog(error),
      },
    )
    return NextResponse.json(
      {
        error: "internal_error",
        message:
          error instanceof Error ? error.message : "Failed to ensure billing",
      },
      { status: 500 },
    )
  }
}
