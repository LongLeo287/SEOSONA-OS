# Dependency Audit Rules

Enforces supply chain security for all projects managed under SEOSONA OS.
This rule set is automatically triggered by the Orchestrator whenever a dependency change is detected.

---

## 1. Trigger Conditions

Run a dependency audit automatically when:
- Any file matching `package.json`, `requirements.txt`, `pyproject.toml`, `go.mod`, or `Cargo.toml` is created or modified.
- A `npm install`, `pip install`, or `go get` command is executed.
- Before any `git push` or deployment step.

---

## 2. Audit Commands by Ecosystem

| Ecosystem | Audit Command | Fix Command |
|---|---|---|
| Node.js | `npm audit --json` | `npm audit fix` |
| Python | `pip-audit --output json` | Upgrade pinned version manually |
| Go | `govulncheck ./...` | Update `go.mod` version |
| Rust | `cargo audit` | `cargo update` |

---

## 3. Severity Thresholds

| Severity | Action |
|---|---|
| **Critical** | Block immediately. Do NOT proceed until resolved. Alert user. |
| **High** | Attempt auto-fix. If fail → block and alert user. |
| **Moderate** | Log to `3_MEMORY/errors/`. Continue with warning. |
| **Low / Info** | Log silently. No action required. |

---

## 4. Auto-Healing Protocol

```bash
# Step 1: Run audit
npm audit --json > /tmp/audit_report.json

# Step 2: Attempt auto-fix
npm audit fix

# Step 3: Re-run audit to confirm
npm audit --json

# Step 4: If still failing
# → Check if issue is in direct or transitive dependency
# → For transitive: Add resolution override in package.json
# → If unfixable: Document in 3_MEMORY/errors/ and alert user
```

---

## 5. Allowlist (Known False Positives)

Some advisories may be intentional or irrelevant (e.g., dev-only tools, CLI scripts never exposed to network).
To allowlist, add to `1_CONFIG/.env`:
```
SEOSONA_AUDIT_ALLOWLIST=GHSA-xxxx-xxxx-xxxx,GHSA-yyyy-yyyy-yyyy
```

---

## 6. Reporting

After every audit run, append a summary to `3_MEMORY/logs/dependency_audit.log`:
```
[TIMESTAMP] Ecosystem: node | Critical: 0 | High: 1 | Fixed: 1 | Status: CLEAN
```
