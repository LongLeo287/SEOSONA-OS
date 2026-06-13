"use client"

import { AgentsLink as Link } from "@/components/agents-link"
import { CodeBlock } from "@/components/features/agents/an/docs/code-block"
import { CopyMarkdownButton } from "@/components/features/agents/an/docs/copy-markdown-button"
import type { DocsCodeLanguage } from "@/lib/atoms/agents-docs"
import { DOCS_CODE_LANGUAGE_OPTIONS } from "@/components/features/agents/an/docs/docs-code-language-switch"
import { getDocsLang } from "@/lib/agents-docs/get-docs-lang"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

/* ── TypeScript ─────────────────────────────────────────────────────────────── */

const TS_INSTALL = `pnpm add @21st-sdk/node`

const TS_CLIENT_SETUP = `import { AgentClient } from "@21st-sdk/node"

const client = new AgentClient({
  apiKey: process.env.API_KEY_21ST!,
})`

const TS_CREATE_SANDBOX = `// Create a sandbox for an agent
const sandbox = await client.sandboxes.create({
  agent: "my-agent",
  files: {
    "data/input.json": JSON.stringify({ items: [1, 2, 3] }),
  },
  envs: {
    DATABASE_URL: "postgres://...",
  },
  setup: ["npm install"],
  timeoutMs: 1_800_000,
  networkAllowOut: ["api.github.com"],
  networkDenyOut: ["1.1.1.1"],
})

console.log(sandbox.id) // "sbx_abc123"
console.log(sandbox.status) // "running"`

const TS_SANDBOX_OPS = `// Get sandbox details
const detail = await client.sandboxes.get("sbx_abc123")
// { id, status, agent, threads, createdAt, updatedAt }

// Execute a command
const result = await client.sandboxes.exec({
  sandboxId: "sbx_abc123",
  command: "ls -la /home/user/repo",
  timeoutMs: 30_000,
})
console.log(result.stdout)

// Write files
await client.sandboxes.files.write({
  sandboxId: "sbx_abc123",
  files: {
    "src/config.json": JSON.stringify({ debug: true }),
  },
})

// Read a file
const file = await client.sandboxes.files.read({
  sandboxId: "sbx_abc123",
  path: "src/config.json",
})
console.log(file.content)

// Clone a git repo
await client.sandboxes.git.clone({
  sandboxId: "sbx_abc123",
  url: "https://github.com/org/repo.git",
  token: process.env.GITHUB_TOKEN, // for private repos
  depth: 1,
})

// Delete sandbox
await client.sandboxes.delete("sbx_abc123")`

const TS_THREADS = `// Create a thread
const thread = await client.threads.create({
  sandboxId: "sbx_abc123",
  name: "Code Review",
})

// List threads in a sandbox
const threads = await client.threads.list({
  sandboxId: "sbx_abc123",
})
// [{ id, name, status, createdAt }, ...]

// Get thread details
const detail = await client.threads.get({
  sandboxId: "sbx_abc123",
  threadId: thread.id,
})

// Delete thread
await client.threads.delete({
  sandboxId: "sbx_abc123",
  threadId: thread.id,
})`

const TS_RUN_THREAD = `// Run agent in a thread (streaming)
const result = await client.threads.run({
  agent: "my-agent",
  messages: [
    {
      role: "user",
      parts: [{ type: "text", text: "Analyze the code in /src and find bugs" }],
    },
  ],
  sandboxId: "sbx_abc123",     // optional — creates one if omitted
  threadId: "thr_xyz789",      // optional — creates one if omitted
  options: {
    model: "claude-sonnet-4-6",
    maxTurns: 25,
    maxBudgetUsd: 1.0,
    permissionMode: "bypassPermissions",
  },
})

// result.response is a streaming Response (SSE)
// result.sandboxId, result.threadId — IDs of the sandbox/thread used
// result.resumeUrl — URL to resume the conversation

const reader = result.response.body?.getReader()
const decoder = new TextDecoder()

while (true) {
  const { done, value } = await reader!.read()
  if (done) break
  const chunk = decoder.decode(value)
  process.stdout.write(chunk)
}`

const TS_TOKEN_EXCHANGE = `// Create a short-lived token for the frontend
const { token, expiresAt } = await client.tokens.create({
  agent: "my-agent",       // scope to specific agent
  userId: "user_123",      // identify the user
  expiresIn: "1h",         // default: 1 hour
})`

const TS_NEXT_API_ROUTES = `// app/api/agent/sandbox/route.ts
import { NextResponse } from "next/server"
import { AgentClient } from "@21st-sdk/node"

const client = new AgentClient({ apiKey: process.env.API_KEY_21ST! })

export async function POST() {
  const sandbox = await client.sandboxes.create({ agent: "my-agent" })
  return NextResponse.json({ sandboxId: sandbox.id })
}

// app/api/agent/threads/route.ts
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const sandboxId = searchParams.get("sandboxId")!
  const threads = await client.threads.list({ sandboxId })
  return NextResponse.json({ threads })
}

export async function POST(req: Request) {
  const { sandboxId, name } = await req.json()
  const thread = await client.threads.create({ sandboxId, name })
  return NextResponse.json(thread)
}`

/* ── Python ─────────────────────────────────────────────────────────────────── */

const PY_INSTALL = `pip install 21st-sdk`

const PY_CLIENT_SETUP = `import os
from twentyfirst_sdk import AgentClient

client = AgentClient(api_key=os.environ["API_KEY_21ST"])`

const PY_CREATE_SANDBOX = `# Create a sandbox for an agent
sandbox = client.sandboxes.create(
    agent="my-agent",
    files={
        "data/input.json": '{"items": [1, 2, 3]}',
    },
    envs={
        "DATABASE_URL": "postgres://...",
    },
    setup=["npm install"],
    timeout_ms=1_800_000,
    network_allow_out=["api.github.com"],
    network_deny_out=["1.1.1.1"],
)

print(sandbox.id)      # "sbx_abc123"
print(sandbox.status)  # "running"`

const PY_SANDBOX_OPS = `# Get sandbox details
detail = client.sandboxes.get("sbx_abc123")
# { id, status, agent, threads, created_at, updated_at }

# Execute a command
result = client.sandboxes.exec(
    "sbx_abc123",
    "ls -la /home/user/repo",
    timeout_ms=30_000,
)
print(result.stdout)

# Write files
client.sandboxes.files.write(
    "sbx_abc123",
    {"src/config.json": '{"debug": true}'},
)

# Read a file
file = client.sandboxes.files.read(
    "sbx_abc123",
    "src/config.json",
)
print(file.content)

# Clone a git repo
client.sandboxes.git.clone(
    "sbx_abc123",
    url="https://github.com/org/repo.git",
    token=os.environ.get("GITHUB_TOKEN"),
    depth=1,
)

# Delete sandbox
client.sandboxes.delete("sbx_abc123")`

const PY_THREADS = `# Create a thread
thread = client.threads.create(
    sandbox_id="sbx_abc123",
    name="Code Review",
)

# List threads in a sandbox
threads = client.threads.list(sandbox_id="sbx_abc123")
# [{ id, name, status, created_at }, ...]

# Get thread details
detail = client.threads.get(
    sandbox_id="sbx_abc123",
    thread_id=thread.id,
)

# Delete thread
client.threads.delete(
    sandbox_id="sbx_abc123",
    thread_id=thread.id,
)`

const PY_RUN_THREAD = `# Run agent in a thread (streaming)
run = client.threads.run(
    agent="my-agent",
    messages=[
        {
            "role": "user",
            "parts": [
                {"type": "text", "text": "Analyze the code in /src and find bugs"},
            ],
        },
    ],
    sandbox_id="sbx_abc123",     # optional — creates one if omitted
    thread_id="thr_xyz789",      # optional — creates one if omitted
    options={
        "model": "claude-sonnet-4-6",
        "maxTurns": 25,
        "maxBudgetUsd": 1.0,
        "permissionMode": "bypassPermissions",
    },
)

# run.response is a streaming requests.Response (SSE)
# run.sandbox_id, run.thread_id — IDs of the sandbox/thread used
# run.resume_url — URL to resume the conversation

try:
    for raw_line in run.response.iter_lines(decode_unicode=True):
        if raw_line:
            print(raw_line)
finally:
    run.response.close()`

const PY_TOKEN_EXCHANGE = `# Create a short-lived token for the frontend
result = client.tokens.create(
    agent="my-agent",        # scope to specific agent
    user_id="user_123",      # identify the user
    expires_in="1h",         # default: 1 hour
)
print(result.token, result.expires_at)`

/* ── Go ─────────────────────────────────────────────────────────────────────── */

const GO_INSTALL = `go get github.com/21st-dev/21st-sdk-go`

const GO_CLIENT_SETUP = `package main

import (
	"os"
	agents "github.com/21st-dev/21st-sdk-go"
)

func main() {
	client := agents.NewAgentClient(os.Getenv("API_KEY_21ST"))
	// ...
}`

const GO_CREATE_SANDBOX = `ctx := context.Background()
timeoutMs := 1_800_000

// Create a sandbox for an agent
sandbox, err := client.Sandboxes.Create(ctx, &agents.CreateSandboxRequest{
	Agent: "my-agent",
	Files: map[string]string{
		"data/input.json": ` + "`" + `{"items": [1, 2, 3]}` + "`" + `,
	},
	Envs: map[string]string{
		"DATABASE_URL": "postgres://...",
	},
	Setup: []string{"npm install"},
	TimeoutMs:       &timeoutMs,
	NetworkAllowOut: []string{"api.github.com"},
	NetworkDenyOut:  []string{"1.1.1.1"},
})
if err != nil {
	log.Fatal(err)
}

fmt.Println(sandbox.ID)     // "sbx_abc123"
fmt.Println(sandbox.Status) // "running"`

const GO_SANDBOX_OPS = `// Get sandbox details
detail, err := client.Sandboxes.Get(ctx, "sbx_abc123")

// Execute a command
result, err := client.Sandboxes.Exec(ctx, &agents.ExecRequest{
	SandboxID: "sbx_abc123",
	Command:   "ls -la /home/user/repo",
	TimeoutMs: 30_000,
})
fmt.Println(result.Stdout)

// Write files
err = client.Sandboxes.Files.Write(ctx, "sbx_abc123", map[string]string{
	"src/config.json": ` + "`" + `{"debug": true}` + "`" + `,
})

// Read a file
file, err := client.Sandboxes.Files.Read(ctx, "sbx_abc123", "src/config.json")
fmt.Println(file.Content)

// Clone a git repo
depth := 1
_, err = client.Sandboxes.Git.Clone(ctx, "sbx_abc123", &agents.GitCloneRequest{
	URL:   "https://github.com/org/repo.git",
	Token: os.Getenv("GITHUB_TOKEN"),
	Depth: &depth,
})

// Delete sandbox
err = client.Sandboxes.Delete(ctx, "sbx_abc123")`

const GO_THREADS = `// Create a thread
thread, err := client.Threads.Create(ctx, "sbx_abc123", "Code Review")

// List threads in a sandbox
threads, err := client.Threads.List(ctx, "sbx_abc123")
// []Thread{{ ID, Name, Status, CreatedAt }, ...}

// Get thread details
detail, err := client.Threads.Get(ctx, "sbx_abc123", thread.ID)

// Delete thread
err = client.Threads.Delete(ctx, "sbx_abc123", thread.ID)`

const GO_RUN_THREAD = `// Run agent in a thread (streaming)
run, err := client.Threads.Run(ctx, &agents.RunThreadRequest{
	Agent: "my-agent",
	Messages: []agents.RunThreadMessage{
		{
			Role: "user",
			Parts: []map[string]interface{}{
				{"type": "text", "text": "Analyze the code in /src and find bugs"},
			},
		},
	},
	SandboxID: "sbx_abc123",  // optional — creates one if omitted
	ThreadID:  "thr_xyz789",  // optional — creates one if omitted
	Options: &agents.AgentRequestOptions{
		Model:          "claude-sonnet-4-6",
		MaxTurns:       25,
		MaxBudgetUsd:   1.0,
		PermissionMode: "bypassPermissions",
	},
})
if err != nil {
	log.Fatal(err)
}
defer run.Response.Body.Close()

// run.SandboxID, run.ThreadID — IDs of the sandbox/thread used
// run.ResumeURL — URL to resume the conversation

scanner := bufio.NewScanner(run.Response.Body)
for scanner.Scan() {
	if line := strings.TrimSpace(scanner.Text()); line != "" {
		fmt.Println(line)
	}
}
if err := scanner.Err(); err != nil {
	log.Fatal(err)
}`

const GO_TOKEN_EXCHANGE = `// Create a short-lived token for the frontend
result, err := client.Tokens.Create(ctx, &agents.CreateTokenRequest{
	Agent:     "my-agent",      // scope to specific agent
	UserID:    "user_123",      // identify the user
	ExpiresIn: "1h",            // default: 1 hour
})
fmt.Println(result.Token, result.ExpiresAt)`

/* ── Language content map ───────────────────────────────────────────────────── */

type CodeLanguage = "typescript" | "python" | "go"

const LANG_CONTENT: Record<
  DocsCodeLanguage,
  {
    codeLanguage: CodeLanguage
    install: string
    clientSetup: string
    clientFilename: string
    createSandbox: string
    sandboxOps: string
    threads: string
    runThread: string
    tokenExchange: string
    nextApiRoutes: string | null
  }
> = {
  typescript: {
    codeLanguage: "typescript",
    install: TS_INSTALL,
    clientSetup: TS_CLIENT_SETUP,
    clientFilename: "server.ts",
    createSandbox: TS_CREATE_SANDBOX,
    sandboxOps: TS_SANDBOX_OPS,
    threads: TS_THREADS,
    runThread: TS_RUN_THREAD,
    tokenExchange: TS_TOKEN_EXCHANGE,
    nextApiRoutes: TS_NEXT_API_ROUTES,
  },
  python: {
    codeLanguage: "python",
    install: PY_INSTALL,
    clientSetup: PY_CLIENT_SETUP,
    clientFilename: "server.py",
    createSandbox: PY_CREATE_SANDBOX,
    sandboxOps: PY_SANDBOX_OPS,
    threads: PY_THREADS,
    runThread: PY_RUN_THREAD,
    tokenExchange: PY_TOKEN_EXCHANGE,
    nextApiRoutes: null,
  },
  go: {
    codeLanguage: "go",
    install: GO_INSTALL,
    clientSetup: GO_CLIENT_SETUP,
    clientFilename: "main.go",
    createSandbox: GO_CREATE_SANDBOX,
    sandboxOps: GO_SANDBOX_OPS,
    threads: GO_THREADS,
    runThread: GO_RUN_THREAD,
    tokenExchange: GO_TOKEN_EXCHANGE,
    nextApiRoutes: null,
  },
}

const RUN_OPTIONS_TABLE = [
  { option: "agent", desc: "Agent slug (required)" },
  {
    option: "messages",
    desc: "Array of { role, parts } messages (required)",
  },
  {
    option: "sandboxId",
    desc: "Existing sandbox to use. Creates one if omitted.",
  },
  {
    option: "threadId",
    desc: "Existing thread to continue. Creates one if omitted.",
  },
  { option: "options.model", desc: "Override the agent's default model" },
  {
    option: "options.maxTurns",
    desc: "Max reasoning steps for this run",
  },
  {
    option: "options.maxBudgetUsd",
    desc: "Cost cap in USD for this run",
  },
  {
    option: "options.permissionMode",
    desc: "Permission mode override",
  },
  {
    option: "options.disallowedTools",
    desc: "Tools to disable for this run",
  },
]

/* ── Component ──────────────────────────────────────────────────────────────── */

export function BackendIntegrationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const docsCodeLanguage = getDocsLang(searchParams)

  function setDocsCodeLanguage(newLang: DocsCodeLanguage) {
    const params = new URLSearchParams(searchParams.toString())
    if (newLang === "typescript") {
      params.delete("lang")
    } else {
      params.set("lang", newLang)
    }
    const qs = params.toString()
    router.replace(`${window.location.pathname}${qs ? `?${qs}` : ""}`, {
      scroll: false,
    })
  }

  const lang = LANG_CONTENT[docsCodeLanguage]

  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            Backend Integration
          </h1>
          <CopyMarkdownButton />
        </div>
        <p className="mt-1.5 text-[14px] text-muted-foreground leading-relaxed max-w-[520px]">
          Use agents from your server — create sandboxes, manage threads, run
          agents programmatically, and exchange tokens.
        </p>
        <div className="mt-3 inline-flex items-center gap-0.5 rounded-lg border border-border bg-muted/30 p-0.5">
          {DOCS_CODE_LANGUAGE_OPTIONS.map((option) => {
            const Icon = option.icon
            const isSelected = option.id === docsCodeLanguage
            return (
              <button
                key={option.id}
                onClick={() =>
                  setDocsCodeLanguage(
                    option.id as typeof docsCodeLanguage,
                  )
                }
                className={cn(
                  "an-focus-btn inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors",
                  isSelected
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                {option.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Install */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Install</h2>
        <CodeBlock code={lang.install} language="bash" />
      </section>

      {/* Client setup */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Client setup</h2>
        <CodeBlock
          code={lang.clientSetup}
          language={lang.codeLanguage}
          filename={lang.clientFilename}
        />
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          The client authenticates with your{" "}
          <Link
            href="/agents/docs/security/api-keys"
            className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            API key
          </Link>
          . All requests go through the relay at{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px] font-mono">
            relay.an.dev
          </code>{" "}
          by default.
        </p>
      </section>

      {/* Sandboxes */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Sandboxes</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          A sandbox is an isolated E2B environment where your agent runs. Create
          one with pre-loaded files, environment variables, and setup commands.
        </p>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          Use{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px] font-mono">
            timeoutMs
          </code>{" "}
          to control runtime sandbox TTL. Use{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px] font-mono">
            networkAllowOut
          </code>{" "}
          and{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px] font-mono">
            networkDenyOut
          </code>{" "}
          to restrict outbound traffic. Relay-required hosts are preserved
          automatically. Deploy-time machine size is configured separately in
          your agent's{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px] font-mono">
            Sandbox(...)
          </code>{" "}
          config via{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px] font-mono">
            cpuCount
          </code>{" "}
          and{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px] font-mono">
            memoryMB
          </code>
          .
        </p>
        <CodeBlock code={lang.createSandbox} language={lang.codeLanguage} />

        <h3 className="text-[14px] font-medium pt-2">Sandbox operations</h3>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          Execute commands, read/write files, and clone git repos inside a
          sandbox.
        </p>
        <CodeBlock code={lang.sandboxOps} language={lang.codeLanguage} />
      </section>

      {/* Threads */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Threads</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Threads are conversations within a sandbox. Multiple threads share
          the same filesystem but maintain separate message histories.
        </p>
        <CodeBlock code={lang.threads} language={lang.codeLanguage} />
      </section>

      {/* Running agents */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Running agents</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Use{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">
            {docsCodeLanguage === "go"
              ? "client.Threads.Run()"
              : docsCodeLanguage === "python"
                ? "client.threads.run()"
                : "client.threads.run()"}
          </code>{" "}
          to send messages to an agent and get a streaming SSE response. If you
          don&apos;t provide a sandbox or thread ID, the SDK creates them
          automatically.
        </p>
        <CodeBlock code={lang.runThread} language={lang.codeLanguage} />
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-3 py-2 text-left text-[11px] font-medium text-muted-foreground">
                  Option
                </th>
                <th className="px-3 py-2 text-left text-[11px] font-medium text-muted-foreground">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {RUN_OPTIONS_TABLE.map((row, i, arr) => (
                <tr
                  key={row.option}
                  className={
                    i < arr.length - 1 ? "border-b border-border" : ""
                  }
                >
                  <td className="px-3 py-2.5">
                    <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">
                      {row.option}
                    </code>
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">
                    {row.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Token exchange */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Token exchange</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Create short-lived tokens for the frontend. The token is scoped to a
          specific agent and user so the client can talk to the relay directly.
        </p>
        <CodeBlock code={lang.tokenExchange} language={lang.codeLanguage} />
      </section>

      {/* Next.js API routes (TypeScript only) */}
      {lang.nextApiRoutes && (
        <section className="space-y-4">
          <h2 className="text-[15px] font-medium">Next.js API routes</h2>
          <p className="text-[14px] text-muted-foreground leading-relaxed">
            Common pattern: create API routes that your frontend calls to manage
            sandboxes and threads.
          </p>
          <CodeBlock code={lang.nextApiRoutes} language="typescript" />
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            The{" "}
            <Link
              href="/agents/docs/deploy/frontend-integration"
              className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
            >
              frontend integration
            </Link>{" "}
            page shows how to call these routes from your React components.
          </p>
        </section>
      )}

      {/* What's next */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">What&apos;s next</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              title: "Frontend Integration",
              description:
                "Add the chat UI to your app with the React SDK.",
              href: "/agents/docs/deploy/frontend-integration",
            },
            {
              title: "Server SDK Reference",
              description:
                "Full API reference with all methods and types.",
              href: "/agents/docs/reference/server",
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="an-focus-btn group rounded-lg border border-border p-4 transition-colors hover:bg-secondary/30"
            >
              <p className="text-[13px] font-medium group-hover:text-foreground">
                {item.title}
              </p>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
