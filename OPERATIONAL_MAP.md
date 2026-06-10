# SEOSONA OS — Operational System Map
# Bản đồ Hệ Thống Vận Hành Toàn Diện

> **Audit Status:** ALL CLEAR (2026-06-10)
> 11/11 Hooks | 36/36 Agents | 217 Skills (0 broken) | 4-Tier Architecture Verified

---

## I. KIẾN TRÚC 4 CẤP (4-Tier Cognitive Architecture)

```
┌──────────────────────────────────────────────────┐
│  TIER 1: 1_CORE — Lõi Hệ Điều Hành (OS Brain)   │
│  SOUL.md: Hiến pháp | 11 Hooks | 5 Rules          │
│  4 Core Workflows | 1 Orchestrator Agent           │
├──────────────────────────────────────────────────┤
│  TIER 2: 4_AGENTS — Nhận Diện (Personas)          │
│  36 Specialist Agents | ROSTER.md registry         │
├──────────────────────────────────────────────────┤
│  TIER 3: 2_KNOWLEDGE — Thư Viện Kỹ Năng           │
│  13 Categories | 211 Skill Dirs | 78 Commands      │
│  217 Routes (SKILLS_ROUTER) | 4 Workflows          │
├──────────────────────────────────────────────────┤
│  TIER 4: 3_MEMORY — Ký Ức (Long-term Memory)      │
│  logs/ specs/ errors/ knowledge_items/ seo_exports │
└──────────────────────────────────────────────────┘
```

**Anchor toàn cục:** `~/.seosona` → actual SEOSONA OS folder
**Không bao giờ hardcode path tuyệt đối.**

---

## II. CORE WORKFLOWS (Tier 1 — 1_CORE/workflows/)

Đây là các quy trình nền tảng AI tự động thực hiện.

| File | Tên | Mục đích | Khi nào trigger |
|------|-----|----------|-----------------|
| `create_agent_workflow.md` | **Agent Creation Workflow** | Tạo Agent/Persona mới chuẩn SEOSONA format | Khi phát hiện thiếu chuyên gia cho một domain |
| `create_skill_workflow.md` | **Skill Distiller** | Chuyển tài liệu/repo thành Skill `.md` có cấu trúc | Khi ingest kiến thức mới vào 2_KNOWLEDGE |
| `knowledge_ingestion_workflow.md` | **Universal Assimilation Protocol (UAP)** | Nạp bất kỳ data artifact nào (PDF, Repo, Link) vào hệ thống | Khi user drop link/file/repo |
| `memory_encoding_workflow.md` | **Dreaming Memory Protocol (DMP)** | Ghi lại quyết định, bug, pattern vào 3_MEMORY nền | Liên tục trong mọi session |

### Cách tạo thêm Core Workflow mới:
```
1. Tạo file: 1_CORE/workflows/{tên_workflow}.md
2. Format header: # WORKFLOW: {Tên}
3. Sections: Purpose | Trigger | Phase 1 | Phase 2 | ... | Success Criteria
4. Register vào SOUL.md → Section 4 "Master Flow"
```

---

## III. SEOSONA DOMAIN WORKFLOWS (Tier 3 — 2_KNOWLEDGE/workflows/)

Các quy trình vận hành theo lĩnh vực cụ thể.

| File | Mục đích | Agent dùng |
|------|----------|------------|
| `primary-workflow.md` | Luồng phát triển code chuẩn (Plan → Code → Test → Review → Deploy) | planner, tester, code-reviewer, debugger |
| `seosona-grand-audit.md` | **Audit toàn diện website 360°** (SEO + CRO + Psychology + Brand) | seo-specialist, funnel-architect, analytics-analyst |
| `seo-workflow.md` | Quy trình SEO tổng quát | seo-specialist, seo-content-master |
| `analytics-workflow.md` | Quy trình phân tích data & báo cáo | analytics-analyst |
| `campaign-workflow.md` | Quy trình quản lý campaign | campaign-manager, campaign-debugger |
| `content-workflow.md` | Quy trình tạo và phân phối content | content-creator, content-reviewer |
| `marketing-workflow.md` | Quy trình marketing tổng quát | copywriter, campaign-manager |
| `marketing_campaign_workflow.md` | Quy trình campaign marketing chi tiết | campaign-manager, social-media-manager |
| `sales-workflow.md` | Quy trình sales | sale-enabler, lead-qualifier |
| `development-rules.md` | Quy tắc code cứng nhắc | fullstack-developer, nextjs-autofix-bot |
| `documentation-management.md` | Quy trình quản lý tài liệu | docs-manager |
| `orchestration-protocol.md` | Protocol điều phối multi-agent | orchestrator |

---

## IV. SEO WORKSPACE SYSTEM (2_KNOWLEDGE/frameworks/seo_marketing/SEO_WORKSPACE/)

Đây là workspace hoàn chỉnh nhất — chuẩn SEO Agency riêng của SEOSONA.

### A. SEO Workflows (Quy trình làm việc)
| File | Mục đích |
|------|----------|
| `workflows/01_single_site_audit.md` | **Audit 1 website** — 4 phase: Setup → Data → Analysis → Output |
| `workflows/02_multi_site_comparison.md` | So sánh nhiều website cùng lúc |
| `workflows/03_competitor_analysis.md` | Phân tích đối thủ cạnh tranh |
| `workflows/04_keyword_research.md` | Research keyword chuyên sâu |
| `workflows/05_multi_competitor_matrix.md` | Ma trận so sánh multi-competitor |

### B. SOPs (Quy trình chuẩn hoá)
| File | Mục đích |
|------|----------|
| `sops/scoring_rubric.md` | Thang điểm 5 Pillars (Technical, Content, Authority, Visibility, Competitive) |
| `sops/data_collection.md` | SOP thu thập data (GSC, GA4, Crawl) |
| `sops/dashboard_build.md` | SOP build HTML Dashboard |
| `sops/output_delivery.md` | SOP deliver báo cáo cho client |

### C. Templates (Mẫu báo cáo)
| File | Mục đích |
|------|----------|
| `templates/seo_audit_report.md` | Template báo cáo audit đầy đủ |
| `templates/executive_summary.md` | Template tóm tắt CEO (1 trang) |
| `templates/action_plan.md` | Template kế hoạch hành động |
| `templates/comparison_matrix.md` | Template so sánh đối thủ |
| `templates/eeat_report_template.md` | Template đánh giá E-E-A-T |

### D. System Files
| File | Mục đích |
|------|----------|
| `CHECKLIST.md` | Checklist verify trước khi deliver |
| `SYSTEM_AUDIT.md` | Audit toàn bộ SEO WORKSPACE |

### Output format chuẩn:
```
3_MEMORY/seo_exports/{domain}/
├── {domain}_audit_{date}.md           ← Báo cáo đầy đủ
├── {domain}_executive_{date}.md       ← Tóm tắt CEO
├── {domain}_action_plan_{date}.md     ← Kế hoạch hành động
├── keyword_research_{domain}_{date}.csv
├── competitor_matrix_{domain}_{date}.csv
├── backlink_report_{domain}_{date}.csv
├── rank_tracking_{domain}_{date}.csv
├── gsc_report_{domain}_{date}.csv
└── seo_dashboard_{domain}.html        ← Dashboard 8 tabs
```

---

## V. SLASH COMMANDS (2_KNOWLEDGE/commands/ckm/)

78 lệnh tắt có thể dùng ngay. Nhóm theo domain:

### 🔍 SEO & Marketing
| Command | Mục đích |
|---------|----------|
| `seo-audit.md` | Audit SEO nhanh 1 domain |
| `seo-keywords.md` | Research keyword theo topic |
| `seo-pseo.md` | Programmatic SEO |
| `seo.md` | SEO tổng quát |
| `competitor.md` | Phân tích đối thủ |

### ✍️ Content & Copy
| Command | Mục đích |
|---------|----------|
| `write-blog.md` | Viết bài blog |
| `write-blog-youtube.md` | Viết blog + script YouTube |
| `write-cro.md` | Copy tối ưu chuyển đổi |
| `write-good.md` | Viết chuẩn |
| `write-enhance.md` | Nâng cấp văn bản |
| `write-formula.md` | Viết theo công thức marketing |
| `write-publish.md` | Publish nội dung |
| `write-audit.md` | Audit chất lượng nội dung |

### 📊 Campaign & Analytics
| Command | Mục đích |
|---------|----------|
| `campaign.md` | Tạo campaign |
| `campaign-create.md` | Tạo campaign chi tiết |
| `campaign-analyze.md` | Phân tích campaign |
| `campaign-status.md` | Kiểm tra status campaign |
| `campaign-email.md` | Campaign email |
| `dashboard.md` | Tạo dashboard |
| `dashboard-check.md` | Kiểm tra dashboard |

### 📧 Email & Social
| Command | Mục đích |
|---------|----------|
| `email.md` | Email tổng quát |
| `email-flow.md` | Email automation flow |
| `email-sequence.md` | Chuỗi email sequence |
| `social.md` | Social media |
| `social-schedule.md` | Lịch đăng bài social |

### 🎬 Video & Multimedia
| Command | Mục đích |
|---------|----------|
| `video-create.md` | Tạo video hoàn chỉnh |
| `video-script-create.md` | Viết script video |
| `video-storyboard-create.md` | Tạo storyboard |
| `youtube-blog.md` | YouTube → Blog |
| `youtube-social.md` | YouTube → Social posts |
| `youtube-infographic.md` | YouTube → Infographic |

### 🛠️ Dev & Engineering
| Command | Mục đích |
|---------|----------|
| `plan.md` | Tạo implementation plan |
| `plan-hard.md` | Plan với approval gate chặt |
| `plan-parallel.md` | Plan chạy song song |
| `plan-fast.md` | Plan nhanh |
| `plan-cro.md` | Plan CRO |
| `plan-validate.md` | Validate plan |
| `plan-ci.md` | Plan CI/CD |
| `test-workflow.md` | Chạy test workflow |
| `test-ui.md` | Test UI |
| `worktree.md` | Git worktree management |

### 🧠 AI System & Skills
| Command | Mục đích |
|---------|----------|
| `skill-create.md` | Tạo Skill mới |
| `skill-add.md` | Thêm skill |
| `skill-update.md` | Cập nhật skill |
| `skill-optimize.md` | Tối ưu skill |
| `skill-plan.md` | Lên kế hoạch skill |
| `persona.md` | Quản lý persona |
| `use-mcp.md` | Kết nối MCP server |
| `hub.md` | Hub tổng quát |

### 📋 Planning & Docs
| Command | Mục đích |
|---------|----------|
| `kanban.md` | Quản lý kanban |
| `docs-init.md` | Khởi tạo tài liệu |
| `docs-update.md` | Cập nhật tài liệu |
| `docs-summarize.md` | Tóm tắt tài liệu |
| `funnel.md` | Thiết kế funnel |
| `journal.md` | Nhật ký |
| `analyze.md` | Phân tích tổng quát |

---

## VI. BUG FIX WORKFLOWS (2_KNOWLEDGE/frameworks/backend_engineering/fix/)

Các luồng fix bug theo mức độ:

| File | Khi nào dùng |
|------|-------------|
| `workflow-quick.md` | Bug đơn giản, fix < 10 phút |
| `workflow-standard.md` | Bug trung bình, cần phân tích |
| `workflow-deep.md` | Bug phức tạp, cần trace toàn bộ |
| `workflow-ci.md` | Bug trên CI/CD pipeline |
| `workflow-test.md` | Test bị fail |
| `workflow-types.md` | TypeScript type errors |
| `workflow-ui.md` | UI/CSS bugs |
| `workflow-logs.md` | Phân tích logs |

---

## VII. GIT WORKFLOWS (2_KNOWLEDGE/frameworks/backend_engineering/git/)

| File | Mục đích |
|------|----------|
| `workflow-commit.md` | Quy trình commit chuẩn |
| `workflow-push.md` | Quy trình push lên remote |
| `workflow-pr.md` | Tạo Pull Request |
| `workflow-merge.md` | Merge branch |

---

## VIII. AGENT ROSTER (4_AGENTS/personas/) — 36 Agents

### Marketing & Growth (14 agents)
`attraction-specialist` | `campaign-manager` | `campaign-debugger` | `community-manager`
`seo-specialist` | `seo-content-master` | `seo-topical-map-architect` | `social-media-manager`
`copywriter` | `email-wizard` | `lead-qualifier` | `upsell-maximizer`
`funnel-architect` | `sale-enabler`

### Engineering & Tech (8 agents)
`fullstack-developer` | `nextjs-autofix-bot` | `database-admin` | `debugger`
`code-reviewer` | `tester` | `git-manager` | `mcp-manager`

### Content & Creation (5 agents)
`content-strategist` | `content-creator` | `content-reviewer` | `journal-writer` | `docs-manager`

### Research & Strategy (9 agents)
`researcher` | `analytics-analyst` | `analyst` | `planner` | `project-manager`
`scout` | `scout-external` | `continuity-specialist` | `ui-ux-designer`

---

## IX. SKILL CATEGORIES (2_KNOWLEDGE/frameworks/) — 13 Categories

| Category | Skill Dirs | Nội dung |
|----------|-----------|---------|
| `seo_marketing/` | ~50 | SEO, Content, CRO, Funnel, Campaign, Analytics |
| `core_system/` | ~40 | Agent skills, Memory, MCP, Security, Firecrawl |
| `backend_engineering/` | ~30 | APIs, Databases, DevOps, Git, Fix workflows |
| `productivity/` | ~25 | Planning, Problem-solving, Journaling, Analysis |
| `frontend_engineering/` | ~20 | NextJS, React, UI/UX, Design System, Tailwind |
| `agentic_workflows/` | ~15 | Claude Code, MCP, Scout, Skill Creator |
| `multimedia_production/` | ~14 | Video, YouTube, Banner, Slides, AI Art |
| `science_medical/` | ~35 | PubMed, AlphaFold, clinical databases |
| `testing_automation/` | ~3 | Playwright, E2E testing |
| `mobile_engineering/` | ~2 | Android CLI |
| `osint/` | ~1 | OSINT investigation |
| `uncategorized_skills/` | ~8 | Miscellaneous ingested skills |
| `ingested_data/` | varies | Raw ingested frameworks |

---

## X. MEMORY SYSTEM (3_MEMORY/)

| Thư mục | Mục đích | Gitignored? |
|---------|----------|-------------|
| `seo_exports/` | Output báo cáo SEO cho client | ✅ |
| `logs/` | Lịch sử session, transcript | ✅ |
| `knowledge_items/` | KI snapshots AI tự tổng hợp | ✅ |
| `errors/` | Raw error logs | ✅ |
| `specs/` | Brand guidelines, config, API specs | ❌ |
| `plans/` | Implementation plans | ❌ |
| `ingestion_zone/` | Drop zone cho raw data mới | ✅ |

---

## XI. HOOK SYSTEM (1_CORE/hooks/) — 11 Hooks

| Hook | Event | Mục đích |
|------|-------|----------|
| `session-init.cjs` | SessionStart | Khởi tạo context, detect project |
| `subagent-init.cjs` | SubagentStart | Setup cho sub-agents |
| `dev-rules-reminder.cjs` | UserPromptSubmit | Nhắc nhở rules khi user gõ |
| `usage-context-awareness.cjs` | UserPromptSubmit | Nhận biết context usage |
| `descriptive-name.cjs` | PreToolUse:Write | Đảm bảo tên file có nghĩa |
| `scout-block.cjs` | PreToolUse | Chặn các thao tác scout nguy hiểm |
| `privacy-block.cjs` | PreToolUse | Chặn leak thông tin nhạy cảm |
| `post-edit-simplify-reminder.cjs` | PostToolUse:Edit | Nhắc simplify sau 5 edits |
| `memory-logger.cjs` | PostToolUse:Write | Tự động ghi log vào 3_MEMORY |
| `write-compact-marker.cjs` | PreCompact | Ghi marker trước khi compact context |
| `session-end.cjs` | SessionEnd | Ghi SESSION_END vào transcript |

---

## XII. HƯỚNG DẪN TẠO WORKFLOW MỚI

### Template chuẩn cho 1 Workflow:

```markdown
# WORKFLOW: {Tên Workflow}

**Purpose:** {Mục đích — 1 câu}
**Trigger:** {Từ khóa kích hoạt | slash command | điều kiện}
**Agent:** {Persona chính xử lý}
**Skills needed:** `{path/to/skill1}` | `{path/to/skill2}`

---

## PHASE 1: {Tên Phase} ({Thời gian ước tính})
*Objective: {Mục tiêu cụ thể}*

### Step 1: {Tên bước}
- Action: ...
- Output: ...

### Step 2: {Tên bước}
...

---

## PHASE 2: ...

---

## OUTPUT FORMAT
```
{mô tả format output cụ thể}
```

## SUCCESS CRITERIA
- [ ] {Điều kiện 1 để coi là thành công}
- [ ] {Điều kiện 2}
```

### Các loại Workflow có thể tạo thêm:

1. **Domain-specific workflows** → lưu vào `2_KNOWLEDGE/workflows/`
2. **SEO sub-workflows** → lưu vào `2_KNOWLEDGE/frameworks/seo_marketing/SEO_WORKSPACE/workflows/`
3. **Core OS workflows** → lưu vào `1_CORE/workflows/`
4. **Slash commands** → lưu vào `2_KNOWLEDGE/commands/ckm/{tên}.md`

### Sau khi tạo workflow:
- Nếu là Skill: thêm route vào `SKILLS_ROUTER.md`
- Nếu là Command: tự động được pick up bởi `ckm:` prefix
- Nếu là Core Workflow: reference trong `SOUL.md` Section 4

---

## XIII. LUỒNG VẬN HÀNH TỔNG THỂ

```
User Request
     │
     ▼
[SessionStart Hook] → Boot Context loaded (SOUL + Orchestrator + Personas)
     │
     ▼
[Orchestrator Agent] → Parse intent → Route to Persona
     │
     ▼
[Specialist Persona] → Load relevant Skills from 2_KNOWLEDGE
     │
     ▼
[Execute Workflow] → Apply SOPs → Use Templates
     │
     ▼
[PostToolUse Hook] → memory-logger.cjs → auto-log to 3_MEMORY/logs/
     │
     ▼
[Output] → 3_MEMORY/seo_exports/ | 3_MEMORY/plans/ | chat response
     │
     ▼
[SessionEnd Hook] → Write SESSION_END to transcript
```

---

*Generated by SEOSONA OS — Last Audit: 2026-06-10 | All Clear*
