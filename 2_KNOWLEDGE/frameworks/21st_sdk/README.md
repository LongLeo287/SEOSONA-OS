# 21st Agents SDK

Open-source SDK, runtime, and service code for building, deploying, and embedding 21st Agents.

Agent examples live in [21st-dev/21st-sdk-examples](https://github.com/21st-dev/21st-sdk-examples).

## Architecture

```text
Agent source
  -> @21st-sdk/cli bundles and deploys it
  -> apps/agents-web stores configs, API keys, docs, and dashboard state
  -> apps/relay authenticates requests, creates sandboxes, and streams runs
  -> packages/agent-runtime runs inside E2B/OpenSandbox
  -> apps/proxy validates sandbox JWTs and forwards model API calls
  -> @21st-sdk/react/nextjs/node/python embed or call the deployed agent
```

The runtime sandbox must be able to call both `RELAY_URL` and `CLAUDE_PROXY_URL`.
If the sandbox runs remotely, `localhost` will not work for those values; expose
local relay/proxy with ngrok, an AWS tunnel, or another public/internal tunnel.

## Packages

| Path | Package | Purpose |
| --- | --- | --- |
| `packages/agent` | `@21st-sdk/agent` | Agent and tool definition helpers |
| `packages/react` | `@21st-sdk/react` | React chat UI components and tool renderers |
| `packages/node` | `@21st-sdk/node` | Server-side API client |
| `packages/nextjs` | `@21st-sdk/nextjs` | Next.js integration and token handler |
| `packages/cli` | `@21st-sdk/cli` | Agent deploy and management CLI |
| `packages/python-sdk` | `21st-sdk` | Python API client |
| `packages/agent-runtime` | `@21st-sdk/agent-runtime` | Sandbox runtime for executing deployed agents |
| `packages/sandbox-provider` | `@repo/sandbox-provider` | Stream transformers and sandbox provider helpers |
| `packages/api-key-security` | `@repo/api-key-security` | Shared API key prefixing and hashing helpers |

## Apps

| Path | Purpose |
| --- | --- |
| `apps/agents-web` | Agents dashboard, docs, deploy API, and web UI |
| `apps/relay` | Relay service for chat, sandbox lifecycle, streams, and tokens |
| `apps/proxy` | Model API proxy used by sandbox runtimes |

## Local Setup

Install dependencies:

```bash
pnpm install
```

For SDK-only work:

```bash
pnpm build
pnpm ts:check
```

Root `build` and `ts:check` are intentionally scoped to `packages/*`. Service
apps have their own env and deployment requirements.

For a full local stack, create `.env` files for each service, then start them in
separate terminals:

```bash
cp apps/agents-web/.env.example apps/agents-web/.env
cp apps/relay/.env.example apps/relay/.env
cp apps/proxy/.env.example apps/proxy/.env

# Optional local Redis, if you are not using a hosted REDIS_URL
docker run --rm -p 6379:6379 redis:7

# Terminal 1: model proxy
PORT=3003 pnpm --filter proxy dev

# Terminal 2: relay
PORT=3002 pnpm --filter relay dev

# Terminal 3: web app
pnpm --filter agents-web dev
```

Minimum env groups:

| Service | Key env vars |
| --- | --- |
| `apps/agents-web` | `DATABASE_URL`, `DIRECT_DATABASE_URL`, auth provider env, `NEXT_PUBLIC_APP_URL=http://localhost:3000`, `NEXT_PUBLIC_RELAY_URL=http://localhost:3002` or tunnel URL |
| `apps/relay` | `PORT=3002`, `DATABASE_URL`, `REDIS_URL`, `AN_JWT_SECRET`, `CLAUDE_PROXY_PRIVATE_JWT`, `CLAUDE_PROXY_URL`, `RELAY_URL`, plus either `E2B_API_KEY`/`RELAY_SANDBOX_TEMPLATE` or `OPENSANDBOX_*` |
| `apps/proxy` | `PORT=3003`, `DATABASE_URL`, `JWT_PUBLIC_KEY`, `ANTHROPIC_API_KEY`, optional `OPENAI_API_KEY`/`OPENROUTER_API_KEY` |

When using remote E2B/OpenSandbox from a local machine, set:

```bash
RELAY_URL=https://<relay-tunnel>
CLAUDE_PROXY_URL=https://<proxy-tunnel>
NEXT_PUBLIC_RELAY_URL=https://<relay-tunnel>
```

For production-style self-hosting, start from `apps/agents-web/infra`.
