---
name: skill
description: Guides agents through safe multi-platform social publishing orchestration using a CLI-first capability matrix, account/session checks, user-owned login, media metadata contracts, scheduling boundaries, and platform-specific fallbacks. Use when distributing videos or image posts to platforms such as Douyin, Kuaishou, Xiaohongshu, Bilibili, TikTok, YouTube, or similar channels.
---

# Social Auto Upload Orchestration

## Overview

Use this skill to coordinate social publishing through stable CLI contracts before inspecting uploader source code or driving browsers directly. The goal is safe, repeatable distribution with explicit platform capabilities and authentication boundaries.

## When To Use

- Uploading video or image posts across multiple social platforms.
- Checking whether a social account/session is ready.
- Designing a content publishing pipeline.
- Converting platform uploader scripts into SEOSONA skills.

Do not use this to bypass platform policies, automate spam, or publish without explicit user intent.

## Capability Matrix

Before publishing, record:

- Platform name.
- Auth mode: cookie, QR login, OAuth, browser session, API token.
- Supported content: video, image-note, live, text.
- Scheduling support.
- CLI readiness.
- Browser automation requirement.
- Headless/headed support.
- Known risk: captcha, QR, rate limit, account trust, platform detection.

## Workflow

1. Confirm publish intent.
   - Publishing is an external side effect.
   - Require explicit user intent for upload or scheduling.

2. Preflight the toolchain.
   - Check whether the CLI is available.
   - Check platform command availability.
   - Check account/session status before upload.

3. Handle login safely.
   - Interactive login belongs to the user.
   - If a QR code or browser approval is generated, show it directly when possible.
   - Do not ask the user for passwords or session cookies in chat.

4. Normalize metadata.
   - Video: `title`, `description`, `tags`, `file`, optional `schedule`.
   - Image note: `title`, `note`, `tags`, `images`, optional `schedule`.
   - Validate file existence and platform-specific limits.

5. Execute through CLI first.
   - Prefer `check` before `upload`.
   - Prefer platform subcommands over generic uploader internals.
   - Fall back to source-level troubleshooting only when the CLI fails or is unavailable.

6. Record publication evidence.
   - Command used.
   - Platform.
   - Account alias.
   - Scheduled or immediate status.
   - Returned URL/ID when available.

## Safety Boundary

- Do not publish private, unapproved, copyrighted, or credential-bearing media.
- Do not run non-interactive login when the platform requires user approval.
- Do not store tokens or cookies in system knowledge files.
- Respect platform rate limits and manual review prompts.

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "I can just inspect the uploader source first." | CLI contracts are more stable and safer for agents. |
| "Login can be automated silently." | Auth is user-owned and often requires QR/browser approval. |
| "Scheduling is just another upload flag." | Scheduling changes business impact and must be explicit. |
| "One platform success means all are ready." | Each platform has separate auth, media, and detection risks. |

## Verification

- [ ] Publish intent is explicit.
- [ ] Account/session check passed or login was handed to the user.
- [ ] Media files exist.
- [ ] Metadata matches platform capability.
- [ ] Evidence was recorded without secrets.
