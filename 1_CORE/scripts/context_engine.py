#!/usr/bin/env python3
"""
SEOSONA OS V5 — Context Engine

Manages context window composition for AI interactions.
Replaces the monolithic SOUL.md approach with dynamic, modular context assembly.

Key concepts:
  - Context Blocks: Modular pieces of system prompt (identity, rules, skills, memory)
  - Context Budget: Token-aware assembly that fits within model limits
  - Task-Adaptive: Assembles different context for audit vs. research vs. build tasks
  - Priority Tiers: Core blocks always loaded, skill blocks loaded on-demand

Inspired by RTK context management and DeerFlow task-adaptive prompting.

Usage:
    from context_engine import ContextEngine
    engine = ContextEngine()
    context = engine.assemble("audit technical SEO for popmart.com")
    print(context.total_tokens)
    print(context.blocks_loaded)
"""

from __future__ import annotations

import json
import re
import os
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import List, Dict, Optional

os.environ.setdefault("PYTHONIOENCODING", "utf-8")
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


ROOT = Path(__file__).resolve().parents[2]

# Common words that carry no routing signal — dropped from both skill keywords and
# task terms so generic tokens ("and", "for", "build") don't create false matches.
_STOPWORDS = {
    "and", "the", "for", "with", "from", "that", "this", "your", "our", "are", "was",
    "will", "can", "into", "onto", "via", "per", "any", "all", "use", "using", "used",
    "get", "set", "new", "how", "what", "when", "make", "build", "create", "run",
    "guide", "skill", "skills", "based", "data", "tool", "tools", "system",
}


@dataclass
class ContextBlock:
    """A modular block of context that can be composed."""
    id: str
    label: str
    content: str
    tier: str  # "core" (always), "domain" (task-adaptive), "skill" (on-demand)
    priority: int = 0  # Lower = higher priority
    token_estimate: int = 0
    tags: List[str] = field(default_factory=list)

    def __post_init__(self):
        if self.token_estimate == 0:
            # Rough estimate: 1 token ≈ 4 characters
            self.token_estimate = len(self.content) // 4


@dataclass
class AssembledContext:
    """Result of context assembly."""
    blocks_loaded: List[str]
    blocks_skipped: List[str]
    total_tokens: int
    budget_used_pct: float
    context_text: str
    task_type: str
    domain_tags: List[str]


# ── Context Block Definitions ────────────────────────────────────────────────

def _load_block_from_file(block_id: str, label: str, path: Path, tier: str, priority: int, tags: List[str]) -> Optional[ContextBlock]:
    """Load a context block from a file."""
    if not path.exists():
        return None
    try:
        content = path.read_text(encoding="utf-8", errors="ignore")
        return ContextBlock(
            id=block_id,
            label=label,
            content=content,
            tier=tier,
            priority=priority,
            tags=tags,
        )
    except Exception:
        return None


class ContextEngine:
    """
    Dynamic context assembly engine.

    Builds task-adaptive context windows from modular blocks,
    respecting token budgets and priority tiers.
    """

    def __init__(self, max_tokens: int = 100000):
        self.max_tokens = max_tokens
        self._blocks: Dict[str, ContextBlock] = {}
        self._load_core_blocks()

    def _load_core_blocks(self):
        """Load all available context blocks from the filesystem."""
        # Build the keyword index first so the identity block can report the real
        # skill count instead of a hardcoded (and stale) number.
        self._load_skill_index()

        # Tier 1: Core Identity (always loaded)
        self._register_block(ContextBlock(
            id="identity",
            label="System Identity",
            content=self._build_identity_block(),
            tier="core",
            priority=0,
            tags=["identity", "core"],
        ))

        self._register_block(ContextBlock(
            id="rules",
            label="Operating Rules",
            content=self._build_rules_block(),
            tier="core",
            priority=1,
            tags=["rules", "core"],
        ))

        self._register_block(ContextBlock(
            id="v5_capabilities",
            label="V5 System Capabilities",
            content=self._build_v5_block(),
            tier="core",
            priority=2,
            tags=["capabilities", "core"],
        ))

        # Tier 2: Domain blocks (loaded based on task type)
        seo_block = _load_block_from_file(
            "seo_framework", "SEO Analysis Framework",
            ROOT / "2_KNOWLEDGE" / "frameworks" / "seo_marketing" / "claude_seo_framework" / "SKILL.md",
            "domain", 10, ["seo", "audit", "technical"],
        )
        if seo_block:
            self._register_block(seo_block)

        # Load brand context if available
        brand_block = _load_block_from_file(
            "brand_context", "Brand Guidelines",
            ROOT / "3_MEMORY" / "specs" / "brand_guidelines.md",
            "domain", 15, ["brand", "identity", "content"],
        )
        if brand_block:
            self._register_block(brand_block)

        # Load SEOSONA operation manual
        ops_block = _load_block_from_file(
            "operations", "SEOSONA Operations Manual",
            ROOT / "1_CORE" / "SEOSONA_OPERATION.md",
            "domain", 12, ["operations", "workflow", "audit"],
        )
        if ops_block:
            self._register_block(ops_block)

        # Tier 3: skills are NOT pre-loaded. The keyword index was built at the top
        # of this method; skills matching a task are lazy-loaded at assemble() time.
        # This fixes precision (the 22k keyword index now drives selection instead of
        # 14 coarse category tags) and removes a slow rglob over 22k files.

    def _load_skill_index(self):
        """Parse 2_KNOWLEDGE/SKILLS_ROUTER.md into a keyword index.

        Each entry is (keyword_tokens:set[str], framework_rel_path:str). This is the
        same 22k-line index the capability bridge uses, so context assembly now
        routes by the real keywords rather than coarse directory tags.
        """
        self._skill_index = []  # list[ (set[str], str) ]
        router = ROOT / "2_KNOWLEDGE" / "SKILLS_ROUTER.md"
        if not router.exists():
            return
        try:
            for line in router.read_text(encoding="utf-8", errors="ignore").splitlines():
                if " -> " not in line:
                    continue
                left, right = line.split(" -> ", 1)
                path_m = re.search(r"`([^`]+)`", right)
                if not path_m:
                    continue
                path = path_m.group(1).strip().rstrip("/")
                tokens = set()
                for kw in re.findall(r"`([^`]+)`", left):
                    tokens.update(t for t in re.findall(r"[a-z0-9]+", kw.lower())
                                  if len(t) > 2 and t not in _STOPWORDS)
                if tokens and path:
                    self._skill_index.append((tokens, path))
        except Exception:
            self._skill_index = []

    def _select_skills_by_keywords(self, task: str, top_n: int = 60):
        """Return up to top_n framework paths whose router keywords best match the task."""
        task_tokens = {t for t in re.findall(r"[a-z0-9]+", task.lower())
                       if len(t) > 2 and t not in _STOPWORDS}
        if not task_tokens or not self._skill_index:
            return []
        scored = []
        for tokens, path in self._skill_index:
            overlap = len(tokens & task_tokens)
            if overlap > 0:
                # Prefer higher overlap; break ties toward more specific (longer) paths.
                scored.append((overlap, path))
        scored.sort(key=lambda x: (-x[0], x[1]))
        seen = set(); out = []
        for _, path in scored:
            if path not in seen:
                seen.add(path); out.append(path)
            if len(out) >= top_n:
                break
        return out

    def _select_output_style(self, task: str) -> Optional[Path]:
        """Map a task's level/format intent to a 2_KNOWLEDGE/output_styles file.

        Wires the previously-orphaned output styles into context assembly so an
        explicit level ("explain like senior", "as a report") changes the tone.
        """
        t = task.lower()
        styles = ROOT / "2_KNOWLEDGE" / "output_styles"
        content_map = [("proposal", "content-level-proposal.md"),
                       ("report", "content-level-report.md"),
                       ("blog", "content-level-blog.md")]
        level_map = [("eli5", "coding-level-0-eli5.md"), ("beginner", "coding-level-0-eli5.md"),
                     ("junior", "coding-level-1-junior.md"), ("mid-level", "coding-level-2-mid.md"),
                     ("senior", "coding-level-3-senior.md"), ("lead", "coding-level-4-lead.md"),
                     ("god", "coding-level-5-god.md"), ("expert", "coding-level-5-god.md")]
        for kw, fname in content_map + level_map:
            if kw in t:
                p = styles / fname
                if p.exists():
                    return p
        return None

    def _register_block(self, block: ContextBlock):
        self._blocks[block.id] = block

    def _build_identity_block(self) -> str:
        """Build the core identity context block."""
        skill_count = len(getattr(self, "_skill_index", []))
        return f"""# SEOSONA OS v5.0 — Harness Engineering Machine

You are the SEOSONA Senior Developer, an advanced Harness Engineering machine.
You are an end-to-end operational agent with 5 dynamic parts:
Personalisation, Context, Action, Memory, and Delegation.

## Prime Directive: Absolute Zero-Touch Autonomy
- Proactive system: analyze context, auto-spawn agents, generate skills
- Execute and Notify — do not wait for permission
- Every interaction triggers the Plan-Act-Reflect loop

## V5 Enhancements
- Skill Index: {skill_count} keyword-routed skills for semantic routing
- Intent Router: classify intent, extract domain terms, route to skills
- Session Memory: cross-session learning with time-decay retrieval
- Validation Loops: every output validated before acceptance
- Fix Loops: automatic retry with failure diagnosis
"""

    def _build_rules_block(self) -> str:
        """Build the operating rules context block."""
        return """## Operating Rules

1. LANGUAGE POLICY: 1_CORE must be 100% English. Vietnamese only for user chat and localized domain knowledge.
2. NO HARDCODED PATHS: Use ~/.seosona/, ${SEOSONA_ROOT}, or relative paths only.
3. CANARY TOKEN: End every major task with "TASK COMPLETED".
4. PROACTIVE EVOLUTION: If missing knowledge/skills detected, autonomously create them.
5. STRICT EXECUTION: Never skip validation or testing steps.
6. MANDATORY ORCHESTRATION: Consult SKILLS_ROUTER and Knowledge Graph for skill routing.
7. SECRET CHECKS: Verify no secrets before commits using security_regex_rules.md.
"""

    def _build_v5_block(self) -> str:
        """Build the V5 capabilities context block."""
        return """## V5 System Architecture

### Audit Pipeline (18 Steps)
Steps 1-13: Data collection with Fix Loops (retry-with-backoff)
Step 14: Brand Context | Step 15: Content Gap Analysis
Step 16: Dashboard v4 | Step 17: Validation Report | Step 18: Session Memory

### Intelligence Layer
- Knowledge Graph: graph-based skill retrieval (dual-level: entity + topic)
- Intent Router: intent classification → KG query → fallback routing
- Session Memory: per-domain session history with time-decay

### Quality Assurance
- Validation: per-connector rules, marker detection, confidence scoring
- Fix Loop: failure diagnosis (network/auth/rate-limit), exponential backoff
- Quality Scorer: composite scoring (completeness, freshness, contamination)
- Task Planner: topological sort for parallel execution waves

### Available Connectors (14)
PSI/CWV, Keywords, SERP Competitor, Backlinks, GSC, Rank Tracker,
GA4, Technical SEO, Schema, E-E-A-T, Log Analyzer, AEO/AI Search,
Brand Context, Dashboard v4
"""

    def assemble(
        self,
        task_description: str = "",
        include_memory: bool = True,
        budget_pct: float = 0.7,
    ) -> AssembledContext:
        """
        Assemble a context window for a given task.

        Args:
            task_description: Natural language task description
            include_memory: Whether to include session memory
            budget_pct: Maximum percentage of token budget to use (0.0-1.0)

        Returns:
            AssembledContext with composed text and metadata
        """
        budget = int(self.max_tokens * budget_pct)
        used_tokens = 0
        loaded = []
        skipped = []
        parts = []

        # Determine task type and relevant tags
        task_type, domain_tags = self._classify_task(task_description)

        # Sort blocks by tier priority then block priority
        tier_order = {"core": 0, "domain": 1, "skill": 2}
        sorted_blocks = sorted(
            self._blocks.values(),
            key=lambda b: (tier_order.get(b.tier, 99), b.priority),
        )

        for block in sorted_blocks:
            # Core blocks always included
            if block.tier == "core":
                if used_tokens + block.token_estimate <= budget:
                    parts.append(f"<!-- context: {block.id} -->\n{block.content}")
                    used_tokens += block.token_estimate
                    loaded.append(block.id)
                else:
                    skipped.append(block.id)
                continue

            # Domain/skill blocks: check tag relevance
            relevance = self._compute_relevance(block, task_type, domain_tags)
            if relevance > 0.3 and used_tokens + block.token_estimate <= budget:
                parts.append(f"<!-- context: {block.id} -->\n{block.content}")
                used_tokens += block.token_estimate
                loaded.append(block.id)
            else:
                skipped.append(block.id)

        # Tier 3: keyword-routed skills — lazy-load only the SKILL.md files whose
        # router keywords match this task, in relevance order, until the budget fills.
        fw_root = ROOT / "2_KNOWLEDGE"
        for rel_path in self._select_skills_by_keywords(task_description):
            skill_md = fw_root / rel_path / "SKILL.md"
            if not skill_md.exists():
                skill_md = fw_root / rel_path / "DESIGN.md"
            if not skill_md.exists():
                continue
            try:
                content = skill_md.read_text(encoding="utf-8", errors="ignore")[:2000]
            except Exception:
                continue
            est = max(len(content) // 4, 1)
            block_id = "skill:" + rel_path.replace("frameworks/", "")
            if used_tokens + est > budget:
                skipped.append(block_id)
                continue
            parts.append(f"<!-- context: {block_id} -->\n{content}")
            used_tokens += est
            loaded.append(block_id)

        # Output style: inject the matching tone/format template if the task asks.
        style_path = self._select_output_style(task_description)
        if style_path:
            try:
                style_content = style_path.read_text(encoding="utf-8", errors="ignore")[:1500]
                est = max(len(style_content) // 4, 1)
                if used_tokens + est <= budget:
                    parts.append(f"<!-- context: output_style -->\n{style_content}")
                    used_tokens += est
                    loaded.append(f"output_style:{style_path.stem}")
            except Exception:
                pass

        # Add session memory if requested and budget allows
        if include_memory and task_description:
            memory_block = self._build_memory_block(task_description)
            if memory_block and used_tokens + memory_block.token_estimate <= budget:
                parts.append(f"<!-- context: session_memory -->\n{memory_block.content}")
                used_tokens += memory_block.token_estimate
                loaded.append("session_memory")

        context_text = "\n\n---\n\n".join(parts)

        return AssembledContext(
            blocks_loaded=loaded,
            blocks_skipped=skipped,
            total_tokens=used_tokens,
            budget_used_pct=round(used_tokens / max(budget, 1) * 100, 1),
            context_text=context_text,
            task_type=task_type,
            domain_tags=domain_tags,
        )

    def _classify_task(self, task: str) -> tuple:
        """Classify a task into type and domain tags."""
        task_lower = task.lower()
        task_words = set(re.findall(r"\b[\w-]+\b", task_lower))

        def has_term(term: str) -> bool:
            if " " in term:
                return re.search(rf"\b{re.escape(term)}\b", task_lower) is not None
            return term in task_words

        # Task type classification
        task_types = {
            "audit": ["audit", "analyze", "scan", "check", "review"],
            "research": ["research", "find", "discover", "explore"],
            "build": ["create", "build", "generate", "write", "design"],
            "fix": ["fix", "repair", "debug", "resolve"],
            "monitor": ["monitor", "track", "report", "dashboard"],
        }
        task_type = "general"
        for ttype, keywords in task_types.items():
            if any(has_term(k) for k in keywords):
                task_type = ttype
                break

        # Domain tags
        domain_map = {
            "seo": ["seo", "serp", "ranking", "keyword", "backlink"],
            "technical": ["technical", "robots", "sitemap", "schema", "crawl"],
            "content": ["content", "eeat", "quality", "thin"],
            "analytics": ["analytics", "ga4", "gsc", "traffic"],
            "performance": ["performance", "pagespeed", "cwv"],
            "brand": ["brand", "branding", "identity"],
            "agentic": ["agent", "agents", "skill", "skills", "workflow", "workflows", "capability", "autonomy", "automatic"],
            "system": ["system", "os", "router", "bridge", "knowledge", "memory"],
        }
        tags = []
        for tag, keywords in domain_map.items():
            if any(has_term(k) for k in keywords):
                tags.append(tag)

        if not tags:
            tags = ["general"]

        return task_type, tags

    def _compute_relevance(self, block: ContextBlock, task_type: str, domain_tags: List[str]) -> float:
        """Compute relevance score of a block to the current task."""
        score = 0.0

        # Tag overlap
        block_tags = set(block.tags)
        task_tags = set(domain_tags)
        if block_tags & task_tags:
            score += 0.5 * len(block_tags & task_tags)

        # Task type matching
        type_tag_map = {
            "audit": {"seo", "technical", "audit", "analysis"},
            "research": {"research", "content", "competitive"},
            "build": {"build", "design", "frontend", "development"},
            "fix": {"fix", "debug", "technical"},
            "monitor": {"analytics", "tracking", "dashboard"},
        }
        relevant_tags = type_tag_map.get(task_type, set())
        if block_tags & relevant_tags:
            score += 0.3

        return min(score, 1.0)

    def _build_memory_block(self, task_description: str) -> Optional[ContextBlock]:
        """Build a memory context block from session history."""
        # Extract domain from task description
        domain_match = re.search(r'(\w+\.\w+(?:\.\w+)*)', task_description)
        if not domain_match:
            return None

        domain = domain_match.group(1)
        try:
            from session_memory import SessionMemory
            memory = SessionMemory(domain)
            context = memory.get_learning_context(max_sessions=2)
            if "No previous audit" in context:
                return None
            return ContextBlock(
                id="session_memory",
                label="Session Memory",
                content=context,
                tier="skill",
                priority=20,
                tags=["memory", "history"],
            )
        except Exception:
            return None

    def get_stats(self) -> Dict:
        """Get context engine statistics."""
        return {
            "total_blocks": len(self._blocks),
            "core_blocks": sum(1 for b in self._blocks.values() if b.tier == "core"),
            "domain_blocks": sum(1 for b in self._blocks.values() if b.tier == "domain"),
            "indexed_skills": len(getattr(self, "_skill_index", [])),
            "skill_loading": "lazy (keyword-routed at assemble time)",
            "total_token_budget": self.max_tokens,
        }


# ── CLI Entry Point ──────────────────────────────────────────────────────────

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="SEOSONA Context Engine")
    parser.add_argument("--task", type=str, default="", help="Task to assemble context for")
    parser.add_argument("--stats", action="store_true")
    parser.add_argument("--budget", type=float, default=0.7, help="Budget percentage (0.0-1.0)")
    args = parser.parse_args()

    engine = ContextEngine()

    if args.stats:
        print(json.dumps(engine.get_stats(), indent=2))
    elif args.task:
        result = engine.assemble(args.task, budget_pct=args.budget)
        print(f"\nTask Type: {result.task_type}")
        print(f"Domain Tags: {result.domain_tags}")
        print(f"Blocks Loaded: {result.blocks_loaded}")
        print(f"Blocks Skipped: {result.blocks_skipped}")
        print(f"Tokens Used: {result.total_tokens} ({result.budget_used_pct}% of budget)")
        print(f"\n--- Context Preview (first 500 chars) ---")
        print(result.context_text[:500])
    else:
        print(json.dumps(engine.get_stats(), indent=2))
