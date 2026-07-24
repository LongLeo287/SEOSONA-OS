# KI: voltagent/voltagent

## Overview
VoltAgent is an open-source **TypeScript framework for building and orchestrating AI agents** with memory, tools, sub-agent delegation, and real-time observability. It provides a modular, provider-agnostic architecture where agents can use any LLM (via Vercel AI SDK integration), maintain conversational memory, call external tools, and delegate tasks to sub-agents. Comes with a companion web console (VoltOps) for live monitoring of agent interactions, token usage, and traces.

## Architecture & Tech Stack
- **Language:** TypeScript (strict mode)
- **Monorepo:** Lerna + pnpm workspaces + Nx for task orchestration
- **Core Packages:**
  - `@voltagent/core` — Agent runtime: agent definition, tool registry, memory management, sub-agent orchestration
  - `@voltagent/server` — HTTP server that exposes agents via REST/WebSocket endpoints for the VoltOps console
  - `@voltagent/voice` — Voice agent capabilities (speech-to-text, text-to-speech integration)
  - `@voltagent/vercel-ai` — Vercel AI SDK provider adapter (use any AI SDK-compatible model)
  - `@voltagent/xsai` — Alternative lightweight AI provider
  - `@voltagent/supabase-memory` — Persistent memory backed by Supabase (PostgreSQL + pgvector)
  - `@voltagent/mongodb-memory` — Persistent memory backed by MongoDB
  - `@voltagent/upstash-memory` — Serverless memory backed by Upstash Redis
  - `create-voltagent-app` — CLI scaffolding tool (`npm create voltagent-app@latest`)
- **Build System:** tsup (ES module bundler), Vitest (testing), Biome (linting/formatting)
- **Observability:** Built-in OpenTelemetry tracing, VoltOps web console at `console.voltagent.dev`
- **Node.js:** Requires Node >= 20, pnpm >= 8

## Core Capabilities
1. **Agent Definition & Lifecycle:** Define agents with a name, instructions (system prompt), LLM provider, tools, and memory. Agents handle multi-turn conversations with automatic context management.
2. **Tool System:** Register tools with typed parameters (Zod schemas). The agent automatically decides when to call tools and processes results. Tools can be sync or async.
3. **Sub-Agent Delegation:** Agents can spawn and delegate tasks to specialized sub-agents. Each sub-agent has its own tools and instructions. The parent agent orchestrates the workflow.
4. **Memory Providers:** Pluggable memory backends for conversation persistence:
   - In-memory (default, ephemeral)
   - Supabase (PostgreSQL + vector search for RAG)
   - MongoDB
   - Upstash Redis (serverless)
5. **Multi-Provider LLM Support:** Use any LLM through the Vercel AI SDK adapter. Switch between OpenAI, Anthropic, Google, Groq, etc. without code changes.
6. **Voice Agents:** Built-in support for voice interactions with speech-to-text and text-to-speech providers.
7. **Real-Time Observability (VoltOps Console):** Web-based dashboard showing live agent interactions, message history, tool call traces, token usage, and latency metrics.
8. **HTTP Server & API:** Automatic REST endpoint exposure for each agent. WebSocket support for real-time streaming.
9. **Hooks & Middleware:** Lifecycle hooks (`onStart`, `onEnd`, `onToolCall`, `onError`) for custom logic injection at every stage of agent execution.
10. **Type Safety:** Full TypeScript generics throughout. Tool parameters, memory schemas, and agent configurations are all type-checked at compile time.

## API Surface & Integration Points
```typescript
import { VoltAgent, Agent } from "@voltagent/core";
import { VercelAIProvider } from "@voltagent/vercel-ai";
import { openai } from "@ai-sdk/openai";

// Define an agent
const agent = new Agent({
  name: "research-agent",
  instructions: "You are a research assistant. Use tools to find information.",
  llm: new VercelAIProvider(),
  model: openai("gpt-4o"),
  tools: [webSearchTool, fileReaderTool],
  subAgents: [summaryAgent, factCheckAgent],
});

// Start the server
new VoltAgent({ agents: { agent } });
// Agent is now accessible via REST API and VoltOps console
```

**CLI Quick Start:**
```bash
npm create voltagent-app@latest
cd my-agent
pnpm dev
# Open https://console.voltagent.dev to interact
```

## Key Design Patterns
1. **Provider Adapter Pattern:** LLM providers are wrapped in adapters (`VercelAIProvider`, `XsaiProvider`) that conform to a common interface, enabling hot-swapping.
2. **Registry Pattern:** Agents and tools are registered in a central registry, allowing dynamic discovery and routing.
3. **Pluggable Memory Architecture:** Memory is abstracted behind an interface. Any storage backend can be used by implementing `MemoryProvider`.
4. **Agent-as-a-Service:** Each agent is automatically exposed as an HTTP endpoint, making it deployable as a microservice.
5. **Monorepo with Independent Versioning:** Each package has its own version, changelog, and publish cycle via Changesets.
6. **Safety Convention:** `JSON.stringify` is banned project-wide; `safeStringify` from `@voltagent/internal` must be used instead to prevent circular reference crashes.

## Relevance to SEOSONA OS
- **Agent Orchestration Model:** VoltAgent's sub-agent delegation pattern directly maps to SEOSONA's multi-agent architecture (UAP sub-agents, Skill Creator agents, etc.). SEOSONA could adopt VoltAgent's agent definition pattern.
- **Memory Architecture:** The pluggable memory backends (especially Supabase with pgvector) could enhance SEOSONA's MemPalace system with persistent vector search for RAG.
- **Tool Registry → Skill Registry:** VoltAgent's tool system is analogous to SEOSONA's Skill system. Each SEOSONA Skill could be registered as a VoltAgent tool.
- **Observability Console → Command Center:** VoltAgent's VoltOps console concept aligns with SEOSONA's OpenClaw Command Center — both provide real-time visibility into agent operations.
- **Voice Agent Integration:** VoltAgent's voice capabilities could power SEOSONA's future voice-interactive features.

## Quick Start
```bash
npm create voltagent-app@latest
cd my-agent-app
pnpm install
pnpm dev
```
Navigate to [console.voltagent.dev](https://console.voltagent.dev) to interact with your agent.
