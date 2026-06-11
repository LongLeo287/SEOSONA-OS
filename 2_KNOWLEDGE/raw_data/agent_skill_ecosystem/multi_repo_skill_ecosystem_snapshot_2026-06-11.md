---
source_type: repository_batch_ingestion
domain: agent_skill_ecosystem
ingested_at: 2026-06-11
ingestion_mode: temporary_clone_deleted_after_analysis
repositories:
  - name: PleasePrompto/notebooklm-skill
    url: https://github.com/PleasePrompto/notebooklm-skill
    commit: eea5cb28ba79ab8b078a1eaa44ce9ec44f75dbf8
    commit_date: 2025-11-21 18:39:51 +0100
  - name: greensock/gsap-skills
    url: https://github.com/greensock/gsap-skills
    commit: aed9cfd3277740755f6bfc1155c7aa645403b760
    commit_date: 2026-04-21 18:47:02 -0500
  - name: Panniantong/Agent-Reach
    url: https://github.com/Panniantong/Agent-Reach
    commit: 447dc4acc4eff3a3a63ec7f5f427ff037224c509
    commit_date: 2026-06-10 20:07:56 +0800
  - name: NVIDIA/SkillSpector
    url: https://github.com/NVIDIA/SkillSpector
    commit: 1a7bf026a3cf0ecfd957b6c173244d51b3141baf
    commit_date: 2026-06-10 12:18:12 -0700
  - name: coreyhaines31/marketingskills
    url: https://github.com/coreyhaines31/marketingskills
    commit: 4b377f289bd37be457a7154626e109ec3affad50
    commit_date: 2026-06-10 13:26:58 -0700
  - name: multica-ai/multica
    url: https://github.com/multica-ai/multica
    commit: 7d719cfbbebdef59b0ff25108c5312c721d63557
    commit_date: 2026-06-10 17:46:54 +0800
  - name: addyosmani/agent-skills
    url: https://github.com/addyosmani/agent-skills
    commit: d187883b7d761265309cdcc0f202cc76b4b3fb06
    commit_date: 2026-06-10 18:39:38 -0700
  - name: nidhinjs/prompt-master
    url: https://github.com/nidhinjs/prompt-master
    commit: d15eabbe5d2122eedc060bae8a771381e9873d1b
    commit_date: 2026-06-10 21:44:43 +0530
  - name: NVIDIA/NemoClaw
    url: https://github.com/NVIDIA/NemoClaw
    commit: e67ff237549a301d974c8ab91fcab5ea9ae250f2
    commit_date: 2026-06-10 18:37:52 -0700
---

# Multi-Repository Skill Ecosystem Snapshot

This snapshot captures the distilled value from nine temporary repository clones. The clones were used only as ingestion buffers and must be deleted after analysis.

## Repository Inventory

| Repository | Observed Files | Markdown | JSON | Python | JS/TS | Skill-Named Files | Primary Value |
|---|---:|---:|---:|---:|---:|---:|---|
| `notebooklm-skill` | 21 | 7 | 0 | 10 | 0 | 1 | Source-grounded NotebookLM querying via local browser automation. |
| `gsap-skills` | 44 | 16 | 7 | 0 | 8 | 8 | Official GSAP agent skills for animation, timelines, ScrollTrigger, frameworks, and performance. |
| `Agent-Reach` | 84 | 26 | 1 | 40 | 0 | 3 | Internet reach layer for agents across search, GitHub, YouTube, Bilibili, Reddit, RSS, X, Xiaohongshu, LinkedIn, and podcasts. |
| `SkillSpector` | 149 | 34 | 1 | 97 | 0 | 24 | Security scanner for AI agent skills with static and optional semantic analysis. |
| `marketingskills` | 372 | 252 | 45 | 0 | 65 | 52 | Agent Skills marketing library for SEO, CRO, copy, ads, analytics, growth, RevOps, and GTM. |
| `multica` | 2709 | 45 | 164 | 0 | 1312 | 65 | Managed agents platform for assigning tasks, tracking agent work, and compounding skills. |
| `agent-skills` | 91 | 59 | 4 | 0 | 1 | 27 | Production-grade engineering workflow skill library. |
| `prompt-master` | 5 | 4 | 0 | 0 | 0 | 1 | Prompt compiler skill for sharper cross-tool AI prompts. |
| `NemoClaw` | 2001 | 194 | 57 | 30 | 1365 | 80 | NVIDIA reference stack for sandboxed always-on agents in OpenShell. |

## Extracted Capability Map

### Source-Grounded Knowledge

`notebooklm-skill` contributes a useful pattern: put source-heavy research into a source-grounded notebook system and query it through a controlled local browser session. SEOSONA should adapt the pattern as optional source-grounded research mode, not as a mandatory external dependency.

Key guardrail: browser automation touches authenticated Google state and must require explicit authorization before use.

### Motion and Frontend Animation

`gsap-skills` contributes focused skill boundaries:

- `gsap-core`
- `gsap-timeline`
- `gsap-scrolltrigger`
- `gsap-plugins`
- `gsap-react`
- `gsap-frameworks`
- `gsap-performance`
- `gsap-utils`

SEOSONA should use these as a reference taxonomy for advanced dashboard motion, especially scroll-triggered sections, timeline coordination, React integration, and performance limits.

### Agent Internet Reach

`Agent-Reach` contributes a channel-based pattern:

- Every platform adapter is a replaceable channel.
- The system runs doctor checks for channel availability.
- Setup levels are classified as zero-config, auto-configured, cookie, proxy, or MCP.
- Supported channels include web search, GitHub, YouTube, Bilibili, Reddit, RSS, X/Twitter, Xiaohongshu, LinkedIn, and podcasts.

SEOSONA should adopt this as a connector readiness model: every external source must expose capability, auth mode, privacy risk, and health status before being used by agents.

### Skill Security

`SkillSpector` contributes a skill security model:

- Multi-format input: Git repos, URLs, zip files, directories, and single files.
- Pattern categories include prompt injection, data exfiltration, privilege escalation, supply chain, excessive agency, output handling, system prompt leakage, memory poisoning, tool misuse, rogue agents, trigger abuse, dangerous code, taint tracking, YARA signatures, MCP least privilege, and MCP tool poisoning.
- Output formats include terminal, JSON, Markdown, and SARIF.
- Risk scoring should be a first-class gate before installing external skills.

SEOSONA should treat external skill ingestion as untrusted until scanned and manually distilled.

### Marketing Skill Taxonomy

`marketingskills` confirms and expands SEOSONA marketing taxonomy. Important observed categories:

- Foundation: `product-marketing`
- SEO/content: `seo-audit`, `ai-seo`, `programmatic-seo`, `site-architecture`, `schema`, `content-strategy`, `video`, `aso`
- CRO: `cro`, `signup`, `onboarding`, `popups`, `paywalls`
- Copy/content: `copywriting`, `copy-editing`, `cold-email`, `emails`, `social`, `sms`, `image`
- Paid/measurement: `ads`, `ad-creative`, `ab-testing`, `analytics`
- Growth/retention: `referrals`, `free-tools`, `community-marketing`, `co-marketing`, `churn-prevention`, `lead-magnets`
- Sales/GTM: `revops`, `sales-enablement`, `launch`, `pricing`, `competitors`, `competitor-profiling`, `prospecting`, `directory-submissions`, `public-relations`
- Strategy/research: `marketing-ideas`, `marketing-plan`, `marketing-psychology`, `customer-research`

SEOSONA already covers many of these. The strongest upgrade is not duplication; it is routing discipline: always anchor downstream marketing tasks in product, audience, positioning, and proof.

### Managed Agent Operations

`multica` contributes managed-agent operations:

- Assign issues/tasks to agents like teammates.
- Agents report blockers and status.
- Squads provide routing from a group lead to members.
- Self-hosting uses Docker Compose or Kubernetes/Helm.
- A local daemon detects installed AI CLIs and executes work.
- Server-side primitives include projects, tasks, skills, runtime usage, task tokens, webhooks, GitHub, notifications, and usage rollups.

SEOSONA should borrow the operational model: task board + agent status + blocker reporting + skill compounding. Do not import the platform wholesale.

### Engineering Workflow Skills

`agent-skills` contributes a lifecycle taxonomy:

- `idea-refine`
- `spec-driven-development`
- `planning-and-task-breakdown`
- `incremental-implementation`
- `test-driven-development`
- `code-review-and-quality`
- `code-simplification`
- `security-and-hardening`
- `performance-optimization`
- `observability-and-instrumentation`
- `shipping-and-launch`
- `debugging-and-error-recovery`
- `api-and-interface-design`
- `frontend-ui-engineering`
- `browser-testing-with-devtools`
- `git-workflow-and-versioning`
- `documentation-and-adrs`
- `deprecation-and-migration`
- `context-engineering`
- `source-driven-development`
- `doubt-driven-development`

SEOSONA already has many adjacent skills. The useful pattern is phase-aware activation: Define -> Plan -> Build -> Verify -> Review -> Ship.

### Prompt Compilation

`prompt-master` contributes a compact prompt-quality pattern:

- Write prompts where each word is load-bearing.
- Optimize for the target AI tool, modality, and output format.
- Preserve context and avoid iterative waste.

SEOSONA should use this as a prompt compiler pattern for cross-tool work, especially when handing off to image, video, automation, or coding agents.

### Sandboxed Agent Runtime

`NemoClaw` contributes sandboxed always-on agent runtime lessons:

- Run agents inside OpenShell sandboxes.
- Provide onboarding, hardened blueprint, routed inference, network policy, and lifecycle management through one CLI.
- Support OpenClaw and Hermes.
- Prioritize sandbox hardening, credential handling, network-policy defaults, and provider routing.
- Treat retrieved external materials as separately governed by their own terms and risks.

SEOSONA should map this to agent safety policy, not automatic deployment.

## SEOSONA Adoption Decisions

1. Keep only distilled knowledge and native SEOSONA artifacts.
2. Do not vendor raw repositories or copy external skill libraries wholesale.
3. Add an external skill assimilation workflow that enforces temporary clone cleanup.
4. Add skill-security gating before any external skill installation.
5. Use GSAP taxonomy as the motion reference for dashboard UI work.
6. Use marketing skill taxonomy for routing gaps and product-marketing-first discipline.
7. Use managed-agent platform patterns for future SEOSONA task board and agent status workflows.
8. Use sandboxed-agent runtime patterns for future agent execution hardening.

## Cleanup Rule

No cloned upstream repository may remain under `3_MEMORY/ingestion_zone/` or `5_RESEARCH/repositories/` after UAP completes.

TASK COMPLETED
