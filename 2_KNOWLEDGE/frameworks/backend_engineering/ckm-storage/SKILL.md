---
name: ckm:storage
description: S3 storage operations - upload, sync, list, get URLs
argument-hint: "[list|sync|upload|url] [args]"
metadata:
  author: claudekit
  version: "1.0.0"
---

## Subcommands

| Subcommand | Description | Reference |
|------------|-------------|-----------|
| `list` | list | `references/list.md` |
| `sync` | sync | `references/sync.md` |
| `upload` | upload | `references/upload.md` |
| `url` | url | `references/url.md` |

## Routing

1. Parse subcommand from `$ARGUMENTS` (first word)
2. Load corresponding `references/{subcommand}.md`
3. Execute with remaining arguments