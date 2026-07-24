---
name: seosona:workflow-omni-dominator
description: Ultimate Omni-Channel workflow combining OSINT, Frontend generation, Voice/Video synthesis, AiToEarn auto-publishing, and Puppeteer engagement.
metadata:
  author: seosona
  version: "1.0.0"
---
# Workflow: Omni-Channel Market Dominator

This orchestration protocol coordinates multiple capabilities to dominate a specific topic or keyword across all digital platforms.

## Execution Pipeline

### Phase 1: Reconnaissance (Tình Báo)
- **Actor**: `osint-agent`
- **Capabilities**: `seosona:advanced-recon-scraper`, `seosona:surfsense`
- **Action**: Scan Quora, Reddit, TikTok, and competitor blogs for the target keyword. Extract top 10 burning questions and high-converting angles.

### Phase 2: Production (Sản Xuất)
- **Actor**: `content-strategist` & `frontend-developer`
- **Capabilities**: `seosona:omni_content_agent`, `seosona:frontend-engineering`
- **Action**: Write a 2000-word SEO pillar article based on Phase 1 data. Instruct the `frontend-developer` to generate or update a Next.js Landing Page containing this article.

### Phase 3: Synthesis (Chế Bản Đa Phương Tiện)
- **Actor**: `video-producer`
- **Capabilities**: `seosona:voice-pro`, `seosona:video-marketing`
- **Action**: Convert the article into a Podcast script. Pass to `voice-pro` to synthesize audio. Send the audio to `video-marketing` to generate 1 long-form YouTube video and 3 short-form videos.

### Phase 4: Distribution (Phân Phối Rải Thảm)
- **Actor**: `marketing-manager`
- **Capabilities**: `seosona:aitoearn-connector`
- **Action**: Use the AiToEarn MCP to automatically publish the generated articles and videos across Douyin, TikTok, YouTube Shorts, X, LinkedIn, and Facebook. All posts must include the link back to the Landing Page from Phase 2.

### Phase 5: Domination (Săn Khách Khung Bình Luận)
- **Actor**: `community-manager`
- **Capabilities**: `seosona:puppeteer-automation`, `seosona:aitoearn-connector`
- **Action**: Run Puppeteer scripts to continuously monitor the comment sections of the newly published posts. Use AiToEarn's engagement module to auto-reply to comments showing purchase intent.

## Error Handling
If any Phase fails, the Orchestrator must fall back to the previous successful state and log a detailed failure report in `3_MEMORY/logs/routing_decisions.json`.
