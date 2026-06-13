# @21st-sdk/react

React components for building AI agent chat UIs powered by [21st Agents](https://21st.dev/agents). Drop-in chat interface with tool renderers, theming, and full customization.

Built on [Vercel AI SDK v5](https://sdk.vercel.ai) — no custom hooks or state management. Just components.

## Install

```bash
npm install @21st-sdk/react ai @ai-sdk/react
```

## Quick Start

```tsx
"use client";

import { useChat } from "@ai-sdk/react";
import { AgentChat, createAgentChat } from "@21st-sdk/react";
import "@21st-sdk/react/styles.css";
import { useMemo } from "react";

export default function Chat() {
  const chat = useMemo(
    () =>
      createAgentChat({
        agent: "your-agent-slug",
        getToken: async () => "your_21st_token",
      }),
    [],
  );

  const { messages, sendMessage, status, stop, error } = useChat({ chat });

  return (
    <AgentChat
      messages={messages}
      onSend={(msg) =>
        sendMessage({
          parts: [{ type: "text", text: msg.content }],
        })
      }
      status={status}
      onStop={stop}
      error={error}
    />
  );
}
```

That's it. You get a full chat UI with message rendering, tool visualization, auto-scroll, and streaming — all wired to your deployed agent.

## Customization

Four levels of customization, from simple to full control:

### 1. Theme tokens

Apply a theme JSON from the [Playground](https://21st.dev/agents/playground):

```tsx
<AgentChat theme={playgroundTheme} colorMode="dark" />
```

### 2. Class overrides

Override styles per element:

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

Swap sub-components entirely:

```tsx
<AgentChat
  slots={{
    InputBar: MyCustomInput,
    UserMessage: MyUserBubble,
    ToolRenderer: MyToolRenderer,
  }}
/>
```

### 4. Individual components

Build from scratch with individual imports:

```tsx
import { MessageList, InputBar, ToolRenderer } from "@21st-sdk/react";
```

## CSS

Import the stylesheet once in your app:

```tsx
import "@21st-sdk/react/styles.css";
```

No Tailwind peer dependency required — CSS is pre-compiled. All elements have stable `an-*` class names for custom styling:

```css
.an-root { }
.an-message-list { }
.an-user-message { }
.an-assistant-message { }
.an-input-bar { }
.an-send-button { }
.an-tool-bash { }
.an-tool-edit { }
/* ... */
```

## API Reference

### `createAgentChat(options)`

Creates an AI SDK `Chat` instance pointed at the relay API.

```ts
createAgentChat({
  agent: string;           // Agent slug from your dashboard
  getToken: () => Promise<string>;  // Returns a short-lived token
  apiUrl?: string;         // Default: "https://relay.an.dev"
  projectId?: string;      // Session persistence key
  onFinish?: () => void;
  onError?: (error: Error) => void;
})
```

Returns a standard `Chat<UIMessage>` — pass it to `useChat({ chat })`.

### `<AgentChat />`

Drop-in chat component.

| Prop | Type | Description |
|------|------|-------------|
| `messages` | `UIMessage[]` | From `useChat()` |
| `onSend` | `(msg) => void` | Send handler |
| `status` | `ChatStatus` | `"ready" \| "submitted" \| "streaming" \| "error"` |
| `onStop` | `() => void` | Stop generation |
| `error` | `Error` | Error to display |
| `theme` | `ChatTheme` | Theme from playground |
| `colorMode` | `"light" \| "dark" \| "auto"` | Color mode |
| `classNames` | `Partial<ChatClassNames>` | Per-element CSS overrides |
| `slots` | `Partial<ChatSlots>` | Component swapping |
| `className` | `string` | Root element class |
| `style` | `CSSProperties` | Root element style |
| `modelSelector` | `{ models, activeModelId?, onModelChange? }` | Model picker (for custom backends) |
| `attachments` | `{ onAttach?, images?, files? }` | File attachment support |

### `applyTheme(element, theme, colorMode?)`

Manually inject CSS variables from a playground theme JSON.

### Components

| Component | Description |
|-----------|-------------|
| `MessageList` | Auto-scrolling message container with grouping |
| `UserMessage` | User message bubble |
| `AssistantMessage` | Assistant response with parts routing |
| `StreamingMarkdown` | Markdown renderer with syntax highlighting |
| `InputBar` | Text input with send/stop buttons |
| `MessageActions` | Copy button |
| `ToolRenderer` | Routes tool parts to the correct component |

### Tool Components

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

## Theme Type

```ts
interface ChatTheme {
  theme: Record<string, string>;  // Shared: font, spacing, accent
  light: Record<string, string>;  // Light mode CSS vars
  dark: Record<string, string>;   // Dark mode CSS vars
}
```

## Model Selection

The SDK exports pre-defined model constants for convenience:

```ts
import { CLAUDE_MODELS, DEFAULT_MODEL_ID } from "@21st-sdk/react"
import type { ModelOption, ClaudeModelId } from "@21st-sdk/react"
```

> **Note:** When using `createAgentChat()` with the relay, the model is set server-side in the agent config. The `modelSelector` prop is for building UIs with custom backends.

## License

MIT
