# Sandbox Creation Flows

The relay has **two distinct flows** for creating E2B sandboxes. One is complete, the other is broken.

---

## Flow 1: Chat Endpoint (Lazy Creation)

**Endpoint:** `POST /v1/chat/:agentSlug`
**File:** `apps/relay/src/chat.ts`
**Used by:** Playground at an.dev, `createAnChat()` from `@21st-sdk/react`

This is the "happy path". A sandbox is created lazily on the first chat message, fully configured.

### Request Lifecycle

```
Client (JWT or API key)
  → POST /v1/chat/:agentSlug
    → authMiddleware (auth.ts:8-98)
    → getAgentConfig() (chat.ts:233-257)
    → resolveSandbox() (chat.ts:276-324)
      → findSandbox() — reuse if exists
      → createE2BSandbox() — create if not (chat.ts:198-231)
        → Sandbox.betaCreate()
        → injectProxyConfig()      ← writes Claude auth credentials
        → write agent-bundle.js    ← writes agent code
        → write .env               ← writes environment variables
    → connectSandbox() (chat.ts:326-341)
    → resolveThread() (chat.ts:380-410)
    → postToSandbox() (chat.ts:554-628)
    → streamThreadToResponse() (chat.ts:658-829)
  ← SSE stream response
```

### Sandbox Setup — What Gets Injected

**1. Proxy config** — `injectProxyConfig()` (chat.ts:182-196)

Signs an RS256 JWT with `{ userId, sandboxId }` and writes it as a config file:

```
# For claude-code runtime → /home/user/.claude-proxy-config
ANTHROPIC_BASE_URL=https://claude-proxy.example.com
ANTHROPIC_API_KEY=<RS256_JWT>

# For codex runtime → /home/user/.codex-proxy-config
OPENAI_BASE_URL=https://claude-proxy.example.com/openai/v1
CODEX_API_KEY=<RS256_JWT>
```

Without this file, claude-code inside the sandbox has no API credentials → fails with "Invalid API key".

**2. Agent bundle** (chat.ts:212-218)

```typescript
if (bundleUrl) {
  const bundleResponse = await fetch(bundleUrl);
  if (bundleResponse.ok) {
    const bundleBuffer = await bundleResponse.arrayBuffer();
    await sandbox.files.write('/home/user/agent-bundle.js', bundleBuffer);
  }
}
```

Downloads the deployed agent code and writes it into the sandbox.

**3. Environment variables** (chat.ts:220-225)

```typescript
if (envVars && typeof envVars === 'object') {
  const envString = Object.entries(envVars)
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');
  await sandbox.files.write('/home/user/.env', envString);
}
```

Writes the project's `env_vars` JSON blob as a `.env` file.

### How the Sandbox Uses Proxy Config

Inside the sandbox, `getCleanEnv()` in `studio/e2b/magic-agent-github-node/src/cc.ts:169-233` loads auth credentials in priority order:

1. `CLAUDE_CODE_OAUTH_TOKEN` env var (line 191)
2. `/home/user/.claude-oauth-token` file (line 200)
3. `/home/user/.claude-proxy-config` file (line 217) — **this is what `injectProxyConfig()` writes**

If none exist → claude-code has no credentials → "Invalid API key".

---

## Flow 2: Sandboxes REST API (Explicit Creation)

**Endpoint:** `POST /v1/sandboxes`
**File:** `apps/relay/src/sandboxes.ts`
**Used by:** `AnClient.sandboxes.create()` from `@21st-sdk/node`, example apps

This flow creates a sandbox explicitly before chatting. **It's broken** — it creates a bare E2B container with no configuration.

### Request Lifecycle

```
Client (API key)
  → POST /v1/sandboxes { agent: "my-agent" }
    → authMiddleware (auth.ts:8-98)
    → DB lookup for agent config (sandboxes.ts:25-30)
    → Sandbox.betaCreate() (sandboxes.ts:38-41)
      → ❌ NO injectProxyConfig()
      → ❌ NO bundle download
      → ❌ NO env vars
    → Insert into anSandboxes table (sandboxes.ts:46-56)
  ← JSON { id, sandboxId, status, createdAt }
```

### The Bug

`sandboxes.ts:38-41` creates a raw E2B sandbox and nothing else:

```typescript
// Create E2B sandbox
const sandbox = await Sandbox.betaCreate(E2B_TEMPLATE, {
  timeoutMs: SANDBOX_TIMEOUT_MS,
  autoPause: true,
});
```

Compare with `chat.ts:198-231` (`createE2BSandbox()`), which does:

```typescript
const sandbox = await Sandbox.betaCreate(E2B_TEMPLATE, { ... });
await injectProxyConfig(sandbox, runtime, userId, sandboxId);  // ← MISSING
// + bundle download                                            // ← MISSING
// + env vars write                                             // ← MISSING
```

### Why It Can't Self-Heal

When a client creates a sandbox via Flow 2 and then sends a chat message via Flow 1:

1. `POST /v1/sandboxes` → creates bare sandbox, inserts DB record
2. `POST /v1/chat/:agent` with `sandboxId` → calls `resolveSandbox()`
3. `resolveSandbox()` calls `findSandbox()` (chat.ts:285) → **finds existing record**
4. Returns early (chat.ts:286): `return { sandbox: existing, isNew: false }`
5. **Never calls `createE2BSandbox()`** → never injects proxy config
6. Chat fails because sandbox has no credentials

### Sub-resources

Flow 2 also exposes thread management:

| Endpoint | Handler | Lines |
|----------|---------|-------|
| `GET /v1/sandboxes/:id` | Get sandbox + threads | sandboxes.ts:71-126 |
| `DELETE /v1/sandboxes/:id` | Kill sandbox + cascade delete | sandboxes.ts:129-165 |
| `GET /v1/sandboxes/:id/threads` | List threads | sandboxes.ts:170-204 |
| `POST /v1/sandboxes/:id/threads` | Create thread (status: `idle`) | sandboxes.ts:207-249 |
| `GET /v1/sandboxes/:id/threads/:threadId` | Get thread details | sandboxes.ts:252-292 |
| `DELETE /v1/sandboxes/:id/threads/:threadId` | Delete thread | sandboxes.ts:295-329 |

---

## Side-by-Side Comparison

| Aspect | Flow 1: `/v1/chat/:slug` | Flow 2: `/v1/sandboxes` |
|--------|--------------------------|-------------------------|
| Trigger | First chat message | Explicit API call |
| Proxy config | ✅ Injected | ❌ Missing |
| Agent bundle | ✅ Downloaded | ❌ Missing |
| Env vars | ✅ Written to `.env` | ❌ Missing |
| Thread creation | Automatic (inline) | Manual (separate endpoint) |
| Response | SSE stream | JSON metadata |
| Race condition handling | ✅ Yes (chat.ts:310-323) | ❌ No |
| Sandbox reuse | ✅ By `client_sandbox_id` | Always creates new |

---

## SDK Usage Patterns

### Playground (works — uses Flow 1 only)

```
1. Web app /api/an/token → exchanges Clerk session for JWT
2. createAnChat({ agent, tokenUrl }) → POST /v1/chat/:agent with JWT
3. Chat endpoint creates sandbox lazily with full config
```

### Example App (broken — uses Flow 2 then Flow 1)

```
1. AnClient.sandboxes.create({ agent }) → POST /v1/sandboxes (bare sandbox)
2. AnClient.threads.create({ sandboxId }) → POST /v1/sandboxes/:id/threads
3. createAnChat({ sandboxId, threadId }) → POST /v1/chat/:agent
4. Chat finds existing sandbox → skips createE2BSandbox() → no credentials → FAIL
```

---

## Fix

`sandboxes.ts` POST handler needs to replicate what `createE2BSandbox()` does in `chat.ts`. Either:

1. **Extract and reuse** `createE2BSandbox()` from `chat.ts` as a shared function
2. **Or inline** the three missing steps after `Sandbox.betaCreate()`:
   - `injectProxyConfig(sandbox, runtime, userId, sandboxId)`
   - Download bundle to `/home/user/agent-bundle.js`
   - Write env vars to `/home/user/.env`

Note: `injectProxyConfig()` needs `userId` — currently `sandboxes.ts` doesn't extract it. It needs to read `(req as any).apiKey?.user_id` or `(req as any).tokenClaims?.user_id`, same as `getUserId()` in chat.ts:143-146.

---

## Implementation Plan

### Goal

Make `POST /v1/sandboxes` produce a fully configured sandbox (proxy config + bundle + env vars), identical to what `createE2BSandbox()` in `chat.ts` produces.

### Approach: Extract shared `createE2BSandbox()` into a module

Inlining the logic would duplicate code. Instead, extract the sandbox creation + proxy injection into a shared module that both `chat.ts` and `sandboxes.ts` import.

### Step 1: Create `apps/relay/src/sandbox-factory.ts`

Move these functions from `chat.ts` into a new file:

- `getPrivateKey()` (chat.ts:166-172) — loads `CLAUDE_PROXY_PRIVATE_JWT`
- `signProxyJwt()` (chat.ts:174-180) — signs RS256 JWT with `{ userId, sandboxId }`
- `injectProxyConfig()` (chat.ts:182-196) — writes `.claude-proxy-config` or `.codex-proxy-config`
- `createE2BSandbox()` (chat.ts:198-231) — the full sandbox creation with all 3 injections

Also move the shared constants:
- `CLAUDE_PROXY_URL` (chat.ts:16)
- `E2B_TEMPLATE` (chat.ts:17) — also duplicated in sandboxes.ts:7
- `SANDBOX_TIMEOUT_MS` (chat.ts:18) — also duplicated in sandboxes.ts:8

Export `createE2BSandbox()` and `injectProxyConfig()`.

### Step 2: Update `apps/relay/src/chat.ts`

- Remove the moved functions and constants
- Import `createE2BSandbox` from `./sandbox-factory.js`
- Everything else stays the same — `resolveSandbox()`, `connectSandbox()`, etc. just call the imported function

### Step 3: Update `apps/relay/src/sandboxes.ts`

Replace the bare `Sandbox.betaCreate()` call (lines 38-41) with `createE2BSandbox()`:

```typescript
// Before (broken):
const sandbox = await Sandbox.betaCreate(E2B_TEMPLATE, {
  timeoutMs: SANDBOX_TIMEOUT_MS,
  autoPause: true,
});

// After (fixed):
import { createE2BSandbox } from './sandbox-factory.js';

const userId = (req as any).tokenClaims?.user_id
  ?? (req as any).apiKey?.user_id
  ?? 'anonymous';

const { sandboxId: e2bSandboxId } = await createE2BSandbox({
  runtime: agentConfig.runtime || 'claude-code',
  userId,
  bundleUrl: agentConfig.bundle_url,
  envVars: agentConfig.env_vars as Record<string, string> | null,
});
```

Remove the duplicated `E2B_TEMPLATE` and `SANDBOX_TIMEOUT_MS` constants from sandboxes.ts (they'll come from the shared module).

Update the DB insert to use `e2bSandboxId` instead of `sandbox.sandboxId`.

### Step 4: Verify

- The example app flow (`AnClient.sandboxes.create()` → `createAnChat()`) should now work
- The playground flow (direct `/v1/chat`) should be unaffected
- Both flows produce identically configured sandboxes

### Files touched

1. **New:** `apps/relay/src/sandbox-factory.ts` — shared sandbox creation logic
2. **Modified:** `apps/relay/src/chat.ts` — import from shared module, remove moved code
3. **Modified:** `apps/relay/src/sandboxes.ts` — use `createE2BSandbox()`, extract userId from req
