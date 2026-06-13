import { z } from "zod"

// AnAgentConfig schemas
export const createAgentConfigSchema = z.object({
  teamId: z.string().uuid(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).optional(),
  runtime: z.enum(["claude-code", "codex"]).optional(),
})

export const updateAgentEnvVarsSchema = z.object({
  id: z.string().uuid(),
  envVars: z.record(z.string(), z.string()).nullable(),
})

export const updateAgentConfigSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
  slug: z.string().min(1).max(100).optional(),
})

// AgentSkill schemas
export const createAgentSkillSchema = z.object({
  teamId: z.string().uuid(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  content: z.string().min(1),
  tags: z.array(z.string()).optional(),
})

export const updateAgentSkillSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
  slug: z.string().min(1).max(100).optional(),
  description: z.string().max(500).nullable().optional(),
  content: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
})

// Sandbox/Thread schemas
export const listAnSandboxesSchema = z.object({
  teamId: z.string().uuid(),
  agentId: z.string().uuid().optional(),
  deploymentId: z.string().uuid().optional(),
  status: z.enum(["active", "error"]).optional(),
  search: z.string().max(200).optional(),
  createdAfter: z.string().datetime().optional(),
  createdBefore: z.string().datetime().optional(),
  limit: z.number().int().min(1).max(100).default(50),
  cursor: z.string().uuid().optional(),
})

export const listAnThreadsSchema = z.object({
  teamId: z.string().uuid(),
  agentId: z.string().uuid().optional(),
  deploymentId: z.string().uuid().optional(),
  status: z.enum(["streaming", "completed", "error", "cancelled"]).optional(),
  sandboxId: z.string().uuid().optional(),
  search: z.string().max(200).optional(),
  createdAfter: z.string().datetime().optional(),
  createdBefore: z.string().datetime().optional(),
  limit: z.number().int().min(1).max(100).default(50),
  cursor: z.string().uuid().optional(),
})
