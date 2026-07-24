---
description: Generate copy using proven copywriting formulas (AIDA, PAS, BAB, etc.)
argument-hint: <formula> "<topic>"
---

# Copy Formula Generator

Generate persuasive copy using proven copywriting frameworks with brand context.

<formula>$ARGUMENTS</formula>

## Available Formulas

| Formula | Best For |
|---------|----------|
| **AIDA** | Landing pages, ads, sales emails |
| **PAS** | Email, sales pages, problem-focused |
| **BAB** | Testimonials, case studies, transformations |
| **4Ps** | Sales letters, long-form |
| **ACCA** | Awareness campaigns |
| **FAB** | Product descriptions, features |

## Workflow

### Step 1: Parse Arguments

Extract formula and topic from input:
- If only topic provided, default to AIDA
- Supported: AIDA, PAS, BAB, 4Ps, ACCA, FAB

### Step 2: Inject Brand Context

```bash
node .claude/skills/brand-guidelines/scripts/inject-brand-context.cjs --json
```

Use brand voice, prohibited words, and tone.

### Step 3: Load Formula Reference

Activate `copywriting` skill and read:
- `.claude/skills/copywriting/references/copy-formulas.md`
- `.claude/skills/copywriting/references/power-words.md`

### Step 4: Generate Copy

Apply the formula structure to the topic:

**AIDA Structure:**
```
ATTENTION: Bold hook using brand voice
INTEREST: Why this matters (pain/gain)
DESIRE: Transformation picture
ACTION: CTA with brand tone
```

**PAS Structure:**
```
PROBLEM: Specific pain point
AGITATE: Consequences, frustration
SOLUTION: Your offer as the answer
```

**BAB Structure:**
```
BEFORE: Current painful state
AFTER: Desired transformed state
BRIDGE: How your solution gets them there
```

### Step 5: Output Variants

Generate 3 variants:
1. **Short** - Social/ad length (~50 words)
2. **Medium** - Email/landing section (~150 words)
3. **Long** - Full sales copy (~300 words)

### Step 6: Save Output

Save to: `assets/copy/{date}-{formula}-{slug}.md`

## Examples

```bash
/copy:formula AIDA "SaaS product launch"
/copy:formula PAS "email deliverability problems"
/copy:formula BAB "fitness transformation program"
/copy:formula "marketing automation tool"  # defaults to AIDA
```

## Output Format

```markdown
# {Topic} - {Formula} Copy

## Brand Context
- Voice: {extracted voice}
- Tone: {extracted tone}

## Short Version (Social/Ad)
{50-word copy}

## Medium Version (Email/Landing)
{150-word copy}

## Long Version (Sales Page)
{300-word copy}

---
Generated: {date}
Formula: {formula}
```

## Skills Used

- `copywriting` - Formulas, power words, templates
- `brand-guidelines` - Voice, tone, prohibited words
