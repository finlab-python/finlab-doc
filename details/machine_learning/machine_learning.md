
## 相關函式庫安裝


### 必要安裝
為了讓您順利運行上述的量化投資模型和函數，您需要先安裝一些必要的 Python 套件。別擔心，這個過程非常簡單！以下是您需要添加到您的環境中的套件安裝指令： 


1. 安裝 `finlab` 套件，它提供了許多方便的工具和函數來進行量化投資分析。
2. 安裝 `ta-lib-bin` 套件，這是一個強大的技術分析庫，廣泛應用於金融市場分析中。
3. 安裝 `Qlib`，這是由微軟開源的一個量化投資研究平台，支持全流程的策略開發。

```bash
pip install finlab
pip install ta-lib-bin
pip install git+https://github.com/microsoft/qlib.git
```

如果使用 Colab，會得到 Packaging version 重新安裝的相關提示，請按確認將 kernel 重新啟動(或 Session)，就能正常使用。通過執行上述指令，您將會獲得執行量化分析所需的基礎設施。

!!! tip annotate "LegacyVersion 錯誤處理" 
    假如您是使用 Colab，請直接重新啟動，方法為「執行階段」->「重新啟動執行階段」
    

### 模型函示庫（非必須）

由於 Qlib 當中引用諸多模型，如 LightGBM、XGBoost、CatBoost、線性模型、Pytorch、Tensorflow 和深度神經網絡等，
假如需要用到這些模型，請參考該模型的官方文件，安裝相對應的函式庫。假如您使用 Colab，這些函式庫已經預先安裝好了，不需要再次安裝。

1. [安裝 LightGBM](https://lightgbm.readthedocs.io/en/latest/Installation-Guide.html)
2. [安裝 XGBoost](https://xgboost.readthedocs.io/en/latest/build.html)
3. [安裝 CatBoost](https://catboost.ai/docs/concepts/python-installation.html)
4. [安裝 Pytorch](https://pytorch.org/get-started/locally/)
5. [安裝 Tensorflow](https://www.tensorflow.org/install)


## 特徵處理

### 使用 Combine 函數合併特徵

在金融分析和量化投資領域中，「特徵」是對於預測模型來說至關重要的數據。`combine` 函數是 `finlab.ml.feature` 模組中的一個強大工具，它允許您將多個不同來源的特徵合併成一個統一的 DataFrame，這對於構建和訓練預測模型非常有幫助。

這個函數的優點在於，它可以處理來自不同數據源的特徵，無論是技術指標、基本面分析指標，還是自定義的數據集，都可以通過 `combine` 函數組合起來。此外，它還支持數據的重新取樣，這對於時間序列數據來說尤為重要。

以下是兩個使用 `combine` 函數的範例，展示了如何將不同的數據源合併為一個特徵集： 


1. **合併股價淨值比和本益比為一個特徵集** ：

```python
from finlab import data
from finlab.ml import feature as mlf
features = mlf.combine({
  'pb': data.get('price_earning_ratio:股價淨值比'),
  'pe': data.get('price_earning_ratio:本益比')  
}, resample='W')

features.head()
```

|                                            |     pb |     pe |
|:-------------------------------------------|-------:|-------:|
| (Timestamp('2010-01-04 00:00:00'), '1101') |   1.47 |  18.85 |
| (Timestamp('2010-01-04 00:00:00'), '1102') |   1.44 |  14.58 |
| (Timestamp('2010-01-04 00:00:00'), '1103') |   0.79 |  40.89 |
| (Timestamp('2010-01-04 00:00:00'), '1104') |   0.92 |  73.6  |

在這個範例中，`combine` 函數將股價淨值比（pb）和本益比（pe）這兩個來自 `data.get` 函數的特徵合併成一個 DataFrame。這可以幫助分析師快速地構建出包含這兩種基本面指標的數據集，用於進行後續的分析和模型訓練。 


2. **合併技術指標為一個特徵集** ：

```python
from finlab.ml import feature as mlf
mlf.combine({
  'talib': mlf.ta(mlf.ta_names(n=1))
})
```

|                                            |   talib.HT_DCPERIOD__real__ |   talib.HT_DCPHASE__real__ |   talib.HT_PHASOR__quadrature__ |
|:-------------------------------------------|----------------------------:|---------------------------:|--------------------------------:|
| (Timestamp('2024-04-01 00:00:00'), '9951') |                     23.4372 |                   122.135  |                     -0.0107087  |
| (Timestamp('2024-04-01 00:00:00'), '9955') |                     18.4416 |                    68.0654 |                     -0.0168584  |
| (Timestamp('2024-04-01 00:00:00'), '9958') |                     30.1035 |                   -10.7866 |                      0.159777   |
| (Timestamp('2024-04-01 00:00:00'), '9960') |                     17.5025 |                    94.0009 |                      0.00310615 |
| (Timestamp('2024-04-01 00:00:00'), '9962') |                     23.2931 |                    90.0781 |                     -0.0145453  |


在這個範例中，我們使用 `mlf.ta` 函數和 `mlf.ta_names` 函數來生成一組技術指標特徵。這個過程首先通過 `mlf.ta_names(n=1)` 生成隨機的技術指標，然後 `mlf.ta` 函數根據這個列表計算出相應的指標值。最後，`combine` 函數將這些技術指標合併成一個 DataFrame，為量化策略的開發提供了一組豐富的特徵。

這兩個範例展示了 `combine` 函數的多樣性和靈活性，無論是對於基本面分析還是技術分析，它都能提供強大的數據支持，幫助投資者和分析師在複雜的金融市場中做出更加精準的決策。

### 使用 Talib 產生技術指標

- 當我們在使用 `finlab` 函式庫來開發量化交易策略時，技術指標扮演著極其重要的角色。`finlab` 提供了一套功能強大的工具來幫助我們生成和利用這些技術指標。其中，`ta` 和 `ta_names` 兩個函數是生成技術指標特徵的關鍵。

### ta_names 函數

`ta_names` 函數的作用是生成一系列 TALIB 技術指標的名稱。這些名稱反映了指標的計算方法及其參數。這個函數非常有用，因為它允許我們探索和實驗不同的指標配置，以尋找最佳的特徵組合。 


- **n 參數** ：在 `ta_names` 中，`n` 參數指定了每個指標隨機生成的參數設置數量。舉例來說，如果 `n=10`，那麼對於 TALIB 中的每一個指標，`ta_names` 將會生成 10 種不同參數配置的指標名稱。這允許我們從多種不同的參數設置中選擇，以便更深入地探索數據和策略性能之間的關係。


```python
from finlab.ml import feature as mlf
mlf.ta_names(n=1)
```
```
['talib.HT_DCPERIOD__real__',
 'talib.HT_DCPHASE__real__',
 'talib.HT_PHASOR__quadrature__',
 'talib.HT_PHASOR__inphase__',
 'talib.HT_SINE__sine__',
 'talib.HT_SINE__leadsine__'
 ...
 ]
```
### ta 函數

一旦我們有了指標名稱列表（可以通過 `ta_names` 函數獲得），就可以使用 `ta` 函數來計算這些指標的實際值。`ta` 函數是一個強大的工具，它根據指定的技術指標名稱和參數設置來計算這些指標的值。 

- **功能** ：`ta` 函數接受一個或多個由 `ta_names` 生成的指標名稱，然後計算這些指標的值。這對於特徵工程來說非常重要，因為它讓我們可以根據指標的計算結果來構建預測模型。 

- **靈活性** ：這兩個函數的結合使用提供了極大的靈活性，允許量化分析師和交易者在不同的時間範圍、不同的市場條件下測試和優化他們的策略。

- **resample 參數** : `ta` 函數還支持 `resample` 參數，這個參數可以將計算出來的指標值重新取樣到指定的時間範圍。這對於時間序列數據的處理非常有用，可以幫助我們更好地理解和分析數據。

```python
from finlab.ml import feature as mlf
mlf.ta(['talib.HT_DCPERIOD__real__',
 'talib.HT_DCPHASE__real__',
 'talib.HT_PHASOR__quadrature__'], resample='W')
```

|                                            |   talib.HT_DCPERIOD__real__ |   talib.HT_DCPHASE__real__ |
|:-------------------------------------------|----------------------------:|---------------------------:|
| (Timestamp('2024-04-07 00:00:00'), '9951') |                     23.4372 |                   122.135  |
| (Timestamp('2024-04-07 00:00:00'), '9955') |                     18.4416 |                    68.0654 |
| (Timestamp('2024-04-07 00:00:00'), '9958') |                     30.1035 |                   -10.7866 |
| (Timestamp('2024-04-07 00:00:00'), '9960') |                     17.5025 |                    94.0009 |
| (Timestamp('2024-04-07 00:00:00'), '9962') |                     23.2931 |                    90.0781 |

總結來說，`ta_names` 和 `ta` 函數是 `finlab` 函式庫中用於生成和計算技術指標特徵的兩個核心工具。通過實驗不同的參數設置（使用 `ta_names` 中的 `n` 參數）和計算這些設置下的指標值（使用 `ta` 函數），量化策略開發者可以深入挖掘數據，找到最佳的指標組合來指導他們的交易決策。這種方法為量化投資提供了一個堅實的基礎，幫助投資者在複雜多變的金融市場中保持競爭力。

## 標籤生成

### 使用 Label 函數生成標籤

在金融領域中，標籤生成是一個非常重要的任務。標籤是指對於某個事件或狀態的標記，通常用於訓練機器學習模型或制定交易策略。`finlab` 函式庫提供了一個名為 `label` 的函數，可以幫助我們生成各種不同類型的標籤，從而更好地理解和分析金融數據。

這些函數都是用於計算市場價格在給定期間內的各種變化率，它們可以用於量化策略中，幫助分析和預測價格走勢。下面我將分別介紹每個函數及其使用範例：


### 預測 daytrading_percentage

此函數計算給定周期內市場價格的百分比變化，特別是從開盤價到收盤價的變化。

- **resample 參數** : `daytrading_percentage` 函數支持 `resample` 參數，這個參數必須設定與 `combine` 函數中的 `resample` 參數相同。這樣可以確保標籤和特徵之間的時間對齊。

- **period 參數** : `period` 參數指定了計算百分比變化的時間範圍，例如 `period=1` 表示計算未來一個單位的變化，單位根據 `resample` 參數來確定。

```python
from finlab.ml import feature as mlf
from finlab.ml import label as mll
feature = mlf.combine(...)
label = mll.daytrading_percentage(feature.index)
```

```
datetime    instrument
2007-04-23  0015          0.000000
            0050          0.003454
            0051          0.004874
            0052          0.006510
            01001T        0.001509
dtype: float64
```


### 預測N天後的報酬率

這個函數計算了給定周期內市場價格的百分比變化。它可以用於分析股票的長期表現。

```python
label = mll.return_percentage(feature.index, resample='W', period=1)
```


### Maximum Adverse Excursion

MAE 計算在持有期內可能遭受的最大不利價格變動。這是衡量交易風險的一個重要指標。
目前此函數並不支援 resample，預設為「未來 period 天的最大不利變動」。

```python
label = mll.maximum_adverse_excursion(feature.index, period=1)
```


### Maximum Favorable Excursion

MFE 計算在持有期內可能實現的最大有利價格變動。這可以幫助交易者評估潛在的獲利能力。
目目前此函數並不支援 resample，預設為「未來 period 天的最大有利變動」。

```python
label = mll.maximum_favorable_excursion(feature.index, period=1)
```


### Excess Over Median

這個函數計算的是相對於同期所有股票收益中位數的超額收益。這可以用來識別相對於市場表現較好或較差的股票。

```python
label = mll.excess_over_median(feature.index, resample='M', period=1)
```


### Excess Over Mean

這個函數計算的是相對於同期所有股票收益均值的超額收益。這也是一種評估股票相對表現的方法。

```python
label = mll.excess_over_mean(feature.index, resample='M', period=1)
```



在使用這些函數時，重要的是要確保 `index` 參數正確反映了你想要分析的日期和標的，並且 `ml.get_market()` 能夠正確獲取到相關的市場數據。這些函數的結果可以用來構建特徵，進一步用於建立預測模型或進行市場分析。


## 使用 Qlib 套件模型訓練

- 這段程式碼示範了如何在 Qlib 框架中使用各種機器學習模型進行量化投資策略的開發。`WrapperModel` 是一個封裝類別，用於初始化和適配不同的機器學習模型，包括但不限於 LightGBM、XGBoost、CatBoost、線性模型、Tabnet 和深度神經網絡等。這個封裝使得在 Qlib 中使用這些模型變得更加簡單和統一。

以下是每個模型封裝類別的簡單介紹和範例用法：


### LGBModel

封裝 LightGBM 模型，適用於迅速建立高效的樹模型。

```python
import finlab.ml.qlib as q

# 構建 X_train, y_train, X_test

model = q.LGBModel()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
```

!!! tip annotate "如何建構 X_train, y_train, X_test?" 
    在使用 `LGBModel` 之前，您需要先準備好訓練數據 `X_train` 和 `y_train`，以及測試數據 `X_test`。這些數據應該是 Numpy 數組或 Pandas DataFrame 的形式，並且符合模型的輸入要求。假設 features 是特徵數據，labels 是標籤數據，並且希望以 2020 年以前的資料進行訓練，您可以按照以下方式構建訓練數據和測試數據：

    ```python
    is_train = features.index.get_level_values('datetime') < '2020-01-01'
    X_train = features[is_train]
    y_train = labels[is_train]
    X_test = features[~is_train]
    ```


### XGBModel

封裝 XGBoost 模型，是一個強大的分類和回歸樹模型。

```python
model = q.XGBModel()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
```


### DEnsmbleModel

封裝雙重集成模型，通過結合多個基模型提高預測準確率。

```python
model = q.DEnsmbleModel()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
```


### CatBoostModel

封裝 CatBoost 模型，一個處理類別特徵非常有效的梯度提升決策樹模型。

```python
model = q.CatBoostModel()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
```


### LinearModel

封裝線性模型，適用於線性相關性強的數據集。

```python
model = q.LinearModel()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
```


### TabnetModel

封裝 Tabnet 模型，一種基於神經網絡的表格數據學習模型。

```python
model = q.TabnetModel()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
```


### DNNModel

封裝深度神經網絡模型，適用於複雜的非線性數據集。

```python
model = q.DNNModel()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
```

這些封裝類別為量化策略開發提供了一種快速、高效的方式，使得研究人員可以專注於特徵工程和策略優化，而不需要深入了解每個模型的細節。通過這些封裝，Qlib 旨在簡化量化投資策略開發的複雜性，加速從數據到策略的研發過程。

### get_models


- `get_models` 函數提供了一個快捷方式，讓您能夠訪問並初始化一系列預定義的量化投資模型。這些模型包括了多種機器學習算法，如 LightGBM、XGBoost、CatBoost、線性回歸模型、Tabnet 和深度神經網絡等，涵蓋了從經典算法到最新研究成果的廣泛範圍。

使用 `get_models` 函數，您可以輕鬆地獲取到所有可用模型的實例，而不需要手動初始化每一個模型。這在您需要試驗多種模型以找出最適合您數據的算法時特別有用。

下面是一個如何使用 `get_models` 函數來獲取模型列表和初始化特定模型的示例：

```python
import finlab.ml.qlib as q

# 獲取所有可用的模型
models = q.get_models()

# 列印出所有模型的名稱
print(list(models.keys()))

# 選擇一個模型進行實例化，例如 LightGBM
model = models['LGBModel']()

# 假設已經準備好了訓練數據和測試數據 X_train, y_train, X_test

# model
model.fit(X_train, y_train)

# 使用訓練好的模型進行預測
y_pred = model.predict(X_test)
```

這段代碼首先從 `get_models` 函數獲取所有可用的模型，然後列印出這些模型的名稱。接著，選擇其中一個模型（例如 `LGBModel`）進行實例化，並使用準備好的訓練數據進行訓練。最後，使用訓練好的模型對測試數據進行預測。

`get_models` 函數簡化了模型選擇和初始化的過程，讓您能夠更加專注於模型的訓練和評估，加快量化策略的研發周期。


## 進行回測

- 回測是量化投資策略開發過程中的一個重要步驟，它通過歷史數據模擬交易策略的表現，幫助研究人員評估策略的有效性和風險。`finlab` 函式庫提供了一個名為 `sim` 的函數，可以幫助您進行回測，並計算策略的收益率和風險指標。

```python
from finlab.backtest import sim

position = y_pred.is_largest(50)

sim(position, resample='4W')
```

這段程式碼首先根據模型預測的結果生成交易信號 `position`，然後使用 `sim` 函數進行回測。`resample` 參數指定了回測的時間範圍，這對於計算收益率和風險指標非常重要。`sim` 函數將返回一個包含回測結果的 DataFrame，包括每個交易周期的收益率、最大回撤、夏普比率等指標。透過回測，您可以評估您的量化投資策略在歷史數據上的表現，並根據回測結果進行策略的優化和調整。這有助於提高策略的穩定性和收益率，並幫助您在真實市場中取得更好的投資表現。

