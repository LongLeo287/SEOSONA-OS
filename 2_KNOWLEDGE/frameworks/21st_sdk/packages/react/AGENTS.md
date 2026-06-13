# @an-sdk/react

React components for AI agent chat UIs — drop-in chat, tool renderers, and theming. Built on Vercel AI SDK v5.

## Docs

Full documentation: `./docs/` directory (8 guides covering the entire AN platform).

## Source

Source code: `./src/` directory.

## Key Entry Points

- `src/index.ts` — Barrel exports (all components and types)
- `src/an-agent-chat.tsx` — Main `<AnAgentChat>` drop-in component
- `src/create-an-chat.ts` — `createAnChat()` factory for AI SDK `Chat` instance
- `src/types.ts` — `AnTheme`, `AnClassNames`, `AnSlots`, `AnAgentChatProps`
- `src/theme.ts` — `applyTheme()` for CSS variable injection
- `src/components/` — Individual components (MessageList, InputBar, etc.)
- `src/tools/` — Tool renderers (BashTool, EditTool, etc.)
