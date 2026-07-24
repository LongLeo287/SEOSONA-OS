# Architecture Extract: skillspector

## Directory Structure
```text
skillspector/
    .dockerignore
    .env.example
    .gitignore
    .pre-commit-config.yaml
    CONTRIBUTING.md
    Dockerfile
    langgraph.json
    LICENSE
    Makefile
    model_registry.yaml
    pyproject.toml
    README.md
    SECURITY.md
    THIRD_PARTY_NOTICES.md
    uv.lock
    docs/
        B.3.1-mcp-least-privilege.md
        B.3.2-mcp-tool-poisoning.md
        DEVELOPMENT.md
        EVAL_DATASETS.md
        LLM_ANALYZER_BASE_GUIDE.md
        SC4-osv-live-vulnerability-lookups.md
        plans/
            2026-04-03-skilltrap-integration.md
    src/
        skillspector/
            cli.py
            constants.py
            graph.py
            input_handler.py
            llm_analyzer_base.py
            llm_utils.py
            logging_config.py
            models.py
            model_info.py
            sarif_models.py
            state.py
            __init__.py
            nodes/
                build_context.py
                meta_analyzer.py
                report.py
                resolve_input.py
                __init__.py
                analyzers/
                    behavioral_ast.py
                    behavioral_taint_tracking.py
                    common.py
                    mcp_least_privilege.py
                    mcp_rug_pull.py
                    mcp_tool_poisoning.py
                    osv_client.py
                    pattern_defaults.py
                    semantic_developer_intent.py
                    semantic_quality_policy.py
                    semantic_security_discovery.py
                    static_patterns_data_exfiltration.py
                    static_patterns_excessive_agency.py
                    static_patterns_harmful_content.py
                    static_patterns_memory_poisoning.py
                    static_patterns_output_handling.py
                    static_patterns_privilege_escalation.py
                    static_patterns_prompt_injection.py
                    static_patterns_rogue_agent.py
                    static_patterns_supply_chain.py
                    static_patterns_system_prompt_leakage.py
                    static_patterns_tool_misuse.py
                    static_runner.py
                    static_yara.py
                    __init__.py
            providers/
                base.py
                registry.py
                __init__.py
                anthropic/
                    model_registry.yaml
                    provider.py
                    __init__.py
                nv_build/
                    model_registry.yaml
                    provider.py
                    __init__.py
                openai/
                    model_registry.yaml
                    provider.py
                    __init__.py
            yara_rules/
                cryptominers.yar
                hacktools.yar
                malware.yar
                webshells.yar
    tests/
        conftest.py
        test_mcp_least_privilege.py
        test_mcp_tool_poisoning.py
        __init__.py
        fixtures/
            malicious_skill/
                SKILL.md
                scripts/
                    helper.py
            mcp_clean_skill/
                SKILL.md
                scripts/
                    format.py
            mcp_mismatched_skill/
                SKILL.md
                scripts/
                    greet.py
            mcp_overprivileged_skill/
                SKILL.md
                scripts/
                    helper.py
            mcp_poisoned_tool/
                SKILL.md
                scripts/
                    reader.py
            mcp_underdeclared_skill/
                SKILL.md
                scripts/
                    agent.py
            safe_skill/
                SKILL.md
            sdi/
                sdi1_mismatch/
                    SKILL.md
                    summarizer.py
                sdi2_inappropriate/
                    formatter.py
                    SKILL.md
                sdi3_scope_creep/
                    config_reader.py
                    SKILL.md
                sdi4_divergence/
                    processor.py
                    SKILL.md
                sdi_clean/
                    indexer.py
                    SKILL.md
            sqp/
                sqp1_clean/
                    SKILL.md
                sqp1_vague_triggers/
                    SKILL.md
                sqp2_clean/
                    deploy.py
                    SKILL.md
                sqp2_missing_warnings/
                    organizer.py
                    SKILL.md
                sqp3_clean/
                    config.yaml
                    SKILL.md
                sqp3_locale_forcing/
                    config.yaml
                    SKILL.md
            ssd/
                ssd1_semantic_injection/
                    SKILL.md
                ssd2_novel_phrasing/
                    SKILL.md
                ssd3_nl_exfiltration/
                    SKILL.md
                ssd4_narrative_deception/
                    SKILL.md
                ssd_clean/
                    SKILL.md
        integration/
            conftest.py
            test_graph.py
            test_graph_scanner.py
            test_meta_analyzer_use_llm.py
            __init__.py
        nodes/
            test_build_context.py
            test_llm_analyzer_base.py
            test_report.py
            test_resolve_input.py
            test_semantic_quality_policy.py
            __init__.py
            analyzers/
                conftest.py
                test_behavioral_ast.py
                test_behavioral_taint_tracking.py
                test_registry.py
                test_semantic_developer_intent.py
                test_semantic_security_discovery.py
                test_static_patterns.py
                test_static_yara.py
        unit/
            test_cli.py
            test_input_handler.py
            test_llm_utils.py
            test_model_info.py
            test_osv_client.py
            test_patterns.py
            test_patterns_new.py
            test_providers.py
            test_sarif.py
            __init__.py
```

## Core Logic Samples

### `langgraph.json`
```
{
  "dependencies": ["."],
  "graphs": {
    "skillspector_scan": "./src/skillspector/graph.py:graph"
  },
  "env": ".env",
  "python_version": "3.12"
}
```

### `src\skillspector\cli.py`
```
# SPDX-FileCopyrightText: Copyright (c) 2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
# SPDX-License-Identifier: Apache-2.0
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""CLI for Skillspector — thin wrapper over the LangGraph workflow.

Maps CLI args to initial state, invokes the graph, then maps result to output and exit code.
No business logic; workflow lives in the graph.
"""

from __future__ import annotations

import json
import os
import shutil
from enum import StrEnum
from pathlib import Path
from typing import Annotated

import typer
from langchain_core.runnables import RunnableConfig
from rich.console import Console

from skillspector import __version__
from skillspector.graph import graph
from skillspector.logging_config import get_logger, set_level

logger = get_logger(__name__)

app = typer.Typer(
    name="skillspector",
    help="Security scanner for AI agent skills (LangGraph). Detect vulnerabilities before installation.",
    add_completion=False,
    no_args_is_help=True,
)

console = Console()


class FormatChoice(StrEnum):
    """Output format choices for the CLI."""

    terminal = "terminal"
    json = "json"
    markdown = "markdown"
    sarif = "sarif"


def version_callback(value: bool) -> None:
    """Print version and exit."""
    if value:
        console.print(f"SkillSpector v{__version__}")
        raise typer.Exit()


@app.callback()
def main(
    version: Annotated[
        bool | None,
        typer.Option(
            "--version",
            "-v",
            help="Show version and exit.",
            callback=version_callback,
            is_eager=True,
        ),
    ] = None,
) -> None:
    """
    SkillSpector - Security scanner for AI agent skills (LangGraph).

    Analyze skill bundles to detect vulnerabilities and security risks.
    Supports: Git URL, file URL, .zip file, .md file, or directory.
    """
    pass


def _scan_state(
    input_path: str,
    format: FormatChoice,
    no_llm: bool,
    yara_rules_dir: str | None = None,
) -> dict[str, object]:
    """Build initial graph state from scan CLI args."""
    state: dict[str, object] = {
        "input_path": input_path,
        "output_format": format.value,
        "use_llm": not no_llm,
    }
    if yara_rules_dir is not None:
        state["yara_rules_dir"] = yara_rules_dir
    return state


def _write_result(
    result: dict[str, object],
    output: Path | None,
    format: FormatChoice,
) -> None:
    """Write report_body to file or stdout. Uses sarif_report if report_body missing."""
    report_body = result.get("report_body") or ""
    if not report_body and result.get("sarif_report") is not None:
        report_body = json.dumps(result["sarif_report"], indent=2)
    if output:
        Path(output).write_text(report_body, encoding="utf-8")
        if format == FormatChoice.terminal:
            console.print(f"\n[green]Report saved to:[/green] {output}")
        else:
            console.print(f"Report saved to: {output}")
    else:
        if format == FormatChoice.terminal:
            console.print(report_body)
        else:
            print(report_body)


def _cleanup_result(result: dict[str, object]) -> None:
    """Remove temp dir from graph result if set."""
    temp_dir = result.get("temp_dir_for_cleanup")
    if temp_dir and isinstance(temp_dir, str):
        shutil.rmtree(temp_dir, ignore_errors=True)


@app.command()
def scan(
    input_path: Annotated[
        str,
        typer.Argument(
            help="Path or URL to scan. Supports: Git URL, file URL, zip file, .md file, or directory.",
        ),
    ],
    format: Annotated[
        FormatChoice,
        typer.Option(
            "--format",
            "-f",
            help="Output format.",
            case_sensitive=False,
        ),
    ] = FormatChoice.terminal,
    output: Annotated[
        Path | None,
        typer.Option(
            "--output",
            "-o",
            help="Output file path. If not specified, prints to stdout.",
        ),
    ] = None,
    no_llm: Annotated[
        bool,
        typer.Option(
            "--no-llm",
            help="Skip LLM analysis (faster, less accurate). Uses static analysis only.",
        ),
    ] = False,
    yara_rules_dir: Annotated[
        Path | None,
        typer.Option(
            "--yara-rules-dir",
            help="Directory containing additional YARA rule files (.yar/.yara) to load alongside built-in rules.",
        ),
    ] = None,
    verbose: Annotated[
        bool,
        typer.Option(
            "--verbose",
            "-V",
            help="Show detailed progress.",
        ),
    ] = False,
) -> None:
    """
    Scan a skill for security vulnerabilities.

    Examples:

        skillspector scan ./my-skill/
        skillspector scan ./my-skill/ --format json --output report.json
        skillspector scan https://github.com/user/my-skill --no-llm

    Environment variables:

        SKILLSPECTOR_PROVIDER  Active LLM provider: openai | anthropic |
                               nv_build | nv_inference. Defaults to the
                               NVIDIA path (nv_inference, falling back to
                               nv_build in OSS builds).
        SKILLSPECTOR_MODEL     Override the active provider's default
                               model (applies to every analyzer slot).
        SKILLSPECTOR_LOG_LEVEL DEBUG | INFO | WARNING | ERROR (default WARNING).

... [TRUNCATED] ...
```

### `src\skillspector\constants.py`
```
# SPDX-FileCopyrightText: Copyright (c) 2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
# SPDX-License-Identifier: Apache-2.0
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Shared constants for skillspector (env-driven where applicable)."""

import os

from skillspector.providers import get_metadata_provider

# % of model's max tokens used for input. 1-MAX_INPUT_TOKENS_PCT is used for output.
MAX_INPUT_TOKENS_PCT = 0.75
# Fallback context length when no metadata API or registry entry is available.
DEFAULT_CONTEXT_LENGTH = 128_000

# Default-model selection lives on each provider (see providers/<name>/provider.py
# for ``DEFAULT_MODEL`` and ``SLOT_DEFAULTS``).  The active provider's
# ``resolve_model`` runs the waterfall: ``SKILLSPECTOR_MODEL`` env > slot
# default > general default.  OSS users pointing at build.nvidia.com or
# stock OpenAI inherit ``NvBuildProvider``'s default model automatically.
_provider = get_metadata_provider()

# Exposed for analyzers that need a final fallback symbol (e.g.,
# ``model = state.model or MODEL_CONFIG[ANALYZER_ID] or _SKILLSPECTOR_DEFAULT_MODEL``).
_SKILLSPECTOR_DEFAULT_MODEL = _provider.DEFAULT_MODEL  # type: ignore[attr-defined]

_MODEL_SLOTS: tuple[str, ...] = (
    "default",
    "mcp_least_privilege",
    "mcp_rug_pull",
    "mcp_tool_poisoning",
    "semantic_developer_intent",
    "semantic_quality_policy",
    "semantic_security_discovery",
    "meta_analyzer",
)

MODEL_CONFIG: dict[str, str] = {slot: _provider.resolve_model(slot) for slot in _MODEL_SLOTS}

# Log level: from env or fallback (DEBUG, INFO, WARNING, ERROR).
SKILLSPECTOR_LOG_LEVEL = os.environ.get("SKILLSPECTOR_LOG_LEVEL", "WARNING")
```

### `src\skillspector\graph.py`
```
# SPDX-FileCopyrightText: Copyright (c) 2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
# SPDX-License-Identifier: Apache-2.0
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""LangGraph workflow for Skillspector stub analyzers."""

# TODO(SADD A.2.1–A.2.4): Analyzer discovery, stage-as-category with meta last, wire registry; respect requires_api_key/is_available() and skip or warn when API key missing or analyzer unavailable. See SADD for skillspector § A.2.
# TODO(SADD A.5.1): Implement skillspector serve (FastAPI): POST /scan (zip), GET /results/{id}, GET /health. See SADD for skillspector § A.5.1.

from __future__ import annotations

from langgraph.graph import END, START, StateGraph

from skillspector.nodes.analyzers import ANALYZER_NODE_IDS, ANALYZER_NODES
from skillspector.nodes.build_context import build_context
from skillspector.nodes.meta_analyzer import meta_analyzer
from skillspector.nodes.report import report
from skillspector.nodes.resolve_input import resolve_input
from skillspector.state import SkillspectorState


def create_graph():
    """Create and compile Skillspector workflow graph."""
    workflow = StateGraph(SkillspectorState)

    workflow.add_node("resolve_input", resolve_input)
    workflow.add_node("build_context", build_context)
    workflow.add_node("meta_analyzer", meta_analyzer)
    workflow.add_node("report", report)

    for analyzer_id in ANALYZER_NODE_IDS:
        workflow.add_node(analyzer_id, ANALYZER_NODES[analyzer_id])

    workflow.add_edge(START, "resolve_input")
    workflow.add_edge("resolve_input", "build_context")
    for analyzer_id in ANALYZER_NODE_IDS:
        workflow.add_edge("build_context", analyzer_id)
        workflow.add_edge(analyzer_id, "meta_analyzer")
    workflow.add_edge("meta_analyzer", "report")
    workflow.add_edge("report", END)
    return workflow.compile()


graph = create_graph()
```

### `src\skillspector\input_handler.py`
```
# SPDX-FileCopyrightText: Copyright (c) 2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
# SPDX-License-Identifier: Apache-2.0
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""
Input handler for Skillspector.

Handles various input formats:
- Git repository URLs
- Raw file URLs
- Local zip files
- Single markdown files
- Local directories

Ported from legacy implementation.
"""

from __future__ import annotations

import shutil
import subprocess
import tempfile
import zipfile
from pathlib import Path
from urllib.parse import urlparse

import httpx

from skillspector.logging_config import get_logger

logger = get_logger(__name__)


class InputHandler:
    """
    Handles input resolution for different source types.

    Normalizes all inputs to a local directory path for scanning.
    """

    def __init__(self) -> None:
        self._temp_dir: Path | None = None

    def resolve(self, input_path: str) -> tuple[Path, str]:
        """
        Resolve input to a scannable directory.

        Args:
            input_path: Path or URL to resolve

        Returns:
            Tuple of (resolved_path, source_type)
            source_type is one of: "git", "url", "zip", "file", "directory"

        Raises:
            ValueError: If input type cannot be determined
            FileNotFoundError: If local path doesn't exist
        """
        input_path = input_path.strip()

        if self._is_git_url(input_path):
            return self._clone_git(input_path), "git"
        if self._is_file_url(input_path):
            return self._download_file(input_path), "url"
        if input_path.endswith(".zip"):
            return self._extract_zip(Path(input_path)), "zip"
        if input_path.endswith(".md"):
            return self._wrap_single_file(Path(input_path)), "file"
        if Path(input_path).is_dir():
            return Path(input_path).resolve(), "directory"
        if Path(input_path).is_file():
            return self._wrap_single_file(Path(input_path)), "file"
        raise ValueError(
            f"Cannot determine input type for: {input_path}\n"
            "Supported formats: Git URL, file URL, .zip file, .md file, or directory"
        )

    def cleanup(self) -> None:
        """Clean up temporary files created during resolution."""
        if self._temp_dir and self._temp_dir.exists():
            shutil.rmtree(self._temp_dir, ignore_errors=True)
            self._temp_dir = None

    def temp_dir_for_cleanup(self) -> Path | None:
        """Return the temp directory path if one was created (for caller to clean up after graph)."""
        return self._temp_dir

    def _get_temp_dir(self) -> Path:
        """Get or create a temporary directory for this session."""
        if not self._temp_dir:
            self._temp_dir = Path(tempfile.mkdtemp(prefix="skillspector_"))
        return self._temp_dir

    def _is_git_url(self, path: str) -> bool:
        """Check if path is a Git repository URL."""
        if not path.startswith(("http://", "https://", "git@")):
            return False
        parsed = urlparse(path)
        git_hosts = ["github.com", "gitlab.com", "bitbucket.org"]
        if any(host in parsed.netloc for host in git_hosts):
            if "/raw/" in path or "/blob/" in path or path.endswith((".md", ".py", ".sh")):
                return False
            return True
        if path.endswith(".git"):
            return True
        return False

    def _is_file_url(self, path: str) -> bool:
        """Check if path is a direct file URL."""
        if not path.startswith(("http://", "https://")):
            return False
        return not self._is_git_url(path)

    def _clone_git(self, url: str) -> Path:
        """Clone a Git repository to a temporary directory."""
        temp_dir = self._get_temp_dir()
        clone_dir = temp_dir / "repo"
        try:
            subprocess.run(
                ["git", "clone", "--depth", "1", url, str(clone_dir)],
                check=True,
                capture_output=True,
                timeout=60,
                shell=False,
            )
        except subprocess.CalledProcessError as e:
            logger.warning("Git clone failed for %s: %s", url, e)
            raise ValueError(f"Failed to clone repository: {e.stderr.decode()}") from e
        except subprocess.TimeoutExpired:
            logger.warning("Git clone timed out for %s", url)
            raise ValueError("Git clone timed out after 60 seconds") from None
        except FileNotFoundError:
            logger.warning("Git not found when cloning %s", url)
            raise ValueError(
                "Git is not installed. Please install git to scan repositories."
            ) from None
        return clone_dir

    def _download_file(self, url: str) -> Path:
        """Download a file from URL to a temporary directory."""
        temp_dir = self._get_temp_dir()
        parsed = urlparse(url)
        filename = Path(parsed.path).name or "SKILL.md"
        try:
            with httpx.Client(follow_redirects=True, timeout=30) as client:
                response = client.get(url)
                response.raise_for_status()
                content = response.content
        except httpx.HTTPError as e:
            logger.warning("Download failed for %s: %s", url, e)
            raise ValueError(f"Failed to download file: {e}") from e
        if filename.endswith(".zip") or (
            response.headers.get("content-type", "").startswith("application/zip")
        ):
            zip_path = temp_dir / "download.zip"
            zip_path.write_bytes(content)
            return self._extract_zip(zip_path)
        file_path = temp_dir / filename
        file_path.write_bytes(content)
        return temp_dir

    def _extract_zip(self, zip_path: Path) -> Path:
        """Extract a zip file to a temporary directory."""
        if not zip_path.exists():
            raise FileNotFoundError(f"Zip file not found: {zip_path}") from None
        temp_dir = self._get_temp_dir()
        extract_dir = temp_dir / "extracted"
        extract_dir.mkdir(exist_ok=True)
        try:
            with zipfile.ZipFile(zip_path, "r") as zf:
                zf.extractall(extract_dir)
        except zipfile.BadZipFile:
            logger.warning("Invalid zip or extract failed: %s", zip_path)
            raise ValueError(f"Invalid zip file: {zip_path}") from None
        contents = list(extract_dir.iterdir())
        if len(contents) == 1 and contents[0].is_dir():
            return contents[0]
        return extract_dir

    def _wrap_single_file(self, file_path: Path) -> Path:
        """Wrap a single file in a temporary directory for consistent handling."""
        if not file_path.exists():
            raise FileNotFoundError(f"File not found: {file_path}") from None
        temp_dir = self._get_temp_dir()
        dest = temp_dir / file_path.name
        shutil.copy2(file_path, dest)
        return temp_dir
```

### `src\skillspector\llm_analyzer_base.py`
```
# SPDX-FileCopyrightText: Copyright (c) 2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
# SPDX-License-Identifier: Apache-2.0
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Base LLM Analyzer with per-file / per-chunk batching (truncation-safe).

Provides ``LLMAnalyzerBase`` — a reusable run-loop that splits work into one
LLM call per file (or per chunk when a file exceeds the model's input budget),
using token budgets from ``constants.py`` so no single prompt is truncated.

The default ``response_schema`` is :class:`LLMAnalysisResult` (a list of
:class:`LLMFinding`), suitable for discovery-mode analyzers.  Subclasses may
override :attr:`response_schema` with a different Pydantic model, or set it
to ``None`` for raw-string mode.
"""

from __future__ import annotations

import asyncio
from collections import defaultdict
from dataclasses import dataclass, field
from typing import Literal

from pydantic import BaseModel, Field

from skillspector.llm_utils import get_chat_model
from skillspector.logging_config import get_logger
from skillspector.model_info import get_max_input_tokens
from skillspector.models import Finding

logger = get_logger(__name__)

# OpenAI suggests ~4 chars per token for English text with BPE tokenizers.
CHARS_PER_TOKEN = 4
CHUNK_OVERLAP_LINES = 50


# ---------------------------------------------------------------------------
# Default structured-output schemas (discovery mode)
# ---------------------------------------------------------------------------


class LLMFinding(BaseModel):
    """A single finding discovered by an LLM analyzer.

    Field names intentionally mirror :class:`~skillspector.models.Finding` so
    that :meth:`to_finding` can produce a graph-state ``Finding`` directly.
    """

    rule_id: str = Field(description="Identifier for the type of finding")
    message: str = Field(description="Short description of the finding")
    severity: Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"] = Field(description="Severity level")
    start_line: int = Field(ge=1, description="Starting line number")
    end_line: int | None = Field(default=None, description="Ending line number (optional)")
    confidence: float = Field(ge=0.0, le=1.0, default=0.5, description="Confidence score")
    explanation: str = Field(default="", description="Why this is a finding (2-3 sentences)")
    remediation: str = Field(default="", description="Actionable steps to fix the issue")

    def to_finding(self, file: str) -> Finding:
        """Convert to a :class:`Finding` for the graph state."""
        return Finding(
            rule_id=self.rule_id,
            message=self.message,
            severity=self.severity,
            confidence=self.confidence,
            file=file,
            start_line=self.start_line,
            end_line=self.end_line,
            explanation=self.explanation,
            remediation=self.remediation,
        )


class LLMAnalysisResult(BaseModel):
    """Structured LLM response containing discovered findings."""

    findings: list[LLMFinding] = Field(default_factory=list)


def estimate_tokens(text: str) -> int:
    """Approximate token count from character length."""
    return len(text) // CHARS_PER_TOKEN


# ---------------------------------------------------------------------------
# Batch dataclass
# ---------------------------------------------------------------------------


@dataclass
class Batch:
    """One unit of work for an LLM call (single file or file-chunk)."""

    file_path: str
    content: str
    start_line: int = 1
    end_line: int | None = None
    findings: list[Finding] = field(default_factory=list)

    @property
    def is_chunk(self) -> bool:
        return self.end_line is not None

    @property
    def file_label(self) -> str:
        label = f"File: {self.file_path}"
        if self.is_chunk:
            label += f" (lines {self.start_line}\u2013{self.end_line})"
        return label


# ---------------------------------------------------------------------------
# Chunking utilities
# ---------------------------------------------------------------------------


def chunk_file_by_lines(
    content: str,
    max_tokens: int,
    overlap_lines: int = CHUNK_OVERLAP_LINES,
) -> list[tuple[str, int, int]]:
    """Split *content* into line-range chunks that each fit within *max_tokens*.

    Returns a list of ``(chunk_text, start_line, end_line)`` tuples where lines
    are 1-indexed.  Consecutive chunks share *overlap_lines* lines of context so
    findings near chunk boundaries still have surrounding code.
    """
    lines = content.splitlines(keepends=True)
    if not lines:
        return [("", 1, 1)]

    chunks: list[tuple[str, int, int]] = []
    start_idx = 0

    while start_idx < len(lines):
        token_count = 0
        end_idx = start_idx

        while end_idx < len(lines):
            line_tokens = estimate_tokens(lines[end_idx])
            if token_count + line_tokens > max_tokens and end_idx > start_idx:
                break
            token_count += line_tokens
            end_idx += 1

        chunk_text = "".join(lines[start_idx:end_idx])
        chunks.append((chunk_text, start_idx + 1, end_idx))  # 1-indexed

        if end_idx >= len(lines):
            break

        next_start = end_idx - overlap_lines
        if next_start <= start_idx:
            next_start = end_idx
        start_idx = next_start

    return chunks


def findings_in_range(
    findings: list[Finding],
    start_line: int,
    end_line: int,
) -> list[Finding]:
    """Return findings whose ``start_line`` falls within [start_line, end_line]."""
    return [f for f in findings if start_line <= f.start_line <= end_line]


def number_lines(content: str, start_line: int = 1) -> str:
    """Prefix each line with its 1-indexed line number (e.g. ``L1:``, ``L2:``).

    For chunks, *start_line* offsets the numbering so the LLM sees real file
    line numbers it can reference in :attr:`LLMFinding.start_line`.
    """
    lines = content.splitlines()
    if not lines:
        return ""
    end = start_line + len(lines) - 1
    width = len(str(end))
    return "\n".join(f"L{start_line + i:0>{width}}: {line}" for i, line in enumerate(lines))


BASE_ANALYSIS_PROMPT = """\
{analyzer_prompt}

Analyze the following skill file for security issues matching the criteria above.
Reference line numbers (shown as L-prefixes) when reporting findings.

## {file_label}

... [TRUNCATED] ...
```

### `src\skillspector\llm_utils.py`
```
# SPDX-FileCopyrightText: Copyright (c) 2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
# SPDX-License-Identifier: Apache-2.0
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Shared LLM utilities (OpenAI-compatible chat models).

Credentials are resolved in this order:
    1. The active NVIDIA provider (see :mod:`skillspector.providers`) —
       reads ``NVIDIA_INFERENCE_KEY`` and supplies the matching endpoint.
    2. ``OPENAI_API_KEY`` / ``OPENAI_BASE_URL`` (the langchain-openai
       defaults).

There is no SkillSpector-specific credential env var: setting
``NVIDIA_INFERENCE_KEY`` configures whichever NVIDIA endpoint the
deployment ships with, and any other OpenAI-compatible endpoint is
configured via the standard ``OPENAI_*`` envs.
"""

from __future__ import annotations

import os

from langchain_openai import ChatOpenAI

from skillspector.constants import MODEL_CONFIG
from skillspector.model_info import get_max_input_tokens, get_max_output_tokens
from skillspector.providers import resolve_provider_credentials


def _resolve_llm_credentials() -> tuple[str, str | None]:
    """Return ``(api_key, base_url)`` resolved from the environment.

    Tries the active NVIDIA provider first; falls back to ``OPENAI_API_KEY``
    / ``OPENAI_BASE_URL`` when the provider is not configured.

    Raises:
        ValueError: when no API key can be resolved from any source.
    """
    creds = resolve_provider_credentials()
    if creds is not None:
        return creds

    resolved_key = os.environ.get("OPENAI_API_KEY", "").strip()
    if not resolved_key:
        raise ValueError(
            "No LLM API key configured. Set the credential env var for the "
            "active provider, or set OPENAI_API_KEY (and optionally "
            "OPENAI_BASE_URL) to use a standard OpenAI-compatible endpoint. "
            "Use --no-llm to skip LLM analysis and run static checks only."
        )

    resolved_base = os.environ.get("OPENAI_BASE_URL", "").strip() or None
    return resolved_key, resolved_base


def is_llm_available() -> tuple[bool, str | None]:
    """Return ``(available, error_message)`` describing LLM credential status."""
    try:
        _resolve_llm_credentials()
    except ValueError as exc:
        return False, str(exc)
    return True, None


def fetch_model_token_limits(model_label: str) -> tuple[int, int]:
    """Return ``(max_input_tokens, max_output_tokens)`` for *model_label*."""
    return get_max_input_tokens(model_label), get_max_output_tokens(model_label)


def get_chat_model(model: str | None = None) -> ChatOpenAI:
    """Return a :class:`ChatOpenAI` configured against the resolved endpoint.

    Raises:
        ValueError: when no API key is configured (see ``is_llm_available``).
    """
    resolved_key, resolved_base = _resolve_llm_credentials()
    model = model or MODEL_CONFIG["default"]

    return ChatOpenAI(
        model=model,
        base_url=resolved_base,
        api_key=resolved_key,
        max_tokens=get_max_output_tokens(model),
        timeout=120,
    )


def chat_completion(prompt: str, *, model: str | None = None) -> str:
    """Request a single chat completion and return the assistant content."""
    llm = get_chat_model(model=model)
    response = llm.invoke(prompt)
    return response.content or ""
```

### `src\skillspector\logging_config.py`
```
# SPDX-FileCopyrightText: Copyright (c) 2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
# SPDX-License-Identifier: Apache-2.0
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Central logging configuration for the skillspector package.

Reads ``SKILLSPECTOR_LOG_LEVEL`` directly from the environment (default
``WARNING``) so this module stays cycle-free — it must be importable from
the providers package, which ``constants`` itself depends on.

Use get_logger(__name__) in modules; use Rich console.print() for user-facing output.
"""

from __future__ import annotations

import logging
import os
import sys

SKILLSPECTOR_LOG_LEVEL = os.environ.get("SKILLSPECTOR_LOG_LEVEL", "WARNING")

_PACKAGE_LOGGER_NAME = "skillspector"
_configured = False


def _configure() -> None:
    global _configured
    if _configured:
        return
    root = logging.getLogger(_PACKAGE_LOGGER_NAME)
    root.setLevel(logging.DEBUG)
    if not root.handlers:
        handler = logging.StreamHandler(sys.stderr)
        handler.setLevel(_level_from_string(SKILLSPECTOR_LOG_LEVEL))
        handler.setFormatter(logging.Formatter("%(levelname)s [%(name)s] %(message)s"))
        root.addHandler(handler)
    root.setLevel(_level_from_string(SKILLSPECTOR_LOG_LEVEL))
    _configured = True


def _level_from_string(level: str) -> int:
    return getattr(logging, level.upper(), logging.WARNING)


def get_logger(name: str) -> logging.Logger:
    """Return a logger under the skillspector package namespace."""
    _configure()
    if name.startswith(_PACKAGE_LOGGER_NAME + ".") or name == _PACKAGE_LOGGER_NAME:
        return logging.getLogger(name)
    return logging.getLogger(f"{_PACKAGE_LOGGER_NAME}.{name}")


def set_level(level: int | str) -> None:
    """Set the package root logger and its handler level (e.g. for CLI --verbose)."""
    _configure()
    lvl = level if isinstance(level, int) else _level_from_string(level)
    root = logging.getLogger(_PACKAGE_LOGGER_NAME)
    root.setLevel(lvl)
    for h in root.handlers:
        h.setLevel(lvl)
```

### `src\skillspector\models.py`
```
# SPDX-FileCopyrightText: Copyright (c) 2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
# SPDX-License-Identifier: Apache-2.0
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Shared models for the Skillspector v2 LangGraph workflow."""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import StrEnum
from typing import TYPE_CHECKING, Protocol

if TYPE_CHECKING:
    from skillspector.state import SkillspectorState


class Severity(StrEnum):
    """Severity levels for findings (used by all analyzers)."""

    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


@dataclass
class Location:
    """Location of a finding within a file (used by all analyzers)."""

    file: str
    start_line: int
    end_line: int | None = None


@dataclass
class AnalyzerFinding:
    """
    Common finding type produced by any analyzer (static, behavioral, MCP, semantic).
    Converted to Finding for graph state; use severity, location, tags for consistency.
    """

    rule_id: str
    message: str
    severity: Severity
    location: Location
    confidence: float = 0.5
    remediation: str | None = None
    tags: list[str] = field(default_factory=list)
    context: str | None = None
    matched_text: str | None = None


@dataclass
class Finding:
    """Finding model for graph state and report output (shape aligned with to_dict)."""

    rule_id: str
    message: str
    severity: str = "LOW"
    confidence: float = 0.5
    file: str = "SKILL.md"
    start_line: int = 1
    end_line: int | None = None
    category: str | None = None
    pattern: str | None = None
    finding: str | None = None  # short matched snippet
    explanation: str | None = None
    remediation: str | None = None
    code_snippet: str | None = None
    intent: str | None = None
    tags: list[str] = field(default_factory=list)
    context: str | None = None
    matched_text: str | None = None

    def to_dict(self) -> dict[str, object]:
        """Return a JSON-serializable dict representation (full finding shape)."""
        return {
            "id": self.rule_id,
            "category": self.category,
            "pattern": self.pattern,
            "severity": self.severity,
            "confidence": self.confidence,
            "location": {
                "file": self.file,
                "start_line": self.start_line,
                "end_line": self.end_line,
            },
            "finding": self.finding,
            "explanation": self.explanation or self.message,
            "remediation": self.remediation,
            "code_snippet": self.code_snippet or self.context,
            "intent": self.intent,
        }

    def __str__(self) -> str:
        return f"{self.rule_id}: {self.message} ({self.file}:{self.start_line})"


class AnalyzerPlugin(Protocol):
    """Analyzer protocol from SADD A.1.1."""

    name: str
    stage: str
    requires_api_key: bool

    def analyze(self, state: SkillspectorState) -> list[Finding]:
        """Analyze graph state and return findings."""

    def is_available(self) -> bool:
        """Return whether the analyzer can run in current environment."""
```

### `src\skillspector\model_info.py`
```
# SPDX-FileCopyrightText: Copyright (c) 2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
# SPDX-License-Identifier: Apache-2.0
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Model metadata helpers — token-budget resolution.

Layered resolution lives in :mod:`skillspector.providers`; this module is
the public façade that callers (e.g. ``llm_utils``, ``llm_analyzer_base``)
import from.  Test fixtures patch :func:`_resolve_context_length` here.
"""

from __future__ import annotations

import functools

from skillspector.constants import DEFAULT_CONTEXT_LENGTH, MAX_INPUT_TOKENS_PCT
from skillspector.logging_config import get_logger
from skillspector.providers import get_metadata_provider

logger = get_logger(__name__)


@functools.cache
def _resolve_context_length(model_label: str) -> int:
    """Return the context window size for *model_label*.

    Delegates to the configured provider chain; falls back to
    :data:`DEFAULT_CONTEXT_LENGTH` with a warning when no provider knows
    about the model.  Cached per model label for the lifetime of the process.
    """
    ctx = get_metadata_provider().get_context_length(model_label)
    if ctx is not None:
        logger.debug("Resolved %r context length: %d", model_label, ctx)
        return ctx

    logger.warning(
        "No token-limit info for model %r — using %d-token default. "
        "Add the model to model_registry.yaml.",
        model_label,
        DEFAULT_CONTEXT_LENGTH,
    )
    return DEFAULT_CONTEXT_LENGTH


def get_max_input_tokens(model: str) -> int:
    """Input token budget for *model* (75 %% of context window)."""
    return int(_resolve_context_length(model) * MAX_INPUT_TOKENS_PCT)


def get_max_output_tokens(model: str) -> int:
    """Output token budget for *model*.

    Uses the smaller of the percentage-based budget and any explicit
    ``max_output_tokens`` cap exposed by the provider chain (today: only
    the YAML registry surfaces this).
    """
    ctx = _resolve_context_length(model)
    pct_budget = int(ctx * (1 - MAX_INPUT_TOKENS_PCT))

    cap = get_metadata_provider().get_max_output_tokens(model)
    if cap is not None:
        return min(pct_budget, cap)
    return pct_budget
```
