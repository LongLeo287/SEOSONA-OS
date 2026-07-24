#!/usr/bin/env python3
"""
VidCap.xyz API Client for YouTube video processing.
Supports: info, download, caption, summary, screenshot, comments, search.
"""

import argparse
import json
import os
import sys
from pathlib import Path
from typing import Optional
from urllib.parse import urlencode

import requests
from dotenv import load_dotenv

# Priority: process.env > skill/.env > skills/.env > .opencode/.env
SKILL_DIR = Path(__file__).parent.parent


def get_env_locations():
    """Get .env paths (lowest to highest file priority)."""
    locs = []
    user_claude = Path.home() / ".claude"
    locs.extend([user_claude / ".env", user_claude / "skills" / ".env"])
    parent = SKILL_DIR.parent
    if parent.name == "skills" and parent.parent.name == ".claude":
        proj = parent.parent
        locs.extend([proj / ".env", proj / "skills" / ".env"])
    locs.append(SKILL_DIR / ".env")
    return locs


for p in get_env_locations():
    if p.exists():
        load_dotenv(p, override=False)

BASE_URL = "https://vidcap.xyz/api/v1"


def get_api_key() -> str:
    """Get API key from environment."""
    key = os.getenv("VIDCAP_API_KEY")
    if not key:
        print("Error: VIDCAP_API_KEY not set", file=sys.stderr)
        sys.exit(1)
    return key


def api_request(
    endpoint: str,
    method: str = "GET",
    params: Optional[dict] = None,
    json_body: Optional[dict] = None,
) -> dict:
    """Make API request to VidCap.xyz."""
    headers = {"X-API-Key": get_api_key()}
    url = f"{BASE_URL}{endpoint}"

    if method == "GET" and params:
        url = f"{url}?{urlencode(params, doseq=True)}"
        resp = requests.get(url, headers=headers, timeout=120)
    elif method == "POST":
        resp = requests.post(url, headers=headers, json=json_body, timeout=120)
    else:
        resp = requests.get(url, headers=headers, timeout=120)

    if resp.status_code != 200:
        print(f"Error {resp.status_code}: {resp.text}", file=sys.stderr)
        sys.exit(1)

    try:
        return resp.json()
    except json.JSONDecodeError:
        return {"result": resp.text}


def cmd_info(args):
    """Get video info."""
    params = {"url": args.url}
    if args.no_cache:
        params["cache"] = "false"
    result = api_request("/youtube/info", params=params)
    print(json.dumps(result, indent=2))


def cmd_media(args):
    """List available media formats."""
    result = api_request("/youtube/media", params={"url": args.url})
    print(json.dumps(result, indent=2))


def cmd_download(args):
    """Download video."""
    result = api_request("/youtube/download", params={"url": args.url})
    print(json.dumps(result, indent=2))


def cmd_caption(args):
    """Get video captions."""
    params = {"url": args.url}
    if args.locale:
        params["locale"] = args.locale
    if args.ext:
        params["ext"] = args.ext
    if args.model:
        params["model"] = args.model
    result = api_request("/youtube/caption", params=params)
    print(json.dumps(result, indent=2))


def cmd_summary(args):
    """Generate AI summary."""
    params = {"url": args.url}
    if args.locale:
        params["locale"] = args.locale
    if args.model:
        params["model"] = args.model
    if args.screenshot:
        params["screenshot"] = "1"
    if args.no_cache:
        params["cache"] = "false"
    result = api_request("/youtube/summary", params=params)
    print(result.get("result", result) if isinstance(result, dict) else result)


def cmd_summary_custom(args):
    """Generate custom summary with prompt."""
    body = {"url": args.url, "prompt": args.prompt}
    if args.locale:
        body["locale"] = args.locale
    if args.model:
        body["model"] = args.model
    if args.screenshot:
        body["screenshot"] = "1"
    if args.no_cache:
        body["cache"] = False
    result = api_request("/youtube/summary-custom", method="POST", json_body=body)
    print(result.get("result", result) if isinstance(result, dict) else result)


def cmd_article(args):
    """Convert video to article."""
    params = {"url": args.url}
    if args.locale:
        params["locale"] = args.locale
    if args.model:
        params["model"] = args.model
    result = api_request("/youtube/article", params=params)
    print(result.get("result", result) if isinstance(result, dict) else result)


def cmd_screenshot(args):
    """Capture video screenshot."""
    params = {"url": args.url}
    if args.second is not None:
        params["second"] = str(args.second)
    result = api_request("/youtube/screenshot", params=params)
    print(json.dumps(result, indent=2))


def cmd_screenshot_multi(args):
    """Capture multiple screenshots."""
    params = {"url": args.url, "second": args.seconds}
    result = api_request("/youtube/screenshot-multiple", params=params)
    print(json.dumps(result, indent=2))


def cmd_comments(args):
    """Get video comments."""
    params = {"url": args.url}
    if args.order:
        params["order"] = args.order
    if args.format:
        params["format"] = args.format
    if args.include_replies:
        params["includeReplies"] = "true"
    if args.page_token:
        params["pageToken"] = args.page_token
    result = api_request("/youtube/comments", params=params)
    print(json.dumps(result, indent=2))


def cmd_search(args):
    """Search YouTube videos."""
    params = {"q": args.query}
    if args.max_results:
        params["maxResults"] = str(args.max_results)
    if args.order:
        params["order"] = args.order
    if args.duration:
        params["videoDuration"] = args.duration
    if args.page_token:
        params["pageToken"] = args.page_token
    if args.published_after:
        params["publishedAfter"] = args.published_after
    result = api_request("/youtube/search", params=params)
    print(json.dumps(result, indent=2))


def cmd_models(args):
    """List available AI models."""
    result = api_request("/ai/models")
    print(json.dumps(result, indent=2))


def main():
    parser = argparse.ArgumentParser(description="VidCap.xyz API Client")
    subparsers = parser.add_subparsers(dest="command", required=True)

    # info
    p = subparsers.add_parser("info", help="Get video info")
    p.add_argument("url", help="YouTube URL")
    p.add_argument("--no-cache", action="store_true")
    p.set_defaults(func=cmd_info)

    # media
    p = subparsers.add_parser("media", help="List media formats")
    p.add_argument("url", help="YouTube URL")
    p.set_defaults(func=cmd_media)

    # download
    p = subparsers.add_parser("download", help="Download video")
    p.add_argument("url", help="YouTube URL")
    p.set_defaults(func=cmd_download)

    # caption
    p = subparsers.add_parser("caption", help="Get captions")
    p.add_argument("url", help="YouTube URL")
    p.add_argument("--locale", default="en")
    p.add_argument("--ext", choices=["json3", "srv1", "srv2", "srv3", "ttml", "vtt"])
    p.add_argument("--model")
    p.set_defaults(func=cmd_caption)

    # summary
    p = subparsers.add_parser("summary", help="Generate summary")
    p.add_argument("url", help="YouTube URL")
    p.add_argument("--locale", default="en")
    p.add_argument("--model")
    p.add_argument("--screenshot", action="store_true")
    p.add_argument("--no-cache", action="store_true")
    p.set_defaults(func=cmd_summary)

    # summary-custom
    p = subparsers.add_parser("summary-custom", help="Custom summary")
    p.add_argument("url", help="YouTube URL")
    p.add_argument("--prompt", required=True)
    p.add_argument("--locale", default="en")
    p.add_argument("--model")
    p.add_argument("--screenshot", action="store_true")
    p.add_argument("--no-cache", action="store_true")
    p.set_defaults(func=cmd_summary_custom)

    # article
    p = subparsers.add_parser("article", help="Convert to article")
    p.add_argument("url", help="YouTube URL")
    p.add_argument("--locale", default="en")
    p.add_argument("--model")
    p.set_defaults(func=cmd_article)

    # screenshot
    p = subparsers.add_parser("screenshot", help="Capture screenshot")
    p.add_argument("url", help="YouTube URL")
    p.add_argument("--second", type=int, default=0)
    p.set_defaults(func=cmd_screenshot)

    # screenshot-multi
    p = subparsers.add_parser("screenshot-multi", help="Multiple screenshots")
    p.add_argument("url", help="YouTube URL")
    p.add_argument("--seconds", nargs="+", type=int, default=[0])
    p.set_defaults(func=cmd_screenshot_multi)

    # comments
    p = subparsers.add_parser("comments", help="Get comments")
    p.add_argument("url", help="YouTube URL")
    p.add_argument("--order", choices=["time", "relevance"])
    p.add_argument("--format", choices=["plainText", "html"])
    p.add_argument("--include-replies", action="store_true")
    p.add_argument("--page-token")
    p.set_defaults(func=cmd_comments)

    # search
    p = subparsers.add_parser("search", help="Search YouTube")
    p.add_argument("query", help="Search query")
    p.add_argument("--max-results", type=int)
    p.add_argument("--order", choices=["relevance", "date", "viewCount", "rating"])
    p.add_argument("--duration", choices=["short", "medium", "long", "any"])
    p.add_argument("--page-token")
    p.add_argument("--published-after")
    p.set_defaults(func=cmd_search)

    # models
    p = subparsers.add_parser("models", help="List AI models")
    p.set_defaults(func=cmd_models)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
