# Implementation Task — Delegation Prompt Template

Use this template when delegating complex tasks: adding features, implementing modules, refactoring.
The orchestrator must FILL all sections before delegating. Remove sections that don't apply.

---

```markdown
# Task: [SHORT TASK NAME]

## 🎯 Goal
[1-2 sentences describing the final objective. The agent must understand EXACTLY what to achieve.]

## 🏗️ Architecture Context
[Describe the relevant architecture — the agent has NO context about the codebase]

- **Project type**: [e.g., NestJS backend monorepo, Next.js frontend]
- **Module location**: [e.g., `packages/backend/src/notifications/`]
- **Key patterns used**:
  - [e.g., NestJS Modules + DI, TypeORM entities, class-validator DTOs]
  - [e.g., Event-driven via @OnEvent decorators]
  - [e.g., REST controllers return { data, meta } format]
- **Related modules** (for reference, DO NOT modify):
  - [e.g., `packages/backend/src/issues/` — similar CRUD pattern]
  - [e.g., `packages/backend/src/events/events.gateway.ts` — WebSocket]

## 📁 File Map

### Files to MODIFY (primary scope)
| File | What to change |
|------|---------------|
| `path/to/file.ts` | [Describe what specifically needs to change] |
| `path/to/file2.ts` | [Describe specifically] |

### Files to CREATE
| File | Purpose |
|------|---------|
| `path/to/new-file.ts` | [Describe the new file to create] |

### Files to READ (for context only — DO NOT modify)
| File | Why read |
|------|---------|
| `path/to/reference.ts` | [e.g., Follow same pattern for new implementation] |
| `path/to/types.ts` | [e.g., Import shared types from here] |

### 🚫 Off-limits (MUST NOT touch)
- `packages/frontend/` — frontend changes handled separately
- `*.spec.ts` — tests handled in a separate task
- [Any other boundaries]

## 📋 Step-by-Step Implementation

[Break down into clear steps. The agent follows each step in order.]

### Step 1: [Step name]
- Read `path/to/reference.ts` to understand the existing pattern
- Create `path/to/new-file.ts` following the same pattern
- [Specific details: class name, method name, signature]

### Step 2: [Step name]
- Modify `path/to/existing.ts`:
  - Add import for `NewModule` from step 1
  - Register `NewModule` in the `imports` array
- [Continue with details...]

### Step 3: [Step name]
- ...

## 🔧 Code Conventions

[Conventions the agent MUST follow — this is the most important section for quality]

- **Naming**: camelCase for variables, PascalCase for classes, UPPER_SNAKE for constants
- **Imports**: Use path aliases `@/` not relative `../../`
- **Error handling**: Throw framework-specific exceptions, not generic Error
- **DTOs**: Use class-validator decorators, extend from shared base if available
- **Entity**: ORM decorators, uuid primary key, timestamps via BaseEntity
- **Response format**: `{ data: T }` for single, `{ data: T[], meta: { total, page, limit } }` for lists
- [Add project-specific conventions]

## ✅ Acceptance Criteria

[Agent self-verifies before reporting completion]

1. [ ] [Criteria 1 — specific, testable]
2. [ ] [Criteria 2]
3. [ ] [Criteria 3]
4. [ ] Code compiles without errors (`npm run build` passes)
5. [ ] No lint errors (`npm run lint` passes)

## 🧪 Verification Commands

[Agent runs these commands after implementation]

```bash
# Build check
cd packages/backend && npm run build

# Lint check
cd packages/backend && npm run lint

# Run related tests (if applicable)
cd packages/backend && npm run test -- --grep "module-name"
```

## ⚠️ Constraints

- DO NOT modify files outside the scope defined in File Map
- DO NOT install new dependencies unless explicitly listed
- DO NOT change existing API contracts (request/response shapes)
- DO NOT add console.log — use the project's Logger
- Follow existing code patterns — do NOT introduce new patterns
- If something is unclear, make the SAFEST choice and note it in the report

## 📊 Report Format

When done, output this summary:

### Changes Made
| File | Action | Description |
|------|--------|-------------|
| `path` | Created/Modified | What changed |

### Verification Results
- Build: ✅/❌
- Lint: ✅/❌
- Tests: ✅/❌ (N passed, M failed)

### Decisions Made
- [Any ambiguous points where the agent had to make a choice]

### Potential Issues
- [Anything the orchestrator should review carefully]
```
