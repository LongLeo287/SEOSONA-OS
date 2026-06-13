# React UI

`@21st-sdk/react` provides a full chat UI for AN agents. Built on [Vercel AI SDK v5](https://sdk.vercel.ai) — uses standard `useChat()` from `@ai-sdk/react`.

## Install

```bash
npm install @21st-sdk/react ai @ai-sdk/react
```

## Basic Usage

```tsx
"use client"

import { useChat } from "@ai-sdk/react"
import { AgentChat, createAgentChat } from "@21st-sdk/react"
import "@21st-sdk/react/styles.css"
import { useMemo } from "react"

export default function Chat() {
  const chat = useMemo(
    () => createAgentChat({
      agent: "your-agent-slug",
      getToken: async () => "your_21st_token",
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

## `createAgentChat(options)`

Creates an AI SDK `Chat` instance pointed at the AN Relay.

```ts
createAgentChat({
  agent: string              // Agent slug from dashboard
  tokenUrl?: string          // POST endpoint that returns { token }
  getToken?: () => Promise<string>  // Or custom token function
  apiUrl?: string            // Default: "https://relay.an.dev"
  sandboxId?: string         // Persistent sandbox environment ID
  threadId?: string          // Conversation thread within sandbox
  onFinish?: () => void
  onError?: (error: Error) => void
})
```

For Next.js apps, use `tokenUrl` instead of `getToken` — see [Next.js Integration](./05-nextjs.md).

## `<AgentChat />` Props

| Prop | Type | Description |
|------|------|-------------|
| `messages` | `UIMessage[]` | From `useChat()` |
| `onSend` | `(msg) => void` | Send handler |
| `status` | `ChatStatus` | `"ready" \| "submitted" \| "streaming" \| "error"` |
| `onStop` | `() => void` | Stop generation |
| `error` | `Error` | Error to display |
| `theme` | `ChatTheme` | Theme from playground |
| `colorMode` | `"light" \| "dark" \| "auto"` | Color mode (default: `"auto"`) |
| `classNames` | `Partial<ChatClassNames>` | Per-element CSS overrides |
| `slots` | `Partial<ChatSlots>` | Component swapping |
| `toolRenderers` | `Record<string, ComponentType>` | Custom tool renderers by name |
| `showWindowChrome` | `boolean` | Show window chrome header |
| `modelSelector` | `object` | Model selector configuration |
| `modeSelector` | `object` | Mode selector configuration |
| `attachments` | `object` | Attachment configuration |
| `className` | `string` | Root element class |

## Customization

Four levels, from simple to full control:

### 1. Theme tokens

Apply a theme JSON from the [AN Playground](https://21st.dev/agents/playground):

```tsx
<AgentChat theme={playgroundTheme} colorMode="dark" />
```

### 2. Class overrides

```tsx
<AgentChat
  classNames={{
    root: "rounded-2xl border",
    messageList: "px-8",
    inputBar: "bg-gray-50",
    userMessage: "bg-blue-100",
  }}
/>
```

### 3. Slot components

Swap sub-components:

```tsx
<AgentChat
  slots={{
    InputBar: MyCustomInput,
    UserMessage: MyUserBubble,
    ToolRenderer: MyToolRenderer,
  }}
/>
```

### 4. Individual component imports

```tsx
import { MessageList, InputBar, ToolRenderer } from "@21st-sdk/react"
```

## CSS

Import once in your app:

```tsx
import "@21st-sdk/react/styles.css"
```

No Tailwind peer dependency — CSS is pre-compiled. All elements have stable `an-*` class names:

```css
.an-root { }
.an-message-list { }
.an-user-message { }
.an-assistant-message { }
.an-input-bar { }
.an-send-button { }
.an-tool-bash { }
.an-tool-edit { }
```

## Theme Type

```ts
interface ChatTheme {
  theme: Record<string, string>  // Shared: font, spacing, accent
  light: Record<string, string>  // Light mode CSS vars
  dark: Record<string, string>   // Dark mode CSS vars
}
```

## `applyTheme(element, theme, colorMode?)`

Manually inject CSS variables from a theme JSON onto a DOM element.

## Components

| Component | Description |
|-----------|-------------|
| `MessageList` | Auto-scrolling message container with grouping |
| `UserMessage` | User message bubble |
| `AssistantMessage` | Assistant response with parts routing |
| `StreamingMarkdown` | Markdown renderer with syntax highlighting |
| `InputBar` | Text input with send/stop buttons |
| `MessageActions` | Copy button |
| `ToolRenderer` | Routes tool parts to the correct component |

## Built-in Tool Renderers

| Component | Renders |
|-----------|---------|
| `BashTool` | Terminal commands with output |
| `EditTool` | File edits with diff display |
| `WriteTool` | File creation |
| `SearchTool` | Web search results |
| `TodoTool` | Task checklists |
| `PlanTool` | Step-by-step plans |
| `TaskTool` | Sub-agent tasks |
| `McpTool` | MCP protocol calls |
| `ThinkingTool` | Reasoning/thinking indicator |
| `GenericTool` | Fallback for unknown tools |

See [Custom Tools](./08-custom-tools.md) for building your own tool renderers.
