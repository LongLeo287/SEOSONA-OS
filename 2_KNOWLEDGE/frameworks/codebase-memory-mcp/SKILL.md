---
name: codebase-memory-mcp
description: "Code-structure knowledge-graph over MCP (DeusData/codebase-memory-mcp, MIT, C/C++ static binary, local, zero-deps) — indexes a repo into a queryable graph (functions/classes/calls/imports, inheritance, data-flow, blast-radius/impact, call chains). A potential alternative to the already-adopted FastCode for OS code navigation. CONDITIONAL: A/B against FastCode before adopting — don't run two code-nav MCPs."
license: MIT
metadata:
  type: code-navigation
  source: https://github.com/DeusData/codebase-memory-mcp
  status: CHOSEN code-nav MCP (2026-06-25) — supersedes fastcode-navigation
---

> **DECISION (2026-06-25): codebase-memory-mcp is the chosen code-nav MCP; FastCode is
> demoted to reference.** Why it wins for SEOSONA OS: no extra LLM (the harness agent is the
> intelligence), deterministic sub-ms graph queries, 158 languages (vs FastCode's 9), and
> 12 explicit edge types incl. impact/blast-radius (`detect_changes`), data-flow, HTTP routes,
> ADRs, and runtime-trace validation. FastCode's edge (a bundled small LLM for NL Q&A) is a
> downside here — an extra model dep the OS doesn't need.
>
## ✅ OPERATIONAL (2026-06-25) — installed + indexed + wired
- **Binary**: `1_CORE/bin/codebase-memory-mcp/codebase-memory-mcp.exe` (v0.8.1, gitignored —
  269 MB, re-fetch from the release). Installed WITHOUT the auto-config installer (it would
  reconfigure 9 agents); wired only SEOSONA.
- **Indexed**: `npm run codegraph:index` → project `D-SEOSONA-AI-SEOSONA-OS`, 189,046 nodes /
  383,835 edges / 21,783 functions over 12,404 files (~39 s). Re-run after big changes.
- **Wired**: `.mcp.json` at repo root registers the `codebase-memory` MCP server (stdio).
  Handshake verified (server 0.10.0, protocol 2024-11-05, `tools` capability). Claude Code in
  this repo mounts it automatically; standalone: `npm run mcp:codegraph`.
- **Verified queries**: `get_architecture` (Python 1631 / TS 255 / HTML 238 files…),
  `search_graph` (13,567 Function nodes). Pass `project: "D-SEOSONA-AI-SEOSONA-OS"` to tools.

# codebase-memory-mcp — code graph via MCP (FastCode alternative)

[DeusData/codebase-memory-mcp](https://github.com/DeusData/codebase-memory-mcp) (MIT, ~14k★,
single C/C++ static binary, fully local, SQLite graph at `~/.cache/codebase-memory-mcp/`).
Indexes a codebase into a queryable knowledge graph and serves it over MCP: "what calls
this", cross-package call chains, blast-radius / impact analysis, inheritance hierarchies.

## Distinct from 3_MEMORY, overlapping FastCode
- vs `3_MEMORY` / `memory_reflect`: NO overlap — that's agent facts/episodes; this is a code
  call-graph.
- vs `fastcode-navigation` (already adopted): **real overlap** — both are code-navigation MCPs.
  codebase-memory-mcp's edge is graph-traversal depth (impact/blast-radius); FastCode does
  symbol/definition search + token-efficient retrieval.

## Tools (14, all deterministic — no LLM)
`index_repository`, `index_status`, `list_projects`, `delete_project`; `search_graph`,
`trace_path`/`trace_call_path` (BFS calls, depth 1–5), `detect_changes` (git diff → affected
symbols + risk), `query_graph` (Cypher-like), `get_graph_schema`, `get_code_snippet`,
`get_architecture` (langs/packages/routes/hotspots/clusters/ADRs), `search_code` (grep),
`manage_adr` (ADR CRUD), `ingest_traces` (runtime traces → validate HTTP_CALLS edges).
Edge types: CALLS, IMPORTS, DEFINES, IMPLEMENTS, INHERITS, HTTP_CALLS, ASYNC_CALLS, EMITS,
LISTENS_ON, DATA_FLOWS, SIMILAR_TO, SEMANTICALLY_RELATED.
