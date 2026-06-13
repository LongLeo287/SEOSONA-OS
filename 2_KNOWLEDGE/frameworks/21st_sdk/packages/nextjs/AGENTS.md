# @an-sdk/nextjs

Next.js integration for AN agent chat — server-side token handler so your API key never reaches the browser.

## Docs

Full documentation: `./docs/` directory (8 guides covering the entire AN platform).

## Source

Source code: `./src/` directory.

## Key Entry Points

- `src/index.ts` — Re-exports everything from `@an-sdk/react`
- `src/server.ts` — `exchangeToken()` and `createAnTokenHandler()` for Next.js API routes

## Two Entry Points

- `@an-sdk/nextjs` — Client-side: all React components from `@an-sdk/react`
- `@an-sdk/nextjs/server` — Server-side: token exchange (Node.js only)
