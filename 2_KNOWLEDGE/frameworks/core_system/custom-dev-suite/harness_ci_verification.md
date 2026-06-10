# Harness CI Verification

Automated validation pipelines for build integrity.

## 1. Build Verification
Always run verification checks locally before proposing task completion (e.g. `npm run build`, test suites, compiler validations).

## 2. Qualitative Checks
Favor quantitative validators (compiler exit codes, type checks, lint checks) over qualitative claims.
