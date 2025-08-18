一行程式快速抓取豐富的股市資料庫！台股市場你想的到，想不到的資料，我們幾乎都有提供喔！

## 下載資料
資料獲取方法，就是使用 `data.get` 函式，一次搞定下載 2000 檔股票 10 年以上的歷史紀錄：

```python
from finlab import data
close = data.get('price:收盤價')
```

|  date   | 1001 | ... | 2330 |
|  ----  | ----  | ---- | ----  |
| 2007-04-23  | 39.65 | ... | 38.3  |
| ... | ... | ... | ... |
| 2023-05-02  | 39.85 | ... | 38.85   |

獲得的資料，為 `FinlabDataFrame`，功能類似於 [Pandas DataFrame](https://pandas.pydata.org/docs/user_guide/index.html)，熟悉 Pandas 的用戶馬上就可以將資料做處理，假如您不熟悉 Pandas，我們建議您閱讀 [Pandas 10分鐘上手](https://hackmd.io/@wiimax/10-minutes-to-pandas)。

* 縱軸(row): 是市場有交易的日期的收盤價。
* 橫軸(column): 為股票代號，製作選股策略非常方便。

!!! tip annotate "如何跳過要求登入?"
    您可以使用下方的自動登入語法，跳過人工登入的過程，讓您自動登入！

!!! tip annotate "還有提供哪些資料呢？"
    您可以到[資料庫目錄](https://ai.finlab.tw/database)複製想獲取的資料的使用方法。

!!! info annotate "免費資料比較短一點喔"
    假如使用者為免費試用之會員，還是可以下載到大部分的資料，供您回測使用，但並不會提供近年的資料，所以假如測試完畢，覺得本功能合適，歡迎參考[VIP完整功能](https://ai.finlab.tw/pricing)




## 自動登入取得歷史資料

在下載資料前，你需要先登入 FinLab，才能獲取資料。如果你使用 Jupyter 或 Google Colab，可以透過 GUI 介面來登入，系統通常會自己跳出來請你登入。但其他狀況，例如您並非使用 Jupyter 或 Colab ，而是用 VSCode 或執行純 Python 腳本，則可以透過以下步驟來登入：

首先，你需要取得你的 API token，可以在 [會員專區](https://ai.finlab.tw/member_info) 中找到。

複製你的 API token，以登入 FinLab：

```python
import finlab
finlab.login('YOUR_API_TOKEN')
```

!!! tip annotate "更安全的寫法" 
    可以利用環境變數設定，避免您的 API_TOKEN 外流，以下設定方式需要每次開啟 Terminal 重新設定，假如您並非軟體工程背景，可跳過此步驟。

    === "Windows"
        打開命令提示視窗，並輸入
        ```
        set FINLAB_API_TOKEN=<YOUR_API_TOKEN>
        ```

    === "MacOS / Linux"
        打開 terminal
        ```
        export FINLAB_API_TOKEN=<YOUR_API_TOKEN>
        ```

## 市場與類股範圍

在台灣股市，市場範圍 (market) 可以選擇以下五個：

* `ALL`：代表全市場，包括上市、上櫃、興櫃、公開發行等所有股票。
* `TSE`：代表上市，即在台灣證券交易所上市的公司股票。
* `OTC`：代表上櫃，即在台灣證券櫃檯買賣中心上市的公司股票。
* `TSE_OTC`：代表上市櫃，包括在台灣證券交易所及櫃檯買賣中心上市的公司股票。
* `ETF`：代表交易型基金，是一種可以像股票一樣交易的基金。

而類股範圍 (category) 則是按照行業分類，可以選擇以下 30 個產業：

`光電業`
`其他電子業`
`化學工業`
`半導體`
`塑膠工業`
`存託憑證`
`建材營造`
`文化創意業`
`橡膠工業`
`水泥工業`
`汽車工業`
`油電燃氣業`
`玻璃陶瓷`
`生技醫療`
`生技醫療業`
`紡織纖維`
`航運業`
`觀光事業`
`貿易百貨`
`資訊服務業`
`農業科技`
`通信網路業`
`造紙工業`
`金融`
`鋼鐵工業`
`電器電纜`
`電子商務`
`電子通路業`
`電子零組件`
`電機機械`
`電腦及週邊`
`食品工業`

ETF 相關類股，可以使用

* `domestic_etf`:以台股為成分股之 ETF
* `foreign_etf`: 以國外商品為成分股之 ETF
* `leveraged_etf`: 槓桿型 ETF
* `vanilla_futures_etf`: 無槓桿期貨 ETF
* `leveraged_futures_etf`: 槓桿型期貨 ETF

如果想要限定範圍，可以使用 `data.universe` 函式來設定篩選條件。例如，如果要抓取在上市櫃中的水泥產業股票收盤價，可以使用以下程式碼：

```python
from finlab import data

with data.universe(market='TSE_OTC', category=['水泥工業']):

    price = data.get('price:收盤價')
```

這樣就會取得在上市櫃中的水泥產業股票收盤價的資料:

<img src="https://i.ibb.co/ynWR1gt/Screen-Shot-2021-07-13-at-11-17-06-PM.png" />


!!! tip annotate "取消模糊比對" 
    **使用正規表達式選取**：由於程式是使用 regex 來進行比對，所以會變成模糊比對，當 categories 是「其他」，則會選出所有的「其他」類股，包含「其他證券」。如果使用者如果希望選出「其他」但不想要選出「其他證券」，可以使用以下方式：
                    
    ``` py
    with universe('TSE_OTC', ['^其他$']):
        close_subset = data.get('price:收盤價')
        print(close_subset)
    ```

    這樣就會明確指明開頭跟結尾中間，只有「其他」的類股會被選出來。
