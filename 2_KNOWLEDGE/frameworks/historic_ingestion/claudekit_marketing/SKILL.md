---
name: "claudekit_marketing"
description: "Historic directory skill"
keywords: ["claudekit_marketing", "ingested"]
mcp_compatible: true
---

# ClaudeKit Marketing — AI Marketing Automation Toolkit

> **Source**: Local external source snapshot / http~/.seosona/path/
> **Ingested**: 2026-06-10
> **Type**: Framework (AI Marketing Automation Toolkit — Claude Code Subagent Orchestration)
> **License**: Apache 2.0
> **Author**: ClaudeKit (claudekit.cc) — Vietnamese dev team (duynguyen, bnqtoan)
> **Stars**: N/A (Local clone)

---

## Overview

ClaudeKit Marketing is a **comprehensive marketing automation toolkit** built on **Claude Code subagent orchestration**. It provides a reusable `.claude/` folder kit that users install into their own projects. The kit contains agents, skills, commands, workflows, and hooks to enable autonomous marketing workflows for content creation, campaign management, SEO optimization, and lead generation.

**Target Users**: Indie hackers, small marketing teams, SMB marketing managers.

**Key Differentiator**: The deliverable is **the `.claude/` folder itself** — a portable, plug-in kit. It's NOT a standalone application; it's infrastructure that enhances any project with marketing AI capabilities.

---

## Architecture

```
.claude/                          ← Kit Output (Portable)
├── agents/         (31 agents)   ← Marketing subagent personas
├── commands/       (ckm/)        ← Slash commands (/brand:update, etc.)
├── skills/         (101 skills)  ← Domain knowledge, scripts & resources
├── workflows/      (10 flows)    ← Process definitions (SEO, Content, Sales, etc.)
├── hooks/          (14 hooks)    ← Automation hooks (session-init, privacy, etc.)
├── output-styles/                ← Output formatting templates
├── schemas/                      ← JSON schemas for config validation
├── scripts/                      ← Shared utility scripts
├── secrets/                      ← Encrypted secrets storage
├── session-state/                ← Runtime state tracking
├── .ck.json                      ← Kit configuration
├── settings.json                 ← Claude Code settings with hook bindings
├── statusline.cjs                ← Terminal status line renderer
└── metadata.json   (466KB)       ← Full kit metadata & release manifest
```

---

## Agent Roster (31 Subagents)

| Agent | Role |
|---|---|
| **analytics-analyst** | Data analytics & reporting |
| **attraction-specialist** | Lead attraction strategies |
| **campaign-debugger** | Campaign troubleshooting |
| **campaign-manager** | Multi-channel campaign orchestration |
| **code-reviewer** | Code quality review |
| **community-manager** | Community engagement |
| **content-creator** | Content generation |
| **content-reviewer** | Content quality assurance |
| **continuity-specialist** | Brand consistency |
| **copywriter** | Copy & messaging |
| **database-admin** | Database management |
| **debugger** | Technical debugging |
| **docs-manager** | Documentation management |
| **email-wizard** | Email marketing automation |
| **fullstack-developer** | Full-stack development |
| **funnel-architect** | Sales funnel design |
| **git-manager** | Git workflow management |
| **journal-writer** | Activity logging |
| **lead-qualifier** | Lead scoring & qualification |
| **mcp-manager** | MCP server management |
| **planner** | Implementation planning |
| **project-manager** | Project coordination |
| **researcher** | Research & analysis |
| **sale-enabler** | Sales enablement |
| **scout-external** | External research |
| **scout** | Internal research |
| **seo-specialist** | SEO optimization |
| **social-media-manager** | Social media management |
| **tester** | Testing & QA |
| **ui-ux-designer** | UI/UX design |
| **upsell-maximizer** | Upsell strategy |

---

## Skills Catalog (101 Skills)

### Marketing & Sales (Core)
| Skill | Directory |
|---|---|
| Campaign | `campaign/` |
| Content Marketing | `content-marketing/` |
| Content Hub | `content-hub/` |
| Copywriting | `copywriting/` |
| Competitor Intelligence | `competitor/` |
| Email Marketing | `email/` |
| Funnel Design | `funnel/` |
| Marketing Dashboard | `marketing-dashboard/` |
| Marketing Ideas | `marketing-ideas/` |
| Marketing Planning | `marketing-planning/` |
| Marketing Psychology | `marketing-psychology/` |
| Marketing Research | `marketing-research/` |
| Social Media | `social/` |
| Paid Ads | `paid-ads/` |
| Ads Management | `ads-management/` |
| Launch Strategy | `launch-strategy/` |
| Pricing Strategy | `pricing-strategy/` |
| Persona | `persona/` |
| Brand | `brand/` |
| Analytics | `analytics/` |

### SEO
| Skill | Directory |
|---|---|
| SEO Core | `seo/` |

### CRO & Growth
| Skill | Directory |
|---|---|
| Form CRO | `form-cro/` |
| Onboarding CRO | `onboarding-cro/` |
| AB Testing | `ab-test-setup/` |
| Free Tool Strategy | `free-tool-strategy/` |
| Gamification Marketing | `gamification-marketing/` |
| Referral Program | `referral-program-building/` |
| Affiliate Marketing | `affiliate-marketing/` |

### Creative & Multimedia
| Skill | Directory |
|---|---|
| AI Artist | `ai-artist/` |
| AI Multimodal | `ai-multimodal/` |
| Banner Design | `banner-design/` |
| Logo Design | `logo-design/` |
| CIP Design | `cip-design/` |
| Slides | `slides/` |
| Media Processing | `media-processing/` |
| Video | `video/` |
| YouTube | `youtube/` |
| YouTube Thumbnail | `youtube-thumbnail-design/` |
| Remotion | `remotion/` |
| ElevenLabs | `elevenlabs/` |
| Assets Organizing | `assets-organizing/` |
| Creativity | `creativity/` |

### Engineering & DevOps
| Skill | Directory |
|---|---|
| Frontend Development | `frontend-development/` |
| Frontend Design | `frontend-design/` |
| Backend Development | `backend-development/` |
| Web Frameworks | `web-frameworks/` |
| UI Styling | `ui-styling/` |
| UI/UX Pro Max | `ui-ux-pro-max/` |
| Design System | `design-system/` |
| Design | `design/` |
| Web Design Guidelines | `web-design-guidelines/` |
| Three.js | `threejs/` |
| Shader | `shader/` |
| Chrome DevTools | `chrome-devtools/` |
| Databases | `databases/` |
| DevOps | `devops/` |
| Shopify | `shopify/` |
| Payment Integration | `payment-integration/` |
| Better Auth | `better-auth/` |
| Storage | `storage/` |
| CKM Storage | `ckm-storage/` |
| Git | `git/` |
| Debugging | `debugging/` |
| Testing | `test/` |
| Fix | `fix/` |
| Worktree | `worktree/` |
| MermaidJS v11 | `mermaidjs-v11/` |

### AI & Agent Skills
| Skill | Directory |
|---|---|
| Claude Code | `claude-code/` |
| Context Engineering | `context-engineering/` |
| MCP Builder | `mcp-builder/` |
| MCP Management | `mcp-management/` |
| Skill Creator | `skill-creator/` |
| Kit Builder | `kit-builder/` |
| Repomix | `repomix/` |
| Hub | `hub/` |
| Scout | `scout/` |
| Play | `play/` |
| Preview | `preview/` |
| Init | `init/` |
| Use MCP | `use-mcp/` |
| Template Skill | `template-skill/` |
| Google ADK Python | `google-adk-python/` |

### Productivity
| Skill | Directory |
|---|---|
| Sequential Thinking | `sequential-thinking/` |
| Problem Solving | `problem-solving/` |
| Brainstorm | `brainstorm/` |
| Plan | `plan/` |
| Kanban | `kanban/` |
| Plans Kanban | `plans-kanban/` |
| Analyze | `analyze/` |
| Ask | `ask/` |
| Dashboard | `dashboard/` |
| Docs | `docs/` |
| Docs Seeker | `docs-seeker/` |
| Journal | `journal/` |
| Write | `write/` |
| Cook | `cook/` |
| Watzup | `watzup/` |
| Code Review | `code-review/` |
| Markdown Novel Viewer | `markdown-novel-viewer/` |
| Document Skills | `document-skills/` |

---

## Workflows (10)

| Workflow | File | Purpose |
|---|---|---|
| **Primary** | `primary-workflow.md` | Master orchestration (Plan → Code → Test → Review → Integrate) |
| **Content** | `content-workflow.md` | Content creation pipeline |
| **Campaign** | `campaign-workflow.md` | Campaign management lifecycle |
| **Marketing** | `marketing-workflow.md` | General marketing operations |
| **SEO** | `seo-workflow.md` | SEO optimization workflow |
| **Sales** | `sales-workflow.md` | Sales enablement pipeline |
| **Analytics** | `analytics-workflow.md` | Data analytics workflow |
| **Development Rules** | `development-rules.md` | Code quality standards |
| **Documentation Mgmt** | `documentation-management.md` | Docs maintenance protocol |
| **Orchestration** | `orchestration-protocol.md` | Sequential chaining & parallel execution |

---

## Hooks System (14 Hooks)

| Hook | Trigger | Purpose |
|---|---|---|
| `session-init.cjs` | SessionStart | Initialize session state & context |
| `subagent-init.cjs` | SubagentStart | Initialize subagent environment |
| `brand-guidelines-reminder.cjs` | SubagentStart (content agents) | Inject brand context |
| `campaign-tracking.cjs` | SubagentStart (campaign agents) | Inject campaign tracking context |
| `approval-workflow.cjs` | SubagentStart (all) | Approval workflow injection |
| `dev-rules-reminder.cjs` | UserPromptSubmit | Remind dev rules |
| `usage-context-awareness.cjs` | UserPromptSubmit | Context-aware usage hints |
| `descriptive-name.cjs` | PreToolUse (Write) | Enforce descriptive file names |
| `scout-block.cjs` | PreToolUse (File ops) | Block scout from modifying files |
| `privacy-block.cjs` | PreToolUse (File ops) | Block access to sensitive files |
| `write-compact-marker.cjs` | PreCompact | Write compact state marker |
| `session-end.cjs` | SessionEnd | Clean up session |
| `task-completed-handler.cjs` | TaskCompleted | Handle task completion |
| `teammate-idle-handler.cjs` | TeammateIdle | Handle idle teammates |

---

## Key Design Patterns (Learnable)

### 1. Dynamic Brand Injection
```
User runs command → inject-brand-context.cjs → user's docs/ → dynamic prompt
```
All commands/skills read from the USER's `docs/brand-guidelines.md` — never hardcode values. This is a core principle for portable kit design.

### 2. Subagent Orchestration Protocol
- **Sequential Chaining**: Planning → Implementation → Testing → Review
- **Parallel Execution**: Multiple independent agents work simultaneously
- **Context Passing**: Outputs from one agent feed into the next
- **Hook-Based Automation**: Session lifecycle hooks auto-inject context

### 3. Environment Variable Hierarchy
```
Priority (highest → lowest):
1. process.env (Runtime)
2. .claude/skills/<skill>/.env (Skill-specific)
3. .claude/skills/.env (Shared skills)
4. .claude/.env (Global defaults)
```

### 4. Plan Naming Convention
```
{date}-{issue}-{slug}  →  e.g., 260610-1045-GH-123-campaign-setup
```

### 5. Kit Portability Pattern
The entire `.claude/` folder is the deliverable — users copy it into their projects. No hard dependencies on specific project structure.

---

## SEOSONA Relevance Assessment

- **Skillize?** ✅ **YES — VERY HIGH** — This kit's skills are directly compatible with and overlapping SEOSONA's skill system. Many skills are identical (same names, same structure).
- **Agentize?** ❌ Not requested, but the 31-agent roster is a gold mine for SEOSONA's persona library.
- **Reference Value**: ✅ **Extremely High** — This is effectively a **sister project** to SEOSONA OS. The architecture patterns (hooks, subagent orchestration, brand injection, env hierarchy) are directly applicable.
- **Classification**: `ingested_data/` reference only (but could be promoted to active integration).

---

## SEOSONA Cross-Reference Map

| ClaudeKit Component | SEOSONA Equivalent | Notes |
|---|---|---|
| `.claude/agents/` (31) | `4_AGENTS/personas/` (93) | Same pattern, different scale |
| `.claude/skills/` (101) | `2_KNOWLEDGE/frameworks/` (117+) | Massive overlap — same skill names |
| `.claude/workflows/` | `2_KNOWLEDGE/workflows/` | Direct mapping |
| `.claude/hooks/` | No equivalent | **NEW** — SEOSONA could adopt this pattern |
| `.claude/commands/ckm/` | `2_KNOWLEDGE/commands/ckm/` | Already shared! |
| `settings.json` | `1_CONFIG/` | Different format, same purpose |
| `.ck.json` | No equivalent | Kit config pattern — could adopt |
| `brand-injection` pattern | N/A | **Learnable** — dynamic context injection |

### Key Differences from SEOSONA OS
1. **ClaudeKit** is a portable `.claude/` kit (copy into any project)
2. **SEOSONA OS** is a standalone knowledge system (runs from its own directory)
3. ClaudeKit uses Claude Code hooks (`.cjs` scripts) — SEOSONA doesn't have this
4. ClaudeKit has a centralized `metadata.json` (466KB) — SEOSONA uses `MASTER_INDEX.md`
