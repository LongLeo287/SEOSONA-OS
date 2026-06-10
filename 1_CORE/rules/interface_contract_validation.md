# Interface Contract Validation

Ensures every exported module, agent, or function adheres to its declared API contract before code is committed or shipped.
Prevents silent breaking changes and API drift across the SEOSONA OS skill ecosystem.

---

## 1. What is an Interface Contract?

An Interface Contract is a machine-readable declaration of what a module **must** export.
It lives in a `_CONTRACT_ANCHOR.md` file at the root of each skill or module directory.

**Format:**
```markdown
# Contract Anchor — [skill-name]
MUST_EXPORT: [function_a, function_b, ClassC]
MUST_ACCEPT: [param_x: str, param_y: int]
MUST_RETURN: [dict with keys: status, result, error]
SIDE_EFFECTS: none | [describe side effects]
```

---

## 2. Validation Trigger Conditions

Validate interface contracts when:
- A skill file (`.py`, `.ts`, `.js`) is modified under `2_KNOWLEDGE/frameworks/`.
- A new Agent persona is created under `4_AGENTS/personas/`.
- A new Hook is added to `1_CORE/hooks/`.
- Before any `npm run prepublishOnly` or packaging step.

---

## 3. Validation Protocol

### Step 1 — Locate Contract
Search for `_CONTRACT_ANCHOR.md` in the modified file's directory and parent directories (up to 2 levels).

### Step 2 — Parse Declarations
Extract all `MUST_EXPORT`, `MUST_ACCEPT`, `MUST_RETURN` lines.

### Step 3 — Static Analysis
```bash
# For Python
grep -n "def function_a\|class ClassC" target_file.py

# For TypeScript/JS
grep -n "export function\|export class\|module.exports" target_file.ts
```

### Step 4 — Assert
- If all declared symbols are present → `CONTRACT_OK`
- If any symbol is missing → `CONTRACT_VIOLATION`
  - Log violation to `3_MEMORY/errors/contract_violations.log`
  - Halt execution and report to user

---

## 4. Hook Contract Standards

Every `.cjs` hook in `1_CORE/hooks/` must satisfy:
```
MUST_ACCEPT:  JSON via stdin (Claude Code hook format)
MUST_RETURN:  process.exit(0) on success, process.exit(1) only for blocking violations
SIDE_EFFECTS: never throw uncaught exceptions (use try/catch everywhere)
TIMEOUT:      must complete within 10 seconds or pass through silently
```

---

## 5. Skill Contract Standards

Every `SKILL.md` in `2_KNOWLEDGE/frameworks/` must contain:
- `skill:` frontmatter key
- `category:` frontmatter key
- At minimum 1 `## ` section heading with actionable content
- Must NOT contain hardcoded absolute paths

---

## 6. Violation Log Format

Append to `3_MEMORY/errors/contract_violations.log`:
```
[TIMESTAMP] VIOLATION | File: path/to/file.py | Missing: [function_a, ClassC] | Contract: path/to/_CONTRACT_ANCHOR.md
```
