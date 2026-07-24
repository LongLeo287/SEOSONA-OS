---
description: "Wire DMP for Anthropic Cowork team usage: verifies Cowork sandbox, checks for a Drive MCP, creates the canonical Drive folder layout, and persists the team's routing config. Run once per team."
argument-hint: "[--brand <name>] [--drive-root <folder-name>]"
disable-model-invocation: false
---

# /digital-marketing-pro:cowork-setup

Routes to `skills/cowork-setup/SKILL.md`. This is the one-time setup that makes DMP usable by a team inside Cowork by routing brand state through a Drive MCP instead of the ephemeral Cowork sandbox.

## When to run

- First time a Cowork user installs DMP for their team
- When brand profiles aren't persisting across Cowork sessions
- When switching to a different team's Drive root folder

## Quick examples

```
/digital-marketing-pro:cowork-setup
/digital-marketing-pro:cowork-setup --brand acme
/digital-marketing-pro:cowork-setup --drive-root "ACME DigitalMarketingPro"
```

For the full setup spec, see [skills/cowork-setup/SKILL.md](../skills/cowork-setup/SKILL.md).
