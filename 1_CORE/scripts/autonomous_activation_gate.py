#!/usr/bin/env python3
"""
SEOSONA OS Autonomous Activation Gate.

Single preflight entrypoint for agent tasks. It prevents capability drift by
forcing every task through Knowledge Items, dynamic context assembly, intent
routing, capability bridge routing, knowledge graph retrieval, and optional
audit planning before execution.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
from pathlib import Path
from typing import Any, Dict, List

os.environ.setdefault("PYTHONIOENCODING", "utf-8")
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parents[2]
PORTABLE_ROOT = "~/.seosona"


def _to_portable(path: Path) -> str:
    try:
        rel = path.resolve().relative_to(ROOT.resolve())
        return f"{PORTABLE_ROOT}/{rel.as_posix()}"
    except ValueError:
        return path.as_posix()


def _tokens(text: str) -> List[str]:
    words = re.findall(r"[a-zA-Z0-9][a-zA-Z0-9_-]{2,}", text.lower())
    stop_words = {
        "the",
        "and",
        "for",
        "with",
        "from",
        "this",
        "that",
        "must",
        "have",
        "into",
        "all",
        "use",
        "using",
        "system",
        "seosona",
    }
    return [word for word in words if word not in stop_words]


def _read_text(path: Path, limit: int = 20000) -> str:
    try:
        return path.read_text(encoding="utf-8", errors="ignore")[:limit]
    except OSError:
        return ""


def load_relevant_knowledge_items(task: str, limit: int = 8) -> List[Dict[str, Any]]:
    # [Context Compression] Try to load compressor for token savings
    _compressor = None
    try:
        from core.context_compressor import compress
        _compressor = compress
    except ImportError:
        pass

    try:
        from core.vector_memory import query_semantic_memory
        results = query_semantic_memory(task, limit)
        # Apply compression to reduce token cost
        if _compressor and results:
            for item in results:
                if item.get("portablePath"):
                    try:
                        real_path = item["portablePath"].replace(PORTABLE_ROOT, str(ROOT)).replace("/", os.sep)
                        content = _read_text(Path(real_path))
                        if content:
                            compressed, stats = _compressor(content)
                            item["compressedPreview"] = compressed[:500]
                            item["compressionRatio"] = stats.get("ratio", 0)
                    except Exception:
                        pass
        return results
    except Exception:
        # Fallback to naive keyword matching
        terms = set(_tokens(task))
        ki_dir = ROOT / "3_MEMORY" / "knowledge_items"
        if not ki_dir.exists():
            return []

        scored = []
        for path in sorted(ki_dir.glob("*.md")):
            content = _read_text(path)
            haystack = f"{path.stem} {content}".lower()
            matched = sorted(term for term in terms if term in haystack)
            score = len(matched)
            if score:
                title_match = re.search(r"^#\s+(.+)$", content, re.MULTILINE)
                scored.append(
                    {
                        "title": title_match.group(1).strip() if title_match else path.stem,
                        "portablePath": _to_portable(path),
                        "score": score,
                        "matchedTerms": matched[:10],
                    }
                )

        scored.sort(key=lambda item: (-item["score"], item["title"]))
        return scored[:limit]


def assemble_context(task: str) -> Dict[str, Any]:
    from context_engine import ContextEngine

    engine = ContextEngine()
    result = engine.assemble(task)
    return {
        "taskType": result.task_type,
        "domainTags": result.domain_tags,
        "blocksLoaded": result.blocks_loaded,
        "blocksSkipped": result.blocks_skipped,
        "tokensUsed": result.total_tokens,
        "budgetUsedPct": result.budget_used_pct,
    }


def route_intent(task: str, top_k: int) -> List[Dict[str, Any]]:
    from intent_router import IntentRouter

    router = IntentRouter()
    results = router.route(task, top_k=top_k)
    return [
        {
            "label": item.get("label"),
            "type": item.get("type"),
            "path": item.get("path"),
            "score": item.get("score"),
            "keywords": item.get("keywords", [])[:5],
        }
        for item in results
    ]


def query_knowledge_graph(task: str, top_k: int) -> List[Dict[str, Any]]:
    from knowledge_graph import KnowledgeGraph

    graph = KnowledgeGraph()
    if not graph.load():
        graph.build_from_skills()
    return graph.query(" ".join(_tokens(task)), top_k=top_k, max_hops=2)


def route_capability_bridge(task: str) -> Dict[str, Any]:
    bridge = ROOT / "1_CORE" / "scripts" / "seosona_capability_bridge.js"
    completed = subprocess.run(
        ["node", str(bridge), "route", task],
        cwd=ROOT,
        text=True,
        encoding="utf-8",
        capture_output=True,
        check=False,
    )
    if completed.returncode != 0:
        return {
            "ok": False,
            "error": completed.stderr.strip() or completed.stdout.strip(),
            "matches": [],
        }
    try:
        data = json.loads(completed.stdout)
    except json.JSONDecodeError:
        return {"ok": False, "error": "Capability bridge returned non-JSON output.", "matches": []}

    matches = data.get("matches", [])
    return {
        "ok": True,
        "matchCount": len(matches),
        "matches": [
            {
                "name": item.get("name"),
                "type": item.get("type"),
                "portablePath": item.get("portablePath"),
                "confidence": item.get("confidence"),
                "score": item.get("score"),
                "riskLevel": item.get("risk_level"),
                "safeToAutoExecute": item.get("safe_to_auto_execute"),
            }
            for item in matches[:10]
        ],
    }


def create_audit_plan(task: str) -> Dict[str, Any] | None:
    if not any(word in task.lower() for word in ["audit", "review", "test", "scan"]):
        return None

    from task_planner import TaskPlanner

    planner = TaskPlanner()
    plan = planner.create_plan("seosona-os", include_dashboard=False)
    return {
        "domain": plan.domain,
        "totalTasks": plan.total_tasks,
        "waves": len(plan.waves),
        "estimatedParallelSeconds": plan.estimated_duration_s,
        "parallelSpeedup": round(plan.parallel_speedup, 2),
        "executionPlan": plan.to_dict().get("execution_plan", []),
    }


def load_recent_alerts(limit: int = 5) -> List[Dict[str, Any]]:
    """Tail the predictive_scanner's alerts so telemetry -> alert -> next task
    actually closes the loop (previously the alerts file had no reader)."""
    alerts_file = ROOT / "3_MEMORY" / "logs" / "predictive_alerts.jsonl"
    if not alerts_file.exists():
        return []
    try:
        lines = [l for l in alerts_file.read_text(encoding="utf-8", errors="ignore").splitlines() if l.strip()]
        out = []
        for line in lines[-limit:]:
            try:
                out.append(json.loads(line))
            except json.JSONDecodeError:
                continue
        return out
    except OSError:
        return []


def build_activation_report(task: str, top_k: int = 8) -> Dict[str, Any]:
    knowledge_items = load_relevant_knowledge_items(task, limit=top_k)
    context = assemble_context(task)
    intent_routes = route_intent(task, top_k=top_k)
    graph_routes = query_knowledge_graph(task, top_k=top_k)
    bridge_routes = route_capability_bridge(task)
    audit_plan = create_audit_plan(task)

    recommended_files = []
    for item in knowledge_items:
        recommended_files.append(item["portablePath"])
    for item in bridge_routes.get("matches", []):
        if item.get("portablePath"):
            recommended_files.append(item["portablePath"])
    for item in graph_routes:
        if item.get("path"):
            graph_path = item["path"]
            if graph_path.startswith("frameworks/"):
                graph_path = f"2_KNOWLEDGE/{graph_path}"
            recommended_files.append(f"{PORTABLE_ROOT}/{graph_path}")

    # [Episodic Memory] Load user preferences
    try:
        from core.episodic_memory import get_activation_context
        episodic_context = get_activation_context()
    except ImportError:
        episodic_context = "Episodic memory not available."

    return {
        "schema": "seosona.autonomous_activation_gate.v1",
        "task": task,
        "root": PORTABLE_ROOT,
        "episodicMemory": episodic_context,
        "recentAlerts": load_recent_alerts(),
        "knowledgeItems": knowledge_items,
        "context": context,
        "intentRoutes": intent_routes,
        "knowledgeGraphRoutes": graph_routes,
        "capabilityBridge": bridge_routes,
        "auditPlan": audit_plan,
        "activationChecklist": [
            "Read the top Knowledge Items before new research.",
            "Load the context blocks reported by the context engine.",
            "Review Episodic Memory for specific user preferences and past lessons.",
            "Use the top intent and capability bridge routes as the execution stack.",
            "Run validation gates before commit or handoff.",
            "Persist durable learnings as KI/raw data/skill/workflow only when reusable.",
        ],
        "recommendedFiles": sorted(set(recommended_files))[:30],
    }


def print_human(report: Dict[str, Any]) -> None:
    print("SEOSONA Autonomous Activation Gate")
    print(f"Task: {report['task']}")
    print(f"Context: {report['context']['taskType']} / {', '.join(report['context']['domainTags'])}")
    print(f"Blocks loaded: {', '.join(report['context']['blocksLoaded'])}")
    print("")

    print("Knowledge Items:")
    for item in report["knowledgeItems"][:5]:
        print(f"- [{item['score']}] {item['title']} -> {item['portablePath']}")

    print("")
    print("Capability Bridge Routes:")
    for item in report["capabilityBridge"].get("matches", [])[:5]:
        print(f"- [{item.get('score')}] {item.get('type')} {item.get('name')} -> {item.get('portablePath')}")

    print("")
    print("Intent Router Routes:")
    for item in report["intentRoutes"][:5]:
        print(f"- [{item.get('score')}] {item.get('label')} -> {item.get('path')}")

    if report.get("auditPlan"):
        plan = report["auditPlan"]
        print("")
        print(f"Audit Plan: {plan['totalTasks']} tasks / {plan['waves']} waves / ~{plan['estimatedParallelSeconds']}s")

    print("")
    print("Activation Checklist:")
    for item in report["activationChecklist"]:
        print(f"- {item}")


def main() -> int:
    parser = argparse.ArgumentParser(description="SEOSONA Autonomous Activation Gate")
    parser.add_argument("--task", required=True, help="Task or user request to route.")
    parser.add_argument("--top-k", type=int, default=8, help="Number of routes to return per router.")
    parser.add_argument("--json", action="store_true", help="Print JSON output.")
    parser.add_argument("--execute", action="store_true",
                        help="Actually run the dispatchable action (default: dry-run plan only).")
    args = parser.parse_args()

    report = build_activation_report(args.task, top_k=args.top_k)

    # Reconnect routing -> execution. Without --execute this is a dry-run that
    # reports what WOULD run, so the gate is no longer assemble-then-discard.
    try:
        from core.dispatcher import dispatch_report
        report["dispatch"] = dispatch_report(report, execute=args.execute)
    except Exception as exc:  # noqa: BLE001
        report["dispatch"] = {"action": "error", "reason": str(exc)}

    if args.json:
        print(json.dumps(report, indent=2, ensure_ascii=False))
    else:
        print_human(report)
        d = report.get("dispatch", {})
        print("")
        print(f"Dispatch: {d.get('action', 'none')}" + (
            f" — {d.get('reason') or d.get('domain') or d.get('name') or ''}"))
        if d.get("action", "").startswith("ran") and "output" in d:
            print(f"  exit={d.get('exit_code')} ok={d.get('ok')}")
        

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
