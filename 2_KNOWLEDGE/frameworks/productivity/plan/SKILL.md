---
name: ck:plan
description: 💡💡💡 Intelligent plan creation with prompt enhancement
argument-hint: "[archive|ci|cro|fast|hard|parallel|two|validate] [task]"
metadata:
  author: claudekit
  version: "1.0.0"
---

## Your mission
<task>
$ARGUMENTS
</task>

## Pre-Creation Check (Active vs Suggested Plan Detection)

Check the `## Plan Context` section in the injected context:
- If "Plan:" shows a path → Active plan exists. Ask user: "Active plan found: {path}. Continue with this? [Y/n]"
- If "Suggested:" shows a path → Branch-matched plan hint only. Ask user if they want to activate it or create new.
- If "Plan: none" → Proceed to create new plan using naming pattern from `## Naming` section.

## Workflow
- Analyze the given task and use `AskUserQuestion` tool to ask for more details if needed.
- Decide to use `/plan:fast` or `/plan:hard` SlashCommands based on the complexity.
- Execute SlashCommand: `/plan:fast <detailed-instructions-prompt>` or `/plan:hard <detailed-instructions-prompt>`
- Activate `planning` skill.
- Note: `detailed-instructions-prompt` is **an enhanced prompt** that describes the task in detail based on the provided task description.

## Important Notes
**IMPORTANT:** Analyze the skills catalog and activate the skills that are needed for the task during the process.
**IMPORTANT:** Sacrifice grammar for the sake of concision when writing reports.
**IMPORTANT:** Ensure token efficiency while maintaining high quality.
**IMPORTANT:** In reports, list any unresolved questions at the end, if any.
**IMPORTANT**: **Do not** start implementing.

## Subcommands

| Subcommand | Description | Reference |
|------------|-------------|-----------|
| `archive` | Write journal entries and archive specific plans or all plans | `references/archive.md` |
| `ci` | Analyze Github Actions logs and provide a plan to fix the issues | `references/ci.md` |
| `cro` | Create a CRO plan for the given content | `references/cro.md` |
| `fast` | 💡💡 No research. Only analyze and create an implementation plan | `references/fast.md` |
| `hard` | 💡💡💡 Research, analyze, and create an implementation plan | `references/hard.md` |
| `parallel` | 💡💡💡 Create detailed plan with parallel-executable phases | `references/parallel.md` |
| `two` | 💡💡💡💡 Research & create an implementation plan with 2 approaches | `references/two.md` |
| `validate` | Validate plan with critical questions interview | `references/validate.md` |

## Routing

1. Parse subcommand from `$ARGUMENTS` (first word)
2. Load corresponding `references/{subcommand}.md`
3. Execute with remaining arguments