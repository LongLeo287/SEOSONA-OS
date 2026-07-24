---
name: "zca_bridge"
description: "Historic standalone skill"
keywords: ["zca_bridge", "ingested"]
mcp_compatible: true
---

# Zalo-Chatwoot Bridge (zca-bridge)

## Overview
`zca-bridge` is a self-hosted sidecar application that enables two-way synchronization between Zalo (Personal & Official Account) and Chatwoot. It turns Zalo into an inbox within Chatwoot for team collaboration.

## Core Features
- **Two-way Messaging:** Text, images, files, voice, video, stickers, location.
- **Zalo OA:** Official API with OAuth, webhooks, media compression, backfill.
- **Zalo Personal (zca-js):** Unofficial API via QR login, supports quote/reply, reactions, message recall.
- **Durable Queue:** PostgreSQL-backed job queue for retries and dead-letter handling.
- **Media Archive:** Local media archiving with tokenized `/media` links for large files.
- **Admin Dashboard:** Built-in UI to manage accounts, Chatwoot config, proxy routing, and view logs.
- **Proxy Management:** Per-account proxy routing (HTTP, SOCKS5) to prevent IP bans on personal accounts.

## Tech Stack
- **Backend:** Node.js 24+, TypeScript ESM, Fastify
- **Database:** PostgreSQL (separate from Chatwoot DB)
- **Testing & Infra:** Vitest, Docker

## Architecture
- **Inbound:** Zalo (webhook/backfill or zca-js) -> Message parsing -> Postgres queue -> Worker -> Chatwoot API.
- **Outbound:** Chatwoot Webhook -> Postgres queue -> Worker -> Zalo sender.

*Source: github.com/diendh/zca-bridge*
