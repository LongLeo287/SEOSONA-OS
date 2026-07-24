# KI: Claude Code Prompt Library (reference)

**Type:** reference · **Source:** https://code.claude.com/docs/en/prompt-library (Anthropic docs)
**Ingested:** 2026-07-24 via OS scraper (in-app browser; scrapling connector not installed).
**Why kept:** a taxonomy + set of transferable prompting patterns worth mirroring into SEOSONA's own
skill prompts and CLAUDE.md conventions. Not a repo — no code, no skill generated.

## What it is
A catalog of ~52 copy-paste prompts for Claude Code, drawn from Anthropic's Common Workflows, Best
Practices, and "How Anthropic teams use Claude Code" guides. Each prompt links to its source and a
"Why this works" note. Full text lives at the source URL (not reproduced here — Anthropic content).

## Category taxonomy (20 task/role buckets)
Start-here · Understand · Plan · Prototype · Build · Test · Refactor · Review · Steer · Debug · Git ·
Release · Data · Automate · Product · Design · Docs · **Marketing** · **Security** · On-call · Clear.
(The Marketing / Security / Docs buckets are the ones closest to SEOSONA's own domains.)

## The 6 transferable patterns (the actual reusable value — paraphrased)
1. **Describe the outcome, not the steps.** State the goal; let the agent locate the files. Don't
   hand-hold a file list when the outcome is unambiguous.
2. **Give it a way to check its own work.** Put "run / test / compare / verify" in the same prompt so
   the agent iterates instead of stopping after one attempt.
3. **Point at a reference.** Name an existing file/test/pattern to match, so new work stays consistent
   with what's already there.
4. **State the measurable target.** For performance/coverage goals, give the metric + threshold so
   "done" is unambiguous (e.g. a bundle-size or coverage number).
5. **Give it the artifact.** Paste the error/log/screenshot or `@file` the source directly — the agent
   reads the real thing instead of your description of it.
6. **Say how you want the answer.** Name the format, length, and audience; promote a recurring format
   to an output style.

## How to apply in SEOSONA
- These 6 patterns are a checklist for authoring/upgrading skill prompts under `.agents/skills` and
  `2_KNOWLEDGE/frameworks` — especially "give it a way to check its own work" (pair every generator
  skill with a verify step) and "state the measurable target" (SEO skills should name the metric).
- The library's own advice — "save a working prompt as a skill so the team runs it as a /command, and
  record conventions in CLAUDE.md" — mirrors SEOSONA's skill + SOUL model. See [[os-adopted-vs-wired]].
- Marketing / Security / Docs buckets overlap [[seosona-video-project]] and the OS's SEO connectors;
  revisit the source when writing new marketing/SEO skill prompts.
