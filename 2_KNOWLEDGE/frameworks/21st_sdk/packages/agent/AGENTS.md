# @an-sdk/agent

Config layer for defining AI agents and tools with full type inference.

## Docs

Full documentation: `./docs/` directory (8 guides covering the entire AN platform).

## Source

Source code: `./src/` directory.

## Key Entry Points

- `src/index.ts` — Barrel exports (`agent`, `tool`, all types)
- `src/agent.ts` — `agent()` factory function (sets defaults, returns `AgentConfig`)
- `src/tool.ts` — `tool()` factory function (returns `ToolDefinition<TInput>`)
- `src/types.ts` — All type definitions (`AgentConfig`, `ToolDefinition`, `ToolSet`, hooks)

## Quick Example

```ts
import { agent, tool } from "@an-sdk/agent"
import { z } from "zod"

export default agent({
  model: "claude-sonnet-4-6",
  systemPrompt: "You are a helpful assistant.",
  tools: {
    greet: tool({
      description: "Greet a user",
      inputSchema: z.object({ name: z.string() }),
      execute: async ({ name }) => ({
        content: [{ type: "text", text: `Hello, ${name}!` }],
      }),
    }),
  },
})
```
