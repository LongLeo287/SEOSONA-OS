from pathlib import Path
import asyncio
import argparse

try:
    from playwright.async_api import async_playwright
except ImportError:
    pass

try:
    from url_guard import assert_safe_url, UnsafeURLError
except ImportError:
    import os as _os, sys as _sys
    _sys.path.append(_os.path.dirname(__file__))
    from url_guard import assert_safe_url, UnsafeURLError

def _scrapling_html(url: str):
    """Cheap first-try: Scrapling static HTTP fetch (no browser). Returns HTML or None."""
    try:
        from scrapling_scraper import fetch_html
    except Exception:
        import os as _os, sys as _sys
        _sys.path.append(_os.path.dirname(__file__))
        try:
            from scrapling_scraper import fetch_html
        except Exception:
            return None
    return fetch_html(url)


async def fetch_dom(url: str):
    """
    DOM scraper. Tries the cheap Scrapling static fetch first (no browser spin-up — the frugal
    default), then falls back to headless Chromium for SPA/dynamic content a plain fetch can't render.
    """
    try:
        assert_safe_url(url)
    except UnsafeURLError as e:
        print(f"[Scraper Agent] Refusing unsafe URL: {e}")
        return None
    # Frugal path: a plain HTTP fetch handles most static pages without launching a browser.
    html = _scrapling_html(url)
    if html and len(html) > 500:
        print(f"[Scraper Agent] Scrapling static fetch: {len(html)} bytes (no browser).")
        return html
    print(f"[Scraper Agent] Spinning up headless Chromium for {url}...")
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="SEOSONA-Scraper/1.0",
            viewport={"width": 1920, "height": 1080}
        )
        page = await context.new_page()
        try:
            await page.goto(url, wait_until="networkidle", timeout=15000)
            content = await page.content()
            print(f"[Scraper Agent] Successfully fetched {len(content)} bytes.")
            return content
        except Exception as e:
            print(f"[Scraper Agent] Failed to fetch {url}: {e}")
            return None
        finally:
            await browser.close()

async def fetch_interactive(url: str, task: str):
    """
    LLM-driven interactive scrape via browser-use (optional upgrade over fetch_dom).

    Use for JS-heavy / multi-step pages a static DOM fetch can't handle: login flows,
    "load more" / infinite scroll, SERP interaction, forms. Falls back to fetch_dom()
    if browser-use isn't installed (`pip install browser-use`) or errors.

    `task` is a natural-language instruction, e.g. "search '<kw>' and return the top
    10 result titles+URLs". Returns the agent's final result, or fetch_dom()'s HTML.
    """
    try:
        assert_safe_url(url)
    except UnsafeURLError as e:
        print(f"[Scraper Agent] Refusing unsafe URL: {e}")
        return None
    try:
        from browser_use import Agent  # optional heavy dep
        try:
            from browser_use import ChatOpenAI as _LLM
        except Exception:
            from browser_use.llm import ChatOpenAI as _LLM
        agent = Agent(task=f"Go to {url}. {task}", llm=_LLM(model="gpt-4o-mini"))
        history = await agent.run()
        return history.final_result() if hasattr(history, "final_result") else history
    except ImportError:
        print("[Scraper Agent] browser-use not installed — falling back to static DOM fetch.")
        return await fetch_dom(url)
    except Exception as e:
        print(f"[Scraper Agent] browser-use task failed ({e}); falling back to fetch_dom.")
        return await fetch_dom(url)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", required=True)
    parser.add_argument("--task", help="natural-language task → uses browser-use interactive scrape")
    args = parser.parse_args()
    if args.task:
        asyncio.run(fetch_interactive(args.url, args.task))
    else:
        asyncio.run(fetch_dom(args.url))
