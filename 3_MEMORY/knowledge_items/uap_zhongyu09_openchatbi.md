# KI: zhongyu09/openchatbi

## Overview
OpenChatBI is a system designed for natural language business intelligence, enabling users to analyze data and generate SQL queries using LLMs. It provides both a command-line interface (CLI) and a Streamlit-based user interface for interacting with the agent graph. The project focuses on building an agent that can understand natural language requests and translate them into database queries.

## Tech Stack (from code)
- **Python:**  The primary language, evidenced by numerous `.py` files (e.g., `run_cli.py`, `run_streamlit_ui.py`).
- **Langgraph:** Used for building agent graphs, as seen in the import statements within `run_cli.py`: `from langgraph.checkpoint.memory import MemorySaver`.
- **Langchain:**  A core dependency and framework used extensively, evidenced by imports like `from langchain.agents import AgentExecutor` (though this specific line is not present, the presence of `langgraph` strongly implies Langchain usage). The `pyproject.toml` file lists dependencies such as `langchain`, `langchain-openai`, and `langchain-chroma`.
- **Streamlit:** Used for creating a user interface, demonstrated by the `run_streamlit_ui.py` script: `import streamlit`.
- **uv**:  Used as a build system and test runner, evident in commands like `uv run pytest` within `run_tests.py`. The `uv.lock` file confirms this dependency.

## Public API / Exports
Due to the limited scope of analysis (only code), it's difficult to definitively list public APIs. However, based on the scripts provided:
- **`run_cli.py`**:  Provides a command-line interface for interacting with the agent graph. It accepts arguments and streams intermediate steps or final answers.
- **`run_streamlit_ui.py`**: Launches a Streamlit web application providing a user interface.
- **`openchatbi.agent_graph.build_agent_graph_sync`**:  Function used to build the agent graph synchronously (as seen in `run_cli.py`).

## Dependencies
Based on `pyproject.toml`:
- `requests>=2.31.0,<3.0.0`
- `langgraph>=1.2.2`
- `langchain>=1.3.2`
- `langchain-openai>=1.1.0`
- `langchain-anthropic>=1.4.4`
- `langchain-community>=0.3.27,<1.0.0`
- `langgraph-checkpoint-sqlite>=2.0.11`
- `langchain-chroma>=0.2.5`
- `langchain-mcp-adapters>=0.1.9,<0.2.0`
- `deepagents>=0.6.7`
- `langmem>=0.0.29`
- `sqlalchemy>=2.0.41,<3.0.0`
- `sqlalchemy-trino>=0.5.0`
- `aiosqlite>=0.21.0`
- `pyhive[presto]>=0.7.0`
- `rank-bm25>=0.2.2,<1.0.0`
- `python-levenshtein>=0.27.1`
- `gradio>=5.43.1,<6.0.0`
- `streamlit>=1.49.1,<2.0.0`
- `RestrictedPython>=8.0,<9.0`
- `docker>=7.0.0,<8.0.0`
- `pandas>=2.2.0,<3.0.0`
- `numpy>=2.3.0,<3.0.0`
- `matplotlib>=3.10.6,<4.0.0`
- `seaborn>=0.13.0,<1.0.0`
- `plotly>=5.17.0,<6.0.0`
- `json5>=0.10.0,<1.0.0`
- `jieba>=0.42.1`

## Architecture Patterns
- **Agent-Based System:** The core architecture revolves around an agent graph, where agents perform specific tasks and interact to achieve a goal (e.g., translating natural language into SQL). This is evident in the use of Langgraph for building the graph structure.
- **Streaming Output:**  The `run_cli.py` script emphasizes streaming intermediate steps during execution, suggesting a focus on transparency and debugging.
- **Modular Design:** The project appears to be structured with distinct modules (e.g., agent graph construction, UI, testing), as indicated by the directory structure and import statements.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:
- **Natural Language Interface for Data Access:** The core functionality of translating natural language into SQL queries is directly applicable to enabling users to interact with data sources within SEOSONA OS using conversational interfaces.
- **Agent-Based Automation:**  The agent graph architecture can be adapted to automate various tasks within SEOSONA OS, such as data analysis workflows or report generation.
- **LLM Integration:** The project's reliance on LLMs for natural language understanding and SQL generation aligns with the growing importance of LLMs in modern software systems, providing a foundation for integrating advanced AI capabilities into SEOSONA OS.  The use of Langchain provides a framework to easily integrate new LLMs as well.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 61/100 · **Auto-apply:** False
- **Evidence:** `llm`, `openai`, `anthropic`
- **All scores:** {'seosona-os': 61, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
