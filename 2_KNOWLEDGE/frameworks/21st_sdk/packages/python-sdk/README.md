# 21st-sdk Python

Server-side Python SDK for [21st Agents](https://21st.dev/agents). Manage sandboxes, threads, and tokens programmatically.

Method arguments use Python-style `snake_case`, but SDK responses keep the relay's `camelCase` field names.

## Install

```bash
pip install 21st-sdk
```

## Quick Start

```python
import os

from twentyfirst_sdk import AgentClient

client = AgentClient(api_key=os.environ["API_KEY_21ST"])  # 21st_sk_...

# Create a sandbox for your agent
sandbox = client.sandboxes.create(agent="my-agent")

# Create a thread
thread = client.threads.create(sandbox_id=sandbox.id, name="Review PR #42")

# Generate a short-lived token for browser clients
token = client.tokens.create(agent="my-agent", expires_in="1h")
print(token.expiresAt)
```

## API

### `AgentClient(api_key, base_url=...)`

```python
AgentClient(
    api_key="...",   # Your 21st_sk_ API key
    base_url="...",  # Optional, default: "https://relay.an.dev"
)
```

### `client.sandboxes`

| Method | Description |
|--------|-------------|
| `create(agent=...)` | Create a new sandbox for an agent |
| `get(sandbox_id)` | Get sandbox details (status, threads, agent info) |
| `delete(sandbox_id)` | Delete a sandbox |
| `exec(sandbox_id, command, ...)` | Run a command in a sandbox |
| `files.write(sandbox_id, files)` | Write files into a sandbox |
| `files.read(sandbox_id, path)` | Read a file from a sandbox |
| `files.list(sandbox_id, path, depth=...)` | List files and directories under a path |
| `files.get_info(sandbox_id, path)` | Get metadata for one file or directory |
| `files.exists(sandbox_id, path)` | Check whether a file or directory exists |
| `files.make_dir(sandbox_id, path)` | Create a directory path |
| `files.rename(sandbox_id, old_path, new_path)` | Rename or move a file or directory |
| `files.remove(sandbox_id, path)` | Remove a file or directory |
| `git.clone(sandbox_id, url, ...)` | Clone a repository into a sandbox |

### `client.threads`

| Method | Description |
|--------|-------------|
| `list(sandbox_id)` | List all threads in a sandbox |
| `create(sandbox_id, name=...)` | Create a new thread |
| `get(sandbox_id, thread_id)` | Get thread with messages |
| `delete(sandbox_id, thread_id)` | Delete a thread |
| `run(agent, messages, ...)` | Run a thread and return the raw streaming response |

### `client.tokens`

| Method | Description |
|--------|-------------|
| `create(agent=..., user_id=..., expires_in=...)` | Create a short-lived JWT (default: `"1h"`) |

## License

MIT
