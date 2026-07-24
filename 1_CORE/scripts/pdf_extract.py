"""
PDF → AI-ready structured data (opendataloader-pdf) for the UAP ingestion path.

Wires the opendataloader-pdf adoption: turn a PDF into layout-faithful Markdown / JSON
(reading order, tables, headings) with a prompt-injection safety filter, before it becomes
a Knowledge Item. Complements `lift` (schema extraction).

  from pdf_extract import extract_pdf
  md = extract_pdf("paper.pdf")            # -> markdown str (AI-ready)
  data = extract_pdf("paper.pdf", fmt="json")

Graceful: returns None with a clear message if opendataloader-pdf isn't installed (Java 11+).
Install:  pip install opendataloader-pdf
"""
import os
import sys
import glob
import shutil


def _ensure_java():
    """opendataloader runs a Java JAR. Make sure a JRE is reachable by the subprocess:
    use JAVA_HOME / PATH if already set, else auto-locate an install-jdk JDK (~/.jdk/*)
    and inject it into os.environ so the spawned `java` is found on Windows too."""
    if shutil.which("java"):
        return True
    jh = os.environ.get("JAVA_HOME")
    if jh and os.path.exists(os.path.join(jh, "bin")):
        os.environ["PATH"] = os.path.join(jh, "bin") + os.pathsep + os.environ.get("PATH", "")
        return True
    for cand in glob.glob(os.path.join(os.path.expanduser("~"), ".jdk", "*", "bin")):
        if os.path.exists(os.path.join(cand, "java.exe")) or os.path.exists(os.path.join(cand, "java")):
            os.environ["JAVA_HOME"] = os.path.dirname(cand)
            os.environ["PATH"] = cand + os.pathsep + os.environ.get("PATH", "")
            return True
    return False


def extract_pdf(pdf_path, fmt="markdown"):
    """Extract a PDF to 'markdown' or 'json'. Returns the content (str/obj) or None."""
    if not os.path.exists(pdf_path):
        print(f"[pdf] not found: {pdf_path}")
        return None
    try:
        import opendataloader_pdf
    except ImportError:
        print("[pdf] opendataloader-pdf not installed — UAP keeps its text path. "
              "Install: pip install opendataloader-pdf (needs Java 11+).")
        return None
    if not _ensure_java():
        print("[pdf] no Java runtime found — install one: pip install install-jdk && "
              "python -c \"import jdk; jdk.install('11')\". Skipping (UAP keeps text path).")
        return None
    try:
        # convert() returns the parsed result; format selects markdown vs json output.
        out = opendataloader_pdf.convert(
            input_path=pdf_path,
            generate_markdown=(fmt == "markdown"),
            generate_json=(fmt == "json"),
        )
        return out
    except TypeError:
        # API differs by version — fall back to the simplest call.
        try:
            return opendataloader_pdf.convert(pdf_path)
        except Exception as e:
            print(f"[pdf] convert failed: {e}")
            return None
    except Exception as e:
        print(f"[pdf] extraction failed: {e}")
        return None


if __name__ == "__main__":
    if len(sys.argv) < 2:
        # smoke: confirm the engine imports + the JAR resolves
        try:
            import opendataloader_pdf  # noqa: F401
            print("[pdf] opendataloader-pdf importable:",
                  [x for x in dir(opendataloader_pdf) if x in ("convert", "run", "run_jar")])
        except ImportError:
            print("[pdf] not installed.")
    else:
        r = extract_pdf(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else "markdown")
        print(r if isinstance(r, str) else (str(r)[:500] if r else "no output"))
