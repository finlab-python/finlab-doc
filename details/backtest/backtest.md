以每日 `position` 訊號搭配 `finlab.backtest.sim`，即可快速完成回測並產生選股清單與風險/報酬分析。

## 快速上手
以下示範以「股價 < 6 元」為條件，每月調整部位：

```python
from finlab import data
from finlab import backtest

# 只買入價格小於 6 元的股票
close = data.get('price:收盤價')
position = close < 6

# 回測，每月底(M)重新調整股票權重
report = backtest.sim(position, resample='M', name="價格小於6的股票")
```

<img src="https://i.ibb.co/fMrgwGM/Screen-Shot-2021-07-13-at-11-36-02-PM.png" />

上傳回測至雲端後，可於「選股清單」檢視持股與異動，並手動跟單。

<img src="https://i.ibb.co/JnqJDvs/Screen-Shot-2021-07-13-at-11-41-56-PM.png" />

## 顯示策略回測結果

```py
report.display()
```
![display](img/backtest/display.png)

## 取得策略交易紀錄
##### 交易紀錄重點欄位

```py
report.get_trades()
```
* exit_sig_date:出場訊號產生日。
* entry_sig_date:進場訊號產生日。
* entry_date:進場日。
* exit_date:出場日。
* period:持有天數。
* position: 持有佔比。
* return:報酬率。
* mdd:持有期間最大回撤。
* mae:持有期間最大不利幅度。
* g_mfe:持有期間最大有利幅度。
* b_mfe:mae發生前的最大有利幅度。

## 顯示波動分析圖

```py
report.display_mae_mfe_analysis()
```
![display_mae_mfe](img/backtest/display_mae_mfe.png)

## 策略流動性風險檢測
```py
from finlab.analysis.liquidityAnalysis import LiquidityAnalysis

# 交易紀錄進出場成交張數大於1000張的比例, 成交金額大於1000000元的比例，檢測資金部位胃納量
report.run_analysis(LiquidityAnalysis(required_volume=100000, required_turnover=1000000))
```
![策略流動性檢測](img/analysis/liq-analysis.png)

## 更多範例
### 創新高策略
以 250 日高點判斷創新高：



```python
from finlab import data
from finlab.backtest import sim

# 創 250 天新高的股票
close = data.get('price:收盤價')
position = (close == close.rolling(250).max())

# 回測，每月(M)調整一次，選出當天創新高股票
sim(position, resample='M', name="創年新高策略")
```



<img src="https://i.ibb.co/7kNyvhP/Screen-Shot-2021-07-13-at-11-54-29-PM.png" />





### 高 RSI 技術指標策略
取 RSI 最大的 20 檔並持有一週：



```python
from finlab import data
from finlab.backtest import sim

# 選出 RSI 最大的 20 檔股票
rsi = data.indicator('RSI')
position = rsi.is_largest(20)

# 回測，每月(M)調整一次
report = sim(position, resample='W', name="高RSI策略")
```



<img src="https://i.ibb.co/3pQXGS2/Screen-Shot-2021-07-14-at-12-07-49-AM.png" />




### 乖離率 + 財報濾網
以 60 日乖離率取前 30 名，再用 ROE > 0 濾網：



```python
from finlab import data
from finlab.backtest import sim

# 下載 ROE 跟收盤價
roe = data.get("fundamental_features:ROE稅後")
close = data.get('price:收盤價')

position = (
      (close / close.shift(60)).is_largest(30) # 選出乖離率前 30 名的股票
    & (roe > 0) # 選出 ROE 大於 0 的股票
)

# 回測，每月(M)調整一次
report = sim(position, resample='M', name="乖離率和ROE濾網策略")
```



<img src="https://i.ibb.co/Q9nFgMx/Screen-Shot-2021-07-14-at-12-30-48-AM.png" />
