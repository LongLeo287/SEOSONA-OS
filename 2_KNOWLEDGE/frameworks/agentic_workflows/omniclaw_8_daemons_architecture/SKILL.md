---
name: "omniclaw_8_daemons_architecture"
description: "A framework based on OmniClaw V5.0 replacing free-willed agents with 8 hardcoded Python daemons for absolute system security and automated orchestration."
keywords: ["omniclaw", "daemon", "zero-trust", "architecture", "orchestration", "agent", "blackboard", "event-bus", "receipt"]
---

# OmniClaw Operational Governance Pattern

Most agentic frameworks fail when LLMs are given too much free will, bloated context, and unmanaged write access. The OmniClaw pattern constrains agent work with deterministic daemons, quarantine-first ingestion, explicit gates, append-only receipts, and a shared blackboard.

## The 8 Core Daemons

| Daemon | Title | Core Responsibility |
|---|---|---|
| **OMA** | System Architect | Map Keeper. Creates and enforces the global semantic structure. |
| **OAP** | Flow Distributor | The Sorter. Evaluates and routes input via the Triage Classification Matrix. |
| **OER** | Entity Registrar | The Gatekeeper. Authenticates identities, indexes skills globally. |
| **OIW** | Input Harvester | The Plow. Scans repos, scrapes raw context deeply into the Sandbox. |
| **OSF** | Security Warden | The Executioner. Deep scans Sandboxes and terminates blacklisted modules (Zero-Trust). |
| **OHD** | Healer & Cleaner | The Medic. Minifies JSON files and cleans up fatal cache collisions. Garbage-collects boilerplate code. |
| **OA** | Evolution Academy | The Analyst. Scores repos and automatically forks Sub-agents if valuable. |
| **OBD** | Bridge Protocol | Hardware Layer. Bridges LLM inferences, telemetries, and listens to ports. |

## Apply In SEOSONA OS

Use this pattern when a task involves external repo ingestion, skill creation, agent routing, background services, issue triage, or cross-agent handoff.

1. **Zero-Trust File Ops:** Agents should not write unreviewed generated code directly into core system paths. External repos, scripts, and generated skills must pass through a quarantine or ingestion zone before promotion.
2. **Deterministic Routing:** Do not let an LLM guess the responsible workflow. Route by task type through `2_KNOWLEDGE/SKILLS_ROUTER.md`, `1_CORE/scripts/intent_router.py`, or the portable capability bridge.
3. **Append-Only Receipts:** Every meaningful role handoff should produce a small receipt with task id, role, status, files changed, tests run, issues found, and next action.
4. **Blackboard State:** Keep long-running task state in a shared JSON or markdown board instead of relying on chat memory alone. Use it for open items, review queue, handoff trigger, and completion state.
5. **Gate Before Promotion:** External knowledge and new tools must pass security, QA, content, and portability gates before becoming native SEOSONA capabilities.
6. **Localhost-First Perimeter:** Local preview servers, dashboards, and bridges should bind to `127.0.0.1` by default. Network binding requires explicit authorization and a documented reason.
7. **Daemon vs Persona Split:** Personas are task modes. Daemons are deterministic maintenance functions. Keep security scans, registry updates, health checks, and cleanup in scripts/hooks where possible.

## SEOSONA Mapping

| OmniClaw Pattern | SEOSONA Native Surface | Implementation Rule |
|---|---|---|
| OMA map keeper | `2_KNOWLEDGE/MASTER_INDEX.md`, `2_KNOWLEDGE/SKILLS_ROUTER.md` | Update maps after adding durable capabilities. |
| OAP triage | `1_CORE/scripts/intent_router.py`, capability bridge | Route by explicit skill/workflow ids. |
| OER registrar | `1_CONFIG/schemas/`, skill metadata, router entries | Validate names, schemas, and export contracts. |
| OIW intake | `3_MEMORY/ingestion_zone/`, `5_RESEARCH/` | Store raw external inputs outside production paths first. |
| OSF warden | `1_CORE/rules/security_regex_rules.md`, audit scripts | Block secrets, unsafe paths, and untrusted execution. |
| OHD healer | lint, portability audit, cleanup scripts | Prefer automated repair with narrow diffs. |
| OA academy | knowledge items, issue backlog | Promote reusable patterns into skills only after validation. |
| OBD perimeter | local server rules, MCP configs | Default to localhost and track ports. |

## Receipt Schema

Use this lightweight schema for complex SEOSONA tasks:

```json
{
  "task_id": "string",
  "role": "developer | qa | researcher | security | orchestrator",
  "status": "PASS | PARTIAL | FAIL | BLOCKED",
  "files_modified": [],
  "verification": [],
  "issues_found": [],
  "next_action": "CONTINUE | RETRY | ESCALATE | COMPLETE",
  "timestamp": "ISO-8601"
}
```

## Promotion Checklist

- External source cloned or downloaded into an ingestion zone or temporary workspace.
- Static review completed before executing source code.
- Secrets and hardcoded paths scanned.
- Useful pattern extracted into a KI, skill, SOP, or issue backlog.
- Validation commands pass before commit.
- Temporary clones and generated scratch files are removed or explicitly ignored.
