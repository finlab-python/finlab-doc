一行程式抓取台股關鍵資料。大多數常用財報與行情都可直接取得。

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

回傳型別為 `FinlabDataFrame`（擴充版 Pandas DataFrame）。熟悉 Pandas 可直接上手；初學者可先讀 [Pandas 10 分鐘上手](https://hackmd.io/@wiimax/10-minutes-to-pandas)。

* 縱軸(row): 是市場有交易的日期的收盤價。
* 橫軸(column): 為股票代號，製作選股策略非常方便。

!!! tip annotate "如何跳過要求登入?"
    可使用程式登入（下方有範例），免去 GUI 驗證。

!!! tip annotate "還有提供哪些資料呢？"
    至[資料庫目錄](https://ai.finlab.tw/database)查找可用資料與鍵名。

!!! info annotate "免費資料比較短一點喔"
    免費用戶可下載多數資料供回測，但不含近年資料。升級 [VIP](https://finlab.finance/payment) 以使用最新資料。




## 自動登入取得歷史資料

下載前請先登入。Jupyter/Colab 會自動跳出登入視窗；VSCode/純腳本建議以程式登入：

至 [會員專區](https://ai.finlab.tw/member_info) 取得 API token 後登入：

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


限定範圍可用 `data.universe` 設定。例如取上市櫃「水泥工業」的收盤價：

```python
from finlab import data

with data.universe(market='TSE_OTC', category=['水泥工業']):

    price = data.get('price:收盤價')
```

這樣就會取得在上市櫃中的水泥產業股票收盤價的資料:

<img src="https://i.ibb.co/ynWR1gt/Screen-Shot-2021-07-13-at-11-17-06-PM.png" />

### 市場範圍 (market)
在台灣股市，市場範圍 (market) 可選：

| 市場代碼      | 說明                                                         |
|------------|------------------------------------------------------------|
| `ALL`      | 全市場，包括上市、上櫃、興櫃、公開發行等所有股票                   |
| `TSE`      | 上市公司股票（在台灣證券交易所上市）                              |
| `OTC`      | 上櫃公司股票（在台灣證券櫃檯買賣中心上市）                        |
| `TSE_OTC`  | 上市櫃公司股票（包含上市及上櫃公司）                              |
| `ETF`      | 交易型基金，可以像股票一樣交易的基金                              |


ETF 相關類股，可以使用

| 類別                  | 描述                       |
|---------------------|--------------------------|
| `domestic_etf`       | 以台股為成分股之 ETF         |
| `foreign_etf`        | 以國外商品為成分股之 ETF      |
| `leveraged_etf`      | 槓桿型 ETF                 |
| `vanilla_futures_etf`| 無槓桿期貨 ETF              |
| `leveraged_futures_etf`| 槓桿型期貨 ETF             |


### 類股範圍 (category)
類股範圍 (category) 依行業分類，可選以下產業：

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

!!! tip annotate "取消模糊比對" 
    **使用正規表達式選取**：由於程式是使用 regex 來進行比對，所以會變成模糊比對，當 categories 是「其他」，則會選出所有的「其他」類股，包含「其他證券」。如果使用者如果希望選出「其他」但不想要選出「其他證券」，可以使用以下方式：
                    
    ``` py
    with universe('TSE_OTC', ['^其他$']):
        close_subset = data.get('price:收盤價')
        print(close_subset)
    ```

    這樣就會明確指明開頭跟結尾中間，只有「其他」的類股會被選出來。

### 排除類股（exclude_category）

若想要在範圍內排除特定類股，可使用 `exclude_category` 參數。此參數支援字串或清單，並同樣採用正規表示式（regex）進行模糊比對。

```python
from finlab import data

# 僅選取上市櫃的「水泥工業」相關類股，且排除「金融」相關類股
with data.universe(market='TSE_OTC', category=['水泥工業'], exclude_category=['金融']):
    price = data.get('price:收盤價')
```

!!! 先後順序
    `exclude_category` 預設為 `None`。若同時設有 `category` 與 `exclude_category`，系統會先選出符合 `category` 條件的集合，再進行 `exclude_category` 的排除。
