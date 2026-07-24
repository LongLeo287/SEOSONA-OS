---
name: seosona:aitoearn-connector
description: Connects SEOSONA agents to the AiToEarn MCP server for automated content marketing, video generation, cross-platform publishing, and AI-driven community engagement.
metadata:
  author: seosona
  version: "1.0.0"
  reference: "2_KNOWLEDGE/raw_data/architectures/marketing_multimedia/ai-to-earn-architecture.md"
---
# AiToEarn MCP Connector

Use this skill when handling end-to-end marketing campaigns that require multi-platform distribution, bulk video generation, or automated social media engagement.

## Architecture Context
This connector interfaces directly with the AiToEarn MCP server located at `http~/.seosona/path/`. You must append the `x-api-key` header when executing HTTP requests to this endpoint.

## Core Capabilities

### 1. 🎨 CREATE (Content Generation)
Trigger batch content generation pipelines.
- **Video**: Sends scripts to AiToEarn's Seedance, Veo, or Grok models.
- **Image/Text**: Generates structured posts using Nano Banana.
- **Workflow**: `POST /api/unified/mcp/create` -> Pass `{ "type": "video", "script": "...", "model": "seedance" }`.

### 2. 📢 PUBLISH (Multi-Platform Distribution)
Automatically schedule and publish generated content to multiple networks simultaneously (Douyin, Xiaohongshu, TikTok, YouTube, Instagram, X/Twitter, LinkedIn, Pinterest, Bilibili).
- **Workflow**: `POST /api/unified/mcp/publish` -> Pass `{ "content_id": "123", "platforms": ["tiktok", "youtube"], "schedule_time": "2026-06-15T20:00:00Z" }`.

### 3. 💬 ENGAGE (Auto-Seeding & Comment Mining)
Use AiToEarn's background extension/agent to automatically reply to high-intent comments (e.g. "how to buy", "link please") using LLM-generated responses.
- **Workflow**: `POST /api/unified/mcp/engage` -> Pass `{ "account_id": "xyz", "action": "auto_reply", "intent_filters": ["purchase", "inquiry"] }`.

## Usage Rules
- Never expose the API Key in logs or outputs.
- Ensure that the resulting links of published posts are saved back to `3_MEMORY/knowledge_items` for the `seo-auditor` agent to track backlinks.
