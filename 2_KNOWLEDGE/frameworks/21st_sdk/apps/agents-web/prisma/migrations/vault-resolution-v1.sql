alter table "an_mcp_vaults"
  add column if not exists "is_default" boolean not null default false;

create index if not exists "an_mcp_vaults_team_default_lookup_idx"
  on "an_mcp_vaults" ("team_id", "is_default");

create unique index if not exists "an_mcp_vaults_team_default_idx"
  on "an_mcp_vaults" ("team_id")
  where "is_default" = true and "archived_at" is null;

create index if not exists "an_mcp_vaults_metadata_gin_idx"
  on "an_mcp_vaults" using gin ("metadata");
