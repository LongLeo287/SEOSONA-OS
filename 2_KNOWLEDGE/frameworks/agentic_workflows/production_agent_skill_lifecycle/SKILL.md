---
name: production_agent_skill_lifecycle
description: Guides agents through designing, reviewing, and maintaining production-grade agent skills with trigger-focused frontmatter, behavioral workflows, anti-rationalization, and evidence gates. Use when creating or upgrading SEOSONA skills, importing external skill packs, or auditing whether a skill changes agent behavior under pressure.
---

# Production Agent Skill Lifecycle

## Overview

Use this skill when a SEOSONA capability should become a reusable agent skill rather than a one-off note. The goal is to encode a repeatable workflow that agents can discover, execute, verify, and improve.

## When To Use

- Creating a new skill from external research.
- Refactoring a vague knowledge note into an operational workflow.
- Auditing a skill that reads like documentation but does not change behavior.
- Importing skill packs from another agent ecosystem.

Do not use this for simple static reference notes. Use `2_KNOWLEDGE/raw_data/` for passive knowledge that has no repeatable workflow.

## Workflow

1. Define the behavioral trigger.
   - The frontmatter description must say what the skill does and when to use it.
   - Avoid process summaries in the description; the agent must still read the full skill.

2. Write the operating loop.
   - Use phases or numbered steps.
   - Make every step observable.
   - Name stop conditions and handoff boundaries.

3. Add anti-rationalization.
   - List excuses that agents use to skip work.
   - Pair each excuse with the operational reason it is unsafe.

4. Add red flags.
   - Describe visible signs of drift, such as skipping verification, inventing source facts, or expanding scope without a plan update.

5. Add verification.
   - Require command output, source links, screenshots, tests, or generated artifacts.
   - "Looks good" is not evidence.

6. Keep progressive disclosure.
   - Keep `SKILL.md` focused.
   - Move long reference material into `references/`.
   - Add scripts only when they are actually run by the workflow.

7. Register and validate.
   - Rebuild the capability graph/router after adding skills.
   - Run the smallest relevant validation gate.

## Skill Anatomy

Required:

- `SKILL.md`
- YAML frontmatter with `name` and `description`
- A clear workflow and verification section

Recommended:

- `When To Use`
- `Workflow`
- `Common Rationalizations`
- `Red Flags`
- `Verification`
- `References`

Optional:

- `references/` for long checklists or examples
- `scripts/` for repeatable helper commands
- `templates/` for generated artifacts

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "This is obvious; the skill can be short." | Obvious steps are the first steps agents skip under pressure. |
| "The README explains it." | A README informs; a skill changes execution behavior. |
| "Verification can be done later." | A skill without exit evidence is a suggestion, not an operating contract. |
| "More context is always better." | Overloaded skills reduce discoverability and increase drift. |

## Red Flags

- The description says only a topic, not a trigger.
- The body is mostly background prose.
- There is no exit checklist.
- The workflow asks the user for permission when local context can answer safely.
- The skill duplicates another skill instead of referencing it.

## Verification

After creating or upgrading a skill, confirm:

- [ ] The description includes both what and when.
- [ ] The workflow has concrete steps.
- [ ] The skill has evidence-based verification.
- [ ] No absolute local paths were written.
- [ ] Capability validation or router rebuild was run.
