import { z } from "zod"
import { Resend } from "resend"
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc"
import { TRPCError } from "@trpc/server"

// Initialize Resend for audience management
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

export const emailPreferencesRouter = createTRPCRouter({
  // Get current user's email preferences
  getPreferences: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.userId!

    // Get or create preferences
    let preferences = await ctx.prisma.emailPreferences.findUnique({
      where: { user_id: userId },
    })

    // If no preferences exist, create default ones
    if (!preferences) {
      const user = await ctx.prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, name: true, display_name: true },
      })

      if (!user?.email) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found or has no email",
        })
      }

      // Try to add to newsletter audience
      let resendContactId: string | null = null
      if (resend && process.env.NEWSLETTER_AUDIENCE) {
        try {
          const response = await resend.contacts.create({
            email: user.email,
            firstName: user.display_name || user.name || undefined,
            audienceId: process.env.NEWSLETTER_AUDIENCE,
          })
          resendContactId = response.data?.id || null
        } catch (error) {
          console.error("Failed to add contact to Resend audience:", error)
        }
      }

      preferences = await ctx.prisma.emailPreferences.create({
        data: {
          user_id: userId,
          newsletter_subscribed: true,
          include_trending: true,
          include_personalized: true,
          include_from_followed: true,
          resend_contact_id: resendContactId,
        },
      })
    }

    return {
      newsletter_subscribed: preferences.newsletter_subscribed,
      include_trending: preferences.include_trending,
      include_personalized: preferences.include_personalized,
      include_from_followed: preferences.include_from_followed,
      last_newsletter_sent_at: preferences.last_newsletter_sent_at,
    }
  }),

  // Update email preferences
  updatePreferences: protectedProcedure
    .input(
      z.object({
        newsletter_subscribed: z.boolean().optional(),
        include_trending: z.boolean().optional(),
        include_personalized: z.boolean().optional(),
        include_from_followed: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.auth.userId!

      // Get current preferences
      const currentPrefs = await ctx.prisma.emailPreferences.findUnique({
        where: { user_id: userId },
      })

      if (!currentPrefs) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Email preferences not found. Please refresh the page.",
        })
      }

      // Update Resend audience subscription if newsletter status changed
      if (
        input.newsletter_subscribed !== undefined &&
        input.newsletter_subscribed !== currentPrefs.newsletter_subscribed
      ) {
        if (resend && currentPrefs.resend_contact_id && process.env.NEWSLETTER_AUDIENCE) {
          try {
            if (input.newsletter_subscribed) {
              // Re-subscribe: update unsubscribed status
              await resend.contacts.update({
                id: currentPrefs.resend_contact_id,
                audienceId: process.env.NEWSLETTER_AUDIENCE,
                unsubscribed: false,
              })
            } else {
              // Unsubscribe
              await resend.contacts.update({
                id: currentPrefs.resend_contact_id,
                audienceId: process.env.NEWSLETTER_AUDIENCE,
                unsubscribed: true,
              })
            }
          } catch (error) {
            console.error("Failed to update Resend contact:", error)
            // Don't fail the mutation, just log the error
          }
        }
      }

      // Update preferences in database
      const updated = await ctx.prisma.emailPreferences.update({
        where: { user_id: userId },
        data: {
          ...(input.newsletter_subscribed !== undefined && {
            newsletter_subscribed: input.newsletter_subscribed,
          }),
          ...(input.include_trending !== undefined && {
            include_trending: input.include_trending,
          }),
          ...(input.include_personalized !== undefined && {
            include_personalized: input.include_personalized,
          }),
          ...(input.include_from_followed !== undefined && {
            include_from_followed: input.include_from_followed,
          }),
        },
      })

      return {
        newsletter_subscribed: updated.newsletter_subscribed,
        include_trending: updated.include_trending,
        include_personalized: updated.include_personalized,
        include_from_followed: updated.include_from_followed,
      }
    }),
})

