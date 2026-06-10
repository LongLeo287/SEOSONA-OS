# Dual-Tier Neural Memory Architecture

**Source**: `nhadaututtheky/neural-memory`
**Status**: Core Integration (Mandatory for Long-lived Agents)

The SEOSONA System utilizes the Neural Memory architecture to solve the problems of Context Degradation and Token Limits during large-scale, long-running projects.

This architecture divides the agent's memory into two tiers and utilizes advanced vector compression algorithms.

---

## 1. Dual-Tier Storage Structure

### Tier 1: Free Tier (SQLite / FTS5)
- **Mechanism**: Local storage using SQLite database, utilizing FTS5 (Keyword-based) search algorithms.
- **Best for**: Short-term context, small projects (< 10,000 Memory Neurons).
- **Characteristics**: Fast, zero-API dependency, but limited to "Exact Match" keyword searching.

### Tier 2: Pro Tier (InfinityDB / Semantic HNSW)
- **Mechanism**: Ultra-hierarchical Vector storage, utilizing Hierarchical Navigable Small World (HNSW) algorithms combined with Embeddings.
- **Speed**: <5ms latency for 1 million Neurons.
- **Semantic Recall**: Meaning-based search. (e.g., Querying "auth bug" will automatically recall memories about "JWT rotation" and "OAuth migration" instead of just matching the word "auth").
- **Consolidation**: Clusters fragmented memories into a unified Concept (Smart Merge) using `O(NÃ—k)` time complexity instead of brute-force `O(NÂ²)`.

---

## 2. Reflex Pipeline

Instead of constantly pushing the entire chat history into the Context Window, SEOSONA uses the **Reflex Pipeline**.

1. When a User sends a Request, the system does not immediately invoke the LLM.
2. The `MemoryEncoder` analyzes the Semantic Intent of the Request.
3. The `ReflexPipeline` projects "Cone Queries" into the InfinityDB:
   - **Narrow Cone**: Fetches absolute precision information (e.g., specific database configuration code).
   - **Wide Cone**: Fetches directional context (e.g., "How did we design the UI last time?").
4. After retrieving the exact Context (only a few hundred core Tokens), the Agent begins processing.

---

## 3. 5-Tier Vector Compression

To optimize storage costs and RAM, the Neural Memory system automatically compresses memories through a 5-tier Lifecycle:
1. **Float32**: Newly created memories requiring absolute precision.
2. **Float16**: After 1 week of inactivity, reduces storage by 50%.
3. **Int8**: Static compression, reduces storage by 75%.
4. **Binary**: Binary compression for outdated data, ultra-lightweight.
5. **Metadata**: Retains only Tags and IDs, saving 97% of storage costs.

> âš ï¸ Memories are automatically promoted back to Float32 if they are recalled by the Agent.

