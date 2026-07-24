# SEOSONA OS — Setup (clone → run)

A fresh clone is **complete and runnable**: all code, config, agent personas, the framework/skill
library, the knowledge base (KIs), and 37 vendored agent skills ship in the repo. Only a few
genuinely-heavy or fetch-on-demand binaries are pulled by the steps below — nothing else is needed.

## 1. Install dependencies

```bash
npm install          # runs postinstall (git hooks) automatically
```

Python tooling (UAP pipeline, connectors, the knowledge MCP) uses the system Python 3.11+. Optional
per-feature Python deps:

```bash
npm run apis:free:install     # free-API connector deps
```

## 2. Fetch the heavy binaries (not in git — over GitHub's 100 MB/file limit or large assets)

| What | Why it's out of git | How to fetch |
|------|--------------------|--------------|
| `codebase-memory-mcp.exe` (257 MB) | single binary > 100 MB | `powershell -File 1_CORE/bin/codebase-memory-mcp/install.ps1` — downloads the latest release from `github.com/DeusData/codebase-memory-mcp`. Point `.mcp.json`'s `codebase-memory` command at the installed path (or copy the exe into `1_CORE/bin/codebase-memory-mcp/`). |
| `.agents/skills/kami/assets/` (73 MB fonts) | heavy, licensed/​downloadable fonts | Only needed if you use the `kami` typeset skill. Re-add the font assets there; the skill code runs without them (falls back to system fonts). |
| `.agents/skills/notebooklm-py/tests/` (53 MB VCR cassettes) | test fixtures — not runtime | Not needed to run; only for that skill's own test suite. |

The vector index (`3_MEMORY/vector_index/`) is **not** shipped — it self-heals: the first
`knowledge_search` (or any `query`) rebuilds it from the KIs in ~12 s and persists it.

## 3. Connect the knowledge MCP (optional but recommended)

`.mcp.json` already registers two servers:
- `codebase-memory` — code knowledge-graph (needs the exe from step 2).
- `seosona-knowledge` — semantic search over `3_MEMORY/knowledge_items` (pure Python, works out of
  the box). It spawns at the **start of a new session**, so open a fresh Claude Code session after
  cloning to use it.

## 4. Connect a satellite project (optional)

```bash
npm run project:init      # from inside a satellite repo: writes seosona.project.json + rule files
```

## What is / isn't in git

- **In git (full):** `1_CORE` code, `1_CONFIG`, `4_AGENTS` personas, `2_KNOWLEDGE` framework/skill
  library, `3_MEMORY/knowledge_items` (the knowledge base), 37 vendored `.agents/skills`, docs.
- **Not in git (fetched/local):** the `.exe` (step 2), heavy skill assets (kami fonts, notebooklm
  cassettes), generated runtime state (`vector_index/`, `uap_queue.*`, routing logs), secrets
  (`.env`, `*_credentials.json` — copy `.env.example`), `node_modules`.
