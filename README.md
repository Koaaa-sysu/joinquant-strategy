# joinquant-strategy

A Codex skill for creating, backtesting, and deploying quantitative trading strategies on [JoinQuant (聚宽)](https://www.joinquant.com/) platform via browser automation.

## Features

- 📝 Write strategy code with JoinQuant API templates
- 🔄 Automated browser workflow: create strategy → paste code → run backtest
- 📊 Extract backtest metrics (returns, Alpha, Beta, Sharpe, max drawdown)
- 🚀 Deploy to simulated trading with one click
- 📚 JoinQuant API quick reference included

## Installation

Copy the `joinquant-strategy` folder to your Codex skills directory:

```bash
# Default location
~/.codex/skills/joinquant-strategy/
```

## Usage

Trigger with natural language in Codex:

- "帮我在聚宽上写一个MACD策略并跑回测"
- "用聚宽回测一个均线交叉策略"
- "Create a stock strategy on JoinQuant"

## Prerequisites

- [Codex CLI](https://github.com/openai/codex) with browser plugin
- JoinQuant account (logged in via in-app browser)
- talib (pre-installed on JoinQuant platform)

## Structure

```
joinquant-strategy/
├── SKILL.md                        # Main skill instructions
├── agents/
│   └── openai.yaml                 # UI metadata
├── references/
│   ├── jq_api_reference.md         # JoinQuant API cheatsheet
│   └── jq_strategy_template.py     # Strategy code template
└── scripts/
    └── browser_helpers.mjs         # Browser automation helpers
```

## Workflow

```
1. Confirm strategy parameters (universe, indicators, capital, etc.)
2. Generate strategy code from template + API reference
3. Browser automation: navigate JoinQuant, create strategy, paste code
4. Run backtest, poll for results, extract metrics
5. Deploy to simulated trading (optional)
```

## License

MIT
