---
name: "tactical_memory_flow"
description: "A 3-layer architecture (MemPalace) and System B tactical flow to manage massive contexts without LLM hallucination or context window degradation."
keywords: ["memory", "mempalace", "context", "system-b", "omniclaw", "flow"]
---

# Tactical Memory Flow & MemPalace (OmniClaw Method)

This framework describes how to manage vast amounts of knowledge (like massive codebases or corporate SEO data) without overwhelming the AI's context window.

## The MemPalace 3-Layer Architecture

1. **Layer 1: RAW Drawers (Code Preservation)**
   - Raw `*.md` and `*.py` files. These are *never* blindly fed into conversational LLMs. They are only read purely by specialized scripts for extraction or semantic search.
2. **Layer 2: AAAK Closets (Minified Summaries)**
   - All extensive conversational logic and large files are compressed by a dedicated `mempalace_agent` into lightweight `.aaak` (or JSON/Markdown) summaries. Topics, Entities, and logic are squashed to the absolute minimum viable tokens.
3. **Layer 3: Graph Navigation (Local Structure)**
   - The Global Routing mechanism (OMA) points agents to the exact "Closet" rather than letting them wander through the entire filesystem.

## System B: Tactical Memory Flow

When managing the interaction between a Master Orchestrator (CEO) and Sub-Agents (Departments):

- **Idea Incubation:** Sub-agents feed *Ideas* and *Logs* upward to the Orchestrator.
- **CEO's Inbox:** Instead of executing immediately, massive proposals are pushed to an "Inbox" (PR - Proposals) awaiting CEO permission.
- **The Ledger (Sổ Cái):** The Orchestrator maintains a Master Ledger. Once a decision is made, it overrides departmental priorities via this Ledger.
- **Heuristics Update:** Successful workflows are converted into analytical models/heuristics (P) and patched back to the system to permanently close operational "Gaps" (GA).

## Application in SEOSONA OS
Use this exact flow when building out the Knowledge Graph and orchestrating complex 10-step SEO deliverables. Always compress raw data into summaries (AAAK) and rely on the Knowledge Graph (Layer 3) to pull only the required nodes into the context window.
