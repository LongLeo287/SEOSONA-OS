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

// Clean the generated commit message
function cleanCommitMessage(message: string): string {
  let cleaned = message.trim()

  // Remove markdown code blocks if present
  cleaned = cleaned.replace(/^```[a-z]*\n?/i, "").replace(/\n?```$/i, "")

  // Remove quotation marks
  while (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1).trim()
  }

  // Ensure it starts with a valid conventional commit prefix
  const validPrefixes = [
    "feat:",
    "fix:",
    "chore:",
    "docs:",
    "style:",
    "refactor:",
    "perf:",
    "test:",
    "build:",
    "ci:",
  ]

  const hasValidPrefix = validPrefixes.some((prefix) =>
    cleaned.toLowerCase().startsWith(prefix)
  )

  if (!hasValidPrefix) {
    // If no valid prefix, add "chore:" as default
    cleaned = `chore: ${cleaned}`
  }

  // Ensure first letter after prefix is lowercase
  const colonIndex = cleaned.indexOf(":")
  if (colonIndex > 0 && colonIndex < cleaned.length - 2) {
    const prefix = cleaned.slice(0, colonIndex + 1).toLowerCase()
    const rest = cleaned.slice(colonIndex + 1).trim()
    if (rest.length > 0) {
      cleaned = `${prefix} ${rest.charAt(0).toLowerCase()}${rest.slice(1)}`
    }
  }

  return cleaned.trim()
}

// Fallback message generation
function getFallbackMessage(
  fileCount: number,
  additions: number,
  deletions: number
): string {
  if (additions > 0 && deletions === 0) {
    return `feat: add ${fileCount} file${fileCount > 1 ? "s" : ""}`
  }
  if (deletions > 0 && additions === 0) {
    return `chore: remove ${fileCount} file${fileCount > 1 ? "s" : ""}`
  }
  return `fix: update ${fileCount} file${fileCount > 1 ? "s" : ""}`
}

export async function POST(req: Request) {
  // Support both Clerk and desktop auth
  const { userId } = await getRestAuth(req)
  if (!userId) {
    return new Response("Unauthorized", { status: 401 })
  }

  let diff: string = ""
  let fileCount = 0
  let additions = 0
  let deletions = 0

  try {
    const body = await req.json()
    diff = body.diff
    fileCount = body.fileCount || 1
    additions = body.additions || 0
    deletions = body.deletions || 0

    if (!diff || typeof diff !== "string") {
      return new Response("Invalid request: diff is required", { status: 400 })
    }

    console.log(
      "[generate-commit-message] Processing diff:",
      diff.length,
      "chars,",
      fileCount,
      "files"
    )

    const result = await generateText({
      model: openrouter("anthropic/claude-haiku-4.5"),
      messages: [
        {
          role: "system",
          content: `You are an expert at writing concise, meaningful git commit messages following the Conventional Commits specification.

## Your Task
Analyze the provided git diff and generate a single-line commit message that accurately describes the changes.

## Conventional Commits Format
Your message MUST follow this format:
<type>: <description>

Where <type> is one of:
- feat: A new feature or capability
- fix: A bug fix or correction
- chore: Maintenance tasks, dependencies, configs
- docs: Documentation only changes
- style: Code style changes (formatting, whitespace)
- refactor: Code restructuring without behavior change
- perf: Performance improvements
- test: Adding or updating tests
- build: Build system or external dependencies
- ci: CI/CD configuration changes

## Rules
1. Use lowercase for the type prefix
2. Use lowercase for the description (no capital letter at start)
3. Keep it under 72 characters total
4. Be specific about what changed, not why
5. Use present tense ("add feature" not "added feature")
6. No period at the end
7. Output ONLY the commit message, nothing else

## Examples
- feat: add user authentication endpoint
- fix: resolve null pointer in payment processing
- chore: update dependencies to latest versions
- refactor: extract validation logic to separate module
- docs: add API documentation for user endpoints

Analyze the diff and return only the commit message.`,
        },
        {
          role: "user",
          content: `Generate a commit message for this diff:\n\n${diff}`,
        },
      ],
      temperature: 0.2,
    })

    const cleanedMessage = cleanCommitMessage(result.text)
    console.log("[generate-commit-message] Generated:", cleanedMessage)

    // Validate message is not too long
    const finalMessage =
      cleanedMessage.length <= 100
        ? cleanedMessage
        : getFallbackMessage(fileCount, additions, deletions)

    return Response.json({ message: finalMessage })
  } catch (error) {
    console.error("Error generating commit message:", error)
    return Response.json({
      message: getFallbackMessage(fileCount, additions, deletions),
    })
  }
}
