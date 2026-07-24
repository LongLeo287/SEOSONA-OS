<div align="center">

# 🚀 spawn-agent

**A skill for [Antigravity](https://github.com/google-deepmind/antigravity) that delegates scoped work to worker agents, keeping the main context clean.**

Antigravity doesn't natively support spawning sub-agents. This skill fills that gap — use [Gemini CLI](https://github.com/google-gemini/gemini-cli) or [Codex CLI](https://github.com/openai/codex) as worker agents to handle implementation, research, and bug fixes while the orchestrator stays focused.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

</div>

---

## The Problem

Antigravity is powerful, but it has no built-in way to delegate work to sub-agents. Every file read, build output, and error trace goes into the same context window — and it fills up fast. Once it does, the agent loses track of earlier instructions and can't reason about the big picture.

**Before spawn-agent:**
```
Main Agent Context:
├── User conversation          ~5%
├── Codebase understanding     ~10%
├── File A contents            ~15%  ← polluting
├── File B contents            ~15%  ← polluting
├── Build output               ~20%  ← polluting
├── Lint errors                ~10%  ← polluting
└── Remaining for reasoning    ~25%  ← squeezed
```

**After spawn-agent:**
```
Main Agent Context (Orchestrator):         Worker Agent Context:
├── User conversation     ~15%             ├── Task prompt          ~10%
├── Codebase overview     ~20%             ├── File A contents      ~25%
├── Delegation plan       ~10%             ├── File B contents      ~25%
├── Worker results        ~15%             ├── Build output         ~20%
└── Remaining reasoning   ~40%  ← clean   └── Implementation       ~20%
```

## How It Works

The main agent acts as an **orchestrator** — it plans, delegates, and reviews. Worker agents (Gemini or Codex) handle the actual implementation in isolated sessions.

```
Orchestrator                    Worker (Gemini/Codex)
     │                               │
     ├──── 1. DEFINE task ────────►   │
     ├──── 2. COMPOSE prompt ─────►   │
     ├──── 3. SPAWN ──────────────►   ├── reads codebase
     │                                ├── implements changes
     │                                ├── runs verification
     │     ◄── 4. OUTPUT ────────────┘
     ├──── 5. REVIEW results
     └──── 6. REPORT to user
```

## Installation

### Prerequisites

At least one of these CLI tools must be installed:

```bash
# Gemini CLI
npm install -g @google/gemini-cli

# Codex CLI
npm install -g @openai/codex
```

### Install the Skill

Clone into your Antigravity skills directory:

```bash
# Recommended: into your global skills directory
git clone https://github.com/khanhbkqt/spawn-agent.git ~/.gemini/antigravity/skills/spawn-agent

# Or per-project
git clone https://github.com/khanhbkqt/spawn-agent.git .agent/skills/spawn-agent

# Or symlink from a central location
git clone https://github.com/khanhbkqt/spawn-agent.git ~/spawn-agent
ln -s ~/spawn-agent ~/.gemini/antigravity/skills/spawn-agent
```

Make the script executable:

```bash
chmod +x ~/.gemini/antigravity/skills/spawn-agent/scripts/spawn-agent.sh
```

Antigravity will automatically discover the skill from `SKILL.md` and learn the delegation protocol.

## Quick Start

### 1. Simple inline task

```bash
./scripts/spawn-agent.sh --gemini --yolo -p "Count all TODO comments in src/ and list them"
```

### 2. Complex task with a template

Create a prompt file from a template:

```bash
cp templates/implementation-task.md /tmp/spawn-agent-task-auth.md
# Fill in the template sections...
```

Then spawn:

```bash
./scripts/spawn-agent.sh --codex --auto-edit --timeout 300 -f /tmp/spawn-agent-task-auth.md
```

### 3. Read-only research

```bash
./scripts/spawn-agent.sh --gemini --yolo --timeout 120 \
  -p "Analyze the authentication flow in packages/backend/src/auth/. 
      List all JWT-related functions and their dependencies.
      Output as a markdown summary. DO NOT modify any files."
```

## Choosing an Agent

| Agent | CLI | Strengths | Best for |
|-------|-----|-----------|----------|
| **Gemini** | `gemini` | Fast, good at codebase understanding, reads project context | Research, context gathering, quick implementations |
| **Codex** | `codex exec` | Strong reasoning, sandboxed execution, code review capability | Complex implementation, refactoring, bug fixing |

> **Tip:** Choose the agent based on the task — don't be loyal to one CLI. Each has its own strengths.

## Approval Modes

| Mode | Flag | Gemini | Codex |
|------|------|--------|-------|
| Auto-edit | `--auto-edit` | `auto_edit` | `auto-edit` |
| Full auto | `--yolo` | `yolo` | `full-auto` |
| Safest | `--safe` | `default` | `suggest` |

## Templates

Three prompt templates are provided for common task types:

| Task Type | Template | When to Use |
|-----------|----------|-------------|
| Implementation | [`implementation-task.md`](templates/implementation-task.md) | Adding features, building modules, refactoring |
| Research | [`research-task.md`](templates/research-task.md) | Codebase analysis, context gathering (read-only) |
| Bug Fix | [`bugfix-task.md`](templates/bugfix-task.md) | Targeted fixes with known or suspected location |

Each template includes sections for goal, scope, constraints, and expected output format. Fill in all sections before delegating — **headless workers can't ask clarifying questions**.

### Quick inline format (for simple tasks)

```markdown
# Task: <short name>
## Goal: <one sentence describing the objective>
## Files: <files to modify>
## Constraints: DO NOT modify files outside <scope>
## When done: Summarize changes made and any issues found.
```

## When to Use (and When Not To)

**Use spawn-agent when:**
- Implementation task has a clear scope (fix bug, add function, refactor file)
- You need to research/query the codebase without polluting the main context
- The task is independent and doesn't need intermediate human review
- You want to keep the main context clean for high-level reasoning

**Don't use when:**
- Task requires interactive discussion with the user
- Scope is too broad (refactoring an entire module)
- Multiple files with complex inter-dependencies need coordination
- Task needs browser interaction or external API calls

## Anti-Patterns

| ❌ Don't | ✅ Do |
|----------|------|
| Delegate too broadly: "Refactor the entire backend" | Scope it: "Refactor auth.service.ts to extract token logic into token.service.ts" |
| Skip constraints — agent may modify files outside scope | Set boundaries: "DO NOT modify files outside packages/backend/src/auth/" |
| Spawn and assume success | Always review: read output, verify changes, check errors |
| Chain delegates: A → output feeds B → ... | Orchestrator controls flow: read result A, decide, then spawn B if needed |

## Script Reference

```
Usage: spawn-agent.sh [options]

Agent Selection:
  --gemini                Use Gemini CLI (default)
  --codex                 Use Codex CLI

Prompt:
  -p, --prompt TEXT       Prompt text (inline)
  -f, --file PATH         Prompt file (markdown)

Approval Modes:
  --yolo                  Auto-approve everything
  --auto-edit             Auto-approve edits only (default)
  --safe                  Prompt for every action

Other:
  --timeout SECONDS       Max execution time (default: 300)
  --output PATH           Custom output file path
  -h, --help              Show this help
```

## Compatibility

Built for **Antigravity** (Google DeepMind), but works with any AI coding assistant that reads `SKILL.md` files:

- **Antigravity** — `~/.gemini/antigravity/skills/` (primary target)
- **Claude Code** (Anthropic) — `.agent/skills/`
- **Gemini CLI** (Google) — `.gemini/skills/`
- **Cursor** — via rules or skills directories
- **Any agent** that supports Markdown-based skill definitions

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

[MIT](LICENSE)
