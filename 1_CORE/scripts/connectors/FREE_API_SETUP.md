# SEOSONA OS Free API Setup

This guide tracks APIs that are free, have a free tier, or run without a key.
Secrets stay in `1_CONFIG/.env`; do not commit real credentials.

## Discovery Sources

This catalog was expanded from public API indexes and official provider docs:

- `public-apis/public-apis`
- `public-api-lists/public-api-lists`
- `cporter202/social-media-scraping-apis`
- Official Google, YouTube, Pexels, Pixabay, Bluesky, Mastodon, Telegram, W3C, SSL Labs, Mozilla Observatory, and urlscan documentation.

## Quick Commands

```powershell
npm run apis:free
npm run apis:free:install
python 1_CORE/scripts/run_full_audit.py --domain <your_domain.com> --free-only
```

## Installed Python Dependencies

The free API dependency set is recorded in:

```text
1_CORE/scripts/requirements-free-apis.txt
```

Install or refresh it with:

```powershell
python -m pip install -r 1_CORE/scripts/requirements-free-apis.txt
```

## No-key APIs

| API | SEOSONA use | Connector status |
|---|---|---|
| Google Autocomplete | Keyword expansion, SERP signals | `keyword_connector`, `serp_competitor` |
| Common Crawl Index API | Crawl/backlink discovery | `backlink_connector` |
| Wayback CDX API | Historical URL/capture research | Cataloged for future connector work |
| Wikidata Query Service | Entity and knowledge graph research | Cataloged; set `WIKIDATA_USER_AGENT` |
| Crossref REST API | Literature metadata | Cataloged; set `CROSSREF_MAILTO` for polite use |
| NCBI E-utilities | PubMed and biomedical lookup | Science skills; optional `NCBI_API_KEY` |
| openFDA | FDA public datasets | Science skills; optional `FDA_API_KEY` |
| YouTube IFrame Player API | Embed/control YouTube playback | Cataloged for video workflows |
| YouTube oEmbed | Public video embed metadata | Cataloged for content/video enrichment |
| YouTube Channel RSS Feeds | Channel upload monitoring | Cataloged for video monitoring |
| SponsorBlock Public API | YouTube segment metadata | Cataloged for video intelligence |
| Piped Public API | YouTube alternate frontend metadata | Cataloged; instance-based |
| Invidious Public API | YouTube alternate frontend metadata | Cataloged; instance-based |
| Noembed oEmbed API | Social/video embed metadata | Cataloged for URL enrichment |
| Bluesky Public API | Public social listening | Cataloged; rate limited |
| Mastodon Public API | Fediverse public timelines/statuses | Cataloged; set `MASTODON_INSTANCE` |
| W3C Nu HTML Checker | HTML validation | Cataloged for technical SEO |
| SSL Labs Assessment API | TLS/security checks | Cataloged for website audits |
| Mozilla HTTP Observatory | Header/security checks | Cataloged for website audits |
| ICANN RDAP | Domain registration intelligence | Cataloged for domain research |
| Google DNS over HTTPS | DNS lookups | Cataloged for domain diagnostics |
| Cloudflare DNS over HTTPS | DNS lookups | Cataloged for domain diagnostics |

## Free-key / Free-tier APIs

| API | Required local setting | Notes |
|---|---|---|
| PageSpeed Insights API | `PAGESPEED_API_KEY` | Can work without a key for light use, key recommended for automation. |
| Chrome UX Report API | `CRUX_API_KEY` | Google Cloud API key required. |
| Google Search Console API | `GOOGLE_APPLICATION_CREDENTIALS` or `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64` | Requires verified Search Console property. |
| Google Analytics Data API | `GA4_PROPERTY_ID` plus service account credentials | Requires GA4 property access. |
| Open PageRank API | `OPEN_PAGERANK_KEY` | Free account/key required. |
| Bing Webmaster API | `BING_WEBMASTER_KEY` | Requires verified Bing Webmaster property. |
| OpenAlex API | `OPENALEX_API_KEY` | Free key recommended/required for scale. |
| Tavily API | `TAVILY_API_KEY` | Free monthly credits. |
| Firecrawl API | `FIRECRAWL_API_KEY` | Free monthly credits. |
| SerpApi | `SERPAPI_KEY` | Free monthly search quota. |
| DataForSEO | `DATAFORSEO_LOGIN`, `DATAFORSEO_PASSWORD` | Free trial credit for API testing. |
| YouTube Data API v3 | `YOUTUBE_API_KEY` | Free daily quota; useful for video/channel/search metadata. |
| Pexels API | `PEXELS_API_KEY` | Free stock video/image API with default quota limits. |
| Pixabay API | `PIXABAY_API_KEY` | Free stock video/image API. |
| Vimeo API | `VIMEO_ACCESS_TOKEN` | Free account token; rate limited by app/user. |
| Dailymotion API | `DAILYMOTION_API_KEY` | Free developer key/account flow. |
| Bluesky AT Protocol | `BLUESKY_IDENTIFIER`, `BLUESKY_APP_PASSWORD` | Free account/app-password flow for authenticated actions. |
| Telegram Bot API | `TELEGRAM_BOT_TOKEN` | Free bot token from BotFather. |
| Discord API | `DISCORD_BOT_TOKEN` | Free bot token; use within platform limits. |
| Reddit API | `REDDIT_CLIENT_ID`, `REDDIT_CLIENT_SECRET`, `REDDIT_USER_AGENT` | Free app credentials; rate limited. |
| Meta Graph API | `META_ACCESS_TOKEN` | Free access requires account/app permissions and review for some scopes. |
| TikTok for Developers API | `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET` | Free developer app access; approval may be required. |
| Pinterest API | `PINTEREST_ACCESS_TOKEN` | Free developer account token; permission-scoped. |
| urlscan.io API | `URLSCAN_API_KEY` | Free API key with quotas and visibility rules. |
| Google Safe Browsing API | `GOOGLE_SAFE_BROWSING_API_KEY` | Free Google Cloud API key for threat checks. |

## Current Native Connector Coverage

Native root connectors already exist for:

- PageSpeed Insights / Core Web Vitals
- Google Search Console
- Google Analytics 4
- Google Trends via `pytrends`
- Google Autocomplete keyword research
- Common Crawl and Open PageRank backlink intelligence
- Bing Webmaster backlink enrichment
- Technical SEO scanning
- Schema validation
- E-E-A-T analysis
- AEO / AI search readiness

The catalog also tracks useful free APIs that do not yet have a root SEO
connector, so future workflow routing can surface them consistently.
