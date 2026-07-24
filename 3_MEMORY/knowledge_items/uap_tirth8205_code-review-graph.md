# KI: tirth8205/code-review-graph

## Overview
Package: code-review-graph

## Tech Stack (from code)
- Python (65 files)
- TypeScript (17 files)
- **Total:** 183 files, 33 directories
- **File types:** .py: 65, .md: 39, .csv: 18, .ts: 17, .png: 10, .yaml: 7, .json: 6, .gitignore: 4

## File Structure
```
  .gitignore
  .mcp.json
  AGENTS.md
  CHANGELOG.md
  CLAUDE.md
  CODE_OF_CONDUCT.md
  CONTRIBUTING.md
  GEMINI.md
  LICENSE
  README.hi-IN.md
  README.ja-JP.md
  README.ko-KR.md
  README.md
  README.zh-CN.md
  SECURITY.md
  action.yml
  pyproject.toml
  uv.lock
  .beads/
    .gitignore
    README.md
    config.yaml
    metadata.json
    hooks/
      post-checkout
      post-merge
      pre-commit
      pre-push
      prepare-commit-msg
  .serena/
    .gitignore
    project.yml
  code-review-graph-vscode/
    .gitignore
    .vscodeignore
    CHANGELOG.md
    LICENSE
    README.md
    esbuild.mjs
    package-lock.json
    package.json
    tsconfig.json
    media/
      icons/
        graph.svg
        icon.png
      walkthrough/
        build.md
        explore.md
        install.md
    src/
      extension.ts
      backend/
        cli.ts
        sqlite.ts
        watcher.ts
      features/
        blastRadius.ts
        cursorResolver.ts
        navigation.ts
        reviewAssistant.ts
        scmDecorations.ts
        search.ts
      onboarding/
        installer.ts
        welcome.ts
      views/
        graphWebview.ts
        statusBar.ts
        treeItems.ts
        treeView.ts
      webview/
        graph.ts
  code_review_graph/
    __init__.py
    __main__.py
    analysis.py
    changes.py
    cli.py
    communities.py
    constants.py
    context_savings.py
    custom_languages.py
    daemon.py
    daemon_cli.py
    embeddings.py
    enrich.py
    exports.py
    flows.py
    graph.py
    graph_diff.py
    hints.py
    incremental.py
    jedi_resolver.py
    main.py
    memory.py
    migrations.py
    parser.py
    postprocessing.py
    prompts.py
    refactor.py
    registry.py
    rescript_resolver.py
    search.py
    skills.py
    spring_resolver.py
    temporal_resolver.py
    token_benchmark.py
    tsconfig_resolver.py
    visualization.py
    wiki.py
    eval/
      __init__.py
      reporter.py
      runner.py
      scorer.py
      token_benchmark.py
```

## Agent Configuration
### AGENTS.md
# Agent Instructions

This project uses **bd** (beads) for issue tracking. Run `bd prime` for full workflow context.

## Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work atomically
bd close <id>         # Complete work
bd dolt push          # Push beads data to remote
```

## Non-Interactive Shell Commands

**ALWAYS use non-interactive flags** with file operations to avoid hanging on confirmation prompts.

Shell commands like `cp`, `mv`, and `rm` may be aliased to include `-i` (interactive) mode on some systems, causing the agent to hang indefinitely waiting for y/n input.

**Use these forms instead:**
```bash
# Force overwrite without prompting
cp -f source dest           # NOT: cp source dest
mv -f source dest           # NOT: mv source dest
rm -f file                  # NOT: rm file

# For recursive operations
rm -rf directory            # NOT: rm -r directory
cp -rf source dest          # NOT: cp -r source dest
```

**Other commands that may prompt:**
- `scp` - use `-o BatchMode=yes` for non-interactive
- `ssh` - use `-o BatchMode=yes` to fail instead of prompting
- `apt-get` - use `-y` flag
- `brew` - use `HOMEBREW_NO_AUTO_UPDATE=1` env var

<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:ca08a54f -->
## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

### Quick Reference

```bash
bd 

### GEMINI.md
<!-- code-review-graph MCP tools -->
## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes_tool` or `query_graph_tool` instead of Grep
- **Understanding impact**: `get_impact_radius_tool` instead of manually tracing imports
- **Code review**: `detect_changes_tool` + `get_review_context_tool` instead of reading entire files
- **Finding relationships**: `query_graph_tool` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview_tool` + `list_communities_tool`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool | Use when |
|------|----------|
| `detect_changes_tool` | Reviewing code changes — gives risk-scored analysis |
| `get_review_context_tool` | Need source snippets for review — token-efficient |
| `get_impact_radius_tool` | Understanding blast radius of a change |
| `get_affected_flows_tool` | Finding which execution paths are impacted |
| `query_graph_tool` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes_tool` | Finding functions/classes by name or keyword |
| `get_architecture_overview_tool` |

### CLAUDE.md
# CLAUDE.md - Project Context for Claude Code

## Project Overview

**code-review-graph** is a persistent, incrementally updated, local-first knowledge graph for token-efficient code review through MCP and the CLI. It parses codebases using Tree-sitter and targeted fallbacks, builds a structural graph in SQLite, and exposes compact context to AI coding tools including Claude Code, Codex, Cursor, Windsurf, Zed, Continue, OpenCode, Gemini CLI, Qwen, Kiro, Qoder, and GitHub Copilot.

## Graph Tool Usage (Token-Efficient)
When using code-review-graph MCP tools, follow these rules:
1. First call: `get_minimal_context(task="<description>")` — costs ~100 tokens, gives you the full picture.
2. All subsequent calls: use `detail_level="minimal"` unless you need more.
3. Prefer `query_graph_tool` with a specific target over broad `list_*` calls.
4. The `next_tool_suggestions` field in every response tells you the optimal next step.
5. Target: ≤5 tool calls per task, ≤800 total tokens of graph context.

## Architecture

- **Core Package**: `code_review_graph/` (Python 3.10+)
  - `parser.py` — Tree-sitter multi-language AST parser plus targeted fallbacks for broad source-language and notebook support
  - `custom_languages.py` — Config-driven custom language support (`.code-review-graph/languages.toml`, see docs/CUSTOM_LANGUAGES.md)
  - `graph.py` — SQLite-backed graph store (nodes, edges, BFS impact analysis)
  - `tools/` — 30 MCP tool implementations split by domain
  - `main.py` — FastM

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.
