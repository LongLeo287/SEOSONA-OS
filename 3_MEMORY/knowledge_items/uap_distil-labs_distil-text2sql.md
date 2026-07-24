# KI: distil-labs/distil-text2sql

## Overview
This project, `distil-labs/distil-text2sql`, is a command-line application designed to generate SQL queries from natural language questions against CSV data. It leverages a large language model (LLM) to translate the question into an executable SQL query and then executes that query against a SQLite database created from the provided CSV files. The project aims to provide a simple interface for querying structured data using natural language.

## Tech Stack (from code)
- **Python:**  The primary language, evident from file extensions (`.py`) and shebangs like `#!/usr/bin/env python3` in `app.py` and `model_client.py`.
- **Pandas:** Used for reading CSV files and creating SQLite tables (e.g., `df = pd.read_csv(csv_path)` in `app.py`).
- **SQLite3:**  Used as the database engine to store data from CSV files (`import sqlite3` in `app.py`).
- **OpenAI Python Library:** Used for interacting with an LLM (e.g., `from openai import OpenAI` in `model_client.py`).
- **Argparse:** Used for command line argument parsing (`import argparse` in both `app.py` and `model_client.py`).

## Public API / Exports
Based on the provided code, here's a list of exported functions/classes:

*   **`app.py`**:
    *   `load_csv_to_sqlite(csv_paths: list[str], conn: sqlite3.Connection) -> dict[str, str]` : Loads CSV files into SQLite and returns schema information.
    *   `format_question(schema: str, question: str) -> str`: Formats the schema and question for LLM input.
    *   `execute_query(conn: sqlite3.Connection, sql: str) -> pd.DataFrame`: Executes a SQL query and returns results as a Pandas DataFrame.
    *   `main()`: The main function that parses arguments and orchestrates the process.

*   **`model_client.py`**:
    *   `DistilLabsLLM(model_name: str, api_key: str = "EMPTY", port: int = 11434)`: A class for interacting with a language model.
    *   `DistilLabsLLM.get_prompt(question: str) -> list[dict[str, str]]`:  Generates the prompt for the LLM.
    *   `DistilLabsLLM.invoke(question: str) -> str`: Sends a question to the LLM and returns the SQL query response.

## Dependencies
Based on the code snippets provided, we can infer the following dependencies:

*   **pandas:**  Used for CSV parsing and DataFrame manipulation.
*   **sqlite3:**  Standard Python library for SQLite interaction.
*   **openai:** For interacting with OpenAI's LLMs.
*   **argparse:** Standard Python library for argument parsing.

## Architecture Patterns
- **Command-Line Interface (CLI):** The application is designed as a CLI tool, using `argparse` to handle command-line arguments and options.
- **Modular Design:**  The code is separated into two main files (`app.py` and `model_client.py`), promoting modularity and separation of concerns. `app.py` handles data loading and query execution, while `model_client.py` encapsulates the LLM interaction logic.
- **LLM Prompt Engineering:** The `DistilLabsLLM` class demonstrates prompt engineering techniques to guide the LLM towards generating SQL queries (e.g., defining a system message and question XML block).



## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

*   **Natural Language Querying:** The core functionality of querying data using natural language can be integrated into SEOSONA OS, allowing users to interact with structured data more intuitively.
*   **Data Exploration Tool:**  The application could serve as a standalone or embedded tool for exploring and analyzing datasets within the SEOSONA OS environment.
*   **LLM Integration Framework:** The `DistilLabsLLM` class provides a reusable framework for interacting with LLMs, which can be extended to support other models and tasks within SEOSONA OS.  The prompt engineering techniques demonstrated are valuable for building more sophisticated natural language interfaces.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `reference` · **Fit:** 0/100 · **Auto-apply:** False
- **Evidence:** none (kept as reference)
- **All scores:** {'seosona-os': 0, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
