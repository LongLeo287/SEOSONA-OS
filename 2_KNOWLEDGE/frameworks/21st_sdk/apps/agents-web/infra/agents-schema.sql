CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'public' AND t.typname = 'user_role'
  ) THEN
    CREATE TYPE public.user_role AS ENUM (
      'designer',
      'frontend_developer',
      'backend_developer',
      'product_manager',
      'entrepreneur'
    );
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.create_default_team_for_user()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  INSERT INTO public.teams (name, user_id)
  VALUES ('Personal Projects', NEW.id);

  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION pg_temp.ensure_constraint(
  target_schema text,
  target_table text,
  constraint_name text,
  ddl text
)
RETURNS void
LANGUAGE plpgsql
AS $function$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE n.nspname = target_schema
      AND t.relname = target_table
      AND c.conname = constraint_name
  ) THEN
    EXECUTE ddl;
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION pg_temp.ensure_trigger(
  target_schema text,
  target_table text,
  trigger_name text,
  ddl text
)
RETURNS void
LANGUAGE plpgsql
AS $function$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger tg
    JOIN pg_class t ON t.oid = tg.tgrelid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE n.nspname = target_schema
      AND t.relname = target_table
      AND tg.tgname = trigger_name
      AND NOT tg.tgisinternal
  ) THEN
    EXECUTE ddl;
  END IF;
END;
$function$;

CREATE TABLE IF NOT EXISTS public.agent_chats (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id text NOT NULL,
    team_id uuid NOT NULL,
    name text NOT NULL,
    sandbox_id text,
    meta jsonb,
    created_at timestamp(6) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(6) with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp(6) with time zone,
    archived_at timestamp(6) with time zone,
    credit_source text DEFAULT 'personal'::text
);

CREATE TABLE IF NOT EXISTS public.agent_invite_acceptances (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    invite_code text NOT NULL,
    invited_user_id text NOT NULL,
    accepted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    ip_address text,
    user_agent text
);

CREATE TABLE IF NOT EXISTS public.agent_invites (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code text NOT NULL,
    inviter_user_id text NOT NULL,
    max_uses integer DEFAULT 10 NOT NULL,
    uses_count integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at timestamp with time zone,
    last_reset_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);

CREATE TABLE IF NOT EXISTS public.agent_skills (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    team_id uuid NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    content text NOT NULL,
    tags text[] DEFAULT '{}'::text[] NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.agent_sub_chats (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    chat_id uuid NOT NULL,
    name text NOT NULL,
    stream_id text,
    messages jsonb,
    created_at timestamp(6) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(6) with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp(6) with time zone,
    mode text DEFAULT 'agent'::text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.an_agent_configs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    team_id uuid NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    runtime text DEFAULT 'claude-code'::text NOT NULL,
    bundle_hash text,
    deployed_at timestamp with time zone,
    bundle_url text,
    active_deployment_id uuid,
    env_vars jsonb
);

CREATE TABLE IF NOT EXISTS public.an_api_keys (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    key text,
    key_hash text,
    key_prefix text,
    team_id uuid NOT NULL,
    user_id text NOT NULL,
    name text DEFAULT 'Default'::text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    last_used_at timestamp with time zone,
    expires_at timestamp with time zone,
    requests_limit integer DEFAULT 1000 NOT NULL,
    requests_count integer DEFAULT 0 NOT NULL
);

CREATE TABLE IF NOT EXISTS public.api_keys (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    key text,
    key_hash text,
    key_prefix text,
    user_id text NOT NULL,
    team_id uuid,
    plan text DEFAULT 'free'::text NOT NULL,
    requests_count integer DEFAULT 0 NOT NULL,
    requests_limit integer DEFAULT 1000 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    expires_at timestamp with time zone,
    last_used_at timestamp with time zone,
    project_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.an_deployments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    agent_id uuid NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    bundle_url text NOT NULL,
    bundle_hash text NOT NULL,
    deployed_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    metadata jsonb,
    sandbox_config jsonb,
    status text DEFAULT 'ready'::text NOT NULL,
    error text,
    completed_at timestamp with time zone
);

CREATE TABLE IF NOT EXISTS public.an_mcp_vaults (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    team_id uuid NOT NULL,
    name text NOT NULL,
    description text,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    is_default boolean DEFAULT false NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    archived_at timestamp with time zone
);

CREATE TABLE IF NOT EXISTS public.an_mcp_credentials (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    vault_id uuid NOT NULL,
    name text,
    server_url text NOT NULL,
    server_url_normalized text NOT NULL,
    host_pattern text,
    inject jsonb DEFAULT '{}'::jsonb NOT NULL,
    auth_type text NOT NULL,
    encrypted_auth text,
    auth_meta jsonb,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    last_error text,
    last_resolved_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    archived_at timestamp with time zone
);

CREATE TABLE IF NOT EXISTS public.an_sandboxes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    agent_id uuid NOT NULL,
    client_sandbox_id text NOT NULL,
    sandbox_id text,
    status text DEFAULT 'active'::text NOT NULL,
    error text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deployment_id uuid,
    meta jsonb,
    invocation_team_id uuid,
    provider text DEFAULT 'e2b'::text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.an_spans (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    thread_id uuid NOT NULL,
    span_id text NOT NULL,
    parent_span_id text,
    trace_id text NOT NULL,
    name text NOT NULL,
    kind text NOT NULL,
    start_time bigint NOT NULL,
    end_time bigint,
    duration_ms integer,
    status text NOT NULL,
    error text,
    input jsonb,
    output jsonb,
    attributes jsonb,
    created_at timestamp(6) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.an_threads (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    sandbox_id uuid NOT NULL,
    deployment_id uuid,
    vault_id uuid,
    vault_ids uuid[] DEFAULT '{}'::uuid[] NOT NULL,
    name text,
    mode text DEFAULT 'chat'::text NOT NULL,
    messages jsonb,
    stream_id text,
    claude_session_id text,
    status text DEFAULT 'streaming'::text NOT NULL,
    input_tokens integer,
    output_tokens integer,
    total_tokens integer,
    total_cost_usd double precision,
    duration_ms integer,
    error text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    completed_at timestamp with time zone
);

CREATE TABLE IF NOT EXISTS public.an_runs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    finished_at timestamp with time zone,
    status text NOT NULL,
    team_id uuid NOT NULL,
    user_id text NOT NULL,
    end_user_id text,
    agent_id uuid,
    thread_id uuid,
    total_cost_usd double precision,
    error jsonb,
    meta jsonb
);

CREATE TABLE IF NOT EXISTS public.users (
    id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now(),
    image_url text,
    username text,
    name text,
    email text DEFAULT ''::text NOT NULL,
    manually_added boolean DEFAULT false NOT NULL,
    is_admin boolean DEFAULT false NOT NULL,
    twitter_url text,
    bio text,
    github_url text,
    pro_referral_url text,
    website_url text,
    pro_banner_url text,
    display_name text,
    display_username text,
    display_image_url text,
    ref text,
    paypal_email text,
    role public.user_role,
    is_partner boolean DEFAULT false,
    bundles_fee real DEFAULT '0.3'::real NOT NULL,
    stripe_id text,
    github_installations jsonb,
    what_describes_you_best text,
    what_describes_you_best_other text,
    company_size text,
    onboarding_referral text,
    primary_coding_agent text,
    primary_coding_agent_other text,
    onboarding_industry text,
    onboarding_completed_at timestamp with time zone,
    onboarding_platform text,
    donation_url text
);

CREATE TABLE IF NOT EXISTS public.usages (
    id bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id text,
    "limit" integer DEFAULT 0,
    usage double precision
);

CREATE TABLE IF NOT EXISTS public.team_invite_links (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    team_id uuid NOT NULL,
    token character varying(12) NOT NULL,
    created_by text NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.team_members (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    team_id uuid NOT NULL,
    email text NOT NULL,
    user_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.team_pending_invites (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    team_id uuid NOT NULL,
    email text NOT NULL,
    invited_by text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    last_sent_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.team_repository_sandboxes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    team_id uuid NOT NULL,
    repository text NOT NULL,
    sandbox_id text,
    sandbox_config jsonb,
    env_vars jsonb,
    setup_status text DEFAULT 'not_setup'::text NOT NULL,
    setup_error text,
    framework text,
    created_at timestamp(6) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(6) with time zone DEFAULT now() NOT NULL,
    wizard_messages jsonb,
    installation_id text,
    file_tree jsonb
);

CREATE TABLE IF NOT EXISTS public.teams (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying NOT NULL,
    description text,
    image_url text,
    website_url text,
    user_id text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    figma_integration jsonb DEFAULT '{}'::jsonb,
    github_integration jsonb DEFAULT '{}'::jsonb,
    cursor_integration jsonb DEFAULT '{}'::jsonb,
    onboarding_completed boolean,
    figma_mcp_url text,
    github_sandbox_id text,
    github_sandbox_preview_token text,
    github_sandbox_env_vars jsonb,
    github_sandbox_config jsonb,
    claude_code_integration jsonb DEFAULT '{}'::jsonb,
    linear_integration jsonb,
    github_installation_id text,
    discord_integration jsonb,
    discord_guild_id text,
    stripe jsonb,
    enterprise_domain text,
    meta jsonb
);

SELECT pg_temp.ensure_constraint('public', 'agent_chats', 'agent_chats_pkey', $ddl$ALTER TABLE ONLY public.agent_chats
    ADD CONSTRAINT agent_chats_pkey PRIMARY KEY (id);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'agent_invite_acceptances', 'agent_invite_acceptances_pkey', $ddl$ALTER TABLE ONLY public.agent_invite_acceptances
    ADD CONSTRAINT agent_invite_acceptances_pkey PRIMARY KEY (id);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'agent_invites', 'agent_invites_code_key', $ddl$ALTER TABLE ONLY public.agent_invites
    ADD CONSTRAINT agent_invites_code_key UNIQUE (code);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'agent_invites', 'agent_invites_pkey', $ddl$ALTER TABLE ONLY public.agent_invites
    ADD CONSTRAINT agent_invites_pkey PRIMARY KEY (id);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'agent_skills', 'agent_skills_pkey', $ddl$ALTER TABLE ONLY public.agent_skills
    ADD CONSTRAINT agent_skills_pkey PRIMARY KEY (id);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'agent_skills', 'agent_skills_team_id_slug_key', $ddl$ALTER TABLE ONLY public.agent_skills
    ADD CONSTRAINT agent_skills_team_id_slug_key UNIQUE (team_id, slug);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'agent_sub_chats', 'agent_sub_chats_pkey', $ddl$ALTER TABLE ONLY public.agent_sub_chats
    ADD CONSTRAINT agent_sub_chats_pkey PRIMARY KEY (id);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'an_agent_configs', 'an_agent_configs_pkey', $ddl$ALTER TABLE ONLY public.an_agent_configs
    ADD CONSTRAINT an_agent_configs_pkey PRIMARY KEY (id);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'an_threads', 'an_agent_dialogs_pkey', $ddl$ALTER TABLE ONLY public.an_threads
    ADD CONSTRAINT an_agent_dialogs_pkey PRIMARY KEY (id);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'an_sandboxes', 'an_agent_projects_pkey', $ddl$ALTER TABLE ONLY public.an_sandboxes
    ADD CONSTRAINT an_agent_projects_pkey PRIMARY KEY (id);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'an_runs', 'an_runs_pkey', $ddl$ALTER TABLE ONLY public.an_runs
    ADD CONSTRAINT an_runs_pkey PRIMARY KEY (id);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'an_api_keys', 'an_api_keys_key_key', $ddl$ALTER TABLE ONLY public.an_api_keys
    ADD CONSTRAINT an_api_keys_key_key UNIQUE (key);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'an_api_keys', 'an_api_keys_key_hash_key', $ddl$ALTER TABLE ONLY public.an_api_keys
    ADD CONSTRAINT an_api_keys_key_hash_key UNIQUE (key_hash);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'an_api_keys', 'an_api_keys_pkey', $ddl$ALTER TABLE ONLY public.an_api_keys
    ADD CONSTRAINT an_api_keys_pkey PRIMARY KEY (id);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'api_keys', 'api_keys_key_key', $ddl$ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_key_key UNIQUE (key);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'api_keys', 'api_keys_key_hash_key', $ddl$ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_key_hash_key UNIQUE (key_hash);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'api_keys', 'api_keys_pkey', $ddl$ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_pkey PRIMARY KEY (id);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'an_deployments', 'an_deployments_agent_id_version_key', $ddl$ALTER TABLE ONLY public.an_deployments
    ADD CONSTRAINT an_deployments_agent_id_version_key UNIQUE (agent_id, version);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'an_deployments', 'an_deployments_pkey', $ddl$ALTER TABLE ONLY public.an_deployments
    ADD CONSTRAINT an_deployments_pkey PRIMARY KEY (id);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'an_mcp_vaults', 'an_mcp_vaults_pkey', $ddl$ALTER TABLE ONLY public.an_mcp_vaults
    ADD CONSTRAINT an_mcp_vaults_pkey PRIMARY KEY (id);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'an_mcp_credentials', 'an_mcp_credentials_pkey', $ddl$ALTER TABLE ONLY public.an_mcp_credentials
    ADD CONSTRAINT an_mcp_credentials_pkey PRIMARY KEY (id);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'an_spans', 'an_spans_pkey', $ddl$ALTER TABLE ONLY public.an_spans
    ADD CONSTRAINT an_spans_pkey PRIMARY KEY (id);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'team_invite_links', 'team_invite_links_pkey', $ddl$ALTER TABLE ONLY public.team_invite_links
    ADD CONSTRAINT team_invite_links_pkey PRIMARY KEY (id);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'team_invite_links', 'team_invite_links_team_id_key', $ddl$ALTER TABLE ONLY public.team_invite_links
    ADD CONSTRAINT team_invite_links_team_id_key UNIQUE (team_id);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'team_invite_links', 'team_invite_links_token_key', $ddl$ALTER TABLE ONLY public.team_invite_links
    ADD CONSTRAINT team_invite_links_token_key UNIQUE (token);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'team_members', 'team_members_pkey', $ddl$ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_pkey PRIMARY KEY (id);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'team_members', 'team_members_team_id_email_key', $ddl$ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_team_id_email_key UNIQUE (team_id, email);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'team_pending_invites', 'team_pending_invites_pkey', $ddl$ALTER TABLE ONLY public.team_pending_invites
    ADD CONSTRAINT team_pending_invites_pkey PRIMARY KEY (id);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'team_pending_invites', 'team_pending_invites_team_id_email_key', $ddl$ALTER TABLE ONLY public.team_pending_invites
    ADD CONSTRAINT team_pending_invites_team_id_email_key UNIQUE (team_id, email);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'team_repository_sandboxes', 'team_repository_sandboxes_pkey', $ddl$ALTER TABLE ONLY public.team_repository_sandboxes
    ADD CONSTRAINT team_repository_sandboxes_pkey PRIMARY KEY (id);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'team_repository_sandboxes', 'team_repository_sandboxes_team_id_repository_key', $ddl$ALTER TABLE ONLY public.team_repository_sandboxes
    ADD CONSTRAINT team_repository_sandboxes_team_id_repository_key UNIQUE (team_id, repository);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'teams', 'teams_enterprise_domain_key', $ddl$ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_enterprise_domain_key UNIQUE (enterprise_domain);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'teams', 'teams_pkey', $ddl$ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (id);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'teams', 'teams_user_id_name_unique', $ddl$ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_user_id_name_unique UNIQUE (user_id, name);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'agent_invite_acceptances', 'unique_invite_user', $ddl$ALTER TABLE ONLY public.agent_invite_acceptances
    ADD CONSTRAINT unique_invite_user UNIQUE (invite_code, invited_user_id);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'users', 'users_display_username_key', $ddl$ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_display_username_key UNIQUE (display_username);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'users', 'users_email_key', $ddl$ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'users', 'users_pkey', $ddl$ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'usages', 'usage_pkey', $ddl$ALTER TABLE ONLY public.usages
    ADD CONSTRAINT usage_pkey PRIMARY KEY (id);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'usages', 'usages_user_id_key', $ddl$ALTER TABLE ONLY public.usages
    ADD CONSTRAINT usages_user_id_key UNIQUE (user_id);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'users', 'users_username_key', $ddl$ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);
$ddl$);

CREATE INDEX IF NOT EXISTS agent_chats_team_id_deleted_at_idx ON public.agent_chats USING btree (team_id, deleted_at);

CREATE INDEX IF NOT EXISTS agent_chats_user_id_deleted_at_idx ON public.agent_chats USING btree (user_id, deleted_at);

CREATE INDEX IF NOT EXISTS agent_sub_chats_chat_id_deleted_at_idx ON public.agent_sub_chats USING btree (chat_id, deleted_at);

CREATE INDEX IF NOT EXISTS an_api_keys_key_idx ON public.an_api_keys USING btree (key);

CREATE INDEX IF NOT EXISTS an_api_keys_key_hash_idx ON public.an_api_keys USING btree (key_hash);

CREATE INDEX IF NOT EXISTS an_api_keys_team_id_idx ON public.an_api_keys USING btree (team_id);

CREATE INDEX IF NOT EXISTS an_api_keys_user_id_idx ON public.an_api_keys USING btree (user_id);

CREATE INDEX IF NOT EXISTS api_keys_key_idx ON public.api_keys USING btree (key);

CREATE INDEX IF NOT EXISTS api_keys_key_hash_idx ON public.api_keys USING btree (key_hash);

CREATE INDEX IF NOT EXISTS an_mcp_vaults_team_id_idx ON public.an_mcp_vaults USING btree (team_id);

CREATE INDEX IF NOT EXISTS an_mcp_vaults_team_status_idx ON public.an_mcp_vaults USING btree (team_id, status);

CREATE INDEX IF NOT EXISTS an_mcp_vaults_team_default_lookup_idx ON public.an_mcp_vaults USING btree (team_id, is_default);

CREATE UNIQUE INDEX IF NOT EXISTS an_mcp_vaults_team_default_idx ON public.an_mcp_vaults USING btree (team_id) WHERE ((is_default = true) AND (archived_at IS NULL));

CREATE INDEX IF NOT EXISTS an_mcp_vaults_metadata_gin_idx ON public.an_mcp_vaults USING gin (metadata);

CREATE UNIQUE INDEX IF NOT EXISTS uq_an_mcp_credentials_active_vault_url ON public.an_mcp_credentials USING btree (vault_id, server_url_normalized) WHERE ((status = 'active'::text) AND (archived_at IS NULL));

CREATE INDEX IF NOT EXISTS an_mcp_credentials_vault_id_idx ON public.an_mcp_credentials USING btree (vault_id);

CREATE INDEX IF NOT EXISTS an_mcp_credentials_vault_status_idx ON public.an_mcp_credentials USING btree (vault_id, status);

CREATE INDEX IF NOT EXISTS an_mcp_credentials_vault_host_idx ON public.an_mcp_credentials USING btree (vault_id, host_pattern) WHERE ((status = 'active'::text) AND (archived_at IS NULL));

CREATE UNIQUE INDEX IF NOT EXISTS an_sandboxes_agent_client_sandbox_key ON public.an_sandboxes USING btree (agent_id, client_sandbox_id);

CREATE INDEX IF NOT EXISTS an_sandboxes_agent_id_idx ON public.an_sandboxes USING btree (agent_id);

CREATE INDEX IF NOT EXISTS an_spans_thread_id_idx ON public.an_spans USING btree (thread_id);

CREATE INDEX IF NOT EXISTS an_spans_trace_id_idx ON public.an_spans USING btree (trace_id);

CREATE INDEX IF NOT EXISTS an_threads_sandbox_id_idx ON public.an_threads USING btree (sandbox_id);

CREATE INDEX IF NOT EXISTS an_threads_sandbox_status_idx ON public.an_threads USING btree (sandbox_id, status);

CREATE INDEX IF NOT EXISTS an_threads_stream_id_idx ON public.an_threads USING btree (stream_id);

CREATE INDEX IF NOT EXISTS an_runs_team_created_at_idx ON public.an_runs USING btree (team_id, created_at DESC);

CREATE INDEX IF NOT EXISTS an_runs_team_user_created_at_idx ON public.an_runs USING btree (team_id, user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS an_runs_team_end_user_created_at_idx ON public.an_runs USING btree (team_id, end_user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS an_runs_team_agent_created_at_idx ON public.an_runs USING btree (team_id, agent_id, created_at DESC);

CREATE INDEX IF NOT EXISTS an_runs_thread_id_idx ON public.an_runs USING btree (thread_id);

CREATE INDEX IF NOT EXISTS idx_agent_chats_team_active_updated ON public.agent_chats USING btree (team_id, updated_at DESC) WHERE ((archived_at IS NULL) AND (deleted_at IS NULL));

CREATE INDEX IF NOT EXISTS idx_agent_chats_team_archived ON public.agent_chats USING btree (team_id, archived_at);

CREATE INDEX IF NOT EXISTS idx_agent_invite_acceptances_invited_user_id ON public.agent_invite_acceptances USING btree (invited_user_id);

CREATE INDEX IF NOT EXISTS idx_agent_invites_code ON public.agent_invites USING btree (code);

CREATE INDEX IF NOT EXISTS idx_agent_invites_inviter_user_id ON public.agent_invites USING btree (inviter_user_id);

CREATE INDEX IF NOT EXISTS idx_agent_skills_team ON public.agent_skills USING btree (team_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_an_agent_configs_active_deployment ON public.an_agent_configs USING btree (active_deployment_id);

CREATE INDEX IF NOT EXISTS idx_an_agent_configs_team_id ON public.an_agent_configs USING btree (team_id);

CREATE INDEX IF NOT EXISTS idx_an_deployments_agent_deployed ON public.an_deployments USING btree (agent_id, deployed_at DESC);

CREATE INDEX IF NOT EXISTS idx_an_deployments_agent_id ON public.an_deployments USING btree (agent_id);

CREATE INDEX IF NOT EXISTS idx_an_deployments_status ON public.an_deployments USING btree (agent_id, status);

CREATE INDEX IF NOT EXISTS idx_an_sandboxes_deployment ON public.an_sandboxes USING btree (deployment_id);

CREATE INDEX IF NOT EXISTS idx_an_threads_deployment ON public.an_threads USING btree (deployment_id);

CREATE INDEX IF NOT EXISTS idx_an_threads_vault ON public.an_threads USING btree (vault_id);

CREATE INDEX IF NOT EXISTS idx_an_threads_vault_ids ON public.an_threads USING gin (vault_ids);

CREATE INDEX IF NOT EXISTS idx_team_invite_links_team_id ON public.team_invite_links USING btree (team_id);

CREATE INDEX IF NOT EXISTS idx_team_invite_links_token ON public.team_invite_links USING btree (token);

CREATE INDEX IF NOT EXISTS idx_team_members_email ON public.team_members USING btree (email);

CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON public.team_members USING btree (team_id);

CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON public.team_members USING btree (user_id);

CREATE INDEX IF NOT EXISTS idx_team_pending_invites_email ON public.team_pending_invites USING btree (email);

CREATE INDEX IF NOT EXISTS idx_team_pending_invites_status ON public.team_pending_invites USING btree (status);

CREATE INDEX IF NOT EXISTS idx_team_pending_invites_team_id ON public.team_pending_invites USING btree (team_id);

CREATE INDEX IF NOT EXISTS idx_teams_created_at ON public.teams USING btree (created_at);

CREATE INDEX IF NOT EXISTS idx_teams_discord_guild_id ON public.teams USING btree (discord_guild_id);

CREATE INDEX IF NOT EXISTS idx_teams_github_installation_id ON public.teams USING btree (github_installation_id);

CREATE INDEX IF NOT EXISTS idx_teams_user_id ON public.teams USING btree (user_id);

CREATE INDEX IF NOT EXISTS idx_users_display_username ON public.users USING btree (display_username);

CREATE INDEX IF NOT EXISTS idx_users_onboarding_completed_at ON public.users USING btree (onboarding_completed_at);

CREATE INDEX IF NOT EXISTS idx_users_onboarding_industry ON public.users USING btree (onboarding_industry);

CREATE INDEX IF NOT EXISTS idx_users_onboarding_referral ON public.users USING btree (onboarding_referral);

CREATE INDEX IF NOT EXISTS idx_users_primary_coding_agent ON public.users USING btree (primary_coding_agent);

CREATE INDEX IF NOT EXISTS idx_users_username ON public.users USING btree (username);

CREATE INDEX IF NOT EXISTS team_repository_sandboxes_team_id_idx ON public.team_repository_sandboxes USING btree (team_id);

CREATE INDEX IF NOT EXISTS teams_cursor_integration_idx ON public.teams USING gin (cursor_integration);

CREATE UNIQUE INDEX IF NOT EXISTS uq_agent_configs_team_slug ON public.an_agent_configs USING btree (team_id, slug);

SELECT pg_temp.ensure_trigger('public', 'users', 'create_default_team_trigger', $ddl$CREATE TRIGGER create_default_team_trigger AFTER INSERT ON public.users FOR EACH ROW EXECUTE FUNCTION public.create_default_team_for_user();$ddl$);

SELECT pg_temp.ensure_constraint('public', 'agent_chats', 'agent_chats_team_id_fkey', $ddl$ALTER TABLE ONLY public.agent_chats
    ADD CONSTRAINT agent_chats_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'agent_chats', 'agent_chats_user_id_fkey', $ddl$ALTER TABLE ONLY public.agent_chats
    ADD CONSTRAINT agent_chats_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'an_agent_configs', 'agent_configs_team_id_fkey', $ddl$ALTER TABLE ONLY public.an_agent_configs
    ADD CONSTRAINT agent_configs_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'agent_invite_acceptances', 'agent_invite_acceptances_invited_user_id_fkey', $ddl$ALTER TABLE ONLY public.agent_invite_acceptances
    ADD CONSTRAINT agent_invite_acceptances_invited_user_id_fkey FOREIGN KEY (invited_user_id) REFERENCES public.users(id) ON DELETE CASCADE;
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'agent_invites', 'agent_invites_inviter_user_id_fkey', $ddl$ALTER TABLE ONLY public.agent_invites
    ADD CONSTRAINT agent_invites_inviter_user_id_fkey FOREIGN KEY (inviter_user_id) REFERENCES public.users(id) ON DELETE CASCADE;
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'agent_skills', 'agent_skills_team_id_fkey', $ddl$ALTER TABLE ONLY public.agent_skills
    ADD CONSTRAINT agent_skills_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'agent_sub_chats', 'agent_sub_chats_chat_id_fkey', $ddl$ALTER TABLE ONLY public.agent_sub_chats
    ADD CONSTRAINT agent_sub_chats_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.agent_chats(id) ON DELETE CASCADE;
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'an_agent_configs', 'an_agent_configs_active_deployment_id_fkey', $ddl$ALTER TABLE ONLY public.an_agent_configs
    ADD CONSTRAINT an_agent_configs_active_deployment_id_fkey FOREIGN KEY (active_deployment_id) REFERENCES public.an_deployments(id) ON DELETE SET NULL;
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'an_threads', 'an_agent_dialogs_project_id_fkey', $ddl$ALTER TABLE ONLY public.an_threads
    ADD CONSTRAINT an_agent_dialogs_project_id_fkey FOREIGN KEY (sandbox_id) REFERENCES public.an_sandboxes(id) ON DELETE CASCADE;
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'an_sandboxes', 'an_agent_projects_agent_id_fkey', $ddl$ALTER TABLE ONLY public.an_sandboxes
    ADD CONSTRAINT an_agent_projects_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.an_agent_configs(id) ON DELETE CASCADE;
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'an_api_keys', 'an_api_keys_team_id_fkey', $ddl$ALTER TABLE ONLY public.an_api_keys
    ADD CONSTRAINT an_api_keys_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'an_api_keys', 'an_api_keys_user_id_fkey', $ddl$ALTER TABLE ONLY public.an_api_keys
    ADD CONSTRAINT an_api_keys_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'an_deployments', 'an_deployments_agent_id_fkey', $ddl$ALTER TABLE ONLY public.an_deployments
    ADD CONSTRAINT an_deployments_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.an_agent_configs(id) ON DELETE CASCADE;
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'an_mcp_vaults', 'an_mcp_vaults_team_id_fkey', $ddl$ALTER TABLE ONLY public.an_mcp_vaults
    ADD CONSTRAINT an_mcp_vaults_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'an_mcp_credentials', 'an_mcp_credentials_vault_id_fkey', $ddl$ALTER TABLE ONLY public.an_mcp_credentials
    ADD CONSTRAINT an_mcp_credentials_vault_id_fkey FOREIGN KEY (vault_id) REFERENCES public.an_mcp_vaults(id) ON DELETE CASCADE;
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'an_sandboxes', 'an_sandboxes_deployment_id_fkey', $ddl$ALTER TABLE ONLY public.an_sandboxes
    ADD CONSTRAINT an_sandboxes_deployment_id_fkey FOREIGN KEY (deployment_id) REFERENCES public.an_deployments(id) ON DELETE SET NULL;
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'an_sandboxes', 'an_sandboxes_invocation_team_id_fkey', $ddl$ALTER TABLE ONLY public.an_sandboxes
    ADD CONSTRAINT an_sandboxes_invocation_team_id_fkey FOREIGN KEY (invocation_team_id) REFERENCES public.teams(id) ON UPDATE CASCADE ON DELETE CASCADE;
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'an_spans', 'an_spans_thread_id_fkey', $ddl$ALTER TABLE ONLY public.an_spans
    ADD CONSTRAINT an_spans_thread_id_fkey FOREIGN KEY (thread_id) REFERENCES public.an_threads(id) ON DELETE CASCADE;
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'an_threads', 'an_threads_deployment_id_fkey', $ddl$ALTER TABLE ONLY public.an_threads
    ADD CONSTRAINT an_threads_deployment_id_fkey FOREIGN KEY (deployment_id) REFERENCES public.an_deployments(id) ON DELETE SET NULL;
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'an_threads', 'an_threads_vault_id_fkey', $ddl$ALTER TABLE ONLY public.an_threads
    ADD CONSTRAINT an_threads_vault_id_fkey FOREIGN KEY (vault_id) REFERENCES public.an_mcp_vaults(id) ON DELETE SET NULL;
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'an_runs', 'an_runs_team_id_fkey', $ddl$ALTER TABLE ONLY public.an_runs
    ADD CONSTRAINT an_runs_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'an_runs', 'an_runs_agent_id_fkey', $ddl$ALTER TABLE ONLY public.an_runs
    ADD CONSTRAINT an_runs_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.an_agent_configs(id) ON DELETE SET NULL;
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'an_runs', 'an_runs_thread_id_fkey', $ddl$ALTER TABLE ONLY public.an_runs
    ADD CONSTRAINT an_runs_thread_id_fkey FOREIGN KEY (thread_id) REFERENCES public.an_threads(id) ON DELETE SET NULL;
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'team_invite_links', 'team_invite_links_team_id_fkey', $ddl$ALTER TABLE ONLY public.team_invite_links
    ADD CONSTRAINT team_invite_links_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'team_members', 'team_members_team_id_fkey', $ddl$ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'team_members', 'team_members_user_id_fkey', $ddl$ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'team_pending_invites', 'team_pending_invites_team_id_fkey', $ddl$ALTER TABLE ONLY public.team_pending_invites
    ADD CONSTRAINT team_pending_invites_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'team_repository_sandboxes', 'team_repository_sandboxes_team_id_fkey', $ddl$ALTER TABLE ONLY public.team_repository_sandboxes
    ADD CONSTRAINT team_repository_sandboxes_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'teams', 'teams_user_id_fkey', $ddl$ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'usages', 'usage_user_id_fkey', $ddl$ALTER TABLE ONLY public.usages
    ADD CONSTRAINT usage_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
$ddl$);


ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS email_verified boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS public.better_auth_sessions (
  id text NOT NULL,
  user_id text NOT NULL,
  expires_at timestamp(6) with time zone NOT NULL,
  token text NOT NULL,
  ip_address text,
  user_agent text,
  created_at timestamp(6) with time zone DEFAULT now() NOT NULL,
  updated_at timestamp(6) with time zone DEFAULT now() NOT NULL,
  CONSTRAINT better_auth_sessions_pkey PRIMARY KEY (id),
  CONSTRAINT better_auth_sessions_token_key UNIQUE (token),
  CONSTRAINT better_auth_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

SELECT pg_temp.ensure_constraint('public', 'better_auth_sessions', 'better_auth_sessions_pkey', $ddl$ALTER TABLE ONLY public.better_auth_sessions
  ADD CONSTRAINT better_auth_sessions_pkey PRIMARY KEY (id);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'better_auth_sessions', 'better_auth_sessions_token_key', $ddl$ALTER TABLE ONLY public.better_auth_sessions
  ADD CONSTRAINT better_auth_sessions_token_key UNIQUE (token);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'better_auth_sessions', 'better_auth_sessions_user_id_fkey', $ddl$ALTER TABLE ONLY public.better_auth_sessions
  ADD CONSTRAINT better_auth_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
$ddl$);

CREATE INDEX IF NOT EXISTS better_auth_sessions_user_id_idx ON public.better_auth_sessions USING btree (user_id);
CREATE INDEX IF NOT EXISTS better_auth_sessions_expires_at_idx ON public.better_auth_sessions USING btree (expires_at);

CREATE TABLE IF NOT EXISTS public.better_auth_accounts (
  id text NOT NULL,
  user_id text NOT NULL,
  provider_id text NOT NULL,
  account_id text NOT NULL,
  access_token text,
  refresh_token text,
  id_token text,
  access_token_expires_at timestamp(6) with time zone,
  refresh_token_expires_at timestamp(6) with time zone,
  scope text,
  password text,
  created_at timestamp(6) with time zone DEFAULT now() NOT NULL,
  updated_at timestamp(6) with time zone DEFAULT now() NOT NULL,
  CONSTRAINT better_auth_accounts_pkey PRIMARY KEY (id),
  CONSTRAINT better_auth_accounts_provider_id_account_id_key UNIQUE (provider_id, account_id),
  CONSTRAINT better_auth_accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

SELECT pg_temp.ensure_constraint('public', 'better_auth_accounts', 'better_auth_accounts_pkey', $ddl$ALTER TABLE ONLY public.better_auth_accounts
  ADD CONSTRAINT better_auth_accounts_pkey PRIMARY KEY (id);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'better_auth_accounts', 'better_auth_accounts_provider_id_account_id_key', $ddl$ALTER TABLE ONLY public.better_auth_accounts
  ADD CONSTRAINT better_auth_accounts_provider_id_account_id_key UNIQUE (provider_id, account_id);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'better_auth_accounts', 'better_auth_accounts_user_id_fkey', $ddl$ALTER TABLE ONLY public.better_auth_accounts
  ADD CONSTRAINT better_auth_accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
$ddl$);

CREATE INDEX IF NOT EXISTS better_auth_accounts_user_id_idx ON public.better_auth_accounts USING btree (user_id);

CREATE TABLE IF NOT EXISTS public.better_auth_verifications (
  id text NOT NULL,
  value text NOT NULL,
  expires_at timestamp(6) with time zone NOT NULL,
  identifier text NOT NULL,
  created_at timestamp(6) with time zone DEFAULT now() NOT NULL,
  updated_at timestamp(6) with time zone DEFAULT now() NOT NULL,
  CONSTRAINT better_auth_verifications_pkey PRIMARY KEY (id)
);

SELECT pg_temp.ensure_constraint('public', 'better_auth_verifications', 'better_auth_verifications_pkey', $ddl$ALTER TABLE ONLY public.better_auth_verifications
  ADD CONSTRAINT better_auth_verifications_pkey PRIMARY KEY (id);
$ddl$);

CREATE INDEX IF NOT EXISTS better_auth_verifications_identifier_idx ON public.better_auth_verifications USING btree (identifier);
CREATE INDEX IF NOT EXISTS better_auth_verifications_expires_at_idx ON public.better_auth_verifications USING btree (expires_at);

CREATE TABLE IF NOT EXISTS public.sso_providers (
  id text NOT NULL,
  issuer text NOT NULL,
  oidc_config text,
  saml_config text,
  user_id text NOT NULL,
  provider_id text NOT NULL,
  organization_id text,
  domain text NOT NULL,
  CONSTRAINT sso_providers_pkey PRIMARY KEY (id),
  CONSTRAINT sso_providers_provider_id_key UNIQUE (provider_id),
  CONSTRAINT sso_providers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

SELECT pg_temp.ensure_constraint('public', 'sso_providers', 'sso_providers_pkey', $ddl$ALTER TABLE ONLY public.sso_providers
  ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'sso_providers', 'sso_providers_provider_id_key', $ddl$ALTER TABLE ONLY public.sso_providers
  ADD CONSTRAINT sso_providers_provider_id_key UNIQUE (provider_id);
$ddl$);

SELECT pg_temp.ensure_constraint('public', 'sso_providers', 'sso_providers_user_id_fkey', $ddl$ALTER TABLE ONLY public.sso_providers
  ADD CONSTRAINT sso_providers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
$ddl$);

CREATE INDEX IF NOT EXISTS sso_providers_user_id_idx ON public.sso_providers USING btree (user_id);
CREATE INDEX IF NOT EXISTS sso_providers_domain_idx ON public.sso_providers USING btree (domain);
