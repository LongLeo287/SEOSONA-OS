# KI: StarTrail-org/PixelRAG

## Overview
PixelRAG is a Visual Retrieval-Augmented Generation system that renders documents as screenshot tiles, embeds them into vectors, and retrieves relevant information based on visual queries. It leverages a combination of rendering (using Playwright or PDF parsing), embedding models (like Qwen3-VL), and vector databases (FAISS) to enable image-based search and question answering. The project includes components for rendering, embedding, indexing, serving, and a frontend interface.

## Tech Stack (from code)
- **Python:**  The primary language, evidenced by the numerous `.py` files throughout the repository and specified in `pyproject.toml`: `requires-python = ">=3.12"`
- **JavaScript/TypeScript:** Used for the frontend, indicated by the presence of `.tsx` files and a `package.json` file containing dependencies like `remark-gfm`.
- **FastAPI:**  Used for serving the API, as shown in `pyproject.toml`: `dependencies = ["fastapi>=0.115.0", "uvicorn>=0.30.0"]`
- **Playwright:** Used for rendering web pages into screenshots, referenced in `CLAUDE.md` and implied by the existence of `pixelshot` command which captures documents (Playwright/CDP).
- **Hatchling:**  The build backend specified in `pyproject.toml`: `[build-system] build-backend = "hatchling.build"`

## Public API / Exports
Due to the sheer size and complexity of the codebase, a complete listing is impractical. However, based on the `pyproject.toml` file and CLI scripts, some key exported functionalities include:

- **`pixelshot`**:  A command for capturing documents as screenshots (defined in `pyproject.toml`: `pixelshot = "pixelrag_render.render:main"`).
- **`pixelrag`**: A general command likely acting as an umbrella CLI for various stages of the pipeline (defined in `pyproject.toml`: `pixelrag = "pixelrag.cli:main"`).

## Dependencies
Based on `package.json` and `pyproject.toml`:

**JavaScript/Frontend:**
- `remark-gfm`: Version 4.0.1 (from `package.json`)

**Python:**
- `pillow>=10.0.0`
- `websockets>=12.0`
- `pymupdf>=1.27.2.3`
- `pyturbojpeg>=2.2.0`
- `cef-capi-py>=131.3.5`
- `anthropic>=0.102.0`
- `torch>=2.9.0` (optional, for embedding)
- `transformers>=4.57.0` (optional, for embedding)
- `faiss-cpu>=1.9.0` (optional, for vector search)
- `numpy>=1.26.0`
- `tqdm>=4.60.0`
- `fastapi>=0.115.0` (for serving)
- `uvicorn>=0.30.0` (for serving)
- `pyyaml>=6.0`
- `markdown>=3.4`
- `pandas>=2.0`
- `Pillow>=10.0`
- `trafilatura>=1.6`
- `openai>=1.0`
- `aiohttp>=3.9`
- `datasets>=2.14`
- `huggingface-hub>=0.20`
- `pytest>=8.0` (for testing)

## Architecture Patterns
- **Modular Design:** The project is structured into distinct modules (`render`, `embed`, `index`, `serve`) each responsible for a specific stage of the pipeline, as indicated by the directory structure and `pyproject.toml`.
- **CLI Driven:**  Key functionalities are exposed through command-line interfaces (CLIs) like `pixelshot` and `pixelrag`, suggesting an emphasis on scripting and automation.
- **Extensible Architecture:** The use of "extras" in `pyproject.toml` (`embed`, `serve`, `index`, `all`) allows for optional dependencies and customization based on specific needs.



## Relevance to SEOSONA OS
PixelRAG's visual retrieval capabilities could be highly beneficial to SEOSONA OS, particularly in scenarios involving:

- **Image-based Search:**  SEOSONA OS could leverage PixelRAG’s screenshot rendering and vector search to enable users to search for information based on images or screenshots.
- **Visual Document Understanding:** The system's ability to process documents (including PDFs) as visual elements can aid in understanding complex layouts and extracting relevant data from visually rich content.
- **Automated Content Creation:**  The `pixelshot` command could be integrated into SEOSONA OS workflows for automated screenshot generation and content creation tasks.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 100/100 · **Auto-apply:** False
- **Evidence:** `llm`, `openai`, `anthropic`, `embedding`, `rag`
- **All scores:** {'seosona-os': 100, 'seosona-video': 22, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 28}
