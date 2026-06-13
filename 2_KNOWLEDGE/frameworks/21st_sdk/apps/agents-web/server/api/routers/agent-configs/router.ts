import {
  dedupeAccessibleAgentConfigs,
  getAccessibleAgentTeamIds,
  userHasEnterpriseAgentAccess,
} from "@repo/sandbox-provider/enterprise-access"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@/prisma/client"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { checkTeamAccess } from "../teams/utils"
import {
  createAgentConfigSchema,
  updateAgentConfigSchema,
  updateAgentEnvVarsSchema,
  createAgentSkillSchema,
  updateAgentSkillSchema,
  listAnSandboxesSchema,
  listAnThreadsSchema,
} from "./types"

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

async function hasReadAccessToAgentOwner(ownerTeamId: string, userId: string) {
  try {
    await checkTeamAccess(ownerTeamId, userId)
    return true
  } catch {
    return userHasEnterpriseAgentAccess(userId, ownerTeamId)
  }
}

async function assertAgentReadAccess(ownerTeamId: string, userId: string) {
  const hasAccess = await hasReadAccessToAgentOwner(ownerTeamId, userId)
  if (!hasAccess) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Not found" })
  }
}

function sandboxAccessWhere(teamId: string): Prisma.AnSandboxWhereInput {
  return {
    OR: [
      { agent: { team_id: teamId } },
      { invocation_team_id: teamId },
    ],
  }
}

function threadAccessWhere(teamId: string): Prisma.AnThreadWhereInput {
  return {
    OR: [
      { sandbox: { agent: { team_id: teamId } } },
      { sandbox: { invocation_team_id: teamId } },
    ],
  }
}

function getSandboxInvocationTeamId(sandbox: { invocation_team_id?: string | null; meta?: unknown }) {
  if (typeof sandbox.invocation_team_id === "string") {
    return sandbox.invocation_team_id
  }

  const value = sandbox.meta as Record<string, any> | null | undefined
  return typeof value?.invocation_team_id === "string"
    ? value.invocation_team_id
    : null
}

export const agentConfigsRouter = createTRPCRouter({
  // ─── AnAgentConfig ──────────────────────────────────────────────

  listConfigs: protectedProcedure
    .input(z.object({ teamId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)
      const accessibleTeamIds = await getAccessibleAgentTeamIds(input.teamId)
      const configs = await prisma.anAgentConfig.findMany({
        where: { team_id: { in: accessibleTeamIds } },
        orderBy: { created_at: "desc" },
        include: {
          activeDeployment: {
            select: { id: true, version: true, bundle_hash: true, bundle_url: true, deployed_at: true, metadata: true, status: true, error: true, completed_at: true },
          },
          deployments: {
            where: { status: "building" },
            select: { id: true, version: true, status: true, created_at: true },
            orderBy: { version: "desc" },
            take: 1,
          },
        },
      })

      return dedupeAccessibleAgentConfigs(configs, input.teamId).map((config) => ({
        ...config,
        is_shared: config.team_id !== input.teamId,
        owner_team_id: config.team_id,
      }))
    }),

  getConfig: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const config = await prisma.anAgentConfig.findUnique({
        where: { id: input.id },
        include: {
          activeDeployment: {
            select: { id: true, version: true, bundle_hash: true, bundle_url: true, deployed_at: true, metadata: true, status: true, error: true, completed_at: true },
          },
          deployments: {
            where: { status: "building" },
            select: { id: true, version: true, status: true, created_at: true },
            orderBy: { version: "desc" },
            take: 1,
          },
        },
      })
      // Check access before revealing existence to prevent enumeration
      if (!config) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Not found" })
      }
      await assertAgentReadAccess(config.team_id, ctx.auth.userId!)
      return { ...config, owner_team_id: config.team_id }
    }),

  getDeployment: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const deployment = await prisma.anDeployment.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          agent_id: true,
          version: true,
          bundle_url: true,
          bundle_hash: true,
          status: true,
          error: true,
          metadata: true,
          deployed_at: true,
          created_at: true,
          completed_at: true,
          agent: {
            select: {
              id: true,
              team_id: true,
              name: true,
              slug: true,
              runtime: true,
              env_vars: true,
              active_deployment_id: true,
              activeDeployment: {
                select: { id: true, version: true, bundle_hash: true, deployed_at: true, metadata: true, status: true, error: true, completed_at: true },
              },
            },
          },
        },
      })
      if (!deployment) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Deployment not found" })
      }
      await assertAgentReadAccess(deployment.agent.team_id, ctx.auth.userId!)
      return { ...deployment, owner_team_id: deployment.agent.team_id }
    }),

  createConfig: protectedProcedure
    .input(createAgentConfigSchema)
    .mutation(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)
      const baseSlug = input.slug || slugify(input.name)

      // Find a unique slug by appending -2, -3, etc. if needed
      let slug = baseSlug
      let suffix = 1
      while (true) {
        const existing = await prisma.anAgentConfig.findUnique({
          where: { team_id_slug: { team_id: input.teamId, slug } },
        })
        if (!existing) break
        suffix++
        slug = `${baseSlug}-${suffix}`
      }

      return prisma.anAgentConfig.create({
        data: {
          team_id: input.teamId,
          name: input.name,
          slug,
          runtime: input.runtime ?? "claude-code",
        },
      })
    }),

  updateConfig: protectedProcedure
    .input(updateAgentConfigSchema)
    .mutation(async ({ input, ctx }) => {
      const config = await prisma.anAgentConfig.findUnique({ where: { id: input.id } })
      if (!config) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Not found" })
      }
      await checkTeamAccess(config.team_id, ctx.auth.userId!).catch(() => {
        throw new TRPCError({ code: "NOT_FOUND", message: "Not found" })
      })

      if (input.slug && input.slug !== config.slug) {
        const existing = await prisma.anAgentConfig.findUnique({
          where: { team_id_slug: { team_id: config.team_id, slug: input.slug } },
        })
        if (existing) {
          throw new TRPCError({ code: "CONFLICT", message: "An agent with this slug already exists" })
        }
      }

      return prisma.anAgentConfig.update({
        where: { id: input.id },
        data: {
          ...(input.name !== undefined && { name: input.name }),
          ...(input.slug !== undefined && { slug: input.slug }),
          updated_at: new Date(),
        },
      })
    }),

  deleteConfig: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const config = await prisma.anAgentConfig.findUnique({ where: { id: input.id } })
      if (!config) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Not found" })
      }
      await checkTeamAccess(config.team_id, ctx.auth.userId!).catch(() => {
        throw new TRPCError({ code: "NOT_FOUND", message: "Not found" })
      })
      await prisma.anAgentConfig.delete({ where: { id: input.id } })
      return { success: true }
    }),

  redeployConfig: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const config = await prisma.anAgentConfig.findUnique({
        where: { id: input.id },
        include: {
          activeDeployment: {
            select: {
              id: true,
              version: true,
              bundle_url: true,
              bundle_hash: true,
              sandbox_config: true,
              metadata: true,
            },
          },
        },
      })
      if (!config) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Agent config not found" })
      }
      if (!config.activeDeployment) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "No active deployment to redeploy" })
      }
      await checkTeamAccess(config.team_id, ctx.auth.userId!)

      const currentDep = config.activeDeployment

      // Use a transaction to prevent version race conditions
      const result = await prisma.$transaction(async (tx) => {
        const lastDeployment = await tx.anDeployment.findFirst({
          where: { agent_id: config.id },
          orderBy: { version: "desc" },
          select: { version: true },
        })
        const nextVersion = (lastDeployment?.version ?? 0) + 1

        const dep = await tx.anDeployment.create({
          data: {
            agent_id: config.id,
            version: nextVersion,
            bundle_url: currentDep.bundle_url,
            bundle_hash: currentDep.bundle_hash,
            sandbox_config: currentDep.sandbox_config ?? Prisma.JsonNull,
            metadata: currentDep.metadata ?? Prisma.JsonNull,
            status: "ready",
            completed_at: new Date(),
          },
        })

        await tx.anAgentConfig.update({
          where: { id: config.id },
          data: {
            active_deployment_id: dep.id,
            bundle_url: currentDep.bundle_url,
            bundle_hash: currentDep.bundle_hash,
            deployed_at: dep.deployed_at,
            updated_at: new Date(),
          },
        })

        return dep
      })

      const metadata = currentDep.metadata as { tools?: unknown[] } | null
      const hasTools = Array.isArray(metadata?.tools) && metadata.tools.length > 0

      return { version: result.version, hasTools }
    }),

  updateEnvVars: protectedProcedure
    .input(updateAgentEnvVarsSchema)
    .mutation(async ({ input, ctx }) => {
      const config = await prisma.anAgentConfig.findUnique({ where: { id: input.id } })
      if (!config) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Not found" })
      }
      await checkTeamAccess(config.team_id, ctx.auth.userId!).catch(() => {
        throw new TRPCError({ code: "NOT_FOUND", message: "Not found" })
      })
      return prisma.anAgentConfig.update({
        where: { id: input.id },
        data: {
          env_vars: input.envVars ?? Prisma.JsonNull,
          updated_at: new Date(),
        },
      })
    }),

  // ─── AgentSkill ───────────────────────────────────────────────

  listSkills: protectedProcedure
    .input(z.object({ teamId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)
      return prisma.agentSkill.findMany({
        where: { team_id: input.teamId },
        orderBy: { created_at: "desc" },
      })
    }),

  getSkill: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const skill = await prisma.agentSkill.findUnique({ where: { id: input.id } })
      if (!skill) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Skill not found" })
      }
      await checkTeamAccess(skill.team_id, ctx.auth.userId!)
      return skill
    }),

  createSkill: protectedProcedure
    .input(createAgentSkillSchema)
    .mutation(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)
      const slug = input.slug || slugify(input.name)

      const existing = await prisma.agentSkill.findUnique({
        where: { team_id_slug: { team_id: input.teamId, slug } },
      })
      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: "A skill with this slug already exists" })
      }

      return prisma.agentSkill.create({
        data: {
          team_id: input.teamId,
          name: input.name,
          slug,
          description: input.description,
          content: input.content,
          tags: input.tags ?? [],
        },
      })
    }),

  updateSkill: protectedProcedure
    .input(updateAgentSkillSchema)
    .mutation(async ({ input, ctx }) => {
      const skill = await prisma.agentSkill.findUnique({ where: { id: input.id } })
      if (!skill) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Skill not found" })
      }
      await checkTeamAccess(skill.team_id, ctx.auth.userId!)

      if (input.slug && input.slug !== skill.slug) {
        const existing = await prisma.agentSkill.findUnique({
          where: { team_id_slug: { team_id: skill.team_id, slug: input.slug } },
        })
        if (existing) {
          throw new TRPCError({ code: "CONFLICT", message: "A skill with this slug already exists" })
        }
      }

      return prisma.agentSkill.update({
        where: { id: input.id },
        data: {
          ...(input.name !== undefined && { name: input.name }),
          ...(input.slug !== undefined && { slug: input.slug }),
          ...(input.description !== undefined && { description: input.description }),
          ...(input.content !== undefined && { content: input.content }),
          ...(input.tags !== undefined && { tags: input.tags }),
          updated_at: new Date(),
        },
      })
    }),

  deleteSkill: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const skill = await prisma.agentSkill.findUnique({ where: { id: input.id } })
      if (!skill) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Skill not found" })
      }
      await checkTeamAccess(skill.team_id, ctx.auth.userId!)
      await prisma.agentSkill.delete({ where: { id: input.id } })
      return { success: true }
    }),

  // ─── Sandbox/Thread ──────────────────────────────────────────

  listSandboxes: protectedProcedure
    .input(listAnSandboxesSchema)
    .query(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)

      const andFilters: Prisma.AnSandboxWhereInput[] = [
        sandboxAccessWhere(input.teamId),
      ]
      const where: Prisma.AnSandboxWhereInput = {
        AND: andFilters,
      }
      if (input.agentId) where.agent_id = input.agentId
      if (input.deploymentId) where.deployment_id = input.deploymentId
      if (input.status) where.status = input.status
      if (input.search) {
        andFilters.push({
          OR: [
            { client_sandbox_id: { contains: input.search, mode: "insensitive" } },
            { sandbox_id: { contains: input.search, mode: "insensitive" } },
          ],
        })
      }
      if (input.createdAfter || input.createdBefore) {
        where.created_at = {
          ...(input.createdAfter && { gte: new Date(input.createdAfter) }),
          ...(input.createdBefore && { lte: new Date(input.createdBefore) }),
        }
      }

      const sandboxes = await prisma.anSandbox.findMany({
        where,
        orderBy: { created_at: "desc" },
        take: input.limit + 1,
        ...(input.cursor && {
          cursor: { id: input.cursor },
          skip: 1,
        }),
        include: {
          agent: { select: { id: true, name: true, slug: true } },
          threads: {
            select: {
              id: true,
              status: true,
              stream_id: true,
              claude_session_id: true,
              input_tokens: true,
              output_tokens: true,
              total_tokens: true,
              total_cost_usd: true,
              duration_ms: true,
              created_at: true,
              completed_at: true,
              error: true,
            },
            orderBy: { created_at: "desc" },
          },
        },
      })

      const hasMore = sandboxes.length > input.limit
      if (hasMore) sandboxes.pop()

      return {
        sandboxes,
        nextCursor: hasMore ? sandboxes[sandboxes.length - 1]?.id : undefined,
      }
    }),

  getSandbox: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const sandbox = await prisma.anSandbox.findUnique({
        where: { id: input.id },
        include: {
          agent: { select: { id: true, name: true, slug: true, team_id: true } },
          threads: { orderBy: { created_at: "asc" } },
        },
      })
      if (!sandbox) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Sandbox not found" })
      }
      const invocationTeamId = getSandboxInvocationTeamId(sandbox)
      if (invocationTeamId) {
        await checkTeamAccess(invocationTeamId, ctx.auth.userId!).catch(async () => {
          await assertAgentReadAccess(sandbox.agent.team_id, ctx.auth.userId!)
        })
      } else {
        await assertAgentReadAccess(sandbox.agent.team_id, ctx.auth.userId!)
      }
      return sandbox
    }),

  getThreadSpans: protectedProcedure
    .input(z.object({ threadId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const thread = await prisma.anThread.findUnique({
        where: { id: input.threadId },
        include: { sandbox: { include: { agent: { select: { team_id: true } } } } },
      })
      if (!thread) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Thread not found" })
      }
      const invocationTeamId = getSandboxInvocationTeamId(thread.sandbox)
      if (invocationTeamId) {
        await checkTeamAccess(invocationTeamId, ctx.auth.userId!).catch(async () => {
          await assertAgentReadAccess(thread.sandbox.agent.team_id, ctx.auth.userId!)
        })
      } else {
        await assertAgentReadAccess(thread.sandbox.agent.team_id, ctx.auth.userId!)
      }
      const spans = await prisma.anSpan.findMany({
        where: { thread_id: input.threadId },
        orderBy: { start_time: "asc" },
      })
      return { spans }
    }),

  getThreadStatusCounts: protectedProcedure
    .input(
      z.object({
        teamId: z.string().uuid(),
        agentId: z.string().uuid().optional(),
        sandboxId: z.string().uuid().optional(),
        search: z.string().max(200).optional(),
        createdAfter: z.string().datetime().optional(),
        createdBefore: z.string().datetime().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)

      const andFilters: Prisma.AnThreadWhereInput[] = [
        threadAccessWhere(input.teamId),
      ]
      const where: Prisma.AnThreadWhereInput = {
        AND: andFilters,
      }
      if (input.agentId) andFilters.push({ sandbox: { agent_id: input.agentId } })
      if (input.sandboxId) where.sandbox_id = input.sandboxId
      if (input.search) {
        andFilters.push({
          OR: [
            { messages: { string_contains: input.search } },
            { sandbox: { client_sandbox_id: { contains: input.search, mode: "insensitive" } } },
            { sandbox: { sandbox_id: { contains: input.search, mode: "insensitive" } } },
          ],
        })
      }
      if (input.createdAfter || input.createdBefore) {
        where.created_at = {
          ...(input.createdAfter && { gte: new Date(input.createdAfter) }),
          ...(input.createdBefore && { lte: new Date(input.createdBefore) }),
        }
      }

      const groups = await prisma.anThread.groupBy({
        by: ["status"],
        where,
        _count: { _all: true },
      })

      const counts: Record<string, number> = {}
      for (const g of groups) {
        counts[g.status] = g._count._all
      }
      return counts
    }),

  getThreadCountsByAgent: protectedProcedure
    .input(
      z.object({
        teamId: z.string().uuid(),
      }),
    )
    .query(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)

      const sandboxes = await prisma.anSandbox.findMany({
        where: sandboxAccessWhere(input.teamId),
        select: {
          agent_id: true,
          agent: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              threads: true,
            },
          },
        },
      })

      const counts = new Map<string, { id: string; name: string; threadCount: number }>()
      for (const sandbox of sandboxes) {
        const current = counts.get(sandbox.agent_id) ?? {
          id: sandbox.agent.id,
          name: sandbox.agent.name,
          threadCount: 0,
        }
        current.threadCount += sandbox._count.threads
        counts.set(sandbox.agent_id, current)
      }

      return Array.from(counts.values())
    }),

  listThreads: protectedProcedure
    .input(listAnThreadsSchema)
    .query(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)

      const andFilters: Prisma.AnThreadWhereInput[] = [
        threadAccessWhere(input.teamId),
      ]
      const where: Prisma.AnThreadWhereInput = {
        AND: andFilters,
      }
      if (input.agentId) andFilters.push({ sandbox: { agent_id: input.agentId } })
      if (input.deploymentId) where.deployment_id = input.deploymentId
      if (input.status) where.status = input.status
      if (input.sandboxId) where.sandbox_id = input.sandboxId
      if (input.search) {
        andFilters.push({
          OR: [
            { messages: { string_contains: input.search } },
            { sandbox: { client_sandbox_id: { contains: input.search, mode: "insensitive" } } },
            { sandbox: { sandbox_id: { contains: input.search, mode: "insensitive" } } },
          ],
        })
      }
      if (input.createdAfter || input.createdBefore) {
        where.created_at = {
          ...(input.createdAfter && { gte: new Date(input.createdAfter) }),
          ...(input.createdBefore && { lte: new Date(input.createdBefore) }),
        }
      }

      const threads = await prisma.anThread.findMany({
        where,
        orderBy: { created_at: "desc" },
        take: input.limit + 1,
        ...(input.cursor && {
          cursor: { id: input.cursor },
          skip: 1,
        }),
        select: {
          id: true,
          status: true,
          stream_id: true,
          claude_session_id: true,
          input_tokens: true,
          output_tokens: true,
          total_tokens: true,
          total_cost_usd: true,
          duration_ms: true,
          created_at: true,
          completed_at: true,
          error: true,
          messages: true,
          sandbox_id: true,
          sandbox: {
            select: {
              id: true,
              client_sandbox_id: true,
              sandbox_id: true,
              agent: { select: { id: true, name: true, slug: true } },
            },
          },
          _count: {
            select: {
              spans: { where: { status: "error" } },
            },
          },
        },
      })

      const hasMore = threads.length > input.limit
      if (hasMore) threads.pop()

      // Extract message preview server-side
      const threadsWithPreview = threads.map((thread) => {
        let preview: string | null = null
        try {
          const msgs = thread.messages as any[] | null
          if (msgs?.length) {
            const firstUser = msgs.find((m: any) => m.role === "user")
            if (firstUser) {
              const text =
                firstUser.parts?.find((p: any) => p.type === "text")?.text ??
                firstUser.content ??
                null
              if (text) {
                preview = text.length > 80 ? text.slice(0, 80) + "..." : text
              }
            }
          }
        } catch {}
        const { messages: _messages, _count, ...rest } = thread
        return { ...rest, preview, error_span_count: _count.spans }
      })

      return {
        threads: threadsWithPreview,
        nextCursor: hasMore ? threads[threads.length - 1]?.id : undefined,
      }
    }),

  listAllDeployments: protectedProcedure
    .input(z.object({
      teamId: z.string().uuid(),
      agentId: z.string().uuid().optional(),
      status: z.enum(["building", "ready", "failed"]).optional(),
      limit: z.number().min(1).max(100).default(50),
      cursor: z.string().uuid().optional(),
    }))
    .query(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)
      const accessibleTeamIds = await getAccessibleAgentTeamIds(input.teamId)

      const where: Prisma.AnDeploymentWhereInput = {
        agent: { team_id: { in: accessibleTeamIds } },
        ...(input.agentId && { agent_id: input.agentId }),
        ...(input.status && { status: input.status }),
      }

      const deployments = await prisma.anDeployment.findMany({
        where,
        orderBy: { created_at: "desc" },
        take: input.limit + 1,
        ...(input.cursor && {
          cursor: { id: input.cursor },
          skip: 1,
        }),
        select: {
          id: true,
          agent_id: true,
          version: true,
          bundle_hash: true,
          status: true,
          error: true,
          metadata: true,
          deployed_at: true,
          created_at: true,
          completed_at: true,
          agent: {
            select: { id: true, name: true, slug: true, active_deployment_id: true },
          },
        },
      })

      const hasMore = deployments.length > input.limit
      if (hasMore) deployments.pop()

      return {
        deployments,
        nextCursor: hasMore ? deployments[deployments.length - 1]?.id : undefined,
      }
    }),

  listDeployments: protectedProcedure
    .input(z.object({
      agentId: z.string().uuid(),
      limit: z.number().min(1).max(100).default(50),
      cursor: z.string().uuid().optional(),
    }))
    .query(async ({ input, ctx }) => {
      const config = await prisma.anAgentConfig.findUnique({
        where: { id: input.agentId },
        select: { team_id: true, active_deployment_id: true },
      })
      if (!config) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Agent config not found" })
      }
      await assertAgentReadAccess(config.team_id, ctx.auth.userId!)

      const deployments = await prisma.anDeployment.findMany({
        where: { agent_id: input.agentId },
        orderBy: { version: "desc" },
        take: input.limit + 1,
        ...(input.cursor && {
          cursor: { id: input.cursor },
          skip: 1,
        }),
        select: {
          id: true,
          version: true,
          bundle_hash: true,
          status: true,
          error: true,
          metadata: true,
          deployed_at: true,
          created_at: true,
          completed_at: true,
        },
      })

      const hasMore = deployments.length > input.limit
      if (hasMore) deployments.pop()

      return {
        deployments,
        activeDeploymentId: config.active_deployment_id,
        nextCursor: hasMore ? deployments[deployments.length - 1]?.id : undefined,
      }
    }),

  publicStats: publicProcedure.query(async () => {
    const totalAgents = await prisma.anAgentConfig.count({
      where: { deployed_at: { not: null } },
    })
    return { totalAgents }
  }),
})
