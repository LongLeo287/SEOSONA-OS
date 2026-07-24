---
name: ruflo-swarm-orchestration
description: Coordinates agent swarms and manages self-learning loops for complex, long-horizon tasks.
---

# Ruflo Swarm Orchestration

This skill integrates the `ruflo` harness methodology for multi-agent swarm coordination and self-learning inside SEOSONA OS.

## Usage Directives

1. **Task Delegation:** When given a multi-disciplinary goal (e.g., build a web app with SEO, database, and UI), break the task down and logically delegate it to specialized personas (e.g., `Orchestrator`, `Database Admin`, `Frontend Designer`).
2. **The Learning Loop:**
   - **Router:** Analyze the incoming user request.
   - **Swarm:** Spin up (or switch to) the necessary personas.
   - **Agents:** Execute the sub-tasks in parallel or sequentially.
   - **Memory:** After completion, evaluate the success.
   - **Update:** If a new pattern or solution was discovered, log it into `2_KNOWLEDGE/raw_data/` to make the swarm smarter for next time.
3. **Federation:** Assume agents act across boundaries. Enforce strict input/output contracts (JSON schemas) when handing off data between agent steps.

## Trigger Conditions
Activate this skill when acting as the **Orchestrator Agent** on tasks that span multiple domains or require long-running, cost-bounded agent looping.
