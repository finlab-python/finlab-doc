# finlab.data

## 全域變數
finlab.data 會自行判斷是否使用本地端資料，若要強制使用雲端資料，可以設定以下變數：
```py
from finlab import data
data.force_cloud_download = False
```

若要強制使用本地端資料，可以設定以下變數：
```py
data.use_local_data_only = False
```

讀取資料時，可以設定以下變數，來限制讀取的資料範圍：
```py
data.truncate_start = '2019-01-01'
data.truncate_end = '2020-01-01'
```

::: finlab.data.get
::: finlab.data.indicator
::: finlab.data.universe
::: finlab.data.us_universe
::: finlab.data.set_storage
::: finlab.data.CacheStorage
::: finlab.data.FileStorage
::: finlab.data.get_strategies
::: finlab.data.search