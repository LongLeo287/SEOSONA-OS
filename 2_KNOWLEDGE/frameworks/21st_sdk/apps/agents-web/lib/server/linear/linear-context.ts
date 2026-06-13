import { linearQuery } from "./linear-api-client"

export interface LinearIssueContext {
  id: string
  identifier: string // e.g., "ENG-123"
  title: string
  description: string | null
  url: string
  state: { id: string; name: string }
  assignee: { id: string; name: string; email: string } | null
  labels: Array<{ id: string; name: string }>
  comments: Array<{
    id: string
    body: string
    user: { id: string; name: string }
    createdAt: string
  }>
}

interface LinearIssueQueryResult {
  issue: {
    id: string
    identifier: string
    title: string
    description: string | null
    url: string
    state: { id: string; name: string }
    assignee: { id: string; name: string; email: string } | null
    labels: { nodes: Array<{ id: string; name: string }> }
    comments: {
      nodes: Array<{
        id: string
        body: string
        user: { id: string; name: string; email: string } | null
        createdAt: string
      }>
    }
  }
}

/**
 * Fetch full issue context from Linear API including comments
 * Uses centralized Linear API client with automatic token refresh
 */
export async function fetchLinearIssueContext(
  teamId: string,
  issueId: string
): Promise<LinearIssueContext> {
  const query = `
    query GetIssueWithComments($id: String!) {
      issue(id: $id) {
        id
        identifier
        title
        description
        url
        state { id name }
        assignee { id name email }
        labels { nodes { id name } }
        comments(first: 50, orderBy: createdAt) {
          nodes {
            id
            body
            user { id name email }
            createdAt
          }
        }
      }
    }
  `

  const data = await linearQuery<LinearIssueQueryResult>(teamId, query, { id: issueId })

  if (!data?.issue) {
    throw new Error("Failed to fetch Linear issue")
  }

  const issue = data.issue

  return {
    id: issue.id,
    identifier: issue.identifier,
    title: issue.title,
    description: issue.description,
    url: issue.url,
    state: issue.state,
    assignee: issue.assignee,
    labels: issue.labels.nodes,
    comments: issue.comments.nodes.map((c) => ({
      id: c.id,
      body: c.body,
      user: c.user
        ? { id: c.user.id, name: c.user.name }
        : { id: "unknown", name: "Unknown" },
      createdAt: c.createdAt,
    })),
  }
}

/**
 * Format Linear issue context as a prompt for the agent
 * @param context - Linear issue context
 * @param userInstruction - Optional instruction from user's @1code comment
 */
export function formatLinearContextForAgent(
  context: LinearIssueContext,
  userInstruction?: string
): string {
  let prompt = ""

  // If user gave specific instruction, make it the PRIMARY task
  if (userInstruction) {
    prompt += `## Your Task\n\n`
    prompt += `> ${userInstruction}\n\n`
    prompt += `Complete this task using the Linear issue context below.\n\n`
    prompt += `---\n\n`
  }

  // Issue context
  prompt += `# Linear Issue: ${context.identifier}\n\n`
  prompt += `**Title:** ${context.title}\n\n`

  if (context.description) {
    prompt += `**Description:**\n${context.description}\n\n`
  }

  if (context.labels.length > 0) {
    prompt += `**Labels:** ${context.labels.map((l) => l.name).join(", ")}\n\n`
  }

  if (context.comments.length > 0) {
    prompt += `## Comments\n\n`
    for (const comment of context.comments) {
      prompt += `**${comment.user.name}** (${new Date(comment.createdAt).toLocaleDateString()}):\n`
      prompt += `${comment.body}\n\n`
    }
  }

  // If no user instruction, provide generic guidance
  if (!userInstruction) {
    prompt += `---\n\n`
    prompt += `**Your task:** Analyze this Linear issue and determine the appropriate action:\n\n`
    prompt += `1. **If it's a code change request** (bug fix, feature, refactor) → Implement the changes and create a pull request\n`
    prompt += `2. **If it's a question about the codebase** (architecture, how something works, where to find something) → Research the repository and provide a detailed answer\n`
    prompt += `3. **If it's a data/information request** (list all endpoints, find dependencies, analyze code quality) → Gather the requested information and summarize it\n\n`
    prompt += `Choose the appropriate action based on the issue content.`
  }

  prompt += `\n\nDo NOT post any comments to Linear - the system will handle notifications automatically.`

  return prompt
}

/**
 * Format Linear issue context for automation prompts (pure - no opinions)
 * User's instruction is the main priority, context is supplementary
 */
export function formatLinearAutomationPrompt(
  context: LinearIssueContext,
  automationPrompt: string
): string {
  const lines: string[] = []

  // User's instruction is PRIMARY
  lines.push("## Your Task")
  lines.push("")
  lines.push(automationPrompt)
  lines.push("")
  lines.push("---")
  lines.push("")

  // Issue context
  lines.push(`## Linear Issue: ${context.identifier}`)
  lines.push("")
  lines.push(`**Title:** ${context.title}`)

  if (context.state) {
    lines.push(`**State:** ${context.state.name}`)
  }

  if (context.assignee) {
    lines.push(`**Assignee:** ${context.assignee.name}`)
  }

  if (context.labels.length > 0) {
    lines.push(`**Labels:** ${context.labels.map((l) => l.name).join(", ")}`)
  }

  lines.push("")

  if (context.description) {
    lines.push("### Description")
    lines.push("")
    lines.push(context.description)
    lines.push("")
  }

  if (context.comments.length > 0) {
    lines.push("### Comments")
    lines.push("")
    for (const comment of context.comments) {
      const date = new Date(comment.createdAt).toLocaleDateString()
      lines.push(`**${comment.user.name}** (${date}):`)
      lines.push(comment.body)
      lines.push("")
    }
  }

  lines.push("")
  lines.push("Do NOT post any comments to Linear - the system will handle notifications automatically.")

  return lines.join("\n")
}
