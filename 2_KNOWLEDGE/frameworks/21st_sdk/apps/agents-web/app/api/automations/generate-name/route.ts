import { generateText } from "ai"
import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { getRestAuth } from "@/lib/rest-auth"

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
  headers: {
    "HTTP-Referer": "https://21st.dev",
    "X-Title": "21st.dev",
  },
})

// Clean and normalize the generated name
function cleanGeneratedName(name: string): string {
  let cleaned = name.trim()

  // Remove common prefixes (case-insensitive)
  cleaned = cleaned.replace(/^(automation\s+name|name|title):\s*/i, "")

  // Remove quotation marks (both single and double) - handle nested quotes
  while (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1).trim()
  }

  // Trim again after removing prefixes/quotes
  cleaned = cleaned.trim()

  // Apply sentence case: only first word capitalized, rest lowercase
  if (cleaned.length > 0) {
    const words = cleaned.split(/\s+/).filter((word) => word.length > 0)
    const normalizedWords = words.map((word, index) => {
      if (index === 0) {
        // First word: capitalize first letter, lowercase the rest
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      } else {
        // Other words: all lowercase
        return word.toLowerCase()
      }
    })
    cleaned = normalizedWords.join(" ")
  }

  return cleaned
}

interface TriggerInfo {
  platform: "github" | "linear"
  trigger_type: string
  filters?: Array<{ type: string; value: unknown }>
}

// Map trigger types to human-readable descriptions
function getTriggerDescription(trigger: TriggerInfo): string {
  const triggerLabels: Record<string, string> = {
    // GitHub
    pr_opened: "PR opened",
    pr_updated: "PR updated",
    issue_opened: "issue opened",
    issue_comment: "issue comment",
    push: "push",
    workflow_failed: "workflow failed",
    // Linear
    linear_issue_created: "Linear issue created",
    linear_issue_updated: "Linear issue updated",
    linear_comment_added: "Linear comment added",
  }

  const label = triggerLabels[trigger.trigger_type] || trigger.trigger_type

  // Add scope info if available
  const repoFilter = trigger.filters?.find((f) => f.type === "repository")
  const teamFilter = trigger.filters?.find((f) => f.type === "linear_team")

  if (repoFilter && Array.isArray(repoFilter.value) && repoFilter.value.length === 1) {
    const repoName = (repoFilter.value[0] as string).split("/").pop()
    return `${label} in ${repoName}`
  }

  if (teamFilter && Array.isArray(teamFilter.value) && teamFilter.value.length === 1) {
    return `${label} in team`
  }

  return label
}

export async function POST(req: Request) {
  const { userId } = await getRestAuth(req)
  if (!userId) {
    return new Response("Unauthorized", { status: 401 })
  }

  try {
    const body = await req.json()
    const { triggers, instructions } = body as {
      triggers: TriggerInfo[]
      instructions?: string
    }

    if (!triggers || !Array.isArray(triggers) || triggers.length === 0) {
      return new Response("Invalid request: triggers are required", {
        status: 400,
      })
    }

    // Build context for the AI
    const triggerDescriptions = triggers.map(getTriggerDescription)
    const triggerContext = triggerDescriptions.join(", ")

    const contextParts: string[] = []
    contextParts.push(`Triggers: ${triggerContext}`)

    if (instructions && instructions.trim()) {
      // Truncate instructions if too long
      const truncatedInstructions =
        instructions.length > 500 ? instructions.substring(0, 500) + "..." : instructions
      contextParts.push(`Instructions: ${truncatedInstructions}`)
    }

    const context = contextParts.join("\n")

    const result = await generateText({
      model: openrouter("anthropic/claude-haiku-4.5"),
      messages: [
        {
          role: "system",
          content: `You are an expert at creating concise, descriptive names for workflow automations. Your task is to analyze the automation's triggers and instructions to generate a short, memorable name.

## Your Task
Generate a brief, descriptive name (2-5 words) for a workflow automation based on its configuration. The name should help users quickly identify what the automation does.

## Formatting Rules
- Length: 2-5 words maximum (prefer shorter when possible)
- Case: Use sentence case - only the first word starts with a capital letter
- Output: Return ONLY the name text itself, nothing else
- No prefixes, quotes, or punctuation at the end

## Content Guidelines
- Be specific: Focus on what the automation accomplishes
- Action-oriented: Use verbs when appropriate (e.g., "Review", "Fix", "Notify")
- Avoid filler words: Skip "automation", "workflow", "bot", "agent"
- Combine trigger and purpose: The name should reflect both when it runs and what it does

## Examples
- Triggers: "PR opened", Instructions: "Review the code and suggest improvements" → "Code review"
- Triggers: "issue opened", Instructions: "Triage issues and add labels" → "Issue triage"
- Triggers: "Linear issue created", Instructions: "Implement the feature described" → "Feature implementation"
- Triggers: "workflow failed", Instructions: "Analyze the failure and suggest fixes" → "Build failure analysis"
- Triggers: "PR opened in frontend-app", Instructions: "" → "Frontend PR review"
- Triggers: "push", Instructions: "Run security scan and report vulnerabilities" → "Security scan"

Return only the name text.`,
        },
        {
          role: "user",
          content: context,
        },
      ],
      temperature: 0.3,
    })

    const cleanedName = cleanGeneratedName(result.text)

    // Fallback if the AI response is too long or empty
    const finalName =
      cleanedName && cleanedName.length <= 50
        ? cleanedName
        : `${triggers[0].platform === "github" ? "GitHub" : "Linear"} automation`

    return Response.json({ name: finalName })
  } catch (error) {
    console.error("Error generating automation name:", error)
    return Response.json({ name: "New automation" })
  }
}
