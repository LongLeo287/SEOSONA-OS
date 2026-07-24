# KI: cclank/lanshu-awesome-ai-video-kit

## Overview
This repository appears to be a collection of resources, prompts, and tools related to AI video generation, likely intended for local development and viewing. The `serve.py` script suggests it's designed to serve these assets locally with specific content type handling and redirection rules.  The project aims to provide curated information and utilities for users working with various AI models like Kling, Seedance, Sora, and Gemini Omni.

## Tech Stack (from code)
- **Python:** The `serve.py` file is written in Python 3 (`#!/usr/bin/env python3`).  The presence of `requirements.txt` indicates the use of Python packages.
- **HTML/CSS/JavaScript:** The project utilizes HTML, CSS and JavaScript for front-end presentation as evidenced by files like `index.html`, `site-theme.css`, and `site-theme.js`.
- **Markdown (.md):**  A significant portion of the content is in Markdown format, used for documentation and guides (e.g., methodology/01-基础公式.md).

## Public API / Exports
Based on the provided code snippets, it's difficult to define a formal public API. However, the `serve.py` script defines a custom HTTP handler (`VideoKitHandler`) that intercepts requests and redirects `.md` files to `/viewer.html`.  This can be considered an internal routing mechanism. The `do_GET` method within `VideoKitHandler` is key to this redirection logic:

```python
# File: serve.py
class VideoKitHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        path = urlparse(self.path).path

        # 把 /any/path.md → 302 → /viewer.html?file=any/path.md
        if path.endswith('.md') and 'raw=1' not in query:
            file_param = path.lstrip('/')
            new_location = f'/viewer.html?file={file_param}'
            self.send_response(302)
            self.send_header('Location', new_location)
            self.end_headers()
            return

        return super().do_GET()
```

## Dependencies
The `requirements.txt` file lists the following dependencies:

```text
# File: scripts/requirements.txt
urllib3==2.1.0
requests==2.31.0
```

## Architecture Patterns
- **Content Redirection:** The core of the server's functionality revolves around redirecting Markdown files to a viewer application (`viewer.html`). This pattern suggests a separation between content storage (Markdown files) and presentation logic (the viewer).
- **Custom HTTP Handler:**  The `VideoKitHandler` demonstrates an extension of Python's built-in HTTP request handler to customize behavior, specifically for handling `.md` files and setting appropriate headers.

## Relevance to SEOSONA OS
This project’s code could benefit SEOSONA OS in the following ways:

*   **Content Management:** The redirection pattern used by `serve.py` could be adapted for a more robust content management system within SEOSONA OS, allowing different file types to be handled and presented consistently.
*   **Local Development Server:**  The lightweight local development server implemented in `serve.py` provides a useful template for creating similar tools within the OS for developers working with various data formats or applications. The "no-cache" headers are particularly valuable for rapid iteration during development.
*   **AI Integration:** Given the project's focus on AI video generation, its structure and organization of prompts and resources could provide insights into how SEOSONA OS can better manage and present information related to AI tools and workflows.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `skill.md`
- **All scores:** {'seosona-os': 41, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 28}
