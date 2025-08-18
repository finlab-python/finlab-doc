---
hide:
  - navigation
---

# 更新日誌
## 1.5.0 (2025-08-01)

### Features
- `factor_analysis`: 新增因子趨勢分析功能，並新增說明簡易範例文檔
- `plot`: 新增統一的 plotly 樣式，多種顏色範圍及標記功能，強化線圖的可視化效果，並支援自定義顏色區間
- `plot`: 增強 `plot_line` 函式，新增進階自定義選項和綜合範例，新增 `plot_line_example` 和 `plot_line_financial_example` 函式
- `tests`: 增加將回測結果序列化為 pickle 格式的功能

### Refactor
- `factor_analysis`: 重構函式名稱和參數以提高清晰度，更新文檔以反映變更
- `docs`: 更新變更日誌，調整模組結構及命名

### Fix
- `data`: 新增 `use_local_data_only` 和 `force_cloud_download` 功能選項
- `feature`: 優化市場配置邏輯，確保在多核環境下正確恢復原始市場設置
- `liquidityAnalysis`: 確保交易價格和成交量的形狀一致，並將其轉換為 DataFrame 格式
- `backtest`: 修正位置過濾邏輯，確保只保留有效的市場數據並轉換為浮點數
- `doc`: 修正 plotly 無法渲染的問題（改用靜態 png）

### Docs
- 新增因子擁擠度分析頁面至導航
- 新增簡易教學文檔，更新實用範例教學，讓教學更清楚
- 修改實用範例文檔
- 新增 KaTeX 支援用於數學渲染，並移除過時的因子擁擠度分析
- 新增元富證券設定說明至下單 API 文檔，並移除過時的 PE-PB 圖表圖片
- 修正下單 API 文檔中對元富證券的引用

## 1.4.0 (2024-05-29)

### Features
- `portfolio`: 新增 `get_total_position` 方法，以 DataFrame 格式回傳當前持股
- `pyproject`: 為開發群組新增 `shioaji` 支援

### Refactor
- `backtest`: 將 `Exception` 替換為 `ValueError` 和 `TypeError` 以進行更好的錯誤處理
- `market`: 將 `Market` 類別轉換為抽象基礎類別並更新 `tw` 市場

### Fix
- `qlib`: 改善缺少 `finlab[qlib]` 模組的錯誤處理，提供更詳細的訊息
- `data`: 新增 `use_local_data_only` 和 `force_cloud_download` 功能
- `data`: 更新 `get` 函式的回傳類型為 `FinlabDataFrame`
- `data`: 在 `__all__` 中包含額外的匯出
- `pytorch_nn`: 移除損壞的 import 並新增 `ICLoss` 用於計算資訊係數損失
- `portfolio`: 優化移除部位的邏輯並加強更新條件
- `docker`: 將 `finlab` 版本鎖定在 1.4.0

## 1.3.0 (2024-05-24)

### Features
- `online`: 新增口袋證券 (pocket account) 相關功能
- `fubon`: 新增元富證券的下單系統
- `data`: 新增財務數據指標的 entry names
- `dataframe`: `rank` 方法新增未來資料窺看警告
- `setup`: 新增 Python 3.7 和 3.8 的 classifiers
- `requirements`: 新增 `Jinja2` 與 `ipython` 套件
- `test`: 新增 `pytest` 的開發依賴與 `slow` 標記
- 更新使用 uv 來管理依賴

### Refactor
- `alphalens`: 移除 `alphalens` 模組與相關功能
- `portfolio`: 優化 `PortfolioSyncManager` 中移除部位的日誌紀錄
- `backtest`: 註解掉設定全域回測報告的未使用程式碼
- `plot`: 從 `plot_test.py` 移除過時的繪圖測試
- `ml`: 改善 `combine` 函式中的工廠初始化和型別提示

### Fix
- `setup`: 啟用 `find_namespace_packages` 支援並改善路徑處理
- `liquidityAnalysis`: 修正處置股票的判斷邏輯與漲跌幅評估的日期基準
- `docker`: 更新 `pandas` 與 `ta-lib` 版本
- `backtest`: 更新回測上傳訊息
- `ml`: 修正 `combine` 函式中的變數引用
- `analysis`: 修正 `drawdown` 的結束日期
- `parallel`: 修正 `ParallelExt` 以支援較新版本的 `joblib`
- `pyproject`: 指定 `Cython` 版本以確保相容性

### Docs
- `docs`: 重新命名 `getting-start.md` 並更新 `mkdocs.yml`
- `order_api`: 更新憑證取得與套件安裝說明

### Type Safety
- `core`: 為 `FinlabDataFrame` 和 `backtest` 模組新增型別提示

## 1.2.27 (2025-05-15)
### Features
- 新增元富證券的下單系統
- `finlab.ml.feature.combine` 支援 dictionary of function 來產生特徵
- `finlab.dataframe.FinlabDataFrame` 重構 `rank` 方法，自動處理財報橫向比較，避免 look ahead 的可能。
- `finlab.dataframe.FinlabDataFrame` 重構 `rank` 方法，警告使用者使用了 look ahead 的可能。

### Fix
- qlib 模型引用修正

## 1.2.24 (2025-05-02)

### Features
- 將整個 qlib 的功能整合到 finlab.ml 中，只需要安裝 finlab 就可以使用 qlib 的功能(pip install finlab[qlib])

### Refactor
- `report` 支援 `report.to_html(path)` 將報告轉換成 HTML 檔案
- `report` 支援 `report._repr_html_()` 直接在 Jupyter Notebook 中顯示報告
- 將 `dashboard` 移出 `report` 模組，獨立成為 `finlab.core.dashboard` 模組

### Fix
- 修復 `report.trades` 中關於警示股、處置股、全額交割股少部分的資料錯誤
- 修復 `report.weights.name` 以及 `report.next_weights.name` 可能為 None 的問題


## 1.2.23 (2025-03-25)

### Fix
- 修正 `report.upload` 在 resample=pd.DatetimeIndex 會報錯的問題


## 1.2.22 (2025-03-25)

### Features
- `PositionScheduler` 支援多策略與重新平衡邏輯
- `backtest.sim` 新增 `resample=None` 時自動計算下一個交易日

### Fixes
- 更新 macOS 構建架構設定，僅保留 `universal2`
- 修正 `resample` 參數的邏輯，允許直接使用
- 調整 `PositionScheduler.from_report` 方法以符合新的 `resample` 邏輯
- 更新並修正相關的單元測試


## 1.2.21 (2025-03-12)

### Features
- `report.is_stop_triggered()` 監測是否有停損停利觸發
- `report.is_rebalance_due()` 監測是否有再平衡觸發
- `report.to_pickle('PATH')` 將報告存成 pickle 檔案
- `report.from_pickle('PATH')` 從 pickle 檔案讀取報告
- `backtest.sim` 回測速度優化

### Fixes
- `PortfolioSyncManager` 考慮 weight = 0 的情況
- `data.get` 在下載異常時，會自動重試
- `backtest.sim` 針對股票代號異常時，會自動跳過
- `backtest.sim` 修正做空的報酬率顯示錯誤

## 1.2.20 (2024-12-09)

### Refactor
- `MarketInfo` 現在移動至 `finlab.market` 模組之中
- `TWMarketInfo` 現在移動至 `finlab.markets.tw` 模組之中，並且改名為 `TWMarket`
- fix(market_info): rename loop variable for clarity in shared memory creation
- 使用 `finlab.config.set_market` 來設定全域市場資訊
- 取消 `ml.get_market` 以及 `ml.set_market`，使用 `finlab.config.set_market` 代替
- 取消 `data.indicator(...market)` 與 `finlab.config.set_market` 合併
- 取消 `df.hold_until(...market)` 與 `finlab.config.set_market` 合併

## 1.2.17 (2024-10-19)

### Features
- `report.weight.name` 的名稱改成回測最後一天的日期，方便查看，
- `report.next_weight.name` 的名稱改成換股日期，方便查看，
- `支援 numpy>=2.0` 然而 `talib` 還沒支援，所以需要使用 talib 的話需要再等等。
- `Position` 支援 `weight` (optional) 的儲存與計算，方便快速比較張數與權重。
- `FugleAccount` 改成使用 websocket 進行訂單的連線與更新
- `OrderExecutor` 新增 progress 可以針對「當前部位」與「目標部位」進行內差，方便轉倉平滑過度

### Fixes
- `finlab.online.sinopac` 處理當股票當天無交易時，避免直接報錯

## 1.2.16 (2024-10-02)

### Fixed

- `data.get` 減少非必要的連線次數
- `cli` 修正 webview 非必要 import 的錯誤
- `finlab.online.sinopac` 修正 `get_trades` 在計算時間時，會將時間轉換成 UTC 時間
- `finlab.portfolio` 修正 `PortfolioSyncManager` 在 `to_cloud` 或 `to_json` 時，可能會產生不相容的格式

## 1.2.15 (2024-09-08)

### Fixed

- `position.from_report` 修正 `weight.index` 為非 str 的問題
- `finlab.portfolio` 修正持有無法交易股票時，會報錯的問題
- `finlab.online` 修正欲無法交易股票時，會報錯的問題（改成跳出警示）
- `finlab.data` 修正 `data.search` 時搜索數據為空的問題
- `finlab.portfolio` 修正停損停利時，在某些時刻下會跳過的問題

## 1.2.12 (2024-8-27)

### Features
- **dashboard**: 新增儀表板中的「與大盤相關性」，並且能夠選擇時間區間
- **portfolio**: 新增 `PortfolioSyncManager` 的 `get_position(at='open')` 的功能，用於規劃當日開盤的部位
- **online.position**: 優化顯示部位的功能
- **online.position**: 增加以 for loop 提取部位資訊的功能
- **tool.factor_analysis**: 增加因子分析功能，除了 IC 以外，支援 `get_metric` 來運算因子的各種指標
- **portfolio**: 新增 `PortfolioSyncManager` 自動判斷 `smooth_transition` 的時機，在初始化時不需平滑過度，於之後都使用平滑過度
- **doc**: 優化 `portfolio` 下單的教學文件
- **sinopac**: 永豐證券支援 `get_trades` 功能用於比對帳戶交易紀錄

### Fixed

- **data**: 修正 `data.get` 會於少數作業系統產生 circular import 的問題
- **cli**: 修正 `finlab nb` 指令會產生 `import webview` 的問題

## 1.2.11 (2024-8-19)

### Fixed

- **backtest**: 修正停損停利時，在少數情況會用到未來資料的問題
- **test**: 測試回測系統時，使用歷史資料
- **report**: 修正回測報告中的產業別顯示錯誤
- **online**: 修正下單時，顯示過多小數點的問題
- **schedule**: 修正執行策略時，使用到錯誤 Token 的問題
- **portfolio.cloud_report**: 修正支援 int 型態的 return （在少數情況下會用到）
- **backtest**: 回測 in-sample 時，將 out-sample 的資料隱藏
- **data**: 當下載超過 5 分鐘時，會自動終止並且顯示錯誤訊息


## 1.2.9 (2024-8-3)

## Feature

- 新增 `finlab.portfolio` 的 `PortfolioSyncManager.update` 使用 `custom_position` 來設定股票張數
- 新增 `finlab.portfolio` 的 `PortfolioSyncManager.update` 使用 `excluded_stock_ids` 來設定忽略的股票

## 1.2.8 (2024-8-1)

## Fix
- 修正在某些狀況下，回測報錯的問題

## 1.2.7 (2024-8-1)

## Fix
- 股票結算於非收盤價，導致的報酬率計算錯誤
- 修正 `finlab.portfolio` 中 `PortfolioSyncManager` 在 `update` 時，產生非必要性 `warning`


## 1.2.5 (2024-7-29)

## Feature

- 新增股票儀表板中，隱藏股票名稱的功能

## Fix
- 修正股票儀表板中 `open_close_avg` 為「平均價」
- 修正報酬率的計算方式，不同期之間不需要計算交易手續費
- 修正儀表板中 `NaN` 的狀況



## 1.2.4 (2024-7-28)

## Feature

- 新增 `finlab.portfolio` 的 `PortfolioSyncManager` 使用 `to_file` 和 `from_file` 來讀取資料

## Fix

- 修正 `finlab.portfolio` 使用 `PortfolioSyncManager` 處理零股報錯問題
- 修正 `finlab.portfolio` 使用 `PortfolioSyncManager` 零股顯示小數點第四位

## 1.2.2 (2024-7-27)

## Fix

- 修正 `finlab.cli` 假如尚未初始化 nb 指令會報錯的問題
- 修正 `finlab.portfolio` 雲端下載策略，找不到策略 raise Error 提供更詳細的錯誤訊息
- 修正 `finlab.portfolio` 針對 live_trading_performance 為 None 報錯的問題
- 修正 `finlab.portfolio` create_mutli_asset_report 路徑與回傳數值的問題
- 修正 `finlab.portfolio` syn manager 在停損停利時的報錯問題
- 修正 `finlab.backtest` 將 resample=None 的時候，報酬率計算方式為持有期間報酬率
- 修正 `finlab.backtest` 在盤中模擬時，計算收盤結算引入NaN造成的問題
- 修正 `finlab.report` 針對每期報酬率分開時，顯示出場原因的問題

## 1.2.0 (2024-7-27)

## Features

- 新增 `finlab.backtest` 的盤中儀表板和累計報酬儀表板
- 新增 `finlab.backtest` 模擬時，不論 `trade_at_price` 為何，所有結算均於盤後進行結算
- 新增 `finlab.backtest` 考慮開盤買賣，收盤價決定停損停利
- 新增 `finlab.report` 將 `report.trades` 新增產業別
- 新增 `finlab.portfolio` 模組，用於將策略用於實際投資組合
- 新增 `finlab.portfolio` 文件教學，用於教學如何將策略用於實際投資組合
- 新增 `finlab.cli` 模組，用於命令行操作與下單
- 新增 `finlab.cli` 文件教學，用於教學如何使用命令行操作與下單
- 新增 doc 介紹利用 regex 來選取產業別
- 新增 `finlab.online` 功能，讓 `Fugle API` 可以自動登入不需人工輸入密碼

### Fix

- 修正 `finlab.sinopac` 中的帳戶餘額計算於星期天凌晨提早結算的問題



## 1.1.6 (2024-7-11)

## Fix

- 修正回測中，離線版針對資料快取讀取的問題
- 修正回測中，Windows datetime 轉換成 int32 不支援的問題

## 1.1.4 (2024-7-9)

## Features

- 新增策略到期時間，用於提醒資料已經過期，需要重新執行
- 回側面版：同時顯示進場與當前價格
- 回測面版：將預設報酬率顯示從後往前
- 回測面版：持股價格顯示優化

## Fix

- 修正 finlab.tools.factor_analysis 會因為因子日期沒有對齊而報錯的問題
- 修正 Pandas 2.2.0 版本下，銜接 Pandas 3.0.0 產生的 Warning
- 修正 ffn_core 中，Tabular 建構錯誤的問題
- 修正 ffn_core 中，針對 Pandas 3.0.0 版本的兼容性問題
- 修正回測頁面股票進場價格顯示錯誤的問題
- 回測頁面：修正股票歷史紀錄
- 回測頁面：考慮近期最大下跌
- 修正 plot 中每年平均報酬，考慮沒有回測的狀況


## 1.1.3 (2024-6-4)

### Features

- 將finlab.tools.factor_analysis 進行修正，支援多因子
- LINE Notify 新增策略名稱發送

### Fix

- 修正 show_alerting_stocks 無法使用的問題

## 1.1.2 (2024-5-23)

### Feature

- 新增 finlab.tools.factor_analysis 模組，用於因子分析

### Fix
- 修正價格 NaN 的應對處理
- 修正 finlab.ml.feature.ta 函式的多核處理邏輯，根據單核心報錯
- 修正參照下次再平衡的時機，以部位變化日期為準，改成當前的收盤價格日期為準，避免在下次再平衡時，參照到錯誤的價格
- 修正 finlab.ml.qlib.get_models 中的模型，在訓練時 label 會有 inf 或 NaN 的問題

### Refactor
- 針對銀行餘額與交割訊息重構



## 1.1.1 (2024-4-25)

### Refactor
- 在 machine_learning.md 中新增 "必要安裝" 和 "模型函式庫（非必須）" 兩個小節，清晰劃分安裝指令。
- market_info.py 中 MarketInfo 和 TWMarketInfo 類別的方法 market_close_at_timestamp 和 tzinfo 進行了修正和標準化，以改善方法的可讀性和一致性。
- 將部分方法的實現從動態到靜態，以提高效率和減少依賴。
- 新增 qlib.py 中 WrapperModel 的 fit 方法中對 segments 參數的處理，確保自定義數據段可以被正確處理。

### Fix
- 修正 market_info.py 中邏輯條件判斷錯誤，正確區分條件判斷式。
- 修改 data.py 中對於 NaN 值的處理方式，避免在計算指標時包含無效數據。
- feature.py 中 ta 函式的多核處理邏輯調整，根據核心數量決定數據處理方式，避免在 docker 中無法使用。
- 修正 label.py 中，使用 maximum_adverse_excursion 函式時的錯誤，確保函式正確運行。
- 修正 label.py 中，使用 maximum_favorable_excursion 函式時的錯誤，確保函式正確運行。


## 1.1.0

### Features
- 新增了對 Microsoft Qlib 的支持，透過在 Dockerfile 中添加 pyqlib 依賴，使得用戶能夠直接在 Docker 容器中使用 Qlib。

### Fix
- 修正了版本號在多個檔案中的不一致問題，統一將版本號更改為 1.0.10。
- 重構了 finlab/ml/qlib.py 中的代碼，移除了過時的註釋和未使用的代碼，提高了代碼的清晰度和維護性。
- 更新了 finlab/online 子模組的引用，以獲取最新的功能和修復。
- 簡化了 run_online_test.sh 和 run_all_test.sh 腳本，移除了不必要的註釋和代碼，使得測試過程更為簡潔高效。

## 1.0.6
- fix(report): 修正 importlib.resources 在 python<=3.6, python==3.8,3.7, python >=3.9 不能用的問題

## 1.0.5
- fix(report): 修正 importlib.resources 在 python<=3.8 不能用的問題

## 1.0.4

- feat(backtest): 新增回測與標的的相關測試功能
- fix(backtest): 修正 removing next_weight force to 1 的問題
- fix(us_market): 修正支援 market_close_at_timestamp support None 的問題
- chore(pandas 3.0): 支援新版的 Pandas >= 3.0.0 new resample string format
- feat(backtest): 新增 sl_enter 和 tp_enter，來代表立即停損停利，直到下次換股再買入的標示

## 1.0.3

### Fix

- 修復支援網頁端執行回測
- 修正 `report.current_trades` 假如有重複的股票名稱，以最新的部位為主
- 修正儀表板顯示每月營收的計算方式，從 1 號到 31 號，變成跟之前一樣，從上月 31 號到此月 31 號
- 修正 `trail_stop` 在買同一張股票時，提早出場的問題
- 隔天要進場，同時又停損停利，針對 `stop_trading_next_period` 對於 `report.action` 以及 `report.next_weights` 的顯示資料進行修正，並增加單元測試。

## 1.0.2

### Refactor

- 移除 tailwind default css，改而使用 vite 輸出的 style.css
- 移除 web server 改而使用 iframe docsrc （經過測試支援所有平台）

### Fix

- 顯示在 docker 上 web server port 無法使用的問題

## 1.0.1

### Features

- 顯示移動停損
- 儀表板右上角控制 light/dark 模式
- 另存儀表板至指定的路徑下

### Fix

- 修正 Windows 下 report 預設讀寫編碼為 cp950 造成的問題。
- 修正停損無法顯示
- Colab 中 CSS 字體與排版調整
- light/dark 模式中，圖表座標軸顏色響應
- 修正圖表記憶體沒有釋放，導致 tab 切換延遲的問題

## 1.0.0

### Features

- 新增 Position.from_report 的單元測試
- 在多種條件下測試 report.next_weights 功能
- 推出全新儀表板介面
- 支援 Python 3.12 版本

### Fix

- 修正了在啟用止損或止盈時，報告中 report.next_weights 的正規化問題
- 解決了在 Pandas 的 reindex 函數中，分類型欄位無法正確索引的問題
- 修正了在添加運算子時，分類型欄位繪圖錯誤的問題

## 0.5.13

### Features

- 整合 Pytest（提交 e7a487c）：加入了 Pytest，讓測試更高效。
- finlab.ml 日內交易報酬率計算（提交 8804fb1）：新增了計算日內交易的 label
- finlab.ml.feature.ta 特徵計算支持多進程（提交 1ab0463）：在特徵計算模組中引入多進程支持，提升性能。

### Fix

- 優化 'get_location' 函數（提交 253e98c）：改進了 'data.py' 中的 'get_location' 函數，使其更好地處理失敗情況。
- 市場信息支持時區（提交 aa2756b & 79b3671）：在 'market_info.py' 中加入了時區信息的處理。
- 移動停損修正（提交 6522bf7 & e7fc1f3）：調整了 'backtest.py' 中的交易計算，修正移動停損的功能。
- Dataframe 的導入修正（提交 626ada1）：修正了 'dataframe.py' 中的導入問題。
- 特徵初始化修正（提交 772d659）：解決了 'ml/feature.py' 中的初始化問題。
- 強制雲端下載（提交 7ec28a3）：修復了 'data.py' 中的 'force_cloud_download' 實現。

### Other updates

- 重構（提交 26d1518）：對 'online' 模組進行了重構，使代碼結構更好。
- 文檔更新（提交 44a93d4, 9f5683f, cd4a894）：更新了 'backtest.py'、'data.py' 和 'ml/feature.py' 的文檔。
- 版本更新（提交 d361d7f）：將版本升級到了 0.5.13。
- 增加測試覆蓋率（提交 350dfbc）：在 Docker 配置中增加了測試覆蓋率。
- 測試系統的穩健性（提交 1647479）：提升了測試系統的穩健性。
- 在線測試 `Position.to_list`（提交 f3d086f）：更新了 'online_test.py'，增加了轉換為列表的功能。

## 0.5.12

- 修正了 run_online_test.sh 中的在線測試更新價格，以包含 FUGLE 配置的環境變量。
- 調整了 online_test.py 中的 test_update_price，以正確比較浮點數量。
- 修改了 event_study.py，通過重新索引工作日使其與非交易日兼容。

## 0.5.11

- 修復 position 為零時，會報 error 的問題

## 0.5.10

- 永豐 API 下單大於 1000 元無法下單的問題
- 修正 `FinlabDataframe` 的 memory leak error
- 修正登入顯示的樣式，避免 colab 登入時出現 error
- 修正 `data.search` 的問題

### 0.5.9

- 修正 dataframe operator 運算時的 reshape 問題
- 改善 `df[bool_selector]` 無法使用的問題

## 0.5.8

- 改善 `data.get`速度
- 更新永豐 API 下單效率（然而引出一些問題，已經修復）

## 0.5.7 (2023-11-4)

### Fix 🚀

- `FinlabDataFrame`：若未設置則正確使用 UUID 修正了`__hash__`方法。
- `hold_until`方法：修正了`self`、`exit`和`rank`的`reindex`問題。
- `market_info.get_market_info`：更正了`reindex`邏輯，確保使用更新後的索引。
- `fetch_data`：修正了報告部分的日均計算錯誤。
- `data.py`：為 HTTP 請求添加了`User-Agent`標頭以防止取得錯誤。
- `data.py`：修正了保存空`DataFrame`的問題。
- `ffn_core.py`：修正了`calc_sharpe`方法中除以零的錯誤。

### Features 🚀

- `tools`: 新增 `finlab.tools.event_study` 研究事件交易等相關功能。
- `backtest.py`：引入了`fast_mode`，在不考慮止損或止盈的情況下進行快速回測。
- `dataframe.py`：將`index_str_to_date`方法進行了緩存，提高性能。
- `report.add_trade_info`：導入 Cython 優化運算速度。
- `setup.py`：編譯 Cython 擴展時啟用 O3 優化。
- `backtest.py`：為`sim`函數新增文檔，詳細說明新特性和參數。
- `dataframe.py`：實現了索引優化，將字符串索引轉換為日期並進行緩存。
- 調整`setup.py`，將 Python 版本要求從 >=3.7 改為 >=3.6。
- 更新子模組至最新提交。

### Tests 🚀

- 為`report_test.py`模塊新增測試，以保證查詢功能的正確性。
- 為`report_test.py`新增多個針對不同數據類型的測試案例。
- 更新`run_test_docker.sh`腳本，包含新的測試案例。

## 0.5.2 (2023-09-28)

### Fix 🚀

- 在少部分的 OS 上出現 recursive import 的問題
- 修正 liquility analysis 中產生 NaN 時，被 Pandas 暗自轉換成 float 造成的問題
- trade_at_price 修正
- 修正在嘗試 merge 過程中消耗大量記憶體的問題

## 0.5.0 (2023-09-14)

### Features 🚀

- 新增移動停損功能 `sim(..., trail_stop=0.1)` 來設定移動停損。
- `data.universe` 支援 `market='etf'` 另外，也可以選 ETF 的種類如：`domestic_etf`, `foreign_etf`, `leveraged_etf`, `vanilla_futures_etf`, `leveraged_futures_etf`
- `data.get` 支援從美國、台灣兩地更新資料，會自動選擇比較近的伺服器來索取資料。
- `data.get` 自動偵測並連結 Google Drive 來存放下載的資料。
- `data.get` 將全面支援在本地端更新資料，以後再也不用全面下載所有資料，而是下載 patch 並藉由本地端的程式來進行維護，只有在必要的時候進行整批資料的重置（預設開啟）
- `sim(..., trade_at_price)` 可選擇其他價格來模擬買賣，可選'close'、'open'、'open_close_avg'、'high_low_avg'或 'price_avg'。
- 新增底層功能以確保新的網站能夠兼容

### Fixes

- 修正做空的停損停利
- FinlabDataFrame.hold_until 現在輸出為 bool （而非以前的 int）
- FinlabDataFrame 更廣泛的支援自動 reshape 與填值的運算，例如「&=」、「+=」等目前已支援
- 移除了強制設置的 logger
- finlab.online 修正了獲取總餘額時的時區問題。
- data.FileStorage 解決了 Windows 系統上的文件路徑錯誤。
- ffn 移除即將不支援的語法，更新了 pandas2.1 間容的語法。
- 自動偵測 backtest(position) 中的 position.index 轉換為 datetime
- 解決 report.trades 太長上傳的問題
- 解決回測時上次出場的標的，這次不進場的錯誤

## 0.4.6 (2023-08-11)

### Fixes 🔧

- 修正優勢價格買賣(extra_bid_pct)在委託價格超過漲跌停價時的委託失敗問題，委託價以漲跌停為上限。
- 解決了下單 API 中 Position.from_report 停損停利部位判斷錯誤的問題。
- 解決了永豐 API 零股改價失敗問題，自動刪單再重下。
- 月營收索引改為 datetime 格式，解決 data.set_storage 模式下強制下載月營收資料的問題。
- 避免 finlab.dataframe.industry rank() 出現 nan 數值。

### Features 🚀

- 加入策略報籌率統計分析圖表功能 finlab.plot.StrategyReturnStats。
- Fugle 行情 API v1.0 版 相容 finlab.online，不相容 v0.3。 提醒用戶請將行情 API v0.3 版本升級至最新的 v1.0 版本，舊版本將被 Fugle 官方棄用，要注意在行情 API v1.0 版本中，採用了不同的身份驗證方式，因此 v0.3 的 API 金鑰將無法適用於 v1.0 的 HTTP API 和 WebSocket API。您需要重新申請 API 金鑰以使用最新版本的 API。請前往 金鑰申請頁面 進行申請 https://developer.fugle.tw/docs/key/%E3%80%82
- 新增下單 API 於「更新委託單價格」時支援優勢價格買賣(extra_bid_pct)的功能，以高於成交價的 x%買入，低於成交價的 x%賣出。

## 0.4.5 (2023-07-05)

### Fixes 🔧

- 解決了在 hold_until 中 rank 參數 inf 導致的排名功能失效問題。
- 修正了 alphalens 在 pandas 2.0 版本上的不相容問題。
- 解決了永豐 API 下單時，零股市價無法下單的問題，現在改成漲跌停下單。
- 針對 candle plot 的標題顯示位移問題進行了修正。
- 修正了 report.position 丟入 sim 後得到一致結果的問題。
- 解決了 edge ratio 時間序列排序問題，現在可以按時間順序排序。

### Features 🚀

- 加入 us_universe 選擇美股子產業的功能。
- 新增下單 API 支援優勢價格買賣的功能，現在可以以高於成交價的 x%買入，低於成交價的 x%賣出。

### Doc 📚

- 新增美股策略範例，提供用戶參考和學習。
- 新增在 data.indicator 中使用美股時的 market 參數說明，使用者可以更容易理解其使用方式。

## 0.4.3 (2023-05-11)

### Warnings: Backtesting result and performance will change.

### Features 🚀

- Improved RAM usage by removing sorting and swaplevel for machine learning features (e081c924).
- Optimized backtest report (8babbd7a).
- Implemented cross-validation for machine learning (e55828c0).
- support infomation for stop loss and take profit assets (5f9272f3).
- Hold_until functionality made available for US data (8437d62).
- Added indicators control in plot_stats (7364d58).

### Fixes 🔧

- Fixed deadline considering business date for DataFrame (312f2fe1).
- Fixed the issue where a float object had no attribute 'month' (d51a5901).
- Fixed run_all_test (6203f56f).
- Prevented deletion during map iteration in backtest_core (2d1d9b05).
- Fixed login info (d177ed47).
- Fixed alpha annualize estimation in analysis (26a8becf).
- Fixed issue with short selling in online module (919521b9).
- Synced win_ratio in maeMfeAnalysis (a9a31189).
- Added rotc deadline in DataFrame (ac10597).

### Refactoring 💡

- Refactored f_disclosure_date to_business_date, removed date too far, and improved speed (7dcb203b).
- Refactored market selection according to DataFrame columns (039cbc96).
- Fixed bugs and future warnings in the analysis module (ec93088f).
- Refactored environment name capitalization in login module (635caed4).
- Refactored login to use FINLAB_API_TOKEN (a5c9064d).
- Informed free users that data is limited (bbabad14).

### Tests 🧪

- Added test_hold_until (ccc4ba89).

### Doc 🗂️

- Updated daily_sortino documentation (b7d1d91d).
- Updated get_data documentation (276862c2).

## 0.4.2 (2023-04-27)

### 新增功能：

- 在機器學習中加入了標籤交易價格的功能
- 在報告中新增了 report.display() 的使用說明
- 在市場資訊中新增了美國市場資訊

### 修復問題：

- 在線上程式中修正了顯示字串的問題
- 將回測功能回復到穩定版本
- 調整回測功能中根據進出場價格調整持倉的問題
- 修正 qlib.init 的偵測問題
- 在報告中修正了基準指數時區的問題
- 處理了 pandas 2.0.0 版本兼容性問題
- 處理了 talib 依賴性問題
- 修正了在回測功能中進出場比例為 nan 的問題
- 在文檔中修正了 fugle Account numpy 的引用問題

### 其他：

- 在機器學習中新增了相關文件
- 在市場資訊中新增了相關文件

## 0.4.1 (2023-04-14)

- (fix): fugle np not found

## 0.3.19 (2023-04-04)

- (improve): memory usage in machine learning feature creation
- (improve): machine learning feature for different freqnecy index
- (fix): data.indicator support almost all talib functions
- (fix): 2023/4/10 monthly revenue reveal change to 2023/4/12
- (fix): sinopac calculate account balance

## 0.3.18 (2023-03-28)

- (Breaking): update shioaji >= 1.0.0. Please refer to finlab.inline module
- (feat): finlab.ml (document are not ready yet)
- (feat): support qlib data
- (feat): report add yearly and monthly return table
- (fix): backtest entry exit signal both activate conflict

## 0.3.12 (2022-11-29)

- (Breaking): report.get_stats() has new format
- (feat): data.get now read expire date from server and update data dynamically
- (feat): add a bunch of analysis for backtesting report
- (feat): getpass password to hide api_token
- (fix): report.weight and report.next_weights remove considering of price changed
- (fix): backtest(..., resample_offset='10d') fix backtesting display date
- (fix): finlab.online.order_executor show_alerting_stocks fix price
- (fix): fugle order status not change even when it is filled
- (fix): support update price of fraction lot size

## 0.3.11 (2022-11-10)

- (Fix) finlab backtest asset shorting fee miner adjust
- (Fix) finlab.report.weights and finlab.report.next_weights not defined
- (Fix) fugle-trade remove flag accoding to 0.4.0
- (Fix) fugle-trade fetch other source when stock.close is nan
- (Fix) fugle-trade FugleAccount.get_position not latest position
- (Feat) finlab.data.universe('STOCK_FUTURE') subset of TWII stocks
- (Feat) add yearly return when upload report
- (Feat) add fugle_trade version not compatable warning

## 0.3.10 (2022-10-13)

## 0.3.9 (2022-10-13)

- (Fix) finlab.online.sinopac_account order_lot position zero
- (Fix) finlab.online.fugle_account order_lot position duplicated
- (Fix) finlab.backtest weight display remove normalized
- (Fix) finlab.data windows FileStorage fix
- (Fix) finlab.data indicator exception error

## 0.3.8 (2022-9-27)

- (Fix) finlab.online.order_executor price +-10% limit order restricted
- (Fix) finlab.online.order_executor Position.from_report handle price=0, weight=0, and duplicated stock id
- (Fix) finlab.plot.StrategySunburst compatibility
- (Fix) finlab.report.display display multiple chart

## 0.3.8.dev1 (2022-9-27)

- (Fix) talib abstract module incompatible
- (Fix) backtest result: alpha and beta
- (Fix) finlab.online.panel
- (Fix) finlab.online.fugle_account stock not traded error
- (Fix) add cert custom password for sinopac
- (Fix) remove duplicated columns from unnumeric_dtype.
- (Fix) KY company disclosure deadline
- (Chore) Candlestick data format generalized
- (Chore) raise error when data.get not found
- (Chore) logger.info to logger.warning in finlab.data
- (Chore) fig return for report.display
- (Feat) add retain_cost_when_rebalance flag

## 0.3.7.dev1 (2022-8-8)

- 針對 touched_exit 做更細部的回測：
  1. 原本觸價反彈後不會被列入觸價賣出，現在會模擬觸價賣出
  2. 原本開盤跳空，會沒辦法賣在 0.07，現在也會賣在更低的位置

## 0.3.5.dev (2022-7-18)

- 新增 finlab.optimize 枚舉條件組合回測
- 新增 mae_mfe 圖表
- mae_mfe 做空分析
- report.get_trades()['position'] 改成 weighting
- backtest touched_exit 修正
- 修復 finlab.analysis bugs

## 0.3.3.dev (2022-7-1)

### Bugs 修正

- 修正放空股票的 weight 權重顯示問題
- TreeMap 繪圖修正
- 財報公佈歷史時間修正

### Analysis 分析回測結果

新增 Analysis 架構，可以將回測結果完整分析。
之後的分析都將繼承 Analysis 並且顯示圖表，讓 report 使用起來更豐富！

#### liquidityAnalysis 流動性測試

策略會模擬股票在收盤或開盤價買進賣出，但實際上，股票也有可能沒辦法順利交易，例如遇到處置股、全額交割股，或是長跌停板。
liquidityAnalysis 會檢測回測時，是否有買到這類行的標的，並且計算比例，已確保策略的流動性符合您的資金需求。
查看更詳細的教學文章。

```py
report.run_analysis('LiquidityAnalysis')
```

#### inequalityAnalysis 不等式測試

原本已經有策略，想要額外加入其他技術指標、籌碼、獲利指標，可以透過 inequalityAnalaysis 來檢視是否能夠提高選股績效。
以股價淨值比而言，我們想觀察以股價淨值比來進一步篩選股票的績效，可以用以下的方式：

```py
report.run_analysis('InequalityAnalysis', name='price_earning_ratio:股價淨值比')
```

要如何看結果，可以參考更詳細的教學文章。

## 0.3.2.dev (2022-6-23)

### SunBurst 檢視策略部位

可以顯示當前的股票，有哪些產業，產業的偏重是哪一塊，查看[詳細內容](https://www.finlab.tw/plotly-sunburst輕鬆監控多策略部位dashboard製作教學5/)！

### 做空以及個股權重

FinLab Package 終於支援做空了，假如你原本就有一個好策略，可以做空 0050 試試看，雖然報酬率可以能會下降，但是風險也會大幅縮小！非常適合我們做多檔股票資產配置使用。

另外值得一提的是，新的版本 position 除了以前的布林訊號 (True/False) 外，也可以使用權重！所以下方程式碼，就是 50% 比重給 2330 做多，50% 給 1101 做空。

這樣的權重分配方式，完全兼容之前的版本，也就是 position 是 True / False 的狀況，因為 True 在電腦運算中，本來就代表 1 ，而 False 代表 0。權重都是 1 的情況下，程式就會跟以前一樣平均分配資產喔。

```py
from finlab import data
from finlab import backtest

close = data.get('price:收盤價')

position = close < 0
position['2330'] = 0.5
position['1101'] = -0.5

r = backtest.sim(position)
r.display()
```

### 支援 Pandas_ta 計算技術指標

Pandas_ta 最近一兩年算是計算技術指標的後起之秀，原因在於 TaLib 有時候實太難安裝了，而且技術指標就只有那 100 個，都是老調重彈，沒有更新。有鑒於此，Pandas_ta 採用純 Pandas 計算技術指標，跟不同的作業系統有比較好的相容性。另外，Pandas_ta 也有很多最新的技術指標，例如 supertrend indicator。有非常多沒有看過的指標，像是「Even Better Sinewave 」，聽起來實在是非常有趣呀！這些都可以在 [Pandas_ta](https://twopirllc.github.io/pandas-ta/#indicators-by-category) 文檔中找到。

```py
from finlab import data

values = data.indicator('supertrend')
```
