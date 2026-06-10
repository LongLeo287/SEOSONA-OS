# Semantic Capabilities Graph (SKILLS_ROUTER)

This is the SEOSONA OS canonical routing table. The AI uses this file to map user intent to skill directories.

> **Routing Prefix Legend:**
> - `seosona:` — Native SEOSONA OS skills (primary, always preferred)
> - `ck:` / `ckm:` — Ingested ClaudeKit-compatible skills (legacy, still functional)
> - Plain name — Auto-discovered skill (no prefix required, match by name)

## Agentic Workflows
- `ckm:claude code`, `ckm:claude-code` -> `frameworks/agentic_workflows/claude-code/`
- `ck:context engineering`, `ck:context-engineering` -> `frameworks/agentic_workflows/context-engineering/`
- `ckm:hub` -> `frameworks/agentic_workflows/hub/`
- `ckm:init` -> `frameworks/agentic_workflows/init/`
- `ckm:kit builder`, `ckm:kit-builder` -> `frameworks/agentic_workflows/kit-builder/`
- `ck:mcp builder`, `ck:mcp-builder` -> `frameworks/agentic_workflows/mcp-builder/`
- `ck:mcp management`, `ck:mcp-management` -> `frameworks/agentic_workflows/mcp-management/`
- `ckm:play` -> `frameworks/agentic_workflows/play/`
- `ck:preview` -> `frameworks/agentic_workflows/preview/`
- `ck:repomix` -> `frameworks/agentic_workflows/repomix/`
- `ck:scout` -> `frameworks/agentic_workflows/scout/`
- `ck:skill creator`, `ck:skill-creator` -> `frameworks/agentic_workflows/skill-creator/`
- `ck:template skill`, `ck:template-skill` -> `frameworks/agentic_workflows/template-skill/`
- `ck:use mcp`, `ck:use-mcp` -> `frameworks/agentic_workflows/use-mcp/`

## Backend Engineering
- `ck:backend development`, `ck:backend-development` -> `frameworks/backend_engineering/backend-development/`
- `ck:better auth`, `ck:better-auth` -> `frameworks/backend_engineering/better-auth/`
- `ckm:storage` -> `frameworks/backend_engineering/ckm-storage/`
- `ck:databases` -> `frameworks/backend_engineering/databases/`
- `ckm:debugging` -> `frameworks/backend_engineering/debugging/`
- `ck:devops` -> `frameworks/backend_engineering/devops/`
- `ck:fix` -> `frameworks/backend_engineering/fix/`
- `ck:git` -> `frameworks/backend_engineering/git/`
- `ck:google adk python`, `ck:google-adk-python` -> `frameworks/backend_engineering/google-adk-python/`
- `ck:payment integration`, `ck:payment-integration` -> `frameworks/backend_engineering/payment-integration/`
- `ck:shopify` -> `frameworks/backend_engineering/shopify/`
- `ckm:storage` -> `frameworks/backend_engineering/storage/`
- `ck:test` -> `frameworks/backend_engineering/test/`
- `ck:worktree` -> `frameworks/backend_engineering/worktree/`

## Core System
- `agent_skills` -> `frameworks/core_system/agent_skills/`
- `Vincent   Brave Search for agents`, `Vincent - Brave Search for agents` -> `frameworks/core_system/agent_skills/brave_search/`
- `Vincent   Credentials for agents`, `Vincent - Credentials for agents` -> `frameworks/core_system/agent_skills/credentials/`
- `Vincent   HyperLiquid for agents`, `Vincent - HyperLiquid for agents` -> `frameworks/core_system/agent_skills/hyperliquid/`
- `lark approval`, `lark-approval` -> `frameworks/core_system/agent_skills/larksuite_cli/lark-approval/`
- `lark apps`, `lark-apps` -> `frameworks/core_system/agent_skills/larksuite_cli/lark-apps/`
- `lark attendance`, `lark-attendance` -> `frameworks/core_system/agent_skills/larksuite_cli/lark-attendance/`
- `lark base`, `lark-base` -> `frameworks/core_system/agent_skills/larksuite_cli/lark-base/`
- `lark calendar`, `lark-calendar` -> `frameworks/core_system/agent_skills/larksuite_cli/lark-calendar/`
- `lark contact`, `lark-contact` -> `frameworks/core_system/agent_skills/larksuite_cli/lark-contact/`
- `lark doc`, `lark-doc` -> `frameworks/core_system/agent_skills/larksuite_cli/lark-doc/`
- `lark drive`, `lark-drive` -> `frameworks/core_system/agent_skills/larksuite_cli/lark-drive/`
- `lark event`, `lark-event` -> `frameworks/core_system/agent_skills/larksuite_cli/lark-event/`
- `lark im`, `lark-im` -> `frameworks/core_system/agent_skills/larksuite_cli/lark-im/`
- `lark mail`, `lark-mail` -> `frameworks/core_system/agent_skills/larksuite_cli/lark-mail/`
- `lark markdown`, `lark-markdown` -> `frameworks/core_system/agent_skills/larksuite_cli/lark-markdown/`
- `lark minutes`, `lark-minutes` -> `frameworks/core_system/agent_skills/larksuite_cli/lark-minutes/`
- `lark okr`, `lark-okr` -> `frameworks/core_system/agent_skills/larksuite_cli/lark-okr/`
- `lark openapi explorer`, `lark-openapi-explorer` -> `frameworks/core_system/agent_skills/larksuite_cli/lark-openapi-explorer/`
- `lark shared`, `lark-shared` -> `frameworks/core_system/agent_skills/larksuite_cli/lark-shared/`
- `lark sheets`, `lark-sheets` -> `frameworks/core_system/agent_skills/larksuite_cli/lark-sheets/`
- `lark skill maker`, `lark-skill-maker` -> `frameworks/core_system/agent_skills/larksuite_cli/lark-skill-maker/`
- `lark slides`, `lark-slides` -> `frameworks/core_system/agent_skills/larksuite_cli/lark-slides/`
- `lark task`, `lark-task` -> `frameworks/core_system/agent_skills/larksuite_cli/lark-task/`
- `lark vc`, `lark-vc` -> `frameworks/core_system/agent_skills/larksuite_cli/lark-vc/`
- `lark vc agent`, `lark-vc-agent` -> `frameworks/core_system/agent_skills/larksuite_cli/lark-vc-agent/`
- `lark whiteboard`, `lark-whiteboard` -> `frameworks/core_system/agent_skills/larksuite_cli/lark-whiteboard/`
- `lark wiki`, `lark-wiki` -> `frameworks/core_system/agent_skills/larksuite_cli/lark-wiki/`
- `lark workflow meeting summary`, `lark-workflow-meeting-summary` -> `frameworks/core_system/agent_skills/larksuite_cli/lark-workflow-meeting-summary/`
- `lark workflow standup report`, `lark-workflow-standup-report` -> `frameworks/core_system/agent_skills/larksuite_cli/lark-workflow-standup-report/`
- `markitdown_parser` -> `frameworks/core_system/agent_skills/markitdown_parser/`
- `Vincent   Polymarket for agents`, `Vincent - Polymarket for agents` -> `frameworks/core_system/agent_skills/polymarket/`
- `apify actorization`, `apify-actorization` -> `frameworks/core_system/agent_skills/skills/apify_actorization/`
- `apify actor development`, `apify-actor-development` -> `frameworks/core_system/agent_skills/skills/apify_actor_development/`
- `apify generate output schema`, `apify-generate-output-schema` -> `frameworks/core_system/agent_skills/skills/apify_generate_output_schema/`
- `apify ultimate scraper`, `apify-ultimate-scraper` -> `frameworks/core_system/agent_skills/skills/apify_ultimate_scraper/`
- `clickhouse best practices`, `clickhouse-best-practices` -> `frameworks/core_system/agent_skills/skills/clickhouse_best_practices/`
- `logging best practices`, `logging-best-practices` -> `frameworks/core_system/agent_skills/skills/logging_best_practices/`
- `Vincent   Twitter / X.com for agents`, `Vincent - Twitter / X.com for agents` -> `frameworks/core_system/agent_skills/twitter/`
- `Vincent   A wallet for agents`, `Vincent - A wallet for agents` -> `frameworks/core_system/agent_skills/wallet/`
- `aris_research_loop` -> `frameworks/core_system/aris_research_loop/`
- `crawlee` -> `frameworks/core_system/crawlee/`
- `custom dev suite`, `custom-dev-suite` -> `frameworks/core_system/custom-dev-suite/`
- `Firecrawl Mcp Server` -> `frameworks/core_system/firecrawl_mcp_server/`
- `mcp_server` -> `frameworks/core_system/mcp_server/`
- `Mempalace` -> `frameworks/core_system/mempalace/`
- `post_session_learning` -> `frameworks/core_system/post_session_learning/`
- `security_scanning` -> `frameworks/core_system/security_scanning/`

## Frontend Engineering
- `ck:chrome devtools`, `ck:chrome-devtools` -> `frameworks/frontend_engineering/chrome-devtools/`
- `ckm:design` -> `frameworks/frontend_engineering/design/`
- `ckm:design system`, `ckm:design-system` -> `frameworks/frontend_engineering/design-system/`
- `ck:frontend design`, `ck:frontend-design` -> `frameworks/frontend_engineering/frontend-design/`
- `ck:frontend development`, `ck:frontend-development` -> `frameworks/frontend_engineering/frontend-development/`
- `frontend_ui_dark_ts` -> `frameworks/frontend_engineering/frontend_ui_dark_ts/`
- `ck:markdown novel viewer`, `ck:markdown-novel-viewer` -> `frameworks/frontend_engineering/markdown-novel-viewer/`
- `ck:mermaidjs v11`, `ck:mermaidjs-v11` -> `frameworks/frontend_engineering/mermaidjs-v11/`
- `nextjs_app_router_patterns` -> `frameworks/frontend_engineering/nextjs_app_router_patterns/`
- `react_best_practices` -> `frameworks/frontend_engineering/react_best_practices/`
- `React Components` -> `frameworks/frontend_engineering/react_components/`
- `react:components` -> `frameworks/frontend_engineering/react_components/payload/`
- `ck:shader` -> `frameworks/frontend_engineering/shader/`
- `tailwind_design_system` -> `frameworks/frontend_engineering/tailwind_design_system/`
- `ck:threejs` -> `frameworks/frontend_engineering/threejs/`
- `typescript_advanced_types` -> `frameworks/frontend_engineering/typescript_advanced_types/`
- `ck:ui styling`, `ck:ui-styling` -> `frameworks/frontend_engineering/ui-styling/`
- `ck:ui ux pro max`, `ck:ui-ux-pro-max` -> `frameworks/frontend_engineering/ui-ux-pro-max/`
- `ui_ux_pro_max` -> `frameworks/frontend_engineering/ui_ux_pro_max/`
- `ck:web design guidelines`, `ck:web-design-guidelines` -> `frameworks/frontend_engineering/web-design-guidelines/`
- `ck:web frameworks`, `ck:web-frameworks` -> `frameworks/frontend_engineering/web-frameworks/`

## Mobile Engineering
- `android cli`, `android-cli` -> `frameworks/mobile_engineering/`

## Multimedia Production
- `ck:ai artist`, `ck:ai-artist` -> `frameworks/multimedia_production/ai-artist/`
- `ck:ai multimodal`, `ck:ai-multimodal` -> `frameworks/multimedia_production/ai-multimodal/`
- `ckm:assets organizing`, `ckm:assets-organizing` -> `frameworks/multimedia_production/assets-organizing/`
- `ckm:banner design`, `ckm:banner-design` -> `frameworks/multimedia_production/banner-design/`
- `ckm:cip design`, `ckm:cip-design` -> `frameworks/multimedia_production/cip-design/`
- `ckm:creativity` -> `frameworks/multimedia_production/creativity/`
- `ckm:elevenlabs` -> `frameworks/multimedia_production/elevenlabs/`
- `ckm:logo design`, `ckm:logo-design` -> `frameworks/multimedia_production/logo-design/`
- `ck:media processing`, `ck:media-processing` -> `frameworks/multimedia_production/media-processing/`
- `ck:remotion` -> `frameworks/multimedia_production/remotion/`
- `ckm:slides` -> `frameworks/multimedia_production/slides/`
- `ckm:youtube` -> `frameworks/multimedia_production/youtube/`
- `ckm:youtube thumbnail design`, `ckm:youtube-thumbnail-design` -> `frameworks/multimedia_production/youtube-thumbnail-design/`

## Osint
- `osint graph investigation`, `osint-graph-investigation` -> `frameworks/osint/osint-graph-investigation/`

## Productivity
- `ckm:analyze` -> `frameworks/productivity/analyze/`
- `ck:ask` -> `frameworks/productivity/ask/`
- `ck:brainstorm` -> `frameworks/productivity/brainstorm/`
- `ck:code review`, `ck:code-review` -> `frameworks/productivity/code-review/`
- `ck:cook` -> `frameworks/productivity/cook/`
- `ckm:dashboard` -> `frameworks/productivity/dashboard/`
- `ck:docs` -> `frameworks/productivity/docs/`
- `ck:docs seeker`, `ck:docs-seeker` -> `frameworks/productivity/docs-seeker/`
- `ck:journal` -> `frameworks/productivity/journal/`
- `ck:kanban` -> `frameworks/productivity/kanban/`
- `ck:plan` -> `frameworks/productivity/plan/`
- `ck:plans kanban`, `ck:plans-kanban` -> `frameworks/productivity/plans-kanban/`
- `ck:problem solving`, `ck:problem-solving` -> `frameworks/productivity/problem-solving/`
- `ck:sequential thinking`, `ck:sequential-thinking` -> `frameworks/productivity/sequential-thinking/`
- `ck:watzup` -> `frameworks/productivity/watzup/`
- `ckm:write` -> `frameworks/productivity/write/`

## Science Medical
- `alphafold database fetch and analyze`, `alphafold-database-fetch-and-analyze` -> `frameworks/science_medical/alphafold_database_fetch_and_analyze/`
- `alphagenome single variant analysis`, `alphagenome-single-variant-analysis` -> `frameworks/science_medical/alphagenome_single_variant_analysis/`
- `chembl database`, `chembl-database` -> `frameworks/science_medical/chembl_database/`
- `clinical trials database`, `clinical-trials-database` -> `frameworks/science_medical/clinical_trials_database/`
- `clinvar database`, `clinvar-database` -> `frameworks/science_medical/clinvar_database/`
- `dbsnp database`, `dbsnp-database` -> `frameworks/science_medical/dbsnp_database/`
- `embl ebi ols`, `embl-ebi-ols` -> `frameworks/science_medical/embl_ebi_ols/`
- `encode ccres database`, `encode-ccres-database` -> `frameworks/science_medical/encode_ccres_database/`
- `ensembl database`, `ensembl-database` -> `frameworks/science_medical/ensembl_database/`
- `foldseek structural search`, `foldseek-structural-search` -> `frameworks/science_medical/foldseek_structural_search/`
- `gnomad database`, `gnomad-database` -> `frameworks/science_medical/gnomad_database/`
- `gtex database`, `gtex-database` -> `frameworks/science_medical/gtex_database/`
- `human protein atlas database`, `human-protein-atlas-database` -> `frameworks/science_medical/human_protein_atlas_database/`
- `interpro database`, `interpro-database` -> `frameworks/science_medical/interpro_database/`
- `jaspar database`, `jaspar-database` -> `frameworks/science_medical/jaspar_database/`
- `literature search arxiv`, `literature-search-arxiv` -> `frameworks/science_medical/literature_search_arxiv/`
- `literature search biorxiv`, `literature-search-biorxiv` -> `frameworks/science_medical/literature_search_biorxiv/`
- `literature search europepmc`, `literature-search-europepmc` -> `frameworks/science_medical/literature_search_europepmc/`
- `literature search openalex`, `literature-search-openalex` -> `frameworks/science_medical/literature_search_openalex/`
- `ncbi sequence fetch`, `ncbi-sequence-fetch` -> `frameworks/science_medical/ncbi_sequence_fetch/`
- `openfda database`, `openfda-database` -> `frameworks/science_medical/openfda_database/`
- `opentargets database`, `opentargets-database` -> `frameworks/science_medical/opentargets_database/`
- `pdb database`, `pdb-database` -> `frameworks/science_medical/pdb_database/`
- `protein sequence msa`, `protein-sequence-msa` -> `frameworks/science_medical/protein_sequence_msa/`
- `protein sequence similarity search`, `protein-sequence-similarity-search` -> `frameworks/science_medical/protein_sequence_similarity_search/`
- `pubchem database`, `pubchem-database` -> `frameworks/science_medical/pubchem_database/`
- `pubmed database`, `pubmed-database` -> `frameworks/science_medical/pubmed_database/`
- `pymol` -> `frameworks/science_medical/pymol/`
- `quickgo database`, `quickgo-database` -> `frameworks/science_medical/quickgo_database/`
- `reactome database`, `reactome-database` -> `frameworks/science_medical/reactome_database/`
- `science skills common`, `science-skills-common` -> `frameworks/science_medical/science_skills_common/`
- `string database`, `string-database` -> `frameworks/science_medical/string_database/`
- `ucsc conservation and tfbs`, `ucsc-conservation-and-tfbs` -> `frameworks/science_medical/ucsc_conservation_and_tfbs/`
- `unibind database`, `unibind-database` -> `frameworks/science_medical/unibind_database/`
- `uniprot database`, `uniprot-database` -> `frameworks/science_medical/uniprot_database/`
- `uv` -> `frameworks/science_medical/uv/`
- `workflow skill creator`, `workflow-skill-creator` -> `frameworks/science_medical/workflow_skill_creator/`

## Seo Marketing
- `seosona:ab testing`, `seosona:ab-testing` -> `frameworks/seo_marketing/ab_testing/`
- `ckm:ads management`, `ckm:ads-management` -> `frameworks/seo_marketing/ads_management/`
- `seosona:affiliate marketing`, `seosona:affiliate-marketing` -> `frameworks/seo_marketing/affiliate_marketing/`
- `ai writing formulas`, `ai-writing-formulas` -> `frameworks/seo_marketing/ai_writing_formulas/`
- `seosona:brand identity`, `seosona:brand-identity` -> `frameworks/seo_marketing/brand_identity/`
- `ckm:campaign` -> `frameworks/seo_marketing/campaign/`
- `claude seo framework`, `claude-seo-framework` -> `frameworks/seo_marketing/claude_seo_framework/`
- `seosona:competitor intelligence`, `seosona:competitor-intelligence` -> `frameworks/seo_marketing/competitor_intelligence/`
- `content_creator` -> `frameworks/seo_marketing/content_creator/`
- `ckm:content hub`, `ckm:content-hub` -> `frameworks/seo_marketing/content_hub/`
- `seosona:content marketing`, `seosona:content-marketing` -> `frameworks/seo_marketing/content_marketing/`
- `seosona:copywriting` -> `frameworks/seo_marketing/copywriting/`
- `seosona:cro` -> `frameworks/seo_marketing/cro/`
- `seosona:email marketing`, `seosona:email-marketing` -> `frameworks/seo_marketing/email_marketing/`
- `seosona:free tool strategy`, `seosona:free-tool-strategy` -> `frameworks/seo_marketing/free_tool_strategy/`
- `seosona:funnel` -> `frameworks/seo_marketing/funnel/`
- `landing_page_generator` -> `frameworks/seo_marketing/landing_page_generator/`
- `seosona:launch strategy`, `seosona:launch-strategy` -> `frameworks/seo_marketing/launch_strategy/`
- `linkedin_authority_builder` -> `frameworks/seo_marketing/linkedin_authority_builder/`
- `ckm:marketing dashboard`, `ckm:marketing-dashboard` -> `frameworks/seo_marketing/marketing-dashboard/`
- `ckm:marketing research`, `ckm:marketing-research` -> `frameworks/seo_marketing/marketing-research/`
- `seosona:marketing analytics`, `seosona:marketing-analytics` -> `frameworks/seo_marketing/marketing_analytics/`
- `seosona:marketing ideas`, `seosona:marketing-ideas` -> `frameworks/seo_marketing/marketing_ideas/`
- `seosona:marketing planning`, `seosona:marketing-planning` -> `frameworks/seo_marketing/marketing_planning/`
- `seosona:marketing psychology`, `seosona:marketing-psychology` -> `frameworks/seo_marketing/marketing_psychology/`
- `seosona:onboarding cro`, `seosona:onboarding-cro` -> `frameworks/seo_marketing/onboarding_cro/`
- `seosona:paid ads`, `seosona:paid-ads` -> `frameworks/seo_marketing/paid_ads/`
- `seosona:persona` -> `frameworks/seo_marketing/persona/`
- `seosona:pricing strategy`, `seosona:pricing-strategy` -> `frameworks/seo_marketing/pricing_strategy/`
- `seosona:referral gamification`, `seosona:referral-gamification` -> `frameworks/seo_marketing/referral_gamification/`
- `ckm:seo` -> `frameworks/seo_marketing/seo/`
- `seo_aeo_best_practices` -> `frameworks/seo_marketing/seo_aeo_best_practices/`
- `seo algorithm decoder`, `seo-algorithm-decoder` -> `frameworks/seo_marketing/seo_algorithm_decoder/`
- `seo backlink intel`, `seo-backlink-intel` -> `frameworks/seo_marketing/seo_backlink_intel/`
- `seo content research`, `seo-content-research` -> `frameworks/seo_marketing/seo_content_research/`
- `seo featured snippet`, `seo-featured-snippet` -> `frameworks/seo_marketing/seo_featured_snippet/`
- `seo gsc integration`, `seo-gsc-integration` -> `frameworks/seo_marketing/seo_gsc_integration/`
- `seo keyword research`, `seo-keyword-research` -> `frameworks/seo_marketing/seo_keyword_research/`
- `seo local`, `seo-local` -> `frameworks/seo_marketing/seo_local/`
- `seo migration assistant`, `seo-migration-assistant` -> `frameworks/seo_marketing/seo_migration_assistant/`
- `seo rank tracker`, `seo-rank-tracker` -> `frameworks/seo_marketing/seo_rank_tracker/`
- `seo serp competitor`, `seo-serp-competitor` -> `frameworks/seo_marketing/seo_serp_competitor/`
- `seo sheets export`, `seo-sheets-export` -> `frameworks/seo_marketing/seo_sheets_export/`
- `seo workspace`, `seo-workspace` -> `frameworks/seo_marketing/SEO_WORKSPACE/`
- `social_content_distribution` -> `frameworks/seo_marketing/social_content_distribution/`
- `seosona:social media`, `seosona:social-media` -> `frameworks/seo_marketing/social_media/`
- `seosona:video content`, `seosona:video-content` -> `frameworks/seo_marketing/video_content/`

## Testing Automation
- `playwright` -> `frameworks/testing_automation/playwright/`

## Uncategorized Skills
- `ckm:docx` -> `frameworks/uncategorized_skills/document-skills/docx/`
- `ckm:pdf` -> `frameworks/uncategorized_skills/document-skills/pdf/`
- `ckm:pptx` -> `frameworks/uncategorized_skills/document-skills/pptx/`
- `ckm:xlsx` -> `frameworks/uncategorized_skills/document-skills/xlsx/`

