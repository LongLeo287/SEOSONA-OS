# KI: MinorJerry/WebVoyager

## Overview
This project, WebVoyager, appears to be an automated web browsing agent designed to interact with webpages and complete tasks. It leverages Selenium for browser automation, OpenAI's API for natural language processing, and a custom prompt engineering system to guide the agent’s actions. The code demonstrates a focus on visual element identification and interaction within a webpage context.

## Tech Stack (from code)
- **Language:** Python (evident from file extensions: `.py` and `run.py`)
- **Framework/Libraries:** Selenium (imported in `run.py`: `from selenium import webdriver`), OpenAI (`from openai import OpenAI`), PIL (imported in `utils.py`: `from PIL import Image`).
- **Build System:**  No explicit build system is evident from the code, but a `requirements.txt` file specifies dependencies.

## Public API / Exports
Due to the limited scope of analysis (source code only), it's difficult to determine a formal public API. However, based on imports and usage within `run.py`, we can identify some key functions/modules:

- `prompts.SYSTEM_PROMPT`: A string defining the system prompt for the OpenAI model (file: `prompts.py`).
- `utils.get_web_element_rect`:  A function to get rectangle coordinates of web elements (file: `utils.py`).
- `utils.encode_image`: Function to encode images as base64 strings (file: `utils.py`).

## Dependencies
The `requirements.txt` file lists the following dependencies:

- `openai==1.1.1`
- `selenium==4.15.2`
- `pillow==10.1.0`

## Architecture Patterns
- **Modular Design:** The code is divided into several modules (`prompts.py`, `run.py`, `utils.py`, `utils_webarena.py`) suggesting a modular design approach, with each module responsible for specific functionalities.
- **Prompt Engineering:**  The project heavily relies on prompt engineering using the `prompts.py` file to guide the behavior of the OpenAI model. The `SYSTEM_PROMPT` variable is central to this process.
- **Image Processing Pipeline**: The code includes an image processing pipeline, evident in `utils.py`, which involves resizing images (`resize_image`) and encoding them for use with the OpenAI API (`encode_image`).

## Relevance to SEOSONA OS
The WebVoyager project's architecture could be beneficial to SEOSONA OS in several ways:

- **Automated Web Interaction:** The Selenium automation framework used in WebVoyager can be integrated into SEOSONA OS for automated web scraping, data extraction, or task completion.
- **Visual Element Identification:**  The `get_web_element_rect` function and associated logic demonstrate techniques for identifying webpage elements based on visual cues. This could enhance SEOSONA OS's ability to interact with dynamic webpages.
- **Prompt Engineering Framework**: The prompt engineering approach used in WebVoyager can be adapted to improve the performance of other AI agents within SEOSONA OS, particularly those requiring interaction with external systems or data sources.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `reference` · **Fit:** 22/100 · **Auto-apply:** False
- **Evidence:** `selenium`
- **All scores:** {'seosona-os': 22, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
