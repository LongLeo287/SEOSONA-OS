# SEOSONA OS — Agent Capabilities Matrix

_Maps every agent to their primary skills, workflows, and slash commands._
_Updated: 2026-06-17 (Wave 5B)_

---

## Marketing & Growth Agents

| Agent | Primary Skills | Workflows | Slash Commands |
|---|---|---|---|
| `seo-specialist` | `claude_seo_framework`, `seo_keyword_research`, `seo_backlink_intel`, `seo_rank_tracker`, `seo_serp_competitor`, `aeo_search_optimizer`, `google_trends_analyzer` | `seo-workflow`, `seosona-grand-audit` | `/seo`, `/seo-audit`, `/seo-keywords` |
| `seo-content-master` | `seo_content_research`, `seo_featured_snippet`, `ai_writing_formulas`, `content_hub` | `seo-workflow`, `content-workflow` | `/seo`, `/write-blog` |
| `seo-topical-map-architect` | `seo_keyword_research`, `competitor_intelligence` | `seo-to-code-autonomous-pipeline` | `/seo-keywords` |
| `campaign-manager` | `campaign`, `ads_management`, `paid_ads` | `campaign-workflow`, `marketing_campaign_workflow` | `/campaign`, `/campaign-create` |
| `campaign-debugger` | `campaign`, `analytics` | `campaign-workflow` | `/campaign-analyze`, `/campaign-status` |
| `copywriter` | `copywriting`, `ai_writing_formulas`, `content_marketing`, `ai_content_humanizer` | `content-workflow` | `/write-*`, `/humanize` |
| `email-wizard` | `email_marketing` | `campaign-workflow` | `/email`, `/email-flow`, `/email-sequence` |
| `social-media-manager` | `social_media`, `social_content_distribution`, `social_auto_upload_orchestration`, `zalo_oa_integration` | `marketing_campaign_workflow` | `/social`, `/social-schedule`, `/zalo-publish` |
| `funnel-architect` | `funnel`, `cro`, `form-cro`, `landing_page_generator` | `sales-workflow` | `/funnel`, `/plan-cro` |
| `lead-qualifier` | `persona`, `marketing_psychology` | `sales-workflow` | — |
| `sale-enabler` | `pricing_strategy`, `referral_gamification` | `sales-workflow` | — |
| `upsell-maximizer` | `pricing_strategy`, `onboarding_cro` | `sales-workflow` | — |
| `attraction-specialist` | `marketing_planning`, `marketing_research`, `marketing_ideas` | `marketing-workflow` | `/brand-update` |
| `community-manager` | `social_media`, `linkedin_authority_builder` | `marketing_campaign_workflow` | `/social` |

## Engineering & Tech Agents

| Agent | Primary Skills | Workflows | Slash Commands |
|---|---|---|---|
| `fullstack-developer` | `backend-development`, `frontend-development`, `effect_ts_patterns` | `primary-workflow`, `seo-to-code-autonomous-pipeline` | `/plan`, `/plan-hard` |
| `code-reviewer` | `code-review-and-quality`, `code-simplification`, Addy Osmani suite | `auto-code-auditor-refactor` | — |
| `debugger` | `debugging-and-error-recovery`, `fix/workflow-*` | `auto-bug-hunter-recovery` | — |
| `tester` | `playwright`, `test-driven-development`, `browser-testing-with-devtools` | `auto-bug-hunter-recovery` | `/test-workflow`, `/test-ui` |
| `git-manager` | `git-workflow-and-versioning`, `git/workflow-*` | `primary-workflow` | `/worktree` |
| `database-admin` | `database_explorer` | — | — |
| `nextjs-autofix-bot` | `frontend-development` | `primary-workflow` | — |
| `mcp-manager` | `mcp-management`, `mcp-builder`, `mcp_server` | — | `/use-mcp` |

## Content & Creation Agents

| Agent | Primary Skills | Workflows | Slash Commands |
|---|---|---|---|
| `content-strategist` | `content_marketing`, `content_hub`, `seo_content_research` | `content-workflow` | `/write-blog` |
| `content-creator` | `content_creator`, `ai_writing_formulas`, `video_content` | `content-workflow` | `/write-*`, `/video-*` |
| `content-reviewer` | `content_review_sop`, `ai_content_humanizer` | `qa_review_workflow` | `/write-audit` |
| `journal-writer` | `journal` | — | `/journal` |
| `docs-manager` | `docs`, `document-skills`, `documentation-and-adrs` | `documentation-management` | `/docs-*` |

## Research & Strategy Agents

| Agent | Primary Skills | Workflows | Slash Commands |
|---|---|---|---|
| `analytics-analyst` | `analytics`, `ga4_ai_assistant`, `marketing_analytics`, `visual_data_explorer` | `analytics-workflow`, `monthly_retainer_workflow` | `/dashboard`, `/report-monthly` |
| `researcher` | `marketing-research`, `autoresearch` | — | `/analyze` |
| `planner` | `plan`, `planning-and-task-breakdown`, `sequential-thinking` | `primary-workflow` | `/plan`, `/plan-parallel` |
| `project-manager` | `kanban`, `plans-kanban` | `sprint_planning_workflow`, `vague-to-spec-pipeline` | `/kanban` |
| `scout` | `scout` | — | — |
| `scout-external` | `scout`, `competitive_intelligence` | — | `/competitor` |
| `ui-ux-designer` | `ui-ux-pro-max`, `design-system`, `frontend-design` | `vague-to-spec-pipeline` | — |
| `continuity-specialist` | `symbolic-memory-layering`, `tactical_memory_flow` | — | — |

## Operations & Automation Agents (Wave 4)

| Agent | Primary Skills | Workflows | Slash Commands |
|---|---|---|---|
| `data-engineer` | `database_explorer`, `visual_data_explorer`, `pygwalker` | — | — |
| `security-auditor` | `security-and-hardening`, `security_scanning`, `incident_response_sop` | `qa_review_workflow` | `/incident` |
| `automation-engineer` | `zero_code_automator`, `n8n-automation`, hooks | — | — |
| `performance-optimizer` | `core_web_vitals_optimizer`, `performance-optimization` | — | `/perf-check` |

## Client & Business Agents (Wave 4)

| Agent | Primary Skills | Workflows | Slash Commands |
|---|---|---|---|
| `client-success-manager` | `client_onboarding_automation`, `proposal_tracker` | `client_lifecycle_workflow`, `monthly_retainer_workflow` | `/onboard-client` |
| `proposal-writer` | `proposal_generator`, `seosona-service-catalog` | `client_lifecycle_workflow` | `/proposal-create` |
| `ai-trainer` | `ai_content_humanizer`, skill templates | — | — |
| `seosona-consultant` | `seosona-cbo-methodology`, `seosona-brand-voice-guidelines` | — | — |

## Media & Intelligence Agents (Wave 5)

| Agent | Primary Skills | Workflows | Slash Commands |
|---|---|---|---|
| `browser-automator` | `puppeteer`, `playwright`, `browser-testing-with-devtools`, `core_web_vitals_optimizer` | `auto-bug-hunter-recovery` | `/test-ui` |
| `data-scraper` | `smart_scraper`, `web_crawler_katana`, `firecrawl`, `crawlee` | — | — |
| `osint-investigator` | `flowsint`, `eeat_analyzer`, `brand_context_analyzer`, `maigret-osint` | `seosona-grand-audit` | — |
