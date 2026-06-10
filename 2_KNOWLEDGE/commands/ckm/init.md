---
description: 💡💡💡💡 Initialize marketing project
argument-hint: [prompt]
---

Initialize a new marketing project by gathering comprehensive client information through an agency-style marketing brief interview.

## Your Mission

Conduct a structured interview to gather all essential marketing information, then generate foundational project documentation.

<user-input>$ARGUMENTS</user-input>

**IMPORTANT**:
- Do not skip any phase or section.
- Analyze the skills catalog and activate the skills that are needed for the task during the process.
- Ensure token efficiency while maintaining high quality.
- Sacrifice grammar for the sake of concision when writing reports.
- In reports, list any unresolved questions at the end, if any.

## Phase 0: Git Setup

1. **Check Git Status**
   - Run `git status` to detect if git is initialized
   - If not a git repo, ask user: "Initialize git repository?"

2. **If User Confirms Git Init**
   - Run `git init`
   - Ask: "Create remote repository?" (GitHub/GitLab/etc.)
   - If yes, gather repo name and create via `gh repo create`

3. **If Already Initialized**
   - Show current remote (if any)
   - Proceed to Phase 1

## Phase 1: Quick Evaluation

**Main agent spawns parallel researchers** to evaluate current project situation:

### 1.1 Parallel Research (spawn 3-4 `researcher` agents simultaneously)

| Agent | Focus Area | Data Sources |
|-------|------------|--------------|
| Researcher 1 | Product/Service Analysis | `README.md`, `CLAUDE.md`, `package.json`, codebase |
| Researcher 2 | Existing Marketing Assets | `docs/*.md`, `assets/`, marketing collaterals |
| Researcher 3 | Digital Presence | Website URL (if found), social links, SEO status |
| Researcher 4 | Competitive Landscape | Industry context, market positioning |

### 1.2 If Docs Exist in `docs/`

1. **Read all existing docs**:
   - `docs/project-overview-pdr.md`
   - `docs/marketing-overview.md`
   - `docs/brand-guidelines.md`
   - `docs/design-guidelines.md`
   - Any other `docs/*.md` files

2. **Compile findings summary** with key points:
   - Product/service description
   - Target audience (if defined)
   - Brand identity (if defined)
   - Marketing objectives (if defined)
   - Existing campaigns/assets

3. **Verify with user via `AskUserQuestion`**:
   - Display compiled summary
   - Ask: "Is this information still accurate?"
   - Options: "Yes, proceed" / "Needs updates" / "Start fresh"
   - If "Needs updates": ask which sections need revision

### 1.3 If No Docs Exist

- Note: "No existing docs found"
- Proceed directly to Phase 2

## Phase 2: Marketing Brief Interview

Use `AskUserQuestion` tool for each section.

### Section A: Basic Information
- Company/Product name and tagline
- Industry/Niche
- Brief introduction (2-3 sentences)
- Website URL (if exists): ask for URL if not found, read and analyze website to extract information

### Section B: Products/Services
- What are your main products/services?
- Key USPs and differentiators
- Price range/Pricing model
- Top 3 product highlights

### Section C: Objectives (multi-select)
- Brand awareness
- Lead generation
- Sales conversion
- Customer retention
- Market expansion
- Product launch
- Other

### Section D: Target Audience
- **Geographic**: Countries/Regions
- **Demographic**: Age, gender, income level
- **Psychographic**: Interests, values, lifestyle
- **B2B specifics**: Company size, industry, decision-maker roles

### Section E: Competitive Landscape
- Top 3 competitors (names/URLs)
- Your competitive advantage
- Market positioning goal

### Section F: Brand Assets
- Logo available? (Y/N, format)
- Brand colors defined?
- Brand fonts specified?
- Existing brand guidelines doc?
- Marketing collaterals (name cards, catalogue, etc.)?

### Section G: Design Guidelines
Ask if they want to extract from:
- Website (provide URL)
- Videos (provide links)
- Existing documents (provide paths)
- Manual input

### Section H: Social Presence
- Active social platforms (multi-select)
- Social profile URLs
- Current follower counts (approximate)

### Section I: Timeline & Budget
- Expected launch/go-live date
- Monthly marketing budget range
- Priority channels for budget allocation

## Phase 3: Documentation Generation

**IMPORANT**: Create/update following documents even docs exists in Step 1.2

After interview completion, spawn `docs-manager` agent with gathered data to:

1. **Update `CLAUDE.md`**
   - Add marketing context section
   - Update role description

2. **Create/Update `README.md`**
   - Project overview
   - Quick start for marketing workflows

3. **Generate `docs/project-overview-pdr.md`**
   - Full product development requirements
   - Marketing objectives and KPIs
   - Target audience profiles
   - Brand guidelines summary

4. **Generate `docs/marketing-overview.md`**
   - Marketing strategy summary
   - Channel priorities
   - Campaign roadmap outline

5. **Generate `docs/project-roadmap.md`**
   - Marketing milestones
   - Campaign timeline
   - Resource allocation

## Phase 3.5: Commit Changes

Ask user: "Commit generated documentation?"
- If yes, execute `/git:cm` command to stage and commit
- Suggested commit message: "docs: initialize marketing project documentation"

## Phase 4: Next Steps

After documentation generated:

1. **Analyze Available Commands**
   - Run `python .claude/scripts/generate_catalogs.py --commands`
   - Identify relevant next steps

2. **Suggest Next Actions** (pick 3-5 most relevant):
   - `/persona create` - Create customer personas
   - `/seo audit` - Audit website SEO
   - `/funnel design` - Design marketing funnel
   - `/campaign create` - Plan first campaign
   - `/social schedule` - Create content calendar
   - `/write:blog` - Start blog content
   - `/competitor` - Deep competitor analysis
   - None - finish the process.

## Agents Used
- `researcher` (x4 parallel) - Quick evaluation of project situation
- `docs-manager` - Documentation generation

## Skills Used
- `research` - Quick evaluation of project situation
- `chrome-devtools` - Website extraction
- `ai-multimodal` - Video/image analysis
- `assets-organizing` - Standardized output paths and naming conventions

## Commands Used
- `/git:cm` - Stage and commit changes

## Output
**IMPORANT**: Create/update following documents even docs exists in Step 1.2
- `CLAUDE.md` - Updated with marketing context
- `README.md` - Project overview
- `docs/project-overview-pdr.md` - Full PDR
- `docs/marketing-overview.md` - Marketing strategy
- `docs/project-roadmap.md` - Campaign timeline

## Notes
- Use progressive disclosure - don't overwhelm with all questions at once
- Validate responses against existing docs if available
- If user skips optional sections, note as "TBD" in docs
- Keep interview conversational, not interrogative

