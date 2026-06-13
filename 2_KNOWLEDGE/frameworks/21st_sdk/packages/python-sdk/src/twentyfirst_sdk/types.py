from __future__ import annotations

from typing import Any, Mapping, TypedDict


class APIObject(dict):
    """Dict with attribute-style access, similar to plain JS objects."""

    def __getattr__(self, name: str) -> Any:
        try:
            return self[name]
        except KeyError as exc:
            raise AttributeError(name) from exc

    def __setattr__(self, name: str, value: Any) -> None:
        self[name] = value

    def __delattr__(self, name: str) -> None:
        try:
            del self[name]
        except KeyError as exc:
            raise AttributeError(name) from exc


class ApiError(TypedDict):
    code: str
    message: str


RunThreadMessagePart = Mapping[str, Any]
RunThreadMessage = Mapping[str, Any]

Sandbox = APIObject
SandboxDetail = APIObject
ThreadSummary = APIObject
RunThreadResult = APIObject
Thread = APIObject
Token = APIObject
FileContent = APIObject
ExecResult = APIObject
GitCloneResult = APIObject
