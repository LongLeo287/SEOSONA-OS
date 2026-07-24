# KI: Piebald-AI/claude-code-system-prompts

## Overview
Repository with 533 files across 3 directories. Primary language: JavaScript (1 files).

## Tech Stack (from code)
- JavaScript (1 files)
- **Total:** 533 files, 3 directories
- **File types:** .md: 530, .gitignore: 1, .js: 1

## File Structure
```
  .gitignore
  CHANGELOG.md
  CLAUDE.md
  LICENSE
  README.md
  system-prompts/
    agent-prompt-agent-creation-architect.md
    agent-prompt-agent-hook.md
    agent-prompt-auto-mode-rule-reviewer.md
    agent-prompt-away-summary-generation.md
    agent-prompt-background-agent-state-classifier.md
    agent-prompt-background-job-agent-instructions.md
    agent-prompt-bash-command-description-writer.md
    agent-prompt-bash-command-prefix-detection.md
    agent-prompt-batch-slash-command.md
    agent-prompt-claude-code-guide.md
    agent-prompt-claude-guide-agent.md
    agent-prompt-claudemd-creation.md
    agent-prompt-code-review-part-1-base-finder-angles.md
    agent-prompt-code-review-part-2-low-effort-mode.md
    agent-prompt-code-review-part-3-extra-high-and-maximum-effort-modes.md
    agent-prompt-code-review-part-4-three-state-verification-phase.md
    agent-prompt-code-review-part-5-recall-biased-verification-phase.md
    agent-prompt-code-review-part-6-medium-effort-mode.md
    agent-prompt-code-review-part-7-high-effort-mode.md
    agent-prompt-code-review-part-8-github-comment-posting.md
    agent-prompt-code-review-part-9-fix-application.md
    agent-prompt-coding-session-title-generator.md
    agent-prompt-conversation-summarization.md
    agent-prompt-determine-which-memory-files-to-attach.md
    agent-prompt-dream-memory-consolidation.md
    agent-prompt-dream-memory-pruning.md
    agent-prompt-explore.md
    agent-prompt-general-purpose-agent.md
    agent-prompt-general-purpose.md
    agent-prompt-general-task-agent.md
    agent-prompt-hook-condition-evaluator-stop.md
    agent-prompt-hook-condition-evaluator.md
    agent-prompt-inherited-context-for-worktree-sub-agent.md
    agent-prompt-managed-agents-onboarding-flow.md
    agent-prompt-memory-synthesis.md
    agent-prompt-onboarding-guide-draft-share-link-workflow.md
    agent-prompt-onboarding-guide-generator.md
    agent-prompt-plan-mode-enhanced.md
    agent-prompt-pr-follow-up-cron.md
    agent
```

## Agent Configuration
### CLAUDE.md
# Claude Code System Prompts

## What this repository is

System prompts extracted via script from the Claude Code npm package's compiled JavaScript source. Maintained by [Piebald AI](https://piebald.ai/), not by Anthropic.

See the [Extraction section in README.md](./README.md#extraction) for details on the extraction method.

## What Claude Code is

Claude Code is Anthropic's CLI tool for agentic coding. It is distributed as a compiled npm package (`@anthropic-ai/claude-code`). Source code is not publicly available. The [anthropics/claude-code](https://github.com/anthropics/claude-code) GitHub repository contains issues and releases only.

## How to use these files

- **Reference:** Understand what prompts Claude Code uses and how they change across versions
- **Local patching:** Use [tweakcc](https://github.com/Piebald-AI/tweakcc) to customize individual prompt pieces in your local Claude Code installation
- **Feature requests:** For changes to Claude Code's prompts, file issues at [anthropics/claude-code/issues](https://github.com/anthropics/claude-code/issues)

## For AI agents working with this repository

- These files are **extracted reference material**, not modifiable source code
- Editing files here does not change Claude Code's behavior
- The `system-prompts/` directory contains markdown files with YAML frontmatter noting the Claude Code version and template variables
- Template variables like `${BASH_TOOL_NAME}` are interpolated at runtime by Claude Code — they a

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.
