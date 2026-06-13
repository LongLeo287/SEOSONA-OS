# syntax=docker/dockerfile:1.7

FROM node:22-bookworm-slim AS base

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
ENV NEXT_TELEMETRY_DISABLED=1

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@8.15.6 --activate

WORKDIR /app

FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/agents-web/package.json ./apps/agents-web/
COPY packages/an-sdk/agent/package.json ./packages/an-sdk/agent/
COPY packages/an-sdk/nextjs/package.json ./packages/an-sdk/nextjs/
COPY packages/an-sdk/node/package.json ./packages/an-sdk/node/
COPY packages/an-sdk/react/package.json ./packages/an-sdk/react/
COPY packages/api-key-security/package.json ./packages/api-key-security/
COPY packages/sandbox-provider/package.json ./packages/sandbox-provider/
COPY packages/ui/package.json ./packages/ui/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/eslint-config/package.json ./packages/eslint-config/

RUN pnpm install --filter agents-web... --frozen-lockfile --ignore-scripts

FROM base AS build
ENV NODE_ENV=production
ENV NODE_OPTIONS=--max-old-space-size=4096

COPY --from=deps /app /app
COPY apps/agents-web ./apps/agents-web
COPY packages/an-sdk/agent ./packages/an-sdk/agent
COPY packages/an-sdk/nextjs ./packages/an-sdk/nextjs
COPY packages/an-sdk/node ./packages/an-sdk/node
COPY packages/an-sdk/react ./packages/an-sdk/react
COPY packages/api-key-security ./packages/api-key-security
COPY packages/sandbox-provider ./packages/sandbox-provider
COPY packages/ui ./packages/ui
COPY packages/typescript-config ./packages/typescript-config
COPY packages/eslint-config ./packages/eslint-config

WORKDIR /app/apps/agents-web

RUN pnpm --filter @21st-sdk/node build
RUN --mount=type=secret,id=agents_web_env,target=/app/apps/agents-web/.env \
    pnpm exec prisma generate --schema=./prisma/schema.prisma
RUN --mount=type=secret,id=agents_web_env,target=/app/apps/agents-web/.env \
    pnpm exec next build --webpack
RUN node - <<'NODE'
const fs = require("fs")
const path = require("path")

const workspaceRoot = "/app"
const appRoot = "/app/apps/agents-web"
const standaloneRoot = path.join(appRoot, ".next/standalone")
const nextPkg = require.resolve("next/package.json", { paths: [appRoot] })
const browserLogsDir = path.join(path.dirname(nextPkg), "dist/server/dev/browser-logs")

function patchStandaloneNextPackage(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      patchStandaloneNextPackage(fullPath)
      continue
    }

    if (
      entry.isFile() &&
      entry.name === "console-file.js" &&
      fullPath.includes(`${path.sep}next${path.sep}dist${path.sep}server${path.sep}node-environment-extensions${path.sep}`)
    ) {
      const targetDir = path.resolve(path.dirname(fullPath), "..", "dev", "browser-logs")
      fs.mkdirSync(path.dirname(targetDir), { recursive: true })
      fs.cpSync(browserLogsDir, targetDir, { recursive: true })
    }
  }
}

patchStandaloneNextPackage(standaloneRoot)
console.log(`Patched standalone Next runtime from ${browserLogsDir}`)
NODE

FROM base AS runner

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

COPY --from=build /app/apps/agents-web/.next/standalone ./
COPY --from=build /app/apps/agents-web/.next/static ./apps/agents-web/.next/static
COPY --from=build /app/apps/agents-web/public ./apps/agents-web/public

EXPOSE 3000

CMD ["node", "apps/agents-web/server.js"]
