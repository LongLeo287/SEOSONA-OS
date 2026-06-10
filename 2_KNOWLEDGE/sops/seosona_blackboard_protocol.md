# SOP: SEOSONA OS Blackboard Protocol

**Skill Reference:** `2_KNOWLEDGE/sops/seosona_blackboard_protocol.md`

## 1. PURPOSE
This protocol establishes the rules for task coordination, state transitions, and limits automation risks via the 2-Strike Failsafe rule.

## 2. BLACKBOARD COORDINATION
- The state of every Task must be tracked on a virtual "Blackboard" visible to all Sub-Agents:
  - `[ ]` Not started.
  - `[/]` In progress.
  - `[x]` Completed.
- Every Sub-Agent (DevOps, Designer, Auditor) MUST read the Blackboard before taking action to prevent file modification conflicts.

## 3. THE CEO RULE (Explicit Approval)
- Critical system changes (e.g., dropping a database, resetting a repository, modifying root configurations) MUST NOT be executed automatically.
- The process must pause and transition to "Awaiting CEO Approval" (User review).

## 4. THE 2-STRIKE FAILSAFE RULE
- During Auto-Heal (automatic compiler error resolution), the Agent is permitted a maximum of **2 consecutive attempts** (2 strikes) to fix an error.
- If the error persists after 2 attempts (Compile Fail), the Agent **MUST HALT** and report the raw logs to the User. Infinite loops are strictly prohibited.
