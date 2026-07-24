# KI: joonspk-research/generative_agents

## Overview
This project appears to be a research platform for generative agents, focusing on creating simulated individuals with memory and the ability to interact within an environment. The presence of directories like "personas" and files containing "memory" data (e.g., `spatial_memory.json`, `associative_memory/embeddings.json`) strongly suggests this focus.  The frontend server component indicates a user interface for interacting with or observing these agents.

## Tech Stack (from code)
- **Python:** The presence of numerous `.py` files (42 in total, as per the file statistics) and the `requirements.txt` file containing Python package dependencies confirms that this project is primarily written in Python.
- **Django:**  The directory structure includes a "settings" folder with `base.py` and `local.py`, along with `manage.py`, which are characteristic of Django projects. The `requirements.txt` also lists `Django==2.2`. (environment/frontend_server/)
- **Frontend Server:** The presence of `Procfile`, `runtime.txt`, `urls.py`, and a `static_dirs` directory suggests the existence of a frontend server component, likely built with Python or another web framework.

## Public API / Exports
Due to the sheer number of files (209903), identifying all exported functions/classes is not feasible within this analysis scope. However, based on the `environment/frontend_server/urls.py` file:

```python
# environment/frontend_server/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
]
```

This reveals a public endpoint at the root URL (`/`) which maps to the `views.index` function within the frontend server's `views` module.  Further analysis would be required to determine other exported elements.

## Dependencies
The following dependencies are listed in `requirements.txt`:

- aiohttp==3.8.3
- aiosignal==1.3.1
- asgiref==3.5.2
- async-generator==1.10
- async-timeout==4.0.2
- attrs==22.2.0
- boto==2.49.0
- botocore==1.29.43
- certifi==2021.10.8
- charset-normalizer==2.0.12
- click==8.0.3
- cycler==0.11.0
- dj-database-url==0.5.0
- Django==2.2
- django-cors-headers==2.5.3
- django-storages-redux==1.3.3
- exceptiongroup==1.1.0
- frozenlist==1.3.3
- gensim==3.8.0
- gunicorn==20.1.0
- h11==0.14.0
- idna==3.3
- importlib-metadata==4.8.2
- jmespath==1.0.1
- joblib>=1.1.1
- kiwisolver==1.4.4
- matplotlib==3.7.2
- multidict==6.0.4
- nltk==3.6.5
- numpy==1.25.2
- openai==0.27.0
- outcome==1.2.0
- packaging==23.0
- pandas==2.0.3
- patsy==0.5.3
- Pillow==8.4.0
- psycopg2-binary==2.9.5
- pycparser==2.21
- pyparsing==3.0.6
- PySocks==1.7.1
- python-dateutil==2.8.2
- pytz==2021.3
- regex==2021.11.10
- requests==2.26.0
- s3transfer==0.6.0
- scikit-learn==1.3.0
- scikit-posthocs==0.7.0
- scipy==1.11.1
- seaborn==0.12.2
- selenium==4.8.2
- six==1.16.0
- sklearn==0.0
- smart-open==5.2.1
- sniffio==1.3.0
- sortedcontainers==2.4.0
- sqlparse==0.4.3
- statsmodels==0.13.5
- threadpoolctl==3.0.0
- tqdm==4.62.3
- trio==0.22.0
- trio-websocket==0.9.2
- trueskill==0.4.5
- typing-extensions==4.0.0
- urllib3==1.26.7
- wsproto==1.2.0
- yarl==1.8.2
- yellowbrick==1.5
- zipp==3.6.0

## Architecture Patterns
- **Microservices/Modular Design:** The separation into `environment/frontend_server` suggests a modular architecture, potentially with distinct components for the frontend and backend logic.
- **Data-Driven Agents:**  The extensive use of JSON files (208457) to store agent data like memory ("bootstrap_memory", "spatial_memory", "associative_memory") indicates a data-driven approach to defining and managing agents' behaviors and knowledge.

## Relevance to SEOSONA OS
This project’s focus on simulated agents with persistent memory could be highly relevant for SEOSONA OS. The agent architecture, particularly the memory management system (JSON files storing embeddings, keyword strengths, nodes), provides a foundation for creating realistic virtual entities within the OS environment.  The frontend server component demonstrates how these agents can be visualized and interacted with, which aligns with potential user interface needs in SEOSONA OS. Furthermore, the use of libraries like `scikit-learn` and `numpy` suggests capabilities that could be leveraged for advanced AI features within the operating system.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 61/100 · **Auto-apply:** False
- **Evidence:** `openai`, `embedding`, `rag`
- **All scores:** {'seosona-os': 61, 'seosona-video': 0, 'seosona-content': 33, 'seosona-ux-ui': 33, 'seosona-flow': 0}
