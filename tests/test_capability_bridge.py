"""
Tests for the capability bridge — the OS's routing brain.

It is the most-invoked component in the system: every user prompt goes through it via the
brain-inject hook, and every dispatch decision starts from its output. It had no tests at all, so
the routing regressions found in the 2026-08-04 audit (a meta-skill hijacking every "audit" query,
`confidence: 1` from a single accidental substring hit, conversational filler scoring against
unrelated skills) were invisible until someone read the output by hand.

Run: python -m pytest tests/ -q
"""
import json
import subprocess
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parent.parent
BRIDGE = ROOT / "1_CORE" / "scripts" / "seosona_capability_bridge.js"


def _bridge(*args):
    """Invoke the bridge exactly as the hook and the dispatcher do, and parse its JSON."""
    proc = subprocess.run(
        ["node", str(BRIDGE), *args],
        cwd=ROOT, capture_output=True, text=True, encoding="utf-8", timeout=90,
    )
    assert proc.returncode == 0, f"bridge exited {proc.returncode}: {proc.stderr[:400]}"
    return json.loads(proc.stdout)


@pytest.fixture(scope="module")
def manifest():
    return _bridge("manifest")


class TestManifestIntegrity:
    def test_manifest_has_resources_and_skills(self, manifest):
        assert len(manifest["resources"]) > 0
        assert manifest["counts"]["skill"] > 0

    def test_every_resource_has_a_portable_path(self, manifest):
        """A resource whose path is machine-specific breaks on every other install."""
        bad = [r for r in manifest["resources"] if not r["portablePath"].startswith("~/.seosona/")]
        assert not bad, f"{len(bad)} resources are not portable, e.g. {bad[:3]}"

    def test_no_resource_path_escapes_the_repo(self, manifest):
        """The router is generated from third-party SKILL.md frontmatter. A crafted `name:` was able
        to forge a route pointing outside the repo — this is the regression guard for that."""
        # `..` as a PATH SEGMENT is traversal; `..` inside a filename (a repo named "Eris."
        # yields uap_..Eris..md) is not. Only the former can leave the repo.
        escaping = [
            r["portablePath"] for r in manifest["resources"]
            if ".." in r["portablePath"].replace("~/.seosona/", "").split("/")
        ]
        assert not escaping, f"routes escape the repo: {escaping[:3]}"

    def test_resource_names_are_labels_not_documents(self, manifest):
        """Some generated KIs are written as a single long line; the name extractor used to swallow
        the whole article, and that blob then crowded real matches out of every route result."""
        oversized = [r["name"] for r in manifest["resources"] if len(r["name"]) > 200]
        assert not oversized, f"{len(oversized)} names look like documents, e.g. {oversized[:1]}"


class TestRouting:
    def test_domain_query_returns_domain_skills(self):
        result = _bridge("route", "technical seo audit crawlability")
        skills = [m for m in result["matches"] if m["type"] == "skill"]
        assert skills, "an on-domain query returned no skills"
        assert any("seo" in m["name"].lower() for m in skills[:5])

    def test_meta_skill_does_not_hijack_ordinary_audits(self):
        """'audit' is the most common word in this repo's SEO vocabulary. A +5 boost keyed on it
        handed the #1 slot to the capability-bridge meta-skill for every SEO query."""
        result = _bridge("route", "seo audit")
        skills = [m for m in result["matches"] if m["type"] == "skill"]
        assert skills
        assert "portable-capability-bridge" not in skills[0]["name"]

    def test_vietnamese_query_reaches_the_right_skill(self):
        """Skills are described in English; a Vietnamese task used to match nothing at all."""
        result = _bridge("route", "phan tich doi thu canh tranh")
        names = [m["name"].lower() for m in result["matches"] if m["type"] == "skill"]
        assert any("competitor" in n for n in names), f"no competitor skill in {names[:5]}"

    def test_conversational_filler_scores_low(self):
        """Function words appear in nearly every skill's text, so 'can you help me' used to return
        20 results at 50% confidence. Nothing should score like a real match."""
        result = _bridge("route", "can you help me please")
        top = max((m.get("score", 0) for m in result["matches"]), default=0)
        assert top < 3, f"filler query scored {top} — it should not look like a real match"

    def test_repeated_terms_do_not_inflate_score(self):
        one = _bridge("route", "audit")
        three = _bridge("route", "audit audit audit")
        top1 = max((m.get("score", 0) for m in one["matches"]), default=0)
        top3 = max((m.get("score", 0) for m in three["matches"]), default=0)
        assert top3 <= top1, f"duplicate terms inflated the score ({top1} -> {top3})"


class TestValidate:
    def test_validate_passes_and_reports_portability(self):
        result = _bridge("validate")
        assert result["ok"] is True, f"validate failed: {result.get('errors')}"
        assert result["portability"]["ok"] is True

    def test_skill_floor_reflects_reality(self):
        """The floor guard existed to catch a regression that dropped the graph to 3 skills. Set too
        low it is decorative — a drop of two thirds would still pass."""
        result = _bridge("validate")
        assert result["counts"]["skill"] > 300, "skill count collapsed — regenerate SKILLS_ROUTER.md"
