# Context7 — Up-to-date Code Docs for LLMs

> **Source**: https://github.com/upstash/context7
> **Ingested**: 2026-06-10
> **Type**: Reference (MCP Server / AI Development Tool)
> **License**: MIT
> **Author**: Upstash
> **NPM**: `@upstash/context7-mcp`

---

## Overview

Context7 is a platform that provides **up-to-date, version-specific documentation and code examples** directly into LLM prompts. It solves three critical problems with AI code generation:

1. ❌ **Outdated code examples** based on year-old training data
2. ❌ **Hallucinated APIs** that don't even exist
3. ❌ **Generic answers** for old package versions

With Context7, LLMs receive current, accurate documentation straight from the source — no tab-switching, no hallucinated APIs, no outdated code.

---

## How It Works

### Two Modes of Operation

| Mode | Description | Requirement |
|---|---|---|
| **CLI + Skills** | Installs a skill that guides agents to fetch docs using `ctx7` CLI commands | Node.js 18+ |
| **MCP** | Registers a Context7 MCP server so agents can call documentation tools natively | MCP-compatible client |

### Usage Example

```txt
Create a Next.js middleware that checks for a valid JWT in cookies
and redirects unauthenticated users to `/login`. use context7
```

Adding "use context7" to any prompt triggers the system to fetch real-time documentation for the mentioned libraries.

---

## Installation

```bash
# One-command setup (interactive)
npx ctx7 setup

# Target a specific agent
npx ctx7 setup --cursor
npx ctx7 setup --claude
npx ctx7 setup --opencode

# Remove setup
npx ctx7 remove
```

The setup command:
1. Authenticates via OAuth
2. Generates an API key
3. Installs the appropriate skill (CLI or MCP mode)

### API Key

- **Free tier** available at [context7.com/dashboard](https://context7.com/dashboard)
- Recommended for higher rate limits

---

## MCP Server Configuration

For use in SEOSONA OS or any MCP-compatible AI tool:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "${CONTEXT7_API_KEY}"
      }
    }
  }
}
```

---

## Architecture

| Component | Detail |
|---|---|
| **Data Source** | Crawled official documentation from 1000+ libraries |
| **Delivery** | MCP protocol or CLI-based context injection |
| **Client Support** | Cursor, Claude CLI, OpenCode, VS Code, Windsurf, etc. |
| **Versioning** | Version-specific docs (not just latest) |
| **Caching** | Server-side caching for fast retrieval |

---

## Key Design Patterns (Learnable)

1. **MCP-Native Documentation Delivery**: Instead of embedding all docs in system prompts, Context7 uses MCP tools to fetch relevant docs on-demand — dramatically reducing token usage while improving accuracy.
2. **Dual-Mode Architecture**: Supporting both CLI (for agents without MCP) and MCP (for native integration) ensures maximum compatibility across the AI tool ecosystem.
3. **"use context7" Trigger Pattern**: A natural-language trigger phrase that activates documentation retrieval — elegant UX pattern for optional tool activation.
4. **OAuth-Based Setup**: Single `npx ctx7 setup` command handles auth + key generation + skill installation — a gold standard for developer onboarding.

---

## SEOSONA Relevance Assessment

- **Skillize?** ❌ No — This is a hosted SaaS platform with its own MCP server, not a self-contained script.
- **Agentize?** ❌ No — Not requested by user.
- **Reference Value**: ✅ Very High — Context7 is directly relevant to SEOSONA's MCP infrastructure. The MCP server pattern and the "fetch docs on demand" approach could be adapted for SEOSONA's own documentation delivery system.
- **Classification**: `ingested_data/` reference only.

---

## SEOSONA Integration

Context7 is already referenced in SEOSONA's MCP configuration. To activate:

1. Add `CONTEXT7_API_KEY` to `1_CONFIG/.env` (already included)
2. Register the MCP server in your IDE's MCP config:
   ```json
   {
     "context7": {
       "command": "npx",
       "args": ["-y", "@upstash/context7-mcp"],
       "env": {
         "CONTEXT7_API_KEY": "${CONTEXT7_API_KEY}"
       }
     }
   }
   ```
3. Use "use context7" in prompts to fetch live documentation
