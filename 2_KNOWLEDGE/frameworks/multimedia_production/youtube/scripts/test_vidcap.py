#!/usr/bin/env python3
"""Tests for VidCap.xyz API Client."""

import json
import os
import sys
from io import StringIO
from unittest.mock import MagicMock, patch

import pytest

# Set API key for tests
os.environ["VIDCAP_API_KEY"] = "test_api_key"

from vidcap import (
    api_request,
    cmd_caption,
    cmd_comments,
    cmd_info,
    cmd_screenshot,
    cmd_search,
    cmd_summary,
    get_api_key,
)


class Args:
    """Mock args object."""

    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)


@pytest.fixture
def mock_response():
    """Create mock response."""
    mock = MagicMock()
    mock.status_code = 200
    mock.json.return_value = {"status": "ok"}
    mock.text = '{"status": "ok"}'
    return mock


def test_get_api_key():
    """Test API key retrieval."""
    assert get_api_key() == "test_api_key"


def test_get_api_key_missing():
    """Test missing API key."""
    with patch.dict(os.environ, {}, clear=True):
        os.environ.pop("VIDCAP_API_KEY", None)
        with pytest.raises(SystemExit):
            get_api_key()


@patch("vidcap.requests.get")
def test_api_request_get(mock_get, mock_response):
    """Test GET request."""
    mock_get.return_value = mock_response
    result = api_request("/youtube/info", params={"url": "test"})
    assert result == {"status": "ok"}
    mock_get.assert_called_once()


@patch("vidcap.requests.post")
def test_api_request_post(mock_post, mock_response):
    """Test POST request."""
    mock_post.return_value = mock_response
    result = api_request("/youtube/summary-custom", method="POST", json_body={"url": "test"})
    assert result == {"status": "ok"}
    mock_post.assert_called_once()


@patch("vidcap.requests.get")
def test_api_request_error(mock_get):
    """Test API error handling."""
    mock = MagicMock()
    mock.status_code = 400
    mock.text = "Bad request"
    mock_get.return_value = mock
    with pytest.raises(SystemExit):
        api_request("/youtube/info", params={"url": "test"})


@patch("vidcap.api_request")
def test_cmd_info(mock_api, capsys):
    """Test info command."""
    mock_api.return_value = {"title": "Test Video", "duration": 120}
    args = Args(url="https://youtube.com/watch?v=test", no_cache=False)
    cmd_info(args)
    captured = capsys.readouterr()
    assert "Test Video" in captured.out


@patch("vidcap.api_request")
def test_cmd_caption(mock_api, capsys):
    """Test caption command."""
    mock_api.return_value = [{"text": "Hello", "start": 0, "duration": 2}]
    args = Args(url="https://youtube.com/watch?v=test", locale="en", ext=None, model=None)
    cmd_caption(args)
    captured = capsys.readouterr()
    assert "Hello" in captured.out


@patch("vidcap.api_request")
def test_cmd_summary(mock_api, capsys):
    """Test summary command."""
    mock_api.return_value = {"result": "This video is about testing."}
    args = Args(
        url="https://youtube.com/watch?v=test",
        locale="en",
        model=None,
        screenshot=False,
        no_cache=False,
    )
    cmd_summary(args)
    captured = capsys.readouterr()
    assert "testing" in captured.out


@patch("vidcap.api_request")
def test_cmd_screenshot(mock_api, capsys):
    """Test screenshot command."""
    mock_api.return_value = {"url": "test", "second": 60, "image_url": "https://example.com/img.jpg"}
    args = Args(url="https://youtube.com/watch?v=test", second=60)
    cmd_screenshot(args)
    captured = capsys.readouterr()
    assert "image_url" in captured.out


@patch("vidcap.api_request")
def test_cmd_comments(mock_api, capsys):
    """Test comments command."""
    mock_api.return_value = {
        "comments": [{"author": "User1", "text": "Great video!", "likeCount": 10}]
    }
    args = Args(
        url="https://youtube.com/watch?v=test",
        order=None,
        format=None,
        include_replies=False,
        page_token=None,
    )
    cmd_comments(args)
    captured = capsys.readouterr()
    assert "Great video" in captured.out


@patch("vidcap.api_request")
def test_cmd_search(mock_api, capsys):
    """Test search command."""
    mock_api.return_value = {
        "items": [{"title": "Found Video", "videoId": "abc123"}],
        "totalResults": 1,
    }
    args = Args(
        query="test query",
        max_results=10,
        order=None,
        duration=None,
        page_token=None,
        published_after=None,
    )
    cmd_search(args)
    captured = capsys.readouterr()
    assert "Found Video" in captured.out


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
