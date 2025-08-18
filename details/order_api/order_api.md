## 執行交易策略

目前交易系統僅支援 `finlab>=0.3.0.dev1` 版本。在下單前，請先確認安裝了新版的 Package 喔！
首先，在下一個交易日開盤前，執行策略：
```py
from finlab import backtest

# write your own strategy

report = backtest.sim(...)
```

## 計算股票張數

接下來，顯示最近的部位

```py
print(report.current_trades)
```

| stock_id | entry_date | exit_date  | entry_sig_date | exit_sig_date | position   | period   | entry_index | exit_index | return | entry_price   | exit_price | mae | gmfe      | bmfe     | mdd      | pdays     | next_weights |
|------------|------------|----------------|---------------|------------|----------|-------------|------------|--------|---------------|------------|-----|-----------|----------|----------|-----------|--------|--------------|
| 1416 廣豐    | 2021-10-01 | NaT            | 2021-09-30    | 2022-06-30 | 0.510197 | 159.0       | 3566.0     | -1.0   | -3.539823e-02 | 10.60      | NaN | -0.053097 | 0.070796 | 0.070796 | -0.115702 | 37.0   | 0.060665     | 0.00 |
| 1453 大將    | 2021-10-01 | NaT            | 2021-09-30    | 2022-06-30 | 0.510197 | 159.0       | 3566.0     | -1.0   | 2.348165e+00  | 8.43       | NaN | -0.086763 | 2.403782 | 0.245829 | -0.624585 | 60.0   | 0.171264     | 0.00 |
| 1524 耿鼎    | 2022-04-01 | NaT            | 2022-03-31    | 2022-06-30 | 0.611632 | 39.0        | 3686.0     | -1.0   | -3.330669e-16 | 10.60      | NaN | -0.476658 | 0.015152 | 0.000000 | -0.476658 | 2.0    | 0.122168     | 0.00 |
| 2543 皇昌    | 2021-10-01 | NaT            | 2021-09-30    | NaT        | 0.510197 | 159.0       | 3566.0     | -1.0   | 1.073232e-01  | 7.46       | NaN | -0.063131 | 0.363636 | 0.008838 | -0.268519 | 44.0   | 0.070298     | 0.05 |
| 2701 萬企    | 2022-04-01 | NaT            | 2022-03-31    | 2022-06-30 | 0.611632 | 39.0        | 3686.0     | -1.0   | -3.330669e-16 | 12.05      | NaN | -0.025105 | 0.029289 | 0.029289 | -0.052846 | 18.0   | 0.063107     | 0.00 |


假如確認沒問題，可以計算每檔股票投資的張數：

```py
from finlab.online.order_executor import Position

# total fund
fund = 1000000
position = Position.from_report(report, fund)
print(position)
```
可以產生出以下結果
```
[{'stock_id': '2330', 'quantity': 1, 'order_condition': <OrderCondition.CASH: 1>}]
```

上述 `Position` 代表您的帳戶中，只希望有一張 `2330` 台積電股票，並且是現貨。

## 進階部位調整

### 零股交易

欲使用零股部位，只要將上述程式碼做以下修改即可：

```py
# 整股
position = Position.from_report(report, fund)

# 零股
position = Position.from_report(report, fund, odd_lot=True)
```

### 客製化部位張數

上述方法使用 `Position.from_report` 來建構部位，其實我們也可以單純用很直覺的方式建構想要再平衡的部位：

```py
position = Position({'2330': 1, '1101': 1.001})
```
可以產生出以下結果
```
[{'stock_id': '2330', 'quantity': 1, 'order_condition': <OrderCondition.CASH: 1>}
 {'stock_id': '1101', 'quantity': 1.001, 'order_condition': <OrderCondition.CASH: 1>}]
```

### 部位增減調整

`Position` 是可以相加減的，我們可以用以下方法調整部位大小

```py
# 減一張 2330 股票
new_position = position - Position({'2330': 1})
# 增加一張 1101 股票
new_position = position + Position({'1101': 1})
```

### 多策略權重加總

假如我們有多個 position，可以用以下方式加總：
```py
from finlab import backtest
from finlab.online.order_executor import Position

report1 = backtest.sim(...)
report2 = backtest.sim(...)

position1 = Position.from_report(report1, 1000000) # 策略操作金額一百萬
position2 = Position.from_report(report2, 1000000) # 策略操作金額一百萬

total_position = position1 + position2
```

## 實際下單

### 1. 安裝券商 API
目前支援 `玉山 Fugle` 和 `永豐` 證券的下單系統，則一使用即可。
```
# 玉山 Fugle
pip install fugle-trade

# 永豐
pip install shioaji
```

### 2. 連接證券帳戶

目前支援 `Fugle` 和 `永豐` 證券的下單系統，可以先將帳號密碼設定成環境變數，只要針對您需要的券商來設定即可，不需要兩個券商同時串接。

!!! 選擇您的券商

    === "玉山富果"
    
    
        <iframe width="100%" style="aspect-ratio: 16 / 9;width:100%" src="https://www.youtube.com/embed/AAGcIgJAUVY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        
        
        * 請先按照[config 教學](https://developer.fugle.tw/docs/trading/prerequisites )獲取 config 設定檔。
        * 並到登入[富果API](https://developer.fugle.tw/docs/key/)，獲得市場行情 Token。
        
        
        ```py
        from finlab.online.fugle_account import FugleAccount
        import os
        os.environ['FUGLE_CONFIG_PATH'] = '玉山富果交易設定檔(config.ini.example)路徑'
        os.environ['FUGLE_MARKET_API_KEY'] = '玉山富果的行情API Token'
        os.environ['FUGGLE_ACCOUNT_PASSWORD'] = '玉山富果的帳號密碼'
        os.environ['FUGLE_CERT_PASSWORD'] = '玉山富果的憑證密碼'
        
        acc = FugleAccount()
        ```
        
        
        假如使用中下單出現錯誤代碼，可以到[富果文件](https://developer.fugle.tw/docs/trading/reference/error_codes) 來查找原因。假如對於 Finlab Package 下單不熟習，建議也可以先按照[券商的教學](https://developer.fugle.tw/docs/trading/prerequisites)來練習，假如串接成功，則 FinLab Package 的串接也就是如法炮製的設定囉！
    
    
    === "永豐證券"
    
        <iframe width="560" style="aspect-ratio: 16 / 9;width:100%" height="315" src="https://www.youtube.com/embed/BDsVOI4cZNk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        
        * 請先獲取憑證
        
            * [Windows 憑證下載方式](https://www.sinotrade.com.tw/CSCenter/CSCenter_13_1?tab=2)
            * MacOS 憑證下載：目前永豐雖支援 MacOS 下單，但並不支援用 MacOS 獲取憑證，可以先找一台 Windows 作業系統，並且使用上述方法獲取憑證後，再將憑證於 MacOS 來使用。
        
        
        ```py
        import os
        from finlab.online.sinopac_account import SinopacAccount
        
        os.environ['SHIOAJI_API_KEY'] = '永豐證券API_KEY'
        os.environ['SHIOAJI_SECRET_KEY'] = '永豐證券SECRET_KEY'
        os.environ['SHIOAJI_CERT_PERSON_ID']= '身份證字號'
        os.environ['SHIOAJI_CERT_PATH']= '永豐證券憑證路徑'
        os.environ['SHIOAJI_CERT_PASSWORD'] = '永豐證券憑證密碼' # 預設與身份證字號
        
        acc = SinopacAccount()
        ```
        假如對於 Finlab Package 下單不熟習，建議也可以先按照 [券商的教學](https://sinotrade.github.io/quickstart/) 來練習，假如串接成功，則 FinLab Package 的串接就會非常簡單囉！


    === "元富證券"

        請參考[元富證券的教學](https://ml-fugle-api.masterlink.com.tw/FugleSDK/docs/trading/prepare) 來獲取憑證，並且將憑證放在相對應的路徑之中，並且安裝相對應的套件後，即可執行：

        ```py
        import os
        from finlab.online.masterlink_account import MasterlinkAccount

        os.environ['MASTERLINK_NATIONAL_ID'] = '身分證字號'
        os.environ['MASTERLINK_ACCOUNT'] = '交易帳號'
        os.environ['MASTERLINK_ACCOUNT_PASS'] = '密碼'
        os.environ['MASTERLINK_CERT_PATH'] = '元富證券憑證路徑'
        os.environ['MASTERLINK_CERT_PASS'] = '元富證券憑證密碼' # 預設與身分證字號

        acc = MasterlinkAccount()
        ```

        即可完成設定！



    === "富邦證券"

        請參考[富邦證券的教學](https://www.fbs.com.tw/TradeAPI/docs/trading/introduction/) 來獲取憑證，並且將憑證放在相對應的路徑之中，並且安裝相對應的套件後，即可執行：

        ```py
        import os
        from fubon_account import FubonAccount
        
        # 設定環境變數
        import os

        os.environ['FUBON_NATIONAL_ID'] = "A123456789"
        os.environ['FUBON_ACCOUNT_PASS'] = "your_password"
        os.environ['FUBON_CERT_PATH'] = "/path/to/cert.pfx"


        account = FubonAccount()
        ```

        即可完成設定！




### 3. 批次下單

最後利用 `OrderExecuter` 將當證券帳戶的部位，按照 `position` 的部位進行調整。

```py
from finlab.online.order_executor import OrderExecutor

# Order Executer
order_executer = OrderExecutor(position , account=acc)
```

若下單部位含有「 全額交割股」、「處置股」、「警示股」，需先於證券帳戶圈存。參考[富果圈存](https://support.fugle.tw/trading/trading-troubleshoot/5231/?gclid=CjwKCAiAvK2bBhB8EiwAZUbP1BfmktsP8ULMWOxu0RVhTW3i3Tr_nmAfwhNuKY7635XHCq2J51FmVBoCGwAQAvD_BwE)、[永豐圈存](https://www.sinotrade.com.tw/richclub/freshman/%E6%B0%B8%E8%B1%90%E9%87%91%E8%AD%89%E5%88%B8-%E9%A0%90%E6%94%B6%E6%AC%BE%E5%88%B8-%E6%95%B8%E4%BD%8D%E5%B9%B3%E5%8F%B0%E6%9C%8D%E5%8B%99%E5%85%A5%E5%8F%A3%E4%BB%8B%E7%B4%B9-%E6%83%B3%E8%B2%B7%E8%99%95%E7%BD%AE%E8%82%A1%E5%85%88%E7%9C%8B%E9%80%99%E4%B8%80%E7%AF%87--60ee886daefbe326a0c7bb1b)方式。

```py
# 顯示下單部位是否有警示股及相關資訊
order_executer.show_alerting_stocks()
```

```
買入 8101 0.429 張 - 總價約         2672.67
```
根據`show_alerting_stocks`顯示結果進行圈存後，即可繼續執行下單。

```py

# 下單檢查（瀏覽模式，不會真的下單）
order_executer.create_orders(view_only=True)

# 執行下單（會真的下單，初次使用建議收市時測試）
# 預設使用最近一筆成交價當成限價
order_executer.create_orders()

# 更新限價（將最後一筆成交價當成新的限價）
order_executer.update_order_price()

# 刪除所有委託單
order_executer.cancel_orders()
```

## 查看帳戶部位

不論是永豐還是富果帳戶，都可以用以下方式查找帳戶的部位

```py
# 選擇欲使用的券商(擇一即可)

# 永豐
from finlab.online.sinopac_account import SinopacAccount
acc = SinopacAccount()

# 玉山富果
from finlab.online.fugle_account import FugleAccount
acc = FugleAccount()

print(acc.get_position())
```
可以印出以下結果
```
[{'stock_id': '2330', 'quantity': 1, 'order_condition': <OrderCondition.CASH: 1>}
 {'stock_id': '1101', 'quantity': 1.001, 'order_condition': <OrderCondition.CASH: 1>}]
```
