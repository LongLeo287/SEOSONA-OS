FROM node:22-slim AS base
RUN corepack enable && corepack prepare pnpm@8.15.6 --activate
WORKDIR /app

FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/relay/package.json ./apps/relay/
COPY packages/api-key-security/package.json ./packages/api-key-security/
COPY packages/sandbox-provider/package.json ./packages/sandbox-provider/
RUN pnpm install --filter relay... --frozen-lockfile

FROM base AS runner
ARG VAULT_PROXY_URL=""
ENV VAULT_PROXY_URL=$VAULT_PROXY_URL
RUN apt-get update \
  && apt-get install -y --no-install-recommends git \
  && rm -rf /var/lib/apt/lists/*
COPY --from=deps /app ./
COPY apps/relay/package.json ./apps/relay/
COPY apps/relay/tsconfig.json ./apps/relay/
COPY apps/relay/src ./apps/relay/src
COPY packages/api-key-security/package.json ./packages/api-key-security/
COPY packages/api-key-security/tsconfig.json ./packages/api-key-security/
COPY packages/api-key-security/src ./packages/api-key-security/src
COPY packages/sandbox-provider/package.json ./packages/sandbox-provider/
COPY packages/sandbox-provider/src ./packages/sandbox-provider/src
WORKDIR /app/apps/relay
EXPOSE 3000
CMD ["pnpm", "start"]
