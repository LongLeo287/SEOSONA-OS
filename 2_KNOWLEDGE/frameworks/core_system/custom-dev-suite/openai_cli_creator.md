# CLI Creator Standard

## Purpose

Create CLI tools that are portable, deterministic, and easy for agents to call.

## Rules

- Resolve SEOSONA OS through `~/.seosona`, `${SEOSONA_ROOT}`, or repository-relative paths.
- Provide a `--json` mode when output will be consumed by automation.
- Exit non-zero on validation failures.
- Mask secrets and credentials.
- Keep commands idempotent where possible.
- Document exact usage and expected output.

TASK COMPLETED
