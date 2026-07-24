import os
import csv
import json
import urllib.request
import urllib.error
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse, urljoin
from datetime import datetime

try:
    import os as _os, sys as _sys
    _sys.path.append(_os.path.dirname(__file__))
    from url_guard import assert_safe_url, safe_urlopen
except Exception:
    def assert_safe_url(u):
        raise RuntimeError("url_guard unavailable")

    def safe_urlopen(*_a, **_k):
        raise RuntimeError("url_guard unavailable")

class AEOParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_h2 = False
        self.in_h3 = False
        self.in_p = False
        self.in_ul = False
        self.in_li = False
        self.in_script = False
        self.text_content = ""
        
        self.current_tag = None
        self.last_h2_text = ""
        self.last_tag = None
        
        # AEO Metrics
        self.question_headings = 0
        self.direct_answers = 0
        self.lists_after_headings = 0
        self.has_faq_schema = False
        self.has_author_schema = False
        self.external_citations = 0
        self.original_research_signals = 0
        
        self.research_keywords = ["study", "survey", "data shows", "research", "we analyzed", "our data"]

    def handle_starttag(self, tag, attrs):
        self.current_tag = tag
        if tag == 'h2': self.in_h2 = True
        elif tag == 'h3': self.in_h3 = True
        elif tag == 'p': self.in_p = True
        elif tag == 'ul' or tag == 'ol': 
            self.in_ul = True
            if self.last_tag in ['h2', 'h3', 'p']:
                self.lists_after_headings += 1
        elif tag == 'li': self.in_li = True
        elif tag == 'script':
            self.in_script = True
            for attr in attrs:
                if attr[0] == 'type' and attr[1] == 'application/ld+json':
                    self.in_script = True # track json-ld
        elif tag == 'a':
            # Count external citations (rough estimate if href starts with http)
            for attr in attrs:
                if attr[0] == 'href' and attr[1].startswith('http'):
                    self.external_citations += 1
                    
        self.last_tag = tag

    def handle_endtag(self, tag):
        if tag == 'h2': self.in_h2 = False
        elif tag == 'h3': self.in_h3 = False
        elif tag == 'p': self.in_p = False
        elif tag == 'ul' or tag == 'ol': self.in_ul = False
        elif tag == 'li': self.in_li = False
        elif tag == 'script': self.in_script = False

    def handle_data(self, data):
        data_clean = data.strip()
        if not data_clean: return
        
        if self.in_script:
            try:
                # Try to parse json-ld for schema
                schema = json.loads(data)
                schema_str = json.dumps(schema).lower()
                if "faqpage" in schema_str or "question" in schema_str:
                    self.has_faq_schema = True
                if "author" in schema_str or "person" in schema_str:
                    self.has_author_schema = True
            except (json.JSONDecodeError, TypeError, ValueError):
                pass  # malformed JSON-LD block — skip it
                
        if self.in_h2 or self.in_h3:
            self.last_h2_text = data_clean
            if "?" in data_clean or data_clean.lower().startswith(("how", "what", "why", "when", "who", "is", "are", "can")):
                self.question_headings += 1
                
        if self.in_p and self.last_tag in ['h2', 'h3']:
            # A direct answer paragraph right after a heading
            if 50 < len(data_clean) < 300: # Optimal answer snippet length
                self.direct_answers += 1
                
        # Check for original research signals
        lower_data = data_clean.lower()
        if any(keyword in lower_data for keyword in self.research_keywords):
            self.original_research_signals += 1

def analyze_url(url):
    print(f"   [AEO] Scanning {url} for AI-Search Readiness...")
    req = urllib.request.Request(url, headers={'User-Agent': 'SEOSONA AEO-Bot/4.0'})
    try:
        with safe_urlopen(req, timeout=10) as response:
            html = response.read().decode('utf-8')
            parser = AEOParser()
            parser.feed(html)
            
            # Calculate AEO Score (0-100)
            score = 0
            if parser.question_headings > 0: score += 15
            score += min(parser.direct_answers * 10, 25)
            score += min(parser.lists_after_headings * 5, 15)
            if parser.has_faq_schema: score += 15
            if parser.has_author_schema: score += 10
            score += min(parser.external_citations * 2, 10)
            if parser.original_research_signals > 0: score += 10
            
            return {
                "url": url,
                "aeo_score": score,
                "question_headings": parser.question_headings,
                "direct_answers": parser.direct_answers,
                "lists_after_headings": parser.lists_after_headings,
                "has_faq_schema": parser.has_faq_schema,
                "has_author_schema": parser.has_author_schema,
                "external_citations": parser.external_citations,
                "original_research_signals": parser.original_research_signals
            }
    except Exception as e:
        print(f"   [AEO] Failed to scan {url}: {e}")
        return None

def get_internal_links(domain, start_url, max_links=5):
    # Very simple crawler just to get a few pages to test AEO
    links = {start_url}
    req = urllib.request.Request(start_url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with safe_urlopen(req, timeout=10) as response:
            html = response.read().decode('utf-8')
            # Rudimentary link extraction
            import re
            hrefs = re.findall(r'href=[\'"]?([^\'" >]+)', html)
            for href in hrefs:
                full_url = urljoin(start_url, href)
                if urlparse(full_url).netloc == domain and full_url not in links:
                    links.add(full_url)
                    if len(links) >= max_links:
                        break
    except (urllib.error.URLError, OSError, UnicodeDecodeError):
        pass  # unreachable/undecodable start page — return whatever we have
    return list(links)

def run(domain, url=None, max_pages=5):
    if not url:
        url = f"https://{domain}"
        
    out_dir = Path(__file__).parent.parent.parent.parent / "3_MEMORY" / "seo_exports" / domain
    out_dir.mkdir(parents=True, exist_ok=True)
    
    today = datetime.now().strftime("%Y-%m-%d")
    out_file = out_dir / f"aeo_readiness_{domain.replace('.', '-')}_{today}.csv"
    
    urls_to_scan = get_internal_links(domain, url, max_pages)
    results = []
    
    for u in urls_to_scan:
        res = analyze_url(u)
        if res:
            results.append(res)
            
    if not results:
        print("   ❌ No pages could be analyzed for AEO Readiness.")
        return
        
    with open(out_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=results[0].keys())
        writer.writeheader()
        writer.writerows(results)
        
    avg_score = sum(r['aeo_score'] for r in results) / len(results)
    print(f"   ✅ AEO Scan complete. Evaluated {len(results)} pages. Avg AI-Readiness Score: {avg_score:.1f}/100")
    print(f"   💾 Saved to {out_file.name}")

if __name__ == "__main__":
    run("seosona.com", "https://seosona.com", 3)
