import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc"
import { z } from "zod"
import { TRPCError } from "@trpc/server"
import { nanoid } from "nanoid"
import { prisma } from "@/lib/prisma"

const INVITE_CODE_LENGTH = 8
const MAX_USES_PER_USER = 2
const RESET_PERIOD_DAYS = 7

export const agentInvitesRouter = createTRPCRouter({
  // Get or create invite code for current user
  getOrCreateInviteCode: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.userId!

    // Check for existing active invite
    let invite = await prisma.agentInvite.findFirst({
      where: {
        inviter_user_id: userId,
        is_active: true,
      },
      include: {
        _count: {
          select: { acceptances: true },
        },
      },
    })

    // Check if needs weekly reset
    if (invite) {
      const daysSinceReset = Math.floor(
        (Date.now() - invite.last_reset_at.getTime()) / (1000 * 60 * 60 * 24),
      )

      if (daysSinceReset >= RESET_PERIOD_DAYS) {
        invite = await prisma.agentInvite.update({
          where: { id: invite.id },
          data: {
            uses_count: 0,
            last_reset_at: new Date(),
          },
          include: {
            _count: {
              select: { acceptances: true },
            },
          },
        })
      }
    }

    // Create new invite if none exists
    if (!invite) {
      const code = nanoid(INVITE_CODE_LENGTH)
      invite = await prisma.agentInvite.create({
        data: {
          code,
          inviter_user_id: userId,
          max_uses: MAX_USES_PER_USER,
        },
        include: {
          _count: {
            select: { acceptances: true },
          },
        },
      })
    }

    return {
      code: invite.code,
      usesCount: invite.uses_count,
      maxUses: invite.max_uses,
      totalAcceptances: invite._count.acceptances,
      lastResetAt: invite.last_reset_at,
      nextResetAt: new Date(
        invite.last_reset_at.getTime() +
          RESET_PERIOD_DAYS * 24 * 60 * 60 * 1000,
      ),
    }
  }),

  // Validate invite code (public, for landing page)
  validateInviteCode: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ input }) => {
      const invite = await prisma.agentInvite.findUnique({
        where: { code: input.code, is_active: true },
        include: {
          inviter: {
            select: {
              name: true,
              display_name: true,
              username: true,
              image_url: true,
            },
          },
        },
      })

      if (!invite) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid or expired invite code",
        })
      }

      // Check weekly reset
      const daysSinceReset = Math.floor(
        (Date.now() - invite.last_reset_at.getTime()) / (1000 * 60 * 60 * 24),
      )

      const currentUsesCount =
        daysSinceReset >= RESET_PERIOD_DAYS ? 0 : invite.uses_count

      if (currentUsesCount >= invite.max_uses) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "This invite has reached its weekly limit. Try again next week.",
        })
      }

      return {
        valid: true,
        inviter: invite.inviter,
        remainingUses: invite.max_uses - currentUsesCount,
      }
    }),

  // Accept invite (after auth)
  acceptInvite: protectedProcedure
    .input(
      z.object({
        code: z.string(),
        ipAddress: z.string().optional(),
        userAgent: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.auth.userId!

      const invite = await prisma.agentInvite.findUnique({
        where: { code: input.code, is_active: true },
      })

      if (!invite) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid invite code",
        })
      }

      // Prevent self-invite (unless admin for testing)
      // Admins can accept their own invites for testing purposes in development/staging
      if (invite.inviter_user_id === userId) {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { is_admin: true },
        })

        if (!user?.is_admin) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Cannot use your own invite code",
          })
        }
      }

      // Check if already accepted
      const existingAcceptance = await prisma.agentInviteAcceptance.findUnique({
        where: {
          invite_code_invited_user_id: {
            invite_code: input.code,
            invited_user_id: userId,
          },
        },
      })

      if (existingAcceptance) {
        return { success: true, alreadyAccepted: true }
      }

      // Execute acceptance within transaction to prevent race conditions
      try {
        await prisma.$transaction(async (tx) => {
          // Re-fetch invite within transaction for latest state
          const currentInvite = await tx.agentInvite.findUnique({
            where: { id: invite.id, is_active: true },
          })

          if (!currentInvite) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Invite no longer active",
            })
          }

          // Check weekly reset
          const daysSinceReset = Math.floor(
            (Date.now() - currentInvite.last_reset_at.getTime()) /
              (1000 * 60 * 60 * 24),
          )

          let usesCount = currentInvite.uses_count
          if (daysSinceReset >= RESET_PERIOD_DAYS) {
            // Reset counter
            await tx.agentInvite.update({
              where: { id: currentInvite.id },
              data: {
                uses_count: 0,
                last_reset_at: new Date(),
              },
            })
            usesCount = 0
          }

          // Check limit within transaction
          if (usesCount >= currentInvite.max_uses) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "Invite limit reached for this week",
            })
          }

          // Create acceptance
          await tx.agentInviteAcceptance.create({
            data: {
              invite_code: input.code,
              invited_user_id: userId,
              ip_address: input.ipAddress,
              user_agent: input.userAgent,
            },
          })

          // Increment uses count
          await tx.agentInvite.update({
            where: { id: currentInvite.id },
            data: {
              uses_count: { increment: 1 },
            },
          })
        })

        return { success: true, alreadyAccepted: false }
      } catch (error) {
        // Re-throw TRPCError as-is
        if (error instanceof TRPCError) {
          throw error
        }
        // Handle other errors
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to accept invite",
        })
      }
    }),

  // Regenerate invite code
  regenerateInviteCode: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.auth.userId!

    // Deactivate old invite
    await prisma.agentInvite.updateMany({
      where: { inviter_user_id: userId },
      data: { is_active: false },
    })

    // Create new one
    const code = nanoid(INVITE_CODE_LENGTH)
    const invite = await prisma.agentInvite.create({
      data: {
        code,
        inviter_user_id: userId,
        max_uses: MAX_USES_PER_USER,
      },
    })

    return { code: invite.code }
  }),

  // Get invite statistics
  getInviteStats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.userId!

    const acceptances = await prisma.agentInviteAcceptance.findMany({
      where: {
        invite: {
          inviter_user_id: userId,
        },
      },
      include: {
        user: {
          select: {
            name: true,
            username: true,
            image_url: true,
            created_at: true,
          },
        },
      },
      orderBy: { accepted_at: "desc" },
    })

    return {
      totalInvites: acceptances.length,
      recentInvites: acceptances.slice(0, 10),
    }
  }),
})
