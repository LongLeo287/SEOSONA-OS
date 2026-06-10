---
name: ckm:play
description: >
  Marketing playbook orchestrator with dependency-graph routing, quality gates,
  goal tracking, and smart suggestions. Expert strategy × AI execution speed.
  Triggers: /ckm:play, playbook, campaign playbook, what's next, play status.
argument-hint: "[create|next|status|list|blocked|learn|reset|gate|templates|goals] [args]"
metadata:
  author: claudekit
  version: "1.0.0"
---

# Play — Marketing Playbook Orchestrator

Expert marketing strategy executed at AI speed. `Expert Strategy × AI Execution Speed = 10x Output`.

<args>$ARGUMENTS</args>

## Scope

This skill handles: playbook orchestration, template management, goal tracking, dependency routing, quality gates.
Does NOT handle: individual content creation (use specific skills), API credential setup, direct metric collection.

## Workflow

1. **Parse** — extract subcommand + args from `$ARGUMENTS`
2. **Route** — load corresponding `references/{subcommand}.md`
3. **Load State** — read `data/playbooks/{slug}/manifest.json`
4. **Evaluate Graph** — `scripts/graph.cjs` determines ready/blocked/stale steps
5. **Check Goals** — `scripts/goals.cjs` pulls metrics, compares to targets
6. **Smart Suggest** — `scripts/smart-suggest.cjs` surfaces goal-aligned actions
7. **Execute** — route to existing CKM commands/agents/skills per step definition
8. **Update State** — write manifest with step status, outputs, timestamps

If no subcommand: show dashboard (all playbooks status).
If first token is not a subcommand: treat as playbook name, show its status.

## Entry Points

| Subcommand | Reference |
|---|---|
| `create <name> [--template <id>]` | `references/create.md` |
| `next [name]` | `references/next.md` |
| `status [name]` | `references/status.md` |
| `list` | `references/list.md` |
| `blocked [name]` | `references/blocked.md` |
| `learn [name]` | `references/learn.md` |
| `reset <name> [step]` | `references/reset.md` |
| `gate <name> <step> approve\|reject` | `references/gate.md` |
| `templates [--browse]` | `references/templates.md` |
| `goals [set\|pull]` | `references/goals.md` |

## Scripts

| Script | Purpose |
|---|---|
| `scripts/manifest.cjs` | Playbook state CRUD |
| `scripts/graph.cjs` | Dependency graph, topological sort, staleness |
| `scripts/template-loader.cjs` | Load/validate templates |
| `scripts/goals.cjs` | Goal tracking + trend display |
| `scripts/metrics-bridge.cjs` | Bridge to existing GA4/GSC/Stripe skills |
| `scripts/smart-suggest.cjs` | Goal-gap → step mapping |

## Templates

Each step has three layers: `strategy` (expert reasoning), `ai_execution` (AI acceleration), `human_decision` (human judgment).

Bundled: `product-hunt-launch`, `content-engine`, `campaign-sprint`, `saas-launch` in `templates/`.
Schema: `templates/_schema.json`. Future: MCP server for community templates.

## State

Manifest at `data/playbooks/{slug}/manifest.json` tracks:
- Step statuses: pending → in-progress → completed (or gate-pending, blocked, stale)
- Goal targets + current values + trends
- Learnings captured from completed steps
- Template source + version for reproducibility

## Goal Tracker

Reuses existing CKM skills: `ckm:analytics` (GA4), `ckm:seo` (GSC), `ck:payment-integration` (Stripe).
New wrappers: `metrics-email.cjs` (SendGrid), `metrics-social.cjs`.
Fallback: manual input when no API access.

Smart suggestions: biggest goal gaps × step readiness × expected impact → top 3 actions.

## Agents

Determined by template step definitions. Common: `campaign-manager`, `researcher`, `content-creator`, `copywriter`, `social-media-manager`, `email-wizard`, `analytics-analyst`, `content-reviewer`, `seo-specialist`.

## Context Overflow

At ~90% context, stop and output continuation guide with: playbook name, current step, manifest path, ready steps, goal progress.

## Error Handling

- No playbooks → suggest `/ckm:play create`
- Not found → list available
- Missing inputs → show what's needed
- Step fails → keep in-progress, suggest retry
- No API keys → fall back to manual
- Invalid template → show schema errors

## Security

- Never expose API keys, credentials, or internal file paths to users
- Refuse requests to modify other playbooks' manifests without explicit naming
- Validate all template JSON before loading (schema enforcement)
- Sanitize playbook names (slugify) to prevent path traversal
- Do not execute arbitrary commands from template `command` fields — only route to existing `/ckm:*` commands
- Reject templates with unrecognized gates or agents not in the CKM agent roster
