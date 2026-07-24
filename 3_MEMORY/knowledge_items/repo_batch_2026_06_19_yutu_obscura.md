---
type: knowledge_item
domain: external_repo_ingestion
status: active
created_at: 2026-06-19
sources:
  - 2_KNOWLEDGE/raw_data/ingested_data/yutu_youtube_toolkit/README.md
  - 2_KNOWLEDGE/raw_data/ingested_data/obscura_headless_browser/README.md
  - 2_KNOWLEDGE/frameworks/multimedia_production/youtube_channel_operations_mcp/SKILL.md
  - 2_KNOWLEDGE/frameworks/browser_automation/obscura_headless_browser/SKILL.md
  - 5_RESEARCH/yutu/
  - 5_RESEARCH/obscura/
---

# Repo Ingestion Batch - 2026-06-19 - Yutu and Obscura

Two high-signal repositories were ingested and distilled into SEOSONA OS.

## Repository Summary

| Repository | Snapshot Signal | Primary Value | SEOSONA Artifact |
|---|---:|---|---|
| https://github.com/eat-pray-ai/yutu | 530 stars, 58 forks, active 2026-06-19 | YouTube CLI plus MCP plus agent routing for channel operations | `youtube-channel-operations-mcp` |
| https://github.com/h4ckf0r0day/obscura | 15,955 stars, 1,090 forks, active 2026-06-18 | Lightweight Rust headless browser with CDP and MCP support | `obscura-headless-browser` |

## Durable Lessons

- Domain CLIs become more useful to agents when their command surface is exposed through MCP with explicit credential and transport contracts.
- YouTube operations need lane separation: read-only retrieval, create/update modification, and confirmed destructive operations.
- Channel automation should be quota-aware because upload, caption, thumbnail, playlist, comment, and search operations have different YouTube API costs.
- Lightweight browser automation should separate protocol, page lifecycle, JavaScript runtime, DOM, networking, and MCP exposure into independent layers.
- Browser workers need hard timeouts, watchdogs, panic-safe boundaries, and private-network guards before they are safe for agentic scraping.
- CDP and MCP servers without built-in auth must remain loopback-only or behind authenticated network boundaries.

## Active Upgrades Created

- `2_KNOWLEDGE/frameworks/multimedia_production/youtube_channel_operations_mcp/SKILL.md`
- `2_KNOWLEDGE/frameworks/browser_automation/obscura_headless_browser/SKILL.md`

## Follow-Up Opportunities

- Benchmark Obscura against Playwright/Chrome on SEOSONA SEO audit targets.
- Add optional yutu MCP connector setup docs for YouTube channel operations.
- Extend SEOSONA video/content workflows with yutu-style operation lanes and quota planning.

