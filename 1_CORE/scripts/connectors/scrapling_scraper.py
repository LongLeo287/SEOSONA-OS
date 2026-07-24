"""
SEOSONA OS — Scrapling scraper connector (D4Vinci/Scrapling).

Local, self-hosted, adaptive web scraping for SEO data acquisition (SERP pages, competitor
content, on-page extraction) — complements the paid decodo API scraper with a code path that costs
nothing and can render JS.

Every outbound URL is checked through the OS SSRF guard (`assert_safe_url`) before any fetch, on
every redirect hop — the same fail-closed policy as the other connectors.

Honest fallback: returns {"ok": False, "error": ...} when `scrapling` is not installed or a fetch
fails — never fabricated data.

CLI:  python scrapling_scraper.py <url> [css_selector]
"""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
try:
    from url_guard import assert_safe_url
except Exception:  # noqa: BLE001
    def assert_safe_url(url):  # fail-open only if the guard module is missing entirely
        return url


def _fetch(url, dynamic=False):
    """Return a Scrapling page (adaptive parser) or raise. dynamic=True renders JS via Playwright."""
    from scrapling.fetchers import Fetcher, StealthyFetcher
    if dynamic:
        return StealthyFetcher.fetch(url, headless=True, network_idle=True)
    return Fetcher.get(url, stealthy_headers=True)


def scrape(url, selector=None, dynamic=False, max_items=50):
    """Fetch `url` (SSRF-guarded) and return extracted data.

    { ok, url, status, title, count, items }  — items = text of nodes matching `selector`
    (or the page's links when no selector is given).
    """
    try:
        assert_safe_url(url)
    except Exception as e:  # noqa: BLE001
        return {"ok": False, "url": url, "error": f"blocked by SSRF guard: {e}"}
    try:
        page = _fetch(url, dynamic=dynamic)
    except ImportError:
        return {"ok": False, "url": url, "error": "scrapling not installed (pip install scrapling)"}
    except Exception as e:  # noqa: BLE001
        return {"ok": False, "url": url, "error": str(e)}

    try:
        title = page.css_first("title::text") or ""
        if selector:
            nodes = page.css(selector)
            items = [n.get_all_text(strip=True) if hasattr(n, "get_all_text") else str(n)
                     for n in nodes[:max_items]]
        else:
            items = [a.attrib.get("href") for a in page.css("a")[:max_items] if a.attrib.get("href")]
        return {"ok": True, "url": url, "status": getattr(page, "status", None),
                "title": str(title).strip(), "count": len(items), "items": items}
    except Exception as e:  # noqa: BLE001
        return {"ok": False, "url": url, "error": f"parse failed: {e}"}


def fetch_html(url, dynamic=False):
    """Return raw page HTML (SSRF-guarded) or None. The cheap default path for scraper_agent:
    a plain HTTP fetch with no browser spin-up. dynamic=True renders JS via Playwright."""
    try:
        assert_safe_url(url)
    except Exception:  # noqa: BLE001
        return None
    try:
        page = _fetch(url, dynamic=dynamic)
    except Exception:  # noqa: BLE001 — not installed / fetch failed → caller falls back
        return None
    for attr in ("html_content", "body", "html"):
        val = getattr(page, attr, None)
        if val:
            return val if isinstance(val, str) else val.decode("utf-8", "ignore")
    text = str(page)
    return text or None


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("usage: scrapling_scraper.py <url> [css_selector] [--dynamic]")
        sys.exit(1)
    sel = sys.argv[2] if len(sys.argv) > 2 and not sys.argv[2].startswith("--") else None
    print(json.dumps(scrape(sys.argv[1], sel, dynamic="--dynamic" in sys.argv), ensure_ascii=False, indent=2))
