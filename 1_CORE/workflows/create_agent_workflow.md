// seosona-ignore-lang
﻿# Agent Creation Workflow

This is the Standard Operating Procedure (SOP) for initializing a new Agent/Persona within the SEOSONA System.
This workflow is optimized from SEOSONA OS's *OS Standard Department Node* architecture, ensuring it remains lean (to prevent system clutter) while maintaining strict security boundaries and clear access controls.

## When to Create a New Agent?
- When the system ingests a repository representing an entirely new business domain (e.g., Marketing, Legal, DevOps).
- When the user requires the system to adopt a specialized, independent expert persona to manage a long-term sequence of tasks.

## The Lean Agent Persona Structure
Each new Agent will be initialized as a sub-directory inside `1_CORE/agents/`.
A standard Agent requires only 2 core files to operate, drastically minimizing system bloat:

```text
1_CORE/agents/<agent_name>/
â”œâ”€â”€ AGENT_PROFILE.md   (Identity, Access Control & Objectives)
â””â”€â”€ rules.md           (Disciplinary Matrix & Safety Bounds)
```

### 1. `AGENT_PROFILE.md` (Replaces Department & Manager/Worker Prompts)
This is the central file defining the Agent's "Soul".
**Required Sections:**
- **Identity**: The Name, Role, and Tone of the Agent.
- **Objectives**: The core goals this Agent is responsible for achieving.
- **Roster / Capabilities**: A list of `Skills` or `Workflows` this Agent is authorized to invoke (Pulled from `2_KNOWLEDGE/skills/`).
- **Execution Pipeline**: The standard protocol for how this Agent receives tasks and delivers outputs.

### 2. `rules.md` (Disciplinary Matrix)
This file dictates absolute safety limits.
**Required Sections:**
- **Enumerated Rules**: Explicitly listed rules (e.g., `RULE DEV-01: Never delete source files without taking a backup`).
- **Boundaries**: Which directories in the system is this Agent authorized to access? Which directories are strictly off-limits (no-go zones)?

## The 4-Step Spawning Process

1.  **Domain Analysis**: Clearly identify the Agent's business domain to name the directory appropriately (e.g., `seo_auditor`, `frontend_designer`).
2.  **Directory Initialization**: Create the folder at `1_CORE/agents/<agent_name>`.
3.  **Profile & Rules Drafting**: Generate the content for `AGENT_PROFILE.md` and `rules.md` conforming to the standard structures above.
4.  **System Registration**: Register the new Agent into the `1_CORE/SOUL.md` (or `SKILLS_ROUTER.md`) file so the Orchestrator can recognize and activate the Agent when needed.

---
*Note: Do not generate complex management files (like activation statuses or daemons) unless specifically requested by the User, in order to strictly adhere to the "do not create too much system clutter" philosophy.*

