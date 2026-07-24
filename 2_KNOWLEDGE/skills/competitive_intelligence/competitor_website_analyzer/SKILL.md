---
name: "competitor_website_analyzer"
description: "Clones and analyzes competitor websites to extract UI/UX tokens, typography, color palettes, and component structures."
version: "1.0.0"
author: "SEOSONA OS"
tags: ["competitive-intelligence", "frontend", "ui-ux", "cloning", "marketing"]
mcp_compatible: true
---

# 🛠️ Skill: Competitor Website Analyzer (Cloning Pipeline)

> **Purpose**: Automates the breakdown of a competitor's landing page. It converts the visual webpage into structural components and extracts a design system (colors, fonts, spacing) for reference.

## 📥 Inputs & Requirements
- **Dependencies**: Firecrawl MCP Server, Playwright, LLM Vision capabilities.
- **Input Format**: `{ "url": "https://competitor.com", "deep_clone": boolean }`

## 🧠 Execution Steps (The Method)
1. **Visual & DOM Capture**:
   - Use Playwright/Firecrawl to capture a full-page screenshot.
   - Extract the raw HTML DOM and CSS stylesheets.
2. **Design System Extraction**:
   - Parse CSS variables and computed styles to extract Color Palette (Primary, Secondary, Background).
   - Extract Typography (Font families, sizes, weights).
   - Identify spacing patterns (Tailwind equivalent classes if possible).
3. **Component Breakdown**:
   - Pass the full-page screenshot and DOM to the Vision LLM.
   - Ask the LLM to identify distinct semantic sections (Hero, Features, Pricing, Footer).
4. **Code Generation** (If `deep_clone` is true):
   - Instruct the LLM to write a generic React/Tailwind skeleton replicating the identified layout structure.
5. **Output**: Save the analysis as a Markdown report and the cloned skeleton as `.tsx` files in a designated scratchpad folder.

## 🛡️ Cognitive Guardrails
- **DO NOT**: Perform destructive scraping (e.g., DDOS-like rapid requests). Always respect `robots.txt` and use sensible rate limits.
- **DO NOT**: Copy proprietary imagery or branding assets. Extract structural layout and generic design tokens only.

## ✅ Quality Validation Criteria (MANDATORY)
*Before outputting "TASK COMPLETED", the agent MUST self-verify against these criteria:*
- [ ] Criteria 1: The extracted design system (colors, fonts) is formatted clearly.
- [ ] Criteria 2: Component breakdown matches the visual hierarchy of the actual page.
- [ ] Criteria 3: If `deep_clone` is true, the generated code does not contain hardcoded proprietary text/images from the competitor.

## 💻 Example Invocation (System Prompt Fragment)
```markdown
<skill_usage_example>
User: "Phân tích giao diện trang chủ của đối thủ này: https://competitor.com"
Action: Execute `competitor_website_analyzer` with input `{ "url": "https://competitor.com", "deep_clone": true }`
Result: "[Design system report and cloned React components generated]"
</skill_usage_example>
```
