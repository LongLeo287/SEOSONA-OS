from __future__ import annotations

from typing import Any, Dict, Mapping, Optional, Sequence
from urllib.parse import quote

import requests

from .types import APIObject, RunThreadMessage


DEFAULT_BASE_URL = "https://relay.an.dev"


def _to_api_object(value: Any) -> Any:
    if isinstance(value, dict):
        return APIObject({key: _to_api_object(item) for key, item in value.items()})
    if isinstance(value, list):
        return [_to_api_object(item) for item in value]
    return value


class AgentClientError(Exception):
    pass


class AgentClient:
    def __init__(self, api_key: str, base_url: str = DEFAULT_BASE_URL):
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self._session = requests.Session()

        self.sandboxes = SandboxesResource(self)
        self.threads = ThreadsResource(self)
        self.tokens = TokensResource(self)

    def close(self) -> None:
        self._session.close()

    def __enter__(self) -> "AgentClient":
        return self

    def __exit__(self, exc_type: Any, exc: Any, tb: Any) -> None:
        self.close()

    def _request(
        self,
        path: str,
        *,
        method: str = "GET",
        body: Optional[Dict[str, Any]] = None,
        headers: Optional[Mapping[str, str]] = None,
        stream: bool = False,
    ) -> requests.Response:
        request_headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer %s" % self.api_key,
        }
        if headers:
            request_headers.update(headers)

        response = self._session.request(
            method,
            "%s%s" % (self.base_url, path),
            json=body,
            headers=request_headers,
            stream=stream,
        )

        if not response.ok:
            try:
                payload = response.json()
            except ValueError:
                payload = {}

            error = payload.get("error") if isinstance(payload, dict) else None
            message = None
            if isinstance(error, dict):
                message = error.get("message")

            raise AgentClientError(message or "Request failed: %s" % response.status_code)

        return response

    def _fetch(
        self,
        path: str,
        *,
        method: str = "GET",
        body: Optional[Dict[str, Any]] = None,
        headers: Optional[Mapping[str, str]] = None,
    ) -> Any:
        response = self._request(path, method=method, body=body, headers=headers)

        if response.status_code == 204:
            return None

        return _to_api_object(response.json())

    def _get_base_url(self) -> str:
        return self.base_url


class FilesResource:
    def __init__(self, client: AgentClient):
        self.client = client

    def write(self, sandbox_id: str, files: Mapping[str, str]) -> Any:
        return self.client._fetch(
            "/v1/sandboxes/%s/files" % sandbox_id,
            method="POST",
            body={"files": dict(files)},
        )

    def read(self, sandbox_id: str, path: str) -> Any:
        encoded_path = quote(path, safe="")
        return self.client._fetch(
            "/v1/sandboxes/%s/files?path=%s" % (sandbox_id, encoded_path),
        )

    def list(
        self,
        sandbox_id: str,
        path: str,
        *,
        depth: Optional[int] = None,
    ) -> Any:
        query = "path=%s" % quote(path, safe="")
        if depth is not None:
            query += "&depth=%s" % depth

        return self.client._fetch(
            "/v1/sandboxes/%s/files/list?%s" % (sandbox_id, query),
        )

    def get_info(self, sandbox_id: str, path: str) -> Any:
        encoded_path = quote(path, safe="")
        return self.client._fetch(
            "/v1/sandboxes/%s/files/info?path=%s" % (sandbox_id, encoded_path),
        )

    def exists(self, sandbox_id: str, path: str) -> bool:
        encoded_path = quote(path, safe="")
        return bool(
            self.client._fetch(
                "/v1/sandboxes/%s/files/exists?path=%s" % (sandbox_id, encoded_path),
            )
        )

    def make_dir(self, sandbox_id: str, path: str) -> bool:
        return bool(
            self.client._fetch(
                "/v1/sandboxes/%s/files/mkdir" % sandbox_id,
                method="POST",
                body={"path": path},
            )
        )

    def rename(self, sandbox_id: str, old_path: str, new_path: str) -> Any:
        return self.client._fetch(
            "/v1/sandboxes/%s/files/rename" % sandbox_id,
            method="POST",
            body={"oldPath": old_path, "newPath": new_path},
        )

    def remove(self, sandbox_id: str, path: str) -> None:
        encoded_path = quote(path, safe="")
        self.client._fetch(
            "/v1/sandboxes/%s/files?path=%s" % (sandbox_id, encoded_path),
            method="DELETE",
        )


class GitResource:
    def __init__(self, client: AgentClient):
        self.client = client

    def clone(
        self,
        sandbox_id: str,
        url: str,
        *,
        path: Optional[str] = None,
        token: Optional[str] = None,
        depth: Optional[int] = None,
    ) -> Any:
        body: Dict[str, Any] = {"url": url}
        if path:
            body["path"] = path
        if token:
            body["token"] = token
        if depth:
            body["depth"] = depth

        return self.client._fetch(
            "/v1/sandboxes/%s/git/clone" % sandbox_id,
            method="POST",
            body=body,
        )


class SandboxesResource:
    def __init__(self, client: AgentClient):
        self.client = client
        self.files = FilesResource(client)
        self.git = GitResource(client)

    def create(
        self,
        agent: str,
        *,
        files: Optional[Mapping[str, str]] = None,
        envs: Optional[Mapping[str, str]] = None,
        setup: Optional[Sequence[str]] = None,
        timeout_ms: Optional[int] = None,
        network_allow_out: Optional[Sequence[str]] = None,
        network_deny_out: Optional[Sequence[str]] = None,
    ) -> Any:
        body: Dict[str, Any] = {"agent": agent}
        if files:
            body["files"] = dict(files)
        if envs:
            body["envs"] = dict(envs)
        if setup:
            body["setup"] = list(setup)
        if timeout_ms is not None:
            body["timeoutMs"] = timeout_ms
        if network_allow_out is not None:
            body["networkAllowOut"] = list(network_allow_out)
        if network_deny_out is not None:
            body["networkDenyOut"] = list(network_deny_out)

        return self.client._fetch("/v1/sandboxes", method="POST", body=body)

    def get(self, sandbox_id: str) -> Any:
        return self.client._fetch("/v1/sandboxes/%s" % sandbox_id)

    def delete(self, sandbox_id: str) -> Any:
        return self.client._fetch("/v1/sandboxes/%s" % sandbox_id, method="DELETE")

    def exec(
        self,
        sandbox_id: str,
        command: str,
        *,
        cwd: Optional[str] = None,
        envs: Optional[Mapping[str, str]] = None,
        timeout_ms: Optional[int] = None,
    ) -> Any:
        body: Dict[str, Any] = {"command": command}
        if cwd:
            body["cwd"] = cwd
        if envs:
            body["envs"] = dict(envs)
        if timeout_ms:
            body["timeoutMs"] = timeout_ms

        return self.client._fetch(
            "/v1/sandboxes/%s/exec" % sandbox_id,
            method="POST",
            body=body,
        )


class ThreadsResource:
    def __init__(self, client: AgentClient):
        self.client = client

    def list(self, sandbox_id: str) -> Any:
        return self.client._fetch("/v1/sandboxes/%s/threads" % sandbox_id)

    def create(self, sandbox_id: str, *, name: Optional[str] = None) -> Any:
        body: Dict[str, Any] = {}
        if name is not None:
            body["name"] = name

        return self.client._fetch(
            "/v1/sandboxes/%s/threads" % sandbox_id,
            method="POST",
            body=body,
        )

    def get(self, sandbox_id: str, thread_id: str) -> Any:
        return self.client._fetch(
            "/v1/sandboxes/%s/threads/%s" % (sandbox_id, thread_id),
        )

    def delete(self, sandbox_id: str, thread_id: str) -> Any:
        return self.client._fetch(
            "/v1/sandboxes/%s/threads/%s" % (sandbox_id, thread_id),
            method="DELETE",
        )

    def run(
        self,
        agent: str,
        messages: Sequence[RunThreadMessage],
        *,
        sandbox_id: Optional[str] = None,
        thread_id: Optional[str] = None,
        name: Optional[str] = None,
        options: Optional[Dict[str, Any]] = None,
    ) -> Any:
        if thread_id and not sandbox_id:
            raise AgentClientError("threadId requires sandboxId")

        if not sandbox_id:
            sandbox_id = self.client.sandboxes.create(agent).id

        if not thread_id:
            thread_id = self.create(sandbox_id, name=name).id

        encoded_agent = quote(agent, safe="")
        body: Dict[str, Any] = {
            "messages": list(messages),
            "sandboxId": sandbox_id,
            "threadId": thread_id,
        }
        if options:
            body["options"] = options

        response = self.client._request(
            "/v1/chat/%s" % encoded_agent,
            method="POST",
            body=body,
            stream=True,
        )

        return APIObject(
            {
                "sandboxId": sandbox_id,
                "threadId": thread_id,
                "response": response,
                "resumeUrl": "%s/v1/chat/%s/%s/stream"
                % (self.client._get_base_url(), encoded_agent, sandbox_id),
            }
        )


class TokensResource:
    def __init__(self, client: AgentClient):
        self.client = client

    def create(
        self,
        *,
        agent: Optional[str] = None,
        user_id: Optional[str] = None,
        expires_in: str = "1h",
    ) -> Any:
        body: Dict[str, Any] = {"expiresIn": expires_in}

        if agent:
            body["agents"] = [agent]

        if user_id is not None:
            body["userId"] = user_id

        return self.client._fetch("/v1/tokens", method="POST", body=body)
