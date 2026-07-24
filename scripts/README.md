# scripts — Repo-level helper scripts

Top-level operational scripts. The bulk of the OS logic lives in [`1_CORE/scripts/`](../1_CORE/scripts/);
this folder holds thin, repo-root entry points.

## Files

| File | Purpose |
|---|---|
| `seosona-project.mjs` | Project bootstrap/attach helper — wires a folder to SEOSONA OS (writes `seosona.project.json` + rule files). Degrades gracefully when the `~/.seosona` anchor isn't present yet. |
