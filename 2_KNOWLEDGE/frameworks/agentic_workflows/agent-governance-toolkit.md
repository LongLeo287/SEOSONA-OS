---
name: agent-governance-toolkit
description: Applies Microsoft's strict governance, safety guardrails, and telemetry to agent operations.
---

# Agent Governance & Safety Guardrails

This skill integrates Microsoft's Agent Governance framework to ensure SEOSONA OS operates within safe boundaries.

## Usage Directives
1. **Pre-Execution Guardrails:** Before executing any destructive command (e.g., `rm -rf`, `DROP TABLE`, or writing to sensitive root directories), the agent MUST halt and prompt the user for explicit permission, regardless of the Zero-Touch Autonomy mandate.
2. **Output Sanitization:** Redact any hardcoded PII, API keys, or sensitive credentials before logging them into `3_MEMORY` or `transcript.jsonl`.
3. **Telemetry Auditing:** If an agent experiences a recursive failure loop (e.g., failing a test 3 times in a row), it must break the loop and trigger the `ASMP` (AI Self-Maintenance Protocol) to assess context drift.

## Trigger Conditions
Activate globally as a passive safety net during all Orchestrator and Sub-Agent tool executions.
