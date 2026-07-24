# KI: D4Vinci/Scrapling

## Overview
Scrapling is a Python library designed for web scraping, emphasizing undetectability and high performance. It aims to provide an easy-to-use interface while handling complexities like proxy rotation and dynamic content rendering. The project's benchmarks suggest it prioritizes speed compared to other popular scraping libraries.

## Tech Stack (from code)
- **Language:** Python (setup.cfg: `name = scrapling`, pyproject.toml: `Programming Language :: Python :: 3`)
- **Build System:** Setuptools and Poetry (pyproject.toml, setup.cfg)
- **Parsing Libraries:** lxml, BeautifulSoup, PyQuery, Selectolax, Parsel (benchmarks.py imports these libraries for benchmarking)
- **Browser Automation:** Playwright (Dockerfile: `uv run playwright install chromium`, pyproject.toml: `dependencies = [ "playwright==1.61.0"]`)

## Public API / Exports
Due to the large number of files and lack of clear module structure, it's difficult to definitively list all public exports. However, based on usage in benchmarks.py and other files, some key elements appear to be:

- `ScraplingSelector`: A class used for selecting elements from HTML content (scrapling/selector.py - not directly accessible but referenced)
- Functions within the `scrapling` module are called directly in benchmarks.py, suggesting they are intended for public use.  (e.g., `ScraplingSelector(large_html, adaptive=False).css(".item::text").getall()`)

## Dependencies
Based on `pyproject.toml`:
- lxml (>=6.1.1)
- cssselect (>=1.4.0)
- orjson (>=3.11.8)
- tld (>=0.13.2)
- w3lib (>=2.4.1)
- typing_extensions
- click (>=8.3.0) - for fetchers
- curl_cffi (>=0.15.0) - for fetchers
- playwright (==1.61.0) - for fetchers

## Architecture Patterns
- **Benchmark-Driven Development:** The `benchmarks.py` file indicates a strong focus on performance, with multiple scraping libraries being benchmarked against each other. This suggests the architecture is designed and optimized around speed.
- **Modular Design (Potential):** While not explicitly clear from the top level, the directory structure (`agent-skill/`, `docs/`, etc.) hints at a modular design approach, potentially separating concerns like skill development, documentation, and API reference.
- **Abstraction over Specific Implementations:** The use of multiple parsing libraries suggests an abstraction layer or strategy to handle different HTML structures and rendering techniques.

## Relevance to SEOSONA OS
Scrapling's focus on undetectable web scraping could be highly beneficial for SEOSONA OS in several ways:

- **Data Acquisition:**  SEOSONA OS could leverage Scrapling to gather data from websites without triggering anti-scraping measures, ensuring a consistent and reliable data feed.
- **Competitive Intelligence:** The library's ability to scrape data discreetly would allow SEOSONA OS to monitor competitors’ activities and pricing strategies effectively.
- **Content Aggregation:**  Scrapling could be used to aggregate content from various sources for SEOSONA OS users, providing a comprehensive view of information without being blocked by websites.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `scraping` · **Fit:** 100/100 · **Auto-apply:** False
- **Evidence:** `scrap`, `crawl`, `playwright`, `beautifulsoup`, `selenium`
- **All scores:** {'seosona-os': 100, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
