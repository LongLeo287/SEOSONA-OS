interface Edit {
  search: string
  replace: string
}

function normalizeWhitespace(lines: string[]): {
  normalized: string[]
  minLeading: number
} {
  const nonEmptyLines = lines.filter((line) => line.trim())
  if (nonEmptyLines.length === 0) return { normalized: lines, minLeading: 0 }

  // Find minimum leading whitespace
  const leadingSpaces = nonEmptyLines.map((line) => {
    const match = line.match(/^(\s*)/)
    return match?.[1]?.length ?? 0
  })
  const minLeading = Math.min(...leadingSpaces)

  // Remove common leading whitespace
  const normalized = lines.map((line) =>
    line.trim() ? line.substring(minLeading) : line,
  )

  return { normalized, minLeading }
}

function matchWithNormalizedWhitespace(
  codeLines: string[],
  searchLines: string[],
  startIdx: number,
): { matches: boolean; leadingWhitespace: string } {
  const { normalized: normalizedSearch } = normalizeWhitespace(searchLines)
  const codeSlice = codeLines.slice(startIdx, startIdx + searchLines.length)
  const { normalized: normalizedCode } = normalizeWhitespace(codeSlice)

  // Check if normalized content matches
  const matches = normalizedSearch.every(
    (line, i) => line.trim() === normalizedCode[i]?.trim(),
  )

  if (!matches) return { matches: false, leadingWhitespace: "" }

  // Find consistent leading whitespace in code
  const nonEmptyCodeLines = codeSlice.filter(
    (line, i) => searchLines[i] && searchLines[i].trim(),
  )
  if (nonEmptyCodeLines.length === 0)
    return { matches: true, leadingWhitespace: "" }

  // Check if all lines have same whitespace offset
  const firstNonEmpty = nonEmptyCodeLines[0]
  if (!firstNonEmpty) return { matches: true, leadingWhitespace: "" }

  const leadingWs = firstNonEmpty.match(/^(\s*)/)?.[1] || ""

  const consistent = nonEmptyCodeLines.every(
    (line) => line.startsWith(leadingWs) || !line.trim(),
  )

  return {
    matches: consistent,
    leadingWhitespace: consistent ? leadingWs : "",
  }
}

export function parseEditBlocks(aiResponse: string): Edit[] {
  const edits: Edit[] = []
  const lines = aiResponse.split("\n")

  let i = 0
  while (i < lines.length) {
    if (lines[i]?.includes("<<<<<<< SEARCH")) {
      const searchLines: string[] = []
      const replaceLines: string[] = []

      i++
      while (i < lines.length && !lines[i]?.includes("=======")) {
        const line = lines[i]
        if (line !== undefined) {
          searchLines.push(line)
        }
        i++
      }

      i++

      while (i < lines.length && !lines[i]?.includes(">>>>>>> REPLACE")) {
        const line = lines[i]
        if (line !== undefined) {
          replaceLines.push(line)
        }
        i++
      }

      if (searchLines.length > 0) {
        edits.push({
          search: searchLines.join("\n"),
          replace: replaceLines.join("\n"),
        })
      }
    }
    i++
  }

  return edits
}

export function applyEdits(originalCode: string, edits: Edit[]): EditResult {
  const errors: EditResult["errors"] = []
  let modifiedCode = originalCode

  for (const edit of edits) {
    try {
      const searchStr = edit.search.trim()
      const replaceStr = edit.replace

      // Check if replacement already exists
      if (
        replaceStr &&
        replaceStr.trim() &&
        modifiedCode.includes(replaceStr.trim())
      ) {
        errors?.push({
          edit,
          reason: "The REPLACE content already exists in the file",
          suggestion: "This edit may not be necessary",
        })
        continue
      }

      // Try to apply the edit
      const result = applySingleEdit(modifiedCode, edit)
      if (result.success && result.code) {
        modifiedCode = result.code
      } else {
        const suggestion = findSimilarLines(searchStr, modifiedCode)
        errors?.push({
          edit,
          reason: result.reason || "Failed to find exact match",
          suggestion: suggestion ? `Did you mean:\n${suggestion}` : undefined,
        })
      }
    } catch (error) {
      errors?.push({
        edit,
        reason: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  if (errors.length > 0) {
    return { success: false, errors }
  }

  return { success: true, modifiedCode }
}

function findWhitespaceFlexibleMatch(
  codeLines: string[],
  searchLines: string[],
): number {
  for (let i = 0; i <= codeLines.length - searchLines.length; i++) {
    const { matches } = matchWithNormalizedWhitespace(codeLines, searchLines, i)
    if (matches) {
      return i
    }
  }
  return -1
}

function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1

  if (longer.length === 0) return 1.0

  const editDistance = getEditDistance(longer, shorter)
  return (longer.length - editDistance) / longer.length
}

function getEditDistance(str1: string, str2: string): number {
  const matrix: number[][] = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(0))

  for (let i = 0; i <= str2.length; i++) {
    matrix[i]![0] = i
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0]![j] = j
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i]![j] = matrix[i - 1]![j - 1]!
      } else {
        matrix[i]![j] = Math.min(
          matrix[i - 1]![j - 1]! + 1, // substitution
          matrix[i]![j - 1]! + 1, // insertion
          matrix[i - 1]![j]! + 1, // deletion
        )
      }
    }
  }

  return matrix[str2.length]![str1.length]!
}

function findFuzzyMatch(
  codeLines: string[],
  searchLines: string[],
  threshold = 0.8,
): { index: number; similarity: number } {
  let bestMatch = { index: -1, similarity: 0 }
  const searchText = searchLines.join("\n")
  const searchLength = searchLines.length

  // Try different window sizes (±10% of search length)
  const minLen = Math.max(1, Math.floor(searchLength * 0.9))
  const maxLen = Math.ceil(searchLength * 1.1)

  for (let windowSize = minLen; windowSize <= maxLen; windowSize++) {
    for (let i = 0; i <= codeLines.length - windowSize; i++) {
      const candidateLines = codeLines.slice(i, i + windowSize)
      const candidateText = candidateLines.join("\n")

      const similarity = calculateSimilarity(searchText, candidateText)

      if (similarity > bestMatch.similarity && similarity >= threshold) {
        bestMatch = { index: i, similarity }
      }
    }
  }

  return bestMatch
}

function findFlexibleMatch(codeLines: string[], searchLines: string[]): number {
  for (let i = 0; i <= codeLines.length - searchLines.length; i++) {
    let matches = true

    for (let j = 0; j < searchLines.length; j++) {
      const codeLine = codeLines[i + j]
      const searchLine = searchLines[j]
      if (!codeLine || !searchLine || codeLine.trim() !== searchLine.trim()) {
        matches = false
        break
      }
    }

    if (matches) {
      return i
    }
  }

  return -1
}

export function findSimilarLines(
  searchText: string,
  content: string,
  threshold = 0.6,
): string {
  const searchLines = searchText.split("\n")
  const contentLines = content.split("\n")

  let bestSimilarity = 0
  let bestMatch: string[] = []
  let bestIndex = -1

  for (let i = 0; i <= contentLines.length - searchLines.length; i++) {
    const chunk = contentLines.slice(i, i + searchLines.length)
    const chunkText = chunk.join("\n")
    const similarity = calculateSimilarity(searchText, chunkText)

    if (similarity > bestSimilarity && similarity >= threshold) {
      bestSimilarity = similarity
      bestMatch = chunk
      bestIndex = i
    }
  }

  if (bestSimilarity < threshold) {
    return ""
  }

  // Include context lines before and after
  const contextSize = 3
  const start = Math.max(0, bestIndex - contextSize)
  const end = Math.min(
    contentLines.length,
    bestIndex + searchLines.length + contextSize,
  )

  return contentLines.slice(start, end).join("\n")
}

export interface EditResult {
  success: boolean
  modifiedCode?: string
  errors?: Array<{
    edit: Edit
    reason: string
    suggestion?: string
  }>
}

/**
 * Enhanced ellipsis handling for targeted edits in large files.
 *
 * Supports using `...` to skip unchanged sections of code, allowing surgical edits
 * without reproducing entire files.
 *
 * Example:
 * ```
 * SEARCH:
 * import React from 'react'
 * ...
 * function handleClick() {
 *   console.log('clicked')
 * }
 * ...
 *
 * REPLACE:
 * import React, { useState } from 'react'
 * ...
 * function handleClick() {
 *   console.log('button clicked')
 *   trackEvent('click')
 * }
 * ...
 * ```
 *
 * Rules:
 * - Number of `...` sections must match exactly between SEARCH and REPLACE
 * - Each non-ellipsis section must appear exactly once in the file
 * - Ellipsis markers must be on their own lines
 * - Whitespace around `...` is normalized but content whitespace is preserved
 */
function handleEllipsisEdit(
  code: string,
  searchText: string,
  replaceText: string,
): { success: boolean; code?: string; reason?: string } {
  // More sophisticated regex that matches Aider's pattern
  const ellipsisPattern = /^(\s*\.\.\.\s*)$/gm

  // Split while preserving the ellipsis lines
  const searchParts = splitPreservingEllipsis(searchText, ellipsisPattern)
  const replaceParts = splitPreservingEllipsis(replaceText, ellipsisPattern)

  // Validate structure
  const validation = validateEllipsisStructure(searchParts, replaceParts)
  if (!validation.valid) {
    return { success: false, reason: validation.reason }
  }

  // Extract content sections and ellipsis markers
  const searchSections = extractSections(searchParts)
  const replaceSections = extractSections(replaceParts)

  if (searchSections.length === 0) {
    return { success: false, reason: "No ellipsis pattern found" }
  }

  // Apply each section
  let workingCode = code
  const appliedSections: number[] = []

  for (let i = 0; i < searchSections.length; i++) {
    const searchSection = searchSections[i]
    const replaceSection = replaceSections[i]

    if (searchSection === undefined || replaceSection === undefined) {
      continue
    }

    if (!searchSection && !replaceSection) {
      continue
    }

    if (!searchSection && replaceSection) {
      // Append new content when no search section
      if (!workingCode.endsWith("\n")) workingCode += "\n"
      workingCode += replaceSection
      appliedSections.push(i)
      continue
    }

    if (searchSection) {
      // Count exact matches
      const matches = findAllMatches(workingCode, searchSection)

      if (matches.length === 0) {
        return {
          success: false,
          reason: `Section ${i + 1}: Could not find text: "${searchSection.substring(0, 50)}..."`,
        }
      }

      if (matches.length > 1) {
        return {
          success: false,
          reason: `Section ${i + 1}: Found ${matches.length} matches for: "${searchSection.substring(0, 50)}...", expected exactly 1`,
        }
      }

      // Replace the single match
      const matchIndex = matches[0]
      if (matchIndex !== undefined) {
        workingCode =
          workingCode.substring(0, matchIndex) +
          replaceSection +
          workingCode.substring(matchIndex + searchSection.length)
        appliedSections.push(i)
      }
    }
  }

  return { success: true, code: workingCode }
}

function splitPreservingEllipsis(text: string, pattern: RegExp): string[] {
  const parts: string[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  // Reset regex state
  pattern.lastIndex = 0

  while ((match = pattern.exec(text)) !== null) {
    // Add content before ellipsis
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index))
    }
    // Add the ellipsis itself
    parts.push(match[0])
    lastIndex = match.index + match[0].length
  }

  // Add remaining content
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex))
  }

  return parts
}

function validateEllipsisStructure(
  searchParts: string[],
  replaceParts: string[],
): { valid: boolean; reason?: string } {
  if (searchParts.length !== replaceParts.length) {
    return {
      valid: false,
      reason: `Mismatched structure: ${Math.floor(searchParts.length / 2)} ... sections in SEARCH, ${Math.floor(replaceParts.length / 2)} in REPLACE`,
    }
  }

  // Check that ellipsis markers are in the same positions
  for (let i = 0; i < searchParts.length; i++) {
    const searchPart = searchParts[i]
    const replacePart = replaceParts[i]

    if (searchPart === undefined || replacePart === undefined) {
      continue
    }

    const searchIsEllipsis = /^\s*\.\.\.\s*$/.test(searchPart)
    const replaceIsEllipsis = /^\s*\.\.\.\s*$/.test(replacePart)

    if (searchIsEllipsis !== replaceIsEllipsis) {
      return {
        valid: false,
        reason: `Mismatched ... markers at position ${i + 1}`,
      }
    }
  }

  return { valid: true }
}

function extractSections(parts: string[]): string[] {
  const sections: string[] = []

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    if (part !== undefined && !/^\s*\.\.\.\s*$/.test(part)) {
      sections.push(part)
    }
  }

  return sections
}

function findAllMatches(text: string, searchText: string): number[] {
  const matches: number[] = []
  let index = 0

  while ((index = text.indexOf(searchText, index)) !== -1) {
    matches.push(index)
    index += searchText.length
  }

  return matches
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function applySingleEdit(
  code: string,
  edit: Edit,
): { success: boolean; code?: string; reason?: string } {
  const searchStr = edit.search.trim()
  const replaceStr = edit.replace

  // Check for ellipsis pattern first
  if (searchStr.includes("...") || replaceStr.includes("...")) {
    const ellipsisResult = handleEllipsisEdit(code, searchStr, replaceStr)
    if (ellipsisResult.success) {
      return ellipsisResult
    }
    // If ellipsis handling failed but pattern was found, return the error
    if (ellipsisResult.reason !== "No ellipsis pattern found") {
      return ellipsisResult
    }
  }

  // Direct string match
  if (code.includes(searchStr)) {
    return {
      success: true,
      code: code.replace(searchStr, replaceStr),
    }
  }

  const searchLines = searchStr.split("\n")
  const codeLines = code.split("\n")

  // Try exact line match
  let match = findFlexibleMatch(codeLines, searchLines)

  // Try whitespace-flexible match
  if (match === -1) {
    match = findWhitespaceFlexibleMatch(codeLines, searchLines)
    if (match !== -1) {
      const { leadingWhitespace } = matchWithNormalizedWhitespace(
        codeLines,
        searchLines,
        match,
      )
      const adjustedReplace = replaceStr
        .split("\n")
        .map((line) => (line.trim() ? leadingWhitespace + line : line))
        .join("\n")

      const before = codeLines.slice(0, match).join("\n")
      const after = codeLines.slice(match + searchLines.length).join("\n")
      return {
        success: true,
        code:
          before +
          (before ? "\n" : "") +
          adjustedReplace +
          (after ? "\n" : "") +
          after,
      }
    }
  }

  // Try fuzzy match
  if (match === -1) {
    const fuzzyResult = findFuzzyMatch(codeLines, searchLines, 0.8)
    if (fuzzyResult.index !== -1) {
      return {
        success: false,
        reason: `Found similar content with ${Math.round(fuzzyResult.similarity * 100)}% match, but not exact enough`,
      }
    }
  }

  if (match !== -1) {
    const before = codeLines.slice(0, match).join("\n")
    const after = codeLines.slice(match + searchLines.length).join("\n")
    return {
      success: true,
      code:
        before +
        (before ? "\n" : "") +
        replaceStr +
        (after ? "\n" : "") +
        after,
    }
  }

  return {
    success: false,
    reason: "Could not find text to replace",
  }
}

export interface AssistantMessageAndDiff {
  assistantMessage: string
  diffBlocks: string
}

export function parseAssistantMessageAndDiff(
  response: string,
): AssistantMessageAndDiff {
  // Extract assistant message
  const messageStartIndex = response.indexOf("ASSISTANT_MESSAGE_START")
  const messageEndIndex = response.indexOf("ASSISTANT_MESSAGE_END")

  let assistantMessage = "I've updated the component based on your request."
  if (messageStartIndex !== -1 && messageEndIndex !== -1) {
    assistantMessage = response
      .substring(
        messageStartIndex + "ASSISTANT_MESSAGE_START".length,
        messageEndIndex,
      )
      .trim()
  }

  // Extract diff blocks (everything after ASSISTANT_MESSAGE_END)
  let diffBlocks = response
  if (messageEndIndex !== -1) {
    diffBlocks = response
      .substring(messageEndIndex + "ASSISTANT_MESSAGE_END".length)
      .trim()
  }

  return {
    assistantMessage,
    diffBlocks,
  }
}
