# Research / Context Gathering — Delegation Prompt Template

Use this template when delegating codebase research or context gathering.
The result is a summary for the orchestrator to use — no file changes.

---

```markdown
# Research: [TOPIC TO RESEARCH]

## 🎯 Goal
[Describe clearly what to investigate and what the OUTPUT will be used for]

Example: "Analyze the authentication flow to understand how JWT tokens are created,
refreshed, and revoked. Output will be used to plan a token rotation feature."

## 📁 Where to Look

### Primary directories
- `packages/backend/src/auth/` — start here
- `packages/backend/src/users/` — related module

### Key files to read
- `packages/backend/src/auth/auth.service.ts` — main logic
- `packages/backend/src/auth/strategies/` — Passport strategies

### Also check
- Database entities related to auth
- Any middleware or guards
- Config/environment variables related to auth

## 🔍 Questions to Answer

[List SPECIFIC questions that need answering]

1. How does X work?
2. What triggers Y?
3. Where is Z configured?
4. What are the dependencies between A and B?
5. Are there any edge cases or known issues?

## 📊 Output Format

Provide a concise summary using this structure:

### Overview
[2-3 sentences high-level]

### Key Findings
1. **[Topic 1]**: [finding]
2. **[Topic 2]**: [finding]
...

### File Reference
| File | Role |
|------|------|
| `path` | What it does |

### Architecture Diagram (if applicable)
[Text-based flow: A → B → C]

### Concerns / Gotchas
- [Anything the orchestrator should be aware of]

## ⚠️ Constraints
- This is READ-ONLY research — DO NOT modify any files
- Keep summary CONCISE — bullet points preferred
- Focus on FACTS from code, not assumptions
- If something is ambiguous, state both possibilities
```
