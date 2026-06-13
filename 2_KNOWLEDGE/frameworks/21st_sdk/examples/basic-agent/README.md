# Basic Agent Example

A minimal AN agent that reviews code using ESLint.

## Setup

```bash
npm install
```

## Deploy

```bash
# Login with your API key (get one at https://an.dev/api-keys)
npx @an-sdk/cli login

# Deploy the agent
npx @an-sdk/cli deploy
```

The CLI will detect your agent in `agents/code-reviewer.ts`, bundle it, and deploy to the AN platform.

## What's happening

1. `agents/code-reviewer.ts` defines the agent using `@an-sdk/agent`
2. `an deploy` bundles the code and uploads it to AN
3. AN runs the agent in an isolated sandbox
4. You can interact with it via the AN dashboard or embed it in your app with `@an-sdk/react`
