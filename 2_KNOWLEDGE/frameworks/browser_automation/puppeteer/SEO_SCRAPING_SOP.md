# SEO Scraping SOP (Standard Operating Procedure)

This SOP defines how SEOSONA OS agents should use Puppeteer to scrape SERP data or audit client websites that block standard bots.

## Phase 1: Bypassing Anti-Bot Systems
When scraping Cloudflare-protected sites or Google SERPs:
1. Do not use standard Puppeteer. Use `puppeteer-extra` and `puppeteer-extra-plugin-stealth`.
2. Randomize the User-Agent explicitly.
3. Randomize viewport dimensions to avoid fingerprinting.
4. Add randomized delays (`waitForTimeout`) between page navigations.

## Phase 2: Extracting SEO Data
1. **Title & Meta**: Extract `document.title` and `meta[name="description"]`.
2. **Headings**: Extract `h1`, `h2`, `h3` hierarchy recursively.
3. **Links**: Extract all `a[href]` to analyze internal vs external link flow.
4. **Core Web Vitals**: Inject PerformanceObserver scripts via `page.evaluateOnNewDocument` to capture LCP and CLS.

## Phase 3: Cleanup
1. Always call `await page.close()` followed by `await browser.close()`.
2. Do not leave Zombie Chrome processes in SEOSONA OS memory.
