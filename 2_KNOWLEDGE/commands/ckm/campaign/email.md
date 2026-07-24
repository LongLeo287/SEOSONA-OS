---
description: 💡💡 Email campaign management
argument-hint: [action]
---

Email campaign management for drip sequences, newsletters, and automated emails.

<args>$ARGUMENTS</args>

## Actions
- `create` - Create email campaign
- `sequence` - Design drip sequence
- `test` - A/B test design

## Workflow

1. **Parse Action** from `$ARGUMENTS`

2. **Create Workflow**
   - Use `email-wizard` agent to design email structure
   - Gather email details via `AskUserQuestion`:
     - Subject line variants
     - Audience segment
     - Send timing
   - Use `copywriter` agent for email copy
   - Activate `email-marketing` skill for templates
   - Output to `campaigns/email/{campaign-name}/`

3. **Sequence Workflow**
   - Use `email-wizard` agent for drip architecture
   - Design trigger conditions
   - Create email sequence timeline
   - Generate sequence files

4. **Test Workflow**
   - Use `email-wizard` agent for A/B test design
   - Generate variant copies
   - Define test parameters
   - Output test plan

## Agents Used
- `email-wizard` - Email strategy and optimization
- `campaign-manager` - Campaign coordination
- `copywriter` - Email copywriting

## Skills Used
- `email-marketing` - Templates and best practices
- `assets-organizing` - Standardized output paths

## MCP Integrations
- SendGrid - Email delivery
- Resend - Transactional email

## Output
- Email copy → `assets/copy/emails/{date}-{sequence}-{slug}.md`
- Sequences → `assets/campaigns/{date}-{slug}/briefs/email-sequence.md`
- Test plans → `assets/funnels/tests/{date}-{test-name}.md`

## Examples
```
/campaign/email create
/campaign/email sequence
/campaign/email test
```
