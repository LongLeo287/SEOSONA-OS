import { CodeBlock } from "../_shared"
import { CopyMarkdownButton } from "@/components/features/agents/an/docs/copy-markdown-button"

const ERROR_RESPONSE = `{
  "error": {
    "code": "invalid_request",
    "message": "sandboxId is required",
    "status": 400
  }
}`

const AUTH_ERROR = `{
  "error": {
    "code": "unauthorized",
    "message": "Invalid or missing API key",
    "status": 401
  }
}`

const RATE_LIMIT_ERROR = `{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Too many requests. Please retry after 60 seconds.",
    "status": 429,
    "retryAfter": 60
  }
}`

const STATUS_CODES = [
  { code: "200", description: "Success - request completed" },
  { code: "201", description: "Created - resource was created" },
  { code: "204", description: "No Content - resource was deleted" },
  { code: "400", description: "Bad Request - invalid parameters or missing required fields" },
  { code: "401", description: "Unauthorized - invalid or missing API key" },
  { code: "403", description: "Forbidden - insufficient permissions" },
  { code: "404", description: "Not Found - resource does not exist" },
  { code: "409", description: "Conflict - resource already exists or is in a conflicting state" },
  { code: "422", description: "Unprocessable Entity - request is well-formed but violates a semantic constraint (e.g. vault cap, missing coverage)" },
  { code: "429", description: "Too Many Requests - rate limit exceeded" },
  { code: "500", description: "Internal Server Error - unexpected server failure" },
  { code: "503", description: "Service Unavailable - sandbox runtime is temporarily unavailable" },
]

const ERROR_CODES = [
  { code: "invalid_request", description: "The request body is malformed or missing required fields" },
  { code: "validation_error", description: "A field fails validation (e.g. vault name too long, metadata caps exceeded)" },
  { code: "unauthorized", description: "The API key is invalid, expired, or missing" },
  { code: "forbidden", description: "The API key does not have permission for this operation" },
  { code: "not_found", description: "The specified resource (sandbox, thread, vault, credential) does not exist" },
  { code: "conflict", description: "Duplicate credential for the same serverUrl in a vault, or hard-delete attempted without prior archive" },
  { code: "credential_cap_exceeded", description: "Attempted to create a 21st active credential in a vault (max 20 per vault)" },
  { code: "vault_coverage_missing", description: "The session's resolved vaults do not cover all MCP servers declared on the agent (when VAULT_COVERAGE_MODE is strict)" },
  { code: "rate_limit_exceeded", description: "Too many requests in a short period" },
  { code: "sandbox_error", description: "The sandbox encountered a runtime error" },
  { code: "budget_exceeded", description: "The request exceeded a configured budget limit" },
  { code: "stream_active", description: "A stream is already active for this sandbox" },
]

export function ErrorsContent() {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">Errors</h1>
          <CopyMarkdownButton />
        </div>
        <p className="mt-1.5 text-[14px] text-muted-foreground">
          The API uses standard HTTP status codes and returns structured error responses with machine-readable error codes.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Error Response Format</h2>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          All error responses follow a consistent JSON format with a{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">code</code>,{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">message</code>, and{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">status</code> field.
        </p>
        <CodeBlock language="json" code={ERROR_RESPONSE} />
      </section>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">HTTP Status Codes</h2>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-3 py-2 text-left font-medium text-muted-foreground w-20">Code</th>
                <th className="px-3 py-2 text-left font-medium text-muted-foreground">Description</th>
              </tr>
            </thead>
            <tbody>
              {STATUS_CODES.map((s) => (
                <tr key={s.code} className="border-b border-border last:border-0">
                  <td className="px-3 py-2 font-mono text-[12px] font-medium">{s.code}</td>
                  <td className="px-3 py-2 text-muted-foreground">{s.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Error Codes</h2>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-3 py-2 text-left font-medium text-muted-foreground">Code</th>
                <th className="px-3 py-2 text-left font-medium text-muted-foreground">Description</th>
              </tr>
            </thead>
            <tbody>
              {ERROR_CODES.map((e) => (
                <tr key={e.code} className="border-b border-border last:border-0">
                  <td className="px-3 py-2 font-mono text-[12px]">{e.code}</td>
                  <td className="px-3 py-2 text-muted-foreground">{e.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Authentication Errors</h2>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          All API endpoints require a valid API key passed via the{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">Authorization: Bearer</code>{" "}
          header. Missing or invalid keys return a 401 response.
        </p>
        <CodeBlock language="json" code={AUTH_ERROR} />
      </section>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Rate Limiting</h2>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          When rate limited, the response includes a{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">retryAfter</code>{" "}
          field indicating the number of seconds to wait before retrying.
        </p>
        <CodeBlock language="json" code={RATE_LIMIT_ERROR} />
      </section>
    </div>
  )
}
