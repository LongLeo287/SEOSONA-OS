import { agent } from "@21st-sdk/agent"

export default agent({
  model: "claude-sonnet-4-6",
  systemPrompt:
    "You are a helpful assistant. Respond clearly and concisely to the user's questions.",
  maxTurns: 20,
})
