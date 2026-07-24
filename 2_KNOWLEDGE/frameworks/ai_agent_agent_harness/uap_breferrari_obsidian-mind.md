# KI: breferrari/obsidian-mind

## Overview
Repository with 131 files across 41 directories. Primary language: TypeScript (26 files).

## Tech Stack (from code)
- TypeScript (26 files)
- **Total:** 131 files, 41 directories
- **File types:** .md: 67, .ts: 26, .json: 12, .gitkeep: 9, .base: 7, .gitignore: 2, .yaml: 2, .shardmindignore: 1

## File Structure
```
  .gitignore
  .mcp.json
  .shardmindignore
  AGENTS.md
  ARCHITECTURE.md
  CHANGELOG.md
  CLAUDE.md
  CONTRIBUTING.md
  GEMINI.md
  Home.md
  LICENSE
  README.ja.md
  README.ko.md
  README.md
  README.zh-CN.md
  obsidian-mind-demo.gif
  obsidian-mind-logo.png
  vault-manifest.json
  .claude/
    memory-template.md
    settings.json
    update-skills.ts
    agents/
      brag-spotter.md
      context-loader.md
      cross-linker.md
      people-profiler.md
      review-fact-checker.md
      review-prep.md
      slack-archaeologist.md
      vault-librarian.md
      vault-migrator.md
    commands/
      om-capture-1on1.md
      om-dump.md
      om-humanize.md
      om-incident-capture.md
      om-intake.md
      om-meeting.md
      om-peer-scan.md
      om-prep-1on1.md
      om-project-archive.md
      om-review-brief.md
      om-review-peer.md
      om-self-review.md
      om-slack-scan.md
      om-standup.md
      om-vault-audit.md
      om-vault-upgrade.md
      om-weekly.md
      om-wrap-up.md
    scripts/
      .gitignore
      charcount.ts
      classify-message.ts
      package.json
      pre-compact.ts
      qmd-mcp.d.mts
      qmd-mcp.mjs
      qmd-refresh-run.ts
      qmd-refresh.ts
      session-start.ts
      stop-checklist.ts
      tsconfig.json
      validate-write.ts
      lib/
        charcount.ts
        frontmatter.ts
        hook-io.ts
        main-guard.ts
        matcher.ts
        qmd-bootstrap.ts
        qmd-ignore.ts
        qmd-refresh.ts
        qmd.ts
        read-field.ts
        regex.ts
        session-start.ts
        signals.ts
    skills/
      defuddle/
        SKILL.md
      json-canvas/
        SKILL.md
        references/
          EXAMPLES.md
      obsidian-bases/
        SKILL.md
        references/
          FUNCTIONS_REFERENCE.md
      obsidian-cli/
        SKILL.md
      obsidian-markdown/
        SKILL.md
        references/
          CALLOUTS.md
          EMBEDS.md
          PROPERTIES.md
      qmd/
        SKILL.md
  .claud
```

## Agent Configuration
### CLAUDE.md
# Obsidian Mind

Personal Obsidian vault -- an external brain for work notes, decisions, performance tracking, and Claude context.

## Skills & Capabilities

This vault has [obsidian-skills](https://github.com/kepano/obsidian-skills) installed in `.claude/skills/`. Follow these skill conventions:

- **obsidian-markdown**: Obsidian-flavored markdown -- wikilinks, embeds, callouts, properties. See `references/` for callout types, embed syntax, and property specs. Always prefer `[[wikilinks]]` over markdown links.
- **obsidian-cli**: CLI commands for vault operations when Obsidian is running. See CLI section below.
- **json-canvas**: Create `.canvas` files with nodes, edges, and visual layouts. See `references/EXAMPLES.md`.
- **obsidian-bases**: Create `.base` files with views, filters, and formulas. Bases core plugin is enabled. See `references/FUNCTIONS_REFERENCE.md`.
- **defuddle**: Extract clean markdown from web pages via `defuddle parse <url> --md`.
- **qmd**: Semantic search across the vault via [QMD](https://github.com/tobi/qmd). Use PROACTIVELY before reading files. **Preference order — pick the highest surface available and stop:**
  1. **`mcp__qmd__query`, `mcp__qmd__get`, `mcp__qmd__multi_get`, `mcp__qmd__status`** — registered MCP tools. If you see them in your tool menu, they are live and pre-scoped to this vault's index. Use them first; no `--index` argument needed.
  2. **`qmd --index <name> query|search|vsearch|get|multi-get`** — CLI fallback for one-off shell c

### AGENTS.md
# Obsidian Mind

This vault is built for [Claude Code](https://claude.ai/code) with a full operating manual in `CLAUDE.md`.

**Read `CLAUDE.md` for all vault conventions** — structure, note types, linking rules, frontmatter schemas, indexes, and workflows. Most of the content is agent-agnostic.

## Hooks

The hook scripts in `.claude/scripts/` are agent-agnostic TypeScript and shell, executed natively by Node via `--experimental-strip-types` — no build step, no runtime dependencies, no Claude SDK. Hook configs are provided for three agents:

| Agent | Config | Status |
|-------|--------|--------|
| Claude Code | `.claude/settings.json` | Full support |
| Codex CLI | `.codex/hooks.json` | Shared hook scripts |
| Gemini CLI | `.gemini/settings.json` | Shared hook scripts |

| Script | Purpose | Claude event | Codex event | Gemini event |
|--------|---------|--------------|-------------|--------------|
| `session-start.ts` | Inject vault context at startup | SessionStart | SessionStart | SessionStart |
| `classify-message.ts` | Classify messages, inject routing hints | UserPromptSubmit | UserPromptSubmit | BeforeAgent |
| `validate-write.ts` | Validate frontmatter and wikilinks | PostToolUse | PostToolUse | AfterTool |
| `pre-compact.ts` | Back up transcript before compaction | PreCompact | — | PreCompress |

## Commands

18 commands in `.claude/commands/` — agent-agnostic markdown with YAML frontmatter.

- **Claude Code / Gemini CLI**: invoke as `/om-standup`, `/om-dump`, etc.


### GEMINI.md
# Obsidian Mind

This vault is built for [Claude Code](https://claude.ai/code) with a full operating manual in `CLAUDE.md`.

**Read `CLAUDE.md` for all vault conventions** — structure, note types, linking rules, frontmatter schemas, indexes, and workflows. Most of the content is agent-agnostic.

## Hooks

The hook scripts in `.claude/scripts/` are agent-agnostic TypeScript and shell, executed natively by Node via `--experimental-strip-types` — no build step, no runtime dependencies, no Claude SDK. Hook configs are provided for three agents:

| Agent | Config | Status |
|-------|--------|--------|
| Claude Code | `.claude/settings.json` | Full support |
| Codex CLI | `.codex/hooks.json` | Shared hook scripts |
| Gemini CLI | `.gemini/settings.json` | Shared hook scripts |

| Script | Purpose | Claude event | Codex event | Gemini event |
|--------|---------|--------------|-------------|--------------|
| `session-start.ts` | Inject vault context at startup | SessionStart | SessionStart | SessionStart |
| `classify-message.ts` | Classify messages, inject routing hints | UserPromptSubmit | UserPromptSubmit | BeforeAgent |
| `validate-write.ts` | Validate frontmatter and wikilinks | PostToolUse | PostToolUse | AfterTool |
| `pre-compact.ts` | Back up transcript before compaction | PreCompact | — | PreCompress |

## Commands

18 commands in `.claude/commands/` — agent-agnostic markdown with YAML frontmatter.

- **Claude Code / Gemini CLI**: invoke as `/om-standup`, `/om-dump`, etc.


## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 28, 'seosona-ux-ui': 33, 'seosona-flow': 0}
