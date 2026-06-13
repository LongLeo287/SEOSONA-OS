import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

/**
 * Discord account linking endpoint
 *
 * Flow:
 * 1. User clicks "Connect 1Code" button in Discord
 * 2. Opens this URL with discord_user_id and discord_username in query
 * 3. User is authenticated via Clerk (or redirected to login)
 * 4. We create DiscordUserLink mapping
 * 5. Redirect to success page
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const discordUserId = searchParams.get("discord_user_id")
  const discordUsername = searchParams.get("discord_username")
  const returnTo = searchParams.get("return_to") // Optional: where to redirect after

  if (!discordUserId) {
    return NextResponse.redirect(
      new URL("/1code/app?error=missing_discord_id", request.url)
    )
  }

  // Check if user is authenticated
  const { userId } = await auth()

  if (!userId) {
    // Redirect to sign-in, then back to this endpoint
    const currentUrl = request.nextUrl.toString()
    const signInUrl = new URL("/sign-in", request.url)
    signInUrl.searchParams.set("redirect_url", currentUrl)
    return NextResponse.redirect(signInUrl)
  }

  try {
    // Check if this Discord user is already linked
    const existingLink = await prisma.discordUserLink.findUnique({
      where: { discord_user_id: discordUserId },
    })

    if (existingLink) {
      if (existingLink.user_id === userId) {
        // Already linked to this user - success
        return NextResponse.redirect(
          new URL("/1code/app?discord_linked=already", request.url)
        )
      } else {
        // Linked to different user - update to new user
        await prisma.discordUserLink.update({
          where: { discord_user_id: discordUserId },
          data: {
            user_id: userId,
            discord_username: discordUsername,
            updated_at: new Date(),
          },
        })
      }
    } else {
      // Create new link
      await prisma.discordUserLink.create({
        data: {
          discord_user_id: discordUserId,
          user_id: userId,
          discord_username: discordUsername,
        },
      })
    }

    console.log(`[Discord Link] Linked Discord ${discordUserId} to user ${userId}`)

    // Redirect to success page
    const successUrl = new URL(returnTo || "/1code/app", request.url)
    successUrl.searchParams.set("discord_linked", "success")
    return NextResponse.redirect(successUrl)
  } catch (error) {
    console.error("[Discord Link] Error:", error)
    return NextResponse.redirect(
      new URL("/1code/app?error=link_failed", request.url)
    )
  }
}
