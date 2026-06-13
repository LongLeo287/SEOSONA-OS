import { z } from "zod"
import { TRPCError } from "@trpc/server"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { checkTeamAccess } from "@/server/api/routers/teams/utils"
import { prisma } from "@/lib/prisma"
import {
  type DiscordIntegration,
  type DiscordGuild,
  buildDiscordAuthUrl,
  DISCORD_OAUTH,
} from "@/lib/discord"

function getDiscordConfig() {
  const clientId = process.env.DISCORD_CLIENT_ID
  const clientSecret = process.env.DISCORD_CLIENT_SECRET

  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://21st.dev"
  const redirectUri = `${baseUrl}/integrations/callback/discord`

  if (!clientId || !clientSecret) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Discord OAuth not configured",
    })
  }

  return { clientId, clientSecret, redirectUri }
}

export const discordRouter = createTRPCRouter({
  // Get current integration status
  getIntegration: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { team } = await checkTeamAccess(input.teamId, ctx.auth.userId!)
      const integration = team.discord_integration as DiscordIntegration | null

      const isConnected =
        integration?.status === "active" && Boolean(integration?.guildId)

      // Build manage URL for Discord server integrations
      const manageUrl = isConnected && integration?.guildId
        ? `https://discord.com/channels/${integration.guildId}/integrations`
        : null

      return {
        isConnected,
        guildName: integration?.guildName ?? null,
        guildId: integration?.guildId ?? null,
        connectedAt: integration?.connectedAt ?? null,
        manageUrl,
      }
    }),

  // Get OAuth authorization URL (bot invite)
  getAuthUrl: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)
      const { clientId, redirectUri } = getDiscordConfig()

      // State contains teamId and userId for callback verification
      const state = Buffer.from(
        JSON.stringify({
          teamId: input.teamId,
          userId: ctx.auth.userId,
        })
      ).toString("base64")

      const authUrl = buildDiscordAuthUrl({
        clientId,
        redirectUri,
        state,
      })

      return { authUrl }
    }),

  // Disconnect Discord integration
  disconnect: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)

      await prisma.team.update({
        where: { id: input.teamId },
        data: {
          discord_integration: {},
          discord_guild_id: null,
        },
      })

      return { success: true }
    }),
})

/**
 * Exchange authorization code for tokens and get guild info
 */
export async function exchangeDiscordCode(
  code: string
): Promise<{ accessToken: string; guild: DiscordGuild }> {
  const { clientId, clientSecret, redirectUri } = getDiscordConfig()

  // Exchange code for token
  const tokenResponse = await fetch(DISCORD_OAUTH.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    }),
  })

  if (!tokenResponse.ok) {
    const error = await tokenResponse.text()
    console.error("[Discord] Token exchange failed:", error)
    throw new Error(`Token exchange failed: ${tokenResponse.statusText}`)
  }

  const tokenData = await tokenResponse.json()
  const accessToken = tokenData.access_token

  // The guild info comes in the token response when using bot scope
  if (tokenData.guild) {
    return {
      accessToken,
      guild: {
        id: tokenData.guild.id,
        name: tokenData.guild.name,
        icon: tokenData.guild.icon,
      },
    }
  }

  // Fallback: fetch guilds the user has access to
  const guildsResponse = await fetch(`${DISCORD_OAUTH.apiUrl}/users/@me/guilds`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!guildsResponse.ok) {
    throw new Error("Failed to fetch Discord guilds")
  }

  const guilds = await guildsResponse.json()

  // Return the first guild (user selected during OAuth)
  if (guilds.length > 0) {
    return {
      accessToken,
      guild: {
        id: guilds[0].id,
        name: guilds[0].name,
        icon: guilds[0].icon,
      },
    }
  }

  throw new Error("No guild found in Discord response")
}
