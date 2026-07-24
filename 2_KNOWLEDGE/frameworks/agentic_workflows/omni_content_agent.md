---
type: workflow
name: Omni-Channel Content Agent
version: 1.0.0
description: Fully autonomous pipeline for data ingestion, content creation, and omnichannel publishing utilizing 9 core technologies.
tags: [agentic, orchestration, seo, content, multichannel, ai]
---

# Omni-Channel Content Agent Workflow

This skill defines the autonomous standard operating procedure (SOP) for the SEOSONA OS to run a multi-agent orchestration pipeline. This pipeline generates high-value SEO content and multimedia without human intervention.

## 1. Trigger & Orchestration (LangGraph + LangChain)
- **Invocation:** Triggered by the Intent Router when a user inputs a seed topic (e.g., "Build a Topic Cluster for 'Dịch vụ SEO'").
- **Orchestration:** `LangGraph` initializes a new Stateful Agent execution graph.
- **State Initialization:** The agent provisions an embedded memory space in `SeekDB` using the Copy-on-Write (COW) sandbox `FORK DATABASE` command. All temporary thoughts and drafts are stored here.

## 2. Reconnaissance & Indexing (Katana + Knowledge Catalog)
- **Data Scraping:** The `Katana` reconnaissance agent is dispatched in Headless Mode to crawl the top 10 Google results for the seed keyword.
- **Extraction:** It extracts Semantic LSI Keywords, H1-H6 structures, and FAQs using its internal ML classification capabilities.
- **Indexing:** The raw scraped data is pipelined into the Google Cloud `Knowledge Catalog` to provide dynamic semantics and business context to the content agents.

## 3. Content Production (LangChain + Sonatools AI)
- **Drafting:** `LangChain` agents query the `Knowledge Catalog` and `SeekDB` to draft 5 interconnected pillar/cluster articles.
- **Compliance:** Articles are automatically aligned with Google's Helpful Content & E-E-A-T standards (enforcing expertise citations and experience markers).

## 4. Multimedia Generation (Fish-Speech + Skill-Autoshorts)
- **TTS Generation:** The `Fish-Speech` Dual-AR TTS agent converts article summaries into natural, multi-speaker audio streams using inline tags (e.g., `[whisper]`, `[laughing]`).
- **Video Assembly:** `Skill-Autoshorts` ingests the audio and text to automatically generate 9:16 vertical short-form clips, complete with Whisper-aligned captions and dynamic hooks.

## 5. Omnichannel Publishing (Papermark + ZCA-Bridge)
- **Document Publishing:** Long-form content is compiled into secure documents and shared via `Papermark` with built-in analytics.
- **Broadcast & Social:** `ZCA-Bridge` pushes immediate notifications to internal Zalo/Chatwoot teams and publishes the generated short videos across TikTok, Instagram Reels, and YouTube Shorts.

## 6. State Commit & Cleanup (SeekDB)
- **Verification:** The Orchestrator verifies that all nodes have successfully completed.
- **Commit:** The `SeekDB` sandbox is merged into the mainline database using `MERGE TABLE STRATEGY OURS`.
- **Termination:** The agent graph completes its execution and shuts down gracefully.
