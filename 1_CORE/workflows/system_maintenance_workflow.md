# WORKFLOW: AI Self-Maintenance Protocol

**Purpose:** Ensure SEOSONA OS remains fast, clean, and context-efficient by cleaning up tmp files, compacting memory logs, and auditing the system graph.
**Trigger:** `/system-maintenance`, "clean system", "run maintenance"
**Agent:** `orchestrator` (delegating to `debugger` and `mcp-manager`)

---

## PHASE 1: CLEANUP & GC (Garbage Collection)
*Objective: Remove useless files to save disk space and AI context limits.*

### Step 1: Clear Tmp & Scratch Space
- Action: Delete all temporary files in `3_MEMORY/ingestion_zone/` if they are already processed.
- Action: Scan for `.DS_Store` or other OS junk files and remove them.
- Output: Status report of space saved.

### Step 2: Clear Error Logs
- Action: Archive or delete files in `3_MEMORY/errors/` that are older than 7 days or have been resolved.

---

## PHASE 2: MEMORY COMPACTION
*Objective: Prevent the transcript log from growing infinitely and slowing down context injection.*

### Step 1: Analyze Transcript
- Action: Read `3_MEMORY/logs/transcript.jsonl`. 
- Rule: If the file is smaller than 2000 lines, skip compaction. If it is larger, proceed.

### Step 2: Extract Knowledge Items (KI)
- Action: Read the recent `transcript.jsonl` entries. Identify any resolved bugs, newly established patterns, or important decisions.
- Output: Create a new markdown file in `3_MEMORY/knowledge_items/` summarizing these findings so the AI doesn't forget them.

### Step 3: Archive & Truncate
- Action: Move the current `transcript.jsonl` to `3_MEMORY/logs/archive/transcript_<date>.jsonl`.
- Action: Create a fresh, empty `transcript.jsonl`.
- Action: Write a `write-compact-marker` to signify compaction has occurred.

---

## PHASE 3: SYSTEM HEALTH AUDIT
*Objective: Ensure all system links and connections are intact.*

### Step 1: Hook Check
- Action: Run a quick script to verify all 11 hooks in `1_CORE/hooks/` exist and are executable.

### Step 2: Router Check
- Action: Check `2_KNOWLEDGE/SKILLS_ROUTER.md` for any broken directory paths.

### Step 3: Secrets & API Check
- Action: Ping configured MCP servers or APIs (like Google Analytics, Firecrawl) to ensure connection credentials are still valid.

---

## OUTPUT FORMAT

```markdown
## SEOSONA OS Maintenance Report
**Date:** [YYYY-MM-DD]

### 1. Cleanup Results
- Cleared [X] files from tmp/ingestion.
- Archived [Y] old error logs.

### 2. Memory Status
- Transcript compacted? [Yes/No] (Extracted [Z] new Knowledge Items).

### 3. System Health
- Hooks: [OK / ERROR]
- Router: [OK / ERROR]
- Integrations: [OK / ERROR]

**System is clean and ready for optimal performance.**
```

## SUCCESS CRITERIA
- [ ] No junk files remain in ingestion zones.
- [ ] Transcript size is kept within context limits.
- [ ] Final report is written to `3_MEMORY/logs/maintenance_report.md`.
