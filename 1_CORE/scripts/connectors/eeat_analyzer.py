#!/usr/bin/env python3
"""
SEOSONA OS — E-E-A-T Analyzer + Content Quality Scanner
Checks: Author signals, Trust signals, Content freshness, Thin content,
        Readability, Duplicate metas, Contact/About page quality
NO API KEY — pure HTTP + HTML analysis
"""

import json
import csv
import re
import urllib.request
import urllib.parse
import ssl
import time
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).parent.parent.parent.parent
CONFIG_PATH = ROOT / "3_MEMORY" / "specs" / "config.json"
CTX = ssl.create_default_context()
# TLS validation is enabled (do not disable check_hostname or CERT_NONE)
HEADERS = {"User-Agent": "SEOSONA-OS-EEATAnalyzer/1.0"}

def load_config():
    if CONFIG_PATH.exists():
        with open(CONFIG_PATH) as f:
            return json.load(f)
    return {"defaults": {"target_domain": "", "target_url": "",
                         "output_dir": "3_MEMORY/seo_exports"}}

def fetch(url, timeout=15):
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=timeout, context=CTX) as resp:
            return resp.read().decode("utf-8", errors="replace"), resp.status
    except Exception as e:
        return "", 0

def extract_text(html):
    """Strip HTML tags → plain text"""
    text = re.sub(r'<script[^>]*>.*?</script>', ' ', html, flags=re.DOTALL)
    text = re.sub(r'<style[^>]*>.*?</style>', ' ', text, flags=re.DOTALL)
    text = re.sub(r'<[^>]+>', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def count_words(text):
    return len(text.split())

def check_readability(text):
    """Simple readability metrics"""
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if len(s.strip()) > 10]
    words = text.split()
    avg_sentence_len = len(words) / max(len(sentences), 1)
    # Long sentences (>25 words) are harder to read
    long_sentences = [s for s in sentences if len(s.split()) > 25]
    return {
        "word_count": len(words),
        "sentence_count": len(sentences),
        "avg_sentence_length": round(avg_sentence_len, 1),
        "long_sentence_count": len(long_sentences),
        "readability_flag": "🔴 Hard" if avg_sentence_len > 25 else "🟡 Moderate" if avg_sentence_len > 18 else "🟢 Good"
    }

# ── Trust Signal Checks ──────────────────────────────────────────────────────

def check_trust_pages(base_url, domain):
    """Check existence and quality of trust pages"""
    print("📡 Checking trust pages (About, Contact, Privacy, Terms)...")
    trust_paths = {
        "about": ["/about", "/about-us", "/ve-chung-toi", "/gioi-thieu"],
        "contact": ["/contact", "/contact-us", "/lien-he"],
        "privacy": ["/privacy-policy", "/privacy", "/chinh-sach-bao-mat"],
        "terms": ["/terms", "/terms-of-service", "/terms-and-conditions", "/dieu-khoan"],
        "return_policy": ["/return-policy", "/refund-policy", "/chinh-sach-doi-tra"],
    }
    found = {}
    missing = []
    for page_type, paths in trust_paths.items():
        page_found = False
        for path in paths:
            url = base_url.rstrip("/") + path
            _, status = fetch(url)
            if status == 200:
                found[page_type] = url
                page_found = True
                break
        if not page_found:
            missing.append(page_type)

    issues = []
    if "contact" in missing:
        issues.append({"severity": "🔴 Critical", "issue": "No contact page found",
                       "fix": "Create /contact page with address, phone, email, map"})
    if "about" in missing:
        issues.append({"severity": "🟡 High", "issue": "No about page found",
                       "fix": "Create /about with company story, team, credentials"})
    if "privacy" in missing:
        issues.append({"severity": "🟡 High", "issue": "No privacy policy page",
                       "fix": "Required for compliance and Google trust signals"})
    if "return_policy" in missing:
        issues.append({"severity": "🟡 Medium", "issue": "No return/refund policy page",
                       "fix": "Required for e-commerce trust and Product schema"})

    print(f"   ✅ Found: {list(found.keys())} | Missing: {missing}")
    return {"found": found, "missing": missing, "issues": issues}

def check_contact_info(html, page_type="homepage"):
    """Extract and validate contact information"""
    phone_pattern = r'(\+?\d[\d\s\-().]{7,15})'
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    address_patterns = [r'(?:address|location)[^<]{10,100}', r'\d+[^<]*(?:street|ave|road|blvd|st\b|rd\b)']

    phones = re.findall(phone_pattern, html)
    emails = re.findall(email_pattern, html)
    addresses = re.findall('|'.join(address_patterns), html, re.IGNORECASE)

    issues = []
    if not phones:
        issues.append({"severity": "🟡 High", "issue": f"No phone number detected on {page_type}",
                       "fix": "Add clickable phone number (tel: link) for mobile users"})
    if not emails:
        issues.append({"severity": "🟡 Medium", "issue": f"No email address on {page_type}",
                       "fix": "Add contact email (use contact form if privacy concerned)"})
    if not addresses:
        issues.append({"severity": "🟡 Medium", "issue": f"No physical address detected on {page_type}",
                       "fix": "Add full address for LocalBusiness E-E-A-T signals"})

    return {"phones": len(phones), "emails": len(emails), "addresses": len(addresses), "issues": issues}

def check_eeat_signals(html, url):
    """Check E-E-A-T signals on a page"""
    issues = []
    signals = {}

    # Author signal
    author_patterns = [r'(?:author|written by|by)[^<]{3,50}', r'"author"[^}]{20,100}']
    has_author = any(re.search(p, html, re.IGNORECASE) for p in author_patterns)
    signals["has_author"] = has_author
    if not has_author:
        issues.append({"severity": "🟡 Medium", "issue": "No author attribution found",
                       "fix": "Add author name + bio for blog/article pages (E-E-A-T signal)"})

    # Date signals
    date_pattern = r'\d{4}-\d{2}-\d{2}|(?:updated|published|date)[^<]{5,30}\d{1,2}/\d{1,2}/\d{4}'
    has_dates = bool(re.search(date_pattern, html))
    signals["has_dates"] = has_dates
    if not has_dates:
        issues.append({"severity": "🟡 Low", "issue": "No publication/update dates detected",
                       "fix": "Add published + last updated dates (freshness signal)"})

    # Review/rating signals
    has_reviews = any(word in html.lower() for word in ["review", "rating", "star", "feedback", "testimonial"])
    signals["has_reviews"] = has_reviews

    # Expertise signals
    expertise_words = ["expert", "certified", "authorized", "distributor",
                       "specialist", "professional", "accredited", "official", "manufacturer"]
    has_expertise = any(w in html.lower() for w in expertise_words)
    signals["has_expertise"] = has_expertise
    if not has_expertise:
        issues.append({"severity": "🟡 Low", "issue": "Limited expertise signals",
                       "fix": "Add distributor credentials, years of experience, certifications"})

    # SSL/HTTPS (checked separately)
    is_https = url.startswith("https://")
    signals["is_https"] = is_https

    return {"signals": signals, "issues": issues}

def check_content_freshness(html):
    """Check for date signals indicating fresh content"""
    patterns = [
        r'(?:updated?|modified|last modified)[^<]*(\d{4})',
        r'<time[^>]*datetime=["\']( \d{4}-\d{2}-\d{2})',
        r'"dateModified"[^"]*"(\d{4}-\d{2}-\d{2})',
        r'"datePublished"[^"]*"(\d{4}-\d{2}-\d{2})',
    ]
    years = []
    for p in patterns:
        matches = re.findall(p, html, re.IGNORECASE)
        years.extend([m[:4] for m in matches if m[:4].isdigit()])

    if years:
        latest_year = max(set(years))
        current_year = str(datetime.now().year)
        is_fresh = latest_year >= str(int(current_year) - 1)
        return {"latest_year": latest_year, "is_fresh": is_fresh}
    return {"latest_year": "Unknown", "is_fresh": None}

# ── Topical Authority + Internal Links ──────────────────────────────────────

def crawl_site_pages(base_url, base_domain, max_pages=30):
    """Crawl site and extract all pages + their topics"""
    print(f"📡 Crawling site for content analysis ({max_pages} pages max)...")
    visited = set()
    to_visit = [base_url]
    pages = []

    # Also add sitemap URLs
    sm_html, _ = fetch(base_url.rstrip("/") + "/sitemap.xml")
    if sm_html:
        sm_urls = re.findall(r"<loc>(https?://[^<]+)</loc>", sm_html)
        to_visit.extend([u for u in sm_urls if base_domain in u])

    to_visit = list(dict.fromkeys(to_visit))

    for url in to_visit[:max_pages]:
        if url in visited:
            continue
        visited.add(url)

        html, status = fetch(url)
        if status != 200:
            continue

        # Extract key data
        title_match = re.search(r'<title[^>]*>(.*?)</title>', html, re.DOTALL)
        h1_match = re.search(r'<h1[^>]*>(.*?)</h1>', html, re.DOTALL)
        text = extract_text(html)
        readability = check_readability(text)

        # Extract internal links
        links = re.findall(r'href=["\'](/[^"\'#?][^"\']*)["\']', html)
        internal_links = list(set([base_url.rstrip("/") + l for l in links
                                   if not l.endswith((".jpg",".png",".pdf",".css",".js"))]))

        # Extract headings for topic analysis
        headings = re.findall(r'<h[1-3][^>]*>(.*?)</h[1-3]>', html, re.DOTALL)
        headings = [re.sub(r'<[^>]+>', '', h).strip() for h in headings]

        pages.append({
            "url": url,
            "status": status,
            "title": re.sub(r'<[^>]+>', '', title_match.group(1)).strip() if title_match else "",
            "h1": re.sub(r'<[^>]+>', '', h1_match.group(1)).strip() if h1_match else "",
            "word_count": readability["word_count"],
            "avg_sentence_len": readability["avg_sentence_length"],
            "readability": readability["readability_flag"],
            "internal_link_count": len(internal_links),
            "headings": headings[:10],
            "internal_link_targets": internal_links[:20],
            "is_thin": readability["word_count"] < 300,
        })
        time.sleep(0.4)

    print(f"   ✅ Crawled {len(pages)} pages")
    return pages

def analyze_internal_links(pages):
    """Map internal link structure → find orphan pages"""
    all_urls = {p["url"] for p in pages}
    link_count_to = {url: 0 for url in all_urls}

    for page in pages:
        for target in page.get("internal_link_targets", []):
            if target in link_count_to:
                link_count_to[target] += 1

    orphans = [url for url, count in link_count_to.items() if count == 0]
    well_linked = sorted(link_count_to.items(), key=lambda x: x[1], reverse=True)

    return {
        "orphan_pages": orphans,
        "most_linked": well_linked[:10],
        "least_linked": well_linked[-10:],
        "total_internal_links": sum(link_count_to.values())
    }

def analyze_topical_coverage(pages):
    """Identify topic clusters from headings — domain-agnostic approach using TF analysis"""
    # Build vocabulary from the actual site's headings (no hardcoded domain assumptions)
    word_freq = {}
    for page in pages:
        content = " ".join([
            page.get("title", ""), page.get("h1", ""),
            " ".join(page.get("headings", []))
        ]).lower()
        for word in re.findall(r'[a-z\u00c0-\u024f\u1e00-\u1eff]{4,}', content):
            word_freq[word] = word_freq.get(word, 0) + 1

    # Top 7 most frequent meaningful terms become topic clusters
    stopwords = {"that", "this", "with", "from", "have", "been", "will", "your",
                 "page", "home", "menu", "more", "view", "read", "click", "here"}
    topic_words = [w for w, _ in sorted(word_freq.items(), key=lambda x: x[1], reverse=True)
                   if w not in stopwords][:7]

    coverage = {}
    for topic in topic_words:
        count = sum(1 for p in pages if topic in (
            p.get("title", "") + " " + p.get("h1", "") + " " + " ".join(p.get("headings", []))
        ).lower())
        coverage[topic] = count

    return coverage

def run(domain=None, url=None, max_pages=25):
    config = load_config()
    if not domain:
        domain = config["defaults"]["target_domain"]
    if not url:
        url = config["defaults"]["target_url"]

    base_domain = urllib.parse.urlparse(url).netloc
    date_str = datetime.now().strftime("%Y-%m-%d")
    output_dir = ROOT / config["defaults"]["output_dir"]
    out = Path(output_dir) / domain
    out.mkdir(parents=True, exist_ok=True)

    print(f"\n🚀 SEOSONA E-E-A-T + Content Analyzer — {domain}\n")

    # Homepage analysis
    homepage_html, _ = fetch(url)
    trust_pages = check_trust_pages(url, base_domain)
    contact_info = check_contact_info(homepage_html, "homepage")
    eeat = check_eeat_signals(homepage_html, url)
    freshness = check_content_freshness(homepage_html)

    # Full site crawl
    pages = crawl_site_pages(url, base_domain, max_pages)
    internal_links = analyze_internal_links(pages)
    topical = analyze_topical_coverage(pages)

    # Aggregate issues
    all_issues = (trust_pages["issues"] + contact_info["issues"] + eeat["issues"])
    thin_pages = [p for p in pages if p["is_thin"]]
    if thin_pages:
        all_issues.append({"severity": "🟡 High",
                           "issue": f"{len(thin_pages)} thin pages (< 300 words)",
                           "fix": "Expand content or consolidate/noindex thin pages"})
    if internal_links["orphan_pages"]:
        all_issues.append({"severity": "🟡 High",
                           "issue": f"{len(internal_links['orphan_pages'])} orphan pages (no internal links pointing to them)",
                           "fix": "Add internal links to orphan pages from relevant hub pages"})

    # Calculate E-E-A-T score (simplified)
    eeat_score = 0
    signals = eeat["signals"]
    if trust_pages["found"].get("about"): eeat_score += 15
    if trust_pages["found"].get("contact"): eeat_score += 15
    if trust_pages["found"].get("privacy"): eeat_score += 10
    if signals.get("has_author"): eeat_score += 10
    if signals.get("has_dates"): eeat_score += 10
    if signals.get("has_reviews"): eeat_score += 10
    if signals.get("has_expertise"): eeat_score += 10
    if signals.get("is_https"): eeat_score += 10
    if contact_info["phones"] > 0: eeat_score += 5
    if contact_info["addresses"] > 0: eeat_score += 5

    eeat_grade = "🟢 Good" if eeat_score >= 75 else "🟡 Moderate" if eeat_score >= 50 else "🔴 Poor"

    # Write CSV
    csv_path = out / f"eeat_report_{domain}_{date_str}.csv"
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["url", "word_count", "readability", "is_thin", "internal_links",
                         "avg_sentence_len", "h1", "title", "heading_topics"])
        for p in pages:
            writer.writerow([
                p["url"], p["word_count"], p["readability"], p["is_thin"],
                p["internal_link_count"], p["avg_sentence_len"],
                p["h1"][:60], p["title"][:60], "|".join(p["headings"][:5])
            ])
    print(f"   💾 E-E-A-T CSV: {csv_path}")

    # Write Markdown
    md_path = out / f"eeat_report_{domain}_{date_str}.md"
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(f"# E-E-A-T + Content Quality Report — {domain}\n")
        f.write(f"> Date: {date_str} | Pages analyzed: {len(pages)} | SEOSONA OS\n\n---\n\n")

        f.write(f"## 🏆 E-E-A-T Score: {eeat_score}/100 — {eeat_grade}\n\n")
        f.write("| Signal | Status | Points |\n|--------|--------|--------|\n")
        f.write(f"| About page | {'✅' if trust_pages['found'].get('about') else '❌'} | 15 |\n")
        f.write(f"| Contact page | {'✅' if trust_pages['found'].get('contact') else '❌'} | 15 |\n")
        f.write(f"| Privacy policy | {'✅' if trust_pages['found'].get('privacy') else '❌'} | 10 |\n")
        f.write(f"| Author attribution | {'✅' if signals.get('has_author') else '❌'} | 10 |\n")
        f.write(f"| Publication dates | {'✅' if signals.get('has_dates') else '❌'} | 10 |\n")
        f.write(f"| Reviews/ratings | {'✅' if signals.get('has_reviews') else '❌'} | 10 |\n")
        f.write(f"| Expertise signals | {'✅' if signals.get('has_expertise') else '❌'} | 10 |\n")
        f.write(f"| HTTPS | {'✅' if signals.get('is_https') else '❌'} | 10 |\n")
        f.write(f"| Phone number | {'✅' if contact_info['phones']>0 else '❌'} | 5 |\n")
        f.write(f"| Physical address | {'✅' if contact_info['addresses']>0 else '❌'} | 5 |\n")

        f.write(f"\n## 🚨 Issues to Fix ({len(all_issues)} total)\n\n")
        f.write("| Severity | Issue | Fix |\n|----------|-------|-----|\n")
        for issue in all_issues:
            f.write(f"| {issue['severity']} | {issue['issue']} | {issue['fix']} |\n")

        f.write(f"\n## 📝 Content Quality Overview\n\n")
        total = len(pages)
        thin = len(thin_pages)
        f.write(f"- Total pages crawled: {total}\n")
        f.write(f"- Thin pages (< 300 words): {thin} ({thin/total*100:.0f}%)\n")
        f.write(f"- Orphan pages: {len(internal_links['orphan_pages'])}\n")
        f.write(f"- Content freshness: {freshness.get('latest_year','Unknown')} ({'Fresh ✅' if freshness.get('is_fresh') else 'Stale ⚠️'})\n\n")

        f.write(f"\n## 🔗 Internal Link Structure\n\n")
        f.write(f"- Total internal links mapped: {internal_links['total_internal_links']}\n")
        f.write(f"- Orphan pages (0 inbound links): {len(internal_links['orphan_pages'])}\n\n")
        if internal_links["orphan_pages"]:
            f.write("**Orphan pages (need internal links added):**\n")
            for url_orphan in internal_links["orphan_pages"][:10]:
                f.write(f"- {url_orphan}\n")

        f.write(f"\n## 🗺️ Topical Coverage Map\n\n")
        f.write("| Topic Cluster | Pages Covering | Coverage |\n|---------------|---------------|----------|\n")
        for topic, count in sorted(topical.items(), key=lambda x: x[1], reverse=True):
            coverage_icon = "🟢" if count >= 3 else "🟡" if count >= 1 else "🔴"
            f.write(f"| {topic} | {count} pages | {coverage_icon} |\n")

        f.write(f"\n## 📄 Page-by-Page Content Quality\n\n")
        f.write("| URL | Words | Readability | Thin? | Int Links |\n")
        f.write("|-----|-------|-------------|-------|----------|\n")
        for p in sorted(pages, key=lambda x: x["word_count"]):
            thin_flag = "❌ THIN" if p["is_thin"] else "✅"
            f.write(f"| {p['url'][-50:]} | {p['word_count']} | {p['readability']} | "
                    f"{thin_flag} | {p['internal_link_count']} |\n")

        f.write(f"\n---\n*SEOSONA OS — E-E-A-T + Content Analyzer | No API key required*\n")

    print(f"   💾 E-E-A-T Report: {md_path}")
    print(f"\n✅ E-E-A-T analysis complete!")
    print(f"   E-E-A-T Score: {eeat_score}/100 — {eeat_grade}")
    print(f"   Thin pages: {len(thin_pages)} | Orphan pages: {len(internal_links['orphan_pages'])}")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="SEOSONA E-E-A-T Analyzer")
    parser.add_argument("--domain", default=None)
    parser.add_argument("--url", default=None)
    parser.add_argument("--max-pages", type=int, default=25)
    args = parser.parse_args()
    run(domain=args.domain, url=args.url, max_pages=args.max_pages)
