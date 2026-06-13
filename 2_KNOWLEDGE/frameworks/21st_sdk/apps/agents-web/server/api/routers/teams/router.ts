import { prisma } from "@/lib/prisma"
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  adminProcedure,
} from "@/server/api/trpc"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { sendTeamInviteEmail } from "@/lib/emails/send-team-invite"
import { sendGitHubInviteEmail } from "@/lib/emails/send-github-invite"
import {
  sendCanvasOutreachEmail,
  type CanvasOutreachEmailType,
  type UserRole,
} from "@/lib/emails/send-canvas-outreach"
import {
  requireTeamOwnership,
  checkTeamAccess,
  getOrCreateInviteLink,
} from "./utils"

export const teamsRouter = createTRPCRouter({
  // Get all teams (owned + member of)
  getUserTeams: protectedProcedure.query(async ({ ctx }) => {
    const teams = await prisma.team.findMany({
      where: {
        OR: [
          { user_id: ctx.auth.userId! },
          { members: { some: { user_id: ctx.auth.userId! } } },
        ],
      },
      include: {
        _count: {
          select: {
            members: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            display_name: true,
            display_username: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    })

    return teams.map((team) => ({
      ...team,
      isOwner: team.user_id === ctx.auth.userId,
    }))
  }),

  // Получить конкретную команду по ID (алиас для getTeam)
  getTeamById: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
        includeFullData: z.boolean().optional().default(false), // Опция для включения полных данных
      }),
    )
    .query(async ({ input, ctx }) => {
      const commonParams = {
        where: {
          deleted_at: null,
          canvas_snapshot: { not: { equals: null } }, // Only projects with canvas
        },
        orderBy: {
          created_at: "desc" as const,
        },
      }

      const projectsInclude = input.includeFullData
        ? commonParams
        : {
            ...commonParams,
            select: {
              id: true,
              name: true,
              is_mcp: true,
              is_public: true,
              created_at: true,
              team_id: true,
              preview_url: true,
              deleted_at: true,
              user_id: true,
              // Исключаем canvas_snapshot, который может быть очень большим
            },
          }

      const team = await prisma.team.findUnique({
        where: {
          id: input.teamId,
        },
        include: {
          magicProjects: projectsInclude,
          _count: {
            select: {
              magicProjects: {
                where: {
                  deleted_at: null, // Фильтруем удаленные проекты из подсчета
                },
              },
            },
          },
        },
      })

      if (!team) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        })
      }

      // Check if user is owner or member
      const isOwner = team.user_id === ctx.auth.userId
      const isMember = await prisma.teamMember.findUnique({
        where: {
          team_id_user_id: { team_id: team.id, user_id: ctx.auth.userId! },
        },
      })

      if (!isOwner && !isMember) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" })
      }

      return { ...team, isOwner }
    }),

  // Создать новую команду
  createTeam: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        description: z.string().optional(),
        image_url: z.string().url().optional(),
        website_url: z.string().url().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Проверяем уникальность имени команды для пользователя
      const existingTeam = await prisma.team.findFirst({
        where: {
          user_id: ctx.auth.userId,
          name: input.name,
        },
      })

      if (existingTeam) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Team with this name already exists",
        })
      }

      const team = await prisma.team.create({
        data: {
          name: input.name,
          description: input.description,
          image_url: input.image_url,
          website_url: input.website_url,
          user_id: ctx.auth.userId,
        },
      })

      return team
    }),

  // Обновить команду
  updateTeam: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
        name: z.string().min(1).max(100).optional(),
        description: z.string().optional(),
        image_url: z.string().url().optional(),
        website_url: z.string().url().optional(),
        onboarding_completed: z.boolean().optional(),
        figma_integration: z.record(z.any()).optional(),
        github_integration: z.record(z.any()).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { teamId, ...updateData } = input
      const existingTeam = await requireTeamOwnership(teamId, ctx.auth.userId!)

      // Check name uniqueness if changing
      if (updateData.name && updateData.name !== existingTeam.name) {
        const nameConflict = await prisma.team.findFirst({
          where: {
            user_id: ctx.auth.userId,
            name: updateData.name,
            NOT: { id: teamId },
          },
        })

        if (nameConflict) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Team with this name already exists",
          })
        }
      }

      // Handle special case for GitHub integration with "*" folders (select all)
      let finalUpdateData = { ...updateData }

      if (
        updateData.github_integration &&
        updateData.github_integration.configuration?.folders?.includes("*")
      ) {
        console.log(
          "Processing auto-select ALL FILES for GitHub integration (no folder filtering)",
        )

        // Get all available directories from repository tree
        try {
          const githubIntegration = updateData.github_integration as any
          const repository = githubIntegration.configuration?.repository

          if (repository && existingTeam.github_integration) {
            // Replace "*" with special marker to process entire repository
            finalUpdateData.github_integration = {
              ...githubIntegration,
              configuration: {
                ...githubIntegration.configuration,
                folders: ["**"], // Special marker meaning "process entire repository"
                scanEntireRepository: true, // Flag for indexing service
                autoSelectedAll: true, // Mark as auto-selected for future reference
              },
            }

            console.log(
              "Auto-selected ENTIRE repository for processing (filter by file extensions only)",
            )
            console.log(
              "📝 [Teams API] Final GitHub integration config:",
              JSON.stringify(finalUpdateData.github_integration, null, 2),
            )
          }
        } catch (error) {
          console.error("Failed to auto-select folders:", error)
          // Fall back to the original data without "*"
          const githubIntegration = updateData.github_integration as any
          finalUpdateData.github_integration = {
            ...githubIntegration,
            configuration: {
              ...githubIntegration.configuration,
              folders: [], // Empty array as fallback
            },
          }
        }
      }

      const team = await prisma.team.update({
        where: { id: teamId },
        data: {
          ...finalUpdateData,
          updated_at: new Date(),
        },
      })

      return team
    }),

  // Удалить команду
  deleteTeam: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await requireTeamOwnership(input.teamId, ctx.auth.userId!)

      // Check for existing projects
      const projectCount = await prisma.magicProject.count({
        where: { team_id: input.teamId, deleted_at: null },
      })

      if (projectCount > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot delete team with existing projects",
        })
      }

      await prisma.team.delete({ where: { id: input.teamId } })

      return { success: true }
    }),

  // Получить все проекты пользователя (все команды)
  getUserProjects: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(1000).optional().default(1000),
        offset: z.number().min(0).optional().default(0),
        hasCanvas: z.boolean().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const whereClause = {
        user_id: ctx.auth.userId,
        deleted_at: null, // Фильтруем удаленные проекты
        ...(input.hasCanvas && {
          canvas_snapshot: { not: { equals: null } },
        }),
      }

      const projects = await prisma.magicProject.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          created_at: true,
          user_id: true,
          is_mcp: true,
          preview_url: true,
          team: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
        take: input.limit,
        skip: input.offset,
      })

      const totalCount = await prisma.magicProject.count({
        where: whereClause,
      })

      return {
        projects,
        totalCount,
        hasMore: totalCount > input.offset + input.limit,
      }
    }),

  // Проверить является ли проект избранным
  isProjectFavorite: publicProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
      }),
    )
    .query(async ({ input, ctx }) => {
      if (!ctx.auth.userId) {
        return false
      }

      const favorite = await prisma.projectFavorite.findUnique({
        where: {
          user_id_project_id: {
            user_id: ctx.auth.userId,
            project_id: input.projectId,
          },
        },
      })

      return !!favorite
    }),

  // Загрузить логотип команды на R2
  uploadTeamLogo: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
        fileName: z.string(),
        contentType: z.string(),
        base64Data: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await requireTeamOwnership(input.teamId, ctx.auth.userId!)

      if (!input.contentType.startsWith("image/")) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Only image files are allowed",
        })
      }

      try {
        console.log(`[uploadTeamLogo] Starting upload for team ${input.teamId}`)
        console.log(
          `[uploadTeamLogo] File: ${input.fileName}, Type: ${input.contentType}`,
        )
        console.log(
          `[uploadTeamLogo] Base64 data length: ${input.base64Data.length}`,
        )

        // Генерируем уникальное имя файла
        const fileExtension = input.fileName.split(".").pop() || "jpg"
        const uniqueFileName = `team-logos/${input.teamId}/${Date.now()}.${fileExtension}`

        console.log(`[uploadTeamLogo] Generated file name: ${uniqueFileName}`)

        // Используем presigned URL подход как в других местах
        const { generatePresignedUrl } = await import("@/lib/r2")

        console.log(`[uploadTeamLogo] Generating presigned URL...`)
        const presignedUrl = await generatePresignedUrl({
          fileKey: uniqueFileName,
          bucketName: "components-code",
          contentType: input.contentType,
        })

        console.log(`[uploadTeamLogo] Got presigned URL, now uploading...`)

        // Конвертируем base64 в buffer
        const fileBuffer = Buffer.from(input.base64Data, "base64")

        // Загружаем файл через presigned URL
        const uploadResponse = await fetch(presignedUrl, {
          method: "PUT",
          body: fileBuffer,
          headers: {
            "Content-Type": input.contentType,
          },
        })

        if (!uploadResponse.ok) {
          throw new Error(
            `Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`,
          )
        }

        const logoUrl = `${process.env.NEXT_PUBLIC_CDN_URL}/${uniqueFileName}`
        console.log(`[uploadTeamLogo] Upload successful! URL: ${logoUrl}`)

        return logoUrl
      } catch (error) {
        console.error("[uploadTeamLogo] Detailed error:", error)
        console.error(
          "[uploadTeamLogo] Error stack:",
          error instanceof Error ? error.stack : "No stack trace",
        )
        console.error(
          "[uploadTeamLogo] Error message:",
          error instanceof Error ? error.message : String(error),
        )
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to upload logo",
        })
      }
    }),

  // === INVITE LINKS ===

  // Get team info by invite token (public - for invite page)
  getTeamByInviteToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const link = await prisma.teamInviteLink.findUnique({
        where: { token: input.token, is_active: true },
        include: {
          team: { select: { id: true, name: true, image_url: true } },
          creator: { select: { display_name: true, email: true } },
        },
      })
      if (!link) return null
      return {
        ...link.team,
        inviter: link.creator.display_name || link.creator.email,
      }
    }),

  // Get or create invite link for team (owner only)
  getOrCreateInviteLink: protectedProcedure
    .input(z.object({ teamId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      await requireTeamOwnership(input.teamId, ctx.auth.userId!)
      return getOrCreateInviteLink(input.teamId, ctx.auth.userId!)
    }),

  // Regenerate invite link (owner only)
  regenerateInviteLink: protectedProcedure
    .input(z.object({ teamId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await requireTeamOwnership(input.teamId, ctx.auth.userId!)
      return getOrCreateInviteLink(input.teamId, ctx.auth.userId!, true)
    }),

  // Join team via invite link
  joinTeamViaLink: protectedProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const link = await prisma.teamInviteLink.findUnique({
        where: { token: input.token, is_active: true },
        include: { team: true },
      })

      if (!link) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid or expired invite link",
        })
      }

      // Check if user is already owner - just redirect them
      if (link.team.user_id === ctx.auth.userId) {
        return { success: true, teamId: link.team_id, alreadyMember: true }
      }

      // Check if already a member - just redirect them
      const existing = await prisma.teamMember.findUnique({
        where: {
          team_id_user_id: { team_id: link.team_id, user_id: ctx.auth.userId },
        },
      })
      if (existing) {
        return { success: true, teamId: link.team_id, alreadyMember: true }
      }

      const user = await prisma.user.findUnique({
        where: { id: ctx.auth.userId },
        select: { email: true },
      })

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" })
      }

      // Create team membership
      await prisma.teamMember.create({
        data: {
          team_id: link.team_id,
          user_id: ctx.auth.userId,
          email: user.email,
        },
      })

      // Mark pending invite as accepted (if exists)
      await prisma.teamPendingInvite.updateMany({
        where: {
          team_id: link.team_id,
          email: user.email.toLowerCase(),
          status: "pending",
        },
        data: { status: "accepted" },
      })

      // Canvas access is now open to everyone - no need to grant explicitly

      return { success: true, teamId: link.team_id }
    }),

  // Send invite email (owner only)
  sendInviteEmail: protectedProcedure
    .input(
      z.object({
        teamId: z.string().uuid(),
        email: z.string().email(),
        source: z.enum(["canvas", "agents"]).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const team = await requireTeamOwnership(input.teamId, ctx.auth.userId!)
      const normalizedEmail = input.email.toLowerCase()

      // Check if user is already a member
      const existingMember = await prisma.teamMember.findFirst({
        where: {
          team_id: input.teamId,
          email: normalizedEmail,
        },
      })

      if (existingMember) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User is already a member of this team",
        })
      }

      // Check if user is the owner
      const owner = await prisma.user.findUnique({
        where: { id: team.user_id },
        select: { email: true },
      })

      if (owner?.email.toLowerCase() === normalizedEmail) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot invite the team owner",
        })
      }

      const link = await getOrCreateInviteLink(input.teamId, ctx.auth.userId!)

      const inviter = await prisma.user.findUnique({
        where: { id: ctx.auth.userId },
        select: { display_name: true, username: true },
      })

      await sendTeamInviteEmail({
        email: normalizedEmail,
        teamName: team.name,
        inviterName: inviter?.display_name ?? inviter?.username ?? undefined,
        token: link.token,
        source: input.source,
      })

      // Create or update pending invite record
      await prisma.teamPendingInvite.upsert({
        where: {
          team_id_email: {
            team_id: input.teamId,
            email: normalizedEmail,
          },
        },
        create: {
          team_id: input.teamId,
          email: normalizedEmail,
          invited_by: ctx.auth.userId!,
          status: "pending",
          last_sent_at: new Date(),
        },
        update: {
          last_sent_at: new Date(),
          status: "pending", // Reset status if it was revoked
          invited_by: ctx.auth.userId!, // Update who sent the latest invite
        },
      })

      return { success: true }
    }),

  // Send GitHub integration invite email
  // This is for when a user wants to delegate GitHub connection to a teammate
  sendGitHubInviteEmail: protectedProcedure
    .input(z.object({ teamId: z.string().uuid(), email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const { team, isOwner, isMember } = await checkTeamAccess(
        input.teamId,
        ctx.auth.userId!,
      )

      // Both owner and members can invite others for GitHub integration
      if (!isOwner && !isMember) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" })
      }

      const link = await getOrCreateInviteLink(input.teamId, ctx.auth.userId!)

      const inviter = await prisma.user.findUnique({
        where: { id: ctx.auth.userId },
        select: { display_name: true, username: true },
      })

      const result = await sendGitHubInviteEmail({
        email: input.email.toLowerCase(),
        teamName: team.name,
        inviterName: inviter?.display_name ?? inviter?.username ?? undefined,
        token: link.token,
      })

      if (!result.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send invitation email",
        })
      }

      return { success: true }
    }),

  // === TEAM MEMBERS ===

  getTeamMembers: protectedProcedure
    .input(z.object({ teamId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const team = await prisma.team.findUnique({
        where: { id: input.teamId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              display_name: true,
              image_url: true,
            },
          },
          inviteLink: { select: { token: true } },
        },
      })
      if (!team) throw new TRPCError({ code: "NOT_FOUND" })

      const isOwner = team.user_id === ctx.auth.userId
      const isMember = await prisma.teamMember.findUnique({
        where: {
          team_id_user_id: { team_id: input.teamId, user_id: ctx.auth.userId },
        },
      })
      if (!isOwner && !isMember) {
        throw new TRPCError({ code: "FORBIDDEN" })
      }

      const members = await prisma.teamMember.findMany({
        where: { team_id: input.teamId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              display_name: true,
              image_url: true,
            },
          },
        },
        orderBy: { created_at: "asc" },
      })

      return {
        owner: team.user,
        members,
        isOwner,
        inviteToken: team.inviteLink?.token,
      }
    }),

  removeMember: protectedProcedure
    .input(z.object({ teamId: z.string().uuid(), memberId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await requireTeamOwnership(input.teamId, ctx.auth.userId!)

      await prisma.teamMember.delete({
        where: {
          team_id_user_id: { team_id: input.teamId, user_id: input.memberId },
        },
      })

      return { success: true }
    }),

  leaveTeam: protectedProcedure
    .input(z.object({ teamId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const team = await prisma.team.findUnique({ where: { id: input.teamId } })
      if (!team) throw new TRPCError({ code: "NOT_FOUND" })

      if (team.user_id === ctx.auth.userId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Owner cannot leave team",
        })
      }

      // Verify user is actually a member before attempting to delete
      const membership = await prisma.teamMember.findUnique({
        where: {
          team_id_user_id: { team_id: input.teamId, user_id: ctx.auth.userId },
        },
      })

      if (!membership) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "You are not a member of this team",
        })
      }

      await prisma.teamMember.delete({
        where: {
          team_id_user_id: { team_id: input.teamId, user_id: ctx.auth.userId },
        },
      })

      return { success: true }
    }),

  // === PENDING INVITES ===

  // Get pending invites for a team
  getPendingInvites: protectedProcedure
    .input(z.object({ teamId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)

      const pendingInvites = await prisma.teamPendingInvite.findMany({
        where: {
          team_id: input.teamId,
          status: "pending",
        },
        include: {
          inviter: {
            select: {
              id: true,
              email: true,
              display_name: true,
              image_url: true,
            },
          },
        },
        orderBy: { created_at: "desc" },
      })

      return pendingInvites
    }),

  // Revoke a pending invite (owner only)
  revokeInvite: protectedProcedure
    .input(z.object({ teamId: z.string().uuid(), inviteId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await requireTeamOwnership(input.teamId, ctx.auth.userId!)

      const invite = await prisma.teamPendingInvite.findUnique({
        where: { id: input.inviteId },
      })

      if (!invite || invite.team_id !== input.teamId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invite not found",
        })
      }

      await prisma.teamPendingInvite.update({
        where: { id: input.inviteId },
        data: { status: "revoked" },
      })

      return { success: true }
    }),

  // Resend invite email (owner only)
  resendInvite: protectedProcedure
    .input(
      z.object({
        teamId: z.string().uuid(),
        inviteId: z.string().uuid(),
        source: z.enum(["canvas", "agents"]).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const team = await requireTeamOwnership(input.teamId, ctx.auth.userId!)

      const invite = await prisma.teamPendingInvite.findUnique({
        where: { id: input.inviteId },
      })

      if (!invite || invite.team_id !== input.teamId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invite not found",
        })
      }

      if (invite.status !== "pending") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot resend a revoked or accepted invite",
        })
      }

      // Rate limit: prevent resending too frequently (1 minute minimum)
      const minResendInterval = 60_000 // 1 minute in ms
      const timeSinceLastSent = Date.now() - invite.last_sent_at.getTime()
      if (timeSinceLastSent < minResendInterval) {
        const secondsRemaining = Math.ceil(
          (minResendInterval - timeSinceLastSent) / 1000,
        )
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: `Please wait ${secondsRemaining} seconds before resending`,
        })
      }

      const link = await getOrCreateInviteLink(input.teamId, ctx.auth.userId!)

      const inviter = await prisma.user.findUnique({
        where: { id: ctx.auth.userId },
        select: { display_name: true, username: true },
      })

      await sendTeamInviteEmail({
        email: invite.email,
        teamName: team.name,
        inviterName: inviter?.display_name ?? inviter?.username ?? undefined,
        token: link.token,
        source: input.source,
      })

      await prisma.teamPendingInvite.update({
        where: { id: input.inviteId },
        data: {
          last_sent_at: new Date(),
          invited_by: ctx.auth.userId!,
        },
      })

      return { success: true }
    }),

  // Transfer team ownership to another member
  transferOwnership: protectedProcedure
    .input(
      z.object({
        teamId: z.string().uuid(),
        newOwnerId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Verify current user is the owner
      const team = await requireTeamOwnership(input.teamId, ctx.auth.userId!)

      // Check if trying to transfer to self
      if (input.newOwnerId === ctx.auth.userId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are already the owner of this team",
        })
      }

      // Verify new owner is an existing team member
      const newOwnerMembership = await prisma.teamMember.findUnique({
        where: {
          team_id_user_id: {
            team_id: input.teamId,
            user_id: input.newOwnerId,
          },
        },
        include: {
          user: { select: { id: true, email: true, display_name: true } },
        },
      })

      if (!newOwnerMembership) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "New owner must be an existing team member",
        })
      }

      // Check unique constraint: new owner might already have a team with the same name
      const existingTeamWithSameName = await prisma.team.findFirst({
        where: {
          user_id: input.newOwnerId,
          name: team.name,
        },
      })

      if (existingTeamWithSameName) {
        throw new TRPCError({
          code: "CONFLICT",
          message: `${newOwnerMembership.user.display_name || newOwnerMembership.user.email} already has a team named "${team.name}"`,
        })
      }

      // Get current owner's email for adding them as member
      const currentOwner = await prisma.user.findUnique({
        where: { id: ctx.auth.userId! },
        select: { email: true },
      })

      if (!currentOwner) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Current owner not found",
        })
      }

      // Perform the transfer in a transaction
      await prisma.$transaction(async (tx) => {
        // 1. Update team owner
        await tx.team.update({
          where: { id: input.teamId },
          data: {
            user_id: input.newOwnerId,
            updated_at: new Date(),
          },
        })

        // 2. Remove new owner from members table (they're now the owner)
        await tx.teamMember.delete({
          where: {
            team_id_user_id: {
              team_id: input.teamId,
              user_id: input.newOwnerId,
            },
          },
        })

        // 3. Add old owner as a member
        await tx.teamMember.create({
          data: {
            team_id: input.teamId,
            user_id: ctx.auth.userId!,
            email: currentOwner.email,
          },
        })
      })

      return {
        success: true,
        newOwner: {
          id: newOwnerMembership.user.id,
          displayName:
            newOwnerMembership.user.display_name ||
            newOwnerMembership.user.email,
        },
      }
    }),

  // === ADMIN PROCEDURES ===

  // Get teams stats for admin dashboard
  adminGetTeamsStats: adminProcedure.query(async () => {
    const [totalTeams, teamsWithMembers, teamsWithGithub, teamsWithSandbox] =
      await Promise.all([
        prisma.team.count(),
        prisma.team.count({
          where: {
            members: { some: {} },
          },
        }),
        prisma.team.count({
          where: {
            github_integration: { not: { equals: {} } },
          },
        }),
        prisma.team.count({
          where: {
            github_sandbox_id: { not: null },
          },
        }),
      ])

    // Get total team members count
    const totalMembers = await prisma.teamMember.count()

    // Get teams created over time (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const teamsOverTime = await prisma.team.groupBy({
      by: ["created_at"],
      where: {
        created_at: { gte: thirtyDaysAgo },
      },
      _count: true,
      orderBy: { created_at: "asc" },
    })

    // Aggregate by day
    const teamsByDay = teamsOverTime.reduce(
      (acc, item) => {
        const day = item.created_at.toISOString().split("T")[0]!
        acc[day] = (acc[day] || 0) + item._count
        return acc
      },
      {} as Record<string, number>,
    )

    // Get canvas projects created over time (last 30 days)
    // Canvas projects have non-empty canvas_snapshot field
    const canvasProjectsOverTime = await prisma.magicProject.groupBy({
      by: ["created_at"],
      where: {
        created_at: { gte: thirtyDaysAgo },
        canvas_snapshot: { not: { equals: null } },
        deleted_at: null,
      },
      _count: true,
      orderBy: { created_at: "asc" },
    })

    // Aggregate canvas projects by day
    const canvasProjectsByDay = canvasProjectsOverTime.reduce(
      (acc, item) => {
        const day = item.created_at.toISOString().split("T")[0]!
        acc[day] = (acc[day] || 0) + item._count
        return acc
      },
      {} as Record<string, number>,
    )

    // Get total canvas projects count
    const totalCanvasProjects = await prisma.magicProject.count({
      where: {
        canvas_snapshot: { not: { equals: null } },
        deleted_at: null,
      },
    })

    return {
      totalTeams,
      teamsWithMembers,
      teamsWithGithub,
      teamsWithSandbox,
      totalMembers,
      teamsByDay,
      canvasProjectsByDay,
      totalCanvasProjects,
    }
  }),

  // Get top teams by member count
  adminGetTopTeams: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
        sortBy: z
          .enum(["members", "created_at", "projects"])
          .default("members"),
      }),
    )
    .query(async ({ input }) => {
      const teams = await prisma.team.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              display_name: true,
              username: true,
              image_url: true,
            },
          },
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  display_name: true,
                  username: true,
                  image_url: true,
                },
              },
            },
          },
          _count: {
            select: {
              members: true,
              magicProjects: { where: { deleted_at: null } },
            },
          },
        },
        orderBy:
          input.sortBy === "members"
            ? { members: { _count: "desc" } }
            : input.sortBy === "projects"
              ? { magicProjects: { _count: "desc" } }
              : { created_at: "desc" },
        take: input.limit,
        skip: input.offset,
      })

      const total = await prisma.team.count()

      return {
        teams: teams.map((team) => ({
          id: team.id,
          name: team.name,
          image_url: team.image_url,
          website_url: team.website_url,
          created_at: team.created_at,
          owner: team.user,
          members: team.members.map((m) => m.user),
          memberCount: team._count.members + 1, // +1 for owner
          projectCount: team._count.magicProjects,
          hasGithub:
            team.github_integration &&
            Object.keys(team.github_integration as object).length > 0,
          hasSandbox: !!team.github_sandbox_id,
          sandboxId: team.github_sandbox_id,
        })),
        total,
      }
    }),

  // Get single team details for admin
  adminGetTeamDetails: adminProcedure
    .input(z.object({ teamId: z.string().uuid() }))
    .query(async ({ input }) => {
      const team = await prisma.team.findUnique({
        where: { id: input.teamId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              display_name: true,
              username: true,
              image_url: true,
              created_at: true,
            },
          },
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  display_name: true,
                  username: true,
                  image_url: true,
                  created_at: true,
                },
              },
            },
            orderBy: { created_at: "asc" },
          },
          magicProjects: {
            where: { deleted_at: null },
            select: {
              id: true,
              name: true,
              created_at: true,
              is_public: true,
              preview_url: true,
            },
            orderBy: { created_at: "desc" },
            take: 10,
          },
          inviteLink: {
            select: { token: true, is_active: true, created_at: true },
          },
          _count: {
            select: {
              members: true,
              magicProjects: { where: { deleted_at: null } },
            },
          },
        },
      })

      if (!team) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Team not found" })
      }

      return {
        ...team,
        memberCount: team._count.members + 1,
        projectCount: team._count.magicProjects,
        hasGithub:
          team.github_integration &&
          Object.keys(team.github_integration as object).length > 0,
        hasSandbox: !!team.github_sandbox_id,
      }
    }),

  // Get all teams with GitHub repos for admin dashboard
  adminGetGitHubRepos: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
        showVerifiedOnly: z.boolean().optional().default(false),
        showUnverifiedOnly: z.boolean().optional().default(false),
      }),
    )
    .query(async ({ input }) => {
      type TeamRow = {
        id: string
        name: string
        image_url: string | null
        website_url: string | null
        created_at: Date
        updated_at: Date
        user_id: string
        github_integration: any
        github_sandbox_id: string | null
      }

      // Get teams with actual GitHub installation based on filter
      let teams: TeamRow[]
      let total: number

      // Common filter: must have installation_id AND repository selected
      // (teams without repository haven't finished GitHub setup)
      // Note: repository is stored in configuration.repository
      if (input.showVerifiedOnly) {
        teams = await prisma.$queryRaw<TeamRow[]>`
          SELECT t.id, t.name, t.image_url, t.website_url, t.created_at, t.updated_at,
                 t.user_id, t.github_integration, t.github_sandbox_id
          FROM teams t
          WHERE t.github_integration->>'installation_id' IS NOT NULL
            AND t.github_integration->>'installation_id' != ''
            AND t.github_integration->'configuration'->>'repository' IS NOT NULL
            AND t.github_integration->'configuration'->>'repository' != ''
            AND (t.github_integration->>'manually_verified')::boolean = true
          ORDER BY t.updated_at DESC NULLS LAST
          LIMIT ${input.limit}
          OFFSET ${input.offset}
        `
        const countResult = await prisma.$queryRaw<[{ count: bigint }]>`
          SELECT COUNT(*) as count FROM teams t
          WHERE t.github_integration->>'installation_id' IS NOT NULL
            AND t.github_integration->>'installation_id' != ''
            AND t.github_integration->'configuration'->>'repository' IS NOT NULL
            AND t.github_integration->'configuration'->>'repository' != ''
            AND (t.github_integration->>'manually_verified')::boolean = true
        `
        total = Number(countResult[0]?.count || 0)
      } else if (input.showUnverifiedOnly) {
        teams = await prisma.$queryRaw<TeamRow[]>`
          SELECT t.id, t.name, t.image_url, t.website_url, t.created_at, t.updated_at,
                 t.user_id, t.github_integration, t.github_sandbox_id
          FROM teams t
          WHERE t.github_integration->>'installation_id' IS NOT NULL
            AND t.github_integration->>'installation_id' != ''
            AND t.github_integration->'configuration'->>'repository' IS NOT NULL
            AND t.github_integration->'configuration'->>'repository' != ''
            AND (t.github_integration->>'manually_verified' IS NULL
                 OR (t.github_integration->>'manually_verified')::boolean = false)
          ORDER BY t.updated_at DESC NULLS LAST
          LIMIT ${input.limit}
          OFFSET ${input.offset}
        `
        const countResult = await prisma.$queryRaw<[{ count: bigint }]>`
          SELECT COUNT(*) as count FROM teams t
          WHERE t.github_integration->>'installation_id' IS NOT NULL
            AND t.github_integration->>'installation_id' != ''
            AND t.github_integration->'configuration'->>'repository' IS NOT NULL
            AND t.github_integration->'configuration'->>'repository' != ''
            AND (t.github_integration->>'manually_verified' IS NULL
                 OR (t.github_integration->>'manually_verified')::boolean = false)
        `
        total = Number(countResult[0]?.count || 0)
      } else {
        teams = await prisma.$queryRaw<TeamRow[]>`
          SELECT t.id, t.name, t.image_url, t.website_url, t.created_at, t.updated_at,
                 t.user_id, t.github_integration, t.github_sandbox_id
          FROM teams t
          WHERE t.github_integration->>'installation_id' IS NOT NULL
            AND t.github_integration->>'installation_id' != ''
            AND t.github_integration->'configuration'->>'repository' IS NOT NULL
            AND t.github_integration->'configuration'->>'repository' != ''
          ORDER BY t.updated_at DESC NULLS LAST
          LIMIT ${input.limit}
          OFFSET ${input.offset}
        `
        const countResult = await prisma.$queryRaw<[{ count: bigint }]>`
          SELECT COUNT(*) as count FROM teams t
          WHERE t.github_integration->>'installation_id' IS NOT NULL
            AND t.github_integration->>'installation_id' != ''
            AND t.github_integration->'configuration'->>'repository' IS NOT NULL
            AND t.github_integration->'configuration'->>'repository' != ''
        `
        total = Number(countResult[0]?.count || 0)
      }

      // Overall counts (without filter) for stats - only teams with repository selected
      const statsResult = await prisma.$queryRaw<
        [{ total: bigint; verified: bigint; with_sandbox: bigint }]
      >`
        SELECT
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE (t.github_integration->>'manually_verified')::boolean = true) as verified,
          COUNT(*) FILTER (WHERE t.github_sandbox_id IS NOT NULL) as with_sandbox
        FROM teams t
        WHERE t.github_integration->>'installation_id' IS NOT NULL
          AND t.github_integration->>'installation_id' != ''
          AND t.github_integration->'configuration'->>'repository' IS NOT NULL
          AND t.github_integration->'configuration'->>'repository' != ''
      `
      const overallTotal = Number(statsResult[0]?.total || 0)
      const verifiedCount = Number(statsResult[0]?.verified || 0)
      const withSandboxCount = Number(statsResult[0]?.with_sandbox || 0)

      // 24h analytics - count repos added in last 24h and previous 24h
      const now = new Date()
      const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      const prev24h = new Date(now.getTime() - 48 * 60 * 60 * 1000)

      const timeStatsResult = await prisma.$queryRaw<
        [{ last_24h: bigint; prev_24h: bigint }]
      >`
        SELECT
          COUNT(*) FILTER (
            WHERE (t.github_integration->>'connected_at')::timestamp >= ${last24h}
          ) as last_24h,
          COUNT(*) FILTER (
            WHERE (t.github_integration->>'connected_at')::timestamp >= ${prev24h}
              AND (t.github_integration->>'connected_at')::timestamp < ${last24h}
          ) as prev_24h
        FROM teams t
        WHERE t.github_integration->>'installation_id' IS NOT NULL
          AND t.github_integration->>'installation_id' != ''
          AND t.github_integration->'configuration'->>'repository' IS NOT NULL
          AND t.github_integration->'configuration'->>'repository' != ''
      `
      const addedLast24h = Number(timeStatsResult[0]?.last_24h || 0)
      const addedPrev24h = Number(timeStatsResult[0]?.prev_24h || 0)

      // Get user info for each team
      const userIds = [...new Set(teams.map((t) => t.user_id))]
      const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: {
          id: true,
          email: true,
          display_name: true,
          username: true,
          image_url: true,
          github_installations: true, // Contains framework_cache
          what_describes_you_best: true, // User role for personalized emails
        },
      })
      const usersMap = new Map(users.map((u) => [u.id, u]))

      // Get member counts
      const memberCounts = await prisma.teamMember.groupBy({
        by: ["team_id"],
        where: { team_id: { in: teams.map((t) => t.id) } },
        _count: true,
      })
      const memberCountMap = new Map(
        memberCounts.map((m) => [m.team_id, m._count]),
      )

      // Get project counts
      const projectCounts = await prisma.magicProject.groupBy({
        by: ["team_id"],
        where: {
          team_id: { in: teams.map((t) => t.id) },
          deleted_at: null,
        },
        _count: true,
      })
      const projectCountMap = new Map(
        projectCounts.map((p) => [p.team_id, p._count]),
      )

      // Process teams to extract GitHub info with framework detection
      const processedTeams = teams.map((team) => {
        const githubIntegration = team.github_integration as {
          installation_id?: string
          github_user?: { login: string; avatar_url?: string }
          configuration?: {
            repository?: string
            folders?: string[]
          }
          connected_at?: string
          manually_verified?: boolean
          verified_at?: string
          verified_by?: string
          outreach_emails?: Array<{
            type: string
            sent_at: string
            sent_by: string
            sent_to: string
          }>
          last_outreach_at?: string
          last_outreach_type?: string
        } | null

        const user = usersMap.get(team.user_id)
        const repository = githubIntegration?.configuration?.repository

        // Get framework from user's cache
        let framework: string | null = null
        let isMonorepo = false
        if (repository && user?.github_installations) {
          const githubInstallationsData = user.github_installations as {
            framework_cache?: Record<string, any>
          }
          const cached = githubInstallationsData?.framework_cache?.[repository]
          if (cached) {
            if (typeof cached === "string") {
              framework = cached
            } else {
              framework = cached.framework || null
              isMonorepo = cached.isMonorepo || false
            }
          }
        }

        return {
          id: team.id,
          name: team.name,
          image_url: team.image_url,
          website_url: team.website_url,
          created_at: team.created_at,
          updated_at: team.updated_at,
          owner: user
            ? {
                id: user.id,
                email: user.email,
                display_name: user.display_name,
                username: user.username,
                image_url: user.image_url,
                role: user.what_describes_you_best,
              }
            : null,
          memberCount: (memberCountMap.get(team.id) || 0) + 1,
          projectCount: projectCountMap.get(team.id) || 0,
          hasSandbox: !!team.github_sandbox_id,
          sandboxId: team.github_sandbox_id,
          // GitHub specific
          repository: repository || null,
          framework,
          isMonorepo,
          githubUser: githubIntegration?.github_user?.login || null,
          githubAvatarUrl: githubIntegration?.github_user?.avatar_url || null,
          installationId: githubIntegration?.installation_id || null,
          connectedAt: githubIntegration?.connected_at || null,
          manuallyVerified: githubIntegration?.manually_verified || false,
          verifiedAt: githubIntegration?.verified_at || null,
          verifiedBy: githubIntegration?.verified_by || null,
          // Outreach tracking
          outreachEmails: githubIntegration?.outreach_emails || [],
          lastOutreachAt: githubIntegration?.last_outreach_at || null,
          lastOutreachType: githubIntegration?.last_outreach_type || null,
        }
      })

      // Calculate framework stats from current page (for display purposes)
      const frameworkStats: Record<string, number> = {}
      processedTeams.forEach((t) => {
        const fw = t.framework || "unknown"
        frameworkStats[fw] = (frameworkStats[fw] || 0) + 1
      })

      return {
        teams: processedTeams,
        total,
        overallTotal,
        verifiedCount,
        unverifiedCount: overallTotal - verifiedCount,
        withSandboxCount,
        frameworkStats,
        // 24h analytics
        addedLast24h,
        addedPrev24h,
        growthPercent:
          addedPrev24h > 0
            ? Math.round(((addedLast24h - addedPrev24h) / addedPrev24h) * 100)
            : addedLast24h > 0
              ? 100
              : 0,
      }
    }),

  // Toggle manually verified status for GitHub repo
  adminToggleGitHubVerified: adminProcedure
    .input(
      z.object({
        teamId: z.string().uuid(),
        verified: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const team = await prisma.team.findUnique({
        where: { id: input.teamId },
        select: { github_integration: true },
      })

      if (!team) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Team not found" })
      }

      const currentIntegration =
        (team.github_integration as Record<string, any>) || {}

      // Get admin user info for audit
      const admin = await prisma.user.findUnique({
        where: { id: ctx.auth.userId! },
        select: { email: true, display_name: true },
      })

      const updatedIntegration = {
        ...currentIntegration,
        manually_verified: input.verified,
        verified_at: input.verified ? new Date().toISOString() : null,
        verified_by: input.verified
          ? admin?.display_name || admin?.email || ctx.auth.userId
          : null,
      }

      await prisma.team.update({
        where: { id: input.teamId },
        data: {
          github_integration: updatedIntegration as any,
        },
      })

      return {
        success: true,
        verified: input.verified,
        verifiedAt: updatedIntegration.verified_at,
        verifiedBy: updatedIntegration.verified_by,
      }
    }),

  // Send canvas outreach email (admin only)
  adminSendCanvasOutreachEmail: adminProcedure
    .input(
      z.object({
        teamId: z.string().uuid(),
        emailType: z.enum([
          "integration_help",
          "missing_env",
          "schedule_call",
          "project_fixed",
        ]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Get team with owner info
      const team = await prisma.team.findUnique({
        where: { id: input.teamId },
        select: {
          id: true,
          name: true,
          user_id: true,
          github_integration: true,
          github_sandbox_id: true,
        },
      })

      if (!team) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Team not found" })
      }

      // Get owner's email and role
      const owner = await prisma.user.findUnique({
        where: { id: team.user_id },
        select: {
          email: true,
          display_name: true,
          username: true,
          what_describes_you_best: true,
        },
      })

      if (!owner?.email) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Team owner email not found",
        })
      }

      // Get repository from github_integration
      const githubIntegration =
        (team.github_integration as Record<string, any>) || {}
      const repository =
        githubIntegration?.configuration?.repository || undefined

      const result = await sendCanvasOutreachEmail({
        email: owner.email,
        emailType: input.emailType as CanvasOutreachEmailType,
        userName: owner.display_name || owner.username || undefined,
        teamName: team.name,
        repository,
        userRole: (owner.what_describes_you_best as UserRole) || undefined,
      })

      if (!result.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error || "Failed to send email",
        })
      }

      // Get admin info for tracking
      const admin = await prisma.user.findUnique({
        where: { id: ctx.auth.userId! },
        select: { display_name: true, email: true },
      })

      // Save email sent info to github_integration
      const existingEmails = githubIntegration.outreach_emails || []
      const updatedIntegration = {
        ...githubIntegration,
        outreach_emails: [
          ...existingEmails,
          {
            type: input.emailType,
            sent_at: new Date().toISOString(),
            sent_by: admin?.display_name || admin?.email || ctx.auth.userId,
            sent_to: owner.email,
          },
        ],
        last_outreach_at: new Date().toISOString(),
        last_outreach_type: input.emailType,
      }

      await prisma.team.update({
        where: { id: input.teamId },
        data: { github_integration: updatedIntegration as any },
      })

      return {
        success: true,
        sentTo: owner.email,
        emailType: input.emailType,
      }
    }),
})
