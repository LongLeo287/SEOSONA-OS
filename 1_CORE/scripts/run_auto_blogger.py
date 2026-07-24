from pathlib import Path
import os
import sys
import argparse
import json
import urllib.request

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

sys.path.append(os.path.join(os.path.dirname(__file__), "connectors"))
try:
    import wp_rest_connector
except ImportError as e:
    print(f"Error loading connector: {e}")
    sys.exit(1)
try:
    import keyword_connector
except ImportError:
    keyword_connector = None

OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://localhost:11434")
OLLAMA_MODEL = os.environ.get("SEOSONA_LLM_MODEL", "gemma3:1b")


def _ollama_generate(prompt, timeout=180):
    """Real local LLM call (Ollama). Returns text, or None if Ollama is unreachable."""
    payload = json.dumps({"model": OLLAMA_MODEL, "prompt": prompt, "stream": False}).encode()
    req = urllib.request.Request(f"{OLLAMA_URL}/api/generate", data=payload,
                                 headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return json.loads(r.read()).get("response", "").strip()
    except Exception as e:
        print(f"   ❌ Ollama unreachable ({e}). Cannot generate — aborting (no fake content).")
        return None


def run_phase1_context_assembly(keyword: str) -> dict:
    """
    Phase 1: Profile & Context Assembly.
    Pulls REAL related queries from Google Autocomplete (via keyword_connector) so the
    'information gaps' are the questions people actually search — not a hardcoded list.
    """
    print(f"\n[Phase 1] Assembling context for keyword: '{keyword}'")
    related, intent = [], "Informational"
    if keyword_connector:
        try:
            print("   🔍 Google Autocomplete: fetching real related queries...")
            related = keyword_connector.google_autocomplete(keyword) or []
            intent = keyword_connector.classify_intent(keyword)
            print(f"   ✅ {len(related)} real related queries; intent={intent}")
        except Exception as e:
            print(f"   ⚠️  Autocomplete failed ({e}); proceeding with keyword only.")
    else:
        print("   ⚠️  keyword_connector unavailable; proceeding with keyword only.")
    return {"keyword": keyword, "search_intent": intent, "related_queries": related[:10]}


def run_phase2_generation(context: dict) -> str:
    """
    Phase 2: REAL content generation via the local LLM (Ollama/gemma).
    Returns None on failure — never fabricates placeholder HTML.
    """
    kw = context["keyword"]
    related = context.get("related_queries", [])
    print("\n[Phase 2] Generating content via local LLM (Ollama)...")
    gaps = "\n".join(f"- {q}" for q in related) or "- (no autocomplete data; cover the topic comprehensively)"
    prompt = (
        f"You are an expert SEO writer. Write a comprehensive, factual, E-E-A-T compliant article "
        f"in WordPress Gutenberg block HTML (<!-- wp:heading -->, <!-- wp:paragraph -->, <!-- wp:list -->) "
        f"about: \"{kw}\".\n"
        f"Search intent: {context.get('search_intent')}.\n"
        f"Answer these real questions people search:\n{gaps}\n\n"
        f"Use h2/h3 headings, be specific and accurate, no filler, no 'as an AI' disclaimers. "
        f"Output ONLY the article HTML."
    )
    content = _ollama_generate(prompt)
    if content:
        print(f"   ✅ Generated {len(content)} chars of real LLM content.")
    return content


def run_phase3_post_processing(wp_url: str, title: str, content_html: str, dry_run: bool):
    """
    Phase 3: Inject JSON-LD schema, then EITHER save locally (dry-run) OR push to WP.
    dry-run now genuinely does NOT post (the old code posted in both branches).
    """
    print("\n[Phase 3] Post-processing...")
    schema = {"@context": "https://schema.org", "@type": "Article", "headline": title}
    final_content = content_html + f"\n<script type='application/ld+json'>{json.dumps(schema)}</script>"

    if dry_run:
        out_dir = Path(__file__).parent.parent.parent / "3_MEMORY" / "drafts"
        out_dir.mkdir(parents=True, exist_ok=True)
        safe = "".join(c if c.isalnum() or c in "-_" else "_" for c in title)[:80]
        out_path = out_dir / f"{safe}.html"
        out_path.write_text(f"<!-- title: {title} -->\n{final_content}", encoding="utf-8")
        print(f"   🚨 DRY RUN: saved draft to {out_path} — NOT posted to WordPress.")
        return

    print("   🚀 Pushing to WordPress API...")
    res = wp_rest_connector.run(wp_url, title, final_content, "draft")
    print(f"   ✅ Result: {getattr(res, 'data', res)}")


def main():
    parser = argparse.ArgumentParser(description="SEOSONA OS Auto-Blogger")
    parser.add_argument("--keyword", required=True, help="Target keyword")
    parser.add_argument("--wp-url", required=True, help="WordPress URL")
    parser.add_argument("--dry-run", action="store_true", help="Save draft locally; do not post to WP")
    args = parser.parse_args()

    print("=" * 50)
    print(" SEOSONA OS Auto-Blogger")
    print("=" * 50)

    context = run_phase1_context_assembly(args.keyword)
    content = run_phase2_generation(context)
    if not content:
        print("\n❌ Aborted: no real content generated (LLM unavailable). Nothing posted.")
        sys.exit(1)
    title = f"{args.keyword}".strip().capitalize()
    run_phase3_post_processing(args.wp_url, title, content, args.dry_run)


if __name__ == "__main__":
    main()
