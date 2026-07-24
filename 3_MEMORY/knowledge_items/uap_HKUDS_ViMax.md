# KI: HKUDS/ViMax

## Overview
The ViMax repository appears to be a system for automated long video generation, likely from text prompts or scripts. It leverages various AI models and tools for tasks such as scriptwriting, scene extraction, character design, image generation, and video rendering. The project utilizes a pipeline architecture to orchestrate these components into cohesive video creation workflows.

## Tech Stack (from code)
- **Python:**  The primary language is Python, evident from the numerous `.py` files throughout the repository (e.g., `main_agent.py`, `agents/screenwriter.py`).
- **Langchain:** The project heavily relies on Langchain for agent orchestration and prompt management as seen in multiple files like `agents/screenwriter.py` (`from langchain_core.prompts import ChatPromptTemplate`) and the numerous PydanticOutputParser imports.
- **MoviePy:** Used for video editing, demonstrated by its presence in `requirements.txt` and usage within pipelines (e.g., `main_idea2video.py`).
- **OpenCV:**  Used for image processing and scene detection as indicated by the dependency in `pyproject.toml`.
- **TypeScript/React:** The `ui/` directory contains TypeScript (`.ts`, `.tsx`) files, a `package.json`, and a `tsconfig.json`, indicating a React-based user interface.
- **Build System:**  The project uses `uv.lock` and `pyproject.toml` for dependency management and build configuration.

## Public API / Exports
Based on the code, it's difficult to determine a definitive public API without more context about how these modules are intended to be used externally. However, some notable exports include:

- **agents/\_\_init__.py:**  Exports classes like `Screenwriter`, `StoryboardArtist`, and `CameraImageGenerator`.
- **vimax/agent\_runtime/\_\_init__.py**: Exports `config.py` and other modules related to agent runtime functionality.
- **tools/\_\_init__.py**: Exports various image and video generation tools.

## Dependencies
Based on `pyproject.toml`:
- aiohttp (>=3.12.14)
- chardet (>=5.2.0)
- faiss-cpu (>=1.12.0)
- google-genai (>=1.47.0)
- langchain (>=0.3.26)
- langchain-community (>=0.3.27)
- langchain-openai (>=0.3.27)
- moviepy (>=2.2.1)
- openai (>=1.95.0)
- opencv-python
- pillow (>=11.3.0)
- pyyaml (>=6.0.2)
- requests (>=2.32.4)
- scenedetect[opencv] (>=0.6.7.1)
- tenacity (>=9.1.2)

Based on `package.json` in the ui directory:
- React, TypeScript and related dependencies are present.

## Architecture Patterns
- **Pipeline:** The project utilizes a pipeline architecture, as evidenced by files like `pipelines/idea2video_pipeline.py` and `pipelines/script2video_pipeline.py`. These pipelines orchestrate multiple agents and tools to achieve the overall video generation goal.
- **Agent-Based System:**  The `agents/` directory suggests an agent-based architecture, where different AI models or modules are encapsulated as independent agents with specific responsibilities (e.g., screenwriting, storyboard creation).
- **Modular Design:** The codebase is structured into multiple directories (`agents`, `tools`, `interfaces`, `pipelines`), indicating a modular design approach.
- **Configuration-Driven:**  The use of YAML configuration files (e.g., `configs/idea2video.yaml`) suggests that the system's behavior and parameters are configurable, promoting flexibility and reusability.

## Relevance to SEOSONA OS
This project’s code could benefit SEOSONA OS in several ways:

- **Automated Content Creation:** The video generation pipelines could be integrated into SEOSONA OS to automate content creation for various purposes (e.g., tutorials, marketing materials).
- **AI Agent Framework:**  The agent architecture and prompt engineering techniques used in ViMax could serve as a foundation for building more sophisticated AI agents within SEOSONA OS.
- **Image/Video Processing Tools:** The image and video processing tools developed for ViMax (e.g., scene detection, character extraction) could be leveraged to enhance other features of SEOSONA OS that involve visual content.
- **UI Components**: The React UI components in the `ui` directory can be reused or adapted for creating user interfaces within SEOSONA OS.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 89/100 · **Auto-apply:** False
- **Evidence:** `agent`, `workflow`, `planner`, `router`
- **All scores:** {'seosona-os': 89, 'seosona-video': 44, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 56}
