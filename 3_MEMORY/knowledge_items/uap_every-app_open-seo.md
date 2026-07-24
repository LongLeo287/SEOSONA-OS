# KI: every-app/open-seo

## Overview
Repository with 1025 files across 181 directories. Primary language: TypeScript (486 files).

## Tech Stack (from code)
- TypeScript (486 files)
- TypeScript (React) (253 files)
- JavaScript (3 files)
- **Total:** 1025 files, 181 directories
- **File types:** .ts: 486, .tsx: 253, .md: 89, .json: 66, .sql: 53, .png: 19, .yaml: 9, .mdx: 8

## Public API / Exports
- `authClient` from `src\lib\auth-client.ts`
- `signOutAndRedirect` from `src\lib\auth-client.ts`
- `createBaseAuthConfig` from `src\lib\auth-config.ts`
- `getAuthMode` from `src\lib\auth-mode.ts`
- `isHostedAuthMode` from `src\lib\auth-mode.ts`
- `isHostedClientAuthMode` from `src\lib\auth-mode.ts`
- `isEmailVerificationBypassed` from `src\lib\auth-mode.ts`
- `HOSTED_PASSWORD_MIN_LENGTH` from `src\lib\auth-options.ts`
- `HOSTED_PASSWORD_MAX_LENGTH` from `src\lib\auth-options.ts`
- `userAdditionalFields` from `src\lib\auth-options.ts`
- `baseAuthOptions` from `src\lib\auth-options.ts`
- `normalizeAuthRedirect` from `src\lib\auth-redirect.ts`
- `getOAuthSignedQuery` from `src\lib\auth-redirect.ts`
- `getOAuthAuthorizeRedirectFromSearch` from `src\lib\auth-redirect.ts`
- `getAuthRedirectFromSearch` from `src\lib\auth-redirect.ts`
- `getCurrentAuthRedirect` from `src\lib\auth-redirect.ts`
- `getCurrentAuthRedirectFromHref` from `src\lib\auth-redirect.ts`
- `getSignInSearch` from `src\lib\auth-redirect.ts`
- `getVerifyEmailSearch` from `src\lib\auth-redirect.ts`
- `getSignInHref` from `src\lib\auth-redirect.ts`
- `getSignInHrefForLocation` from `src\lib\auth-redirect.ts`
- `getActiveOrganizationId` from `src\lib\auth-session.ts`
- `getHostedTurnstileSecretKey` from `src\lib\auth-turnstile.ts`
- `hasHostedTurnstileConfig` from `src\lib\auth-turnstile.ts`
- `MCP_SCOPE` from `src\lib\oauth-resource.ts`
- `MCP_OAUTH_SCOPES` from `src\lib\oauth-resource.ts`
- `getMcpResource` from `src\lib\oauth-resource.ts`
- `getRouter` from `src\router.tsx`
- `startInstance` from `src\start.ts`
- `HOSTED_PROD_STAGE` from `alchemy.access.ts`

## Imports Detected in Source
- `@/client`
- `@/db`
- `@/lib`
- `@/middleware`
- `@/server`
- `@/serverFunctions`
- `@/shared`
- `@cloudflare/vite-plugin`
- `@tailwindcss/vite`
- `@tanstack/devtools-vite`
- `@tanstack/react-router`
- `@tanstack/react-start`
- `@vitejs/plugin-react`
- `agents`
- `alchemy`
- `better-auth`
- `cloudflare:workers`
- `effect`
- `vite`
- `vite-tsconfig-paths`
- `vitest`
- `wrangler`
- `zod`

## File Structure
```
  .dockerignore
  .env.example
  .env.preview.example
  .env.production.example
  .gitignore
  .npmrc
  .oxlintrc.json
  .prettierignore
  AGENTS.md
  CLAUDE.md
  Dockerfile.selfhost
  LICENSE
  README.md
  alchemy.access.ts
  alchemy.preview-access.run.ts
  alchemy.run.ts
  cli-auth.ts
  compose.yaml
  drizzle-pg.config.ts
  drizzle-prod.config.ts
  drizzle.config.ts
  knip.jsonc
  package.json
  playwright.config.ts
  pnpm-lock.yaml
  pnpm-workspace.yaml
  skills-lock.json
  tsconfig.json
  vite-plugin-lean-worker-bundle.ts
  vite.config.ts
  vitest.config.ts
  worker-configuration.d.ts
  wrangler.jsonc
  .agents/
    PAPERCUTS.md
    skills/
      competitive-landscape/
        SKILL.md
      competitor-analysis/
        SKILL.md
      keyword-clustering/
        SKILL.md
      keyword-research/
        SKILL.md
      link-prospecting/
        SKILL.md
      maintain-greptile-rules/
        SKILL.md
        agents/
          openai.yaml
      merge-ready/
        SKILL.md
      openseo-release-notes/
        SKILL.md
      papercuts/
        SKILL.md
        agents/
          openai.yaml
      seo-coach/
        SKILL.md
      seo-project-setup/
        SKILL.md
      webapp-testing/
        LICENSE.txt
        SKILL.md
        scripts/
          with_server.py
  .claude/
    skills/
      webapp-testing
      merge-ready/
        SKILL.md
      openseo-release-notes/
        SKILL.md
      papercuts/
        SKILL.md
  .greptile/
    config.json
    files.json
    rules.md
  .opencode/
    opencode.jsonc
    command/
      release-notes.md
  badseo/
    .gitignore
    README.md
    package.json
    pnpm-lock.yaml
    pnpm-workspace.yaml
    tsconfig.json
    vite.config.ts
    wrangler.jsonc
    public/
      analytics.js
      openseo-logo.png
      styles.css
      img/
        placeholder.svg
    scripts/
      run-audit.ts
    src/
      lib.ts
      plausible.ts
      routeTree.gen.ts
      router.tsx
      components/
        site-layout.tsx
      routes/

```

## Key Source Excerpts
### vite.config.ts
```typescript
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig, loadEnv } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import { devtools } from "@tanstack/devtools-vite";
import { leanWorkerBundle } from "./vite-plugin-lean-worker-bundle";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const port = process.env.PORT
    ? Number(process.env.PORT)
    : env.PORT
      ? Number(env.PORT)
      : 3001;
  const showDevtools = env.VITE_SHOW_DEVTOOLS !== "false";
  const allowedHosts = [
    env.ALLOWED_HOST,
    env.BETTER_AUTH_URL ? new URL(env.BETTER_AUTH_URL).hostname : undefined,
  ].filter((host): host is string => Boolean(host));
  const emitSourcemaps = env.POSTHOG_SOURCEMAPS === "true";

  return {
    envPrefix: [
      "VITE_",
      "AUTH_MODE",
      "BYPASS_EMAIL_VERIFICATION",
      "POSTHOG_PUBLIC_KEY",
      "POSTHOG_HOST",
      "TURNSTILE_SITE_KEY",
    ],
    server: {
      allowedHosts,
      port,
    },
    preview: {
      allowedHosts,
      port,
    },
    build: {
      sourcemap: emitSourcemaps,
      outDir: emitSourcemaps ? "dist-sourcemaps" : "dist",
    },
    plugins: [
      leanWorkerBundle(),
      showDevtools
        ? devtools({
            consolePiping: {
              enabled: true,
              levels: ["l
```

### src\lib\auth-client.ts
```typescript
import { createAuthClient } from "better-auth/react";
import {
  genericOAuthClient,
  inferAdditionalFields,
  organizationClient,
} from "better-auth/client/plugins";
import { captureClientEvent, resetAnalyticsUser } from "@/client/lib/posthog";
import { userAdditionalFields } from "@/lib/auth-options";
import { getSignInHrefForLocation } from "@/lib/auth-redirect";

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : "",
  plugins: [
    organizationClient(),
    genericOAuthClient(),
    inferAdditionalFields({ user: userAdditionalFields }),
  ],
});

export const { useSession } = authClient;

export function signOutAndRedirect() {
  const signInHref = getSignInHrefForLocation(window.location);
  captureClientEvent("auth:sign_out");
  resetAnalyticsUser();
  void authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        window.location.assign(signInHref);
      },
    },
  });
}

```

### src\lib\auth-config.ts
```typescript
import { env } from "cloudflare:workers";
import { genericOAuth, organization } from "better-auth/plugins";
import { baseAuthOptions } from "@/lib/auth-options";
import { GSC_OAUTH_PROVIDER_ID, GSC_OAUTH_SCOPES } from "@/shared/gsc";

export function createBaseAuthConfig() {
  return {
    ...baseAuthOptions,
    advanced: {
      ipAddress: {
        // On Cloudflare Workers the client IP arrives in CF-Connecting-IP;
        // x-forwarded-for (better-auth's default) is absent, so without this
        // getIp() returns null and rate limiting is silently skipped on every
        // /api/auth endpoint. Header lookup is case-insensitive.
        ipAddressHeaders: ["cf-connecting-ip"],
      },
    },
    account: {
      // Encrypt OAuth access/refresh tokens at rest in D1. Also covers the
      // google social-login tokens; the key derives from BETTER_AUTH_SECRET.
      encryptOAuthTokens: true,
      accountLinking: {
        // Allow connecting a Google account whose email differs from the
        // logged-in user's (agency/freelancer managing a client's property).
        allowDifferentEmails: true,
      },
    },
    plugins: [
      // Block user-initiated org creation: each org is its own Autumn customer
      // with its own onboarding-plan credit grant, so an authenticated user
      // hitting POST /api/auth/organization/create could mint unlimited fresh
      // grants. The app gives every user exactly one workspace, created
      // server-side at signup via `au
```

## Agent Configuration
### CLAUDE.md
# Agent guidance

## Engineering principles

- Prefer simple, readable, flat code with minimal indirection.
- Search for existing implementations and installed libraries before creating new helpers or abstractions.
- Abstract when it prevents meaningful drift and makes the result simpler to maintain. Avoid speculative or one-use abstraction layers.
- Keep product data normalized and relationships explicit. Do not encode relational data in JSON or text merely to avoid joins.
- For new application-backed backend functionality, default to: TanStack server function → service → repository.
- Keep schema changes, queries, and mutations compatible with both SQLite and Postgres.
- Use idiomatic TypeScript. Use Zod to validate untrusted data and narrow runtime values at trust boundaries.
- Prefer established project helpers and libraries over hand-rolled implementations.
- Prefer idiomatic TanStack Query, Router, and Form patterns for server state, routing, and submitted forms.

## Log papercuts

When small, non-blocking repository friction occurs—a retried tool call, confusing setup step, flaky command, stale cache, misleading error, or non-obvious gotcha—use the `papercuts` skill and append it to `.agents/PAPERCUTS.md` in the moment. Continue the current task. Real bugs and tracked work are not papercuts, and sensitive data must never be logged.

Do not mine an entire session for papercuts or start a broad cleanup unless the user explicitly asks.

## Preserve review learnings

After

### AGENTS.md
# Agent guidance

## Engineering principles

- Prefer simple, readable, flat code with minimal indirection.
- Search for existing implementations and installed libraries before creating new helpers or abstractions.
- Abstract when it prevents meaningful drift and makes the result simpler to maintain. Avoid speculative or one-use abstraction layers.
- Keep product data normalized and relationships explicit. Do not encode relational data in JSON or text merely to avoid joins.
- For new application-backed backend functionality, default to: TanStack server function → service → repository.
- Keep schema changes, queries, and mutations compatible with both SQLite and Postgres.
- Use idiomatic TypeScript. Use Zod to validate untrusted data and narrow runtime values at trust boundaries.
- Prefer established project helpers and libraries over hand-rolled implementations.
- Prefer idiomatic TanStack Query, Router, and Form patterns for server state, routing, and submitted forms.

## Log papercuts

When small, non-blocking repository friction occurs—a retried tool call, confusing setup step, flaky command, stale cache, misleading error, or non-obvious gotcha—use the `papercuts` skill and append it to `.agents/PAPERCUTS.md` in the moment. Continue the current task. Real bugs and tracked work are not papercuts, and sensitive data must never be logged.

Do not mine an entire session for papercuts or start a broad cleanup unless the user explicitly asks.

## Preserve review learnings

After

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 66/100 · **Auto-apply:** False
- **Evidence:** `agent`, `mcp`, `router`
- **All scores:** {'seosona-os': 66, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 22, 'seosona-flow': 6}
