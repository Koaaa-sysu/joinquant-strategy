# JoinQuant API Quick Reference

## Core Functions

### initialize(context)
Called once at strategy start. Set benchmarks, options, schedule tasks.

### handle_data(context, data)
Called every bar (minute/day). Alternative to run_daily.

### run_daily(func, time)
Schedule function to run daily at specified time.
`run_daily(market_open, time='09:35')` - 5 min after open

## Stock Data

### get_all_securities(types, date)
Get all securities of given type on date.
```python
stocks = get_all_securities(types=['stock'], date=date).index.tolist()
# Returns: ['000001.XSHE', '600000.XSHG', ...]
```

### get_price(security, end_date, count, fields, panel=False)
Get historical price data.
```python
df = get_price('000001.XSHE', end_date=today, count=60,
               fields=['close', 'volume'], panel=False)
```

### attribute_history(security, count, unit, fields, df=True)
Get historical data for a single stock.
```python
df = attribute_history(stock, 40, '1d', ['close'], df=True)
```

### get_security_info(security)
Get stock metadata. Returns object with:
- `start_date` (NOT `start`) - listing date
- `name` - stock name
- `type` - 'stock', 'fund', etc.

### get_extras(field, securities, start_date, end_date, df=True)
Get extra info like `is_st`, `is_trading`.
```python
st_info = get_extras('is_st', stocks, start_date=date, end_date=date, df=True)
```

## Trading Functions

### order(security, amount)
Order specified amount of shares.

### order_target(security, amount)
Adjust position to target amount.
`order_target(stock, 0)` = close position

### order_value(security, value)
Order specified value (in yuan).

### order_target_value(security, value)
Adjust position to target value.
`order_target_value(stock, 20000)` = hold 20k yuan worth

### order_target_percent(security, percent)
Adjust position to target percentage of portfolio.

## Portfolio

### context.portfolio
- `.positions` - dict of current positions
- `.available_cash` - available cash
- `.total_value` - total portfolio value
- `.returns` - total return rate

### context.portfolio.positions[stock]
- `.amount` - shares held
- `.avg_cost` - average cost
- `.value` - current value

## Settings

### set_benchmark(security)
Set benchmark index. Common: '000300.XSHG' (CSI 300)

### set_option(key, value)
- `use_real_price`: True - use real prices
- `avoid_future_data`: True - prevent look-ahead bias

### set_order_cost(cost, type)
Set trading costs.
```python
set_order_cost(OrderCost(
    close_tax=0.001,        # 0.1% stamp tax on sell
    open_commission=0.0003, # 0.03% buy commission
    close_commission=0.0003,# 0.03% sell commission
    min_commission=5        # min 5 yuan per trade
), type='stock')
```

## Stock Code Conventions

| Exchange | Code Format | Example |
|----------|-------------|---------|
| 上交所 SH | 600xxx.XSHG | 600000.XSHG |
| 深交所 SZ | 000xxx.XSHE | 000001.XSHE |
| 创业板 | 300xxx.XSHE | 300001.XSHE |
| 科创板 | 688xxx.XSHG | 688001.XSHG |
| 北交所 | 8xxxxx.XBSE | 430001.XBSE |

## Common Filters

```python
# Exclude 科创板
if code.startswith('688'): continue

# Exclude 北交所
if code.startswith('8'): continue

# Exclude ST stocks
st_info = get_extras('is_st', stocks, start_date=date, end_date=date, df=True)
non_st = st_info.iloc[0]
filtered = [s for s in stocks if not non_st.get(s, False)]

# Exclude suspended stocks
paused = get_price(stocks, end_date=date, count=1, fields=['paused'], panel=False)
paused_stocks = paused[paused['paused'] == 1]['code'].tolist()

# Exclude new stocks (< 60 days)
info = get_security_info(stock)
days = (date.date() - info.start_date).days
```

## Technical Indicators (via talib)

```python
import talib

# MACD
diff, dea, macd_hist = talib.MACD(close, fastperiod=12, slowperiod=26, signalperiod=9)

# Moving Averages
ma5 = talib.SMA(close, timeperiod=5)
ema12 = talib.EMA(close, timeperiod=12)

# RSI
rsi = talib.RSI(close, timeperiod=14)

# Bollinger Bands
upper, middle, lower = talib.BBANDS(close, timeperiod=20)
```

## Logging

```python
log.info('message')    # Info level
log.warn('message')    # Warning level
log.error('message')   # Error level
```
