alter table "an_threads"
  add column if not exists "vault_ids" uuid[] not null default '{}';

update "an_threads"
set "vault_ids" = case
  when "vault_id" is null then '{}'
  else array["vault_id"]
end
where "vault_ids" = '{}';

create index if not exists "idx_an_threads_vault_ids"
  on "an_threads" using gin ("vault_ids");

alter table "an_mcp_vaults"
  add column if not exists "metadata" jsonb not null default '{}';

alter table "an_mcp_credentials"
  add column if not exists "metadata" jsonb not null default '{}';

alter table "an_mcp_credentials"
  alter column "encrypted_auth" drop not null;

drop index if exists "uq_an_mcp_credentials_vault_url";

create unique index if not exists "uq_an_mcp_credentials_active_vault_url"
  on "an_mcp_credentials" ("vault_id", "server_url_normalized")
  where "status" = 'active' and "archived_at" is null;
