import os
import sys
import json
import hmac
import ipaddress
import subprocess
from pathlib import Path
from fastapi import FastAPI, HTTPException, Security, Depends, Request
from fastapi.responses import JSONResponse
from fastapi.security.api_key import APIKeyHeader
from pydantic import BaseModel

ROOT = Path(__file__).resolve().parent.parent.parent
CONFIG_PATH = ROOT / "1_CONFIG" / "api_gateway_config.json"

# Keys that must never be accepted — placeholders shipped with the example config.
PLACEHOLDER_KEYS = {"default", "", "sk-seosona-os-default-key-change-me",
                    "CHANGE_ME_TO_A_STRONG_RANDOM_KEY"}

app = FastAPI(title="SEOSONA OS API Gateway", version="5.0")

# Security
API_KEY_NAME = "X-SEOSONA-API-KEY"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

def get_config():
    if not CONFIG_PATH.exists():
        return {"security": {}}
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def _resolve_api_key(config):
    """Return the configured key only if it is a real, non-placeholder value."""
    key = (config.get("security", {}) or {}).get("api_key", "")
    if not key or key in PLACEHOLDER_KEYS:
        return None
    return key

async def get_api_key(api_key_header: str = Depends(api_key_header)):
    expected_key = _resolve_api_key(get_config())
    if expected_key is None:
        # Fail closed: never authenticate against a missing/placeholder key.
        raise HTTPException(status_code=503,
                            detail="API gateway is not configured with a valid api_key.")
    if api_key_header and hmac.compare_digest(api_key_header, expected_key):
        return api_key_header
    raise HTTPException(status_code=403, detail="Could not validate credentials")


@app.middleware("http")
async def enforce_allowed_ips(request: Request, call_next):
    """Reject requests from IPs not in the configured allowlist (if any)."""
    allowed = (get_config().get("security", {}) or {}).get("allowed_ips") or []
    if allowed:
        client = request.client.host if request.client else None
        ok = False
        if client:
            try:
                client_ip = ipaddress.ip_address(client)
                ok = any(client_ip == ipaddress.ip_address(a) for a in allowed)
            except ValueError:
                ok = client in allowed
        if not ok:
            return JSONResponse(status_code=403, content={"detail": "IP not allowed"})
    return await call_next(request)

class TaskRequest(BaseModel):
    task: str

@app.post("/v1/intake")
async def trigger_intake(request: TaskRequest, api_key: str = Depends(get_api_key)):
    """Triggers the Autonomous Activation Gate"""
    script_path = ROOT / "1_CORE" / "scripts" / "autonomous_activation_gate.py"
    try:
        # Run detached
        subprocess.Popen([sys.executable, str(script_path), "--task", request.task], cwd=ROOT)
        return {"status": "success", "message": "Intake process started in background."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/v1/health")
async def health_check():
    return {"status": "online", "os": "SEOSONA OS V5"}

if __name__ == "__main__":
    import uvicorn
    config = get_config()
    host = config.get("server", {}).get("host", "127.0.0.1")
    port = config.get("server", {}).get("port", 8000)

    if _resolve_api_key(config) is None:
        print("[!] REFUSING TO START: api_gateway_config.json has no valid 'api_key'.")
        print("    Set security.api_key to a strong random value (not the placeholder).")
        sys.exit(1)

    if host not in ("127.0.0.1", "localhost", "::1"):
        print(f"[!] WARNING: gateway is binding to {host} (non-loopback).")
        print("    Endpoints trigger autonomous task execution — only expose behind an")
        print("    authenticated proxy, and keep allowed_ips populated.")

    print(f"Starting SEOSONA API Gateway on {host}:{port}")
    uvicorn.run("api_gateway:app", host=host, port=port, reload=False)
