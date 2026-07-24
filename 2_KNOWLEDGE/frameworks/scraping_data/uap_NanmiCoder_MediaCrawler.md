# KI: NanmiCoder/MediaCrawler

## Overview
This project, MediaCrawler, is a social media crawler designed to extract data from platforms like Xiaohongshu (Little Red Book), Douyin (TikTok), Weibo, Zhihu, and Bilibili. It provides an API for controlling the crawling process and includes functionality for receiving SMS notifications related to verification codes. The code demonstrates a focus on asynchronous operations and configuration-driven behavior.

## Tech Stack (from code)
- **Python:**  The primary language, evidenced by numerous `.py` files (144 total). `main.py` serves as the entry point.
- **FastAPI:** Used for building the API, demonstrated in `api/main.py`: `from fastapi import FastAPI`.
- **uvicorn:** The ASGI server used to run the FastAPI application, specified in `pyproject.toml`: `dependencies = ["fastapi==0.110.2", "uvicorn==0.29.0"]` and referenced in `main.py`: `import uvicorn`.
- **Asyncio:**  Extensive use of asynchronous programming is evident throughout the codebase, particularly in files like `recv_sms.py` and within crawler modules.
- **Pydantic:** Used for data validation and serialization, as seen in `api/main.py`: `from pydantic import BaseModel`.
- **Build System:**  Uses `pyproject.toml` with a defined set of dependencies and build instructions.

## Public API / Exports
Based on the code, the following public endpoints are exposed:
- `/`: Serves the frontend application (likely a web UI).  Defined in `api/main.py`.
- `/api/health`: A health check endpoint. Defined in `api/main.py`.
- `/api/env/check`: Checks environment configuration. Defined in `api/main.py`.
- `/`: Receives SMS notifications (POST method). Defined in `recv_sms.py`.

## Dependencies
Based on `requirements.txt` and `package.json`, the project depends on:
- **httpx:** 0.28.1 (HTTP client)
- **pillow:** >=12.2.0 (Image processing)
- **playwright:** >=1.61.0 (Browser automation)
- **tenacity:** 8.2.2 (Retry mechanism)
- **typer:** >=0.12.3 (CLI framework)
- **fastapi:** 0.110.2 (API framework)
- **uvicorn:** 0.29.0 (ASGI server)
- **python-dotenv:** 1.0.1 (Environment variable management)
- **jieba:** 0.42.1 (Chinese text segmentation)
- **wordcloud:** >=1.9.6 (Word cloud generation)
- **aiomysql:** 0.2.0 (Asynchronous MySQL driver)
- **redis:** ~4.6.0 (In-memory data store)
- **pydantic:** >=2.13.4 (Data validation and parsing)
- **sqlalchemy:** >=2.0.43 (SQL toolkit and ORM)
- **motor:** >=3.3.0 (Asynchronous MongoDB driver)

## Architecture Patterns
- **Factory Pattern:** The `CrawlerFactory` class in `api/routers/crawler.py` demonstrates the factory pattern, responsible for creating instances of different crawler classes based on a platform identifier.
- **Configuration-Driven Design:**  The project heavily relies on configuration files (`config/`) to define parameters like database credentials and proxy settings. This promotes flexibility and reduces hardcoded values.
- **Asynchronous Programming:** The use of `async` and `await` keywords throughout the codebase indicates a design centered around asynchronous operations for improved performance, especially when dealing with network requests.
- **Modular Design:** Code is organized into modules (e.g., `api/`, `base/`, `cache/`) to promote code reusability and maintainability.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in the following ways:
- **Data Acquisition:** The crawling capabilities can be integrated into SEOSONA OS for gathering data from social media platforms, providing valuable insights for analysis or other applications.
- **Asynchronous Processing:**  The asynchronous programming techniques used in MediaCrawler are well-suited for SEOSONA OS's potentially high-volume and real-time data processing needs.
- **Configuration Management:** The configuration-driven design can be adapted to manage various aspects of SEOSONA OS, such as API keys, database connections, and feature flags.
- **SMS Notification Handling:**  The SMS notification handling component could be leveraged for user authentication or other time-sensitive tasks within SEOSONA OS.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `data` · **Fit:** 49/100 · **Auto-apply:** False
- **Evidence:** `pandas`, `sqlite`
- **All scores:** {'seosona-os': 49, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 0}
