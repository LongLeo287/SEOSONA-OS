# KI: Codebase Graph Analysis Patterns

_Source: [datit309/supergraph](https://github.com/datit309/supergraph) | Wave 4 (2026-06-22)_

## Core Concept

Supergraph is a Claude Code plugin that enforces mandatory AI workflows and provides intelligent codebase graph analysis. It builds a dependency graph of the entire codebase, detects dead code, circular dependencies, and validates project health before each task.

## Key Patterns for SEOSONA OS

### 1. Mandatory Workflow Enforcement
- Forces Agent to read `CLAUDE.md` + `AGENTS.md` before any code changes
- **Overlap with SEOSONA**: Directly mirrors the Startup Contract in SOUL.md (resolve → read SOUL → read MASTER_INDEX → route)
- **Gap filled**: Supergraph adds compile-time validation that SEOSONA currently does at runtime via `seosona_capability_bridge.js`

### 2. Dependency Graph Analysis
- Builds AST-level dependency graph of the codebase
- Detects: unused exports, circular imports, orphan files, dead code paths
- **Application**: Can integrate with `seosona-project-audit.cjs` or as a standalone health check before `npm run seosona:doctor`

### 3. Project Health Check Pattern
- Pre-task health scan: checks file count, complexity, test coverage
- Generates health score (0-100) before allowing code changes
- **Application**: Model this for SEOSONA's `system_maintenance_workflow.md` — add a health gate before major refactors

## Actionable Takeaways

1. Consider adding a pre-edit health gate to the SEOSONA Startup Contract
2. The dependency graph pattern could enhance the Knowledge Graph (`knowledge_graph.py`) to include file-level dependency tracking
3. Mandatory workflow enforcement validates the SEOSONA approach — we are already doing this right

## SEOSONA Integration Points

- `~/.seosona/1_CORE/scripts/seosona_capability_bridge.js` — add graph-based routing
- `~/.seosona/2_KNOWLEDGE/workflows/` — add pre-edit health gate workflow
- `~/.seosona/scripts/` — potential `codebase_graph_analyzer.py` script
