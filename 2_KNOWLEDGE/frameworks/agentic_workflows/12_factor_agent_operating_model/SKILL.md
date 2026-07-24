---
name: skill
description: Guides agents through designing production LLM workflows using the 12-factor agents operating model: owned prompts, owned context, structured tool calls, unified state, resumable execution, human contact tools, explicit control flow, error compaction, small agents, universal triggers, and stateless reducers.
source: humanlayer/12-factor-agents
license_note: Source repository uses a non-MIT license; this skill stores SEOSONA's distilled operational summary and does not vendor source content.
---

# 12-Factor Agent Operating Model

Use this skill when designing, auditing, or refactoring an agentic workflow that must be reliable enough for production users. The goal is to make agent behavior inspectable, resumable, testable, and bounded instead of treating the model as a hidden loop.

## When To Use

- Building a new SEOSONA workflow, daemon, capability bridge route, or sub-agent.
- Reviewing an agent that has context drift, tool ambiguity, hidden state, infinite retries, or poor handoff behavior.
- Turning a chat prototype into a durable workflow that can run from CLI, webhook, issue, scheduled job, UI, or MCP event.
- Designing a human-in-the-loop path where approval, clarification, or escalation is part of the workflow.

## Operating Factors

1. Natural language to tool calls.
2. Own the prompts.
3. Own the context window.
4. Tools are structured outputs.
5. Unify execution state and business state.
6. Launch, pause, and resume through simple APIs.
7. Contact humans with tool calls.
8. Own control flow.
9. Compact errors into context.
10. Use small focused agents.
11. Trigger from anywhere.
12. Use a stateless reducer.

## SEOSONA Implementation Pattern

### 1. Define The Reducer Contract

For every workflow, define the minimal event stream:

- `task.received`
- `context.loaded`
- `route.selected`
- `action.started`
- `action.completed`
- `validation.failed`
- `validation.passed`
- `human.requested`
- `handoff.created`
- `workflow.completed`

The reducer converts these events into the next model context:

```text
Goal: current objective.
State: durable facts and completed actions.
Evidence: commands, files, links, or decisions that matter.
Open risks: unresolved blockers and assumptions.
Next action: one concrete action with stop condition.
```

### 2. Keep Context Owned And Small

- Retrieve domain KIs before browsing or re-analyzing.
- Prefer summaries with pointers over full source dumps.
- Include raw logs only when the exact error text changes the fix.
- Separate user-facing Vietnamese chat from English system artifacts.
- Remove local machine paths, tokens, cookies, and personal data before persistence.

### 3. Make Tools Typed

Every capability should expose:

- name and purpose
- input schema
- output schema
- side effects
- validation command
- rollback or cleanup guidance
- security constraints

### 4. Bound The Loop

Every autonomous loop must have:

- max iterations, max elapsed time, or max cost
- a stop token or explicit completion condition
- retry/backoff policy
- failure compaction rule
- validation gate before final delivery
- durable log or KI update when a reusable pattern is learned

## Review Checklist

- Prompts are versioned and reviewable.
- Context is intentionally assembled, not passively accumulated.
- The workflow can resume after interruption.
- Human escalation is represented as an explicit event.
- Tool calls have schemas or stable command contracts.
- External side effects are logged and validated.
- Error messages are compacted into actionable evidence.
- Small agents have clear ownership boundaries.
- The same workflow can run from at least two trigger surfaces.
- Final state can be reproduced from durable events.

## Anti-Patterns

- Infinite loops without budget or stop criteria.
- Agents that depend on hidden chat state to remember critical decisions.
- Tool results copied into context without compression.
- Human approval requested through vague prose when a typed approval event is possible.
- Large generalist agents that mix research, implementation, review, and release without independent evidence gates.
- Workflows that only work inside one IDE or one local machine path.
