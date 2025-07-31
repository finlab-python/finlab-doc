FinLab 支援 talib 和 pandas_ta 上百種技術指標！只需要一行，幫你算出2000檔股票、10年的所有資訊！可以用於個股分析、機器學習，用法非常簡單，功能非常強大！

## 安裝ta-lib
在計算技術指標前，必需要先安裝 talib 套件，

* 本地端：可以參考 [官方安裝教學](https://github.com/mrjbq7/ta-lib#installation) 來安裝，支援 Windows、MacOS、Linux。
* Google Colab：請運行以下指令即可：
```py
!pip install ta-lib-bin
```

建議使用者可以先參考以下範例，並且搭配 [talib官方文件](http://mrjbq7.github.io/ta-lib/doc_index.html)，就可以掌握製作技術指標的方法了。

## 計算所有股票的 RSI 數值

使用 finlab 套件計算 RSI：使用 data.indicator() 函式計算 RSI，需指定 timeperiod 參數為 14，代表使用 14 天的資料來計算 RSI。計算完畢後，會回傳一個 DataFrame 物件，其中包含所有股票的 RSI 數值。

```python
from finlab import data
data.indicator('RSI', timeperiod=14)
```

<img src="https://i.ibb.co/ZdNdCWg/Screen-Shot-2021-07-13-at-11-19-57-PM.png" />

上圖中，可以看到資料包含 `NaN` ，代表資料筆數不足，無法計算出數值，每一檔股票除了剛開始的 14 天外，幾乎都會有數值。


## 兩個時間序列的技術指標（KD值）

使用 finlab 套件計算 KD 值：使用 data.indicator() 函式計算 KD 值，預設 timeperiod 為 9，slowk_period 為 3，slowd_period 為 3，使用的是三倍平滑移動平均線來計算 K 值和 D 值。計算完畢後，會回傳兩個 DataFrame 物件，分別代表所有股票的 K 值和 D 值。

```python
from finlab import data
k, d = data.indicator('STOCH')
k
```

<img src="https://i.ibb.co/HdrKSxp/Screen-Shot-2021-07-13-at-11-22-56-PM.png" />

## 利用 KD 值來選股

延續上述的範例二，假如我們希望將最近一天 K > D 值的股票清單列出來，可以用以下語法
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

Pandas_ta 是一個 Python 套件，用於計算金融市場的技術指標。這些指標包括 RSI、MACD、布林通道等等。Pandas_ta 以 pandas DataFrame 為輸入，並返回 DataFrame 包含計算出的技術指標。Pandas_ta 的使用方法很簡單，只需在 Python 中安裝該套件並導入，然後使用該套件提供的函數即可計算指定的技術指標。套件安裝方法及指標選項請見[Pandas_ta官方文件](https://twopirllc.github.io/pandas-ta/#installation)

```py
pip install pandas-ta
```
在 Finlab 中，我們將 Pandas_ta 整合到我們的數據庫中，以便計算大量的股票的技術指標。使用方式很簡單，只需調用 data.indicator() 函數，並將所需的技術指標名稱傳遞給該函數。例如，如果要計算 supertrend 技術指標，只需調用以下代碼：

```py
from finlab import data

values = data.indicator('supertrend')
```
這個代碼會返回一個包含 supertrend 指標數值的 DataFrame，該 DataFrame 包含多個股票的數值，每個股票一列。`data.indicator` 將優先使用 TaLib 中的函數計算技術指標。如果 TaLib 中沒有對應的函數，則 Pandas_ta 會被用來計算指標。儘管 Pandas_ta 非常強大，但它的計算速度可能會比 TaLib 慢，所以在計算許多股票的指標時，您可能需要耐心等待。
