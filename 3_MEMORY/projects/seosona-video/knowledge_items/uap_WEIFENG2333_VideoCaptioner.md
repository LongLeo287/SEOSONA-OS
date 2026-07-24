# KI: WEIFENG2333/VideoCaptioner

## Overview
This project, `VideoCaptioner`, is a command-line and GUI tool designed for video captioning. It leverages AI to perform automatic speech recognition (ASR), optimizes subtitles, translates them, and synthesizes audio. The project's description in `pyproject.toml` states its purpose: "AI-powered video captioning tool — ASR, subtitle optimization, translation, and synthesis."

## Tech Stack (from code)
- **Python:**  The primary language is Python, as evidenced by the numerous `.py` files throughout the repository and the `requires-python = ">=3.10,<3.13"` entry in `pyproject.toml`.
- **PyQt5/Fluent Widgets:** The project utilizes PyQt5 for its GUI components, specified as a dependency in `pyproject.toml`: `"PyQt5==5.15.11"`.  It also uses "PyQt-Fluent-Widgets==1.8.4", indicating a focus on modern UI design.
- **Hatch:** The project utilizes Hatch for build management, as defined by the `[build-system]` section in `pyproject.toml`: `"build-backend = "hatchling.build"`.
- **OpenAI & ModelScope:**  The dependencies list includes OpenAI (`openai>=1.97.1`) and ModelScope (`modelscope>=1.32.0`), suggesting integration with these AI platforms for ASR, translation, or other tasks.

## Public API / Exports
Determining a definitive public API solely from the repository structure is difficult without further analysis of import statements within modules. However, based on `pyproject.toml`, we can identify entry points:

- **`videocaptioner`**:  This script executes `videocaptioner.cli.main:main`. This suggests a command-line interface with a main function located in the `videocaptioner/cli/main.py` module (inferred from the path).
- **`videocaptioner-gui`**:  This script executes `videocaptioner.ui.main:main`. This suggests a GUI entry point, with its main function located in `videocaptioner/ui/main.py`.

## Dependencies
The following dependencies are listed in `pyproject.toml`:

- `requests>=2.32.4`
- `openai>=1.97.1`
- `diskcache>=5.6.3`
- `yt-dlp>=2025.7.21`
- `json-repair>=0.49.0`
- `langdetect>=1.0.9`
- `pydub>=0.25.1`
- `tenacity>=8.2.0`
- `pillow>=12.0.0`
- `fonttools>=4.61.1`
- `platformdirs>=4.0.0`
- `PyQt5==5.15.11`
- `PyQt-Fluent-Widgets==1.8.4`
- `modelscope>=1.32.0`
- `psutil>=7.0.0`
- `GPUtil>=1.4.0`
- `edge-tts>=7.2.8`

## Architecture Patterns
- **CLI and GUI Separation:** The presence of separate scripts (`videocaptioner` and `videocaptioner-gui`) suggests a clear separation between the command-line interface and the graphical user interface, likely with shared core logic.
- **Modular Design (Inferred):**  The directory structure hints at a modular design, with subdirectories like `cli`, `ui`, and potentially others for different functionalities. However, without examining import statements within modules, this is only an inference.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **Accessibility Features:** The core functionality of generating captions and subtitles directly enhances accessibility for users with hearing impairments.  SEOSONA OS could integrate this as a built-in feature.
- **Multilingual Support:** The presence of translation capabilities (dependencies on OpenAI, ModelScope) allows for captioning in multiple languages, which aligns with SEOSONA OS's potential global user base.
- **AI Integration:** Leveraging AI for ASR and subtitle optimization demonstrates advanced technology integration that could be incorporated into other SEOSONA OS features. The use of `modelscope` suggests a focus on open-source models, aligning well with potential SEOSONA OS goals.


## UAP Routing (auto-classified)
- **System:** `seosona-video` · **Function:** `subtitle` · **Fit:** 84/100 · **Auto-apply:** True
- **Evidence:** `subtitle`, `caption`, `dub`
- **All scores:** {'seosona-os': 61, 'seosona-video': 84, 'seosona-content': 66, 'seosona-ux-ui': 33, 'seosona-flow': 56}
