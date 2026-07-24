---
description: Generate complete email automation sequence
argument-hint: <flow-type> [goal]
---

# Email Flow Generator

Create complete email automation sequences with timing, content, and decision branches.

<flow_request>$ARGUMENTS</flow_request>

## Workflow

1. **Identify Flow Type**
   - Activate `email-marketing` skill
   - Load `references/automation-flows.md` for templates
   - Match request to flow template:

   | Flow Type | Trigger | Duration |
   |-----------|---------|----------|
   | welcome | New subscriber | 14 days |
   | cart | Abandoned cart | 7 days |
   | onboarding | New customer | 30 days |
   | nurture | Lead magnet download | 21 days |
   | re-engagement | Inactive 60+ days | 21 days |
   | upsell | Purchase complete | 30 days |
   | renewal | Subscription expiring | 30 days |
   | webinar | Webinar registration | 7 days |
   | custom | User-defined | Variable |

2. **Gather Context**
   - Inject brand context:
     ```bash
     node .claude/skills/brand-guidelines/scripts/inject-brand-context.cjs --json
     ```
   - Determine:
     - Product/service being promoted
     - Target audience
     - Desired conversion action
     - Available personalization data

3. **Generate Sequence Structure**
   - Number of emails
   - Timing/delays between emails
   - Decision branches (opened/clicked/purchased)
   - Exit conditions

4. **Create Email Content**
   - Activate `copywriting` skill for formulas
   - Load `references/subject-line-formulas.md`
   - For each email:
     - Subject line (with A/B variant)
     - Preview text
     - Body copy (using PAS, AIDA, etc.)
     - CTA

5. **Output**
   - Complete sequence → `assets/emails/flows/{flow-type}-{date}.md`
   - Visual flow diagram (ASCII art)
   - Implementation notes for email platform

## Skills Used

- `email-marketing` - Flow templates, best practices
- `copywriting` - Subject lines, body copy
- `brand-guidelines` - Voice consistency
- `assets-organizing` - Standardized output paths

## Agents Used

- `email-wizard` - Email sequence generation
- `copywriter` - Conversion copy

## Flow Types

### welcome
New subscriber welcome sequence (5 emails, 14 days)

### cart
Abandoned cart recovery (4 emails, 7 days)

### onboarding
New customer onboarding (7 emails, 30 days)

### nurture
Lead nurturing after download (5 emails, 21 days)

### re-engagement
Win-back inactive subscribers (4 emails, 21 days)

### upsell
Cross-sell after purchase (3 emails, 30 days)

### renewal
Subscription renewal sequence (4 emails, 30 days)

### webinar
Webinar registration to follow-up (5 emails, 7 days)

### custom
Describe your custom trigger and goal

## Output Format

```markdown
# Email Flow: [Flow Name]

**Trigger:** [What starts this flow]
**Goal:** [Desired conversion]
**Duration:** [X days]
**Emails:** [X emails]

---

## Flow Diagram

```
Trigger → Email 1 → Wait → [Condition?]
                           ├─ Yes → Email 2A
                           └─ No → Email 2B
```

---

## Email 1: [Name]

**Send:** Immediately / Day X
**Subject A:** [Subject line]
**Subject B:** [A/B variant]
**Preview:** [Preheader text]

### Body

[Email copy using copywriting formulas]

**CTA:** [Button text]

---

## Email 2: [Name]

...

---

## Implementation Notes

- **Platform:** [Mailchimp/ConvertKit/etc.]
- **Segments:** [Required segments]
- **Tags:** [Tags to apply]
- **Exit conditions:** [When to stop flow]
```

## Examples

```bash
# Pre-built flows
/email:flow welcome
/email:flow cart
/email:flow onboarding
/email:flow re-engagement

# With goal context
/email:flow nurture "convert to paid plan"
/email:flow upsell "sell annual upgrade"

# Custom flows
/email:flow custom "trial expiring, convert to paid"
/email:flow custom "course launch sequence for webinar attendees"
```
