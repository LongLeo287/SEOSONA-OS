# 1_CONFIG — Configuration

All settings, schemas, and registries that tune SEOSONA OS. Real secrets never live here — only
`*.example` templates are tracked; copy them and fill in your values locally (the real files are
gitignored).

## Folders

| Folder | What's inside |
|---|---|
| `ide_profiles/` | Per-IDE / per-tool profile fragments injected during setup (Cursor, Windsurf, Codex, …). |
| `schemas/` | JSON Schemas that validate the config + `seosona.project.json` manifests. |

## Files

| File | Purpose |
|---|---|
| `.env.example` | Template for local secrets/keys (API keys, tokens). Copy to `.env` (gitignored) and fill in. |
| `system_settings.yaml` | Global OS settings — autonomy level, feature toggles, defaults. |
| `mcp_servers.json` | Declares the MCP servers the OS can connect to (the runtime `.mcp.json` at the repo root is the live registration). |
| `workspaces.example.json` | Template for the satellite/workspace registry (which projects the brain indexes). Copy to `workspaces.json` (gitignored, machine-specific). |
| `api_gateway_config.example.json` | Template for the API-gateway routing config (provider keys, rate limits). |
| `free_api_catalog.json` | Catalog of free/keyless API providers the connectors can fall back to. |
| `dreaming_sources.json` | Source list the `dreaming_daemon` reflects over during idle self-improvement. |
| `requirements-connectors.txt` | Python dependencies for the SEO/data connectors (`npm run apis:free:install`). |

> **Never commit real secrets.** `.env`, `workspaces.json`, `*_credentials.json` and the non-example
> configs are gitignored by design.
