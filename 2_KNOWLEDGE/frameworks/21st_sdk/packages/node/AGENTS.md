# @an-sdk/node

Server-side Node.js SDK for AN — sandbox management, thread CRUD, and token exchange.

## Docs

Full documentation: `./docs/` directory (8 guides covering the entire AN platform).

## Source

Source code: `./src/` directory.

## Key Entry Points

- `src/index.ts` — Barrel exports (`AnClient`, all types)
- `src/client.ts` — `AnClient` class with `.sandboxes`, `.threads`, `.tokens` resources
- `src/types.ts` — All type definitions (`Sandbox`, `Thread`, `Token`, etc.)
