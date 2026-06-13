"use client"

import {
  RELAY_URL,
  useResolvedCredentials,
  EndpointSection,
  CodeBlock,
  ResponseField,
} from "../_shared"
import { CopyMarkdownButton } from "@/components/features/agents/an/docs/copy-markdown-button"

const EXEC_BODY = `{
  "command": "ls -la /home/user/workspace",
  "cwd": "/home/user/workspace/repo",
  "envs": { "NODE_ENV": "production" },
  "timeoutMs": 30000
}`

const EXEC_RESPONSE = `{
  "stdout": "total 24\\ndrwxr-xr-x 5 user user 4096 ...",
  "stderr": "",
  "exitCode": 0
}`

const FILES_WRITE_BODY = `{
  "files": [
    { "path": "/home/user/workspace/hello.txt", "content": "Hello world!" },
    { "path": "/home/user/workspace/config.json", "content": "{\\"key\\": \\"value\\"}" }
  ]
}`

const FILES_READ_RESPONSE = `{
  "path": "/home/user/workspace/hello.txt",
  "content": "Hello world!"
}`

const GIT_CLONE_BODY = `{
  "url": "https://github.com/org/repo.git",
  "path": "/home/user/workspace/repo",
  "token": "ghp_...",
  "depth": 1
}`

const GIT_CLONE_RESPONSE = `{
  "path": "/home/user/workspace/repo",
  "branch": "default"
}`

function getCurlExec(apiKey: string) {
  return `curl -X POST ${RELAY_URL}/v1/sandboxes/sb_abc123/exec \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{ "command": "ls -la /home/user/workspace" }'`
}

export function SandboxOperationsContent() {
  const { resolvedApiKey, isReal } = useResolvedCredentials()

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">Sandbox Operations</h1>
          <CopyMarkdownButton />
        </div>
        <p className="mt-1.5 text-[14px] text-muted-foreground">
          Run commands, read/write files, and clone repos inside a sandbox.
        </p>
      </div>

      <EndpointSection
        id="exec-command"
        method="POST"
        path="/v1/sandboxes/:id/exec"
        title="Execute Command"
        description="Run a shell command inside the sandbox. Returns stdout, stderr, and exit code."
        params={[
          { name: "id", type: "string", required: true, description: "Sandbox ID" },
        ]}
        bodyParams={[
          { name: "command", type: "string", required: true, description: "Shell command to execute" },
          { name: "cwd", type: "string", required: false, description: "Working directory for the command" },
          { name: "envs", type: "object", required: false, description: "Additional environment variables" },
          { name: "timeoutMs", type: "number", required: false, description: "Timeout in milliseconds (default: 30000)" },
        ]}
      >
        <CodeBlock language="json" code={EXEC_BODY} filename="Request Body" />
        <ResponseField>
          <CodeBlock language="json" code={EXEC_RESPONSE} />
        </ResponseField>
        <CodeBlock language="bash" code={getCurlExec(resolvedApiKey)} secret={isReal} filename="cURL" />
      </EndpointSection>

      <EndpointSection
        id="write-files"
        method="POST"
        path="/v1/sandboxes/:id/files"
        title="Write Files"
        description="Write one or more files to the sandbox filesystem. Creates directories as needed."
        params={[
          { name: "id", type: "string", required: true, description: "Sandbox ID" },
        ]}
        bodyParams={[
          { name: "files", type: "{ path: string; content: string }[]", required: true, description: "Array of files to write" },
        ]}
      >
        <CodeBlock language="json" code={FILES_WRITE_BODY} filename="Request Body" />
        <p className="text-[13px] text-muted-foreground">
          Returns <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">200 OK</code> on success.
        </p>
      </EndpointSection>

      <EndpointSection
        id="read-file"
        method="GET"
        path="/v1/sandboxes/:id/files"
        title="Read File"
        description="Read the content of a single file from the sandbox."
        params={[
          { name: "id", type: "string", required: true, description: "Sandbox ID" },
        ]}
        queryParams={[
          { name: "path", type: "string", required: true, description: "Absolute path to the file" },
        ]}
      >
        <ResponseField>
          <CodeBlock language="json" code={FILES_READ_RESPONSE} />
        </ResponseField>
      </EndpointSection>

      <EndpointSection
        id="git-clone"
        method="POST"
        path="/v1/sandboxes/:id/git/clone"
        title="Clone Repository"
        description="Clone a git repository into the sandbox. For private repos, pass a token (e.g. GitHub PAT). Use depth: 1 for faster shallow clones."
        params={[
          { name: "id", type: "string", required: true, description: "Sandbox ID" },
        ]}
        bodyParams={[
          { name: "url", type: "string", required: true, description: "Git repository URL" },
          { name: "path", type: "string", required: false, description: "Target directory path in the sandbox" },
          { name: "token", type: "string", required: false, description: "Auth token for private repos (e.g. GitHub PAT)" },
          { name: "depth", type: "number", required: false, description: "Clone depth (use 1 for shallow clone)" },
        ]}
      >
        <CodeBlock language="json" code={GIT_CLONE_BODY} filename="Request Body" />
        <ResponseField>
          <CodeBlock language="json" code={GIT_CLONE_RESPONSE} />
        </ResponseField>
      </EndpointSection>
    </div>
  )
}
