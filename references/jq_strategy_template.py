# ============================================================
# {{STRATEGY_NAME}} - 聚宽JoinQuant
# 适用：{{STOCK_UNIVERSE}}
# 初始资金：{{CAPITAL}}，同时持仓最多{{MAX_HOLD}}只
# ============================================================

import talib
import numpy as np
import pandas as pd


def initialize(context):
    """初始化函数，设定基本参数"""
    set_benchmark('000300.XSHG')  # 沪深300基准
    set_option('use_real_price', True)
    set_option('avoid_future_data', True)

    # 策略参数
    context.fast_period = 12
    context.slow_period = 26
    context.signal_period = 9
    context.max_hold = {{MAX_HOLD}}

    # 每日运行
    run_daily(market_open, time='09:35')


def get_stock_list(context):
    """获取股票池"""
    date = context.current_dt
    all_stocks = get_all_securities(types=['stock'], date=date).index.tolist()

    filtered = []
    for stock in all_stocks:
        code = stock.split('.')[0]
        # 排除科创板和北交所
        if code.startswith('688') or code.startswith('8'):
            continue
        filtered.append(stock)

    # 排除ST股
    st_info = get_extras('is_st', filtered, start_date=date, end_date=date, df=True)
    if not st_info.empty:
        non_st = st_info.iloc[0]
        filtered = [s for s in filtered if not non_st.get(s, False)]

    # 排除停牌股
    paused = get_price(filtered, end_date=date, count=1, fields=['paused'], panel=False)
    if not paused.empty:
        paused_stocks = paused[paused['paused'] == 1]['code'].tolist()
        filtered = [s for s in filtered if s not in paused_stocks]

    # 排除次新股（上市不足60天）
    filtered = [s for s in filtered if days_since_listing(s, date) > 60]

    return filtered


def days_since_listing(stock, date):
    """计算股票上市天数"""
    info = get_security_info(stock)
    if info and info.start_date:
        return (date.date() - info.start_date).days
    return 0


def market_open(context):
    """每日开盘策略逻辑"""
    # TODO: Implement your strategy logic here
    pass
