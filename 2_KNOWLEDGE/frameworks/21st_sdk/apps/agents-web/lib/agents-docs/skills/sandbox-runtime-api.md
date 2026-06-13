# Sandbox Runtime API

Internal HTTP server running on port 3003 inside the E2B sandbox. These endpoints are called by the sandbox-provider package and proxied through the Next.js web app.

## Architecture

```
Client → Next.js /api/agents/chat → sandbox-provider → E2B sandbox :3003/api/cc/...
                                                     → Relay SSE /stream/:streamId
```

The sandbox runs two runtimes:
- **Claude Code (CC)** - `@anthropic-ai/claude-agent-sdk@0.2.32`, default model `opus`
- **Codex** - `@mcpc-tech/acp-ai-provider` + `@zed-industries/codex-acp@0.9.3`, default model `gpt-5.4/high`

## Endpoints

### POST /api/cc/sessions

Create a new Claude Code session.

**Request:**
```json
{
  "message": "Your prompt text",
  "images": [
    {
      "base64": "...",
      "mediaType": "image/png",
      "filename": "screenshot.png"
    }
  ]
}
```

**Response:**
```json
{ "streamId": "uuid-v4" }
```

The `streamId` is used to connect to the relay SSE endpoint: `GET {relayBaseURL}/stream/{streamId}`

**Behavior:**
- Creates a new Claude Agent SDK session
- Writes skill files to `.claude/skills/{slug}/SKILL.md` on first session
- Loads GitHub token from `/home/user/.gh-token` and sets `GH_TOKEN` env
- Auth priority: env `CLAUDE_CODE_OAUTH_TOKEN` → `/home/user/.claude-oauth-token` → `/home/user/.claude-proxy-config`
- Supports: `systemPrompt`, `allowedTools`, `permissionMode`, `maxTurns`, `maxThinkingTokens`

---

### POST /api/cc/sessions/:sessionId/messages

Send a message to an existing Claude Code session.

**Request:**
```json
{
  "message": "Follow-up message",
  "images": []
}
```

**Response:**
```json
{ "streamId": "uuid-v4" }
```

Uses the persisted session to continue the conversation. The `sessionId` is extracted from previous response metadata.

---

### POST /api/codex/sessions

Create a new Codex session.

**Request:** Same format as CC sessions.

**Response:**
```json
{ "streamId": "uuid-v4" }
```

**Behavior:**
- Uses `@zed-industries/codex-acp@0.9.3` with ACP provider
- Default model: `gpt-5.4/high`
- Maintains persistent in-memory session map (`sessionId` → `ACPProvider`)

---

### POST /api/codex/sessions/:sessionId/messages

Send a message to an existing Codex session.

**Request/Response:** Same format as CC sessions.

---

### GET /api/export

Export sandbox state as NDJSON stream.

**Query params:**
- `sessionId` (optional) - export specific session only
- `full=true` (optional) - full repository git bundle export

**Response:** `Content-Type: application/x-ndjson`

Each line is a JSON object. Export includes:
- Full or delta git bundle
- Staged/unstaged patches
- Untracked files as base64
- Claude session data from `.claude/projects/`

**Proxy:** Accessible externally via `GET /api/agents/sandbox/{sandboxId}/export` (requires auth).

---

### GET /api/export/debug

Debug endpoint for Claude session data.

**Response:** `Content-Type: application/json`

Returns internal debug information about the sandbox state and sessions.

**Proxy:** Accessible externally via `GET /api/agents/sandbox/{sandboxId}/export/debug` (requires auth).

---

### GET /api/cc/debug

Debug endpoint for sandbox identifiers.

**Response:** JSON with sandbox metadata, session IDs, and runtime status.

---

### POST /api/cc/gh-test

Test GitHub CLI capabilities inside the sandbox.

**Response:** JSON with GitHub CLI test results (authentication status, available repos, etc.).

## SSE Stream Format

After obtaining a `streamId`, connect to the relay SSE endpoint:

```
GET {relayBaseURL}/stream/{streamId}
Accept: text/event-stream
```

The stream emits these event types:

```
data: {"type":"system","tools":["Bash","Read","Write",...],"model":"opus"}
data: {"type":"stream_event","event":{"type":"content_block_start","content_block":{"type":"text"}}}
data: {"type":"stream_event","event":{"type":"content_block_delta","delta":{"type":"text_delta","text":"..."}}}
data: {"type":"stream_event","event":{"type":"content_block_stop"}}
data: {"type":"assistant","message":{"role":"assistant","content":[...],"stop_reason":"end_turn"}}
data: {"type":"user","message":{"role":"user","content":[{"type":"tool_result","tool_use_id":"...","content":"..."}]}}
data: {"type":"tool_progress","tool_name":"Bash","tool_use_id":"...","elapsed_time_seconds":5}
data: {"type":"result","subtype":"success","usage":{"input_tokens":100,"output_tokens":50},"total_cost_usd":0.034,"duration_ms":2487}
data: [DONE]
```

Key fields in `result`:
- `subtype`: `"success"` or error type
- `session_id`: persisted for session continuation
- `total_cost_usd`: actual cost for credit consumption
- `duration_ms`: total request duration

## Sandbox Provider Integration

The `@repo/sandbox-provider` package wraps these endpoints as an AI SDK `LanguageModelV2`:

```typescript
import { createSandbox } from "@repo/sandbox-provider"

const sandbox = createSandbox({
  sandboxBaseURL: "https://3003-{sandboxId}.e2b.app/api/cc",
  relayBaseURL: "https://relay.an.dev",
})

const model = sandbox("default")

// Use with AI SDK streamText
const result = streamText({
  model,
  messages: convertedMessages,
  providerOptions: {
    sandbox: {
      sessionId: "existing-session-id",  // optional, for continuation
      images: [{ base64: "...", mediaType: "image/png" }],  // optional
    },
  },
})
```

## Linear MCP Server

Available when `LINEAR_ACCESS_TOKEN` exists in sandbox environment. Provides 14 tools:
- Issue CRUD (create, read, update, delete)
- Comments management
- Teams/users/labels/states/projects lookup
- `whoami` for current user info
