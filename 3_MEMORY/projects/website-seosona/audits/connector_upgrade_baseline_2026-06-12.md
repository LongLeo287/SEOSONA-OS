# Website SEOSONA Connector Baseline

## Scope

- Project manifest: `seosona.project.json`
- Project rules: `AGENTS.md`, `.clauderules`, `.cursorrules`
- Project health command: `npm run seosona:doctor`
- OS connector script: `1_CORE/scripts/project_connector.js`

## Baseline Findings

- `~/.seosona` resolves to the active SEOSONA OS root through a filesystem junction.
- Local SEOSONA OS `main` matched GitHub `main` before connector changes.
- Capability bridge validation passed before implementation.
- Website project had existing working tree changes unrelated to this connector upgrade.
- Website project Git remote used embedded credentials before remediation.

## Upgrade Intent

Create a portable, testable, project-aware connector so the project can report `connected`, `partial`, or `broken` without relying on stale IDE rule paths.

TASK COMPLETED
