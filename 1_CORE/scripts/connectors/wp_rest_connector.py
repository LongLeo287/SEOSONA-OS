from pathlib import Path
import os
import sys
import json
import base64
import requests
from typing import Dict, Any, List

try:
    from dotenv import load_dotenv
    env_path = os.path.join(os.path.dirname(__file__), "..", "..", "..", "1_CONFIG", ".env")
    load_dotenv(env_path)
    def get_secret(key): return os.environ.get(key)
except ImportError:
    def get_secret(key): return os.environ.get(key)

sys.path.append(os.path.join(os.path.dirname(__file__), "..", "validators"))
try:
    from fix_loop import run_with_fix_loop
except ImportError:
    # Dummy fallback if not found
    def run_with_fix_loop(label, fn, **kwargs): return fn(**kwargs)

class WPRestConnector:
    """
    Connects to WordPress REST API securely.
    Uses Application Passwords stored in SEOSONA Secrets Manager.
    """
    def __init__(self, wp_url: str):
        try:
            from url_guard import assert_safe_url
        except ImportError:
            sys.path.append(os.path.dirname(__file__))
            from url_guard import assert_safe_url
        assert_safe_url(wp_url)  # SSRF guard — raises UnsafeURLError on private/loopback hosts
        self.wp_url = wp_url.rstrip("/")
        self.api_base = f"{self.wp_url}/wp-json/wp/v2"
        self.wp_user = get_secret("WP_USER")
        self.wp_app_pass = get_secret("WP_APP_PASS")
        
        if not self.wp_user or not self.wp_app_pass:
            print("⚠️ [WARNING] WP_USER or WP_APP_PASS not found in Secrets Vault. Running in Dry-Run mode.")
            self.dry_run = True
        else:
            self.dry_run = False

    def _get_auth_header(self):
        if self.dry_run:
            return {}
        credentials = f"{self.wp_user}:{self.wp_app_pass}"
        token = base64.b64encode(credentials.encode()).decode()
        return {"Authorization": f"Basic {token}", "Content-Type": "application/json"}

    def create_post(self, title: str, content: str, status: str = "draft", categories: List[int] = None) -> Dict[str, Any]:
        """Creates a post in WordPress."""
        if self.dry_run:
            print(f"🛠️ [WP Dry-Run] Would create {status} post: '{title}'")
            return {"status": "dry-run", "title": title}
            
        endpoint = f"{self.api_base}/posts"
        payload = {
            "title": title,
            "content": content,
            "status": status,
        }
        if categories:
            payload["categories"] = categories

        # allow_redirects=False: never re-POST the auth header + content to a host the WP site
        # redirects us to (SSRF / credential-leak defense — the base URL was already SSRF-validated).
        response = requests.post(endpoint, headers=self._get_auth_header(), json=payload,
                                 timeout=30, allow_redirects=False)
        
        if response.status_code in (200, 201):
            data = response.json()
            return {"success": True, "post_id": data.get("id"), "link": data.get("link")}
        else:
            raise Exception(f"WP API Error {response.status_code}: {response.text}")

def run(wp_url: str, title: str, content_html: str, status: str = "draft") -> Dict[str, Any]:
    """
    Main entry point for the Tool Registry.
    Wrapped in Fix Loop for resilience.
    """
    def _execute():
        connector = WPRestConnector(wp_url)
        return connector.create_post(title=title, content=content_html, status=status)
        
    return run_with_fix_loop("wp_rest_connector", _execute)

if __name__ == "__main__":
    # Test execution
    res = run("https://example.com", "Test Post via SEOSONA", "<p>Hello from V5</p>", "draft")
    print(json.dumps(res, indent=2))
