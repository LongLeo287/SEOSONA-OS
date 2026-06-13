"use client"

import {
  RELAY_URL,
  useResolvedCredentials,
  EndpointSection,
  CodeBlock,
  ResponseField,
} from "../_shared"
import { CopyMarkdownButton } from "@/components/features/agents/an/docs/copy-markdown-button"
import { AgentsLink as Link } from "@/components/agents-link"

const LIST_VAULTS_RESPONSE = `{
  "vaults": [
    {
      "id": "a1b2c3d4-5678-90ab-cdef-000000000001",
      "name": "Team",
      "description": "Shared workspace credentials",
      "status": "active",
      "isDefault": true,
      "metadata": {},
      "createdAt": "2026-04-01T12:00:00Z",
      "updatedAt": "2026-04-01T12:00:00Z",
      "archivedAt": null,
      "credentials": [
        {
          "id": "c1d2e3f4-5678-90ab-cdef-000000000001",
          "name": "Linear",
          "serverUrl": "https://mcp.linear.app/mcp",
          "serverUrlNormalized": "https://mcp.linear.app/mcp",
          "authType": "bearer",
          "status": "active",
          "hostPattern": "mcp.linear.app",
          "metadata": {},
          "lastResolvedAt": null,
          "lastError": null
        }
      ]
    }
  ]
}`

const CREATE_VAULT_BODY = `{
  "name": "Alice",
  "description": "Per-user credentials",
  "metadata": {
    "external_user_id": "usr_abc123"
  }
}`

const CREATE_VAULT_RESPONSE = `{
  "vault": {
    "id": "a1b2c3d4-5678-90ab-cdef-000000000002",
    "name": "Alice",
    "description": "Per-user credentials",
    "status": "active",
    "isDefault": false,
    "metadata": { "external_user_id": "usr_abc123" },
    "createdAt": "2026-04-24T12:00:00Z",
    "updatedAt": "2026-04-24T12:00:00Z",
    "archivedAt": null
  }
}`

const GET_VAULT_RESPONSE = `{
  "id": "a1b2c3d4-5678-90ab-cdef-000000000002",
  "name": "Alice",
  "description": "Per-user credentials",
  "status": "active",
  "isDefault": false,
  "metadata": { "external_user_id": "usr_abc123" },
  "credentials": [
    {
      "id": "c9d8e7f6-5678-90ab-cdef-000000000011",
      "name": "Linear",
      "serverUrl": "https://mcp.linear.app/mcp",
      "serverUrlNormalized": "https://mcp.linear.app/mcp",
      "hostPattern": "mcp.linear.app",
      "authType": "bearer",
      "status": "active",
      "metadata": {},
      "lastResolvedAt": "2026-04-24T11:59:00Z",
      "lastError": null
    }
  ],
  "coverage": {
    "active": ["mcp.linear.app"],
    "missing": []
  }
}`

const UPDATE_VAULT_BODY = `{
  "name": "Alice (archived users)",
  "metadata": { "archived_user": "true" }
}`

const CREATE_BEARER_CREDENTIAL_BODY = `{
  "name": "Linear",
  "serverUrl": "https://mcp.linear.app/mcp",
  "auth": {
    "type": "bearer",
    "token": "lin_api_REAL_TOKEN"
  },
  "metadata": {}
}`

const CREATE_OAUTH_CREDENTIAL_BODY = `{
  "name": "Slack",
  "serverUrl": "https://mcp.slack.com/mcp",
  "auth": {
    "type": "oauth",
    "accessToken": "xoxp-...",
    "refreshToken": "xoxe-1-...",
    "clientId": "1234567890.0987654321",
    "clientSecret": "abc123def456",
    "tokenEndpoint": "https://slack.com/api/oauth.v2.access",
    "tokenEndpointAuth": "client_secret_post",
    "tokenType": "bearer",
    "expiresAt": "2026-04-24T13:00:00Z",
    "scope": "channels:read chat:write",
    "resource": null
  }
}`

const CREATE_CREDENTIAL_RESPONSE = `{
  "credential": {
    "id": "c9d8e7f6-5678-90ab-cdef-000000000011",
    "vaultId": "a1b2c3d4-5678-90ab-cdef-000000000002",
    "name": "Linear",
    "serverUrl": "https://mcp.linear.app/mcp",
    "serverUrlNormalized": "https://mcp.linear.app/mcp",
    "hostPattern": "mcp.linear.app",
    "authType": "bearer",
    "status": "active",
    "metadata": {},
    "createdAt": "2026-04-24T12:00:00Z",
    "updatedAt": "2026-04-24T12:00:00Z",
    "archivedAt": null,
    "lastResolvedAt": null,
    "lastError": null
  }
}`

const DELETE_SUCCESS_RESPONSE = `{
  "success": true
}`

function getCurlList(apiKey: string) {
  return `curl ${RELAY_URL}/v1/mcp/vaults \\
  -H "Authorization: Bearer ${apiKey}"`
}

function getCurlCreateVault(apiKey: string) {
  return `curl -X POST ${RELAY_URL}/v1/mcp/vaults \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{ "name": "Alice", "metadata": { "external_user_id": "usr_abc123" } }'`
}

function getCurlCreateCredential(apiKey: string) {
  return `curl -X POST ${RELAY_URL}/v1/mcp/vaults/VAULT_ID/credentials \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Linear",
    "serverUrl": "https://mcp.linear.app/mcp",
    "auth": { "type": "bearer", "token": "lin_api_REAL_TOKEN" }
  }'`
}

export function VaultsContent() {
  const { resolvedApiKey, isReal } = useResolvedCredentials()

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">Vaults</h1>
          <CopyMarkdownButton />
        </div>
        <p className="mt-1.5 text-[14px] text-muted-foreground leading-relaxed">
          Create, list, update, archive, and delete credential vaults and their
          credentials. Vaults are workspace-scoped; all endpoints authenticate
          with the team&apos;s API key.
        </p>
        <p className="mt-3 text-[13px] text-muted-foreground leading-relaxed">
          For the concept — how credentials are resolved at session time,
          injection shapes, OAuth refresh, and multi-tenant patterns — see{" "}
          <Link
            href="/agents/docs/build/credentials"
            className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            Credential vaults
          </Link>
          .
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-[15px] font-medium">Vault object</h2>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          Fields returned on vault endpoints.
        </p>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-3 py-2 text-left font-medium text-muted-foreground">Field</th>
                <th className="px-3 py-2 text-left font-medium text-muted-foreground">Type</th>
                <th className="px-3 py-2 text-left font-medium text-muted-foreground">Description</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50">
                <td className="px-3 py-2 font-mono text-[12px]">id</td>
                <td className="px-3 py-2 font-mono text-[12px]">string (uuid)</td>
                <td className="px-3 py-2">Stable vault identifier.</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="px-3 py-2 font-mono text-[12px]">name</td>
                <td className="px-3 py-2 font-mono text-[12px]">string</td>
                <td className="px-3 py-2">1-200 chars. Display name.</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="px-3 py-2 font-mono text-[12px]">description</td>
                <td className="px-3 py-2 font-mono text-[12px]">string | null</td>
                <td className="px-3 py-2">Up to 500 chars.</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="px-3 py-2 font-mono text-[12px]">status</td>
                <td className="px-3 py-2 font-mono text-[12px]">&quot;active&quot; | &quot;archived&quot;</td>
                <td className="px-3 py-2">Archived vaults have their encrypted secrets purged but the row is retained for audit.</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="px-3 py-2 font-mono text-[12px]">isDefault</td>
                <td className="px-3 py-2 font-mono text-[12px]">boolean</td>
                <td className="px-3 py-2">Exactly one active vault per team can be the default.</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="px-3 py-2 font-mono text-[12px]">metadata</td>
                <td className="px-3 py-2 font-mono text-[12px]">Record&lt;string, string&gt;</td>
                <td className="px-3 py-2">Max 16 pairs; keys ≤ 64 chars, values ≤ 512 chars. Returned in clear text — do not store secrets here.</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="px-3 py-2 font-mono text-[12px]">credentials</td>
                <td className="px-3 py-2 font-mono text-[12px]">Credential[]</td>
                <td className="px-3 py-2">Present on <code className="rounded bg-secondary px-1 py-0.5 text-[11px]">GET /v1/mcp/vaults/:id</code>.</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="px-3 py-2 font-mono text-[12px]">createdAt</td>
                <td className="px-3 py-2 font-mono text-[12px]">string (ISO 8601)</td>
                <td className="px-3 py-2">Timestamp.</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="px-3 py-2 font-mono text-[12px]">updatedAt</td>
                <td className="px-3 py-2 font-mono text-[12px]">string (ISO 8601)</td>
                <td className="px-3 py-2">Timestamp.</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-mono text-[12px]">archivedAt</td>
                <td className="px-3 py-2 font-mono text-[12px]">string | null</td>
                <td className="px-3 py-2">Set when archived.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-[15px] font-medium">Credential object</h2>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-3 py-2 text-left font-medium text-muted-foreground">Field</th>
                <th className="px-3 py-2 text-left font-medium text-muted-foreground">Type</th>
                <th className="px-3 py-2 text-left font-medium text-muted-foreground">Description</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50">
                <td className="px-3 py-2 font-mono text-[12px]">id</td>
                <td className="px-3 py-2 font-mono text-[12px]">string (uuid)</td>
                <td className="px-3 py-2">Credential identifier.</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="px-3 py-2 font-mono text-[12px]">vaultId</td>
                <td className="px-3 py-2 font-mono text-[12px]">string (uuid)</td>
                <td className="px-3 py-2">Parent vault.</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="px-3 py-2 font-mono text-[12px]">name</td>
                <td className="px-3 py-2 font-mono text-[12px]">string | null</td>
                <td className="px-3 py-2">Display label.</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="px-3 py-2 font-mono text-[12px]">serverUrl</td>
                <td className="px-3 py-2 font-mono text-[12px]">string (url)</td>
                <td className="px-3 py-2">The MCP server or upstream API URL this credential authenticates.</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="px-3 py-2 font-mono text-[12px]">serverUrlNormalized</td>
                <td className="px-3 py-2 font-mono text-[12px]">string</td>
                <td className="px-3 py-2">Lowercased and trailing-slash-stripped form used for matching.</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="px-3 py-2 font-mono text-[12px]">hostPattern</td>
                <td className="px-3 py-2 font-mono text-[12px]">string | null</td>
                <td className="px-3 py-2">Derived from <code className="rounded bg-secondary px-1 py-0.5 text-[11px]">serverUrl</code>. Used by the proxy to match outbound requests.</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="px-3 py-2 font-mono text-[12px]">authType</td>
                <td className="px-3 py-2 font-mono text-[12px]">&quot;bearer&quot; | &quot;oauth&quot;</td>
                <td className="px-3 py-2">Secret shape. See the Auth shapes section below.</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="px-3 py-2 font-mono text-[12px]">status</td>
                <td className="px-3 py-2 font-mono text-[12px]">&quot;active&quot; | &quot;archived&quot;</td>
                <td className="px-3 py-2">Archived credentials have their encrypted auth purged.</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="px-3 py-2 font-mono text-[12px]">metadata</td>
                <td className="px-3 py-2 font-mono text-[12px]">Record&lt;string, string&gt;</td>
                <td className="px-3 py-2">Same caps as vault metadata.</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="px-3 py-2 font-mono text-[12px]">lastResolvedAt</td>
                <td className="px-3 py-2 font-mono text-[12px]">string | null</td>
                <td className="px-3 py-2">Set on successful proxy resolve.</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-mono text-[12px]">lastError</td>
                <td className="px-3 py-2 font-mono text-[12px]">string | null</td>
                <td className="px-3 py-2">Set on upstream auth failure (e.g. 401). Cleared on next success.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="rounded-lg border border-border bg-secondary/30 p-3 text-[13px] leading-relaxed">
          <span className="font-medium text-foreground">💡 Note</span>
          <span className="text-muted-foreground">
            {" "}— Secret fields (
            <code className="rounded bg-secondary px-1 py-0.5 text-[11px]">token</code>,{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-[11px]">accessToken</code>,{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-[11px]">refreshToken</code>,{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-[11px]">clientSecret</code>
            ) are write-only. They are never returned in API responses.
          </span>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-[15px] font-medium">Inject rules</h2>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          The{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">inject</code>{" "}
          field on credential create / update tells the proxy where to put the secret in the outbound
          request. Defaults to{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">
            {`{ kind: "header", header: "Authorization", prefix: "Bearer " }`}
          </code>
          , which matches MCP and most modern APIs.
        </p>
        <div className="space-y-2">
          <h3 className="text-[13px] font-medium">Header — custom name, optional prefix</h3>
          <CodeBlock language="json" code={`{
  "kind": "header",
  "header": "X-Subscription-Token",
  "prefix": ""
}`} />
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            Rendered as{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-[11px]">X-Subscription-Token: &lt;token&gt;</code>
            . Use this for Brave, SendGrid, and other APIs with custom header auth.
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="text-[13px] font-medium">Query parameter</h3>
          <CodeBlock language="json" code={`{
  "kind": "query",
  "param": "key"
}`} />
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            Rendered as{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-[11px]">?key=&lt;token&gt;</code>
            . Use for Google Maps and other query-auth APIs.
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="text-[13px] font-medium">Basic auth</h3>
          <CodeBlock language="json" code={`{
  "kind": "basic",
  "username": "api"
}`} />
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            Rendered as{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-[11px]">
              Authorization: Basic base64(username:&lt;token&gt;)
            </code>
            . The token is used as the password.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-[15px] font-medium">Auth shapes</h2>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          The <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">auth</code>{" "}
          field on credential create / update is a discriminated union.
        </p>
        <div className="space-y-2">
          <h3 className="text-[13px] font-medium">Bearer</h3>
          <CodeBlock language="json" code={`{
  "type": "bearer",
  "token": "lin_api_REAL_TOKEN"
}`} />
        </div>
        <div className="space-y-2">
          <h3 className="text-[13px] font-medium">OAuth (with optional refresh)</h3>
          <CodeBlock language="json" code={`{
  "type": "oauth",
  "accessToken": "xoxp-...",
  "refreshToken": "xoxe-1-...",
  "clientId": "1234567890.0987654321",
  "clientSecret": "abc123def456",
  "tokenEndpoint": "https://slack.com/api/oauth.v2.access",
  "tokenEndpointAuth": "client_secret_post",
  "tokenType": "bearer",
  "expiresAt": "2026-04-24T13:00:00Z",
  "scope": "channels:read chat:write",
  "resource": null
}`} />
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            All OAuth fields are optional on input, but at least{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-[11px]">accessToken</code> is
            required for immediate use. Supply the full refresh block if you want the relay to
            refresh tokens on your behalf when they near expiry.
          </p>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            Supported <code className="rounded bg-secondary px-1 py-0.5 text-[11px]">tokenEndpointAuth</code> modes:{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-[11px]">none</code>,{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-[11px]">client_secret_basic</code>,{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-[11px]">client_secret_post</code>.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Vault endpoints</h2>

        <EndpointSection
          id="list-vaults"
          method="GET"
          path="/v1/mcp/vaults"
          title="List Vaults"
          description="Returns all vaults in the workspace with their nested active credentials."
        >
          <ResponseField>
            <CodeBlock language="json" code={LIST_VAULTS_RESPONSE} />
          </ResponseField>
          <CodeBlock language="bash" code={getCurlList(resolvedApiKey)} secret={isReal} filename="cURL" />
        </EndpointSection>

        <EndpointSection
          id="create-vault"
          method="POST"
          path="/v1/mcp/vaults"
          title="Create Vault"
          description="Creates a new vault in the workspace."
          bodyParams={[
            { name: "name", type: "string", required: true, description: "Display name, 1-200 chars." },
            { name: "description", type: "string | null", required: false, description: "Up to 500 chars." },
            { name: "metadata", type: "Record<string, string>", required: false, description: "Max 16 pairs; keys ≤ 64 chars, values ≤ 512 chars." },
          ]}
        >
          <CodeBlock language="json" code={CREATE_VAULT_BODY} filename="Request Body" />
          <ResponseField>
            <CodeBlock language="json" code={CREATE_VAULT_RESPONSE} />
          </ResponseField>
          <CodeBlock language="bash" code={getCurlCreateVault(resolvedApiKey)} secret={isReal} filename="cURL" />
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            Returns <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">201 Created</code> with the new vault.
          </p>
        </EndpointSection>

        <EndpointSection
          id="get-vault"
          method="GET"
          path="/v1/mcp/vaults/:vaultId"
          title="Get Vault"
          description="Returns a single vault with its active credentials and coverage summary."
          params={[
            { name: "vaultId", type: "string (uuid)", required: true, description: "Vault ID." },
          ]}
        >
          <ResponseField>
            <CodeBlock language="json" code={GET_VAULT_RESPONSE} />
          </ResponseField>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            The{" "}
            <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">coverage</code>{" "}
            field lists which declared hosts in any active deployment are covered vs. missing for this vault.
          </p>
        </EndpointSection>

        <EndpointSection
          id="update-vault"
          method="PATCH"
          path="/v1/mcp/vaults/:vaultId"
          title="Update Vault"
          description="Updates vault metadata. Supports partial updates: any omitted field is left unchanged."
          params={[
            { name: "vaultId", type: "string (uuid)", required: true, description: "Vault ID." },
          ]}
          bodyParams={[
            { name: "name", type: "string", required: false, description: "1-200 chars." },
            { name: "description", type: "string | null", required: false, description: "Up to 500 chars. Pass null to clear." },
            { name: "metadata", type: "Record<string, string>", required: false, description: "Replaces the full metadata object." },
          ]}
        >
          <CodeBlock language="json" code={UPDATE_VAULT_BODY} filename="Request Body" />
        </EndpointSection>

        <EndpointSection
          id="archive-or-delete-vault"
          method="DELETE"
          path="/v1/mcp/vaults/:vaultId"
          title="Archive or Delete Vault"
          description="By default, soft-archives the vault: the record stays for audit but encrypted secrets are purged. Pass ?force=true to hard-delete (requires the vault to already be archived or have no active credentials)."
          params={[
            { name: "vaultId", type: "string (uuid)", required: true, description: "Vault ID." },
          ]}
          queryParams={[
            { name: "force", type: "boolean", required: false, description: "If true, hard-delete the row. Requires prior archive." },
          ]}
        >
          <ResponseField>
            <CodeBlock language="json" code={DELETE_SUCCESS_RESPONSE} />
          </ResponseField>
        </EndpointSection>

        <EndpointSection
          id="set-default-vault"
          method="POST"
          path="/v1/mcp/vaults/:vaultId/set-default"
          title="Set Default Vault"
          description="Marks this vault as the workspace default. Any previously-default vault is un-set in the same transaction. If a thread.run is made without explicit vaultIds, externalUserId, or agent-pinned vaultIds, the default vault is used."
          params={[
            { name: "vaultId", type: "string (uuid)", required: true, description: "Vault ID." },
          ]}
        >
          <ResponseField>
            <CodeBlock language="json" code={DELETE_SUCCESS_RESPONSE} />
          </ResponseField>
        </EndpointSection>
      </section>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Credential endpoints</h2>

        <EndpointSection
          id="create-credential"
          method="POST"
          path="/v1/mcp/vaults/:vaultId/credentials"
          title="Create Credential"
          description="Creates a credential in the vault. A vault can hold up to 20 active credentials. Creating a second credential for the same serverUrl returns 409."
          params={[
            { name: "vaultId", type: "string (uuid)", required: true, description: "Parent vault." },
          ]}
          bodyParams={[
            { name: "name", type: "string | null", required: false, description: "Display label, up to 200 chars." },
            { name: "serverUrl", type: "string (url)", required: true, description: "MCP server or upstream API URL." },
            { name: "auth", type: "BearerAuth | OAuthAuth", required: true, description: "See Auth shapes above." },
            { name: "inject", type: "InjectRule", required: false, description: "How to attach the secret. Defaults to { kind: \"header\", header: \"Authorization\", prefix: \"Bearer \" }. See Inject rules below." },
            { name: "metadata", type: "Record<string, string>", required: false, description: "Same caps as vault metadata." },
          ]}
        >
          <CodeBlock language="json" code={CREATE_BEARER_CREDENTIAL_BODY} filename="Bearer — Request Body" />
          <CodeBlock language="json" code={CREATE_OAUTH_CREDENTIAL_BODY} filename="OAuth — Request Body" />
          <ResponseField>
            <CodeBlock language="json" code={CREATE_CREDENTIAL_RESPONSE} />
          </ResponseField>
          <CodeBlock language="bash" code={getCurlCreateCredential(resolvedApiKey)} secret={isReal} filename="cURL" />
        </EndpointSection>

        <EndpointSection
          id="update-credential"
          method="PATCH"
          path="/v1/mcp/vaults/:vaultId/credentials/:credentialId"
          title="Update Credential"
          description="Replaces the credential's auth payload and/or metadata. Pass the same shape as create."
          params={[
            { name: "vaultId", type: "string (uuid)", required: true, description: "Parent vault." },
            { name: "credentialId", type: "string (uuid)", required: true, description: "Credential ID." },
          ]}
          bodyParams={[
            { name: "serverUrl", type: "string (url)", required: true, description: "Same host as the existing credential." },
            { name: "auth", type: "BearerAuth | OAuthAuth", required: true, description: "New secret material." },
            { name: "name", type: "string | null", required: false, description: "Display label." },
            { name: "inject", type: "InjectRule", required: false, description: "Replaces the injection rule (header / query / basic)." },
            { name: "metadata", type: "Record<string, string>", required: false, description: "Replaces the full metadata object." },
          ]}
        />

        <EndpointSection
          id="archive-or-delete-credential"
          method="DELETE"
          path="/v1/mcp/vaults/:vaultId/credentials/:credentialId"
          title="Archive or Delete Credential"
          description="By default, soft-archives the credential: the row stays, encrypted secret is purged. Pass ?force=true to hard-delete."
          params={[
            { name: "vaultId", type: "string (uuid)", required: true, description: "Parent vault." },
            { name: "credentialId", type: "string (uuid)", required: true, description: "Credential ID." },
          ]}
          queryParams={[
            { name: "force", type: "boolean", required: false, description: "If true, hard-delete the row. Requires prior archive." },
          ]}
        >
          <ResponseField>
            <CodeBlock language="json" code={DELETE_SUCCESS_RESPONSE} />
          </ResponseField>
        </EndpointSection>
      </section>

      <section className="space-y-3">
        <h2 className="text-[15px] font-medium">Errors</h2>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          These endpoints share the standard error format documented on the{" "}
          <Link
            href="/agents/docs/api-reference/errors"
            className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            Errors
          </Link>{" "}
          page. Vault-specific codes:
        </p>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-3 py-2 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-3 py-2 text-left font-medium text-muted-foreground">Code</th>
                <th className="px-3 py-2 text-left font-medium text-muted-foreground">When</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50">
                <td className="px-3 py-2 font-mono text-[12px]">400</td>
                <td className="px-3 py-2 font-mono text-[12px]">validation_error</td>
                <td className="px-3 py-2">Body fails schema (missing/bad fields, metadata caps exceeded).</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="px-3 py-2 font-mono text-[12px]">404</td>
                <td className="px-3 py-2 font-mono text-[12px]">not_found</td>
                <td className="px-3 py-2">Vault or credential doesn&apos;t exist in your workspace.</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="px-3 py-2 font-mono text-[12px]">409</td>
                <td className="px-3 py-2 font-mono text-[12px]">conflict</td>
                <td className="px-3 py-2">Duplicate credential for the same host, or hard-delete attempted on an active resource.</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-mono text-[12px]">422</td>
                <td className="px-3 py-2 font-mono text-[12px]">credential_cap_exceeded</td>
                <td className="px-3 py-2">Attempted to create a 21st active credential in a vault.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-[15px] font-medium">More resources</h2>
        <ul className="list-disc space-y-1.5 pl-5 text-[13px] leading-relaxed text-muted-foreground">
          <li>
            <Link
              href="/agents/docs/build/credentials"
              className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
            >
              Credential vaults
            </Link>{" "}
            — concept page with the 3-slot model, worked examples, and resolution order.
          </li>
          <li>
            <Link
              href="/agents/docs/build/tools-and-mcps"
              className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
            >
              Tools and MCPs
            </Link>{" "}
            — how MCP servers are declared on the agent.
          </li>
          <li>
            <Link
              href="/agents/docs/api-reference/chat"
              className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
            >
              Chat
            </Link>{" "}
            — passing{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-[11px]">vaultIds</code> and{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-[11px]">externalUserId</code> at
            request time.
          </li>
        </ul>
      </section>
    </div>
  )
}
