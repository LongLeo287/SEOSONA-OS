---

name: "addyosmani_agent_skills"
description: "This repository encodes production-grade engineering workflows, quality gates, and best practices that senior engineers use, packaged specifically for AI coding agents."
keywords: ["addyosmani_agent_skills", "ingested"]
mcp_compatible: true
---

# AddyOsmani Agent Skills Methodology

**Source:** http~/.seosona/path/
**Date Ingested:** 2026-06-15

## Core Philosophy
This repository encodes production-grade engineering workflows, quality gates, and best practices that senior engineers use, packaged specifically for AI coding agents.

The core principle revolves around the software development lifecycle:
`Idea -> Spec -> Code -> Test -> QA -> Go Live`
Mapped to 7 slash commands:
1. `/spec` - Spec before code.
2. `/plan` - Small, atomic tasks.
3. `/build` - Build incrementally (one slice at a time).
4. `/test` - Tests are proof.
5. `/review` - Improve code health before merging.
6. `/code-simplify` - Clarity over cleverness.
7. `/ship` - Faster is safer.

## The Auto Build Concept (`/build auto`)
Generates the plan and implements every task in a single approved pass. The user approves the plan once, then the agent runs autonomously. It relies on test-driven approaches and individual commits, pausing on failures or risky steps.

## The 24 Skills
The repository contains 24 skills, 23 lifecycle skills + `using-agent-skills` meta-skill.
- **using-agent-skills:** Maps incoming work to the right skill workflow and defines shared operating rules.
- **interview-me:** One-question-at-a-time interview to extract user intent.
- **idea-refine:** Divergent/convergent thinking for vague concepts.
- **spec-driven-development:** Write PRDs before any code.

## Integration with SEOSONA OS
SEOSONA OS Orchestrator Agents can mimic or directly invoke these workflows when handling long-running software development tasks. Specifically, the "Spec -> Plan -> Build -> Test" sequence perfectly aligns with SEOSONA's `cost-bounded-agent-looping` and `autonomous-capability-activation`.
