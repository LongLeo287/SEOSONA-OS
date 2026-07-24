import os
import json
import time
from pathlib import Path
from datetime import datetime

# SEOSONA OS Config
SEOSONA_ROOT = Path(__file__).resolve().parent.parent.parent.parent
LOG_DIR = SEOSONA_ROOT / "3_MEMORY" / "logs"
KI_DIR = SEOSONA_ROOT / "3_MEMORY" / "knowledge_items"
DAEMON_LOG = LOG_DIR / "daemons.log"

KI_DIR.mkdir(parents=True, exist_ok=True)

def log_msg(msg):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    formatted = f"[{ts}] [MemoryCompressionDaemon] {msg}"
    print(formatted)
    with open(DAEMON_LOG, "a", encoding="utf-8") as f:
        f.write(formatted + "\n")

import urllib.request

OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://localhost:11434")
OLLAMA_MODEL = os.environ.get("SEOSONA_LLM_MODEL", "gemma3:1b")


def _ollama_summarize(content):
    """Real local-LLM summary via Ollama. Returns text, or None if unreachable."""
    prompt = (
        "Summarize the following SEOSONA OS log into a compact list of durable rules, "
        "decisions, and events worth remembering. Be factual; keep only what matters.\n\n"
        + content[:12000]
    )
    payload = json.dumps({"model": OLLAMA_MODEL, "prompt": prompt, "stream": False}).encode()
    req = urllib.request.Request(f"{OLLAMA_URL}/api/generate", data=payload,
                                 headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=180) as r:
            return json.loads(r.read()).get("response", "").strip() or None
    except Exception as e:
        log_msg(f"Ollama unavailable ({e}); falling back to heuristic extraction.")
        return None


def compress_content(content):
    """
    Compress a log into a memory artifact. Uses a REAL local LLM (Ollama) when reachable;
    otherwise falls back to keyword extraction — and labels the artifact with the method
    actually used, so a heuristic extract is never mislabeled as an LLM compression.
    """
    summary_body = _ollama_summarize(content)
    if summary_body:
        method = "ollama-" + OLLAMA_MODEL
    else:
        lines = content.split('\n')
        extracted = [ln.strip() for ln in lines if any(
            k in ln.lower() for k in ['rule', 'must', 'always', 'never', 'fix', 'error', 'upgrade', 'system'])]
        if not extracted:
            return None
        method = "heuristic-extraction"
        summary_body = "### Extracted Rules & Events:\n" + "".join(f"- {e}\n" for e in extracted[:20] if e)

    header = ("---\n"
              "type: compressed_memory\n"
              f"method: {method}\n"
              f"timestamp: {datetime.now().isoformat()}\n"
              "---\n\n")
    return header + summary_body

def compress_logs():
    log_msg("Scanning for bulky memory logs...")
    for file_path in LOG_DIR.glob("*.md"):
        if file_path.name.startswith("compressed_") or file_path.name == "daemons.log" or file_path.name == "README.md":
            continue
            
        file_size = os.path.getsize(file_path)
        if file_size > 5000: # Compress files larger than 5KB
            log_msg(f"Compressing {file_path.name} ({file_size} bytes)...")
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()
                    
                compressed_data = compress_content(content)
                if not compressed_data:
                    log_msg(f"No actionable content in {file_path.name}; skipped.")
                    continue

                output_name = f"compressed_{file_path.stem}_{int(time.time())}.aaak"
                output_path = KI_DIR / output_name
                with open(output_path, "w", encoding="utf-8") as f:
                    f.write(compressed_data)

                log_msg(f"Generated {output_name}. Original raw log kept (auto-delete disabled for safety).")
                # os.remove(file_path) # Disabled for safety during initial deployment
                
            except Exception as e:
                log_msg(f"Failed to compress {file_path.name}: {str(e)}")

def main():
    log_msg("Initiating Dreaming Memory Protocol...")
    compress_logs()
    log_msg("Dreaming cycle complete.")

if __name__ == "__main__":
    main()
