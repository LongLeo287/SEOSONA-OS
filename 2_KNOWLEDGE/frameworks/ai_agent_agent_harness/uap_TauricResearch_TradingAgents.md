# KI: TauricResearch/TradingAgents

## Overview
Package: tradingagents

## Tech Stack (from code)
- Python (81 files)
- **Total:** 104 files, 17 directories
- **File types:** .py: 81, .png: 11, .example: 2, .md: 2, .txt: 2, .dockerignore: 1, .gitignore: 1, .yml: 1

## Dependencies

### Python Dependencies (from requirements.txt)
- `.`

## Imports Detected in Source
- `time`
- `tradingagents`

## File Structure
```
  .dockerignore
  .env.enterprise.example
  .env.example
  .gitignore
  CHANGELOG.md
  Dockerfile
  LICENSE
  README.md
  docker-compose.yml
  main.py
  pyproject.toml
  requirements.txt
  test.py
  assets/
    TauricResearch.png
    analyst.png
    researcher.png
    risk.png
    schema.png
    trader.png
    wechat.png
    cli/
      cli_init.png
      cli_news.png
      cli_technical.png
      cli_transaction.png
  cli/
    __init__.py
    announcements.py
    config.py
    main.py
    models.py
    stats_handler.py
    utils.py
    static/
      welcome.txt
  scripts/
    smoke_structured_output.py
  tradingagents/
    __init__.py
    default_config.py
    reporting.py
    agents/
      __init__.py
      schemas.py
      analysts/
        fundamentals_analyst.py
        market_analyst.py
        news_analyst.py
        sentiment_analyst.py
        social_media_analyst.py
      managers/
        portfolio_manager.py
        research_manager.py
      researchers/
        bear_researcher.py
        bull_researcher.py
      risk_mgmt/
        aggressive_debator.py
        conservative_debator.py
        neutral_debator.py
      trader/
        trader.py
      utils/
        agent_states.py
        agent_utils.py
        core_stock_tools.py
        fundamental_data_tools.py
        macro_data_tools.py
        market_data_validation_tools.py
        memory.py
        news_data_tools.py
        prediction_markets_tools.py
        rating.py
        structured.py
        technical_indicators_tools.py
    dataflows/
      __init__.py
      alpha_vantage.py
      alpha_vantage_common.py
      alpha_vantage_fundamentals.py
      alpha_vantage_indicator.py
      alpha_vantage_news.py
      alpha_vantage_stock.py
      config.py
      errors.py
      fred.py
      interface.py
      market_data_validator.py
      polymarket.py
      reddit.py
      stockstats_utils.py
      stocktwits.py
      symbol_utils.py
      utils.py
      y_finance.py
      yfinance_news.py
    graph/
```

## Key Source Excerpts
### main.py
```python
from tradingagents.default_config import DEFAULT_CONFIG
from tradingagents.graph.trading_graph import TradingAgentsGraph

# DEFAULT_CONFIG already applies TRADINGAGENTS_* env-var overrides
# (llm_provider, deep_think_llm, quick_think_llm, backend_url, etc.),
# so users can switch models or endpoints purely via .env without
# editing this script. Override individual keys here only when you
# want a hard-coded value that should ignore the environment.
config = DEFAULT_CONFIG.copy()

# Initialize with custom config
ta = TradingAgentsGraph(debug=True, config=config)

# forward propagate
_, decision = ta.propagate("NVDA", "2024-05-10")
print(decision)

# Memorize mistakes and reflect
# ta.reflect_and_remember(1000) # parameter is the position returns

```

### test.py
```python
import time

from tradingagents.dataflows.y_finance import (
    get_stock_stats_indicators_window,
)

print("Testing optimized implementation with 30-day lookback:")
start_time = time.time()
result = get_stock_stats_indicators_window("AAPL", "macd", "2024-11-01", 30)
end_time = time.time()

print(f"Execution time: {end_time - start_time:.2f} seconds")
print(f"Result length: {len(result)} characters")
print(result)

```

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `llm` · **Fit:** 61/100 · **Auto-apply:** False
- **Evidence:** `llm`, `openai`, `anthropic`
- **All scores:** {'seosona-os': 61, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
