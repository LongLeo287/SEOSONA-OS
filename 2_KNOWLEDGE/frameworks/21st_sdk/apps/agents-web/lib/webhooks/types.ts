export type Platform = "linear" | "github" | "slack" | "discord"

export type TriggerType =
  | "issue_assigned"
  | "issue_mentioned"
  | "comment_added"
  | "pr_review_requested"
  | "slash_command"

export interface NormalizedEvent {
  platform: Platform
  teamId: string
  triggerType: TriggerType
  triggeredBy: {
    id: string
    name: string
    email?: string
  }
  externalId: string
  externalUrl: string
  title: string
  description: string
  repository?: {
    owner: string
    name: string
    defaultBranch: string
  }
  // Discord-specific data
  discord?: {
    guildId: string
    channelId: string
  }
  raw: unknown
}

// Linear-specific webhook types
export interface LinearWebhookPayload {
  action: "create" | "update" | "remove"
  type: "Issue" | "Comment" | "Project" | "Cycle"
  data: LinearIssueData | LinearCommentData
  url: string
  createdAt: string
  organizationId: string
  webhookTimestamp: number
  webhookId: string
  // For update actions - contains previous values of changed fields
  updatedFrom?: Record<string, unknown>
}

export interface LinearIssueData {
  id: string
  identifier: string
  title: string
  description?: string
  url: string
  state: {
    id: string
    name: string
    type: string
  }
  assignee?: {
    id: string
    name: string
    email: string
  }
  creator: {
    id: string
    name: string
    email: string
  }
  team: {
    id: string
    key: string
    name: string
  }
  labels?: Array<{
    id: string
    name: string
  }>
  project?: {
    id: string
    name: string
  }
  priority?: number // 0=none, 1=urgent, 2=high, 3=medium, 4=low
}

export interface LinearCommentData {
  id: string
  body: string
  parentId?: string // Parent comment ID if this is a threaded reply
  issue: {
    id: string
    identifier: string
    title: string
    url?: string
  }
  user: {
    id: string
    name: string
    email: string
  }
}
