# SEOSONA OS — Full System Audit
**Date:** 2026-08-04 · **Scope:** entire repository · **Method:** static review + live execution + adversarial testing + chaos testing

---

> **Remediation status (updated 2026-08-04, end of session).** All 9 CRITICAL findings are closed,
> plus the connector-correctness cluster and the highest-value HIGH items. Test count went 24 → 41,
> and CI now installs the real dependency set and asserts on the two failure modes that were
> previously invisible. See §13 for what shipped and what remains.

## 1. Executive summary

SEOSONA OS is a **~26,000-line** AI operating system (15,376 Python / 10,498 JS) exposing **458 routable skills**, **1,266 knowledge items** and **1,862 indexed resources** through a portable-path capability bridge, a semantic knowledge brain, an 6-stage ingestion pipeline and 21 SEO connectors.

**Verdict: the architecture is sound and the day-to-day surface works. The defects are concentrated in the parts nobody watches — the failure paths.** Every control that fires on the happy path is healthy; several controls that only fire on the *unhappy* path are silently inert, and the system reports success in situations where it has done nothing.

Three findings would, on their own, justify this audit:

| # | Finding | Why it matters |
| :--- | :--- | :--- |
| **C1** | The UAP **output security scan is a complete no-op** — it iterates an empty pattern list | Generated content derived from third-party repos lands in `.agents/skills/`, `3_MEMORY/`, and git with **zero** filtering |
| **C2** | The **knowledge brain returns nothing** on any machine without `scikit-learn` — and reports success | There is no `requirements.txt`; the deps live in an unrelated app's virtualenv. A fresh clone gets a brain that silently answers **empty** |
| **C3** | A **failed clone is ingested as a valid empty repo**; the 3-strike retry ladder is unreachable dead code | 47 shipped knowledge items are stubs describing "a repository with 0 files" |

**Health score: 6.5 / 10.** Strong architecture and genuinely good defensive instincts (fail-open hooks, path confinement, a sandbox, a security guard), undermined by unverified controls and a missing reproducibility story.

---

## 2. What was tested

| Method | Coverage |
| :--- | :--- |
| Syntax/compile | 86 Python + 50 JS files — **0 errors** |
| Runtime import | all 86 Python modules, in isolation |
| Live execution | bridge (validate/route/manifest), router regen, knowledge MCP, doctor, lint, 2 SEO connectors against a real URL, all 8 hooks with synthetic payloads |
| Adversarial | dispatcher guard evasion (11 filename variants), path traversal (6 vectors), security-guard bypass, sandbox `is_vendored` |
| Chaos | router deleted · vector index corrupted · `config.json` malformed |
| Data | 951 queue rows, 1,266 KIs, 949 audit reports, vector index vs disk reconciliation |
| Benchmarks | 6 core operations, cold vs warm |

---

## 3. Baseline metrics

```
Code            25,874 lines   (Python 15,376 · JS 10,498)
Skills             458 routable   (was 283 before this session's fixes)
Knowledge items  1,266
Resources        1,862 indexed
Connectors          21
Hooks                8 on disk / 7 registered + 1 statusline
Tests            2,413 lines → 9.3% ratio
Git                 65 commits · 37 MB · 8,803 tracked files
Disk               745 MB (700 MB of it gitignored assets — clone stays lean)
UAP queue          948 COMPLETED · 3 CURRENT (stuck)
```

**Benchmarks** — bridge route **193 ms** (fast enough for a per-prompt hook), bridge validate 252 ms, router regen 178 ms, lint 536 ms, brain query **2,205 ms** (Python + sklearn startup dominates), brain cold rebuild 3,888 ms, `doctor` 6,128 ms.

---

## 4. Findings — CRITICAL

### C1 — The output security scan scans nothing
`1_CORE/scripts/uap_pipeline/04_creator.py:36`
```python
RED_FLAGS = getattr(_sec, "RED_FLAGS", [])   # 02b defines HARD_FLAGS / SOFT_FLAGS — never RED_FLAGS
```
`02b_security_guard` exposes `HARD_FLAGS` and `SOFT_FLAGS`. `RED_FLAGS` does not exist anywhere in the repo, so `getattr` silently yields `[]` and `_scan_output()` loops over an empty list.

**Verified live:**
```
04_creator.RED_FLAGS = []            → _scan_output iterates 0 patterns
_scan_output("AKIAIOSFODNN7EXAMPLE rm -rf / eval(atob('x'))") → None   (i.e. "clean")
```
Corroborating evidence: across 951 queue rows **not one** ever reached `BLOCKED`, and `_QUARANTINE/` does not exist on disk.

**Impact.** This is the only control on the *output* side of ingestion. Generated KIs — whose content derives from third-party repository text — are written into `.agents/skills/`, `3_MEMORY/projects/`, and git-committed with no filtering at all.
**Fix (one line).** `RED_FLAGS = _sec.HARD_FLAGS + _sec.SOFT_FLAGS`, and assert non-empty at import so this can never silently regress. Add a test.

---

### C2 — The knowledge brain silently returns nothing without scikit-learn
`1_CORE/scripts/mcp_knowledge_server.py:45`
```python
q = query.lower()
...
if q in content.lower():      # whole-query substring match
```
The lexical fallback matches the **entire query string** verbatim against each document. A 3-word query essentially never appears verbatim, so the fallback returns an empty list — while the response still reports `"backend": "lexical"` and exits 0.

**Verified live** (same queries, two interpreters):
```
"vietnamese content humanizer"   tfidf   → vieneu_tts_vietnamese_voice, uap_longhang2004_vietnamese-humanizer
                                 lexical → (empty)
"core web vitals performance"    tfidf   → performance-rules, web-performance, SOUL
                                 lexical → (empty)
```

**Why every fresh clone hits this.** There is **no `requirements.txt`, `pyproject.toml`, `Pipfile` or `setup.py` anywhere in the repo.** All Python dependencies resolve out of an unrelated application's virtualenv:
```
python  → C:\Users\Admin\AppData\Local\hermes\hermes-agent\venv   (3.11.15)  sklearn ✓ pandas ✓ joblib ✓ numpy ✓ rank_bm25 ✓ mcp ✓
python3 → WindowsApps\python3                                     (3.14.6)   all ✗
```
`.mcp.json` registers the server as `"command": "python"` — whichever `python` is first on PATH. On any other machine that is a different interpreter, and the brain answers empty forever without a single error.

Missing deps break 7 modules outright: `pandas` → `uap_manager.py` + `01_finder.py` (the pipeline entry point), `sklearn` → `vector_memory.py`, `requests` → `wp_rest_connector.py` + `github_repo_analyzer.py`, `fastapi` → `api_gateway.py`, `telegram` → `telegram_connector.py`.

**Fix.** Ship `requirements.txt` (pin sklearn, joblib, numpy, rank_bm25, pandas, requests, mcp); make the lexical fallback tokenise and score instead of substring-matching the whole query; have the MCP server **report degraded mode loudly** rather than returning an empty success.

---

### C3 — A failed clone is ingested as a valid empty repository
`1_CORE/scripts/uap_pipeline/02_auditor.py:216`
```python
if not repo_dir.exists():
    repo_dir.mkdir(parents=True, exist_ok=True)   # created BEFORE the clone runs
    ... clone ...
    if not success:
        new_status = 'FAILED' if new_retry >= 3 else 'PENDING'
```
The directory survives a failed clone. On the next pass `repo_dir.exists()` is `True`, the whole clone-and-retry block is skipped, `success` stays `True`, and the auditor audits an **empty directory** and marks it `AUDITED`.

**Proven in the live data:** `retry_count` distribution is 0 → 903 rows, 1 → 48 rows, **2 or 3 → 0 rows**. No row has ever reached `FAILED`. 47 of the 48 rows at `retry_count=1` are `COMPLETED` with `total_files: 0`, producing shipped knowledge items like:
> `# KI: stars/LongLeo287` — *"Repository with 0 files across 1 directories. Primary language: Unable to detect."*

**Fix.** Clone to a temp dir and `os.replace` on success (or `rmtree` in the failure branch); refuse to mark `AUDITED` when `total_files == 0`.

---

### C4 — Unbounded prompt-injection chain: repo → LLM → KI → your context
`03_assimilator.py:137` interpolates repository file content raw into the LLM prompt. `02_auditor.py:40` **deliberately prioritises** `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `CURSOR.md` — files whose entire purpose is to issue instructions to an AI agent — and `03_assimilator.py:445` copies them verbatim into the KI under `## Agent Configuration`.

That KI is indexed into the vector store and, since commit `b83df60`, **auto-injected into the operator's context on every prompt**. The only control on that path was `_scan_output` — which is C1's no-op.

**Fix.** Delimit untrusted content explicitly and instruct the model to treat it as data; strip fence characters; restore C1.

---

## 5. Findings — HIGH

| ID | Finding | Location | Evidence |
| :--- | :--- | :--- | :--- |
| **H1** | **6 of 8 queue statuses are dead ends.** The manager loops only on `PENDING` and exits otherwise. Nothing requeues `FAILED`, `BLOCKED`, `CURRENT`, or a mid-flight `AUDITED`/`ASSIMILATED`. | `uap_manager.py:45` | 3 rows stuck in `CURRENT` right now; their `5_RESEARCH` clones are never reclaimed (disk leak) |
| **H2** | **The crash handler marks the wrong repo FAILED.** `ORDER BY id LIMIT 1` sorts by repo *name*, not recency; if the auditor throws, the failing row is still `PENDING` and out of scope, so an unrelated healthy in-flight repo is destroyed. | `uap_manager.py:70` | `FAILED` is terminal (H1) → that work is unrecoverable |
| **H3** | **`_read_source_files` never recurses** — no `rglob`, only exact paths and one-level `iterdir()`. | `02_auditor.py:104` | **189/949 audit reports (20%) extracted zero source**, 148 of them from *successful* clones — incl. `anthropics/claude-code` (153 files → 0) |
| **H4** | **Security guard skips `.github/` entirely.** `if "/.git" in root` is a substring test, so `/.github/workflows` matches. | `02b_security_guard.py:86` | Verified: `/repo/.github/workflows → skip=True`. The #1 supply-chain vector is unscanned. The `_SCAN_EXTS` filter additionally skips `Dockerfile`, `Makefile`, `.env`, `.ipynb`, `.toml`, `.rs`, `.java`, `.html` |
| **H5** | **Gemini API key is placed in the URL and leaked on error.** `HTTPError.__str__` includes the request URL. | `03_assimilator.py:181,472` | On any 4xx/5xx the full key is printed to stdout and into `3_MEMORY/logs/daemons.log` |
| **H6** | **129 rows are `COMPLETED` with no knowledge item**, because a missing KI is converted into success. | `04_creator.py:129` | `if not ki_path.exists(): status='CREATED'`. No reconciliation exists anywhere; these can never be regenerated (H1) |
| **H7** | **The vector index goes stale silently and never self-heals.** The only rebuild trigger is the file being *absent*. No mtime check, no doc-count check, no caller anywhere in the repo. | `vector_memory.py:125` | `3_MEMORY/README.md` claims it "self-heals" — that documentation is wrong. New KIs are invisible to search forever |
| **H8** | **9 of 11 connectors mislabel reports with the wrong domain.** When `--url` is supplied without `--domain`, the domain falls back to `config.defaults.target_domain`. | `schema_validator.py:177` + 8 others | Verified live: scanning `example.com` produced `seo_exports/seosona.com/schema_report_seosona.com_*`. For an agency serving multiple clients this is cross-contaminated deliverables |
| **H9** | **9 of 11 connectors crash on a malformed `config.json`** with a raw traceback (no `try/except` around `json.load`). | all `load_config()` | Verified live via chaos test |
| **H10** | **The most-invoked component has zero tests.** `seosona_capability_bridge.js` runs on every prompt via the hook and is the routing brain. | — | Also untested: `classifier`, `uap_manager`, `03_assimilator`, `context_engine`, `project_connector`, `brain-inject` |
| **H11** | **CI is green but exercises almost nothing.** It installs only `pytest`; `sklearn`/`pandas` are absent, so the brain test `importorskip`s and the entire pipeline + connector surface is never run. | `.github/workflows/ci.yml` | CI passing is not evidence the system works |
| **H12** | **`github_sync_daemon.py` has never run.** It queries `last_commit_hash`, a column that does not exist. | `github_sync_daemon.py:30` | `sqlite3.OperationalError: no such column` on import path |

---

## 6. Findings — MEDIUM

- **M1 — No index on `queue.status`.** Every stage filters on it; ~285k row reads per 50-loop run. Harmless at 951 rows, pathological at the 10k this is designed for. One `CREATE INDEX` fixes it.
- **M2 — SQLite hygiene.** No WAL, no `busy_timeout`, no transactions, and 5 of 6 stages close the connection outside `try/finally` — on Windows an escaped exception leaves the DB locked.
- **M3 — Classifier substring matching is 89% noise.** `_UAP_TOKENS` contains `"ast"`, matched as a substring against filenames: 175 of 197 self-upgrade entries were triggered by files like `Toast.tsx`. Same class of bug for `"motion"` (matches *promotion*), `"render"`, `"component"`.
- **M4 — Security-guard accuracy.** False *positives* on canonical doc samples (AWS's own `AKIAIOSFODNN7EXAMPLE`, jwt.io's sample token). False *negatives* on RS256 JWTs, reordered JWT headers, `eval(atob(...))`, `exec(base64.b64decode(...))`, U+202E trojan-source bidi override (CVE-2021-42574), and every modern token prefix (`sk-ant-`, `sk-proj-`, `xox[baprs]-`, `ghp_`/`gho_`/`github_pat_`, `-----BEGIN PRIVATE KEY-----`).
- **M5 — A HARD block is indistinguishable from success.** The guard sets blocked repos to `CREATED`, which flows to `COMPLETED`. A `BLOCKED` status already exists and is used elsewhere. The block is recorded only on stdout — there is no durable record of what was ever hard-blocked, and the audit report containing the malicious source is retained forever.
- **M6 — JSON ledgers are non-atomic and unlocked.** `uap_versions.json` (777 entries) is rewritten in full per repo with a bare `write_text`; a crash truncates the entire dedup ledger.
- **M7 — No retry/backoff or cost control on LLM calls.** A single transient 429 silently demotes a repo to the always-succeeding Tier-3 code analysis; the junk KI is committed and can never be redone. No token budget, no spend cap, no record of which tier produced a KI.
- **M8 — Persistence is split incoherently.** The queue DB and audit reports are gitignored; the KIs and version ledger are tracked. On a fresh clone, `uap_versions.json` claims 777 repos are ingested while the queue tracking them does not exist. This split is the likely cause of H6's 129 orphans.
- **M9 — 645 `print()` calls, no structured logging.** No levels, no correlation ids, no rotation. Diagnosing a failed nightly run means reading raw stdout.
- **M10 — Single-tenant by construction.** `config.json` holds one `target_domain`; there is no client/profile concept and `seo_exports/` has exactly one folder. An SEO OS that cannot cleanly serve two clients at once is a product-level constraint, not just a code smell.

---

## 7. What is genuinely good

An audit that only lists defects is misleading. These held up under adversarial testing:

- **Path confinement is solid.** 6 traversal vectors (`../..`, absolute Windows paths, UNC `//server/share`, mixed separators) were all correctly rejected by `dispatcher.resolve_path`.
- **The vector index self-heals from corruption.** Overwriting `ki_tfidf.joblib` with garbage → the brain detected it, rebuilt, and answered correctly.
- **Hooks fail open.** Deleting the router entirely: the bridge exits 1 (loud, correct) while `brain-inject` exits 0 silently — the prompt is never blocked by a broken brain.
- **Secrets hygiene at rest.** `.env` is gitignored, only `.env.example` files are tracked, and a regex sweep over all 8,803 tracked files found **zero** live credentials.
- **Repo weight is well managed.** 745 MB on disk but only 37 MB of git and 8,803 tracked files — ~700 MB of skill assets and binaries are correctly gitignored, so a clone stays lean.
- **Zero syntax errors** across 136 source files, and **0 TODO/FIXME/HACK** markers.
- **Only 2 bare `except:`** in 15k lines of Python.

---

## 8. Recommendations

### Tier 0 — Do this week (correctness of controls you already believe you have)
1. **`RED_FLAGS = _sec.HARD_FLAGS + _sec.SOFT_FLAGS`** + a test asserting it is non-empty. *(C1 — one line)*
2. **Add `requirements.txt`** and pin it; make `.mcp.json` use an explicit interpreter path or a venv. Make the knowledge server **fail loudly** in degraded mode instead of returning empty success. *(C2)*
3. **Fix the clone failure path** — temp dir + `os.replace`, `timeout=600`, `GIT_TERMINAL_PROMPT=0`, and refuse `AUDITED` on `total_files == 0`. *(C3)*
4. **`.git` component match** instead of substring, so `.github/` is scanned; extend `_SCAN_EXTS` to extension-less and config files. *(H4)*
5. **Move the Gemini key to the `x-goog-api-key` header** and redact `key=` in error paths. *(H5)*

### Tier 1 — This month (make failure states recoverable)
6. Drive the manager on `status NOT IN ('COMPLETED','BLOCKED')` with a per-status handler; sweep `FAILED`+`retry<3` → `PENDING`; add `CURRENT`/`BLOCKED` to the cleanup selector. *(H1, H2)*
7. Missing KI → `FAILED`, plus a `--reconcile` mode that requeues any `COMPLETED` row without its artefact. *(H6)*
8. Stamp `max(mtime)` of the KI dir into the index payload and rebuild when it moves; correct `3_MEMORY/README.md`. *(H7)*
9. Derive the report domain from `--url` when supplied, and wrap `load_config` in `try/except` with a clear message. *(H8, H9)*
10. `CREATE INDEX idx_queue_status`, `PRAGMA journal_mode=WAL`, `timeout=30`, `contextlib.closing`. *(M1, M2)*

### Tier 2 — This quarter (make the system provable)
11. **Test the bridge.** It is the single most-invoked component and has no tests — route scoring, the floor guard, portability, and the Vietnamese expansion all deserve cases. Target 25% overall coverage. *(H10)*
12. **Make CI meaningful** — install the real dependency set so the brain, classifier and connector paths actually execute. A green build should mean something. *(H11)*
13. **Add `rglob` fallback** to `_read_source_files`, then re-ingest the 148 zero-source repos. Roughly 20% of the corpus is currently built on nothing. *(H3)*
14. **Structured logging** with levels and rotation, replacing 645 `print()` calls. *(M9)*
15. **Word-boundary matching** in the classifier. *(M3)*

### Tier 3 — Strategic (product-level)
16. **Multi-tenant model.** Introduce a client/profile concept: `config.clients[]`, `seo_exports/<client>/<date>/`, and a `--client` flag across connectors. This is the difference between a personal tool and something an agency can run. *(M10)*
17. **Provenance metadata on KIs.** Add frontmatter recording source repo, ingest date, analysis tier and fit score — then filter the ~189 junk KIs out of retrieval instead of serving them as knowledge.
18. **Container sandbox by default.** The Docker backend exists but is opt-in; on a machine with a daemon it should be the default for vendored code, given C4's injection surface.
19. **Cost governance for LLM ingestion** — per-run budget, spend logging, and refusing to overwrite a high-tier KI with a Tier-3 stub.

---

## 9. Additional CRITICAL findings (deep subsystem review)

### C5 — Unauthenticated pickle load = persistent RCE
`vector_memory.py:107` — `joblib.load(INDEX_FILE)` is pickle, i.e. arbitrary code execution. The index is **gitignored** (never reviewed, never diffed), **auto-regenerates** (a planted file is indistinguishable from normal operation), and the sandbox explicitly provides **no absolute-path filesystem confinement** — so a vendored skill can write the index and win. The payload then executes **unsandboxed, with full env including API keys**, inside the MCP server that starts every session. *Fix: persist via `scipy.sparse.save_npz` + JSON, or HMAC the file.*

### C6 — `safe_urlopen`'s redirect loop was dead code *(fixed this session — my own regression)*
`build_opener(pinned_handler)` still installs the stock `HTTPRedirectHandler`, which consumes 3xx **inside** `opener.open()`. The manual re-validate loop never ran; redirects were followed unvalidated, and a scheme switch left the pinned transport entirely. Proven end-to-end by the auditor: a public first hop 302'd to an internal host and returned its body, with `Authorization: Bearer …` forwarded intact. **Fixed and verified.**

### C7 — Third-party `SKILL.md` can forge repo-escaping routes *(fixed this session)*
`plugin_manager` wrote YAML `name:` into the router unescaped; the bridge parses it with a backtick regex. A crafted `name:` produced a manifest entry with `portablePath: ~/.seosona/../../../../../Windows/System32/drivers/etc/` **plus injected routing keywords** so the bogus route surfaces on ordinary queries. **Fixed and verified.**

### C8 — CLI destroys user IDE settings
`cli/src/globalSetup.js:15` — `github.copilot.chat.codeGeneration.instructions` is an **array of objects**; `.includes("SEOSONA")` returns false, and the array is replaced with a string (wrong type, data gone). Proven: a user's 3-month-tuned `cline.customInstructions` and Copilot instruction array were both destroyed. No backup, no atomic write, JSONC not handled.

### C9 — `project_connector` writes outside the project, and at drive root
`syncRules` writes every `manifest.ruleFiles` entry unvalidated — proven `"../../ESCAPED.md"` landed outside the project. `memoryNamespace` is equally unvalidated — proven `"../../../../PWNED-NAMESPACE"` created a directory tree with attacker-controlled file content at **`D:\`**.

## 10. Additional HIGH findings

- **The sandbox has zero live call sites.** `buildGraphResources()` yields **0 runnable paths**, so `dispatch_match` always returns guidance; `run_sandboxed` is never reached in production. The entire security narrative in `dispatcher.py:7-15` describes machinery no live path exercises.
- **The sandbox's malware scan cannot detect malware.** It blocks only `HARD` flags = leaked credentials. `rm -rf /` and `curl … | sh` are `SOFT` — explicitly documented as "never blocked" because "UAP only reads repos, never runs them". But this is the module that *runs* them.
- **`is_side_effecting` flags 3 scripts out of ~70.** Not flagged: `telegram_connector`, `ga4/gsc/backlink/psi/rank_tracker/keyword` connectors, `api_gateway`. Basename-only, so `deploy/orchestrator.py` passes.
- **Any filename with a 2+ letter extension is treated as a domain.** `"review readme.md"` → domain `readme.md` → with `--execute` this launches the 18-step audit (PSI/GSC/GA4/SERP/backlinks) against `readme.md`, spending real API quota. The audit path also bypasses `is_side_effecting` entirely.
- **RRF `k=60` over a 50-doc pool inverts the ranking** — a doc ranked 50th in *both* signals outscores the #1 exact match. And the emitted `score` is the raw cosine, not the sort key, so results are non-monotonic in their own score.
- **Route scoring is unbounded substring matching.** `"os"` matches *Prop**os**al Writer*; `"ai"` matches *c-**ai**-mpaign*. `confidence` is `score/termCount`, so one accidental substring hit on a 1-term query reports **100%**. Terms are never deduped: `route('audit audit audit')` scores 3× `route('audit')`.
- **Portability audit is blind** to `C:\temp`, `C:\node_modules`, `C:\ruby` — the `(?!n|r|t)` meant to skip escapes filters on the path's first character. `validate()` reports `portability.ok: true` with hardcoded paths in the tree.
- **Vector-memory output leaks absolute machine paths** for satellite documents (`d:/SEOSONA AI/SEOSONA Content/…`) straight into LLM context — violating the OS's own "no hardcoded paths" rule, and invisible to the file-based portability scan.
- **Docker sandbox is broken on Windows** — `-v "D:\…:/skill:ro"` has a drive-letter colon; Docker splits on `:` into 4 fields. The only real isolation the module offers cannot start on the primary platform. The image also comes from an env var placed *positionally*, so a value beginning with `-` becomes a Docker flag.
- **POSIX sandbox limits are wrong**: `RLIMIT_AS` 1 GiB breaks Node (V8 reserves multi-GiB of *virtual* space); `os.setsid()` **detaches** grandchildren so `subprocess.run(timeout=…)` kills only the leader — the opposite of the docstring's claim; `RLIMIT_NPROC` is per-UID, not per-process.

## 11. Connector correctness — the product's core value is misreporting

These make SEO deliverables **actively wrong**, which matters more than any crash:

| Bug | Effect |
| :--- | :--- |
| `robots.txt` checked with substring, not line, match | A site with `Disallow: /private/` is reported **"🔴 Critical: robots.txt blocks ALL crawlers"** |
| Schema validator never traverses `@graph` | Yoast/RankMath (most of WordPress) → *"Missing @type"* + all 8 schemas reported missing, on sites that have them |
| Valueless attributes (`<meta name>`, `<a href>`) → `AttributeError` | **One malformed tag aborts the entire scan** |
| Relative links (`/about`) counted as neither internal nor external | Internal-link analysis silently wrong on every site |
| E-E-A-T author regex matches `by` inside any word | `has_author: True` from the word "Near**by**"; scores inflated on essentially every site |
| `<time datetime=` regex has a **literal space** in the capture group | Freshness always `Unknown` |
| Common Crawl query `url=*.{domain}` | Returns the site's **own pages** as "referring domains" — the whole backlink source measures the wrong thing |
| `analyze_keyword_overlap` is a stub | Every keyword shipped as `"content_gap": "Yes"`, competitors `"Check manually"` — fabricated findings in a customer report |
| `direct_answers` structurally always 0 | 25 of 100 AEO points unreachable |
| Hardcoded VN competitor domains + Vietnamese slugs | `nguyenkim.com`, `tinhte.vn`, `/san-pham` appear in **every** customer's report |

## 12. Closing assessment

The system's **engineering instincts are better than its engineering discipline**. Fail-open hooks, path confinement, a security guard, a sandbox, an integrity guard, portable paths — these are the choices of someone who has thought carefully about how things break. But several of those controls were never verified after being written, and two of them (`_scan_output`, the retry ladder) have never executed a single line of their intended logic.

The single highest-leverage change is not any individual fix: it is **making CI install the real dependencies and exercise the real paths**. Every critical finding in this report would have surfaced on the first run of a CI that actually ran the code.

---

## 13. Remediation log

Every fix below was verified by execution — the before/after evidence is in the commit messages.

### Closed — all 9 CRITICAL

| ID | Fix | Verification |
| :--- | :--- | :--- |
| C1 | UAP output gate iterated an empty pattern list (`RED_FLAGS` never existed) | 0 → 13 patterns; now detects an AWS key. `assert` added so it cannot silently empty again |
| C2 | No `requirements.txt`; brain returned empty and reported success | Pinned manifest added; no-sklearn path now returns 5 correct results with `backend: lexical_degraded` + a warning on stderr |
| C3 | Failed clone ingested as a valid empty repo; retry ladder unreachable | `mkdir`-before-clone removed, `rmtree` on failure, `timeout=600`, `GIT_TERMINAL_PROMPT=0`, empty checkouts refused |
| C4 | Repo → LLM → KI → auto-injected context, with no output filter | Mitigated by restoring C1; delimiting untrusted content remains open |
| C5 | `joblib.load` = pickle = persistent RCE in the MCP server | Index is now `.npz` + JSON; a planted pickle with `__reduce__ → os.system` is not read at all |
| C6 | `safe_urlopen`'s redirect loop was dead code (self-inflicted this session) | `_RaiseOnRedirect` forces the manual loop; both transports pinned per hop; auth headers stripped cross-origin |
| C7 | Third-party `SKILL.md` could forge repo-escaping routes | Structural characters stripped, containment checked; router now byte-identical across 3 hash seeds |
| C8 | `seosona setup` destroyed IDE settings (array replaced with string) | Type-aware merge; Copilot array keeps its entries; `.seosona-backup` + temp-file rename |
| C9 | Project manifest wrote outside the project and at drive root | `../../ESCAPED.md`, `/etc/passwd` and absolute paths all rejected; hand-authored files backed up |

### Closed — HIGH / product correctness

- **Connector cluster** — robots.txt substring → line parse with User-agent scoping; `@graph`
  traversal (Yoast/RankMath now read correctly); valueless-attribute crash that aborted whole scans;
  relative links counted as internal; E-E-A-T `by`-inside-words and the literal space in the `<time>`
  regex; serp suggestion parsing returning single characters; and `analyze_keyword_overlap`, which
  asserted "content gap: Yes" for every keyword **without consulting a single SERP** — now reported
  as Unverified.
- **8 connectors** no longer crash on a malformed `config.json`.
- **Source extraction** — `_read_source_files` never recursed; 148 successfully-cloned repos
  extracted zero source. Bounded `os.walk` fallback added.
- **Reconciliation** — `uap_manager --reconcile` compares queue state against artefacts on disk.
  First run found 3 stranded mid-flight rows and 127 `COMPLETED` rows with no knowledge item.
- **Routing** — 111 placeholder `name: skill` values, an over-broad boost that let a meta-skill
  hijack every "audit" query, Vietnamese queries matching nothing, and un-deduplicated terms letting
  repetition inflate the score.
- **Observability** — the brain reports degraded mode instead of looking empty; the vector index
  detects a changed corpus instead of going stale forever.

### Test and CI posture

```
tests      24 → 41      (+11 capability bridge, +3 index-is-not-pickle, +3 routing)
CI         installs requirements.txt; asserts the brain answers via the real backend;
           asserts SKILLS_ROUTER.md is reproducible from source
```
The bridge — the most-invoked component in the OS — had no tests at all. Writing them immediately
surfaced a live defect (term deduplication), which is the argument for the whole exercise.

### Still open

| Item | Why it remains |
| :--- | :--- |
| 123 repos sitting at PENDING | Deferred by the owner — each costs an LLM call. Run `python 1_CORE/scripts/uap_pipeline/uap_manager.py` when ready |
| Real backlink discovery | The CDX index cannot return referring domains; it needs WARC payload parsing or a paid backlink API. The section is now labelled honestly rather than fabricating one |
| Sandbox has no live call sites | `buildGraphResources()` yields zero runnable paths, so `run_sandboxed` is never reached in production. Wiring skill entrypoints into the graph is a design change, and the sandbox is correct and tested for when it is |
| Sandbox scan blocks credentials, not behaviour | `curl \| sh` is classified SOFT because the ingest guard was calibrated for a read-only context. Reclassifying it changes ingest behaviour too — worth doing deliberately, not as a side effect |
| Multi-tenant model | `config.json` holds one `target_domain`; an agency serving two clients needs `config.clients[]` and `seo_exports/<client>/`. A product decision |
| 645 `print()` calls | Mechanical but repo-wide; worth one focused pass with a real logger |
