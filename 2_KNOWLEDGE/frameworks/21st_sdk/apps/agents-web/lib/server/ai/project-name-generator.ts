/**
 * Post-processes the generated project name to ensure it follows the required format
 */
export function postProcessProjectName(rawName: string): string {
  let processed = rawName.trim()

  // Remove any surrounding quotes (single or double)
  processed = processed.replace(/^["'`]|["'`]$/g, "")

  // Remove any remaining quotes in the middle or end
  processed = processed.replace(/["""''`]/g, "")

  // Convert to sentence case - only first letter and proper nouns should be capitalized
  if (processed.length > 0) {
    // Split into words and process each
    const words = processed.split(/\s+/)
    const processedWords = words.map((word, index) => {
      const lowerWord = word.toLowerCase()

      // Always capitalize first word
      if (index === 0) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      }

      // Keep certain words lowercase (articles, prepositions, etc.)
      const lowercaseWords = [
        "a",
        "an",
        "the",
        "and",
        "or",
        "but",
        "in",
        "on",
        "at",
        "to",
        "for",
        "of",
        "with",
        "by",
        "from",
      ]
      if (lowercaseWords.includes(lowerWord)) {
        return lowerWord
      }

      // Known proper nouns that should stay capitalized (companies, technologies, etc.)
      const properNouns = [
        "ai",
        "api",
        "ui",
        "ux",
        "css",
        "html",
        "js",
        "react",
        "vue",
        "angular",
        "node",
        "github",
        "google",
        "apple",
        "microsoft",
      ]
      if (properNouns.includes(lowerWord)) {
        return lowerWord === "ai"
          ? "AI"
          : lowerWord === "api"
            ? "API"
            : lowerWord === "ui"
              ? "UI"
              : lowerWord === "ux"
                ? "UX"
                : lowerWord === "css"
                  ? "CSS"
                  : lowerWord === "html"
                    ? "HTML"
                    : lowerWord === "js"
                      ? "JS"
                      : word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
      }

      // Default to lowercase for other words in sentence case
      return lowerWord
    })

    processed = processedWords.join(" ")
  }

  // Ensure it's not empty and reasonable length
  if (processed.length === 0 || processed.length > 100) {
    return "New project"
  }

  return processed
}

// Utility function to generate intelligent project names using AI
export async function generateIntelligentProjectName(
  userMessage: string,
): Promise<string> {
  try {
    const { generateProjectNamePrompt } = await import("./magic.prompt")
    const { fulfillModel } = await import("./index")
    const { generateText } = await import("ai")

    const prompt = generateProjectNamePrompt(userMessage)

    const response = await generateText({
      ...fulfillModel("llama-4-scout", false),
      prompt,
      temperature: 0.3,
    })

    const rawName = response.text.trim()
    if (rawName && rawName.length > 0 && rawName.length <= 100) {
      // Apply post-processing to ensure proper format
      const processedName = postProcessProjectName(rawName)

      // Log for debugging if there were significant changes
      if (rawName !== processedName) {
        console.log(
          `Project name post-processed: "${rawName}" → "${processedName}"`,
        )
      }

      return processedName
    }
  } catch (error) {
    console.warn(
      "Failed to generate project name, using original message:",
      error,
    )
  }

  // Fallback to processed version of original message
  return postProcessProjectName(userMessage)
}
