---
description: 💡💡 Generate email content
argument-hint: [type]
---

Generate email content for various marketing purposes.

<type>$ARGUMENTS</type>

## Email Types
- `newsletter` - Newsletter content
- `cold` - Cold outreach email
- `followup` - Follow-up sequence
- `launch` - Product launch email
- `nurture` - Nurture sequence email
- `welcome` - Welcome email series
- `winback` - Re-engagement email

## Workflow

1. **Parse Type** from `$ARGUMENTS`

2. **Gather Context**
   - Ask via `AskUserQuestion`:
     - Target audience/persona
     - Key message/offer
     - Desired action (CTA)

3. **Email Creation**
   - Use `email-wizard` agent for email strategy
   - Use `copywriter` agent for compelling copy
   - Activate `email-marketing` skill for templates
   - Generate:
     - Subject line variants (3-5)
     - Preview text
     - Email body
     - CTA

4. **Optimization**
   - Deliverability check
   - Mobile-friendly formatting
   - A/B test recommendations

5. **Output**
   - Email file → `assets/copy/emails/{date}-{type}-{slug}.md`

## Agents Used
- `email-wizard` - Email strategy
- `copywriter` - Email copywriting

## Skills Used
- `email-marketing` - Best practices and templates
- `creativity` - Email visual design, color psychology, style selection
- `assets-organizing` - Standardized output paths

## Output
- Email content → `assets/copy/emails/{date}-{type}-{slug}.md`

## Examples
```
/email newsletter
/email cold "SaaS founders"
/email launch "New Feature"
/email nurture
```
