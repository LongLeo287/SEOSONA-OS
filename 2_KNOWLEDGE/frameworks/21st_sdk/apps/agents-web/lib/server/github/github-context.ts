/**
 * GitHub Context Fetching
 *
 * Fetches full issue/PR context including all comments for agent context.
 */

import { getInstallationAccessToken } from "./github-app-auth"

interface GitHubUser {
  login: string
  type: string
}

interface GitHubComment {
  id: number
  body: string
  user: GitHubUser
  created_at: string
}

interface GitHubIssue {
  number: number
  title: string
  body: string | null
  state: string
  user: GitHubUser
  created_at: string
  labels: Array<{ name: string }>
}

interface GitHubPullRequest extends GitHubIssue {
  head: { ref: string }
  base: { ref: string }
  additions: number
  deletions: number
  changed_files: number
}

interface GitHubCommit {
  sha: string
  commit: {
    message: string
    author: {
      name: string
      date: string
    }
  }
  author: {
    login: string
  } | null
}

interface IssueContext {
  type: "issue" | "pull_request"
  number: number
  title: string
  body: string | null
  author: string
  state: string
  labels: string[]
  createdAt: string
  // PR-specific
  headBranch?: string
  baseBranch?: string
  additions?: number
  deletions?: number
  changedFiles?: number
  commits?: Array<{
    sha: string
    message: string
    author: string
  }>
  // Comments
  comments: Array<{
    author: string
    body: string
    createdAt: string
    isBot: boolean
  }>
}

// Automation context types for different trigger types
export interface PushContext {
  type: "push"
  branch: string
  pusher: string
  commits: Array<{
    sha: string
    message: string
    author: string
    timestamp: string
    url: string
  }>
  compareUrl: string
  before: string
  after: string
  forced: boolean
}

export interface BranchContext {
  type: "branch" | "tag"
  ref: string
  refType: "branch" | "tag"
  creator: string
}

export interface WorkflowContext {
  type: "workflow"
  name: string
  conclusion: string
  branch: string
  sha: string
  runUrl: string
  runNumber: number
  runAttempt: number
}

export interface CommentContext {
  author: string
  body: string
  createdAt: string
  url: string
}

export type AutomationContext =
  | { triggerType: "pr_opened" | "pr_closed" | "pr_merged" | "pr_commits_pushed"; issue: IssueContext }
  | { triggerType: "issue_opened" | "issue_closed"; issue: IssueContext }
  | { triggerType: "issue_comment_created"; issue: IssueContext; triggerComment: CommentContext }
  | { triggerType: "push"; push: PushContext }
  | { triggerType: "branch_created"; branch: BranchContext }
  | { triggerType: "workflow_failed"; workflow: WorkflowContext }

export type TriggerType = AutomationContext["triggerType"]

/**
 * Fetch full issue/PR context including all comments
 */
export async function fetchIssueContext(
  installationId: number,
  owner: string,
  repo: string,
  issueNumber: number,
  isPullRequest: boolean
): Promise<IssueContext> {
  console.log(`📖 [Context] Fetching ${isPullRequest ? "PR" : "Issue"} #${issueNumber} from ${owner}/${repo}`)

  const token = await getInstallationAccessToken(installationId)
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "21st-dev-app",
  }

  // Fetch issue or PR details
  const detailsUrl = isPullRequest
    ? `https://api.github.com/repos/${owner}/${repo}/pulls/${issueNumber}`
    : `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`

  console.log(`📖 [Context] Fetching details from: ${detailsUrl}`)

  // Fetch details, comments, and commits (for PRs) in parallel
  const fetchPromises: Promise<Response>[] = [
    fetch(detailsUrl, { headers }),
    fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments?per_page=100`,
      { headers }
    ),
  ]

  // Also fetch commits for PRs
  if (isPullRequest) {
    fetchPromises.push(
      fetch(
        `https://api.github.com/repos/${owner}/${repo}/pulls/${issueNumber}/commits?per_page=100`,
        { headers }
      )
    )
  }

  const responses = await Promise.all(fetchPromises)
  const [detailsRes, commentsRes, commitsRes] = responses

  if (!detailsRes.ok) {
    console.error(`❌ [Context] Failed to fetch details: ${detailsRes.status}`)
    throw new Error(`Failed to fetch issue details: ${detailsRes.status}`)
  }

  const details: GitHubIssue | GitHubPullRequest = await detailsRes.json()
  const comments: GitHubComment[] = commentsRes.ok ? await commentsRes.json() : []
  const commits: GitHubCommit[] = commitsRes?.ok ? await commitsRes.json() : []

  console.log(`📖 [Context] Fetched issue: "${details.title}"`)
  console.log(`📖 [Context] Author: @${details.user.login}, State: ${details.state}`)
  console.log(`📖 [Context] Body length: ${details.body?.length || 0} chars`)
  console.log(`📖 [Context] Comments: ${comments.length}`)

  const context: IssueContext = {
    type: isPullRequest ? "pull_request" : "issue",
    number: details.number,
    title: details.title,
    body: details.body,
    author: details.user.login,
    state: details.state,
    labels: details.labels.map((l) => l.name),
    createdAt: details.created_at,
    comments: comments.map((c) => ({
      author: c.user.login,
      body: c.body,
      createdAt: c.created_at,
      isBot: c.user.type === "Bot",
    })),
  }

  // Add PR-specific fields
  if (isPullRequest) {
    const pr = details as GitHubPullRequest
    context.headBranch = pr.head.ref
    context.baseBranch = pr.base.ref
    context.additions = pr.additions
    context.deletions = pr.deletions
    context.changedFiles = pr.changed_files
    context.commits = commits.map((c) => ({
      sha: c.sha.substring(0, 7),
      message: c.commit.message.split("\n")[0], // First line only
      author: c.author?.login || c.commit.author.name,
    }))
    console.log(`📖 [Context] PR: ${pr.head.ref} → ${pr.base.ref}, +${pr.additions}/-${pr.deletions}, ${pr.changed_files} files`)
    console.log(`📖 [Context] Commits: ${commits.length}`)
  }

  // Log each comment
  for (const c of context.comments) {
    console.log(`📖 [Context] Comment by @${c.author}${c.isBot ? " (bot)" : ""}: "${c.body.substring(0, 50)}..."`)
  }

  return context
}

/**
 * Format issue context as a readable prompt for the agent
 */
export function formatContextForAgent(
  context: IssueContext,
  triggerComment: string,
  triggerAuthor: string
): string {
  console.log(`📝 [Context] Formatting context for agent...`)
  console.log(`📝 [Context] Trigger: @${triggerAuthor} said "${triggerComment.substring(0, 100)}..."`)

  const lines: string[] = []

  // Header
  const typeLabel = context.type === "pull_request" ? "Pull Request" : "Issue"
  lines.push(`## GitHub ${typeLabel} #${context.number}`)
  lines.push("")

  // Title and metadata
  lines.push(`**Title:** ${context.title}`)
  lines.push(`**Author:** @${context.author}`)
  lines.push(`**State:** ${context.state}`)
  if (context.labels.length > 0) {
    lines.push(`**Labels:** ${context.labels.join(", ")}`)
  }

  // PR-specific info
  if (context.type === "pull_request") {
    lines.push(`**Branch:** ${context.headBranch} → ${context.baseBranch}`)
    lines.push(
      `**Changes:** +${context.additions} -${context.deletions} across ${context.changedFiles} files`
    )
  }

  lines.push("")

  // Original description
  lines.push("### Description")
  lines.push("")
  if (context.body) {
    lines.push(context.body)
  } else {
    lines.push("_(No description provided)_")
  }
  lines.push("")

  // Commits (for PRs)
  if (context.type === "pull_request" && context.commits && context.commits.length > 0) {
    lines.push("### Commits")
    lines.push("")
    for (const commit of context.commits) {
      lines.push(`- \`${commit.sha}\` ${commit.message} (@${commit.author})`)
    }
    lines.push("")
  }

  // Comments thread (excluding bot comments and the trigger comment)
  const relevantComments = context.comments.filter(
    (c) => !c.isBot && c.body !== triggerComment
  )

  console.log(`📝 [Context] Including ${relevantComments.length} relevant comments (filtered ${context.comments.length - relevantComments.length} bot/trigger comments)`)

  if (relevantComments.length > 0) {
    lines.push("### Discussion")
    lines.push("")

    for (const comment of relevantComments) {
      const date = new Date(comment.createdAt).toLocaleDateString()
      lines.push(`**@${comment.author}** (${date}):`)
      lines.push(comment.body)
      lines.push("")
    }
  }

  // Instructions for the agent
  lines.push("---")
  lines.push("")
  lines.push("### Instructions for agent")
  lines.push("")
  if (context.type === "pull_request") {
    lines.push(`**For code-related tasks** (reviewing, fixing, understanding implementation):`)
    lines.push(`Check the actual code, not just the description - checkout the branch and read the diff.`)
    lines.push(`- \`git checkout ${context.headBranch}\``)
    lines.push(`- \`git diff ${context.baseBranch}...${context.headBranch}\``)
  } else {
    lines.push(`**For code-related tasks** (fixing bugs, implementing features, understanding code):`)
    lines.push(`Explore the codebase rather than relying solely on the description.`)
  }
  lines.push("")
  lines.push("For general questions or conversation, use your judgment.")
  lines.push("")

  // The actual request
  lines.push("---")
  lines.push("")
  lines.push("### Your Task")
  lines.push("")
  lines.push(`**@${triggerAuthor}** requested:`)
  lines.push("")
  lines.push(triggerComment)

  const result = lines.join("\n")

  console.log(`📝 [Context] Final prompt length: ${result.length} chars`)
  console.log(`📝 [Context] ========== FULL PROMPT START ==========`)
  console.log(result)
  console.log(`📝 [Context] ========== FULL PROMPT END ==========`)

  return result
}

/**
 * Build rich context for automation triggers
 */
export async function buildAutomationContext(
  triggerType: TriggerType,
  installationId: number,
  owner: string,
  repo: string,
  options: {
    number?: number
    isPR?: boolean
    commentBody?: string
    commentAuthor?: string
    commentUrl?: string
    commentCreatedAt?: string
  },
  webhookPayload: any
): Promise<AutomationContext> {
  console.log(`📖 [AutomationContext] Building context for ${triggerType}`)

  // PR/Issue triggers - reuse fetchIssueContext
  if (
    triggerType === "pr_opened" ||
    triggerType === "pr_closed" ||
    triggerType === "pr_merged" ||
    triggerType === "pr_commits_pushed"
  ) {
    const issue = await fetchIssueContext(installationId, owner, repo, options.number!, true)
    return { triggerType, issue }
  }

  if (triggerType === "issue_opened" || triggerType === "issue_closed") {
    const issue = await fetchIssueContext(installationId, owner, repo, options.number!, false)
    return { triggerType, issue }
  }

  if (triggerType === "issue_comment_created") {
    const issue = await fetchIssueContext(installationId, owner, repo, options.number!, options.isPR ?? false)
    const triggerComment: CommentContext = {
      author: options.commentAuthor || "unknown",
      body: options.commentBody || "",
      createdAt: options.commentCreatedAt || new Date().toISOString(),
      url: options.commentUrl || "",
    }
    return { triggerType, issue, triggerComment }
  }

  // Push trigger - build from webhook payload
  if (triggerType === "push") {
    const payload = webhookPayload as {
      ref: string
      before: string
      after: string
      forced: boolean
      compare: string
      pusher: { name: string }
      commits: Array<{
        id: string
        message: string
        timestamp: string
        url: string
        author: { name: string; username?: string }
      }>
    }

    const push: PushContext = {
      type: "push",
      branch: payload.ref?.replace("refs/heads/", "") || "unknown",
      pusher: payload.pusher?.name || "unknown",
      commits: (payload.commits || []).map((c) => ({
        sha: c.id.substring(0, 7),
        message: c.message.split("\n")[0], // First line only
        author: c.author.username || c.author.name,
        timestamp: c.timestamp,
        url: c.url,
      })),
      compareUrl: payload.compare || "",
      before: payload.before?.substring(0, 7) || "",
      after: payload.after?.substring(0, 7) || "",
      forced: payload.forced || false,
    }
    return { triggerType, push }
  }

  // Branch/tag created - build from webhook payload
  if (triggerType === "branch_created") {
    const payload = webhookPayload as {
      ref: string
      ref_type: "branch" | "tag"
      sender: { login: string }
    }

    const branch: BranchContext = {
      type: payload.ref_type === "tag" ? "tag" : "branch",
      ref: payload.ref,
      refType: payload.ref_type,
      creator: payload.sender?.login || "unknown",
    }
    return { triggerType, branch }
  }

  // Workflow failed - build from webhook payload
  if (triggerType === "workflow_failed") {
    const payload = webhookPayload as {
      workflow_run: {
        name: string
        conclusion: string
        head_branch: string
        head_sha: string
        html_url: string
        run_number: number
        run_attempt: number
      }
    }

    const workflow: WorkflowContext = {
      type: "workflow",
      name: payload.workflow_run.name,
      conclusion: payload.workflow_run.conclusion || "failure",
      branch: payload.workflow_run.head_branch,
      sha: payload.workflow_run.head_sha?.substring(0, 7) || "",
      runUrl: payload.workflow_run.html_url,
      runNumber: payload.workflow_run.run_number,
      runAttempt: payload.workflow_run.run_attempt,
    }
    return { triggerType, workflow }
  }

  // Fallback - should never reach here
  throw new Error(`Unknown trigger type: ${triggerType}`)
}

/**
 * Format automation context into a rich prompt for the agent
 */
export function formatAutomationPrompt(
  automationPrompt: string,
  context: AutomationContext,
  repoFullName: string
): string {
  console.log(`📝 [AutomationPrompt] Formatting prompt for ${context.triggerType}`)

  const lines: string[] = []

  // Agent task section
  lines.push("## Your Task")
  lines.push("")
  lines.push(automationPrompt)
  lines.push("")
  lines.push("---")
  lines.push("")

  // Context section based on trigger type
  if ("issue" in context) {
    const issue = context.issue
    const typeLabel = issue.type === "pull_request" ? "Pull Request" : "Issue"
    lines.push(`## GitHub ${typeLabel} #${issue.number}`)
    lines.push("")
    lines.push(`**Title:** ${issue.title}`)
    lines.push(`**Author:** @${issue.author}`)

    if (issue.type === "pull_request") {
      lines.push(`**Branch:** ${issue.headBranch} → ${issue.baseBranch}`)
      lines.push(`**Changes:** +${issue.additions} -${issue.deletions} across ${issue.changedFiles} files`)
    }

    if (issue.labels.length > 0) {
      lines.push(`**Labels:** ${issue.labels.join(", ")}`)
    }
    lines.push(`**State:** ${issue.state}`)
    lines.push("")

    // Description
    lines.push("### Description")
    lines.push("")
    if (issue.body) {
      lines.push(issue.body)
    } else {
      lines.push("_(No description provided)_")
    }
    lines.push("")

    // Commits for PRs
    if (issue.type === "pull_request" && issue.commits && issue.commits.length > 0) {
      lines.push("### Commits")
      lines.push("")
      for (const commit of issue.commits) {
        lines.push(`- \`${commit.sha}\` ${commit.message} (@${commit.author})`)
      }
      lines.push("")
    }

    // Comments/Discussion (filter bot comments and trigger comment to avoid duplication)
    const triggerBody = context.triggerType === "issue_comment_created" && "triggerComment" in context
      ? context.triggerComment.body
      : null
    const humanComments = issue.comments.filter((c) => !c.isBot && c.body !== triggerBody)

    if (humanComments.length > 0) {
      lines.push("### Discussion")
      lines.push("")
      for (const comment of humanComments) {
        const date = new Date(comment.createdAt).toLocaleDateString()
        lines.push(`**@${comment.author}** (${date}):`)
        lines.push(comment.body)
        lines.push("")
      }
    }

    // Trigger comment for issue_comment_created (shown separately)
    if (context.triggerType === "issue_comment_created" && "triggerComment" in context) {
      const tc = context.triggerComment
      lines.push("### Trigger Comment")
      lines.push("")
      lines.push(`**@${tc.author}** wrote:`)
      lines.push(tc.body)
      lines.push("")
    }
  } else if ("push" in context) {
    const push = context.push
    lines.push(`## GitHub Push to \`${push.branch}\``)
    lines.push("")
    lines.push(`**Pushed by:** @${push.pusher}`)
    lines.push(`**Changes:** ${push.before}...${push.after}${push.forced ? " (force push)" : ""}`)
    if (push.compareUrl) {
      lines.push(`**Compare:** ${push.compareUrl}`)
    }
    lines.push("")

    if (push.commits.length > 0) {
      lines.push("### Commits")
      lines.push("")
      for (const commit of push.commits) {
        lines.push(`- \`${commit.sha}\` ${commit.message} (@${commit.author})`)
      }
      lines.push("")
    }
  } else if ("branch" in context) {
    const branch = context.branch
    const typeLabel = branch.refType === "tag" ? "Tag" : "Branch"
    lines.push(`## GitHub ${typeLabel} Created: \`${branch.ref}\``)
    lines.push("")
    lines.push(`**Created by:** @${branch.creator}`)
    lines.push("")
  } else if ("workflow" in context) {
    const workflow = context.workflow
    lines.push(`## GitHub Workflow Failed: ${workflow.name}`)
    lines.push("")
    lines.push(`**Branch:** ${workflow.branch}`)
    lines.push(`**Commit:** ${workflow.sha}`)
    lines.push(`**Run:** #${workflow.runNumber} (attempt ${workflow.runAttempt})`)
    lines.push(`**Details:** ${workflow.runUrl}`)
    lines.push("")
  }

  const result = lines.join("\n")
  console.log(`📝 [AutomationPrompt] Final prompt length: ${result.length} chars`)

  return result
}
