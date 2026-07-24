---
name: "seekdb"
description: "Historic standalone skill"
keywords: ["seekdb", "ingested"]
mcp_compatible: true
---

# SeekDB

## Overview
SeekDB is an embedded or server-based State Store for AI Agents. It is MySQL-compatible, built on the OceanBase SQL engine, and designed specifically for Agentic AI memory, sandbox, and state management.

## Core Features
- **Streaming Write + Concurrent Search:** Handles continuous memory writes and millisecond-later retrieval without P99 spikes. Uses an async index pipeline (Change Stream) and two-level HNSW (incremental + snapshot). Performance: 1,523 QPS streaming write+search.
- **COW Sandboxes:** `FORK DATABASE` allows agents to snapshot an entire database instantly (Copy-on-Write) for safe experimentation. Agents can then `MERGE TABLE` to accept the work or `DROP DATABASE` to discard.
- **Hybrid Search in Single SQL:** Combines vector similarity, full-text match, and scalar filters into one execution plan.
- **MySQL Compatibility:** Full ACID compliance, works seamlessly with MySQL drivers, LangChain, LlamaIndex, Dify, etc.
- **Embeddable:** Runs in-process via Python (`pyseekdb`) or as a standalone server/Docker container.

## Architecture
Decouples DML from index build. The write path commits without waiting on index construction. The Change Stream pipeline consumes the redo log asynchronously to update the delta HNSW.

*Source: github.com/oceanbase/seekdb*
