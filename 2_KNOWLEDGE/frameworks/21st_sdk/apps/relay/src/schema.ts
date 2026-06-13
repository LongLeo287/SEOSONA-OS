import {
  sql,
} from "drizzle-orm"
import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  bigint,
  boolean,
  index,
  uniqueIndex,
  doublePrecision,
  jsonb,
} from "drizzle-orm/pg-core"

export type AnRunStatus =
  | "received"
  | "streaming"
  | "completed"
  | "failed"
  | "cancelled"
  | "blocked"

export type AnRunMeta = {
  input_tokens: number | null
  output_tokens: number | null
  total_tokens: number | null
  duration_ms: number | null
  e2b_sandbox_id: string | null
}

export type AnRunError = {
  code: string
  message: string
} | null

export const teams = pgTable(
  "teams",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    user_id: text("user_id").notNull(),
    enterprise_domain: text("enterprise_domain"),
    meta: jsonb("meta"),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("teams_user_id_idx").on(t.user_id),
    uniqueIndex("teams_enterprise_domain_key").on(t.enterprise_domain),
  ],
)

export const anAgentConfigs = pgTable(
  "an_agent_configs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    team_id: uuid("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    runtime: text("runtime").notNull().default("claude-code"),
    bundle_url: text("bundle_url"),
    bundle_hash: text("bundle_hash"),
    env_vars: jsonb("env_vars"),
    deployed_at: timestamp("deployed_at", { withTimezone: true }),
    active_deployment_id: uuid("active_deployment_id"),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    uniqueIndex("uq_agent_configs_team_slug").on(t.team_id, t.slug),
    index("an_agent_configs_team_id_idx").on(t.team_id),
    index("idx_an_agent_configs_active_deployment").on(t.active_deployment_id),
  ],
)

export const anDeployments = pgTable(
  "an_deployments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    agent_id: uuid("agent_id")
      .notNull()
      .references(() => anAgentConfigs.id, { onDelete: "cascade" }),
    version: integer("version").notNull().default(1),
    bundle_url: text("bundle_url").notNull(),
    bundle_hash: text("bundle_hash").notNull(),
    sandbox_config: jsonb("sandbox_config"),
    metadata: jsonb("metadata"),
    status: text("status").notNull().default("building"),
    error: text("error"),
    deployed_at: timestamp("deployed_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    completed_at: timestamp("completed_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("uq_an_deployments_agent_version").on(t.agent_id, t.version),
    index("idx_an_deployments_agent_id").on(t.agent_id),
    index("idx_an_deployments_agent_deployed").on(t.agent_id, t.deployed_at),
    index("idx_an_deployments_status").on(t.agent_id, t.status),
  ],
)

export const anMcpVaults = pgTable(
  "an_mcp_vaults",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    team_id: uuid("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    metadata: jsonb("metadata")
      .$type<Record<string, string>>()
      .notNull()
      .default({}),
    is_default: boolean("is_default").notNull().default(false),
    status: text("status").notNull().default("active"),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    archived_at: timestamp("archived_at", { withTimezone: true }),
  },
  (t) => [
    index("an_mcp_vaults_team_id_idx").on(t.team_id),
    index("an_mcp_vaults_team_status_idx").on(t.team_id, t.status),
    index("an_mcp_vaults_team_default_lookup_idx").on(
      t.team_id,
      t.is_default,
    ),
    uniqueIndex("an_mcp_vaults_team_default_idx")
      .on(t.team_id)
      .where(sql`${t.is_default} = true AND ${t.archived_at} IS NULL`),
    index("an_mcp_vaults_metadata_gin_idx").using("gin", t.metadata),
  ],
)

export const anMcpCredentials = pgTable(
  "an_mcp_credentials",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    vault_id: uuid("vault_id")
      .notNull()
      .references(() => anMcpVaults.id, { onDelete: "cascade" }),
    name: text("name"),
    server_url: text("server_url").notNull(),
    server_url_normalized: text("server_url_normalized").notNull(),
    host_pattern: text("host_pattern"),
    inject: jsonb("inject").$type<Record<string, unknown>>().notNull().default({}),
    auth_type: text("auth_type").notNull(),
    encrypted_auth: text("encrypted_auth"),
    auth_meta: jsonb("auth_meta"),
    metadata: jsonb("metadata")
      .$type<Record<string, string>>()
      .notNull()
      .default({}),
    status: text("status").notNull().default("active"),
    last_error: text("last_error"),
    last_resolved_at: timestamp("last_resolved_at", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    archived_at: timestamp("archived_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("uq_an_mcp_credentials_active_vault_url")
      .on(
      t.vault_id,
      t.server_url_normalized,
      )
      .where(sql`${t.status} = 'active' AND ${t.archived_at} IS NULL`),
    index("an_mcp_credentials_vault_id_idx").on(t.vault_id),
    index("an_mcp_credentials_vault_status_idx").on(t.vault_id, t.status),
    index("an_mcp_credentials_vault_host_idx")
      .on(t.vault_id, t.host_pattern)
      .where(sql`${t.status} = 'active' AND ${t.archived_at} IS NULL`),
  ],
)

export const agentSkills = pgTable(
  "agent_skills",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    team_id: uuid("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    content: text("content").notNull(),
    tags: text("tags").array().notNull().default([]),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    uniqueIndex("agent_skills_team_id_slug_key").on(t.team_id, t.slug),
    index("agent_skills_team_id_idx").on(t.team_id),
  ],
)

// AnSandbox = runtime sandbox instance (one per client, holds provider sandbox_id + threads)
export const anSandboxes = pgTable(
  "an_sandboxes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    agent_id: uuid("agent_id")
      .notNull()
      .references(() => anAgentConfigs.id, { onDelete: "cascade" }),
    deployment_id: uuid("deployment_id").references(() => anDeployments.id, {
      onDelete: "set null",
    }),
    client_sandbox_id: text("client_sandbox_id").notNull(),
    provider: text("provider").notNull().default("e2b"),
    sandbox_id: text("sandbox_id"),
    status: text("status").notNull().default("active"),
    error: text("error"),
    meta: jsonb("meta"),
    invocation_team_id: uuid("invocation_team_id").references(() => teams.id, {
      onDelete: "cascade",
    }),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    uniqueIndex("an_sandboxes_agent_client_sandbox_key").on(
      t.agent_id,
      t.client_sandbox_id,
    ),
    index("an_sandboxes_agent_id_idx").on(t.agent_id),
    index("an_sandboxes_status_idx").on(t.status),
    index("idx_an_sandboxes_deployment").on(t.deployment_id),
  ],
)

export const anThreads = pgTable(
  "an_threads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sandbox_id: uuid("sandbox_id")
      .notNull()
      .references(() => anSandboxes.id, { onDelete: "cascade" }),
    deployment_id: uuid("deployment_id").references(() => anDeployments.id, {
      onDelete: "set null",
    }),
    vault_id: uuid("vault_id").references(() => anMcpVaults.id, {
      onDelete: "set null",
    }),
    vault_ids: uuid("vault_ids").array().notNull().default([]),
    name: text("name"),
    mode: text("mode").notNull().default("chat"),
    messages: jsonb("messages"),
    stream_id: text("stream_id"),
    claude_session_id: text("claude_session_id"),
    status: text("status").notNull().default("streaming"),
    input_tokens: integer("input_tokens"),
    output_tokens: integer("output_tokens"),
    total_tokens: integer("total_tokens"),
    total_cost_usd: doublePrecision("total_cost_usd"),
    duration_ms: integer("duration_ms"),
    error: text("error"),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    completed_at: timestamp("completed_at", { withTimezone: true }),
  },
  (t) => [
    index("an_threads_sandbox_id_idx").on(t.sandbox_id),
    index("an_threads_sandbox_status_idx").on(t.sandbox_id, t.status),
    index("an_threads_stream_id_idx").on(t.stream_id),
    index("idx_an_threads_deployment").on(t.deployment_id),
    index("idx_an_threads_vault").on(t.vault_id),
    index("idx_an_threads_vault_ids").using("gin", t.vault_ids),
  ],
)

export const anRuns = pgTable(
  "an_runs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    finished_at: timestamp("finished_at", { withTimezone: true }),
    status: text("status").$type<AnRunStatus>().notNull(),
    team_id: uuid("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    user_id: text("user_id").notNull(),
    end_user_id: text("end_user_id"),
    agent_id: uuid("agent_id").references(() => anAgentConfigs.id, {
      onDelete: "set null",
    }),
    thread_id: uuid("thread_id").references(() => anThreads.id, {
      onDelete: "set null",
    }),
    total_cost_usd: doublePrecision("total_cost_usd"),
    error: jsonb("error").$type<AnRunError>(),
    meta: jsonb("meta").$type<AnRunMeta>(),
  },
  (t) => [
    index("an_runs_team_created_at_idx").on(t.team_id, t.created_at),
    index("an_runs_team_user_created_at_idx").on(
      t.team_id,
      t.user_id,
      t.created_at,
    ),
    index("an_runs_team_end_user_created_at_idx").on(
      t.team_id,
      t.end_user_id,
      t.created_at,
    ),
    index("an_runs_team_agent_created_at_idx").on(
      t.team_id,
      t.agent_id,
      t.created_at,
    ),
    index("an_runs_thread_id_idx").on(t.thread_id),
  ],
)

export const anSpans = pgTable(
  "an_spans",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    thread_id: uuid("thread_id")
      .notNull()
      .references(() => anThreads.id, { onDelete: "cascade" }),
    span_id: text("span_id").notNull(),
    parent_span_id: text("parent_span_id"),
    trace_id: text("trace_id").notNull(),
    name: text("name").notNull(),
    kind: text("kind").notNull(),
    start_time: bigint("start_time", { mode: "bigint" }).notNull(),
    end_time: bigint("end_time", { mode: "bigint" }),
    duration_ms: integer("duration_ms"),
    status: text("status").notNull(),
    error: text("error"),
    input: jsonb("input"),
    output: jsonb("output"),
    attributes: jsonb("attributes"),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("an_spans_thread_id_idx").on(t.thread_id),
    index("an_spans_trace_id_idx").on(t.trace_id),
  ],
)

export const anApiKeys = pgTable("an_api_keys", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").unique(),
  key_hash: text("key_hash").unique(),
  key_prefix: text("key_prefix"),
  team_id: uuid("team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  user_id: text("user_id").notNull(),
  name: text("name").notNull().default("Default"),
  is_active: boolean("is_active").notNull().default(true),
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  last_used_at: timestamp("last_used_at", { withTimezone: true }),
  expires_at: timestamp("expires_at", { withTimezone: true }),
  requests_limit: integer("requests_limit").notNull().default(1000),
  requests_count: integer("requests_count").notNull().default(0),
})

export const apiKeys = pgTable("api_keys", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").unique(),
  key_hash: text("key_hash").unique(),
  key_prefix: text("key_prefix"),
  user_id: text("user_id").notNull(),
  team_id: uuid("team_id"),
  plan: text("plan").notNull().default("free"),
  requests_count: integer("requests_count").notNull().default(0),
  requests_limit: integer("requests_limit").notNull().default(1000),
  is_active: boolean("is_active").notNull().default(true),
  expires_at: timestamp("expires_at", { withTimezone: true }),
  last_used_at: timestamp("last_used_at", { withTimezone: true }),
  project_url: text("project_url"),
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
})
