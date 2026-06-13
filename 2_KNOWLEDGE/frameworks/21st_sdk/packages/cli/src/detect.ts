// Detect AI agents running in pseudo-TTY
export function isAgent(): boolean {
  return !!(
    process.env.CLAUDE_CODE ||
    process.env.CLAUDECODE ||
    process.env.CURSOR_TRACE_ID ||
    process.env.CURSOR_AGENT ||
    process.env.CODEX_SANDBOX ||
    process.env.GEMINI_CLI ||
    process.env.AI_AGENT
  )
}

export function isInteractive(): boolean {
  return !!process.stdin.isTTY && !!process.stdout.isTTY
}
