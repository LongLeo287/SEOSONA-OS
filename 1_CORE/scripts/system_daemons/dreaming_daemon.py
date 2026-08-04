"""
SEOSONA OS Dreaming Daemon.

Reads RSS feeds from SEO/AI news sources configured in 1_CONFIG/dreaming_sources.json,
extracts article titles and summaries, and saves them as Knowledge Items.

DISTINCT FROM github_sync_daemon.py:
- github_sync checks for new COMMITS on existing GitHub REPOS.
- dreaming_daemon reads NEWS ARTICLES from RSS FEEDS about SEO/AI trends.
"""

import os
import sys
import json
import re
import urllib.request
from pathlib import Path
from datetime import datetime

# Parse RSS with defusedxml when available — protects against XXE / billion-laughs
# entity-expansion attacks from untrusted feed content. Falls back to stdlib ET
# only if defusedxml is missing (and we then block DTDs manually below).
try:
    import defusedxml.ElementTree as ET
    _SAFE_XML = True
except ImportError:
    import xml.etree.ElementTree as ET
    _SAFE_XML = False

MAX_FEED_BYTES = 5 * 1024 * 1024  # cap feed size to avoid memory blowups

ROOT = Path(__file__).resolve().parent.parent.parent.parent
CONFIG_PATH = ROOT / "1_CONFIG" / "dreaming_sources.json"
LOG_DIR = ROOT / "3_MEMORY" / "logs"
LOG_DIR.mkdir(parents=True, exist_ok=True)

sys.path.append(str(ROOT / "1_CORE" / "scripts"))

try:
    from core.telemetry import log_telemetry, generate_trace_id
except ImportError:
    def log_telemetry(*args, **kwargs): pass
    def generate_trace_id(): return "trace-local"

try:
    from connectors.url_guard import assert_safe_url, UnsafeURLError
except ImportError:
    class UnsafeURLError(Exception):
        pass
    def assert_safe_url(url):
        return url

try:
    from core.context_compressor import compress
except ImportError:
    def compress(text): return text, {"ratio": 0}


def log_msg(msg):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    formatted = f"[{ts}] [DreamingDaemon] {msg}"
    print(formatted)
    try:
        with open(LOG_DIR / "daemons.log", "a", encoding="utf-8") as f:
            f.write(formatted + "\n")
    except Exception:
        pass


def fetch_rss(url: str, max_items: int = 5) -> list:
    """Fetch and parse an RSS feed, returning article entries."""
    articles = []
    try:
        # SSRF guard: only fetch public http(s) hosts (blocks loopback/metadata/private).
        assert_safe_url(url)
        req = urllib.request.Request(url, headers={"User-Agent": "SEOSONA-Dreaming/1.0"})
        with urllib.request.urlopen(req, timeout=15) as response:
            raw = response.read(MAX_FEED_BYTES).decode("utf-8", errors="ignore")
            # If we had to fall back to stdlib ET, refuse any feed that declares a
            # DTD or custom entities — the classic billion-laughs / XXE vectors.
            if not _SAFE_XML and re.search(r"<!DOCTYPE|<!ENTITY", raw, re.IGNORECASE):
                log_msg(f"Refusing feed with DTD/ENTITY declarations: {url}")
                return articles
            root = ET.fromstring(raw)

            # Standard RSS 2.0
            items = root.findall(".//item")
            if not items:
                # Try Atom format
                ns = {"atom": "http://www.w3.org/2005/Atom"}
                items = root.findall(".//atom:entry", ns)

            for item in items[:max_items]:
                title = ""
                description = ""
                link = ""

                # RSS 2.0 fields
                t = item.find("title")
                if t is not None and t.text:
                    title = t.text.strip()
                d = item.find("description")
                if d is not None and d.text:
                    description = re.sub(r"<[^>]+>", "", d.text).strip()[:500]
                l = item.find("link")
                if l is not None and l.text:
                    link = l.text.strip()

                # Atom fallback
                if not title:
                    t = item.find("{http://www.w3.org/2005/Atom}title")
                    if t is not None and t.text:
                        title = t.text.strip()
                if not description:
                    d = item.find("{http://www.w3.org/2005/Atom}summary")
                    if d is not None and d.text:
                        description = re.sub(r"<[^>]+>", "", d.text).strip()[:500]
                if not link:
                    l = item.find("{http://www.w3.org/2005/Atom}link")
                    if l is not None:
                        link = l.get("href", "")

                if title:
                    articles.append({
                        "title": title,
                        "description": description,
                        "link": link
                    })

    except Exception as e:
        log_msg(f"Failed to fetch RSS {url}: {e}")

    return articles


def save_as_knowledge(articles: list, source_name: str, category: str, output_dir: Path):
    """Save articles as compressed Knowledge Item markdown files."""
    output_dir.mkdir(parents=True, exist_ok=True)
    today = datetime.now().strftime("%Y%m%d")
    safe_name = re.sub(r"[^a-zA-Z0-9_]", "_", source_name.lower())
    filepath = output_dir / f"dream_{safe_name}_{today}.md"

    content_lines = [
        f"# Dreaming Digest: {source_name}",
        f"**Category:** {category}",
        f"**Date:** {datetime.now().strftime('%Y-%m-%d')}",
        f"**Articles:** {len(articles)}",
        "",
    ]

    # Compress each article's PROSE only, never the document skeleton. Compressing the assembled
    # markdown collapsed every newline, so the whole digest became one long line: the headings
    # stopped being headings, the file was unreadable, and the capability bridge — which takes the
    # first heading as a resource name — ended up using the entire article dump as that name, which
    # then crowded real matches out of every routing result.
    stats = {}
    for i, article in enumerate(articles, 1):
        content_lines.append(f"## {i}. {article['title']}")
        if article["description"]:
            squeezed, stats = compress(article["description"])
            content_lines.append(squeezed if squeezed else article["description"])
        if article["link"]:
            content_lines.append(f"Source: {article['link']}")
        content_lines.append("")

    content = "\n".join(content_lines)

    try:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        log_msg(f"Saved {len(articles)} articles -> {filepath.name} (compressed {stats.get('ratio', 0)}%)")
    except Exception as e:
        log_msg(f"Failed to save KI: {e}")


def main():
    log_msg("Waking up... entering Dreaming State.")

    if not CONFIG_PATH.exists():
        log_msg(f"Config not found: {CONFIG_PATH}. Skipping.")
        return

    try:
        with open(CONFIG_PATH, "r", encoding="utf-8") as f:
            config = json.load(f)
    except Exception as e:
        log_msg(f"Failed to load config: {e}")
        return

    sources = config.get("sources", [])
    max_items = config.get("max_articles_per_source", 5)
    output_rel = config.get("output_dir", "3_MEMORY/knowledge_items/dreaming")
    output_dir = ROOT / output_rel

    total_articles = 0
    for source in sources:
        name = source.get("name", "Unknown")
        url = source.get("url", "")
        category = source.get("category", "General")

        if not url:
            continue

        log_msg(f"Fetching: {name} ({url})...")
        articles = fetch_rss(url, max_items=max_items)

        if articles:
            save_as_knowledge(articles, name, category, output_dir)
            total_articles += len(articles)
        else:
            log_msg(f"No articles found from {name}.")

    # Telemetry
    log_telemetry(
        trace_id=generate_trace_id(),
        agent="DreamingDaemon",
        action="dream_cycle",
        details={"sources_checked": len(sources), "articles_ingested": total_articles}
    )

    log_msg(f"Dream cycle complete. Ingested {total_articles} articles from {len(sources)} sources.")


if __name__ == "__main__":
    main()
