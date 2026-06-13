import { NextRequest, NextResponse } from "next/server"
import { getAgentsRequestSession } from "@/lib/agents/auth/server"
import { prisma } from "@/lib/prisma"
import { encryptGitHubToken } from "@/lib/server/crypto"
import {
  exchangeCodeForUserToken,
  getGitHubUser,
  getInstallationInfo,
} from "@/lib/server/github/github-app-auth"

// Type for installation info stored in users.github_installations
interface GitHubInstallation {
  installation_id: string
  login: string
  avatar_url: string | null
  type: "User" | "Organization"
}

interface GitHubInstallations {
  installations: GitHubInstallation[]
}

/**
 * GitHub App Installation Callback
 *
 * This route handles the callback after a user installs the GitHub App.
 * It receives:
 * - installation_id: The ID of the installation
 * - setup_action: "install", "update", or "request" (for permission updates)
 * - code: OAuth code (if "Request user authorization during installation" is enabled)
 * - state: The state parameter we passed (contains teamId, userId, redirect)
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

  console.log(`🔔 [GitHub App Callback] Received callback:`, {
    installationId,
    setupAction,
    hasCode: !!code,
    hasState: !!state,
    error,
  })

  if (error) {
    console.error("❌ [GitHub App Callback] Error:", error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/canvas?error=github_app_denied`,
    )
  }

  // Installation ID is required
  if (!installationId) {
    console.error("❌ [GitHub App Callback] Missing installation_id")
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/canvas?error=missing_installation_id`,
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

    // If state is provided, decode it to get teamId and redirect URL
    if (state) {
      try {
        const stateData = JSON.parse(Buffer.from(state, "base64").toString())
        teamId = stateData.teamId
        redirectUrl = stateData.redirect

        // Verify the user matches
        if (stateData.userId && stateData.userId !== userId) {
          console.error("❌ [GitHub App Callback] User ID mismatch")
          return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_APP_URL}/canvas?error=invalid_state`,
          )
        }
      } catch (e) {
        console.warn("⚠️ [GitHub App Callback] Failed to parse state:", e)
      }
    }

    // If we have an OAuth code, exchange it for a user token
    // This happens when "Request user authorization (OAuth) during installation" is enabled
    if (code) {
      try {
        console.log(
          `🔑 [GitHub App Callback] Exchanging code for user token...`,
        )
        const tokenData = await exchangeCodeForUserToken(code)
        userAccessToken = tokenData.access_token

        // Get the GitHub user info
        githubUser = await getGitHubUser(userAccessToken)
        console.log(`👤 [GitHub App Callback] GitHub user: ${githubUser.login}`)
      } catch (e) {
        console.error(
          "⚠️ [GitHub App Callback] Failed to exchange code for token:",
          e,
        )
        // Continue without user token - we still have the installation
      }
    }

    // If we don't have a teamId from state, find the user's default team
    if (!teamId) {
      const defaultTeam = await prisma.team.findFirst({
        where: { user_id: userId },
        orderBy: { created_at: "desc" },
      })

      if (defaultTeam) {
        teamId = defaultTeam.id
        console.log(`📋 [GitHub App Callback] Using default team: ${teamId}`)
      } else {
        console.error("❌ [GitHub App Callback] No team found for user")
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_APP_URL}/canvas?error=no_team_found`,
        )
      }
    }

    // Verify team ownership
    const team = await prisma.team.findFirst({
      where: {
        id: teamId,
        user_id: userId,
      },
    })

    if (!team) {
      console.error("❌ [GitHub App Callback] Team not found or access denied")
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/canvas?error=team_not_found`,
      )
    }

    // Get installation info (account login, avatar, type) from GitHub API
    let installationInfo: GitHubInstallation | null = null
    try {
      installationInfo = await getInstallationInfo(installationId)
      console.log(
        `📋 [GitHub App Callback] Installation account: ${installationInfo.login} (${installationInfo.type})`,
      )
    } catch (e) {
      console.error(
        "⚠️ [GitHub App Callback] Failed to get installation info:",
        e,
      )
      // Fallback to basic info
      installationInfo = {
        installation_id: installationId,
        login: githubUser?.login || "Unknown",
        avatar_url: githubUser?.avatar_url || null,
        type: "User",
      }
    }

    // Build the GitHub integration data
    const existingIntegration = (team.github_integration as any) || {}

    // Build new installations[] array (source of truth)
    const existingInstallations: GitHubInstallation[] =
      existingIntegration.installations || []

    // Remove any existing installation for the same login (handles reinstalls)
    const filteredInstallations = existingInstallations.filter(
      (inst) =>
        inst.login !== installationInfo.login &&
        inst.installation_id !== installationId,
    )

    // Add the new installation
    const updatedInstallations = [...filteredInstallations, installationInfo]

    // Also build legacy installation_ids for backward compatibility
    const installationIds = updatedInstallations.map(
      (inst) => inst.installation_id,
    )

    const githubIntegration = {
      ...existingIntegration,
      // New: Array of installations with login info (source of truth)
      installations: updatedInstallations,
      // Legacy: Keep for backward compatibility during migration
      installation_id: installationId,
      installation_ids: installationIds,
      // Store the 21st.dev user ID who connected GitHub
      connected_by_user_id: userId,
      // Store user access token if we have one (encrypted)
      ...(userAccessToken && {
        access_token: encryptGitHubToken(userAccessToken),
      }),
      // Store GitHub user info if we have it (legacy)
      ...(githubUser && {
        github_user: {
          id: githubUser.id,
          login: githubUser.login,
          name: githubUser.name,
          email: githubUser.email,
          avatar_url: githubUser.avatar_url,
        },
      }),
      // Update connection timestamp
      connected_at: new Date().toISOString(),
      // Store the setup action for reference
      setup_action: setupAction,
    }

    console.log(
      `💾 [GitHub App Callback] Saving integration for team ${teamId}:`,
      {
        installations: updatedInstallations.map((i) => i.login),
        installationId: githubIntegration.installation_id,
        totalInstallations: updatedInstallations.length,
        hasAccessToken: !!githubIntegration.access_token,
        githubUser: githubIntegration.github_user?.login,
        setupAction,
      },
    )

    // Update user's github_installations (user-level storage)
    // This allows the user to reuse installations across teams
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { github_installations: true },
    })

    const existingUserInstallations =
      (user?.github_installations as GitHubInstallations | null) || {
        installations: [],
      }

    // Check if this account (by login) already exists - replace if so (handles reinstalls)
    // Also check by installation_id for exact matches
    const existingByLogin = existingUserInstallations.installations.find(
      (inst) => inst.login === installationInfo.login,
    )
    const existingById = existingUserInstallations.installations.find(
      (inst) => inst.installation_id === installationId,
    )

    if (existingByLogin || existingById) {
      // Replace existing installation (same account or same installation_id)
      // This handles reinstalls where installation_id changes but login stays the same
      const updatedInstallations = existingUserInstallations.installations
        .filter(
          (inst) =>
            inst.login !== installationInfo.login &&
            inst.installation_id !== installationId,
        )
        .concat(installationInfo)

      await prisma.user.update({
        where: { id: userId },
        data: {
          github_installations: {
            installations: updatedInstallations,
          } as object,
          updated_at: new Date(),
        },
      })

      console.log(
        `✅ [GitHub App Callback] Updated installation ${installationId} (${installationInfo.login}) for user ${userId}`,
      )
    } else {
      // Add new installation to user's list
      const updatedUserInstallations: GitHubInstallations = {
        installations: [
          ...existingUserInstallations.installations,
          installationInfo,
        ],
      }

      await prisma.user.update({
        where: { id: userId },
        data: {
          github_installations: updatedUserInstallations as object,
          updated_at: new Date(),
        },
      })

      console.log(
        `✅ [GitHub App Callback] Added installation ${installationId} (${installationInfo.login}) to user ${userId}`,
      )
    }

    // Update the team with the GitHub App installation
    await prisma.team.update({
      where: { id: teamId },
      data: {
        github_integration: githubIntegration,
        github_installation_id: installationId, // Dedicated column for fast lookups
        updated_at: new Date(),
      },
    })

    console.log(
      `✅ [GitHub App Callback] Successfully saved installation for team ${teamId}`,
    )

    // Determine redirect URL
    const finalRedirectUrl = redirectUrl
      ? decodeURIComponent(redirectUrl)
      : `${process.env.NEXT_PUBLIC_APP_URL}/canvas?githubConnected=true&teamId=${teamId}`

    return NextResponse.redirect(finalRedirectUrl)
  } catch (error) {
    console.error("❌ [GitHub App Callback] Error:", error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/canvas?error=callback_failed`,
    )
  }
}
