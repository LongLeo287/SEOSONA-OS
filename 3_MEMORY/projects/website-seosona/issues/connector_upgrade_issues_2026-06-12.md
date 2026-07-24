# Website SEOSONA Connector Issue Register

## Resolved In This Upgrade

- Legacy project rule files referenced the old `AntigravitySystem` location.
- Project did not have a portable `seosona.project.json` manifest.
- Project did not have a local `npm run seosona:doctor` health command.
- SEOSONA OS did not have a project-level doctor command.
- Capability routes did not expose confidence, matched terms, required files, risk level, or recommended personas.

## Remaining Operational Watchpoints

- The Website project has many pre-existing working tree changes outside this connector upgrade.
- The Website project remote credential must stay sanitized before any push.
- Build verification may still fail for app/content reasons unrelated to the connector.

TASK COMPLETED
