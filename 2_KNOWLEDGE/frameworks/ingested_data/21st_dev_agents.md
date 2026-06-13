# 21st Agents SDK & Infrastructure

**Source:** https://21st.dev/agents/docs/ & https://github.com/21st-dev/21st-sdk
**Date Ingested:** 2026-06-12

## 1. Core Concept
The `21st Agents SDK` provides a complete, open-source, production-ready infrastructure to deploy AI agents. It eliminates the need to build runtime environments, sandboxing, streaming protocols, or chat UI from scratch.

## 2. Key Architecture & Packages
- **Client SDKs:**
  - `@21st-sdk/react`: Provides ready-to-use, beautiful React chat UI components.
  - `@21st-sdk/nextjs` / `@21st-sdk/node`: Handles secure token exchange and backend integrations.
- **Agent Definition:** `@21st-sdk/agent` provides helpers for defining agent instructions and tools.
- **Sandboxed Execution:** Agents run inside secure, isolated environments powered by E2B or OpenSandbox (`packages/agent-runtime`). This allows agents to safely execute code, manage files, and run terminal commands.
- **Microservices:**
  - `apps/relay`: Handles Server-Sent Events (SSE) streaming, sandbox lifecycle, and tokens.
  - `apps/proxy`: Securely forwards model API calls (Claude, OpenAI) so raw API keys are never exposed.

## 3. SEOSONA OS Integration Strategy
If `Website SEOSONA` or any future project requires embedding an interactive AI agent (e.g., a "Seosona Consultant Agent", an SEO analysis bot, or an interactive UI generator), SEOSONA OS **MUST** utilize this SDK rather than building from scratch.
1. Install `@21st-sdk/react` for the frontend Chat UI.
2. Define custom tools (web search, API calls) using the SDK's tool helpers.
3. Deploy the agent through the 21st CLI and embed the Next.js API routes to handle secure communication.
