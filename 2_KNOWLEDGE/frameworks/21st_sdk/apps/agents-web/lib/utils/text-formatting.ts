/**
 * Converts a string to sentence case (first letter uppercase, rest lowercase)
 * Preserves proper nouns and acronyms that are all caps
 */
export function toSentenceCase(text: string): string {
  if (!text) return ""

  // Trim and handle empty strings
  const trimmed = text.trim()
  if (!trimmed) return ""

  // Convert to sentence case
  // First character uppercase, rest lowercase except for words that are all caps (acronyms)
  const words = trimmed.split(/\s+/)
  return words
    .map((word, index) => {
      // Keep acronyms (all uppercase words with 2+ chars) as-is
      if (word.length > 1 && word === word.toUpperCase()) {
        return word
      }
      // First word: capitalize first letter, rest lowercase
      if (index === 0) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      }
      // Other words: all lowercase
      return word.toLowerCase()
    })
    .join(" ")
}
