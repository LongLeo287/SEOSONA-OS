# KI: Multichannel Content Ingestion Patterns

_Source: UAP Wave 3 analysis of `chubbyguan/chubbyskills` (13 AI Skills for Chinese multi-channel KB)_

## Architecture Pattern
- **13 specialized skills** for different content types (Douyin, Bilibili, Xiaohongshu, WeChat)
- **Dedicated MCP Server** for knowledge base queries
- **Platform-specific adapters** that normalize content from each platform into a common format

## Content Normalization Flow
```
Platform API → Raw Content → Platform Adapter → Normalized Schema → KB Storage → MCP Query
```

## Key Patterns
1. **Platform Adapter Pattern**: Each social platform has its own adapter that handles auth, rate limiting, content format, and media download.
2. **Common Content Schema**: All content is normalized into: `{ title, body, media[], author, date, engagement{likes, shares, comments}, platform, url }`
3. **MCP Server for Queries**: The KB is queryable via MCP, enabling any AI tool to search ingested content.

## SEOSONA OS Application (Vietnamese Market)
| Chinese Platform | Vietnamese Equivalent | SEOSONA Skill Status |
|---|---|---|
| WeChat OA | **Zalo OA** | ✅ `zalo_oa_integration.md` (Wave 4) |
| Xiaohongshu | **Facebook** | ✅ `social_ingestion_facebook.md` (Wave 3) |
| Douyin | **TikTok** | ✅ `social_ingestion_tiktok_vn.md` (Wave 3) |
| Bilibili | **YouTube** | ⏳ Could leverage `yt_dlp_whisper_snapshot` |
| WeChat Mini Programs | **Zalo Mini App** | ❌ Not yet covered |

## Remaining Gaps
- YouTube content ingestion via yt-dlp (raw data exists, skill not formalized)
- Zalo Mini App integration (no Vietnamese equivalent skill yet)
- LinkedIn content ingestion (relevant for B2B SEO clients)
