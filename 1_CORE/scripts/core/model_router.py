"""
SEOSONA OS Dynamic Model Router.
Analyzes task complexity and determines the optimal LLM Tier
to balance performance vs API costs.
"""

def evaluate_task_complexity(task_description: str) -> dict:
    """
    Returns a recommended model tier based on task heuristics.
    Tier 1 (Opus/Pro): High Reasoning (Coding, Architecture, Math, Logic)
    Tier 2 (Sonnet): Balanced (Writing, General Data Extraction)
    Tier 3 (Haiku/Flash): Fast & Cheap (Formatting, Summarization, Simple Queries)
    """
    desc = task_description.lower()
    
    # Heuristics keywords
    tier1_keywords = {"code", "script", "debug", "architect", "logic", "complex", "heal", "crawl", "scrape"}
    tier2_keywords = {"write", "blog", "audit", "analyze", "review", "translate"}
    
    words = set(desc.replace(",", " ").replace(".", " ").split())
    
    score = 0
    if words.intersection(tier1_keywords):
        score += 50
    if words.intersection(tier2_keywords):
        score += 20
        
    if len(desc) > 500:
        score += 15
        
    if score >= 50:
        return {"tier": "Tier 1", "model": "claude-3-opus-20240229 / gemini-1.5-pro", "reason": "Requires deep reasoning or coding."}
    elif score >= 20:
        return {"tier": "Tier 2", "model": "claude-3-5-sonnet-20240620", "reason": "Requires balanced analysis."}
    else:
        return {"tier": "Tier 3", "model": "claude-3-haiku-20240307 / gemini-1.5-flash", "reason": "Simple task. Using cost-effective model."}

def route_task(task_description: str) -> str:
    """Convenience function returning just the model name."""
    res = evaluate_task_complexity(task_description)
    print(f"[Model Router] Selected {res['tier']} for task: {res['reason']}")
    return res["model"]
