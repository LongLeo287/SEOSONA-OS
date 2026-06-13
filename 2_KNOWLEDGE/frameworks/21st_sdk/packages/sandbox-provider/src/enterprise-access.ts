import { and, eq, sql } from "drizzle-orm"
import { drizzle } from "drizzle-orm/postgres-js"
import {
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core"
import postgres from "postgres"

const client = postgres(process.env.DATABASE_URL!, { prepare: false })

const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email"),
})

const teams = pgTable(
  "teams",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: text("user_id").notNull(),
    enterprise_domain: text("enterprise_domain"),
    meta: jsonb("meta"),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [uniqueIndex("teams_enterprise_domain_key").on(t.enterprise_domain)],
)

const teamMembers = pgTable("team_members", {
  team_id: uuid("team_id").notNull(),
  user_id: text("user_id").notNull(),
})

const anAgentConfigs = pgTable("an_agent_configs", {
  id: uuid("id").primaryKey().defaultRandom(),
  team_id: uuid("team_id").notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  runtime: text("runtime").notNull(),
  bundle_url: text("bundle_url"),
  bundle_hash: text("bundle_hash"),
  env_vars: jsonb("env_vars"),
  deployed_at: timestamp("deployed_at", { withTimezone: true }),
  active_deployment_id: uuid("active_deployment_id"),
})

const anDeployments = pgTable("an_deployments", {
  id: uuid("id").primaryKey().defaultRandom(),
  agent_id: uuid("agent_id").notNull(),
  bundle_url: text("bundle_url").notNull(),
  bundle_hash: text("bundle_hash").notNull(),
  sandbox_config: jsonb("sandbox_config"),
  metadata: jsonb("metadata"),
  deployed_at: timestamp("deployed_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
})

const db = drizzle(client, {
  schema: {
    users,
    teams,
    teamMembers,
    anAgentConfigs,
    anDeployments,
  },
})

type SandboxMeta = {
  invocation_team_id: string
  invocation_user_id?: string
  team_id: string
  resolved_via: "local_team" | "enterprise_fallback"
}

type SandboxAttribution = {
  invocationTeamId?: string
  invocationUserId?: string
  ownerTeamId?: string
}

function getEmailDomain(email: string | null | undefined) {
  if (!email) return null
  const [, domain] = email.toLowerCase().split("@")
  return domain || null
}

function getDeploymentTemplateId(metadata: unknown) {
  if (!metadata || typeof metadata !== "object") return null
  const value = (metadata as { templateId?: unknown }).templateId
  return typeof value === "string" && value.length > 0 ? value : null
}

function getDeploymentAgentConfig(
  metadata: unknown,
): Record<string, unknown> | null {
  if (!metadata || typeof metadata !== "object") return null
  const config = (metadata as { agentConfig?: unknown }).agentConfig
  return config && typeof config === "object"
    ? (config as Record<string, unknown>)
    : null
}

function getDeploymentMcpServers(
  metadata: unknown,
): Array<{ name: string; url: string }> {
  if (!metadata || typeof metadata !== "object") return []
  const rawServers = (metadata as { mcpServers?: unknown }).mcpServers
  if (!Array.isArray(rawServers)) return []

  return rawServers
    .filter(
      (entry): entry is { name?: unknown; url?: unknown } =>
        !!entry && typeof entry === "object",
    )
    .filter(
      (entry): entry is { name: string; url: string } =>
        typeof entry.name === "string" &&
        entry.name.length > 0 &&
        typeof entry.url === "string" &&
        entry.url.length > 0,
    )
}

function getDeploymentVaultIds(metadata: unknown): string[] {
  if (!metadata || typeof metadata !== "object") return []
  const rawVaultIds = (metadata as { vaultIds?: unknown }).vaultIds
  if (!Array.isArray(rawVaultIds)) return []

  return rawVaultIds.filter(
    (vaultId): vaultId is string =>
      typeof vaultId === "string" && vaultId.length > 0,
  )
}

export function dedupeAccessibleAgentConfigs<
  T extends { slug: string; team_id: string },
>(configs: T[], preferredTeamId: string) {
  const deduped = new Map<string, T>()

  for (const config of configs.filter(
    (item) => item.team_id === preferredTeamId,
  )) {
    deduped.set(config.slug, config)
  }

  for (const config of configs) {
    if (!deduped.has(config.slug)) {
      deduped.set(config.slug, config)
    }
  }

  return Array.from(deduped.values())
}

export async function resolveEnterpriseTeamForTeam(teamId: string) {
  const [team] = await db
    .select({
      id: teams.id,
      userId: teams.user_id,
      enterpriseDomain: teams.enterprise_domain,
    })
    .from(teams)
    .where(eq(teams.id, teamId))
    .limit(1)

  if (!team) return null
  if (team.enterpriseDomain) {
    return {
      id: team.id,
      enterpriseDomain: team.enterpriseDomain,
    }
  }

  const [owner] = await db
    .select({
      email: users.email,
    })
    .from(users)
    .where(eq(users.id, team.userId))
    .limit(1)

  const ownerDomain = getEmailDomain(owner?.email)
  if (!ownerDomain) return null

  const [enterpriseTeam] = await db
    .select({
      id: teams.id,
      enterpriseDomain: teams.enterprise_domain,
    })
    .from(teams)
    .where(eq(teams.enterprise_domain, ownerDomain))
    .limit(1)

  return enterpriseTeam ?? null
}

export async function getAccessibleAgentTeamIds(teamId: string) {
  const enterpriseTeam = await resolveEnterpriseTeamForTeam(teamId)
  if (!enterpriseTeam || enterpriseTeam.id === teamId) {
    return [teamId]
  }

  return [teamId, enterpriseTeam.id]
}

export async function findAccessibleAgentBySlug(teamId: string, slug: string) {
  const [localAgent] = await db
    .select({
      id: anAgentConfigs.id,
      team_id: anAgentConfigs.team_id,
    })
    .from(anAgentConfigs)
    .where(
      and(eq(anAgentConfigs.team_id, teamId), eq(anAgentConfigs.slug, slug)),
    )
    .limit(1)

  if (localAgent) {
    return {
      agentId: localAgent.id,
      ownerTeamId: localAgent.team_id,
      isShared: false,
    }
  }

  const enterpriseTeam = await resolveEnterpriseTeamForTeam(teamId)
  if (!enterpriseTeam || enterpriseTeam.id === teamId) {
    return null
  }

  const [sharedAgent] = await db
    .select({
      id: anAgentConfigs.id,
      team_id: anAgentConfigs.team_id,
    })
    .from(anAgentConfigs)
    .where(
      and(
        eq(anAgentConfigs.team_id, enterpriseTeam.id),
        eq(anAgentConfigs.slug, slug),
      ),
    )
    .limit(1)

  if (!sharedAgent) {
    return null
  }

  return {
    agentId: sharedAgent.id,
    ownerTeamId: sharedAgent.team_id,
    isShared: true,
  }
}

export async function userHasEnterpriseAgentAccess(
  userId: string,
  ownerTeamId: string,
) {
  const [ownerTeam] = await db
    .select({
      enterpriseDomain: teams.enterprise_domain,
    })
    .from(teams)
    .where(eq(teams.id, ownerTeamId))
    .limit(1)

  const domain = ownerTeam?.enterpriseDomain
  if (!domain) {
    return false
  }

  const [ownedTeam] = await db
    .select({ id: teams.id })
    .from(teams)
    .innerJoin(users, eq(teams.user_id, users.id))
    .where(
      and(
        eq(teams.user_id, userId),
        sql`lower(${users.email}) like ${`%@${domain}`}`,
      ),
    )
    .limit(1)

  if (ownedTeam) {
    return true
  }

  const [memberTeam] = await db
    .select({ id: teams.id })
    .from(teamMembers)
    .innerJoin(teams, eq(teamMembers.team_id, teams.id))
    .innerJoin(users, eq(teams.user_id, users.id))
    .where(
      and(
        eq(teamMembers.user_id, userId),
        sql`lower(${users.email}) like ${`%@${domain}`}`,
      ),
    )
    .limit(1)

  return !!memberTeam
}

export async function getAccessibleAgentConfig(teamId: string, slug: string) {
  const [localRow] = await db
    .select({
      id: anAgentConfigs.id,
      team_id: anAgentConfigs.team_id,
      name: anAgentConfigs.name,
      slug: anAgentConfigs.slug,
      runtime: anAgentConfigs.runtime,
      active_deployment_id: anAgentConfigs.active_deployment_id,
      deployment_bundle_url: anDeployments.bundle_url,
      deployment_bundle_hash: anDeployments.bundle_hash,
      deployment_deployed_at: anDeployments.deployed_at,
      config_bundle_url: anAgentConfigs.bundle_url,
      deployment_sandbox_config: anDeployments.sandbox_config,
      deployment_metadata: anDeployments.metadata,
      env_vars: anAgentConfigs.env_vars,
    })
    .from(anAgentConfigs)
    .leftJoin(
      anDeployments,
      eq(anAgentConfigs.active_deployment_id, anDeployments.id),
    )
    .where(
      and(eq(anAgentConfigs.slug, slug), eq(anAgentConfigs.team_id, teamId)),
    )
    .limit(1)

  const resolvedRow =
    localRow ??
    (await (async () => {
      const enterpriseTeam = await resolveEnterpriseTeamForTeam(teamId)
      if (!enterpriseTeam || enterpriseTeam.id === teamId) {
        return null
      }

      const [sharedRow] = await db
        .select({
          id: anAgentConfigs.id,
          team_id: anAgentConfigs.team_id,
          name: anAgentConfigs.name,
          slug: anAgentConfigs.slug,
          runtime: anAgentConfigs.runtime,
          active_deployment_id: anAgentConfigs.active_deployment_id,
          deployment_bundle_url: anDeployments.bundle_url,
          deployment_bundle_hash: anDeployments.bundle_hash,
          deployment_deployed_at: anDeployments.deployed_at,
          config_bundle_url: anAgentConfigs.bundle_url,
          deployment_sandbox_config: anDeployments.sandbox_config,
          deployment_metadata: anDeployments.metadata,
          env_vars: anAgentConfigs.env_vars,
        })
        .from(anAgentConfigs)
        .leftJoin(
          anDeployments,
          eq(anAgentConfigs.active_deployment_id, anDeployments.id),
        )
        .where(
          and(
            eq(anAgentConfigs.slug, slug),
            eq(anAgentConfigs.team_id, enterpriseTeam.id),
          ),
        )
        .limit(1)

      return sharedRow ?? null
    })())

  if (!resolvedRow) {
    return null
  }

  return {
    id: resolvedRow.id,
    team_id: resolvedRow.team_id,
    name: resolvedRow.name,
    slug: resolvedRow.slug,
    runtime: resolvedRow.runtime,
    active_deployment_id: resolvedRow.active_deployment_id,
    bundle_url:
      resolvedRow.deployment_bundle_url ?? resolvedRow.config_bundle_url,
    bundle_hash: resolvedRow.deployment_bundle_hash,
    deployed_at: resolvedRow.deployment_deployed_at,
    sandbox_config: resolvedRow.deployment_sandbox_config,
    template_id: getDeploymentTemplateId(resolvedRow.deployment_metadata),
    nocode_agent_config: getDeploymentAgentConfig(
      resolvedRow.deployment_metadata,
    ),
    mcp_servers: getDeploymentMcpServers(resolvedRow.deployment_metadata),
    vault_ids: getDeploymentVaultIds(resolvedRow.deployment_metadata),
    env_vars: resolvedRow.env_vars,
    isShared: resolvedRow.team_id !== teamId,
  }
}

export function buildSandboxMeta(params: {
  invocationTeamId: string
  invocationUserId?: string
  ownerTeamId: string
  resolvedVia?: "local_team" | "enterprise_fallback"
}): SandboxMeta {
  return {
    invocation_team_id: params.invocationTeamId,
    ...(params.invocationUserId
      ? { invocation_user_id: params.invocationUserId }
      : {}),
    team_id: params.ownerTeamId,
    resolved_via:
      params.resolvedVia ??
      (params.ownerTeamId === params.invocationTeamId
        ? "local_team"
        : "enterprise_fallback"),
  }
}

export function getSandboxAttribution(meta: unknown): SandboxAttribution {
  const value = meta as Record<string, any> | null | undefined

  return {
    invocationTeamId:
      typeof value?.invocation_team_id === "string"
        ? value.invocation_team_id
        : undefined,
    invocationUserId:
      typeof value?.invocation_user_id === "string"
        ? value.invocation_user_id
        : undefined,
    ownerTeamId: typeof value?.team_id === "string" ? value.team_id : undefined,
  }
}
