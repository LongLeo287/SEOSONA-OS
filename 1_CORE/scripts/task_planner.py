#!/usr/bin/env python3
"""
SEOSONA OS V5 — Task Planner (DeerFlow-inspired)

Decomposes audit goals into a parallelizable task graph.
Reads the tool_registry.json to understand connector dependencies
and creates execution plans that maximize parallel throughput.

Key concepts:
  - Task Graph: DAG of connector executions with dependencies
  - Execution Waves: Groups of tasks that can run in parallel
  - Plan-Act-Reflect: Each wave validates results before proceeding

Usage:
    from task_planner import TaskPlanner
    planner = TaskPlanner()
    plan = planner.create_plan("popmart.com")
    planner.print_plan(plan)
"""

from __future__ import annotations

import json
import sys
import os
from collections import defaultdict
from dataclasses import dataclass, field, asdict
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Optional, Set

os.environ.setdefault("PYTHONIOENCODING", "utf-8")
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


ROOT = Path(__file__).resolve().parents[2]
REGISTRY_PATH = ROOT / "1_CORE" / "scripts" / "tool_registry.json"


@dataclass
class TaskNode:
    """A single task in the execution plan."""
    id: str
    label: str
    module: str
    inputs: Dict = field(default_factory=dict)
    dependencies: List[str] = field(default_factory=list)
    priority: int = 0
    category: str = ""
    estimated_duration_s: int = 30
    status: str = "pending"  # pending, running, completed, failed, skipped

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class ExecutionWave:
    """A group of tasks that can execute in parallel."""
    wave_number: int
    tasks: List[str] = field(default_factory=list)
    description: str = ""

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class ExecutionPlan:
    """Complete execution plan with waves and metadata."""
    domain: str
    waves: List[ExecutionWave] = field(default_factory=list)
    tasks: Dict[str, TaskNode] = field(default_factory=dict)
    created_at: str = field(default_factory=lambda: datetime.now().isoformat())
    total_tasks: int = 0
    estimated_duration_s: int = 0
    parallel_speedup: float = 1.0

    def to_dict(self) -> dict:
        return {
            "domain": self.domain,
            "created_at": self.created_at,
            "total_tasks": self.total_tasks,
            "waves": len(self.waves),
            "estimated_sequential_s": sum(t.estimated_duration_s for t in self.tasks.values()),
            "estimated_parallel_s": self.estimated_duration_s,
            "parallel_speedup": f"{self.parallel_speedup:.1f}x",
            "execution_plan": [
                {
                    "wave": w.wave_number,
                    "description": w.description,
                    "tasks": [self.tasks[tid].label for tid in w.tasks],
                    "parallel": len(w.tasks) > 1,
                }
                for w in self.waves
            ],
        }


class TaskPlanner:
    """
    Creates optimized execution plans from the tool registry.

    Reads connector definitions, builds a dependency graph,
    then computes execution waves using topological sorting.
    """

    def __init__(self):
        self.registry = self._load_registry()

    def _load_registry(self) -> Dict:
        """Load the tool registry."""
        if not REGISTRY_PATH.exists():
            return {"connectors": {}}
        try:
            return json.loads(REGISTRY_PATH.read_text(encoding="utf-8"))
        except Exception:
            return {"connectors": {}}

    def create_plan(
        self,
        domain: str,
        skip_connectors: Set[str] = None,
        include_dashboard: bool = True,
    ) -> ExecutionPlan:
        """
        Create an execution plan for a full audit.

        Args:
            domain: Target domain
            skip_connectors: Set of connector names to skip
            include_dashboard: Whether to include dashboard generation

        Returns:
            ExecutionPlan with waves and task nodes
        """
        skip = skip_connectors or set()
        plan = ExecutionPlan(domain=domain)

        # Build task nodes from registry
        connectors = self.registry.get("connectors", {})
        for name, config in connectors.items():
            if name in skip:
                continue
            if not include_dashboard and name == "dashboard_generator_v4":
                continue

            task = TaskNode(
                id=name,
                label=config.get("label", name),
                module=config.get("module", name),
                dependencies=[d for d in config.get("dependencies", []) if d not in skip],
                priority=config.get("priority", 99),
                category=config.get("category", "unknown"),
                estimated_duration_s=self._estimate_duration(name),
            )
            plan.tasks[name] = task

        # Compute execution waves via topological sort
        plan.waves = self._compute_waves(plan.tasks)
        plan.total_tasks = len(plan.tasks)

        # Estimate total duration
        sequential_total = sum(t.estimated_duration_s for t in plan.tasks.values())
        parallel_total = sum(
            max(plan.tasks[tid].estimated_duration_s for tid in w.tasks) if w.tasks else 0
            for w in plan.waves
        )
        plan.estimated_duration_s = parallel_total
        plan.parallel_speedup = sequential_total / max(parallel_total, 1)

        return plan

    def _estimate_duration(self, connector_name: str) -> int:
        """Estimate execution duration in seconds based on connector type."""
        estimates = {
            "psi_connector": 15,
            "keyword_connector": 10,
            "serp_competitor": 20,
            "backlink_connector": 15,
            "gsc_connector": 10,
            "rank_tracker": 5,
            "ga4_connector": 10,
            "technical_seo_scanner": 45,
            "schema_validator": 30,
            "eeat_analyzer": 40,
            "log_analyzer": 5,
            "aeo_ai_search_analyzer": 25,
            "dashboard_generator_v4": 10,
        }
        return estimates.get(connector_name, 20)

    def _compute_waves(self, tasks: Dict[str, TaskNode]) -> List[ExecutionWave]:
        """
        Compute execution waves using Kahn's topological sort algorithm.

        Tasks with no unresolved dependencies are grouped into the same wave.
        """
        # Build in-degree map
        in_degree = {tid: 0 for tid in tasks}
        dep_graph = defaultdict(list)  # dependency -> dependents

        for tid, task in tasks.items():
            for dep in task.dependencies:
                if dep in tasks:
                    in_degree[tid] += 1
                    dep_graph[dep].append(tid)

        waves = []
        remaining = set(tasks.keys())
        wave_num = 1

        while remaining:
            # Find all tasks with zero in-degree
            ready = [tid for tid in remaining if in_degree.get(tid, 0) == 0]

            if not ready:
                # Circular dependency — break by taking the highest priority task
                ready = [min(remaining, key=lambda t: tasks[t].priority)]

            # Sort by priority within the wave
            ready.sort(key=lambda t: tasks[t].priority)

            wave = ExecutionWave(
                wave_number=wave_num,
                tasks=ready,
                description=self._describe_wave(ready, tasks),
            )
            waves.append(wave)

            # Remove completed tasks and update in-degrees
            for tid in ready:
                remaining.discard(tid)
                for dependent in dep_graph.get(tid, []):
                    in_degree[dependent] = max(0, in_degree.get(dependent, 0) - 1)

            wave_num += 1

        return waves

    def _describe_wave(self, task_ids: List[str], tasks: Dict[str, TaskNode]) -> str:
        """Generate a human-readable description for a wave."""
        if len(task_ids) == 1:
            return f"Sequential: {tasks[task_ids[0]].label}"
        categories = set(tasks[tid].category for tid in task_ids)
        labels = [tasks[tid].label for tid in task_ids[:4]]
        suffix = f" (+{len(task_ids) - 4} more)" if len(task_ids) > 4 else ""
        return f"Parallel ({', '.join(categories)}): {', '.join(labels)}{suffix}"

    def print_plan(self, plan: ExecutionPlan):
        """Print a human-readable execution plan."""
        print("\n" + "=" * 65)
        print(f"📋 EXECUTION PLAN: {plan.domain}")
        print("=" * 65)
        print(f"   Tasks: {plan.total_tasks} | Waves: {len(plan.waves)}")

        seq_time = sum(t.estimated_duration_s for t in plan.tasks.values())
        print(f"   Sequential est.: {seq_time}s | Parallel est.: {plan.estimated_duration_s}s")
        print(f"   Speedup: {plan.parallel_speedup:.1f}x")
        print("-" * 65)

        for wave in plan.waves:
            parallel_tag = "⚡ PARALLEL" if len(wave.tasks) > 1 else "➡️  SEQUENTIAL"
            print(f"\n   Wave {wave.wave_number} [{parallel_tag}]")
            for tid in wave.tasks:
                task = plan.tasks[tid]
                deps = f" (after: {', '.join(task.dependencies)})" if task.dependencies else ""
                print(f"      • {task.label} (~{task.estimated_duration_s}s){deps}")

        print("\n" + "=" * 65)

    def save_plan(self, plan: ExecutionPlan) -> Path:
        """Save execution plan to disk."""
        plans_dir = ROOT / "3_MEMORY" / "plans"
        plans_dir.mkdir(parents=True, exist_ok=True)
        path = plans_dir / f"execution_plan_{plan.domain.replace('.', '-')}_{datetime.now().strftime('%Y%m%d')}.json"
        path.write_text(
            json.dumps(plan.to_dict(), indent=2, ensure_ascii=False),
            encoding="utf-8",
        )
        return path


# ── CLI Entry Point ──────────────────────────────────────────────────────────

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="SEOSONA Task Planner")
    parser.add_argument("--domain", default="example.com")
    parser.add_argument("--save", action="store_true")
    args = parser.parse_args()

    planner = TaskPlanner()
    plan = planner.create_plan(args.domain)
    planner.print_plan(plan)

    if args.save:
        path = planner.save_plan(plan)
        print(f"\n   📄 Plan saved: {path}")
