---
name: prompt-master
description: Advanced structural prompt engineering and chain-of-thought templates for sub-agent delegation.
---

# Prompt Master: Advanced Delegation

This skill defines the strict formatting required when the Orchestrator Agent delegates tasks to sub-personas.

## Usage Directives
1. **Structure:** Every prompt must include `[CONTEXT]`, `[TASK]`, `[PERSONA]`, and `[FORMAT]`.
2. **Chain-of-Thought:** When requesting complex logic, explicitly add "Think step-by-step before executing."
3. **Falsifiability:** Demand that the output includes a self-verification step (e.g., "Verify that no links return 404").

## Trigger Conditions
Activate whenever creating new `.md` skills or when generating instructions for background tasks.
