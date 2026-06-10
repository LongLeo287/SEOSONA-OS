# Completeness & Output Enforcement

Rules to prevent lazy output generation and truncated code.

## 1. No Placeholders
* Placeholder comments such as `// TODO`, `// ... rest of code`, or `/* similar to above */` are strictly forbidden.
* Always write the full file contents when creating or modifying files.

## 2. Continuation Breakpoints
If output limit is near:
1. Stop at a clean boundary.
2. Append: `[PAUSED - X of Y sections complete. Send "continue" to resume]`.
3. Pick up exactly where you left off on next turn.
