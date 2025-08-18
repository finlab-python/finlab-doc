
# 常見問題

## 登入驗證相關

??? note "找不到`api_token`的輸入框，導致無法抓取資料怎麼辦呢？"
    可能您是使用VSCode、或其他IDE，在程式最前面加上以下語法，也能直接登入摟
    ```py
    import finlab
    finlab.login('您的api_token')
    ```

## 資料下載

??? note "抓不到完整資料？為什麼資料範圍只到2020年呢？"

    因為您尚未訂閱VIP，對未訂閱VIP會員我們只開放至2020年底的資料，可以考慮[訂閱起來](https://ai.finlab.tw/pricing/)！ 即可使用截止至最新交易日的歷史資料。


??? note "為什麼載下來的資料中，只有index有值，value皆為空值呢？"

    您可能有設定到`set_universe`，執行`data.universe_stocks = {}` 或是整個kernal重啟後再執行原程式碼即可。

## 常用策略語法問題

??? note "每種財經資料的 index 沒有對齊，要用 reindex 去做運算？"

    不需要，這樣會花費大量時間在做資料的調整，在 finlab package 中，所有以 `data.get` 所拿取的資料，在做二元運算時，都會偷偷幫你自動對齊，您不需要花費任何時間來對齊資料，以下為例子。
    例如我們拿取此資料：
    ```py
    from finlab import data

    close = data.get('price:收盤價')
    roa = data.get('fundamental_features:ROA稅後息前')
    ```
    此時 `close` 以及 `roa` 都是 `FinlabDataFrame`，所以與其這樣製作條件

    ```py
    roa_daily = roa.reindex(close.index, method='ffill')
    
    condition = (close < 30) & (roa_daily > 0)
    ```

    您可以化簡如下

    ```py
    condition = (close < 30) & (roa > 0)
    ```

    在做這些四則運算或不等式運算時，我們會偷偷幫你計算 `roa_daily`，所以您不需要親自動手寫喔！

    

??? note "想要在特定月份停止交易，要怎麼在回測中排除特定月份呢？"

    以7,8月不要有策略訊號為例，將month_condition與其他條件取交集即可。
    ```py
    month_condition = close.index.to_series().apply(lambda x:x.month not in [7,8])
    ```

??? note "要如何將資料庫中例如「企業基本資訊」的特定欄位整理成像其他回測資料同樣的格式呢？(index為date、columns為stock_id)""

    以整理「已發行普通股數或TDR原發行股數」欄位為例：
    ```py
    from finlab.dataframe import FinlabDataFrame
    from finlab import data
    basic_info = data.get('company_basic_info')
    basic_info.index = basic_info.stock_id
    營業收入 = data.get('financial_statement:營業收入淨額')
    流通在外股數 = basic_info['已發行普通股數或TDR原發行股數']
    流通在外股數 = FinlabDataFrame(pd.DataFrame([list(流通在外股數)], columns=basic_info.index, index=營業收入.index))
    ```

## 策略回測

??? note "為何沒有正確的停損停利？"

    當使用
    ```py
    report = sim(position, stop_loss=0.1)
    ```
    的時候，就算是 stop_loss 有開啟，當偵測到 position 當天有部位時，還是優先以 position 為準。除非您的 position index 是稀疏的狀況下（例如 index 只有每個月），系統查找不到當天需設定的部位時，才會以 stop_loss 來監測是否賣出。 

    你可能會覺得這樣不太直覺，但是設想假如停損後，還是維持 position 是 True，那明天究竟是已經停損還是應該重新買入？就會變成大哉問。所以假如 position 是 True，就以 position 為準，而不額外停損，是最單純的方式。 

    假如您的 position 的 index 是每個交易日，確實會導致 stop_loss 沒有作用。以下是一些解決方法：

    1. 假如您剛好有使用 hold_until 來製作 position 時，可以使用
    ```py
    # 原本的
    position = buy.hold_until(sell)
    # 有停損的
    position = buy.hold_until(sell, stop_loss=0.1)
    ```
    2. 假如您原本就沒有使用 hold_until，則可以用以下方式來設定
    ```py
    position.is_entry().hold_until(position.is_exit(), stop_loss=0.1) 
    ```
    來設定停損停利

??? note "該如何優化與驗證策略？"

    詳細概念可參考： https://www.finlab.tw/phcebus-thinking-report-part2-backtest-sop/
    並透過Finlab回測系統進行實作。

??? note "在local或colab執行回測時，可以不要印出網頁報表嗎？"

    在sim回測模組中設定參數upload=False即可。
    ```py 
    report = sim(position, upload=False)
    ```

??? note "為什麼回測出來的報酬跟自己算出來的都不一樣呢？"

    可以先檢查是否已用還原股價計算、確認策略進出場確切時間點、是使用抓開盤或收盤價。若依然有疑慮可至Discord論壇區討論。

??? note "report的display_mae_mfe_analysis，Edge ratio為什麼沒有顯示？"

    需在`sim`回測模組中設定參數`mae_mfe_window`，參考 https://doc.finlab.tw/reference/backtest/ 。

??? note "怎麼進一步客製化換股頻率呢？(resample的進階應用？)""

    可參考pandas文件說明 https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.resample.html ，直接使用於放入回測模組前的position。

??? note "在平台上執行遇到MemoryError要怎麼解決呢？"

    超過網頁記憶體限制，建議移至 [Google Colab](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwjSu6uO9IOCAxWUsVYBHdpPBngQFnoECBkQAQ&url=https%3A%2F%2Fresearch.google.com%2Fcolaboratory%2F&usg=AOvVaw38J01zt_Dlb6pQ1fe6FGrI&opi=89978449) 使用。

??? note "策略名稱旁的綠點點是什麼意思？"

    表示該策略為訊號異動日或換股日。

## 環境相關

??? note "Talib要如何安裝？"
    * 在 Google Colab: 可以使用語法`!pip install ta-lib-bin` 來進行安裝
    * 透過 conda 安裝：在其他 kernel: 執行 `$ conda install -c conda-forge ta-lib` 來進行安裝
    * MacOS 安裝：請先安裝 [Homebrew](https://brew.sh/)，並且使用 `brew install ta-lib` 來進行安裝，
    * Windows 安裝：可以至 https://www.lfd.uci.edu/~gohlke/pythonlibs/#ta-lib 下載相應版本wheel，並在下載路徑執行 `$ pip install 檔案全名.whl`

??? note "要如何在colab將資料匯出？如何匯入資料並設定正確路徑？"

    需掛接google 雲端硬碟，可在頁面左側「檔案」選單中點選「掛接雲端硬碟」，或直接輸入並執行：
    ```py
    from google.colab import drive
    drive.mount('/content/drive')
    ```
    其中「/drive/MyDrive」即為google雲端硬碟根目錄。

??? note "在本機或colab跑的回測績效跟平台上跑出來的不一樣？"

    以在本機或colab使用最新版套件執行的結果為準。

??? note "手機適合操作 FinLab 量化平台嗎？"

    若是查看各策略績效、其他個股、產業資訊等，用手機是可行的；不過若欲撰寫策略並執行，因記憶體限制考量，建議以電腦來使用為主。


## 下單進出場

??? note "在finlab平台無法直接執行下單？"

    是的，如需串接下單API，需使用其他環境進行操作。

??? note "要如何串接券商API下單呢？"

    Finlab有與永豐證券、玉山Fugle合作，可在開立相關帳戶後查閱文件開始串接，內文亦附有教學影片，依步驟執行即可： https://doc.finlab.tw/details/order_api/

??? note "下單時如何避免出掉非該策略的部位？"

    先創建Position物件並定義手單部位(非該次策略相關的部位)，在OrderExecutor的position放入該策略部位與手單部位的加總，即可直接下單。

??? note "錯過策略的進出場日期，該怎麼辦？"

    可藉由Edge Ratio分析來判斷是否適合中途進場，詳細說明請見Ben大文章解說：https://www.finlab.tw/edge-ratio-follow-application/

## 平台使用

??? note "哪裡能設定策略自動更新，不想每天按？"

    在平台策略頁面上方，按下「自動更新」，即可選擇欲更新之策略、設定時間來進行每日自動更新。

??? note "策略訊號有異動，會有通知功能嗎？"

    在平台上有設定自動更新之策略，將在訊號出現異動時，寄出mail通知(通知在工作日0600~0700之間寄出)。

??? note "策略清單，「當前統計」和「近期更動清單」的差異在哪？"

    當前統計清單包含策略目前實際持股，近期更動清單除了目前實際持股、也包含近期各個股的異動。

??? note "為何「近期異動清單」會每天變？"

    隨著策略中使用到的數據每日異動，尚未進場的選股將隨之變化，實際應用上，於原先設定之換股周期進行換股操作即可。

## 訂閱與其他問題

??? note "可以更改訂閱時綁定的信用卡嗎？"

    可以，請點選[平台](https://ai.finlab.tw/)的右上角的會員頁面，並且點選「付款設定與紀錄」分頁，並點選「更改發票以及信用卡」即可。

??? note "註冊錯帳號了，想更換註冊使用的FinLab帳號，怎麼辦？"

    可直接使用新的google帳號登入後，用舊的帳號對應到的 email 到 finlab.company@finlab.tw 來更換即可

??? note "我有量化平台使用上的問題，請問助教系統在哪裡？該如何詢問問題？"

    Finlab有專屬Discord聊天室，可至Discord搜尋「Python 選股實驗室」，或是至Finlab網頁左側「社群>Discord 聊天室」進入。

    發問內容以平台/套件使用相關疑難雜症為主，一般程式語法或其他與Finlab無關之障礙可先多嘗試使用google或ChatGPT協助處理。

    發問時，需完整描述所遇到的狀況，可能包含使用環境、套件版本、使用時間，並附上完整程式碼與錯誤訊息，當提供的資訊越完整，助教將能越迅速為您解決。而若是針對策略撰寫的疑問，盡量以具有邏輯的方式描述完整概念，將能得到更有效率的解決方案。

    為在訊息量較大時避免被洗掉、且有延伸討論時能輕易追蹤，可多善用論壇區進行主題式討論。

??? note "有建議的新功能，要在哪裡許願？"
    
    呈上，可至Discord的vip專屬許願池留下您的願望，VIP限定！

??? note "助教會在多久後回覆我的問題？客服服務時間是？"
    
    客服時間為週一至週五9:00~17:00，於Discord留下的問題將會在兩個工作天內盡量完成回覆。

??? note "哪裡可以得知新的研究教學訊息？"
    
    研究教學資訊將布告於Discord的教學資源頻道與FB粉專，而研究成果多以部落格文章、Youtube影音形式為主，均可直接追蹤收藏起來！
 
    Finlab財經實驗室Youtube頻道： https://www.youtube.com/@FinlabPython
    Finlab部落格： https://www.finlab.tw/