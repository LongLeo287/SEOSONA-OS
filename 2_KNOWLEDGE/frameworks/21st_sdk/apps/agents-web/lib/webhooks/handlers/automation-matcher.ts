import { prisma } from "@/lib/prisma"
import type { FilterRule, TriggerType, TriggerConfig, Platform } from "@/server/api/routers/automations/router"

/**
 * Event data structure for automation matching (GitHub)
 */
export interface GitHubEventData {
  platform: "github"
  repository: string // "owner/repo"
  branch?: string
  branchName?: string // For branch_created: the created branch name
  tagName?: string // For branch_created: the created tag name
  author?: string
  mergedBy?: string
  pushedBy?: string
  commentedBy?: string // For issue_comment_created
  commentOn?: "issue" | "pr" // For issue_comment_created: what type of item was commented on
  labels?: string[]
  isDraft?: boolean
  isBot?: boolean // Is the author a bot (specifically 1code bot)
  refType?: "branch" | "tag"
  workflow?: string
}

/**
 * Event data structure for automation matching (Linear)
 */
export interface LinearEventData {
  platform: "linear"
  // Linear-specific fields
  linearProjectId?: string
  linearProjectName?: string
  linearTeamId?: string
  linearTeamName?: string
  linearCreatorId?: string
  linearCreatorName?: string
  linearAssigneeId?: string
  linearAssigneeName?: string
  linearLabelIds?: string[]
  linearLabelNames?: string[]
  linearStateId?: string
  linearStateName?: string
  linearPriority?: number // 0=none, 1=urgent, 2=high, 3=medium, 4=low
  isBot?: boolean
}

/**
 * Event data structure for automation matching (Discord)
 */
export interface DiscordEventData {
  platform: "discord"
  guildId: string
  channelId: string
  userId: string
  username: string
  prompt: string
  isBot?: boolean
}

/**
 * Combined event data type
 */
export type AutomationEventData = GitHubEventData | LinearEventData | DiscordEventData

/**
 * Matched automation with the specific trigger that matched
 */
export interface MatchedAutomation {
  automation: {
    id: string
    name: string
    agent_prompt: string | null
    target_repository: string | null
    add_to_inbox: boolean
    respond_to_trigger: boolean
    team_id: string
    created_by: string
  }
  trigger: TriggerConfig
}

/**
 * Find all enabled automations that match the given event
 */
export async function findMatchingAutomations(
  teamId: string,
  triggerType: TriggerType,
  eventData: AutomationEventData,
): Promise<MatchedAutomation[]> {
  const platform = eventData.platform

  console.log(`[AutomationMatcher DEBUG] Finding automations for team=${teamId}, triggerType=${triggerType}, platform=${platform}`)

  // Get all enabled automations for this team
  const automations = await prisma.automation.findMany({
    where: {
      team_id: teamId,
      is_enabled: true,
    },
    select: {
      id: true,
      name: true,
      agent_prompt: true,
      target_repository: true,
      add_to_inbox: true,
      respond_to_trigger: true,
      team_id: true,
      triggers: true,
      created_by: true,
    },
  })

  console.log(`[AutomationMatcher DEBUG] Found ${automations.length} enabled automations for team`)
  automations.forEach((a, i) => {
    console.log(`[AutomationMatcher DEBUG] Automation ${i}: name="${a.name}", triggers=${JSON.stringify(a.triggers)}`)
  })

  const matched: MatchedAutomation[] = []

  // For each automation, check if any trigger matches
  for (const automation of automations) {
    const triggers = (automation.triggers as TriggerConfig[]) || []

    for (const trigger of triggers) {
      // Check if platform matches (default to github for backwards compatibility)
      const triggerPlatform = trigger.platform || "github"
      console.log(`[AutomationMatcher DEBUG] Checking trigger: platform=${triggerPlatform} (want ${platform}), type=${trigger.trigger_type} (want ${triggerType})`)

      if (triggerPlatform !== platform) {
        console.log(`[AutomationMatcher DEBUG] -> Platform mismatch, skipping`)
        continue
      }

      // Check if trigger type matches
      if (trigger.trigger_type !== triggerType) {
        console.log(`[AutomationMatcher DEBUG] -> Trigger type mismatch, skipping`)
        continue
      }

      // Check if filters match
      const filters = trigger.filters || []
      console.log(`[AutomationMatcher DEBUG] -> Platform & type match! Checking ${filters.length} filters...`)

      if (filters.length === 0) {
        // No filters = matches everything (except bots by default)
        if (eventData.isBot) {
          console.log(`[AutomationMatcher DEBUG] -> No filters but event is from bot, skipping`)
          continue
        }
        console.log(`[AutomationMatcher DEBUG] -> No filters, MATCHED!`)
        matched.push({ automation, trigger })
      } else {
        const filtersMatch = evaluateFilters(filters, eventData)
        console.log(`[AutomationMatcher DEBUG] -> Filters evaluation result: ${filtersMatch}`)
        if (filtersMatch) {
          matched.push({ automation, trigger })
        }
      }
    }
  }

  console.log(`[AutomationMatcher DEBUG] Total matches: ${matched.length}`)
  return matched
}

/**
 * Evaluate filter rules against event data
 * Returns true if ALL filters match (AND logic)
 */
export function evaluateFilters(
  filters: FilterRule[],
  eventData: AutomationEventData,
): boolean {
  console.log(`[AutomationMatcher DEBUG] evaluateFilters: ${filters.length} filters, eventData.isBot=${eventData.isBot}`)

  // Check if bot filter is explicitly enabled
  const botFilter = filters.find((f) => f.type === "bot")
  const botFilterEnabled = botFilter?.value === true

  // If event is from bot and bot filter is not enabled, skip
  if (eventData.isBot && !botFilterEnabled) {
    console.log(`[AutomationMatcher DEBUG] -> Rejected: event from bot without bot filter enabled`)
    return false
  }

  for (const filter of filters) {
    try {
      const result = evaluateSingleFilter(filter, eventData)
      console.log(`[AutomationMatcher DEBUG] -> Filter ${filter.type} (${filter.operator}): ${JSON.stringify(filter.value)} => ${result}`)
      if (!result) {
        return false
      }
    } catch (error) {
      console.error(`[AutomationMatcher] Error evaluating filter ${filter.type}:`, error)
      return false
    }
  }
  return true
}

/**
 * Evaluate a single filter rule
 */
function evaluateSingleFilter(
  filter: FilterRule,
  eventData: AutomationEventData,
): boolean {
  const { type, operator, value } = filter

  switch (type) {
    // GitHub filters
    case "repository": {
      if (eventData.platform !== "github") return true
      const repo = eventData.repository
      return evaluateStringOperator(repo, operator, value as string | string[])
    }

    case "branch": {
      if (eventData.platform !== "github") return true
      const branch = eventData.branch
      if (!branch) return operator === "not_equals"
      return evaluateStringOperator(branch, operator, value as string | string[])
    }

    case "author": {
      if (eventData.platform !== "github") return true
      const author = eventData.author
      if (!author) return operator === "not_equals"
      return evaluateStringOperator(author, operator, value as string | string[])
    }

    case "merged_by": {
      if (eventData.platform !== "github") return true
      const mergedBy = eventData.mergedBy
      if (!mergedBy) return operator === "not_equals"
      return evaluateStringOperator(mergedBy, operator, value as string | string[])
    }

    case "pushed_by": {
      if (eventData.platform !== "github") return true
      const pushedBy = eventData.pushedBy
      if (!pushedBy) return operator === "not_equals"
      return evaluateStringOperator(pushedBy, operator, value as string | string[])
    }

    case "label": {
      if (eventData.platform !== "github") return true
      const labels = eventData.labels || []
      return evaluateArrayOperator(labels, operator, value as string | string[])
    }

    case "draft": {
      if (eventData.platform !== "github") return true
      const isDraft = eventData.isDraft ?? false
      // UI sends string values "is_draft" / "is_not_draft"
      if (value === "is_draft") return isDraft
      if (value === "is_not_draft") return !isDraft
      // Legacy boolean support
      const includeDrafts = value === true
      return includeDrafts || !isDraft
    }

    case "bot": {
      // Bot filter handling is done in evaluateFilters
      return true
    }

    case "ref_type": {
      if (eventData.platform !== "github") return true
      const refType = eventData.refType
      if (!refType) return operator === "not_equals"
      return evaluateStringOperator(refType, operator, value as string | string[])
    }

    case "workflow": {
      if (eventData.platform !== "github") return true
      const workflow = eventData.workflow
      if (!workflow) return operator === "not_equals"
      return evaluateStringOperator(workflow, operator, value as string | string[])
    }

    case "commented_by": {
      if (eventData.platform !== "github") return true
      const commentedBy = eventData.commentedBy
      if (!commentedBy) return operator === "not_equals"
      return evaluateStringOperator(commentedBy, operator, value as string | string[])
    }

    case "comment_on": {
      if (eventData.platform !== "github") return true
      const commentOn = eventData.commentOn
      if (!commentOn) return operator === "not_equals"
      return evaluateStringOperator(commentOn, operator, value as string | string[])
    }

    case "branch_names": {
      if (eventData.platform !== "github") return true
      const branchName = eventData.branchName
      if (!branchName) return operator === "not_equals"
      return evaluateStringOperator(branchName, operator, value as string | string[])
    }

    case "tag_names": {
      if (eventData.platform !== "github") return true
      const tagName = eventData.tagName
      if (!tagName) return operator === "not_equals"
      return evaluateStringOperator(tagName, operator, value as string | string[])
    }

    // Linear filters
    case "linear_project": {
      if (eventData.platform !== "linear") return true
      const projectId = eventData.linearProjectId
      if (!projectId) return operator === "not_equals"
      return evaluateStringOperator(projectId, operator, value as string | string[])
    }

    case "linear_team": {
      if (eventData.platform !== "linear") return true
      const teamId = eventData.linearTeamId
      if (!teamId) return operator === "not_equals"
      return evaluateStringOperator(teamId, operator, value as string | string[])
    }

    case "linear_creator": {
      if (eventData.platform !== "linear") return true
      const creatorId = eventData.linearCreatorId
      if (!creatorId) return operator === "not_equals"
      return evaluateStringOperator(creatorId, operator, value as string | string[])
    }

    case "linear_assignee": {
      if (eventData.platform !== "linear") return true
      const assigneeId = eventData.linearAssigneeId
      if (!assigneeId) return operator === "not_equals"
      return evaluateStringOperator(assigneeId, operator, value as string | string[])
    }

    case "linear_label": {
      if (eventData.platform !== "linear") return true
      const labelIds = eventData.linearLabelIds || []
      return evaluateArrayOperator(labelIds, operator, value as string | string[])
    }

    case "linear_state": {
      if (eventData.platform !== "linear") return true
      const stateId = eventData.linearStateId
      if (!stateId) return operator === "not_equals"
      return evaluateStringOperator(stateId, operator, value as string | string[])
    }

    case "linear_priority": {
      if (eventData.platform !== "linear") return true
      const priority = eventData.linearPriority
      if (priority === undefined) return operator === "not_equals"
      // Priority is stored as number, but filter value might be string
      const priorityStr = String(priority)
      return evaluateStringOperator(priorityStr, operator, value as string | string[])
    }

    // Discord filters
    case "discord_channel": {
      if (eventData.platform !== "discord") return true
      const channelId = eventData.channelId
      if (!channelId) return operator === "not_equals"
      return evaluateStringOperator(channelId, operator, value as string | string[])
    }

    case "discord_user": {
      if (eventData.platform !== "discord") return true
      const discordUser = eventData.username
      if (!discordUser) return operator === "not_equals"
      return evaluateStringOperator(discordUser, operator, value as string | string[])
    }

    default:
      return true
  }
}

/**
 * Evaluate string comparison operators
 */
function evaluateStringOperator(
  actual: string,
  operator: string,
  expected: string | string[],
): boolean {
  switch (operator) {
    case "equals":
      if (Array.isArray(expected)) {
        return expected.includes(actual)
      }
      return actual === expected

    case "not_equals":
      if (Array.isArray(expected)) {
        return !expected.includes(actual)
      }
      return actual !== expected

    case "matches":
      const pattern = Array.isArray(expected) ? expected[0] : expected
      if (!pattern) return false
      const regex = new RegExp(
        "^" + pattern.replace(/\*/g, ".*").replace(/\?/g, ".") + "$",
      )
      return regex.test(actual)

    case "includes":
      if (Array.isArray(expected)) {
        return expected.includes(actual)
      }
      return actual.includes(expected)

    default:
      return false
  }
}

/**
 * Evaluate array operators (for labels)
 */
function evaluateArrayOperator(
  actual: string[],
  operator: string,
  expected: string | string[],
): boolean {
  const expectedArray = Array.isArray(expected) ? expected : [expected]

  switch (operator) {
    case "includes":
      return expectedArray.some((e) => actual.includes(e))

    case "equals":
      return (
        actual.length === expectedArray.length &&
        expectedArray.every((e) => actual.includes(e))
      )

    case "not_equals":
      return !expectedArray.some((e) => actual.includes(e))

    default:
      return false
  }
}

/**
 * Log an automation execution
 */
export async function logAutomationExecution(
  automationId: string,
  externalId: string,
  externalUrl: string | null,
  status: "pending" | "success" | "failed" | "skipped",
  chatId?: string,
  errorMessage?: string,
): Promise<string> {
  const execution = await prisma.automationExecution.create({
    data: {
      automation_id: automationId,
      chat_id: chatId,
      external_id: externalId,
      external_url: externalUrl,
      status,
      error_message: errorMessage,
    },
  })

  if (status === "success") {
    await prisma.automation.update({
      where: { id: automationId },
      data: {
        execution_count: { increment: 1 },
        last_executed: new Date(),
      },
    })
  }

  return execution.id
}

/**
 * Update an existing automation execution status
 */
export async function updateAutomationExecution(
  executionId: string,
  status: "success" | "failed",
  chatId?: string,
  errorMessage?: string,
) {
  const execution = await prisma.automationExecution.update({
    where: { id: executionId },
    data: {
      status,
      ...(chatId && { chat_id: chatId }),
      ...(errorMessage && { error_message: errorMessage }),
    },
  })

  if (status === "success") {
    await prisma.automation.update({
      where: { id: execution.automation_id },
      data: {
        execution_count: { increment: 1 },
        last_executed: new Date(),
      },
    })
  }
}
