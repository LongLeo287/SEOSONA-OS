import os
import sys
import time
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent.parent
EVAL_QUEUE_DIR = ROOT / "3_MEMORY" / "eval_queue"
EVAL_RESULTS_DIR = ROOT / "3_MEMORY" / "eval_results"
sys.path.append(str(ROOT / "1_CORE" / "scripts"))

try:
    from core.telemetry import log_telemetry, generate_trace_id
except ImportError:
    def log_telemetry(*args, **kwargs): pass
    def generate_trace_id(): return "trace-local"

class EvalDaemon:
    def __init__(self):
        os.makedirs(EVAL_QUEUE_DIR, exist_ok=True)
        os.makedirs(EVAL_RESULTS_DIR, exist_ok=True)
        
    def score_tool(self, tool_path: Path):
        print(f"[EvalDaemon] Evaluating {tool_path.name}...")
        start = time.time()
        score = 0
        feedback = []

        # Real static-quality checks (no fabricated constants).
        import py_compile
        import ast
        import re
        content = tool_path.read_text(encoding="utf-8")

        # 1. Real syntax check — actually compile the file.
        try:
            py_compile.compile(str(tool_path), doraise=True)
            score += 40
            feedback.append("Compiles (valid Python syntax).")
        except py_compile.PyCompileError as e:
            feedback.append(f"Syntax error: {str(e).splitlines()[0]}")

        # 2. Real AST inspection — entry point + error handling, not substring matching.
        try:
            tree = ast.parse(content)
            funcs = {n.name for n in ast.walk(tree) if isinstance(n, ast.FunctionDef)}
            if {"run", "main"} & funcs:
                score += 30
                feedback.append("Has run()/main() entry point.")
            else:
                feedback.append("No run()/main() entry point.")
            if any(isinstance(n, ast.Try) for n in ast.walk(tree)):
                score += 15
                feedback.append("Has error handling.")
        except SyntaxError:
            feedback.append("Unparseable — skipped AST checks.")

        # 3. Anti-fakery signal — penalize mock/dummy/TODO so fake tools score low.
        if re.search(r"\b(mock|dummy|placeholder|fabricat|TODO|FIXME|not.?implemented)\b", content, re.I):
            score -= 20
            feedback.append("Contains fakery/TODO markers (-20).")
        else:
            score += 15
            feedback.append("No fakery markers.")

        score = max(0, min(100, score))
        latency = int((time.time() - start) * 1000)
        
        result = {
            "tool_name": tool_path.name,
            "score": score,
            "feedback": feedback,
            "evaluated_at": time.time()
        }
        
        # Save result
        res_file = EVAL_RESULTS_DIR / f"{tool_path.stem}_eval.json"
        with open(res_file, "w", encoding="utf-8") as f:
            json.dump(result, f, indent=2)
            
        # Log to telemetry
        log_telemetry(
            trace_id=generate_trace_id(),
            agent="EvalDaemon",
            action="evaluate_tool",
            details=result,
            latency_ms=latency
        )
        
        # Remove from queue
        os.remove(tool_path)
        print(f"[EvalDaemon] Finished {tool_path.name}. Score: {score}/100")

    def run(self):
        print("[EvalDaemon] Starting Run-On-Boot Evaluation Cycle...")
        count = 0
        for item in EVAL_QUEUE_DIR.glob("*.py"):
            self.score_tool(item)
            count += 1
            
        if count == 0:
            print("[EvalDaemon] Queue empty. Nothing to evaluate.")
        else:
            print(f"[EvalDaemon] Completed {count} evaluations.")

if __name__ == "__main__":
    daemon = EvalDaemon()
    daemon.run()
