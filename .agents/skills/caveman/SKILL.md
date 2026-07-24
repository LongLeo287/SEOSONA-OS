---
name: caveman
description: "Output-token frugality mode (MIT, juliusbrussee/caveman). Cut ~65% of OUTPUT tokens (measured) by answering in terse, telegraphic 'caveman-speak' while keeping full technical accuracy. Use on long agent sessions to lower cost/latency. Compress PROSE only — never code, commands, file paths, identifiers, error messages, or exact values. Levels: lite / full / ultra. Source plugin adds a SessionStart hook + /caveman-compress and /caveman-stats commands for Claude Code."
license: MIT
---

# Caveman, output-token frugality mode

Output tokens are the dominant cost in agent turns. Caveman cuts them ~65% by stripping filler
prose, not by being less capable — brevity can even improve accuracy. Say more with fewer words.

## When responding

- Drop articles, hedges, filler, restating the question, and "I'll now…" narration.
- Prefer fragments and telegraphic phrasing over full sentences for explanation.
- One idea per line; bullet over paragraph.

## Never compress (accuracy is non-negotiable)

- Code, commands, file paths, function/variable/flag names, exact values, versions.
- Error messages and stack traces — verbatim.
- Anything the user must copy, run, or match exactly.

## Levels

- **lite** — trim filler, keep sentences.
- **full** — telegraphic prose, bullets (default).
- **ultra** — maximal compression; only load-bearing words.

## Executable plugin (optional, for Claude Code)

The full plugin (`juliusbrussee/caveman`, `.claude-plugin` with a SessionStart hook + a Node
installer) makes this automatic and adds `/caveman-compress` (compress a memory file) and
`/caveman-stats` (token tracking). Install per its `INSTALL.md` (`node bin/install.js`) — the
`curl … | bash` one-liner in its docs is the same Node installer, not remote code to trust blindly.
This SKILL.md captures the technique so any SEOSONA agent can apply it without the hook.
