---
name: "hermes_learning_loop"
description: "Architecture for building self-improving agents with closed learning loops, automated cron auditing, and subagent delegation."
keywords: ["hermes", "agent", "learning-loop", "subagent", "autonomy"]
---

# Hermes Agent Architecture

This skill defines the blueprint for designing self-improving, highly autonomous agents in SEOSONA OS, inspired by the NousResearch Hermes Agent.

## 1. Closed Learning Loop

Agents must not rely solely on static prompts. They must evolve:
- **Experience Extraction:** After completing complex tasks, the agent should summarize its trajectory and extract a new reusable skill or heuristic.
- **Skill Generation:** Write these lessons back to the Knowledge Graph (similar to SEOSONA OS's Autopoiesis).
- **Periodic Nudges:** Implement background processes that periodically wake up the agent to review its recent logs and consolidate memory, even when the user is not actively prompting.

## 2. Subagent Delegation

Do not build monolithic prompts that do everything.
- **Isolation:** Spawn isolated subagents (workers) for parallel workstreams.
- **Zero-Context-Cost Turns:** Have the main orchestrator write Python scripts or orchestration plans that call specific tools via RPC, rather than feeding the entire context window into a single LLM call.
- **Persistence:** Subagents should be able to hibernate when idle and wake on demand.

## 3. Scheduled Automations (Cron)
- Implement cron-based schedulers for routine tasks (e.g., daily SEO reports, nightly backups, weekly audits).
- Allow the agent to interact with the OS environment unattended, waking up via scheduled triggers rather than direct human inputs.
