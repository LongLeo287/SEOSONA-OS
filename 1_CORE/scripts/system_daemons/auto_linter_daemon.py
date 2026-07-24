import os
import json
import py_compile
from pathlib import Path
from datetime import datetime

# SEOSONA OS Config
SEOSONA_ROOT = Path(__file__).resolve().parent.parent.parent.parent
LOG_DIR = SEOSONA_ROOT / "3_MEMORY" / "logs"
ERROR_DIR = SEOSONA_ROOT / "3_MEMORY" / "errors"
DAEMON_LOG = LOG_DIR / "daemons.log"

ERROR_DIR.mkdir(parents=True, exist_ok=True)
REPORT_PATH = ERROR_DIR / "linter_report.json"

def log_msg(msg):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    formatted = f"[{ts}] [AutoLinterDaemon] {msg}"
    print(formatted)
    with open(DAEMON_LOG, "a", encoding="utf-8") as f:
        f.write(formatted + "\n")

def scan_syntax_errors():
    """Scans all .py files in 1_CORE for syntax errors"""
    log_msg("Scanning Python scripts for syntax errors...")
    core_dir = SEOSONA_ROOT / "1_CORE"
    errors = []
    
    for py_file in core_dir.rglob("*.py"):
        try:
            py_compile.compile(str(py_file), doraise=True)
        except py_compile.PyCompileError as e:
            errors.append({
                "file": str(py_file.relative_to(SEOSONA_ROOT)),
                "type": "SyntaxError",
                "message": str(e)
            })
    return errors

def scan_hardcoded_paths():
    """Scans for forbidden hardcoded Windows paths (e.g. C:\\Users)"""
    log_msg("Scanning scripts for hardcoded path violations...")
    core_dir = SEOSONA_ROOT / "1_CORE"
    errors = []
    forbidden_patterns = ['C:\\Users', 'D:\\', 'E:\\']
    
    for script_file in core_dir.rglob("*.*"):
        if script_file.suffix not in ['.py', '.js', '.sh', '.bat']:
            continue
            
        try:
            with open(script_file, "r", encoding="utf-8") as f:
                lines = f.readlines()
                
            for i, line in enumerate(lines):
                for pattern in forbidden_patterns:
                    if pattern.lower() in line.lower():
                        errors.append({
                            "file": str(script_file.relative_to(SEOSONA_ROOT)),
                            "type": "HardcodedPathViolation",
                            "line": i + 1,
                            "pattern": pattern
                        })
        except Exception:
            pass # ignore binary or unreadable files
            
    return errors

def main():
    log_msg("Initiating Auto-Linter Bug-Hunter cycle...")
    syntax_errors = scan_syntax_errors()
    path_violations = scan_hardcoded_paths()
    
    report = {
        "timestamp": datetime.now().isoformat(),
        "syntax_errors": syntax_errors,
        "path_violations": path_violations,
        "total_issues": len(syntax_errors) + len(path_violations)
    }
    
    with open(REPORT_PATH, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=4)
        
    log_msg(f"Linter complete. Found {report['total_issues']} issues.")
    if report['total_issues'] > 0:
        log_msg("Triggering self-healing alert. (Agent dispatch required)")

if __name__ == "__main__":
    main()
