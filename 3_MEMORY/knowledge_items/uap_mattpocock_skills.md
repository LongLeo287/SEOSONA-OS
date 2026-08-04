# KI: mattpocock/skills

## Overview
Matt Pocock's agent skills for real engineering

## Tech Stack (from code)
- Shell (5 files)
- **Total:** 155 files, 100 directories
- **File types:** .md: 102, .yaml: 41, .sh: 5, .json: 4, .gitignore: 1, .cjs: 1

## Dependencies

### Dev Dependencies
- `@changesets/changelog-github`: ^0.7.0
- `@changesets/cli`: ^2.30.0

## Available Commands
- `npm run changeset` -- `changeset`
- `npm run version` -- `changeset version`

## File Structure
```
  .gitignore
  AGENTS.md
  CHANGELOG.md
  CLAUDE.md
  CONTEXT.md
  LICENSE
  README.md
  package-lock.json
  package.json
  .agents/
    invocation.md
    writing-docs.md
    adr/
      0001-explicit-setup-pointer-only-for-hard-dependencies.md
      0002-ship-as-a-claude-code-plugin.md
  .claude-plugin/
    marketplace.json
    plugin.json
  .out-of-scope/
    mainstream-issue-trackers-only.md
    question-limits.md
    setup-skill-verify-mode.md
  docs/
    engineering/
      ask-matt.md
      code-review.md
      codebase-design.md
      diagnosing-bugs.md
      domain-modeling.md
      grill-with-docs.md
      implement.md
      improve-codebase-architecture.md
      prototype.md
      research.md
      resolving-merge-conflicts.md
      setup-matt-pocock-skills.md
      tdd.md
      to-spec.md
      to-tickets.md
      triage.md
      wayfinder.md
    productivity/
      grill-me.md
      grilling.md
      handoff.md
      teach.md
      writing-great-skills.md
  scripts/
    link-skills.sh
    list-skills.sh
  skills/
    deprecated/
      README.md
      design-an-interface/
        SKILL.md
        agents/
          openai.yaml
      qa/
        SKILL.md
        agents/
          openai.yaml
      request-refactor-plan/
        SKILL.md
        agents/
          openai.yaml
      ubiquitous-language/
        SKILL.md
        agents/
          openai.yaml
    engineering/
      README.md
      ask-matt/
        SKILL.md
        agents/
          openai.yaml
      code-review/
        SKILL.md
        agents/
          openai.yaml
      codebase-design/
        DEEPENING.md
        DESIGN-IT-TWICE.md
        SKILL.md
        agents/
          openai.yaml
      diagnosing-bugs/
        SKILL.md
        agents/
          openai.yaml
        scripts/
          hitl-loop.template.sh
      domain-modeling/
        ADR-FORMAT.md
        CONTEXT-FORMAT.md
        SKILL.md
        agents/
          openai.yaml
      grill-with-docs/
        SKILL.md
        agents/
   
```

## Agent Configuration
### AGENTS.md
CLAUDE.md

### CLAUDE.md
Skills are organized into bucket folders under `skills/`:

- `engineering/` — daily code work
- `productivity/` — daily non-code workflow tools
- `misc/` — kept around but rarely used, not promoted
- `personal/` — tied to my own setup, not promoted
- `in-progress/` — drafts not yet ready to ship
- `deprecated/` — no longer used

Every skill in `engineering/` or `productivity/` (the **promoted** buckets) must have a reference in the top-level `README.md` and an entry in `.claude-plugin/plugin.json`'s `skills` array (the Claude Code plugin ships exactly the promoted set). Skills in `misc/`, `personal/`, `in-progress/`, and `deprecated/` must not appear in either.

The repo is also its own single-plugin Claude Code marketplace: `.claude-plugin/marketplace.json` lists the one `mattpocock-skills` plugin. When bumping the release version, keep `.claude-plugin/plugin.json`'s `version` in sync with `package.json`'s — Claude uses the plugin `version` to decide when installed users see an update. Run `claude plugin validate . --strict` after touching either manifest. Why a Claude plugin but not (yet) a Codex one lives in [.agents/adr/0002-ship-as-a-claude-code-plugin.md](./.agents/adr/0002-ship-as-a-claude-code-plugin.md).

Each skill entry in the top-level `README.md` must link the skill name to its `SKILL.md`.

Each bucket folder has a `README.md` that lists every skill in the bucket with a one-line description, with the skill name linked to its `SKILL.md`. The promoted buckets' `REA

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `reference` · **Fit:** 22/100 · **Auto-apply:** False
- **Evidence:** `agent`
- **All scores:** {'seosona-os': 22, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
