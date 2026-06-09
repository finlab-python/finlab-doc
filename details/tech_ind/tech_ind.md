支援 TA-Lib 與 pandas_ta 上百種技術指標，一行即可計算數千檔、長年期資料，可用於個股分析與機器學習。

## 安裝ta-lib
在計算前需先安裝 TA-Lib：

* 本地端：可以參考 [官方安裝教學](https://github.com/mrjbq7/ta-lib#installation) 來安裝，支援 Windows、MacOS、Linux。
* Google Colab：請運行以下指令即可：
```py
!pip install ta-lib
```

更多參數與函式請參考 [TA-Lib 官方文件](http://mrjbq7.github.io/ta-lib/doc_index.html)。

## 計算所有股票的 RSI 數值

使用 `data.indicator()` 計算 RSI（`timeperiod=14`）：

```python
from finlab import data
data.indicator('RSI', timeperiod=14)
```

<img src="https://i.ibb.co/ZdNdCWg/Screen-Shot-2021-07-13-at-11-19-57-PM.png" />

前 14 天因資料不足可能為 `NaN`。


## 兩個時間序列的技術指標（KD值）

使用 `data.indicator('STOCH')` 計算 KD 值，會回傳兩個 DataFrame（K、D）。

```python
from finlab import data
k, d = data.indicator('STOCH')
k
```

<img src="https://i.ibb.co/HdrKSxp/Screen-Shot-2021-07-13-at-11-22-56-PM.png" />

## 利用 KD 值來選股

列出最近一日 K > D 的股票：
```python
(k > d).iloc[-1]
```
```python
0015    False
0050     True
0051    False
0052     True
0053     True
        ...  
9951     True
9955    False
9958    False
9960     True
9962     True
Name: 2021-07-13 00:00:00, Length: 2269, dtype: bool
```
上述語法中，(k > d) 會回傳一個 DataFrame 物件，其中每個元素都是一個布林值，代表對應的股票當前的 K 值是否大於 D 值。而 .iloc[-1] 則代表取出最後一列，也就是最近一天的資料。最後，將會回傳一個布林值序列，其中值為 True 的股票代表當前 K > D。

## 計算 Pandas_ta 技術指標

`pandas_ta` 亦可計算多種技術指標；安裝與指標列表請見[官方文件](https://twopirllc.github.io/pandas-ta/#installation)。

```py
pip install pandas-ta
```
在 FinLab 中可直接透過 `data.indicator()` 使用，例如計算 supertrend：

```py
from finlab import data

values = data.indicator('supertrend')
```
若 TA-Lib 無對應函式，將改用 pandas_ta（計算速度可能較慢）。
