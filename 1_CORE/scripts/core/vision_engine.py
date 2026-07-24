"""
SEOSONA OS Vision Subsystem.

Gives the OS "eyes" by capturing screenshots of web pages via Playwright
and providing basic visual analysis metadata. Gracefully degrades if
Playwright is not installed.
"""

import os
import subprocess
import shutil
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parent.parent.parent.parent
SCREENSHOTS_DIR = ROOT / "3_MEMORY" / "screenshots"
SCREENSHOTS_DIR.mkdir(parents=True, exist_ok=True)

try:
    from core.telemetry import log_telemetry, generate_trace_id
except ImportError:
    def log_telemetry(*args, **kwargs): pass
    def generate_trace_id(): return "trace-local"


def _playwright_available() -> bool:
    """Check if npx playwright is available."""
    npx = shutil.which("npx") or shutil.which("npx.cmd")
    return npx is not None


def capture_screenshot(url: str, output_name: str = None) -> str | None:
    """
    Capture a screenshot of a URL using Playwright CLI.
    Returns the path to the saved screenshot, or None on failure.
    """
    if not _playwright_available():
        print("[Vision] Playwright not found. Gracefully skipping screenshot.")
        return None

    if not output_name:
        safe_url = "".join(c if c.isalnum() else "_" for c in url)[:40]
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_name = f"screenshot_{safe_url}_{timestamp}.png"

    output_path = SCREENSHOTS_DIR / output_name

    try:
        npx = shutil.which("npx") or shutil.which("npx.cmd")
        result = subprocess.run(
            [npx, "playwright", "screenshot", "--full-page", url, str(output_path)],
            capture_output=True,
            text=True,
            timeout=30,
            check=False,
        )

        if result.returncode == 0 and output_path.exists():
            print(f"[Vision] Screenshot captured: {output_path}")

            log_telemetry(
                trace_id=generate_trace_id(),
                agent="VisionEngine",
                action="capture_screenshot",
                details={"url": url, "output": str(output_path), "size_bytes": output_path.stat().st_size},
            )
            return str(output_path)
        else:
            print(f"[Vision] Playwright screenshot failed: {result.stderr[:200]}")
            return None

    except subprocess.TimeoutExpired:
        print(f"[Vision] Screenshot timed out for {url}")
        return None
    except Exception as e:
        print(f"[Vision] Screenshot error: {e}")
        return None


def analyze_screenshot(screenshot_path: str) -> dict:
    """
    Provide basic visual analysis metadata for a screenshot.
    In production, this would send the image to GPT-4o Vision or Gemini.
    Currently returns file-based metadata.
    """
    path = Path(screenshot_path)
    if not path.exists():
        return {"error": "Screenshot not found", "path": screenshot_path}

    stat = path.stat()

    analysis = {
        "path": str(path),
        "filename": path.name,
        "size_bytes": stat.st_size,
        "size_kb": round(stat.st_size / 1024, 1),
        "format": path.suffix.lstrip(".").upper(),
        "captured_at": datetime.fromtimestamp(stat.st_mtime).isoformat(),
        "notes": [],
    }

    # Basic heuristics from file size
    if stat.st_size < 10_000:
        analysis["notes"].append("Very small image - page may be blank or blocked.")
    elif stat.st_size > 2_000_000:
        analysis["notes"].append("Large image - page is visually rich with many elements.")
    else:
        analysis["notes"].append("Normal-sized screenshot. Page loaded successfully.")

    return analysis


def capture_and_analyze(url: str) -> dict:
    """Convenience: capture a screenshot and immediately analyze it."""
    path = capture_screenshot(url)
    if not path:
        return {"url": url, "status": "failed", "reason": "Screenshot capture failed."}

    analysis = analyze_screenshot(path)
    analysis["url"] = url
    analysis["status"] = "success"
    return analysis
