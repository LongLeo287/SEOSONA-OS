"use client"

import { AgentsLink as Link } from "@/components/agents-link"
import { CodeBlock } from "@/components/features/agents/an/docs/code-block"
import { CopyMarkdownButton } from "@/components/features/agents/an/docs/copy-markdown-button"
import type { DocsCodeLanguage } from "@/lib/atoms/agents-docs"
import { DOCS_CODE_LANGUAGE_OPTIONS } from "@/components/features/agents/an/docs/docs-code-language-switch"
import { getDocsLang } from "@/lib/agents-docs/get-docs-lang"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

const TYPESCRIPT_CLIENT_EXAMPLE = `import { AgentClient } from "@21st-sdk/node"

const client = new AgentClient({
  apiKey: process.env.API_KEY_21ST!,
})

// Create a sandbox (with optional overrides)
const sandbox = await client.sandboxes.create({
  agent: "support-agent",
  timeoutMs: 1_800_000,
  networkAllowOut: ["api.github.com"],
  networkDenyOut: ["1.1.1.1"],
})

// Clone a repo into the sandbox
await client.sandboxes.git.clone({
  sandboxId: sandbox.id,
  url: "https://github.com/org/repo.git",
  depth: 1,
})

// Execute a command
const result = await client.sandboxes.exec({
  sandboxId: sandbox.id,
  command: "ls /home/user/workspace/repo",
})

// Write and read files
await client.sandboxes.files.write({
  sandboxId: sandbox.id,
  files: {
    "/home/user/workspace/note.txt": "Hello!",
  },
})
const file = await client.sandboxes.files.read({
  sandboxId: sandbox.id,
  path: "/home/user/workspace/note.txt",
})

// Threads & tokens
const thread = await client.threads.create({
  sandboxId: sandbox.id,
  name: "Chat 1",
})
const token = await client.tokens.create({ agent: "support-agent" })

// Cleanup
await client.sandboxes.delete(sandbox.id)`

const PYTHON_CLIENT_EXAMPLE = `import os

from twentyfirst_sdk import AgentClient

client = AgentClient(api_key=os.environ["API_KEY_21ST"])

# Create a sandbox (with optional overrides)
sandbox = client.sandboxes.create(
    agent="support-agent",
    timeout_ms=1_800_000,
    network_allow_out=["api.github.com"],
    network_deny_out=["1.1.1.1"],
)

# Clone a repo into the sandbox
client.sandboxes.git.clone(
    sandbox.id,
    url="https://github.com/org/repo.git",
    depth=1,
)

# Execute a command
result = client.sandboxes.exec(
    sandbox.id,
    "ls /home/user/workspace/repo",
)

# Write and read files
client.sandboxes.files.write(sandbox.id, {"/home/user/workspace/note.txt": "Hello!"})
file = client.sandboxes.files.read(sandbox.id, "/home/user/workspace/note.txt")

# Threads & tokens
thread = client.threads.create(sandbox_id=sandbox.id, name="Chat 1")
token = client.tokens.create(agent="support-agent")

# Cleanup
client.sandboxes.delete(sandbox.id)`

const TYPESCRIPT_RUN_EXAMPLE = `const result = await client.threads.run({
  agent: "support-agent",
  sandboxId: sandbox.id,
  threadId: thread.id,
  messages: [
    {
      role: "user",
      parts: [{ type: "text", text: "Check the refund policy for order #1234" }],
    },
  ],
})

// Vercel AI SDK UI message stream from the relay
const stream = result.response.body

// Reconnect/cancel URL for this active stream
console.log(result.resumeUrl)`

const PYTHON_RUN_EXAMPLE = `run = client.threads.run(
    agent="support-agent",
    sandbox_id=sandbox.id,
    thread_id=thread.id,
    messages=[
        {
            "role": "user",
            "parts": [
                {"type": "text", "text": "Check the refund policy for order #1234"},
            ],
        },
    ],
)

try:
    for raw_line in run.response.iter_lines(decode_unicode=True):
        if raw_line:
            print(raw_line)
finally:
    run.response.close()

print(run.resumeUrl)`

const GO_CLIENT_EXAMPLE = `package main

import (
	"context"
	"fmt"
	"log"
	"os"

	agents "github.com/21st-dev/21st-sdk-go"
)

func main() {
	ctx := context.Background()
	client := agents.NewAgentClient(os.Getenv("API_KEY_21ST"))
	timeoutMs := 1_800_000

	sandbox, err := client.Sandboxes.Create(ctx, &agents.CreateSandboxRequest{
		Agent:           "support-agent",
		TimeoutMs:       &timeoutMs,
		NetworkAllowOut: []string{"api.github.com"},
		NetworkDenyOut:  []string{"1.1.1.1"},
	})
	if err != nil {
		log.Fatal(err)
	}

	depth := 1
	if _, err := client.Sandboxes.Git.Clone(ctx, sandbox.ID, &agents.GitCloneRequest{
		URL:   "https://github.com/org/repo.git",
		Depth: &depth,
	}); err != nil {
		log.Fatal(err)
	}

	result, err := client.Sandboxes.Exec(ctx, &agents.ExecRequest{
		SandboxID: sandbox.ID,
		Command:   "ls /home/user/workspace/repo",
	})
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(result.Stdout)

	if err := client.Sandboxes.Files.Write(ctx, sandbox.ID, map[string]string{
		"/home/user/workspace/note.txt": "Hello!",
	}); err != nil {
		log.Fatal(err)
	}

	file, err := client.Sandboxes.Files.Read(ctx, sandbox.ID, "/home/user/workspace/note.txt")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(file.Content)

	thread, err := client.Threads.Create(ctx, sandbox.ID, "Chat 1")
	if err != nil {
		log.Fatal(err)
	}

	token, err := client.Tokens.Create(ctx, &agents.CreateTokenRequest{
		Agent: "support-agent",
	})
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(thread.ID, token.ExpiresAt)

	if err := client.Sandboxes.Delete(ctx, sandbox.ID); err != nil {
		log.Fatal(err)
	}
}`

const GO_RUN_EXAMPLE = `run, err := client.Threads.Run(ctx, &agents.RunThreadRequest{
	Agent:     "support-agent",
	SandboxID: sandbox.ID,
	ThreadID:  thread.ID,
	Messages: []agents.RunThreadMessage{
		{
			Role: "user",
			Parts: []map[string]interface{}{
				{"type": "text", "text": "Check the refund policy for order #1234"},
			},
		},
	},
})
if err != nil {
	log.Fatal(err)
}
defer run.Response.Body.Close()

scanner := bufio.NewScanner(run.Response.Body)
for scanner.Scan() {
	if line := strings.TrimSpace(scanner.Text()); line != "" {
		fmt.Println(line)
	}
}
if err := scanner.Err(); err != nil {
	log.Fatal(err)
}

fmt.Println(run.ResumeURL)`

const TYPESCRIPT_RUN_WITH_OPTIONS_EXAMPLE = `const result = await client.threads.run({
  agent: "support-agent",
  sandboxId: sandbox.id,
  threadId: thread.id,
  // Credential vaults attached for this run, ordered by priority.
  // First-match-wins by host pattern.
  vaultIds: [userVaultId, teamVaultId],
  // Or: let the relay resolve the user's vault via metadata.external_user_id.
  // externalUserId: "usr_abc123",
  messages: [
    {
      role: "user",
      parts: [{ type: "text", text: "Review the checkout flow before release." }],
    },
  ],
  options: {
    systemPrompt: {
      type: "preset",
      preset: "claude_code",
      append: "Focus on regressions, risky edge cases, and missing tests. Do not edit files.",
    },
    maxTurns: 4,
    maxBudgetUsd: 0.2,
    disallowedTools: ["Bash"],
  },
})`

const PYTHON_RUN_WITH_OPTIONS_EXAMPLE = `run = client.threads.run(
    agent="support-agent",
    sandbox_id=sandbox.id,
    thread_id=thread.id,
    # Credential vaults attached for this run; first-match-wins by host.
    vault_ids=[user_vault_id, team_vault_id],
    # Or: external_user_id="usr_abc123" to let the relay pick the user's vault.
    messages=[
        {
            "role": "user",
            "parts": [
                {"type": "text", "text": "Review the checkout flow before release."},
            ],
        },
    ],
    options={
        "systemPrompt": {
            "type": "preset",
            "preset": "claude_code",
            "append": "Focus on regressions, risky edge cases, and missing tests. Do not edit files.",
        },
        "maxTurns": 4,
        "maxBudgetUsd": 0.2,
        "disallowedTools": ["Bash"],
    },
)`

const GO_RUN_WITH_OPTIONS_EXAMPLE = `result, err := client.Threads.Run(ctx, &agents.RunThreadRequest{
	Agent:     "support-agent",
	SandboxID: sandbox.ID,
	ThreadID:  thread.ID,
	// Credential vaults attached for this run; first-match-wins by host.
	VaultIDs: []string{userVaultID, teamVaultID},
	// Or: ExternalUserID: "usr_abc123" to resolve the user's vault by metadata.
	Messages: []agents.RunThreadMessage{
		{
			Role: "user",
			Parts: []map[string]interface{}{
				{"type": "text", "text": "Review the checkout flow before release."},
			},
		},
	},
	Options: &agents.AgentRequestOptions{
		SystemPrompt: map[string]interface{}{
			"type":   "preset",
			"preset": "claude_code",
			"append": "Focus on regressions, risky edge cases, and missing tests. Do not edit files.",
		},
		MaxTurns:        4,
		MaxBudgetUsd:    0.2,
		DisallowedTools: []string{"Bash"},
	},
})
if err != nil {
	log.Fatal(err)
}`

type ServerSdkCodeLanguage = "typescript" | "python" | "go"
type DocsExampleCodeLanguage = ServerSdkCodeLanguage | "tsx"

type DocsExampleBlock = {
  code: string
  language: DocsExampleCodeLanguage
  filename: string
}

type DocsExampleSection = {
  title: string
  description?: string
  codeBlocks: DocsExampleBlock[]
  footer?: string
}

type DocsContentSection = {
  title: string
  description: string
  callout?: string
  items: DocsExampleSection[]
}

const NEXTJS_TOKEN_ROUTE_EXAMPLE = `import { createTokenHandler } from "@21st-sdk/nextjs/server"

export const POST = createTokenHandler({
  apiKey: process.env.API_KEY_21ST!,
})`

const NEXTJS_EXCHANGE_TOKEN_EXAMPLE = `import { exchangeToken } from "@21st-sdk/nextjs/server"

export async function POST(req: Request) {
  const { agent, userId } = await req.json() as {
    agent?: string
    userId?: string
  }

  const data = await exchangeToken({
    apiKey: process.env.API_KEY_21ST!,
    agent,
    userId,
    expiresIn: "1h",
  })

  return Response.json(data)
}`

const CREATE_SESSION_EXAMPLE = `import { AgentClient } from "@21st-sdk/node"
import { db } from "@/db"

const client = new AgentClient({
  apiKey: process.env.API_KEY_21ST!,
})

export async function createSession(userId: string) {
  const sandbox = await client.sandboxes.create({ agent: "support-agent" })
  const thread = await client.threads.create({
    sandboxId: sandbox.id,
    name: "New chat",
  })

  return db.agentSession.create({
    data: {
      userId,
      agent: "support-agent",
      sandboxId: sandbox.id,
      threadId: thread.id,
    },
  })
}`

const CONTINUE_SESSION_EXAMPLE = `import { AgentClient } from "@21st-sdk/node"
import type { UIMessage } from "ai"
import { db } from "@/db"

const client = new AgentClient({
  apiKey: process.env.API_KEY_21ST!,
})

export async function POST(
  req: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params
  const { messages } = await req.json() as { messages: UIMessage[] }

  const session = await db.agentSession.findUniqueOrThrow({
    where: { id: sessionId },
  })

  const result = await client.threads.run({
    agent: session.agent,
    sandboxId: session.sandboxId,
    threadId: session.threadId,
    messages,
  })

  return new Response(result.response.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}`

const NEW_THREAD_EXAMPLE = `import { AgentClient } from "@21st-sdk/node"
import { db } from "@/db"

const client = new AgentClient({
  apiKey: process.env.API_KEY_21ST!,
})

export async function createFollowUpSession(sessionId: string) {
  const existing = await db.agentSession.findUniqueOrThrow({
    where: { id: sessionId },
  })

  const thread = await client.threads.create({
    sandboxId: existing.sandboxId,
    name: "Follow-up chat",
  })

  return db.agentSession.create({
    data: {
      userId: existing.userId,
      agent: existing.agent,
      sandboxId: existing.sandboxId,
      threadId: thread.id,
    },
  })
}`

const RESTORE_SESSION_SERVER_EXAMPLE = `import { AgentClient } from "@21st-sdk/node"
import type { UIMessage } from "ai"
import { db } from "@/db"
import { SessionChat } from "@/components/session-chat"

const client = new AgentClient({
  apiKey: process.env.API_KEY_21ST!,
})

async function getSessionState(sessionId: string) {
  const session = await db.agentSession.findUniqueOrThrow({
    where: { id: sessionId },
  })

  const thread = await client.threads.get({
    sandboxId: session.sandboxId,
    threadId: session.threadId,
  })

  return {
    agent: session.agent,
    sandboxId: session.sandboxId,
    threadId: session.threadId,
    initialMessages: (thread.messages as UIMessage[] | undefined) ?? [],
    resumeStreamOnMount: thread.status === "streaming",
  }
}

export default async function SessionPage(
  props: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await props.params
  const session = await getSessionState(sessionId)

  return <SessionChat {...session} />
}`

const RESTORE_SESSION_CLIENT_EXAMPLE = `"use client"

import { useChat } from "@ai-sdk/react"
import { AgentChat, createAgentChat } from "@21st-sdk/react"
import type { UIMessage } from "ai"
import "@21st-sdk/react/styles.css"
import { useEffect, useMemo, useRef } from "react"

export function SessionChat(props: {
  agent: string
  sandboxId: string
  threadId: string
  initialMessages: UIMessage[]
  resumeStreamOnMount: boolean
}) {
  const {
    agent,
    sandboxId,
    threadId,
    initialMessages,
    resumeStreamOnMount,
  } = props

  const chat = useMemo(
    () =>
      createAgentChat({
        agent,
        tokenUrl: "/api/an/token",
        sandboxId,
        threadId,
      }),
    [agent, sandboxId, threadId],
  )

  const { messages, sendMessage, status, stop, error, setMessages } = useChat({
    chat,
    resume: resumeStreamOnMount,
  })
  const hydratedRef = useRef(false)

  useEffect(() => {
    if (hydratedRef.current) return
    hydratedRef.current = true
    setMessages(initialMessages)
  }, [initialMessages, setMessages])

  return (
    <AgentChat
      messages={messages}
      onSend={(message) =>
        sendMessage({
          role: "user",
          parts: [{ type: "text", text: message.content }],
        })
      }
      status={status}
      onStop={stop}
      error={error}
    />
  )
}`

const PYTHON_CREATE_SESSION_EXAMPLE = `from twentyfirst_sdk import AgentClient


def create_session(client: AgentClient, agent: str) -> dict[str, str]:
    sandbox = client.sandboxes.create(agent=agent)
    thread = client.threads.create(sandbox_id=sandbox.id, name="Terminal chat")

    return {
        "agent": agent,
        "sandbox_id": sandbox.id,
        "thread_id": thread.id,
    }`

const PYTHON_CONTINUE_SESSION_EXAMPLE = `import json
from typing import Any

from twentyfirst_sdk import AgentClient


def make_message(role: str, text: str) -> dict[str, Any]:
    return {
        "role": role,
        "parts": [{"type": "text", "text": text}],
    }


def stream_assistant_response(response) -> str:
    parts: list[str] = []

    try:
        for raw_line in response.iter_lines(decode_unicode=True):
            if not raw_line:
                continue

            line = raw_line.strip()
            if not line.startswith("data: "):
                continue

            payload = line[6:]
            if payload == "[DONE]":
                break

            event = json.loads(payload)
            if event.get("type") == "text-delta":
                parts.append(event.get("delta") or "")
            elif event.get("type") == "error":
                raise RuntimeError(event.get("errorText") or event.get("error") or "Unknown error")
    finally:
        response.close()

    return "".join(parts)


def continue_session(
    client: AgentClient,
    agent: str,
    sandbox_id: str,
    thread_id: str,
    messages: list[dict[str, Any]],
    prompt: str,
) -> list[dict[str, Any]]:
    messages.append(make_message("user", prompt))

    result = client.threads.run(
        agent=agent,
        messages=messages,
        sandbox_id=sandbox_id,
        thread_id=thread_id,
    )

    assistant_text = stream_assistant_response(result.response)

    if assistant_text:
        messages.append(make_message("assistant", assistant_text))

    latest_thread = client.threads.get(sandbox_id, thread_id)
    if isinstance(latest_thread.messages, list):
        return list(latest_thread.messages)

    return messages`

const PYTHON_NEW_THREAD_EXAMPLE = `from typing import Any

from twentyfirst_sdk import AgentClient


def reset_thread(
    client: AgentClient,
    sandbox_id: str,
) -> tuple[str, list[dict[str, Any]]]:
    thread = client.threads.create(
        sandbox_id=sandbox_id,
        name="Terminal chat",
    )

    return thread.id, []`

const GO_CREATE_SESSION_EXAMPLE = `package session

import (
	"context"

	agents "github.com/21st-dev/21st-sdk-go"
)

type Session struct {
	Agent     string
	SandboxID string
	ThreadID  string
}

func CreateSession(
	ctx context.Context,
	client *agents.AgentClient,
	agent string,
) (*Session, error) {
	sandbox, err := client.Sandboxes.Create(ctx, &agents.CreateSandboxRequest{
		Agent: agent,
	})
	if err != nil {
		return nil, err
	}

	thread, err := client.Threads.Create(ctx, sandbox.ID, "Support chat")
	if err != nil {
		return nil, err
	}

	return &Session{
		Agent:     agent,
		SandboxID: sandbox.ID,
		ThreadID:  thread.ID,
	}, nil
}`

const GO_CONTINUE_SESSION_EXAMPLE = `package session

import (
	"bufio"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"strings"

	agents "github.com/21st-dev/21st-sdk-go"
)

type sseEvent struct {
	Type      string
	Delta     string
	Error     string
	ErrorText string
}

func textMessage(role, text string) agents.RunThreadMessage {
	return agents.RunThreadMessage{
		Role: role,
		Parts: []map[string]interface{}{
			{"type": "text", "text": text},
		},
	}
}

func readAssistantText(body io.ReadCloser) (string, error) {
	defer body.Close()

	scanner := bufio.NewScanner(body)
	var builder strings.Builder

	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if !strings.HasPrefix(line, "data: ") {
			continue
		}

		payload := strings.TrimPrefix(line, "data: ")
		if payload == "[DONE]" {
			break
		}

		var event sseEvent
		if err := json.Unmarshal([]byte(payload), &event); err != nil {
			return "", err
		}

		if event.Type == "text-delta" {
			builder.WriteString(event.Delta)
		}
		if event.Type == "error" {
			if event.ErrorText != "" {
				return "", fmt.Errorf("%s", event.ErrorText)
			}
			return "", fmt.Errorf("%s", event.Error)
		}
	}

	if err := scanner.Err(); err != nil {
		return "", err
	}

	return builder.String(), nil
}

func decodeThreadMessages(value interface{}) ([]agents.RunThreadMessage, bool) {
	raw, err := json.Marshal(value)
	if err != nil {
		return nil, false
	}

	var messages []agents.RunThreadMessage
	if err := json.Unmarshal(raw, &messages); err != nil {
		return nil, false
	}

	return messages, true
}

func ContinueSession(
	ctx context.Context,
	client *agents.AgentClient,
	session *Session,
	messages []agents.RunThreadMessage,
	prompt string,
) ([]agents.RunThreadMessage, error) {
	messages = append(messages, textMessage("user", prompt))

	result, err := client.Threads.Run(ctx, &agents.RunThreadRequest{
		Agent:     session.Agent,
		SandboxID: session.SandboxID,
		ThreadID:  session.ThreadID,
		Messages:  messages,
	})
	if err != nil {
		return nil, err
	}

	assistantText, err := readAssistantText(result.Response)
	if err != nil {
		return nil, err
	}
	if assistantText != "" {
		messages = append(messages, textMessage("assistant", assistantText))
	}

	thread, err := client.Threads.Get(ctx, session.SandboxID, session.ThreadID)
	if err != nil {
		return nil, err
	}

	if persisted, ok := decodeThreadMessages(thread.Messages); ok {
		return persisted, nil
	}

	return messages, nil
}`

const GO_NEW_THREAD_EXAMPLE = `package session

import (
	"context"

	agents "github.com/21st-dev/21st-sdk-go"
)

func ResetThread(
	ctx context.Context,
	client *agents.AgentClient,
	sandboxID string,
) (string, []agents.RunThreadMessage, error) {
	thread, err := client.Threads.Create(ctx, sandboxID, "Follow-up chat")
	if err != nil {
		return "", nil, err
	}

	return thread.ID, []agents.RunThreadMessage{}, nil
}`

const SERVER_SDK_LANGUAGE_CONTENT: Record<
  DocsCodeLanguage,
  {
    packageName: string
    clientCode: string
    clientFilename: string
    codeLanguage: ServerSdkCodeLanguage
    agentClientCode: string
    sandboxesMethods: { method: string; description: string }[]
    threadsMethods: { method: string; description: string }[]
    runExample: string
    runWithOptionsExample: string
    tokensMethod: string
    tokensDescription: string
    nextJsServerSection?: DocsContentSection
    sessionPatternsSection: DocsContentSection
  }
> = {
  typescript: {
    packageName: "@21st-sdk/node",
    clientCode: TYPESCRIPT_CLIENT_EXAMPLE,
    clientFilename: "server.ts",
    codeLanguage: "typescript",
    agentClientCode: `const client = new AgentClient({
  apiKey: process.env.API_KEY_21ST!,
})`,
    sandboxesMethods: [
      {
        method: "sandboxes.create({ agent, files?, envs?, setup?, timeoutMs?, networkAllowOut?, networkDenyOut? })",
        description:
          "Creates a runtime sandbox for a deployed agent. Uses the agent's deployed sandbox config, then optionally overrides runtime TTL and outbound network policy.",
      },
      {
        method: "sandboxes.get(sandboxId)",
        description:
          "Returns sandbox status, error state, agent info, and thread summaries.",
      },
      {
        method: "sandboxes.delete(sandboxId)",
        description:
          "Deletes the runtime sandbox and cascades deletion to its threads.",
      },
      {
        method: "sandboxes.exec({ sandboxId, command, cwd?, envs?, timeoutMs? })",
        description:
          "Runs a shell command inside the sandbox and returns stdout, stderr, and exit code.",
      },
      {
        method: "sandboxes.files.write({ sandboxId, files })",
        description: "Writes one or more files into the sandbox.",
      },
      {
        method: "sandboxes.files.read({ sandboxId, path })",
        description:
          "Reads one file from the sandbox and returns its content.",
      },
      {
        method: "sandboxes.git.clone({ sandboxId, url, path?, token?, depth? })",
        description: "Clones a git repo into the sandbox.",
      },
    ],
    threadsMethods: [
      {
        method: "threads.list({ sandboxId })",
        description: "Lists thread summaries for one runtime sandbox.",
      },
      {
        method: "threads.create({ sandboxId, name? })",
        description: "Creates a new thread inside an existing runtime sandbox.",
      },
      {
        method: "threads.get({ sandboxId, threadId })",
        description:
          "Returns one thread, including persisted messages when available.",
      },
      {
        method: "threads.delete({ sandboxId, threadId })",
        description: "Deletes a single thread from the sandbox.",
      },
      {
        method: "threads.run({ agent, messages, sandboxId?, threadId?, name?, options? })",
        description:
          "Convenience method that can auto-create a sandbox and thread, then POST to the chat stream endpoint.",
      },
    ],
    runExample: TYPESCRIPT_RUN_EXAMPLE,
    runWithOptionsExample: TYPESCRIPT_RUN_WITH_OPTIONS_EXAMPLE,
    tokensMethod: "client.tokens.create({ agent?, userId?, expiresIn? })",
    tokensDescription:
      "returns a short-lived JWT for client-side chat access.",
    nextJsServerSection: {
      title: "2. @21st-sdk/nextjs/server",
      description:
        "@21st-sdk/nextjs/server only handles token exchange for browser chat. For now, that is the entire server-side surface of this package.",
      callout:
        "It does not manage sandboxes, threads, files, or sessions. Use @21st-sdk/node for those.",
      items: [
        {
          title: "Create a token route",
          codeBlocks: [
            {
              code: NEXTJS_TOKEN_ROUTE_EXAMPLE,
              language: "typescript",
              filename: "app/api/an/token/route.ts",
            },
          ],
        },
        {
          title: "Low-level token exchange",
          description:
            "Use exchangeToken() only if you want to wrap the token exchange yourself.",
          codeBlocks: [
            {
              code: NEXTJS_EXCHANGE_TOKEN_EXAMPLE,
              language: "typescript",
              filename: "app/api/an/token/route.ts",
            },
          ],
        },
      ],
    },
    sessionPatternsSection: {
      title: "3. Session patterns",
      description:
        "The server SDK gives you sandbox and thread primitives. If you want persistent sessions, you store those IDs yourself and reuse them on later requests.",
      items: [
        {
          title: "Create a new session",
          codeBlocks: [
            {
              code: CREATE_SESSION_EXAMPLE,
              language: "typescript",
              filename: "lib/an-session.ts",
            },
          ],
        },
          {
            title: "Continue an existing session",
            description:
              "Load the stored IDs, call threads.run(), and stream the SDK response back to the client. The request body should include the full messages array your UI is currently rendering.",
            codeBlocks: [
            {
              code: CONTINUE_SESSION_EXAMPLE,
              language: "typescript",
              filename: "app/api/agent-sessions/[sessionId]/messages/route.ts",
            },
          ],
        },
        {
          title: "Create a new thread in the same sandbox",
          description:
            "Use this when you want a clean conversation but want to keep the same filesystem, cloned repos, and sandbox state.",
          codeBlocks: [
            {
              code: NEW_THREAD_EXAMPLE,
              language: "typescript",
              filename: "lib/an-session.ts",
            },
          ],
        },
        {
          title: "Hydrate the UI and resume active streams",
          description:
            "This is one restore flow. On the server, call threads.get() and load both the persisted messages array and the thread status. Pass the messages to the client as initialMessages and derive resumeStreamOnMount from thread.status === \"streaming\".",
          codeBlocks: [
            {
              code: RESTORE_SESSION_SERVER_EXAMPLE,
              language: "typescript",
              filename: "app/agent-sessions/[sessionId]/page.tsx",
            },
            {
              code: RESTORE_SESSION_CLIENT_EXAMPLE,
              language: "tsx",
              filename: "components/session-chat.tsx",
            },
          ],
          footer:
            "After hydration or resume, the client should keep sending the full updated messages array back to your server route on each turn.",
        },
      ],
    },
  },
  python: {
    packageName: "21st-sdk",
    clientCode: PYTHON_CLIENT_EXAMPLE,
    clientFilename: "server.py",
    codeLanguage: "python",
    agentClientCode: `client = AgentClient(api_key=os.environ["API_KEY_21ST"])`,
    sandboxesMethods: [
      {
        method: "sandboxes.create(agent, files=None, envs=None, setup=None, timeout_ms=None, network_allow_out=None, network_deny_out=None)",
        description:
          "Creates a runtime sandbox for a deployed agent. Uses the agent's deployed sandbox config, then optionally overrides runtime TTL and outbound network policy.",
      },
      {
        method: "sandboxes.get(sandbox_id)",
        description:
          "Returns sandbox status, error state, agent info, and thread summaries.",
      },
      {
        method: "sandboxes.delete(sandbox_id)",
        description:
          "Deletes the runtime sandbox and cascades deletion to its threads.",
      },
      {
        method: "sandboxes.exec(sandbox_id, command, cwd=None, envs=None, timeout_ms=None)",
        description:
          "Runs a shell command inside the sandbox and returns stdout, stderr, and exit code.",
      },
      {
        method: "sandboxes.files.write(sandbox_id, files)",
        description: "Writes one or more files into the sandbox.",
      },
      {
        method: "sandboxes.files.read(sandbox_id, path)",
        description:
          "Reads one file from the sandbox and returns its content.",
      },
      {
        method: "sandboxes.git.clone(sandbox_id, url, path=None, token=None, depth=None)",
        description: "Clones a git repo into the sandbox.",
      },
    ],
    threadsMethods: [
      {
        method: "threads.list(sandbox_id)",
        description: "Lists thread summaries for one runtime sandbox.",
      },
      {
        method: "threads.create(sandbox_id, name=None)",
        description: "Creates a new thread inside an existing runtime sandbox.",
      },
      {
        method: "threads.get(sandbox_id, thread_id)",
        description:
          "Returns one thread, including persisted messages when available.",
      },
      {
        method: "threads.delete(sandbox_id, thread_id)",
        description: "Deletes a single thread from the sandbox.",
      },
      {
        method: "threads.run(agent, messages, sandbox_id=None, thread_id=None, name=None, options=None)",
        description:
          "Convenience method that can auto-create a sandbox and thread, then POST to the chat stream endpoint.",
      },
    ],
    runExample: PYTHON_RUN_EXAMPLE,
    runWithOptionsExample: PYTHON_RUN_WITH_OPTIONS_EXAMPLE,
    tokensMethod: 'client.tokens.create(agent=None, user_id=None, expires_in="1h")',
    tokensDescription:
      "returns a short-lived JWT if you need to delegate agent access to another client.",
    sessionPatternsSection: {
      title: "2. Session patterns",
      description:
        "The Python SDK gives you sandbox and thread primitives. For persistent backend sessions, store the agent slug, sandbox_id, thread_id, and current messages list yourself.",
      items: [
        {
          title: "Create a new session",
          codeBlocks: [
            {
              code: PYTHON_CREATE_SESSION_EXAMPLE,
              language: "python",
              filename: "session.py",
            },
          ],
        },
        {
          title: "Continue an existing session",
          description:
            "Append the new user message, call threads.run(), stream the response, then refresh the thread state from the API.",
          codeBlocks: [
            {
              code: PYTHON_CONTINUE_SESSION_EXAMPLE,
              language: "python",
              filename: "session.py",
            },
          ],
          footer:
            "Keep a local messages list and replace it with thread.messages after each run when the API returns persisted history.",
        },
        {
          title: "Create a new thread in the same sandbox",
          description:
            "Use this when you want a fresh conversation but want to keep the same sandbox filesystem and repo state alive.",
          codeBlocks: [
            {
              code: PYTHON_NEW_THREAD_EXAMPLE,
              language: "python",
              filename: "session.py",
            },
          ],
        },
      ],
    },
  },
  go: {
    packageName: "github.com/21st-dev/21st-sdk-go",
    clientCode: GO_CLIENT_EXAMPLE,
    clientFilename: "main.go",
    codeLanguage: "go",
    agentClientCode: `client := agents.NewAgentClient(os.Getenv("API_KEY_21ST"))`,
    sandboxesMethods: [
      {
        method: "Sandboxes.Create(ctx, *CreateSandboxRequest)",
        description:
          "Creates a runtime sandbox for a deployed agent. Uses the agent's deployed sandbox config, then optionally overrides runtime TTL and outbound network policy.",
      },
      {
        method: "Sandboxes.Get(ctx, sandboxID)",
        description:
          "Returns sandbox status, error state, agent info, and thread summaries.",
      },
      {
        method: "Sandboxes.Delete(ctx, sandboxID)",
        description:
          "Deletes the runtime sandbox and cascades deletion to its threads.",
      },
      {
        method: "Sandboxes.Exec(ctx, *ExecRequest)",
        description:
          "Runs a shell command inside the sandbox and returns stdout, stderr, and exit code.",
      },
      {
        method: "Sandboxes.Files.Write(ctx, sandboxID, files)",
        description: "Writes one or more files into the sandbox.",
      },
      {
        method: "Sandboxes.Files.Read(ctx, sandboxID, path)",
        description:
          "Reads one file from the sandbox and returns its content.",
      },
      {
        method: "Sandboxes.Git.Clone(ctx, sandboxID, *GitCloneRequest)",
        description: "Clones a git repo into the sandbox.",
      },
    ],
    threadsMethods: [
      {
        method: "Threads.List(ctx, sandboxID)",
        description: "Lists thread summaries for one runtime sandbox.",
      },
      {
        method: "Threads.Create(ctx, sandboxID, name)",
        description: "Creates a new thread inside an existing runtime sandbox.",
      },
      {
        method: "Threads.Get(ctx, sandboxID, threadID)",
        description:
          "Returns one thread, including persisted messages when available.",
      },
      {
        method: "Threads.Delete(ctx, sandboxID, threadID)",
        description: "Deletes a single thread from the sandbox.",
      },
      {
        method: "Threads.Run(ctx, *RunThreadRequest{ Options? })",
        description:
          "Convenience method that can auto-create a sandbox and thread, then POST to the chat stream endpoint.",
      },
    ],
    runExample: GO_RUN_EXAMPLE,
    runWithOptionsExample: GO_RUN_WITH_OPTIONS_EXAMPLE,
    tokensMethod:
      "client.Tokens.Create(ctx, &agents.CreateTokenRequest{Agent?, UserID?, ExpiresIn?})",
    tokensDescription:
      "returns a short-lived JWT if you need to delegate agent access to another client.",
    sessionPatternsSection: {
      title: "2. Session patterns",
      description:
        "The Go SDK gives you sandbox and thread primitives. For persistent backend sessions, store the agent slug, sandbox ID, thread ID, and current messages list yourself.",
      items: [
        {
          title: "Create a new session",
          codeBlocks: [
            {
              code: GO_CREATE_SESSION_EXAMPLE,
              language: "go",
              filename: "session.go",
            },
          ],
        },
        {
          title: "Continue an existing session",
          description:
            "Append the new user message, call Threads.Run(), stream the SSE response, then refresh the thread state from the API.",
          codeBlocks: [
            {
              code: GO_CONTINUE_SESSION_EXAMPLE,
              language: "go",
              filename: "session.go",
            },
          ],
          footer:
            "If your API returns persisted history, prefer that over a locally reconstructed messages slice after each run.",
        },
        {
          title: "Create a new thread in the same sandbox",
          description:
            "Use this when you want a fresh conversation but want to keep the same sandbox filesystem and repo state alive.",
          codeBlocks: [
            {
              code: GO_NEW_THREAD_EXAMPLE,
              language: "go",
              filename: "session.go",
            },
          ],
        },
      ],
    },
  },
}

export function ServerSdkContent() {
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

  const languageContent = SERVER_SDK_LANGUAGE_CONTENT[docsCodeLanguage]

  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Server SDK</h1>
            <p className="mt-1.5 max-w-[620px] text-[14px] leading-relaxed text-muted-foreground">
              Reference for the runtime sandbox/thread API from the selected
              server SDK package{" "}
              <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">{languageContent.packageName}</code>
              {languageContent.nextJsServerSection ? (
                <>
                  , plus the token exchange helpers from{" "}
                  <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">@21st-sdk/nextjs/server</code>
                </>
              ) : null}
              .
            </p>
          </div>
          <CopyMarkdownButton />
        </div>
        <div className="mt-3 inline-flex items-center gap-0.5 rounded-lg border border-border bg-muted/30 p-0.5">
          {DOCS_CODE_LANGUAGE_OPTIONS.map((option) => {
            const Icon = option.icon
            const isSelected = option.id === docsCodeLanguage
            return (
              <button
                key={option.id}
                onClick={() =>
                  setDocsCodeLanguage(option.id as DocsCodeLanguage)
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
        <div className="mt-4 rounded-lg border border-border bg-secondary/30 p-4 text-[13px] leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground">Important:</span>{" "}
          there is no higher-level session object in the SDK. A session in your
          app is usually your own database row that stores{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">agent</code>,{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">sandboxId</code>,
          and <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">threadId</code>. Use{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">{languageContent.packageName}</code>{" "}
          to create and drive those resources from your server code.
        </div>
        {docsCodeLanguage === "python" ? (
          <div className="mt-4 rounded-lg border border-border bg-secondary/30 p-4 text-[13px] leading-relaxed text-muted-foreground">
            To understand how the Python SDK works in a complete server-only example, also check the{" "}
            <Link
              href="/agents/docs/templates/python-terminal-chat"
              className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
            >
              Python Starter template
            </Link>
            .
          </div>
        ) : null}
      </div>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">How the layers fit together</h2>
        <ul className="list-disc space-y-1.5 pl-5 text-[13px] leading-relaxed text-muted-foreground">
          <li>
            The sandbox config in your agent definition sets the deploy-time
            template build and per-sandbox setup for a deployed agent. See{" "}
            <Link
              href="/agents/docs/build/sandbox"
              className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
            >
              Sandbox
            </Link>
            .
          </li>
          <li>
            <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">AgentClient</code>{" "}
            in <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">{languageContent.packageName}</code>{" "}
            creates and manages runtime sandboxes, threads, files, commands,
            git clones, and tokens.
          </li>
          {languageContent.nextJsServerSection ? (
            <li>
              <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">@21st-sdk/nextjs/server</code>{" "}
              is only a token exchange helper for Next.js route handlers.
            </li>
          ) : null}
          <li>
            Remote tool executions receive{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">client</code>,{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">sandboxId</code> inside{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">
              execute(args, context)
            </code>
            . Read env vars from{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">process.env</code>
            . See{" "}
            <Link
              href="/agents/docs/build/sandbox"
              className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
            >
              Sandbox
            </Link>
            .
          </li>
          <li>
            For raw HTTP endpoints and SSE behavior, see the{" "}
            <Link
              href="/agents/docs/api-reference"
              className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
            >
              API Reference
            </Link>
            .
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">1. Server SDK client</h2>
        <p className="text-[14px] leading-relaxed text-muted-foreground">
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">{languageContent.packageName}</code>{" "}
          is the package that actually manages sandboxes, threads, and tokens
          from server code.
        </p>

        <CodeBlock
          code={languageContent.clientCode}
          language={languageContent.codeLanguage}
          filename={languageContent.clientFilename}
        />

        <div className="space-y-3">
          <h3 className="text-[13px] font-medium">AgentClient</h3>
          <CodeBlock
            code={languageContent.agentClientCode}
            language={languageContent.codeLanguage}
          />
        </div>

        <div className="rounded-lg border border-border bg-secondary/30 p-4 text-[13px] leading-relaxed text-muted-foreground">
          Keep the sandbox ID you get from{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">
            sandboxes.create()
          </code>{" "}
          and reuse{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">
            sandboxes.exec()
          </code>
          ,{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">
            sandboxes.files.read()
          </code>
          ,{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">
            sandboxes.files.write()
          </code>
          , and{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">
            sandboxes.git.clone()
          </code>{" "}
          methods whenever your own backend needs to revisit that sandbox later.
        </div>

        <div className="space-y-3">
          <h3 className="text-[13px] font-medium">Sandboxes</h3>
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-3 py-2 text-left text-[11px] font-medium text-muted-foreground">
                    Method
                  </th>
                  <th className="px-3 py-2 text-left text-[11px] font-medium text-muted-foreground">
                    Current behavior
                  </th>
                </tr>
              </thead>
              <tbody>
                {languageContent.sandboxesMethods.map((row, i, arr) => (
                  <tr
                    key={row.method}
                    className={i < arr.length - 1 ? "border-b border-border" : ""}
                  >
                    <td className="px-3 py-2.5 align-top font-medium">
                      <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">
                        {row.method}
                      </code>
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">
                      {row.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-[13px] font-medium">Threads</h3>
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-3 py-2 text-left text-[11px] font-medium text-muted-foreground">
                    Method
                  </th>
                  <th className="px-3 py-2 text-left text-[11px] font-medium text-muted-foreground">
                    Current behavior
                  </th>
                </tr>
              </thead>
              <tbody>
                {languageContent.threadsMethods.map((row, i, arr) => (
                  <tr
                    key={row.method}
                    className={i < arr.length - 1 ? "border-b border-border" : ""}
                  >
                    <td className="px-3 py-2.5 align-top font-medium">
                      <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">
                        {row.method}
                      </code>
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">
                      {row.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-[13px] font-medium">Run threads from server</h3>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            In the server SDK, omitting{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">sandboxId</code>{" "}
            creates a sandbox first, and omitting{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">threadId</code>{" "}
            creates a thread in that sandbox before calling the relay.
          </p>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            The response stream uses the Vercel AI SDK UI{" "}
            <a
              href="https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol"
              target="_blank"
              rel="noopener noreferrer"
              className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
            >
              message stream protocol over SSE
            </a>
            . Your server should treat <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">result.response</code>{" "}
            as a stream to proxy or consume, not as a single buffered JSON payload.
          </p>
          <div className="rounded-lg border border-border bg-secondary/30 p-4 text-[13px] leading-relaxed text-muted-foreground">
            You can pass the current AI SDK{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">messages</code>{" "}
            array. The relay uses the last{" "}
            <span className="font-medium text-foreground">user</span> message as
            the next chat turn and appends the new turn to the stored thread
            history.
          </div>
          <CodeBlock
            code={languageContent.runExample}
            language={languageContent.codeLanguage}
            filename={languageContent.clientFilename}
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-[13px] font-medium">Per-run runtime options</h3>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            Pass <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">options</code>{" "}
            when one backend request should temporarily override the deployed
            agent config. This is useful for one-off reviews, stricter budgets,
            or task-specific prompting.
          </p>
          <div className="rounded-lg border border-border bg-secondary/30 p-4 text-[13px] leading-relaxed text-muted-foreground">
            Currently applied by the runtime:{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">systemPrompt</code>,{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">maxTurns</code>,{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">maxBudgetUsd</code>, and{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">disallowedTools</code>.
          </div>
          <CodeBlock
            code={languageContent.runWithOptionsExample}
            language={languageContent.codeLanguage}
            filename={languageContent.clientFilename}
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-[13px] font-medium">Tokens</h3>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">
              {languageContent.tokensMethod}
            </code>{" "}
            {languageContent.tokensDescription} Default{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">expiresIn</code>{" "}
            is <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">"1h"</code>.
          </p>
        </div>
      </section>

      {languageContent.nextJsServerSection ? (
        <section className="space-y-4">
          <h2 className="text-[15px] font-medium">
            {languageContent.nextJsServerSection.title}
          </h2>
          <p className="text-[14px] leading-relaxed text-muted-foreground">
            {languageContent.nextJsServerSection.description}
          </p>
          {languageContent.nextJsServerSection.callout ? (
            <div className="rounded-lg border border-border bg-secondary/30 p-4 text-[13px] leading-relaxed text-muted-foreground">
              {languageContent.nextJsServerSection.callout}
            </div>
          ) : null}

          {languageContent.nextJsServerSection.items.map((item) => (
            <div key={item.title} className="space-y-3">
              <h3 className="text-[13px] font-medium">{item.title}</h3>
              {item.description ? (
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              ) : null}
              {item.codeBlocks.map((codeBlock) => (
                <CodeBlock
                  key={`${item.title}-${codeBlock.filename}`}
                  code={codeBlock.code}
                  language={codeBlock.language}
                  filename={codeBlock.filename}
                />
              ))}
              {item.footer ? (
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  {item.footer}
                </p>
              ) : null}
            </div>
          ))}
        </section>
      ) : null}

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">
          {languageContent.sessionPatternsSection.title}
        </h2>
        <p className="text-[14px] leading-relaxed text-muted-foreground">
          {languageContent.sessionPatternsSection.description}
        </p>

        {languageContent.sessionPatternsSection.items.map((item) => (
          <div key={item.title} className="space-y-3">
            <h3 className="text-[13px] font-medium">{item.title}</h3>
            {item.description ? (
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            ) : null}
            {item.codeBlocks.map((codeBlock) => (
              <CodeBlock
                key={`${item.title}-${codeBlock.filename}`}
                code={codeBlock.code}
                language={codeBlock.language}
                filename={codeBlock.filename}
              />
            ))}
            {item.footer ? (
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                {item.footer}
              </p>
            ) : null}
          </div>
        ))}
      </section>

      {/* What's next */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">What&apos;s next</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { title: "Backend Integration", description: "Manage sandboxes, threads, and run agents from your server.", href: "/agents/docs/deploy/backend-integration" },
            { title: "Frontend Integration", description: "Add the chat UI to your app with the React SDK.", href: "/agents/docs/deploy/frontend-integration" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="an-focus-btn group rounded-lg border border-border p-4 transition-colors hover:bg-secondary/30"
            >
              <p className="text-[13px] font-medium group-hover:text-foreground">{item.title}</p>
              <p className="mt-0.5 text-[12px] text-muted-foreground">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
