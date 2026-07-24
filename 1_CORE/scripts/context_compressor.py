"""
Context Compressor — shrink tool outputs / logs / RAG chunks before they hit the LLM.

Primary: headroom (github.com/headroomlabs-ai/headroom, Apache-2.0) — content-aware,
60-95% token reduction, reversible. Used if installed. Falls back to a lightweight,
dependency-free compressor so the OS always gets *some* reduction.

Pairs with the DeerFlow context-offload pattern: offload decides WHAT to drop; this
compresses WHAT REMAINS before sending it to the model.

  from context_compressor import compress
  small = compress(big_tool_output)            # str -> str (shorter)
  small = compress(big, target_ratio=0.3)      # aim for ~30% of original

Switch off / tune:  SEOSONA_COMPRESS=0  ·  SEOSONA_COMPRESS_MINLEN=1200
"""
import os
import re


def _headroom_compress(text):
    """Use headroom if available. Returns compressed str or None."""
    try:
        import headroom  # type: ignore
    except Exception:
        return None
    for fn in ("compress", "crush", "shrink"):
        f = getattr(headroom, fn, None)
        if callable(f):
            try:
                out = f(text)
                return out if isinstance(out, str) else str(out)
            except Exception:
                continue
    return None


def _builtin_compress(text, target_ratio):
    """Dependency-free fallback: dedupe repeated lines, collapse whitespace/blank runs,
    and middle-truncate very long blocks while keeping head + tail (where signal lives)."""
    lines = text.splitlines()
    # drop consecutive duplicate lines (common in logs / stack repeats)
    deduped, prev = [], None
    for ln in lines:
        s = ln.rstrip()
        if s == prev:
            continue
        deduped.append(s)
        prev = s
    out = "\n".join(deduped)
    out = re.sub(r"[ \t]+\n", "\n", out)
    out = re.sub(r"\n{3,}", "\n\n", out)
    # middle-truncate if still far above target
    target = int(len(text) * target_ratio)
    if len(out) > target and target > 400:
        head, tail = out[: target // 2], out[-target // 2:]
        omitted = len(out) - len(head) - len(tail)
        out = f"{head}\n… [compressed: {omitted} chars omitted] …\n{tail}"
    return out


def compress(text, target_ratio=0.4):
    """Compress text for LLM consumption. No-op for short/empty input or when disabled."""
    if not text or os.environ.get("SEOSONA_COMPRESS") == "0":
        return text
    minlen = int(os.environ.get("SEOSONA_COMPRESS_MINLEN", "1200"))
    if len(text) < minlen:
        return text
    out = _headroom_compress(text)
    if out is None:
        out = _builtin_compress(text, target_ratio)
    return out if len(out) < len(text) else text


if __name__ == "__main__":
    import sys
    data = sys.stdin.read() if not sys.stdin.isatty() else "short"
    c = compress(data)
    sys.stderr.write(f"[compress] {len(data)} -> {len(c)} chars "
                     f"({100 - int(len(c) / max(1, len(data)) * 100)}% smaller)\n")
    sys.stdout.write(c)
