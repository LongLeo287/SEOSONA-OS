import { prisma } from "@/lib/prisma"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { checkTeamAccess } from "../teams/utils"

// Trigger types for GitHub events
export const GITHUB_TRIGGER_TYPES = [
  "pr_opened",
  "pr_closed",
  "pr_merged",
  "pr_commits_pushed",
  "issue_opened",
  "issue_closed",
  "issue_comment_created",
  "push",
  "branch_created",
  "workflow_failed",
] as const

export type GitHubTriggerType = (typeof GITHUB_TRIGGER_TYPES)[number]

// Trigger types for Linear events
export const LINEAR_TRIGGER_TYPES = [
  "linear_issue_created",
  "linear_issue_updated",
  "linear_label_added",
  "linear_issue_assigned",
  "linear_comment_created",
  "linear_issue_state_changed",
] as const

export type LinearTriggerType = (typeof LINEAR_TRIGGER_TYPES)[number]

// Trigger types for Discord events
export const DISCORD_TRIGGER_TYPES = [
  "discord_slash_command",
] as const

export type DiscordTriggerType = (typeof DISCORD_TRIGGER_TYPES)[number]

// Combined trigger types
export const TRIGGER_TYPES = [...GITHUB_TRIGGER_TYPES, ...LINEAR_TRIGGER_TYPES, ...DISCORD_TRIGGER_TYPES] as const
export type TriggerType = (typeof TRIGGER_TYPES)[number]

// Platform types
export const PLATFORMS = ["github", "linear", "discord"] as const
export type Platform = (typeof PLATFORMS)[number]

// Filter types
export const FILTER_TYPES = [
  // GitHub filters
  "repository",
  "author",
  "merged_by",
  "pushed_by",
  "commented_by",
  "branch",
  "branch_names",
  "tag_names",
  "comment_on",
  "label",
  "draft",
  "ref_type",
  "workflow",
  "bot",
  // Linear filters
  "linear_project",
  "linear_team",
  "linear_creator",
  "linear_assignee",
  "linear_label",
  "linear_state",
  "linear_priority",
  // Discord filters
  "discord_channel",
  "discord_user",
] as const

export type FilterType = (typeof FILTER_TYPES)[number]

// Filter rule schema
const filterRuleSchema = z.object({
  type: z.enum(FILTER_TYPES),
  operator: z.enum(["equals", "not_equals", "matches", "includes"]),
  value: z.union([z.string(), z.array(z.string()), z.boolean()]),
})

export type FilterRule = z.infer<typeof filterRuleSchema>

// Trigger config schema
const triggerConfigSchema = z.object({
  id: z.string().uuid(),
  platform: z.enum(PLATFORMS).default("github"),
  trigger_type: z.enum(TRIGGER_TYPES),
  filters: z.array(filterRuleSchema).default([]),
  selectedInstallationId: z.string().optional(),
  selectedAccountName: z.string().optional(),
})

export type TriggerConfig = z.infer<typeof triggerConfigSchema>

// Input schemas
const createAutomationSchema = z.object({
  teamId: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  triggerType: z.enum(TRIGGER_TYPES).optional(),
  triggers: z.array(triggerConfigSchema).optional(),
  agentPrompt: z.string().max(5000).optional(),
  addToInbox: z.boolean().optional(),
  respondToTrigger: z.boolean().optional(),
  targetRepository: z.string().optional(),
})

const updateAutomationSchema = z.object({
  automationId: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  triggers: z.array(triggerConfigSchema).optional(),
  agentPrompt: z.string().max(5000).optional().nullable(),
  isEnabled: z.boolean().optional(),
  addToInbox: z.boolean().optional(),
  respondToTrigger: z.boolean().optional(),
  targetRepository: z.string().optional().nullable(),
})

export const automationsRouter = createTRPCRouter({
  listAutomations: protectedProcedure
    .input(z.object({ teamId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)

      const automations = await prisma.automation.findMany({
        where: { team_id: input.teamId },
        orderBy: { created_at: "desc" },
        select: {
          id: true,
          name: true,
          description: true,
          platform: true,
          triggers: true,
          agent_prompt: true,
          target_repository: true,
          is_enabled: true,
          add_to_inbox: true,
          respond_to_trigger: true,
          execution_count: true,
          last_executed: true,
          created_at: true,
          updated_at: true,
        },
      })

      return automations.map((a) => ({
        ...a,
        triggers: (a.triggers as TriggerConfig[]) || [],
      }))
    }),

  getAutomation: protectedProcedure
    .input(z.object({ automationId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const automation = await prisma.automation.findUnique({
        where: { id: input.automationId },
        include: {
          executions: {
            orderBy: { created_at: "desc" },
            take: 10,
            select: {
              id: true,
              external_id: true,
              external_url: true,
              status: true,
              error_message: true,
              created_at: true,
              chat_id: true,
            },
          },
        },
      })

      if (!automation) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Automation not found" })
      }

      await checkTeamAccess(automation.team_id, ctx.auth.userId!)

      return {
        ...automation,
        triggers: (automation.triggers as TriggerConfig[]) || [],
      }
    }),

  createAutomation: protectedProcedure
    .input(createAutomationSchema)
    .mutation(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)

      const existing = await prisma.automation.findUnique({
        where: { team_id_name: { team_id: input.teamId, name: input.name } },
      })

      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: "Automation with this name already exists" })
      }

      // Build triggers array
      let triggers: TriggerConfig[] = input.triggers || []

      // If single triggerType provided, create a trigger from it
      if (triggers.length === 0 && input.triggerType) {
        triggers = [{
          id: crypto.randomUUID(),
          platform: "github",
          trigger_type: input.triggerType,
          filters: [],
        }]
      }

      // Detect platform from first trigger
      const detectedPlatform = triggers[0]?.platform || "github"

      const automation = await prisma.automation.create({
        data: {
          team_id: input.teamId,
          name: input.name,
          description: input.description,
          platform: detectedPlatform,
          triggers: triggers,
          agent_prompt: input.agentPrompt,
          target_repository: input.targetRepository,
          add_to_inbox: input.addToInbox ?? false,
          respond_to_trigger: input.respondToTrigger ?? true,
          is_enabled: true,
          created_by: ctx.auth.userId!,
        },
      })

      return { ...automation, triggers }
    }),

  updateAutomation: protectedProcedure
    .input(updateAutomationSchema)
    .mutation(async ({ input, ctx }) => {
      const automation = await prisma.automation.findUnique({
        where: { id: input.automationId },
      })

      if (!automation) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Automation not found" })
      }

      await checkTeamAccess(automation.team_id, ctx.auth.userId!)

      if (input.name && input.name !== automation.name) {
        const existing = await prisma.automation.findUnique({
          where: { team_id_name: { team_id: automation.team_id, name: input.name } },
        })
        if (existing) {
          throw new TRPCError({ code: "CONFLICT", message: "Automation with this name already exists" })
        }
      }

      const updated = await prisma.automation.update({
        where: { id: input.automationId },
        data: {
          ...(input.name && { name: input.name }),
          ...(input.description !== undefined && { description: input.description }),
          ...(input.triggers !== undefined && { triggers: input.triggers }),
          ...(input.agentPrompt !== undefined && { agent_prompt: input.agentPrompt }),
          ...(input.isEnabled !== undefined && { is_enabled: input.isEnabled }),
          ...(input.addToInbox !== undefined && { add_to_inbox: input.addToInbox }),
          ...(input.respondToTrigger !== undefined && { respond_to_trigger: input.respondToTrigger }),
          ...(input.targetRepository !== undefined && { target_repository: input.targetRepository }),
          updated_at: new Date(),
        },
      })

      return {
        ...updated,
        triggers: (updated.triggers as TriggerConfig[]) || [],
      }
    }),

  deleteAutomation: protectedProcedure
    .input(z.object({ automationId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const automation = await prisma.automation.findUnique({
        where: { id: input.automationId },
      })

      if (!automation) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Automation not found" })
      }

      await checkTeamAccess(automation.team_id, ctx.auth.userId!)

      await prisma.automation.delete({ where: { id: input.automationId } })

      return { success: true }
    }),

  toggleAutomation: protectedProcedure
    .input(z.object({ automationId: z.string().uuid(), isEnabled: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      const automation = await prisma.automation.findUnique({
        where: { id: input.automationId },
      })

      if (!automation) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Automation not found" })
      }

      await checkTeamAccess(automation.team_id, ctx.auth.userId!)

      await prisma.automation.update({
        where: { id: input.automationId },
        data: { is_enabled: input.isEnabled, updated_at: new Date() },
      })

      return { success: true }
    }),

  addTrigger: protectedProcedure
    .input(z.object({
      automationId: z.string().uuid(),
      platform: z.enum(PLATFORMS).default("github"),
      triggerType: z.enum(TRIGGER_TYPES),
      filters: z.array(filterRuleSchema).default([]),
      installationId: z.string().optional(),
      accountName: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const automation = await prisma.automation.findUnique({
        where: { id: input.automationId },
      })

      if (!automation) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Automation not found" })
      }

      await checkTeamAccess(automation.team_id, ctx.auth.userId!)

      const existingTriggers = (automation.triggers as TriggerConfig[]) || []
      const newTrigger: TriggerConfig = {
        id: crypto.randomUUID(),
        platform: input.platform,
        trigger_type: input.triggerType,
        filters: input.filters,
        ...(input.installationId && { selectedInstallationId: input.installationId }),
        ...(input.accountName && { selectedAccountName: input.accountName }),
      }
      const updatedTriggers = [...existingTriggers, newTrigger]

      const updated = await prisma.automation.update({
        where: { id: input.automationId },
        data: { triggers: updatedTriggers, updated_at: new Date() },
      })

      return { ...updated, triggers: updatedTriggers }
    }),

  removeTrigger: protectedProcedure
    .input(z.object({ automationId: z.string().uuid(), triggerId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const automation = await prisma.automation.findUnique({
        where: { id: input.automationId },
      })

      if (!automation) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Automation not found" })
      }

      await checkTeamAccess(automation.team_id, ctx.auth.userId!)

      const existingTriggers = (automation.triggers as TriggerConfig[]) || []
      const updatedTriggers = existingTriggers.filter((t) => t.id !== input.triggerId)

      const updated = await prisma.automation.update({
        where: { id: input.automationId },
        data: { triggers: updatedTriggers, updated_at: new Date() },
      })

      return { ...updated, triggers: updatedTriggers }
    }),

  updateTrigger: protectedProcedure
    .input(z.object({
      automationId: z.string().uuid(),
      triggerId: z.string().uuid(),
      platform: z.enum(PLATFORMS).optional(),
      triggerType: z.enum(TRIGGER_TYPES).optional(),
      filters: z.array(filterRuleSchema).optional(),
      installationId: z.string().optional(),
      accountName: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const automation = await prisma.automation.findUnique({
        where: { id: input.automationId },
      })

      if (!automation) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Automation not found" })
      }

      await checkTeamAccess(automation.team_id, ctx.auth.userId!)

      const existingTriggers = (automation.triggers as TriggerConfig[]) || []
      const updatedTriggers = existingTriggers.map((t) => {
        if (t.id === input.triggerId) {
          return {
            ...t,
            ...(input.platform !== undefined && { platform: input.platform }),
            ...(input.triggerType !== undefined && { trigger_type: input.triggerType }),
            ...(input.filters !== undefined && { filters: input.filters }),
            ...(input.installationId !== undefined && { selectedInstallationId: input.installationId }),
            ...(input.accountName !== undefined && { selectedAccountName: input.accountName }),
          }
        }
        return t
      })

      const updated = await prisma.automation.update({
        where: { id: input.automationId },
        data: { triggers: updatedTriggers, updated_at: new Date() },
      })

      return { ...updated, triggers: updatedTriggers }
    }),

  listExecutions: protectedProcedure
    .input(z.object({
      automationId: z.string().uuid(),
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input, ctx }) => {
      const automation = await prisma.automation.findUnique({
        where: { id: input.automationId },
      })

      if (!automation) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Automation not found" })
      }

      await checkTeamAccess(automation.team_id, ctx.auth.userId!)

      const [executions, total] = await Promise.all([
        prisma.automationExecution.findMany({
          where: { automation_id: input.automationId },
          orderBy: { created_at: "desc" },
          take: input.limit,
          skip: input.offset,
        }),
        prisma.automationExecution.count({
          where: { automation_id: input.automationId },
        }),
      ])

      return { executions, total }
    }),

  // ============================================================================
  // Inbox Procedures
  // ============================================================================

  getInboxChats: protectedProcedure
    .input(z.object({
      teamId: z.string().uuid(),
      limit: z.number().min(1).max(100).default(50),
      cursor: z.string().uuid().optional(),
    }))
    .query(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)

      // Find automations with add_to_inbox=true created by current user
      const automations = await prisma.automation.findMany({
        where: {
          team_id: input.teamId,
          add_to_inbox: true,
          created_by: ctx.auth.userId!,
        },
        select: { id: true, name: true },
      })

      if (automations.length === 0) {
        return { chats: [], nextCursor: undefined }
      }

      const automationIds = automations.map(a => a.id)
      const automationMap = new Map(automations.map(a => [a.id, a]))

      // Get executions for those automations that have a chat_id
      const executions = await prisma.automationExecution.findMany({
        where: {
          automation_id: { in: automationIds },
          chat_id: { not: null },
          ...(input.cursor && {
            created_at: {
              lt: (await prisma.agentChat.findUnique({
                where: { id: input.cursor },
                select: { created_at: true },
              }))?.created_at,
            },
          }),
        },
        orderBy: { created_at: "desc" },
        take: input.limit + 1,
        select: {
          id: true,
          chat_id: true,
          automation_id: true,
          external_url: true,
          status: true,
          created_at: true,
        },
      })

      // Fetch the associated chats
      const chatIds = executions.map(e => e.chat_id).filter(Boolean) as string[]
      const chats = await prisma.agentChat.findMany({
        where: { id: { in: chatIds } },
        select: {
          id: true,
          name: true,
          created_at: true,
          meta: true,
        },
      })

      const chatMap = new Map(chats.map(c => [c.id, c]))

      // Get read status for these executions
      const executionIds = executions.map(e => e.id)
      const readItems = await prisma.inboxRead.findMany({
        where: {
          user_id: ctx.auth.userId!,
          execution_id: { in: executionIds },
        },
        select: { execution_id: true },
      })
      const readSet = new Set(readItems.map(r => r.execution_id))

      // Build result with automation info and read status
      const items = executions
        .slice(0, input.limit)
        .map(exec => {
          const chat = exec.chat_id ? chatMap.get(exec.chat_id) : null
          const automation = automationMap.get(exec.automation_id)
          if (!chat) return null
          return {
            id: chat.id,
            executionId: exec.id,
            name: chat.name,
            createdAt: chat.created_at,
            meta: chat.meta,
            automationId: exec.automation_id,
            automationName: automation?.name || "Unknown",
            externalUrl: exec.external_url,
            status: exec.status,
            isRead: readSet.has(exec.id),
          }
        })
        .filter((item): item is NonNullable<typeof item> => item !== null)

      const hasMore = executions.length > input.limit
      const nextCursor = hasMore ? items[items.length - 1]?.id : undefined

      return { chats: items, nextCursor }
    }),

  getInboxUnreadCount: protectedProcedure
    .input(z.object({ teamId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)

      // Find automations with add_to_inbox=true created by current user
      const automations = await prisma.automation.findMany({
        where: {
          team_id: input.teamId,
          add_to_inbox: true,
          created_by: ctx.auth.userId!,
        },
        select: { id: true },
      })

      if (automations.length === 0) {
        return { count: 0 }
      }

      const automationIds = automations.map(a => a.id)

      // Get all execution IDs for these automations
      const executions = await prisma.automationExecution.findMany({
        where: {
          automation_id: { in: automationIds },
          chat_id: { not: null },
        },
        select: { id: true },
      })

      if (executions.length === 0) {
        return { count: 0 }
      }

      const executionIds = executions.map(e => e.id)

      // Count how many have been read by this user
      const readCount = await prisma.inboxRead.count({
        where: {
          user_id: ctx.auth.userId!,
          execution_id: { in: executionIds },
        },
      })

      return { count: executions.length - readCount }
    }),

  markInboxItemRead: protectedProcedure
    .input(z.object({ executionId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      // Verify the execution exists and belongs to user's automation
      const execution = await prisma.automationExecution.findUnique({
        where: { id: input.executionId },
        include: { automation: { select: { created_by: true } } },
      })

      if (!execution || execution.automation.created_by !== ctx.auth.userId) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Execution not found" })
      }

      // Upsert the read record
      await prisma.inboxRead.upsert({
        where: {
          user_id_execution_id: {
            user_id: ctx.auth.userId!,
            execution_id: input.executionId,
          },
        },
        create: {
          user_id: ctx.auth.userId!,
          execution_id: input.executionId,
        },
        update: {},
      })

      return { success: true }
    }),

  markAllInboxItemsRead: protectedProcedure
    .input(z.object({ teamId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)

      const automations = await prisma.automation.findMany({
        where: {
          team_id: input.teamId,
          add_to_inbox: true,
          created_by: ctx.auth.userId!,
        },
        select: { id: true },
      })

      if (automations.length === 0) return { success: true, count: 0 }

      const automationIds = automations.map(a => a.id)

      const executions = await prisma.automationExecution.findMany({
        where: {
          automation_id: { in: automationIds },
          chat_id: { not: null },
        },
        select: { id: true },
      })

      const executionIds = executions.map(e => e.id)

      // Find which ones are already read
      const alreadyRead = await prisma.inboxRead.findMany({
        where: {
          user_id: ctx.auth.userId!,
          execution_id: { in: executionIds },
        },
        select: { execution_id: true },
      })
      const readSet = new Set(alreadyRead.map(r => r.execution_id))

      const unreadIds = executionIds.filter(id => !readSet.has(id))

      if (unreadIds.length > 0) {
        await prisma.inboxRead.createMany({
          data: unreadIds.map(executionId => ({
            user_id: ctx.auth.userId!,
            execution_id: executionId,
          })),
          skipDuplicates: true,
        })
      }

      return { success: true, count: unreadIds.length }
    }),
})
