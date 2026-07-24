"""
SEOSONA OS — URL Guard (SSRF defense)

Validates that an outbound URL is safe to fetch:
  - scheme must be http/https
  - host must resolve to a public IP (no loopback, private, link-local,
    or cloud metadata addresses such as 169.254.169.254)

Set SEOSONA_ALLOW_PRIVATE_URLS=1 to bypass the private-IP check for local
development (e.g. testing against a WordPress instance on localhost/LAN).
"""

import os
import ipaddress
import socket
import urllib.request
import urllib.error
from urllib.parse import urlparse


class UnsafeURLError(ValueError):
    """Raised when a URL is rejected by the SSRF guard."""


def _allow_private() -> bool:
    return os.getenv("SEOSONA_ALLOW_PRIVATE_URLS", "").strip() in ("1", "true", "yes")


def _ip_is_blocked(ip: ipaddress._BaseAddress) -> bool:
    return (
        ip.is_loopback
        or ip.is_private
        or ip.is_link_local
        or ip.is_reserved
        or ip.is_multicast
        or ip.is_unspecified
    )


def assert_safe_url(url: str) -> str:
    """Return the URL if safe to fetch, else raise UnsafeURLError."""
    if not url or not isinstance(url, str):
        raise UnsafeURLError("empty or non-string URL")

    parsed = urlparse(url)
    if parsed.scheme not in ("http", "https"):
        raise UnsafeURLError(f"unsupported scheme: {parsed.scheme!r} (only http/https allowed)")

    host = parsed.hostname
    if not host:
        raise UnsafeURLError("URL has no host")

    if _allow_private():
        return url

    # Resolve every address the host maps to and block if any is non-public.
    try:
        infos = socket.getaddrinfo(host, parsed.port or (443 if parsed.scheme == "https" else 80))
    except socket.gaierror as e:
        raise UnsafeURLError(f"could not resolve host {host!r}: {e}")

    for info in infos:
        addr = info[4][0]
        try:
            ip = ipaddress.ip_address(addr)
        except ValueError:
            continue
        if _ip_is_blocked(ip):
            raise UnsafeURLError(
                f"host {host!r} resolves to non-public address {addr} "
                f"(set SEOSONA_ALLOW_PRIVATE_URLS=1 to override for local dev)"
            )

    return url


class _ValidatingRedirectHandler(urllib.request.HTTPRedirectHandler):
    """Re-run the SSRF guard on every 3xx target before following it.

    ``assert_safe_url`` on the initial URL is not enough: a public URL can 302 to
    ``http://169.254.169.254/`` or ``http://localhost/``. urllib follows redirects
    automatically, so without this the guard is bypassed on the second hop. Here we
    validate ``newurl`` and let a rejection propagate as ``UnsafeURLError``.
    """

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        assert_safe_url(newurl)
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def safe_urlopen(url_or_req, *, timeout=30, context=None, **kwargs):
    """SSRF-hardened drop-in for ``urllib.request.urlopen``.

    Validates the initial URL (and, via the opener, every redirect hop) against the
    guard before any bytes are fetched. Accepts a URL string or a ``Request``; an
    optional ``context`` (ssl.SSLContext) is honoured like ``urlopen``'s, and any
    other kwargs pass through to ``opener.open``. Use this instead of
    ``urllib.request.urlopen`` anywhere the target host is influenced by external data.
    """
    if isinstance(url_or_req, urllib.request.Request):
        req = url_or_req
        target = req.full_url
    else:
        target = url_or_req
        req = urllib.request.Request(url_or_req)

    assert_safe_url(target)
    handlers = [_ValidatingRedirectHandler()]
    if context is not None:
        handlers.append(urllib.request.HTTPSHandler(context=context))
    opener = urllib.request.build_opener(*handlers)
    return opener.open(req, timeout=timeout, **kwargs)
