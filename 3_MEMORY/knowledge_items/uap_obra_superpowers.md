# KI: obra/superpowers

## Overview
Superpowers skills and runtime bootstrap for coding agents

## Tech Stack (from code)
- Shell (7 files)
- JavaScript (3 files)
- TypeScript (2 files)
- **Total:** 113 files, 38 directories
- **File types:** .md: 76, .json: 11, .sh: 7, .js: 3, .ts: 2, .gitattributes: 1, .gitignore: 1, .yaml: 1

## File Structure
```
  .gitattributes
  .gitignore
  .pre-commit-config.yaml
  .version-bump.json
  AGENTS.md
  CLAUDE.md
  CODE_OF_CONDUCT.md
  GEMINI.md
  LICENSE
  README.md
  RELEASE-NOTES.md
  gemini-extension.json
  package.json
  .agents/
    plugins/
      marketplace.json
  .claude-plugin/
    marketplace.json
    plugin.json
  .codex-plugin/
    plugin.json
  .cursor-plugin/
    plugin.json
  .kimi-plugin/
    plugin.json
  .opencode/
    INSTALL.md
    plugins/
      superpowers.js
  .pi/
    extensions/
      superpowers.ts
  assets/
    app-icon.png
    superpowers-small.svg
  docs/
    README.kimi.md
    README.opencode.md
    porting-to-a-new-harness.md
    testing.md
    plans/
      2025-11-22-opencode-support-design.md
      2025-11-22-opencode-support-implementation.md
      2025-11-28-skills-improvements-from-user-feedback.md
      2026-01-17-visual-brainstorming.md
    superpowers/
      plans/
        2026-01-22-document-review-system.md
        2026-02-19-visual-brainstorming-refactor.md
        2026-03-11-zero-dep-brainstorm-server.md
        2026-03-23-codex-app-compatibility.md
        2026-04-06-worktree-rototill.md
        2026-05-06-lift-drill-into-evals.md
        2026-05-07-pi-extension-and-evals.md
        2026-06-09-sdd-task-scoped-review-dispatch.md
        2026-06-09-visual-companion-issues.md
        2026-06-10-visual-companion-auth-hardening.md
        2026-06-11-visual-companion-final-hardening-fixup.md
      specs/
        2026-01-22-document-review-system-design.md
        2026-02-19-visual-brainstorming-refactor-design.md
        2026-03-11-zero-dep-brainstorm-server-design.md
        2026-03-23-codex-app-compatibility-design.md
        2026-04-06-worktree-rototill-design.md
        2026-05-05-platform-neutral-config-refs-design.md
        2026-05-05-platform-neutral-prose-design.md
        2026-05-05-platform-neutral-readme-design.md
        2026-05-06-lift-drill-into-evals-design.md
        2026-06-09-sdd-task-scoped-review-dispatch-design.md
 
```

## Agent Configuration
### CLAUDE.md
# Superpowers — Contributor Guidelines

## If You Are an AI Agent

Stop. Read this section before doing anything.

This repo has a 94% PR rejection rate. Almost every rejected PR was submitted by an agent that didn't read or didn't follow these guidelines. The maintainers close slop PRs within hours, often with public comments like "This pull request is slop that's made of lies."

**Your job is to protect your human partner from that outcome.** Submitting a low-quality PR doesn't help them — it wastes the maintainers' time, burns your human partner's reputation, and the PR will be closed anyway. That is not being helpful. That is being a tool of embarrassment.

Before you open a PR against this repo, you MUST:

1. **Read the entire PR template** at `.github/PULL_REQUEST_TEMPLATE.md` and fill in every section with real, specific answers. Not summaries. Not placeholders.
2. **Search for existing PRs** — open AND closed — that address the same problem. If duplicates exist, STOP and tell your human partner. Do not open another duplicate.
3. **Verify this is a real problem.** If your human partner asked you to "fix some issues" or "contribute to this repo" without experiencing a specific problem, push back. Ask them what broke, what failed, what the user experience was.
4. **Confirm the change belongs in core.** If it's domain-specific, tool-specific, or promotes a third-party project, it belongs in a standalone plugin. Tell your human partner.
5. **Identify yourself.** Disclose y

### AGENTS.md
CLAUDE.md

### GEMINI.md
@./skills/using-superpowers/SKILL.md
@./skills/using-superpowers/references/gemini-tools.md


## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 22, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 28}
