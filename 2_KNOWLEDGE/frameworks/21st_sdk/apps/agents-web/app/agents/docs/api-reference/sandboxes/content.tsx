"use client"

import {
  RELAY_URL,
  useResolvedCredentials,
  EndpointSection,
  CodeBlock,
  ResponseField,
} from "../_shared"
import { CopyMarkdownButton } from "@/components/features/agents/an/docs/copy-markdown-button"

const SANDBOX_CREATE_BODY = `{
  "agent": "my-agent",
  "files": { "/home/user/workspace/config.json": "{\\"key\\": \\"value\\"}" },
  "envs": { "NODE_ENV": "production" },
  "setup": ["npm install -g prettier"],
  "timeoutMs": 1800000,
  "networkAllowOut": ["api.github.com"],
  "networkDenyOut": ["1.1.1.1"]
}`

const SANDBOX_CREATE_RESPONSE = `{
  "id": "sb_abc123",
  "sandboxId": "e2b-sandbox-id",
  "status": "active",
  "createdAt": "2026-02-26T12:00:00Z"
}`

const SANDBOX_GET_RESPONSE = `{
  "id": "sb_abc123",
  "sandboxId": "e2b-sandbox-id",
  "status": "active",
  "error": null,
  "agent": { "slug": "my-agent", "name": "My Agent" },
  "threads": [
    { "id": "th_xyz789", "name": "Chat 1", "status": "completed" }
  ],
  "createdAt": "2026-02-26T12:00:00Z",
  "updatedAt": "2026-02-26T12:05:00Z"
}`

function getCurlCreate(apiKey: string) {
  return `curl -X POST ${RELAY_URL}/v1/sandboxes \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "agent": "my-agent",
    "files": { "/home/user/workspace/config.json": "{\\"key\\": \\"value\\"}" },
    "setup": ["npm install -g prettier"],
    "timeoutMs": 1800000,
    "networkAllowOut": ["api.github.com"],
    "networkDenyOut": ["1.1.1.1"]
  }'`
}

function getCurlGet(apiKey: string) {
  return `curl ${RELAY_URL}/v1/sandboxes/sb_abc123 \\
  -H "Authorization: Bearer ${apiKey}"`
}

function getCurlDelete(apiKey: string) {
  return `curl -X DELETE ${RELAY_URL}/v1/sandboxes/sb_abc123 \\
  -H "Authorization: Bearer ${apiKey}"`
}

export function SandboxesContent() {
  const { resolvedApiKey, isReal } = useResolvedCredentials()

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">Sandboxes</h1>
          <CopyMarkdownButton />
        </div>
        <p className="mt-1.5 text-[14px] text-muted-foreground">
          A sandbox is a persistent runtime environment with its own filesystem,
          git state, and sessions. All endpoints require an{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">
            Authorization: Bearer {"<api_key>"}
          </code>{" "}
          header.
        </p>
      </div>

      <EndpointSection
        id="create-sandbox"
        method="POST"
        path="/v1/sandboxes"
        title="Create Sandbox"
        description="Creates a new runtime sandbox for the specified agent. Optionally seed it with files, environment variables, setup commands, and runtime TTL/network overrides on top of the deployed agent defaults."
        bodyParams={[
          { name: "agent", type: "string", required: true, description: "Agent slug to use for this sandbox" },
          { name: "files", type: "object", required: false, description: "Map of file path → content to seed" },
          { name: "envs", type: "object", required: false, description: "Environment variables to set" },
          { name: "setup", type: "string[]", required: false, description: "Shell commands to run after creation" },
          { name: "timeoutMs", type: "number", required: false, description: "Sandbox TTL in milliseconds. Overrides the deployment default if set. Relay keeps using this TTL when reconnecting and extending the sandbox." },
          { name: "networkAllowOut", type: "string[]", required: false, description: "Allowed outbound domains, IPs, or CIDRs. Overrides the deployment default if set. Relay-required hosts are always appended automatically." },
          { name: "networkDenyOut", type: "string[]", required: false, description: "Denied outbound IPs or CIDRs. Overrides the deployment default if set. Relay-required hosts remain allowed." },
        ]}
      >
        <CodeBlock language="json" code={SANDBOX_CREATE_BODY} filename="Request Body" />
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          Use{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">
            timeoutMs
          </code>{" "}
          to control the runtime sandbox TTL. If the deployed agent already sets
          default TTL or network rules in{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">
            Sandbox(...)
          </code>
          , the request values here override those defaults. Relay still
          preserves the outbound hosts it needs for proxying and streaming.
        </p>
        <ResponseField>
          <CodeBlock language="json" code={SANDBOX_CREATE_RESPONSE} />
        </ResponseField>
        <CodeBlock language="bash" code={getCurlCreate(resolvedApiKey)} secret={isReal} filename="cURL" />
      </EndpointSection>

      <EndpointSection
        id="get-sandbox"
        method="GET"
        path="/v1/sandboxes/:id"
        title="Get Sandbox"
        description="Retrieves details about an existing sandbox including its agent, threads, and current status."
        params={[
          { name: "id", type: "string", required: true, description: "Sandbox ID" },
        ]}
      >
        <ResponseField>
          <CodeBlock language="json" code={SANDBOX_GET_RESPONSE} />
        </ResponseField>
        <CodeBlock language="bash" code={getCurlGet(resolvedApiKey)} secret={isReal} filename="cURL" />
      </EndpointSection>

      <EndpointSection
        id="delete-sandbox"
        method="DELETE"
        path="/v1/sandboxes/:id"
        title="Delete Sandbox"
        description="Deletes the sandbox and cascades deletion to all threads within it. Returns 204 No Content on success."
        params={[
          { name: "id", type: "string", required: true, description: "Sandbox ID" },
        ]}
      >
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          Returns <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">204 No Content</code> on success.
        </p>
        <CodeBlock language="bash" code={getCurlDelete(resolvedApiKey)} secret={isReal} filename="cURL" />
      </EndpointSection>
    </div>
  )
}
