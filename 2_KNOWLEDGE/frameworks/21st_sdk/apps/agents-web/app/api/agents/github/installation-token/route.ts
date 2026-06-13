import { NextResponse } from "next/server"
import { z } from "zod"
import { getInstallationForRepo, type GitHubIntegration } from "@/lib/github"
import { getInstallationAccessToken } from "@/lib/server/github/github-app-auth"
import { checkTeamAccess } from "@/server/api/routers/teams/utils"

const requestSchema = z
  .object({
    teamId: z.string().uuid(),
    userId: z.string().min(1),
    repository: z
      .string()
      .regex(
        /^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/,
        "Repository must be in format owner/repo",
      ),
  })

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
  const internalToken = req.headers.get("x-internal-token")
  if (
    !process.env.INTERNAL_API_SECRET ||
    internalToken !== process.env.INTERNAL_API_SECRET
  ) {
    return NextResponse.json(
      { error: "unauthorized", message: "Unauthorized" },
      { status: 401 },
    )
  }

  try {
    const body = await req.json()
    const parsed = requestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "invalid_request",
          message: parsed.error.issues.map((issue) => issue.message).join(", "),
        },
        { status: 400 },
      )
    }

    const { teamId, userId, repository } = parsed.data

    const { team } = await checkTeamAccess(teamId, userId)
    const integration = team.github_integration as GitHubIntegration | null

    const repoInstallationId = getInstallationForRepo(integration, repository)

    if (!repoInstallationId) {
      return NextResponse.json(
        {
          error: "forbidden",
          message:
            "No GitHub installation found for this repository. Please connect GitHub first.",
        },
        { status: 403 },
      )
    }

    const token = await getInstallationAccessToken(repoInstallationId)

    return NextResponse.json({
      token,
      installationId: repoInstallationId,
    })
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      typeof (error as { code: unknown }).code === "string"
    ) {
      const code = (error as { code: string }).code
      return NextResponse.json(
        {
          error: code.toLowerCase(),
          message:
            error instanceof Error
              ? error.message
              : "Failed to verify team access",
        },
        { status: mapTrpcCodeToStatus(code) },
      )
    }

    return NextResponse.json(
      {
        error: "internal_error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to mint GitHub installation token",
      },
      { status: 500 },
    )
  }
}
