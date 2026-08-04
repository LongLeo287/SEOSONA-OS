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
import http.client
import ipaddress
import socket
import urllib.request
import urllib.error
from urllib.parse import urlparse, urljoin


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


def _validated_ips(host: str, port: int):
    """Resolve ``host`` and return the list of ``(family, ip_str)`` it maps to, raising
    ``UnsafeURLError`` if ANY resolved address is non-public. Returning the concrete IPs lets the
    caller pin the exact address it validated into the socket (see ``safe_urlopen``), so a DNS
    answer that flips to an internal IP between the check and the fetch (rebinding) can't take hold.
    """
    try:
        infos = socket.getaddrinfo(host, port)
    except socket.gaierror as e:
        raise UnsafeURLError(f"could not resolve host {host!r}: {e}")

    ips = []
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
        ips.append((info[0], addr))
    if not ips:
        raise UnsafeURLError(f"host {host!r} resolved to no usable IP address")
    return ips


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

    _validated_ips(host, parsed.port or (443 if parsed.scheme == "https" else 80))
    return url


class _ValidatingRedirectHandler(urllib.request.HTTPRedirectHandler):
    """Re-run the SSRF guard on every 3xx target before following it.

    A standalone primitive (``safe_urlopen`` below uses a stronger pin-and-follow loop instead):
    ``assert_safe_url`` on the initial URL alone is not enough because a public URL can 302 to
    ``http://169.254.169.254/``. This handler validates ``newurl`` and lets a rejection propagate
    as ``UnsafeURLError`` before the redirect is followed.
    """

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        assert_safe_url(newurl)
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def _pinned_connection_class(base, ip):
    """Subclass an http.client connection so its socket connects to a FIXED ``ip`` while keeping
    ``self.host`` (the real hostname) for the ``Host`` header and TLS SNI/cert validation. This is
    what defeats DNS rebinding: we resolve+validate once, then connect to exactly that address —
    the name is never re-resolved between check and fetch."""
    is_https = issubclass(base, http.client.HTTPSConnection)

    class _Pinned(base):
        def connect(self):
            sock = socket.create_connection((ip, self.port), self.timeout, self.source_address)
            if is_https:
                if self._tunnel_host:
                    self.sock = sock
                    self._tunnel()
                    sock = self.sock
                    server_hostname = self._tunnel_host
                else:
                    server_hostname = self.host
                self.sock = self._context.wrap_socket(sock, server_hostname=server_hostname)
            else:
                self.sock = sock
                if self._tunnel_host:
                    self._tunnel()

    return _Pinned


class _PinnedHTTPHandler(urllib.request.HTTPHandler):
    def __init__(self, ip):
        super().__init__()
        self._ip = ip

    def http_open(self, req):
        return self.do_open(_pinned_connection_class(http.client.HTTPConnection, self._ip), req)


class _PinnedHTTPSHandler(urllib.request.HTTPSHandler):
    def __init__(self, ip, context=None):
        super().__init__(context=context)
        self._ip = ip

    def https_open(self, req):
        return self.do_open(
            _pinned_connection_class(http.client.HTTPSConnection, self._ip), req,
            context=self._context, check_hostname=self._check_hostname,
        )


_REDIRECT_CODES = (301, 302, 303, 307, 308)
# Headers that must never survive a cross-origin redirect — otherwise a 302 hands the caller's
# credentials to whatever host the attacker names in Location.
_AUTH_HEADERS = {"authorization", "cookie", "proxy-authorization", "api-opr", "x-api-key"}


class _RaiseOnRedirect(urllib.request.HTTPRedirectHandler):
    """Turn 3xx into an HTTPError instead of following it.

    ``build_opener`` installs the stock ``HTTPRedirectHandler`` unless one is supplied, and that
    handler consumes redirects *inside* ``opener.open()``. Passing only a pinned transport handler
    therefore left redirects being followed automatically, with no re-validation and no pinning —
    the manual hop loop below could never run. This subclass makes every 3xx surface to the caller
    so that loop is the only thing that follows redirects.
    """

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def safe_urlopen(url_or_req, *, timeout=30, context=None, max_redirects=5, **kwargs):
    """SSRF-hardened drop-in for ``urllib.request.urlopen``.

    For every hop it (1) validates the URL's host resolves only to public IPs, (2) pins the socket
    to the exact IP it just validated — so a rebinding DNS answer can't swap in an internal address
    between check and connect — and (3) follows redirects MANUALLY, re-validating + re-pinning each
    3xx target (a public URL 302-ing to ``169.254.169.254`` is blocked). The ``Host`` header and TLS
    SNI always use the real hostname, so name-based vhosts and cert validation work normally.

    Accepts a URL string or a ``Request``; an optional ``context`` (ssl.SSLContext) is honoured.
    In local-dev mode (``SEOSONA_ALLOW_PRIVATE_URLS=1``) it skips pinning and delegates to plain
    ``urlopen`` so LAN/localhost testing still works.
    """
    if isinstance(url_or_req, urllib.request.Request):
        req0 = url_or_req
    else:
        req0 = urllib.request.Request(url_or_req)

    if _allow_private():
        return urllib.request.urlopen(req0, timeout=timeout, **kwargs)

    url = req0.full_url
    method = req0.get_method()
    data = req0.data
    headers = dict(req0.header_items())

    for _ in range(max_redirects + 1):
        parsed = urlparse(url)
        if parsed.scheme not in ("http", "https"):
            raise UnsafeURLError(f"unsupported scheme: {parsed.scheme!r} (only http/https allowed)")
        host = parsed.hostname
        if not host:
            raise UnsafeURLError("URL has no host")
        port = parsed.port or (443 if parsed.scheme == "https" else 80)
        ip = _validated_ips(host, port)[0][1]   # raises if any resolved address is non-public

        # Pin BOTH transports every hop and suppress automatic redirects. Installing only the
        # scheme of the current hop left the other scheme on its stock, unpinned, unvalidated
        # handler — so a single `http -> https` redirect escaped the guard entirely.
        opener = urllib.request.build_opener(
            _RaiseOnRedirect(),
            _PinnedHTTPHandler(ip),
            _PinnedHTTPSHandler(ip, context),
        )
        hop = urllib.request.Request(url, data=data, headers=headers, method=method)
        try:
            return opener.open(hop, timeout=timeout, **kwargs)   # 2xx -> done
        except urllib.error.HTTPError as e:
            if e.code not in _REDIRECT_CODES:
                raise                                            # 4xx/5xx propagate like urlopen
            location = e.headers.get("Location")
            e.close()
            if not location:
                raise
            nxt = urljoin(url, location)
            nxt_parsed = urlparse(nxt)
            # Location may name any scheme; ftp:/file:/gopher: would leave the validated transports.
            if nxt_parsed.scheme not in ("http", "https"):
                raise UnsafeURLError(
                    f"refusing redirect to unsupported scheme {nxt_parsed.scheme!r} ({nxt})"
                )
            # Strip credentials when the origin changes — a redirect must not leak the caller's
            # auth to a host it never chose to talk to.
            same_origin = (nxt_parsed.scheme == parsed.scheme
                           and nxt_parsed.hostname == parsed.hostname
                           and (nxt_parsed.port or 0) == (parsed.port or 0))
            if not same_origin:
                headers = {k: v for k, v in headers.items() if k.lower() not in _AUTH_HEADERS}
            url = nxt
            # 303 (and legacy 302-after-POST) downgrade to GET; 307/308 preserve method + body.
            if e.code == 303 or (e.code == 302 and method == "POST"):
                method = "GET"
                data = None

    raise UnsafeURLError(f"too many redirects (> {max_redirects})")
