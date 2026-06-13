"use client"

import {
  RELAY_URL,
  useResolvedCredentials,
  EndpointSection,
  CodeBlock,
} from "../_shared"
import { CopyMarkdownButton } from "@/components/features/agents/an/docs/copy-markdown-button"
import { agentsHref } from "@/lib/utils/agents-href"

const SSE_RESPONSE = `data: {"type":"start"}

data: {"type":"text-start","id":"txt_01"}
data: {"type":"text-delta","id":"txt_01","delta":"Let me check "}
data: {"type":"text-delta","id":"txt_01","delta":"that file."}
data: {"type":"text-end","id":"txt_01"}

data: {"type":"tool-input-start","toolCallId":"tc_01","toolName":"Read"}
data: {"type":"tool-input-delta","toolCallId":"tc_01","inputTextDelta":"{\\"file_path\\":\\"/src/index.ts\\"}"}
data: {"type":"tool-input-available","toolCallId":"tc_01","toolName":"Read","input":{"file_path":"/src/index.ts"}}
data: {"type":"tool-output-available","toolCallId":"tc_01","output":"const app = ..."}

data: {"type":"text-start","id":"txt_02"}
data: {"type":"text-delta","id":"txt_02","delta":"Here's what I found..."}
data: {"type":"text-end","id":"txt_02"}

data: {"type":"message-metadata","messageMetadata":{
  "sessionId":"...",
  "totalCostUsd":0.034,
  "inputTokens":1250,
  "outputTokens":340,
  "durationMs":2487
}}
data: {"type":"finish"}
data: [DONE]`

const REQUEST_BODY = `{
  "sandboxId": "uuid-of-existing-sandbox",
  "vaultIds": ["a1b2c3d4-5678-90ab-cdef-000000000002"],
  "options": {
    "systemPrompt": {
      "type": "preset",
      "preset": "claude_code",
      "append": "Focus on regressions, risky edge cases, and missing tests. Do not edit files."
    },
    "maxTurns": 4,
    "maxBudgetUsd": 0.2,
    "disallowedTools": ["Bash"]
  },
  "messages": [
    {
      "id": "msg-1",
      "role": "user",
      "parts": [{ "type": "text", "text": "Your message" }]
    }
  ]
}`

function getCurlExample(slug: string, apiKey: string) {
  return `curl -N -X POST ${RELAY_URL}/v1/chat/${slug} \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "sandboxId": "uuid-of-existing-sandbox",
    "messages": [{
      "id": "msg-1",
      "role": "user",
      "parts": [{ "type": "text", "text": "Hello" }]
    }]
  }'`
}

function getRawReactExample(slug: string, apiKey: string) {
  return `import { Chat, DefaultChatTransport } from "ai"
import { useChat } from "@ai-sdk/react"

const sandboxId = "sb_abc123" // Use the sandbox ID returned by your server

const chat = new Chat({
  transport: new DefaultChatTransport({
    api: "${RELAY_URL}/v1/chat/${slug}",
    headers: async () => ({
      Authorization: "Bearer ${apiKey}",
    }),
    body: {
      sandboxId,
      // threadId: "uuid-of-existing-thread",
    },
  }),
})

export function AgentChat() {
  const { messages, sendMessage } = useChat({ chat })

  return (
    <div>
      {messages.map((m) => <div key={m.id}>{m.content}</div>)}
      <button onClick={() => sendMessage({ text: "Hello" })}>
        Send
      </button>
    </div>
  )
}`
}

export function ChatContent() {
  const { slug, resolvedApiKey, isReal } = useResolvedCredentials()

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">Chat</h1>
          <CopyMarkdownButton />
        </div>
        <p className="mt-1.5 text-[14px] text-muted-foreground">
          SSE streaming chat endpoint with AI SDK compatibility. Send messages and receive streaming responses.
        </p>
      </div>

      <EndpointSection
        id="send-message"
        method="POST"
        path={`/v1/chat/${isReal ? slug : ":slug"}`}
        title="Send Message"
        description="Sends a message to the agent and returns an SSE stream of the response."
        params={[
          { name: "slug", type: "string", required: true, description: "Agent slug" },
        ]}
        bodyParams={[
          { name: "messages", type: "Message[]", required: true, description: "AI SDK-style message array. The relay uses the last user message as the next turn." },
          { name: "sandboxId", type: "string", required: true, description: "Sandbox ID returned by your server, for example the id from POST /v1/sandboxes" },
          { name: "threadId", type: "string", required: false, description: "Thread ID to continue. If omitted, the latest thread in the sandbox is reused or created if none exists" },
          { name: "options", type: "object", required: false, description: "Per-request runtime overrides" },
          { name: "options.systemPrompt", type: "object", required: false, description: "System prompt override (type, preset, append)" },
          { name: "options.maxTurns", type: "number", required: false, description: "Maximum number of agent turns" },
          { name: "options.maxBudgetUsd", type: "number", required: false, description: "Maximum cost in USD for this request" },
          { name: "options.disallowedTools", type: "string[]", required: false, description: "Tools the agent cannot use" },
          { name: "vaultIds", type: "string[]", required: false, description: "Ordered list of credential vault IDs. First-match-wins by host pattern when resolving credentials for MCP servers and skill fetches. See /agents/docs/build/credentials." },
          { name: "externalUserId", type: "string", required: false, description: "If no vaultIds is passed, the relay looks up active vaults tagged with metadata.external_user_id === this value. Used for multi-tenant agents that act on behalf of end users." },
        ]}
      >
        <div className="space-y-1 text-[13px] text-muted-foreground leading-relaxed rounded-lg border border-border bg-secondary/30 p-4">
          <p>
            <strong className="font-medium text-foreground">sandboxId + threadId:</strong>{" "}
            continue a specific thread in that sandbox.
          </p>
          <p>
            <strong className="font-medium text-foreground">sandboxId only:</strong>{" "}
            reuse the latest thread in the sandbox. If none exists yet, a new thread is created.
          </p>
          <p>
            <strong className="font-medium text-foreground">Need a fresh conversation in the same sandbox:</strong>{" "}
            create a new thread explicitly via{" "}
            <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">/v1/sandboxes/:id/threads</code>{" "}
            and send that <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">threadId</code>.
          </p>
          <p>
            <strong className="font-medium text-foreground">No sandboxId:</strong>{" "}
            returns a 400 error.
          </p>
          <p>
            <strong className="font-medium text-foreground">History persistence:</strong>{" "}
            the relay appends only the new turn to stored thread history. It does not replace thread history with the full request body.
          </p>
        </div>
        <CodeBlock language="json" code={REQUEST_BODY} filename="Request Body" />
        <CodeBlock language="bash" code={getCurlExample(slug, resolvedApiKey)} secret={isReal} filename="cURL" />
      </EndpointSection>

      <section id="sse-response-format" className="scroll-mt-24 space-y-4">
        <h2 className="text-[15px] font-medium">SSE Response Format</h2>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          The response is a Server-Sent Events stream. Each event is a JSON object prefixed with{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">data: </code>.
          The stream ends with{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">data: [DONE]</code>.
        </p>
        <CodeBlock language="json" code={SSE_RESPONSE} />
      </section>

      <section id="sse-event-types" className="scroll-mt-24 space-y-4">
        <h2 className="text-[15px] font-medium">SSE Event Types</h2>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          The stream emits 11 event types. A typical response includes text blocks, tool calls (if the agent uses tools), and metadata at the end.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 font-medium text-foreground">Event</th>
                <th className="text-left py-2 pr-4 font-medium text-foreground">Fields</th>
                <th className="text-left py-2 font-medium text-foreground">Description</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4 font-mono text-[12px] text-foreground">start</td>
                <td className="py-2 pr-4">&mdash;</td>
                <td className="py-2">First event in every stream</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4 font-mono text-[12px] text-foreground">text-start</td>
                <td className="py-2 pr-4"><code className="rounded bg-secondary px-1 py-0.5 text-[11px] font-mono">id</code></td>
                <td className="py-2">Start of a text content block</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4 font-mono text-[12px] text-foreground">text-delta</td>
                <td className="py-2 pr-4"><code className="rounded bg-secondary px-1 py-0.5 text-[11px] font-mono">id</code>, <code className="rounded bg-secondary px-1 py-0.5 text-[11px] font-mono">delta</code></td>
                <td className="py-2">Streaming text token</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4 font-mono text-[12px] text-foreground">text-end</td>
                <td className="py-2 pr-4"><code className="rounded bg-secondary px-1 py-0.5 text-[11px] font-mono">id</code></td>
                <td className="py-2">End of text content block</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4 font-mono text-[12px] text-foreground">tool-input-start</td>
                <td className="py-2 pr-4"><code className="rounded bg-secondary px-1 py-0.5 text-[11px] font-mono">toolCallId</code>, <code className="rounded bg-secondary px-1 py-0.5 text-[11px] font-mono">toolName</code></td>
                <td className="py-2">Agent begins calling a tool</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4 font-mono text-[12px] text-foreground">tool-input-delta</td>
                <td className="py-2 pr-4"><code className="rounded bg-secondary px-1 py-0.5 text-[11px] font-mono">toolCallId</code>, <code className="rounded bg-secondary px-1 py-0.5 text-[11px] font-mono">inputTextDelta</code></td>
                <td className="py-2">Streaming tool input JSON</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4 font-mono text-[12px] text-foreground">tool-input-available</td>
                <td className="py-2 pr-4"><code className="rounded bg-secondary px-1 py-0.5 text-[11px] font-mono">toolCallId</code>, <code className="rounded bg-secondary px-1 py-0.5 text-[11px] font-mono">toolName</code>, <code className="rounded bg-secondary px-1 py-0.5 text-[11px] font-mono">input</code></td>
                <td className="py-2">Complete tool call input (parsed JSON)</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4 font-mono text-[12px] text-foreground">tool-output-available</td>
                <td className="py-2 pr-4"><code className="rounded bg-secondary px-1 py-0.5 text-[11px] font-mono">toolCallId</code>, <code className="rounded bg-secondary px-1 py-0.5 text-[11px] font-mono">output</code></td>
                <td className="py-2">Tool execution result</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4 font-mono text-[12px] text-foreground">message-metadata</td>
                <td className="py-2 pr-4"><code className="rounded bg-secondary px-1 py-0.5 text-[11px] font-mono">messageMetadata</code></td>
                <td className="py-2">Contains <code className="rounded bg-secondary px-1 py-0.5 text-[11px] font-mono">sessionId</code>, <code className="rounded bg-secondary px-1 py-0.5 text-[11px] font-mono">totalCostUsd</code>, <code className="rounded bg-secondary px-1 py-0.5 text-[11px] font-mono">inputTokens</code>, <code className="rounded bg-secondary px-1 py-0.5 text-[11px] font-mono">outputTokens</code>, <code className="rounded bg-secondary px-1 py-0.5 text-[11px] font-mono">durationMs</code></td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4 font-mono text-[12px] text-foreground">finish</td>
                <td className="py-2 pr-4">&mdash;</td>
                <td className="py-2">Stream completed successfully</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4 font-mono text-[12px] text-foreground">error</td>
                <td className="py-2 pr-4"><code className="rounded bg-secondary px-1 py-0.5 text-[11px] font-mono">errorText</code></td>
                <td className="py-2">Error occurred during streaming</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="rounded-lg border border-border bg-secondary/30 p-4 text-[13px] text-muted-foreground leading-relaxed">
          <p>
            <strong className="font-medium text-foreground">Typical flow:</strong>{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-[11px] font-mono">start</code>{" "}
            &rarr; text blocks &rarr; tool call cycle (input start &rarr; input deltas &rarr; input available &rarr; output available) &rarr; more text blocks &rarr;{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-[11px] font-mono">message-metadata</code>{" "}
            &rarr;{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-[11px] font-mono">finish</code>{" "}
            &rarr;{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-[11px] font-mono">[DONE]</code>.
            Tool call cycles can repeat multiple times as the agent uses tools.
          </p>
        </div>
      </section>

      <EndpointSection
        id="resume-stream"
        method="GET"
        path={`/v1/chat/${isReal ? slug : ":slug"}/:sandboxId/stream`}
        title="Resume Stream"
        description="Reconnect to an active SSE stream for a sandbox. Use this when a client connection drops and you need to resume receiving events."
        params={[
          { name: "slug", type: "string", required: true, description: "Agent slug" },
          { name: "sandboxId", type: "string", required: true, description: "Sandbox ID" },
        ]}
      />

      <EndpointSection
        id="cancel-stream"
        method="DELETE"
        path={`/v1/chat/${isReal ? slug : ":slug"}/:sandboxId/stream`}
        title="Cancel Stream"
        description="Cancel an active stream. Use this for deterministic server-side cancellation."
        params={[
          { name: "slug", type: "string", required: true, description: "Agent slug" },
          { name: "sandboxId", type: "string", required: true, description: "Sandbox ID" },
        ]}
      >
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          Returns <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">204 No Content</code> on success.
        </p>
      </EndpointSection>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">React (AI SDK)</h2>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          Direct usage with AI SDK - useful for custom transports or non-Next.js frameworks.
        </p>
        <CodeBlock language="tsx" code={getRawReactExample(slug, resolvedApiKey)} filename="agent-chat.tsx" secret={isReal} />
      </section>

      <section className="space-y-3">
        <h2 className="text-[15px] font-medium">SDK Integration</h2>
        <div className="rounded-lg border border-border bg-secondary/30 p-4 text-[13px] text-muted-foreground leading-relaxed">
          For the recommended approach using{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">@21st-sdk/nextjs</code>{" "}
          with server-side token exchange, see the{" "}
          <a
            href={agentsHref("/agents/docs/get-started")}
            className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            Get Started
          </a>{" "}
          guide. For server-side sandbox and thread management, see the{" "}
          <a
            href={agentsHref("/agents/docs/reference/server")}
            className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            Server SDK
          </a>{" "}
          page.
        </div>
      </section>
    </div>
  )
}
