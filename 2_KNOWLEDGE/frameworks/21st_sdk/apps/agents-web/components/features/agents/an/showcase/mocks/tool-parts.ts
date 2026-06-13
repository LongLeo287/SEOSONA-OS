// Mock tool part factories for all SDK tool renderers
// Each returns objects matching the `part` prop shape consumed by tool components

export function createBashParts() {
  return {
    completed: {
      type: "tool-Bash",
      toolCallId: "bash-1",
      state: "output-available",
      input: { command: "ls -la src/components/" },
      output: {
        stdout:
          "total 48\ndrwxr-xr-x  8 user  staff  256 Feb 20 10:30 .\n-rw-r--r--  1 user  staff  1234 Feb 20 10:30 input-bar.tsx\n-rw-r--r--  1 user  staff  2345 Feb 20 10:30 message-list.tsx\n-rw-r--r--  1 user  staff  987 Feb 20 10:30 user-message.tsx\n-rw-r--r--  1 user  staff  3210 Feb 20 10:30 streaming-markdown.tsx",
        stderr: "",
        exitCode: 0,
      },
    },
    pending: {
      type: "tool-Bash",
      toolCallId: "bash-2",
      state: "input-available",
      input: { command: "npm run build && npm run test" },
    },
    error: {
      type: "tool-Bash",
      toolCallId: "bash-3",
      state: "output-available",
      input: { command: "cat nonexistent-file.txt" },
      output: {
        stdout: "",
        stderr: "cat: nonexistent-file.txt: No such file or directory",
        exitCode: 1,
      },
    },
    streaming: {
      type: "tool-Bash",
      toolCallId: "bash-4",
      state: "input-streaming",
      input: {},
    },
  }
}

export function createEditParts() {
  return {
    completed: {
      type: "tool-Edit",
      toolCallId: "edit-1",
      state: "output-available",
      input: {
        file_path: "/project/sandbox/repo/src/components/button.tsx",
        old_string: 'return <button className="btn">{children}</button>',
        new_string:
          'return (\n  <button\n    className={cn("btn", variant, className)}\n    disabled={disabled}\n    {...props}\n  >\n    {children}\n  </button>\n)',
      },
      output: {
        structuredPatch: [
          {
            lines: [
              '-return <button className="btn">{children}</button>',
              "+return (",
              "+  <button",
              '+    className={cn("btn", variant, className)}',
              "+    disabled={disabled}",
              "+    {...props}",
              "+  >",
              "+    {children}",
              "+  </button>",
              "+)",
            ],
          },
        ],
      },
    },
    pending: {
      type: "tool-Edit",
      toolCallId: "edit-2",
      state: "input-available",
      input: {
        file_path: "/project/sandbox/repo/src/utils/format.ts",
        old_string: "",
        new_string: "",
      },
    },
    streaming: {
      type: "tool-Edit",
      toolCallId: "edit-3",
      state: "input-streaming",
      input: {
        file_path: "/project/sandbox/repo/src/components/card.tsx",
      },
    },
  }
}

export function createWriteParts() {
  return {
    completed: {
      type: "tool-Write",
      toolCallId: "write-1",
      state: "output-available",
      input: {
        file_path: "/project/sandbox/repo/src/components/avatar.tsx",
        content:
          'import React from "react"\n\ninterface AvatarProps {\n  src: string\n  alt: string\n  size?: number\n}\n\nexport function Avatar({ src, alt, size = 40 }: AvatarProps) {\n  return (\n    <img\n      src={src}\n      alt={alt}\n      width={size}\n      height={size}\n      className="rounded-full"\n    />\n  )\n}',
      },
      output: { content: "" },
    },
    pending: {
      type: "tool-Write",
      toolCallId: "write-2",
      state: "input-streaming",
      input: {
        file_path: "/project/sandbox/repo/src/hooks/use-debounce.ts",
      },
    },
  }
}

export function createSearchParts() {
  return {
    completed: {
      type: "tool-WebSearch",
      toolCallId: "search-1",
      state: "output-available",
      input: { query: "React server components best practices 2025" },
      output: {
        results: [
          { title: "Understanding React Server Components", url: "https://react.dev/blog/rsc-guide" },
          { title: "Server Components Patterns - Vercel", url: "https://vercel.com/blog/server-components" },
          { title: "RSC Best Practices - Kent C. Dodds", url: "https://kentcdodds.com/blog/rsc-best-practices" },
          { title: "Next.js App Router & Server Components", url: "https://nextjs.org/docs/app/building" },
        ],
      },
    },
    pending: {
      type: "tool-WebSearch",
      toolCallId: "search-2",
      state: "input-available",
      input: { query: "tailwind css v4 migration guide" },
    },
    error: {
      type: "tool-WebSearch",
      toolCallId: "search-3",
      state: "output-error",
      input: { query: "something" },
      output: { error: "Search failed" },
    },
  }
}

export function createTodoParts() {
  return {
    creation: {
      type: "tool-TodoWrite",
      toolCallId: "todo-1",
      state: "output-available",
      input: {
        todos: [
          { content: "Set up project structure", status: "completed" as const, activeForm: "Setting up project structure" },
          { content: "Implement authentication", status: "in_progress" as const, activeForm: "Implementing authentication" },
          { content: "Create API endpoints", status: "pending" as const },
          { content: "Write unit tests", status: "pending" as const },
          { content: "Deploy to staging", status: "pending" as const },
        ],
      },
      output: { oldTodos: [], newTodos: [] },
    },
    singleUpdate: {
      type: "tool-TodoWrite",
      toolCallId: "todo-2",
      state: "output-available",
      input: {
        todos: [
          { content: "Set up project structure", status: "completed" as const },
          { content: "Implement authentication", status: "completed" as const },
          { content: "Create API endpoints", status: "in_progress" as const, activeForm: "Creating API endpoints" },
          { content: "Write unit tests", status: "pending" as const },
        ],
      },
      output: {
        oldTodos: [
          { content: "Set up project structure", status: "completed" as const },
          { content: "Implement authentication", status: "in_progress" as const },
          { content: "Create API endpoints", status: "pending" as const },
          { content: "Write unit tests", status: "pending" as const },
        ],
        newTodos: [],
      },
    },
  }
}

export function createPlanParts() {
  return {
    inProgress: {
      type: "tool-PlanWrite",
      toolCallId: "plan-1",
      state: "output-available",
      input: {
        action: "create" as const,
        plan: {
          id: "plan-1",
          title: "Refactor Authentication Module",
          summary: "Migrate from session-based auth to JWT with refresh tokens",
          steps: [
            { id: "s1", title: "Audit current auth flow", description: "Review existing middleware and session management", files: ["src/middleware/auth.ts", "src/lib/session.ts"], estimatedComplexity: "low" as const, status: "completed" as const },
            { id: "s2", title: "Implement JWT generation", description: "Create token signing and verification utilities", files: ["src/lib/jwt.ts"], estimatedComplexity: "medium" as const, status: "in_progress" as const },
            { id: "s3", title: "Add refresh token rotation", files: ["src/lib/refresh-token.ts", "src/api/auth/refresh.ts"], estimatedComplexity: "high" as const, status: "pending" as const },
            { id: "s4", title: "Update middleware", description: "Replace session checks with JWT verification", files: ["src/middleware/auth.ts"], estimatedComplexity: "medium" as const, status: "pending" as const },
            { id: "s5", title: "Write tests", files: ["tests/auth.test.ts"], estimatedComplexity: "medium" as const, status: "pending" as const },
          ],
          status: "in_progress" as const,
        },
      },
      output: { success: true },
    },
    completed: {
      type: "tool-PlanWrite",
      toolCallId: "plan-2",
      state: "output-available",
      input: {
        action: "complete" as const,
        plan: {
          id: "plan-2",
          title: "Add Dark Mode Support",
          summary: "Implement CSS variable-based theming",
          steps: [
            { id: "s1", title: "Define color tokens", status: "completed" as const, estimatedComplexity: "low" as const },
            { id: "s2", title: "Create theme provider", status: "completed" as const, estimatedComplexity: "medium" as const },
            { id: "s3", title: "Update all components", status: "completed" as const, estimatedComplexity: "high" as const },
          ],
          status: "completed" as const,
        },
      },
      output: { success: true },
    },
  }
}

export function createTaskParts() {
  return {
    completed: {
      type: "tool-Task",
      toolCallId: "task-1",
      state: "output-available",
      input: {
        subagent_type: "Explore",
        description: "Search for authentication patterns in the codebase",
      },
      output: { result: "Found 3 authentication patterns" },
    },
    pending: {
      type: "tool-Task",
      toolCallId: "task-2",
      state: "input-available",
      input: {
        subagent_type: "Plan",
        description: "Design the database migration strategy",
      },
    },
  }
}

/** Nested tool parts for TaskTool expanded view */
export function createNestedToolParts() {
  return [
    {
      type: "tool-Read",
      toolCallId: "nested-read-1",
      state: "output-available",
      input: { file_path: "/project/sandbox/repo/src/middleware/auth.ts" },
      output: { content: "..." },
    },
    {
      type: "tool-Grep",
      toolCallId: "nested-grep-1",
      state: "output-available",
      input: { pattern: "authenticate", path: "/project/sandbox/repo/src" },
      output: { numFiles: 3 },
    },
    {
      type: "tool-Bash",
      toolCallId: "nested-bash-1",
      state: "output-available",
      input: { command: "grep -r 'session' src/ --include='*.ts' | wc -l" },
      output: { stdout: "17", stderr: "", exitCode: 0 },
    },
  ]
}

export function createMcpParts() {
  return {
    completed: {
      type: "tool-mcp__linear__list_issues",
      toolCallId: "mcp-1",
      state: "output-available",
      input: {
        query: "authentication bug",
        assignee: "me",
        state: "in_progress",
      },
      output: [
        {
          type: "text",
          text: JSON.stringify({
            issues: [
              { id: "LIN-123", title: "Fix OAuth token refresh", state: "In Progress", priority: 2 },
              { id: "LIN-124", title: "Session timeout handling", state: "In Progress", priority: 3 },
            ],
          }),
        },
      ],
    },
    pending: {
      type: "tool-mcp__google-workspace__search_gmail_messages",
      toolCallId: "mcp-2",
      state: "input-available",
      input: {
        query: "project update from:team@company.com",
        user_google_email: "user@example.com",
      },
    },
  }
}

export function createThinkingParts() {
  return {
    completed: {
      type: "tool-Thinking",
      toolCallId: "think-1",
      state: "output-available",
      input: {},
      output: {
        thinking:
          "Let me analyze this step by step. The user wants to refactor the authentication module. I should first understand the current implementation by reading the relevant files. The session-based auth uses express-session with Redis as the store. The migration to JWT will require:\n\n1. Creating a new JWT utility module\n2. Implementing refresh token rotation\n3. Updating all middleware to verify JWTs instead of sessions\n4. Ensuring backward compatibility during the transition period",
      },
    },
    pending: {
      type: "tool-Thinking",
      toolCallId: "think-2",
      state: "input-available",
      input: { thinking: "Analyzing the codebase structure to determine the best approach..." },
    },
  }
}

export function createGenericParts() {
  return {
    read: {
      type: "tool-Read",
      toolCallId: "read-1",
      state: "output-available",
      input: { file_path: "/project/sandbox/repo/src/components/button.tsx" },
      output: { content: "..." },
    },
    readPending: {
      type: "tool-Read",
      toolCallId: "read-2",
      state: "input-available",
      input: { file_path: "/project/sandbox/repo/src/lib/utils.ts" },
    },
    grep: {
      type: "tool-Grep",
      toolCallId: "grep-1",
      state: "output-available",
      input: { pattern: "useAuth", path: "/project/sandbox/repo/src" },
      output: { numFiles: 5 },
    },
    glob: {
      type: "tool-Glob",
      toolCallId: "glob-1",
      state: "output-available",
      input: { pattern: "**/*.test.ts" },
      output: { numFiles: 12 },
    },
    webFetch: {
      type: "tool-WebFetch",
      toolCallId: "fetch-1",
      state: "output-available",
      input: { url: "https://api.example.com/docs" },
      output: { content: "..." },
    },
  }
}
