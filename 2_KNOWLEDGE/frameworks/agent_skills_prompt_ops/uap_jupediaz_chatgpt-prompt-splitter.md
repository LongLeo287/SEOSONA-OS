# KI: jupediaz/chatgpt-prompt-splitter

## Overview
This project provides a web application that splits large prompts into smaller chunks for use with language models like ChatGPT, likely to overcome token limits. The application takes user input (a prompt and split length), divides the prompt accordingly, and presents the resulting chunks as downloadable files. It utilizes Flask for its backend and Redis for managing visit counts.

## Tech Stack (from code)
- **Language:** Python (file: `api/index.py`)
- **Framework:** Flask (file: `api/index.py`: `from flask import Flask, render_template, request`)
- **Dependency Management:** requirements.txt (`requirements.txt` file)

## Public API / Exports
The application exposes a single endpoint accessible via HTTP GET and POST requests at the root path `/`.  This endpoint renders an HTML template (`index.html`) and handles form submissions for splitting prompts. The `index()` function within `api/index.py` is the primary handler for this route.

```python
@app.route("/", methods=["GET", "POST"])
def index():
    # ... code ...
```

## Dependencies
The following dependencies are listed in `requirements.txt`:
- Flask==2.2.2
- redis==4.5.1
- python-dotenv==1.0.0

## Architecture Patterns
- **MVC (Model-View-Controller) -ish:** The code demonstrates a basic MVC pattern, with the `index()` function acting as the controller, the prompt splitting logic as part of the model, and the `render_template` calls using the view (`index.html`).  However, it's a simplified implementation.
- **Environment Variable Configuration:** The application loads environment variables from a `.env` file using the `python-dotenv` library. This is evident in:

```python
from dotenv import load_dotenv
load_dotenv()
```

## Relevance to SEOSONA OS
The prompt splitting functionality could be integrated into SEOSONA OS to allow for processing of very large text inputs, which might exceed token limits when interacting with language models. The Redis integration for visit counting demonstrates a simple method for tracking usage that could be adapted for monitoring resource consumption within the OS.  Specifically, the `split_prompt` function's logic for adding instructions to each chunk ("Part X/Y received") is relevant for ensuring proper sequencing of prompts when interacting with LLMs.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `reference` · **Fit:** 0/100 · **Auto-apply:** False
- **Evidence:** none (kept as reference)
- **All scores:** {'seosona-os': 0, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
