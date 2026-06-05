// JoinQuant Browser Automation Helpers
// Use with in-app browser via Node REPL js tool

// === Tab Management ===

async function getActiveTab() {
  const tabList = await browser.tabs.list();
  if (tabList.length === 0) throw new Error("No browser tabs found");
  return await browser.tabs.get(tabList[tabList.length - 1].id);
}

// === Navigation ===

async function goToStrategyList(tab) {
  await tab.goto("https://www.joinquant.com/algorithm/index/list");
  await tab.playwright.waitForLoadState("networkidle", { timeoutMs: 15000 });
}

async function goToTradeList(tab) {
  await tab.goto("https://www.joinquant.com/algorithm/trade/list");
  await tab.playwright.waitForLoadState("networkidle", { timeoutMs: 15000 });
}

async function goToEditor(tab, algorithmId) {
  await tab.goto(`https://www.joinquant.com/algorithm/index/edit?algorithmId=${algorithmId}`);
  await tab.playwright.waitForLoadState("networkidle", { timeoutMs: 15000 });
}

// === Strategy Creation ===

async function createStockStrategy(tab) {
  await tab.playwright.getByText("新建策略").click();
  await tab.playwright.waitForTimeout(1000);
  await tab.playwright.getByText("股票策略").click();
  await tab.playwright.waitForLoadState("networkidle", { timeoutMs: 15000 });
}

// === Code Editing (Ace Editor) ===

async function pasteCodeToEditor(tab, code) {
  // Write code to clipboard
  await tab.clipboard.writeText(code);

  // Focus ace editor
  const textInput = tab.playwright.locator('.ace_text-input');
  await textInput.click({ force: true });
  await tab.playwright.waitForTimeout(500);

  // Select all and paste
  await textInput.press("Control+a");
  await tab.playwright.waitForTimeout(300);
  await textInput.press("Control+v");
  await tab.playwright.waitForTimeout(1000);
}

async function verifyCode(tab) {
  return await tab.playwright.evaluate(() => {
    const codeTextarea = document.getElementById('code');
    return codeTextarea ? codeTextarea.value.substring(0, 200) : "not found";
  });
}

async function saveStrategy(tab) {
  // Try button click first, fallback to keyboard
  try {
    await tab.playwright.locator('text=保 存').click({ timeout: 3000 });
  } catch {
    await tab.playwright.locator('#ide-container').click({ force: true });
    await tab.playwright.waitForTimeout(300);
    await tab.playwright.locator('body').press("Control+s");
  }
  await tab.playwright.waitForTimeout(2000);
}

// === Backtest ===

async function runBacktest(tab) {
  await tab.playwright.getByText("编译运行", { exact: true }).click();
  await tab.playwright.waitForTimeout(3000);
}

async function waitForBacktest(tab, maxWaitMs = 240000) {
  const startTime = Date.now();
  const pollInterval = 5000;

  while (Date.now() - startTime < maxWaitMs) {
    await tab.playwright.waitForTimeout(pollInterval);
    const dom = await tab.playwright.domSnapshot();

    if (dom.includes("回测完成")) {
      return { success: true, dom };
    }
    if (dom.includes("回测失败")) {
      return { success: false, dom, error: "Backtest failed" };
    }
    // Still running
    const timeMatch = dom.match(/(\d+分\d+秒)/);
    console.log(`Still running: ${timeMatch ? timeMatch[1] : '...'}`);
  }
  return { success: false, error: "Timeout" };
}

function extractBacktestMetrics(dom) {
  const metrics = {};
  const patterns = {
    strategyReturn: /策略收益.*?(-?\d+\.?\d*%)/,
    benchmarkReturn: /基准收益.*?(-?\d+\.?\d*%)/,
    alpha: /阿尔法.*?(-?\d+\.?\d*)/,
    beta: /贝塔.*?(-?\d+\.?\d*)/,
    sharpe: /夏普比率.*?(-?\d+\.?\d*)/,
    maxDrawdown: /最大回撤.*?(\d+\.?\d*%)/,
    winRate: /胜率.*?(-?\d+\.?\d*)/,
  };
  for (const [key, pattern] of Object.entries(patterns)) {
    const match = dom.match(pattern);
    if (match) metrics[key] = match[1];
  }
  return metrics;
}

// === Simulated Trading ===

async function createSimulatedTrade(tab) {
  // Must be on backtest detail page
  await tab.playwright.getByText("模拟交易", { exact: true }).click();
  await tab.playwright.waitForTimeout(3000);

  // Click confirm button
  await tab.playwright.getByRole("button", { name: "确定" }).click();
  await tab.playwright.waitForTimeout(5000);
}

// === DOM Helpers ===

async function getDomSnapshot(tab) {
  return await tab.playwright.domSnapshot();
}

async function takeScreenshot(tab) {
  const ss = await tab.screenshot();
  await nodeRepl.emitImage(Buffer.from(ss, 'base64'));
}

async function isVisible(tab, text) {
  const dom = await tab.playwright.domSnapshot();
  return dom.includes(text);
}

console.log("JoinQuant browser helpers loaded");
