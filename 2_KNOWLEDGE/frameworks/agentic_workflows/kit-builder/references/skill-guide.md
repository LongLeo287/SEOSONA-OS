# Skill Creation Guide

Skills = domain knowledge + tools + scripts for Claude Code to perform specialized tasks.

## Structure

```
.opencode/skills/{skill-name}/
├── SKILL.md          # Entry point (<100 lines)
├── references/       # Docs loaded on-demand
├── scripts/          # Executable code
├── assets/           # Output templates
└── .env.example      # If API keys needed
```

## SKILL.md Format

```yaml
---
name: skill-name          # lowercase-hyphenated
description: When to use  # Triggers activation
license: MIT              # Optional
---
```

Body: Quick reference, workflow, tables. <100 lines.

## Key Principles

1. **Progressive Disclosure** - SKILL.md = index, references = details
2. **Token Efficient** - Each file <100 lines
3. **Practical** - Instructions for doing, not documentation
4. **Standalone** - Can combine with other skills

## Marketing Skill Examples

| Skill | Purpose |
|-------|---------|
| copywriting | Conversion formulas, headlines, CTAs |
| email | Sequences, templates, deliverability |
| seo | Keywords, audits, pSEO |
| brand | Voice, colors, logo usage |

## Creation Workflow

1. **Define scope** - What task(s)?
2. **Identify patterns** - Reusable workflows?
3. **Create SKILL.md** - Index + quick ref
4. **Add references** - Detailed patterns
5. **Add scripts** - If deterministic tasks
6. **Test** - Use in real scenarios

## References Best Practice

- File per topic (<100 lines each)
- Practical patterns, not theory
- Include examples
- Link related references

## Scripts Best Practice

- Node.js or Python (not bash)
- Support `.env` hierarchy
- Include tests
- Handle errors gracefully

## Connecting to Agents

Add "Agent Integration" section to SKILL.md:
```markdown
## Agent Integration
**Primary Agent:** {agent-name}
**Related Skills:** {comma-separated}
```
