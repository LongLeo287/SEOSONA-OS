---
name: agent_fleet_status_telemetry
description: Guides agents through designing status telemetry for multiple AI coding agents using hooks, wrapper commands, local event ingestion, status aggregation, and notification boundaries. Use when SEOSONA needs to monitor Claude Code, Codex, Gemini CLI, Cursor, OpenCode, Windsurf, Antigravity, or similar agent runtimes.
---

# Agent Fleet Status Telemetry

## Overview

Multi-agent work fails quietly when humans have to poll terminals. Use this skill to design a status telemetry layer that reports which agents are working, waiting, done, idle, or blocked.

## When To Use

- Running several agents in parallel.
- Building an agent dashboard or status monitor.
- Adding hooks to an IDE/CLI agent runtime.
- Creating notification rules for completion or required user input.

## Event Model

Use a minimal event shape:

```json
{
  "agent": "codex",
  "session_id": "stable-session-id",
  "project": "project-or-worktree",
  "state": "working|waiting|done|idle|blocked|error",
  "activity": "short human-readable activity",
  "needs_user": false,
  "timestamp": "ISO-8601"
}
```

## Workflow

1. Inventory runtimes.
   - Identify which agents support hooks.
   - Identify which agents need a wrapper command.

2. Define hook behavior.
   - Hooks should be best-effort and non-blocking.
   - If the monitor is unavailable, the agent workflow must continue.
   - Never leak prompts, credentials, or raw transcripts by default.

3. Aggregate status.
   - Group by project and session.
   - Derive aggregate state: waiting beats working, working beats idle, error beats done.
   - Track elapsed time per state.

4. Notify selectively.
   - Notify on `waiting`, `blocked`, `error`, and `done`.
   - Avoid notifications for every tool call.
   - Add quiet hours or batching for long-running loops.

5. Expose ambient and detailed views.
   - Ambient view: one glance state.
   - Detailed view: agent, project, activity, elapsed time, and last event.

## Privacy Boundary

Do not transmit raw prompts, code diffs, API keys, local absolute paths, or full transcripts unless the user explicitly opts in. Prefer project names, task IDs, and short status strings.

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "Terminal output is enough." | Multi-agent work needs aggregation, not more windows. |
| "Hooks can fail the agent if telemetry fails." | Telemetry must never block primary work. |
| "Full transcripts make debugging easier." | They also leak sensitive context; status telemetry should be minimal by default. |

## Verification

- [ ] Hook failures do not block the agent.
- [ ] The event schema has no secrets or raw transcript fields.
- [ ] Waiting/done notifications are distinct.
- [ ] The monitor can handle unknown agents through a wrapper.
