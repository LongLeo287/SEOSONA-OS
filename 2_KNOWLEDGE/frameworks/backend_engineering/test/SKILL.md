---
name: ck:test
description: Test ClaudeKit workflows, run UI tests on websites, validate marketing commands/agents/skills with step-by-step verification.
argument-hint: "[ui|workflow] [target]"
metadata:
  author: claudekit
  version: "1.0.0"
---

# Test

UI testing and workflow validation for ClaudeKit marketing components.

<args>$ARGUMENTS</args>

## When to Use

- UI tests on websites (visual, accessibility, responsive)
- Workflow validation (command/agent/skill testing)
- Component scanning and test scenario generation
- Step-by-step manual verification

## Subcommands

| Subcommand | Description | Reference |
|------------|-------------|-----------|
| `ui` | Run UI tests on a website & generate report | `references/ui.md` |
| `workflow` | Run workflow tests with step-by-step verification | `references/workflow.md` |

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/scan-components.py` | Scan commands/agents/skills and generate test scenarios |

## Routing

1. Parse subcommand from `$ARGUMENTS` (first word)
2. Load corresponding `references/{subcommand}.md`
3. Execute with remaining arguments
