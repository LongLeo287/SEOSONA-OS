---
name: "omniclaw_8_daemons_architecture"
description: "A framework based on OmniClaw V5.0 replacing free-willed agents with 8 hardcoded Python daemons for absolute system security and automated orchestration."
keywords: ["omniclaw", "daemon", "zero-trust", "architecture", "orchestration", "agent"]
---

# OmniClaw 8-Daemon Architecture (V5.0)

Most agentic frameworks fail because LLMs are given too much free will and bloated contexts. The OmniClaw Architecture solves this by replacing free-willed agents with **8 Immortal Python Daemons** that run on a strict Zero-Trust hierarchy.

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

## Key Philosophical Shifts for SEOSONA OS
When building or managing complex multi-agent SEO campaigns, apply these rules inspired by OmniClaw:
1. **Zero-Trust File Ops:** Agents should never be allowed to write "boilerplate" code directly to the core system. All agent creations must go to a Sandbox (`vault/tmp/sandbox/`), where the Warden (OSF) evaluates them.
2. **Deterministic Routing (OAP):** Do not let the LLM "guess" which agent to use. Use a hardcoded Triage Matrix to parse user intent and definitively map it to a specific workflow or sub-agent.
3. **Immortality via Daemons:** While Persona Agents (like Copywriter, SEO Specialist) are ephemeral and spun up per-task, the background Daemons (like the Hook system in `1_CORE/hooks/`) must always run to keep the system clean and orchestrated.
