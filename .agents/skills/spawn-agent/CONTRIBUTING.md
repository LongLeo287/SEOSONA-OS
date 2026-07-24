# Contributing

Thanks for your interest in improving **spawn-agent**! Here's how to contribute.

## Quick Start

1. Fork this repo
2. Create a branch: `git checkout -b my-feature`
3. Make your changes
4. Test: `./scripts/spawn-agent.sh --help` should run without errors
5. Commit with a clear message: `git commit -m "Add: new template for migration tasks"`
6. Push and open a Pull Request

## What We'd Love Help With

- **New templates** — Got a recurring task type? Add a template in `templates/`
- **Agent support** — Adding support for new CLI agents (Aider, Continue, etc.)
- **Documentation** — Better examples, clearer instructions, typo fixes
- **Bug reports** — If the script breaks on your setup, let us know

## Guidelines

- Keep `SKILL.md` as the single source of truth for the delegation protocol
- Templates should be self-contained — a worker agent reads only the filled template
- Shell script must stay POSIX-compatible where possible (bash 4+ is fine)
- Test on both macOS and Linux if you change `spawn-agent.sh`

## Commit Messages

Use clear prefixes:

```
Add: new template for database migration tasks
Fix: timeout detection on Linux systems
Docs: clarify installation steps for Cursor
Refactor: simplify approval mode mapping
```

## Questions?

Open an issue — we're happy to chat.
