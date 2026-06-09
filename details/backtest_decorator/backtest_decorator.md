# 計算選股條件

`FinlabDataFrame` 是 Finlab 在 Pandas DataFrame 基礎上擴展的選股專用工具，讓您用簡短語法完成複雜的選股策略。如果您不熟悉 Pandas，建議先參考[10分鐘學會Pandas](https://hackmd.io/@wiimax/10-minutes-to-pandas)教學。

## 快速索引

| 類別 | 函式 | 功能說明 |
|------|------|----------|
| **基本運算** | `+`, `-`, `*`, `/`, `>`, `<`, `&`, `\|`, `~` | 算術、比較、邏輯運算 |
| **選股** | `is_largest(n)` | 選出數值最大的 n 檔 |
| | `is_smallest(n)` | 選出數值最小的 n 檔 |
| | `average(n)` | 計算 n 期移動平均 |
| **進出場** | `hold_until(exit)` | 設定進出場訊號 |
| | `is_entry()` | 提取進場時點 |
| | `is_exit()` | 提取出場時點 |
| **趨勢** | `rise(n)` | 是否高於 n 期前 |
| | `fall(n)` | 是否低於 n 期前 |
| | `sustain(window, count)` | 持續滿足條件 |
| **其他** | `quantile_row(q)` | 橫向分位數 |
| | `groupby_category()` | 產業分群 |
| | `index_str_to_date()` | 索引格式轉換 |

## 與 Pandas DataFrame 的差異

| 差異項目 | 說明 |
|---------|------|
| **額外函式** | 提供選股專用函式如 `is_largest()`, `sustain()`, `hold_until()` 等 |
| **自動對齊** | 運算前自動對齊不同頻率資料（日、月、季），無需手動 `reindex` |

## 創建 FinlabDataFrame

**方法一：使用 finlab.data.get()**

使用 `finlab.data.get()` 獲得的資料，自動為 `FinlabDataFrame` 格式。

**方法二：轉換 Pandas DataFrame**

```py
import pandas as pd
from finlab.dataframe import FinlabDataFrame

df = pd.DataFrame()
df_finlab = FinlabDataFrame(df)
```

## 運算符號

與 `pd.DataFrame` 類似，對相同位置的元素進行運算。支援以下運算符號：

| 類型 | 運算符 | 說明 |
|------|--------|------|
| **算術運算** | `+` | 相加 |
| | `-` | 相減 |
| | `*` | 相乘 |
| | `/` | 相除 |
| **比較運算** | `>` | 大於 |
| | `>=` | 大於等於 |
| | `==` | 等於 |
| | `<` | 小於 |
| | `<=` | 小於等於 |
| **邏輯運算** | `&` | 且（AND） |
| | `\|` | 或（OR） |
| | `~` | 非（NOT） |

**範例：選出收盤價介於 10 ~ 100 的股票**
```py
from finlab import data

close = data.get('price:收盤價')

# 收盤價位於 10 ~ 100 之間
between_10_100 = (close > 10) & (close < 100)
```

!!! note "資料頻率自動對齊"
    當不同頻率資料（日、月、季）進行運算時，`FinlabDataFrame` 會自動處理對齊：
    
    | 對齊步驟 | 處理方式 |
    |----------|----------|
    | **日期（index）** | 取聯集，缺值以最近數據填補（forward fill） |
    | **股票（column）** | 取交集，無對應資料的股票會被剔除 |

**範例：結合每日股價與每季財報資料**

```py
from finlab import data

# 取得 FinlabDataFrame
close = data.get('price:收盤價')
roa = data.get('fundamental_features:ROA稅後息前')

# 運算兩個選股條件交集
cond1 = close > 37
cond2 = roa > 0
cond_1_2 = cond1 & cond2
```

下圖為 1101 台泥的訊號示意。可以看到即使 `cond1`（日）與 `cond2`（季）頻率不同，也能直接運算：

<img src="https://i.ibb.co/m9chXSQ/imageconds.png" alt="imageconds">

!!! note "為何合併後的資料行數變少？"
    雖然日期取聯集，但實際資料只會保留兩者的**重疊時間區間**。例如：cond1 從 2010 開始，cond2 從 2013 開始，合併後的資料從 2013 開始。

## 選股函式

### average(n) - 移動平均

計算 n 期移動平均值。

```py
from finlab import data
close = data.get('price:收盤價')
sma = close.average(10)
cond = close > sma  # 股價在10日均線之上
```

視覺化檢查：

```py
import matplotlib.pyplot as plt

close.loc['2021', '2330'].plot()
sma.loc['2021', '2330'].plot()
cond.loc['2021', '2330'].mul(20).add(500).plot()
plt.legend(['close', 'sma', 'cond'])
```

<img src="https://i.ibb.co/Mg1P85y/sma.png" alt="sma">

### is_largest(n) - 數值最大股票

篩選每日數值最大的前 n 檔股票。

<img width="400px" src="https://i.ibb.co/8rh3tbt/is-largest.png" alt="is-largest">

```py
from finlab import data

roa = data.get('fundamental_features:ROA稅後息前')
good_stocks = roa.is_largest(10)  # 每日 ROA 前 10 名
```

**輸出範例：**

| date    |   000116 |   000538 |   000616 |   000700 |   000779 |
|:--------|---------:|---------:|---------:|---------:|---------:|
| 2013-Q1 |    False |    False |     True |    False |    False |
| 2013-Q2 |    False |    False |    False |    False |     True |
| 2013-Q3 |    False |     True |    False |    False |    False |
| 2013-Q4 |    False |    False |    False |     True |    False |
| 2014-Q1 |     True |    False |    False |    False |    False |

### is_smallest(n) - 數值最小股票

篩選每日數值最小的前 n 檔股票。

```py
from finlab import data

pb = data.get('price_earning_ratio:股價淨值比')
cheap_stocks = pb.is_smallest(10)  # 股價淨值比最小的 10 檔
```

## 訊號進出場(hold_until)

最重要的策略語法，用於設定進出場邏輯：

```py
from finlab import data

close = data.get('price:收盤價')
buy = close > close.average(5)
sell = close < close.average(20)

position = buy.hold_until(sell)
```

當 `buy` 訊號為 `True` 時買入並持有，直到 `sell` 訊號為 `True` 時賣出。

<img src="https://i.ibb.co/PCt4hPd/Screen-Shot-2021-10-26-at-6-35-05-AM.png" alt="Screen-Shot-2021-10-26-at-6-35-05-AM">

### 進階參數

| 參數 | 說明 | 範例 |
|------|------|------|
| **stop_loss** | 停損比例 | `buy.hold_until(sell, stop_loss=0.1)` |
| **take_profit** | 停利比例 | `buy.hold_until(sell, take_profit=0.2)` |
| **nstocks_limit** | 最多持有股票數（類股輪動） | `buy.hold_until(sell, nstocks_limit=5)` |
| **rank** | 選股優先順序（正值為由大到小） | `buy.hold_until(sell, rank=-pb)` |

### 完整策略範例

價格 > 20 日均線入場，價格 < 60 日均線出場，最多持有 10 檔，以股價淨值比小的股票優先。

``` py
from finlab import data
from finlab.backtest import sim

close = data.get('price:收盤價')
pb = data.get('price_earning_ratio:股價淨值比')

entries = close > close.average(20)
exits = close < close.average(60)

position = entries.hold_until(exits, nstocks_limit=10, rank=-pb)
sim(position)
```  

## 數值變化趨勢

### rise(n) - 數值上升中

判斷當前值是否高於 n 期前的值。

<img src="https://i.ibb.co/Y72bN5v/Screen-Shot-2021-10-26-at-6-43-41-AM.png" alt="Screen-Shot-2021-10-26-at-6-43-41-AM">

```py
from finlab import data
data.get('price:收盤價').rise(10)  # 是否高於10日前
```

### fall(n) - 數值下降中

判斷當前值是否低於 n 期前的值。

```py
from finlab import data
data.get('price:收盤價').fall(10)  # 是否低於10日前
```

### sustain(window, count) - 持續滿足條件

判斷在 window 期間內，至少有 count 期滿足條件。

```py
from finlab import data
close = data.get('price:收盤價')

close.rise().sustain(2)      # 連續2日上漲
close.rise().sustain(3, 2)   # 3日中有2日上漲
```

## 其他實用函式

### quantile_row(q) - 股票當天分位數

取得每日橫向的分位數值。

```py
from finlab import data
data.get('price:收盤價').quantile_row(0.9)  # 每日股價前90%分位數
```

### index_str_to_date() - 索引格式轉換

將月季報索引從字串轉為公告截止日。

| 轉換前 | 轉換後 |
|--------|--------|
| 2022-M1（月營收） | 2022-01-10 |
| 2022-Q1（財務季報） | 2022-05-15 |

```py
from finlab import data

data.get('monthly_revenue:當月營收').index_str_to_date()
data.get('financial_statement:現金及約當現金').index_str_to_date()
```

### groupby_category() - 產業分群

按產業別分群資料，類似 `pd.DataFrame.groupby()`。

```py
from finlab import data
pe = data.get('price_earning_ratio:股價淨值比')
pe.groupby_category().mean()['半導體'].plot()  # 半導體平均股價淨值比
```
<img src="https://i.ibb.co/Tq2fKBp/pbmean.png" alt="pbmean">

### is_entry() - 取進場點

從持倉訊號中提取進場時點。

```py
from finlab import data

position = data.get('price:收盤價').is_largest(10)
entry_signals = position.is_entry()
```

### is_exit() - 取出場點

從持倉訊號中提取出場時點。

```py
from finlab import data

position = data.get('price:收盤價').is_largest(10)
exit_signals = position.is_exit()
```
