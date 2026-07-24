---
name: "social_ingestion_tiktok_vn"
description: "Automatically scrape and extract metadata, transcripts, and engagement data from TikTok VN videos for knowledge ingestion."
version: "1.0.0"
author: "SEOSONA OS"
tags: ["social-media", "tiktok", "video", "content-ingestion", "marketing"]
mcp_compatible: true
---

# 🛠️ Skill: TikTok VN Content Ingestion

> **Purpose**: Extracts video metadata, hashtags, engagement stats, and delegates subtitle extraction for TikTok videos to build a localized content knowledge base.

## 📥 Inputs & Requirements
- **Dependencies**: `video_subtitle_extraction` skill, TikTok Scraper API (or Firecrawl).
- **Input Format**: `{ "url": "https://www.tiktok.com/@user/video/...", "extract_transcript": boolean }`

## 🧠 Execution Steps (The Method)
1. **Validation**: Check if URL is a valid TikTok video link.
2. **Scraping Phase**: 
   - Extract raw metadata (Title, Description, Hashtags).
   - Extract engagement metrics (Views, Likes, Comments, Saves, Shares).
3. **Transcript Phase**:
   - If `extract_transcript` is true, invoke the `video_subtitle_extraction` skill passing the video URL.
4. **Knowledge Structuring**: Merge metadata and transcript into a unified Markdown format. Include trend analysis if specific hashtags match the SEOSONA watch-list.

## 🛡️ Cognitive Guardrails
- **DO NOT**: Attempt to download the raw MP4 video file unless explicitly requested by the user, to save bandwidth and storage.
- **FALLBACK**: If TikTok's anti-bot system blocks the API, prompt the user to use a third-party download link (e.g., Snaptik) to provide the video manually.

## ✅ Quality Validation Criteria (MANDATORY)
*Before outputting "TASK COMPLETED", the agent MUST self-verify against these criteria:*
- [ ] Criteria 1: Metadata (Views, Likes) is correctly captured.
- [ ] Criteria 2: Transcript (if requested) is logically formatted and readable.
- [ ] Criteria 3: Hashtags are extracted as a clean list.

## 💻 Example Invocation (System Prompt Fragment)
```markdown
<skill_usage_example>
User: "Phân tích video TikTok này: https://www.tiktok.com/@..."
Action: Execute `social_ingestion_tiktok_vn` with input `{ "url": "https://www.tiktok.com/@...", "extract_transcript": true }`
Result: "[Knowledge Item created with transcript and metrics]"
</skill_usage_example>
```
