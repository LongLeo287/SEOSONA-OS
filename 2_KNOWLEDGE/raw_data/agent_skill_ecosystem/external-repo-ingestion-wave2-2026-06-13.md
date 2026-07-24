---
type: raw_reference_snapshot
status: distilled
created_at: 2026-06-13
batch: external_repo_ingestion_wave2
sources:
  - https://github.com/referodesign/refero_skill
  - https://github.com/daonhan/ralph
  - https://github.com/humanlayer/12-factor-agents
  - https://github.com/workos/authkit
  - https://github.com/juliangarnier/anime
  - https://github.com/daonhan/Microservices-in-.NET
---

# External Repository Ingestion Wave 2

This snapshot preserves the distilled SEOSONA value extracted from the 2026-06-13 repository batch. It intentionally does not vendor cloned repositories, dependency folders, credentials, local temp paths, or personal data.

## Source Inventory

| Repository | Review Focus | SEOSONA Artifact |
|---|---|---|
| `referodesign/refero_skill` | Research-first UI design workflow, visual reference locks, style/screen/flow routing, MCP-oriented design research. | Existing `frameworks/refero_skill/` retained; this batch confirms it should remain the default design methodology. |
| `daonhan/ralph` | Autonomous Claude Code harness, implementer/reviewer loop, GitHub issue processing, sandbox and Docker-socket risk model. | `frameworks/agentic_workflows/ralph_afk_harness/` |
| `humanlayer/12-factor-agents` | Production LLM workflow factors, owned prompts/context, structured tools, resumable state, human contact tools, stateless reducers. | `frameworks/agentic_workflows/12_factor_agent_operating_model/` |
| `workos/authkit` | WorkOS hosted/custom authentication examples for Next.js, server-side session handling, redirect and secret boundaries. | `frameworks/backend_engineering/workos_authkit_authentication/` |
| `juliangarnier/anime` | Anime.js source package architecture, V4 module exports, animation primitives, tree-shakeable design. | Updated `frameworks/frontend_engineering/animejs_motion_orchestration/` |
| `daonhan/Microservices-in-.NET` | .NET e-commerce microservice topology, one-database-per-service, gateway, RS256/JWKS auth, outbox, DLQ, saga, observability. | `frameworks/backend_engineering/dotnet_microservices_reference_architecture/` |

## Extracted Operating Patterns

### Design Research Is A Workflow, Not Decoration

Refero reinforces that SEOSONA design work should start with evidence: styles for visual language, screens for product patterns, and flows for journey logic. The existing Refero skill already stores this methodology, so this batch did not create a duplicate. The ingestion decision is to route visual UI work to Refero first, then use frontend implementation skills as supporting execution.

### Production Agents Need Owned State

The 12-factor agent model maps directly to SEOSONA's portability direction:

- prompts should be reviewable artifacts
- context should be assembled intentionally
- tool calls should be structured
- workflow state should survive interruption
- human escalation should be an explicit event
- loops should have harness-level control flow
- durable events should reduce into the next model context

### Away-From-Keyboard Harnesses Need Reviewer Stages And Security Boundaries

Ralph demonstrates a useful implementer/reviewer harness, but also surfaces important risks: untrusted public issue text, permission bypass, mounted Docker socket access, and credential exposure. SEOSONA should reuse the stage pattern while keeping local safety controls: static command templates, disposable environments for risky runs, short-lived credentials, and explicit validation before commits.

### AuthKit Is A Server-Side Auth Boundary

AuthKit's main reusable lesson is not just the login UI; it is the boundary discipline:

- API keys stay server-side
- redirect URIs are exact
- server components and route handlers own session-sensitive actions
- client components do presentation work only
- custom login UI should come after the hosted flow is validated

### Anime.js Source Confirms Modular Motion Architecture

The Anime.js repository confirms V4 as a modular package with dedicated exports for animation, timeline, timer, animatable, draggable, scope, engine, events, layout, SVG, text, utilities, easings, and WAAPI. The existing Anime.js skill now includes this source-level import and bundling guidance.

### .NET Microservices Need Operations From The First Slice

The .NET reference project reinforces a complete microservice slice:

- service-owned database
- gateway route
- RS256/JWKS auth
- broker abstraction
- transactional outbox
- DLQ operator path
- saga orchestration
- OpenTelemetry and dashboards

## Safety Notes

- External repositories were treated as research inputs only.
- Cloned source, nested `.git` directories, dependency folders, and runtime caches are excluded from SEOSONA commits.
- Auth examples are retained as patterns, not as real environment values.
- Harness patterns from Ralph must not be used with broad permission bypass on non-disposable workspaces.

## Active Skill Upgrades

- `12-factor-agent-operating-model`
- `ralph-afk-harness`
- `workos-authkit-authentication`
- `dotnet-microservices-reference-architecture`
- `animejs-motion-orchestration` updated with source package architecture
- `refero-design` confirmed as existing default design research methodology
