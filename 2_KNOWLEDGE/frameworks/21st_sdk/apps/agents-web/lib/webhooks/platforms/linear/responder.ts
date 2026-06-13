import { linearMutation, linearQuery } from "@/lib/server/linear/linear-api-client"

interface CommentCreateResult {
  commentCreate: {
    success: boolean
    comment: { id: string }
  }
}

interface ReactionCreateResult {
  reactionCreate: {
    success: boolean
  }
}

interface CommentUpdateResult {
  commentUpdate: {
    success: boolean
  }
}

interface IssueUpdateResult {
  issueUpdate: {
    success: boolean
  }
}

export async function addLinearComment(
  teamId: string,
  issueId: string,
  body: string,
  parentId?: string
): Promise<{ commentId: string } | void> {
  console.log(`[Linear Responder] Posting comment to issue ${issueId}`)

  const input: { issueId: string; body: string; parentId?: string } = { issueId, body }
  if (parentId) {
    input.parentId = parentId
  }

  try {
    const result = await linearMutation<CommentCreateResult>(
      teamId,
      `mutation AddComment($input: CommentCreateInput!) {
        commentCreate(input: $input) {
          success
          comment { id }
        }
      }`,
      { input }
    )

    const commentId = result.commentCreate?.comment?.id
    console.log(`[Linear Responder] Comment created: ${commentId}`)
    return { commentId }
  } catch (error) {
    console.error(`[Linear Responder] Failed to add comment:`, error)
    throw error
  }
}

/**
 * Add emoji reaction to a comment
 */
export async function addLinearReaction(
  teamId: string,
  commentId: string,
  emoji: string = "👍"
): Promise<void> {
  try {
    await linearMutation<ReactionCreateResult>(
      teamId,
      `mutation AddReaction($input: ReactionCreateInput!) {
        reactionCreate(input: $input) {
          success
        }
      }`,
      { input: { emoji, commentId } }
    )
    console.log(`[Linear Responder] Reaction added: ${emoji}`)
  } catch (error) {
    console.error(`[Linear Responder] Failed to add reaction:`, error)
  }
}

/**
 * Update an existing Linear comment
 */
export async function updateLinearComment(
  teamId: string,
  commentId: string,
  body: string
): Promise<void> {
  try {
    await linearMutation<CommentUpdateResult>(
      teamId,
      `mutation UpdateComment($id: String!, $input: CommentUpdateInput!) {
        commentUpdate(id: $id, input: $input) {
          success
        }
      }`,
      { id: commentId, input: { body } }
    )
    console.log(`[Linear Responder] Comment updated: ${commentId}`)
  } catch (error) {
    console.error(`[Linear Responder] Failed to update comment:`, error)
  }
}

export async function updateLinearIssueState(
  teamId: string,
  issueId: string,
  stateId: string
): Promise<void> {
  await linearMutation<IssueUpdateResult>(
    teamId,
    `mutation UpdateIssue($id: String!, $input: IssueUpdateInput!) {
      issueUpdate(id: $id, input: $input) {
        success
      }
    }`,
    { id: issueId, input: { stateId } }
  )
}
