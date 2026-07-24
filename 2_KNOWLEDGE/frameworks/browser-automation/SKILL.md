---
name: browser-automation
description: "LLM-driven and MCP browser automation for scraping JS-heavy / interactive pages — login flows, infinite scroll, SERP interaction, form fill, multi-step navigation that a static DOM fetch cannot handle. Use when scraper_agent.fetch_dom returns empty/partial content or the task needs clicking/typing. Covers browser-use (Python LLM browser agent) and microsoft/playwright-mcp (MCP server wrapping Playwright)."
license: MIT (browser-use), Apache-2.0 (playwright-mcp)
metadata:
  type: connector-upgrade
  wired_into: 1_CORE/scripts/connectors/scraper_agent.py
---

# Browser Automation (browser-use + playwright-mcp)

Two upgrades over the existing static Playwright DOM fetch (`scraper_agent.fetch_dom`).

## browser-use (Python, MIT, ~100k★) — LLM browser agent
Drives a real browser from a natural-language task: navigates, clicks, fills, scrolls,
extracts. For pages `fetch_dom` can't handle (login, "load more", SERP, forms).

**Wired:** `scraper_agent.fetch_interactive(url, task)` — tries browser-use, falls back
to `fetch_dom` if not installed/errors. Enable with `pip install browser-use` + an LLM key.
```bash
python 1_CORE/scripts/connectors/scraper_agent.py --url <u> --task "search '<kw>' and return top 10 titles+URLs"
```

## microsoft/playwright-mcp (Apache-2.0, ~34k★) — MCP browser server
An MCP server exposing Playwright as tools (navigate, click, snapshot, network). Use it
when an agent should drive the browser via MCP rather than bespoke Python. The OS scraper
already uses Playwright directly; playwright-mcp is the agent-facing tool surface.

## When to use which
- **Static SPA content** → existing `fetch_dom` (fast, no LLM).
- **Interactive / multi-step** → `fetch_interactive` (browser-use).
- **Agent-orchestrated browsing** → playwright-mcp tools.
