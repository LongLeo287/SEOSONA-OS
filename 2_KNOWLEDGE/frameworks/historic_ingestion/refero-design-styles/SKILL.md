---

name: "refero-design-styles"
description: "Refero Styles is a massive library containing over 2,000+ AI-readable design systems (`DESIGN.md`). It bridges the gap between human UI/UX taste and agentic code generation by translating the aesthetics of leading product websites (like Apple, Stripe, Linear, Mercury, Monad) into structured markdown"
keywords: ["refero-design-styles", "ingested"]
mcp_compatible: true
---

# Refero Styles - AI Agent Design System Library

**Source:** http~/.seosona/path/
**Date Ingested:** 2026-06-12

## 1. Core Concept
Refero Styles is a massive library containing over 2,000+ AI-readable design systems (`DESIGN.md`). It bridges the gap between human UI/UX taste and agentic code generation by translating the aesthetics of leading product websites (like Apple, Stripe, Linear, Mercury, Monad) into structured markdown rules that agents can natively read and apply.

## 2. Key Features
- **Curated DESIGN.md Files:** Each brand style includes predefined colors, typography, spacing, components, and strict design rules.
- **Agent Compatibility:** The extracted `DESIGN.md` files are mathematically optimized for ingestion by AI IDEs and agents like Antigravity, Cursor, Claude Code, and v0.
- **Refero MCP (Model Context Protocol):** Refero offers an MCP server that allows coding agents to search, study, and pull real product screens and full user flows directly into their context window *before* they start building.

## 3. SEOSONA OS Implementation Strategy
When working on `Website SEOSONA` or generating any frontend UI components, the system must adhere to the following protocol:
1. **Never Guess the Design System:** If a specific premium aesthetic is requested (e.g., "make it look like Linear", "use a cinematic darkroom style like monopo saigon", or "build a clean interface like Vercel"), the system should fetch the corresponding `DESIGN.md` from Refero or use the Refero MCP to study the exact tokens.
2. **Standardize Component Generation:** Always inject the ingested design tokens (colors, typography, spacing) from the chosen Refero style into the system's memory before generating React/Next.js/MagicUI components.
3. **Continuous UI/UX Learning:** The system should treat Refero as its primary visual cortex for high-end web design.
