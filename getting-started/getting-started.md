---
hide:
  - navigation
---

# 快速上手

## 安裝

支援 Windows、macOS、Linux 與 Colab；也可用 Docker。

=== ":octicons-code-16: AI 自動寫程式"
    ```
    - 前往 `https://studio.finlab.tw/` 直接與 AI 對話撰寫策略。
    ```

=== ":octicons-code-16: Google Colab"
    ```py
    # Colab 新增 Notebook 後執行
    !pip install finlab
    ```

=== ":octicons-code-16: 本機 Python"
    ```bash
    pip install finlab
    ```
    !!! tip "相容性提示"
        若遇到套件相依問題，建議改用 Docker 版本。

=== ":octicons-code-16: Docker"
    ```bash
    docker pull finlab/jupyter-finlab
    docker run -p 8888:8888 finlab/jupyter-finlab
    # 依終端顯示的 URL 開啟 JupyterLab
    ```

## 下載資料

輸入以下程式碼，即可下載資料。可以[查詢](https://ai.finlab.tw/database)有哪些歷史資料可以下載。

``` py
from finlab import data
data.get('price:收盤價')
```

| date       |   0015 |   0050 |   0051 |   0052 |   0053 |
|:-----------|-------:|-------:|-------:|-------:|-------:|
| 2007-04-23 |   9.54 |  57.85 |  32.83 |  38.4  |    nan |
| 2007-04-24 |   9.54 |  58.1  |  32.99 |  38.65 |    nan |
| 2007-04-25 |   9.52 |  57.6  |  32.8  |  38.59 |    nan |
| 2007-04-26 |   9.59 |  57.7  |  32.8  |  38.6  |    nan |
| 2007-04-27 |   9.55 |  57.5  |  32.72 |  38.4  |    nan |

## 撰寫策略

可以用非常簡單的 `Pandas` 語法來撰寫策略邏輯，以創新高的策略來說，可以用以下的寫法：

``` py
from finlab import data

close = data.get('price:收盤價')

# 創三百個交易日新高
position = close >= close.rolling(300).max()
position
```

| date                |   0015 |   0050 |   0051 |   0052 |   0053 |
|:--------------------|-------:|-------:|-------:|-------:|-------:|
| 2007-04-23 00:00:00 |  False |  False |  False |  False |  False |
| 2007-04-24 00:00:00 |  False |  False |  False |  False |  False |
| 2007-04-25 00:00:00 |  False |  False |  False |  False |  False |
| 2007-04-26 00:00:00 |  False |  False |  False |   True |  False |
| 2007-04-27 00:00:00 |  False |  False |  False |  False |  False |


假設我們希望每個月底，搜尋上表中數值為 True 的股票並且買入持有一個月，可以用以下的語法：

## 回測績效

``` py
from finlab import backtest

report = backtest.sim(position, resample='M')
report.display()
```

![image](https://i.ibb.co/7kNyvhP/Screen-Shot-2021-07-13-at-11-54-29-PM.png)
