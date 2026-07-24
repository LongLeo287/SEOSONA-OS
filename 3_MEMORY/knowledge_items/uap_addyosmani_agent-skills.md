# KI: addyosmani/agent-skills

## Overview
Repository with 121 files across 42 directories. Primary language: Shell (7 files).

## Tech Stack (from code)
- Shell (7 files)
- JavaScript (3 files)
- **Total:** 121 files, 42 directories
- **File types:** .md: 64, .json: 28, .toml: 16, .sh: 7, .js: 3, .gitignore: 1

## File Structure
```
  .gitignore
  AGENTS.md
  CLAUDE.md
  CONTRIBUTING.md
  LICENSE
  README.md
  plugin.json
  .claude/
    commands/
      build.md
      code-simplify.md
      plan.md
      review.md
      ship.md
      spec.md
      test.md
      webperf.md
    rules/
      skills-contributing.md
  .claude-plugin/
    marketplace.json
    plugin.json
  .gemini/
    commands/
      build.toml
      code-simplify.toml
      planning.toml
      review.toml
      ship.toml
      spec.toml
      test.toml
      webperf.toml
  .opencode/
    skills
  agents/
    code-reviewer.md
    security-auditor.md
    test-engineer.md
    web-performance-auditor.md
  commands/
    build.toml
    code-simplify.toml
    planning.toml
    review.toml
    ship.toml
    spec.toml
    test.toml
    webperf.toml
  docs/
    agents.md
    antigravity-setup.md
    comparison.md
    copilot-setup.md
    cursor-setup.md
    gemini-cli-setup.md
    getting-started.md
    opencode-setup.md
    skill-anatomy.md
    windsurf-setup.md
  evals/
    README.md
    cases/
      api-and-interface-design.json
      browser-testing-with-devtools.json
      ci-cd-and-automation.json
      code-review-and-quality.json
      code-simplification.json
      context-engineering.json
      debugging-and-error-recovery.json
      deprecation-and-migration.json
      documentation-and-adrs.json
      doubt-driven-development.json
      frontend-ui-engineering.json
      git-workflow-and-versioning.json
      idea-refine.json
      incremental-implementation.json
      interview-me.json
      observability-and-instrumentation.json
      performance-optimization.json
      planning-and-task-breakdown.json
      security-and-hardening.json
      shipping-and-launch.json
      source-driven-development.json
      spec-driven-development.json
      test-driven-development.json
      using-agent-skills.json
  hooks/
    SDD-CACHE.md
    SIMPLIFY-IGNORE.md
    hooks.json
    sdd-cache-post.sh
    sdd-cache-pre.sh
    session-start-test.
```

## Agent Configuration
### CLAUDE.md
# agent-skills

This is the agent-skills project — a collection of production-grade engineering skills for AI coding agents.

## Project Structure

```
skills/       → Core skills (SKILL.md per directory)
agents/       → Reusable agent personas (code-reviewer, test-engineer, security-auditor, web-performance-auditor)
hooks/        → Session lifecycle hooks
.claude/commands/ → Slash commands (/spec, /plan, /build, /test, /review, /code-simplify, /ship; plus /webperf specialist audit)
references/   → Supplementary checklists (testing, performance, security, accessibility, observability)
evals/        → Skill eval cases + framework (see evals/README.md)
docs/         → Setup guides for different tools
```

## Skills by Phase

**Define:** interview-me, idea-refine, spec-driven-development
**Plan:** planning-and-task-breakdown
**Build:** incremental-implementation, test-driven-development, context-engineering, source-driven-development, doubt-driven-development, frontend-ui-engineering, api-and-interface-design
**Verify:** browser-testing-with-devtools, debugging-and-error-recovery
**Review:** code-review-and-quality, code-simplification, security-and-hardening, performance-optimization
**Ship:** git-workflow-and-versioning, ci-cd-and-automation, deprecation-and-migration, documentation-and-adrs, observability-and-instrumentation, shipping-and-launch

## Conventions

- Every skill lives in `skills/<name>/SKILL.md`
- YAML frontmatter with `name` and `description` fields
- Descripti

### AGENTS.md
# AGENTS.md

This file provides guidance to AI coding agents (Claude Code, Cursor, Copilot, Antigravity, etc.) when working with code in this repository.

## Repository Overview

A collection of skills for Claude.ai and Claude Code for senior software engineers. Skills are packaged instructions and scripts that extend Claude and your coding agents capabilities.

## OpenCode Integration

OpenCode uses a **skill-driven execution model** powered by the `skill` tool and this repository's `/skills` directory.

### Core Rules

- If a task matches a skill, you MUST invoke it
- Skills are located in `skills/<skill-name>/SKILL.md`
- Never implement directly if a skill applies
- Always follow the skill instructions exactly (do not partially apply them)

### Intent → Skill Mapping

The agent should automatically map user intent to skills:

- Feature / new functionality → `spec-driven-development`, then `incremental-implementation`, `test-driven-development`
- Planning / breakdown → `planning-and-task-breakdown`
- Bug / failure / unexpected behavior → `debugging-and-error-recovery`
- Code review → `code-review-and-quality`
- Refactoring / simplification → `code-simplification`
- API or interface design → `api-and-interface-design`
- UI work → `frontend-ui-engineering`

### Lifecycle Mapping (Implicit Commands)

OpenCode does not support slash commands like `/spec` or `/plan`.

Instead, the agent must internally follow this lifecycle:

- DEFINE → `spec-driven-development`
- PLAN → `planni

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 28}
