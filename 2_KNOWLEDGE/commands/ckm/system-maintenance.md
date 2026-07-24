# system-maintenance.md

Trigger the **AI Self-Maintenance Protocol** to clean up the SEOSONA OS system.

**Usage:** `/system-maintenance` or "clean system", "run maintenance"

## Execution Strategy
When this command is invoked, the AI must strictly follow the workflow defined at:
`~/.seosona/1_CORE/workflows/system_maintenance_workflow.md`

## Summary of Actions
1. **Garbage Collection:** Cleans up `ingestion_zone`, scratch directories, and old error logs.
2. **Memory Compaction:** Reads the transcript, extracts insights to `knowledge_items`, and archives the heavy `transcript.jsonl`.
3. **Health Audit:** Checks hooks, the SKILLS_ROUTER, and API connections to ensure the OS is stable.

*Do not run this command unless instructed or if the system feels significantly slow/context-heavy.*
