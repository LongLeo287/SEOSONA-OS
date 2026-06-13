import { TimelineStep } from "../types/timeline"

// Hotel image (Unsplash — free for commercial use, no attribution required)
const HOTEL_IMG = "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=120&h=120&fit=crop&crop=center&q=80"

const assistantResponse1 = `Found 3 direct flights. The cheapest is United at $1,105 but no free checked bag. ANA at $1,240 has the best reviews. Want me to check hotels too?`

const assistantResponse2 = `That's the Shinjuku Granbell — solid pick. 4.2/5 across 1,847 reviews, ¥18,500/night (~$124). Great location near the station.

I booked a hold on the ANA flight + this hotel:

- **ANA NH7** · Mar 15-22 · $1,240 rt
- **Shinjuku Granbell** · 7 nights · $868
- **Total**: ~$2,108

Want me to lock it in or keep looking?`

export const chatTimeline: TimelineStep[] = [
  // ── Turn 1 ──
  { id: "i1", type: "input-typing", content: "Find me flights from SFO to Tokyo, March 15-22", duration: 1200 },
  { id: "u1", type: "user-message", content: "Find me flights from SFO to Tokyo, March 15-22" },
  { id: "t1a", type: "tool-call", toolName: "Thinking", toolDetail: "analyzing request…", duration: 2400, toolVariant: "thinking", thoughtContent: "The user wants flights from SFO to Tokyo for a week in March. I should search for direct flights first since those are usually preferred for long-haul, then compare prices across major carriers." },
  { id: "t1b", type: "tool-call", toolName: "Search Flights", toolDetail: "SFO → NRT, Mar 15-22", duration: 2200, toolVariant: "search", searchQuery: "SFO to NRT direct flights March 15-22" },
  { id: "t1c", type: "tool-call", toolName: "Compare Prices", toolDetail: "3 airlines, economy", duration: 1800, toolVariant: "search" },
  { id: "a1", type: "assistant-stream", content: assistantResponse1 },
  { id: "p1", type: "pause", duration: 1400 },
  // ── Turn 2 ──
  { id: "i2", type: "input-typing", content: "Yes, check this hotel — is it worth it?", image: HOTEL_IMG, duration: 1400 },
  { id: "u2", type: "user-message", content: "Yes, check this hotel — is it worth it?", image: HOTEL_IMG },
  { id: "t2a", type: "tool-call", toolName: "Thinking", toolDetail: "understanding image…", duration: 2200, toolVariant: "thinking", thoughtContent: "The user shared a photo of what looks like a modern hotel in Shinjuku. I should look up reviews and check availability for their dates to give a proper recommendation." },
  { id: "t2b", type: "tool-call", toolName: "Fetch Reviews", toolDetail: "booking.com, tripadvisor", duration: 2000, toolVariant: "search", searchQuery: "Shinjuku Granbell Hotel reviews" },
  { id: "t2c", type: "tool-call", toolName: "Check Availability", toolDetail: "Mar 15-22, 1 room", duration: 1600 },
  { id: "a2", type: "assistant-stream", content: assistantResponse2 },
]

/* ── Notion-specific timeline with varied tool types ── */

const notionAssistantResponse1 = `Found 3 direct flights. The cheapest is United at $1,105 but no free checked bag. ANA at $1,240 has the best reviews. Want me to check hotels too?`

const notionAssistantResponse2 = `That's the Shinjuku Granbell — solid pick. 4.2/5 across 1,847 reviews, ¥18,500/night (~$124). Great location near the station.

I booked a hold on the ANA flight + this hotel:

- **ANA NH7** · Mar 15-22 · $1,240 rt
- **Shinjuku Granbell** · 7 nights · $868
- **Total**: ~$2,108

Want me to lock it in or keep looking?`

export const notionChatTimeline: TimelineStep[] = [
  // ── Turn 1 ──
  { id: "ni1", type: "input-typing", content: "Find me flights from SFO to Tokyo, March 15-22", duration: 1200 },
  { id: "nu1", type: "user-message", content: "Find me flights from SFO to Tokyo, March 15-22" },
  { id: "nt1a", type: "tool-call", toolName: "Thinking", toolDetail: "analyzing request…", duration: 2400, toolVariant: "thinking", thoughtContent: "The user wants flights from SFO to Tokyo for a week in March. I should search for direct flights first since those are usually preferred for long-haul, then compare prices across major carriers." },
  { id: "nt1b", type: "tool-call", toolName: "Search Flights", toolDetail: "SFO → NRT, Mar 15-22", duration: 2200, toolVariant: "search", searchQuery: "SFO to NRT direct flights March 15-22", searchSource: "web" },
  { id: "nt1c", type: "tool-call", toolName: "Compare Prices", toolDetail: "3 airlines, economy", duration: 1800, toolVariant: "search", searchSource: "web" },
  { id: "na1", type: "assistant-stream", content: notionAssistantResponse1 },
  { id: "np1", type: "pause", duration: 1400 },
  // ── Turn 2 ──
  { id: "ni2", type: "input-typing", content: "Yes, check this hotel — is it worth it?", image: HOTEL_IMG, duration: 1400 },
  { id: "nu2", type: "user-message", content: "Yes, check this hotel — is it worth it?", image: HOTEL_IMG },
  { id: "nt2a", type: "tool-call", toolName: "Thinking", toolDetail: "understanding image…", duration: 2200, toolVariant: "thinking", thoughtContent: "The user shared a photo of what looks like a modern hotel in Shinjuku. I should look up reviews and check availability for their dates to give a proper recommendation." },
  { id: "nt2b", type: "tool-call", toolName: "Fetch Reviews", toolDetail: "booking.com, tripadvisor", duration: 2000, toolVariant: "search", searchQuery: "Shinjuku Granbell Hotel reviews", searchSource: "web" },
  { id: "nt2c", type: "tool-call", toolName: "Check Availability", toolDetail: "Mar 15-22, 1 room", duration: 1600, toolVariant: "action" },
  { id: "na2", type: "assistant-stream", content: notionAssistantResponse2 },
]

/* ── Tool Execution timelines ── */

export const toolExecutionTimeline: TimelineStep[] = [
  { id: "te-p0", type: "pause", duration: 400 },
  { id: "te-t1", type: "tool-call", toolName: "Search Events", toolDetail: "signup_completed · last 7 days", duration: 2400 },
  { id: "te-t2", type: "tool-call", toolName: "Build Funnel", toolDetail: "visit → signup → activate", duration: 2800 },
  { id: "te-t3", type: "tool-call", toolName: "Compute Dropoff", toolDetail: "3 steps · 7-day window", duration: 3200 },
  { id: "te-t4", type: "tool-call", toolName: "Render Chart", toolDetail: "funnel bar · conversion %", duration: 1800 },
]

export const notionToolExecutionTimeline: TimelineStep[] = [
  { id: "nte-p0", type: "pause", duration: 400 },
  { id: "nte-t1", type: "tool-call", toolName: "Thinking", toolDetail: "analyzing data request…", duration: 2400, toolVariant: "thinking", thoughtContent: "The user wants a signup funnel analysis for the last 7 days. I should query the events first, build the funnel steps, then compute conversion dropoff rates." },
  { id: "nte-t2", type: "tool-call", toolName: "Query Events", toolDetail: "signup_completed", duration: 2200, toolVariant: "search", searchQuery: "signup_completed events last 7 days", searchSource: "web" },
  { id: "nte-t3", type: "tool-call", toolName: "Build Funnel", toolDetail: "visit → signup → activate", duration: 2400, toolVariant: "action" },
  { id: "nte-t4", type: "tool-call", toolName: "Compute Dropoff", toolDetail: "period: last_7d", duration: 2800, toolVariant: "action" },
  { id: "nte-t5", type: "tool-call", toolName: "Render Chart", toolDetail: "funnel_bar", duration: 1600, toolVariant: "action" },
]

/* ── Support timelines (Customer Support use case) ── */

const supportResponse1 = `Found the account. Sarah Chen is on the **Business plan** (since Oct 2024), which includes data export. However, the export feature is currently disabled on her workspace.

Let me check the feature flags and permissions.`

const supportResponse2 = `Found the issue. The workspace was migrated from a legacy plan on Nov 3, and the migration script missed enabling the \`data_export\` feature flag.

- **Plan**: Business ($49/mo) — export is included
- **Feature flag**: \`data_export = false\` (should be \`true\`)
- **Workspace**: ws_8k2m9 (migrated Nov 3)

I'll enable it now and verify.`

const supportResponse3 = `Done. Export is now working for Sarah's workspace:

1. Enabled \`data_export\` flag on ws_8k2m9
2. Verified she can access Settings > Export
3. Sent her a confirmation email
4. Added an internal note about the migration bug

Should I file a bug ticket for the migration script so other affected workspaces get fixed too?`

export const supportTimeline: TimelineStep[] = [
  // ── Turn 1 ──
  { id: "sp-i1", type: "input-typing", content: "Customer sarah.chen@acme.co says she can't find the export button in her dashboard", duration: 1400 },
  { id: "sp-u1", type: "user-message", content: "Customer sarah.chen@acme.co says she can't find the export button in her dashboard" },
  { id: "sp-t1a", type: "tool-call", toolName: "Thinking", toolDetail: "analyzing customer issue…", duration: 2000, toolVariant: "thinking", thoughtContent: "The customer can't find the export button. I should first look up their account to check their plan — export might be a paid feature. Then I'll check if the feature is enabled on their workspace." },
  { id: "sp-t1b", type: "tool-call", toolName: "Lookup Account", toolDetail: "sarah.chen@acme.co", duration: 1800 },
  { id: "sp-t1c", type: "tool-call", toolName: "Check Plan", toolDetail: "Business plan, entitlements", duration: 1600 },
  { id: "sp-a1", type: "assistant-stream", content: supportResponse1 },
  { id: "sp-p1", type: "pause", duration: 1200 },
  // ── Turn 2 ──
  { id: "sp-i2", type: "input-typing", content: "Yes, check why it's disabled. She's paying for Business.", duration: 1100 },
  { id: "sp-u2", type: "user-message", content: "Yes, check why it's disabled. She's paying for Business." },
  { id: "sp-t2a", type: "tool-call", toolName: "Thinking", toolDetail: "investigating permissions…", duration: 1800, toolVariant: "thinking", thoughtContent: "The Business plan definitely includes export. I need to check the workspace feature flags and see if something went wrong during provisioning or migration." },
  { id: "sp-t2b", type: "tool-call", toolName: "Query Feature Flags", toolDetail: "ws_8k2m9, data_export", duration: 1800 },
  { id: "sp-t2c", type: "tool-call", toolName: "Check Migration Log", toolDetail: "workspace ws_8k2m9, Nov 2024", duration: 1600 },
  { id: "sp-a2", type: "assistant-stream", content: supportResponse2 },
  { id: "sp-p2", type: "pause", duration: 1200 },
  // ── Turn 3 ──
  { id: "sp-i3", type: "input-typing", content: "Enable it and let her know", duration: 900 },
  { id: "sp-u3", type: "user-message", content: "Enable it and let her know" },
  { id: "sp-t3a", type: "tool-call", toolName: "Thinking", toolDetail: "enabling feature…", duration: 1600, toolVariant: "thinking", thoughtContent: "I need to flip the feature flag, verify it works, and then notify the customer. I should also add an internal note so the team knows about the migration bug." },
  { id: "sp-t3b", type: "tool-call", toolName: "Update Feature Flag", toolDetail: "data_export = true", duration: 1400 },
  { id: "sp-t3c", type: "tool-call", toolName: "Verify Access", toolDetail: "export endpoint, ws_8k2m9", duration: 1200 },
  { id: "sp-t3d", type: "tool-call", toolName: "Send Email", toolDetail: "sarah.chen@acme.co, resolution", duration: 1200 },
  { id: "sp-a3", type: "assistant-stream", content: supportResponse3 },
]

export const notionSupportTimeline: TimelineStep[] = [
  // ── Turn 1 ──
  { id: "nsp-i1", type: "input-typing", content: "Customer sarah.chen@acme.co says she can't find the export button in her dashboard", duration: 1400 },
  { id: "nsp-u1", type: "user-message", content: "Customer sarah.chen@acme.co says she can't find the export button in her dashboard" },
  { id: "nsp-t1a", type: "tool-call", toolName: "Thinking", toolDetail: "analyzing customer issue…", duration: 2000, toolVariant: "thinking", thoughtContent: "The customer can't find the export button. I should first look up their account to check their plan — export might be a paid feature. Then I'll check if the feature is enabled on their workspace." },
  { id: "nsp-t1b", type: "tool-call", toolName: "Lookup Account", toolDetail: "sarah.chen@acme.co", duration: 1800, toolVariant: "search", searchQuery: "customer sarah.chen@acme.co account details", searchSource: "zendesk" },
  { id: "nsp-t1c", type: "tool-call", toolName: "Check Plan", toolDetail: "Business plan, entitlements", duration: 1600, toolVariant: "search", searchQuery: "workspace entitlements Business plan", searchSource: "stripe" },
  { id: "nsp-a1", type: "assistant-stream", content: supportResponse1 },
  { id: "nsp-p1", type: "pause", duration: 1200 },
  // ── Turn 2 ──
  { id: "nsp-i2", type: "input-typing", content: "Yes, check why it's disabled. She's paying for Business.", duration: 1100 },
  { id: "nsp-u2", type: "user-message", content: "Yes, check why it's disabled. She's paying for Business." },
  { id: "nsp-t2a", type: "tool-call", toolName: "Thinking", toolDetail: "investigating permissions…", duration: 1800, toolVariant: "thinking", thoughtContent: "The Business plan definitely includes export. I need to check the workspace feature flags and see if something went wrong during provisioning or migration." },
  { id: "nsp-t2b", type: "tool-call", toolName: "Query Feature Flags", toolDetail: "ws_8k2m9, data_export", duration: 1800, toolVariant: "search", searchQuery: "feature flags workspace ws_8k2m9", searchSource: "zendesk" },
  { id: "nsp-t2c", type: "tool-call", toolName: "Check Migration Log", toolDetail: "workspace ws_8k2m9, Nov 2024", duration: 1600, toolVariant: "search", searchQuery: "migration log ws_8k2m9 November", searchSource: "zendesk" },
  { id: "nsp-a2", type: "assistant-stream", content: supportResponse2 },
  { id: "nsp-p2", type: "pause", duration: 1200 },
  // ── Turn 3 ──
  { id: "nsp-i3", type: "input-typing", content: "Enable it and let her know", duration: 900 },
  { id: "nsp-u3", type: "user-message", content: "Enable it and let her know" },
  { id: "nsp-t3a", type: "tool-call", toolName: "Thinking", toolDetail: "enabling feature…", duration: 1600, toolVariant: "thinking", thoughtContent: "I need to flip the feature flag, verify it works, and then notify the customer. I should also add an internal note so the team knows about the migration bug." },
  { id: "nsp-t3b", type: "tool-call", toolName: "Update Feature Flag", toolDetail: "data_export = true", duration: 1400, toolVariant: "action" },
  { id: "nsp-t3c", type: "tool-call", toolName: "Verify Access", toolDetail: "export endpoint, ws_8k2m9", duration: 1200, toolVariant: "action" },
  { id: "nsp-t3d", type: "tool-call", toolName: "Send Email", toolDetail: "sarah.chen@acme.co, resolution", duration: 1200, toolVariant: "action" },
  { id: "nsp-a3", type: "assistant-stream", content: supportResponse3 },
]

/* ── Code timelines (Code Assistant use case) ── */

const codeResponse1 = `I've read the API code. You're using **Express 4** with a standard middleware chain. The \`/api/v1/messages\` endpoint has no rate limiting and handles ~2k req/s in production.

Current middleware stack:
1. \`cors()\` → \`authenticate()\` → \`validateBody()\` → \`handleMessages()\`

I'd recommend a sliding-window rate limiter using Redis — you already have \`ioredis\` in your deps. Want me to implement it?`

const codeResponse2 = `Here's what I'm adding:

- **New file**: \`src/middleware/rate-limit.ts\` — sliding window limiter using Redis sorted sets
- **Config**: 100 requests per 60s window per API key
- **Headers**: \`X-RateLimit-Limit\`, \`X-RateLimit-Remaining\`, \`X-RateLimit-Reset\`
- **Response**: 429 with \`retry-after\` when exceeded

Writing the code now…`

const codeResponse3 = `Done. Here's a summary of changes:

- \`src/middleware/rate-limit.ts\` — new, 47 lines
- \`src/routes/messages.ts\` — added rateLimiter() to chain
- \`src/middleware/__tests__/rate-limit.test.ts\` — 4 test cases

Tests cover: normal request, limit reached, window reset, and missing API key. Run \`npm test -- rate-limit\` to verify.`

export const codeTimeline: TimelineStep[] = [
  // ── Turn 1 ──
  { id: "cd-i1", type: "input-typing", content: "Add rate limiting to the /api/v1/messages endpoint", duration: 1100 },
  { id: "cd-u1", type: "user-message", content: "Add rate limiting to the /api/v1/messages endpoint" },
  { id: "cd-t1a", type: "tool-call", toolName: "Thinking", toolDetail: "planning implementation…", duration: 2000, toolVariant: "thinking", thoughtContent: "The user wants rate limiting on a specific API endpoint. I need to first understand the existing codebase — what framework they're using, what middleware exists, and what dependencies are available." },
  { id: "cd-t1b", type: "tool-call", toolName: "Read", toolDetail: "src/routes/messages.ts", duration: 1800 },
  { id: "cd-t1c", type: "tool-call", toolName: "Read", toolDetail: "package.json", duration: 1200 },
  { id: "cd-t1d", type: "tool-call", toolName: "Glob", toolDetail: "src/middleware/**/*.ts", duration: 1000 },
  { id: "cd-a1", type: "assistant-stream", content: codeResponse1 },
  { id: "cd-p1", type: "pause", duration: 1200 },
  // ── Turn 2 ──
  { id: "cd-i2", type: "input-typing", content: "Yes, use Redis sliding window. 100 req/min per key.", duration: 1100 },
  { id: "cd-u2", type: "user-message", content: "Yes, use Redis sliding window. 100 req/min per key." },
  { id: "cd-t2a", type: "tool-call", toolName: "Thinking", toolDetail: "designing rate limiter…", duration: 1800, toolVariant: "thinking", thoughtContent: "Redis sorted sets are ideal for sliding window rate limiting. I'll use ZADD with timestamps as scores, ZRANGEBYSCORE to count requests in the window, and ZREMRANGEBYSCORE to clean up expired entries." },
  { id: "cd-t2b", type: "tool-call", toolName: "Write", toolDetail: "src/middleware/rate-limit.ts", duration: 2400, filePath: "src/middleware/rate-limit.ts", diffStats: "+47", diffLines: [
    { type: "add", content: "import { Redis } from \"ioredis\"" },
    { type: "add", content: "import { RateLimitConfig } from \"../types\"" },
    { type: "add", content: "" },
    { type: "add", content: "const redis = new Redis(process.env.REDIS_URL)" },
    { type: "add", content: "" },
    { type: "add", content: "export function rateLimiter(config: RateLimitConfig) {" },
    { type: "add", content: "  const { limit = 100, window = 60 } = config" },
    { type: "add", content: "  return async (req, res, next) => {" },
    { type: "add", content: "    const key = `rl:${req.apiKey}`" },
  ] },
  { id: "cd-t2c", type: "tool-call", toolName: "Edit", toolDetail: "src/routes/messages.ts", duration: 1600, filePath: "src/routes/messages.ts", diffStats: "+2 -1", diffLines: [
    { type: "context", content: "import { authenticate } from \"../middleware/auth\"" },
    { type: "add", content: "import { rateLimiter } from \"../middleware/rate-limit\"" },
    { type: "context", content: "" },
    { type: "context", content: "router.post(\"/api/v1/messages\"," },
    { type: "remove", content: "  authenticate(), validateBody(), handleMessages()" },
    { type: "add", content: "  authenticate(), rateLimiter({ limit: 100 }), validateBody(), handleMessages()" },
  ] },
  { id: "cd-a2", type: "assistant-stream", content: codeResponse2 },
  { id: "cd-p2", type: "pause", duration: 1000 },
  // ── Turn 3 ──
  { id: "cd-i3", type: "input-typing", content: "Add tests too", duration: 700 },
  { id: "cd-u3", type: "user-message", content: "Add tests too" },
  { id: "cd-t3a", type: "tool-call", toolName: "Thinking", toolDetail: "writing test cases…", duration: 1600, toolVariant: "thinking", thoughtContent: "I should test four scenarios: normal request passes, hitting the limit returns 429, window resets after 60 seconds, and request with no API key. I'll use the existing jest setup and mock Redis." },
  { id: "cd-t3b", type: "tool-call", toolName: "Write", toolDetail: "rate-limit.test.ts", duration: 2000, filePath: "src/middleware/__tests__/rate-limit.test.ts", diffStats: "+38", diffLines: [
    { type: "add", content: "import { rateLimiter } from \"../rate-limit\"" },
    { type: "add", content: "import { createMockRedis } from \"../../test/utils\"" },
    { type: "add", content: "" },
    { type: "add", content: "describe(\"rateLimiter\", () => {" },
    { type: "add", content: "  it(\"allows requests under limit\", async () => {" },
    { type: "add", content: "    const req = mockRequest({ apiKey: \"test-key\" })" },
    { type: "add", content: "    await rateLimiter({ limit: 100 })(req, res, next)" },
    { type: "add", content: "    expect(next).toHaveBeenCalled()" },
  ] },
  { id: "cd-t3c", type: "tool-call", toolName: "Bash", toolDetail: "npm test -- rate-limit", duration: 2000, bashCommand: "npm test -- --testPathPattern rate-limit", bashOutput: "PASS src/middleware/__tests__/rate-limit.test.ts\n  rateLimiter\n    ✓ allows requests under limit (3ms)\n    ✓ returns 429 when limit reached (2ms)\n    ✓ resets after window expires (4ms)\n    ✓ rejects missing API key (1ms)\n\nTests: 4 passed, 4 total", bashSuccess: true },
  { id: "cd-a3", type: "assistant-stream", content: codeResponse3 },
]

export const notionCodeTimeline: TimelineStep[] = [
  // ── Turn 1 ──
  { id: "ncd-i1", type: "input-typing", content: "Add rate limiting to the /api/v1/messages endpoint", duration: 1100 },
  { id: "ncd-u1", type: "user-message", content: "Add rate limiting to the /api/v1/messages endpoint" },
  { id: "ncd-t1a", type: "tool-call", toolName: "Thinking", toolDetail: "planning implementation…", duration: 2000, toolVariant: "thinking", thoughtContent: "The user wants rate limiting on a specific API endpoint. I need to first understand the existing codebase — what framework they're using, what middleware exists, and what dependencies are available." },
  { id: "ncd-t1b", type: "tool-call", toolName: "Read", toolDetail: "src/routes/messages.ts", duration: 1800, toolVariant: "search", searchQuery: "src/routes/messages.ts", searchSource: "github" },
  { id: "ncd-t1c", type: "tool-call", toolName: "Read", toolDetail: "package.json", duration: 1200, toolVariant: "search", searchQuery: "package.json dependencies", searchSource: "github" },
  { id: "ncd-t1d", type: "tool-call", toolName: "Glob", toolDetail: "src/middleware/**/*.ts", duration: 1000, toolVariant: "search", searchQuery: "src/middleware/ directory listing", searchSource: "github" },
  { id: "ncd-a1", type: "assistant-stream", content: codeResponse1 },
  { id: "ncd-p1", type: "pause", duration: 1200 },
  // ── Turn 2 ──
  { id: "ncd-i2", type: "input-typing", content: "Yes, use Redis sliding window. 100 req/min per key.", duration: 1100 },
  { id: "ncd-u2", type: "user-message", content: "Yes, use Redis sliding window. 100 req/min per key." },
  { id: "ncd-t2a", type: "tool-call", toolName: "Thinking", toolDetail: "designing rate limiter…", duration: 1800, toolVariant: "thinking", thoughtContent: "Redis sorted sets are ideal for sliding window rate limiting. I'll use ZADD with timestamps as scores, ZRANGEBYSCORE to count requests in the window, and ZREMRANGEBYSCORE to clean up expired entries." },
  { id: "ncd-t2b", type: "tool-call", toolName: "Write", toolDetail: "src/middleware/rate-limit.ts", duration: 2000, toolVariant: "action" },
  { id: "ncd-t2c", type: "tool-call", toolName: "Edit", toolDetail: "src/routes/messages.ts", duration: 1600, toolVariant: "action" },
  { id: "ncd-a2", type: "assistant-stream", content: codeResponse2 },
  { id: "ncd-p2", type: "pause", duration: 1000 },
  // ── Turn 3 ──
  { id: "ncd-i3", type: "input-typing", content: "Add tests too", duration: 700 },
  { id: "ncd-u3", type: "user-message", content: "Add tests too" },
  { id: "ncd-t3a", type: "tool-call", toolName: "Thinking", toolDetail: "writing test cases…", duration: 1600, toolVariant: "thinking", thoughtContent: "I should test four scenarios: normal request passes, hitting the limit returns 429, window resets after 60 seconds, and request with no API key. I'll use the existing jest setup and mock Redis." },
  { id: "ncd-t3b", type: "tool-call", toolName: "Write", toolDetail: "rate-limit.test.ts", duration: 1800, toolVariant: "action" },
  { id: "ncd-t3c", type: "tool-call", toolName: "Bash", toolDetail: "npm test -- rate-limit", duration: 2000, toolVariant: "action" },
  { id: "ncd-a3", type: "assistant-stream", content: codeResponse3 },
]

/* ── Research timelines (Research use case) ── */

const researchResponse1 = `Found several key papers on quantum error correction:

1. **Google's Willow chip** (Acharya et al., 2024) — first demonstration of below-threshold error correction with surface codes. Logical error rate decreases exponentially as code distance increases from 3 to 7.

2. **Microsoft's topological qubits** (Aghaee et al., 2025) — non-Abelian anyons in a topological superconductor, potentially enabling hardware-level error protection.

3. **IBM's error mitigation at scale** (Kim et al., 2024) — 127-qubit circuits with probabilistic error cancellation, achieving useful results without full fault tolerance.

Want me to compare their approaches?`

const researchResponse2 = `Here's a comparison of the three approaches:

- **Surface codes** (Google) — 105 qubits, 10^-6 logical error rate, ~1000:1 overhead. Works today but needs massive qubit counts.
- **Topological** (Microsoft) — 12 qubits, error rate TBD, ~10:1 theoretical overhead. Could be revolutionary but unproven at scale.
- **Error mitigation** (IBM) — 127 qubits, classical post-processing, polynomial overhead. Sidesteps the problem but limits circuit depth.

Key tradeoff: Google's approach is proven but expensive. Microsoft's could be a breakthrough but needs validation. IBM's is practical today but fundamentally limited.`

const researchResponse3 = `Here are the primary sources:

1. **Acharya et al.** "Quantum error correction below the surface code threshold" — Nature 2024 — 342 citations
2. **Aghaee et al.** "Interferometric single-shot parity measurement" — Nature 2025 — 89 citations
3. **Kim et al.** "Evidence for the utility of quantum computing before fault tolerance" — Nature 2024 — 567 citations

All three are open-access on arXiv. The Google paper also has a companion blog post with visualizations.`

export const researchTimeline: TimelineStep[] = [
  // ── Turn 1 ──
  { id: "rs-i1", type: "input-typing", content: "What are the latest advances in quantum error correction?", duration: 1300 },
  { id: "rs-u1", type: "user-message", content: "What are the latest advances in quantum error correction?" },
  { id: "rs-t1a", type: "tool-call", toolName: "Thinking", toolDetail: "formulating search strategy…", duration: 2000, toolVariant: "thinking", thoughtContent: "Quantum error correction has had major breakthroughs recently. I should search for papers from 2024-2025, focusing on surface codes (Google), topological qubits (Microsoft), and error mitigation (IBM)." },
  { id: "rs-t1b", type: "tool-call", toolName: "Search Papers", toolDetail: "arXiv + Nature, 2024-2025", duration: 2000 },
  { id: "rs-t1c", type: "tool-call", toolName: "Rank by Citations", toolDetail: "top 10, quantum error correction", duration: 1600 },
  { id: "rs-t1d", type: "tool-call", toolName: "Extract Key Findings", toolDetail: "3 papers, methodology + results", duration: 1600 },
  { id: "rs-a1", type: "assistant-stream", content: researchResponse1 },
  { id: "rs-p1", type: "pause", duration: 1200 },
  // ── Turn 2 ──
  { id: "rs-i2", type: "input-typing", content: "Yes, compare them side by side", duration: 900 },
  { id: "rs-u2", type: "user-message", content: "Yes, compare them side by side" },
  { id: "rs-t2a", type: "tool-call", toolName: "Thinking", toolDetail: "building comparison…", duration: 1800, toolVariant: "thinking", thoughtContent: "I'll create a structured comparison covering qubit count, logical error rates, overhead requirements, and practical readiness. The key tradeoff is between proven but expensive (Google), revolutionary but unproven (Microsoft), and practical but limited (IBM)." },
  { id: "rs-t2b", type: "tool-call", toolName: "Analyze Methods", toolDetail: "surface codes vs topological vs mitigation", duration: 2000 },
  { id: "rs-a2", type: "assistant-stream", content: researchResponse2 },
  { id: "rs-p2", type: "pause", duration: 1000 },
  // ── Turn 3 ──
  { id: "rs-i3", type: "input-typing", content: "Give me the paper links and citation counts", duration: 900 },
  { id: "rs-u3", type: "user-message", content: "Give me the paper links and citation counts" },
  { id: "rs-t3a", type: "tool-call", toolName: "Thinking", toolDetail: "gathering citations…", duration: 1400, toolVariant: "thinking", thoughtContent: "I'll pull the exact arXiv IDs, citation counts from Semantic Scholar, and check which ones have open-access full text available." },
  { id: "rs-t3b", type: "tool-call", toolName: "Fetch Citations", toolDetail: "Semantic Scholar API, 3 papers", duration: 1800 },
  { id: "rs-t3c", type: "tool-call", toolName: "Resolve arXiv IDs", toolDetail: "full metadata + URLs", duration: 1200 },
  { id: "rs-a3", type: "assistant-stream", content: researchResponse3 },
]

export const notionResearchTimeline: TimelineStep[] = [
  // ── Turn 1 ──
  { id: "nrs-i1", type: "input-typing", content: "What are the latest advances in quantum error correction?", duration: 1300 },
  { id: "nrs-u1", type: "user-message", content: "What are the latest advances in quantum error correction?" },
  { id: "nrs-t1a", type: "tool-call", toolName: "Thinking", toolDetail: "formulating search strategy…", duration: 2000, toolVariant: "thinking", thoughtContent: "Quantum error correction has had major breakthroughs recently. I should search for papers from 2024-2025, focusing on surface codes (Google), topological qubits (Microsoft), and error mitigation (IBM)." },
  { id: "nrs-t1b", type: "tool-call", toolName: "Search Papers", toolDetail: "arXiv + Nature, 2024-2025", duration: 2000, toolVariant: "search", searchQuery: "quantum error correction 2024-2025 breakthroughs", searchSource: "arxiv" },
  { id: "nrs-t1c", type: "tool-call", toolName: "Rank by Citations", toolDetail: "top 10, quantum error correction", duration: 1600, toolVariant: "search", searchQuery: "most cited quantum error correction papers", searchSource: "scholar" },
  { id: "nrs-t1d", type: "tool-call", toolName: "Extract Key Findings", toolDetail: "3 papers, methodology + results", duration: 1600, toolVariant: "action" },
  { id: "nrs-a1", type: "assistant-stream", content: researchResponse1 },
  { id: "nrs-p1", type: "pause", duration: 1200 },
  // ── Turn 2 ──
  { id: "nrs-i2", type: "input-typing", content: "Yes, compare them side by side", duration: 900 },
  { id: "nrs-u2", type: "user-message", content: "Yes, compare them side by side" },
  { id: "nrs-t2a", type: "tool-call", toolName: "Thinking", toolDetail: "building comparison…", duration: 1800, toolVariant: "thinking", thoughtContent: "I'll create a structured comparison covering qubit count, logical error rates, overhead requirements, and practical readiness. The key tradeoff is between proven but expensive (Google), revolutionary but unproven (Microsoft), and practical but limited (IBM)." },
  { id: "nrs-t2b", type: "tool-call", toolName: "Analyze Methods", toolDetail: "surface codes vs topological vs mitigation", duration: 2000, toolVariant: "search", searchQuery: "comparison surface codes topological qubits error mitigation", searchSource: "scholar" },
  { id: "nrs-a2", type: "assistant-stream", content: researchResponse2 },
  { id: "nrs-p2", type: "pause", duration: 1000 },
  // ── Turn 3 ──
  { id: "nrs-i3", type: "input-typing", content: "Give me the paper links and citation counts", duration: 900 },
  { id: "nrs-u3", type: "user-message", content: "Give me the paper links and citation counts" },
  { id: "nrs-t3a", type: "tool-call", toolName: "Thinking", toolDetail: "gathering citations…", duration: 1400, toolVariant: "thinking", thoughtContent: "I'll pull the exact arXiv IDs, citation counts from Semantic Scholar, and check which ones have open-access full text available." },
  { id: "nrs-t3b", type: "tool-call", toolName: "Fetch Citations", toolDetail: "Semantic Scholar API, 3 papers", duration: 1800, toolVariant: "search", searchQuery: "citation count quantum error correction Acharya Aghaee Kim", searchSource: "scholar" },
  { id: "nrs-t3c", type: "tool-call", toolName: "Resolve arXiv IDs", toolDetail: "full metadata + URLs", duration: 1200, toolVariant: "action" },
  { id: "nrs-a3", type: "assistant-stream", content: researchResponse3 },
]
