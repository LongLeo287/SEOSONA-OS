# KI: mvanhorn/last30days-skill

## Overview
Package: last30days-skill

## Tech Stack (from code)
- Python (85 files)
- Go (11 files)
- Shell (7 files)
- **Total:** 152 files, 33 directories
- **File types:** .py: 85, .md: 22, .go: 11, .json: 8, .sh: 7, .jpeg: 3, .gitignore: 2, .skillignore: 2

## File Structure
```
  .clawhubignore
  .gitattributes
  .gitignore
  .skillignore
  AGENTS.md
  CHANGELOG.md
  CLAUDE.md
  CONCEPTS.md
  CONFIGURATION.md
  CONTRIBUTORS.md
  HERMES_SETUP.md
  LICENSE
  README.md
  gemini-extension.json
  greptile.json
  pyproject.toml
  uv.lock
  .agents/
    plugins/
      marketplace.json
  .claude-plugin/
    marketplace.json
    plugin.json
  .codex-plugin/
    plugin.json
  docs/
    how-search-works.md
    pr-credits.md
    search-quality-eval.md
    v2.1-launch-copy.md
    v2.5-launch-tweets.md
    reference/
      old-nux-wizard-v3.0.0.md
    releases/
      v3.0.9.md
    solutions/
      architecture/
        search-quality-eval-manual-by-default-2026-05-10.md
      integration-issues/
        digg-cli-agent-path-setup-wizard.md
      logic-errors/
        entity-grounding-full-phrase-false-demotion.md
      workflow-issues/
        release-consistency-test-cascade-2026-05-16.md
  hooks/
    hooks.json
    scripts/
      check-config.sh
  mcp/
    .gitignore
    README.md
    go.mod
    go.sum
    manifest.json
    cmd/
      last30days-pp-mcp/
        main.go
    internal/
      engine/
        embed.go
        extract.go
        extract_test.go
        run.go
        run_test.go
        vendored/
          .gitkeep
      manifest/
        manifest_test.go
      tools/
        preflight.go
        preflight_test.go
        research.go
        research_test.go
    scripts/
      sync-engine.sh
  media/
    pr-assets/
      gogcli-589-zoom-demo.gif
  skills/
    last30days/
      .skillignore
      SKILL.md
      agents/
        openai.yaml
      assets/
        aging-portrait.jpeg
        claude-code-rap.mp3
        dog-as-human.png
        dog-original.jpeg
        swimmom-mockup.jpeg
      references/
        save-html-brief.md
      scripts/
        briefing.py
        build-skill.sh
        compare.sh
        evaluate_search_quality.py
        last30days.py
        setup-keychain.sh
        setup-pass.sh
        store.py
        test-v1-vs
```

## Agent Configuration
### AGENTS.md
# last30days Skill

Agent Skills package for researching any topic across Reddit, X, YouTube, and web. Installable across Claude Code (most common host), Codex, Cursor, GitHub Copilot, Gemini CLI, and 50+ other [Agent Skills](https://agentskills.io) hosts. Python scripts with multi-source search aggregation.

## Structure
- `skills/last30days/SKILL.md` — canonical skill definition / runtime spec the model reads when the slash command fires
- `skills/last30days/scripts/last30days.py` — main research engine
- `skills/last30days/scripts/lib/` — search, enrichment, rendering modules
- `skills/last30days/scripts/lib/vendor/bird-search/` — vendored X search client
- `docs/solutions/` — documented solutions to past problems (bugs, best practices, workflow patterns), organized by category with YAML frontmatter (`module`, `tags`, `problem_type`)
- `CONCEPTS.md` — shared domain vocabulary (Skill, Engine, Harness, Beta channel) — relevant when orienting to the codebase or discussing project terminology
- `CONFIGURATION.md` — user-facing knobs (env vars, flags, per-host install patterns); keep in sync per the rules below
- `CHANGELOG.md` — structured release history (launch copy lives in GitHub Releases)
- `HERMES_SETUP.md` — install instructions for the Hermes harness specifically

## Orientation
- This is an Agent Skills package, not a CLI tool. The product is the slash-command-invoked skill (`/last30days <topic>` in most harnesses); `scripts/last30days.py` is implementation. Claude Co

### CLAUDE.md
@AGENTS.md


## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 89/100 · **Auto-apply:** False
- **Evidence:** `agent`, `workflow`, `mcp`, `planner`
- **All scores:** {'seosona-os': 89, 'seosona-video': 24, 'seosona-content': 28, 'seosona-ux-ui': 22, 'seosona-flow': 56}
