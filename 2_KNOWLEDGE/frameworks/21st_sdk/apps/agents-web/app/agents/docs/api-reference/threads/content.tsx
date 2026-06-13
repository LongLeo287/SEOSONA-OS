"use client"

import {
  RELAY_URL,
  useResolvedCredentials,
  EndpointSection,
  CodeBlock,
  ResponseField,
} from "../_shared"
import { CopyMarkdownButton } from "@/components/features/agents/an/docs/copy-markdown-button"

const THREAD_CREATE_BODY = `{
  "name": "Chat 1"
}`

const THREAD_CREATE_RESPONSE = `{
  "id": "th_xyz789",
  "name": "Chat 1",
  "status": "active",
  "createdAt": "2026-02-26T12:00:00Z"
}`

const THREAD_LIST_RESPONSE = `[
  {
    "id": "th_xyz789",
    "name": "Chat 1",
    "status": "completed",
    "createdAt": "2026-02-26T12:00:00Z",
    "updatedAt": "2026-02-26T12:05:00Z"
  }
]`

const THREAD_GET_RESPONSE = `{
  "id": "th_xyz789",
  "name": "Chat 1",
  "status": "completed",
  "messages": [
    { "role": "user", "content": "Hello" },
    { "role": "assistant", "content": "Hi there!" }
  ],
  "createdAt": "2026-02-26T12:00:00Z",
  "updatedAt": "2026-02-26T12:05:00Z"
}`

function getCurlList(apiKey: string) {
  return `curl ${RELAY_URL}/v1/sandboxes/sb_abc123/threads \\
  -H "Authorization: Bearer ${apiKey}"`
}

function getCurlCreate(apiKey: string) {
  return `curl -X POST ${RELAY_URL}/v1/sandboxes/sb_abc123/threads \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{ "name": "Chat 1" }'`
}

export function ThreadsContent() {
  const { resolvedApiKey, isReal } = useResolvedCredentials()

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">Threads</h1>
          <CopyMarkdownButton />
        </div>
        <p className="mt-1.5 text-[14px] text-muted-foreground">
          A thread is a conversation within a sandbox. Each thread has its own message history, status, and cost tracking.
        </p>
      </div>

      <EndpointSection
        id="list-threads"
        method="GET"
        path="/v1/sandboxes/:id/threads"
        title="List Threads"
        description="Returns all threads within a sandbox."
        params={[
          { name: "id", type: "string", required: true, description: "Sandbox ID" },
        ]}
      >
        <ResponseField>
          <CodeBlock language="json" code={THREAD_LIST_RESPONSE} />
        </ResponseField>
        <CodeBlock language="bash" code={getCurlList(resolvedApiKey)} secret={isReal} filename="cURL" />
      </EndpointSection>

      <EndpointSection
        id="create-thread"
        method="POST"
        path="/v1/sandboxes/:id/threads"
        title="Create Thread"
        description="Creates a new conversation thread in a sandbox."
        params={[
          { name: "id", type: "string", required: true, description: "Sandbox ID" },
        ]}
        bodyParams={[
          { name: "name", type: "string", required: false, description: "Display name for the thread" },
        ]}
      >
        <CodeBlock language="json" code={THREAD_CREATE_BODY} filename="Request Body" />
        <ResponseField>
          <CodeBlock language="json" code={THREAD_CREATE_RESPONSE} />
        </ResponseField>
        <CodeBlock language="bash" code={getCurlCreate(resolvedApiKey)} secret={isReal} filename="cURL" />
      </EndpointSection>

      <EndpointSection
        id="get-thread"
        method="GET"
        path="/v1/sandboxes/:id/threads/:threadId"
        title="Get Thread"
        description="Retrieves a thread with its full message history."
        params={[
          { name: "id", type: "string", required: true, description: "Sandbox ID" },
          { name: "threadId", type: "string", required: true, description: "Thread ID" },
        ]}
      >
        <ResponseField>
          <CodeBlock language="json" code={THREAD_GET_RESPONSE} />
        </ResponseField>
      </EndpointSection>

      <EndpointSection
        id="delete-thread"
        method="DELETE"
        path="/v1/sandboxes/:id/threads/:threadId"
        title="Delete Thread"
        description="Deletes a thread and its message history."
        params={[
          { name: "id", type: "string", required: true, description: "Sandbox ID" },
          { name: "threadId", type: "string", required: true, description: "Thread ID" },
        ]}
      >
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          Returns <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">204 No Content</code> on success.
        </p>
      </EndpointSection>
    </div>
  )
}
