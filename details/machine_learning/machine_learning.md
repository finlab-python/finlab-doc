
## 相關函式庫安裝


### 必要安裝
安裝核心套件（finlab、TA-Lib）：

```bash
pip install finlab
pip install ta-lib
```


### 模型函式庫（選用）
`finlab.ml.qlib` 可搭配多種模型（LightGBM、XGBoost、CatBoost、PyTorch、TensorFlow 等）。需要時依官方文件安裝；Colab 多數已預裝。

1. [安裝 LightGBM](https://lightgbm.readthedocs.io/en/latest/Installation-Guide.html)
2. [安裝 XGBoost](https://xgboost.readthedocs.io/en/latest/build.html)
3. [安裝 CatBoost](https://catboost.ai/docs/concepts/python-installation.html)
4. [安裝 Pytorch](https://pytorch.org/get-started/locally/)
5. [安裝 Tensorflow](https://www.tensorflow.org/install)


## 特徵處理

### 使用 Combine 函數合併特徵
`finlab.ml.feature.combine` 可合併多來源特徵（技術、基本面、自定義），並支援重採樣。範例如下：


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

將 pb 與 pe 合併為一個特徵集。


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
`finlab.ml.label` 提供多種報酬/風險標籤計算，便於訓練預測模型。


### 預測 daytrading_percentage

此函數計算給定周期內市場價格的百分比變化，特別是從開盤價到收盤價的變化。

- `resample`：需與 `combine` 的 `resample` 一致，以對齊時間。
- `period`：計算未來 N 期（由 `resample` 定義）的變化。

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

計算在給定周期內的百分比變化，用於分析中長期表現。

```python
label = mll.return_percentage(feature.index, resample='W', period=1)
```


### Maximum Adverse Excursion

MAE：持有期內的最大不利變動（目前不支援 `resample`）。

```python
label = mll.maximum_adverse_excursion(feature.index, period=1)
```


### Maximum Favorable Excursion

MFE：持有期內的最大有利變動（目前不支援 `resample`）。

```python
label = mll.maximum_favorable_excursion(feature.index, period=1)
```


### Excess Over Median

相對同期全市場收益「中位數」的超額收益。

```python
label = mll.excess_over_median(feature.index, resample='M', period=1)
```


### Excess Over Mean

相對同期全市場收益「均值」的超額收益。

```python
label = mll.excess_over_mean(feature.index, resample='M', period=1)
```



請確保 `index` 與市場設定正確；標籤可直接搭配特徵用於模型訓練。


## 使用 Qlib 套件模型訓練

- 這段程式碼示範了如何在 Qlib 框架中使用各種機器學習模型進行量化投資策略的開發。`WrapperModel` 是一個封裝類別，用於初始化和適配不同的機器學習模型，包括但不限於 LightGBM、XGBoost、CatBoost、線性模型、Tabnet 和深度神經網絡等。這個封裝使得在 Qlib 中使用這些模型變得更加簡單和統一。

以下是每個模型封裝類別的簡單介紹和範例用法：


### LGBModel

封裝 LightGBM 模型。

```python
import finlab.ml.qlib as q

# 構建 X_train, y_train, X_test

model = q.LGBModel()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
```

!!! tip annotate "如何建構 X_train, y_train, X_test?" 
    以 2020 年前為訓練集的範例：

    ```python
    is_train = features.index.get_level_values('datetime') < '2020-01-01'
    X_train = features[is_train]
    y_train = labels[is_train]
    X_test = features[~is_train]
    ```


### XGBModel

封裝 XGBoost 模型。

```python
model = q.XGBModel()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
```


### DEnsmbleModel

封裝雙重集成模型。

```python
model = q.DEnsmbleModel()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
```


### CatBoostModel

封裝 CatBoost 模型。

```python
model = q.CatBoostModel()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
```


### LinearModel

封裝線性模型。

```python
model = q.LinearModel()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
```


### TabnetModel

封裝 TabNet 模型。

```python
model = q.TabnetModel()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
```


### DNNModel

封裝深度神經網絡模型。

```python
model = q.DNNModel()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
```

封裝讓你專注在特徵與策略，不必陷入模型細節。

### get_models

`get_models` 可快速取得可用模型清單並初始化，方便進行多模型試驗。

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

以上展示如何列出模型、建立 `LGBModel` 並訓練/預測。


## 進行回測

使用 `sim` 進行回測，計算策略收益與風險指標：

```python
from finlab.backtest import sim

position = y_pred.is_largest(50)

sim(position, resample='4W')
```

以上用模型排名產生 `position`，以 `resample` 指定回測頻率並執行回測。
