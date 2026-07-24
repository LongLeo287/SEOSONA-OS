---
description: Generate complete email drip sequence with copy
argument-hint: <type> "[context]"
---

# Email Sequence Generator

Generate a complete email sequence with full copy, subject lines, and timing.

<sequence_input>$ARGUMENTS</sequence_input>

## Sequence Types

| Type | Emails | Duration | Purpose |
|------|--------|----------|---------|
| `welcome` | 5 | 14 days | Build relationship, introduce offer |
| `onboarding` | 7 | 21 days | Product activation, feature discovery |
| `nurture` | 6 | 30 days | Educate, build trust, soft sell |
| `abandon` | 3 | 3 days | Recover cart/signup abandonment |
| `winback` | 4 | 14 days | Re-engage inactive users |
| `launch` | 5 | 7 days | Product launch countdown |

## Workflow

### Step 1: Parse Input

Extract sequence type and context:
- `welcome` → New subscriber welcome series
- `onboarding "SaaS tool"` → Product-specific onboarding
- `launch "Black Friday"` → Campaign-specific launch

### Step 2: Inject Brand Context

```bash
node .claude/skills/brand-guidelines/scripts/inject-brand-context.cjs --json
```

Extract: brand voice, tone, prohibited words, CTA style.

### Step 3: Load Email Templates

Activate `email-marketing` skill and read:
- `.claude/skills/email-marketing/references/automation-flows.md`
- `.claude/skills/email-marketing/references/subject-line-formulas.md`
- `.claude/skills/email-marketing/references/email-templates.md`

### Step 4: Generate Sequence Plan

Create sequence architecture:

```
SEQUENCE: {type}
TRIGGER: {event}
DURATION: {days}
GOAL: {conversion goal}

EMAIL 1 (Day 0)
├── Purpose: {purpose}
├── Subject: {subject line}
├── Hook: {opening line}
├── Body: {main content}
├── CTA: {call to action}
└── Next: Wait {n} days

EMAIL 2 (Day {n})
...
```

### Step 5: Write Full Email Copy

For each email, generate:
1. **Subject line** (3 variants using formulas)
2. **Preview text** (40-90 chars)
3. **Opening hook** (pattern interrupt)
4. **Body copy** (using PAS/AIDA)
5. **CTA button** (action-oriented)
6. **P.S. line** (urgency/social proof)

### Step 6: Add Automation Logic

Include branching conditions:
- Opened? → Engaged path
- Clicked? → Interest path
- Purchased? → Exit flow
- No action? → Reminder path

### Step 7: Save Output

```
assets/copy/emails/{date}-{type}-sequence/
├── 00-sequence-plan.md
├── 01-{purpose}.md
├── 02-{purpose}.md
├── 03-{purpose}.md
├── 04-{purpose}.md
└── 05-{purpose}.md
```

## Output Format

### Sequence Plan (00-sequence-plan.md)

```markdown
# {Type} Email Sequence

## Overview
- **Trigger:** {trigger event}
- **Emails:** {count}
- **Duration:** {days}
- **Goal:** {conversion goal}

## Flow Diagram
{ASCII flow diagram}

## Timing
| Email | Day | Subject | Purpose |
|-------|-----|---------|---------|
| 1 | 0 | ... | ... |
| 2 | 1 | ... | ... |

## Exit Conditions
- {condition 1}
- {condition 2}
```

### Individual Email (01-welcome.md)

```markdown
# Email 1: {Title}

**Day:** 0 (Immediate)
**Purpose:** {purpose}

## Subject Lines (Pick One)
1. {subject 1}
2. {subject 2}
3. {subject 3}

## Preview Text
{40-90 char preview}

## Email Body

{Full email copy with formatting}

## CTA
**Button:** {CTA text}
**Link:** {destination}

## P.S.
{urgency or social proof}

---
*Next email: Day {n} - {next purpose}*
```

## Examples

```bash
/email:sequence welcome
/email:sequence onboarding "project management SaaS"
/email:sequence launch "New Year sale 40% off"
/email:sequence abandon "checkout"
/email:sequence nurture "B2B lead magnet"
```

## Skills Used

- `email-marketing` - Sequence templates, timing, automation
- `copywriting` - Email copy formulas, subject lines
- `brand-guidelines` - Voice, tone, CTA style
