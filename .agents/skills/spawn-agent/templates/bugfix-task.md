# Bug Fix — Delegation Prompt Template

Use when delegating a specific bug fix. Shorter than the implementation template since the scope is smaller.

---

```markdown
# Fix: [SHORT BUG DESCRIPTION]

## 🐛 Bug Description
[Describe the bug clearly: current behavior vs expected]

- **Current behavior**: [X happens]
- **Expected behavior**: [Y should happen]
- **Reproduction**: [Steps or endpoint/input that triggers the bug]

## 📍 Suspected Location
- Primary: `path/to/file.ts` — [function/method name]
- Related: `path/to/related.ts` — [may be related]

## 🔧 Fix Approach (if known)
[If the orchestrator has already identified the root cause, describe the approach here]

- Root cause: [e.g., missing null check at line X]
- Fix: [e.g., Add guard clause before accessing property]

OR if root cause is unknown:
- Investigate the error by reading the relevant files
- Trace the execution flow from [entry point]
- Identify root cause and fix

## ✅ Verification

After fixing, verify:
1. [ ] Bug no longer reproduces
2. [ ] Build passes: `cd packages/backend && npm run build`
3. [ ] Existing tests still pass: `npm run test`
4. [ ] No regression in related functionality

## ⚠️ Constraints
- Fix ONLY the bug — do not refactor surrounding code
- Do not change API contracts
- Keep the fix minimal and targeted

## 📊 Report Format

### Root Cause
[1-2 sentences explaining why the bug occurred]

### Fix Applied
| File | Change |
|------|--------|
| `path` | What was fixed |

### Verification
- Build: ✅/❌
- Tests: ✅/❌
- Manual check: [describe]
```
