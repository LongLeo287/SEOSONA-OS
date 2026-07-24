# Artifact-Driven Planning SOP

This SOP enforces the mandatory Artifact-Driven Development (ADD) workflow for all SEOSONA agents.

## Core Philosophy
Never generate complex code directly into the chat or blindly edit files without a plan. Always structure your thoughts, plans, and execution via Markdown Artifacts.

## The 3 Artifacts

### 1. `implementation_plan.md`
- **When to use:** For any request requiring major architectural changes, deep research, or multi-step execution.
- **Where to save:** Write directly to the user's workspace or artifact directory.
- **Content:**
  - Problem Statement
  - Proposed Changes (Grouped by file: `[NEW]`, `[MODIFY]`, `[DELETE]`)
  - Open Questions / User Feedback Required
- **Rule:** You MUST wait for explicit CEO approval of this plan before writing a single line of code.

### 2. `task.md`
- **When to use:** Create this immediately AFTER the `implementation_plan.md` is approved.
- **Purpose:** A living checklist to track execution.
- **Format:**
  - `- [ ]` Uncompleted task
  - `- [/]` In progress task
  - `- [x]` Completed task
- **Rule:** Update this file constantly as you make progress. It serves as your state tracker if context is dropped.

### 3. `walkthrough.md`
- **When to use:** Create this at the end of execution.
- **Purpose:** To summarize what was accomplished, what was tested, and present the final results to the user.
- **Rule:** Never re-summarize the walkthrough in the chat. Just link to it.

## Enforcing the Flow
1. Intake Request -> Write `implementation_plan.md` -> Wait.
2. Approved -> Write `task.md` -> Execute.
3. Done -> Write `walkthrough.md` -> Notify "TASK COMPLETED".
