---
name: "wp-auto-seo-pipeline"
description: "Architecture for building automated WordPress SEO pipelines. Features a robust separation of concerns (Generation vs Post-Processing) while strictly enforcing E-E-A-T and Information Gain to survive Google HCU."
keywords: ["wordpress", "automation", "content-generation", "eeat", "hcu", "pipeline"]
---

# WordPress Auto SEO Pipeline Architecture

## Overview
This skill defines the SEOSONA standard for building automated content generation pipelines (like plugins or external orchestrators) that target WordPress or any CMS. It takes the strong software-engineering concepts from traditional auto-spinners but strips out the fatal SEO flaws that cause "Helpful Content Update" (HCU) penalties.

## 1. Core Pipeline (The Good)

A robust automated system MUST separate generation from post-processing to avoid LLM hallucinations (like broken JSON-LD or invalid HTML).

**Phase 1: Profile & Context Assembly**
- Extract Search Intent, Target Keyword, LSI/Semantic Keywords.
- Load Brand Guidelines (Tone, Restrictions, CTAs).

**Phase 2: LLM Generation (Multi-Model Approach)**
- Do not lock into a single model (e.g., Vertex AI only).
- Use **OpenAI o1** or **Gemini 1.5 Pro** for Data Extraction and Structuring.
- Use **Claude 3.5 Sonnet** for the actual prose and Copywriting (most natural cadence).

**Phase 3: Post-Processing (Deterministic)**
- **Schema (JSON-LD)**: Inject schema programmatically via a script using the LLM's structured output variables. Do not ask the LLM to write raw JSON-LD inline with the article text.
- **HTML Sanitization**: Run a strict regex/HTML parser to fix broken tags `<h2>`, `<ul>`.
- **Background Worker**: Execute via Queue (Redis/BullMQ or WP-Cron) to prevent HTTP 504 timeouts.

---

## 2. E-E-A-T & Quality Hardening (The Fixes)

Traditional auto-spinners fail because they generate "Me-Too Content" (regurgitating TOP 3). You MUST implement the following nodes in your pipeline:

### 2.1 Information Gap Analysis (Anti "Me-Too" Content)
Before drafting the outline, the system must scrape the Top 3 competitors and run a Gap Analysis:
- *What questions did the Top 3 fail to answer?*
- *What unique angle can our Brand provide?*
The LLM must be explicitly instructed to include these "Information Gains" rather than just copying the competitor's heading structure.

### 2.2 SME Data Injection (Experience & Expertise)
Do not generate YMYL (Your Money or Your Life) content purely from internet scraped data.
- **RAG Requirement**: The Pipeline must accept an input vector (PDFs, internal data, expert interview transcripts).
- The LLM prompt must enforce: *"Cite the provided internal expert data exactly. Do not invent statistics."*

### 2.3 Semantic Internal Linking (Anti-Spam)
Do not use "Exact Match Keyword" auto-linking plugins.
- **Method**: Use Vector Embeddings to find semantically related published posts.
- **Anchor Text**: Use an LLM to select a natural, 3-5 word phrase to hyperlink, avoiding exact-match over-optimization penalties.

### 2.4 Media Policy
- **Avoid AI Slop**: Do not auto-generate featured images with DALL-E/Midjourney for YMYL content. It reduces trust.
- **Method**: Pull from a curated, brand-approved Media Library or use premium API stock integration (with real human subjects).
