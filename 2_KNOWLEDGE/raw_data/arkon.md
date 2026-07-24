# Ingested Knowledge: arkon

Source: https://github.com/nduckmink/arkon
Ingestion Date: 2026-06-23T09:15:44.876Z



--- FILE: .claude\settings.json ---

{
  "permissions": {
    "allow": [
      "Bash(rtk tree *)",
      "Bash(rtk grep *)",
      "Bash(Get-ChildItem -Path \"d:\\\\arkon\\\\frontend\\\\src\" -Recurse -Directory)",
      "Bash(Select-Object FullName)",
      "Bash(Get-ChildItem -Path \"d:\\\\arkon\\\\frontend\\\\src\\\\components\" -Directory)",
      "Bash(Select-Object -ExpandProperty Name)",
      "PowerShell(head -50)",
      "Bash(Get-ChildItem -Path \"d:\\\\arkon\\\\frontend\\\\src\\\\app\\\\\\(portal\\)\" -Recurse)",
      "Bash(Select-Object -ExpandProperty FullName)",
      "Bash(Sort-Object)",
      "Bash(npm install *)",
      "Bash(rtk tsc *)",
      "Bash(rtk ls *)",
      "Bash(rtk find *)",
      "Bash(Get-ChildItem -Path \"d:\\\\arkon\\\\llm_wiki-main\")",
      "Bash(Select-Object -First 20)",
      "Bash(xargs ls *)",
      "Bash(xargs grep *)",
      "Bash(rtk wc *)",
      "Bash(rtk git *)",
      "Bash(rtk read *)",
      "Bash(python -c \"import json,sys; p=json.load\\(sys.stdin\\); deps={**p.get\\('dependencies',{}\\), **p.get\\('devDependencies',{}\\)}; [print\\(k,v\\) for k,v in sorted\\(deps.items\\(\\)\\) if any\\(x in k.lower\\(\\) for x in ['editor','markdown','codemirror','monaco','tiptap','prose','quill','slate']\\)]\")",
      "Bash(Find D:\\\\arkon\\\\frontend\\\\src -type f -name \"*layout.tsx\")",
      "Bash(Get-ChildItem -Path \"D:\\\\arkon\\\\frontend\\\\src\" -Recurse -Filter \"*auth*\" -File)",
      "Bash(rtk docker *)",
      "Bash(rtk pytest *)",
      "Bash(rtk ruff *)",
      "Bash(rtk npx *)",
      "Bash(Move-Item 'd:\\\\arkon\\\\.claude\\\\skills\\\\arkon-query\\\\SKILL.md' 'd:\\\\arkon\\\\skills\\\\arkon-query\\\\SKILL.md')",
      "Bash(Move-Item 'd:\\\\arkon\\\\.claude\\\\skills\\\\arkon-edit\\\\SKILL.md' 'd:\\\\arkon\\\\skills\\\\arkon-edit\\\\SKILL.md')",
      "Bash(Move-Item 'd:\\\\arkon\\\\.claude\\\\skills\\\\arkon-review\\\\SKILL.md' 'd:\\\\arkon\\\\skills\\\\arkon-review\\\\SKILL.md')",
      "Bash(Remove-Item -Recurse 'd:\\\\arkon\\\\.claude\\\\skills')",
      "Bash(rtk proxy *)",
      "Bash(rtk head *)",
      "Bash(rtk alembic *)"
    ]
  },
  "enabledPlugins": {
    "frontend-design@claude-plugins-official": true,
    "claude-md-management@claude-plugins-official": true
  }
}


--- FILE: .claude\settings.local.json ---

{
  "permissions": {
    "allow": [
      "Bash(npx tsc *)"
    ]
  }
}


--- FILE: CHANGELOG.md ---

# Changelog

All notable changes to Arkon are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

### Changed

- **MCP `tools/list` now scopes by bearer-token identity.** Reviewer- and
  contributor-tier tools no longer appear in the catalog for callers who
  couldn't use them. Read-only employees see the read surface only;
  workspace contributors additionally see propose/resubmit/withdraw;
  workspace editors and `wiki:write:all` holders see the review queue
  and direct-write tools; admins see everything. Unauthenticated and
  invalid-token callers see only the read surface, with an
  "Authenticate to use" hint prepended to each tool description so the
  client can guide the user back to token configuration. Implemented as
  a FastMCP middleware (`ScopedToolsMiddleware`) reading a per-tool
  `ToolRequirement` declared via the new `@kb_tool` decorator —
  per-resource checks inside tool bodies are unchanged and remain the
  security boundary. Role changes require an MCP reconnect to take
  effect.
- `ResolvedIdentity` now carries `workspace_roles: dict[str, str]`
  (workspace_id → role) so visibility predicates run without an extra
  DB round-trip per `tools/list`.

---

## [0.7.4] — 2026-05-20

Member-management overhaul, dedicated wiki review console, and an MCP
scope-leak fix that had been making project-scoped wiki pages invisible
to their own workspace members. Three new features and two bug fixes
on top of the 0.7.3 critical-review pass.

### Added

- **Dedicated 3-pane wiki review console at `/wiki/review`** — built for
  high-volume reviewers who would otherwise burn one full page navigation
  per draft. Left pane lists the queue with `To review` / `Mine` scope
  toggle and status filter; center pane shows the diff / proposed /
  current tabs with a compare-with dropdown across sibling drafts on the
  same page; right pane carries author stats, AI pre-review verdict, and
  the action stack. URL state (`?draft=&status=&mine=`) is the source of
  truth so deep links and browser history work. Keyboard shortcuts:
  `j`/`k` next-prev, `a` approve, `c` request changes, `r` reject,
  `Esc` cancel, `?` help overlay. The existing `WikiDraftBanner` on
  `/wiki/[slug]` is intentionally kept for casual reviewers.
- **Bulk workspace member invite** — typeahead + chips multi-select
  replaces the one-add-per-click picker. Type to filter by name/email,
  `↑↓` navigate, `Enter` pick, `Backspace` pop the last chip. A single
  role applies to the whole batch. New backend endpoint
  `POST /api/projects/{id}/members/bulk` accepts `{employee_ids, role}`
  and processes each row in its own SAVEPOINT so a duplicate /
  IntegrityError / missing employee in the batch doesn't poison the
  rest. Chips for errored employees stay in the input so admins can
  fix and retry without re-typing.
- **Workspace-scoped candidate endpoints** — `GET
  /api/projects/{id}/members/candidates` (workspace admin) and
  `GET /api/projects/{id}/sources/candidates` (workspace editor+) return
  not-yet-linked employees / sources with `?search=` substring filter.
  Replaces the previous frontend dependency on the org-wide
  `/api/employees` / `/api/sources` lists.
- **Out-of-scope discovery hint in MCP** — when a non-admin caller's
  `search_wiki` query matches pages in a department or workspace they
  can't access, the response appends an "Out-of-scope matches" section
  listing `(scope_label, count)` groups (e.g. "3 page(s) in department
  HR — contact the HR admin to request access"). `read_wiki_page` does
  the same when the slug exists in an inaccessible scope. The hint
  leaks **only** scope label + count — titles and content are never
  surfaced across a permission boundary.
- **Scrollable + filterable scope legend on the wiki graph** — the
  `Scope` section grows a `Filter scopes…` input and a `max-h-44` scroll
  cap once it has more than 8 entries. Below that threshold it stays
  identical to before. Header shows `visible/total` while filtering.

### Fixed

- **Project-scope blindspot in wiki read path** — the MCP wiki layer
  filtered visible pages with a `global + own_dept` OR-clause that
  completely omitted project-scoped pages, even for the workspace's
  own members. `search_wiki` returned 0 hits against pages a user
  obviously had access to, forcing them to drill into raw sources to
  discover the wiki page existed. New helper
  `_scope_filter_for_identity(department_id, project_ids)` ORs the
  third branch in; `ResolvedIdentity` carries a `project_ids` list
  populated from active workspace memberships. `search_pages_semantic`,
  `list_pages`, and `read_wiki_page` all updated. Incidental: admins
  were also being scope-filtered to own_dept — `all_scopes=True` now
  bypasses the filter entirely for admin identities.
- **Workspace admins couldn't open their own workspace** — the project
  detail page fetched `/api/employees?page_size=500` to populate the
  picker, which required `org:employees:read` — a permission workspace
  admins do not have. The 403 sank the `Promise.all` and showed
  "Failed to load project details" with no fallback. Fixed by swapping
  to the new candidate endpoints, using `Promise.allSettled` so a 403
  on the side fetches no longer kills the page, and computing
  `canAdminWorkspace = isOrgAdmin || workspaceRole === 'admin'` so the
  picker UI shows for workspace admins who aren't org admins.

### Docs

- `docs/ACCESS-CONTROL.md`, `docs/WIKI.md`, `docs/ARCHITECTURE.md`,
  `docs/MCP.md` all caught up: project-scope OR branch documented,
  AI pre-review (L1→L4) + resubmit race guard + stuck-running sweep,
  review console layout + shortcuts, token hashing at rest + forced
  rotation after migration 027, draft state machine with the
  needs_revision loop, new worker tasks and cron jobs, OOS hint
  format, and updated data-model section.

---

## [0.7.3] — 2026-05-20

Follow-up critical review on top of 0.7.2 — three concurrency / data-loss
issues uncovered by re-reading the AI pre-review path, bulk-approve loop,
and approve_draft scope parser after the 0.7.2 fixes settled.

### Fixed

- **AI pre-review stale verdict on resubmit** — the L3/L4 worker
  could finish a check pass against the OLD `content_md` of a draft
  that the author had already resubmitted, then overwrite the newer
  worker's verdict on commit. The submit path now passes
  `revision_round` to the job, and the runner `refresh()`-es the draft
  immediately before writing its verdict — if the round has bumped it
  drops the stale result. A newer worker is already queued for the
  new content.
- **Bulk approve ORM identity-map pollution** — `db.begin_nested()`
  correctly rolled back the SAVEPOINT in Postgres on a per-draft
  failure, but SQLAlchemy does NOT revert in-memory attribute
  mutations on persistent objects when a savepoint rolls back. A
  failed approve would leave `page.version = N+1` / `draft.status =
  "approved"` on the still-attached instances, polluting the next
  iteration that touched the same page (wrong version label,
  miscounted notification). The router now `db.expire(draft, page)`
  in the savepoint's except branch so a fresh load reads true DB state.
- **`scope_id` parse crashed on non-string non-UUID values** —
  `wiki_service.approve_draft` only caught `ValueError` when reading
  `suggested_metadata.scope_id`. Hand-crafted or migrated rows with
  e.g. an int there would `TypeError` in `uuid.UUID(...)` and surface
  as a 500. Now catches `(ValueError, TypeError)` and `isinstance`-
  validates, matching the defensive parse in
  `wiki_drafts._can_review_draft`.

### Added

- **`sweep_stuck_ai_review_cron`** — runs every 10 minutes; resets any
  draft stuck in `ai_check_status="running"` for more than
  `2 × worker_job_timeout` (min 30 min) back to `"skipped"`. Catches
  the case where the AI worker process is SIGKILL/OOM-killed AFTER
  committing `running` but BEFORE finishing the check pass — the
  in-worker try/except can't run during a hard process death, so
  without the sweep the UI would show a perpetual spinner. The
  `ai_pre_review_draft_task` signature is backwards-compatible:
  jobs enqueued by older code (without `expected_round`) still run
  to completion but skip the race guard.

---

## [0.7.2] — 2026-05-20

Critical-review batch: data-integrity, race, and security findings from a
fresh audit of the draft lifecycle, MCP auth, and AI pre-review surfaces.

### Security

- **MCP tokens hashed at rest (migration 027)** — `employees.mcp_token` was
  stored in plaintext and looked up via direct equality. A DB read therefore
  exposed every active token. New columns `mcp_token_hash`
  (HMAC-SHA256+pepper), `mcp_token_prefix` (UI display), and
  `mcp_token_rotated_at` replace the lookup path. The migration NULLs every
  existing plaintext token so **all users must rotate their MCP token via
  the portal after deploy**. Configure `MCP_TOKEN_PEPPER` in env before
  rolling out. Self-service `POST /my/mcp-token` now always issues a fresh
  token (no read-back path).

### Fixed

- **`bulk_approve_drafts` poisoned session** — when one draft's approve
  raised mid-flush, the outer AsyncSession entered a `PendingRollbackError`
  state and silently failed every subsequent iteration. Each draft now runs
  inside its own SAVEPOINT (`db.begin_nested()`), so a single failure
  rolls back only that draft and the rest of the batch commits cleanly.
- **`approve_draft` lost-update race** — two reviewers approving distinct
  drafts on the same page could both observe `version=N` before the
  advisory lock and then race to write `N+1`. The page row is now
  `session.refresh()`-ed inside the locked critical section so writers
  see committed state.
- **`scope_id` parsing crash on non-string values** — `_can_review_draft`
  and `_enqueue_ai_review` now catch `TypeError` and reject non-UUID
  values defensively instead of leaking junk down to `get_workspace_role`.

### Changed

- **AI pre-review fully async** — submit/resubmit no longer runs any check
  layer inline. The arq worker now executes L1 (regex), L2 (structural),
  L3 (semantic), and L4 (LLM) end-to-end. Drafts initially surface as
  `ai_check_status="queued"`; if Redis is unreachable the status flips to
  `"skipped"` rather than getting stuck on `"running"`. Eliminates the
  per-request LLM call that previously held a FastAPI worker for seconds
  on every draft submission.
- **MCP `last_connected` debounced** — the auth path used to issue a
  `UPDATE employees SET last_connected = now()` + `COMMIT` on every tool
  call, generating one DB write per Claude Desktop request. Updates are
  now rate-limited to once per 60 s per employee; the commit is also
  skipped entirely when no write occurred.
- **Sibling-draft notifications batched** — `notify_approved` now uses a
  new `notify_each` helper to emit all cross-author notifications in a
  single `add_all` instead of N round-trips.
- **MCP `create_wiki_page` whitespace check** — added the `isspace`
  guard that `propose_wiki_create` already had, plus consistent
  `slug.strip()` at both entry points.

### Notes

- Item "project-membership grants access regardless of
  `allowed_knowledge_types`" was confirmed as **intent** during review.
  `apply_scope_filter`'s docstring now explicitly says so to deter a
  future accidental flip to AND semantics.

---

## [0.7.1] — 2026-05-20

Hotfix for a race condition in the MRP REFINE phase that surfaced while
compiling longer source documents (observed on
`meeting-notes-260519-2124-chien…`). No schema migration, no API change.

### Fixed

- **MRP REFINE concurrent-session race** — Phase 3 fanned out up to
  `MAX_WRITER_CONCURRENCY` page writers via `asyncio.gather`, all
  sharing the orchestrator's single `AsyncSession`. SQLAlchemy
  `AsyncSession` is not safe for concurrent use, so simultaneous
  `get_page_by_slug` lookups (UPDATE fetches plus the `read_kb_page`
  tool inside the complex writer's agent loop) raced and corrupted
  the session, causing intermittent draft generation failures on
  documents with several UPDATE pages or a large existing wiki.
  Each `_write_one` now opens its own session from
  `async_session_factory`; the orchestrator's session is reserved for
  the final `plan.plan_json` commit.

---

## [0.7.0] — 2026-05-19

Scaling the contribute/review workflow: review queue + bulk approve, author
trust signals, expertise-based reviewer routing, outline-aware diff,
gap-to-page deep-link, and external notification channels (email + webhook).
No schema migration — all features build on existing tables.

### Added

- **Review queue page (`/wiki/queue`)** listing every draft the current
  user can review across scopes, with status filter (pending /
  needs_revision / approved / rejected). Supports multi-select +
  bulk-approve; per-draft AI status chip, author trust chip, revision
  round, and submission age. Header button on `/wiki` deep-links here.
- **Bulk approve endpoint** `POST /wiki/drafts/bulk-approve` — processes
  each draft independently (per-item conflict / permission / not-found
  handling), commits the batch, and emits notifications for the
  approved set. Result payload reports approved / skipped / errored
  counts plus per-item messages.
- **Author trust signals** — `DraftResponse.author_stats` now exposes
  `{approved, rejected, needs_revision, total_reviewed, accuracy}` over
  the author's lifetime drafts. Banner and queue both render a chip
  coloured by tier (high / ok / low) with hover-tooltip detail.
- **Expertise-based reviewer suggestions** —
  `DraftResponse.suggested_reviewers` lists up to 3 employees ranked by
  past edit / approval activity on pages with overlapping
  `knowledge_type_slugs` OR in the same scope. Banner surfaces them so
  reviewers know who normally handles a topic.
- **Outline-aware diff view** — `WikiDraftDiff` groups hunks under their
  nearest preceding heading. Unchanged sections collapse automatically;
  changed sections stay open and are flagged in the section header.
  Pre-heading content (intro / frontmatter) renders ungrouped.
- **Knowledge-gap deep link** — the `/admin/statistics` Gaps tab's
  "Create draft →" link routes to `/wiki?new=1&title=<topic>`, which now
  auto-opens the create dialog with the gap topic pre-filled in the
  title field.
- **External notification channels (permissive)**
  - **Email (SMTP)**: per-recipient delivery; multiple notifications in
    the same request are batched into one email. Configured via
    `smtp_enabled / smtp_host / smtp_port / smtp_username / smtp_password
    / smtp_from / smtp_use_tls` keys in `app_config`. Sensitive keys
    (`smtp_password`) are encrypted at rest via the existing
    `ConfigService` Fernet layer.
  - **Webhook (generic JSON POST)**: single endpoint receives
    `{events: [{id, type, subject, body, target_type, target_id,
    recipient_id, actor_id, created_at}]}`. Optional HMAC secret signs
    the body in `X-Arkon-Signature: sha256=<hex>`.
  - Both channels run **after request commit** via a FastAPI middleware
    that drains a per-request notification staging buffer; errors are
    logged and swallowed so the contribution flow never breaks.
  - New settings panel **Notification channels** in `/settings` lets
    admins toggle each channel, edit credentials, and save without
    leaving the page.
- New runtime dependency: `aiosmtplib>=3.0.0` for async SMTP.

### Changed

- `_can_review_draft` is now the canonical reviewer-permission check;
  bulk-approve and the new queue both route through it so create drafts
  and edit drafts behave the same way.
- `notification_service.notify` / `notify_many` automatically stage
  every created `Notification` on the current request's contextvar; no
  per-route changes required for the new dispatch path.
- `_is_sensitive(key)` in `ConfigService` recognises `smtp_password` and
  `webhook_secret` so they round-trip encrypted.

### Deferred to 0.8

- Per-event channel routing (e.g. only ship `approved` events to email,
  send everything to the webhook).
- Auto-fast-track for high-trust authors (auto-approve after N hours
  with no review). Trust signals exist; the automation does not.
- Slack/Teams-native adapters (current webhook is intentionally generic).

---

## [0.6.0] — 2026-05-19

Contribute / review vision pass. Adds an AI pre-review layer that annotates
every wiki draft (PII, broken wikilinks, duplicates, tone / factual sniff),
a side-by-side diff view in the reviewer banner, and the ability for any
contributor to propose brand-new wiki pages. Permissive throughout — the AI
flags, the human decides.

### Added

- **AI pre-review (permissive)** for wiki drafts. Four layers run on every
  submit / resubmit:
  - **L1 regex (sync)** — emails, phone numbers, national IDs, AWS / GitHub /
    Anthropic / Google API keys, JWTs, private-key blocks. Suppressible
    inline with `<!-- pii-allow: <reason> -->` markers above the match.
  - **L2 structural (sync)** — broken wikilinks, self-links, length sanity,
    non-incremental heading jumps, unclosed code fences.
  - **L3 semantic (async)** — embedding similarity vs existing pages to
    flag potential duplicates (>0.85 cosine).
  - **L4 LLM judgment (async)** — tone consistency, page_type scope fit,
    factual concerns. Uses the admin-configured LLM via `ProviderRegistry`.
  - Results land in `wiki_page_drafts.ai_check_results` JSONB with a
    `summary` and per-check entries. Status flows
    `pending` → `running` → `passed` / `warned` / `failed`. **Nothing
    blocks submission** — every flag is advisory. Disable globally with
    the `ai_pre_review_enabled` config key.
- **Async worker task** `ai_pre_review_draft_task` registered in
  `WorkerSettings.functions`. L1/L2 run inside the request; L3/L4 are
  enqueued and update the draft when done.
- **Re-run on resubmit** — every author resubmission clears the AI state,
  re-runs L1+L2 synchronously, re-enqueues L3+L4, and snapshots the prior
  round's verdict to `wiki_draft_rounds.ai_check_results` so reviewers can
  compare across rounds.
- **Unified diff view** in the reviewer banner using `jsdiff`. New “Diff”
  tab (default) renders unified ± lines with word-level highlighting for
  changed lines and collapses long unchanged runs. Edit drafts only —
  create drafts have nothing to diff against.
- **AI check panel** appended below the diff/preview area. Collapsed shows
  a one-line summary chip + tally; expanded lists every warn / fail check
  with layer, message, and up to 5 example matches.
- **`propose_wiki_create` (REST + MCP)** lets any contributor propose a
  brand-new wiki page. The draft carries the suggested
  `{slug, title, page_type, knowledge_type_slugs, scope_type, scope_id}`;
  the parent page is materialised at approve time.
- **`create_wiki_page` (REST + MCP)** lets workspace editors and global
  `wiki:write:all` holders create pages directly without going through
  review.
- **Reviewer-side metadata overrides** on approve — `final_slug`,
  `final_title`, `final_page_type`, `final_knowledge_type_slugs` —
  applied when materialising a create draft. Slug collisions surface as
  HTTP 409 with a clear hint.
- **Polling for AI status** in the draft banner: while
  `ai_check_status ∈ {pending, running}` the component polls the draft
  every 3 seconds and refreshes the panel.

### Changed

- `WikiPageDraft.page_id` is now nullable — create drafts have no parent
  page until approval materialises one.
- `_can_review_draft` replaces page-keyed reviewer checks across all
  draft endpoints so create drafts route correctly to global / workspace
  reviewers without requiring an existing page.
- The `arkon-edit` skill documents the create flow + AI pre-review +
  `pii-allow` markers; `arkon-review` documents AI verdicts and metadata
  overrides on create-draft approval.

### Migrations

- `025_ai_pre_review_and_create_drafts.py` — adds
  `ai_check_status` / `ai_check_results` / `ai_checked_at` to
  `wiki_page_drafts`; adds `ai_check_results` to `wiki_draft_rounds`;
  adds `draft_kind` and `suggested_metadata` to `wiki_page_drafts`;
  makes `wiki_page_drafts.page_id` nullable.

### Deferred to 0.7

- Gap-driven page-creation suggestions (mining `mcp_query_log` zero-result
  searches for topics worth seeding pages from).
- Email / webhook notification channels (in-app only for now).
- Bulk-approve UI and a dedicated queue page.
- Trust / reputation signals and expertise-based reviewer routing.

---

## [0.5.0] — 2026-05-19

Contribute / review hardening, foundation pass. Adds a closed feedback loop
between authors and reviewers (`needs_revision`), an in-app notification
inbox, and a unified service for contribution state transitions across wiki
drafts and skill contributions. Lays the backbone for the upcoming AI
pre-review, diff view, and `propose_create_page` work in the next release.

### Added

- **`needs_revision` state for wiki drafts and skill contributions**: a
  reviewer can now send a draft back with a note instead of being forced to
  approve or reject. The author resubmits on the same draft —
  `revision_round` increments and the prior submission is snapshotted to
  the new `wiki_draft_rounds` table so reviewers can diff between rounds.
- **`withdraw` action for authors**: an in-flight draft (pending or
  needs_revision) can be retracted by its author without a reviewer touch.
- **`ContributionService` (`app/services/contribution_service.py`)**:
  thin state-machine wrapper with `WikiDraftAdapter` and
  `SkillContributionAdapter`. Each lifecycle verb fires audit logs and
  notifications uniformly so REST and MCP entry points behave the same.
- **`NotificationService` + in-app inbox**: new `notifications` table,
  `NotificationService` writer (sync DB inserts, audit_service pattern),
  REST endpoints `GET /notifications`, `GET /notifications/unread-count`,
  `POST /notifications/{id}/read`, `POST /notifications/read-all`.
- **NotificationBell in the header**: badge + slide-in drawer with
  mark-as-read controls; polls unread count every 30s.
- **MCP tools for the new lifecycle**:
  `request_changes_on_draft`, `resubmit_draft`, `withdraw_draft`. The
  matching skills (`arkon-edit`, `arkon-review`) document the new flow.
- **REST endpoints for wiki draft lifecycle**:
  `POST /wiki/drafts/{id}/request-changes`,
  `PATCH /wiki/drafts/{id}/content` (author resubmit),
  `POST /wiki/drafts/{id}/withdraw`,
  `GET /wiki/drafts/{id}/rounds` (per-round history).
- **REST endpoints for skill contribution lifecycle**:
  `POST /skill-contributions/{id}/request-changes`,
  `POST /skill-contributions/{id}/resubmit`,
  `POST /skill-contributions/{id}/withdraw`.
- **WikiDraftBanner UX**: distinct palette + headline for
  `needs_revision` vs `pending`, a “Request changes” button alongside
  Approve / Reject, the reviewer’s return note surfaced inline, a
  20-character minimum on rejection / request-changes notes, conflict
  badge when `base_version < page.version`, and a round counter when
  the draft has been through revisions.

### Changed

- **Skill contribution file edits no longer silently demote PENDING to
  DRAFT.** Contributors must explicitly `withdraw` (or wait for a reviewer
  to `request_changes`) before editing files on a contribution that is in
  front of a reviewer. This closes the “draft moves underfoot mid-review”
  hole flagged in the contribute/review code review.
- **Notifications fire on every lifecycle event** — submit, approve,
  reject, request_changes, resubmit, withdraw — across both REST and MCP
  entry points.

### Migrations

- `024_contribution_lifecycle.py`: adds `revision_round` /
  `last_returned_note` to `wiki_page_drafts` and `skill_contributions`,
  creates `wiki_draft_rounds` (per-round snapshots) and `notifications`
  (recipient-keyed inbox with `(recipient_id, read_at)` index for the
  badge query).

---

## [0.4.0] — 2026-05-18

A scope-aware refresh of the Wiki UX. Every wiki page already lived in a
scope (`global`, `department`, `project`), but the UI treated same-slug
pages from different scopes as duplicates and the index page only ever
showed the global catalog. This release threads scope context through
the URL, the page tree, the page detail view, and the ingestion pipeline.

### Added

- **Scope switcher on `/wiki`**: a dropdown listing the scopes the
  current user can access. Selecting a scope updates the URL
  (`/wiki?scope_type=&scope_id=`), refetches the matching `_index`
  catalog and pages grid, and is shareable / reloadable.
- **Scope-grouped page tree**: the sidebar in `/wiki` and the detail
  viewer now groups pages by scope (`GLOBAL`, plus each department),
  then by page type (`Entities`, `Concepts`, `Topics`, `Sources`).
  Clicking a scope header opens that scope's wiki landing; the chevron
  toggles expansion independently. The active scope and the bucket
  containing the active page auto-expand on navigation.
- **Scope-preserving navigation**: backlinks, outlinks, and inline
  `[[wikilinks]]` carry the current page's scope params, so jumping
  between related pages keeps the user inside the same scope context.
  The detail back button returns to `/wiki?scope_type=&scope_id=` for
  department-scoped pages (projects continue to return to
  `/workspaces`).
- **`GET /api/wiki/my-scopes`**: lists global plus each department and
  project the requester can read. Used by the scope switcher.
- **`scope_name` in wiki responses**: `/api/wiki/pages` joins the
  `Project` and `Department` tables so each summary carries a
  human-readable scope name (e.g. `"Phòng Nhân sự"`) alongside the raw
  ID, removing the need for separate lookups on the client.
- **Thematic-section concept pages during ingestion**: the MRP
  extraction and planning prompts now recognise documents that describe
  a primary entity through several distinct themes (e.g. *Product
  Positioning*, *Target Customer Profile*, *Content Pillars*) and emit
  a separate `concept` page per theme instead of dumping the content
  into the entity page. The entity page links out to them with
  `[[concept/...]]`.

### Changed

- `/api/wiki/pages` and `/api/wiki/index` accept optional
  `scope_type` + `scope_id` query parameters. When omitted the original
  behaviour is preserved (RBAC-filtered list, global index).
- `ScopeBadge` accepts `scopeId: string | null` to match the relaxed
  `WikiPageSummary` type.
- Sidebar collapse/expand chevrons swapped for `left_panel_close` /
  `left_panel_open` icons that don't look like a Back button.
- The `/wiki` page tree no longer surfaces project-scoped pages —
  workspaces remain reachable from `/workspaces` and from the scope
  switcher, keeping the wiki sidebar focused on enterprise-wide
  knowledge.
- The wiki graph no longer draws the dashed convex-hull boundaries
  around department and project clusters; nodes and edges stand on
  their own.
- The `Wiki` button previously added to department cards was removed
  once the scope switcher and clickable tree scope headers landed —
  redundant entry points were creating clutter.

### Fixed

- Department-scoped detail pages no longer fetch
  `/api/projects/<id>/wiki` (which 404s on department IDs); the tree
  uses the new general scope-aware `/api/wiki/pages` endpoint instead.
- Clicking a backlink, outlink, or inline `[[wikilink]]` from a scoped
  page used to drop scope context and load the flat "old" tree.
- Navigating to a global wiki page used to render with the legacy flat
  tree while `/wiki` showed the new grouped tree.
- `DELETE /api/wiki/pages/<slug>` returned 404 for workspace pages
  because the endpoint looked them up with the default global scope.
  Even after that lookup was fixed, the cascade helper re-fetched the
  row with the same default and silently no-op'd the actual delete,
  returning `{"ok": true}` while the row remained in the database.
  `delete_page_cascade` now takes the resolved `WikiPage` object so
  no second lookup is performed.
- The summary block under the page title piped `page.summary` straight
  into ReactMarkdown without the `[[wikilink]]` preprocessing step
  used by the main content renderer, so users saw raw `[[Arkon]]` and
  bare `**...**` markers in the header of every page. Wikilinks now
  resolve through the same preprocessor and inherit the active scope.

### Backend

- Frontend `WikiPageSummary` and Pydantic `WikiPageSummary` both gain
  `scope_name: Optional[str]`; new shared `WikiScope` type for the
  switcher payload.
- `_build_wiki_scope_filter` is reused by both `/wiki/pages` and the
  new `/wiki/my-scopes` endpoint.
- `regenerate_index` is called with the deleted page's actual scope so
  the right `_index` is rebuilt after a non-global delete.

---

## [0.3.1] — 2026-05-14

### Added

- **Wiki Graph — Department Clustering**: Wiki pages scoped to a department now visually group into department clusters on the `/wiki/graph` canvas.
  - Convex hull drawn per department (below project hulls) with a distinct color per department.
  - Force simulation biases nodes toward their department's X-zone (70% scope pull, 30% component spread) so related pages naturally converge.
  - Legend lists each department with icon `business` and page count.
  - Tooltip shows department name for dept-scoped pages.

### Fixed

- Graph endpoint now joins the `Department` table so `scope_name` is populated for department-scoped pages (previously only `Project` was joined, leaving dept nodes without a name label).

---

## [0.3.0] — 2026-05-13

### Added

- **Department-level Wiki Isolation**: Wiki pages compiled from department-scoped sources are now restricted to members of that department.
  - `ScopeType.DEPARTMENT` added to the enum; pipeline `_resolve_wiki_scopes()` resolves project > department(s) > global, fanning out multi-department sources into one page per department scope (LLM runs once, content is duplicated to each scope).
  - `wiki_service._scope_filter_with_dept()` provides a single-query OR filter (global + user's department).
  - `get_wiki_page` returns HTTP 403 for cross-department access.
  - Source PATCH: changing department on a `ready` source triggers wiki detach, old-scope index regeneration, and MRP re-queue automatically.
  - Frontend: edit-source dialog warns before department reassignment triggers re-analysis.

- **MRP Pipeline — Plan Regeneration with Reviewer Feedback**: Admin can now reject a pending plan with a note, triggering LLM-based regeneration that incorporates the feedback.
  - `POST /sources/{id}/plan/regenerate` runs in the background via `regenerate_plan_task`.
  - Plan Review Dialog surfaces a *Regenerate* button that requires a reviewer note.
  - `_resolve_maybe_items` uses LLM to decide UPDATE vs CREATE (previously always downgraded MAYBE to CREATE).

- **Catalog-driven LLM & Vision Selection**: Replaces free-form `llm_provider + llm_model_id` config with curated catalogs (`LLMModelSpec`, `VisionModelSpec`) that expose context window size, tool support, vision capability, and per-token cost.
  - `/api/settings/{llm,vision}/{catalog,switch}` endpoints mirror the embedding catalog pattern.
  - Settings UI renders a `ModelCatalogCard` per capability with metadata (context window, costs, tool/vision badges).
  - `writer._get_source_context_budget` reads `context_window_tokens` from the spec — the stale hard-coded table is removed.

- **Gemini Model Updates**: Catalog updated with newer Gemini variants.
  - `gemini-3.1-flash-lite`: 1M context, tools + vision + thinking, cheapest Google 1M option ($0.25 in / $1.50 out per 1M tokens). New recommended default for high-volume extraction and captioning.
  - `gemini-3-flash-preview` and two additional preview models added.
  - Admins on `gemini-3.1-flash` must reselect in Settings (model removed from catalog).

### Fixed

- **MRP Pipeline Hardening** (critical):
  - Draft results (`PageWriteResult`) now persisted in `plan_json._page_drafts`; VERIFY/COMMIT phases resume without re-running REFINE.
  - `caption_images_task` is now serialized before `ingest_map_reduce_task`, baking captions into `source.full_text` before MAP runs — fixes the race condition that produced empty image markers in compiled wiki pages.
  - KB reconciliation searches every destination scope and retains the best semantic match, preventing duplicate pages when the same concept exists across scopes.

- **MRP Pipeline Hardening** (high):
  - `assemble_evidence` uses word-boundary regex (`\bterm\b`) instead of substring matching, so short entity names (e.g. "AI") no longer match unrelated subjects ("MAIL").
  - `/sources/{id}/plan/regenerate` runs async via arq; UI polls `GET /plan` instead of holding an open HTTP connection.
  - JSON fence stripping unified via `parse_json_loose`; removes several incorrect `str.strip("```json")` variants in mapper and wiki_analyzer.

- **MRP Pipeline Hardening** (medium):
  - Approve/reject/regenerate endpoints use `SELECT FOR UPDATE` and reject mismatched status to prevent race conditions.

---

## [0.2.x] — prior releases

See git log.


--- FILE: CLAUDE.md ---

<!-- rtk-instructions v2 -->
# RTK (Rust Token Killer) - Token-Optimized Commands

## Golden Rule

**Always prefix commands with `rtk`**. If RTK has a dedicated filter, it uses it. If not, it passes through unchanged. This means RTK is always safe to use.

**Important**: Even in command chains with `&&`, use `rtk`:
```bash
# ❌ Wrong
git add . && git commit -m "msg" && git push

# ✅ Correct
rtk git add . && rtk git commit -m "msg" && rtk git push
```

## RTK Commands by Workflow

### Build & Compile (80-90% savings)
```bash
rtk cargo build         # Cargo build output
rtk cargo check         # Cargo check output
rtk cargo clippy        # Clippy warnings grouped by file (80%)
rtk tsc                 # TypeScript errors grouped by file/code (83%)
rtk lint                # ESLint/Biome violations grouped (84%)
rtk prettier --check    # Files needing format only (70%)
rtk next build          # Next.js build with route metrics (87%)
```

### Test (60-99% savings)
```bash
rtk cargo test          # Cargo test failures only (90%)
rtk go test             # Go test failures only (90%)
rtk jest                # Jest failures only (99.5%)
rtk vitest              # Vitest failures only (99.5%)
rtk playwright test     # Playwright failures only (94%)
rtk pytest              # Python test failures only (90%)
rtk rake test           # Ruby test failures only (90%)
rtk rspec               # RSpec test failures only (60%)
rtk test <cmd>          # Generic test wrapper - failures only
```

### Git (59-80% savings)
```bash
rtk git status          # Compact status
rtk git log             # Compact log (works with all git flags)
rtk git diff            # Compact diff (80%)
rtk git show            # Compact show (80%)
rtk git add             # Ultra-compact confirmations (59%)
rtk git commit          # Ultra-compact confirmations (59%)
rtk git push            # Ultra-compact confirmations
rtk git pull            # Ultra-compact confirmations
rtk git branch          # Compact branch list
rtk git fetch           # Compact fetch
rtk git stash           # Compact stash
rtk git worktree        # Compact worktree
```

Note: Git passthrough works for ALL subcommands, even those not explicitly listed.

### GitHub (26-87% savings)
```bash
rtk gh pr view <num>    # Compact PR view (87%)
rtk gh pr checks        # Compact PR checks (79%)
rtk gh run list         # Compact workflow runs (82%)
rtk gh issue list       # Compact issue list (80%)
rtk gh api              # Compact API responses (26%)
```

### JavaScript/TypeScript Tooling (70-90% savings)
```bash
rtk pnpm list           # Compact dependency tree (70%)
rtk pnpm outdated       # Compact outdated packages (80%)
rtk pnpm install        # Compact install output (90%)
rtk npm run <script>    # Compact npm script output
rtk npx <cmd>           # Compact npx command output
rtk prisma              # Prisma without ASCII art (88%)
```

### Files & Search (60-75% savings)
```bash
rtk ls <path>           # Tree format, compact (65%)
rtk read <file>         # Code reading with filtering (60%)
rtk grep <pattern>      # Search grouped by file (75%)
rtk find <pattern>      # Find grouped by directory (70%)
```

### Analysis & Debug (70-90% savings)
```bash
rtk err <cmd>           # Filter errors only from any command
rtk log <file>          # Deduplicated logs with counts
rtk json <file>         # JSON structure without values
rtk deps                # Dependency overview
rtk env                 # Environment variables compact
rtk summary <cmd>       # Smart summary of command output
rtk diff                # Ultra-compact diffs
```

### Infrastructure (85% savings)
```bash
rtk docker ps           # Compact container list
rtk docker images       # Compact image list
rtk docker logs <c>     # Deduplicated logs
rtk kubectl get         # Compact resource list
rtk kubectl logs        # Deduplicated pod logs
```

### Network (65-70% savings)
```bash
rtk curl <url>          # Compact HTTP responses (70%)
rtk wget <url>          # Compact download output (65%)
```

### Meta Commands
```bash
rtk gain                # View token savings statistics
rtk gain --history      # View command history with savings
rtk discover            # Analyze Claude Code sessions for missed RTK usage
rtk proxy <cmd>         # Run command without filtering (for debugging)
rtk init                # Add RTK instructions to CLAUDE.md
rtk init --global       # Add RTK to ~/.claude/CLAUDE.md
```

## Token Savings Overview

| Category | Commands | Typical Savings |
|----------|----------|-----------------|
| Tests | vitest, playwright, cargo test | 90-99% |
| Build | next, tsc, lint, prettier | 70-87% |
| Git | status, log, diff, add, commit | 59-80% |
| GitHub | gh pr, gh run, gh issue | 26-87% |
| Package Managers | pnpm, npm, npx | 70-90% |
| Files | ls, read, grep, find | 60-75% |
| Infrastructure | docker, kubectl | 85% |
| Network | curl, wget | 65-70% |

Overall average: **60-90% token reduction** on common development operations.
<!-- /rtk-instructions -->

# Arkon MCP — Knowledge Base Access

Arkon exposes a FastMCP server for Claude Desktop and Claude Code to query the enterprise knowledge base.

## Setup (Claude Desktop)

```json
{
  "mcpServers": {
    "arkon": {
      "url": "http://localhost:8000/mcp",
      "headers": { "Authorization": "Bearer <your-mcp-token>" }
    }
  }
}
```

Get a token from an Arkon admin. Tokens are scoped to specific knowledge types — what you can read depends on your token.

## Skills

| Skill | Trigger | Role needed |
|-------|---------|------------|
| `/arkon-query` | "what do we know about X", "find in KB", "query:" | Any (scoped by token) |
| `/arkon-edit` | "update wiki", "propose edit", "fix this page" | Contributor+ |
| `/arkon-review` | "review drafts", "approve draft", "check queue" | Editor/Admin |

Skills live in `skills/`. Claude Code picks them up automatically when working in this repo.

## Key Principles

- **Wiki first, sources second.** `search_wiki` → `read_wiki_page` → source drill-down only for precise citations.
- **Your token is your scope.** RBAC is enforced server-side; "access denied" means contact an admin.
- **Always confirm before writing.** `propose_wiki_edit` and `edit_wiki_page` modify the live KB — get user approval first.


--- FILE: CONTRIBUTING.md ---

# Contributing to Arkon

First off, thank you for considering contributing to Arkon! Every contribution — bug reports, feature requests, code, documentation — is valuable and appreciated.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Conventions](#commit-conventions)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)
- [License](#license)

---

## Code of Conduct

Be respectful, constructive, and professional. We want Arkon to be a welcoming space for everyone regardless of experience level, identity, or background.

---

## Getting Started

### Prerequisites

| Tool       | Version    | Purpose                           |
|------------|------------|-----------------------------------|
| Python     | 3.11 – 3.12 | Backend runtime                 |
| Node.js    | 20+        | Frontend (Next.js)                |
| PostgreSQL | 15+        | Main database (with pgvector)     |
| Redis      | 7+         | Background job queue              |
| MinIO      | Latest     | S3-compatible file storage        |
| Neo4j      | 5+         | Knowledge graph (optional)        |

### Setup

1. **Fork & clone** the repository:

   ```bash
   git clone https://github.com/<your-fork>/arkon.git
   cd arkon
   ```

2. **Backend setup:**

   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # macOS/Linux:
   source .venv/bin/activate

   pip install -e ".[dev]"
   ```

3. **Environment:**

   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your local values (see docs/HOW_TO_RUN.md for details)
   ```

4. **Database:**

   ```bash
   alembic upgrade head
   ```

5. **Frontend setup:**

   ```bash
   cd frontend
   npm install
   echo "NEXT_PUBLIC_API_URL=http://localhost:5055" > .env.local
   ```

Refer to [`blob/docs/HOW_TO_RUN.md`](blob/docs/HOW_TO_RUN.md) for full infrastructure setup (Docker commands, etc.).

### Running in Development

You need **3 terminals**:

```bash
# Terminal 1 — API server
uvicorn app.main:app --host 0.0.0.0 --port 5055 --reload

# Terminal 2 — Background worker
python -m arq app.worker.WorkerSettings

# Terminal 3 — Frontend
cd frontend && npm run dev
```

- **Backend API:** http://localhost:5055
- **API Docs (Swagger):** http://localhost:5055/docs
- **Frontend:** http://localhost:3000

---

## Project Structure

```
arkon/
├── app/                    # Backend (FastAPI)
│   ├── ai/                 # AI providers (Google, OpenAI, Anthropic)
│   │   └── providers/      # Provider implementations
│   ├── database/           # SQLAlchemy models & DB init
│   ├── mcp/                # MCP server (Claude Desktop integration)
│   ├── routers/            # API route handlers
│   ├── services/           # Business logic layer
│   ├── config.py           # Pydantic settings
│   ├── main.py             # FastAPI app entry point
│   └── worker.py           # ARQ background worker
├── alembic/                # Database migrations
│   └── versions/           # Migration files
├── frontend/               # Frontend (Next.js + TypeScript)
│   └── src/
│       ├── app/            # Pages (App Router)
│       ├── components/     # React components
│       └── lib/            # Utilities, API client, auth
├── blob/docs/              # Documentation
├── pyproject.toml          # Python dependencies & tooling config
├── docker-compose.yml      # Docker services (Postgres, Redis, MinIO, API, workers, frontend)
├── .env.docker.example     # Env template for `docker compose`
└── .env.local.example      # Env template for local development
```

### Architecture Quick Reference

| Layer         | Tech              | Notes                                |
|---------------|-------------------|--------------------------------------|
| API           | FastAPI           | Async, auto-docs at `/docs`          |
| ORM           | SQLAlchemy 2.0    | Async sessions, pgvector extension   |
| Migrations    | Alembic           | Auto-generate from model changes     |
| Worker        | ARQ + Redis       | Document ingestion pipeline          |
| AI Providers  | Multi-provider    | Google, OpenAI, Anthropic, Ollama    |
| Frontend      | Next.js 15        | App Router, TypeScript, Tailwind CSS |
| Auth          | JWT + bcrypt      | Role-based (admin/employee)          |
| Storage       | MinIO (S3)        | File uploads and image extraction    |
| Graph DB      | Neo4j (optional)  | Entity extraction & knowledge graph  |

---

## Development Workflow

1. **Create a branch** from `main`:

   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```

2. **Make your changes** — keep them focused on a single concern.

3. **Test your changes:**

   ```bash
   # Backend — lint
   ruff check app/

   # Backend — format
   ruff format app/

   # Backend — tests
   pytest

   # Frontend — lint
   cd frontend && npm run lint

   # Frontend — type check
   cd frontend && npx tsc --noEmit
   ```

4. **Commit** with a descriptive message (see [Commit Conventions](#commit-conventions)).

5. **Push** and open a Pull Request.

---

## Coding Standards

### Backend (Python)

- **Formatter/Linter:** [Ruff](https://docs.astral.sh/ruff/) — config in `pyproject.toml`
- **Line length:** 88 characters
- **Style:** PEP 8 with Ruff rules `E`, `F`, `I`
- **Type hints:** Use type annotations for function parameters and return types
- **Async:** All database and I/O operations must be async (`async/await`)
- **Docstrings:** Use `"""triple-quote"""` docstrings for public functions and classes
- **Imports:** Use absolute imports (`from app.services.config_service import ...`)
- **Models:** SQLAlchemy models go in `app/database/models.py`
- **Routes:** Each domain gets its own router file in `app/routers/`
- **Services:** Business logic lives in `app/services/`, not in routers

### Frontend (TypeScript / React)

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript — no `any` unless absolutely necessary
- **Styling:** Tailwind CSS with the project's design tokens
- **Components:**
  - Shared/reusable → `src/components/ui/` (shadcn/ui)
  - Feature-specific → `src/components/<feature>/`
  - Layout → `src/components/layout/`
- **API calls:** Use the `api()` helper from `src/lib/api.ts`
- **State:** Prefer local state (`useState`) over global state; use context only when needed
- **Naming:** Components in PascalCase, files in kebab-case

### Database Migrations

When changing models, **always** create a migration:

```bash
alembic revision --autogenerate -m "short description of change"
```

- Review the generated migration before committing — auto-generate isn't perfect
- Never edit an existing migration that has been merged to `main`
- Include seed data in migrations when adding new required lookup tables

---

## Commit Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>
```

### Types

| Type       | When to use                                    |
|------------|------------------------------------------------|
| `feat`     | New feature                                    |
| `fix`      | Bug fix                                        |
| `docs`     | Documentation only                             |
| `style`    | Code style (formatting, no logic change)       |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf`     | Performance improvement                        |
| `test`     | Adding or updating tests                       |
| `chore`    | Build process, dependencies, tooling           |
| `ci`       | CI/CD configuration                            |

### Scopes

| Scope      | Covers                         |
|------------|--------------------------------|
| `api`      | Backend routers, services      |
| `db`       | Models, migrations             |
| `worker`   | Background job processing      |
| `ai`       | AI providers, embedding, LLM   |
| `mcp`      | MCP server integration         |
| `ui`       | Frontend components, pages     |
| `auth`     | Authentication, RBAC           |
| `config`   | Settings, environment          |
| `deps`     | Dependency updates             |

### Examples

```
feat(api): add bulk delete endpoint for sources
fix(worker): handle empty PDF files during ingestion
docs: update HOW_TO_RUN with Neo4j setup
refactor(ui): extract color picker into reusable component
chore(deps): bump fastapi to 0.115.0
```

---

## Pull Request Process

1. **Title** should follow commit conventions: `feat(scope): description`

2. **Description** should include:
   - What changed and why
   - Screenshots for UI changes
   - Migration instructions if DB schema changed
   - Breaking changes (if any)

3. **Checklist** before requesting review:
   - [ ] Code compiles / lints without errors
   - [ ] New code has appropriate type hints / TypeScript types
   - [ ] Database migrations are included (if models changed)
   - [ ] Existing tests pass
   - [ ] Sensitive data (API keys, passwords) is never hardcoded

4. **Review** — at least 1 approval is required before merging.

5. **Merge** — squash-merge to keep history clean.

---

## Reporting Issues

When opening an issue, please include:

- **Environment:** OS, Python version, Node.js version, browser
- **Steps to reproduce:** Numbered, specific steps
- **Expected behavior:** What should happen
- **Actual behavior:** What actually happened
- **Logs/screenshots:** Console output, error messages, UI screenshots
- **Related code:** File paths, API endpoints involved

Use the appropriate label:

| Label          | Description                    |
|----------------|--------------------------------|
| `bug`          | Something is broken            |
| `enhancement`  | New feature request            |
| `docs`         | Documentation improvement      |
| `question`     | Need help or clarification     |
| `good first issue` | Beginner-friendly task    |

---

## License

By contributing to Arkon, you agree that your contributions will be licensed under the [PolyForm Noncommercial License 1.0.0](LICENSE).

> **Note:** Arkon is licensed for **noncommercial use only**. If you need a commercial license, please contact the Arkon team.

---

_Thank you for helping make Arkon better!_ 🚀


--- FILE: DESIGN.md ---

# Sahara — Warm Minimalism

## North Star: "Sun-Baked Simplicity"
Luxurious warmth meets disciplined minimalism. Golden tones, editorial serif headings, and abundant whitespace.

## Colors
- **Primary (`#c2652a`):** Burnt sienna — warm, earthy CTAs and focus states.
- **Background (`#faf5ee`):** Warm linen — never cold white.
- **Tertiary (`#8c3c3c`):** Dusty rose — sparse accent for emphasis.
- Entire palette is warm-shifted. Even grays have warm undertones.

## Typography
- **Headlines:** EB Garamond — elegant, editorial serif. Large sizes with tight leading.
- **Body/Labels:** Manrope — geometric sans-serif, clean and modern contrast to the serif.
- The serif/sans pairing creates a luxury editorial feel.

## Elevation
- Ultra-soft shadows: `0 2px 16px rgba(58, 48, 42, 0.04)`. Barely visible.
- Prefer warm background tinting for hierarchy.
- Borders: thin and warm (`#d8d0c8` at 60% opacity).

## Components
- **Buttons:** Primary = solid sienna fill, 8px radius. Secondary = outlined with warm border. Text links underlined on hover.
- **Cards:** Warm white or `surface_container_low`, generous padding (28-32px). Minimal borders.
- **Inputs:** White background, warm gray border, sienna focus state.

## Rules
- Whitespace is the primary design tool. When in doubt, add more.
- Content should feel curated, not cluttered. Limit items per section.
- Photography should be warm-toned. Avoid cool/blue stock imagery.

--- FILE: docs\ACCESS-CONTROL.md ---

# Access Control

Arkon has a dual-realm permission system:

1. **Global realm** — department-based RBAC for organization-wide resources (documents, wiki, skills)
2. **Workspace realm** — membership-based roles for project-scoped resources

These two realms are independent. Global permissions do not grant workspace access, and workspace membership does not grant access to global resources by itself.

---

## Global Realm — Permissions

### Permission format

```
{resource}:{action}:{scope}

scope options:
  own_dept  →  your department + global (unscoped) resources
  all       →  all resources regardless of department
```

### Full permission list

**Documents**
| Permission | Description |
|---|---|
| `doc:read:own_dept` | View documents in your department and global documents |
| `doc:read:all` | View all documents across all departments |
| `doc:create:own_dept` | Upload documents to your department |
| `doc:create:all` | Upload documents to any department |
| `doc:edit:own_dept` | Edit document metadata in your department |
| `doc:edit:all` | Edit any document |
| `doc:delete:own_dept` | Delete documents in your department |
| `doc:delete:all` | Delete any document |

**Wiki**
| Permission | Description |
|---|---|
| `wiki:read:own_dept` | Read global wiki + wiki pages scoped to your dept |
| `wiki:read:all` | Read all wiki pages |
| `wiki:write:own_dept` | Propose wiki drafts for global pages |
| `wiki:write:all` | Direct edit any wiki page + approve/reject drafts on global pages |
| `wiki:delete:own_dept` | Delete wiki pages in your dept scope |
| `wiki:delete:all` | Delete any wiki page |

**AI Skills**
| Permission | Description |
|---|---|
| `skill:read:own_dept` | Use skills in your department + global skills |
| `skill:read:all` | Use all skills |
| `skill:create:own_dept` | Upload skills to your department |
| `skill:create:all` | Upload skills anywhere |
| `skill:edit:own_dept` | Edit skill metadata in your department |
| `skill:edit:all` | Edit any skill |
| `skill:delete:own_dept` | Delete skills in your department |
| `skill:delete:all` | Delete any skill |

**Organization (admin operations)**
| Permission | Description |
|---|---|
| `org:departments:read` | View departments |
| `org:departments:manage` | Create/edit/delete departments |
| `org:employees:read` | View employee directory |
| `org:employees:manage` | Create/edit/deactivate employees |
| `org:roles:read` | View roles and their permissions |
| `org:roles:manage` | Create/edit/delete roles |
| `org:settings:read` | View system settings |
| `org:settings:manage` | Modify system settings (AI providers, keys) |
| `org:audit:read` | View audit log |

**Workspaces**
| Permission | Description |
|---|---|
| `workspace:view:all` | View all workspaces without being a member |

---

### Roles

A **Role** is a named collection of permissions assigned to employees. Roles are created and managed in **Admin Portal → Roles**.

**Built-in role presets:**

| Preset | Included permissions |
|---|---|
| **Viewer** | `doc:read:own_dept`, `wiki:read:own_dept`, `skill:read:own_dept`, `org:departments:read` |
| **Contributor** | Viewer + `doc:create:own_dept`, `wiki:write:own_dept`, `skill:create:own_dept` |
| **Department Admin** | Contributor + edit/delete for own dept (docs, wiki, skills) |
| **Knowledge Admin** | All `:all` permissions for docs, wiki, and skills |

**Default employee permissions** (when no custom role is assigned):
`doc:read:own_dept`, `doc:create:own_dept`, `wiki:read:own_dept`, `wiki:write:own_dept`, `skill:read:own_dept`

---

### System Admin

The `admin` role (set on the Employee model) is a system-level override:
- Bypasses all permission checks
- Has workspace admin role in every workspace automatically
- Can create and delete workspaces
- Can view and manage all resources regardless of department

---

## Workspace Realm — Membership Roles

Each workspace (project) has its own member list. Membership roles are separate from global permissions.

### Roles

| Role | Level | What they can do |
|---|---|---|
| **Viewer** | 0 | Read wiki pages, sources, and member list of the workspace |
| **Contributor** | 1 | + Propose wiki drafts for workspace pages |
| **Editor** | 2 | + Direct edit wiki pages · Approve/reject drafts · Add/remove sources · Upload files to workspace |
| **Admin** | 3 | + Add/remove members · Change member roles · Rename/archive the workspace |

Roles are hierarchical — Editor can do everything Contributor can, and so on.

### Guards

- **Last admin protection** — the last workspace admin cannot be removed or demoted. Assign another admin first.
- **Workspace deletion** — only system admins can delete workspaces, regardless of workspace role.
- **Workspace creation** — only system admins can create workspaces.

---

## How scope resolution works

### Global documents

```
User has doc:read:own_dept?
  → Source has no departments (Global doc)?   → Accessible ✓
  → Source's departments include user's dept? → Accessible ✓
  → Otherwise                                 → Blocked ✗

User has doc:read:all?
  → Accessible regardless of source departments ✓
```

### Workspace resources

```
User is system admin?            → Full access ✓
User is workspace member?        → Access (filtered by workspace role)
Otherwise                        → 403 Forbidden
```

### Wiki pages

Wiki pages have three possible scopes — `global`, `department`, `project` — and the MCP read path resolves visibility by OR-ing the three branches the caller actually belongs to:

```
Visible to a non-admin caller:
  scope=global                                                  → always
  scope=department AND scope_id == user.department_id           → yes
  scope=project    AND scope_id ∈ user.project_ids (member of)  → yes
  otherwise                                                     → no

System admin                                                    → all scopes
```

> **History note.** Before commit `7676df5`, the MCP scope filter only OR-ed `global + own_dept` and silently dropped project-scoped pages — workspace members couldn't find their own workspace's wiki via `search_wiki`. The helper is now `_scope_filter_for_identity(department_id, project_ids)`; the older `_scope_filter_with_dept` is deprecated and kept only for the pipeline write path.

### Out-of-scope discovery hint

When a non-admin caller searches or reads a slug that exists in a scope they cannot access (a different department, a workspace they aren't a member of), the MCP tools return a *hint* instead of pretending the page does not exist:

```
search_wiki  → appends "Out-of-scope matches" section listing
               (scope_type, scope_name, count) groups
read_wiki_page → returns "exists in department X / workspace Y but
                 you don't have access, contact the scope admin"
```

The hint deliberately leaks **only** the scope label + count. Page titles, summaries, and content are never surfaced across a permission boundary — a title can itself be sensitive (e.g. "Q1 layoffs"). A future opt-in (Tier 2) could expose titles via a config flag, but the default behaviour is conservative.

### Wiki write permissions (global pages)

| Action | Required permission |
|---|---|
| Propose a draft | `wiki:write:own_dept` or `wiki:write:all` |
| Direct edit | `wiki:write:all` |
| Approve / reject draft | `wiki:write:all` |

For **workspace-scoped** pages, global permissions are not used — workspace roles apply:

| Action | Required workspace role |
|---|---|
| Propose a draft | Contributor+ |
| Direct edit | Editor+ |
| Approve / reject draft | Editor+ |

---

## Setting up access control (step by step)

### 1. Create departments

**Admin Portal → Departments → New Department**

Departments define the scope boundary for `own_dept` permissions. Every employee belongs to one department.

### 2. Create roles

**Admin Portal → Roles → New Role**

Select the permissions this role should grant. You can start from a built-in preset and customize.

### 3. Create employees

**Admin Portal → Employees → New Employee**

Assign each employee to a department and a role.

### 4. Assign knowledge types to sources

When uploading documents, assign them a knowledge type. This determines which employees can see them via MCP (based on their MCP token's `allowed_knowledge_types`).

### 5. Create workspaces and add members

**Admin Portal → Workspaces → New Workspace**

Add employees as workspace members and assign their workspace role (Viewer, Contributor, Editor, or Admin).

---

## MCP token scoping

When an MCP token is generated for an employee, it captures their current permission scope:
- Which knowledge types they can access
- Their department
- The list of workspaces they are a member of (`project_ids`)
- The list of source IDs reachable through those workspaces (`project_source_ids`)

This scope is re-evaluated on each request from the live state of their role, department, and workspace memberships. Revoking a token or changing an employee's role takes effect immediately on the next MCP call — there is no in-memory cache to invalidate.

### Tokens are hashed at rest

Plaintext tokens are never stored. When a token is issued, Arkon stores:

| Column | What it holds |
|---|---|
| `employees.mcp_token_hash` | `HMAC-SHA256(MCP_TOKEN_PEPPER, plaintext)`, hex-encoded |
| `employees.mcp_token_prefix` | First 12 chars of the plaintext (for UI display only) |
| `employees.mcp_token_rotated_at` | When the current token was issued |

Verification recomputes the HMAC of the bearer token in each request and looks it up by `mcp_token_hash`. A DB dump alone — without the pepper — cannot forge tokens. Tokens are also URL-safe random 256-bit strings, so a plain HMAC is sufficient (no bcrypt necessary).

> **Migration `027` zeroed every legacy plaintext token in place.** Every user must rotate via the Admin Portal or `POST /api/my/mcp-token` after deploying 0.7.2. The `MCP_TOKEN_PEPPER` env var is required to start the server — pick a strong random value at deploy time and never rotate it (rotating invalidates every token).

`generate_token` calls return the plaintext exactly once. There is no read-back path; lost tokens must be regenerated.

---

## Workspace-scoped picker endpoints

Workspace admins need to invite members and link sources but **do not** automatically inherit org-level `org:employees:read` / `doc:read:all` permissions. Two scoped endpoints exist so the frontend pickers don't need org-wide access:

| Endpoint | Returns | Required role |
|---|---|---|
| `GET /api/projects/{id}/members/candidates` | Employees not yet in the workspace, with name + email + department | Workspace admin |
| `GET /api/projects/{id}/sources/candidates` | Sources not yet linked to the workspace, with title + KT + status | Workspace editor+ |

Both accept `?search=` for substring filtering and cap at 500 rows. The bulk-add endpoint `POST /api/projects/{id}/members/bulk` (workspace admin) accepts `{employee_ids, role}` and processes each row in its own savepoint, so a duplicate or stale employee_id in the batch doesn't poison the rest.

The frontend `ProjectDetail` page uses `Promise.allSettled` for these calls — a 403 on the candidate fetches (e.g. a workspace viewer opening the page) no longer sinks the whole load. The "Add members" UI is gated on `isOrgAdmin || workspaceRole === 'admin'` so workspace admins see the picker even when they aren't org admins.


--- FILE: docs\ARCHITECTURE.md ---

# Architecture

## System overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        On-Premise Server                         │
│                                                                  │
│  ┌──────────────────┐        ┌───────────────────────────────┐  │
│  │   Admin Portal   │        │        Arkon API              │  │
│  │   (Next.js)      │──────▶ │        (FastAPI)              │  │
│  └──────────────────┘        │                               │  │
│                               │  /api/*   REST endpoints      │  │
│                               │  /mcp     MCP server          │  │
│                               │  /docs    Swagger UI          │  │
│                               └───────────────┬───────────────┘  │
│                                               │                  │
│  ┌────────────────┐  ┌──────────────┐        │                  │
│  │ Wiki Worker    │  │ Skill Worker │        │                  │
│  │ (arq)          │  │ (arq)        │        │                  │
│  │ · ingestion    │  │ · skill pkg  │        │                  │
│  │ · compilation  │  │   processing │        │                  │
│  └────────────────┘  └──────────────┘        │                  │
│                                               │                  │
│  ┌──────────────┐  ┌───────────┐  ┌────────┐│                  │
│  │  PostgreSQL  │  │   Redis   │  │ MinIO  ││                  │
│  │  + pgvector  │  │  (queue)  │  │(files) ││                  │
│  └──────────────┘  └───────────┘  └────────┘│                  │
└───────────────────────────────────────────────┼─────────────────┘
                                                │ MCP (HTTPS)
                               ┌────────────────┼────────────┐
                               │                │            │
                          Claude Desktop    Claude.ai    Any MCP
                          (employees)       (web)        client
```

---

## Components

### Admin Portal (`frontend/`)
Next.js application. Provides the UI for:
- Knowledge base and document management
- Wiki browser (three-panel: page tree, content, backlinks/outlinks)
- Workspace management and member roles
- RBAC configuration (departments, roles, permissions)
- Employee accounts and MCP token management
- AI Skills library
- Audit log

### Arkon API (`app/`)
FastAPI application serving two protocols simultaneously:

**REST API** (`/api/*`) — used by the Admin Portal and direct integrations:
- Auth: JWT-based session for portal users
- Sources: document upload, URL ingestion, recompilation
- Wiki: page CRUD, drafts, revisions, graph
- Projects (Workspaces): member management, scoped sources and wiki
- RBAC: departments, employees, roles, permissions
- Skills: upload, version management, scope assignment
- Audit: activity log

**MCP Server** (`/mcp`) — used by Claude Desktop and other MCP clients:
- Auth: bearer token (MCP token per employee)
- Tools: wiki search/read, source drill-down, skill access
- All responses are filtered by the employee's permission scope

### Background Workers (`app/worker.py`)
Two arq (Redis-based) worker pools:

**Wiki Worker** (`WorkerSettings`):
- `ingest_file_task` — extract text and images from uploaded files, then enqueue `ingest_map_reduce_task`
- `ingest_url_task` — scrape and extract text from URLs, then enqueue `ingest_map_reduce_task`
- `ingest_map_reduce_task` — MRP Phase 0-2: triage, parallel chunk extraction (MAP), entity dedup + KB reconciliation + compilation plan (REDUCE)
- `ingest_refine_task` — MRP Phase 3-5: parallel page writers (REFINE), citation/coverage/conflict checks (VERIFY), atomic DB write (COMMIT). Each writer opens its own `AsyncSession`.
- `caption_images_task` — vision-model captioning for embedded images, enqueues `ingest_map_reduce_task` when done
- `regenerate_plan_task` — re-runs Phase 2 (REDUCE + planning call) on demand
- `reembed_all_pages_task` — backfill / re-embedding when the active embedding spec changes
- `ai_pre_review_draft_task` — runs all four AI-review layers (L1 regex → L2 structural → L3 semantic → L4 LLM) on a wiki draft. Payload includes `expected_round` so a stale worker drops its verdict when the author has resubmitted mid-flight.

**Cron jobs** (declared in `WorkerSettings.cron_jobs`):
- `daily_stats_rollup_cron` (02:00 UTC) — recomputes admin Statistics rollups for the previous UTC day. Idempotent — re-running overwrites prior rows via the unique constraint on `(date, metric_key, dimensions_hash)`.
- `sweep_stuck_ai_review_cron` (every 10 min) — flips any draft stuck in `ai_check_status='running'` for longer than `2 × worker_job_timeout` (min 30 min) back to `skipped`. Catches the SIGKILL / OOM / container-restart case where the in-worker try/except can't run.

**Skill Worker** (`SkillWorkerSettings`):
- `process_skill_task` — process uploaded skill packages

### MRP Pipeline (`app/ai/mrp/`)
The core compilation pipeline — MAP-REDUCE-PLAN-REFINE-VERIFY:

1. **Triage + MAP** (`mapper.py`) — classifies document size (single_pass / standard / hierarchical), splits into ~20K-char chunks aligned to section headings, runs parallel LLM extraction per chunk. Each chunk produces structured JSON (entities, concepts, claims with `absolute_offset` back to source). Results saved to `source_chunk_extracts` incrementally for crash resume.

2. **REDUCE** (`reducer.py`) — merges all chunk extracts: exact entity dedup → embedding cosine similarity dedup (auto-merge > 0.90, LLM disambiguates 0.75–0.90) → KB reconciliation via semantic search → single planning LLM call → `SourceCompilationPlan` saved with `status=pending_review`.

3. **Human review (Phase 2.5)** — editor approves/modifies/rejects the plan via portal or API. Controlled by `mrp_auto_approve_plan` config for automated pipelines.

4. **REFINE** (`writer.py`) — parallel page writers (up to 4 concurrent). Simple writer (≤ 8 evidence items): 1 LLM call. Complex writer: mini agent loop (max 10 steps, `read_kb_page` / `read_source_excerpt` / `finish` tools). All claims cited with `[^N]` footnotes.

5. **VERIFY** (`verifier.py`) — citation verification (LLM checks each `[^N]` claim against source excerpt), coverage check (entities with ≥ 3 mentions not covered by any page), conflict check (semantic similarity + LLM contradiction detection against existing KB). All checks non-blocking.

6. **COMMIT** (`pipeline.py`) — `apply_create` / `apply_update` per page, `upsert_page_embedding`, single atomic `session.commit()`, `regenerate_index`, `append_log`.

---

## Data model

### Core entities

```
sources                    → uploaded documents (files or URLs)
  ├── source_departments       → which departments can access a source
  ├── source_chunk_extracts    → MAP output: per-chunk structured extraction (entities/claims/concepts)
  └── source_compilation_plans → REDUCE output: planned pages to create/update (pending_review → approved → done)

wiki_pages                 → compiled wiki articles
  ├── wiki_links           → [[wikilink]] graph edges between pages
  ├── wiki_page_drafts     → pending edits / proposed new pages (draft_kind = edit | create)
  │   └── wiki_draft_rounds → snapshots of each (resubmit) cycle: content_md + ai_check_results
  └── wiki_page_revisions  → full version history (immutable snapshots)

knowledge_types            → categories (SOP, Product, HR Policy, ...)

departments                → org units for access scoping
employees                  → user accounts
  │   └── mcp_token_hash / _prefix / _rotated_at  (plaintext never stored)
  └── roles                → custom RBAC role with permission list

projects                   → workspaces (cross-functional contexts)
  ├── project_members      → workspace members with roles (viewer/contributor/editor/admin)
  └── project_sources      → sources linked to a workspace

notifications              → in-app notifications (draft submitted/approved/rejected, etc.)

skills                     → AI skill packages
  ├── skill_departments    → department scoping for skills
  ├── skill_contributions  → contributor uploads pending admin review
  └── skill_versions       → version history with storage paths

stats_daily_metrics        → admin Statistics rollups (one row per day per metric per dim hash)
mcp_query_log              → per-call MCP audit trail (tool name, employee, latency, result count)

audit_log                  → immutable activity log
```

**Key fields on `sources` for pipeline tracking:**
- `pipeline_strategy` — `single_pass | standard | hierarchical` (set by Phase 0 triage)
- `pipeline_phase` — `map | reduce | plan_review | refine | verify | commit` (drives crash resume)
- `status` — includes `plan_ready` (waiting for human review) in addition to `pending | processing | ready | error`

### Permission scoping

Every resource has a scope:
- `scope_type = "global"` — visible to anyone with the appropriate global permission
- `scope_type = "project", scope_id = <project_id>` — restricted to workspace members

This applies to: `sources`, `wiki_pages`, `skills`.

---

## Request flow

### Document upload → wiki compilation

```
POST /api/sources/upload
  → MinIO: store file
  → DB: create Source(status=pending)
  → Redis: enqueue ingest_file_task

Worker: ingest_file_task
  → Extract text (pdfplumber / python-docx / html2text)
  → Vision model: caption embedded images (optional)
  → DB: Source(status=processing)
  → Redis: enqueue ingest_map_reduce_task

Worker: ingest_map_reduce_task   [Phase 0-2]
  → Phase 0 (Triage): classify strategy (single_pass / standard / hierarchical)
  → Phase 1 (MAP): chunk by section headings → parallel LLM extraction
      Each chunk → SourceChunkExtract(status=done) saved incrementally
  → Phase 2 (REDUCE): dedup entities → reconcile with KB → planning LLM call
      → SourceCompilationPlan(status=pending_review)
      → Source(status=plan_ready)   [if manual review]
      → Redis: enqueue ingest_refine_task   [if mrp_auto_approve_plan=True]

[Human review: GET /api/sources/{id}/plan → POST /api/sources/{id}/plan/approve]

Worker: ingest_refine_task   [Phase 3-5]
  → Phase 3 (REFINE): parallel page writers
      Simple (≤8 evidence): 1 LLM call
      Complex (>8 evidence): mini agent loop (read_kb_page, read_source_excerpt, finish)
  → Phase 4 (VERIFY): citation check + coverage check + conflict check (non-blocking)
  → Phase 5 (COMMIT): apply_create / apply_update per page
      Each page → upsert_page_embedding
      DB: Source(status=ready), SourceCompilationPlan(status=done)
      wiki_service.regenerate_index() + append_log()
```

### Employee Claude query → MCP response

```
Claude Desktop → POST /mcp (Bearer ark_xxx)
  → MCPAuthService.verify_token() → resolve employee identity + scope
  → Tool called (e.g. search_wiki)
      → filter wiki pages by employee's allowed knowledge types + dept
      → semantic search via pgvector
  → Return ranked results
```

### Wiki draft workflow

```
Contributor → POST /api/wiki/pages/{slug}/drafts
  → WikiPageDraft(status=pending, ai_check_status=queued) created
  → notify_submitted: insert Notification rows for every reviewer-in-scope
  → enqueue ai_pre_review_draft_task(draft_id, revision_round)

Worker: ai_pre_review_draft_task
  → L1 regex + L2 structural + L3 semantic + L4 LLM checks
  → refresh(draft) and bail if revision_round bumped (resubmit race guard)
  → write ai_check_results, ai_check_status ∈ {passed, warned, failed}

Editor → GET /api/wiki/drafts (lists pending in their scope)
       → /wiki/review console (3-pane) for high-volume review

Editor → POST /api/wiki/drafts/{id}/approve     (advisory lock on hashtext(slug))
  → page row refreshed inside critical section
  → WikiPage.content_md updated, version++
  → WikiPageRevision(change_type=draft_approved) created
  → notify_approved: author + every sibling-draft author on the same page

Editor → POST /api/wiki/drafts/{id}/reject       (reviewer_note required)
       → POST /api/wiki/drafts/{id}/request-changes  (reviewer_note required)
                → status=needs_revision

Author → PATCH /api/wiki/drafts/{id}/content    (resubmit after request_changes)
       → wiki_draft_rounds snapshot of previous content + verdict
       → revision_round++
       → status=pending, ai_check_status=pending, enqueue new AI worker

Author → POST /api/wiki/drafts/{id}/withdraw    (pending or needs_revision)
       → status=withdrawn (terminal)
```

---

## Directory structure

```
arkon/
├── app/
│   ├── main.py               # FastAPI app, CORS, router registration, lifespan
│   ├── config.py             # Settings (pydantic-settings, reads from .env)
│   ├── database/
│   │   ├── models.py         # SQLAlchemy ORM models
│   │   └── __init__.py       # async_session_factory, get_db dependency
│   ├── routers/
│   │   ├── auth.py           # Login, me, change-password
│   │   ├── sources.py        # Document upload, ingestion, retry
│   │   ├── wiki.py           # Wiki page CRUD, revisions, graph
│   │   ├── wiki_drafts.py    # Draft propose/approve/reject
│   │   ├── projects.py       # Workspace CRUD, members, sources, wiki
│   │   ├── skills.py         # AI skill upload and management
│   │   ├── rbac.py           # Departments, employees
│   │   ├── roles.py          # Role and permission management
│   │   ├── knowledge_types.py
│   │   ├── admin_settings.py # AI provider config
│   │   ├── audit.py          # Audit log
│   │   └── notes.py
│   ├── services/
│   │   ├── auth_service.py       # JWT, get_current_user, require_permission
│   │   ├── mcp_auth_service.py   # MCP token resolution
│   │   ├── permission_engine.py  # RBAC logic, scope resolution
│   │   ├── permissions.py        # Permission string constants
│   │   ├── wiki_service.py       # Wiki CRUD, draft/revision operations
│   │   ├── skill_service.py      # Skill CRUD, versioning
│   │   ├── storage_service.py    # MinIO wrapper
│   │   ├── audit_service.py      # log_audit()
│   │   └── kb_service.py         # Source extraction helpers
│   ├── ai/
│   │   ├── mrp/
│   │   │   ├── mapper.py         # Phase 0 (triage) + Phase 1 (MAP: chunking, extraction)
│   │   │   ├── reducer.py        # Phase 2 (REDUCE: dedup, KB reconcile, planning call)
│   │   │   ├── writer.py         # Phase 3 (REFINE: simple + complex page writers)
│   │   │   ├── verifier.py       # Phase 4 (VERIFY: citation, coverage, conflict checks)
│   │   │   └── pipeline.py       # Phase 5 (COMMIT) + pipeline orchestrators
│   │   ├── wiki_agent.py         # Legacy agent loop (kept for reference)
│   │   ├── wiki_agent_tools.py   # Legacy tool catalog
│   │   ├── wiki_analyzer.py      # Legacy pre-analysis call
│   │   └── providers/            # Provider-agnostic LLM/embedding/vision wrappers
│   └── mcp/
│       ├── server.py             # FastMCP server factory (create_mcp_server)
│       └── tools.py              # All MCP tools (register_tools)
├── frontend/
│   └── src/
│       ├── app/(portal)/         # Page routes (wiki, workspaces, knowledge, ...)
│       └── components/           # UI components
├── alembic/
│   └── versions/                 # Migration files (001 → 020)
├── docker-compose.yml
├── Dockerfile
├── .env.docker.example     # Env template for Docker Compose
├── .env.local.example      # Env template for local development
└── pyproject.toml
```

---

## AI provider support

All AI operations go through provider-agnostic wrappers in `app/ai/providers/`. Configured at runtime via the Admin Portal Settings.

| Capability | Providers |
|---|---|
| **Embedding** | Google (`text-embedding-004`), OpenAI, Voyage, Cohere, Ollama |
| **LLM** | Google (Gemini), OpenAI (GPT), Anthropic (Claude), Ollama |
| **Vision** | Google, OpenAI |

Switching providers requires only a settings change — no code changes.


--- FILE: docs\HOW_TO_RUN.md ---

# Arkon — How to Run (Development)

## Prerequisites

| Tool | Version | Purpose |
|---|---|---|
| Python | 3.11 — 3.14 | Backend runtime |
| Node.js | 20+ | Frontend (Next.js) |
| PostgreSQL | 15+ | Main database (with pgvector extension) |
| Redis | 7+ | Background job queue |
| MinIO | Latest | S3-compatible file storage |

## 1. Infrastructure

Start PostgreSQL, Redis, and MinIO. If you have Docker:

```bash
# PostgreSQL with pgvector
docker run -d --name arkon-pg \
  -e POSTGRES_USER=arkon \
  -e POSTGRES_PASSWORD=arkon_secret \
  -e POSTGRES_DB=arkon \
  -p 5432:5432 \
  pgvector/pgvector:pg16

# Redis
docker run -d --name arkon-redis -p 6379:6379 redis:7-alpine

# MinIO
docker run -d --name arkon-minio \
  -e MINIO_ROOT_USER=minioadmin \
  -e MINIO_ROOT_PASSWORD=minioadmin123 \
  -p 9000:9000 -p 9001:9001 \
  minio/minio server /data --console-address ":9001"
```

## 2. Environment

```bash
cp .env.local.example .env.local
```

Minimum values to set in `.env.local`:

```env
SECRET_KEY=<generate with: python -c "import secrets; print(secrets.token_urlsafe(32))">
DEFAULT_ADMIN_EMAIL=admin@yourcompany.com
DEFAULT_ADMIN_PASSWORD=change-this-password
MINIO_SECRET_KEY=minioadmin123   # match your MinIO password above
```

## 3. Install Dependencies

```bash
# Create virtual environment
python -m venv .venv

# Activate
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install
pip install -e ".[dev]"
```

## 4. Database Migration

```bash
alembic upgrade head
```

> Creates: `sources`, `wiki_pages`, `wiki_links`, `knowledge_types`, `departments`,
> `employees`, `knowledge_scopes`, `contacts`, `notes`, `app_config`, and more.
>
> Also seeds 5 default knowledge types: General, SOP, Product, Project, Customer.

## 5. Install Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5055
```

## 6. Start Services

You need **4 terminals**.

### Terminal 1: API Server

```bash
uvicorn app.main:app --host 0.0.0.0 --port 5055 --reload
```

On first startup, Arkon will:
- Create the MinIO bucket if it doesn't exist
- **Auto-create the default admin account** from `.env.local` (if no admin exists yet)

You should see:
```
SUCCESS  Default admin created: admin@arkon.local
SUCCESS  Arkon MCP Server ready at /mcp
SUCCESS  Arkon API started successfully
```

### Terminal 2: Wiki Worker

```bash
python -m arq app.worker.WorkerSettings
```

Processes document ingestion: text extraction, image captioning, and LLM wiki compilation. Documents stay at `pending` until this is running.

### Terminal 3: Skills Worker

```bash
python -m arq app.worker.SkillWorkerSettings
```

Handles AI skill package processing. Required if you use the Skills feature.

### Terminal 4: Frontend

```bash
cd frontend
npm run dev
```

Open http://localhost:3000 — log in with the admin credentials from `.env.local`.

## 7. Configure AI Providers

After first login, go to **Admin Portal → Settings** and configure:

- **Embedding model** — required for wiki page search (e.g. `text-embedding-004` / Google)
- **LLM** — required for wiki compilation; choose a model with a large context window (e.g. `gemini-2.5-pro`, `gpt-4o`, `claude-sonnet-4-5`)
- **Vision model** — optional, enables image captioning during ingestion

Without embedding + LLM config, document uploads will queue but wiki compilation will fail.

## 8. Verify

### API Health

```
http://localhost:5055/
```

### API Docs (Swagger)

```
http://localhost:5055/docs
```

### Login

```bash
curl -X POST http://localhost:5055/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@arkon.local", "password": "admin123"}'
```

Response:
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "user": {
    "id": "...",
    "name": "Admin",
    "email": "admin@arkon.local",
    "role": "admin"
  }
}
```

Use the `access_token` as `Authorization: Bearer <token>` for all admin API calls.

## 9. API Overview

### Auth
| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/login` | Login (email + password) |
| GET | `/api/auth/me` | Current user profile |
| POST | `/api/auth/change-password` | Change password |

### Admin (requires `role=admin`)
| Method | Path | Description |
|---|---|---|
| GET/PUT | `/api/settings` | Provider config (AI keys, models) |
| CRUD | `/api/departments` | Manage departments |
| CRUD | `/api/employees` | Manage employees |
| POST/DELETE | `/api/employees/:id/token` | Generate/revoke MCP token |
| CRUD | `/api/knowledge-types` | Manage knowledge types |
| CRUD | `/api/scopes` | Manage knowledge scopes |
| CRUD | `/api/sources` | Manage documents |
| POST | `/api/sources/upload` | Upload a file |
| POST | `/api/sources/url` | Add a URL source |
| POST | `/api/sources/:id/retry` | Retry ingestion for a failed source |
| CRUD | `/api/contacts` | Manage contacts |

### Wiki (requires login)
| Method | Path | Description |
|---|---|---|
| GET | `/api/wiki/pages` | List wiki pages (filterable) |
| GET | `/api/wiki/pages/:slug` | Get a wiki page with backlinks |
| GET | `/api/wiki/index` | `_index` catalog page |
| GET | `/api/wiki/log` | `_log` chronological log |
| GET | `/api/wiki/graph` | Graph nodes + edges (full or neighborhood) |

### MCP (Claude Desktop)
| Path | Auth | Description |
|---|---|---|
| `/mcp` | OAuth 2.1 / Bearer token | MCP endpoint for Claude Desktop |
| `/.well-known/oauth-authorization-server` | Public | OAuth server metadata (RFC 8414) |
| `/oauth/authorize` | Public | OAuth login form |
| `/oauth/token` | Public | OAuth token exchange |
| `/oauth/register` | Public | Dynamic client registration (RFC 7591) |

## 10. Connect Claude Desktop

Add Arkon to `claude_desktop_config.json` — just the URL, no token needed:

```json
{
  "mcpServers": {
    "arkon": {
      "url": "http://localhost:5055/mcp"
    }
  }
}
```

Restart Claude Desktop → click **Connect** → a browser opens with the Arkon login form → sign in → done.

For manual Bearer token (API testing only):

```json
{
  "mcpServers": {
    "arkon": {
      "url": "http://localhost:5055/mcp",
      "headers": { "Authorization": "Bearer ark_xxxx..." }
    }
  }
}
```

See [docs/MCP.md](MCP.md) for full connection details and troubleshooting.

## Troubleshooting

| Issue | Solution |
|---|---|
| `connection refused` on port 5432 | PostgreSQL is not running |
| `pgvector extension not found` | Use `pgvector/pgvector` Docker image, or install pgvector manually |
| `No admin created` on startup | Check `DEFAULT_ADMIN_EMAIL` / `DEFAULT_ADMIN_PASSWORD` in `.env.local` |
| Documents stuck at `pending` | Wiki worker not running — start Terminal 2 |
| Wiki pages not created after upload | Check LLM provider config in Settings; check worker logs for errors |
| Skills not processing | Skills worker not running — start Terminal 3 |
| Frontend shows "API Error" | Backend not running, or `NEXT_PUBLIC_API_URL` incorrect in `frontend/.env.local` |
| CORS errors in browser | Add `http://localhost:3000` to `CORS_ORIGINS` in backend `.env.local` |
| `requires Python 3.11` error | Use `py -3.11 -m venv .venv` to create venv with correct version |


--- FILE: docs\MCP.md ---

# MCP & Claude Integration

Arkon exposes a Model Context Protocol (MCP) server at `/mcp`. Employees connect Claude Desktop — or any MCP-compatible client — and Claude gets access to the compiled wiki, raw source documents, and AI skills, all filtered to the employee's permission scope.

---

## Connecting Claude Desktop

Arkon uses **OAuth 2.1 with PKCE** — employees authenticate through a browser login instead of manually copying tokens into config files.

### Step 1 — Add Arkon to Claude Desktop config

Locate the Claude Desktop config file:
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

Add the Arkon server — just the URL, no token needed:

```json
{
  "mcpServers": {
    "arkon": {
      "url": "https://your-arkon-server/mcp"
    }
  }
}
```

### Step 2 — Restart Claude Desktop and connect

Restart Claude Desktop. When you open a new chat, Claude will prompt you to connect to Arkon. Click **Connect** — a browser window opens with the Arkon login form.

### Step 3 — Sign in

Enter your Arkon email and password. After a successful login, the browser closes and Claude Desktop is connected. Arkon tools will appear in Claude's tool list.

> **Behind the scenes:** Arkon implements RFC 8414 (OAuth Authorization Server Metadata), RFC 7591 (Dynamic Client Registration), and Authorization Code + PKCE (RFC 7636). Claude Desktop discovers the OAuth endpoints automatically from `/.well-known/oauth-authorization-server` and handles the full flow.

---

## Connecting Claude.ai (web)

Claude.ai supports remote MCP connectors with OAuth. Go to **Claude.ai → Settings → Connectors → Add custom connector**:

| Field | Value |
|---|---|
| Name | `Arkon` |
| Remote MCP server URL | `https://your-arkon-server/mcp` |
| OAuth Client ID | *(leave blank)* |
| OAuth Client Secret | *(leave blank)* |

Click **Add** — Claude.ai will discover the OAuth endpoints and redirect you to the Arkon login form.

---

## Authentication

Every MCP request is authenticated via bearer token resolved from the OAuth flow. The token is tied to an employee identity that determines:
- Which knowledge types the employee can access
- Which departments' documents are visible
- Which workspaces they are a member of
- Whether they have write/review permissions

Tokens can be revoked at any time from the Admin Portal (**Employees → [employee] → Revoke Token**).

### Legacy: manual Bearer token (local dev / API testing)

For local development or direct API testing you can still use a token directly. Generate one from the Admin Portal (**Employees → [employee] → Generate Token**) and pass it as a header:

```
Authorization: Bearer ark_xxxxxxxxxxxxxxxxxxxx
```

Or add it to `claude_desktop_config.json` manually:

```json
{
  "mcpServers": {
    "arkon": {
      "url": "http://localhost:5055/mcp",
      "headers": {
        "Authorization": "Bearer ark_xxxxxxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

> **Note:** Claude Desktop's UI does not support custom headers directly — this only works by editing the config file manually.

---

## Getting Claude to consistently use Arkon

Claude doesn't always call MCP tools automatically. Two ways to improve this:

### 1. MCP server instructions (built-in)

Arkon's MCP server already sends instructions to Claude on connect, telling it to query Arkon first before answering company-related questions. This works automatically with no setup.

### 2. Claude Desktop Custom Instructions (recommended)

In Claude Desktop, go to **Settings → Custom Instructions** and add:

```
Whenever answering questions related to the company — its processes, products,
people, departments, policies, or projects — always search Arkon first using
the search_wiki tool before relying on general knowledge.
```

### 3. Claude Desktop Project Instructions (most effective)

Create a **Project** in Claude Desktop, add Arkon as a connector within that Project, and set Project Instructions. These act as a true system prompt scoped to that project:

```
You have access to the company knowledge base via Arkon.
Before answering any question that might have a company-specific answer,
call search_wiki to check Arkon. Always cite the wiki slug or source ID
in your answer so the user can verify.
```

---

## MCP Tool Reference

Tools are organized in four tiers by permission level.

### Tool visibility by identity

`tools/list` is filtered per bearer token: a tool only appears in the catalog
if the caller's `ResolvedIdentity` could actually use it. This is enforced by
`ScopedToolsMiddleware` ([app/mcp/middleware.py](../app/mcp/middleware.py)).

| Caller | Visible tiers |
|---|---|
| Admin (`role = admin`) | All tiers |
| Org perm `wiki:write:all` | Read + Contribute + Review + Direct-write |
| Workspace editor (in any workspace) | Read + Contribute + Review + Direct-write |
| Org perm `wiki:write:own_dept` | Read + Contribute |
| Workspace contributor (in any workspace) | Read + Contribute |
| Workspace viewer only / read-only employee | Read |
| Unauthenticated / invalid token | Read, with an "Authenticate to use" hint prepended to every description |

**Visibility is a UX gate, not a security boundary.** A client may still invoke
any tool by name regardless of whether it appeared in the catalog. Per-tool
permission checks inside tool bodies (e.g. `_can_review_page` for a specific
draft's parent page) remain authoritative and MUST NOT be removed.

Role / token changes are not pushed mid-session. To pick up a new role, the
client should reconnect to the MCP server.

---

### Tier 1 — Read (all authenticated employees)

#### `search_wiki`
Semantic search across the knowledge wiki. Results are filtered to the employee's permission scope.

```
search_wiki(query: str, top_k: int = 5) → list of pages with similarity scores
```

#### `read_wiki_page`
Read the full markdown content of a specific wiki page.

```
read_wiki_page(slug: str) → page content, title, summary, backlinks, version
```

#### `list_wiki_pages`
Browse wiki pages by type or knowledge category.

```
list_wiki_pages(page_type?: str, knowledge_type_slug?: str, limit: int = 20)
```

#### `read_wiki_index`
Get the full wiki catalog (all pages with slug, type, summary).

```
read_wiki_index() → catalog of all accessible pages
```

#### `list_sources`
Browse uploaded source documents visible to this employee.

```
list_sources(knowledge_type_slug?: str, limit: int = 20)
```

#### `get_source`
Get metadata and processing status for a source document.

```
get_source(source_id: str) → title, type, status, knowledge_type
```

#### `get_source_outline`
Get the table of contents (heading tree) of a source document.

```
get_source_outline(source_id: str) → hierarchical heading structure
```

#### `get_source_pages`
Read raw text from specific pages of a source document. Useful for exact citations.

```
get_source_pages(source_id: str, pages: str) → raw text (e.g. pages="5-7")
```

#### `find_contacts`
Search the internal people directory.

```
find_contacts(query: str) → matching contacts with name, role, contact info
```

#### `list_knowledge_types`
List all knowledge type categories defined in the system.

```
list_knowledge_types() → name, slug, description for each type
```

#### `get_knowledge_type_docs`
List all source documents of a specific knowledge type.

```
get_knowledge_type_docs(knowledge_type_slug: str) → documents in this category
```

---

### Tier 2 — Contribute (workspace contributor+, or `wiki:write:own_dept`)

#### `propose_wiki_edit`
Propose an edit to an existing wiki page. Creates a pending draft that goes through editor review before being applied.

```
propose_wiki_edit(slug: str, content_md: str, note?: str)
→ "Draft submitted. An editor will review it. Draft ID: ..."
```

Use `search_wiki()` or `read_wiki_index()` to find the right slug first.

---

### Tier 3 — Direct Edit (workspace editor+, or `wiki:write:all` for global pages)

#### `edit_wiki_page`
Directly edit a wiki page. The change takes effect immediately — no review step. A revision is created in history.

```
edit_wiki_page(slug: str, content_md: str, change_note?: str)
→ "Page '{slug}' updated to v{version}."
```

Use `propose_wiki_edit()` instead if you only have contributor access.

---

### Tier 4 — Review (workspace editor+, or `wiki:write:all`)

#### `list_pending_drafts`
List pending wiki drafts awaiting your review. Optionally filter by workspace.

```
list_pending_drafts(workspace_id?: str)
→ formatted list with draft_id, page_slug, author, created_at, note
```

#### `review_draft`
Read the full content of a pending draft alongside the current page content for comparison.

```
review_draft(draft_id: str)
→ proposed content + current page content side by side
```

#### `approve_draft`
Approve a pending draft. Optionally provide edited content before approving.

```
approve_draft(draft_id: str, reviewer_note?: str, edited_content_md?: str)
→ "Draft approved. Page updated to v{version}."
```

#### `reject_draft`
Reject a pending draft. `reviewer_note` is required — the contributor needs to know why.

```
reject_draft(draft_id: str, reviewer_note: str)
→ "Draft rejected."
```

---

### Tier 5 — needs_revision flow (workspace editor+ / author)

#### `request_changes_on_draft`
Send a pending draft back to the author for revisions without rejecting it. The draft is kept and its `revision_round` will bump on resubmit.

```
request_changes_on_draft(draft_id: str, reviewer_note: str)
→ "Draft returned to author with note: ..."
```

#### `resubmit_draft`
Author resubmits a draft that was sent back. Bumps `revision_round`, snapshots the previous content + AI verdict to `wiki_draft_rounds`, flips status back to `pending`, and re-enqueues AI pre-review.

```
resubmit_draft(draft_id: str, content_md: str, note?: str)
→ "Draft resubmitted (round N). Reviewers have been notified."
```

#### `withdraw_draft`
Author withdraws their own pending or needs-revision draft.

```
withdraw_draft(draft_id: str)
→ "Draft withdrawn."
```

---

### Tier 6 — Create new pages

#### `propose_wiki_create`
Propose a brand-new wiki page (contributor+). The page is materialised when an editor approves the draft — the reviewer can override the suggested slug / title / page_type / tags before commit.

```
propose_wiki_create(
  slug, title, content_md,
  page_type="concept",
  knowledge_type_slugs=[],
  scope_type="global", scope_id?,
  note?,
) → "Create draft submitted (Draft ID: ...). An editor will review."
```

#### `create_wiki_page`
Directly create a new wiki page (editor / admin — no review).

```
create_wiki_page(
  slug, title, content_md,
  page_type="concept",
  knowledge_type_slugs=[],
  scope_type="global", scope_id?,
) → "Page '{slug}' created at v1."
```

---

## Out-of-scope discovery hint

When a non-admin caller searches or reads a slug that exists in a scope they cannot access (a different department, a workspace they aren't a member of), the tools return a hint rather than silently hiding it:

```
search_wiki → response appends:
   **Out-of-scope matches** — matching page(s) exist outside your access:
   - 3 page(s) in department **HR** — contact the HR department admin to request access.
   - 1 page(s) in workspace **Marketing** — contact the workspace admin to be added as a member.

read_wiki_page → returns:
   Wiki page `slug` exists in department **HR** but you don't have access.
   Contact the scope's admin to request access.
```

The hint deliberately leaks **only** the scope label + count. Page titles, summaries, and content are never surfaced across a permission boundary. Admins bypass the hint because they already see everything.

---

## Permission scope in MCP

When an employee connects via MCP, their token resolves to a `ResolvedIdentity` that carries:

| Field | Meaning |
|---|---|
| `employee_id`, `employee_name` | Authenticated identity |
| `department_id`, `department_name` | The employee's department |
| `allowed_knowledge_types` | KT slugs the employee can access (`None` = unrestricted) |
| `allowed_source_ids` | Source IDs reachable via department / KT scope (`None` = unrestricted) |
| `project_ids` | UUIDs of active workspaces the employee is a member of |
| `project_source_ids` | Source IDs linked to those workspaces |
| `permissions` | Effective permission strings (e.g. `wiki:write:all`) |
| `is_admin` | System-admin override — bypasses all scope filters |

The wiki layer ORs three branches when filtering pages: global + own_dept + every workspace in `project_ids`. Workspace-scoped pages are now visible to their members via `search_wiki` / `list_wiki_pages` / `read_wiki_page` — this used to be a blindspot prior to commit `7676df5`.

### Tokens are hashed at rest

The MCP token returned by `generate_token` is the only time the plaintext exists outside the caller. Storage:

| Column | Holds |
|---|---|
| `employees.mcp_token_hash` | `HMAC-SHA256(MCP_TOKEN_PEPPER, plaintext)`, hex |
| `employees.mcp_token_prefix` | First 12 chars of plaintext, for UI display |
| `employees.mcp_token_rotated_at` | When the current token was issued |

Verification recomputes the HMAC and looks up `mcp_token_hash`. A DB dump alone — without `MCP_TOKEN_PEPPER` — cannot forge tokens. Migration `027` zeroed every legacy plaintext token, so every user **must** rotate after deploying 0.7.2+.

### `last_connected` debounce

`verify_token` only writes `employees.last_connected` if the previous value is `>60s` old. The check is best-effort under concurrency — N simultaneous tool calls from one user can each decide to bump, but the spam is bounded by the single user's request rate, not Redis latency.

---

## Token management

| Action | Where |
|---|---|
| Generate token | Admin Portal → Employees → [employee] → Generate Token |
| Revoke token | Admin Portal → Employees → [employee] → Revoke Token |
| View active tokens | Admin Portal → Employees → [employee] → Tokens |

A single employee can have multiple active tokens (e.g. Claude Desktop + Claude.ai).

---

## Using Arkon with Claude.ai (remote MCP)

Claude.ai supports remote MCP servers. Add Arkon as a remote server with the same URL and token:

```
URL: https://your-arkon-server/mcp
Header: Authorization: Bearer ark_xxxxxxxxxxxxxxxxxxxx
```

The same tools and permission scoping apply.

---

## Example conversation

```
Employee: What is our fire safety evacuation procedure?

Claude: [calls search_wiki("fire safety evacuation")]
        [reads wiki page concept/fire-evacuation-procedure]

Based on your organization's SOPs, the fire safety evacuation procedure is...
[synthesized answer from the compiled wiki page]

For the exact wording from the original document, I can check:
[calls get_source_outline(source_id="...")]
[calls get_source_pages(source_id="...", pages="12-14")]
```

---

## Token management

| Action | Where |
|---|---|
| View token status | Admin Portal → Employees → [employee] → Tokens |
| Revoke token | Admin Portal → Employees → [employee] → Revoke Token |
| Generate token manually | Admin Portal → Employees → [employee] → Generate Token |

Self-service: employees can also manage their own token at **Profile → MCP Token**.

---

## Troubleshooting MCP connections

| Issue | Solution |
|---|---|
| "Couldn't connect" at start of OAuth flow | Arkon server not reachable, or OAuth endpoints not deployed — verify `GET /.well-known/oauth-authorization-server` returns JSON |
| Login form shows `http://` URLs instead of `https://` | Uvicorn not started with `--proxy-headers` — ensure `X-Forwarded-Proto` is forwarded by your reverse proxy |
| "Couldn't connect" after login | Token exchange failed — check server logs for errors in `/oauth/token` |
| Tools don't appear in Claude | Restart Claude Desktop after config changes |
| "Invalid or inactive token" | Token revoked — reconnect via OAuth to get a new one |
| Tools return empty results | Employee has no accessible knowledge types — check their role in the Admin Portal |
| Connection refused | Arkon API not running or not reachable from the client network |
| HTTPS certificate errors | Configure a valid TLS certificate on your Arkon server |
| Claude doesn't use Arkon tools | Add instructions in Claude Desktop Custom Instructions or Project Instructions (see above) |


--- FILE: docs\SETUP.md ---

# Setup Guide

Two ways to run Arkon: **Docker** (recommended for production) or **Development** (for local development and contributing).

---

## Option A — Docker (Production)

### Prerequisites

**Software**
- Docker Engine 24+
- Docker Compose v2+
- An API key for your AI provider (Google, OpenAI, or Anthropic)

**Server — recommended specs**

| | **Starter** | **Team** | **Enterprise** |
|---|:---:|:---:|:---:|
| **Team size** | 1–20 | 20–100 | 100+ |
| **vCPU** | 2 cores | 4 cores | 8+ cores |
| **RAM** | 4 GB | 8 GB | 16+ GB |
| **Storage** | 40 GB SSD | 100 GB SSD | 250+ GB NVMe |
| **OS** | Ubuntu 22.04+ | Ubuntu 22.04+ | Ubuntu 22.04+ |

> RAM is the primary bottleneck — the MRP pipeline workers load large LLM context windows during wiki compilation. All AI inference is external (Anthropic / Google / OpenAI), so no GPU is required.

**Domain & HTTPS — required for MCP**

Claude Desktop and Claude.ai connect to Arkon's MCP server using OAuth 2.1, which requires HTTPS. You need:

- A **public domain** pointing to your server (e.g. `arkon.yourcompany.com`)
- A **valid TLS certificate** — Certbot/Let's Encrypt works fine
- A **reverse proxy** (Nginx recommended) forwarding traffic to the containers
- The API specifically needs `X-Forwarded-Proto` passed through so OAuth URLs are generated with `https://`

> For local development without a domain, use a manual Bearer token instead of OAuth. See [MCP & Claude](MCP.md).

### 1. Clone and configure

```bash
git clone https://github.com/nduckmink/arkon.git
cd arkon
cp .env.docker.example .env.docker
```

> Arkon ships **two** env templates: `.env.docker.example` for `docker compose`, and `.env.local.example` for local development (Option B). They differ only in service hostnames (container names vs. `localhost`).

Edit `.env.docker`:

```env
# Required: generate a strong random secret
SECRET_KEY=<run: python -c "import secrets; print(secrets.token_urlsafe(32))">

# Required: admin account created on first startup
DEFAULT_ADMIN_EMAIL=admin@yourcompany.com
DEFAULT_ADMIN_PASSWORD=your-secure-password

# Required: PostgreSQL credentials — must be consistent across all three vars and DATABASE_URL
POSTGRES_USER=arkon
POSTGRES_PASSWORD=your-postgres-password
POSTGRES_DB=arkon
DATABASE_URL=postgresql+asyncpg://arkon:your-postgres-password@postgres:5432/arkon

# Required: MinIO credentials — MINIO_ACCESS_KEY / MINIO_SECRET_KEY initialise the MinIO
# container on first run; changing them after first start requires resetting the volume
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=your-minio-secret

# Optional: restrict CORS in production
CORS_ORIGINS=https://your-domain.com

# Required: your public API URL (used by the frontend browser)
NEXT_PUBLIC_API_URL=https://your-domain.com
```

> The full `.env.docker.example` documents every available variable.

### 2. Start

```bash
docker compose --env-file .env.docker up -d --build
```

This starts all containers:
| Container | Purpose |
|---|---|
| `arkon_postgres` | PostgreSQL 16 with pgvector (port 5432) |
| `arkon_redis` | Redis 7 job queue (port 6379) |
| `arkon_minio` | MinIO file storage (port 9000, console 9001) |
| `arkon_api` | FastAPI backend + MCP server (port 5055) |
| `arkon_worker` | Background worker — document ingestion + wiki compilation |
| `arkon_worker_skills` | Background worker — AI skill processing |
| `arkon_frontend` | Next.js admin portal (port 3119) |

Workers start only after `arkon_api` passes its health check, so there is no race condition on startup.

> **Important:** always pass `--env-file .env.docker` explicitly — both for `build` and `up`. Without it, Docker Compose falls back to `.env` (your local dev config). This causes two classes of errors:
> - MinIO `SignatureDoesNotMatch` — credentials mismatch
> - Frontend still calls `localhost:5055` — `NEXT_PUBLIC_API_URL` is a **build-time** variable baked into the JS bundle by Next.js. Changing `.env.docker` and restarting the container has no effect; you must rebuild the image with the correct `--env-file`.

### 3. First login

Open **http://your-server:3119** and log in with the credentials from `.env.docker`.

### 4. Configure AI providers

Go to **Settings** and configure:

| Setting | Required | Notes |
|---|---|---|
| **Embedding model** | Yes | Used for semantic wiki search. E.g. `text-embedding-004` (Google) |
| **LLM** | Yes | Used for wiki compilation. Choose a large-context model. |
| **Vision model** | No | Enables image captioning during PDF ingestion |

Recommended LLMs for wiki compilation (large context window):
- `gemini-2.5-pro` (Google) — best results
- `gpt-4o` (OpenAI)
- `claude-sonnet-4-5` or newer (Anthropic)

### 5. Run database migrations

```bash
docker exec arkon_api alembic upgrade head
```

> On first startup, the API runs migrations automatically before serving requests. You only need to run this manually after upgrading Arkon.

---

## Option A2 — Deploying to a Linux server

This section covers what changes when running on a remote server (Ubuntu 22.04+ recommended) instead of a local machine.

### 1. Install Docker Engine

On the server (do **not** install Docker Desktop — use Docker Engine directly):

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker
```

Verify:

```bash
docker version
docker compose version   # must be v2+
```

### 2. Open firewall ports

Arkon needs these ports accessible from users' browsers:

```bash
sudo ufw allow 3119/tcp   # Frontend
sudo ufw allow 5055/tcp   # API (and MCP endpoint)
sudo ufw allow 9000/tcp   # MinIO (presigned file URLs)
sudo ufw enable
```

> Do **not** expose port 5432 (PostgreSQL), 6379 (Redis), or 9001 (MinIO console) externally.

### 3. Clone and configure

```bash
git clone https://github.com/nduckmink/arkon.git
cd arkon
cp .env.docker.example .env.docker
```

Edit `.env.docker` — the key differences from local Docker setup:

```env
# Generate strong secrets
SECRET_KEY=<python3 -c "import secrets; print(secrets.token_urlsafe(32))">
POSTGRES_PASSWORD=<strong-random-password>
POSTGRES_DB=arkon
DATABASE_URL=postgresql+asyncpg://arkon:<strong-random-password>@postgres:5432/arkon
MINIO_SECRET_KEY=<strong-random-password>

# Admin account
DEFAULT_ADMIN_EMAIL=admin@yourcompany.com
DEFAULT_ADMIN_PASSWORD=<strong-password>

# Use the server's public IP or domain — NOT localhost
MINIO_PUBLIC_ENDPOINT=<server-ip-or-domain>:9000
NEXT_PUBLIC_API_URL=http://<server-ip-or-domain>:5055

# Restrict CORS to your frontend URL
CORS_ORIGINS=http://<server-ip-or-domain>:3119
```

> **`MINIO_PUBLIC_ENDPOINT` is the most important difference.** On a local machine it's `localhost:9000`. On a server it must be the server's public IP or domain, otherwise presigned image/file URLs will point to an unreachable address.

### 4. Start

```bash
docker compose --env-file .env.docker up -d --build
```

Check all containers are healthy:

```bash
docker compose ps
```

All services should show `healthy` or `running`. The `worker` and `worker_skills` containers start only after `arkon_api` passes its health check (~30 seconds).

### 5. Verify

```bash
# API health
curl http://localhost:5055/health

# Should return: {"status": "ok", ...}
```

Open `http://<server-ip>:3119` from your browser and log in.

---

### Optional: Nginx reverse proxy (custom domain + SSL)

Required for MCP with Claude Desktop / Claude.ai — OAuth 2.1 needs HTTPS.

**Recommended DNS setup**

| Record | Points to | Purpose |
|---|---|---|
| `arkon.yourcompany.com` | server IP | Frontend + API + MCP |
| `minio.yourcompany.com` | server IP | MinIO presigned file URLs |

You can serve frontend and API from the same domain using path routing (shown below), or use separate subdomains — either works.

**Nginx config** (`/etc/nginx/sites-available/arkon`)

```nginx
# Redirect HTTP → HTTPS
server {
    listen 80;
    server_name arkon.yourcompany.com minio.yourcompany.com;
    return 301 https://$host$request_uri;
}

# API + MCP server
server {
    listen 443 ssl http2;
    server_name arkon.yourcompany.com;

    ssl_certificate     /etc/letsencrypt/live/arkon.yourcompany.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/arkon.yourcompany.com/privkey.pem;
    include             /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam         /etc/letsencrypt/ssl-dhparams.pem;

    add_header X-Frame-Options        "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    client_max_body_size 100M;

    # MCP endpoint (Streamable HTTP — no SSE buffering needed)
    location /mcp {
        proxy_pass http://127.0.0.1:5055;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;   # required for OAuth https:// URLs
        proxy_set_header Connection        "";
        proxy_read_timeout 300s;
    }

    # OAuth endpoints + REST API
    location / {
        proxy_pass http://127.0.0.1:5055;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;   # required for OAuth https:// URLs
        proxy_set_header Upgrade           $http_upgrade;
        proxy_set_header Connection        "upgrade";
        proxy_read_timeout 300s;
    }
}

# MinIO (for presigned file URLs)
server {
    listen 443 ssl http2;
    server_name minio.yourcompany.com;

    ssl_certificate     /etc/letsencrypt/live/minio.yourcompany.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/minio.yourcompany.com/privkey.pem;
    include             /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam         /etc/letsencrypt/ssl-dhparams.pem;

    client_max_body_size 500M;

    location / {
        proxy_pass http://127.0.0.1:9000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

> **`X-Forwarded-Proto $scheme` is critical.** Without it, Arkon's OAuth metadata endpoint returns `http://` URLs, and Claude Desktop will fail to complete the OAuth flow.

Enable the site and get certificates:

```bash
sudo ln -s /etc/nginx/sites-available/arkon /etc/nginx/sites-enabled/
sudo nginx -t

sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d arkon.yourcompany.com -d minio.yourcompany.com

sudo systemctl reload nginx
```

Update `.env.docker` to use your domain:

```env
NEXT_PUBLIC_API_URL=https://arkon.yourcompany.com
MINIO_PUBLIC_ENDPOINT=minio.yourcompany.com
MINIO_SECURE=true
CORS_ORIGINS=https://arkon.yourcompany.com
```

Rebuild and restart:

```bash
docker compose --env-file .env.docker up -d --build
```

---

## Option B — Development

### Prerequisites

| Tool | Version | Purpose |
|---|---|---|
| Python | 3.11 – 3.14 | Backend runtime |
| Node.js | 20+ | Frontend (Next.js) |
| PostgreSQL | 15+ with pgvector | Main database |
| Redis | 7+ | Background job queue |
| MinIO | Latest | File storage |

### 1. Infrastructure

Start infrastructure services with Docker:

```bash
# PostgreSQL with pgvector
docker run -d --name arkon-pg \
  -e POSTGRES_USER=arkon \
  -e POSTGRES_PASSWORD=arkon_secret \
  -e POSTGRES_DB=arkon \
  -p 5432:5432 \
  pgvector/pgvector:pg16

# Redis
docker run -d --name arkon-redis -p 6379:6379 redis:7-alpine

# MinIO
docker run -d --name arkon-minio \
  -e MINIO_ROOT_USER=minioadmin \
  -e MINIO_ROOT_PASSWORD=minioadmin123 \
  -p 9000:9000 -p 9001:9001 \
  minio/minio server /data --console-address ":9001"
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

For local development, the defaults in `.env.local.example` work out of the box except:

```env
SECRET_KEY=dev-only-not-for-production
DEFAULT_ADMIN_EMAIL=admin@arkon.local
DEFAULT_ADMIN_PASSWORD=admin123
MINIO_SECRET_KEY=minioadmin123
```

### 3. Python backend

```bash
# Create and activate a virtual environment
python -m venv .venv

# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

# Install dependencies
pip install -e ".[dev]"

# Run database migrations
alembic upgrade head
```

### 4. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5055
```

### 5. Start all services (3 terminals)

**Terminal 1 — API server:**
```bash
uvicorn app.main:app --host 0.0.0.0 --port 5055 --reload
```

On first startup you should see:
```
SUCCESS  MinIO bucket ready
SUCCESS  Default admin created: admin@arkon.local
SUCCESS  Arkon MCP Server ready at /mcp
SUCCESS  Arkon API started successfully
```

**Terminal 2 — Wiki worker:**
```bash
python -m arq app.worker.WorkerSettings
```

**Terminal 3 — Frontend:**
```bash
cd frontend
npm run dev
```

Open **http://localhost:3000**.

> Documents will stay at `pending` status until the worker is running.

---

## First steps after setup

### 1. Configure AI providers
Settings → configure embedding model, LLM, and vision model.

### 2. Create a department
Admin Portal → Departments → New Department.

### 3. Create a knowledge type
Admin Portal → Knowledge Types → New Type (e.g. "SOP", "Product Docs").

### 4. Upload a document
Knowledge Base → Upload → select file or paste URL → choose knowledge type → submit.

Watch the progress indicator. Once complete, click Wiki to browse the compiled pages.

### 5. Create employees
Admin Portal → Employees → New Employee → assign department and role.

Employees connect to Arkon via OAuth — no manual token generation needed. They sign in through the browser when they first connect Claude Desktop or Claude.ai.

> If you need a Bearer token for API testing or local dev (no HTTPS), use **Employee → Generate Token** on the employee detail page.

### 6. Connect Claude Desktop or Claude.ai

In **Claude Desktop** or **Claude.ai → Settings → Connectors**, add a custom connector:

- **Name:** `Arkon`
- **URL:** `https://arkon.yourcompany.com/mcp`

Click **Connect** → browser opens Arkon login form → sign in → done.

See [MCP & Claude](MCP.md) for the full connection guide, tool reference, and tips on getting Claude to consistently use Arkon.

---

## Environment variables reference

| Variable | Default | Description |
|---|---|---|
| `POSTGRES_USER` | `arkon` | PostgreSQL username — used to initialise the postgres container |
| `POSTGRES_PASSWORD` | — | PostgreSQL password — must match the value in `DATABASE_URL` |
| `POSTGRES_DB` | `arkon` | PostgreSQL database name — must match the value in `DATABASE_URL` |
| `DATABASE_URL` | — | Full asyncpg connection string — must be consistent with `POSTGRES_*` vars |
| `SECRET_KEY` | — | JWT signing secret. Must be changed in production. |
| `DEFAULT_ADMIN_EMAIL` | `admin@arkon.local` | Admin account email (created on first startup) |
| `DEFAULT_ADMIN_PASSWORD` | `admin123` | Admin account password |
| `MINIO_ENDPOINT` | `minio:9000` | MinIO server address used internally by the API (Docker service name; local: `localhost:9000`) |
| `MINIO_PUBLIC_ENDPOINT` | _(same as `MINIO_ENDPOINT`)_ | Public MinIO address embedded in presigned URLs. Must be browser-accessible: `localhost:9000` on local Docker, `<server-ip>:9000` on a remote server |
| `MINIO_ACCESS_KEY` | `minioadmin` | MinIO root user — initialises the container on first run |
| `MINIO_SECRET_KEY` | — | MinIO root password — initialises the container on first run; changing it after first start requires `docker compose down -v` |
| `MINIO_BUCKET` | `arkon-files` | Bucket name for uploaded files |
| `MINIO_SECURE` | `false` | Use HTTPS for MinIO (`true` in production) |
| `REDIS_HOST` | `redis` | Redis host (Docker: service name; local: `localhost`) |
| `REDIS_PORT` | `6379` | Redis port |
| `REDIS_PASSWORD` | _(empty)_ | Redis password |
| `WORKER_MAX_JOBS` | `3` | Max concurrent background jobs |
| `CORS_ORIGINS` | `*` | Allowed CORS origins (comma-separated) |
| `NEXT_PUBLIC_API_URL` | `http://localhost:5055` | Public API URL (used by the browser) |
| `INTERNAL_API_URL` | `http://api:5055` | Internal API URL used by the Next.js server for proxying (Docker only) |

AI provider settings (embedding, LLM, vision, API keys) are configured through the Admin Portal → Settings, not in env files.

---

## Troubleshooting

| Issue | Solution |
|---|---|
| `connection refused` on port 5432 | PostgreSQL not running |
| `pgvector extension not found` | Use `pgvector/pgvector` Docker image |
| Documents stuck at `pending` | Wiki worker not running |
| Wiki pages not created after upload | Check LLM config in Settings; check worker logs |
| Frontend shows API error | Backend not running, or `NEXT_PUBLIC_API_URL` incorrect |
| CORS errors in browser | Add frontend URL to `CORS_ORIGINS` in `.env.docker` (or `.env.local` for dev) |
| `requires Python 3.11` | Use `py -3.11 -m venv .venv` to select correct version |
| MCP connection refused | Ensure the API is accessible from outside (check firewall/proxy) |
| OAuth "Couldn't connect" in Claude Desktop | Server not reachable, or `/.well-known/oauth-authorization-server` returning 404 — verify the API is running and Nginx is routing correctly |
| OAuth login form shows `http://` URLs | Nginx not forwarding `X-Forwarded-Proto` — add `proxy_set_header X-Forwarded-Proto $scheme;` to both `/mcp` and `/` location blocks |
| Claude Desktop connected but tools not used | Add instructions to Claude's Custom Instructions or a Project — see [MCP & Claude](MCP.md) |
| MinIO `SignatureDoesNotMatch` | Credentials mismatch — likely caused by running `docker compose up` without `--env-file .env.docker`, which makes Docker Compose use your local `.env` to initialise MinIO. Fix: `docker compose down -v` then `docker compose --env-file .env.docker up -d --build` |
| MinIO `Invalid Request (invalid hostname)` | `MINIO_ENDPOINT` contains an underscore (e.g. `arkon_minio`). Use the Docker Compose service name instead: `minio:9000` |
| Images/files not loading in browser (`ERR_NAME_NOT_RESOLVED`) | Presigned URLs are pointing to an internal hostname. Set `MINIO_PUBLIC_ENDPOINT` to a browser-accessible address: `localhost:9000` for local Docker, `<server-ip>:9000` for a remote server |
| Frontend still calls `localhost:5055` after changing `NEXT_PUBLIC_API_URL` | `NEXT_PUBLIC_*` variables in Next.js are baked into the bundle at **build time**, not runtime. Changing `.env.docker` and restarting the container has no effect. You must rebuild the image: `docker compose --env-file .env.docker build --no-cache frontend && docker compose --env-file .env.docker up -d` |


--- FILE: docs\SKILLS.md ---

# AI Skills

AI Skills are versioned agent packages that employees can access through Claude via MCP. Upload a skill package, assign it to departments or workspaces, and it becomes available in Claude's tool context for employees with the right permissions.

---

## What is a Skill?

A Skill is a packaged capability — a custom agent, a specialized prompt, or a tool bundle — that your organization develops and distributes through Arkon. Think of it as an internal app store for AI capabilities.

Examples:
- A **document generator** that fills in report templates from structured input
- A **contract reviewer** trained on your organization's legal standards
- A **customer profile builder** that pulls from your CRM data format
- A **translation agent** calibrated to your industry's terminology

Skills are uploaded as packages, versioned, and scoped to specific departments or workspaces. When a scoped employee connects via MCP, their permitted skills are available to Claude automatically.

---

## Uploading a Skill

**Admin Portal → Skills → Upload Skill**

Required:
- **Name** — human-readable skill name
- **Slug** — URL-safe identifier (e.g. `document-generator`)
- **Package file** — the skill package (format depends on your implementation)
- **Description** — what this skill does

Optional:
- **Department scope** — restrict to specific departments (no departments = global, visible to all)
- **Knowledge type** — associate the skill with a knowledge category

The background skill worker processes the uploaded package. Status progresses: `pending` → `processing` → `active`.

---

## Versioning

Every skill has a version history:
- `current_version` — active version number (integer)
- Each upload or update creates a new `SkillVersion` record with a version hash and storage path
- Changelog notes are optional but recommended

To release a new version:
**Admin Portal → Skills → [skill name] → Upload New Version**

Old versions are preserved. Rolling back to a previous version is available from the version history panel.

---

## Access control

Skills follow the same dual-realm permission model as documents and wiki:

**Global realm (department-based):**
- No departments assigned → **Global skill** — visible to all employees with `skill:read:own_dept` or higher
- Departments assigned → visible only to employees whose department matches

**Workspace realm:**
- Skills can be scoped to a specific workspace (`scope_type = project`)
- Only workspace members can access workspace-scoped skills

**Permission levels:**
| Permission | What it grants |
|---|---|
| `skill:read:own_dept` | View and use skills in your department + global skills |
| `skill:read:all` | View and use all skills across all departments |
| `skill:create:own_dept` | Upload skills to your department |
| `skill:create:all` | Upload skills to any department |
| `skill:edit:own_dept` | Edit skill metadata in your department |
| `skill:edit:all` | Edit any skill |
| `skill:delete:own_dept` | Delete skills in your department |
| `skill:delete:all` | Delete any skill |

---

## Skill visibility in MCP

When an employee connects Claude via MCP:
1. Arkon resolves their identity and permission scope
2. Skills accessible to this employee (based on department + workspace membership) are included in the MCP context
3. Claude can reference and use these skills in conversation

Skills that are `processing`, `deprecated`, or `archived` are not surfaced in MCP.

---

## Skill lifecycle

```
Upload package
    │
    ▼
status: pending
    │
    ▼ (skill worker processes)
status: processing
    │
    ▼
status: active  ──→  available in MCP for scoped employees
    │
    ├── Update version  ──→  new SkillVersion, current_version bumped
    │
    ├── Deprecate  ──→  status: deprecated (no longer surfaced in MCP)
    │
    └── Archive  ──→  status: archived (hidden from lists)
```

---

## API reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/skills` | List skills (filtered to user's scope) |
| `POST` | `/api/skills/upload` | Upload a new skill package |
| `GET` | `/api/skills/{id}` | Get skill details |
| `PATCH` | `/api/skills/{id}` | Update skill metadata |
| `DELETE` | `/api/skills` | Delete skills (bulk) |
| `GET` | `/api/skills/{id}/versions` | List version history |
| `POST` | `/api/skills/bulk-visibility` | Set department/scope for multiple skills |


--- FILE: docs\WIKI.md ---

# Wiki System

The Arkon wiki is the primary knowledge surface. Instead of storing raw document chunks, Arkon compiles documents into structured, interlinked wiki pages — written by an LLM agent, enriched by every new document you add.

---

## How compilation works

When you upload a document, the background worker runs the **MRP pipeline** — a five-phase deterministic process that guarantees every section of the document is read and every claim is traceable back to its source.

```
Phase 0: Triage   → classify document size/strategy
Phase 1: MAP      → chunk document + parallel LLM extraction per chunk
Phase 2: REDUCE   → entity dedup + KB reconciliation → Compilation Plan
Phase 2.5: Review → human approves / modifies / rejects the plan
Phase 3: REFINE   → parallel page writers (one per planned page)
Phase 4: VERIFY   → citation check + coverage check + conflict check
Phase 5: COMMIT   → write pages to DB + embed + regenerate index
```

### Phase 0 — Triage

Classifies the document to choose the right processing strategy based on length:

| Strategy | Document size | Description |
|---|---|---|
| `single_pass` | < 30K chars | Entire document fits in one extraction call |
| `standard` | 30K–200K chars | Split into ~20K-char chunks along section headings |
| `hierarchical` | > 200K chars | Same as standard but with additional context stitching |

### Phase 1 — MAP

The document is split into chunks aligned to section headings (from `outline_json`). Each chunk is ~20K characters with a 1K-char overlap prefix from the previous section. Chunks are processed in parallel (up to 6 at once).

Each chunk extraction call returns structured JSON:

```json
{
  "entities": [{ "name": "...", "type": "person|org|product|...", "local_offset": 0 }],
  "concepts": [{ "term": "...", "definition_excerpt": "...", "local_offset": 0 }],
  "claims":   [{ "statement": "...", "subject": "...", "local_offset": 0, "evidence_length": 200 }],
  "relations": [{ "from": "...", "to": "...", "type": "..." }],
  "topics":   ["..."]
}
```

`local_offset` values are converted to `absolute_offset` (byte position in the original document) so every claim can be traced back to its exact source excerpt. Each chunk's result is saved to `source_chunk_extracts` immediately — if the worker crashes, MAP resumes from where it left off.

### Phase 2 — REDUCE

All chunk extracts are merged into a unified knowledge graph:

1. **Exact dedup** — normalize entity names (lowercase + strip punctuation), group duplicates
2. **Embedding dedup** — cosine similarity between entity name vectors; auto-merge above 0.90, LLM disambiguates 0.75–0.90
3. **KB reconciliation** — semantic search against existing wiki pages per entity:
   - sim ≥ 0.85 → `UPDATE` candidate (entity has an existing page)
   - sim 0.60–0.85 → LLM confirms whether to merge or create new
   - sim < 0.60 → `CREATE` candidate
4. **Planning call** — a single LLM call produces the **Compilation Plan**: a prioritized list of pages to create or update, each with entity coverage and cross-link targets

The plan is saved to `source_compilation_plans` with `status = pending_review`.

### Phase 2.5 — Human plan review

Before any pages are written, an editor reviews the Compilation Plan:

- **Portal:** Knowledge Base → source row with "Review Plan" status → click to open the plan review dialog
- **API:** `GET /api/sources/{id}/plan` → `POST /api/sources/{id}/plan/approve` or `/reject`

The plan shows every page that will be created or updated, its type, and the entities it will cover. Editors can approve as-is, submit a modified plan (reorder, rename, remove pages), or reject with a note.

**Auto-approve** is available for CI/CD or trusted pipelines: set `MRP_AUTO_APPROVE_PLAN=true` in your environment.

### Phase 3 — REFINE

Each planned page gets its own writer. Writers run in parallel (up to 4 at once). Every writer receives pre-assembled evidence — the relevant claims with their source excerpts — so it never needs to scan the full document.

> **Concurrency note.** Each REFINE writer opens its **own** `AsyncSession`. Sharing a single session across concurrent writers caused `IllegalStateChangeError` in 0.7.0 — fixed in commit `484e8d1`. If you ever add a new layer that touches the DB during REFINE, make sure it uses the per-writer session, not a shared one.

**Simple writer** (≤ 8 evidence items, existing page ≤ 3K chars): a single `llm.generate()` call.

**Complex writer** (larger pages): a mini agent loop (max 10 steps) with tools:

| Tool | Purpose |
|---|---|
| `read_kb_page` | Read any existing wiki page for cross-referencing |
| `read_source_excerpt` | Read more context from the source document |
| `finish` | Submit the completed page content |

Every factual claim in the written content is marked with a `[^N]` footnote citation.

### Phase 4 — VERIFY

Three non-blocking checks run after REFINE:

1. **Citation verification** — each `[^N]` claim is checked against its source excerpt by the LLM. Verdicts: `SUPPORTED` (no change), `PARTIAL` (caveat added), `NOT_SUPPORTED` (marked `[unverified]`), `CONTRADICTED` (flagged with warning marker).

2. **Coverage check** — entities mentioned ≥ 3 times in chunk extracts but not covered by any planned page are logged as warnings.

3. **Conflict check** — new page content is embedded and compared against existing KB pages. Semantically similar pages (sim > 0.80) are checked for factual contradictions by the LLM and logged.

All three checks are informational — they never block the pipeline.

### Phase 5 — COMMIT

All verified pages are written to the database in a single atomic transaction. For each page:
- `CREATE` → `wiki_service.apply_create()`
- `UPDATE` → `wiki_service.apply_update()` (falls back to create if the page was deleted)

After all pages are flushed, the wiki index is regenerated, an activity log entry is appended, and the source is marked `ready`.

### Resume behavior

The field `source.pipeline_phase` tracks which phase completed last. If the worker crashes, the next retry picks up from the right phase:

| `pipeline_phase` | Behavior on retry |
|---|---|
| `map` | Skip chunks already extracted, process remaining |
| `reduce` | Re-run REDUCE (all chunks already done) |
| `plan_review` | Return existing plan — do not re-run MAP+REDUCE |
| `refine` / `verify` / `commit` | Re-run REFINE from plan (in-memory results are regenerated) |

### Page types

| Type | Description |
|---|---|
| `entity` | A named thing: person, company, product, location |
| `concept` | A process, rule, methodology, or framework |
| `topic` | A broad subject area |
| `source` | A page representing the source document itself |

---

## Wiki page structure

Each page is stored with:
- `slug` — URL-safe identifier (e.g. `concept/fire-safety`, `entity/acme-corp`)
- `title` — human-readable name
- `page_type` — entity / concept / topic / source
- `content_md` — full markdown content
- `summary` — one-sentence summary for index and search
- `knowledge_type_slugs[]` — which knowledge types this page belongs to
- `source_ids[]` — which source documents contributed to this page
- `embedding` — vector for semantic search (pgvector)
- `scope_type` + `scope_id` — global or project-scoped
- `version` — current version number
- `orphaned` — true if all contributing sources have been deleted

---

## Version history

Every change to a wiki page creates an immutable revision record:

```
WikiPageRevision
  page_id       → which page
  version       → monotonically increasing integer
  content_md    → full snapshot of the content at this version
  change_type   → agent_compile | editor_edit | draft_approved | rollback
  changed_by_id → which employee (null for agent compilations)
  change_note   → optional description
  draft_id      → linked draft if change_type = draft_approved
```

### Accessing revision history

- **Portal:** Wiki page → History tab → list of all versions
- **API:** `GET /api/wiki/pages/{slug}/revisions`

### Rollback

Admins can restore any previous version:
- **Portal:** History tab → select version → Rollback
- **API:** `POST /api/wiki/pages/{slug}/revisions/{version}/rollback`

Rollback creates a new revision with `change_type=rollback` — the history is preserved, not overwritten.

---

## Editing wiki pages

Two paths depending on your role:

### Direct edit (Editor / Admin)

Editors can edit a page directly — no review step. The change takes effect immediately and a revision is created.

- **Portal:** Open wiki page → Edit button
- **API:** `PUT /api/wiki/pages/{slug}`
- **MCP:** `edit_wiki_page(slug, content_md, change_note)`

Requires: **workspace editor+** for workspace-scoped pages, or **`wiki:write:all`** for global pages.

### Propose a draft (Contributor)

Contributors propose edits that go through editor review before being applied.

- **Portal:** Open wiki page → Propose Edit
- **API:** `POST /api/wiki/pages/{slug}/drafts`
- **MCP:** `propose_wiki_edit(slug, content_md, note)`

Requires: **workspace contributor+** for workspace-scoped pages, or **`wiki:write:own_dept`** for global pages.

---

## Draft workflow

The full state machine, including the `needs_revision` loop:

```
                ┌──────────────────────────────────────────┐
                │                                          │
                ▼                                          │
   Contributor submits  ──────────►  pending               │
                                       │                   │
                       Editor approve  │                   │
                                       ▼                   │
                                   approved (terminal)     │
                                                           │
                       Editor reject (note required)       │
                                       ▼                   │
                                   rejected (terminal)     │
                                                           │
                  Editor request_changes (note required)   │
                                       ▼                   │
                              needs_revision ──────────────┘
                                       │       (author resubmits content_md
                                       │        → bumps revision_round
                                       │        → snapshots previous round
                                       │           to wiki_draft_rounds)
                                       │
                       Author withdraw │
                                       ▼
                                   withdrawn (terminal)
```

Multiple drafts can be pending for the same page at the same time. Editors resolve them one by one — approving a draft applies its content. Sibling drafts on the same page are checked for version conflict (`base_version < page.version`); the reviewer can re-base, supply edited content, or pass `allow_conflict=true` to overwrite.

### Concurrency guards on approve

`wiki_service.approve_draft` is wrapped in a Postgres advisory lock keyed on `hashtext(slug)`:

- Two reviewers approving different drafts on the **same page** at the same time would otherwise both read `page.version=N`, both set `N+1`, and both insert a `WikiPageRevision(version=N+1)` — a duplicate row and a last-writer-wins overwrite on `content_md`. The lock serialises them, and the page row is `refresh()`'d **inside** the critical section so the second approver sees the bumped version.
- Bulk approve wraps **each** draft in `db.begin_nested()` (a SAVEPOINT) so a conflict / IntegrityError on one row no longer poisons the outer transaction. The router also `db.expire()`s the touched draft and page on failure, because SAVEPOINT rollback reverts the database but **not** the ORM identity map — a later iteration would otherwise read the polluted `page.version` from RAM.

### Cross-author notifications

When a draft is approved, every other author with a still-pending draft on the same page is notified ("page advanced while your draft was pending — re-base or withdraw"). Notifications are deduped per author within the approve event and batched into one INSERT via `notification_service.notify_each`.

### Draft rounds (history)

Every `request_changes` → `resubmit` cycle snapshots the previous content (and AI verdict) into `wiki_draft_rounds(draft_id, round_no, content_md, author_note, reviewer_return_note, ai_check_results, submitted_at)`. Visible via `GET /api/wiki/drafts/{id}/rounds`.

---

## AI pre-review (L1 → L4)

When a draft is submitted (or resubmitted), the arq worker runs an automated pre-review and writes the verdict to `wiki_page_drafts.ai_check_results` (jsonb). The submit path only **enqueues** the job — it never runs synchronously, so a slow LLM call cannot block draft creation.

| Layer | What it checks | Cost |
|---|---|---|
| **L1 regex** | Email / phone / API key shaped patterns | Free |
| **L2 structural** | Markdown well-formedness, broken wikilinks, headings sanity | Free |
| **L3 semantic** | Duplicate / near-duplicate of other wiki pages (cosine sim on embedding). Skipped for `draft_kind="edit"` since the page is supposed to overlap with itself. | Embedding call |
| **L4 LLM** | Tone + factuality sanity (lightweight prompt) | 1 LLM call |

`ai_check_status` transitions: `pending` → `queued` (after enqueue) → `running` (worker started) → one of `passed | warned | failed | skipped`.

Permissive by design: no layer ever blocks submission — even a `failed` L4 verdict only annotates the draft so the reviewer sees the flag. If Redis is down at submit time, status falls back to `skipped` so the UI never shows a stuck `queued`.

### Resubmit race guard

The enqueue call passes the draft's `revision_round` at that moment. Before the worker writes its final verdict, it `refresh()`'s the draft and bails if `revision_round` has bumped — the user has resubmitted, the in-memory content is stale, and a newer worker is already queued for the new content. Without this guard a slow L4 run could overwrite a fresh verdict with an out-of-date one. Code: [app/services/ai_review/runner.py](../app/services/ai_review/runner.py).

### Stuck-running sweep

A cron (`sweep_stuck_ai_review_cron`, runs every 10 minutes) flips any draft stuck in `ai_check_status='running'` for longer than `2 × WORKER_JOB_TIMEOUT` (min 30 min) back to `skipped`. This catches the SIGKILL / OOM / container-restart cases that the worker's own try/except can't, so the UI never shows a perpetual spinner.

---

## Review console — `/wiki/review`

For high-volume reviewers, the inline page banner is replaced by a dedicated 3-pane console at `/wiki/review`. URL state (`?draft=&status=&mine=`) is the source of truth — deep links, browser back/forward, and "share this draft" all work.

| Pane | Width | Content |
|---|---|---|
| Left | 320px | Queue list with scope toggle (To review / Mine), status filter, auto-snap to first item on filter change |
| Center | flex | Sticky header (title, scope chip, link to full page), tab toggle (diff / proposed / current), compare-with dropdown across sibling drafts on the same page |
| Right | 340px | Author + stats, submission metadata, suggested-metadata (for create drafts), suggested reviewers, AI pre-review panel, action stack (Approve / Request changes / Reject) — or Withdraw when the draft is the viewer's own |

Keyboard shortcuts (disabled inside form fields):

| Key | Action |
|---|---|
| `j` / `↓` | Next draft |
| `k` / `↑` | Previous draft |
| `a` | Approve |
| `c` | Request changes (opens note + focuses textarea) |
| `r` | Reject (opens note + focuses textarea) |
| `Esc` | Cancel pending action |
| `?` | Toggle shortcut help overlay |

After any terminal action the draft is removed from the local list and the next one auto-selects — no page reload. AI status auto-polls every 3 s while running.

The existing `WikiDraftBanner` on `/wiki/[slug]` is intentionally kept for casual reviewers who land on a page; the console is the power-user surface.

### Editor review actions

**Via portal:** Wiki Drafts queue → select draft → compare side-by-side → Approve or Reject.

**Via API:**
- `GET /api/wiki/drafts` — list pending drafts (filtered to your scope)
- `GET /api/wiki/pages/{slug}/drafts` — drafts for a specific page
- `GET /api/wiki/drafts/{id}` — full draft with current page content
- `POST /api/wiki/drafts/{id}/approve` — approve (optionally with edited content)
- `POST /api/wiki/drafts/{id}/reject` — reject (reviewer_note required)

**Via MCP (for Claude Desktop editors):**
- `list_pending_drafts(workspace_id?)` — see pending drafts
- `review_draft(draft_id)` — read draft vs current content
- `approve_draft(draft_id, reviewer_note?, edited_content_md?, allow_conflict?)`
- `reject_draft(draft_id, reviewer_note)`
- `request_changes_on_draft(draft_id, reviewer_note)` — send back without rejecting
- `resubmit_draft(draft_id, content_md, note?)` — author resubmits after changes
- `withdraw_draft(draft_id)` — author withdraws their own draft

**Bulk approve** for queue cleanup:
- `POST /api/wiki/drafts/bulk-approve` `{draft_ids: [...], allow_conflict?, reviewer_note?}` — per-draft savepoint, returns `{added, skipped, errored, results[]}`.

**Create-kind drafts** (propose a brand-new page rather than editing one):
- `POST /api/wiki/drafts/create` — contributor-level, becomes a `WikiPageDraft(draft_kind="create", page_id=NULL)` with `suggested_metadata` (slug, title, page_type, scope). The reviewer can override metadata before materialising the page on approve.
- MCP: `propose_wiki_create(slug, title, content_md, ...)`
- Direct create (editor+, no review): `create_wiki_page(slug, title, content_md, ...)`

---

## Scope: Global vs. Workspace

Wiki pages are either global or workspace-scoped:

**Global pages** — visible to all employees who have `wiki:read` permission.
Compiled from global sources (documents not assigned to any specific workspace).

**Workspace-scoped pages** — visible only to workspace members.
Compiled from workspace-owned sources. Accessible through the workspace wiki browser.

When a source is uploaded directly into a workspace (via the workspace Sources tab), its compiled wiki pages are automatically scoped to that workspace.

---

## Orphaned pages

When all source documents contributing to a wiki page are deleted, the page is marked `orphaned = true`. It is NOT automatically deleted — editors can review orphaned pages and decide whether to keep, update, or remove them.

- **API:** `GET /api/wiki/orphaned` (admin only)

---

## Knowledge graph

Wiki pages are linked via `[[wikilinks]]` in their content. Arkon extracts these links into a `wiki_links` table, enabling:

- **Backlinks** — which pages link to this one
- **Outlinks** — which pages this one links to
- **Graph visualization** — interactive node/edge graph in the portal

The full graph is available at `/wiki/graph`. Each workspace also has a scoped graph at `GET /api/projects/{id}/wiki/graph`.

---

## Wiki index and log

Two reserved pages are maintained automatically:

- `_index` — a catalog of all wiki pages, updated after each compilation
- `_log` — a chronological log of ingestion and compilation events

These are visible in the wiki browser and accessible via:
- `GET /api/wiki/index`
- `GET /api/wiki/log`


--- FILE: frontend\AGENTS.md ---

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->


--- FILE: frontend\CLAUDE.md ---

@AGENTS.md


--- FILE: frontend\components.json ---

{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "base-nova",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "rtl": false,
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "menuColor": "default",
  "menuAccent": "subtle",
  "registries": {}
}


--- FILE: frontend\package-lock.json ---

{
  "name": "frontend",
  "version": "0.1.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "frontend",
      "version": "0.1.0",
      "dependencies": {
        "@base-ui/react": "^1.4.1",
        "@types/diff": "^7.0.2",
        "class-variance-authority": "^0.7.1",
        "clsx": "^2.1.1",
        "d3-drag": "^3.0.0",
        "d3-force": "^3.0.0",
        "diff": "^9.0.0",
        "lucide-react": "^1.14.0",
        "next": "16.2.4",
        "react": "19.2.4",
        "react-dom": "19.2.4",
        "react-force-graph-2d": "^1.29.1",
        "react-markdown": "^10.1.0",
        "remark-frontmatter": "^5.0.0",
        "remark-gfm": "^4.0.1",
        "shadcn": "^4.6.0",
        "tailwind-merge": "^3.5.0",
        "tw-animate-css": "^1.4.0"
      },
      "devDependencies": {
        "@tailwindcss/postcss": "^4",
        "@types/d3-drag": "^3.0.7",
        "@types/d3-force": "^3.0.10",
        "@types/node": "^20",
        "@types/react": "^19",
        "@types/react-dom": "^19",
        "babel-plugin-react-compiler": "1.0.0",
        "eslint": "^9",
        "eslint-config-next": "16.2.4",
        "tailwindcss": "^4",
        "typescript": "^5"
      }
    },
    "node_modules/@alloc/quick-lru": {
      "version": "5.2.0",
      "resolved": "https://registry.npmjs.org/@alloc/quick-lru/-/quick-lru-5.2.0.tgz",
      "integrity": "sha512-UrcABB+4bUrFABwbluTIBErXwvbsU/V7TZWfmbgJfbkwiBuziS9gxdODUyuiecfdGQ85jglMW6juS3+z5TsKLw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/@babel/code-frame": {
      "version": "7.29.0",
      "resolved": "https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.29.0.tgz",
      "integrity": "sha512-9NhCeYjq9+3uxgdtp20LSiJXJvN0FeCtNGpJxuMFZ1Kv3cWUNb6DOhJwUvcVCzKGR66cw4njwM6hrJLqgOwbcw==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-validator-identifier": "^7.28.5",
        "js-tokens": "^4.0.0",
        "picocolors": "^1.1.1"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/compat-data": {
      "version": "7.29.3",
      "resolved": "https://registry.npmjs.org/@babel/compat-data/-/compat-data-7.29.3.tgz",
      "integrity": "sha512-LIVqM46zQWZhj17qA8wb4nW/ixr2y1Nw+r1etiAWgRM6U1IqP+LNhL1yg440jYZR72jCWcWbLWzIosH+uP1fqg==",
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/core": {
      "version": "7.29.0",
      "resolved": "https://registry.npmjs.org/@babel/core/-/core-7.29.0.tgz",
      "integrity": "sha512-CGOfOJqWjg2qW/Mb6zNsDm+u5vFQ8DxXfbM09z69p5Z6+mE1ikP2jUXw+j42Pf1XTYED2Rni5f95npYeuwMDQA==",
      "license": "MIT",
      "dependencies": {
        "@babel/code-frame": "^7.29.0",
        "@babel/generator": "^7.29.0",
        "@babel/helper-compilation-targets": "^7.28.6",
        "@babel/helper-module-transforms": "^7.28.6",
        "@babel/helpers": "^7.28.6",
        "@babel/parser": "^7.29.0",
        "@babel/template": "^7.28.6",
        "@babel/traverse": "^7.29.0",
        "@babel/types": "^7.29.0",
        "@jridgewell/remapping": "^2.3.5",
        "convert-source-map": "^2.0.0",
        "debug": "^4.1.0",
        "gensync": "^1.0.0-beta.2",
        "json5": "^2.2.3",
        "semver": "^6.3.1"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/babel"
      }
    },
    "node_modules/@babel/generator": {
      "version": "7.29.1",
      "resolved": "https://registry.npmjs.org/@babel/generator/-/generator-7.29.1.tgz",
      "integrity": "sha512-qsaF+9Qcm2Qv8SRIMMscAvG4O3lJ0F1GuMo5HR/Bp02LopNgnZBC/EkbevHFeGs4ls/oPz9v+Bsmzbkbe+0dUw==",
      "license": "MIT",
      "dependencies": {
        "@babel/parser": "^7.29.0",
        "@babel/types": "^7.29.0",
        "@jridgewell/gen-mapping": "^0.3.12",
        "@jridgewell/trace-mapping": "^0.3.28",
        "jsesc": "^3.0.2"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-annotate-as-pure": {
      "version": "7.27.3",
      "resolved": "https://registry.npmjs.org/@babel/helper-annotate-as-pure/-/helper-annotate-as-pure-7.27.3.tgz",
      "integrity": "sha512-fXSwMQqitTGeHLBC08Eq5yXz2m37E4pJX1qAU1+2cNedz/ifv/bVXft90VeSav5nFO61EcNgwr0aJxbyPaWBPg==",
      "license": "MIT",
      "dependencies": {
        "@babel/types": "^7.27.3"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-compilation-targets": {
      "version": "7.28.6",
      "resolved": "https://registry.npmjs.org/@babel/helper-compilation-targets/-/helper-compilation-targets-7.28.6.tgz",
      "integrity": "sha512-JYtls3hqi15fcx5GaSNL7SCTJ2MNmjrkHXg4FSpOA/grxK8KwyZ5bubHsCq8FXCkua6xhuaaBit+3b7+VZRfcA==",
      "license": "MIT",
      "dependencies": {
        "@babel/compat-data": "^7.28.6",
        "@babel/helper-validator-option": "^7.27.1",
        "browserslist": "^4.24.0",
        "lru-cache": "^5.1.1",
        "semver": "^6.3.1"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-create-class-features-plugin": {
      "version": "7.29.3",
      "resolved": "https://registry.npmjs.org/@babel/helper-create-class-features-plugin/-/helper-create-class-features-plugin-7.29.3.tgz",
      "integrity": "sha512-RpLYy2sb51oNLjuu1iD3bwBqCBWUzjO0ocp+iaCP/lJtb2CPLcnC2Fftw+4sAzaMELGeWTgExSKADbdo0GFVzA==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-annotate-as-pure": "^7.27.3",
        "@babel/helper-member-expression-to-functions": "^7.28.5",
        "@babel/helper-optimise-call-expression": "^7.27.1",
        "@babel/helper-replace-supers": "^7.28.6",
        "@babel/helper-skip-transparent-expression-wrappers": "^7.27.1",
        "@babel/traverse": "^7.29.0",
        "semver": "^6.3.1"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0"
      }
    },
    "node_modules/@babel/helper-globals": {
      "version": "7.28.0",
      "resolved": "https://registry.npmjs.org/@babel/helper-globals/-/helper-globals-7.28.0.tgz",
      "integrity": "sha512-+W6cISkXFa1jXsDEdYA8HeevQT/FULhxzR99pxphltZcVaugps53THCeiWA8SguxxpSp3gKPiuYfSWopkLQ4hw==",
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-member-expression-to-functions": {
      "version": "7.28.5",
      "resolved": "https://registry.npmjs.org/@babel/helper-member-expression-to-functions/-/helper-member-expression-to-functions-7.28.5.tgz",
      "integrity": "sha512-cwM7SBRZcPCLgl8a7cY0soT1SptSzAlMH39vwiRpOQkJlh53r5hdHwLSCZpQdVLT39sZt+CRpNwYG4Y2v77atg==",
      "license": "MIT",
      "dependencies": {
        "@babel/traverse": "^7.28.5",
        "@babel/types": "^7.28.5"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-module-imports": {
      "version": "7.28.6",
      "resolved": "https://registry.npmjs.org/@babel/helper-module-imports/-/helper-module-imports-7.28.6.tgz",
      "integrity": "sha512-l5XkZK7r7wa9LucGw9LwZyyCUscb4x37JWTPz7swwFE/0FMQAGpiWUZn8u9DzkSBWEcK25jmvubfpw2dnAMdbw==",
      "license": "MIT",
      "dependencies": {
        "@babel/traverse": "^7.28.6",
        "@babel/types": "^7.28.6"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-module-transforms": {
      "version": "7.28.6",
      "resolved": "https://registry.npmjs.org/@babel/helper-module-transforms/-/helper-module-transforms-7.28.6.tgz",
      "integrity": "sha512-67oXFAYr2cDLDVGLXTEABjdBJZ6drElUSI7WKp70NrpyISso3plG9SAGEF6y7zbha/wOzUByWWTJvEDVNIUGcA==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-module-imports": "^7.28.6",
        "@babel/helper-validator-identifier": "^7.28.5",
        "@babel/traverse": "^7.28.6"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0"
      }
    },
    "node_modules/@babel/helper-optimise-call-expression": {
      "version": "7.27.1",
      "resolved": "https://registry.npmjs.org/@babel/helper-optimise-call-expression/-/helper-optimise-call-expression-7.27.1.tgz",
      "integrity": "sha512-URMGH08NzYFhubNSGJrpUEphGKQwMQYBySzat5cAByY1/YgIRkULnIy3tAMeszlL/so2HbeilYloUmSpd7GdVw==",
      "license": "MIT",
      "dependencies": {
        "@babel/types": "^7.27.1"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-plugin-utils": {
      "version": "7.28.6",
      "resolved": "https://registry.npmjs.org/@babel/helper-plugin-utils/-/helper-plugin-utils-7.28.6.tgz",
      "integrity": "sha512-S9gzZ/bz83GRysI7gAD4wPT/AI3uCnY+9xn+Mx/KPs2JwHJIz1W8PZkg2cqyt3RNOBM8ejcXhV6y8Og7ly/Dug==",
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-replace-supers": {
      "version": "7.28.6",
      "resolved": "https://registry.npmjs.org/@babel/helper-replace-supers/-/helper-replace-supers-7.28.6.tgz",
      "integrity": "sha512-mq8e+laIk94/yFec3DxSjCRD2Z0TAjhVbEJY3UQrlwVo15Lmt7C2wAUbK4bjnTs4APkwsYLTahXRraQXhb1WCg==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-member-expression-to-functions": "^7.28.5",
        "@babel/helper-optimise-call-expression": "^7.27.1",
        "@babel/traverse": "^7.28.6"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0"
      }
    },
    "node_modules/@babel/helper-skip-transparent-expression-wrappers": {
      "version": "7.27.1",
      "resolved": "https://registry.npmjs.org/@babel/helper-skip-transparent-expression-wrappers/-/helper-skip-transparent-expression-wrappers-7.27.1.tgz",
      "integrity": "sha512-Tub4ZKEXqbPjXgWLl2+3JpQAYBJ8+ikpQ2Ocj/q/r0LwE3UhENh7EUabyHjz2kCEsrRY83ew2DQdHluuiDQFzg==",
      "license": "MIT",
      "dependencies": {
        "@babel/traverse": "^7.27.1",
        "@babel/types": "^7.27.1"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-string-parser": {
      "version": "7.27.1",
      "resolved": "https://registry.npmjs.org/@babel/helper-string-parser/-/helper-string-parser-7.27.1.tgz",
      "integrity": "sha512-qMlSxKbpRlAridDExk92nSobyDdpPijUq2DW6oDnUqd0iOGxmQjyqhMIihI9+zv4LPyZdRje2cavWPbCbWm3eA==",
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-validator-identifier": {
      "version": "7.28.5",
      "resolved": "https://registry.npmjs.org/@babel/helper-validator-identifier/-/helper-validator-identifier-7.28.5.tgz",
      "integrity": "sha512-qSs4ifwzKJSV39ucNjsvc6WVHs6b7S03sOh2OcHF9UHfVPqWWALUsNUVzhSBiItjRZoLHx7nIarVjqKVusUZ1Q==",
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-validator-option": {
      "version": "7.27.1",
      "resolved": "https://registry.npmjs.org/@babel/helper-validator-option/-/helper-validator-option-7.27.1.tgz",
      "integrity": "sha512-YvjJow9FxbhFFKDSuFnVCe2WxXk1zWc22fFePVNEaWJEu8IrZVlda6N0uHwzZrUM1il7NC9Mlp4MaJYbYd9JSg==",
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helpers": {
      "version": "7.29.2",
      "resolved": "https://registry.npmjs.org/@babel/helpers/-/helpers-7.29.2.tgz",
      "integrity": "sha512-HoGuUs4sCZNezVEKdVcwqmZN8GoHirLUcLaYVNBK2J0DadGtdcqgr3BCbvH8+XUo4NGjNl3VOtSjEKNzqfFgKw==",
      "license": "MIT",
      "dependencies": {
        "@babel/template": "^7.28.6",
        "@babel/types": "^7.29.0"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/parser": {
      "version": "7.29.3",
      "resolved": "https://registry.npmjs.org/@babel/parser/-/parser-7.29.3.tgz",
      "integrity": "sha512-b3ctpQwp+PROvU/cttc4OYl4MzfJUWy6FZg+PMXfzmt/+39iHVF0sDfqay8TQM3JA2EUOyKcFZt75jWriQijsA==",
      "license": "MIT",
      "dependencies": {
        "@babel/types": "^7.29.0"
      },
      "bin": {
        "parser": "bin/babel-parser.js"
      },
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/@babel/plugin-syntax-jsx": {
      "version": "7.28.6",
      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-jsx/-/plugin-syntax-jsx-7.28.6.tgz",
      "integrity": "sha512-wgEmr06G6sIpqr8YDwA2dSRTE3bJ+V0IfpzfSY3Lfgd7YWOaAdlykvJi13ZKBt8cZHfgH1IXN+CL656W3uUa4w==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.28.6"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-syntax-typescript": {
      "version": "7.28.6",
      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-typescript/-/plugin-syntax-typescript-7.28.6.tgz",
      "integrity": "sha512-+nDNmQye7nlnuuHDboPbGm00Vqg3oO8niRRL27/4LYHUsHYh0zJ1xWOz0uRwNFmM1Avzk8wZbc6rdiYhomzv/A==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.28.6"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-modules-commonjs": {
      "version": "7.28.6",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-modules-commonjs/-/plugin-transform-modules-commonjs-7.28.6.tgz",
      "integrity": "sha512-jppVbf8IV9iWWwWTQIxJMAJCWBuuKx71475wHwYytrRGQ2CWiDvYlADQno3tcYpS/T2UUWFQp3nVtYfK/YBQrA==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-module-transforms": "^7.28.6",
        "@babel/helper-plugin-utils": "^7.28.6"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-typescript": {
      "version": "7.28.6",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-typescript/-/plugin-transform-typescript-7.28.6.tgz",
      "integrity": "sha512-0YWL2RFxOqEm9Efk5PvreamxPME8OyY0wM5wh5lHjF+VtVhdneCWGzZeSqzOfiobVqQaNCd2z0tQvnI9DaPWPw==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-annotate-as-pure": "^7.27.3",
        "@babel/helper-create-class-features-plugin": "^7.28.6",
        "@babel/helper-plugin-utils": "^7.28.6",
        "@babel/helper-skip-transparent-expression-wrappers": "^7.27.1",
        "@babel/plugin-syntax-typescript": "^7.28.6"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/preset-typescript": {
      "version": "7.28.5",
      "resolved": "https://registry.npmjs.org/@babel/preset-typescript/-/preset-typescript-7.28.5.tgz",
      "integrity": "sha512-+bQy5WOI2V6LJZpPVxY+yp66XdZ2yifu0Mc1aP5CQKgjn4QM5IN2i5fAZ4xKop47pr8rpVhiAeu+nDQa12C8+g==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.27.1",
        "@babel/helper-validator-option": "^7.27.1",
        "@babel/plugin-syntax-jsx": "^7.27.1",
        "@babel/plugin-transform-modules-commonjs": "^7.27.1",
        "@babel/plugin-transform-typescript": "^7.28.5"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/runtime": {
      "version": "7.29.2",
      "resolved": "https://registry.npmjs.org/@babel/runtime/-/runtime-7.29.2.tgz",
      "integrity": "sha512-JiDShH45zKHWyGe4ZNVRrCjBz8Nh9TMmZG1kh4QTK8hCBTWBi8Da+i7s1fJw7/lYpM4ccepSNfqzZ/QvABBi5g==",
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/template": {
      "version": "7.28.6",
      "resolved": "https://registry.npmjs.org/@babel/template/-/template-7.28.6.tgz",
      "integrity": "sha512-YA6Ma2KsCdGb+WC6UpBVFJGXL58MDA6oyONbjyF/+5sBgxY/dwkhLogbMT2GXXyU84/IhRw/2D1Os1B/giz+BQ==",
      "license": "MIT",
      "dependencies": {
        "@babel/code-frame": "^7.28.6",
        "@babel/parser": "^7.28.6",
        "@babel/types": "^7.28.6"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/traverse": {
      "version": "7.29.0",
      "resolved": "https://registry.npmjs.org/@babel/traverse/-/traverse-7.29.0.tgz",
      "integrity": "sha512-4HPiQr0X7+waHfyXPZpWPfWL/J7dcN1mx9gL6WdQVMbPnF3+ZhSMs8tCxN7oHddJE9fhNE7+lxdnlyemKfJRuA==",
      "license": "MIT",
      "dependencies": {
        "@babel/code-frame": "^7.29.0",
        "@babel/generator": "^7.29.0",
        "@babel/helper-globals": "^7.28.0",
        "@babel/parser": "^7.29.0",
        "@babel/template": "^7.28.6",
        "@babel/types": "^7.29.0",
        "debug": "^4.3.1"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/types": {
      "version": "7.29.0",
      "resolved": "https://registry.npmjs.org/@babel/types/-/types-7.29.0.tgz",
      "integrity": "sha512-LwdZHpScM4Qz8Xw2iKSzS+cfglZzJGvofQICy7W7v4caru4EaAmyUuO6BGrbyQ2mYV11W0U8j5mBhd14dd3B0A==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-string-parser": "^7.27.1",
        "@babel/helper-validator-identifier": "^7.28.5"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@base-ui/react": {
      "version": "1.4.1",
      "resolved": "https://registry.npmjs.org/@base-ui/react/-/react-1.4.1.tgz",
      "integrity": "sha512-Ab5/LIhcmL8BQcsBUYiOfkSDRdLpvgUBzMK30cu684JPcLclYlztharvCZyNNgzJtbAiREzI9q0pI5erHCMgCw==",
      "license": "MIT",
      "dependencies": {
        "@babel/runtime": "^7.29.2",
        "@base-ui/utils": "0.2.8",
        "@floating-ui/react-dom": "^2.1.8",
        "@floating-ui/utils": "^0.2.11",
        "use-sync-external-store": "^1.6.0"
      },
      "engines": {
        "node": ">=14.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/mui-org"
      },
      "peerDependencies": {
        "@date-fns/tz": "^1.2.0",
        "@types/react": "^17 || ^18 || ^19",
        "date-fns": "^4.0.0",
        "react": "^17 || ^18 || ^19",
        "react-dom": "^17 || ^18 || ^19"
      },
      "peerDependenciesMeta": {
        "@date-fns/tz": {
          "optional": true
        },
        "@types/react": {
          "optional": true
        },
        "date-fns": {
          "optional": true
        }
      }
    },
    "node_modules/@base-ui/utils": {
      "version": "0.2.8",
      "resolved": "https://registry.npmjs.org/@base-ui/utils/-/utils-0.2.8.tgz",
      "integrity": "sha512-jvOi+c+ftGlGotNcKnzPVg2IhCaDTB6/6R3JeqdjdXktuAJi3wKH9T7+svuaKh1mmfVU11UWzUZVH74JDfi/wQ==",
      "license": "MIT",
      "dependencies": {
        "@babel/runtime": "^7.29.2",
        "@floating-ui/utils": "^0.2.11",
        "reselect": "^5.1.1",
        "use-sync-external-store": "^1.6.0"
      },
      "peerDependencies": {
        "@types/react": "^17 || ^18 || ^19",
        "react": "^17 || ^18 || ^19",
        "react-dom": "^17 || ^18 || ^19"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/@dotenvx/dotenvx": {
      "version": "1.64.0",
      "resolved": "https://registry.npmjs.org/@dotenvx/dotenvx/-/dotenvx-1.64.0.tgz",
      "integrity": "sha512-6+xRpZaWuHXEqnhBjae+VmQI9Uaqw5Uzu/ScpO+W7ww9Zp3lHSNBoNjFcUxhrCyc7pRGQzyDjhKzloqrPHERiQ==",
      "license": "BSD-3-Clause",
      "dependencies": {
        "commander": "^11.1.0",
        "dotenv": "^17.2.1",
        "eciesjs": "^0.4.10",
        "execa": "^5.1.1",
        "fdir": "^6.2.0",
        "ignore": "^5.3.0",
        "object-treeify": "1.1.33",
        "picomatch": "^4.0.4",
        "which": "^4.0.0",
        "yocto-spinner": "^1.1.0"
      },
      "bin": {
        "dotenvx": "src/cli/dotenvx.js"
      },
      "funding": {
        "url": "https://dotenvx.com"
      }
    },
    "node_modules/@dotenvx/dotenvx/node_modules/commander": {
      "version": "11.1.0",
      "resolved": "https://registry.npmjs.org/commander/-/commander-11.1.0.tgz",
      "integrity": "sha512-yPVavfyCcRhmorC7rWlkHn15b4wDVgVmBA7kV4QVBsF7kv/9TKJAbAXVTxvTnwP8HHKjRCJDClKbciiYS7p0DQ==",
      "license": "MIT",
      "engines": {
        "node": ">=16"
      }
    },
    "node_modules/@dotenvx/dotenvx/node_modules/execa": {
      "version": "5.1.1",
      "resolved": "https://registry.npmjs.org/execa/-/execa-5.1.1.tgz",
      "integrity": "sha512-8uSpZZocAZRBAPIEINJj3Lo9HyGitllczc27Eh5YYojjMFMn8yHMDMaUHE2Jqfq05D/wucwI4JGURyXt1vchyg==",
      "license": "MIT",
      "dependencies": {
        "cross-spawn": "^7.0.3",
        "get-stream": "^6.0.0",
        "human-signals": "^2.1.0",
        "is-stream": "^2.0.0",
        "merge-stream": "^2.0.0",
        "npm-run-path": "^4.0.1",
        "onetime": "^5.1.2",
        "signal-exit": "^3.0.3",
        "strip-final-newline": "^2.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sindresorhus/execa?sponsor=1"
      }
    },
    "node_modules/@dotenvx/dotenvx/node_modules/fdir": {
      "version": "6.5.0",
      "resolved": "https://registry.npmjs.org/fdir/-/fdir-6.5.0.tgz",
      "integrity": "sha512-tIbYtZbucOs0BRGqPJkshJUYdL+SDH7dVM8gjy+ERp3WAUjLEFJE+02kanyHtwjWOnwrKYBiwAmM0p4kLJAnXg==",
      "license": "MIT",
      "engines": {
        "node": ">=12.0.0"
      },
      "peerDependencies": {
        "picomatch": "^3 || ^4"
      },
      "peerDependenciesMeta": {
        "picomatch": {
          "optional": true
        }
      }
    },
    "node_modules/@dotenvx/dotenvx/node_modules/get-stream": {
      "version": "6.0.1",
      "resolved": "https://registry.npmjs.org/get-stream/-/get-stream-6.0.1.tgz",
      "integrity": "sha512-ts6Wi+2j3jQjqi70w5AlN8DFnkSwC+MqmxEzdEALB2qXZYV3X/b1CTfgPLGJNMeAWxdPfU8FO1ms3NUfaHCPYg==",
      "license": "MIT",
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/@dotenvx/dotenvx/node_modules/human-signals": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/human-signals/-/human-signals-2.1.0.tgz",
      "integrity": "sha512-B4FFZ6q/T2jhhksgkbEW3HBvWIfDW85snkQgawt07S7J5QXTk6BkNV+0yAeZrM5QpMAdYlocGoljn0sJ/WQkFw==",
      "license": "Apache-2.0",
      "engines": {
        "node": ">=10.17.0"
      }
    },
    "node_modules/@dotenvx/dotenvx/node_modules/is-stream": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/is-stream/-/is-stream-2.0.1.tgz",
      "integrity": "sha512-hFoiJiTl63nn+kstHGBtewWSKnQLpyb155KHheA1l39uvtO9nWIop1p3udqPcUd/xbF1VLMO4n7OI6p7RbngDg==",
      "license": "MIT",
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/@dotenvx/dotenvx/node_modules/isexe": {
      "version": "3.1.5",
      "resolved": "https://registry.npmjs.org/isexe/-/isexe-3.1.5.tgz",
      "integrity": "sha512-6B3tLtFqtQS4ekarvLVMZ+X+VlvQekbe4taUkf/rhVO3d/h0M2rfARm/pXLcPEsjjMsFgrFgSrhQIxcSVrBz8w==",
      "license": "BlueOak-1.0.0",
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@dotenvx/dotenvx/node_modules/npm-run-path": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/npm-run-path/-/npm-run-path-4.0.1.tgz",
      "integrity": "sha512-S48WzZW777zhNIrn7gxOlISNAqi9ZC/uQFnRdbeIHhZhCA6UqpkOT8T1G7BvfdgP4Er8gF4sUbaS0i7QvIfCWw==",
      "license": "MIT",
      "dependencies": {
        "path-key": "^3.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/@dotenvx/dotenvx/node_modules/onetime": {
      "version": "5.1.2",
      "resolved": "https://registry.npmjs.org/onetime/-/onetime-5.1.2.tgz",
      "integrity": "sha512-kbpaSSGJTWdAY5KPVeMOKXSrPtr8C8C7wodJbcsd51jRnmD+GZu8Y0VoU6Dm5Z4vWr0Ig/1NKuWRKf7j5aaYSg==",
      "license": "MIT",
      "dependencies": {
        "mimic-fn": "^2.1.0"
      },
      "engines": {
        "node": ">=6"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/@dotenvx/dotenvx/node_modules/picomatch": {
      "version": "4.0.4",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-4.0.4.tgz",
      "integrity": "sha512-QP88BAKvMam/3NxH6vj2o21R6MjxZUAd6nlwAS/pnGvN9IVLocLHxGYIzFhg6fUQ+5th6P4dv4eW9jX3DSIj7A==",
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/@dotenvx/dotenvx/node_modules/signal-exit": {
      "version": "3.0.7",
      "resolved": "https://registry.npmjs.org/signal-exit/-/signal-exit-3.0.7.tgz",
      "integrity": "sha512-wnD2ZE+l+SPC/uoS0vXeE9L1+0wuaMqKlfz9AMUo38JsyLSBWSFcHR1Rri62LZc12vLr1gb3jl7iwQhgwpAbGQ==",
      "license": "ISC"
    },
    "node_modules/@dotenvx/dotenvx/node_modules/strip-final-newline": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/strip-final-newline/-/strip-final-newline-2.0.0.tgz",
      "integrity": "sha512-BrpvfNAE3dcvq7ll3xVumzjKjZQ5tI1sEUIKr3Uoks0XUl45St3FlatVqef9prk4jRDzhW6WZg+3bk93y6pLjA==",
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/@dotenvx/dotenvx/node_modules/which": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/which/-/which-4.0.0.tgz",
      "integrity": "sha512-GlaYyEb07DPxYCKhKzplCWBJtvxZcZMrL+4UkrTSJHHPyZU4mYYTv3qaOe77H7EODLSSopAUFAc6W8U4yqvscg==",
      "license": "ISC",
      "dependencies": {
        "isexe": "^3.1.1"
      },
      "bin": {
        "node-which": "bin/which.js"
      },
      "engines": {
        "node": "^16.13.0 || >=18.0.0"
      }
    },
    "node_modules/@ecies/ciphers": {
      "version": "0.2.6",
      "resolved": "https://registry.npmjs.org/@ecies/ciphers/-/ciphers-0.2.6.tgz",
      "integrity": "sha512-patgsRPKGkhhoBjETV4XxD0En4ui5fbX0hzayqI3M8tvNMGUoUvmyYAIWwlxBc1KX5cturfqByYdj5bYGRpN9g==",
      "license": "MIT",
      "engines": {
        "bun": ">=1",
        "deno": ">=2.7.10",
        "node": ">=16"
      },
      "peerDependencies": {
        "@noble/ciphers": "^1.0.0"
      }
    },
    "node_modules/@emnapi/core": {
      "version": "1.10.0",
      "resolved": "https://registry.npmjs.org/@emnapi/core/-/core-1.10.0.tgz",
      "integrity": "sha512-yq6OkJ4p82CAfPl0u9mQebQHKPJkY7WrIuk205cTYnYe+k2Z8YBh11FrbRG/H6ihirqcacOgl2BIO8oyMQLeXw==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "@emnapi/wasi-threads": "1.2.1",
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@emnapi/runtime": {
      "version": "1.10.0",
      "resolved": "https://registry.npmjs.org/@emnapi/runtime/-/runtime-1.10.0.tgz",
      "integrity": "sha512-ewvYlk86xUoGI0zQRNq/mC+16R1QeDlKQy21Ki3oSYXNgLb45GV1P6A0M+/s6nyCuNDqe5VpaY84BzXGwVbwFA==",
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@emnapi/wasi-threads": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/@emnapi/wasi-threads/-/wasi-threads-1.2.1.tgz",
      "integrity": "sha512-uTII7OYF+/Mes/MrcIOYp5yOtSMLBWSIoLPpcgwipoiKbli6k322tcoFsxoIIxPDqW01SQGAgko4EzZi2BNv2w==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@eslint-community/eslint-utils": {
      "version": "4.9.1",
      "resolved": "https://registry.npmjs.org/@eslint-community/eslint-utils/-/eslint-utils-4.9.1.tgz",
      "integrity": "sha512-phrYmNiYppR7znFEdqgfWHXR6NCkZEK7hwWDHZUjit/2/U0r6XvkDl0SYnoM51Hq7FhCGdLDT6zxCCOY1hexsQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "eslint-visitor-keys": "^3.4.3"
      },
      "engines": {
        "node": "^12.22.0 || ^14.17.0 || >=16.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      },
      "peerDependencies": {
        "eslint": "^6.0.0 || ^7.0.0 || >=8.0.0"
      }
    },
    "node_modules/@eslint-community/eslint-utils/node_modules/eslint-visitor-keys": {
      "version": "3.4.3",
      "resolved": "https://registry.npmjs.org/eslint-visitor-keys/-/eslint-visitor-keys-3.4.3.tgz",
      "integrity": "sha512-wpc+LXeiyiisxPlEkUzU6svyS1frIO3Mgxj1fdy7Pm8Ygzguax2N3Fa/D/ag1WqbOprdI+uY6wMUl8/a2G+iag==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": "^12.22.0 || ^14.17.0 || >=16.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/@eslint-community/regexpp": {
      "version": "4.12.2",
      "resolved": "https://registry.npmjs.org/@eslint-community/regexpp/-/regexpp-4.12.2.tgz",
      "integrity": "sha512-EriSTlt5OC9/7SXkRSCAhfSxxoSUgBm33OH+IkwbdpgoqsSsUg7y3uh+IICI/Qg4BBWr3U2i39RpmycbxMq4ew==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^12.0.0 || ^14.0.0 || >=16.0.0"
      }
    },
    "node_modules/@eslint/config-array": {
      "version": "0.21.2",
      "resolved": "https://registry.npmjs.org/@eslint/config-array/-/config-array-0.21.2.tgz",
      "integrity": "sha512-nJl2KGTlrf9GjLimgIru+V/mzgSK0ABCDQRvxw5BjURL7WfH5uoWmizbH7QB6MmnMBd8cIC9uceWnezL1VZWWw==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@eslint/object-schema": "^2.1.7",
        "debug": "^4.3.1",
        "minimatch": "^3.1.5"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      }
    },
    "node_modules/@eslint/config-helpers": {
      "version": "0.4.2",
      "resolved": "https://registry.npmjs.org/@eslint/config-helpers/-/config-helpers-0.4.2.tgz",
      "integrity": "sha512-gBrxN88gOIf3R7ja5K9slwNayVcZgK6SOUORm2uBzTeIEfeVaIhOpCtTox3P6R7o2jLFwLFTLnC7kU/RGcYEgw==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@eslint/core": "^0.17.0"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      }
    },
    "node_modules/@eslint/core": {
      "version": "0.17.0",
      "resolved": "https://registry.npmjs.org/@eslint/core/-/core-0.17.0.tgz",
      "integrity": "sha512-yL/sLrpmtDaFEiUj1osRP4TI2MDz1AddJL+jZ7KSqvBuliN4xqYY54IfdN8qD8Toa6g1iloph1fxQNkjOxrrpQ==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@types/json-schema": "^7.0.15"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      }
    },
    "node_modules/@eslint/eslintrc": {
      "version": "3.3.5",
      "resolved": "https://registry.npmjs.org/@eslint/eslintrc/-/eslintrc-3.3.5.tgz",
      "integrity": "sha512-4IlJx0X0qftVsN5E+/vGujTRIFtwuLbNsVUe7TO6zYPDR1O6nFwvwhIKEKSrl6dZchmYBITazxKoUYOjdtjlRg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ajv": "^6.14.0",
        "debug": "^4.3.2",
        "espree": "^10.0.1",
        "globals": "^14.0.0",
        "ignore": "^5.2.0",
        "import-fresh": "^3.2.1",
        "js-yaml": "^4.1.1",
        "minimatch": "^3.1.5",
        "strip-json-comments": "^3.1.1"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/@eslint/js": {
      "version": "9.39.4",
      "resolved": "https://registry.npmjs.org/@eslint/js/-/js-9.39.4.tgz",
      "integrity": "sha512-nE7DEIchvtiFTwBw4Lfbu59PG+kCofhjsKaCWzxTpt4lfRjRMqG6uMBzKXuEcyXhOHoUp9riAm7/aWYGhXZ9cw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "url": "https://eslint.org/donate"
      }
    },
    "node_modules/@eslint/object-schema": {
      "version": "2.1.7",
      "resolved": "https://registry.npmjs.org/@eslint/object-schema/-/object-schema-2.1.7.tgz",
      "integrity": "sha512-VtAOaymWVfZcmZbp6E2mympDIHvyjXs/12LqWYjVw6qjrfF+VK+fyG33kChz3nnK+SU5/NeHOqrTEHS8sXO3OA==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      }
    },
    "node_modules/@eslint/plugin-kit": {
      "version": "0.4.1",
      "resolved": "https://registry.npmjs.org/@eslint/plugin-kit/-/plugin-kit-0.4.1.tgz",
      "integrity": "sha512-43/qtrDUokr7LJqoF2c3+RInu/t4zfrpYdoSDfYyhg52rwLV6TnOvdG4fXm7IkSB3wErkcmJS9iEhjVtOSEjjA==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@eslint/core": "^0.17.0",
        "levn": "^0.4.1"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      }
    },
    "node_modules/@floating-ui/core": {
      "version": "1.7.5",
      "resolved": "https://registry.npmjs.org/@floating-ui/core/-/core-1.7.5.tgz",
      "integrity": "sha512-1Ih4WTWyw0+lKyFMcBHGbb5U5FtuHJuujoyyr5zTaWS5EYMeT6Jb2AuDeftsCsEuchO+mM2ij5+q9crhydzLhQ==",
      "license": "MIT",
      "dependencies": {
        "@floating-ui/utils": "^0.2.11"
      }
    },
    "node_modules/@floating-ui/dom": {
      "version": "1.7.6",
      "resolved": "https://registry.npmjs.org/@floating-ui/dom/-/dom-1.7.6.tgz",
      "integrity": "sha512-9gZSAI5XM36880PPMm//9dfiEngYoC6Am2izES1FF406YFsjvyBMmeJ2g4SAju3xWwtuynNRFL2s9hgxpLI5SQ==",
      "license": "MIT",
      "dependencies": {
        "@floating-ui/core": "^1.7.5",
        "@floating-ui/utils": "^0.2.11"
      }
    },
    "node_modules/@floating-ui/react-dom": {
      "version": "2.1.8",
      "resolved": "https://registry.npmjs.org/@floating-ui/react-dom/-/react-dom-2.1.8.tgz",
      "integrity": "sha512-cC52bHwM/n/CxS87FH0yWdngEZrjdtLW/qVruo68qg+prK7ZQ4YGdut2GyDVpoGeAYe/h899rVeOVm6Oi40k2A==",
      "license": "MIT",
      "dependencies": {
        "@floating-ui/dom": "^1.7.6"
      },
      "peerDependencies": {
        "react": ">=16.8.0",
        "react-dom": ">=16.8.0"
      }
    },
    "node_modules/@floating-ui/utils": {
      "version": "0.2.11",
      "resolved": "https://registry.npmjs.org/@floating-ui/utils/-/utils-0.2.11.tgz",
      "integrity": "sha512-RiB/yIh78pcIxl6lLMG0CgBXAZ2Y0eVHqMPYugu+9U0AeT6YBeiJpf7lbdJNIugFP5SIjwNRgo4DhR1Qxi26Gg==",
      "license": "MIT"
    },
    "node_modules/@hono/node-server": {
      "version": "1.19.14",
      "resolved": "https://registry.npmjs.org/@hono/node-server/-/node-server-1.19.14.tgz",
      "integrity": "sha512-GwtvgtXxnWsucXvbQXkRgqksiH2Qed37H9xHZocE5sA3N8O8O8/8FA3uclQXxXVzc9XBZuEOMK7+r02FmSpHtw==",
      "license": "MIT",
      "engines": {
        "node": ">=18.14.1"
      },
      "peerDependencies": {
        "hono": "^4"
      }
    },
    "node_modules/@humanfs/core": {
      "version": "0.19.2",
      "resolved": "https://registry.npmjs.org/@humanfs/core/-/core-0.19.2.tgz",
      "integrity": "sha512-UhXNm+CFMWcbChXywFwkmhqjs3PRCmcSa/hfBgLIb7oQ5HNb1wS0icWsGtSAUNgefHeI+eBrA8I1fxmbHsGdvA==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@humanfs/types": "^0.15.0"
      },
      "engines": {
        "node": ">=18.18.0"
      }
    },
    "node_modules/@humanfs/node": {
      "version": "0.16.8",
      "resolved": "https://registry.npmjs.org/@humanfs/node/-/node-0.16.8.tgz",
      "integrity": "sha512-gE1eQNZ3R++kTzFUpdGlpmy8kDZD/MLyHqDwqjkVQI0JMdI1D51sy1H958PNXYkM2rAac7e5/CnIKZrHtPh3BQ==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@humanfs/core": "^0.19.2",
        "@humanfs/types": "^0.15.0",
        "@humanwhocodes/retry": "^0.4.0"
      },
      "engines": {
        "node": ">=18.18.0"
      }
    },
    "node_modules/@humanfs/types": {
      "version": "0.15.0",
      "resolved": "https://registry.npmjs.org/@humanfs/types/-/types-0.15.0.tgz",
      "integrity": "sha512-ZZ1w0aoQkwuUuC7Yf+7sdeaNfqQiiLcSRbfI08oAxqLtpXQr9AIVX7Ay7HLDuiLYAaFPu8oBYNq/QIi9URHJ3Q==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">=18.18.0"
      }
    },
    "node_modules/@humanwhocodes/module-importer": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/@humanwhocodes/module-importer/-/module-importer-1.0.1.tgz",
      "integrity": "sha512-bxveV4V8v5Yb4ncFTT3rPSgZBOpCkjfK0y4oVVVJwIuDVBRMDXrPyXRL988i5ap9m9bnyEEjWfm5WkBmtffLfA==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">=12.22"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/nzakas"
      }
    },
    "node_modules/@humanwhocodes/retry": {
      "version": "0.4.3",
      "resolved": "https://registry.npmjs.org/@humanwhocodes/retry/-/retry-0.4.3.tgz",
      "integrity": "sha512-bV0Tgo9K4hfPCek+aMAn81RppFKv2ySDQeMoSZuvTASywNTnVJCArCZE2FWqpvIatKu7VMRLWlR1EazvVhDyhQ==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">=18.18"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/nzakas"
      }
    },
    "node_modules/@img/colour": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/@img/colour/-/colour-1.1.0.tgz",
      "integrity": "sha512-Td76q7j57o/tLVdgS746cYARfSyxk8iEfRxewL9h4OMzYhbW4TAcppl0mT4eyqXddh6L/jwoM75mo7ixa/pCeQ==",
      "license": "MIT",
      "optional": true,
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@img/sharp-darwin-arm64": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-darwin-arm64/-/sharp-darwin-arm64-0.34.5.tgz",
      "integrity": "sha512-imtQ3WMJXbMY4fxb/Ndp6HBTNVtWCUI0WdobyheGf5+ad6xX8VIDO8u2xE4qc/fr08CKG/7dDseFtn6M6g/r3w==",
      "cpu": [
        "arm64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-darwin-arm64": "1.2.4"
      }
    },
    "node_modules/@img/sharp-darwin-x64": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-darwin-x64/-/sharp-darwin-x64-0.34.5.tgz",
      "integrity": "sha512-YNEFAF/4KQ/PeW0N+r+aVVsoIY0/qxxikF2SWdp+NRkmMB7y9LBZAVqQ4yhGCm/H3H270OSykqmQMKLBhBJDEw==",
      "cpu": [
        "x64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-darwin-x64": "1.2.4"
      }
    },
    "node_modules/@img/sharp-libvips-darwin-arm64": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-darwin-arm64/-/sharp-libvips-darwin-arm64-1.2.4.tgz",
      "integrity": "sha512-zqjjo7RatFfFoP0MkQ51jfuFZBnVE2pRiaydKJ1G/rHZvnsrHAOcQALIi9sA5co5xenQdTugCvtb1cuf78Vf4g==",
      "cpu": [
        "arm64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "darwin"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-darwin-x64": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-darwin-x64/-/sharp-libvips-darwin-x64-1.2.4.tgz",
      "integrity": "sha512-1IOd5xfVhlGwX+zXv2N93k0yMONvUlANylbJw1eTah8K/Jtpi15KC+WSiaX/nBmbm2HxRM1gZ0nSdjSsrZbGKg==",
      "cpu": [
        "x64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "darwin"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-arm": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-arm/-/sharp-libvips-linux-arm-1.2.4.tgz",
      "integrity": "sha512-bFI7xcKFELdiNCVov8e44Ia4u2byA+l3XtsAj+Q8tfCwO6BQ8iDojYdvoPMqsKDkuoOo+X6HZA0s0q11ANMQ8A==",
      "cpu": [
        "arm"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-arm64": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-arm64/-/sharp-libvips-linux-arm64-1.2.4.tgz",
      "integrity": "sha512-excjX8DfsIcJ10x1Kzr4RcWe1edC9PquDRRPx3YVCvQv+U5p7Yin2s32ftzikXojb1PIFc/9Mt28/y+iRklkrw==",
      "cpu": [
        "arm64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-ppc64": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-ppc64/-/sharp-libvips-linux-ppc64-1.2.4.tgz",
      "integrity": "sha512-FMuvGijLDYG6lW+b/UvyilUWu5Ayu+3r2d1S8notiGCIyYU/76eig1UfMmkZ7vwgOrzKzlQbFSuQfgm7GYUPpA==",
      "cpu": [
        "ppc64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-riscv64": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-riscv64/-/sharp-libvips-linux-riscv64-1.2.4.tgz",
      "integrity": "sha512-oVDbcR4zUC0ce82teubSm+x6ETixtKZBh/qbREIOcI3cULzDyb18Sr/Wcyx7NRQeQzOiHTNbZFF1UwPS2scyGA==",
      "cpu": [
        "riscv64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-s390x": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-s390x/-/sharp-libvips-linux-s390x-1.2.4.tgz",
      "integrity": "sha512-qmp9VrzgPgMoGZyPvrQHqk02uyjA0/QrTO26Tqk6l4ZV0MPWIW6LTkqOIov+J1yEu7MbFQaDpwdwJKhbJvuRxQ==",
      "cpu": [
        "s390x"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-x64": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-x64/-/sharp-libvips-linux-x64-1.2.4.tgz",
      "integrity": "sha512-tJxiiLsmHc9Ax1bz3oaOYBURTXGIRDODBqhveVHonrHJ9/+k89qbLl0bcJns+e4t4rvaNBxaEZsFtSfAdquPrw==",
      "cpu": [
        "x64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linuxmusl-arm64": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linuxmusl-arm64/-/sharp-libvips-linuxmusl-arm64-1.2.4.tgz",
      "integrity": "sha512-FVQHuwx1IIuNow9QAbYUzJ+En8KcVm9Lk5+uGUQJHaZmMECZmOlix9HnH7n1TRkXMS0pGxIJokIVB9SuqZGGXw==",
      "cpu": [
        "arm64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linuxmusl-x64": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linuxmusl-x64/-/sharp-libvips-linuxmusl-x64-1.2.4.tgz",
      "integrity": "sha512-+LpyBk7L44ZIXwz/VYfglaX/okxezESc6UxDSoyo2Ks6Jxc4Y7sGjpgU9s4PMgqgjj1gZCylTieNamqA1MF7Dg==",
      "cpu": [
        "x64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-linux-arm": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-arm/-/sharp-linux-arm-0.34.5.tgz",
      "integrity": "sha512-9dLqsvwtg1uuXBGZKsxem9595+ujv0sJ6Vi8wcTANSFpwV/GONat5eCkzQo/1O6zRIkh0m/8+5BjrRr7jDUSZw==",
      "cpu": [
        "arm"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-arm": "1.2.4"
      }
    },
    "node_modules/@img/sharp-linux-arm64": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-arm64/-/sharp-linux-arm64-0.34.5.tgz",
      "integrity": "sha512-bKQzaJRY/bkPOXyKx5EVup7qkaojECG6NLYswgktOZjaXecSAeCWiZwwiFf3/Y+O1HrauiE3FVsGxFg8c24rZg==",
      "cpu": [
        "arm64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-arm64": "1.2.4"
      }
    },
    "node_modules/@img/sharp-linux-ppc64": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-ppc64/-/sharp-linux-ppc64-0.34.5.tgz",
      "integrity": "sha512-7zznwNaqW6YtsfrGGDA6BRkISKAAE1Jo0QdpNYXNMHu2+0dTrPflTLNkpc8l7MUP5M16ZJcUvysVWWrMefZquA==",
      "cpu": [
        "ppc64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-ppc64": "1.2.4"
      }
    },
    "node_modules/@img/sharp-linux-riscv64": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-riscv64/-/sharp-linux-riscv64-0.34.5.tgz",
      "integrity": "sha512-51gJuLPTKa7piYPaVs8GmByo7/U7/7TZOq+cnXJIHZKavIRHAP77e3N2HEl3dgiqdD/w0yUfiJnII77PuDDFdw==",
      "cpu": [
        "riscv64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-riscv64": "1.2.4"
      }
    },
    "node_modules/@img/sharp-linux-s390x": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-s390x/-/sharp-linux-s390x-0.34.5.tgz",
      "integrity": "sha512-nQtCk0PdKfho3eC5MrbQoigJ2gd1CgddUMkabUj+rBevs8tZ2cULOx46E7oyX+04WGfABgIwmMC0VqieTiR4jg==",
      "cpu": [
        "s390x"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-s390x": "1.2.4"
      }
    },
    "node_modules/@img/sharp-linux-x64": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-x64/-/sharp-linux-x64-0.34.5.tgz",
      "integrity": "sha512-MEzd8HPKxVxVenwAa+JRPwEC7QFjoPWuS5NZnBt6B3pu7EG2Ge0id1oLHZpPJdn3OQK+BQDiw9zStiHBTJQQQQ==",
      "cpu": [
        "x64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-x64": "1.2.4"
      }
    },
    "node_modules/@img/sharp-linuxmusl-arm64": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-linuxmusl-arm64/-/sharp-linuxmusl-arm64-0.34.5.tgz",
      "integrity": "sha512-fprJR6GtRsMt6Kyfq44IsChVZeGN97gTD331weR1ex1c1rypDEABN6Tm2xa1wE6lYb5DdEnk03NZPqA7Id21yg==",
      "cpu": [
        "arm64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linuxmusl-arm64": "1.2.4"
      }
    },
    "node_modules/@img/sharp-linuxmusl-x64": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-linuxmusl-x64/-/sharp-linuxmusl-x64-0.34.5.tgz",
      "integrity": "sha512-Jg8wNT1MUzIvhBFxViqrEhWDGzqymo3sV7z7ZsaWbZNDLXRJZoRGrjulp60YYtV4wfY8VIKcWidjojlLcWrd8Q==",
      "cpu": [
        "x64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linuxmusl-x64": "1.2.4"
      }
    },
    "node_modules/@img/sharp-wasm32": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-wasm32/-/sharp-wasm32-0.34.5.tgz",
      "integrity": "sha512-OdWTEiVkY2PHwqkbBI8frFxQQFekHaSSkUIJkwzclWZe64O1X4UlUjqqqLaPbUpMOQk6FBu/HtlGXNblIs0huw==",
      "cpu": [
        "wasm32"
      ],
      "license": "Apache-2.0 AND LGPL-3.0-or-later AND MIT",
      "optional": true,
      "dependencies": {
        "@emnapi/runtime": "^1.7.0"
      },
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-win32-arm64": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-win32-arm64/-/sharp-win32-arm64-0.34.5.tgz",
      "integrity": "sha512-WQ3AgWCWYSb2yt+IG8mnC6Jdk9Whs7O0gxphblsLvdhSpSTtmu69ZG1Gkb6NuvxsNACwiPV6cNSZNzt0KPsw7g==",
      "cpu": [
        "arm64"
      ],
      "license": "Apache-2.0 AND LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-win32-ia32": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-win32-ia32/-/sharp-win32-ia32-0.34.5.tgz",
      "integrity": "sha512-FV9m/7NmeCmSHDD5j4+4pNI8Cp3aW+JvLoXcTUo0IqyjSfAZJ8dIUmijx1qaJsIiU+Hosw6xM5KijAWRJCSgNg==",
      "cpu": [
        "ia32"
      ],
      "license": "Apache-2.0 AND LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-win32-x64": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-win32-x64/-/sharp-win32-x64-0.34.5.tgz",
      "integrity": "sha512-+29YMsqY2/9eFEiW93eqWnuLcWcufowXewwSNIT6UwZdUUCrM3oFjMWH/Z6/TMmb4hlFenmfAVbpWeup2jryCw==",
      "cpu": [
        "x64"
      ],
      "license": "Apache-2.0 AND LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@inquirer/ansi": {
      "version": "2.0.5",
      "resolved": "https://registry.npmjs.org/@inquirer/ansi/-/ansi-2.0.5.tgz",
      "integrity": "sha512-doc2sWgJpbFQ64UflSVd17ibMGDuxO1yKgOgLMwavzESnXjFWJqUeG8saYosqKpHp4kWiM5x1nXvEjbpx90gzw==",
      "license": "MIT",
      "engines": {
        "node": ">=23.5.0 || ^22.13.0 || ^21.7.0 || ^20.12.0"
      }
    },
    "node_modules/@inquirer/confirm": {
      "version": "6.0.12",
      "resolved": "https://registry.npmjs.org/@inquirer/confirm/-/confirm-6.0.12.tgz",
      "integrity": "sha512-h9FgGun3QwVYNj5TWIZZ+slii73bMoBFjPfVIGtnFuL4t8gBiNDV9PcSfIzkuxvgquJKt9nr1QzszpBzTbH8Og==",
      "license": "MIT",
      "dependencies": {
        "@inquirer/core": "^11.1.9",
        "@inquirer/type": "^4.0.5"
      },
      "engines": {
        "node": ">=23.5.0 || ^22.13.0 || ^21.7.0 || ^20.12.0"
      },
      "peerDependencies": {
        "@types/node": ">=18"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/@inquirer/core": {
      "version": "11.1.9",
      "resolved": "https://registry.npmjs.org/@inquirer/core/-/core-11.1.9.tgz",
      "integrity": "sha512-BDE4fG22uYh1bGSifcj7JSx119TVYNViMhMu85usp4Fswrzh6M0DV3yld64jA98uOAa2GSQ4Bg4bZRm2d2cwSg==",
      "license": "MIT",
      "dependencies": {
        "@inquirer/ansi": "^2.0.5",
        "@inquirer/figures": "^2.0.5",
        "@inquirer/type": "^4.0.5",
        "cli-width": "^4.1.0",
        "fast-wrap-ansi": "^0.2.0",
        "mute-stream": "^3.0.0",
        "signal-exit": "^4.1.0"
      },
      "engines": {
        "node": ">=23.5.0 || ^22.13.0 || ^21.7.0 || ^20.12.0"
      },
      "peerDependencies": {
        "@types/node": ">=18"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/@inquirer/figures": {
      "version": "2.0.5",
      "resolved": "https://registry.npmjs.org/@inquirer/figures/-/figures-2.0.5.tgz",
      "integrity": "sha512-NsSs4kzfm12lNetHwAn3GEuH317IzpwrMCbOuMIVytpjnJ90YYHNwdRgYGuKmVxwuIqSgqk3M5qqQt1cDk0tGQ==",
      "license": "MIT",
      "engines": {
        "node": ">=23.5.0 || ^22.13.0 || ^21.7.0 || ^20.12.0"
      }
    },
    "node_modules/@inquirer/type": {
      "version": "4.0.5",
      "resolved": "https://registry.npmjs.org/@inquirer/type/-/type-4.0.5.tgz",
      "integrity": "sha512-aetVUNeKNc/VriqXlw1NRSW0zhMBB0W4bNbWRJgzRl/3d0QNDQFfk0GO5SDdtjMZVg6o8ZKEiadd7SCCzoOn5Q==",
      "license": "MIT",
      "engines": {
        "node": ">=23.5.0 || ^22.13.0 || ^21.7.0 || ^20.12.0"
      },
      "peerDependencies": {
        "@types/node": ">=18"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/@jridgewell/gen-mapping": {
      "version": "0.3.13",
      "resolved": "https://registry.npmjs.org/@jridgewell/gen-mapping/-/gen-mapping-0.3.13.tgz",
      "integrity": "sha512-2kkt/7niJ6MgEPxF0bYdQ6etZaA+fQvDcLKckhy1yIQOzaoKjBBjSj63/aLVjYE3qhRt5dvM+uUyfCg6UKCBbA==",
      "license": "MIT",
      "dependencies": {
        "@jridgewell/sourcemap-codec": "^1.5.0",
        "@jridgewell/trace-mapping": "^0.3.24"
      }
    },
    "node_modules/@jridgewell/remapping": {
      "version": "2.3.5",
      "resolved": "https://registry.npmjs.org/@jridgewell/remapping/-/remapping-2.3.5.tgz",
      "integrity": "sha512-LI9u/+laYG4Ds1TDKSJW2YPrIlcVYOwi2fUC6xB43lueCjgxV4lffOCZCtYFiH6TNOX+tQKXx97T4IKHbhyHEQ==",
      "license": "MIT",
      "dependencies": {
        "@jridgewell/gen-mapping": "^0.3.5",
        "@jridgewell/trace-mapping": "^0.3.24"
      }
    },
    "node_modules/@jridgewell/resolve-uri": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/@jridgewell/resolve-uri/-/resolve-uri-3.1.2.tgz",
      "integrity": "sha512-bRISgCIjP20/tbWSPWMEi54QVPRZExkuD9lJL+UIxUKtwVJA8wW1Trb1jMs1RFXo1CBTNZ/5hpC9QvmKWdopKw==",
      "license": "MIT",
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/@jridgewell/sourcemap-codec": {
      "version": "1.5.5",
      "resolved": "https://registry.npmjs.org/@jridgewell/sourcemap-codec/-/sourcemap-codec-1.5.5.tgz",
      "integrity": "sha512-cYQ9310grqxueWbl+WuIUIaiUaDcj7WOq5fVhEljNVgRfOUhY9fy2zTvfoqWsnebh8Sl70VScFbICvJnLKB0Og==",
      "license": "MIT"
    },
    "node_modules/@jridgewell/trace-mapping": {
      "version": "0.3.31",
      "resolved": "https://registry.npmjs.org/@jridgewell/trace-mapping/-/trace-mapping-0.3.31.tgz",
      "integrity": "sha512-zzNR+SdQSDJzc8joaeP8QQoCQr8NuYx2dIIytl1QeBEZHJ9uW6hebsrYgbz8hJwUQao3TWCMtmfV8Nu1twOLAw==",
      "license": "MIT",
      "dependencies": {
        "@jridgewell/resolve-uri": "^3.1.0",
        "@jridgewell/sourcemap-codec": "^1.4.14"
      }
    },
    "node_modules/@modelcontextprotocol/sdk": {
      "version": "1.29.0",
      "resolved": "https://registry.npmjs.org/@modelcontextprotocol/sdk/-/sdk-1.29.0.tgz",
      "integrity": "sha512-zo37mZA9hJWpULgkRpowewez1y6ML5GsXJPY8FI0tBBCd77HEvza4jDqRKOXgHNn867PVGCyTdzqpz0izu5ZjQ==",
      "license": "MIT",
      "dependencies": {
        "@hono/node-server": "^1.19.9",
        "ajv": "^8.17.1",
        "ajv-formats": "^3.0.1",
        "content-type": "^1.0.5",
        "cors": "^2.8.5",
        "cross-spawn": "^7.0.5",
        "eventsource": "^3.0.2",
        "eventsource-parser": "^3.0.0",
        "express": "^5.2.1",
        "express-rate-limit": "^8.2.1",
        "hono": "^4.11.4",
        "jose": "^6.1.3",
        "json-schema-typed": "^8.0.2",
        "pkce-challenge": "^5.0.0",
        "raw-body": "^3.0.0",
        "zod": "^3.25 || ^4.0",
        "zod-to-json-schema": "^3.25.1"
      },
      "engines": {
        "node": ">=18"
      },
      "peerDependencies": {
        "@cfworker/json-schema": "^4.1.1",
        "zod": "^3.25 || ^4.0"
      },
      "peerDependenciesMeta": {
        "@cfworker/json-schema": {
          "optional": true
        },
        "zod": {
          "optional": false
        }
      }
    },
    "node_modules/@modelcontextprotocol/sdk/node_modules/ajv": {
      "version": "8.20.0",
      "resolved": "https://registry.npmjs.org/ajv/-/ajv-8.20.0.tgz",
      "integrity": "sha512-Thbli+OlOj+iMPYFBVBfJ3OmCAnaSyNn4M1vz9T6Gka5Jt9ba/HIR56joy65tY6kx/FCF5VXNB819Y7/GUrBGA==",
      "license": "MIT",
      "dependencies": {
        "fast-deep-equal": "^3.1.3",
        "fast-uri": "^3.0.1",
        "json-schema-traverse": "^1.0.0",
        "require-from-string": "^2.0.2"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/epoberezkin"
      }
    },
    "node_modules/@modelcontextprotocol/sdk/node_modules/json-schema-traverse": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/json-schema-traverse/-/json-schema-traverse-1.0.0.tgz",
      "integrity": "sha512-NM8/P9n3XjXhIZn1lLhkFaACTOURQXjWhV4BA/RnOv8xvgqtqpAX9IO4mRQxSx1Rlo4tqzeqb0sOlruaOy3dug==",
      "license": "MIT"
    },
    "node_modules/@mswjs/interceptors": {
      "version": "0.41.7",
      "resolved": "https://registry.npmjs.org/@mswjs/interceptors/-/interceptors-0.41.7.tgz",
      "integrity": "sha512-D0nkS5+sx87mYpxFqASImCineYoEl9wGlUPrzkuS0ohzG8wfophLpE+I76qGJ0slLAVI19do5SI9pWJNCVf4fg==",
      "license": "MIT",
      "dependencies": {
        "@open-draft/deferred-promise": "^2.2.0",
        "@open-draft/logger": "^0.3.0",
        "@open-draft/until": "^2.0.0",
        "is-node-process": "^1.2.0",
        "outvariant": "^1.4.3",
        "strict-event-emitter": "^0.5.1"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@mswjs/interceptors/node_modules/@open-draft/deferred-promise": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/@open-draft/deferred-promise/-/deferred-promise-2.2.0.tgz",
      "integrity": "sha512-CecwLWx3rhxVQF6V4bAgPS5t+So2sTbPgAzafKkVizyi7tlwpcFpdFqq+wqF2OwNBmqFuu6tOyouTuxgpMfzmA==",
      "license": "MIT"
    },
    "node_modules/@napi-rs/wasm-runtime": {
      "version": "0.2.12",
      "resolved": "https://registry.npmjs.org/@napi-rs/wasm-runtime/-/wasm-runtime-0.2.12.tgz",
      "integrity": "sha512-ZVWUcfwY4E/yPitQJl481FjFo3K22D6qF0DuFH6Y/nbnE11GY5uguDxZMGXPQ8WQ0128MXQD7TnfHyK4oWoIJQ==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "@emnapi/core": "^1.4.3",
        "@emnapi/runtime": "^1.4.3",
        "@tybys/wasm-util": "^0.10.0"
      }
    },
    "node_modules/@next/env": {
      "version": "16.2.4",
      "resolved": "https://registry.npmjs.org/@next/env/-/env-16.2.4.tgz",
      "integrity": "sha512-dKkkOzOSwFYe5RX6y26fZgkSpVAlIOJKQHIiydQcrWH6y/97+RceSOAdjZ14Qa3zLduVUy0TXcn+EiM6t4rPgw==",
      "license": "MIT"
    },
    "node_modules/@next/eslint-plugin-next": {
      "version": "16.2.4",
      "resolved": "https://registry.npmjs.org/@next/eslint-plugin-next/-/eslint-plugin-next-16.2.4.tgz",
      "integrity": "sha512-tOX826JJ96gYK/go18sPUgMq9FK1tqxBFfUCEufJb5XIkWFFmpgU7mahJANKGkHs7F41ir3tReJ3Lv5La0RvhA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fast-glob": "3.3.1"
      }
    },
    "node_modules/@next/swc-darwin-arm64": {
      "version": "16.2.4",
      "resolved": "https://registry.npmjs.org/@next/swc-darwin-arm64/-/swc-darwin-arm64-16.2.4.tgz",
      "integrity": "sha512-OXTFFox5EKN1Ym08vfrz+OXxmCcEjT4SFMbNRsWZE99dMqt2Kcusl5MqPXcW232RYkMLQTy0hqgAMEsfEd/l2A==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-darwin-x64": {
      "version": "16.2.4",
      "resolved": "https://registry.npmjs.org/@next/swc-darwin-x64/-/swc-darwin-x64-16.2.4.tgz",
      "integrity": "sha512-XhpVnUfmYWvD3YrXu55XdcAkQtOnvaI6wtQa8fuF5fGoKoxIUZ0kWPtcOfqJEWngFF/lOS9l3+O9CcownhiQxQ==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-linux-arm64-gnu": {
      "version": "16.2.4",
      "resolved": "https://registry.npmjs.org/@next/swc-linux-arm64-gnu/-/swc-linux-arm64-gnu-16.2.4.tgz",
      "integrity": "sha512-Mx/tjlNA3G8kg14QvuGAJ4xBwPk1tUHq56JxZ8CXnZwz1Etz714soCEzGQQzVMz4bEnGPowzkV6Xrp6wAkEWOQ==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-linux-arm64-musl": {
      "version": "16.2.4",
      "resolved": "https://registry.npmjs.org/@next/swc-linux-arm64-musl/-/swc-linux-arm64-musl-16.2.4.tgz",
      "integrity": "sha512-iVMMp14514u7Nup2umQS03nT/bN9HurK8ufylC3FZNykrwjtx7V1A7+4kvhbDSCeonTVqV3Txnv0Lu+m2oDXNg==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-linux-x64-gnu": {
      "version": "16.2.4",
      "resolved": "https://registry.npmjs.org/@next/swc-linux-x64-gnu/-/swc-linux-x64-gnu-16.2.4.tgz",
      "integrity": "sha512-EZOvm1aQWgnI/N/xcWOlnS3RQBk0VtVav5Zo7n4p0A7UKyTDx047k8opDbXgBpHl4CulRqRfbw3QrX2w5UOXMQ==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-linux-x64-musl": {
      "version": "16.2.4",
      "resolved": "https://registry.npmjs.org/@next/swc-linux-x64-musl/-/swc-linux-x64-musl-16.2.4.tgz",
      "integrity": "sha512-h9FxsngCm9cTBf71AR4fGznDEDx1hS7+kSEiIRjq5kO1oXWm07DxVGZjCvk0SGx7TSjlUqhI8oOyz7NfwAdPoA==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-win32-arm64-msvc": {
      "version": "16.2.4",
      "resolved": "https://registry.npmjs.org/@next/swc-win32-arm64-msvc/-/swc-win32-arm64-msvc-16.2.4.tgz",
      "integrity": "sha512-3NdJV5OXMSOeJYijX+bjaLge3mJBlh4ybydbT4GFoB/2hAojWHtMhl3CYlYoMrjPuodp0nzFVi4Tj2+WaMg+Ow==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-win32-x64-msvc": {
      "version": "16.2.4",
      "resolved": "https://registry.npmjs.org/@next/swc-win32-x64-msvc/-/swc-win32-x64-msvc-16.2.4.tgz",
      "integrity": "sha512-kMVGgsqhO5YTYODD9IPGGhA6iprWidQckK3LmPeW08PIFENRmgfb4MjXHO+p//d+ts2rpjvK5gXWzXSMrPl9cw==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@noble/ciphers": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/@noble/ciphers/-/ciphers-1.3.0.tgz",
      "integrity": "sha512-2I0gnIVPtfnMw9ee9h1dJG7tp81+8Ob3OJb3Mv37rx5L40/b0i7djjCVvGOVqc9AEIQyvyu1i6ypKdFw8R8gQw==",
      "license": "MIT",
      "engines": {
        "node": "^14.21.3 || >=16"
      },
      "funding": {
        "url": "https://paulmillr.com/funding/"
      }
    },
    "node_modules/@noble/curves": {
      "version": "1.9.7",
      "resolved": "https://registry.npmjs.org/@noble/curves/-/curves-1.9.7.tgz",
      "integrity": "sha512-gbKGcRUYIjA3/zCCNaWDciTMFI0dCkvou3TL8Zmy5Nc7sJ47a0jtOeZoTaMxkuqRo9cRhjOdZJXegxYE5FN/xw==",
      "license": "MIT",
      "dependencies": {
        "@noble/hashes": "1.8.0"
      },
      "engines": {
        "node": "^14.21.3 || >=16"
      },
      "funding": {
        "url": "https://paulmillr.com/funding/"
      }
    },
    "node_modules/@noble/hashes": {
      "version": "1.8.0",
      "resolved": "https://registry.npmjs.org/@noble/hashes/-/hashes-1.8.0.tgz",
      "integrity": "sha512-jCs9ldd7NwzpgXDIf6P3+NrHh9/sD6CQdxHyjQI+h/6rDNo88ypBxxz45UDuZHz9r3tNz7N/VInSVoVdtXEI4A==",
      "license": "MIT",
      "engines": {
        "node": "^14.21.3 || >=16"
      },
      "funding": {
        "url": "https://paulmillr.com/funding/"
      }
    },
    "node_modules/@nodelib/fs.scandir": {
      "version": "2.1.5",
      "resolved": "https://registry.npmjs.org/@nodelib/fs.scandir/-/fs.scandir-2.1.5.tgz",
      "integrity": "sha512-vq24Bq3ym5HEQm2NKCr3yXDwjc7vTsEThRDnkp2DK9p1uqLR+DHurm/NOTo0KG7HYHU7eppKZj3MyqYuMBf62g==",
      "license": "MIT",
      "dependencies": {
        "@nodelib/fs.stat": "2.0.5",
        "run-parallel": "^1.1.9"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/@nodelib/fs.stat": {
      "version": "2.0.5",
      "resolved": "https://registry.npmjs.org/@nodelib/fs.stat/-/fs.stat-2.0.5.tgz",
      "integrity": "sha512-RkhPPp2zrqDAQA/2jNhnztcPAlv64XdhIp7a7454A5ovI7Bukxgt7MX7udwAu3zg1DcpPU0rz3VV1SeaqvY4+A==",
      "license": "MIT",
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/@nodelib/fs.walk": {
      "version": "1.2.8",
      "resolved": "https://registry.npmjs.org/@nodelib/fs.walk/-/fs.walk-1.2.8.tgz",
      "integrity": "sha512-oGB+UxlgWcgQkgwo8GcEGwemoTFt3FIO9ababBmaGwXIoBKZ+GTy0pP185beGg7Llih/NSHSV2XAs1lnznocSg==",
      "license": "MIT",
      "dependencies": {
        "@nodelib/fs.scandir": "2.1.5",
        "fastq": "^1.6.0"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/@nolyfill/is-core-module": {
      "version": "1.0.39",
      "resolved": "https://registry.npmjs.org/@nolyfill/is-core-module/-/is-core-module-1.0.39.tgz",
      "integrity": "sha512-nn5ozdjYQpUCZlWGuxcJY/KpxkWQs4DcbMCmKojjyrYDEAGy4Ce19NN4v5MduafTwJlbKc99UA8YhSVqq9yPZA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12.4.0"
      }
    },
    "node_modules/@open-draft/deferred-promise": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/@open-draft/deferred-promise/-/deferred-promise-3.0.0.tgz",
      "integrity": "sha512-XW375UK8/9SqUVNVa6M0yEy8+iTi4QN5VZ7aZuRFQmy76LRwI9wy5F4YIBU6T+eTe2/DNDo8tqu8RHlwLHM6RA==",
      "license": "MIT"
    },
    "node_modules/@open-draft/logger": {
      "version": "0.3.0",
      "resolved": "https://registry.npmjs.org/@open-draft/logger/-/logger-0.3.0.tgz",
      "integrity": "sha512-X2g45fzhxH238HKO4xbSr7+wBS8Fvw6ixhTDuvLd5mqh6bJJCFAPwU9mPDxbcrRtfxv4u5IHCEH77BmxvXmmxQ==",
      "license": "MIT",
      "dependencies": {
        "is-node-process": "^1.2.0",
        "outvariant": "^1.4.0"
      }
    },
    "node_modules/@open-draft/until": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/@open-draft/until/-/until-2.1.0.tgz",
      "integrity": "sha512-U69T3ItWHvLwGg5eJ0n3I62nWuE6ilHlmz7zM0npLBRvPRd7e6NYmg54vvRtP5mZG7kZqZCFVdsTWo7BPtBujg==",
      "license": "MIT"
    },
    "node_modules/@rtsao/scc": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/@rtsao/scc/-/scc-1.1.0.tgz",
      "integrity": "sha512-zt6OdqaDoOnJ1ZYsCYGt9YmWzDXl4vQdKTyJev62gFhRGKdx7mcT54V9KIjg+d2wi9EXsPvAPKe7i7WjfVWB8g==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@sec-ant/readable-stream": {
      "version": "0.4.1",
      "resolved": "https://registry.npmjs.org/@sec-ant/readable-stream/-/readable-stream-0.4.1.tgz",
      "integrity": "sha512-831qok9r2t8AlxLko40y2ebgSDhenenCatLVeW/uBtnHPyhHOvG0C7TvfgecV+wHzIm5KUICgzmVpWS+IMEAeg==",
      "license": "MIT"
    },
    "node_modules/@sindresorhus/merge-streams": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/@sindresorhus/merge-streams/-/merge-streams-4.0.0.tgz",
      "integrity": "sha512-tlqY9xq5ukxTUZBmoOp+m61cqwQD5pHJtFY3Mn8CA8ps6yghLH/Hw8UPdqg4OLmFW3IFlcXnQNmo/dh8HzXYIQ==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/@swc/helpers": {
      "version": "0.5.15",
      "resolved": "https://registry.npmjs.org/@swc/helpers/-/helpers-0.5.15.tgz",
      "integrity": "sha512-JQ5TuMi45Owi4/BIMAJBoSQoOJu12oOk/gADqlcUL9JEdHB8vyjUSsxqeNXnmXHjYKMi2WcYtezGEEhqUI/E2g==",
      "license": "Apache-2.0",
      "dependencies": {
        "tslib": "^2.8.0"
      }
    },
    "node_modules/@tailwindcss/node": {
      "version": "4.2.4",
      "resolved": "https://registry.npmjs.org/@tailwindcss/node/-/node-4.2.4.tgz",
      "integrity": "sha512-Ai7+yQPxz3ddrDQzFfBKdHEVBg0w3Zl83jnjuwxnZOsnH9pGn93QHQtpU0p/8rYWxvbFZHneni6p1BSLK4DkGA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/remapping": "^2.3.5",
        "enhanced-resolve": "^5.19.0",
        "jiti": "^2.6.1",
        "lightningcss": "1.32.0",
        "magic-string": "^0.30.21",
        "source-map-js": "^1.2.1",
        "tailwindcss": "4.2.4"
      }
    },
    "node_modules/@tailwindcss/oxide": {
      "version": "4.2.4",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide/-/oxide-4.2.4.tgz",
      "integrity": "sha512-9El/iI069DKDSXwTvB9J4BwdO5JhRrOweGaK25taBAvBXyXqJAX+Jqdvs8r8gKpsI/1m0LeJLyQYTf/WLrBT1Q==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 20"
      },
      "optionalDependencies": {
        "@tailwindcss/oxide-android-arm64": "4.2.4",
        "@tailwindcss/oxide-darwin-arm64": "4.2.4",
        "@tailwindcss/oxide-darwin-x64": "4.2.4",
        "@tailwindcss/oxide-freebsd-x64": "4.2.4",
        "@tailwindcss/oxide-linux-arm-gnueabihf": "4.2.4",
        "@tailwindcss/oxide-linux-arm64-gnu": "4.2.4",
        "@tailwindcss/oxide-linux-arm64-musl": "4.2.4",
        "@tailwindcss/oxide-linux-x64-gnu": "4.2.4",
        "@tailwindcss/oxide-linux-x64-musl": "4.2.4",
        "@tailwindcss/oxide-wasm32-wasi": "4.2.4",
        "@tailwindcss/oxide-win32-arm64-msvc": "4.2.4",
        "@tailwindcss/oxide-win32-x64-msvc": "4.2.4"
      }
    },
    "node_modules/@tailwindcss/oxide-android-arm64": {
      "version": "4.2.4",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-android-arm64/-/oxide-android-arm64-4.2.4.tgz",
      "integrity": "sha512-e7MOr1SAn9U8KlZzPi1ZXGZHeC5anY36qjNwmZv9pOJ8E4Q6jmD1vyEHkQFmNOIN7twGPEMXRHmitN4zCMN03g==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-darwin-arm64": {
      "version": "4.2.4",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-darwin-arm64/-/oxide-darwin-arm64-4.2.4.tgz",
      "integrity": "sha512-tSC/Kbqpz/5/o/C2sG7QvOxAKqyd10bq+ypZNf+9Fi2TvbVbv1zNpcEptcsU7DPROaSbVgUXmrzKhurFvo5eDg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-darwin-x64": {
      "version": "4.2.4",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-darwin-x64/-/oxide-darwin-x64-4.2.4.tgz",
      "integrity": "sha512-yPyUXn3yO/ufR6+Kzv0t4fCg2qNr90jxXc5QqBpjlPNd0NqyDXcmQb/6weunH/MEDXW5dhyEi+agTDiqa3WsGg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-freebsd-x64": {
      "version": "4.2.4",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-freebsd-x64/-/oxide-freebsd-x64-4.2.4.tgz",
      "integrity": "sha512-BoMIB4vMQtZsXdGLVc2z+P9DbETkiopogfWZKbWwM8b/1Vinbs4YcUwo+kM/KeLkX3Ygrf4/PsRndKaYhS8Eiw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-linux-arm-gnueabihf": {
      "version": "4.2.4",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-linux-arm-gnueabihf/-/oxide-linux-arm-gnueabihf-4.2.4.tgz",
      "integrity": "sha512-7pIHBLTHYRAlS7V22JNuTh33yLH4VElwKtB3bwchK/UaKUPpQ0lPQiOWcbm4V3WP2I6fNIJ23vABIvoy2izdwA==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-linux-arm64-gnu": {
      "version": "4.2.4",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-linux-arm64-gnu/-/oxide-linux-arm64-gnu-4.2.4.tgz",
      "integrity": "sha512-+E4wxJ0ZGOzSH325reXTWB48l42i93kQqMvDyz5gqfRzRZ7faNhnmvlV4EPGJU3QJM/3Ab5jhJ5pCRUsKn6OQw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-linux-arm64-musl": {
      "version": "4.2.4",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-linux-arm64-musl/-/oxide-linux-arm64-musl-4.2.4.tgz",
      "integrity": "sha512-bBADEGAbo4ASnppIziaQJelekCxdMaxisrk+fB7Thit72IBnALp9K6ffA2G4ruj90G9XRS2VQ6q2bCKbfFV82g==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-linux-x64-gnu": {
      "version": "4.2.4",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-linux-x64-gnu/-/oxide-linux-x64-gnu-4.2.4.tgz",
      "integrity": "sha512-7Mx25E4WTfnht0TVRTyC00j3i0M+EeFe7wguMDTlX4mRxafznw0CA8WJkFjWYH5BlgELd1kSjuU2JiPnNZbJDA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-linux-x64-musl": {
      "version": "4.2.4",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-linux-x64-musl/-/oxide-linux-x64-musl-4.2.4.tgz",
      "integrity": "sha512-2wwJRF7nyhOR0hhHoChc04xngV3iS+akccHTGtz965FwF0up4b2lOdo6kI1EbDaEXKgvcrFBYcYQQ/rrnWFVfA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-wasm32-wasi": {
      "version": "4.2.4",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-wasm32-wasi/-/oxide-wasm32-wasi-4.2.4.tgz",
      "integrity": "sha512-FQsqApeor8Fo6gUEklzmaa9994orJZZDBAlQpK2Mq+DslRKFJeD6AjHpBQ0kZFQohVr8o85PPh8eOy86VlSCmw==",
      "bundleDependencies": [
        "@napi-rs/wasm-runtime",
        "@emnapi/core",
        "@emnapi/runtime",
        "@tybys/wasm-util",
        "@emnapi/wasi-threads",
        "tslib"
      ],
      "cpu": [
        "wasm32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "@emnapi/core": "^1.8.1",
        "@emnapi/runtime": "^1.8.1",
        "@emnapi/wasi-threads": "^1.1.0",
        "@napi-rs/wasm-runtime": "^1.1.1",
        "@tybys/wasm-util": "^0.10.1",
        "tslib": "^2.8.1"
      },
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/@tailwindcss/oxide-win32-arm64-msvc": {
      "version": "4.2.4",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-win32-arm64-msvc/-/oxide-win32-arm64-msvc-4.2.4.tgz",
      "integrity": "sha512-L9BXqxC4ToVgwMFqj3pmZRqyHEztulpUJzCxUtLjobMCzTPsGt1Fa9enKbOpY2iIyVtaHNeNvAK8ERP/64sqGQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-win32-x64-msvc": {
      "version": "4.2.4",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-win32-x64-msvc/-/oxide-win32-x64-msvc-4.2.4.tgz",
      "integrity": "sha512-ESlKG0EpVJQwRjXDDa9rLvhEAh0mhP1sF7sap9dNZT0yyl9SAG6T7gdP09EH0vIv0UNTlo6jPWyujD6559fZvw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/postcss": {
      "version": "4.2.4",
      "resolved": "https://registry.npmjs.org/@tailwindcss/postcss/-/postcss-4.2.4.tgz",
      "integrity": "sha512-wgAVj6nUWAolAu8YFvzT2cTBIElWHkjZwFYovF+xsqKsW2ADxM/X2opxj5NsF/qVccAOjRNe8X2IdPzMsWyHTg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@alloc/quick-lru": "^5.2.0",
        "@tailwindcss/node": "4.2.4",
        "@tailwindcss/oxide": "4.2.4",
        "postcss": "^8.5.6",
        "tailwindcss": "4.2.4"
      }
    },
    "node_modules/@ts-morph/common": {
      "version": "0.27.0",
      "resolved": "https://registry.npmjs.org/@ts-morph/common/-/common-0.27.0.tgz",
      "integrity": "sha512-Wf29UqxWDpc+i61k3oIOzcUfQt79PIT9y/MWfAGlrkjg6lBC1hwDECLXPVJAhWjiGbfBCxZd65F/LIZF3+jeJQ==",
      "license": "MIT",
      "dependencies": {
        "fast-glob": "^3.3.3",
        "minimatch": "^10.0.1",
        "path-browserify": "^1.0.1"
      }
    },
    "node_modules/@ts-morph/common/node_modules/balanced-match": {
      "version": "4.0.4",
      "resolved": "https://registry.npmjs.org/balanced-match/-/balanced-match-4.0.4.tgz",
      "integrity": "sha512-BLrgEcRTwX2o6gGxGOCNyMvGSp35YofuYzw9h1IMTRmKqttAZZVU67bdb9Pr2vUHA8+j3i2tJfjO6C6+4myGTA==",
      "license": "MIT",
      "engines": {
        "node": "18 || 20 || >=22"
      }
    },
    "node_modules/@ts-morph/common/node_modules/brace-expansion": {
      "version": "5.0.5",
      "resolved": "https://registry.npmjs.org/brace-expansion/-/brace-expansion-5.0.5.tgz",
      "integrity": "sha512-VZznLgtwhn+Mact9tfiwx64fA9erHH/MCXEUfB/0bX/6Fz6ny5EGTXYltMocqg4xFAQZtnO3DHWWXi8RiuN7cQ==",
      "license": "MIT",
      "dependencies": {
        "balanced-match": "^4.0.2"
      },
      "engines": {
        "node": "18 || 20 || >=22"
      }
    },
    "node_modules/@ts-morph/common/node_modules/fast-glob": {
      "version": "3.3.3",
      "resolved": "https://registry.npmjs.org/fast-glob/-/fast-glob-3.3.3.tgz",
      "integrity": "sha512-7MptL8U0cqcFdzIzwOTHoilX9x5BrNqye7Z/LuC7kCMRio1EMSyqRK3BEAUD7sXRq4iT4AzTVuZdhgQ2TCvYLg==",
      "license": "MIT",
      "dependencies": {
        "@nodelib/fs.stat": "^2.0.2",
        "@nodelib/fs.walk": "^1.2.3",
        "glob-parent": "^5.1.2",
        "merge2": "^1.3.0",
        "micromatch": "^4.0.8"
      },
      "engines": {
        "node": ">=8.6.0"
      }
    },
    "node_modules/@ts-morph/common/node_modules/glob-parent": {
      "version": "5.1.2",
      "resolved": "https://registry.npmjs.org/glob-parent/-/glob-parent-5.1.2.tgz",
      "integrity": "sha512-AOIgSQCepiJYwP3ARnGx+5VnTu2HBYdzbGP45eLw1vr3zB3vZLeyed1sC9hnbcOc9/SrMyM5RPQrkGz4aS9Zow==",
      "license": "ISC",
      "dependencies": {
        "is-glob": "^4.0.1"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/@ts-morph/common/node_modules/minimatch": {
      "version": "10.2.5",
      "resolved": "https://registry.npmjs.org/minimatch/-/minimatch-10.2.5.tgz",
      "integrity": "sha512-MULkVLfKGYDFYejP07QOurDLLQpcjk7Fw+7jXS2R2czRQzR56yHRveU5NDJEOviH+hETZKSkIk5c+T23GjFUMg==",
      "license": "BlueOak-1.0.0",
      "dependencies": {
        "brace-expansion": "^5.0.5"
      },
      "engines": {
        "node": "18 || 20 || >=22"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/@tweenjs/tween.js": {
      "version": "25.0.0",
      "resolved": "https://registry.npmjs.org/@tweenjs/tween.js/-/tween.js-25.0.0.tgz",
      "integrity": "sha512-XKLA6syeBUaPzx4j3qwMqzzq+V4uo72BnlbOjmuljLrRqdsd3qnzvZZoxvMHZ23ndsRS4aufU6JOZYpCbU6T1A==",
      "license": "MIT"
    },
    "node_modules/@tybys/wasm-util": {
      "version": "0.10.1",
      "resolved": "https://registry.npmjs.org/@tybys/wasm-util/-/wasm-util-0.10.1.tgz",
      "integrity": "sha512-9tTaPJLSiejZKx+Bmog4uSubteqTvFrVrURwkmHixBo0G4seD0zUxp98E1DzUBJxLQ3NPwXrGKDiVjwx/DpPsg==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@types/d3-drag": {
      "version": "3.0.7",
      "resolved": "https://registry.npmjs.org/@types/d3-drag/-/d3-drag-3.0.7.tgz",
      "integrity": "sha512-HE3jVKlzU9AaMazNufooRJ5ZpWmLIoc90A37WU2JMmeq28w1FQqCZswHZ3xR+SuxYftzHq6WU6KJHvqxKzTxxQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/d3-selection": "*"
      }
    },
    "node_modules/@types/d3-force": {
      "version": "3.0.10",
      "resolved": "https://registry.npmjs.org/@types/d3-force/-/d3-force-3.0.10.tgz",
      "integrity": "sha512-ZYeSaCF3p73RdOKcjj+swRlZfnYpK1EbaDiYICEEp5Q6sUiqFaFQ9qgoshp5CzIyyb/yD09kD9o2zEltCexlgw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/d3-selection": {
      "version": "3.0.11",
      "resolved": "https://registry.npmjs.org/@types/d3-selection/-/d3-selection-3.0.11.tgz",
      "integrity": "sha512-bhAXu23DJWsrI45xafYpkQ4NtcKMwWnAC/vKrd2l+nxMFuvOT3XMYTIj2opv8vq8AO5Yh7Qac/nSeP/3zjTK0w==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/debug": {
      "version": "4.1.13",
      "resolved": "https://registry.npmjs.org/@types/debug/-/debug-4.1.13.tgz",
      "integrity": "sha512-KSVgmQmzMwPlmtljOomayoR89W4FynCAi3E8PPs7vmDVPe84hT+vGPKkJfThkmXs0x0jAaa9U8uW8bbfyS2fWw==",
      "license": "MIT",
      "dependencies": {
        "@types/ms": "*"
      }
    },
    "node_modules/@types/diff": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@types/diff/-/diff-7.0.2.tgz",
      "integrity": "sha512-JSWRMozjFKsGlEjiiKajUjIJVKuKdE3oVy2DNtK+fUo8q82nhFZ2CPQwicAIkXrofahDXrWJ7mjelvZphMS98Q==",
      "license": "MIT"
    },
    "node_modules/@types/estree": {
      "version": "1.0.8",
      "resolved": "https://registry.npmjs.org/@types/estree/-/estree-1.0.8.tgz",
      "integrity": "sha512-dWHzHa2WqEXI/O1E9OjrocMTKJl2mSrEolh1Iomrv6U+JuNwaHXsXx9bLu5gG7BUWFIN0skIQJQ/L1rIex4X6w==",
      "license": "MIT"
    },
    "node_modules/@types/estree-jsx": {
      "version": "1.0.5",
      "resolved": "https://registry.npmjs.org/@types/estree-jsx/-/estree-jsx-1.0.5.tgz",
      "integrity": "sha512-52CcUVNFyfb1A2ALocQw/Dd1BQFNmSdkuC3BkZ6iqhdMfQz7JWOFRuJFloOzjk+6WijU56m9oKXFAXc7o3Towg==",
      "license": "MIT",
      "dependencies": {
        "@types/estree": "*"
      }
    },
    "node_modules/@types/hast": {
      "version": "3.0.4",
      "resolved": "https://registry.npmjs.org/@types/hast/-/hast-3.0.4.tgz",
      "integrity": "sha512-WPs+bbQw5aCj+x6laNGWLH3wviHtoCv/P3+otBhbOhJgG8qtpdAMlTCxLtsTWA7LH1Oh/bFCHsBn0TPS5m30EQ==",
      "license": "MIT",
      "dependencies": {
        "@types/unist": "*"
      }
    },
    "node_modules/@types/json-schema": {
      "version": "7.0.15",
      "resolved": "https://registry.npmjs.org/@types/json-schema/-/json-schema-7.0.15.tgz",
      "integrity": "sha512-5+fP8P8MFNC+AyZCDxrB2pkZFPGzqQWUzpSeuuVLvm8VMcorNYavBqoFcxK8bQz4Qsbn4oUEEem4wDLfcysGHA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/json5": {
      "version": "0.0.29",
      "resolved": "https://registry.npmjs.org/@types/json5/-/json5-0.0.29.tgz",
      "integrity": "sha512-dRLjCWHYg4oaA77cxO64oO+7JwCwnIzkZPdrrC71jQmQtlhM556pwKo5bUzqvZndkVbeFLIIi+9TC40JNF5hNQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/mdast": {
      "version": "4.0.4",
      "resolved": "https://registry.npmjs.org/@types/mdast/-/mdast-4.0.4.tgz",
      "integrity": "sha512-kGaNbPh1k7AFzgpud/gMdvIm5xuECykRR+JnWKQno9TAXVa6WIVCGTPvYGekIDL4uwCZQSYbUxNBSb1aUo79oA==",
      "license": "MIT",
      "dependencies": {
        "@types/unist": "*"
      }
    },
    "node_modules/@types/ms": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/@types/ms/-/ms-2.1.0.tgz",
      "integrity": "sha512-GsCCIZDE/p3i96vtEqx+7dBUGXrc7zeSK3wwPHIaRThS+9OhWIXRqzs4d6k1SVU8g91DrNRWxWUGhp5KXQb2VA==",
      "license": "MIT"
    },
    "node_modules/@types/node": {
      "version": "20.19.39",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-20.19.39.tgz",
      "integrity": "sha512-orrrD74MBUyK8jOAD/r0+lfa1I2MO6I+vAkmAWzMYbCcgrN4lCrmK52gRFQq/JRxfYPfonkr4b0jcY7Olqdqbw==",
      "license": "MIT",
      "dependencies": {
        "undici-types": "~6.21.0"
      }
    },
    "node_modules/@types/react": {
      "version": "19.2.14",
      "resolved": "https://registry.npmjs.org/@types/react/-/react-19.2.14.tgz",
      "integrity": "sha512-ilcTH/UniCkMdtexkoCN0bI7pMcJDvmQFPvuPvmEaYA/NSfFTAgdUSLAoVjaRJm7+6PvcM+q1zYOwS4wTYMF9w==",
      "license": "MIT",
      "dependencies": {
        "csstype": "^3.2.2"
      }
    },
    "node_modules/@types/react-dom": {
      "version": "19.2.3",
      "resolved": "https://registry.npmjs.org/@types/react-dom/-/react-dom-19.2.3.tgz",
      "integrity": "sha512-jp2L/eY6fn+KgVVQAOqYItbF0VY/YApe5Mz2F0aykSO8gx31bYCZyvSeYxCHKvzHG5eZjc+zyaS5BrBWya2+kQ==",
      "dev": true,
      "license": "MIT",
      "peerDependencies": {
        "@types/react": "^19.2.0"
      }
    },
    "node_modules/@types/set-cookie-parser": {
      "version": "2.4.10",
      "resolved": "https://registry.npmjs.org/@types/set-cookie-parser/-/set-cookie-parser-2.4.10.tgz",
      "integrity": "sha512-GGmQVGpQWUe5qglJozEjZV/5dyxbOOZ0LHe/lqyWssB88Y4svNfst0uqBVscdDeIKl5Jy5+aPSvy7mI9tYRguw==",
      "license": "MIT",
      "dependencies": {
        "@types/node": "*"
      }
    },
    "node_modules/@types/statuses": {
      "version": "2.0.6",
      "resolved": "https://registry.npmjs.org/@types/statuses/-/statuses-2.0.6.tgz",
      "integrity": "sha512-xMAgYwceFhRA2zY+XbEA7mxYbA093wdiW8Vu6gZPGWy9cmOyU9XesH1tNcEWsKFd5Vzrqx5T3D38PWx1FIIXkA==",
      "license": "MIT"
    },
    "node_modules/@types/unist": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/@types/unist/-/unist-3.0.3.tgz",
      "integrity": "sha512-ko/gIFJRv177XgZsZcBwnqJN5x/Gien8qNOn0D5bQU/zAzVf9Zt3BlcUiLqhV9y4ARk0GbT3tnUiPNgnTXzc/Q==",
      "license": "MIT"
    },
    "node_modules/@types/validate-npm-package-name": {
      "version": "4.0.2",
      "resolved": "https://registry.npmjs.org/@types/validate-npm-package-name/-/validate-npm-package-name-4.0.2.tgz",
      "integrity": "sha512-lrpDziQipxCEeK5kWxvljWYhUvOiB2A9izZd9B2AFarYAkqZshb4lPbRs7zKEic6eGtH8V/2qJW+dPp9OtF6bw==",
      "license": "MIT"
    },
    "node_modules/@typescript-eslint/eslint-plugin": {
      "version": "8.59.1",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/eslint-plugin/-/eslint-plugin-8.59.1.tgz",
      "integrity": "sha512-BOziFIfE+6osHO9FoJG4zjoHUcvI7fTNBSpdAwrNH0/TLvzjsk2oo8XSSOT2HhqUyhZPfHv4UOffoJ9oEEQ7Ag==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@eslint-community/regexpp": "^4.12.2",
        "@typescript-eslint/scope-manager": "8.59.1",
        "@typescript-eslint/type-utils": "8.59.1",
        "@typescript-eslint/utils": "8.59.1",
        "@typescript-eslint/visitor-keys": "8.59.1",
        "ignore": "^7.0.5",
        "natural-compare": "^1.4.0",
        "ts-api-utils": "^2.5.0"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      },
      "peerDependencies": {
        "@typescript-eslint/parser": "^8.59.1",
        "eslint": "^8.57.0 || ^9.0.0 || ^10.0.0",
        "typescript": ">=4.8.4 <6.1.0"
      }
    },
    "node_modules/@typescript-eslint/eslint-plugin/node_modules/ignore": {
      "version": "7.0.5",
      "resolved": "https://registry.npmjs.org/ignore/-/ignore-7.0.5.tgz",
      "integrity": "sha512-Hs59xBNfUIunMFgWAbGX5cq6893IbWg4KnrjbYwX3tx0ztorVgTDA6B2sxf8ejHJ4wz8BqGUMYlnzNBer5NvGg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 4"
      }
    },
    "node_modules/@typescript-eslint/parser": {
      "version": "8.59.1",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/parser/-/parser-8.59.1.tgz",
      "integrity": "sha512-HDQH9O/47Dxi1ceDhBXdaldtf/WV9yRYMjbjCuNk3qnaTD564qwv61Y7+gTxwxRKzSrgO5uhtw584igXVuuZkA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@typescript-eslint/scope-manager": "8.59.1",
        "@typescript-eslint/types": "8.59.1",
        "@typescript-eslint/typescript-estree": "8.59.1",
        "@typescript-eslint/visitor-keys": "8.59.1",
        "debug": "^4.4.3"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      },
      "peerDependencies": {
        "eslint": "^8.57.0 || ^9.0.0 || ^10.0.0",
        "typescript": ">=4.8.4 <6.1.0"
      }
    },
    "node_modules/@typescript-eslint/project-service": {
      "version": "8.59.1",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/project-service/-/project-service-8.59.1.tgz",
      "integrity": "sha512-+MuHQlHiEr00Of/IQbE/MmEoi44znZHbR/Pz7Opq4HryUOlRi+/44dro9Ycy8Fyo+/024IWtw8m4JUMCGTYxDg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@typescript-eslint/tsconfig-utils": "^8.59.1",
        "@typescript-eslint/types": "^8.59.1",
        "debug": "^4.4.3"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      },
      "peerDependencies": {
        "typescript": ">=4.8.4 <6.1.0"
      }
    },
    "node_modules/@typescript-eslint/scope-manager": {
      "version": "8.59.1",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/scope-manager/-/scope-manager-8.59.1.tgz",
      "integrity": "sha512-LwuHQI4pDOYVKvmH2dkaJo6YZCSgouVgnS/z7yBPKBMvgtBvyLqiLy9Z6b7+m/TRcX1NFYUqZetI5Y+aT4GEfg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@typescript-eslint/types": "8.59.1",
        "@typescript-eslint/visitor-keys": "8.59.1"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      }
    },
    "node_modules/@typescript-eslint/tsconfig-utils": {
      "version": "8.59.1",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/tsconfig-utils/-/tsconfig-utils-8.59.1.tgz",
      "integrity": "sha512-/0nEyPbX7gRsk0Uwfe4ALwwgxuA66d/l2mhRDNlAvaj4U3juhUtJNq0DsY8M2AYwwb9rEq2hrC3IcIcEt++iJA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      },
      "peerDependencies": {
        "typescript": ">=4.8.4 <6.1.0"
      }
    },
    "node_modules/@typescript-eslint/type-utils": {
      "version": "8.59.1",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/type-utils/-/type-utils-8.59.1.tgz",
      "integrity": "sha512-klWPBR2ciQHS3f++ug/mVnWKPjBUo7icEL3FAO1lhAR1Z1i5NQYZ1EannMSRYcq5qCv5wNALlXr6fksRHyYl7w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@typescript-eslint/types": "8.59.1",
        "@typescript-eslint/typescript-estree": "8.59.1",
        "@typescript-eslint/utils": "8.59.1",
        "debug": "^4.4.3",
        "ts-api-utils": "^2.5.0"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      },
      "peerDependencies": {
        "eslint": "^8.57.0 || ^9.0.0 || ^10.0.0",
        "typescript": ">=4.8.4 <6.1.0"
      }
    },
    "node_modules/@typescript-eslint/types": {
      "version": "8.59.1",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/types/-/types-8.59.1.tgz",
      "integrity": "sha512-ZDCjgccSdYPw5Bxh+my4Z0lJU96ZDN7jbBzvmEn0FZx3RtU1C7VWl6NbDx94bwY3V5YsgwRzJPOgeY2Q/nLG8A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      }
    },
    "node_modules/@typescript-eslint/typescript-estree": {
      "version": "8.59.1",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/typescript-estree/-/typescript-estree-8.59.1.tgz",
      "integrity": "sha512-OUd+vJS05sSkOip+BkZ/2NS8RMxrAAJemsC6vU3kmfLyeaJT0TftHkV9mcx2107MmsBVXXexhVu4F0TZXyMl4g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@typescript-eslint/project-service": "8.59.1",
        "@typescript-eslint/tsconfig-utils": "8.59.1",
        "@typescript-eslint/types": "8.59.1",
        "@typescript-eslint/visitor-keys": "8.59.1",
        "debug": "^4.4.3",
        "minimatch": "^10.2.2",
        "semver": "^7.7.3",
        "tinyglobby": "^0.2.15",
        "ts-api-utils": "^2.5.0"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      },
      "peerDependencies": {
        "typescript": ">=4.8.4 <6.1.0"
      }
    },
    "node_modules/@typescript-eslint/typescript-estree/node_modules/balanced-match": {
      "version": "4.0.4",
      "resolved": "https://registry.npmjs.org/balanced-match/-/balanced-match-4.0.4.tgz",
      "integrity": "sha512-BLrgEcRTwX2o6gGxGOCNyMvGSp35YofuYzw9h1IMTRmKqttAZZVU67bdb9Pr2vUHA8+j3i2tJfjO6C6+4myGTA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "18 || 20 || >=22"
      }
    },
    "node_modules/@typescript-eslint/typescript-estree/node_modules/brace-expansion": {
      "version": "5.0.5",
      "resolved": "https://registry.npmjs.org/brace-expansion/-/brace-expansion-5.0.5.tgz",
      "integrity": "sha512-VZznLgtwhn+Mact9tfiwx64fA9erHH/MCXEUfB/0bX/6Fz6ny5EGTXYltMocqg4xFAQZtnO3DHWWXi8RiuN7cQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "balanced-match": "^4.0.2"
      },
      "engines": {
        "node": "18 || 20 || >=22"
      }
    },
    "node_modules/@typescript-eslint/typescript-estree/node_modules/minimatch": {
      "version": "10.2.5",
      "resolved": "https://registry.npmjs.org/minimatch/-/minimatch-10.2.5.tgz",
      "integrity": "sha512-MULkVLfKGYDFYejP07QOurDLLQpcjk7Fw+7jXS2R2czRQzR56yHRveU5NDJEOviH+hETZKSkIk5c+T23GjFUMg==",
      "dev": true,
      "license": "BlueOak-1.0.0",
      "dependencies": {
        "brace-expansion": "^5.0.5"
      },
      "engines": {
        "node": "18 || 20 || >=22"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/@typescript-eslint/typescript-estree/node_modules/semver": {
      "version": "7.7.4",
      "resolved": "https://registry.npmjs.org/semver/-/semver-7.7.4.tgz",
      "integrity": "sha512-vFKC2IEtQnVhpT78h1Yp8wzwrf8CM+MzKMHGJZfBtzhZNycRFnXsHk6E5TxIkkMsgNS7mdX3AGB7x2QM2di4lA==",
      "dev": true,
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/@typescript-eslint/utils": {
      "version": "8.59.1",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/utils/-/utils-8.59.1.tgz",
      "integrity": "sha512-3pIeoXhCeYH9FSCBI8P3iNwJlGuzPlYKkTlen2O9T1DSeeg8UG8jstq6BLk+Mda0qup7mgk4z4XL4OzRaxZ8LA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@eslint-community/eslint-utils": "^4.9.1",
        "@typescript-eslint/scope-manager": "8.59.1",
        "@typescript-eslint/types": "8.59.1",
        "@typescript-eslint/typescript-estree": "8.59.1"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      },
      "peerDependencies": {
        "eslint": "^8.57.0 || ^9.0.0 || ^10.0.0",
        "typescript": ">=4.8.4 <6.1.0"
      }
    },
    "node_modules/@typescript-eslint/visitor-keys": {
      "version": "8.59.1",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/visitor-keys/-/visitor-keys-8.59.1.tgz",
      "integrity": "sha512-LdDNl6C5iJExcM0Yh0PwAIBb9PrSiCsWamF/JyEZawm3kFDnRoaq3LGE4bpyRao/fWeGKKyw7icx0YxrLFC5Cg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@typescript-eslint/types": "8.59.1",
        "eslint-visitor-keys": "^5.0.0"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      }
    },
    "node_modules/@typescript-eslint/visitor-keys/node_modules/eslint-visitor-keys": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/eslint-visitor-keys/-/eslint-visitor-keys-5.0.1.tgz",
      "integrity": "sha512-tD40eHxA35h0PEIZNeIjkHoDR4YjjJp34biM0mDvplBe//mB+IHCqHDGV7pxF+7MklTvighcCPPZC7ynWyjdTA==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": "^20.19.0 || ^22.13.0 || >=24"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/@ungap/structured-clone": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/@ungap/structured-clone/-/structured-clone-1.3.0.tgz",
      "integrity": "sha512-WmoN8qaIAo7WTYWbAZuG8PYEhn5fkz7dZrqTBZ7dtt//lL2Gwms1IcnQ5yHqjDfX8Ft5j4YzDM23f87zBfDe9g==",
      "license": "ISC"
    },
    "node_modules/@unrs/resolver-binding-android-arm-eabi": {
      "version": "1.11.1",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-android-arm-eabi/-/resolver-binding-android-arm-eabi-1.11.1.tgz",
      "integrity": "sha512-ppLRUgHVaGRWUx0R0Ut06Mjo9gBaBkg3v/8AxusGLhsIotbBLuRk51rAzqLC8gq6NyyAojEXglNjzf6R948DNw==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ]
    },
    "node_modules/@unrs/resolver-binding-android-arm64": {
      "version": "1.11.1",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-android-arm64/-/resolver-binding-android-arm64-1.11.1.tgz",
      "integrity": "sha512-lCxkVtb4wp1v+EoN+HjIG9cIIzPkX5OtM03pQYkG+U5O/wL53LC4QbIeazgiKqluGeVEeBlZahHalCaBvU1a2g==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ]
    },
    "node_modules/@unrs/resolver-binding-darwin-arm64": {
      "version": "1.11.1",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-darwin-arm64/-/resolver-binding-darwin-arm64-1.11.1.tgz",
      "integrity": "sha512-gPVA1UjRu1Y/IsB/dQEsp2V1pm44Of6+LWvbLc9SDk1c2KhhDRDBUkQCYVWe6f26uJb3fOK8saWMgtX8IrMk3g==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ]
    },
    "node_modules/@unrs/resolver-binding-darwin-x64": {
      "version": "1.11.1",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-darwin-x64/-/resolver-binding-darwin-x64-1.11.1.tgz",
      "integrity": "sha512-cFzP7rWKd3lZaCsDze07QX1SC24lO8mPty9vdP+YVa3MGdVgPmFc59317b2ioXtgCMKGiCLxJ4HQs62oz6GfRQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ]
    },
    "node_modules/@unrs/resolver-binding-freebsd-x64": {
      "version": "1.11.1",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-freebsd-x64/-/resolver-binding-freebsd-x64-1.11.1.tgz",
      "integrity": "sha512-fqtGgak3zX4DCB6PFpsH5+Kmt/8CIi4Bry4rb1ho6Av2QHTREM+47y282Uqiu3ZRF5IQioJQ5qWRV6jduA+iGw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-arm-gnueabihf": {
      "version": "1.11.1",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-arm-gnueabihf/-/resolver-binding-linux-arm-gnueabihf-1.11.1.tgz",
      "integrity": "sha512-u92mvlcYtp9MRKmP+ZvMmtPN34+/3lMHlyMj7wXJDeXxuM0Vgzz0+PPJNsro1m3IZPYChIkn944wW8TYgGKFHw==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-arm-musleabihf": {
      "version": "1.11.1",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-arm-musleabihf/-/resolver-binding-linux-arm-musleabihf-1.11.1.tgz",
      "integrity": "sha512-cINaoY2z7LVCrfHkIcmvj7osTOtm6VVT16b5oQdS4beibX2SYBwgYLmqhBjA1t51CarSaBuX5YNsWLjsqfW5Cw==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-arm64-gnu": {
      "version": "1.11.1",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-arm64-gnu/-/resolver-binding-linux-arm64-gnu-1.11.1.tgz",
      "integrity": "sha512-34gw7PjDGB9JgePJEmhEqBhWvCiiWCuXsL9hYphDF7crW7UgI05gyBAi6MF58uGcMOiOqSJ2ybEeCvHcq0BCmQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-arm64-musl": {
      "version": "1.11.1",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-arm64-musl/-/resolver-binding-linux-arm64-musl-1.11.1.tgz",
      "integrity": "sha512-RyMIx6Uf53hhOtJDIamSbTskA99sPHS96wxVE/bJtePJJtpdKGXO1wY90oRdXuYOGOTuqjT8ACccMc4K6QmT3w==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-ppc64-gnu": {
      "version": "1.11.1",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-ppc64-gnu/-/resolver-binding-linux-ppc64-gnu-1.11.1.tgz",
      "integrity": "sha512-D8Vae74A4/a+mZH0FbOkFJL9DSK2R6TFPC9M+jCWYia/q2einCubX10pecpDiTmkJVUH+y8K3BZClycD8nCShA==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-riscv64-gnu": {
      "version": "1.11.1",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-riscv64-gnu/-/resolver-binding-linux-riscv64-gnu-1.11.1.tgz",
      "integrity": "sha512-frxL4OrzOWVVsOc96+V3aqTIQl1O2TjgExV4EKgRY09AJ9leZpEg8Ak9phadbuX0BA4k8U5qtvMSQQGGmaJqcQ==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-riscv64-musl": {
      "version": "1.11.1",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-riscv64-musl/-/resolver-binding-linux-riscv64-musl-1.11.1.tgz",
      "integrity": "sha512-mJ5vuDaIZ+l/acv01sHoXfpnyrNKOk/3aDoEdLO/Xtn9HuZlDD6jKxHlkN8ZhWyLJsRBxfv9GYM2utQ1SChKew==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-s390x-gnu": {
      "version": "1.11.1",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-s390x-gnu/-/resolver-binding-linux-s390x-gnu-1.11.1.tgz",
      "integrity": "sha512-kELo8ebBVtb9sA7rMe1Cph4QHreByhaZ2QEADd9NzIQsYNQpt9UkM9iqr2lhGr5afh885d/cB5QeTXSbZHTYPg==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-x64-gnu": {
      "version": "1.11.1",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-x64-gnu/-/resolver-binding-linux-x64-gnu-1.11.1.tgz",
      "integrity": "sha512-C3ZAHugKgovV5YvAMsxhq0gtXuwESUKc5MhEtjBpLoHPLYM+iuwSj3lflFwK3DPm68660rZ7G8BMcwSro7hD5w==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-x64-musl": {
      "version": "1.11.1",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-x64-musl/-/resolver-binding-linux-x64-musl-1.11.1.tgz",
      "integrity": "sha512-rV0YSoyhK2nZ4vEswT/QwqzqQXw5I6CjoaYMOX0TqBlWhojUf8P94mvI7nuJTeaCkkds3QE4+zS8Ko+GdXuZtA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-wasm32-wasi": {
      "version": "1.11.1",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-wasm32-wasi/-/resolver-binding-wasm32-wasi-1.11.1.tgz",
      "integrity": "sha512-5u4RkfxJm+Ng7IWgkzi3qrFOvLvQYnPBmjmZQ8+szTK/b31fQCnleNl1GgEt7nIsZRIf5PLhPwT0WM+q45x/UQ==",
      "cpu": [
        "wasm32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "@napi-rs/wasm-runtime": "^0.2.11"
      },
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/@unrs/resolver-binding-win32-arm64-msvc": {
      "version": "1.11.1",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-win32-arm64-msvc/-/resolver-binding-win32-arm64-msvc-1.11.1.tgz",
      "integrity": "sha512-nRcz5Il4ln0kMhfL8S3hLkxI85BXs3o8EYoattsJNdsX4YUU89iOkVn7g0VHSRxFuVMdM4Q1jEpIId1Ihim/Uw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@unrs/resolver-binding-win32-ia32-msvc": {
      "version": "1.11.1",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-win32-ia32-msvc/-/resolver-binding-win32-ia32-msvc-1.11.1.tgz",
      "integrity": "sha512-DCEI6t5i1NmAZp6pFonpD5m7i6aFrpofcp4LA2i8IIq60Jyo28hamKBxNrZcyOwVOZkgsRp9O2sXWBWP8MnvIQ==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@unrs/resolver-binding-win32-x64-msvc": {
      "version": "1.11.1",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-win32-x64-msvc/-/resolver-binding-win32-x64-msvc-1.11.1.tgz",
      "integrity": "sha512-lrW200hZdbfRtztbygyaq/6jP6AKE8qQN2KvPcJ+x7wiD038YtnYtZ82IMNJ69GJibV7bwL3y9FgK+5w/pYt6g==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/accepts": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/accepts/-/accepts-2.0.0.tgz",
      "integrity": "sha512-5cvg6CtKwfgdmVqY1WIiXKc3Q1bkRqGLi+2W/6ao+6Y7gu/RCwRuAhGEzh5B4KlszSuTLgZYuqFqo5bImjNKng==",
      "license": "MIT",
      "dependencies": {
        "mime-types": "^3.0.0",
        "negotiator": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/accessor-fn": {
      "version": "1.5.3",
      "resolved": "https://registry.npmjs.org/accessor-fn/-/accessor-fn-1.5.3.tgz",
      "integrity": "sha512-rkAofCwe/FvYFUlMB0v0gWmhqtfAtV1IUkdPbfhTUyYniu5LrC0A0UJkTH0Jv3S8SvwkmfuAlY+mQIJATdocMA==",
      "license": "MIT",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/acorn": {
      "version": "8.16.0",
      "resolved": "https://registry.npmjs.org/acorn/-/acorn-8.16.0.tgz",
      "integrity": "sha512-UVJyE9MttOsBQIDKw1skb9nAwQuR5wuGD3+82K6JgJlm/Y+KI92oNsMNGZCYdDsVtRHSak0pcV5Dno5+4jh9sw==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "acorn": "bin/acorn"
      },
      "engines": {
        "node": ">=0.4.0"
      }
    },
    "node_modules/acorn-jsx": {
      "version": "5.3.2",
      "resolved": "https://registry.npmjs.org/acorn-jsx/-/acorn-jsx-5.3.2.tgz",
      "integrity": "sha512-rq9s+JNhf0IChjtDXxllJ7g41oZk5SlXtp0LHwyA5cejwn7vKmKp4pPri6YEePv2PU65sAsegbXtIinmDFDXgQ==",
      "dev": true,
      "license": "MIT",
      "peerDependencies": {
        "acorn": "^6.0.0 || ^7.0.0 || ^8.0.0"
      }
    },
    "node_modules/agent-base": {
      "version": "7.1.4",
      "resolved": "https://registry.npmjs.org/agent-base/-/agent-base-7.1.4.tgz",
      "integrity": "sha512-MnA+YT8fwfJPgBx3m60MNqakm30XOkyIoH1y6huTQvC0PwZG7ki8NacLBcrPbNoo8vEZy7Jpuk7+jMO+CUovTQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 14"
      }
    },
    "node_modules/ajv": {
      "version": "6.15.0",
      "resolved": "https://registry.npmjs.org/ajv/-/ajv-6.15.0.tgz",
      "integrity": "sha512-fgFx7Hfoq60ytK2c7DhnF8jIvzYgOMxfugjLOSMHjLIPgenqa7S7oaagATUq99mV6IYvN2tRmC0wnTYX6iPbMw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fast-deep-equal": "^3.1.1",
        "fast-json-stable-stringify": "^2.0.0",
        "json-schema-traverse": "^0.4.1",
        "uri-js": "^4.2.2"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/epoberezkin"
      }
    },
    "node_modules/ajv-formats": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/ajv-formats/-/ajv-formats-3.0.1.tgz",
      "integrity": "sha512-8iUql50EUR+uUcdRQ3HDqa6EVyo3docL8g5WJ3FNcWmu62IbkGUue/pEyLBW8VGKKucTPgqeks4fIU1DA4yowQ==",
      "license": "MIT",
      "dependencies": {
        "ajv": "^8.0.0"
      },
      "peerDependencies": {
        "ajv": "^8.0.0"
      },
      "peerDependenciesMeta": {
        "ajv": {
          "optional": true
        }
      }
    },
    "node_modules/ajv-formats/node_modules/ajv": {
      "version": "8.20.0",
      "resolved": "https://registry.npmjs.org/ajv/-/ajv-8.20.0.tgz",
      "integrity": "sha512-Thbli+OlOj+iMPYFBVBfJ3OmCAnaSyNn4M1vz9T6Gka5Jt9ba/HIR56joy65tY6kx/FCF5VXNB819Y7/GUrBGA==",
      "license": "MIT",
      "dependencies": {
        "fast-deep-equal": "^3.1.3",
        "fast-uri": "^3.0.1",
        "json-schema-traverse": "^1.0.0",
        "require-from-string": "^2.0.2"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/epoberezkin"
      }
    },
    "node_modules/ajv-formats/node_modules/json-schema-traverse": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/json-schema-traverse/-/json-schema-traverse-1.0.0.tgz",
      "integrity": "sha512-NM8/P9n3XjXhIZn1lLhkFaACTOURQXjWhV4BA/RnOv8xvgqtqpAX9IO4mRQxSx1Rlo4tqzeqb0sOlruaOy3dug==",
      "license": "MIT"
    },
    "node_modules/ansi-regex": {
      "version": "6.2.2",
      "resolved": "https://registry.npmjs.org/ansi-regex/-/ansi-regex-6.2.2.tgz",
      "integrity": "sha512-Bq3SmSpyFHaWjPk8If9yc6svM8c56dB5BAtW4Qbw5jHTwwXXcTLoRMkpDJp6VL0XzlWaCHTXrkFURMYmD0sLqg==",
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/chalk/ansi-regex?sponsor=1"
      }
    },
    "node_modules/ansi-styles": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-4.3.0.tgz",
      "integrity": "sha512-zbB9rCJAT1rbjiVDb2hqKFHNYLxgtk8NURxZ3IZwD3F6NtxbXZQCnnSi1Lkx+IDohdPlFp222wVALIheZJQSEg==",
      "license": "MIT",
      "dependencies": {
        "color-convert": "^2.0.1"
      },
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/chalk/ansi-styles?sponsor=1"
      }
    },
    "node_modules/argparse": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/argparse/-/argparse-2.0.1.tgz",
      "integrity": "sha512-8+9WqebbFzpX9OR+Wa6O29asIogeRMzcGtAINdpMHHyAg10f05aSFVBbcEqGf/PXw1EjAZ+q2/bEBg3DvurK3Q==",
      "license": "Python-2.0"
    },
    "node_modules/aria-query": {
      "version": "5.3.2",
      "resolved": "https://registry.npmjs.org/aria-query/-/aria-query-5.3.2.tgz",
      "integrity": "sha512-COROpnaoap1E2F000S62r6A60uHZnmlvomhfyT2DlTcrY1OrBKn2UhH7qn5wTC9zMvD0AY7csdPSNwKP+7WiQw==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/array-buffer-byte-length": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/array-buffer-byte-length/-/array-buffer-byte-length-1.0.2.tgz",
      "integrity": "sha512-LHE+8BuR7RYGDKvnrmcuSq3tDcKv9OFEXQt/HpbZhY7V6h0zlUXutnAD82GiFx9rdieCMjkvtcsPqBwgUl1Iiw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "is-array-buffer": "^3.0.5"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/array-includes": {
      "version": "3.1.9",
      "resolved": "https://registry.npmjs.org/array-includes/-/array-includes-3.1.9.tgz",
      "integrity": "sha512-FmeCCAenzH0KH381SPT5FZmiA/TmpndpcaShhfgEN9eCVjnFBqq3l1xrI42y8+PPLI6hypzou4GXw00WHmPBLQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "call-bound": "^1.0.4",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.24.0",
        "es-object-atoms": "^1.1.1",
        "get-intrinsic": "^1.3.0",
        "is-string": "^1.1.1",
        "math-intrinsics": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/array.prototype.findlast": {
      "version": "1.2.5",
      "resolved": "https://registry.npmjs.org/array.prototype.findlast/-/array.prototype.findlast-1.2.5.tgz",
      "integrity": "sha512-CVvd6FHg1Z3POpBLxO6E6zr+rSKEQ9L6rZHAaY7lLfhKsWYUBBOuMs0e9o24oopj6H+geRCX0YJ+TJLBK2eHyQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.7",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.2",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.0.0",
        "es-shim-unscopables": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/array.prototype.findlastindex": {
      "version": "1.2.6",
      "resolved": "https://registry.npmjs.org/array.prototype.findlastindex/-/array.prototype.findlastindex-1.2.6.tgz",
      "integrity": "sha512-F/TKATkzseUExPlfvmwQKGITM3DGTK+vkAsCZoDc5daVygbJBnjEUCbgkAvVFsgfXfX4YIqZ/27G3k3tdXrTxQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "call-bound": "^1.0.4",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.9",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.1.1",
        "es-shim-unscopables": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/array.prototype.flat": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/array.prototype.flat/-/array.prototype.flat-1.3.3.tgz",
      "integrity": "sha512-rwG/ja1neyLqCuGZ5YYrznA62D4mZXg0i1cIskIUKSiqF3Cje9/wXAls9B9s1Wa2fomMsIv8czB8jZcPmxCXFg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.5",
        "es-shim-unscopables": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/array.prototype.flatmap": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/array.prototype.flatmap/-/array.prototype.flatmap-1.3.3.tgz",
      "integrity": "sha512-Y7Wt51eKJSyi80hFrJCePGGNo5ktJCslFuboqJsbf57CCPcm5zztluPlc4/aD8sWsKvlwatezpV4U1efk8kpjg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.5",
        "es-shim-unscopables": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/array.prototype.tosorted": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/array.prototype.tosorted/-/array.prototype.tosorted-1.1.4.tgz",
      "integrity": "sha512-p6Fx8B7b7ZhL/gmUsAy0D15WhvDccw3mnGNbZpi3pmeJdxtWsj2jEaI4Y6oo3XiHfzuSgPwKc04MYt6KgvC/wA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.7",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.3",
        "es-errors": "^1.3.0",
        "es-shim-unscopables": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/arraybuffer.prototype.slice": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/arraybuffer.prototype.slice/-/arraybuffer.prototype.slice-1.0.4.tgz",
      "integrity": "sha512-BNoCY6SXXPQ7gF2opIP4GBE+Xw7U+pHMYKuzjgCN3GwiaIR09UUeKfheyIry77QtrCBlC0KK0q5/TER/tYh3PQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "array-buffer-byte-length": "^1.0.1",
        "call-bind": "^1.0.8",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.5",
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.6",
        "is-array-buffer": "^3.0.4"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/ast-types": {
      "version": "0.16.1",
      "resolved": "https://registry.npmjs.org/ast-types/-/ast-types-0.16.1.tgz",
      "integrity": "sha512-6t10qk83GOG8p0vKmaCr8eiilZwO171AvbROMtvvNiwrTly62t+7XkA8RdIIVbpMhCASAsxgAzdRSwh6nw/5Dg==",
      "license": "MIT",
      "dependencies": {
        "tslib": "^2.0.1"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/ast-types-flow": {
      "version": "0.0.8",
      "resolved": "https://registry.npmjs.org/ast-types-flow/-/ast-types-flow-0.0.8.tgz",
      "integrity": "sha512-OH/2E5Fg20h2aPrbe+QL8JZQFko0YZaF+j4mnQ7BGhfavO7OpSLa8a0y9sBwomHdSbkhTS8TQNayBfnW5DwbvQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/async-function": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/async-function/-/async-function-1.0.0.tgz",
      "integrity": "sha512-hsU18Ae8CDTR6Kgu9DYf0EbCr/a5iGL0rytQDobUcdpYOKokk8LEjVphnXkDkgpi0wYVsqrXuP0bZxJaTqdgoA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/available-typed-arrays": {
      "version": "1.0.7",
      "resolved": "https://registry.npmjs.org/available-typed-arrays/-/available-typed-arrays-1.0.7.tgz",
      "integrity": "sha512-wvUjBtSGN7+7SjNpq/9M2Tg350UZD3q62IFZLbRAR1bSMlCo1ZaeW+BJ+D090e4hIIZLBcTDWe4Mh4jvUDajzQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "possible-typed-array-names": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/axe-core": {
      "version": "4.11.4",
      "resolved": "https://registry.npmjs.org/axe-core/-/axe-core-4.11.4.tgz",
      "integrity": "sha512-KunSNx+TVpkAw/6ULfhnx+HWRecjqZGTOyquAoWHYLRSdK1tB5Ihce1ZW+UY3fj33bYAFWPu7W/GRSmmrCGuxA==",
      "dev": true,
      "license": "MPL-2.0",
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/axobject-query": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/axobject-query/-/axobject-query-4.1.0.tgz",
      "integrity": "sha512-qIj0G9wZbMGNLjLmg1PT6v2mE9AH2zlnADJD/2tC6E00hgmhUOfEB6greHPAfLRSufHqROIUTkw6E+M3lH0PTQ==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/babel-plugin-react-compiler": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/babel-plugin-react-compiler/-/babel-plugin-react-compiler-1.0.0.tgz",
      "integrity": "sha512-Ixm8tFfoKKIPYdCCKYTsqv+Fd4IJ0DQqMyEimo+pxUOMUR9cVPlwTrFt9Avu+3cb6Zp3mAzl+t1MrG2fxxKsxw==",
      "devOptional": true,
      "license": "MIT",
      "dependencies": {
        "@babel/types": "^7.26.0"
      }
    },
    "node_modules/bail": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/bail/-/bail-2.0.2.tgz",
      "integrity": "sha512-0xO6mYd7JB2YesxDKplafRpsiOzPt9V02ddPCLbY1xYGPOX24NTyN50qnUxgCPcSoYMhKpAuBTjQoRZCAkUDRw==",
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/balanced-match": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/balanced-match/-/balanced-match-1.0.2.tgz",
      "integrity": "sha512-3oSeUO0TMV67hN1AmbXsK4yaqU7tjiHlbxRDZOpH0KW9+CeX4bRAaX0Anxt0tx2MrpRpWwQaPwIlISEJhYU5Pw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/baseline-browser-mapping": {
      "version": "2.10.25",
      "resolved": "https://registry.npmjs.org/baseline-browser-mapping/-/baseline-browser-mapping-2.10.25.tgz",
      "integrity": "sha512-QO/VHsXCQdnzADMfmkeOPvHdIAkoB7i0/rGjINPJEetLx75hNttVWGQ/jycHUDP9zZ9rupbm60WRxcwViB0MiA==",
      "license": "Apache-2.0",
      "bin": {
        "baseline-browser-mapping": "dist/cli.cjs"
      },
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/bezier-js": {
      "version": "6.1.4",
      "resolved": "https://registry.npmjs.org/bezier-js/-/bezier-js-6.1.4.tgz",
      "integrity": "sha512-PA0FW9ZpcHbojUCMu28z9Vg/fNkwTj5YhusSAjHHDfHDGLxJ6YUKrAN2vk1fP2MMOxVw4Oko16FMlRGVBGqLKg==",
      "license": "MIT",
      "funding": {
        "type": "individual",
        "url": "https://github.com/Pomax/bezierjs/blob/master/FUNDING.md"
      }
    },
    "node_modules/body-parser": {
      "version": "2.2.2",
      "resolved": "https://registry.npmjs.org/body-parser/-/body-parser-2.2.2.tgz",
      "integrity": "sha512-oP5VkATKlNwcgvxi0vM0p/D3n2C3EReYVX+DNYs5TjZFn/oQt2j+4sVJtSMr18pdRr8wjTcBl6LoV+FUwzPmNA==",
      "license": "MIT",
      "dependencies": {
        "bytes": "^3.1.2",
        "content-type": "^1.0.5",
        "debug": "^4.4.3",
        "http-errors": "^2.0.0",
        "iconv-lite": "^0.7.0",
        "on-finished": "^2.4.1",
        "qs": "^6.14.1",
        "raw-body": "^3.0.1",
        "type-is": "^2.0.1"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/brace-expansion": {
      "version": "1.1.14",
      "resolved": "https://registry.npmjs.org/brace-expansion/-/brace-expansion-1.1.14.tgz",
      "integrity": "sha512-MWPGfDxnyzKU7rNOW9SP/c50vi3xrmrua/+6hfPbCS2ABNWfx24vPidzvC7krjU/RTo235sV776ymlsMtGKj8g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "balanced-match": "^1.0.0",
        "concat-map": "0.0.1"
      }
    },
    "node_modules/braces": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/braces/-/braces-3.0.3.tgz",
      "integrity": "sha512-yQbXgO/OSZVD2IsiLlro+7Hf6Q18EJrKSEsdoMzKePKXct3gvD8oLcOQdIzGupr5Fj+EDe8gO/lxc1BzfMpxvA==",
      "license": "MIT",
      "dependencies": {
        "fill-range": "^7.1.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/browserslist": {
      "version": "4.28.2",
      "resolved": "https://registry.npmjs.org/browserslist/-/browserslist-4.28.2.tgz",
      "integrity": "sha512-48xSriZYYg+8qXna9kwqjIVzuQxi+KYWp2+5nCYnYKPTr0LvD89Jqk2Or5ogxz0NUMfIjhh2lIUX/LyX9B4oIg==",
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/browserslist"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "baseline-browser-mapping": "^2.10.12",
        "caniuse-lite": "^1.0.30001782",
        "electron-to-chromium": "^1.5.328",
        "node-releases": "^2.0.36",
        "update-browserslist-db": "^1.2.3"
      },
      "bin": {
        "browserslist": "cli.js"
      },
      "engines": {
        "node": "^6 || ^7 || ^8 || ^9 || ^10 || ^11 || ^12 || >=13.7"
      }
    },
    "node_modules/bundle-name": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/bundle-name/-/bundle-name-4.1.0.tgz",
      "integrity": "sha512-tjwM5exMg6BGRI+kNmTntNsvdZS1X8BFYS6tnJ2hdH0kVxM6/eVZ2xy+FqStSWvYmtfFMDLIxurorHwDKfDz5Q==",
      "license": "MIT",
      "dependencies": {
        "run-applescript": "^7.0.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/bytes": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/bytes/-/bytes-3.1.2.tgz",
      "integrity": "sha512-/Nf7TyzTx6S3yRJObOAV7956r8cr2+Oj8AC5dt8wSP3BQAoeX58NoHyCU8P8zGkNXStjTSi6fzO6F0pBdcYbEg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/call-bind": {
      "version": "1.0.9",
      "resolved": "https://registry.npmjs.org/call-bind/-/call-bind-1.0.9.tgz",
      "integrity": "sha512-a/hy+pNsFUTR+Iz8TCJvXudKVLAnz/DyeSUo10I5yvFDQJBFU2s9uqQpoSrJlroHUKoKqzg+epxyP9lqFdzfBQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.2",
        "es-define-property": "^1.0.1",
        "get-intrinsic": "^1.3.0",
        "set-function-length": "^1.2.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/call-bind-apply-helpers": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/call-bind-apply-helpers/-/call-bind-apply-helpers-1.0.2.tgz",
      "integrity": "sha512-Sp1ablJ0ivDkSzjcaJdxEunN5/XvksFJ2sMBFfq6x0ryhQV/2b/KwFe21cMpmHtPOSij8K99/wSfoEuTObmuMQ==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/call-bound": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/call-bound/-/call-bound-1.0.4.tgz",
      "integrity": "sha512-+ys997U96po4Kx/ABpBCqhA9EuxJaQWDQg7295H4hBphv3IZg0boBKuwYpt4YXp6MZ5AmZQnU/tyMTlRpaSejg==",
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.2",
        "get-intrinsic": "^1.3.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/callsites": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/callsites/-/callsites-3.1.0.tgz",
      "integrity": "sha512-P8BjAsXvZS+VIDUI11hHCQEv74YT67YUi5JJFNWIqL235sBmjX4+qx9Muvls5ivyNENctx46xQLQ3aTuE7ssaQ==",
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/caniuse-lite": {
      "version": "1.0.30001791",
      "resolved": "https://registry.npmjs.org/caniuse-lite/-/caniuse-lite-1.0.30001791.tgz",
      "integrity": "sha512-yk0l/YSrOnFZk3UROpDLQD9+kC1l4meK/wed583AXrzoarMGJcbRi2Q4RaUYbKxYAsZ8sWmaSa/DsLmdBeI1vQ==",
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/caniuse-lite"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "CC-BY-4.0"
    },
    "node_modules/canvas-color-tracker": {
      "version": "1.3.2",
      "resolved": "https://registry.npmjs.org/canvas-color-tracker/-/canvas-color-tracker-1.3.2.tgz",
      "integrity": "sha512-ryQkDX26yJ3CXzb3hxUVNlg1NKE4REc5crLBq661Nxzr8TNd236SaEf2ffYLXyI5tSABSeguHLqcVq4vf9L3Zg==",
      "license": "MIT",
      "dependencies": {
        "tinycolor2": "^1.6.0"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/ccount": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/ccount/-/ccount-2.0.1.tgz",
      "integrity": "sha512-eyrF0jiFpY+3drT6383f1qhkbGsLSifNAjA61IUjZjmLCWjItY6LB9ft9YhoDgwfmclB2zhu51Lc7+95b8NRAg==",
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/chalk": {
      "version": "4.1.2",
      "resolved": "https://registry.npmjs.org/chalk/-/chalk-4.1.2.tgz",
      "integrity": "sha512-oKnbhFyRIXpUuez8iBMmyEa4nbj4IOQyuhc/wy9kY7/WVPcwIO9VA668Pu8RkO7+0G76SLROeyw9CpQ061i4mA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-styles": "^4.1.0",
        "supports-color": "^7.1.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/chalk/chalk?sponsor=1"
      }
    },
    "node_modules/character-entities": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/character-entities/-/character-entities-2.0.2.tgz",
      "integrity": "sha512-shx7oQ0Awen/BRIdkjkvz54PnEEI/EjwXDSIZp86/KKdbafHh1Df/RYGBhn4hbe2+uKC9FnT5UCEdyPz3ai9hQ==",
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/character-entities-html4": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/character-entities-html4/-/character-entities-html4-2.1.0.tgz",
      "integrity": "sha512-1v7fgQRj6hnSwFpq1Eu0ynr/CDEw0rXo2B61qXrLNdHZmPKgb7fqS1a2JwF0rISo9q77jDI8VMEHoApn8qDoZA==",
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/character-entities-legacy": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/character-entities-legacy/-/character-entities-legacy-3.0.0.tgz",
      "integrity": "sha512-RpPp0asT/6ufRm//AJVwpViZbGM/MkjQFxJccQRHmISF/22NBtsHqAWmL+/pmkPWoIUJdWyeVleTl1wydHATVQ==",
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/character-reference-invalid": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/character-reference-invalid/-/character-reference-invalid-2.0.1.tgz",
      "integrity": "sha512-iBZ4F4wRbyORVsu0jPV7gXkOsGYjGHPmAyv+HiHG8gi5PtC9KI2j1+v8/tlibRvjoWX027ypmG/n0HtO5t7unw==",
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/class-variance-authority": {
      "version": "0.7.1",
      "resolved": "https://registry.npmjs.org/class-variance-authority/-/class-variance-authority-0.7.1.tgz",
      "integrity": "sha512-Ka+9Trutv7G8M6WT6SeiRWz792K5qEqIGEGzXKhAE6xOWAY6pPH8U+9IY3oCMv6kqTmLsv7Xh/2w2RigkePMsg==",
      "license": "Apache-2.0",
      "dependencies": {
        "clsx": "^2.1.1"
      },
      "funding": {
        "url": "https://polar.sh/cva"
      }
    },
    "node_modules/cli-cursor": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/cli-cursor/-/cli-cursor-5.0.0.tgz",
      "integrity": "sha512-aCj4O5wKyszjMmDT4tZj93kxyydN/K5zPWSCe6/0AV/AA1pqe5ZBIw0a2ZfPQV7lL5/yb5HsUreJ6UFAF1tEQw==",
      "license": "MIT",
      "dependencies": {
        "restore-cursor": "^5.0.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/cli-spinners": {
      "version": "2.9.2",
      "resolved": "https://registry.npmjs.org/cli-spinners/-/cli-spinners-2.9.2.tgz",
      "integrity": "sha512-ywqV+5MmyL4E7ybXgKys4DugZbX0FC6LnwrhjuykIjnK9k8OQacQ7axGKnjDXWNhns0xot3bZI5h55H8yo9cJg==",
      "license": "MIT",
      "engines": {
        "node": ">=6"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/cli-width": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/cli-width/-/cli-width-4.1.0.tgz",
      "integrity": "sha512-ouuZd4/dm2Sw5Gmqy6bGyNNNe1qt9RpmxveLSO7KcgsTnU7RXfsw+/bukWGo1abgBiMAic068rclZsO4IWmmxQ==",
      "license": "ISC",
      "engines": {
        "node": ">= 12"
      }
    },
    "node_modules/client-only": {
      "version": "0.0.1",
      "resolved": "https://registry.npmjs.org/client-only/-/client-only-0.0.1.tgz",
      "integrity": "sha512-IV3Ou0jSMzZrd3pZ48nLkT9DA7Ag1pnPzaiQhpW7c3RbcqqzvzzVu+L8gfqMp/8IM2MQtSiqaCxrrcfu8I8rMA==",
      "license": "MIT"
    },
    "node_modules/cliui": {
      "version": "8.0.1",
      "resolved": "https://registry.npmjs.org/cliui/-/cliui-8.0.1.tgz",
      "integrity": "sha512-BSeNnyus75C4//NQ9gQt1/csTXyo/8Sb+afLAkzAptFuMsod9HFokGNudZpi/oQV73hnVK+sR+5PVRMd+Dr7YQ==",
      "license": "ISC",
      "dependencies": {
        "string-width": "^4.2.0",
        "strip-ansi": "^6.0.1",
        "wrap-ansi": "^7.0.0"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/cliui/node_modules/ansi-regex": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/ansi-regex/-/ansi-regex-5.0.1.tgz",
      "integrity": "sha512-quJQXlTSUGL2LH9SUXo8VwsY4soanhgo6LNSm84E1LBcE8s3O0wpdiRzyR9z/ZZJMlMWv37qOOb9pdJlMUEKFQ==",
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/cliui/node_modules/emoji-regex": {
      "version": "8.0.0",
      "resolved": "https://registry.npmjs.org/emoji-regex/-/emoji-regex-8.0.0.tgz",
      "integrity": "sha512-MSjYzcWNOA0ewAHpz0MxpYFvwg6yjy1NG3xteoqz644VCo/RPgnr1/GGt+ic3iJTzQ8Eu3TdM14SawnVUmGE6A==",
      "license": "MIT"
    },
    "node_modules/cliui/node_modules/string-width": {
      "version": "4.2.3",
      "resolved": "https://registry.npmjs.org/string-width/-/string-width-4.2.3.tgz",
      "integrity": "sha512-wKyQRQpjJ0sIp62ErSZdGsjMJWsap5oRNihHhu6G7JVO/9jIB6UyevL+tXuOqrng8j/cxKTWyWUwvSTriiZz/g==",
      "license": "MIT",
      "dependencies": {
        "emoji-regex": "^8.0.0",
        "is-fullwidth-code-point": "^3.0.0",
        "strip-ansi": "^6.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/cliui/node_modules/strip-ansi": {
      "version": "6.0.1",
      "resolved": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-6.0.1.tgz",
      "integrity": "sha512-Y38VPSHcqkFrCpFnQ9vuSXmquuv5oXOKpGeT6aGrr3o3Gc9AlVa6JBfUSOCnbxGGZF+/0ooI7KrPuUSztUdU5A==",
      "license": "MIT",
      "dependencies": {
        "ansi-regex": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/clsx": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/clsx/-/clsx-2.1.1.tgz",
      "integrity": "sha512-eYm0QWBtUrBWZWG0d386OGAw16Z995PiOVo2B7bjWSbHedGl5e0ZWaq65kOGgUSNesEIDkB9ISbTg/JK9dhCZA==",
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/code-block-writer": {
      "version": "13.0.3",
      "resolved": "https://registry.npmjs.org/code-block-writer/-/code-block-writer-13.0.3.tgz",
      "integrity": "sha512-Oofo0pq3IKnsFtuHqSF7TqBfr71aeyZDVJ0HpmqB7FBM2qEigL0iPONSCZSO9pE9dZTAxANe5XHG9Uy0YMv8cg==",
      "license": "MIT"
    },
    "node_modules/color-convert": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/color-convert/-/color-convert-2.0.1.tgz",
      "integrity": "sha512-RRECPsj7iu/xb5oKYcsFHSppFNnsj/52OVTRKb4zP5onXwVF3zVmmToNcOfGC+CRDpfK/U584fMg38ZHCaElKQ==",
      "license": "MIT",
      "dependencies": {
        "color-name": "~1.1.4"
      },
      "engines": {
        "node": ">=7.0.0"
      }
    },
    "node_modules/color-name": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/color-name/-/color-name-1.1.4.tgz",
      "integrity": "sha512-dOy+3AuW3a2wNbZHIuMZpTcgjGuLU/uBL/ubcZF9OXbDo8ff4O8yVp5Bf0efS8uEoYo5q4Fx7dY9OgQGXgAsQA==",
      "license": "MIT"
    },
    "node_modules/comma-separated-tokens": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/comma-separated-tokens/-/comma-separated-tokens-2.0.3.tgz",
      "integrity": "sha512-Fu4hJdvzeylCfQPp9SGWidpzrMs7tTrlu6Vb8XGaRGck8QSNZJJp538Wrb60Lax4fPwR64ViY468OIUTbRlGZg==",
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/commander": {
      "version": "14.0.3",
      "resolved": "https://registry.npmjs.org/commander/-/commander-14.0.3.tgz",
      "integrity": "sha512-H+y0Jo/T1RZ9qPP4Eh1pkcQcLRglraJaSLoyOtHxu6AapkjWVCy2Sit1QQ4x3Dng8qDlSsZEet7g5Pq06MvTgw==",
      "license": "MIT",
      "engines": {
        "node": ">=20"
      }
    },
    "node_modules/concat-map": {
      "version": "0.0.1",
      "resolved": "https://registry.npmjs.org/concat-map/-/concat-map-0.0.1.tgz",
      "integrity": "sha512-/Srv4dswyQNBfohGpz9o6Yb3Gz3SrUDqBH5rTuhGR7ahtlbYKnVxw2bCFMRljaA7EXHaXZ8wsHdodFvbkhKmqg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/content-disposition": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/content-disposition/-/content-disposition-1.1.0.tgz",
      "integrity": "sha512-5jRCH9Z/+DRP7rkvY83B+yGIGX96OYdJmzngqnw2SBSxqCFPd0w2km3s5iawpGX8krnwSGmF0FW5Nhr0Hfai3g==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/content-type": {
      "version": "1.0.5",
      "resolved": "https://registry.npmjs.org/content-type/-/content-type-1.0.5.tgz",
      "integrity": "sha512-nTjqfcBFEipKdXCv4YDQWCfmcLZKm81ldF0pAopTvyrFGVbcR6P/VAAd5G7N+0tTr8QqiU0tFadD6FK4NtJwOA==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/convert-source-map": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/convert-source-map/-/convert-source-map-2.0.0.tgz",
      "integrity": "sha512-Kvp459HrV2FEJ1CAsi1Ku+MY3kasH19TFykTz2xWmMeq6bk2NU3XXvfJ+Q61m0xktWwt+1HSYf3JZsTms3aRJg==",
      "license": "MIT"
    },
    "node_modules/cookie": {
      "version": "0.7.2",
      "resolved": "https://registry.npmjs.org/cookie/-/cookie-0.7.2.tgz",
      "integrity": "sha512-yki5XnKuf750l50uGTllt6kKILY4nQ1eNIQatoXEByZ5dWgnKqbnqmTrBE5B4N7lrMJKQ2ytWMiTO2o0v6Ew/w==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/cookie-signature": {
      "version": "1.2.2",
      "resolved": "https://registry.npmjs.org/cookie-signature/-/cookie-signature-1.2.2.tgz",
      "integrity": "sha512-D76uU73ulSXrD1UXF4KE2TMxVVwhsnCgfAyTg9k8P6KGZjlXKrOLe4dJQKI3Bxi5wjesZoFXJWElNWBjPZMbhg==",
      "license": "MIT",
      "engines": {
        "node": ">=6.6.0"
      }
    },
    "node_modules/cors": {
      "version": "2.8.6",
      "resolved": "https://registry.npmjs.org/cors/-/cors-2.8.6.tgz",
      "integrity": "sha512-tJtZBBHA6vjIAaF6EnIaq6laBBP9aq/Y3ouVJjEfoHbRBcHBAHYcMh/w8LDrk2PvIMMq8gmopa5D4V8RmbrxGw==",
      "license": "MIT",
      "dependencies": {
        "object-assign": "^4",
        "vary": "^1"
      },
      "engines": {
        "node": ">= 0.10"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/cosmiconfig": {
      "version": "9.0.1",
      "resolved": "https://registry.npmjs.org/cosmiconfig/-/cosmiconfig-9.0.1.tgz",
      "integrity": "sha512-hr4ihw+DBqcvrsEDioRO31Z17x71pUYoNe/4h6Z0wB72p7MU7/9gH8Q3s12NFhHPfYBBOV3qyfUxmr/Yn3shnQ==",
      "license": "MIT",
      "dependencies": {
        "env-paths": "^2.2.1",
        "import-fresh": "^3.3.0",
        "js-yaml": "^4.1.0",
        "parse-json": "^5.2.0"
      },
      "engines": {
        "node": ">=14"
      },
      "funding": {
        "url": "https://github.com/sponsors/d-fischer"
      },
      "peerDependencies": {
        "typescript": ">=4.9.5"
      },
      "peerDependenciesMeta": {
        "typescript": {
          "optional": true
        }
      }
    },
    "node_modules/cross-spawn": {
      "version": "7.0.6",
      "resolved": "https://registry.npmjs.org/cross-spawn/-/cross-spawn-7.0.6.tgz",
      "integrity": "sha512-uV2QOWP2nWzsy2aMp8aRibhi9dlzF5Hgh5SHaB9OiTGEyDTiJJyx0uy51QXdyWbtAHNua4XJzUKca3OzKUd3vA==",
      "license": "MIT",
      "dependencies": {
        "path-key": "^3.1.0",
        "shebang-command": "^2.0.0",
        "which": "^2.0.1"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/cssesc": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/cssesc/-/cssesc-3.0.0.tgz",
      "integrity": "sha512-/Tb/JcjK111nNScGob5MNtsntNM1aCNUDipB/TkwZFhyDrrE47SOx/18wF2bbjgc3ZzCSKW1T5nt5EbFoAz/Vg==",
      "license": "MIT",
      "bin": {
        "cssesc": "bin/cssesc"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/csstype": {
      "version": "3.2.3",
      "resolved": "https://registry.npmjs.org/csstype/-/csstype-3.2.3.tgz",
      "integrity": "sha512-z1HGKcYy2xA8AGQfwrn0PAy+PB7X/GSj3UVJW9qKyn43xWa+gl5nXmU4qqLMRzWVLFC8KusUX8T/0kCiOYpAIQ==",
      "license": "MIT"
    },
    "node_modules/d3-array": {
      "version": "3.2.4",
      "resolved": "https://registry.npmjs.org/d3-array/-/d3-array-3.2.4.tgz",
      "integrity": "sha512-tdQAmyA18i4J7wprpYq8ClcxZy3SC31QMeByyCFyRt7BVHdREQZ5lpzoe5mFEYZUWe+oq8HBvk9JjpibyEV4Jg==",
      "license": "ISC",
      "dependencies": {
        "internmap": "1 - 2"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-binarytree": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/d3-binarytree/-/d3-binarytree-1.0.2.tgz",
      "integrity": "sha512-cElUNH+sHu95L04m92pG73t2MEJXKu+GeKUN1TJkFsu93E5W8E9Sc3kHEGJKgenGvj19m6upSn2EunvMgMD2Yw==",
      "license": "MIT"
    },
    "node_modules/d3-color": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/d3-color/-/d3-color-3.1.0.tgz",
      "integrity": "sha512-zg/chbXyeBtMQ1LbD/WSoW2DpC3I0mpmPdW+ynRTj/x2DAWYrIY7qeZIHidozwV24m4iavr15lNwIwLxRmOxhA==",
      "license": "ISC",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-dispatch": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/d3-dispatch/-/d3-dispatch-3.0.1.tgz",
      "integrity": "sha512-rzUyPU/S7rwUflMyLc1ETDeBj0NRuHKKAcvukozwhshr6g6c5d8zh4c2gQjY2bZ0dXeGLWc1PF174P2tVvKhfg==",
      "license": "ISC",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-drag": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/d3-drag/-/d3-drag-3.0.0.tgz",
      "integrity": "sha512-pWbUJLdETVA8lQNJecMxoXfH6x+mO2UQo8rSmZ+QqxcbyA3hfeprFgIT//HW2nlHChWeIIMwS2Fq+gEARkhTkg==",
      "license": "ISC",
      "dependencies": {
        "d3-dispatch": "1 - 3",
        "d3-selection": "3"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-ease": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/d3-ease/-/d3-ease-3.0.1.tgz",
      "integrity": "sha512-wR/XK3D3XcLIZwpbvQwQ5fK+8Ykds1ip7A2Txe0yxncXSdq1L9skcG7blcedkOX+ZcgxGAmLX1FrRGbADwzi0w==",
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-force": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/d3-force/-/d3-force-3.0.0.tgz",
      "integrity": "sha512-zxV/SsA+U4yte8051P4ECydjD/S+qeYtnaIyAs9tgHCqfguma/aAQDjo85A9Z6EKhBirHRJHXIgJUlffT4wdLg==",
      "license": "ISC",
      "dependencies": {
        "d3-dispatch": "1 - 3",
        "d3-quadtree": "1 - 3",
        "d3-timer": "1 - 3"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-force-3d": {
      "version": "3.0.6",
      "resolved": "https://registry.npmjs.org/d3-force-3d/-/d3-force-3d-3.0.6.tgz",
      "integrity": "sha512-4tsKHUPLOVkyfEffZo1v6sFHvGFwAIIjt/W8IThbp08DYAsXZck+2pSHEG5W1+gQgEvFLdZkYvmJAbRM2EzMnA==",
      "license": "MIT",
      "dependencies": {
        "d3-binarytree": "1",
        "d3-dispatch": "1 - 3",
        "d3-octree": "1",
        "d3-quadtree": "1 - 3",
        "d3-timer": "1 - 3"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-format": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/d3-format/-/d3-format-3.1.2.tgz",
      "integrity": "sha512-AJDdYOdnyRDV5b6ArilzCPPwc1ejkHcoyFarqlPqT7zRYjhavcT3uSrqcMvsgh2CgoPbK3RCwyHaVyxYcP2Arg==",
      "license": "ISC",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-interpolate": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/d3-interpolate/-/d3-interpolate-3.0.1.tgz",
      "integrity": "sha512-3bYs1rOD33uo8aqJfKP3JWPAibgw8Zm2+L9vBKEHJ2Rg+viTR7o5Mmv5mZcieN+FRYaAOWX5SJATX6k1PWz72g==",
      "license": "ISC",
      "dependencies": {
        "d3-color": "1 - 3"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-octree": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/d3-octree/-/d3-octree-1.1.0.tgz",
      "integrity": "sha512-F8gPlqpP+HwRPMO/8uOu5wjH110+6q4cgJvgJT6vlpy3BEaDIKlTZrgHKZSp/i1InRpVfh4puY/kvL6MxK930A==",
      "license": "MIT"
    },
    "node_modules/d3-quadtree": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/d3-quadtree/-/d3-quadtree-3.0.1.tgz",
      "integrity": "sha512-04xDrxQTDTCFwP5H6hRhsRcb9xxv2RzkcsygFzmkSIOJy3PeRJP7sNk3VRIbKXcog561P9oU0/rVH6vDROAgUw==",
      "license": "ISC",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-scale": {
      "version": "4.0.2",
      "resolved": "https://registry.npmjs.org/d3-scale/-/d3-scale-4.0.2.tgz",
      "integrity": "sha512-GZW464g1SH7ag3Y7hXjf8RoUuAFIqklOAq3MRl4OaWabTFJY9PN/E1YklhXLh+OQ3fM9yS2nOkCoS+WLZ6kvxQ==",
      "license": "ISC",
      "dependencies": {
        "d3-array": "2.10.0 - 3",
        "d3-format": "1 - 3",
        "d3-interpolate": "1.2.0 - 3",
        "d3-time": "2.1.1 - 3",
        "d3-time-format": "2 - 4"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-scale-chromatic": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/d3-scale-chromatic/-/d3-scale-chromatic-3.1.0.tgz",
      "integrity": "sha512-A3s5PWiZ9YCXFye1o246KoscMWqf8BsD9eRiJ3He7C9OBaxKhAd5TFCdEx/7VbKtxxTsu//1mMJFrEt572cEyQ==",
      "license": "ISC",
      "dependencies": {
        "d3-color": "1 - 3",
        "d3-interpolate": "1 - 3"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-selection": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/d3-selection/-/d3-selection-3.0.0.tgz",
      "integrity": "sha512-fmTRWbNMmsmWq6xJV8D19U/gw/bwrHfNXxrIN+HfZgnzqTHp9jOmKMhsTUjXOJnZOdZY9Q28y4yebKzqDKlxlQ==",
      "license": "ISC",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-time": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/d3-time/-/d3-time-3.1.0.tgz",
      "integrity": "sha512-VqKjzBLejbSMT4IgbmVgDjpkYrNWUYJnbCGo874u7MMKIWsILRX+OpX/gTk8MqjpT1A/c6HY2dCA77ZN0lkQ2Q==",
      "license": "ISC",
      "dependencies": {
        "d3-array": "2 - 3"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-time-format": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/d3-time-format/-/d3-time-format-4.1.0.tgz",
      "integrity": "sha512-dJxPBlzC7NugB2PDLwo9Q8JiTR3M3e4/XANkreKSUxF8vvXKqm1Yfq4Q5dl8budlunRVlUUaDUgFt7eA8D6NLg==",
      "license": "ISC",
      "dependencies": {
        "d3-time": "1 - 3"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-timer": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/d3-timer/-/d3-timer-3.0.1.tgz",
      "integrity": "sha512-ndfJ/JxxMd3nw31uyKoY2naivF+r29V+Lc0svZxe1JvvIRmi8hUsrMvdOwgS1o6uBHmiz91geQ0ylPP0aj1VUA==",
      "license": "ISC",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-transition": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/d3-transition/-/d3-transition-3.0.1.tgz",
      "integrity": "sha512-ApKvfjsSR6tg06xrL434C0WydLr7JewBB3V+/39RMHsaXTOG0zmt/OAXeng5M5LBm0ojmxJrpomQVZ1aPvBL4w==",
      "license": "ISC",
      "dependencies": {
        "d3-color": "1 - 3",
        "d3-dispatch": "1 - 3",
        "d3-ease": "1 - 3",
        "d3-interpolate": "1 - 3",
        "d3-timer": "1 - 3"
      },
      "engines": {
        "node": ">=12"
      },
      "peerDependencies": {
        "d3-selection": "2 - 3"
      }
    },
    "node_modules/d3-zoom": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/d3-zoom/-/d3-zoom-3.0.0.tgz",
      "integrity": "sha512-b8AmV3kfQaqWAuacbPuNbL6vahnOJflOhexLzMMNLga62+/nh0JzvJ0aO/5a5MVgUFGS7Hu1P9P03o3fJkDCyw==",
      "license": "ISC",
      "dependencies": {
        "d3-dispatch": "1 - 3",
        "d3-drag": "2 - 3",
        "d3-interpolate": "1 - 3",
        "d3-selection": "2 - 3",
        "d3-transition": "2 - 3"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/damerau-levenshtein": {
      "version": "1.0.8",
      "resolved": "https://registry.npmjs.org/damerau-levenshtein/-/damerau-levenshtein-1.0.8.tgz",
      "integrity": "sha512-sdQSFB7+llfUcQHUQO3+B8ERRj0Oa4w9POWMI/puGtuf7gFywGmkaLCElnudfTiKZV+NvHqL0ifzdrI8Ro7ESA==",
      "dev": true,
      "license": "BSD-2-Clause"
    },
    "node_modules/data-uri-to-buffer": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/data-uri-to-buffer/-/data-uri-to-buffer-4.0.1.tgz",
      "integrity": "sha512-0R9ikRb668HB7QDxT1vkpuUBtqc53YyAwMwGeUFKRojY/NWKvdZ+9UYtRfGmhqNbRkTSVpMbmyhXipFFv2cb/A==",
      "license": "MIT",
      "engines": {
        "node": ">= 12"
      }
    },
    "node_modules/data-view-buffer": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/data-view-buffer/-/data-view-buffer-1.0.2.tgz",
      "integrity": "sha512-EmKO5V3OLXh1rtK2wgXRansaK1/mtVdTUEiEI0W8RkvgT05kfxaH29PliLnpLP73yYO6142Q72QNa8Wx/A5CqQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "es-errors": "^1.3.0",
        "is-data-view": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/data-view-byte-length": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/data-view-byte-length/-/data-view-byte-length-1.0.2.tgz",
      "integrity": "sha512-tuhGbE6CfTM9+5ANGf+oQb72Ky/0+s3xKUpHvShfiz2RxMFgFPjsXuRLBVMtvMs15awe45SRb83D6wH4ew6wlQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "es-errors": "^1.3.0",
        "is-data-view": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/inspect-js"
      }
    },
    "node_modules/data-view-byte-offset": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/data-view-byte-offset/-/data-view-byte-offset-1.0.1.tgz",
      "integrity": "sha512-BS8PfmtDGnrgYdOonGZQdLZslWIeCGFP9tpan0hi1Co2Zr2NKADsvGYA8XxuG/4UWgJ6Cjtv+YJnB6MM69QGlQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "es-errors": "^1.3.0",
        "is-data-view": "^1.0.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/debug": {
      "version": "4.4.3",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.3.tgz",
      "integrity": "sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==",
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/decode-named-character-reference": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/decode-named-character-reference/-/decode-named-character-reference-1.3.0.tgz",
      "integrity": "sha512-GtpQYB283KrPp6nRw50q3U9/VfOutZOe103qlN7BPP6Ad27xYnOIWv4lPzo8HCAL+mMZofJ9KEy30fq6MfaK6Q==",
      "license": "MIT",
      "dependencies": {
        "character-entities": "^2.0.0"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/dedent": {
      "version": "1.7.2",
      "resolved": "https://registry.npmjs.org/dedent/-/dedent-1.7.2.tgz",
      "integrity": "sha512-WzMx3mW98SN+zn3hgemf4OzdmyNhhhKz5Ay0pUfQiMQ3e1g+xmTJWp/pKdwKVXhdSkAEGIIzqeuWrL3mV/AXbA==",
      "license": "MIT",
      "peerDependencies": {
        "babel-plugin-macros": "^3.1.0"
      },
      "peerDependenciesMeta": {
        "babel-plugin-macros": {
          "optional": true
        }
      }
    },
    "node_modules/deep-is": {
      "version": "0.1.4",
      "resolved": "https://registry.npmjs.org/deep-is/-/deep-is-0.1.4.tgz",
      "integrity": "sha512-oIPzksmTg4/MriiaYGO+okXDT7ztn/w3Eptv/+gSIdMdKsJo0u4CfYNFJPy+4SKMuCqGw2wxnA+URMg3t8a/bQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/deepmerge": {
      "version": "4.3.1",
      "resolved": "https://registry.npmjs.org/deepmerge/-/deepmerge-4.3.1.tgz",
      "integrity": "sha512-3sUqbMEc77XqpdNO7FRyRog+eW3ph+GYCbj+rK+uYyRMuwsVy0rMiVtPn+QJlKFvWP/1PYpapqYn0Me2knFn+A==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/default-browser": {
      "version": "5.5.0",
      "resolved": "https://registry.npmjs.org/default-browser/-/default-browser-5.5.0.tgz",
      "integrity": "sha512-H9LMLr5zwIbSxrmvikGuI/5KGhZ8E2zH3stkMgM5LpOWDutGM2JZaj460Udnf1a+946zc7YBgrqEWwbk7zHvGw==",
      "license": "MIT",
      "dependencies": {
        "bundle-name": "^4.1.0",
        "default-browser-id": "^5.0.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/default-browser-id": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/default-browser-id/-/default-browser-id-5.0.1.tgz",
      "integrity": "sha512-x1VCxdX4t+8wVfd1so/9w+vQ4vx7lKd2Qp5tDRutErwmR85OgmfX7RlLRMWafRMY7hbEiXIbudNrjOAPa/hL8Q==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/define-data-property": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/define-data-property/-/define-data-property-1.1.4.tgz",
      "integrity": "sha512-rBMvIzlpA8v6E+SJZoo++HAYqsLrkg7MSfIinMPFhmkorw7X+dOXVJQs+QT69zGkzMyfDnIMN2Wid1+NbL3T+A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-define-property": "^1.0.0",
        "es-errors": "^1.3.0",
        "gopd": "^1.0.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/define-lazy-prop": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/define-lazy-prop/-/define-lazy-prop-3.0.0.tgz",
      "integrity": "sha512-N+MeXYoqr3pOgn8xfyRPREN7gHakLYjhsHhWGT3fWAiL4IkAt0iDw14QiiEm2bE30c5XX5q0FtAA3CK5f9/BUg==",
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/define-properties": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/define-properties/-/define-properties-1.2.1.tgz",
      "integrity": "sha512-8QmQKqEASLd5nx0U1B1okLElbUuuttJ/AnYmRXbbbGDWh6uS208EjD4Xqq/I9wK7u0v6O08XhTWnt5XtEbR6Dg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "define-data-property": "^1.0.1",
        "has-property-descriptors": "^1.0.0",
        "object-keys": "^1.1.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/depd": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/depd/-/depd-2.0.0.tgz",
      "integrity": "sha512-g7nH6P6dyDioJogAAGprGpCtVImJhpPk/roCzdb3fIh61/s/nPsfR6onyMwkCAR/OlC3yBC0lESvUoQEAssIrw==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/dequal": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/dequal/-/dequal-2.0.3.tgz",
      "integrity": "sha512-0je+qPKHEMohvfRTCEo3CrPG6cAzAYgmzKyxRiYSSDkS6eGJdyVJm7WaYA5ECaAD9wLB2T4EEeymA5aFVcYXCA==",
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/detect-libc": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/detect-libc/-/detect-libc-2.1.2.tgz",
      "integrity": "sha512-Btj2BOOO83o3WyH59e8MgXsxEQVcarkUOpEYrubB0urwnN10yQ364rsiByU11nZlqWYZm05i/of7io4mzihBtQ==",
      "devOptional": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/devlop": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/devlop/-/devlop-1.1.0.tgz",
      "integrity": "sha512-RWmIqhcFf1lRYBvNmr7qTNuyCt/7/ns2jbpp1+PalgE/rDQcBT0fioSMUpJ93irlUhC5hrg4cYqe6U+0ImW0rA==",
      "license": "MIT",
      "dependencies": {
        "dequal": "^2.0.0"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/diff": {
      "version": "9.0.0",
      "resolved": "https://registry.npmjs.org/diff/-/diff-9.0.0.tgz",
      "integrity": "sha512-svtcdpS8CgJyqAjEQIXdb3OjhFVVYjzGAPO8WGCmRbrml64SPw/jJD4GoE98aR7r25A0XcgrK3F02yw9R/vhQw==",
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=0.3.1"
      }
    },
    "node_modules/doctrine": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/doctrine/-/doctrine-2.1.0.tgz",
      "integrity": "sha512-35mSku4ZXK0vfCuHEDAwt55dg2jNajHZ1odvF+8SSr82EsZY4QmXfuWso8oEd8zRhVObSN18aM0CjSdoBX7zIw==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "esutils": "^2.0.2"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/dotenv": {
      "version": "17.4.2",
      "resolved": "https://registry.npmjs.org/dotenv/-/dotenv-17.4.2.tgz",
      "integrity": "sha512-nI4U3TottKAcAD9LLud4Cb7b2QztQMUEfHbvhTH09bqXTxnSie8WnjPALV/WMCrJZ6UV/qHJ6L03OqO3LcdYZw==",
      "license": "BSD-2-Clause",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://dotenvx.com"
      }
    },
    "node_modules/dunder-proto": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/dunder-proto/-/dunder-proto-1.0.1.tgz",
      "integrity": "sha512-KIN/nDJBQRcXw0MLVhZE9iQHmG68qAVIBg9CqmUYjmQIhgij9U5MFvrqkUL5FbtyyzZuOeOt0zdeRe4UY7ct+A==",
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.1",
        "es-errors": "^1.3.0",
        "gopd": "^1.2.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/eciesjs": {
      "version": "0.4.18",
      "resolved": "https://registry.npmjs.org/eciesjs/-/eciesjs-0.4.18.tgz",
      "integrity": "sha512-wG99Zcfcys9fZux7Cft8BAX/YrOJLJSZ3jyYPfhZHqN2E+Ffx+QXBDsv3gubEgPtV6dTzJMSQUwk1H98/t/0wQ==",
      "license": "MIT",
      "dependencies": {
        "@ecies/ciphers": "^0.2.5",
        "@noble/ciphers": "^1.3.0",
        "@noble/curves": "^1.9.7",
        "@noble/hashes": "^1.8.0"
      },
      "engines": {
        "bun": ">=1",
        "deno": ">=2",
        "node": ">=16"
      }
    },
    "node_modules/ee-first": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/ee-first/-/ee-first-1.1.1.tgz",
      "integrity": "sha512-WMwm9LhRUo+WUaRN+vRuETqG89IgZphVSNkdFgeb6sS/E4OrDIN7t48CAewSHXc6C8lefD8KKfr5vY61brQlow==",
      "license": "MIT"
    },
    "node_modules/electron-to-chromium": {
      "version": "1.5.348",
      "resolved": "https://registry.npmjs.org/electron-to-chromium/-/electron-to-chromium-1.5.348.tgz",
      "integrity": "sha512-QC2X59nRlycQQMc4ZXjSVBX+tSgJfgRtcrYHbIZLgOV2dCvefoQGegLR7lLXKgpPpSuVmJU19LMzGrSa2C7k3Q==",
      "license": "ISC"
    },
    "node_modules/emoji-regex": {
      "version": "9.2.2",
      "resolved": "https://registry.npmjs.org/emoji-regex/-/emoji-regex-9.2.2.tgz",
      "integrity": "sha512-L18DaJsXSUk2+42pv8mLs5jJT2hqFkFE4j21wOmgbUqsZ2hL72NsUU785g9RXgo3s0ZNgVl42TiHp3ZtOv/Vyg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/encodeurl": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/encodeurl/-/encodeurl-2.0.0.tgz",
      "integrity": "sha512-Q0n9HRi4m6JuGIV1eFlmvJB7ZEVxu93IrMyiMsGC0lrMJMWzRgx6WGquyfQgZVb31vhGgXnfmPNNXmxnOkRBrg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/enhanced-resolve": {
      "version": "5.21.0",
      "resolved": "https://registry.npmjs.org/enhanced-resolve/-/enhanced-resolve-5.21.0.tgz",
      "integrity": "sha512-otxSQPw4lkOZWkHpB3zaEQs6gWYEsmX4xQF68ElXC/TWvGxGMSGOvoNbaLXm6/cS/fSfHtsEdw90y20PCd+sCA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "graceful-fs": "^4.2.4",
        "tapable": "^2.3.3"
      },
      "engines": {
        "node": ">=10.13.0"
      }
    },
    "node_modules/env-paths": {
      "version": "2.2.1",
      "resolved": "https://registry.npmjs.org/env-paths/-/env-paths-2.2.1.tgz",
      "integrity": "sha512-+h1lkLKhZMTYjog1VEpJNG7NZJWcuc2DDk/qsqSTRRCOXiLjeQ1d1/udrUGhqMxUgAlwKNZ0cf2uqan5GLuS2A==",
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/error-ex": {
      "version": "1.3.4",
      "resolved": "https://registry.npmjs.org/error-ex/-/error-ex-1.3.4.tgz",
      "integrity": "sha512-sqQamAnR14VgCr1A618A3sGrygcpK+HEbenA/HiEAkkUwcZIIB/tgWqHFxWgOyDh4nB4JCRimh79dR5Ywc9MDQ==",
      "license": "MIT",
      "dependencies": {
        "is-arrayish": "^0.2.1"
      }
    },
    "node_modules/es-abstract": {
      "version": "1.24.2",
      "resolved": "https://registry.npmjs.org/es-abstract/-/es-abstract-1.24.2.tgz",
      "integrity": "sha512-2FpH9Q5i2RRwyEP1AylXe6nYLR5OhaJTZwmlcP0dL/+JCbgg7yyEo/sEK6HeGZRf3dFpWwThaRHVApXSkW3xeg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "array-buffer-byte-length": "^1.0.2",
        "arraybuffer.prototype.slice": "^1.0.4",
        "available-typed-arrays": "^1.0.7",
        "call-bind": "^1.0.8",
        "call-bound": "^1.0.4",
        "data-view-buffer": "^1.0.2",
        "data-view-byte-length": "^1.0.2",
        "data-view-byte-offset": "^1.0.1",
        "es-define-property": "^1.0.1",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.1.1",
        "es-set-tostringtag": "^2.1.0",
        "es-to-primitive": "^1.3.0",
        "function.prototype.name": "^1.1.8",
        "get-intrinsic": "^1.3.0",
        "get-proto": "^1.0.1",
        "get-symbol-description": "^1.1.0",
        "globalthis": "^1.0.4",
        "gopd": "^1.2.0",
        "has-property-descriptors": "^1.0.2",
        "has-proto": "^1.2.0",
        "has-symbols": "^1.1.0",
        "hasown": "^2.0.2",
        "internal-slot": "^1.1.0",
        "is-array-buffer": "^3.0.5",
        "is-callable": "^1.2.7",
        "is-data-view": "^1.0.2",
        "is-negative-zero": "^2.0.3",
        "is-regex": "^1.2.1",
        "is-set": "^2.0.3",
        "is-shared-array-buffer": "^1.0.4",
        "is-string": "^1.1.1",
        "is-typed-array": "^1.1.15",
        "is-weakref": "^1.1.1",
        "math-intrinsics": "^1.1.0",
        "object-inspect": "^1.13.4",
        "object-keys": "^1.1.1",
        "object.assign": "^4.1.7",
        "own-keys": "^1.0.1",
        "regexp.prototype.flags": "^1.5.4",
        "safe-array-concat": "^1.1.3",
        "safe-push-apply": "^1.0.0",
        "safe-regex-test": "^1.1.0",
        "set-proto": "^1.0.0",
        "stop-iteration-iterator": "^1.1.0",
        "string.prototype.trim": "^1.2.10",
        "string.prototype.trimend": "^1.0.9",
        "string.prototype.trimstart": "^1.0.8",
        "typed-array-buffer": "^1.0.3",
        "typed-array-byte-length": "^1.0.3",
        "typed-array-byte-offset": "^1.0.4",
        "typed-array-length": "^1.0.7",
        "unbox-primitive": "^1.1.0",
        "which-typed-array": "^1.1.19"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/es-define-property": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/es-define-property/-/es-define-property-1.0.1.tgz",
      "integrity": "sha512-e3nRfgfUZ4rNGL232gUgX06QNyyez04KdjFrF+LTRoOXmrOgFKDg4BCdsjW8EnT69eqdYGmRpJwiPVYNrCaW3g==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-errors": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/es-errors/-/es-errors-1.3.0.tgz",
      "integrity": "sha512-Zf5H2Kxt2xjTvbJvP2ZWLEICxA6j+hAmMzIlypy4xcBg1vKVnx89Wy0GbS+kf5cwCVFFzdCFh2XSCFNULS6csw==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-iterator-helpers": {
      "version": "1.3.2",
      "resolved": "https://registry.npmjs.org/es-iterator-helpers/-/es-iterator-helpers-1.3.2.tgz",
      "integrity": "sha512-HVLACW1TppGYjJ8H6/jqH/pqOtKRw6wMlrB23xfExmFWxFquAIWCmwoLsOyN96K4a5KbmOf5At9ZUO3GZbetAw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.9",
        "call-bound": "^1.0.4",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.24.2",
        "es-errors": "^1.3.0",
        "es-set-tostringtag": "^2.1.0",
        "function-bind": "^1.1.2",
        "get-intrinsic": "^1.3.0",
        "globalthis": "^1.0.4",
        "gopd": "^1.2.0",
        "has-property-descriptors": "^1.0.2",
        "has-proto": "^1.2.0",
        "has-symbols": "^1.1.0",
        "internal-slot": "^1.1.0",
        "iterator.prototype": "^1.1.5",
        "math-intrinsics": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-object-atoms": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/es-object-atoms/-/es-object-atoms-1.1.1.tgz",
      "integrity": "sha512-FGgH2h8zKNim9ljj7dankFPcICIK9Cp5bm+c2gQSYePhpaG5+esrLODihIorn+Pe6FGJzWhXQotPv73jTaldXA==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-set-tostringtag": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/es-set-tostringtag/-/es-set-tostringtag-2.1.0.tgz",
      "integrity": "sha512-j6vWzfrGVfyXxge+O0x5sh6cvxAog0a/4Rdd2K36zCMV5eJ+/+tOAngRO8cODMNWbVRdVlmGZQL2YS3yR8bIUA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.6",
        "has-tostringtag": "^1.0.2",
        "hasown": "^2.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-shim-unscopables": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/es-shim-unscopables/-/es-shim-unscopables-1.1.0.tgz",
      "integrity": "sha512-d9T8ucsEhh8Bi1woXCf+TIKDIROLG5WCkxg8geBCbvk22kzwC5G2OnXVMO6FUsvQlgUUXQ2itephWDLqDzbeCw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "hasown": "^2.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-to-primitive": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/es-to-primitive/-/es-to-primitive-1.3.0.tgz",
      "integrity": "sha512-w+5mJ3GuFL+NjVtJlvydShqE1eN3h3PbI7/5LAsYJP/2qtuMXjfL2LpHSRqo4b4eSF5K/DH1JXKUAHSB2UW50g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-callable": "^1.2.7",
        "is-date-object": "^1.0.5",
        "is-symbol": "^1.0.4"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/escalade": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/escalade/-/escalade-3.2.0.tgz",
      "integrity": "sha512-WUj2qlxaQtO4g6Pq5c29GTcWGDyd8itL8zTlipgECz3JesAiiOKotd8JU6otB3PACgG6xkJUyVhboMS+bje/jA==",
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/escape-html": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/escape-html/-/escape-html-1.0.3.tgz",
      "integrity": "sha512-NiSupZ4OeuGwr68lGIeym/ksIZMJodUGOSCZ/FSnTxcrekbvqrgdUxlJOMpijaKZVjAJrWrGs/6Jy8OMuyj9ow==",
      "license": "MIT"
    },
    "node_modules/escape-string-regexp": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/escape-string-regexp/-/escape-string-regexp-4.0.0.tgz",
      "integrity": "sha512-TtpcNJ3XAzx3Gq8sWRzJaVajRs0uVxA2YAkdb1jm2YkPz4G6egUFAyA3n5vtEIZefPk5Wa4UXbKuS5fKkJWdgA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/eslint": {
      "version": "9.39.4",
      "resolved": "https://registry.npmjs.org/eslint/-/eslint-9.39.4.tgz",
      "integrity": "sha512-XoMjdBOwe/esVgEvLmNsD3IRHkm7fbKIUGvrleloJXUZgDHig2IPWNniv+GwjyJXzuNqVjlr5+4yVUZjycJwfQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@eslint-community/eslint-utils": "^4.8.0",
        "@eslint-community/regexpp": "^4.12.1",
        "@eslint/config-array": "^0.21.2",
        "@eslint/config-helpers": "^0.4.2",
        "@eslint/core": "^0.17.0",
        "@eslint/eslintrc": "^3.3.5",
        "@eslint/js": "9.39.4",
        "@eslint/plugin-kit": "^0.4.1",
        "@humanfs/node": "^0.16.6",
        "@humanwhocodes/module-importer": "^1.0.1",
        "@humanwhocodes/retry": "^0.4.2",
        "@types/estree": "^1.0.6",
        "ajv": "^6.14.0",
        "chalk": "^4.0.0",
        "cross-spawn": "^7.0.6",
        "debug": "^4.3.2",
        "escape-string-regexp": "^4.0.0",
        "eslint-scope": "^8.4.0",
        "eslint-visitor-keys": "^4.2.1",
        "espree": "^10.4.0",
        "esquery": "^1.5.0",
        "esutils": "^2.0.2",
        "fast-deep-equal": "^3.1.3",
        "file-entry-cache": "^8.0.0",
        "find-up": "^5.0.0",
        "glob-parent": "^6.0.2",
        "ignore": "^5.2.0",
        "imurmurhash": "^0.1.4",
        "is-glob": "^4.0.0",
        "json-stable-stringify-without-jsonify": "^1.0.1",
        "lodash.merge": "^4.6.2",
        "minimatch": "^3.1.5",
        "natural-compare": "^1.4.0",
        "optionator": "^0.9.3"
      },
      "bin": {
        "eslint": "bin/eslint.js"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "url": "https://eslint.org/donate"
      },
      "peerDependencies": {
        "jiti": "*"
      },
      "peerDependenciesMeta": {
        "jiti": {
          "optional": true
        }
      }
    },
    "node_modules/eslint-config-next": {
      "version": "16.2.4",
      "resolved": "https://registry.npmjs.org/eslint-config-next/-/eslint-config-next-16.2.4.tgz",
      "integrity": "sha512-A6ekXYFj/YQxBPMl45g3e+U8zJo+X2+ZQwcz34pPKjpc/3S4roBA2Rd9xWB4FKuSxhofo1/95WjzmUY+wHrOhg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@next/eslint-plugin-next": "16.2.4",
        "eslint-import-resolver-node": "^0.3.6",
        "eslint-import-resolver-typescript": "^3.5.2",
        "eslint-plugin-import": "^2.32.0",
        "eslint-plugin-jsx-a11y": "^6.10.0",
        "eslint-plugin-react": "^7.37.0",
        "eslint-plugin-react-hooks": "^7.0.0",
        "globals": "16.4.0",
        "typescript-eslint": "^8.46.0"
      },
      "peerDependencies": {
        "eslint": ">=9.0.0",
        "typescript": ">=3.3.1"
      },
      "peerDependenciesMeta": {
        "typescript": {
          "optional": true
        }
      }
    },
    "node_modules/eslint-config-next/node_modules/globals": {
      "version": "16.4.0",
      "resolved": "https://registry.npmjs.org/globals/-/globals-16.4.0.tgz",
      "integrity": "sha512-ob/2LcVVaVGCYN+r14cnwnoDPUufjiYgSqRhiFD0Q1iI4Odora5RE8Iv1D24hAz5oMophRGkGz+yuvQmmUMnMw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/eslint-import-resolver-node": {
      "version": "0.3.10",
      "resolved": "https://registry.npmjs.org/eslint-import-resolver-node/-/eslint-import-resolver-node-0.3.10.tgz",
      "integrity": "sha512-tRrKqFyCaKict5hOd244sL6EQFNycnMQnBe+j8uqGNXYzsImGbGUU4ibtoaBmv5FLwJwcFJNeg1GeVjQfbMrDQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "debug": "^3.2.7",
        "is-core-module": "^2.16.1",
        "resolve": "^2.0.0-next.6"
      }
    },
    "node_modules/eslint-import-resolver-node/node_modules/debug": {
      "version": "3.2.7",
      "resolved": "https://registry.npmjs.org/debug/-/debug-3.2.7.tgz",
      "integrity": "sha512-CFjzYYAi4ThfiQvizrFQevTTXHtnCqWfe7x1AhgEscTz6ZbLbfoLRLPugTQyBth6f8ZERVUSyWHFD/7Wu4t1XQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.1"
      }
    },
    "node_modules/eslint-import-resolver-typescript": {
      "version": "3.10.1",
      "resolved": "https://registry.npmjs.org/eslint-import-resolver-typescript/-/eslint-import-resolver-typescript-3.10.1.tgz",
      "integrity": "sha512-A1rHYb06zjMGAxdLSkN2fXPBwuSaQ0iO5M/hdyS0Ajj1VBaRp0sPD3dn1FhME3c/JluGFbwSxyCfqdSbtQLAHQ==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "@nolyfill/is-core-module": "1.0.39",
        "debug": "^4.4.0",
        "get-tsconfig": "^4.10.0",
        "is-bun-module": "^2.0.0",
        "stable-hash": "^0.0.5",
        "tinyglobby": "^0.2.13",
        "unrs-resolver": "^1.6.2"
      },
      "engines": {
        "node": "^14.18.0 || >=16.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint-import-resolver-typescript"
      },
      "peerDependencies": {
        "eslint": "*",
        "eslint-plugin-import": "*",
        "eslint-plugin-import-x": "*"
      },
      "peerDependenciesMeta": {
        "eslint-plugin-import": {
          "optional": true
        },
        "eslint-plugin-import-x": {
          "optional": true
        }
      }
    },
    "node_modules/eslint-module-utils": {
      "version": "2.12.1",
      "resolved": "https://registry.npmjs.org/eslint-module-utils/-/eslint-module-utils-2.12.1.tgz",
      "integrity": "sha512-L8jSWTze7K2mTg0vos/RuLRS5soomksDPoJLXIslC7c8Wmut3bx7CPpJijDcBZtxQ5lrbUdM+s0OlNbz0DCDNw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "debug": "^3.2.7"
      },
      "engines": {
        "node": ">=4"
      },
      "peerDependenciesMeta": {
        "eslint": {
          "optional": true
        }
      }
    },
    "node_modules/eslint-module-utils/node_modules/debug": {
      "version": "3.2.7",
      "resolved": "https://registry.npmjs.org/debug/-/debug-3.2.7.tgz",
      "integrity": "sha512-CFjzYYAi4ThfiQvizrFQevTTXHtnCqWfe7x1AhgEscTz6ZbLbfoLRLPugTQyBth6f8ZERVUSyWHFD/7Wu4t1XQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.1"
      }
    },
    "node_modules/eslint-plugin-import": {
      "version": "2.32.0",
      "resolved": "https://registry.npmjs.org/eslint-plugin-import/-/eslint-plugin-import-2.32.0.tgz",
      "integrity": "sha512-whOE1HFo/qJDyX4SnXzP4N6zOWn79WhnCUY/iDR0mPfQZO8wcYE4JClzI2oZrhBnnMUCBCHZhO6VQyoBU95mZA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@rtsao/scc": "^1.1.0",
        "array-includes": "^3.1.9",
        "array.prototype.findlastindex": "^1.2.6",
        "array.prototype.flat": "^1.3.3",
        "array.prototype.flatmap": "^1.3.3",
        "debug": "^3.2.7",
        "doctrine": "^2.1.0",
        "eslint-import-resolver-node": "^0.3.9",
        "eslint-module-utils": "^2.12.1",
        "hasown": "^2.0.2",
        "is-core-module": "^2.16.1",
        "is-glob": "^4.0.3",
        "minimatch": "^3.1.2",
        "object.fromentries": "^2.0.8",
        "object.groupby": "^1.0.3",
        "object.values": "^1.2.1",
        "semver": "^6.3.1",
        "string.prototype.trimend": "^1.0.9",
        "tsconfig-paths": "^3.15.0"
      },
      "engines": {
        "node": ">=4"
      },
      "peerDependencies": {
        "eslint": "^2 || ^3 || ^4 || ^5 || ^6 || ^7.2.0 || ^8 || ^9"
      }
    },
    "node_modules/eslint-plugin-import/node_modules/debug": {
      "version": "3.2.7",
      "resolved": "https://registry.npmjs.org/debug/-/debug-3.2.7.tgz",
      "integrity": "sha512-CFjzYYAi4ThfiQvizrFQevTTXHtnCqWfe7x1AhgEscTz6ZbLbfoLRLPugTQyBth6f8ZERVUSyWHFD/7Wu4t1XQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.1"
      }
    },
    "node_modules/eslint-plugin-jsx-a11y": {
      "version": "6.10.2",
      "resolved": "https://registry.npmjs.org/eslint-plugin-jsx-a11y/-/eslint-plugin-jsx-a11y-6.10.2.tgz",
      "integrity": "sha512-scB3nz4WmG75pV8+3eRUQOHZlNSUhFNq37xnpgRkCCELU3XMvXAxLk1eqWWyE22Ki4Q01Fnsw9BA3cJHDPgn2Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "aria-query": "^5.3.2",
        "array-includes": "^3.1.8",
        "array.prototype.flatmap": "^1.3.2",
        "ast-types-flow": "^0.0.8",
        "axe-core": "^4.10.0",
        "axobject-query": "^4.1.0",
        "damerau-levenshtein": "^1.0.8",
        "emoji-regex": "^9.2.2",
        "hasown": "^2.0.2",
        "jsx-ast-utils": "^3.3.5",
        "language-tags": "^1.0.9",
        "minimatch": "^3.1.2",
        "object.fromentries": "^2.0.8",
        "safe-regex-test": "^1.0.3",
        "string.prototype.includes": "^2.0.1"
      },
      "engines": {
        "node": ">=4.0"
      },
      "peerDependencies": {
        "eslint": "^3 || ^4 || ^5 || ^6 || ^7 || ^8 || ^9"
      }
    },
    "node_modules/eslint-plugin-react": {
      "version": "7.37.5",
      "resolved": "https://registry.npmjs.org/eslint-plugin-react/-/eslint-plugin-react-7.37.5.tgz",
      "integrity": "sha512-Qteup0SqU15kdocexFNAJMvCJEfa2xUKNV4CC1xsVMrIIqEy3SQ/rqyxCWNzfrd3/ldy6HMlD2e0JDVpDg2qIA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "array-includes": "^3.1.8",
        "array.prototype.findlast": "^1.2.5",
        "array.prototype.flatmap": "^1.3.3",
        "array.prototype.tosorted": "^1.1.4",
        "doctrine": "^2.1.0",
        "es-iterator-helpers": "^1.2.1",
        "estraverse": "^5.3.0",
        "hasown": "^2.0.2",
        "jsx-ast-utils": "^2.4.1 || ^3.0.0",
        "minimatch": "^3.1.2",
        "object.entries": "^1.1.9",
        "object.fromentries": "^2.0.8",
        "object.values": "^1.2.1",
        "prop-types": "^15.8.1",
        "resolve": "^2.0.0-next.5",
        "semver": "^6.3.1",
        "string.prototype.matchall": "^4.0.12",
        "string.prototype.repeat": "^1.0.0"
      },
      "engines": {
        "node": ">=4"
      },
      "peerDependencies": {
        "eslint": "^3 || ^4 || ^5 || ^6 || ^7 || ^8 || ^9.7"
      }
    },
    "node_modules/eslint-plugin-react-hooks": {
      "version": "7.1.1",
      "resolved": "https://registry.npmjs.org/eslint-plugin-react-hooks/-/eslint-plugin-react-hooks-7.1.1.tgz",
      "integrity": "sha512-f2I7Gw6JbvCexzIInuSbZpfdQ44D7iqdWX01FKLvrPgqxoE7oMj8clOfto8U6vYiz4yd5oKu39rRSVOe1zRu0g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/core": "^7.24.4",
        "@babel/parser": "^7.24.4",
        "hermes-parser": "^0.25.1",
        "zod": "^3.25.0 || ^4.0.0",
        "zod-validation-error": "^3.5.0 || ^4.0.0"
      },
      "engines": {
        "node": ">=18"
      },
      "peerDependencies": {
        "eslint": "^3.0.0 || ^4.0.0 || ^5.0.0 || ^6.0.0 || ^7.0.0 || ^8.0.0-0 || ^9.0.0 || ^10.0.0"
      }
    },
    "node_modules/eslint-scope": {
      "version": "8.4.0",
      "resolved": "https://registry.npmjs.org/eslint-scope/-/eslint-scope-8.4.0.tgz",
      "integrity": "sha512-sNXOfKCn74rt8RICKMvJS7XKV/Xk9kA7DyJr8mJik3S7Cwgy3qlkkmyS2uQB3jiJg6VNdZd/pDBJu0nvG2NlTg==",
      "dev": true,
      "license": "BSD-2-Clause",
      "dependencies": {
        "esrecurse": "^4.3.0",
        "estraverse": "^5.2.0"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/eslint-visitor-keys": {
      "version": "4.2.1",
      "resolved": "https://registry.npmjs.org/eslint-visitor-keys/-/eslint-visitor-keys-4.2.1.tgz",
      "integrity": "sha512-Uhdk5sfqcee/9H/rCOJikYz67o0a2Tw2hGRPOG2Y1R2dg7brRe1uG0yaNQDHu+TO/uQPF/5eCapvYSmHUjt7JQ==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/espree": {
      "version": "10.4.0",
      "resolved": "https://registry.npmjs.org/espree/-/espree-10.4.0.tgz",
      "integrity": "sha512-j6PAQ2uUr79PZhBjP5C5fhl8e39FmRnOjsD5lGnWrFU8i2G776tBK7+nP8KuQUTTyAZUwfQqXAgrVH5MbH9CYQ==",
      "dev": true,
      "license": "BSD-2-Clause",
      "dependencies": {
        "acorn": "^8.15.0",
        "acorn-jsx": "^5.3.2",
        "eslint-visitor-keys": "^4.2.1"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/esprima": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/esprima/-/esprima-4.0.1.tgz",
      "integrity": "sha512-eGuFFw7Upda+g4p+QHvnW0RyTX/SVeJBDM/gCtMARO0cLuT2HcEKnTPvhjV6aGeqrCB/sbNop0Kszm0jsaWU4A==",
      "license": "BSD-2-Clause",
      "bin": {
        "esparse": "bin/esparse.js",
        "esvalidate": "bin/esvalidate.js"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/esquery": {
      "version": "1.7.0",
      "resolved": "https://registry.npmjs.org/esquery/-/esquery-1.7.0.tgz",
      "integrity": "sha512-Ap6G0WQwcU/LHsvLwON1fAQX9Zp0A2Y6Y/cJBl9r/JbW90Zyg4/zbG6zzKa2OTALELarYHmKu0GhpM5EO+7T0g==",
      "dev": true,
      "license": "BSD-3-Clause",
      "dependencies": {
        "estraverse": "^5.1.0"
      },
      "engines": {
        "node": ">=0.10"
      }
    },
    "node_modules/esrecurse": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/esrecurse/-/esrecurse-4.3.0.tgz",
      "integrity": "sha512-KmfKL3b6G+RXvP8N1vr3Tq1kL/oCFgn2NYXEtqP8/L3pKapUA4G8cFVaoF3SU323CD4XypR/ffioHmkti6/Tag==",
      "dev": true,
      "license": "BSD-2-Clause",
      "dependencies": {
        "estraverse": "^5.2.0"
      },
      "engines": {
        "node": ">=4.0"
      }
    },
    "node_modules/estraverse": {
      "version": "5.3.0",
      "resolved": "https://registry.npmjs.org/estraverse/-/estraverse-5.3.0.tgz",
      "integrity": "sha512-MMdARuVEQziNTeJD8DgMqmhwR11BRQ/cBP+pLtYdSTnf3MIO8fFeiINEbX36ZdNlfU/7A9f3gUw49B3oQsvwBA==",
      "dev": true,
      "license": "BSD-2-Clause",
      "engines": {
        "node": ">=4.0"
      }
    },
    "node_modules/estree-util-is-identifier-name": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/estree-util-is-identifier-name/-/estree-util-is-identifier-name-3.0.0.tgz",
      "integrity": "sha512-hFtqIDZTIUZ9BXLb8y4pYGyk6+wekIivNVTcmvk8NoOh+VeRn5y6cEHzbURrWbfp1fIqdVipilzj+lfaadNZmg==",
      "license": "MIT",
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/esutils": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/esutils/-/esutils-2.0.3.tgz",
      "integrity": "sha512-kVscqXk4OCp68SZ0dkgEKVi6/8ij300KBWTJq32P/dYeWTSwK41WyTxalN1eRmA5Z9UU/LX9D7FWSmV9SAYx6g==",
      "dev": true,
      "license": "BSD-2-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/etag": {
      "version": "1.8.1",
      "resolved": "https://registry.npmjs.org/etag/-/etag-1.8.1.tgz",
      "integrity": "sha512-aIL5Fx7mawVa300al2BnEE4iNvo1qETxLrPI/o05L7z6go7fCw1J6EQmbK4FmJ2AS7kgVF/KEZWufBfdClMcPg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/eventsource": {
      "version": "3.0.7",
      "resolved": "https://registry.npmjs.org/eventsource/-/eventsource-3.0.7.tgz",
      "integrity": "sha512-CRT1WTyuQoD771GW56XEZFQ/ZoSfWid1alKGDYMmkt2yl8UXrVR4pspqWNEcqKvVIzg6PAltWjxcSSPrboA4iA==",
      "license": "MIT",
      "dependencies": {
        "eventsource-parser": "^3.0.1"
      },
      "engines": {
        "node": ">=18.0.0"
      }
    },
    "node_modules/eventsource-parser": {
      "version": "3.0.8",
      "resolved": "https://registry.npmjs.org/eventsource-parser/-/eventsource-parser-3.0.8.tgz",
      "integrity": "sha512-70QWGkr4snxr0OXLRWsFLeRBIRPuQOvt4s8QYjmUlmlkyTZkRqS7EDVRZtzU3TiyDbXSzaOeF0XUKy8PchzukQ==",
      "license": "MIT",
      "engines": {
        "node": ">=18.0.0"
      }
    },
    "node_modules/execa": {
      "version": "9.6.1",
      "resolved": "https://registry.npmjs.org/execa/-/execa-9.6.1.tgz",
      "integrity": "sha512-9Be3ZoN4LmYR90tUoVu2te2BsbzHfhJyfEiAVfz7N5/zv+jduIfLrV2xdQXOHbaD6KgpGdO9PRPM1Y4Q9QkPkA==",
      "license": "MIT",
      "dependencies": {
        "@sindresorhus/merge-streams": "^4.0.0",
        "cross-spawn": "^7.0.6",
        "figures": "^6.1.0",
        "get-stream": "^9.0.0",
        "human-signals": "^8.0.1",
        "is-plain-obj": "^4.1.0",
        "is-stream": "^4.0.1",
        "npm-run-path": "^6.0.0",
        "pretty-ms": "^9.2.0",
        "signal-exit": "^4.1.0",
        "strip-final-newline": "^4.0.0",
        "yoctocolors": "^2.1.1"
      },
      "engines": {
        "node": "^18.19.0 || >=20.5.0"
      },
      "funding": {
        "url": "https://github.com/sindresorhus/execa?sponsor=1"
      }
    },
    "node_modules/express": {
      "version": "5.2.1",
      "resolved": "https://registry.npmjs.org/express/-/express-5.2.1.tgz",
      "integrity": "sha512-hIS4idWWai69NezIdRt2xFVofaF4j+6INOpJlVOLDO8zXGpUVEVzIYk12UUi2JzjEzWL3IOAxcTubgz9Po0yXw==",
      "license": "MIT",
      "dependencies": {
        "accepts": "^2.0.0",
        "body-parser": "^2.2.1",
        "content-disposition": "^1.0.0",
        "content-type": "^1.0.5",
        "cookie": "^0.7.1",
        "cookie-signature": "^1.2.1",
        "debug": "^4.4.0",
        "depd": "^2.0.0",
        "encodeurl": "^2.0.0",
        "escape-html": "^1.0.3",
        "etag": "^1.8.1",
        "finalhandler": "^2.1.0",
        "fresh": "^2.0.0",
        "http-errors": "^2.0.0",
        "merge-descriptors": "^2.0.0",
        "mime-types": "^3.0.0",
        "on-finished": "^2.4.1",
        "once": "^1.4.0",
        "parseurl": "^1.3.3",
        "proxy-addr": "^2.0.7",
        "qs": "^6.14.0",
        "range-parser": "^1.2.1",
        "router": "^2.2.0",
        "send": "^1.1.0",
        "serve-static": "^2.2.0",
        "statuses": "^2.0.1",
        "type-is": "^2.0.1",
        "vary": "^1.1.2"
      },
      "engines": {
        "node": ">= 18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/express-rate-limit": {
      "version": "8.4.1",
      "resolved": "https://registry.npmjs.org/express-rate-limit/-/express-rate-limit-8.4.1.tgz",
      "integrity": "sha512-NGVYwQSAyEQgzxX1iCM978PP9AdO/hW93gMcF6ZwQCm+rFvLsBH6w4xcXWTcliS8La5EPRN3p9wzItqBwJrfNw==",
      "license": "MIT",
      "dependencies": {
        "ip-address": "10.1.0"
      },
      "engines": {
        "node": ">= 16"
      },
      "funding": {
        "url": "https://github.com/sponsors/express-rate-limit"
      },
      "peerDependencies": {
        "express": ">= 4.11"
      }
    },
    "node_modules/extend": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/extend/-/extend-3.0.2.tgz",
      "integrity": "sha512-fjquC59cD7CyW6urNXK0FBufkZcoiGG80wTuPujX590cB5Ttln20E2UB4S/WARVqhXffZl2LNgS+gQdPIIim/g==",
      "license": "MIT"
    },
    "node_modules/fast-deep-equal": {
      "version": "3.1.3",
      "resolved": "https://registry.npmjs.org/fast-deep-equal/-/fast-deep-equal-3.1.3.tgz",
      "integrity": "sha512-f3qQ9oQy9j2AhBe/H9VC91wLmKBCCU/gDOnKNAYG5hswO7BLKj09Hc5HYNz9cGI++xlpDCIgDaitVs03ATR84Q==",
      "license": "MIT"
    },
    "node_modules/fast-glob": {
      "version": "3.3.1",
      "resolved": "https://registry.npmjs.org/fast-glob/-/fast-glob-3.3.1.tgz",
      "integrity": "sha512-kNFPyjhh5cKjrUltxs+wFx+ZkbRaxxmZ+X0ZU31SOsxCEtP9VPgtq2teZw1DebupL5GmDaNQ6yKMMVcM41iqDg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@nodelib/fs.stat": "^2.0.2",
        "@nodelib/fs.walk": "^1.2.3",
        "glob-parent": "^5.1.2",
        "merge2": "^1.3.0",
        "micromatch": "^4.0.4"
      },
      "engines": {
        "node": ">=8.6.0"
      }
    },
    "node_modules/fast-glob/node_modules/glob-parent": {
      "version": "5.1.2",
      "resolved": "https://registry.npmjs.org/glob-parent/-/glob-parent-5.1.2.tgz",
      "integrity": "sha512-AOIgSQCepiJYwP3ARnGx+5VnTu2HBYdzbGP45eLw1vr3zB3vZLeyed1sC9hnbcOc9/SrMyM5RPQrkGz4aS9Zow==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "is-glob": "^4.0.1"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/fast-json-stable-stringify": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/fast-json-stable-stringify/-/fast-json-stable-stringify-2.1.0.tgz",
      "integrity": "sha512-lhd/wF+Lk98HZoTCtlVraHtfh5XYijIjalXck7saUtuanSDyLMxnHhSXEDJqHxD7msR8D0uCmqlkwjCV8xvwHw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/fast-levenshtein": {
      "version": "2.0.6",
      "resolved": "https://registry.npmjs.org/fast-levenshtein/-/fast-levenshtein-2.0.6.tgz",
      "integrity": "sha512-DCXu6Ifhqcks7TZKY3Hxp3y6qphY5SJZmrWMDrKcERSOXWQdMhU9Ig/PYrzyw/ul9jOIyh0N4M0tbC5hodg8dw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/fast-string-truncated-width": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/fast-string-truncated-width/-/fast-string-truncated-width-3.0.3.tgz",
      "integrity": "sha512-0jjjIEL6+0jag3l2XWWizO64/aZVtpiGE3t0Zgqxv0DPuxiMjvB3M24fCyhZUO4KomJQPj3LTSUnDP3GpdwC0g==",
      "license": "MIT"
    },
    "node_modules/fast-string-width": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/fast-string-width/-/fast-string-width-3.0.2.tgz",
      "integrity": "sha512-gX8LrtNEI5hq8DVUfRQMbr5lpaS4nMIWV+7XEbXk2b8kiQIizgnlr12B4dA3ZEx3308ze0O4Q1R+cHts8kyUJg==",
      "license": "MIT",
      "dependencies": {
        "fast-string-truncated-width": "^3.0.2"
      }
    },
    "node_modules/fast-uri": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/fast-uri/-/fast-uri-3.1.0.tgz",
      "integrity": "sha512-iPeeDKJSWf4IEOasVVrknXpaBV0IApz/gp7S2bb7Z4Lljbl2MGJRqInZiUrQwV16cpzw/D3S5j5Julj/gT52AA==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/fastify"
        },
        {
          "type": "opencollective",
          "url": "https://opencollective.com/fastify"
        }
      ],
      "license": "BSD-3-Clause"
    },
    "node_modules/fast-wrap-ansi": {
      "version": "0.2.0",
      "resolved": "https://registry.npmjs.org/fast-wrap-ansi/-/fast-wrap-ansi-0.2.0.tgz",
      "integrity": "sha512-rLV8JHxTyhVmFYhBJuMujcrHqOT2cnO5Zxj37qROj23CP39GXubJRBUFF0z8KFK77Uc0SukZUf7JZhsVEQ6n8w==",
      "license": "MIT",
      "dependencies": {
        "fast-string-width": "^3.0.2"
      }
    },
    "node_modules/fastq": {
      "version": "1.20.1",
      "resolved": "https://registry.npmjs.org/fastq/-/fastq-1.20.1.tgz",
      "integrity": "sha512-GGToxJ/w1x32s/D2EKND7kTil4n8OVk/9mycTc4VDza13lOvpUZTGX3mFSCtV9ksdGBVzvsyAVLM6mHFThxXxw==",
      "license": "ISC",
      "dependencies": {
        "reusify": "^1.0.4"
      }
    },
    "node_modules/fault": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/fault/-/fault-2.0.1.tgz",
      "integrity": "sha512-WtySTkS4OKev5JtpHXnib4Gxiurzh5NCGvWrFaZ34m6JehfTUhKZvn9njTfw48t6JumVQOmrKqpmGcdwxnhqBQ==",
      "license": "MIT",
      "dependencies": {
        "format": "^0.2.0"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/fetch-blob": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/fetch-blob/-/fetch-blob-3.2.0.tgz",
      "integrity": "sha512-7yAQpD2UMJzLi1Dqv7qFYnPbaPx7ZfFK6PiIxQ4PfkGPyNyl2Ugx+a/umUonmKqjhM4DnfbMvdX6otXq83soQQ==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/jimmywarting"
        },
        {
          "type": "paypal",
          "url": "https://paypal.me/jimmywarting"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "node-domexception": "^1.0.0",
        "web-streams-polyfill": "^3.0.3"
      },
      "engines": {
        "node": "^12.20 || >= 14.13"
      }
    },
    "node_modules/figures": {
      "version": "6.1.0",
      "resolved": "https://registry.npmjs.org/figures/-/figures-6.1.0.tgz",
      "integrity": "sha512-d+l3qxjSesT4V7v2fh+QnmFnUWv9lSpjarhShNTgBOfA0ttejbQUAlHLitbjkoRiDulW0OPoQPYIGhIC8ohejg==",
      "license": "MIT",
      "dependencies": {
        "is-unicode-supported": "^2.0.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/file-entry-cache": {
      "version": "8.0.0",
      "resolved": "https://registry.npmjs.org/file-entry-cache/-/file-entry-cache-8.0.0.tgz",
      "integrity": "sha512-XXTUwCvisa5oacNGRP9SfNtYBNAMi+RPwBFmblZEF7N7swHYQS6/Zfk7SRwx4D5j3CH211YNRco1DEMNVfZCnQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "flat-cache": "^4.0.0"
      },
      "engines": {
        "node": ">=16.0.0"
      }
    },
    "node_modules/fill-range": {
      "version": "7.1.1",
      "resolved": "https://registry.npmjs.org/fill-range/-/fill-range-7.1.1.tgz",
      "integrity": "sha512-YsGpe3WHLK8ZYi4tWDg2Jy3ebRz2rXowDxnld4bkQB00cc/1Zw9AWnC0i9ztDJitivtQvaI9KaLyKrc+hBW0yg==",
      "license": "MIT",
      "dependencies": {
        "to-regex-range": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/finalhandler": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/finalhandler/-/finalhandler-2.1.1.tgz",
      "integrity": "sha512-S8KoZgRZN+a5rNwqTxlZZePjT/4cnm0ROV70LedRHZ0p8u9fRID0hJUZQpkKLzro8LfmC8sx23bY6tVNxv8pQA==",
      "license": "MIT",
      "dependencies": {
        "debug": "^4.4.0",
        "encodeurl": "^2.0.0",
        "escape-html": "^1.0.3",
        "on-finished": "^2.4.1",
        "parseurl": "^1.3.3",
        "statuses": "^2.0.1"
      },
      "engines": {
        "node": ">= 18.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/find-up": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/find-up/-/find-up-5.0.0.tgz",
      "integrity": "sha512-78/PXT1wlLLDgTzDs7sjq9hzz0vXD+zn+7wypEe4fXQxCmdmqfGsEPQxmiCSQI3ajFV91bVSsvNtrJRiW6nGng==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "locate-path": "^6.0.0",
        "path-exists": "^4.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/flat-cache": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/flat-cache/-/flat-cache-4.0.1.tgz",
      "integrity": "sha512-f7ccFPK3SXFHpx15UIGyRJ/FJQctuKZ0zVuN3frBo4HnK3cay9VEW0R6yPYFHC0AgqhukPzKjq22t5DmAyqGyw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "flatted": "^3.2.9",
        "keyv": "^4.5.4"
      },
      "engines": {
        "node": ">=16"
      }
    },
    "node_modules/flatted": {
      "version": "3.4.2",
      "resolved": "https://registry.npmjs.org/flatted/-/flatted-3.4.2.tgz",
      "integrity": "sha512-PjDse7RzhcPkIJwy5t7KPWQSZ9cAbzQXcafsetQoD7sOJRQlGikNbx7yZp2OotDnJyrDcbyRq3Ttb18iYOqkxA==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/float-tooltip": {
      "version": "1.7.5",
      "resolved": "https://registry.npmjs.org/float-tooltip/-/float-tooltip-1.7.5.tgz",
      "integrity": "sha512-/kXzuDnnBqyyWyhDMH7+PfP8J/oXiAavGzcRxASOMRHFuReDtofizLLJsf7nnDLAfEaMW4pVWaXrAjtnglpEkg==",
      "license": "MIT",
      "dependencies": {
        "d3-selection": "2 - 3",
        "kapsule": "^1.16",
        "preact": "10"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/for-each": {
      "version": "0.3.5",
      "resolved": "https://registry.npmjs.org/for-each/-/for-each-0.3.5.tgz",
      "integrity": "sha512-dKx12eRCVIzqCxFGplyFKJMPvLEWgmNtUrpTiJIR5u97zEhRG8ySrtboPHZXx7daLxQVrl643cTzbab2tkQjxg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-callable": "^1.2.7"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/force-graph": {
      "version": "1.51.4",
      "resolved": "https://registry.npmjs.org/force-graph/-/force-graph-1.51.4.tgz",
      "integrity": "sha512-TdJ2KbkoiDQ7NIRx8IPGD0mAXXpLhamS7c+b7W98b0MHG7lphnda1VOQX/98UDTsttIAdH4TcP0l0MauSnLK8w==",
      "license": "MIT",
      "dependencies": {
        "@tweenjs/tween.js": "18 - 25",
        "accessor-fn": "1",
        "bezier-js": "3 - 6",
        "canvas-color-tracker": "^1.3",
        "d3-array": "1 - 3",
        "d3-drag": "2 - 3",
        "d3-force-3d": "2 - 3",
        "d3-scale": "1 - 4",
        "d3-scale-chromatic": "1 - 3",
        "d3-selection": "2 - 3",
        "d3-zoom": "2 - 3",
        "float-tooltip": "^1.7",
        "index-array-by": "1",
        "kapsule": "^1.16",
        "lodash-es": "4"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/format": {
      "version": "0.2.2",
      "resolved": "https://registry.npmjs.org/format/-/format-0.2.2.tgz",
      "integrity": "sha512-wzsgA6WOq+09wrU1tsJ09udeR/YZRaeArL9e1wPbFg3GG2yDnC2ldKpxs4xunpFF9DgqCqOIra3bc1HWrJ37Ww==",
      "engines": {
        "node": ">=0.4.x"
      }
    },
    "node_modules/formdata-polyfill": {
      "version": "4.0.10",
      "resolved": "https://registry.npmjs.org/formdata-polyfill/-/formdata-polyfill-4.0.10.tgz",
      "integrity": "sha512-buewHzMvYL29jdeQTVILecSaZKnt/RJWjoZCF5OW60Z67/GmSLBkOFM7qh1PI3zFNtJbaZL5eQu1vLfazOwj4g==",
      "license": "MIT",
      "dependencies": {
        "fetch-blob": "^3.1.2"
      },
      "engines": {
        "node": ">=12.20.0"
      }
    },
    "node_modules/forwarded": {
      "version": "0.2.0",
      "resolved": "https://registry.npmjs.org/forwarded/-/forwarded-0.2.0.tgz",
      "integrity": "sha512-buRG0fpBtRHSTCOASe6hD258tEubFoRLb4ZNA6NxMVHNw2gOcwHo9wyablzMzOA5z9xA9L1KNjk/Nt6MT9aYow==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/fresh": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/fresh/-/fresh-2.0.0.tgz",
      "integrity": "sha512-Rx/WycZ60HOaqLKAi6cHRKKI7zxWbJ31MhntmtwMoaTeF7XFH9hhBp8vITaMidfljRQ6eYWCKkaTK+ykVJHP2A==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/fs-extra": {
      "version": "11.3.4",
      "resolved": "https://registry.npmjs.org/fs-extra/-/fs-extra-11.3.4.tgz",
      "integrity": "sha512-CTXd6rk/M3/ULNQj8FBqBWHYBVYybQ3VPBw0xGKFe3tuH7ytT6ACnvzpIQ3UZtB8yvUKC2cXn1a+x+5EVQLovA==",
      "license": "MIT",
      "dependencies": {
        "graceful-fs": "^4.2.0",
        "jsonfile": "^6.0.1",
        "universalify": "^2.0.0"
      },
      "engines": {
        "node": ">=14.14"
      }
    },
    "node_modules/function-bind": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/function-bind/-/function-bind-1.1.2.tgz",
      "integrity": "sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/function.prototype.name": {
      "version": "1.1.8",
      "resolved": "https://registry.npmjs.org/function.prototype.name/-/function.prototype.name-1.1.8.tgz",
      "integrity": "sha512-e5iwyodOHhbMr/yNrc7fDYG4qlbIvI5gajyzPnb5TCwyhjApznQh1BMFou9b30SevY43gCJKXycoCBjMbsuW0Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "call-bound": "^1.0.3",
        "define-properties": "^1.2.1",
        "functions-have-names": "^1.2.3",
        "hasown": "^2.0.2",
        "is-callable": "^1.2.7"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/functions-have-names": {
      "version": "1.2.3",
      "resolved": "https://registry.npmjs.org/functions-have-names/-/functions-have-names-1.2.3.tgz",
      "integrity": "sha512-xckBUXyTIqT97tq2x2AMb+g163b5JFysYk0x4qxNFwbfQkmNZoiRHb6sPzI9/QV33WeuvVYBUIiD4NzNIyqaRQ==",
      "dev": true,
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/fuzzysort": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/fuzzysort/-/fuzzysort-3.1.0.tgz",
      "integrity": "sha512-sR9BNCjBg6LNgwvxlBd0sBABvQitkLzoVY9MYYROQVX/FvfJ4Mai9LsGhDgd8qYdds0bY77VzYd5iuB+v5rwQQ==",
      "license": "MIT"
    },
    "node_modules/generator-function": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/generator-function/-/generator-function-2.0.1.tgz",
      "integrity": "sha512-SFdFmIJi+ybC0vjlHN0ZGVGHc3lgE0DxPAT0djjVg+kjOnSqclqmj0KQ7ykTOLP6YxoqOvuAODGdcHJn+43q3g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/gensync": {
      "version": "1.0.0-beta.2",
      "resolved": "https://registry.npmjs.org/gensync/-/gensync-1.0.0-beta.2.tgz",
      "integrity": "sha512-3hN7NaskYvMDLQY55gnW3NQ+mesEAepTqlg+VEbj7zzqEMBVNhzcGYYeqFo/TlYz6eQiFcp1HcsCZO+nGgS8zg==",
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/get-caller-file": {
      "version": "2.0.5",
      "resolved": "https://registry.npmjs.org/get-caller-file/-/get-caller-file-2.0.5.tgz",
      "integrity": "sha512-DyFP3BM/3YHTQOCUL/w0OZHR0lpKeGrxotcHWcqNEdnltqFwXVfhEBQ94eIo34AfQpo0rGki4cyIiftY06h2Fg==",
      "license": "ISC",
      "engines": {
        "node": "6.* || 8.* || >= 10.*"
      }
    },
    "node_modules/get-east-asian-width": {
      "version": "1.5.0",
      "resolved": "https://registry.npmjs.org/get-east-asian-width/-/get-east-asian-width-1.5.0.tgz",
      "integrity": "sha512-CQ+bEO+Tva/qlmw24dCejulK5pMzVnUOFOijVogd3KQs07HnRIgp8TGipvCCRT06xeYEbpbgwaCxglFyiuIcmA==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/get-intrinsic": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/get-intrinsic/-/get-intrinsic-1.3.0.tgz",
      "integrity": "sha512-9fSjSaos/fRIVIp+xSJlE6lfwhES7LNtKaCBIamHsjr2na1BiABJPo0mOjjz8GJDURarmCPGqaiVg5mfjb98CQ==",
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.2",
        "es-define-property": "^1.0.1",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.1.1",
        "function-bind": "^1.1.2",
        "get-proto": "^1.0.1",
        "gopd": "^1.2.0",
        "has-symbols": "^1.1.0",
        "hasown": "^2.0.2",
        "math-intrinsics": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/get-own-enumerable-keys": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/get-own-enumerable-keys/-/get-own-enumerable-keys-1.0.0.tgz",
      "integrity": "sha512-PKsK2FSrQCyxcGHsGrLDcK0lx+0Ke+6e8KFFozA9/fIQLhQzPaRvJFdcz7+Axg3jUH/Mq+NI4xa5u/UT2tQskA==",
      "license": "MIT",
      "engines": {
        "node": ">=14.16"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/get-proto": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/get-proto/-/get-proto-1.0.1.tgz",
      "integrity": "sha512-sTSfBjoXBp89JvIKIefqw7U2CCebsc74kiY6awiGogKtoSGbgjYE/G/+l9sF3MWFPNc9IcoOC4ODfKHfxFmp0g==",
      "license": "MIT",
      "dependencies": {
        "dunder-proto": "^1.0.1",
        "es-object-atoms": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/get-stream": {
      "version": "9.0.1",
      "resolved": "https://registry.npmjs.org/get-stream/-/get-stream-9.0.1.tgz",
      "integrity": "sha512-kVCxPF3vQM/N0B1PmoqVUqgHP+EeVjmZSQn+1oCRPxd2P21P2F19lIgbR3HBosbB1PUhOAoctJnfEn2GbN2eZA==",
      "license": "MIT",
      "dependencies": {
        "@sec-ant/readable-stream": "^0.4.1",
        "is-stream": "^4.0.1"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/get-symbol-description": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/get-symbol-description/-/get-symbol-description-1.1.0.tgz",
      "integrity": "sha512-w9UMqWwJxHNOvoNzSJ2oPF5wvYcvP7jUvYzhp67yEhTi17ZDBBC1z9pTdGuzjD+EFIqLSYRweZjqfiPzQ06Ebg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.6"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/get-tsconfig": {
      "version": "4.14.0",
      "resolved": "https://registry.npmjs.org/get-tsconfig/-/get-tsconfig-4.14.0.tgz",
      "integrity": "sha512-yTb+8DXzDREzgvYmh6s9vHsSVCHeC0G3PI5bEXNBHtmshPnO+S5O7qgLEOn0I5QvMy6kpZN8K1NKGyilLb93wA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "resolve-pkg-maps": "^1.0.0"
      },
      "funding": {
        "url": "https://github.com/privatenumber/get-tsconfig?sponsor=1"
      }
    },
    "node_modules/glob-parent": {
      "version": "6.0.2",
      "resolved": "https://registry.npmjs.org/glob-parent/-/glob-parent-6.0.2.tgz",
      "integrity": "sha512-XxwI8EOhVQgWp6iDL+3b0r86f4d6AX6zSU55HfB4ydCEuXLXc5FcYeOu+nnGftS4TEju/11rt4KJPTMgbfmv4A==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "is-glob": "^4.0.3"
      },
      "engines": {
        "node": ">=10.13.0"
      }
    },
    "node_modules/globals": {
      "version": "14.0.0",
      "resolved": "https://registry.npmjs.org/globals/-/globals-14.0.0.tgz",
      "integrity": "sha512-oahGvuMGQlPw/ivIYBjVSrWAfWLBeku5tpPE2fOPLi+WHffIWbuh2tCjhyQhTBPMf5E9jDEH4FOmTYgYwbKwtQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/globalthis": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/globalthis/-/globalthis-1.0.4.tgz",
      "integrity": "sha512-DpLKbNU4WylpxJykQujfCcwYWiV/Jhm50Goo0wrVILAv5jOr9d+H+UR3PhSCD2rCCEIg0uc+G+muBTwD54JhDQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "define-properties": "^1.2.1",
        "gopd": "^1.0.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/gopd": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/gopd/-/gopd-1.2.0.tgz",
      "integrity": "sha512-ZUKRh6/kUFoAiTAtTYPZJ3hw9wNxx+BIBOijnlG9PnrJsCcSjs1wyyD6vJpaYtgnzDrKYRSqf3OO6Rfa93xsRg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/graceful-fs": {
      "version": "4.2.11",
      "resolved": "https://registry.npmjs.org/graceful-fs/-/graceful-fs-4.2.11.tgz",
      "integrity": "sha512-RbJ5/jmFcNNCcDV5o9eTnBLJ/HszWV0P73bc+Ff4nS/rJj+YaS6IGyiOL0VoBYX+l1Wrl3k63h/KrH+nhJ0XvQ==",
      "license": "ISC"
    },
    "node_modules/graphql": {
      "version": "16.13.2",
      "resolved": "https://registry.npmjs.org/graphql/-/graphql-16.13.2.tgz",
      "integrity": "sha512-5bJ+nf/UCpAjHM8i06fl7eLyVC9iuNAjm9qzkiu2ZGhM0VscSvS6WDPfAwkdkBuoXGM9FJSbKl6wylMwP9Ktig==",
      "license": "MIT",
      "engines": {
        "node": "^12.22.0 || ^14.16.0 || ^16.0.0 || >=17.0.0"
      }
    },
    "node_modules/has-bigints": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/has-bigints/-/has-bigints-1.1.0.tgz",
      "integrity": "sha512-R3pbpkcIqv2Pm3dUwgjclDRVmWpTJW2DcMzcIhEXEx1oh/CEMObMm3KLmRJOdvhM7o4uQBnwr8pzRK2sJWIqfg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/has-flag": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/has-flag/-/has-flag-4.0.0.tgz",
      "integrity": "sha512-EykJT/Q1KjTWctppgIAgfSO0tKVuZUjhgMr17kqTumMl6Afv3EISleU7qZUzoXDFTAHTDC4NOoG/ZxU3EvlMPQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/has-property-descriptors": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/has-property-descriptors/-/has-property-descriptors-1.0.2.tgz",
      "integrity": "sha512-55JNKuIW+vq4Ke1BjOTjM2YctQIvCT7GFzHwmfZPGo5wnrgkid0YQtnAleFSqumZm4az3n2BS+erby5ipJdgrg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-define-property": "^1.0.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/has-proto": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/has-proto/-/has-proto-1.2.0.tgz",
      "integrity": "sha512-KIL7eQPfHQRC8+XluaIw7BHUwwqL19bQn4hzNgdr+1wXoU0KKj6rufu47lhY7KbJR2C6T6+PfyN0Ea7wkSS+qQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "dunder-proto": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/has-symbols": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/has-symbols/-/has-symbols-1.1.0.tgz",
      "integrity": "sha512-1cDNdwJ2Jaohmb3sg4OmKaMBwuC48sYni5HUw2DvsC8LjGTLK9h+eb1X6RyuOHe4hT0ULCW68iomhjUoKUqlPQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/has-tostringtag": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/has-tostringtag/-/has-tostringtag-1.0.2.tgz",
      "integrity": "sha512-NqADB8VjPFLM2V0VvHUewwwsw0ZWBaIdgo+ieHtK3hasLz4qeCRjYcqfB6AQrBggRKppKF8L52/VqdVsO47Dlw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "has-symbols": "^1.0.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/hasown": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/hasown/-/hasown-2.0.3.tgz",
      "integrity": "sha512-ej4AhfhfL2Q2zpMmLo7U1Uv9+PyhIZpgQLGT1F9miIGmiCJIoCgSmczFdrc97mWT4kVY72KA+WnnhJ5pghSvSg==",
      "license": "MIT",
      "dependencies": {
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/hast-util-to-jsx-runtime": {
      "version": "2.3.6",
      "resolved": "https://registry.npmjs.org/hast-util-to-jsx-runtime/-/hast-util-to-jsx-runtime-2.3.6.tgz",
      "integrity": "sha512-zl6s8LwNyo1P9uw+XJGvZtdFF1GdAkOg8ujOw+4Pyb76874fLps4ueHXDhXWdk6YHQ6OgUtinliG7RsYvCbbBg==",
      "license": "MIT",
      "dependencies": {
        "@types/estree": "^1.0.0",
        "@types/hast": "^3.0.0",
        "@types/unist": "^3.0.0",
        "comma-separated-tokens": "^2.0.0",
        "devlop": "^1.0.0",
        "estree-util-is-identifier-name": "^3.0.0",
        "hast-util-whitespace": "^3.0.0",
        "mdast-util-mdx-expression": "^2.0.0",
        "mdast-util-mdx-jsx": "^3.0.0",
        "mdast-util-mdxjs-esm": "^2.0.0",
        "property-information": "^7.0.0",
        "space-separated-tokens": "^2.0.0",
        "style-to-js": "^1.0.0",
        "unist-util-position": "^5.0.0",
        "vfile-message": "^4.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/hast-util-whitespace": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/hast-util-whitespace/-/hast-util-whitespace-3.0.0.tgz",
      "integrity": "sha512-88JUN06ipLwsnv+dVn+OIYOvAuvBMy/Qoi6O7mQHxdPXpjy+Cd6xRkWwux7DKO+4sYILtLBRIKgsdpS2gQc7qw==",
      "license": "MIT",
      "dependencies": {
        "@types/hast": "^3.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/headers-polyfill": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/headers-polyfill/-/headers-polyfill-5.0.1.tgz",
      "integrity": "sha512-1TJ6Fih/b8h5TIcv+1+Hw0PDQWJTKDKzFZzcKOiW1wJza3XoAQlkCuXLbymPYB8+ZQyw8mHvdw560e8zVFIWyA==",
      "license": "MIT",
      "dependencies": {
        "@types/set-cookie-parser": "^2.4.10",
        "set-cookie-parser": "^3.0.1"
      }
    },
    "node_modules/hermes-estree": {
      "version": "0.25.1",
      "resolved": "https://registry.npmjs.org/hermes-estree/-/hermes-estree-0.25.1.tgz",
      "integrity": "sha512-0wUoCcLp+5Ev5pDW2OriHC2MJCbwLwuRx+gAqMTOkGKJJiBCLjtrvy4PWUGn6MIVefecRpzoOZ/UV6iGdOr+Cw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/hermes-parser": {
      "version": "0.25.1",
      "resolved": "https://registry.npmjs.org/hermes-parser/-/hermes-parser-0.25.1.tgz",
      "integrity": "sha512-6pEjquH3rqaI6cYAXYPcz9MS4rY6R4ngRgrgfDshRptUZIc3lw0MCIJIGDj9++mfySOuPTHB4nrSW99BCvOPIA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "hermes-estree": "0.25.1"
      }
    },
    "node_modules/hono": {
      "version": "4.12.16",
      "resolved": "https://registry.npmjs.org/hono/-/hono-4.12.16.tgz",
      "integrity": "sha512-jN0ZewiNAWSe5khM3EyCmBb250+b40wWbwNILNfEvq84VREWwOIkuUsFONk/3i3nqkz7Oe1PcpM2mwQEK2L9Kg==",
      "license": "MIT",
      "engines": {
        "node": ">=16.9.0"
      }
    },
    "node_modules/html-url-attributes": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/html-url-attributes/-/html-url-attributes-3.0.1.tgz",
      "integrity": "sha512-ol6UPyBWqsrO6EJySPz2O7ZSr856WDrEzM5zMqp+FJJLGMW35cLYmmZnl0vztAZxRUoNZJFTCohfjuIJ8I4QBQ==",
      "license": "MIT",
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/http-errors": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/http-errors/-/http-errors-2.0.1.tgz",
      "integrity": "sha512-4FbRdAX+bSdmo4AUFuS0WNiPz8NgFt+r8ThgNWmlrjQjt1Q7ZR9+zTlce2859x4KSXrwIsaeTqDoKQmtP8pLmQ==",
      "license": "MIT",
      "dependencies": {
        "depd": "~2.0.0",
        "inherits": "~2.0.4",
        "setprototypeof": "~1.2.0",
        "statuses": "~2.0.2",
        "toidentifier": "~1.0.1"
      },
      "engines": {
        "node": ">= 0.8"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/https-proxy-agent": {
      "version": "7.0.6",
      "resolved": "https://registry.npmjs.org/https-proxy-agent/-/https-proxy-agent-7.0.6.tgz",
      "integrity": "sha512-vK9P5/iUfdl95AI+JVyUuIcVtd4ofvtrOr3HNtM2yxC9bnMbEdp3x01OhQNnjb8IJYi38VlTE3mBXwcfvywuSw==",
      "license": "MIT",
      "dependencies": {
        "agent-base": "^7.1.2",
        "debug": "4"
      },
      "engines": {
        "node": ">= 14"
      }
    },
    "node_modules/human-signals": {
      "version": "8.0.1",
      "resolved": "https://registry.npmjs.org/human-signals/-/human-signals-8.0.1.tgz",
      "integrity": "sha512-eKCa6bwnJhvxj14kZk5NCPc6Hb6BdsU9DZcOnmQKSnO1VKrfV0zCvtttPZUsBvjmNDn8rpcJfpwSYnHBjc95MQ==",
      "license": "Apache-2.0",
      "engines": {
        "node": ">=18.18.0"
      }
    },
    "node_modules/iconv-lite": {
      "version": "0.7.2",
      "resolved": "https://registry.npmjs.org/iconv-lite/-/iconv-lite-0.7.2.tgz",
      "integrity": "sha512-im9DjEDQ55s9fL4EYzOAv0yMqmMBSZp6G0VvFyTMPKWxiSBHUj9NW/qqLmXUwXrrM7AvqSlTCfvqRb0cM8yYqw==",
      "license": "MIT",
      "dependencies": {
        "safer-buffer": ">= 2.1.2 < 3.0.0"
      },
      "engines": {
        "node": ">=0.10.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/ignore": {
      "version": "5.3.2",
      "resolved": "https://registry.npmjs.org/ignore/-/ignore-5.3.2.tgz",
      "integrity": "sha512-hsBTNUqQTDwkWtcdYI2i06Y/nUBEsNEDJKjWdigLvegy8kDuJAS8uRlpkkcQpyEXL0Z/pjDy5HBmMjRCJ2gq+g==",
      "license": "MIT",
      "engines": {
        "node": ">= 4"
      }
    },
    "node_modules/import-fresh": {
      "version": "3.3.1",
      "resolved": "https://registry.npmjs.org/import-fresh/-/import-fresh-3.3.1.tgz",
      "integrity": "sha512-TR3KfrTZTYLPB6jUjfx6MF9WcWrHL9su5TObK4ZkYgBdWKPOFoSoQIdEuTuR82pmtxH2spWG9h6etwfr1pLBqQ==",
      "license": "MIT",
      "dependencies": {
        "parent-module": "^1.0.0",
        "resolve-from": "^4.0.0"
      },
      "engines": {
        "node": ">=6"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/imurmurhash": {
      "version": "0.1.4",
      "resolved": "https://registry.npmjs.org/imurmurhash/-/imurmurhash-0.1.4.tgz",
      "integrity": "sha512-JmXMZ6wuvDmLiHEml9ykzqO6lwFbof0GG4IkcGaENdCRDDmMVnny7s5HsIgHCbaq0w2MyPhDqkhTUgS2LU2PHA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.8.19"
      }
    },
    "node_modules/index-array-by": {
      "version": "1.4.2",
      "resolved": "https://registry.npmjs.org/index-array-by/-/index-array-by-1.4.2.tgz",
      "integrity": "sha512-SP23P27OUKzXWEC/TOyWlwLviofQkCSCKONnc62eItjp69yCZZPqDQtr3Pw5gJDnPeUMqExmKydNZaJO0FU9pw==",
      "license": "MIT",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/inherits": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/inherits/-/inherits-2.0.4.tgz",
      "integrity": "sha512-k/vGaX4/Yla3WzyMCvTQOXYeIHvqOKtnqBduzTHpzpQZzAskKMhZ2K+EnBiSM9zGSoIFeMpXKxa4dYeZIQqewQ==",
      "license": "ISC"
    },
    "node_modules/inline-style-parser": {
      "version": "0.2.7",
      "resolved": "https://registry.npmjs.org/inline-style-parser/-/inline-style-parser-0.2.7.tgz",
      "integrity": "sha512-Nb2ctOyNR8DqQoR0OwRG95uNWIC0C1lCgf5Naz5H6Ji72KZ8OcFZLz2P5sNgwlyoJ8Yif11oMuYs5pBQa86csA==",
      "license": "MIT"
    },
    "node_modules/internal-slot": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/internal-slot/-/internal-slot-1.1.0.tgz",
      "integrity": "sha512-4gd7VpWNQNB4UKKCFFVcp1AVv+FMOgs9NKzjHKusc8jTMhd5eL1NqQqOpE0KzMds804/yHlglp3uxgluOqAPLw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "hasown": "^2.0.2",
        "side-channel": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/internmap": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/internmap/-/internmap-2.0.3.tgz",
      "integrity": "sha512-5Hh7Y1wQbvY5ooGgPbDaL5iYLAPzMTUrjMulskHLH6wnv/A+1q5rgEaiuqEjB+oxGXIVZs1FF+R/KPN3ZSQYYg==",
      "license": "ISC",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/ip-address": {
      "version": "10.1.0",
      "resolved": "https://registry.npmjs.org/ip-address/-/ip-address-10.1.0.tgz",
      "integrity": "sha512-XXADHxXmvT9+CRxhXg56LJovE+bmWnEWB78LB83VZTprKTmaC5QfruXocxzTZ2Kl0DNwKuBdlIhjL8LeY8Sf8Q==",
      "license": "MIT",
      "engines": {
        "node": ">= 12"
      }
    },
    "node_modules/ipaddr.js": {
      "version": "1.9.1",
      "resolved": "https://registry.npmjs.org/ipaddr.js/-/ipaddr.js-1.9.1.tgz",
      "integrity": "sha512-0KI/607xoxSToH7GjN1FfSbLoU0+btTicjsQSWQlh/hZykN8KpmMf7uYwPW3R+akZ6R/w18ZlXSHBYXiYUPO3g==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.10"
      }
    },
    "node_modules/is-alphabetical": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/is-alphabetical/-/is-alphabetical-2.0.1.tgz",
      "integrity": "sha512-FWyyY60MeTNyeSRpkM2Iry0G9hpr7/9kD40mD/cGQEuilcZYS4okz8SN2Q6rLCJ8gbCt6fN+rC+6tMGS99LaxQ==",
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/is-alphanumerical": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/is-alphanumerical/-/is-alphanumerical-2.0.1.tgz",
      "integrity": "sha512-hmbYhX/9MUMF5uh7tOXyK/n0ZvWpad5caBA17GsC6vyuCqaWliRG5K1qS9inmUhEMaOBIW7/whAnSwveW/LtZw==",
      "license": "MIT",
      "dependencies": {
        "is-alphabetical": "^2.0.0",
        "is-decimal": "^2.0.0"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/is-array-buffer": {
      "version": "3.0.5",
      "resolved": "https://registry.npmjs.org/is-array-buffer/-/is-array-buffer-3.0.5.tgz",
      "integrity": "sha512-DDfANUiiG2wC1qawP66qlTugJeL5HyzMpfr8lLK+jMQirGzNod0B12cFB/9q838Ru27sBwfw78/rdoU7RERz6A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "call-bound": "^1.0.3",
        "get-intrinsic": "^1.2.6"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-arrayish": {
      "version": "0.2.1",
      "resolved": "https://registry.npmjs.org/is-arrayish/-/is-arrayish-0.2.1.tgz",
      "integrity": "sha512-zz06S8t0ozoDXMG+ube26zeCTNXcKIPJZJi8hBrF4idCLms4CG9QtK7qBl1boi5ODzFpjswb5JPmHCbMpjaYzg==",
      "license": "MIT"
    },
    "node_modules/is-async-function": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/is-async-function/-/is-async-function-2.1.1.tgz",
      "integrity": "sha512-9dgM/cZBnNvjzaMYHVoxxfPj2QXt22Ev7SuuPrs+xav0ukGB0S6d4ydZdEiM48kLx5kDV+QBPrpVnFyefL8kkQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "async-function": "^1.0.0",
        "call-bound": "^1.0.3",
        "get-proto": "^1.0.1",
        "has-tostringtag": "^1.0.2",
        "safe-regex-test": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-bigint": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/is-bigint/-/is-bigint-1.1.0.tgz",
      "integrity": "sha512-n4ZT37wG78iz03xPRKJrHTdZbe3IicyucEtdRsV5yglwc3GyUfbAfpSeD0FJ41NbUNSt5wbhqfp1fS+BgnvDFQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "has-bigints": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-boolean-object": {
      "version": "1.2.2",
      "resolved": "https://registry.npmjs.org/is-boolean-object/-/is-boolean-object-1.2.2.tgz",
      "integrity": "sha512-wa56o2/ElJMYqjCjGkXri7it5FbebW5usLw/nPmCMs5DeZ7eziSYZhSmPRn0txqeW4LnAmQQU7FgqLpsEFKM4A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "has-tostringtag": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-bun-module": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/is-bun-module/-/is-bun-module-2.0.0.tgz",
      "integrity": "sha512-gNCGbnnnnFAUGKeZ9PdbyeGYJqewpmc2aKHUEMO5nQPWU9lOmv7jcmQIv+qHD8fXW6W7qfuCwX4rY9LNRjXrkQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "semver": "^7.7.1"
      }
    },
    "node_modules/is-bun-module/node_modules/semver": {
      "version": "7.7.4",
      "resolved": "https://registry.npmjs.org/semver/-/semver-7.7.4.tgz",
      "integrity": "sha512-vFKC2IEtQnVhpT78h1Yp8wzwrf8CM+MzKMHGJZfBtzhZNycRFnXsHk6E5TxIkkMsgNS7mdX3AGB7x2QM2di4lA==",
      "dev": true,
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/is-callable": {
      "version": "1.2.7",
      "resolved": "https://registry.npmjs.org/is-callable/-/is-callable-1.2.7.tgz",
      "integrity": "sha512-1BC0BVFhS/p0qtw6enp8e+8OD0UrK0oFLztSjNzhcKA3WDuJxxAPXzPuPtKkjEY9UUoEWlX/8fgKeu2S8i9JTA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-core-module": {
      "version": "2.16.1",
      "resolved": "https://registry.npmjs.org/is-core-module/-/is-core-module-2.16.1.tgz",
      "integrity": "sha512-UfoeMA6fIJ8wTYFEUjelnaGI67v6+N7qXJEvQuIGa99l4xsCruSYOVSQ0uPANn4dAzm8lkYPaKLrrijLq7x23w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "hasown": "^2.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-data-view": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/is-data-view/-/is-data-view-1.0.2.tgz",
      "integrity": "sha512-RKtWF8pGmS87i2D6gqQu/l7EYRlVdfzemCJN/P3UOs//x1QE7mfhvzHIApBTRf7axvT6DMGwSwBXYCT0nfB9xw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "get-intrinsic": "^1.2.6",
        "is-typed-array": "^1.1.13"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-date-object": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/is-date-object/-/is-date-object-1.1.0.tgz",
      "integrity": "sha512-PwwhEakHVKTdRNVOw+/Gyh0+MzlCl4R6qKvkhuvLtPMggI1WAHt9sOwZxQLSGpUaDnrdyDsomoRgNnCfKNSXXg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "has-tostringtag": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-decimal": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/is-decimal/-/is-decimal-2.0.1.tgz",
      "integrity": "sha512-AAB9hiomQs5DXWcRB1rqsxGUstbRroFOPPVAomNk/3XHR5JyEZChOyTWe2oayKnsSsr/kcGqF+z6yuH6HHpN0A==",
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/is-docker": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/is-docker/-/is-docker-3.0.0.tgz",
      "integrity": "sha512-eljcgEDlEns/7AXFosB5K/2nCM4P7FQPkGc/DWLy5rmFEWvZayGrik1d9/QIY5nJ4f9YsVvBkA6kJpHn9rISdQ==",
      "license": "MIT",
      "bin": {
        "is-docker": "cli.js"
      },
      "engines": {
        "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/is-extglob": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/is-extglob/-/is-extglob-2.1.1.tgz",
      "integrity": "sha512-SbKbANkN603Vi4jEZv49LeVJMn4yGwsbzZworEoyEiutsN3nJYdbO36zfhGJ6QEDpOZIFkDtnq5JRxmvl3jsoQ==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-finalizationregistry": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/is-finalizationregistry/-/is-finalizationregistry-1.1.1.tgz",
      "integrity": "sha512-1pC6N8qWJbWoPtEjgcL2xyhQOP491EQjeUo3qTKcmV8YSDDJrOepfG8pcC7h/QgnQHYSv0mJ3Z/ZWxmatVrysg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-fullwidth-code-point": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/is-fullwidth-code-point/-/is-fullwidth-code-point-3.0.0.tgz",
      "integrity": "sha512-zymm5+u+sCsSWyD9qNaejV3DFvhCKclKdizYaJUuHA83RLjb7nSuGnddCHGv0hk+KY7BMAlsWeK4Ueg6EV6XQg==",
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/is-generator-function": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/is-generator-function/-/is-generator-function-1.1.2.tgz",
      "integrity": "sha512-upqt1SkGkODW9tsGNG5mtXTXtECizwtS2kA161M+gJPc1xdb/Ax629af6YrTwcOeQHbewrPNlE5Dx7kzvXTizA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.4",
        "generator-function": "^2.0.0",
        "get-proto": "^1.0.1",
        "has-tostringtag": "^1.0.2",
        "safe-regex-test": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-glob": {
      "version": "4.0.3",
      "resolved": "https://registry.npmjs.org/is-glob/-/is-glob-4.0.3.tgz",
      "integrity": "sha512-xelSayHH36ZgE7ZWhli7pW34hNbNl8Ojv5KVmkJD4hBdD3th8Tfk9vYasLM+mXWOZhFkgZfxhLSnrwRr4elSSg==",
      "license": "MIT",
      "dependencies": {
        "is-extglob": "^2.1.1"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-hexadecimal": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/is-hexadecimal/-/is-hexadecimal-2.0.1.tgz",
      "integrity": "sha512-DgZQp241c8oO6cA1SbTEWiXeoxV42vlcJxgH+B3hi1AiqqKruZR3ZGF8In3fj4+/y/7rHvlOZLZtgJ/4ttYGZg==",
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/is-in-ssh": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/is-in-ssh/-/is-in-ssh-1.0.0.tgz",
      "integrity": "sha512-jYa6Q9rH90kR1vKB6NM7qqd1mge3Fx4Dhw5TVlK1MUBqhEOuCagrEHMevNuCcbECmXZ0ThXkRm+Ymr51HwEPAw==",
      "license": "MIT",
      "engines": {
        "node": ">=20"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/is-inside-container": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/is-inside-container/-/is-inside-container-1.0.0.tgz",
      "integrity": "sha512-KIYLCCJghfHZxqjYBE7rEy0OBuTd5xCHS7tHVgvCLkx7StIoaxwNW3hCALgEUjFfeRk+MG/Qxmp/vtETEF3tRA==",
      "license": "MIT",
      "dependencies": {
        "is-docker": "^3.0.0"
      },
      "bin": {
        "is-inside-container": "cli.js"
      },
      "engines": {
        "node": ">=14.16"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/is-interactive": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/is-interactive/-/is-interactive-2.0.0.tgz",
      "integrity": "sha512-qP1vozQRI+BMOPcjFzrjXuQvdak2pHNUMZoeG2eRbiSqyvbEf/wQtEOTOX1guk6E3t36RkaqiSt8A/6YElNxLQ==",
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/is-map": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/is-map/-/is-map-2.0.3.tgz",
      "integrity": "sha512-1Qed0/Hr2m+YqxnM09CjA2d/i6YZNfF6R2oRAOj36eUdS6qIV/huPJNSEpKbupewFs+ZsJlxsjjPbc0/afW6Lw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-negative-zero": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/is-negative-zero/-/is-negative-zero-2.0.3.tgz",
      "integrity": "sha512-5KoIu2Ngpyek75jXodFvnafB6DJgr3u8uuK0LEZJjrU19DrMD3EVERaR8sjz8CCGgpZvxPl9SuE1GMVPFHx1mw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-node-process": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/is-node-process/-/is-node-process-1.2.0.tgz",
      "integrity": "sha512-Vg4o6/fqPxIjtxgUH5QLJhwZ7gW5diGCVlXpuUfELC62CuxM1iHcRe51f2W1FDy04Ai4KJkagKjx3XaqyfRKXw==",
      "license": "MIT"
    },
    "node_modules/is-number": {
      "version": "7.0.0",
      "resolved": "https://registry.npmjs.org/is-number/-/is-number-7.0.0.tgz",
      "integrity": "sha512-41Cifkg6e8TylSpdtTpeLVMqvSBEVzTttHvERD741+pnZ8ANv0004MRL43QKPDlK9cGvNp6NZWZUBlbGXYxxng==",
      "license": "MIT",
      "engines": {
        "node": ">=0.12.0"
      }
    },
    "node_modules/is-number-object": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/is-number-object/-/is-number-object-1.1.1.tgz",
      "integrity": "sha512-lZhclumE1G6VYD8VHe35wFaIif+CTy5SJIi5+3y4psDgWu4wPDoBhF8NxUOinEc7pHgiTsT6MaBb92rKhhD+Xw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "has-tostringtag": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-obj": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/is-obj/-/is-obj-3.0.0.tgz",
      "integrity": "sha512-IlsXEHOjtKhpN8r/tRFj2nDyTmHvcfNeu/nrRIcXE17ROeatXchkojffa1SpdqW4cr/Fj6QkEf/Gn4zf6KKvEQ==",
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/is-plain-obj": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/is-plain-obj/-/is-plain-obj-4.1.0.tgz",
      "integrity": "sha512-+Pgi+vMuUNkJyExiMBt5IlFoMyKnr5zhJ4Uspz58WOhBF5QoIZkFyNHIbBAtHwzVAgk5RtndVNsDRN61/mmDqg==",
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/is-promise": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/is-promise/-/is-promise-4.0.0.tgz",
      "integrity": "sha512-hvpoI6korhJMnej285dSg6nu1+e6uxs7zG3BYAm5byqDsgJNWwxzM6z6iZiAgQR4TJ30JmBTOwqZUw3WlyH3AQ==",
      "license": "MIT"
    },
    "node_modules/is-regex": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/is-regex/-/is-regex-1.2.1.tgz",
      "integrity": "sha512-MjYsKHO5O7mCsmRGxWcLWheFqN9DJ/2TmngvjKXihe6efViPqc274+Fx/4fYj/r03+ESvBdTXK0V6tA3rgez1g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "gopd": "^1.2.0",
        "has-tostringtag": "^1.0.2",
        "hasown": "^2.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-regexp": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/is-regexp/-/is-regexp-3.1.0.tgz",
      "integrity": "sha512-rbku49cWloU5bSMI+zaRaXdQHXnthP6DZ/vLnfdSKyL4zUzuWnomtOEiZZOd+ioQ+avFo/qau3KPTc7Fjy1uPA==",
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/is-set": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/is-set/-/is-set-2.0.3.tgz",
      "integrity": "sha512-iPAjerrse27/ygGLxw+EBR9agv9Y6uLeYVJMu+QNCoouJ1/1ri0mGrcWpfCqFZuzzx3WjtwxG098X+n4OuRkPg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-shared-array-buffer": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/is-shared-array-buffer/-/is-shared-array-buffer-1.0.4.tgz",
      "integrity": "sha512-ISWac8drv4ZGfwKl5slpHG9OwPNty4jOWPRIhBpxOoD+hqITiwuipOQ2bNthAzwA3B4fIjO4Nln74N0S9byq8A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-stream": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/is-stream/-/is-stream-4.0.1.tgz",
      "integrity": "sha512-Dnz92NInDqYckGEUJv689RbRiTSEHCQ7wOVeALbkOz999YpqT46yMRIGtSNl2iCL1waAZSx40+h59NV/EwzV/A==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/is-string": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/is-string/-/is-string-1.1.1.tgz",
      "integrity": "sha512-BtEeSsoaQjlSPBemMQIrY1MY0uM6vnS1g5fmufYOtnxLGUZM2178PKbhsk7Ffv58IX+ZtcvoGwccYsh0PglkAA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "has-tostringtag": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-symbol": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/is-symbol/-/is-symbol-1.1.1.tgz",
      "integrity": "sha512-9gGx6GTtCQM73BgmHQXfDmLtfjjTUDSyoxTCbp5WtoixAhfgsDirWIcVQ/IHpvI5Vgd5i/J5F7B9cN/WlVbC/w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "has-symbols": "^1.1.0",
        "safe-regex-test": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-typed-array": {
      "version": "1.1.15",
      "resolved": "https://registry.npmjs.org/is-typed-array/-/is-typed-array-1.1.15.tgz",
      "integrity": "sha512-p3EcsicXjit7SaskXHs1hA91QxgTw46Fv6EFKKGS5DRFLD8yKnohjF3hxoju94b/OcMZoQukzpPpBE9uLVKzgQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "which-typed-array": "^1.1.16"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-unicode-supported": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/is-unicode-supported/-/is-unicode-supported-2.1.0.tgz",
      "integrity": "sha512-mE00Gnza5EEB3Ds0HfMyllZzbBrmLOX3vfWoj9A9PEnTfratQ/BcaJOuMhnkhjXvb2+FkY3VuHqtAGpTPmglFQ==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/is-weakmap": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/is-weakmap/-/is-weakmap-2.0.2.tgz",
      "integrity": "sha512-K5pXYOm9wqY1RgjpL3YTkF39tni1XajUIkawTLUo9EZEVUFga5gSQJF8nNS7ZwJQ02y+1YCNYcMh+HIf1ZqE+w==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-weakref": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/is-weakref/-/is-weakref-1.1.1.tgz",
      "integrity": "sha512-6i9mGWSlqzNMEqpCp93KwRS1uUOodk2OJ6b+sq7ZPDSy2WuI5NFIxp/254TytR8ftefexkWn5xNiHUNpPOfSew==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-weakset": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/is-weakset/-/is-weakset-2.0.4.tgz",
      "integrity": "sha512-mfcwb6IzQyOKTs84CQMrOwW4gQcaTOAWJ0zzJCl2WSPDrWk/OzDaImWFH3djXhb24g4eudZfLRozAvPGw4d9hQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "get-intrinsic": "^1.2.6"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-wsl": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/is-wsl/-/is-wsl-3.1.1.tgz",
      "integrity": "sha512-e6rvdUCiQCAuumZslxRJWR/Doq4VpPR82kqclvcS0efgt430SlGIk05vdCN58+VrzgtIcfNODjozVielycD4Sw==",
      "license": "MIT",
      "dependencies": {
        "is-inside-container": "^1.0.0"
      },
      "engines": {
        "node": ">=16"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/isarray": {
      "version": "2.0.5",
      "resolved": "https://registry.npmjs.org/isarray/-/isarray-2.0.5.tgz",
      "integrity": "sha512-xHjhDr3cNBK0BzdUJSPXZntQUx/mwMS5Rw4A7lPJ90XGAO6ISP/ePDNuo0vhqOZU+UD5JoodwCAAoZQd3FeAKw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/isexe": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/isexe/-/isexe-2.0.0.tgz",
      "integrity": "sha512-RHxMLp9lnKHGHRng9QFhRCMbYAcVpn69smSGcq3f36xjgVVWThj4qqLbTLlq7Ssj8B+fIQ1EuCEGI2lKsyQeIw==",
      "license": "ISC"
    },
    "node_modules/iterator.prototype": {
      "version": "1.1.5",
      "resolved": "https://registry.npmjs.org/iterator.prototype/-/iterator.prototype-1.1.5.tgz",
      "integrity": "sha512-H0dkQoCa3b2VEeKQBOxFph+JAbcrQdE7KC0UkqwpLmv2EC4P41QXP+rqo9wYodACiG5/WM5s9oDApTU8utwj9g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "define-data-property": "^1.1.4",
        "es-object-atoms": "^1.0.0",
        "get-intrinsic": "^1.2.6",
        "get-proto": "^1.0.0",
        "has-symbols": "^1.1.0",
        "set-function-name": "^2.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/jerrypick": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/jerrypick/-/jerrypick-1.1.2.tgz",
      "integrity": "sha512-YKnxXEekXKzhpf7CLYA0A+oDP8V0OhICNCr5lv96FvSsDEmrb0GKM776JgQvHTMjr7DTTPEVv/1Ciaw0uEWzBA==",
      "license": "MIT",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/jiti": {
      "version": "2.6.1",
      "resolved": "https://registry.npmjs.org/jiti/-/jiti-2.6.1.tgz",
      "integrity": "sha512-ekilCSN1jwRvIbgeg/57YFh8qQDNbwDb9xT/qu2DAHbFFZUicIl4ygVaAvzveMhMVr3LnpSKTNnwt8PoOfmKhQ==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "jiti": "lib/jiti-cli.mjs"
      }
    },
    "node_modules/jose": {
      "version": "6.2.3",
      "resolved": "https://registry.npmjs.org/jose/-/jose-6.2.3.tgz",
      "integrity": "sha512-YYVDInQKFJfR/xa3ojUTl8c2KoTwiL1R5Wg9YCydwH0x0B9grbzlg5HC7mMjCtUJjbQ/YnGEZIhI5tCgfTb4Hw==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/panva"
      }
    },
    "node_modules/js-tokens": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/js-tokens/-/js-tokens-4.0.0.tgz",
      "integrity": "sha512-RdJUflcE3cUzKiMqQgsCu06FPu9UdIJO0beYbPhHN4k6apgJtifcoCtT9bcxOpYBtpD2kCM6Sbzg4CausW/PKQ==",
      "license": "MIT"
    },
    "node_modules/js-yaml": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/js-yaml/-/js-yaml-4.1.1.tgz",
      "integrity": "sha512-qQKT4zQxXl8lLwBtHMWwaTcGfFOZviOJet3Oy/xmGk2gZH677CJM9EvtfdSkgWcATZhj/55JZ0rmy3myCT5lsA==",
      "license": "MIT",
      "dependencies": {
        "argparse": "^2.0.1"
      },
      "bin": {
        "js-yaml": "bin/js-yaml.js"
      }
    },
    "node_modules/jsesc": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/jsesc/-/jsesc-3.1.0.tgz",
      "integrity": "sha512-/sM3dO2FOzXjKQhJuo0Q173wf2KOo8t4I8vHy6lF9poUp7bKT0/NHE8fPX23PwfhnykfqnC2xRxOnVw5XuGIaA==",
      "license": "MIT",
      "bin": {
        "jsesc": "bin/jsesc"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/json-buffer": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/json-buffer/-/json-buffer-3.0.1.tgz",
      "integrity": "sha512-4bV5BfR2mqfQTJm+V5tPPdf+ZpuhiIvTuAB5g8kcrXOZpTT/QwwVRWBywX1ozr6lEuPdbHxwaJlm9G6mI2sfSQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/json-parse-even-better-errors": {
      "version": "2.3.1",
      "resolved": "https://registry.npmjs.org/json-parse-even-better-errors/-/json-parse-even-better-errors-2.3.1.tgz",
      "integrity": "sha512-xyFwyhro/JEof6Ghe2iz2NcXoj2sloNsWr/XsERDK/oiPCfaNhl5ONfp+jQdAZRQQ0IJWNzH9zIZF7li91kh2w==",
      "license": "MIT"
    },
    "node_modules/json-schema-traverse": {
      "version": "0.4.1",
      "resolved": "https://registry.npmjs.org/json-schema-traverse/-/json-schema-traverse-0.4.1.tgz",
      "integrity": "sha512-xbbCH5dCYU5T8LcEhhuh7HJ88HXuW3qsI3Y0zOZFKfZEHcpWiHU/Jxzk629Brsab/mMiHQti9wMP+845RPe3Vg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/json-schema-typed": {
      "version": "8.0.2",
      "resolved": "https://registry.npmjs.org/json-schema-typed/-/json-schema-typed-8.0.2.tgz",
      "integrity": "sha512-fQhoXdcvc3V28x7C7BMs4P5+kNlgUURe2jmUT1T//oBRMDrqy1QPelJimwZGo7Hg9VPV3EQV5Bnq4hbFy2vetA==",
      "license": "BSD-2-Clause"
    },
    "node_modules/json-stable-stringify-without-jsonify": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/json-stable-stringify-without-jsonify/-/json-stable-stringify-without-jsonify-1.0.1.tgz",
      "integrity": "sha512-Bdboy+l7tA3OGW6FjyFHWkP5LuByj1Tk33Ljyq0axyzdk9//JSi2u3fP1QSmd1KNwq6VOKYGlAu87CisVir6Pw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/json5": {
      "version": "2.2.3",
      "resolved": "https://registry.npmjs.org/json5/-/json5-2.2.3.tgz",
      "integrity": "sha512-XmOWe7eyHYH14cLdVPoyg+GOH3rYX++KpzrylJwSW98t3Nk+U8XOl8FWKOgwtzdb8lXGf6zYwDUzeHMWfxasyg==",
      "license": "MIT",
      "bin": {
        "json5": "lib/cli.js"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/jsonfile": {
      "version": "6.2.1",
      "resolved": "https://registry.npmjs.org/jsonfile/-/jsonfile-6.2.1.tgz",
      "integrity": "sha512-zwOTdL3rFQ/lRdBnntKVOX6k5cKJwEc1HdilT71BWEu7J41gXIB2MRp+vxduPSwZJPWBxEzv4yH1wYLJGUHX4Q==",
      "license": "MIT",
      "dependencies": {
        "universalify": "^2.0.0"
      },
      "optionalDependencies": {
        "graceful-fs": "^4.1.6"
      }
    },
    "node_modules/jsx-ast-utils": {
      "version": "3.3.5",
      "resolved": "https://registry.npmjs.org/jsx-ast-utils/-/jsx-ast-utils-3.3.5.tgz",
      "integrity": "sha512-ZZow9HBI5O6EPgSJLUb8n2NKgmVWTwCvHGwFuJlMjvLFqlGG6pjirPhtdsseaLZjSibD8eegzmYpUZwoIlj2cQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "array-includes": "^3.1.6",
        "array.prototype.flat": "^1.3.1",
        "object.assign": "^4.1.4",
        "object.values": "^1.1.6"
      },
      "engines": {
        "node": ">=4.0"
      }
    },
    "node_modules/kapsule": {
      "version": "1.16.3",
      "resolved": "https://registry.npmjs.org/kapsule/-/kapsule-1.16.3.tgz",
      "integrity": "sha512-4+5mNNf4vZDSwPhKprKwz3330iisPrb08JyMgbsdFrimBCKNHecua/WBwvVg3n7vwx0C1ARjfhwIpbrbd9n5wg==",
      "license": "MIT",
      "dependencies": {
        "lodash-es": "4"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/keyv": {
      "version": "4.5.4",
      "resolved": "https://registry.npmjs.org/keyv/-/keyv-4.5.4.tgz",
      "integrity": "sha512-oxVHkHR/EJf2CNXnWxRLW6mg7JyCCUcG0DtEGmL2ctUo1PNTin1PUil+r/+4r5MpVgC/fn1kjsx7mjSujKqIpw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "json-buffer": "3.0.1"
      }
    },
    "node_modules/kleur": {
      "version": "4.1.5",
      "resolved": "https://registry.npmjs.org/kleur/-/kleur-4.1.5.tgz",
      "integrity": "sha512-o+NO+8WrRiQEE4/7nwRJhN1HWpVmJm511pBHUxPLtp0BUISzlBplORYSmTclCnJvQq2tKu/sgl3xVpkc7ZWuQQ==",
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/language-subtag-registry": {
      "version": "0.3.23",
      "resolved": "https://registry.npmjs.org/language-subtag-registry/-/language-subtag-registry-0.3.23.tgz",
      "integrity": "sha512-0K65Lea881pHotoGEa5gDlMxt3pctLi2RplBb7Ezh4rRdLEOtgi7n4EwK9lamnUCkKBqaeKRVebTq6BAxSkpXQ==",
      "dev": true,
      "license": "CC0-1.0"
    },
    "node_modules/language-tags": {
      "version": "1.0.9",
      "resolved": "https://registry.npmjs.org/language-tags/-/language-tags-1.0.9.tgz",
      "integrity": "sha512-MbjN408fEndfiQXbFQ1vnd+1NoLDsnQW41410oQBXiyXDMYH5z505juWa4KUE1LqxRC7DgOgZDbKLxHIwm27hA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "language-subtag-registry": "^0.3.20"
      },
      "engines": {
        "node": ">=0.10"
      }
    },
    "node_modules/levn": {
      "version": "0.4.1",
      "resolved": "https://registry.npmjs.org/levn/-/levn-0.4.1.tgz",
      "integrity": "sha512-+bT2uH4E5LGE7h/n3evcS/sQlJXCpIp6ym8OWJ5eV6+67Dsql/LaaT7qJBAt2rzfoa/5QBGBhxDix1dMt2kQKQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "prelude-ls": "^1.2.1",
        "type-check": "~0.4.0"
      },
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/lightningcss": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss/-/lightningcss-1.32.0.tgz",
      "integrity": "sha512-NXYBzinNrblfraPGyrbPoD19C1h9lfI/1mzgWYvXUTe414Gz/X1FD2XBZSZM7rRTrMA8JL3OtAaGifrIKhQ5yQ==",
      "dev": true,
      "license": "MPL-2.0",
      "dependencies": {
        "detect-libc": "^2.0.3"
      },
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      },
      "optionalDependencies": {
        "lightningcss-android-arm64": "1.32.0",
        "lightningcss-darwin-arm64": "1.32.0",
        "lightningcss-darwin-x64": "1.32.0",
        "lightningcss-freebsd-x64": "1.32.0",
        "lightningcss-linux-arm-gnueabihf": "1.32.0",
        "lightningcss-linux-arm64-gnu": "1.32.0",
        "lightningcss-linux-arm64-musl": "1.32.0",
        "lightningcss-linux-x64-gnu": "1.32.0",
        "lightningcss-linux-x64-musl": "1.32.0",
        "lightningcss-win32-arm64-msvc": "1.32.0",
        "lightningcss-win32-x64-msvc": "1.32.0"
      }
    },
    "node_modules/lightningcss-android-arm64": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-android-arm64/-/lightningcss-android-arm64-1.32.0.tgz",
      "integrity": "sha512-YK7/ClTt4kAK0vo6w3X+Pnm0D2cf2vPHbhOXdoNti1Ga0al1P4TBZhwjATvjNwLEBCnKvjJc2jQgHXH0NEwlAg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-darwin-arm64": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-darwin-arm64/-/lightningcss-darwin-arm64-1.32.0.tgz",
      "integrity": "sha512-RzeG9Ju5bag2Bv1/lwlVJvBE3q6TtXskdZLLCyfg5pt+HLz9BqlICO7LZM7VHNTTn/5PRhHFBSjk5lc4cmscPQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-darwin-x64": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-darwin-x64/-/lightningcss-darwin-x64-1.32.0.tgz",
      "integrity": "sha512-U+QsBp2m/s2wqpUYT/6wnlagdZbtZdndSmut/NJqlCcMLTWp5muCrID+K5UJ6jqD2BFshejCYXniPDbNh73V8w==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-freebsd-x64": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-freebsd-x64/-/lightningcss-freebsd-x64-1.32.0.tgz",
      "integrity": "sha512-JCTigedEksZk3tHTTthnMdVfGf61Fky8Ji2E4YjUTEQX14xiy/lTzXnu1vwiZe3bYe0q+SpsSH/CTeDXK6WHig==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-arm-gnueabihf": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-arm-gnueabihf/-/lightningcss-linux-arm-gnueabihf-1.32.0.tgz",
      "integrity": "sha512-x6rnnpRa2GL0zQOkt6rts3YDPzduLpWvwAF6EMhXFVZXD4tPrBkEFqzGowzCsIWsPjqSK+tyNEODUBXeeVHSkw==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-arm64-gnu": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-arm64-gnu/-/lightningcss-linux-arm64-gnu-1.32.0.tgz",
      "integrity": "sha512-0nnMyoyOLRJXfbMOilaSRcLH3Jw5z9HDNGfT/gwCPgaDjnx0i8w7vBzFLFR1f6CMLKF8gVbebmkUN3fa/kQJpQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-arm64-musl": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-arm64-musl/-/lightningcss-linux-arm64-musl-1.32.0.tgz",
      "integrity": "sha512-UpQkoenr4UJEzgVIYpI80lDFvRmPVg6oqboNHfoH4CQIfNA+HOrZ7Mo7KZP02dC6LjghPQJeBsvXhJod/wnIBg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-x64-gnu": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-x64-gnu/-/lightningcss-linux-x64-gnu-1.32.0.tgz",
      "integrity": "sha512-V7Qr52IhZmdKPVr+Vtw8o+WLsQJYCTd8loIfpDaMRWGUZfBOYEJeyJIkqGIDMZPwPx24pUMfwSxxI8phr/MbOA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-x64-musl": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-x64-musl/-/lightningcss-linux-x64-musl-1.32.0.tgz",
      "integrity": "sha512-bYcLp+Vb0awsiXg/80uCRezCYHNg1/l3mt0gzHnWV9XP1W5sKa5/TCdGWaR/zBM2PeF/HbsQv/j2URNOiVuxWg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-win32-arm64-msvc": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-win32-arm64-msvc/-/lightningcss-win32-arm64-msvc-1.32.0.tgz",
      "integrity": "sha512-8SbC8BR40pS6baCM8sbtYDSwEVQd4JlFTOlaD3gWGHfThTcABnNDBda6eTZeqbofalIJhFx0qKzgHJmcPTnGdw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-win32-x64-msvc": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-win32-x64-msvc/-/lightningcss-win32-x64-msvc-1.32.0.tgz",
      "integrity": "sha512-Amq9B/SoZYdDi1kFrojnoqPLxYhQ4Wo5XiL8EVJrVsB8ARoC1PWW6VGtT0WKCemjy8aC+louJnjS7U18x3b06Q==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lines-and-columns": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/lines-and-columns/-/lines-and-columns-1.2.4.tgz",
      "integrity": "sha512-7ylylesZQ/PV29jhEDl3Ufjo6ZX7gCqJr5F7PKrqc93v7fzSymt1BpwEU8nAUXs8qzzvqhbjhK5QZg6Mt/HkBg==",
      "license": "MIT"
    },
    "node_modules/locate-path": {
      "version": "6.0.0",
      "resolved": "https://registry.npmjs.org/locate-path/-/locate-path-6.0.0.tgz",
      "integrity": "sha512-iPZK6eYjbxRu3uB4/WZ3EsEIMJFMqAoopl3R+zuq0UjcAm/MO6KCweDgPfP3elTztoKP3KtnVHxTn2NHBSDVUw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "p-locate": "^5.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/lodash-es": {
      "version": "4.18.1",
      "resolved": "https://registry.npmjs.org/lodash-es/-/lodash-es-4.18.1.tgz",
      "integrity": "sha512-J8xewKD/Gk22OZbhpOVSwcs60zhd95ESDwezOFuA3/099925PdHJ7OFHNTGtajL3AlZkykD32HykiMo+BIBI8A==",
      "license": "MIT"
    },
    "node_modules/lodash.merge": {
      "version": "4.6.2",
      "resolved": "https://registry.npmjs.org/lodash.merge/-/lodash.merge-4.6.2.tgz",
      "integrity": "sha512-0KpjqXRVvrYyCsX1swR/XTK0va6VQkQM6MNo7PqW77ByjAhoARA8EfrP1N4+KlKj8YS0ZUCtRT/YUuhyYDujIQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/log-symbols": {
      "version": "6.0.0",
      "resolved": "https://registry.npmjs.org/log-symbols/-/log-symbols-6.0.0.tgz",
      "integrity": "sha512-i24m8rpwhmPIS4zscNzK6MSEhk0DUWa/8iYQWxhffV8jkI4Phvs3F+quL5xvS0gdQR0FyTCMMH33Y78dDTzzIw==",
      "license": "MIT",
      "dependencies": {
        "chalk": "^5.3.0",
        "is-unicode-supported": "^1.3.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/log-symbols/node_modules/chalk": {
      "version": "5.6.2",
      "resolved": "https://registry.npmjs.org/chalk/-/chalk-5.6.2.tgz",
      "integrity": "sha512-7NzBL0rN6fMUW+f7A6Io4h40qQlG+xGmtMxfbnH/K7TAtt8JQWVQK+6g0UXKMeVJoyV5EkkNsErQ8pVD3bLHbA==",
      "license": "MIT",
      "engines": {
        "node": "^12.17.0 || ^14.13 || >=16.0.0"
      },
      "funding": {
        "url": "https://github.com/chalk/chalk?sponsor=1"
      }
    },
    "node_modules/log-symbols/node_modules/is-unicode-supported": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/is-unicode-supported/-/is-unicode-supported-1.3.0.tgz",
      "integrity": "sha512-43r2mRvz+8JRIKnWJ+3j8JtjRKZ6GmjzfaE/qiBJnikNnYv/6bagRJ1kUhNk8R5EX/GkobD+r+sfxCPJsiKBLQ==",
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/longest-streak": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/longest-streak/-/longest-streak-3.1.0.tgz",
      "integrity": "sha512-9Ri+o0JYgehTaVBBDoMqIl8GXtbWg711O3srftcHhZ0dqnETqLaoIK0x17fUw9rFSlK/0NlsKe0Ahhyl5pXE2g==",
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/loose-envify": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/loose-envify/-/loose-envify-1.4.0.tgz",
      "integrity": "sha512-lyuxPGr/Wfhrlem2CL/UcnUc1zcqKAImBDzukY7Y5F/yQiNdko6+fRLevlw1HgMySw7f611UIY408EtxRSoK3Q==",
      "license": "MIT",
      "dependencies": {
        "js-tokens": "^3.0.0 || ^4.0.0"
      },
      "bin": {
        "loose-envify": "cli.js"
      }
    },
    "node_modules/lru-cache": {
      "version": "5.1.1",
      "resolved": "https://registry.npmjs.org/lru-cache/-/lru-cache-5.1.1.tgz",
      "integrity": "sha512-KpNARQA3Iwv+jTA0utUVVbrh+Jlrr1Fv0e56GGzAFOXN7dk/FviaDW8LHmK52DlcH4WP2n6gI8vN1aesBFgo9w==",
      "license": "ISC",
      "dependencies": {
        "yallist": "^3.0.2"
      }
    },
    "node_modules/lucide-react": {
      "version": "1.14.0",
      "resolved": "https://registry.npmjs.org/lucide-react/-/lucide-react-1.14.0.tgz",
      "integrity": "sha512-+1mdWcfSJVUsaTIjN9zoezmUhfXo5l0vP7ekBMPo3jcS/aIkxHnXqAPsByszMZx/Y8oQBRJxJx5xg+RH3urzxA==",
      "license": "ISC",
      "peerDependencies": {
        "react": "^16.5.1 || ^17.0.0 || ^18.0.0 || ^19.0.0"
      }
    },
    "node_modules/magic-string": {
      "version": "0.30.21",
      "resolved": "https://registry.npmjs.org/magic-string/-/magic-string-0.30.21.tgz",
      "integrity": "sha512-vd2F4YUyEXKGcLHoq+TEyCjxueSeHnFxyyjNp80yg0XV4vUhnDer/lvvlqM/arB5bXQN5K2/3oinyCRyx8T2CQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/sourcemap-codec": "^1.5.5"
      }
    },
    "node_modules/markdown-table": {
      "version": "3.0.4",
      "resolved": "https://registry.npmjs.org/markdown-table/-/markdown-table-3.0.4.tgz",
      "integrity": "sha512-wiYz4+JrLyb/DqW2hkFJxP7Vd7JuTDm77fvbM8VfEQdmSMqcImWeeRbHwZjBjIFki/VaMK2BhFi7oUUZeM5bqw==",
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/math-intrinsics": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/math-intrinsics/-/math-intrinsics-1.1.0.tgz",
      "integrity": "sha512-/IXtbwEk5HTPyEwyKX6hGkYXxM9nbj64B+ilVJnC/R6B0pH5G4V3b0pVbL7DBj4tkhBAppbQUlf6F6Xl9LHu1g==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/mdast-util-find-and-replace": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/mdast-util-find-and-replace/-/mdast-util-find-and-replace-3.0.2.tgz",
      "integrity": "sha512-Tmd1Vg/m3Xz43afeNxDIhWRtFZgM2VLyaf4vSTYwudTyeuTneoL3qtWMA5jeLyz/O1vDJmmV4QuScFCA2tBPwg==",
      "license": "MIT",
      "dependencies": {
        "@types/mdast": "^4.0.0",
        "escape-string-regexp": "^5.0.0",
        "unist-util-is": "^6.0.0",
        "unist-util-visit-parents": "^6.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/mdast-util-find-and-replace/node_modules/escape-string-regexp": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/escape-string-regexp/-/escape-string-regexp-5.0.0.tgz",
      "integrity": "sha512-/veY75JbMK4j1yjvuUxuVsiS/hr/4iHs9FTT6cgTexxdE0Ly/glccBAkloH/DofkjRbZU3bnoj38mOmhkZ0lHw==",
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/mdast-util-from-markdown": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/mdast-util-from-markdown/-/mdast-util-from-markdown-2.0.3.tgz",
      "integrity": "sha512-W4mAWTvSlKvf8L6J+VN9yLSqQ9AOAAvHuoDAmPkz4dHf553m5gVj2ejadHJhoJmcmxEnOv6Pa8XJhpxE93kb8Q==",
      "license": "MIT",
      "dependencies": {
        "@types/mdast": "^4.0.0",
        "@types/unist": "^3.0.0",
        "decode-named-character-reference": "^1.0.0",
        "devlop": "^1.0.0",
        "mdast-util-to-string": "^4.0.0",
        "micromark": "^4.0.0",
        "micromark-util-decode-numeric-character-reference": "^2.0.0",
        "micromark-util-decode-string": "^2.0.0",
        "micromark-util-normalize-identifier": "^2.0.0",
        "micromark-util-symbol": "^2.0.0",
        "micromark-util-types": "^2.0.0",
        "unist-util-stringify-position": "^4.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/mdast-util-frontmatter": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/mdast-util-frontmatter/-/mdast-util-frontmatter-2.0.1.tgz",
      "integrity": "sha512-LRqI9+wdgC25P0URIJY9vwocIzCcksduHQ9OF2joxQoyTNVduwLAFUzjoopuRJbJAReaKrNQKAZKL3uCMugWJA==",
      "license": "MIT",
      "dependencies": {
        "@types/mdast": "^4.0.0",
        "devlop": "^1.0.0",
        "escape-string-regexp": "^5.0.0",
        "mdast-util-from-markdown": "^2.0.0",
        "mdast-util-to-markdown": "^2.0.0",
        "micromark-extension-frontmatter": "^2.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/mdast-util-frontmatter/node_modules/escape-string-regexp": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/escape-string-regexp/-/escape-string-regexp-5.0.0.tgz",
      "integrity": "sha512-/veY75JbMK4j1yjvuUxuVsiS/hr/4iHs9FTT6cgTexxdE0Ly/glccBAkloH/DofkjRbZU3bnoj38mOmhkZ0lHw==",
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/mdast-util-gfm": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/mdast-util-gfm/-/mdast-util-gfm-3.1.0.tgz",
      "integrity": "sha512-0ulfdQOM3ysHhCJ1p06l0b0VKlhU0wuQs3thxZQagjcjPrlFRqY215uZGHHJan9GEAXd9MbfPjFJz+qMkVR6zQ==",
      "license": "MIT",
      "dependencies": {
        "mdast-util-from-markdown": "^2.0.0",
        "mdast-util-gfm-autolink-literal": "^2.0.0",
        "mdast-util-gfm-footnote": "^2.0.0",
        "mdast-util-gfm-strikethrough": "^2.0.0",
        "mdast-util-gfm-table": "^2.0.0",
        "mdast-util-gfm-task-list-item": "^2.0.0",
        "mdast-util-to-markdown": "^2.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/mdast-util-gfm-autolink-literal": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/mdast-util-gfm-autolink-literal/-/mdast-util-gfm-autolink-literal-2.0.1.tgz",
      "integrity": "sha512-5HVP2MKaP6L+G6YaxPNjuL0BPrq9orG3TsrZ9YXbA3vDw/ACI4MEsnoDpn6ZNm7GnZgtAcONJyPhOP8tNJQavQ==",
      "license": "MIT",
      "dependencies": {
        "@types/mdast": "^4.0.0",
        "ccount": "^2.0.0",
        "devlop": "^1.0.0",
        "mdast-util-find-and-replace": "^3.0.0",
        "micromark-util-character": "^2.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/mdast-util-gfm-footnote": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/mdast-util-gfm-footnote/-/mdast-util-gfm-footnote-2.1.0.tgz",
      "integrity": "sha512-sqpDWlsHn7Ac9GNZQMeUzPQSMzR6Wv0WKRNvQRg0KqHh02fpTz69Qc1QSseNX29bhz1ROIyNyxExfawVKTm1GQ==",
      "license": "MIT",
      "dependencies": {
        "@types/mdast": "^4.0.0",
        "devlop": "^1.1.0",
        "mdast-util-from-markdown": "^2.0.0",
        "mdast-util-to-markdown": "^2.0.0",
        "micromark-util-normalize-identifier": "^2.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/mdast-util-gfm-strikethrough": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/mdast-util-gfm-strikethrough/-/mdast-util-gfm-strikethrough-2.0.0.tgz",
      "integrity": "sha512-mKKb915TF+OC5ptj5bJ7WFRPdYtuHv0yTRxK2tJvi+BDqbkiG7h7u/9SI89nRAYcmap2xHQL9D+QG/6wSrTtXg==",
      "license": "MIT",
      "dependencies": {
        "@types/mdast": "^4.0.0",
        "mdast-util-from-markdown": "^2.0.0",
        "mdast-util-to-markdown": "^2.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/mdast-util-gfm-table": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/mdast-util-gfm-table/-/mdast-util-gfm-table-2.0.0.tgz",
      "integrity": "sha512-78UEvebzz/rJIxLvE7ZtDd/vIQ0RHv+3Mh5DR96p7cS7HsBhYIICDBCu8csTNWNO6tBWfqXPWekRuj2FNOGOZg==",
      "license": "MIT",
      "dependencies": {
        "@types/mdast": "^4.0.0",
        "devlop": "^1.0.0",
        "markdown-table": "^3.0.0",
        "mdast-util-from-markdown": "^2.0.0",
        "mdast-util-to-markdown": "^2.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/mdast-util-gfm-task-list-item": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/mdast-util-gfm-task-list-item/-/mdast-util-gfm-task-list-item-2.0.0.tgz",
      "integrity": "sha512-IrtvNvjxC1o06taBAVJznEnkiHxLFTzgonUdy8hzFVeDun0uTjxxrRGVaNFqkU1wJR3RBPEfsxmU6jDWPofrTQ==",
      "license": "MIT",
      "dependencies": {
        "@types/mdast": "^4.0.0",
        "devlop": "^1.0.0",
        "mdast-util-from-markdown": "^2.0.0",
        "mdast-util-to-markdown": "^2.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/mdast-util-mdx-expression": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/mdast-util-mdx-expression/-/mdast-util-mdx-expression-2.0.1.tgz",
      "integrity": "sha512-J6f+9hUp+ldTZqKRSg7Vw5V6MqjATc+3E4gf3CFNcuZNWD8XdyI6zQ8GqH7f8169MM6P7hMBRDVGnn7oHB9kXQ==",
      "license": "MIT",
      "dependencies": {
        "@types/estree-jsx": "^1.0.0",
        "@types/hast": "^3.0.0",
        "@types/mdast": "^4.0.0",
        "devlop": "^1.0.0",
        "mdast-util-from-markdown": "^2.0.0",
        "mdast-util-to-markdown": "^2.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/mdast-util-mdx-jsx": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/mdast-util-mdx-jsx/-/mdast-util-mdx-jsx-3.2.0.tgz",
      "integrity": "sha512-lj/z8v0r6ZtsN/cGNNtemmmfoLAFZnjMbNyLzBafjzikOM+glrjNHPlf6lQDOTccj9n5b0PPihEBbhneMyGs1Q==",
      "license": "MIT",
      "dependencies": {
        "@types/estree-jsx": "^1.0.0",
        "@types/hast": "^3.0.0",
        "@types/mdast": "^4.0.0",
        "@types/unist": "^3.0.0",
        "ccount": "^2.0.0",
        "devlop": "^1.1.0",
        "mdast-util-from-markdown": "^2.0.0",
        "mdast-util-to-markdown": "^2.0.0",
        "parse-entities": "^4.0.0",
        "stringify-entities": "^4.0.0",
        "unist-util-stringify-position": "^4.0.0",
        "vfile-message": "^4.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/mdast-util-mdxjs-esm": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/mdast-util-mdxjs-esm/-/mdast-util-mdxjs-esm-2.0.1.tgz",
      "integrity": "sha512-EcmOpxsZ96CvlP03NghtH1EsLtr0n9Tm4lPUJUBccV9RwUOneqSycg19n5HGzCf+10LozMRSObtVr3ee1WoHtg==",
      "license": "MIT",
      "dependencies": {
        "@types/estree-jsx": "^1.0.0",
        "@types/hast": "^3.0.0",
        "@types/mdast": "^4.0.0",
        "devlop": "^1.0.0",
        "mdast-util-from-markdown": "^2.0.0",
        "mdast-util-to-markdown": "^2.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/mdast-util-phrasing": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/mdast-util-phrasing/-/mdast-util-phrasing-4.1.0.tgz",
      "integrity": "sha512-TqICwyvJJpBwvGAMZjj4J2n0X8QWp21b9l0o7eXyVJ25YNWYbJDVIyD1bZXE6WtV6RmKJVYmQAKWa0zWOABz2w==",
      "license": "MIT",
      "dependencies": {
        "@types/mdast": "^4.0.0",
        "unist-util-is": "^6.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/mdast-util-to-hast": {
      "version": "13.2.1",
      "resolved": "https://registry.npmjs.org/mdast-util-to-hast/-/mdast-util-to-hast-13.2.1.tgz",
      "integrity": "sha512-cctsq2wp5vTsLIcaymblUriiTcZd0CwWtCbLvrOzYCDZoWyMNV8sZ7krj09FSnsiJi3WVsHLM4k6Dq/yaPyCXA==",
      "license": "MIT",
      "dependencies": {
        "@types/hast": "^3.0.0",
        "@types/mdast": "^4.0.0",
        "@ungap/structured-clone": "^1.0.0",
        "devlop": "^1.0.0",
        "micromark-util-sanitize-uri": "^2.0.0",
        "trim-lines": "^3.0.0",
        "unist-util-position": "^5.0.0",
        "unist-util-visit": "^5.0.0",
        "vfile": "^6.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/mdast-util-to-markdown": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/mdast-util-to-markdown/-/mdast-util-to-markdown-2.1.2.tgz",
      "integrity": "sha512-xj68wMTvGXVOKonmog6LwyJKrYXZPvlwabaryTjLh9LuvovB/KAH+kvi8Gjj+7rJjsFi23nkUxRQv1KqSroMqA==",
      "license": "MIT",
      "dependencies": {
        "@types/mdast": "^4.0.0",
        "@types/unist": "^3.0.0",
        "longest-streak": "^3.0.0",
        "mdast-util-phrasing": "^4.0.0",
        "mdast-util-to-string": "^4.0.0",
        "micromark-util-classify-character": "^2.0.0",
        "micromark-util-decode-string": "^2.0.0",
        "unist-util-visit": "^5.0.0",
        "zwitch": "^2.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/mdast-util-to-string": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/mdast-util-to-string/-/mdast-util-to-string-4.0.0.tgz",
      "integrity": "sha512-0H44vDimn51F0YwvxSJSm0eCDOJTRlmN0R1yBh4HLj9wiV1Dn0QoXGbvFAWj2hSItVTlCmBF1hqKlIyUBVFLPg==",
      "license": "MIT",
      "dependencies": {
        "@types/mdast": "^4.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/media-typer": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/media-typer/-/media-typer-1.1.0.tgz",
      "integrity": "sha512-aisnrDP4GNe06UcKFnV5bfMNPBUw4jsLGaWwWfnH3v02GnBuXX2MCVn5RbrWo0j3pczUilYblq7fQ7Nw2t5XKw==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/merge-descriptors": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/merge-descriptors/-/merge-descriptors-2.0.0.tgz",
      "integrity": "sha512-Snk314V5ayFLhp3fkUREub6WtjBfPdCPY1Ln8/8munuLuiYhsABgBVWsozAG+MWMbVEvcdcpbi9R7ww22l9Q3g==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/merge-stream": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/merge-stream/-/merge-stream-2.0.0.tgz",
      "integrity": "sha512-abv/qOcuPfk3URPfDzmZU1LKmuw8kT+0nIHvKrKgFrwifol/doWcdA4ZqsWQ8ENrFKkd67Mfpo/LovbIUsbt3w==",
      "license": "MIT"
    },
    "node_modules/merge2": {
      "version": "1.4.1",
      "resolved": "https://registry.npmjs.org/merge2/-/merge2-1.4.1.tgz",
      "integrity": "sha512-8q7VEgMJW4J8tcfVPy8g09NcQwZdbwFEqhe/WZkoIzjn/3TGDwtOCYtXGxA3O8tPzpczCCDgv+P2P5y00ZJOOg==",
      "license": "MIT",
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/micromark": {
      "version": "4.0.2",
      "resolved": "https://registry.npmjs.org/micromark/-/micromark-4.0.2.tgz",
      "integrity": "sha512-zpe98Q6kvavpCr1NPVSCMebCKfD7CA2NqZ+rykeNhONIJBpc1tFKt9hucLGwha3jNTNI8lHpctWJWoimVF4PfA==",
      "funding": [
        {
          "type": "GitHub Sponsors",
          "url": "https://github.com/sponsors/unifiedjs"
        },
        {
          "type": "OpenCollective",
          "url": "https://opencollective.com/unified"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "@types/debug": "^4.0.0",
        "debug": "^4.0.0",
        "decode-named-character-reference": "^1.0.0",
        "devlop": "^1.0.0",
        "micromark-core-commonmark": "^2.0.0",
        "micromark-factory-space": "^2.0.0",
        "micromark-util-character": "^2.0.0",
        "micromark-util-chunked": "^2.0.0",
        "micromark-util-combine-extensions": "^2.0.0",
        "micromark-util-decode-numeric-character-reference": "^2.0.0",
        "micromark-util-encode": "^2.0.0",
        "micromark-util-normalize-identifier": "^2.0.0",
        "micromark-util-resolve-all": "^2.0.0",
        "micromark-util-sanitize-uri": "^2.0.0",
        "micromark-util-subtokenize": "^2.0.0",
        "micromark-util-symbol": "^2.0.0",
        "micromark-util-types": "^2.0.0"
      }
    },
    "node_modules/micromark-core-commonmark": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/micromark-core-commonmark/-/micromark-core-commonmark-2.0.3.tgz",
      "integrity": "sha512-RDBrHEMSxVFLg6xvnXmb1Ayr2WzLAWjeSATAoxwKYJV94TeNavgoIdA0a9ytzDSVzBy2YKFK+emCPOEibLeCrg==",
      "funding": [
        {
          "type": "GitHub Sponsors",
          "url": "https://github.com/sponsors/unifiedjs"
        },
        {
          "type": "OpenCollective",
          "url": "https://opencollective.com/unified"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "decode-named-character-reference": "^1.0.0",
        "devlop": "^1.0.0",
        "micromark-factory-destination": "^2.0.0",
        "micromark-factory-label": "^2.0.0",
        "micromark-factory-space": "^2.0.0",
        "micromark-factory-title": "^2.0.0",
        "micromark-factory-whitespace": "^2.0.0",
        "micromark-util-character": "^2.0.0",
        "micromark-util-chunked": "^2.0.0",
        "micromark-util-classify-character": "^2.0.0",
        "micromark-util-html-tag-name": "^2.0.0",
        "micromark-util-normalize-identifier": "^2.0.0",
        "micromark-util-resolve-all": "^2.0.0",
        "micromark-util-subtokenize": "^2.0.0",
        "micromark-util-symbol": "^2.0.0",
        "micromark-util-types": "^2.0.0"
      }
    },
    "node_modules/micromark-extension-frontmatter": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/micromark-extension-frontmatter/-/micromark-extension-frontmatter-2.0.0.tgz",
      "integrity": "sha512-C4AkuM3dA58cgZha7zVnuVxBhDsbttIMiytjgsM2XbHAB2faRVaHRle40558FBN+DJcrLNCoqG5mlrpdU4cRtg==",
      "license": "MIT",
      "dependencies": {
        "fault": "^2.0.0",
        "micromark-util-character": "^2.0.0",
        "micromark-util-symbol": "^2.0.0",
        "micromark-util-types": "^2.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/micromark-extension-gfm": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/micromark-extension-gfm/-/micromark-extension-gfm-3.0.0.tgz",
      "integrity": "sha512-vsKArQsicm7t0z2GugkCKtZehqUm31oeGBV/KVSorWSy8ZlNAv7ytjFhvaryUiCUJYqs+NoE6AFhpQvBTM6Q4w==",
      "license": "MIT",
      "dependencies": {
        "micromark-extension-gfm-autolink-literal": "^2.0.0",
        "micromark-extension-gfm-footnote": "^2.0.0",
        "micromark-extension-gfm-strikethrough": "^2.0.0",
        "micromark-extension-gfm-table": "^2.0.0",
        "micromark-extension-gfm-tagfilter": "^2.0.0",
        "micromark-extension-gfm-task-list-item": "^2.0.0",
        "micromark-util-combine-extensions": "^2.0.0",
        "micromark-util-types": "^2.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/micromark-extension-gfm-autolink-literal": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/micromark-extension-gfm-autolink-literal/-/micromark-extension-gfm-autolink-literal-2.1.0.tgz",
      "integrity": "sha512-oOg7knzhicgQ3t4QCjCWgTmfNhvQbDDnJeVu9v81r7NltNCVmhPy1fJRX27pISafdjL+SVc4d3l48Gb6pbRypw==",
      "license": "MIT",
      "dependencies": {
        "micromark-util-character": "^2.0.0",
        "micromark-util-sanitize-uri": "^2.0.0",
        "micromark-util-symbol": "^2.0.0",
        "micromark-util-types": "^2.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/micromark-extension-gfm-footnote": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/micromark-extension-gfm-footnote/-/micromark-extension-gfm-footnote-2.1.0.tgz",
      "integrity": "sha512-/yPhxI1ntnDNsiHtzLKYnE3vf9JZ6cAisqVDauhp4CEHxlb4uoOTxOCJ+9s51bIB8U1N1FJ1RXOKTIlD5B/gqw==",
      "license": "MIT",
      "dependencies": {
        "devlop": "^1.0.0",
        "micromark-core-commonmark": "^2.0.0",
        "micromark-factory-space": "^2.0.0",
        "micromark-util-character": "^2.0.0",
        "micromark-util-normalize-identifier": "^2.0.0",
        "micromark-util-sanitize-uri": "^2.0.0",
        "micromark-util-symbol": "^2.0.0",
        "micromark-util-types": "^2.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/micromark-extension-gfm-strikethrough": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/micromark-extension-gfm-strikethrough/-/micromark-extension-gfm-strikethrough-2.1.0.tgz",
      "integrity": "sha512-ADVjpOOkjz1hhkZLlBiYA9cR2Anf8F4HqZUO6e5eDcPQd0Txw5fxLzzxnEkSkfnD0wziSGiv7sYhk/ktvbf1uw==",
      "license": "MIT",
      "dependencies": {
        "devlop": "^1.0.0",
        "micromark-util-chunked": "^2.0.0",
        "micromark-util-classify-character": "^2.0.0",
        "micromark-util-resolve-all": "^2.0.0",
        "micromark-util-symbol": "^2.0.0",
        "micromark-util-types": "^2.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/micromark-extension-gfm-table": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/micromark-extension-gfm-table/-/micromark-extension-gfm-table-2.1.1.tgz",
      "integrity": "sha512-t2OU/dXXioARrC6yWfJ4hqB7rct14e8f7m0cbI5hUmDyyIlwv5vEtooptH8INkbLzOatzKuVbQmAYcbWoyz6Dg==",
      "license": "MIT",
      "dependencies": {
        "devlop": "^1.0.0",
        "micromark-factory-space": "^2.0.0",
        "micromark-util-character": "^2.0.0",
        "micromark-util-symbol": "^2.0.0",
        "micromark-util-types": "^2.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/micromark-extension-gfm-tagfilter": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/micromark-extension-gfm-tagfilter/-/micromark-extension-gfm-tagfilter-2.0.0.tgz",
      "integrity": "sha512-xHlTOmuCSotIA8TW1mDIM6X2O1SiX5P9IuDtqGonFhEK0qgRI4yeC6vMxEV2dgyr2TiD+2PQ10o+cOhdVAcwfg==",
      "license": "MIT",
      "dependencies": {
        "micromark-util-types": "^2.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/micromark-extension-gfm-task-list-item": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/micromark-extension-gfm-task-list-item/-/micromark-extension-gfm-task-list-item-2.1.0.tgz",
      "integrity": "sha512-qIBZhqxqI6fjLDYFTBIa4eivDMnP+OZqsNwmQ3xNLE4Cxwc+zfQEfbs6tzAo2Hjq+bh6q5F+Z8/cksrLFYWQQw==",
      "license": "MIT",
      "dependencies": {
        "devlop": "^1.0.0",
        "micromark-factory-space": "^2.0.0",
        "micromark-util-character": "^2.0.0",
        "micromark-util-symbol": "^2.0.0",
        "micromark-util-types": "^2.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/micromark-factory-destination": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/micromark-factory-destination/-/micromark-factory-destination-2.0.1.tgz",
      "integrity": "sha512-Xe6rDdJlkmbFRExpTOmRj9N3MaWmbAgdpSrBQvCFqhezUn4AHqJHbaEnfbVYYiexVSs//tqOdY/DxhjdCiJnIA==",
      "funding": [
        {
          "type": "GitHub Sponsors",
          "url": "https://github.com/sponsors/unifiedjs"
        },
        {
          "type": "OpenCollective",
          "url": "https://opencollective.com/unified"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "micromark-util-character": "^2.0.0",
        "micromark-util-symbol": "^2.0.0",
        "micromark-util-types": "^2.0.0"
      }
    },
    "node_modules/micromark-factory-label": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/micromark-factory-label/-/micromark-factory-label-2.0.1.tgz",
      "integrity": "sha512-VFMekyQExqIW7xIChcXn4ok29YE3rnuyveW3wZQWWqF4Nv9Wk5rgJ99KzPvHjkmPXF93FXIbBp6YdW3t71/7Vg==",
      "funding": [
        {
          "type": "GitHub Sponsors",
          "url": "https://github.com/sponsors/unifiedjs"
        },
        {
          "type": "OpenCollective",
          "url": "https://opencollective.com/unified"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "devlop": "^1.0.0",
        "micromark-util-character": "^2.0.0",
        "micromark-util-symbol": "^2.0.0",
        "micromark-util-types": "^2.0.0"
      }
    },
    "node_modules/micromark-factory-space": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/micromark-factory-space/-/micromark-factory-space-2.0.1.tgz",
      "integrity": "sha512-zRkxjtBxxLd2Sc0d+fbnEunsTj46SWXgXciZmHq0kDYGnck/ZSGj9/wULTV95uoeYiK5hRXP2mJ98Uo4cq/LQg==",
      "funding": [
        {
          "type": "GitHub Sponsors",
          "url": "https://github.com/sponsors/unifiedjs"
        },
        {
          "type": "OpenCollective",
          "url": "https://opencollective.com/unified"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "micromark-util-character": "^2.0.0",
        "micromark-util-types": "^2.0.0"
      }
    },
    "node_modules/micromark-factory-title": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/micromark-factory-title/-/micromark-factory-title-2.0.1.tgz",
      "integrity": "sha512-5bZ+3CjhAd9eChYTHsjy6TGxpOFSKgKKJPJxr293jTbfry2KDoWkhBb6TcPVB4NmzaPhMs1Frm9AZH7OD4Cjzw==",
      "funding": [
        {
          "type": "GitHub Sponsors",
          "url": "https://github.com/sponsors/unifiedjs"
        },
        {
          "type": "OpenCollective",
          "url": "https://opencollective.com/unified"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "micromark-factory-space": "^2.0.0",
        "micromark-util-character": "^2.0.0",
        "micromark-util-symbol": "^2.0.0",
        "micromark-util-types": "^2.0.0"
      }
    },
    "node_modules/micromark-factory-whitespace": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/micromark-factory-whitespace/-/micromark-factory-whitespace-2.0.1.tgz",
      "integrity": "sha512-Ob0nuZ3PKt/n0hORHyvoD9uZhr+Za8sFoP+OnMcnWK5lngSzALgQYKMr9RJVOWLqQYuyn6ulqGWSXdwf6F80lQ==",
      "funding": [
        {
          "type": "GitHub Sponsors",
          "url": "https://github.com/sponsors/unifiedjs"
        },
        {
          "type": "OpenCollective",
          "url": "https://opencollective.com/unified"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "micromark-factory-space": "^2.0.0",
        "micromark-util-character": "^2.0.0",
        "micromark-util-symbol": "^2.0.0",
        "micromark-util-types": "^2.0.0"
      }
    },
    "node_modules/micromark-util-character": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/micromark-util-character/-/micromark-util-character-2.1.1.tgz",
      "integrity": "sha512-wv8tdUTJ3thSFFFJKtpYKOYiGP2+v96Hvk4Tu8KpCAsTMs6yi+nVmGh1syvSCsaxz45J6Jbw+9DD6g97+NV67Q==",
      "funding": [
        {
          "type": "GitHub Sponsors",
          "url": "https://github.com/sponsors/unifiedjs"
        },
        {
          "type": "OpenCollective",
          "url": "https://opencollective.com/unified"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "micromark-util-symbol": "^2.0.0",
        "micromark-util-types": "^2.0.0"
      }
    },
    "node_modules/micromark-util-chunked": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/micromark-util-chunked/-/micromark-util-chunked-2.0.1.tgz",
      "integrity": "sha512-QUNFEOPELfmvv+4xiNg2sRYeS/P84pTW0TCgP5zc9FpXetHY0ab7SxKyAQCNCc1eK0459uoLI1y5oO5Vc1dbhA==",
      "funding": [
        {
          "type": "GitHub Sponsors",
          "url": "https://github.com/sponsors/unifiedjs"
        },
        {
          "type": "OpenCollective",
          "url": "https://opencollective.com/unified"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "micromark-util-symbol": "^2.0.0"
      }
    },
    "node_modules/micromark-util-classify-character": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/micromark-util-classify-character/-/micromark-util-classify-character-2.0.1.tgz",
      "integrity": "sha512-K0kHzM6afW/MbeWYWLjoHQv1sgg2Q9EccHEDzSkxiP/EaagNzCm7T/WMKZ3rjMbvIpvBiZgwR3dKMygtA4mG1Q==",
      "funding": [
        {
          "type": "GitHub Sponsors",
          "url": "https://github.com/sponsors/unifiedjs"
        },
        {
          "type": "OpenCollective",
          "url": "https://opencollective.com/unified"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "micromark-util-character": "^2.0.0",
        "micromark-util-symbol": "^2.0.0",
        "micromark-util-types": "^2.0.0"
      }
    },
    "node_modules/micromark-util-combine-extensions": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/micromark-util-combine-extensions/-/micromark-util-combine-extensions-2.0.1.tgz",
      "integrity": "sha512-OnAnH8Ujmy59JcyZw8JSbK9cGpdVY44NKgSM7E9Eh7DiLS2E9RNQf0dONaGDzEG9yjEl5hcqeIsj4hfRkLH/Bg==",
      "funding": [
        {
          "type": "GitHub Sponsors",
          "url": "https://github.com/sponsors/unifiedjs"
        },
        {
          "type": "OpenCollective",
          "url": "https://opencollective.com/unified"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "micromark-util-chunked": "^2.0.0",
        "micromark-util-types": "^2.0.0"
      }
    },
    "node_modules/micromark-util-decode-numeric-character-reference": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/micromark-util-decode-numeric-character-reference/-/micromark-util-decode-numeric-character-reference-2.0.2.tgz",
      "integrity": "sha512-ccUbYk6CwVdkmCQMyr64dXz42EfHGkPQlBj5p7YVGzq8I7CtjXZJrubAYezf7Rp+bjPseiROqe7G6foFd+lEuw==",
      "funding": [
        {
          "type": "GitHub Sponsors",
          "url": "https://github.com/sponsors/unifiedjs"
        },
        {
          "type": "OpenCollective",
          "url": "https://opencollective.com/unified"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "micromark-util-symbol": "^2.0.0"
      }
    },
    "node_modules/micromark-util-decode-string": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/micromark-util-decode-string/-/micromark-util-decode-string-2.0.1.tgz",
      "integrity": "sha512-nDV/77Fj6eH1ynwscYTOsbK7rR//Uj0bZXBwJZRfaLEJ1iGBR6kIfNmlNqaqJf649EP0F3NWNdeJi03elllNUQ==",
      "funding": [
        {
          "type": "GitHub Sponsors",
          "url": "https://github.com/sponsors/unifiedjs"
        },
        {
          "type": "OpenCollective",
          "url": "https://opencollective.com/unified"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "decode-named-character-reference": "^1.0.0",
        "micromark-util-character": "^2.0.0",
        "micromark-util-decode-numeric-character-reference": "^2.0.0",
        "micromark-util-symbol": "^2.0.0"
      }
    },
    "node_modules/micromark-util-encode": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/micromark-util-encode/-/micromark-util-encode-2.0.1.tgz",
      "integrity": "sha512-c3cVx2y4KqUnwopcO9b/SCdo2O67LwJJ/UyqGfbigahfegL9myoEFoDYZgkT7f36T0bLrM9hZTAaAyH+PCAXjw==",
      "funding": [
        {
          "type": "GitHub Sponsors",
          "url": "https://github.com/sponsors/unifiedjs"
        },
        {
          "type": "OpenCollective",
          "url": "https://opencollective.com/unified"
        }
      ],
      "license": "MIT"
    },
    "node_modules/micromark-util-html-tag-name": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/micromark-util-html-tag-name/-/micromark-util-html-tag-name-2.0.1.tgz",
      "integrity": "sha512-2cNEiYDhCWKI+Gs9T0Tiysk136SnR13hhO8yW6BGNyhOC4qYFnwF1nKfD3HFAIXA5c45RrIG1ub11GiXeYd1xA==",
      "funding": [
        {
          "type": "GitHub Sponsors",
          "url": "https://github.com/sponsors/unifiedjs"
        },
        {
          "type": "OpenCollective",
          "url": "https://opencollective.com/unified"
        }
      ],
      "license": "MIT"
    },
    "node_modules/micromark-util-normalize-identifier": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/micromark-util-normalize-identifier/-/micromark-util-normalize-identifier-2.0.1.tgz",
      "integrity": "sha512-sxPqmo70LyARJs0w2UclACPUUEqltCkJ6PhKdMIDuJ3gSf/Q+/GIe3WKl0Ijb/GyH9lOpUkRAO2wp0GVkLvS9Q==",
      "funding": [
        {
          "type": "GitHub Sponsors",
          "url": "https://github.com/sponsors/unifiedjs"
        },
        {
          "type": "OpenCollective",
          "url": "https://opencollective.com/unified"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "micromark-util-symbol": "^2.0.0"
      }
    },
    "node_modules/micromark-util-resolve-all": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/micromark-util-resolve-all/-/micromark-util-resolve-all-2.0.1.tgz",
      "integrity": "sha512-VdQyxFWFT2/FGJgwQnJYbe1jjQoNTS4RjglmSjTUlpUMa95Htx9NHeYW4rGDJzbjvCsl9eLjMQwGeElsqmzcHg==",
      "funding": [
        {
          "type": "GitHub Sponsors",
          "url": "https://github.com/sponsors/unifiedjs"
        },
        {
          "type": "OpenCollective",
          "url": "https://opencollective.com/unified"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "micromark-util-types": "^2.0.0"
      }
    },
    "node_modules/micromark-util-sanitize-uri": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/micromark-util-sanitize-uri/-/micromark-util-sanitize-uri-2.0.1.tgz",
      "integrity": "sha512-9N9IomZ/YuGGZZmQec1MbgxtlgougxTodVwDzzEouPKo3qFWvymFHWcnDi2vzV1ff6kas9ucW+o3yzJK9YB1AQ==",
      "funding": [
        {
          "type": "GitHub Sponsors",
          "url": "https://github.com/sponsors/unifiedjs"
        },
        {
          "type": "OpenCollective",
          "url": "https://opencollective.com/unified"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "micromark-util-character": "^2.0.0",
        "micromark-util-encode": "^2.0.0",
        "micromark-util-symbol": "^2.0.0"
      }
    },
    "node_modules/micromark-util-subtokenize": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/micromark-util-subtokenize/-/micromark-util-subtokenize-2.1.0.tgz",
      "integrity": "sha512-XQLu552iSctvnEcgXw6+Sx75GflAPNED1qx7eBJ+wydBb2KCbRZe+NwvIEEMM83uml1+2WSXpBAcp9IUCgCYWA==",
      "funding": [
        {
          "type": "GitHub Sponsors",
          "url": "https://github.com/sponsors/unifiedjs"
        },
        {
          "type": "OpenCollective",
          "url": "https://opencollective.com/unified"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "devlop": "^1.0.0",
        "micromark-util-chunked": "^2.0.0",
        "micromark-util-symbol": "^2.0.0",
        "micromark-util-types": "^2.0.0"
      }
    },
    "node_modules/micromark-util-symbol": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/micromark-util-symbol/-/micromark-util-symbol-2.0.1.tgz",
      "integrity": "sha512-vs5t8Apaud9N28kgCrRUdEed4UJ+wWNvicHLPxCa9ENlYuAY31M0ETy5y1vA33YoNPDFTghEbnh6efaE8h4x0Q==",
      "funding": [
        {
          "type": "GitHub Sponsors",
          "url": "https://github.com/sponsors/unifiedjs"
        },
        {
          "type": "OpenCollective",
          "url": "https://opencollective.com/unified"
        }
      ],
      "license": "MIT"
    },
    "node_modules/micromark-util-types": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/micromark-util-types/-/micromark-util-types-2.0.2.tgz",
      "integrity": "sha512-Yw0ECSpJoViF1qTU4DC6NwtC4aWGt1EkzaQB8KPPyCRR8z9TWeV0HbEFGTO+ZY1wB22zmxnJqhPyTpOVCpeHTA==",
      "funding": [
        {
          "type": "GitHub Sponsors",
          "url": "https://github.com/sponsors/unifiedjs"
        },
        {
          "type": "OpenCollective",
          "url": "https://opencollective.com/unified"
        }
      ],
      "license": "MIT"
    },
    "node_modules/micromatch": {
      "version": "4.0.8",
      "resolved": "https://registry.npmjs.org/micromatch/-/micromatch-4.0.8.tgz",
      "integrity": "sha512-PXwfBhYu0hBCPw8Dn0E+WDYb7af3dSLVWKi3HGv84IdF4TyFoC0ysxFd0Goxw7nSv4T/PzEJQxsYsEiFCKo2BA==",
      "license": "MIT",
      "dependencies": {
        "braces": "^3.0.3",
        "picomatch": "^2.3.1"
      },
      "engines": {
        "node": ">=8.6"
      }
    },
    "node_modules/mime-db": {
      "version": "1.54.0",
      "resolved": "https://registry.npmjs.org/mime-db/-/mime-db-1.54.0.tgz",
      "integrity": "sha512-aU5EJuIN2WDemCcAp2vFBfp/m4EAhWJnUNSSw0ixs7/kXbd6Pg64EmwJkNdFhB8aWt1sH2CTXrLxo/iAGV3oPQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/mime-types": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/mime-types/-/mime-types-3.0.2.tgz",
      "integrity": "sha512-Lbgzdk0h4juoQ9fCKXW4by0UJqj+nOOrI9MJ1sSj4nI8aI2eo1qmvQEie4VD1glsS250n15LsWsYtCugiStS5A==",
      "license": "MIT",
      "dependencies": {
        "mime-db": "^1.54.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/mimic-fn": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/mimic-fn/-/mimic-fn-2.1.0.tgz",
      "integrity": "sha512-OqbOk5oEQeAZ8WXWydlu9HJjz9WVdEIvamMCcXmuqUYjTknH/sqsWvhQ3vgwKFRR1HpjvNBKQ37nbJgYzGqGcg==",
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/mimic-function": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/mimic-function/-/mimic-function-5.0.1.tgz",
      "integrity": "sha512-VP79XUPxV2CigYP3jWwAUFSku2aKqBH7uTAapFWCBqutsbmDo96KY5o8uh6U+/YSIn5OxJnXp73beVkpqMIGhA==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/minimatch": {
      "version": "3.1.5",
      "resolved": "https://registry.npmjs.org/minimatch/-/minimatch-3.1.5.tgz",
      "integrity": "sha512-VgjWUsnnT6n+NUk6eZq77zeFdpW2LWDzP6zFGrCbHXiYNul5Dzqk2HHQ5uFH2DNW5Xbp8+jVzaeNt94ssEEl4w==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "brace-expansion": "^1.1.7"
      },
      "engines": {
        "node": "*"
      }
    },
    "node_modules/minimist": {
      "version": "1.2.8",
      "resolved": "https://registry.npmjs.org/minimist/-/minimist-1.2.8.tgz",
      "integrity": "sha512-2yyAR8qBkN3YuheJanUpWC5U3bb5osDywNB8RzDVlDwDHbocAJveqqj1u8+SVD7jkWT4yvsHCpWqqWqAxb0zCA==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
      "license": "MIT"
    },
    "node_modules/msw": {
      "version": "2.14.2",
      "resolved": "https://registry.npmjs.org/msw/-/msw-2.14.2.tgz",
      "integrity": "sha512-D2bTe0tpuf9nw4DA39wFaqUD/hRPKj0DKpo2lAqu+A47Ifg4+h0hbfn6QxVOsiUY2uhgEN6TTpGSHDsc+ysYNg==",
      "hasInstallScript": true,
      "license": "MIT",
      "dependencies": {
        "@inquirer/confirm": "^6.0.11",
        "@mswjs/interceptors": "^0.41.3",
        "@open-draft/deferred-promise": "^3.0.0",
        "@types/statuses": "^2.0.6",
        "cookie": "^1.1.1",
        "graphql": "^16.13.2",
        "headers-polyfill": "^5.0.1",
        "is-node-process": "^1.2.0",
        "outvariant": "^1.4.3",
        "path-to-regexp": "^6.3.0",
        "picocolors": "^1.1.1",
        "rettime": "^0.11.7",
        "statuses": "^2.0.2",
        "strict-event-emitter": "^0.5.1",
        "tough-cookie": "^6.0.1",
        "type-fest": "^5.5.0",
        "until-async": "^3.0.2",
        "yargs": "^17.7.2"
      },
      "bin": {
        "msw": "cli/index.js"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/mswjs"
      },
      "peerDependencies": {
        "typescript": ">= 4.8.x"
      },
      "peerDependenciesMeta": {
        "typescript": {
          "optional": true
        }
      }
    },
    "node_modules/msw/node_modules/cookie": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/cookie/-/cookie-1.1.1.tgz",
      "integrity": "sha512-ei8Aos7ja0weRpFzJnEA9UHJ/7XQmqglbRwnf2ATjcB9Wq874VKH9kfjjirM6UhU2/E5fFYadylyhFldcqSidQ==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/mute-stream": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/mute-stream/-/mute-stream-3.0.0.tgz",
      "integrity": "sha512-dkEJPVvun4FryqBmZ5KhDo0K9iDXAwn08tMLDinNdRBNPcYEDiWYysLcc6k3mjTMlbP9KyylvRpd4wFtwrT9rw==",
      "license": "ISC",
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/nanoid": {
      "version": "3.3.12",
      "resolved": "https://registry.npmjs.org/nanoid/-/nanoid-3.3.12.tgz",
      "integrity": "sha512-ZB9RH/39qpq5Vu6Y+NmUaFhQR6pp+M2Xt76XBnEwDaGcVAqhlvxrl3B2bKS5D3NH3QR76v3aSrKaF/Kiy7lEtQ==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "bin": {
        "nanoid": "bin/nanoid.cjs"
      },
      "engines": {
        "node": "^10 || ^12 || ^13.7 || ^14 || >=15.0.1"
      }
    },
    "node_modules/napi-postinstall": {
      "version": "0.3.4",
      "resolved": "https://registry.npmjs.org/napi-postinstall/-/napi-postinstall-0.3.4.tgz",
      "integrity": "sha512-PHI5f1O0EP5xJ9gQmFGMS6IZcrVvTjpXjz7Na41gTE7eE2hK11lg04CECCYEEjdc17EV4DO+fkGEtt7TpTaTiQ==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "napi-postinstall": "lib/cli.js"
      },
      "engines": {
        "node": "^12.20.0 || ^14.18.0 || >=16.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/napi-postinstall"
      }
    },
    "node_modules/natural-compare": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/natural-compare/-/natural-compare-1.4.0.tgz",
      "integrity": "sha512-OWND8ei3VtNC9h7V60qff3SVobHr996CTwgxubgyQYEpg290h9J0buyECNNJexkFm5sOajh5G116RYA1c8ZMSw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/negotiator": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/negotiator/-/negotiator-1.0.0.tgz",
      "integrity": "sha512-8Ofs/AUQh8MaEcrlq5xOX0CQ9ypTF5dl78mjlMNfOK08fzpgTHQRQPBxcPlEtIw0yRpws+Zo/3r+5WRby7u3Gg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/next": {
      "version": "16.2.4",
      "resolved": "https://registry.npmjs.org/next/-/next-16.2.4.tgz",
      "integrity": "sha512-kPvz56wF5frc+FxlHI5qnklCzbq53HTwORaWBGdT0vNoKh1Aya9XC8aPauH4NJxqtzbWsS5mAbctm4cr+EkQ2Q==",
      "license": "MIT",
      "dependencies": {
        "@next/env": "16.2.4",
        "@swc/helpers": "0.5.15",
        "baseline-browser-mapping": "^2.9.19",
        "caniuse-lite": "^1.0.30001579",
        "postcss": "8.4.31",
        "styled-jsx": "5.1.6"
      },
      "bin": {
        "next": "dist/bin/next"
      },
      "engines": {
        "node": ">=20.9.0"
      },
      "optionalDependencies": {
        "@next/swc-darwin-arm64": "16.2.4",
        "@next/swc-darwin-x64": "16.2.4",
        "@next/swc-linux-arm64-gnu": "16.2.4",
        "@next/swc-linux-arm64-musl": "16.2.4",
        "@next/swc-linux-x64-gnu": "16.2.4",
        "@next/swc-linux-x64-musl": "16.2.4",
        "@next/swc-win32-arm64-msvc": "16.2.4",
        "@next/swc-win32-x64-msvc": "16.2.4",
        "sharp": "^0.34.5"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.1.0",
        "@playwright/test": "^1.51.1",
        "babel-plugin-react-compiler": "*",
        "react": "^18.2.0 || 19.0.0-rc-de68d2f4-20241204 || ^19.0.0",
        "react-dom": "^18.2.0 || 19.0.0-rc-de68d2f4-20241204 || ^19.0.0",
        "sass": "^1.3.0"
      },
      "peerDependenciesMeta": {
        "@opentelemetry/api": {
          "optional": true
        },
        "@playwright/test": {
          "optional": true
        },
        "babel-plugin-react-compiler": {
          "optional": true
        },
        "sass": {
          "optional": true
        }
      }
    },
    "node_modules/next/node_modules/postcss": {
      "version": "8.4.31",
      "resolved": "https://registry.npmjs.org/postcss/-/postcss-8.4.31.tgz",
      "integrity": "sha512-PS08Iboia9mts/2ygV3eLpY5ghnUcfLV/EXTOW1E2qYxJKGGBUtNjN76FYHnMs36RmARn41bC0AZmn+rR0OVpQ==",
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/postcss"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "nanoid": "^3.3.6",
        "picocolors": "^1.0.0",
        "source-map-js": "^1.0.2"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      }
    },
    "node_modules/node-domexception": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/node-domexception/-/node-domexception-1.0.0.tgz",
      "integrity": "sha512-/jKZoMpw0F8GRwl4/eLROPA3cfcXtLApP0QzLmUT/HuPCZWyB7IY9ZrMeKw2O/nFIqPQB3PVM9aYm0F312AXDQ==",
      "deprecated": "Use your platform's native DOMException instead",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/jimmywarting"
        },
        {
          "type": "github",
          "url": "https://paypal.me/jimmywarting"
        }
      ],
      "license": "MIT",
      "engines": {
        "node": ">=10.5.0"
      }
    },
    "node_modules/node-exports-info": {
      "version": "1.6.0",
      "resolved": "https://registry.npmjs.org/node-exports-info/-/node-exports-info-1.6.0.tgz",
      "integrity": "sha512-pyFS63ptit/P5WqUkt+UUfe+4oevH+bFeIiPPdfb0pFeYEu/1ELnJu5l+5EcTKYL5M7zaAa7S8ddywgXypqKCw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "array.prototype.flatmap": "^1.3.3",
        "es-errors": "^1.3.0",
        "object.entries": "^1.1.9",
        "semver": "^6.3.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/node-fetch": {
      "version": "3.3.2",
      "resolved": "https://registry.npmjs.org/node-fetch/-/node-fetch-3.3.2.tgz",
      "integrity": "sha512-dRB78srN/l6gqWulah9SrxeYnxeddIG30+GOqK/9OlLVyLg3HPnr6SqOWTWOXKRwC2eGYCkZ59NNuSgvSrpgOA==",
      "license": "MIT",
      "dependencies": {
        "data-uri-to-buffer": "^4.0.0",
        "fetch-blob": "^3.1.4",
        "formdata-polyfill": "^4.0.10"
      },
      "engines": {
        "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/node-fetch"
      }
    },
    "node_modules/node-releases": {
      "version": "2.0.38",
      "resolved": "https://registry.npmjs.org/node-releases/-/node-releases-2.0.38.tgz",
      "integrity": "sha512-3qT/88Y3FbH/Kx4szpQQ4HzUbVrHPKTLVpVocKiLfoYvw9XSGOX2FmD2d6DrXbVYyAQTF2HeF6My8jmzx7/CRw==",
      "license": "MIT"
    },
    "node_modules/npm-run-path": {
      "version": "6.0.0",
      "resolved": "https://registry.npmjs.org/npm-run-path/-/npm-run-path-6.0.0.tgz",
      "integrity": "sha512-9qny7Z9DsQU8Ou39ERsPU4OZQlSTP47ShQzuKZ6PRXpYLtIFgl/DEBYEXKlvcEa+9tHVcK8CF81Y2V72qaZhWA==",
      "license": "MIT",
      "dependencies": {
        "path-key": "^4.0.0",
        "unicorn-magic": "^0.3.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/npm-run-path/node_modules/path-key": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/path-key/-/path-key-4.0.0.tgz",
      "integrity": "sha512-haREypq7xkM7ErfgIyA0z+Bj4AGKlMSdlQE2jvJo6huWD1EdkKYV+G/T4nq0YEF2vgTT8kqMFKo1uHn950r4SQ==",
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/object-assign": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/object-assign/-/object-assign-4.1.1.tgz",
      "integrity": "sha512-rJgTQnkUnH1sFw8yT6VSU3zD3sWmu6sZhIseY8VX+GRu3P6F7Fu+JNDoXfklElbLJSnc3FUQHVe4cU5hj+BcUg==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/object-inspect": {
      "version": "1.13.4",
      "resolved": "https://registry.npmjs.org/object-inspect/-/object-inspect-1.13.4.tgz",
      "integrity": "sha512-W67iLl4J2EXEGTbfeHCffrjDfitvLANg0UlX3wFUUSTx92KXRFegMHUVgSqE+wvhAbi4WqjGg9czysTV2Epbew==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/object-keys": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/object-keys/-/object-keys-1.1.1.tgz",
      "integrity": "sha512-NuAESUOUMrlIXOfHKzD6bpPu3tYt3xvjNdRIQ+FeT0lNb4K8WR70CaDxhuNguS2XG+GjkyMwOzsN5ZktImfhLA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/object-treeify": {
      "version": "1.1.33",
      "resolved": "https://registry.npmjs.org/object-treeify/-/object-treeify-1.1.33.tgz",
      "integrity": "sha512-EFVjAYfzWqWsBMRHPMAXLCDIJnpMhdWAqR7xG6M6a2cs6PMFpl/+Z20w9zDW4vkxOFfddegBKq9Rehd0bxWE7A==",
      "license": "MIT",
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/object.assign": {
      "version": "4.1.7",
      "resolved": "https://registry.npmjs.org/object.assign/-/object.assign-4.1.7.tgz",
      "integrity": "sha512-nK28WOo+QIjBkDduTINE4JkF/UJJKyf2EJxvJKfblDpyg0Q+pkOHNTL0Qwy6NP6FhE/EnzV73BxxqcJaXY9anw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "call-bound": "^1.0.3",
        "define-properties": "^1.2.1",
        "es-object-atoms": "^1.0.0",
        "has-symbols": "^1.1.0",
        "object-keys": "^1.1.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/object.entries": {
      "version": "1.1.9",
      "resolved": "https://registry.npmjs.org/object.entries/-/object.entries-1.1.9.tgz",
      "integrity": "sha512-8u/hfXFRBD1O0hPUjioLhoWFHRmt6tKA4/vZPyckBr18l1KE9uHrFaFaUi8MDRTpi4uak2goyPTSNJLXX2k2Hw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "call-bound": "^1.0.4",
        "define-properties": "^1.2.1",
        "es-object-atoms": "^1.1.1"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/object.fromentries": {
      "version": "2.0.8",
      "resolved": "https://registry.npmjs.org/object.fromentries/-/object.fromentries-2.0.8.tgz",
      "integrity": "sha512-k6E21FzySsSK5a21KRADBd/NGneRegFO5pLHfdQLpRDETUNJueLXs3WCzyQ3tFRDYgbq3KHGXfTbi2bs8WQ6rQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.7",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.2",
        "es-object-atoms": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/object.groupby": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/object.groupby/-/object.groupby-1.0.3.tgz",
      "integrity": "sha512-+Lhy3TQTuzXI5hevh8sBGqbmurHbbIjAi0Z4S63nthVLmLxfbj4T54a4CfZrXIrt9iP4mVAPYMo/v99taj3wjQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.7",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/object.values": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/object.values/-/object.values-1.2.1.tgz",
      "integrity": "sha512-gXah6aZrcUxjWg2zR2MwouP2eHlCBzdV4pygudehaKXSGW4v2AsRQUK+lwwXhii6KFZcunEnmSUoYp5CXibxtA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "call-bound": "^1.0.3",
        "define-properties": "^1.2.1",
        "es-object-atoms": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/on-finished": {
      "version": "2.4.1",
      "resolved": "https://registry.npmjs.org/on-finished/-/on-finished-2.4.1.tgz",
      "integrity": "sha512-oVlzkg3ENAhCk2zdv7IJwd/QUD4z2RxRwpkcGY8psCVcCYZNq4wYnVWALHM+brtuJjePWiYF/ClmuDr8Ch5+kg==",
      "license": "MIT",
      "dependencies": {
        "ee-first": "1.1.1"
      },
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/once": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/once/-/once-1.4.0.tgz",
      "integrity": "sha512-lNaJgI+2Q5URQBkccEKHTQOPaXdUxnZZElQTZY0MFUAuaEqe1E+Nyvgdz/aIyNi6Z9MzO5dv1H8n58/GELp3+w==",
      "license": "ISC",
      "dependencies": {
        "wrappy": "1"
      }
    },
    "node_modules/onetime": {
      "version": "7.0.0",
      "resolved": "https://registry.npmjs.org/onetime/-/onetime-7.0.0.tgz",
      "integrity": "sha512-VXJjc87FScF88uafS3JllDgvAm+c/Slfz06lorj2uAY34rlUu0Nt+v8wreiImcrgAjjIHp1rXpTDlLOGw29WwQ==",
      "license": "MIT",
      "dependencies": {
        "mimic-function": "^5.0.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/open": {
      "version": "11.0.0",
      "resolved": "https://registry.npmjs.org/open/-/open-11.0.0.tgz",
      "integrity": "sha512-smsWv2LzFjP03xmvFoJ331ss6h+jixfA4UUV/Bsiyuu4YJPfN+FIQGOIiv4w9/+MoHkfkJ22UIaQWRVFRfH6Vw==",
      "license": "MIT",
      "dependencies": {
        "default-browser": "^5.4.0",
        "define-lazy-prop": "^3.0.0",
        "is-in-ssh": "^1.0.0",
        "is-inside-container": "^1.0.0",
        "powershell-utils": "^0.1.0",
        "wsl-utils": "^0.3.0"
      },
      "engines": {
        "node": ">=20"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/optionator": {
      "version": "0.9.4",
      "resolved": "https://registry.npmjs.org/optionator/-/optionator-0.9.4.tgz",
      "integrity": "sha512-6IpQ7mKUxRcZNLIObR0hz7lxsapSSIYNZJwXPGeF0mTVqGKFIXj1DQcMoT22S3ROcLyY/rz0PWaWZ9ayWmad9g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "deep-is": "^0.1.3",
        "fast-levenshtein": "^2.0.6",
        "levn": "^0.4.1",
        "prelude-ls": "^1.2.1",
        "type-check": "^0.4.0",
        "word-wrap": "^1.2.5"
      },
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/ora": {
      "version": "8.2.0",
      "resolved": "https://registry.npmjs.org/ora/-/ora-8.2.0.tgz",
      "integrity": "sha512-weP+BZ8MVNnlCm8c0Qdc1WSWq4Qn7I+9CJGm7Qali6g44e/PUzbjNqJX5NJ9ljlNMosfJvg1fKEGILklK9cwnw==",
      "license": "MIT",
      "dependencies": {
        "chalk": "^5.3.0",
        "cli-cursor": "^5.0.0",
        "cli-spinners": "^2.9.2",
        "is-interactive": "^2.0.0",
        "is-unicode-supported": "^2.0.0",
        "log-symbols": "^6.0.0",
        "stdin-discarder": "^0.2.2",
        "string-width": "^7.2.0",
        "strip-ansi": "^7.1.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/ora/node_modules/chalk": {
      "version": "5.6.2",
      "resolved": "https://registry.npmjs.org/chalk/-/chalk-5.6.2.tgz",
      "integrity": "sha512-7NzBL0rN6fMUW+f7A6Io4h40qQlG+xGmtMxfbnH/K7TAtt8JQWVQK+6g0UXKMeVJoyV5EkkNsErQ8pVD3bLHbA==",
      "license": "MIT",
      "engines": {
        "node": "^12.17.0 || ^14.13 || >=16.0.0"
      },
      "funding": {
        "url": "https://github.com/chalk/chalk?sponsor=1"
      }
    },
    "node_modules/outvariant": {
      "version": "1.4.3",
      "resolved": "https://registry.npmjs.org/outvariant/-/outvariant-1.4.3.tgz",
      "integrity": "sha512-+Sl2UErvtsoajRDKCE5/dBz4DIvHXQQnAxtQTF04OJxY0+DyZXSo5P5Bb7XYWOh81syohlYL24hbDwxedPUJCA==",
      "license": "MIT"
    },
    "node_modules/own-keys": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/own-keys/-/own-keys-1.0.1.tgz",
      "integrity": "sha512-qFOyK5PjiWZd+QQIh+1jhdb9LpxTF0qs7Pm8o5QHYZ0M3vKqSqzsZaEB6oWlxZ+q2sJBMI/Ktgd2N5ZwQoRHfg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "get-intrinsic": "^1.2.6",
        "object-keys": "^1.1.1",
        "safe-push-apply": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/p-limit": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/p-limit/-/p-limit-3.1.0.tgz",
      "integrity": "sha512-TYOanM3wGwNGsZN2cVTYPArw454xnXj5qmWF1bEoAc4+cU/ol7GVh7odevjp1FNHduHc3KZMcFduxU5Xc6uJRQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "yocto-queue": "^0.1.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/p-locate": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/p-locate/-/p-locate-5.0.0.tgz",
      "integrity": "sha512-LaNjtRWUBY++zB5nE/NwcaoMylSPk+S+ZHNB1TzdbMJMny6dynpAGt7X/tl/QYq3TIeE6nxHppbo2LGymrG5Pw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "p-limit": "^3.0.2"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/parent-module": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/parent-module/-/parent-module-1.0.1.tgz",
      "integrity": "sha512-GQ2EWRpQV8/o+Aw8YqtfZZPfNRWZYkbidE9k5rpl/hC3vtHHBfGm2Ifi6qWV+coDGkrUKZAxE3Lot5kcsRlh+g==",
      "license": "MIT",
      "dependencies": {
        "callsites": "^3.0.0"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/parse-entities": {
      "version": "4.0.2",
      "resolved": "https://registry.npmjs.org/parse-entities/-/parse-entities-4.0.2.tgz",
      "integrity": "sha512-GG2AQYWoLgL877gQIKeRPGO1xF9+eG1ujIb5soS5gPvLQ1y2o8FL90w2QWNdf9I361Mpp7726c+lj3U0qK1uGw==",
      "license": "MIT",
      "dependencies": {
        "@types/unist": "^2.0.0",
        "character-entities-legacy": "^3.0.0",
        "character-reference-invalid": "^2.0.0",
        "decode-named-character-reference": "^1.0.0",
        "is-alphanumerical": "^2.0.0",
        "is-decimal": "^2.0.0",
        "is-hexadecimal": "^2.0.0"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/parse-entities/node_modules/@types/unist": {
      "version": "2.0.11",
      "resolved": "https://registry.npmjs.org/@types/unist/-/unist-2.0.11.tgz",
      "integrity": "sha512-CmBKiL6NNo/OqgmMn95Fk9Whlp2mtvIv+KNpQKN2F4SjvrEesubTRWGYSg+BnWZOnlCaSTU1sMpsBOzgbYhnsA==",
      "license": "MIT"
    },
    "node_modules/parse-json": {
      "version": "5.2.0",
      "resolved": "https://registry.npmjs.org/parse-json/-/parse-json-5.2.0.tgz",
      "integrity": "sha512-ayCKvm/phCGxOkYRSCM82iDwct8/EonSEgCSxWxD7ve6jHggsFl4fZVQBPRNgQoKiuV/odhFrGzQXZwbifC8Rg==",
      "license": "MIT",
      "dependencies": {
        "@babel/code-frame": "^7.0.0",
        "error-ex": "^1.3.1",
        "json-parse-even-better-errors": "^2.3.0",
        "lines-and-columns": "^1.1.6"
      },
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/parse-ms": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/parse-ms/-/parse-ms-4.0.0.tgz",
      "integrity": "sha512-TXfryirbmq34y8QBwgqCVLi+8oA3oWx2eAnSn62ITyEhEYaWRlVZ2DvMM9eZbMs/RfxPu/PK/aBLyGj4IrqMHw==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/parseurl": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/parseurl/-/parseurl-1.3.3.tgz",
      "integrity": "sha512-CiyeOxFT/JZyN5m0z9PfXw4SCBJ6Sygz1Dpl0wqjlhDEGGBP1GnsUVEL0p63hoG1fcj3fHynXi9NYO4nWOL+qQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/path-browserify": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/path-browserify/-/path-browserify-1.0.1.tgz",
      "integrity": "sha512-b7uo2UCUOYZcnF/3ID0lulOJi/bafxa1xPe7ZPsammBSpjSWQkjNxlt635YGS2MiR9GjvuXCtz2emr3jbsz98g==",
      "license": "MIT"
    },
    "node_modules/path-exists": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/path-exists/-/path-exists-4.0.0.tgz",
      "integrity": "sha512-ak9Qy5Q7jYb2Wwcey5Fpvg2KoAc/ZIhLSLOSBmRmygPsGwkVVt0fZa0qrtMz+m6tJTAHfZQ8FnmB4MG4LWy7/w==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/path-key": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/path-key/-/path-key-3.1.1.tgz",
      "integrity": "sha512-ojmeN0qd+y0jszEtoY48r0Peq5dwMEkIlCOu6Q5f41lfkswXuKtYrhgoTpLnyIcHm24Uhqx+5Tqm2InSwLhE6Q==",
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/path-parse": {
      "version": "1.0.7",
      "resolved": "https://registry.npmjs.org/path-parse/-/path-parse-1.0.7.tgz",
      "integrity": "sha512-LDJzPVEEEPR+y48z93A0Ed0yXb8pAByGWo/k5YYdYgpY2/2EsOsksJrq7lOHxryrVOn1ejG6oAp8ahvOIQD8sw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/path-to-regexp": {
      "version": "6.3.0",
      "resolved": "https://registry.npmjs.org/path-to-regexp/-/path-to-regexp-6.3.0.tgz",
      "integrity": "sha512-Yhpw4T9C6hPpgPeA28us07OJeqZ5EzQTkbfwuhsUg0c237RomFoETJgmp2sa3F/41gfLE6G5cqcYwznmeEeOlQ==",
      "license": "MIT"
    },
    "node_modules/picocolors": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/picocolors/-/picocolors-1.1.1.tgz",
      "integrity": "sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==",
      "license": "ISC"
    },
    "node_modules/picomatch": {
      "version": "2.3.2",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-2.3.2.tgz",
      "integrity": "sha512-V7+vQEJ06Z+c5tSye8S+nHUfI51xoXIXjHQ99cQtKUkQqqO1kO/KCJUfZXuB47h/YBlDhah2H3hdUGXn8ie0oA==",
      "license": "MIT",
      "engines": {
        "node": ">=8.6"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/pkce-challenge": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/pkce-challenge/-/pkce-challenge-5.0.1.tgz",
      "integrity": "sha512-wQ0b/W4Fr01qtpHlqSqspcj3EhBvimsdh0KlHhH8HRZnMsEa0ea2fTULOXOS9ccQr3om+GcGRk4e+isrZWV8qQ==",
      "license": "MIT",
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/possible-typed-array-names": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/possible-typed-array-names/-/possible-typed-array-names-1.1.0.tgz",
      "integrity": "sha512-/+5VFTchJDoVj3bhoqi6UeymcD00DAwb1nJwamzPvHEszJ4FpF6SNNbUbOS8yI56qHzdV8eK0qEfOSiodkTdxg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/postcss": {
      "version": "8.5.13",
      "resolved": "https://registry.npmjs.org/postcss/-/postcss-8.5.13.tgz",
      "integrity": "sha512-qif0+jGGZoLWdHey3UFHHWP0H7Gbmsk8T5VEqyYFbWqPr1XqvLGBbk/sl8V5exGmcYJklJOhOQq1pV9IcsiFag==",
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/postcss"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "nanoid": "^3.3.11",
        "picocolors": "^1.1.1",
        "source-map-js": "^1.2.1"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      }
    },
    "node_modules/postcss-selector-parser": {
      "version": "7.1.1",
      "resolved": "https://registry.npmjs.org/postcss-selector-parser/-/postcss-selector-parser-7.1.1.tgz",
      "integrity": "sha512-orRsuYpJVw8LdAwqqLykBj9ecS5/cRHlI5+nvTo8LcCKmzDmqVORXtOIYEEQuL9D4BxtA1lm5isAqzQZCoQ6Eg==",
      "license": "MIT",
      "dependencies": {
        "cssesc": "^3.0.0",
        "util-deprecate": "^1.0.2"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/powershell-utils": {
      "version": "0.1.0",
      "resolved": "https://registry.npmjs.org/powershell-utils/-/powershell-utils-0.1.0.tgz",
      "integrity": "sha512-dM0jVuXJPsDN6DvRpea484tCUaMiXWjuCn++HGTqUWzGDjv5tZkEZldAJ/UMlqRYGFrD/etByo4/xOuC/snX2A==",
      "license": "MIT",
      "engines": {
        "node": ">=20"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/preact": {
      "version": "10.29.1",
      "resolved": "https://registry.npmjs.org/preact/-/preact-10.29.1.tgz",
      "integrity": "sha512-gQCLc/vWroE8lIpleXtdJhTFDogTdZG9AjMUpVkDf2iTCNwYNWA+u16dL41TqUDJO4gm2IgrcMv3uTpjd4Pwmg==",
      "license": "MIT",
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/preact"
      }
    },
    "node_modules/prelude-ls": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/prelude-ls/-/prelude-ls-1.2.1.tgz",
      "integrity": "sha512-vkcDPrRZo1QZLbn5RLGPpg/WmIQ65qoWWhcGKf/b5eplkkarX0m9z8ppCat4mlOqUsWpyNuYgO3VRyrYHSzX5g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/pretty-ms": {
      "version": "9.3.0",
      "resolved": "https://registry.npmjs.org/pretty-ms/-/pretty-ms-9.3.0.tgz",
      "integrity": "sha512-gjVS5hOP+M3wMm5nmNOucbIrqudzs9v/57bWRHQWLYklXqoXKrVfYW2W9+glfGsqtPgpiz5WwyEEB+ksXIx3gQ==",
      "license": "MIT",
      "dependencies": {
        "parse-ms": "^4.0.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/prompts": {
      "version": "2.4.2",
      "resolved": "https://registry.npmjs.org/prompts/-/prompts-2.4.2.tgz",
      "integrity": "sha512-NxNv/kLguCA7p3jE8oL2aEBsrJWgAakBpgmgK6lpPWV+WuOmY6r2/zbAVnP+T8bQlA0nzHXSJSJW0Hq7ylaD2Q==",
      "license": "MIT",
      "dependencies": {
        "kleur": "^3.0.3",
        "sisteransi": "^1.0.5"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/prompts/node_modules/kleur": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/kleur/-/kleur-3.0.3.tgz",
      "integrity": "sha512-eTIzlVOSUR+JxdDFepEYcBMtZ9Qqdef+rnzWdRZuMbOywu5tO2w2N7rqjoANZ5k9vywhL6Br1VRjUIgTQx4E8w==",
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/prop-types": {
      "version": "15.8.1",
      "resolved": "https://registry.npmjs.org/prop-types/-/prop-types-15.8.1.tgz",
      "integrity": "sha512-oj87CgZICdulUohogVAR7AjlC0327U4el4L6eAvOqCeudMDVU0NThNaV+b9Df4dXgSP1gXMTnPdhfe/2qDH5cg==",
      "license": "MIT",
      "dependencies": {
        "loose-envify": "^1.4.0",
        "object-assign": "^4.1.1",
        "react-is": "^16.13.1"
      }
    },
    "node_modules/property-information": {
      "version": "7.1.0",
      "resolved": "https://registry.npmjs.org/property-information/-/property-information-7.1.0.tgz",
      "integrity": "sha512-TwEZ+X+yCJmYfL7TPUOcvBZ4QfoT5YenQiJuX//0th53DE6w0xxLEtfK3iyryQFddXuvkIk51EEgrJQ0WJkOmQ==",
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/proxy-addr": {
      "version": "2.0.7",
      "resolved": "https://registry.npmjs.org/proxy-addr/-/proxy-addr-2.0.7.tgz",
      "integrity": "sha512-llQsMLSUDUPT44jdrU/O37qlnifitDP+ZwrmmZcoSKyLKvtZxpyV0n2/bD/N4tBAAZ/gJEdZU7KMraoK1+XYAg==",
      "license": "MIT",
      "dependencies": {
        "forwarded": "0.2.0",
        "ipaddr.js": "1.9.1"
      },
      "engines": {
        "node": ">= 0.10"
      }
    },
    "node_modules/punycode": {
      "version": "2.3.1",
      "resolved": "https://registry.npmjs.org/punycode/-/punycode-2.3.1.tgz",
      "integrity": "sha512-vYt7UD1U9Wg6138shLtLOvdAu+8DsC/ilFtEVHcH+wydcSpNE20AfSOduf6MkRFahL5FY7X1oU7nKVZFtfq8Fg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/qs": {
      "version": "6.15.1",
      "resolved": "https://registry.npmjs.org/qs/-/qs-6.15.1.tgz",
      "integrity": "sha512-6YHEFRL9mfgcAvql/XhwTvf5jKcOiiupt2FiJxHkiX1z4j7WL8J/jRHYLluORvc1XxB5rV20KoeK00gVJamspg==",
      "license": "BSD-3-Clause",
      "dependencies": {
        "side-channel": "^1.1.0"
      },
      "engines": {
        "node": ">=0.6"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/queue-microtask": {
      "version": "1.2.3",
      "resolved": "https://registry.npmjs.org/queue-microtask/-/queue-microtask-1.2.3.tgz",
      "integrity": "sha512-NuaNSa6flKT5JaSYQzJok04JzTL1CA6aGhv5rfLW3PgqA+M2ChpZQnAC8h8i4ZFkBS8X5RqkDBHA7r4hej3K9A==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "MIT"
    },
    "node_modules/range-parser": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/range-parser/-/range-parser-1.2.1.tgz",
      "integrity": "sha512-Hrgsx+orqoygnmhFbKaHE6c296J+HTAQXoxEF6gNupROmmGJRoyzfG3ccAveqCBrwr/2yxQ5BVd/GTl5agOwSg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/raw-body": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/raw-body/-/raw-body-3.0.2.tgz",
      "integrity": "sha512-K5zQjDllxWkf7Z5xJdV0/B0WTNqx6vxG70zJE4N0kBs4LovmEYWJzQGxC9bS9RAKu3bgM40lrd5zoLJ12MQ5BA==",
      "license": "MIT",
      "dependencies": {
        "bytes": "~3.1.2",
        "http-errors": "~2.0.1",
        "iconv-lite": "~0.7.0",
        "unpipe": "~1.0.0"
      },
      "engines": {
        "node": ">= 0.10"
      }
    },
    "node_modules/react": {
      "version": "19.2.4",
      "resolved": "https://registry.npmjs.org/react/-/react-19.2.4.tgz",
      "integrity": "sha512-9nfp2hYpCwOjAN+8TZFGhtWEwgvWHXqESH8qT89AT/lWklpLON22Lc8pEtnpsZz7VmawabSU0gCjnj8aC0euHQ==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/react-dom": {
      "version": "19.2.4",
      "resolved": "https://registry.npmjs.org/react-dom/-/react-dom-19.2.4.tgz",
      "integrity": "sha512-AXJdLo8kgMbimY95O2aKQqsz2iWi9jMgKJhRBAxECE4IFxfcazB2LmzloIoibJI3C12IlY20+KFaLv+71bUJeQ==",
      "license": "MIT",
      "dependencies": {
        "scheduler": "^0.27.0"
      },
      "peerDependencies": {
        "react": "^19.2.4"
      }
    },
    "node_modules/react-force-graph-2d": {
      "version": "1.29.1",
      "resolved": "https://registry.npmjs.org/react-force-graph-2d/-/react-force-graph-2d-1.29.1.tgz",
      "integrity": "sha512-1Rl/1Z3xy2iTHKj6a0jRXGyiI86xUti81K+jBQZ+Oe46csaMikp47L5AjrzA9hY9fNGD63X8ffrqnvaORukCuQ==",
      "license": "MIT",
      "dependencies": {
        "force-graph": "^1.51",
        "prop-types": "15",
        "react-kapsule": "^2.5"
      },
      "engines": {
        "node": ">=12"
      },
      "peerDependencies": {
        "react": "*"
      }
    },
    "node_modules/react-is": {
      "version": "16.13.1",
      "resolved": "https://registry.npmjs.org/react-is/-/react-is-16.13.1.tgz",
      "integrity": "sha512-24e6ynE2H+OKt4kqsOvNd8kBpV65zoxbA4BVsEOB3ARVWQki/DHzaUoC5KuON/BiccDaCCTZBuOcfZs70kR8bQ==",
      "license": "MIT"
    },
    "node_modules/react-kapsule": {
      "version": "2.5.7",
      "resolved": "https://registry.npmjs.org/react-kapsule/-/react-kapsule-2.5.7.tgz",
      "integrity": "sha512-kifAF4ZPD77qZKc4CKLmozq6GY1sBzPEJTIJb0wWFK6HsePJatK3jXplZn2eeAt3x67CDozgi7/rO8fNQ/AL7A==",
      "license": "MIT",
      "dependencies": {
        "jerrypick": "^1.1.1"
      },
      "engines": {
        "node": ">=12"
      },
      "peerDependencies": {
        "react": ">=16.13.1"
      }
    },
    "node_modules/react-markdown": {
      "version": "10.1.0",
      "resolved": "https://registry.npmjs.org/react-markdown/-/react-markdown-10.1.0.tgz",
      "integrity": "sha512-qKxVopLT/TyA6BX3Ue5NwabOsAzm0Q7kAPwq6L+wWDwisYs7R8vZ0nRXqq6rkueboxpkjvLGU9fWifiX/ZZFxQ==",
      "license": "MIT",
      "dependencies": {
        "@types/hast": "^3.0.0",
        "@types/mdast": "^4.0.0",
        "devlop": "^1.0.0",
        "hast-util-to-jsx-runtime": "^2.0.0",
        "html-url-attributes": "^3.0.0",
        "mdast-util-to-hast": "^13.0.0",
        "remark-parse": "^11.0.0",
        "remark-rehype": "^11.0.0",
        "unified": "^11.0.0",
        "unist-util-visit": "^5.0.0",
        "vfile": "^6.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      },
      "peerDependencies": {
        "@types/react": ">=18",
        "react": ">=18"
      }
    },
    "node_modules/recast": {
      "version": "0.23.11",
      "resolved": "https://registry.npmjs.org/recast/-/recast-0.23.11.tgz",
      "integrity": "sha512-YTUo+Flmw4ZXiWfQKGcwwc11KnoRAYgzAE2E7mXKCjSviTKShtxBsN6YUUBB2gtaBzKzeKunxhUwNHQuRryhWA==",
      "license": "MIT",
      "dependencies": {
        "ast-types": "^0.16.1",
        "esprima": "~4.0.0",
        "source-map": "~0.6.1",
        "tiny-invariant": "^1.3.3",
        "tslib": "^2.0.1"
      },
      "engines": {
        "node": ">= 4"
      }
    },
    "node_modules/reflect.getprototypeof": {
      "version": "1.0.10",
      "resolved": "https://registry.npmjs.org/reflect.getprototypeof/-/reflect.getprototypeof-1.0.10.tgz",
      "integrity": "sha512-00o4I+DVrefhv+nX0ulyi3biSHCPDe+yLv5o/p6d/UVlirijB8E16FtfwSAi4g3tcqrQ4lRAqQSoFEZJehYEcw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.9",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.0.0",
        "get-intrinsic": "^1.2.7",
        "get-proto": "^1.0.1",
        "which-builtin-type": "^1.2.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/regexp.prototype.flags": {
      "version": "1.5.4",
      "resolved": "https://registry.npmjs.org/regexp.prototype.flags/-/regexp.prototype.flags-1.5.4.tgz",
      "integrity": "sha512-dYqgNSZbDwkaJ2ceRd9ojCGjBq+mOm9LmtXnAnEGyHhN/5R7iDW2TRw3h+o/jCFxus3P2LfWIIiwowAjANm7IA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "define-properties": "^1.2.1",
        "es-errors": "^1.3.0",
        "get-proto": "^1.0.1",
        "gopd": "^1.2.0",
        "set-function-name": "^2.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/remark-frontmatter": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/remark-frontmatter/-/remark-frontmatter-5.0.0.tgz",
      "integrity": "sha512-XTFYvNASMe5iPN0719nPrdItC9aU0ssC4v14mH1BCi1u0n1gAocqcujWUrByftZTbLhRtiKRyjYTSIOcr69UVQ==",
      "license": "MIT",
      "dependencies": {
        "@types/mdast": "^4.0.0",
        "mdast-util-frontmatter": "^2.0.0",
        "micromark-extension-frontmatter": "^2.0.0",
        "unified": "^11.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/remark-gfm": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/remark-gfm/-/remark-gfm-4.0.1.tgz",
      "integrity": "sha512-1quofZ2RQ9EWdeN34S79+KExV1764+wCUGop5CPL1WGdD0ocPpu91lzPGbwWMECpEpd42kJGQwzRfyov9j4yNg==",
      "license": "MIT",
      "dependencies": {
        "@types/mdast": "^4.0.0",
        "mdast-util-gfm": "^3.0.0",
        "micromark-extension-gfm": "^3.0.0",
        "remark-parse": "^11.0.0",
        "remark-stringify": "^11.0.0",
        "unified": "^11.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/remark-parse": {
      "version": "11.0.0",
      "resolved": "https://registry.npmjs.org/remark-parse/-/remark-parse-11.0.0.tgz",
      "integrity": "sha512-FCxlKLNGknS5ba/1lmpYijMUzX2esxW5xQqjWxw2eHFfS2MSdaHVINFmhjo+qN1WhZhNimq0dZATN9pH0IDrpA==",
      "license": "MIT",
      "dependencies": {
        "@types/mdast": "^4.0.0",
        "mdast-util-from-markdown": "^2.0.0",
        "micromark-util-types": "^2.0.0",
        "unified": "^11.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/remark-rehype": {
      "version": "11.1.2",
      "resolved": "https://registry.npmjs.org/remark-rehype/-/remark-rehype-11.1.2.tgz",
      "integrity": "sha512-Dh7l57ianaEoIpzbp0PC9UKAdCSVklD8E5Rpw7ETfbTl3FqcOOgq5q2LVDhgGCkaBv7p24JXikPdvhhmHvKMsw==",
      "license": "MIT",
      "dependencies": {
        "@types/hast": "^3.0.0",
        "@types/mdast": "^4.0.0",
        "mdast-util-to-hast": "^13.0.0",
        "unified": "^11.0.0",
        "vfile": "^6.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/remark-stringify": {
      "version": "11.0.0",
      "resolved": "https://registry.npmjs.org/remark-stringify/-/remark-stringify-11.0.0.tgz",
      "integrity": "sha512-1OSmLd3awB/t8qdoEOMazZkNsfVTeY4fTsgzcQFdXNq8ToTN4ZGwrMnlda4K6smTFKD+GRV6O48i6Z4iKgPPpw==",
      "license": "MIT",
      "dependencies": {
        "@types/mdast": "^4.0.0",
        "mdast-util-to-markdown": "^2.0.0",
        "unified": "^11.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/require-directory": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/require-directory/-/require-directory-2.1.1.tgz",
      "integrity": "sha512-fGxEI7+wsG9xrvdjsrlmL22OMTTiHRwAMroiEeMgq8gzoLC/PQr7RsRDSTLUg/bZAZtF+TVIkHc6/4RIKrui+Q==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/require-from-string": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/require-from-string/-/require-from-string-2.0.2.tgz",
      "integrity": "sha512-Xf0nWe6RseziFMu+Ap9biiUbmplq6S9/p+7w7YXP/JBHhrUDDUhwa+vANyubuqfZWTveU//DYVGsDG7RKL/vEw==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/reselect": {
      "version": "5.1.1",
      "resolved": "https://registry.npmjs.org/reselect/-/reselect-5.1.1.tgz",
      "integrity": "sha512-K/BG6eIky/SBpzfHZv/dd+9JBFiS4SWV7FIujVyJRux6e45+73RaUHXLmIR1f7WOMaQ0U1km6qwklRQxpJJY0w==",
      "license": "MIT"
    },
    "node_modules/resolve": {
      "version": "2.0.0-next.6",
      "resolved": "https://registry.npmjs.org/resolve/-/resolve-2.0.0-next.6.tgz",
      "integrity": "sha512-3JmVl5hMGtJ3kMmB3zi3DL25KfkCEyy3Tw7Gmw7z5w8M9WlwoPFnIvwChzu1+cF3iaK3sp18hhPz8ANeimdJfA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "is-core-module": "^2.16.1",
        "node-exports-info": "^1.6.0",
        "object-keys": "^1.1.1",
        "path-parse": "^1.0.7",
        "supports-preserve-symlinks-flag": "^1.0.0"
      },
      "bin": {
        "resolve": "bin/resolve"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/resolve-from": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/resolve-from/-/resolve-from-4.0.0.tgz",
      "integrity": "sha512-pb/MYmXstAkysRFx8piNI1tGFNQIFA3vkE3Gq4EuA1dF6gHp/+vgZqsCGJapvy8N3Q+4o7FwvquPJcnZ7RYy4g==",
      "license": "MIT",
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/resolve-pkg-maps": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/resolve-pkg-maps/-/resolve-pkg-maps-1.0.0.tgz",
      "integrity": "sha512-seS2Tj26TBVOC2NIc2rOe2y2ZO7efxITtLZcGSOnHHNOQ7CkiUBfw0Iw2ck6xkIhPwLhKNLS8BO+hEpngQlqzw==",
      "dev": true,
      "license": "MIT",
      "funding": {
        "url": "https://github.com/privatenumber/resolve-pkg-maps?sponsor=1"
      }
    },
    "node_modules/restore-cursor": {
      "version": "5.1.0",
      "resolved": "https://registry.npmjs.org/restore-cursor/-/restore-cursor-5.1.0.tgz",
      "integrity": "sha512-oMA2dcrw6u0YfxJQXm342bFKX/E4sG9rbTzO9ptUcR/e8A33cHuvStiYOwH7fszkZlZ1z/ta9AAoPk2F4qIOHA==",
      "license": "MIT",
      "dependencies": {
        "onetime": "^7.0.0",
        "signal-exit": "^4.1.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/rettime": {
      "version": "0.11.8",
      "resolved": "https://registry.npmjs.org/rettime/-/rettime-0.11.8.tgz",
      "integrity": "sha512-0fERGXktJTyJ+h8fBEiPxHPEFOu0h15JY7JtwrOVqR5K+vb99ho6IyOo7ekLS3h4sJCzIDy4VWKIbZUfe9njmg==",
      "license": "MIT"
    },
    "node_modules/reusify": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/reusify/-/reusify-1.1.0.tgz",
      "integrity": "sha512-g6QUff04oZpHs0eG5p83rFLhHeV00ug/Yf9nZM6fLeUrPguBTkTQOdpAWWspMh55TZfVQDPaN3NQJfbVRAxdIw==",
      "license": "MIT",
      "engines": {
        "iojs": ">=1.0.0",
        "node": ">=0.10.0"
      }
    },
    "node_modules/router": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/router/-/router-2.2.0.tgz",
      "integrity": "sha512-nLTrUKm2UyiL7rlhapu/Zl45FwNgkZGaCpZbIHajDYgwlJCOzLSk+cIPAnsEqV955GjILJnKbdQC1nVPz+gAYQ==",
      "license": "MIT",
      "dependencies": {
        "debug": "^4.4.0",
        "depd": "^2.0.0",
        "is-promise": "^4.0.0",
        "parseurl": "^1.3.3",
        "path-to-regexp": "^8.0.0"
      },
      "engines": {
        "node": ">= 18"
      }
    },
    "node_modules/router/node_modules/path-to-regexp": {
      "version": "8.4.2",
      "resolved": "https://registry.npmjs.org/path-to-regexp/-/path-to-regexp-8.4.2.tgz",
      "integrity": "sha512-qRcuIdP69NPm4qbACK+aDogI5CBDMi1jKe0ry5rSQJz8JVLsC7jV8XpiJjGRLLol3N+R5ihGYcrPLTno6pAdBA==",
      "license": "MIT",
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/run-applescript": {
      "version": "7.1.0",
      "resolved": "https://registry.npmjs.org/run-applescript/-/run-applescript-7.1.0.tgz",
      "integrity": "sha512-DPe5pVFaAsinSaV6QjQ6gdiedWDcRCbUuiQfQa2wmWV7+xC9bGulGI8+TdRmoFkAPaBXk8CrAbnlY2ISniJ47Q==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/run-parallel": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/run-parallel/-/run-parallel-1.2.0.tgz",
      "integrity": "sha512-5l4VyZR86LZ/lDxZTR6jqL8AFE2S0IFLMP26AbjsLVADxHdhB/c0GUsH+y39UfCi3dzz8OlQuPmnaJOMoDHQBA==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "queue-microtask": "^1.2.2"
      }
    },
    "node_modules/safe-array-concat": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/safe-array-concat/-/safe-array-concat-1.1.4.tgz",
      "integrity": "sha512-wtZlHyOje6OZTGqAoaDKxFkgRtkF9CnHAVnCHKfuj200wAgL+bSJhdsCD2l0Qx/2ekEXjPWcyKkfGb5CPboslg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.9",
        "call-bound": "^1.0.4",
        "get-intrinsic": "^1.3.0",
        "has-symbols": "^1.1.0",
        "isarray": "^2.0.5"
      },
      "engines": {
        "node": ">=0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/safe-push-apply": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/safe-push-apply/-/safe-push-apply-1.0.0.tgz",
      "integrity": "sha512-iKE9w/Z7xCzUMIZqdBsp6pEQvwuEebH4vdpjcDWnyzaI6yl6O9FHvVpmGelvEHNsoY6wGblkxR6Zty/h00WiSA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "isarray": "^2.0.5"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/safe-regex-test": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/safe-regex-test/-/safe-regex-test-1.1.0.tgz",
      "integrity": "sha512-x/+Cz4YrimQxQccJf5mKEbIa1NzeCRNI5Ecl/ekmlYaampdNLPalVyIcCZNNH3MvmqBugV5TMYZXv0ljslUlaw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "es-errors": "^1.3.0",
        "is-regex": "^1.2.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/safer-buffer": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/safer-buffer/-/safer-buffer-2.1.2.tgz",
      "integrity": "sha512-YZo3K82SD7Riyi0E1EQPojLz7kpepnSQI9IyPbHHg1XXXevb5dJI7tpyN2ADxGcQbHG7vcyRHk0cbwqcQriUtg==",
      "license": "MIT"
    },
    "node_modules/scheduler": {
      "version": "0.27.0",
      "resolved": "https://registry.npmjs.org/scheduler/-/scheduler-0.27.0.tgz",
      "integrity": "sha512-eNv+WrVbKu1f3vbYJT/xtiF5syA5HPIMtf9IgY/nKg0sWqzAUEvqY/xm7OcZc/qafLx/iO9FgOmeSAp4v5ti/Q==",
      "license": "MIT"
    },
    "node_modules/semver": {
      "version": "6.3.1",
      "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz",
      "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      }
    },
    "node_modules/send": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/send/-/send-1.2.1.tgz",
      "integrity": "sha512-1gnZf7DFcoIcajTjTwjwuDjzuz4PPcY2StKPlsGAQ1+YH20IRVrBaXSWmdjowTJ6u8Rc01PoYOGHXfP1mYcZNQ==",
      "license": "MIT",
      "dependencies": {
        "debug": "^4.4.3",
        "encodeurl": "^2.0.0",
        "escape-html": "^1.0.3",
        "etag": "^1.8.1",
        "fresh": "^2.0.0",
        "http-errors": "^2.0.1",
        "mime-types": "^3.0.2",
        "ms": "^2.1.3",
        "on-finished": "^2.4.1",
        "range-parser": "^1.2.1",
        "statuses": "^2.0.2"
      },
      "engines": {
        "node": ">= 18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/serve-static": {
      "version": "2.2.1",
      "resolved": "https://registry.npmjs.org/serve-static/-/serve-static-2.2.1.tgz",
      "integrity": "sha512-xRXBn0pPqQTVQiC8wyQrKs2MOlX24zQ0POGaj0kultvoOCstBQM5yvOhAVSUwOMjQtTvsPWoNCHfPGwaaQJhTw==",
      "license": "MIT",
      "dependencies": {
        "encodeurl": "^2.0.0",
        "escape-html": "^1.0.3",
        "parseurl": "^1.3.3",
        "send": "^1.2.0"
      },
      "engines": {
        "node": ">= 18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/set-cookie-parser": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/set-cookie-parser/-/set-cookie-parser-3.1.0.tgz",
      "integrity": "sha512-kjnC1DXBHcxaOaOXBHBeRtltsDG2nUiUni+jP92M9gYdW12rsmx92UsfpH7o5tDRs7I1ZZPSQJQGv3UaRfCiuw==",
      "license": "MIT"
    },
    "node_modules/set-function-length": {
      "version": "1.2.2",
      "resolved": "https://registry.npmjs.org/set-function-length/-/set-function-length-1.2.2.tgz",
      "integrity": "sha512-pgRc4hJ4/sNjWCSS9AmnS40x3bNMDTknHgL5UaMBTMyJnU90EgWh1Rz+MC9eFu4BuN/UwZjKQuY/1v3rM7HMfg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "define-data-property": "^1.1.4",
        "es-errors": "^1.3.0",
        "function-bind": "^1.1.2",
        "get-intrinsic": "^1.2.4",
        "gopd": "^1.0.1",
        "has-property-descriptors": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/set-function-name": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/set-function-name/-/set-function-name-2.0.2.tgz",
      "integrity": "sha512-7PGFlmtwsEADb0WYyvCMa1t+yke6daIG4Wirafur5kcf+MhUnPms1UeR0CKQdTZD81yESwMHbtn+TR+dMviakQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "define-data-property": "^1.1.4",
        "es-errors": "^1.3.0",
        "functions-have-names": "^1.2.3",
        "has-property-descriptors": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/set-proto": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/set-proto/-/set-proto-1.0.0.tgz",
      "integrity": "sha512-RJRdvCo6IAnPdsvP/7m6bsQqNnn1FCBX5ZNtFL98MmFF/4xAIJTIg1YbHW5DC2W5SKZanrC6i4HsJqlajw/dZw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "dunder-proto": "^1.0.1",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/setprototypeof": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/setprototypeof/-/setprototypeof-1.2.0.tgz",
      "integrity": "sha512-E5LDX7Wrp85Kil5bhZv46j8jOeboKq5JMmYM3gVGdGH8xFpPWXUMsNrlODCrkoxMEeNi/XZIwuRvY4XNwYMJpw==",
      "license": "ISC"
    },
    "node_modules/shadcn": {
      "version": "4.6.0",
      "resolved": "https://registry.npmjs.org/shadcn/-/shadcn-4.6.0.tgz",
      "integrity": "sha512-4XeMwFf8ZZxmqQQp+U+Nsq2M+cY4Da8Joo/EaMdHVc4uVuWSTJoeidlZ3gDjyxXCjYB1FLcxYwR4lYQAH8emOg==",
      "license": "MIT",
      "dependencies": {
        "@babel/core": "^7.28.0",
        "@babel/parser": "^7.28.0",
        "@babel/plugin-transform-typescript": "^7.28.0",
        "@babel/preset-typescript": "^7.27.1",
        "@dotenvx/dotenvx": "^1.48.4",
        "@modelcontextprotocol/sdk": "^1.26.0",
        "@types/validate-npm-package-name": "^4.0.2",
        "browserslist": "^4.26.2",
        "commander": "^14.0.0",
        "cosmiconfig": "^9.0.0",
        "dedent": "^1.6.0",
        "deepmerge": "^4.3.1",
        "diff": "^8.0.2",
        "execa": "^9.6.0",
        "fast-glob": "^3.3.3",
        "fs-extra": "^11.3.1",
        "fuzzysort": "^3.1.0",
        "https-proxy-agent": "^7.0.6",
        "kleur": "^4.1.5",
        "msw": "^2.10.4",
        "node-fetch": "^3.3.2",
        "open": "^11.0.0",
        "ora": "^8.2.0",
        "postcss": "^8.5.6",
        "postcss-selector-parser": "^7.1.0",
        "prompts": "^2.4.2",
        "recast": "^0.23.11",
        "stringify-object": "^5.0.0",
        "tailwind-merge": "^3.0.1",
        "ts-morph": "^26.0.0",
        "tsconfig-paths": "^4.2.0",
        "validate-npm-package-name": "^7.0.1",
        "zod": "^3.24.1",
        "zod-to-json-schema": "^3.24.6"
      },
      "bin": {
        "shadcn": "dist/index.js"
      }
    },
    "node_modules/shadcn/node_modules/diff": {
      "version": "8.0.4",
      "resolved": "https://registry.npmjs.org/diff/-/diff-8.0.4.tgz",
      "integrity": "sha512-DPi0FmjiSU5EvQV0++GFDOJ9ASQUVFh5kD+OzOnYdi7n3Wpm9hWWGfB/O2blfHcMVTL5WkQXSnRiK9makhrcnw==",
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=0.3.1"
      }
    },
    "node_modules/shadcn/node_modules/fast-glob": {
      "version": "3.3.3",
      "resolved": "https://registry.npmjs.org/fast-glob/-/fast-glob-3.3.3.tgz",
      "integrity": "sha512-7MptL8U0cqcFdzIzwOTHoilX9x5BrNqye7Z/LuC7kCMRio1EMSyqRK3BEAUD7sXRq4iT4AzTVuZdhgQ2TCvYLg==",
      "license": "MIT",
      "dependencies": {
        "@nodelib/fs.stat": "^2.0.2",
        "@nodelib/fs.walk": "^1.2.3",
        "glob-parent": "^5.1.2",
        "merge2": "^1.3.0",
        "micromatch": "^4.0.8"
      },
      "engines": {
        "node": ">=8.6.0"
      }
    },
    "node_modules/shadcn/node_modules/glob-parent": {
      "version": "5.1.2",
      "resolved": "https://registry.npmjs.org/glob-parent/-/glob-parent-5.1.2.tgz",
      "integrity": "sha512-AOIgSQCepiJYwP3ARnGx+5VnTu2HBYdzbGP45eLw1vr3zB3vZLeyed1sC9hnbcOc9/SrMyM5RPQrkGz4aS9Zow==",
      "license": "ISC",
      "dependencies": {
        "is-glob": "^4.0.1"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/shadcn/node_modules/tsconfig-paths": {
      "version": "4.2.0",
      "resolved": "https://registry.npmjs.org/tsconfig-paths/-/tsconfig-paths-4.2.0.tgz",
      "integrity": "sha512-NoZ4roiN7LnbKn9QqE1amc9DJfzvZXxF4xDavcOWt1BPkdx+m+0gJuPM+S0vCe7zTJMYUP0R8pO2XMr+Y8oLIg==",
      "license": "MIT",
      "dependencies": {
        "json5": "^2.2.2",
        "minimist": "^1.2.6",
        "strip-bom": "^3.0.0"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/shadcn/node_modules/zod": {
      "version": "3.25.76",
      "resolved": "https://registry.npmjs.org/zod/-/zod-3.25.76.tgz",
      "integrity": "sha512-gzUt/qt81nXsFGKIFcC3YnfEAx5NkunCfnDlvuBSSFS02bcXu4Lmea0AFIUwbLWxWPx3d9p8S5QoaujKcNQxcQ==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/colinhacks"
      }
    },
    "node_modules/sharp": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/sharp/-/sharp-0.34.5.tgz",
      "integrity": "sha512-Ou9I5Ft9WNcCbXrU9cMgPBcCK8LiwLqcbywW3t4oDV37n1pzpuNLsYiAV8eODnjbtQlSDwZ2cUEeQz4E54Hltg==",
      "hasInstallScript": true,
      "license": "Apache-2.0",
      "optional": true,
      "dependencies": {
        "@img/colour": "^1.0.0",
        "detect-libc": "^2.1.2",
        "semver": "^7.7.3"
      },
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-darwin-arm64": "0.34.5",
        "@img/sharp-darwin-x64": "0.34.5",
        "@img/sharp-libvips-darwin-arm64": "1.2.4",
        "@img/sharp-libvips-darwin-x64": "1.2.4",
        "@img/sharp-libvips-linux-arm": "1.2.4",
        "@img/sharp-libvips-linux-arm64": "1.2.4",
        "@img/sharp-libvips-linux-ppc64": "1.2.4",
        "@img/sharp-libvips-linux-riscv64": "1.2.4",
        "@img/sharp-libvips-linux-s390x": "1.2.4",
        "@img/sharp-libvips-linux-x64": "1.2.4",
        "@img/sharp-libvips-linuxmusl-arm64": "1.2.4",
        "@img/sharp-libvips-linuxmusl-x64": "1.2.4",
        "@img/sharp-linux-arm": "0.34.5",
        "@img/sharp-linux-arm64": "0.34.5",
        "@img/sharp-linux-ppc64": "0.34.5",
        "@img/sharp-linux-riscv64": "0.34.5",
        "@img/sharp-linux-s390x": "0.34.5",
        "@img/sharp-linux-x64": "0.34.5",
        "@img/sharp-linuxmusl-arm64": "0.34.5",
        "@img/sharp-linuxmusl-x64": "0.34.5",
        "@img/sharp-wasm32": "0.34.5",
        "@img/sharp-win32-arm64": "0.34.5",
        "@img/sharp-win32-ia32": "0.34.5",
        "@img/sharp-win32-x64": "0.34.5"
      }
    },
    "node_modules/sharp/node_modules/semver": {
      "version": "7.7.4",
      "resolved": "https://registry.npmjs.org/semver/-/semver-7.7.4.tgz",
      "integrity": "sha512-vFKC2IEtQnVhpT78h1Yp8wzwrf8CM+MzKMHGJZfBtzhZNycRFnXsHk6E5TxIkkMsgNS7mdX3AGB7x2QM2di4lA==",
      "license": "ISC",
      "optional": true,
      "bin": {
        "semver": "bin/semver.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/shebang-command": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/shebang-command/-/shebang-command-2.0.0.tgz",
      "integrity": "sha512-kHxr2zZpYtdmrN1qDjrrX/Z1rR1kG8Dx+gkpK1G4eXmvXswmcE1hTWBWYUzlraYw1/yZp6YuDY77YtvbN0dmDA==",
      "license": "MIT",
      "dependencies": {
        "shebang-regex": "^3.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/shebang-regex": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/shebang-regex/-/shebang-regex-3.0.0.tgz",
      "integrity": "sha512-7++dFhtcx3353uBaq8DDR4NuxBetBzC7ZQOhmTQInHEd6bSrXdiEyzCvG07Z44UYdLShWUyXt5M/yhz8ekcb1A==",
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/side-channel": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/side-channel/-/side-channel-1.1.0.tgz",
      "integrity": "sha512-ZX99e6tRweoUXqR+VBrslhda51Nh5MTQwou5tnUDgbtyM0dBgmhEDtWGP/xbKn6hqfPRHujUNwz5fy/wbbhnpw==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "object-inspect": "^1.13.3",
        "side-channel-list": "^1.0.0",
        "side-channel-map": "^1.0.1",
        "side-channel-weakmap": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-list": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/side-channel-list/-/side-channel-list-1.0.1.tgz",
      "integrity": "sha512-mjn/0bi/oUURjc5Xl7IaWi/OJJJumuoJFQJfDDyO46+hBWsfaVM65TBHq2eoZBhzl9EchxOijpkbRC8SVBQU0w==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "object-inspect": "^1.13.4"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-map": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/side-channel-map/-/side-channel-map-1.0.1.tgz",
      "integrity": "sha512-VCjCNfgMsby3tTdo02nbjtM/ewra6jPHmpThenkTYh8pG9ucZ/1P8So4u4FGBek/BjpOVsDCMoLA/iuBKIFXRA==",
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.5",
        "object-inspect": "^1.13.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-weakmap": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/side-channel-weakmap/-/side-channel-weakmap-1.0.2.tgz",
      "integrity": "sha512-WPS/HvHQTYnHisLo9McqBHOJk2FkHO/tlpvldyrnem4aeQp4hai3gythswg6p01oSoTl58rcpiFAjF2br2Ak2A==",
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.5",
        "object-inspect": "^1.13.3",
        "side-channel-map": "^1.0.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/signal-exit": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/signal-exit/-/signal-exit-4.1.0.tgz",
      "integrity": "sha512-bzyZ1e88w9O1iNJbKnOlvYTrWPDl46O1bG0D3XInv+9tkPrxrN8jUUTiFlDkkmKWgn1M6CfIA13SuGqOa9Korw==",
      "license": "ISC",
      "engines": {
        "node": ">=14"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/sisteransi": {
      "version": "1.0.5",
      "resolved": "https://registry.npmjs.org/sisteransi/-/sisteransi-1.0.5.tgz",
      "integrity": "sha512-bLGGlR1QxBcynn2d5YmDX4MGjlZvy2MRBDRNHLJ8VI6l6+9FUiyTFNJ0IveOSP0bcXgVDPRcfGqA0pjaqUpfVg==",
      "license": "MIT"
    },
    "node_modules/source-map": {
      "version": "0.6.1",
      "resolved": "https://registry.npmjs.org/source-map/-/source-map-0.6.1.tgz",
      "integrity": "sha512-UjgapumWlbMhkBgzT7Ykc5YXUT46F0iKu8SGXq0bcwP5dz/h0Plj6enJqjz1Zbq2l5WaqYnrVbwWOWMyF3F47g==",
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/source-map-js": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/source-map-js/-/source-map-js-1.2.1.tgz",
      "integrity": "sha512-UXWMKhLOwVKb728IUtQPXxfYU+usdybtUrK/8uGE8CQMvrhOpwvzDBwj0QhSL7MQc7vIsISBG8VQ8+IDQxpfQA==",
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/space-separated-tokens": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/space-separated-tokens/-/space-separated-tokens-2.0.2.tgz",
      "integrity": "sha512-PEGlAwrG8yXGXRjW32fGbg66JAlOAwbObuqVoJpv/mRgoWDQfgH1wDPvtzWyUSNAXBGSk8h755YDbbcEy3SH2Q==",
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/stable-hash": {
      "version": "0.0.5",
      "resolved": "https://registry.npmjs.org/stable-hash/-/stable-hash-0.0.5.tgz",
      "integrity": "sha512-+L3ccpzibovGXFK+Ap/f8LOS0ahMrHTf3xu7mMLSpEGU0EO9ucaysSylKo9eRDFNhWve/y275iPmIZ4z39a9iA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/statuses": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/statuses/-/statuses-2.0.2.tgz",
      "integrity": "sha512-DvEy55V3DB7uknRo+4iOGT5fP1slR8wQohVdknigZPMpMstaKJQWhwiYBACJE3Ul2pTnATihhBYnRhZQHGBiRw==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/stdin-discarder": {
      "version": "0.2.2",
      "resolved": "https://registry.npmjs.org/stdin-discarder/-/stdin-discarder-0.2.2.tgz",
      "integrity": "sha512-UhDfHmA92YAlNnCfhmq0VeNL5bDbiZGg7sZ2IvPsXubGkiNa9EC+tUTsjBRsYUAz87btI6/1wf4XoVvQ3uRnmQ==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/stop-iteration-iterator": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/stop-iteration-iterator/-/stop-iteration-iterator-1.1.0.tgz",
      "integrity": "sha512-eLoXW/DHyl62zxY4SCaIgnRhuMr6ri4juEYARS8E6sCEqzKpOiE521Ucofdx+KnDZl5xmvGYaaKCk5FEOxJCoQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "internal-slot": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/strict-event-emitter": {
      "version": "0.5.1",
      "resolved": "https://registry.npmjs.org/strict-event-emitter/-/strict-event-emitter-0.5.1.tgz",
      "integrity": "sha512-vMgjE/GGEPEFnhFub6pa4FmJBRBVOLpIII2hvCZ8Kzb7K0hlHo7mQv6xYrBvCL2LtAIBwFUK8wvuJgTVSQ5MFQ==",
      "license": "MIT"
    },
    "node_modules/string-width": {
      "version": "7.2.0",
      "resolved": "https://registry.npmjs.org/string-width/-/string-width-7.2.0.tgz",
      "integrity": "sha512-tsaTIkKW9b4N+AEj+SVA+WhJzV7/zMhcSu78mLKWSk7cXMOSHsBKFWUs0fWwq8QyK3MgJBQRX6Gbi4kYbdvGkQ==",
      "license": "MIT",
      "dependencies": {
        "emoji-regex": "^10.3.0",
        "get-east-asian-width": "^1.0.0",
        "strip-ansi": "^7.1.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/string-width/node_modules/emoji-regex": {
      "version": "10.6.0",
      "resolved": "https://registry.npmjs.org/emoji-regex/-/emoji-regex-10.6.0.tgz",
      "integrity": "sha512-toUI84YS5YmxW219erniWD0CIVOo46xGKColeNQRgOzDorgBi1v4D71/OFzgD9GO2UGKIv1C3Sp8DAn0+j5w7A==",
      "license": "MIT"
    },
    "node_modules/string.prototype.includes": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/string.prototype.includes/-/string.prototype.includes-2.0.1.tgz",
      "integrity": "sha512-o7+c9bW6zpAdJHTtujeePODAhkuicdAryFsfVKwA+wGw89wJ4GTY484WTucM9hLtDEOpOvI+aHnzqnC5lHp4Rg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.7",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.3"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/string.prototype.matchall": {
      "version": "4.0.12",
      "resolved": "https://registry.npmjs.org/string.prototype.matchall/-/string.prototype.matchall-4.0.12.tgz",
      "integrity": "sha512-6CC9uyBL+/48dYizRf7H7VAYCMCNTBeM78x/VTUe9bFEaxBepPJDa1Ow99LqI/1yF7kuy7Q3cQsYMrcjGUcskA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "call-bound": "^1.0.3",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.6",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.0.0",
        "get-intrinsic": "^1.2.6",
        "gopd": "^1.2.0",
        "has-symbols": "^1.1.0",
        "internal-slot": "^1.1.0",
        "regexp.prototype.flags": "^1.5.3",
        "set-function-name": "^2.0.2",
        "side-channel": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/string.prototype.repeat": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/string.prototype.repeat/-/string.prototype.repeat-1.0.0.tgz",
      "integrity": "sha512-0u/TldDbKD8bFCQ/4f5+mNRrXwZ8hg2w7ZR8wa16e8z9XpePWl3eGEcUD0OXpEH/VJH/2G3gjUtR3ZOiBe2S/w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "define-properties": "^1.1.3",
        "es-abstract": "^1.17.5"
      }
    },
    "node_modules/string.prototype.trim": {
      "version": "1.2.10",
      "resolved": "https://registry.npmjs.org/string.prototype.trim/-/string.prototype.trim-1.2.10.tgz",
      "integrity": "sha512-Rs66F0P/1kedk5lyYyH9uBzuiI/kNRmwJAR9quK6VOtIpZ2G+hMZd+HQbbv25MgCA6gEffoMZYxlTod4WcdrKA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "call-bound": "^1.0.2",
        "define-data-property": "^1.1.4",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.5",
        "es-object-atoms": "^1.0.0",
        "has-property-descriptors": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/string.prototype.trimend": {
      "version": "1.0.9",
      "resolved": "https://registry.npmjs.org/string.prototype.trimend/-/string.prototype.trimend-1.0.9.tgz",
      "integrity": "sha512-G7Ok5C6E/j4SGfyLCloXTrngQIQU3PWtXGst3yM7Bea9FRURf1S42ZHlZZtsNque2FN2PoUhfZXYLNWwEr4dLQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "call-bound": "^1.0.2",
        "define-properties": "^1.2.1",
        "es-object-atoms": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/string.prototype.trimstart": {
      "version": "1.0.8",
      "resolved": "https://registry.npmjs.org/string.prototype.trimstart/-/string.prototype.trimstart-1.0.8.tgz",
      "integrity": "sha512-UXSH262CSZY1tfu3G3Secr6uGLCFVPMhIqHjlgCUtCCcgihYc/xKs9djMTMUOb2j1mVSeU8EU6NWc/iQKU6Gfg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.7",
        "define-properties": "^1.2.1",
        "es-object-atoms": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/stringify-entities": {
      "version": "4.0.4",
      "resolved": "https://registry.npmjs.org/stringify-entities/-/stringify-entities-4.0.4.tgz",
      "integrity": "sha512-IwfBptatlO+QCJUo19AqvrPNqlVMpW9YEL2LIVY+Rpv2qsjCGxaDLNRgeGsQWJhfItebuJhsGSLjaBbNSQ+ieg==",
      "license": "MIT",
      "dependencies": {
        "character-entities-html4": "^2.0.0",
        "character-entities-legacy": "^3.0.0"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/stringify-object": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/stringify-object/-/stringify-object-5.0.0.tgz",
      "integrity": "sha512-zaJYxz2FtcMb4f+g60KsRNFOpVMUyuJgA51Zi5Z1DOTC3S59+OQiVOzE9GZt0x72uBGWKsQIuBKeF9iusmKFsg==",
      "license": "BSD-2-Clause",
      "dependencies": {
        "get-own-enumerable-keys": "^1.0.0",
        "is-obj": "^3.0.0",
        "is-regexp": "^3.1.0"
      },
      "engines": {
        "node": ">=14.16"
      },
      "funding": {
        "url": "https://github.com/yeoman/stringify-object?sponsor=1"
      }
    },
    "node_modules/strip-ansi": {
      "version": "7.2.0",
      "resolved": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-7.2.0.tgz",
      "integrity": "sha512-yDPMNjp4WyfYBkHnjIRLfca1i6KMyGCtsVgoKe/z1+6vukgaENdgGBZt+ZmKPc4gavvEZ5OgHfHdrazhgNyG7w==",
      "license": "MIT",
      "dependencies": {
        "ansi-regex": "^6.2.2"
      },
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/chalk/strip-ansi?sponsor=1"
      }
    },
    "node_modules/strip-bom": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/strip-bom/-/strip-bom-3.0.0.tgz",
      "integrity": "sha512-vavAMRXOgBVNF6nyEEmL3DBK19iRpDcoIwW+swQ+CbGiu7lju6t+JklA1MHweoWtadgt4ISVUsXLyDq34ddcwA==",
      "license": "MIT",
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/strip-final-newline": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/strip-final-newline/-/strip-final-newline-4.0.0.tgz",
      "integrity": "sha512-aulFJcD6YK8V1G7iRB5tigAP4TsHBZZrOV8pjV++zdUwmeV8uzbY7yn6h9MswN62adStNZFuCIx4haBnRuMDaw==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/strip-json-comments": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/strip-json-comments/-/strip-json-comments-3.1.1.tgz",
      "integrity": "sha512-6fPc+R4ihwqP6N/aIv2f1gMH8lOVtWQHoqC4yK6oSDVVocumAsfCqjkXnqiYMhmMwS/mEHLp7Vehlt3ql6lEig==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/style-to-js": {
      "version": "1.1.21",
      "resolved": "https://registry.npmjs.org/style-to-js/-/style-to-js-1.1.21.tgz",
      "integrity": "sha512-RjQetxJrrUJLQPHbLku6U/ocGtzyjbJMP9lCNK7Ag0CNh690nSH8woqWH9u16nMjYBAok+i7JO1NP2pOy8IsPQ==",
      "license": "MIT",
      "dependencies": {
        "style-to-object": "1.0.14"
      }
    },
    "node_modules/style-to-object": {
      "version": "1.0.14",
      "resolved": "https://registry.npmjs.org/style-to-object/-/style-to-object-1.0.14.tgz",
      "integrity": "sha512-LIN7rULI0jBscWQYaSswptyderlarFkjQ+t79nzty8tcIAceVomEVlLzH5VP4Cmsv6MtKhs7qaAiwlcp+Mgaxw==",
      "license": "MIT",
      "dependencies": {
        "inline-style-parser": "0.2.7"
      }
    },
    "node_modules/styled-jsx": {
      "version": "5.1.6",
      "resolved": "https://registry.npmjs.org/styled-jsx/-/styled-jsx-5.1.6.tgz",
      "integrity": "sha512-qSVyDTeMotdvQYoHWLNGwRFJHC+i+ZvdBRYosOFgC+Wg1vx4frN2/RG/NA7SYqqvKNLf39P2LSRA2pu6n0XYZA==",
      "license": "MIT",
      "dependencies": {
        "client-only": "0.0.1"
      },
      "engines": {
        "node": ">= 12.0.0"
      },
      "peerDependencies": {
        "react": ">= 16.8.0 || 17.x.x || ^18.0.0-0 || ^19.0.0-0"
      },
      "peerDependenciesMeta": {
        "@babel/core": {
          "optional": true
        },
        "babel-plugin-macros": {
          "optional": true
        }
      }
    },
    "node_modules/supports-color": {
      "version": "7.2.0",
      "resolved": "https://registry.npmjs.org/supports-color/-/supports-color-7.2.0.tgz",
      "integrity": "sha512-qpCAvRl9stuOHveKsn7HncJRvv501qIacKzQlO/+Lwxc9+0q2wLyv4Dfvt80/DPn2pqOBsJdDiogXGR9+OvwRw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "has-flag": "^4.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/supports-preserve-symlinks-flag": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/supports-preserve-symlinks-flag/-/supports-preserve-symlinks-flag-1.0.0.tgz",
      "integrity": "sha512-ot0WnXS9fgdkgIcePe6RHNk1WA8+muPa6cSjeR3V8K27q9BB1rTE3R1p7Hv0z1ZyAc8s6Vvv8DIyWf681MAt0w==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/tagged-tag": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/tagged-tag/-/tagged-tag-1.0.0.tgz",
      "integrity": "sha512-yEFYrVhod+hdNyx7g5Bnkkb0G6si8HJurOoOEgC8B/O0uXLHlaey/65KRv6cuWBNhBgHKAROVpc7QyYqE5gFng==",
      "license": "MIT",
      "engines": {
        "node": ">=20"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/tailwind-merge": {
      "version": "3.5.0",
      "resolved": "https://registry.npmjs.org/tailwind-merge/-/tailwind-merge-3.5.0.tgz",
      "integrity": "sha512-I8K9wewnVDkL1NTGoqWmVEIlUcB9gFriAEkXkfCjX5ib8ezGxtR3xD7iZIxrfArjEsH7F1CHD4RFUtxefdqV/A==",
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/dcastil"
      }
    },
    "node_modules/tailwindcss": {
      "version": "4.2.4",
      "resolved": "https://registry.npmjs.org/tailwindcss/-/tailwindcss-4.2.4.tgz",
      "integrity": "sha512-HhKppgO81FQof5m6TEnuBWCZGgfRAWbaeOaGT00KOy/Pf/j6oUihdvBpA7ltCeAvZpFhW3j0PTclkxsd4IXYDA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/tapable": {
      "version": "2.3.3",
      "resolved": "https://registry.npmjs.org/tapable/-/tapable-2.3.3.tgz",
      "integrity": "sha512-uxc/zpqFg6x7C8vOE7lh6Lbda8eEL9zmVm/PLeTPBRhh1xCgdWaQ+J1CUieGpIfm2HdtsUpRv+HshiasBMcc6A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/webpack"
      }
    },
    "node_modules/tiny-invariant": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/tiny-invariant/-/tiny-invariant-1.3.3.tgz",
      "integrity": "sha512-+FbBPE1o9QAYvviau/qC5SE3caw21q3xkvWKBtja5vgqOWIHHJ3ioaq1VPfn/Szqctz2bU/oYeKd9/z5BL+PVg==",
      "license": "MIT"
    },
    "node_modules/tinycolor2": {
      "version": "1.6.0",
      "resolved": "https://registry.npmjs.org/tinycolor2/-/tinycolor2-1.6.0.tgz",
      "integrity": "sha512-XPaBkWQJdsf3pLKJV9p4qN/S+fm2Oj8AIPo1BTUhg5oxkvm9+SVEGFdhyOz7tTdUTfvxMiAs4sp6/eZO2Ew+pw==",
      "license": "MIT"
    },
    "node_modules/tinyglobby": {
      "version": "0.2.16",
      "resolved": "https://registry.npmjs.org/tinyglobby/-/tinyglobby-0.2.16.tgz",
      "integrity": "sha512-pn99VhoACYR8nFHhxqix+uvsbXineAasWm5ojXoN8xEwK5Kd3/TrhNn1wByuD52UxWRLy8pu+kRMniEi6Eq9Zg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fdir": "^6.5.0",
        "picomatch": "^4.0.4"
      },
      "engines": {
        "node": ">=12.0.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/SuperchupuDev"
      }
    },
    "node_modules/tinyglobby/node_modules/fdir": {
      "version": "6.5.0",
      "resolved": "https://registry.npmjs.org/fdir/-/fdir-6.5.0.tgz",
      "integrity": "sha512-tIbYtZbucOs0BRGqPJkshJUYdL+SDH7dVM8gjy+ERp3WAUjLEFJE+02kanyHtwjWOnwrKYBiwAmM0p4kLJAnXg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12.0.0"
      },
      "peerDependencies": {
        "picomatch": "^3 || ^4"
      },
      "peerDependenciesMeta": {
        "picomatch": {
          "optional": true
        }
      }
    },
    "node_modules/tinyglobby/node_modules/picomatch": {
      "version": "4.0.4",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-4.0.4.tgz",
      "integrity": "sha512-QP88BAKvMam/3NxH6vj2o21R6MjxZUAd6nlwAS/pnGvN9IVLocLHxGYIzFhg6fUQ+5th6P4dv4eW9jX3DSIj7A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/tldts": {
      "version": "7.0.29",
      "resolved": "https://registry.npmjs.org/tldts/-/tldts-7.0.29.tgz",
      "integrity": "sha512-JIXCerhudr/N6OWLwLF1HVsTTUo7ry6qHa5eWZEkiMuxsIiAACL55tGLfqfHfoH7QaMQUW8fngD7u7TxWexYQg==",
      "license": "MIT",
      "dependencies": {
        "tldts-core": "^7.0.29"
      },
      "bin": {
        "tldts": "bin/cli.js"
      }
    },
    "node_modules/tldts-core": {
      "version": "7.0.29",
      "resolved": "https://registry.npmjs.org/tldts-core/-/tldts-core-7.0.29.tgz",
      "integrity": "sha512-W99NuU7b1DcG3uJ3v9k9VztCH3WialNbBkBft5wCs8V8mexu0XQqaZEYb9l9RNNzK8+3EJ9PKWB0/RUtTQ/o+Q==",
      "license": "MIT"
    },
    "node_modules/to-regex-range": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/to-regex-range/-/to-regex-range-5.0.1.tgz",
      "integrity": "sha512-65P7iz6X5yEr1cwcgvQxbbIw7Uk3gOy5dIdtZ4rDveLqhrdJP+Li/Hx6tyK0NEb+2GCyneCMJiGqrADCSNk8sQ==",
      "license": "MIT",
      "dependencies": {
        "is-number": "^7.0.0"
      },
      "engines": {
        "node": ">=8.0"
      }
    },
    "node_modules/toidentifier": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/toidentifier/-/toidentifier-1.0.1.tgz",
      "integrity": "sha512-o5sSPKEkg/DIQNmH43V0/uerLrpzVedkUh8tGNvaeXpfpuwjKenlSox/2O/BTlZUtEe+JG7s5YhEz608PlAHRA==",
      "license": "MIT",
      "engines": {
        "node": ">=0.6"
      }
    },
    "node_modules/tough-cookie": {
      "version": "6.0.1",
      "resolved": "https://registry.npmjs.org/tough-cookie/-/tough-cookie-6.0.1.tgz",
      "integrity": "sha512-LktZQb3IeoUWB9lqR5EWTHgW/VTITCXg4D21M+lvybRVdylLrRMnqaIONLVb5mav8vM19m44HIcGq4qASeu2Qw==",
      "license": "BSD-3-Clause",
      "dependencies": {
        "tldts": "^7.0.5"
      },
      "engines": {
        "node": ">=16"
      }
    },
    "node_modules/trim-lines": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/trim-lines/-/trim-lines-3.0.1.tgz",
      "integrity": "sha512-kRj8B+YHZCc9kQYdWfJB2/oUl9rA99qbowYYBtr4ui4mZyAQ2JpvVBd/6U2YloATfqBhBTSMhTpgBHtU0Mf3Rg==",
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/trough": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/trough/-/trough-2.2.0.tgz",
      "integrity": "sha512-tmMpK00BjZiUyVyvrBK7knerNgmgvcV/KLVyuma/SC+TQN167GrMRciANTz09+k3zW8L8t60jWO1GpfkZdjTaw==",
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    },
    "node_modules/ts-api-utils": {
      "version": "2.5.0",
      "resolved": "https://registry.npmjs.org/ts-api-utils/-/ts-api-utils-2.5.0.tgz",
      "integrity": "sha512-OJ/ibxhPlqrMM0UiNHJ/0CKQkoKF243/AEmplt3qpRgkW8VG7IfOS41h7V8TjITqdByHzrjcS/2si+y4lIh8NA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18.12"
      },
      "peerDependencies": {
        "typescript": ">=4.8.4"
      }
    },
    "node_modules/ts-morph": {
      "version": "26.0.0",
      "resolved": "https://registry.npmjs.org/ts-morph/-/ts-morph-26.0.0.tgz",
      "integrity": "sha512-ztMO++owQnz8c/gIENcM9XfCEzgoGphTv+nKpYNM1bgsdOVC/jRZuEBf6N+mLLDNg68Kl+GgUZfOySaRiG1/Ug==",
      "license": "MIT",
      "dependencies": {
        "@ts-morph/common": "~0.27.0",
        "code-block-writer": "^13.0.3"
      }
    },
    "node_modules/tsconfig-paths": {
      "version": "3.15.0",
      "resolved": "https://registry.npmjs.org/tsconfig-paths/-/tsconfig-paths-3.15.0.tgz",
      "integrity": "sha512-2Ac2RgzDe/cn48GvOe3M+o82pEFewD3UPbyoUHHdKasHwJKjds4fLXWf/Ux5kATBKN20oaFGu+jbElp1pos0mg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/json5": "^0.0.29",
        "json5": "^1.0.2",
        "minimist": "^1.2.6",
        "strip-bom": "^3.0.0"
      }
    },
    "node_modules/tsconfig-paths/node_modules/json5": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/json5/-/json5-1.0.2.tgz",
      "integrity": "sha512-g1MWMLBiz8FKi1e4w0UyVL3w+iJceWAFBAaBnnGKOpNa5f8TLktkbre1+s6oICydWAm+HRUGTmI+//xv2hvXYA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "minimist": "^1.2.0"
      },
      "bin": {
        "json5": "lib/cli.js"
      }
    },
    "node_modules/tslib": {
      "version": "2.8.1",
      "resolved": "https://registry.npmjs.org/tslib/-/tslib-2.8.1.tgz",
      "integrity": "sha512-oJFu94HQb+KVduSUQL7wnpmqnfmLsOA/nAh6b6EH0wCEoK0/mPeXU6c3wKDV83MkOuHPRHtSXKKU99IBazS/2w==",
      "license": "0BSD"
    },
    "node_modules/tw-animate-css": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/tw-animate-css/-/tw-animate-css-1.4.0.tgz",
      "integrity": "sha512-7bziOlRqH0hJx80h/3mbicLW7o8qLsH5+RaLR2t+OHM3D0JlWGODQKQ4cxbK7WlvmUxpcj6Kgu6EKqjrGFe3QQ==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/Wombosvideo"
      }
    },
    "node_modules/type-check": {
      "version": "0.4.0",
      "resolved": "https://registry.npmjs.org/type-check/-/type-check-0.4.0.tgz",
      "integrity": "sha512-XleUoc9uwGXqjWwXaUTZAmzMcFZ5858QA2vvx1Ur5xIcixXIP+8LnFDgRplU30us6teqdlskFfu+ae4K79Ooew==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "prelude-ls": "^1.2.1"
      },
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/type-fest": {
      "version": "5.6.0",
      "resolved": "https://registry.npmjs.org/type-fest/-/type-fest-5.6.0.tgz",
      "integrity": "sha512-8ZiHFm91orbSAe2PSAiSVBVko18pbhbiB3U9GglSzF/zCGkR+rxpHx6sEMCUm4kxY4LjDIUGgCfUMtwfZfjfUA==",
      "license": "(MIT OR CC0-1.0)",
      "dependencies": {
        "tagged-tag": "^1.0.0"
      },
      "engines": {
        "node": ">=20"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/type-is": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/type-is/-/type-is-2.0.1.tgz",
      "integrity": "sha512-OZs6gsjF4vMp32qrCbiVSkrFmXtG/AZhY3t0iAMrMBiAZyV9oALtXO8hsrHbMXF9x6L3grlFuwW2oAz7cav+Gw==",
      "license": "MIT",
      "dependencies": {
        "content-type": "^1.0.5",
        "media-typer": "^1.1.0",
        "mime-types": "^3.0.0"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/typed-array-buffer": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/typed-array-buffer/-/typed-array-buffer-1.0.3.tgz",
      "integrity": "sha512-nAYYwfY3qnzX30IkA6AQZjVbtK6duGontcQm1WSG1MD94YLqK0515GNApXkoxKOWMusVssAHWLh9SeaoefYFGw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "es-errors": "^1.3.0",
        "is-typed-array": "^1.1.14"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/typed-array-byte-length": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/typed-array-byte-length/-/typed-array-byte-length-1.0.3.tgz",
      "integrity": "sha512-BaXgOuIxz8n8pIq3e7Atg/7s+DpiYrxn4vdot3w9KbnBhcRQq6o3xemQdIfynqSeXeDrF32x+WvfzmOjPiY9lg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "for-each": "^0.3.3",
        "gopd": "^1.2.0",
        "has-proto": "^1.2.0",
        "is-typed-array": "^1.1.14"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/typed-array-byte-offset": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/typed-array-byte-offset/-/typed-array-byte-offset-1.0.4.tgz",
      "integrity": "sha512-bTlAFB/FBYMcuX81gbL4OcpH5PmlFHqlCCpAl8AlEzMz5k53oNDvN8p1PNOWLEmI2x4orp3raOFB51tv9X+MFQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "available-typed-arrays": "^1.0.7",
        "call-bind": "^1.0.8",
        "for-each": "^0.3.3",
        "gopd": "^1.2.0",
        "has-proto": "^1.2.0",
        "is-typed-array": "^1.1.15",
        "reflect.getprototypeof": "^1.0.9"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/typed-array-length": {
      "version": "1.0.7",
      "resolved": "https://registry.npmjs.org/typed-array-length/-/typed-array-length-1.0.7.tgz",
      "integrity": "sha512-3KS2b+kL7fsuk/eJZ7EQdnEmQoaho/r6KUef7hxvltNA5DR8NAUM+8wJMbJyZ4G9/7i3v5zPBIMN5aybAh2/Jg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.7",
        "for-each": "^0.3.3",
        "gopd": "^1.0.1",
        "is-typed-array": "^1.1.13",
        "possible-typed-array-names": "^1.0.0",
        "reflect.getprototypeof": "^1.0.6"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/typescript": {
      "version": "5.9.3",
      "resolved": "https://registry.npmjs.org/typescript/-/typescript-5.9.3.tgz",
      "integrity": "sha512-jl1vZzPDinLr9eUt3J/t7V6FgNEw9QjvBPdysz9KfQDD41fQrC2Y4vKQdiaUpFT4bXlb1RHhLpp8wtm6M5TgSw==",
      "devOptional": true,
      "license": "Apache-2.0",
      "bin": {
        "tsc": "bin/tsc",
        "tsserver": "bin/tsserver"
      },
      "engines": {
        "node": ">=14.17"
      }
    },
    "node_modules/typescript-eslint": {
      "version": "8.59.1",
      "resolved": "https://registry.npmjs.org/typescript-eslint/-/typescript-eslint-8.59.1.tgz",
      "integrity": "sha512-xqDcFVBmlrltH64lklOVp1wYxgJr6LVdg3NamBgH2OOQDLFdTKfIZXF5PfghrnXQKXZGTQs8tr1vL7fJvq8CTQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@typescript-eslint/eslint-plugin": "8.59.1",
        "@typescript-eslint/parser": "8.59.1",
        "@typescript-eslint/typescript-estree": "8.59.1",
        "@typescript-eslint/utils": "8.59.1"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      },
      "peerDependencies": {
        "eslint": "^8.57.0 || ^9.0.0 || ^10.0.0",
        "typescript": ">=4.8.4 <6.1.0"
      }
    },
    "node_modules/unbox-primitive": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/unbox-primitive/-/unbox-primitive-1.1.0.tgz",
      "integrity": "sha512-nWJ91DjeOkej/TA8pXQ3myruKpKEYgqvpw9lz4OPHj/NWFNluYrjbz9j01CJ8yKQd2g4jFoOkINCTW2I5LEEyw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "has-bigints": "^1.0.2",
        "has-symbols": "^1.1.0",
        "which-boxed-primitive": "^1.1.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/undici-types": {
      "version": "6.21.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.21.0.tgz",
      "integrity": "sha512-iwDZqg0QAGrg9Rav5H4n0M64c3mkR59cJ6wQp+7C4nI0gsmExaedaYLNO44eT4AtBBwjbTiGPMlt2Md0T9H9JQ==",
      "license": "MIT"
    },
    "node_modules/unicorn-magic": {
      "version": "0.3.0",
      "resolved": "https://registry.npmjs.org/unicorn-magic/-/unicorn-magic-0.3.0.tgz",
      "integrity": "sha512-+QBBXBCvifc56fsbuxZQ6Sic3wqqc3WWaqxs58gvJrcOuN83HGTCwz3oS5phzU9LthRNE9VrJCFCLUgHeeFnfA==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/unified": {
      "version": "11.0.5",
      "resolved": "https://registry.npmjs.org/unified/-/unified-11.0.5.tgz",
      "integrity": "sha512-xKvGhPWw3k84Qjh8bI3ZeJjqnyadK+GEFtazSfZv/rKeTkTjOJho6mFqh2SM96iIcZokxiOpg78GazTSg8+KHA==",
      "license": "MIT",
      "dependencies": {
        "@types/unist": "^3.0.0",
        "bail": "^2.0.0",
        "devlop": "^1.0.0",
        "extend": "^3.0.0",
        "is-plain-obj": "^4.0.0",
        "trough": "^2.0.0",
        "vfile": "^6.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/unist-util-is": {
      "version": "6.0.1",
      "resolved": "https://registry.npmjs.org/unist-util-is/-/unist-util-is-6.0.1.tgz",
      "integrity": "sha512-LsiILbtBETkDz8I9p1dQ0uyRUWuaQzd/cuEeS1hoRSyW5E5XGmTzlwY1OrNzzakGowI9Dr/I8HVaw4hTtnxy8g==",
      "license": "MIT",
      "dependencies": {
        "@types/unist": "^3.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/unist-util-position": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/unist-util-position/-/unist-util-position-5.0.0.tgz",
      "integrity": "sha512-fucsC7HjXvkB5R3kTCO7kUjRdrS0BJt3M/FPxmHMBOm8JQi2BsHAHFsy27E0EolP8rp0NzXsJ+jNPyDWvOJZPA==",
      "license": "MIT",
      "dependencies": {
        "@types/unist": "^3.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/unist-util-stringify-position": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/unist-util-stringify-position/-/unist-util-stringify-position-4.0.0.tgz",
      "integrity": "sha512-0ASV06AAoKCDkS2+xw5RXJywruurpbC4JZSm7nr7MOt1ojAzvyyaO+UxZf18j8FCF6kmzCZKcAgN/yu2gm2XgQ==",
      "license": "MIT",
      "dependencies": {
        "@types/unist": "^3.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/unist-util-visit": {
      "version": "5.1.0",
      "resolved": "https://registry.npmjs.org/unist-util-visit/-/unist-util-visit-5.1.0.tgz",
      "integrity": "sha512-m+vIdyeCOpdr/QeQCu2EzxX/ohgS8KbnPDgFni4dQsfSCtpz8UqDyY5GjRru8PDKuYn7Fq19j1CQ+nJSsGKOzg==",
      "license": "MIT",
      "dependencies": {
        "@types/unist": "^3.0.0",
        "unist-util-is": "^6.0.0",
        "unist-util-visit-parents": "^6.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/unist-util-visit-parents": {
      "version": "6.0.2",
      "resolved": "https://registry.npmjs.org/unist-util-visit-parents/-/unist-util-visit-parents-6.0.2.tgz",
      "integrity": "sha512-goh1s1TBrqSqukSc8wrjwWhL0hiJxgA8m4kFxGlQ+8FYQ3C/m11FcTs4YYem7V664AhHVvgoQLk890Ssdsr2IQ==",
      "license": "MIT",
      "dependencies": {
        "@types/unist": "^3.0.0",
        "unist-util-is": "^6.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/universalify": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/universalify/-/universalify-2.0.1.tgz",
      "integrity": "sha512-gptHNQghINnc/vTGIk0SOFGFNXw7JVrlRUtConJRlvaw6DuX0wO5Jeko9sWrMBhh+PsYAZ7oXAiOnf/UKogyiw==",
      "license": "MIT",
      "engines": {
        "node": ">= 10.0.0"
      }
    },
    "node_modules/unpipe": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/unpipe/-/unpipe-1.0.0.tgz",
      "integrity": "sha512-pjy2bYhSsufwWlKwPc+l3cN7+wuJlK6uz0YdJEOlQDbl6jo/YlPi4mb8agUkVC8BF7V8NuzeyPNqRksA3hztKQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/unrs-resolver": {
      "version": "1.11.1",
      "resolved": "https://registry.npmjs.org/unrs-resolver/-/unrs-resolver-1.11.1.tgz",
      "integrity": "sha512-bSjt9pjaEBnNiGgc9rUiHGKv5l4/TGzDmYw3RhnkJGtLhbnnA/5qJj7x3dNDCRx/PJxu774LlH8lCOlB4hEfKg==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "dependencies": {
        "napi-postinstall": "^0.3.0"
      },
      "funding": {
        "url": "https://opencollective.com/unrs-resolver"
      },
      "optionalDependencies": {
        "@unrs/resolver-binding-android-arm-eabi": "1.11.1",
        "@unrs/resolver-binding-android-arm64": "1.11.1",
        "@unrs/resolver-binding-darwin-arm64": "1.11.1",
        "@unrs/resolver-binding-darwin-x64": "1.11.1",
        "@unrs/resolver-binding-freebsd-x64": "1.11.1",
        "@unrs/resolver-binding-linux-arm-gnueabihf": "1.11.1",
        "@unrs/resolver-binding-linux-arm-musleabihf": "1.11.1",
        "@unrs/resolver-binding-linux-arm64-gnu": "1.11.1",
        "@unrs/resolver-binding-linux-arm64-musl": "1.11.1",
        "@unrs/resolver-binding-linux-ppc64-gnu": "1.11.1",
        "@unrs/resolver-binding-linux-riscv64-gnu": "1.11.1",
        "@unrs/resolver-binding-linux-riscv64-musl": "1.11.1",
        "@unrs/resolver-binding-linux-s390x-gnu": "1.11.1",
        "@unrs/resolver-binding-linux-x64-gnu": "1.11.1",
        "@unrs/resolver-binding-linux-x64-musl": "1.11.1",
        "@unrs/resolver-binding-wasm32-wasi": "1.11.1",
        "@unrs/resolver-binding-win32-arm64-msvc": "1.11.1",
        "@unrs/resolver-binding-win32-ia32-msvc": "1.11.1",
        "@unrs/resolver-binding-win32-x64-msvc": "1.11.1"
      }
    },
    "node_modules/until-async": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/until-async/-/until-async-3.0.2.tgz",
      "integrity": "sha512-IiSk4HlzAMqTUseHHe3VhIGyuFmN90zMTpD3Z3y8jeQbzLIq500MVM7Jq2vUAnTKAFPJrqwkzr6PoTcPhGcOiw==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/kettanaito"
      }
    },
    "node_modules/update-browserslist-db": {
      "version": "1.2.3",
      "resolved": "https://registry.npmjs.org/update-browserslist-db/-/update-browserslist-db-1.2.3.tgz",
      "integrity": "sha512-Js0m9cx+qOgDxo0eMiFGEueWztz+d4+M3rGlmKPT+T4IS/jP4ylw3Nwpu6cpTTP8R1MAC1kF4VbdLt3ARf209w==",
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/browserslist"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "escalade": "^3.2.0",
        "picocolors": "^1.1.1"
      },
      "bin": {
        "update-browserslist-db": "cli.js"
      },
      "peerDependencies": {
        "browserslist": ">= 4.21.0"
      }
    },
    "node_modules/uri-js": {
      "version": "4.4.1",
      "resolved": "https://registry.npmjs.org/uri-js/-/uri-js-4.4.1.tgz",
      "integrity": "sha512-7rKUyy33Q1yc98pQ1DAmLtwX109F7TIfWlW1Ydo8Wl1ii1SeHieeh0HHfPeL2fMXK6z0s8ecKs9frCuLJvndBg==",
      "dev": true,
      "license": "BSD-2-Clause",
      "dependencies": {
        "punycode": "^2.1.0"
      }
    },
    "node_modules/use-sync-external-store": {
      "version": "1.6.0",
      "resolved": "https://registry.npmjs.org/use-sync-external-store/-/use-sync-external-store-1.6.0.tgz",
      "integrity": "sha512-Pp6GSwGP/NrPIrxVFAIkOQeyw8lFenOHijQWkUTrDvrF4ALqylP2C/KCkeS9dpUM3KvYRQhna5vt7IL95+ZQ9w==",
      "license": "MIT",
      "peerDependencies": {
        "react": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0"
      }
    },
    "node_modules/util-deprecate": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/util-deprecate/-/util-deprecate-1.0.2.tgz",
      "integrity": "sha512-EPD5q1uXyFxJpCrLnCc1nHnq3gOa6DZBocAIiI2TaSCA7VCJ1UJDMagCzIkXNsUYfD1daK//LTEQ8xiIbrHtcw==",
      "license": "MIT"
    },
    "node_modules/validate-npm-package-name": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/validate-npm-package-name/-/validate-npm-package-name-7.0.2.tgz",
      "integrity": "sha512-hVDIBwsRruT73PbK7uP5ebUt+ezEtCmzZz3F59BSr2F6OVFnJ/6h8liuvdLrQ88Xmnk6/+xGGuq+pG9WwTuy3A==",
      "license": "ISC",
      "engines": {
        "node": "^20.17.0 || >=22.9.0"
      }
    },
    "node_modules/vary": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/vary/-/vary-1.1.2.tgz",
      "integrity": "sha512-BNGbWLfd0eUPabhkXUVm0j8uuvREyTh5ovRa/dyow/BqAbZJyC+5fU+IzQOzmAKzYqYRAISoRhdQr3eIZ/PXqg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/vfile": {
      "version": "6.0.3",
      "resolved": "https://registry.npmjs.org/vfile/-/vfile-6.0.3.tgz",
      "integrity": "sha512-KzIbH/9tXat2u30jf+smMwFCsno4wHVdNmzFyL+T/L3UGqqk6JKfVqOFOZEpZSHADH1k40ab6NUIXZq422ov3Q==",
      "license": "MIT",
      "dependencies": {
        "@types/unist": "^3.0.0",
        "vfile-message": "^4.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/vfile-message": {
      "version": "4.0.3",
      "resolved": "https://registry.npmjs.org/vfile-message/-/vfile-message-4.0.3.tgz",
      "integrity": "sha512-QTHzsGd1EhbZs4AsQ20JX1rC3cOlt/IWJruk893DfLRr57lcnOeMaWG4K0JrRta4mIJZKth2Au3mM3u03/JWKw==",
      "license": "MIT",
      "dependencies": {
        "@types/unist": "^3.0.0",
        "unist-util-stringify-position": "^4.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/unified"
      }
    },
    "node_modules/web-streams-polyfill": {
      "version": "3.3.3",
      "resolved": "https://registry.npmjs.org/web-streams-polyfill/-/web-streams-polyfill-3.3.3.tgz",
      "integrity": "sha512-d2JWLCivmZYTSIoge9MsgFCZrt571BikcWGYkjC1khllbTeDlGqZ2D8vD8E/lJa8WGWbb7Plm8/XJYV7IJHZZw==",
      "license": "MIT",
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/which": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/which/-/which-2.0.2.tgz",
      "integrity": "sha512-BLI3Tl1TW3Pvl70l3yq3Y64i+awpwXqsGBYWkkqMtnbXgrMD+yj7rhW0kuEDxzJaYXGjEW5ogapKNMEKNMjibA==",
      "license": "ISC",
      "dependencies": {
        "isexe": "^2.0.0"
      },
      "bin": {
        "node-which": "bin/node-which"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/which-boxed-primitive": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/which-boxed-primitive/-/which-boxed-primitive-1.1.1.tgz",
      "integrity": "sha512-TbX3mj8n0odCBFVlY8AxkqcHASw3L60jIuF8jFP78az3C2YhmGvqbHBpAjTRH2/xqYunrJ9g1jSyjCjpoWzIAA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-bigint": "^1.1.0",
        "is-boolean-object": "^1.2.1",
        "is-number-object": "^1.1.1",
        "is-string": "^1.1.1",
        "is-symbol": "^1.1.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/which-builtin-type": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/which-builtin-type/-/which-builtin-type-1.2.1.tgz",
      "integrity": "sha512-6iBczoX+kDQ7a3+YJBnh3T+KZRxM/iYNPXicqk66/Qfm1b93iu+yOImkg0zHbj5LNOcNv1TEADiZ0xa34B4q6Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "function.prototype.name": "^1.1.6",
        "has-tostringtag": "^1.0.2",
        "is-async-function": "^2.0.0",
        "is-date-object": "^1.1.0",
        "is-finalizationregistry": "^1.1.0",
        "is-generator-function": "^1.0.10",
        "is-regex": "^1.2.1",
        "is-weakref": "^1.0.2",
        "isarray": "^2.0.5",
        "which-boxed-primitive": "^1.1.0",
        "which-collection": "^1.0.2",
        "which-typed-array": "^1.1.16"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/which-collection": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/which-collection/-/which-collection-1.0.2.tgz",
      "integrity": "sha512-K4jVyjnBdgvc86Y6BkaLZEN933SwYOuBFkdmBu9ZfkcAbdVbpITnDmjvZ/aQjRXQrv5EPkTnD1s39GiiqbngCw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-map": "^2.0.3",
        "is-set": "^2.0.3",
        "is-weakmap": "^2.0.2",
        "is-weakset": "^2.0.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/which-typed-array": {
      "version": "1.1.20",
      "resolved": "https://registry.npmjs.org/which-typed-array/-/which-typed-array-1.1.20.tgz",
      "integrity": "sha512-LYfpUkmqwl0h9A2HL09Mms427Q1RZWuOHsukfVcKRq9q95iQxdw0ix1JQrqbcDR9PH1QDwf5Qo8OZb5lksZ8Xg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "available-typed-arrays": "^1.0.7",
        "call-bind": "^1.0.8",
        "call-bound": "^1.0.4",
        "for-each": "^0.3.5",
        "get-proto": "^1.0.1",
        "gopd": "^1.2.0",
        "has-tostringtag": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/word-wrap": {
      "version": "1.2.5",
      "resolved": "https://registry.npmjs.org/word-wrap/-/word-wrap-1.2.5.tgz",
      "integrity": "sha512-BN22B5eaMMI9UMtjrGd5g5eCYPpCPDUy0FJXbYsaT5zYxjFOckS53SQDE3pWkVoWpHXVb3BrYcEN4Twa55B5cA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/wrap-ansi": {
      "version": "7.0.0",
      "resolved": "https://registry.npmjs.org/wrap-ansi/-/wrap-ansi-7.0.0.tgz",
      "integrity": "sha512-YVGIj2kamLSTxw6NsZjoBxfSwsn0ycdesmc4p+Q21c5zPuZ1pl+NfxVdxPtdHvmNVOQ6XSYG4AUtyt/Fi7D16Q==",
      "license": "MIT",
      "dependencies": {
        "ansi-styles": "^4.0.0",
        "string-width": "^4.1.0",
        "strip-ansi": "^6.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/chalk/wrap-ansi?sponsor=1"
      }
    },
    "node_modules/wrap-ansi/node_modules/ansi-regex": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/ansi-regex/-/ansi-regex-5.0.1.tgz",
      "integrity": "sha512-quJQXlTSUGL2LH9SUXo8VwsY4soanhgo6LNSm84E1LBcE8s3O0wpdiRzyR9z/ZZJMlMWv37qOOb9pdJlMUEKFQ==",
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/wrap-ansi/node_modules/emoji-regex": {
      "version": "8.0.0",
      "resolved": "https://registry.npmjs.org/emoji-regex/-/emoji-regex-8.0.0.tgz",
      "integrity": "sha512-MSjYzcWNOA0ewAHpz0MxpYFvwg6yjy1NG3xteoqz644VCo/RPgnr1/GGt+ic3iJTzQ8Eu3TdM14SawnVUmGE6A==",
      "license": "MIT"
    },
    "node_modules/wrap-ansi/node_modules/string-width": {
      "version": "4.2.3",
      "resolved": "https://registry.npmjs.org/string-width/-/string-width-4.2.3.tgz",
      "integrity": "sha512-wKyQRQpjJ0sIp62ErSZdGsjMJWsap5oRNihHhu6G7JVO/9jIB6UyevL+tXuOqrng8j/cxKTWyWUwvSTriiZz/g==",
      "license": "MIT",
      "dependencies": {
        "emoji-regex": "^8.0.0",
        "is-fullwidth-code-point": "^3.0.0",
        "strip-ansi": "^6.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/wrap-ansi/node_modules/strip-ansi": {
      "version": "6.0.1",
      "resolved": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-6.0.1.tgz",
      "integrity": "sha512-Y38VPSHcqkFrCpFnQ9vuSXmquuv5oXOKpGeT6aGrr3o3Gc9AlVa6JBfUSOCnbxGGZF+/0ooI7KrPuUSztUdU5A==",
      "license": "MIT",
      "dependencies": {
        "ansi-regex": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/wrappy": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/wrappy/-/wrappy-1.0.2.tgz",
      "integrity": "sha512-l4Sp/DRseor9wL6EvV2+TuQn63dMkPjZ/sp9XkghTEbV9KlPS1xUsZ3u7/IQO4wxtcFB4bgpQPRcR3QCvezPcQ==",
      "license": "ISC"
    },
    "node_modules/wsl-utils": {
      "version": "0.3.1",
      "resolved": "https://registry.npmjs.org/wsl-utils/-/wsl-utils-0.3.1.tgz",
      "integrity": "sha512-g/eziiSUNBSsdDJtCLB8bdYEUMj4jR7AGeUo96p/3dTafgjHhpF4RiCFPiRILwjQoDXx5MqkBr4fwWtR3Ky4Wg==",
      "license": "MIT",
      "dependencies": {
        "is-wsl": "^3.1.0",
        "powershell-utils": "^0.1.0"
      },
      "engines": {
        "node": ">=20"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/y18n": {
      "version": "5.0.8",
      "resolved": "https://registry.npmjs.org/y18n/-/y18n-5.0.8.tgz",
      "integrity": "sha512-0pfFzegeDWJHJIAmTLRP2DwHjdF5s7jo9tuztdQxAhINCdvS+3nGINqPd00AphqJR/0LhANUS6/+7SCb98YOfA==",
      "license": "ISC",
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/yallist": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/yallist/-/yallist-3.1.1.tgz",
      "integrity": "sha512-a4UGQaWPH59mOXUYnAG2ewncQS4i4F43Tv3JoAM+s2VDAmS9NsK8GpDMLrCHPksFT7h3K6TOoUNn2pb7RoXx4g==",
      "license": "ISC"
    },
    "node_modules/yargs": {
      "version": "17.7.2",
      "resolved": "https://registry.npmjs.org/yargs/-/yargs-17.7.2.tgz",
      "integrity": "sha512-7dSzzRQ++CKnNI/krKnYRV7JKKPUXMEh61soaHKg9mrWEhzFWhFnxPxGl+69cD1Ou63C13NUPCnmIcrvqCuM6w==",
      "license": "MIT",
      "dependencies": {
        "cliui": "^8.0.1",
        "escalade": "^3.1.1",
        "get-caller-file": "^2.0.5",
        "require-directory": "^2.1.1",
        "string-width": "^4.2.3",
        "y18n": "^5.0.5",
        "yargs-parser": "^21.1.1"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/yargs-parser": {
      "version": "21.1.1",
      "resolved": "https://registry.npmjs.org/yargs-parser/-/yargs-parser-21.1.1.tgz",
      "integrity": "sha512-tVpsJW7DdjecAiFpbIB1e3qxIQsE6NoPc5/eTdrbbIC4h0LVsWhnoa3g+m2HclBIujHzsxZ4VJVA+GUuc2/LBw==",
      "license": "ISC",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/yargs/node_modules/ansi-regex": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/ansi-regex/-/ansi-regex-5.0.1.tgz",
      "integrity": "sha512-quJQXlTSUGL2LH9SUXo8VwsY4soanhgo6LNSm84E1LBcE8s3O0wpdiRzyR9z/ZZJMlMWv37qOOb9pdJlMUEKFQ==",
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/yargs/node_modules/emoji-regex": {
      "version": "8.0.0",
      "resolved": "https://registry.npmjs.org/emoji-regex/-/emoji-regex-8.0.0.tgz",
      "integrity": "sha512-MSjYzcWNOA0ewAHpz0MxpYFvwg6yjy1NG3xteoqz644VCo/RPgnr1/GGt+ic3iJTzQ8Eu3TdM14SawnVUmGE6A==",
      "license": "MIT"
    },
    "node_modules/yargs/node_modules/string-width": {
      "version": "4.2.3",
      "resolved": "https://registry.npmjs.org/string-width/-/string-width-4.2.3.tgz",
      "integrity": "sha512-wKyQRQpjJ0sIp62ErSZdGsjMJWsap5oRNihHhu6G7JVO/9jIB6UyevL+tXuOqrng8j/cxKTWyWUwvSTriiZz/g==",
      "license": "MIT",
      "dependencies": {
        "emoji-regex": "^8.0.0",
        "is-fullwidth-code-point": "^3.0.0",
        "strip-ansi": "^6.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/yargs/node_modules/strip-ansi": {
      "version": "6.0.1",
      "resolved": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-6.0.1.tgz",
      "integrity": "sha512-Y38VPSHcqkFrCpFnQ9vuSXmquuv5oXOKpGeT6aGrr3o3Gc9AlVa6JBfUSOCnbxGGZF+/0ooI7KrPuUSztUdU5A==",
      "license": "MIT",
      "dependencies": {
        "ansi-regex": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/yocto-queue": {
      "version": "0.1.0",
      "resolved": "https://registry.npmjs.org/yocto-queue/-/yocto-queue-0.1.0.tgz",
      "integrity": "sha512-rVksvsnNCdJ/ohGc6xgPwyN8eheCxsiLM8mxuE/t/mOVqJewPuO1miLpTHQiRgTKCLexL4MeAFVagts7HmNZ2Q==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/yocto-spinner": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/yocto-spinner/-/yocto-spinner-1.1.0.tgz",
      "integrity": "sha512-/BY0AUXnS7IKO354uLLA2eRcWiqDifEbd6unXCsOxkFDAkhgUL3PH9X2bFoaU0YchnDXsF+iKleeTLJGckbXfA==",
      "license": "MIT",
      "dependencies": {
        "yoctocolors": "^2.1.1"
      },
      "engines": {
        "node": ">=18.19"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/yoctocolors": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/yoctocolors/-/yoctocolors-2.1.2.tgz",
      "integrity": "sha512-CzhO+pFNo8ajLM2d2IW/R93ipy99LWjtwblvC1RsoSUMZgyLbYFr221TnSNT7GjGdYui6P459mw9JH/g/zW2ug==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/zod": {
      "version": "4.4.1",
      "resolved": "https://registry.npmjs.org/zod/-/zod-4.4.1.tgz",
      "integrity": "sha512-a6ENMBBGZBsnlSebQ/eKCguSBeGKSf4O7BPnqVPmYGtpBYI7VSqoVqw+QcB7kPRjbqPwhYTpFbVj/RqNz/CT0Q==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/colinhacks"
      }
    },
    "node_modules/zod-to-json-schema": {
      "version": "3.25.2",
      "resolved": "https://registry.npmjs.org/zod-to-json-schema/-/zod-to-json-schema-3.25.2.tgz",
      "integrity": "sha512-O/PgfnpT1xKSDeQYSCfRI5Gy3hPf91mKVDuYLUHZJMiDFptvP41MSnWofm8dnCm0256ZNfZIM7DSzuSMAFnjHA==",
      "license": "ISC",
      "peerDependencies": {
        "zod": "^3.25.28 || ^4"
      }
    },
    "node_modules/zod-validation-error": {
      "version": "4.0.2",
      "resolved": "https://registry.npmjs.org/zod-validation-error/-/zod-validation-error-4.0.2.tgz",
      "integrity": "sha512-Q6/nZLe6jxuU80qb/4uJ4t5v2VEZ44lzQjPDhYJNztRQ4wyWc6VF3D3Kb/fAuPetZQnhS3hnajCf9CsWesghLQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18.0.0"
      },
      "peerDependencies": {
        "zod": "^3.25.0 || ^4.0.0"
      }
    },
    "node_modules/zwitch": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/zwitch/-/zwitch-2.0.4.tgz",
      "integrity": "sha512-bXE4cR/kVZhKZX/RjPEflHaKVhUVl85noU3v6b8apfQEc1x4A+zBxjZ4lN8LqGd6WZ3dl98pY4o717VFmoPp+A==",
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wooorm"
      }
    }
  }
}


--- FILE: frontend\package.json ---

{
  "name": "frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@base-ui/react": "^1.4.1",
    "@types/diff": "^7.0.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "d3-drag": "^3.0.0",
    "d3-force": "^3.0.0",
    "diff": "^9.0.0",
    "lucide-react": "^1.14.0",
    "next": "16.2.4",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "react-force-graph-2d": "^1.29.1",
    "react-markdown": "^10.1.0",
    "remark-frontmatter": "^5.0.0",
    "remark-gfm": "^4.0.1",
    "shadcn": "^4.6.0",
    "tailwind-merge": "^3.5.0",
    "tw-animate-css": "^1.4.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/d3-drag": "^3.0.7",
    "@types/d3-force": "^3.0.10",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "babel-plugin-react-compiler": "1.0.0",
    "eslint": "^9",
    "eslint-config-next": "16.2.4",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}


--- FILE: frontend\README.md ---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


--- FILE: frontend\tsconfig.json ---

{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}


--- FILE: README.md ---

# Arkon - The Open-Source Enterprise AI Knowledge Hub & MCP Server

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-PolyForm_Internal_Use_1.0.0-blue.svg" alt="License"></a>
  <a href="https://github.com/nduckmink/arkon/stargazers"><img src="https://img.shields.io/github/stars/nduckmink/arkon.svg" alt="GitHub Stars"></a>
  <a href="https://www.docker.com/"><img src="https://img.shields.io/badge/Docker-Ready-blue.svg" alt="Docker"></a>
</p>

<p align="center">
  <img src="docs/assets/arkon.png" alt="Arkon" width="720">
</p>

**Arkon** is a self-hosted, enterprise-grade knowledge management layer that bridges organizational data and AI clients. It runs as a centralized **MCP Server** (Model Context Protocol), compiling your SOPs, policies, and internal docs into a structured, traceable knowledge wiki - then serving that wiki to Claude and other LLMs through a single permission-scoped endpoint.

## 🚀 Why Arkon?

In most organizations, AI adoption is fragmented. Employees copy-paste documents into chatbots, producing inconsistent context, security risks, and duplicated work.

**Arkon treats AI as a managed organizational resource.** Every employee gets the right context, automatically and securely - filtered by their department and role.

<p align="center">
  <img src="docs/assets/how-arkon-works.png" alt="How Arkon Works" width="720">
</p>

---

## ✨ Key Features

### 🧠 Intelligent Knowledge Wiki - the MRP Pipeline
Unlike a vector database that just chunks and indexes, Arkon's **MRP pipeline** (**M**ap → **R**educe → **P**lan-review → **R**efine → **V**erify → Commit) actually compiles documents into a coherent wiki of interlinked pages.
- **Plan review before write:** every ingestion produces a human-reviewable plan listing which wiki pages will be created or updated. Editors can regenerate the plan with feedback before any page is written.
- **Page merge instead of overwrite:** when a new source touches an existing wiki page, content is LLM-merged so prior knowledge is never lost.
- **Traceable claims:** every page records the source documents it was compiled from.
- **Image-aware:** vision captions are baked into source text before compilation, so wiki pages reference the right images in the right places.
- **Resumable:** drafts persist mid-pipeline; a crashed run resumes without re-doing the expensive LLM work.

### 📚 Wiki Browser & Knowledge Graph
- Three-panel layout: page tree, content, backlinks & outlinks.
- Full-text + semantic (pgvector) search.
- Interactive knowledge graph visualization (per-scope or global).
- Wikilink-style cross-references between pages.
- Version history and rollback on every page.
- Draft proposal → editor review → approval workflow.

<p align="center">
  <img src="docs/assets/arkon-wiki-ui.png" alt="Arkon Wiki Browser UI — three-panel knowledge base with page tree, content viewer, and knowledge graph" width="720">
</p>

### 🏢 Department & Global Scopes
Precise context boundaries with their own scoped wiki, document set, and department rosters.
- **Department-level isolation** for HR, Legal, Engineering, etc.
- **Global scope** for company-wide SOPs, policies, and general knowledge.
- **Hard scope enforcement:** members only see knowledge from their assigned departments or the global realm - at the API, MCP, and search layers.

### 🛂 Fine-Grained RBAC
Role-based access control at the department and global levels.
- Built-in roles: **Viewer · Contributor · Editor · Admin** to control draft, edit, and setting access.
- Granular permissions (`doc:read:own_dept`, `wiki:edit:all`, `org:settings:manage`, ...).
- **Audit log** for every privileged action - settings changes, plan approvals, and role updates.

### 🔌 MCP Server for Claude & Other AI Clients
Employees connect Claude Desktop or Claude.ai to Arkon via **OAuth 2.1 + PKCE** — just add the server URL and sign in through the browser. No manual token copying required. The MCP server exposes:
- **Wiki tools** - `search_wiki`, `read_wiki_page`, `list_wiki_pages`, `read_wiki_index`.
- **Source drill-down** - `get_source`, `get_source_outline`, `get_source_pages`, `list_sources`.
- **Edit workflow** - `propose_wiki_edit`, `edit_wiki_page`, `list_pending_drafts`, `review_draft`, `approve_draft`, `reject_draft`.
- **Discovery** - `list_knowledge_types`, `get_knowledge_type_docs`.

All tools enforce per-token scope (department, knowledge type, source list).

### 🧰 AI Skills Distribution
Upload custom agent packages once and distribute them across the org.
- Versioned skill packages (.zip with `SKILL.md`).
- Department-scoped visibility.
- Contribution workflow for end-user updates.

### 🤖 Pluggable AI Providers
Catalog-driven selection - admins pick from a curated list with context window, cost, and capability metadata on display.
- **LLM:** Anthropic Claude (Opus / Sonnet / Haiku 4.x), Google Gemini (3.x Pro / Flash / Flash-Lite, 2.5), OpenAI (GPT-5.x, GPT-4.x).
- **Embedding:** Google `gemini-embedding-*`, OpenAI `text-embedding-3-*` - switchable with online re-embed migration (active model atomically flipped on completion, no zero-result search window).
- **Vision:** Google Gemini Flash, OpenAI GPT-4o family.

### 🔒 Privacy & Security First
- **Self-hosted.** Deploy on-prem or in your private cloud via Docker.
- **No telemetry.** Outbound traffic goes only to the AI provider you choose.
- **Encrypted at rest.** API keys stored with Fernet encryption in PostgreSQL.

---

## 🛠️ Tech Stack

<p align="center">
  <img src="docs/assets/arkon-architecture.png" alt="Arkon Architecture" width="720">
</p>

- **Backend:** FastAPI · PostgreSQL + pgvector · Redis (arq workers) · MinIO
- **Frontend:** Next.js · Tailwind CSS
- **AI integration:** Model Context Protocol via FastMCP
- **Document parsing:** PDF, DOCX, DOC, plain text, URLs, embedded images

---

## 💻 Server Requirements

Arkon runs **7 Docker containers** (PostgreSQL + pgvector, Redis, MinIO, FastAPI API, 2 ARQ workers, Next.js frontend). The table below provides recommended configurations based on team size:

| | **Starter** | **Team** | **Enterprise** |
|---|:---:|:---:|:---:|
| **Team size** | 1 – 20 | 20 – 100 | 100+ |
| **vCPU** | 2 cores | 4 cores | 8+ cores |
| **RAM** | 4 GB | 8 GB | 16+ GB |
| **Storage** | 40 GB SSD | 100 GB SSD | 250+ GB NVMe SSD |
| **OS** | Ubuntu 22.04+ / Debian 12+ | Ubuntu 22.04+ / Debian 12+ | Ubuntu 22.04+ / Debian 12+ |
| **Use case** | Evaluation / small teams | Departmental deployment | Organization-wide rollout |

> [!NOTE]
> - **RAM** is the primary bottleneck — the MRP pipeline workers load large LLM context windows into memory during wiki compilation.
> - **Storage** scales with your document corpus — pgvector indexes, MinIO file storage, and PostgreSQL WAL logs are the main consumers.
> - All AI inference happens externally (Anthropic / Google / OpenAI APIs), so **GPU is not required**.
> - A reverse proxy (Nginx / Caddy) with SSL is recommended for production. See [Setup Guide](docs/SETUP.md).

---

## 🚦 Quick Start (Docker)

> [!NOTE]
> **Arkon is built for teams, not individuals.** If you're looking for a personal knowledge setup, [Obsidian](https://obsidian.md) + Claude Skills is a much simpler fit.
>
> **Not a tech person?** Skip the self-hosting hassle — reach out for a **free guided demo** tailored for your team. No config, no Docker, just a walkthrough of what Arkon can do for your organization.

**Prerequisites:** Docker & Docker Compose, plus an API key from your preferred AI provider (Anthropic, Google, or OpenAI).

1. **Clone the repository:**
   ```shell
   git clone https://github.com/nduckmink/arkon.git
   cd arkon
   ```

2. **Configure environment:**
   ```shell
   cp .env.docker.example .env.docker
   # Edit .env.docker - set SECRET_KEY, admin credentials, and Postgres/MinIO secrets
   ```

3. **Launch:**
   ```shell
   docker compose --env-file .env.docker up -d --build
   ```

4. Access the portal at `http://localhost:3119`, sign in as admin, then go to **Settings** to pick your embedding / LLM / vision models and paste API keys.

→ See [Setup Guide](docs/SETUP.md) for development mode and the full env reference.

---

## 🔗 Connecting Claude

In **Claude Desktop** or **Claude.ai → Settings → Connectors**, add a custom connector:

- **Name:** `Arkon`
- **URL:** `https://your-arkon-server/mcp`

Click **Connect** → a browser window opens with the Arkon login form → sign in with your Arkon credentials → done. Arkon uses OAuth 2.1 + PKCE so no manual token setup is required.

**To make Claude consistently use Arkon**, add this to Claude's **Custom Instructions** (Settings → Custom Instructions):

```
Whenever answering questions related to the company — its processes, products,
people, departments, policies, or projects — always search Arkon first using
the search_wiki tool before relying on general knowledge.
```

For stronger enforcement, create a **Project** in Claude Desktop, attach Arkon as a connector, and paste the same text as Project Instructions.

<p align="center">
  <img src="docs/assets/arkon-in-use-of-claude.png" alt="Arkon in use with Claude Desktop" width="720">
</p>

→ See [MCP & Claude](docs/MCP.md) for the complete tool reference.

---

## 🗺️ Roadmap

- [x] **MRP Pipeline** - deterministic compilation with plan review, page merge, and resume-on-crash.
- [x] **MCP Server** - scoped wiki + source + draft tools.
- [x] **Department & Global Scopes** - department isolation with RBAC.
- [x] **Wiki draft & revision workflow** - propose, review, approve, rollback.
- [x] **AI Skills** - versioned, department-scoped agent packages.
- [x] **Catalog-driven model selection** - LLM, embedding, and vision picked from a curated list with cost/context-window metadata.
- [x] **Online embedding migration** - atomic re-embed with no search downtime.
- [x] **Audit log** - privileged actions tracked.
- [ ] **Rich media ingestion** - bulk folder upload with images, videos, and Excel/spreadsheet parsing baked into the MRP pipeline.
- [x] **Usage analytics dashboard**
- [ ] **External data import** - connectors for SharePoint, Google Drive, Notion, and other common org data sources.
- [ ] **Arkon CLI** - one-command setup for employees.
- [ ] **Notification system** - for draft reviews and plan approvals.

---

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=nduckmink/arkon&type=Date)](https://star-history.com/#nduckmink/arkon&Date)

---

## 📄 License

Arkon is licensed under the [PolyForm Internal Use License 1.0.0](LICENSE). Free for internal business operations; you may not offer Arkon as a service to third parties.

For enterprise support or custom integrations, please contact the maintainers.

---

**Keywords:** *Enterprise AI, Model Context Protocol, MCP Server, Knowledge Management System, Self-hosted RAG, AI Knowledge Base, Claude MCP, LLM Context Management, Open Source Wiki.*

---

## 📬 Contact

**Main Author**
Minh Nguyen (Nguyễn Đức Minh) — Vietnam (GMT+7) · Fluent English
✉️ [duckmink.bitsness@gmail.com](mailto:duckmink.bitsness@gmail.com)

**Company**
BITSNESS TECHNOLOGY AND SOLUTIONS COMPANY LIMITED
✉️ [bitsness.ad@bitsness.vn](mailto:bitsness.ad@bitsness.vn)

For enterprise inquiries, demo requests, or custom integrations — email us directly.


--- FILE: skills\arkon-edit\SKILL.md ---

---
name: arkon-edit
description: "Propose or directly apply edits to Arkon wiki pages, including proposing brand new pages. Contributors create drafts for review; editors/admins can edit/create directly. Triggers on: update wiki, fix this page, propose edit, edit wiki page, correct the KB, improve wiki, resubmit my draft, withdraw my draft, create new wiki page, propose new page."
allowed-tools: mcp__arkon__search_wiki mcp__arkon__read_wiki_index mcp__arkon__read_wiki_page mcp__arkon__propose_wiki_edit mcp__arkon__edit_wiki_page mcp__arkon__propose_wiki_create mcp__arkon__create_wiki_page mcp__arkon__resubmit_draft mcp__arkon__withdraw_draft
---

# arkon-edit: Edit the Knowledge Base

Always read the current page before proposing changes. Always confirm with the user before submitting.

---

## Permission Tiers

| Role | Tool to use | Review required |
|------|------------|----------------|
| Contributor | `propose_wiki_edit` | Yes — goes to editor queue |
| Editor | `edit_wiki_page` | No — writes directly |
| Admin | `edit_wiki_page` | No — writes directly |

If you try `edit_wiki_page` and get a permission error, fall back to `propose_wiki_edit`.

---

## Workflow: Propose an Edit (Contributor)

1. **Find the page** — `search_wiki(query)` or `read_wiki_index()` to locate the slug.
2. **Read current content** — `read_wiki_page(slug)`. Never propose without reading first.
3. **Draft the edit** — produce the full updated Markdown (not a diff — the tool takes full content).
4. **Confirm with user** — show the diff or summary of changes. Get explicit approval.
5. **Submit** — `propose_wiki_edit(slug, content_md, note="one-line explanation")`.
6. Report the draft ID to the user so they can track it.

Do not submit a draft without user confirmation. The note field is important — editors need context.

---

## Workflow: Direct Edit (Editor/Admin)

Same steps 1-4 above, then:

5. **Submit** — `edit_wiki_page(slug, content_md, change_note="one-line explanation")`.
6. Report the new version number returned.

---

## Content Rules

- Submit **full page content** — these tools replace, not patch.
- Max 50,000 characters per submission.
- Cannot edit reserved pages: `_index`, `_log`.
- Preserve existing wikilinks `[[slug]]` unless intentionally removing them.
- Keep the page's existing frontmatter fields (title, type, knowledge_type_slugs, etc.) unless the change specifically needs to update them.

---

## When NOT to edit

- Do not edit without user instruction — even if you spot an error while querying.
- Do not create new pages via these tools (they only update existing pages).
- If the target slug doesn't exist, tell the user — new page creation is an admin/pipeline operation.

---

## Iteration loop: when a reviewer sends changes back

If a reviewer used `request_changes_on_draft`, the draft moves to status
`needs_revision`. The original draft is preserved; you (or the user) can fix
it without creating a fresh proposal.

1. `read_wiki_page(slug)` — make sure the page hasn't moved on while you waited.
2. Read the reviewer note attached to the draft (visible in the in-app
   notification). Address every point they raised.
3. Confirm the rewrite with the user.
4. `resubmit_draft(draft_id, content_md, note="what I changed in this round")`.
   - Bumps `revision_round` and notifies reviewers.
   - The prior submission is snapshotted to history (rounds) so the reviewer
     can diff your changes against the previous round.

## Withdrawing your own draft

If you no longer want a pending or needs_revision draft to be reviewed:

```
withdraw_draft(draft_id)
```

Only the original author may withdraw (admins can override via the REST API).
Withdrawn drafts are terminal and disappear from reviewer queues. Confirm with
the user before withdrawing — it cannot be reversed via MCP.

## Scope disambiguation

When `propose_wiki_edit` or `edit_wiki_page` finds the same slug in multiple
scopes (global + project, for example), the call fails with a list of the
candidate scopes. Re-call with `scope_type` and `scope_id` to target the
specific page the user means.

---

## Creating a brand-new page

**First check whether one already exists.** Always run `search_wiki(query)`
and inspect the top hits before proposing a new page — duplicates waste
reviewer time and trigger the AI duplicate check.

| Role | Tool | What happens |
|------|------|-------------|
| Contributor+ | `propose_wiki_create` | Draft enters reviewer queue; page materialised on approve |
| Editor+ (workspace) or `wiki:write:all` (global) | `create_wiki_page` | Page created immediately |

Required fields for both tools:
- `slug` — unique inside the chosen scope, no whitespace, not `_index`/`_log`
- `title` — display title
- `content_md` — full Markdown
- `page_type` — one of `entity` | `concept` | `source` | `topic`
- `scope_type` — `global` | `department` | `project` (with `scope_id` for the latter two)
- `knowledge_type_slugs` — taxonomy tags that drive RBAC visibility; ask the
  user which categories apply rather than guessing

Workflow:
1. `search_wiki` to confirm nothing similar exists.
2. Show the user the suggested slug, page_type, knowledge_type_slugs, scope and the full content. Confirm.
3. Call the appropriate tool. Report the returned draft ID (propose path) or
   the created page version (direct path).

If approve later returns a slug conflict, the reviewer or the contributor must
override `final_slug` (reviewer side) or rename and resubmit (contributor side).

---

## AI pre-review

Every draft you submit is annotated by an AI pre-review layer that flags:
- **PII / secrets** (emails, phone numbers, API keys, JWTs, ...)
- **Broken wikilinks** to slugs that don't exist
- **Possible duplicates** with existing pages (embedding similarity)
- **Tone / scope fit / factual concerns** (LLM judgment)

The flags are **advisory only** — they do not block submission and reviewers
make the final call. But: address obvious ones (broken links, accidental PII)
before submitting to save the reviewer time.

If a regex flags a legitimate contact email or hotline that you intentionally
included in the page, add a suppression comment on the line above:

```markdown
<!-- pii-allow: contact-email -->
Email team: compliance@example.com
```

The marker covers regex matches on the same or next non-blank line. Choose a
short, honest reason — it shows up in the reviewer's audit trail.


--- FILE: skills\arkon-query\SKILL.md ---

---
name: arkon-query
description: "Answer questions using the Arkon knowledge base. Searches wiki first, drills into raw sources only when needed. Supports quick, standard, and deep modes. Triggers on: what do we know about, find in KB, look up, query:, arkon query, search the wiki, tell me about, based on the KB."
allowed-tools: mcp__arkon__search_wiki mcp__arkon__read_wiki_index mcp__arkon__read_wiki_page mcp__arkon__list_wiki_pages mcp__arkon__list_knowledge_types mcp__arkon__get_knowledge_type_docs mcp__arkon__list_sources mcp__arkon__get_source mcp__arkon__get_source_outline mcp__arkon__get_source_pages
---

# arkon-query: Query the Knowledge Base

The wiki has already done the synthesis work. Read strategically, answer precisely. Raw sources are a fallback — not the first stop.

---

## Query Modes

| Mode | Trigger | Tools used | Best for |
|------|---------|-----------|---------|
| **Quick** | `query quick: ...` or simple factual Q | `search_wiki` only | Direct lookups, names, dates |
| **Standard** | default | `search_wiki` → 2-4 pages | Most questions |
| **Deep** | `query deep: ...` or "thorough", "find everything" | Full wiki traverse + source drill-down | Cross-cutting synthesis |

---

## Quick Mode

1. Call `search_wiki(query, top_k=5)`. If the top result has high similarity (≥ 80%) and its summary answers the question, respond immediately.
2. If not satisfied, call `read_wiki_page(slug)` for the top 1-2 results.
3. If still not found, say "Not in quick cache — run as standard query?"

Do not call `read_wiki_index` or source tools in quick mode.

---

## Standard Query Workflow

1. **`search_wiki(query)`** — ranked list of pages. Read summaries.
2. **`read_wiki_page(slug)`** for the 2-4 most relevant results. Follow wikilinks `[[slug]]` at depth 1 only if they look essential.
3. Synthesize the answer in chat. Cite with page slugs: _(Source: `concept/onboarding`)_.
4. If the question reveals a gap: "I don't have enough on X in the KB. Want to check the raw sources?"

---

## Deep Mode

1. `search_wiki` + `read_wiki_index` to map coverage.
2. Read all relevant pages. Follow wikilinks at depth 2 if needed.
3. If wiki coverage is thin for a specific claim, drill into raw sources (see below).
4. Always cite both wiki pages and source documents used.

---

## Source Drill-Down (citations or precise text)

Use when: the wiki has paraphrased something and you need the exact wording, or the user asks "what does the document actually say."

```
list_sources(knowledge_type=...)     → find source IDs by category
get_source(source_id)                → check metadata and page count
get_source_outline(source_id)        → find the right section (TOC)
get_source_pages(source_id, "5-7")   → read exact pages
```

Do not call `get_source_pages` without first checking `get_source_outline` on documents > 10 pages.

---

## Browsing by Category

When the user asks "what's in the X category" or wants to explore a knowledge type:

```
list_knowledge_types()               → see all categories + doc counts
get_knowledge_type_docs(slug)        → docs in that category
list_wiki_pages(knowledge_type=slug) → wiki pages tagged to that category
```

---

## Token Discipline

| Start with | When to stop |
|-----------|-------------|
| `search_wiki` | If summary has the answer |
| 2-4 wiki pages | Usually sufficient for standard queries |
| `get_source_outline` | Before reading pages of a long source |
| `get_source_pages` | Read only the specific pages needed |

Never read more than 6 wiki pages for a standard query. For deep mode, cap at 15 unless the question explicitly demands full coverage.

---

## RBAC Notes

- Your MCP token determines which knowledge types you can access.
- `search_wiki`, `read_wiki_page`, and `list_wiki_pages` automatically filter to your allowed types.
- `list_sources` and `get_source_pages` enforce per-source scope.
- If you get "Access denied" or "out of scope", the content exists but is outside your token's permissions — tell the user and suggest they contact an admin.


--- FILE: skills\arkon-review\SKILL.md ---

---
name: arkon-review
description: "Review, approve, request changes on, or reject pending wiki edit drafts in Arkon. Requires editor or admin role. Triggers on: review drafts, pending reviews, check draft queue, approve draft, reject draft, request changes, send draft back, review wiki changes."
allowed-tools: mcp__arkon__list_pending_drafts mcp__arkon__review_draft mcp__arkon__approve_draft mcp__arkon__reject_draft mcp__arkon__request_changes_on_draft mcp__arkon__read_wiki_page
---

# arkon-review: Review Wiki Drafts

Editor/admin only. If `list_pending_drafts` returns a permission error, you don't have the required role.

---

## Review Workflow

### 1. List pending drafts

```
list_pending_drafts()
```

Returns: draft ID, page slug, author, timestamp, note. Filter by workspace if needed:
```
list_pending_drafts(workspace_id="<uuid>")
```

### 2. Read a draft for review

```
review_draft(draft_id)
```

Returns side-by-side: **proposed content** and **current page content (vN)**. Read both carefully.

You may also call `read_wiki_page(slug)` independently for fuller backlink context.

### 3. Decide

**Approve as-is:**
```
approve_draft(draft_id, reviewer_note="optional feedback to author")
```

**Approve with your own edits** (you want to tweak before publishing):
```
approve_draft(draft_id, edited_content_md="...", reviewer_note="approved with minor edits")
```

**Request changes** (the draft is on the right track but needs fixes; preferred over reject when iteration is realistic):
```
request_changes_on_draft(draft_id, reviewer_note="20+ char explanation — what to change and why")
```
The draft moves to `needs_revision`; author can `resubmit_draft` after addressing the note. The original draft stays — `revision_round` increments each round and prior submissions are snapshotted for diffing.

**Reject** (only when the proposal is fundamentally wrong — out of scope, factually broken, or duplicates an existing page):
```
reject_draft(draft_id, reviewer_note="clear reason why — required")
```

`reviewer_note` is **required** for both reject and request_changes — the author needs to understand what to fix. **Prefer request_changes over reject** unless the proposal cannot be salvaged.

**Conflict on approve**: if the page advanced past the draft's `base_version` while you were reviewing, `approve_draft` returns a conflict error. Re-call with `allow_conflict=true` to overwrite, or supply `edited_content_md` after merging the latest content yourself.

**Self-approve is blocked**: the server rejects approve attempts where the reviewer is also the author. Ask another editor.

---

## Approving a create draft

When the draft was filed via `propose_wiki_create`, it has `draft_kind: "create"`
and no page exists yet — approval materialises a new page using the
contributor's suggested metadata. The reviewer may override before commit
via the REST endpoint body (in the portal UI):

- `final_slug` — adjust the URL slug
- `final_title` — adjust the display title
- `final_page_type` — change page_type
- `final_knowledge_type_slugs` — fix the taxonomy tags (matters for RBAC)

Why adjust metadata? RBAC visibility is driven by `knowledge_type_slugs`;
slug shapes the URL forever; page_type affects how the page renders in the
index. Contributors are often not aware of the conventions — quietly fixing
these at approve is cheaper than asking them to resubmit.

If the slug already exists in the target scope, approval returns
`409 slug_conflict` — override `final_slug` or send the draft back with a
`request_changes` note explaining why.

---

## AI pre-review signals

Every draft carries an AI verdict (`ai_check_status` plus a list of checks):

- **`passed`** — no warnings. Most likely safe to approve after a quick read.
- **`warned`** — soft issues: broken wikilinks, possible duplicates, tone
  drift, scope-fit doubts. Read them; some are noise, some matter.
- **`failed`** — at least one PII / secret regex match. Read each match
  carefully. The contributor may have meant to include it (look for a
  `<!-- pii-allow: ... -->` marker above the match). If not, that's a
  request_changes situation.

The AI never blocks approval — it's a checklist, not a gate. Trust your own
judgment.

---

## Review Checklist

Before approving, verify:

- [ ] Content is factually consistent with other wiki pages (check backlinks if unsure)
- [ ] No sensitive data (PII, credentials, confidential figures) exposed
- [ ] Wikilinks `[[slug]]` point to real pages, not broken references
- [ ] Tone matches the KB style (factual, neutral, encyclopedic)
- [ ] The change note from the author makes the intent clear

---

## Batch Review

For multiple drafts:

1. `list_pending_drafts()` — get the full queue.
2. Group by page type or workspace if useful.
3. `review_draft` each one in order.
4. Approve/reject individually — do not bulk approve without reading each.

Always confirm with the user before approving a batch of more than 3 drafts in one go.

---

## Notes

- Approving a draft writes directly to the wiki page and creates a revision in history.
- Rejected drafts stay in the system with `status: rejected` — they are not deleted.
- You cannot approve your own drafts (the server enforces this).
