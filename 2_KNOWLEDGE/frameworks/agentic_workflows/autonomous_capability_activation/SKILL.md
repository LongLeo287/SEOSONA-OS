---
name: autonomous_capability_activation
description: Mandatory SEOSONA preflight for non-trivial tasks. Forces agents to activate available Knowledge Items, context engine blocks, intent router matches, capability bridge routes, knowledge graph routes, personas, skills, workflows, and validation gates before execution.
---

# Autonomous Capability Activation

Use this skill at the start of every non-trivial SEOSONA OS task, especially audits, reviews, fixes, ingestion, project work, issue creation, tests, and git publication. Its purpose is to prevent agents from working manually from memory while ignoring existing system capabilities.

## Required Gate

Run the autonomous activation gate before planning or editing:

```bash
python 1_CORE/scripts/autonomous_activation_gate.py --task "<user task>"
```

For machine-readable output:

```bash
python 1_CORE/scripts/autonomous_activation_gate.py --task "<user task>" --json
```

The gate must assemble:

- relevant Knowledge Items from `3_MEMORY/knowledge_items/`
- dynamic context blocks through `context_engine.py`
- intent-router skill matches through `intent_router.py`
- capability bridge routes through `seosona_capability_bridge.js`
- knowledge-graph routes through `knowledge_graph.py`
- audit execution waves through `task_planner.py` when the task is an audit, review, scan, or test

## Execution Contract

1. Read the top Knowledge Items before new research.
2. Use the context engine result to determine task type and domain tags.
3. Treat capability bridge matches as the cross-runtime source of truth.
4. Treat intent-router and knowledge-graph matches as semantic expansion.
5. Activate recommended personas when their domain matches the task.
6. Load required skill/workflow files before implementing their procedures.
7. Run the nearest validation gate before commit or handoff.
8. Persist durable learnings as KI/raw data/skill/workflow only when reusable.

## Automation Rules

- Do not rely on a human remembering slash commands.
- Do not start from blank generic reasoning when the router has relevant skills.
- Do not skip KIs because the current chat already "feels familiar".
- Do not commit runtime logs, local paths, credentials, clone folders, or personal data.
- Rebuild `SKILLS_ROUTER.md` and the knowledge graph after adding or modifying skills.
- Use `npm run autonomy:intake -- --task "<task>"` when npm scripts are available.

## Minimum Validation

After changes to SEOSONA capability surfaces, run:

```bash
npm run lint
npm run capabilities:validate
npm run capabilities:audit
npm run status:all
git diff --check
```

For publication:

```bash
npm run git:push-check
```

## Issue Policy

Create a GitHub issue when an audit finds a real follow-up that should remain externally trackable and cannot be safely completed in the current pass. The issue must include:

- current evidence
- affected files or commands
- risk
- proposed acceptance criteria
- validation gate

Do not create issues for work already completed in the same commit.
