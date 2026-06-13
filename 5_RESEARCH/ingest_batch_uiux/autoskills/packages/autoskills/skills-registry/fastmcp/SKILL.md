---
name: fastmcp
description: Production patterns for FastMCP Python MCP servers. Use when writing, improving, or debugging FastMCP Python code — tool schema design, multi-operation tools, pre-formatted output, Context usage, middleware, lifespan and startup/shutdown hooks, partial failure handling, running and deploying, async patterns, in-process testing with fastmcp.Client, and common mistakes. Do NOT activate for general questions about what MCP is, MCP concepts, or building an MCP server from scratch (use mcp-builder for that).
license: Apache-2.0
metadata:
  version: "1.3"
  spec: "agentskills.io"
  fastmcp_version: ">=3.0"
---

# FastMCP — Production Patterns

[FastMCP](https://github.com/jlowin/fastmcp) (v3.x) is the standard Python framework for building MCP servers. This skill covers production patterns verified against the real FastMCP API — applicable to any domain: databases, REST APIs, file systems, Git, Slack, email, or any external service.

## When to use

- Writing new tools or prompts in an existing FastMCP server
- Improving tool schemas, output formatting, or error messages
- Adding middleware, lifespan hooks, or lifecycle management
- Running and deploying FastMCP servers (transport choices)
- Testing FastMCP tools with the built-in `Client`
- Debugging failing tool calls or silent errors
- Handling partial failures across multiple external calls

**Do NOT use for:** general MCP questions, MCP protocol explanation, or scaffolding a new server from scratch (use mcp-builder skill instead).

---

## Running the Server

FastMCP 3.x provides built-in run methods. Steps to deploy:

1. Define your tools, middleware, and lifespan (see sections below)
2. Create the `FastMCP` instance
3. Call `mcp.run()` with the right transport for your use case
4. Wrap in `if __name__ == "__main__":`

**Transport choices:**

| Transport | When to use | How |
|---|---|---|
| `stdio` (default) | Local agents: Claude Desktop, Cursor, CLI tools | `mcp.run()` |
| `streamable-http` | Remote/cloud agents, multi-user servers | `mcp.run(transport="streamable-http", host="0.0.0.0", port=8000)` |
| `sse` | Older clients that don't support streamable-http | `mcp.run(transport="sse", port=8000)` |

```python
if __name__ == "__main__":
    mcp.run()  # stdio — for local agents
    # mcp.run(transport="streamable-http", host="0.0.0.0", port=8000)  # HTTP
```

---

## Server Setup

Define tools and middleware before creating the server. Register tools in an explicit method — keeps `__init__` readable:

```python
import time, logging
from fastmcp import FastMCP, Context
from fastmcp.server.middleware import Middleware
from contextlib import asynccontextmanager
from typing import Optional, Any
import httpx

# Define middleware BEFORE using it in the server class
class ToolLoggingMiddleware(Middleware):
    async def on_call_tool(self, context, call_next):
        logger = logging.getLogger(__name__)
        t0 = time.perf_counter()
        tool_name = context.message.name
        arg_keys = list((context.message.arguments or {}).keys())
        elapsed = None
        try:
            result = await call_next(context)
            elapsed = time.perf_counter() - t0
            logger.info("tool=%s keys=%s elapsed=%.3fs", tool_name, arg_keys, elapsed)
            return result
        except Exception as e:
            elapsed = time.perf_counter() - t0
            logger.error("tool=%s FAILED keys=%s elapsed=%.3fs error=%s",
                         tool_name, arg_keys, elapsed, e)
            raise

@asynccontextmanager
async def lifespan(server: FastMCP):
    client = httpx.AsyncClient(base_url="https://api.example.com")
    yield {"client": client}       # yield a dict — tools access via ctx.lifespan_context
    await client.aclose()

class MyMCPServer:
    def __init__(self):
        self.mcp = FastMCP("my-server", lifespan=lifespan)
        self.mcp.add_middleware(ToolLoggingMiddleware())
        self._register_tools()
        self._register_prompts()

    def _register_tools(self) -> None:
        self.mcp.tool()(get_record)
        self.mcp.tool()(list_records)

    def _register_prompts(self) -> None:
        @self.mcp.prompt()
        def workflow_guide() -> str:
            """Get the recommended workflow for using this server's tools."""
            return (
                "## Workflow\n"
                "1. Call list_records to discover available records.\n"
                "2. Call get_record with a specific ID for details.\n"
            )
```

---

## Lifespan — Startup and Shutdown

**Real API: yield a dict, access via `ctx.lifespan_context` in tools.**

Two equivalent patterns — both verified working in FastMCP 3.x. Both require `Optional[Context]` type hint on tool params (without it `ctx` is always `None` — see Common Mistakes):

```python
from contextlib import asynccontextmanager          # Option A
from fastmcp.server.lifespan import lifespan        # Option B (FastMCP 3.x native)
```

```python
import os, httpx
from contextlib import asynccontextmanager
from fastmcp import FastMCP

@asynccontextmanager
async def lifespan(server: FastMCP):
    client = httpx.AsyncClient(base_url=os.environ["API_BASE_URL"], timeout=30.0)
    yield {"client": client, "cache": {}}  # ← yield state as a dict
    await client.aclose()

mcp = FastMCP("my-server", lifespan=lifespan)
```

Access in any tool via `ctx.lifespan_context`:

```python
async def get_record(record_id: str, ctx: Optional[Context] = None) -> dict:
    """Fetch a record from the external API by ID."""
    if ctx is None:
        raise RuntimeError("get_record requires a live MCP session (use Client(mcp) in tests)")
    client = ctx.lifespan_context["client"]
    response = await client.get(f"/records/{record_id}")
    response.raise_for_status()
    data = response.json()
    return {
        "status": "success",
        "data": data,
        "output": f"**{data.get('name', record_id)}**\n{data.get('description', '')}",
    }
```

**Tools that depend on lifespan state cannot use `ctx=None` in unit tests.** Use `Client(mcp)` for those — it runs the full lifespan.

---

## Tool Registration

### The docstring IS the schema

The docstring becomes what the LLM sees when deciding whether to call the tool. Write it for the LLM:

```python
async def create_issue(
    title: str, body: str, repo: str,
    labels: Optional[list[str]] = None,
    ctx: Optional[Context] = None,
) -> dict[str, Any]:
    """Create a GitHub issue in a repository.

    Use when the user asks to create, open, or file a new issue.

    Args:
        repo: Repository in owner/name format (e.g., 'org/myrepo')
        labels: Call list_labels first — labels are case-sensitive.

    Limits: Do not call more than once per turn without explicit confirmation.
    """
    return {"status": "success", "data": {}, "output": "Created issue #42"}
```

**Rules:** first line = what + when to call; `Args:` = valid values and dependencies; `Limits:` = for irreversible tools; never state what the LLM already knows.

### Context

`ctx` position (first or last) does not affect FastMCP's schema — put it last by convention. FastMCP automatically strips `ctx` from the tool's inputSchema so the LLM never sees it.

---

## Multi-Operation Tool Pattern

Combine related operations into one tool with an `operation` parameter. Applies to any backend:

```python
async def issue_tool(
    operation: str = "list",
    issue_id: Optional[str] = None,
    title: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 20,
    ctx: Optional[Context] = None,
) -> dict[str, Any]:
    """Issue tracker operations: list, get, create, schema.

    operation='list'   — List issues with optional status filter.
    operation='get'    — Get a single issue by ID. Requires: issue_id.
    operation='create' — Create a new issue. Requires: title.
    operation='schema' — Get valid status values and field descriptions.

    Workflow: call schema first to see valid status values,
              then list or get issues using exact values.
    """
    if operation == "list":
        return await _list_issues(status, limit, ctx)    # ← your implementation
    elif operation == "get":
        if not issue_id:
            return {"status": "error", "error": "'issue_id' is required for get."}
        return await _get_issue(issue_id, ctx)            # ← your implementation
    elif operation == "create":
        if not title:
            return {"status": "error", "error": "'title' is required for create."}
        return await _create_issue(title, ctx)            # ← your implementation
    elif operation == "schema":
        return {"status": "success", "data": {"status_values": ["open", "closed"]},
                "output": "Valid statuses: open, closed"}
    else:
        return {
            "status": "error",
            "error": f"Unknown operation '{operation}'. Valid: list, get, create, schema.",
        }
```

**When to use multi-operation vs separate tools:** same backend + related ops → multi-operation; one op must precede another → multi-operation; more than 5 ops with very different params → split.

---

## Output Formatting

Return a pre-formatted `output` field alongside structured `data`. This applies to any domain:

```python
def _format_records(records: list[dict], entity_name: str) -> str:
    """Format a list of records for display. Works for any entity type."""
    if not records:
        return f"No {entity_name}s found."
    lines = [f"**Found {len(records)} {entity_name}(s):**\n"]
    for r in records:
        lines.append(f"- **{r.get('name', r.get('id', '?'))}** ({r.get('id', '')})")
    return "\n".join(lines)

async def list_records(entity_type: str, ctx: Optional[Context] = None) -> dict:
    """List records of a given type."""
    data = await _fetch_records(entity_type, ctx)    # ← your implementation
    return {
        "status": "success",
        "count": len(data),
        "data": data,                                          # structured, for chaining
        "output": _format_records(data, entity_type),         # pre-formatted, for display
    }
```

In your skill or prompt: *"Display the `output` field content verbatim. Do not reformat the `data` field."*

### Consistent return shapes — always the same top-level keys:

```python
{"status": "success", "output": "...", "data": {...}}          # success
{"status": "error",   "error":  "..."}                        # failure
{"status": "partial", "output": "...", "data": [...], "errors": [...]}  # partial success
```

**Note:** `"partial"` is a project convention, not a FastMCP framework concept.

**Always return a `dict`.** FastMCP accepts any return type (string, int, None), but `result.data` in tests will be that raw value — `result.data["status"]` will raise `TypeError` for non-dict returns. Consistent dict returns make testing predictable.

### Error messages that guide the agent:

```python
# Weak
{"status": "error", "error": "Label 'bug' not found"}

# Strong — tells the agent what to do next
{
    "status": "error",
    "error": "Label 'bug' not found in 'org/myrepo'. "
             "Call operation='schema' to list available labels, "
             "then retry with an exact match."
}
```

---

## Partial Failure Handling

When a tool makes multiple external calls and one fails, aggregate results rather than failing entirely:

```python
async def aggregate_from_services(query: str, ctx: Optional[Context] = None) -> dict:
    """Aggregate data from multiple services. Returns partial results if any source fails."""
    results = {}
    errors = []

    # Call 1: primary service — hard failure aborts
    try:
        results["primary"] = await fetch_from_primary(query, ctx)    # ← your implementation
    except Exception as e:
        return {"status": "error", "error": f"Primary service unavailable: {e}"}

    # Call 2: supplementary — soft failure, continue without it
    try:
        results["supplementary"] = await fetch_from_secondary(query, ctx)  # ← your implementation
    except Exception as e:
        results["supplementary"] = None
        errors.append(f"Supplementary service unavailable: {e}")

    # Call 3: enrichment — soft failure, continue without it
    try:
        results["enrichment"] = await fetch_enrichment(query, ctx)   # ← your implementation
    except Exception as e:
        results["enrichment"] = None
        errors.append(f"Enrichment service unavailable: {e}")

    output = _format_aggregated(results)    # ← your implementation
    if errors:
        output += f"\n\n**Partial failures:** {'; '.join(errors)}"

    return {"status": "partial" if errors else "success",
            "data": results, "errors": errors, "output": output}
```

**Rules:** hard failure → abort immediately; soft failure → `None` + record error; surface errors in `output`; `"partial"` is a project convention, not a FastMCP framework value.

---

## Middleware

FastMCP 3.x **validates tool parameters strictly before the tool runs**. There is no way to strip unknown parameters in middleware — validation happens before middleware fires. The fix is always in tool design: write clear docstrings so the LLM only sends params defined in your schema.

Use middleware for cross-cutting concerns: logging, timing, auth token injection, response transformation.

**Real middleware context API (FastMCP 3.x):**
- Tool name: `context.message.name`
- Tool arguments: `context.message.arguments` (a dict or None)
- FastMCP server: `context.fastmcp_context.fastmcp`

### Logging middleware — capture elapsed on both success AND error paths:

```python
import time, logging
from fastmcp.server.middleware import Middleware

class ToolLoggingMiddleware(Middleware):
    async def on_call_tool(self, context, call_next):
        logger = logging.getLogger(__name__)
        t0 = time.perf_counter()
        tool_name = context.message.name
        arg_keys = list((context.message.arguments or {}).keys())
        elapsed = None
        try:
            result = await call_next(context)
            elapsed = time.perf_counter() - t0
            logger.info("tool=%s keys=%s elapsed=%.3fs", tool_name, arg_keys, elapsed)
            return result
        except Exception as e:
            elapsed = time.perf_counter() - t0          # ← capture elapsed on error too
            logger.error("tool=%s FAILED keys=%s elapsed=%.3fs error=%s",
                         tool_name, arg_keys, elapsed, e)
            raise
```

**Log keys, not values** — values may contain tokens, passwords, or PII.

---

## Async Patterns

All tools making I/O calls must be `async`. For blocking library functions: `result = await asyncio.to_thread(blocking_fn, arg)`.

---

## Testing

**Two levels — always use both:**

**Level 1: Direct function call** (fast, no server needed, use `ctx=None`):
```python
@pytest.mark.asyncio
async def test_create_requires_title():
    result = await issue_tool(operation="create")   # missing title
    assert result["status"] == "error"
    assert "title" in result["error"].lower()
    assert "Valid:" in result["error"] or len(result["error"]) > 20
```

**Level 2: In-process `Client(mcp)`** (tests full MCP protocol, runs lifespan):
```python
from fastmcp import Client

@pytest.mark.asyncio
async def test_schema_and_call():
    async with Client(mcp) as client:
        tools = await client.list_tools()
        props = {t.name: t.inputSchema.get("properties", {}) for t in tools}
        assert "ctx" not in props["get_record"]          # ctx never exposed to LLM
        result = await client.call_tool("get_record", {"record_id": "rec123"})
        assert result.is_error is False
        assert isinstance(result.data, dict)             # always return dict
        assert result.data["status"] in ("success", "error", "partial")
        assert "output" in result.data
```

`Client(mcp)` runs in-process — no HTTP server, no port, runs the full lifespan. See [references/testing.md](references/testing.md) for the complete guide including partial-failure and error-path testing.

---

## Common Mistakes

**Making Context optional without a default** — forces `ctx=None` in every test:
```python
# Wrong                                       # Right
async def get_record(id: str, ctx: Context):  async def get_record(id: str, ctx: Optional[Context] = None):
```

**Registering tools at module level** — makes mocking harder:
```python
# Wrong                     # Right
@mcp.tool()                 def _register_tools(self):
async def get_record(): ... →   self.mcp.tool()(get_record)
```

**Hardcoding valid values in docstrings** — goes stale silently for any domain:
```python
# Wrong
"""status: One of 'open', 'closed', 'in_progress'"""

# Right
"""status: Use operation='schema' to get current valid status values."""
```

**Returning non-dict types** — breaks `result.data["status"]` in tests:
```python
# Wrong — result.data is a str, result.data["status"] raises TypeError
async def get_record(id: str) -> str:
    return f"Record: {id}"

# Right — always return a dict
async def get_record(id: str) -> dict:
    return {"status": "success", "data": {"id": id}, "output": f"Record: {id}"}
```

**Leaking raw exceptions to the agent**:
```python
# Wrong — leaks internals, no guidance
except Exception as e:
    return {"error": str(e), "traceback": traceback.format_exc()}

# Right — clean message for agent, full details in server logs
except Exception as e:
    logger.error("get_record failed for %s", record_id, exc_info=True)
    return {"status": "error", "error": "Failed to fetch record. Check the ID and try again."}
```

**Using `server.state` in lifespan** — `FastMCP` has no `state` attribute:
```python
# Wrong — AttributeError: 'FastMCP' object has no attribute 'state'
async def lifespan(server):
    server.state.pool = await create_pool()
    yield

# Right — yield state dict, access via ctx.lifespan_context
async def lifespan(server):
    pool = await create_pool()
    yield {"pool": pool}
# In tools: pool = ctx.lifespan_context["pool"]
```

**Using `on_startup`/`on_shutdown`** — does not exist in FastMCP v2+. Use `lifespan`.

**Logging parameter values in middleware** — may contain secrets:
```python
# Wrong
logger.info("args: %s", context.message.arguments)

# Right — log only keys
logger.info("tool=%s keys=%s", context.message.name,
            list((context.message.arguments or {}).keys()))
```

**Dropping the `Optional[Context]` type hint** — FastMCP injects Context based on the type annotation. `ctx=None` without `Optional[Context]` means ctx is always `None` even via `Client(mcp)`. The type hint is required:
```python
# Wrong                                      # Right
async def get_record(id: str, ctx=None):     async def get_record(id: str, ctx: Optional[Context] = None):
```

**Accessing wrong attributes in middleware** — middleware context is `MiddlewareContext`. Use `context.message.name` and `context.message.arguments`, not `context.name` / `context.arguments` (those raise `AttributeError`).
