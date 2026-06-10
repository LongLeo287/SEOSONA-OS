---
name: ckm:email
description: Email campaigns, newsletters, drip sequences, automation flows, email copywriting, deliverability, subject line formulas, A/B testing. Generate email content for any marketing purpose.
argument-hint: "[flow|sequence|newsletter|cold|launch|nurture] [args]"
metadata:
  author: claudekit
  version: "1.0.0"
---

# Email

Email content creation, automation flows, and campaign management.

<args>$ARGUMENTS</args>

## When to Use

- Email content generation (newsletter, cold, launch, nurture, welcome, winback)
- Email automation flow design
- Drip sequence creation
- Subject line optimization
- Deliverability best practices

## Email Types

`newsletter`, `cold`, `followup`, `launch`, `nurture`, `welcome`, `winback`

## Workflow

1. Parse type from `$ARGUMENTS`
2. Gather context via `AskUserQuestion` (audience, message, CTA)
3. Use `email-wizard` + `copywriter` agents
4. Generate subject lines (3-5 variants), preview text, body, CTA
5. Output to `assets/copy/emails/{date}-{type}-{slug}.md`

## Subcommands

| Subcommand | Description | Reference |
|------------|-------------|-----------|
| `flow` | Generate complete email automation sequence | `references/flow.md` |
| `sequence` | Generate complete email drip sequence with copy | `references/sequence.md` |

## References (Knowledge Base)

| Topic | File |
|-------|------|
| Automation Flows | `references/automation-flows.md` |
| Subject Line Formulas | `references/subject-line-formulas.md` |
| Email Templates | `references/email-templates.md` |
| Deliverability Checklist | `references/deliverability-checklist.md` |

## Routing

1. Parse subcommand from `$ARGUMENTS` (first word)
2. Load corresponding `references/{subcommand}.md`
3. Execute with remaining arguments
