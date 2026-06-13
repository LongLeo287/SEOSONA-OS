# @an-sdk/cli

CLI tool for deploying AI agents to the AN platform. Two commands: `an login` and `an deploy`.

## Docs

Full documentation: `./docs/` directory (8 guides covering the entire AN platform).

## Source

Source code: `./src/` directory.

## Key Entry Points

- `src/index.ts` — Command router (dispatches to login/deploy)
- `src/login.ts` — API key auth flow, saves to `~/.an/credentials`
- `src/deploy.ts` — Bundles agent code with esbuild, deploys to AN platform
- `src/config.ts` — Reads/writes credentials and project config
- `src/bundler.ts` — esbuild wrapper (externalizes `@an-sdk/agent`)
