# Architecture Extract: llm-app

## Directory Structure
```text
llm-app/
    .gitignore
    CODE_OF_CONDUCT.md
    CONTRIBUTING.md
    LICENSE
    pyproject.toml
    README.md
    setup.cfg
    .github/
        pull_request_template.md
        assets/
        ISSUE_TEMPLATE/
            bug_report.yml
            config.yml
        workflows/
            python-lint.yml
    .vscode/
        settings.json
    assets/
    cookbooks/
        self-rag-agents/
            pathway_deploy_langgraph_agents.ipynb
            pathway_langgraph_agentic_rag.ipynb
    templates/
        adaptive_rag/
            .env.example
            app.py
            app.yaml
            Dockerfile
            README.md
            requirements.txt
            data/
                IdeanomicsInc_20160330_10-K_EX-10.26_9512211_EX-10.26_Content License Agreement.pdf
        document_indexing/
            app.py
            app.yaml
            docker-compose.yml
            Dockerfile
            README.md
            requirements.txt
            files-for-indexing/
                2023q2-alphabet-earnings-release.pdf
                Always up-to-date Vector Data Indexing pipeline _ Pathway.pdf
                arxiv 2307.13116.pdf
                Build an LLM App _ Pathway.pdf
                Launching Pathway + LlamaIndex.pdf
                pw.io.http _ Pathway.pdf
                Realtime Classification with Nearest Neighbors (1_2) _ Pathway.pdf
                Realtime Twitter Analysis App _ Pathway.pdf
                Use LLMs to Ingest Raw Text into DB _ Pathway.pdf
        document_store_mcp_server/
            .env.example
            app.py
            app.yaml
            docker-compose.yml
            Dockerfile
            README.md
            requirements.txt
            __init__.py
            files-for-indexing/
                2023q2-alphabet-earnings-release.pdf
                Always up-to-date Vector Data Indexing pipeline _ Pathway.pdf
                arxiv 2307.13116.pdf
                Build an LLM App _ Pathway.pdf
                Launching Pathway + LlamaIndex.pdf
                pw.io.http _ Pathway.pdf
                Realtime Classification with Nearest Neighbors (1_2) _ Pathway.pdf
                Realtime Twitter Analysis App _ Pathway.pdf
                Use LLMs to Ingest Raw Text into DB _ Pathway.pdf
        drive_alert/
            app.py
            docker-compose.yml
            Dockerfile
            README.md
            __init__.py
            ui/
                Dockerfile
                server.py
        multimodal_rag/
            .env.example
            app.py
            app.yaml
            Dockerfile
            README.md
            requirements.txt
            data/
                20230203_alphabet_10K.pdf
        private_rag/
            app.py
            app.yaml
            Dockerfile
            README.md
            requirements.txt
            data/
                IdeanomicsInc_20160330_10-K_EX-10.26_9512211_EX-10.26_Content License Agreement.pdf
        question_answering_rag/
            .env.example
            app.py
            app.yaml
            docker-compose.yml
            Dockerfile
            README.md
            requirements.txt
            data/
                IdeanomicsInc_20160330_10-K_EX-10.26_9512211_EX-10.26_Content License Agreement.pdf
            ui/
                Dockerfile
                favicon.ico
                requirements.txt
                ui.py
                .streamlit/
                    config.toml
                static/
        slides_ai_search/
            .dockerignore
            .env.example
            .gitignore
            app.py
            app.yaml
            docker-compose.yml
            Dockerfile
            README.md
            requirements.txt
            nginx/
                Dockerfile
                nginx.conf
            pathway_slides_ai_search/
                __init__.py
            ui/
                Dockerfile
                favicon.ico
                requirements.txt
                ui.py
                .streamlit/
                    config.toml
                static/
        unstructured_to_sql_on_the_fly/
            app.py
            docker-compose.yml
            Dockerfile
            README.md
            requirements.txt
            __init__.py
            data/
                quarterly_earnings/
                    2023q2-alphabet-earnings-release.pdf
                    FY22_Q4_Consolidated_Financial_Statements.pdf
                    FY23_Q1_Consolidated_Financial_Statements.pdf
                    FY23_Q2_Consolidated_Financial_Statements.pdf
                    FY23_Q3_Consolidated_Financial_Statements.pdf
                    goog-exhibit-99-1-q1-2023-19.pdf
                    Meta-03-31-2023-Exhibit-99-1-FINAL-v2.pdf
            postgres/
                init-db.sql
            ui/
                Dockerfile
                server.py
```

## Core Logic Samples

### `.vscode\settings.json`
```
{
  "python.defaultInterpreterPath": "${env:HOME}/pw-env/bin/python",
  "python.formatting.provider": "none",
  "editor.formatOnSave": true,
  "python.linting.enabled": true,
  "python.linting.flake8Enabled": true,
  "python.linting.mypyEnabled": true,
  "[python]": {
    "files.trimTrailingWhitespace": true,
    "editor.rulers": [88],
    "editor.codeActionsOnSave": {
      "source.organizeImports": "explicit"
    },
    "editor.defaultFormatter": "ms-python.black-formatter"
  },
  "git.autofetchPeriod": 315360000
}
```

### `templates\adaptive_rag\app.py`
```
import logging
from warnings import warn

import pathway as pw
from dotenv import load_dotenv
from pathway.xpacks.llm.question_answering import SummaryQuestionAnswerer
from pathway.xpacks.llm.servers import QASummaryRestServer
from pydantic import BaseModel, ConfigDict, InstanceOf

# To use advanced features with Pathway Live Data Framework Scale, get your free license key from
# https://pathway.com/features and paste it below.
# To use Pathway Live Data Framework Community, comment out the line below.
pw.set_license_key("demo-license-key-with-telemetry")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(name)s %(levelname)s %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

load_dotenv()


class App(BaseModel):
    question_answerer: InstanceOf[SummaryQuestionAnswerer]
    host: str = "0.0.0.0"
    port: int = 8000

    with_cache: bool | None = None  # deprecated
    persistence_backend: pw.persistence.Backend | None = None
    persistence_mode: pw.PersistenceMode | None = pw.PersistenceMode.UDF_CACHING
    terminate_on_error: bool = False

    def run(self) -> None:
        server = QASummaryRestServer(  # noqa: F841
            self.host, self.port, self.question_answerer
        )

        if self.persistence_mode is None:
            if self.with_cache is True:
                warn(
                    "`with_cache` is deprecated. Please use `persistence_mode` instead.",
                    DeprecationWarning,
                )
                persistence_mode = pw.PersistenceMode.UDF_CACHING
            else:
                persistence_mode = None
        else:
            persistence_mode = self.persistence_mode

        if persistence_mode is not None:
            if self.persistence_backend is None:
                persistence_backend = pw.persistence.Backend.filesystem("./Cache")
            else:
                persistence_backend = self.persistence_backend
            persistence_config = pw.persistence.Config(
                persistence_backend,
                persistence_mode=persistence_mode,
            )
        else:
            persistence_config = None

        pw.run(
            persistence_config=persistence_config,
            terminate_on_error=self.terminate_on_error,
            monitoring_level=pw.MonitoringLevel.NONE,
        )

    model_config = ConfigDict(extra="forbid", arbitrary_types_allowed=True)


if __name__ == "__main__":
    with open("app.yaml") as f:
        config = pw.load_yaml(f)
    app = App(**config)
    app.run()
```

### `templates\document_indexing\app.py`
```
import logging
from warnings import warn

import pathway as pw
from dotenv import load_dotenv
from pathway.xpacks.llm.document_store import DocumentStore
from pathway.xpacks.llm.servers import DocumentStoreServer
from pydantic import BaseModel, ConfigDict, InstanceOf

# To use advanced features with Pathway Live Data Framework Scale, get your free license key from
# https://pathway.com/features and paste it below.
# To use Pathway Live Data Framework Community, comment out the line below.
pw.set_license_key("demo-license-key-with-telemetry")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(name)s %(levelname)s %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

load_dotenv()


class App(BaseModel):
    document_store: InstanceOf[DocumentStore]
    host: str = "0.0.0.0"
    port: int = 8000

    with_cache: bool | None = None  # deprecated
    persistence_backend: pw.persistence.Backend | None = None
    persistence_mode: pw.PersistenceMode | None = pw.PersistenceMode.UDF_CACHING
    terminate_on_error: bool = False

    def run(self) -> None:
        server = DocumentStoreServer(  # noqa: F841
            self.host, self.port, self.document_store
        )
        if self.persistence_mode is None:
            if self.with_cache is True:
                warn(
                    "`with_cache` is deprecated. Please use `persistence_mode` instead.",
                    DeprecationWarning,
                )
                persistence_mode = pw.PersistenceMode.UDF_CACHING
            else:
                persistence_mode = None
        else:
            persistence_mode = self.persistence_mode

        if persistence_mode is not None:
            if self.persistence_backend is None:
                persistence_backend = pw.persistence.Backend.filesystem("./Cache")
            else:
                persistence_backend = self.persistence_backend
            persistence_config = pw.persistence.Config(
                persistence_backend,
                persistence_mode=persistence_mode,
            )
        else:
            persistence_config = None

        pw.run(
            persistence_config=persistence_config,
            terminate_on_error=self.terminate_on_error,
            monitoring_level=pw.MonitoringLevel.NONE,
        )

    model_config = ConfigDict(extra="forbid", arbitrary_types_allowed=True)


if __name__ == "__main__":
    with open("app.yaml") as f:
        config = pw.load_yaml(f)
    app = App(**config)
    app.run()
```

### `templates\document_store_mcp_server\app.py`
```
import logging

import pathway as pw
from dotenv import load_dotenv
from pathway.xpacks.llm.mcp_server import PathwayMcp
from pydantic import BaseModel, ConfigDict

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(name)s %(levelname)s %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

load_dotenv()


class App(BaseModel):
    mcp_http: PathwayMcp
    host: str = "0.0.0.0"
    port: int = 8000

    terminate_on_error: bool = False
    persistence_backend: pw.persistence.Backend | None = None
    persistence_mode: pw.PersistenceMode | None = pw.PersistenceMode.UDF_CACHING

    def run(self) -> None:
        if self.persistence_mode is not None:
            if self.persistence_backend is None:
                persistence_backend = pw.persistence.Backend.filesystem("./Cache")
            else:
                persistence_backend = self.persistence_backend
            persistence_config = pw.persistence.Config(
                persistence_backend,
                persistence_mode=self.persistence_mode,
            )
        else:
            persistence_config = None
        pw.run(
            terminate_on_error=self.terminate_on_error,
            persistence_config=persistence_config,
            monitoring_level=pw.MonitoringLevel.NONE,
        )

    model_config = ConfigDict(extra="forbid", arbitrary_types_allowed=True)


if __name__ == "__main__":
    with open("app.yaml") as f:
        config = pw.load_yaml(f)
    print(config)
    app = App(**config)
    app.run()
```

### `templates\document_store_mcp_server\__init__.py`
```
```

### `templates\drive_alert\app.py`
```
"""
Microservice for a context-aware alerting ChatGPT assistant.

This demo is very similar to the `alert` example, the only difference is the data source (Google Drive)
For the demo, alerts are sent to Slack (you need to provide `slack_alert_channel_id` and `slack_alert_token`),
you can either put these env variables in .env file under llm-app directory,
or create env variables in the terminal (i.e. export in bash).

The program then starts a REST API endpoint serving queries about Google Docs stored in a
Google Drive folder.

We can create notifications by asking from Streamlit or sending query to API stating we want to be notified.
One example would be `Tell me and alert about the start date of the campaign for Magic Cola`

How Does It Work?
First, Pathway connects to Google Drive, extracts all documents, splits them into chunks, turns them into
vectors using OpenAI embedding service, and store in a nearest neighbor index.

Each query text is first turned into a vector, then relevant document chunks are found
using the nearest neighbor index. A prompt is built from the relevant chunk
and sent to the OpenAI GPT3.5 chat service for processing and answering.

After an initial answer is provided, Pathway monitors changes to documents and selectively
re-triggers potentially affected queries. If the new answer is significantly different from
the previously presented one, a new notification is created.

Please check the README.md in this directory for how-to-run instructions.
"""

import asyncio
import os

import dotenv
import pathway as pw
from pathway.stdlib.ml.index import KNNIndex
from pathway.xpacks.llm.embedders import OpenAIEmbedder
from pathway.xpacks.llm.llms import OpenAIChat, prompt_chat_single_qa
from pathway.xpacks.llm.parsers import UnstructuredParser
from pathway.xpacks.llm.splitters import TokenCountSplitter

# To use advanced features with Pathway Live Data Framework Scale, get your free license key from
# https://pathway.com/features and paste it below.
# To use Pathway Live Data Framework Community, comment out the line below.
pw.set_license_key("demo-license-key-with-telemetry")

dotenv.load_dotenv()


class DocumentInputSchema(pw.Schema):
    doc: str


class QueryInputSchema(pw.Schema):
    query: str
    user: str


# Helper Functions
@pw.udf
def build_prompt(documents, query):
    docs_str = "\n".join(
        [f"Doc-({idx}) -> {doc}" for idx, doc in enumerate(documents[::-1])]
    )
    prompt = f"""Given a set of documents, answer user query. If answer is not in docs, say it cant be inferred.

Docs: {docs_str}
Query: '{query}'
Final Response:"""
    return prompt


@pw.udf
def build_prompt_check_for_alert_request_and_extract_query(query: str) -> str:
    prompt = f"""Evaluate the user's query and identify if there is a request for notifications on answer alterations:
    User Query: '{query}'

    Respond with 'Yes' if there is a request for alerts, and 'No' if not,
    followed by the query without the alerting request part.

    Examples:
    "Tell me about windows in Pathway" => "No. Tell me about windows in Pathway"
    "Tell me and alert about windows in Pathway" => "Yes. Tell me about windows in Pathway"
    """
    return prompt


@pw.udf
def split_answer(answer: str) -> tuple[bool, str]:
    alert_enabled = "yes" in answer[:3].lower()
    true_query = answer[3:].strip(' ."')
    return alert_enabled, true_query


def build_prompt_compare_answers(new: str, old: str) -> str:
    prompt = f"""
    Are the two following responses deviating?
    Answer with Yes or No.

    First response: "{old}"

    Second response: "{new}"
    """
    return prompt


def make_query_id(user, query) -> str:
    return str(hash(query + user))


@pw.udf
def construct_notification_message(query: str, response: str) -> str:
    return f'New response for question "{query}":\n{response}'


@pw.udf
def construct_message(response, alert_flag, metainfo=None):
    if alert_flag:
        if metainfo:
            response += "\n" + str(metainfo)
        return response + "\n\n🔔 Activated"
    return response


def decision_to_bool(decision: str) -> bool:
    return "yes" in decision.lower()


def run(
    *,
    object_id=os.environ.get("FILE_OR_DIRECTORY_ID", ""),
    api_key: str = os.environ.get("OPENAI_API_KEY", ""),
    host: str = os.environ.get("PATHWAY_REST_CONNECTOR_HOST", "0.0.0.0"),
    port: int = int(os.environ.get("PATHWAY_REST_CONNECTOR_PORT", "8080")),
    embedder_locator: str = "text-embedding-ada-002",
    embedding_dimension: int = 1536,
    model_locator: str = "gpt-3.5-turbo",
    max_tokens: int = 400,
    temperature: float = 0.0,
    slack_alert_channel_id=os.environ.get("SLACK_ALERT_CHANNEL_ID", ""),
    slack_alert_token=os.environ.get("SLACK_ALERT_TOKEN", ""),
    service_user_credentials_file=os.environ.get(
        "GOOGLE_CREDS", "templates/drive_alert/secrets.json"
    ),
    **kwargs,
):
    # Part I: Build index
    embedder = OpenAIEmbedder(
        api_key=api_key,
        model=embedder_locator,
        retry_strategy=pw.asynchronous.FixedDelayRetryStrategy(),
        cache_strategy=pw.asynchronous.DefaultCache(),
    )

    # We start building the computational graph. Each pathway variable represents a
    # dynamically changing table.

    # The files table contains contents of documents in Google Drive.
    # Pathway automatically tracks changes to files and propagates these changes through
    # following computations.
    # Other Pathway connectors can be used as well - notably:
    # - pw.io.fs.read to load and track changes to the local drive and
    # - pw.io.s3.read to use an S3-compatible storage
    files = pw.io.gdrive.read(
        object_id=object_id,
        service_user_credentials_file=service_user_credentials_file,
        refresh_interval=30,  # interval between fetch operations in seconds, lower this for more responsiveness
    )
    parser = UnstructuredParser()
    documents = files.select(texts=parser(pw.this.data))
    documents = documents.flatten(pw.this.texts)
    documents = documents.select(texts=pw.this.texts[0])

    splitter = TokenCountSplitter()
    documents = documents.select(
        chunks=splitter(pw.this.texts, min_tokens=40, max_tokens=120)
    )
    documents = documents.flatten(pw.this.chunks)
    documents = documents.select(chunk=pw.this.chunks[0])

    enriched_documents = documents + documents.select(data=embedder(pw.this.chunk))

    # The index is updated each time a file changes.
    index = KNNIndex(
        enriched_documents.data, enriched_documents, n_dimensions=embedding_dimension
    )

    # Part II: receive queries, detect intent and prepare cleaned query

    # The rest_connector returns a table of all queries under processing
    query, response_writer = pw.io.http.rest_connector(
        host=host,
        port=port,
        schema=QueryInputSchema,
        autocommit_duration_ms=50,
        delete_completed_queries=False,
    )

    model = OpenAIChat(
        api_key=api_key,
        model=model_locator,

... [TRUNCATED] ...
```

### `templates\drive_alert\__init__.py`
```
from .app import run

__all__ = ["run"]
```

### `templates\drive_alert\ui\server.py`
```
import os

import requests
import streamlit as st
from dotenv import load_dotenv

api_host = "localhost"
api_port = 8080

load_dotenv()
api_host = os.environ.get("PATHWAY_REST_CONNECTOR_HOST", "127.0.0.1")
api_port = int(os.environ.get("PATHWAY_REST_CONNECTOR_PORT", 8080))

with st.sidebar:
    st.markdown("## How to query your data\n")
    st.markdown(
        """Enter your question, optionally
ask to be alerted.\n"""
    )
    st.markdown(
        "Example: 'When does the magic cola campaign start? Alert me if the start date changes'",
    )
    st.markdown(
        """[View the source code on GitHub](
https://github.com/pathwaycom/llm-app/templates/drive_alert/app.py)"""
    )
    st.markdown("## Current Alerts:\n")


# Streamlit UI elements
st.title("Google Drive notifications with LLM")

prompt = st.text_input("How can I help you today?")
# prompt = st.chat_input("How can I help you today?")
# Initialize chat history
if "messages" not in st.session_state:
    st.session_state.messages = []

# Display chat messages from history on app rerun
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])


# React to user input
if prompt:
    # Display user message in chat message container
    with st.chat_message("user"):
        st.markdown(prompt)

    # Add user message to chat history
    st.session_state.messages.append({"role": "user", "content": prompt})

    for message in st.session_state.messages:
        if message["role"] == "user":
            st.sidebar.text(f"📩 {message['content']}")

    url = f"http://{api_host}:{api_port}/"
    data = {"query": prompt, "user": "user"}

    response = requests.post(url, json=data)

    if response.status_code == 200:
        response = response.json()
        with st.chat_message("assistant"):
            st.markdown(response)
        st.session_state.messages.append({"role": "assistant", "content": response})
    else:
        st.error(f"Failed to send data. Status code: {response.status_code}")
```

### `templates\multimodal_rag\app.py`
```
import logging
from warnings import warn

import pathway as pw
from dotenv import load_dotenv
from pathway.xpacks.llm.question_answering import SummaryQuestionAnswerer
from pathway.xpacks.llm.servers import QASummaryRestServer
from pydantic import BaseModel, ConfigDict, InstanceOf

# To use advanced features with Pathway Live Data Framework Scale, get your free license key from
# https://pathway.com/features and paste it below.
# To use Pathway Live Data Framework Community, comment out the line below.
pw.set_license_key("demo-license-key-with-telemetry")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(name)s %(levelname)s %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

load_dotenv()


class App(BaseModel):
    question_answerer: InstanceOf[SummaryQuestionAnswerer]
    host: str = "0.0.0.0"
    port: int = 8000

    with_cache: bool | None = None  # deprecated
    persistence_backend: pw.persistence.Backend | None = None
    persistence_mode: pw.PersistenceMode | None = pw.PersistenceMode.UDF_CACHING
    terminate_on_error: bool = False

    def run(self) -> None:
        server = QASummaryRestServer(  # noqa: F841
            self.host, self.port, self.question_answerer
        )

        if self.persistence_mode is None:
            if self.with_cache is True:
                warn(
                    "`with_cache` is deprecated. Please use `persistence_mode` instead.",
                    DeprecationWarning,
                )
                persistence_mode = pw.PersistenceMode.UDF_CACHING
            else:
                persistence_mode = None
        else:
            persistence_mode = self.persistence_mode

        if persistence_mode is not None:
            if self.persistence_backend is None:
                persistence_backend = pw.persistence.Backend.filesystem("./Cache")
            else:
                persistence_backend = self.persistence_backend
            persistence_config = pw.persistence.Config(
                persistence_backend,
                persistence_mode=persistence_mode,
            )
        else:
            persistence_config = None

        pw.run(
            persistence_config=persistence_config,
            terminate_on_error=self.terminate_on_error,
            monitoring_level=pw.MonitoringLevel.NONE,
        )

    model_config = ConfigDict(extra="forbid", arbitrary_types_allowed=True)


if __name__ == "__main__":
    with open("app.yaml") as f:
        config = pw.load_yaml(f)
    app = App(**config)
    app.run()
```

### `templates\private_rag\app.py`
```
import logging
from warnings import warn

import pathway as pw
from dotenv import load_dotenv
from pathway.xpacks.llm.question_answering import SummaryQuestionAnswerer
from pathway.xpacks.llm.servers import QASummaryRestServer
from pydantic import BaseModel, ConfigDict, InstanceOf

# To use advanced features with Pathway Live Data Framework Scale, get your free license key from
# https://pathway.com/features and paste it below.
# To use Pathway Live Data Framework Community, comment out the line below.
pw.set_license_key("demo-license-key-with-telemetry")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(name)s %(levelname)s %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

load_dotenv()


class App(BaseModel):
    question_answerer: InstanceOf[SummaryQuestionAnswerer]
    host: str = "0.0.0.0"
    port: int = 8000

    with_cache: bool | None = None  # deprecated
    persistence_backend: pw.persistence.Backend | None = None
    persistence_mode: pw.PersistenceMode | None = pw.PersistenceMode.UDF_CACHING
    terminate_on_error: bool = False

    def run(self) -> None:
        server = QASummaryRestServer(  # noqa: F841
            self.host, self.port, self.question_answerer
        )

        if self.persistence_mode is None:
            if self.with_cache is True:
                warn(
                    "`with_cache` is deprecated. Please use `persistence_mode` instead.",
                    DeprecationWarning,
                )
                persistence_mode = pw.PersistenceMode.UDF_CACHING
            else:
                persistence_mode = None
        else:
            persistence_mode = self.persistence_mode

        if persistence_mode is not None:
            if self.persistence_backend is None:
                persistence_backend = pw.persistence.Backend.filesystem("./Cache")
            else:
                persistence_backend = self.persistence_backend
            persistence_config = pw.persistence.Config(
                persistence_backend,
                persistence_mode=persistence_mode,
            )
        else:
            persistence_config = None

        pw.run(
            persistence_config=persistence_config,
            terminate_on_error=self.terminate_on_error,
            monitoring_level=pw.MonitoringLevel.NONE,
        )

    model_config = ConfigDict(extra="forbid", arbitrary_types_allowed=True)


if __name__ == "__main__":
    with open("app.yaml") as f:
        config = pw.load_yaml(f)
    app = App(**config)
    app.run()
```
