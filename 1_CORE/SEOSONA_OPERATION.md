# SEOSONA OS V5 Operational Ecosystem

This document describes the standard operating model for SEOSONA OS as a portable AI operating system powered by the V5 Intelligence Architecture.

## 1. Core Mechanism

SEOSONA OS is not tied to one project folder, IDE, CLI, or physical installation path. It operates as a portable system graph, driven by modular context assembly and intent-based routing.

The mechanism has four layers:

1. **Portable Anchor:** `~/.seosona` points to the active SEOSONA OS root.
2. **Environment Variable:** `${SEOSONA_ROOT}` can be used by scripts and runtime configs.
3. **Context Engine (V5):** IDEs and CLIs receive a startup instruction that points them to the Context Engine, which dynamically assembles `1_CORE/SOUL.md` blocks alongside domain-specific skills and session memory based on token budgets.
4. **Capability Bridge:** `~/.seosona/1_CORE/scripts/seosona_capability_bridge.js` exposes the system graph as portable JSON.

## 2. System Graph & Intelligence Layer (V5)

The portable graph now operates using a semantic **Knowledge Graph** (replacing flat routing files):

- Skills (`2_KNOWLEDGE/frameworks/`) are parsed into nodes and edges via `knowledge_graph.py`.
- Agents (`4_AGENTS/personas/`) and Workflows (`1_CORE/workflows/`) are linked semantically.
- **Intent Router:** Automatically classifies user intent, extracts domain terms, and queries the Knowledge Graph for the most relevant skills.
- **Session Memory:** Cross-session audit metrics and historical context (`3_MEMORY/sessions/`) are injected automatically into the LLM context to prevent regressions.

Connected tools should route through the **Intent Router** or the Context Engine when they need to discover capabilities.

## 3. Daily Flow

1. Open any project folder.
2. Open any connected IDE, CLI, MCP client, or agent runtime.
3. The tool resolves SEOSONA through `~/.seosona`.
4. The tool (or user prompt) queries the **Context Engine**:
   ```bash
   python ~/.seosona/1_CORE/scripts/context_engine.py --task "your task description"
   ```
5. The Context Engine dynamically loads the base `SOUL.md` rules, plus highly relevant Domain Skills via the Intent Router, and injects previous Session Memory.
6. The tool executes using parallel task decomposition (**Task Planner**) if performing complex audits.
7. The tool validates outputs (**Validation Loops**), grades them (**Quality Scorer**), and logs major work under `3_MEMORY/sessions/`.

## 4. Administration

When adding or updating system knowledge:

- Add skills under `2_KNOWLEDGE/frameworks/`.
- Add agents under `4_AGENTS/personas/`.
- Add workflows under `1_CORE/workflows/` or `2_KNOWLEDGE/workflows/`.
- Add KIs under `3_MEMORY/knowledge_items/`.
- Rebuild routing graph:
  ```bash
  python 1_CORE/scripts/core/plugin_manager.py
  python 1_CORE/scripts/knowledge_graph.py --build
  ```
- Validate with `npm run capabilities:validate` and `npm run status`.

Persistent instructions, docs, configs, skills, and memory must use `~/.seosona`, `${SEOSONA_ROOT}`, or relative paths. Physical installation paths are not allowed.

TASK COMPLETED
