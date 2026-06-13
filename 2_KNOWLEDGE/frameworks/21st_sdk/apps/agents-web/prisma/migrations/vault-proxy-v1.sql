alter table "an_mcp_credentials"
  add column if not exists "host_pattern" text;

alter table "an_mcp_credentials"
  add column if not exists "inject" jsonb not null default '{}';

update "an_mcp_credentials"
set "host_pattern" = lower(
  coalesce(
    substring("server_url_normalized" from '^[a-z][a-z0-9+.-]*://([^/:?#]+)'),
    "server_url_normalized"
  )
)
where "host_pattern" is null
  and "server_url_normalized" is not null;

update "an_mcp_credentials"
set "inject" = '{"kind":"header","header":"Authorization","prefix":"Bearer "}'::jsonb
where "inject" = '{}'::jsonb
  and "auth_type" in ('bearer', 'oauth');

create index if not exists "an_mcp_credentials_vault_host_idx"
  on "an_mcp_credentials" ("vault_id", "host_pattern")
  where "status" = 'active' and "archived_at" is null;
