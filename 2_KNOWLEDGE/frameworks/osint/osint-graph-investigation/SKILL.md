---

name: skill
description: "This skill enables SEOSONA OS to conduct graph-based Open Source Intelligence (OSINT) investigations. It leverages Flowsint (self-hosted, Docker-based graph platform) as the visualization layer and connects it with SEOSONA's existing SEO connectors as data enrichment sources."
  Skill for OSINT graph-based investigations using Flowsint as the visualization
  backend. Maps entity relationships (domains, IPs, emails, backlinks) into a
  graph structure. Integrates SEOSONA SEO data as enrichment nodes.
  Triggers when user asks to: map competitor relationships, investigate a domain,
  visualize backlink networks, or run OSINT on a target entity.
---

# OSINT Graph Investigation Skill

## Overview

This skill enables SEOSONA OS to conduct graph-based Open Source Intelligence (OSINT) investigations. It leverages Flowsint (self-hosted, Docker-based graph platform) as the visualization layer and connects it with SEOSONA's existing SEO connectors as data enrichment sources.

**Primary use cases:**
- Map competitor domains and their relationships
- Investigate a target domain's backlink network as a graph
- Build entity relationship maps from SEO audit data
- Visualize GSC data connections (queries → pages → rankings)

## Dependencies

| Skill | Role |
|---|---|
| `backlink_connector` | Source of referring domain data → becomes graph edges |
| `gsc_connector` | Query→page ranking data → enriches domain nodes |
| `technical_seo_scanner` | Technical health per node |
| `security_scanning` | Pre-deployment audit of Flowsint instance |

## Quick Start

### 1. Deploy Flowsint (one-time)

```powershell
# Windows
git clone http~/.seosona/path/
cd flowsint
copy .env.example .env
# REQUIRED: Edit .env — change these 3 values before proceeding:
#   AUTH_SECRET=<run: openssl rand -hex 32>
#   MASTER_VAULT_KEY_V1=<run: python3 -c "import os,base64; print('base64:'+base64.b64encode(os.urandom(32)).decode())">
#   NEO4J_PASSWORD=<your-strong-password>
docker compose -f docker-compose.prod.yml up -d
# Access: htt~/.seosona/path/:5173/register
```

### 2. Export SEOSONA Data as Graph-Ready Format

```python
# Run from SEOSONA OS root
python scripts/connectors/backlink_connector.py --domain <target.com>
# Output: 3_MEMORY/seo_exports/<domain>/backlink_report_*.csv
# Each row = one directed edge: source_domain → target_domain
```

### 3. Map to Flowsint Graph Schema

SEOSONA data maps to Flowsint node types:

| SEOSONA Data | Flowsint Node Type | Flowsint Edge |
|---|---|---|
| Referring domain (backlink) | `Domain` node | `LINKS_TO` |
| GSC query | `Keyword` node | `RANKS_FOR` |
| Competitor domain | `Domain` node | `COMPETES_WITH` |
| IP address (technical scan) | `IP` node | `RESOLVES_TO` |
| Email from WHOIS | `Email` node | `REGISTERED_BY` |

## Workflow

### Phase 1: Data Collection
1. Run `backlink_connector.py` for target domain
2. Run `gsc_connector.py` for ranking data
3. Run `technical_seo_scanner.py` for IP/hosting data

### Phase 2: Graph Import (Manual — Flowsint UI)
1. Open Flowsint at `htt~/.seosona/path/:5173`
2. Create new Investigation workspace
3. Add root node: target domain
4. Import backlinks as edges using Flowsint's bulk import feature

### Phase 3: Analysis
1. Identify clusters of domains linking to same target (link farms)
2. Map competitor overlap (domains linking to both you and competitors)
3. Flag suspicious patterns (many links from single IP range)

### Phase 4: Export Findings
1. Export graph from Flowsint as JSON
2. Store in `3_MEMORY/seo_exports/<domain>/osint_graph_<date>.json`
3. Log to memory: `python scripts/memory_logger.py --action osint_investigation --domain <domain>`

## Security Notes

> [!CAUTION]
> Before exposing Flowsint to any network (even LAN), MUST change all 3 secrets:
> - `AUTH_SECRET` — signs JWT tokens
> - `MASTER_VAULT_KEY_V1` — encrypts stored API keys
> - `NEO4J_PASSWORD` — database password
>
> The `.env.example` contains a **real** pre-generated `MASTER_VAULT_KEY_V1` — do NOT use it.

## Rate Limiting

- Flowsint itself: no rate limiting (self-hosted)
- External OSINT APIs used during enrichment: follow individual connector limits
- Common Crawl CDX: 1 req/sec recommended
- Google Autocomplete: 0.5 req/sec (300ms delay between calls)

## Common Mistakes

1. **Using `.env.example` as-is** — The example contains a real shared vault key. Anyone who uses it runs the same key, meaning any attacker who also read the README can decrypt your stored API keys.
2. **Exposing port 5173 without HTTPS** — Use Caddy or nginx reverse proxy with TLS for team/server deployments.
3. **Forgetting to run `memory_logger.py`** — OSINT investigations must be logged to `3_MEMORY/logs/` for audit trail and session continuity.

## Integration with SEOSONA OS SKILLS_ROUTER

This skill triggers when user intent matches:
- "map competitors", "competitor relationship", "domain graph"
- "backlink network", "link pattern", "visualize links"
- "OSINT", "investigate domain", "entity mapping"
- "who links to", "referring domain graph"
