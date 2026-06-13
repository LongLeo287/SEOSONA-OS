create table if not exists "an_mcp_vaults" (
  "id" uuid primary key default gen_random_uuid(),
  "team_id" uuid not null references "teams"("id") on delete cascade,
  "name" text not null,
  "description" text,
  "status" text not null default 'active',
  "created_at" timestamptz not null default now(),
  "updated_at" timestamptz not null default now(),
  "archived_at" timestamptz
);

create index if not exists "an_mcp_vaults_team_id_idx"
  on "an_mcp_vaults" ("team_id");

create index if not exists "an_mcp_vaults_team_status_idx"
  on "an_mcp_vaults" ("team_id", "status");

create table if not exists "an_mcp_credentials" (
  "id" uuid primary key default gen_random_uuid(),
  "vault_id" uuid not null references "an_mcp_vaults"("id") on delete cascade,
  "name" text,
  "server_url" text not null,
  "server_url_normalized" text not null,
  "auth_type" text not null,
  "encrypted_auth" text not null,
  "auth_meta" jsonb,
  "status" text not null default 'active',
  "last_error" text,
  "last_resolved_at" timestamptz,
  "created_at" timestamptz not null default now(),
  "updated_at" timestamptz not null default now(),
  "archived_at" timestamptz
);

create unique index if not exists "uq_an_mcp_credentials_vault_url"
  on "an_mcp_credentials" ("vault_id", "server_url_normalized");

create index if not exists "an_mcp_credentials_vault_id_idx"
  on "an_mcp_credentials" ("vault_id");

create index if not exists "an_mcp_credentials_vault_status_idx"
  on "an_mcp_credentials" ("vault_id", "status");

alter table "an_threads"
  add column if not exists "vault_id" uuid references "an_mcp_vaults"("id") on delete set null;

create index if not exists "idx_an_threads_vault"
  on "an_threads" ("vault_id");
