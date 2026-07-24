---
name: "langchain_langgraph"
description: "Historic standalone skill"
keywords: ["langchain_langgraph", "ingested"]
mcp_compatible: true
---

# LangChain & LangGraph

## LangChain Overview
LangChain is a high-level framework for building agents and LLM-powered applications. It provides interoperable components to connect models to data sources and external systems.

### Core Features
- **Real-time data augmentation:** Connect LLMs to diverse data sources.
- **Model interoperability:** Swap models in and out easily.
- **Deep Agents:** Higher-level package built on LangChain for agents capable of planning and subagent usage.

## LangGraph Overview
LangGraph is a low-level orchestration framework for building, managing, and deploying long-running, stateful agents. It is the underlying infrastructure that powers robust LLM workflows.

### Core Features
- **Durable execution:** Agents persist through failures and resume from where they left off.
- **Human-in-the-loop:** Incorporate human oversight and interrupt/modify state.
- **Comprehensive memory:** Short-term working memory and long-term persistent memory across sessions.
- **Graph abstraction:** Uses graphs (inspired by Pregel/NetworkX) to orchestrate complex stateful execution.

*Source: github.com/langchain-ai/langchain & github.com/langchain-ai/langgraph*
