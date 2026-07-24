---
name: spawn-agent
description: Spawn worker agents (Gemini CLI or Codex CLI) to keep main context clean. Use for implementation, codebase research, context gathering, or any scoped work that would pollute the orchestrator's context.
---

# Spawn Agent

Orchestration & Delegation pattern: The main agent acts as the orchestrator (plan, delegate, review). Worker agents (Gemini/Codex) execute specific tasks and report results.

## When to Use

**Use when:**
- Implementation task has a clear scope (fix bug, add function, refactor file)
- You need to research/query the codebase without polluting the main context
- The task is independent and doesn't need intermediate human review
- You want to keep the main context clean for high-level reasoning

**Do NOT use when:**
- Task requires interactive discussion with the user
- Scope is too broad (refactoring an entire module)
- Multiple files with complex inter-dependencies need coordination
- Task needs browser interaction or external API calls

## Choosing an Agent

| Agent | CLI | Strengths | Best for |
|-------|-----|-----------|----------|
| **Gemini** | `gemini` | Fast, good at codebase understanding, reads project context | Research, context gathering, quick implementations |
| **Codex** | `codex exec` | Strong reasoning, sandboxed execution, code review capability | Complex implementation, refactoring, bug fixing |

> [!TIP]
> Choose the agent based on the task — don't stick to one CLI. Each has its own strengths.

## Delegation Protocol

### Step 1: DEFINE — Clearly define the task

Before spawning, the orchestrator must determine:
- **Goal**: What should the task achieve?
- **Scope**: Which files/directories are involved?
- **Agent**: Is Gemini or Codex more suitable?
- **Constraints**: What must NOT be modified?
- **Expected output**: What result is expected (code changes, summary, list)?

### Step 2: COMPOSE — Write the prompt file using a template

Choose the appropriate template and fill it in. Save to `.agent/spawn_agent_tasks/<name>.md`.

> [!NOTE]
> Create the directory if it doesn't exist: `mkdir -p .agent/spawn_agent_tasks`
> Add `.agent/spawn_agent_tasks/` to `.gitignore` if you don't want to track task files.

#### Template Selection Guide

| Task type | Template | Key sections |
|-----------|----------|-------------|
| **Complex implementation** | `templates/implementation-task.md` | Architecture context, File Map, Step-by-step, Conventions, Acceptance criteria |
| **Codebase research** | `templates/research-task.md` | Where to look, Questions to answer, Output format |
| **Bug fix** | `templates/bugfix-task.md` | Bug description, Suspected location, Fix approach |

> [!IMPORTANT]
> **Headless worker = no Q&A.** The worker agent cannot ask clarifying questions.
> The more detailed the template, the more accurate the output. Each missing section = one point where the agent may go wrong.

#### Quick inline prompt (for simple tasks)

```markdown
# Task: <short name>
## Goal: <one sentence describing the objective>
## Files: <files to modify>
## Constraints: DO NOT modify files outside <scope>
## When done: Summarize changes made and any issues found.
```

### Step 3: SPAWN — Call the worker agent

```bash
# Gemini — implementation task
spawn-agent.sh --gemini --auto-edit --timeout 300 \
  -f .agent/spawn_agent_tasks/<name>.md

# Codex — implementation task
spawn-agent.sh --codex --auto-edit --timeout 300 \
  -f .agent/spawn_agent_tasks/<name>.md

# Gemini — research (yolo is fine for read-only research)
spawn-agent.sh --gemini --yolo --timeout 120 \
  -f .agent/spawn_agent_tasks/<name>.md

# Quick task — any agent
spawn-agent.sh --codex --yolo --timeout 60 \
  -p "Fix typo 'recieve' -> 'receive' in auth.service.ts"
```

**Approval modes (mapped per agent):**

| Mode | Flag | Gemini | Codex |
|------|------|--------|-------|
| Auto-edit | `--auto-edit` | `auto_edit` | `auto-edit` |
| Full auto | `--yolo` | `yolo` | `full-auto` |
| Safest | `--safe` | `default` | `suggest` |

### Step 4: REVIEW — Read the output

Output is saved to `.agent/spawn_agent_tasks/output-<timestamp>.log`.

```bash
cat .agent/spawn_agent_tasks/output-*.log | tail -100
```

Verify:
- Did the task achieve the goal?
- Are there changes outside the defined scope?
- Are there errors/warnings that need handling?

### Step 5: REPORT — Summarize for the user

- ✅ Success: summarize changes
- ❌ Failure: root cause + next steps
- ⚠️ Partial: what was completed, what still needs to be done

## Anti-Patterns

❌ **Delegating too broadly**: "Refactor the entire backend"
✅ **Specific scope**: "Refactor auth.service.ts to extract token logic into token.service.ts"

❌ **No constraints**: Agent may modify files outside scope
✅ **Set boundaries**: "DO NOT modify files outside packages/backend/src/auth/"

❌ **Not reading output**: Spawning and assuming success
✅ **Always review**: Read output, verify changes, check errors

❌ **Delegation chain**: Spawn A → output feeds spawn B → ...
✅ **Orchestrator controls flow**: Read result A, decide next step, then spawn B if needed
