---
name: "zalo_oa_integration"
description: "Integrates with Zalo Official Account API for Vietnamese market content distribution and customer engagement."
version: "1.0.0"
author: "SEOSONA OS"
tags: ["content-ingestion", "zalo", "vietnam-market", "social-media", "messaging"]
mcp_compatible: true
---

# 🛠️ Skill: Zalo OA Integration

> **Purpose**: Connects SEOSONA OS to Zalo Official Account (OA) for the Vietnamese market. Enables content publishing, customer messaging, and engagement tracking via Zalo's API.

## 📥 Inputs & Requirements
- **Dependencies**: Zalo OA API access token, Zalo Developer App ID
- **Input Format**: `{ "action": "publish_article|send_message|get_followers|get_analytics", "payload": {...} }`

## 🧠 Execution Steps (The Method)
1. **Authentication**: Verify Zalo OA access token validity. Refresh if expired.
2. **Action Routing**:
   - `publish_article`: Format content as Zalo article (title, cover image, body, CTA) and publish via API.
   - `send_message`: Send templated or custom messages to follower segments.
   - `get_followers`: Retrieve follower demographics and growth metrics.
   - `get_analytics`: Pull article performance (views, shares, clicks).
3. **Content Adaptation**: Auto-adapt content from other channels (blog posts, Facebook) to Zalo's format constraints (image sizes, text limits).
4. **Reporting**: Log all actions and metrics to `3_MEMORY/seo_exports/zalo/`.

## 🛡️ Cognitive Guardrails
- **DO NOT**: Send unsolicited messages to users who haven't opted in (Zalo anti-spam policy).
- **DO NOT**: Store Zalo access tokens in plain text. Always reference from secure config.
- **FALLBACK**: If API is rate-limited, queue messages for retry with exponential backoff.

## ✅ Quality Validation Criteria (MANDATORY)
- [ ] API authentication successful before any action.
- [ ] Published content matches Zalo format requirements (image dimensions, text length).
- [ ] All actions logged with timestamps and status codes.
- [ ] No PII exposed in logs.

## 💻 Example Invocation
```markdown
User: "Đăng bài blog mới lên Zalo OA"
Action: Execute `zalo_oa_integration` with `{ "action": "publish_article", "payload": { "title": "...", "body": "..." } }`
Result: "[Article published to Zalo OA, article_id: 12345]"
```
