import { z } from "zod"
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc"
import { TRPCError } from "@trpc/server"
import { clerkClient } from "@clerk/nextjs/server"

// Helper to get user email from DB or Clerk
async function getUserEmail(
  prisma: any,
  userId: string,
): Promise<string | null> {
  // First try database
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  })

  if (dbUser?.email) {
    return dbUser.email
  }

  // Fallback to Clerk
  try {
    const client = await clerkClient()
    const clerkUser = await client.users.getUser(userId)
    return clerkUser.primaryEmailAddress?.emailAddress || null
  } catch {
    return null
  }
}

export const agentsWaitlistRouter = createTRPCRouter({
  // Join the agents waitlist
  joinWaitlist: publicProcedure
    .input(
      z.object({
        email: z.string().email("Please enter a valid email address"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Create waitlist entry
        const waitlistEntry = await ctx.prisma.agentsWaitlist.create({
          data: {
            email: input.email.toLowerCase().trim(),
          },
        })

        return {
          success: true,
          id: waitlistEntry.id,
        }
      } catch (error) {
        console.error("Failed to add to agents waitlist:", error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to join waitlist. Please try again.",
          cause: error,
        })
      }
    }),

  // Check if current user's email is already on the waitlist
  checkWaitlistStatus: protectedProcedure.query(async ({ ctx }) => {
    const email = await getUserEmail(ctx.prisma, ctx.auth.userId!)

    if (!email) {
      return { isOnWaitlist: false }
    }

    const waitlistEntry = await ctx.prisma.agentsWaitlist.findFirst({
      where: { email: email.toLowerCase() },
    })

    return {
      isOnWaitlist: !!waitlistEntry,
      email,
    }
  }),

  // Join waitlist for authenticated user (uses their email from account)
  joinWaitlistAuthenticated: protectedProcedure.mutation(async ({ ctx }) => {
    const email = await getUserEmail(ctx.prisma, ctx.auth.userId!)

    if (!email) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No email associated with your account.",
      })
    }

    try {
      // Check if already on waitlist
      const existing = await ctx.prisma.agentsWaitlist.findFirst({
        where: { email: email.toLowerCase() },
      })

      if (existing) {
        return {
          success: true,
          alreadyExists: true,
          id: existing.id,
        }
      }

      // Create waitlist entry
      const waitlistEntry = await ctx.prisma.agentsWaitlist.create({
        data: {
          email: email.toLowerCase().trim(),
        },
      })

      return {
        success: true,
        alreadyExists: false,
        id: waitlistEntry.id,
      }
    } catch (error) {
      console.error("Failed to add to agents waitlist:", error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to join waitlist. Please try again.",
        cause: error,
      })
    }
  }),
})

