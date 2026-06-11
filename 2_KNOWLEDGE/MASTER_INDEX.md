# SEOSONA OS — Master Knowledge Index v7.0
# Complete map of all Skills, Frameworks, Agents, Workflows, and Data

_Updated: 2026-06-11 | Version: 7.1 (Agent Looping and Thinking Model Assimilation)_

---

## 📊 System Overview

| Category | Count | Location |
|---|---|---|
| **Agent Personas** | 35 + 1 orchestrator | `4_AGENTS/personas/` + `1_CORE/agents/` |
| **SEO/Marketing Skills** | 56 | `2_KNOWLEDGE/frameworks/seo_marketing/` |
| **Frontend Engineering Skills** | 13 | `2_KNOWLEDGE/frameworks/frontend_engineering/` |
| **Backend Engineering Skills** | 13 | `2_KNOWLEDGE/frameworks/backend_engineering/` |
| **Multimedia Production Skills** | 15 | `2_KNOWLEDGE/frameworks/multimedia_production/` |
| **Agentic Workflow Skills** | 19 | `2_KNOWLEDGE/frameworks/agentic_workflows/` |
| **Productivity Skills** | 19 | `2_KNOWLEDGE/frameworks/productivity/` |
| **Workflows / SOPs** | 90 | `2_KNOWLEDGE/workflows/` |
| **System SOPs** | 7 | `2_KNOWLEDGE/sops/` |
| **Automation Hooks** | 8 | `1_CORE/hooks/` |
| **Data Connectors (Python)** | 11 | `scripts/connectors/` |
| **Raw Reference Library** | 120+ files | `2_KNOWLEDGE/raw_data/` (see INDEX.md) |
| **TOTAL CAPABILITIES** | **494** | |

---

## 🏗️ Directory Structure

```text
${SEOSONA_ROOT}
├── 1_CONFIG/          → System configuration & legacy settings
│   ├── ide_profiles/      (Universal IDE settings: .ck.json, settings.json)
│   └── schemas/           (JSON schemas for validation)
├── 1_CORE/            → Soul, Orchestrator Agent, Core Rules & Workflows
││   ├── hooks/             (Automation hooks)
│   └── setup_ide.ps1      (Script to build IDE environments)
├── 2_KNOWLEDGE/       → Full knowledge base
│   ├── MASTER_INDEX.md    (this file)
│   ├── SKILLS_ROUTER.md   (semantic routing map)
│   ├── frameworks/        (structured skill libraries)
│   ├── workflows/         (SOP & workflow scripts)
│   ├── raw_data/          (117 raw reference files + INDEX.md)
│   ├── commands/          (slash commands e.g. /ckm)
│   ├── output_styles/     (AI output level templates)
│   └── sops/              (system-level SOPs)
├── 3_MEMORY/          → Runtime memory, exports, specs, logs
├── 4_AGENTS/          → Agent roster & personas
│   ├── ROSTER.md          (authoritative agent registry)
│   └── personas/          (93 specialist persona files)
├── 5_RESEARCH/        → Dedicated storage for Github/external repository links
└── scripts/           → Python connectors & orchestrator scripts
```

---

## 🤖 TIER 1 — Core Agents

| Agent | File | Role |
|---|---|---|
| **Orchestrator** | `1_CORE/agents/orchestrator_agent.md` | Routes requests, selects skills & personas |

→ See full roster at [4_AGENTS/ROSTER.md](../4_AGENTS/ROSTER.md)

---

## 🎯 SKILLS — SEO & Marketing (56 skills)

| Skill | Path |
|---|---|
| SEO Core | `frameworks/seo_marketing/seo/` |
| Keyword Research | `frameworks/seo_marketing/seo_keyword_research/` |
| Content Research | `frameworks/seo_marketing/seo_content_research/` |
| Rank Tracker | `frameworks/seo_marketing/seo_rank_tracker/` |
| SERP Competitor | `frameworks/seo_marketing/seo_serp_competitor/` |
| Backlink Intel | `frameworks/seo_marketing/seo_backlink_intel/` |
| Local SEO | `frameworks/seo_marketing/seo_local/` |
| GSC Integration | `frameworks/seo_marketing/seo_gsc_integration/` |
| Featured Snippet | `frameworks/seo_marketing/seo_featured_snippet/` |
| Algorithm Decoder | `frameworks/seo_marketing/seo_algorithm_decoder/` |
| AEO Best Practices | `frameworks/seo_marketing/seo_aeo_best_practices/` |
| SEO Sheets Export | `frameworks/seo_marketing/seo_sheets_export/` |
| Copywriting | `frameworks/seo_marketing/copywriting/` |
| Marketing Psychology | `frameworks/seo_marketing/marketing_psychology/` |
| Funnel Design | `frameworks/seo_marketing/funnel/` |
| CRO | `frameworks/seo_marketing/cro/` |
| Onboarding CRO | `frameworks/seo_marketing/onboarding_cro/` |
| Email Marketing | `frameworks/seo_marketing/email_marketing/` |
| Brand Identity | `frameworks/seo_marketing/brand_identity/` |
| Persona | `frameworks/seo_marketing/persona/` |
| Paid Ads | `frameworks/seo_marketing/paid_ads/` |
| Launch Strategy | `frameworks/seo_marketing/launch_strategy/` |
| Pricing Strategy | `frameworks/seo_marketing/pricing_strategy/` |
| Campaign | `frameworks/seo_marketing/campaign/` |
| Content Marketing | `frameworks/seo_marketing/content_marketing/` |
| Content Creator | `frameworks/seo_marketing/content_creator/` |
| Marketing Analytics | `frameworks/seo_marketing/marketing_analytics/` |
| Marketing Ideas | `frameworks/seo_marketing/marketing_ideas/` |
| Marketing Planning | `frameworks/seo_marketing/marketing_planning/` |
| Marketing Dashboard | `frameworks/seo_marketing/marketing_dashboard/` |
| Marketing Research | `frameworks/seo_marketing/marketing_research/` |
| Social Media | `frameworks/seo_marketing/social_media/` |
| Social Distribution | `frameworks/seo_marketing/social_content_distribution/` |
| Video Content | `frameworks/seo_marketing/video_content/` |
| AI Writing Formulas | `frameworks/seo_marketing/ai_writing_formulas/` |
| Landing Page Gen | `frameworks/seo_marketing/landing_page_generator/` |
| Competitor Intel | `frameworks/seo_marketing/competitor_intelligence/` |
| Affiliate Marketing | `frameworks/seo_marketing/affiliate_marketing/` |
| Free Tool Strategy | `frameworks/seo_marketing/free_tool_strategy/` |
| Referral Gamification | `frameworks/seo_marketing/referral_gamification/` |
| LinkedIn Authority | `frameworks/seo_marketing/linkedin_authority_builder/` |
| AB Testing | `frameworks/seo_marketing/ab_testing/` |
| Ads Management | `frameworks/seo_marketing/ads_management/` |
| Content Hub | `frameworks/seo_marketing/content_hub/` |
| SEO Migration | `frameworks/seo_marketing/seo_migration_assistant/` |
| Claude SEO Framework | `frameworks/seo_marketing/claude_seo_framework/` |
| SEO Workspace | `frameworks/seo_marketing/seo_workspace/` |
| AB Test Setup ⭐ | `frameworks/seo_marketing/ab-test-setup/` |
| Analytics ⭐ | `frameworks/seo_marketing/analytics/` |
| Brand ⭐ | `frameworks/seo_marketing/brand/` |
| Competitor ⭐ | `frameworks/seo_marketing/competitor/` |
| Email ⭐ | `frameworks/seo_marketing/email/` |
| Form CRO ⭐ | `frameworks/seo_marketing/form-cro/` |
| Gamification Marketing ⭐ | `frameworks/seo_marketing/gamification-marketing/` |
| Referral Program ⭐ | `frameworks/seo_marketing/referral-program-building/` |
| Social ⭐ | `frameworks/seo_marketing/social/` |

---

## 💻 SKILLS — Frontend Engineering (13 skills)

| Skill | Path |
|---|---|
| UI Styling | `frameworks/frontend_engineering/ui-styling/` |
| UI/UX Pro Max | `frameworks/frontend_engineering/ui-ux-pro-max/` |
| Design System | `frameworks/frontend_engineering/design-system/` |
| Web Frameworks | `frameworks/frontend_engineering/web-frameworks/` |
| Frontend Development | `frameworks/frontend_engineering/frontend-development/` |
| Three.js | `frameworks/frontend_engineering/threejs/` |
| Shader | `frameworks/frontend_engineering/shader/` |
| Chrome DevTools | `frameworks/frontend_engineering/chrome-devtools/` |
| Design | `frameworks/frontend_engineering/design/` |
| Frontend Design | `frameworks/frontend_engineering/frontend-design/` |
| MermaidJS | `frameworks/frontend_engineering/mermaidjs-v11/` |
| Markdown Novel Viewer | `frameworks/frontend_engineering/markdown-novel-viewer/` |
| Web Design Guidelines | `frameworks/frontend_engineering/web-design-guidelines/` |

---

## ⚙️ SKILLS — Backend Engineering (13 skills)

| Skill | Path |
|---|---|
| Backend Development | `frameworks/backend_engineering/backend-development/` |
| Databases | `frameworks/backend_engineering/databases/` |
| DevOps | `frameworks/backend_engineering/devops/` |
| Shopify | `frameworks/backend_engineering/shopify/` |
| Payment Integration | `frameworks/backend_engineering/payment-integration/` |
| Better Auth | `frameworks/backend_engineering/better-auth/` |
| Storage | `frameworks/backend_engineering/storage/` |
| CKM Storage | `frameworks/backend_engineering/ckm-storage/` |
| Git | `frameworks/backend_engineering/git/` |
| Debugging | `frameworks/backend_engineering/debugging/` |
| Testing | `frameworks/backend_engineering/test/` |
| Fix | `frameworks/backend_engineering/fix/` |
| Worktree | `frameworks/backend_engineering/worktree/` |

---

## 🎬 SKILLS — Multimedia Production (15 skills)

| Skill | Path |
|---|---|
| YouTube | `frameworks/multimedia_production/youtube/` |
| YouTube Thumbnail Design | `frameworks/multimedia_production/youtube-thumbnail-design/` |
| ElevenLabs | `frameworks/multimedia_production/elevenlabs/` |
| Remotion | `frameworks/multimedia_production/remotion/` |
| AI Artist | `frameworks/multimedia_production/ai-artist/` |
| AI Multimodal | `frameworks/multimedia_production/ai-multimodal/` |
| Banner Design | `frameworks/multimedia_production/banner-design/` |
| Logo Design | `frameworks/multimedia_production/logo-design/` |
| Slides | `frameworks/multimedia_production/slides/` |
| Media Processing | `frameworks/multimedia_production/media-processing/` |
| CIP Design | `frameworks/multimedia_production/cip-design/` |
| Assets Organizing | `frameworks/multimedia_production/assets-organizing/` |
| Creativity | `frameworks/multimedia_production/creativity/` |
| Video ⭐ | `frameworks/multimedia_production/video/` |
| Video Audio Ingestion | `frameworks/multimedia_production/video_audio_ingestion/` |

---

## 🧠 SKILLS — Agentic Workflows (19 skills)

| Skill | Path |
|---|---|
| Claude Code | `frameworks/agentic_workflows/claude-code/` |
| Context Engineering | `frameworks/agentic_workflows/context-engineering/` |
| MCP Builder | `frameworks/agentic_workflows/mcp-builder/` |
| MCP Management | `frameworks/agentic_workflows/mcp-management/` |
| Skill Creator | `frameworks/agentic_workflows/skill-creator/` |
| Cost-Bounded Agent Looping | `frameworks/agentic_workflows/cost_bounded_agent_looping/` |
| Portable Capability Bridge | `frameworks/agentic_workflows/seosona_portable_capability_bridge/` |
| Kit Builder | `frameworks/agentic_workflows/kit-builder/` |
| Repomix | `frameworks/agentic_workflows/repomix/` |
| Hub | `frameworks/agentic_workflows/hub/` |
| Scout | `frameworks/agentic_workflows/scout/` |
| Play | `frameworks/agentic_workflows/play/` |
| Preview | `frameworks/agentic_workflows/preview/` |
| Init | `frameworks/agentic_workflows/init/` |
| Use MCP | `frameworks/agentic_workflows/use-mcp/` |
| Template Skill | `frameworks/agentic_workflows/template-skill/` |
| Legacy Engine | `frameworks/agentic_workflows/legacy_engine/` |

---

## 📈 SKILLS — Productivity (19 skills)

| Skill | Path |
|---|---|
| Sequential Thinking | `frameworks/productivity/sequential-thinking/` |
| Problem Solving | `frameworks/productivity/problem-solving/` |
| Thinking Model Router | `frameworks/productivity/thinking_model_router/` |
| Brainstorm | `frameworks/productivity/brainstorm/` |
| Plan | `frameworks/productivity/plan/` |
| Kanban | `frameworks/productivity/kanban/` |
| Plans Kanban | `frameworks/productivity/plans-kanban/` |
| Analyze | `frameworks/productivity/analyze/` |
| Ask | `frameworks/productivity/ask/` |
| Dashboard | `frameworks/productivity/dashboard/` |
| Docs | `frameworks/productivity/docs/` |
| Docs Seeker | `frameworks/productivity/docs-seeker/` |
| Journal | `frameworks/productivity/journal/` |
| Write | `frameworks/productivity/write/` |
| Cook | `frameworks/productivity/cook/` |
| Watzup | `frameworks/productivity/watzup/` |
| Code Review | `frameworks/productivity/code-review/` |
| Common ⭐ | `frameworks/productivity/common/` |
| Document Skills ⭐ | `frameworks/productivity/document-skills/` |

---

## 🔄 WORKFLOWS & SOPs (88 + 6)

**Key Workflows:**
- `Grand Audit` → `workflows/seosona-grand-audit.md` — Holistic 3-Phase Agency Audit
- `SEO Workflow` → `workflows/seo-workflow.md`
- `Content Workflow` → `workflows/content-workflow.md`
- `Marketing Workflow` → `workflows/marketing-workflow.md`
- `Campaign Creation` → `workflows/ckm-campaign-create.md`
- `Video Creation` → `workflows/ckm-video-create.md`
- `Video Script` → `workflows/ckm-video-script-create.md`
- `Blog Writing` → `workflows/ckm-write-blog.md`
- `SEO Audit` → `workflows/ckm-seo-audit.md`

**System SOPs** (in `sops/`):
- `artifact_planning_mode.md`
- `claude_seo_audit_sop.md`
- `context_cleaning_optimization.md`
- `lightrag_graph_mapping.md`
- `mempalace_sop.md`
- `seosona_blackboard_protocol.md`
- `universal_tool_integration_sop.md`

---

## 🪝 AUTOMATION HOOKS (8 — `1_CORE/hooks/`)

> ⭐ _NEW: Ingested from ClaudeKit Marketing (2026-06-10)_

| Hook | Trigger | Purpose |
|---|---|---|
| `session-init.cjs` | SessionStart | Initialize session state & context |
| `subagent-init.cjs` | SubagentStart | Initialize subagent environment |
| `dev-rules-reminder.cjs` | UserPromptSubmit | Remind development rules |
| `usage-context-awareness.cjs` | UserPromptSubmit | Context-aware usage hints |
| `descriptive-name.cjs` | PreToolUse (Write) | Enforce descriptive file names |
| `scout-block.cjs` | PreToolUse (File ops) | Block scout from modifying files |
| `privacy-block.cjs` | PreToolUse (File ops) | Block access to sensitive files |
| `post-edit-simplify-reminder.cjs` | PostToolUse | Simplify reminder after edits |

**Supporting Libraries** (`1_CORE/hooks/lib/`):
- `ck-config-utils.cjs` — Config utilities
- `colors.cjs` — Terminal color output
- `config-counter.cjs` — Config counting
- `context-builder.cjs` — Dynamic context builder
- `privacy-checker.cjs` — Privacy checking logic
- `project-detector.cjs` — Project type detection
- `scout-checker.cjs` — Scout pattern matching
- `transcript-parser.cjs` — Transcript parsing

**Notifications** (`1_CORE/hooks/notifications/`):
- Discord, Slack, Telegram providers

---

## ⚡ DATA CONNECTORS (Python — `scripts/connectors/`)

| Connector | Data Source |
|---|---|
| `psi_connector` | PageSpeed Insights + Core Web Vitals |
| `keyword_connector` | Google Autocomplete |
| `serp_competitor` | SERP competitive analysis |
| `backlink_connector` | Open PageRank + CommonCrawl |
| `gsc_connector` | Google Search Console |
| `rank_tracker` | Position tracking |
| `ga4_connector` | Google Analytics 4 |
| `technical_seo_scanner` | Robots, sitemap, on-page |
| `schema_validator` | JSON-LD / Microdata |
| `eeat_analyzer` | E-E-A-T + Content quality |
| `log_analyzer` | Bot crawl pattern analysis |

---

## 📥 INGESTED DATA (External References)

| Name | Source | Type | Path |
|---|---|---|---|
| **ReWrite AI Desktop** | [hynady/ReWrite](https://github.com/hynady/ReWrite) | AI Productivity Tool (Windows) | `frameworks/ingested_data/rewrite_ai_desktop/` |
| **Folo (AI RSS Reader)** | [RSSNext/Folo](https://github.com/RSSNext/Folo) | AI Content Aggregation (Cross-Platform) | `frameworks/ingested_data/folo_rss_reader/` |
| **Context7 MCP Platform** | [upstash/context7](https://github.com/upstash/context7) | MCP Server / AI Code Docs | `frameworks/ingested_data/context7_mcp/` |
| **Marketing Content Pipeline** | [pennydinh/marketing-pineline-share](https://github.com/pennydinh/marketing-pineline-share) | AI Content Automation (Next.js + Remotion) | `frameworks/ingested_data/marketing_content_pipeline/` |
| **ClaudeKit Marketing** | Local external source snapshot + [claudekit/claudekit-marketing](https://github.com/claudekit/claudekit-marketing) | AI Marketing Toolkit (31 agents, 101 skills, 14 hooks) | `frameworks/ingested_data/claudekit_marketing/` |

