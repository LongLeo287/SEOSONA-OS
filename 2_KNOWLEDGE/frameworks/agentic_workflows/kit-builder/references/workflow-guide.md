# Workflow Creation Guide

Workflows = process definitions for multi-step orchestration.

## Location

`.opencode/workflows/{workflow-name}.md`

## Purpose

Define repeatable processes that:
- Coordinate multiple agents
- Define quality gates
- Establish handoff points
- Document decision trees

## Structure

```markdown
# Workflow Name

## Purpose
What this workflow accomplishes.

## Triggers
When to use this workflow.

## Agents Involved
| Agent | Role |
|-------|------|

## Process
### Phase 1: [Name]
- Step 1
- Step 2
### Phase 2: [Name]
...

## Quality Gates
- [ ] Checkpoint 1
- [ ] Checkpoint 2

## Outputs
Expected deliverables.
```

## Marketing Workflow Examples

| Workflow | Purpose |
|----------|---------|
| content-workflow | Content creation pipeline |
| campaign-workflow | Campaign launch process |
| seo-workflow | SEO optimization process |
| sales-workflow | Sales enablement pipeline |

## Workflow vs Command

| Aspect | Workflow | Command |
|--------|----------|---------|
| Scope | Full process | Single action |
| Invocation | Referenced | /command |
| Detail | Deep | Concise |
| Updates | Evolves | Stable |

## Best Practices

1. **Clear phases** - Break into logical steps
2. **Agent assignment** - Who does what
3. **Quality gates** - Validation checkpoints
4. **Decision trees** - Handle branches
5. **Outputs defined** - Expected deliverables

## Integration Patterns

### Workflow → Agent
```markdown
## Phase 1: Research
**Agent:** researcher
**Skills:** docs-seeker, web-search
**Output:** Research report
```

### Workflow → Command
```markdown
## Quick Start
Run `/write:blog [topic]` to begin.
```

## Quality Gate Template

```markdown
## Quality Gates
### Before Phase 2
- [ ] Research complete
- [ ] Outline approved
- [ ] Keywords validated

### Before Publish
- [ ] SEO check passed
- [ ] Brand review done
- [ ] Links verified
```

## Decision Tree Pattern

```markdown
## Routing
Content type?
├── Blog → content-workflow
├── Email → email-workflow
├── Social → social-workflow
└── Landing page → content-workflow + design-workflow
```
