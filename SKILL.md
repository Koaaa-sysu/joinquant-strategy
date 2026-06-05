---
name: joinquant-strategy
description: >
  Create, backtest, and deploy quantitative trading strategies on JoinQuant (聚宽) platform.
  Use when the user wants to write a stock/futures strategy, run backtests, set up simulated trading,
  or automate the full JoinQuant workflow via in-app browser. Covers MACD, moving average, multi-factor,
  and other A-share strategies. Handles browser automation for code editing, backtesting, and
  simulated trading deployment on joinquant.com.
---

# JoinQuant Strategy Workflow

End-to-end workflow for developing quantitative strategies on JoinQuant (聚宽) platform using in-app browser automation.

## Prerequisites

- User must be logged into JoinQuant in the in-app browser
- Browser skill must be available for automation
- Strategy code should be pre-written before browser operations

## Workflow Overview

```
1. Confirm strategy parameters with user
2. Write strategy code (local .py file)
3. Open JoinQuant → Create new strategy
4. Paste code into editor (Ace editor)
5. Save & run backtest
6. Review results with user
7. Deploy to simulated trading (optional)
```

## Step 1: Confirm Strategy Parameters

Before writing code, confirm these with the user:

| Parameter | Example | Notes |
|-----------|---------|-------|
| Strategy type | MACD金叉 / 均线 / 多因子 | Determines logic |
| Stock universe | 全A股排除科创板 | Filter rules |
| Parameters | MACD(12,26,9) | Technical indicators |
| Frequency | 日线 / 分钟级 | Trading frequency |
| Initial capital | 100,000 | Starting amount |
| Max positions | 5 | Concurrent holdings |
| Stop loss/take profit | None / -5% | Risk management |
| Mode | 模拟盘 / 回测 | Deployment target |

## Step 2: Write Strategy Code

Save strategy code to a local .py file first. Follow JoinQuant API conventions:

```python
# Required imports
import talib
import numpy as np
import pandas as pd

def initialize(context):
    set_benchmark('000300.XSHG')
    set_option('use_real_price', True)
    set_option('avoid_future_data', True)
    # Set parameters
    run_daily(market_open, time='09:35')

def market_open(context):
    # Strategy logic here
    pass
```

Key JoinQuant API patterns: see `references/jq_api_reference.md`

## Step 3: Browser Automation - Create Strategy

Use in-app browser (browser skill) to automate JoinQuant:

### 3.1 Setup Browser

```javascript
const { setupBrowserRuntime } = await import("<plugin-root>/scripts/browser-client.mjs");
await setupBrowserRuntime({ globals: globalThis });
globalThis.browser = await agent.browsers.get("iab");
const myTab = await browser.tabs.get("1"); // or list() to find active tab
```

### 3.2 Navigate to Strategy List

```javascript
await myTab.goto("https://www.joinquant.com/algorithm/index/list");
await myTab.playwright.waitForLoadState("networkidle", { timeoutMs: 15000 });
```

### 3.3 Create New Strategy

Click "新建策略" → Select "股票策略" (or appropriate type):

```javascript
await myTab.playwright.getByText("新建策略").click();
await myTab.playwright.waitForTimeout(1000);
await myTab.playwright.getByText("股票策略").click();
await myTab.playwright.waitForLoadState("networkidle", { timeoutMs: 15000 });
```

## Step 4: Paste Code into Editor

JoinQuant uses **Ace Editor**. Use clipboard API to paste code:

```javascript
// Write code to clipboard
await myTab.clipboard.writeText(strategyCode);

// Focus the ace editor input
const textInput = myTab.playwright.locator('.ace_text-input');
await textInput.click({ force: true });
await myTab.playwright.waitForTimeout(500);

// Select all existing code, then paste
await textInput.press("Control+a");
await myTab.playwright.waitForTimeout(300);
await textInput.press("Control+v");
await myTab.playwright.waitForTimeout(1000);
```

### Verify Code Was Pasted

```javascript
const verifyResult = await myTab.playwright.evaluate(() => {
  const codeTextarea = document.getElementById('code');
  return codeTextarea ? codeTextarea.value.substring(0, 200) : "not found";
});
```

## Step 5: Save & Run Backtest

### Save Strategy

```javascript
// Use the save button or Ctrl+S
await myTab.playwright.locator('body').press("Control+s");
await myTab.playwright.waitForTimeout(2000);
```

### Run Backtest

```javascript
// Click "编译运行" (exact match to avoid ambiguity)
await myTab.playwright.getByText("编译运行", { exact: true }).click();
```

### Wait for Completion

Poll every 5 seconds for up to 4 minutes:

```javascript
let done = false;
let polls = 0;
while (!done && polls < 48) {
  await myTab.playwright.waitForTimeout(5000);
  polls++;
  const dom = await myTab.playwright.domSnapshot();
  if (dom.includes("回测完成")) { done = true; /* extract results */ }
  else if (dom.includes("回测失败")) { done = true; /* check error logs */ }
}
```

### Extract Results

Look for these metrics in DOM:
- 策略收益, 基准收益, Alpha, Beta, Sharpe, 最大回撤
- 胜率, 盈亏比, 盈利次数, 亏损次数

## Step 6: Deploy Simulated Trading

From backtest detail page, click "模拟交易":

```javascript
await myTab.playwright.getByText("模拟交易", { exact: true }).click();
await myTab.playwright.waitForTimeout(3000);
```

In the dialog:
- 交易名称: auto-filled
- 初始资金: verify matches requirement
- 运行频率: 每天/分钟/tick
- 开始日期: next trading day

Click "确定" to confirm.

## Common Issues & Solutions

### Backtest Fails Immediately (00分04秒)
- Check `get_security_info(stock).start_date` not `.start`
- Ensure `days_since_listing` uses correct property name
- Verify talib import works on JoinQuant platform

### Ace Editor Not Responding to Paste
- Ensure `click({ force: true })` on `.ace_text-input`
- Use clipboard API, not keyboard simulation
- Verify with `document.getElementById('code').value`

### DOM Snapshot Timeout
- Increase `timeoutMs` for slow pages
- Use `waitForLoadState("networkidle")` after navigation
- Retry with shorter polling intervals

### Strategy Name Edit Fails
- Name editing via DOM is fragile
- Skip renaming if not critical - strategy works regardless

## File References

- Strategy template: `references/jq_strategy_template.py`
- API reference: `references/jq_api_reference.md`
- Browser automation helpers: `scripts/browser_helpers.mjs`
