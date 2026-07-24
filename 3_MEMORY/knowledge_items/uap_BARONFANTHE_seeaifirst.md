# KI: BARONFANTHE/seeaifirst

## Overview
**The Opinionated AI Stack Guide — with receipts.**

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 81 files across 68 directories
- **File types:** .html: 61, .json: 7, .js: 4, .yml: 3, .md: 2, .gitignore: 1, .png: 1
- **Dev dependencies:** canvas

## Core Capabilities
- 🗂️ **13 categories** across 5 layers: Foundation → Coordination → Capability → Application → Trends
- 🔍 **Search** across names, descriptions, and details (Ctrl+K)
- 🔗 **Deep linking** — every tool has a permanent URL via path-based routing
- ⚖️ **Compare Mode** — side-by-side tool comparisons with preset and custom selections
- 🎯 **Tool Picker** — interactive selection for building your AI stack
- 📊 **Enriched metadata** — pricing, deployment, difficulty, compatibility, use cases
- 🌗 **Dark/Light theme**
- 📱 **Mobile responsive**
- ⚡ **Zero backend** — static HTML + JSON on CDN, loads instantly

## Documentation Sections
- 🧠 See AI First
- Why This Exists
- Features
- Usage
- Quick Start
- Open http://localhost:8000
- Project Structure
- Data
- Selection Criteria
- Contributing
- Tech Stack
- License

## Core Structure
```
  .gitignore
  CONTRIBUTING.md
  LICENSE
  README.md
  data.json
  data.vi.json
  hot-right-now.json
  index.html
  og-image.png
  package.json
  robots.txt
  sitemap.xml
  vercel.json
  .github/
    ISSUE_TEMPLATE/
      suggest-tool.yml
    workflows/
      cip-0-artifacts-integrity.yml
      cip-1-structured-facts-refresh.yml
  ai-cost-calculator/
    index.html
  compare/
    coding-agents/
      index.html
    frameworks/
      index.html
    rag-systems/
      index.html
    vector-databases/
      index.html
  data/
    ai-pricing.json
  scripts/
    cip-1-facts-refresh.js
    cip-1-repo-overrides.json
    generate-shells.js
    generate-sitemap.js
    validate.js
  section/
    coding-agents/
      index.html
    frameworks/
      index.html
    infrastructure/
      index.html
    memory/
      index.html
    observability/
      index.html
    orchestration/
      index.html
    platforms/
      index.html
    protocols/
      index.html
    rag-systems/
      index.html
    security/
      index.html
    skills/
      index.html
    trends/
      index.html
    vector-databases/
      index.html
  tool/
    a2a/
      index.html
    agents-wshobson/
      index.html
    ai-drug-discovery/
      index.html
    ai-governance/
      index.html
    ai-infrastructure/
      index.html
    arize-phoenix/
      index.html
    autogen/
      index.html
    browser-use/
      index.html
    chatgpt/
      index.html
    chinese-open-source-ai/
      index.html
    chroma/
      index.html
    claude-ai/
      index.html
    claude-code/
      index.html
    claude-flow/
      index.html
    claude-mem/
      index.html
    claude-squad/
      index.html
    cline-roocode/
      index.html
    codex-cli/
      index.html
    crewai/
      index.html
    cursor/
      index.html
    deepeval/
      index.html
    dify/
      index.html
    flowise/
      index.html
    garak/
      index.html
    gemini-cli/
      index.html
    generative-coding/
      index.html
    github-copilot/
      index.html
    google-adk/
      index.html
    goose/
      index.html
    guardrails-ai/
      index.html
    he-thong-memory-khac/
      index.html
    kiro-aws/
      index.html
    langfuse/
      index.html
    langgraph/
      index.html
    langsmith/
      index.html
    lightrag/
      index.html
    litellm/
      index.html
    llamaindex/
      index.html
    localai/
      index.html
    mastra/
      index.html
    mcp/
      index.html
    mechanistic-int
```

## Quick Start
```bash
git clone https://github.com/BARONFANTHE/seeaifirst.git
cd seeaifirst
python -m http.server 8000
seeaifirst/
├── index.html          # UI + CSS + JS (single file)
├── data.json           # 66 tools, 13 sections, 5 layers
├── og-image.png        # Social preview image
├── sitemap.xml         # SEO sitemap
├── robots.txt          # SEO robots
├── package.json        # npm config (for validator)
```

## Agent Configuration

--- CONTRIBUTING.md ---
# Contributing to See AI First

Thank you for your interest in contributing! See AI First is a curated directory of AI developer tools, and community input helps keep it accurate and comprehensive.

## Ways to Contribute

### 1. Suggest a Tool

The easiest way to contribute — no coding required.

→ [Open a "Suggest a Tool" issue](https://github.com/BARONFANTHE/seeaifirst/issues/new?template=suggest-tool.yml)

We'll review your suggestion against our evaluation criteria and add it if it qualifies.

### 2. Report a Bug

Found a broken link, incorrect data, or UI issue?

→ [Open a bug report](https://github.com/BARONFANTHE/seeaifirst/issues/new)

Please include: what you expected, what happened, and browser/device info if relevant.

### 3. Improve Data via Pull Request

For experienced contributors who want to directly update tool data.

**Before submitting a PR:**

1. Fork the repo and create a branch from `main`
2. Edit `data.json` only — do not modify `index.html` or other files
3. One tool per PR — keep changes small and reviewable
4. Run the validator: `npm install && node scripts/validate.js` (must show 8/8 PASS)
5. Test locally: `python -m http.server 8000` then open `http://localhost:8000`
6. Submit your PR with a clear description of what changed and why

## Tool Evaluation Criteria

Not every tool belongs here. We evaluate suggestions against 5 criteria:

| Criteria | Minimum Threshold |
|----------|-------------------|
| **GitHub Stars** | Usually >5K ⭐ — exceptions allowed for innovative tools with strong rationale + evidence |
| **Relevance** | Must be part of the AI developer ecosystem |
| **Maturity** | Has documentation, active development, community |
| **Uniqueness** | Does not duplicate an existing card's functionality |
| **Category Fit** | Fits within existing 13 sections (new sections require strong justification) |

## Data Format

Each tool is a card in `data.json`. Here's an example:

```json
{
  "name": "Tool Name",
  "slug": "tool-name",
  "d


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
