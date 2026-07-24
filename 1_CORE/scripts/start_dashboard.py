import http.server
import socketserver
import json
import os
import sys
import subprocess
import argparse
import base64
from pathlib import Path

os.environ.setdefault("PYTHONIOENCODING", "utf-8")
if sys.platform == "win32":
    try:
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")
    except Exception:
        pass

# Parse domain argument
parser = argparse.ArgumentParser(description="SEOSONA Interactive Dashboard Server")
parser.add_argument("--domain", default="example.com", help="Domain to serve dashboard for")
parser.add_argument("--port", type=int, default=8888, help="Port to run server on")
parser.add_argument("--no-open", action="store_true", help="Do not open the browser automatically")
args = parser.parse_args()

DOMAIN = args.domain
PORT = args.port

# Directories
ROOT = Path(__file__).parent.parent.parent
BASE_DIR = ROOT
ENV_PATH = ROOT / "1_CONFIG" / ".env"
EXPORT_DIR = ROOT / "3_MEMORY" / "seo_exports" / DOMAIN
SPECS_DIR = ROOT / "3_MEMORY" / "specs"
LEGACY_DASHBOARD_FILE = EXPORT_DIR / f"seo_dashboard_{DOMAIN}.html"
V4_DASHBOARD_FILE = EXPORT_DIR / f"seo_dashboard_v4_{DOMAIN}.html"


def dashboard_file():
    return V4_DASHBOARD_FILE if V4_DASHBOARD_FILE.exists() else LEGACY_DASHBOARD_FILE


def set_env_value(key, value):
    ENV_PATH.parent.mkdir(parents=True, exist_ok=True)
    lines = ENV_PATH.read_text(encoding="utf-8").splitlines() if ENV_PATH.exists() else []
    prefix = f"{key}="
    for i, line in enumerate(lines):
        if line.startswith(prefix):
            lines[i] = f"{key}={value}"
            break
    else:
        lines.extend(["", f"{key}={value}"])
    ENV_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")

class DashboardHandler(http.server.SimpleHTTPRequestHandler):
    def _serve_dashboard(self, head_only=False):
        current_dashboard = dashboard_file()
        if not current_dashboard.exists():
            print(f"[*] Dashboard not found. Generating for {DOMAIN}...")
            subprocess.run([sys.executable, "1_CORE/scripts/connectors/dashboard_generator_v4.py", "--domain", DOMAIN], cwd=str(BASE_DIR), timeout=300)
            current_dashboard = dashboard_file()

        if current_dashboard.exists():
            content = current_dashboard.read_text(encoding="utf-8").encode("utf-8")
            self.send_response(200)
            self.send_header("Content-type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(content)))
            self.send_header("Connection", "close")
            self.end_headers()
            if not head_only:
                self.wfile.write(content)
        else:
            message = b"Dashboard not found. Please run run_full_audit.py first."
            self.send_response(404)
            self.send_header("Content-Length", str(len(message)))
            self.end_headers()
            if not head_only:
                self.wfile.write(message)

    def do_HEAD(self):
        if self.path == '/':
            self._serve_dashboard(head_only=True)
            return
        super().do_HEAD()

    def do_GET(self):
        if self.path == '/':
            self._serve_dashboard()
            return
        
        # Serve other files (like CSS/JS if any, though dashboard is self-contained)
        super().do_GET()

    def do_POST(self):
        if self.path == '/api/save_and_run':
            if self.client_address[0] not in ('127.0.0.1', '::1', 'localhost'):
                self.send_error(403, "Forbidden")
                return
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode("utf-8"))
            except json.JSONDecodeError:
                self.send_error(400, "Invalid JSON")
                return

            connector = data.get("connector")
            payload = data.get("payload")

            print(f"[*] Received request to run '{connector}'")

            try:
                # 1. Save Credentials
                if connector == "gsc":
                    # Validate payload is valid JSON before saving
                    try:
                        json.loads(payload)
                    except (json.JSONDecodeError, TypeError):
                        self.send_response(400)
                        self.send_header('Content-type', 'application/json')
                        self.end_headers()
                        self.wfile.write(json.dumps({"status": "error", "message": "Payload is not valid JSON — paste the full service account JSON file content"}).encode())
                        return
                    set_env_value(
                        "GOOGLE_SERVICE_ACCOUNT_JSON_BASE64",
                        base64.b64encode(payload.encode("utf-8")).decode("ascii"),
                    )
                    sa_data = json.loads(payload)
                    if sa_data.get("client_email"):
                        set_env_value("GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL", sa_data["client_email"])
                    if sa_data.get("project_id"):
                        set_env_value("GOOGLE_CLOUD_PROJECT", sa_data["project_id"])

                elif connector == "ga4":
                    set_env_value("GA4_PROPERTY_ID", str(payload).strip())

                elif connector == "backlinks":
                    # Payload is a dict {"opr": "...", "bing": "..."}
                    if isinstance(payload, dict):
                        opr = payload.get("opr", "").strip()
                        bing = payload.get("bing", "").strip()
                        if opr:
                            set_env_value("OPEN_PAGERANK_KEY", opr)
                        if bing:
                            set_env_value("BING_WEBMASTER_KEY", bing)

                # 2. Run the connector script
                script_map = {
                    "gsc": "1_CORE/scripts/connectors/gsc_connector.py",
                    "ga4": "1_CORE/scripts/connectors/ga4_connector.py",
                    "backlinks": "1_CORE/scripts/connectors/backlink_connector.py"
                }

                if connector in script_map:
                    script = script_map[connector]
                    print(f"[*] Running {script}...")
                    # Set PYTHONIOENCODING for Windows
                    env = os.environ.copy()
                    env["PYTHONIOENCODING"] = "utf-8"
                    try:
                        subprocess.run([sys.executable, "-X", "utf8", script, "--domain", DOMAIN], cwd=str(BASE_DIR), env=env, timeout=300)
                    except subprocess.TimeoutExpired:
                        print(f"[!!] {script} timed out after 5 minutes.")

                # 3. Regenerate Dashboard
                print(f"[*] Regenerating Dashboard...")
                env = os.environ.copy()
                env["PYTHONIOENCODING"] = "utf-8"
                try:
                    subprocess.run([sys.executable, "-X", "utf8", "1_CORE/scripts/connectors/dashboard_generator_v4.py", "--domain", DOMAIN], cwd=str(BASE_DIR), env=env, timeout=300)
                except subprocess.TimeoutExpired:
                    print(f"[!!] dashboard_generator_v4.py timed out after 5 minutes.")

                # Send Success Response
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success"}).encode("utf-8"))

            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode("utf-8"))
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == "__main__":
    import threading
    import webbrowser
    import time
    
    # Ensure specs directory exists
    SPECS_DIR.mkdir(parents=True, exist_ok=True)
    
    print(f"🚀 SEOSONA Interactive Dashboard Server starting...")
    print(f"🌐 Target Domain: {DOMAIN}")
    
    # Open browser automatically for interactive local use.
    def open_browser():
        time.sleep(1)
        print(f"[*] Opening browser to http://127.0.0.1:{PORT}")
        webbrowser.open(f"http://127.0.0.1:{PORT}")

    if not args.no_open:
        threading.Thread(target=open_browser, daemon=True).start()
    
    # Start server
    with socketserver.ThreadingTCPServer(("127.0.0.1", PORT), DashboardHandler) as httpd:
        print(f"[*] Serving at http://127.0.0.1:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n[*] Server stopped.")
