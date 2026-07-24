# Completeness Output Enforcement

## Purpose

Deliver complete, runnable artifacts. Do not leave placeholder code, placeholder docs, or unverified claims in task outputs.

## Required Checks

1. Confirm every referenced file exists.
2. Confirm every command in the final answer was run in the current task.
3. Confirm generated docs do not contain unresolved placeholder text.
4. Confirm validation failures are reported as failures, not softened into success.
5. Record durable decisions in the appropriate project memory when the change affects future work.

TASK COMPLETED
