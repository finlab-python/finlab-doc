---
hide:
  - navigation
---

# 快速上手

## 安裝

在任意平台上，皆可安裝 FinLab Package，我們支援 Windows、MacOS、Linux，並且甚至是 Pyodide！
以新手來說，推薦的使用方式是直接在 [Google Colab](https://colab.research.google.com/)，來使用。
Google Colab 可以線上產生一個執行 Python 的環境，使用者不需額外在本機安裝任何程式，即可開始使用。

=== ":octicons-code-16: FinLab 實驗室"
    ``` 
    打開選股策略頁面
    https://ai.finlab.tw/strategies
    並點選「建立策略」即可開始使用。
    ```

=== ":octicons-code-16: Google Colab"
    ``` py
    # 打開 Colab: https://colab.research.google.com/ 新增筆記本
    # 在 Colab 中任意 Cell 中執行

    !pip install finlab > log.txt

    # 即可
    ```

=== ":octicons-code-16: 本機 Python"
    ``` py
    # 在 anacnoda prompt 中執行

    pip install finlab
    ```
    !!! tip annotate "可能存在相容性問題"
        用「pip install finlab」方法安裝，可能會造成 Package 不相容的問題，假如您希望得到更穩定的版本，請參考「Docker」安裝。


=== ":octicons-code-16: Docker 安裝"
    <div style="border: 1px solid #ccc;padding: 2rem;" markdown>
    ### 1. 安裝 Docker
    請按照下列步驟安裝 Docker：

    * 前往 Docker 官方網站：https://www.docker.com/products/docker-desktop。
    * 在下載頁面中，按一下「Download Docker Desktop」按鈕。
    * 完成下載後，執行安裝程式並按照提示進行安裝。

    ### 2. 下載 FinLab 的 Jupyter 映像檔
    在安裝 Docker 完成後，請按照以下步驟從 Docker Hub 下載 FinLab 的 Jupyter 映像檔：

    開啟終端機或命令提示字元。

    輸入以下命令以下載 FinLab 的 Jupyter 映像檔：

    ```bash
    docker pull finlab/jupyter-finlab
    ```
    此命令將會從 Docker Hub 下載映像檔，請耐心等待下載完成。

    ### 3. 執行映像檔並連接到 8888:8888 的 IP 位址
    下載完成後，您可以使用以下命令執行映像檔：

    ```bash
    docker run -p 8888:8888 finlab/jupyter-finlab
    ```
    此命令將會啟動一個容器並將容器內部的 8888 埠口映射到您的本機 8888 埠口。請耐心等待容器啟動完成，終端機中將會顯示一個 URL，例如：

    ```bash
    http://127.0.0.1:8888/
    ```
    請複製該 URL，稍後您將使用它來連接到 JupyterLab。

    ### 4. 使用 JupyterLab 和 FinLab 套件
    現在您已經成功啟動了 JupyterLab，請按照以下步驟進一步使用 JupyterLab 和 FinLab 套件：

    在瀏覽器中打開剛剛複製的 URL。這將會顯示 JupyterLab 的介面。
    在 JupyterLab 的介面中，您可以創建新的 Jupyter Notebook 。
    在 Notebook 中，您可以使用 FinLab 提供的功能和套件。FinLab 是一個針對金融數據分析和策略回測的 Python 套件，詳細的使用方法請參考 FinLab 的官方文件。
    </div>



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

這邊的 `position` 是一個 False/True 的查詢表，當數值為 True ，代表該股票在當天有創新高，而數字 False 則代表沒有創新高。由於創新高的股票很少，上面的範例中，只有少數股票的數值會是 True。

假設我們希望每個月底，搜尋上表中數值為 True 的股票並且買入持有一個月，可以用以下的語法：

## 回測績效

``` py
from finlab import backtest

report = backtest.sim(position, resample='M')
report.display()
```

![image](https://i.ibb.co/7kNyvhP/Screen-Shot-2021-07-13-at-11-54-29-PM.png)
