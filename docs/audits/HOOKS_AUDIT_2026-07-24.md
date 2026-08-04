# Hooks Audit — 2026-07-24

All 13 hooks in `1_CORE/hooks/` were **dead**: the repo had no `.claude/settings.json` and the global
settings had no `hooks` key, so nothing fired them. They were registered only in
`1_CONFIG/ide_profiles/settings.json` — a template shipped to *other* projects by `seosona init`,
never this repo's own config.

Each was reviewed, tested against synthetic hook payloads, fixed where worth fixing, and either
registered or deliberately left off. Verdicts below.

## Registered (7)

| Hook | Event | Why | Fixes applied |
| :--- | :--- | :--- | :--- |
| `brain-inject` | UserPromptSubmit | Injects matching skills + KIs so the ~1.25k KI / ~460 skill library participates in every task instead of sitting idle. ~0.2s. | New in this pass. |
| `session-init` | SessionStart | ~55 tokens once per session; its compact/approval-state warning is a genuine mitigation. | `codingLevel` fallback `5` → `-1` (the two reads disagreed); `CK_CLAUDE_SETTINGS_DIR` pointed at `1_CORE/` instead of `.claude/`. |
| `privacy-block` | PreToolUse | Blocks reads of `.env`, `*.pem`, `*.key`, `id_rsa`, `credentials`. Verified: blocks `.env`, allows `.env.example`, no false positives on the vendored `credential-manager.py`. | None — correct as written. |
| `scout-block` | PreToolUse | Keeps `node_modules`/build output out of context. | Three real bugs: empty stdin exited **2 (blocked)** while every other path failed open; `claudeDir` resolved to `1_CORE/` so `.ckignore` was never found; broad-pattern detection hard-blocked ordinary globs like `**/*.js`. Added a scoped `.claude/.ckignore`. |
| `post-edit-simplify-reminder` | PostToolUse | Nudges toward the `simplify` skill after 5+ edits, at most once per 10 min. | Output shape was a top-level `additionalContext` (ignored — the reminder never reached the model); it pointed at a `code-simplifier` **agent that does not exist** and called the step "MANDATORY". |
| `memory-logger` | PostToolUse | Durable trace of substantive writes. | Read and split the **entire** log on every edit to compute a line number — O(n²) on the hottest hook path. Shared `transcript.jsonl` with `memory_logger.py`, which serializes through a lock this hook ignored → moved to `transcript-hooks.jsonl`. Logged absolute paths (machine layout leak) → now repo-relative via `realpathSync` (the junction spans drives, so `path.relative` silently returned absolute). |
| `session-end` | SessionEnd | Session boundary marker. | Same whole-file read and same lock conflict as `memory-logger`; both removed. |

## Deliberately NOT registered (5)

| Hook | Why not |
| :--- | :--- |
| `descriptive-name` | Emitted `"permissionDecision": "allow"` — a blanket **auto-approve** for every tool its matcher covered. That is not what a file-naming reminder should do, and `additionalContext` is not honoured on PreToolUse anyway, so the reminder itself likely never rendered. The auto-approve line was **removed from the file** regardless, so the landmine is defused if anyone registers it later. Content also duplicates `context-builder.cjs`. |
| `dev-rules-reminder` | ~625 tokens on **every** prompt, and `wasRecentlyInjected` reads the entire session transcript (35 MB / ~70 ms / ~113 MB RSS) to inspect its last 150 lines. It also reports the hook process's own heap and CPU as if they were machine metrics, then tells the model to plan delegation from those numbers. |
| `subagent-init` | Well built, but its whole payload is scaffolding for a `plans/reports/` convention this repo does not use — enabling it would have subagents creating that tree. |
| `usage-context-awareness` | Writes a usage cache whose only consumers (the statusline, `dev-rules-reminder`) are themselves unwired. Costs a token round-trip for a file nothing reads. |
| `write-compact-marker` | Writes `3_MEMORY/logs/last_compact.json` that **nothing in the repo reads**, into a path that was not gitignored — persistent working-tree noise for zero benefit. |

## Cross-cutting fixes

- **`1_CONFIG/ide_profiles/settings.json`** (shipped to user projects by `seosona init`) referenced
  every hook as `node "~/.seosona/..."`. A tilde inside double quotes is never expanded, so every
  hook command in every connected project pointed at a literal `~` directory and failed silently.
  Switched to `$HOME` (which does expand inside quotes) and curated to the registered set.
- **`ck-config.schema.json`** had `additionalProperties: false` over a 7-hook list, so
  `brain-inject`, `memory-logger`, `session-end`, `descriptive-name` and `write-compact-marker`
  could not be disabled without writing a schema-invalid config. All five added, and
  `DEFAULT_CONFIG.hooks` in `ck-config-utils.cjs` brought back in sync.
- **Leak vector closed:** `3_MEMORY/logs/refs/` was **not** gitignored, and `memory_logger.py`
  spills full file *content* over 1500 chars into it — on a repo that is pushed publicly. Added to
  `.gitignore` along with `last_compact.json`, and the stray tracked test artifact (`step_36.md`,
  2 KB of `AAAA…`) removed. No real content had leaked.
