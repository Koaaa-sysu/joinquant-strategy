# joinquant-strategy

[中文版](./README_zh.md)

A [Codex](https://github.com/openai/codex) skill for creating, backtesting, and deploying quantitative trading strategies on [JoinQuant (聚宽)](https://www.joinquant.com/) platform via browser automation.

## Features

- 📝 Generate strategy code from JoinQuant API templates
- 🔄 Automated browser workflow: create strategy → paste code → run backtest
- 📊 Extract backtest metrics (returns, Alpha, Beta, Sharpe, max drawdown)
- 🚀 Deploy to simulated trading with one click
- 📚 JoinQuant API quick reference included

## Installation

Copy the `joinquant-strategy` folder to your Codex skills directory:

```bash
~/.codex/skills/joinquant-strategy/
```

## Prerequisites

- [Codex CLI](https://github.com/openai/codex) with browser plugin
- JoinQuant account (logged in via in-app browser)
- talib (pre-installed on JoinQuant platform)

## Usage

Trigger with natural language in Codex:

- "Create a MACD golden cross strategy on JoinQuant and run a backtest"
- "Write a moving average crossover strategy for A-shares on 聚宽"
- "Deploy a stock strategy to simulated trading on JoinQuant"

## Workflow

```
1. Confirm strategy parameters (universe, indicators, capital, etc.)
2. Generate strategy code from template + API reference
3. Browser automation: navigate JoinQuant → create strategy → paste code
4. Run backtest, poll for results, extract metrics
5. Deploy to simulated trading (optional)
```

## Structure

```
joinquant-strategy/
├── SKILL.md                        # Main skill instructions
├── README.md                       # English documentation
├── README_zh.md                    # 中文文档
├── agents/
│   └── openai.yaml                 # UI metadata
├── references/
│   ├── jq_api_reference.md         # JoinQuant API cheatsheet
│   └── jq_strategy_template.py     # Strategy code template
└── scripts/
    └── browser_helpers.mjs         # Browser automation helpers
```

## Supported Strategies

| Type | Example |
|------|---------|
| Technical | MACD, MA crossover, RSI, Bollinger Bands |
| Factor | Multi-factor stock selection |
| Momentum | Sector rotation, trend following |
| Custom | Any JoinQuant-compatible Python strategy |

## License

MIT
