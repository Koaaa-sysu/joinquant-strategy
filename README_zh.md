# joinquant-strategy

[English](./README.md)

一个 [Codex](https://github.com/openai/codex) 技能（Skill），通过浏览器自动化在[聚宽 (JoinQuant)](https://www.joinquant.com/) 平台上创建、回测和部署量化交易策略。

## 功能特性

- 📝 基于聚宽 API 模板生成策略代码
- 🔄 浏览器自动化全流程：创建策略 → 粘贴代码 → 运行回测
- 📊 自动提取回测指标（收益、Alpha、Beta、Sharpe、最大回撤等）
- 🚀 一键部署模拟交易
- 📚 内置聚宽 API 速查手册

## 安装

将 `joinquant-strategy` 文件夹复制到 Codex 技能目录：

```bash
~/.codex/skills/joinquant-strategy/
```

## 前置条件

- [Codex CLI](https://github.com/openai/codex) 及浏览器插件
- 聚宽账号（需在 Codex 内置浏览器中登录）
- talib（聚宽平台已预装）

## 使用方式

在 Codex 中用自然语言触发：

- "帮我在聚宽上写一个MACD金叉策略并跑回测"
- "用聚宽回测一个均线交叉策略"
- "在聚宽部署量化策略跑模拟盘"

## 工作流程

```
1. 确认策略参数（选股范围、技术指标、初始资金等）
2. 根据模板和 API 参考生成策略代码
3. 浏览器自动化：导航聚宽 → 创建策略 → 粘贴代码
4. 运行回测，轮询等待结果，提取指标
5. 部署模拟交易（可选）
```

## 目录结构

```
joinquant-strategy/
├── SKILL.md                        # 技能主指令文件
├── README.md                       # 英文文档
├── README_zh.md                    # 中文文档
├── agents/
│   └── openai.yaml                 # UI 元数据
├── references/
│   ├── jq_api_reference.md         # 聚宽 API 速查手册
│   └── jq_strategy_template.py     # 策略代码模板
└── scripts/
    └── browser_helpers.mjs         # 浏览器自动化辅助函数
```

## 支持的策略类型

| 类型 | 示例 |
|------|------|
| 技术指标 | MACD、均线交叉、RSI、布林带 |
| 因子选股 | 多因子选股策略 |
| 动量策略 | 板块轮动、趋势跟踪 |
| 自定义 | 任何聚宽兼容的 Python 策略 |

## 许可证

MIT
