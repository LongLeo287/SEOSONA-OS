# Agents Landing Page — Content Map

## Nav

- **Logo:** 21st
- **Links:** Docs · Templates
- **Actions:** Search docs `⌘K` · GitHub · Theme toggle · Dashboard / Sign in

---

## Hero

> *Badge:* Backed by Y Combinator

# Define. Deploy. Run.
### Agent infrastructure.

**Subheading:**
Agent runtime with tools, billing, and access controls built in.

**CTAs:** `Get started` · `Read docs`

**Works with:** Next.js · React · TypeScript · Python · OpenAI · Vercel · Node.js · + any framework

---

## Platform — Configure. Deploy. Run at scale.

> *Overline:* Platform

### Architecture diagram (illustration)

```
[ Your Code ]  ──define──▶  [ 21st Agents SDK ]  ──serve──▶  [ Your Users ]
 "You build this"              "We handle all of this"           "Drop-in UI"
```

**Your Code box:**
```js
export default agent({
  tools,
  prompt,
})
```

**21st Agents SDK box** (powered by Claude Code SDK):
| Feature | Detail |
|---|---|
| E2B Sandboxes | Isolated VM per session |
| Streaming | Token-by-token via SSE |
| Auth & Limits | Tokens, rate limits, spend caps |
| Observability | Session replay & traces |

**Your Users box:** chat UI mockup (message bubbles + input bar)

**Mobile steps:**
1. You define the agent
2. SDK handles the rest
3. Users get a chat UI

---

### Three steps to a production agent.

**01 — Define**
Pick your runtime. Add your tools and system prompt.
```js
import { agent, tool } from "@21st-sdk/agent"

export default agent({
  runtime: 'claude-code',
  model: 'claude-sonnet-4-6',
  tools: { search, createTicket },
})
```

**02 — Deploy**
One command. Sandboxes, auth, observability — handled.
```bash
$ npx @21st-sdk/cli deploy
```

**03 — Use**
Use the SDK to run threads, or embed the chat UI in your app.

*API call tab:*
```js
const { response } = await an.threads.run({
  agent: 'my-agent',
  messages: [{ role: 'user', parts: [{ type: 'text', text: 'Explain this repo' }] }]
})
```

*Chat UI tab:*
```jsx
import { AnAgentChat } from "@21st-sdk/nextjs"

<AnAgentChat
  messages={messages}
  onSend={handleSubmit}
  status={status}
/>
```

---

## Bento Strip — Build

> *Overline:* Build

### Your agent, your tools.

Pick a runtime. Drop in the UI. Focus on what makes your agent unique.

**Card 1 — Runtimes** *(amber glow)*
Run agents on Claude Code or Codex. Frontier models with tool use, sandboxed execution, and file access out of the box.

*Illustration:* Agent provider selector toggle (Claude / Codex) + interactive mini chat UI mockup

**Card 2 — Drop-in UI** *(violet glow)*
Add `<AnAgentChat />` to your app. Polished chat UI with streaming and file attachments — one component.

*Illustration:* Live animated chat preview with streaming messages

---

## Bento Strip — Ship

> *Overline:* Ship (or Deploy)

### Deploy without the infra.

Sandboxed execution, API auth, real-time streaming — handled.

**Card 1 — Streaming** *(blue glow)*
Token-by-token streaming with progressive markdown rendering. Your users see the agent think in real time.

*Illustration:* Streaming markdown chunks animation

**Card 2 — Reliability** *(green glow)*
Auto-retries, rate limits, graceful recovery. Infrastructure you don't have to build.

*Illustration:* Uptime grid display with tags: `auto-retry` · `fallback` · `rate-limit`

---

## Bento Strip — Scale / Run

> *Overline:* Scale (or Run)

### See everything. Control everything.

Replay sessions, trace tool calls, cap spend per user.

**Card 1 — Observability** *(purple glow)*
See every conversation your agent has. Replay sessions, trace tool calls, debug in seconds.

*Illustration:* Timeline replay with segments — User · Search · Action · Reply

**Card 2 — Billing** *(orange glow)* `SOON`
Cap how much each user spends on AI. Metering, quotas, and limits — handled for you.

*Illustration:* Usage meter showing `$4.80 / $20 spent` · `$20/mo limit` · `Overage: block`

---

## Use Cases — Where it runs.

> *Overline:* Use cases

**Card 1 — Agents in your product** *(violet glow)*
Your customers interact with AI agents inside your app. Billing, auth, and streaming UI are already there.

*Illustration:* Chat widget floating in a product UI

**Card 2 — Agents on your backend** *(green glow)*
Your API calls agents to process data, automate workflows, run analysis. All in sandboxed environments you don't have to manage.

*Illustration:*
```js
const result = await agent.run({ input })
// result.output received
```

**Card 3 — Agents from CLI** *(amber glow)*
Run agents locally or remotely. Isolated sandboxes, full tool access, results back to your terminal.

*Illustration:*
```bash
$ npx 21st agent run my-agent
▶ Provisioning sandbox...
▶ Loading tools...
✓ Agent ready
```

---

## FAQ — How is this different?

> *Overline:* FAQ

**Q: How is this different from AI SDK or Mastra?**
They give you code primitives to write agent logic — model calls, tools, workflows, memory. We give you a platform to configure, deploy, and run that agent in production with sandboxing, billing, and access controls. They're for building. We're for running. Use both.

*Illustration:* Build vs Run diagram — Your code (tools, prompts, logic) → 21st (E2B sandbox, SSE streaming, auth · billing)

**Q: Can I use my existing agent code?**
Yes. If it runs on Claude Agent SDK, OpenAI Agents SDK, Mastra, or AI SDK — it deploys to 21st. We're not a framework. We're infrastructure.

*Illustration:* Plugin diagram with framework logos connecting to 21st

**Q: Do I have to use your UI components?**
No. UI is optional. Most of the platform works headlessly — API, CLI, backend. The streaming UI components are there when you need them.

*Illustration:*
```
HTTP  →  /v1/chat/:slug
SDK   →  AI SDK transport
UI    →  <AgentChat />  (optional)
```

---

## Templates — Start from a template.

> *Overline:* Templates | **Link:** View all →

*3 featured templates displayed as cards with name, description, and stack tags*

---

## Build vs. Buy — Your team shouldn't build agent infrastructure.

> *Overline:* Build vs. buy

Mandatory, non-differentiating work. We built it so you don't have to.

| Feature | Without 21st | With 21st |
|---|---|---|
| User sessions & chat history | Build from scratch | Included |
| Streaming & reliability | Custom WebSocket layer | Included |
| Sandboxed tool execution | Manage infra yourself | Included |
| Usage limits & plans | Build plan logic + metering | Included |
| Traces & debugging | Stitch observability tools | Included |
| Agent UI components | Design & build from zero | Included |

---

## CTA — Ship today. Win tomorrow.

> *Overline:* Early access

Everything you need to ship an AI agent in your product.

**CTAs:** `Get started` · `Talk to founders`

*Decorative tags:* sessions ✓ · billing ✓ · ui ✓ · traces ✓ · limits ✓ · sdk ✓

---

## Footer

- Agents by 21st
- founders@21st.dev
