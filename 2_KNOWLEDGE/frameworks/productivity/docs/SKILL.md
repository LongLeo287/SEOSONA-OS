---
name: ck:docs
description: Initialize, update, and summarize project documentation
argument-hint: "[init|llms|summarize|update] [args]"
metadata:
  author: claudekit
  version: "1.0.0"
---

## Subcommands

| Subcommand | Description | Reference |
|------------|-------------|-----------|
| `init` | 💡💡💡💡 Analyze the codebase and create initial documentation | `references/init.md` |
| `llms` | 💡💡💡 Generate llms.txt based on the current codebase | `references/llms.md` |
| `summarize` | 💡 Analyze the codebase and update documentation | `references/summarize.md` |
| `update` | 💡💡💡 Analyze the codebase and update documentation | `references/update.md` |

## Routing

1. Parse subcommand from `$ARGUMENTS` (first word)
2. Load corresponding `references/{subcommand}.md`
3. Execute with remaining arguments