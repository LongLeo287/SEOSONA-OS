import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authenticateApiKey } from "../_lib/auth"
import { checkApiRateLimits } from "../_lib/rate-limit"
import { withApiErrorHandling } from "../_lib/errors"
import { type GitHubIntegration } from "@/lib/github"
import { getInstallationRepositories } from "@/lib/server/github/github-app-auth"

export const GET = withApiErrorHandling(async (req: Request) => {
  const auth = await authenticateApiKey(req)
  await checkApiRateLimits(auth.apiKeyId, auth.userId)

  const team = await prisma.team.findUnique({
    where: { id: auth.teamId },
    select: {
      github_integration: true,
      repositorySandboxes: {
        select: {
          repository: true,
          setup_status: true,
          sandbox_id: true,
          framework: true,
        },
      },
    },
  })

  if (!team) {
    throw {
      status: 404,
      error: "team_not_found",
      message: "Team not found",
    }
  }

  const integration = team.github_integration as GitHubIntegration | null
  if (!integration?.installations?.length) {
    return NextResponse.json({ repositories: [] })
  }

  // Build sandbox status lookup
  const sandboxMap = new Map(
    team.repositorySandboxes.map((s) => [
      s.repository,
      {
        sandboxReady: s.setup_status === "ready" && !!s.sandbox_id,
        framework: s.framework,
      },
    ]),
  )

  // Fetch repos from all installations in parallel
  const results = await Promise.allSettled(
    integration.installations.map(async (inst) => {
      const { repositories } = await getInstallationRepositories(
        inst.installation_id,
        1,
        100,
      )
      return repositories.map((repo: any) => {
        const sandboxInfo = sandboxMap.get(repo.full_name)
        return {
          fullName: repo.full_name,
          name: repo.name,
          private: repo.private,
          language: repo.language,
          defaultBranch: repo.default_branch,
          sandboxReady: sandboxInfo?.sandboxReady ?? false,
          framework: sandboxInfo?.framework ?? null,
          owner: {
            login: inst.login,
            avatarUrl: inst.avatar_url,
          },
        }
      })
    }),
  )

  const allRepos = results.flatMap((r) => {
    if (r.status === "fulfilled") return r.value
    console.error("[API v1] Failed to fetch repos for installation:", r.reason)
    return []
  })

  return NextResponse.json({ repositories: allRepos })
})
