# REPO INGESTION SOP: I/O Workflow

This document explicitly defines the Input/Output pipeline for handling external repositories and links submitted to SEOSONA OS. It enforces strict separation between raw candidate links and distilled knowledge.

## I/O Workflow

1. **[INPUT] Link Submission**
   - The User submits a raw URL (e.g., GitHub, Blog, Documentation).
   - *Status:* The link is temporarily held in context. It is NOT saved yet.

2. **[FILTER] UAP Triage (Universal Assimilation Protocol)**
   - The Agent fetches the README or webpage.
   - The Agent evaluates the repository for value, architecture, and relevance.
   - **Rejection Rule:** If the link is a 404, low-quality, or irrelevant, the workflow HALTS immediately. **The link is completely discarded and NEVER written to the filesystem.**

3. **[OUTPUT 1: KNOWLEDGE] Methodology Extraction**
   - If the repository passes the filter, its core methodology is extracted and written to `2_KNOWLEDGE/raw_data/ai_agents_repository_waveX.md`.
   - Actionable workflows are autonomously spawned as `.md` Skills in `2_KNOWLEDGE/frameworks/`.

4. **[OUTPUT 2: REGISTRY] Link Registration**
   - The original URL MUST be appended to the appropriate categorized `.txt` file inside `5_RESEARCH/`.
   - **Allowed Categories:**
     - `ai_agents_and_llms.txt`
     - `frontend_and_uiux.txt`
     - `data_and_scraping.txt`
     - `backend_and_devops.txt`
     - `marketing_and_seo.txt`
   - *Rationale:* `5_RESEARCH` serves as the official registry of *successfully ingested* repositories.

5. **[COMMIT] System Rebuild**
   - The Knowledge Graph must be rebuilt (`knowledge_graph.py --build`) to index the new Skills and raw data.
   - The completion is logged via `memory_logger.py`.

6. **[ANTI-BLOAT] Media Rejection Rule**
   - Agents fetching or cloning repositories MUST NEVER ingest multimedia files (`*.mp4`, `*.gif`, `*.png`, etc.).
   - The OS brain (RAG and Knowledge Graph) relies purely on Text (`.md`, `.py`, `.json`). All visual assets must be stripped during the Triage phase to prevent system bloat.
