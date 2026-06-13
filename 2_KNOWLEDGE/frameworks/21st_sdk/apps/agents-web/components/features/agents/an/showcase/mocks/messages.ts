import type { UIMessage } from "ai"
import {
  createBashParts,
  createEditParts,
  createSearchParts,
  createTodoParts,
  createPlanParts,
  createThinkingParts,
  createGenericParts,
} from "./tool-parts"

const bash = createBashParts()
const edit = createEditParts()
const search = createSearchParts()
const todo = createTodoParts()
const plan = createPlanParts()
const thinking = createThinkingParts()
const generic = createGenericParts()

export const MOCK_MESSAGES: UIMessage[] = [
  {
    id: "msg-1",
    role: "user",
    parts: [{ type: "text", text: "Help me refactor the authentication module to use JWT instead of sessions." }],
    createdAt: new Date("2025-02-20T10:00:00"),
  } as UIMessage,
  {
    id: "msg-2",
    role: "assistant",
    parts: [
      { type: "text", text: "I'll help you refactor the authentication module. Let me start by examining the current code." },
      thinking.completed,
      generic.read,
      generic.grep,
      bash.completed,
      { type: "text", text: "I can see the current session-based auth setup. Let me create a plan for the migration." },
      plan.inProgress,
    ],
    createdAt: new Date("2025-02-20T10:00:05"),
  } as UIMessage,
  {
    id: "msg-3",
    role: "user",
    parts: [{ type: "text", text: "Looks good! Let's start with the JWT utility." }],
    createdAt: new Date("2025-02-20T10:01:00"),
  } as UIMessage,
  {
    id: "msg-4",
    role: "assistant",
    parts: [
      { type: "text", text: "I'll implement the JWT utility now." },
      edit.completed,
      todo.creation,
      search.completed,
      { type: "text", text: "The JWT utility has been created and I've set up the task list. I also found some best practices from the web search that I've incorporated." },
    ],
    createdAt: new Date("2025-02-20T10:01:05"),
  } as UIMessage,
  {
    id: "msg-5",
    role: "user",
    parts: [{ type: "text", text: "Can you also search for any existing auth patterns we might want to follow?" }],
    createdAt: new Date("2025-02-20T10:02:00"),
  } as UIMessage,
  {
    id: "msg-6",
    role: "assistant",
    parts: [
      { type: "text", text: "Sure, let me search the codebase and the web for auth patterns." },
      generic.glob,
      generic.webFetch,
      {
        type: "text",
        text: "I found several patterns. Here's a summary:\n\n1. **Token-based auth** with short-lived access tokens\n2. **Refresh token rotation** for security\n3. **HTTP-only cookies** for token storage\n\nWould you like me to implement any specific pattern?",
      },
    ],
    createdAt: new Date("2025-02-20T10:02:05"),
  } as UIMessage,
]

/** Short conversation for component previews */
export const MOCK_SHORT_MESSAGES: UIMessage[] = [
  {
    id: "short-1",
    role: "user",
    parts: [{ type: "text", text: "Hello! Can you help me build a React component?" }],
    createdAt: new Date("2025-02-20T10:00:00"),
  } as UIMessage,
  {
    id: "short-2",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: "Of course! I'd be happy to help you build a React component. What kind of component are you looking to create?\n\nHere are some common patterns:\n\n- **Form components** with validation\n- **Data display** components like tables and cards\n- **Navigation** components\n- **Interactive** components like modals and dropdowns\n\nLet me know what you need!",
      },
    ],
    createdAt: new Date("2025-02-20T10:00:05"),
  } as UIMessage,
  {
    id: "short-3",
    role: "user",
    parts: [{ type: "text", text: "I need a button component with variants." }],
    createdAt: new Date("2025-02-20T10:01:00"),
  } as UIMessage,
]

/** Single user message for UserMessage preview */
export const MOCK_USER_MESSAGE: UIMessage = {
  id: "user-1",
  role: "user",
  parts: [{ type: "text", text: "Can you refactor this function to use async/await instead of callbacks?" }],
  createdAt: new Date("2025-02-20T10:00:00"),
} as UIMessage

/** Single assistant message with markdown for preview */
export const MOCK_ASSISTANT_MESSAGE: UIMessage = {
  id: "assistant-1",
  role: "assistant",
  parts: [
    {
      type: "text",
      text: "Here's the refactored version:\n\n```typescript\nasync function fetchData(url: string) {\n  const response = await fetch(url)\n  const data = await response.json()\n  return data\n}\n```\n\nKey changes:\n- Replaced callback pattern with `async/await`\n- Added proper error handling\n- Simplified the control flow",
    },
    bash.completed,
    edit.completed,
  ],
  createdAt: new Date("2025-02-20T10:00:05"),
} as UIMessage

export const MARKDOWN_SAMPLE = `# Heading 1

## Heading 2

Regular paragraph with **bold**, *italic*, and \`inline code\`.

- List item 1
- List item 2
  - Nested item

1. Ordered item 1
2. Ordered item 2

\`\`\`typescript
interface User {
  id: string
  name: string
  email: string
}

async function getUser(id: string): Promise<User> {
  const response = await fetch(\`/api/users/\${id}\`)
  return response.json()
}
\`\`\`

> Blockquote with some interesting text.

[Link to docs](https://example.com)

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
`
