---
name: portable_capability_bridge
description: "Validate and route the OS capability surface: checks every SKILLS_ROUTER entry resolves on disk, runs a portability audit (no machine-specific drive paths), and reports the real capability/skill counts. Use before/after changing skills, or to confirm the OS is consistent."
---

# Portable Capability Bridge

The capability bridge (`1_CORE/scripts/seosona_capability_bridge.js`) is the OS's
self-consistency check. It reads `2_KNOWLEDGE/SKILLS_ROUTER.md`, verifies each referenced
skill/framework path exists, runs a portability audit (flags machine-specific drive paths in
tracked files), and emits the true capability count.

## Usage
```bash
node 1_CORE/scripts/seosona_capability_bridge.js validate
```
Returns ok, totalCapabilities, errors. ok=false means a router entry is dangling or a
non-portable path leaked in — fix it, regenerate the router with
`python 1_CORE/scripts/core/plugin_manager.py`, then re-validate.

## When to run
- After adding/removing/moving any framework skill.
- Before a commit/publish (part of the pre-publish gate).
- To confirm portability: all paths must use the portable anchor or repo-relative paths.
