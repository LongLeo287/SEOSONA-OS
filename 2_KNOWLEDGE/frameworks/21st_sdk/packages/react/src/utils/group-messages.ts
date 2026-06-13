import type { UIMessage } from "ai"

export interface MessageGroup {
  userMsg: UIMessage
  assistantMsgs: UIMessage[]
}

/** Group messages into conversation turns: [user, ...assistant] pairs */
export function groupMessages(messages: UIMessage[]): MessageGroup[] {
  const groups: MessageGroup[] = []
  let currentGroup: MessageGroup | null = null

  for (const msg of messages) {
    if (msg.role === "user") {
      if (currentGroup) {
        groups.push(currentGroup)
      }
      currentGroup = { userMsg: msg, assistantMsgs: [] }
    } else if (currentGroup) {
      currentGroup.assistantMsgs.push(msg)
    }
  }

  if (currentGroup) {
    groups.push(currentGroup)
  }

  return groups
}
