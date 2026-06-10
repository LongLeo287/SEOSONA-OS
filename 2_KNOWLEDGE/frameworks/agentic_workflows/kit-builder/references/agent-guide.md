# Agent Creation Guide

Agents = specialized subagents for Task tool orchestration.

## Location

`.opencode/agents/{agent-name}.md`

## Format

```yaml
---
name: agent-name
description: When to trigger. Include examples.
model: sonnet  # sonnet|opus|haiku
---
```

## Description Pattern

```
Use this agent when [trigger condition]. Examples:

<example>
Context: [situation]
user: "[user message]"
assistant: "[response showing delegation]"
<commentary>[why use this agent]</commentary>
</example>
```

## Body Structure

1. **Role Statement** - "You are a [expertise] agent..."
2. **Skills to Activate** - IMPORTANT note for skill activation
3. **Expertise Areas** - What agent knows
4. **Process/Workflow** - How agent works
5. **Output Format** - What to deliver
6. **Asset Output** - Where to save files

## Marketing Agent Examples

| Agent | Trigger |
|-------|---------|
| copywriter | High-converting copy needed |
| seo-specialist | SEO audit, keywords |
| email-wizard | Email sequences, campaigns |
| campaign-manager | Multi-channel campaigns |

## Agent vs Skill

| Aspect | Agent | Skill |
|--------|-------|-------|
| Invocation | Task tool | Auto-activated |
| Purpose | Orchestrate | Knowledge |
| Context | Own thread | Shared |
| Complexity | High-level tasks | Domain patterns |

## Best Practices

1. **Clear triggers** - When exactly to use
2. **Rich examples** - Show real scenarios
3. **Skill activation** - Reference related skills
4. **Model selection** - haiku=fast, sonnet=balanced, opus=complex
5. **Output paths** - Define where to save assets

## Connecting to Skills

```markdown
**IMPORTANT**: Activate `{skill-name}` skill for this task.
```

## Asset Organization

```markdown
## Asset Output
When saving files:
- Category → `assets/{category}/{date}-{slug}.md`
```
