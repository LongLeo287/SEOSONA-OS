# OpenAI CLI Creator

Standards for building command-line interfaces Codex can execute.

## 1. Composable CLI Commands
* Avoid all-in-one commands. Propose small, composable commands (discover, read, write).
* Pattern: `<tool> --json <noun> <verb>` (e.g. `ci-tool --json logs tail`).

## 2. Output and Priority
* Success output: JSON to `stdout`.
* Diagnostics, warnings, and errors: text to `stderr`.
* Exit codes: 0 for success, non-zero for failures.
* Auth priority: `ENV_VAR` > `config.toml` > command line flags.
