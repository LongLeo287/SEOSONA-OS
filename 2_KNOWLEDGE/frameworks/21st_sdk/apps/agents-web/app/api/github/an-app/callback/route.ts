import { NextRequest, NextResponse } from "next/server"
import { getAgentsRequestSession } from "@/lib/agents/auth/server"
import { prisma } from "@/lib/prisma"
import { encryptGitHubToken } from "@/lib/server/crypto"
import {
  exchangeCodeForUserToken,
  getGitHubUser,
  getInstallationInfo,
} from "@/lib/server/github/github-app-auth"

interface GitHubInstallation {
  installation_id: string
  login: string
  avatar_url: string | null
  type: "User" | "Organization"
}

interface GitHubInstallations {
  installations: GitHubInstallation[]
  an_installations?: GitHubInstallation[]
}

const APP_TYPE = "an" as const
const DEFAULT_REDIRECT = "/agents/new"

/**
 * GitHub App Installation Callback for AN (an-dev-app)
 *
 * Handles the callback after a user installs the AN GitHub App.
 * Stores installations in user.github_installations.an_installations[]
 * (separate from Canvas installations).
 */
export async function GET(request: NextRequest) {
  const userId = (await getAgentsRequestSession(request)).internalUserId

  if (!userId) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/login?error=unauthorized`,
    )
  }

  const { searchParams } = new URL(request.url)
  const installationId = searchParams.get("installation_id")
  const setupAction = searchParams.get("setup_action")
  const code = searchParams.get("code")
  const state = searchParams.get("state")
  const error = searchParams.get("error")

  console.log(`[AN GitHub Callback] Received callback:`, {
    installationId,
    setupAction,
    hasCode: !!code,
    hasState: !!state,
    error,
  })

  if (error) {
    console.error("[AN GitHub Callback] Error:", error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}${DEFAULT_REDIRECT}?error=github_app_denied`,
    )
  }

  if (!installationId) {
    console.error("[AN GitHub Callback] Missing installation_id")
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}${DEFAULT_REDIRECT}?error=missing_installation_id`,
    )
  }

  try {
    let teamId: string | undefined
    let redirectUrl: string | undefined
    let githubUser: {
      id: number
      login: string
      name: string
      email: string
      avatar_url: string
    } | null = null
    let userAccessToken: string | undefined

    // Decode state to get teamId and redirect URL
    if (state) {
      try {
        const stateData = JSON.parse(Buffer.from(state, "base64").toString())
        teamId = stateData.teamId
        redirectUrl = stateData.redirect

        if (stateData.userId && stateData.userId !== userId) {
          console.error("[AN GitHub Callback] User ID mismatch")
          return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_APP_URL}${DEFAULT_REDIRECT}?error=invalid_state`,
          )
        }
      } catch (e) {
        console.warn("[AN GitHub Callback] Failed to parse state:", e)
      }
    }

    // Exchange code for user token (if OAuth during installation is enabled)
    if (code) {
      try {
        const tokenData = await exchangeCodeForUserToken(code, APP_TYPE)
        userAccessToken = tokenData.access_token
        githubUser = await getGitHubUser(userAccessToken)
        console.log(`[AN GitHub Callback] GitHub user: ${githubUser.login}`)
      } catch (e) {
        console.error(
          "[AN GitHub Callback] Failed to exchange code for token:",
          e,
        )
      }
    }

    // Find team if not in state
    if (!teamId) {
      const defaultTeam = await prisma.team.findFirst({
        where: { user_id: userId },
        orderBy: { created_at: "desc" },
      })

      if (defaultTeam) {
        teamId = defaultTeam.id
      } else {
        console.error("[AN GitHub Callback] No team found for user")
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_APP_URL}${DEFAULT_REDIRECT}?error=no_team_found`,
        )
      }
    }

    // Verify team ownership
    const team = await prisma.team.findFirst({
      where: { id: teamId, user_id: userId },
    })

    if (!team) {
      console.error("[AN GitHub Callback] Team not found or access denied")
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}${DEFAULT_REDIRECT}?error=team_not_found`,
      )
    }

    // Get installation info from GitHub API using AN app credentials
    let installationInfo: GitHubInstallation
    try {
      installationInfo = await getInstallationInfo(installationId, APP_TYPE)
      console.log(
        `[AN GitHub Callback] Installation account: ${installationInfo.login} (${installationInfo.type})`,
      )
    } catch (e) {
      console.error("[AN GitHub Callback] Failed to get installation info:", e)
      installationInfo = {
        installation_id: installationId,
        login: githubUser?.login || "Unknown",
        avatar_url: githubUser?.avatar_url || null,
        type: "User",
      }
    }

    // Store installation at user level in an_installations[]
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { github_installations: true },
    })

    const existing = (user?.github_installations as GitHubInstallations | null) || {
      installations: [],
    }

    const existingAnInstallations = existing.an_installations || []

    // Remove stale entry for same login or same installation_id
    const filtered = existingAnInstallations.filter(
      (inst) =>
        inst.login !== installationInfo.login &&
        inst.installation_id !== installationId,
    )

    const updatedAnInstallations = [...filtered, installationInfo]

    await prisma.user.update({
      where: { id: userId },
      data: {
        github_installations: {
          ...existing,
          an_installations: updatedAnInstallations,
        } as object,
        updated_at: new Date(),
      },
    })

    // Also store the user access token at team level for repo creation
    if (userAccessToken) {
      const existingTeamIntegration =
        (team.github_integration as Record<string, any>) || {}
      await prisma.team.update({
        where: { id: teamId },
        data: {
          github_integration: {
            ...existingTeamIntegration,
            an_access_token: encryptGitHubToken(userAccessToken),
            an_github_user: githubUser
              ? {
                  id: githubUser.id,
                  login: githubUser.login,
                  name: githubUser.name,
                  email: githubUser.email,
                  avatar_url: githubUser.avatar_url,
                }
              : undefined,
          },
          updated_at: new Date(),
        },
      })
    }

    console.log(
      `[AN GitHub Callback] Saved AN installation ${installationId} (${installationInfo.login}) for user ${userId}`,
    )

    const finalRedirectUrl = redirectUrl
      ? decodeURIComponent(redirectUrl)
      : `${process.env.NEXT_PUBLIC_APP_URL}${DEFAULT_REDIRECT}`

    return NextResponse.redirect(finalRedirectUrl)
  } catch (error) {
    console.error("[AN GitHub Callback] Error:", error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}${DEFAULT_REDIRECT}?error=callback_failed`,
    )
  }
}
