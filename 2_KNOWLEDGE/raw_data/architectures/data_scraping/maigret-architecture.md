# Architecture Extract: maigret

## Directory Structure
```text
maigret/
    .dockerignore
    .gitignore
    .readthedocs.yaml
    CHANGELOG.md
    cloudshell-tutorial.md
    CODE_OF_CONDUCT.md
    CONTRIBUTING.md
    cookies.txt
    Dockerfile
    example.ipynb
    Installer.bat
    LICENSE
    Makefile
    opensuse.txt
    poetry.lock
    pyproject.toml
    pytest.ini
    README.md
    README.zh-CN.md
    sites.md
    snapcraft.yaml
    TROUBLESHOOTING.md
    wizard.py
    .githooks/
        pre-commit
    .github/
        dependabot.yml
        FUNDING.yml
        ISSUE_TEMPLATE/
            add-a-site.md
            bug.md
            report-false-result.md
        workflows/
            build-docker-image.yml
            codeql-analysis.yml
            pyinstaller.yml
            python-package.yml
            python-publish.yml
            update-site-data.yml
    docs/
        make.bat
        Makefile
        requirements.txt
        source/
            command-line-options.rst
            conf.py
            development.rst
            faq.rst
            features.rst
            index.rst
            installation.rst
            library-usage.rst
            philosophy.rst
            quick-start.rst
            settings.rst
            supported-identifier-types.rst
            tags.rst
            tor-and-proxies.rst
            usage-examples.rst
            locale/
                zh_CN/
                    LC_MESSAGES/
                        command-line-options.po
                        development.po
                        faq.po
                        features.po
                        index.po
                        installation.po
                        library-usage.po
                        philosophy.po
                        quick-start.po
                        settings.po
                        supported-identifier-types.po
                        tags.po
                        tor-and-proxies.po
                        usage-examples.po
                        use-cases/
                            crypto.po
            use-cases/
                crypto.rst
    maigret/
        activation.py
        ai.py
        checking.py
        db_updater.py
        errors.py
        error_detection.py
        executors.py
        extractors.py
        maigret.py
        notify.py
        permutator.py
        report.py
        result.py
        settings.py
        sites.py
        submit.py
        types.py
        utils.py
        __init__.py
        __main__.py
        __version__.py
        resources/
            ai_prompt.txt
            data.json
            db_meta.json
            settings.json
            simple_report.tpl
            simple_report_pdf.css
            simple_report_pdf.tpl
        web/
            app.py
            static/
            templates/
                base.html
                index.html
                results.html
                status.html
    pyinstaller/
        maigret_standalone.py
        maigret_standalone.spec
        requirements.txt
    static/
        recursive_search.md
        report_alexaimephotographycars.html
        report_alexaimephotographycars.pdf
    tests/
        conftest.py
        db.json
        local.json
        test_activation.py
        test_checking.py
        test_cli.py
        test_cloudflare_webgate.py
        test_data.py
        test_db_updater.py
        test_errors.py
        test_error_detection.py
        test_executors.py
        test_extractors.py
        test_idempotent_writes.py
        test_keyword_filtering.py
        test_maigret.py
        test_notify.py
        test_permutator.py
        test_report.py
        test_sanitize_username.py
        test_settings.py
        test_sites.py
        test_standalone_wrapper.py
        test_submit.py
        test_twitter.py
        test_utils.py
        test_web.py
        __init__.py
    utils/
        add_tags.py
        check_engines.py
        check_top_n.py
        cloudshell_install.sh
        fp_probe_top_sites.py
        generate_db_meta.py
        import_sites.py
        sites_diff.py
        site_check.py
        update_site_data.py
        __init__.py
```

## Core Logic Samples

### `wizard.py`
```
import asyncio
import logging
import maigret


TOP_SITES_COUNT = 300
TIMEOUT = 10
MAX_CONNECTIONS = 50


def main():
    logger = logging.getLogger('maigret')
    logger.setLevel(logging.WARNING)
    loop = asyncio.get_event_loop()

    db = maigret.MaigretDatabase().load_from_file('./maigret/resources/data.json')

    username = input('Enter username to search: ')
    sites_count = (
        int(
            input(
                f'Select the number of sites to search ({TOP_SITES_COUNT} for default, {len(db.sites_dict)} max): '
            )
        )
        or TOP_SITES_COUNT
    )
    sites = db.ranked_sites_dict(top=sites_count)

    show_progressbar = input('Do you want to show a progressbar? [Yn] ').lower() != 'n'
    extract_info = (
        input(
            'Do you want to extract additional info from accounts\' pages? [Yn] '
        ).lower()
        != 'n'
    )
    use_notifier = (
        input(
            'Do you want to use notifier for displaying results while searching? [Yn] '
        ).lower()
        != 'n'
    )

    notifier = None
    if use_notifier:
        notifier = maigret.Notifier(print_found_only=True, skip_check_errors=True)

    search_func = maigret.search(
        username=username,
        site_dict=sites,
        timeout=TIMEOUT,
        logger=logger,
        max_connections=MAX_CONNECTIONS,
        query_notify=notifier,
        no_progressbar=not show_progressbar,
        is_parsing_enabled=extract_info,
    )

    results = loop.run_until_complete(search_func)

    input('Search completed. Press any key to show results.')

    for sitename, data in results.items():
        is_found = data['status'].is_found()
        print(f'{sitename} - {"Found!" if is_found else "Not found"}')


if __name__ == '__main__':
    main()
```

### `docs\source\conf.py`
```
# Configuration file for the Sphinx documentation builder.

import os

# -- Project information

project = 'Maigret'
copyright = '2025, soxoj'
author = 'soxoj'

release = '0.6.1'
version = '0.6'

# -- Internationalization
#
# Default to English. Translation projects on Read the Docs set the
# ``READTHEDOCS_LANGUAGE`` env var (e.g. ``zh_CN``); locally the language
# can be overridden via ``sphinx-build -D language=zh_CN``.
language = os.environ.get('READTHEDOCS_LANGUAGE', 'en')
locale_dirs = ['locale/']
gettext_compact = False
gettext_uuid = True

# -- General configuration

extensions = [
    'sphinx.ext.duration',
    'sphinx.ext.doctest',
    'sphinx.ext.autodoc',
    'sphinx.ext.autosummary',
    'sphinx.ext.intersphinx',
    'sphinx_copybutton'
]

intersphinx_mapping = {
    'python': ('https://docs.python.org/3/', None),
    'sphinx': ('https://www.sphinx-doc.org/en/master/', None),
}
intersphinx_disabled_domains = ['std']

templates_path = ['_templates']

# -- Options for HTML output

html_theme = 'sphinx_rtd_theme'

# -- Options for EPUB output
epub_show_urls = 'footnote'
```

### `maigret\activation.py`
```
import json
from http.cookiejar import MozillaCookieJar
from http.cookies import Morsel

from aiohttp import ClientSession, CookieJar


class ParsingActivator:
    @staticmethod
    async def twitter(site, logger, cookies={}, **kwargs):
        headers = dict(site.headers)
        headers.pop("x-guest-token", None)

        async with ClientSession(trust_env=True) as session:
            async with session.post(
                site.activation["url"],
                headers=headers,
                timeout=kwargs.get("timeout"),
            ) as response:
                logger.info(response)
                j = await response.json(content_type=None)
        guest_token = j[site.activation["src"]]
        site.headers[site.activation.get("dst", "x-guest-token")] = guest_token

    @staticmethod
    async def vimeo(site, logger, cookies={}, **kwargs):
        headers = dict(site.headers)
        headers.pop("Authorization", None)

        async with ClientSession(trust_env=True) as session:
            async with session.get(
                site.activation["url"],
                headers=headers,
                timeout=kwargs.get("timeout"),
            ) as response:
                payload = await response.json(content_type=None)
        logger.debug(f"Vimeo viewer activation: {json.dumps(payload, indent=4)}")
        jwt_token = payload["jwt"]
        site.headers["Authorization"] = "jwt " + jwt_token

    @staticmethod
    async def onlyfans(site, logger, url=None, **kwargs):
        # Signing rules (static_param / checksum_indexes / checksum_constant / format / app_token)
        # live in data.json under OnlyFans.activation and rotate upstream every ~1–3 weeks.
        # If "Please refresh the page" keeps firing after activation, refresh them from:
        #   https://raw.githubusercontent.com/DATAHOARDERS/dynamic-rules/main/onlyfans.json
        import hashlib
        import secrets
        import time as _time
        from urllib.parse import urlparse

        act = site.activation
        static_param = act["static_param"]
        indexes = act["checksum_indexes"]
        constant = act["checksum_constant"]
        fmt = act["format"]
        init_url = act["url"]

        user_id = site.headers.get("user-id", "0") or "0"

        def _sign(path):
            t = str(int(_time.time() * 1000))
            msg = "\n".join([static_param, t, path, user_id]).encode()
            sha = hashlib.sha1(msg).hexdigest()
            cs = sum(ord(sha[i]) for i in indexes) + constant
            return t, fmt.format(sha, abs(cs))

        if site.headers.get("x-bc", "").strip("0") == "":
            site.headers["x-bc"] = secrets.token_hex(20)

        if not site.headers.get("cookie"):
            init_path = urlparse(init_url).path
            t, sg = _sign(init_path)
            hdrs = dict(site.headers)
            hdrs["time"] = t
            hdrs["sign"] = sg
            hdrs.pop("cookie", None)
            async with ClientSession(trust_env=True) as session:
                async with session.get(
                    init_url,
                    headers=hdrs,
                    timeout=kwargs.get("timeout", 15),
                ) as response:
                    jar = "; ".join(
                        f"{k}={getattr(v, 'value', v)}"
                        for k, v in response.cookies.items()
                    )
            if jar:
                site.headers["cookie"] = jar
                logger.debug(
                    f"OnlyFans init: got cookies {list(response.cookies.keys())}"
                )

        target_path = urlparse(url).path if url else urlparse(init_url).path
        t, sg = _sign(target_path)
        site.headers["time"] = t
        site.headers["sign"] = sg
        logger.debug(f"OnlyFans signed {target_path} time={t}")

    @staticmethod
    async def weibo(site, logger, **kwargs):
        headers = dict(site.headers)
        timeout = kwargs.get("timeout")

        async with ClientSession(trust_env=True) as session:
            # 1 stage: get the redirect URL
            async with session.get(
                "https://weibo.com/clairekuo",
                headers=headers,
                allow_redirects=False,
                timeout=timeout,
            ) as response:
                logger.debug(
                    f"1 stage: {'success' if response.status == 302 else 'no 302 redirect, fail!'}"
                )
                location = response.headers.get("Location", "")

            # 2 stage: go to passport visitor page
            headers["Referer"] = location
            async with session.get(
                location,
                headers=headers,
                timeout=timeout,
            ) as response:
                logger.debug(
                    f"2 stage: {'success' if response.status == 200 else 'no 200 response, fail!'}"
                )

            # 3 stage: gen visitor token
            headers["Referer"] = location
            async with session.post(
                "https://passport.weibo.com/visitor/genvisitor2",
                headers=headers,
                data={'cb': 'visitor_gray_callback', 'tid': '', 'from': 'weibo'},
                timeout=timeout,
            ) as response:
                cookies = response.headers.get('set-cookie')
                logger.debug(
                    f"3 stage: {'success' if response.status == 200 and cookies else 'no 200 response and cookies, fail!'}"
                )
        site.headers["Cookie"] = cookies


def import_aiohttp_cookies(cookiestxt_filename):
    cookies_obj = MozillaCookieJar(cookiestxt_filename)
    cookies_obj.load(ignore_discard=True, ignore_expires=True)

    cookies = CookieJar()

    cookies_list = []
    for domain in cookies_obj._cookies.values():  # type: ignore[attr-defined]
        for key, cookie in list(domain.values())[0].items():
            c: Morsel = Morsel()
            c.set(key, cookie.value, cookie.value)
            c["domain"] = cookie.domain
            c["path"] = cookie.path
            cookies_list.append((key, c))

    cookies.update_cookies(cookies_list)

    return cookies
```

### `maigret\ai.py`
```
"""Maigret AI Analysis Module

Provides AI-powered analysis of search results using OpenAI-compatible APIs.
"""

import asyncio
import json
import os
import sys
import threading

import aiohttp


def load_ai_prompt() -> str:
    """Load the AI system prompt from the resources directory."""
    maigret_path = os.path.dirname(os.path.realpath(__file__))
    prompt_path = os.path.join(maigret_path, "resources", "ai_prompt.txt")
    with open(prompt_path, "r", encoding="utf-8") as f:
        return f.read()


def resolve_api_key(settings) -> str | None:
    """Resolve OpenAI API key from settings or environment variable.

    Priority: settings.openai_api_key > OPENAI_API_KEY env var.
    """
    key = getattr(settings, "openai_api_key", None)
    if key:
        return key
    return os.environ.get("OPENAI_API_KEY")


class _Spinner:
    """Simple animated spinner for terminal output."""

    FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]

    def __init__(self, text=""):
        self.text = text
        self._stop = threading.Event()
        self._thread = None

    def start(self):
        self._thread = threading.Thread(target=self._spin, daemon=True)
        self._thread.start()

    def _spin(self):
        i = 0
        while not self._stop.is_set():
            frame = self.FRAMES[i % len(self.FRAMES)]
            sys.stderr.write(f"\r{frame} {self.text}")
            sys.stderr.flush()
            i += 1
            self._stop.wait(0.08)

    def stop(self):
        self._stop.set()
        if self._thread:
            self._thread.join()
        sys.stderr.write("\r\033[2K")
        sys.stderr.flush()


async def print_streaming(text: str, delay: float = 0.04):
    """Print text word by word with a delay, simulating streaming LLM output."""
    words = text.split(" ")
    for i, word in enumerate(words):
        if i > 0:
            sys.stdout.write(" ")
        sys.stdout.write(word)
        sys.stdout.flush()
        await asyncio.sleep(delay)
    sys.stdout.write("\n")
    sys.stdout.flush()


async def _check_response(resp):
    """Raise descriptive errors for non-success HTTP responses."""
    if resp.status == 401:
        raise RuntimeError("Invalid OpenAI API key (HTTP 401)")
    if resp.status == 429:
        raise RuntimeError("OpenAI API rate limit exceeded (HTTP 429)")
    if resp.status != 200:
        body = await resp.text()
        raise RuntimeError(f"OpenAI API error (HTTP {resp.status}): {body[:500]}")


async def _stream_response(resp, spinner, first_token):
    """Stream tokens from resp, display them, and return (first_token, full_analysis)."""
    full_response = []
    async for line in resp.content:
        decoded = line.decode("utf-8").strip()
        if not decoded or not decoded.startswith("data: "):
            continue
        data_str = decoded[len("data: "):]
        if data_str == "[DONE]":
            break
        try:
            chunk = json.loads(data_str)
        except json.JSONDecodeError:
            continue
        delta = chunk.get("choices", [{}])[0].get("delta", {})
        content = delta.get("content", "")
        if not content:
            continue
        if first_token:
            spinner.stop()
            print()
            first_token = False
        sys.stdout.write(content)
        sys.stdout.flush()
        full_response.append(content)
    return first_token, "".join(full_response)


async def get_ai_analysis(
    api_key: str,
    markdown_report: str,
    model: str = "gpt-4o",
    api_base_url: str = "https://api.openai.com/v1",
) -> str:
    """Send the markdown report to an OpenAI-compatible API and return the analysis.

    Uses streaming to display tokens as they arrive.
    Raises on HTTP errors with descriptive messages.
    """
    system_prompt = load_ai_prompt()

    url = f"{api_base_url.rstrip('/')}/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": model,
        "stream": True,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": markdown_report},
        ],
    }

    spinner = _Spinner("Analysing the data with AI...")
    spinner.start()
    first_token = True

    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload, headers=headers) as resp:
                await _check_response(resp)
                first_token, analysis = await _stream_response(resp, spinner, first_token)
    except Exception:
        spinner.stop()
        raise

    if first_token:
        # No tokens received — stop spinner anyway
        spinner.stop()

    print()
    return analysis
```

### `maigret\checking.py`
```
# Standard library imports
import ast
import asyncio
import logging
import os
import random
import re
import ssl
import sys
from typing import Any, Dict, List, Optional, Tuple
from urllib.parse import quote
from maigret.error_detection import ErrorPageDetector

# Third party imports
import aiodns
from alive_progress import alive_bar
from aiohttp import ClientSession, TCPConnector, http_exceptions
from aiohttp.resolver import ThreadedResolver
from aiohttp.client_exceptions import ClientConnectorError, ServerDisconnectedError

try:
    # Added in aiohttp 3.10. When the connector fails specifically because DNS
    # resolution failed (not because the host is unreachable, not because of
    # SSL, not because of a refused connection), it raises this subclass.
    # Keeping it separate lets us give the user actionable advice — "check
    # DNS / internet" rather than the generic "decrease parallelism" hint that
    # applies to genuine connection-pool exhaustion.
    from aiohttp.client_exceptions import ClientConnectorDNSError  # type: ignore
except ImportError:  # aiohttp < 3.10
    ClientConnectorDNSError = None  # type: ignore[assignment,misc]


_DNS_ERROR_MARKERS = (
    "could not contact dns servers",  # aiohttp + aiodns wording
    "name or service not known",       # glibc getaddrinfo
    "nodename nor servname",           # macOS getaddrinfo
    "temporary failure in name resolution",  # glibc EAI_AGAIN
    "getaddrinfo failed",              # generic socket error
)


def _is_dns_error(exc: Exception) -> bool:
    """Classify a ClientConnectorError as DNS-class or not.

    Prefers the aiohttp 3.10+ subclass; falls back to substring matching on
    the exception text for older aiohttp versions where the class doesn't
    exist. The substrings are the OS/aiodns wordings observed in the wild.
    """
    if ClientConnectorDNSError is not None and isinstance(exc, ClientConnectorDNSError):
        return True
    text = str(exc).lower()
    return any(m in text for m in _DNS_ERROR_MARKERS)
from python_socks import _errors as proxy_errors
from socid_extractor import extract  # type: ignore[import-not-found]

try:
    from mock import Mock
except ImportError:
    from unittest.mock import Mock

# Local imports
from . import errors
from .activation import ParsingActivator, import_aiohttp_cookies
from .errors import CheckError
from .executors import AsyncioQueueGeneratorExecutor
from .result import MaigretCheckResult, MaigretCheckStatus, KeywordMatchStatus
from .sites import MaigretDatabase, MaigretSite
from .types import QueryOptions, QueryResultWrapper
from .utils import ascii_data_display, get_random_user_agent, is_plausible_username


SUPPORTED_IDS = (
    "username",
    "yandex_public_id",
    "gaia_id",
    "vk_id",
    "ok_id",
    "wikimapia_uid",
    "steam_id",
    "uidme_uguid",
    "yelp_userid",
)

BAD_CHARS = "#"


def build_cloudflare_bypass_config(
    settings_obj: Optional[Any], force_enable: bool = False
) -> Optional[Dict[str, Any]]:
    """Resolve Cloudflare webgate config from settings + CLI flag.

    Returns ``None`` when bypass is inactive or no usable module is configured.
    Otherwise returns a dict consumed by ``CloudflareWebgateChecker``:

      - ``trigger_protection``: list of ``site.protection`` values that
        activate the bypass (e.g. ``["cf_js_challenge", "cf_firewall", "webgate"]``)
      - ``modules``: ordered list of backend modules to try; each entry has
        ``name``, ``method`` (``json_api`` for FlareSolverr, ``url_rewrite``
        for CloudflareBypassForScraping), and a method-specific ``url`` plus
        optional ``max_timeout_ms``.
      - ``session_prefix``: prefix for FlareSolverr session reuse.
    """
    raw = {}
    if settings_obj is not None:
        raw = getattr(settings_obj, "cloudflare_bypass", {}) or {}
    enabled = bool(force_enable) or bool(raw.get("enabled", False))
    if not enabled:
        return None

    modules_raw = raw.get("modules") or []
    valid_modules: List[Dict[str, Any]] = []
    for module in modules_raw:
        method = module.get("method")
        url = module.get("url")
        if method == "json_api" and url:
            valid_modules.append(dict(module))
        elif method == "url_rewrite" and url and "{url}" in url:
            valid_modules.append(dict(module))
    if not valid_modules:
        return None

    trigger = raw.get("trigger_protection") or [
        "cf_js_challenge",
        "cf_firewall",
        "webgate",
    ]
    return {
        "trigger_protection": list(trigger),
        "modules": valid_modules,
        "session_prefix": raw.get("session_prefix", "maigret"),
    }


class CheckerBase:
    pass


class SimpleAiohttpChecker(CheckerBase):
    def __init__(self, *args, **kwargs):
        self.proxy = kwargs.get('proxy')
        self.cookie_jar = kwargs.get('cookie_jar')
        self.logger = kwargs.get('logger', Mock())
        # 'async' (default) uses aiohttp's DefaultResolver, which is AsyncResolver
        # (powered by aiodns / c-ares) when aiodns is installed. 'threaded' uses
        # ThreadedResolver, which wraps the OS getaddrinfo via a threadpool —
        # slower for high concurrency, but respects the system DNS config
        # (resolv.conf, Windows network adapter settings) instead of having
        # aiodns rediscover it. See issue #2688: aiodns can fail to find any
        # DNS server on Windows / VPN / corporate networks, producing
        # "Could not contact DNS servers" for every site.
        self.dns_resolver = kwargs.get('dns_resolver', 'async')
        self.url = None
        self.headers = None
        self.allow_redirects = True
        self.timeout = 0
        self.method = 'get'
        self.payload = None

    def prepare(self, url, headers=None, allow_redirects=True, timeout=0, method='get', payload=None):
        self.url = url
        self.headers = headers
        self.allow_redirects = allow_redirects
        self.timeout = timeout
        self.method = method
        self.payload = payload
        return None

    async def close(self):
        pass

    async def _make_request(
        self, session, url, headers, allow_redirects, timeout, method, logger, payload=None
    ) -> Tuple[Optional[str], int, Optional[CheckError]]:
        try:
            if method.lower() == 'get':
                request_method = session.get
            elif method.lower() == 'post':
                request_method = session.post
            elif method.lower() == 'head':
                request_method = session.head
            else:
                request_method = session.get

            kwargs = {
                'url': url,
                'headers': headers,
                'allow_redirects': allow_redirects,
                'timeout': timeout,
            }
            if payload and method.lower() == 'post':
                if headers and headers.get('Content-Type') == 'application/x-www-form-urlencoded':
                    kwargs['data'] = payload
                else:
                    kwargs['json'] = payload

            async with request_method(**kwargs) as response:
                status_code = response.status
                response_content = await response.content.read()
                charset = response.charset or "utf-8"
                decoded_content = response_content.decode(charset, "ignore")

... [TRUNCATED] ...
```

### `maigret\db_updater.py`
```
"""
Database auto-update logic for maigret.

Checks a lightweight meta file to determine if a newer site database is available,
downloads it if compatible, and caches it locally in ~/.maigret/.
"""

import hashlib
import json
import logging
import os
import os.path as path
import tempfile
from datetime import datetime, timezone
from typing import Optional

import requests
from colorama import Fore, Style

from .__version__ import __version__

logger = logging.getLogger("maigret")

_use_color = True


def _print_info(msg: str) -> None:
    text = f"[*] {msg}"
    if _use_color:
        print(Style.BRIGHT + Fore.GREEN + text + Style.RESET_ALL)
    else:
        print(text)


def _print_success(msg: str) -> None:
    text = f"[+] {msg}"
    if _use_color:
        print(Style.BRIGHT + Fore.GREEN + text + Style.RESET_ALL)
    else:
        print(text)


def _print_warning(msg: str) -> None:
    text = f"[!] {msg}"
    if _use_color:
        print(Style.BRIGHT + Fore.YELLOW + text + Style.RESET_ALL)
    else:
        print(text)


DEFAULT_META_URL = (
    "https://raw.githubusercontent.com/soxoj/maigret/main/maigret/resources/db_meta.json"
)
DEFAULT_CHECK_INTERVAL_HOURS = 24
MAIGRET_HOME = path.expanduser("~/.maigret")
CACHED_DB_PATH = path.join(MAIGRET_HOME, "data.json")
STATE_PATH = path.join(MAIGRET_HOME, "autoupdate_state.json")
BUNDLED_DB_PATH = path.join(path.dirname(path.realpath(__file__)), "resources", "data.json")


def _parse_version(version_str: str) -> tuple:
    """Parse a version string like '0.5.0' into a comparable tuple (0, 5, 0)."""
    try:
        return tuple(int(x) for x in version_str.strip().split("."))
    except (ValueError, AttributeError):
        return (0, 0, 0)


def _ensure_maigret_home() -> None:
    os.makedirs(MAIGRET_HOME, exist_ok=True)


def _load_state() -> dict:
    try:
        with open(STATE_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError, OSError):
        return {}


def _save_state(state: dict) -> None:
    _ensure_maigret_home()
    tmp_path = STATE_PATH + ".tmp"
    try:
        with open(tmp_path, "w", encoding="utf-8") as f:
            json.dump(state, f, indent=2, ensure_ascii=False)
        os.replace(tmp_path, STATE_PATH)
    except OSError:
        try:
            os.unlink(tmp_path)
        except OSError:
            pass


def _needs_check(state: dict, interval_hours: int) -> bool:
    last_check = state.get("last_check_at")
    if not last_check:
        return True
    try:
        last_dt = datetime.fromisoformat(last_check.replace("Z", "+00:00"))
        elapsed = (datetime.now(timezone.utc) - last_dt).total_seconds() / 3600
        return elapsed >= interval_hours
    except (ValueError, TypeError):
        return True


def _fetch_meta(meta_url: str, timeout: int = 10) -> Optional[dict]:
    try:
        response = requests.get(meta_url, timeout=timeout)
        if response.status_code == 200:
            return response.json()
    except Exception:
        pass
    return None


def _is_version_compatible(meta: dict) -> bool:
    min_ver = meta.get("min_maigret_version", "0.0.0")
    return _parse_version(__version__) >= _parse_version(min_ver)


def _is_update_available(meta: dict, state: dict) -> bool:
    if not path.isfile(CACHED_DB_PATH):
        return True
    remote_date = meta.get("updated_at", "")
    cached_date = state.get("last_meta", {}).get("updated_at", "")
    return remote_date > cached_date


def _download_and_verify(data_url: str, expected_sha256: str, timeout: int = 60) -> Optional[str]:
    _ensure_maigret_home()
    tmp_fd, tmp_path = tempfile.mkstemp(dir=MAIGRET_HOME, suffix=".json")
    try:
        response = requests.get(data_url, timeout=timeout)
        if response.status_code != 200:
            return None

        content = response.content
        actual_sha256 = hashlib.sha256(content).hexdigest()
        if actual_sha256 != expected_sha256:
            _print_warning("DB auto-update: SHA-256 mismatch, download rejected")
            return None

        # Validate JSON structure
        data = json.loads(content)
        if not all(k in data for k in ("sites", "engines", "tags")):
            _print_warning("DB auto-update: invalid database structure")
            return None

        os.write(tmp_fd, content)
        os.close(tmp_fd)
        tmp_fd = None
        os.replace(tmp_path, CACHED_DB_PATH)
        return CACHED_DB_PATH
    except Exception:
        return None
    finally:
        if tmp_fd is not None:
            os.close(tmp_fd)
        try:
            os.unlink(tmp_path)
        except OSError:
            pass


def _best_local() -> str:
    """Return cached DB if it exists and is valid, otherwise bundled."""
    if path.isfile(CACHED_DB_PATH):
        try:
            with open(CACHED_DB_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
            if "sites" in data:
                return CACHED_DB_PATH
        except (json.JSONDecodeError, OSError):
            pass
    return BUNDLED_DB_PATH


def _now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def resolve_db_path(
    db_file_arg: str,
    no_autoupdate: bool = False,
    meta_url: str = DEFAULT_META_URL,
    check_interval_hours: int = DEFAULT_CHECK_INTERVAL_HOURS,
    color: bool = True,
) -> str:
    """
    Determine which database file to use, potentially downloading an update.

    Returns the path to the database file that should be loaded.
    """
    global _use_color
    _use_color = color

    default_db_name = "resources/data.json"

    # User specified a custom DB — skip auto-update

... [TRUNCATED] ...
```

### `maigret\errors.py`
```
from typing import Dict, List, Any, Tuple

from .result import MaigretCheckResult
from .types import QueryResultWrapper


# error got as a result of completed search query
class CheckError:
    _type = 'Unknown'
    _desc = ''

    def __init__(self, typename, desc=''):
        self._type = typename
        self._desc = desc

    def __str__(self):
        if not self._desc:
            return f'{self._type} error'

        return f'{self._type} error: {self._desc}'

    @property
    def type(self):
        return self._type

    @property
    def desc(self):
        return self._desc


COMMON_ERRORS = {
    '<title>Attention Required! | Cloudflare</title>': CheckError(
        'Captcha', 'Cloudflare'
    ),
    '<title>Just a moment</title>': CheckError(
        'Bot protection', 'Cloudflare challenge page'
    ),
    'Please stand by, while we are checking your browser': CheckError(
        'Bot protection', 'Cloudflare'
    ),
    '<span data-translate="checking_browser">Checking your browser before accessing</span>': CheckError(
        'Bot protection', 'Cloudflare'
    ),
    'This website is using a security service to protect itself from online attacks.': CheckError(
        'Access denied', 'Cloudflare'
    ),
    '<title>Доступ ограничен</title>': CheckError('Censorship', 'Rostelecom'),
    'document.getElementById(\'validate_form_submit\').disabled=true': CheckError(
        'Captcha', 'Mail.ru'
    ),
    'Verifying your browser, please wait...<br>DDoS Protection by</font> Blazingfast.io': CheckError(
        'Bot protection', 'Blazingfast'
    ),
    '404</h1><p class="error-card__description">Мы&nbsp;не&nbsp;нашли страницу': CheckError(
        'Resolving', 'MegaFon 404 page'
    ),
    'Доступ к информационному ресурсу ограничен на основании Федерального закона': CheckError(
        'Censorship', 'MGTS'
    ),
    'Incapsula incident ID': CheckError('Bot protection', 'Incapsula'),
    '<title>Client Challenge</title>': CheckError('Bot protection', 'Anti-bot challenge'),
    '<title>DDoS-Guard</title>': CheckError('Bot protection', 'DDoS-Guard'),
    'Сайт заблокирован хостинг-провайдером': CheckError(
        'Site-specific', 'Site is disabled (Beget)'
    ),
    'Generated by cloudfront (CloudFront)': CheckError('Request blocked', 'Cloudflare'),
    '/cdn-cgi/challenge-platform/h/b/orchestrate/chl_page': CheckError(
        'Just a moment: bot redirect challenge', 'Cloudflare'
    ),
}

PROXY_RECOMMENDATION = (
    "it's recommended to use --cloudflare-bypass or proxy, "
    "e.g. https://vaultproxies.net/maigret"
)

ERRORS_TYPES = {
    'Captcha': 'Try to switch to another IP address or to use service cookies',
    'Bot protection': 'Try to switch to another IP address',
    'Access denied': PROXY_RECOMMENDATION,
    'Censorship': 'Switch to another internet service provider',
    'Request timeout': 'Try to increase timeout or to switch to another internet service provider',
    'Connecting failure': 'Check your internet connection; if only a subset of sites fails, try `-n 10` to lower parallelism',
    'Connecting failure (DNS)': (
        'DNS resolution failed for most sites — Maigret\'s async DNS resolver (aiodns) could not contact a server. '
        'First, try `--dns-resolver threaded` to fall back to the system DNS resolver (often fixes this on Windows / VPN / corporate networks). '
        'If that does not help, check your internet connection, VPN, or firewall, and consider a public resolver (1.1.1.1 or 8.8.8.8)'
    ),
    'Webgate unavailable': (
        'cloudflare_bypass is enabled but every configured solver is unreachable. '
        'Verify the URLs under `cloudflare_bypass.modules` in settings.json, and start at least one solver — '
        'most commonly FlareSolverr (`docker run -d -p 8191:8191 ghcr.io/flaresolverr/flaresolverr:latest`). '
        'Or set `cloudflare_bypass.enabled` to false in settings.json (and drop `--cloudflare-bypass`) to skip CF-protected sites'
    ),
}

ERRORS_REASONS = {
    'Login required': 'Add authorization cookies through `--cookies-jar-file` (see cookies.txt)',
}

TEMPORARY_ERRORS_TYPES = [
    'Request timeout',
    'Unknown',
    'Request failed',
    'Connecting failure',
    'Connecting failure (DNS)',
    'Webgate unavailable',
    'HTTP',
    'Proxy',
    'Interrupted',
    'Connection lost',
]

THRESHOLD = 3  # percent — default threshold above which an error type is "important"

# Per-error-type threshold overrides. The default 3% catches systemic issues
# (Captcha, Bot protection) quickly, but for some classes a low percentage is
# expected noise that does NOT mean the user has a fixable problem:
#
# - "Connecting failure (DNS)": a few sites in the database have stale or
#   dead DNS records (sites that shut down). Firing the alarm at 3% means
#   3 dead domains in a 100-site batch produce a Windows/VPN troubleshooting
#   suggestion that is wrong for nearly every user. Wait for ≥10% before
#   nagging — at that rate it's clearly the user's resolver, not data rot.
ERROR_THRESHOLDS: Dict[str, float] = {
    'Connecting failure (DNS)': 10,
}


def threshold_for(err_type: str) -> float:
    return ERROR_THRESHOLDS.get(err_type, THRESHOLD)


def is_important(err_data):
    return err_data['perc'] >= threshold_for(err_data['err'])


def is_permanent(err_type):
    return err_type not in TEMPORARY_ERRORS_TYPES


def detect(text):
    for flag, err in COMMON_ERRORS.items():
        if flag in text:
            return err
    return None


def solution_of(err_type) -> str:
    return ERRORS_TYPES.get(err_type, '')


def extract_and_group(search_res: QueryResultWrapper) -> List[Dict[str, Any]]:
    errors_counts: Dict[str, int] = {}
    for r in search_res.values():
        if r and isinstance(r, dict) and r.get('status'):
            if not isinstance(r['status'], MaigretCheckResult):
                continue

            err = r['status'].error
            if not err:
                continue
            errors_counts[err.type] = errors_counts.get(err.type, 0) + 1

    counts = []
    for err, count in sorted(errors_counts.items(), key=lambda x: x[1], reverse=True):
        counts.append(
            {
                'err': err,
                'count': count,
                'perc': round(count / len(search_res), 2) * 100,
            }
        )

    return counts


def notify_about_errors(
    search_results: QueryResultWrapper, query_notify, show_statistics=False
) -> List[Tuple]:
    """
    Prepare error notifications in search results, to be displayed by the
    notify object. Each notification is a tuple:

    - ``(text, symbol)`` — plain message rendered fully bold/bright
    - ``(text, symbol, advice)`` — header (``text``) is bold, ``advice`` is
      appended in normal weight so the actionable explanation does not
      visually overwhelm the count line. Consumer (``notify.warning``)
      uses ``*tuple`` unpacking; the extra arg is optional there.

    Example::

        [
            ("Too many errors of type \"Connecting failure (DNS)\" (94.0%)",
             "!", "DNS resolution failed for ..."),
            ("Verbose error statistics:", "-"),
        ]
    """
    results = []


... [TRUNCATED] ...
```

### `maigret\error_detection.py`
```
from typing import Optional

from maigret import errors
from maigret.errors import CheckError


class ErrorPageDetector:
    """
    Detect common error states in webpage responses.

    Handles:
    - site-specific failure markers
    - generic provider/bot-protection errors
    - HTTP status-based failures
    """

    def __init__(self, fail_flags=None, ignore_403=False):
        self.fail_flags = fail_flags
        self.ignore_403 = ignore_403

    def detect(
        self,
        html_text: str,
        status_code: int,
    ) -> Optional[CheckError]:
        """
        Detect an error condition from page content and HTTP status.
        """

        # Site-specific restriction markers
        err = self._detect_site_specific(html_text)
        if err:
            return err

        # Generic censorship / bot-protection detection
        err = self._detect_common(html_text)
        if err:
            return err

        # HTTP status-based detection
        return self._detect_http(status_code)

    def _detect_site_specific(
        self,
        html_text: str,
    ) -> Optional[CheckError]:

        # Detect service restrictions such as a country restriction
        for flag, msg in self.fail_flags.items():
            if html_text and flag in html_text:
                return CheckError("Site-specific", msg)

        return None

    def _detect_common(
        self,
        html_text: str,
    ) -> Optional[CheckError]:

        return errors.detect(html_text)

    def _detect_http(
        self,
        status_code: int,
    ) -> Optional[CheckError]:

        # Detect common site errors
        if status_code == 403 and not self.ignore_403:
            return CheckError("Access denied",
                              f"403 status code, {errors.PROXY_RECOMMENDATION}")

        # LinkedIn anti-bot /
        # HTTP 999 workaround. It shouldn't trigger an infrastructure
        # Server Error because it represents a valid "Not Found /
        # Blocked" state for the username.
        elif status_code == 999:
            return None

        # Server-side failure
        elif status_code >= 500:
            return CheckError(
                "Server",
                f"{status_code} status code",
            )

        return None
```

### `maigret\executors.py`
```
import asyncio
import inspect
import sys
import time
from typing import Any, Iterable, List, Callable

import alive_progress
from alive_progress import alive_bar

from .types import QueryDraft


def create_task_func():
    if sys.version_info.minor > 6:
        create_asyncio_task = asyncio.create_task
    else:
        loop = asyncio.get_event_loop()
        create_asyncio_task = loop.create_task
    return create_asyncio_task


class AsyncExecutor:
    # Deprecated: will be removed soon, don't use it
    def __init__(self, *args, **kwargs):
        self.logger = kwargs['logger']

    async def run(self, tasks: Iterable[QueryDraft]):
        start_time = time.time()
        results = await self._run(tasks)
        self.execution_time = time.time() - start_time
        self.logger.debug(f'Spent time: {self.execution_time}')
        return results

    async def _run(self, tasks: Iterable[QueryDraft]):
        await asyncio.sleep(0)


class AsyncioSimpleExecutor(AsyncExecutor):
    # Deprecated: will be removed soon, don't use it
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.semaphore = asyncio.Semaphore(kwargs.get('in_parallel', 100))

    async def _run(self, tasks: Iterable[QueryDraft]):
        async def sem_task(f, args, kwargs):
            async with self.semaphore:
                return await f(*args, **kwargs)

        futures = [sem_task(f, args, kwargs) for f, args, kwargs in tasks]
        return await asyncio.gather(*futures)


class AsyncioProgressbarExecutor(AsyncExecutor):
    # Deprecated: will be removed soon, don't use it
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    async def _run(self, tasks: Iterable[QueryDraft]):
        futures = [f(*args, **kwargs) for f, args, kwargs in tasks]
        total_tasks = len(futures)
        results = []

        # Use alive_bar for progress tracking
        with alive_bar(total_tasks, title='Searching', force_tty=True) as progress:
            # Chunk progress updates for efficiency
            async def track_task(task):
                result = await task
                progress()  # Update progress bar once task completes
                return result

            # Use gather to run tasks concurrently and track progress
            results = await asyncio.gather(*(track_task(f) for f in futures))

        return results


class AsyncioProgressbarSemaphoreExecutor(AsyncExecutor):
    # Deprecated: will be removed soon, don't use it
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.semaphore = asyncio.Semaphore(kwargs.get('in_parallel', 1))

    async def _run(self, tasks: Iterable[QueryDraft]):
        async def _wrap_query(q: QueryDraft):
            async with self.semaphore:
                f, args, kwargs = q
                return await f(*args, **kwargs)

        async def semaphore_gather(tasks: Iterable[QueryDraft]):
            coros = [_wrap_query(q) for q in tasks]
            results = []

            # Use alive_bar correctly as a context manager
            with alive_bar(len(coros), title='Searching', force_tty=True) as progress:
                for f in asyncio.as_completed(coros):
                    results.append(await f)
                    progress()  # Update the progress bar
            return results

        return await semaphore_gather(tasks)


class AsyncioProgressbarQueueExecutor(AsyncExecutor):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.workers_count = kwargs.get('in_parallel', 10)
        self.queue: asyncio.Queue = asyncio.Queue(self.workers_count)
        self.timeout = kwargs.get('timeout')
        # Pass a progress function; alive_bar by default
        self.progress_func = kwargs.get('progress_func', alive_bar)
        self.progress = None

    # TODO: tests
    async def increment_progress(self, count):
        """Update progress by calling the provided progress function."""
        if self.progress:
            if inspect.iscoroutinefunction(self.progress):
                await self.progress(count)
            else:
                self.progress(count)
                await asyncio.sleep(0)

    # TODO: tests
    async def stop_progress(self):
        """Stop the progress tracking."""
        if hasattr(self.progress, "close") and self.progress:
            close_func = self.progress.close
            if inspect.iscoroutinefunction(close_func):
                await close_func()
            else:
                close_func()
                await asyncio.sleep(0)

    async def worker(self):
        """Consume tasks from the queue and process them."""
        while True:
            try:
                f, args, kwargs = self.queue.get_nowait()
            except asyncio.QueueEmpty:
                return

            query_future = f(*args, **kwargs)
            query_task = create_task_func()(query_future)
            try:
                result = await asyncio.wait_for(query_task, timeout=self.timeout)
            except asyncio.TimeoutError:
                result = kwargs.get('default')

            self.results.append(result)

            if self.progress:
                await self.increment_progress(1)

            self.queue.task_done()

    async def _run(self, queries: Iterable[QueryDraft]):
        """Main runner function to execute tasks with progress tracking."""
        self.results: List[Any] = []
        queries_list = list(queries)
        min_workers = min(len(queries_list), self.workers_count)
        workers = [create_task_func()(self.worker()) for _ in range(min_workers)]

        # Initialize the progress bar
        if self.progress_func:
            with self.progress_func(
                len(queries_list), title="Searching", force_tty=True
            ) as bar:
                self.progress = bar  # Assign alive_bar's callable to self.progress

                # Add tasks to the queue
                for t in queries_list:
                    await self.queue.put(t)

                # Wait for tasks to complete
                await self.queue.join()

                # Cancel any remaining workers
                for w in workers:
                    w.cancel()

        return self.results


class AsyncioQueueGeneratorExecutor:
    # Deprecated: will be removed soon, don't use it
    def __init__(self, *args, **kwargs):
        self.workers_count = kwargs.get('in_parallel', 10)
        self.queue: asyncio.Queue = asyncio.Queue()
        self.timeout = kwargs.get('timeout')
        self.logger = kwargs['logger']
        self._results: asyncio.Queue = asyncio.Queue()
        self._stop_signal = object()

    async def worker(self):
        """Process tasks from the queue and put results into the results queue."""
        while True:
            task = await self.queue.get()
            if task is self._stop_signal:
                self.queue.task_done()
                break

... [TRUNCATED] ...
```

### `maigret\extractors.py`
```
import ast

from maigret.utils import is_plausible_username


def extract_usernames(info, logger):
    """
    Extract plausible usernames from socid_extractor results.

    Supports:
    - single username fields (e.g. "profile_username")
    - serialized username lists (e.g. "other_usernames")

    Invalid values such as URLs or emails are ignored.
    """
    results = []

    for key, value in info.items():

        # Single username field
        if "username" in key and "usernames" not in key:

            if is_plausible_username(value):
                results.append(value)
            else:
                logger.debug(
                    f"Rejected non-username value extracted "
                    f"under key {key!r}: {value!r}"
                )
        # Serialized username list field
        elif "usernames" in key:

            try:
                parsed = ast.literal_eval(value)

                if isinstance(parsed, list):
                    for item in parsed:

                        if is_plausible_username(item):
                            results.append(item)
                        else:
                            logger.debug(
                                f"Rejected non-username item "
                                f"from list under key {key!r}: {item!r}"
                            )
            except Exception as e:
                logger.warning(e)

    return results
```
