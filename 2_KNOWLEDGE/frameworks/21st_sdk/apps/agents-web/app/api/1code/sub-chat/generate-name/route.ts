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
  cleaned = cleaned.replace(/^(chat\s+title|title|chat\s+name|name):\s*/i, "")

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

// Fallback to truncated user message
function getFallbackName(userMessage: string): string {
  const trimmed = userMessage.trim()
  if (trimmed.length <= 25) {
    return trimmed || "New Chat"
  }
  return trimmed.substring(0, 25) + "..."
}

export async function POST(req: Request) {
  // Support both Clerk and desktop auth
  const { userId } = await getRestAuth(req)
  if (!userId) {
    return new Response("Unauthorized", { status: 401 })
  }

  let userMessage: string = ""

  try {
    const body = await req.json()
    userMessage = body.userMessage

    if (!userMessage || typeof userMessage !== "string") {
      return new Response("Invalid request: userMessage is required", {
        status: 400,
      })
    }

    const result = await generateText({
      model: openrouter("anthropic/claude-haiku-4.5"),
      messages: [
        {
          role: "system",
          content: `You are an expert at creating concise, descriptive titles for technical chat conversations. Your task is to analyze the user's first message and generate a short title that captures the essence of what they're trying to accomplish.

## Your Task
Generate a brief, descriptive title (2-5 words) for a chat conversation based on the user's first message. The title should help users quickly identify and remember what the conversation is about.

## Language Rule
IMPORTANT: Always generate the title in the SAME LANGUAGE as the user's message. If the user writes in Russian, the title must be in Russian. If in Spanish, the title must be in Spanish. Match the user's language exactly.

## Formatting Rules
- Length: 2-5 words maximum (prefer shorter when possible)
- Case: Use sentence case - only the first word starts with a capital letter
- Output: Return ONLY the title text itself, nothing else
- No prefixes, quotes, or punctuation at the end

## Content Guidelines
- Be specific: Focus on the concrete task or topic
- Action-oriented: Use verbs when appropriate (e.g., "setup", "fix", "create")
- Avoid filler words: Skip "chat", "help", "question", "request", "about" (and their equivalents in other languages)

## Examples
- "Can you help me create a login form?" → "Login form"
- "I need to fix a bug in my authentication system" → "Auth bug fix"
- "Build a dashboard with user analytics and charts" → "User analytics dashboard"
- "Помоги сделать форму логина" → "Форма логина"
- "Нужно пофиксить баг в авторизации" → "Баг авторизации"
- "Necesito crear una página de registro" → "Página de registro"
- "我想给应用添加深色模式" → "深色模式设置"

Return only the title text.`,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      temperature: 0.3,
    })

    const cleanedName = cleanGeneratedName(result.text)

    // Fallback if the AI response is too long or empty
    const finalName =
      cleanedName && cleanedName.length <= 40
        ? cleanedName
        : getFallbackName(userMessage)

    return Response.json({ name: finalName })
  } catch (error) {
    console.error("Error generating chat name:", error)
    return Response.json({ name: getFallbackName(userMessage) })
  }
}
