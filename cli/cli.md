---
hide:
  - navigation
---

# FinLab 的指令列介面（CLI）。

此 CLI 提供多種命令來管理 FinLab 環境，包括身份驗證、券商管理、筆記本操作、投資組合管理和排程任務。主命令群組 (cli) 是所有子命令和子群組的進入點。

!!! warning "尚在測試"

    目前此功能為 Alpha 階段，可能會有錯誤或不穩定的情況。請小心使用。
    如有任何問題，請至 [Discord](https://discord.gg/tAr4ysPqvR) 上提出問題，我們將盡快來修正。

## 快速設定

1. 安裝 FinLab CLI：

    ```bash
    pip install "finlab[cli]"
    ```

2. 初始化 FinLab 環境：

    ```bash
    finlab init
    ```



## 指令介紹

### finlab init 

初始化 FinLab 環境和工作區。

此命令執行初始化設置，以使 FinLab 環境正常運行。包括以下步驟：

- 創建工作區目錄：建立用於存儲所有必要文件和配置的目錄結構。

- 創建環境配置：從 FinLab 資源讀取環境配置（env.yml）並寫入工作區目錄。

- 創建並設置 Conda 環境：刪除任何現有名為 'finlab-env' 的 Conda 環境，並根據環境配置文件創建一個新的環境。

- 安裝 Jupyter Lab：在新創建的環境中安裝 Jupyter Lab，以啟用互動式筆記本操作。


用法:


```csharp
finlab init
```

### finlab auth

FinLab 的身份驗證操作。

此命令群組處理用戶身份驗證任務，包括登錄和登出操作。此群組中的命令通過管理用戶憑證和會話資訊來確保對 FinLab 資源的安全訪問。

#### finlab auth login 

登錄 FinLab。

用法:


```css
finlab auth login
```



#### finlab auth logout 

登出 FinLab。

用法:


```bash
finlab auth logout
```

### finlab broker 

管理 FinLab 中券商帳戶的操作。

此命令群組包括添加、列出、測試和移除券商帳戶的命令。它允許用戶管理他們的券商整合，並執行必要的操作，以確保 FinLab 與他們的券商帳戶之間的無縫通信。


#### finlab broker add 

添加券商帳戶。

用法:


```css
finlab broker add [選項] [自訂名稱]
```

選項:


| 名稱 | 類型 | 描述 | 預設 | 
| --- | --- | --- | --- | 
| --broker | text | 為 `sinopac` 或 `fugle` | None | 

#### finlab broker list 

列出所有券商。

用法:


```css
finlab broker list
```

#### finlab broker remove 

移除券商帳戶。

用法:


```css
finlab broker remove [名稱]
```


#### finlab broker test 

測試所有券商。

用法:


```bash
finlab broker test
```

### finlab nb 

FinLab 的筆記本操作。

此命令群組包括管理 FinLab 環境中 Jupyter 筆記本的命令。用戶可以從雲端拉取筆記本、將本地筆記本推送到雲端、在 Jupyter Lab 中打開筆記本、移除筆記本和執行筆記本。


#### finlab nb jupyter 

使用指定的筆記本打開 Jupyter Lab。

用法:


```css
finlab nb jupyter 策略名稱
```

#### finlab nb pull 

從雲端下載筆記本

用法:


```css
finlab nb pull 策略名稱
```

#### finlab nb push 

將筆記本上傳到雲端並覆蓋現有的。

用法:


```css
finlab nb push 策略名稱
```

#### finlab nb remove 

移除指定的筆記本。

用法:


```arduino
finlab nb remove 策略名稱
```

#### finlab nb run 

執行指定的筆記本。

用法:


```arduino
finlab nb run 策略名稱
```

### finlab pm 

FinLab 的投資組合管理操作。

此命令群組包括管理與券商帳戶同步的投資組合的命令。用戶可以創建新的投資組合、更新現有投資組合、檢查投資組合的狀態以及將投資組合與他們的券商帳戶同步。


#### finlab pm create 

根據給定的策略權重創建投資組合。

用法:


```css
finlab pm create [投組名稱] [權重]... [選項]
```

選項:


| 名稱 | 類型 | 描述 | 預設 | 
| --- | --- | --- | --- | 
| --name | text | 投資組合管理者名稱 | default | 
| --total_balance | integer | 總資產 | 0 | 
| --rebalance_safety_weight | float | 重新平衡安全權重 | 0.2 | 
| --smooth_transition | boolean | 平滑過渡 | True | 
| --force_override_difference | boolean | 強制覆蓋差異 | False | 
| --margin_trading | boolean | 保證金交易 | False | 

範例：

```
finlab pm create 多元投資 價值策略 0.5 動量策略 0.5 --total_balance 1000000 
```

上述命令將創建一個名為 '多元投資' 的投資組合，其中包含兩個策略：'價值策略' 和 '動量策略'，權重分別為 0.5。此外，總資產為 100 萬元。


#### finlab pm status 

顯示投資組合狀態。

用法:


```css
finlab pm status [投組名稱]
```

#### finlab pm sync 

將投資組合與券商帳戶同步，在第一次同步時，需要指定券商帳號。

用法:


```css
finlab pm sync [選項] [投組名稱]
```

選項:


| 名稱 | 類型 | 描述 | 預設 | 
| --- | --- | --- | --- | 
| --broker | text | 要同步的券商名稱 | None | 

#### finlab pm update 

更新指定名稱的投資組合。

用法:


```css
finlab pm update [投組名稱]
```

### finlab schedule 

FinLab 的排程任務。

此命令群組包括為 FinLab 設定自動操作的命令。用戶可以排程筆記本執行和投資組合同步、列出所有排程任務，並移除特定排程任務。


#### finlab schedule list 

列出所有排程。

用法:


```css
finlab schedule list
```

#### finlab schedule nb 

排程在特定時間執行筆記本。

用法:


```css
finlab schedule nb [策略名稱] [時間]...
```

例如：
```
finlab schedule nb 策略名稱 08:00 20:00 00:00
```

上述命令將在每天的 8:00、20:00 和 0:00 執行名為 '策略名稱' 的筆記本。

#### finlab schedule pm 

排程在特定時間同步投資組合。

用法:


```css
finlab schedule pm [投組名稱] [時間]...
```

例如：
```
finlab schedule pm 多元投資 08:00 20:00 00:00
```

上述命令將在每天的 8:00、20:00 和 0:00 同步名為 '多元投資' 的投資組合。

#### finlab schedule remove 

移除排程。

用法:


```arduino
finlab schedule remove {nb|pm} 名稱
```

名稱可以是筆記本名稱或投資組合名稱。

#### finlab schedule run 

執行所有排程。

用法:


```arduino
finlab schedule run
```