---
domain: agentic_operating_models
created: 2026-06-11
sources:
  - 2_KNOWLEDGE/raw_data/agentic_operating_models/claude_cowork_agent_looping_snapshot_2026-06-11.md
  - 2_KNOWLEDGE/frameworks/agentic_workflows/cost_bounded_agent_looping/SKILL.md
  - 2_KNOWLEDGE/frameworks/productivity/thinking_model_router/SKILL.md
status: active
---

# KI: Claude Cowork, Agent Looping, and Thinking Model Router

## Summary

SEOSONA OS ingested user-provided materials about Claude Cowork, agent looping, fleet orchestration, open vs closed loops, and 39 Claude Code thinking skills.

## Durable Memory

- Autonomous work should run as a loop: discovery, planning, execution, verification, iteration.
- Closed looping is the default for production work because it is cheaper, more controllable, and more repeatable.
- Open looping is useful for exploration but must have budget caps, milestones, and stop conditions.
- Fleet looping requires an orchestrator that owns the goal and specialists that return scoped evidence.
- Claude Cowork's product pattern is "work completion," not "chat answer": real files, cross-app context, sub-agents, long-running work, scheduled tasks, projects, and sensitive-action confirmations.
- Complex tasks should route through one to three mental models before planning.
- Mental model output must be falsifiable: state what evidence would prove it wrong and what cheap test can validate it.

## New Native Skills

- `seosona:cost-bounded-agent-looping`
- `seosona:thinking-model-router`

## Portability Upgrade

- These skills are now intended to be consumed through the SEOSONA portable capability bridge.
- Any connected IDE, CLI, MCP client, or agent runtime should discover them through `1_CORE/scripts/seosona_capability_bridge.js` or `2_KNOWLEDGE/SKILLS_ROUTER.md`.
- Persistent external configuration must reference `~/.seosona` or `${SEOSONA_ROOT}`, never a physical installation path.

## SEO Dashboard Relevance

- Treat each dashboard module as a closed loop with its own verification state.
- Sidebar items must map to real anchors and action-plan counts.
- The dashboard should show evidence states, not decorative counters.
- Use fleet-loop thinking for Technical, Content, Schema, GEO, SXO, UX, Data, and DevOps workstreams.

TASK COMPLETED
