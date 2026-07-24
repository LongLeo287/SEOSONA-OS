# KI: oaker-io/wewrite

## Overview
WeWrite appears to be a tool designed for generating written content, likely articles or blog posts, potentially tailored for social media platforms like WeChat and Douyin. The codebase includes scripts for fetching data, building models (Codex, Openclaw, Playbook), and evaluating generated text based on metrics like "humanness score." Configuration files suggest the system incorporates AI image generation and persona-based writing styles.

## Tech Stack (from code)
- **Python:**  The `install.sh` file explicitly uses Python for virtual environment creation and dependency installation (`"$PYTHON" -m venv .venv`). The presence of numerous `.py` files in various directories (e.g., `scripts/`, `toolkit/`) confirms its primary language.
- **YAML:** Configuration is heavily reliant on YAML, as evidenced by multiple `*.yaml` files like `config.example.yaml`, `style.example.yaml`, and those within the `personas/` and `themes/` directories.  This suggests a configuration-driven architecture.
- **Markdown:** The presence of `.md` files in the `references/` directory indicates that Markdown is used for documentation or content guides.
- **pip:** The `install.sh` script uses pip (`.venv/bin/python -m pip install -r requirements.txt`) to manage Python dependencies.

## Public API / Exports
Due to the lack of readily available module definitions (e.g., `__init__.py` files with explicit exports), determining a definitive public API is difficult. However, based on file names and usage patterns, some likely exported components include:

- **`toolkit/cli.py`:**  The "cli" suggests command-line interface functionality.
- **`toolkit/config.py`:** Likely provides functions for loading and managing configuration data from YAML files.
- **`toolkit/converter.py`:** Implies a conversion process, potentially between different content formats.
- **`scripts/*.py`**: Scripts like `build_codex.py`, `fetch_article.py`, and `humanness_score.py` likely expose functions or classes for specific tasks.

## Dependencies
The `requirements.txt` file lists the following dependencies:

```
markdown==3.10.2
beautifulsoup4==4.14.3
cssutils==2.11.1
requests==2.33.1
camoufox[geoip]==0.4.11
pyyaml==6.0.1
Pygments==2.17.2
Pillow==12.2.0
playwright==1.58.0
```

## Architecture Patterns
- **Configuration-Driven:** The extensive use of YAML configuration files (`config.example.yaml`, `style.example.yaml`, etc.) suggests a design where behavior is largely determined by external configurations rather than hardcoded logic.
- **Modular Design:**  The directory structure (e.g., `toolkit/`, `scripts/`, `personas/`) indicates a modular architecture, with distinct components responsible for different aspects of the content generation process.
- **Pipeline Architecture**: The scripts in the `scripts` folder suggest a pipeline where data is fetched (`fetch_article.py`), processed (`build_codex.py`), and evaluated (`humanness_score.py`).



## Relevance to SEOSONA OS
The code from WeWrite could benefit SEOSONA OS in several ways:

- **Content Generation Capabilities:** The core functionality of generating written content, particularly with configurable personas and styles (as seen in `personas/*.yaml` and `style.example.yaml`), could be integrated into SEOSONA OS to automate content creation for various purposes.
- **SEO Optimization Techniques:**  The presence of files like `seo_keywords.py` and `seo-rules.md` suggests SEO optimization is a key consideration. These techniques could be incorporated into SEOSONA OS's content generation workflows.
- **AI Image Generation Integration:** The code for integrating AI image generation providers (as detailed in `config.example.yaml`) could enhance SEOSONA OS’s multimedia capabilities.
- **Evaluation Metrics**:  The `humanness_score.py` script and related configuration suggest a focus on evaluating the quality and authenticity of generated content, which aligns with SEOSONA OS's goals for reliable information.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `scraping` · **Fit:** 44/100 · **Auto-apply:** False
- **Evidence:** `playwright`, `beautifulsoup`
- **All scores:** {'seosona-os': 44, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
