# @21st-sdk/nextjs

Next.js integration for [21st Agents](https://21st.dev/agents) AI agent chat. Provides a server-side token handler so your API key never reaches the client.

## Install

```bash
npm install @21st-sdk/nextjs @21st-sdk/react ai @ai-sdk/react
```

## Quick Start

### 1. Set your API key

```env
# .env.local
API_KEY_21ST=21st_sk_your_key_here
```

Get your API key from [the API keys page](https://21st.dev/agents/api-keys).

### 2. Create the token route (one line)

```ts
// app/api/agent/token/route.ts
import { createTokenHandler } from "@21st-sdk/nextjs/server"

export const POST = createTokenHandler({
  apiKey: process.env.API_KEY_21ST!,
})
```

### 3. Use in your page

```tsx
// app/page.tsx
"use client"

import { useChat } from "@ai-sdk/react"
import { AgentChat, createAgentChat } from "@21st-sdk/nextjs"
import "@21st-sdk/react/styles.css"
import { useMemo } from "react"

export default function Chat() {
  const chat = useMemo(
    () => createAgentChat({
      agent: "your-agent-slug",
      tokenUrl: "/api/agent/token",
    }),
    [],
  )

  const { messages, sendMessage, status, stop, error } = useChat({ chat })

  return (
    <AgentChat
      messages={messages}
      onSend={(msg) =>
        sendMessage({ parts: [{ type: "text", text: msg.content }] })
      }
      status={status}
      onStop={stop}
      error={error}
    />
  )
}
```

That's it. Your `21st_sk_` API key stays on the server. Legacy `an_sk_` keys still work. The client only receives short-lived JWTs.

## How It Works

```
Browser                     Your Next.js Server              Relay
  |                                |                            |
  |-- POST /api/agent/token ------>|                            |
  |                                |-- POST /v1/tokens -------->|
  |                                |   (with API key)           |
  |                                |<-- { token, expiresAt } ---|
  |<-- { token, expiresAt } ------|                            |
  |                                                             |
  |-- POST /v1/chat/:agent ------(with short-lived JWT)------->|
  |<-- streaming response -----(SSE)---------------------------|
```

## License

MIT
