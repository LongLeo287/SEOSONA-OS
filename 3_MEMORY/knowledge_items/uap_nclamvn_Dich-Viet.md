# KI: nclamvn/Dich-Viet

## Overview
Based on the source code, Dich-Viet appears to be a platform for translating documents, particularly those with STEM content (science, technology, engineering, and mathematics). It supports various input formats like PDF and DOCX, utilizes multiple AI providers for translation, and aims to preserve layout and formatting during the translation process. The project includes features for glossary management, OCR integration, and batch processing of large document sets.

## Tech Stack (from code)
- **Python:**  The primary language is Python, evidenced by numerous `.py` files throughout the repository (e.g., `core/analytics.py`, `translate_pdf.py`).
- **FastAPI:** The API framework used for building web APIs, as indicated in `api/main.py`: `from fastapi import FastAPI`.  The Dockerfile also specifies `uvicorn api.main:app --host 0.0.0.0 --port 3001`, confirming its use.
- **Pydantic:** Used for data validation and settings management, as seen in the `requirements.txt` file (`pydantic>=2.6.0`) and usage within API models (e.g., `api/aps_v2_models.py`).
- **ReportLab & docx:**  Used for PDF generation and DOCX manipulation respectively, indicated by their presence in the `requirements.txt` file (`reportlab>=4.0.0`, `docx>=1.0.0`) and usage within export modules (e.g., `core/export.py`).
- **Docker:** The project uses Docker for containerization, as evidenced by the `Dockerfile` and `docker-compose.yml` files.

## Public API / Exports
Based on the code structure, particularly within the `api/` directory, the following endpoints are likely exposed:
- `/health`:  Used for health checks (seen in `docker-compose.yml`).
- `/aps_v2`:  Related to APS v2 functionality (`api/aps_v2_router.py`, `api/aps_v2_models.py`).
- `/auth`: Authentication endpoints (`api/auth_router.py`).
- `/batch`: Batch processing related routes (`api/batch_router.py`).
- `/book_writer_v2`: Routes for book writer functionality (`api/routes/book_writer_v2.py`, `api/book_writer_service.py`).

## Dependencies
The following dependencies are listed in the `requirements.txt` file:
- python-dotenv
- pydantic, pydantic-settings
- openai, anthropic, httpx, requests
- pypdf, python-docx, pdf2image, Pillow, openpyxl, PyMuPDF, regex
- reportlab, docx2pdf
- aiofiles, tqdm, python-dateutil
- fastapi, uvicorn, websockets, python-multipart, slowapi
- jieba
- PyJWT, passlib
- redis
- pytest, pytest-asyncio
- fastapi-csrf-protect

## Architecture Patterns
- **Modular Design:** The codebase is organized into distinct modules (`ai_providers`, `api`, `core`, `beautification`, `config`) with clear responsibilities.
- **Service Layer:**  The `api/services` directory suggests a service layer architecture, separating business logic from API endpoints.
- **Provider Abstraction:** The `ai_providers` module demonstrates an abstraction pattern for different AI translation providers (OpenAI, Anthropic, DeepSeek). This allows easy swapping or addition of new providers.
- **Configuration Management:**  The use of `.env` files and the `pydantic-settings` library indicates a focus on managing configuration settings securely and flexibly.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:
- **Multilingual Document Processing:** The core translation engine and format support (PDF, DOCX) are directly applicable to SEOSONA’s multilingual document handling needs.
- **STEM Content Handling:**  The specialized STEM content processing capabilities (formula detection, LaTeX rendering) would be valuable for translating technical documentation within SEOSONA.
- **API Integration:** The FastAPI API could be integrated into SEOSONA's backend services for translation requests and status monitoring.
- **Batch Processing:** The batch processing framework can be leveraged to translate large volumes of documents efficiently.
- **Glossary Management:**  The glossary management system provides a mechanism for ensuring consistent terminology across translated content, which is crucial for maintaining quality in SEOSONA’s output.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 100/100 · **Auto-apply:** False
- **Evidence:** `llm`, `openai`, `anthropic`, `gemini`, `vector`
- **All scores:** {'seosona-os': 100, 'seosona-video': 22, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 28}
