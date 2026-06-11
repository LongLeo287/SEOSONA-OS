# Security Regex Rules

Zero-Trust secrets scan rules to prevent credential leaks before committing code.

## 1. Secrets & Credentials Detection List
Scan modified files for the following patterns:
* **AWS API Key:** `AKIA[0-9A-Z]{16}`
* **Anthropic API Key:** `sk-ant-api03-[A-Za-z0-9\-_]{93}-AA`
* **OpenAI API Key:** `sk-[a-zA-Z0-9]{48}`
* **Generic Password Pattern:** `(?i)(password|passwd|pwd)[\s:=]+['\"][^'\"]{6,}['\"]`
* **SSH/RSA Private Key:** `-----BEGIN (RSA|OPENSSH) PRIVATE KEY-----`
* **Generic Bearer Token:** `Bearer\s+[a-zA-Z0-9_\-\.]{15,}`

## 2. Commit Pre-flight Action
If any matches are found:
1. Block the commit.
2. Alert the developer.
3. Redact the matching credentials from all configuration tracking.

## 3. Hardcoded Path Detection (Rule #7 Enforcement)
Scan ALL modified system files for absolute/machine-specific paths:
* **Windows Absolute Path:** `[A-Za-z]:\\\\` or `[A-Za-z]:/` (for example, a physical drive root or user profile path)
* **Unix Absolute Path (personal):** personal home-directory paths on Linux or macOS
* **Violation Keyword:** Any occurrence of a volume letter followed by `:` (e.g., `d:`, `C:`) outside of `.env` files.

If any matches are found:
1. Block the commit.
2. Display: `[RULE #7 VIOLATION] Hardcoded absolute path detected. Use ${SEOSONA_ROOT} or relative paths instead. See 1_CORE/rules/no_hardcoded_paths.md`
3. Require the developer to replace with `${SEOSONA_ROOT}`, `~/.seosona/`, or a relative path.
