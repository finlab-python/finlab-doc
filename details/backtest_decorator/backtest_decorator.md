# 計算選股條件

由於我們下載的財經資料，多半是縱軸為日期，橫軸為股票的表格，這種表格的名稱是 `pd.DataFrame`，是在 Python 做運算時常會用到的工具。假如您沒有接觸過，建議您先參考[10分鐘學會Pandas](https://hackmd.io/@wiimax/10-minutes-to-pandas)的教學，先來對表格操作有一定的瞭解。

瞭解了 Pandas 的基本原理，我們在原本的 DataFrame 之上，又做了很多選股專用的功能，讓大家可以用簡短的程式碼，有強大的效果，這個增強版的 DataFrame 叫做 FinlabDataFrame!

## 為什麼要有 FinlabDataFrame?

開發策略時，可以用 FinlabDataFrame 簡易的語法完成複雜的選股條件，讓開發策略更簡潔！

## 與一般 Dataframe 不同之處：

運算皆跟一般的 `pd.DataFrame` 一模一樣，除了以下兩個方面

1. 多了一些額外的函式，如 `df.is_largest()`, `df.sustain()` 等，下方會有更詳細的介紹。
2. 在做四則運算、不等式運算前，會自動將 df1、df2 對齊運算，下方會有更詳細的介紹。

## 創建 FinlabDataFrame

只要使用 `finlab.data.get()` 所獲得的資料，皆為 `FinlabDataFrame` 格式。

假如你有現成的 Pandas DataFrame ，可以使用以下語法，將原本的 `Dataframe` 轉換成 `FinlabDataFrame`
```py
import pandas as pd
from finlab.dataframe import FinlabDataFrame

df = pd.DataFrame()
df_finlab = FinlabDataFrame(df)
```

接下來我們就來看看， `FinlabDataFrame` 有哪些好用的功能吧！

## 日月季不等式、四則運算

與一般的 `pd.DataFrame` 非常類似，也就是對於每個相同位置的數字去做操作。
可以使用以下運算符號進行算術運算、比較運算和邏輯運算。

* 算術運算符號：+, -, *, /
    * 使用 + 運算符號可以將兩個 DataFrame 中對應位置的元素相加。
    * 使用 - 運算符號可以將兩個 DataFrame 中對應位置的元素相減。
    * 使用 * 運算符號可以將兩個 DataFrame 中對應位置的元素相乘。
    * 使用 / 運算符號可以將兩個 DataFrame 中對應位置的元素相除。
* 比較運算符號：>, >=, ==, <, <=
    * 使用 > 運算符號可以比較兩個 DataFrame 中對應位置的元素是否大於。
    * 使用 >= 運算符號可以比較兩個 DataFrame 中對應位置的元素是否大於等於。
    * 使用 == 運算符號可以比較兩個 DataFrame 中對應位置的元素是否相等。
    * 使用 < 運算符號可以比較兩個 DataFrame 中對應位置的元素是否小於。
    * 使用 <= 運算符號可以比較兩個 DataFrame 中對應位置的元素是否小於等於。
* 邏輯運算符號：&, |, ~
    * 使用 & 運算符號可以對兩個 DataFrame 中對應位置的元素進行「且」邏輯運算。
    * 使用 | 運算符號可以對兩個 DataFrame 中對應位置的元素進行「或」邏輯運算。
    * 使用 ~ 運算符號可以對一個 DataFrame 中的元素進行「非」邏輯運算。

以下就是一個簡單的例子，撰寫選股條件，為收盤價介於 10 ~ 100 的股票
```py
from finlab import data

close = data.get('price:收盤價')

# 收盤價位於 10 ~ 100 之間
between_10_100 = (close > 10) & (close < 100)
```

!!! note "資料頻率對齊，輕鬆解決"
    當資料日期沒有對齊（例如: 財報 vs 收盤價 vs 月報）時，您不需要使用`df1.reindex(df2)`將資料對齊，因為 `FinlabDataFrame` 會自動幫你處理，運算元素前，會先進行兩步程序：

    * 將 index 的日期取聯集，並將缺值做以最近的數值填補 (`forward fill`)，引含的意思是，假如當天沒有資料，則使用近期公布的數據。
    * 將 column 股票代號取交集，引含的意思是，股票假如沒有相對應的財務資料，就會被剔除。


以下是範例：`cond1` 與 `cond2` 分別為「每天」，和「每季」的資料，假如要取交集的時間，可以用以下語法：

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

擷取 1101 台泥 的訊號如下圖，可以看到 `cond1` 跟 `cond2` 訊號的頻率雖然不相同，但是由於 `cond1` 跟 `cond2` 是 `FinlabDataFrame`，所以可以直接取交集，而不用處理資料頻率對齊的問題。


<img src="https://i.ibb.co/m9chXSQ/imageconds.png" alt="imageconds">

!!! note "為何上面範例的 cond_1_2 的 row 數量比 cond1 少？不是取聯集嗎？"
    上述 cond1 的資料從 2010 開始，而 cond2 的資料從 2013 年開始，所以當兩個 dataframe 合併時，新的資料只會擷取上述兩種資料的重疊的時間，所以新資料起使日為 2013 年開始！而非2010 年，造成資料 row 的數量比 cond1 少喔！

## 均線 (average)

取 n 筆移動平均，若股票在時間窗格內，有 N/2 筆 NaN，則會產生 NaN。

``` py  title="股價在10日均線之上"
from finlab import data
close = data.get('price:收盤價')
sma = close.average(10)
cond = close > sma
```
只需要簡單的語法，就可以將其中一部分的訊號繪製出來檢查：
```py
import matplotlib.pyplot as plt

close.loc['2021', '2330'].plot()
sma.loc['2021', '2330'].plot()
cond.loc['2021', '2330'].mul(20).add(500).plot()

plt.legend(['close', 'sma', 'cond'])
```
<img src="https://i.ibb.co/Mg1P85y/sma.png" alt="sma">

## 數值最大的 n 檔股票(is_largest)
`FinlabDataFrame.is_largest(n)`
取每列前 n 筆大的數值，若符合 `True` ，反之為 `False` 。用來篩選每天數值最大的股票

<img width="400px" src="https://i.ibb.co/8rh3tbt/is-largest.png" alt="is-largest">

``` py title="選股範例：每季 ROA 前 10 名的股票"
from finlab import data

roa = data.get('fundamental_features:ROA稅後息前')
good_stocks = roa.is_largest(1)
```

| date    |   000116 |   000538 |   000616 |   000700 |   000779 |
|:--------|---------:|---------:|---------:|---------:|---------:|
| 2013-Q1 |    False |    False |     True |    False |    False |
| 2013-Q2 |    False |    False |    False |    False |     True |
| 2013-Q3 |    False |     True |    False |    False |    False |
| 2013-Q4 |    False |    False |    False |     True |    False |
| 2014-Q1 |     True |    False |    False |    False |    False |


## 數值最小的 n 檔股票(is_smallest)
取每列前 n 筆小的數值，若符合 `True` ，反之為 `False` 。用來篩選每天數值最小的股票。

``` py title="範例：股價淨值比最小的 10 檔股票"
from finlab import data

pb = data.get('price_earning_ratio:股價淨值比')
cheap_stocks = pb.is_smallest(10)
```

## 訊號進出場(hold_until)

這是所有策略撰寫中，最重要的語法糖，用法為：

```py
from finlab import data

close = data.get('price:收盤價')
buy = close > close.averate(5)
sell = close < close.average(20)

position = buy.hold_until(sell)
```

上述語法中 `buy` 為進場訊號，而 `sell` 是出場訊號。所以 `buy.hold_until(sell)` ，就是進場訊號為 `True` 時，買入並持有該檔股票，直到出場訊號為 `True ` 則賣出。

<img src="https://i.ibb.co/PCt4hPd/Screen-Shot-2021-10-26-at-6-35-05-AM.png" alt="Screen-Shot-2021-10-26-at-6-35-05-AM">

!!! note "停損停利"

    利用 `hold_until` 除了客製化出場以外，還可以設定額外的停損停利，使用方法為：

    ```py
    buy.hold_until(sell, stop_loss=0.1, take_profit=0.2, trade_at_price='close')
    ```

    以收盤價當成依據，假如進場後，觸發停損10%，獲釋觸發停利20%，則就算沒有賣出訊號，也會執行賣出的動作。


!!! note "類股輪動"

    可以讓你最多選擇 N 檔股票做輪動，當持有股票數量等於 N 時，將不在額外買入新的持股，而是保持當前部位，直到您的部位當中發生賣出訊號，才會再根據新的買入訊號，蒐集新的股票，直到持有股票數量等於 N 時停止。
    雖然此功能乍看之下很複雜，但其實只要設定一個額外的參數 `nstocks_limit` 即可完成：

    ```py
    position = buy.hold_until(sell, nstocks_limit=5)
    ```

!!! note "類股輪動優先度"

    當使用類股輪動時，往往會遇到當天有數檔股票都有進場訊號，此時可以設定優先程度，優先度高的進場訊號，會提早被選取，例如我們可以選擇股價高的股票優先進場：
    
    ```py
    position = buy.hold_until(sell, nstocks_limit=5, rank=close)
    
    ```

    假如想選擇股價低的股票優先進場，則設定 `rank=-close` 即可。

!!! note "完整策略範例"
  
    價格 > 20 日均線入場, 價格 < 60 日均線出場，最多持有10檔，超過 10 個進場訊號，則以股價淨值比小的股票優先選入。
    
    ``` py title="選股策略"
    from finlab import data
    from finlab.backtest import sim
    
    close = data.get('price:收盤價')
    pb = data.get('price_earning_ratio:股價淨值比')	
    
    sma20 = close.average(20)
    sma60 = close.average(60)
    
    entries = close > sma20
    exits = close < sma60
    
    position = entries.hold_until(exits, nstocks_limit=10, rank=-pb)
    sim(position)
    ```  

## 數值上升中(rise)

取是否比前第n筆高，若符合條件的值則為True，反之為False。
<img src="https://i.ibb.co/Y72bN5v/Screen-Shot-2021-10-26-at-6-43-41-AM.png" alt="Screen-Shot-2021-10-26-at-6-43-41-AM">

```py title="收盤價是否高於10日前股價"
from finlab import data
data.get('price:收盤價').rise(10)
```

## 數值下降中(fall)

取是否比前第n筆低，若符合條件的值則為True，反之為False。

```py title="收盤價是否低於10日前股價"
from finlab import data
data.get('price:收盤價').fall(10)
```

## 持續 N 天滿足條件(sustain)
取移動 nwindow 筆加總大於等於nsatisfy，若符合條件的值則為True，反之為False。

```py title="收盤價是否連兩日上漲"
from finlab import data
data.get('price:收盤價').rise().sustain(2)
```

```py title="收盤價是否三天中有兩天上漲"
from finlab import data
data.get('price:收盤價').rise().sustain(3, 2)
```

## 股票當天數值分位數(quantile_row)

取得每列n定分位數的值。

```py title="取每日股價前90％分位數"
from finlab import data
data.get('price:收盤價').quantile_row(0.9)
```

## 財務月季報索引格式轉換(index_str_to_date)
`FinlabDataFrame.index_str_to_date()`

將資料的 index 名稱從原本的字串:

* 月營收 (ex:2022-M1) 
* 財務季報 (ex:2022-Q1) 

轉換成

* 月營收 (ex:2022-01-10) 
* 財務季報 (ex:2022-05-15) 

從文字格式轉為公告截止日的 `datetime` 格式，通常使用情境為對不同週期的 `dataframe`做 `reindex`，常用於以公告截止日為訊號產生日的時候。

```py
from finlab import data

data.get('monthly_revenue:當月營收').index_str_to_date()
data.get('financial_statement:現金及約當現金').index_str_to_date()
```

## 產業分群(groupby_category)

資料按產業分群，類似 `pd.DataFrame.groupby()`。

```py title="半導體平均股價淨值比時間序列"
from finlab import data
pe = data.get('price_earning_ratio:股價淨值比')
pe.groupby_category().mean()['半導體'].plot()
```
<img src="https://i.ibb.co/Tq2fKBp/pbmean.png" alt="pbmean">

全球 2020 量化寬鬆加上晶片短缺，使得半導體股價淨值比衝高。


## 進場點(is_entry)
取進場訊號點，若符合條件的值則為True，反之為False。

```py title="策略為每日收盤價前10高，取進場點"
from finlab import data

data.get('price:收盤價').is_largest(10).is_entry()
```

## 出場點(is_exit)

取出場訊號點，若符合條件的值則為 True，反之為 False。

```py title="策略為每日收盤價前10高，取出場點。"
from finlab import data

data.get('price:收盤價').is_largest(10).is_exit()
```
