# Ingested Knowledge: productflow

Source: https://github.com/yuqie6/ProductFlow
Ingestion Date: 2026-06-23T09:14:05.859Z



--- FILE: .agents\skills\trellis-before-dev\SKILL.md ---

---
name: trellis-before-dev
description: "Discovers and injects project-specific coding guidelines from .trellis/spec/ before implementation begins. Reads spec indexes, pre-development checklists, and shared thinking guides for the target package. Use when starting a new coding task, before writing any code, switching to a different package, or needing to refresh project conventions and standards."
---

Read the relevant development guidelines before starting your task.

Execute these steps:

1. **Read current task artifacts**:
   - `prd.md` for requirements and acceptance criteria
   - `design.md` if present for technical design
   - `implement.md` if present for execution order and validation plan

2. **Discover packages and their spec layers**:
   ```bash
   python3 ./.trellis/scripts/get_context.py --mode packages
   ```

3. **Identify which specs apply** to your task based on:
   - Which package you're modifying (e.g., `cli/`, `docs-site/`)
   - What type of work (backend, frontend, unit-test, docs, etc.)
   - Any spec/research paths referenced by the task artifacts

4. **Read the spec index** for each relevant module:
   ```bash
   cat .trellis/spec/<package>/<layer>/index.md
   ```
   Follow the **"Pre-Development Checklist"** section in the index.

5. **Read the specific guideline files** listed in the Pre-Development Checklist that are relevant to your task. The index is NOT the goal — it points you to the actual guideline files (e.g., `error-handling.md`, `conventions.md`, `mock-strategies.md`). Read those files to understand the coding standards and patterns.

6. **Always read shared guides**:
   ```bash
   cat .trellis/spec/guides/index.md
   ```

7. Understand the coding standards and patterns you need to follow, then proceed with your development plan.

This step is **mandatory** before writing any code.


--- FILE: .agents\skills\trellis-brainstorm\SKILL.md ---

---
name: trellis-brainstorm
description: "Guides collaborative requirements discovery before implementation. Creates task directory, seeds PRD, asks high-value questions one at a time, researches technical choices, and converges on MVP scope. Use when requirements are unclear, there are multiple valid approaches, or the user describes a new feature or complex task."
---

# Trellis Brainstorm

## Non-Negotiable Interview Contract

Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time.

## Non-Negotiable Evidence Rule

If a question can be answered by exploring the codebase, explore the codebase instead.

This is mandatory. Before asking the user a question, first check whether the answer is already available in code, tests, configs, docs, existing specs, or task history.

Do not ask the user to confirm facts that the repository can answer. Ask only for product intent, preference, scope, risk tolerance, or decisions that remain ambiguous after inspection.

---

Use this skill during Phase 1 planning to turn the user's request into clear requirements and planning artifacts.

## Preconditions

Use this skill only after task-creation consent has been given and the user is ready to enter Trellis planning.

If no task exists yet, create one:

```bash
TASK_DIR=$(python3 ./.trellis/scripts/task.py create "<short task title>" --slug <slug>)
```

Use a concise title from the user's request. Use a slug without a date prefix. `task.py create` adds the `MM-DD-` directory prefix automatically.

`task.py create` creates the default `prd.md`. Update that file with the current understanding before asking follow-up questions.

## Planning Flow

1. Capture the user's request and initial known facts in `prd.md`.
2. Inspect available evidence before asking questions:
   - code, tests, fixtures, and configs
   - README files, docs, existing specs, and domain notes
   - related Trellis tasks, research files, and session history when present
3. Separate what you found into:
   - confirmed facts
   - product intent still needed from the user
   - scope or risk decisions still needed from the user
   - likely out-of-scope items
4. Ask the single highest-value remaining question.
5. Include your recommended answer with the question.
6. After each user answer, update `prd.md` before continuing.
7. For complex tasks, create or update `design.md` and `implement.md` before implementation starts.

Do not invent a project-specific product/spec hierarchy. If the repository already has product, domain, or spec docs, use them. If it does not, proceed with the evidence that exists.

## Question Rules

Ask only one question per message.

Each question must include:

- the decision needed
- why the answer matters
- your recommended answer
- the trade-off if the user chooses differently

Do not ask process questions such as whether to search, inspect files, or continue brainstorming. Do the evidence work directly. Ask the user only when the remaining issue is a product decision, preference, scope boundary, or risk tolerance choice.

## Artifact Rules

`prd.md` records requirements and acceptance:

- goal and user value
- confirmed facts
- requirements
- acceptance criteria
- out of scope
- open questions that still block planning

`design.md` records technical design for complex tasks:

- architecture and boundaries
- data flow and contracts
- compatibility and migration notes
- important trade-offs
- operational or rollback considerations

`implement.md` records execution planning for complex tasks:

- ordered implementation checklist
- validation commands
- risky files or rollback points
- follow-up checks before `task.py start`

Lightweight tasks may have only `prd.md`. Complex tasks must have `prd.md`, `design.md`, and `implement.md` before `task.py start`.

`implement.md` is not a replacement for `implement.jsonl`. Use JSONL files only for manifest-style spec and research references when the task needs them.

## Quality Bar

Before declaring planning ready:

- `prd.md` contains testable acceptance criteria.
- Repository-answerable questions have already been answered through inspection.
- Remaining open questions are genuinely about user intent or scope.
- Complex tasks have `design.md` and `implement.md`.
- The user has reviewed the final planning artifacts or explicitly approved proceeding.

Do not start implementation until the user approves or asks for implementation.


--- FILE: .agents\skills\trellis-break-loop\SKILL.md ---

---
name: trellis-break-loop
description: "Deep bug analysis to break the fix-forget-repeat cycle. Analyzes root cause category, why fixes failed, prevention mechanisms, and captures knowledge into specs. Use after fixing a bug to prevent the same class of bugs."
---

# Break the Loop - Deep Bug Analysis

When debug is complete, use this for deep analysis to break the "fix bug -> forget -> repeat" cycle.

---

## Analysis Framework

Analyze the bug you just fixed from these 5 dimensions:

### 1. Root Cause Category

Which category does this bug belong to?

| Category | Characteristics | Example |
|----------|-----------------|---------|
| **A. Missing Spec** | No documentation on how to do it | New feature without checklist |
| **B. Cross-Layer Contract** | Interface between layers unclear | API returns different format than expected |
| **C. Change Propagation Failure** | Changed one place, missed others | Changed function signature, missed call sites |
| **D. Test Coverage Gap** | Unit test passes, integration fails | Works alone, breaks when combined |
| **E. Implicit Assumption** | Code relies on undocumented assumption | Timestamp seconds vs milliseconds |

### 2. Why Fixes Failed (if applicable)

If you tried multiple fixes before succeeding, analyze each failure:

- **Surface Fix**: Fixed symptom, not root cause
- **Incomplete Scope**: Found root cause, didn't cover all cases
- **Tool Limitation**: grep missed it, type check wasn't strict
- **Mental Model**: Kept looking in same layer, didn't think cross-layer

### 3. Prevention Mechanisms

What mechanisms would prevent this from happening again?

| Type | Description | Example |
|------|-------------|---------|
| **Documentation** | Write it down so people know | Update thinking guide |
| **Architecture** | Make the error impossible structurally | Type-safe wrappers |
| **Compile-time** | Strict type checking, no escape hatches | Signature change causes compile error |
| **Runtime** | Monitoring, alerts, scans | Detect orphan entities |
| **Test Coverage** | E2E tests, integration tests | Verify full flow |
| **Code Review** | Checklist, PR template | "Did you check X?" |

### 4. Systematic Expansion

What broader problems does this bug reveal?

- **Similar Issues**: Where else might this problem exist?
- **Design Flaw**: Is there a fundamental architecture issue?
- **Process Flaw**: Is there a development process improvement?
- **Knowledge Gap**: Is the team missing some understanding?

### 5. Knowledge Capture

Solidify insights into the system:

- [ ] Update `.trellis/spec/guides/` thinking guides
- [ ] Update relevant `.trellis/spec/` docs
- [ ] Create issue record (if applicable)
- [ ] Create feature ticket for root fix
- [ ] Update check guidelines if needed

---

## Output Format

Please output analysis in this format:

```markdown
## Bug Analysis: [Short Description]

### 1. Root Cause Category
- **Category**: [A/B/C/D/E] - [Category Name]
- **Specific Cause**: [Detailed description]

### 2. Why Fixes Failed (if applicable)
1. [First attempt]: [Why it failed]
2. [Second attempt]: [Why it failed]
...

### 3. Prevention Mechanisms
| Priority | Mechanism | Specific Action | Status |
|----------|-----------|-----------------|--------|
| P0 | ... | ... | TODO/DONE |

### 4. Systematic Expansion
- **Similar Issues**: [List places with similar problems]
- **Design Improvement**: [Architecture-level suggestions]
- **Process Improvement**: [Development process suggestions]

### 5. Knowledge Capture
- [ ] [Documents to update / tickets to create]
```

---

## Core Philosophy

> **The value of debugging is not in fixing the bug, but in making this class of bugs never happen again.**

Three levels of insight:
1. **Tactical**: How to fix THIS bug
2. **Strategic**: How to prevent THIS CLASS of bugs
3. **Philosophical**: How to expand thinking patterns

30 minutes of analysis saves 30 hours of future debugging.

---

## After Analysis: Immediate Actions

**IMPORTANT**: After completing the analysis above, you MUST immediately:

1. **Update spec/guides** - Don't just list TODOs, actually update the relevant files:
   - If it's a cross-platform issue → update `cross-platform-thinking-guide.md`
   - If it's a cross-layer issue → update `cross-layer-thinking-guide.md`
   - If it's a code reuse issue → update `code-reuse-thinking-guide.md`
   - If it's domain-specific → update `backend/*.md` or `frontend/*.md`

2. **Sync templates** - After updating `.trellis/spec/`, sync to `src/templates/markdown/spec/`

3. **Commit the spec updates** - This is the primary output, not just the analysis text

> **The analysis is worthless if it stays in chat. The value is in the updated specs.**


--- FILE: .agents\skills\trellis-check\SKILL.md ---

---
name: trellis-check
description: "Comprehensive quality verification: spec compliance, lint, type-check, tests, cross-layer data flow, code reuse, and consistency checks. Use when code is written and needs quality verification, before committing changes, or to catch context drift during long sessions."
---

# Code Quality Check

Comprehensive quality verification for recently written code. Combines spec compliance, cross-layer safety, and pre-commit checks.

---

## Step 1: Identify What Changed

```bash
git diff --name-only HEAD
git status
```

## Step 2: Read Task Artifacts and Applicable Specs

Read the current task artifacts in order:

- `prd.md`
- `design.md` if present
- `implement.md` if present

```bash
python3 ./.trellis/scripts/get_context.py --mode packages
```

For each changed package/layer, read the spec index and follow its **Quality Check** section:

```bash
cat .trellis/spec/<package>/<layer>/index.md
```

Read the specific guideline files referenced — the index is a pointer, not the goal.

## Step 3: Run Project Checks

Run the project's lint, type-check, and test commands. Fix any failures before proceeding.

## Step 4: Review Against Checklist

### Code Quality

- [ ] Linter passes?
- [ ] Type checker passes (if applicable)?
- [ ] Tests pass?
- [ ] No debug logging left in?
- [ ] No suppressed warnings or type-safety bypasses?

### Test Coverage

- [ ] New function → unit test added?
- [ ] Bug fix → regression test added?
- [ ] Changed behavior → existing tests updated?

### Spec Sync

- [ ] Does `.trellis/spec/` need updates? (new patterns, conventions, lessons learned)

> "If I fixed a bug or discovered something non-obvious, should I document it so future me won't hit the same issue?" → If YES, update the relevant spec doc.

## Step 5: Cross-Layer Dimensions (if applicable)

Skip this step if your change is confined to a single layer.

### A. Data Flow (changes touch 3+ layers)

- [ ] Read flow traces correctly: Storage → Service → API → UI
- [ ] Write flow traces correctly: UI → API → Service → Storage
- [ ] Types/schemas correctly passed between layers?
- [ ] Errors properly propagated to caller?

### B. Code Reuse (modifying constants, creating utilities)

- [ ] Searched for existing similar code before creating new?
  ```bash
  grep -r "pattern" src/
  ```
- [ ] If 2+ places define same value → extracted to shared constant?
- [ ] After batch modification, all occurrences updated?

### C. Import/Dependency (creating new files)

- [ ] Correct import paths (relative vs absolute)?
- [ ] No circular dependencies?

### D. Same-Layer Consistency

- [ ] Other places using the same concept are consistent?

---

## Step 6: Report and Fix

Report violations found and fix them directly. Re-run project checks after fixes.


--- FILE: .agents\skills\trellis-continue\SKILL.md ---

---
name: trellis-continue
description: "Resume work on the current task. Loads the workflow Phase Index, figures out which phase/step to pick up at, then pulls the step-level detail via get_context.py --mode phase. Use when coming back to an in-progress task and you need to know what to do next."
---

# Continue Current Task

Resume work on the current task — pick up at the right phase/step in `.trellis/workflow.md`.

---

## Step 1: Load Current Context

```bash
python3 ./.trellis/scripts/get_context.py
```

Confirms: current task, git state, recent commits.

## Step 2: Load the Phase Index

```bash
python3 ./.trellis/scripts/get_context.py --mode phase
```

Shows the Phase Index (Plan / Execute / Finish) with routing + skill mapping.

## Step 3: Decide Where You Are

`get_context.py` shows the active task's `status` field. Route by `status` + artifact presence. This command replaces the user needing to remember the Trellis flow; it does not itself approve implementation.

- `status=planning` + no `prd.md` → **1.1** (load `trellis-brainstorm`)
- `status=planning` + `prd.md` only → decide whether the task is lightweight or complex. Lightweight can move to **1.4** review; complex returns to **1.1** to add `design.md` + `implement.md`.
- `status=planning` + complex artifacts complete + sub-agent jsonl not curated (only the seed `_example` row) → **1.3**
- `status=planning` + required artifacts complete + required jsonl curated or inline mode → **1.4** (ask for start review; only run `task.py start` after user confirms)
- `status=in_progress` + implementation not started → **2.1**
- `status=in_progress` + implementation done, not yet checked → **2.2**
- `status=in_progress` + check passed → **3.1**
- `status=completed` (rare; usually archived immediately) → archive flow

Phase rules (full detail in `.trellis/workflow.md`):

1. Run steps **in order** within a phase — `[required]` steps must not be skipped
2. `[once]` steps are already done if the required output exists. `prd.md` alone can be enough only for lightweight tasks; complex tasks also need `design.md` and `implement.md`.
3. You may go back to an earlier phase if discoveries require it

## Step 4: Load the Specific Step

Once you know which step to resume at:

```bash
python3 ./.trellis/scripts/get_context.py --mode phase --step <X.X> --platform codex
```

Follow the loaded instructions. After each `[required]` step completes, move to the next.

---

## Reference

Full workflow and detailed phase steps live in `.trellis/workflow.md`. This command is only an entry point — the canonical guidance is there.


--- FILE: .agents\skills\trellis-finish-work\SKILL.md ---

---
name: trellis-finish-work
description: "Wrap up the current session: verify quality gate passed, remind user to commit, archive completed tasks, and record session progress to the developer journal. Use when done coding and ready to end the session."
---

# Finish Work

Wrap up the current session: archive the active task (and any other completed-but-unarchived tasks the user wants to clean up) and record the session journal. Code commits are NOT done here — those happen in workflow Phase 3.4 before you invoke this command.

## Step 1: Survey current state

```bash
python3 ./.trellis/scripts/get_context.py --mode record
```

This prints:

- **My active tasks** — review whether any besides the current one are actually done (code merged, AC met) and should be archived this round.
- **Git status** — quick visual on what's dirty.
- **Recent commits** — you'll need their hashes in Step 4 for `--commit`.

If `--mode record` surfaces other completed tasks not tied to the current session, surface them to the user with a one-shot confirmation: "These N tasks look done — archive them too in this round? [y/N]". Default is no; the current active task is always archived in Step 3 regardless.

## Step 2: Sanity check — classify dirty paths

Run:

```bash
git status --porcelain
```

Filter out paths under `.trellis/workspace/` and `.trellis/tasks/` — those are managed by `add_session.py` and `task.py archive` auto-commits and will appear dirty as part of this skill's own work.

For each remaining dirty path, decide whether it belongs to **the current task** or to **other parallel work** (e.g., another terminal window editing the same repo). Heuristics:

- Paths referenced in the current task's `prd.md` / `implement.jsonl` / `check.jsonl` → current task
- Paths in code areas matching the task's stated scope, or that you remember editing this session → current task
- Paths in unrelated areas you have no recollection of touching this session → other parallel work

Then route:

- **Any remaining path looks like current-task work** — bail out with:
  > "Working tree has uncommitted code changes from this task: `<list>`. Return to workflow Phase 3.4 to commit them before running ``finish-work` (Trellis command)`."

  Do NOT run `git commit` here. Do NOT prompt the user to commit. The user goes back to Phase 3.4 and the AI drives the batched commit there.
- **All remaining paths look unrelated** (other parallel-window work) — report them once and continue to Step 3:
  > "FYI, dirty files outside this task's scope — leaving them for the other window: `<list>`."
- **Genuinely unsure** — ask the user once: "Are `<list>` this task's work I forgot to commit, or another window's? (commit / ignore)" — then route per their answer.

## Step 3: Archive task(s)

```bash
python3 ./.trellis/scripts/task.py archive <task-name>
```

At minimum: the current active task (if any). Plus any extra tasks the user confirmed in Step 1. Each archive produces a `chore(task): archive ...` commit via the script's auto-commit.

If there is no active task and the user did not confirm any cleanup archives, skip this step.

## Step 4: Record session journal

```bash
python3 ./.trellis/scripts/add_session.py \
  --title "Session Title" \
  --commit "hash1,hash2" \
  --summary "Brief summary"
```

Use the work-commit hashes produced in Phase 3.4 (visible in Step 1's `Recent commits` list, or via `git log --oneline`) for `--commit`. Do not include the archive commit hashes from Step 3. This produces a `chore: record journal` commit.

Final git log order: `<work commits from 3.4>` → `chore(task): archive ...` (one or more) → `chore: record journal`.


--- FILE: .agents\skills\trellis-meta\references\customize-local\add-project-local-conventions.md ---

# Add Project-Local Conventions

Often the user does not need to change Trellis mechanics; they need local AI to understand their team's conventions. In that case, prefer `.trellis/spec/` or a project-local skill instead of editing `trellis-meta`.

## Where To Put Things

| Content type | Location |
| --- | --- |
| Rules code must follow | `.trellis/spec/<layer>/` |
| Cross-layer thinking methods | `.trellis/spec/guides/` |
| AI capability for a project-specific flow | Platform-local skill |
| One-off task material | `.trellis/tasks/<task>/` |
| Session summary | `.trellis/workspace/<developer>/journal-N.md` |

## Create A Project-Local Skill

If the user wants AI to know "how this project customizes Trellis," create a local skill:

```text
.claude/skills/trellis-local/
└── SKILL.md
```

Example:

```md
---
name: trellis-local
description: "Project-local Trellis customizations for this repository. Use when changing this project's Trellis workflow, hooks, local agents, or team-specific conventions."
---

# Trellis Local

## Local Scope

This skill documents this repository's Trellis customizations only.

## Custom Workflow Rules

- ...

## Local Hook Changes

- ...

## Local Agent Changes

- ...
```

For multi-platform projects, place equivalent versions in other platform skill directories, or use `.agents/skills/` for platforms that support the shared layer.

## Write To `.trellis/spec/`

If the content is a coding convention, write it to spec. Examples:

```text
.trellis/spec/backend/error-handling.md
.trellis/spec/frontend/components.md
.trellis/spec/guides/cross-platform-thinking-guide.md
```

After writing it, update the corresponding `index.md` so AI can find the new rule from the entry point.

## Make The Current Task Use New Conventions

After writing a spec, add it to the current task context:

```bash
python3 ./.trellis/scripts/task.py add-context <task> implement ".trellis/spec/backend/error-handling.md" "Error handling conventions"
python3 ./.trellis/scripts/task.py add-context <task> check ".trellis/spec/backend/error-handling.md" "Review error handling"
```

## Do Not Store Project-Private Rules In `trellis-meta`

`trellis-meta` is a public skill for understanding Trellis architecture and local customization entry points. Put project-private content in:

- `.trellis/spec/`
- a project-local skill
- the current task
- workspace journal

This prevents future updates to Trellis's built-in `trellis-meta` from overwriting the team's own conventions.


--- FILE: .agents\skills\trellis-meta\references\customize-local\change-agents.md ---

# Change Local Agents

When the user wants to change `trellis-research`, `trellis-implement`, or `trellis-check` behavior, edit platform agent files in the user project.

## Read These Files First

1. Target platform agent directory
2. `.trellis/workflow.md` Phase 2 / research routing
3. Current task `prd.md`
4. Current task `implement.jsonl` / `check.jsonl`
5. Relevant hook or agent prelude

## Common Paths

| Platform | Path |
| --- | --- |
| Claude Code | `.claude/agents/trellis-*.md` |
| Cursor | `.cursor/agents/trellis-*.md` |
| OpenCode | `.opencode/agents/trellis-*.md` |
| Codex | `.codex/agents/trellis-*.toml` |
| Kiro | `.kiro/agents/trellis-*.json` |
| Gemini CLI | `.gemini/agents/trellis-*.md` |
| Qoder | `.qoder/agents/trellis-*.md` |
| CodeBuddy | `.codebuddy/agents/trellis-*.md` |
| Factory Droid | `.factory/droids/trellis-*.md` |
| Pi Agent | `.pi/agents/trellis-*.md` |

Use the actual paths in the user project as authoritative.

## Common Needs

| Need | Which agent to edit |
| --- | --- |
| Research must write files, not only reply in chat | `trellis-research` |
| Certain local specs must be read before implementation | `trellis-implement` + `implement.jsonl` configuration rules |
| Specific commands must run during checking | `trellis-check` |
| Agent must not modify certain directories | The corresponding agent's write boundary instructions |
| Agent output format must be fixed | The corresponding agent's final/reporting instructions |

## Modification Principles

1. **Preserve role boundaries**: research investigates and persists; implement writes implementation; check reviews and fixes.
2. **Do not hard-code project specs into agents**: long-term specs belong in `.trellis/spec/`; agents are responsible for reading them.
3. **Make read order explicit**: active task -> PRD -> info -> JSONL -> spec/research.
4. **Make write boundaries explicit**: which directories may be written and which may not.
5. **Synchronize across platforms**: when the user configured multiple platforms, decide whether to change only the current platform or all platform agents.

## Agent Pull Platforms

If an agent file contains a prelude for "read task/context after startup," do not remove those steps when editing. Otherwise the agent will work only from chat context and bypass Trellis's core mechanism.

## Hook Push Platforms

If context is injected by a hook, the agent file should still retain responsibility boundaries. Do not remove PRD/spec requirements from the agent just because a hook injects context.


--- FILE: .agents\skills\trellis-meta\references\customize-local\change-context-loading.md ---

# Change Local Context Loading

Context loading determines when AI reads workflow, task, spec, research, workspace, and git status. Read this page when the user says "AI does not know the current task," "the agent did not read specs," or "there is too much/too little context."

## Read These Files First

1. `.trellis/workflow.md`
2. `.trellis/scripts/get_context.py`
3. `.trellis/scripts/common/session_context.py`
4. `.trellis/scripts/common/task_context.py`
5. `.trellis/scripts/common/active_task.py`
6. Current platform hooks or agent files
7. The current task's `implement.jsonl` / `check.jsonl`

## Context Sources

| Source | Purpose |
| --- | --- |
| `.trellis/workflow.md` | Workflow and next-action hints. |
| `.trellis/tasks/<task>/prd.md` | Current task requirements. |
| `.trellis/tasks/<task>/design.md` | Complex task technical design. |
| `.trellis/tasks/<task>/implement.md` | Complex task execution plan. |
| `.trellis/tasks/<task>/implement.jsonl` | Spec/research to read before implementation. |
| `.trellis/tasks/<task>/check.jsonl` | Spec/research to read during checking. |
| `.trellis/spec/` | Project specs. |
| `.trellis/workspace/` | Session records. |
| git status | Current working tree changes. |

## Common Needs And Edit Points

| Need | Edit point |
| --- | --- |
| Inject more/less information in new sessions | `session_context.py` or the platform `session-start` hook. |
| Change hints on each user input | `[workflow-state:STATUS]` block in `.trellis/workflow.md`. The `inject-workflow-state` hook is parser-only and reads the block verbatim. |
| Agent did not read specs | Task JSONL, agent prelude, `inject-subagent-context` hook. |
| Active task is lost | `active_task.py` and platform session identity propagation. |
| Change JSONL validation rules | `task_context.py`. |

## JSONL Rules

`implement.jsonl` / `check.jsonl` are the key context loading interface:

```jsonl
{"file": ".trellis/spec/backend/index.md", "reason": "Backend conventions"}
{"file": ".trellis/tasks/04-28-x/research/api.md", "reason": "API research"}
```

Include only spec/research files. Do not put code files that will be modified into these manifests; agents read code files themselves during implementation.

## Change Session Context

If the user wants every new session to see more project state, edit:

- `.trellis/scripts/common/session_context.py`
- the corresponding platform `session-start` hook

Context cannot grow without bound. Prefer injecting indexes and paths so the AI can read detailed files on demand.

## Change Sub-Agent Context

First determine which mode the platform uses:

- hook push: edit the `inject-subagent-context` hook.
- agent pull: edit the read steps in the corresponding `trellis-implement` / `trellis-check` agent file.

In both modes, make sure the agent ultimately reads:

1. active task
2. the corresponding JSONL
3. spec/research referenced by the JSONL
4. `prd.md`
5. `design.md` if present
6. `implement.md` if present

## Troubleshooting Order

```bash
python3 ./.trellis/scripts/task.py current --source
python3 ./.trellis/scripts/task.py list-context <task>
python3 ./.trellis/scripts/task.py validate <task>
python3 ./.trellis/scripts/get_context.py --mode packages
```

Confirm the task and JSONL are correct before editing hooks/agents.


--- FILE: .agents\skills\trellis-meta\references\customize-local\change-hooks.md ---

# Change Local Hooks

Hooks are the automation layer that connects a platform to Trellis. When the user wants to change "when context is injected," "how shell commands inherit a session," or "which files are read before an agent starts," hooks are usually the edit point.

## Read These Files First

1. Target platform settings/config, such as `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json`
2. Target platform hooks directory
3. `.trellis/scripts/common/active_task.py`
4. `.trellis/scripts/common/session_context.py`
5. `.trellis/workflow.md`

## Common Hook Types

| Hook | Purpose |
| --- | --- |
| session-start | Injects a Trellis overview when a session starts, clears, or compacts. |
| workflow-state | Injects a state hint on each user input. |
| sub-agent context | Injects PRD/spec/research before an agent starts. |
| shell session bridge | Lets `task.py` commands in shell see the same session identity. |

## Modification Steps

1. Find the hook registration in settings/config.
2. Confirm the registered script path exists.
3. Read the hook script and identify inputs, outputs, and called `.trellis/scripts/`.
4. Modify hook behavior.
5. If the hook depends on workflow content, synchronize `.trellis/workflow.md`.

## Example: Change New-Session Injection Content

First find the session-start hook:

```text
.claude/settings.json
.claude/hooks/session-start.py
```

If the hook ultimately calls `.trellis/scripts/get_context.py` or `session_context.py`, editing the local script is usually more robust than hard-coding content in the hook.

## Example: Agent Did Not Read JSONL

First confirm:

```bash
python3 ./.trellis/scripts/task.py current --source
python3 ./.trellis/scripts/task.py validate <task>
```

If the task and JSONL are correct, determine whether the platform uses hook push or agent pull. For hook push, edit `inject-subagent-context`; for agent pull, edit the agent file.

## Notes

- Settings handle registration, hook scripts handle behavior; inspect both together.
- Different platforms support different hook events. Do not directly copy another platform's settings.
- Hooks should read project-local `.trellis/`; they should not depend on Trellis upstream source paths.
- Hook failures should produce visible errors so AI does not silently lose context.


--- FILE: .agents\skills\trellis-meta\references\customize-local\change-skills-or-commands.md ---

# Change Local Skills, Commands, Prompts, And Workflows

When the user wants to change AI entry points, auto-trigger rules, or explicit command behavior, edit skills, commands, prompts, or workflows in local platform directories.

## Read These Files First

1. `.trellis/workflow.md`
2. Target platform skill/command/prompt/workflow directory
3. Related agent or hook files
4. Whether project rules already exist in `.trellis/spec/`

## Which Entry Type To Choose

| Goal | Recommendation |
| --- | --- |
| AI should automatically know a capability | Add or modify a skill. |
| User wants to trigger manually with a command | Add or modify a command/prompt/workflow. |
| Team project conventions | Prefer `.trellis/spec/` or a project-local skill. |
| Change Trellis flow semantics | Synchronize `.trellis/workflow.md`. |

## Modify A Skill

A skill is usually:

```text
<skill-name>/
├── SKILL.md
└── references/
```

`SKILL.md` should be short and responsible for triggering/routing. Put long content in `references/` so AI can read it on demand.

The frontmatter description should specify when to use the skill. Example:

```yaml
description: "Use when customizing this project's deployment workflow and release checklist."
```

Do not write vague descriptions such as "helpful project skill"; they can trigger incorrectly.

## Modify A Command/Prompt/Workflow

Explicit entry points should state:

- How the user triggers it.
- Which `.trellis/` files to read.
- Which scripts to run.
- How to report after completion.

If a command only repeats workflow rules, prefer making it reference/read `.trellis/workflow.md` instead of maintaining a second copy of the flow.

## Common Paths

| Platform | Entry directories |
| --- | --- |
| Claude Code | `.claude/skills/`, `.claude/commands/` |
| Cursor | `.cursor/skills/`, `.cursor/commands/` |
| OpenCode | `.opencode/skills/`, `.opencode/commands/` |
| Codex | `.agents/skills/`, `.codex/skills/` |
| GitHub Copilot | `.github/skills/`, `.github/prompts/` |
| Kilo / Antigravity / Windsurf | workflows + skills |

## Add A Project-Local Skill

If the user wants to document team-private customizations, create a project-local skill, for example:

```text
.claude/skills/project-trellis-local/
└── SKILL.md
```

For multi-platform projects, add equivalent versions in each platform skill directory, or use `.agents/skills/` on platforms that support the shared layer.

## Notes

- Do not mix every platform's syntax into one file.
- Do not change only one platform entry point while claiming all platforms are supported.
- Do not hide long-term engineering conventions inside a command; write them to `.trellis/spec/`.


--- FILE: .agents\skills\trellis-meta\references\customize-local\change-spec-structure.md ---

# Change Local Spec Structure

When the user wants to change the engineering conventions AI follows, add new spec layers, or adjust monorepo package mapping, edit `.trellis/spec/` and `.trellis/config.yaml`.

## Read These Files First

1. `.trellis/config.yaml`
2. `.trellis/spec/`
3. `.trellis/workflow.md` planning artifact guidance and Phase 3.3
4. Current task `implement.jsonl` / `check.jsonl`

## Common Needs

| Need | Edit location |
| --- | --- |
| Add backend/frontend/docs/test spec layer | `.trellis/spec/<layer>/` or `.trellis/spec/<package>/<layer>/` |
| Add shared thinking guides | `.trellis/spec/guides/` |
| Adjust monorepo packages | `packages` in `.trellis/config.yaml` |
| Change default package | `default_package` in `.trellis/config.yaml` |
| Control spec scanning scope | `spec_scope` in `.trellis/config.yaml` |
| Make a task read a new spec | Task `implement.jsonl` / `check.jsonl` |

## Add A Spec Layer

Single-repository example:

```text
.trellis/spec/security/
├── index.md
└── auth.md
```

Monorepo example:

```text
.trellis/spec/webapp/security/
├── index.md
└── auth.md
```

`index.md` should include:

- What code this layer applies to.
- Pre-Development Checklist.
- Quality Check.
- Links to specific guideline files.

## Update Context

Adding a spec does not mean every task automatically reads it. The current task must reference it in JSONL:

```bash
python3 ./.trellis/scripts/task.py add-context <task> implement ".trellis/spec/webapp/security/index.md" "Security conventions"
python3 ./.trellis/scripts/task.py add-context <task> check ".trellis/spec/webapp/security/index.md" "Security review rules"
```

## Change Monorepo Packages

Example `.trellis/config.yaml`:

```yaml
packages:
  webapp:
    path: apps/web
  api:
    path: apps/api
default_package: webapp
```

After editing, run:

```bash
python3 ./.trellis/scripts/get_context.py --mode packages
```

Use this output to confirm AI can see the correct packages and spec layers.

## Notes

- Specs are user project conventions and can be changed according to project needs.
- Do not put temporary task information into specs; put temporary information in the task.
- Do not put long-term conventions only in agents or commands; preserve them in specs.
- After changing spec structure, check whether existing task JSONL files still point to files that exist.


--- FILE: .agents\skills\trellis-meta\references\customize-local\change-task-lifecycle.md ---

# Change Local Task Lifecycle

Task lifecycle includes creation, start, context configuration, finish, archive, parent/child tasks, and lifecycle hooks. The default customization targets are `.trellis/tasks/`, `.trellis/config.yaml`, and `.trellis/scripts/`.

## Read These Files First

1. `.trellis/workflow.md`
2. `.trellis/config.yaml`
3. `.trellis/scripts/task.py`
4. `.trellis/scripts/common/task_store.py`
5. `.trellis/scripts/common/task_utils.py`
6. The current task's `.trellis/tasks/<task>/task.json`

## Common Needs And Edit Points

| Need | Edit point |
| --- | --- |
| Automatically sync an external system after task creation | `hooks.after_create` in `.trellis/config.yaml`. |
| Automatically update status after task start | `hooks.after_start` in `.trellis/config.yaml`. |
| Run a script after task finish | `hooks.after_finish` in `.trellis/config.yaml`. |
| Clean external resources after archive | `hooks.after_archive` in `.trellis/config.yaml`. |
| Change default task fields | `.trellis/scripts/common/task_store.py`. |
| Change task parsing/search | `.trellis/scripts/common/task_utils.py`. |
| Change active task behavior | `.trellis/scripts/common/active_task.py`. |

## lifecycle hooks

`.trellis/config.yaml` supports:

```yaml
hooks:
  after_create:
    - "python3 .trellis/scripts/hooks/my_sync.py create"
  after_start:
    - "python3 .trellis/scripts/hooks/my_sync.py start"
  after_finish:
    - "python3 .trellis/scripts/hooks/my_sync.py finish"
  after_archive:
    - "python3 .trellis/scripts/hooks/my_sync.py archive"
```

Hook commands receive the `TASK_JSON_PATH` environment variable, pointing to the current task's `task.json`. Hook failures should usually warn, but not block the main task operation.

## Change Task Fields

If the user wants to add project-local fields, prefer putting them under `meta` in `task.json` to avoid breaking existing scripts' assumptions about standard fields.

Example:

```json
"meta": {
  "linearIssue": "ENG-123",
  "risk": "high"
}
```

If standard fields really need to change, inspect every local script that reads `task.json`.

## Change Active Task

Active task is session-level state stored in `.trellis/.runtime/sessions/`. Do not fall back to a global `.current-task` model. If the user wants to change active task behavior, edit:

- `.trellis/scripts/common/active_task.py`
- platform hooks or shell session bridges
- active task descriptions in `.trellis/workflow.md`

### `task.py create` Sets the Active Pointer

`cmd_create` in `.trellis/scripts/common/task_store.py` calls `set_active_task` best-effort right after writing the new task directory. The behavior:

- When the calling shell carries session identity (`TRELLIS_CONTEXT_ID` env var, or any platform-specific session env that `resolve_context_key` recognizes — see `active_task.py:_ENV_SESSION_KEYS`), the per-session pointer at `.trellis/.runtime/sessions/<context_key>.json` is rewritten to point at the new task. The task's `status=planning` and `[workflow-state:planning]` fires on the very next `UserPromptSubmit`.
- When session identity is unavailable (raw CLI invocation outside an AI session, or a platform that doesn't propagate identity to shell), the task directory is still created and `status=planning` is still written, but the active pointer is left untouched. The user can attach the task later with `task.py start <dir>` once they're back in an AI session.

This makes `[workflow-state:planning]` the live breadcrumb during the brainstorm and JSONL curation work that follows `task.py create`. The pre-R7 behavior left the breadcrumb stuck on `no_task` until `task.py start`, so the planning block was effectively dead text.

If you fork `task.py` to add a new creation path (e.g. an external import that bypasses `cmd_create`), audit whether your path also calls `set_active_task`. Without that call, your created tasks will not surface as active. The full status writer table is in `.trellis/spec/cli/backend/workflow-state-contract.md`.

## Modification Steps

1. Confirm the current task with `python3 ./.trellis/scripts/task.py current --source`.
2. Read the current task's `task.json` and confirm status and fields.
3. For configuration needs, edit `.trellis/config.yaml` first.
4. For script behavior needs, then edit `.trellis/scripts/`.
5. If the AI flow changed, synchronize `.trellis/workflow.md`.

## Do Not

- Do not directly edit `.trellis/.runtime/sessions/` to "fix" business state.
- Do not hard-code project-private fields into scripts; prefer `meta`.
- Do not default to asking the user to fork Trellis CLI.


--- FILE: .agents\skills\trellis-meta\references\customize-local\change-workflow.md ---

# Change Local Workflow

When the user wants to change Trellis phases, next-action hints, whether to create tasks, whether to use sub-agents, or when to check/wrap up, edit `.trellis/workflow.md` first.

## Read These Files First

1. `.trellis/workflow.md`
2. Entry files for the current platform, such as skills/commands/prompts/workflows
3. The current task's `task.json` and `prd.md`

## Common Needs And Edit Points

| Need | Edit point |
| --- | --- |
| Change phase names or phase order | `Phase Index` and the corresponding Phase sections. |
| Change whether to create a task when there is no task | `[workflow-state:no_task]` state block. |
| Change the next step during planning | Phase 1 and `[workflow-state:planning]`. |
| Change whether an agent is required during in_progress | Phase 2 and `[workflow-state:in_progress]`. |
| Change wrap-up after completion | Phase 3 and `[workflow-state:completed]`. |
| Change which skill a user intent triggers | `Skill Routing` table. |

## Modification Steps

1. Find the relevant section in `.trellis/workflow.md`.
2. When changing rules, keep explicit trigger conditions and next actions.
3. If adding or renaming a skill/agent, synchronize the corresponding files in platform directories.
4. Workflow-state changes only need an edit to the `[workflow-state:STATUS]` block in `.trellis/workflow.md`. The hook is parser-only — it reads whatever you put in the block. Keep the opening and closing tags' STATUS strings identical (`[workflow-state:foo]…[/workflow-state:foo]`); mismatched STATUS pairs are silently dropped.
5. Make the AI reread `.trellis/workflow.md`; do not keep using rules from the old conversation.

## Example: Relax Task Creation Requirements

To change when task creation can be skipped, usually edit `[workflow-state:no_task]`:

```md
[workflow-state:no_task]
Task is not required when the answer is a one-reply explanation, no files are changed, and no research is needed.
[/workflow-state:no_task]
```

If the formal Phase 1 flow also needs to change, synchronize the Phase 1 section.

## Example: One Platform Does Not Use Sub-Agents

If the user wants only one platform to avoid sub-agents, first confirm whether that platform has a separate group in the workflow. Then change Phase 2 routing for that platform group instead of deleting all `trellis-implement` / `trellis-check` instructions across platforms.

## `/trellis:continue` Route Table

`/trellis:continue` resumes a task by deciding which phase step to load next. The decision combines `task.json.status` with the presence of artifacts inside the task directory. The mapping is fixed in the command itself; forks that add custom statuses must extend both the workflow.md tag block and this table.

| `status` | Artifact state | Resume at |
| --- | --- | --- |
| `planning` | `prd.md` missing | Phase 1.1 (load `trellis-brainstorm`) |
| `planning` | lightweight task with `prd.md` complete | ask for start review, then run `task.py start` |
| `planning` | complex task missing `design.md` or `implement.md` | complete missing planning artifacts |
| `planning` | complex task has `prd.md`, `design.md`, and `implement.md` | ask for start review, then run `task.py start` |
| `in_progress` | no implementation in conversation history | Phase 2.1 (`trellis-implement`) |
| `in_progress` | implementation done, no `trellis-check` run | Phase 2.2 (`trellis-check`) |
| `in_progress` | check passed | Phase 3.1 (verify quality + spec update) |
| `completed` | task is still in active tree | Phase 3.5 (run `/trellis:finish-work` to archive) |

When you add a custom status (e.g. `in-review`), add a `[workflow-state:in-review]` block in `.trellis/workflow.md` for the per-turn breadcrumb AND extend this route table — usually by editing the `/trellis:continue` command file (`.{platform}/commands/trellis/continue.md` or equivalent) to add a row that decides where to resume from. Without the route entry, `/trellis:continue` will fall through to a default branch and the user will not land on the step you intended.

## Notes

`.trellis/workflow.md` is the local project workflow, not an immutable template. The user can adapt it to team habits. After editing it, platform entry files may still contain old descriptions, so inspect them too.


--- FILE: .agents\skills\trellis-meta\references\customize-local\overview.md ---

# Local Customization Overview

This directory is for local AI working in a user project where Trellis was installed through npm and `trellis init` has already been run. The AI should modify generated `.trellis/` and platform directories inside the project, not Trellis CLI upstream source code.

## First Determine What The User Actually Wants To Change

| User wording | Read first |
| --- | --- |
| "Change the Trellis flow / phases / next prompt" | `change-workflow.md` |
| "Change task creation, status, archive, or hooks" | `change-task-lifecycle.md` |
| "AI did not read context / change injected content" | `change-context-loading.md` |
| "A platform hook is not behaving as expected" | `change-hooks.md` |
| "Change implement/check/research agent behavior" | `change-agents.md` |
| "Add a skill/command/workflow/prompt" | `change-skills-or-commands.md` |
| "Adjust the project spec structure" | `change-spec-structure.md` |
| "Add team conventions and local notes" | `add-project-local-conventions.md` |

## General Operation Order

1. **Confirm platform and directories**: inspect which directories exist, such as `.claude/`, `.codex/`, `.cursor/`.
2. **Confirm the current active task**: run `python3 ./.trellis/scripts/task.py current --source`.
3. **Read the local source of truth**: prefer `.trellis/workflow.md`, `.trellis/config.yaml`, and relevant platform files.
4. **Modify narrowly**: edit only files related to the user's request.
5. **Synchronize semantics**: if a shared flow changes, check whether platform entry points also need changes; if a platform entry changes, check whether `.trellis/workflow.md` still agrees.

## Local File Priority

| Layer | Files |
| --- | --- |
| Workflow | `.trellis/workflow.md` |
| Project configuration | `.trellis/config.yaml` |
| Task material | `.trellis/tasks/<task>/` |
| Project specs | `.trellis/spec/` |
| Runtime scripts | `.trellis/scripts/` |
| Platform integration | `.claude/`, `.codex/`, `.cursor/`, `.opencode/`, and similar directories |
| Shared skill | `.agents/skills/` |

## Things Not To Do By Default

- Do not edit the global npm install directory.
- Do not edit `node_modules/@mindfoldhq/trellis`.
- Do not assume the user has the Trellis GitHub repository.
- Do not overwrite local files already modified by the user with default templates.
- Do not put team project rules into public `trellis-meta`; project rules belong in `.trellis/spec/` or a local skill.

## When To Inspect Upstream Source

Switch to an upstream source-code perspective only when the user explicitly expresses one of these goals:

- "I want to open a PR to Trellis"
- "I want to change npm package publish contents"
- "I want to fork Trellis"
- "I want to modify the generation logic for `trellis init/update`"

Otherwise, default to modifying local Trellis files inside the user project.


--- FILE: .agents\skills\trellis-meta\references\local-architecture\context-injection.md ---

# Local Context Injection System

Trellis context injection aims to make AI read the right files at the right time instead of relying on model memory. In a user project, injection is implemented by `.trellis/` scripts together with platform hooks, agents, and skills.

## Injected Context Types

| Type | Source | Purpose |
| --- | --- | --- |
| session context | `.trellis/scripts/get_context.py` | Current developer, git status, active task, active tasks, journal, packages. |
| workflow context | `.trellis/workflow.md` | Current Trellis flow and next action. |
| spec context | `.trellis/spec/` + task JSONL | Specs that must be followed during implementation/checking. |
| task context | `.trellis/tasks/<task>/prd.md`, `design.md`, `implement.md`, `research/` | Current task requirements, design, execution plan, and research. |
| platform context | Platform hooks/settings/agents | Lets different AI tools read the files above through their own mechanisms. |

## session-start

Platforms with session-start support inject a Trellis overview when a session starts, clears, compacts, or receives a similar event. Injected content usually includes:

- workflow summary.
- current task status.
- active tasks.
- spec index paths.
- developer identity and git status.

If the user feels the AI does not know the current task in a new session, first check whether the platform's session-start hook or equivalent mechanism is installed and running.

## workflow-state

workflow-state is a lightweight hint injected around each user turn. Based on current task status, it selects a block from `.trellis/workflow.md`, such as `no_task`, `planning`, `in_progress`, or `completed`.

If the user wants to change "what the AI should do next in a given state," edit the corresponding state block in `.trellis/workflow.md` first.

## sub-agent context

Implement and check agents need task context. Trellis has two loading modes:

1. **hook push**: a platform hook injects jsonl-referenced files plus `prd.md`, `design.md` if present, and `implement.md` if present before the agent starts.
2. **agent pull**: the agent definition instructs the agent to read the active task, jsonl context, and task artifacts after startup.

In both modes, JSONL files in the task directory are the manifest for spec/research context. Task artifacts are read separately in this order: `prd.md` -> `design.md if present` -> `implement.md if present`.

## JSONL Reading Rules

`implement.jsonl` and `check.jsonl` contain one JSON object per line:

```jsonl
{"file": ".trellis/spec/backend/index.md", "reason": "Backend rules"}
```

Readers should skip seed rows without a `file` field. When configuring JSONL, the AI should include only spec/research files, not pre-register code files that will be modified.

## Active Task And Context Key

Active task state lives in `.trellis/.runtime/sessions/` and is isolated per session. Hooks try to resolve the context key from platform events, environment variables, transcript paths, or `TRELLIS_CONTEXT_ID`.

If shell commands cannot see the same context key, `task.py current --source` may report no active task. In that case, check whether the platform passes session identity into the shell instead of hand-writing a global current-task file.

## Local Customization Points

| Need | Edit location |
| --- | --- |
| Change session-start injected content | The platform's `session-start` hook or plugin file. |
| Change per-turn workflow-state rules | `[workflow-state:STATUS]` block in `.trellis/workflow.md`. The platform workflow-state hook parses these blocks verbatim and embeds no fallback text. |
| Change how sub-agents read context | Platform agent definitions, the `inject-subagent-context` hook, or agent preludes. |
| Change JSONL validation/display | `.trellis/scripts/common/task_context.py`. |
| Change active task resolution | `.trellis/scripts/common/active_task.py`. |

When modifying context injection, verify two things: new sessions can see the correct task, and sub-agents can see the correct task artifacts/spec/research.


--- FILE: .agents\skills\trellis-meta\references\local-architecture\generated-files.md ---

# Local Files Generated After Init

`trellis init` writes the Trellis runtime into the user project. Later, `trellis update` tries to update Trellis-managed template files, but it uses `.trellis/.template-hashes.json` to determine which files have already been modified by the user.

This page only describes files that are visible and editable inside the user project.

## `.trellis/`

```text
.trellis/
├── workflow.md
├── config.yaml
├── .developer
├── .version
├── .template-hashes.json
├── .runtime/
├── scripts/
├── spec/
├── tasks/
└── workspace/
```

| Path | Usually editable? | Notes |
| --- | --- | --- |
| `.trellis/workflow.md` | Yes | Local workflow documentation and AI routing rules. |
| `.trellis/config.yaml` | Yes | Project configuration, hooks, packages, journal line limits, and related settings. |
| `.trellis/spec/` | Yes | Project specs, intended to be updated regularly by users and AI. |
| `.trellis/tasks/` | Yes | Task material and research artifacts, maintained by the task workflow. |
| `.trellis/workspace/` | Yes | Session records, usually written by `add_session.py`. |
| `.trellis/scripts/` | Carefully | Local runtime. It can be customized, but only after understanding the call chain. |
| `.trellis/.runtime/` | No | Runtime state, usually written automatically by hooks/scripts. |
| `.trellis/.developer` | Carefully | Current developer identity. |
| `.trellis/.version` | No | Trellis version record used by update/migration logic. |
| `.trellis/.template-hashes.json` | No | Template hash record. Do not hand-write business rules here. |

## Platform Directories

Different platforms generate different directories. Common categories:

| Category | Example paths | Purpose |
| --- | --- | --- |
| hooks | `.claude/hooks/`, `.codex/hooks/`, `.cursor/hooks/` | Inject session context, workflow-state, and sub-agent context. |
| settings | `.claude/settings.json`, `.codex/hooks.json`, `.qoder/settings.json` | Tell the platform when to run hooks or plugins. |
| agents | `.claude/agents/`, `.codex/agents/`, `.kiro/agents/` | Define agents such as `trellis-research`, `trellis-implement`, and `trellis-check`. |
| skills | `.claude/skills/`, `.agents/skills/`, `.qoder/skills/` | Skills that auto-trigger or can be read by AI. |
| commands/prompts/workflows | `.cursor/commands/`, `.github/prompts/`, `.windsurf/workflows/` | Explicit user-invoked command or workflow entry points. |

When modifying a platform directory, also confirm whether `.trellis/workflow.md` still describes the same flow.

## Meaning Of Template Hashes

`.trellis/.template-hashes.json` records the content hash from the last time Trellis wrote a template file. `trellis update` uses it to distinguish three cases:

| Case | Update behavior |
| --- | --- |
| File was not modified by the user | It can be updated automatically. |
| File was modified by the user | Prompt the user to overwrite, keep, or generate `.new`. |
| File is no longer a current template | It may be deleted, renamed, or preserved according to migration rules. |

When an AI customizes local Trellis files, it does not need to maintain hashes manually. It is normal for Trellis update to recognize the result as "modified by the user."

## Local Customization Boundaries

Editable by default:

- `.trellis/workflow.md`
- `.trellis/config.yaml`
- `.trellis/spec/**`
- `.trellis/scripts/**`
- Platform hooks, settings, agents, skills, commands, prompts, and workflows

Do not edit by default:

- Global npm install directory
- `node_modules/@mindfoldhq/trellis`
- Trellis GitHub repository source code
- Concrete state files under `.trellis/.runtime/**`
- Hash contents inside `.trellis/.template-hashes.json`

Switch to the Trellis CLI source-code perspective only when the user explicitly wants to contribute upstream.


--- FILE: .agents\skills\trellis-meta\references\local-architecture\overview.md ---

# Local Trellis Architecture Overview

`trellis-meta` is for user projects that have already run `trellis init`. The user's machine usually has only the npm-installed `trellis` command plus the Trellis files generated inside the project; it may not have the Trellis CLI source code.

Therefore, when an AI uses this skill, the default customization target is local files inside the user project:

- `.trellis/`: workflow, tasks, specs, memory, scripts, and runtime state.
- Platform directories: `.claude/`, `.codex/`, `.cursor/`, `.opencode/`, `.kiro/`, `.gemini/`, `.qoder/`, `.codebuddy/`, `.github/`, `.factory/`, `.pi/`, `.kilocode/`, `.agent/`, `.windsurf/`, and similar directories.
- Shared skill layer: `.agents/skills/`.

Do not default to guiding the user to fork the Trellis CLI repository. Treat upstream source code as the operating target only when the user explicitly says they want to change Trellis upstream source, publish an npm package, or contribute a PR.

## Local System Model

Trellis provides three layers inside a user project:

1. **Workflow layer**: `.trellis/workflow.md` defines phases, routing, next actions, and prompt blocks.
2. **Persistence layer**: `.trellis/tasks/`, `.trellis/spec/`, and `.trellis/workspace/` store tasks, specs, and session memory.
3. **Platform integration layer**: hooks, settings, agents, skills, commands, prompts, and workflows in platform directories connect the Trellis workflow to different AI tools.

All three layers live inside the user project, so an AI can read and modify them directly.

## Core Paths

| Path | Purpose |
| --- | --- |
| `.trellis/workflow.md` | Workflow phases, skill routing, and workflow-state prompt blocks. |
| `.trellis/config.yaml` | Project configuration, task lifecycle hooks, monorepo package configuration, and journal configuration. |
| `.trellis/spec/` | The user's project-specific coding conventions and thinking guides. |
| `.trellis/tasks/` | Each task's PRD, technical notes, research files, and JSONL context. |
| `.trellis/workspace/` | Per-developer journals and cross-session memory. |
| `.trellis/scripts/` | Local Python runtime used by commands, hooks, and context injection. |
| `.trellis/.runtime/` | Session-level runtime state, such as the current task pointer. |
| `.trellis/.template-hashes.json` | Template hashes for Trellis-managed files, used by update to determine whether local files were modified by the user. |

## AI Customization Principles

1. **Find the local source of truth first**: Do not edit from memory. Read `.trellis/workflow.md`, `.trellis/config.yaml`, the relevant platform directory, and related task files first.
2. **Edit the user project, not the npm package cache**: Modify generated files inside the project, not `node_modules` or the global npm install directory.
3. **Keep platform files aligned with `.trellis/`**: If workflow routing changes, also check whether platform skills or commands still describe the same flow.
4. **Put project-specific rules in `.trellis/spec/` or a local skill**: Do not put team conventions into `trellis-meta`.
5. **Preserve user changes**: If a file was already modified locally, work from the current content instead of overwriting it with a default template.

## How To Use This Directory

- To understand which files exist after init, read `generated-files.md`.
- To change phases, routing, or next actions, read `workflow.md`.
- To change the task model, JSONL context, or active task behavior, read `task-system.md`.
- To change coding convention injection, read `spec-system.md`.
- To understand journals and cross-session memory, read `workspace-memory.md`.
- To change hooks or sub-agent context loading, read `context-injection.md`.


--- FILE: .agents\skills\trellis-meta\references\local-architecture\spec-system.md ---

# Local Spec System

`.trellis/spec/` is the user's project-specific engineering spec library. Trellis is not about making AI memorize conventions; it injects relevant specs or requires the AI to read them at the right time.

## Directory Model

A common single-repository structure:

```text
.trellis/spec/
├── backend/
│   ├── index.md
│   └── ...
├── frontend/
│   ├── index.md
│   └── ...
└── guides/
    ├── index.md
    └── ...
```

A common monorepo structure:

```text
.trellis/spec/
├── cli/
│   ├── backend/
│   │   ├── index.md
│   │   └── ...
│   └── unit-test/
│       ├── index.md
│       └── ...
├── docs-site/
│   └── docs/
│       ├── index.md
│       └── ...
└── guides/
    ├── index.md
    └── ...
```

`index.md` is the entry point for each layer. It should list the Pre-Development Checklist and Quality Check. Specific guidelines live in other Markdown files in the same directory.

## Package Configuration

`.trellis/config.yaml` can declare packages:

```yaml
packages:
  cli:
    path: packages/cli
  docs-site:
    path: docs-site
    type: submodule
default_package: cli
```

The AI can run:

```bash
python3 ./.trellis/scripts/get_context.py --mode packages
```

This command lists packages and spec layers for the current project. Use this output as the reference when configuring context JSONL.

## How Specs Enter Tasks

Before a task enters implementation, planning may write relevant specs into `implement.jsonl` / `check.jsonl` when the task needs spec or research context beyond the task artifacts:

```jsonl
{"file": ".trellis/spec/cli/backend/index.md", "reason": "CLI backend conventions"}
{"file": ".trellis/spec/cli/unit-test/conventions.md", "reason": "Test expectations"}
```

Sub-agents or platform preludes read these JSONL files and load the referenced specs. On platforms without sub-agent support, the AI should read the relevant specs directly according to the workflow.

## What Specs Should Contain

Specs should contain executable engineering conventions for the project, not generic best practices:

- Where files should live.
- How error handling should be expressed.
- Input/output contracts for APIs, hooks, and commands.
- Patterns that are forbidden.
- Cases that require tests.
- Project-specific pitfalls and how to avoid them.

When the AI learns a new rule during implementation or debugging, it should update `.trellis/spec/` rather than only summarizing it in chat.

## Local Customization Points

| Need | Edit location |
| --- | --- |
| Add a new spec layer | `.trellis/spec/<package>/<layer>/index.md` and corresponding guideline files. |
| Change monorepo spec mapping | `packages` / `default_package` / `spec_scope` in `.trellis/config.yaml`. |
| Change which specs AI reads before implementation | The task's `implement.jsonl`. |
| Change which specs AI reads during checking | The task's `check.jsonl`. |
| Change when specs should be updated | Phase 3.3 in `.trellis/workflow.md` and the `trellis-update-spec` skill. |

## Boundaries

`.trellis/spec/` is the user's project specification, not a permanent copy of Trellis built-in templates. The AI should encourage the user to update it according to the actual project code instead of treating Trellis default templates as immutable documents.


--- FILE: .agents\skills\trellis-meta\references\local-architecture\task-system.md ---

# Local Task System

The Trellis task system is stored entirely under `.trellis/tasks/` in the user project. Each task is a directory containing requirements, context, research, state, and relationship information.

## Task Directory Structure

```text
.trellis/tasks/
├── 04-28-example-task/
│   ├── task.json
│   ├── prd.md
│   ├── design.md
│   ├── implement.md
│   ├── implement.jsonl
│   ├── check.jsonl
│   └── research/
└── archive/
    └── 2026-04/
```

| File | Purpose |
| --- | --- |
| `task.json` | Task metadata: status, assignee, priority, branch, parent/child tasks, and similar fields. |
| `prd.md` | Requirements, constraints, and acceptance criteria. Lightweight tasks may be PRD-only. |
| `design.md` | Technical design for complex tasks: boundaries, contracts, data flow, compatibility, tradeoffs. |
| `implement.md` | Execution plan for complex tasks: ordered checklist, validation commands, review gates, rollback points. |
| `implement.jsonl` | List of spec/research files the implement agent must read first. |
| `check.jsonl` | List of spec/research files the check agent must read first. |
| `research/` | Research artifacts. Complex findings should not live only in chat. |

## `task.json`

`task.json` records task status and metadata. Common fields:

| Field | Meaning |
| --- | --- |
| `id` / `name` / `title` | Task identity and title. |
| `status` | Status such as `planning`, `in_progress`, `review`, or `completed`. |
| `priority` | `P0`, `P1`, `P2`, `P3`. |
| `creator` / `assignee` | Creator and assignee. |
| `package` | Target package in a monorepo; may be empty. |
| `branch` / `base_branch` | Working branch and PR target branch. |
| `children` / `parent` | Parent/child task relationships. |
| `commit` / `pr_url` | Commit and PR information after completion. |
| `meta` | Extension fields. |

## Parent / Child Task Trees

Parent/child task relationships are for work structure. A parent task groups related deliverables under one source requirement set; it is not a dependency scheduler and does not replace the child task's own planning artifacts.

Use a parent task when a request has multiple independently verifiable deliverables. The parent owns:

- Source requirements and user-facing scope.
- The map of child tasks and their responsibility boundaries.
- Cross-child acceptance criteria and final integration review.

Use child tasks for deliverables that can move through planning, implementation, check, and archive independently. If one child depends on another, write that dependency in the child `prd.md` / `implement.md`; do not rely on tree position to imply ordering.

Create new children with:

```bash
python3 ./.trellis/scripts/task.py create "<child title>" --slug <child-slug> --parent <parent-dir>
```

Link or unlink existing tasks with:

```bash
python3 ./.trellis/scripts/task.py add-subtask <parent-dir> <child-dir>
python3 ./.trellis/scripts/task.py remove-subtask <parent-dir> <child-dir>
```

`children` on the parent is a historical list. When a child is archived, Trellis keeps that child name in the parent so progress like `[2/3 done]` remains meaningful after completed children move to `archive/`.

The AI should not treat phase numbers as task status. Task progress is mainly determined by `status`, artifact presence (`prd.md`, optional `design.md` / `implement.md`), whether JSONL context is configured for sub-agent mode, and the phase descriptions in `workflow.md`.

## Active Task

The user sees a "current task," but Trellis stores active task state per session.

```text
.trellis/.runtime/sessions/<context-key>.json
```

`task.py start` writes the task path into the runtime session file for the current session. `task.py current --source` shows the current task and where it came from. Different AI windows can point to different tasks without overwriting each other.

If the platform or shell environment has no stable session identity, `task.py start` may be unable to set the active task. The AI should read the error, inspect the platform hook/session environment, and not fall back to a shared global pointer.

## JSONL Context

`implement.jsonl` and `check.jsonl` are context manifests for sub-agents to read first. They do not replace `implement.md`; `implement.md` is the human-readable execution plan.

Format:

```jsonl
{"file": ".trellis/spec/cli/backend/index.md", "reason": "Backend conventions"}
{"file": ".trellis/tasks/04-28-example/research/api.md", "reason": "API research"}
```

Rules:

- Include spec and research files.
- Do not include code files that are about to be modified.
- Do not treat temporary conclusions in chat as the only context.
- Seed rows have no `file` field; they only prompt the AI to fill in real entries.

## Common Commands

```bash
python3 ./.trellis/scripts/task.py create "<title>" --slug <slug>
python3 ./.trellis/scripts/task.py start <task>
python3 ./.trellis/scripts/task.py current --source
python3 ./.trellis/scripts/task.py add-context <task> implement <file> <reason>
python3 ./.trellis/scripts/task.py validate <task>
python3 ./.trellis/scripts/task.py finish
python3 ./.trellis/scripts/task.py archive <task>
```

When modifying the task system, the AI should prefer script commands to maintain structure. Edit JSON/Markdown directly only when scripts do not cover the need.

## Local Customization Points

| Need | Edit location |
| --- | --- |
| Change the default task template | `.trellis/scripts/common/task_store.py` and task creation instructions. |
| Change status semantics | `.trellis/workflow.md`, workflow-state hook logic, and task usage conventions. |
| Add task lifecycle actions | `hooks.after_*` in `.trellis/config.yaml`. |
| Change context rules | Planning artifact guidance in `.trellis/workflow.md` and related platform agent/hook instructions. |
| Change archive policy | `.trellis/scripts/common/task_store.py` / `task_utils.py`. |

These are local files in the user project. Do not default to editing Trellis CLI source code unless the user wants to contribute upstream.


--- FILE: .agents\skills\trellis-meta\references\local-architecture\workflow.md ---

# Local Workflow System

`.trellis/workflow.md` is the Trellis workflow source of truth inside the user project. An AI does not need Trellis source code to understand how the current project should move tasks forward; this file is enough.

## File Responsibilities

`.trellis/workflow.md` has three responsibilities:

1. **Explain workflow phases**: Plan, Execute, Finish.
2. **Define skill routing**: which skill or agent the AI should use when the user expresses a certain intent.
3. **Provide workflow-state prompt blocks**: hooks can inject the prompt block for the current state into the conversation.

## Current Phase Model

```text
Phase 1: Plan    -> clarify what to build, produce prd.md and required research
Phase 2: Execute -> implement against the PRD and specs, then check
Phase 3: Finish  -> final verification, preserve lessons, and wrap up
```

Each phase contains numbered steps, such as `1.3 Configure context`. These numbers are not runtime fields in `task.json`; they are workflow structure for AI and humans to read.

## Skill Routing

`workflow.md` separates routing by platform capability:

- Platforms with sub-agent support: dispatch `trellis-implement` by default for implementation and `trellis-check` for checking.
- Platforms without sub-agent support: the main session reads skills such as `trellis-before-dev`, then executes directly.

When changing local AI behavior, update the routing descriptions in `workflow.md` first, then check whether the corresponding platform skill, command, or agent files need to stay in sync.

## Workflow-State Prompt Blocks

The bottom of `workflow.md` can contain state blocks like this:

```text
[workflow-state:no_task]
...
[/workflow-state:no_task]
```

Hooks choose the right block based on current task status and inject it into the conversation. Common states include:

| State | Meaning |
| --- | --- |
| `no_task` | The current session has no active task. |
| `planning` | The task is still in requirements, research, or context configuration. |
| `in_progress` | The task has entered implementation and checking. |
| `completed` | The task is complete and waiting for wrap-up or archive. |

If the user wants to change policies such as "whether to create a task when there is no task," "when task creation may be skipped," or "whether sub-agents are required," edit these state blocks and the routing table above them.

## Local Modification Patterns

Common changes:

| Goal | Edit point |
| --- | --- |
| Add a phase | Update the Phase Index, phase body, routing, and state blocks. |
| Change task creation policy | Update the `no_task` state block and Phase 1 description. |
| Change the default implementation/check path | Update Phase 2 and skill routing. |
| Change the wrap-up flow | Update Phase 3 and `finish-work` related descriptions. Note the current split: Phase 3.4 = AI-driven code commits (batched, user-confirmed), Phase 3.5 = `/finish-work` (archive + record session). `/finish-work` refuses to run if the working tree is dirty. |
| Change platform differences | Update routing descriptions grouped by platform. |

After editing, make the AI reread `.trellis/workflow.md`; do not assume the flow from the old conversation is still valid.

## Relationship To Platform Files

`workflow.md` is the semantic center of the local workflow, but each platform can also have its own entry files:

- skills, such as `trellis-brainstorm` and `trellis-check`.
- commands/prompts/workflows, such as continue and finish-work.
- hooks, such as session-start or workflow-state injection.

If only `workflow.md` changes, platform entry files may still contain old language. When the user wants to change "what the AI actually does," also inspect the relevant platform directory.


--- FILE: .agents\skills\trellis-meta\references\local-architecture\workspace-memory.md ---

# Local Workspace Memory System

`.trellis/workspace/` stores cross-session memory. Its purpose is to let AI and humans understand what happened before across different windows and different days.

## Directory Structure

```text
.trellis/workspace/
├── index.md
└── <developer>/
    ├── index.md
    ├── journal-1.md
    └── journal-2.md
```

| File | Purpose |
| --- | --- |
| `.trellis/.developer` | Current developer identity. |
| `.trellis/workspace/index.md` | Global workspace overview. |
| `.trellis/workspace/<developer>/index.md` | Session index for a developer. |
| `.trellis/workspace/<developer>/journal-N.md` | Session journal. |

## Developer Identity

Run this the first time:

```bash
python3 ./.trellis/scripts/init_developer.py <name>
```

This creates `.trellis/.developer` and the corresponding workspace directory. The AI should not change developer identity casually; if the identity is wrong, first confirm who is using the current project.

## Journal

`journal-N.md` records completed or partially completed work from each session. By default, each journal holds about 2000 lines; after that it rotates to the next file.

Common command for recording a session:

```bash
python3 ./.trellis/scripts/add_session.py \
  --title "Session title" \
  --summary "What changed" \
  --commit "abc1234"
```

Planning or review work without a commit can also be recorded by using `--no-commit` or an empty commit value.

## Relationship Between Workspace Memory And Tasks

| System | What it stores |
| --- | --- |
| `.trellis/tasks/` | Requirements, design, research, and state for a specific task. |
| `.trellis/workspace/` | Work records across tasks and sessions. |
| `.trellis/spec/` | Engineering knowledge preserved as long-term conventions. |

If information is only useful for the current task, put it in the task directory.  
If information describes what happened in the current session, put it in the workspace journal.  
If information should be followed every time code is written in the future, put it in spec.

## Local Customization Points

| Need | Edit location |
| --- | --- |
| Change maximum journal lines | `max_journal_lines` in `.trellis/config.yaml`. |
| Change session auto-commit message | `session_commit_message` in `.trellis/config.yaml`. |
| Change session content format | `.trellis/scripts/add_session.py`. |
| Change how workspace is displayed in context | `.trellis/scripts/common/session_context.py`. |

## AI Usage Rules

The AI should not treat workspace as the only source of truth. When resuming a task, read the current task first, then use workspace for background. After a task is complete, record important process notes in workspace; if long-term rules emerged, update spec.


--- FILE: .agents\skills\trellis-meta\references\platform-files\agents.md ---

# Agents

Trellis agent files define specialized roles. Common Trellis agents in a user project are:

- `trellis-research`
- `trellis-implement`
- `trellis-check`

File locations and formats differ by platform, but responsibility boundaries should stay consistent.

## Agent Responsibilities

| Agent | Responsibility |
| --- | --- |
| `trellis-research` | Investigate the question and write findings into the current task's `research/`. |
| `trellis-implement` | Implement against `prd.md`, optional `design.md` / `implement.md`, `implement.jsonl`, and related spec/research. |
| `trellis-check` | Review changes, fix discovered issues, and run necessary checks. |

Agent files should not become generic chat prompts. They should define input sources, write boundaries, whether code may be changed, and how results are reported.

## Common Paths

| Platform | Agent path |
| --- | --- |
| Claude Code | `.claude/agents/trellis-*.md` |
| Cursor | `.cursor/agents/trellis-*.md` |
| OpenCode | `.opencode/agents/trellis-*.md` |
| Codex | `.codex/agents/trellis-*.toml` |
| Kiro | `.kiro/agents/trellis-*.json` |
| Gemini CLI | `.gemini/agents/trellis-*.md` |
| Qoder | `.qoder/agents/trellis-*.md` |
| CodeBuddy | `.codebuddy/agents/trellis-*.md` |
| Factory Droid | `.factory/droids/trellis-*.md` |
| Pi Agent | `.pi/agents/trellis-*.md` |

GitHub Copilot agent/prompt support is provided by a combination of directories such as `.github/agents/`, `.github/prompts/`, and `.github/skills/`; inspect the files actually generated in the user project.

Main-session workflow platforms such as Kilo, Antigravity, and Windsurf may not have Trellis sub-agent files. They usually rely on workflows/skills to guide the main session.

## Two Context Loading Modes

### hook push

The platform hook injects task context before the agent starts. The agent file itself can focus more on responsibilities and boundaries.

Common on platforms that support agent hooks.

### agent pull

The agent file instructs the agent to read after startup:

- `python3 ./.trellis/scripts/task.py current --source`
- `implement.jsonl` or `check.jsonl`
- spec/research files referenced by JSONL
- current task `prd.md`
- `design.md` if present
- `implement.md` if present

This mode fits platforms whose hooks cannot reliably rewrite sub-agent prompts.

## Local Change Scenarios

| User need | Edit location |
| --- | --- |
| Implement agent must follow extra restrictions | The platform's `trellis-implement` agent file. |
| Check agent must run project-specific commands | `trellis-check` agent file, and `.trellis/spec/` if needed. |
| Research agent must output a fixed format | `trellis-research` agent file. |
| Agent cannot read task context | Agent prelude or `inject-subagent-context` hook. |
| Add a project-specific agent | Platform agent directory + related workflow/command/skill entry point. |

## Modification Principles

1. **Keep responsibilities single-purpose**. Do not mix research, implement, and check responsibilities into one agent.
2. **Specify the read order**. Agents must know to start from the active task, read jsonl/spec context, then read `prd.md`, `design.md` if present, and `implement.md` if present.
3. **Specify write boundaries**. Research usually only writes `research/`; implement can write code; check can fix issues.
4. **Keep semantics synchronized in multi-platform projects**. If the user configured Claude, Codex, and Cursor together, decide whether changes to one platform's agent also need to be applied to others.

## Do Not Default To Editing Upstream Templates

Local AI should default to modifying platform agent files inside the user project. Discuss upstream template source only when the user explicitly wants to contribute the change back to Trellis.


--- FILE: .agents\skills\trellis-meta\references\platform-files\hooks-and-settings.md ---

# Hooks And Settings

Hooks/settings are the entry layer that connects a platform to Trellis. They decide which scripts, plugins, or extensions a platform runs for which events.

## Settings Responsibilities

settings/config files usually register:

- session-start hook: injects a Trellis overview when a new session starts or context resets.
- workflow-state hook: parses `[workflow-state:STATUS]` blocks from `.trellis/workflow.md` and emits the body matching the current task `status` on each user input. Parser-only; the script does not embed fallback content.
- sub-agent context hook: injects task context when implementation/check/research agents start.
- shell/session bridge: lets shell commands see the same Trellis session identity.
- platform plugin or extension entry points.

Common files:

| Platform | settings/config |
| --- | --- |
| Claude Code | `.claude/settings.json` |
| Cursor | `.cursor/hooks.json` |
| Codex | `.codex/hooks.json`, `.codex/config.toml` |
| OpenCode | `.opencode/package.json`, `.opencode/plugins/*` |
| Kiro | `.kiro/hooks/` + platform config |
| Gemini CLI | `.gemini/settings.json` |
| Qoder | `.qoder/settings.json` |
| CodeBuddy | `.codebuddy/settings.json` |
| GitHub Copilot | `.github/copilot/hooks.json` |
| Factory Droid | `.factory/settings.json` |
| Pi Agent | `.pi/settings.json`, `.pi/extensions/trellis/` |

Whether these files exist in a project depends on which `trellis init --<platform>` flags the user ran.

## Hook Script Types

| Script | Purpose |
| --- | --- |
| `session-start.py` | Generates session-start context. |
| `inject-workflow-state.py` | Parses `[workflow-state:STATUS]` blocks in `.trellis/workflow.md` and emits the body matching the current task status. Falls back to `Refer to workflow.md for current step.` when no matching block exists. |
| `inject-subagent-context.py` | Injects PRD, JSONL context, and related spec/research into sub-agents. |
| `inject-shell-session-context.py` | Lets shell commands inherit Trellis session identity. |

Not every platform has every hook. Do not copy files from another platform just because a platform lacks a hook; first confirm whether that platform supports the corresponding event.

## Local Change Scenarios

| User need | Edit location |
| --- | --- |
| AI should see more/less context in a new session | Platform `session-start` hook. |
| Per-turn hint policy should change | `[workflow-state:STATUS]` block in `.trellis/workflow.md`. The hook parses workflow.md verbatim — no script edit required. |
| Sub-agent cannot read PRD/spec | `inject-subagent-context` hook or agent prelude. |
| `task.py current` in shell has no active task | Shell/session bridge hook or platform environment variable configuration. |
| Disable an automatic injection | The corresponding hook registration in settings/config. |

## Modification Principles

1. **Settings wire things up; hooks define behavior**. If only the hook changes, the platform may never call it. If only settings change, behavior may not change.
2. **Confirm platform event names first**. Different platforms use different names for SessionStart, UserPromptSubmit, AgentSpawn, shell execution, and similar events.
3. **Hooks read local `.trellis/`, not upstream source**. `.trellis/scripts/` and `.trellis/workflow.md` in the user project are the default targets.
4. **Errors must be visible**. Hook failures should tell the user what was not injected instead of silently leaving the AI without context.

## Troubleshooting Path

If the user says "AI did not read Trellis state":

1. Check whether the platform settings register the hook.
2. Check whether the hook file exists.
3. Manually run the `.trellis/scripts/get_context.py` or `task.py current --source` command that the hook depends on.
4. Check whether active task state exists in `.trellis/.runtime/sessions/`.
5. Check whether the platform shell passes session identity.


--- FILE: .agents\skills\trellis-meta\references\platform-files\overview.md ---

# Platform Files Overview

Trellis connects the same local architecture to different AI tools. `.trellis/` stores the shared runtime; platform directories store adapter files that define how each AI tool enters Trellis.

When a local AI modifies Trellis, it should distinguish two file categories first:

- **Shared files**: `.trellis/workflow.md`, `.trellis/tasks/`, `.trellis/spec/`, `.trellis/scripts/`.
- **Platform files**: `.claude/`, `.codex/`, `.cursor/`, `.opencode/`, `.kiro/`, `.gemini/`, `.qoder/`, `.codebuddy/`, `.github/`, `.factory/`, `.pi/`, `.kilocode/`, `.agent/`, `.windsurf/`, and similar directories.

Platform files do not store business state. They let the corresponding AI tool read Trellis state, call Trellis scripts, and load Trellis skills/agents/hooks.

## Platform File Categories

| Category | Common paths | Purpose |
| --- | --- | --- |
| settings/config | `.claude/settings.json`, `.codex/hooks.json`, `.qoder/settings.json` | Register hooks, plugins, extensions, or platform behavior. |
| hooks/plugins/extensions | `.claude/hooks/`, `.opencode/plugins/`, `.pi/extensions/` | Inject context at session start, user input, agent startup, shell execution, and similar events. |
| agents | `.claude/agents/`, `.codex/agents/`, `.kiro/agents/` | Define `trellis-research`, `trellis-implement`, and `trellis-check`. |
| skills | `.claude/skills/`, `.agents/skills/`, `.qoder/skills/` | Capability descriptions that auto-trigger or can be read on demand. |
| commands/prompts/workflows | `.cursor/commands/`, `.github/prompts/`, `.windsurf/workflows/` | Entry points explicitly invoked by the user. |

## Three Platform Integration Modes

### 1. Hook / Extension Driven

These platforms can trigger scripts or plugins on specific events and actively inject Trellis context into AI.

Common capabilities:

- session-start injection of a `.trellis/` overview.
- workflow-state hints for each user turn.
- PRD/spec/research injection when sub-agents start.
- Shell commands inheriting session identity.

To change "when the AI knows what," inspect hooks/plugins/extensions and settings first.

### 2. Agent Prelude / Pull-Based

Some platforms cannot reliably let hooks rewrite sub-agent prompts, so the agent file itself instructs the agent to read the active task, PRD, and JSONL context after startup.

To change how sub-agents load context, inspect the agent files themselves.

### 3. Main-Session Workflow

Some platforms do not have Trellis sub-agent or hook capabilities. They rely on workflows/skills/commands to guide the main-session AI to read files, run scripts, and move tasks forward.

To change behavior, inspect platform workflows/skills/commands and `.trellis/workflow.md`.

## Local Modification Order

When the user asks to customize behavior for a platform, the AI should inspect files in this order:

1. Read `.trellis/workflow.md` to confirm the shared flow.
2. Read the target platform's settings/config to see which hooks/agents/skills/commands are registered.
3. Read the target platform's agents/skills/commands/hooks.
4. Modify the local file closest to the user's need.
5. If the change affects the shared flow, synchronize `.trellis/workflow.md` or `.trellis/spec/`.

Do not modify only platform files and forget the shared workflow. Do not modify only `.trellis/workflow.md` and forget that platform entry points may still contain old descriptions.


--- FILE: .agents\skills\trellis-meta\references\platform-files\platform-map.md ---

# Platform File Map

This page lists common Trellis file locations in a user project by platform. Whether a platform directory exists in an actual project depends on which `trellis init --<platform>` commands the user ran.

## Matrix

| Platform | CLI flag | Main directory | Skill directory | Agent directory | Hooks/extensions |
| --- | --- | --- | --- | --- | --- |
| Claude Code | `--claude` | `.claude/` | `.claude/skills/` | `.claude/agents/` | `.claude/hooks/` + `.claude/settings.json` |
| Cursor | `--cursor` | `.cursor/` | `.cursor/skills/` | `.cursor/agents/` | `.cursor/hooks.json` + `.cursor/hooks/` |
| OpenCode | `--opencode` | `.opencode/` | `.opencode/skills/` | `.opencode/agents/` | `.opencode/plugins/` |
| Codex | `--codex` | `.codex/` | `.agents/skills/` | `.codex/agents/` | `.codex/hooks/` + `.codex/hooks.json` |
| Kilo | `--kilo` | `.kilocode/` | `.kilocode/skills/` | Usually none | `.kilocode/workflows/` |
| Kiro | `--kiro` | `.kiro/` | `.kiro/skills/` | `.kiro/agents/` | `.kiro/hooks/` |
| Gemini CLI | `--gemini` | `.gemini/` | `.agents/skills/` | `.gemini/agents/` | `.gemini/settings.json` + `.gemini/hooks/` |
| Antigravity | `--antigravity` | `.agent/` | `.agent/skills/` | Usually none | `.agent/workflows/` |
| Windsurf | `--windsurf` | `.windsurf/` | `.windsurf/skills/` | Usually none | `.windsurf/workflows/` |
| Qoder | `--qoder` | `.qoder/` | `.qoder/skills/` | `.qoder/agents/` | `.qoder/hooks/` + `.qoder/settings.json` |
| CodeBuddy | `--codebuddy` | `.codebuddy/` | `.codebuddy/skills/` | `.codebuddy/agents/` | `.codebuddy/hooks/` + `.codebuddy/settings.json` |
| GitHub Copilot | `--copilot` | `.github/` | `.github/skills/` | `.github/agents/` | `.github/copilot/hooks/` + prompts |
| Factory Droid | `--droid` | `.factory/` | `.factory/skills/` | `.factory/droids/` | `.factory/hooks/` + settings |
| Pi Agent | `--pi` | `.pi/` | `.pi/skills/` | `.pi/agents/` | `.pi/extensions/trellis/` + `.pi/settings.json` |

## Capability Groups

### Trellis Sub-Agent Support

These platforms usually have `trellis-research`, `trellis-implement`, and `trellis-check` files:

- Claude Code
- Cursor
- OpenCode
- Codex
- Kiro
- Gemini CLI
- Qoder
- CodeBuddy
- GitHub Copilot
- Factory Droid
- Pi Agent

When changing implementation/check/research behavior, look for the corresponding platform agent files first.

### Main-Session Workflow Platforms

These platforms rely more on workflows/skills to guide the main session:

- Kilo
- Antigravity
- Windsurf

When changing behavior, inspect workflows and skills first. Do not assume Trellis sub-agents exist.

### Shared `.agents/skills/`

Codex writes the shared `.agents/skills/` layer. Some tools that support agentskills.io can also read this directory. If the user wants multiple compatible tools to share one skill, consider `.agents/skills/` first, but do not assume every platform reads it.

## Decision Rules When Modifying Platform Files

1. User specified a platform: modify only that platform directory unless shared workflow/spec files must also change.
2. User says "all platforms should do this": synchronize equivalent entry points platform by platform; do not modify only one directory.
3. User only says "my AI": inspect the configuration directories that actually exist in the project and infer the current AI platform.
4. User wants project rules: prefer `.trellis/spec/` or a project-local skill.
5. User wants Trellis behavior: edit `.trellis/workflow.md` plus platform hooks/agents/skills/commands.

## When Paths Differ

Platform ecosystems change, and user projects may already be customized. If this table disagrees with local files, use the actual settings/config in the user project as authoritative:

- Check the hook that settings registers.
- Check the script that a command/prompt/workflow points to.
- Judge behavior by the read rules currently written in the agent file.

Do not delete a custom file just because it is not listed in this path table.


--- FILE: .agents\skills\trellis-meta\references\platform-files\skills-and-commands.md ---

# Skills, Commands, Prompts, And Workflows

Skills and commands are textual entry points for user interaction with Trellis. Different platforms use different names, but their core purpose is the same: tell the AI how to enter the Trellis flow when the user expresses a certain intent.

## Conceptual Differences

| Type | Trigger mode | Best for |
| --- | --- | --- |
| skill | AI auto-match or explicit user mention | Long-term capabilities, workflow rules, modification guides. |
| command | Explicit user invocation | Clear operation entry points such as continue and finish-work. |
| prompt | Explicit user invocation or platform selection | Similar to command, but in a platform prompt format. |
| workflow | Explicit user selection or platform auto-match | Guides the main session when no sub-agent/hook exists. |

Trellis workflow skills usually share one semantic set: brainstorm, before-dev, check, update-spec, break-loop. Multi-file built-in skills such as `trellis-meta` use layered references.

## Common Paths

| Platform | Common entries |
| --- | --- |
| Claude Code | `.claude/skills/`, `.claude/commands/` |
| Cursor | `.cursor/skills/`, `.cursor/commands/` |
| OpenCode | `.opencode/skills/`, `.opencode/commands/` |
| Codex | `.agents/skills/`, `.codex/skills/` |
| Kilo | `.kilocode/skills/`, `.kilocode/workflows/` |
| Kiro | `.kiro/skills/` |
| Gemini CLI | `.agents/skills/`, `.gemini/commands/` |
| Antigravity | `.agent/skills/`, `.agent/workflows/` |
| Windsurf | `.windsurf/skills/`, `.windsurf/workflows/` |
| Qoder | `.qoder/skills/`, `.qoder/commands/` |
| CodeBuddy | `.codebuddy/skills/`, `.codebuddy/commands/` |
| GitHub Copilot | `.github/skills/`, `.github/prompts/` |
| Factory Droid | `.factory/skills/`, `.factory/commands/` |
| Pi Agent | `.pi/skills/` |

In a user project, use the files actually generated by init as authoritative.

## Skill Structure

A common skill is a directory:

```text
trellis-meta/
├── SKILL.md
└── references/
```

`SKILL.md` should tell the AI:

- When to use this skill.
- Which reference to read first for the current task.
- What not to do.

References hold longer explanations so the entry file does not contain everything.

## Command/Prompt/Workflow Structure

Commands, prompts, and workflows are usually single files. Their content should include:

- When to use it.
- Which `.trellis/` files to read.
- Which scripts to run.
- How to report after completion.

They should not store task state; task state belongs in `.trellis/tasks/` and `.trellis/.runtime/`.

## Local Change Scenarios

| User need | Edit location |
| --- | --- |
| Change AI auto-trigger rules | The corresponding skill's frontmatter description. |
| Change user command behavior | The corresponding command/prompt/workflow file. |
| Add a project-local skill | Platform skill directory, or shared `.agents/skills/`. |
| Let multiple platforms share one capability | Write equivalent skills in each platform skill directory, or use the `.agents/skills/` shared layer on platforms that support it. |
| Change finish/continue entry points | Platform commands/prompts/workflows. |

## Modification Principles

1. **Keep entry files short; references carry long content**. This matters especially for multi-file skills like `trellis-meta`.
2. **Make trigger descriptions specific**. A description that is too broad can mis-trigger; one that is too narrow may not trigger.
3. **Keep the same semantics consistent across platforms**. File formats can differ, but behavior descriptions should match.
4. **Put project-specific capabilities in local skills**. Do not put team-private flows into public `trellis-meta`.

If the user only wants local AI to know one more project rule, usually create a project-local skill or update `.trellis/spec/` instead of changing a Trellis built-in workflow skill.


--- FILE: .agents\skills\trellis-meta\SKILL.md ---

---
name: trellis-meta
description: "Understand and customize the local Trellis architecture inside a user project. Use when modifying .trellis plus platform hooks, settings, agents, skills, commands, prompts, or workflows generated by trellis init."
---

# Trellis Meta

This skill is for local Trellis users who have already run `trellis init` in a project. After reading it, an AI should understand the Trellis architecture, operating model, and customization entry points inside that user project, then modify the generated `.trellis/` and platform directory files according to the user's request.

The default operating scope is local files in the user project:

- `.trellis/`: workflow, config, tasks, spec, workspace, scripts, and runtime state.
- Platform directories: `.claude/`, `.codex/`, `.cursor/`, `.opencode/`, `.kiro/`, `.gemini/`, `.qoder/`, `.codebuddy/`, `.github/`, `.factory/`, `.pi/`, `.kilocode/`, `.agent/`, `.windsurf/`, and similar directories.
- Shared skill layer: `.agents/skills/`.

Do not assume the user has the Trellis source repository. Do not default to modifying the global npm install directory or `node_modules`.

## How To Use

1. Read `references/local-architecture/overview.md` first to establish the local Trellis system model.
2. If the request involves a specific AI tool, read `references/platform-files/platform-map.md` and the relevant platform file notes.
3. If the user wants to change behavior, read `references/customize-local/overview.md`, then open the specific customization topic.
4. Before editing, read the actual files in the user project and treat local content as authoritative.

## References

### Local Architecture

- `references/local-architecture/overview.md`: The three-layer local Trellis architecture and customization principles.
- `references/local-architecture/generated-files.md`: Files generated by `trellis init` and their customization boundaries.
- `references/local-architecture/workflow.md`: Phases, routing, and workflow-state blocks in `.trellis/workflow.md`.
- `references/local-architecture/task-system.md`: Task directories, active tasks, JSONL context, and task runtime.
- `references/local-architecture/spec-system.md`: How `.trellis/spec/` is organized and injected.
- `references/local-architecture/workspace-memory.md`: `.trellis/workspace/`, journals, and cross-session memory.
- `references/local-architecture/context-injection.md`: Hooks, sub-agent preludes, and context injection paths.

### Platform Files

- `references/platform-files/overview.md`: How shared `.trellis/` files relate to platform directories.
- `references/platform-files/platform-map.md`: Platform directories and paths for skills, agents, hooks, and extensions.
- `references/platform-files/hooks-and-settings.md`: How settings/config files, hooks, plugins, and extensions connect to Trellis.
- `references/platform-files/agents.md`: Local file responsibilities for `trellis-research`, `trellis-implement`, and `trellis-check`.
- `references/platform-files/skills-and-commands.md`: Differences between skills, commands, prompts, and workflows, plus how to change them.

### Local Customization

- `references/customize-local/overview.md`: Choose the right local customization entry point for the user's request.
- `references/customize-local/change-workflow.md`: Change phases, routing, next actions, and workflow-state.
- `references/customize-local/change-task-lifecycle.md`: Change task creation, status, archive behavior, and hooks.
- `references/customize-local/change-context-loading.md`: Change how tasks, specs, journals, and hook context are loaded.
- `references/customize-local/change-hooks.md`: Change platform hooks, settings, and shell session bridges.
- `references/customize-local/change-agents.md`: Change research, implement, and check agent behavior.
- `references/customize-local/change-skills-or-commands.md`: Add or modify local skills, commands, prompts, and workflows.
- `references/customize-local/change-spec-structure.md`: Adjust the project spec structure under `.trellis/spec/`.
- `references/customize-local/add-project-local-conventions.md`: Put team rules into project-local specs or local skills.

## Current Rules

- `.trellis/workflow.md` is the local workflow source of truth.
- `.trellis/config.yaml` is the project-level Trellis configuration and task hook configuration entry point.
- `.trellis/spec/` stores the user's project-specific coding conventions and design constraints.
- `.trellis/tasks/` stores task PRDs, technical notes, research files, and JSONL context.
- `.trellis/workspace/` stores developer journals and cross-session memory.
- Platform settings/config files decide which hooks, agents, skills, commands, prompts, and workflows actually run.
- `.trellis/.template-hashes.json` and `.trellis/.runtime/` are management/runtime state files. Confirm necessity before editing them.

## Do Not

- Do not treat Trellis upstream source code as the default target for local customization.
- Do not modify the global npm install directory or `node_modules/@mindfoldhq/trellis` to implement project needs.
- Do not overwrite user-modified local files with default templates.
- Do not put team-private project rules into the public `trellis-meta`; put project rules in `.trellis/spec/` or a project-local skill.
- Do not describe removed historical mechanisms as current Trellis behavior.


--- FILE: .agents\skills\trellis-spec-bootstarp\references\mcp-setup.md ---

# MCP Setup

GitNexus and ABCoder are recommended when bootstrapping Trellis specs because they expose architecture and AST context to the agent. They are tool choices, not platform requirements. Configure them through whatever MCP mechanism your agent host provides.

## GitNexus

GitNexus builds a code knowledge graph from the repository. Use it for module boundaries, execution flows, dependency relationships, blast radius, and graph queries.

### Install and Index

```bash
# Run from the repository root.
npx gitnexus analyze

# Check index status.
npx gitnexus status

# Re-index after code changes when the analysis is stale.
npx gitnexus analyze
```

The index is written to `.gitnexus/`. Keep embeddings only if the project already uses them; otherwise a normal index is enough for spec bootstrapping.

### MCP Server Command

Use this server command in the host's MCP configuration:

```bash
npx -y gitnexus mcp
```

### Useful Tools

| Tool | Purpose |
|------|---------|
| `gitnexus_query` | Find execution flows and functional areas by concept |
| `gitnexus_context` | Inspect callers, callees, references, and process participation for a symbol |
| `gitnexus_impact` | Understand blast radius before changing a symbol |
| `gitnexus_detect_changes` | Check changed symbols and affected flows before finishing |
| `gitnexus_cypher` | Run direct graph queries |
| `gitnexus_list_repos` | List indexed repositories |

## ABCoder

ABCoder parses code into UniAST and gives precise package, file, and node-level structure. Use it for signatures, type shapes, implementations, dependencies, and reverse references.

### Install

```bash
go install github.com/cloudwego/abcoder@latest
abcoder --help
```

### Parse Repositories

```bash
abcoder parse /absolute/path/to/package \
  --lang typescript \
  --name package-name \
  --output ~/abcoder-asts
```

For monorepos, parse each package with a stable `--name` so task notes can reference the same repository names.

### MCP Server Command

Use this server command in the host's MCP configuration:

```bash
abcoder mcp ~/abcoder-asts
```

### Useful Tools

| Tool | Layer | Purpose |
|------|-------|---------|
| `list_repos` | 1 | List parsed repositories |
| `get_repo_structure` | 2 | Inspect packages and files |
| `get_package_structure` | 3 | Inspect nodes within a package |
| `get_file_structure` | 3 | Inspect functions, classes, types, and signatures in a file |
| `get_ast_node` | 4 | Retrieve code, dependencies, references, and implementations |

## Verification

After configuration, verify from the agent host that both MCP servers are visible. Then run one simple query against each server before starting the spec writing pass.

```bash
ls .gitnexus/meta.json
ls ~/abcoder-asts/*.json
```


--- FILE: .agents\skills\trellis-spec-bootstarp\references\repository-analysis.md ---

# Repository Analysis

The goal is to discover the project's real architecture before writing rules. Do not start from generic spec templates and fill blanks. Start from the code, then let the spec structure follow.

## Analysis Order

1. Read the existing `.trellis/spec/` tree and note which files are templates, outdated, or already project-specific.
2. Inspect package manifests, build scripts, workspace config, and top-level documentation to identify packages and runtime layers.
3. Use GitNexus for execution flows, module clusters, dependency hubs, and impact-sensitive areas.
4. Use ABCoder or language-native tooling for exact signatures, types, class boundaries, and implementation examples.
5. Read representative source and test files directly before turning any finding into a spec rule.

## What To Capture

| Area | Questions |
|------|-----------|
| Package boundaries | What does each package own? What imports cross boundaries? |
| Runtime layers | Which code is CLI, backend, frontend, worker, shared library, test-only, or tooling? |
| Core abstractions | Which types, services, stores, commands, routes, or adapters define the system shape? |
| Data flow | Where does user input enter, how is it validated, and where does state persist? |
| Error handling | How are failures represented, logged, surfaced, and tested? |
| Configuration | Where do defaults, environment config, generated files, and templates live? |
| Tests | Which test styles are trusted examples for new work? |

## GitNexus Usage

Start broad, then inspect specific symbols:

```text
gitnexus_query({query: "CLI command execution flow"})
gitnexus_query({query: "template generation and migration"})
gitnexus_context({name: "SymbolName"})
gitnexus_cypher({query: "MATCH (n)-[r]->(m) RETURN n.name, type(r), m.name LIMIT 30"})
```

Use GitNexus results to find important files and flows. Do not quote graph output as the final authority until you have checked the relevant source files.

## ABCoder Usage

Use ABCoder when the spec needs exact code shapes:

```text
list_repos()
get_repo_structure({repo_name: "package-name"})
get_file_structure({repo_name: "package-name", file_path: "src/example.ts"})
get_ast_node({repo_name: "package-name", node_ids: [{mod_path: "...", pkg_path: "...", name: "SymbolName"}]})
```

ABCoder is most valuable for documenting constructor patterns, function signatures, type contracts, and reference chains.

## Analysis Notes

Keep short notes while analyzing. The notes should include:

- Package or layer name.
- Files that define the local pattern.
- Rules the spec should teach.
- Anti-patterns found in old code, comments, tests, or migration paths.
- Spec files that should be created, deleted, renamed, or merged.


--- FILE: .agents\skills\trellis-spec-bootstarp\references\spec-task-planning.md ---

# Spec Task Planning

Use a single agent as the default execution model. The agent may create Trellis tasks for traceability, but the skill should not require a specific platform, CLI, or parallel worker model.

## Decomposition

Create spec work units around real ownership boundaries:

- One package when a package has its own conventions.
- One layer when the same package has distinct frontend, backend, CLI, worker, or shared-library rules.
- One cross-cutting guide when a pattern spans packages and is not owned by one layer.

Avoid artificial decomposition. A small library usually needs one focused spec pass, not several tasks.

## Task Shape

When a Trellis task is useful, write a concise PRD with these sections:

```markdown
# Fill <package-or-layer> Trellis Specs

## Goal
Write project-specific `.trellis/spec/` guidance for <scope>.

## Scope
- Spec directory:
- Source directories to inspect:
- Tests to inspect:
- Out of scope:

## Architecture Context
Summarize the concrete findings from repository analysis.

## Files To Create Or Update
- `.trellis/spec/.../index.md`
- `.trellis/spec/.../<topic>.md`

## Rules
- Adapt the spec file set to the real codebase.
- Use real source examples with file paths.
- Remove template-only sections that do not apply.
- Do not modify product source code unless the task explicitly asks for it.

## Acceptance Criteria
- [ ] Specs contain concrete examples and anti-patterns from the repository.
- [ ] No placeholder text remains.
- [ ] Index files match the final spec files.
- [ ] Claims are backed by source files, tests, or project docs.
```

## Optional Helper Agents

If the host supports subagents, helpers can inspect independent packages or run verification. They are optional. The main agent still owns integration and final quality.

Helper tasks must have clear ownership:

- Read-only research tasks may inspect any source needed for the assigned scope.
- Write tasks should own disjoint spec directories.
- Verification tasks should check placeholder removal, broken links, and consistency.

Do not encode helper-agent names, vendor-specific commands, or platform-specific routing in the skill. Put only the required work and acceptance criteria in the task.


--- FILE: .agents\skills\trellis-spec-bootstarp\references\spec-writing.md ---

# Spec Writing

Trellis specs are coding guidance for future agents. They should explain how to work in this repository, not how a generic project might be organized.

## Write From Evidence

Each important rule should be backed by one of these:

- A source file that demonstrates the preferred pattern.
- A test file that shows expected behavior.
- A project document that defines the convention.
- A repeated pattern across multiple files.

Use short snippets only when they make the rule clearer. Prefer linking to the file path and naming the symbol or behavior.

## File Structure

Keep the spec tree aligned with the project:

- Keep `index.md` as the navigation file for the spec directory.
- Split topics when developers would look for them independently.
- Merge topics when separate files would repeat the same rule.
- Delete template files that do not apply.
- Add new files for important local patterns the template missed.

## Content Standards

Good spec sections include:

- When the rule applies.
- The local pattern to follow.
- The source or test files that prove the pattern.
- Common mistakes or anti-patterns.
- Verification commands or checks when they are specific and reliable.

Avoid:

- Placeholder prose.
- Generic framework advice.
- Tool instructions that only work in one agent host.
- Long copied code blocks.
- Rules based on a single accidental implementation detail.

## Example Shape

```markdown
## Command Handlers

Command handlers should keep argument parsing, validation, and side effects separate. The local pattern is:

- Parse CLI flags at the command boundary.
- Convert raw inputs into typed task options before invoking core logic.
- Keep filesystem writes in the command or service layer, not in template helpers.

Reference files:
- `packages/cli/src/commands/example.ts`
- `packages/cli/test/commands/example.test.ts`

Avoid passing raw `process.argv` or unvalidated config objects into shared helpers.
```

## Final Pass

Before finishing:

```bash
grep -R "To be filled\\|TODO: fill\\|placeholder" .trellis/spec
```

Also check links, index files, and whether any spec still describes a template rather than this repository.


--- FILE: .agents\skills\trellis-spec-bootstarp\SKILL.md ---

---
name: trellis-spec-bootstarp
description: "Bootstrap project-specific Trellis coding specs with a platform-neutral single-agent workflow. Use when creating or refreshing .trellis/spec guidelines, analyzing a codebase with GitNexus, ABCoder, or source inspection, decomposing package/layer spec work, and writing real codebase-backed spec docs without placeholder text."
---

# Trellis Spec Bootstarp

Use this skill to create or refresh `.trellis/spec/` guidelines from the real codebase. One capable agent owns the full loop: analyze the repository, choose the spec boundaries, write the docs, and verify the result. The workflow does not depend on a specific host, CLI, or agent brand.

## Workflow

1. Confirm Trellis is initialized and inspect the current `.trellis/spec/` tree.
2. Analyze the repository architecture with the best available tools: GitNexus, ABCoder, language tooling, and direct source reads.
3. Decompose the spec work by package and layer only when that reflects the actual codebase.
4. Fill or reshape the spec files with concrete patterns, file paths, examples, and anti-patterns from the project.
5. Verify that the final specs are internally consistent and contain no template placeholders.

## Reference Routing

| Need | Read |
|------|------|
| Repository architecture analysis | [references/repository-analysis.md](references/repository-analysis.md) |
| Spec work decomposition and task planning | [references/spec-task-planning.md](references/spec-task-planning.md) |
| Writing high-signal Trellis spec files | [references/spec-writing.md](references/spec-writing.md) |
| GitNexus and ABCoder MCP setup | [references/mcp-setup.md](references/mcp-setup.md) |

## Operating Rules

- Treat templates as starting points, not contracts. Delete, rename, split, or add spec files when the repository calls for it.
- Prefer source-backed rules over generic advice. Every important recommendation should point at a real file or repeated local pattern.
- Keep execution single-owner by default. Optional helper agents are an implementation detail, not a requirement or user-visible dependency.
- Do not write platform-specific instructions unless the target project already standardizes on that platform.
- Do not leave placeholder text, empty headings, or copied boilerplate in `.trellis/spec/`.

## Done Criteria

- `.trellis/spec/` describes the project as it exists now.
- Each relevant package or layer has practical coding guidance with real examples.
- Non-applicable template sections are removed.
- `index.md` files match the final spec file set.
- Any required setup or analysis assumptions are documented in the relevant spec or task notes.


--- FILE: .agents\skills\trellis-start\SKILL.md ---

---
name: trellis-start
description: "Initializes an AI development session by reading workflow guides, developer identity, git status, active tasks, and project guidelines from .trellis/. Classifies incoming tasks and routes to brainstorm, direct edit, or task workflow. Use when beginning a new coding session, resuming work, starting a new task, or re-establishing project context."
---

# Start Session

Initialize a Trellis-managed development session. This platform has no session-start hook, so manually load the equivalent compact context by following these steps.

---

## Step 1: Current state
Identity, git status, current task, active tasks, journal location.

```bash
python3 ./.trellis/scripts/get_context.py
```

If this output includes a line beginning `Trellis update available:`, copy the full line verbatim when summarizing session context. Do not shorten operational command hints.

## Step 2: Workflow overview
Compact Phase Index, request triage rules, planning artifact contract, and the step-detail command.

```bash
python3 ./.trellis/scripts/get_context.py --mode phase
```

Full guide in `.trellis/workflow.md` (read on demand).

## Step 3: Guideline indexes
Discover packages + spec layers, then read each relevant index file.

```bash
python3 ./.trellis/scripts/get_context.py --mode packages
cat .trellis/spec/guides/index.md
cat .trellis/spec/<package>/<layer>/index.md   # for each relevant layer
```

Index files list the specific guideline docs to read when you actually start coding.

## Step 4: Decide next action
From Step 1 you know the current task and status. Check the task directory:

- **Active task status `planning` + no `prd.md`** → Phase 1.1. Load the `trellis-brainstorm` skill.
- **Active task status `planning` + `prd.md` exists** → stay in Phase 1. Lightweight tasks can be PRD-only; complex tasks need `design.md` + `implement.md`. Load the relevant Phase 1 step detail before `task.py start`.
- **Active task status `in_progress`** → Phase 2 step 2.1. Load the step detail:
  ```bash
  python3 ./.trellis/scripts/get_context.py --mode phase --step 2.1 --platform codex
  ```
- **No active task** → classify first. For simple conversation / small task, ask only whether this turn should create a Trellis task. For complex work, ask whether you may create a Trellis task and enter planning. If the user says no, skip Trellis for this session.

---

## Skill routing (quick reference)

| User intent | Skill |
|---|---|
| New feature / unclear requirements | `trellis-brainstorm` |
| About to write code | `trellis-before-dev` |
| Done coding / quality check | `trellis-check` |
| Stuck / fixed same bug multiple times | `trellis-break-loop` |
| Learned something worth capturing | `trellis-update-spec` |

Full rules + anti-rationalization table in `.trellis/workflow.md`.


--- FILE: .agents\skills\trellis-update-spec\SKILL.md ---

---
name: trellis-update-spec
description: "Captures executable contracts and coding conventions into .trellis/spec/ documents. Use when learning something valuable from debugging, implementing, or discussion that should be preserved for future sessions."
---

# Update Code-Spec - Capture Executable Contracts

When you learn something valuable (from debugging, implementing, or discussion), use this to update the relevant code-spec documents.

**Timing**: After completing a task, fixing a bug, or discovering a new pattern

---

## Code-Spec First Rule (CRITICAL)

In this project, "spec" for implementation work means **code-spec**:
- Executable contracts (not principle-only text)
- Concrete signatures, payload fields, env keys, and boundary behavior
- Testable validation/error behavior

If the change touches infra or cross-layer contracts, code-spec depth is mandatory.

### Mandatory Triggers

Apply code-spec depth when the change includes any of:
- New/changed command or API signature
- Cross-layer request/response contract change
- Database schema/migration change
- Infra integration (storage, queue, cache, secrets, env wiring)

### Mandatory Output (7 Sections)

For triggered tasks, include all sections below:
1. Scope / Trigger
2. Signatures (command/API/DB)
3. Contracts (request/response/env)
4. Validation & Error Matrix
5. Good/Base/Bad Cases
6. Tests Required (with assertion points)
7. Wrong vs Correct (at least one pair)

---

## When to Update Code-Specs

| Trigger | Example | Target Spec |
|---------|---------|-------------|
| **Implemented a feature** | Added a new integration or module | Relevant spec file |
| **Made a design decision** | Chose extensibility pattern over simplicity | Relevant spec + "Design Decisions" section |
| **Fixed a bug** | Found a subtle issue with error handling | Relevant spec (e.g., error-handling docs) |
| **Discovered a pattern** | Found a better way to structure code | Relevant spec file |
| **Hit a gotcha** | Learned that X must be done before Y | Relevant spec + "Common Mistakes" section |
| **Established a convention** | Team agreed on naming pattern | Quality guidelines |
| **New thinking trigger** | "Don't forget to check X before doing Y" | `guides/*.md` (as a checklist item) |

**Key Insight**: Code-spec updates are NOT just for problems. Every feature implementation contains design decisions and contracts that future AI/developers need to execute safely.

---

## Spec Structure Overview

```
.trellis/spec/
├── <layer>/           # Per-layer coding standards (e.g., backend/, frontend/, api/)
│   ├── index.md       # Overview and links
│   └── *.md           # Topic-specific guidelines
└── guides/            # Thinking checklists (NOT coding specs!)
    ├── index.md       # Guide index
    └── *.md           # Topic-specific guides
```

### CRITICAL: Code-Spec vs Guide - Know the Difference

| Type | Location | Purpose | Content Style |
|------|----------|---------|---------------|
| **Code-Spec** | `<layer>/*.md` | Tell AI "how to implement safely" | Signatures, contracts, matrices, cases, test points |
| **Guide** | `guides/*.md` | Help AI "what to think about" | Checklists, questions, pointers to specs |

**Decision Rule**: Ask yourself:

- "This is **how to write** the code" → Put in a spec layer directory
- "This is **what to consider** before writing" → Put in `guides/`

**Example**:

| Learning | Wrong Location | Correct Location |
|----------|----------------|------------------|
| "Use API X not API Y for this task" | ❌ `guides/` (too specific for a thinking guide) | ✅ Relevant spec file (concrete convention) |
| "Remember to check X when doing Y" | ❌ Spec file (too abstract for a spec) | ✅ `guides/` (thinking checklist) |

**Guides should be short checklists that point to specs**, not duplicate the detailed rules.

---

## Update Process

### Step 1: Identify What You Learned

Answer these questions:

1. **What did you learn?** (Be specific)
2. **Why is it important?** (What problem does it prevent?)
3. **Where does it belong?** (Which spec file?)

### Step 2: Classify the Update Type

| Type | Description | Action |
|------|-------------|--------|
| **Design Decision** | Why we chose approach X over Y | Add to "Design Decisions" section |
| **Project Convention** | How we do X in this project | Add to relevant section with examples |
| **New Pattern** | A reusable approach discovered | Add to "Patterns" section |
| **Forbidden Pattern** | Something that causes problems | Add to "Anti-patterns" or "Don't" section |
| **Common Mistake** | Easy-to-make error | Add to "Common Mistakes" section |
| **Convention** | Agreed-upon standard | Add to relevant section |
| **Gotcha** | Non-obvious behavior | Add warning callout |

### Step 3: Read the Target Code-Spec

Before editing, read the current code-spec to:
- Understand existing structure
- Avoid duplicating content
- Find the right section for your update

```bash
cat .trellis/spec/<category>/<file>.md
```

### Step 4: Make the Update

Follow these principles:

1. **Be Specific**: Include concrete examples, not just abstract rules
2. **Explain Why**: State the problem this prevents
3. **Show Contracts**: Add signatures, payload fields, and error behavior
4. **Show Code**: Add code snippets for key patterns
5. **Keep it Short**: One concept per section

### Step 5: Update the Index (if needed)

If you added a new section or the code-spec status changed, update the category's `index.md`.

---

## Update Templates

### Mandatory Template for Infra/Cross-Layer Work

```markdown
## Scenario: <name>

### 1. Scope / Trigger
- Trigger: <why this requires code-spec depth>

### 2. Signatures
- Backend command/API/DB signature(s)

### 3. Contracts
- Request fields (name, type, constraints)
- Response fields (name, type, constraints)
- Environment keys (required/optional)

### 4. Validation & Error Matrix
- <condition> -> <error>

### 5. Good/Base/Bad Cases
- Good: ...
- Base: ...
- Bad: ...

### 6. Tests Required
- Unit/Integration/E2E with assertion points

### 7. Wrong vs Correct
#### Wrong
...
#### Correct
...
```

### Adding a Design Decision

```markdown
### Design Decision: [Decision Name]

**Context**: What problem were we solving?

**Options Considered**:
1. Option A - brief description
2. Option B - brief description

**Decision**: We chose Option X because...

**Example**:
\`\`\`typescript
// How it's implemented
code example
\`\`\`

**Extensibility**: How to extend this in the future...
```

### Adding a Project Convention

```markdown
### Convention: [Convention Name]

**What**: Brief description of the convention.

**Why**: Why we do it this way in this project.

**Example**:
\`\`\`typescript
// How to follow this convention
code example
\`\`\`

**Related**: Links to related conventions or specs.
```

### Adding a New Pattern

```markdown
### Pattern Name

**Problem**: What problem does this solve?

**Solution**: Brief description of the approach.

**Example**:
\`\`\`
// Good
code example

// Bad
code example
\`\`\`

**Why**: Explanation of why this works better.
```

### Adding a Forbidden Pattern

```markdown
### Don't: Pattern Name

**Problem**:
\`\`\`
// Don't do this
bad code example
\`\`\`

**Why it's bad**: Explanation of the issue.

**Instead**:
\`\`\`
// Do this instead
good code example
\`\`\`
```

### Adding a Common Mistake

```markdown
### Common Mistake: Description

**Symptom**: What goes wrong

**Cause**: Why this happens

**Fix**: How to correct it

**Prevention**: How to avoid it in the future
```

### Adding a Gotcha

```markdown
> **Warning**: Brief description of the non-obvious behavior.
>
> Details about when this happens and how to handle it.
```

---

## Interactive Mode

If you're unsure what to update, answer these prompts:

1. **What did you just finish?**
   - [ ] Fixed a bug
   - [ ] Implemented a feature
   - [ ] Refactored code
   - [ ] Had a discussion about approach

2. **What did you learn or decide?**
   - Design decision (why X over Y)
   - Project convention (how we do X)
   - Non-obvious behavior (gotcha)
   - Better approach (pattern)

3. **Would future AI/developers need to know this?**
   - To understand how the code works → Yes, update spec
   - To maintain or extend the feature → Yes, update spec
   - To avoid repeating mistakes → Yes, update spec
   - Purely one-off implementation detail → Maybe skip

4. **Which area does it relate to?**
   - [ ] Backend code
   - [ ] Frontend code
   - [ ] Cross-layer data flow
   - [ ] Code organization/reuse
   - [ ] Quality/testing

---

## Quality Checklist

Before finishing your code-spec update:

- [ ] Is the content specific and actionable?
- [ ] Did you include a code example?
- [ ] Did you explain WHY, not just WHAT?
- [ ] Did you include executable signatures/contracts?
- [ ] Did you include validation and error matrix?
- [ ] Did you include Good/Base/Bad cases?
- [ ] Did you include required tests with assertion points?
- [ ] Is it in the right code-spec file?
- [ ] Does it duplicate existing content?
- [ ] Would a new team member understand it?

---

## Relationship to Other Commands

```
Development Flow:
  Learn something → `update-spec` (Trellis command) → Knowledge captured
       ↑                                  ↓
  `break-loop` (Trellis command) ←──────────────────── Future sessions benefit
  (deep bug analysis)
```

- ``break-loop` (Trellis command)` - Analyzes bugs deeply, often reveals spec updates needed
- ``update-spec` (Trellis command)` - Actually makes the updates
- ``finish-work` (Trellis command)` - Reminds you to check if specs need updates

---

## Core Philosophy

> **Code-specs are living documents. Every debugging session, every "aha moment" is an opportunity to make the implementation contract clearer.**

The goal is **institutional memory**:
- What one person learns, everyone benefits from
- What AI learns in one session, persists to future sessions
- Mistakes become documented guardrails


--- FILE: .claude\agents\trellis-check.md ---

---
name: trellis-check
description: |
  Code quality check expert. Reviews code changes against specs and self-fixes issues.
tools: Read, Write, Edit, Bash, Glob, Grep, mcp__exa__web_search_exa, mcp__exa__get_code_context_exa
---
# Check Agent

You are the Check Agent in the Trellis workflow.

## Recursion Guard

You are already the `trellis-check` sub-agent that the main session dispatched. Do the review and fixes directly.

- Do NOT spawn another `trellis-check` or `trellis-implement` sub-agent.
- If SessionStart context, workflow-state breadcrumbs, or workflow.md say to dispatch `trellis-implement` / `trellis-check`, treat that as a main-session instruction that is already satisfied by your current role.
- Only the main session may dispatch Trellis implement/check agents. If more implementation work is needed, report that recommendation instead of spawning.

## Trellis Context Loading Protocol

Look for the `<!-- trellis-hook-injected -->` marker in your input above.

- **If the marker is present**: task artifacts, spec, and research files have already been auto-loaded for you above. Proceed with the check work directly.
- **If the marker is absent**: hook injection didn't fire (Windows + Claude Code, `--continue` resume, fork distribution, hooks disabled, etc.). Find the active task path from your dispatch prompt's first line `Active task: <path>`, then Read `<task-path>/check.jsonl`, each listed file, `<task-path>/prd.md`, `<task-path>/design.md` if present, and `<task-path>/implement.md` if present before doing the work.

## Context

Before checking, read:
- `.trellis/spec/` - Development guidelines
- Task `prd.md` - Requirements document
- Task `design.md` - Technical design (if exists)
- Task `implement.md` - Execution plan (if exists)
- Pre-commit checklist for quality standards

## Core Responsibilities

1. **Get code changes** - Use git diff to get uncommitted code
2. **Review task artifacts** - Check changes against prd.md, design.md if present, and implement.md if present
3. **Check against specs** - Verify code follows guidelines
4. **Self-fix** - Fix issues yourself, not just report them
5. **Run verification** - typecheck and lint

## Important

**Fix issues yourself**, don't just report them.

You have write and edit tools, you can modify code directly.

---

## Workflow

### Step 1: Get Changes

```bash
git diff --name-only  # List changed files
git diff              # View specific changes
```

### Step 2: Check Against Specs and Task Artifacts

Read the task's prd.md, design.md if present, and implement.md if present, then read relevant specs in `.trellis/spec/` to check code:

- Does it satisfy the task requirements
- Does it follow the technical design and implementation plan when present
- Does it follow directory structure conventions
- Does it follow naming conventions
- Does it follow code patterns
- Are there missing types
- Are there potential bugs

### Step 3: Self-Fix

After finding issues:

1. Fix the issue directly (use edit tool)
2. Record what was fixed
3. Continue checking other issues

### Step 4: Run Verification

Run project's lint and typecheck commands to verify changes.

If failed, fix issues and re-run.

---

## Report Format

```markdown
## Self-Check Complete

### Files Checked

- src/components/Feature.tsx
- src/hooks/useFeature.ts

### Issues Found and Fixed

1. `<file>:<line>` - <what was fixed>
2. `<file>:<line>` - <what was fixed>

### Issues Not Fixed

(If there are issues that cannot be self-fixed, list them here with reasons)

### Verification Results

- TypeCheck: Passed
- Lint: Passed

### Summary

Checked X files, found Y issues, all fixed.
```


--- FILE: .claude\agents\trellis-implement.md ---

---
name: trellis-implement
description: |
  Code implementation expert. Understands specs and requirements, then implements features. No git commit allowed.
tools: Read, Write, Edit, Bash, Glob, Grep, mcp__exa__web_search_exa, mcp__exa__get_code_context_exa
---
# Implement Agent

You are the Implement Agent in the Trellis workflow.

## Recursion Guard

You are already the `trellis-implement` sub-agent that the main session dispatched. Do the implementation work directly.

- Do NOT spawn another `trellis-implement` or `trellis-check` sub-agent.
- If SessionStart context, workflow-state breadcrumbs, or workflow.md say to dispatch `trellis-implement` / `trellis-check`, treat that as a main-session instruction that is already satisfied by your current role.
- Only the main session may dispatch Trellis implement/check agents. If more parallel work is needed, report that recommendation instead of spawning.

## Trellis Context Loading Protocol

Look for the `<!-- trellis-hook-injected -->` marker in your input above.

- **If the marker is present**: prd / spec / research files have already been auto-loaded for you above. Proceed with the implementation work directly.
- **If the marker is absent**: hook injection didn't fire (Windows + Claude Code, `--continue` resume, fork distribution, hooks disabled, etc.). Find the active task path from your dispatch prompt's first line `Active task: <path>`, then Read `<task-path>/implement.jsonl`, each listed file, `<task-path>/prd.md`, `<task-path>/design.md` if present, and `<task-path>/implement.md` if present before doing the work.

## Context

Before implementing, read:
- `.trellis/workflow.md` - Project workflow
- `.trellis/spec/` - Development guidelines
- Task `prd.md` - Requirements document
- Task `design.md` - Technical design (if exists)
- Task `implement.md` - Execution plan (if exists)

## Core Responsibilities

1. **Understand specs** - Read relevant spec files in `.trellis/spec/`
2. **Understand task artifacts** - Read prd.md, design.md if present, and implement.md if present
3. **Implement features** - Write code following specs and task artifacts
4. **Self-check** - Ensure code quality
5. **Report results** - Report completion status

## Forbidden Operations

**Do NOT execute these git commands:**

- `git commit`
- `git push`
- `git merge`

---

## Workflow

### 1. Understand Specs

Read relevant specs based on task type:

- Spec layers: `.trellis/spec/<package>/<layer>/`
- Shared guides: `.trellis/spec/guides/`

### 2. Understand Requirements

Read the task's prd.md, design.md if present, and implement.md if present:

- What are the core requirements
- Key points of technical design
- Implementation order, validation commands, and rollback points

### 3. Implement Features

- Write code following specs and task artifacts
- Follow existing code patterns
- Only do what's required, no over-engineering

### 4. Verify

Run project's lint and typecheck commands to verify changes.

---

## Report Format

```markdown
## Implementation Complete

### Files Modified

- `src/components/Feature.tsx` - New component
- `src/hooks/useFeature.ts` - New hook

### Implementation Summary

1. Created Feature component...
2. Added useFeature hook...

### Verification Results

- Lint: Passed
- TypeCheck: Passed
```

---

## Code Standards

- Follow existing code patterns
- Don't add unnecessary abstractions
- Only do what's required, no over-engineering
- Keep code readable


--- FILE: .claude\agents\trellis-research.md ---

---
name: trellis-research
description: |
  Code and tech search expert. Finds files, patterns, and tech solutions, and PERSISTS every finding to the current task's research/ directory. No code modifications outside that directory.
tools: Read, Write, Glob, Grep, Bash, mcp__exa__web_search_exa, mcp__exa__get_code_context_exa, Skill, mcp__chrome-devtools__*
---
# Research Agent

You are the Research Agent in the Trellis workflow.

## Core Principle

**You do one thing: find, explain, and PERSIST information.**

Conversations get compacted; files don't. Every research output MUST end up as a file under `{TASK_DIR}/research/`. Returning findings only through the chat reply is a failure — the caller cannot read them next session.

---

## Core Responsibilities

1. **Internal Search** — locate files/components, understand code logic, discover patterns (Glob, Grep, Read)
2. **External Search** — library docs, API references, best practices (web search)
3. **Persist** — write each research topic to `{TASK_DIR}/research/<topic>.md`
4. **Report** — return file paths + one-line summaries to the main agent (not full content)

---

## Workflow

### Step 1: Resolve Current Task

Run `python3 ./.trellis/scripts/task.py current --source` → active task path. If no active task is set, ask the user where to write output; do NOT guess.

Ensure `{TASK_DIR}/research/` exists:

```bash
mkdir -p <TASK_DIR>/research
```

### Step 2: Understand Search Request

Classify: internal / external / mixed. Determine scope (global / specific directory) and expected shape (file list / pattern notes / tech comparison).

### Step 3: Execute Search

Run independent searches in parallel (Glob + Grep + web) for efficiency.

### Step 4: Persist Each Topic

For each distinct research topic, Write a markdown file at `{TASK_DIR}/research/<topic-slug>.md`. Use the File Format below.

### Step 5: Report to Main Agent

Reply with ONLY:

- List of files written (paths relative to repo root)
- One-line summary per file
- Any critical caveats that the main agent needs to know right now

Do NOT paste full research content into the reply. The files are the contract.

---

## Scope Limits (Strict)

### Write ALLOWED

- `{TASK_DIR}/research/*.md` — your own output
- Creating `{TASK_DIR}/research/` if it doesn't exist (via `mkdir -p`)

### Write FORBIDDEN

- Code files (`src/`, `lib/`, …)
- Spec files (`.trellis/spec/`) — main agent should use `update-spec` skill instead
- `.trellis/scripts/`, `.trellis/workflow.md`, platform config (`.claude/`, `.cursor/`, etc.)
- Other task directories
- Any git operation (commit / push / branch / merge)

If the user asks you to edit code, decline and suggest spawning `implement` instead.

---

## File Format

Each `{TASK_DIR}/research/<topic>.md` should follow:

```markdown
# Research: <topic>

- **Query**: <original query>
- **Scope**: <internal / external / mixed>
- **Date**: <YYYY-MM-DD>

## Findings

### Files Found

| File Path | Description |
|---|---|
| `src/services/xxx.ts` | Main implementation |
| `src/types/xxx.ts` | Type definitions |

### Code Patterns

<describe patterns, cite file:line>

### External References

- [Library X docs](url) — <why relevant, version constraints>

### Related Specs

- `.trellis/spec/xxx.md` — <description>

## Caveats / Not Found

<anything incomplete or uncertain>
```

---

## Guidelines

### DO

- Provide specific file paths and line numbers
- Quote actual code snippets
- Persist every topic to its own file
- Return file paths in your reply, not the full content
- Mark "not found" explicitly when searches come up empty

### DON'T

- Don't write code or modify files outside `{TASK_DIR}/research/`
- Don't guess uncertain info
- Don't paste full research text into the reply (files are the deliverable)
- Don't propose improvements or critique implementation (that's not your role)


--- FILE: .claude\commands\trellis\continue.md ---

# Continue Current Task

Resume work on the current task — pick up at the right phase/step in `.trellis/workflow.md`.

---

## Step 1: Load Current Context

```bash
python3 ./.trellis/scripts/get_context.py
```

Confirms: current task, git state, recent commits.

## Step 2: Load the Phase Index

```bash
python3 ./.trellis/scripts/get_context.py --mode phase
```

Shows the Phase Index (Plan / Execute / Finish) with routing + skill mapping.

## Step 3: Decide Where You Are

`get_context.py` shows the active task's `status` field. Route by `status` + artifact presence. This command replaces the user needing to remember the Trellis flow; it does not itself approve implementation.

- `status=planning` + no `prd.md` → **1.1** (load `trellis-brainstorm`)
- `status=planning` + `prd.md` only → decide whether the task is lightweight or complex. Lightweight can move to **1.4** review; complex returns to **1.1** to add `design.md` + `implement.md`.
- `status=planning` + complex artifacts complete + sub-agent jsonl not curated (only the seed `_example` row) → **1.3**
- `status=planning` + required artifacts complete + required jsonl curated or inline mode → **1.4** (ask for start review; only run `task.py start` after user confirms)
- `status=in_progress` + implementation not started → **2.1**
- `status=in_progress` + implementation done, not yet checked → **2.2**
- `status=in_progress` + check passed → **3.1**
- `status=completed` (rare; usually archived immediately) → archive flow

Phase rules (full detail in `.trellis/workflow.md`):

1. Run steps **in order** within a phase — `[required]` steps must not be skipped
2. `[once]` steps are already done if the required output exists. `prd.md` alone can be enough only for lightweight tasks; complex tasks also need `design.md` and `implement.md`.
3. You may go back to an earlier phase if discoveries require it

## Step 4: Load the Specific Step

Once you know which step to resume at:

```bash
python3 ./.trellis/scripts/get_context.py --mode phase --step <X.X> --platform claude
```

Follow the loaded instructions. After each `[required]` step completes, move to the next.

---

## Reference

Full workflow and detailed phase steps live in `.trellis/workflow.md`. This command is only an entry point — the canonical guidance is there.


--- FILE: .claude\commands\trellis\finish-work.md ---

# Finish Work

Wrap up the current session: archive the active task (and any other completed-but-unarchived tasks the user wants to clean up) and record the session journal. Code commits are NOT done here — those happen in workflow Phase 3.4 before you invoke this command.

## Step 1: Survey current state

```bash
python3 ./.trellis/scripts/get_context.py --mode record
```

This prints:

- **My active tasks** — review whether any besides the current one are actually done (code merged, AC met) and should be archived this round.
- **Git status** — quick visual on what's dirty.
- **Recent commits** — you'll need their hashes in Step 4 for `--commit`.

If `--mode record` surfaces other completed tasks not tied to the current session, surface them to the user with a one-shot confirmation: "These N tasks look done — archive them too in this round? [y/N]". Default is no; the current active task is always archived in Step 3 regardless.

## Step 2: Sanity check — classify dirty paths

Run:

```bash
git status --porcelain
```

Filter out paths under `.trellis/workspace/` and `.trellis/tasks/` — those are managed by `add_session.py` and `task.py archive` auto-commits and will appear dirty as part of this skill's own work.

For each remaining dirty path, decide whether it belongs to **the current task** or to **other parallel work** (e.g., another terminal window editing the same repo). Heuristics:

- Paths referenced in the current task's `prd.md` / `implement.jsonl` / `check.jsonl` → current task
- Paths in code areas matching the task's stated scope, or that you remember editing this session → current task
- Paths in unrelated areas you have no recollection of touching this session → other parallel work

Then route:

- **Any remaining path looks like current-task work** — bail out with:
  > "Working tree has uncommitted code changes from this task: `<list>`. Return to workflow Phase 3.4 to commit them before running `/trellis:finish-work`."

  Do NOT run `git commit` here. Do NOT prompt the user to commit. The user goes back to Phase 3.4 and the AI drives the batched commit there.
- **All remaining paths look unrelated** (other parallel-window work) — report them once and continue to Step 3:
  > "FYI, dirty files outside this task's scope — leaving them for the other window: `<list>`."
- **Genuinely unsure** — ask the user once: "Are `<list>` this task's work I forgot to commit, or another window's? (commit / ignore)" — then route per their answer.

## Step 3: Archive task(s)

```bash
python3 ./.trellis/scripts/task.py archive <task-name>
```

At minimum: the current active task (if any). Plus any extra tasks the user confirmed in Step 1. Each archive produces a `chore(task): archive ...` commit via the script's auto-commit.

If there is no active task and the user did not confirm any cleanup archives, skip this step.

## Step 4: Record session journal

```bash
python3 ./.trellis/scripts/add_session.py \
  --title "Session Title" \
  --commit "hash1,hash2" \
  --summary "Brief summary"
```

Use the work-commit hashes produced in Phase 3.4 (visible in Step 1's `Recent commits` list, or via `git log --oneline`) for `--commit`. Do not include the archive commit hashes from Step 3. This produces a `chore: record journal` commit.

Final git log order: `<work commits from 3.4>` → `chore(task): archive ...` (one or more) → `chore: record journal`.


--- FILE: .claude\settings.json ---

{
  "env": {
    "CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR": "1"
  },
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup",
        "hooks": [
          {
            "type": "command",
            "command": "python3 .claude/hooks/session-start.py",
            "timeout": 30
          }
        ]
      },
      {
        "matcher": "clear",
        "hooks": [
          {
            "type": "command",
            "command": "python3 .claude/hooks/session-start.py",
            "timeout": 30
          }
        ]
      },
      {
        "matcher": "compact",
        "hooks": [
          {
            "type": "command",
            "command": "python3 .claude/hooks/session-start.py",
            "timeout": 30
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Task",
        "hooks": [
          {
            "type": "command",
            "command": "python3 .claude/hooks/inject-subagent-context.py",
            "timeout": 30
          }
        ]
      },
      {
        "matcher": "Agent",
        "hooks": [
          {
            "type": "command",
            "command": "python3 .claude/hooks/inject-subagent-context.py",
            "timeout": 30
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "python3 .claude/hooks/inject-workflow-state.py",
            "timeout": 15
          }
        ]
      }
    ]
  },
  "enabledPlugins": {}
}


--- FILE: .claude\skills\trellis-before-dev\SKILL.md ---

---
name: trellis-before-dev
description: "Discovers and injects project-specific coding guidelines from .trellis/spec/ before implementation begins. Reads spec indexes, pre-development checklists, and shared thinking guides for the target package. Use when starting a new coding task, before writing any code, switching to a different package, or needing to refresh project conventions and standards."
---

Read the relevant development guidelines before starting your task.

Execute these steps:

1. **Read current task artifacts**:
   - `prd.md` for requirements and acceptance criteria
   - `design.md` if present for technical design
   - `implement.md` if present for execution order and validation plan

2. **Discover packages and their spec layers**:
   ```bash
   python3 ./.trellis/scripts/get_context.py --mode packages
   ```

3. **Identify which specs apply** to your task based on:
   - Which package you're modifying (e.g., `cli/`, `docs-site/`)
   - What type of work (backend, frontend, unit-test, docs, etc.)
   - Any spec/research paths referenced by the task artifacts

4. **Read the spec index** for each relevant module:
   ```bash
   cat .trellis/spec/<package>/<layer>/index.md
   ```
   Follow the **"Pre-Development Checklist"** section in the index.

5. **Read the specific guideline files** listed in the Pre-Development Checklist that are relevant to your task. The index is NOT the goal — it points you to the actual guideline files (e.g., `error-handling.md`, `conventions.md`, `mock-strategies.md`). Read those files to understand the coding standards and patterns.

6. **Always read shared guides**:
   ```bash
   cat .trellis/spec/guides/index.md
   ```

7. Understand the coding standards and patterns you need to follow, then proceed with your development plan.

This step is **mandatory** before writing any code.


--- FILE: .claude\skills\trellis-brainstorm\SKILL.md ---

---
name: trellis-brainstorm
description: "Guides collaborative requirements discovery before implementation. Creates task directory, seeds PRD, asks high-value questions one at a time, researches technical choices, and converges on MVP scope. Use when requirements are unclear, there are multiple valid approaches, or the user describes a new feature or complex task."
---

# Trellis Brainstorm

## Non-Negotiable Interview Contract

Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time.

## Non-Negotiable Evidence Rule

If a question can be answered by exploring the codebase, explore the codebase instead.

This is mandatory. Before asking the user a question, first check whether the answer is already available in code, tests, configs, docs, existing specs, or task history.

Do not ask the user to confirm facts that the repository can answer. Ask only for product intent, preference, scope, risk tolerance, or decisions that remain ambiguous after inspection.

---

Use this skill during Phase 1 planning to turn the user's request into clear requirements and planning artifacts.

## Preconditions

Use this skill only after task-creation consent has been given and the user is ready to enter Trellis planning.

If no task exists yet, create one:

```bash
TASK_DIR=$(python3 ./.trellis/scripts/task.py create "<short task title>" --slug <slug>)
```

Use a concise title from the user's request. Use a slug without a date prefix. `task.py create` adds the `MM-DD-` directory prefix automatically.

`task.py create` creates the default `prd.md`. Update that file with the current understanding before asking follow-up questions.

## Planning Flow

1. Capture the user's request and initial known facts in `prd.md`.
2. Inspect available evidence before asking questions:
   - code, tests, fixtures, and configs
   - README files, docs, existing specs, and domain notes
   - related Trellis tasks, research files, and session history when present
3. Separate what you found into:
   - confirmed facts
   - product intent still needed from the user
   - scope or risk decisions still needed from the user
   - likely out-of-scope items
4. Ask the single highest-value remaining question.
5. Include your recommended answer with the question.
6. After each user answer, update `prd.md` before continuing.
7. For complex tasks, create or update `design.md` and `implement.md` before implementation starts.

Do not invent a project-specific product/spec hierarchy. If the repository already has product, domain, or spec docs, use them. If it does not, proceed with the evidence that exists.

## Question Rules

Ask only one question per message.

Each question must include:

- the decision needed
- why the answer matters
- your recommended answer
- the trade-off if the user chooses differently

Do not ask process questions such as whether to search, inspect files, or continue brainstorming. Do the evidence work directly. Ask the user only when the remaining issue is a product decision, preference, scope boundary, or risk tolerance choice.

## Artifact Rules

`prd.md` records requirements and acceptance:

- goal and user value
- confirmed facts
- requirements
- acceptance criteria
- out of scope
- open questions that still block planning

`design.md` records technical design for complex tasks:

- architecture and boundaries
- data flow and contracts
- compatibility and migration notes
- important trade-offs
- operational or rollback considerations

`implement.md` records execution planning for complex tasks:

- ordered implementation checklist
- validation commands
- risky files or rollback points
- follow-up checks before `task.py start`

Lightweight tasks may have only `prd.md`. Complex tasks must have `prd.md`, `design.md`, and `implement.md` before `task.py start`.

`implement.md` is not a replacement for `implement.jsonl`. Use JSONL files only for manifest-style spec and research references when the task needs them.

## Quality Bar

Before declaring planning ready:

- `prd.md` contains testable acceptance criteria.
- Repository-answerable questions have already been answered through inspection.
- Remaining open questions are genuinely about user intent or scope.
- Complex tasks have `design.md` and `implement.md`.
- The user has reviewed the final planning artifacts or explicitly approved proceeding.

Do not start implementation until the user approves or asks for implementation.


--- FILE: .claude\skills\trellis-break-loop\SKILL.md ---

---
name: trellis-break-loop
description: "Deep bug analysis to break the fix-forget-repeat cycle. Analyzes root cause category, why fixes failed, prevention mechanisms, and captures knowledge into specs. Use after fixing a bug to prevent the same class of bugs."
---

# Break the Loop - Deep Bug Analysis

When debug is complete, use this for deep analysis to break the "fix bug -> forget -> repeat" cycle.

---

## Analysis Framework

Analyze the bug you just fixed from these 5 dimensions:

### 1. Root Cause Category

Which category does this bug belong to?

| Category | Characteristics | Example |
|----------|-----------------|---------|
| **A. Missing Spec** | No documentation on how to do it | New feature without checklist |
| **B. Cross-Layer Contract** | Interface between layers unclear | API returns different format than expected |
| **C. Change Propagation Failure** | Changed one place, missed others | Changed function signature, missed call sites |
| **D. Test Coverage Gap** | Unit test passes, integration fails | Works alone, breaks when combined |
| **E. Implicit Assumption** | Code relies on undocumented assumption | Timestamp seconds vs milliseconds |

### 2. Why Fixes Failed (if applicable)

If you tried multiple fixes before succeeding, analyze each failure:

- **Surface Fix**: Fixed symptom, not root cause
- **Incomplete Scope**: Found root cause, didn't cover all cases
- **Tool Limitation**: grep missed it, type check wasn't strict
- **Mental Model**: Kept looking in same layer, didn't think cross-layer

### 3. Prevention Mechanisms

What mechanisms would prevent this from happening again?

| Type | Description | Example |
|------|-------------|---------|
| **Documentation** | Write it down so people know | Update thinking guide |
| **Architecture** | Make the error impossible structurally | Type-safe wrappers |
| **Compile-time** | Strict type checking, no escape hatches | Signature change causes compile error |
| **Runtime** | Monitoring, alerts, scans | Detect orphan entities |
| **Test Coverage** | E2E tests, integration tests | Verify full flow |
| **Code Review** | Checklist, PR template | "Did you check X?" |

### 4. Systematic Expansion

What broader problems does this bug reveal?

- **Similar Issues**: Where else might this problem exist?
- **Design Flaw**: Is there a fundamental architecture issue?
- **Process Flaw**: Is there a development process improvement?
- **Knowledge Gap**: Is the team missing some understanding?

### 5. Knowledge Capture

Solidify insights into the system:

- [ ] Update `.trellis/spec/guides/` thinking guides
- [ ] Update relevant `.trellis/spec/` docs
- [ ] Create issue record (if applicable)
- [ ] Create feature ticket for root fix
- [ ] Update check guidelines if needed

---

## Output Format

Please output analysis in this format:

```markdown
## Bug Analysis: [Short Description]

### 1. Root Cause Category
- **Category**: [A/B/C/D/E] - [Category Name]
- **Specific Cause**: [Detailed description]

### 2. Why Fixes Failed (if applicable)
1. [First attempt]: [Why it failed]
2. [Second attempt]: [Why it failed]
...

### 3. Prevention Mechanisms
| Priority | Mechanism | Specific Action | Status |
|----------|-----------|-----------------|--------|
| P0 | ... | ... | TODO/DONE |

### 4. Systematic Expansion
- **Similar Issues**: [List places with similar problems]
- **Design Improvement**: [Architecture-level suggestions]
- **Process Improvement**: [Development process suggestions]

### 5. Knowledge Capture
- [ ] [Documents to update / tickets to create]
```

---

## Core Philosophy

> **The value of debugging is not in fixing the bug, but in making this class of bugs never happen again.**

Three levels of insight:
1. **Tactical**: How to fix THIS bug
2. **Strategic**: How to prevent THIS CLASS of bugs
3. **Philosophical**: How to expand thinking patterns

30 minutes of analysis saves 30 hours of future debugging.

---

## After Analysis: Immediate Actions

**IMPORTANT**: After completing the analysis above, you MUST immediately:

1. **Update spec/guides** - Don't just list TODOs, actually update the relevant files:
   - If it's a cross-platform issue → update `cross-platform-thinking-guide.md`
   - If it's a cross-layer issue → update `cross-layer-thinking-guide.md`
   - If it's a code reuse issue → update `code-reuse-thinking-guide.md`
   - If it's domain-specific → update `backend/*.md` or `frontend/*.md`

2. **Sync templates** - After updating `.trellis/spec/`, sync to `src/templates/markdown/spec/`

3. **Commit the spec updates** - This is the primary output, not just the analysis text

> **The analysis is worthless if it stays in chat. The value is in the updated specs.**


--- FILE: .claude\skills\trellis-check\SKILL.md ---

---
name: trellis-check
description: "Comprehensive quality verification: spec compliance, lint, type-check, tests, cross-layer data flow, code reuse, and consistency checks. Use when code is written and needs quality verification, before committing changes, or to catch context drift during long sessions."
---

# Code Quality Check

Comprehensive quality verification for recently written code. Combines spec compliance, cross-layer safety, and pre-commit checks.

---

## Step 1: Identify What Changed

```bash
git diff --name-only HEAD
git status
```

## Step 2: Read Task Artifacts and Applicable Specs

Read the current task artifacts in order:

- `prd.md`
- `design.md` if present
- `implement.md` if present

```bash
python3 ./.trellis/scripts/get_context.py --mode packages
```

For each changed package/layer, read the spec index and follow its **Quality Check** section:

```bash
cat .trellis/spec/<package>/<layer>/index.md
```

Read the specific guideline files referenced — the index is a pointer, not the goal.

## Step 3: Run Project Checks

Run the project's lint, type-check, and test commands. Fix any failures before proceeding.

## Step 4: Review Against Checklist

### Code Quality

- [ ] Linter passes?
- [ ] Type checker passes (if applicable)?
- [ ] Tests pass?
- [ ] No debug logging left in?
- [ ] No suppressed warnings or type-safety bypasses?

### Test Coverage

- [ ] New function → unit test added?
- [ ] Bug fix → regression test added?
- [ ] Changed behavior → existing tests updated?

### Spec Sync

- [ ] Does `.trellis/spec/` need updates? (new patterns, conventions, lessons learned)

> "If I fixed a bug or discovered something non-obvious, should I document it so future me won't hit the same issue?" → If YES, update the relevant spec doc.

## Step 5: Cross-Layer Dimensions (if applicable)

Skip this step if your change is confined to a single layer.

### A. Data Flow (changes touch 3+ layers)

- [ ] Read flow traces correctly: Storage → Service → API → UI
- [ ] Write flow traces correctly: UI → API → Service → Storage
- [ ] Types/schemas correctly passed between layers?
- [ ] Errors properly propagated to caller?

### B. Code Reuse (modifying constants, creating utilities)

- [ ] Searched for existing similar code before creating new?
  ```bash
  grep -r "pattern" src/
  ```
- [ ] If 2+ places define same value → extracted to shared constant?
- [ ] After batch modification, all occurrences updated?

### C. Import/Dependency (creating new files)

- [ ] Correct import paths (relative vs absolute)?
- [ ] No circular dependencies?

### D. Same-Layer Consistency

- [ ] Other places using the same concept are consistent?

---

## Step 6: Report and Fix

Report violations found and fix them directly. Re-run project checks after fixes.


--- FILE: .claude\skills\trellis-meta\references\customize-local\add-project-local-conventions.md ---

# Add Project-Local Conventions

Often the user does not need to change Trellis mechanics; they need local AI to understand their team's conventions. In that case, prefer `.trellis/spec/` or a project-local skill instead of editing `trellis-meta`.

## Where To Put Things

| Content type | Location |
| --- | --- |
| Rules code must follow | `.trellis/spec/<layer>/` |
| Cross-layer thinking methods | `.trellis/spec/guides/` |
| AI capability for a project-specific flow | Platform-local skill |
| One-off task material | `.trellis/tasks/<task>/` |
| Session summary | `.trellis/workspace/<developer>/journal-N.md` |

## Create A Project-Local Skill

If the user wants AI to know "how this project customizes Trellis," create a local skill:

```text
.claude/skills/trellis-local/
└── SKILL.md
```

Example:

```md
---
name: trellis-local
description: "Project-local Trellis customizations for this repository. Use when changing this project's Trellis workflow, hooks, local agents, or team-specific conventions."
---

# Trellis Local

## Local Scope

This skill documents this repository's Trellis customizations only.

## Custom Workflow Rules

- ...

## Local Hook Changes

- ...

## Local Agent Changes

- ...
```

For multi-platform projects, place equivalent versions in other platform skill directories, or use `.agents/skills/` for platforms that support the shared layer.

## Write To `.trellis/spec/`

If the content is a coding convention, write it to spec. Examples:

```text
.trellis/spec/backend/error-handling.md
.trellis/spec/frontend/components.md
.trellis/spec/guides/cross-platform-thinking-guide.md
```

After writing it, update the corresponding `index.md` so AI can find the new rule from the entry point.

## Make The Current Task Use New Conventions

After writing a spec, add it to the current task context:

```bash
python3 ./.trellis/scripts/task.py add-context <task> implement ".trellis/spec/backend/error-handling.md" "Error handling conventions"
python3 ./.trellis/scripts/task.py add-context <task> check ".trellis/spec/backend/error-handling.md" "Review error handling"
```

## Do Not Store Project-Private Rules In `trellis-meta`

`trellis-meta` is a public skill for understanding Trellis architecture and local customization entry points. Put project-private content in:

- `.trellis/spec/`
- a project-local skill
- the current task
- workspace journal

This prevents future updates to Trellis's built-in `trellis-meta` from overwriting the team's own conventions.


--- FILE: .claude\skills\trellis-meta\references\customize-local\change-agents.md ---

# Change Local Agents

When the user wants to change `trellis-research`, `trellis-implement`, or `trellis-check` behavior, edit platform agent files in the user project.

## Read These Files First

1. Target platform agent directory
2. `.trellis/workflow.md` Phase 2 / research routing
3. Current task `prd.md`
4. Current task `implement.jsonl` / `check.jsonl`
5. Relevant hook or agent prelude

## Common Paths

| Platform | Path |
| --- | --- |
| Claude Code | `.claude/agents/trellis-*.md` |
| Cursor | `.cursor/agents/trellis-*.md` |
| OpenCode | `.opencode/agents/trellis-*.md` |
| Codex | `.codex/agents/trellis-*.toml` |
| Kiro | `.kiro/agents/trellis-*.json` |
| Gemini CLI | `.gemini/agents/trellis-*.md` |
| Qoder | `.qoder/agents/trellis-*.md` |
| CodeBuddy | `.codebuddy/agents/trellis-*.md` |
| Factory Droid | `.factory/droids/trellis-*.md` |
| Pi Agent | `.pi/agents/trellis-*.md` |

Use the actual paths in the user project as authoritative.

## Common Needs

| Need | Which agent to edit |
| --- | --- |
| Research must write files, not only reply in chat | `trellis-research` |
| Certain local specs must be read before implementation | `trellis-implement` + `implement.jsonl` configuration rules |
| Specific commands must run during checking | `trellis-check` |
| Agent must not modify certain directories | The corresponding agent's write boundary instructions |
| Agent output format must be fixed | The corresponding agent's final/reporting instructions |

## Modification Principles

1. **Preserve role boundaries**: research investigates and persists; implement writes implementation; check reviews and fixes.
2. **Do not hard-code project specs into agents**: long-term specs belong in `.trellis/spec/`; agents are responsible for reading them.
3. **Make read order explicit**: active task -> PRD -> info -> JSONL -> spec/research.
4. **Make write boundaries explicit**: which directories may be written and which may not.
5. **Synchronize across platforms**: when the user configured multiple platforms, decide whether to change only the current platform or all platform agents.

## Agent Pull Platforms

If an agent file contains a prelude for "read task/context after startup," do not remove those steps when editing. Otherwise the agent will work only from chat context and bypass Trellis's core mechanism.

## Hook Push Platforms

If context is injected by a hook, the agent file should still retain responsibility boundaries. Do not remove PRD/spec requirements from the agent just because a hook injects context.


--- FILE: .claude\skills\trellis-meta\references\customize-local\change-context-loading.md ---

# Change Local Context Loading

Context loading determines when AI reads workflow, task, spec, research, workspace, and git status. Read this page when the user says "AI does not know the current task," "the agent did not read specs," or "there is too much/too little context."

## Read These Files First

1. `.trellis/workflow.md`
2. `.trellis/scripts/get_context.py`
3. `.trellis/scripts/common/session_context.py`
4. `.trellis/scripts/common/task_context.py`
5. `.trellis/scripts/common/active_task.py`
6. Current platform hooks or agent files
7. The current task's `implement.jsonl` / `check.jsonl`

## Context Sources

| Source | Purpose |
| --- | --- |
| `.trellis/workflow.md` | Workflow and next-action hints. |
| `.trellis/tasks/<task>/prd.md` | Current task requirements. |
| `.trellis/tasks/<task>/design.md` | Complex task technical design. |
| `.trellis/tasks/<task>/implement.md` | Complex task execution plan. |
| `.trellis/tasks/<task>/implement.jsonl` | Spec/research to read before implementation. |
| `.trellis/tasks/<task>/check.jsonl` | Spec/research to read during checking. |
| `.trellis/spec/` | Project specs. |
| `.trellis/workspace/` | Session records. |
| git status | Current working tree changes. |

## Common Needs And Edit Points

| Need | Edit point |
| --- | --- |
| Inject more/less information in new sessions | `session_context.py` or the platform `session-start` hook. |
| Change hints on each user input | `[workflow-state:STATUS]` block in `.trellis/workflow.md`. The `inject-workflow-state` hook is parser-only and reads the block verbatim. |
| Agent did not read specs | Task JSONL, agent prelude, `inject-subagent-context` hook. |
| Active task is lost | `active_task.py` and platform session identity propagation. |
| Change JSONL validation rules | `task_context.py`. |

## JSONL Rules

`implement.jsonl` / `check.jsonl` are the key context loading interface:

```jsonl
{"file": ".trellis/spec/backend/index.md", "reason": "Backend conventions"}
{"file": ".trellis/tasks/04-28-x/research/api.md", "reason": "API research"}
```

Include only spec/research files. Do not put code files that will be modified into these manifests; agents read code files themselves during implementation.

## Change Session Context

If the user wants every new session to see more project state, edit:

- `.trellis/scripts/common/session_context.py`
- the corresponding platform `session-start` hook

Context cannot grow without bound. Prefer injecting indexes and paths so the AI can read detailed files on demand.

## Change Sub-Agent Context

First determine which mode the platform uses:

- hook push: edit the `inject-subagent-context` hook.
- agent pull: edit the read steps in the corresponding `trellis-implement` / `trellis-check` agent file.

In both modes, make sure the agent ultimately reads:

1. active task
2. the corresponding JSONL
3. spec/research referenced by the JSONL
4. `prd.md`
5. `design.md` if present
6. `implement.md` if present

## Troubleshooting Order

```bash
python3 ./.trellis/scripts/task.py current --source
python3 ./.trellis/scripts/task.py list-context <task>
python3 ./.trellis/scripts/task.py validate <task>
python3 ./.trellis/scripts/get_context.py --mode packages
```

Confirm the task and JSONL are correct before editing hooks/agents.


--- FILE: .claude\skills\trellis-meta\references\customize-local\change-hooks.md ---

# Change Local Hooks

Hooks are the automation layer that connects a platform to Trellis. When the user wants to change "when context is injected," "how shell commands inherit a session," or "which files are read before an agent starts," hooks are usually the edit point.

## Read These Files First

1. Target platform settings/config, such as `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json`
2. Target platform hooks directory
3. `.trellis/scripts/common/active_task.py`
4. `.trellis/scripts/common/session_context.py`
5. `.trellis/workflow.md`

## Common Hook Types

| Hook | Purpose |
| --- | --- |
| session-start | Injects a Trellis overview when a session starts, clears, or compacts. |
| workflow-state | Injects a state hint on each user input. |
| sub-agent context | Injects PRD/spec/research before an agent starts. |
| shell session bridge | Lets `task.py` commands in shell see the same session identity. |

## Modification Steps

1. Find the hook registration in settings/config.
2. Confirm the registered script path exists.
3. Read the hook script and identify inputs, outputs, and called `.trellis/scripts/`.
4. Modify hook behavior.
5. If the hook depends on workflow content, synchronize `.trellis/workflow.md`.

## Example: Change New-Session Injection Content

First find the session-start hook:

```text
.claude/settings.json
.claude/hooks/session-start.py
```

If the hook ultimately calls `.trellis/scripts/get_context.py` or `session_context.py`, editing the local script is usually more robust than hard-coding content in the hook.

## Example: Agent Did Not Read JSONL

First confirm:

```bash
python3 ./.trellis/scripts/task.py current --source
python3 ./.trellis/scripts/task.py validate <task>
```

If the task and JSONL are correct, determine whether the platform uses hook push or agent pull. For hook push, edit `inject-subagent-context`; for agent pull, edit the agent file.

## Notes

- Settings handle registration, hook scripts handle behavior; inspect both together.
- Different platforms support different hook events. Do not directly copy another platform's settings.
- Hooks should read project-local `.trellis/`; they should not depend on Trellis upstream source paths.
- Hook failures should produce visible errors so AI does not silently lose context.


--- FILE: .claude\skills\trellis-meta\references\customize-local\change-skills-or-commands.md ---

# Change Local Skills, Commands, Prompts, And Workflows

When the user wants to change AI entry points, auto-trigger rules, or explicit command behavior, edit skills, commands, prompts, or workflows in local platform directories.

## Read These Files First

1. `.trellis/workflow.md`
2. Target platform skill/command/prompt/workflow directory
3. Related agent or hook files
4. Whether project rules already exist in `.trellis/spec/`

## Which Entry Type To Choose

| Goal | Recommendation |
| --- | --- |
| AI should automatically know a capability | Add or modify a skill. |
| User wants to trigger manually with a command | Add or modify a command/prompt/workflow. |
| Team project conventions | Prefer `.trellis/spec/` or a project-local skill. |
| Change Trellis flow semantics | Synchronize `.trellis/workflow.md`. |

## Modify A Skill

A skill is usually:

```text
<skill-name>/
├── SKILL.md
└── references/
```

`SKILL.md` should be short and responsible for triggering/routing. Put long content in `references/` so AI can read it on demand.

The frontmatter description should specify when to use the skill. Example:

```yaml
description: "Use when customizing this project's deployment workflow and release checklist."
```

Do not write vague descriptions such as "helpful project skill"; they can trigger incorrectly.

## Modify A Command/Prompt/Workflow

Explicit entry points should state:

- How the user triggers it.
- Which `.trellis/` files to read.
- Which scripts to run.
- How to report after completion.

If a command only repeats workflow rules, prefer making it reference/read `.trellis/workflow.md` instead of maintaining a second copy of the flow.

## Common Paths

| Platform | Entry directories |
| --- | --- |
| Claude Code | `.claude/skills/`, `.claude/commands/` |
| Cursor | `.cursor/skills/`, `.cursor/commands/` |
| OpenCode | `.opencode/skills/`, `.opencode/commands/` |
| Codex | `.agents/skills/`, `.codex/skills/` |
| GitHub Copilot | `.github/skills/`, `.github/prompts/` |
| Kilo / Antigravity / Windsurf | workflows + skills |

## Add A Project-Local Skill

If the user wants to document team-private customizations, create a project-local skill, for example:

```text
.claude/skills/project-trellis-local/
└── SKILL.md
```

For multi-platform projects, add equivalent versions in each platform skill directory, or use `.agents/skills/` on platforms that support the shared layer.

## Notes

- Do not mix every platform's syntax into one file.
- Do not change only one platform entry point while claiming all platforms are supported.
- Do not hide long-term engineering conventions inside a command; write them to `.trellis/spec/`.


--- FILE: .claude\skills\trellis-meta\references\customize-local\change-spec-structure.md ---

# Change Local Spec Structure

When the user wants to change the engineering conventions AI follows, add new spec layers, or adjust monorepo package mapping, edit `.trellis/spec/` and `.trellis/config.yaml`.

## Read These Files First

1. `.trellis/config.yaml`
2. `.trellis/spec/`
3. `.trellis/workflow.md` planning artifact guidance and Phase 3.3
4. Current task `implement.jsonl` / `check.jsonl`

## Common Needs

| Need | Edit location |
| --- | --- |
| Add backend/frontend/docs/test spec layer | `.trellis/spec/<layer>/` or `.trellis/spec/<package>/<layer>/` |
| Add shared thinking guides | `.trellis/spec/guides/` |
| Adjust monorepo packages | `packages` in `.trellis/config.yaml` |
| Change default package | `default_package` in `.trellis/config.yaml` |
| Control spec scanning scope | `spec_scope` in `.trellis/config.yaml` |
| Make a task read a new spec | Task `implement.jsonl` / `check.jsonl` |

## Add A Spec Layer

Single-repository example:

```text
.trellis/spec/security/
├── index.md
└── auth.md
```

Monorepo example:

```text
.trellis/spec/webapp/security/
├── index.md
└── auth.md
```

`index.md` should include:

- What code this layer applies to.
- Pre-Development Checklist.
- Quality Check.
- Links to specific guideline files.

## Update Context

Adding a spec does not mean every task automatically reads it. The current task must reference it in JSONL:

```bash
python3 ./.trellis/scripts/task.py add-context <task> implement ".trellis/spec/webapp/security/index.md" "Security conventions"
python3 ./.trellis/scripts/task.py add-context <task> check ".trellis/spec/webapp/security/index.md" "Security review rules"
```

## Change Monorepo Packages

Example `.trellis/config.yaml`:

```yaml
packages:
  webapp:
    path: apps/web
  api:
    path: apps/api
default_package: webapp
```

After editing, run:

```bash
python3 ./.trellis/scripts/get_context.py --mode packages
```

Use this output to confirm AI can see the correct packages and spec layers.

## Notes

- Specs are user project conventions and can be changed according to project needs.
- Do not put temporary task information into specs; put temporary information in the task.
- Do not put long-term conventions only in agents or commands; preserve them in specs.
- After changing spec structure, check whether existing task JSONL files still point to files that exist.


--- FILE: .claude\skills\trellis-meta\references\customize-local\change-task-lifecycle.md ---

# Change Local Task Lifecycle

Task lifecycle includes creation, start, context configuration, finish, archive, parent/child tasks, and lifecycle hooks. The default customization targets are `.trellis/tasks/`, `.trellis/config.yaml`, and `.trellis/scripts/`.

## Read These Files First

1. `.trellis/workflow.md`
2. `.trellis/config.yaml`
3. `.trellis/scripts/task.py`
4. `.trellis/scripts/common/task_store.py`
5. `.trellis/scripts/common/task_utils.py`
6. The current task's `.trellis/tasks/<task>/task.json`

## Common Needs And Edit Points

| Need | Edit point |
| --- | --- |
| Automatically sync an external system after task creation | `hooks.after_create` in `.trellis/config.yaml`. |
| Automatically update status after task start | `hooks.after_start` in `.trellis/config.yaml`. |
| Run a script after task finish | `hooks.after_finish` in `.trellis/config.yaml`. |
| Clean external resources after archive | `hooks.after_archive` in `.trellis/config.yaml`. |
| Change default task fields | `.trellis/scripts/common/task_store.py`. |
| Change task parsing/search | `.trellis/scripts/common/task_utils.py`. |
| Change active task behavior | `.trellis/scripts/common/active_task.py`. |

## lifecycle hooks

`.trellis/config.yaml` supports:

```yaml
hooks:
  after_create:
    - "python3 .trellis/scripts/hooks/my_sync.py create"
  after_start:
    - "python3 .trellis/scripts/hooks/my_sync.py start"
  after_finish:
    - "python3 .trellis/scripts/hooks/my_sync.py finish"
  after_archive:
    - "python3 .trellis/scripts/hooks/my_sync.py archive"
```

Hook commands receive the `TASK_JSON_PATH` environment variable, pointing to the current task's `task.json`. Hook failures should usually warn, but not block the main task operation.

## Change Task Fields

If the user wants to add project-local fields, prefer putting them under `meta` in `task.json` to avoid breaking existing scripts' assumptions about standard fields.

Example:

```json
"meta": {
  "linearIssue": "ENG-123",
  "risk": "high"
}
```

If standard fields really need to change, inspect every local script that reads `task.json`.

## Change Active Task

Active task is session-level state stored in `.trellis/.runtime/sessions/`. Do not fall back to a global `.current-task` model. If the user wants to change active task behavior, edit:

- `.trellis/scripts/common/active_task.py`
- platform hooks or shell session bridges
- active task descriptions in `.trellis/workflow.md`

### `task.py create` Sets the Active Pointer

`cmd_create` in `.trellis/scripts/common/task_store.py` calls `set_active_task` best-effort right after writing the new task directory. The behavior:

- When the calling shell carries session identity (`TRELLIS_CONTEXT_ID` env var, or any platform-specific session env that `resolve_context_key` recognizes — see `active_task.py:_ENV_SESSION_KEYS`), the per-session pointer at `.trellis/.runtime/sessions/<context_key>.json` is rewritten to point at the new task. The task's `status=planning` and `[workflow-state:planning]` fires on the very next `UserPromptSubmit`.
- When session identity is unavailable (raw CLI invocation outside an AI session, or a platform that doesn't propagate identity to shell), the task directory is still created and `status=planning` is still written, but the active pointer is left untouched. The user can attach the task later with `task.py start <dir>` once they're back in an AI session.

This makes `[workflow-state:planning]` the live breadcrumb during the brainstorm and JSONL curation work that follows `task.py create`. The pre-R7 behavior left the breadcrumb stuck on `no_task` until `task.py start`, so the planning block was effectively dead text.

If you fork `task.py` to add a new creation path (e.g. an external import that bypasses `cmd_create`), audit whether your path also calls `set_active_task`. Without that call, your created tasks will not surface as active. The full status writer table is in `.trellis/spec/cli/backend/workflow-state-contract.md`.

## Modification Steps

1. Confirm the current task with `python3 ./.trellis/scripts/task.py current --source`.
2. Read the current task's `task.json` and confirm status and fields.
3. For configuration needs, edit `.trellis/config.yaml` first.
4. For script behavior needs, then edit `.trellis/scripts/`.
5. If the AI flow changed, synchronize `.trellis/workflow.md`.

## Do Not

- Do not directly edit `.trellis/.runtime/sessions/` to "fix" business state.
- Do not hard-code project-private fields into scripts; prefer `meta`.
- Do not default to asking the user to fork Trellis CLI.


--- FILE: .claude\skills\trellis-meta\references\customize-local\change-workflow.md ---

# Change Local Workflow

When the user wants to change Trellis phases, next-action hints, whether to create tasks, whether to use sub-agents, or when to check/wrap up, edit `.trellis/workflow.md` first.

## Read These Files First

1. `.trellis/workflow.md`
2. Entry files for the current platform, such as skills/commands/prompts/workflows
3. The current task's `task.json` and `prd.md`

## Common Needs And Edit Points

| Need | Edit point |
| --- | --- |
| Change phase names or phase order | `Phase Index` and the corresponding Phase sections. |
| Change whether to create a task when there is no task | `[workflow-state:no_task]` state block. |
| Change the next step during planning | Phase 1 and `[workflow-state:planning]`. |
| Change whether an agent is required during in_progress | Phase 2 and `[workflow-state:in_progress]`. |
| Change wrap-up after completion | Phase 3 and `[workflow-state:completed]`. |
| Change which skill a user intent triggers | `Skill Routing` table. |

## Modification Steps

1. Find the relevant section in `.trellis/workflow.md`.
2. When changing rules, keep explicit trigger conditions and next actions.
3. If adding or renaming a skill/agent, synchronize the corresponding files in platform directories.
4. Workflow-state changes only need an edit to the `[workflow-state:STATUS]` block in `.trellis/workflow.md`. The hook is parser-only — it reads whatever you put in the block. Keep the opening and closing tags' STATUS strings identical (`[workflow-state:foo]…[/workflow-state:foo]`); mismatched STATUS pairs are silently dropped.
5. Make the AI reread `.trellis/workflow.md`; do not keep using rules from the old conversation.

## Example: Relax Task Creation Requirements

To change when task creation can be skipped, usually edit `[workflow-state:no_task]`:

```md
[workflow-state:no_task]
Task is not required when the answer is a one-reply explanation, no files are changed, and no research is needed.
[/workflow-state:no_task]
```

If the formal Phase 1 flow also needs to change, synchronize the Phase 1 section.

## Example: One Platform Does Not Use Sub-Agents

If the user wants only one platform to avoid sub-agents, first confirm whether that platform has a separate group in the workflow. Then change Phase 2 routing for that platform group instead of deleting all `trellis-implement` / `trellis-check` instructions across platforms.

## `/trellis:continue` Route Table

`/trellis:continue` resumes a task by deciding which phase step to load next. The decision combines `task.json.status` with the presence of artifacts inside the task directory. The mapping is fixed in the command itself; forks that add custom statuses must extend both the workflow.md tag block and this table.

| `status` | Artifact state | Resume at |
| --- | --- | --- |
| `planning` | `prd.md` missing | Phase 1.1 (load `trellis-brainstorm`) |
| `planning` | lightweight task with `prd.md` complete | ask for start review, then run `task.py start` |
| `planning` | complex task missing `design.md` or `implement.md` | complete missing planning artifacts |
| `planning` | complex task has `prd.md`, `design.md`, and `implement.md` | ask for start review, then run `task.py start` |
| `in_progress` | no implementation in conversation history | Phase 2.1 (`trellis-implement`) |
| `in_progress` | implementation done, no `trellis-check` run | Phase 2.2 (`trellis-check`) |
| `in_progress` | check passed | Phase 3.1 (verify quality + spec update) |
| `completed` | task is still in active tree | Phase 3.5 (run `/trellis:finish-work` to archive) |

When you add a custom status (e.g. `in-review`), add a `[workflow-state:in-review]` block in `.trellis/workflow.md` for the per-turn breadcrumb AND extend this route table — usually by editing the `/trellis:continue` command file (`.{platform}/commands/trellis/continue.md` or equivalent) to add a row that decides where to resume from. Without the route entry, `/trellis:continue` will fall through to a default branch and the user will not land on the step you intended.

## Notes

`.trellis/workflow.md` is the local project workflow, not an immutable template. The user can adapt it to team habits. After editing it, platform entry files may still contain old descriptions, so inspect them too.


--- FILE: .claude\skills\trellis-meta\references\customize-local\overview.md ---

# Local Customization Overview

This directory is for local AI working in a user project where Trellis was installed through npm and `trellis init` has already been run. The AI should modify generated `.trellis/` and platform directories inside the project, not Trellis CLI upstream source code.

## First Determine What The User Actually Wants To Change

| User wording | Read first |
| --- | --- |
| "Change the Trellis flow / phases / next prompt" | `change-workflow.md` |
| "Change task creation, status, archive, or hooks" | `change-task-lifecycle.md` |
| "AI did not read context / change injected content" | `change-context-loading.md` |
| "A platform hook is not behaving as expected" | `change-hooks.md` |
| "Change implement/check/research agent behavior" | `change-agents.md` |
| "Add a skill/command/workflow/prompt" | `change-skills-or-commands.md` |
| "Adjust the project spec structure" | `change-spec-structure.md` |
| "Add team conventions and local notes" | `add-project-local-conventions.md` |

## General Operation Order

1. **Confirm platform and directories**: inspect which directories exist, such as `.claude/`, `.codex/`, `.cursor/`.
2. **Confirm the current active task**: run `python3 ./.trellis/scripts/task.py current --source`.
3. **Read the local source of truth**: prefer `.trellis/workflow.md`, `.trellis/config.yaml`, and relevant platform files.
4. **Modify narrowly**: edit only files related to the user's request.
5. **Synchronize semantics**: if a shared flow changes, check whether platform entry points also need changes; if a platform entry changes, check whether `.trellis/workflow.md` still agrees.

## Local File Priority

| Layer | Files |
| --- | --- |
| Workflow | `.trellis/workflow.md` |
| Project configuration | `.trellis/config.yaml` |
| Task material | `.trellis/tasks/<task>/` |
| Project specs | `.trellis/spec/` |
| Runtime scripts | `.trellis/scripts/` |
| Platform integration | `.claude/`, `.codex/`, `.cursor/`, `.opencode/`, and similar directories |
| Shared skill | `.agents/skills/` |

## Things Not To Do By Default

- Do not edit the global npm install directory.
- Do not edit `node_modules/@mindfoldhq/trellis`.
- Do not assume the user has the Trellis GitHub repository.
- Do not overwrite local files already modified by the user with default templates.
- Do not put team project rules into public `trellis-meta`; project rules belong in `.trellis/spec/` or a local skill.

## When To Inspect Upstream Source

Switch to an upstream source-code perspective only when the user explicitly expresses one of these goals:

- "I want to open a PR to Trellis"
- "I want to change npm package publish contents"
- "I want to fork Trellis"
- "I want to modify the generation logic for `trellis init/update`"

Otherwise, default to modifying local Trellis files inside the user project.


--- FILE: .claude\skills\trellis-meta\references\local-architecture\context-injection.md ---

# Local Context Injection System

Trellis context injection aims to make AI read the right files at the right time instead of relying on model memory. In a user project, injection is implemented by `.trellis/` scripts together with platform hooks, agents, and skills.

## Injected Context Types

| Type | Source | Purpose |
| --- | --- | --- |
| session context | `.trellis/scripts/get_context.py` | Current developer, git status, active task, active tasks, journal, packages. |
| workflow context | `.trellis/workflow.md` | Current Trellis flow and next action. |
| spec context | `.trellis/spec/` + task JSONL | Specs that must be followed during implementation/checking. |
| task context | `.trellis/tasks/<task>/prd.md`, `design.md`, `implement.md`, `research/` | Current task requirements, design, execution plan, and research. |
| platform context | Platform hooks/settings/agents | Lets different AI tools read the files above through their own mechanisms. |

## session-start

Platforms with session-start support inject a Trellis overview when a session starts, clears, compacts, or receives a similar event. Injected content usually includes:

- workflow summary.
- current task status.
- active tasks.
- spec index paths.
- developer identity and git status.

If the user feels the AI does not know the current task in a new session, first check whether the platform's session-start hook or equivalent mechanism is installed and running.

## workflow-state

workflow-state is a lightweight hint injected around each user turn. Based on current task status, it selects a block from `.trellis/workflow.md`, such as `no_task`, `planning`, `in_progress`, or `completed`.

If the user wants to change "what the AI should do next in a given state," edit the corresponding state block in `.trellis/workflow.md` first.

## sub-agent context

Implement and check agents need task context. Trellis has two loading modes:

1. **hook push**: a platform hook injects jsonl-referenced files plus `prd.md`, `design.md` if present, and `implement.md` if present before the agent starts.
2. **agent pull**: the agent definition instructs the agent to read the active task, jsonl context, and task artifacts after startup.

In both modes, JSONL files in the task directory are the manifest for spec/research context. Task artifacts are read separately in this order: `prd.md` -> `design.md if present` -> `implement.md if present`.

## JSONL Reading Rules

`implement.jsonl` and `check.jsonl` contain one JSON object per line:

```jsonl
{"file": ".trellis/spec/backend/index.md", "reason": "Backend rules"}
```

Readers should skip seed rows without a `file` field. When configuring JSONL, the AI should include only spec/research files, not pre-register code files that will be modified.

## Active Task And Context Key

Active task state lives in `.trellis/.runtime/sessions/` and is isolated per session. Hooks try to resolve the context key from platform events, environment variables, transcript paths, or `TRELLIS_CONTEXT_ID`.

If shell commands cannot see the same context key, `task.py current --source` may report no active task. In that case, check whether the platform passes session identity into the shell instead of hand-writing a global current-task file.

## Local Customization Points

| Need | Edit location |
| --- | --- |
| Change session-start injected content | The platform's `session-start` hook or plugin file. |
| Change per-turn workflow-state rules | `[workflow-state:STATUS]` block in `.trellis/workflow.md`. The platform workflow-state hook parses these blocks verbatim and embeds no fallback text. |
| Change how sub-agents read context | Platform agent definitions, the `inject-subagent-context` hook, or agent preludes. |
| Change JSONL validation/display | `.trellis/scripts/common/task_context.py`. |
| Change active task resolution | `.trellis/scripts/common/active_task.py`. |

When modifying context injection, verify two things: new sessions can see the correct task, and sub-agents can see the correct task artifacts/spec/research.


--- FILE: .claude\skills\trellis-meta\references\local-architecture\generated-files.md ---

# Local Files Generated After Init

`trellis init` writes the Trellis runtime into the user project. Later, `trellis update` tries to update Trellis-managed template files, but it uses `.trellis/.template-hashes.json` to determine which files have already been modified by the user.

This page only describes files that are visible and editable inside the user project.

## `.trellis/`

```text
.trellis/
├── workflow.md
├── config.yaml
├── .developer
├── .version
├── .template-hashes.json
├── .runtime/
├── scripts/
├── spec/
├── tasks/
└── workspace/
```

| Path | Usually editable? | Notes |
| --- | --- | --- |
| `.trellis/workflow.md` | Yes | Local workflow documentation and AI routing rules. |
| `.trellis/config.yaml` | Yes | Project configuration, hooks, packages, journal line limits, and related settings. |
| `.trellis/spec/` | Yes | Project specs, intended to be updated regularly by users and AI. |
| `.trellis/tasks/` | Yes | Task material and research artifacts, maintained by the task workflow. |
| `.trellis/workspace/` | Yes | Session records, usually written by `add_session.py`. |
| `.trellis/scripts/` | Carefully | Local runtime. It can be customized, but only after understanding the call chain. |
| `.trellis/.runtime/` | No | Runtime state, usually written automatically by hooks/scripts. |
| `.trellis/.developer` | Carefully | Current developer identity. |
| `.trellis/.version` | No | Trellis version record used by update/migration logic. |
| `.trellis/.template-hashes.json` | No | Template hash record. Do not hand-write business rules here. |

## Platform Directories

Different platforms generate different directories. Common categories:

| Category | Example paths | Purpose |
| --- | --- | --- |
| hooks | `.claude/hooks/`, `.codex/hooks/`, `.cursor/hooks/` | Inject session context, workflow-state, and sub-agent context. |
| settings | `.claude/settings.json`, `.codex/hooks.json`, `.qoder/settings.json` | Tell the platform when to run hooks or plugins. |
| agents | `.claude/agents/`, `.codex/agents/`, `.kiro/agents/` | Define agents such as `trellis-research`, `trellis-implement`, and `trellis-check`. |
| skills | `.claude/skills/`, `.agents/skills/`, `.qoder/skills/` | Skills that auto-trigger or can be read by AI. |
| commands/prompts/workflows | `.cursor/commands/`, `.github/prompts/`, `.windsurf/workflows/` | Explicit user-invoked command or workflow entry points. |

When modifying a platform directory, also confirm whether `.trellis/workflow.md` still describes the same flow.

## Meaning Of Template Hashes

`.trellis/.template-hashes.json` records the content hash from the last time Trellis wrote a template file. `trellis update` uses it to distinguish three cases:

| Case | Update behavior |
| --- | --- |
| File was not modified by the user | It can be updated automatically. |
| File was modified by the user | Prompt the user to overwrite, keep, or generate `.new`. |
| File is no longer a current template | It may be deleted, renamed, or preserved according to migration rules. |

When an AI customizes local Trellis files, it does not need to maintain hashes manually. It is normal for Trellis update to recognize the result as "modified by the user."

## Local Customization Boundaries

Editable by default:

- `.trellis/workflow.md`
- `.trellis/config.yaml`
- `.trellis/spec/**`
- `.trellis/scripts/**`
- Platform hooks, settings, agents, skills, commands, prompts, and workflows

Do not edit by default:

- Global npm install directory
- `node_modules/@mindfoldhq/trellis`
- Trellis GitHub repository source code
- Concrete state files under `.trellis/.runtime/**`
- Hash contents inside `.trellis/.template-hashes.json`

Switch to the Trellis CLI source-code perspective only when the user explicitly wants to contribute upstream.


--- FILE: .claude\skills\trellis-meta\references\local-architecture\overview.md ---

# Local Trellis Architecture Overview

`trellis-meta` is for user projects that have already run `trellis init`. The user's machine usually has only the npm-installed `trellis` command plus the Trellis files generated inside the project; it may not have the Trellis CLI source code.

Therefore, when an AI uses this skill, the default customization target is local files inside the user project:

- `.trellis/`: workflow, tasks, specs, memory, scripts, and runtime state.
- Platform directories: `.claude/`, `.codex/`, `.cursor/`, `.opencode/`, `.kiro/`, `.gemini/`, `.qoder/`, `.codebuddy/`, `.github/`, `.factory/`, `.pi/`, `.kilocode/`, `.agent/`, `.windsurf/`, and similar directories.
- Shared skill layer: `.agents/skills/`.

Do not default to guiding the user to fork the Trellis CLI repository. Treat upstream source code as the operating target only when the user explicitly says they want to change Trellis upstream source, publish an npm package, or contribute a PR.

## Local System Model

Trellis provides three layers inside a user project:

1. **Workflow layer**: `.trellis/workflow.md` defines phases, routing, next actions, and prompt blocks.
2. **Persistence layer**: `.trellis/tasks/`, `.trellis/spec/`, and `.trellis/workspace/` store tasks, specs, and session memory.
3. **Platform integration layer**: hooks, settings, agents, skills, commands, prompts, and workflows in platform directories connect the Trellis workflow to different AI tools.

All three layers live inside the user project, so an AI can read and modify them directly.

## Core Paths

| Path | Purpose |
| --- | --- |
| `.trellis/workflow.md` | Workflow phases, skill routing, and workflow-state prompt blocks. |
| `.trellis/config.yaml` | Project configuration, task lifecycle hooks, monorepo package configuration, and journal configuration. |
| `.trellis/spec/` | The user's project-specific coding conventions and thinking guides. |
| `.trellis/tasks/` | Each task's PRD, technical notes, research files, and JSONL context. |
| `.trellis/workspace/` | Per-developer journals and cross-session memory. |
| `.trellis/scripts/` | Local Python runtime used by commands, hooks, and context injection. |
| `.trellis/.runtime/` | Session-level runtime state, such as the current task pointer. |
| `.trellis/.template-hashes.json` | Template hashes for Trellis-managed files, used by update to determine whether local files were modified by the user. |

## AI Customization Principles

1. **Find the local source of truth first**: Do not edit from memory. Read `.trellis/workflow.md`, `.trellis/config.yaml`, the relevant platform directory, and related task files first.
2. **Edit the user project, not the npm package cache**: Modify generated files inside the project, not `node_modules` or the global npm install directory.
3. **Keep platform files aligned with `.trellis/`**: If workflow routing changes, also check whether platform skills or commands still describe the same flow.
4. **Put project-specific rules in `.trellis/spec/` or a local skill**: Do not put team conventions into `trellis-meta`.
5. **Preserve user changes**: If a file was already modified locally, work from the current content instead of overwriting it with a default template.

## How To Use This Directory

- To understand which files exist after init, read `generated-files.md`.
- To change phases, routing, or next actions, read `workflow.md`.
- To change the task model, JSONL context, or active task behavior, read `task-system.md`.
- To change coding convention injection, read `spec-system.md`.
- To understand journals and cross-session memory, read `workspace-memory.md`.
- To change hooks or sub-agent context loading, read `context-injection.md`.


--- FILE: .claude\skills\trellis-meta\references\local-architecture\spec-system.md ---

# Local Spec System

`.trellis/spec/` is the user's project-specific engineering spec library. Trellis is not about making AI memorize conventions; it injects relevant specs or requires the AI to read them at the right time.

## Directory Model

A common single-repository structure:

```text
.trellis/spec/
├── backend/
│   ├── index.md
│   └── ...
├── frontend/
│   ├── index.md
│   └── ...
└── guides/
    ├── index.md
    └── ...
```

A common monorepo structure:

```text
.trellis/spec/
├── cli/
│   ├── backend/
│   │   ├── index.md
│   │   └── ...
│   └── unit-test/
│       ├── index.md
│       └── ...
├── docs-site/
│   └── docs/
│       ├── index.md
│       └── ...
└── guides/
    ├── index.md
    └── ...
```

`index.md` is the entry point for each layer. It should list the Pre-Development Checklist and Quality Check. Specific guidelines live in other Markdown files in the same directory.

## Package Configuration

`.trellis/config.yaml` can declare packages:

```yaml
packages:
  cli:
    path: packages/cli
  docs-site:
    path: docs-site
    type: submodule
default_package: cli
```

The AI can run:

```bash
python3 ./.trellis/scripts/get_context.py --mode packages
```

This command lists packages and spec layers for the current project. Use this output as the reference when configuring context JSONL.

## How Specs Enter Tasks

Before a task enters implementation, planning may write relevant specs into `implement.jsonl` / `check.jsonl` when the task needs spec or research context beyond the task artifacts:

```jsonl
{"file": ".trellis/spec/cli/backend/index.md", "reason": "CLI backend conventions"}
{"file": ".trellis/spec/cli/unit-test/conventions.md", "reason": "Test expectations"}
```

Sub-agents or platform preludes read these JSONL files and load the referenced specs. On platforms without sub-agent support, the AI should read the relevant specs directly according to the workflow.

## What Specs Should Contain

Specs should contain executable engineering conventions for the project, not generic best practices:

- Where files should live.
- How error handling should be expressed.
- Input/output contracts for APIs, hooks, and commands.
- Patterns that are forbidden.
- Cases that require tests.
- Project-specific pitfalls and how to avoid them.

When the AI learns a new rule during implementation or debugging, it should update `.trellis/spec/` rather than only summarizing it in chat.

## Local Customization Points

| Need | Edit location |
| --- | --- |
| Add a new spec layer | `.trellis/spec/<package>/<layer>/index.md` and corresponding guideline files. |
| Change monorepo spec mapping | `packages` / `default_package` / `spec_scope` in `.trellis/config.yaml`. |
| Change which specs AI reads before implementation | The task's `implement.jsonl`. |
| Change which specs AI reads during checking | The task's `check.jsonl`. |
| Change when specs should be updated | Phase 3.3 in `.trellis/workflow.md` and the `trellis-update-spec` skill. |

## Boundaries

`.trellis/spec/` is the user's project specification, not a permanent copy of Trellis built-in templates. The AI should encourage the user to update it according to the actual project code instead of treating Trellis default templates as immutable documents.


--- FILE: .claude\skills\trellis-meta\references\local-architecture\task-system.md ---

# Local Task System

The Trellis task system is stored entirely under `.trellis/tasks/` in the user project. Each task is a directory containing requirements, context, research, state, and relationship information.

## Task Directory Structure

```text
.trellis/tasks/
├── 04-28-example-task/
│   ├── task.json
│   ├── prd.md
│   ├── design.md
│   ├── implement.md
│   ├── implement.jsonl
│   ├── check.jsonl
│   └── research/
└── archive/
    └── 2026-04/
```

| File | Purpose |
| --- | --- |
| `task.json` | Task metadata: status, assignee, priority, branch, parent/child tasks, and similar fields. |
| `prd.md` | Requirements, constraints, and acceptance criteria. Lightweight tasks may be PRD-only. |
| `design.md` | Technical design for complex tasks: boundaries, contracts, data flow, compatibility, tradeoffs. |
| `implement.md` | Execution plan for complex tasks: ordered checklist, validation commands, review gates, rollback points. |
| `implement.jsonl` | List of spec/research files the implement agent must read first. |
| `check.jsonl` | List of spec/research files the check agent must read first. |
| `research/` | Research artifacts. Complex findings should not live only in chat. |

## `task.json`

`task.json` records task status and metadata. Common fields:

| Field | Meaning |
| --- | --- |
| `id` / `name` / `title` | Task identity and title. |
| `status` | Status such as `planning`, `in_progress`, `review`, or `completed`. |
| `priority` | `P0`, `P1`, `P2`, `P3`. |
| `creator` / `assignee` | Creator and assignee. |
| `package` | Target package in a monorepo; may be empty. |
| `branch` / `base_branch` | Working branch and PR target branch. |
| `children` / `parent` | Parent/child task relationships. |
| `commit` / `pr_url` | Commit and PR information after completion. |
| `meta` | Extension fields. |

## Parent / Child Task Trees

Parent/child task relationships are for work structure. A parent task groups related deliverables under one source requirement set; it is not a dependency scheduler and does not replace the child task's own planning artifacts.

Use a parent task when a request has multiple independently verifiable deliverables. The parent owns:

- Source requirements and user-facing scope.
- The map of child tasks and their responsibility boundaries.
- Cross-child acceptance criteria and final integration review.

Use child tasks for deliverables that can move through planning, implementation, check, and archive independently. If one child depends on another, write that dependency in the child `prd.md` / `implement.md`; do not rely on tree position to imply ordering.

Create new children with:

```bash
python3 ./.trellis/scripts/task.py create "<child title>" --slug <child-slug> --parent <parent-dir>
```

Link or unlink existing tasks with:

```bash
python3 ./.trellis/scripts/task.py add-subtask <parent-dir> <child-dir>
python3 ./.trellis/scripts/task.py remove-subtask <parent-dir> <child-dir>
```

`children` on the parent is a historical list. When a child is archived, Trellis keeps that child name in the parent so progress like `[2/3 done]` remains meaningful after completed children move to `archive/`.

The AI should not treat phase numbers as task status. Task progress is mainly determined by `status`, artifact presence (`prd.md`, optional `design.md` / `implement.md`), whether JSONL context is configured for sub-agent mode, and the phase descriptions in `workflow.md`.

## Active Task

The user sees a "current task," but Trellis stores active task state per session.

```text
.trellis/.runtime/sessions/<context-key>.json
```

`task.py start` writes the task path into the runtime session file for the current session. `task.py current --source` shows the current task and where it came from. Different AI windows can point to different tasks without overwriting each other.

If the platform or shell environment has no stable session identity, `task.py start` may be unable to set the active task. The AI should read the error, inspect the platform hook/session environment, and not fall back to a shared global pointer.

## JSONL Context

`implement.jsonl` and `check.jsonl` are context manifests for sub-agents to read first. They do not replace `implement.md`; `implement.md` is the human-readable execution plan.

Format:

```jsonl
{"file": ".trellis/spec/cli/backend/index.md", "reason": "Backend conventions"}
{"file": ".trellis/tasks/04-28-example/research/api.md", "reason": "API research"}
```

Rules:

- Include spec and research files.
- Do not include code files that are about to be modified.
- Do not treat temporary conclusions in chat as the only context.
- Seed rows have no `file` field; they only prompt the AI to fill in real entries.

## Common Commands

```bash
python3 ./.trellis/scripts/task.py create "<title>" --slug <slug>
python3 ./.trellis/scripts/task.py start <task>
python3 ./.trellis/scripts/task.py current --source
python3 ./.trellis/scripts/task.py add-context <task> implement <file> <reason>
python3 ./.trellis/scripts/task.py validate <task>
python3 ./.trellis/scripts/task.py finish
python3 ./.trellis/scripts/task.py archive <task>
```

When modifying the task system, the AI should prefer script commands to maintain structure. Edit JSON/Markdown directly only when scripts do not cover the need.

## Local Customization Points

| Need | Edit location |
| --- | --- |
| Change the default task template | `.trellis/scripts/common/task_store.py` and task creation instructions. |
| Change status semantics | `.trellis/workflow.md`, workflow-state hook logic, and task usage conventions. |
| Add task lifecycle actions | `hooks.after_*` in `.trellis/config.yaml`. |
| Change context rules | Planning artifact guidance in `.trellis/workflow.md` and related platform agent/hook instructions. |
| Change archive policy | `.trellis/scripts/common/task_store.py` / `task_utils.py`. |

These are local files in the user project. Do not default to editing Trellis CLI source code unless the user wants to contribute upstream.


--- FILE: .claude\skills\trellis-meta\references\local-architecture\workflow.md ---

# Local Workflow System

`.trellis/workflow.md` is the Trellis workflow source of truth inside the user project. An AI does not need Trellis source code to understand how the current project should move tasks forward; this file is enough.

## File Responsibilities

`.trellis/workflow.md` has three responsibilities:

1. **Explain workflow phases**: Plan, Execute, Finish.
2. **Define skill routing**: which skill or agent the AI should use when the user expresses a certain intent.
3. **Provide workflow-state prompt blocks**: hooks can inject the prompt block for the current state into the conversation.

## Current Phase Model

```text
Phase 1: Plan    -> clarify what to build, produce prd.md and required research
Phase 2: Execute -> implement against the PRD and specs, then check
Phase 3: Finish  -> final verification, preserve lessons, and wrap up
```

Each phase contains numbered steps, such as `1.3 Configure context`. These numbers are not runtime fields in `task.json`; they are workflow structure for AI and humans to read.

## Skill Routing

`workflow.md` separates routing by platform capability:

- Platforms with sub-agent support: dispatch `trellis-implement` by default for implementation and `trellis-check` for checking.
- Platforms without sub-agent support: the main session reads skills such as `trellis-before-dev`, then executes directly.

When changing local AI behavior, update the routing descriptions in `workflow.md` first, then check whether the corresponding platform skill, command, or agent files need to stay in sync.

## Workflow-State Prompt Blocks

The bottom of `workflow.md` can contain state blocks like this:

```text
[workflow-state:no_task]
...
[/workflow-state:no_task]
```

Hooks choose the right block based on current task status and inject it into the conversation. Common states include:

| State | Meaning |
| --- | --- |
| `no_task` | The current session has no active task. |
| `planning` | The task is still in requirements, research, or context configuration. |
| `in_progress` | The task has entered implementation and checking. |
| `completed` | The task is complete and waiting for wrap-up or archive. |

If the user wants to change policies such as "whether to create a task when there is no task," "when task creation may be skipped," or "whether sub-agents are required," edit these state blocks and the routing table above them.

## Local Modification Patterns

Common changes:

| Goal | Edit point |
| --- | --- |
| Add a phase | Update the Phase Index, phase body, routing, and state blocks. |
| Change task creation policy | Update the `no_task` state block and Phase 1 description. |
| Change the default implementation/check path | Update Phase 2 and skill routing. |
| Change the wrap-up flow | Update Phase 3 and `finish-work` related descriptions. Note the current split: Phase 3.4 = AI-driven code commits (batched, user-confirmed), Phase 3.5 = `/finish-work` (archive + record session). `/finish-work` refuses to run if the working tree is dirty. |
| Change platform differences | Update routing descriptions grouped by platform. |

After editing, make the AI reread `.trellis/workflow.md`; do not assume the flow from the old conversation is still valid.

## Relationship To Platform Files

`workflow.md` is the semantic center of the local workflow, but each platform can also have its own entry files:

- skills, such as `trellis-brainstorm` and `trellis-check`.
- commands/prompts/workflows, such as continue and finish-work.
- hooks, such as session-start or workflow-state injection.

If only `workflow.md` changes, platform entry files may still contain old language. When the user wants to change "what the AI actually does," also inspect the relevant platform directory.


--- FILE: .claude\skills\trellis-meta\references\local-architecture\workspace-memory.md ---

# Local Workspace Memory System

`.trellis/workspace/` stores cross-session memory. Its purpose is to let AI and humans understand what happened before across different windows and different days.

## Directory Structure

```text
.trellis/workspace/
├── index.md
└── <developer>/
    ├── index.md
    ├── journal-1.md
    └── journal-2.md
```

| File | Purpose |
| --- | --- |
| `.trellis/.developer` | Current developer identity. |
| `.trellis/workspace/index.md` | Global workspace overview. |
| `.trellis/workspace/<developer>/index.md` | Session index for a developer. |
| `.trellis/workspace/<developer>/journal-N.md` | Session journal. |

## Developer Identity

Run this the first time:

```bash
python3 ./.trellis/scripts/init_developer.py <name>
```

This creates `.trellis/.developer` and the corresponding workspace directory. The AI should not change developer identity casually; if the identity is wrong, first confirm who is using the current project.

## Journal

`journal-N.md` records completed or partially completed work from each session. By default, each journal holds about 2000 lines; after that it rotates to the next file.

Common command for recording a session:

```bash
python3 ./.trellis/scripts/add_session.py \
  --title "Session title" \
  --summary "What changed" \
  --commit "abc1234"
```

Planning or review work without a commit can also be recorded by using `--no-commit` or an empty commit value.

## Relationship Between Workspace Memory And Tasks

| System | What it stores |
| --- | --- |
| `.trellis/tasks/` | Requirements, design, research, and state for a specific task. |
| `.trellis/workspace/` | Work records across tasks and sessions. |
| `.trellis/spec/` | Engineering knowledge preserved as long-term conventions. |

If information is only useful for the current task, put it in the task directory.  
If information describes what happened in the current session, put it in the workspace journal.  
If information should be followed every time code is written in the future, put it in spec.

## Local Customization Points

| Need | Edit location |
| --- | --- |
| Change maximum journal lines | `max_journal_lines` in `.trellis/config.yaml`. |
| Change session auto-commit message | `session_commit_message` in `.trellis/config.yaml`. |
| Change session content format | `.trellis/scripts/add_session.py`. |
| Change how workspace is displayed in context | `.trellis/scripts/common/session_context.py`. |

## AI Usage Rules

The AI should not treat workspace as the only source of truth. When resuming a task, read the current task first, then use workspace for background. After a task is complete, record important process notes in workspace; if long-term rules emerged, update spec.


--- FILE: .claude\skills\trellis-meta\references\platform-files\agents.md ---

# Agents

Trellis agent files define specialized roles. Common Trellis agents in a user project are:

- `trellis-research`
- `trellis-implement`
- `trellis-check`

File locations and formats differ by platform, but responsibility boundaries should stay consistent.

## Agent Responsibilities

| Agent | Responsibility |
| --- | --- |
| `trellis-research` | Investigate the question and write findings into the current task's `research/`. |
| `trellis-implement` | Implement against `prd.md`, optional `design.md` / `implement.md`, `implement.jsonl`, and related spec/research. |
| `trellis-check` | Review changes, fix discovered issues, and run necessary checks. |

Agent files should not become generic chat prompts. They should define input sources, write boundaries, whether code may be changed, and how results are reported.

## Common Paths

| Platform | Agent path |
| --- | --- |
| Claude Code | `.claude/agents/trellis-*.md` |
| Cursor | `.cursor/agents/trellis-*.md` |
| OpenCode | `.opencode/agents/trellis-*.md` |
| Codex | `.codex/agents/trellis-*.toml` |
| Kiro | `.kiro/agents/trellis-*.json` |
| Gemini CLI | `.gemini/agents/trellis-*.md` |
| Qoder | `.qoder/agents/trellis-*.md` |
| CodeBuddy | `.codebuddy/agents/trellis-*.md` |
| Factory Droid | `.factory/droids/trellis-*.md` |
| Pi Agent | `.pi/agents/trellis-*.md` |

GitHub Copilot agent/prompt support is provided by a combination of directories such as `.github/agents/`, `.github/prompts/`, and `.github/skills/`; inspect the files actually generated in the user project.

Main-session workflow platforms such as Kilo, Antigravity, and Windsurf may not have Trellis sub-agent files. They usually rely on workflows/skills to guide the main session.

## Two Context Loading Modes

### hook push

The platform hook injects task context before the agent starts. The agent file itself can focus more on responsibilities and boundaries.

Common on platforms that support agent hooks.

### agent pull

The agent file instructs the agent to read after startup:

- `python3 ./.trellis/scripts/task.py current --source`
- `implement.jsonl` or `check.jsonl`
- spec/research files referenced by JSONL
- current task `prd.md`
- `design.md` if present
- `implement.md` if present

This mode fits platforms whose hooks cannot reliably rewrite sub-agent prompts.

## Local Change Scenarios

| User need | Edit location |
| --- | --- |
| Implement agent must follow extra restrictions | The platform's `trellis-implement` agent file. |
| Check agent must run project-specific commands | `trellis-check` agent file, and `.trellis/spec/` if needed. |
| Research agent must output a fixed format | `trellis-research` agent file. |
| Agent cannot read task context | Agent prelude or `inject-subagent-context` hook. |
| Add a project-specific agent | Platform agent directory + related workflow/command/skill entry point. |

## Modification Principles

1. **Keep responsibilities single-purpose**. Do not mix research, implement, and check responsibilities into one agent.
2. **Specify the read order**. Agents must know to start from the active task, read jsonl/spec context, then read `prd.md`, `design.md` if present, and `implement.md` if present.
3. **Specify write boundaries**. Research usually only writes `research/`; implement can write code; check can fix issues.
4. **Keep semantics synchronized in multi-platform projects**. If the user configured Claude, Codex, and Cursor together, decide whether changes to one platform's agent also need to be applied to others.

## Do Not Default To Editing Upstream Templates

Local AI should default to modifying platform agent files inside the user project. Discuss upstream template source only when the user explicitly wants to contribute the change back to Trellis.


--- FILE: .claude\skills\trellis-meta\references\platform-files\hooks-and-settings.md ---

# Hooks And Settings

Hooks/settings are the entry layer that connects a platform to Trellis. They decide which scripts, plugins, or extensions a platform runs for which events.

## Settings Responsibilities

settings/config files usually register:

- session-start hook: injects a Trellis overview when a new session starts or context resets.
- workflow-state hook: parses `[workflow-state:STATUS]` blocks from `.trellis/workflow.md` and emits the body matching the current task `status` on each user input. Parser-only; the script does not embed fallback content.
- sub-agent context hook: injects task context when implementation/check/research agents start.
- shell/session bridge: lets shell commands see the same Trellis session identity.
- platform plugin or extension entry points.

Common files:

| Platform | settings/config |
| --- | --- |
| Claude Code | `.claude/settings.json` |
| Cursor | `.cursor/hooks.json` |
| Codex | `.codex/hooks.json`, `.codex/config.toml` |
| OpenCode | `.opencode/package.json`, `.opencode/plugins/*` |
| Kiro | `.kiro/hooks/` + platform config |
| Gemini CLI | `.gemini/settings.json` |
| Qoder | `.qoder/settings.json` |
| CodeBuddy | `.codebuddy/settings.json` |
| GitHub Copilot | `.github/copilot/hooks.json` |
| Factory Droid | `.factory/settings.json` |
| Pi Agent | `.pi/settings.json`, `.pi/extensions/trellis/` |

Whether these files exist in a project depends on which `trellis init --<platform>` flags the user ran.

## Hook Script Types

| Script | Purpose |
| --- | --- |
| `session-start.py` | Generates session-start context. |
| `inject-workflow-state.py` | Parses `[workflow-state:STATUS]` blocks in `.trellis/workflow.md` and emits the body matching the current task status. Falls back to `Refer to workflow.md for current step.` when no matching block exists. |
| `inject-subagent-context.py` | Injects PRD, JSONL context, and related spec/research into sub-agents. |
| `inject-shell-session-context.py` | Lets shell commands inherit Trellis session identity. |

Not every platform has every hook. Do not copy files from another platform just because a platform lacks a hook; first confirm whether that platform supports the corresponding event.

## Local Change Scenarios

| User need | Edit location |
| --- | --- |
| AI should see more/less context in a new session | Platform `session-start` hook. |
| Per-turn hint policy should change | `[workflow-state:STATUS]` block in `.trellis/workflow.md`. The hook parses workflow.md verbatim — no script edit required. |
| Sub-agent cannot read PRD/spec | `inject-subagent-context` hook or agent prelude. |
| `task.py current` in shell has no active task | Shell/session bridge hook or platform environment variable configuration. |
| Disable an automatic injection | The corresponding hook registration in settings/config. |

## Modification Principles

1. **Settings wire things up; hooks define behavior**. If only the hook changes, the platform may never call it. If only settings change, behavior may not change.
2. **Confirm platform event names first**. Different platforms use different names for SessionStart, UserPromptSubmit, AgentSpawn, shell execution, and similar events.
3. **Hooks read local `.trellis/`, not upstream source**. `.trellis/scripts/` and `.trellis/workflow.md` in the user project are the default targets.
4. **Errors must be visible**. Hook failures should tell the user what was not injected instead of silently leaving the AI without context.

## Troubleshooting Path

If the user says "AI did not read Trellis state":

1. Check whether the platform settings register the hook.
2. Check whether the hook file exists.
3. Manually run the `.trellis/scripts/get_context.py` or `task.py current --source` command that the hook depends on.
4. Check whether active task state exists in `.trellis/.runtime/sessions/`.
5. Check whether the platform shell passes session identity.


--- FILE: .claude\skills\trellis-meta\references\platform-files\overview.md ---

# Platform Files Overview

Trellis connects the same local architecture to different AI tools. `.trellis/` stores the shared runtime; platform directories store adapter files that define how each AI tool enters Trellis.

When a local AI modifies Trellis, it should distinguish two file categories first:

- **Shared files**: `.trellis/workflow.md`, `.trellis/tasks/`, `.trellis/spec/`, `.trellis/scripts/`.
- **Platform files**: `.claude/`, `.codex/`, `.cursor/`, `.opencode/`, `.kiro/`, `.gemini/`, `.qoder/`, `.codebuddy/`, `.github/`, `.factory/`, `.pi/`, `.kilocode/`, `.agent/`, `.windsurf/`, and similar directories.

Platform files do not store business state. They let the corresponding AI tool read Trellis state, call Trellis scripts, and load Trellis skills/agents/hooks.

## Platform File Categories

| Category | Common paths | Purpose |
| --- | --- | --- |
| settings/config | `.claude/settings.json`, `.codex/hooks.json`, `.qoder/settings.json` | Register hooks, plugins, extensions, or platform behavior. |
| hooks/plugins/extensions | `.claude/hooks/`, `.opencode/plugins/`, `.pi/extensions/` | Inject context at session start, user input, agent startup, shell execution, and similar events. |
| agents | `.claude/agents/`, `.codex/agents/`, `.kiro/agents/` | Define `trellis-research`, `trellis-implement`, and `trellis-check`. |
| skills | `.claude/skills/`, `.agents/skills/`, `.qoder/skills/` | Capability descriptions that auto-trigger or can be read on demand. |
| commands/prompts/workflows | `.cursor/commands/`, `.github/prompts/`, `.windsurf/workflows/` | Entry points explicitly invoked by the user. |

## Three Platform Integration Modes

### 1. Hook / Extension Driven

These platforms can trigger scripts or plugins on specific events and actively inject Trellis context into AI.

Common capabilities:

- session-start injection of a `.trellis/` overview.
- workflow-state hints for each user turn.
- PRD/spec/research injection when sub-agents start.
- Shell commands inheriting session identity.

To change "when the AI knows what," inspect hooks/plugins/extensions and settings first.

### 2. Agent Prelude / Pull-Based

Some platforms cannot reliably let hooks rewrite sub-agent prompts, so the agent file itself instructs the agent to read the active task, PRD, and JSONL context after startup.

To change how sub-agents load context, inspect the agent files themselves.

### 3. Main-Session Workflow

Some platforms do not have Trellis sub-agent or hook capabilities. They rely on workflows/skills/commands to guide the main-session AI to read files, run scripts, and move tasks forward.

To change behavior, inspect platform workflows/skills/commands and `.trellis/workflow.md`.

## Local Modification Order

When the user asks to customize behavior for a platform, the AI should inspect files in this order:

1. Read `.trellis/workflow.md` to confirm the shared flow.
2. Read the target platform's settings/config to see which hooks/agents/skills/commands are registered.
3. Read the target platform's agents/skills/commands/hooks.
4. Modify the local file closest to the user's need.
5. If the change affects the shared flow, synchronize `.trellis/workflow.md` or `.trellis/spec/`.

Do not modify only platform files and forget the shared workflow. Do not modify only `.trellis/workflow.md` and forget that platform entry points may still contain old descriptions.


--- FILE: .claude\skills\trellis-meta\references\platform-files\platform-map.md ---

# Platform File Map

This page lists common Trellis file locations in a user project by platform. Whether a platform directory exists in an actual project depends on which `trellis init --<platform>` commands the user ran.

## Matrix

| Platform | CLI flag | Main directory | Skill directory | Agent directory | Hooks/extensions |
| --- | --- | --- | --- | --- | --- |
| Claude Code | `--claude` | `.claude/` | `.claude/skills/` | `.claude/agents/` | `.claude/hooks/` + `.claude/settings.json` |
| Cursor | `--cursor` | `.cursor/` | `.cursor/skills/` | `.cursor/agents/` | `.cursor/hooks.json` + `.cursor/hooks/` |
| OpenCode | `--opencode` | `.opencode/` | `.opencode/skills/` | `.opencode/agents/` | `.opencode/plugins/` |
| Codex | `--codex` | `.codex/` | `.agents/skills/` | `.codex/agents/` | `.codex/hooks/` + `.codex/hooks.json` |
| Kilo | `--kilo` | `.kilocode/` | `.kilocode/skills/` | Usually none | `.kilocode/workflows/` |
| Kiro | `--kiro` | `.kiro/` | `.kiro/skills/` | `.kiro/agents/` | `.kiro/hooks/` |
| Gemini CLI | `--gemini` | `.gemini/` | `.agents/skills/` | `.gemini/agents/` | `.gemini/settings.json` + `.gemini/hooks/` |
| Antigravity | `--antigravity` | `.agent/` | `.agent/skills/` | Usually none | `.agent/workflows/` |
| Windsurf | `--windsurf` | `.windsurf/` | `.windsurf/skills/` | Usually none | `.windsurf/workflows/` |
| Qoder | `--qoder` | `.qoder/` | `.qoder/skills/` | `.qoder/agents/` | `.qoder/hooks/` + `.qoder/settings.json` |
| CodeBuddy | `--codebuddy` | `.codebuddy/` | `.codebuddy/skills/` | `.codebuddy/agents/` | `.codebuddy/hooks/` + `.codebuddy/settings.json` |
| GitHub Copilot | `--copilot` | `.github/` | `.github/skills/` | `.github/agents/` | `.github/copilot/hooks/` + prompts |
| Factory Droid | `--droid` | `.factory/` | `.factory/skills/` | `.factory/droids/` | `.factory/hooks/` + settings |
| Pi Agent | `--pi` | `.pi/` | `.pi/skills/` | `.pi/agents/` | `.pi/extensions/trellis/` + `.pi/settings.json` |

## Capability Groups

### Trellis Sub-Agent Support

These platforms usually have `trellis-research`, `trellis-implement`, and `trellis-check` files:

- Claude Code
- Cursor
- OpenCode
- Codex
- Kiro
- Gemini CLI
- Qoder
- CodeBuddy
- GitHub Copilot
- Factory Droid
- Pi Agent

When changing implementation/check/research behavior, look for the corresponding platform agent files first.

### Main-Session Workflow Platforms

These platforms rely more on workflows/skills to guide the main session:

- Kilo
- Antigravity
- Windsurf

When changing behavior, inspect workflows and skills first. Do not assume Trellis sub-agents exist.

### Shared `.agents/skills/`

Codex writes the shared `.agents/skills/` layer. Some tools that support agentskills.io can also read this directory. If the user wants multiple compatible tools to share one skill, consider `.agents/skills/` first, but do not assume every platform reads it.

## Decision Rules When Modifying Platform Files

1. User specified a platform: modify only that platform directory unless shared workflow/spec files must also change.
2. User says "all platforms should do this": synchronize equivalent entry points platform by platform; do not modify only one directory.
3. User only says "my AI": inspect the configuration directories that actually exist in the project and infer the current AI platform.
4. User wants project rules: prefer `.trellis/spec/` or a project-local skill.
5. User wants Trellis behavior: edit `.trellis/workflow.md` plus platform hooks/agents/skills/commands.

## When Paths Differ

Platform ecosystems change, and user projects may already be customized. If this table disagrees with local files, use the actual settings/config in the user project as authoritative:

- Check the hook that settings registers.
- Check the script that a command/prompt/workflow points to.
- Judge behavior by the read rules currently written in the agent file.

Do not delete a custom file just because it is not listed in this path table.


--- FILE: .claude\skills\trellis-meta\references\platform-files\skills-and-commands.md ---

# Skills, Commands, Prompts, And Workflows

Skills and commands are textual entry points for user interaction with Trellis. Different platforms use different names, but their core purpose is the same: tell the AI how to enter the Trellis flow when the user expresses a certain intent.

## Conceptual Differences

| Type | Trigger mode | Best for |
| --- | --- | --- |
| skill | AI auto-match or explicit user mention | Long-term capabilities, workflow rules, modification guides. |
| command | Explicit user invocation | Clear operation entry points such as continue and finish-work. |
| prompt | Explicit user invocation or platform selection | Similar to command, but in a platform prompt format. |
| workflow | Explicit user selection or platform auto-match | Guides the main session when no sub-agent/hook exists. |

Trellis workflow skills usually share one semantic set: brainstorm, before-dev, check, update-spec, break-loop. Multi-file built-in skills such as `trellis-meta` use layered references.

## Common Paths

| Platform | Common entries |
| --- | --- |
| Claude Code | `.claude/skills/`, `.claude/commands/` |
| Cursor | `.cursor/skills/`, `.cursor/commands/` |
| OpenCode | `.opencode/skills/`, `.opencode/commands/` |
| Codex | `.agents/skills/`, `.codex/skills/` |
| Kilo | `.kilocode/skills/`, `.kilocode/workflows/` |
| Kiro | `.kiro/skills/` |
| Gemini CLI | `.agents/skills/`, `.gemini/commands/` |
| Antigravity | `.agent/skills/`, `.agent/workflows/` |
| Windsurf | `.windsurf/skills/`, `.windsurf/workflows/` |
| Qoder | `.qoder/skills/`, `.qoder/commands/` |
| CodeBuddy | `.codebuddy/skills/`, `.codebuddy/commands/` |
| GitHub Copilot | `.github/skills/`, `.github/prompts/` |
| Factory Droid | `.factory/skills/`, `.factory/commands/` |
| Pi Agent | `.pi/skills/` |

In a user project, use the files actually generated by init as authoritative.

## Skill Structure

A common skill is a directory:

```text
trellis-meta/
├── SKILL.md
└── references/
```

`SKILL.md` should tell the AI:

- When to use this skill.
- Which reference to read first for the current task.
- What not to do.

References hold longer explanations so the entry file does not contain everything.

## Command/Prompt/Workflow Structure

Commands, prompts, and workflows are usually single files. Their content should include:

- When to use it.
- Which `.trellis/` files to read.
- Which scripts to run.
- How to report after completion.

They should not store task state; task state belongs in `.trellis/tasks/` and `.trellis/.runtime/`.

## Local Change Scenarios

| User need | Edit location |
| --- | --- |
| Change AI auto-trigger rules | The corresponding skill's frontmatter description. |
| Change user command behavior | The corresponding command/prompt/workflow file. |
| Add a project-local skill | Platform skill directory, or shared `.agents/skills/`. |
| Let multiple platforms share one capability | Write equivalent skills in each platform skill directory, or use the `.agents/skills/` shared layer on platforms that support it. |
| Change finish/continue entry points | Platform commands/prompts/workflows. |

## Modification Principles

1. **Keep entry files short; references carry long content**. This matters especially for multi-file skills like `trellis-meta`.
2. **Make trigger descriptions specific**. A description that is too broad can mis-trigger; one that is too narrow may not trigger.
3. **Keep the same semantics consistent across platforms**. File formats can differ, but behavior descriptions should match.
4. **Put project-specific capabilities in local skills**. Do not put team-private flows into public `trellis-meta`.

If the user only wants local AI to know one more project rule, usually create a project-local skill or update `.trellis/spec/` instead of changing a Trellis built-in workflow skill.


--- FILE: .claude\skills\trellis-meta\SKILL.md ---

---
name: trellis-meta
description: "Understand and customize the local Trellis architecture inside a user project. Use when modifying .trellis plus platform hooks, settings, agents, skills, commands, prompts, or workflows generated by trellis init."
---

# Trellis Meta

This skill is for local Trellis users who have already run `trellis init` in a project. After reading it, an AI should understand the Trellis architecture, operating model, and customization entry points inside that user project, then modify the generated `.trellis/` and platform directory files according to the user's request.

The default operating scope is local files in the user project:

- `.trellis/`: workflow, config, tasks, spec, workspace, scripts, and runtime state.
- Platform directories: `.claude/`, `.codex/`, `.cursor/`, `.opencode/`, `.kiro/`, `.gemini/`, `.qoder/`, `.codebuddy/`, `.github/`, `.factory/`, `.pi/`, `.kilocode/`, `.agent/`, `.windsurf/`, and similar directories.
- Shared skill layer: `.agents/skills/`.

Do not assume the user has the Trellis source repository. Do not default to modifying the global npm install directory or `node_modules`.

## How To Use

1. Read `references/local-architecture/overview.md` first to establish the local Trellis system model.
2. If the request involves a specific AI tool, read `references/platform-files/platform-map.md` and the relevant platform file notes.
3. If the user wants to change behavior, read `references/customize-local/overview.md`, then open the specific customization topic.
4. Before editing, read the actual files in the user project and treat local content as authoritative.

## References

### Local Architecture

- `references/local-architecture/overview.md`: The three-layer local Trellis architecture and customization principles.
- `references/local-architecture/generated-files.md`: Files generated by `trellis init` and their customization boundaries.
- `references/local-architecture/workflow.md`: Phases, routing, and workflow-state blocks in `.trellis/workflow.md`.
- `references/local-architecture/task-system.md`: Task directories, active tasks, JSONL context, and task runtime.
- `references/local-architecture/spec-system.md`: How `.trellis/spec/` is organized and injected.
- `references/local-architecture/workspace-memory.md`: `.trellis/workspace/`, journals, and cross-session memory.
- `references/local-architecture/context-injection.md`: Hooks, sub-agent preludes, and context injection paths.

### Platform Files

- `references/platform-files/overview.md`: How shared `.trellis/` files relate to platform directories.
- `references/platform-files/platform-map.md`: Platform directories and paths for skills, agents, hooks, and extensions.
- `references/platform-files/hooks-and-settings.md`: How settings/config files, hooks, plugins, and extensions connect to Trellis.
- `references/platform-files/agents.md`: Local file responsibilities for `trellis-research`, `trellis-implement`, and `trellis-check`.
- `references/platform-files/skills-and-commands.md`: Differences between skills, commands, prompts, and workflows, plus how to change them.

### Local Customization

- `references/customize-local/overview.md`: Choose the right local customization entry point for the user's request.
- `references/customize-local/change-workflow.md`: Change phases, routing, next actions, and workflow-state.
- `references/customize-local/change-task-lifecycle.md`: Change task creation, status, archive behavior, and hooks.
- `references/customize-local/change-context-loading.md`: Change how tasks, specs, journals, and hook context are loaded.
- `references/customize-local/change-hooks.md`: Change platform hooks, settings, and shell session bridges.
- `references/customize-local/change-agents.md`: Change research, implement, and check agent behavior.
- `references/customize-local/change-skills-or-commands.md`: Add or modify local skills, commands, prompts, and workflows.
- `references/customize-local/change-spec-structure.md`: Adjust the project spec structure under `.trellis/spec/`.
- `references/customize-local/add-project-local-conventions.md`: Put team rules into project-local specs or local skills.

## Current Rules

- `.trellis/workflow.md` is the local workflow source of truth.
- `.trellis/config.yaml` is the project-level Trellis configuration and task hook configuration entry point.
- `.trellis/spec/` stores the user's project-specific coding conventions and design constraints.
- `.trellis/tasks/` stores task PRDs, technical notes, research files, and JSONL context.
- `.trellis/workspace/` stores developer journals and cross-session memory.
- Platform settings/config files decide which hooks, agents, skills, commands, prompts, and workflows actually run.
- `.trellis/.template-hashes.json` and `.trellis/.runtime/` are management/runtime state files. Confirm necessity before editing them.

## Do Not

- Do not treat Trellis upstream source code as the default target for local customization.
- Do not modify the global npm install directory or `node_modules/@mindfoldhq/trellis` to implement project needs.
- Do not overwrite user-modified local files with default templates.
- Do not put team-private project rules into the public `trellis-meta`; put project rules in `.trellis/spec/` or a project-local skill.
- Do not describe removed historical mechanisms as current Trellis behavior.


--- FILE: .claude\skills\trellis-spec-bootstarp\references\mcp-setup.md ---

# MCP Setup

GitNexus and ABCoder are recommended when bootstrapping Trellis specs because they expose architecture and AST context to the agent. They are tool choices, not platform requirements. Configure them through whatever MCP mechanism your agent host provides.

## GitNexus

GitNexus builds a code knowledge graph from the repository. Use it for module boundaries, execution flows, dependency relationships, blast radius, and graph queries.

### Install and Index

```bash
# Run from the repository root.
npx gitnexus analyze

# Check index status.
npx gitnexus status

# Re-index after code changes when the analysis is stale.
npx gitnexus analyze
```

The index is written to `.gitnexus/`. Keep embeddings only if the project already uses them; otherwise a normal index is enough for spec bootstrapping.

### MCP Server Command

Use this server command in the host's MCP configuration:

```bash
npx -y gitnexus mcp
```

### Useful Tools

| Tool | Purpose |
|------|---------|
| `gitnexus_query` | Find execution flows and functional areas by concept |
| `gitnexus_context` | Inspect callers, callees, references, and process participation for a symbol |
| `gitnexus_impact` | Understand blast radius before changing a symbol |
| `gitnexus_detect_changes` | Check changed symbols and affected flows before finishing |
| `gitnexus_cypher` | Run direct graph queries |
| `gitnexus_list_repos` | List indexed repositories |

## ABCoder

ABCoder parses code into UniAST and gives precise package, file, and node-level structure. Use it for signatures, type shapes, implementations, dependencies, and reverse references.

### Install

```bash
go install github.com/cloudwego/abcoder@latest
abcoder --help
```

### Parse Repositories

```bash
abcoder parse /absolute/path/to/package \
  --lang typescript \
  --name package-name \
  --output ~/abcoder-asts
```

For monorepos, parse each package with a stable `--name` so task notes can reference the same repository names.

### MCP Server Command

Use this server command in the host's MCP configuration:

```bash
abcoder mcp ~/abcoder-asts
```

### Useful Tools

| Tool | Layer | Purpose |
|------|-------|---------|
| `list_repos` | 1 | List parsed repositories |
| `get_repo_structure` | 2 | Inspect packages and files |
| `get_package_structure` | 3 | Inspect nodes within a package |
| `get_file_structure` | 3 | Inspect functions, classes, types, and signatures in a file |
| `get_ast_node` | 4 | Retrieve code, dependencies, references, and implementations |

## Verification

After configuration, verify from the agent host that both MCP servers are visible. Then run one simple query against each server before starting the spec writing pass.

```bash
ls .gitnexus/meta.json
ls ~/abcoder-asts/*.json
```


--- FILE: .claude\skills\trellis-spec-bootstarp\references\repository-analysis.md ---

# Repository Analysis

The goal is to discover the project's real architecture before writing rules. Do not start from generic spec templates and fill blanks. Start from the code, then let the spec structure follow.

## Analysis Order

1. Read the existing `.trellis/spec/` tree and note which files are templates, outdated, or already project-specific.
2. Inspect package manifests, build scripts, workspace config, and top-level documentation to identify packages and runtime layers.
3. Use GitNexus for execution flows, module clusters, dependency hubs, and impact-sensitive areas.
4. Use ABCoder or language-native tooling for exact signatures, types, class boundaries, and implementation examples.
5. Read representative source and test files directly before turning any finding into a spec rule.

## What To Capture

| Area | Questions |
|------|-----------|
| Package boundaries | What does each package own? What imports cross boundaries? |
| Runtime layers | Which code is CLI, backend, frontend, worker, shared library, test-only, or tooling? |
| Core abstractions | Which types, services, stores, commands, routes, or adapters define the system shape? |
| Data flow | Where does user input enter, how is it validated, and where does state persist? |
| Error handling | How are failures represented, logged, surfaced, and tested? |
| Configuration | Where do defaults, environment config, generated files, and templates live? |
| Tests | Which test styles are trusted examples for new work? |

## GitNexus Usage

Start broad, then inspect specific symbols:

```text
gitnexus_query({query: "CLI command execution flow"})
gitnexus_query({query: "template generation and migration"})
gitnexus_context({name: "SymbolName"})
gitnexus_cypher({query: "MATCH (n)-[r]->(m) RETURN n.name, type(r), m.name LIMIT 30"})
```

Use GitNexus results to find important files and flows. Do not quote graph output as the final authority until you have checked the relevant source files.

## ABCoder Usage

Use ABCoder when the spec needs exact code shapes:

```text
list_repos()
get_repo_structure({repo_name: "package-name"})
get_file_structure({repo_name: "package-name", file_path: "src/example.ts"})
get_ast_node({repo_name: "package-name", node_ids: [{mod_path: "...", pkg_path: "...", name: "SymbolName"}]})
```

ABCoder is most valuable for documenting constructor patterns, function signatures, type contracts, and reference chains.

## Analysis Notes

Keep short notes while analyzing. The notes should include:

- Package or layer name.
- Files that define the local pattern.
- Rules the spec should teach.
- Anti-patterns found in old code, comments, tests, or migration paths.
- Spec files that should be created, deleted, renamed, or merged.


--- FILE: .claude\skills\trellis-spec-bootstarp\references\spec-task-planning.md ---

# Spec Task Planning

Use a single agent as the default execution model. The agent may create Trellis tasks for traceability, but the skill should not require a specific platform, CLI, or parallel worker model.

## Decomposition

Create spec work units around real ownership boundaries:

- One package when a package has its own conventions.
- One layer when the same package has distinct frontend, backend, CLI, worker, or shared-library rules.
- One cross-cutting guide when a pattern spans packages and is not owned by one layer.

Avoid artificial decomposition. A small library usually needs one focused spec pass, not several tasks.

## Task Shape

When a Trellis task is useful, write a concise PRD with these sections:

```markdown
# Fill <package-or-layer> Trellis Specs

## Goal
Write project-specific `.trellis/spec/` guidance for <scope>.

## Scope
- Spec directory:
- Source directories to inspect:
- Tests to inspect:
- Out of scope:

## Architecture Context
Summarize the concrete findings from repository analysis.

## Files To Create Or Update
- `.trellis/spec/.../index.md`
- `.trellis/spec/.../<topic>.md`

## Rules
- Adapt the spec file set to the real codebase.
- Use real source examples with file paths.
- Remove template-only sections that do not apply.
- Do not modify product source code unless the task explicitly asks for it.

## Acceptance Criteria
- [ ] Specs contain concrete examples and anti-patterns from the repository.
- [ ] No placeholder text remains.
- [ ] Index files match the final spec files.
- [ ] Claims are backed by source files, tests, or project docs.
```

## Optional Helper Agents

If the host supports subagents, helpers can inspect independent packages or run verification. They are optional. The main agent still owns integration and final quality.

Helper tasks must have clear ownership:

- Read-only research tasks may inspect any source needed for the assigned scope.
- Write tasks should own disjoint spec directories.
- Verification tasks should check placeholder removal, broken links, and consistency.

Do not encode helper-agent names, vendor-specific commands, or platform-specific routing in the skill. Put only the required work and acceptance criteria in the task.


--- FILE: .claude\skills\trellis-spec-bootstarp\references\spec-writing.md ---

# Spec Writing

Trellis specs are coding guidance for future agents. They should explain how to work in this repository, not how a generic project might be organized.

## Write From Evidence

Each important rule should be backed by one of these:

- A source file that demonstrates the preferred pattern.
- A test file that shows expected behavior.
- A project document that defines the convention.
- A repeated pattern across multiple files.

Use short snippets only when they make the rule clearer. Prefer linking to the file path and naming the symbol or behavior.

## File Structure

Keep the spec tree aligned with the project:

- Keep `index.md` as the navigation file for the spec directory.
- Split topics when developers would look for them independently.
- Merge topics when separate files would repeat the same rule.
- Delete template files that do not apply.
- Add new files for important local patterns the template missed.

## Content Standards

Good spec sections include:

- When the rule applies.
- The local pattern to follow.
- The source or test files that prove the pattern.
- Common mistakes or anti-patterns.
- Verification commands or checks when they are specific and reliable.

Avoid:

- Placeholder prose.
- Generic framework advice.
- Tool instructions that only work in one agent host.
- Long copied code blocks.
- Rules based on a single accidental implementation detail.

## Example Shape

```markdown
## Command Handlers

Command handlers should keep argument parsing, validation, and side effects separate. The local pattern is:

- Parse CLI flags at the command boundary.
- Convert raw inputs into typed task options before invoking core logic.
- Keep filesystem writes in the command or service layer, not in template helpers.

Reference files:
- `packages/cli/src/commands/example.ts`
- `packages/cli/test/commands/example.test.ts`

Avoid passing raw `process.argv` or unvalidated config objects into shared helpers.
```

## Final Pass

Before finishing:

```bash
grep -R "To be filled\\|TODO: fill\\|placeholder" .trellis/spec
```

Also check links, index files, and whether any spec still describes a template rather than this repository.


--- FILE: .claude\skills\trellis-spec-bootstarp\SKILL.md ---

---
name: trellis-spec-bootstarp
description: "Bootstrap project-specific Trellis coding specs with a platform-neutral single-agent workflow. Use when creating or refreshing .trellis/spec guidelines, analyzing a codebase with GitNexus, ABCoder, or source inspection, decomposing package/layer spec work, and writing real codebase-backed spec docs without placeholder text."
---

# Trellis Spec Bootstarp

Use this skill to create or refresh `.trellis/spec/` guidelines from the real codebase. One capable agent owns the full loop: analyze the repository, choose the spec boundaries, write the docs, and verify the result. The workflow does not depend on a specific host, CLI, or agent brand.

## Workflow

1. Confirm Trellis is initialized and inspect the current `.trellis/spec/` tree.
2. Analyze the repository architecture with the best available tools: GitNexus, ABCoder, language tooling, and direct source reads.
3. Decompose the spec work by package and layer only when that reflects the actual codebase.
4. Fill or reshape the spec files with concrete patterns, file paths, examples, and anti-patterns from the project.
5. Verify that the final specs are internally consistent and contain no template placeholders.

## Reference Routing

| Need | Read |
|------|------|
| Repository architecture analysis | [references/repository-analysis.md](references/repository-analysis.md) |
| Spec work decomposition and task planning | [references/spec-task-planning.md](references/spec-task-planning.md) |
| Writing high-signal Trellis spec files | [references/spec-writing.md](references/spec-writing.md) |
| GitNexus and ABCoder MCP setup | [references/mcp-setup.md](references/mcp-setup.md) |

## Operating Rules

- Treat templates as starting points, not contracts. Delete, rename, split, or add spec files when the repository calls for it.
- Prefer source-backed rules over generic advice. Every important recommendation should point at a real file or repeated local pattern.
- Keep execution single-owner by default. Optional helper agents are an implementation detail, not a requirement or user-visible dependency.
- Do not write platform-specific instructions unless the target project already standardizes on that platform.
- Do not leave placeholder text, empty headings, or copied boilerplate in `.trellis/spec/`.

## Done Criteria

- `.trellis/spec/` describes the project as it exists now.
- Each relevant package or layer has practical coding guidance with real examples.
- Non-applicable template sections are removed.
- `index.md` files match the final spec file set.
- Any required setup or analysis assumptions are documented in the relevant spec or task notes.


--- FILE: .claude\skills\trellis-update-spec\SKILL.md ---

---
name: trellis-update-spec
description: "Captures executable contracts and coding conventions into .trellis/spec/ documents. Use when learning something valuable from debugging, implementing, or discussion that should be preserved for future sessions."
---

# Update Code-Spec - Capture Executable Contracts

When you learn something valuable (from debugging, implementing, or discussion), use this to update the relevant code-spec documents.

**Timing**: After completing a task, fixing a bug, or discovering a new pattern

---

## Code-Spec First Rule (CRITICAL)

In this project, "spec" for implementation work means **code-spec**:
- Executable contracts (not principle-only text)
- Concrete signatures, payload fields, env keys, and boundary behavior
- Testable validation/error behavior

If the change touches infra or cross-layer contracts, code-spec depth is mandatory.

### Mandatory Triggers

Apply code-spec depth when the change includes any of:
- New/changed command or API signature
- Cross-layer request/response contract change
- Database schema/migration change
- Infra integration (storage, queue, cache, secrets, env wiring)

### Mandatory Output (7 Sections)

For triggered tasks, include all sections below:
1. Scope / Trigger
2. Signatures (command/API/DB)
3. Contracts (request/response/env)
4. Validation & Error Matrix
5. Good/Base/Bad Cases
6. Tests Required (with assertion points)
7. Wrong vs Correct (at least one pair)

---

## When to Update Code-Specs

| Trigger | Example | Target Spec |
|---------|---------|-------------|
| **Implemented a feature** | Added a new integration or module | Relevant spec file |
| **Made a design decision** | Chose extensibility pattern over simplicity | Relevant spec + "Design Decisions" section |
| **Fixed a bug** | Found a subtle issue with error handling | Relevant spec (e.g., error-handling docs) |
| **Discovered a pattern** | Found a better way to structure code | Relevant spec file |
| **Hit a gotcha** | Learned that X must be done before Y | Relevant spec + "Common Mistakes" section |
| **Established a convention** | Team agreed on naming pattern | Quality guidelines |
| **New thinking trigger** | "Don't forget to check X before doing Y" | `guides/*.md` (as a checklist item) |

**Key Insight**: Code-spec updates are NOT just for problems. Every feature implementation contains design decisions and contracts that future AI/developers need to execute safely.

---

## Spec Structure Overview

```
.trellis/spec/
├── <layer>/           # Per-layer coding standards (e.g., backend/, frontend/, api/)
│   ├── index.md       # Overview and links
│   └── *.md           # Topic-specific guidelines
└── guides/            # Thinking checklists (NOT coding specs!)
    ├── index.md       # Guide index
    └── *.md           # Topic-specific guides
```

### CRITICAL: Code-Spec vs Guide - Know the Difference

| Type | Location | Purpose | Content Style |
|------|----------|---------|---------------|
| **Code-Spec** | `<layer>/*.md` | Tell AI "how to implement safely" | Signatures, contracts, matrices, cases, test points |
| **Guide** | `guides/*.md` | Help AI "what to think about" | Checklists, questions, pointers to specs |

**Decision Rule**: Ask yourself:

- "This is **how to write** the code" → Put in a spec layer directory
- "This is **what to consider** before writing" → Put in `guides/`

**Example**:

| Learning | Wrong Location | Correct Location |
|----------|----------------|------------------|
| "Use API X not API Y for this task" | ❌ `guides/` (too specific for a thinking guide) | ✅ Relevant spec file (concrete convention) |
| "Remember to check X when doing Y" | ❌ Spec file (too abstract for a spec) | ✅ `guides/` (thinking checklist) |

**Guides should be short checklists that point to specs**, not duplicate the detailed rules.

---

## Update Process

### Step 1: Identify What You Learned

Answer these questions:

1. **What did you learn?** (Be specific)
2. **Why is it important?** (What problem does it prevent?)
3. **Where does it belong?** (Which spec file?)

### Step 2: Classify the Update Type

| Type | Description | Action |
|------|-------------|--------|
| **Design Decision** | Why we chose approach X over Y | Add to "Design Decisions" section |
| **Project Convention** | How we do X in this project | Add to relevant section with examples |
| **New Pattern** | A reusable approach discovered | Add to "Patterns" section |
| **Forbidden Pattern** | Something that causes problems | Add to "Anti-patterns" or "Don't" section |
| **Common Mistake** | Easy-to-make error | Add to "Common Mistakes" section |
| **Convention** | Agreed-upon standard | Add to relevant section |
| **Gotcha** | Non-obvious behavior | Add warning callout |

### Step 3: Read the Target Code-Spec

Before editing, read the current code-spec to:
- Understand existing structure
- Avoid duplicating content
- Find the right section for your update

```bash
cat .trellis/spec/<category>/<file>.md
```

### Step 4: Make the Update

Follow these principles:

1. **Be Specific**: Include concrete examples, not just abstract rules
2. **Explain Why**: State the problem this prevents
3. **Show Contracts**: Add signatures, payload fields, and error behavior
4. **Show Code**: Add code snippets for key patterns
5. **Keep it Short**: One concept per section

### Step 5: Update the Index (if needed)

If you added a new section or the code-spec status changed, update the category's `index.md`.

---

## Update Templates

### Mandatory Template for Infra/Cross-Layer Work

```markdown
## Scenario: <name>

### 1. Scope / Trigger
- Trigger: <why this requires code-spec depth>

### 2. Signatures
- Backend command/API/DB signature(s)

### 3. Contracts
- Request fields (name, type, constraints)
- Response fields (name, type, constraints)
- Environment keys (required/optional)

### 4. Validation & Error Matrix
- <condition> -> <error>

### 5. Good/Base/Bad Cases
- Good: ...
- Base: ...
- Bad: ...

### 6. Tests Required
- Unit/Integration/E2E with assertion points

### 7. Wrong vs Correct
#### Wrong
...
#### Correct
...
```

### Adding a Design Decision

```markdown
### Design Decision: [Decision Name]

**Context**: What problem were we solving?

**Options Considered**:
1. Option A - brief description
2. Option B - brief description

**Decision**: We chose Option X because...

**Example**:
\`\`\`typescript
// How it's implemented
code example
\`\`\`

**Extensibility**: How to extend this in the future...
```

### Adding a Project Convention

```markdown
### Convention: [Convention Name]

**What**: Brief description of the convention.

**Why**: Why we do it this way in this project.

**Example**:
\`\`\`typescript
// How to follow this convention
code example
\`\`\`

**Related**: Links to related conventions or specs.
```

### Adding a New Pattern

```markdown
### Pattern Name

**Problem**: What problem does this solve?

**Solution**: Brief description of the approach.

**Example**:
\`\`\`
// Good
code example

// Bad
code example
\`\`\`

**Why**: Explanation of why this works better.
```

### Adding a Forbidden Pattern

```markdown
### Don't: Pattern Name

**Problem**:
\`\`\`
// Don't do this
bad code example
\`\`\`

**Why it's bad**: Explanation of the issue.

**Instead**:
\`\`\`
// Do this instead
good code example
\`\`\`
```

### Adding a Common Mistake

```markdown
### Common Mistake: Description

**Symptom**: What goes wrong

**Cause**: Why this happens

**Fix**: How to correct it

**Prevention**: How to avoid it in the future
```

### Adding a Gotcha

```markdown
> **Warning**: Brief description of the non-obvious behavior.
>
> Details about when this happens and how to handle it.
```

---

## Interactive Mode

If you're unsure what to update, answer these prompts:

1. **What did you just finish?**
   - [ ] Fixed a bug
   - [ ] Implemented a feature
   - [ ] Refactored code
   - [ ] Had a discussion about approach

2. **What did you learn or decide?**
   - Design decision (why X over Y)
   - Project convention (how we do X)
   - Non-obvious behavior (gotcha)
   - Better approach (pattern)

3. **Would future AI/developers need to know this?**
   - To understand how the code works → Yes, update spec
   - To maintain or extend the feature → Yes, update spec
   - To avoid repeating mistakes → Yes, update spec
   - Purely one-off implementation detail → Maybe skip

4. **Which area does it relate to?**
   - [ ] Backend code
   - [ ] Frontend code
   - [ ] Cross-layer data flow
   - [ ] Code organization/reuse
   - [ ] Quality/testing

---

## Quality Checklist

Before finishing your code-spec update:

- [ ] Is the content specific and actionable?
- [ ] Did you include a code example?
- [ ] Did you explain WHY, not just WHAT?
- [ ] Did you include executable signatures/contracts?
- [ ] Did you include validation and error matrix?
- [ ] Did you include Good/Base/Bad cases?
- [ ] Did you include required tests with assertion points?
- [ ] Is it in the right code-spec file?
- [ ] Does it duplicate existing content?
- [ ] Would a new team member understand it?

---

## Relationship to Other Commands

```
Development Flow:
  Learn something → /trellis:update-spec → Knowledge captured
       ↑                                  ↓
  /trellis:break-loop ←──────────────────── Future sessions benefit
  (deep bug analysis)
```

- `/trellis:break-loop` - Analyzes bugs deeply, often reveals spec updates needed
- `/trellis:update-spec` - Actually makes the updates
- `/trellis:finish-work` - Reminds you to check if specs need updates

---

## Core Philosophy

> **Code-specs are living documents. Every debugging session, every "aha moment" is an opportunity to make the implementation contract clearer.**

The goal is **institutional memory**:
- What one person learns, everyone benefits from
- What AI learns in one session, persists to future sessions
- Mistakes become documented guardrails


--- FILE: .codex\hooks.json ---

{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "python3 -X utf8 .codex/hooks/inject-workflow-state.py",
            "timeout": 15
          }
        ]
      }
    ]
  }
}


--- FILE: .github\ISSUE_TEMPLATE\bug_report.md ---

---
name: Bug report
about: Report a reproducible ProductFlow bug
title: "[Bug]: "
labels: bug
assignees: ""
---

## Summary

What went wrong?

## Environment

- ProductFlow commit:
- OS:
- Python version:
- Node/pnpm version:
- Database/Redis setup:
- Provider mode: `mock` / `openai` / `openai_responses`

## Steps to reproduce

1.
2.
3.

## Expected behavior

What did you expect to happen?

## Actual behavior

What happened instead?

## Logs or screenshots

Paste only the minimal relevant logs. Do not include real API keys, cookies, database URLs, private images, or `.env` contents.

## Verification

Have you tried with the default `mock` provider?


--- FILE: .github\ISSUE_TEMPLATE\feature_request.md ---

---
name: Feature request
about: Suggest an improvement for the self-hosted ProductFlow project
title: "[Feature]: "
labels: enhancement
assignees: ""
---

## Problem

What user problem should this solve?

## Proposed solution

What behavior or UI would you like to add?

## Scope

- Backend changes:
- Frontend changes:
- Database/migration changes:
- Provider/model changes:

## Alternatives considered

What workarounds or alternative designs have you considered?

## Additional context

Screenshots, sketches, or references are welcome. Do not include secrets or private production data.


--- FILE: .github\pull_request_template.md ---

## Summary

-

## Changes

-

## Verification

- [ ] `uv run --directory backend ruff check .`
- [ ] `just backend-test`
- [ ] `just web-build`
- [ ] Documentation-only change; build/test not required

## Config / migration notes

-

## Screenshots

Attach screenshots or recordings for UI changes.

## Security checklist

- [ ] No `.env`, API keys, cookies, database URLs, private images, storage output, logs, or `.trellis/tasks/` are included.
- [ ] New provider/config behavior does not echo secret values.


--- FILE: .trellis\.template-hashes.json ---

{
  "__version": 2,
  "hashes": {
    ".trellis/scripts/common/trellis_config.py": "0839dcf90ebbd77712c276930a89335b3313927051650c91d220fb51ca2a6a3c",
    ".trellis/scripts/common/safe_commit.py": "8789bff4b30a9065469210f2efab3f59f03dddd77bef4e4b6a5bb641f93539f4",
    ".claude/commands/trellis/continue.md": "78bea91cc54bc58fc947f24cf7daff0cf7b5a217753b5fd71b5d1aa7a04edc50",
    ".claude/commands/trellis/finish-work.md": "d6aa570ab684f57e4845de2d84a1ff6d9f0908e04c5a56e14fd70ae739c369fc",
    ".claude/skills/trellis-before-dev/SKILL.md": "859894f2e8258cbfa142d710363433761c54984c69f7ed7bd44512fb4eb165cd",
    ".claude/skills/trellis-brainstorm/SKILL.md": "056f7cab72748d2402717b38d8e61abacf1e91b9e0fac9d077f4522e82233667",
    ".claude/skills/trellis-break-loop/SKILL.md": "35afb53fef42cd494e566f1ef170dbf442ec2be7e19931f28a14079b4dda753f",
    ".claude/skills/trellis-check/SKILL.md": "b21ff04b7680ebacb8c5ecbc48a22d627eb13e2b47fceb78c8ced0b43b60b282",
    ".claude/skills/trellis-update-spec/SKILL.md": "d975db7af166578488958751ae2c56edb827a68bddb569aa27acc3453f64e610",
    ".claude/skills/trellis-meta/references/customize-local/add-project-local-conventions.md": "86009ccb5d0373f399582da0bc570c4e5c6053c3c764857424ff93384f0e04e5",
    ".claude/skills/trellis-meta/references/customize-local/change-agents.md": "7f2982162463f107f8b1a4fa1a41fee2bc7dbd0cc8e90c48559aba30c3ea403c",
    ".claude/skills/trellis-meta/references/customize-local/change-context-loading.md": "350d319dc1ab99609ddbf52cf8c06c71bd97ba1a29ce2eac8b97d0bb192938bf",
    ".claude/skills/trellis-meta/references/customize-local/change-hooks.md": "91892f2cff53ae003736007e95172945acabf48b2fc889bd627cd2406ce449c4",
    ".claude/skills/trellis-meta/references/customize-local/change-skills-or-commands.md": "b3009ef20a4f24e5d8b196109dc9bab6bd30fc030dbc4fb796afdd2ca912e1ea",
    ".claude/skills/trellis-meta/references/customize-local/change-spec-structure.md": "31eccaad7097d96e66a45c1b4caea1ba4f2e54b7814184c3ebf82c87dafc4841",
    ".claude/skills/trellis-meta/references/customize-local/change-task-lifecycle.md": "60ff9efb93604b87a461a4af30322d76750402a51e40f31531a7ff88d309996d",
    ".claude/skills/trellis-meta/references/customize-local/change-workflow.md": "f7855f2db1bcb213ba843c38776ccdc1f4616ed687f84e977da2f5e6cf7195eb",
    ".claude/skills/trellis-meta/references/customize-local/overview.md": "1a406c24b4c5737cf517ead5ecb0846c20b0648a117008d3f5a47614fc1793ca",
    ".claude/skills/trellis-meta/references/local-architecture/context-injection.md": "8497289bf333b3aa456f317039d1239b7ece79254aa0eb62cfc647714c866084",
    ".claude/skills/trellis-meta/references/local-architecture/generated-files.md": "4356517517cef0ba7f3ba01965a4ba8953505702e4085f0797d3e36817c9669f",
    ".claude/skills/trellis-meta/references/local-architecture/overview.md": "45ffd4ee95020f58201adc885f3dfc89b26483c2b350d96ca7f2f57f94d5ff5f",
    ".claude/skills/trellis-meta/references/local-architecture/spec-system.md": "b8d8a6a0888b44a232c8f50161b9e20e903cf621ad7be4021715ab6fab226f47",
    ".claude/skills/trellis-meta/references/local-architecture/task-system.md": "2b561d49c390f7d0db5391912946133be4bf73189231e2b8cc9afa1c5ac6165a",
    ".claude/skills/trellis-meta/references/local-architecture/workflow.md": "cfcdc6e4468a5d9c816e929fcca01640cd41cfdaaa4824118b40a8e460c927b6",
    ".claude/skills/trellis-meta/references/local-architecture/workspace-memory.md": "e6427b46aba744563c2444b30df4043cd856561b7709ec2dece26095416421fd",
    ".claude/skills/trellis-meta/references/platform-files/agents.md": "dda57dfa46700c331f9a3f3bfc710ebb24a81bde048a945f2e9a72cf3a0e3dce",
    ".claude/skills/trellis-meta/references/platform-files/hooks-and-settings.md": "6e2d6d88719c2779fe34004f63d36cff203d8f64e7fb620f7cb1cde15c37c462",
    ".claude/skills/trellis-meta/references/platform-files/overview.md": "6479cd2393166b4b369b511c44b78cbc64975c8b1df96ee1d4d1bd06b75cd48d",
    ".claude/skills/trellis-meta/references/platform-files/platform-map.md": "ded6751c06f31d0a701d33c9dd69c482a583539ad3ed464aaad9e705f793b212",
    ".claude/skills/trellis-meta/references/platform-files/skills-and-commands.md": "85435eb8bb6921283575bca51268fc534c22fd3ca33782e841ee5c76140ae48f",
    ".claude/skills/trellis-meta/SKILL.md": "942e898a6fd769a93a3ca6f43f9fe0412d0adae011654fd384e9cacbd2af4f34",
    ".claude/agents/trellis-check.md": "4e4d849d91918228a288752c1196a8ad91ee090f760f04a6680319baf1f8aee5",
    ".claude/agents/trellis-implement.md": "650bfb5f6bef4bdac138cde68e676631063afdf251938ec69d8f3f1504687407",
    ".claude/agents/trellis-research.md": "f82244b2a88a1f77b09813f58a7fdf506f8e9603a5c34b3abe6e170f73ab68a8",
    ".claude/hooks/inject-subagent-context.py": "c8ea04062990530dffb26c4d1efa3e6887e042d3086da2f2325b491c9d544931",
    ".claude/hooks/inject-workflow-state.py": "f7fa9389ed7aa264597fff5de6277bec186e89a3ef539192997c6d026d88d5ec",
    ".claude/hooks/session-start.py": "2cd87a08dec8cecc5f1acb665d6bd7241bc580f6ae39d571b99a0118be89c46b",
    ".claude/settings.json": "d13cd05659281a287d7f50c7e25eb6a89c2a6597773511bd6885538acced2855",
    ".agents/skills/trellis-meta/references/customize-local/add-project-local-conventions.md": "86009ccb5d0373f399582da0bc570c4e5c6053c3c764857424ff93384f0e04e5",
    ".agents/skills/trellis-meta/references/customize-local/change-agents.md": "7f2982162463f107f8b1a4fa1a41fee2bc7dbd0cc8e90c48559aba30c3ea403c",
    ".agents/skills/trellis-meta/references/customize-local/change-context-loading.md": "350d319dc1ab99609ddbf52cf8c06c71bd97ba1a29ce2eac8b97d0bb192938bf",
    ".agents/skills/trellis-meta/references/customize-local/change-hooks.md": "91892f2cff53ae003736007e95172945acabf48b2fc889bd627cd2406ce449c4",
    ".agents/skills/trellis-meta/references/customize-local/change-skills-or-commands.md": "b3009ef20a4f24e5d8b196109dc9bab6bd30fc030dbc4fb796afdd2ca912e1ea",
    ".agents/skills/trellis-meta/references/customize-local/change-spec-structure.md": "31eccaad7097d96e66a45c1b4caea1ba4f2e54b7814184c3ebf82c87dafc4841",
    ".agents/skills/trellis-meta/references/customize-local/change-task-lifecycle.md": "60ff9efb93604b87a461a4af30322d76750402a51e40f31531a7ff88d309996d",
    ".agents/skills/trellis-meta/references/customize-local/change-workflow.md": "f7855f2db1bcb213ba843c38776ccdc1f4616ed687f84e977da2f5e6cf7195eb",
    ".agents/skills/trellis-meta/references/customize-local/overview.md": "1a406c24b4c5737cf517ead5ecb0846c20b0648a117008d3f5a47614fc1793ca",
    ".agents/skills/trellis-meta/references/local-architecture/context-injection.md": "8497289bf333b3aa456f317039d1239b7ece79254aa0eb62cfc647714c866084",
    ".agents/skills/trellis-meta/references/local-architecture/generated-files.md": "4356517517cef0ba7f3ba01965a4ba8953505702e4085f0797d3e36817c9669f",
    ".agents/skills/trellis-meta/references/local-architecture/overview.md": "45ffd4ee95020f58201adc885f3dfc89b26483c2b350d96ca7f2f57f94d5ff5f",
    ".agents/skills/trellis-meta/references/local-architecture/spec-system.md": "b8d8a6a0888b44a232c8f50161b9e20e903cf621ad7be4021715ab6fab226f47",
    ".agents/skills/trellis-meta/references/local-architecture/task-system.md": "2b561d49c390f7d0db5391912946133be4bf73189231e2b8cc9afa1c5ac6165a",
    ".agents/skills/trellis-meta/references/local-architecture/workflow.md": "cfcdc6e4468a5d9c816e929fcca01640cd41cfdaaa4824118b40a8e460c927b6",
    ".agents/skills/trellis-meta/references/local-architecture/workspace-memory.md": "e6427b46aba744563c2444b30df4043cd856561b7709ec2dece26095416421fd",
    ".agents/skills/trellis-meta/references/platform-files/agents.md": "dda57dfa46700c331f9a3f3bfc710ebb24a81bde048a945f2e9a72cf3a0e3dce",
    ".agents/skills/trellis-meta/references/platform-files/hooks-and-settings.md": "6e2d6d88719c2779fe34004f63d36cff203d8f64e7fb620f7cb1cde15c37c462",
    ".agents/skills/trellis-meta/references/platform-files/overview.md": "6479cd2393166b4b369b511c44b78cbc64975c8b1df96ee1d4d1bd06b75cd48d",
    ".agents/skills/trellis-meta/references/platform-files/platform-map.md": "ded6751c06f31d0a701d33c9dd69c482a583539ad3ed464aaad9e705f793b212",
    ".agents/skills/trellis-meta/references/platform-files/skills-and-commands.md": "85435eb8bb6921283575bca51268fc534c22fd3ca33782e841ee5c76140ae48f",
    ".agents/skills/trellis-meta/SKILL.md": "942e898a6fd769a93a3ca6f43f9fe0412d0adae011654fd384e9cacbd2af4f34",
    ".agents/skills/trellis-start/SKILL.md": "79a5ba7a2aff3c72e06d7f4cd6942dc4f4f4092dd40f9c8e94f1838024a81e4d",
    ".trellis/scripts/common/git_context.py": "fa30ced454f1a91ffc9f8b2abeb32225e3447cbdc90bad783797374eba07265d",
    ".trellis/scripts/common/active_task.py": "6c88ed40ef7289bca0f6d2ecba0f8b8aef46cd58788080fbeeea88de138a431f",
    ".trellis/scripts/common/config.py": "25c5a53ad20d6909be5209222e4208a84528805316a4d78350529459a364edb1",
    ".trellis/scripts/common/tasks.py": "4436a8b0b53c270a35989e26d9dbd92669408c6562d88c02083a404562da85fe",
    ".trellis/scripts/common/task_context.py": "d174684d417bbe2fafc26b6afcddb264c7dc519527bb24d2055cd27daaad9b55",
    ".trellis/scripts/common/task_store.py": "707d5c111f610e4e928f553fe59fcd9de6882da1b07ef0e01347245c5ed770d8",
    ".trellis/scripts/common/session_context.py": "df79c44efe3432811c32d145d57a66343a70e221ec087ed2bd28b76677bb4076",
    ".trellis/scripts/common/workflow_phase.py": "3141c0aa55109b883886221a95878fac7d0a1aedd25fb9a963c47add7383db4e",
    ".trellis/scripts/task.py": "6c65801a1f56648fd4765a1d216493d3094827c1db4761e55fdaa548c1801798",
    ".trellis/scripts/add_session.py": "6e406a0a9f32d4a50b1b5ca8115cbd06c359011f0e166c41dc5fab34698a4006",
    ".trellis/config.yaml": "3e295bf4310763240647f40b3aeee7a7c6d134142cdc826e02d850ca2407fc43",
    ".trellis/workflow.md": "dfd132985732d36cd1b9bc4e2670db580fd2df260298a3eefbdbab26d17da321",
    "AGENTS.md": "225a564e63072efd3768024730eba85d076e6b9526768b6b4d29153bf7531bf0",
    ".agents/skills/trellis-continue/SKILL.md": "002ebb5435b87352eab464e5a32ff7b2ee59fee206d645d4a797a14caec2b944",
    ".agents/skills/trellis-finish-work/SKILL.md": "161060fbcd44f787440d3a5c297a9f5223ea7774bb3021a50e376875a9ac5b2d",
    ".agents/skills/trellis-before-dev/SKILL.md": "859894f2e8258cbfa142d710363433761c54984c69f7ed7bd44512fb4eb165cd",
    ".agents/skills/trellis-brainstorm/SKILL.md": "056f7cab72748d2402717b38d8e61abacf1e91b9e0fac9d077f4522e82233667",
    ".agents/skills/trellis-check/SKILL.md": "b21ff04b7680ebacb8c5ecbc48a22d627eb13e2b47fceb78c8ced0b43b60b282",
    ".agents/skills/trellis-update-spec/SKILL.md": "003ce08a3404aeb50998029392c4d4e57b626edf526d3ebd585032bb92dcbb96",
    ".codex/agents/trellis-check.toml": "a9a7253719e86f7c7efa6db9a655151f9f4f836e99efc34a66c69159dd56c184",
    ".codex/agents/trellis-implement.toml": "dda3efd5d6e218784afde6c9758c397a4c38c287c5e424cc6191a223cc4c8db0",
    ".codex/agents/trellis-research.toml": "5492f7f6ab8bdea975b0e853bf171b050f7ddf6c2079ac770ed912c48d815eae",
    ".codex/hooks/session-start.py": "1c951ff35f490c5fbf576b4764ec190895df7c2a48e279fb20625209f51c321a",
    ".codex/hooks/inject-workflow-state.py": "f7fa9389ed7aa264597fff5de6277bec186e89a3ef539192997c6d026d88d5ec",
    ".codex/hooks.json": "522ba3c488c100027783e52ecff84c0bd799852dd77ad3f1936e86db105f01d6",
    ".codex/config.toml": "cd29d64a44b4631593aca8ff4b071f1156f914fc9dfb976450af6f91b735bb57",
    ".claude/skills/trellis-spec-bootstarp/references/mcp-setup.md": "df542fc8f279edd38046d26a7c8151804b708f57b24d4aa2733cea587a88c65e",
    ".claude/skills/trellis-spec-bootstarp/references/repository-analysis.md": "0dae98d774f6e34559b9f3442888ac43e3a8af110c37cbefc49ce256986858b6",
    ".claude/skills/trellis-spec-bootstarp/references/spec-task-planning.md": "ef493d028c3b0807a8a534bb71fb92a68129f273db763ad27ceb464a522e799d",
    ".claude/skills/trellis-spec-bootstarp/references/spec-writing.md": "e9800fe9ed4a4cd87062ea1829cf2caa8d170ec15e141678a6a30e74c497f47d",
    ".claude/skills/trellis-spec-bootstarp/SKILL.md": "81f400092b21392161e7d9dfa9111c9be36c81bc8641d252ed28e08373449ac0",
    ".agents/skills/trellis-spec-bootstarp/references/mcp-setup.md": "df542fc8f279edd38046d26a7c8151804b708f57b24d4aa2733cea587a88c65e",
    ".agents/skills/trellis-spec-bootstarp/references/repository-analysis.md": "0dae98d774f6e34559b9f3442888ac43e3a8af110c37cbefc49ce256986858b6",
    ".agents/skills/trellis-spec-bootstarp/references/spec-task-planning.md": "ef493d028c3b0807a8a534bb71fb92a68129f273db763ad27ceb464a522e799d",
    ".agents/skills/trellis-spec-bootstarp/references/spec-writing.md": "e9800fe9ed4a4cd87062ea1829cf2caa8d170ec15e141678a6a30e74c497f47d",
    ".agents/skills/trellis-spec-bootstarp/SKILL.md": "81f400092b21392161e7d9dfa9111c9be36c81bc8641d252ed28e08373449ac0"
  }
}

--- FILE: .trellis\spec\backend\database-guidelines.md ---

# Backend Database Guidelines

> Actual database, ORM, migration, and query patterns used by ProductFlow.

---

## Overview

ProductFlow uses SQLAlchemy 2.x typed declarative models, Alembic migrations, PostgreSQL in normal development/runtime,
and SQLite in tests. The main database files are:

- `backend/src/productflow_backend/infrastructure/db/models.py`
- `backend/src/productflow_backend/infrastructure/db/session.py`
- `backend/alembic/env.py`
- `backend/alembic/versions/*.py`
- `backend/tests/conftest.py`
- `backend/tests/test_migrations_database_constraints.py`

The runtime `Settings.database_url` comes from environment variables; common business/runtime settings can be overridden
through the `app_settings` table and loaded by `get_runtime_settings()` in `backend/src/productflow_backend/config.py`.

---

## Model Patterns

### SQLAlchemy typed declarative

Models inherit from `Base(DeclarativeBase)` in `infrastructure/db/models.py` and use `Mapped[...]` plus
`mapped_column(...)`:

```python
class Product(Base, TimestampMixin):
    __tablename__ = "products"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    name: Mapped[str] = mapped_column(String(255))
    category: Mapped[str | None] = mapped_column(String(120), nullable=True)
```

Use `TimestampMixin` for tables that need both `created_at` and `updated_at`; use explicit `created_at` only for append-only
records such as `SourceAsset`, `CreativeBrief`, and `PosterVariant`.

### IDs and timestamps

- Primary IDs are UUID strings generated by `new_id()` in `infrastructure/db/models.py`.
- Timestamps use timezone-aware UTC values via `utcnow()` in `infrastructure/db/models.py` or `now_utc()` in application
  modules.
- Keep IDs as `String(36)` because existing tables and API DTOs expose string IDs.

### Enum storage

SQLAlchemy enum columns use `enum_value_column(...)` so database values are the enum `.value` strings, not Python enum
member names. This is explicitly tested in
`backend/tests/test_migrations_database_constraints.py::test_sqlalchemy_enum_columns_use_database_values`.

```python
def enum_value_column(enum_cls: type) -> SqlEnum:
    return SqlEnum(
        enum_cls,
        name=enum_cls.__name__.lower(),
        values_callable=lambda members: [member.value for member in members],
        validate_strings=True,
    )
```

When changing an enum, update:

- `backend/src/productflow_backend/domain/enums.py`
- SQLAlchemy columns/migrations as needed
- `web/src/lib/types.ts`
- tests that assert enum database values

### Relationships and delete behavior

Relationships are defined on models and use explicit cascades where child records belong to a parent. Examples:

- `Product.source_assets`, `Product.creative_briefs`, `Product.copy_sets`, `Product.poster_variants`,
  `Product.image_sessions`, and `Product.workflows` use `cascade="all, delete-orphan"` in
  `infrastructure/db/models.py`.
- Foreign keys use `ondelete="CASCADE"` for owned children and `ondelete="SET NULL"` for optional references such as
  `creative_brief_id`, `copy_set_id`, and `poster_variant_id`.
- `Product.current_confirmed_copy_set_id` uses a named foreign key (`fk_products_current_confirmed_copy_set_id`) and
  `post_update=True` to handle the cycle with `CopySet`.

---

## Query Patterns

### Session ownership

Routes receive a `Session` through `presentation/deps.py::get_session`, which wraps
`infrastructure/db/session.py::get_db_session`. Application use cases receive the session as an argument and commit inside
the use case when they mutate state.

Use `sessionmaker(..., autoflush=False, autocommit=False, expire_on_commit=False)` from
`infrastructure/db/session.py`. After writes, existing use cases call `session.commit()`, often `session.expire_all()`, and
then reload a fully populated object.

### Select and eager loading

Use `select(...)`, `session.scalar(...)`, and `session.scalars(...)`. When a response needs related data, define a query
helper with `selectinload(...)` instead of relying on accidental lazy loading. Current examples:

- `_product_query()` in `application/use_cases.py` loads source assets, briefs, copy sets, posters, and confirmed copy.
- `_image_session_query()` in `application/image_sessions.py` loads assets, rounds, generated assets, and product source
  assets.

### Pagination and limits

Product listing uses database-level pagination in `application/use_cases.py::list_products` with `offset`/`limit` and a
separate count query. The route `presentation/routes/products.py::list_products_endpoint` constrains `page >= 1` and
`1 <= page_size <= 100` using FastAPI `Query`.

`list_products(status=...)` must also stay database-filtered before eager loading and pagination:

- `draft`: no confirmed copy set and no poster variants.
- `copy_ready`: has `Product.current_confirmed_copy_set_id` and no poster variants.
- `poster_ready`: has at least one poster variant.
- `failed`: currently has no persisted product-level source of truth and should return no rows until a real state owner is
  introduced.

Keep the response shape unchanged. If product state semantics change, update both `derive_product_state(...)` and the SQL
status filter together, then add a query behavior test. Do not reintroduce full-table product loads for list pages.

### Runtime settings registry

`config.py::CONFIG_DEFINITIONS` is the owner registry for settings that may be stored in `app_settings`.
`RUNTIME_CONFIG_KEYS` must equal the keys in that registry. Env-only settings such as `ADMIN_ACCESS_KEY`,
`SETTINGS_ACCESS_TOKEN`, `SESSION_SECRET`, `DATABASE_URL`, and `REDIS_URL` are required before database access or are
secrets with separate lifecycle rules, so they must not be added to `CONFIG_DEFINITIONS` or persisted in `app_settings`.

For runtime settings:

- Defaults live on `Settings`.
- UI/API metadata, allowed values, min/max, and secret masking live in `CONFIG_DEFINITIONS`.
- Database rows override only keys in `RUNTIME_CONFIG_KEYS`.
- Reset deletes the database row and falls back to the env/default `Settings` value.

## Scenario: Provider profile and purpose binding configuration

### 1. Scope / Trigger

- Trigger: changing text provider selection, image provider selection, settings APIs, provider secrets, or legacy
  `text_*` / `image_*` provider env keys.
- This is a cross-layer and database contract because provider configuration spans `Settings`, `app_settings`,
  `provider_profiles`, `provider_bindings`, provider factories, API DTOs, and `SettingsPage`.

### 2. Signatures

- DB table: `provider_profiles`
  - `id: String(36)`
  - `name: String(120)`
  - `provider_type: "openai_compatible" | "google_gemini"`
  - `base_url: Text | null`
  - `api_key: Text | null`
  - `capabilities_json: JSON list[str]`
  - `default_models_json: JSON object`
  - `config_json: JSON object`
  - `enabled: bool`
  - `archived_at: datetime | null`
- DB table: `provider_bindings`
  - `purpose: "text" | "image"`
  - `provider_kind: "mock" | "openai" | "openai_responses" | "openai_images" | "google_gemini_image"`
  - `provider_profile_id: String(36) | null`
  - `model_settings_json: JSON object`
  - `config_json: JSON object`
- API:
  - `GET /api/settings/provider-config`
  - `POST /api/settings/provider-profiles`
  - `PATCH /api/settings/provider-profiles/{profile_id}`
  - `DELETE /api/settings/provider-profiles/{profile_id}`
  - `PATCH /api/settings/provider-bindings/{purpose}`
- Resolver functions:
  - `resolve_text_provider_config() -> ResolvedTextProviderConfig`
  - `resolve_image_provider_config() -> ResolvedImageProviderConfig`

### 3. Contracts

- `CONFIG_DEFINITIONS` must not expose provider connection fields:
  - `text_provider_kind`, `text_api_key`, `text_base_url`
  - `text_brief_model`, `text_copy_model`
  - `image_provider_kind`, `image_api_key`, `image_base_url`
  - `image_generate_model`, `image_images_quality`, `image_images_style`, `image_responses_background_enabled`
- `Settings` may keep those fields only as env parsing and legacy bootstrap input.
- `ensure_provider_config_bootstrapped(session)` reads legacy effective provider config from env plus legacy
  `app_settings` rows, then creates provider profiles and text/image bindings once.
- If legacy text and image configs share the same `(base_url, api_key)`, bootstrap creates one profile with merged
  capabilities. Different connections create separate profiles.
- Google Gemini profiles use `provider_type="google_gemini"`, declare only `image_google_gemini`, reject custom
  `base_url`, and can bind only to `provider_kind="google_gemini_image"`.
- Google Gemini image bindings store `model_settings_json.model`, `config_json.gemini_api_version` (`v1beta` by default,
  allowed values `v1` or `v1beta`), and optional `config_json.gemini_output_mime_type`.
- Provider factories and concrete clients must read API key, base URL, provider kind, and model through
  `resolve_*_provider_config()`. They must not fall back to old `Settings.text_api_key`,
  `Settings.image_api_key`, or provider kind fields.
- Saving or importing an image-purpose binding for a real image provider (`openai_responses`, `openai_images`, or
  `google_gemini_image`) must persist `app_settings.poster_generation_mode = "generated"` so the visible runtime config
  matches workflow execution. Saving a `mock` image binding preserves the existing runtime mode instead of forcing a reset.
- Provider model settings must come from `provider_bindings.model_settings_json` or
  `provider_profiles.default_models_json`. If required model settings are absent after bootstrap, resolvers must fail
  with a clear configuration error instead of falling back to legacy `Settings.text_brief_model`,
  `Settings.text_copy_model`, or `Settings.image_generate_model`.
- Image binding config is provider-kind scoped: `openai_responses` owns `responses_background_enabled`, while
  `openai_images` owns `images_quality` and `images_style`, and `google_gemini_image` owns `gemini_api_version` plus
  optional `gemini_output_mime_type`. Do not require or persist Responses background config for `openai_images`, Google
  Gemini, or `mock`.
- API responses for provider profiles expose `has_api_key`; they never expose the raw `api_key`.
- A blank API key update preserves the existing stored key. A non-blank API key update replaces it.
- While a provider profile is referenced by a real text/image binding, profile updates must not disable it or remove the
  capability required by that binding.
- Docker Compose must continue passing legacy `TEXT_*` / `IMAGE_*` provider env values into backend and worker containers
  during the migration window, because containerized bootstrap cannot read the host `.env` file directly.

### 4. Validation & Error Matrix

- `PATCH /api/settings` with old provider keys -> `400`, `未知配置项: <key>`.
- Provider binding with unsupported purpose -> `400` or `404` depending on route ownership.
- Real provider binding without `provider_profile_id` -> `400`, `真实供应商必须选择供应商档案`.
- Binding to a disabled or archived profile -> `400`, profile unavailable detail.
- Binding to a profile missing the required capability -> `400`, capability unsupported detail.
- Removing a capability from a profile still used by a binding -> `400`, active binding detail.
- Disabling a profile still used by a binding -> `400`, active binding detail.
- Archiving a provider profile still used by a binding -> `400`, active binding detail.
- Missing provider config tables during very early startup -> settings defaults may still load, but real provider
  resolution must fail clearly rather than using old URL/key fallback.
- Missing text/image model settings in both binding and profile defaults -> resolver fails clearly and asks the operator to
  configure the provider binding; do not silently use legacy env/app_settings model values.
- `google_gemini` profile with non-empty `base_url` -> provider profile create/update returns `400`.
- `google_gemini` profile with any capability except `image_google_gemini` -> provider profile create/update returns
  `400`.
- `openai_compatible` profile with `image_google_gemini` -> provider profile create/update returns `400`.
- `google_gemini_image` binding with `gemini_api_version` outside `v1` or `v1beta` -> provider binding update returns
  `400`.
- Missing `responses_background_enabled` -> only `openai_responses` image bindings fail. `openai_images` and `mock` must
  not require that field.

### 5. Good/Base/Bad Cases

- Good: one OpenAI-compatible gateway supports `text_responses` and `image_images`; text and image bindings point to the
  same profile and carry separate model settings.
- Good: a text gateway and an image gateway use different keys or URLs; bootstrap creates two profiles.
- Good: a Google Gemini profile has `provider_type="google_gemini"`, no `base_url`, capability
  `image_google_gemini`, and the image binding stores `provider_kind="google_gemini_image"` plus Gemini-specific config.
- Base: default local development has mock text/image bindings and no real provider profile.
- Bad: showing `text_api_key` or `image_api_key` in `/api/settings`.
- Bad: constructing an OpenAI client from `get_runtime_settings().image_api_key`.
- Bad: modeling Google Gemini as an OpenAI-compatible gateway or storing a Gemini custom endpoint in `base_url`.
- Bad: keeping a route-level legacy binding response that reports old provider kind when no binding exists.

### 6. Tests Required

- Settings API test that `/api/settings` excludes all old provider keys and rejects updates for those keys.
- Bootstrap test for matching legacy text/image URL and key producing one profile with merged capabilities.
- Bootstrap test for different legacy URL/key pairs producing separate profiles.
- API test that provider profile responses never include the raw key and blank-key update preserves the stored key.
- Binding validation test for required capabilities and active profile constraints.
- Profile update test that active bindings prevent removing required capabilities and disabling the profile.
- Resolver test proving existing provider bindings override stale legacy `app_settings` rows.
- Resolver test proving missing binding/profile model settings do not fall back to stale legacy model rows or env values.
- Settings API/import test proving real image bindings switch visible `poster_generation_mode` to `generated`.
- Settings API test for creating a `google_gemini` profile, rejecting custom Gemini `base_url`, and rejecting mismatched
  capabilities across Google Gemini and OpenAI-compatible profiles.
- Settings API test that `google_gemini_image` binding accepts only `v1` or `v1beta`, persists
  `gemini_output_mime_type` only when non-empty, and round-trips through config export/import.
- Provider payload test that `google_gemini_image` dispatches to the official `google-genai` client with text plus
  reference image parts, aspect-ratio mapping, sanitized request metadata, and generic provider errors.
- Provider payload tests should set legacy provider kind explicitly when they rely on env bootstrap.

### 7. Wrong vs Correct

Wrong:

```python
settings = get_runtime_settings()
client = OpenAI(api_key=settings.image_api_key, base_url=settings.image_base_url)
```

Correct:

```python
provider_config = resolve_image_provider_config()
client = OpenAI(api_key=provider_config.api_key, base_url=provider_config.base_url)
```

Wrong:

```python
provider_config = resolve_image_provider_config()
client = httpx.Client(base_url=provider_config.base_url)
```

Correct:

```python
provider_config = resolve_image_provider_config()
client = genai.Client(
    api_key=provider_config.api_key,
    http_options=types.HttpOptions(apiVersion=provider_config.gemini_api_version),
)
```

## Scenario: Runtime admin access toggle

### 1. Scope / Trigger

- Trigger: changing login/session auth, settings persistence, `/api/auth/session`, `/api/settings/runtime`, or the
  settings page security section.
- This is a cross-layer contract because `Settings`, config serialization, route dependencies, session responses,
  frontend DTOs, and route gating must agree on the same field and security boundary.

### 2. Signatures

- Env-only secret: `Settings.admin_access_key: str` remains required and must not be stored in `app_settings`.
- Runtime setting: `Settings.admin_access_required: bool = True`.
- Config definition key: `admin_access_required`, non-secret, boolean, category `安全与运维`.
- Runtime API response: `GET /api/settings/runtime` includes `admin_access_required`.
- Session state response: `GET /api/auth/session` returns `authenticated: bool` and `access_required: bool`.
- Guard helper: `presentation.deps.require_admin(request: Request) -> None`.

### 3. Contracts

- Default behavior is secure: `admin_access_required` is `True` unless explicitly set through env/defaults or
  `app_settings`.
- When `admin_access_required` is true, private workspace routes require a signed Cookie session with
  `is_authenticated == True`.
- When `admin_access_required` is false, private workspace routes guarded by `require_admin` are open without a login
  cookie.
- Disabling admin access must not bypass the independent settings lock. Full settings reads/writes still require
  `SETTINGS_ACCESS_TOKEN` through `require_settings_unlocked`.
- `POST /api/auth/session` is a no-op success when login is disabled and must leave the existing session untouched,
  including any `settings_unlocked` flag.
- `DELETE /api/auth/session` still clears the browser session; if login is disabled, the next session-state response is
  authenticated again because access is no longer required.

### 4. Validation & Error Matrix

- `admin_access_required == True` and no login cookie -> private route returns `401`, `{"detail": "请先登录"}`.
- `admin_access_required == True` and wrong admin key -> `POST /api/auth/session` returns `401`,
  `{"detail": "管理员密钥不正确"}`.
- `admin_access_required == False` and no login cookie -> private workspace route follows normal application behavior.
- `admin_access_required == False` and no settings unlock -> `GET /api/settings` returns `403`,
  `{"detail": "请先解锁系统配置"}`.
- Re-enabling `admin_access_required` immediately restores the login requirement for unauthenticated clients.

### 5. Good/Base/Bad Cases

- Good: a trusted LAN deployment disables the login gate for normal product workflows while keeping settings protected.
- Base: the default deployment keeps `admin_access_required=True` and requires `ADMIN_ACCESS_KEY` login.
- Bad: storing `ADMIN_ACCESS_KEY` in DB settings; it is an env-only secret.
- Bad: treating disabled login as permission to skip `SETTINGS_ACCESS_TOKEN`; settings protection is a separate boundary.
- Bad: clearing `settings_unlocked` from `POST /api/auth/session` while login is disabled; that couples unrelated session
  concerns.

### 6. Tests Required

- Default-required route test: unauthenticated private route returns 401.
- Default-required login test: wrong admin key returns 401 with the documented detail.
- Disabled-login route test: a fresh client can access a private workspace route without logging in.
- Disabled-login session-state test: response is `{"authenticated": true, "access_required": false}`.
- Settings-boundary test: disabled login still requires `SETTINGS_ACCESS_TOKEN` before full settings reads/writes.
- No-op login test: disabled-login `POST /api/auth/session` does not clear an already unlocked settings session.
- Re-enable test: setting `admin_access_required=True` makes a fresh unauthenticated client receive 401 again.

### 7. Wrong vs Correct

Wrong:

```python
if not get_runtime_settings().admin_access_required:
    request.session.clear()
    return SessionResponse()
```

Correct:

```python
if not get_runtime_settings().admin_access_required:
    return SessionResponse()
```

## Scenario: Runtime deletion toggle for traceability

### 1. Scope / Trigger

- Trigger: changing runtime settings, `/api/settings/runtime`, product deletion, or image-session deletion.
- This is a cross-layer contract because `Settings`, config serialization, route dependencies, frontend DTOs, and UI delete
  buttons must agree on the same field and scope.

### 2. Signatures

- Runtime setting: `Settings.deletion_enabled: bool = False`.
- Config definition key: `deletion_enabled`, non-secret, boolean, category `安全与运维`.
- Runtime API response: `GET /api/settings/runtime` returns `deletion_enabled` alongside
  `image_generation_max_dimension`.
- Guard helper: `presentation.deps.require_deletion_enabled() -> None`.

### 3. Contracts

- Default behavior is evidence-preserving: `deletion_enabled` is `False` unless explicitly set through env/defaults or
  `app_settings`.
- The guard applies only to high-risk whole-record deletion routes:
  - `DELETE /api/products/{product_id}`
  - `DELETE /api/image-sessions/{image_session_id}`
- The guard must not apply to workflow editing or reference-image cleanup:
  - `DELETE /api/workflow-edges/{edge_id}`
  - `DELETE /api/workflow-nodes/{node_id}`
  - `DELETE /api/source-assets/{asset_id}`
  - `DELETE /api/image-sessions/{image_session_id}/reference-images/{asset_id}`
- `DELETE /api/auth/session` and settings reset behavior are not business deletion and must remain available.

### 4. Validation & Error Matrix

- `deletion_enabled == False` and product delete -> `403`, `{"detail": "删除功能已关闭，请联系管理员"}`.
- `deletion_enabled == False` and image-session delete -> `403`, same detail.
- `deletion_enabled == True` and product/session delete -> original application behavior, including existing busy-state
  validation.
- Reference-image deletion and workflow node/edge deletion -> original behavior regardless of `deletion_enabled`.

### 5. Good/Base/Bad Cases

- Good: public demo keeps generated content traceable by disabling whole product and whole image-session deletion.
- Base: admin temporarily enables deletion from settings, deletes a whole product/session, then disables it again.
- Bad: blocking workflow node/edge deletion; this breaks normal workbench editing and is outside the traceability goal.
- Bad: blocking reference-image deletion; image-library cleanup is not the high-risk traceability gap this toggle targets.

### 6. Tests Required

- Route test for default-disabled product delete preserving database row and storage files.
- Route test for default-disabled image-session delete preserving database row and storage files.
- Existing product/session delete success tests must explicitly enable deletion first.
- Existing workflow node/edge and reference-image delete tests must continue to pass without enabling deletion.
- Runtime config test must assert `deletion_enabled` appears in `/api/settings/runtime` and settings persistence.

### 7. Wrong vs Correct

Wrong:

```python
@router.delete("/workflow-nodes/{node_id}", dependencies=[Depends(require_deletion_enabled)])
def delete_workflow_node_endpoint(...):
    ...
```

Correct:

```python
@router.delete("/products/{product_id}", dependencies=[Depends(require_deletion_enabled)])
def delete_product_endpoint(...):
    ...
```

## Scenario: Continuous image-session branching and multi-candidate rounds

### 1. Scope / Trigger

- Trigger: changing continuous image chat generation, image-session API DTOs, provider context construction, or
  `image_session_rounds` schema.
- This is a cross-layer feature: SQLAlchemy rows, Alembic migrations, Pydantic request/response schemas, provider
  request context, frontend DTOs, and ImageChat UI state must stay in sync.

### 2. Signatures

- DB tables:
  - `image_session_assets(kind)` stores `reference_upload` and `generated_image` images.
  - `image_session_rounds(generation_group_id, candidate_index, candidate_count, base_asset_id,
    selected_reference_asset_ids, generated_asset_id)` stores one generated candidate per row.
- API request:
  - `POST /api/image-sessions/{image_session_id}/generate`
  - body fields: `prompt: string`, `size: WIDTHxHEIGHT`, `base_asset_id?: string | null`,
    `selected_reference_asset_ids?: string[]`, `generation_count?: int`, `tool_options?: object | null`.
- API response:
  - Each round returns `generation_group_id`, `candidate_index`, `candidate_count`, `base_asset_id`,
    `selected_reference_asset_ids`, `actual_size`, and the single `generated_asset`.

### 3. Contracts

- `generation_count` is the MVP batch size and must stay in `1..4` unless product requirements explicitly expand it.
- One generation request may include at most 6 image context inputs total: the explicit `base_asset_id` counts as one,
  and each `selected_reference_asset_ids` item counts as one. Reject over-limit requests instead of silently truncating
  selected references.
- A multi-candidate generation action creates N `image_session_rounds` rows that share one `generation_group_id`, each with
  a distinct `generated_asset_id`, `candidate_index` from `1..N`, and `candidate_count=N`.
- Only the first generation task in an image session may omit `base_asset_id`. Once a session has any generated round or
  any prior generation task, later submissions must include a same-session generated image as `base_asset_id`.
- Worker execution must revalidate persisted task payloads by task creation order: the earliest task may still execute
  without `base_asset_id` even though its own task row already exists, while later persisted tasks without a base fail.
- `base_asset_id` must reference a same-session `generated_image`; it is the explicit historical card the user selected
  for the next image-to-image generation.
- `selected_reference_asset_ids` must reference same-session `reference_upload` assets. They are the only session uploads
  that participate in the next provider request.
- Card branching must not blindly pass `previous_response_id` or assemble all later history images. Provider context for
  branching is explicit: selected base image first, then selected references, plus the current prompt/size.
- Product-scoped continuous sessions may still save results back to the product, but product main/reference images are not
  implicit generation context for card branching.

### 4. Validation & Error Matrix

- Missing image session -> `404`, `连续生图会话不存在`.
- `generation_count < 1` or `> 4` -> request validation `422` at the API schema, or application `400` if called directly.
- `base_asset_id` outside the session -> `404`, `会话图片不存在`.
- `base_asset_id` points to a reference upload -> `400`, `只能从会话生成图继续`.
- Missing `base_asset_id` after the session already has a round or generation task -> `400`,
  `后续生图必须选择一张本会话已生成图片作为基图`.
- `selected_reference_asset_ids` contains an asset outside the session -> `404`, `会话参考图不存在`.
- `selected_reference_asset_ids` contains a generated image -> `400`, `只能选择会话参考图参与本轮生成`.
- More than 6 total selected context images including the base -> `400`, `本轮最多选择 6 张图片上下文（含分支基图）`.
- Oversized `size` -> normalize through the shared image-size validator before generation; do not treat custom size as an
  allowlist lookup.
- Provider returns image bytes whose real dimensions differ from requested `size` -> keep `size` as the normalized request,
  store the measured bytes dimensions as provider `_productflow.actual_image_size`, and expose a provider note rather than
  silently presenting the request as the actual output.

### 5. Good/Base/Bad Cases

- Good: user selects a generated history card as the next base, selects two uploaded references, asks for 3 candidates; the API stores
  three rounds in one group and provider receives exactly the base plus two references.
- Good: user branches from an old card after newer rounds exist; newer generated images are not included unless the user
  selects one as the base.
- Base: user generates the first image with no `base_asset_id` and no references; one standalone candidate round is stored
  with a generated group id.
- Base: user uploads session references but leaves them unchecked; they remain assets but do not enter provider context.
- Bad: using the latest `provider_response_id` for every request, because provider-chain inheritance makes card branching
  unexpectedly linear.
- Bad: storing multiple returned images in one JSON blob instead of one round/asset per candidate; the UI cannot continue
  from an individual candidate reliably.

### 6. Tests Required

- API/backend test for branch from selected generated image: response and persisted row include `base_asset_id`.
- API/backend test for selected references only: provider request metadata or fake provider call count proves unchecked
  session references are excluded.
- API/backend test for no implicit later-history inheritance: branching from an old card after later rounds keeps
  `previous_response_id is None` and `history_count == 0` in the fake provider request.
- API/backend test for multi-candidate persistence: N candidates share one `generation_group_id`, have distinct
  `generated_asset_id` values, and expose `candidate_index` / `candidate_count` in responses.
- Frontend pure helper tests should cover grouping by `generation_group_id`, generation-count clamping, and reference-id
  pruning when uploads are deleted.

### 7. Wrong vs Correct

Wrong:

```python
previous_response_id = latest_round.provider_response_id
manual_references = all_session_reference_uploads + recent_generated_images
```

Correct:

```python
manual_references = [selected_base_image, *selected_session_references]
previous_response_id = None
```

Wrong:

```python
round.provider_output_json = {"images": [candidate_a, candidate_b]}
```

Correct:

```python
round.generation_group_id = group_id
round.candidate_index = index
round.generated_asset_id = asset.id
```

## Scenario: Continuous image-session lightweight status polling

### 1. Scope / Trigger

- Trigger: changing continuous image-session active-task polling, task status DTOs, or the frontend detail refresh path.
- Goal: active generation polling must not load full session assets and rounds on every tick.

### 2. Signatures

- Full detail API: `GET /api/image-sessions/{image_session_id}` returns `ImageSessionDetailResponse` with `assets`,
  all `rounds`, and `generation_tasks`.
- Lightweight status API: `GET /api/image-sessions/{image_session_id}/status` returns `ImageSessionStatusResponse`.
- Status response fields:
  - `id`, `product_id`, `title`, `created_at`, `updated_at`.
  - `rounds_count`, `latest_round_id`, `latest_generation_group_id`.
  - `has_active_generation_task`.
  - `generation_tasks` using the same task DTO fields as detail, including queue metadata, failure reason, tool options,
    provider notes, and result group id.

### 3. Contracts

- The status use case loads the `ImageSession` row and `generation_tasks`, then uses aggregate/minimal round queries for
  `rounds_count` and latest round identifiers. It must not eager-load `assets` or full `rounds`.
- Status tasks must attach the same queue metadata as full detail so the UI can show queue position and global queue counts
  while polling.
- Full detail remains the source of truth for generated assets, thumbnails, history cards, selected reference pruning, and
  generated round payloads.
- When status shows a new round or an active task reaches `succeeded` / `failed`, the frontend should refetch full detail
  once. Do not make the status response grow into a second full session detail payload.

### 4. Validation & Error Matrix

- Missing image session -> `404`, `连续生图会话不存在`, same as full detail.
- Queued task -> status includes `queue_position` / `queued_ahead_count` when available.
- Running task -> status includes global running/queued counts and `has_active_generation_task == true`.
- Terminal task without new rounds -> status is enough to show failure reason, then the frontend refetches detail once.
- Terminal task with new rounds -> status exposes `rounds_count` / latest identifiers, then the frontend refetches detail
  once to display new candidates.

### 5. Good/Base/Bad Cases

- Good: ten browsers watching active generation poll `/status` every 1500ms and fetch full detail only when output appears
  or failure completes.
- Base: a queued task keeps visible prompt, queue position, generation count, and duplicate-submit disabling without
  loading all historical rounds.
- Bad: adding `assets` or serialized `rounds` to `ImageSessionStatusResponse`; that recreates the original heavy polling.
- Bad: using status polling for ProductDetail workflow runs in this scenario; workflow status needs its own contract.

### 6. Tests Required

- Backend API test for `/status` asserts it omits `assets` and `rounds`, includes task queue metadata, and returns
  `has_active_generation_task` correctly.
- Backend API test or extension asserts completed status exposes `rounds_count`, latest identifiers, and terminal task
  result group.
- Frontend helper tests should cover merging status tasks into cached detail and deciding when status requires a full
  detail refetch.
- Frontend gates remain `pnpm --dir web lint`, `pnpm --dir web test:run`, and `just web-build`.

### 7. Wrong vs Correct

Wrong:

```python
return serialize_image_session_detail(get_image_session_detail(session, image_session_id))
```

Correct:

```python
snapshot = get_image_session_status(session, image_session_id)
return serialize_image_session_status(snapshot)
```

### Persistence and external side effects

The current pattern commits database changes before performing non-transactional file deletion:

- `delete_reference_image(...)` deletes the DB row, commits, then calls `storage.delete_image_with_variants(...)`.
- `delete_image_session(...)` deletes the DB row, commits, then calls `storage.delete_image_session_tree(...)`.

For create/update operations, file writes happen before adding the final DB asset rows. Keep storage paths relative to the
storage root; `LocalStorage.resolve()` guards against path traversal.

## Scenario: Global generated-image gallery entries

### 1. Scope / Trigger

- Trigger: changing gallery persistence, gallery API response fields, or continuous image-session "save to gallery"
  behavior.
- Gallery is a global display surface over generated image-session assets. It is not a product library replacement and not
  a file-copying workflow.

### 2. Signatures

- DB table: `image_gallery_entries(id, image_session_asset_id, image_session_round_id, created_at)`.
- Unique index: `uq_image_gallery_entries_asset_id` on `image_session_asset_id`.
- API:
  - `GET /api/gallery` -> `{items: GalleryEntryResponse[]}`.
  - `POST /api/gallery` with `{image_session_asset_id: string}` -> `GalleryEntryResponse`.

### 3. Contracts

- `image_session_asset_id` must point to an `image_session_assets.kind == generated_image` row.
- `image_session_round_id` references the round that generated the asset and may be set null by database delete behavior.
- Gallery entries reference existing generated files through `/api/image-session-assets/{asset_id}/download` URLs; they
  must not duplicate image bytes into product storage or a gallery-specific storage tree.
- Repeated saves for the same generated asset are idempotent and return the existing gallery entry.
- Response metadata should include prompt, requested size, actual size, provider/model, candidate metadata, session ID/title,
  product ID/name when available, and `created_at`.

### 4. Validation & Error Matrix

- Missing image-session asset -> `404`, `{"detail": "会话图片不存在"}`.
- Reference upload asset -> `400`, `{"detail": "只有生成结果可以保存到画廊"}`.
- Generated asset without a generating round -> `404`, `{"detail": "生成记录不存在"}`.
- Duplicate generated asset save -> existing gallery entry, no duplicate database row.

### 5. Good/Base/Bad Cases

- Good: a continuous image candidate can be saved once, then repeated clicks keep one gallery row.
- Base: product-scoped and standalone image sessions both appear in the same global gallery list.
- Bad: copying generated image bytes into `source_assets` or product storage when the user only chose "save to gallery".
- Bad: adding product-level grouping, bulk management, tags, or search inside this global display-only gallery task.

### 6. Tests Required

- Backend route test saves a generated image and verifies prompt, image URLs, size/actual size, provider/model, candidate,
  session, product, and creation metadata.
- Backend route test repeats the same save and asserts one database row.
- Backend route test rejects reference-upload assets.
- Migration test path must keep Alembic upgrade-to-head green on SQLite and PostgreSQL-compatible schema definitions.

### 7. Wrong vs Correct

#### Wrong

```python
storage.save_reference_upload(product.id, asset.original_filename, image_bytes)
```

This writes to the product library and changes product state.

#### Correct

```python
ImageGalleryEntry(image_session_asset_id=asset.id, image_session_round_id=round_item.id)
```

The gallery keeps a curated pointer to the generated asset and reuses existing download URLs.

---

## Migrations

Alembic revisions live in `backend/alembic/versions/` and use revision IDs with date and sequence, for example:

- `backend/alembic/versions/20260421_0001_initial.py`
- `backend/alembic/versions/20260423_0004_add_backend_safety_constraints.py`
- `backend/alembic/versions/20260424_0006_add_app_settings.py`

`backend/alembic/env.py` reads `get_settings().database_url` for online and offline migrations and uses
`Base.metadata` as `target_metadata`.

Migration conventions already present:

- Use explicit `revision` and `down_revision` strings.
- Add matching `upgrade()` and `downgrade()` functions.
- For PostgreSQL enum types, create/drop with `checkfirst=True` as in `20260421_0001_initial.py`.
- Add partial unique indexes with both `postgresql_where` and `sqlite_where` when tests need SQLite compatibility, as in
  `20260423_0004_add_backend_safety_constraints.py`.
- Avoid migrations that work only on PostgreSQL unless the SQLite test path is intentionally excluded and documented.

Run migrations with `just backend-migrate` for dev and `just backend-migrate-prod` for production env-only settings.
Tests include Alembic upgrade regressions in `backend/tests/test_migrations_database_constraints.py`, so schema changes
should keep that test path green.

---

## Runtime Configuration Table

`AppSetting` in `infrastructure/db/models.py` backs runtime settings edited through `/api/settings`:

```python
class AppSetting(Base, TimestampMixin):
    __tablename__ = "app_settings"

    key: Mapped[str] = mapped_column(String(120), primary_key=True)
    value: Mapped[str] = mapped_column(Text)
```

`backend/src/productflow_backend/config.py` keeps infrastructure secrets and bootstrap settings env-only
(`DATABASE_URL`, `REDIS_URL`, `SESSION_SECRET`, `ADMIN_ACCESS_KEY`, `SETTINGS_ACCESS_TOKEN`) while allowing business
settings listed in `CONFIG_DEFINITIONS` to be overridden from `app_settings`. The settings/config token is a secondary
unlock secret for `/api/settings`; only a signed-session `settings_unlocked` flag may be persisted, never the token.

When adding a runtime setting, update all of these together:

- `Settings` field in `config.py`
- `CONFIG_DEFINITIONS` / validation helpers in `config.py`
- API schema/frontend types in `web/src/lib/types.ts` if the value appears in settings UI
- tests for validation/persistence in `backend/tests/test_auth_settings_runtime_config.py`

`generation_max_concurrent_tasks` is the public-demo global provider/worker running cap. It is a runtime setting backed
by `app_settings` and must gate worker entry into provider execution or synchronous provider calls. Durable async submit
paths should still persist queued work and enqueue delivery when the current running count is already at the cap; the cap
is what makes workers wait, not a reason to reject backlog creation.
`workflow_image_generation_provider_timeout_seconds` is the workflow AI image provider timeout cap. It is also backed by
`app_settings` so operators can tune the timeout without redeploying; workflow execution must convert timeout/provider
failures into safe persisted failure reasons instead of leaking provider details.

### Scenario: Optional image-generation tool fields and automatic Images API n

#### 1. Scope / Trigger

- Trigger: adding or editing provider-level fields sent inside the OpenAI Responses `image_generation` tool object.
- Applies to runtime settings, `/api/settings`, `OpenAIResponsesImageClient`, backend provider payload tests, and the
  frontend settings UI that renders config definitions.

#### 2. Signatures

- Image provider binding config:
  - `provider_bindings[purpose="image"].config_json.responses_background_enabled` for `provider_kind="openai_responses"`
- Runtime config keys:
  - `image_tool_allowed_fields`
  - `image_tool_model`
  - `image_tool_quality`
  - `image_tool_output_format`
  - `image_tool_output_compression`
  - `image_tool_background`
  - `image_tool_moderation`
  - `image_tool_action`
  - `image_tool_input_fidelity`
  - `image_tool_partial_images`
- Continuous image session generation request:
  - `tool_options?: { model?, quality?, output_format?, output_compression?, background?, moderation?, action?,
    input_fidelity?, partial_images? }`
  - Legacy clients may still send `tool_options.n`; normalization must discard it before task persistence/provider calls.
- DB task persistence:
  - `image_session_generation_tasks.tool_options` stores validated per-request overrides so queued worker execution uses
    the same options the operator submitted.
- Response notes:
  - `ImageSessionRoundResponse.provider_notes: string[]`
  - `ImageSessionGenerationTaskResponse.provider_notes: string[]`
- Provider request shape:

```json
{
  "model": "<provider_bindings[purpose=image].model_settings_json.model>",
  "input": "<prompt or Responses multimodal input>",
  "tools": [
    {
      "type": "image_generation",
      "size": "<request size>"
    }
  ]
}
```

#### 3. Contracts

- Top-level `model` comes from the resolved image provider binding; `image_tool_model` is only the optional tool-level
  `model`.
- Defaults must remain AnyRouter-compatible: the tool object is effectively `{"type":"image_generation","size": size}`.
- Top-level Responses `background=true` is controlled by image purpose binding
  `config_json.responses_background_enabled`. It is required only when the binding `provider_kind` is `openai_responses`.
  `mock` and `openai_images` image bindings must not persist or validate this field.
- When enabled, long-running image tasks can persist a `response_id` quickly and continue through
  `responses.retrieve(...)` polling. Gateways that explicitly reject top-level `background` must trigger one automatic
  retry without the field; operators may still disable the binding field when they know a gateway is incompatible and want
  to avoid the fallback round trip.
- Do not add default `tool_choice` for image generation.
- Optional tool fields are sent only when non-empty/non-null after runtime settings normalization and when included in
  `image_tool_allowed_fields`.
- `image_tool_allowed_fields` controls frontend visibility, backend task/config persistence, and provider payload fields.
  Its default excludes `background` because OpenAI-compatible providers may reject it, while operators can explicitly
  enable it for providers that support tool-level `background`.
- `n` is not an editable image tool field. If old database/settings payloads include `n` in `image_tool_allowed_fields`,
  parsing must accept it for compatibility and normalize it away.
- Continuous image session `tool_options` override only the matching tool fields for that generation; omitted request
  fields fall back to runtime defaults.
- ProductFlow `generation_count` is the image-chat generation count. With the Images API, backend sends the same count as
  request `n` (chunked at the provider max when necessary); with Responses image-generation, backend submits separate
  one-image requests because the Responses tool has no `n` parameter.
- Workflow image-generation output count is the number of downstream `reference_image` receiver nodes. Batch-capable
  Images API providers should generate that many images in one request by setting `n` to the receiver count, then fill
  receiver nodes in order. Responses providers keep the existing one-provider-call-per-receiver behavior.
- `tool_options` has two writers: workflow node config normalization and continuous image-session request validation. Both
  must pass through `application/image_generation_core.normalize_image_generation_tool_options(...)`. Readers are workflow
  image execution, queued image-session worker execution, and serializers that expose the saved task options. The field is
  nullable; `None` means "use runtime defaults only".
- Provider request/response JSON persisted for diagnostics must continue to sanitize base64 image data.
- If a provider rejects a request that contains optional tool fields, retry once with a basic tool object containing only
  `type` and `size`. If that fallback succeeds, persist a compact compatibility note in sanitized provider metadata and
  expose it through `provider_notes`; never expose the raw provider error.
- If provider output/tool metadata reports effective fields that differ from requested fields, persist and expose a
  compact provider-adjusted note when the difference is detectable.
- Returned MIME type should be inferred from decoded bytes or provider output metadata; do not hardcode generated
  Responses images to PNG.
- When sanitizing provider SDK/request exceptions, raise the generic user-facing exception from the original exception so
  job retry classification can still inspect `__cause__` for retryable network, timeout, rate-limit, or 5xx failures.

#### 4. Validation & Error Matrix

- Empty optional string setting -> `None` at runtime, omitted from provider payload.
- Empty optional numeric setting -> `None` at runtime, omitted from provider payload.
- `image_tool_output_compression < 0` or `> 100` -> `/api/settings` returns `400`.
- `image_tool_partial_images < 0` or `> 3` -> `/api/settings` returns `400`.
- `/api/settings` update contains `image_tool_n` -> returns `400` unknown config item.
- `image_tool_allowed_fields` contains legacy `n` -> accepted and normalized away.
- `image_tool_allowed_fields` contains any other unknown field -> `/api/settings` returns `400`.
- `openai_responses` image binding lacks `responses_background_enabled` -> provider binding update returns `400`.
- `responses_background_enabled == False` -> Responses provider payload omits top-level `background`.
- `responses_background_enabled == True` and provider rejects top-level `background` -> retry without it once and keep the
  user-facing failure/detail generic if both attempts fail.
- `openai_images`, `google_gemini_image`, or `mock` image binding receives `responses_background_enabled` -> field is
  ignored and not stored.
- Per-request or workflow `tool_options` contains fields not listed in `image_tool_allowed_fields` -> field is filtered
  before persistence and provider calls.
- Per-request `tool_options.output_compression < 0` or `> 100` -> `/api/image-sessions/{id}/generate` returns `422`.
- Per-request `tool_options.partial_images < 0` or `> 3` -> `/api/image-sessions/{id}/generate` returns `422`.
- Per-request `tool_options.n < 1` or `> 10` -> `/api/image-sessions/{id}/generate` returns `422`.
- Unknown select value such as `image_tool_quality="ultra"` -> `/api/settings` returns `400`.
- Unknown per-request select value such as `tool_options.quality="ultra"` -> request validation returns `422`.
- OpenAI SDK/provider request exception -> raise a generic sanitized runtime error; do not expose API keys, raw request
  bodies, base URLs with secrets, or provider internals to the frontend.
- OpenAI SDK/provider timeout wrapped in a sanitized `RuntimeError` -> workflow/image-session failure reason remains
  generic, while retry classification follows `__cause__` and keeps retryable durable tasks retryable when the original
  exception is retryable.

#### 5. Good/Base/Bad Cases

- Good: operator sets `image_tool_output_format=jpeg` and `image_tool_output_compression=80`; the next request includes
  those two fields inside the tool object and no `tool_choice`.
- Good: operator enables `background` in `image_tool_allowed_fields`; only then do the UI and provider payload allow the
  tool-level `background` field.
- Good: operator sets per-generation `tool_options.output_format=webp`; that round uses WebP while workflow/poster
  generation still follows runtime defaults.
- Good: provider rejects optional fields, fallback with `{"type":"image_generation","size": size}` succeeds, and the
  completed round/task shows only `供应商不支持部分参数，已按基础参数完成。`.
- Base: all optional fields unset; request payload still uses only the basic `image_generation` tool object, while the
  top-level request includes `background=true` unless the runtime setting disables it or fallback removes it.
- Base: provider returns JPEG bytes even while output metadata is normalized to PNG; stored/generated MIME type is
  `image/jpeg` because byte detection wins.
- Base: provider accepts the request but reports `output_format=png` after `webp` was requested; the result remains
  successful and exposes a compact provider-adjusted note.
- Base: image chat candidate count `4` with Images API sends one request with `n=4` and persists four candidate rounds.
- Base: workflow image-generation node connected to two downstream `reference_image` nodes sends Images API `n=2` and
  fills the two receiver nodes in order.
- Bad: sending blank config values as `""` fields in the provider payload.
- Bad: changing top-level `model` to the tool override or exposing `image_tool_n` as an editable settings/API field.
- Bad: returning raw OpenAI exception strings through `/api/image-sessions/*/generate` or workflow failures.

#### 6. Tests Required

- Settings/API test that optional tool fields and `image_tool_allowed_fields` appear in `/api/settings`, persist through
  `app_settings`, normalize empty numeric values to `None`, reject out-of-range numeric/select values, omit `n` from
  settings options, and reject direct `image_tool_n` updates.
- Provider unit/integration test that default payload remains exactly `tools: [{"type":"image_generation","size": size}]`
  and omits `tool_choice`.
- Image-session test that candidate count drives Images API `n`, while `tool_options.n` is discarded before persistence.
- Workflow image-generation test that downstream receiver count drives Images API batch `n` and fills receivers in order.
- Provider test that configured optional fields are included inside the tool object and only there.
- API/schema test that image-session `tool_options` are accepted, validated, persisted on the generation task, and passed
  into `ImageChatService`.
- Provider fallback test that optional-field request failure triggers exactly one basic-tool retry and exposes only a
  compact compatibility note.
- Provider-adjusted metadata test that detectable effective field changes are persisted as compact notes.
- MIME regression test using non-PNG returned bytes.
- Retry regression test that a sanitized provider `RuntimeError` raised from a retryable network/timeout cause is still
  classified retryable by durable task failure handling where that retry policy applies.
- Keep `uv run --directory backend ruff check .`, `just backend-test`, `pnpm --dir web lint`,
  `pnpm --dir web test:run`, and `just web-build` green after cross-layer settings changes.

#### 7. Wrong vs Correct

Wrong:

```python
request_payload["tool_choice"] = {"type": "image_generation"}
tool = {
    "type": "image_generation",
    "size": size,
    "output_format": settings.image_tool_output_format or "",
}
```

Correct:

```python
tool = {"type": "image_generation", "size": size}
if settings.image_tool_output_format:
    tool["output_format"] = settings.image_tool_output_format
request_payload = {"model": resolved_config.model, "input": input_payload, "tools": [tool]}
```

Wrong:

```python
task_count = tool_options.get("n", generation_count)
```

Correct:

```python
task_count = generation_count
images_api_n = generation_count
```

### Scenario: Runtime prompt customization

#### 1. Scope / Trigger

- Trigger: editing system/template prompts used by text providers, image providers, or continuous image chat.
- This is runtime configuration, not a schema migration: values live in `app_settings` and fall back to `Settings`
  defaults when no database override exists.

#### 2. Signatures

- Config keys:
  - `prompt_brief_system`
  - `prompt_copy_system`
  - `prompt_poster_image_template`
  - `prompt_poster_image_edit_template`
  - `prompt_image_chat_template`
- API surface remains `/api/settings`; prompt fields are normal non-secret `textarea` config items.

#### 3. Contracts

- Prompt keys must be declared as `Settings` fields and listed in `CONFIG_DEFINITIONS`.
- Provider implementations must read prompts through `get_runtime_settings()` or a helper built from it; do not keep the
  only effective prompt copy inside provider methods.
- Prompt templates may expose documented placeholders, but unknown placeholders should not crash provider calls.
- `prompt_poster_image_template` is for workflow image-generation runs with an explicit copy input.
`prompt_poster_image_edit_template` is for image-edit / image-to-image runs without an explicit copy input, and must not
  require fixed copy-field placeholders to make sense.
- Prompt fields are not secrets and may be visible in the settings UI, but rendered prompts and provider payloads must not
  be logged.

#### 4. Validation & Error Matrix

- Missing `app_settings` row -> use env/default/code default prompt.
- Empty prompt update -> `400`; users should reset the key to return to default instead of saving blank prompts.
- Unknown config key -> `400` from the settings route.
- Secret/provider payload included in prompt logs -> bug; remove the log rather than redacting after the fact.

#### 5. Good/Base/Bad Cases

- Good: operator edits `prompt_copy_system`, saves settings, and the next `OpenAITextProvider.generate_copy(...)` call uses
  the database value.
- Good: an image-generation node with no copy link uses `prompt_poster_image_edit_template`, so an image-edit run does not
  inherit hard requirements for poster copy fields.
- Base: clean database has no prompt rows; providers use default prompt text from `Settings`.
- Bad: adding a new prompt in `openai_provider.py` without a `Settings` field, UI definition, reset path, and regression
  test.
- Bad: using `prompt_poster_image_template` for no-copy image edits, which forces fixed copy-field language into a task
  that should only modify existing imagery.

#### 6. Tests Required

- Settings/API regression that prompt keys are accepted and reset through `/api/settings`.
- Provider regression that database prompt overrides reach the system/template prompt passed to text/image/chat builders.
- Workflow/provider regression that copy-linked image nodes use `prompt_poster_image_template` / `copy_prompt_mode="copy"`
  and no-copy image nodes use `prompt_poster_image_edit_template` / `copy_prompt_mode="image_edit"`.
- Keep `uv run --directory backend ruff check .`, `just backend-test`, and `just web-build` green after prompt config
  changes.

#### 7. Wrong vs Correct

Wrong:

```python
system_prompt = "你是固定写死的提示词"
```

Correct:

```python
settings = get_runtime_settings()
system_prompt = settings.prompt_copy_system
```

---

## Scenario: Settings migration import and export

### 1. Scope / Trigger
- Trigger: changes to settings migration routes, settings export payloads, settings import preview/commit, provider
  profile/binding migration, or SettingsPage import/export DTOs.
- This is a cross-layer runtime-configuration contract spanning `Settings`, `CONFIG_DEFINITIONS`, `app_settings`,
  `provider_profiles`, `provider_bindings`, settings schemas/routes, and frontend settings UI.

### 2. Signatures
- Export API: `GET /api/settings/export -> SettingsExportDocument`.
- Import preview API: `POST /api/settings/import/preview -> SettingsImportPreviewResponse`.
- Import commit API: `POST /api/settings/import -> SettingsImportCommitResponse`.
- All three routes are under `/api/settings`, require normal admin auth, and require `require_settings_unlocked`.
- Export document sections: `metadata`, `runtime_config`, `provider_profiles`, and `provider_bindings`.

### 3. Contracts
- Export is for frontend-operation settings only. It includes effective runtime values from every `CONFIG_DEFINITIONS`
  key, plus active provider profiles and provider bindings.
- Export must include provider API keys because the migration file is meant to let another machine use the same configured
  providers. Normal non-export settings reads still must not echo secret values.
- Export must not include deployment/infrastructure environment settings such as `DATABASE_URL`, `REDIS_URL`,
  `SESSION_SECRET`, `ADMIN_ACCESS_KEY`, `SETTINGS_ACCESS_TOKEN`, CORS origins, ports, or storage paths.
- `runtime_config` must contain the current effective value, not only database override rows, so a clean target machine can
  import the same frontend-visible behavior.
- Import preview must validate the whole document and return counts/names/flags for confirmation without mutating the
  database.
- Import commit must validate the same document and apply it atomically: runtime settings, provider profiles, and bindings
  all change together or not at all.
- Provider bindings must be validated after imported profiles are normalized so non-mock bindings never point to missing,
  disabled, or capability-incompatible profiles.

### 4. Validation & Error Matrix
- Malformed document -> `400` with `配置文件格式不正确`.
- Unsupported schema version -> `400` with `配置文件版本不支持`.
- Unsupported compatibility marker -> `400` with `配置文件兼容标识不支持`.
- Unknown runtime config key -> `400` with `未知配置项: ...`.
- Missing runtime config key -> `400` with `配置文件缺少配置项: ...`.
- Duplicate provider profile id -> `400` with `供应商档案不能重复`.
- Empty provider name -> `400` with `供应商名称不能为空`.
- Unsupported provider type/capability/kind/purpose -> `400` with a concise provider configuration error.
- Non-mock binding without a valid compatible enabled provider profile -> `400` and no partial import.

### 5. Good/Base/Bad Cases
- Good: export from a configured workspace, import into a clean workspace, and see the same settings page values,
  provider profiles, bindings, and provider API keys.
- Good: preview an import file and show counts plus whether API keys are present before commit.
- Base: importing a `mock` text/image binding uses no provider profile id.
- Bad: exporting `ADMIN_ACCESS_KEY` or `SETTINGS_ACCESS_TOKEN`; these protect access and belong to deployment setup.
- Bad: writing runtime rows before discovering a broken provider binding, leaving a half-imported state.

### 6. Tests Required
- Settings export regression asserting runtime config includes every `CONFIG_DEFINITIONS` key and excludes env-only keys.
- Export regression asserting provider API keys are present only in the export document, not in ordinary settings/profile
  reads.
- Import preview regression asserting no database mutation.
- Import commit regression asserting runtime config, provider profiles, and bindings update together.
- Import failure regression asserting invalid version/config/binding keeps existing settings and providers unchanged.
- Keep `uv run --directory backend ruff check .`, `uv run --directory backend pytest`, and frontend build/type checks green
  after changing import/export DTOs.

### 7. Wrong vs Correct

Wrong:

```python
payload = {
    "runtime_config": {row.key: row.value for row in session.scalars(select(AppSetting))},
    "admin_access_key": get_settings().admin_access_key,
}
```

This misses env/default effective runtime values and leaks deployment secrets.

Correct:

```python
settings = get_runtime_settings()
runtime_config = {definition.key: getattr(settings, definition.key) for definition in CONFIG_DEFINITIONS}
```

Export the frontend-operable runtime settings and provider configuration only; keep deployment secrets outside the
migration file.

---

## Naming Conventions

- Table names are plural snake_case: `products`, `source_assets`, `workflow_runs`, `image_session_rounds`.
- Foreign key columns end with `_id`: `product_id`, `copy_set_id`, `generated_asset_id`.
- Unique partial indexes use descriptive names beginning with `uq_`, e.g.
  `uq_workflow_node_runs_one_active_per_node` and `uq_source_assets_one_original_per_product`.
- Foreign key constraint names are explicit only where the project already needs them for cycles or migration stability,
  e.g. `fk_products_current_confirmed_copy_set_id`.

---

## Common Mistakes to Avoid

- Storing enum member names instead of `.value` strings. The frontend and tests expect values such as `queued`, not
  `QUEUED`.
- Adding model fields without an Alembic revision.
- Updating `domain/enums.py` without updating `web/src/lib/types.ts` and tests.
- Returning ORM objects from a use case after commit without reloading relationships needed by serializers.
- Catching all SQLAlchemy failures in request handlers. Existing code lets unexpected DB errors surface, except
  `_load_database_config_overrides()` tolerates missing `app_settings` during fresh startup.
- Reading or writing absolute storage paths in the database. Persist relative paths and resolve them through
  `LocalStorage`.


--- FILE: .trellis\spec\backend\directory-structure.md ---

# Backend Directory Structure

> Actual backend organization for ProductFlow.

---

## Overview

The backend is a Python 3.12 FastAPI application under `backend/src/productflow_backend/`.
It follows the four-layer structure already described in `AGENTS.md` and `docs/ARCHITECTURE.md`:

- `presentation/` owns FastAPI routing, request dependencies, upload validation, and Pydantic response/request schemas.
- `application/` owns workflow use cases and cross-infrastructure orchestration.
- `domain/` owns shared enum values and small domain concepts.
- `infrastructure/` owns database, local storage, queues, provider implementations, and poster rendering.

`backend/src/productflow_backend/main.py` intentionally stays tiny and only exposes `app = create_app()` from
`presentation/api.py`.

---

## Directory Layout

```text
backend/
├── pyproject.toml                       # Python 3.12, pytest, Ruff, dependencies
├── alembic/
│   ├── env.py                           # Reads Settings.database_url and Base.metadata
│   └── versions/                        # Manual Alembic revisions, e.g. 20260424_0006_add_app_settings.py
├── src/productflow_backend/
│   ├── main.py                          # ASGI app entrypoint
│   ├── config.py                        # env settings + runtime database overrides
│   ├── workers.py                       # Dramatiq actors
│   ├── domain/enums.py                  # enum values shared by DB/API/frontend
│   ├── domain/errors.py                 # typed business errors shared by application and presentation mapping
│   ├── application/
│   │   ├── contracts.py                 # Pydantic contracts between use cases and providers/renderers
│   │   ├── image_sessions.py            # continuous image-session use cases
│   │   ├── product_workflows.py          # stable facade for route/worker product workflow imports
│   │   ├── product_workflow/             # product workflow internals split by owner module
│   │   │   ├── artifacts.py              # workflow artifact materialization and summaries
│   │   │   ├── context.py                # product/upstream/reference execution context helpers
│   │   │   ├── execution.py              # workflow run kickoff/execution and node dispatch
│   │   │   ├── graph.py                  # workflow graph loading, defaults, lookup, ordering
│   │   │   ├── image_generation.py       # image_generation node executor
│   │   │   ├── mutations.py              # workflow graph/edit use cases
│   │   │   ├── query.py                  # narrow workflow query service for execution hot paths
│   │   │   ├── run_state.py              # workflow run/node-run state transitions
│   │   │   ├── templates.py              # canvas template materialization helpers
│   │   │   └── user_templates.py         # user-saved canvas template use cases
│   │   ├── queue_submission.py           # durable task enqueue failure handling helper
│   │   └── use_cases.py                 # product/copy/poster workflow use cases
│   ├── presentation/
│   │   ├── api.py                       # FastAPI app factory, middleware, router registration
│   │   ├── deps.py                      # FastAPI dependencies, including auth/session dependency
│   │   ├── errors.py                    # shared route-boundary business error to HTTP mapping
│   │   ├── image_variants.py            # shared image download/variant URL and filename helpers
│   │   ├── upload_validation.py         # upload size/MIME/pixel validation
│   │   ├── routes/                      # APIRouter modules by resource
│   │   └── schemas/                     # Pydantic DTOs and serializer helpers
│   └── infrastructure/
│       ├── db/models.py                 # SQLAlchemy typed declarative models
│       ├── db/session.py                # engine/session factory dependencies
│       ├── storage.py                   # LocalStorage and image variants
│       ├── queue.py                     # Dramatiq broker and enqueue helpers
│       ├── text/                        # text provider interfaces/factories/implementations
│       ├── image/                       # image provider interfaces/factories/implementations
│       └── poster/renderer.py           # Pillow template poster renderer
└── tests/
    ├── conftest.py                      # sqlite test settings and DB fixtures
    ├── helpers.py                       # shared pytest/image/client helpers
    ├── test_auth_settings_runtime_config.py
    ├── test_error_handling.py
    ├── test_product_crud_jobs.py
    ├── test_product_workflow_*.py
    ├── test_image_sessions.py
    ├── test_storage_upload_validation.py
    ├── test_provider_payloads.py
    ├── test_queue_recovery.py
    ├── test_logging_behavior.py
    └── test_migrations_database_constraints.py
```

---

## Layer Responsibilities

### Presentation layer

Put HTTP concerns in `backend/src/productflow_backend/presentation/`:

- App assembly and middleware belong in `presentation/api.py`.
- Authentication/session dependencies belong in `presentation/deps.py` and `presentation/routes/auth.py`.
- Resource routes are grouped under `presentation/routes/`, for example:
  - `presentation/routes/products.py` handles `/api/products`, copy sets, posters, and source-asset downloads.
  - `presentation/routes/image_sessions.py` handles `/api/image-sessions` and session asset downloads.
  - `presentation/routes/settings.py` handles `/api/settings` runtime configuration.
- Request/response models and serializer functions live in `presentation/schemas/`, for example
  `presentation/schemas/products.py` and `presentation/schemas/image_sessions.py`.
- Cross-schema validators belong in `presentation/schemas/validators.py`; image download URL/filename helpers belong in
  `presentation/image_variants.py`.
- Upload validation stays in `presentation/upload_validation.py` because it raises HTTP status-specific exceptions.

Do not put provider calls, storage writes, or workflow state transitions directly in route handlers. Existing routes call
application functions such as `create_product(...)`, `submit_product_workflow_run(...)`, or
`submit_image_session_generation_task(...)` and then serialize the returned model.

### Application layer

Put workflow rules and orchestration in `backend/src/productflow_backend/application/`:

- `application/use_cases.py` owns the core product flow:
  product creation, reference images, copy/copy-confirmation edits, product deletion, and history reads.
- `application/image_sessions.py` owns continuous image-session behavior, including building provider context,
  trimming title text, attaching generated assets back to products, and deleting session storage.
- `application/contracts.py` contains Pydantic contracts shared with providers/renderers, such as
  `ProductInput`, `CreativeBriefPayload`, `CopyPayloadV2`, and `PosterGenerationInput`.
- `application/time.py` is the shared application timestamp helper for timezone-aware UTC values.
- `application/queue_submission.py` owns the small shared helper for "durable row persisted, queue delivery failed"
  handling. Submit use cases use it to mark the persisted task failed and raise `QueueUnavailableError`.
- Product workflow application logic is split by executable boundary:
  - `application/product_workflows.py` is the stable facade for route/queue/worker imports. Keep existing public use-case
    names available there while implementations live in cohesive submodules. Do not export private `_...` helpers or
    provider factory helpers through this facade.
  - `application/product_workflow/graph.py` owns product workflow graph loading, default graph templates, lookup helpers,
    topological ordering, and latest-run ordering. Keep these graph/query concerns out of
    `application/product_workflows.py`.
  - `application/product_workflow/mutations.py` owns workflow graph/edit use cases: create/update/delete nodes and edges,
    upload/bind reference images, edit generated copy, normalize the product-context singleton, and shared node patch
    semantics such as title/config normalization plus failed-node repair reset.
  - `application/product_workflow/execution.py` owns workflow run kickoff/execution, selected-node planning, and node
    dispatch. Keep node-specific provider/render orchestration in cohesive owner modules instead of growing this file
    back into a full execution monolith.
  - `application/product_workflow/run_state.py` owns workflow run/node-run state transitions: atomic node-run claiming,
    run failure/cancel marking, capacity-wait requeue scheduling, and safe workflow failure reasons.
  - `application/product_workflow/image_generation.py` owns the `image_generation` node executor, including generated
    poster/reference artifact creation, provider failure sanitization, provider timeouts, and concurrent render/provider
    calls.
  - `application/product_workflow/query.py` is the narrow workflow query-service trial for execution/reuse hot paths
    such as run reloads, node/edge lookups, source-asset existence checks, and first-class artifact lookup. Do not broaden
    this into whole-project repository conversion without a dedicated architecture task.
  - `application/product_workflow_dependencies.py` owns explicit workflow execution dependency seams for text/image
    provider resolution and poster renderer construction. Default resolvers call the infrastructure provider factories
    directly; tests that need fake providers should pass `WorkflowExecutionDependencies` rather than patching the
    `product_workflows.py` facade.
  - `application/product_workflow/context.py` owns product/incoming context collection, config parsing, upstream text
    assembly, reference input collection, and downstream reference target discovery.
  - `application/product_workflow/artifacts.py` owns workflow artifact summaries and materialization helpers such as
    workflow-local copy sets, reference slot fill, generated image records, and poster-to-reference source lookup.
  - `application/product_workflow/templates.py` owns canvas template graph materialization helpers.
  - `application/product_workflow/user_templates.py` owns user-saved canvas template create/list/rename/archive/apply
    use cases.
  Avoid importing submodules through the facade from inside other submodules; prefer direct submodule imports to prevent
  circular dependencies.

This layer receives a SQLAlchemy `Session` from callers. It is allowed to call infrastructure adapters such as
`LocalStorage`, provider factories, and `PosterRenderer`, but FastAPI-specific types should not leak into it.

`application/image_generation_core.py` owns provider-agnostic image generation helpers that are shared by product workflow
image nodes and continuous image-session generation: reference id/path de-duplication, stored image reference payload
construction, provider tool option normalization, and provider output metadata augmentation. It must not know workflow
node IDs, image-session round IDs, HTTP schemas, queue delivery, or concrete provider clients.

### Domain layer

`backend/src/productflow_backend/domain/enums.py` is the shared home for enum values such as `ProductWorkflowState`,
`SourceAssetKind`, `CopyStatus`, `JobStatus`, `PosterKind`, and `ImageSessionAssetKind`. The same string
values are mirrored in `web/src/lib/types.ts`, so enum changes are cross-layer changes.

`backend/src/productflow_backend/domain/errors.py` is the shared home for typed business errors such as `BusinessError`,
`BusinessValidationError`, and `NotFoundError`. Application use cases may raise these errors, while HTTP status conversion
still belongs in `presentation/errors.py`.

`backend/src/productflow_backend/domain/workflow_rules.py` owns DB-free workflow graph business rules such as topological
ordering, selected-node execution planning, and missing-upstream decisions. `domain/durable_generation_tasks.py` owns the
DB-free durable generation task contract shared by application submit/execution code, infrastructure queue recovery,
presentation status serializers, and worker actor assertions. Application modules adapt ORM rows into the small domain
rule/contract shapes before applying those rules; SQLAlchemy artifact existence checks stay in application/query services.

### Infrastructure layer

Put adapter code under `backend/src/productflow_backend/infrastructure/`:

- Database models/session setup: `infrastructure/db/models.py`, `infrastructure/db/session.py`.
- Local file storage and image variants: `infrastructure/storage.py`.
- Queue setup and enqueue helpers: `infrastructure/queue.py`.
- Provider interfaces and factories: `infrastructure/text/base.py`, `infrastructure/text/factory.py`,
  `infrastructure/image/base.py`, `infrastructure/image/factory.py`.
- Provider implementations stay behind those factories, for example `text/openai_provider.py`,
  `text/mock_provider.py`, `image/responses_provider.py`, and `image/mock_provider.py`.
- Continuous image chat generation is adapted in `infrastructure/image/chat_service.py`, which is called by
  `application/image_sessions.py` rather than directly from route handlers.

Provider-specific code must not leak into routes. If a new provider is added, extend the relevant infrastructure factory
and the runtime config definitions in `config.py`, then update tests and frontend settings types.

---

## Naming Conventions

- Python modules and functions use `snake_case`.
- Most product/image-session/settings route handler names end with `_endpoint`, e.g. `create_product_endpoint` and
  `generate_image_session_round_endpoint`; `presentation/routes/auth.py` keeps shorter names such as `create_session`.
- Internal helper functions are prefixed with `_`, e.g. `_raise_http_error`, `_get_product_or_raise`,
  `_load_database_values`.
- In `application/`, a leading `_` means "module-private". Do not import `_...` helpers/classes from sibling
  `application` modules. If a helper is intentionally shared across submodules, give it a public name in its owning
  module, for example `optional_config_text(...)`, `fill_reference_node(...)`, or `GeneratedWorkflowImage`. If it is
  only needed by one module, keep the `_...` helper in that module instead of exporting it through another file.
- Pydantic response/request classes use descriptive `PascalCase` names ending in `Response` or `Request`, for example
  `ProductDetailResponse`, `ConfigUpdateRequest`, and `GenerateImageSessionRoundRequest`.
- SQLAlchemy models use singular `PascalCase` class names and plural table names, e.g. `Product` -> `products`,
  `SourceAsset` -> `source_assets`.

---

## Examples to Copy

- App creation: `backend/src/productflow_backend/presentation/api.py` registers CORS, session middleware, `/healthz`,
  and routers in one place.
- Product route shape: `backend/src/productflow_backend/presentation/routes/products.py` accepts FastAPI inputs,
  delegates to `application/use_cases.py`, and serializes with `presentation/schemas/products.py`.
- Business error mapping: application use cases raise typed `BusinessError` subclasses, and
  `presentation/errors.py` registers the FastAPI handler that preserves the `{"detail": "..."}` response shape. Do not
  add route-local raw `ValueError` adapters for expected business failures.
- Continuous image sessions: `backend/src/productflow_backend/presentation/routes/image_sessions.py` delegates to
  `application/image_sessions.py`, which delegates provider-specific chat generation to
  `infrastructure/image/chat_service.py`, and keeps download handling in the route.
- Provider selection: `backend/src/productflow_backend/infrastructure/text/factory.py` and
  `backend/src/productflow_backend/infrastructure/image/factory.py` choose implementations from runtime settings.
- Tests: `backend/tests/test_*.py` are split by behavior area. Keep shared image/client/workflow helpers in
  `backend/tests/helpers.py`, and put regressions near their owning theme: auth/settings/runtime config, error handling,
  product CRUD, product workflow DAG/mutations/queue recovery, image sessions, storage/upload validation,
  provider payloads, queue/logging behavior, and migrations/database constraints.

---

## Avoid

- Adding new route modules without including them in `presentation/api.py`.
- Duplicating frontend-facing DTO shapes outside `presentation/schemas/`.
- Importing OpenAI, Pillow renderer details, Redis/Dramatiq, or storage path manipulation directly from route modules.
- Changing enum string values without updating SQLAlchemy models/migrations, Pydantic schemas/tests, and
  `web/src/lib/types.ts`.


--- FILE: .trellis\spec\backend\error-handling.md ---

# Backend Error Handling

> Actual error propagation and API error response patterns used by ProductFlow.

---

## Overview

ProductFlow keeps business validation in the application layer and HTTP status mapping in the presentation layer.
API error details are currently Chinese strings because the private workspace UI is Chinese.

Key files:

- `backend/src/productflow_backend/application/use_cases.py`
- `backend/src/productflow_backend/application/image_sessions.py`
- `backend/src/productflow_backend/presentation/errors.py`
- `backend/src/productflow_backend/presentation/routes/products.py`
- `backend/src/productflow_backend/presentation/routes/image_sessions.py`
- `backend/src/productflow_backend/presentation/routes/settings.py`
- `backend/src/productflow_backend/presentation/upload_validation.py`
- `backend/src/productflow_backend/presentation/routes/auth.py`

---

## Business Errors

Application use cases raise typed business errors for expected failures where the HTTP status is part of the business
semantics. Keep the error classes below the presentation layer and map them to HTTP only at the route boundary.

Key class home:

- `backend/src/productflow_backend/domain/errors.py`

Current typed errors:

- `BusinessError`: base class for expected user-facing failures, defaults to `400`.
- `BusinessValidationError`: explicit `400` for valid HTTP requests that are invalid for the current workflow state or
  selected resource.
- `NotFoundError`: explicit `404` for missing domain/application resources.
- `ResourceBusyError`: explicit `429` for future hard resource boundaries that cannot be represented as durable queued
  work. Current durable generation submissions should queue instead of using this error for a full running-capacity slot.
- `QueueUnavailableError`: explicit `503` when a durable task row was created but Redis/Dramatiq delivery failed.

Typed business errors intentionally subclass `ValueError` for Python compatibility with older code paths, but HTTP
mapping must not rely on raw `ValueError` catches or message suffixes.

Use typed errors for newly touched expected failures:

- Missing records: `_get_product_or_raise(...)` raises `NotFoundError("商品不存在")` in `application/use_cases.py`.
- Missing workflow/session resources such as products, workflows, nodes, edges, image sessions, source assets, copy sets,
  and poster variants should use `NotFoundError`.
- Explicit workflow validation such as the missing poster file case raises `BusinessValidationError("海报文件不存在")`
  so it remains a `400` without a string-content exception in typed mapping.
- Workflow graph integrity or selection problems that were legacy `400`s, such as an edge referencing a node outside the
  loaded graph, should use `BusinessValidationError` rather than `NotFoundError`.

The legacy route-level `ValueError` fallback has been removed from production code after the high-traffic route migration.
Newly touched application/business failures must use typed errors. Parser, provider, and internal normalization helpers
may still raise raw `ValueError` when they do not own route-facing HTTP status semantics.

FastAPI registers a global handler for typed `BusinessError` subclasses during app creation. Route handlers may let typed
business errors propagate directly; the response remains the standard FastAPI-compatible shape:

```json
{"detail": "<message>"}
```

Do not add global handlers for raw `ValueError` or `Exception`.

---

## Route-Level Mapping

`presentation/errors.py::register_exception_handlers(...)` is called from `presentation/api.py::create_app(...)` and
registers the `BusinessError` HTTP boundary. This handler maps only typed expected business failures.

Do not reintroduce a shared route adapter that maps raw `ValueError` to HTTP by Chinese string content. If a route-facing
use case still exposes a raw expected business failure, convert the owner use case to `BusinessValidationError`,
`NotFoundError`, `QueueUnavailableError`, or another existing typed `BusinessError` subclass.

Examples:

- `presentation/routes/product_workflows.py` lets typed business errors propagate through the global handler after the
  workflow use cases were inventoried as typed at the route boundary.
- `presentation/routes/products.py`, `presentation/routes/image_sessions.py`, and `presentation/routes/gallery.py` let
  typed business errors propagate through the global handler after their route-facing failures were inventoried as typed.
- Download/file-serving routes may still catch `ValueError` from `LocalStorage.resolve_for_variant(...)` and raise direct
  `HTTPException(404)` because the route owns file-serving semantics.
- Settings routes may still translate local configuration normalization `ValueError` into direct `HTTPException(400)`
  because settings unlock/runtime validation is presentation-owned.

When adding or touching use cases, prefer `BusinessValidationError` / `NotFoundError` over raw `ValueError` for expected
business failures. Keep using direct `HTTPException` for HTTP-owned protocol boundaries such as auth/session, settings
unlock, upload validation, and download/file serving. Do not import FastAPI `HTTPException` into application modules.

### Scenario: Typed business errors at the route boundary

#### 1. Scope / Trigger

- Trigger: adding or touching expected application/business failures that routes convert into API errors.
- Applies to `application/` use cases, `domain/errors.py`, and `presentation/errors.py`.

#### 2. Signatures

- `BusinessError(message: str)` -> default `status_code = 400`.
- `BusinessValidationError(message: str)` -> `status_code = 400`.
- `NotFoundError(message: str)` -> `status_code = 404`.
- `presentation.errors.register_exception_handlers(app: FastAPI) -> None`.
- `presentation.errors.business_error_exception_handler(request: Request, exc: BusinessError) -> JSONResponse`.

#### 3. Contracts

- API response shape remains FastAPI standard `{"detail": "<message>"}`.
- `detail` is `str(exc)` / the Chinese user-facing message.
- Typed error subclasses may carry status semantics internally, but routes must not add frontend-visible `code` fields
  unless a future cross-layer task updates frontend handling.

#### 4. Validation & Error Matrix

- `NotFoundError("商品不存在")` -> `404`, `{"detail": "商品不存在"}`.
- `BusinessValidationError("海报文件不存在")` -> `400`, `{"detail": "海报文件不存在"}`.
- `BusinessValidationError("工作流连线引用了不存在的节点")` -> `400`,
  `{"detail": "工作流连线引用了不存在的节点"}`.
- `BusinessError("请选择一张图片")` -> `400`, `{"detail": "请选择一张图片"}`.
- `QueueUnavailableError("任务队列暂不可用，请稍后重试")` -> `503`,
  `{"detail": "任务队列暂不可用，请稍后重试"}`.
- Raw `ValueError("旧资源不存在")` must not be globally mapped to HTTP. Convert the owning route-facing use case to a typed
  business error instead.

#### 5. Good/Base/Bad Cases

- Good: `_get_product_or_raise(...)` raises `NotFoundError("商品不存在")`.
- Base: provider/Pydantic payload normalization may still raise `ValueError` inside parsing boundaries; route-facing
  business use cases should raise typed errors.
- Bad: adding a new `if detail.endswith(...)` or exact Chinese string branch for newly converted typed errors.

#### 6. Tests Required

- Unit test typed `NotFoundError("资源已移除")` maps to `404` even without an `"不存在"` suffix.
- Unit test generic `BusinessError` maps to `400`.
- Unit test `QueueUnavailableError` maps to `503`.
- Route/global-handler test typed `BusinessError` preserves response shape `{"detail": "..."}` and does not add a `code`
  field.
- Unit or route test poster-file missing remains `400` with detail `"海报文件不存在"`.
- Application-level test newly touched business validations raise `BusinessValidationError`, for example product field
  validation, workflow graph validation, and image-session generation validation.
- Regression test route surfaces that used to have wrappers, such as product detail, image-session detail/generation, and
  gallery save, use the global typed handler.
- Regression test the legacy raw `ValueError` helper is absent from `presentation.errors`.

#### 7. Wrong vs Correct

Wrong:

```python
if detail.endswith("不存在"):
    raise HTTPException(status_code=404, detail=detail)
```

Correct:

```python
if product is None:
    raise NotFoundError("商品不存在")
```

---

## Authentication and Session Errors

`presentation/deps.py::require_admin` protects private API routes with a session flag when
`get_runtime_settings().admin_access_required` is true. It raises:

- `401` with detail `"请先登录"` when the session is not authenticated.

When `admin_access_required` is false, `require_admin` allows private workspace routes without the admin login session.
This does not bypass `presentation/routes/settings.py::require_settings_unlocked`; full settings reads/writes still require
the independent `SETTINGS_ACCESS_TOKEN` unlock.

`presentation/routes/auth.py::create_session` compares the submitted admin key with `Settings.admin_access_key` while
login is required and raises:

- `401` with detail `"管理员密钥不正确"` for an invalid key.

When login is disabled, `POST /api/auth/session` is a harmless no-op success and leaves the current session untouched. `GET
/api/auth/session` returns `authenticated=true` and `access_required=false`; after login is re-enabled, an unauthenticated
session again returns `authenticated=false` and `access_required=true`.

Routes that require auth use `dependencies=[Depends(require_admin)]` on the router, for example
`presentation/routes/products.py`, `presentation/routes/image_sessions.py`, `presentation/routes/product_workflows.py`,
and `presentation/routes/settings.py`.

`presentation/api.py` registers `presentation/session.py::ClockStableSessionMiddleware` for signed cookie sessions. It is
a thin wrapper around Starlette's session middleware that keeps the timestamp signer monotonic within the process. This
preserves normal `max_age` expiry while preventing a brief wall-clock rollback from making a freshly issued session cookie
look future-dated and unauthenticated. Large clock jumps are not retained after the wall clock recovers, so the middleware
does not keep signing cookies with a stale future timestamp. Keep rollback regression tests green when touching this
middleware.

---

## Upload and Resource Boundary Errors

`presentation/upload_validation.py` raises `HTTPException` directly because it owns HTTP-specific upload status codes:

- `415` for unsupported declared or detected MIME types.
- `413` when the uploaded image exceeds `upload_max_image_bytes`.
- `400` for empty files, undecodable images, pixel count overflow, or declared/detected MIME mismatch.

Routes call `read_validated_image_upload(...)` before delegating to application use cases. Do not duplicate image decoding
or byte-size checks in individual route handlers.

---

## Queue and Durable Task Errors

Application submit use cases create durable work first, then enqueue through `infrastructure/queue.py`:

- `application/product_workflow/execution.py::submit_product_workflow_run(...)` creates/reuses `WorkflowRun` rows,
  enqueues when `_workflow_run_should_enqueue(...)` says delivery is needed, and marks enqueue failures through
  `mark_workflow_run_enqueue_failed(...)`.
- `application/image_sessions.py::submit_image_session_generation_task(...)` creates the
  `ImageSessionGenerationTask`, enqueues it, and marks enqueue failures through
  `mark_image_session_generation_task_enqueue_failed(...)`.
- All submit use cases raise `QueueUnavailableError("任务队列暂不可用，请稍后重试")` after marking persisted state failed.
  The typed business error handler preserves status `503` plus the stable FastAPI error shape
  `{"detail": "任务队列暂不可用，请稍后重试"}`.
- Worker actors in `backend/src/productflow_backend/workers.py` use `@dramatiq.actor(max_retries=0)` and rely on
  application execution entrypoints to persist failure/retry state.

Keep queue send failures visible to the API caller; do not leave a `QUEUED` durable task silently unenqueued. Route
modules should remain HTTP adapters: they call the submit use case, let typed `BusinessError`s reach the global handler,
and serialize the returned model.

Public-demo durable generation entrypoints persist queued work before provider execution:

- workflow run kickoff
- continuous image-session generation

For idempotent routes that can return an already-active `WorkflowRun`, check/reuse the existing active record before
creating another durable run. The global cap protects provider/worker execution, not durable backlog creation; submissions
must remain able to create queued work and re-enqueue stranded active workflow runs while all running slots are occupied.

When a worker sees the running cap is reached, leave the durable task queued, do not call the provider, and schedule a
delayed delivery retry. Do not leak queue, Redis, provider, or filesystem exception strings to users. Provider messages may
be persisted only after sanitization and categorization. Common provider/network failures should map to concise
user-facing categories: rate limit/quota, content-policy refusal, connection interruption, request timeout, unsupported
parameters, and provider 5xx/service failure. Safe, actionable uncategorized details such as unsupported dimensions can be
shown with a `图片生成失败：...` prefix, while messages containing API keys, tokens, base URLs, prompts, request bodies,
file paths, or tracebacks must fall back to the generic queue/provider failure detail.

### Scenario: Continuous image-session worker partial-success and timeout handling

#### 1. Scope / Trigger

- Trigger: changing continuous image-session generation, Dramatiq worker actors, generation task recovery, or provider
  failure handling for `ImageSessionGenerationTask`.
- This is an infra + database contract because PostgreSQL is the authoritative task/result state while Redis/Dramatiq is
  only delivery.

#### 2. Signatures

- Durable task table: `image_session_generation_tasks`.
- Result tables: `image_session_assets` and `image_session_rounds`.
- Worker actor: `workers.run_image_session_generation_task(task_id: str)`.
- Application entrypoint: `application.image_sessions.execute_image_session_generation_task(task_id: str) -> None`.
- Continuous generation task statuses use existing `JobStatus`: `queued`, `running`, `succeeded`, `failed`.
- Stale-running recovery uses a heartbeat/idle model: compare the cutoff with
  `ImageSessionGenerationTask.progress_updated_at`, falling back to `started_at` for older rows that do not have progress
  metadata. The user-facing runtime setting is `image_session_stale_running_after_minutes`, defaulting to 90 minutes.
- The Dramatiq actor keeps only an internal worker failsafe `time_limit` from
  `image_session_worker_failsafe_time_limit_minutes`; this is not the product-level timeout decision.

#### 3. Contracts

- A queued generation task may transition only through worker-owned execution:
  - `queued` -> `running` only when `_mark_image_generation_task_running(...)` wins the compare-and-set update and the
    global running generation capacity still has a free slot.
  - `running` -> `succeeded` after all requested candidates have been saved.
  - `running` -> `failed` after provider failure, timeout, or other safe-to-handle worker exception.
- The global generation cap has one DB-backed execution gate: worker claims check current `running` work before entering
  provider execution, so existing queued backlog can grow without allowing provider calls to exceed the configured cap.
- PostgreSQL runtime must serialize worker-claim capacity checks with the transaction advisory lock. SQLite tests may skip
  the advisory lock, but production worker processes must not rely on in-process counters.
- When a worker sees no running capacity for a queued task, it must leave the task `queued`, keep `attempts` unchanged,
  set progress to a waiting state, and schedule a delayed delivery retry. It must not call the provider or mark the task
  failed just because capacity is currently full.
- Multi-candidate image-session generation must persist each successful candidate independently:
  - save generated bytes under storage;
  - insert `image_session_assets`;
  - insert matching `image_session_rounds`;
  - commit that candidate before requesting the next candidate.
- If a later candidate fails or times out, earlier committed candidates remain visible and keep one
  `generation_group_id`.
- Running tasks must persist durable progress metadata while they advance:
  - `completed_candidates`;
  - `active_candidate_index`;
  - `progress_phase`;
  - `progress_updated_at`;
  - current `provider_response_id` / `provider_response_status` when available.
- OpenAI Responses image generation should use background response creation and `responses.retrieve(...)` polling when the
  provider supports it. Each provider status response should refresh task progress while generation is still working.
- Provider progress metadata fields are nullable because queued, legacy, failed-before-provider, and capacity-waiting tasks
  may not have provider state. Writers are `application/image_sessions.py` worker progress helpers and
  `infrastructure/queue.py` recovery helpers; readers are image-session status/detail serializers and recovery queries.
  Serializers must pass through `None` for missing old rows rather than inventing placeholder values.
- `progress_metadata` is a compact backend-owned snapshot for UI/debug display. Current keys are optional and may include
  `provider_response`, `candidate_index`, `candidate_count`, `generated_asset_id`, and `round_id`; code that reads it must
  tolerate missing keys and non-provider tasks.
- Failure/retry settlement must update `ImageSessionGenerationTask` independently from the parent `ImageSession`. Parent
  `updated_at`/title touches should use tolerant SQL `UPDATE image_sessions ... WHERE id = ...`-style updates instead of
  requiring a live parent ORM instance, because the session row may have been deleted or a previously loaded ORM row may
  be stale while a worker is settling provider failure.
- Worker-owned failed/timeout tasks use application-level retry instead of Dramatiq actor retries:
  - `workers.run_image_session_generation_task` must keep `max_retries=0`.
  - each worker claim increments `ImageSessionGenerationTask.attempts`.
  - retryable failures while `attempts` is below the application cap reset the same task to `queued`, set
    `progress_phase="auto_retry_queued"`, preserve the latest safe failure snapshot in `progress_metadata`, and
    re-enqueue the task.
  - retryable failures after the cap is reached become `failed`, set `finished_at`, and remain `is_retryable=true` so the
    owning image session can expose a manual retry action.
  - non-retryable provider rejections become `failed` immediately, set `finished_at`, and set `is_retryable=false`. This
    includes content-policy/safety refusals, unsupported or invalid provider parameters, and explicit request rejections.
  - a sanitized safe detail, generic detail, or partial-success `failure_reason` is stored only on the terminal failed
    state.
  - `completed_candidates` and `result_generation_group_id` must be preserved when at least one candidate was already
    persisted.
- Auto-retry progress metadata is optional and backend-owned. Current keys include `last_failure_reason`,
  `last_failure_category`, `last_failure_retryable`, `retry_hint`, `auto_retry_attempt`, and `max_attempts`. Serializers
  pass it through so the frontend can show the last safe failure while the task is queued for automatic retry.
- `KeyboardInterrupt` and `SystemExit` must still propagate. Other `BaseException` subclasses raised by Dramatiq time
  limits should be converted into durable task failure state before returning.

#### 4. Validation & Error Matrix

- All candidates succeed -> task `succeeded`, `failure_reason = null`, `result_generation_group_id` set.
- Candidate 1 succeeds, candidate 2 provider call fails -> task `failed`, first round/asset remains, failure reason
  mentions partial completion without provider secrets.
- Candidate 1 succeeds, candidate 2 raises `TimeLimitExceeded` -> task `failed`, first round/asset remains, failure
  reason is `"已生成 1/2 张候选，但任务超时，剩余候选未完成。"`.
- Stale running task with fresh `progress_updated_at` but old `started_at` -> remains `running`; recovery must not reset it.
- Stale running task with already completed candidates -> recovery marks `failed` with the partial-timeout reason and does
  not auto-requeue, because the worker's in-flight provider state is unknown.
- Timeout or safe worker exception before any candidate is committed -> task `failed`, no rounds/assets, sanitized safe
  detail or generic `"图片生成失败，请稍后重试"` only after the automatic retry cap is reached.
- Retryable provider/network failure before the retry cap -> task returns to `queued`, `failure_reason = null`,
  `progress_phase = "auto_retry_queued"`, and `progress_metadata.last_failure_reason` contains the safe user-facing
  reason.
- Content-policy/safety refusal -> task `failed`, `is_retryable = false`, no automatic retry, and manual retry endpoint
  returns `400` with `"该生成任务不可重试"`.
- Unsupported provider parameter or actionable unsupported dimension -> task `failed`, `is_retryable = false`, no
  automatic retry. Safe dimension details such as `"image2 不支持 64x64，最小尺寸为 512x512"` may keep the
  `图片生成失败：...` prefix.
- Queued task consumed while global running capacity is full -> task remains `queued`, `attempts` stays unchanged,
  provider is not called, progress phase becomes a waiting-for-capacity state, and the task is re-enqueued with delay.
- Partial failure after candidate 1 of 2 -> automatic retry preserves the existing generation group and resumes at
  candidate 2 without calling the provider for candidate 1 again.
- Duplicate worker message for a terminal task -> no-op; do not call the provider again.
- Duplicate worker message for an already running non-stale task -> no-op; recovery handles stale running tasks separately.
- Provider failure after the parent `ImageSession` has disappeared or become stale -> worker still marks the durable
  task failed/retryable when the task row exists; no unhandled `StaleDataError` should escape the actor.

#### 5. Good/Base/Bad Cases

- Good: a four-candidate request commits candidate 1, 2, and 3 before candidate 4 starts; if candidate 4 times out, the
  UI can still show the first three candidates and `has_active_generation_task` becomes false.
- Base: a one-candidate provider failure stores a generic failed task with no generated rounds.
- Bad: wrapping the entire multi-candidate loop in one transaction; this loses already-paid successful images when a later
  provider call fails.
- Bad: checking global capacity only when the HTTP request creates the queued row; restart recovery, automatic retry, or
  multiple Dramatiq messages can still let too many queued tasks enter provider execution.
- Bad: letting `TimeLimitExceeded` escape without task cleanup; this leaves `running` rows that block the UI and may be
  re-enqueued after restart.
- Bad: retrying a partial-success task from candidate 1 with a new generation group; this duplicates provider spend and
  creates confusing duplicate candidates.
- Bad: enabling generic Dramatiq actor retries; this bypasses the database retry cap and can duplicate work outside the
  application-level state machine.
- Bad: touching `task.session.updated_at` or a loaded `ImageSession` ORM object during failure settlement; stale/deleted
  parents can make task failure persistence itself fail.

#### 6. Tests Required

- Worker test: partial success followed by `TimeLimitExceeded` keeps the committed round/asset, auto-retries the same task,
  resumes at the remaining candidate, and does not duplicate the saved candidate.
- Worker test: repeated provider failure stops at the application retry cap, marks the task `failed`, exposes either the
  sanitized safe detail or generic safe reason as appropriate, and leaves `is_retryable=true`.
- Worker test: retryable failure before the retry cap exposes `progress_metadata.last_failure_reason` while the task is
  queued for automatic retry.
- Worker test: content-policy and unsupported-parameter failures stop immediately with `is_retryable=false` and do not
  enqueue an automatic retry.
- Worker test: wrapped provider exceptions still inspect the exception chain so rate limits, content-policy refusals,
  connection interruptions, provider 5xx errors, and unsupported-parameter failures do not collapse into the outer generic
  request-failure text.
- Worker test: timeout outside the per-candidate loop still marks the task `failed` with the generic safe reason.
- Worker progress test: provider polling callbacks update durable progress fields while the task remains running.
- Worker test: provider failure still settles the task when the parent `ImageSession` row is missing/stale.
- Worker capacity test: if another workflow/image task already fills the global running cap, executing a queued
  `ImageSessionGenerationTask` leaves it queued, does not increment attempts, does not call the provider, and schedules a
  delayed requeue.
- Worker actor test: `run_image_session_generation_task` has an internal failsafe `time_limit`; user-facing timeout
  behavior is covered by stale-running idle recovery tests.
- Existing duplicate-message tests must continue proving terminal/running tasks do not call the provider again.

#### 7. Wrong vs Correct

Wrong:

```python
try:
    for _ in range(generation_count):
        save_candidate_without_commit()
    session.commit()
except Exception:
    session.rollback()
    raise
```

Correct:

```python
for candidate_index in range(1, generation_count + 1):
    try:
        save_candidate()
        session.commit()
    except BaseException as exc:
        session.rollback()
        mark_task_failed_without_retry(...)
        return
```

Wrong:

```python
if task.status == JobStatus.QUEUED:
    task.status = JobStatus.RUNNING
    session.commit()
    call_provider()
```

Correct:

```python
if not generation_running_capacity_available(session):
    keep_task_queued_and_reenqueue_later()
    return
claim_queued_task_as_running()
call_provider()
```

---

## Provider and Runtime Errors

Provider-specific API errors are handled inside application/provider code and persisted on durable workflow or
image-session task rows for async product flows.

`config.py::_load_database_config_overrides()` intentionally tolerates missing `app_settings` tables during fresh startup
by returning `{}` for operational/programming SQLAlchemy errors, but it re-raises unexpected non-SQLAlchemy exceptions.

---

## API Error Shape

FastAPI returns the standard shape:

```json
{"detail": "..."}
```

The frontend API wrapper in `web/src/lib/api.ts` expects this shape and throws `ApiError(status, detail)`. Keep `detail`
plain and user-readable; do not return stack traces or provider secrets.

---

## Avoid

- Raising `HTTPException` from `application/` or `infrastructure/` modules.
- Swallowing queue/provider/storage failures without updating job state or returning a meaningful HTTP error.
- Returning raw exception strings that may include API keys, paths outside storage root, or provider request bodies.
- Changing Chinese user-facing `detail` text without checking frontend pages that display it directly.
- Letting route-facing raw `ValueError`s reach the API boundary; convert expected business failures to typed
  `BusinessError` subclasses and leave parser/provider/internal `ValueError`s inside their owner boundaries.
- Adding new string-suffix status checks for converted business errors; add or reuse a typed `BusinessError` subclass
  instead.


--- FILE: .trellis\spec\backend\index.md ---

# Backend Development Guidelines

> Project-specific backend conventions for ProductFlow.

---

## Overview

These files document the backend conventions that are actually present in this repository. They are based on
`AGENTS.md`, `backend/pyproject.toml`, `justfile`, `docs/ARCHITECTURE.md`, and the current code under
`backend/src/productflow_backend/` and `backend/tests/`.

---

## Guidelines Index

| Guide | Description | Status |
|-------|-------------|--------|
| [Directory Structure](./directory-structure.md) | FastAPI/application/domain/infrastructure layout and file placement | Filled |
| [Database Guidelines](./database-guidelines.md) | SQLAlchemy models, sessions, Alembic migrations, runtime settings | Filled |
| [Error Handling](./error-handling.md) | ValueError-to-HTTP mapping, upload errors, auth, queue/provider boundaries | Filled |
| [Quality Guidelines](./quality-guidelines.md) | Ruff/pytest tooling, tests, required/forbidden backend patterns | Filled |
| [Logging Guidelines](./logging-guidelines.md) | Current minimal logging reality and safe logging extension rules | Filled |

---

## Pre-Development Checklist

Before backend changes, read:

1. `./directory-structure.md`
2. `./quality-guidelines.md`
3. The topic-specific file for the area you are changing:
   - database/schema/config: `./database-guidelines.md`
   - API/business failures/uploads: `./error-handling.md`
   - observability/logging: `./logging-guidelines.md`
   - product workbench DAG: `./product-workflow-dag.md`

If a backend change affects frontend API contracts, also read `../frontend/type-safety.md` and
`../frontend/state-management.md`.

---

**Language**: All documentation in this directory is written in English.


--- FILE: .trellis\spec\backend\logging-guidelines.md ---

# Backend Logging Guidelines

> Current logging reality and safe extension rules for ProductFlow.

---

## Overview

The application backend now uses standard-library logging with a process-wide configuration that keeps stdout visible and
writes persistent rotating log files. Runtime output also comes from Uvicorn/FastAPI, Dramatiq, exceptions, tests, and
persisted durable task state.

Current observability files and mechanisms:

- `backend/src/productflow_backend/infrastructure/logging.py` configures stdout plus rotating file logs and deletes expired
  log files.
- `backend/src/productflow_backend/infrastructure/logging.py` also owns the process-local log context backed by
  `contextvars`: `request_id`, `workflow_run_id`, `workflow_node_run_id`, and
  `image_session_generation_task_id`.
- `backend/src/productflow_backend/presentation/api.py` sets API request context from `X-Request-ID` or a generated id and
  returns the same value in the response header.
- `backend/src/productflow_backend/workers.py` sets worker context at the Dramatiq actor boundary for product workflow
  run schedulers, product workflow node runs, and continuous image-session generation tasks, then clears it when the actor
  returns or raises.
- `backend/src/productflow_backend/workers.py` persists async workflow and continuous image generation state through
  application use cases rather than logging retry state only.
- `backend/src/productflow_backend/application/product_workflow/execution.py` and
  `backend/src/productflow_backend/application/product_workflow/run_state.py` update `WorkflowRun` /
  `WorkflowNodeRun` status and failure fields.
- `backend/src/productflow_backend/application/image_sessions.py` updates `ImageSessionGenerationTask` status,
  failure, attempt, queue, and result fields.
- `backend/tests/test_queue_recovery.py`, `backend/tests/test_product_workflow_queue_recovery.py`, and
  `backend/tests/test_logging_behavior.py` assert workflow/image-session retry, recovery, and logging behavior through
  durable state, filesystem state, and HTTP responses.

Because this project uses a small standard-library logging setup, do not invent a separate framework in random modules. If
logging is needed, add it deliberately and consistently through `logging.getLogger(__name__)`.

---

## What Exists Today

### Server and worker logs

- `just backend-run` runs Uvicorn through `uv run --directory backend uvicorn productflow_backend.main:app --reload ...`.
- `just backend-worker` runs Dramatiq through `uv run --directory backend dramatiq --processes 2 --threads 4
  productflow_backend.workers`.

Those tools provide process-level logs. ProductFlow configures the root Python logger once per process so application logs
continue to reach stdout/stderr and are mirrored into a rotating file handler.

### Persisted operational state

For product workflow and continuous image-session tasks, durable state is preferred over log-only state:

- `WorkflowRun.status` / `WorkflowNodeRun.status` track DAG execution.
- `ImageSessionGenerationTask.status` tracks `queued`, `running`, `succeeded`, or `failed`.
- Failure reason, attempt, queue, and result fields are stored on the owning durable rows.

This is why queue/recovery tests verify durable records rather than scraping logs.

---

## If You Add Logging

Use the Python standard `logging` module unless the project first adopts a broader logging dependency. Recommended shape
for new modules:

```python
import logging

logger = logging.getLogger(__name__)
```

Then log at the boundary where the event is meaningful:

- `info`: lifecycle events that operators need, such as worker job start/finish, queue recovery summaries, or provider
  mode selection.
- `warning`: recoverable anomalies worth investigation, such as provider fallback, sanitized provider failure, capacity
  requeue, or a failed thumbnail variant fallback in `LocalStorage.resolve_for_variant(...)` if that behavior becomes
  hard to diagnose.
- `exception`: unexpected failures that are caught and would otherwise disappear, such as durable enqueue failure after
  a row was already created or an automatic retry enqueue failure.
- `error`: handled failures that are not exceptions at the logging site but still need operator attention.
- `debug`: local-only details that are too noisy for normal runs.

Do not add noisy route-level logs for ordinary successful requests or ordinary user-caused `4xx` business validation
errors. Uvicorn access logs and HTTP responses already cover those paths.

Do not add `print(...)` to backend application code for diagnostics. Use tests or temporary local instrumentation instead.

## Scenario: Request and worker log context

### 1. Scope / Trigger
- Trigger: adding API middleware, worker actor boundaries, queue recovery, or logging formatter changes that affect
  request/job/task correlation.

### 2. Signatures
- `new_request_id() -> str`
- `set_request_id(request_id: str) -> Token[str]` / `reset_request_id(token: Token[str]) -> None`
- `set_workflow_run_id(workflow_run_id: str) -> Token[str]` / `reset_workflow_run_id(token: Token[str]) -> None`
- `set_workflow_node_run_id(workflow_node_run_id: str) -> Token[str]` /
  `reset_workflow_node_run_id(token: Token[str]) -> None`
- `set_image_session_generation_task_id(task_id: str) -> Token[str]` /
  `reset_image_session_generation_task_id(token: Token[str]) -> None`
- `current_log_context() -> dict[str, str]`
- API header contract: request `X-Request-ID` is optional; response `X-Request-ID` is always set.

### 3. Contracts
- Log lines include stable, human-readable fields: `request_id`, `workflow_run_id`, `workflow_node_run_id`, and
  `image_session_generation_task_id`.
- API requests accept incoming `X-Request-ID`; when missing, the backend generates one and returns it in the same response
  header.
- API request id correlation must not change any JSON response model or route response shape.
- Business error responses converted by the global typed handler still return the normal `X-Request-ID` response header.
- `run_product_workflow_run(...)` sets `workflow_run_id` only while that Dramatiq actor executes.
- `run_product_workflow_node_run(...)` sets `workflow_node_run_id` only while that Dramatiq actor executes.
- `run_image_session_generation_task(...)` sets `image_session_generation_task_id` only while that Dramatiq actor executes.
- Ordinary process logs outside request/worker context use `-` placeholders.
- Do not manually pass request ids, workflow run ids, or generation task ids through application DTOs just to support
  logging. Use the existing contextvar boundary helpers.

### 4. Validation & Error Matrix
- Missing request header -> generate a non-empty request id and return it in `X-Request-ID`.
- Incoming request header present -> preserve the exact value and return the same value in `X-Request-ID`.
- Route handler raises -> request context still resets in `finally`; response header should remain attached when the
  exception is converted into an HTTP response by middleware/exception handling.
- Worker actor returns or raises -> worker context resets in `finally`.
- Ordinary startup/recovery logs -> formatter fields render as `-`, not stale ids.

### 5. Good/Base/Bad Cases
- Good: API log emitted during a request includes `request_id=<id>` and the HTTP response has the same `X-Request-ID`.
- Good: product workflow worker logs include `workflow_run_id=<run id>` without manual string interpolation at every
  logging call.
- Good: continuous image-session worker logs include `image_session_generation_task_id=<task id>`.
- Base: process startup, Uvicorn lifecycle, and queue recovery logs render `request_id=- workflow_run_id=-
  workflow_node_run_id=- image_session_generation_task_id=-`.
- Bad: passing request ids through Pydantic response bodies or application DTOs.
- Bad: setting a contextvar without resetting the token in `finally`.

### 6. Tests Required
- Formatter unit test asserting both active context values and stable `-` placeholders.
- API middleware test asserting incoming/generated `X-Request-ID` and context cleanup after the request.
- Worker actor boundary test asserting `workflow_run_id` / `workflow_node_run_id` /
  `image_session_generation_task_id` during execution and cleanup afterward.
- Run `uv run --directory backend ruff check .` and backend tests after formatter or middleware changes.

### 7. Wrong vs Correct
#### Wrong

```python
token = set_workflow_run_id(workflow_run_id)
execute_product_workflow_run(workflow_run_id)
```

#### Correct

```python
token = set_workflow_run_id(workflow_run_id)
try:
    execute_product_workflow_run(workflow_run_id)
finally:
    reset_workflow_run_id(token)
```

## Scenario: Metrics boundary

### 1. Scope / Trigger
- Trigger: requests to add queue metrics, generation counters, Prometheus/OpenTelemetry integration, or a metrics endpoint.

### 2. Signatures
- No metrics endpoint exists in the current backend contract.
- Durable state entrypoints remain the source for operational inspection:
  `WorkflowRun`, `WorkflowNodeRun`, `ImageSessionGenerationTask`, `recover_unfinished_workflow_runs(...)`, and
  `recover_unfinished_image_session_generation_tasks(...)`.

### 3. Contracts
- Do not add Prometheus, OpenTelemetry, structlog, loguru, APM agents, or a metrics endpoint without a dedicated task.
- Do not add ad-hoc route-level counters.
- Keep generation progress and failure evidence in durable database state:
- `WorkflowRun` / `WorkflowNodeRun` statuses for product workflow progress and failure counts.
- `ImageSessionGenerationTask` status, attempts, queue fields, progress heartbeat, and failure reason for continuous image
  generation.
- Queue recovery summaries from `recover_unfinished_workflow_runs(...)` and
  `recover_unfinished_image_session_generation_tasks(...)`.

### 4. Validation & Error Matrix
- Need current task/run progress -> query durable rows through existing application/API paths.
- Need queue recovery evidence -> use recovery summaries and persisted task/run state.
- Need external metrics scraping -> create a dedicated observability task before introducing dependencies or endpoint
  contracts.

### 5. Good/Base/Bad Cases
- Good: document a metrics tradeoff in this spec or task research before adding implementation.
- Base: rely on durable statuses and request/worker ids for investigation.
- Bad: adding `/metrics` opportunistically during unrelated logging work.
- Bad: logging full prompts, provider responses, upload bytes, cookies, or data URLs as a substitute for metrics.

### 6. Tests Required
- No tests are required for a documented non-implementation decision.
- If a future metrics endpoint is approved, add endpoint tests plus secret/payload redaction coverage.

### 7. Wrong vs Correct
#### Wrong

```python
app.include_router(metrics_router)
```

#### Correct

```text
Record the metrics decision in the observability task/spec, then implement only after the endpoint contract is approved.
```

---

## Sensitive Data Rules

Never log secrets or full request payloads that may contain secrets:

- `Settings.admin_access_key` and `Settings.session_secret` from `backend/src/productflow_backend/config.py`.
- Provider keys such as `text_api_key` and `image_api_key`.
- Uploaded image bytes or data URLs built in `application/image_sessions.py::_session_data_url`.
- Session cookies or `request.session` contents.
- Full prompts or full request bodies.
- Raw provider responses if they can include prompts, base64 images, credentials, provider request bodies, or provider
  response payloads.
- Upload bytes, multipart bodies, image base64 strings, and generated data URLs.

The settings API already hides secret values in `presentation/routes/settings.py::_public_value(...)`; keep logs at least as
strict as API responses.

Prefer IDs, counts, status values, enum names, queue positions, task/run ids, and already-sanitized concise failure
reasons. When logging provider failures, use the same sanitized/category-level detail that is safe for durable failure
state, not raw exception payloads.

---

## Preferred Evidence for Tests and Reviews

For regressions, prefer assertions on durable state and HTTP responses instead of log assertions:

- API response status/detail through `fastapi.testclient.TestClient` in the relevant `backend/tests/test_*.py` topic file.
- Database rows through `get_session_factory()` and SQLAlchemy models.
- Storage files under the test `tmp_path` configured in `backend/tests/conftest.py`.
- Alembic migration success through `alembic.command.upgrade(...)` tests.

Use logs to aid diagnosis, not as the only source of truth for behavior.

---

## Avoid

- Adding a module-specific logging framework or JSON logger without a project-level decision.
- Logging provider API keys, admin keys, session secrets, upload bytes, data URLs, or complete user prompts.
- Replacing persisted job state with log-only status.
- Emitting noisy per-request logs from route handlers when Uvicorn already logs requests.

## Scenario: Persistent API and worker logs

### 1. Scope / Trigger
- Trigger: backend process startup, worker startup, workflow execution, queue recovery, or log retention changes.

### 2. Signatures
- `configure_logging(settings: Settings | None = None) -> None` configures root logging once per process.
- `cleanup_old_logs(settings: Settings | None = None) -> int` deletes `*.log*` files older than retention days.
- Environment-backed settings: `LOG_DIR`, `LOG_LEVEL`, `LOG_MAX_BYTES`, `LOG_BACKUP_COUNT`, `LOG_RETENTION_DAYS`.

### 3. Contracts
- API startup calls `configure_logging(...)` during app creation and `cleanup_old_logs(...)` during lifespan startup before
  queue recovery.
- Dramatiq worker import calls `configure_logging()`, and the Dramatiq CLI startup path calls `cleanup_old_logs()` before
  job/workflow recovery.
- Default log path is the repository backend storage log file (`backend/storage/logs/productflow.log`, resolved from
  the backend package location rather than the process working directory); storage/log files are ignored by git. `LOG_DIR`
  may still override the directory explicitly.
- File logs use `RotatingFileHandler` with configured max bytes and backup count. Stdout/stderr logging remains available
  for service managers.
- Uvicorn `uvicorn.error` and `uvicorn.access` records must also be mirrored into the same persistent file when their
  logger propagation stops before root, including human-readable access status text such as `200 OK`. Do not add
  ProductFlow stream handlers to Uvicorn loggers, and keep a single shared ProductFlow file handler instance across
  root/Uvicorn mirrors so console output and file lines are not duplicated.

### 4. Validation & Error Matrix
- Log dir missing -> create it.
- `LOG_RETENTION_DAYS <= 0` -> skip age cleanup.
- One expired log cannot be deleted -> log exception and continue other files.
- Sensitive config/provider values -> never log them; log IDs, statuses, and concise failure reasons only.

### 5. Good/Base/Bad Cases
- Good: workflow run created, node start/success/failure, queue recovery, and cleanup summary appear in persistent logs.
- Base: tests assert cleanup by filesystem state rather than scraping log text.
- Bad: adding `print(...)` diagnostics or logging provider keys/full prompts/upload bytes.

### 6. Tests Required
- Unit regression that `cleanup_old_logs(...)` deletes expired log files and preserves fresh logs.
- Backend ruff and workflow tests after adding new logger calls.

### 7. Wrong vs Correct
#### Wrong

```python
print(f"run failed: {provider_payload}")
```

#### Correct

```python
logger.warning("工作流运行失败: run_id=%s failed_node_id=%s reason=%s", run_id, node_id, reason)
```


--- FILE: .trellis\spec\backend\product-workflow-dag.md ---

# Backend Product Workflow DAG Guidelines

> Executable contracts for the ProductFlow-native product workbench DAG.

## Scenario: Canvas template v1 contract

### 1. Scope / Trigger

- Trigger: any change to canvas template models, built-in ecommerce templates, template catalog endpoints, template
  application, user-saved node-group templates, or frontend palette DTOs.
- Canvas templates describe reusable ecommerce production plans. Applying a template must create normal visible
  workflow nodes and edges that can be edited, connected, and executed through the existing product workflow DAG.
- Templates may express downstream iteration by adding later nodes such as `image_generation -> reference_image`; they
  must keep the graph acyclic.

### 2. Signatures

- Backend module: `productflow_backend.application.canvas_templates`.
- Template models:
  - `CanvasTemplate`
  - `CanvasTemplateNodeSpec`
  - `CanvasTemplateEdgeSpec`
  - `CanvasTemplateScenarioMetadata`
  - `CanvasTemplateOutputSlot`
  - `CanvasTemplateReferenceInputHint`
  - `CanvasTemplateSuggestedConnection`
  - `CanvasTemplateDefaultExternalConnection`
  - `CanvasTemplateScenario`
  - `TemplateKind = Literal["full_canvas", "node_group"]`
- Catalog helpers:
  - `list_builtin_canvas_templates() -> list[CanvasTemplate]`
  - `get_builtin_canvas_template(template_key: str) -> CanvasTemplate`
  - `validate_canvas_template(template: CanvasTemplate) -> None`
- Supported node types for templates are explicitly allowlisted:
  `product_context`, `reference_image`, `copy_generation`, `image_generation`.
- Built-in template keys:
  - `ecommerce-main-image-v1`
  - `ecommerce-taobao-main-image-v1`
  - `ecommerce-xiaohongshu-image-v1`
  - `ecommerce-multi-angle-image-v1`
  - `ecommerce-sku-variant-image-v1`
  - `ecommerce-feature-infographic-v1`
  - `ecommerce-size-spec-image-v1`
  - `ecommerce-scale-reference-image-v1`
  - `ecommerce-package-checklist-image-v1`
  - `ecommerce-usage-steps-image-v1`
  - `ecommerce-comparison-image-v1`
  - `ecommerce-model-lifestyle-image-v1`
  - `ecommerce-scene-image-v1`
  - `ecommerce-detail-material-image-v1`
  - `ecommerce-campaign-promotion-image-v1`
  - `ecommerce-short-video-cover-v1`
  - `ecommerce-white-background-image-v1`

### 3. Contracts

- `CanvasTemplate.version` must be `1`.
- `CanvasTemplate.kind` must be `full_canvas` for built-in ecommerce scenario templates. `node_group` remains valid for
  user-saved reusable groups.
- `CanvasTemplate.nodes` is required and every node `key` must be unique within the template.
- Node specs are logical template nodes. Application code that materializes them must translate each node spec into a
  real `workflow_nodes` row and each edge spec into a real `workflow_edges` row.
- Node specs may include `config_json` with default instructions, prompt hints, image size, or tool options. Keep these as
  editable workflow-node config, not separate local UI state.
- Only `image_generation` node specs may declare `size`.
- `output_slots` document which `reference_image` nodes receive generated material and how the UI should label those
  outputs.
- `reference_inputs` document which `reference_image` nodes are expected to receive user/product/style images before
  running downstream nodes.
- `suggested_connections` may describe optional UI connection advice, but every suggestion must point to existing template
  node keys and must not connect a node to itself.
- Built-in `full_canvas` templates may contain one `product_context` node. When such a template is appended inside an
  existing product workbench, application code must reuse the active workflow's existing product-context singleton instead
  of creating a second product node.
- Built-in `node_group` templates may declare `default_external_connections` from `existing_product_context` to template
  copy/image node keys. Applying the template must materialize those declarations as normal visible `workflow_edges`.
  They are not hidden suggestions or frontend-only hints.
- User-saved node-group templates are persisted in `user_canvas_templates`, not in the built-in template constant list.
  Their stable catalog key is `user:{id}`, `kind` is `node_group`, `schema_version` is `1`, and `template_json.version`
  must also be `1`.
- User-saved templates are converted back into the same `CanvasTemplate` contract with `source == "user"` and
  `user_template_id` populated. The existing catalog endpoint returns built-in and non-archived user templates together.
- Saving a user template from workflow nodes must capture only reusable intent: node type, title, relative position,
  normalized editable `config_json`, and edges whose source and target are both selected nodes. It must not read or persist
  `output_json`, workflow run rows, node run rows, artifact ids, file URLs/paths, product ids, workflow ids, or database
  node ids.
- User templates must reject empty selections, duplicate node ids, missing active workflows, nodes outside the current
  active workflow, and selections containing `product_context`. Known artifact-specific config fields such as
  `source_asset_ids`, `source_poster_variant_id`, `copy_set_id`, `poster_variant_id`,
  `generated_poster_variant_ids`, `filled_source_asset_ids`, and image-session asset ids must be stripped while preserving
  reusable fields such as `role`, `label`, `instruction`, `size`, and normalized `tool_options`. Unknown config keys ending
  in `_id`, `_ids`, `_url`, or `_path` must be rejected so new artifact references do not silently enter templates.
- Applying a user template must go through the same template application path as built-in templates and must create
  ordinary persisted workflow nodes and edges. Archived user templates must not appear in the catalog and must not be
  applicable by key.
- Built-in templates must cover real ecommerce image-production scenarios: marketplace/main image, Taobao main image,
  Xiaohongshu/content cover, multi-angle gallery, SKU/variant, feature infographic, size/spec, scale reference,
  package/checklist, usage steps, comparison, model/lifestyle, scene, detail/material, campaign/promotion,
  short-video cover, and white-background output.
- Templates must not introduce new workflow node types by enum drift. When a new `WorkflowNodeType` is added elsewhere,
  it becomes template-supported only after `SUPPORTED_CANVAS_TEMPLATE_NODE_TYPES` and template tests are updated on
  purpose.

### 4. Validation & Error Matrix

- Template version is not `1` -> `BusinessValidationError("画布模板版本必须是 v1")`.
- Unsupported template kind -> `BusinessValidationError("画布模板类型不支持")`.
- Empty node list -> `BusinessValidationError("画布模板至少需要一个节点")`.
- Duplicate node key -> `BusinessValidationError("画布模板节点 key 不能重复")`.
- Unsupported node type -> `BusinessValidationError("画布模板包含不支持的节点类型")`.
- Non-image node declares `size` -> `BusinessValidationError("只有生图节点可以声明尺寸")`.
- Edge connects a node to itself -> `BusinessValidationError("画布模板连线不能连接到自身")`.
- Edge references a missing source or target node -> `BusinessValidationError("画布模板连线引用了不存在的节点")`.
- Template graph contains a cycle -> `BusinessValidationError` from the workflow DAG topological validator.
- Output slot references a missing node or a non-`reference_image` node ->
  `BusinessValidationError("画布模板输出槽必须引用参考图节点")`.
- Reference input hint references a missing node or a non-`reference_image` node ->
  `BusinessValidationError("画布模板参考输入必须引用参考图节点")`.
- Suggested connection connects a node to itself -> `BusinessValidationError("画布模板连接建议不能连接到自身")`.
- Suggested connection references a missing node -> `BusinessValidationError("画布模板连接建议引用了不存在的节点")`.
- Default external connection on a non-`node_group` template ->
  `BusinessValidationError("只有节点组模板可以声明默认外部连接")`.
- Default external connection references a missing template node ->
  `BusinessValidationError("画布模板默认外部连接引用了不存在的节点")`.
- Default external connection targets a node that is not `copy_generation` or `image_generation` ->
  `BusinessValidationError("画布模板默认外部连接只能接入文案或生图节点")`.
- Unknown built-in template key -> `ValueError("画布模板不存在")`.
- User template save with no selected nodes -> `BusinessValidationError("请选择要保存的节点")`.
- User template save with duplicate node ids -> `BusinessValidationError("保存模板的节点不能重复")`.
- User template save before an active workflow exists -> `BusinessValidationError("需要先创建或打开画布后才能保存模板")`.
- User template save with nodes outside the current active workflow ->
  `BusinessValidationError("保存模板包含不属于当前画布的节点")`.
- User template save containing `product_context` -> `BusinessValidationError("节点组模板不能包含商品资料节点")`.
- User template save with unknown artifact-shaped config keys ->
  `BusinessValidationError("模板配置包含不可复用的产物数据")`.
- Archived or missing user template key -> `BusinessValidationError("画布模板不存在")`.

### 5. Good/Base/Bad Cases

- Good: main-image template creates product context, copy generation, image generation, generated reference output, and a
  downstream iteration image/output pair. The iteration path remains a downstream DAG branch.
- Good: campaign template contains campaign prompt defaults, poster image size, and an explicit generated output slot.
- Good: built-in scenario template appends reusable ecommerce production nodes by materializing normal workflow nodes,
  reusing the active workflow product-context node for the template's `product` key, and remapping all other template keys
  to database node IDs before creating edges.
- Good: saving a selected copy/image/reference chain stores relative node positions and internal selected edges, appears in
  the template catalog with `source == "user"`, and applying `user:{id}` creates normal workflow rows with empty outputs.
- Good: saving a reference node that has been filled with an image strips `source_asset_ids` and
  `source_poster_variant_id` while preserving `role` and `label`.
- Base: a template can include suggested connections for optional palette guidance without requiring those suggestions to
  be materialized as edges. Default external connections are a separate executable contract and are materialized.
- Base: a template can include multiple output slots when one generation node is expected to fill multiple downstream
  `reference_image` nodes.
- Bad: a template stores a hidden chain in frontend state and creates only one placeholder node in the database.
- Bad: a template uses a new enum value before the explicit template allowlist and tests are updated.
- Bad: a user template stores output JSON, run results, source asset ids, poster ids, image-session ids, product ids, or
  workflow ids and reuses those artifacts when applied to another product.

### 6. Tests Required

- Unit test every built-in template with `validate_canvas_template` and assert all built-ins have unique keys.
- Unit test required ecommerce scenario coverage: marketplace/main image, Taobao main image, Xiaohongshu/content cover,
  multi-angle gallery, SKU/variant, feature infographic, size/spec, scale reference, package/checklist, usage steps,
  comparison, model/lifestyle, scene, detail/material, campaign/promotion, short-video cover, and white-background.
- Unit test downstream iteration remains acyclic and includes only downstream template edges.
- Unit test validation rejects missing edge references, self-edges, cycles, duplicate node keys, unsupported node types,
  invalid template kind, invalid output slot references, invalid suggested connections, and invalid default external
  connections.
- Unit test direct Pydantic model construction still runs contract validation so bypassing catalog helpers cannot create an
  invalid template instance.
- Regression test `SUPPORTED_CANVAS_TEMPLATE_NODE_TYPES` as an explicit allowlist so future `WorkflowNodeType` additions do
  not silently become template-supported.
- When a template application API is added, integration tests must assert that applying a template persists real
  `workflow_nodes` and `workflow_edges`, preserves DAG validation, and keeps prompt/size defaults editable through normal
  node update endpoints.
- User-template tests must cover create/list/rename/archive/apply, application of `user:{id}` as real workflow rows, hiding
  archived templates from the catalog, stripping known artifact config fields, rejecting unknown artifact-shaped config
  keys, and ignoring existing `output_json` / run outputs.

### 7. Wrong vs Correct

#### Wrong

```python
template = {
    "key": "main-image",
    "steps": ["copy", "image", "iterate"],
}
```

This loses the node and edge contract, so later code cannot materialize the plan as a real workflow DAG.

#### Correct

```python
CanvasTemplate(
    key="ecommerce-main-image-v1",
    version=1,
    kind="full_canvas",
    nodes=[
        CanvasTemplateNodeSpec(key="copy", node_type=WorkflowNodeType.COPY_GENERATION, title="商品卖点文案"),
        CanvasTemplateNodeSpec(key="image", node_type=WorkflowNodeType.IMAGE_GENERATION, title="生成主图"),
        CanvasTemplateNodeSpec(key="output", node_type=WorkflowNodeType.REFERENCE_IMAGE, title="主图结果"),
    ],
    edges=[
        CanvasTemplateEdgeSpec(source_node_key="copy", target_node_key="image"),
        CanvasTemplateEdgeSpec(source_node_key="image", target_node_key="output"),
    ],
)
```

Keep the template as node and edge specs so application code can persist visible, editable, runnable workflow objects.

## Scenario: Product creation canvas template selection

### 1. Scope / Trigger

- Trigger: changes to `POST /api/products`, product creation use cases, or creation-time canvas template application.
- Product creation may initialize a complete ecommerce output plan, but only by materializing a built-in `full_canvas`
  template into normal persisted workflow rows.
- Creation-time template selection must not implement user-saved template storage, result actions, or material lineage.
  Those are separate product-workbench capabilities.

### 2. Signatures

- API: `POST /api/products` multipart form.
- Existing required fields remain:
  - `name: str`
  - `image: UploadFile`
- Existing optional fields remain:
  - `reference_images: list[UploadFile] | None`
  - `category: str | None`
  - `price: str | None`
  - `source_note: str | None`
- Creation-time template field:
  - `canvas_template_key: str | None`
- Application entrypoint:
  - `create_product(..., canvas_template_key: str | None = None, ...) -> Product`
- Application helper:
  - `resolve_product_creation_canvas_template(canvas_template_key: str | None) -> CanvasTemplate | None`
  - `materialize_product_workflow_from_template(session, *, product_id: str, template: CanvasTemplate) -> ProductWorkflow`

### 3. Contracts

- Missing, blank, and approved default aliases such as `default`, `basic`, `blank`, or `minimal` preserve the existing lazy
  default workflow behavior. Do not eagerly create a default workflow during product creation for those values.
- Any other key must resolve through the built-in template catalog. Do not accept frontend-only template payloads or
  browser-local template definitions for product creation.
- Only `CanvasTemplate.kind == "full_canvas"` is valid at product creation time.
- Built-in ecommerce templates are complete `full_canvas` templates. Product creation may materialize any built-in
  ecommerce template directly.
- `create_product` owns the SQLAlchemy transaction. Template materialization helpers may `flush` rows to resolve ids, but
  must not `commit` independently.
- Materialized `WorkflowNode` rows copy template `node_type`, `title`, `position_x`, `position_y`, and `config_json`.
- Materialized `WorkflowEdge` rows remap template node keys to persisted node ids and copy `source_handle` /
  `target_handle`.
- The materialized workflow must be active and must use normal workflow tables. Do not store a hidden selected-template
  state that later frontend code interprets locally.
- If the product creation page renders a large preview for a built-in `full_canvas` plan, that preview is a mirror of the
  backend template. Node titles, relative order, edges, and coordinates for shared template keys must be updated with the
  backend template and covered by regression tests.
- Later calls to `get_or_create_product_workflow` must return the active workflow created at product creation and must not
  overwrite it with the lazy default graph.

### 4. Validation & Error Matrix

- `canvas_template_key` missing/blank/default alias -> create product, no eager workflow row.
- Unknown non-default key -> `BusinessValidationError("画布模板不存在")` or equivalent template-missing `400`.
- Built-in key whose template kind is not `full_canvas` -> `BusinessValidationError` with a message explaining product
  creation supports only complete canvas templates.
- Product id missing during materialization -> `NotFoundError("商品不存在")`.
- Product already has an active workflow before materialization -> `BusinessValidationError("商品已有活动画布")`.

### 5. Good/Base/Bad Cases

- Good: creating a product with `ecommerce-main-image-v1` creates one active `ProductWorkflow`, persists all template nodes
  and edges, and the detail workflow endpoint returns that workflow unchanged.
- Good: creating a product with no `canvas_template_key` creates only the product/assets; opening the workflow later
  lazily creates the current default graph.
- Base: frontend can label the key as a merchant-facing output plan such as `商品主图方案`; the submitted value remains the
  backend-recognized `canvas_template_key`.
- Bad: accepting a user-saved `node_group` template in product creation and pretending it is a full-canvas starter.
- Bad: creating a default workflow eagerly for blank/default key and changing current lazy behavior without an explicit
  product decision.
- Bad: persisting only `canvas_template_key` on the product and letting the frontend draw non-persisted template nodes.

### 6. Tests Required

- API test default product creation without `canvas_template_key` succeeds and does not eagerly create a workflow.
- API test explicit default alias preserves the same lazy behavior.
- API test valid `full_canvas` key creates an active workflow immediately.
- API test persisted node and edge counts, node types, titles, positions, and config match the selected template.
- Regression test layout-sensitive built-in templates, including the main-image output and downstream iteration node
  coordinates that the creation page preview mirrors.
- API test unknown key returns `400` with template-missing detail.
- API test a broad built-in scenario key such as `ecommerce-sku-variant-image-v1` creates an active workflow immediately.
- Regression test fetching the workflow after template-backed creation returns the existing active workflow id.

### 7. Wrong vs Correct

#### Wrong

```python
product = create_product(...)
product.canvas_template_key = payload.canvas_template_key
session.commit()
```

This stores a hidden selector but does not create editable, runnable workflow rows.

#### Correct

```python
template = resolve_product_creation_canvas_template(canvas_template_key)
product = Product(...)
session.add(product)
session.flush()
if template is not None:
    materialize_product_workflow_from_template(session, product_id=product.id, template=template)
session.commit()
```

Creation-time template application must persist the visible workflow graph in the same product creation transaction.

## Scenario: Product workflow template application

### 1. Scope / Trigger

- Trigger: changes to canvas-internal template insertion APIs, built-in scenario templates, or product workflow
  mutation code that materializes template nodes.
- The workbench may append built-in `full_canvas` scenario templates to an existing active product workflow by creating
  normal persisted workflow rows and reusing the active workflow's existing product-context node.
- This scenario does not cover product-creation template selection, user-saved template authoring,
  drag-to-canvas authoring, or hidden suggested external connections.

### 2. Signatures

- Catalog API: `GET /api/workflow/canvas-templates -> CanvasTemplateListResponse`.
- Catalog summary preview fields:
  - `preview_nodes: list[{key, node_type, title, position_x, position_y}]`
  - `preview_edges: list[{source_node_key, target_node_key}]`
  - `default_external_connections: list[{source, target_node_key, label}]`
- Apply API: `POST /api/products/{product_id}/workflow/template-groups -> ProductWorkflowResponse`.
- Request schema:
  - `template_key: str`
  - `position_x: int`
  - `position_y: int`
- Application entrypoint:
  - `apply_node_group_template_to_workflow(session, product_id, template_key, position_x, position_y) -> ProductWorkflow`
- Shared materialization helper:
  - `materialize_canvas_template_graph(..., existing_nodes_by_template_key=None, external_source_nodes_by_template_source=None)`

### 3. Contracts

- The apply API resolves `template_key` through the backend template catalog, including built-in scenario templates and
  non-archived user templates.
- Catalog summary responses must expose lightweight real graph preview data from `CanvasTemplate.nodes` and
  `CanvasTemplate.edges`. Include node key, type, title, and relative coordinates plus edge source/target keys; do not
  include large prompt seeds, instruction strings, or `config_json` in summary preview data.
- Built-in `full_canvas` scenario templates and user-saved `node_group` templates are both valid for canvas-internal
  insertion.
- Applying a template appends to the product's active workflow and preserves all existing nodes and edges.
- If a template contains `product_context`, the apply path must map that template key to the active workflow's existing
  product-context node and skip creating a duplicate product node.
- Template node specs are materialized into real `workflow_nodes` rows by copying `node_type`, `title`, `config_json`, and
  relative layout.
- The smallest insertable template `position_x` / `position_y` becomes the anchor that lands at request `position_x` /
  `position_y`; other inserted template nodes keep their relative offsets.
- Template edge specs are materialized as real `workflow_edges` rows after remapping template keys to either newly created
  nodes or explicitly reused existing nodes such as the product-context singleton.
- `suggested_connections` are returned by the catalog for UI guidance and must not be silently materialized as external
  workflow edges.
- `default_external_connections` are returned by the catalog as lightweight metadata and are materialized by the apply API
  as real visible `workflow_edges` when a node-group template declares them.
- Built-in scenario templates contain a `product_context` node in the template graph. The active workflow already owns
  the product-context singleton, so insertion reuses it and still materializes the template's product-to-copy/image edges.

### 4. Validation & Error Matrix

- Unknown `template_key` -> `400`, `{"detail": "画布模板不存在"}`.
- Missing product -> `404`, `{"detail": "商品不存在"}`.
- Existing product without an active workflow -> `400`; the apply API must not create a workflow implicitly.
- Active workflow without exactly one `product_context` node -> `400`; the apply API must not create a partially usable
  scenario template.
- Template self-edge, missing edge reference, or cycle -> `400` business validation error.
- Any generated edge that would make the full active workflow cyclic -> rollback and return a `400` DAG validation error.

### 5. Good/Base/Bad Cases

- Good: applying `ecommerce-sku-variant-image-v1` to the default workflow increases node and edge counts, keeps all
  previous node/edge IDs, does not create a second product-context node, and adds visible edges from the existing product
  context to the template copy/image nodes.
- Good: applying a template at `position_x=480`, `position_y=360` places the template's minimum coordinate there while
  preserving relative spacing.
- Base: the UI may render reference input hints and connection suggestions from the catalog.
- Bad: frontend creates local-only template nodes without calling the apply API.
- Bad: creating a second `product_context` node when applying a built-in scenario template inside an existing canvas.
- Bad: materializing suggested external connections as hidden edges.

### 6. Tests Required

- API test catalog response includes built-in templates with `kind`, scenario metadata, output slots, reference input
  hints, suggested connections, lightweight default external connections, and real `preview_nodes` / `preview_edges`
  matching the built-in template definitions. Catalog summaries must not expose config/prompt payloads.
- API test successful template apply preserves existing nodes and edges.
- API test persisted node count, edge count, node types, titles, config, and shifted positions match the backend template.
- API test created edges are the template edges remapped to newly created nodes plus the existing product-context node,
  and no self-edge is created.
- API test built-in full-canvas insertion reuses the existing product-context node.
- API test missing product-context node returns `400` and does not create a partial template.
- API test unknown key returns `400` with template-missing detail.

### 7. Wrong vs Correct

#### Wrong

```python
workflow.nodes.extend(local_template_nodes)
```

This leaves the template in local memory and loses the persisted DAG contract.

#### Correct

```python
workflow = apply_node_group_template_to_workflow(
    session,
    product_id=product_id,
    template_key="ecommerce-sku-variant-image-v1",
    position_x=480,
    position_y=360,
)
```

The application use case resolves the built-in template, materializes visible workflow rows, validates the full DAG, and
returns the normal `ProductWorkflow`.

## Scenario: Product workflow DAG persistence and execution

### 1. Scope / Trigger

- Trigger: any change to product workbench DAG persistence, node execution, run history, or artifact write-back.
- This is a cross-layer and database-backed feature: SQLAlchemy models, Alembic migrations, Pydantic schemas, API routes,
  frontend DTOs, and workflow tests must stay in sync.

### 2. Signatures

- Tables:
  - `product_workflows(product_id, title, active)` with one active workflow per product.
  - `workflow_nodes(workflow_id, node_type, title, position_x, position_y, config_json, status, output_json, failure_reason)`.
  - `workflow_edges(workflow_id, source_node_id, target_node_id, source_handle, target_handle)`.
  - `workflow_runs(workflow_id, status, started_at, finished_at, failure_reason)`.
  - `workflow_node_runs(workflow_run_id, node_id, status, output_json, copy_set_id, poster_variant_id, image_session_asset_id)`.
- APIs:
  - `GET /api/products/{product_id}/workflow`
  - `GET /api/products/{product_id}/workflow/status`
  - `POST /api/products/{product_id}/workflow/nodes`
  - `PATCH /api/workflow-nodes/{node_id}`
  - `PATCH /api/workflow-nodes/{node_id}/copy`
  - `POST /api/workflow-nodes/{node_id}/image`
  - `POST /api/workflow-nodes/{node_id}/image-source`
  - `POST /api/products/{product_id}/workflow/edges`
  - `DELETE /api/workflow-edges/{edge_id}`
  - `POST /api/products/{product_id}/workflow/run`
- Provider contracts:
  - `TextProvider.generate_copy(product, brief, config, reference_images=None)` receives `CopyNodeConfigV2` plus connected
    `ReferenceImageInput` values with `path`, `mime_type`, `filename`, `role`, and `label`.

### 3. Contracts

- Supported product node types are exactly mirrored in frontend types:
  `product_context`, `reference_image`, `copy_generation`, `image_generation`.
- Legacy PostgreSQL databases may already have older enum values. Forward migrations must safely add `reference_image`
  and migrate old image-slot rows to it; fresh databases should create only the supported simplified node values.
- Node status values are `idle`, `queued`, `running`, `succeeded`, `failed`; run status values are
  `running`, `succeeded`, `failed`, `cancelled`. Any run-status enum expansion must include an Alembic revision that
  adds the PostgreSQL enum value while remaining a no-op for SQLite test databases.
- Active workflow status polling must use `GET /api/products/{product_id}/workflow/status`, not repeated full workflow
  detail loads. The status endpoint returns workflow identity/timestamps, node status fields, latest run status fields,
  and node-run status fields only; it must not serialize edges, node `config_json`, node `output_json`, or node-run
  artifact fields. The status query should load only the ORM columns needed for those status DTOs and avoid eager-loading
  product artifacts or full DAG relationships.
- `reference_image` nodes are user-visible `参考图` slots. They can be manually uploaded into through
  `POST /api/workflow-nodes/{node_id}/image`, filled from an existing product image through
  `POST /api/workflow-nodes/{node_id}/image-source`, or filled by upstream `image_generation` nodes.
- Each `reference_image` node is a single current-image slot. Manual upload and upstream `image_generation` fill must
  replace that node's current `config_json.source_asset_ids`, `output_json.source_asset_ids`, `output_json.image_asset_ids`,
  and `output_json.images` with the new single asset. Do not delete the old `source_assets` row; it remains product history
  and can still be downloaded from artifact views.
- `POST /api/workflow-nodes/{node_id}/image-source` accepts exactly one of `source_asset_id` or `poster_variant_id`.
  SourceAsset-backed requests directly bind the existing same-product `reference_image` SourceAsset without creating a
  duplicate upload. If that SourceAsset has `source_poster_variant_id`, preserve that poster-source metadata in the filled
  reference node output. PosterVariant-backed requests first look for a same-product `reference_image` SourceAsset whose
  `source_poster_variant_id` matches the poster, then fall back to workflow output pairings from
  `generated_poster_variant_ids` / `filled_source_asset_ids`; if none exists, copy/materialize the poster file into a new
  `reference_image` SourceAsset named `poster-{poster_variant_id}.*` with `source_poster_variant_id` set, then bind it.
  The filename convention is legacy compatibility only; current de-duplication should use explicit
  `source_poster_variant_id` so a user-uploaded reference image with the same filename is not hidden or rebound as a poster
  copy.
- `reference_image` nodes store image material as first-class `source_assets` rows and expose `source_asset_ids` /
  `image_asset_ids` in workflow output JSON for downstream image nodes.
- `copy_generation` nodes must collect connected upstream `reference_image` slots and pass their asset paths plus
  role/label metadata to the text provider. Text-only providers should include concise reference metadata in the prompt;
  multimodal-capable providers may also attach image payloads/paths.
- A generated `copy_generation` output is editable through `PATCH /api/workflow-nodes/{node_id}/copy`. The endpoint
  updates the underlying `CopySet.structured_payload`, then rewrites the node output so downstream image nodes read the
  edited v2 copy through the existing `copy_set_id`. Structured-payload edits must not re-derive or overwrite
  removed fixed-field copy columns.
- Manually edited copy node outputs should be treated as the selected copy for downstream runs. Re-running a downstream
  image node must not silently replace that edited `CopySet` with a fresh generated copy before image generation.
- New copy-generation runs must produce `CopyPayloadV2` as the only path. Providers, templates, editors, and tests must
  treat `structured_payload` as the copy contract.
- Copy-node output JSON must include `structured_payload` and must not emit fixed copy fields for workflow runs. Upstream
  image context must use `structured_payload.summary/content/visual_guidance`.
- `image_generation` nodes collect incoming edge context, including upstream copy text and reference-image outputs. They
  are trigger/config nodes, not image-bearing artifact slots; generated images must be viewed/downloaded from linked
  downstream `reference_image` nodes or normal product artifact history, not from the `image_generation` node card.
- Workflow image generation mode is derived from the stored `poster_generation_mode` plus the current image-purpose
  provider binding. Real image bindings (`openai_responses`, `openai_images`, or `google_gemini_image`) execute through
  the image provider even when the legacy runtime value remains `template`. `mock` image bindings keep the no-external
  local development path, and `PosterRenderer` remains available for template/mock fallback.
- Generated-mode provider prompts expose visual-subject policy through the runtime-configurable
  `prompt_poster_image_reference_policy` placeholder, not hidden provider code. The default policy treats the first/source
  image as the primary visual subject when present, while upstream copy is auxiliary selling-point/layout context. This is
  important when product text is weak such as a default name `商品` and copy generation may otherwise invent an unrelated
  role, IP, brand, or ad theme.
- Image prompt mode is determined by explicit copy linkage, not by whether a workflow-local `CopySet` exists for
  persistence.
  If `image_generation.config_json.copy_set_id` or an upstream `copy_generation.output_json.copy_set_id` points to a
  same-product `CopySet`, provider input must set `PosterGenerationInput.copy_prompt_mode = "copy"` and use the poster/copy
  image template. If no explicit copy link exists, create the workflow-local draft `CopySet` as needed for
  `PosterVariant.copy_set_id`, but set `copy_prompt_mode = "image_edit"` so provider prompts use the no-copy image-edit
  template and do not require fixed copy-field semantics.
- A connected upstream `product_context` node contributes the product source image asset and product fields to
  `image_generation` image context. For image-generation context only, "upstream" includes direct edges and transitive
  ancestors such as `product_context -> copy_generation -> image_generation`; this preserves product context for older or
  manually rewired canvases that no longer have a direct `product_context -> image_generation` edge. Use the node output
  `source_asset_id` when available and fall back to the product's current original source asset so direct selected
  image-node runs do not require re-running product context only to get image context. Deduplicate with other reference
  assets before provider/render input construction. A totally disconnected image-generation node remains free-form and
  must not implicitly inherit product context.
- Image-generation count is driven by graph structure: an `image_generation` node connected to N downstream
  `reference_image` slots generates N images and fills those slots. If no downstream reference slot is connected, the node
  must fail with a clear user-facing message asking the user to connect at least one image/reference node before running.
- Count downstream `reference_image` slots by unique target node id, not by raw edge count. Duplicate edges from the same
  `image_generation` node to the same `reference_image` slot must not multiply generated images or overwrite the slot
  multiple times in one run.
- When N > 1, provider/render calls for the N target images should be initiated concurrently. Persist the returned
  `PosterVariant` and downstream `SourceAsset` rows in the owning SQLAlchemy session after provider calls return; do not
  share one SQLAlchemy `Session` across provider threads.
- Resolve runtime settings and construct provider/renderer dependencies before starting provider/render worker threads, so
  those threads do not open SQLAlchemy sessions just to read config while images are being generated.
- `image_generation` node config may override provider size with `size`; application contracts must normalize it to the
  generation safety bounds before it reaches providers, including a 512px minimum per side and the runtime maximum
  dimension. The normalized value is carried as `PosterGenerationInput.image_size`, and providers should prefer it over
  global runtime defaults.
- `image_generation` node config may override image-generation tool parameters with `tool_options`; application contracts
  must carry this as `PosterGenerationInput.tool_options`, and generated-mode providers should pass it into their image
  client/tool builder after normalizing blank/null values.
- Generated images should still be persisted as first-class `poster_variants` for history and as `source_assets` on the
  downstream `reference_image` slots. Keep only workflow-boundary summaries and internal generated-poster IDs in
  `image_generation.output_json`; do not expose `poster_variant_ids` there as the preview/download contract.
- `product_context` node config may override/fill `name`, `category`, `price`, and `source_note`; downstream
  `ProductInput.source_note` and `PosterGenerationInput.source_note` must use that effective node context and propagate it
  to text and image providers.
- Product context resolution must prefer the latest saved `product_context.config_json` over stale `output_json` from an
  older run. Direct selected-node runs should not require re-running the product-context node just to see saved edits.
- Copy/image node outputs may expose compact `context_summary` and `context_sources` for UI/tests. These summaries should
  name source nodes and concise upstream text/reference metadata, not full rendered provider prompts or provider payloads.

### 4. Validation & Error Matrix

- Missing product/workflow/node/edge -> `ValueError("...不存在")`, mapped to HTTP `404`.
- Existing-image fill without exactly one `source_asset_id` / `poster_variant_id` -> `400`.
- Existing-image fill on a non-`reference_image` node -> `400`.
- Existing-image fill with a source asset or poster outside the workflow product -> `404`.
- Poster fill when the backing file is missing or storage resolution fails -> `400` with `海报文件不存在`.
- Edge source/target outside the product workflow -> `400` with a user-readable validation detail.
- Self-edge -> `400`.
- Cyclic graph -> `400` and no edge persisted.
- Image generation without a connected product context/source image -> blank/free image generation remains valid when the
  node has at least one downstream `reference_image` target; only explicitly connected missing/broken image references
  should fail.
- Copy generation without a connected product context -> run against the user's node instruction/upstream context as
  free-form copy using a neutral placeholder subject; do not silently fall back to `workflow.product` fields or the
  product source image.
- Image generation without usable explicit copy link -> create a workflow-local draft `CopySet` from product context and
  image instruction for artifact linking, then generate the image with `copy_prompt_mode = "image_edit"`. Do not fail only
  because a copy node is absent, and do not route this no-copy path through the poster/copy prompt template.
- Image generation without downstream `reference_image` targets -> fail the node/run with a concise message such as
  `请先把生图节点连接到至少一个图片/参考图节点，再运行图片生成`; do not silently place output on the
  `image_generation` node.

### 5. Good/Base/Bad Cases

- Good: run default DAG `product_context -> copy_generation -> image_generation -> reference_image`; it produces one draft
  `CopySet`, one generated `PosterVariant` history row, fills the downstream reference slot with a `SourceAsset`, and writes
  run history.
- Good: delete all downstream reference nodes, then run the image node; it fails before provider generation and tells the
  user to connect at least one image/reference node.
- Good: connect an uploaded style `reference_image` into a `copy_generation` node; the generated copy reflects the
  reference label/role and the provider receives explicit `ReferenceImageInput` metadata.
- Good: edit a copy node's structured payload; the persisted `CopySet.structured_payload` and node output update together,
  old four-field columns are not re-derived, and the downstream image node keeps referencing the same edited
  `copy_set_id`.
- Good: connect one uploaded `reference_image` into `image_generation`, then connect the image node to two downstream
  `reference_image` slots; one run creates two generated images and fills both slots.
- Base: if duplicate edges accidentally connect one image node to the same downstream `reference_image` slot, one run still
  generates one image for that unique slot, not one image per duplicate edge.
- Base: choosing an existing SourceAsset for a different reference slot reuses the same `source_asset_id` and does not add
  another `source_assets` row.
- Base: choosing a product poster not backed by a workflow-filled SourceAsset materializes one new reference SourceAsset and
  updates only the selected reference node's current slot. Reusing the same poster again should reuse that materialized
  SourceAsset via the SourceAsset's `source_poster_variant_id`, even after the original reference node has been filled with
  another image.
- Base: run from a selected node; the executor runs the selected node and only missing/invalid required dependencies.
  Previously succeeded upstream nodes with valid first-class artifacts are read as context, not re-run.
- Base: selected image-node runs may leave upstream `product_context` node status as `idle`; that node is reusable static
  context, so provider input must read its latest saved config/source image directly instead of depending on a current
  `WorkflowNodeRun` or fresh `output_json`.
- Base: selected-node execution planning is a DB-free domain rule fed by an application/query-layer reusable-edge
  decision. The domain rule decides which missing upstream node types are required; the query layer decides whether an
  existing `CopySet`, `PosterVariant`, or `SourceAsset` actually belongs to the workflow product.
- Base: image-node reusable artifact detection must accept both `poster_variant_ids` and
  `generated_poster_variant_ids` in node `output_json`, then validate those IDs against first-class `PosterVariant` rows
  for the same product before skipping an upstream image node.
- Bad: add an edge from an image node back to a copy node; the cycle validator rejects it before commit.

### 6. Tests Required

- Enum storage test includes workflow node/run enums and asserts database values equal enum `.value` strings.
- API regression creates a product with only name + image, loads the workflow, updates `product_context` node config with
  `source_note`/category/price, runs the DAG, and asserts the effective node context reaches `CopySet`, generated image
  input, node output, and run history.
- API regression rejects creating a second `product_context` node and verifies opening an active workflow normalizes duplicate
  product-context nodes down to one.
- API regression deletes downstream reference nodes and runs an image node directly, asserting a failed run/node with the
  clear connect-a-target message and no silent image output on the image node.
- API regression for node-first canvas creates/uses a `reference_image` node, uploads an image, connects it to
  `image_generation`, connects image generation to multiple downstream `reference_image` slots, runs the workflow, and
  asserts generated poster IDs, filled source asset IDs, size, and slot output are persisted.
- API regression for multi-target image generation asserts multiple downstream reference slots are filled and provider
  generation calls are initiated concurrently while database writes remain in the owning session.
- API/provider regression for generated-mode workflow image nodes asserts `output_json.provider_results` contains only
  compact provider summary fields such as `provider_name`, `model_name`, `provider_response_id`,
  `provider_response_status`, `actual_size`, and provider compatibility notes. Do not persist raw provider request bodies,
  full provider output JSON, prompts, API keys, or base URLs in workflow node output.
- API/provider regression asserts a real image-purpose binding overrides stale `poster_generation_mode=template`, uses the
  injected image provider dependency seam, bypasses `PosterRenderer`, and persists a `workflow:<provider>:...`
  `PosterVariant.template_name`.
- API regression uploads twice to the same `reference_image` node and asserts the node exposes only the second asset while
  both old and new `source_assets` remain on the product. Another regression fills an already populated reference node from
  an upstream `image_generation` node and asserts the same single-slot replacement behavior.
- API regression binds a reference node from an existing `source_asset_id` and asserts no duplicate SourceAsset is created;
  another regression binds from a `poster_variant_id` and asserts the poster materializes or maps to a reference SourceAsset.
- API/provider regression connects a `reference_image` node into `copy_generation` and asserts the reference label/role
  reaches generated copy/provider input.
- API regression edits a generated copy node through `PATCH /api/workflow-nodes/{node_id}/copy` and asserts both the
  persisted `CopySet` and node output summary fields are updated.
- API regression for selected-node runs creates successful upstream outputs, runs a downstream node, and asserts upstream
  node runs/artifacts are not duplicated when reusable outputs exist, including image-node outputs that expose
  `generated_poster_variant_ids`.
- API regression for selected reference-slot runs connects an already successful image node to a new empty
  `reference_image` slot and asserts only the necessary image node plus target slot run; copy generation must not re-run.
- Unit regression for workflow domain rules covers selected-node planning / missing-upstream decisions without creating a
  SQLAlchemy session.
- API regression edits a previously run `product_context` node, then directly runs a downstream node and asserts the
  downstream output context summary uses the latest saved config rather than stale context output.
- API regression asserts upstream copy text and reference-image label/role metadata appear in deterministic context sources
  for image generation.
- API/provider regression asserts the default `product_context -> image_generation` edge contributes the product source
  image to image-generation context, so `context_summary.reference_image_count` does not report `0` when the product image
  is connected through the product-context node, and that copy-linked runs expose `copy_prompt_mode = "copy"`.
- API/provider regression deletes the direct `product_context -> image_generation` edge while retaining
  `product_context -> copy_generation -> image_generation`, then directly runs the image node and asserts the provider
  still receives product fields plus the product source image. A separate regression must keep the disconnected blank
  image-generation path free-form.
- API/provider regression removes the copy node or otherwise runs an image node with no explicit copy link and asserts the
  provider receives `PosterGenerationInput.copy_prompt_mode = "image_edit"` while generated artifacts still have a
  `copy_set_id` for persistence.
- Alembic head upgrade must pass on SQLite after adding workflow tables.

### 7. Wrong vs Correct

#### Wrong

```python
node.output_json = {"copy": copy_payload.model_dump()}
```

This hides the artifact in opaque JSON only; later history cannot reliably reuse it.

#### Correct

```python
session.add(copy_set)
session.flush()
node.output_json = {"copy_set_id": copy_set.id, "summary": copy_set.structured_payload["summary"]}
```

Persist the first-class artifact, then keep only workflow-boundary references and summaries in JSON.

#### Wrong

```python
posters = [poster for poster in workflow.product.poster_variants if poster.id in poster_ids]
```

During one DAG run, relationship collections can be stale after an upstream node has just created new artifacts.

#### Correct

```python
posters = session.scalars(select(PosterVariant).where(PosterVariant.id.in_(poster_ids))).all()
```

For downstream nodes, query first-class artifacts by ID so same-run outputs are visible.

#### Wrong

```python
execution_nodes = ancestors(start_node) | {start_node}
```

This makes every selected-node run regenerate upstream copy/images even when the user only wants to refresh one downstream
node, wasting provider calls and replacing previously accepted artifacts.

#### Correct

```python
execution_nodes = missing_required_dependencies(start_node) | {start_node}
```

For selected-node runs, treat successful upstream nodes with valid `CopySet`, `PosterVariant`, or `SourceAsset` records as
read-only context. Re-run an upstream dependency only when the target cannot be satisfied from existing first-class
artifacts, such as a newly connected empty `reference_image` slot that needs its upstream image node to fill it.

## Scenario: AI provider scalar payload normalization

### 1. Scope / Trigger

- Trigger: any change to AI text provider payload parsing for creative briefs, generated copy, or workflow copy-node
  execution.
- This is a cross-layer contract because provider JSON is parsed into application contracts, persisted into
  `creative_briefs` / `copy_sets`, emitted through workflow node `output_json`, and consumed by frontend typed DTOs.

### 2. Signatures

- Application contracts:
  - `CreativeBriefPayload(positioning: str, audience: str, selling_angles: list[str], taboo_phrases: list[str], poster_style_hint: str)`.
  - `CopyPayloadV2(version: 2, purpose: str | None, summary: str, content: CopyContent, visual_guidance: VisualGuidance | None)`.
  - `PosterGenerationInput(..., structured_copy_context: str | None = None)`.
- Text provider methods:
  - `TextProvider.generate_brief(product: ProductInput) -> tuple[CreativeBriefPayload, str]`.
  - `TextProvider.generate_copy(product: ProductInput, brief: CreativeBriefPayload, config: CopyNodeConfigV2, reference_images: list[ReferenceImageInput] | None = None) -> tuple[CopyPayloadV2, str]`.
- Persistence/API boundary:
  - `CreativeBrief.payload` and workflow `latest_brief.payload` must expose scalar brief fields as strings.
  - `CopySet.structured_payload` and `CopySet.model_structured_payload` persist the v2 payload.

### 3. Contracts

- AI providers may occasionally return a pure text array for a scalar short-text field. The application contract boundary
  may normalize only these scalar fields by joining items with `、`:
  - `CreativeBriefPayload.positioning`
  - `CreativeBriefPayload.audience`
  - `CreativeBriefPayload.poster_style_hint`
- Fields whose contract is already a list must remain lists and must not be flattened into one scalar:
  - `CreativeBriefPayload.selling_angles`
  - `CreativeBriefPayload.taboo_phrases`
- V2 content supports `freeform`, `blocks`, and `layout_brief`. Optional fields such as block `label`, `role`,
  `visual_hint`, and visual guidance must remain optional so the model is not forced to invent fields that the task does not
  need.
- `copy_node_output(...)` exposes `structured_payload` and `summary` for copy content. It must not expose
  fixed copy-field output keys.
- Image-generation prompt context should set `PosterGenerationInput.structured_copy_context` from
  `copy_payload_context_text(normalize_copy_payload(copy_set.structured_payload))`.

### 4. Validation & Error Matrix

- Scalar field is a normal string -> accepted unchanged.
- Scalar field is a non-empty list of non-empty strings -> normalized to a single string joined by `、`.
- Scalar field is an empty list -> Pydantic `ValidationError`; do not silently store an empty string.
- Scalar field list contains an empty/blank string -> Pydantic `ValidationError`.
- Scalar field list contains an object, number, boolean, or `null` -> Pydantic `ValidationError`; do not coerce with
  `str(...)`.
- `CopyPayloadV2.content.kind` is not `freeform`, `blocks`, or `layout_brief` -> Pydantic `ValidationError`.
- `CopyPayloadV2.summary` is blank -> Pydantic `ValidationError`.
- V2 block/freeform/section text is empty where required -> Pydantic `ValidationError`.
- Other list-contract fields are not lists or violate min/max length -> Pydantic `ValidationError`.

### 5. Good/Base/Bad Cases

- Good: provider returns `{"audience": ["摄影入门用户", "图文内容创作者"]}`; persisted and API-visible payload uses
  `"摄影入门用户、图文内容创作者"`.
- Good: provider returns `{"version":2,"summary":"卖点速览","content":{"kind":"blocks","blocks":[...]}}`; `CopySet.structured_payload` stores the blocks, and downstream image context reads the structured payload text.
- Good: provider returns `content.kind="layout_brief"` for information hierarchy; downstream image context receives the
  section text and visual hints instead of fixed copy fields.
- Base: provider returns scalar strings for all scalar fields; values pass through unchanged.
- Bad: provider returns `{"audience": []}` or `{"audience": [{"name": "摄影入门用户"}]}`; validation fails instead of
  inventing a display string.
- Bad: adding a new copy node template that only stores `instruction/tone/channel` without `version: 2` and
  `output_mode`; templates must seed the v2 config so old shape cannot keep accumulating.

### 6. Tests Required

- Contract regression directly validates `CreativeBriefPayload` with scalar text arrays and malformed arrays; assert good
  arrays are joined with `、` and bad arrays raise `ValidationError`.
- Contract regression validates `CopyPayloadV2` with `freeform`, `blocks`, and `layout_brief`.
- Copy-generation workflow regression monkeypatches the text provider to return scalar arrays and asserts the persisted
  `CreativeBrief.payload` fields are normalized strings while `CopySet` persists structured payloads.
- Copy-generation workflow regression asserts copy-node `output_json.structured_payload.version == 2` and does not expose
  fixed copy-field output keys.
- Canvas-template regression asserts every built-in `copy_generation` node config includes v2 `version`, `purpose`, and
  `output_mode`.
- Product workflow DAG regression runs `POST /api/products/{product_id}/workflow/run` with provider scalar arrays and
  asserts copy-node `output_json` and product `latest_brief.payload` expose normalized strings.

### 7. Wrong vs Correct

#### Wrong

```python
payload = response_json
if isinstance(payload["audience"], list):
    payload["audience"] = str(payload["audience"])
```

This leaks Python/JSON list formatting into persisted copy and hides malformed provider output.

#### Correct

```python
CreativeBriefPayload.model_validate(response_json)
```

Keep normalization and malformed-shape rejection inside the application contract validators so all provider entrypoints
and workflow runs share the same behavior.

## Scenario: OpenAI-compatible text response extraction

### 1. Scope / Trigger

- Trigger: any change to `OpenAITextProvider` response parsing for `generate_brief` or `generate_copy`.
- Some OpenAI-compatible `/v1/responses` endpoints return a server-sent-event text body even for non-streaming SDK calls.
  In that case the SDK result may be a plain `str`, not a `Response` object.

### 2. Signatures

- `OpenAITextProvider._read_output_json(response: object) -> dict`.
- Supported response text sources:
  - `response.output_text` for normal OpenAI SDK `Response` objects.
  - Plain string JSON returned by compatible clients.
  - SSE `data:` records whose event/type is `response.output_text.delta`.
  - `response.model_dump(...).output[].content[].text` as a defensive SDK-object fallback.

### 3. Contracts

- The extraction step returns text only; JSON parsing and `CreativeBriefPayload` / `CopyPayloadV2` validation remain the
  next contract boundary.
- SSE extraction must concatenate only `response.output_text.delta` string chunks in order.
- Empty extracted text must continue to fail as `ValueError("文案 provider 未返回 JSON 对象：<empty>")`.
- Do not log full prompts, raw SSE payloads, provider responses, or API keys while diagnosing this path.

### 4. Validation & Error Matrix

- SDK `Response.output_text` contains JSON -> parse that JSON.
- Compatible endpoint returns plain JSON string -> parse that JSON string.
- Compatible endpoint returns SSE text with output deltas -> concatenate deltas, then parse JSON.
- SSE text has no output-text deltas and is not JSON -> raise `ValueError` with a short snippet.
- Extracted text is non-empty but malformed JSON -> try the existing embedded-object extraction before raising.

### 5. Good/Base/Bad Cases

- Good: `event: response.output_text.delta` chunks combine into `{"version":2,...}` and copy generation succeeds.
- Base: official SDK object exposes `output_text`; no SSE parsing is needed.
- Bad: reading only `getattr(response, "output_text", "")`, because a plain `str` response becomes `<empty>`.
- Bad: parsing every SSE `data:` payload as content; lifecycle events such as `response.completed` are not text deltas.

### 6. Tests Required

- Provider regression with an SSE string containing multiple `response.output_text.delta` chunks, asserting
  `_read_output_json(...)` returns the combined JSON object.
- Keep provider payload tests covering prompt settings, scalar normalization, and workflow copy output shape green.

### 7. Wrong vs Correct

#### Wrong

```python
text = getattr(response, "output_text", "").strip()
```

This treats compatible SSE string responses as empty output.

#### Correct

```python
text = _response_output_text(response)
payload = json.loads(text)
```

Centralize text extraction before JSON parsing so every text provider method supports the same response shapes.

## Scenario: Async workflow runs and deletion safety

### 1. Scope / Trigger

- Trigger: any change to workflow run kickoff/execution, active-run locking, workflow node deletion, or product deletion
  while workflow/job state may still be active.
- This is a cross-layer and database-backed contract because it spans API responses, background execution, run/node status
  persistence, database uniqueness, frontend polling, and storage cleanup.

### 2. Signatures

- APIs:
  - `POST /api/products/{product_id}/workflow/run` returns `ProductWorkflowResponse` after creating or reusing an active
    `workflow_runs` row; it must not wait for provider execution to finish.
  - `POST /api/products/{product_id}/workflow/runs/{run_id}/cancel` returns `ProductWorkflowResponse` after durably
    marking an active run `cancelled`.
  - `POST /api/products/{product_id}/workflow/runs/{run_id}/retry` returns `202 Accepted` after creating/enqueueing a new
    run from a failed run.
  - `DELETE /api/workflow-nodes/{node_id}` returns `ProductWorkflowResponse` after deleting the node and connected edges.
  - `DELETE /api/products/{product_id}` returns `204 No Content` after deleting the product and related persisted data.
- Application entrypoints:
  - `start_product_workflow_run(session, product_id, start_node_id=None) -> WorkflowRunKickoff`.
  - `execute_product_workflow_run(run_id) -> None`.
  - `delete_workflow_node(session, node_id) -> ProductWorkflow`.
  - `delete_product(session, product_id) -> str`.
- Database:
  - `workflow_node_runs` must enforce at most one active row per `node_id` where `status IN ('queued', 'running')`,
    using a partial unique index such as `uq_workflow_node_runs_one_active_per_node`.
  - `workflow_runs` may contain multiple `status = 'running'` rows for the same `workflow_id` when their active
    node-run sets are disjoint.

### 3. Contracts

- Run kickoff is a durable two-step contract:
  1. create/reuse a persisted `running` run plus `queued` node runs and immediately return the refreshed workflow;
  2. enqueue that `workflow_run_id` through Dramatiq/Redis with `enqueue_workflow_run(...)`;
  3. the `run_product_workflow_run` actor executes the selected nodes in a background execution boundary that opens its
     own database session.
- `workflow_runs` is the authoritative state for workflow execution. Redis/Dramatiq messages are recoverable delivery
  attempts; do not use in-process executors or Web-process memory as the source of truth.
- Manual cancel is a durable run-level transition to `cancelled` with `failure_reason = "已取消"`. Queued node runs are
  released back to idle node state; a running node run is marked failed with the same cancel reason because node statuses
  intentionally keep the existing five-value contract.
- Failed workflow runs are retryable through a new run. Retry must not create a duplicate run while any active run already
  owns a queued/running node run in the retry plan.
- Run responses and lightweight status responses expose `is_retryable`, `is_cancelable`, `queue_active_count`,
  `queue_running_count`, `queue_queued_count`, `queue_max_concurrent_tasks`, `queued_ahead_count`, and `queue_position`.
  Queue position for workflow runs is derived from queued node-run state, not Redis delivery metadata.
- API startup must call workflow run recovery for active runs with no node currently running, so a run committed before a
  Redis send or process restart is sent again.
- Worker startup may reset stale `workflow_node_runs.status = 'running'` rows back to `queued` before re-enqueueing their
  parent run. Do not reset recent running nodes on API startup because another worker may still be executing them.
- Duplicate kickoff for the same active node set must return the existing active workflow/run state or be caught by the
  node-run database uniqueness guard and converted back into `created=False`; it must not silently create duplicate
  provider calls for the same node.
- Kickoff for a selected node set that is disjoint from every active run's queued/running node runs may create a separate
  `running` workflow run for the same workflow. A full-workflow kickoff overlaps every node and therefore still reuses an
  existing active run when any node is active.
- Duplicate Redis messages must be idempotent:
  - terminal workflow runs (`succeeded` / `failed` / `cancelled`) are no-ops;
  - runs that already have a non-stale `running` node run are no-ops;
  - claiming a queued node run must be an atomic conditional update so two workers cannot execute the same provider call.
- Background execution must persist every decisive transition: node run `queued -> running -> succeeded/failed`, node
  status, workflow run `succeeded/failed`, output JSON, artifact IDs, `failure_reason`, and `finished_at`.
- Any exception inside or around the background execution boundary must mark the run `failed`; do not leave a stale
  `running` row that causes indefinite frontend polling.
- If all global generation running slots are occupied when a workflow worker tries to claim the next queued node run, the
  worker must leave that node run `queued`, avoid provider calls, and schedule delayed delivery retry. Starting the run
  itself should still succeed and show queued metadata instead of returning a submit-time busy error.
- Generated-mode workflow image provider calls must be bounded by
  `workflow_image_generation_provider_timeout_seconds`; timeout or provider failure must fail the run/node with a stable
  safe user-facing reason and must not persist provider keys, base URLs, raw prompts, request bodies, or tracebacks in
  `failure_reason`.
- The `run_product_workflow_run` Dramatiq actor must keep `max_retries=0` and an internal worker failsafe `time_limit`;
  the application execution boundary remains responsible for durable failure state.
- Node deletion must remove connected incoming/outgoing edges and existing `workflow_node_runs` for that node before
  returning the refreshed workflow.
- Product deletion must refuse active workflow runs, then rely on ORM/database cascade for related rows and
  perform best-effort storage tree cleanup after the database delete commits.

### 4. Validation & Error Matrix

- Missing product/workflow/node -> `404`.
- Starting a run whose planned node set overlaps an active run's queued/running node runs -> return existing active
  workflow state; do not create duplicate active node runs.
- Starting a selected-node run whose planned node set is disjoint from active node runs -> create/enqueue a separate
  `running` workflow run for the same workflow.
- Cancelling an active run -> persist `status = 'cancelled'`, set `finished_at`, release queued nodes from queued/running
  UI state, and make duplicate worker delivery a no-op.
- Cancelling a terminal succeeded/failed run -> `400`, `已结束的工作流运行不能取消`.
- Retrying a failed run while no active run exists -> create/enqueue a new run and keep the failed run retryable in
  history.
- Retrying while another active run owns any retry-plan node -> `400`, `相关节点运行中，不能重试`.
- Concurrent duplicate active node-run insert hits the partial unique index -> rollback, reload existing overlapping
  active run, return it.
- Global running capacity full during worker claim -> keep the workflow run `running`, keep the next node run `queued`, do
  not call providers, and enqueue delayed retry of the same `workflow_node_run_id`.
- Redis enqueue failure after the run has been created -> mark the run `failed`, release active node-run uniqueness slots,
  and return `503` with `任务队列暂不可用，请稍后重试`.
- Workflow image provider timeout -> mark the active run and image node run `failed`, set `finished_at`, use
  `图片生成超时，请稍后重试`, and release global generation queue capacity.
- Workflow image provider failures with recognized safe categories should not collapse into one generic message. Use
  concise user-facing reasons for rate limit/quota, content-policy refusal, connection interruption, provider request
  timeout, unsupported parameters, and provider 5xx/service failure; inspect wrapped exception causes/contexts when the
  outer provider layer uses a generic request-failure message.
- Workflow image provider failure with safe details such as unsupported dimensions -> mark failed with a concise prefixed
  reason such as `图片生成失败：image2 不支持 64x64，最小尺寸为 512x512`.
- Workflow image provider failure with raw provider details -> mark failed with a generic safe reason such as
  `图片生成失败，请稍后重试`; never expose secrets, base URLs, prompt payloads, request bodies, file paths, or tracebacks
  through `failure_reason`.
- Workflow image provider success may persist a compact `output_json.provider_results` summary for UI logs, but this is
  not a live progress channel. Real-time provider progress requires durable workflow node-run progress fields; do not fake
  ImageChat-style `provider_response_status` polling from stale terminal output.
- Duplicate Redis message for terminal run -> no-op and do not call providers.
- Duplicate Redis message while another worker owns a non-stale running node -> no-op and do not call providers.
- Delete a node while its workflow has an active run, or while the node is `queued` / `running` -> `400` with
  `运行中，稍后删除`.
- Delete a product while any related job is `queued` / `running` -> `400` with `商品任务运行中，稍后删除`.
- Delete a product while any related workflow run is `running` -> `400` with `商品工作流运行中，稍后删除`.
- Missing storage files during product deletion -> ignore for storage cleanup; the database deletion remains authoritative.

### 5. Good/Base/Bad Cases

- Good: `POST /workflow/run` returns quickly with `runs[0].status == "running"` and queued node statuses; polling later
  observes success/failure written by `execute_product_workflow_run`.
- Good: two duplicate run requests for the same selected node result in one active run and one provider execution path.
- Good: two selected-node run requests for graph-disjoint nodes can create two active workflow runs, while the database
  still prevents the same node from being queued/running twice.
- Good: deleting a workflow node removes that node plus connected edges, and a refreshed workflow response contains no
  broken edge references.
- Base: deleting a product with completed workflow history cascades workflow rows and then best-effort removes
  `storage/products/{product_id}`.
- Bad: leaving run execution inside the request handler blocks the frontend and hides intermediate committed status.
- Bad: checking active runs only in application code without a database uniqueness guard allows races in concurrent or
  multi-process deployments.

### 6. Tests Required

- API regression for run kickoff asserts the initial response is `running` / `queued`, then waits/polls until the
  background execution writes terminal status and artifacts.
- Duplicate active-node regression asserts a second kickoff for the same planned node set returns/reuses the same active
  run and that direct duplicate node-run insertion violates the unique active-node guard.
- Disjoint active-node regression asserts two selected-node kickoffs with no shared required nodes create distinct running
  workflow runs.
- Failure-path regression should force execution failure and assert stale `running` runs are marked `failed`.
- Workflow image-generation regressions should cover provider timeout cleanup, safe provider-failure reason sanitization,
  and the `run_product_workflow_run` actor failsafe `time_limit`.
- Durable delivery regressions should assert kickoff sends a Dramatiq workflow message, enqueue failure returns `503` and
  leaves no stranded active run, startup recovery requeues queued workflow runs, stale running node runs are reset only on
  worker recovery, and duplicate messages no-op for terminal/currently-running runs.
- Node deletion regression asserts connected edges and node runs are removed and active-run deletion is rejected.
- Product deletion regression asserts completed products are deleted, direct detail fetch returns `404`, and active
  workflow runs block deletion with the expected concise error.
- Alembic upgrade must replace the workflow-level active-run unique index with the active node-run unique index and first
  close historical duplicate queued/running node-run rows if present. Downgrade must close duplicate running workflow runs
  before restoring the workflow-level unique index.

### 7. Wrong vs Correct

#### Wrong

```python
workflow = run_product_workflow(session, product_id=product_id)
return serialize_product_workflow(workflow)
```

This keeps provider execution inside the HTTP request; the frontend sees a long pending mutation and cannot observe
intermediate node status until the request finishes.

#### Correct

```python
kickoff = start_product_workflow_run(session, product_id=product_id)
if kickoff.created:
    enqueue_workflow_run(kickoff.run_id)
return serialize_product_workflow(kickoff.workflow)
```

Persist the run state first, return quickly, and let the frontend poll the persisted workflow state.

#### Wrong

```python
if _active_workflow_run(workflow):
    return workflow
session.add(WorkflowRun(workflow_id=workflow.id, status=WorkflowRunStatus.RUNNING))
session.commit()
```

The workflow-level check blocks disjoint node runs and can still race with another request before commit.

#### Correct

```python
Index(
    "uq_workflow_node_runs_one_active_per_node",
    "node_id",
    unique=True,
    postgresql_where=text("status IN ('queued', 'running')"),
    sqlite_where=text("status IN ('queued', 'running')"),
)
```

Plan the node IDs first, reuse only overlapping active runs for normal control flow, enforce the same-node active invariant
in the database, and handle `IntegrityError` by reloading the existing overlapping active run.

## Scenario: Workflow node-group duplicate

### 1. Scope / Trigger
- Trigger: changes to canvas copy/paste, node-group duplicate routes, reusable node config sanitization, or undo restore of
  deleted workflow nodes.
- Node-group duplication creates ordinary workflow rows for repeated workbench modules without reusing generated artifacts
  or run state.

### 2. Signatures
- API: `POST /api/products/{product_id}/workflow/node-groups/duplicate -> ProductWorkflowResponse`.
- Request fields:
  - `node_ids: list[str]`
  - `position_x: int | None`
  - `position_y: int | None`
  - `offset_x: int`
  - `offset_y: int`
- Application use case returns the refreshed active `ProductWorkflow`.

### 3. Contracts
- Duplicate operates only on nodes in the product's active workflow.
- `product_context` nodes are never duplicated. If the selected group contains only product context nodes, the request is
  invalid.
- Duplicated nodes keep node type, title, relative position, and normalized editable `config_json`.
- Duplicated nodes start with idle/default run state and empty outputs. Do not copy `output_json`, failure reason,
  `last_run_at`, workflow-node-run rows, workflow-run rows, `CopySet`, `PosterVariant`, `SourceAsset`, image-session
  assets, or gallery artifacts.
- Internal edges are recreated only when both source and target are duplicated. External edges to unselected nodes are not
  recreated.
- Reusable config sanitization must match user-template boundaries: strip known artifact fields and reject unknown
  artifact-shaped config keys ending in `_id`, `_ids`, `_url`, or `_path`.
- The insertion position may be anchored to a requested point or use a deterministic offset from the selected group.

### 4. Validation & Error Matrix
- Empty `node_ids` -> `400` with a concise selection-required message.
- Duplicate node ids in request -> `400` with duplicate selection message.
- Unknown product or no active workflow -> existing product/workflow not-found behavior.
- Node outside active workflow -> `400` with current-canvas ownership message.
- Selected group contains no duplicable node after excluding `product_context` -> `400`.
- Sanitization finds artifact-shaped config -> `400` with reusable-config validation message.

### 5. Good/Base/Bad Cases
- Good: duplicate a copy -> image -> reference chain and get three new nodes plus two internal edges.
- Good: duplicate a filled reference node and preserve reusable `role` / `label` while dropping asset ids and output JSON.
- Base: duplicate a group selected with the product context plus copy/image nodes; only copy/image nodes are recreated.
- Bad: duplicate a node with `output_json.copy_set_id` or `source_asset_ids` and make the new node appear already
  generated.
- Bad: recreate edges from the copied group back to original unselected nodes, which changes the user's graph topology.

### 6. Tests Required
- API regression for duplicating selected nodes with internal edges.
- Regression that `product_context` is skipped and a product-context-only selection is rejected.
- Regression that output JSON, run state, run rows, and artifact-shaped config are not copied.
- Regression that duplicated nodes are selected/usable through normal frontend workflow payloads.

### 7. Wrong vs Correct

Wrong:

```python
new_node = WorkflowNode(**old_node.__dict__)
```

This copies database identity, output/run fields, and artifact references.

Correct:

```python
new_node = WorkflowNode(
    workflow_id=workflow.id,
    node_type=old_node.node_type,
    title=old_node.title,
    config_json=_extract_reusable_config(old_node),
)
```

Create a fresh workflow node from reusable intent only, then recreate selected internal edges.

---

## Scenario: Product context singleton and direct image generation

### 1. Scope / Trigger
- Trigger: product workflow DAG changes that affect product-context nodes, image-node run prerequisites, or default graph
  shape.

### 2. Signatures
- `POST /api/products/{product_id}/workflow/nodes` rejects `node_type = product_context` when the active workflow already
  has one.
- `POST /api/products/{product_id}/workflow/run` with `start_node_id` pointing at an `image_generation` node requires at
  least one connected downstream `reference_image` target.
- Image-node output with downstream targets contains `generated_poster_variant_ids`, `copy_set_id`, `target_count`,
  `filled_source_asset_ids`, and `filled_reference_node_ids`; it does not expose `poster_variant_ids` as a node-level
  image carrier.

### 3. Contracts
- Each active workflow has exactly one `product_context` node. Runtime opening may normalize older duplicate rows by keeping
  the earliest context node and deleting duplicate context nodes plus their connected edges/node-run rows.
- Default workflows include one product context, one copy node, one image node, and one downstream reference slot. The
  default edge set is `product_context -> copy_generation`, `product_context -> image_generation`,
  `copy_generation -> image_generation`, and `image_generation -> reference_image`.
- Image nodes prefer connected/manual/confirmed copy when present. If absent, the backend creates a draft `CopySet` with
  `provider_name = workflow_context` from product context and the image instruction so `PosterVariant.copy_set_id` remains a
  first-class artifact link.
- Downstream reference slots are required outputs. One image is generated per unique slot and each slot is filled with a
  `SourceAsset`; when absent, no provider call is made and the image node fails with the connect-a-target message.

### 4. Validation & Error Matrix
- Duplicate product-context creation -> `400` with `商品资料节点已存在`.
- Missing/unconnected product source image -> image nodes may still run as blank/free generation when they have a
  downstream reference target and prompt/context; do not fail solely because no product image is connected.
- Missing copy node or missing upstream copy -> create a workflow-context draft `CopySet` if a downstream target exists;
  do not reuse `product.confirmed_copy_set` unless a copy node/config explicitly links it into the image node context.
- Missing downstream reference slot -> fail before generation with the connect-a-target message.
- Duplicate downstream edges to the same reference slot -> one generated image for that unique slot.

### 5. Good/Base/Bad Cases
- Good: selected image-node run after editing product context and image instruction uses the latest saved draft and fills a
  connected downstream reference slot.
- Base: optional copy/reference nodes can be connected and will enrich input/fill slots when present.
- Bad: rendering generated image preview/download on the `image_generation` node itself instead of on filled
  `reference_image` slots.

### 6. Tests Required
- API regression for duplicate product-context rejection.
- API regression for direct image-node run with copy/reference nodes removed.
- Product list regression for source-image thumbnail URL because direct image output is discoverable from list/detail UI.

### 7. Wrong vs Correct
#### Wrong

```python
if copy_set is None:
    raise ValueError("图片生成节点缺少可用文案")
if not downstream_reference_nodes:
    raise ValueError("请先把生图节点连接到至少一个图片/参考图节点，再运行图片生成")
```

#### Correct

```python
if copy_set is None:
    copy_set = _create_context_copy_set(session, product=product, product_context=context, node=node)
targets = downstream_reference_nodes
```


--- FILE: .trellis\spec\backend\quality-guidelines.md ---

# Backend Quality Guidelines

> Backend quality standards reflected by ProductFlow's current code, tests, and tooling.

---

## Tooling

Backend tooling is defined in `backend/pyproject.toml` and root `justfile`:

- Python target: `>=3.12`.
- Ruff line length: `120`.
- Ruff target version: `py312`.
- Ruff lint selections: `E`, `F`, `I`, `UP`, `B`; `B008` is intentionally ignored for FastAPI dependency defaults.
- Pytest discovers tests under `backend/tests/`.

Common commands:

```bash
just backend-test
uv run --directory backend ruff check .
just backend-migrate
just backend-run
just backend-worker
```

Use the root `justfile` where possible so local env loading and ports match the project.

### Scenario: Production-style Docker Compose self-host runtime

#### 1. Scope / Trigger

- Trigger: editing `docker-compose.yml`, Dockerfiles, example env files, or README/docs for the self-hosted runtime.
- Applies to the full Compose stack: PostgreSQL, Redis, FastAPI API, Dramatiq worker, built Web static server, and shared storage.

#### 2. Signatures

- One-click start: `docker compose up -d --build`.
- Manual migration path: `docker compose run --rm productflow-backend alembic upgrade head`.
- Direct API health: `GET /healthz` returns `{"status":"ok"}`.
- Web proxy smoke path: `GET /api/healthz` through nginx proxies to backend `GET /healthz`.

#### 3. Contracts

- `productflow-backend` and `productflow-worker` must use Compose service names for runtime dependencies:
  - `DATABASE_URL=postgresql+psycopg://productflow:<password>@productflow-postgres:5432/productflow`
  - `REDIS_URL=redis://productflow-redis:6379/0`
- Container storage must use a shared in-container path `STORAGE_ROOT=/app/storage`.
- `STORAGE_HOST_PATH` is host-only Compose interpolation for production bind mounts. When unset, `/app/storage` is backed
  by the named volume `productflow-storage`; when set, it may point at an existing host directory such as
  `/home/cot/ProductFlow-release/shared/storage` for old systemd production storage reuse.
- Local hot-reload development must stay isolated on `.env.dev` / `STORAGE_ROOT=./backend/storage-dev`; do not depend on
  shell-sourcing production `.env` for development commands.
- Web self-host runtime must serve Vite build output as static files and proxy same-origin `/api/*` to the backend service.
- Runtime must not require host `uv`, `pnpm`, or `just`; those tools are only for local development.

#### 4. Validation & Error Matrix

- Missing `POSTGRES_PASSWORD` in `.env` -> Compose config/start should fail before launching Postgres.
- Postgres/Redis unhealthy -> backend must wait via `depends_on.condition: service_healthy`.
- Migration failure -> backend container must fail before serving API traffic.
- Backend unhealthy -> worker and web must wait for backend health before starting.
- Web `/api/*` not proxied -> same-origin frontend API calls fail even if static files load.
- Old systemd production files disappear after migration -> check whether `STORAGE_HOST_PATH` was set to the existing host
  storage directory before Compose created/used a fresh named volume.
- `STORAGE_HOST_PATH` leaks into container application config or replaces `STORAGE_ROOT` -> fix Compose env wiring; the app
  should still see `STORAGE_ROOT=/app/storage`.

#### 5. Good/Base/Bad Cases

- Good: `docker compose up -d --build` starts all five services, API health is OK, and web `/api/healthz` returns backend health.
- Good: `STORAGE_HOST_PATH=/home/cot/ProductFlow-release/shared/storage docker compose up -d --build` bind-mounts old
  production files while API/worker still run with `STORAGE_ROOT=/app/storage`.
- Base: local development starts only `productflow-postgres` and `productflow-redis`, while host `just` commands run API/worker/web.
- Bad: `DATABASE_URL` points at `localhost` from inside containers; that targets the app container itself, not Postgres.
- Bad: setting container `STORAGE_ROOT=/home/cot/ProductFlow-release/shared/storage`; that host path does not exist inside
  the container and bypasses the stable `/app/storage` contract.
- Bad: using Vite dev server or host `pnpm` as the documented production-style self-host web runtime.

#### 6. Tests Required

- Run `docker compose config --quiet` after Compose/env edits.
- For storage-related Compose changes, render config with `STORAGE_HOST_PATH` both unset and set; assert backend/worker
  mount `/app/storage`, keep `STORAGE_ROOT=/app/storage`, and do not expose `STORAGE_HOST_PATH` in container env.
- Build container images with `docker compose build productflow-backend productflow-web` or a full `docker compose up -d --build` smoke.
- Smoke a disposable or safe project with direct API health, web health, and web `/api/healthz` proxy checks when practical.
- Keep normal backend/frontend gates green when Dockerfiles or docs depend on package commands: backend tests/ruff and frontend lint/test/build.

#### 7. Wrong vs Correct

Wrong:

```yaml
DATABASE_URL: postgresql+psycopg://productflow:password@localhost:15432/productflow
```

Correct:

```yaml
DATABASE_URL: postgresql+psycopg://productflow:${POSTGRES_PASSWORD}@productflow-postgres:5432/productflow
```

Wrong:

```yaml
environment:
  STORAGE_ROOT: /home/cot/ProductFlow-release/shared/storage
volumes:
  - productflow-storage:/app/storage
```

Correct:

```yaml
environment:
  STORAGE_ROOT: /app/storage
volumes:
  - ${STORAGE_HOST_PATH:-productflow-storage}:/app/storage
```

### Scenario: Keep Compose release and open-source examples clean

#### 1. Scope / Trigger

- Trigger: editing repository release helpers, example env files, or ignore rules that affect what can be published.
- Applies to `scripts/release.sh`, `justfile`, `docker-compose.yml`, `.env.example`, `.env.dev.example`,
  `web/.env.example`, `.gitignore`, and `.trellis/.gitignore`.

#### 2. Signatures

- `just release` / `scripts/release.sh` is the single-host Docker Compose production update helper.
- `just release-dry-run` sets `DRY_RUN=1` and must not stop legacy services, build images, start containers, switch
  symlinks, or delete volumes.
- The actual release path validates Compose config, stops legacy user-level systemd services when present, runs
  `docker compose up -d --build --remove-orphans`, and performs HTTP health checks.
- Legacy services are `productflow-backend.service`, `productflow-worker.service`, and `productflow-web.service`.
- Supported override: `LEGACY_SYSTEMD_ACTION=skip` skips the legacy service stop step after the operator has handled port
  ownership manually.

#### 3. Contracts

- Example env files must contain placeholders or mock-provider defaults only; never commit real secrets or private hostnames.
- Local env backups such as `.env.bak-*` must stay ignored; they may contain copied production secrets and must not be
  inspected, tracked, or included in open-source release hygiene diffs.
- Release/update helpers must not delete Docker volumes; `docker compose down -v` is only a documented manual reset.
- Dry-run must remain non-switching and non-service-starting while still validating `docker compose config --quiet` and
  showing the real command sequence.
- Release helpers must not shell-source `.env`; use Docker Compose's env parsing for service configuration and read only
  the specific local values needed for health-check URLs without executing the file.
- Compose release must gracefully tolerate missing or inactive legacy systemd services but should try to stop them before
  binding the production ports.
- Keep `.trellis/spec/`, `.trellis/workflow.md`, and `.trellis/scripts/` source-controlled; keep `.trellis/tasks/` and
  `.trellis/workspace/` out of public tracking.

#### 4. Validation & Error Matrix

- Real token/private key in a tracked or newly added file -> remove it and rotate the secret before publishing.
- Untracked `.env.bak-*` appears in `git status` -> add/verify ignore coverage without reading or modifying the backup
  file content.
- `just release-dry-run` starts/stops services or builds images -> fix immediately; dry-run is for safe planning.
- `just release` fails because old systemd services still occupy 29280/29281 -> ensure the helper stops legacy services or
  clearly reports the port-binding failure.
- `.trellis/tasks/` appears in `git ls-files` -> remove it from the index without deleting the local task context.

#### 5. Good/Base/Bad Cases

- Good: `just release-dry-run` validates Compose config and prints the planned `docker compose up -d --build --remove-orphans` flow without side effects.
- Good: `just release` stops legacy services, recreates Compose services, passes backend and web `/api/healthz` checks, and leaves volumes intact.
- Base: `.env.dev.example` uses local service ports and mock providers while allowing contributors to opt into real
  providers by setting their own untracked env file.
- Bad: release script creates tar snapshots, flips a `.release/current` symlink, or restarts `productflow-*.service` after
  Compose has become the production runtime.

#### 6. Tests Required

- Run `bash -n scripts/release.sh` after shell helper edits.
- Run `just release-dry-run` or at minimum `DRY_RUN=1 bash scripts/release.sh` after release helper edits.
- Run `docker compose config --quiet` after Compose/env edits.
- For full release validation when practical, run `just release` and smoke backend `/healthz`, web `/healthz`, and web
  `/api/healthz`.
- Run `git diff --check` and `git diff --cached --check` before committing release hygiene changes.
- Run a high-confidence secret pattern scan over tracked and newly added files, excluding lockfiles if needed for noise.
- Confirm referenced files and `just` commands exist when README or docs are updated.

#### 7. Wrong vs Correct

Wrong:

```bash
systemctl --user restart productflow-backend.service productflow-worker.service productflow-web.service
```

Correct:

```bash
systemctl --user stop productflow-backend.service productflow-worker.service productflow-web.service || true
docker compose up -d --build --remove-orphans
```

---

## Required Patterns

### Keep provider code behind infrastructure factories

Existing provider selection is centralized in:

- `backend/src/productflow_backend/infrastructure/text/factory.py`
- `backend/src/productflow_backend/infrastructure/image/factory.py`

Routes and use cases call provider interfaces/factories, not concrete SDK classes directly. If adding providers, update the
factory, config definitions, tests, and settings UI types together.

Workflow execution has an additional explicit dependency seam in
`application/product_workflow_dependencies.py`. Default workflow execution dependencies resolve providers directly through
the infrastructure provider factories. Tests and future composition code that need fake providers should pass a
`WorkflowExecutionDependencies` instance directly rather than patching the `product_workflows.py` facade.

#### Scenario: Workflow execution dependency seams

##### 1. Scope / Trigger
- Trigger: editing workflow execution provider or renderer construction.

##### 2. Signatures
- `WorkflowExecutionDependencies(text_provider_resolver, image_provider_resolver, poster_renderer_factory)`.
- `run_product_workflow(..., dependencies=None)`, `execute_product_workflow_run(..., dependencies=None)`, and internal
  `_execute_node(..., dependencies=None)` accept this seam without changing API/worker call sites.

##### 3. Contracts
- `None` uses default resolvers that call the infrastructure text/image provider factories.
- The `product_workflows.py` facade exports public workflow use cases for route/worker imports only; it must not expose
  provider factory helpers or private `_...` execution helpers as test seams.
- Custom dependencies may be passed by focused tests or future composition code; they must return provider interface
  instances, not concrete SDK payloads.

##### 4. Validation & Error Matrix
- Resolver/provider failure -> existing workflow failure handling persists the run/node failure reason.
- Missing image provider for generated mode -> remains a runtime execution failure, not a schema/API change.

##### 5. Good/Base/Bad Cases
- Good: a focused test injects fake providers through `WorkflowExecutionDependencies`.
- Base: route/worker code calls public workflow use cases with `dependencies=None`, and execution resolves providers via
  the infrastructure factories.
- Bad: tests monkeypatch `product_workflows.get_image_provider`, `product_workflows.get_text_provider`, or
  `product_workflows._execute_node`.
- Bad: workflow execution imports a concrete provider SDK class.

##### 6. Tests Required
- Keep provider/workflow regression tests passing after resolver changes.
- Add a focused injection test when changing resolver behavior itself.

##### 7. Wrong vs Correct
Wrong:

```python
provider = OpenAIResponsesImageProvider()
```

Correct:

```python
provider = dependencies.image_provider()
```

Wrong:

```python
monkeypatch.setattr("productflow_backend.application.product_workflows.get_image_provider", fake_factory)
```

Correct:

```python
dependencies = WorkflowExecutionDependencies(image_provider_resolver=fake_factory)
run_product_workflow(session, product_id=product.id, dependencies=dependencies)
```

### Validate inputs at the correct boundary

- FastAPI `Query` constraints are used for list pagination in `presentation/routes/products.py`.
- Upload MIME/size/pixel validation is centralized in `presentation/upload_validation.py`.
- Business text/price normalization lives in `application/use_cases.py` helpers such as `_normalize_required_text(...)` and
  `_normalize_price(...)`.
- Runtime settings normalization lives in `backend/src/productflow_backend/config.py`.

Do not duplicate these checks in multiple pages/routes.

### Scenario: Provider-neutral image generation size contract

#### 1. Scope / Trigger

- Trigger: editing continuous image sessions, workflow `image_generation` node config, runtime image settings, provider image payloads, or frontend image-size controls.
- Applies to the shared `WIDTHxHEIGHT` image-size contract across `ImageChatPage`, workflow Inspector, API schemas, runtime settings, workflow execution, and image providers.

#### 2. Signatures

- Backend canonical normalizer: `normalize_image_generation_size(value: str, *, max_dimension: int | None = None) -> str`.
- Runtime max single-edge setting: `image_generation_max_dimension`.
- Public runtime config API: `GET /api/settings/runtime` returns `image_generation_max_dimension`.
- Built-in presets are application UI constants; runtime settings expose only the max single-edge limit, not a
  user-facing allowed-size preset list.
- Continuous image API request field: `GenerateImageSessionRoundRequest.size`.
- Workflow image node config field: `config_json.size` for nodes with `kind == "image_generation"`.
- Frontend shared picker: `ImageSizePicker` emits normalized lowercase `WIDTHxHEIGHT` strings.

#### 3. Contracts

- Store and pass image size as a provider-neutral lowercase `WIDTHxHEIGHT` string, for example `1024x1024` or `3840x2160`.
- Each side is calibrated to the nearest provider-safe 16-pixel multiple before provider dispatch, for example `1500x800`
  becomes `1504x800`.
- Preset buttons are built-in ratio/tier shortcuts filtered by the runtime max single-edge setting; they are not a backend
  allowlist and are not loaded as arbitrary database-configured options.
- `normalize_image_generation_size(...)` must use `get_runtime_settings().image_generation_max_dimension` unless a focused
  caller/test passes an explicit `max_dimension`.
- Custom dimensions must be validated and calibrated by the backend before provider calls, not only by frontend controls.
- Continuous image generation and workflow image-generation nodes must use the same backend normalizer so their accepted/rejected sizes do not drift.
- Provider adapters should receive the normalized string unchanged unless a provider-specific adapter explicitly documents a conversion.

#### 4. Validation & Error Matrix

- Bad syntax such as `1024`, `1024*1024`, or missing dimensions -> request/config validation error.
- Non-positive dimensions such as `0x1024` or `1024x-1` -> request/config validation error.
- Dimensions above the project safety bounds -> normalize to a safe calibrated `WIDTHxHEIGHT` before provider dispatch.
- Dimensions that are not divisible by 16 -> normalize to the nearest safe 16-pixel multiple before provider dispatch.
- Uppercase separators/digits such as `3840X2160` -> normalize to lowercase `3840x2160`.
- `image_generation_max_dimension < 512` or `> 8192` -> settings validation error.
- Invalid runtime default image dimensions -> settings validation error instead of silently publishing broken provider defaults.

#### 5. Good/Base/Bad Cases

- Good: `3840x2160` entered in the workflow Inspector is saved as `3840x2160` and reaches the image provider as `image_size="3840x2160"`.
- Base: built-in presets such as `1024x1024`, `2048x2048`, and `3840x3840` render as picker buttons and submit the same canonical string.
- Bad: continuous image sessions accept custom sizes while workflow nodes only apply a loose string normalizer.
- Bad: frontend checks dimensions but backend forwards an oversized custom value to the provider.

#### 6. Tests Required

- Continuous image API tests must cover accepted custom dimensions, rejected malformed/non-positive dimensions, and
  oversized dimensions being stored as calibrated safe output sizes.
- Workflow DAG/API tests must cover node create/update normalization, invalid config rejection, provider input receiving
  the configured custom size, and oversized config being persisted as calibrated safe output size.
- Runtime settings tests must cover invalid default image dimensions and `image_generation_max_dimension` validation when
  validation behavior changes.
- Frontend helper/component tests should cover preset parsing, duplicate normalization, and custom-size round-tripping when picker logic changes.

#### 7. Wrong vs Correct

Wrong:

```python
# Workflow accepts any parseable size while continuous image uses different validation.
size = normalize_image_size(config_json.get("size", "1024x1024"))
```

Correct:

```python
# All image generation entry points share the same safety bounds and canonical form.
size = normalize_image_generation_size(config_json.get("size", "1024x1024"))
```

Wrong:

```tsx
<input value={draft.size} onChange={(event) => onChange({ size: event.target.value })} />
```

Correct:

```tsx
<ImageSizePicker value={draft.size} onChange={(size) => onChange({ size })} presets={imageSizePresets} />
```

### Preserve workflow-level tests

`backend/tests/test_*.py` is the backend regression suite and is split by behavior area. It covers:

- Auth/session behavior.
- Settings API persistence and validation.
- Typed business error and legacy `ValueError` HTTP mapping.
- SQLAlchemy enum value storage.
- End-to-end product/copy/poster workflow.
- Reference image upload/deletion.
- Continuous image-session behavior.
- Alembic upgrade path.
- OpenAI Responses image provider parsing behavior.

When changing product, copy, poster, settings, upload, image-session, provider, or migration behavior, add or update tests
in the matching topic file. Keep cross-cutting builders and polling/login helpers in `backend/tests/helpers.py` rather
than reintroducing a giant all-purpose test module.

When extracting workflow graph business rules, add at least one DB-free unit test for the domain rule in addition to any
API/integration regression. The application/query layer should own SQLAlchemy artifact existence checks; the domain rule
should own pure graph decisions.

### Keep storage safe

Use `LocalStorage` from `backend/src/productflow_backend/infrastructure/storage.py` for storage paths. It resolves relative
paths under the configured root and rejects absolute/path-traversal paths. Do not build download paths manually in routes.

### Keep durable async task semantics idempotent

Durable task creation and workers are designed to avoid duplicate active work and duplicate execution:

- Queue send failures are handled by application submit use cases before returning 503:
  `submit_product_workflow_run(...)` and `submit_image_session_generation_task(...)`.
- Dramatiq actors use `max_retries=0`; application code owns retry state.
- Product workflow runs follow the same durable-delivery rule with `recover_unfinished_workflow_runs(...)`: the
  `workflow_runs` / `workflow_node_runs` tables are authoritative, Dramatiq is only delivery, and duplicate messages must
  no-op for terminal or currently-running runs.
- Continuous image-session generation follows the same durable-delivery rule with
  `image_session_generation_tasks` and `recover_unfinished_image_session_generation_tasks(...)`: `POST
  /api/image-sessions/{id}/generate` creates a queued DB task and returns `202`; worker execution creates the existing
  `image_session_rounds` / `image_session_assets` rows on success, and duplicate terminal messages must no-op.

Preserve these semantics when editing durable task code.

### Scenario: Durable generation task contract

#### 1. Scope / Trigger

- Trigger: adding or changing any database-durable async path that creates provider-backed image/copy/poster generation
  work, enqueues a Dramatiq message, runs in a worker, or exposes queued/running/failed state through a status API.
- Existing members are intentionally separate business models:
  - `WorkflowRun` plus `WorkflowNodeRun` for product workflow generation;
  - `ImageSessionGenerationTask` for continuous image-session generation.
- New work must extend or reference `domain/durable_generation_tasks.py` before adding a third state machine.

#### 2. Signatures

- Contract home: `domain/durable_generation_tasks.py`.
- Shared enqueue boundary: `application/queue_submission.py::enqueue_or_mark_failed(...)`.
- Shared capacity gates:
  - durable submit compatibility lock: `application/admission.py::ensure_generation_capacity(...)`;
  - worker-time running cap: `application/admission.py::generation_running_capacity_available(...)`.
- Current contracts:
  - `WORKFLOW_RUN_GENERATION_TASK_CONTRACT`;
  - `IMAGE_SESSION_GENERATION_TASK_CONTRACT`.
- Current worker actors:
  - `workers.run_product_workflow_run(workflow_run_id: str)`;
  - `workers.run_image_session_generation_task(task_id: str)`.

#### 3. Contracts

- Database rows are authoritative task state. Redis/Dramatiq messages are delivery attempts only.
- A submit use case must create or reuse a durable row before enqueueing. If queue send fails after a durable row exists,
  it must mark the row failed through the owning model's failure transition and raise `QueueUnavailableError` with
  `任务队列暂不可用，请稍后重试`.
- Worker actors must set `max_retries=0`; application execution entrypoints own failure persistence, retry counters,
  partial-result handling, and terminal status.
- Duplicate delivery must be idempotent. Terminal rows and already-running work must return without provider calls or new
  artifacts. Claims must use a database conditional update for queued-to-running transitions where the model has an
  explicit queued state.
- Startup recovery must inspect durable DB state and then resend delivery only for queued or stale-running work according
  to the model's recovery rules. API startup must not reset recent running work owned by another worker.
- Generation capacity must use the shared DB-backed worker gate. Submit paths create or reuse durable queued rows, while
  worker claims count running work before entering provider execution.
- Status snapshots and queue metadata must be derived from durable rows and first-class result rows, not Redis queue
  length or in-process memory.
- Manual cancel must be an owning durable-row transition. Terminal statuses include `cancelled` where the business model
  supports user cancellation, and duplicate delivery for cancelled rows must no-op.

#### 4. Validation & Error Matrix

- Queue send failure after durable creation -> durable row is failed, API returns `503`,
  `{"detail": "任务队列暂不可用，请稍后重试"}`.
- Running capacity reached during worker claim -> durable row stays queued, provider is not called, and delivery is
  retried later.
- Duplicate terminal message, including cancelled rows -> no-op, no provider call, no new artifact row.
- Duplicate currently-running message -> no-op; stale-running recovery handles old abandoned work separately.
- Recovery sees queued work -> resend delivery without changing product/provider semantics.
- Recovery sees stale running work -> apply the owning model's documented stale behavior, then resend or fail as
  appropriate.
- Status refresh during generation -> response is reconstructed from DB rows and remains stable across process restart.

#### 5. Good/Base/Bad Cases

- Good: a new generation path adds a `DurableGenerationTaskContract`, persists a durable queued row, submits through
  `enqueue_or_mark_failed(...)`, gates provider execution with `generation_running_capacity_available(...)`, uses a
  `max_retries=0` actor, and adds recovery/status tests.
- Good: workflow run and image-session task continue using separate tables and business statuses while sharing contract
  constants and checks for active/running/queued semantics.
- Base: workflow run has no task-level queued status; its active run is `running`, while node runs hold queued/running
  execution state. The contract should describe that split instead of forcing a new workflow table shape.
- Bad: adding a new async provider path that creates a row and calls `actor.send(...)` directly without
  `enqueue_or_mark_failed(...)`.
- Bad: enabling Dramatiq automatic retries for generation actors.
- Bad: computing queue position or active state from Redis delivery metadata.

#### 6. Tests Required

- Contract regression: current generation contracts still name distinct durable models and expose the expected
  active/queued/running/terminal statuses.
- Worker actor regression: all generation actors satisfy `actor.options["max_retries"] == 0` through the shared contract
  assertion.
- Enqueue failure regression: mocked send failure marks the durable row failed and returns stable `503`.
- Duplicate-message regression for each durable model: terminal and currently-running messages do not call providers.
- Recovery regression for each durable model: queued/stale-running DB rows are handled according to the owning recovery
  rules.
- Admission/status regression: active/running counts and status snapshots are derived from durable DB rows.

#### 7. Wrong vs Correct

Wrong:

```python
session.add(task)
session.commit()
run_new_generation_actor.send(task.id)
```

This can strand a queued durable row if Redis/Dramatiq delivery fails.

Correct:

```python
task = create_durable_generation_task(session, ...)
enqueue_or_mark_failed(
    task.id,
    enqueue=enqueue_generation_task,
    mark_failed=lambda task_id, reason: mark_generation_task_enqueue_failed(session, task_id, reason),
)
```

Wrong:

```python
@dramatiq.actor(max_retries=3)
def run_generation_task(task_id: str) -> None:
    execute_generation_task(task_id)
```

Correct:

```python
@dramatiq.actor(max_retries=0)
def run_generation_task(task_id: str) -> None:
    execute_generation_task(task_id)
```

#### Scenario: Durable async continuous image-session generation

##### 1. Scope / Trigger

- Trigger: changing `POST /api/image-sessions/{id}/generate`, image-session generation persistence, queue delivery,
  worker execution, admission control, or frontend session detail polling for continuous image chat.
- Continuous image-session generation is a cross-layer async workflow: DB task rows are authoritative, Dramatiq/Redis is
  delivery only, and the frontend reconstructs queued/running/failed state from `ImageSessionDetail`.

##### 2. Signatures

- API: `POST /api/image-sessions/{image_session_id}/generate` returns `202 Accepted` after validation, durable task
  creation, and enqueue; it must not wait for an image provider call.
- API: `POST /api/image-sessions/{image_session_id}/generation-tasks/{task_id}/retry` returns `202 Accepted` after
  resetting a failed retryable task to `queued` and enqueueing the same durable task ID.
- API: `POST /api/image-sessions/{image_session_id}/generation-tasks/{task_id}/cancel` returns
  `ImageSessionDetailResponse` after durably marking an active task `cancelled`.
- DB: `image_session_generation_tasks` stores `session_id`, `prompt`, `size`, `base_asset_id`,
  `selected_reference_asset_ids`, `generation_count`, `status`, progress fields (`completed_candidates`,
  `active_candidate_index`, `progress_phase`, `progress_updated_at`, provider response id/status and metadata),
  `failure_reason`, `result_generation_group_id`, `attempts`, `is_retryable`, `created_at`, `started_at`, and
  `finished_at`.
- Queue: `enqueue_image_session_generation_task(task_id: str)` sends the durable task ID; the worker actor consumes only
  the ID and reloads state from the database.
- Recovery: `recover_unfinished_image_session_generation_tasks(reset_stale_running: bool = False, stale_running_after:
  timedelta | None = None)` re-sends queued tasks and, only for worker startup, handles stale running tasks by comparing
  the cutoff against `progress_updated_at`, falling back to `started_at` for older rows. Tasks with no completed
  candidates may be reset to queued; stale partial-success tasks are marked failed without retry.
- Response DTO: `ImageSessionDetailResponse.generation_tasks` exposes task summaries so route entry/refresh can show
  active or failed generation work without a separate orchestration endpoint.
- Each generation task summary exposes `attempts`, `is_retryable`, and `is_cancelable` so the frontend can decide whether
  to render manual retry/cancel affordances.
- Each generation task summary includes global queue fields: `queue_active_count`, `queue_running_count`,
  `queue_queued_count`, `queue_max_concurrent_tasks`, `queued_ahead_count`, and `queue_position`.
- Queue overview API: `GET /api/generation-queue` returns `active_count`, `running_count`, `queued_count`, and
  `max_concurrent_tasks` for product/workflow surfaces that do not own a specific image-session task.

##### 3. Contracts

- Task statuses are `queued`, `running`, `succeeded`, `failed`, and `cancelled`; queued/running rows count toward queue
  overview metadata, while only running rows consume `generation_max_concurrent_tasks` provider capacity.
- The continuous image-session worker actor keeps an internal failsafe Dramatiq `time_limit` via
  `image_session_worker_failsafe_time_limit_minutes`. User-facing stale behavior must be driven by progress heartbeat
  idle recovery, not a hard total task timeout.
- Queue position is computed from durable queued image-session generation task rows ordered by `created_at`. Running tasks
  have no queue position and should be displayed as front-of-queue work.
- New image-session generation work must create a queued task even when all running slots are occupied. The worker claim
  count must be based on running DB rows, not an in-process slot, because API/worker processes may be replicated.
- Queue enqueue failure after task creation must mark the task `failed` (or otherwise return a stable `503`) before the
  route responds; do not strand a queued row that no worker can consume.
- Worker claim must be atomic at the database boundary: update `queued -> running` with a status condition and no-op when
  the row is terminal, already running, or already claimed by another worker.
- Manual cancel sets active tasks to `cancelled`, `failure_reason = "已取消"`, `progress_phase = "cancelled"`, and
  `is_retryable=false`. Workers must re-check durable cancellation around provider execution/save boundaries and return
  without creating new rounds when cancellation is observed.
- Worker failures must retry through application state, not Dramatiq actor retries. Keep
  `run_image_session_generation_task(max_retries=0)`, increment `attempts` on each worker claim, reset the same task to
  `queued` while the finite cap has not been reached, and leave terminal failed tasks `is_retryable=true`.
- On success, create normal `image_session_assets` and `image_session_rounds` rows. Multi-candidate generations still use
  one `generation_group_id` with one round/asset per candidate.
- Retrying a partial-success generation task must preserve `completed_candidates` and `result_generation_group_id`, then
  continue from `completed_candidates + 1`. Already saved candidates must not be regenerated.
- On provider/storage/runtime failure, mark the task `failed` with a generic safe user-facing reason such as
  `图片生成失败，请稍后重试`; never expose provider exception text, API keys, base URLs, local paths, request bodies, or
  tracebacks in API responses.
- The shared public demo workspace stays shared; do not add user/tenant ownership checks as part of this async path unless
  a separate product requirement introduces isolation.

##### 4. Validation & Error Matrix

- Missing session -> `404`, `连续生图会话不存在`.
- Invalid `generation_count`, `size`, `base_asset_id`, or selected references -> existing image-session validation errors;
  do not enqueue a task.
- Running generation cap reached by another task -> the new task is still accepted as `queued`; when consumed, the worker
  leaves it queued, records a waiting-for-capacity progress phase, and schedules delayed delivery retry.
- Redis/Dramatiq send failure after DB task creation -> mark task `failed`, then return `503`,
  `任务队列暂不可用，请稍后重试`.
- Manual retry for a non-`failed` task -> `400`, `只有失败的生成任务可以重试`.
- Manual retry for `failed` task with `is_retryable=false` -> `400`, `该生成任务不可重试`.
- Manual cancel for an active task -> task becomes `cancelled`, exits the active queue, and duplicate worker delivery
  no-ops.
- Manual cancel for a terminal succeeded/failed task -> `400`, `已结束的生成任务不能取消`.
- Redis/Dramatiq send failure after manual retry reset -> return `503`, `任务队列暂不可用，请稍后重试`, and keep the task
  failed + retryable so the user can try again.
- Duplicate Redis message for `succeeded`, `failed`, `cancelled`, or `running` task -> no provider call and no new
  round/asset rows.
- API restart with queued retryable task -> re-enqueue without changing task semantics.
- Worker restart with stale running retryable task and no completed candidates -> reset to queued and re-enqueue.
- Worker restart with stale running partial-success task -> mark failed without retry, keeping the partial
  `result_generation_group_id`.

##### 5. Good/Base/Bad Cases

- Good: user requests 3 candidates; route returns `202` quickly with a queued task, worker later creates 3 generated
  assets and 3 rounds sharing one `generation_group_id`, then marks the task `succeeded`.
- Good: browser refreshes during generation; `ImageSessionDetail.generation_tasks` still contains queued/running task
  state, so the frontend resumes polling and disables duplicate submission.
- Base: worker receives the same task ID after the task already succeeded; it exits without calling the provider.
- Bad: route calls `generate_image_session_round(...)` or an image provider directly and holds the HTTP request open.
- Bad: active generation cap checks a process-local counter or lock; replicated API processes can exceed the public demo
  cap.
- Bad: worker claim reads a queued task, mutates the ORM object, and commits without a conditional `WHERE status='queued'`;
  concurrent duplicate messages may both call the provider.

##### 6. Tests Required

- Route/API test: submit generation returns `202`, persists a queued task, exposes the task in session detail, and does not
  call the provider synchronously.
- Enqueue failure test: mocked send failure marks the task failed and returns stable `503`.
- Worker success test: executing a queued task creates expected assets/rounds and marks the task succeeded with
  `result_generation_group_id`.
- Worker failure test: provider exception marks the task failed with a generic reason and does not leak the raw exception.
- Auto retry cap test: repeated provider failure calls the provider only up to the finite application cap, then leaves the
  task failed + retryable with `attempts` exposed in detail/status responses.
- Manual retry route tests: failed retryable task resets to queued and enqueues; non-failed retry returns `400`; enqueue
  failure returns `503` and keeps the task retryable.
- Manual cancel route tests: active task becomes `cancelled`, terminal task cancellation is rejected, and duplicate worker
  delivery no-ops for cancelled tasks.
- Partial retry test: a task that saved candidate 1/2 and failed resumes at candidate 2 without duplicating candidate 1 or
  changing the existing `generation_group_id`.
- Duplicate/no-op tests: terminal and already-running task messages do not call the provider or create extra rounds.
- Recovery tests: queued tasks are re-sent; stale running recovery uses `progress_updated_at`, falls back to `started_at`,
  and fails stale partial-success tasks instead of retrying them.
- Admission test: submit accepts queued work while running capacity is full, worker capacity checks count running durable
  work, and queue metadata still reports active queued/running counts.
- Queue metadata test: queued task responses expose `queued_ahead_count` / `queue_position`, and the global overview
  counts active queued/running durable work.
- Frontend gate: update DTO types and run `just web-build` when `ImageSessionDetail` or task status rendering changes.

##### 7. Wrong vs Correct

Wrong:

```python
# HTTP request waits for provider and uses process-local admission state.
with admit_synchronous_generation(session):
    detail = generate_image_session_round(session, image_session_id, request.prompt, storage=storage)
```

Correct:

```python
# HTTP request persists durable work, sends delivery message, and returns 202.
task = create_image_session_generation_task(session, image_session_id, request)
enqueue_image_session_generation_task(task.id)
```

Wrong:

```python
task = session.get(ImageSessionGenerationTask, task_id)
if task.status == JobStatus.QUEUED:
    task.status = JobStatus.RUNNING
    session.commit()
    call_provider()
```

Correct:

```python
updated = session.execute(
    update(ImageSessionGenerationTask)
    .where(
        ImageSessionGenerationTask.id == task_id,
        ImageSessionGenerationTask.status == JobStatus.QUEUED,
    )
    .values(status=JobStatus.RUNNING, started_at=now_utc())
)
if updated.rowcount != 1:
    return
call_provider()
```

Wrong:

```python
@dramatiq.actor(max_retries=3)
def run_image_session_generation_task(task_id: str) -> None:
    execute_image_session_generation_task(task_id)
```

Correct:

```python
@dramatiq.actor(max_retries=0)
def run_image_session_generation_task(task_id: str) -> None:
    execute_image_session_generation_task(task_id)
```

## Testing Requirements

Run at least these checks for backend changes:

```bash
uv run --directory backend ruff check .
just backend-test
```

For schema changes, also run:

```bash
just backend-migrate
```

and add/update an Alembic revision under `backend/alembic/versions/`. Existing tests should continue to cover both
`Base.metadata.create_all(...)` fixtures and Alembic upgrade behavior.

---

## Forbidden Patterns

- Business logic in FastAPI route handlers beyond input adaptation, use-case calls, error mapping, and serialization.
- Provider-specific SDK calls from `presentation/` modules.
- New database columns or tables without an Alembic migration.
- Enum string changes without updating frontend types and regression tests.
- Unbounded list endpoints that load all rows for UI lists.
- Raw filesystem access for user-controlled storage paths; go through `LocalStorage.resolve(...)`.
- Broad `except Exception` that hides failures. Existing broad catches are narrow boundary cases:
  durable queue enqueue failure inside application submit helpers, config table bootstrap tolerance in `config.py`, and
  provider error classification in application/provider code.
- Committing generated storage, cache directories, `.env`, build output, or pycache files.

---

## Review Checklist

When reviewing backend changes, check:

- Does the change respect the presentation/application/domain/infrastructure layer split?
- Are Pydantic DTOs in `presentation/schemas/` and frontend types in `web/src/lib/types.ts` still aligned?
- Are database model changes mirrored by Alembic migrations and tests?
- Are enum values stored/returned as stable lowercase string values?
- Are uploads, image sizes, and storage paths still bounded?
- Are durable workflow/image-session task failures persisted and visible through their owning status/detail APIs?
- Are provider secrets hidden from API responses and logs?
- Do `uv run --directory backend ruff check .` and `just backend-test` pass?


--- FILE: .trellis\spec\frontend\component-guidelines.md ---

# Frontend Component Guidelines

> Component patterns currently used in ProductFlow.

---

## Overview

ProductFlow components are simple React function components with TypeScript props, Tailwind CSS classes, and named exports.
Route-level pages own data fetching and mutations; shared components stay mostly presentational.

Real examples:

- `web/src/components/TopNav.tsx`
- `web/src/components/StatusPill.tsx`
- Page-local components/helpers in `web/src/pages/SettingsPage.tsx` and `web/src/pages/ProductDetailPage.tsx`

---

## Component Structure

Use named function exports:

```tsx
interface TopNavProps {
  breadcrumbs?: string;
  onHome?: () => void;
  onLogout?: () => void;
}

export function TopNav({ breadcrumbs, onHome, onLogout }: TopNavProps) {
  return (...);
}
```

For very small props, inline typing is acceptable; `StatusPill` uses:

```tsx
export function StatusPill({ status }: { status: ProductWorkflowState }) {
  const config = CONFIG[status];
  return (...);
}
```

Use top-level constants for static display maps. `StatusPill.tsx` defines `CONFIG` as a `Record<ProductWorkflowState, ...>`
so every workflow status has a label and classes.

---

## Props Conventions

- Use `interface` for reusable component props (`TopNavProps`, `ConfigFieldProps`).
- Use explicit callback props for UI actions: `onHome`, `onLogout`, `onChange`, `onReset`.
- Keep props serializable/simple when possible; pages should pass already-derived values into shared components.
- Prefer optional props for optional UI affordances, and render `null` when absent. `TopNav` renders breadcrumbs and logout
  button only when props exist.

---

## Styling Patterns

Styling is Tailwind-first:

- Global CSS stays minimal in `web/src/index.css`.
- Components/pages use `className` utility strings directly.
- State-dependent styles are built with small maps/functions, e.g. `sourceClassName(...)` in `SettingsPage.tsx` and
  `CONFIG` in `StatusPill.tsx`.
- Icons come from `lucide-react` and are imported directly by each page/component.

Current visual language uses zinc/slate surfaces, thin borders, small rounded corners, and restrained hover/focus states.
Every new visible surface should include dark-mode variants when it uses explicit light backgrounds, borders, shadows, or
text colors. The app uses a root `dark` class from `PreferencesProvider`, so Tailwind `dark:*` utilities are the normal
path for component-level theme variants. Existing examples include `TopNav.tsx`, `ProductListPage.tsx`,
`ProductCreatePage.tsx`, and `SettingsPage.tsx`.

When adding image preview or canvas surfaces, keep images inspectable in both themes. Dark variants should change chrome
and empty/loading/error states, not tint or obscure product thumbnails.

---

## Internationalized UI Text

User-visible UI chrome should use the local i18n helpers instead of hard-coded one-off strings:

- Translation keys live in `web/src/lib/i18n.ts`; supported locales are `zh-CN` and `en-US`.
- Components read translations through `useI18n()` / `usePreferences()` from `web/src/lib/preferences.tsx`.
- Pure helpers that format visible labels should accept an optional translate function or locale rather than importing
  React hooks. Examples include image-size labels, gallery size labels, and ProductDetail node display helpers.
- Keep product/operator/model-authored data as source text. Do not translate product names, custom node titles, user
  template titles/descriptions returned by the backend, prompts, generated copy, filenames, provider messages, or
  `ApiError.detail`.
- Backend-owned built-in canvas template catalog text is system UI chrome. Localize it in frontend helpers by stable
  built-in template key and node/output/reference identifiers, while leaving user templates and user-renamed node titles
  as source text.
- Built-in template metadata may identify a node's original system template, but it must not override a user-renamed
  title. Only translate a persisted built-in node title when the stored title still matches the source built-in label or
  an already-localized system label.
- Default system labels should be locale-aware. If a helper suppresses legacy default titles, it must recognize defaults
  from both supported locales so older records such as `参考图 2` do not leak into the English UI.

Good:

```tsx
const { t } = useI18n();
return <button type="button" aria-label={t("nav.logout")}>{t("nav.logout")}</button>;
```

Good:

```ts
export function workflowNodeDisplayTitle(node: WorkflowNode, t = defaultT): string {
  return isSystemDefaultTitle(node.title) ? t("detail.node.referenceImage") : node.title;
}
```

Bad:

```tsx
return <button type="button">退出登录</button>;
```

Bad:

```tsx
return locale === "en-US" ? translateProductName(product.name) : product.name;
```

---

## Accessibility and Forms

Follow the patterns already present:

- Buttons include `type="button"` unless they submit a form. See `TopNav.tsx`, `ProductListPage.tsx`, and `SettingsPage.tsx`.
- Form submit handlers call `event.preventDefault()` and trigger a mutation, e.g. `ProductCreatePage.tsx` and
  `LoginPage.tsx`.
- Inputs in settings use `label htmlFor={item.key}` and matching `id={item.key}` in `ConfigField`.
- Image upload drop zones use the shared `ImageDropZone` component. Pages own the upload mutation and pass an `onFiles`
  callback; the shared component only handles click, keyboard, drag/drop, `accept`, `multiple`, and disabled/focus states.
  Use the default single-file mode for product/workflow images and `multiple` for session reference images.
- Loading states use `Loader2` with `animate-spin`; disabled buttons use `disabled` and reduced opacity.
- Errors are rendered near the relevant action as text or red alert blocks.

When adding new forms, keep keyboard/focus behavior at least as strong as these examples.

---

## Data Fetching Boundary

Shared components should not call the API directly today. API calls live in pages through TanStack Query and the central
`api` object:

- `ProductListPage.tsx` calls `useQuery({ queryKey: ['products'], queryFn: api.listProducts })`.
- `SettingsPage.tsx` calls `api.getConfig` / `api.updateConfig` from page-level mutations.
- `TopNav.tsx` receives `onLogout` instead of knowing about sessions or `api.destroySession`.

If a component starts needing API calls, consider whether it is actually a route/page-level component.

## Feature Page Extraction Boundary

Large route pages should keep query/mutation ownership, URL parameters, selection reconciliation, and submit handlers in
the route component. Move repeated or bulky display surfaces into page-local feature components under the route's feature
folder, for example `web/src/pages/image-chat/`.

Good extraction targets:

- Main preview/canvas surfaces that receive already-derived rounds, task placeholders, and callback props.
- History strips, session lists, reference panels, and other repeated UI regions that can stay presentational.
- Pure display helpers for labels, status classes, and sizing text.

Keep extracted components API-free. Pass action callbacks such as `onSelectRound`, `onDeleteSession`, `onRetry`, and
`onCancel` from the page. If extraction starts requiring TanStack Query hooks or direct `api.*` mutations inside the
component, promote the design to a dedicated controller/hook refactor with focused regression tests around selection and
submission behavior.

When optimizing image-heavy pages, preserve the resource contract while extracting UI: visible preview surfaces should use
preview-sized assets, explicit download actions should use download URLs, and route-level lazy loading should stay in
`App.tsx` so unrelated pages do not inflate the initial route load.

---

## Scenario: Shared image size picker contract

### 1. Scope / Trigger

- Trigger: editing continuous image chat size controls, workflow `image_generation` inspector controls, runtime
  built-in preset display behavior, or frontend helpers that parse `WIDTHxHEIGHT`.
- Goal: keep the visual size picker, custom dimensions, and backend image-size contract aligned across every image
  generation surface.

### 2. Signatures

- Shared component: `ImageSizePicker({ value, onChange, presets, disabled?, maxDimension? })`.
- Shared helpers live under `web/src/lib/imageSizes.ts`.
- Runtime max dimension comes from `api.getRuntimeConfig()` and is passed into `buildImageSizeOptions(maxDimension)` and
  `ImageSizePicker({ maxDimension })`.
- Page/API boundary values remain normalized `WIDTHxHEIGHT` strings, for example `1024x1024` or `3840x2160`.
- Custom dimensions are calibrated to the nearest provider-safe 16-pixel multiple before being emitted, for example
  `1500x800` becomes `1504x800`.

### 3. Contracts

- Continuous image chat and workflow image-generation inspector must use the same shared picker instead of duplicating
  separate button/input implementations.
- Continuous image chat and workflow image-generation inspector must use the same shared `ImageToolControls` component for
  provider image-tool parameters. Keep compaction/normalization in shared helpers under `web/src/lib/`, not inside one
  page, so the workbench node and image chat submit the same payload shape.
- `ImageToolControls` visibility and `compactImageToolOptions(...)` submission filtering must both use
  `runtime-config.image_tool_allowed_fields`; do not show or submit provider fields that the active provider profile has
  not enabled.
- Pages pass built-in preset options into the component; `ImageSizePicker` must not call the API.
- Runtime config filters built-in size preset buttons by maximum single edge. It must not provide an arbitrary backend
  allowlist; a custom value may be valid even when it is not present in the preset list.
- The picker should preserve and round-trip unknown valid values by switching to custom width/height mode instead of
  resetting to the first preset.
- Preset labels should include the human tier/aspect and the exact pixel string so users know what will be submitted.

### 4. Validation & Error Matrix

- Invalid local text such as missing width/height -> keep the custom inputs visible and avoid emitting a malformed size.
- Existing value not found in presets -> show it as custom dimensions when parseable.
- Custom inputs with uppercase separators or oversized values -> normalize/calibrate in the shared helper before emitting.
- Custom inputs with either side not divisible by 16 -> normalize/calibrate in the shared helper before emitting.
- Backend rejection still remains authoritative; frontend validation only improves UX.

### 5. Good/Base/Bad Cases

- Good: `3840x2160` from workflow node config opens the inspector with custom dimensions `3840` and `2160`, then submits
  `3840x2160` unchanged.
- Base: `1024x1024`, `2048x2048`, and `3840x3840` appear as preset buttons when present in the derived presets.
- Bad: `ImageChatPage` accepts custom dimensions while `InspectorPanel` still exposes a raw text field.
- Bad: `ImageChatPage` supports provider quality/format/fidelity fields while `InspectorPanel` has a separate partial
  implementation or sends raw unnormalized `tool_options`.
- Bad: product workflow inspector and image-session generation rebuild separate size/tool/count panels instead of sharing
  `ImageGenerationSettingsPanel` where the behavior is the same.
- Bad: one image generation entry uses a combined settings page while another uses `生成设置 / 高级`; product workflow
  image nodes and image-session generation should both use `ImageGenerationSettingsTabs` to keep common
  size/count/prompt controls separate from advanced provider tool options.
- Bad: a custom value is auto-reset because it is not one of the built-in preset buttons.

### 6. Tests Required

- Shared helper tests should cover default presets, custom labels, calibration, and invalid strings.
- When picker state behavior changes, add or update component-level tests before relying on manual visual review.
- `just web-build`, `pnpm --dir web lint`, and `pnpm --dir web test:run` remain required for frontend changes.

### 7. Wrong vs Correct

#### Wrong

```tsx
<input value={draft.size} onChange={(event) => onDraftChange({ ...draft, size: event.target.value })} />
```

This creates a second workflow-only size UI and bypasses the shared custom/preset behavior.

#### Correct

```tsx
<ImageSizePicker
  value={draft.size}
  onChange={(size) => onDraftChange({ ...draft, size })}
  presets={imageSizePresets}
/>
```

Pages provide data and mutations; the shared picker owns only presentational size selection state.

---

## TopNav Global Navigation Contract

`web/src/components/TopNav.tsx` is the shared authenticated product navigation bar, not just a page title strip.

- Every primary authenticated page should render `TopNav` so the same frequent entries are always available:
  `商品/工作台`, `文/图生图`, `画廊`, `帮助`, and `配置`.
- The entries link to `/products`, `/image-chat`, `/gallery`, `/help`, and `/settings`; keep route declarations centralized in
  `web/src/App.tsx`.
- Page components may still pass `breadcrumbs`, `onHome`, and `onLogout`, but should not duplicate these global nav links
  in a separate header unless that page needs an additional hero call-to-action.
- `TopNav` may use React Router primitives such as `NavLink` / `useLocation`, but must not fetch session or settings data
  directly. Session logout remains a page-owned mutation passed in through `onLogout`.
- `TopNav` owns the compact global locale and theme controls. Do not add separate per-page language/theme toggles unless a
  page-specific workflow requires an additional local affordance.

Wrong:

```tsx
<TopNav breadcrumbs="配置" />
<button onClick={() => navigate("/settings")}>配置</button>
```

Correct:

```tsx
<TopNav breadcrumbs="配置" onHome={() => navigate("/products")} onLogout={() => logoutMutation.mutate()} />
```

The shared nav itself exposes the settings/image-chat/product/gallery links; pages only add page-specific actions.

## Scenario: Global gallery display page

### 1. Scope / Trigger

- Trigger: editing `GalleryPage`, gallery route registration, gallery API DTO consumption, or continuous image-chat save
  to gallery affordances.
- The gallery is a visual browsing surface for generated images, not a management dashboard.

### 2. Signatures

- Route: `/gallery` in `web/src/App.tsx`.
- API client:
  - `api.listGalleryEntries()`.
  - `api.saveGalleryEntry(imageSessionAssetId)`.
- Query key: `['gallery']`.
- DTO: `GalleryEntry` in `web/src/lib/types.ts`.

### 3. Contracts

- `GalleryPage` lists global gallery entries and uses `api.toApiUrl(...)` for `image.thumbnail_url`, `image.preview_url`,
  and `image.download_url`.
- Continuous image chat saves only the selected generated candidate to the gallery; existing save-to-product behavior must
  remain separate.
- Successful save invalidates `['gallery']` so the global page refreshes without a hard reload.
- The page should emphasize image-led browsing: a strong selected/hero image, a responsive visual grid, and compact prompt
  and metadata context. Do not turn it into product filters, bulk tools, or a table-first admin page.
- Gallery feed cards should preserve the full generated image instead of cropping it. Derive card aspect from
  `actual_size` first and `size` second, clamp extreme ratios, and use a stable id/index-based score for featured cards
  so the layout feels varied without changing on every render.
- If the feed uses CSS Grid masonry behavior with `auto-rows-*` and `gridRowEnd: span N`, the span calculation must include
  both the row unit and the grid gap. A span that ignores `gap-*` will produce oversized dark bars because CSS Grid adds
  every inter-row gap inside the spanned area.
- Desktop masonry row spans must be calculated from the measured grid width, not a fixed container width. Account for
  column gaps when deriving tile width: subtract `gap * (columns - 1)` before dividing into columns, then add the gaps
  inside the tile span back. Keep `auto-rows-*` and `gridRowEnd` scoped to the desktop grid; mobile and tablet layouts
  should use natural `aspect-ratio` sizing.

### 4. Validation & Error Matrix

- Empty gallery -> styled empty state, no broken image placeholders.
- API load failure -> visible page-local error state.
- Missing selected ID after refresh/list change -> fall back to the newest available entry.
- Save-to-gallery API error from image chat -> show page-local mutation error near existing image-chat feedback.

### 5. Good/Base/Bad Cases

- Good: the selected generated candidate appears in the gallery after saving and refreshes via `['gallery']`.
- Base: if a gallery image has no product reference, show it as a global/standalone item without blocking preview.
- Bad: raw `fetch('/api/gallery')` from a page.
- Bad: adding gallery grouping/filtering/bulk controls under this display-only contract.

### 6. Tests Required

- Pure helper tests for selected-entry fallback, size/actual-size labels, aspect-ratio parsing/clamping, stable featured
  tile placement, masonry row-span behavior, gap-aware tile width, and measured grid width changes.
- Frontend build must type-check `GalleryEntry` DTOs and API methods.
- When save behavior changes, run image-chat related helper tests and `pnpm --dir web test:run`.

### 7. Wrong vs Correct

#### Wrong

```tsx
fetch('/api/gallery')
```

#### Correct

```tsx
useQuery({ queryKey: ['gallery'], queryFn: api.listGalleryEntries })
```

#### Wrong

```tsx
const rowSpan = Math.ceil(tileHeight / 8)
```

This ignores the `gap-4` space that CSS Grid adds between every spanned row.

#### Correct

```tsx
const rowSpan = Math.ceil((tileHeight + gridGapPx) / (rowUnitPx + gridGapPx))
```

#### Wrong

```tsx
const tileWidth = (1280 * columnSpan) / 12
```

This ignores the 11 grid gaps in a 12-column desktop grid.

#### Correct

```tsx
const columnWidth = (gridWidth - gridGapPx * (columns - 1)) / columns
const tileWidth = columnWidth * columnSpan + gridGapPx * (columnSpan - 1)
```

---

## Common Mistakes to Avoid

- Putting server mutations inside shared presentational components.
- Creating untyped props or using `any` for component inputs.
- Omitting `type="button"` on non-submit buttons inside forms.
- Hardcoding API URLs in components; use `api.toApiUrl(...)` for backend-provided relative image URLs.
- Duplicating status label/style maps instead of reusing `StatusPill` or a local typed `Record`.


--- FILE: .trellis\spec\frontend\directory-structure.md ---

# Frontend Directory Structure

> Actual React/Vite organization for ProductFlow.

---

## Overview

The frontend is a React 19 + Vite + TypeScript app under `web/src/`. It uses React Router for pages, TanStack Query for
server state, Tailwind CSS v4 utility classes for styling, and a small central API/type layer under `web/src/lib/`.

Key files:

- `web/src/main.tsx` mounts the app with `React.StrictMode`.
- `web/src/App.tsx` creates the `QueryClient`, wraps `BrowserRouter`, and declares routes.
- `web/src/index.css` imports Tailwind and defines minimal global theme/base styles.
- `web/src/pages/` contains route-level pages.
- `web/src/components/` contains shared presentational components.
- `web/src/lib/` contains API calls, shared TypeScript DTOs, and formatting helpers.

---

## Directory Layout

```text
web/
├── package.json                     # scripts: dev, build, lint, test, test:run, preview
├── tsconfig.json
├── tsconfig.app.json                # strict TypeScript for src/
├── tsconfig.node.json               # Vite config typing
├── vite.config.ts                   # React/Tailwind plugins, API proxy, ports/hosts
└── src/
    ├── main.tsx                     # ReactDOM entrypoint
    ├── App.tsx                      # QueryClientProvider, BrowserRouter, auth-gated routes
    ├── index.css                    # Tailwind import and global base CSS
    ├── components/
    │   ├── StatusPill.tsx           # shared status badge
    │   └── TopNav.tsx               # shared top navigation
    ├── lib/
    │   ├── api.ts                   # fetch wrapper, ApiError, typed API methods
    │   ├── format.ts                # date/price/job formatting helpers
    │   └── types.ts                 # frontend DTOs mirroring backend responses
    └── pages/
        ├── LoginPage.tsx
        ├── ProductListPage.tsx
        ├── ProductCreatePage.tsx
        ├── ProductDetailPage.tsx
        ├── product-detail/              # page-local product workflow constants/types/utils/components
        ├── ImageChatPage.tsx
        └── SettingsPage.tsx
```

There is no `hooks/` directory and no global state store today. Stateful logic currently lives in pages unless it is a
shared API/type/format helper.

---

## Route Organization

Routes are centralized in `web/src/App.tsx` inside `AppRoutes()`:

- `/login` -> `LoginPage`
- `/products` -> `ProductListPage`
- `/products/new` -> `ProductCreatePage`
- `/products/:productId` -> `ProductDetailPage`
- `/image-chat` -> standalone `ImageChatPage`
- `/products/:productId/image-chat` -> product-scoped `ImageChatPage`
- `/help` -> `HelpPage`
- `/settings` -> `SettingsPage`

Auth gating is also in `AppRoutes()`: it loads `api.getSessionState` with query key `['session']` and redirects
unauthenticated users to `/login`.

---

## Page vs Component Placement

Use `web/src/pages/` for route-level modules that own data fetching, navigation, mutations, and complex local UI state.
Current examples:

- `ProductListPage.tsx` owns product list fetching, logout mutation, and navigation to settings/image chat/new product.
- `ProductDetailPage.tsx` owns product detail/history queries, workflow status polling, copy editing state, and
  workbench actions.
- `ImageChatPage.tsx` owns session selection, auto-create behavior, config-derived image size options, and generation.
- `SettingsPage.tsx` owns config fetching, grouped drafts, secret touched state, save/reset mutations.

Use `web/src/components/` for reusable presentational components with small props and no route ownership:

- `TopNav.tsx`
- `StatusPill.tsx`
- `ImageGenerationSettingsTabs.tsx`, `ImageGenerationSettingsPanel.tsx`, `ImageSizePicker.tsx`, and
  `ImageToolControls.tsx` for the shared image generation settings shell and controls used by both the image-session page
  and product workflow inspector.

If a component is only used inside one page and tightly coupled to that page's state, keep it either in the page file or
in a page-local directory. `ProductDetailPage.tsx` uses `web/src/pages/product-detail/` for workflow canvas constants,
draft/config utilities, image mapping helpers, and page-local components; do not move those to global `components/`
until another page actually reuses them.

---

## Lib Organization

- `web/src/lib/api.ts` is the only place that should know fetch details, credentials, `VITE_API_BASE_URL`, and API paths.
- `web/src/lib/types.ts` contains DTO interfaces and string union types mirroring backend Pydantic responses and enums.
- `web/src/lib/format.ts` contains pure formatting helpers such as `formatDateTime`, `formatShortDate`, and
  `formatPrice`.
- `web/src/lib/image-downloads.ts` contains reusable image URL, filename sanitization, timestamp suffix, and extension
  helpers. Page-specific mapping from product/poster records to downloadable images should stay page-local.

Do not scatter raw `fetch(...)` calls or duplicate DTO interfaces inside pages.

---

## Naming Conventions

- Page and component files use `PascalCase.tsx`: `ProductListPage.tsx`, `TopNav.tsx`.
- Exported React components use named exports: `export function ProductListPage() { ... }`.
- Utility files use lower camel-ish names: `api.ts`, `format.ts`, `types.ts`.
- Helper functions use `camelCase`, for example `getWorkingCopy`, `getSourceImageUrl`, `draftsFromConfig`.
- API DTO fields intentionally preserve backend `snake_case` names, for example `workflow_state`, `copy_set_id`,
  and `reset_keys` in `web/src/lib/types.ts`; image size presets live in `web/src/lib/imageSizes.ts`, not runtime config.

---

## Avoid

- Adding route declarations outside `App.tsx` without a deliberate router refactor.
- Creating a global state store for server data that already lives in TanStack Query.
- Duplicating API URL construction outside `api.toApiUrl(...)`.
- Moving page-specific subcomponents into `components/` before they are reused.
- Renaming backend DTO fields to camelCase in frontend types unless the backend response changes too.


--- FILE: .trellis\spec\frontend\hook-guidelines.md ---

# Frontend Hook Guidelines

> How React hooks and TanStack Query are currently used in ProductFlow.

---

## Overview

There are no custom hook modules in `web/src/` today. Hooks are used directly inside page components and `AppRoutes()`.
Server state uses TanStack Query; local UI/form state uses React's built-in hooks.

Real hook-heavy files:

- `web/src/App.tsx`
- `web/src/pages/ProductListPage.tsx`
- `web/src/pages/ProductDetailPage.tsx`
- `web/src/pages/ImageChatPage.tsx`
- `web/src/pages/SettingsPage.tsx`

---

## Server State Hooks

Use `useQuery` for reads and `useMutation` for writes. Query keys are small arrays of stable values:

```tsx
const productQuery = useQuery({
  queryKey: ["product", productId],
  queryFn: () => api.getProduct(productId),
  enabled: Boolean(productId),
});
```

Examples:

- `App.tsx` uses `['session']` for `api.getSessionState` with `retry: false`.
- `ProductListPage.tsx` uses `['products']` for `api.listProducts`.
- `ProductDetailPage.tsx` uses `['product', productId]`, `['product-history', productId]`,
  `['product-workflow', productId]`, `['product-workflow-status', productId]`, and `['runtime-config']`.
- `ImageChatPage.tsx` uses `['image-sessions', productId ?? 'standalone']`, `['image-session', selectedSessionId]`,
  `['image-session-status', selectedSessionId]`, `['config']`, and product queries.
- `SettingsPage.tsx` uses `['config']` for runtime settings.

Use `enabled` when an ID is required. Do not call an API with an empty ID just because a route param has not loaded.

---

## Mutations and Cache Updates

Use `useMutation` for writes and update/invalidate TanStack Query caches in `onSuccess`:

- Logout mutations invalidate `['session']` and navigate to `/login`.
- Product/detail mutations invalidate `['product', productId]`, `['product-history', productId]`, and/or `['products']`.
- Image session mutations often call `queryClient.setQueryData(['image-session', id], updated)` and invalidate the session
  list.
- Settings save/reset mutations update `['config']` with `queryClient.setQueryData(...)`.

Keep cache keys consistent with the page that reads them. If a mutation changes list and detail data, invalidate both.

---

## Polling Pattern

Long-running product workflow and continuous image-session tasks are polled through their owning status/detail queries.
Polling must stop when no durable run/task is still `queued` or `running`:

```tsx
refetchInterval: (query) => {
  const data = query.state.data as ProductWorkflowStatus | undefined;
  if (!data || hasActiveWorkflow(data)) {
    return 1000;
  }
  return false;
}
```

Keep workflow polling status-specific: use the lightweight workflow status DTO and derive active state from queued/running
nodes or running workflow runs.

## Scenario: ImageChat active-task lightweight status polling

### 1. Scope / Trigger

- Trigger: changing `ImageChatPage` generation polling, image-session API DTOs, or continuous image task visibility.
- Goal: active task status updates should be lightweight while full generated history remains loaded through the detail
  query.

### 2. Signatures

- Full detail query key: `['image-session', selectedSessionId]` -> `api.getImageSession(sessionId)`.
- Lightweight status query key: `['image-session-status', selectedSessionId]` ->
  `api.getImageSessionStatus(sessionId)`.
- Backend status fields used by the page: `rounds_count`, `latest_round_id`, `has_active_generation_task`,
  `generation_tasks`, `updated_at`, and `title`.

### 3. Contracts

- Do not put `refetchInterval` on the full `['image-session', selectedSessionId]` query for active generation.
- Enable the status query only when the cached full detail has an active queued/running generation task.
- Each status response should merge `title`, `updated_at`, and `generation_tasks` into the cached full detail so task
  cards, queue position, failure reason, provider notes, and history placeholders stay current.
- Active `generation_tasks` must not be used as a session-wide submit lock. The submit button may be disabled while the
  current mutation is pending, but queued/running tasks in the same session still allow a changed prompt, size, branch
  base image, reference selection, generation count, or tool-options payload to submit immediately.
- Accidental duplicate prevention for ImageChat is a short local guard keyed by prompt, size, branch base image, selected
  references, generation count, and normalized tool options. It blocks only very-short-window identical payload repeats.
- When status shows a new round count/latest round or a task changes from active to terminal, invalidate/refetch the full
  detail query once so generated candidates/history appear.
- Keep write mutations authoritative: create/update/upload/delete/generate handlers may still set full detail cache from
  mutation responses and invalidate the session list.
- Keep ImageChat selection reconciliation out of long page effects. Selection state that depends on fetched rounds,
  task-derived placeholders, selected generated assets, branch base images, reference uploads, and pending round counts
  belongs in a page-local pure helper such as `image-chat/branching.ts::reconcileImageSessionSelection(...)`; the page
  effect should only apply the helper result and set user-facing success/error messages.

### 4. Validation & Error Matrix

- No selected session -> status query disabled.
- Full detail has no active generation task -> status query disabled; do not poll.
- Status still active -> merge task status only, no full detail refetch.
- Status terminal or new latest round -> invalidate `['image-session', selectedSessionId]` and the session list key.
- Status API error -> normal React Query error state; do not clear existing full detail cache only because a status poll
  failed.
- Selected task placeholder no longer exists because the generated round arrived -> select the matching generated round
  when possible; otherwise fall back to the latest generated asset.
- Selected generated asset or branch base no longer exists -> clear or fall back through the selection reconciliation
  helper, not through ad hoc page-level branches.
- Uploaded/deleted reference images change the available id set -> prune selected reference ids through the shared helper
  and preserve valid order.

### 5. Good/Base/Bad Cases

- Good: active task updates the visible queue position every 1500ms without refetching every historical round and asset.
- Good: one queued/running task is visible in the history tree while a different payload can be submitted immediately.
- Base: a task failure appears in the task card, then full detail is refetched once.
- Bad: status polling replaces the detail cache with a partial object missing `assets` or `rounds`.
- Bad: broadening this ImageChat status query to ProductDetail workflow polling without a separate workflow DTO.
- Bad: disabling ImageChat submission solely because `has_active_generation_task` is true.

### 6. Tests Required

- Pure helper tests for active-task detection.
- Pure helper tests for merging status into cached detail without replacing `assets` or `rounds`.
- Pure helper tests for deciding when status requires a full detail refresh.
- Pure helper tests for task-derived history placeholders/tree structure and the short duplicate-submit guard.
- Pure helper tests for ImageChat selection reconciliation: placeholder-to-round replacement, selected asset fallback,
  branch base cleanup, reference selection pruning, and pending generation completion.
- Run `pnpm --dir web lint`, `pnpm --dir web test:run`, and `just web-build`.

### 7. Wrong vs Correct

Wrong:

```tsx
useQuery({ queryKey: ["image-session", id], refetchInterval: 1500 });
```

Correct:

```tsx
useQuery({ queryKey: ["image-session-status", id], refetchInterval: 1500 });
```

## Scenario: ProductDetail active-workflow lightweight status polling

### 1. Scope / Trigger

- Trigger: changing `ProductDetailPage` workflow polling, product-workflow API DTOs, or active workflow status visibility.
- Goal: active workflow polling should be lightweight while full DAG structure and artifacts remain loaded through the
  workflow detail query.

### 2. Signatures

- Full workflow query key: `['product-workflow', productId]` -> `api.getProductWorkflow(productId)`.
- Lightweight status query key: `['product-workflow-status', productId]` ->
  `api.getProductWorkflowStatus(productId)`.
- Backend status fields used by the page: `has_active_workflow`, node `status` / `failure_reason` / `last_run_at`,
  run `status` / `failure_reason` / `finished_at`, node-run status fields, and workflow `updated_at`.

### 3. Contracts

- Do not put active-run `refetchInterval` on the full `['product-workflow', productId]` query.
- Enable the status query only when the cached full workflow has a running run or queued/running node.
- Each status response may merge only workflow/node/run status metadata into the cached full workflow. It must not replace
  `edges`, node `config_json`, node `output_json`, or node-run artifact fields such as `output_json`, `copy_set_id`,
  `poster_variant_id`, and `image_session_asset_id`.
- When status shows an active workflow becoming terminal, invalidate/refetch the full workflow once and let the existing
  active-to-inactive path refresh `['product', productId]`, `['product-history', productId]`, and `['products']`.
- Keep write mutations authoritative: node/edge/update/run handlers may still set the full workflow cache from mutation
  responses and refresh product artifact queries.

### 4. Validation & Error Matrix

- No product id -> status query disabled.
- Full workflow has no active run/node -> status query disabled; do not poll.
- Status still active -> merge status metadata only, no full workflow refetch.
- Status terminal -> merge terminal status, invalidate `['product-workflow', productId]`, and refresh artifact-bearing
  product queries through the workflow active-to-inactive transition.
- Status API error -> normal React Query error state; do not clear existing full workflow cache only because a status poll
  failed.

### 5. Good/Base/Bad Cases

- Good: active workflow updates node/run status every 1200ms without refetching all edges, node config/output JSON, and
  artifact-bearing run payloads.
- Base: a failed node shows the failure reason promptly, then full workflow and product artifacts refetch once.
- Bad: status polling replaces the detail cache with a partial object missing `edges` or node `config_json`.
- Bad: workflow terminal status refreshes only `['product-workflow', productId]` and leaves product detail/history/list
  artifact surfaces stale.

### 6. Tests Required

- Pure helper tests for status active detection.
- Pure helper tests for merging status into cached workflow without replacing structure or artifact fields.
- Pure helper tests for deciding when status requires a full workflow refresh.
- Run `pnpm --dir web lint`, `pnpm --dir web test:run`, and `just web-build`.

### 7. Wrong vs Correct

Wrong:

```tsx
useQuery({ queryKey: ["product-workflow", productId], refetchInterval: 1200 });
```

Correct:

```tsx
useQuery({ queryKey: ["product-workflow-status", productId], refetchInterval: 1200 });
```

---

## Local State and Derived State

Use `useState` for local form/UI state:

- `ProductCreatePage.tsx`: product form fields, selected file(s), error text.
- `ProductDetailPage.tsx`: copy editing state, selected workbench/canvas state, error text.
- `ImageChatPage.tsx`: selected session/asset IDs, draft prompt, size, rename mode, target product, messages.
- `SettingsPage.tsx`: draft config values, touched secret keys, resetting key, saved/error messages.

Use `useMemo` for derived values that depend on fetched data or local state:

- `ProductDetailPage.tsx` derives `workingCopy`.
- `ImageChatPage.tsx` derives allowed size options, selected round, source image, and reference images.
- `SettingsPage.tsx` groups config items by category.

Use `useEffect` for synchronization side effects, not for deriving values that can be calculated during render. Current
examples include auth redirects in `LoginPage.tsx`, workflow status completion invalidation in
`ProductDetailPage.tsx`, and draft reset from fetched config in `SettingsPage.tsx`.

---

## Custom Hooks

Custom hooks should stay rare and intentional. For cross-page/shared behavior, extract a hook only when at least two
pages/components need the same behavior. Follow React naming rules (`useSomething`) and keep API calls typed through
`web/src/lib/api.ts`.

### Page-local controller hooks

An oversized route page may extract a page-local controller hook or controller component under that page's local directory
even before there is cross-page reuse, when the extraction isolates a cohesive browser interaction boundary and materially
reduces route complexity. For ProductDetail-style workbench interactions, keep the boundary page-local (for example
`web/src/pages/product-detail/WorkflowCanvas.tsx`, or a page-local hook when no component boundary is involved) and pass
API/cache work in as callbacks instead of hiding TanStack Query mutations inside the controller.

Correct:

```tsx
<WorkflowCanvas
  workflow={workflow}
  onNodePositionCommit={(input) => updateNodePositionMutation.mutate(input)}
  onConnectionCreate={(input) => createEdgeMutation.mutate(input)}
/>
```

Wrong:

```tsx
function useWorkflowCanvas(productId: string) {
  return useMutation({ mutationFn: () => api.createWorkflowEdge(productId, input) });
}
```

Likely future extraction candidates, if duplication grows:

- session/logout behavior shared by `ProductListPage.tsx`, `ImageChatPage.tsx`, and `SettingsPage.tsx`.
- workflow status polling behavior from `ProductDetailPage.tsx`.
- config draft handling from `SettingsPage.tsx`.

Do not create a `hooks/` directory for one-off logic that is still page-specific.

---

## Avoid

- Calling hooks conditionally or after early returns. Keep hooks at the top of component functions.
- Using `useEffect` to mirror fetched data into local state unless the user can edit that local draft (`SettingsPage.tsx`
  is an example where mirroring is intentional).
- Forgetting `enabled` for queries that require route params or selected IDs.
- Invalidating only detail cache when a mutation also affects list summaries.
- Adding custom hooks that hide query keys or API behavior before there is real reuse.


--- FILE: .trellis\spec\frontend\index.md ---

# Frontend Development Guidelines

> Project-specific frontend conventions for ProductFlow.

---

## Overview

These files document the frontend conventions that are actually present in this repository. They are based on `AGENTS.md`,
`web/package.json`, `web/tsconfig*.json`, `web/vite.config.ts`, `justfile`, and the current code under `web/src/`.

---

## Guidelines Index

| Guide | Description | Status |
|-------|-------------|--------|
| [Directory Structure](./directory-structure.md) | React/Vite app layout, pages, components, lib boundaries | Filled |
| [Component Guidelines](./component-guidelines.md) | Function components, props, Tailwind styling, forms/accessibility | Filled |
| [Hook Guidelines](./hook-guidelines.md) | React Query, mutations/cache updates, polling, local hooks | Filled |
| [State Management](./state-management.md) | Server/local/URL state split and query key conventions | Filled |
| [Quality Guidelines](./quality-guidelines.md) | TypeScript build gate, API centralization, UI review checklist | Filled |
| [Type Safety](./type-safety.md) | Strict TS, DTO mirroring, ApiError, runtime validation reality | Filled |
| [Product Workbench DAG](./product-workbench-dag.md) | Product detail DAG workbench UI, API DTOs, and cache contracts | Filled |

---

## Pre-Development Checklist

Before frontend changes, read:

1. `./directory-structure.md`
2. `./quality-guidelines.md`
3. The topic-specific file for the area you are changing:
   - components/forms: `./component-guidelines.md`
   - hooks/data fetching: `./hook-guidelines.md`
   - state/cache behavior: `./state-management.md`
   - API DTOs/types: `./type-safety.md`
   - product workbench DAG: `./product-workbench-dag.md`

If a frontend change consumes or changes backend API contracts, also read `../backend/error-handling.md`,
`../backend/database-guidelines.md`, or `../backend/directory-structure.md` as relevant.

---

**Language**: All documentation in this directory is written in English.


--- FILE: .trellis\spec\frontend\product-workbench-dag.md ---

# Frontend Product Workbench DAG Guidelines

> Frontend contracts for the product detail node workbench.

## Scenario: Product detail DAG workbench UI

### 1. Scope / Trigger

- Trigger: any ProductDetail page change that renders, edits, runs, or consumes product workflow DAG data.
- This feature spans API DTOs, TanStack Query cache keys, local selected-node state, and artifact previews.

### 2. Signatures

- API methods live only in `web/src/lib/api.ts`:
  - `getProductWorkflow(productId)`
  - `createWorkflowNode(productId, input)`
  - `updateWorkflowNode(nodeId, input)`
  - `updateWorkflowNodeCopy(nodeId, input)`
  - `uploadWorkflowNodeImage(nodeId, input)`
  - `bindWorkflowNodeImage(nodeId, { source_asset_id? , poster_variant_id? })`
  - `createWorkflowEdge(productId, input)`
  - `deleteWorkflowEdge(edgeId)`
  - `runProductWorkflow(productId, input?)`
- DTOs live only in `web/src/lib/types.ts`: `ProductWorkflow`, `WorkflowNode`, `WorkflowEdge`, `WorkflowRun`,
  `WorkflowNodeRun`.
- Query key: `['product-workflow', productId]`.

### 3. Contracts

- Frontend keeps backend `snake_case` fields (`node_type`, `config_json`, `output_json`, `start_node_id`).
- Supported user-facing node types are `product_context`, `reference_image`, `copy_generation`, and `image_generation`.
- Product detail/workbench is canvas-first: product context, reference slots, copy, and image generation are graph nodes,
  not permanent fixed columns.
- ProductDetail workbench uses ReactFlow / `@xyflow/react` as the frontend graph renderer and pointer interaction layer.
  The backend `ProductWorkflow` payload remains the authority for persisted nodes and edges.
- The main workbench grid background should be rendered with ReactFlow `Background` so the visual canvas grid follows the
  ReactFlow viewport. Avoid page-level CSS grid overlays for the main workflow canvas.
- Viewport controls should use ReactFlow `Controls` / `ControlButton` instead of a page-level custom button group. Keep
  ReactFlow-native zoom in, zoom out, and fit-view behavior where possible; reserve ProductFlow-owned control buttons for
  business-specific actions such as reset-to-100% display and fitting the selected node group. Localize built-in control
  and minimap aria labels through ReactFlow `ariaLabelConfig`.
- Large ProductDetail canvases should use ReactFlow `MiniMap` for desktop overview. Mobile should either hide the minimap
  or expose it through an explicit mode/entry so it does not cover browse/edit/select touch flows.
- ReactFlow's internal node/edge store owns live drag coordinates during active pointer movement. ProductDetail and
  WorkflowCanvas may resync nodes/edges from backend workflow data, selection state, and optimistic drop positions through
  ReactFlow instance methods, but they must not rebuild the full node array in React state on every drag-frame position
  event.
- Canvas interaction is pointer-first: nodes move through ReactFlow drag handling and persist via
  `updateWorkflowNode(...)` on drag stop. ReactFlow node positions map directly to workflow `position_x` /
  `position_y`.
- Active node drag must visually follow the pointer, not merely the eventual persisted coordinate. Do not round active
  drag coordinates before rendering; round only the final persisted `position_x` / `position_y` values on release.
- The main workflow canvas is unbounded in both viewport panning and node coordinates. Do not apply frontend-only minimum
  `position_x` / `position_y` clamps; negative workflow coordinates are valid when the user pans or drags there. New
  nodes and templates should still be inserted at the current viewport center so they remain visible at creation time.
- Empty canvas/background areas may be dragged to pan the ReactFlow viewport. Guard node actions, edge handles/buttons,
  zoom controls, uploads, and panel resize handles so those controls do not start background panning.
- Mobile canvas interaction uses an explicit `CanvasInteractionMode`:
  `browse`, `edit`, and `select`. Mobile defaults to `browse`; desktop passes `edit` so existing mouse drag and Shift
  selection behavior stay available. In `browse`, one-finger empty-canvas drag pans the viewport and tapping a node selects
  it without starting a node drag. In `edit`, touch/pen users may drag nodes and create connections. In `select`, tapping
  nodes toggles multi-select without keyboard modifiers, one-finger blank-canvas drag still pans the viewport, and tapping
  blank canvas exits the temporary selection mode. Mobile select mode should not enable ReactFlow's selection rectangle;
  small touch screens use tap-toggle selection instead of lasso selection.
- Touch and pen canvas edits must be gated by the active mobile interaction mode. Mouse pointers keep the desktop behavior.
  ReactFlow may start visual mouse node drag immediately so the node follows the pointer without a dead zone. Keep a small
  non-zero screen-pixel guard for mouse click suppression and persisted position commits so click jitter does not persist
  accidental node movement. Touch/pen can keep a larger non-zero visual and commit threshold so tap/select sequences stay
  stable.
- Mobile pinch zoom uses ReactFlow viewport zoom, clamps through the shared workflow zoom bounds, and should preserve the
  gesture center. Pinch has higher gesture priority than pan, selection box, node drag, and connection drag.
- ProductDetail supports canvas node multi-select through local UI state. Keep `selectedNodeId` as the primary node that
  drives the Details sidebar, draft saving, reference-image fill target, and node-level run/delete/cancel/upload actions.
  Keep `selectedNodeIds` as the selected node group for group actions such as saving a node-group template, group drag,
  and group delete. Normal
  node click replaces the group with that node; Ctrl/Cmd/Shift click toggles a node in the group and makes newly added
  nodes primary; Shift-drag on empty canvas draws a transient selection rectangle and replaces the group with intersecting
  nodes. Clicking a secondary selected node without modifiers makes it the primary Details node while preserving the
  selected group. Plain empty-canvas drag must continue to pan the viewport.
- Multi-select visuals must distinguish primary and secondary selected nodes without relying on color alone. The primary
  node keeps the strong selected ring used by the Details sidebar. Secondary selected nodes use a quieter ring and a small
  check marker. The selection rectangle is a temporary translucent overlay; do not render a persistent group bounding box,
  multi-node inspector, or batch-operation panel under the multi-select contract. When more than one node is selected, a
  top-center canvas-control status such as `已选 N` should appear with a prominent red clear-selection button so the
  temporary state is obvious and not hidden by bottom scroll controls.
- Canvas keyboard selection behavior should prefer ReactFlow key props/hooks for local selection and viewport activation:
  `selectionKeyCode`, `multiSelectionKeyCode`, `panActivationKeyCode`, `zoomActivationKeyCode`, and `useKeyPress` are
  appropriate for lasso, multi-select modifiers, Space pan activation, Ctrl/Meta zoom activation, and Escape
  clear-selection. Backend-backed operations such as delete, duplicate, paste, undo, and redo remain ProductDetail-owned
  shortcuts because they require confirmation, mutation calls, cache updates, or history restoration; keep ReactFlow
  `deleteKeyCode` disabled unless those contracts are routed through ProductFlow handlers.
- ProductDetail node/group secondary actions must use one ProductFlow action model rendered through ReactFlow
  `NodeToolbar` on the selected node. The toolbar is the direct action surface on both desktop and mobile. Do not add a
  selected-card More button, mobile node action sheet, long-press action path, or ProductFlow desktop right-click context
  menu for node actions. Single selected reusable nodes expose run, duplicate, fit selected, and delete. A single
  `product_context` node exposes only fit selected. A selected group exposes duplicate, fit selected, save selected as
  template, and delete through one toolbar anchored to the primary selected node; secondary selected nodes do not render
  duplicate toolbars. A group that includes `product_context` exposes only duplicate and fit selected.
  Toolbar buttons must be icon buttons with `aria-label` and `title`, use `nodrag nopan nowheel`, and stay outside the
  node-card layout so they do not resize the node card. Actions such as run, duplicate, fit selected, save selected as
  template, and delete must call existing ProductDetail
  handlers/mutations: run flushes the selected draft through `handleRunWorkflow`, duplicate uses the backend duplicate
  mutation, fit selected uses WorkflowCanvas/ReactFlow fit-view helpers, template save opens the existing save-template
  form/state, and delete opens ProductFlow confirmation before backend mutation. A single `product_context` target should
  expose only fit-selected; a group that includes `product_context` may duplicate reusable non-product nodes, but should
  not expose node-group template save or group delete. Keep ReactFlow `deleteKeyCode` disabled and do not locally
  materialize duplicate or delete results.
- Multi-select hit testing should be based on canvas coordinates so zoom and pan do not change selection semantics. Use
  ReactFlow selection events for the main workbench and keep pure helpers for selection reconciliation. Selection state
  must reconcile when workflow data changes: deleted nodes are removed, the primary node remains included in
  `selectedNodeIds`, and a missing primary falls back to another selected node or the first workflow node.
- Treat multi-select as a temporary grouping state, not the default canvas mode. Ordinary non-group actions should collapse
  the group back to a single primary node, including blank-canvas click, adding a node, deleting a node or edge, creating
  an edge, uploading/filling a reference image, or applying a node-group template. Future save-as-template and deliberate
  group drag/delete flows consume the full `selectedNodeIds` group instead of clearing it before the operation.
- If the browser emits a click after completing a Shift-drag lasso selection, that click must not be treated as a
  blank-canvas clear action. Skip only that immediate synthetic/paired click; later blank-canvas clicks should still exit
  multi-select.
- Pointer release must not flash the node back to its stale server position. Keep the final drag coordinates in an
  optimistic position layer and update the `['product-workflow', productId]` cache before/while the PATCH is in flight;
  clear the optimistic entry after the server response becomes the authority, or restore the previous cache on error.
- Pointer releases below the ProductFlow click/commit guard must restore ReactFlow internal node positions to their drag
  start positions and skip persisted position mutations.
- If the same node is dropped again before an earlier position mutation resolves, protect the latest optimistic position
  from stale mutation success/error handlers; serialize or version position mutations so older responses cannot overwrite
  the newest drop and cause a one-frame old-position flash.
- Dragging any node in a multi-selected group should move every selected node by the same canvas delta, keep internal
  spacing, let ReactFlow update connected edges while dragging, allow the group to move through the unbounded canvas
  coordinate space, and persist each moved node through the normal `updateWorkflowNode(...)` position mutation. Position
  mutation success must not overwrite other pending group positions with stale full-workflow responses.
- Edges are created by dragging a ReactFlow output handle to a target handle/node. The visible temporary connection line is
  rendered by ReactFlow.
- Connection-drag handle highlighting should use ReactFlow native connection state, such as `useConnection` or
  ReactFlow-provided handle connection classes. Do not reimplement connection drag, draw a custom temporary connection
  path, or bypass ProductFlow's existing `onConnect` / `isValidConnection` / backend edge mutation path.
- Edge deletion is a canvas action and should use ReactFlow `EdgeToolbar` or an equivalent ReactFlow edge child for the
  delete affordance. It must call `deleteWorkflowEdge(edgeId)` before refreshing `['product-workflow', productId]`; do
  not leave stale local-only edge state.
- Node deletion is a persisted canvas action and must call `deleteWorkflowNode(nodeId)` before refreshing
  `['product-workflow', productId]`; deleting a node must not be represented by local-only filtering because connected
  edges and run history cleanup are backend responsibilities.
- Workflow execution is asynchronous from the frontend perspective: `runProductWorkflow(productId, input?)` returns the
  persisted kickoff state, then the page polls `['product-workflow', productId]` while any run is `running` or any node is
  `queued` / `running`. Run history must use backend `is_retryable` for retry actions. Cancellation belongs in the
  selected node detail actions when the selected node is part of a cancelable active run; cancel buttons call the workflow
  cancel API and must not be local-only state.
- ProductDetail run history should display both workflow-run and node-run status details. Each run card should surface
  queue/running text, `is_cancelable`, `is_retryable`, `failure_reason`, and a node-run list with node title, node type,
  node-run status, started/finished timestamps, and node-run failure reason. Image-generation prompt review may be exposed
  as an explicit button on the corresponding node-run row; do not render raw `output_json`, artifact ids, or prompt text
  inline in the normal log.
- ProductDetail run history may display workflow image-provider summaries from `nodeRun.output_json.provider_results`
  when present. Keep this as a compact summary only: provider/model, provider response status/id, actual size, and
  provider compatibility notes are acceptable; raw provider request/output JSON, prompts, API keys, base URLs, and artifact
  ids must stay hidden. Do not imply live provider progress unless the workflow API exposes durable node-run progress
  fields.
- Running any workflow node must first flush the currently selected dirty inspector draft, even when the clicked run action
  belongs to a different node. Otherwise a user can edit the product context node and immediately run an image node from
  the canvas before autosave persists the newest product fields.
- Do not use workflow active state as a global node-run lock. Split interaction busy state so the full-workflow run button
  and structural mutations can be disabled during active runs, while individual node run buttons are disabled only when
  that node is already `queued` / `running` or a run submission is currently pending. Node dragging remains available
  unless a layout/position mutation is already pending.
- When an active run transitions to inactive, refresh artifact-bearing queries: `['product', productId]`,
  `['product-history', productId]`, and `['products']`.
- Product creation is intentionally minimal: only product name and preview/main image are required; category, price,
  description/context, reference images, copy, and image directions are configured later through canvas nodes.
- Product list deletion must use `api.deleteProduct(productId)`, ask for explicit confirmation, and refresh `['products']`
  after success. Show `ApiError.detail` when active workflow runs block deletion.
- `reference_image` nodes use `uploadWorkflowNodeImage(...)` for manual uploads and can also be filled by upstream
  `image_generation` nodes.
- A `reference_image` node is a single current-image slot. When manual upload or upstream `image_generation` fills a slot,
  the UI should treat the returned single `source_asset_ids[0]` / `image_asset_ids[0]` as the node's current image and rely
  on product source-asset/history artifact surfaces for older replaced assets. Do not hide multi-image output only in the
  frontend; the backend contract must replace the node output.
- `image_generation` is a trigger/config node, not an image-bearing artifact node. It must not render generated-image
  previews or download links on the image-generation card itself.
- `image_generation` output count is represented by downstream graph slots: one generated image per connected downstream
  `reference_image` node. With no downstream slots, backend execution fails with a concise "connect at least one
  image/reference node" message; the frontend should make that requirement visible in the inspector.
- Any node with an image asset/output should render a compact preview directly on the node card.
- Any user-visible product/workbench image preview should provide an explicit `下载` action. Do not rely on browser
  right-click as the only way to retrieve product images.
- Type-specific inspector forms are required for product context, reference image, copy generation, and image generation;
  avoid generic JSON editors for normal user flows.
- A selected `copy_generation` node with a generated `copy_set_id` must edit `CopyPayloadV2` as the primary copy model:
  `summary`, `content.kind`, block/section text, labels, notes, and visual hints. The inspector must not show a derived
  fixed-field copy panel or maintain removed copy fields as draft state. Saving calls
  `updateWorkflowNodeCopy(...)` with `structured_payload`, refreshes workflow/product artifacts, and does not expose the
  raw `copy_set_id`.
- Node output details should stay productized and minimal. Do not render raw `output_json` keys, artifact IDs, prompt /
  instruction text, generated-summary prose, or technical fact-chip piles in the normal inspector; keep failure reasons
  visible and expose successful artifacts through their productized surfaces (node thumbnails, editable copy fields, and
  the Images tab).
- ProductDetail uses one right sidebar for Details, Runs, Images, and Templates. The small rail selects the active tab; clicking a
  workflow node must select it and switch the sidebar to Details. Workflow completion must refresh artifacts silently and
  must not auto-switch the active tab.
- The Images tab may aggregate `PosterVariant` and `SourceAsset` records, but it must de-duplicate generated images that
  appear as both a persisted poster and a filled reference source asset from the same `image_generation` output.
- In the Images tab, thumbnail primary click opens a large in-app preview/lightbox using preview/full URLs; it must not
  navigate to, download, or expose the compressed thumbnail as the primary action. Explicit `下载` controls still use
  original/download URLs.
- When the selected node is `reference_image`, Images tab cards expose a concise fill action. SourceAsset-backed cards
  call `bindWorkflowNodeImage(..., { source_asset_id })` so no duplicate upload is created. PosterVariant-backed cards
  should pass the already paired filled SourceAsset id when workflow output exposes one, otherwise call
  `bindWorkflowNodeImage(..., { poster_variant_id })` so the backend can materialize a reference SourceAsset.
- Images tab de-duplication should read every durable poster-to-SourceAsset mapping available: generated image-node
  `generated_poster_variant_ids` / `filled_source_asset_ids`, filled reference-node `source_poster_variant_id`, and
  SourceAsset `source_poster_variant_id`. Do not rely only on currently filled reference nodes; old materialized poster
  SourceAssets remain implementation artifacts and must stay hidden when their source PosterVariant is already shown. The
  backend materialized poster filename convention `poster-{poster_variant_id}.*` is only a legacy fallback when an older
  API payload lacks the explicit SourceAsset field; do not apply it when `source_poster_variant_id` is present and null, or
  user-uploaded reference images with the same filename would be over-filtered.
- Image download links should use `download_url` when available and fall back to preview URLs only when needed. Always pass
  backend URLs through `api.toApiUrl(...)`, use short visible copy such as `下载`, stop propagation inside node cards, and
  sanitize generated filenames so product names cannot introduce path separators or control characters.
- User-visible copy should be short utility labels such as `商品`, `参考图`, `文案`, `生图`, `运行`, `连接`, `删除`.
- An idle `product_context` node is usable static context and should not be labeled as `未运行`; display it as available
  context while leaving real generative/action nodes to use the generic idle label.
- Mutations that create artifacts must refresh `['product', productId]`, `['product-history', productId]`, and
  `['products']` when outputs can affect copy, posters, or list status.

### Templates Sidebar Tab

- Built-in canvas templates are loaded through `api.listCanvasTemplates()` from `GET /api/workflow/canvas-templates`;
  ProductDetail should display built-in scenario templates and non-archived user templates for workbench insertion.
- ProductDetail must present templates inside the inspector sidebar as a `templates` tab with the same rail
  behavior as Details, Runs, and Images. Do not open a canvas floating palette for templates.
- The collapsed sidebar rail must include a Templates tab entry; clicking it expands the sidebar and switches to the
  Templates tab.
- Template cards should make a real mini-map the primary visual: render a taller node-editor-like preview with a subtle
  dotted/grid background, compact node rectangles, visible edge paths, and only short labels/chips below it. Avoid
  explanatory paragraphs, long suggested-connection copy, or dense fact lists in the sidebar.
- The mini-map node cards should echo `WorkflowNodeCard` visual language: white or white/95 surfaces, slate/zinc borders,
  rounded card corners, type-matched lucide icons, short title plus `NODE_LABELS`, compact status pills, and left/right
  handle dots. Do not regress to color-strip-plus-lines nodes.
- Template card previews must be rendered from catalog summary `preview_nodes` and `preview_edges`, which are derived from
  backend `CanvasTemplate.nodes` and `CanvasTemplate.edges`. Use the provided relative coordinates to fit the graph into
  the sidebar card as a real mini-map. Do not hard-code a generic template structure in the frontend, and show a short
  empty state when preview data is absent.
- Template card mini-maps must remain readable for built-in scenario templates: node rectangles must not overlap, edge
  paths should render behind nodes with enough visible space between columns, and the preview can increase height or use
  a normalized column layout while still deriving nodes/edges from the backend summary.
- Template cards should display backend `default_external_connections` as short chips such as `自动接商品`. These chips
  describe edges that the apply API will persist; they are not long-form instructions.
- Template summaries include `source: "builtin" | "user"` and nullable `user_template_id`. ProductDetail must show a
  concise source marker, expose rename/delete actions only for `source === "user"` templates, and leave built-in templates
  immutable.
- When more than one canvas node is selected, the top-center multi-select control may open a save-template form. The form
  requires a template name, accepts an optional description, calls
  `api.createUserTemplateGroup(productId, { title, description, node_ids: selectedNodeIds })`, invalidates
  `["canvas-templates"]` on success, and switches the sidebar to Templates so the saved template is visible.
- Deleting a user template calls `api.archiveUserTemplateGroup(user_template_id)` after user confirmation and invalidates
  `["canvas-templates"]`; UI text may say delete, but the backend operation is archival.
- Renaming a user template calls `api.updateUserTemplateGroup(user_template_id, { title })` and invalidates
  `["canvas-templates"]`. The first UI contract only edits the title; description editing can stay out of the card flow.
- Applying a built-in scenario template calls `api.applyWorkflowTemplateGroup(productId, { template_key, position_x,
  position_y })` and receives the normal `ProductWorkflow` response. Built-in full-canvas templates reuse the active
  workflow's existing product node instead of creating a second product node.
- Applying a user node-group template uses the same API with `template_key === "user:{id}"`; the frontend must not special
  case materialization locally.
- Use the current viewport-center node position for the insertion point unless a more explicit user-selected canvas
  coordinate is part of a future task.
- On apply success, update `['product-workflow', productId]`, refresh the workflow query, and select a created primary
  node by comparing pre/post node IDs. Prefer `copy_generation`, then `image_generation`, then the first created node so
  the user can immediately edit, connect, drag, or run it.
- Display `reference_input_hints`, `output_slots`, and `suggested_connections` as guidance only. Suggested connections
  must not become hidden external edges; every real edge in the canvas should come from the backend workflow payload.
- When a user or legacy node-group template declares default external connections, adding it should result in visible backend-returned
  workflow edges, for example from the existing product context node to newly created copy/image nodes. The frontend must
  render those edges from the normal workflow payload rather than from local template metadata.
- Do not duplicate the backend template catalog in ProductDetail. The page may use merchant-facing labels from the API,
  but the submitted `template_key` must be the backend-recognized key.

### Keyboard Shortcuts and Undo/Redo

#### 1. Scope / Trigger
- Trigger: ProductDetail changes to keyboard handling, selected node groups, copy/paste, delete shortcuts, or undo/redo.
- Shortcuts are local workbench interactions on top of persisted workflow mutations.

#### 2. Signatures
- Copy: `Ctrl/Cmd+C` stores the current selected node ids in page memory.
- Paste: `Ctrl/Cmd+V` calls `api.duplicateWorkflowNodeGroup(productId, ...)`.
- Duplicate: `Ctrl/Cmd+D` copies and immediately duplicates the current selected group.
- Delete: `Delete` / `Backspace` requests confirmation, then deletes the selected node/group through persisted APIs.
- Undo: `Ctrl/Cmd+Z` applies the latest frontend inverse action.
- Redo: `Shift+Ctrl/Cmd+Z` or `Ctrl/Cmd+Y` reapplies the latest undone inverse action.
- Backend duplicate endpoint: `POST /api/products/{product_id}/workflow/node-groups/duplicate`.

#### 3. Contracts
- Shortcut handling must ignore events from `input`, `textarea`, `select`, `button`, `a`, labels, role buttons,
  contenteditable elements, and node/action controls where text editing or normal browser commands should win.
- Shortcuts operate on the current `selectedNodeIds`; no selection means no destructive action.
- Delete shortcut always opens confirmation. Undo/redo opens confirmation only when the step will delete nodes or edges.
  Movement, restoration, copy, and paste execute without confirmation.
- Copy/paste and duplicate must use backend duplication. The frontend must not locally materialize workflow rows.
- After paste/duplicate, update `['product-workflow', productId]` with the backend response and select the created nodes.
- Undo/redo history is an in-memory inverse-action stack scoped to the current product page. Clear it on product changes
  and when workflow data is externally refreshed in a way that makes local history unsafe.
- Undoing node deletion restores structure, editable config, and internal edges only. It must not restore output JSON, run
  state, workflow run rows, generated copy, generated images, or artifact ids/URLs/paths.

#### 4. Validation & Error Matrix
- Shortcut from editable target -> do nothing and do not prevent the user's text operation.
- Delete with no selected nodes -> do nothing.
- Paste with empty clipboard -> do nothing or show a concise local notice; do not call the backend.
- Backend duplicate error -> show `ApiError.detail` in the existing ProductDetail error surface.
- Destructive undo/redo canceled by user -> keep history unchanged.
- Undo/redo mutation failure -> show `ApiError.detail` and keep the page consistent with the latest query data.

#### 5. Good/Base/Bad Cases
- Good: select a copy/image/reference chain, press `Ctrl/Cmd+D`, and see a new selected chain with internal edges.
- Good: delete selected nodes with confirmation, then undo and get fresh idle/configured nodes without old outputs.
- Base: pressing `Ctrl/Cmd+C` inside an inspector text field uses normal text copy and does not replace the canvas
  clipboard.
- Bad: storing copied workflow nodes in localStorage or sharing them across products/tabs for the MVP.
- Bad: undoing deletion by writing old `output_json` back into a node, which makes stale generated artifacts look valid.

#### 6. Tests Required
- Pure helper tests for shortcut target filtering and shortcut key classification.
- Pure helper tests for undo/redo inverse-action stack behavior and artifact-field sanitization.
- ProductDetail or focused tests that delete and destructive undo/redo request confirmation.
- Frontend build must pass because shortcut routes touch DTOs, API helpers, and ProductDetail.

#### 7. Wrong vs Correct

Wrong:

```tsx
document.addEventListener("keydown", (event) => {
  if (event.metaKey && event.key === "c") setClipboard(selectedNodeIds);
});
```

This steals normal copy behavior from inspector fields.

Correct:

```tsx
if (!isWorkflowShortcutBlockedTarget(event.target)) {
  handleWorkflowShortcut(event);
}
```

Filter editable/action targets before interpreting canvas shortcuts.

### 4. Validation & Error Matrix

- API `ApiError.detail` is shown near the workflow action.
- Missing workflow while loading -> loading state, not an empty destructive reset.
- Active workflow polling stops when no run is `running` and no node is `queued` / `running`; `cancelled` runs are
  terminal and should not keep polling alive.
- Deleting a node during an active workflow run -> show backend `运行中，稍后删除`; do not locally remove it.
- Deleting a product during active workflow runs -> show backend detail; do not locally remove it until the API succeeds.
- Unsupported node config fields stay in `config_json` and are not force-cast to narrower frontend-only types.
- Image URLs from workflow-created source assets and poster artifacts still go through `api.toApiUrl(...)`.
- Direct image runs without downstream reference slots should show the backend error near the workflow action/node; do not
  invent a fallback preview on the image-generation node.
- Image-size inputs smaller than the provider-safe lower bound must be calibrated in the picker before submission, matching
  the backend 512px minimum per side. The user-facing custom-size hint should show the calibrated final output.
- When async workflow polling observes a failed run with `failure_reason`, ProductDetail should surface that reason in the
  global workflow error area as well as node/run detail surfaces.

### 5. Good/Base/Bad Cases

- Good: selecting a node updates the inspector without navigating away from the product detail page.
- Good: an image-generation node with no downstream reference slot fails clearly and shows no generated image
  preview/download on the image node.
- Good: an image-generation node connected to two downstream reference slots visibly fills both slot nodes after run.
- Base: adding a copy/image/reference branch creates a node, then connects it with an edge through API helpers.
- Base: after a copy node run succeeds, editing the generated copy updates the inspector draft from product `copy_sets`
  plus node output, without showing raw output summaries or artifact IDs in the normal inspector.
- Base: uploading an image in a `reference_image` inspector refreshes the workflow query and keeps the node output visible
  after a page reload.
- Base: after dragging a node and releasing the pointer, the rendered node stays at the dropped position while the
  position mutation is pending; it must not briefly render the old `position_x` / `position_y`.
- Base: dragging an empty canvas/background area pans the ReactFlow viewport, while dragging a node still persists node
  coordinates and clicking edge/delete/run/upload/zoom controls does not move the viewport.
- Base: on desktop, Shift-dragging an empty canvas area uses the ReactFlow selection rectangle and replaces the selected
  node group, while a normal empty-canvas drag still pans.
- Base: on mobile, select mode uses tap-toggle multi-select, keeps empty-canvas drag as viewport pan, and does not show a
  selection rectangle.
- Base: multi-selecting nodes does not turn Details into a batch editor; `selectedNodeId` remains the primary node and
  `selectedNodeIds` remains the group for future template saving or batch actions.
- Base: clicking a secondary selected node opens that node in Details while keeping the group selected; clicking blank
  canvas or performing ordinary node/edge/image mutations exits multi-select back to one primary node.
- Base: dragging a secondary selected node makes it primary for Details but keeps the group selected and moves the whole
  selected group.
- Base: deleting from the multi-select control confirms once, calls backend node deletion for selected nodes, and exits to
  a single remaining primary node after success.
- Base: while a workflow run is active, users can still drag nodes to reorganize the canvas and may run another
  non-queued/non-running node; the backend rejects overlapping planned nodes and the UI still blocks unsafe structural
  changes.
- Base: deleting a node removes it and its connected edges after the backend response, and a page refresh does not restore
  the node.
- Base: deleting a product from the product list removes it after API success and a direct detail load returns not found.
- Base: visible product images, filled reference-slot images, and image-history thumbnails each expose a concise `下载`
  action that does not select/drag the node or open the preview modal as a side effect. Image-generation nodes do not expose
  generated-image downloads directly.
- Base: with a reference-image node selected, filling from a SourceAsset updates the workflow cache to the chosen
  `source_asset_id`; filling from a PosterVariant either reuses its paired SourceAsset id or relies on the backend
  materialization endpoint.
- Bad: keeping workflow nodes in local-only state; refresh would lose the DAG and break run history.
- Bad: treating `workflowActive` as `runBusy` for every node run button; that hides the backend's ability to run disjoint
  nodes and makes the UI look globally locked while only one node is active.

### 6. Tests Required

- `just web-build` must pass after any DTO or page change.
- Backend API tests should cover workflow payload shapes; the frontend relies on these typed shapes at build time.
- User-template frontend changes must pass `just web-build` because `CanvasTemplateSummary`, API helpers, ProductDetail,
  and `TemplateGroupsPanel` all share DTO fields.
- If a separate frontend test runner is added later, cover selected-node inspector, run-all mutation, edge drag/delete, and
  cache invalidation.
- If a separate frontend test runner is added later, cover workflow active-run polling, active-to-inactive artifact query
  refresh, node deletion, and product list deletion error/success states.
- Drag-position regressions should cover the render priority: active drag position, then optimistic dropped position, then
  server workflow position.
- Multi-select regressions should cover desktop rectangle normalization/intersection, node hit testing with
  measured/fallback bounds, modifier-toggle behavior, lasso replacement behavior, mobile tap-toggle behavior, and
  selection reconciliation after workflow node changes.
- Multi-select regressions should also cover secondary-node focus and clearing the group for ordinary non-group actions.
- User-template regressions should cover saving from `selectedNodeIds`, invalidating `["canvas-templates"]`, showing
  user-only rename/delete actions, confirming archival, and applying user templates through the same template-group API as
  built-ins.
- Download-link regressions should cover URL construction through `api.toApiUrl(...)`, filename sanitization, and event
  propagation isolation inside node cards.
- Images-tab regressions should cover preview/lightbox primary click, explicit download action, gallery de-duplication, and
  reference-node fill cache refresh for both `source_asset_id` and `poster_variant_id` inputs.

### 7. Wrong vs Correct

#### Wrong

```ts
const [nodes, setNodes] = useState(defaultNodes);
```

Local-only nodes do not satisfy the persisted ProductFlow workflow contract.

#### Correct

```ts
const workflowQuery = useQuery({
  queryKey: ["product-workflow", productId],
  queryFn: () => api.getProductWorkflow(productId),
});
```

Load the persisted workflow and keep only transient selection/edit drafts in local state.

#### Wrong

```tsx
Object.entries(node.output_json).map(([key, value]) => <div>{key}: {String(value)}</div>);
```

This leaks internal artifact IDs and prompt-like implementation detail into the product UI.

#### Correct

```tsx
const facts = [`图片 ${posterCount}`, `参考图 ${filledCount}`, size].filter(Boolean);
```

Render concise, user-facing facts and keep raw workflow JSON as an API/debug boundary, not normal UI copy.

#### Wrong

```tsx
setNodeDrag(null);
updateWorkflowNode(node.id, { position_x: x, position_y: y });
```

If the render path falls back to the still-stale query data after `setNodeDrag(null)`, the node flashes back to the old
position until the mutation/refetch completes.

#### Correct

```tsx
setOptimisticNodePositions((positions) => ({ ...positions, [node.id]: { x, y } }));
queryClient.setQueryData(["product-workflow", productId], moveNodeInCache(node.id, x, y));
updateWorkflowNode(node.id, { position_x: x, position_y: y });
```

Keep a short-lived optimistic coordinate and cache update during the mutation, then replace it with the server-returned
workflow on success or restore the previous cache on error.

#### Wrong

```tsx
const busy = runWorkflowMutation.isPending || updateNodePositionMutation.isPending;
if (busy) return;
```

This makes a long async workflow run feel like a frozen canvas even though persisted run/node status is available through
polling.

#### Correct

```tsx
const workflowActive = hasActiveWorkflow(workflow);
const runSubmissionPending = runWorkflowMutation.isPending || retryWorkflowRunMutation.isPending;
const selectedNodeRunAction = getWorkflowNodeRunActionState(selectedNode, {
  runSubmissionPending,
  pendingStartNodeId,
});
const dragBusy = updateNodePositionMutation.isPending;
const structureBusy = layoutMutationBusy || workflowActive;
```

Use persisted workflow activity to control polling and unsafe structural mutations. Use node status plus submission
pending state for individual node run actions, while keeping layout dragging independent from provider execution.

## Scenario: Autosaved direct image workbench

### 1. Scope / Trigger
- Trigger: ProductDetail workbench changes for image-node execution, autosave, panel sizing, or canvas zoom.

### 2. Signatures
- `api.listProducts({ page, page_size })` drives paginated product lists and returns thumbnail URLs.
- `api.runProductWorkflow(productId, { start_node_id })` may target an image node whose only required upstream is product
  context.
- Local UI persistence keys: `productflow.workflow.zoom` and `productflow.workflow.inspectorWidth`.

### 3. Contracts
- The add-node toolbar must not expose `product_context`; one product context exists per active workflow.
- Node draft edits debounce-save through `updateWorkflowNode(...)`; run-all and run-selected must flush the selected draft
  before calling `runProductWorkflow(...)`.
- Image-node inspector copy should only show the downstream reference-slot requirement when no slot is connected; do not
  show internal graph counts such as upstream-node totals. Node cards should show status and any failure reason, not
  generated-summary prose, raw coordinates, or image previews for `image_generation` nodes.
- ReactFlow viewport zoom transforms visual coordinates, while drag persistence must keep backend positions in unscaled
  workflow coordinates.
- Mouse wheel and pinch events inside the canvas viewport should zoom the ReactFlow canvas within shared zoom bounds and
  persist the value under `productflow.workflow.zoom`. Controls/forms/buttons should not trigger unexpected zoom.
- The shared minimum zoom must be low enough for mobile all-nodes overview. Do not set a floor such as 50% that prevents
  ReactFlow `fitView` from fitting the current workflow into a narrow mobile viewport.
- Canvas zoom controls must be a floating overlay anchored inside the ReactFlow canvas viewport through ReactFlow `Panel`
  or an equivalent ReactFlow child component. Zoom display should read ReactFlow viewport state through native hooks such
  as `useViewport`, and durable zoom persistence should be tied to ReactFlow viewport change end events.
- Canvas view-fitting controls should use ReactFlow instance viewport helpers such as `fitView` with node id filters for
  all-nodes and selected-node focus. Do not calculate viewport transforms manually for these standard view operations.
- Run history and downloadable images live in the right sidebar, not in a persistent bottom panel, so the canvas keeps its
  vertical working space.

### 4. Validation & Error Matrix
- Autosave error -> show local `ApiError.detail`, keep user draft visible, and allow explicit retry/save.
- Run clicked while selected draft is dirty -> save first; if save fails, do not run stale config.
- Zoomed canvas drag -> persisted `position_x` / `position_y` are unscaled workflow coordinates.

### 5. Good/Base/Bad Cases
- Good: edit image instruction, immediately click run, and backend receives the new instruction.
- Base: resize the right sidebar, refresh, and see the same local width.
- Base: pan or zoom the canvas and the zoom controls stay visually anchored over the canvas viewport.
- Bad: showing generated image preview/download on an `image_generation` node instead of on linked reference slots.
- Bad: placing zoom controls in the top toolbar or scrollable canvas flow so they move with workflow content.

### 6. Tests Required
- `just web-build` for DTO/type compatibility.
- Backend API tests for direct image-node run and singleton product context, because frontend relies on those contracts.

### 7. Wrong vs Correct
#### Wrong

```tsx
onClick={() => runWorkflowMutation.mutate(selectedNode.id)}
```

#### Correct

```tsx
onClick={() => void handleRunWorkflow(selectedNode.id)} // flushes selected draft first
```


--- FILE: .trellis\spec\frontend\quality-guidelines.md ---

# Frontend Quality Guidelines

> Frontend quality standards reflected by current ProductFlow code and tooling.

---

## Tooling

Frontend tooling is defined in `web/package.json`, `web/tsconfig*.json`, `web/vite.config.ts`, and the root `justfile`:

- React 19, React DOM 19.
- Vite 7 with `@vitejs/plugin-react`.
- Tailwind CSS v4 through `@tailwindcss/vite`.
- TanStack Query 5 for server state.
- React Router DOM 7 for routing.
- TypeScript strict mode.

Common commands:

```bash
just web-install
just web-dev
just web-build
pnpm --dir web lint
pnpm --dir web test:run
```

`just web-build` runs `pnpm --dir web build`, which type-checks app and Vite/Vitest config before building. Frontend
changes should also run the executable quality gate added under `web/package.json`:

- `pnpm --dir web lint` runs ESLint flat config from `web/eslint.config.js` over the Vite/React/TypeScript workspace.
  The baseline intentionally keeps formatting churn low: React hooks rules are enabled, while exhaustive dependency
  cleanup is not part of the first gate.
- `pnpm --dir web test:run` runs deterministic Vitest unit tests from `web/vitest.config.ts`.
- `pnpm --dir web test` is reserved for local Vitest watch mode.

Prefer pure helper tests for page-local logic before large UI refactors. For ProductDetail workbench changes, add or
extend tests under `web/src/pages/product-detail/*.test.ts` when touching gallery, download, workflow status, or other
importable helper behavior. Do not split `ProductDetailPage.tsx` solely to satisfy tests; extract only small pure helpers
when that keeps runtime behavior unchanged.

## Scenario: Frontend executable quality gate

### 1. Scope / Trigger

- Trigger: any frontend code change under `web/src/`, frontend config change under `web/`, or ProductDetail helper
  extraction intended to support refactoring.
- Goal: keep the gate small and deterministic before larger ProductDetail UI splitting.

### 2. Signatures

- `pnpm --dir web lint`
- `pnpm --dir web test:run`
- `pnpm --dir web test` for local watch mode only.
- `just web-build` remains the build/type-check gate and delegates to `pnpm --dir web build`.

### 3. Contracts

- ESLint config lives at `web/eslint.config.js`.
- Vitest config lives at `web/vitest.config.ts`.
- Unit tests use `*.test.ts` under `web/src/`; keep them close to the pure helper they cover.
- `web/tsconfig.node.json` includes frontend tool config files that should be type-checked by `web build`.

### 4. Validation & Error Matrix

- Lint error -> fix code or narrow the rule in `web/eslint.config.js`; do not add inline suppressions unless the
  exception is intentional and documented near the code.
- Test failure -> fix the helper or update the assertion when the intended behavior changed.
- Type/build failure -> fix TypeScript/runtime import boundaries before reporting frontend work complete.
- Large pre-existing React hook dependency cleanup -> do not mix into unrelated work; keep the initial gate low-noise and
  schedule stricter rules separately.

### 5. Good/Base/Bad Cases

- Good: add or update a ProductDetail gallery/download/status helper and cover it with a colocated `*.test.ts`.
- Base: run `pnpm --dir web lint`, `pnpm --dir web test:run`, and `just web-build` before handing off frontend changes.
- Bad: split `ProductDetailPage.tsx` UI only to make tests importable.
- Bad: enable broad formatting or hook-dependency rules that require whole-frontend rewrites in an unrelated task.

### 6. Tests Required

- New pure helper -> add Vitest unit coverage for normal and edge cases.
- ProductDetail helper changes -> prefer colocated tests under `web/src/pages/product-detail/`.
- Locale/theme helper changes -> update or add tests near `web/src/lib/preferences.test.ts`.
- Locale-aware pure helper changes -> test both `zh-CN` and `en-US`, including fallback behavior for legacy system labels
  when old records store default Chinese titles.
- DTO/API behavior changes still require `just web-build`; frontend unit tests do not replace backend contract tests.

### 7. Wrong vs Correct

#### Wrong

```bash
pnpm --dir web test
```

Using watch mode as the handoff gate can hang automation.

#### Correct

```bash
pnpm --dir web test:run
```

Use the deterministic run mode for CI-style verification and keep `test` for local watch mode.

---

## Required Patterns

### Centralize API access

Use `web/src/lib/api.ts` for all backend calls. It handles:

- `VITE_API_BASE_URL` trimming.
- `credentials: "include"` for session-cookie auth.
- JSON vs `FormData` headers.
- API error parsing into `ApiError`.
- Typed request/response methods.

Do not add raw `fetch(...)` calls in pages/components.

### Keep server state in TanStack Query

Use `useQuery`, `useMutation`, and `useQueryClient` as shown in current pages. Mutations should update or invalidate the
query keys affected by the change. Do not introduce global stores for server records.

### Keep routes auth-gated

Add new private routes in `web/src/App.tsx` with the same authenticated/redirect pattern used by existing routes. Login is
the only public page.

### Preserve build-time type safety

Any API contract change should update `web/src/lib/types.ts`, page usage, and backend schemas/tests together. Run
`just web-build` before finishing frontend work. When frontend code changes, also run `pnpm --dir web lint` and
`pnpm --dir web test:run`.

### Keep UI feedback explicit

Current pages show loading, error, disabled, and success states close to the action:

- Loading spinner for initial app/session load in `App.tsx`.
- Product list load/error states in `ProductListPage.tsx`.
- Mutation errors in `ProductCreatePage.tsx`, `ProductDetailPage.tsx`, `ImageChatPage.tsx`, and `SettingsPage.tsx`.
- Disabled buttons while mutations are pending.

Follow this style for new actions.

### Keep settings/admin workspaces theme-complete and locale-complete

Settings, admin, and operational workspaces must be designed and reviewed as light/dark paired surfaces, not as a
single-theme mock copied into both modes.

- Light mode should remain a first-class surface: neutral page background, white or near-white panels, readable slate/zinc
  text, and visible but restrained borders.
- Dark mode may use deep navy/slate surfaces and violet/indigo accents, but every explicit light background, border,
  placeholder, muted text, hover state, and alert state needs a matching `dark:*` variant.
- Every new visible UI label, placeholder, button, section heading, status message, and aria label must use
  `web/src/lib/i18n.ts` keys for both `zh-CN` and `en-US`.
- Provider names, model IDs, API keys, URLs, filenames, backend `ApiError.detail`, and operator-authored content stay as
  source data and should not be translated.
- Configuration pages should keep app-style density: fixed or sticky navigation, one active working panel, explicit field
  labels, and save/error feedback near the changed section.

### Keep desktop-only layout state bounded

When adding resizable panels to a desktop-only layout:

- Keep min/max sizing and viewport-fit calculations in pure helper functions when the math is non-trivial.
- Re-clamp stored panel sizes on desktop viewport resize so hidden overflow does not push primary content below its
  minimum useful size.
- Gate desktop-only clamping with the same breakpoint that controls the desktop layout. Do not shrink hidden panel state
  while the page is in a mobile stacked layout, or the user may return to desktop with unexpectedly collapsed panels.
- Cover clamp helpers with deterministic Vitest tests instead of relying only on manual drag checks.

---

## Accessibility and UX Checklist

Review new UI for:

- Non-submit buttons have `type="button"`.
- Inputs have labels or are wrapped by labels.
- Loading states use both disabled controls and visible feedback when an action can take time.
- Error text is visible near the action that failed.
- Image URLs from the backend are converted with `api.toApiUrl(...)` before being used in `src` or links.
- Destructive actions such as delete are explicit buttons and update cache/selection state after success.
- Visible UI chrome uses `useI18n()` or locale-aware helpers instead of hard-coded page-local strings.
- Light surfaces, borders, and muted text have dark-mode variants, and product/image previews remain inspectable.

---

## Build and Environment

Development and preview ports are configured through `web/vite.config.ts`:

- Dev default port: `29283`.
- Preview default port: `29281`.
- Dev API proxy target default: `http://127.0.0.1:29282`.
- Allowed hosts default to `draw.devbin.de` unless `WEB_ALLOWED_HOSTS` is provided.

Use `just web-dev` so `.env.dev` and proxy behavior match backend dev commands.

---

## Forbidden Patterns

- Raw `fetch(...)` outside `web/src/lib/api.ts`.
- Untyped API responses or `any` payloads.
- New pages not registered in `App.tsx` or not protected by session auth when private.
- New server state held only in local component state when it should be cached/invalidation-aware.
- Committing `web/dist/`, `web/node_modules/`, `*.tsbuildinfo`, or local env files.
- Adding lint/test commands to docs without actually configuring them in `web/package.json`.
- Adding page-local locale/theme persistence outside `PreferencesProvider`.
- Translating product/operator/model-authored content instead of only ProductFlow UI chrome and system labels.

---

## Review Checklist

Before accepting frontend changes, check:

- Does `just web-build` pass?
- Does `pnpm --dir web lint` pass?
- Does `pnpm --dir web test:run` pass?
- Are API methods and DTO types centralized in `web/src/lib/`?
- Are query keys and invalidations complete for every mutation?
- Are backend enum/DTO changes mirrored in `web/src/lib/types.ts`?
- Are loading/error/disabled states present for async actions?
- Does the UI match the existing Tailwind/zinc visual language?
- Does visible UI chrome render correctly in both `zh-CN` and `en-US`?
- Does the changed UI remain readable in `light`, `dark`, and `system` theme modes?


--- FILE: .trellis\spec\frontend\state-management.md ---

# Frontend State Management

> Actual state management choices in ProductFlow.

---

## Overview

ProductFlow uses four state categories:

1. Server state: TanStack Query in pages and `AppRoutes()`.
2. Local UI/form state: React `useState`, `useMemo`, and `useEffect` inside page components.
3. URL state: React Router params and navigation.
4. Durable local UI preferences: locale and theme mode in `PreferencesProvider`.

There is no Redux, Zustand, Jotai, custom event bus, or durable browser-local onboarding state.

---

## Server State

Server state is loaded through `web/src/lib/api.ts` and cached by TanStack Query. The `QueryClient` is created once in
`web/src/App.tsx` with `refetchOnWindowFocus: false`.

Current query key patterns:

- Session: `['session']` in `App.tsx`. `GET /api/auth/session` returns both `authenticated` and `access_required`; when
  login is disabled server-side, `authenticated` is true even without a login cookie.
- Product list: `['products']` in `ProductListPage.tsx` and `ImageChatPage.tsx`.
- Product detail/history: `['product', productId]` and `['product-history', productId]` in `ProductDetailPage.tsx`.
- Product workbench: `['product-workflow', productId]` and `['product-workflow-status', productId]` in
  `ProductDetailPage.tsx`.
- Image sessions: `['image-sessions', productId ?? 'standalone']` and `['image-session', selectedSessionId]` in
  `ImageChatPage.tsx`.
- Runtime config: `['runtime-config']` in `ProductDetailPage.tsx`, `ProductListPage.tsx`, and `ImageChatPage.tsx`.
- Full settings config: `['config']` in `SettingsPage.tsx`; successful settings saves/resets must invalidate
  `['runtime-config']` when they can affect public runtime behavior, and `['session']` because settings can toggle
  `admin_access_required`.
- Settings lock state: `['settings-lock-state']` in `SettingsPage.tsx`; fetch full `['config']` only after the secondary
  settings token unlock succeeds.

When writing mutations, update/invalidate every key that can show stale data.

---

## Local UI and Form State

Keep short-lived UI state local to the page that owns the interaction:

- `ProductCreatePage.tsx` stores form fields, selected files, and a local error string.
- `ProductDetailPage.tsx` stores editing mode, editable copy draft, selected canvas/workbench state, and local mutation
  error strings.
- `ImageChatPage.tsx` stores selected session/generated asset, prompt draft, image size, rename mode, target product,
  and transient success/error messages.
- `SettingsPage.tsx` stores config drafts, secret touched flags, reset progress, and save/error messages.
- `SettingsPage.tsx` stores the transient settings unlock token only in local component state for the submit attempt; do
  not persist the token in localStorage, query cache, or API responses.

Local state should not duplicate server records unless the user is editing a draft. For example, `SettingsPage.tsx` creates
`drafts` from fetched config so the user can edit before saving; product details themselves remain in TanStack Query.

## URL and Navigation State

React Router owns route selection and route params:

- `useNavigate()` is used after login/logout, product creation, and page buttons.
- `useParams()` supplies `productId` for `ProductDetailPage.tsx` and product-scoped `ImageChatPage.tsx`.
- Auth redirects are centralized in `App.tsx` route elements and `LoginPage.tsx` redirects authenticated users away from
  `/login`.

Do not introduce a global store just to track current page or product ID; use the URL.

---

## Durable UI Preferences

Locale and theme are the only durable browser-local UI preferences currently supported:

- Provider: `PreferencesProvider` in `web/src/lib/preferences.tsx`, mounted once in `App.tsx` inside `BrowserRouter`.
- Locale storage key: `productflow.locale`; default locale is `zh-CN`.
- Theme storage key: `productflow.theme`; default preference is `system`.
- Supported theme preferences are `light`, `dark`, and `system`; `system` resolves from `prefers-color-scheme`.
- The provider updates `document.documentElement.lang`, root `class="dark"` when the resolved theme is dark, and root
  `data-theme` / `data-theme-preference` attributes.
- Use `useI18n()` or `usePreferences()` in components that need locale/theme values; do not create page-local duplicate
  locale/theme state.

Locale and theme are not server records. Do not store them in TanStack Query, add backend settings for them, or persist
them with auth/session state unless a future product requirement explicitly changes that boundary.

Good:

```tsx
const { t } = useI18n();
return <button type="button">{t("nav.settings")}</button>;
```

Bad:

```tsx
const [locale] = useState(window.localStorage.getItem("productflow.locale"));
return <button type="button">{locale === "en-US" ? "Settings" : "配置"}</button>;
```

---

## Derived State

Prefer derived values over additional state:

- `ProductDetailPage.tsx` derives source image URL, reference images, working copy, and poster variants from
  `ProductDetail`.
- `ImageChatPage.tsx` derives built-in image-size picker presets from `web/src/lib/imageSizes.ts`, selected round from
  the selected asset ID, and product source/reference images from product detail.
- `SettingsPage.tsx` derives grouped config items from the fetched config response.

Use `useMemo` where the derivation is non-trivial or passed deeply; otherwise a local helper function is fine.

---

## API Error State

The central API wrapper throws `ApiError(status, detail)` from `web/src/lib/api.ts`. Pages convert it into local user-facing
strings:

- `LoginPage.tsx` displays invalid key errors.
- `ProductCreatePage.tsx` displays create/upload validation errors.
- `ProductDetailPage.tsx` displays copy/poster/reference image mutation errors.
- `ImageChatPage.tsx` displays generation/session/attach errors.
- `SettingsPage.tsx` displays config validation errors.

Keep error display local unless multiple pages need a shared notification system.

---

## Avoid

- Adding a global store for server data already cached by TanStack Query.
- Keeping a separate local copy of fetched records unless the user is editing a draft.
- Invalidating broad caches unnecessarily when a precise `setQueryData` is already used and safe.
- Hiding route state in local storage or globals instead of using React Router params.
- Storing API keys or admin keys in frontend local storage. Authentication is session-cookie based.
- Reintroducing durable browser-local onboarding, tour, help, or tutorial state without a new approved product requirement.
- Adding new durable local preferences outside `PreferencesProvider` without updating this spec and focused helper tests.


--- FILE: .trellis\spec\frontend\type-safety.md ---

# Frontend Type Safety

> TypeScript and API typing conventions used by ProductFlow.

---

## Overview

The frontend uses strict TypeScript. `web/tsconfig.app.json` sets `strict: true`, `allowJs: false`,
`isolatedModules: true`, `moduleResolution: "Bundler"`, and `jsx: "react-jsx"`. The build command in `web/package.json`
runs TypeScript checks before Vite build:

```bash
pnpm --dir web build
# tsc --noEmit -p tsconfig.app.json && tsc --noEmit -p tsconfig.node.json && vite build
```

Runtime API typing is centralized in:

- `web/src/lib/types.ts`
- `web/src/lib/api.ts`

---

## API DTO Types

`web/src/lib/types.ts` mirrors backend Pydantic response/request shapes. It intentionally preserves backend field names,
including `snake_case`:

- `ProductSummary.workflow_state`
- `CopySet.creative_brief_id`
- `ImageSessionGenerationTask.failure_reason`
- `ImageSessionRound.provider_response_id`
- `SessionState.access_required`
- `RuntimeConfig.admin_access_required`
- `ConfigUpdateRequest.reset_keys`

Do not silently convert these to camelCase in frontend types unless the API layer also performs explicit mapping.

String union types mirror backend enums:

```ts
export type ProductWorkflowState = "draft" | "copy_ready" | "poster_ready" | "failed";
export type JobStatus = "queued" | "running" | "succeeded" | "failed" | "cancelled";
```

If backend enum values in `backend/src/productflow_backend/domain/enums.py` change, update these unions and all UI maps
such as `StatusPill.tsx::CONFIG`.

Workflow run DTOs mirror backend run action metadata. When the backend adds `is_retryable`, `is_cancelable`, or queue
fields (`queue_active_count`, `queue_running_count`, `queue_queued_count`, `queue_max_concurrent_tasks`,
`queued_ahead_count`, `queue_position`), update both `WorkflowRun` and `WorkflowRunStatusSummary` because full detail and
lightweight status polling merge through the same cache.

---

## API Client Typing

`web/src/lib/api.ts` exposes typed methods on the `api` object. The internal `request<T>(...)` returns a `Promise<T>` and
throws typed `ApiError` on non-2xx responses.

Examples:

```ts
getProduct(productId: string): Promise<ProductDetail> {
  return request(`/api/products/${productId}`);
}

updateConfig(payload: ConfigUpdateRequest): Promise<ConfigResponse> {
  return request("/api/settings", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
```

Form uploads build `FormData` in API methods such as `createProduct(...)`, `addReferenceImages(...)`, and
`addImageSessionReferenceImages(...)`. The fetch wrapper omits `Content-Type` for `FormData` so the browser can set the
multipart boundary.

### Scenario: Create-product API input typing

#### 1. Scope / Trigger

- Trigger: changes to the product creation form, `api.createProduct(...)`, or backend `POST /api/products` multipart
  fields.
- Product creation is a cross-layer form-upload contract. Keep the shape centralized in `web/src/lib/types.ts` and have
  `web/src/lib/api.ts` translate it into `FormData`.

#### 2. Signatures

- Shared frontend DTO: `CreateProductInput`.
- API method: `api.createProduct(input: CreateProductInput): Promise<ProductDetail>`.
- Multipart fields currently mirrored from the backend:
  - `name: string`
  - `file: File` -> form field `image`
  - `referenceFiles?: File[]` -> repeated form field `reference_images`
  - `category?: string`
  - `price?: string`
  - `source_note?: string`
  - `canvas_template_key?: string`

#### 3. Contracts

- Keep backend field names in the DTO for optional form values such as `source_note` and `canvas_template_key`.
- `canvas_template_key` is the backend-recognized key. UI labels should be merchant-facing output plans, but the submitted
  value remains the key.
- Blank/default product-creation plans may submit an empty string or omit `canvas_template_key`; the backend owns default
  alias handling.
- Product creation large previews for backend-recognized built-in plans must mirror the backend `full_canvas` template
  layout for the same key. When changing preview node titles, edges, or coordinates, update the backend template and
  backend regression tests in the same change.
- The page component must not duplicate the full mutation object type inline when a shared DTO exists.
- The API method owns `FormData` construction. Page components should call `api.createProduct(...)` with typed values, not
  construct raw multipart bodies themselves.

#### 4. Validation & Error Matrix

- Missing `file` is handled by the page before calling the API and should produce the existing `请先上传商品图` message.
- Invalid/unknown `canvas_template_key` is backend validation and surfaces through `ApiError.detail`.
- Upload MIME/size errors are backend upload-validation errors and surface through the same `ApiError.detail` path.

#### 5. Good/Base/Bad Cases

- Good: `ProductCreatePage` stores a selected plan key in component state, displays merchant-facing labels, and passes
  `canvas_template_key` into `api.createProduct`.
- Base: a blank/basic option can use `""` while still sharing the typed DTO.
- Bad: `ProductCreatePage` creates `FormData` directly and bypasses the typed API helper.
- Bad: frontend renames `canvas_template_key` to `canvasTemplateKey` without an explicit mapping layer.

#### 6. Tests Required

- `pnpm --dir web build` must pass after any create-product DTO change.
- Add focused frontend tests for pure helper logic if plan selection or payload routing becomes non-trivial.
- Backend API tests remain the source of truth for multipart validation, template-key error status, and persisted template
  coordinates mirrored by the creation page preview.

#### 7. Wrong vs Correct

Wrong:

```ts
return api.createProduct({
  name,
  file,
  canvasTemplateKey,
});
```

Correct:

```ts
return api.createProduct({
  name,
  file,
  canvas_template_key: selectedPlanKey,
});
```

---

## Local Types

### Scenario: Settings migration API typing

#### 1. Scope / Trigger
- Trigger: changes to settings export/import API methods, SettingsPage import/export UI, or backend
  `SettingsExportDocument` / `SettingsImportPreviewResponse` / `SettingsImportCommitResponse` schemas.
- Settings migration is a cross-layer DTO contract. Keep TypeScript types aligned with backend Pydantic schemas and keep
  backend `snake_case` field names.

#### 2. Signatures
- API methods:
  - `api.exportSettings(): Promise<SettingsExportDocument>`
  - `api.previewSettingsImport(payload: SettingsExportDocument): Promise<SettingsImportPreview>`
  - `api.importSettings(payload: SettingsExportDocument): Promise<SettingsImportCommitResponse>`
- Frontend DTOs live in `web/src/lib/types.ts` and mirror backend field names:
  - `SettingsExportDocument`
  - `SettingsExportMetadata`
  - `SettingsProviderProfileExport`
  - `SettingsProviderBindingExport`
  - `SettingsImportPreview`
  - `SettingsImportCommitResponse`

#### 3. Contracts
- `runtime_config` is a map of config key to JSON scalar/list values from the backend export.
- `provider_profiles` may include `api_key`; SettingsPage must treat exported files as sensitive and show confirmation
  copy before download.
- `provider_bindings` references imported provider profile ids for non-mock bindings.
- Import preview response fields are flat DTO fields such as `runtime_config_count`,
  `provider_profile_count`, `provider_binding_count`, `includes_api_keys`, and
  `provider_profiles_with_api_key_count`; do not invent a nested `metadata.summary` layer unless the backend schema
  changes in the same commit.
- Import commit returns refreshed settings/provider config data or enough data for SettingsPage to invalidate and refetch
  `['config']`, `['provider-config']`, `['runtime-config']`, and `['session']`.

#### 4. Validation & Error Matrix
- Invalid JSON file -> SettingsPage shows a local invalid-file error before calling the API.
- API 400 from preview/commit -> show `ApiError.detail`.
- User cancels export/import confirmation -> do not call the API.
- Successful import -> invalidate settings/runtime/session queries so UI reflects the imported values.

#### 5. Good/Base/Bad Cases
- Good: export downloads exactly the typed backend payload, then importing that JSON previews the same counts.
- Good: preview with `includes_api_keys=true` shows sensitive-file warning before commit.
- Base: import file contains `mock` provider bindings and no provider API keys.
- Bad: frontend reads `preview.metadata.summary` when backend returns flat preview fields.
- Bad: converting DTO fields to camelCase in `types.ts` without an explicit API mapping layer.

#### 6. Tests Required
- SettingsPage tests for export confirmation and generated JSON download path.
- SettingsPage tests for import preview summary, API-key warning, commit confirmation, and query invalidation.
- `pnpm --dir web build` after any settings migration DTO change.

#### 7. Wrong vs Correct

Wrong:

```ts
const keyCount = preview.metadata.summary.providerProfilesWithApiKeyCount;
```

Correct:

```ts
const keyCount = preview.provider_profiles_with_api_key_count;
```

Keep frontend reads aligned with the backend response shape.

---

Use local `type` aliases for page-only structures:

- `EditableCopy` in `ProductDetailPage.tsx`.
- `DraftValue` in `SettingsPage.tsx`.

Use `interface` for component props and DTO object shapes:

- `TopNavProps` in `TopNav.tsx`.
- `ConfigFieldProps` in `SettingsPage.tsx`.
- API DTOs in `web/src/lib/types.ts`.

Static option arrays can use `as const`, as in `ImageChatPage.tsx::DEFAULT_SIZE_OPTIONS`.

---

## Runtime Validation Reality

The frontend currently relies on backend validation for API payloads and on TypeScript for compile-time checks. There is no
Zod/Yup/io-ts runtime validation layer in `web/src/`.

Existing frontend-side validation is lightweight and UI-oriented:

- Required form fields and file accept attributes in `ProductCreatePage.tsx`.
- Config input types/min/max from backend-provided `ConfigItem` metadata in `SettingsPage.tsx`.
- Allowed image size options derived from `/api/settings` in `ImageChatPage.tsx`.

Do not add a validation library unless a feature truly needs client-side runtime parsing beyond backend errors.

---

## Handling Unknown Data

Use `unknown`, not `any`, for flexible payloads. `CreativeBriefSummary.payload` in `web/src/lib/types.ts` allows known
optional fields and `[key: string]: unknown` for provider-specific additions.

When narrowing errors, follow current patterns:

```ts
if (mutationError instanceof ApiError) {
  setError(mutationError.detail);
  return;
}
setError(mutationError instanceof Error ? mutationError.message : "创建商品失败");
```

---

## Avoid

- `any` in API types, component props, or mutation payloads.
- Duplicating DTO interfaces inside pages instead of importing from `web/src/lib/types.ts`.
- Renaming API fields to camelCase only on the frontend.
- Type assertions that hide missing null checks; prefer `enabled: Boolean(id)` for queries and explicit null rendering.
- Adding new backend response fields without updating `web/src/lib/types.ts` and the relevant UI.


--- FILE: .trellis\spec\guides\code-reuse-thinking-guide.md ---

# Code Reuse Thinking Guide

> **Purpose**: Stop and think before creating new code - does it already exist?

---

## The Problem

**Duplicated code is the #1 source of inconsistency bugs.**

When you copy-paste or rewrite existing logic:
- Bug fixes don't propagate
- Behavior diverges over time
- Codebase becomes harder to understand

---

## Before Writing New Code

### Step 1: Search First

```bash
# Search for similar function names
grep -r "functionName" .

# Search for similar logic
grep -r "keyword" .
```

### Step 2: Ask These Questions

| Question | If Yes... |
|----------|-----------|
| Does a similar function exist? | Use or extend it |
| Is this pattern used elsewhere? | Follow the existing pattern |
| Could this be a shared utility? | Create it in the right place |
| Am I copying code from another file? | **STOP** - extract to shared |

---

## Common Duplication Patterns

### Pattern 1: Copy-Paste Functions

**Bad**: Copying a validation function to another file

**Good**: Extract to shared utilities, import where needed

### Pattern 2: Similar Components

**Bad**: Creating a new component that's 80% similar to existing

**Good**: Extend existing component with props/variants

### Pattern 3: Repeated Constants

**Bad**: Defining the same constant in multiple files

**Good**: Single source of truth, import everywhere

---

## When to Abstract

**Abstract when**:
- Same code appears 3+ times
- Logic is complex enough to have bugs
- Multiple people might need this

**Don't abstract when**:
- Only used once
- Trivial one-liner
- Abstraction would be more complex than duplication

---

## After Batch Modifications

When you've made similar changes to multiple files:

1. **Review**: Did you catch all instances?
2. **Search**: Run grep to find any missed
3. **Consider**: Should this be abstracted?

---

## Gotcha: Asymmetric Mechanisms Producing Same Output

**Problem**: When two different mechanisms must produce the same file set (e.g., recursive directory copy for init vs. manual `files.set()` for update), structural changes (renaming, moving, adding subdirectories) only propagate through the automatic mechanism. The manual one silently drifts.

**Symptom**: Init works perfectly, but update creates files at wrong paths or misses files entirely.

**Prevention checklist**:
- [ ] When migrating directory structures, search for ALL code paths that reference the old structure
- [ ] If one path is auto-derived (glob/copy) and another is manually listed, the manual one needs updating
- [ ] Add a regression test that compares outputs from both mechanisms

---

## Checklist Before Commit

- [ ] Searched for existing similar code
- [ ] No copy-pasted logic that should be shared
- [ ] Constants defined in one place
- [ ] Similar patterns follow same structure


--- FILE: .trellis\spec\guides\cross-layer-thinking-guide.md ---

# Cross-Layer Thinking Guide

> **Purpose**: Think through data flow across layers before implementing.

---

## The Problem

**Most bugs happen at layer boundaries**, not within layers.

Common cross-layer bugs:
- API returns format A, frontend expects format B
- Database stores X, service transforms to Y, but loses data
- Multiple layers implement the same logic differently

---

## Before Implementing Cross-Layer Features

### Step 1: Map the Data Flow

Draw out how data moves:

```
Source → Transform → Store → Retrieve → Transform → Display
```

For each arrow, ask:
- What format is the data in?
- What could go wrong?
- Who is responsible for validation?

### Step 2: Identify Boundaries

| Boundary | Common Issues |
|----------|---------------|
| API ↔ Service | Type mismatches, missing fields |
| Service ↔ Database | Format conversions, null handling |
| Backend ↔ Frontend | Serialization, date formats |
| Component ↔ Component | Props shape changes |

### Step 3: Define Contracts

For each boundary:
- What is the exact input format?
- What is the exact output format?
- What errors can occur?

---

## Common Cross-Layer Mistakes

### Mistake 1: Implicit Format Assumptions

**Bad**: Assuming date format without checking

**Good**: Explicit format conversion at boundaries

### Mistake 2: Scattered Validation

**Bad**: Validating the same thing in multiple layers

**Good**: Validate once at the entry point

### Mistake 3: Leaky Abstractions

**Bad**: Component knows about database schema

**Good**: Each layer only knows its neighbors

---

## Checklist for Cross-Layer Features

Before implementation:
- [ ] Mapped the complete data flow
- [ ] Identified all layer boundaries
- [ ] Defined format at each boundary
- [ ] Decided where validation happens

After implementation:
- [ ] Tested with edge cases (null, empty, invalid)
- [ ] Verified error handling at each boundary
- [ ] Checked data survives round-trip

---

## When to Create Flow Documentation

Create detailed flow docs when:
- Feature spans 3+ layers
- Multiple teams are involved
- Data format is complex
- Feature has caused bugs before


--- FILE: .trellis\spec\guides\index.md ---

# Thinking Guides

> **Purpose**: Expand your thinking to catch things you might not have considered.

---

## Why Thinking Guides?

**Most bugs and tech debt come from "didn't think of that"**, not from lack of skill:

- Didn't think about what happens at layer boundaries → cross-layer bugs
- Didn't think about code patterns repeating → duplicated code everywhere
- Didn't think about edge cases → runtime errors
- Didn't think about future maintainers → unreadable code

These guides help you **ask the right questions before coding**.

---

## Available Guides

| Guide | Purpose | When to Use |
|-------|---------|-------------|
| [Code Reuse Thinking Guide](./code-reuse-thinking-guide.md) | Identify patterns and reduce duplication | When you notice repeated patterns |
| [Cross-Layer Thinking Guide](./cross-layer-thinking-guide.md) | Think through data flow across layers | Features spanning multiple layers |

---

## Quick Reference: Thinking Triggers

### When to Think About Cross-Layer Issues

- [ ] Feature touches 3+ layers (API, Service, Component, Database)
- [ ] Data format changes between layers
- [ ] Multiple consumers need the same data
- [ ] You're not sure where to put some logic

→ Read [Cross-Layer Thinking Guide](./cross-layer-thinking-guide.md)

### When to Think About Code Reuse

- [ ] You're writing similar code to something that exists
- [ ] You see the same pattern repeated 3+ times
- [ ] You're adding a new field to multiple places
- [ ] **You're modifying any constant or config**
- [ ] **You're creating a new utility/helper function** ← Search first!

→ Read [Code Reuse Thinking Guide](./code-reuse-thinking-guide.md)

---

## Pre-Modification Rule (CRITICAL)

> **Before changing ANY value, ALWAYS search first!**

```bash
# Search for the value you're about to change
grep -r "value_to_change" .
```

This single habit prevents most "forgot to update X" bugs.

---

## How to Use This Directory

1. **Before coding**: Skim the relevant thinking guide
2. **During coding**: If something feels repetitive or complex, check the guides
3. **After bugs**: Add new insights to the relevant guide (learn from mistakes)

---

## Contributing

Found a new "didn't think of that" moment? Add it to the relevant guide.

---

**Core Principle**: 30 minutes of thinking saves 3 hours of debugging.


--- FILE: .trellis\workflow.md ---

# Development Workflow

---

## Core Principles

1. **Plan before code** — figure out what to do before you start
2. **Specs injected, not remembered** — guidelines are injected via hook/skill, not recalled from memory
3. **Persist everything** — research, decisions, and lessons all go to files; conversations get compacted, files don't
4. **Incremental development** — one task at a time
5. **Capture learnings** — after each task, review and write new knowledge back to spec

---

## Trellis System

### Developer Identity

On first use, initialize your identity:

```bash
python3 ./.trellis/scripts/init_developer.py <your-name>
```

Creates `.trellis/.developer` (gitignored) + `.trellis/workspace/<your-name>/`.

### Spec System

`.trellis/spec/` holds coding guidelines organized by package and layer.

- `.trellis/spec/<package>/<layer>/index.md` — entry point with **Pre-Development Checklist** + **Quality Check**. Actual guidelines live in the `.md` files it points to.
- `.trellis/spec/guides/index.md` — cross-package thinking guides.

```bash
python3 ./.trellis/scripts/get_context.py --mode packages   # list packages / layers
```

**When to update spec**: new pattern/convention found · bug-fix prevention to codify · new technical decision.

### Task System

Every task has its own directory under `.trellis/tasks/{MM-DD-name}/` holding `task.json`, `prd.md`, optional `design.md`, optional `implement.md`, optional `research/`, and context manifests (`implement.jsonl`, `check.jsonl`) for sub-agent-capable platforms.

```bash
# Task lifecycle
python3 ./.trellis/scripts/task.py create "<title>" [--slug <name>] [--parent <dir>]
python3 ./.trellis/scripts/task.py start <name>          # set active task (session-scoped when available)
python3 ./.trellis/scripts/task.py current --source      # show active task and source
python3 ./.trellis/scripts/task.py finish                # clear active task (triggers after_finish hooks)
python3 ./.trellis/scripts/task.py archive <name>        # move to archive/{year-month}/
python3 ./.trellis/scripts/task.py list [--mine] [--status <s>]
python3 ./.trellis/scripts/task.py list-archive

# Code-spec context (injected into implement/check agents via JSONL).
# `implement.jsonl` / `check.jsonl` are seeded on `task create` for sub-agent-capable
# platforms; the AI curates real spec + research entries during planning when needed.
python3 ./.trellis/scripts/task.py add-context <name> <action> <file> <reason>
python3 ./.trellis/scripts/task.py list-context <name> [action]
python3 ./.trellis/scripts/task.py validate <name>

# Task metadata
python3 ./.trellis/scripts/task.py set-branch <name> <branch>
python3 ./.trellis/scripts/task.py set-base-branch <name> <branch>    # PR target
python3 ./.trellis/scripts/task.py set-scope <name> <scope>

# Hierarchy (parent/child)
python3 ./.trellis/scripts/task.py add-subtask <parent> <child>
python3 ./.trellis/scripts/task.py remove-subtask <parent> <child>

# PR creation
python3 ./.trellis/scripts/task.py create-pr [name] [--dry-run]
```

> Run `python3 ./.trellis/scripts/task.py --help` to see the authoritative, up-to-date list.

**Current-task mechanism**: `task.py create` creates the task directory and (when session identity is available) auto-sets the per-session active-task pointer so the planning breadcrumb fires immediately. `task.py start` writes the same pointer (idempotent if already set) and flips `task.json.status` from `planning` to `in_progress`. State is stored under `.trellis/.runtime/sessions/`. If no context key is available from hook input, `TRELLIS_CONTEXT_ID`, or a platform-native session environment variable, there is no active task and `task.py start` fails with a session identity hint. `task.py finish` deletes the current session file (status unchanged). `task.py archive <task>` writes `status=completed`, moves the directory to `archive/`, and deletes any runtime session files that still point at the archived task.

### Workspace System

Records every AI session for cross-session tracking under `.trellis/workspace/<developer>/`.

- `journal-N.md` — session log. **Max 2000 lines per file**; a new `journal-(N+1).md` is auto-created when exceeded.
- `index.md` — personal index (total sessions, last active).

```bash
python3 ./.trellis/scripts/add_session.py --title "Title" --commit "hash" --summary "Summary"
```

### Context Script

```bash
python3 ./.trellis/scripts/get_context.py                            # full session runtime
python3 ./.trellis/scripts/get_context.py --mode packages            # available packages + spec layers
python3 ./.trellis/scripts/get_context.py --mode phase --step <X.Y>  # detailed guide for a workflow step
```

---

<!--
  WORKFLOW-STATE BREADCRUMB CONTRACT (read this before editing the tag blocks below)

  The [workflow-state:STATUS] blocks embedded in the ## Phase Index section
  below are the SINGLE source of truth for the per-turn `<workflow-state>`
  breadcrumb that every supported AI platform's UserPromptSubmit hook
  reads. inject-workflow-state.py (Python platforms) and
  inject-workflow-state.js (OpenCode plugin) only parse them — there is no
  fallback dict baked into the scripts after v0.5.0-rc.0.

  STATUS charset: [A-Za-z0-9_-]+. When the hook can't find a tag, it
  degrades to a generic "Refer to workflow.md for current step." line —
  intentionally visible so users notice and fix a broken workflow.md.

  INVARIANT (test/regression.test.ts):
    Every workflow-walkthrough step marked `[required · once]` must have a
    matching enforcement line in its phase's [workflow-state:*] block. The
    breadcrumb is the only per-turn channel; if a mandatory step isn't
    mentioned there, the AI silently skips it (Phase 1 planning gate
    skip and Phase 3.4 commit skip both manifested via this gap).

  TAG ↔ PHASE scoping:
    [workflow-state:no_task]      → no active task; before Phase 1
    [workflow-state:planning]     → all of Phase 1 (status='planning')
    [workflow-state:planning-inline] → Codex inline variant of Phase 1
    [workflow-state:in_progress]  → Phase 2 + Phase 3.1-3.4
                                    (status stays 'in_progress' from
                                    task.py start until task.py archive)
    [workflow-state:in_progress-inline] → Codex inline variant of Phase 2/3
    [workflow-state:completed]    → currently DEAD: cmd_archive flips
                                    status and moves the dir in the same
                                    call, so the resolver loses the
                                    pointer (block kept for a future
                                    explicit in_progress→completed
                                    transition)

  Editing checklist:
    - When you change a [workflow-state:STATUS] block, also check the
      matching phase's `[required · once]` walkthrough steps for sync
    - Run `trellis update` after editing to push the new bodies to
      downstream user projects (block-level managed replacement)
    - Full runtime contract:
      .trellis/spec/cli/backend/workflow-state-contract.md
-->

## Phase Index

```
Phase 1: Plan    → classify, get task-creation consent, then write planning artifacts
Phase 2: Execute → implement only after task status is in_progress
Phase 3: Finish  → verify, update spec, commit, and wrap up
```

### Request Triage

- Simple conversation or small task: ask only whether this turn should create a Trellis task. If the user says no, skip Trellis for this session.
- Complex task: ask whether you may create a Trellis task and enter planning. If the user says no, do not do broad inline implementation; explain, clarify scope, or suggest a smaller split.
- User approval to create a task is not approval to start implementation. Planning still happens first.

### Planning Artifacts

- `prd.md` — requirements, constraints, and acceptance criteria. Do not put technical design or execution checklists here.
- `design.md` — technical design for complex tasks: boundaries, contracts, data flow, tradeoffs, compatibility, rollout / rollback shape.
- `implement.md` — execution plan for complex tasks: ordered checklist, validation commands, review gates, and rollback points.
- `implement.jsonl` / `check.jsonl` — spec and research manifests for sub-agent context. They do not replace `implement.md`.
- Lightweight tasks may be PRD-only. Complex tasks must have `prd.md`, `design.md`, and `implement.md` before `task.py start`.

### Parent / Child Task Trees

Use a parent task when one user request contains several independently verifiable deliverables. The parent task owns the source requirement set, the task map, cross-child acceptance criteria, and final integration review; it normally should not be the implementation target unless it also has direct work.

Use child tasks for deliverables that can be planned, implemented, checked, and archived independently. Parent/child structure is not a dependency system: if one child must wait for another, write that ordering in the child `prd.md` / `implement.md` and keep each child's acceptance criteria testable.

Create new children with `task.py create "<title>" --slug <name> --parent <parent-dir>`. Link existing tasks with `task.py add-subtask <parent> <child>`, and unlink mistakes with `task.py remove-subtask <parent> <child>`.

<!-- Per-turn breadcrumb: shown when there is no active task (before Phase 1) -->

[workflow-state:no_task]
No active task. First classify the current turn and ask for task-creation consent before creating any Trellis task.
Simple conversation / small task: ask only whether this turn should create a Trellis task. If the user says no, skip Trellis for this session.
Complex task: ask the user if you can create a Trellis task and enter the planning phase. If the user says no, explain, clarify scope, or suggest a smaller split.
[/workflow-state:no_task]

### Phase 1: Plan
- 1.0 Create task `[required · once]` (only after task-creation consent)
- 1.1 Requirement exploration `[required · repeatable]` (`prd.md`; complex tasks also need `design.md` + `implement.md`)
- 1.2 Research `[optional · repeatable]`
- 1.3 Configure context `[conditional · once]` — Claude Code, Cursor, OpenCode, Codex, Kiro, Gemini, Qoder, CodeBuddy, Copilot, Droid, Pi
- 1.4 Activate task `[required · once]` (review gate, then `task.py start`; status → in_progress)
- 1.5 Completion criteria

<!-- Per-turn breadcrumb: shown throughout Phase 1 (status='planning') -->

[workflow-state:planning]
Load `trellis-brainstorm`; stay in planning.
Lightweight: `prd.md` can be enough. Complex: finish `prd.md`, `design.md`, and `implement.md`; ask for review before `task.py start`.
Multi-deliverable scope: consider a parent task plus independently verifiable child tasks; dependencies must be written in child artifacts, not implied by tree position.
Sub-agent mode: curate `implement.jsonl` and `check.jsonl` as spec/research manifests before start.
[/workflow-state:planning]

<!-- Per-turn breadcrumb: shown throughout Phase 1 when codex.dispatch_mode=inline.
     Codex-only opt-in alternate to [workflow-state:planning]. The main agent
     edits code directly in Phase 2, so jsonl curation is skipped —
     the inline workflow loads `trellis-before-dev` instead of injecting JSONL
     into a sub-agent. -->

[workflow-state:planning-inline]
Load `trellis-brainstorm`; stay in planning.
Lightweight: `prd.md` can be enough. Complex: finish `prd.md`, `design.md`, and `implement.md`; ask for review before `task.py start`.
Multi-deliverable scope: consider a parent task plus independently verifiable child tasks; dependencies must be written in child artifacts, not implied by tree position.
Inline mode: skip jsonl curation; Phase 2 reads artifacts/specs via `trellis-before-dev`.
[/workflow-state:planning-inline]

### Phase 2: Execute
- 2.1 Implement `[required · repeatable]`
- 2.2 Quality check `[required · repeatable]`
- 2.3 Rollback `[on demand]`

<!-- Per-turn breadcrumb: shown while status='in_progress'.
     Scope: all of Phase 2 + Phase 3.1-3.4 (status stays 'in_progress' from
     task.py start until task.py archive; only archive flips it). The body
     therefore must cover every required step from implementation through
     commit, including Phase 3.3 spec update and Phase 3.4 commit. -->

Sub-agent dispatch protocol applies to all platforms and all sub-agents, including class-2 Codex/Copilot/Gemini/Qoder and `trellis-research`: every dispatch prompt starts with `Active task: <task path from task.py current>` before role-specific instructions.

[workflow-state:in_progress]
Tools: `trellis-implement` / `trellis-research` are sub-agent types only (Task/Agent tool, NOT Skill; there is no skill by these names). `trellis-update-spec` is a skill. `trellis-check` exists as both; prefer the Agent form when verifying after code changes.
Flow: `trellis-implement` -> `trellis-check` -> `trellis-update-spec` -> commit (Phase 3.4) -> `/trellis:finish-work`.
Main-session default: dispatch implement/check sub-agents. Sub-agent self-exemption: if already running as `trellis-implement`, do NOT spawn another `trellis-implement` or `trellis-check`; if already running as `trellis-check`, do NOT spawn another `trellis-check` or `trellis-implement`. Dispatch is main session only.
Dispatch prompt starts with `Active task: <task path from task.py current>`. Read context: jsonl entries -> `prd.md` -> `design.md if present` -> `implement.md if present`.
[/workflow-state:in_progress]

<!-- Per-turn breadcrumb: shown while status='in_progress' when
     codex.dispatch_mode=inline. Codex-only opt-in alternate to
     [workflow-state:in_progress]. The main session edits code directly
     instead of dispatching sub-agents. -->

[workflow-state:in_progress-inline]
Flow: `trellis-before-dev` -> edit -> `trellis-check` -> validation -> `trellis-update-spec` -> commit (Phase 3.4) -> `/trellis:finish-work`.
Do not dispatch implement/check sub-agents in inline mode.
Read context: `prd.md` -> `design.md if present` -> `implement.md if present`, plus relevant spec/research loaded by skills.
[/workflow-state:in_progress-inline]

### Phase 3: Finish
- 3.1 Quality verification `[required · repeatable]`
- 3.2 Debug retrospective `[on demand]`
- 3.3 Spec update `[required · once]`
- 3.4 Commit changes `[required · once]`
- 3.5 Wrap-up reminder

<!-- Per-turn breadcrumb: shown while status='completed'.
     Currently DEAD in normal flow: cmd_archive writes status='completed' in
     the same call that moves the task dir to archive/, so the active-task
     resolver loses the pointer and the hook never fires on archived tasks.
     Block preserved for a future status-transition redesign (e.g. an
     explicit in_progress→completed command). Edit through the same spec
     channel as the live blocks. -->

[workflow-state:completed]
Code committed. Run `/trellis:finish-work`; if dirty, return to Phase 3.4 first.
[/workflow-state:completed]

### Rules

1. Identify which Phase you're in, then continue from the next step there
2. Run steps in order inside each Phase; `[required]` steps can't be skipped
3. Phases can roll back (e.g., Execute reveals a prd defect → return to Plan to fix, then re-enter Execute)
4. Steps tagged `[once]` are skipped if the output already exists; don't re-run
5. Artifact presence informs the next step; missing `design.md` / `implement.md` is valid for lightweight tasks and incomplete planning for complex tasks.

### Active Task Routing

When a user request matches one of these intents inside an active task, route first, then load the detailed phase step if needed.

[Claude Code, Cursor, OpenCode, codex-sub-agent, Kiro, Gemini, Qoder, CodeBuddy, Copilot, Droid, Pi]

- Planning or unclear requirements -> `trellis-brainstorm`.
- `in_progress` implementation/check -> dispatch `trellis-implement` / `trellis-check`.
- Repeated debugging -> `trellis-break-loop`; spec updates -> `trellis-update-spec`.

[/Claude Code, Cursor, OpenCode, codex-sub-agent, Kiro, Gemini, Qoder, CodeBuddy, Copilot, Droid, Pi]

[codex-inline, Kilo, Antigravity, Windsurf]

- Planning or unclear requirements -> `trellis-brainstorm`.
- Before editing -> `trellis-before-dev`; after editing -> `trellis-check`.
- Repeated debugging -> `trellis-break-loop`; spec updates -> `trellis-update-spec`.

[/codex-inline, Kilo, Antigravity, Windsurf]

### Guardrails

- Task creation approval is not implementation approval; implementation waits for `task.py start` after artifact review.
- PRD-only is valid for lightweight tasks; complex tasks need `design.md` + `implement.md`.
- Planning must be persisted to task artifacts; checks must run before reporting completion.

### Loading Step Detail

At each step, run this to fetch detailed guidance:

```bash
python3 ./.trellis/scripts/get_context.py --mode phase --step <step>
# e.g. python3 ./.trellis/scripts/get_context.py --mode phase --step 1.1
```

---

## Phase 1: Plan

Goal: classify the request, get task-creation consent when a task is needed, and produce the planning artifacts required before implementation.

#### 1.0 Create task `[required · once]`

Create the task directory only after task-creation consent. The command sets status to `planning`, writes `task.json`, creates a default `prd.md`, and auto-targets the new task when session identity is available:

```bash
python3 ./.trellis/scripts/task.py create "<task title>" --slug <name>
```

`--slug` is the human-readable name only. Do **not** include the `MM-DD-` date prefix; `task.py create` adds that prefix automatically.

For task trees, create the parent task first and then create each child with `--parent <parent-dir>`. Do not start the parent just because children exist; start the child that owns the next independently verifiable deliverable.

After this command succeeds, the per-turn breadcrumb auto-switches to `[workflow-state:planning]`, telling the AI to stay in planning.

Run only `create` here — do not also run `start`. `start` flips status to `in_progress`, which switches the breadcrumb to the implementation phase before planning artifacts are reviewed. Save `start` for step 1.4.

Skip when `python3 ./.trellis/scripts/task.py current --source` already points to a task.

#### 1.1 Requirement exploration `[required · repeatable]`

Load the `trellis-brainstorm` skill and explore requirements interactively with the user per the skill's guidance.

The brainstorm skill will guide you to:
- Ask one question at a time
- Prefer researching over asking the user
- Prefer offering options over open-ended questions
- Update `prd.md` immediately after each user answer
- Split large scopes into a parent task plus child tasks when the deliverables can be verified independently
- Keep `prd.md` focused on requirements and acceptance criteria
- For complex tasks, produce `design.md` and `implement.md` before implementation starts

When considering a parent/child split:
- Use a parent task when one request contains several independently verifiable deliverables.
- Parent tasks own source requirements, child-task mapping, cross-child acceptance criteria, and final integration review.
- Child tasks own actual deliverables that can be planned, implemented, checked, and archived independently.
- Parent/child structure is not a dependency system. If child B depends on child A, write that ordering in child B's `prd.md` / `implement.md`.
- Start the child task that owns the next deliverable. Do not start the parent unless the parent itself has direct implementation work.

Return to this step whenever requirements change and revise the relevant artifact.

#### 1.2 Research `[optional · repeatable]`

Research can happen at any time during requirement exploration. It isn't limited to local code — you can use any available tool (MCP servers, skills, web search, etc.) to look up external information, including third-party library docs, industry practices, API references, etc.

[Claude Code, Cursor, OpenCode, codex-sub-agent, Kiro, Gemini, Qoder, CodeBuddy, Copilot, Droid, Pi]

Spawn the research sub-agent:

- **Agent type**: `trellis-research`
- **Task description**: Research <specific question>
- **Key requirement**: Research output MUST be persisted to `{TASK_DIR}/research/`

[/Claude Code, Cursor, OpenCode, codex-sub-agent, Kiro, Gemini, Qoder, CodeBuddy, Copilot, Droid, Pi]

[codex-inline, Kilo, Antigravity, Windsurf]

Do the research in the main session directly and write findings into `{TASK_DIR}/research/`. (For `codex-inline` this avoids the `fork_turns="none"` isolation that prevents `trellis-research` sub-agents from resolving the active task path.)

[/codex-inline, Kilo, Antigravity, Windsurf]

**Research artifact conventions**:
- One file per research topic (e.g. `research/auth-library-comparison.md`)
- Record third-party library usage examples, API references, version constraints in files
- Note relevant spec file paths you discovered for later reference

Brainstorm and research can interleave freely — pause to research a technical question, then return to talk with the user.

**Key principle**: Research output must be written to files, not left only in the chat. Conversations get compacted; files don't.

#### 1.3 Configure context `[required · once]`

[Claude Code, Cursor, OpenCode, codex-sub-agent, Kiro, Gemini, Qoder, CodeBuddy, Copilot, Droid, Pi]

Curate `implement.jsonl` and `check.jsonl` so the Phase 2 sub-agents get the right spec/research context. These files were seeded on `task create` with a single self-describing `_example` line; your job here is to fill in real entries.

**Location**: `{TASK_DIR}/implement.jsonl` and `{TASK_DIR}/check.jsonl` (already exist).

**Format**: one JSON object per line — `{"file": "<path>", "reason": "<why>"}`. Paths are repo-root relative.

**What to put in**:
- **Spec files** — `.trellis/spec/<package>/<layer>/index.md` and any specific guideline files (`error-handling.md`, `conventions.md`, etc.) relevant to this task
- **Research files** — `{TASK_DIR}/research/*.md` that the sub-agent will need to consult

**What NOT to put in**:
- Code files (`src/**`, `packages/**/*.ts`, etc.) — those are read by the sub-agent during implementation, not pre-registered here
- Files you're about to modify — same reason

**Split between the two files**:
- `implement.jsonl` → specs + research the implement sub-agent needs to write code correctly
- `check.jsonl` → specs for the check sub-agent (quality guidelines, check conventions, same research if needed)

These manifests do not replace `implement.md`. `implement.md` is the human-readable execution plan for a complex task; jsonl files only list context files to inject or load.

**How to discover relevant specs**:

```bash
python3 ./.trellis/scripts/get_context.py --mode packages
```

Lists every package + its spec layers with paths. Pick the entries that match this task's domain.

**How to append entries**:

Either edit the jsonl file directly in your editor, or use:

```bash
python3 ./.trellis/scripts/task.py add-context "$TASK_DIR" implement "<path>" "<reason>"
python3 ./.trellis/scripts/task.py add-context "$TASK_DIR" check "<path>" "<reason>"
```

Delete the seed `_example` line once real entries exist (optional — it's skipped automatically by consumers).

Skip when: `implement.jsonl` and `check.jsonl` have agent-curated entries (the seed row alone doesn't count).

[/Claude Code, Cursor, OpenCode, codex-sub-agent, Kiro, Gemini, Qoder, CodeBuddy, Copilot, Droid, Pi]

[codex-inline, Kilo, Antigravity, Windsurf]

Skip this step. Context is loaded directly by the `trellis-before-dev` skill in Phase 2.

[/codex-inline, Kilo, Antigravity, Windsurf]

#### 1.4 Activate task `[required · once]`

After artifact review, flip the task status to `in_progress`:

```bash
python3 ./.trellis/scripts/task.py start <task-dir>
```

For lightweight tasks, `prd.md` can be enough. For complex tasks, `prd.md`, `design.md`, and `implement.md` must exist and be reviewed before start. On sub-agent-capable platforms, curate jsonl manifests when extra spec or research context is needed; seed-only manifests are tolerated by consumers.

After this command succeeds, the breadcrumb auto-switches to `[workflow-state:in_progress]`, and the rest of Phase 2 / 3 follows.

If `task.py start` errors with a session-identity message (no context key from hook input, `TRELLIS_CONTEXT_ID`, or platform-native session env), follow the hint in the error to set up session identity, then retry.

#### 1.5 Completion criteria

| Condition | Required |
|------|:---:|
| `prd.md` exists | ✅ |
| User confirms task should enter implementation | ✅ |
| `task.py start` has been run (status = in_progress) | ✅ |
| `research/` has artifacts (complex tasks) | recommended |
| `design.md` exists (complex tasks) | ✅ |
| `implement.md` exists (complex tasks) | ✅ |

[Claude Code, Cursor, OpenCode, codex-sub-agent, Kiro, Gemini, Qoder, CodeBuddy, Copilot, Droid, Pi]

| `implement.jsonl` / `check.jsonl` curated when extra spec or research context is needed | recommended |

[/Claude Code, Cursor, OpenCode, codex-sub-agent, Kiro, Gemini, Qoder, CodeBuddy, Copilot, Droid, Pi]

---

## Phase 2: Execute

Goal: turn reviewed planning artifacts into code that passes quality checks.

#### 2.1 Implement `[required · repeatable]`

[Claude Code, Cursor, OpenCode, Gemini, Qoder, CodeBuddy, Copilot, Droid, Pi]

Spawn the implement sub-agent:

- **Agent type**: `trellis-implement`
- **Task description**: Implement the reviewed task artifacts, consulting materials under `{TASK_DIR}/research/`; finish by running project lint and type-check
- **Dispatch prompt guard**: Tell the spawned agent it is already the `trellis-implement` sub-agent and must implement directly, not spawn another `trellis-implement` / `trellis-check`.

The platform hook/plugin auto-handles:
- Reads `implement.jsonl` and injects referenced spec/research files into the agent prompt
- Injects `prd.md`, `design.md` if present, and `implement.md` if present

[/Claude Code, Cursor, OpenCode, Gemini, Qoder, CodeBuddy, Copilot, Droid, Pi]

[codex-sub-agent]

Spawn the implement sub-agent:

- **Agent type**: `trellis-implement`
- **Task description**: Implement the reviewed task artifacts, consulting materials under `{TASK_DIR}/research/`; finish by running project lint and type-check
- **Dispatch prompt guard**: The prompt MUST start with `Active task: <task path>`, then explicitly say the spawned agent is already `trellis-implement` and must implement directly without spawning another `trellis-implement` / `trellis-check`.

The Codex sub-agent definition auto-handles the context load requirement:
- Resolves the active task with `task.py current --source`, then reads `prd.md`, `design.md` if present, and `implement.md` if present
- Reads `implement.jsonl` and requires the agent to load each referenced spec/research file before coding

[/codex-sub-agent]

[Kiro]

Spawn the implement sub-agent:

- **Agent type**: `trellis-implement`
- **Task description**: Implement the reviewed task artifacts, consulting materials under `{TASK_DIR}/research/`; finish by running project lint and type-check
- **Dispatch prompt guard**: Tell the spawned agent it is already the `trellis-implement` sub-agent and must implement directly, not spawn another `trellis-implement` / `trellis-check`.

The platform prelude auto-handles the context load requirement:
- Reads `implement.jsonl` and injects referenced spec/research files into the agent prompt
- Injects `prd.md`, `design.md` if present, and `implement.md` if present

[/Kiro]

[codex-inline, Kilo, Antigravity, Windsurf]

1. Load the `trellis-before-dev` skill to read project guidelines
2. Read `{TASK_DIR}/prd.md`, then `design.md` if present, then `implement.md` if present
3. Consult materials under `{TASK_DIR}/research/`
4. Implement the code per reviewed artifacts
5. Run project lint and type-check

[/codex-inline, Kilo, Antigravity, Windsurf]

#### 2.2 Quality check `[required · repeatable]`

[Claude Code, Cursor, OpenCode, codex-sub-agent, Kiro, Gemini, Qoder, CodeBuddy, Copilot, Droid, Pi]

Spawn the check sub-agent:

- **Agent type**: `trellis-check`
- **Task description**: Review all code changes against specs and task artifacts; fix any findings directly; ensure lint and type-check pass
- **Dispatch prompt guard**: Tell the spawned agent it is already the `trellis-check` sub-agent and must review/fix directly, not spawn another `trellis-check` / `trellis-implement`.

The check agent's job:
- Review code changes against specs
- Review code changes against `prd.md`, `design.md` if present, and `implement.md` if present
- Auto-fix issues it finds
- Run lint and typecheck to verify

[/Claude Code, Cursor, OpenCode, codex-sub-agent, Kiro, Gemini, Qoder, CodeBuddy, Copilot, Droid, Pi]

[codex-inline, Kilo, Antigravity, Windsurf]

Load the `trellis-check` skill and verify the code per its guidance:
- Spec compliance
- lint / type-check / tests
- Cross-layer consistency (when changes span layers)

If issues are found → fix → re-check, until green.

[/codex-inline, Kilo, Antigravity, Windsurf]

#### 2.3 Rollback `[on demand]`

- `check` reveals a prd defect → return to Phase 1, fix `prd.md`, then redo 2.1
- Implementation went wrong → revert code, redo 2.1
- Need more research → research (same as Phase 1.2), write findings into `research/`

---

## Phase 3: Finish

Goal: ensure code quality, capture lessons, record the work.

#### 3.1 Quality verification `[required · repeatable]`

Load the `trellis-check` skill and do a final verification:
- Spec compliance
- lint / type-check / tests
- Cross-layer consistency (when changes span layers)

If issues are found → fix → re-check, until green.

#### 3.2 Debug retrospective `[on demand]`

If this task involved repeated debugging (the same issue was fixed multiple times), load the `trellis-break-loop` skill to:
- Classify the root cause
- Explain why earlier fixes failed
- Propose prevention

The goal is to capture debugging lessons so the same class of issue doesn't recur.

#### 3.3 Spec update `[required · once]`

Load the `trellis-update-spec` skill and review whether this task produced new knowledge worth recording:
- Newly discovered patterns or conventions
- Pitfalls you hit
- New technical decisions

Update the docs under `.trellis/spec/` accordingly. Even if the conclusion is "nothing to update", walk through the judgment.

#### 3.4 Commit changes `[required · once]`

The AI drives a batched commit of this task's code changes so `/finish-work` can run cleanly afterwards. Goal: produce work commits FIRST, then bookkeeping (archive + journal) commits land after — never interleaved.

**Step-by-step**:

1. **Inspect dirty state**:
   ```bash
   git status --porcelain
   ```
   Snapshot every dirty path. If the working tree is clean, skip to 3.5.

2. **Learn commit style** from recent history (so drafted messages blend in):
   ```bash
   git log --oneline -5
   ```
   Note the prefix convention (`feat:` / `fix:` / `chore:` / `docs:` ...), language (中文/English), and length style.

3. **Classify dirty files into two groups**:
   - **AI-edited this session** — files you wrote/edited via Edit/Write/Bash tool calls in this session. You know what changed and why.
   - **Unrecognized** — dirty files you did NOT touch this session (could be the user's manual edits, leftover WIP from a previous session, or unrelated work). Do NOT silently include these.

4. **Draft a commit plan**. Group AI-edited files into logical commits (1 commit per coherent change unit, not 1 commit per file). Each entry: `<commit message>` + file list. List unrecognized files separately at the bottom.

5. **Present the plan once, ask for one-shot confirmation**. Format:
   ```
   Proposed commits (in order):
     1. <message>
        - <file>
        - <file>
     2. <message>
        - <file>

   Unrecognized dirty files (NOT in any commit — confirm include/exclude):
     - <file>
     - <file>

   Reply 'ok' / '行' to execute. Reply with edits, or '我自己来' / 'manual' to abort.
   ```

6. **On confirmation**: run `git add <files>` + `git commit -m "<msg>"` for each batch in order. Do not amend. Do not push.

7. **On rejection** (user replies "不行" / "我自己来" / "manual" / any pushback on the plan): stop. Do not attempt a second plan. The user will commit by hand; you skip ahead to 3.5 once they confirm.

**Rules**:
- No `git commit --amend` anywhere — three-stage three-commit flow (work commits → archive commit → journal commit).
- Never push to remote in this step.
- If the user wants different message wording but accepts the file grouping, edit the message and re-confirm once — but if they reject the grouping, exit to manual mode.
- The batched plan is one prompt; do not prompt per commit.

#### 3.5 Wrap-up reminder

After the above, remind the user they can run `/finish-work` to wrap up (archive the task, record the session).

---

## Customizing Trellis (for forks)

This section is for developers who want to modify the Trellis workflow itself. All customization is done by editing this file; the scripts are parsers only.

### Changing what a step means

Edit the corresponding step's walkthrough body in the Phase 1 / 2 / 3 sections above. Critical invariants:
- No active task must triage first and ask for task-creation consent before creating a Trellis task.
- Planning must distinguish lightweight PRD-only tasks from complex tasks that require `prd.md`, `design.md`, and `implement.md` before start.
- Every required execution path must keep the Phase 3.4 commit reminder reachable before `/trellis:finish-work`.

All tag blocks live in the `## Phase Index` section above, immediately after each phase summary:

| Scope | Corresponding tag |
|---|---|
| No active task (before Phase 1) | `[workflow-state:no_task]` (after the Phase Index ASCII art) |
| All of Phase 1 (task created → ready for implementation) | `[workflow-state:planning]` (after Phase 1 summary) |
| Codex inline Phase 1 | `[workflow-state:planning-inline]` |
| Phase 2 + Phase 3.1–3.4 (implementation + check + wrap-up) | `[workflow-state:in_progress]` (after Phase 2 summary) |
| Codex inline Phase 2 + Phase 3.1–3.4 | `[workflow-state:in_progress-inline]` |
| After Phase 3.5 (archived) | `[workflow-state:completed]` (after Phase 3 summary; **currently DEAD**) |

### Changing the per-turn prompt text

Directly edit the body of the corresponding `[workflow-state:STATUS]` block. After editing, run `trellis update` (if you're a template maintainer) or restart your AI session (if you're customizing your own project) — no script changes required.

### Adding a custom status

Add a new block:

```
[workflow-state:my-status]
your per-turn prompt text
[/workflow-state:my-status]
```

Constraints:
- STATUS charset: `[A-Za-z0-9_-]+` (underscores and hyphens allowed, e.g. `in-review`, `blocked-by-team`)
- A lifecycle hook must write `task.json.status` to your custom value, otherwise the tag is never read
- Lifecycle hooks live in `task.json.hooks.after_*` and bind to one of `after_create / after_start / after_finish / after_archive`

### Adding a lifecycle hook

Add a `hooks` field to your `task.json`:

```json
{
  "hooks": {
    "after_finish": [
      "your-script-or-command-here"
    ]
  }
}
```

Supported events: `after_create / after_start / after_finish / after_archive`. Note that `after_finish` ≠ a status change (it only clears the active-task pointer); use `after_archive` for "task is done" notifications.

### Full contract

For the workflow state machine's runtime contract, the locations of all status writers, pseudo-statuses (`no_task` / `stale_<source_type>`), the hook reachability matrix, and other deep details, see:

- `.trellis/spec/cli/backend/workflow-state-contract.md` — runtime contract + writer table + test invariants
- `.trellis/scripts/inject-workflow-state.py` — actual parser (reads workflow.md only, no embedded text)


--- FILE: AGENTS.md ---

<!-- TRELLIS:START -->
# Trellis Instructions

These instructions are for AI assistants working in this project.

This project is managed by Trellis. The working knowledge you need lives under `.trellis/`:

- `.trellis/workflow.md` — development phases, when to create tasks, skill routing
- `.trellis/spec/` — package- and layer-scoped coding guidelines (read before writing code in a given layer)
- `.trellis/workspace/` — per-developer journals and session traces
- `.trellis/tasks/` — active and archived tasks (PRDs, research, jsonl context)

If a Trellis command is available on your platform (e.g. `/trellis:finish-work`, `/trellis:continue`), prefer it over manual steps. Not every platform exposes every command.

If you're using Codex or another agent-capable tool, additional project-scoped helpers may live in:
- `.agents/skills/` — reusable Trellis skills
- `.codex/agents/` — optional custom subagents

Managed by Trellis. Edits outside this block are preserved; edits inside may be overwritten by a future `trellis update`.

<!-- TRELLIS:END -->
# Repository Guidelines

## Project Structure & Module Organization
ProductFlow is a private single-merchant workspace. The backend lives in `backend/src/productflow_backend/` and uses clear layers: `presentation/` for FastAPI routes and schemas, `application/` for use cases, `domain/` for enums/core concepts, and `infrastructure/` for database, storage, queues, text/image providers, and poster rendering. Alembic migrations are in `backend/alembic/versions/`; backend tests are in `backend/tests/`. The React/Vite app lives in `web/src/`, with pages in `web/src/pages/`, shared UI in `web/src/components/`, and API/type helpers in `web/src/lib/`. Product and architecture notes live in `docs/`.

## Build, Test, and Development Commands
Use the root `justfile` whenever possible:

- `just backend-install` — install backend dependencies with `uv` dev extras.
- `docker compose up -d` — start local PostgreSQL and Redis.
- `just backend-migrate` — apply Alembic migrations with dev env vars.
- `just backend-run` — run the FastAPI API on the dev port.
- `just backend-worker` — run Dramatiq workers for async jobs.
- `just backend-test` — run backend pytest tests.
- `just web-install` — install frontend dependencies with pnpm.
- `just web-dev` — run Vite with the API proxy configured.
- `just web-build` — type-check and build the frontend.

## Coding Style & Naming Conventions
Python targets 3.12 and uses Ruff with 120-character lines plus `E`, `F`, `I`, `UP`, and `B` lint rules. Keep imports sorted, prefer typed functions, and name modules/functions in `snake_case`. React components and pages use `PascalCase` filenames, such as `ProductListPage.tsx`; hooks, helpers, and API functions use `camelCase`. Keep provider-specific code behind infrastructure factories instead of leaking it into routes.

## Testing Guidelines
Backend tests use pytest and are discovered from `backend/tests/` as `test_*.py`. Add workflow-level coverage when changing product, copy, poster, settings, or image-session behavior. Run `just backend-test` before backend commits and `just web-build` before frontend commits. For schema or migration changes, include both an Alembic revision and a regression test where practical.

## Commit & Pull Request Guidelines
Recent history mixes Conventional Commit prefixes (`feat:`, `chore:`) with concise Chinese summaries. Use one focused commit per topic, for example `feat: 增加设置页模型配置`. Pull requests should describe the user-visible change, list verification commands, call out migrations/config changes, and include screenshots for UI updates.

## Documentation Style
Official docs, release notes, PR descriptions, and contribution guidance must stay concrete and verifiable. Avoid templated delivery copy and empty contrast/progress scaffolding:

- Do not use Chinese patterns like “这不是……而是……”, “不是……而是……”, “先把……打通”, or promotional “先……再……”.
- Do not use English patterns like “This is not ..., but ...”, “not ..., but ...”, “establishes the main loop”, or promotional “first ..., then ...”.
- Keep real technical sequencing when it matters, such as command order, migration steps, auto-save before run, and troubleshooting steps.
- State current facts and verified results; label future direction as unimplemented or planned.

## Security & Configuration Tips
Do not commit `.env`, `web/.env`, generated storage, caches, or build output. Keep secrets in files copied from `.env.example` / `web/.env.example`. Runtime database settings may override selected provider/model options, while `DATABASE_URL`, `REDIS_URL`, `SESSION_SECRET`, and `ADMIN_ACCESS_KEY` remain env-only.

## Agent skills

### Issue tracker

Issues and PRDs are tracked in GitHub Issues for `yuqie6/ProductFlow`. See `docs/agents/issue-tracker.md`.

### Triage labels

Triage uses the default five-label vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, and `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Domain documentation uses a single-context layout: root `CONTEXT.md` plus `docs/adr/` when they exist. See `docs/agents/domain.md`.


--- FILE: CHANGELOG.md ---

# Changelog

All notable changes for ProductFlow are recorded here.

## 0.1.0 - 2026-05-02

Initial public self-hosted release for ProductFlow. This entry is the durable release record for `v0.1.0`.

### Added

- Single-admin, self-hosted product creative workspace with access-key login and Cookie-session API access.
- Product list, product creation, product detail workbench, source/reference image upload, and controlled download routes.
- ProductFlow workbench DAG for product context, reference images, copy generation, and image generation.
- Persistent workflow nodes, edges, runs, node-run state, failure reasons, startup recovery, and lightweight workflow status polling.
- Copy generation, editable copy fields, copy confirmation, product history, template poster output, and remote image-provider poster output.
- Reference-image single-slot semantics: manual uploads or generated-image fills replace the current slot image while older assets remain in product history/assets.
- Standalone iterative image sessions with durable generation tasks, queue position, retry/failure state, multiple generated candidates, and product attachment.
- Generated image gallery at `/gallery` for saved iterative-image results with source, product, prompt, size, model, and download metadata.
- Runtime settings page for provider/model selection, image sizes, upload limits, retry/concurrency controls, prompt templates, login gate, business deletion switch, and secrets that are not echoed back.
- Docker Compose self-hosting path for PostgreSQL, Redis, FastAPI backend, Dramatiq worker, and nginx-served Web build.
- Release helpers: `just release-dry-run` for safe validation and `just release` for Compose rebuild/start plus health checks.
- Chinese and English public docs for README, PRD, architecture, roadmap, and user guide.

### Release Boundaries

- ProductFlow 0.1.0 is not a hosted SaaS, public registration system, multi-tenant platform, or team-permission product.
- No hosted model accounts, billing, store authorization, automatic ad/listing pipeline, or video-generation workflow is included.
- No published container image, Helm chart, Kubernetes manifest, or cloud deployment package is included in `v0.1.0`.
- Docker volumes are not deleted by release helpers; `docker compose down -v` is only a manual reset command.

### Verification

Release preparation for `v0.1.0` used the lightweight documentation and build gates:

- `just release-dry-run`
- `just backend-test`
- `just web-build`
- `git diff --check`

The production update entrypoint remains `just release`, which should only be run intentionally on the deployment host.


--- FILE: CONTRIBUTING.en.md ---

# Contributing to ProductFlow

[中文](CONTRIBUTING.md) | English

Thank you for considering contributing code, documentation, or issue reports to ProductFlow. ProductFlow is currently positioned as an open-source self-hosted project, with priority on local reproducibility, truthful documentation, and clear data/secret boundaries.

## Before You Start

1. Read `README.en.md` to understand the project positioning and local startup flow.
2. Read `docs/PRD.en.md` and `docs/ARCHITECTURE.en.md` to understand the current feature boundaries.
3. If you change the backend, consult `.trellis/spec/backend/`.
4. If you change the frontend, consult `.trellis/spec/frontend/`.
5. Do not commit `.env`, `web/.env`, storage, caches, build outputs, logs, or `.trellis/tasks/` / `.trellis/workspace/`.

## Local Development

```bash
cp .env.example .env
cp .env.dev.example .env.dev
cp web/.env.example web/.env
docker compose up -d
just backend-install
just web-install
just backend-migrate
just backend-run
just backend-worker
just web-dev
```

The default `mock` provider does not require a real API key.

## Common Checks

For backend changes, run:

```bash
uv run --directory backend ruff check .
just backend-test
```

For frontend changes, run:

```bash
just web-build
```

For documentation or open-source governance file changes, at least confirm that referenced commands, paths, and configuration files exist.

## Documentation Style

Official docs, release notes, PR descriptions, and contribution guidance should stay concrete and verifiable. Avoid templated delivery copy:

- Do not use empty contrast patterns such as "This is not ..., but ..." or "not ..., but ...".
- Do not use "establishes the main loop" or promotional "first ..., then ..." scaffolding to describe progress.
- Chinese docs should also avoid "这不是……而是……", "不是……而是……", "先把……打通", and promotional "先……再……" scaffolding.
- Keep real technical sequencing when it matters, such as command order, migration steps, auto-save before run, or troubleshooting steps.
- State current facts and verified results; label future direction as unimplemented or planned.

## Code Conventions

- Python targets version 3.12, Ruff line width is 120, and lint rules are defined in `backend/pyproject.toml`.
- The backend keeps the `presentation` / `application` / `domain` / `infrastructure` layering.
- Provider-specific SDK calls should stay in `infrastructure/text` or `infrastructure/image`; routes should not call providers directly.
- Frontend API requests are centralized in `web/src/lib/api.ts`, and DTO types are centralized in `web/src/lib/types.ts`.
- Database schema changes require an Alembic migration and should include regression coverage where practical.
- Changes involving upload, storage, secrets, or provider keys should consider security boundaries first.

## Commits and PRs

Prefer one focused topic per PR. The PR description should include:

- User-visible changes.
- Key implementation notes.
- Whether migrations or configuration changes are included.
- Verification commands run and their results.
- Screenshots or recordings for UI changes, when applicable.

Formal version tags use annotated tags with bilingual Chinese/English messages. The tag message should include release positioning, main contents, verification commands, and explicit boundaries; do not keep one-off release-preparation checklists as repository docs. Suggested format:

```text
ProductFlow vX.Y.Z

中文：
<一句话版本定位>

包含：
- ...

已验证：
- ...

边界：
- ...

English:
<One-sentence release positioning>

Includes:
- ...

Verified:
- ...

Boundaries:
- ...
```

## Trellis Directory Notes

The repository keeps `.trellis/spec/`, `.trellis/workflow.md`, and `.trellis/scripts/` as development specifications and task tooling. `.trellis/tasks/` and `.trellis/workspace/` are local task/developer records and should not be committed.


--- FILE: CONTRIBUTING.md ---

# Contributing to ProductFlow

[中文](CONTRIBUTING.md) | [English](CONTRIBUTING.en.md)

感谢你考虑为 ProductFlow 贡献代码、文档或问题反馈。ProductFlow 当前定位为开源自托管项目，优先保证本地可运行、文档真实、数据和密钥边界清晰。

## 开始前

1. 阅读 `README.md`，确认项目定位和本地启动方式。
2. 阅读 `docs/PRD.md` 和 `docs/ARCHITECTURE.md`，理解当前功能边界。
3. 如果要改后端，参考 `.trellis/spec/backend/`。
4. 如果要改前端，参考 `.trellis/spec/frontend/`。
5. 不要提交 `.env`、`web/.env`、storage、缓存、构建产物、日志或 `.trellis/tasks/` / `.trellis/workspace/`。

## 本地开发

```bash
cp .env.example .env
cp .env.dev.example .env.dev
cp web/.env.example web/.env
docker compose up -d
just backend-install
just web-install
just backend-migrate
just backend-run
just backend-worker
just web-dev
```

默认 `mock` provider 不需要真实 API key。

## 常用检查

后端变更建议运行：

```bash
uv run --directory backend ruff check .
just backend-test
```

前端变更建议运行：

```bash
just web-build
```

文档或开源治理文件变更至少应确认引用的命令、路径和配置文件存在。

## 文档风格

正式文档、发布说明、PR 描述和贡献说明应保持具体、可验证，避免模板化交付腔：

- 不使用“这不是……而是……”“不是……而是……”这类空泛对比句。
- 不使用“先把……打通”或宣传式“先……再……”脚手架来包装进度。
- 英文文档不使用 “This is not ..., but ...”“not ..., but ...”“establishes the main loop” 或宣传式 “first ..., then ...”。
- 可以保留真实技术顺序，例如命令执行顺序、迁移步骤、自动保存后运行、故障排查步骤。
- 写当前事实和已验证结果；未来方向要明确标为未实现或计划。

## 代码约定

- Python 目标版本为 3.12，Ruff 行宽 120，lint 规则见 `backend/pyproject.toml`。
- 后端保持 `presentation` / `application` / `domain` / `infrastructure` 分层。
- Provider 具体 SDK 调用应留在 `infrastructure/text` 或 `infrastructure/image`，不要从路由直接调用。
- 前端 API 请求集中在 `web/src/lib/api.ts`，DTO 类型集中在 `web/src/lib/types.ts`。
- 数据库 schema 变更需要 Alembic migration，并尽量补回归测试。
- 涉及上传、storage、secret、provider key 的改动要优先考虑安全边界。

## 提交和 PR

建议一个 PR 聚焦一个主题。PR 描述请包含：

- 用户可见变化。
- 关键实现说明。
- 是否包含迁移或配置变更。
- 已运行的验证命令和结果。
- UI 变更截图或录屏（如适用）。

正式版本 tag 使用 annotated tag，并写中英双语说明。tag message 应包含版本定位、主要包含内容、已验证命令和明确边界；不要把一次性的发布准备清单写进仓库文档。建议格式：

```text
ProductFlow vX.Y.Z

中文：
<一句话版本定位>

包含：
- ...

已验证：
- ...

边界：
- ...

English:
<One-sentence release positioning>

Includes:
- ...

Verified:
- ...

Boundaries:
- ...
```

## Trellis 目录说明

仓库保留 `.trellis/spec/`、`.trellis/workflow.md` 和 `.trellis/scripts/` 作为开发规范和任务工具。`.trellis/tasks/` 和 `.trellis/workspace/` 属于本地任务/开发者记录，不应提交。


--- FILE: docs\agents\domain.md ---

# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Layout

This repo uses a single-context domain documentation layout.

Expected files, when they exist:

- `CONTEXT.md` at the repo root
- `docs/adr/` for architectural decision records

These files do not need to exist before a skill can run. If they are absent, proceed silently. Producer skills such as `/grill-with-docs` can create them later when real terminology or decisions need to be recorded.

## Before exploring, read these

- `CONTEXT.md` at the repo root, if it exists.
- ADRs under `docs/adr/` that touch the area about to be changed, if any exist.

## Use the glossary's vocabulary

When output names a domain concept in an issue title, refactor proposal, hypothesis, or test name, use the term as defined in `CONTEXT.md`.

If the concept is missing from the glossary, either reconsider whether that term belongs in the project language, or note it as a gap for `/grill-with-docs`.

## Flag ADR conflicts

If output contradicts an existing ADR, surface it explicitly instead of silently overriding the decision.


--- FILE: docs\agents\issue-tracker.md ---

# Issue tracker: GitHub

Issues and PRDs for this repo live as GitHub issues. Use the `gh` CLI for all operations.

## Conventions

- **Create an issue**: `gh issue create --title "..." --body "..."`. Use a heredoc for multi-line bodies.
- **Read an issue**: `gh issue view <number> --comments`, filtering comments by `jq` and also fetching labels.
- **List issues**: `gh issue list --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'` with appropriate `--label` and `--state` filters.
- **Comment on an issue**: `gh issue comment <number> --body "..."`
- **Apply / remove labels**: `gh issue edit <number> --add-label "..."` / `--remove-label "..."`
- **Close**: `gh issue close <number> --comment "..."`

Infer the repo from `git remote -v` - `gh` does this automatically when run inside a clone.

## When a skill says "publish to the issue tracker"

Create a GitHub issue.

## When a skill says "fetch the relevant ticket"

Run `gh issue view <number> --comments`.


--- FILE: docs\agents\triage-labels.md ---

# Triage Labels

The skills speak in terms of five canonical triage roles. This file maps those roles to the actual label strings used in this repo's issue tracker.

| Label in mattpocock/skills | Label in our tracker | Meaning                                  |
| -------------------------- | -------------------- | ---------------------------------------- |
| `needs-triage`             | `needs-triage`       | Maintainer needs to evaluate this issue  |
| `needs-info`               | `needs-info`         | Waiting on reporter for more information |
| `ready-for-agent`          | `ready-for-agent`    | Fully specified, ready for an AFK agent  |
| `ready-for-human`          | `ready-for-human`    | Requires human implementation            |
| `wontfix`                  | `wontfix`            | Will not be actioned                     |

When a skill mentions a role, use the corresponding label string from this table.

Edit the right-hand column to match whatever vocabulary you actually use.


--- FILE: docs\ARCHITECTURE.en.md ---

# ProductFlow Architecture

[中文](ARCHITECTURE.md) | English

Current architecture health, completed cleanup, and remaining risks are tracked in `docs/ARCHITECTURE_HEALTH_REVIEW.en.md`; this document stays focused on system structure.

## 1. System Overview

ProductFlow consists of the frontend, backend API, background worker, PostgreSQL, Redis, and local file storage:

```text
React/Vite web
  -> FastAPI backend
    -> PostgreSQL metadata
    -> Redis/Dramatiq queue
    -> local storage files
    -> text provider / image provider
  -> Dramatiq worker
    -> same database, queue, storage and providers
```

The default self-hosted path is driven by the root `docker-compose.yml`. `docker compose up -d --build` builds and starts PostgreSQL, Redis, the FastAPI backend, the Dramatiq worker, and the nginx-served Web static site. API/worker containers connect to dependencies through `productflow-postgres:5432` and `productflow-redis:6379`, and share persistent storage mounted at `/app/storage`. When `STORAGE_HOST_PATH` is not set, storage uses the Docker named volume `productflow-storage`. When migrating from an older systemd production environment, you can set the host-only variable `STORAGE_HOST_PATH=/home/cot/ProductFlow-release/shared/storage` to bind-mount an existing host storage directory to `/app/storage`; the runtime container still keeps `STORAGE_ROOT=/app/storage`. The backend container runs Alembic migrations before starting `uvicorn`.

The production update entrypoint is `just release`, which calls `scripts/release.sh` to validate Compose configuration, stop legacy user-level systemd services (`productflow-backend.service`, `productflow-worker.service`, `productflow-web.service`, used to free old release ports 29280/29281), run `docker compose up -d --build --remove-orphans`, and perform HTTP health checks. `just release-dry-run` only validates configuration and prints the plan; it does not stop old services, build, or start containers. Normal updates do not delete Docker volumes.

Local hot-reload development is still driven by the root `justfile`: you can start only `productflow-postgres` and `productflow-redis`, then run the API, worker, and frontend separately with `just backend-run`, `just backend-worker`, and `just web-dev`. The development environment uses `STORAGE_ROOT=./backend/storage-dev` from `.env.dev`, isolated from production Compose storage. Do not start local development processes by shell-sourcing production `.env`.

## 2. Backend Layering

Backend code lives under `backend/src/productflow_backend/` and is organized by layer:

- `presentation/`: FastAPI app, routes, auth dependencies, Pydantic schemas, and upload validation.
- `application/`: use-case logic for products, copy, posters, gallery, image sessions, and product workflows. Product workflow logic is split into graph / mutations / query / execution / context / artifacts / dependencies modules, with `product_workflows.py` kept as the compatibility facade.
- `domain/`: stable enums such as task status, asset type, and workflow node type.
- `infrastructure/`: SQLAlchemy models/session, queue, storage, text/image providers, and poster renderer.
- `workers.py`: Dramatiq actor entrypoint.
- `config.py`: environment configuration, runtime configuration definitions, and database override reading.

The route layer only handles input adaptation, authentication, error mapping, and serialization. Provider calls, job state changes, and workflow progression stay inside application/infrastructure boundaries.

## 3. Frontend Structure

Frontend code lives under `web/src/`:

- `pages/`: login, product list, product creation, product detail, gallery, help, settings, and image-session pages (current routes include `/image-chat`, `/products/:productId/image-chat`, `/gallery`, `/help`, and `/settings`).
- `components/`: shared UI such as the top navigation, status tags, and image drag-and-drop upload area.
- `lib/api.ts`: centralized REST API request wrapper.
- `lib/types.ts`: frontend DTO types that must stay aligned with backend schemas.

The frontend uses TanStack Query for server state. The product detail page and iterative image page use lightweight status polling while work is active:

- Iterative image generation polls `['image-session-status', selectedSessionId]`, merges task state only, then refreshes the full session after completion.
- Product workflows poll `['product-workflow-status', productId]`, merge node/run state only, then refresh full workflow and product artifact queries after completion.

Do not reintroduce active polling for complete `ImageSessionDetailResponse` or complete `ProductWorkflowResponse`; those payloads include image history, node configuration, artifact references, and run records, and high-frequency refresh increases frontend render cost and backend serialization work.

The product detail page is currently the ProductFlow workbench: the canvas handles nodes, edges, zoom, pan, node dragging, box selection, and multi-select. On desktop, the right sidebar handles Details, Runs, Library, and Templates. On mobile, a bottom toolbar carries the workflow run entrypoint plus Single node, Templates, Details, Runs, and Library entrypoints, and a bottom sheet renders those panel contents. The mobile canvas has local `browse` / `edit` / `select` interaction modes: `browse` handles one-finger pan, node tap selection, and two-finger pinch zoom; `edit` allows touch/pen node dragging and edge creation; `select` toggles multi-select by tapping nodes. Canvas zoom ratio and desktop sidebar width are browser-local preferences, while mobile mode and sheet openness are page-local UI state. Workflow nodes, edges, run state, and artifacts remain database-backed.

## 4. Main Data Model Lines

Traditional product creative chain:

```text
Product
  -> SourceAsset(original/reference/processed)
  -> CreativeBrief
  -> CopySet(draft/confirmed)
  -> PosterVariant(main_image/promo_poster)
```

Iterative image-generation chain:

```text
ImageSession
  -> ImageSessionAsset(reference_upload/generated_image)
  -> ImageSessionRound(one generated candidate per row)
  -> ImageSessionGenerationTask(durable async generation task)
  -> optional Product attachment
  -> optional ImageGalleryEntry
```

Product DAG workflow chain:

```text
ProductWorkflow
  -> WorkflowNode(product_context/reference_image/copy_generation/image_generation)
  -> WorkflowEdge
  -> WorkflowRun
  -> WorkflowNodeRun
```

Canvas template chain:

```text
CanvasTemplate(builtin full_canvas)
  -> product creation or workflow template insertion

UserCanvasTemplate(node_group)
  -> reusable selected workflow nodes and internal edges
```

PostgreSQL is the source of truth for metadata and run state. Redis/Dramatiq is only responsible for dispatching background execution messages.

Workflow node semantics for users:

- `product_context`: product information entrypoint for one product workflow.
- `reference_image`: a single current reference image slot; manual upload or upstream image generation replaces the current image, while old assets remain in product history/assets.
- `copy_generation`: copy generation and editable structured copy. Later image generation reads structured copy context directly.
- `image_generation`: image-generation trigger/configuration node; image artifacts are written into downstream reference image nodes instead of being displayed on the image-generation node itself.

Canvas template boundaries:

- Built-in `full_canvas` scenario templates can initialize a complete workflow during product creation and can also be
  inserted into an existing product workbench.
- When a built-in scenario template is inserted into an existing workbench, the template `product_context` node is mapped
  to the active workflow's existing product node instead of creating a second product node.
- User node-group templates are saved from selected nodes and persist only reusable configuration plus internal edges between selected nodes; they do not store product details, generated images, or copy outputs.

## 5. Async Jobs and Recovery

There are currently two background execution entrypoints:

1. `WorkflowRun`: used for product DAG workflow execution.
2. `ImageSessionGenerationTask`: used for iterative image generation.

Shared principles:

- Database records are persisted first; Redis messages are only recoverable dispatch attempts.
- Database constraints prevent duplicate active workflow runs for the same product.
- If enqueue fails, the newly created run/task is marked failed to avoid stuck active state.
- API startup recovers queued unfinished tasks/workflows.
- Worker startup can reset stale running state and re-dispatch work.
- Workflow runs and iterative image-generation tasks serialize `is_retryable` / `is_cancelable`, and the frontend uses those flags to show retry and cancel actions.
- Image-generation failures are classified into user-readable categories covering provider quota/rate limit, content policy, network interruption, request timeout, provider service errors, and unsupported parameters.
- Iterative image generation no longer treats a user-configurable hard total timeout as product semantics. Running tasks persist `progress_updated_at`, completed candidate count, current candidate, and provider response state; stale-running recovery uses the latest progress heartbeat for idle detection and only falls back to `started_at` for older rows.
- The iterative image worker's Dramatiq `time_limit` remains only as an internal failsafe, not as a user-tunable generation deadline.
- Dramatiq actors should no-op on duplicate messages for terminal/currently-running records.
- The global generation concurrency limit is enforced by counting active `WorkflowRun` and `ImageSessionGenerationTask` rows in the database.
- `/api/generation-queue` returns the global durable queue overview; iterative image status responses include the current task's queue position.

Related entrypoints:

- `productflow_backend.infrastructure.queue.recover_unfinished_workflow_runs`
- `productflow_backend.infrastructure.queue.recover_unfinished_image_session_generation_tasks`
- `productflow_backend.workers`

## 6. Provider Architecture

ProductFlow separates model capabilities by modality.

Text providers live under `infrastructure/text/` with a unified interface:

- `generate_brief(product_input)`
- `generate_copy(product_input, brief, config, reference_images=None)`

Current implementations:

- `mock`
- `openai` (Responses API compatible)

Image providers live under `infrastructure/image/` and serve poster generation and image sessions. Current implementations:

- `mock`
- `openai_responses` (Responses API `image_generation` tool, supporting `input_image`; iterative image generation prefers background response + retrieve polling and writes provider status into task progress)
- `openai_images` (Images API `images.generate` / `images.edit` compatible interface; it does not use Responses `previous_response_id`, and ProductFlow explicitly sends the selected base image plus references for iterative image sessions)
- `google_gemini_image` (Google Gemini native `generateContent` image API through the official `google-genai` SDK; ProductFlow explicitly sends the selected base image plus references for iterative image sessions)

Provider selection is controlled by `provider_profiles`, `provider_bindings`, and corresponding factories. Legacy
`TEXT_*` / `IMAGE_*` environment values are only first-migration input; runtime resolvers read interface kind,
connection data, and models from provider profiles and purpose bindings. Routes do not directly depend on concrete SDKs.

## 7. Poster Generation

Posters have two modes:

- `template`: render with local Pillow templates, suitable for development/testing without image model keys.
- `generated`: package confirmed copy, product images, and reference images as image-provider input and generate the result with a remote model.

Both modes target two artifact types:

- `main_image`: 1:1 ecommerce main image.
- `promo_poster`: 3:4 promotional poster.

## 8. Configuration Layers

Configuration is split into two categories:

1. Env-only infrastructure configuration: `DATABASE_URL`, `REDIS_URL`, `SESSION_SECRET`, `ADMIN_ACCESS_KEY`, `SETTINGS_ACCESS_TOKEN`, and similar values. These must be available before the application can access the database, or they protect the secondary unlock for the settings page, so runtime DB overrides are not supported.
2. Runtime business configuration: provider, model, image size, upload limits, task retry, global generation concurrency limit, poster mode, prompt templates, login-gate switch, business deletion switch, and similar values. They can be provided as defaults by `.env` / `.env.dev`, or written to `app_settings` through `/api/settings` after login and settings-page unlock.

Secret configuration values are not echoed back in API responses.

The login gate `admin_access_required` is enabled by default. When enabled, private APIs require an admin marker in the Cookie session through `require_admin`, and invalid `ADMIN_ACCESS_KEY` values still return 401. When disabled, normal workspace/private APIs can be used without the admin key, and `GET /api/auth/session` returns `authenticated=true` and `access_required=false`; complete `/api/settings` reads/writes still require the independent `SETTINGS_ACCESS_TOKEN` unlock.

The business deletion switch `deletion_enabled` is disabled by default. When disabled, the backend rejects whole-product deletion and whole iterative image-session deletion at the route boundary, so demo sites do not lose evidence after problematic content is deleted. Workflow node/edge editing and reference-image deletion are not affected. `DELETE /api/auth/session` and restoring database overrides from the settings page are not part of business deletion protection.

Prompt template overrides cover product understanding, copy generation, workbench image generation, and iterative image generation. Infrastructure configuration and secret reading stay behind backend boundaries; the frontend only displays configuration items, sources, and save state.

## 9. File Storage and Downloads

Local files are managed by `LocalStorage` in `infrastructure/storage.py`. It constrains relative paths under the configured `STORAGE_ROOT` and rejects absolute paths or path traversal. In production Compose containers, `STORAGE_ROOT` is fixed to `/app/storage`; `STORAGE_HOST_PATH` only controls the host bind-mount source and should not be passed into application logic as a replacement for `STORAGE_ROOT`.

User-downloadable files are read through controlled routes, for example:

- `/api/posters/{poster_id}/download`
- `/api/source-assets/{asset_id}/download`
- `/api/image-session-assets/{asset_id}/download`

Do not bypass the storage service by directly concatenating user-controlled paths.

## 10. Security Boundaries

The current security model is "single-admin self-hosted":

- Admin-key login, not public registration.
- `ADMIN_ACCESS_KEY` is read only from environment variables and does not enter database configuration. The login gate can be disabled through the `admin_access_required` runtime switch and stays enabled by default.
- The settings page uses an independent `SETTINGS_ACCESS_TOKEN` for secondary unlock; the session stores only the unlocked marker, not the plaintext token. Disabling the login gate does not disable this secondary unlock.
- Session cookies are signed with `SESSION_SECRET`.
- CORS is controlled by `BACKEND_CORS_ORIGINS`.
- Uploaded files have MIME, size, pixel, and count limits.
- Provider API keys are stored in env or database configuration, and APIs do not echo secrets.

Currently not provided: multi-user isolation, object-level permissions, audit logs, or production WAF configuration.


--- FILE: docs\ARCHITECTURE.md ---

# ProductFlow Architecture

[中文](ARCHITECTURE.md) | [English](ARCHITECTURE.en.md)

当前架构健康度、已完成治理和剩余风险见 `docs/ARCHITECTURE_HEALTH_REVIEW.md`；本文保持为系统结构说明。

## 1. 系统概览

ProductFlow 由前端、后端 API、后台 worker、PostgreSQL、Redis 和本地文件存储组成：

```text
React/Vite web
  -> FastAPI backend
    -> PostgreSQL metadata
    -> Redis/Dramatiq queue
    -> local storage files
    -> text provider / image provider
  -> Dramatiq worker
    -> same database, queue, storage and providers
```

默认自托管路径由根目录 `docker-compose.yml` 驱动。`docker compose up -d --build` 会构建并启动 PostgreSQL、Redis、FastAPI 后端、Dramatiq worker 和 nginx-served Web 静态站点；API/worker 在容器内通过 `productflow-postgres:5432` 与 `productflow-redis:6379` 连接依赖，并共享挂载到容器 `/app/storage` 的持久化 storage。未设置 `STORAGE_HOST_PATH` 时，storage 使用 Docker named volume `productflow-storage`；迁移旧 systemd 生产环境时，可以设置 host-only 变量 `STORAGE_HOST_PATH=/home/cot/ProductFlow-release/shared/storage` 将既有宿主机 storage 目录 bind-mount 到 `/app/storage`，容器运行时仍保持 `STORAGE_ROOT=/app/storage`。后端容器启动时先执行 Alembic 迁移，再启动 `uvicorn`。

生产更新入口是 `just release`，底层调用 `scripts/release.sh` 执行 Compose 配置校验、停止 legacy user-level systemd 服务（`productflow-backend.service`、`productflow-worker.service`、`productflow-web.service`，用于释放旧发布占用的 29280/29281 端口）、`docker compose up -d --build --remove-orphans` 和 HTTP health checks。`just release-dry-run` 只做配置校验与计划输出，不停止旧服务、不构建、不启动容器。普通更新不会删除 Docker volumes。

本地热重载开发仍由根目录 `justfile` 驱动：可以只启动 `productflow-postgres` 与 `productflow-redis`，API、worker、前端分别由 `just backend-run`、`just backend-worker`、`just web-dev` 启动。开发环境使用 `.env.dev` 中的 `STORAGE_ROOT=./backend/storage-dev`，与生产 Compose storage 隔离；不要通过 shell-sourcing 生产 `.env` 来启动本地开发进程。

## 2. 后端分层

后端代码位于 `backend/src/productflow_backend/`，按以下层组织：

- `presentation/`：FastAPI app、路由、鉴权依赖、Pydantic schemas、上传校验。
- `application/`：商品、文案、海报、画廊、图片会话、商品工作流等用例逻辑。商品工作流已拆成 graph /
  mutations / query / execution / context / artifacts / dependencies 等 page-facing use case 模块，由
  `product_workflows.py` 作为兼容 facade 对外暴露。
- `domain/`：稳定枚举，如任务状态、素材类型、工作流节点类型。
- `infrastructure/`：SQLAlchemy models/session、队列、storage、text/image provider、海报 renderer。
- `workers.py`：Dramatiq actor 入口。
- `config.py`：环境变量配置、运行时配置定义、数据库覆盖读取。

路由层只做输入适配、鉴权、错误映射和序列化；provider 调用、任务状态变更、工作流推进都在 application/infrastructure 边界内完成。

## 3. 前端结构

前端代码位于 `web/src/`：

- `pages/`：登录、商品列表、创建商品、商品详情、画廊、帮助、设置、图片会话页面（当前路由包括 `/image-chat`、
  `/products/:productId/image-chat`、`/gallery`、`/help` 和 `/settings`）。
- `components/`：共享 UI，如顶栏、状态标签和图片拖拽上传区。
- `lib/api.ts`：集中封装 REST API 请求。
- `lib/types.ts`：前端 DTO 类型，需与后端 schemas 保持一致。

前端使用 TanStack Query 管理服务端状态。商品详情页和连续生图页对运行中状态采用轻量 status 轮询：

- 连续生图运行中轮询 `['image-session-status', selectedSessionId]`，只合并任务状态，完成后再刷新完整 session。
- 商品工作流运行中轮询 `['product-workflow-status', productId]`，只合并 node/run 状态，完成后再刷新完整 workflow
  和商品产物查询。

不要重新给完整 `ImageSessionDetailResponse` 或完整 `ProductWorkflowResponse` 加 active 轮询；它们包含历史图片、
节点配置、产物引用和运行记录，运行中高频刷新会放大前端渲染和后端序列化压力。

商品详情页当前是 ProductFlow 工作台：画布负责节点、连接线、缩放、平移、节点拖拽、框选和多选。桌面端右侧侧栏负责详情、日志、图库和模板；移动端用底部工具栏承载运行入口、单节点、模板、详情、日志和图库入口，并用底部面板展示这些面板内容。移动端画布有 `browse` / `edit` / `select` 三种本地交互模式：`browse` 用于单指平移、点选节点和双指缩放；`edit` 允许触控/触控笔拖动节点和创建连线；`select` 用点按切换多选。画布缩放比例和桌面侧栏宽度是浏览器本地偏好，移动端模式和底部面板开合是页面本地 UI 状态；工作流节点、连接、运行状态和产物仍以数据库为准。

## 4. 数据模型主线

传统商品素材链路：

```text
Product
  -> SourceAsset(original/reference/processed)
  -> CreativeBrief
  -> CopySet(draft/confirmed)
  -> PosterVariant(main_image/promo_poster)
```

连续生图链路：

```text
ImageSession
  -> ImageSessionAsset(reference_upload/generated_image)
  -> ImageSessionRound(one generated candidate per row)
  -> ImageSessionGenerationTask(durable async generation task)
  -> optional Product attachment
  -> optional ImageGalleryEntry
```

商品 DAG 工作流链路：

```text
ProductWorkflow
  -> WorkflowNode(product_context/reference_image/copy_generation/image_generation)
  -> WorkflowEdge
  -> WorkflowRun
  -> WorkflowNodeRun
```

画布模板链路：

```text
CanvasTemplate(builtin full_canvas)
  -> product creation or workflow template insertion

UserCanvasTemplate(node_group)
  -> reusable selected workflow nodes and internal edges
```

PostgreSQL 是元数据和运行状态的权威存储；Redis/Dramatiq 只负责投递后台执行消息。

工作流节点的用户语义：

- `product_context`：一个商品工作流的商品资料入口。
- `reference_image`：单张当前参考图槽位；手动上传或上游生图填充会替换当前图，旧素材保留在商品历史/素材表。
- `copy_generation`：文案生成和可编辑结构化文案；后续生图直接读取结构化文案上下文。
- `image_generation`：生图触发/配置节点；图片产物填充到下游参考图节点，生图节点本身只保存触发与配置语义。

画布模板的边界：

- 内置 `full_canvas` 场景模板可在创建商品时初始化完整工作流，也可在已有商品工作台中追加同一套场景模板。
- 追加内置场景模板时，模板里的 `product_context` 会复用当前活动工作流已有的商品资料节点，不会创建第二个商品节点。
- 用户节点组模板由多选节点保存而来，只持久化可复用配置和选中节点之间的内部连线，不保存商品资料、生成图片或文案产物。

## 5. 异步任务与恢复

当前有两套后台执行入口：

1. `WorkflowRun`：用于商品 DAG 工作流执行。
2. `ImageSessionGenerationTask`：用于连续生图异步生成。

共同原则：

- 数据库记录先落地，Redis 消息只是可恢复的投递尝试。
- 同一商品工作流通过数据库约束避免重复 active run。
- enqueue 失败时会把新建 run 标记为失败，避免 active 状态卡死。
- API 启动时会恢复 queued 的未完成任务/工作流。
- worker 启动时可重置 stale running 状态后重新投递。
- 工作流运行和连续生图任务都会序列化 `is_retryable` / `is_cancelable`，前端据此展示重试和取消入口。
- 图片生成失败会先做用户可读分类，覆盖供应商限流/配额、内容策略、网络中断、请求超时、服务异常和参数不支持等常见情况。
- 连续生图不再用用户可配置的硬总超时作为产品语义。运行中任务会持久化 `progress_updated_at`、
  `completed_candidates`、当前候选和 provider response 状态；stale running 恢复按最近 progress heartbeat
  判断 idle，旧行才回退到 `started_at`。
- 连续生图 worker 的 Dramatiq `time_limit` 只保留为内部 failsafe，避免进程永久占用，不作为用户可调的生成总时限。
- Dramatiq actor 对 terminal/currently-running 的重复消息应 no-op。
- 全局生成并发上限通过数据库中的 active `WorkflowRun`、`ImageSessionGenerationTask` 计数实现。
- `/api/generation-queue` 返回全局 durable 队列概览；连续生图 status 响应会带回当前任务的队列位置。

相关入口：

- `productflow_backend.infrastructure.queue.recover_unfinished_workflow_runs`
- `productflow_backend.infrastructure.queue.recover_unfinished_image_session_generation_tasks`
- `productflow_backend.workers`

## 6. Provider 架构

ProductFlow 把模型能力按模态拆分。

文本 provider 位于 `infrastructure/text/`，统一接口为：

- `generate_brief(product_input)`
- `generate_copy(product_input, brief, config, reference_images=None)`

当前实现：

- `mock`
- `openai`（Responses API 兼容）

图片 provider 位于 `infrastructure/image/`，统一服务于海报生成和图片会话。当前实现：

- `mock`
- `openai_responses`（Responses API `image_generation` 工具，支持 `input_image`；连续生图优先使用 background
  response + retrieve polling，把 provider status 写入任务 progress）
- `openai_images`（Images API `images.generate` / `images.edit` 兼容接口；不使用 Responses
  `previous_response_id`，连续生图由 ProductFlow 显式传入所选基图和参考图）
- `google_gemini_image`（Google Gemini native `generateContent` 图片接口，通过官方 `google-genai` SDK 调用；
  连续生图由 ProductFlow 显式传入所选基图和参考图）

Provider 选择由 `provider_profiles`、`provider_bindings` 和对应 factory 控制。旧 `TEXT_*` / `IMAGE_*`
环境变量只作为首次迁移输入；运行时 resolver 从供应商档案和用途绑定读取接口类型、连接信息和模型。路由不直接依赖具体 SDK。

## 7. 海报生成

海报生成保留两个运行模式，工作流生图会在图片用途绑定真实供应商时自动走 AI 生成：

- `template`：使用本地 Pillow 模板渲染，适合无图片模型密钥的开发/测试。
- `generated`：把确认版文案、商品图和参考图组织为图片 provider 输入，由远程模型生成结果。

两种模式都面向两类产物：

- `main_image`：1:1 电商主图。
- `promo_poster`：3:4 促销海报。

## 8. 配置层级

配置分为两类：

1. Env-only 基础设施配置：`DATABASE_URL`、`REDIS_URL`、`SESSION_SECRET`、`ADMIN_ACCESS_KEY`、`SETTINGS_ACCESS_TOKEN` 等。这些配置在应用访问数据库前就必须可用，或用于保护登录/配置页二次解锁，因此不支持运行时 DB 覆盖。
2. 运行时业务配置：provider、模型、图片尺寸、上传限制、任务重试、全局生成并发上限、海报模式、提示词模板、登录门禁开关、业务删除开关等。它们可由 `.env` / `.env.dev` 提供默认值，也可在登录并二次解锁设置页后通过 `/api/settings` 写入 `app_settings` 并覆盖。

Secret 类配置在 API 响应中不回显已有值。

登录门禁开关 `admin_access_required` 默认开启；开启时私有 API 通过 `require_admin` 要求 Cookie session 中存在管理员登录标记，错误 `ADMIN_ACCESS_KEY` 仍返回 401。关闭时普通工作台和私有 API 可免管理员密钥访问，`GET /api/auth/session` 返回 `authenticated=true` 和 `access_required=false`；但 `/api/settings` 的完整配置读取/写入仍必须先通过独立的 `SETTINGS_ACCESS_TOKEN` 解锁。

业务删除开关 `deletion_enabled` 默认关闭；关闭时后端在路由边界拒绝商品整删和连续生图会话整删，避免体验站违规内容被整条删除后无法溯源。工作流节点/连线编辑和参考图删除不受该开关影响。`DELETE /api/auth/session` 和设置页恢复数据库覆盖值不属于业务删除保护范围。

提示词模板覆盖范围包括商品理解、文案生成、工作台生图和连续生图。基础设施配置和 secret 读取仍保持后端边界；前端只展示配置项、来源和保存状态。

## 9. 文件存储与下载

本地文件由 `infrastructure/storage.py` 中的 `LocalStorage` 管理。它把相对路径约束在配置的 `STORAGE_ROOT` 下，并拒绝绝对路径或路径穿越。生产 Compose 容器内的 `STORAGE_ROOT` 固定为 `/app/storage`；`STORAGE_HOST_PATH` 只控制宿主机 bind mount 来源，不应传入应用逻辑替代 `STORAGE_ROOT`。

用户可下载的文件通过受控路由读取，例如：

- `/api/posters/{poster_id}/download`
- `/api/source-assets/{asset_id}/download`
- `/api/image-session-assets/{asset_id}/download`

不要绕过 storage 服务直接拼接用户可控路径。

## 10. 安全边界

当前安全模型是“单管理员自托管”：

- 管理员密钥登录用于私有工作台访问控制。
- `ADMIN_ACCESS_KEY` 只从环境变量读取，不进入数据库配置；登录门禁可通过 `admin_access_required` 运行时开关关闭，默认保持开启。
- 配置页使用独立的 `SETTINGS_ACCESS_TOKEN` 二次解锁；session 只保存已解锁标记，不保存令牌明文。关闭登录门禁不会关闭这个二次解锁。
- Session cookie 由 `SESSION_SECRET` 签名。
- CORS 由 `BACKEND_CORS_ORIGINS` 控制。
- 上传文件有 MIME、大小、像素和数量限制。
- Provider API key 保存在 env 或数据库配置中，接口不回显 secret。

当前不提供多用户隔离、对象级权限、审计日志或生产 WAF 配置。


--- FILE: docs\ARCHITECTURE_HEALTH_REVIEW.en.md ---

# ProductFlow Architecture Health Review

[中文](ARCHITECTURE_HEALTH_REVIEW.md) | English

> Review date: 2026-04-28
> Scope: current repository live facts, completed governance work, still-unimplemented boundaries, and next architecture risks.
> Purpose: serve as the current architecture health entrypoint, replacing the removed historical backend audit checklist and historical architecture review snapshot.

## 1. Overall Conclusion

**Current health: 8.0 / 10.**

ProductFlow is currently in a state where the single-merchant self-hosted workspace can iterate sustainably. The backend keeps the FastAPI presentation / application / domain / infrastructure layering. Product DAG workflows and iterative image-generation durable tasks both use PostgreSQL state as the source of truth, while Redis/Dramatiq only handle dispatch and background execution. The frontend uses React, TypeScript, and TanStack Query; the API client and DTOs are centralized in `web/src/lib/`, and the product detail page has started splitting into page-local components and utilities.

Compared with the historical review, several key governance items have landed:

- The ProductWorkflow application has been split into graph, mutations, query, execution, context, artifacts, dependencies, and related modules; `product_workflows.py` now mainly serves as a compatibility facade.
- The frontend now has ESLint and Vitest scripts, so it is no longer limited to TypeScript build checks.
- `ProductDetailPage.tsx` has moved Runs, Images, Inspector, NodeCard, canvas utilities, download helpers, and related pieces into `web/src/pages/product-detail/`.
- Iterative image generation now uses durable `ImageSessionGenerationTask` records, with startup recovery, queue position, and failure state.
- The generated image gallery has landed, and iterative image results can be saved to `/gallery`.
- Iterative image generation has a mobile main-view, side-drawer, bottom generation sheet, and bottom action bar layout, reducing panel crowding on phones.
- Iterative image generation and product workflows both use lightweight status polling while running, then refresh full details after completion.

The main risk has shifted from "oversized hot modules and missing frontend quality gates" to "state consistency as async chains grow, frontend interaction regression coverage, and clear productionization boundaries." No P0 architecture issue was found that should immediately block feature development.

## 2. Current Real Module Structure

### Backend

Backend code lives under `backend/src/productflow_backend/`:

- `presentation/`: FastAPI app, routes, schemas, auth dependencies, upload validation, and error mapping.
- `application/`: products, traditional copy/poster jobs, iterative image generation, gallery, generation admission, and product workflow use cases.
- `domain/`: shared enums and domain error types.
- `infrastructure/`: SQLAlchemy models/session, Alembic, Redis/Dramatiq queue, storage, text/image providers, poster renderer, and logging.
- `workers.py`: Dramatiq actor entrypoint.
- `config.py`: environment variables, runtime business configuration definitions, and DB override reading.

The ProductWorkflow application is no longer a single file carrying all responsibilities. Current modules include:

- `product_workflows.py`: stable facade for routes.
- `product_workflow/graph.py`: workflow queries, default graph structure, and lightweight status snapshot.
- `product_workflow/mutations.py`: nodes, edges, reference image slots, and copy-node editing.
- `product_workflow/query.py`: product workflow detail query.
- `product_workflow/execution.py`: run creation, node scheduling, and non-image node execution.
- `product_workflow/run_state.py`: node-run claim, failure, cancellation, and capacity requeue state transitions.
- `product_workflow/image_generation.py`: image-generation node execution, provider timeout, safe failure, and artifact writeback.
- `product_workflow/context.py`: upstream context collection and provider input context construction.
- `product_workflow/artifacts.py`: `CopySet`, `SourceAsset`, `PosterVariant`, and related artifact writeback helpers.
- `product_workflow/templates.py`: canvas template materialization helpers.
- `product_workflow/user_templates.py`: user-saved node-group template create/list/rename/archive/apply use cases.
- `product_workflow_dependencies.py`: execution dependency injection seam for tests and future orchestration of text/image providers and renderer.

There are currently two background execution state families:

- `WorkflowRun` / `WorkflowNodeRun`: product DAG workflow runs.
- `ImageSessionGenerationTask`: iterative image-generation durable async tasks.

Global generation admission is implemented by `application/admission.py`, counting active `WorkflowRun` and `ImageSessionGenerationTask` rows in the database. `/api/generation-queue` exposes the current queue overview; iterative image status responses include queue position.

### Frontend

Frontend code lives under `web/src/`:

- `App.tsx`: route entrypoint, including `/login`, `/products`, `/products/new`, `/products/:productId`, `/image-chat`, `/products/:productId/image-chat`, `/gallery`, `/help`, and `/settings`.
- `pages/`: login, product list, product creation, product detail, iterative image generation, gallery, help, and settings pages.
- `pages/product-detail/`: product detail workbench page-local components, canvas helpers, download helpers, tests, and types.
- `pages/image-chat/`: iterative image status merge and branch-selection helpers.
- `pages/gallery/`: gallery layout and selection helpers.
- `components/`: top navigation, status tags, image drag-and-drop area, and image parameter controls.
- `lib/api.ts` / `lib/types.ts`: REST API client and frontend DTOs.

Frontend quality entrypoints from `web/package.json`:

- `pnpm --dir web lint`
- `pnpm --dir web test:run`
- `pnpm --dir web build`

## 3. Completed Governance

### 3.1 Documentation Aligned with Product Reality

`README.md`, `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/ROADMAP.md`, and `docs/USER_GUIDE.md` now cover the current mainline:

- Single-admin self-hosting, not multi-tenant SaaS.
- ProductFlow workbench, iterative image generation, gallery, settings page, and runtime configuration.
- Async execution and lightweight status polling.
- Docker Compose self-hosting path and local development path.
- Current explicit exclusions: multi-tenancy, payments, automatic placement, object storage, Helm, or released container images.

The historical backend audit checklist and historical architecture review snapshot were removed so old line counts, old test entrypoints, and old issue tables do not keep being read as current facts.

### 3.2 Product Workflow Split

The product DAG workflow has been split from a concentrated application file into responsibility-named modules. Routes still call through a stable facade, reducing the API-layer impact of the split.

This split resolves the largest backend hotspot risk from the historical review, but it has not turned the domain layer into a full workflow domain model. The current approach still lets application use cases directly orchestrate SQLAlchemy models, provider input, and artifact writeback.

### 3.3 Frontend Quality Gates

The frontend now has ESLint and Vitest scripts, with helper-level tests already present:

- `web/src/lib/imageSizes.test.ts`
- `web/src/pages/gallery/helpers.test.ts`
- `web/src/pages/image-chat/branching.test.ts`
- `web/src/pages/product-detail/galleryImages.test.ts`
- `web/src/pages/product-detail/reactFlowAdapters.test.ts`
- `web/src/pages/product-detail/selection.test.ts`
- `web/src/pages/product-detail/utils.test.ts`

These cover lightweight status merging, ReactFlow adapters, selection reconciliation, gallery layout, iterative image branching, image sizing, and other key helper behavior. Component-level interaction tests are still limited.

### 3.4 Iterative Image Durable Tasks

Iterative image generation has evolved from synchronous generation requests to durable tasks:

- API creates an `ImageSessionGenerationTask`, then enqueues it.
- The worker executes the task and writes back `ImageSessionRound` / generated assets.
- The status endpoint returns lightweight task snapshots, queue position, failure reasons, and the latest round information.
- API/worker startup recovers unfinished image-session generation tasks.
- Repeated execution of terminal/currently-running tasks stays no-op or follows controlled state transitions.

### 3.5 Gallery and Asset Review

The gallery has landed as both an independent page and backend resource:

- `GET /api/gallery` lists collected generated images.
- `POST /api/gallery` saves iterative image generated assets as gallery entries.
- `ImageGalleryEntry` keeps source session, round, linked product, prompt, size, model, and download entrypoint.
- Frontend `/gallery` provides centralized browsing and preview.

### 3.6 Lightweight Polling While Running

The running-state refresh strategy has moved from "frequently fetch full detail" to lightweight status polling:

- Product workflows poll `/api/products/{product_id}/workflow/status` while running.
- Iterative image generation polls `/api/image-sessions/{image_session_id}/status` while running.
- Status responses carry only run state, node/task lightweight fields, queue information, and necessary counters.
- When status reaches a terminal state or new results are detected, the frontend refreshes full workflow/session details.

This reduces repeated serialization of large objects, image-history rerenders, and accidental overwrites of local interaction state while product detail and iterative image pages are running.

## 4. Current Main Risks

### R1. Application Still Carries Many Domain Rules

ProductWorkflow has been split, but business rules still mostly live in application modules around SQLAlchemy models. This is acceptable short-term. If node-level retry, skip, duplicate, version comparison, and provider routing keep expanding, rules may spread further across execution, mutations, context, and artifacts.

Recommendation: keep governance incremental. Extract domain services/value objects only when the same rule repeats across multiple use cases, or when tests must work around too much database state just to validate a rule. Do not preemptively rewrite a large domain model.

### R2. Frontend Component-Level Regression Coverage Is Still Limited

Vitest now covers helpers and some hooks, but real ProductDetail workbench interactions still rely on manual verification: node dragging, edge creation/deletion, right-panel switching, save-draft-before-run, image fill, and download misclick protection.

The next quality investment should prioritize interactions that are easiest to regress and hardest to exhaustively check by hand, rather than chasing a generic coverage percentage.

### R3. Async State Consistency Remains the Long-Term Core Risk

The system now has two durable state chains: `WorkflowRun` and `ImageSessionGenerationTask`. They share the "database as source of truth, queue is recoverable, duplicate messages no-op" principle, but each chain still has its own state transitions and failure handling.

Any future background task should reuse these principles and include tests for queue recovery, enqueue failure, duplicate messages, terminal no-op, and API status snapshots.

### R4. Productionization Boundaries Still Need Clear Wording

The Docker Compose self-hosted path is available, but ProductFlow is still not a full production platform:

- It is not a multi-user or multi-tenant system.
- There is no object-storage adapter layer; storage is currently local filesystem storage.
- There is no SSE/WebSocket push; running state depends on polling.
- There is no Helm chart or released container image; the current path builds from the repository through Compose.
- There is no audit admin, object-level permission model, payment system, or hosted account system.

These items remain unimplemented boundaries. Docs and the roadmap must keep marking them as future directions to avoid misleading deployment expectations.

### R5. Provider Error Classification and Observability Can Improve Further

Provider calls are isolated in the infrastructure layer, but failure classification, retry guidance, rate-limit messaging, and log correlation for real OpenAI-compatible providers can still become more detailed. Current logs and error handling are enough for development and small self-hosted use, but not a complete observability system for complex production debugging.

## 5. Recommended Next Steps

1. **Prioritize key ProductDetail workbench interaction tests**  
   Cover the state transitions most likely to regress: status merge does not lose node structure, run completion triggers full refresh, node drag coordinates stay stable, and image fill/download does not trigger incorrect selection.

2. **Capture a shared checklist for durable tasks**  
   Every new background task should answer: when DB state lands, how enqueue failure is written back, how worker duplicate messages no-op, which states API startup recovers, and whether the status endpoint is lightweight.

3. **Keep docs split between current facts and future plans**  
   Current facts belong in README, PRD, ARCHITECTURE, USER_GUIDE, and this review. Object storage, SSE/WebSocket, Helm, multi-tenancy, and similar items should stay in roadmap future directions or out-of-scope sections unless implemented.

4. **Keep splitting by real hotspots, not global rewrites**  
   The ProductWorkflow and ProductDetail split direction has worked. Future splits should follow real modification hotspots from new features, avoiding repository, domain service, or complex frontend state layers introduced only for architecture completeness.

## 6. Current Verification Entrypoints

Backend:

- `just backend-test`
- `uv run --directory backend pytest`

Frontend:

- `pnpm --dir web lint`
- `pnpm --dir web test:run`
- `just web-build`
- `pnpm --dir web build`

Documentation:

- `git diff --check`

This review is documentation-level. It does not claim that the full backend/frontend test matrix was rerun. Behavior facts come from current source, routes, scripts, and existing test entrypoints.


--- FILE: docs\ARCHITECTURE_HEALTH_REVIEW.md ---

# ProductFlow 架构健康度复审

> 复审日期：2026-04-28
> 范围：当前仓库 live facts、已落地治理、仍未实现的边界和下一步架构风险。
> 结论用途：作为当前架构健康度入口，替代已删除的历史后端审查清单和历史架构审查快照。

## 1. 总体结论

**当前健康度：8.0 / 10。**

ProductFlow 当前架构处在“单商家自托管工作台已经可持续迭代”的状态。后端保持 FastAPI presentation /
application / domain / infrastructure 四层结构，商品 DAG 工作流和连续生图 durable task 都以 PostgreSQL 状态为
权威，Redis/Dramatiq 只承担投递和后台执行。前端使用 React、TypeScript、TanStack Query，API client 和 DTO
集中在 `web/src/lib/`，商品详情页已经开始按 page-local 组件和工具拆分。

相比历史审查，几项关键治理已经落地：

- ProductWorkflow application 已拆成 graph、mutations、query、execution、context、artifacts、dependencies 等模块，
  `product_workflows.py` 现在主要承担兼容 facade。
- 前端已有 ESLint 和 Vitest 脚本，不再是只有 TypeScript build 的状态。
- `ProductDetailPage.tsx` 已把 Runs、Images、Inspector、NodeCard、canvas utils、download helpers 等拆到
  `web/src/pages/product-detail/`。
- 连续生图已经使用 durable `ImageSessionGenerationTask`，并接入启动恢复、队列位置和失败状态。
- 生成图画廊已经落地，连续生图结果可保存到 `/gallery`。
- 连续生图已有移动端主视图、左右抽屉、底部生成面板和底部快捷条布局，降低手机操作时的面板拥挤。
- 连续生图和商品工作流运行中都使用轻量 status polling，完成后再刷新完整详情。

当前主要风险已经从“热点模块过大、缺少前端质量门禁”转向“异步链路继续增多后的状态一致性、前端交互回归覆盖和生产化边界表达”。没有发现需要立即阻断功能开发的 P0 架构问题。

## 2. 当前真实模块结构

### 后端

后端代码位于 `backend/src/productflow_backend/`：

- `presentation/`：FastAPI app、路由、schemas、鉴权依赖、上传校验和错误映射。
- `application/`：商品、传统文案/海报任务、连续生图、画廊、生成准入和商品工作流 use case。
- `domain/`：共享枚举和领域错误类型。
- `infrastructure/`：SQLAlchemy models/session、Alembic、Redis/Dramatiq queue、storage、text/image provider、poster renderer、logging。
- `workers.py`：Dramatiq actor 入口。
- `config.py`：环境变量、运行时业务配置定义和 DB override 读取。

ProductWorkflow application 当前已经不是单文件承载全部职责。当前模块包括：

- `product_workflows.py`：对路由保持稳定的 facade。
- `product_workflow/graph.py`：工作流查询、默认图结构和轻量 status snapshot。
- `product_workflow/mutations.py`：节点、连线、参考图槽位和文案节点编辑。
- `product_workflow/query.py`：商品工作流详情查询。
- `product_workflow/execution.py`：运行创建、节点调度和非图片节点执行。
- `product_workflow/run_state.py`：节点运行 claim、失败、取消和 capacity requeue 状态推进。
- `product_workflow/image_generation.py`：生图节点执行、provider timeout、安全失败和产物写回。
- `product_workflow/context.py`：上游上下文收集和 provider 输入上下文构建。
- `product_workflow/artifacts.py`：CopySet、SourceAsset、PosterVariant 等产物写回 helper。
- `product_workflow/templates.py`：画布模板 materialization helper。
- `product_workflow/user_templates.py`：用户保存节点组模板的 create/list/rename/archive/apply use case。
- `product_workflow_dependencies.py`：执行依赖注入 seam，供测试和未来编排注入 text/image provider 与 renderer。

当前有两类后台执行状态：

- `WorkflowRun` / `WorkflowNodeRun`：商品 DAG 工作流运行。
- `ImageSessionGenerationTask`：连续生图 durable 异步任务。

全局生成准入由 `application/admission.py` 基于数据库中的 active `WorkflowRun` 和 `ImageSessionGenerationTask`
计数完成。`/api/generation-queue` 暴露当前队列概览；连续生图 status 响应会返回队列位置。

### 前端

前端代码位于 `web/src/`：

- `App.tsx`：当前路由入口，包含 `/login`、`/products`、`/products/new`、`/products/:productId`、
  `/image-chat`、`/products/:productId/image-chat`、`/gallery`、`/settings`。
- `pages/`：登录、商品列表、创建商品、商品详情、连续生图、画廊、设置页。
- `pages/product-detail/`：商品详情 workbench 的 page-local 组件、canvas helpers、下载 helpers、测试和类型。
- `pages/image-chat/`：连续生图状态合并和分支选择 helpers。
- `pages/gallery/`：画廊布局和选择 helpers。
- `components/`：顶栏、状态标签、图片拖拽区和图片参数控件。
- `lib/api.ts` / `lib/types.ts`：REST API client 和前端 DTO。

前端当前质量入口来自 `web/package.json`：

- `pnpm --dir web lint`
- `pnpm --dir web test:run`
- `pnpm --dir web build`

## 3. 已完成治理

### 3.1 文档与产品现实对齐

`README.md`、`docs/PRD.md`、`docs/ARCHITECTURE.md`、`docs/ROADMAP.md`、`docs/USER_GUIDE.md` 已经覆盖当前主线：

- 单管理员自托管，而不是多租户 SaaS。
- ProductFlow workbench、连续生图、画廊、设置页和运行时配置。
- 三类异步执行入口和轻量 status polling。
- Docker Compose 自托管路径和本地开发路径。
- 当前明确不包含多租户、支付、自动投放、对象存储、Helm 或发布版镜像。

历史后端审查清单和历史架构审查快照已经移除，避免旧行数、旧测试入口和旧问题表继续被当成当前事实。

### 3.2 商品工作流拆分

商品 DAG 工作流已经从集中 application 文件拆成按职责命名的模块。路由仍通过稳定 facade 调用，降低了拆分对 API 层的影响。

这次拆分解决了历史审查中的最大后端热点风险，但还没有把领域层扩展为完整 workflow domain model。当前做法仍然是 application use case 直接编排 SQLAlchemy models、provider 输入和产物写回。

### 3.3 前端质量门禁

前端现在具备 ESLint 和 Vitest 脚本，并已有 helper 层测试：

- `web/src/lib/imageSizes.test.ts`
- `web/src/pages/gallery/helpers.test.ts`
- `web/src/pages/image-chat/branching.test.ts`
- `web/src/pages/product-detail/galleryImages.test.ts`
- `web/src/pages/product-detail/reactFlowAdapters.test.ts`
- `web/src/pages/product-detail/selection.test.ts`
- `web/src/pages/product-detail/utils.test.ts`

这已经覆盖轻量 status 合并、ReactFlow 适配、选择状态协调、画廊布局、连续生图分支和图片尺寸等关键 helper 行为。组件级交互测试仍然偏少。

### 3.4 连续生图 durable task

连续生图已从同步生成请求演进为 durable task：

- API 创建 `ImageSessionGenerationTask` 后入队。
- worker 执行任务并写回 `ImageSessionRound` / generated asset。
- status endpoint 返回轻量任务快照、队列位置、失败原因和最新 round 信息。
- API/worker 启动恢复 unfinished image-session generation tasks。
- 重复执行 terminal/currently-running task 时保持 no-op 或受控状态推进。

### 3.5 画廊与素材回看

画廊已作为独立页面和后端资源落地：

- `GET /api/gallery` 列出收藏生成图。
- `POST /api/gallery` 将连续生图 generated asset 保存为画廊条目。
- `ImageGalleryEntry` 保留来源会话、round、关联商品、提示词、尺寸、模型和下载入口。
- 前端 `/gallery` 提供集中浏览和预览。

### 3.6 运行中轻量轮询

当前运行中刷新策略已经从“高频拉完整详情”改为轻量 status polling：

- 商品工作流运行中轮询 `/api/products/{product_id}/workflow/status`。
- 连续生图运行中轮询 `/api/image-sessions/{image_session_id}/status`。
- status 响应只带运行状态、节点/任务轻量字段、队列信息和必要计数。
- 前端在 status 到达 terminal 或发现新结果时，再刷新完整 workflow/session 详情。

这降低了商品详情和连续生图页面在运行中反复序列化大对象、重渲染历史图像和覆盖本地交互状态的风险。

## 4. 当前主要风险

### R1. Application 仍承担较多领域规则

ProductWorkflow 已拆分，但业务规则仍主要在 application 层直接围绕 SQLAlchemy models 编排。短期可接受；如果继续增加节点级 retry、跳过、复制、版本对比和 provider 分流，规则会继续分散在 execution、mutations、context 和 artifacts 之间。

建议保持渐进治理：只有当同一规则在多个 use case 中重复出现，或测试必须绕过大量数据库状态才能验证时，再抽 domain service/value object，不提前做“大领域模型重写”。

### R2. 前端组件级回归覆盖不足

Vitest 已经覆盖 helper 和部分 hook，但 ProductDetail workbench 的真实交互仍依赖人工验证，包括节点拖拽、连接线创建/删除、右侧 panel 切换、保存草稿后运行、图片填充和下载误触发保护。

下一步质量投资应优先补最容易回归、最难人工穷举的交互，而不是泛泛追求覆盖率数字。

### R3. 异步状态一致性仍是长期核心风险

系统现在有 `WorkflowRun` 和 `ImageSessionGenerationTask` 两套 durable 状态。它们共享“数据库为权威、queue 可恢复、重复消息 no-op”的原则，但每条链路仍有自己的状态推进和失败处理。

后续任何新增后台任务，都应优先复用这些原则，并加入 queue recovery、enqueue failure、duplicate message、terminal no-op 和 API status snapshot 测试。

### R4. 生产化边界仍需明确表达

当前已有 Docker Compose 自托管路径，但仍不是完整生产平台：

- 不是多用户或多租户系统。
- 没有对象存储适配层，当前 storage 是本地文件系统。
- 没有 SSE/WebSocket 推送，当前运行中状态依赖轮询。
- 没有 Helm chart 或发布版容器镜像，当前是仓库内 Compose 构建。
- 没有审计后台、对象级权限、支付或托管账号体系。

这些不是当前实现缺陷，但文档和 roadmap 必须持续把它们标为未实现或未来方向，避免误导部署预期。

### R5. Provider 错误分类和可观测性仍可继续加强

Provider 调用已经被隔离在 infrastructure 层，但真实 OpenAI-compatible provider 的失败分类、重试提示、限流提示和日志关联仍可继续细化。当前日志和错误处理足够支撑开发/小规模自托管，但还不是面向复杂生产排障的完整 observability 体系。

## 5. 下一步建议

1. **优先补 ProductDetail workbench 关键交互测试**  
   目标是覆盖最容易回归的状态转换：status 合并后不丢节点结构、运行完成触发完整刷新、节点拖拽坐标稳定、图片填充/下载不触发错误选择。

2. **为三类 durable task 沉淀共享检查清单**  
   每次新增后台任务都必须回答：DB 状态何时落地、enqueue 失败如何回写、worker 重复消息如何 no-op、API 启动恢复哪些状态、status endpoint 是否轻量。

3. **保持 docs 的 current/future 分层**  
   当前事实继续放在 README、PRD、ARCHITECTURE、USER_GUIDE 和本复审；对象存储、SSE/WebSocket、Helm、多租户等只放在 roadmap 的未来方向或暂不计划，不写成已实现能力。

4. **继续按真实热点拆分，不做全局重写**  
   ProductWorkflow 和 ProductDetail 的拆分方向已经有效。后续拆分应跟着新增功能的真实修改热点走，避免为了架构完整性提前引入 repository、domain service 或复杂前端状态层。

## 6. 当前验证入口

后端：

- `just backend-test`
- `uv run --directory backend pytest`

前端：

- `pnpm --dir web lint`
- `pnpm --dir web test:run`
- `just web-build`
- `pnpm --dir web build`

文档：

- `git diff --check`

当前复审是文档级审查，不声明已经重新跑完整 backend/frontend 测试矩阵。业务行为事实来自当前源码、路由、脚本和现有测试入口。


--- FILE: docs\PRD.en.md ---

# ProductFlow PRD

[中文](PRD.md) | English

## 1. Product Positioning

ProductFlow is an open-source, self-hosted product creative workspace for solo merchants, small operations teams, and developers who want to manage AI creative workflows on their own infrastructure.

It is not a hosted SaaS product, not a multi-tenant open platform, and does not promise to replace human operational judgment. The current core goal is:

> Move one product from input assets to editable copy, downloadable posters, reusable image assets, and traceable workflow state.

## 2. Target Users

- Merchants who need to quickly create product titles, selling points, main images, and promotional posters.
- Teams that want to self-host model keys, databases, and asset files.
- Developers who want to extend AI ecommerce creative workflows.

Non-target users: teams that need multi-tenant isolation, complex RBAC, payment settlement, asset placement platforms, or hosted account systems.

## 3. Current Core Scenarios

### 3.1 Product Creative Chain

1. Log in with an admin key.
2. Create a product, upload the product source image, fill in the product name, and choose a blank canvas or ecommerce scenario template.
3. Enter the product workbench and add category, price, product notes, and generation direction.
4. Use copy nodes to generate and edit structured copy; later image generation reads the structured copy context directly.
5. Use image-generation nodes to generate images and fill downstream reference-image slots.
6. Download images/posters, or review product asset history in the right-side Library panel.
7. On mobile, the product list uses cards and floating pagination; product detail keeps the canvas as the main view and opens workflow run, Single node, Templates, Details, Runs, and Library from the bottom toolbar.

### 3.2 Iterative Image Sessions

1. Create a standalone image session, optionally attached to a product.
2. Upload multiple reference images.
3. Enter a prompt to generate images.
4. Continue from any generated candidate, or explicitly select reference images for the next generation round.
5. View queued/running/failed state; after task completion, the page refreshes new candidates automatically.
6. Attach satisfactory generated images back to a product as reference assets, save them as product main-image references, or collect them in the gallery.
7. On mobile, use a main-view, drawer, and bottom-sheet layout: the top bar exposes the session drawer, current session title/rename, and history drawer; the main view keeps status, current result, and provider notes; the left drawer manages sessions; the narrow right drawer selects branch/candidate history; the bottom generation sheet carries product linking, references, prompt, size, candidate count, and advanced image tool parameters.

### 3.3 Product DAG Workflow

1. Open the workflow workbench in the product detail page.
2. Create or adjust nodes: product context, reference image, copy generation, and image generation.
3. Use built-in scenario templates to append common flows, or multi-select nodes and save them as user templates.
4. Connect nodes to form a DAG.
5. Start a background workflow run, then cancel running work or retry failed runs when needed.
6. Persist run state, node state, and failure reasons in the database.
7. While running, the frontend polls lightweight workflow status; after completion, it refreshes full workflow, product detail, and historical artifacts.
8. On mobile, the canvas provides Browse, Edit, and Select modes: Browse supports one-finger pan, node tap selection, and two-finger zoom; Edit supports touch node dragging and edge creation; Select supports tap-based multi-select.

### 3.4 Gallery

1. Save generated image-session results to the gallery.
2. Browse collected generated images at `/gallery` by generation time.
3. Gallery entries keep source session, linked product, prompt, size, model, and download entrypoint.

### 3.5 In-Product Help

1. Open `/help` from the top navigation.
2. Review quick start, workbench, templates, run state, supported operations, and common questions.
3. Return from the help page to the product workbench or Image chat.

## 4. Core Objects

- `Product`: product entity, including name, category, price, and input assets.
- `SourceAsset`: product asset, including original main images, reference images, processed product images, and other types.
- `CreativeBrief`: system-generated product understanding result that provides shared semantics for copy and posters.
- `CopySet`: one copy-generation result whose primary content is editable structured copy.
- `PosterVariant`: main image / promotional poster output based on copy and assets.
- `ImageSession` / `ImageSessionAsset`: standalone iterative image-generation session and its reference/generated images.
- `ImageSessionRound` / `ImageSessionGenerationTask`: iterative image candidates and durable async generation-task state.
- `ImageGalleryEntry`: saved generated-image collection record.
- `ProductWorkflow` / `WorkflowNode` / `WorkflowEdge` / `WorkflowRun`: product DAG workflow structure and run records.
- `CanvasTemplate` / `UserCanvasTemplate`: built-in full scenario templates and user-saved node-group templates.
- `AppSetting`: runtime business configuration override.

## 5. Current Pages

Implemented frontend pages:

- `/login`: admin-key login.
- `/products`: product list.
- `/products/new`: create product.
- `/products/:productId`: product detail, copy/poster main chain, history, and DAG workflow.
- `/gallery`: generated image gallery.
- `/help`: in-product help page.
- `/settings`: provider, model, upload limit, job retry, and other business configuration.
- `/image-chat` and `/products/:productId/image-chat`: iterative image generation and attaching assets back to products.

## 6. V1 Implemented Acceptance Surface

For a single self-hosted deployment, the current version should be able to:

1. Run the product chain with local `mock` providers without external model keys.
2. Store products, assets, copy, posters, tasks, image sessions, and workflow state in PostgreSQL.
3. Use Redis + Dramatiq to execute async copy/poster jobs and product workflows.
4. Use durable `ImageSessionGenerationTask` records for iterative image generation, including queue position, failure reason, and completion refresh.
5. Create products with full scenario templates and insert the same built-in scenario templates or user-saved node-group templates in the workbench.
6. Display task state, workflow node state, generation queue overview, failure reasons, and history in the frontend.
7. Refresh running tasks/workflows through lightweight status APIs instead of high-frequency full-object polling.
8. Retry recoverable iterative image tasks and product workflow runs, and cancel running tasks.
9. Save iterative generated images to the gallery and retrieve originals through controlled download APIs.
10. Save business configuration overrides through `/settings` while avoiding secret values in API responses.
11. Store uploaded/generated files in local storage and read them through controlled download APIs.
12. Read in-product operation guidance and support boundaries at `/help`.
13. Use responsive mobile entrypoints for the product list, product workbench canvas, and iterative image page.

## 7. Explicit Boundaries

Currently not included:

- Multi-user, multi-tenant, team permissions, or audit admin.
- Hosted model keys, cloud account systems, or billing systems.
- Automatic placement, automatic listing, or store authorization.
- Video generation workflows.
- Kubernetes / Helm / released container images or other production orchestration packages. The repository already includes a Docker Compose self-hosting path.

## 8. Success Criteria

- External developers can start the complete development stack locally by following the README.
- The default mock configuration does not require real API keys.
- Documentation does not exaggerate current capabilities for copy, posters, image sessions, or workflows, and does not hide key dependencies.
- Private environment files, runtime data, Trellis task history, and build outputs are not publicly committed.


--- FILE: docs\PRD.md ---

# ProductFlow PRD

[中文](PRD.md) | [English](PRD.en.md)

## 1. 产品定位

ProductFlow 是一个开源、自托管的商品素材工作台，面向单人商家、小团队运营者或希望在自己基础设施里管理 AI 素材链路的开发者。

它不是托管 SaaS、不是多租户开放平台，也不承诺替代人工运营判断。当前核心目标是：

> 把一个商品从输入素材推进到可编辑文案、可下载海报、可复用图片素材、可收藏生成图和可追踪工作流状态。

## 2. 目标用户

- 需要快速制作商品标题、卖点、主图和促销海报的商家。
- 希望自托管模型密钥、数据库和素材文件的团队。
- 想二次开发 AI 电商素材工作流的开发者。

非目标用户：需要多租户隔离、复杂 RBAC、支付结算、素材投放平台或托管账号体系的团队。

## 3. 当前核心场景

### 3.1 商品素材链路

1. 使用管理员密钥登录。
2. 创建商品，上传商品原图、填写商品名，并选择空白画布或电商场景模板。
3. 进入商品工作台，补充类目、价格、商品说明和生成方向。
4. 通过文案节点生成并编辑结构化文案；后续生图直接读取结构化文案上下文。
5. 通过生图节点生成图片，并把结果填充到下游参考图槽位。
6. 下载图片/海报，或在右侧图库面板回看商品素材历史。
7. 移动端商品列表使用卡片和浮动分页；商品详情保留画布为主视图，通过底部工具栏打开运行、单节点、模板、详情、日志和图库。

### 3.2 连续图片会话

1. 创建独立图片会话，可选关联商品。
2. 上传多张参考图。
3. 输入提示词生成图片。
4. 从任意生成候选继续，或显式选择参考图参与下一轮生成。
5. 查看排队/运行/失败状态，任务完成后自动刷新新候选。
6. 将满意的生成图挂回某个商品作为参考素材、保存为商品主图参考，或收藏到画廊。
7. 移动端使用主视图、抽屉和底部面板组合：顶部栏提供会话抽屉、当前会话标题/重命名和历史抽屉；主视图保留状态、当前结果和供应商提示；左侧抽屉管理会话；右侧窄抽屉选择分支/候选历史；底部生成面板承载商品关联、参考图、提示词、尺寸、候选数量和高级图片工具参数。

### 3.3 商品 DAG 工作流

1. 在商品详情中打开工作流工作台。
2. 创建或调整节点：商品上下文、参考图、文案生成、图片生成。
3. 使用内置场景模板追加常用流程，或多选节点保存为用户模板。
4. 连接节点形成 DAG。
5. 启动后台工作流运行，必要时取消运行或重试失败运行。
6. 在数据库中持久化运行、节点状态和失败原因。
7. 运行中前端轮询轻量工作流状态；结束后刷新完整工作流、商品详情和历史产物。
8. 移动端画布提供浏览、编辑和选择模式：浏览模式支持单指平移、点选节点和双指缩放；编辑模式支持触控拖动节点和创建连线；选择模式支持点按多选。

### 3.4 画廊

1. 从连续生图结果保存生成图到画廊。
2. 在 `/gallery` 查看已收藏生成图，按生成时间浏览。
3. 画廊条目保留来源会话、关联商品、提示词、尺寸、模型和下载入口。

### 3.5 产品内帮助

1. 从顶部导航进入 `/help`。
2. 查看快速开始、工作台、模板、运行状态、支持边界和常见问题。
3. 从帮助页回到商品工作台或文/图生图继续操作。

## 4. 核心对象

- `Product`：商品实体，包含名称、类目、价格和输入素材。
- `SourceAsset`：商品素材，包含原始主图、参考图、处理后商品图等类型。
- `CreativeBrief`：系统生成的商品理解结果，为文案和海报提供统一语义。
- `CopySet`：一次文案生成结果，主内容为可编辑结构化文案。
- `PosterVariant`：基于文案和素材产出的主图/促销海报。
- `ImageSession` / `ImageSessionAsset`：独立连续生图会话及其参考图/生成图。
- `ImageSessionRound` / `ImageSessionGenerationTask`：连续生图候选记录和 durable 异步任务状态。
- `ImageGalleryEntry`：保存到画廊的生成图收藏记录。
- `ProductWorkflow` / `WorkflowNode` / `WorkflowEdge` / `WorkflowRun`：商品 DAG 工作流结构和运行记录。
- `CanvasTemplate` / `UserCanvasTemplate`：内置完整场景模板和用户保存的节点组模板。
- `AppSetting`：运行时业务配置覆盖项。

## 5. 当前页面

前端当前实现的页面：

- `/login`：管理员密钥登录。
- `/products`：商品列表。
- `/products/new`：创建商品。
- `/products/:productId`：商品详情、文案/海报主链路、历史、DAG 工作流。
- `/gallery`：生成图画廊。
- `/help`：产品内帮助页。
- `/settings`：provider、模型、上传限制、任务重试等业务配置。
- `/image-chat` 和 `/products/:productId/image-chat`：连续生图与素材挂回商品。

## 6. V1 已实现验收面

对单个自托管部署，当前版本应能完成：

1. 用本地 `mock` provider 在无外部模型密钥时跑通商品链路。
2. 用 PostgreSQL 保存商品、素材、文案、海报、任务、图片会话和工作流状态。
3. 用 Redis + Dramatiq 执行异步文案/海报任务和商品工作流。
4. 用 durable `ImageSessionGenerationTask` 执行连续生图，支持队列位置、失败原因和完成后刷新。
5. 使用完整场景模板创建商品，并在工作台中插入同一套内置场景模板或用户保存的节点组模板。
6. 在前端查看任务状态、工作流节点状态、生成队列概览、失败原因和历史记录。
7. 在运行中使用轻量 status 接口刷新任务/工作流状态，避免高频拉取完整大对象。
8. 对可恢复的连续生图任务和商品工作流运行执行重试，对运行中任务执行取消。
9. 收藏连续生图结果到画廊，并通过受控下载接口取回原图。
10. 通过 `/settings` 保存业务配置覆盖，并避免在 API 响应中回显 secret 值。
11. 将上传/生成文件保存在本地 storage 目录，并通过受控下载接口读取。
12. 在 `/help` 查看产品内操作说明和支持边界。
13. 在移动端使用商品列表、商品工作台画布和连续生图页面的响应式操作入口。

## 7. 明确边界

当前不包含：

- 多用户、多租户、团队权限、审计后台。
- 托管模型密钥、云端账号体系或计费系统。
- 自动投放、自动上架、店铺授权。
- 视频生成链路。
- Kubernetes / Helm / 发布版容器镜像等生产编排包。仓库内已有 Docker Compose 自托管路径。

## 8. 成功标准

- 外部开发者能按 README 在本地启动完整开发栈。
- 默认 mock 配置不需要真实 API key。
- 文案、海报、图片会话和工作流的当前能力在文档中不夸大、不隐藏关键依赖。
- 私有环境文件、运行数据、Trellis task 历史和构建产物不会被公开提交。


--- FILE: docs\ROADMAP.en.md ---

# ProductFlow Roadmap

[中文](ROADMAP.md) | English

This roadmap describes the evolution direction of the open-source self-hosted version. It is not a hosted-service commitment.

## Current Stage: Open-Source Self-Hosted and Runnable

Completed baseline capabilities:

- FastAPI backend, React/Vite frontend, PostgreSQL, Redis, and Dramatiq worker.
- Single-admin login and private workspace.
- Product creation, image upload, and reference image management.
- Copy generation, editing, confirmation, and history.
- Template poster generation, AI image-provider poster generation, and poster download.
- Iterative image sessions and attaching generated images back to products.
- Generated image gallery: iterative image results can be collected at `/gallery`, keeping source session, product, prompt, size, model, and download entrypoint.
- Product DAG workflow editing, execution, persistent state, and recovery.
- Shared top navigation.
- ProductFlow workbench canvas interactions: desktop mouse-wheel zoom, left-drag pan, node drag positioning, box selection / multi-select, and edge drag creation/deletion; mobile Browse, Edit, and Select modes, touch drag/edge creation, and two-finger pinch zoom.
- Full scenario templates for product creation: blank canvas, marketplace hero images, detail persuasion, scene galleries, content covers, and campaign assets.
- Workbench templates: the same built-in scenario templates can be inserted into existing canvases and automatically reuse the product node; users can save selected nodes as their own node-group templates with rename and archive-delete support.
- Single-slot semantics for reference images, image drag-and-drop upload, compact right sidebar for Details / Runs / Library / Templates, and asset fill.
- In-product help page: `/help` covers quick start, canvas operations, templates, run failure handling, supported operations, and common questions.
- Prompt configuration: product understanding, copy, workbench image generation, and iterative image-generation templates can be overridden in the settings page.
- Initial product brand assets, README preview images, and Web favicon/metadata.
- Settings page management for providers, models, upload limits, job retry, and other business configuration.
- Lightweight status polling while running: iterative image generation and product workflows poll status responses only, then refresh full details after completion.
- Mobile product list and product workbench adaptation: product list cards with floating pagination, plus workbench bottom toolbar, bottom sheet, and canvas touch modes.
- Mobile iterative image page adaptation: main view, session drawer, narrow history drawer, generation-settings bottom sheet, and bottom quick actions are organized for small screens.
- One-command Docker Compose self-hosting path: `docker compose up -d --build` starts PostgreSQL, Redis, backend API, Dramatiq worker, and the Web static site; `just release` now uses the Compose production update and health-check flow.
- Basic open-source files, MIT License, contribution/security guides, and issue/PR templates.

## Near-Term Priorities

### 1. Developer Experience

- Add more complete local deployment screenshots and troubleshooting.
- Add a one-command seed/demo data script.
- Continue polishing Compose self-hosting troubleshooting, port conflict notes, storage migration guidance, and upgrade/rollback examples.

### 2. Testing and Quality

- Expand end-to-end test examples for product workflow DAGs.
- Add frontend component/interaction regression testing strategy.
- Add more edge tests for provider mock, OpenAI Responses provider, failure classification, and manual retry/cancel behavior.
- Add independent tests for settings-page secret updates and non-echo behavior.

### 3. Workflow Experience

- Continue improving DAG node run logs and failure reason display; categorized failure messages and workflow retry/cancel actions already exist.
- Add node-level skip and duplicate capabilities; workflow-level retry/cancel already exists.
- Continue optimizing partial loading and component boundaries on large product detail pages; active full-workflow polling has already been replaced with lightweight status polling.
- Continue improving asset reuse between image sessions and product workflows, such as batch attach, version comparison, and clearer source labels.
- Add more frontend regression coverage for the template panel, user-template saving, and key workbench component interactions; core canvas selection/drag helpers already have unit coverage.

### 4. Documentation and Productization

- Add README / user-guide screenshots so ProductFlow workbench nodes, template panel, and sidebar are more intuitive.
- Capture lightweight brand usage guidance, including recommended sizes and usage boundaries for logo, favicon, and README hero.
- Add provider configuration examples and common-error troubleshooting instead of expanding dependency lists.

## Mid-Term Direction

### Richer Inputs

- Multi-source product information import.
- Product URL / spreadsheet import.
- More structured brand, audience, and selling-point inputs.

### Stronger Asset Management

- Asset favorites, tags, and archiving.
- More sizes and platform adaptations.
- Configurable templates and brand color/logo.
- Clearer generated version comparison.

### Provider Expansion

- Clearer OpenAI-compatible provider configuration examples.
- Provider capability probing and health checks.
- Per-node model or provider selection.
- Interface exploration for pluggable video providers.

## Long-Term Exploration

- Video scripts, voiceover, subtitles, and template rendering.
- Multi-member collaboration and permission model.
- Object storage adapter layer.
- Released container images, Helm chart, or other production orchestration packages. The repository already includes the Docker Compose self-hosting path, but no hosted image or Helm chart is published.
- Controlled integration with external stores/ad platforms.

## Not Planned for Now

- Built-in hosted accounts or managed model keys.
- Built-in payment/billing.
- Public registration by default.
- Fully automated placement without human confirmation.


--- FILE: docs\ROADMAP.md ---

# ProductFlow Roadmap

[中文](ROADMAP.md) | [English](ROADMAP.en.md)

这个路线图描述开源自托管版本的演进方向，不代表托管服务承诺。

## 当前阶段：开源自托管可运行

已完成的基础能力：

- FastAPI 后端、React/Vite 前端、PostgreSQL、Redis、Dramatiq worker。
- 单管理员登录和私有工作台。
- 商品创建、图片上传、参考图管理。
- 文案生成、编辑、确认和历史记录。
- 模板海报生成、AI 图片 provider 海报生成、海报下载。
- 连续图片会话和生成图挂回商品。
- 生成图画廊：连续生图结果可收藏到 `/gallery`，保留来源会话、商品、提示词、尺寸、模型和下载入口。
- 商品 DAG 工作流编辑、执行、持久化状态和恢复。
- 共享顶部导航。
- ProductFlow 工作台画布交互：桌面端滚轮缩放、左键平移、节点拖拽定位、框选/多选、连接线拖拽创建/删除；移动端浏览、编辑、选择模式、触控拖拽/连线和双指缩放。
- 新建商品完整场景模板：空白画布、平台首图、详情说服、场景图册、内容种草和活动投放。
- 工作台模板：同一套内置场景模板可插入到已有画布并自动复用商品节点，用户可把多选节点保存为自己的节点组模板，并支持重命名和归档删除。
- 参考图单槽位语义、图片拖拽上传、右侧详情 / 日志 / 图库 / 模板精简侧栏和素材填充。
- 产品内帮助页：`/help` 覆盖快速开始、画布操作、模板、运行失败处理、支持边界和常见问题。
- 提示词配置：商品理解、文案、工作台生图和连续生图模板可在设置页覆盖。
- 初版产品品牌资产、README 展示图和 Web favicon/metadata。
- 设置页管理 provider、模型、上传限制、任务重试等业务配置。
- 运行中轻量状态轮询：连续生图和商品工作流运行时只轮询 status 响应，完成后再刷新完整详情。
- 移动端商品列表和商品工作台适配：商品列表使用移动卡片与浮动分页，商品工作台使用底部工具栏、底部详情面板和画布触控模式。
- 移动端连续生图页面适配：主视图、会话抽屉、历史窄抽屉、生成设置底部面板和底部快捷操作已按小屏幕组织。
- Docker Compose 一键自托管路径：`docker compose up -d --build` 可启动 PostgreSQL、Redis、后端 API、Dramatiq worker 和 Web 静态站点；`just release` 已切到 Compose 生产更新和健康检查链路。
- 基础开源文件、MIT License、贡献/安全说明、issue/PR 模板。

## 近期优先级

### 1. 开发体验

- 补充更完整的本地部署截图和 troubleshooting。
- 增加一键 seed/demo 数据脚本。
- 继续打磨 Compose 自托管 troubleshooting、端口冲突说明、storage 迁移提示和升级/回滚示例。

### 2. 测试与质量

- 扩展商品工作流 DAG 的端到端测试样例。
- 扩展前端 Vitest 覆盖，从当前 helper/canvas/cache 测试推进到关键组件交互。
- 为 provider mock、OpenAI Responses provider、失败分类和手动重试/取消补更多边界测试。
- 为设置页 secret 更新和不回显行为补独立测试。

### 3. 工作流体验

- 继续改善 DAG 节点运行日志和失败原因展示；当前已能展示分类后的失败提示和工作流重试/取消入口。
- 增加节点级跳过/复制能力；工作流级重试/取消已经落地。
- 继续优化大型商品详情页的局部 loading 和组件拆分；运行中完整 workflow 轮询已改为轻量 status 轮询。
- 继续优化图片会话和商品工作流之间的素材复用入口，例如批量回写、版本对比和更清晰的来源标识。
- 为模板面板、保存用户模板和关键工作台组件交互补更多前端自动化回归测试；画布选择/拖拽核心 helper 已有单元覆盖。

### 4. 文档与产品化

- 补充 README / 用户指南截图，让 ProductFlow 工作台的节点、模板面板和侧栏更直观。
- 沉淀轻量品牌使用说明，说明 logo、favicon、README hero 的推荐尺寸和使用边界。
- 补充 provider 配置示例和常见错误排查，依赖清单保持精简。

## 中期方向

### 更丰富的输入

- 多来源商品信息导入。
- 商品 URL / 表格导入。
- 更结构化的品牌、受众、卖点输入。

### 更强的素材管理

- 素材收藏、标签、归档。
- 更多尺寸和平台适配。
- 可配置模板和品牌色/Logo。
- 更清晰的生成版本对比。

### Provider 扩展

- 更明确的 OpenAI 兼容 provider 配置示例。
- Provider 能力探测和健康检查。
- 按节点选择不同模型或 provider。
- 可插拔视频 provider 的接口探索。

## 长期探索

- 视频脚本、配音、字幕和模板渲染。
- 多成员协作和权限模型。
- 对象存储适配层。
- 发布容器镜像、Helm chart 或其他生产编排方案。当前已有本仓库内 Docker Compose 自托管路径，但没有发布托管镜像或 Helm chart。
- 与外部店铺/投放平台的受控集成。

## 暂不计划

- 内置托管账号或代管模型密钥。
- 内置支付计费。
- 默认公开注册。
- 无人工确认的全自动投放链路。


--- FILE: docs\USER_GUIDE.en.md ---

# ProductFlow Beginner Tutorial and Reference

[中文](USER_GUIDE.md) | English

This document has two parts:

1. **Beginner tutorial**: minimal jargon, follow the clicks and fields, and generate one usable product image first.
2. **Reference**: after completing one run, read more about workbench cards, prompt configuration, model settings, and common questions.

The product now provides a **Help** page in the top navigation for quick access to workflows, templates, supported operations, and common troubleshooting. This Markdown document remains as repository text reference and should stay aligned with the in-product help page.

The current workbench is the **ProductFlow workbench**: the middle area is a zoomable and draggable node canvas. On desktop, the right side is a compact sidebar that switches between **Details / Runs / Library / Templates** with a small rail. On mobile, the canvas remains the main surface and the bottom toolbar opens workflow run, Single node, Templates, Details, Runs, and Library controls. Normal use does not require understanding the internal DAG. Just remember: product, reference image, copy, and image generation are cards; edges mean "downstream generation refers to upstream data".

---

## Beginner Tutorial: Start from One Product Image

Goal: upload one product image, add a little information, generate copy, then generate a satisfying image.

### 1. Create a Product

1. Click **Products / Workbench** in the top navigation.
2. Click **New product**.
3. Upload a clear product main image.
4. Fill in a product name, for example: `cream white commuter tote bag`.
5. Choose a canvas template. Beginners can choose **Product main image**; choose **Blank canvas** if you want to build the workflow manually.
6. Click **Create and continue**.

Expected result: the page enters this product's workbench, with several clickable cards in the middle.

### 2. Add Product Details

1. Click the **Product** card on the canvas.
2. The right side switches to **Details**. Add category, price, product description, or the direction you want to emphasize this time.
3. Example description: `Suitable for commuting and weekend outings, lightweight, large capacity, cream white color.`
4. Click **Save**, or wait until the right-side status shows **Saved**.

Expected result: the form saves successfully. Later copy and image generation use these saved product details.

### 3. Generate the First Copy Version

1. Click the **Copy** card.
2. In generation requirements, write one sentence, for example:

   ```text
   Emphasize commuting, lightweight design, and large capacity. Use a premium tone without exaggeration.
   ```

3. Click **Run current node**. If you want to run from product details all the way to image generation, click **Run workflow**.

Expected result: the copy card generates an editable structured copy payload. It may be freeform text, short labeled blocks, layout sections, visual guidance, or a mix that fits the selected template.

If you are not satisfied, change only one direction and try again, such as "make it younger", "make it more concise", or "use fewer exaggerated words".

The copy detail editor shows fields that already have content. Empty optional fields collapse into compact add buttons such as "add label" or "add visual guidance", and long text boxes grow with their content. Later image generation reads the structured copy, so every result can use the shape that fits the scene.

### 4. Add or Connect Reference Images

If you have a style image you want to reference:

1. Select or add a **Reference image** card.
2. Upload a reference image, such as lighting, background, composition, or style that you like. Reference image upload also supports click-to-select and drag-and-drop.
3. Drag from the connection point on the reference image card to the **Copy** or **Image generation** card.

You only need to remember: **connecting to it = reference it during generation**.

Expected result: an edge appears on the canvas. When the connected card runs later, it references this image's tags and image information. If you connect the wrong edge, select and delete the edge, then drag a new one.

### 5. Generate the First Image

1. Click the **Image generation** card.
2. Confirm that the **Image generation** card is connected to at least one downstream **Reference image** card. The image-generation card only triggers generation; it does not display/download images itself. Generated results are written into the connected reference image cards.
3. Write image requirements, for example:

   ```text
   Place a white tote bag on a commuter desk with a laptop and coffee nearby, clean natural light, suitable for an ecommerce main image.
   ```

4. Click **Run current node** or **Run workflow**.

Expected result: the downstream reference image card is filled with the new image and provides preview/download on the card. The right-side **Library** panel also aggregates the image. Click the thumbnail to preview it in the app; click **Download** to download the original image.

If there is no downstream reference image card connected, the system tells you to connect at least one image/reference image node first. It will not silently place the image on the image-generation card.

### 6. Keep Adjusting Until Satisfied

Change only one or two things per round; it is easier to tell which sentence worked.

Common adjustments:

- Subject is unclear: add `product centered in frame, complete subject, clear texture`.
- Background is too busy: add `clean background, fewer props, keep only 1-2 supporting objects`.
- Style is wrong: add `natural light`, `magazine-like composition`, `minimal ecommerce`, or `warm lifestyle`.
- Selling point is missing: put the most important selling point in the first sentence, such as `large capacity`, `lightweight`, or `commuter-friendly`.

Copyable rewrite example:

```text
Make the background cleaner, keep only the laptop and coffee; the bag texture should be clear and the shadow soft.
```

Download the image when you are satisfied. If you want to continue fine-tuning iteratively, click **Image chat** in the top navigation. If this image came from Image chat, you can also save it to **Gallery** for centralized browsing later.

### Canvas Basics

- **Desktop zoom**: move the mouse into the workbench canvas and scroll the wheel; the canvas zooms around the mouse position. Zoom buttons and percentage are also available in the lower-right corner.
- **Desktop pan**: hold the left mouse button on blank canvas and drag to move the view. Dragging cards, clicking buttons, uploading, or dragging edges does not trigger canvas panning.
- **Desktop move cards**: hold the card body or title area and drag; the position is saved after release. It stays where you placed it after refresh.
- **Desktop connect cards**: drag from a card connection point to a target card. An edge is created after release. Edges are part of the workflow, not temporary visuals.
- **Desktop multi-select cards**: hold Shift and drag a selection box from blank canvas, or Ctrl / Cmd / Shift-click several nodes. A selected group can be moved, deleted, or saved as a node-group template.
- **Mobile browse mode**: the product workbench opens in browse mode on mobile. One-finger dragging on blank canvas pans the view, tapping a node selects it, and two-finger pinch zooms the canvas.
- **Mobile edit mode**: after switching the bottom mode control to **Edit**, touch and pen input can drag nodes and create edges from output handles to target nodes.
- **Mobile select mode**: after switching the bottom mode control to **Select**, tapping nodes adds or removes them from multi-select. Tapping blank canvas exits the temporary selection mode.
- **Mobile toolbar and panels**: the bottom toolbar provides workflow run, Single node, Templates, Details, Runs, and Library entrypoints. Those sidebar contents open as a bottom sheet on mobile.
- **Adjust sidebar**: on desktop, the right sidebar handles Details, Runs, Library, and Templates. It stays compact and no longer uses a large bottom panel that occupies canvas space.

### Node Group Templates

The right-side **Templates** panel inserts reusable groups into an existing product workbench. It serves a different moment from the full-canvas template chosen during product creation:

- **Full-canvas template**: chosen only when creating a product; it defines the initial workflow structure.
- **Node-group template**: appended inside an existing product workbench, for example a main-image refinement, scene image, or campaign image flow.
- **User template**: after selecting two or more non-product nodes, save the selected structure as your own node-group template.

Saving a user template stores only reusable node configuration and internal edges between selected nodes. It does not store generated images, copy outputs, or product details. User templates can be renamed and deleted; deleting a template does not affect nodes already inserted into a product workbench.

### 7. Use Iterative Image Generation for Detail Tuning

1. Click **Image chat** in the top navigation.
2. Select a product, or generate freely first.
3. The first image can be generated directly from a text description. For later edits, first click a completed image in history as the base image.
4. Request changes conversationally, for example:

   ```text
   Keep the bag angle unchanged, change the background to a brighter office, and reduce desk clutter.
   ```

5. When satisfied, write the image back to the product so the workbench can reference it later.

On small screens, Image chat uses a main-view, drawer, and bottom-sheet layout:

- **Top bar**: the left button opens the session drawer, the center shows the current session title, the pencil renames it, and the right button opens the history drawer.
- **Left session drawer**: create, select, and delete sessions. Session cards show the latest thumbnail, round count, and update time; selecting a session switches the main view to it.
- **Right history drawer**: shows branch/candidate history and running placeholders. Tapping a completed image selects it as the current result and the next base image; tapping a placeholder shows that candidate's queued, generating, failed, or cancelled state.
- **Main view**: generation status, current result, failure reason, and provider notes remain visible. When a multi-candidate task is submitted, history first shows the matching number of placeholders; while running, the page refreshes lightweight status and refreshes full session detail after the task ends.
- **Bottom action bar**: the generation entry is always available. After a completed result is selected, the bar also shows Download and Send to gallery.
- **Bottom generation sheet**: contains Generation and Advanced tabs. Generation manages product linking, product references, session references, image description, size, and candidate count; Advanced manages enabled image tool parameters. The submit button at the bottom starts generation using the current candidate count.

### 8. Save to Gallery

Image chat results can be saved to **Gallery**. The gallery keeps image source, linked product, prompt, size, and model information, and provides a download entrypoint.

Good gallery candidates:

- Backgrounds or compositions that may be reused later but should not be attached to a product yet.
- Satisfying candidates that need to be reviewed together.
- Useful tuning results that are not the current product's final image.

---

## Reference: What Cards Are in the Workbench

These notes are for users who have completed one run and want more precise control.

### Product

Stores product name, category, price, and description. Downstream generation prioritizes the latest saved product details.

### Reference Image

A reference image card holds only the current image. You can upload manually, or let an image-generation card fill it with a new image. The new image replaces the current image in the card; old assets remain in product history.

When a reference image card is selected, assets in the right-side **Library** panel show fill actions. When filling from an existing asset, the system reuses the existing asset record and does not create a duplicate upload for the same image.

### Copy

Generates editable structured copy. The result can be freeform text, copy blocks, layout sections, and visual guidance. After generation, you can keep editing inside the card. Edited structured copy is used by later image generation.

The current workbench uses structured copy as later image-generation context, so you do not need to invent fixed copy fields when the scene does not need them.

### Image Generation

Triggers image generation based on product details, copy, reference images, and your image requirements. It is not an image slot: generated images are written into connected downstream reference image cards. If no downstream reference image card is connected, running fails and tells you to connect at least one image/reference image node first.

The image-generation card now distinguishes between "generate directly from product details" and "generate with copy/reference context": when upstream copy or reference images are connected, generation reads that context. Without connected copy, it can still try to generate from product details and the node's image requirements.

---

## Reference: Connections and Runs

- Connect A to B: B references A during generation.
- To try one card only: select the card and run the current node.
- To generate from product details all the way to image: run the whole workflow.
- Before running, confirm that the right-side form is saved. If the selected card has unsaved draft content, the current run button first attempts to save it, then starts running.
- You can keep organizing canvas positions while the workflow is running, but do not repeatedly click run or change the structure.
- Image-generation results are not downloaded from the image-generation card. Use the downstream reference image card or the right-side **Library** panel.
- Running workflows can be cancelled from the Details or Runs area for the node involved. Failed retryable runs expose a retry action.
- Failure messages try to distinguish provider quota/rate limit, content policy, network interruption, request timeout, provider service error, and unsupported parameters.

---

## Reference: Prompt Configuration

Open **Settings** in the top navigation and find the **Prompts** group. You can adjust four long-term default prompt templates:

- `prompt_brief_system`: default prompt for product understanding.
- `prompt_copy_system`: default prompt for copy generation.
- `prompt_poster_image_template`: workbench image-generation template.
- `prompt_poster_image_edit_template`: workbench edit template when upstream copy or reference-image context is present.
- `prompt_poster_image_reference_policy`: visual-reference rule used by the `reference_policy` placeholder in workbench image templates.
- `prompt_image_chat_template`: iterative image-generation template.

Recommended usage:

- For one-off effects: write requirements in the copy card or image-generation card.
- For long-term tone or format: change prompt templates in the settings page.
- If unsure: copy the default value first, make a small adjustment, save, and test.

Restoring defaults deletes the custom value from the database and returns to the system default prompt.

Common placeholders:

- Workbench image template: `product_name`, `category`, `price`, `source_note`, `instruction`, `context_block`, `reference_policy`, `size`, `kind`, `kind_label`, `kind_requirements`.
- Workbench edit template: `product_name`, `category`, `price`, `source_note`, `instruction`, `context_block`, `reference_policy`, `size`, `kind`, `kind_label`, `kind_requirements`.
- Iterative image template: `prompt`, `size`, `history_block`.

If a placeholder is misspelled, the system does not crash just because of the unknown placeholder. That part may not be replaced as expected. Prefer small edits followed by testing.

---

## Reference: Model and Runtime Settings

The top-navigation **Settings** page can also manage:

- Copy provider and copy model.
- Image provider and image model.
- Provider profiles, including provider type, connection data, API key, and interface capabilities. Google Gemini profiles use the official SDK endpoint and do not configure a Base URL.
- Default image size. Iterative image generation and workbench image generation can directly select common 1K / 2K / 4K frames or enter custom width/height.
- Iterative image-generation idle recovery threshold, defaulting to 90 minutes; the system judges stale running tasks by the latest generation-progress heartbeat.
- Upload file size limits.

Provider profile secrets are not echoed back. Leaving API key blank while editing a profile preserves the old value; only entering a new value writes it to the database.

## Reference: Running State

Copy, poster, workflow, and Image chat generation are background tasks. Pages refresh status while running, but they do not repeatedly download complete historical data:

- Image chat updates queue position, completed candidate count, latest progress time, provider status, success/failure state, and failure reason.
- Product workflows update node state, run state, and failure reasons.
- After a task ends, the page refreshes full details and shows new images, copy, or product history.
- Retryable failed tasks keep a retry entrypoint. Retry reuses the task's prompt, size, reference images, and advanced parameters.
- Running Image chat tasks can be cancelled; cancelled tasks do not write new candidates.

If a page does not change for a long time, check the running state and error message first, then refresh the page to confirm backend results.

---

## Common Questions

### Running a downstream card directly did not use new details?

First confirm that the right-side form has been saved. Runs use saved content, not unsaved input draft.

### Does the image-generation card have to connect to a reference image card?

It must connect to at least one downstream reference image card. The image-generation card only triggers and configures generation; image preview/download happens on the filled reference image card. If one image-generation card connects to multiple reference image cards, generation runs concurrently and fills those cards separately.

### Image quality is poor. How should I change the prompt?

Do not change many sentences at once. Change only one item per round: background, composition, lighting, or subject detail. This makes it easier to know which sentence improved the result.

### Template saving failed?

Confirm that you selected at least two nodes and did not include the **Product** node. User node-group templates store reusable workflow fragments. They cannot contain product-detail nodes and do not store generated images or copy outputs.

### Settings failed to save?

Check the field name in the page error message. A common cause is invalid image size format, such as needing `1024x1024`. Custom width/height does not need to be added to an allow-list beforehand, but width and height must be positive and each side must not exceed the system safety limit of `3840`. Image generation sizes are automatically calibrated to nearby 16-pixel multiples required by providers.

### Are complete prompts recorded in logs?

They should not be. The backend only saves necessary node summaries and artifact references. It should not log full prompts, secrets, uploaded bytes, or provider payloads.


--- FILE: docs\USER_GUIDE.md ---

# ProductFlow 新手教程与参考说明

[中文](USER_GUIDE.md) | [English](USER_GUIDE.en.md)

这份文档分两部分：

1. **新手教程**：少术语，照着点、照着填，生成一张能用的商品图。
2. **参考说明**：完成一次流程后，可以继续了解工作台卡片、提示词配置、模型设置和常见问题。

产品内顶部导航提供 **帮助** 页面，适合在使用中快速查看流程、模板、支持边界和常见问题。这份 Markdown 文档保留为仓库内文字参考，内容应与产品内帮助页保持一致。

工作台当前是 **ProductFlow 工作台**：中间是可缩放、可拖动的节点画布，桌面端右侧是一个精简侧栏，侧栏用小导航在 **详情 / 日志 / 图库 / 模板** 之间切换；移动端保留画布为主界面，用底部工具栏切换运行、单节点、模板、详情、日志和图库。普通操作不需要理解内部 DAG，只要记住：商品、参考图、文案、生图都是卡片；连接线表示“下游生成时参考上游”。

顶部导航还提供 **画廊**，用于收藏文/图生图里已经满意的生成结果，方便之后集中浏览和下载。

---

## 新手教程：从一张商品图开始

目标：上传一张商品图，补一点资料，生成文案，再生成一张满意的图片。

### 1. 新建商品

1. 点顶部导航里的 **商品/工作台**。
2. 点 **新建商品**。
3. 上传一张清楚的商品主图。
4. 填商品名，例如：`奶油白通勤托特包`。
5. 选择一个画布模板。新手可以选 **商品主图**，想完全自己搭建时选 **空白画布**。
6. 点 **创建并继续**。

你应该看到：页面进入这个商品的工作台，中间有几张可点击的卡片。

### 2. 补商品资料

1. 点击画布里的 **商品** 卡片。
2. 右侧会切到 **详情**。补充类目、价格、商品说明或本次想强调的方向。
3. 示例说明：`适合通勤和周末出门，轻便，大容量，奶油白配色。`
4. 点 **保存**，或等右侧状态显示 **已保存**。

你应该看到：表单保存成功。后面生成文案和图片时，会使用这些已保存资料。

### 3. 生成第一版文案

1. 点击 **文案** 卡片。
2. 在生成要求里写一句话，例如：

   ```text
   突出通勤、轻便、大容量，语气高级但不夸张。
   ```

3. 点 **运行当前节点**。如果你想从商品资料一路跑到图片，也可以点 **运行工作流**。

你应该看到：文案卡片生成一份可编辑的结构化文案。它可能是一段自由正文，也可能拆成短标签、文案块、布局分区和视觉建议。

如果不满意：只改一个方向再试，例如“更年轻一点”“更简洁一点”“少一点夸张词”。

文案详情里只会直接显示已有内容。空的可选字段会收起成“添加标签”“添加视觉建议”等按钮；长文本输入框会随内容自动增高。后续生图会读取这份结构化文案，不要求每次都填出标题、卖点、海报标题和按钮文案。

### 4. 添加或连接参考图

如果你有想参考的风格图，可以这样做：

1. 选择或新增一个 **参考图** 卡片。
2. 上传一张参考图片，例如你喜欢的光线、背景、构图或风格；参考图上传同样支持点击选择和拖拽上传。
3. 从参考图卡片边上的连接点拖到 **文案** 或 **生图** 卡片。

你只需要记住：**连过去 = 生成时参考它**。

你应该看到：画布上出现一条线。之后运行被连接的卡片时，会参考这张图的标签和图片信息。连错了可以选中连接线并删除，再重新拖一条。

### 5. 生成第一张图片

1. 点击 **生图** 卡片。
2. 确认 **生图** 卡片已经连到至少一个下游 **参考图** 卡片。生图卡片只负责触发生成，不自己展示/下载图片；生成结果会填进连过去的参考图卡片。
3. 写图片要求，例如：

   ```text
   白色托特包放在通勤桌面，旁边有笔记本电脑和咖啡，干净自然光，适合电商主图。
   ```

4. 点 **运行当前节点** 或 **运行工作流**。

你应该看到：下游参考图卡片被填入新图片，并在参考图卡片上提供预览和下载。右侧 **图库** 里也会聚合这张图，点击缩略图可在应用内放大预览，点 **下载** 才会下载原图。

如果没有连接下游参考图卡片，系统会提示你先连接至少一个图片/参考图节点，不会把图片悄悄放在生图卡片上。

### 6. 继续调整，直到满意

每轮只改一两个点，更容易判断哪句话有效。

常见调整方式：

- 主体不清楚：加 `商品占画面中心，主体完整，纹理清晰`。
- 背景太乱：加 `干净背景，减少道具，只保留 1-2 个陪衬物`。
- 风格不对：加 `自然光`、`杂志感构图`、`极简电商`、`暖色生活方式`。
- 卖点没体现：把最重要卖点写进第一句话，例如 `大容量`、`轻便`、`可通勤`。

可复制的改写示例：

```text
背景更干净，只保留电脑和咖啡；包身纹理要清晰，阴影柔和。
```

满意后可以下载图片；如果还想连续微调，点顶部导航里的 **文/图生图**。如果这张图来自文/图生图，也可以保存到 **画廊**，后面集中浏览。

### 画布基础操作

- **桌面缩放**：鼠标移到工作台画布区域后滚动滚轮，会以鼠标位置为中心缩放画布；右下角也有缩放按钮和百分比。
- **桌面平移**：按住画布空白处用左键拖动，可以移动视野；拖卡片、点按钮、上传、拖连接线时不会触发画布平移。
- **桌面移动卡片**：按住卡片主体或标题区域拖动，松手后位置会保存。刷新页面后仍会停在你放下的位置。
- **桌面连接卡片**：从卡片连接点拖到目标卡片，松手后生成连接线。连接线是工作流的一部分，不只是临时视觉效果。
- **桌面多选卡片**：在画布空白区域按住 Shift 拖出选择框，或按住 Ctrl / Cmd / Shift 点击多个节点。多选后可以一起拖动、删除，也可以保存为用户模板。
- **移动端浏览模式**：进入商品工作台时默认处于浏览模式。单指拖动画布空白处会平移视野，点按节点会选中节点，双指捏合会缩放画布。
- **移动端编辑模式**：底部模式切到 **编辑** 后，触控或触控笔可以拖动节点，也可以从输出连接点拖到目标节点创建连接。
- **移动端选择模式**：底部模式切到 **选择** 后，点按节点会加入或移出多选组；点按空白画布会退出临时选择模式。
- **移动端工具栏和面板**：底部工具栏提供运行工作流、单节点、模板、详情、日志和图库入口；这些侧栏内容在移动端从底部面板打开。
- **调整侧栏**：桌面端右侧侧栏负责详情、日志、图库和模板；它会尽量保持精简，不再用底部大面板占用画布空间。

### 模板

右侧 **模板** 面板用于在已有商品工作台中继续添加同一套内置场景模板。内置场景模板和新建商品时可选的模板来自同一套后端 catalog：

- **内置场景模板**：覆盖平台首图、详情说服、场景图册、内容种草和活动投放。添加到已有工作台时，模板里的商品资料节点会自动复用当前画布已有的商品节点。
- **用户模板**：多选两个或更多非商品资料节点后，可以把当前结构保存成自己的可复用模板。用户模板用于商品工作台内追加流程，当前不会出现在新建商品页。

保存用户模板时，只会保存可复用的节点配置和选中节点之间的内部连线，不会把已经生成的图片、文案产物或商品资料保存进模板。用户模板可以重命名和删除；删除模板不会影响已经插入到商品工作台里的节点。

### 7. 用文/图生图做细节微调

1. 点顶部导航里的 **文/图生图**。
2. 选择一个商品，或先自由生成。
3. 第一张可以直接写描述生成；后续修改需要先点击历史记录里一张已完成图片作为基图。
4. 用对话方式提出修改，例如：

   ```text
   保持包的角度不变，背景换成更明亮的办公室，减少桌面杂物。
   ```

5. 满意后，把图片回写到商品，后续工作台可以继续参考。

手机小屏上，文/图生图采用主视图、抽屉和底部面板组合：

- **顶部栏**：左侧按钮打开会话抽屉，中间显示当前会话标题；点铅笔可重命名，右侧按钮打开历史抽屉。
- **左侧会话抽屉**：新建、选择和删除会话。会话卡片显示最近缩略图、轮数和更新时间；选择会话后主视图会切到该会话。
- **右侧历史抽屉**：按分支展示候选和生成中占位。点已完成图片会把它设为当前结果，并作为下一轮基图；点占位会查看该候选的排队、生成、失败或取消状态。
- **主视图**：生成状态、当前结果、失败原因和供应商提示保留可见。多候选任务提交后，历史里会先出现对应数量的占位；运行中页面只刷新轻量状态，任务结束后刷新完整会话详情。
- **底部快捷条**：始终提供“生成”入口。选中已完成结果后，快捷条还会显示下载和收藏到画廊。
- **底部生成面板**：包含生成设置和高级标签页。生成设置管理商品关联、商品参考图、会话参考图、画面描述、尺寸和候选数量；高级区域管理已启用的图片工具参数。底部提交按钮按当前候选数量发起生成。

### 8. 收藏到画廊

文/图生图结果里可以把满意的生成图保存到 **画廊**。画廊会保留图片来源、关联商品、提示词、尺寸和模型信息，并提供下载入口。

适合保存到画廊的内容：

- 暂时不想挂回某个商品，但以后可能复用的背景/构图。
- 已经满意、需要集中给别人挑选的候选图。
- 调参过程中效果不错但不是当前商品最终稿的图片。

---

## 参考说明：工作台里有哪些卡片

这些说明是给已经跑通过一次流程、想更准确控制结果的用户看的。

### 商品

保存商品名、类目、价格和说明。下游生成会优先读取最新已保存的商品资料。

### 参考图

一个参考图卡片只放当前一张图。你可以手动上传，也可以让生图卡片把新图填进来。新图会替换这个卡片里的当前图；旧素材仍保留在商品历史里。

选中参考图卡片时，右侧 **图库** 里的素材会出现填充动作。选择已有素材填充时，系统会复用已有素材记录，不会为了同一张图再创建重复上传。

### 文案

生成可编辑的结构化文案。文案可以是自由正文、文案块或布局分区，并可附带视觉建议。生成后可以在卡片里继续编辑，编辑后的结构化文案会被后续生图使用。

历史记录里可能仍有标题、卖点、海报主标题和按钮文案；当前工作台会把结构化文案作为后续生图上下文，不需要为了固定字段编造不需要的 CTA 或卖点。

### 生图

根据商品资料、文案、参考图和你写的图片要求触发图片生成。它不是图片槽位：生成出的图片会填入连接的下游参考图卡片；如果没有连接下游参考图卡片，运行会失败并提示先连接至少一个图片/参考图节点。

生图卡片现在会区分“只看商品资料直接生图”和“带文案/参考图上下文生图”：当你连接了上游文案或参考图，生成会读取这些上下文；没有连接文案时，也可以根据商品资料和节点里的图片要求直接尝试生成。

---

## 参考说明：连接和运行

- 把 A 连到 B：B 生成时会参考 A。
- 只想试一个卡片：选中卡片后运行当前节点。
- 想从商品资料一路生成到图片：运行整个工作流。
- 运行前建议确认右侧表单已经保存；如果选中卡片还有未保存草稿，当前运行按钮会先尝试保存，再开始运行。
- 工作流运行中可以继续整理画布位置，但不要重复点击运行或做结构变更。
- 图片生成结果不在生图卡片上下载；请去下游参考图卡片或右侧 **图库**。
- 运行中的工作流可以在包含该节点的详情或日志区域取消；失败且可重试的运行会提供重试入口。
- 失败提示会尽量区分供应商配额/限流、内容策略、网络中断、请求超时、服务异常和参数不支持。

---

## 参考说明：提示词配置

进入顶部导航 **配置**，找到 **提示词** 分组，可以调整长期默认提示词配置项：

- `prompt_brief_system`：商品理解默认提示词。
- `prompt_copy_system`：文案生成默认提示词。
- `prompt_poster_image_template`：工作台海报/图片生成模板。
- `prompt_poster_image_edit_template`：工作台带上游文案或参考图上下文的改图模板。
- `prompt_poster_image_reference_policy`：工作台生图模板中的视觉参考规则，用于 `reference_policy` 占位符。
- `prompt_image_chat_template`：文/图生图模板。

建议用法：

- 单次想要什么效果：写在文案卡片或生图卡片里。
- 长期希望系统都保持某种口吻或格式：改配置页里的提示词。
- 不确定怎么改：复制默认值，少量调整后保存测试。

恢复默认会删除数据库里的自定义值，回到系统默认提示词。

常用占位符：

- 工作台海报/图片生成模板：`product_name`、`category`、`price`、`source_note`、`instruction`、`context_block`、`reference_policy`、`size`、`kind`、`kind_label`、`kind_requirements`。
- 工作台改图模板：`product_name`、`category`、`price`、`source_note`、`instruction`、`context_block`、`reference_policy`、`size`、`kind`、`kind_label`、`kind_requirements`。
- 文/图生图模板：`prompt`、`size`、`history_block`。

如果占位符写错，系统不会因为未知占位符直接崩掉，但那一段可能不会按预期替换。建议小幅修改后测试。

---

## 参考说明：模型与运行时设置

顶部导航 **配置** 里还可以管理：

- 文案供应商和文案模型。
- 图片供应商和图片模型。
- 供应商档案，包括供应商类型、连接信息、API Key 和接口能力；Google Gemini 档案使用官方 SDK endpoint，不配置 Base URL。
- 默认图片尺寸。文/图生图和工作台生图都可以直接选择 1K / 2K / 4K 常用画框，也可以输入自定义宽高。
- 文/图生图进度闲置恢复阈值，默认 90 分钟；系统会按最近生成进度 heartbeat 判断运行中任务是否闲置。
- 上传文件大小限制。

供应商档案里的密钥不会回显。编辑档案时留空 API Key 会保留旧值；输入新值才会写入数据库。

## 参考说明：运行中状态

文案、海报、工作流和文/图生图都是后台任务。页面运行中会刷新状态，但不会反复下载完整历史数据：

- 文/图生图运行中会更新队列位置、已完成候选数、最近进度时间、供应商状态、失败/成功状态和失败原因。
- 商品工作流运行中会更新节点状态、运行状态和失败原因。
- 任务结束后，页面再刷新完整详情，显示新图片、新文案或新的商品历史。
- 可重试的失败任务会保留重试入口。重试会复用本次任务的提示词、尺寸、参考图和高级参数。
- 运行中的文/图生图任务可以取消；取消后的任务不会继续写入新候选。

如果页面长时间没有变化，可以先看运行状态和错误提示，再刷新页面确认后台结果。

---

## 常见问题

### 直接运行下游卡片，没有用上新资料？

先确认右侧表单已经保存。运行使用的是已保存内容，不是还没保存的输入框草稿。

### 生图卡片必须连接参考图卡片吗？

必须至少连接一个下游参考图卡片。生图卡片只负责触发和配置生成，图片预览/下载在被填充的参考图卡片上完成；一个生图卡片连接多个参考图卡片时，会并发生成并分别填充这些卡片。

### 图片效果不好，应该怎么改？

不要一次改很多句。每轮只改背景、构图、光线或主体细节中的一项。这样更容易知道哪句话让结果变好。

### 模板保存失败？

确认已经多选至少两个节点，并且不要把 **商品** 节点一起保存。用户模板只保存可复用流程片段，不能包含商品资料节点，也不会保存已经生成的图片或文案结果。

### 配置保存失败？

看页面错误提示里的字段名。常见原因是图片尺寸格式不对，例如应该写 `1024x1024`；自定义宽高不需要提前加入任何允许列表，但宽高必须为正且单边不能超过系统的 `3840` 安全上限。生图尺寸会按供应商要求自动校准到接近的 16 像素倍数。

### 会不会在日志里记录完整提示词？

不应该。后端只保存必要的节点摘要和产物引用，不应记录完整提示词、密钥、上传字节或 provider payload。


--- FILE: README.en.md ---

<p align="center">
  <img src="docs/assets/productflow-brand-concept.png" alt="ProductFlow brand concept: product card connected to AI copy and image workflow nodes" width="168">
</p>

# ProductFlow

[中文](README.md) | English
<p align="center">
  <a href="https://draw.devbin.de"><strong>Live Demo / 体验站</strong></a>
</p>

ProductFlow is an open-source, self-hosted product creative workspace for solo merchants and small teams. Its core flow covers product information, reference images, AI copywriting, AI/template posters, iterative image sessions, a generated image gallery, and a visual workflow.

The current form is a private single-admin instance. A self-hosted deployment requires PostgreSQL, Redis, the backend API, Dramatiq worker, Web frontend, and usable text/image model providers.

## Feature Overview

### Products / Workbench

- Single-admin access-key login with Cookie session access to backend APIs.
- Product list, paginated browsing, product creation, product detail workbench, and product deletion protected by a global switch; the mobile product list uses cards and floating pagination.
- Node canvas for product information, reference images, copy nodes, and image-generation nodes.
- Desktop canvas interactions: mouse-wheel zoom, drag panning on blank canvas, node dragging, node connections, edge deletion, Ctrl/Cmd/Shift multi-select, and Shift box selection.
- The mobile product workbench keeps the canvas as the main surface and provides Browse, Edit, and Select modes; it supports one-finger pan, node tap selection, two-finger zoom, touch node dragging, touch edge creation, and tap-based multi-select.
- The mobile bottom toolbar opens workflow run, Single node, Templates, Details, Runs, and Library entrypoints, with panel content shown from a bottom sheet.
- Full-canvas templates for product creation; built-in node-group templates and user node-group templates for adding flows inside the workbench.
- Product source images, reference images, and iterative image-session references support click-to-select and drag-and-drop upload, protected by MIME, size, pixel, and count limits.
- Reference image nodes are single-image slots. Manual upload or upstream generation replaces the current image, while old assets stay in product history/assets.
- Copy nodes support generation, editing, confirmation, and history; current outputs are editable structured copy used by later image generation.
- Image-generation nodes only trigger and configure generation; results are written into connected downstream reference image nodes and previewed/downloaded from the reference image or Library sidebar.

### Text / Image Generation

- Standalone image sessions support reference uploads, base image selection from history, iterative generation, multiple-candidate comparison, and a mobile main-view/drawer/bottom-sheet layout.
- Mobile image chat uses a top bar for the session drawer, current session title/rename, and history drawer; generation status, the current result, and provider notes remain in the main view.
- Sessions open from the left drawer for create, select, and delete actions; branch/candidate history opens from the narrow right drawer, and tapping a completed image selects it as the current result and next base image.
- The bottom action bar always exposes the generation entry. After a completed result is selected, it also exposes download and send-to-gallery. The bottom generation sheet contains Generation / Advanced tabs, product linking, product/session references, prompt, size, candidate count, and image tool parameters.
- Running state includes queue position, lightweight status refresh, candidate progress, failure reasons, cancel, and retry.
- Generated images can be downloaded, sent to the gallery, saved as product reference images, or saved as product main-image references.

### Gallery

- `/gallery` centrally stores generated image results.
- Entries keep source session, linked product, prompt, size, model, and download entrypoint.

### Configuration and Runtime

- `/settings` supports runtime business overrides: provider, model, image size, image tool parameters, prompt templates, upload limits, global concurrency, business deletion switch, and more.
- Image tool parameters can control advanced fields sent to the Responses `image_generation` tool, including allowed fields, quality, output format, compression, background, moderation, action, input fidelity, partial images, and provider `n`. Responses background mode is enabled by default and falls back to synchronous requests when unsupported.
- Secret fields are not echoed back. The settings page is protected by an independent `SETTINGS_ACCESS_TOKEN` secondary unlock.
- Copy, poster, product workflow, and iterative image generation are dispatched through Dramatiq + Redis, with PostgreSQL as state storage.
- API/worker startup recovers unfinished copy/poster jobs, product workflows, and iterative image tasks.
- Running product workflows and iterative image generation only poll lightweight status responses, then refresh full details after completion.

### In-Product Help

- The top navigation provides a `/help` page.
- Help is organized by real product areas: getting started, canvas workbench, gallery, text/image generation, and settings.
- The help page includes left-side page navigation, a local table of contents, previous/next links, and local full-text search.

### Preview

![Product list example](images/preview1.png)

![Product workbench example](images/preview2.png)

![New product example](images/preview3.png)

![Image-to-image panel example](images/preview4.png)

![Dark mode and English mode example](images/preview5.png)

## Current Boundaries

ProductFlow does not currently provide multi-user/multi-tenant support, team permissions, payments, hosted account systems, automatic ad placement/listing, video generation, Kubernetes/Helm/released container images, or other production orchestration packages. The in-repository Docker Compose self-hosting path is available.

## Product Entry Points and Docs

- In-product help: top navigation **Help**, route `/help`
- New user guide reference: `docs/USER_GUIDE.en.md`
- Architecture guide: `docs/ARCHITECTURE.en.md`
- Current architecture health review: `docs/ARCHITECTURE_HEALTH_REVIEW.en.md`
- Roadmap: `docs/ROADMAP.en.md`
- Version history: `CHANGELOG.md`
- Brand assets: `docs/assets/productflow-brand-concept.png`, `docs/assets/productflow-mark.svg`
- Web metadata / favicon assets: `web/public/productflow-brand-concept.png`, `web/public/productflow-mark.svg`

## Tech Stack

- Backend: Python 3.12, FastAPI, SQLAlchemy, Alembic, Dramatiq, Redis, PostgreSQL, Pillow, OpenAI Python SDK.
- Frontend: React 19, Vite, TypeScript, React Router, TanStack Query, Tailwind CSS 4.
- Local development entrypoint: root `justfile`; if `just` is unavailable, raw commands are listed below.
- Docs: `docs/PRD.en.md`, `docs/USER_GUIDE.en.md`, `docs/ARCHITECTURE.en.md`, `docs/ARCHITECTURE_HEALTH_REVIEW.en.md`, `docs/ROADMAP.en.md`, `CHANGELOG.md`.

## Open Source Dependencies and Thanks

Beyond ProductFlow's application code, this repository keeps a set of project workflow assets for AI-assisted collaboration. Special thanks first to the sincere, kind, united, and professional Linuxdo community.

<p>
  <a href="https://linux.do">
    <img src="https://img.shields.io/badge/LinuxDo-community-1f6feb" alt="LinuxDo">
  </a>
</p>

- [LinuxDo](https://linux.do) 学 ai, 上 L 站!

Thanks also to the open-source projects that most influenced this repository's structure, development approach, and collaboration experience.

<p>
  <a href="https://github.com/mindfold-ai/Trellis">
    <img src="https://raw.githubusercontent.com/mindfold-ai/Trellis/main/assets/trellis.png" alt="Trellis" height="32">
  </a>
  &nbsp;
  <a href="https://openai.com/codex/">
    <img src="https://img.shields.io/badge/OpenAI%20Codex-AI%20coding-412991?logo=openai&logoColor=white" alt="OpenAI Codex">
  </a>
  &nbsp;
</p>

- [Trellis](https://github.com/mindfold-ai/Trellis) provides task workflow, specification capture, and context-injection conventions for this project. The repository keeps `.trellis/workflow.md`, `.trellis/scripts/`, and `.trellis/spec/` so contributors can understand the requirement, implementation, check, and wrap-up process.
- [OpenAI Codex](https://openai.com/codex/) / Codex CLI participates in this project's development collaboration flow. The repository's `.codex/`, `.agents/skills/`, and `AGENTS.md` store project-level instructions, hooks, skills, and sub-agent configuration for AI coding agents.

## Repository Structure

```text
ProductFlow/
  README.md
  README.en.md
  LICENSE
  CONTRIBUTING.md
  CONTRIBUTING.en.md
  SECURITY.md
  SECURITY.en.md
  CHANGELOG.md
  .env.example
  .env.dev.example
  docker-compose.yml
  .dockerignore
  justfile
  scripts/
    release.sh
    with_dev_env.sh
  docs/
    PRD.md
    PRD.en.md
    USER_GUIDE.md
    USER_GUIDE.en.md
    ARCHITECTURE.md
    ARCHITECTURE.en.md
    ARCHITECTURE_HEALTH_REVIEW.md
    ARCHITECTURE_HEALTH_REVIEW.en.md
    ROADMAP.md
    ROADMAP.en.md
    assets/
      productflow-brand-concept.png
      productflow-mark.svg
  backend/
    Dockerfile
    pyproject.toml
    alembic.ini
    alembic/versions/
    src/productflow_backend/
    tests/
  web/
    Dockerfile
    nginx.conf
    package.json
    public/
      productflow-brand-concept.png
      productflow-mark.svg
    src/
  .trellis/
    workflow.md
    scripts/
    spec/
```

`.trellis/spec/`, `.trellis/workflow.md`, and `.trellis/scripts/` are project development specifications and task tools. They stay in the repository so contributors can understand the conventions. `.trellis/tasks/` and `.trellis/workspace/` are local task/developer runtime contexts and should not be publicly tracked.

## Quick Start: One-Command Self-Hosting with Docker Compose

This path is for single-machine self-hosted deployment. The default configuration can run the basic flow. After configuring real model providers, persistent storage, and reverse proxy/HTTPS, it can be used as a foundation for small-scale production. The host only needs Docker / Docker Compose; Python, `uv`, Node, `pnpm`, and `just` are not required. Compose builds and starts PostgreSQL, Redis, the backend API, the Dramatiq worker, and the Web static site.

### 1. Copy and edit environment variables

```bash
cp .env.example .env
```

At minimum, change these values:

- `ADMIN_ACCESS_KEY`: admin key used to log in to the backend UI.
- `SETTINGS_ACCESS_TOKEN`: secondary unlock token for the settings page; it must be different from the login key.
- `SESSION_SECRET`: long random string used to sign session cookies.
- `POSTGRES_PASSWORD`: PostgreSQL password; Compose uses it to build the in-container `DATABASE_URL`.

The default provider is `mock`, and `POSTER_GENERATION_MODE=template`, so you can complete basic flows such as creating products, generating copy, and rendering template posters without real model keys. Read "Model and Provider Configuration" before switching to real models.

### 2. Build and start everything

```bash
docker compose up -d --build
```

Do not append service names to this command; adding a service name starts only that service. The complete self-hosted stack should start all services together.

Compose starts these services by default:

- PostgreSQL: service name `productflow-postgres`, Compose volume `productflow-postgres-data`, host port `${POSTGRES_HOST_PORT:-15432}`.
- Redis: service name `productflow-redis`, AOF persistence volume `productflow-redis-data`, host port `${REDIS_HOST_PORT:-16379}`.
- Backend API: service name `productflow-backend`, host port `${APP_HOST_PORT:-29280}`.
- Dramatiq worker: service name `productflow-worker`, sharing database, Redis, and storage volumes with the API.
- Web: service name `productflow-web`, nginx static service, host port `${WEB_PORT:-29281}`.

If a port is already occupied, edit `APP_HOST_PORT`, `WEB_PORT`, `POSTGRES_HOST_PORT`, or `REDIS_HOST_PORT` in `.env`, then run `docker compose up -d --build` again. Containers still connect to one another through service names, so you do not need to change application `DATABASE_URL` / `REDIS_URL`.

The in-container application uses Compose network service names:

```text
DATABASE_URL=postgresql+psycopg://productflow:<POSTGRES_PASSWORD>@productflow-postgres:5432/productflow
REDIS_URL=redis://productflow-redis:6379/0
STORAGE_ROOT=/app/storage
```

At runtime, container `STORAGE_ROOT` is fixed to `/app/storage`; do not write host paths into it. By default, uploaded and generated files are stored in the Docker named volume `productflow-storage` and persist across container restarts.

When migrating from an older systemd production environment, if you already have a production file directory such as `/home/cot/ProductFlow-release/shared/storage`, set this host-only variable in `.env` to reuse it:

```bash
STORAGE_HOST_PATH=/home/cot/ProductFlow-release/shared/storage
```

`STORAGE_HOST_PATH` is only the host path used by the Compose bind mount. API/worker containers still use `STORAGE_ROOT=/app/storage`. If empty or unset, Compose uses the `productflow-storage` named volume. Do not run `docker compose down -v` for normal updates, and do not delete Docker volumes just to switch storage mounts. To return to the named volume, remove `STORAGE_HOST_PATH` and run `docker compose up -d`.

### 3. Database migration

The `productflow-backend` startup command first runs:

```bash
alembic upgrade head
```

`uvicorn` starts only after migrations succeed. After upgrading code, if you need to rerun migrations manually:

```bash
docker compose run --rm productflow-backend alembic upgrade head
```

### 4. Access and health checks

With default ports:

```bash
docker compose ps
curl http://127.0.0.1:29280/healthz
curl http://127.0.0.1:29281/api/healthz
```

If you changed ports in `.env`, replace them with the corresponding values:

```bash
curl "http://127.0.0.1:<APP_HOST_PORT>/healthz"
curl "http://127.0.0.1:<WEB_PORT>/api/healthz"
```

Expected API response:

```json
{"status":"ok"}
```

Default Web entrypoint: `http://127.0.0.1:29281` (or the `WEB_PORT` from `.env` if changed). Log in with `ADMIN_ACCESS_KEY` from `.env`. The Web image serves Vite-built static assets through nginx, and nginx reverse-proxies same-origin `/api/*` requests to `productflow-backend:29280`.

### 5. Logs, stop, and cleanup

```bash
docker compose logs -f productflow-backend productflow-worker productflow-web
docker compose down
```

Stopping services does not delete data volumes. Only run this when you are sure you want to clear the database, Redis, and storage:

```bash
docker compose down -v
```

## Local Development Path

Use the local development path when changing code and using hot reload.

### 1. Prepare tools

Required on the host:

- Python 3.12+
- `uv`
- Node.js 20+ or a compatible version
- `pnpm`
- Docker / Docker Compose
- `just` (optional; raw commands are also listed below)

### 2. Copy environment variables

```bash
cp .env.example .env
cp .env.dev.example .env.dev
cp web/.env.example web/.env
```

The `DATABASE_URL` / `REDIS_URL` in `.env.example` target the Compose container network. Local hot-reload development commands use `.env.dev` to connect through host `localhost:${POSTGRES_HOST_PORT:-15432}` and `localhost:${REDIS_HOST_PORT:-16379}`. At minimum, change these values in `.env` / `.env.dev` to your own random values:

- `ADMIN_ACCESS_KEY`: admin key used to log in to the backend UI.
- `SETTINGS_ACCESS_TOKEN`: secondary unlock token for the settings page; it must be different from the login key.
- `SESSION_SECRET`: long random string used to sign session cookies.
- `POSTGRES_PASSWORD`: local PostgreSQL password; keep it consistent with the password in `.env.dev`'s `DATABASE_URL`.

`.env.dev.example` uses development ports, Redis DB 1, and `backend/storage-dev`. The database name matches the default `docker-compose.yml`. If you use a separate development database, create it in PostgreSQL first, then adjust `.env.dev`'s `DATABASE_URL`. Local development storage is isolated from production Compose storage: `just backend-run` / `just backend-worker` and their raw equivalents read `STORAGE_ROOT=./backend/storage-dev` from `.env.dev`. Do not start local development processes by shell-sourcing production `.env` or importing production `STORAGE_HOST_PATH`.

### 3. Start development dependencies only

For local hot reload, use Compose only for PostgreSQL and Redis. The API, worker, and Web are started by host commands in the next step. The complete self-hosted stack uses `docker compose up -d --build` from the previous section.

```bash
docker compose up -d productflow-postgres productflow-redis
```

### 4. Install dependencies and migrate the database

With `just`:

```bash
just backend-install
just web-install
just backend-migrate
```

Without `just`:

```bash
uv sync --directory backend --extra dev
pnpm --dir web install
bash scripts/with_dev_env.sh uv run --directory backend alembic upgrade head
```

### 5. Start backend, worker, and frontend

Run these in three terminals. With `just`:

```bash
just backend-run
just backend-worker
just web-dev
```

Without `just`:

```bash
bash scripts/with_dev_env.sh bash -lc 'uv run --directory backend uvicorn productflow_backend.main:app --reload --host 0.0.0.0 --port "${APP_PORT:-29282}"'
bash scripts/with_dev_env.sh uv run --directory backend dramatiq --processes 2 --threads 4 productflow_backend.workers
bash scripts/with_dev_env.sh bash -lc 'web_port="${WEB_PORT:-29283}"; api_target="${VITE_DEV_PROXY_TARGET:-http://127.0.0.1:${APP_PORT:-29282}}"; VITE_API_BASE_URL= VITE_DEV_PROXY_TARGET="$api_target" pnpm --dir web dev -- --host 0.0.0.0 --port "$web_port" --strictPort'
```

Default development ports come from `.env.dev.example`:

- API: `http://localhost:29282`
- Web: `http://localhost:29283`

Open the Web page and log in with `ADMIN_ACCESS_KEY`. The top navigation provides **Products / Workbench**, **Image chat**, **Gallery**, **Help**, and **Settings**.

### 6. Development health check

```bash
curl http://127.0.0.1:29282/healthz
```

Expected response:

```json
{"status":"ok"}
```

## Model and Provider Configuration

ProductFlow configures text and image capabilities separately. Infrastructure configuration (database, Redis, session, admin key) is still read only from environment variables. Business configuration can be written to the database from the frontend `/settings` page and override environment defaults.

The login gate `admin_access_required` is enabled by default: normal workspace pages and private APIs require login with `ADMIN_ACCESS_KEY` first. Administrators can disable this gate after the secondary `/settings` unlock, allowing the ordinary workspace/API to be used without the admin key. `ADMIN_ACCESS_KEY` still must remain in the environment for future re-enabling, and `SETTINGS_ACCESS_TOKEN` always protects settings reads and writes independently.

Business hard deletion is disabled by default: when `DELETION_ENABLED=false`, product deletion and iterative image-session deletion APIs return 403 so demo sites can preserve evidence for policy review. Workflow node/edge editing and reference-image deletion are not affected. To remove whole products or sessions, an administrator can explicitly enable "business deletion" in `/settings`, or enable the environment default.

Text providers:

- `TEXT_PROVIDER_KIND=mock`: local fake implementation for development and testing.
- `TEXT_PROVIDER_KIND=openai`: OpenAI Responses-compatible interface.
- Related variables: `TEXT_API_KEY`, `TEXT_BASE_URL`, `TEXT_BRIEF_MODEL`, `TEXT_COPY_MODEL`.

Image providers:

- `IMAGE_PROVIDER_KIND=mock`: local fake image implementation.
- `IMAGE_PROVIDER_KIND=openai_responses`: OpenAI Responses `image_generation` tool with reference image input. ProductFlow's current iterative image branch context is determined by the base image and reference images explicitly selected by the user; it does not automatically send the entire historical image chain to the provider.
- Related variables: `IMAGE_API_KEY`, `IMAGE_BASE_URL`, `IMAGE_GENERATE_MODEL`, `IMAGE_RESPONSES_BACKGROUND_ENABLED`, `IMAGE_GENERATION_MAX_DIMENSION`, `IMAGE_MAIN_IMAGE_SIZE`, `IMAGE_PROMO_POSTER_SIZE`.
- Advanced tool parameters: `IMAGE_TOOL_ALLOWED_FIELDS` controls which tool fields the frontend can show, the backend can persist, and the provider request can include. Optional defaults also include `IMAGE_TOOL_MODEL`, `IMAGE_TOOL_QUALITY`, `IMAGE_TOOL_OUTPUT_FORMAT`, `IMAGE_TOOL_OUTPUT_COMPRESSION`, `IMAGE_TOOL_BACKGROUND`, `IMAGE_TOOL_MODERATION`, `IMAGE_TOOL_ACTION`, `IMAGE_TOOL_INPUT_FIDELITY`, `IMAGE_TOOL_PARTIAL_IMAGES`, and `IMAGE_TOOL_N`.

Poster modes:

- `POSTER_GENERATION_MODE=template`: render with local templates/Pillow without calling an image model.
- `POSTER_GENERATION_MODE=generated`: send confirmed copy and product/reference images to the image provider to generate posters.

Prompt templates:

- The prompt group in `/settings` can override templates for product understanding, copy generation, workbench image generation, and iterative image generation.
- Put one-off requirements into copy/image nodes; update settings-page templates only for long-term shared tone or format.

## Common Commands

| Purpose | With `just` | Without `just` |
|---|---|---|
| Install backend dependencies | `just backend-install` | `uv sync --directory backend --extra dev` |
| Install frontend dependencies | `just web-install` | `pnpm --dir web install` |
| Apply development DB migration | `just backend-migrate` | `bash scripts/with_dev_env.sh uv run --directory backend alembic upgrade head` |
| Start development API | `just backend-run` | `bash scripts/with_dev_env.sh bash -lc 'uv run --directory backend uvicorn productflow_backend.main:app --reload --host 0.0.0.0 --port "${APP_PORT:-29282}"'` |
| Start Dramatiq worker | `just backend-worker` | `bash scripts/with_dev_env.sh uv run --directory backend dramatiq --processes 2 --threads 4 productflow_backend.workers` |
| Run backend pytest | `just backend-test` | `uv run --directory backend pytest` |
| Start Vite dev server | `just web-dev` | `bash scripts/with_dev_env.sh bash -lc 'web_port="${WEB_PORT:-29283}"; api_target="${VITE_DEV_PROXY_TARGET:-http://127.0.0.1:${APP_PORT:-29282}}"; VITE_API_BASE_URL= VITE_DEV_PROXY_TARGET="$api_target" pnpm --dir web dev -- --host 0.0.0.0 --port "$web_port" --strictPort'` |
| Run frontend lint | no just wrapper | `pnpm --dir web lint` |
| Run frontend unit tests | no just wrapper | `pnpm --dir web test:run` |
| TypeScript check + Vite build | `just web-build` | `pnpm --dir web build` |
| Release dry run | `just release-dry-run` | `DRY_RUN=1 bash scripts/release.sh` |
| Production update | `just release` | `bash scripts/release.sh` |

`just release` / `bash scripts/release.sh` is the Docker Compose production update entrypoint. It first runs `docker compose config --quiet`, then attempts to stop legacy user-level systemd services that may occupy ports `29280/29281` (`productflow-backend.service`, `productflow-worker.service`, `productflow-web.service`), then runs `docker compose up -d --build --remove-orphans` and checks backend `/healthz`, web `/healthz`, and web proxy `/api/healthz`. This process does not delete Docker volumes; do not use `docker compose down -v` for normal updates. To reuse files from an old systemd production setup, set `STORAGE_HOST_PATH=/home/cot/ProductFlow-release/shared/storage` in `.env` first. If you have already manually moved old services away, you can temporarily run `LEGACY_SYSTEMD_ACTION=skip bash scripts/release.sh`, or `LEGACY_SYSTEMD_ACTION=skip just release`.

`just release-dry-run` / `DRY_RUN=1 bash scripts/release.sh` only validates Compose configuration and prints the steps a real release would execute. It does not stop systemd services, build images, start containers, or switch running services.

## Main API Resources

The backend exposes REST APIs only. Main entrypoints include:

- `POST /api/auth/session`, `GET /api/auth/session`, `DELETE /api/auth/session`
- `/api/products`, `/api/products/{product_id}`, `/api/products/{product_id}/history`
- `/api/products/{product_id}/reference-images`, `/api/source-assets/{asset_id}`, `/api/source-assets/{asset_id}/download`
- `/api/copy-sets/{copy_set_id}`, `/api/copy-sets/{copy_set_id}/confirm`
- `/api/posters/{poster_id}/download`
- `/api/image-sessions`, `/api/image-sessions/{image_session_id}`, `/api/image-sessions/{image_session_id}/status`, `/api/image-session-assets/{asset_id}/download`
- `/api/gallery`
- `/api/generation-queue`
- `/api/products/{product_id}/workflow`, `/api/products/{product_id}/workflow/status`, `/api/products/{product_id}/workflow/run`, `/api/products/{product_id}/workflow/runs/{run_id}/cancel`
- `/api/workflow/canvas-templates`, `/api/workflow/user-template-groups`
- `/api/workflow-nodes/{node_id}`, `/api/workflow-edges/{edge_id}`
- `/api/settings`, `/api/settings/lock-state`, `/api/settings/unlock`, `/api/settings/runtime`

This list contains common resource entrypoints, not a complete OpenAPI reference. Operation endpoints also include iterative image generate/cancel/retry/save-to-gallery, workflow retry, template insertion, and user-template management.

## Open Source and Security Boundaries

- License: MIT, see `LICENSE`.
- Contribution guide: see `CONTRIBUTING.en.md`.
- Security reporting: see `SECURITY.en.md`.
- Do not commit `.env`, `web/.env`, local storage, build outputs, caches, logs, or `.trellis/tasks/` / `.trellis/workspace/`.
- Real provider API keys should only be stored in local environment variables or private deployment configuration. Do not write them into issues, PRs, or documentation examples.


--- FILE: README.md ---

<p align="center">
  <img src="docs/assets/productflow-brand-concept.png" alt="ProductFlow brand concept: product card connected to AI copy and image workflow nodes" width="168">
</p>

# ProductFlow

[中文](README.md) | [English](README.en.md)
<p align="center">
  <a href="https://draw.devbin.de"><strong>体验站 / Live Demo</strong></a>
</p>

ProductFlow 是面向单人或小团队商家的开源自托管商品素材工作台。核心链路覆盖商品资料、参考图、AI 文案、AI/模板海报、连续生图会话、生成图画廊和可视化工作流。

当前形态为私有单管理员实例。自托管部署需要 PostgreSQL、Redis、后端 API、Dramatiq worker、Web 前端，以及可用的文本/图片模型供应商。

## 功能概览

### 商品/工作台

- 单管理员访问密钥登录，基于 Cookie session 访问后台 API。
- 商品列表、分页浏览、创建商品、商品详情工作台、受全局开关保护的商品删除；移动端商品列表使用卡片和浮动分页。
- 节点画布组织商品资料、参考图、文案节点和生图节点。
- 桌面画布支持滚轮缩放、空白处拖动平移、节点拖拽定位、节点连线、边删除、Ctrl/Cmd/Shift 多选、Shift 框选。
- 移动端商品工作台保留画布为主界面，提供浏览、编辑和选择模式；支持单指平移、点选节点、双指缩放、触控拖拽节点、触控创建连线和点按多选。
- 移动端底部工具栏提供运行工作流、单节点、模板、详情、日志和图库入口，面板内容从底部展开。
- 完整画布模板用于创建商品；内置节点组模板和用户节点组模板用于工作台内追加流程。
- 商品原图、参考图、连续生图参考图支持点击选择或拖拽上传，并受 MIME、大小、像素和数量限制保护。
- 参考图节点是单图槽位；手动上传或上游生图填充会替换当前图，旧素材保留在商品历史/素材列表中。
- 文案节点支持生成、编辑、确认和历史查看，当前输出是后续生图可直接读取的可编辑结构化文案。
- 生图节点只负责触发和配置生成；生成结果写入连接的下游参考图节点，并在参考图节点或图库面板预览和下载。

### 文/图生图

- 独立图片会话支持参考图上传、历史基图选择、连续生成、多候选比较和移动端主视图/抽屉/底部面板布局。
- 移动端文/图生图顶部栏提供会话抽屉、当前会话标题/重命名和历史抽屉；生成状态、当前结果和供应商提示保留在主视图。
- 会话列表从左侧抽屉打开，可新建、选择和删除会话；分支/候选历史从右侧窄抽屉打开，点击已完成图片会设为当前结果和下一轮基图。
- 底部快捷条始终提供生成入口；选中已完成结果后，同时提供下载和投至画廊。底部生成面板包含生成设置/高级标签页、商品关联、商品/会话参考图、提示词、尺寸、候选数量和图片工具参数。
- 运行状态包含排队位置、轻量状态刷新、候选进度、失败原因、取消和重试。
- 生成图可下载、投至画廊、保存为商品参考图，或设为商品主图参考。

### 画廊

- `/gallery` 集中保存文/图生图结果。
- 条目保留来源会话、关联商品、提示词、尺寸、模型和下载入口。

### 配置与运行

- `/settings` 支持运行时业务配置覆盖：provider、模型、图片尺寸、图片工具参数、提示词模板、上传限制、全局并发、业务删除开关等。
- 图片工具参数可控制 Responses `image_generation` tool 的可用字段、质量、输出格式、压缩、背景、审核、action、input fidelity、partial images 和 provider `n` 等高级参数；Responses 后台响应模式默认开启，不支持时会回退同步请求。
- Secret 字段不回显；配置页由独立 `SETTINGS_ACCESS_TOKEN` 二次解锁。
- 文案、海报、商品工作流和文/图生图由 Dramatiq + Redis 投递，PostgreSQL 记录状态。
- API/worker 启动时恢复未完成文案/海报任务、商品工作流和连续生图任务。
- 运行中商品工作流和文/图生图只轮询轻量 status，结束后刷新完整详情。

### 产品内帮助

- 顶部导航提供 `/help` 帮助页。
- 帮助页按真实页面域组织：入门、画布工作台、画廊、文/图生图、配置。
- 文档页包含左侧分页导航、本页目录、上一页/下一页和本地全文搜索。

### 界面预览

![商品列表示例](images/preview1.png)

![商品工作台示例](images/preview2.png)

![新建商品示例](images/preview3.png)

![图生图面板示例](images/preview4.png)

![暗色模式与英文模式示例](images/preview5.png)

## 当前边界

暂不提供多用户/多租户、团队权限、支付、托管账号体系、自动投放/自动上架、视频生成、Kubernetes/Helm/发布版容器镜像等生产编排包。仓库内 Docker Compose 自托管路径已可用。

## 产品入口与文档

- 产品内帮助：顶部导航 **帮助**，路由 `/help`
- 新手操作参考：`docs/USER_GUIDE.md`
- 架构说明：`docs/ARCHITECTURE.md`
- 当前架构健康度复审：`docs/ARCHITECTURE_HEALTH_REVIEW.md`
- 路线图：`docs/ROADMAP.md`
- 版本记录：`CHANGELOG.md`
- 品牌资产：`docs/assets/productflow-brand-concept.png`、`docs/assets/productflow-mark.svg`
- Web metadata / favicon 资产：`web/public/productflow-brand-concept.png`、`web/public/productflow-mark.svg`

## 技术栈

- 后端：Python 3.12、FastAPI、SQLAlchemy、Alembic、Dramatiq、Redis、PostgreSQL、Pillow、OpenAI Python SDK。
- 前端：React 19、Vite、TypeScript、React Router、TanStack Query、Tailwind CSS 4。
- 本地开发入口：根目录 `justfile`；无 `just` 时可直接执行下文列出的原始命令。
- 文档：`docs/PRD.md`、`docs/USER_GUIDE.md`、`docs/ARCHITECTURE.md`、`docs/ARCHITECTURE_HEALTH_REVIEW.md`、`docs/ROADMAP.md`、`CHANGELOG.md`。

## 开源依赖与致谢

ProductFlow 的应用代码之外，仓库还保留了一套面向 AI 协作的项目工作流资产。特别感谢**真诚、友善、团结、专业**的 Linuxdo 社区。
<p>
  <a href="https://linux.do">
    <img src="https://img.shields.io/badge/LinuxDo-community-1f6feb" alt="LinuxDo">
  </a>
</p>

- [LinuxDo](https://linux.do)

同时感谢对本仓库结构、开发方式和协作体验影响最大的开源项目。

<p>
  <a href="https://github.com/mindfold-ai/Trellis">
    <img src="https://raw.githubusercontent.com/mindfold-ai/Trellis/main/assets/trellis.png" alt="Trellis" height="32">
  </a>
  &nbsp;
  <a href="https://openai.com/codex/">
    <img src="https://img.shields.io/badge/OpenAI%20Codex-AI%20coding-412991?logo=openai&logoColor=white" alt="OpenAI Codex">
  </a>
  &nbsp;
</p>

- [Trellis](https://github.com/mindfold-ai/Trellis) 为本项目提供任务工作流、规范沉淀和上下文注入约定；仓库保留 `.trellis/workflow.md`、`.trellis/scripts/` 和 `.trellis/spec/`，方便贡献者理解需求、实现、检查和收尾方式。
- [OpenAI Codex](https://openai.com/codex/) / Codex CLI 参与本项目的开发协作流程；仓库中的 `.codex/`、`.agents/skills/` 和 `AGENTS.md` 用于保存面向 AI coding agent 的项目级指令、hooks、技能和子代理配置。

## 仓库结构

```text
ProductFlow/
  README.md
  LICENSE
  CONTRIBUTING.md
  SECURITY.md
  CHANGELOG.md
  .env.example
  .env.dev.example
  docker-compose.yml
  .dockerignore
  justfile
  scripts/
    release.sh
    with_dev_env.sh
  docs/
    PRD.md
    PRD.en.md
    USER_GUIDE.md
    USER_GUIDE.en.md
    ARCHITECTURE.md
    ARCHITECTURE.en.md
    ARCHITECTURE_HEALTH_REVIEW.md
    ARCHITECTURE_HEALTH_REVIEW.en.md
    ROADMAP.md
    ROADMAP.en.md
    assets/
      productflow-brand-concept.png
      productflow-mark.svg
  backend/
    Dockerfile
    pyproject.toml
    alembic.ini
    alembic/versions/
    src/productflow_backend/
    tests/
  web/
    Dockerfile
    nginx.conf
    package.json
    public/
      productflow-brand-concept.png
      productflow-mark.svg
    src/
  .trellis/
    workflow.md
    scripts/
    spec/
```

`.trellis/spec/`、`.trellis/workflow.md` 和 `.trellis/scripts/` 是项目开发规范和任务工具，保留在仓库中便于贡献者理解约定；`.trellis/tasks/` 和 `.trellis/workspace/` 是本地任务/开发者运行上下文，不应公开跟踪。

## 快速开始：Docker Compose 一键自托管

该路径面向单机自托管部署。默认配置可运行基础流程；配置真实模型供应商、持久化存储和反向代理/HTTPS 后，可作为小规模生产运行的基础方式。宿主机仅需 Docker / Docker Compose，无需安装 Python、`uv`、Node、`pnpm` 或 `just`。Compose 会构建并启动 PostgreSQL、Redis、后端 API、Dramatiq worker 和 Web 静态站点。

### 1. 复制并修改环境变量

```bash
cp .env.example .env
```

至少修改以下值：

- `ADMIN_ACCESS_KEY`：登录后台使用的管理员密钥；密钥本身只从环境变量读取，不写入数据库。
- `SETTINGS_ACCESS_TOKEN`：配置页二次解锁令牌，必须与登录密钥分开。
- `SESSION_SECRET`：签名 session cookie 的长随机字符串。
- `POSTGRES_PASSWORD`：PostgreSQL 密码；Compose 会用它拼出容器内的 `DATABASE_URL`。

默认 provider 为 `mock`，`POSTER_GENERATION_MODE=template`，无需真实模型密钥即可完成创建商品、生成文案和模板海报等基础流程。真实模型配置见“模型与供应商配置”。

### 2. 一键构建并启动

```bash
docker compose up -d --build
```

不要在该命令后追加服务名；追加服务名只会启动指定服务。完整自托管栈应一次启动全部服务。

Compose 默认启动：

- PostgreSQL：服务名 `productflow-postgres`，Compose volume `productflow-postgres-data`，宿主机端口 `${POSTGRES_HOST_PORT:-15432}`。
- Redis：服务名 `productflow-redis`，AOF 持久化 Compose volume `productflow-redis-data`，宿主机端口 `${REDIS_HOST_PORT:-16379}`。
- 后端 API：服务名 `productflow-backend`，宿主机端口 `${APP_HOST_PORT:-29280}`。
- Dramatiq worker：服务名 `productflow-worker`，与 API 共享数据库、Redis 和 storage 卷。
- Web：服务名 `productflow-web`，nginx 静态服务，宿主机端口 `${WEB_PORT:-29281}`。

如端口已被占用，可在 `.env` 中修改 `APP_HOST_PORT`、`WEB_PORT`、`POSTGRES_HOST_PORT` 或 `REDIS_HOST_PORT`，再重新执行 `docker compose up -d --build`。容器内部仍通过服务名互联，无需修改应用内的 `DATABASE_URL` / `REDIS_URL`。

容器内应用会使用 Compose 网络服务名连接依赖：

```text
DATABASE_URL=postgresql+psycopg://productflow:<POSTGRES_PASSWORD>@productflow-postgres:5432/productflow
REDIS_URL=redis://productflow-redis:6379/0
STORAGE_ROOT=/app/storage
```

容器运行时 `STORAGE_ROOT` 固定为 `/app/storage`，不要写入宿主机路径。默认上传和生成文件存入 Docker named volume `productflow-storage`，容器重启后数据保留。

从旧 systemd 生产环境迁移到 Compose 时，如已有生产文件目录（例如 `/home/cot/ProductFlow-release/shared/storage`），可在 `.env` 中设置 host-only 变量复用旧文件：

```bash
STORAGE_HOST_PATH=/home/cot/ProductFlow-release/shared/storage
```

`STORAGE_HOST_PATH` 仅用于 Compose bind mount 的宿主机路径；API/worker 容器内仍使用 `STORAGE_ROOT=/app/storage`。留空或不设置时使用 `productflow-storage` named volume。普通更新不要执行 `docker compose down -v`，也不要为切换 storage 挂载删除 Docker volume；如需回到 named volume，移除 `STORAGE_HOST_PATH` 后重新执行 `docker compose up -d`。

### 3. 数据库迁移

`productflow-backend` 启动命令会先执行：

```bash
alembic upgrade head
```

迁移成功后才会启动 `uvicorn`。升级代码后如需手动重跑迁移，执行：

```bash
docker compose run --rm productflow-backend alembic upgrade head
```

### 4. 访问与健康检查

默认端口下可执行：

```bash
docker compose ps
curl http://127.0.0.1:29280/healthz
curl http://127.0.0.1:29281/api/healthz
```

如已在 `.env` 中修改端口，请替换为对应值：

```bash
curl "http://127.0.0.1:<APP_HOST_PORT>/healthz"
curl "http://127.0.0.1:<WEB_PORT>/api/healthz"
```

预期 API 返回：

```json
{"status":"ok"}
```

Web 默认入口：`http://127.0.0.1:29281`（改过端口时使用 `.env` 中的 `WEB_PORT`）。使用 `.env` 中的 `ADMIN_ACCESS_KEY` 登录。Web 镜像提供 Vite build 后的静态资源，nginx 将同源 `/api/*` 请求反向代理到 `productflow-backend:29280`。

### 5. 日志、停止与清理

```bash
docker compose logs -f productflow-backend productflow-worker productflow-web
docker compose down
```

停止服务不会删除数据卷。确认需要清空数据库、Redis 和 storage 时再执行：

```bash
docker compose down -v
```

## 本地开发路径

修改代码并使用热重载开发时，使用本地开发路径。

### 1. 准备工具

需要本机已有：

- Python 3.12+
- `uv`
- Node.js 20+ 或兼容版本
- `pnpm`
- Docker / Docker Compose
- `just`（可选；下文同时列出原始命令）

### 2. 复制环境变量

```bash
cp .env.example .env
cp .env.dev.example .env.dev
cp web/.env.example web/.env
```

`.env.example` 的 `DATABASE_URL` / `REDIS_URL` 面向 Compose 容器网络；本地热重载开发命令会通过 `.env.dev` 使用宿主机 `localhost:${POSTGRES_HOST_PORT:-15432}` 和 `localhost:${REDIS_HOST_PORT:-16379}`。至少需要把 `.env` / `.env.dev` 中的这些值改成自己的随机值：

- `ADMIN_ACCESS_KEY`：登录后台使用的管理员密钥；密钥本身只从环境变量读取，不写入数据库。
- `SETTINGS_ACCESS_TOKEN`：配置页二次解锁令牌，必须与登录密钥分开。
- `SESSION_SECRET`：签名 session cookie 的长随机字符串。
- `POSTGRES_PASSWORD`：本地 PostgreSQL 密码，同时保持 `.env.dev` 的 `DATABASE_URL` 中密码一致。

`.env.dev.example` 使用开发端口、Redis DB 1 和 `backend/storage-dev`，数据库名与默认 `docker-compose.yml` 保持一致。使用单独开发数据库时，需要先在 PostgreSQL 中创建对应数据库，再调整 `.env.dev` 的 `DATABASE_URL`。本地开发 storage 与生产 Compose 隔离：`just backend-run` / `just backend-worker` 及对应原始命令会读取 `.env.dev` 中的 `STORAGE_ROOT=./backend/storage-dev`。避免通过 `source .env` 或生产 `STORAGE_HOST_PATH` 启动开发进程。

### 3. 仅启动开发依赖

本地热重载开发只用 Compose 启动 PostgreSQL 和 Redis；API、worker 和 Web 由下一步的本机命令启动。完整自托管栈使用上文的 `docker compose up -d --build`。

```bash
docker compose up -d productflow-postgres productflow-redis
```

### 4. 安装依赖并迁移数据库

使用 `just`：

```bash
just backend-install
just web-install
just backend-migrate
```

无 `just` 时：

```bash
uv sync --directory backend --extra dev
pnpm --dir web install
bash scripts/with_dev_env.sh uv run --directory backend alembic upgrade head
```

### 5. 启动后端、worker 和前端

开三个终端分别运行。使用 `just`：

```bash
just backend-run
just backend-worker
just web-dev
```

无 `just` 时：

```bash
bash scripts/with_dev_env.sh bash -lc 'uv run --directory backend uvicorn productflow_backend.main:app --reload --host 0.0.0.0 --port "${APP_PORT:-29282}"'
bash scripts/with_dev_env.sh uv run --directory backend dramatiq --processes 2 --threads 4 productflow_backend.workers
bash scripts/with_dev_env.sh bash -lc 'web_port="${WEB_PORT:-29283}"; api_target="${VITE_DEV_PROXY_TARGET:-http://127.0.0.1:${APP_PORT:-29282}}"; VITE_API_BASE_URL= VITE_DEV_PROXY_TARGET="$api_target" pnpm --dir web dev -- --host 0.0.0.0 --port "$web_port" --strictPort'
```

默认开发端口来自 `.env.dev.example`：

- API：`http://localhost:29282`
- Web：`http://localhost:29283`

打开 Web 页面后使用 `ADMIN_ACCESS_KEY` 登录。顶部导航提供 **商品/工作台**、**文/图生图**、**画廊**、**帮助** 和 **配置**。

### 6. 开发健康检查

```bash
curl http://127.0.0.1:29282/healthz
```

预期返回：

```json
{"status":"ok"}
```

## 模型与供应商配置

ProductFlow 把文本和图片能力分开配置。基础设施配置（数据库、Redis、session、管理员密钥）仍然只从环境变量读取；业务配置可在前端 `/settings` 页面写入数据库并覆盖环境变量默认值。

登录门禁 `admin_access_required` 默认开启。普通工作台和私有 API 需要 `ADMIN_ACCESS_KEY` 登录。二次解锁 `/settings` 后可关闭该开关，让普通工作台/API 免登录访问。`ADMIN_ACCESS_KEY` 仍必须保留在环境变量中，作为重新开启登录后的管理员入口。`SETTINGS_ACCESS_TOKEN` 始终独立保护配置页读取和写入。

业务整删默认关闭：`DELETION_ENABLED=false` 时商品删除和连续生图会话删除 API 会返回 403，以便体验站保留违规内容溯源证据。工作流节点/连线编辑和参考图删除不受该开关影响。需要清理整条商品或会话数据时，管理员可在 `/settings` 显式开启“启用业务删除”，或通过环境默认值开启。

供应商配置：

- 文案和图片供应商在 `/settings` 的供应商档案与用途绑定中配置。供应商档案保存 Base URL、API Key 和能力；用途绑定选择文案或图片当前使用的接口与模型。
- `TEXT_PROVIDER_KIND`、`TEXT_API_KEY`、`TEXT_BASE_URL`、`TEXT_BRIEF_MODEL`、`TEXT_COPY_MODEL`、`IMAGE_PROVIDER_KIND`、`IMAGE_API_KEY`、`IMAGE_BASE_URL`、`IMAGE_GENERATE_MODEL`、`IMAGE_RESPONSES_BACKGROUND_ENABLED`、`IMAGE_IMAGES_QUALITY`、`IMAGE_IMAGES_STYLE` 是升级迁移输入。升级后的首次启动会读取这些值并创建 `provider_profiles` / `provider_bindings`；新配置请在 `/settings` 修改。
- Docker Compose 会把上述 legacy provider 变量传入 backend 和 worker 容器，保证旧 `.env` 中的真实 provider 能参与首次 bootstrap。默认值保持 mock，适合本地开发和无外部 API Key 的部署。
- 文案用途支持 `mock` 和 `openai`。图片用途支持 `mock`、`openai_responses`、`openai_images`。
- `openai_responses` 使用 OpenAI Responses `image_generation` 工具，支持参考图输入。ProductFlow 当前的连续生图分支上下文由用户显式选择的基图和参考图决定，不会自动把整段历史图片都传给 provider。
- `openai_images` 使用 OpenAI Images API 兼容接口，适合直接生成/编辑图片；连续生图由 ProductFlow 显式传入所选基图和参考图，不使用 `previous_response_id`。
- 图片尺寸默认值仍可通过 `IMAGE_MAIN_IMAGE_SIZE`、`IMAGE_PROMO_POSTER_SIZE` 提供，并可在 `/settings` 中覆盖。
- 高级 tool 参数：`IMAGE_TOOL_ALLOWED_FIELDS` 控制前端可展示、后端可持久化并发送给 provider 的 tool 字段；可选默认值还包括 `IMAGE_TOOL_MODEL`、`IMAGE_TOOL_QUALITY`、`IMAGE_TOOL_OUTPUT_FORMAT`、`IMAGE_TOOL_OUTPUT_COMPRESSION`、`IMAGE_TOOL_BACKGROUND`、`IMAGE_TOOL_MODERATION`、`IMAGE_TOOL_ACTION`、`IMAGE_TOOL_INPUT_FIDELITY`、`IMAGE_TOOL_PARTIAL_IMAGES`、`IMAGE_TOOL_N`。

海报模式：

- `POSTER_GENERATION_MODE=template`：用本地模板/Pillow 渲染，不调用图片模型。
- `POSTER_GENERATION_MODE=generated`：把确认版文案和商品/参考图交给图片 provider 生成海报。

提示词模板：

- `/settings` 的提示词分组可覆盖商品理解、文案生成、工作台生图和连续生图模板。
- 单次需求写在文案/生图节点或文/图生图画面描述里；长期默认行为写入配置页模板。

## 常用命令

| 目的 | 使用 `just` | 无 `just` 时执行 |
|---|---|---|
| 安装后端依赖 | `just backend-install` | `uv sync --directory backend --extra dev` |
| 安装前端依赖 | `just web-install` | `pnpm --dir web install` |
| 应用开发库迁移 | `just backend-migrate` | `bash scripts/with_dev_env.sh uv run --directory backend alembic upgrade head` |
| 启动开发 API | `just backend-run` | `bash scripts/with_dev_env.sh bash -lc 'uv run --directory backend uvicorn productflow_backend.main:app --reload --host 0.0.0.0 --port "${APP_PORT:-29282}"'` |
| 启动 Dramatiq worker | `just backend-worker` | `bash scripts/with_dev_env.sh uv run --directory backend dramatiq --processes 2 --threads 4 productflow_backend.workers` |
| 运行 backend pytest | `just backend-test` | `uv run --directory backend pytest` |
| 启动 Vite 开发服务器 | `just web-dev` | `bash scripts/with_dev_env.sh bash -lc 'web_port="${WEB_PORT:-29283}"; api_target="${VITE_DEV_PROXY_TARGET:-http://127.0.0.1:${APP_PORT:-29282}}"; VITE_API_BASE_URL= VITE_DEV_PROXY_TARGET="$api_target" pnpm --dir web dev -- --host 0.0.0.0 --port "$web_port" --strictPort'` |
| 运行前端 lint | 无 just 包装 | `pnpm --dir web lint` |
| 运行前端单测 | 无 just 包装 | `pnpm --dir web test:run` |
| TypeScript 检查 + Vite build | `just web-build` | `pnpm --dir web build` |
| 发布 dry run | `just release-dry-run` | `DRY_RUN=1 bash scripts/release.sh` |
| 生产更新 | `just release` | `bash scripts/release.sh` |

`just release` / `bash scripts/release.sh` 是 Docker Compose 生产更新入口。流程包括 `docker compose config --quiet`、停止可能占用 `29280/29281` 的 legacy user-level systemd 服务、`docker compose up -d --build --remove-orphans`，以及 backend `/healthz`、web `/healthz`、web 代理 `/api/healthz` 检查。该流程不会删除 Docker volumes；普通更新不要执行 `docker compose down -v`。复用旧 systemd 生产文件时，在 `.env` 中设置 `STORAGE_HOST_PATH=/home/cot/ProductFlow-release/shared/storage`。已手动迁走旧服务时，可临时执行 `LEGACY_SYSTEMD_ACTION=skip bash scripts/release.sh`，或使用 `LEGACY_SYSTEMD_ACTION=skip just release`。

`just release-dry-run` / `DRY_RUN=1 bash scripts/release.sh` 只校验 Compose 配置并打印实际发布会执行的步骤；不会停止 systemd 服务、不会构建镜像，也不会启动或切换运行中的服务。

## 主要 API 资源

后端只暴露 REST API。主要入口包括：

- `POST /api/auth/session`、`GET /api/auth/session`、`DELETE /api/auth/session`
- `/api/products`、`/api/products/{product_id}`、`/api/products/{product_id}/history`
- `/api/products/{product_id}/reference-images`、`/api/source-assets/{asset_id}`、`/api/source-assets/{asset_id}/download`
- `/api/copy-sets/{copy_set_id}`、`/api/copy-sets/{copy_set_id}/confirm`
- `/api/posters/{poster_id}/download`
- `/api/image-sessions`、`/api/image-sessions/{image_session_id}`、`/api/image-sessions/{image_session_id}/status`、`/api/image-session-assets/{asset_id}/download`
- `/api/gallery`
- `/api/generation-queue`
- `/api/products/{product_id}/workflow`、`/api/products/{product_id}/workflow/status`、`/api/products/{product_id}/workflow/run`、`/api/products/{product_id}/workflow/runs/{run_id}/cancel`
- `/api/workflow/canvas-templates`、`/api/workflow/user-template-groups`
- `/api/workflow-nodes/{node_id}`、`/api/workflow-edges/{edge_id}`
- `/api/settings`、`/api/settings/lock-state`、`/api/settings/unlock`、`/api/settings/runtime`

上面是常用资源入口，不是完整 OpenAPI reference；操作型接口还包括连续生图生成/取消/重试/收藏到画廊、工作流重试、模板插入和用户模板管理等。

## 开源与安全边界

- License：MIT，见 `LICENSE`。
- 贡献指南：见 `CONTRIBUTING.md`。
- 安全报告：见 `SECURITY.md`。
- 不要提交 `.env`、`web/.env`、本地 storage、构建产物、缓存、日志或 `.trellis/tasks/` / `.trellis/workspace/`。
- 真实 provider API key 只应放在本地环境变量或私有部署配置中，不应写入 issue、PR 或文档示例。


--- FILE: SECURITY.en.md ---

# Security Policy

[中文](SECURITY.md) | English

ProductFlow is a self-hosted project. Deployers are responsible for protecting their admin key, model API keys, database, Redis, file storage, and reverse-proxy entrypoints.

## Supported Scope

Security fixes currently prioritize the latest code on the default branch. The project is still early-stage and does not maintain multiple long-term support versions.

## Reporting a Security Issue

Do not post real secrets, database URLs, cookies, model API keys, private images, or production logs in public issues.

If you discover a security issue, contact the maintainers through a private channel. If the repository hosting platform supports private vulnerability reporting, prefer that feature. A useful report should include:

- Impact scope and reproduction steps.
- Affected commit or version.
- Whether relevant configuration uses default values.
- Minimal logs or screenshots, without real secrets.

## Deployer Security Checklist

- Change `ADMIN_ACCESS_KEY`, `SESSION_SECRET`, and `POSTGRES_PASSWORD`; do not use example placeholders.
- Do not commit `.env`, `web/.env`, storage, logs, database dumps, or `.trellis/tasks/` / `.trellis/workspace/`.
- Enable HTTPS in production and set `SESSION_COOKIE_SECURE=true`.
- Allow backend access only from trusted origins and configure `BACKEND_CORS_ORIGINS` correctly.
- Redis and PostgreSQL should not be exposed to the public internet.
- Provider API keys should live only in private environment variables or the settings page. Do not write them into docs, issues, or PRs.
- Upload and generated-file directories should be backed up regularly and protected with access control according to business needs.

## Known Boundaries

The current version uses a single-admin model. It does not provide multi-user permissions, team audit, object-level access control, or public-registration abuse prevention. Do not expose it directly as a public multi-user service.


--- FILE: SECURITY.md ---

# Security Policy

[中文](SECURITY.md) | [English](SECURITY.en.md)

ProductFlow 是自托管项目。部署者负责保护自己的管理员密钥、模型 API key、数据库、Redis、文件存储和反向代理入口。

## 支持范围

当前安全修复优先覆盖默认分支上的最新代码。项目处于早期阶段，暂不维护多个长期支持版本。

## 报告安全问题

请不要在公开 issue 中贴出真实密钥、数据库 URL、Cookie、模型 API key、私有图片或生产日志。

如果你发现安全问题，请通过私有渠道联系维护者；如果仓库托管平台支持 private vulnerability reporting，请优先使用该功能。报告中建议包含：

- 影响范围和复现步骤。
- 受影响的 commit 或版本。
- 相关配置是否使用默认值。
- 最小化的日志或截图，且不要包含真实 secret。

## 部署者安全清单

- 修改 `ADMIN_ACCESS_KEY`、`SESSION_SECRET`、`POSTGRES_PASSWORD`，不要使用示例占位符。
- 不要提交 `.env`、`web/.env`、storage、日志、数据库 dump 或 `.trellis/tasks/` / `.trellis/workspace/`。
- 生产环境建议开启 HTTPS，并把 `SESSION_COOKIE_SECURE=true`。
- 只允许可信来源访问后台，正确配置 `BACKEND_CORS_ORIGINS`。
- Redis 和 PostgreSQL 不应暴露到公网。
- Provider API key 只放在私有环境变量或设置页中，不要写进文档、issue 或 PR。
- 上传目录和生成文件目录应定期备份，并按业务需要设置访问控制。

## 已知边界

当前版本是单管理员模型，不提供多用户权限、团队审计、对象级访问控制或公开注册防滥用能力。请不要把它直接暴露为公众多用户服务。


--- FILE: web\package.json ---

{
  "name": "productflow-web",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit -p tsconfig.app.json && tsc --noEmit -p tsconfig.node.json && vite build",
    "lint": "eslint .",
    "test": "vitest",
    "test:run": "vitest run",
    "preview": "vite preview"
  },
  "dependencies": {
    "@xyflow/react": "^12.10.2",
    "@tanstack/react-query": "^5.90.5",
    "lucide-react": "^0.542.0",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-router-dom": "^7.9.3",
    "vaul": "^1.1.2"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@tailwindcss/vite": "^4.1.13",
    "@types/react": "^19.1.17",
    "@types/react-dom": "^19.1.9",
    "@vitejs/plugin-react": "^5.0.3",
    "eslint": "^10.2.1",
    "eslint-plugin-react-hooks": "^7.1.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.5.0",
    "tailwindcss": "^4.1.13",
    "typescript": "^5.9.2",
    "typescript-eslint": "^8.59.0",
    "vite": "^7.1.7",
    "vitest": "^4.1.5"
  }
}


--- FILE: web\tsconfig.app.json ---

{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "types": ["vite/client"]
  },
  "include": ["src"]
}


--- FILE: web\tsconfig.json ---

{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}



--- FILE: web\tsconfig.node.json ---

{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": [
    "vite.config.ts",
    "vitest.config.ts"
  ]
}
