#!/usr/bin/env python3
"""
SEOSONA OS — Technical SEO Deep Scanner
Checks: robots.txt, sitemap.xml, redirects, broken links, canonical, meta robots,
        HTTPS, hreflang, page depth, duplicate titles/metas, structured data presence
NO API KEY REQUIRED — pure HTTP + HTML parsing
"""

import json
import csv
import sys
import urllib.request
import urllib.parse
import urllib.error
import html.parser
import time
import ssl
from datetime import datetime
from pathlib import Path
from collections import defaultdict

# SSRF defense: validate every fetched URL (incl. each redirect hop) against the shared guard,
# which blocks non-http(s) schemes and loopback/private/link-local/metadata IPs.
try:
    import os as _os, sys as _sys
    _sys.path.append(_os.path.dirname(__file__))
    from url_guard import assert_safe_url, safe_urlopen
except Exception:
    def assert_safe_url(u):  # fail closed if the guard can't load
        raise RuntimeError("url_guard unavailable — refusing to fetch unsafely")

    def safe_urlopen(*_a, **_k):
        raise RuntimeError("url_guard unavailable — refusing to fetch unsafely")


class _NoRedirectHandler(urllib.request.HTTPRedirectHandler):
    """Do not auto-follow redirects, so each hop can be re-validated before fetching."""
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


ROOT = Path(__file__).parent.parent.parent.parent
CONFIG_PATH = ROOT / "3_MEMORY" / "specs" / "config.json"
CTX = ssl.create_default_context()
# TLS validation is enabled (do not disable check_hostname or CERT_NONE)

HEADERS = {
    "User-Agent": "SEOSONA-OS-TechScanner/1.0 (SEO audit bot; contact: seosona@example.com)",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "vi,en;q=0.9",
}

def _classify_links(links, base_domain):
    """Split hrefs into internal vs external, counting relative links as internal.

    Compares the parsed HOST, not a substring of the whole URL, so a third-party link that merely
    mentions the domain in a query string is not miscounted as internal.
    """
    internal = external = 0
    base = (base_domain or "").lower().lstrip("www.")
    for link in links:
        href = (link.get("href") or "").strip()
        if not href or href.startswith(("#", "mailto:", "tel:", "javascript:", "data:")):
            continue
        if href.startswith(("http://", "https://", "//")):
            host = urllib.parse.urlparse(href if "//" not in href[:2] else "https:" + href).netloc.lower()
            host = host.split("@")[-1].split(":")[0].lstrip("www.")
            if host == base or host.endswith("." + base):
                internal += 1
            else:
                external += 1
        else:
            internal += 1      # relative -> same site
    return {"internal_links": internal, "external_links": external}


def load_config():
    # A malformed config.json used to abort the connector with a raw JSONDecodeError
    # traceback. Report it and fall back to defaults instead.
    try:
        if CONFIG_PATH.exists():
            with open(CONFIG_PATH) as f:
                return json.load(f)
        return {"defaults": {"target_domain": "", "target_url": "",
                             "output_dir": "3_MEMORY/seo_exports"}}
    except (json.JSONDecodeError, OSError) as e:
        print(f"[!] config.json unreadable ({e}); using defaults.")
        return {"defaults": {"target_domain": "", "target_url": "",
                             "output_dir": "3_MEMORY/seo_exports"}}

def safe_get(url, timeout=15, follow_redirects=True, max_redirects=5):
    """HTTP GET that re-validates EVERY hop (SSRF defense). Redirects are followed manually so a
    3xx Location to an internal/metadata IP is blocked before the next fetch."""
    redirect_chain = [url]
    current_url = url
    opener = urllib.request.build_opener(_NoRedirectHandler())
    for _ in range(max_redirects + 1):
        try:
            assert_safe_url(current_url)
        except Exception as e:
            return {"url": current_url, "status": 0, "content": "",
                    "error": f"blocked unsafe url: {e}", "redirect_chain": redirect_chain}
        try:
            req = urllib.request.Request(current_url, headers=HEADERS)
            with opener.open(req, timeout=timeout) as resp:
                status = getattr(resp, "status", 200)
                if follow_redirects and status in (301, 302, 303, 307, 308):
                    loc = resp.headers.get("Location")
                    if not loc:
                        return {"url": current_url, "status": status, "content": "",
                                "redirect_chain": redirect_chain, "final_url": current_url}
                    current_url = urllib.parse.urljoin(current_url, loc)
                    redirect_chain.append(current_url)
                    continue
                return {
                    "url": current_url, "status": status,
                    "content": resp.read().decode("utf-8", errors="replace"),
                    "headers": dict(resp.headers),
                    "redirect_chain": redirect_chain, "final_url": current_url,
                }
        except urllib.error.HTTPError as e:
            return {"url": current_url, "status": e.code, "content": "", "error": str(e)}
        except urllib.error.URLError as e:
            return {"url": current_url, "status": 0, "content": "", "error": str(e)}
        except Exception as e:
            return {"url": current_url, "status": 0, "content": "", "error": str(e)}
    return {"url": url, "status": 0, "error": "Too many redirects"}

def get_status_only(url, timeout=10):
    """HEAD request for fast status check (SSRF-guarded)."""
    try:
        assert_safe_url(url)
    except Exception:
        return 0
    try:
        req = urllib.request.Request(url, headers=HEADERS, method="HEAD")
        with safe_urlopen(req, timeout=timeout, context=CTX) as resp:
            return resp.status
    except urllib.error.HTTPError as e:
        return e.code
    except (urllib.error.URLError, OSError, ValueError):
        # Network/DNS/SSL failure — caller treats 0 as "unreachable".
        return 0

# ── HTML Parser ──────────────────────────────────────────────────────────────

class SEOHTMLParser(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = ""
        self.meta_description = ""
        self.meta_robots = ""
        self.canonical = ""
        self.h1s = []
        self.h2s = []
        self.links = []  # internal + external
        self.images = []
        self.hreflang = []
        self.schema_types = []
        self.viewport = ""
        self.in_title = False
        self.in_script = False
        self.script_content = ""

    def handle_starttag(self, tag, attrs):
        # HTMLParser yields None as the value of a valueless attribute (`<meta name>`, `<a href>`,
        # `<link rel>`). Every `.get(...).lower()` below then raised AttributeError, and nothing
        # caught it up through check_page_seo -> crawl_key_pages -> run: ONE malformed tag anywhere
        # on a page aborted the entire site scan. Normalise None to "" at the boundary.
        attrs = {k: (v if v is not None else "") for k, v in attrs}
        if tag == "title":
            self.in_title = True
        elif tag == "script":
            self.in_script = True
            if attrs.get("type") == "application/ld+json":
                self.in_script = "json_ld"
        elif tag == "meta":
            name = attrs.get("name", "").lower()
            prop = attrs.get("property", "").lower()
            if name == "description":
                self.meta_description = attrs.get("content", "")
            elif name == "robots":
                self.meta_robots = attrs.get("content", "")
            elif name == "viewport":
                self.viewport = attrs.get("content", "")
        elif tag == "link":
            rel = attrs.get("rel", "").lower()
            if rel == "canonical":
                self.canonical = attrs.get("href", "")
            elif rel == "alternate":
                hreflang = attrs.get("hreflang", "")
                if hreflang:
                    self.hreflang.append({"lang": hreflang, "href": attrs.get("href", "")})
        elif tag == "a":
            href = attrs.get("href", "")
            if href and not href.startswith(("#", "javascript:", "mailto:", "tel:")):
                self.links.append({"href": href, "rel": attrs.get("rel", "")})
        elif tag == "img":
            self.images.append({
                "src": attrs.get("src", ""),
                "alt": attrs.get("alt"),  # None if missing
                "loading": attrs.get("loading", ""),
                "width": attrs.get("width", ""),
                "height": attrs.get("height", ""),
            })
        elif tag in ("h1", "h2"):
            self._current_heading = tag

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        elif self.in_script == "json_ld":
            self.script_content += data
        if hasattr(self, "_current_heading"):
            tag = self._current_heading
            if tag == "h1":
                self.h1s.append(data.strip())
            elif tag == "h2":
                self.h2s.append(data.strip())
            self._current_heading = None

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        elif tag == "script":
            if self.in_script == "json_ld" and self.script_content.strip():
                try:
                    data = json.loads(self.script_content)
                    types = []
                    if isinstance(data, dict):
                        t = data.get("@type", "")
                        if t:
                            types.append(t)
                    elif isinstance(data, list):
                        for item in data:
                            t = item.get("@type", "")
                            if t:
                                types.append(t)
                    self.schema_types.extend(types)
                except Exception:
                    pass
            self.in_script = False
            self.script_content = ""
        elif tag in ("h1", "h2"):
            self._current_heading = None

def parse_html(html_content):
    parser = SEOHTMLParser()
    parser.feed(html_content)
    return parser

# ── Individual Checks ────────────────────────────────────────────────────────

def check_robots_txt(base_url):
    print("📡 Checking robots.txt...")
    url = base_url.rstrip("/") + "/robots.txt"
    resp = safe_get(url)
    issues = []
    data = {"url": url, "status": resp.get("status"), "content": "", "sitemaps": [], "disallows": [], "issues": []}

    if resp.get("status") != 200:
        issues.append({"severity": "🔴 Critical", "issue": "robots.txt not found or inaccessible", "fix": "Create /robots.txt"})
        data["issues"] = issues
        return data

    content = resp.get("content", "")
    data["content"] = content[:2000]

    # Parse robots.txt
    for line in content.split("\n"):
        line = line.strip()
        if line.lower().startswith("sitemap:"):
            data["sitemaps"].append(line.split(":", 1)[1].strip())
        elif line.lower().startswith("disallow:"):
            path = line.split(":", 1)[1].strip()
            if path:
                data["disallows"].append(path)

    # Check for blocking everything.
    # This was a SUBSTRING test: "Disallow: /" is contained in "Disallow: /private/", so any site
    # that blocks a single folder — i.e. most sites — was reported as blocking ALL crawlers. It is
    # a whole-line match, and only a `Disallow: /` that applies to `User-agent: *` counts.
    blocks_everything = False
    applies_to_all = False
    for raw in content.splitlines():
        line = raw.split("#", 1)[0].strip()
        if not line or ":" not in line:
            continue
        field, _, value = line.partition(":")
        field, value = field.strip().lower(), value.strip()
        if field == "user-agent":
            applies_to_all = value == "*"
        elif field == "disallow" and applies_to_all and value == "/":
            blocks_everything = True
        elif field == "allow" and applies_to_all and value == "/":
            blocks_everything = False
    if blocks_everything:
        issues.append({"severity": "🔴 Critical", "issue": "robots.txt blocks ALL crawlers (Disallow: /)", "fix": "Fix robots.txt — Googlebot cannot crawl"})
    if not data["sitemaps"]:
        issues.append({"severity": "🟡 Medium", "issue": "No Sitemap directive in robots.txt", "fix": "Add: Sitemap: https://yourdomain.com/sitemap.xml"})
    if "Crawl-delay" in content:
        issues.append({"severity": "🟡 Low", "issue": "Crawl-delay set — may slow Googlebot", "fix": "Remove Crawl-delay (Google ignores it, but may cause issues)"})

    data["issues"] = issues
    print(f"   ✅ robots.txt OK | Sitemaps: {len(data['sitemaps'])} | Issues: {len(issues)}")
    return data

def check_sitemap(base_url, robots_data):
    print("📡 Checking sitemap.xml...")
    # Try common sitemap URLs
    sitemap_urls = robots_data.get("sitemaps", [])
    if not sitemap_urls:
        sitemap_urls = [base_url.rstrip("/") + "/sitemap.xml",
                        base_url.rstrip("/") + "/sitemap_index.xml"]

    issues = []
    total_urls = 0
    data = {"sitemaps_found": [], "total_urls": 0, "issues": []}

    for sm_url in sitemap_urls[:3]:
        resp = safe_get(sm_url)
        if resp.get("status") == 200:
            content = resp.get("content", "")
            url_count = content.count("<url>") + content.count("<sitemap>")
            total_urls += url_count
            data["sitemaps_found"].append({"url": sm_url, "url_count": url_count})

            # Check lastmod freshness
            if "<lastmod>" in content:
                import re
                dates = re.findall(r"<lastmod>(\d{4}-\d{2}-\d{2})", content)
                if dates:
                    latest = max(dates)
                    days_old = (datetime.now() - datetime.strptime(latest, "%Y-%m-%d")).days
                    if days_old > 90:
                        issues.append({"severity": "🟡 Medium",
                                       "issue": f"Sitemap lastmod is {days_old} days old",
                                       "fix": "Update sitemap with fresh lastmod dates"})
        else:
            issues.append({"severity": "🟡 High",
                           "issue": f"Sitemap not accessible: {sm_url} (status {resp.get('status')})",
                           "fix": "Ensure sitemap URL is accessible"})

    if not data["sitemaps_found"]:
        issues.append({"severity": "🔴 Critical", "issue": "No sitemap found",
                       "fix": "Create and submit sitemap.xml to GSC"})
    elif total_urls == 0:
        issues.append({"severity": "🔴 High", "issue": "Sitemap found but contains 0 URLs",
                       "fix": "Check sitemap generation — may be empty/broken"})

    data["total_urls"] = total_urls
    data["issues"] = issues
    print(f"   ✅ Sitemaps: {len(data['sitemaps_found'])} | URLs: {total_urls} | Issues: {len(issues)}")
    return data

def check_page_seo(url, base_domain):
    """Full on-page SEO check for a single URL"""
    resp = safe_get(url)
    if resp.get("status") != 200:
        return {"url": url, "status": resp.get("status"), "issues": [
            {"severity": "🔴 Critical", "issue": f"Page returns {resp.get('status')}", "fix": "Fix URL or redirect"}
        ]}

    parsed = parse_html(resp.get("content", ""))
    final_url = resp.get("final_url", url)
    issues = []

    # Title
    title = parsed.title.strip()
    if not title:
        issues.append({"severity": "🔴 Critical", "issue": "Missing title tag", "fix": "Add unique descriptive title (50-60 chars)"})
    elif len(title) < 30:
        issues.append({"severity": "🟡 Medium", "issue": f"Title too short: {len(title)} chars", "fix": "Expand title to 50-60 chars"})
    elif len(title) > 65:
        issues.append({"severity": "🟡 Medium", "issue": f"Title too long: {len(title)} chars (will truncate)", "fix": "Shorten title to 50-60 chars"})

    # Meta description
    meta_desc = parsed.meta_description.strip()
    if not meta_desc:
        issues.append({"severity": "🟡 High", "issue": "Missing meta description", "fix": "Add compelling meta description (120-160 chars)"})
    elif len(meta_desc) > 165:
        issues.append({"severity": "🟡 Low", "issue": f"Meta description too long: {len(meta_desc)} chars", "fix": "Shorten to 120-160 chars"})

    # H1
    if not parsed.h1s:
        issues.append({"severity": "🔴 Critical", "issue": "Missing H1 tag", "fix": "Add exactly one H1 with primary keyword"})
    elif len(parsed.h1s) > 1:
        issues.append({"severity": "🟡 Medium", "issue": f"Multiple H1 tags ({len(parsed.h1s)})", "fix": "Use only one H1 per page"})

    # Canonical
    if not parsed.canonical:
        issues.append({"severity": "🟡 Medium", "issue": "Missing canonical tag", "fix": "Add self-referencing canonical tag"})
    elif parsed.canonical != final_url and parsed.canonical != url:
        issues.append({"severity": "🟡 High", "issue": f"Canonical points elsewhere: {parsed.canonical}", "fix": "Verify canonical is intentional"})

    # Meta robots
    if "noindex" in parsed.meta_robots.lower():
        issues.append({"severity": "🔴 Critical", "issue": "Page has noindex meta tag — NOT indexed by Google", "fix": "Remove noindex if page should be indexed"})

    # Viewport
    if not parsed.viewport:
        issues.append({"severity": "🔴 Critical", "issue": "Missing viewport meta tag — not mobile-friendly", "fix": 'Add: <meta name="viewport" content="width=device-width, initial-scale=1">'})
    elif "maximum-scale=1" in parsed.viewport or "user-scalable=no" in parsed.viewport:
        issues.append({"severity": "🟡 High", "issue": "Viewport blocks user scaling (accessibility/CWV issue)", "fix": "Remove maximum-scale=1 and user-scalable=no"})

    # Images
    no_alt = [img for img in parsed.images if img["alt"] is None]
    empty_alt = [img for img in parsed.images if img["alt"] == ""]
    no_dimensions = [img for img in parsed.images if not img["width"] or not img["height"]]
    if no_alt:
        issues.append({"severity": "🟡 High", "issue": f"{len(no_alt)} images missing alt attribute", "fix": "Add descriptive alt text to all images"})
    if no_dimensions:
        issues.append({"severity": "🟡 Medium", "issue": f"{len(no_dimensions)} images missing width/height (CLS risk)", "fix": "Add width and height attributes to prevent layout shift"})

    # Schema
    schema_str = ", ".join(parsed.schema_types) if parsed.schema_types else "None"

    return {
        "url": url,
        "final_url": final_url,
        "status": resp.get("status"),
        "title": title,
        "title_len": len(title),
        "meta_description": meta_desc[:120],
        "meta_description_len": len(meta_desc),
        "h1": parsed.h1s[0] if parsed.h1s else "",
        "h1_count": len(parsed.h1s),
        "h2_count": len(parsed.h2s),
        "canonical": parsed.canonical,
        "meta_robots": parsed.meta_robots,
        "viewport": parsed.viewport,
        "schema_types": schema_str,
        "image_count": len(parsed.images),
        "images_no_alt": len(no_alt),
        "images_no_dimensions": len(no_dimensions),
        # Relative hrefs ("/about", "contact.html") contain no domain and don't start with http, so
        # the old pair of comprehensions counted them as NEITHER internal nor external — on most
        # sites that is the majority of links, making internal-link analysis silently meaningless.
        # `base_domain in href` also matched "https://evil.com/?ref=example.com".
        **_classify_links(parsed.links, base_domain),
        "hreflang_count": len(parsed.hreflang),
        "issues": issues,
        "issue_count": len(issues)
    }

def check_https(base_url):
    """Check HTTPS redirect and certificate"""
    print("📡 Checking HTTPS...")
    issues = []
    domain = urllib.parse.urlparse(base_url).netloc
    http_url = f"http://{domain}/"
    resp = safe_get(http_url)
    final = resp.get("final_url", "")
    if final and not final.startswith("https://"):
        issues.append({"severity": "🔴 Critical", "issue": "HTTP does not redirect to HTTPS",
                       "fix": "Force HTTPS redirect at server level"})
    elif final and final.startswith("https://"):
        pass  # Good
    return {"https_redirect": final.startswith("https://") if final else False, "issues": issues}

def crawl_key_pages(base_url, base_domain, max_pages=20):
    """Crawl homepage + sitemap URLs for technical issues"""
    print(f"📡 Crawling up to {max_pages} key pages...")
    pages_to_check = [base_url]

    # Try sitemap for more URLs
    sm_resp = safe_get(base_url.rstrip("/") + "/sitemap.xml")
    if sm_resp.get("status") == 200:
        import re
        urls = re.findall(r"<loc>(https?://[^<]+)</loc>", sm_resp.get("content", ""))
        pages_to_check.extend(urls[:max_pages-1])

    pages_to_check = list(dict.fromkeys(pages_to_check))[:max_pages]
    results = []
    for i, url in enumerate(pages_to_check):
        print(f"   [{i+1}/{len(pages_to_check)}] {url[:60]}...")
        result = check_page_seo(url, base_domain)
        results.append(result)
        time.sleep(0.5)  # Polite crawling
    print(f"   ✅ Crawled {len(results)} pages")
    return results

# ── Output ────────────────────────────────────────────────────────────────────

def write_technical_report(domain, date_str, robots, sitemap_data, https_data, pages, output_dir):
    out = Path(output_dir) / domain
    out.mkdir(parents=True, exist_ok=True)

    # Aggregate all issues
    all_issues = []
    for item in [robots, sitemap_data, https_data]:
        for issue in item.get("issues", []):
            all_issues.append({**issue, "source": item.get("url", "Site-wide")})
    for page in pages:
        for issue in page.get("issues", []):
            all_issues.append({**issue, "source": page["url"]})

    critical = [i for i in all_issues if "Critical" in i.get("severity","")]
    high = [i for i in all_issues if "High" in i.get("severity","") and "Critical" not in i.get("severity","")]
    medium = [i for i in all_issues if "Medium" in i.get("severity","")]

    # CSV
    csv_path = out / f"technical_seo_{domain}_{date_str}.csv"
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["url", "status", "title", "title_len", "meta_desc_len",
                         "h1", "h1_count", "canonical", "meta_robots", "viewport",
                         "schema_types", "images_total", "images_no_alt",
                         "internal_links", "hreflang_count", "issue_count"])
        for p in pages:
            writer.writerow([
                p.get("url",""), p.get("status",""), p.get("title","")[:80],
                p.get("title_len",0), p.get("meta_description_len",0),
                p.get("h1","")[:80], p.get("h1_count",0), p.get("canonical",""),
                p.get("meta_robots",""), p.get("viewport",""),
                p.get("schema_types",""), p.get("image_count",0),
                p.get("images_no_alt",0), p.get("internal_links",0),
                p.get("hreflang_count",0), p.get("issue_count",0)
            ])
    print(f"   💾 Technical CSV: {csv_path}")

    # Markdown
    md_path = out / f"technical_seo_{domain}_{date_str}.md"
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(f"# Technical SEO Audit — {domain}\n")
        f.write(f"> Date: {date_str} | Pages crawled: {len(pages)} | SEOSONA OS\n\n---\n\n")

        f.write(f"## 🚨 Issues Summary\n\n")
        f.write(f"| Severity | Count |\n|----------|-------|\n")
        f.write(f"| 🔴 Critical | {len(critical)} |\n")
        f.write(f"| 🟡 High | {len(high)} |\n")
        f.write(f"| 🟡 Medium | {len(medium)} |\n")
        f.write(f"| **Total** | **{len(all_issues)}** |\n\n")

        for severity_label, issues_list in [("🔴 Critical", critical), ("🟡 High", high), ("🟡 Medium", medium)]:
            if issues_list:
                f.write(f"\n## {severity_label} Issues\n\n")
                f.write("| Source | Issue | Fix |\n|--------|-------|-----|\n")
                for issue in issues_list[:30]:
                    src = issue.get("source","")[-60:]
                    f.write(f"| {src} | {issue.get('issue','')} | {issue.get('fix','')} |\n")

        f.write(f"\n## 🗺️ robots.txt\n\n")
        f.write(f"- Status: {robots.get('status')}\n")
        f.write(f"- Sitemaps declared: {', '.join(robots.get('sitemaps',[])) or 'None'}\n")
        f.write(f"- Disallow rules: {len(robots.get('disallows',[]))}\n\n")

        f.write(f"## 🗺️ Sitemap\n\n")
        for sm in sitemap_data.get("sitemaps_found", []):
            f.write(f"- `{sm['url']}` — {sm['url_count']} URLs\n")
        f.write(f"- Total URLs: {sitemap_data.get('total_urls',0)}\n\n")

        f.write(f"## 📄 Page-by-Page Overview\n\n")
        f.write("| URL | Status | Title | H1 | Schema | Issues |\n")
        f.write("|-----|--------|-------|-----|--------|--------|\n")
        for p in pages:
            status_icon = "✅" if p.get("status")==200 else "❌"
            f.write(f"| {p.get('url','')[-50:]} | {status_icon} {p.get('status','')} | "
                    f"{p.get('title','')[:40]} | {p.get('h1_count',0)} | "
                    f"{p.get('schema_types','None')[:30]} | {p.get('issue_count',0)} |\n")

        f.write(f"\n---\n*SEOSONA OS — Technical SEO Scanner | No API key required*\n")

    print(f"   💾 Technical Report: {md_path}")
    return {"critical": len(critical), "high": len(high), "total": len(all_issues)}

def run(domain=None, url=None, max_pages=20):
    config = load_config()
    if not domain:
        domain = config["defaults"]["target_domain"]
    if not url:
        url = config["defaults"]["target_url"]

    base_domain = urllib.parse.urlparse(url).netloc
    date_str = datetime.now().strftime("%Y-%m-%d")
    output_dir = ROOT / config["defaults"]["output_dir"]

    print(f"\n🚀 SEOSONA Technical SEO Scanner — {domain}")
    print(f"   Base URL: {url} | Max pages: {max_pages}\n")

    robots = check_robots_txt(url)
    sitemap_data = check_sitemap(url, robots)
    https_data = check_https(url)
    pages = crawl_key_pages(url, base_domain, max_pages)

    print(f"\n💾 Writing technical SEO report...")
    summary = write_technical_report(domain, date_str, robots, sitemap_data, https_data, pages, output_dir)

    print(f"\n✅ Technical SEO scan complete!")
    print(f"   🔴 Critical: {summary['critical']} | 🟡 High: {summary['high']} | Total: {summary['total']}")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="SEOSONA Technical SEO Scanner")
    parser.add_argument("--domain", default=None)
    parser.add_argument("--url", default=None)
    parser.add_argument("--max-pages", type=int, default=20)
    args = parser.parse_args()
    run(domain=args.domain, url=args.url, max_pages=args.max_pages)
