# Swarms Autoresearch Loop

Self-modifying compiler error recovery loops.

## 1. Error Log Analysis
When a build fails:
1. Extract line number, file path, and error string.
2. Read the surrounding file lines.
3. Implement surgical fixes.
4. Rerun verification.

## 2. Failure Limit
Stop at 2 consecutive failures and trigger Blackboard block logic.
