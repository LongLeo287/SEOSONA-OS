---
name: deerflow-harness-patterns
description: "Long-horizon multi-agent harness patterns distilled from ByteDance DeerFlow v2 (MIT, 74k stars, #1 GitHub trending). Use when upgrading SEOSONA OS's agent harness, dispatcher, context engine, or memory for long-running multi-step tasks: sub-agent spawning with scoped context + termination, context offload to filesystem, memory deduplication, progressive skill loading, sandboxed execution, IM remote channels (Telegram), and observability tracing. Each pattern is mapped to the concrete OS component to change."
license: MIT (patterns/ideas — DeerFlow itself is MIT, so code is also borrowable)
metadata:
  type: harness-pattern
  source: https://github.com/bytedance/deer-flow
  refreshed: 2026-06-25 (DeerFlow v2 rewrite — supersedes the pre-v2 KI)
---

# DeerFlow v2 — harness patterns to adopt in SEOSONA OS

[bytedance/deer-flow](https://github.com/bytedance/deer-flow) (MIT) is a long-horizon
"super-agent harness" on LangGraph/LangChain. SEOSONA OS does NOT vendor it (it's a
heavyweight Python/LangGraph framework) — it borrows the proven patterns below. Each row
names the OS component to change and the concrete action.

| DeerFlow v2 pattern | What it does | → SEOSONA OS component + action |
|---------------------|--------------|--------------------------------|
| **Sub-agent spawning** | lead agent spawns scoped sub-agents (own context, tools, termination), runs them in parallel, synthesizes back | `1_CORE/scripts/task_planner.py` + the dispatcher: ensure tasks can fan out to parallel sub-agents each with a scoped context + explicit stop condition; pair with `debate_protocol`/`looper` (Judge + gates) for verification |
| **Context offload to filesystem** | aggressive summarization; intermediate results written to FS; completed sub-tasks compressed | `1_CORE/scripts/context_engine.py`: when a long task's context grows, offload intermediate artifacts to `3_MEMORY/` and keep only summaries in working context |
| **Memory deduplication** ⭐ | dedupes fact entries so memory doesn't accumulate endlessly | `1_CORE/scripts/session_memory.py` + `3_MEMORY/knowledge_items`: dedup on write (the exact fix for SEOSONA's recurring "knowledge pile" problem — don't store a fact already present) |
| **Progressive skill loading** | skills load only when needed; context stays lean | `2_KNOWLEDGE/SKILLS_ROUTER.md` (~294 skills): keep routing-on-demand (never load all skills); confirm the router only surfaces matched skills per task |
| **Sandboxed execution** | per-task isolation; bash disabled by default on local sandbox for security | any OS code-exec path: gate dangerous shell/exec behind an explicit opt-in; default-deny network/destructive ops |
| **IM remote channels** | Telegram/Slack/Feishu/Lark control + binding from a workspace UI | OS has no remote yet — borrow SEOSONA Video's `1_AGENTS/hermes_agent/telegram_remote.py` pattern (cred-gated, single allowed chat_id) to add a Telegram control channel to OS |
| **Observability tracing** | LangSmith/Langfuse tracing of LLM calls, agent runs, tool exec | add lightweight run/trace logging around dispatcher + agent calls so long-horizon runs are inspectable |
| **MCP + custom skills** | extensible via MCP servers and custom skills, loaded progressively | already aligned — OS routes skills + supports MCP; keep new capabilities as routable SKILL.md, not bespoke code paths |

## Priority for OS
1. **Memory dedup** (`session_memory.py`) — directly cures the "ingested-but-piling" problem.
2. **Context offload** (`context_engine.py`) — makes long multi-step runs survivable.
3. **Sub-agent fan-out + termination** (`task_planner.py` + looper/debate_protocol) — real parallel long-horizon work with verification.
4. **Telegram channel** — reuse the Video pattern for remote OS control.

## Implemented (2026-06-25, from the repo-inventory triage)
- **Memory dedup/reflection** → `1_CORE/scripts/memory_reflect.py` (`npm run memory:reflect`) —
  EverOS-style consolidation of `3_MEMORY/knowledge_items` (exact-dupe auto-archive + advisory
  alias clusters). Cures the "knowledge pile".
- **Skill-security gate** → `1_CORE/scripts/skill_security_scan.py` (`npm run skills:security`) —
  NVIDIA SkillSpector over the SKILL library + `_TIER_3_BLACKLIST` (memory/MCP-poisoning).
- **Context compression** → `1_CORE/scripts/context_compressor.py` — headroom (60-95% token cut)
  with a dependency-free fallback; pairs with context-offload before the model.

> Already-ingested KI: `3_MEMORY/knowledge_items/uap_deer-flow.md` (now points here).
> Do not re-ingest DeerFlow — adopt these patterns into the named OS components.
