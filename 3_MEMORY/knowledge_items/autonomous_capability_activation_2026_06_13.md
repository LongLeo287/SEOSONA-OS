---
type: knowledge_item
domain: autonomous_capability_activation
status: active
created_at: 2026-06-13
sources:
  - 1_CORE/scripts/autonomous_activation_gate.py
  - 2_KNOWLEDGE/frameworks/agentic_workflows/autonomous_capability_activation/SKILL.md
  - 2_KNOWLEDGE/workflows/autonomous-capability-activation.md
---

# KI: Autonomous Capability Activation

SEOSONA now has a single preflight gate for non-trivial tasks:

```bash
npm run autonomy:intake -- --task "<task>"
```

The gate prevents manual drift by automatically surfacing:

- relevant Knowledge Items
- context engine blocks
- intent-router matches
- capability bridge routes
- knowledge graph routes
- audit execution waves when applicable
- recommended files and personas

## Operational Rule

Before review, audit, fix, ingestion, issue creation, tests, or push, run the gate and use its returned skills, workflows, KIs, and personas as the execution stack. This ensures SEOSONA uses its existing system knowledge instead of relying on the current agent to remember everything manually.
