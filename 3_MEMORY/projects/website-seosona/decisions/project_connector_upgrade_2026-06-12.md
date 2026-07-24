# Project Connector Upgrade Decision

## Decision

Use a portable project manifest plus a small wrapper script in each project. The wrapper resolves `~/.seosona` at runtime through the current user home directory and delegates to `1_CORE/scripts/project_connector.js`.

## Rationale

- Keeps persistent project files portable.
- Avoids writing the physical SEOSONA OS installation path into project configs.
- Allows one command, `npm run seosona:doctor`, to verify connection health.
- Lets the OS own connector behavior while projects keep only a thin bridge.

TASK COMPLETED
